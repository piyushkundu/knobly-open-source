import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-api-auth';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

// ── Pre-parse raw user input into structured question objects ──
// This is deterministic — no AI involved — so count is ALWAYS correct.
function preParseQuestions(raw: string) {
    // Split by "Q{n}." or "Q{n})" pattern
    const chunks = raw.split(/(?=Q\d+[\.\)]\s)/i).filter(s => s.trim());
    const questions: { text: string; code: string; options: { text: string; correct: boolean }[] }[] = [];

    for (const chunk of chunks) {
        const t = chunk.trim();
        if (!/^Q\d+[\.\)]\s/i.test(t)) continue;

        // Remove "Q{n}. " prefix
        const body = t.replace(/^Q\d+[\.\)]\s*/i, '');

        // Find "Options:" and "Answer:" markers
        const optIdx = body.search(/\nOptions:\s*\n/i);
        const ansIdx = body.search(/\nAnswer:\s*/i);
        if (optIdx === -1) continue;

        // ── Extract question text + code (everything before "Options:") ──
        let qPart = body.slice(0, optIdx).trim();

        // Separate question text from code snippet
        // Code starts after "Snippet:\n\nPython\n" or just "Python\n"
        let questionText = qPart;
        let code = '';
        const snippetMatch = qPart.match(/\n\s*Snippet:\s*\n+\s*Python\s*\n/i);
        const pythonMatch = qPart.match(/\n\s*Python\s*\n/i);

        if (snippetMatch) {
            questionText = qPart.slice(0, snippetMatch.index!).trim();
            code = qPart.slice(snippetMatch.index! + snippetMatch[0].length).trim();
        } else if (pythonMatch) {
            questionText = qPart.slice(0, pythonMatch.index!).trim();
            code = qPart.slice(pythonMatch.index! + pythonMatch[0].length).trim();
        }

        // ── Extract options (between "Options:" and "Answer:") ──
        const optRaw = ansIdx !== -1
            ? body.slice(optIdx + body.slice(optIdx).match(/\nOptions:\s*\n/i)![0].length, ansIdx)
            : body.slice(optIdx + body.slice(optIdx).match(/\nOptions:\s*\n/i)![0].length);
        const optTexts = optRaw.split('\n').map(l => l.trim()).filter(Boolean);

        // ── Extract correct answer ──
        let correctAns = '';
        if (ansIdx !== -1) {
            correctAns = body.slice(ansIdx).replace(/^\nAnswer:\s*/i, '').trim();
            // Remove parenthetical Hindi explanations like "(Tuples are immutable...)"
            correctAns = correctAns.replace(/\s*\(.*$/, '').replace(/\.\s*$/, '').trim();
        }

        // ── Match correct answer to options ──
        const options = optTexts.map(opt => {
            const optClean = opt.replace(/\.\s*$/, '').trim().toLowerCase();
            const ansClean = correctAns.replace(/\.\s*$/, '').trim().toLowerCase();
            const isCorrect = optClean === ansClean || ansClean.startsWith(optClean) || optClean.startsWith(ansClean)
                || ansClean.includes(optClean) || optClean.includes(ansClean);
            return { text: opt, correct: isCorrect };
        });

        // Ensure exactly one correct answer
        const correctCount = options.filter(o => o.correct).length;
        if (correctCount === 0 && options.length > 0) options[0].correct = true;
        if (correctCount > 1) {
            let found = false;
            options.forEach(o => { if (o.correct && found) o.correct = false; if (o.correct) found = true; });
        }

        questions.push({ text: questionText, code, options });
    }
    return questions;
}

// Format pre-parsed questions into the clean output (English only)
function formatParsed(qs: ReturnType<typeof preParseQuestions>) {
    return qs.map(q => {
        let block = '###---###\n' + q.text + '\n';
        if (q.code) block += q.code + '\n';
        q.options.forEach((o, i) => {
            block += `${String.fromCharCode(65 + i)}. ${o.text}${o.correct ? '*' : ''}\n`;
        });
        return block;
    }).join('\n');
}

