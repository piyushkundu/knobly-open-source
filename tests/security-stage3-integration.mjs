import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import * as crypto from 'node:crypto';
import nextServer from 'next/server.js';
import { DEMO_PROJECT, AUTH_HOST, FIRESTORE_HOST } from './start-firebase-emulators.mjs';

assert.equal(process.env.GCLOUD_PROJECT,DEMO_PROJECT);
assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,AUTH_HOST);
assert.equal(process.env.FIRESTORE_EMULATOR_HOST,FIRESTORE_HOST);
assert.equal(process.env.FIREBASE_TRUSTED_ADMIN_UIDS,'trusted-admin-stage1');
for(const key of ['VERCEL','GOOGLE_APPLICATION_CREDENTIALS','FIREBASE_SERVICE_ACCOUNT_JSON','FIREBASE_ADMIN_PRIVATE_KEY']) assert.ok(!process.env[key]);
const [apps,authSdk,store,adminApps,adminAuthSdk,adminStore]=await Promise.all([
  import('firebase/app'),import('firebase/auth'),import('firebase/firestore'),import('firebase-admin/app'),import('firebase-admin/auth'),import('firebase-admin/firestore'),
]);
const adminApp=adminApps.initializeApp({projectId:DEMO_PROJECT}),adminDb=adminStore.getFirestore(adminApp),adminAuth=adminAuthSdk.getAuth(adminApp);
const app=apps.initializeApp({projectId:DEMO_PROJECT,apiKey:'emulator-only',appId:'emulator-only'}),auth=authSdk.getAuth(app);
authSdk.connectAuthEmulator(auth,'http://'+AUTH_HOST,{disableWarnings:true});
const db=store.initializeFirestore(app,{ignoreUndefinedProperties:true});store.connectFirestoreEmulator(db,'127.0.0.1',18080);
store.setLogLevel('silent');
const password='Stage3EmulatorOnly123!',alice='stage3-owner-alice',bob='stage3-owner-bob';
const checks=[];
const check=async(name,action)=>{await action();checks.push({name,passed:true});console.log('PASS '+name);};
const denied=promise=>assert.rejects(promise,e=>e.code==='permission-denied');
async function load(file,deps={},globals={}) {
  const exports={},scope={exports,console,Request,Response,Headers,Buffer,Date,
    require(name){assert.ok(Object.hasOwn(deps,name),'Unexpected dependency '+name);return deps[name];},...globals};
  vm.compileFunction(ts.transpileModule(await readFile(new URL('../'+file,import.meta.url),'utf8'),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},
  }).outputText,Object.keys(scope))(...Object.values(scope));return exports;
}
const grading=await load('src/lib/exam-grading.ts');
const service=await load('src/lib/exam-service.ts',{'server-only':{},'node:crypto':crypto,'@/lib/exam-grading':grading});
const adminModule={getAdminDb:()=>adminDb,getAdminAuth:()=>adminAuth};
const {authenticateUser}=await load('src/lib/user-api-auth.ts',{'server-only':{},'next/server':nextServer,'@/lib/firebase-admin':adminModule});
let clock=Date.now();
const api=await load('src/app/api/exams/route.ts',{'next/server':nextServer,'@/lib/user-api-auth':{authenticateUser},
  '@/lib/firebase-admin':adminModule,'@/lib/exam-grading':grading,
  '@/lib/exam-service':{runExamCommand:(db,uid,command)=>service.runExamCommand(db,uid,command,clock)}});
