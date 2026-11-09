'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft, Home, BookOpen, Copy, Check, LayoutDashboard, StickyNote,
    Code2, Brain, Keyboard as KBIcon, Sparkles, ChevronRight, Zap,
    FunctionSquare, GitFork, RotateCcw, Layers, Hash, List,
    Eye, Lock, Globe, Package, Box, Settings, FileCode, Target
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
                    <span className="text-[9px] uppercase tracking-[0.18em] font-bold text-slate-600">python</span>
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

/* ─── Output Box ─── */
function OB({ output }: { output: string }) {
    return (
        <div className="rounded-xl overflow-hidden my-3" style={{ border: '1px solid #bbf7d0', background: '#f0fdf4' }}>
            <div className="px-3 py-1.5 flex items-center gap-2" style={{ background: '#dcfce7', borderBottom: '1px solid #bbf7d0' }}>
                <span className="text-[9px] uppercase tracking-[0.18em] font-bold text-emerald-700">Output</span>
            </div>
            <pre className="p-3 text-sm text-emerald-800 font-mono overflow-x-auto">{output}</pre>
        </div>
    );
}

/* ─── LEGB Layer Card ─── */
function LEGBCard({ letter, name, desc, color, example }: { letter: string; name: string; desc: string; color: string; example: string }) {
    return (
        <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${color}40`, background: `${color}08` }}>
            <div className="px-4 py-3 flex items-center gap-3" style={{ background: `${color}15`, borderBottom: `1px solid ${color}30` }}>
                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-lg" style={{ background: color }}>{letter}</span>
                <div>
                    <span className="text-sm font-extrabold" style={{ color }}>{name}</span>
                    <p className="text-xs text-slate-600">{desc}</p>
                </div>
            </div>
            <div className="p-4">
                <CB code={example} />
            </div>
        </div>
    );
}

const tocItems = [
    { icon: <BookOpen size={13} />, label: 'Introduction', id: 'intro', color: '#6366f1' },
    { icon: <Globe size={13} />, label: 'Global Scope', id: 'global-scope', color: '#059669' },
    { icon: <Lock size={13} />, label: 'Local Scope', id: 'local-scope', color: '#8b5cf6' },
    { icon: <Layers size={13} />, label: 'LEGB Rule', id: 'legb', color: '#e11d48' },
    { icon: <Zap size={13} />, label: 'Global Keyword', id: 'global-keyword', color: '#f59e0b' },
    { icon: <Package size={13} />, label: 'Module', id: 'module', color: '#0ea5e9' },
    { icon: <Box size={13} />, label: 'Creating Module', id: 'create-module', color: '#db2777' },
    { icon: <Settings size={13} />, label: 'Import Techniques', id: 'import-techniques', color: '#7c3aed' },
    { icon: <Target size={13} />, label: 'Questions & Programs', id: 'questions', color: '#c026d3' },
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

export default function ScopeModulePage() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('intro');

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 30%, #f0fdf4 60%, #ecfeff 100%)' }}>

            {/* ═══ NAVBAR ═══ */}
            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/python" className="flex items-center justify-center w-9 h-9 rounded-xl hover:scale-105 transition-all" style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 2px 8px rgba(5,150,105,0.3)' }}>
                            <ArrowLeft size={16} className="text-white" />
                        </Link>
                        <div>
                            <h1 className="text-sm font-extrabold" style={{ color: '#0f172a' }}>Scope and Module</h1>
                            <div className="flex items-center gap-1.5">
                                <Sparkles size={8} style={{ color: '#059669' }} />
                                <span className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: '#059669' }}>Chapter 9 • Python</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        {navLinks.map(l => (
                            <Link key={l.href} href={l.href}
                                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-105"
                                style={{ color: '#64748b' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.color = '#059669'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
                                {l.icon}<span>{l.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #059669, #10b981, #34d399, #6ee7b7, #0ea5e9, #059669)' }} />
            </header>

            <div className="max-w-7xl mx-auto flex relative">
                {/* ── SIDEBAR ── */}
                <aside className={`${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[52px] left-0 z-40 lg:z-10 w-64 lg:w-56 xl:w-64 h-[calc(100vh-52px)] overflow-y-auto transition-transform duration-300 lg:flex-shrink-0`}
                    style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', borderRight: '1px solid #e2e8f0' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
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
                                    onMouseEnter={e => { if (activeSection !== item.id) { e.currentTarget.style.background = '#ecfdf5'; } }}
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
                    <section className="relative rounded-3xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)', boxShadow: '0 8px 32px rgba(5,150,105,0.28)' }}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)' }} />
                            <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)' }} />
                            {/* Decorative scope circles */}
                            <div className="absolute top-8 right-8 w-32 h-32 rounded-full border-2 border-white/10" />
                            <div className="absolute top-12 right-12 w-24 h-24 rounded-full border-2 border-white/15" />
                            <div className="absolute top-16 right-16 w-16 h-16 rounded-full border-2 border-white/20" />
                            <div className="absolute top-20 right-20 w-8 h-8 rounded-full bg-white/20" />
                        </div>
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
                                <Sparkles size={10} /> Chapter 9 • Python
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: '#ffffff' }}>Scope and Module</h2>
                            <p className="text-sm md:text-base max-w-2xl mb-5" style={{ color: 'rgba(255,255,255,0.90)' }}>
                                Variable Scope, LEGB Rule, Global Keyword और Module — Python की modular programming को मास्टर करें! अपने code को organized और reusable बनाना सीखें।
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { icon: <Globe size={14} />, label: 'Variable Scope' },
                                    { icon: <Layers size={14} />, label: 'LEGB Rule' },
                                    { icon: <Zap size={14} />, label: 'Global Keyword' },
                                    { icon: <Package size={14} />, label: 'Modules' },
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
                    <Sec id="intro" title="Introduction — Variable Scope →" icon={<BookOpen size={18} className="text-indigo-600" />}>
                        <p>Variable ke <strong>scope</strong> se nirdharit hota hai ki ye variable <strong>kahan se use kiye ja sakte hain</strong> aur variable ki pahchan tatha program ke kis hisse me ki ja rahi hai aur use kis prakar access kiya ja sakta hai।</p>
                        
                        <IB type="note">Scope ka matlab hai ki ek variable program ke kaunse hisse me <strong>visible</strong> aur <strong>accessible</strong> hai। Sahi scope samajhna bugs se bachne ke liye bahut zaroori hai!</IB>

                        <p>Python me variable scope <strong>do prakar</strong> ke hote hain:</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                            <div className="p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', border: '2px solid #6ee7b7' }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-extrabold text-emerald-800">1. Global Scope</span>
                                        <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-bold">Program ke har jagah accessible</p>
                                    </div>
                                </div>
                                <p className="text-xs text-emerald-700">Main program me define kiye gaye variable</p>
                            </div>
                            <div className="p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '2px solid #c4b5fd' }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)' }}>
                                        <Lock size={20} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-extrabold text-violet-800">2. Local Scope</span>
                                        <p className="text-[10px] text-violet-600 uppercase tracking-wider font-bold">Sirf function ke andar accessible</p>
                                    </div>
                                </div>
                                <p className="text-xs text-violet-700">Function ke andar define kiye gaye variable</p>
                            </div>
                        </div>

                        {/* Visual Diagram */}
                        <div className="mt-6 p-5 rounded-2xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <h4 className="text-sm font-bold text-slate-800 mb-4 text-center">📊 Scope Visualization</h4>
                            <div className="relative p-6 rounded-xl mx-auto max-w-md" style={{ background: '#ecfdf5', border: '2px dashed #34d399' }}>
                                <span className="absolute -top-3 left-4 px-2 text-xs font-bold text-emerald-700 bg-white rounded">Global Scope</span>
                                <code className="text-xs text-emerald-700 block mb-3">x = 10 &nbsp;&nbsp;<span className="text-emerald-700"># global variable</span></code>
                                <div className="p-4 rounded-lg" style={{ background: '#f5f3ff', border: '2px dashed #a78bfa' }}>
                                    <span className="absolute left-8" style={{ marginTop: '-0.75rem' }}><span className="px-2 text-xs font-bold text-violet-700 bg-white rounded">Local Scope (function)</span></span>
                                    <code className="text-xs text-violet-700 block mt-2">y = 20 &nbsp;&nbsp;<span className="text-violet-600"># local variable</span></code>
                                    <code className="text-xs text-violet-700 block">print(x) &nbsp;<span className="text-violet-600"># ✅ access global</span></code>
                                    <code className="text-xs text-violet-700 block">print(y) &nbsp;<span className="text-violet-600"># ✅ access local</span></code>
                                </div>
                                <code className="text-xs text-emerald-700 block mt-3">print(x) &nbsp;<span className="text-emerald-700"># ✅ access global</span></code>
                                <code className="text-xs text-red-500 block">print(y) &nbsp;<span className="text-red-700"># ❌ Error! local variable</span></code>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══════════════════════════
                        2. GLOBAL SCOPE
                    ═══════════════════════════ */}
                    <Sec id="global-scope" title="1. Global Scope →" icon={<Globe size={18} className="text-emerald-600" />}>
                        <p>Main program me define kiye gaye variable <strong>global variable</strong> hote hain jinaka use program ke <strong>kisi bhi hisse me</strong> kiya ja sakta hai — chahe wo function ho ya loop.</p>

                        <IB type="note">Global variables poori script me accessible rehte hain। Inhe function ke bahar define kiya jata hai।</IB>
                        
                        <ProgCard title="Example — Global Variable">
                            <p className="text-sm text-slate-600 mb-3">Global variable ko program ke kisi bhi hisse me access kiya ja sakta hai।</p>
                            <CB code={`name = "Rahul"    # global variable

def greet():
    print("Hello", name)   # global variable accessed inside function

def farewell():
    print("Goodbye", name)  # same global variable in another function

greet()
farewell()
print("Welcome", name)     # global variable in main program`} />
                            <OB output={`Hello Rahul
Goodbye Rahul
Welcome Rahul`} />
                        </ProgCard>

                        <ProgCard title="Example — Global Variable with Loop">
                            <CB code={`total = 0    # global variable

for i in range(1, 6):
    total = total + i

def show():
    print("Sum =", total)  # accessing global variable

show()
print("Total =", total)`} />
                            <OB output={`Sum = 15
Total = 15`} />
                        </ProgCard>
                    </Sec>

                    {/* ═══════════════════════════
                        3. LOCAL SCOPE
                    ═══════════════════════════ */}
                    <Sec id="local-scope" title="2. Local Scope →" icon={<Lock size={18} className="text-violet-600" />}>
                        <p>User define function me banaya gaya variable <strong>local variable</strong> hota hai। Iska use <strong>keval usi function me</strong> kiya ja sakta hai — function ke bahar access karne par error aata hai।</p>
                        
                        <IB type="warning">Local variable ko function ke bahar access karne par <code>NameError</code> aata hai!</IB>

                        <ProgCard title="Example — Local Variable">
                            <CB code={`def calculate():
    a = 10        # local variable
    b = 20        # local variable
    result = a + b
    print("Inside function:", result)

calculate()
# print(a)   # ❌ NameError: name 'a' is not defined
# print(result)  # ❌ NameError`} />
                            <OB output={`Inside function: 30`} />
                        </ProgCard>

                        <ProgCard title="Question — Average Calculator">
                            <p className="text-sm text-slate-600 mb-3">Ek program likho jisme 3 number input kare aur user define function ka use karke unka average calculate kare।</p>
                            <CB code={`def average():
    a = int(input("Enter number 1: "))   # local variable
    b = int(input("Enter number 2: "))   # local variable
    c = int(input("Enter number 3: "))   # local variable
    avg = (a + b + c) / 3
    print("Average =", avg)

average()`} />
                            <OB output={`Enter number 1: 10
Enter number 2: 20
Enter number 3: 30
Average = 20.0`} />
                        </ProgCard>

                        <ProgCard title="Example — Same Variable Name (Local vs Global)">
                            <p className="text-sm text-slate-600 mb-3">Jab global aur local variable ka naam same ho to function me <strong>local variable ko preference</strong> milti hai।</p>
                            <CB code={`x = "Global X"     # global variable

def test():
    x = "Local X"   # local variable (same name)
    print("Inside function:", x)   # local variable print hoga

test()
print("Outside function:", x)   # global variable print hoga`} />
                            <OB output={`Inside function: Local X
Outside function: Global X`} />
                        </ProgCard>
                    </Sec>

                    {/* ═══════════════════════════
                        4. LEGB RULE ⭐
                    ═══════════════════════════ */}
                    <Sec id="legb" title="⭐ LEGB Rule →" icon={<Layers size={18} className="text-rose-600" />}>
                        <p>Jab kisi program ya function ke andar Python koi variable access karta hai to ek specific order follow karta hai jise <strong>LEGB Rule</strong> kehte hain। Python hamesha is order me variable search karta hai:</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
                            {[
                                { l: 'L', name: 'Local', color: '#8b5cf6', desc: 'Function ke andar' },
                                { l: 'E', name: 'Enclosing', color: '#ec4899', desc: 'Outer function me' },
                                { l: 'G', name: 'Global', color: '#059669', desc: 'Main program me' },
                                { l: 'B', name: 'Built-in', color: '#f59e0b', desc: 'Python ka built-in' },
                            ].map((item, i) => (
                                <div key={i} className="p-4 rounded-2xl text-center transition-all duration-300 hover:scale-105 hover:shadow-lg" style={{ background: `${item.color}10`, border: `2px solid ${item.color}30` }}>
                                    <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-white text-2xl font-black mb-2 shadow-lg" style={{ background: item.color }}>
                                        {item.l}
                                    </div>
                                    <p className="text-sm font-extrabold" style={{ color: item.color }}>{item.name}</p>
                                    <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
                                    {i < 3 && <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2" />}
                                </div>
                            ))}
                        </div>

                        <IB type="tip">Python sabse pehle <strong>Local</strong> scope check karta hai, phir <strong>Enclosing</strong>, phir <strong>Global</strong>, aur ant me <strong>Built-in</strong>। Jis level par variable mil jaye, wahi use hota hai!</IB>

                        {/* LEGB Flow Diagram */}
                        <div className="my-5 p-4 rounded-xl" style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
                            <h4 className="text-sm font-bold text-rose-800 mb-3 text-center">🔍 LEGB Search Flow</h4>
                            <div className="flex flex-col items-center gap-2">
                                <div className="px-6 py-2 rounded-lg text-white text-sm font-bold" style={{ background: '#8b5cf6' }}>1️⃣ Local — sabse pehle local variable check</div>
                                <span className="text-lg text-slate-600">↓</span>
                                <div className="px-6 py-2 rounded-lg text-white text-sm font-bold" style={{ background: '#ec4899' }}>2️⃣ Enclosing — phir enclosing block check</div>
                                <span className="text-lg text-slate-600">↓</span>
                                <div className="px-6 py-2 rounded-lg text-white text-sm font-bold" style={{ background: '#059669' }}>3️⃣ Global — main program me check</div>
                                <span className="text-lg text-slate-600">↓</span>
                                <div className="px-6 py-2 rounded-lg text-white text-sm font-bold" style={{ background: '#f59e0b' }}>4️⃣ Built-in — pre-defined function check</div>
                            </div>
                        </div>

                        {/* LEGB Examples */}
                        <div className="space-y-4 mt-6">
                            <LEGBCard 
                                letter="L" 
                                name="Local Scope" 
                                desc="Sabse pehle function ke andar ka variable check hota hai"
                                color="#8b5cf6"
                                example={`def printName():
    name = "Deepak"    # local variable
    print("Hi", name)  # L → local me mil gaya!

printName()`}
                            />

                            <LEGBCard 
                                letter="E" 
                                name="Enclosing Scope" 
                                desc="Nested function me outer function ka variable check hota hai"
                                color="#ec4899"
                                example={`def outer():
    name = "Enclosing"   # enclosing variable
    
    def inner():
        # name nahi hai local me → enclosing check karo
        print("Hi", name)   # E → enclosing me mil gaya!
    
    inner()

outer()`}
                            />

                            <LEGBCard 
                                letter="G" 
                                name="Global Scope" 
                                desc="Main program me define kiya gaya variable"
                                color="#059669"
                                example={`name = "Rahul"    # global variable

def printName():
    print(name)   # L ❌ → E ❌ → G ✅ global me mil gaya!

printName()`}
                            />

                            <LEGBCard 
                                letter="B" 
                                name="Built-in Scope" 
                                desc="Python ke pre-defined functions aur constants"
                                color="#f59e0b"
                                example={`from math import pi

# pi kahi define nahi kiya humne — ye built-in hai
print(pi)   # 3.141592653589793

# print, len, range — ye sab built-in hain
print(len("Hello"))   # 5`}
                            />
                        </div>

                        {/* Complete LEGB Example */}
                        <ProgCard title="Complete LEGB Example">
                            <p className="text-sm text-slate-600 mb-3">Ek program me saare scopes ko samjhein — comment hata kar dekho kya output aata hai!</p>
                            <CB code={`from math import *

# pi = "global"            # uncomment karke G test karo

def enc():
    # pi = "enclosing"      # uncomment karke E test karo
    
    def local():
        # pi = "local"      # uncomment karke L test karo
        print(pi)           # ye LEGB rule follow karega
    
    local()

enc()

# Default: pi = 3.141592653589793 (Built-in)`} />
                            <OB output={`3.141592653589793`} />
                            <IB type="tip">Upar ke code me ek-ek comment hata kar run karo — tumhe LEGB rule practically samajh aa jayega!</IB>
                        </ProgCard>

                        <ProgCard title="Example — Variable Scope Behavior">
                            <CB code={`def func1():
    k = 10
    print("k inside function =", k)   # local k = 10

k = 25                               # global k = 25
print("k before function =", k)
func1()
print("k after function =", k)       # global k unchanged`} />
                            <OB output={`k before function = 25
k inside function = 10
k after function = 25`} />
                            <IB type="note">Function ke andar ka <code>k = 10</code> (local) aur bahar ka <code>k = 25</code> (global) — dono alag-alag variables hain!</IB>
                        </ProgCard>
                    </Sec>

                    {/* ═══════════════════════════
                        5. GLOBAL KEYWORD ⭐
                    ═══════════════════════════ */}
                    <Sec id="global-keyword" title="⭐ Global Keyword →" icon={<Zap size={18} className="text-amber-600" />}>
                        <p><code className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-mono text-xs">global</code> keyword ka use karke kisi bhi function ke andar ke variable ko <strong>global variable</strong> banaya ja sakta hai। Isse function ke andar se global variable ko modify kiya ja sakta hai।</p>

                        <div className="mt-4 mb-2">
                            <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Syntax</span>
                        </div>
                        <CB code={`global <variable name>`} />

                        <IB type="warning">Bina <code>global</code> keyword ke, function ke andar global variable ko assign karne se naya <strong>local variable</strong> ban jata hai — original global variable change nahi hota!</IB>

                        <ProgCard title="Example — Without global keyword">
                            <p className="text-sm text-slate-600 mb-3">Bina global keyword ke function me variable assign karne par kya hota hai:</p>
                            <CB code={`count = 0    # global variable

def increment():
    count = count + 1    # ❌ UnboundLocalError!
    print(count)

increment()`} />
                            <div className="rounded-xl overflow-hidden my-3" style={{ border: '1px solid #fecdd3', background: '#fff1f2' }}>
                                <div className="px-3 py-1.5 flex items-center gap-2" style={{ background: '#ffe4e6', borderBottom: '1px solid #fecdd3' }}>
                                    <span className="text-[9px] uppercase tracking-[0.18em] font-bold text-red-700">Error</span>
                                </div>
                                <pre className="p-3 text-sm text-red-800 font-mono overflow-x-auto">UnboundLocalError: local variable &apos;count&apos; referenced before assignment</pre>
                            </div>
                        </ProgCard>

                        <ProgCard title="Example — With global keyword ✅">
                            <p className="text-sm text-slate-600 mb-3">Global keyword use karne par function me global variable ko modify kar sakte hain:</p>
                            <CB code={`count = 0    # global variable

def increment():
    global count         # declare as global
    count = count + 1    # ✅ now it works!
    print("Inside:", count)

increment()
increment()
increment()
print("Outside:", count)`} />
                            <OB output={`Inside: 1
Inside: 2
Inside: 3
Outside: 3`} />
                        </ProgCard>

                        <ProgCard title="Example — Creating global variable inside function">
                            <CB code={`def add():
    global a         # a ko global banaya
    a = 5

add()
print(a)   # ✅ 5 — function ke bahar bhi accessible`} />
                            <OB output={`5`} />
                        </ProgCard>

                        <ProgCard title="Example — Multiple global variables">
                            <CB code={`def setup():
    global name, age, city
    name = "Piyush"
    age = 20
    city = "Delhi"

setup()
print(f"{name}, {age} years old, from {city}")`} />
                            <OB output={`Piyush, 20 years old, from Delhi`} />
                        </ProgCard>

                        {/* Summary Table */}
                        <div className="mt-4 p-4 rounded-xl" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                            <h4 className="text-sm font-bold text-amber-800 mb-3">📊 Global vs Local — Quick Reference</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm text-slate-700 border-collapse border border-slate-200">
                                    <thead>
                                        <tr className="bg-amber-50">
                                            <th className="p-2 border border-slate-200">Feature</th>
                                            <th className="p-2 border border-slate-200">Global Variable</th>
                                            <th className="p-2 border border-slate-200">Local Variable</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="p-2 border border-slate-200 font-medium">Defined</td><td className="p-2 border border-slate-200">Main program me</td><td className="p-2 border border-slate-200">Function ke andar</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-medium">Access</td><td className="p-2 border border-slate-200">Kahi bhi</td><td className="p-2 border border-slate-200">Sirf function me</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-medium">Lifetime</td><td className="p-2 border border-slate-200">Program end tak</td><td className="p-2 border border-slate-200">Function end tak</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-medium">Modify in func</td><td className="p-2 border border-slate-200">global keyword chahiye</td><td className="p-2 border border-slate-200">Directly modify ho sakta hai</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══════════════════════════
                        6. MODULE 📦
                    ═══════════════════════════ */}
                    <Sec id="module" title="📦 Module — Introduction →" icon={<Package size={18} className="text-sky-600" />}>
                        <p>Python me jo bhi program banaya jata hai wo <strong>module</strong> ke roop me jana jata hai। Ek module <strong>functions, classes, aur variables ka sangrah</strong> hota hai।</p>

                        <div className="my-4 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', border: '2px solid #7dd3fc' }}>
                            <h4 className="text-sm font-bold text-sky-800 mb-3">🏗️ Module kya hai?</h4>
                            <ul className="space-y-2 text-sm text-sky-900">
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" />Ek module <strong>.py extension</strong> ki file hota hai</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" />Isme <strong>functions, classes, aur variables</strong> hote hain</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" /><strong>Pre-defined modules</strong> jaise math, random, os import kiye ja sakte hain</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" /><strong>User defined modules</strong> bhi banaye ja sakte hain</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" />Code ko <strong>reusable aur organized</strong> banane ka best tarika</li>
                            </ul>
                        </div>

                        <IB type="note">Module use karne se code <strong>reusable</strong> hota hai — ek baar likho, baar baar use karo! Ye <strong>modular programming</strong> ka concept hai।</IB>

                        {/* Module Steps */}
                        <div className="mt-6 mb-2">
                            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Module create karne ke 3 Steps:</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                            {[
                                { n: '1', t: 'Creating Module', d: 'Naya .py file me functions likho', c: '#0ea5e9', icon: <FileCode size={20} /> },
                                { n: '2', t: 'Importing Module', d: 'import keyword se module load karo', c: '#8b5cf6', icon: <Package size={20} /> },
                                { n: '3', t: 'Calling Objects', d: 'Module ke functions ko call karo', c: '#059669', icon: <Zap size={20} /> },
                            ].map(item => (
                                <div key={item.n} className="flex flex-col items-center p-5 rounded-2xl text-center transition-all duration-300 hover:scale-105" style={{ background: `${item.c}08`, border: `2px solid ${item.c}25` }}>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-black mb-3 shadow-lg" style={{ background: item.c }}>
                                        {item.icon}
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 mb-1">Step {item.n}</span>
                                    <span className="text-sm font-extrabold" style={{ color: item.c }}>{item.t}</span>
                                    <p className="text-xs text-slate-600 mt-1">{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </Sec>

                    {/* ═══════════════════════════
                        7. CREATING MODULE
                    ═══════════════════════════ */}
                    <Sec id="create-module" title="Creating & Using Module →" icon={<Box size={18} className="text-pink-600" />}>
                        
                        {/* Step 1: Creating */}
                        <MC name="Step 1: Creating Module" desc="Naya python file me functions likho" color="#0ea5e9">
                            <p className="text-sm text-slate-600 mb-3">Module banane ke liye ek <strong>new python file</strong> me user define functions likhe jate hain। Isme global environment nahi hota — keval functions hote hain।</p>
                            <div className="flex items-center gap-2 mb-2">
                                <FileCode size={14} className="text-sky-600" />
                                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">write.py — Module File</span>
                            </div>
                            <CB code={`# write.py — Module file

def add(a, b):
    d = a + b
    return d

def m(a, b):
    d = a * b
    return d`} />
                        </MC>

                        {/* Step 2: Importing */}
                        <MC name="Step 2: Importing Module" desc="import function ka use karke module ko load karo" color="#8b5cf6">
                            <p className="text-sm text-slate-600 mb-3"><code>import</code> keyword ka use karke module ko import kiya jata hai।</p>
                            <div className="mt-2 mb-2">
                                <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Syntax</span>
                            </div>
                            <CB code={`import <module name>`} />
                            <div className="mb-2">
                                <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Example</span>
                            </div>
                            <CB code={`import write`} />
                        </MC>

                        {/* Step 3: Calling */}
                        <MC name="Step 3: Calling Module Objects" desc="Import kiye gaye module ke functions ko use karo" color="#059669">
                            <p className="text-sm text-slate-600 mb-3">Import kiye gaye module ko call karne ke liye <code>module_name.function_name()</code> syntax use hota hai।</p>
                            <CB code={`import write

print(write.add(4, 6))    # Output: 10
print(write.m(4, 6))      # Output: 24`} />
                            <OB output={`10
24`} />
                        </MC>

                        {/* Question: Area Module */}
                        <ProgCard title="Question — Area Module (Triangle & Circle)">
                            <p className="text-sm text-slate-600 mb-3">Area of triangle aur Area of circle ke liye ek module create karo aur use call karo।</p>
                            <div className="flex items-center gap-2 mb-2">
                                <FileCode size={14} className="text-sky-600" />
                                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">area.py — Module File</span>
                            </div>
                            <CB code={`# area.py — Module file

def AOT(b, h):
    """Area of Triangle"""
    d = (b * h) / 2
    return d

def AOC(r):
    """Area of Circle"""
    d = 3.14 * r * r
    return d`} />
                            <div className="flex items-center gap-2 mb-2 mt-4">
                                <Code2 size={14} className="text-indigo-600" />
                                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">main.py — Main Program</span>
                            </div>
                            <CB code={`import area

print("Area of Triangle:", area.AOT(4, 6))   # (4×6)/2 = 12
print("Area of Circle:", area.AOC(4))         # 3.14×4×4 = 50.24`} />
                            <OB output={`Area of Triangle: 12.0
Area of Circle: 50.24`} />
                        </ProgCard>
                    </Sec>

                    {/* ═══════════════════════════
                        8. IMPORT TECHNIQUES
                    ═══════════════════════════ */}
                    <Sec id="import-techniques" title="Import Techniques →" icon={<Settings size={18} className="text-violet-600" />}>
                        <p>Python me module import karne ke <strong>multiple tarike</strong> hain:</p>

                        <div className="space-y-4 mt-4">
                            <MC name="1. import module" desc="Poora module import karo" color="#6366f1">
                                <CB code={`import math
print(math.pi)       # 3.141592653589793
print(math.sqrt(16)) # 4.0`} />
                            </MC>

                            <MC name="2. from module import *" desc="Module ke saare functions import karo" color="#8b5cf6">
                                <p className="text-xs text-slate-600 mb-2">Is tarike me module name likhne ki zaroorat nahi hoti — directly function name use hota hai।</p>
                                <CB code={`from math import *
print(pi)           # 3.141592653589793  (no math. prefix)
print(sqrt(16))     # 4.0

for i in range(10):
    print(pi)`} />
                            </MC>

                            <MC name="3. from module import function" desc="Specific function import karo" color="#a855f7">
                                <p className="text-xs text-slate-600 mb-2">Jab sirf kuch specific functions chahiye tab ye use karo — memory efficient hai।</p>
                                <CB code={`from math import pi, sqrt
print(pi)        # ✅ works
print(sqrt(25))  # ✅ works
# print(cos(0)) # ❌ not imported!`} />
                            </MC>

                            <MC name="4. import module as alias" desc="Module ko nickname (alias) do" color="#db2777">
                                <CB code={`import math as m
print(m.pi)        # 3.141592653589793
print(m.sqrt(49))  # 7.0`} />
                            </MC>
                        </div>

                        {/* Import Comparison Table */}
                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full text-left text-sm text-slate-700 border-collapse border border-slate-200">
                                <thead>
                                    <tr className="bg-violet-50">
                                        <th className="p-2.5 border border-slate-200 font-bold">Import Style</th>
                                        <th className="p-2.5 border border-slate-200 font-bold">Usage</th>
                                        <th className="p-2.5 border border-slate-200 font-bold">Best For</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td className="p-2 border border-slate-200 font-mono text-xs">import math</td><td className="p-2 border border-slate-200 text-xs">math.pi, math.sqrt()</td><td className="p-2 border border-slate-200 text-xs">Clear, organized code</td></tr>
                                    <tr><td className="p-2 border border-slate-200 font-mono text-xs">from math import *</td><td className="p-2 border border-slate-200 text-xs">pi, sqrt()</td><td className="p-2 border border-slate-200 text-xs">Quick scripts</td></tr>
                                    <tr><td className="p-2 border border-slate-200 font-mono text-xs">from math import pi</td><td className="p-2 border border-slate-200 text-xs">pi</td><td className="p-2 border border-slate-200 text-xs">Memory efficient</td></tr>
                                    <tr><td className="p-2 border border-slate-200 font-mono text-xs">import math as m</td><td className="p-2 border border-slate-200 text-xs">m.pi, m.sqrt()</td><td className="p-2 border border-slate-200 text-xs">Short alias</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </Sec>

                    {/* ═══════════════════════════
                        9. QUESTIONS & PROGRAMS
                    ═══════════════════════════ */}
                    <Sec id="questions" title="Questions & Programs →" icon={<Target size={18} className="text-fuchsia-600" />}>

                        <ProgCard title="📘 Question — Conversion Module">
                            <p className="text-sm text-slate-600 mb-3"><strong>conversion.py</strong> name se ek module banao jisme teen function ho:<br/>
                            1. Dollar se Rupee conversion<br/>
                            2. Gram se KG conversion<br/>
                            3. Celsius se Fahrenheit conversion<br/><br/>
                            Ek program bhi likho jo is module ko import karta hai aur user ki pasand ke aadhar par call karta hai।</p>

                            <div className="flex items-center gap-2 mb-2">
                                <FileCode size={14} className="text-sky-600" />
                                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">conversion.py — Module File</span>
                            </div>
                            <CB code={`# conversion.py — Conversion Module

def money(amt, rate):
    """Dollar to Rupee conversion"""
    amt = amt * rate
    return amt

def weight(gm):
    """Gram to KG conversion"""
    kg = gm / 1000
    return kg

def temp(t):
    """Celsius to Fahrenheit conversion"""
    f = 1.8 * t + 32
    return f`} />

                            <div className="flex items-center gap-2 mb-2 mt-4">
                                <Code2 size={14} className="text-indigo-600" />
                                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">main.py — Main Program</span>
                            </div>
                            <CB code={`from conversion import *

while True:
    print("\\n===== Conversion Menu =====")
    print("Press 1 for Money Conversion (Dollar → Rupee)")
    print("Press 2 for Weight Conversion (Gram → KG)")
    print("Press 3 for Temperature Conversion (°C → °F)")
    print("Press 4 to Exit")

    ch = int(input("\\nEnter your choice: "))

    if ch == 1:
        x = int(input("Enter amount in dollars: "))
        y = int(input("Enter rate of exchange: "))
        z = money(x, y)
        print(f"Converted amount: ₹{z}")

    elif ch == 2:
        x = int(input("Enter weight in grams: "))
        z = weight(x)
        print(f"Weight in KG: {z} kg")

    elif ch == 3:
        x = int(input("Enter temperature in Celsius: "))
        z = temp(x)
        print(f"Temperature in Fahrenheit: {z}°F")

    elif ch == 4:
        print("Thank you! Goodbye 👋")
        break

    else:
        print("Invalid choice! Try again.")`} />
                            <OB output={`===== Conversion Menu =====
Press 1 for Money Conversion (Dollar → Rupee)
Press 2 for Weight Conversion (Gram → KG)
Press 3 for Temperature Conversion (°C → °F)
Press 4 to Exit

Enter your choice: 1
Enter amount in dollars: 100
Enter rate of exchange: 83
Converted amount: ₹8300`} />
                        </ProgCard>

                        <ProgCard title="Question — Calculator Module">
                            <p className="text-sm text-slate-600 mb-3">Ek calculator module banao jisme add, subtract, multiply, divide functions hon।</p>
                            <div className="flex items-center gap-2 mb-2">
                                <FileCode size={14} className="text-sky-600" />
                                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">calculator.py</span>
                            </div>
                            <CB code={`# calculator.py

def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Error: Division by zero!"
    return a / b`} />
                            <div className="flex items-center gap-2 mb-2 mt-4">
                                <Code2 size={14} className="text-indigo-600" />
                                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">main.py</span>
                            </div>
                            <CB code={`import calculator as calc

a = int(input("Enter first number: "))
b = int(input("Enter second number: "))

print(f"Addition: {calc.add(a, b)}")
print(f"Subtraction: {calc.subtract(a, b)}")
print(f"Multiplication: {calc.multiply(a, b)}")
print(f"Division: {calc.divide(a, b)}")`} />
                            <OB output={`Enter first number: 20
Enter second number: 5
Addition: 25
Subtraction: 15
Multiplication: 100
Division: 4.0`} />
                        </ProgCard>

                        <ProgCard title="Question — Student Grade Module">
                            <p className="text-sm text-slate-600 mb-3">Ek module banao jo percentage calculate kare aur grade return kare।</p>
                            <div className="flex items-center gap-2 mb-2">
                                <FileCode size={14} className="text-sky-600" />
                                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">student.py</span>
                            </div>
                            <CB code={`# student.py

def percentage(m1, m2, m3, m4, m5):
    total = m1 + m2 + m3 + m4 + m5
    per = total / 5
    return per

def grade(per):
    if per >= 90:
        return "A+"
    elif per >= 80:
        return "A"
    elif per >= 70:
        return "B"
    elif per >= 60:
        return "C"
    elif per >= 50:
        return "D"
    else:
        return "F (Fail)"`} />
                            <div className="flex items-center gap-2 mb-2 mt-4">
                                <Code2 size={14} className="text-indigo-600" />
                                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">main.py</span>
                            </div>
                            <CB code={`from student import *

print("Enter marks for 5 subjects:")
m1 = int(input("Subject 1: "))
m2 = int(input("Subject 2: "))
m3 = int(input("Subject 3: "))
m4 = int(input("Subject 4: "))
m5 = int(input("Subject 5: "))

per = percentage(m1, m2, m3, m4, m5)
g = grade(per)
print(f"\\nPercentage: {per}%")
print(f"Grade: {g}")`} />
                            <OB output={`Enter marks for 5 subjects:
Subject 1: 85
Subject 2: 92
Subject 3: 78
Subject 4: 88
Subject 5: 95

Percentage: 87.6%
Grade: A`} />
                        </ProgCard>
                    </Sec>

                    {/* ═══════════════════════════
                        10. PRACTICE QUESTIONS
                    ═══════════════════════════ */}
                    <Sec id="practice" title="Practice Questions →" icon={<Brain size={18} className="text-rose-600" />}>
                        <p className="mb-4 text-slate-700">In programs ko khud likhne ka prayaas karein — Chapter 9 ko aur acche se samajhne ke liye 💪</p>

                        <div className="space-y-3">
                            {[
                                "Write a program to demonstrate the difference between local and global variables.",
                                "Write a program that shows how Python finds variables using the LEGB rule.",
                                "Write a function that uses the global keyword to modify a counter variable.",
                                "Write a program with nested functions to demonstrate enclosing scope.",
                                "Create a module with functions to calculate area of rectangle, square, and circle.",
                                "Write a program that imports your custom module and calculates areas of different shapes.",
                                "Create a module 'string_utils.py' with functions: reverse_string, count_vowels, is_palindrome.",
                                "Write a program using 'from module import *' to use all functions from your module.",
                                "Create a module with a function that uses global keyword inside it. Import and test it.",
                                "Write a program that demonstrates all 4 types of import statements.",
                                "Create a module 'math_ops.py' with functions: factorial, is_prime, fibonacci.",
                                "Write a program that shows UnboundLocalError and then fix it using global keyword.",
                                "Create a conversion module with functions for: km to miles, kg to pounds, liters to gallons.",
                                "Write a program using module alias (import as) to organize your code.",
                                "Create a complete banking module with functions: deposit, withdraw, check_balance, transfer.",
                            ].map((q, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-emerald-300">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-white font-extrabold text-sm" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                                        Q{idx + 1}
                                    </div>
                                    <div className="text-slate-800 font-medium text-[15px] leading-relaxed pt-2">{q}</div>
                                    <button
                                        onClick={() => { const ev = new CustomEvent('toggle-knobly-ai'); window.dispatchEvent(ev); }}
                                        className="ml-auto w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                                        title="Ask AI to Explain"
                                    >
                                        <Sparkles size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Key Points Summary */}
                        <div className="mt-6 p-4 rounded-xl" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                            <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2"><List size={14} />Chapter 9 — Key Points :</h4>
                            <ul className="space-y-2 text-sm text-emerald-900">
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /><strong>Global scope</strong> — poore program me accessible variable</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /><strong>Local scope</strong> — sirf function ke andar accessible variable</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /><strong>LEGB Rule</strong> — Local → Enclosing → Global → Built-in (search order)</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /><strong>global</strong> keyword — function me global variable modify karne ke liye</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /><strong>Module</strong> — .py file jisme reusable functions hote hain</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /><strong>3 Steps:</strong> Create → Import → Call</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /><strong>4 Import types:</strong> import, from...import *, from...import func, import...as</li>
                            </ul>
                        </div>
                    </Sec>

                </main>
            </div>
        </div>
    );
}
