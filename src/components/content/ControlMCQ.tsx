'use client';
import { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

interface MCQ { q: string; options: string[]; correct: number; explanation: string; }

const mcqs: MCQ[] = [
    { q: 'What is the output of: if 0: print("Yes") else: print("No")', options: ['Yes', 'No', 'Error', 'None'], correct: 1, explanation: '0 is considered False in Python (falsy value), so the else block runs.' },
    { q: 'Which keyword is used to skip the current iteration of a loop?', options: ['break', 'pass', 'continue', 'skip'], correct: 2, explanation: 'continue skips the rest of the current iteration and moves to the next one.' },
    { q: 'What does break statement do inside a loop?', options: ['Skips one iteration', 'Exits the loop completely', 'Pauses the loop', 'Restarts the loop'], correct: 1, explanation: 'break immediately exits the loop and control moves to the statement after the loop.' },
    { q: 'What is the output of: for i in range(3): print(i)', options: ['1 2 3', '0 1 2', '0 1 2 3', '1 2'], correct: 1, explanation: 'range(3) generates numbers 0, 1, 2 — it starts from 0 and stops before 3.' },
    { q: 'When does the else block of a for loop execute?', options: ['When loop has an error', 'When break is used', 'When loop completes normally (no break)', 'Never'], correct: 2, explanation: 'The else block of a loop executes only when the loop finishes without encountering a break statement.' },
    { q: 'What is the output of: print(True and False)', options: ['True', 'False', 'Error', 'None'], correct: 1, explanation: 'The "and" operator returns True only if BOTH conditions are True. Since one is False, result is False.' },
    { q: 'What is the output of: print(False or True)', options: ['True', 'False', 'Error', 'None'], correct: 0, explanation: 'The "or" operator returns True if at least ONE condition is True.' },
    { q: 'Which loop is best when you know how many times to iterate?', options: ['while loop', 'for loop', 'do-while loop', 'repeat loop'], correct: 1, explanation: 'for loop is best when you know the number of iterations. Python does not have do-while or repeat loops.' },
    { q: 'What happens if while loop condition is always True?', options: ['Error occurs', 'Runs once', 'Infinite loop', 'Skips the loop'], correct: 2, explanation: 'If the condition never becomes False, the loop runs forever — this is called an infinite loop!' },
    { q: 'What is short-circuit evaluation?', options: ['Fast code execution', 'Stopping evaluation when result is already determined', 'Skipping a loop', 'Using shortcuts in code'], correct: 1, explanation: 'Python stops evaluating logical expressions as soon as the result is determined. E.g., in "False and X", X is never checked.' },
];

export default function ControlMCQ() {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState<Record<number, boolean>>({});
    const [score, setScore] = useState<number | null>(null);

    const handleSelect = (qi: number, oi: number) => { if (showResults[qi]) return; setAnswers(p => ({ ...p, [qi]: oi })); };
    const handleCheck = (qi: number) => { setShowResults(p => ({ ...p, [qi]: true })); };
    const handleCheckAll = () => { const all: Record<number, boolean> = {}; let s = 0; mcqs.forEach((m, i) => { all[i] = true; if (answers[i] === m.correct) s++; }); setShowResults(all); setScore(s); };
    const handleReset = () => { setAnswers({}); setShowResults({}); setScore(null); };

    return (
        <div>
            {score !== null && (
                <div className="mb-5 p-4 rounded-2xl text-center font-bold text-sm" style={{
                    background: score >= 7 ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)' : score >= 4 ? 'linear-gradient(135deg, #fefce8, #fef9c3)' : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                    border: `1px solid ${score >= 7 ? '#86efac' : score >= 4 ? '#fde047' : '#fca5a5'}`,
                    color: score >= 7 ? '#166534' : score >= 4 ? '#854d0e' : '#991b1b',
                }}>
                    🎯 Your Score: {score}/{mcqs.length} {score >= 7 ? '— Excellent! 🌟' : score >= 4 ? '— Good effort! 💪' : '— Keep practicing! 📚'}
                </div>
            )}
            <div className="space-y-4">
                {mcqs.map((m, qi) => {
                    const selected = answers[qi]; const revealed = showResults[qi];
                    return (
                        <div key={qi} className="rounded-2xl overflow-hidden transition-all duration-300" style={{
                            background: '#fff', boxShadow: revealed ? (selected === m.correct ? '0 0 0 2px #22c55e, 0 4px 12px rgba(34,197,94,0.1)' : '0 0 0 2px #ef4444, 0 4px 12px rgba(239,68,68,0.1)') : '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
                            border: '1px solid #f1f5f9',
                        }}>
                            <div className="px-5 py-3.5 flex items-start gap-3" style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', borderBottom: '1px solid #e2e8f0' }}>
                                <span className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>{qi + 1}</span>
                                <p className="text-sm font-semibold leading-relaxed pt-1" style={{ color: '#1e293b' }}>{m.q}</p>
                            </div>
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {m.options.map((opt, oi) => {
                                    const isSel = selected === oi, isCor = m.correct === oi;
                                    let bg = '#f8fafc', border = '#e2e8f0', tc = '#475569';
                                    if (revealed && isCor) { bg = '#ecfdf5'; border = '#86efac'; tc = '#166534'; }
                                    else if (revealed && isSel) { bg = '#fef2f2'; border = '#fca5a5'; tc = '#991b1b'; }
                                    else if (isSel) { bg = '#eef2ff'; border = '#a5b4fc'; tc = '#4338ca'; }
                                    return (
                                        <button key={oi} onClick={() => handleSelect(qi, oi)} disabled={!!revealed}
                                            className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-left text-xs font-medium transition-all duration-200 hover:shadow-md"
                                            style={{ background: bg, border: `1.5px solid ${border}`, color: tc }}>
                                            <span className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold" style={{
                                                background: isSel ? (revealed ? (isCor ? '#22c55e' : '#ef4444') : '#6366f1') : '#f1f5f9',
                                                color: isSel ? '#fff' : '#94a3b8', border: `1px solid ${isSel ? 'transparent' : '#e2e8f0'}`,
                                            }}>
                                                {revealed && isCor ? <CheckCircle2 size={14} /> : revealed && isSel ? <XCircle size={14} /> : String.fromCharCode(65 + oi)}
                                            </span>
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                            {!revealed && selected !== undefined && (
                                <div className="px-5 pb-4">
                                    <button onClick={() => handleCheck(qi)} className="text-xs font-bold px-5 py-2 rounded-xl transition-all hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>
                                        Check Answer <ChevronRight size={12} className="inline ml-1" />
                                    </button>
                                </div>
                            )}
                            {revealed && (
                                <div className="px-5 pb-4">
                                    <div className="text-xs p-3 rounded-xl" style={{ background: '#eef2ff', border: '1px solid #c7d2fe', color: '#4338ca' }}>
                                        💡 {m.explanation}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
                <button onClick={handleCheckAll} disabled={Object.keys(answers).length === 0} className="text-sm font-bold px-6 py-3 rounded-2xl transition-all hover:shadow-xl disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
                    Submit All ({Object.keys(answers).length}/{mcqs.length})
                </button>
                <button onClick={handleReset} className="text-sm font-bold px-6 py-3 rounded-2xl transition-all hover:shadow-md" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>
                    Reset Quiz
                </button>
            </div>
        </div>
    );
}