const TRANSLATE_PROMPT = `You are a translation assistant. You will receive pre-formatted MCQ questions separated by ###---###.
Your ONLY job: add Hindi translation after " | " for question text lines and translatable option lines.

RULES:
1. Keep ###---### delimiters EXACTLY as they are.
2. Do NOT add, remove, merge, or split any questions. Output the EXACT same number of question blocks.
3. Do NOT touch code lines. Code stays as-is.
4. For option lines starting with A./B./C./D.: if the option is a number, code output, list, or symbol — do NOT translate, keep as-is.
5. Only translate actual English words to Hindi (Devanagari).
6. Keep the * marker for correct answers exactly where it is.
7. No markdown, no explanations, just the formatted output.`;

const GENERATE_PROMPT = `You are an MCQ generator. Generate questions in this exact format:

###---###
Question English | Question Hindi
code_if_any
A. Option (translate if words, keep if number/code)
B. Option
C. Option
D. Option

Mark correct answer with *. Separate questions with ###---###. Every question MUST have 4 options.`;


export async function POST(req: NextRequest) {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    try {
        const body = await req.json();
        const { input, mode = 'format', num_questions = 5 } = body;

        let userPrompt = '';
        let systemPrompt = '';

        if (mode === 'generate') {
            systemPrompt = GENERATE_PROMPT;
            userPrompt = `Generate EXACTLY ${num_questions} MCQs about: "${input}". Use ###---### before each question. Mark correct with *.`;
        } else {
            // ── FORMAT MODE: Pre-parse first, then send to AI for translation only ──
            const parsed = preParseQuestions(input);

            if (parsed.length === 0) {
                // Fallback: if pre-parser can't understand the format, send raw to AI
                systemPrompt = TRANSLATE_PROMPT;
                userPrompt = `Reformat these questions. Keep EXACTLY the same number. Use ###---### separator.\n\n${input}`;
            } else {
                // Pre-parsed successfully! Format and send for translation only
                const preFormatted = formatParsed(parsed);
                systemPrompt = TRANSLATE_PROMPT;
                userPrompt = `Translate ONLY the English text parts to Hindi (add after " | "). Keep everything else identical. There are exactly ${parsed.length} questions — output exactly ${parsed.length} question blocks.\n\n${preFormatted}`;
            }
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
            body: JSON.stringify({
                model: 'openai/gpt-oss-120b',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 8000,
                temperature: 0.15,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Groq AI Format error:', err);
            return NextResponse.json({ error: 'AI service error' }, { status: 500 });
        }

        const data = await response.json();
        let formattedText = data.choices?.[0]?.message?.content ?? '';
        formattedText = formattedText.replace(/^```[a-z]*\n?/gim, '').replace(/```$/gm, '').trim();

        // ── SAFETY CHECK: Verify AI didn't change the question count ──
        if (mode === 'format') {
            const parsed = preParseQuestions(input);
            if (parsed.length > 0) {
                const aiBlockCount = formattedText.split('###---###').filter((b: string) => b.trim()).length;
                if (aiBlockCount !== parsed.length) {
                    console.warn(`[AI Format] AI returned ${aiBlockCount} blocks but expected ${parsed.length}. Using English-only fallback.`);
                    formattedText = formatParsed(parsed);
                }
            }
        }

        // ── POST-PROCESSING: Remove "X | X" duplicates in option lines ──
        formattedText = formattedText.split('\n').map((line: string) => {
            const optMatch = line.match(/^([A-Ea-e][.)]\  +)(.+)$/);
            if (!optMatch) return line;
            const prefix = optMatch[1];
            const b = optMatch[2];
            if (!b.includes(' | ')) return line;
            const pipeIdx = b.indexOf(' | ');
            const left = b.slice(0, pipeIdx).trim();
            const right = b.slice(pipeIdx + 3).trim();
            if (left.replace(/\*+$/, '').trim() === right.replace(/\*+$/, '').trim()) return prefix + left;
            return line;
        }).join('\n');

        return NextResponse.json({ result: formattedText });
    } catch (err) {
        console.error('AI Format API Server error:', err);
        return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
    }
}
