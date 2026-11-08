import type { NextRequest } from 'next/server';
import { createAIRateLimiter } from '@/lib/ai-rate-limit';

const limitAIRequest = createAIRateLimiter();

export function proxy(request: NextRequest) {
  return limitAIRequest(request);
}

// Keep these literal paths aligned with PUBLIC_AI_PATHS. Only public AI POSTs
// consume quota; auth, admin, profile, task state and results routes pass through.
export const config = {
  matcher: [
    '/api/ai-generate', '/api/ai-explain', '/api/ai-explain-web',
    '/api/c-ai-generate', '/api/c-ai-explain', '/api/ai/chat',
    '/api/ai/generate-topic', '/api/ai/explain-question', '/api/evaluate-task',
  ],
};
