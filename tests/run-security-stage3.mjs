import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { startEmulators } from './start-firebase-emulators.mjs';

const trustedUid = 'trusted-admin-stage1';
const rules = await readFile(new URL('../security/firestore.stage3.rules.template', import.meta.url), 'utf8');
const session = await startEmulators({ rulesSource: rules.replaceAll('__TRUSTED_ADMIN_UID__', trustedUid) });
console.log('LOCAL_STAGE3_SESSION=' + session.directory);
let stopping;
function stop() {
  if (!stopping) stopping = new Promise(resolve => {
    if (session.child.exitCode !== null) { resolve(); return; }
    if (process.platform === 'win32') {
      const killer = spawn('taskkill', [ '/PID', String(session.child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
      killer.once('close', resolve); killer.once('error', resolve);
    } else { session.child.once('close', resolve); session.child.kill('SIGTERM'); }
  });
  return stopping;
}
process.once('SIGINT', () => { void stop(); });
process.once('SIGTERM', () => { void stop(); });
async function run(file, report) {
  const child = spawn(process.execPath, [fileURLToPath(new URL('./' + file, import.meta.url)), '--out', report], {
    cwd: fileURLToPath(new URL('../', import.meta.url)), env: { ...session.env, FIREBASE_TRUSTED_ADMIN_UIDS: trustedUid, FIREBASE_RULES_TEST_STAGE: '3' }, windowsHide: true, stdio: 'inherit',
  });
  const timer = setTimeout(() => child.kill(), 120_000);
  try {
    const code = await new Promise((resolve, reject) => { child.once('error', reject); child.once('close', resolve); });
    if (code !== 0) throw new Error(file + ' failed with exit code ' + code);
  } finally { clearTimeout(timer); }
}
try {
  const deadline = Date.now() + 90_000;
  while (!session.log.join('').includes('All emulators ready')) {
    if (session.child.exitCode !== null || Date.now() > deadline) throw new Error('Demo emulator startup failed');
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  await run('security-stage1-integration.mjs', session.directory + '/reports/stage1-compatibility.json');
  await run('security-stage3-integration.mjs', session.directory + '/reports/stage3.json');
  await run('firebase-emulator-integration.mjs', session.directory + '/reports/app-callbacks.json');
  await run('exam-http.mjs', session.directory + '/reports/exam-http.json');
  console.log('LOCAL_STAGE3_REPORT=' + session.directory + '/reports/stage3.json');
} finally { await stop(); }
