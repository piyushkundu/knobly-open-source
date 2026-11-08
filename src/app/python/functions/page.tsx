'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Home, BookOpen, Copy, Check, LayoutDashboard, StickyNote,
    Code2, Brain, Keyboard as KBIcon, Sparkles, ChevronRight, Zap,
    FunctionSquare, GitFork, RotateCcw, Layers, Hash, List
} from 'lucide-react';

/* ─── Code Block ─── */
function CB({ code }: { code: string }) {
    const [c, setC] = useState(false);
    const copy = () => { navigator.clipboard.writeText(code); setC(true); setTimeout(() => setC(false), 2000); };
    return (
        <div className="relative rounded-2xl overflow-hidden my-3" style={{ background: '#0f172a', boxShadow: '0 4px 16px rgba(15,23,42,0.15)', border: '1px solid #1e293b' }}>
            <div className="flex items-center justify-between px-4 py-1.5" style={{ background: '#020617', borderBottom: '1px solid #1e293b' }}>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.18em] font-bold text-slate-400">python</span>
                </div>
                <button onClick={copy} className="text-xs flex items-center gap-1 transition-colors" style={{ color: c ? '#34d399' : '#64748b' }}>
                    {c ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm text-slate-200"><code>{code}</code></pre>
        </div>
    );
}

/* ─── Section ─── */
function Sec({ id, title, icon, children }: { id: string; title: string; icon: ReactNode; children: ReactNode }) {
    return (
        <section id={id} className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
                {icon}
                <h2 className="text-base md:text-lg font-extrabold" style={{ color: '#0f172a' }}>{title}</h2>
            </div>
            <div className="text-sm leading-relaxed space-y-3" style={{ color: '#334155' }}>{children}</div>
        </section>
    );
}

/* ─── Info Box ─── */
function IB({ type = 'tip', children }: { type?: 'tip' | 'note' | 'warning'; children: ReactNode }) {
    const s = {
        tip: { bg: '#fdf4ff', border: '#f0abfc', text: '#86198f', emoji: '💡' },
        note: { bg: '#f0fdf4', border: '#86efac', text: '#166534', emoji: '📝' },
        warning: { bg: '#fffbeb', border: '#fde047', text: '#b45309', emoji: '⚠️' }
    };
    const st = s[type];
    return <div className="rounded-xl p-3.5 text-sm font-medium my-3" style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.text }}>{st.emoji} {children}</div>;
}

