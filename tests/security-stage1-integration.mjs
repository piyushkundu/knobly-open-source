import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import * as jsxRuntime from 'react/jsx-runtime';
import nextServer from 'next/server.js';
import {DEMO_PROJECT,AUTH_HOST,FIRESTORE_HOST} from './start-firebase-emulators.mjs';

assert.equal(process.env.GCLOUD_PROJECT,DEMO_PROJECT);
assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,AUTH_HOST);
assert.equal(process.env.FIRESTORE_EMULATOR_HOST,FIRESTORE_HOST);
assert.equal(process.env.FIREBASE_TRUSTED_ADMIN_UIDS,'trusted-admin-stage1');
for(const key of ['VERCEL','GOOGLE_APPLICATION_CREDENTIALS','FIREBASE_SERVICE_ACCOUNT_JSON','FIREBASE_ADMIN_PRIVATE_KEY'])assert.ok(!process.env[key]);
const [appSdk,authSdk,store,adminApps,adminAuthSdk,adminStoreSdk]=await Promise.all([
  import('firebase/app'),import('firebase/auth'),import('firebase/firestore'),import('firebase-admin/app'),import('firebase-admin/auth'),import('firebase-admin/firestore'),
]);
const adminApp=adminApps.initializeApp({projectId:DEMO_PROJECT});
const adminAuth=adminAuthSdk.getAuth(adminApp),adminDb=adminStoreSdk.getFirestore(adminApp);
const app=appSdk.initializeApp({apiKey:'emulator-only-api-key',projectId:DEMO_PROJECT,appId:'emulator-only-app'});
const auth=authSdk.getAuth(app);authSdk.connectAuthEmulator(auth,'http://'+AUTH_HOST,{disableWarnings:true});
const db=store.initializeFirestore(app,{ignoreUndefinedProperties:true});store.connectFirestoreEmulator(db,'127.0.0.1',18080);
async function load(file,dependencies={},globals={}){
  const exported={};const scope={exports:exported,console,Request,Response,Headers,
    require:name=>{assert.ok(Object.hasOwn(dependencies,name),'Unexpected dependency '+name);return dependencies[name];},...globals};
  vm.compileFunction(ts.transpileModule(await readFile(new URL('../'+file,import.meta.url),'utf8'),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},
  }).outputText,Object.keys(scope))(...Object.values(scope));return exported;
}
const adminModule={getAdminAuth:()=>adminAuth,getAdminDb:()=>adminDb};
const {requireAdmin}=await load('src/lib/admin-api-auth.ts',{'server-only':{},'next/server':nextServer,'@/lib/firebase-admin':adminModule});
const {resolvePasswordResetTarget}=await load('src/lib/password-reset-target.ts',{'server-only':{}});
const mail=[];
const reset=await load('src/app/api/auth/forgot-password/route.ts',{
  'next/server':nextServer,'@/lib/firebase-admin':adminModule,'@/lib/rate-limit':{rateLimitAuth:()=>({success:true})},
  '@/lib/password-reset-target':{resolvePasswordResetTarget},'@/lib/email-service':{
    sendPasswordResetMail:async email=>{mail.push({target:email,destination:email});},
    sendPasswordResetMailForKnoblyId:async(target,destination)=>{mail.push({target,destination});},
  },
});
const react={createContext:()=>({Provider:'TestProvider'}),useContext:()=>null,useEffect(){},
  useState:initial=>[typeof initial==='function'?initial():initial,()=>{}]};
