import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';
import * as nodeCrypto from 'node:crypto';
import ts from 'typescript';
import * as jsxRuntime from 'react/jsx-runtime';
import nextServer from 'next/server.js';
import { DEMO_PROJECT, AUTH_HOST, FIRESTORE_HOST } from './start-firebase-emulators.mjs';

// All guards run before any Firebase app/client is initialized.
assert.equal(process.env.GCLOUD_PROJECT, DEMO_PROJECT);
assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST, AUTH_HOST);
assert.equal(process.env.FIRESTORE_EMULATOR_HOST, FIRESTORE_HOST);
assert.ok(DEMO_PROJECT.startsWith('demo-'));
assert.ok(!process.env.VERCEL);
for (const key of ['GOOGLE_APPLICATION_CREDENTIALS', 'FIREBASE_SERVICE_ACCOUNT_JSON', 'FIREBASE_ADMIN_PRIVATE_KEY']) assert.ok(!process.env[key], key);
const health = await fetch(`http://${AUTH_HOST}/emulator/v1/projects/${DEMO_PROJECT}/config`, { signal: AbortSignal.timeout(5000) });
assert.ok(health.ok, 'Start the local demo emulators first');

const firebaseApp = await import('firebase/app');
const authSdk = await import('firebase/auth');
const firestore = await import('firebase/firestore');
const adminAppSdk = await import('firebase-admin/app');
const adminAuthSdk = await import('firebase-admin/auth');
const adminStoreSdk = await import('firebase-admin/firestore');
const adminApp = adminAppSdk.initializeApp({ projectId: DEMO_PROJECT }, 'emulator-check-' + randomUUID());
const adminAuth = adminAuthSdk.getAuth(adminApp), adminDb = adminStoreSdk.getFirestore(adminApp);
const app = firebaseApp.initializeApp({ apiKey: 'emulator-only-api-key', projectId: DEMO_PROJECT, appId: 'emulator-only-app' }, 'client-check-' + randomUUID());
const auth = authSdk.getAuth(app);
authSdk.connectAuthEmulator(auth, `http://${AUTH_HOST}`, { disableWarnings: true });
const db = firestore.initializeFirestore(app, { ignoreUndefinedProperties: true });
firestore.connectFirestoreEmulator(db, '127.0.0.1', 18080);
const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const outputIndex = process.argv.indexOf('--out');
const output = outputIndex >= 0 ? process.argv[outputIndex + 1] : undefined;
if (output) await mkdir(path.dirname(output), { recursive: true });
const checks = [];
const check = async (name, action) => { await action(); checks.push({ name, passed: true }); console.log('PASS ' + name); };

function evaluate(source, dependencies = {}, globals = {}) {
  const exports = {};
  const scope = {
    exports, Request, Response, Headers, Date, crypto: { randomUUID },
    console, setTimeout, clearTimeout,
    require(name) { if (!Object.hasOwn(dependencies, name)) throw new Error('Unexpected dependency: ' + name); return dependencies[name]; },
    ...globals,
  };
  // Compile in the SDK's realm: Firestore rejects plain objects from another VM realm.
  vm.compileFunction(ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } }).outputText, Object.keys(scope))(...Object.values(scope));
  return exports;
}
function operation(file, name, globals) {
  const tree = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let expression;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(tree) === name) expression = ts.isCallExpression(node.initializer) ? node.initializer.arguments[0] : node.initializer;
    if (ts.isFunctionDeclaration(node) && node.name?.text === name) expression = node;
    ts.forEachChild(node, visit);
  }
  visit(tree);
  assert.ok(expression, name);
  return evaluate('export const run = ' + expression.getText(tree), {}, globals).run;
}
function reactHarness() {
  const cells = []; let cursor = 0;
  return {
    reset() { cursor = 0; },
    react: {
      createContext: () => ({ Provider: 'TestProvider' }), useContext: () => null,
      useEffect() {}, useCallback: fn => fn,
      useState(initial) { const i = cursor++; if (!(i in cells)) cells[i] = typeof initial === 'function' ? initial() : initial;
        return [cells[i], value => { cells[i] = typeof value === 'function' ? value(cells[i]) : value; }]; },
    },
  };
}

