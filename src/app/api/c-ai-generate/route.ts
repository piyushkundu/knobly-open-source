import { NextResponse } from 'next/server';
import { generateCCode } from '@/lib/c-ai-service';
import { AI_LIMITS, aiChoice, aiErrorResponse, aiText, createAIClient, readAIRequest } from '@/lib/ai-request';

export async function POST(req: Request) {
  try {
    const body = await readAIRequest(req);
    const prompt = aiText(body, 'prompt', AI_LIMITS.prompt);
    const language = aiChoice(body, 'language', ['en', 'hi'] as const, 'en');
    const code = await generateCCode(prompt, language, createAIClient(req.signal));
    return NextResponse.json({ code });
  } catch (error) {
    return aiErrorResponse(error);
  }
}
