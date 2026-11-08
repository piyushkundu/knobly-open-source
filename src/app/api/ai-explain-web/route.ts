import { NextResponse } from 'next/server';
import { explainWebCode } from '@/lib/python-ai-service';
import { AI_LIMITS, aiChoice, aiErrorResponse, aiText, createAIClient, readAIRequest } from '@/lib/ai-request';

export async function POST(req: Request) {
  try {
    const body = await readAIRequest(req);
    const code = aiText(body, 'code', AI_LIMITS.code);
    const question = aiText(body, 'question', AI_LIMITS.prompt, { optional: true, allowEmpty: true });
    const language = aiChoice(body, 'language', ['en', 'hi'] as const, 'en');
    const result = await explainWebCode(code, language, question, createAIClient(req.signal));
    return NextResponse.json(result);
  } catch (error) {
    return aiErrorResponse(error);
  }
}
