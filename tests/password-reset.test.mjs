import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import nextServer from 'next/server.js';

function load(file,dependencies={}) {
  const exported={};
  vm.compileFunction(ts.transpileModule(readFileSync(new URL('../'+file,import.meta.url),'utf8'),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true},
  }).outputText,['exports','require'])(exported,name=>{assert.ok(Object.hasOwn(dependencies,name),'Unexpected dependency '+name);return dependencies[name];});
  return exported;
}
const {resolvePasswordResetTarget:resolve}=load('src/lib/password-reset-target.ts',{'server-only':{}});
const notFound=()=>Object.assign(new Error('not found'),{code:'auth/user-not-found'});
const passwordUser=(email='student@example.test',extra={})=>({uid:'student',email,disabled:false,providerData:[{providerId:'password',email}],...extra});
const virtualUser=(extra={})=>passwordUser('student@knobly.id',{providerData:[{providerId:'password',email:'student@knobly.id'},
  {providerId:'google.com',email:'student@example.test'}],...extra});
function harness({direct,candidates=[],users={},lookupError,queryError}={}) {
  const calls=[];
  return {calls,auth:{async getUserByEmail(email){calls.push(['auth-email',email]);if(lookupError)throw lookupError;if(direct)return direct;throw notFound();},
    async getUser(uid){calls.push(['auth-uid',uid]);if(users[uid])return users[uid];throw notFound();}},
  db:{collection(name){assert.equal(name,'profiles');calls.push(['collection',name]);const query={
    where(field,operator,email){assert.equal(field,'email');assert.equal(operator,'==');calls.push(['hint-email',email]);return query;},
    limit(count){assert.equal(count,10);return query;},select(...fields){assert.equal(fields.length,0);return query;},
    async get(){if(queryError)throw queryError;return {docs:candidates.map(id=>({id,data(){assert.fail('Profile fields must not authorize recovery');}}))};},
  };return query;}}};
}
test('normal password reset uses the canonical Auth address',async()=>{
  const h=harness({direct:passwordUser()});
  assert.deepEqual(await resolve(' STUDENT@example.test ',h.auth,h.db),{targetEmail:'student@example.test',deliveryEmail:'student@example.test',virtual:false});
  assert.equal(h.calls.length,1);
});
test('virtual reset ignores username mappings and uses the linked Google provider address',async()=>{
  const h=harness({direct:virtualUser()});
  assert.deepEqual(await resolve('student@knobly.id',h.auth,h.db),{targetEmail:'student@knobly.id',deliveryEmail:'student@example.test',virtual:true});
  assert.equal(h.calls.length,1);
});
for(const [name,user] of [
  ['disabled',passwordUser(undefined,{disabled:true})],
  ['Google-only',passwordUser(undefined,{providerData:[{providerId:'google.com',email:'student@example.test'}]})],
  ['virtual without trusted recovery provider',passwordUser('student@knobly.id')],
  ['virtual with virtual recovery address',virtualUser({providerData:[{providerId:'password'},{providerId:'google.com',email:'other@knobly.id'}]})],
  ['virtual with malformed recovery address',virtualUser({providerData:[{providerId:'password'},{providerId:'google.com',email:'bad-address'}]})],
]) test(name+' does not send a reset',async()=>{const h=harness({direct:user});assert.equal(await resolve(user.email,h.auth,h.db),null);});
test('missing virtual account fails closed without consulting mutable mappings',async()=>{
  const h=harness();assert.equal(await resolve('missing@knobly.id',h.auth,h.db),null);assert.equal(h.calls.length,1);
});
test('legacy real-email alias is confirmed against Auth provider data and canonical virtual email',async()=>{
  const h=harness({candidates:['stale','student'],users:{student:virtualUser()}});
  assert.deepEqual(await resolve('student@example.test',h.auth,h.db),{targetEmail:'student@knobly.id',deliveryEmail:'student@example.test',virtual:true});
});
test('poisoned profile email and UID hint cannot select another account recovery channel',async()=>{
  const h=harness({candidates:['attacker'],users:{attacker:virtualUser({uid:'attacker',email:'attacker@knobly.id',providerData:[
    {providerId:'password'},{providerId:'google.com',email:'attacker@example.test'}]})}});
  assert.equal(await resolve('victim@example.test',h.auth,h.db),null);
});
test('poisoned first hint does not hide a later valid candidate within the lookup bound',async()=>{
  const h=harness({candidates:['attacker','student'],users:{attacker:passwordUser('attacker@example.test'),student:virtualUser()}});
  assert.equal((await resolve('student@example.test',h.auth,h.db)).deliveryEmail,'student@example.test');
});
for(const options of [{lookupError:new Error('Auth outage')},{queryError:new Error('Firestore outage')}]) {
  test('dependency outage never fabricates a recovery destination',async()=>{
    const h=harness(options);await assert.rejects(resolve('student@example.test',h.auth,h.db));
  });
}

