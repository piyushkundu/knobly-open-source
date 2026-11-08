import { NextResponse } from 'next/server';
import { generateCode } from '@/lib/python-ai-service';
import { AI_LIMITS, aiChoice, aiErrorResponse, aiText, createAIClient, readAIRequest } from '@/lib/ai-request';

export async function POST(req: Request) {
  try {
    const body = await readAIRequest(req);
    const prompt = aiText(body, 'prompt', AI_LIMITS.prompt);
    const language = aiChoice(body, 'language', ['en', 'hi'] as const, 'en');
    const mode = aiChoice(body, 'mode', ['python', 'c', 'web'] as const, 'python');
    const code = await generateCode(prompt, language, mode, createAIClient(req.signal));
    return NextResponse.json({ code });
  } catch (error) {
    return aiErrorResponse(error);
  }
}
