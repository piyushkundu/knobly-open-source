import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { rateLimitAuth } from '@/lib/rate-limit';

// Force dynamic — requires runtime env vars, cannot be statically collected
export const dynamic = 'force-dynamic';

/**
 * Resolves a regular email (e.g. Gmail) to the user's @knobly.id email
 * if they have a linked Knobly User ID. Used by the login flow when
 * signInWithEmailAndPassword fails for a non-knobly email.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = rateLimitAuth(ip);
    
    if (!rateLimit.success) {
      // Return null quietly if rate limited, to simulate not found and not reveal limits easily
      return NextResponse.json({ knoblyEmail: null });
    }

    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ knoblyEmail: null });
    }

    const trimmed = email.trim().toLowerCase();

    // Look up the user's profile by email
    const snap = await getAdminDb().collection('profiles')
      .where('email', '==', trimmed)
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ knoblyEmail: null });
    }

    const knoblyUserId = snap.docs[0].data()?.knobly_user_id;
    if (!knoblyUserId) {
      return NextResponse.json({ knoblyEmail: null });
    }

    return NextResponse.json({ knoblyEmail: `${knoblyUserId}@knobly.id` });
  } catch (err) {
    console.error('[Knobly] resolve-knobly-email error:', err);
    return NextResponse.json({ knoblyEmail: null });
  }
}