const client=await load('src/lib/exam-client.ts',{}, {fetch:async(url,init)=>{
  assert.equal(url,'/api/exams');return api.POST(new Request('http://127.0.0.1/api/exams',init));
}});
const tokenRequest=async(body,token)=>api.POST(new Request('http://127.0.0.1/api/exams',{
  method:'POST',headers:{Authorization:'Bearer '+(token ?? await auth.currentUser.getIdToken())},body:JSON.stringify(body),
}));
const start=(testId,requestId=crypto.randomUUID())=>client.startExam(auth.currentUser,testId,requestId);
const submit=(attemptId,answers,revision=1)=>client.submitExam(auth.currentUser,attemptId,answers,revision,'SUBMITTED');
const answers=id=>Object.fromEntries([1,2].map(n=>[id+'-q'+n,{option_id:id+'-a'+n,short_answer:null}]));
async function seed(id,extra={}) {
  await adminDb.doc('exam_tests/'+id).set({title:'Trusted '+id,duration_minutes:10,xp_reward:20,is_active:true,...extra});
  for(const n of [1,2]) {
    await adminDb.doc('exam_questions/'+id+'-q'+n).set({test_id:id,question_text:'Question '+n,question_type:'MCQ',marks:1,explanation:'PRIVATE KEY EXPLANATION'});
    await adminDb.doc('exam_options/'+id+'-a'+n).set({question_id:id+'-q'+n,option_text:'Correct',is_correct:true,private_field:'DO NOT EXPOSE'});
    await adminDb.doc('exam_options/'+id+'-b'+n).set({question_id:id+'-q'+n,option_text:'Other',is_correct:false});
  }
}
let first;
try {
  for(const uid of [alice,bob]) {
    await adminAuth.createUser({uid,email:uid+'@example.test',password,emailVerified:true});
    await adminDb.doc('users/'+uid).set({email:uid+'@example.test',saved_codes:[{id:'existing',code:'PRIVATE SAVED CODE'}],isAdmin:false});
    await adminDb.doc('profiles/'+uid).set({full_name:uid,role:'user',email:uid+'@example.test'});
  }
  await adminDb.doc('exam_user_state/legacy-random-alice').set({user_id:alice,total_points:'100',total_xp:'100',current_level:2,legacy_field:'preserve'});
  await adminDb.doc('exam_user_state/duplicate-lower-alice').set({user_id:alice,total_xp:50,current_level:1});
  await seed('trusted');await authSdk.signInWithEmailAndPassword(auth,alice+'@example.test',password);
  await check('normal users cannot forge scores, attempts, answers, XP, badges or shared content',async()=>{
    for(const col of ['exam_tests','exam_questions','exam_options','exam_levels','exam_badges','notifications','apps','videos','exam_categories','questions','tests']) {
      await adminDb.doc(col+'/write-proof').set({title:'Original'});
      await denied(store.updateDoc(store.doc(db,col,'write-proof'),{title:'Forged'}));
      await denied(store.setDoc(store.doc(db,col,'forged'),{title:'Forged'}));
      await denied(store.deleteDoc(store.doc(db,col,'write-proof')));
    }
    await denied(store.updateDoc(store.doc(db,'exam_user_state','legacy-random-alice'),{total_points:9999}));
    await denied(store.deleteDoc(store.doc(db,'exam_user_state','legacy-random-alice')));
    await denied(store.setDoc(store.doc(db,'exam_user_state','random-extra'),{user_id:alice,total_xp:9999}));
    for(const col of ['exam_attempts','exam_responses','exam_user_badges','test_results']) await denied(store.setDoc(store.doc(db,col,'forged'),{user_id:alice,score:9999}));
    await denied(store.updateDoc(store.doc(db,'profiles',alice),{total_xp:9999}));
  });
  await check('answer-key reads and private collection scans stay denied even with legacy forged admin flags',async()=>{
    await adminDb.doc('profiles/'+alice).update({role:'admin'});await adminDb.doc('users/'+alice).update({isAdmin:true});
    for(const col of ['exam_questions','exam_options','exam_attempt_keys','exam_awards','profiles','users','tests','questions']) await denied(store.getDocs(store.collection(db,col)));
    await denied(store.getDoc(store.doc(db,'exam_options','trusted-a1')));
    await denied(store.updateDoc(store.doc(db,'exam_tests','trusted'),{xp_reward:9999}));
    await adminDb.doc('profiles/'+alice).update({role:'user'});await adminDb.doc('users/'+alice).update({isAdmin:false});
    assert.ok((await store.getDoc(store.doc(db,'exam_tests','trusted'))).exists());
  });
  await check('catalog and start return only safe question/option fields, without live answer keys or explanations',async()=>{
    const data=await client.loadExam(auth.currentUser,'trusted');
    for(const marker of ['is_correct','explanation','PRIVATE KEY','DO NOT EXPOSE','private_field']) assert.ok(!JSON.stringify(data).includes(marker));
    assert.equal(data.questions.length,2);
  });
  await check('concurrent starts coalesce and a lost start response can be retried without another attempt',async()=>{
    const key=crypto.randomUUID();const results=await Promise.all([start('trusted',key),start('trusted'),start('trusted',key)]);
    assert.equal(new Set(results.map(r=>r.attemptId)).size,1);first=results[0];
    assert.equal((await adminDb.collection('exam_attempts').where('user_id','==',alice).get()).size,1);
    await denied(store.getDoc(store.doc(db,'exam_attempt_keys',first.attemptId)));
    await assert.rejects(client.reviewExam(auth.currentUser,first.attemptId),/Submit this attempt/);
  });
  await check('caller binding and option membership reject foreign attempts/questions/options',async()=>{
    await authSdk.signInWithEmailAndPassword(auth,bob+'@example.test',password);
    await assert.rejects(submit(first.attemptId,answers('trusted')),/Attempt not found/);
    await assert.rejects(client.reviewExam(auth.currentUser,first.attemptId),/Attempt not found/);
    await authSdk.signInWithEmailAndPassword(auth,alice+'@example.test',password);
    for(const bad of [{foreign:{option_id:'trusted-a1',short_answer:null}},{'trusted-q1':{option_id:'trusted-a2',short_answer:null}}]) {
      assert.equal((await tokenRequest({action:'submit',attemptId:first.attemptId,answers:bad,revision:1})).status,400);
    }
    assert.equal((await tokenRequest({action:'submit',attemptId:first.attemptId,answers:{},revision:1,score:9999})).status,400);
  });
  await check('saved revisions survive reload and older out-of-order saves cannot overwrite newer answers',async()=>{
    await client.saveExam(auth.currentUser,first.attemptId,answers('trusted'),2);
    await client.saveExam(auth.currentUser,first.attemptId,{},1);
    const resumed=await start('trusted');assert.deepEqual(resumed.answers,answers('trusted'));assert.equal(resumed.revision,2);
  });
  await check('server grades the start snapshot and preserves legacy string XP, saved code and duplicate-state records',async()=>{
    await adminDb.doc('exam_tests/trusted').update({xp_reward:999});await adminDb.doc('exam_options/trusted-a1').update({is_correct:false});
    const result=(await submit(first.attemptId,answers('trusted'),3)).result;
    assert.equal(result.score,2);assert.equal(result.accuracy,100);assert.equal(result.pointsEarned,20);assert.equal(result.xpAwarded,20);
    const state=(await adminDb.doc('exam_user_state/legacy-random-alice').get()).data();
    assert.equal(state.total_points,120);assert.equal(state.total_xp,120);assert.equal(state.legacy_field,'preserve');
    assert.equal((await adminDb.doc('exam_user_state/duplicate-lower-alice').get()).data().total_xp,50);
    assert.equal((await adminDb.doc('users/'+alice).get()).data().saved_codes[0].code,'PRIVATE SAVED CODE');
    assert.equal((await adminDb.collection('exam_responses').where('attempt_id','==',first.attemptId).get()).size,2);
    await adminDb.doc('exam_tests/trusted').update({xp_reward:20});await adminDb.doc('exam_options/trusted-a1').update({is_correct:true});
  });
  await check('duplicate submits return the committed result and completed answers/score cannot be rewritten',async()=>{
    const before=(await adminDb.doc('exam_attempts/'+first.attemptId).get()).data();
    const results=await Promise.all([submit(first.attemptId,{},4),submit(first.attemptId,{},5)]);
    assert.ok(results.every(r=>r.result.score===2&&r.result.xpAwarded===20));
    assert.deepEqual((await adminDb.doc('exam_attempts/'+first.attemptId).get()).data(),before);
    assert.equal((await adminDb.doc('exam_user_state/legacy-random-alice').get()).data().total_points,120);
    await denied(store.updateDoc(store.doc(db,'exam_attempts',first.attemptId),{status:'IN_PROGRESS',score:999}));
    await denied(store.updateDoc(store.doc(db,'exam_responses',first.attemptId+'_trusted-q1'),{option_id:'trusted-b1'}));
  });
  await check('retakes keep results and reviews but cannot award XP a second time',async()=>{
    const again=await start('trusted');assert.notEqual(again.attemptId,first.attemptId);
    const {result}=await submit(again.attemptId,answers('trusted'));assert.equal(result.score,2);assert.equal(result.xpAwarded,0);
    assert.equal((await adminDb.doc('exam_user_state/legacy-random-alice').get()).data().total_points,120);
    const review=await client.reviewExam(auth.currentUser,first.attemptId);
    assert.equal(review.questions[0].exam_options.find(o=>o.id==='trusted-a1').is_correct,true);
    assert.equal(review.test.xp_reward,20);assert.ok(!JSON.stringify(review).includes('PRIVATE SAVED CODE'));
  });
  await check('zero-score first completion consumes the award opportunity, matching the existing first-completion policy',async()=>{
    await seed('zero');const zero=await start('zero');assert.equal((await submit(zero.attemptId,{})).result.xpAwarded,0);
    const retry=await start('zero');assert.equal((await submit(retry.attemptId,answers('zero'))).result.xpAwarded,0);
    assert.equal((await adminDb.doc('exam_user_state/legacy-random-alice').get()).data().total_points,120);
  });
  await check('expired submissions grade only answers saved before the server deadline',async()=>{
    await seed('expiry');const exp=await start('expiry');
    await client.saveExam(auth.currentUser,exp.attemptId,{'expiry-q1':{option_id:'expiry-a1',short_answer:null}},1);
    clock+=600001;
    await assert.rejects(client.saveExam(auth.currentUser,exp.attemptId,answers('expiry'),2),/Time is up/);
    const result=(await submit(exp.attemptId,answers('expiry'),3)).result;
    assert.equal(result.score,1);assert.equal(result.xpAwarded,10);assert.equal(result.statusType,'AUTO_SUBMITTED');
  });
  await check('concurrent completions on separate tests preserve both increments without losing existing XP',async()=>{
    await seed('parallel-a');await seed('parallel-b');
    const a=await start('parallel-a'),b=await start('parallel-b');
    const results=await Promise.all([submit(a.attemptId,answers('parallel-a')),submit(b.attemptId,answers('parallel-b'))]);
    assert.ok(results.every(r=>r.result.xpAwarded===20));
    assert.equal((await adminDb.doc('exam_user_state/legacy-random-alice').get()).data().total_points,170);
  });
  await check('historical completions suppress new XP without changing historical attempts or scores',async()=>{
    await seed('historical');const old={user_id:alice,test_id:'historical',status:'SUBMITTED',score:1,xp_earned:7};
    await adminDb.doc('exam_attempts/historical-existing').set(old);
    const a=await start('historical');assert.equal((await submit(a.attemptId,answers('historical'))).result.xpAwarded,0);
    assert.deepEqual((await adminDb.doc('exam_attempts/historical-existing').get()).data(),old);
    const review=await client.reviewExam(auth.currentUser,'historical-existing');assert.equal(review.attempt.score,1);
    await adminDb.doc('exam_attempts/legacy-active').set({user_id:alice,test_id:'historical',status:'IN_PROGRESS'});
    await assert.rejects(submit('legacy-active',answers('historical')),/older attempt/);
  });
  await check('inactive/live schedules and XP level locks are enforced by the server',async()=>{
    await seed('disabled',{is_active:false});await assert.rejects(start('disabled'),/not available/);
    await seed('future-live',{mode:'LIVE',live_start:new Date(clock+60000).toISOString(),live_end:new Date(clock+120000).toISOString()});
    await assert.rejects(start('future-live'),/scheduled time/);
    await adminDb.doc('exam_levels/high').set({level_no:10,required_xp:9999});
    await seed('locked',{level_id:'high'});await assert.rejects(start('locked'),/earlier levels/);
  });
  await check('nullable legacy metadata remains compatible and oversized exams fail before a partial snapshot is created',async()=>{
    await seed('nullable');await adminDb.doc('exam_questions/nullable-q1').update({chapter:null,explanation:null});
    assert.equal((await client.loadExam(auth.currentUser,'nullable')).questions.length,2);
    await seed('oversized');const batch=adminDb.batch();
    for(let i=0;i<199;i++) batch.set(adminDb.doc('exam_questions/oversized-extra-'+i),{test_id:'oversized',question_text:'Extra',question_type:'SHORT'});
    await batch.commit();await assert.rejects(start('oversized'),/admin review/);
    assert.equal((await adminDb.collection('exam_attempts').where('test_id','==','oversized').get()).size,0);
  });
  await check('live answer reviews remain closed until the scheduled end even after submitting',async()=>{
    await seed('live-now',{mode:'LIVE',live_start:new Date(clock-1000).toISOString(),live_end:new Date(clock+60000).toISOString()});
    const a=await start('live-now');await submit(a.attemptId,{});
    await assert.rejects(client.reviewExam(auth.currentUser,a.attemptId),/scheduled end/);
    clock+=60001;assert.equal((await client.reviewExam(auth.currentUser,a.attemptId)).questions.length,2);
  });
  await check('legacy dashboard metadata projection never releases embedded questions or answer keys',async()=>{
    await adminDb.doc('tests/legacy-list-item').set({title:'Legacy',questions:[{correct_answer:1}],private:'secret',total_points:10});
    const data=await client.legacyExamList(auth.currentUser);assert.ok(data.tests.some(t=>t.id==='legacy-list-item'));
    assert.ok(!JSON.stringify(data).includes('correct_answer'));assert.ok(!JSON.stringify(data).includes('secret'));
  });
  await check('expired LIVE attempts resume from saved snapshots even after source content is removed, without extending time',async()=>{
    await seed('resume-live',{mode:'LIVE',live_start:new Date(clock-1000).toISOString(),live_end:new Date(clock+60000).toISOString()});
    const key=crypto.randomUUID(),a=await start('resume-live',key);
    await client.saveExam(auth.currentUser,a.attemptId,{'resume-live-q1':{option_id:'resume-live-a1',short_answer:null}},1);
    const original=(await adminDb.doc('exam_attempts/'+a.attemptId).get()).data();
    await adminDb.doc('exam_tests/resume-live').delete();clock+=60001;
    const loaded=await client.loadExam(auth.currentUser,'resume-live');assert.equal(loaded.questions.length,2);
    for(const requestId of [key,crypto.randomUUID()]) {
      const resumed=await start('resume-live',requestId);assert.equal(resumed.attemptId,a.attemptId);assert.equal(resumed.remainingSeconds,0);
      assert.equal(resumed.revision,1);assert.equal(resumed.answers['resume-live-q1'].option_id,'resume-live-a1');
      assert.ok(!JSON.stringify(resumed).includes('is_correct'));
    }
    assert.deepEqual((await adminDb.doc('exam_attempts/'+a.attemptId).get()).data(),original);
    const result=(await submit(a.attemptId,answers('resume-live'),2)).result;
    assert.equal(result.score,1);assert.equal(result.statusType,'AUTO_SUBMITTED');
    await assert.rejects(start('resume-live'),/Exam not found/);
  });
  await check('legacy review exposes only recorded aggregates, preserves zero/missing values and does not rewrite history',async()=>{
    await seed('review-history',{xp_reward:999});
    const legacy={user_id:alice,test_id:'review-history',status:'SUBMITTED',score:0,accuracy:0,points_earned:0,xp_earned:0};
    await adminDb.doc('exam_attempts/review-zero').set(legacy);
    await adminDb.doc('exam_responses/review-zero-r').set({attempt_id:'review-zero',question_id:'review-history-q1',option_id:'review-history-a1'});
    const data=await client.reviewExam(auth.currentUser,'review-zero');assert.equal(data.reviewSource,'legacy');
    assert.equal(data.attempt.score,0);assert.equal(data.attempt.accuracy,0);assert.equal(data.attempt.points_earned,0);
    assert.deepEqual((await adminDb.doc('exam_attempts/review-zero').get()).data(),legacy);
    await adminDb.doc('exam_attempts/review-missing').set({user_id:alice,test_id:'review-history',status:'SUBMITTED'});
    const missing=await client.reviewExam(auth.currentUser,'review-missing');
    assert.equal(missing.attempt.score,undefined);assert.equal(missing.attempt.accuracy,undefined);assert.equal(missing.attempt.points_earned,undefined);
    await adminDb.doc('exam_attempts/review-fractional').set({user_id:alice,test_id:'review-history',status:'SUBMITTED',score:'1.5',accuracy:'25.5',xp_earned:'7.5'});
    const fractional=await client.reviewExam(auth.currentUser,'review-fractional');
    assert.equal(fractional.attempt.score,1.5);assert.equal(fractional.attempt.accuracy,25.5);assert.equal(fractional.attempt.xp_earned,7.5);
  });
  await check('actual dashboard loads newly earned legacy XP and levels on the first render using owner-scoped queries',async()=>{
    const progress=await load('src/lib/progress-display.ts');
    const {readLeaderboard}=await load('src/lib/leaderboard.ts',{'server-only':{},'node:crypto':crypto});
    const leaderboardRoute=await load('src/app/api/leaderboard/route.ts',{'next/server':nextServer,'@/lib/user-api-auth':{authenticateUser},
      '@/lib/firebase-admin':adminModule,'@/lib/leaderboard':{readLeaderboard}},{process:{env:{FIREBASE_TRUSTED_ADMIN_UIDS:'trusted-admin-stage1'}}});
    const leaderboardClient=await load('src/lib/leaderboard-client.ts',{}, {fetch:(_url,init)=>leaderboardRoute.GET(new Request('http://127.0.0.1/api/leaderboard',init))});
    const total=Number((await adminDb.doc('exam_user_state/legacy-random-alice').get()).data().total_points);
    await adminDb.doc('exam_levels/dashboard-eligible').set({level_no:1,required_xp:total-1});
    await seed('dashboard-eligible',{level_id:'dashboard-eligible'});
    const cells=[];let cursor=0;
    const react={useEffect(){},useCallback:fn=>fn,useMemo:fn=>fn(),useState(initial){const i=cursor++;if(!(i in cells))cells[i]=typeof initial==='function'?initial():initial;
      return[cells[i],value=>{cells[i]=typeof value==='function'?value(cells[i]):value;}];}};
    const hook=await load('src/app/dashboard/useDashboard.ts',{react,'firebase/firestore':store,'@/lib/firebase':{db},
      '@/context/AuthContext':{useAuth:()=>({user:auth.currentUser,loading:false})},'@/lib/progress-display':progress,
      '@/lib/exam-client':client,'@/lib/leaderboard-client':leaderboardClient});
    const dashboard=()=>{cursor=0;return hook.useDashboard();};
    const before=(await adminDb.doc('exam_user_state/legacy-random-alice').get()).data();
    await dashboard().reloadAll();const d=dashboard();
    assert.equal(d.totalPoints,total);assert.ok(d.availableTests.some(t=>t.id==='dashboard-eligible'));assert.equal(d.isLoadingMain,false);
    assert.equal(d.leaderboardError,'');assert.ok(d.simpleTests.some(t=>t.id==='legacy-list-item'));
    assert.deepEqual((await adminDb.doc('exam_user_state/legacy-random-alice').get()).data(),before);
  });
  await check('independently trusted admin retains content editing and private result inspection',async()=>{
    await authSdk.signInWithEmailAndPassword(auth,'stage1-admin@example.test','EmulatorOnly123!');
    await store.updateDoc(store.doc(db,'exam_tests','trusted'),{title:'Trusted admin edit'});
    await store.updateDoc(store.doc(db,'exam_options','trusted-b1'),{option_text:'Trusted admin edit'});
    assert.ok((await store.getDocs(store.collection(db,'exam_attempts'))).size>0);
    await denied(store.getDocs(store.collection(db,'exam_attempt_keys')));
  });
  await writeFile(process.argv[process.argv.indexOf('--out')+1],JSON.stringify({generatedAt:new Date().toISOString(),project:DEMO_PROJECT,
    checks:checks.length,results:checks,productionWrites:false,scope:'Actual API/client and Auth/Firestore SDK; no production credentials or data'},null,2));
} finally {
  await authSdk.signOut(auth);await store.terminate(db);await apps.deleteApp(app);await adminApps.deleteApp(adminApp);
}
