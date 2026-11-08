import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const file='src/app/review/[id]/page.tsx',source=readFileSync(new URL('../'+file,import.meta.url),'utf8');
function expression(name,scope) {
  const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let node;
  function visit(n){if(ts.isVariableDeclaration(n)&&n.name.getText(tree)===name)node=n.initializer;ts.forEachChild(n,visit);}visit(tree);assert.ok(node,name);
  const exports={};vm.compileFunction(ts.transpileModule('export const value = '+node.getText(tree),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
  }).outputText,['exports',...Object.keys(scope)])(exports,...Object.values(scope));return exports.value;
}
async function review(attempt) {
  const events={};const data={attempt,test:{xp_reward:999},reviewSource:'legacy',responses:{q:{option_id:'now-correct'}},
    questions:[{id:'q',question_type:'MCQ',exam_options:[{id:'now-correct',is_correct:true}]}]};
  const run=expression('load',{user:{uid:'owner'},attemptId:'old',reviewExam:async()=>data,isOptionCorrect:value=>value===true,
    setAttempt:value=>events.attempt=value,setTestData(){},setQuestions(){},setResponses(){},setReviewSource:value=>events.source=value,
    setStats:value=>events.stats=value,setReviewError:value=>events.error=value,setLoading(){}});
  await run();return events;
}
test('legacy review preserves recorded zero score/accuracy/points despite currently correct answers',async()=>{
  const e=await review({score:0,accuracy:0,points_earned:0});assert.equal(e.stats.correct,1);assert.equal(e.stats.pointsEarned,0);assert.equal(e.source,'legacy');
  assert.equal(expression('score',{attempt:e.attempt}),0);assert.equal(expression('accuracy',{attempt:e.attempt}),0);
});
test('legacy review uses recorded XP if old points field is absent instead of awarding current test reward',async()=>{
  const e=await review({score:1,accuracy:50,xp_earned:7});assert.equal(e.stats.pointsEarned,7);assert.equal(e.stats.totalPoints,999);
  assert.equal(expression('accuracy',{attempt:e.attempt}),50);
});
test('missing historical aggregates remain unrecorded rather than being invented from current questions',async()=>{
  const e=await review({});assert.equal(e.stats.pointsEarned,null);
  assert.equal(expression('score',{attempt:e.attempt}),null);assert.equal(expression('accuracy',{attempt:e.attempt}),null);
});
test('fractional historical points stay unchanged in the review',async()=>{
  const e=await review({score:1.5,accuracy:25.5,points_earned:7.5});assert.equal(e.stats.pointsEarned,7.5);
  assert.equal(expression('score',{attempt:e.attempt}),1.5);assert.equal(expression('accuracy',{attempt:e.attempt}),25.5);
});
