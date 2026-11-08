import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export function getAdminApp() {
  const demo = process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.FIRESTORE_EMULATOR_HOST;
  const name = demo ? 'knobly-community-demo' : 'knobly-community-server';
  const existing = getApps().find(app => app.name === name);
  if (existing) return existing;
  if (demo) {
    if (process.env.FIREBASE_AUTH_EMULATOR_HOST !== '127.0.0.1:19099' ||
        process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:18080' ||
        process.env.GCLOUD_PROJECT !== 'demo-knobly-local') throw new Error('Expected loopback demo emulators.');
    return initializeApp({ projectId:'demo-knobly-local' },name);
  }
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  if (!projectId || projectId.startsWith('demo-')) throw new Error('Configure a separate project before enabling cloud access.');
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const credential = json ? cert(JSON.parse(Buffer.from(json,'base64').toString('utf8'))) : cert({
    projectId, clientEmail:process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey:process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g,'\n'),
  });
  return initializeApp({ projectId,credential },name);
}
export const getAdminAuth = () => getAuth(getAdminApp());
export const getAdminDb = () => getFirestore(getAdminApp());