function routeHarness({target=null,resolver,limited=false,resolveError,mailError}={}) {
  const mail=[];
  const auth={},db={};
  const {POST}=load('src/app/api/auth/forgot-password/route.ts',{
    'next/server':nextServer,'@/lib/firebase-admin':{getAdminAuth:()=>auth,getAdminDb:()=>db},
    '@/lib/rate-limit':{rateLimitAuth:()=>({success:!limited,message:'limited'})},
    '@/lib/password-reset-target':{resolvePasswordResetTarget:resolver ?? (async()=>{if(resolveError)throw resolveError;return target;})},
    '@/lib/email-service':{sendPasswordResetMail:async(...args)=>{if(mailError)throw mailError;mail.push(['normal',...args]);},
      sendPasswordResetMailForKnoblyId:async(...args)=>{if(mailError)throw mailError;mail.push(['virtual',...args]);}},
  });return {POST,mail,auth,db};
}
const request=body=>new nextServer.NextRequest('http://localhost/api/auth/forgot-password',{
  method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),
});
for(const body of [null,{}, {email:5},{email:'bad'},{email:'a'.repeat(321)+'@example.test'}]) {
  test('invalid body has no recovery side effects: '+JSON.stringify(body).slice(0,50),async()=>{
    const h=routeHarness();assert.equal((await h.POST(request(body))).status,400);assert.deepEqual(h.mail,[]);
  });
}
test('malformed JSON returns 400',async()=>{
  const h=routeHarness();const req=new nextServer.NextRequest('http://localhost/api/auth/forgot-password',{method:'POST',body:'{'});
  assert.equal((await h.POST(req)).status,400);
});
test('rate limited request never reaches recovery lookup or delivery',async()=>{
  const h=routeHarness({limited:true,resolver:()=>assert.fail('No resolver call')});assert.equal((await h.POST(request({email:'student@example.test'}))).status,429);
});
test('unknown and supported accounts have the same generic public response',async()=>{
  const unknown=routeHarness(),known=routeHarness({target:{targetEmail:'student@example.test',deliveryEmail:'student@example.test',virtual:false}});
  const a=await unknown.POST(request({email:'missing@example.test'})),b=await known.POST(request({email:'student@example.test'}));
  assert.equal(a.status,200);assert.equal(b.status,200);assert.deepEqual(await a.json(),await b.json());
  assert.equal(b.headers.get('Cache-Control'),'no-store');assert.deepEqual(known.mail,[['normal','student@example.test']]);
});
test('virtual route delivers only the resolver-approved Auth identity pair',async()=>{
  const h=routeHarness({target:{targetEmail:'student@knobly.id',deliveryEmail:'student@example.test',virtual:true}});
  assert.equal((await h.POST(request({email:'student@knobly.id'}))).status,200);
  assert.deepEqual(h.mail,[['virtual','student@knobly.id','student@example.test']]);
});
for(const fault of [{resolveError:new Error('secret-account-detail')},{mailError:new Error('secret-token'),target:{targetEmail:'student@example.test',virtual:false}}]) {
  test('failed recovery returns a generic unavailable response',async()=>{
    const h=routeHarness(fault),response=await h.POST(request({email:'student@example.test'}));
    assert.equal(response.status,503);assert.ok(!(await response.text()).includes('secret'));
  });
}
