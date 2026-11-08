'use client';
import { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

interface MCQ { q: string; options: string[]; correct: number; explanation: string; }

const mcqs: MCQ[] = [
    { q: 'Python List mein elements ka order maintain hota hai ya nahi?', options: ['Nahi hota', 'Haan, ordered hai', 'Random order', 'Alphabetical order'], correct: 1, explanation: 'Python lists ordered hain — elements jis order mein daale, usi order mein rahte hain.' },
    { q: 'List mein elements change kar sakte hain ya nahi?', options: ['Nahi, immutable hai', 'Haan, mutable hai', 'Sirf numbers change ho sakte hain', 'Sirf strings change ho sakte hain'], correct: 1, explanation: 'Lists mutable hain — aap elements add, remove, ya modify kar sakte ho creation ke baad bhi.' },
    { q: 'fruits = ["apple", "banana", "cherry"]\nfruits[1] ka output kya hoga?', options: ['apple', 'banana', 'cherry', 'Error'], correct: 1, explanation: 'Python mein indexing 0 se shuru hoti hai. Index 0 = apple, Index 1 = banana, Index 2 = cherry.' },
    { q: 'fruits[-1] kya return karega?', options: ['First element', 'Last element', 'Error', 'None'], correct: 1, explanation: 'Negative indexing mein -1 = last element, -2 = second last, aur aige aise hi.' },
    { q: 'append() aur extend() mein kya fark hai?', options: ['Koi fark nahi', 'append ek element add karta hai, extend puri list add karta hai', 'extend ek element add karta hai', 'Dono same hain'], correct: 1, explanation: 'append() ek single element end mein add karta hai. extend() ek iterable ke saare elements add karta hai.' },
    { q: 'nums = [1,2,3]\nnums.insert(1, 10)\nprint(nums) ka output?', options: ['[1, 2, 3, 10]', '[10, 1, 2, 3]', '[1, 10, 2, 3]', '[1, 2, 10, 3]'], correct: 2, explanation: 'insert(1, 10) means index 1 par 10 insert karo. Toh 10, index 1 par aa jaayega aur baaki shift ho jaayenge.' },
    { q: 'pop() aur remove() mein kya fark hai?', options: ['Koi fark nahi', 'pop index se remove karta hai, remove value se', 'remove index se karta hai', 'Dono value se remove karte hain'], correct: 1, explanation: 'pop(index) index ke basis par remove karta hai. remove(value) pehli matching value ko remove karta hai.' },
    { q: 'nums = [3,1,4,1,5]\nnums.sort()\nprint(nums) ka output?', options: ['[3,1,4,1,5]', '[5,4,3,1,1]', '[1,1,3,4,5]', 'Error'], correct: 2, explanation: 'sort() list ko ascending order (chhote se bade) mein sort karta hai.' },
    { q: 'List slicing mein nums[1:4] kya return karega? nums = [10,20,30,40,50]', options: ['[10,20,30]', '[20,30,40]', '[20,30,40,50]', '[10,20,30,40]'], correct: 1, explanation: 'Slicing [1:4] means index 1 se 3 tak (4 excluded). Toh elements: 20, 30, 40.' },
    { q: 'List comprehension kya hai?', options: ['List ko delete karna', 'Ek line mein naya list banana', 'List ko print karna', 'List ko sort karna'], correct: 1, explanation: 'List comprehension ek shortcut hai jisse aap ek line mein naya list bana sakte ho. Jaise: [x**2 for x in range(5)]' },
];

export default function ListsMCQ() {
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
                <div className="mb-5 p-4 rounded-2xl text-center font-bold text-sm" style={{ background: score >= 7 ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)' : score >= 4 ? 'linear-gradient(135deg, #fefce8, #fef9c3)' : 'linear-gradient(135deg, #fef2f2, #fee2e2)', border: `1px solid ${score >= 7 ? '#86efac' : score >= 4 ? '#fde047' : '#fca5a5'}`, color: score >= 7 ? '#166534' : score >= 4 ? '#854d0e' : '#991b1b' }}>
                    🎯 Score: {score}/{mcqs.length} {score >= 7 ? '— Excellent! 🌟' : score >= 4 ? '— Good! 💪' : '— Keep practicing! 📚'}
                </div>
            )}
            <div className="space-y-4">
                {mcqs.map((m, qi) => {
                    const selected = answers[qi]; const revealed = showResults[qi];
                    return (
                        <div key={qi} className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: revealed ? (selected === m.correct ? '0 0 0 2px #22c55e' : '0 0 0 2px #ef4444') : '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                            <div className="px-5 py-3.5 flex items-start gap-3" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <span className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>{qi + 1}</span>
                                <p className="text-sm font-semibold pt-1 whitespace-pre-line" style={{ color: '#1e293b' }}>{m.q}</p>
                            </div>
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {m.options.map((opt, oi) => {
                                    const isSel = selected === oi, isCor = m.correct === oi;
                                    let bg = '#f8fafc', border = '#e2e8f0', tc = '#475569';
                                    if (revealed && isCor) { bg = '#ecfdf5'; border = '#86efac'; tc = '#166534'; }
                                    else if (revealed && isSel) { bg = '#fef2f2'; border = '#fca5a5'; tc = '#991b1b'; }
                                    else if (isSel) { bg = '#eef2ff'; border = '#a5b4fc'; tc = '#4338ca'; }
                                    return (
                                        <button key={oi} onClick={() => handleSelect(qi, oi)} disabled={!!revealed} className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-left text-xs font-medium transition-all hover:shadow-md" style={{ background: bg, border: `1.5px solid ${border}`, color: tc }}>
                                            <span className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold" style={{ background: isSel ? (revealed ? (isCor ? '#22c55e' : '#ef4444') : '#6366f1') : '#f1f5f9', color: isSel ? '#fff' : '#94a3b8' }}>
                                                {revealed && isCor ? <CheckCircle2 size={14} /> : revealed && isSel ? <XCircle size={14} /> : String.fromCharCode(65 + oi)}
                                            </span>{opt}
                                        </button>
                                    );
                                })}
                            </div>
                            {!revealed && selected !== undefined && <div className="px-5 pb-4"><button onClick={() => handleCheck(qi)} className="text-xs font-bold px-5 py-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}>Check Answer <ChevronRight size={12} className="inline ml-1" /></button></div>}
                            {revealed && <div className="px-5 pb-4"><div className="text-xs p-3 rounded-xl" style={{ background: '#eef2ff', border: '1px solid #c7d2fe', color: '#4338ca' }}>💡 {m.explanation}</div></div>}
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
                <button onClick={handleCheckAll} disabled={Object.keys(answers).length === 0} className="text-sm font-bold px-6 py-3 rounded-2xl disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}>Submit All ({Object.keys(answers).length}/{mcqs.length})</button>
                <button onClick={handleReset} className="text-sm font-bold px-6 py-3 rounded-2xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>Reset Quiz</button>
            </div>
        </div>
    );
}
