import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import nextServer from 'next/server.js';

function load(file, dependencies = {}, globals = {}) {
  const exports = {};
  vm.compileFunction(ts.transpileModule(readFileSync(new URL('../'+file,import.meta.url),'utf8'),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
  }).outputText,['exports','require','Request','Response','Headers','Buffer','console',...Object.keys(globals)])(
    exports,name=>{assert.ok(Object.hasOwn(dependencies,name),'Unexpected dependency '+name);return dependencies[name];},
    Request,Response,Headers,Buffer,console,...Object.values(globals));
  return exports;
}
const grading = load('src/lib/exam-grading.ts');
const command = extra => ({action:'submit',attemptId:'attempt',answers:{q:{option_id:'a',short_answer:null}},revision:1,...extra});
for (const [label,value] of [
  ['foreign uid',command({uid:'victim'})],['client score',command({score:999})],['client XP',command({xp_earned:999})],
  ['client clock',command({submitted_at:'yesterday'})],['unknown action',{action:'award'}],['invalid path',command({attemptId:'a/b'})],
  ['prototype identifier',command({attemptId:'__proto__'})],['negative revision',command({revision:-1})],
  ['float revision',command({revision:1.5})],['huge revision',command({revision:2147483648})],['missing answers',command({answers:null})],
  ['unknown answer fields',command({answers:{q:{option_id:'a',is_correct:true}}})],
  ['mixed answer types',command({answers:{q:{option_id:'a',short_answer:'text'}}})],
  ['oversized text',command({answers:{q:{short_answer:'x'.repeat(2001)}}})],
  ['invalid status',command({type:'IN_PROGRESS'})],['short start key',{action:'start',testId:'exam',requestId:'small'}],
]) test('exam input rejects '+label,()=>assert.throws(()=>grading.parseExamCommand(value),e=>e.status===400));

test('strict exam commands accept legitimate load/start/save/submit/review and bounded answer payloads',()=>{
  for(const value of [{action:'load',testId:'exam'},{action:'start',testId:'exam',requestId:'12345678-12345678'},
    {action:'review',attemptId:'attempt'},command(),command({action:'save'}),{action:'legacy-list'}]) assert.equal(grading.parseExamCommand(value).action,value.action);
});
const info={id:'exam',title:'Exam',duration_minutes:10,xp_reward:30};
const questions=[{id:'q',question_type:'MCQ',question_text:'Q',marks:1,explanation:'private answer',exam_options:[
  {id:'a',option_text:'A',is_correct:true},{id:'b',option_text:'B',is_correct:false}]},
  {id:'short',question_type:'SHORT',question_text:'S',marks:1,explanation:'private rubric',exam_options:[]}];
test('only server keys determine grading; written answers remain ungraded rather than receiving invented credit',()=>{
  const result=grading.grade(info,questions,{q:{option_id:'a',short_answer:null},short:{option_id:null,short_answer:'text'}},'SUBMITTED');
  assert.deepEqual(result,{score:1,total:2,accuracy:50,pointsEarned:15,xpAwarded:0,statusType:'SUBMITTED',correctCount:1,wrongCount:1,skippedCount:0});
});
test('public question projection strips correctness/explanation even when arbitrary server fields exist',()=>{
  const publicData=grading.publicExam(info,questions.map(q=>({...q,private_key:'secret'})));
  for(const secret of ['is_correct','explanation','private answer','private rubric','private_key']) assert.ok(!JSON.stringify(publicData).includes(secret));
});
test('answer validation rejects foreign questions/options and wrong answer kinds',()=>{
  for(const answers of [{foreign:{option_id:'a',short_answer:null}},{q:{option_id:'foreign',short_answer:null}},
    {short:{option_id:'a',short_answer:null}},{q:{option_id:null,short_answer:'text'}}]) {
    assert.throws(()=>grading.validateAnswers(questions,answers),e=>e.status===400);
  }
});
test('legacy XP numeric strings are read numerically and invalid totals cannot become negative',()=>{
  assert.equal(grading.nonnegative('100'),100);assert.equal(grading.nonnegative(-1),0);assert.equal(grading.nonnegative(Infinity),0);
});
test('legacy multiple-correct imports use the last correct ID consistently',()=>{
  const qs=[{...questions[0],exam_options:[{id:'z',is_correct:true},{id:'a',is_correct:true}]}];
  assert.equal(grading.grade(info,qs,{q:{option_id:'z',short_answer:null}},'SUBMITTED').score,1);
  assert.equal(grading.grade(info,qs,{q:{option_id:'a',short_answer:null}},'SUBMITTED').score,0);
});

function route(auth={uid:'verified'},service=async()=>({ok:true})) {
  let dbCalls=0, serviceCalls=0;
  const api=load('src/app/api/exams/route.ts',{'next/server':nextServer,'@/lib/user-api-auth':{authenticateUser:async()=>auth},
    '@/lib/firebase-admin':{getAdminDb:()=>{dbCalls++;return {};}},'@/lib/exam-grading':grading,
    '@/lib/exam-service':{runExamCommand:async(db,uid,cmd)=>{serviceCalls++;assert.equal(uid,'verified');return service(db,uid,cmd);}}});
  return {...api,counts:()=>({dbCalls,serviceCalls})};
}
const request=body=>new Request('http://localhost/api/exams',{method:'POST',body:typeof body==='string'?body:JSON.stringify(body)});
test('exam API denies anonymous calls before parsing any body or accessing the database',async()=>{
  const r=route({response:nextServer.NextResponse.json({error:'Sign in'},{status:401})});
  const res=await r.POST(request('bad'));assert.equal(res.status,401);assert.deepEqual(r.counts(),{dbCalls:0,serviceCalls:0});
  assert.equal(res.headers.get('cache-control'),'private, no-store');
});
test('exam API rejects forged scores and malformed JSON before Admin DB access',async()=>{
  for(const input of [command({score:999}),'[']) {const r=route();assert.equal((await r.POST(request(input))).status,400);assert.equal(r.counts().dbCalls,0);}
});
test('exam API enforces streaming body size even without a content-length header',async()=>{
  const r=route();assert.equal((await r.POST(request('x'.repeat(512001)))).status,413);assert.equal(r.counts().dbCalls,0);
});
test('valid exam requests are caller-bound, no-store and vary by authorization',async()=>{
  const r=route(),res=await r.POST(request(command()));assert.equal(res.status,200);
  assert.equal(res.headers.get('cache-control'),'private, no-store');assert.equal(res.headers.get('vary'),'Authorization');
});
test('unexpected database errors expose no credentials or permissive success response',async()=>{
  const r=route(undefined,async()=>{throw Error('private-credential');}),res=await r.POST(request(command()));
  assert.equal(res.status,503);assert.ok(!(await res.text()).includes('private-credential'));
});
test('exam client sends the current bearer token and propagates submission failures',async()=>{
  let calls=0;
  const client=load('src/lib/exam-client.ts',{}, {fetch:async(url,init)=>{
    calls++;assert.equal(url,'/api/exams');assert.equal(init.headers.Authorization,'Bearer current');assert.equal(init.cache,'no-store');
    assert.equal(JSON.parse(init.body).action,'submit');return Response.json({error:'Please retry'},{status:503});
  }});
  await assert.rejects(client.submitExam({getIdToken:async()=>'current'},'attempt',{},1,'SUBMITTED'),/Please retry/);assert.equal(calls,1);
});