const adminModule = { getAdminAuth: () => adminAuth, getAdminDb: () => adminDb };
const adminConfig = { env: { FIREBASE_TRUSTED_ADMIN_UIDS: 'pending-dummy-admin' } };
const { requireAdmin } = evaluate(read('src/lib/admin-api-auth.ts'), { 'server-only': {}, 'next/server': nextServer, '@/lib/firebase-admin': adminModule }, { process: adminConfig });
const tasks = evaluate(read('src/app/api/html-tasks/route.ts'), {
  'next/server': nextServer, '@/lib/firebase-admin': adminModule, '@/lib/admin-api-auth': { requireAdmin },
  fs: { existsSync: () => false }, path: { join: (...parts) => parts.join('/') }, os: { tmpdir: () => '/local-test-cache' },
}, { process: { cwd: () => '/local-emulator-fixture', env: {} } });
const postTask = token => new Request('http://127.0.0.1/api/html-tasks', { method: 'POST', headers: {
  'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}),
}, body: JSON.stringify({ action: 'unlock', taskId: '2' }) });

const react = reactHarness();
const contextModule = evaluate(read('src/context/AuthContext.tsx'), {
  react: react.react, 'react/jsx-runtime': jsxRuntime, 'firebase/auth': authSdk,
  'firebase/firestore': firestore, '@/lib/firebase': { auth, db },
}, { fetch: async () => Response.json({ isolated: true }) });
const context = contextModule.AuthProvider({ children: null }).props.value;
const suffix = randomUUID().slice(0, 8);
const email = `student-${suffix}@example.test`, password = 'EmulatorOnly123!';
let student, studentToken, browserStudent;

