import 'server-only';
import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';

const INVALID_TOKEN_CODES = new Set([
  'auth/argument-error', 'auth/invalid-id-token', 'auth/id-token-expired',
  'auth/id-token-revoked', 'auth/user-disabled', 'auth/user-not-found',
]);

/** Verify the caller before any Admin SDK database access. Never accept a body/query UID. */
export async function authenticateUser(request: Request): Promise<{ uid: string } | { response: NextResponse }> {
  const header = request.headers.get('authorization');
  const match = header && header.length <= 8192 ? header.match(/^Bearer ([^\s]+)$/i) : null;
  if (!match) return { response: NextResponse.json({ error: 'Please sign in to continue.' }, { status: 401 }) };
  try {
    const token = await getAdminAuth().verifyIdToken(match[1], true);
    if (typeof token.uid !== 'string' || !token.uid) {
      return { response: NextResponse.json({ error: 'Invalid sign-in token.' }, { status: 401 }) };
    }
    return { uid: token.uid };
  } catch (error: unknown) {
    const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined;
    const invalid = typeof code === 'string' && INVALID_TOKEN_CODES.has(code);
    return { response: NextResponse.json({ error: invalid ? 'Please sign in again.' : 'Sign-in verification is unavailable.' }, { status: invalid ? 401 : 503 }) };
  }
}
