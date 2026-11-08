import { NextResponse } from 'next/server';
import { explainCError } from '@/lib/c-ai-service';
import { AI_LIMITS, aiChoice, aiErrorResponse, aiText, createAIClient, readAIRequest } from '@/lib/ai-request';

export async function POST(req: Request) {
  try {
    const body = await readAIRequest(req);
    const code = aiText(body, 'code', AI_LIMITS.code);
    const error = aiText(body, 'error', AI_LIMITS.error);
    const language = aiChoice(body, 'language', ['en', 'hi'] as const, 'en');
    const explanation = await explainCError(code, error, language, createAIClient(req.signal));
    return NextResponse.json(explanation);
  } catch (error) {
    return aiErrorResponse(error);
  }
}
