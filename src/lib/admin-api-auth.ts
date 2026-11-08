import 'server-only';

import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

const INVALID_TOKEN_CODES = new Set([
  'auth/argument-error',
  'auth/invalid-id-token',
  'auth/id-token-expired',
  'auth/id-token-revoked',
  'auth/user-disabled',
  'auth/user-not-found',
]);

/** Read-only authorization: server-owned UID allowlist AND an existing role. */
export async function requireAdmin(request: Request): Promise<NextResponse | null> {
  const match = request.headers.get('authorization')?.match(/^Bearer ([^\s]+)$/i);
  if (!match) {
    return NextResponse.json({ error: 'Please sign in to continue.' }, { status: 401 });
  }

  let uid: string;
  try {
    const token = await getAdminAuth().verifyIdToken(match[1], true);
    if (!token.uid) {
      return NextResponse.json({ error: 'Invalid sign-in token.' }, { status: 401 });
    }
    uid = token.uid;
  } catch (error: unknown) {
    const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined;
    if (typeof code === 'string' && INVALID_TOKEN_CODES.has(code)) {
      return NextResponse.json({ error: 'Your session is invalid or expired. Please sign in again.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to verify admin access. Please try again later.' }, { status: 503 });
  }

  try {
    // Old deployed rules allowed users to assign their own role fields.
    const trustedUids = process.env.FIREBASE_TRUSTED_ADMIN_UIDS?.split(',').map(value => value.trim()).filter(Boolean);
    if (!trustedUids?.length) {
      return NextResponse.json({ error: 'Unable to verify admin access. Please try again later.' }, { status: 503 });
    }
    if (!trustedUids.includes(uid)) {
      return NextResponse.json({ error: 'Admin access is required.' }, { status: 403 });
    }
    const db = getAdminDb();
    const [user, profile] = await Promise.all([
      db.collection('users').doc(uid).get(),
      db.collection('profiles').doc(uid).get(),
    ]);
    if ((user.exists && user.data()?.isAdmin === true) ||
        (profile.exists && profile.data()?.role === 'admin')) {
      return null;
    }
    return NextResponse.json({ error: 'Admin access is required.' }, { status: 403 });
  } catch {
    // Database/configuration failures must never grant access.
    return NextResponse.json({ error: 'Unable to verify admin access. Please try again later.' }, { status: 503 });
  }
}
