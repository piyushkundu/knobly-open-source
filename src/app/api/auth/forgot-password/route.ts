import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetMail, sendPasswordResetMailForKnoblyId } from '@/lib/email-service';
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin';
import { rateLimitAuth } from '@/lib/rate-limit';
import { resolvePasswordResetTarget } from '@/lib/password-reset-target';

export const dynamic = 'force-dynamic';
const accepted = () => NextResponse.json({ message: 'If this account supports password reset, a reset email will be sent.' }, {
  headers: { 'Cache-Control': 'no-store' },
});

export async function POST(req: NextRequest) {
  const rateLimit = rateLimitAuth(req.headers.get('x-forwarded-for') || 'unknown');
  if (!rateLimit.success) return NextResponse.json({ error: rateLimit.message }, { status: 429 });

  let email: unknown;
  try { email = (await req.json())?.email; }
  catch { return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 }); }
  if (typeof email !== 'string' || email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
  }
  try {
    const target = await resolvePasswordResetTarget(email, getAdminAuth(), getAdminDb());
    if (!target) return accepted();
    if (target.virtual) await sendPasswordResetMailForKnoblyId(target.targetEmail, target.deliveryEmail);
    else await sendPasswordResetMail(target.targetEmail);
    return accepted();
  } catch {
    return NextResponse.json({ error: 'Failed to send reset email. Please try again.' }, { status: 503 });
  }
}
