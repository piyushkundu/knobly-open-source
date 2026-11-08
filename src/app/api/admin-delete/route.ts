import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { requireAdmin } from '@/lib/admin-api-auth';

export async function POST(req: NextRequest) {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    try {
        const { action, testId, questionId, text } = await req.json();
        const db = getAdminDb();

        // ── DELETE ALL QUESTIONS ────────────────────────────────────────────────
        if (action === 'delete_all_questions' && testId) {
            const qSnap = await db.collection('exam_questions').where('test_id', '==', testId).get();
            let deletedQ = 0, deletedO = 0;
            for (const qDoc of qSnap.docs) {
                const optSnap = await db.collection('exam_options').where('question_id', '==', qDoc.id).get();
                for (const oDoc of optSnap.docs) {
                    await db.collection('exam_options').doc(oDoc.id).delete();
                    deletedO++;
                }
                await db.collection('exam_questions').doc(qDoc.id).delete();
                deletedQ++;
            }
            return NextResponse.json({ success: true, deletedQ, deletedO });
        }

        // ── DELETE SINGLE QUESTION ──────────────────────────────────────────────
        if (action === 'delete_question' && questionId) {
            const optSnap = await db.collection('exam_options').where('question_id', '==', questionId).get();
            for (const oDoc of optSnap.docs) {
                await db.collection('exam_options').doc(oDoc.id).delete();
            }
            await db.collection('exam_questions').doc(questionId).delete();
            return NextResponse.json({ success: true });
        }

        // ── IMPORT QUESTIONS ────────────────────────────────────────────────────
        if (action === 'import_questions' && testId && text) {
            const isOptionLine = (l: string) => /^[A-Ea-e][.)]\s+/.test(l.trim());

            // ── STEP 1: Split into raw blocks ──
            let rawBlocks: string[];
            if (text.includes('###---###')) {
                // Use the explicit delimiter
                rawBlocks = (text as string).split('###---###').map((b: string) => b.trim()).filter(Boolean);
            } else {
                // Fallback: split by empty lines
                rawBlocks = (text as string).split(/\n\s*\n/).map((b: string) => b.trim()).filter(Boolean);
            }

            // ── STEP 2: Merge orphan blocks (blocks without options) into previous question ──
            // A block is an "orphan" if it has NO option lines (A./B./C./D.) — it's probably
            // a code snippet that got separated from its question by an empty line.
            const mergedBlocks: string[] = [];
            for (const block of rawBlocks) {
                const lines = block.split(/\n/).map((l: string) => l.trimEnd()).filter(Boolean);
                const hasOptions = lines.some((l: string) => isOptionLine(l));

                if (!hasOptions && mergedBlocks.length > 0) {
                    // This block has no options — it's orphan code/text. Merge it into previous block.
                    mergedBlocks[mergedBlocks.length - 1] += '\n' + block;
                } else {
                    mergedBlocks.push(block);
                }
            }

            let importedCount = 0;

            for (const block of mergedBlocks) {
                const lines = block.split(/\n/).map((l: string) => l.trimEnd()).filter(Boolean);
                const firstOptionIndex = lines.findIndex((l: string) => isOptionLine(l));

                let questionText = '';
                let optionLines: string[] = [];

                if (firstOptionIndex === -1) {
                    // Whole block is question text (SHORT answer type)
                    questionText = lines.join('\n');
                } else {
                    questionText = lines.slice(0, firstOptionIndex).join('\n');
                    optionLines = lines.slice(firstOptionIndex);
                }

                // Strip leading question numbers like "1. " or "Q1. "
                questionText = questionText.replace(/^(Q?\d+[.)]\s*)/i, '').trim();

                if (!questionText) continue; // skip empty blocks

                const options: { text: string; is_correct: boolean }[] = [];

                for (const l of optionLines) {
                    const trimmed = l.trim();
                    if (!isOptionLine(trimmed)) continue;
                    let c = trimmed.replace(/^[A-Ea-e][.)]\s*/, '');
                    
                    // Bulletproof * detection: if ANY * exists anywhere in the option, it's the correct answer
                    const ic = c.includes('*');
                    // Remove ALL asterisks from the option text
                    c = c.replace(/\*/g, '').trim();
                    // Clean up any double spaces left after removing *
                    c = c.replace(/\s{2,}/g, ' ').trim();
                    
                    options.push({ text: c, is_correct: ic });
                }

                if (!options.find(o => o.is_correct) && options.length) options[0].is_correct = true;

                // Skip blocks that have no options AND look like pure code (orphan remnants)
                // This is a safety net — if somehow an orphan block wasn't merged
                if (options.length === 0) {
                    const looksLikeCode = lines.every((l: string) => {
                        const t = l.trim();
                        return !t.includes(' | ') && !t.endsWith('?') && !t.endsWith('？');
                    });
                    if (looksLikeCode && mergedBlocks.length > 1) {
                        console.log('[import] Skipping orphan code block:', questionText.substring(0, 60));
                        continue;
                    }
                }

                // Write to Firestore using Admin SDK (bypasses security rules)
                const qRef = db.collection('exam_questions').doc();
                await qRef.set({
                    test_id: testId,
                    question_text: questionText,
                    question_type: options.length ? 'MCQ' : 'SHORT',
                    marks: 1,
                    difficulty: 'EASY',
                    created_at: FieldValue.serverTimestamp(),
                });

                for (const opt of options) {
                    await db.collection('exam_options').add({
                        question_id: qRef.id,
                        option_text: opt.text,
                        is_correct: opt.is_correct,
                    });
                }
                importedCount++;
            }

            return NextResponse.json({ success: true, importedCount });
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

    } catch (err) {
        console.error('[admin-delete] ERROR:', err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
