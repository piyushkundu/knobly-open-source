'use client';
import { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

interface MCQ { q: string; options: string[]; correct: number; explanation: string; }

const mcqs: MCQ[] = [
    { q: 'Who developed Python?', options: ['James Gosling', 'Guido van Rossum', 'Dennis Ritchie', 'Bjarne Stroustrup'], correct: 1, explanation: 'Python was created by Guido van Rossum and first released in 1991.' },
    { q: 'Which of the following is a valid Python identifier?', options: ['2name', 'my-var', '_private', '$amount'], correct: 2, explanation: 'Identifiers can start with a letter or underscore. _private is valid.' },
    { q: 'What is the output of 10 // 3?', options: ['3.33', '3', '4', '3.0'], correct: 1, explanation: '// is floor division. 10 // 3 = 3 (rounds down to nearest integer).' },
    { q: 'Which keyword is NOT a Python keyword?', options: ['lambda', 'except', 'switch', 'yield'], correct: 2, explanation: 'Python does not have a "switch" keyword. It uses match/case (3.10+).' },
    { q: 'What does the input() function return?', options: ['int', 'float', 'str', 'bool'], correct: 2, explanation: 'input() always returns a string, even if the user enters a number.' },
    { q: 'What is the output of type(3.14)?', options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'double'>"], correct: 1, explanation: '3.14 is a floating-point number, so its type is float.' },
    { q: 'Which operator is used for exponentiation?', options: ['^', '**', '//', '%'], correct: 1, explanation: 'In Python, ** is the exponentiation operator. 2**3 = 8.' },
    { q: 'What is the output of "banana" in ["apple", "banana"]?', options: ['True', 'False', 'Error', 'None'], correct: 0, explanation: '"in" membership operator checks if value exists in sequence. Returns True.' },
    { q: 'Which is NOT a valid string literal?', options: ["'hello'", '"hello"', '"""hello"""', "'hello\""], correct: 3, explanation: 'Mixing quotes without escaping causes a syntax error.' },
    { q: 'What does is operator check?', options: ['Equality', 'Identity (same object)', 'Type', 'Value'], correct: 1, explanation: '"is" checks if two variables point to the same object in memory.' },
];

export default function MCQSection() {
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
