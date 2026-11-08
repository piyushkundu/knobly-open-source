// Actual TSX callbacks with controlled UI state; not a browser-rendering claim.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { randomUUID } from 'node:crypto';
const file='src/app/test/[id]/page.tsx',source=readFileSync(new URL('../'+file,import.meta.url),'utf8');
function operation(name,globals) {
  const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let expression;
  function visit(node){if(ts.isVariableDeclaration(node)&&node.name.getText(tree)===name)expression=node.initializer;ts.forEachChild(node,visit);}visit(tree);
  assert.ok(expression,name);const exports={};const scope={exports,Error,crypto:{randomUUID},...globals};
  vm.compileFunction(ts.transpileModule('export const run = '+expression.getText(tree),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
  }).outputText,Object.keys(scope))(...Object.values(scope));return exports.run;
}
const noop=()=>{};
function submission(submitExam) {
  const answers={q:{option_id:'fresh',short_answer:null}},events={finished:false,error:'',result:null};
  const refs={responsesRef:{current:answers},revisionRef:{current:1},submittingRef:{current:false},shortSaveTimeout:{current:null},finishedRef:{current:false},disposedRef:{current:false}};
  const run=operation('finalizeSubmit',{examFinished:false,attempt:{id:'attempt'},user:{uid:'u'},...refs,submitExam,
    setSubmitting:noop,setExamError:value=>events.error=value,setExamFinished:value=>events.finished=value,
    setMobileDrawerOpen:noop,setResultData:value=>events.result=value,isFullscreenAny:()=>false,clearTimeout:noop});
  return {run,answers,events,refs};
}
test('submission uses the latest ref answers, waits for the server, and displays only the server result',async()=>{
  const expected={score:1,pointsEarned:10};let release;
  const s=submission(async(_user,id,answers)=>{assert.equal(id,'attempt');assert.equal(answers,s.answers);await new Promise(r=>release=r);return {result:expected};});
  const pending=s.run();assert.equal(s.events.finished,false);release();await pending;
  assert.equal(s.events.finished,true);assert.equal(s.events.result,expected);
});
test('failed submission keeps answers and allows an explicit retry without showing a false result',async()=>{
  let calls=0;const s=submission(async()=>{if(++calls===1)throw Error('Retry');return {result:{score:0}};});
  await s.run();assert.equal(s.events.finished,false);assert.equal(s.events.error,'Retry');assert.equal(s.refs.responsesRef.current,s.answers);
  await s.run();assert.equal(s.events.finished,true);assert.equal(calls,2);
});
test('multiple submit triggers share the in-flight guard and cannot send duplicate requests',async()=>{
  let calls=0,release;const s=submission(async()=>{calls++;await new Promise(r=>release=r);return {result:{score:1}};});
  const first=s.run();await s.run();assert.equal(calls,1);release();await first;
});

test('a queued stale submit callback cannot submit a successfully completed attempt again',async()=>{
  let calls=0;const s=submission(async()=>{calls++;return {result:{score:1}};});
  await s.run();await s.run('AUTO_SUBMITTED');assert.equal(calls,1);
});

test('an unmounted exam ignores queued submit callbacks and preserves its answers',async()=>{
  let calls=0;const s=submission(async()=>{calls++;return {result:{score:1}};});
  s.refs.disposedRef.current=true;await s.run('AUTO_SUBMITTED');
  assert.equal(calls,0);assert.equal(s.refs.responsesRef.current,s.answers);
});

test('a late server result does not update the unmounted exam session',async()=>{
  let release;const s=submission(async()=>{await new Promise(resolve=>release=resolve);return {result:{score:1}};});
  const pending=s.run();s.refs.disposedRef.current=true;release();await pending;
  assert.equal(s.refs.finishedRef.current,true);assert.equal(s.events.finished,false);assert.equal(s.events.result,null);
});

test('warning-triggered submission runs outside replayable state updaters',async()=>{
  let count=2,submits=0;
  const run=operation('handleCheat',{useCallback:fn=>fn,useEffectEvent:fn=>fn,examStarted:true,examFinished:false,
    attempt:{id:'attempt'},user:{uid:'u'},MAX_WARNINGS:3,warningCountRef:{current:2},finishedRef:{current:false},submittingRef:{current:false},disposedRef:{current:false},warningHideTimeout:{current:null},
    setWarningCount:update=>{count=typeof update==='function'?(update(count),update(count)):update;},
    finalizeSubmit:async()=>{submits++;},logProctor:async()=>{},setWarningMsg:noop,setTimeout:()=>1,clearTimeout:noop});
  await run('COPY');assert.equal(count,3);assert.equal(submits,1);
});
test('failed start does not enter an exam or create a fake client-side attempt',async()=>{
  let started=false,attempt=null,error='';
  const run=operation('createAttemptAndStart',{user:{uid:'u'},testData:{id:'exam'},testId:'exam',startingRef:{current:false},requestIdRef:{current:null},
    disposedRef:{current:false},deadlineRef:{current:null},finishedRef:{current:false},
    requestFullscreenAny:async()=>{},startExam:async()=>{throw Error('Unavailable');},isFullscreenAny:()=>false,
    setExamError:value=>error=value,setAttempt:value=>attempt=value,setExamStarted:value=>started=value});
  await run();assert.equal(started,false);assert.equal(attempt,null);assert.equal(error,'Unavailable');
});
test('start restores persisted answers, revision and remaining time instead of resetting the server deadline',async()=>{
  const restored={q:{option_id:'a',short_answer:null}},refs={responsesRef:{current:{}},revisionRef:{current:0}},events={};
  const run=operation('createAttemptAndStart',{user:{uid:'u'},testData:{id:'exam'},testId:'exam',startingRef:{current:false},requestIdRef:{current:null},...refs,
    disposedRef:{current:false},deadlineRef:{current:null},finishedRef:{current:false},
    requestFullscreenAny:async()=>{},startExam:async()=>({attemptId:'existing',test:{id:'exam'},questions:[],answers:restored,revision:7,remainingSeconds:11}),
    setExamError:noop,setAttempt:value=>events.attempt=value,setTestData:noop,setQuestions:noop,shuffleArray:value=>value,
    setResponsesMap:noop,setTimeLeft:value=>events.time=value,setCurrentIndex:noop,setExamStarted:value=>events.started=value});
  await run();assert.equal(events.attempt.id,'existing');assert.equal(events.time,11);assert.equal(events.started,true);
  assert.equal(refs.responsesRef.current,restored);assert.equal(refs.revisionRef.current,7);
});
