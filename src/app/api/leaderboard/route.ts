import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/user-api-auth';
import { getAdminDb } from '@/lib/firebase-admin';
import { readLeaderboard } from '@/lib/leaderboard';

export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store', Vary: 'Authorization' };

export async function GET(request: Request) {
  const caller = await authenticateUser(request);
  if ('response' in caller) {
    caller.response.headers.set('Cache-Control', 'private, no-store');
    caller.response.headers.set('Vary', 'Authorization');
    return caller.response;
  }
  try {
    const trusted = process.env.FIREBASE_TRUSTED_ADMIN_UIDS?.split(',').map(s => s.trim()).filter(Boolean) ?? [];
    const leaderboard = await readLeaderboard(getAdminDb(), caller.uid, trusted);
    return NextResponse.json({ leaderboard }, { headers });
  } catch {
    return NextResponse.json({ error: 'Leaderboard is temporarily unavailable.' }, { status: 503, headers });
  }
}