/* ─── Method Card ─── */
function MC({ name, desc, children, color }: { name: string; desc: string; children: ReactNode; color: string }) {
    return (
        <div className="rounded-2xl overflow-hidden mb-4" style={{ border: `1px solid ${color}30`, background: `${color}05` }}>
            <div className="px-4 py-3 flex flex-wrap items-center gap-2" style={{ borderBottom: `1px solid ${color}20` }}>
                <code className="text-sm font-extrabold font-mono" style={{ color }}>{name}</code>
                <span className="text-xs font-medium" style={{ color: '#64748b' }}>— {desc}</span>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

/* ─── Program Card ─── */
function ProgCard({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid #e0e7ff', background: '#eef2ff' }}>
            <div className="px-4 py-2.5 flex items-center gap-2" style={{ borderBottom: '1px solid #e0e7ff', background: '#eef2ff' }}>
                <Code2 size={14} className="text-indigo-500" />
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">{title}</span>
            </div>
            <div className="p-4 bg-white">{children}</div>
        </div>
    );
}

const tocItems = [
    { icon: <BookOpen size={13} />, label: 'Introduction', id: 'intro', color: '#6366f1' },
    { icon: <FunctionSquare size={13} />, label: 'Define a Function', id: 'define', color: '#8b5cf6' },
    { icon: <Zap size={13} />, label: 'Invoking a Function', id: 'invoke', color: '#a855f7' },
    { icon: <Layers size={13} />, label: 'Function Arguments', id: 'arguments', color: '#c026d3' },
    { icon: <GitFork size={13} />, label: 'Types of Function', id: 'types', color: '#db2777' },
    { icon: <RotateCcw size={13} />, label: 'Recursion', id: 'recursion', color: '#e11d48' },
    { icon: <Brain size={13} />, label: 'Practice Questions', id: 'practice', color: '#f43f5e' },
];

const navLinks = [
    { label: 'Home', href: '/', icon: <Home size={14} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={14} /> },
    { label: 'Notes', href: '/notes', icon: <StickyNote size={14} /> },
    { label: 'Python', href: '/python', icon: <Code2 size={14} /> },
    { label: 'MCQ', href: '/mcq', icon: <Brain size={14} /> },
    { label: 'Shortcuts', href: '/shortcuts', icon: <KBIcon size={14} /> },
];

export default function UserDefinedFunctionsPage() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('intro');

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #eef2ff 0%, #ede9fe 40%, #fdf4ff 100%)' }}>

            {/* ═══ NAVBAR ═══ */}
            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/python" className="flex items-center justify-center w-9 h-9 rounded-xl hover:scale-105 transition-all" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>
                            <ArrowLeft size={16} className="text-white" />
                        </Link>
                        <div>
                            <h1 className="text-sm font-extrabold" style={{ color: '#0f172a' }}>User Defined Functions</h1>
                            <div className="flex items-center gap-1.5">
                                <Sparkles size={8} style={{ color: '#6366f1' }} />
                                <span className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: '#6366f1' }}>Chapter 7 • Python</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        {navLinks.map(l => (
                            <Link key={l.href} href={l.href}
                                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-105"
                                style={{ color: '#64748b' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#6366f1'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
                                {l.icon}<span>{l.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #a855f7, #db2777, #e11d48, #4f46e5)' }} />
            </header>

            <div className="max-w-7xl mx-auto flex relative">
                {/* ── SIDEBAR ── */}
                <aside className={`${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[52px] left-0 z-40 lg:z-10 w-64 lg:w-56 xl:w-64 h-[calc(100vh-52px)] overflow-y-auto transition-transform duration-300 lg:flex-shrink-0`}
                    style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', borderRight: '1px solid #e2e8f0' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                                <Hash size={12} className="text-white" />
                            </div>
                            <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: '#0f172a' }}>Contents</span>
                        </div>
                        <nav className="space-y-0.5">
                            {tocItems.map(item => (
                                <a key={item.id} href={`#${item.id}`}
                                    onClick={() => { setActiveSection(item.id); setTocOpen(false); }}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
                                    style={{ background: activeSection === item.id ? `${item.color}12` : 'transparent', border: activeSection === item.id ? `1px solid ${item.color}30` : '1px solid transparent', color: activeSection === item.id ? item.color : '#64748b' }}
                                    onMouseEnter={e => { if (activeSection !== item.id) { e.currentTarget.style.background = '#eef2ff'; } }}
                                    onMouseLeave={e => { if (activeSection !== item.id) { e.currentTarget.style.background = 'transparent'; } }}>
                                    <span style={{ color: item.color }}>{item.icon}</span>
                                    {item.label}
                                    {activeSection === item.id && <ChevronRight size={10} className="ml-auto" />}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>
                {tocOpen && <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setTocOpen(false)} />}

                {/* ── MAIN ── */}
                <main className="flex-1 min-w-0 px-4 py-6 lg:pl-6">

                    {/* HERO */}
                    <section className="relative rounded-3xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #7c3aed 100%)', boxShadow: '0 8px 32px rgba(99,102,241,0.28)' }}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)' }} />
                            <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)' }} />
                        </div>
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
                                <Sparkles size={10} /> Chapter 7 • Python
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: '#ffffff' }}>User Defined Functions</h2>
                            <p className="text-sm md:text-base max-w-2xl mb-5" style={{ color: 'rgba(255,255,255,0.90)' }}>
                                पायथन में खुद के function बनाना सीखें। Define करना, call करना, arguments, function के types और recursion — सब कुछ यहाँ है! <span className="font-bold">Date: 18/12/21</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { icon: <FunctionSquare size={14} />, label: 'Define & Invoke' },
                                    { icon: <Layers size={14} />, label: 'All Argument Types' },
                                    { icon: <GitFork size={14} />, label: '4 Function Types' },
                                    { icon: <RotateCcw size={14} />, label: 'Recursion' },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm" style={{ color: '#ffffff', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.28)' }}>
                                        {s.icon}<span>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ═══════════════════════════
                        1. INTRODUCTION
                    ═══════════════════════════ */}
                    <Sec id="intro" title="Introduction →" icon={<BookOpen size={18} className="text-indigo-600" />}>
                        <p>पायथन में <strong>built-in library function</strong> के अलावा user स्वयं function बना सकता है। यूजर के द्वारा बनाए गए function <strong>user defined function</strong> कहलाते हैं।</p>
                        <p>एक बार function बनाने के बाद उसे <strong>बार-बार call करके</strong> प्रयोग किया जा सकता है।</p>
                        <IB type="note">फंक्शन बनाने तथा प्रयोग करने के लिए <strong>दो स्टेप्स</strong> हैं:<br />1. Define a function<br />2. Calling to function or Invoking a function</IB>
                    </Sec>

                    {/* ═══════════════════════════
                        2. DEFINE A FUNCTION
                    ═══════════════════════════ */}
                    <Sec id="define" title="1. Define a function →" icon={<FunctionSquare size={18} className="text-indigo-600" />}>
                        <p><code className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono text-xs">def</code> keyword का प्रयोग करके नया function बनाया जाता है तथा उसमें codes लिखे जाते हैं। यह function की <strong>definition</strong> होती है। function कोई value return कर सकता है या नहीं भी।</p>

                        <div className="mt-4 mb-2">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Syntax</span>
                        </div>
                        <CB code={`def <function name> (<list of argument>):
    <statement>
    return <expression>`} />

                        <div className="mb-2">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Example</span>
                        </div>
                        <CB code={`def sum(a, b):
    t = a + b
    return t`} />

                        <IB type="tip">
                            <strong>def</strong> keyword से function शुरू होता है। Function का नाम, parentheses में arguments, और colon (:) लगाना ज़रूरी है। Body indented होती है।
                        </IB>
                    </Sec>

                    {/* ═══════════════════════════
                        3. INVOKING A FUNCTION
                    ═══════════════════════════ */}
                    <Sec id="invoke" title="2. Invoking a function →" icon={<Zap size={18} className="text-purple-600" />}>
                        <p>function define करने के बाद इसके result को प्राप्त करने के लिए function को <strong>call</strong> किया जाता है। function call करने को <strong>invoking</strong> कहा जाता है।</p>
                        <p>function के नाम invoking का प्रयोग करके call किया जा सकता है।</p>

                        <div className="mt-4 mb-2">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Syntax</span>
                        </div>
                        <CB code={`<function name> (<list of argument>)`} />

                        <div className="mb-2">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Example</span>
                        </div>
                        <CB code={`def sum(a, b):
    t = a + b
    return t

a = sum(5, 2)
print(a)
print(sum(5 + a))

# Output:
# 7
# 12`} />
                    </Sec>

                    {/* ═══════════════════════════
                        4. FUNCTION ARGUMENTS
                    ═══════════════════════════ */}
                    <Sec id="arguments" title="Function Argument :-" icon={<Layers size={18} className="text-fuchsia-600" />}>
                        <p>फंक्शन के अंदर में प्रयोग किये गये variables <strong>function argument</strong> कहलाते हैं।</p>
                        <p>ये calling function से आने वाली value को प्राप्त करते हैं तथा store करते हैं।</p>
                        <IB type="note">पायथन <strong>तीन प्रकार</strong> के argument support करता है — (i) Positional argument &nbsp;(ii) Default argument &nbsp;(iii) Named argument</IB>

                        {/* (i) Positional */}
                        <MC name="(i) Positional argument" desc="arguments की संख्या values के समान होनी चाहिए" color="#6366f1">
                            <p className="text-sm text-slate-600 mb-3">जिन arguments की संख्या arguments के समान मानों की आवश्यकता होती है positional argument कहलाते हैं।</p>
                            <CB code={`def sum(a, b):
    t = a + b
    return t

x = y = z = 6
print(sum(5, 6))   # 11
c = sum(x, y)      # 12
d = sum(5, z)      # 11`} />
                        </MC>

                        {/* (ii) Default */}
                        <MC name="(ii) Default argument" desc="function header में पहले से मान दिए जाते हैं" color="#8b5cf6">
                            <p className="text-sm text-slate-600 mb-3">function header में जिन arguments को पहले से मान दिए जाते हैं वे <strong>default argument</strong> होते हैं।</p>
                            <CB code={`def sum(a, b=0):
    t = a + b
    return t

x = y = z = 6
print(sum(5, 6))   # → 11
c = sum(x, y)      # → 12
d = sum(5, z)      # → 11
e = sum(9)         # → 9  (b uses default value 0)`} />
                        </MC>

                        {/* (iii) Named/Keyword */}
                        <MC name="(iii) Named / keyword argument" desc="arguments को उनके नाम से pass करना" color="#a855f7">
                            <p className="text-sm text-slate-600 mb-3">function calling के समय arguments को उनके <strong>नाम से pass</strong> करने पर named argument प्रयोग किए जाते हैं। इसमें calling के समय sequence में मान देने की आवश्यकता नहीं होती।</p>
                            <CB code={`def sum(b=4, a=5, c=6):
    t = a + b + c
    return t

z = sum(4, 5, 6)           # positional — 15
x = sum(c=4, a=5, b=3)     # named — 12
y = sum()                  # all defaults — 15`} />
                            <IB type="tip">Named arguments में <strong>order matter नहीं करता</strong> — आप किसी भी क्रम में arguments दे सकते हैं।</IB>
                        </MC>
                    </Sec>

                    {/* ═══════════════════════════
                        5. TYPES OF FUNCTION
                    ═══════════════════════════ */}
                    <Sec id="types" title="Type of Function :-" icon={<GitFork size={18} className="text-pink-600" />}>
                        <p>function argument तथा return value के आधार पर function <strong>चार प्रकार</strong> के होते हैं —</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                            {[
                                { n: '1', t: 'Function with Input and Output', c: '#6366f1' },
                                { n: '2', t: 'Function with Input, without Output', c: '#8b5cf6' },
                                { n: '3', t: 'Function without Input, with Output', c: '#a855f7' },
                                { n: '4', t: 'Function without Input and Output', c: '#db2777' },
                            ].map(item => (
                                <div key={item.n} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${item.c}08`, border: `1px solid ${item.c}25` }}>
                                    <span className="w-8 h-8 flex items-center justify-center rounded-lg text-white text-sm font-black flex-shrink-0" style={{ background: item.c }}>{item.n}</span>
                                    <span className="text-xs font-semibold" style={{ color: '#334155' }}>{item.t}</span>
                                </div>
                            ))}
                        </div>

                        {/* Type 1 */}
                        <div className="mt-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-7 h-7 flex items-center justify-center rounded-lg text-white text-xs font-black" style={{ background: '#6366f1' }}>1</span>
                                <h3 className="text-base font-extrabold text-slate-800">Function with Input and Output :-</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">इस प्रकार के function एक या अधिक value argument के रूप में <strong>input</strong> करते हैं तथा एक value <strong>return</strong> करते हैं।</p>
                            <ProgCard title="Program — Factorial">
                                <p className="text-sm text-slate-600 mb-3">एक program लिखें जिसमें एक number input कर उसके factorial की गणना करें।</p>
                                <CB code={`def fact(a):
    f = 1
    for i in range(a, 0, -1):
        f = f * i
    return f

# main program
n = int(input("Enter any no."))
print(fact(n))`} />
                            </ProgCard>
                        </div>

                        {/* Type 2 */}
                        <div className="mt-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-7 h-7 flex items-center justify-center rounded-lg text-white text-xs font-black" style={{ background: '#8b5cf6' }}>2</span>
                                <h3 className="text-base font-extrabold text-slate-800">Function with Input without Return :-</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">इस प्रकार के function एक या अधिक argument <strong>input</strong> करते हैं तथा <strong>कोई भी value return नहीं</strong> करते।</p>
                            <ProgCard title="Program — Table">
                                <p className="text-sm text-slate-600 mb-3">एक program लिखें जिसमें एक number input कर उसकी table को 10 तक print करें।</p>
                                <CB code={`def table(a):
    for i in range(1, 11):
        print(a, "*", i, "=", a * i)

# main program
n = int(input("Enter any value"))
table(n)`} />
                            </ProgCard>
                        </div>

                        {/* Type 3 */}
                        <div className="mt-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-7 h-7 flex items-center justify-center rounded-lg text-white text-xs font-black" style={{ background: '#a855f7' }}>3</span>
                                <h3 className="text-base font-extrabold text-slate-800">Function without Input arg & with Return :-</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">इस प्रकार के function में <strong>input argument नहीं</strong> होते परन्तु यह एक value <strong>return</strong> करते हैं।</p>
                            <ProgCard title="Program — Even Sum (First 50)">
                                <p className="text-sm text-slate-600 mb-3">पहले 50 सम संख्याओं की गणना कर print करने के लिए एक program लिखें।</p>
                                <CB code={`def even_sum():
    t = 0
    for a in range(1, 51):
        t = t + a * 2
    return t

print(even_sum())`} />
                            </ProgCard>
                        </div>

                        {/* Type 4 */}
                        <div className="mt-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-7 h-7 flex items-center justify-center rounded-lg text-white text-xs font-black" style={{ background: '#db2777' }}>4</span>
                                <h3 className="text-base font-extrabold text-slate-800">Function without Input & Output :-</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">इस प्रकार के function <strong>ना तो कोई argument input</strong> करते हैं और <strong>ना ही कोई value return</strong> करते हैं।</p>
                            <ProgCard title="Program — Pattern">
                                <p className="text-sm text-slate-600 mb-3">निम्न pattern उत्पन्न करने के लिए एक program लिखें।</p>
                                <CB code={`def pattern():
    for a in range(1, 6):
        for b in range(a, 5):
            print(" ", end=" ")
        for c in range(1, a + 1):
            print(c, end=" ")
        print(" ")

# main program
pattern()

# Output Pattern:
#         1
#       1 2
#     1 2 3
#   1 2 3 4
# 1 2 3 4 5`} />
                            </ProgCard>
                        </div>
                    </Sec>

                    {/* ═══════════════════════════
                        6. RECURSION
                    ═══════════════════════════ */}
                    <Sec id="recursion" title="Recursion —" icon={<RotateCcw size={18} className="text-rose-600" />}>
                        <p>जब एक <strong>function स्वयं को call</strong> करता है तब यह प्रक्रिया <strong>recursion</strong> कहलाती है।</p>
                        <p>Recursion एक <strong>loop के समान</strong> कार्य करता है जिसे रोकने के लिए एक <strong>terminate condition</strong> दी जाती है।</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                            <div className="p-4 rounded-xl" style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
                                <p className="text-xs font-bold text-rose-700 mb-2">Direct Recursion (खुद को call करना)</p>
                                <CB code={`def test():
    test()`} />
                            </div>
                            <div className="p-4 rounded-xl" style={{ background: '#fdf4ff', border: '1px solid #f5d0fe' }}>
                                <p className="text-xs font-bold text-fuchsia-700 mb-2">Indirect Recursion (दूसरे function के through)</p>
                                <CB code={`def test():
    retest()

def retest():
    test()`} />
                            </div>
                        </div>

                        <IB type="warning">Recursion में हमेशा एक <strong>base condition (terminate condition)</strong> होनी चाहिए। बिना इसके program infinite loop में चला जाएगा।</IB>

                        <ProgCard title="Program — Sum of N Natural Numbers (Recursion)">
                            <p className="text-sm text-slate-600 mb-3">पहले N प्राकृतिक संख्याओं का योग print करने के लिए recursion program बनाएं।</p>
                            <CB code={`def sum(a):
    if a == 1:
        return 1
    else:
        return a + sum(a - 1)

# main program
n = int(input("Enter any value"))
print(sum(n))

# Example: n = 5
# sum(5) = 5 + sum(4)
# sum(4) = 4 + sum(3)
# sum(3) = 3 + sum(2)
# sum(2) = 2 + sum(1)
# sum(1) = 1  ← base case
# Result = 5 + 4 + 3 + 2 + 1 = 15`} />
                        </ProgCard>

                        <div className="mt-4 p-4 rounded-xl" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                            <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2"><List size={14} />Recursion के Key Points :</h4>
                            <ul className="space-y-2 text-sm text-emerald-900">
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />एक function जो खुद को call करे वह <strong>recursive function</strong> है</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /><strong>Base condition</strong> अनिवार्य है — वरना Stack Overflow!</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />हर recursive call problem को <strong>छोटा</strong> बनाती जाती है</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />Python का default recursion limit = <strong>1000</strong></li>
                            </ul>
                        </div>
                    </Sec>

                    {/* ═══════════════════════════
                        7. PRACTICE QUESTIONS
                    ═══════════════════════════ */}
                    <Sec id="practice" title="Practice Questions :-" icon={<Brain size={18} className="text-indigo-600" />}>
                        <p className="mb-4 text-slate-700">इन programs को खुद लिखने का प्रयास करें — Chapter 7 को और अच्छे से समझने के लिए 💪</p>

                        <div className="space-y-3">
                            {[
                                "Write a function to find the sum of two numbers and return the result.",
                                "Write a function that takes a number and prints its multiplication table up to 10.",
                                "Write a function (no input, no return) to print a right-angle triangle pattern of stars.",
                                "Write a recursive function to find the factorial of a number.",
                                "Write a function to check whether a given number is even or odd.",
                                "Write a function to find the largest of three numbers using arguments.",
                                "Write a function using default argument to calculate simple interest (default rate = 5%).",
                                "Write a function using keyword arguments to display student details (name, roll, marks).",
                                "Write a recursive function to calculate the sum of first N natural numbers.",
                                "Write a function (no input, with return) to return the sum of first 100 natural numbers.",
                                "Write a function to count and return the number of vowels in a given string.",
                                "Write a function to reverse a string and return the reversed string.",
                                "Write a recursive function to calculate power (x^n) without using the ** operator.",
                                "Write a function to check whether a number is prime and return True/False.",
                                "Write a function using positional arguments to calculate the area of a rectangle.",
                            ].map((q, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-indigo-300">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-white font-extrabold text-sm" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                                        Q{idx + 1}
                                    </div>
                                    <div className="text-slate-800 font-medium text-[15px] leading-relaxed pt-2">{q}</div>
                                    <button
                                        onClick={() => { const ev = new CustomEvent('toggle-knobly-ai'); window.dispatchEvent(ev); }}
                                        className="ml-auto w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                                        title="Ask AI to Explain"
                                    >
                                        <Sparkles size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Sec>

                </main>
            </div>
        </div>
    );
}
