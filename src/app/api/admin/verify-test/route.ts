import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-api-auth';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

export async function POST(req: NextRequest) {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    try {
        const { testTitle, questions } = await req.json();

        const simplifiedQs = questions.map((q: any, index: number) => {
            const currentCorrect = q.options?.find((o: any) => o.is_correct === true || String(o.is_correct) === 'true');
            return {
                questionIndex: index,
                text: q.question_text,
                options: q.options?.map((o: any) => ({ text: o.option_text })),
                marked_correct_text: currentCorrect ? currentCorrect.option_text : null,
            };
        });

        const prompt = `You are a strict technical exam reviewer. Review the following test questions for accuracy.
        
For EACH question, carefully analyze if the 'marked_correct_text' is the BEST and MOST ACCURATE answer among the available options.
If the currently marked correct option is WRONG, or if a significantly better option exists, you MUST report a doubt. Provide a clear, brief explanation stating what the correct answer should actually be and why the marked one is incorrect.

Format your response as a JSON object strictly following this structure:
{
  "doubts": [
    { "questionIndex": 0, "doubt": "The marked option is wrong because... The correct option should be 'XXX'." }
  ]
}

If all marked answers are perfectly correct, return an empty array for doubts: { "doubts": [] }

Test Name: ${testTitle || 'Test'}
Questions Data:
${JSON.stringify(simplifiedQs, null, 2)}`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-120b',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.1,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('[VerifyTest API] Groq error:', err);
            return NextResponse.json({ error: 'AI service error' }, { status: 500 });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || '{"doubts": []}';
        
        let feedback: any[] = [];
        try {
            const parsed = JSON.parse(reply);
            feedback = (parsed.doubts || []).map((d: any) => ({
                questionId: questions[d.questionIndex]?.id,
                doubt: d.doubt
            })).filter((d: any) => d.questionId);
        } catch(e) {
            console.error('[VerifyTest API] Failed to parse AI response:', reply);
        }

        return NextResponse.json({ feedback });
    } catch (err) {
        console.error('[VerifyTest API] Server error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
