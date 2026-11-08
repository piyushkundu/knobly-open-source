import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeFirestore, getFirestore, connectFirestoreEmulator, memoryLocalCache } from 'firebase/firestore';

const demo = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS !== 'false';
const projectId = demo ? 'demo-knobly-local' : process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (!projectId) throw new Error('Configure your own Firebase project before disabling demo mode.');
const existing = getApps().find(app => app.name === 'knobly-community');
const app = existing ?? initializeApp({
  projectId,
  apiKey: demo ? 'emulator-only-api-key' : process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: demo ? 'localhost' : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  appId: demo ? 'emulator-only-app' : process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  ...(demo ? {} : { storageBucket:process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }),
}, 'knobly-community');
const auth = getAuth(app);
const db = existing ? getFirestore(app) : initializeFirestore(app, {
  ignoreUndefinedProperties:true, localCache:memoryLocalCache(), experimentalForceLongPolling:true,
});
if (demo && !existing) {
  connectAuthEmulator(auth,'http://127.0.0.1:19099',{disableWarnings:true});
  connectFirestoreEmulator(db,'127.0.0.1',18080);
}
export { app, auth, db };