try {
  await check('application signup creates only demo user/profile/XP records and signs out', async () => {
    await context.signup(email, password, 'Emulator Student', 'student-' + suffix, '');
    student = await adminAuth.getUserByEmail(email);
    assert.equal(auth.currentUser, null);
    assert.equal((await adminDb.doc('users/' + student.uid).get()).data().isAdmin, false);
    assert.equal((await adminDb.doc('profiles/' + student.uid).get()).data().role, 'user');
    assert.equal((await adminDb.doc('exam_user_state/' + student.uid).get()).data().total_points, 0);
  });
  await check('application login rejects an unverified demo account', async () => {
    await assert.rejects(context.login(email, password), /EMAIL_NOT_VERIFIED/);
    assert.equal(auth.currentUser, null);
  });
  await adminAuth.updateUser(student.uid, { emailVerified: true });
  await check('application login accepts the verified dummy account', async () => {
    await context.login(email, password);
    assert.equal(auth.currentUser.uid, student.uid);
    studentToken = await auth.currentUser.getIdToken(true);
    assert.equal((await adminAuth.verifyIdToken(studentToken, true)).uid, student.uid);
  });

  const hookReact = reactHarness();
  const hookModule = evaluate(read('src/hooks/useSavedCodes.ts'), {
    react: hookReact.react, 'firebase/firestore': firestore, '@/lib/firebase': { db },
    '@/context/AuthContext': { useAuth: () => ({ user: auth.currentUser }) },
  });
  const saved = () => { hookReact.reset(); return hookModule.useSavedCodes(); };
  let code;
  await check('saved-code callback persists code and preserves account fields', async () => {
    code = await saved().saveCode('Emulator code', 'print(5)', '', '5', 'local fixture');
    assert.ok(code);
    const data = (await adminDb.doc('users/' + student.uid).get()).data();
    assert.equal(data.saved_codes[0].code, 'print(5)'); assert.equal(data.isAdmin, false); assert.equal(data.email, email);
  });
  await check('saved-code reload/update/delete operate only on the dummy record', async () => {
    await saved().loadCodes(); assert.equal(saved().codes[0].id, code.id);
    await saved().updateCode(code.id, { code: 'print(7)' });
    assert.equal((await adminDb.doc('users/' + student.uid).get()).data().saved_codes[0].code, 'print(7)');
    await saved().deleteCode(code.id);
    assert.equal((await adminDb.doc('users/' + student.uid).get()).data().saved_codes.length, 0);
  });
  await check('local fixture rules prevent self-promotion and cross-user reads', async () => {
    await assert.rejects(firestore.updateDoc(firestore.doc(db, 'users', student.uid), { isAdmin: true }), error => error.code === 'permission-denied');
    await assert.rejects(firestore.updateDoc(firestore.doc(db, 'profiles', student.uid), { role: 'admin' }), error => error.code === 'permission-denied');
    await adminDb.doc('users/other-dummy').set({ isAdmin: false, email: 'other@example.test' });
    await assert.rejects(firestore.getDoc(firestore.doc(db, 'users', 'other-dummy')), error => error.code === 'permission-denied');
  });
  const taskRef = adminDb.doc('app_settings/html_tasks');
  await taskRef.set({ unlockedTasks: ['1', 'retired-task'], sentinel: 'preserve-me' });
  await check('guest task mutation is 401 and student token is 403 without changing locks', async () => {
    const before = (await taskRef.get()).data();
    assert.equal((await tasks.POST(postTask())).status, 401);
    assert.equal((await tasks.POST(postTask(studentToken))).status, 403);
    assert.deepEqual((await taskRef.get()).data(), before);
  });
  await check('invalid bearer token is rejected by real emulator-backed verification', async () => {
    assert.equal((await tasks.POST(postTask('not-a-token'))).status, 401);
  });
  const admin = await adminAuth.createUser({ email: `admin-${suffix}@example.test`, password, emailVerified: true });
  adminConfig.env.FIREBASE_TRUSTED_ADMIN_UIDS = admin.uid;
  await adminDb.doc('users/' + admin.uid).set({ isAdmin: true });
  await authSdk.signInWithEmailAndPassword(auth, admin.email, password);
  let token = await auth.currentUser.getIdToken(true);
  await check('existing users.isAdmin role authorizes an atomic task update', async () => {
    assert.equal((await tasks.POST(postTask(token))).status, 200);
    const data = (await taskRef.get()).data();
    assert.ok(data.unlockedTasks.includes('2') && data.unlockedTasks.includes('retired-task'));
    assert.equal(data.sentinel, 'preserve-me');
  });
  const profileAdmin = await adminAuth.createUser({ email: `profile-admin-${suffix}@example.test`, password, emailVerified: true });
  adminConfig.env.FIREBASE_TRUSTED_ADMIN_UIDS += ',' + profileAdmin.uid;
  await adminDb.doc('users/' + profileAdmin.uid).set({ isAdmin: false });
  await adminDb.doc('profiles/' + profileAdmin.uid).set({ role: 'admin' });
  await authSdk.signInWithEmailAndPassword(auth, profileAdmin.email, password);
  token = await auth.currentUser.getIdToken(true);
  await check('existing profiles.role admin path also authorizes the request', async () => {
    assert.equal(await requireAdmin(postTask(token)), null);
  });
  await check('public task GET does not change emulator state', async () => {
    const before = (await taskRef.get()).data();
    const response = await tasks.GET(); assert.equal(response.status, 200);
    assert.deepEqual((await taskRef.get()).data(), before);
  });

  await authSdk.signInWithEmailAndPassword(auth, email, password);
  const examFile = 'src/app/test/[id]/page.tsx';
  const testData = { id: 'exam-' + suffix, xp_reward: 20, title: 'Callback Exam', duration_minutes: 10, is_active: true };
  const questions = [1, 2].map(n => ({ id: 'q' + n + suffix, exam_options: [{ id: 'a' + n + suffix, is_correct: true }] }));
  await adminDb.doc('exam_tests/' + testData.id).set(testData);
  for (const q of questions) {
    await adminDb.doc('exam_questions/' + q.id).set({ test_id: testData.id, question_text: 'Callback question', question_type: 'MCQ' });
    await adminDb.doc('exam_options/' + q.exam_options[0].id).set({ question_id: q.id, option_text: 'Option', is_correct: true });
  }
  const grading = evaluate(read('src/lib/exam-grading.ts'));
  const examService = evaluate(read('src/lib/exam-service.ts'), {'server-only':{},'node:crypto':nodeCrypto,'@/lib/exam-grading':grading},{Buffer});
  const userAuth = evaluate(read('src/lib/user-api-auth.ts'), {'server-only':{},'next/server':nextServer,'@/lib/firebase-admin':adminModule});
  const examApi = evaluate(read('src/app/api/exams/route.ts'), {'next/server':nextServer,'@/lib/user-api-auth':userAuth,
    '@/lib/firebase-admin':adminModule,'@/lib/exam-grading':grading,'@/lib/exam-service':examService},{Buffer});
  const examClient = evaluate(read('src/lib/exam-client.ts'), {}, {fetch:(url,init)=>{
    assert.equal(url,'/api/exams');return examApi.POST(new Request('http://127.0.0.1/api/exams',init));
  }});
  async function examAttempt() {
    let attempt, responsesMap = {}, result;
    const refs={startingRef:{current:false},submittingRef:{current:false},requestIdRef:{current:null},responsesRef:{current:{}},revisionRef:{current:0},shortSaveTimeout:{current:null},finishedRef:{current:false},disposedRef:{current:false},deadlineRef:{current:null}};
    const base = { ...examClient, ...refs, user: auth.currentUser, testData, testId: testData.id,
      requestFullscreenAny:async()=>{},shuffleArray:items=>items,setTestData(){},setQuestions(){},setVisitedSet(){},setTimeLeft(){},setCurrentIndex(){},setExamError(){},setSubmitting(){},
      setResponsesMap:value=>{responsesMap=value;},setAttempt:value=>{attempt=value;},setExamStarted(){},
    };
    await operation(examFile, 'createAttemptAndStart', base)();
    const queueAnswerSave=operation(examFile,'queueAnswerSave',{...base,attempt});
    for (const question of questions) {
      operation(examFile, 'handleOptionClick', { ...base, examStarted:true,examFinished:false,attempt,queueAnswerSave })(question.id,question.exam_options[0].id);
    }
    await operation(examFile, 'finalizeSubmit', { ...base, examFinished:false,attempt,responsesMap,
      isFullscreenAny:()=>false,setExamFinished(){},setMobileDrawerOpen(){},setResultData:value=>{result=value;},
    })();
    return {attempt,result};
  }
  await check('actual exam callbacks persist answers, score, accuracy and first-attempt XP', async () => {
    const { attempt, result } = await examAttempt();
    assert.equal(result.score, 2); assert.equal(result.accuracy, 100); assert.equal(result.pointsEarned, 20);
    const data = (await adminDb.doc('exam_attempts/' + attempt.id).get()).data();
    assert.equal(data.status, 'SUBMITTED'); assert.equal(data.score, 2);
    assert.equal((await adminDb.doc('exam_user_state/' + student.uid).get()).data().total_points, 20);
    assert.equal((await adminDb.collection('exam_responses').where('attempt_id', '==', attempt.id).get()).size, 2);
  });
  await check('repeating the same exam does not award the dummy user XP twice', async () => {
    await examAttempt();
    const data = (await adminDb.doc('exam_user_state/' + student.uid).get()).data();
    assert.equal(data.total_points, 20); assert.equal(data.total_xp, 20);
  });
  await check('disabled dummy account token is rejected as 401', async () => {
    await adminAuth.updateUser(student.uid, { disabled: true });
    assert.equal((await tasks.POST(postTask(studentToken))).status, 401);
  });
  // Separate active dummy account retained for optional local browser checks.
  browserStudent = await adminAuth.createUser({ email: 'browser-student@example.test', password, displayName: 'Emulator Student', emailVerified: true }).catch(async error => {
    if (error.code !== 'auth/email-already-exists') throw error;
    return adminAuth.getUserByEmail('browser-student@example.test');
  });
  await adminDb.doc('users/' + browserStudent.uid).set({ email: browserStudent.email, displayName: 'Emulator Student', isAdmin: false }, { merge: true });
  await adminDb.doc('profiles/' + browserStudent.uid).set({ email: browserStudent.email, full_name: 'Emulator Student', role: 'user' }, { merge: true });
  const report = { passed: true, generatedAt: new Date().toISOString(), project: DEMO_PROJECT, auth: AUTH_HOST, firestore: FIRESTORE_HOST,
    checks: checks.length, results: checks, productionCredentialsUsed: false,
    rulesScope: process.env.FIREBASE_RULES_TEST_STAGE === '3' ? 'Actual callbacks under Stage 3 demo rules; no Production policy validated' : 'Local test fixture; Production rules not validated' };
  if (output) await writeFile(output, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: true, checks: checks.length, project: DEMO_PROJECT }));
} catch (error) {
  if (output) await writeFile(output, JSON.stringify({ passed: false, checks, error: error.message }, null, 2));
  throw error;
} finally {
  await authSdk.signOut(auth);
  await firestore.terminate(db);
  await firebaseApp.deleteApp(app);
  await adminAppSdk.deleteApp(adminApp);
}
