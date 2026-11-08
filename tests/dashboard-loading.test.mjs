import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(file,deps={}) {
  const exports={};vm.compileFunction(ts.transpileModule(readFileSync(new URL('../'+file,import.meta.url),'utf8'),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
  }).outputText,['exports','require','console'])(exports,name=>{assert.ok(Object.hasOwn(deps,name),name);return deps[name];},console);return exports;
}
const progress=load('src/lib/progress-display.ts');
function harness(initial) {
  const data={exam_user_state:initial,exam_levels:[{id:'basic',level_no:1,required_xp:75},{id:'advanced',level_no:2,required_xp:500}],
    exam_tests:[{id:'basic-test',title:'Basic',level_id:'basic',is_active:true},{id:'advanced-test',title:'Advanced',level_id:'advanced',is_active:true}],
    exam_attempts:[],exam_user_badges:[],test_results:[],exam_categories:[]};
  const writes=[],cells=[];let cursor=0;
  const store={collection:(_db,name)=>({name}),doc:(_db,name,id)=>({name,id}),where:(field,op,value)=>({field,op,value}),
    query:(col,...filters)=>({...col,filters}),getDoc:async ref=>({exists:()=>ref.name==='profiles',id:ref.id,data:()=>({full_name:'Owner'})}),
    getDocs:async q=>{
      assert.ok(Object.hasOwn(data,q.name),'Unexpected collection '+q.name);
      if(['exam_user_state','exam_attempts','exam_user_badges','test_results'].includes(q.name)) {
        assert.ok(q.filters?.some(f=>f.field==='user_id'&&f.op==='=='&&f.value==='owner'),'Private query must be owner-scoped');
      }
      const rows=data[q.name].filter(row=>(q.filters??[]).every(f=>row[f.field]===f.value));
      // Reading levels completes later than progress. No React re-render occurs inside reloadAll.
      if(q.name==='exam_levels') await new Promise(resolve=>setImmediate(resolve));
      return {empty:!rows.length,docs:rows.map(row=>({id:row.id,data:()=>{const {id,...rest}=row;return structuredClone(rest);}}))};
    },setDoc:async(ref,value)=>writes.push({ref,value}),updateDoc:async()=>{throw Error('Unexpected update');}};
  const react={useEffect(){},useCallback:fn=>fn,useMemo:fn=>fn(),useState(initial){const i=cursor++;if(!(i in cells))cells[i]=typeof initial==='function'?initial():initial;
    return [cells[i],value=>{cells[i]=typeof value==='function'?value(cells[i]):value;}];}};
  const hook=load('src/app/dashboard/useDashboard.ts',{react,'firebase/firestore':store,'@/lib/firebase':{db:{}},
    '@/context/AuthContext':{useAuth:()=>({user:{uid:'owner'},loading:false})},'@/lib/progress-display':progress,
    '@/lib/leaderboard-client':{fetchLeaderboard:async()=>[]},'@/lib/exam-client':{legacyExamList:async()=>({tests:[]})}});
  return {data,writes,dashboard(){cursor=0;return hook.useDashboard();}};
}
const rows=()=>[{id:'a-low',user_id:'owner',total_xp:10,current_level:1},
  {id:'z-high',user_id:'owner',total_points:'200',total_xp:'20',current_level:'2',legacy_field:'preserve'},
  {id:'foreign',user_id:'other',total_xp:9999}];
test('first dashboard load uses newly fetched levels and highest legacy XP without writing existing data',async()=>{
  const h=harness(rows()),before=structuredClone(h.data);await h.dashboard().reloadAll();const d=h.dashboard();
  assert.equal(d.totalPoints,200);assert.equal(d.userState.current_level,2);assert.equal(d.userState.legacy_field,'preserve');
  assert.deepEqual(d.availableTests.map(t=>t.id),['basic-test']);assert.deepEqual(d.lockedTests.map(t=>t.id),['advanced-test']);
  assert.equal(d.isLoadingMain,false);assert.deepEqual(h.writes,[]);assert.deepEqual(h.data,before);
});
test('refresh unlocks a newly earned level immediately instead of using the prior render XP',async()=>{
  const h=harness(rows());await h.dashboard().reloadAll();h.dashboard();
  h.data.exam_user_state[1].total_points='500';await h.dashboard().reloadAll();const d=h.dashboard();
  assert.equal(d.totalPoints,500);assert.equal(d.availableTests.length,2);assert.equal(d.lockedTests.length,0);assert.deepEqual(h.writes,[]);
});
test('missing progress initializes only the canonical zero record',async()=>{
  const h=harness([]);await h.dashboard().reloadAll();assert.equal(h.writes.length,1);
  assert.equal(h.writes[0].ref.name,'exam_user_state');assert.equal(h.writes[0].ref.id,'owner');assert.equal(h.writes[0].value.total_xp,0);
  assert.equal(h.dashboard().totalPoints,0);
});
test('display normalization handles legacy numbers without mutating the supplied record',()=>{
  const input={total_points:'0',total_xp:'150',current_level:'3',streak_days:-2};const result=progress.progressDisplay(input);
  assert.equal(result.total_points,150);assert.equal(result.current_level,3);assert.equal(result.streak_days,0);assert.equal(input.total_xp,'150');
});
