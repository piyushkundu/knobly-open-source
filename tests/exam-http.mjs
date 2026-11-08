// Exercise the real Next.js HTTP route with demo-only Firebase credentials.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, cp, symlink, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import { demoEnvironment, DEMO_PROJECT, AUTH_HOST, FIRESTORE_HOST } from './start-firebase-emulators.mjs';
assert.equal(process.env.GCLOUD_PROJECT, DEMO_PROJECT);
assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST, AUTH_HOST);
assert.equal(process.env.FIRESTORE_EMULATOR_HOST, FIRESTORE_HOST);
const workspace = fileURLToPath(new URL('../', import.meta.url));
const directory = await mkdtemp(path.join(os.tmpdir(), 'knobly-exam-http-'));
const files = ['src/app/api/exams/route.ts', 'src/lib/exam-service.ts', 'src/lib/exam-grading.ts', 'src/lib/user-api-auth.ts', 'src/types/exam.ts'];
for (const file of files) { await mkdir(path.dirname(path.join(directory, file)), { recursive: true }); await cp(path.join(workspace, file), path.join(directory, file)); }
await writeFile(path.join(directory, 'package.json'), JSON.stringify({ private: true, dependencies: { next: '16.4.5', react: '19.2.9', 'react-dom': '19.2.9', 'firebase-admin': '14.5.0' } }));
await writeFile(path.join(directory, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', lib: ['dom','esnext'], module: 'esnext', moduleResolution: 'bundler', jsx: 'react-jsx', esModuleInterop: true, skipLibCheck: true, paths: { '@/*': ['./src/*'] } } }));
await writeFile(path.join(directory, 'src/app/layout.tsx'), 'export default function Layout({children}:{children:React.ReactNode}) {return <html><body>{children}</body></html>}');
await writeFile(path.join(directory, 'src/lib/firebase-admin.ts'), `import {getApps,initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth'; import {getFirestore} from 'firebase-admin/firestore';
if(process.env.GCLOUD_PROJECT!=='demo-knobly-local'||process.env.FIREBASE_AUTH_EMULATOR_HOST!=='127.0.0.1:19099'||process.env.FIRESTORE_EMULATOR_HOST!=='127.0.0.1:18080') throw new Error('Demo environment required');
const app=getApps()[0]??initializeApp({projectId:'demo-knobly-local'});
export const getAdminAuth=()=>getAuth(app); export const getAdminDb=()=>getFirestore(app);
`);
await symlink(path.join(workspace, 'node_modules'), path.join(directory, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
const port = 3037;
await new Promise((resolve, reject) => { const s = net.createServer(); s.once('error', reject); s.listen(port, '127.0.0.1', () => s.close(resolve)); });
const server = spawn(process.execPath, [path.join(workspace, 'node_modules/next/dist/bin/next'), 'dev', '--webpack', '--hostname', '127.0.0.1', '--port', String(port)], {
  cwd: directory, env: demoEnvironment({ NEXT_TELEMETRY_DISABLED: '1', FIREBASE_TRUSTED_ADMIN_UIDS: 'trusted-admin-stage1' }), windowsHide: true, stdio: ['ignore','pipe','pipe'],
});
let logs = ''; for (const stream of [server.stdout, server.stderr]) stream.on('data', data => { logs = (logs + data).slice(-12000); });
let app;
try {
  const endpoint = 'http://127.0.0.1:' + port + '/api/exams';
  const post = (body,token) => fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});
  let response; const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error('Isolated Next server exited');
    try { response = await post({action:'load',testId:'http-exam'}); break; } catch { await new Promise(resolve => setTimeout(resolve,250)); }
  }
  assert.ok(response,'Isolated Next startup timeout'); assert.equal(response.status,401);
  assert.equal(response.headers.get('cache-control'),'private, no-store');
  const [apps,sdk,adminApps,adminStore] = await Promise.all([import('firebase/app'),import('firebase/auth'),import('firebase-admin/app'),import('firebase-admin/firestore')]);
  const adminApp = adminApps.initializeApp({projectId:DEMO_PROJECT},'http-seed'),db=adminStore.getFirestore(adminApp);
  try {
    await db.doc('exam_tests/http-exam').set({title:'HTTP Exam',duration_minutes:10,xp_reward:10,is_active:true});
    await db.doc('exam_questions/http-q').set({test_id:'http-exam',question_text:'HTTP question',question_type:'MCQ',explanation:'PRIVATE HTTP KEY'});
    await db.doc('exam_options/http-a').set({question_id:'http-q',option_text:'A',is_correct:true});
    await db.doc('exam_options/http-b').set({question_id:'http-q',option_text:'B',is_correct:false});
    app=apps.initializeApp({apiKey:'emulator-only',projectId:DEMO_PROJECT,appId:'emulator-only'},'exam-http');
    const auth=sdk.getAuth(app);sdk.connectAuthEmulator(auth,'http://'+AUTH_HOST,{disableWarnings:true});
    await sdk.signInWithEmailAndPassword(auth,'stage3-owner-alice@example.test','Stage3EmulatorOnly123!');
    const token=await auth.currentUser.getIdToken();
    const invalid=await post({action:'load',testId:'http-exam'},'invalid');assert.equal(invalid.status,401);
    const loaded=await post({action:'load',testId:'http-exam'},token);assert.equal(loaded.status,200);
    assert.ok(loaded.headers.get('vary').toLowerCase().includes('authorization'));
    const publicText=await loaded.text();for(const marker of ['is_correct','explanation','PRIVATE HTTP KEY']) assert.ok(!publicText.includes(marker));
    const started=await post({action:'start',testId:'http-exam',requestId:crypto.randomUUID()},token);assert.equal(started.status,200);
    const startData=await started.json(),attemptId=startData.attemptId;
    const answer={'http-q':{option_id:'http-a',short_answer:null}};
    const forged=await post({action:'submit',attemptId,answers:answer,revision:1,score:9999},token);assert.equal(forged.status,400);
    const saved=await post({action:'save',attemptId,answers:answer,revision:1},token);assert.equal(saved.status,200);
    const submitted=await post({action:'submit',attemptId,answers:answer,revision:2},token);assert.equal(submitted.status,200);
    const result=await submitted.json();assert.equal(result.result.score,1);assert.equal(result.result.xpAwarded,10);
    assert.equal((await db.doc('exam_attempts/'+attemptId).get()).data().score,1);
    const duplicate=await post({action:'submit',attemptId,answers:{},revision:3},token);assert.deepEqual(await duplicate.json(),result);
    const review=await post({action:'review',attemptId},token);assert.equal(review.status,200);assert.ok((await review.text()).includes('is_correct'));
    await sdk.signInWithEmailAndPassword(auth,'stage3-owner-bob@example.test','Stage3EmulatorOnly123!');
    const foreign=await post({action:'review',attemptId},await auth.currentUser.getIdToken());assert.equal(foreign.status,404);
    await sdk.signOut(auth);
    await writeFile(process.argv[process.argv.indexOf('--out')+1],JSON.stringify({generatedAt:new Date().toISOString(),project:DEMO_PROJECT,
      checks:10,results:['anonymous denial','invalid token denial','safe question projection','server start','forged score denial','answer save','trusted submit and stored score','idempotent retry','completed review','foreign review denial'],productionWrites:false,directory},null,2));
    console.log('PASS real Next HTTP exam lifecycle (10 checks)');
  } finally {await adminApps.deleteApp(adminApp);}
} catch (error) { console.error(logs); throw error; }
finally {
  if (app) await (await import('firebase/app')).deleteApp(app);
  if (server.exitCode === null) {
    if (process.platform === 'win32') await new Promise(resolve => {
      const killer = spawn('taskkill', ['/PID',String(server.pid),'/T','/F'], { windowsHide: true, stdio: 'ignore' }); killer.once('close', resolve); killer.once('error', resolve);
    }); else { server.kill('SIGTERM'); }
  }
}
