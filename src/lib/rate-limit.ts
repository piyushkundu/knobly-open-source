/**
 * Basic in-memory rate limiter for Next.js API Routes.
 * Note: In a serverless environment (like Vercel), this state is kept per-instance.
 * It won't perfectly sync across all instances, but it is highly effective 
 * at stopping basic spam, bot attacks, and exhaustion within the same execution context.
 */

interface RateLimitTracker {
  count: number;
  resetTime: number;
}

const authRateLimits = new Map<string, RateLimitTracker>();

export function rateLimitAuth(ip: string): { success: boolean, message?: string } {
  const now = Date.now();
  const WINDOW_MS = 60 * 1000; // 1 minute window
  const MAX_REQUESTS = 5; // 5 requests per minute per IP

  let record = authRateLimits.get(ip);

  if (!record || now > record.resetTime) {
    // New or expired record
    authRateLimits.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return { success: true };
  }

  // Active record
  if (record.count >= MAX_REQUESTS) {
    return { 
      success: false, 
      message: 'Too many requests. Please try again later.'
    };
  }

  record.count += 1;
  authRateLimits.set(ip, record);
  
  return { success: true };
}
