import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email-service';
import { rateLimitAuth } from '@/lib/rate-limit';

// Force dynamic — requires runtime env vars, cannot be statically collected
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = rateLimitAuth(ip);
    
    if (!rateLimit.success) {
      return NextResponse.json({ error: rateLimit.message }, { status: 429 });
    }

    const { email, displayName } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    await sendVerificationEmail(email, displayName);

    return NextResponse.json({ message: 'Verification email sent successfully.' });
  } catch (err: unknown) {
    console.error('[Knobly] Send verification email error:', err);
    const message = err instanceof Error ? err.message : 'Failed to send verification email.';

    // Handle specific Firebase errors
    if (message.includes('auth/user-not-found')) {
      return NextResponse.json({ message: 'Verification email sent successfully.' }, { status: 200 });
    }
    if (message.includes('auth/too-many-requests')) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    return NextResponse.json({ error: 'Failed to send verification email. Please try again.' }, { status: 500 });
  }
}
