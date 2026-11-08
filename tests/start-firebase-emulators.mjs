import { spawn } from 'node:child_process';
import { cp, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareEmulatorTools, FIREBASE_CLI_VERSION } from './setup-firebase-tools.mjs';

export const DEMO_PROJECT = 'demo-knobly-local';
export const AUTH_HOST = '127.0.0.1:19099';
export const FIRESTORE_HOST = '127.0.0.1:18080';

export function demoEnvironment(extra = {}) {
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (/^(FIREBASE|NEXT_PUBLIC_FIREBASE|GOOGLE_|GCLOUD_|GCP_|GROQ_|SARVAM_|ZOHO_|GNEWS_|VERCEL|UPSTASH_|AI_RATE_LIMIT_|AI_LIMIT_)/.test(key)) delete env[key];
  }
  return { ...env, GCLOUD_PROJECT: DEMO_PROJECT, FIREBASE_AUTH_EMULATOR_HOST: AUTH_HOST,
    FIRESTORE_EMULATOR_HOST: FIRESTORE_HOST, CI: 'true', METADATA_SERVER_DETECTION:'none', ...extra };
}

async function available(port) {
  await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', () => reject(new Error(`Local emulator port ${port} is already in use; no process was stopped.`)));
    server.listen(port, '127.0.0.1', () => server.close(resolve));
  });
}

export async function startEmulators({ rulesSource } = {}) {
  for (const port of [19099, 18080, 14000, 4400, 4500, 9150]) await available(port);
  const tools = await prepareEmulatorTools();
  const directory = await mkdtemp(path.join(os.tmpdir(), 'knobly-firebase-demo-'));
  const fixtures = fileURLToPath(new URL('./fixtures/firebase-emulators/', import.meta.url));
  for (const file of ['firebase.emulators.json', 'firestore.test.rules']) await cp(path.join(fixtures, file), path.join(directory, file));
  // Optional audited rules snapshot is evaluated only in the demo emulator.
  if (rulesSource !== undefined) {
    if (typeof rulesSource !== 'string' || !rulesSource.includes('service cloud.firestore')) throw new Error('Expected Firestore rules source');
    await writeFile(path.join(directory, 'firestore.test.rules'), rulesSource);
  }
  const env = demoEnvironment({ PATH: path.dirname(tools.java) + path.delimiter + (process.env.PATH ?? '') });
  // No login, init, deploy, production project ID, service account or env pull.
  const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['exec', '--yes', `--package=firebase-tools@${FIREBASE_CLI_VERSION}`, '--',
    'firebase', 'emulators:start', '--only', 'auth,firestore', '--project', DEMO_PROJECT,
    '--config', 'firebase.emulators.json', '--non-interactive'], {
    cwd: directory, env, shell: process.platform === 'win32', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  });
  const log = [];
  child.on('error', error => { console.error(error.message); process.exitCode = 1; });
  for (const stream of [child.stdout, child.stderr]) stream.on('data', bytes => {
    const value = bytes.toString();
    log.push(value);
    process.stdout.write(value);
  });
  await mkdir(path.join(directory, 'reports'), { recursive: true });
  await writeFile(path.join(directory, 'SESSION.json'), JSON.stringify({ project: DEMO_PROJECT, auth: AUTH_HOST,
    firestore: FIRESTORE_HOST, ui: '127.0.0.1:14000', directory, firebaseCliVersion: FIREBASE_CLI_VERSION,
    java: tools.java, productionCredentialsUsed: false }, null, 2));
  return { child, directory, env, log };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const session = await startEmulators();
  console.log('LOCAL_DEMO_SESSION=' + session.directory);
  const stop = () => { if(process.platform === 'win32') spawn('taskkill',['/PID',String(session.child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'}); else session.child.kill('SIGTERM'); };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  session.child.on('close', code => { process.exitCode = code ?? 0; });
}