const context=await load('src/context/AuthContext.tsx',{
  react,'react/jsx-runtime':jsxRuntime,'firebase/auth':authSdk,'firebase/firestore':store,'@/lib/firebase':{auth,db},
},{fetch:async()=>Response.json({localOnly:true})});
const callbacks=context.AuthProvider({children:null}).props.value;
const password='EmulatorOnly123!',email='stage1-student@example.test',trustedUid='trusted-admin-stage1';
const results=[];
const check=async(name,action)=>{await action();results.push({name,passed:true});console.log('PASS '+name);};
const denied=promise=>assert.rejects(promise,error=>error.code==='permission-denied');
const adminRequest=token=>new Request('http://127.0.0.1/api/admin-delete',{headers:{Authorization:'Bearer '+token}});
const resetRequest=email=>new nextServer.NextRequest('http://127.0.0.1/api/auth/forgot-password',{
  method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email}),
});
let student;
try{
  await adminAuth.createUser({uid:trustedUid,email:'stage1-admin@example.test',password,emailVerified:true});
  await adminDb.doc('users/'+trustedUid).set({isAdmin:false});
  await adminDb.doc('profiles/'+trustedUid).set({role:'admin'});
  await check('actual signup and verified login remain compatible with Stage 1 rules',async()=>{
    await callbacks.signup(email,password,'Stage 1 Student','stage1_student','');
    student=await adminAuth.getUserByEmail(email);assert.equal(auth.currentUser,null);
    assert.equal((await adminDb.doc('users/'+student.uid).get()).data().isAdmin,false);
    assert.equal((await adminDb.doc('profiles/'+student.uid).get()).data().role,'user');
    await adminAuth.updateUser(student.uid,{emailVerified:true});await callbacks.login(email,password);
    assert.equal(auth.currentUser.uid,student.uid);
  });
  await check('student cannot assign either admin field',async()=>{
    await denied(store.updateDoc(store.doc(db,'users',student.uid),{isAdmin:true}));
    await denied(store.updateDoc(store.doc(db,'profiles',student.uid),{role:'admin'}));
  });
  await check('new profile cannot be recreated with admin role',async()=>{
    await adminDb.doc('profiles/'+student.uid).delete();
    await denied(store.setDoc(store.doc(db,'profiles',student.uid),{role:'admin'}));
    await store.setDoc(store.doc(db,'profiles',student.uid),{role:'user',email});
  });
  await check('actual saved-code callbacks persist and reload without changing privilege fields',async()=>{
    const cells=[];let cursor=0;
    const hook=await load('src/hooks/useSavedCodes.ts',{
      react:{useEffect(){},useCallback:fn=>fn,useState(initial){const i=cursor++;if(!(i in cells))cells[i]=initial;return[cells[i],value=>{cells[i]=value;}];}},
      'firebase/firestore':store,'@/lib/firebase':{db},'@/context/AuthContext':{useAuth:()=>({user:auth.currentUser})},
    },{crypto:{randomUUID:()=> 'stage1-code'}});
    const saved=()=>{cursor=0;return hook.useSavedCodes();};
    const code=await saved().saveCode('Stage 1','print(5)','','5');assert.ok(code);
    await saved().loadCodes();assert.equal(saved().codes[0].code,'print(5)');
    assert.equal((await adminDb.doc('users/'+student.uid).get()).data().isAdmin,false);
  });
  await check('legacy forged role flags cannot authorize the server helper or edits to another profile',async()=>{
    await adminDb.doc('users/'+student.uid).update({isAdmin:true});
    await adminDb.doc('profiles/'+student.uid).update({role:'admin'});
    assert.equal((await requireAdmin(adminRequest(await auth.currentUser.getIdToken(true)))).status,403);
    await denied(store.updateDoc(store.doc(db,'profiles',trustedUid),{role:'user'}));
    await adminDb.doc('users/'+student.uid).update({isAdmin:false});await adminDb.doc('profiles/'+student.uid).update({role:'user'});
  });
  await check('owner may create a valid username binding but cannot alter its UID or email',async()=>{
    const ref=store.doc(db,'usernames','stage1_student');
    await store.setDoc(ref,{uid:student.uid,email:'stage1_student@knobly.id'});
    await denied(store.updateDoc(ref,{uid:trustedUid}));await denied(store.updateDoc(ref,{email:'someone@example.test'}));
  });
  const victim=await adminAuth.createUser({email:'stage1_victim@knobly.id',password,emailVerified:true});
  await adminAuth.updateUser(victim.uid,{providerToLink:{providerId:'google.com',uid:'dummy-google-victim',email:'victim@example.test'}});
  await adminDb.doc('profiles/'+victim.uid).set({role:'user',email:'victim@example.test',knobly_user_id:'stage1_victim'});
  await adminDb.doc('usernames/stage1_victim').set({uid:victim.uid,email:'stage1_victim@knobly.id'});
  await check('student cannot replace another account username mapping',async()=>{
    await denied(store.updateDoc(store.doc(db,'usernames','stage1_victim'),{uid:student.uid}));
  });
  await check('pre-existing poisoned mapping cannot redirect the actual reset route',async()=>{
    await adminDb.doc('usernames/stage1_victim').update({uid:student.uid});
    mail.length=0;assert.equal((await reset.POST(resetRequest('stage1_victim@knobly.id'))).status,200);
    assert.deepEqual(mail,[{target:'stage1_victim@knobly.id',destination:'victim@example.test'}]);
  });
  await check('real Google alias still resolves to its canonical virtual password account',async()=>{
    await adminDb.doc('profiles/'+student.uid).update({email:'victim@example.test',knobly_user_id:'stage1_victim'});
    mail.length=0;assert.equal((await reset.POST(resetRequest('victim@example.test'))).status,200);
    assert.deepEqual(mail,[{target:'stage1_victim@knobly.id',destination:'victim@example.test'}]);
  });
  await check('virtual account without trusted Google recovery channel fails closed',async()=>{
    const legacy=await adminAuth.createUser({email:'stage1_legacy@knobly.id',password});
    await adminDb.doc('profiles/'+legacy.uid).set({role:'user',email:'attacker@example.test'});
    mail.length=0;assert.equal((await reset.POST(resetRequest('stage1_legacy@knobly.id'))).status,200);assert.deepEqual(mail,[]);
  });
  await check('existing User ID/password login still reaches the correct account',async()=>{
    await callbacks.logout();await callbacks.loginWithUserId('stage1_victim',password);
    assert.equal(auth.currentUser.uid,victim.uid);
  });
  await check('owner-confirmed admin UID with existing profile role retains server access',async()=>{
    await authSdk.signInWithEmailAndPassword(auth,'stage1-admin@example.test',password);
    assert.equal(await requireAdmin(adminRequest(await auth.currentUser.getIdToken(true))),null);
    assert.equal((await adminDb.doc('profiles/'+trustedUid).get()).data().role,'admin');
  });
  await writeFile(process.argv[process.argv.indexOf('--out')+1],JSON.stringify({generatedAt:new Date().toISOString(),
    project:DEMO_PROJECT,checks:results.length,results,productionWrites:false,
    mailAndResetTokenGeneration:'mocked; no email sent or reset token generated',
    rulesScope:['2','3'].includes(process.env.FIREBASE_RULES_TEST_STAGE)
      ? 'Stage 1 compatibility suite exercised under Stage '+process.env.FIREBASE_RULES_TEST_STAGE+' rules'
      : 'Stage 1 draft: broader P1 cross-user/shared-content grants remain unchanged'},null,2));
}finally{
  await authSdk.signOut(auth);await store.terminate(db);await appSdk.deleteApp(app);await adminApps.deleteApp(adminApp);
}
