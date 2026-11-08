import { NextRequest, NextResponse } from 'next/server';
import { AI_LIMITS, aiChoice, aiErrorResponse, aiOptions, aiText, createAIClient, readAIRequest } from '@/lib/ai-request';

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

export async function POST(req: NextRequest) {
    try {
        const body = await readAIRequest(req);
        const question_text = aiText(body, 'question_text', AI_LIMITS.prompt);
        const options = aiOptions(body);
        const correct_option = aiText(body, 'correct_option', AI_LIMITS.option, { optional: true, allowEmpty: true });
        const user_answer = aiText(body, 'user_answer', AI_LIMITS.prompt, { optional: true, allowEmpty: true });
        const selectedLanguage = aiChoice(body, 'language', ['Hindi', 'English', 'hi', 'en'] as const, 'Hindi');
        const language = selectedLanguage === 'English' || selectedLanguage === 'en' ? 'English' : 'Hindi (in devanagari)';
        const client = createAIClient(req.signal, { totalMs: 15000, attemptMs: 9000 });

        const prompt = `You are a friendly, deeply encouraging AI tutor on Knobly Web.
A student needs the absolute simplest explanation for the following question:

Question: ${question_text}
Options: ${options?.length ? options.join(', ') : 'None'}
Correct Answer: ${correct_option || 'Not clearly defined'}
Student's Answer: ${user_answer || 'Skipped / Not answered'}

Explain the correct answer in the simplest way possible, as if teaching a complete beginner. 
Use extremely easy words and simple relatable analogies if needed.
If their answer was wrong, simply and gently explain why it's incorrect.
Keep it short, engaging, and format it neatly with emojis or bullet points.

CRITICAL REQUIREMENT: You MUST respond entirely in ${language || 'Hindi (in devanagari)'}. Make sure it is deeply easy to understand for a school student.`;

        // 1. Try Sarvam AI
        if (SARVAM_API_KEY) try {
            console.log('[AI Explain] Trying Sarvam AI...');
            const sarvamRes = await client.fetch('https://api.sarvam.ai/v1/chat/completions', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                     'api-subscription-key': SARVAM_API_KEY,
                     'Authorization': `Bearer ${SARVAM_API_KEY}`
                 },
                 body: JSON.stringify({
                     model: 'sarvam-30b-16k', // Typical Sarvam API model string. Will fallback if failing.
                     messages: [{ role: 'system', content: 'You are a helpful tutor.' }, { role: 'user', content: prompt }],
                     max_tokens: 500,
                     temperature: 0.3
                 }),
            }, 6000);

            if (sarvamRes.ok) {
                 const data = await sarvamRes.json();
                 const text = data.choices?.[0]?.message?.content;
                 if (text) {
                     console.log('[AI Explain] Sarvam AI succeeded.');
                     return NextResponse.json({ explanation: text, provider: 'sarvam' });
                 }
            } else {
                 console.warn('[AI Explain] Sarvam AI failed. Status:', sarvamRes.status);
            }
        } catch (sarvamErr) {
            console.warn('[AI Explain] Sarvam AI fetch error:', sarvamErr);
        }

        // 2. Fallback to Groq AI
        console.log('[AI Explain] Falling back to Groq AI...');
        const groqRes = await client.fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-120b',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.5,
                max_tokens: 500,
            }),
        });

        if (!groqRes.ok) {
            return aiErrorResponse(null);
        }

        const data = await groqRes.json();
        const text = data.choices?.[0]?.message?.content;
        return NextResponse.json({ explanation: text || 'Sorry, I could not generate an explanation at this time.', provider: 'groq' });

    } catch (err) {
        return aiErrorResponse(err);
    }
}
