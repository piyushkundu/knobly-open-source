'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Home, BookOpen, Copy, Check, LayoutDashboard, StickyNote,
    Code2, Brain, Keyboard as KBIcon, Sparkles, ChevronRight, Zap,
    Layers, Hash, List, Box, Settings, Target, BarChart3,
    Download, Package, Grid3X3, Scissors, Repeat, Binary, Eye,
    Columns3, FileCode, CircleDot, Table2, Cpu
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
        note: { bg: '#ecfeff', border: '#67e8f9', text: '#155e75', emoji: '📝' },
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
        <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid #cffafe', background: '#ecfeff' }}>
            <div className="px-4 py-2.5 flex items-center gap-2" style={{ borderBottom: '1px solid #cffafe', background: '#ecfeff' }}>
                <Code2 size={14} className="text-cyan-600" />
                <span className="text-xs font-bold text-cyan-700 uppercase tracking-wide">{title}</span>
            </div>
            <div className="p-4 bg-white">{children}</div>
        </div>
    );
}

/* ─── Output Box ─── */
function OB({ output }: { output: string }) {
    return (
        <div className="rounded-xl overflow-hidden my-3" style={{ border: '1px solid #a5f3fc', background: '#ecfeff' }}>
            <div className="px-3 py-1.5 flex items-center gap-2" style={{ background: '#cffafe', borderBottom: '1px solid #a5f3fc' }}>
                <span className="text-[9px] uppercase tracking-[0.18em] font-bold text-cyan-700">Output</span>
            </div>
            <pre className="p-3 text-sm text-cyan-800 font-mono overflow-x-auto">{output}</pre>
        </div>
    );
}

/* ─── Syntax Box ─── */
function SyntaxBox({ syntax }: { syntax: string }) {
    return (
        <div className="rounded-xl overflow-hidden my-3" style={{ border: '1px solid #e0e7ff', background: '#eef2ff' }}>
            <div className="px-3 py-1.5 flex items-center gap-2" style={{ background: '#e0e7ff', borderBottom: '1px solid #c7d2fe' }}>
                <span className="text-[9px] uppercase tracking-[0.18em] font-bold text-indigo-700">Syntax</span>
            </div>
            <pre className="p-3 text-sm text-indigo-800 font-mono overflow-x-auto">{syntax}</pre>
        </div>
    );
}

const tocItems = [
    { icon: <BookOpen size={13} />, label: 'Introduction', id: 'intro', color: '#0891b2' },
    { icon: <Zap size={13} />, label: 'Why NumPy?', id: 'why-numpy', color: '#059669' },
    { icon: <Download size={13} />, label: 'Installation', id: 'install', color: '#7c3aed' },
    { icon: <Package size={13} />, label: 'Import NumPy', id: 'import', color: '#db2777' },
    { icon: <Grid3X3 size={13} />, label: 'Creating Array', id: 'create-array', color: '#ea580c' },
    { icon: <Layers size={13} />, label: 'Dimensions', id: 'dimensions', color: '#2563eb' },
    { icon: <Box size={13} />, label: 'Shape of Array', id: 'shape', color: '#16a34a' },
    { icon: <CircleDot size={13} />, label: 'Array Index', id: 'indexing', color: '#9333ea' },
    { icon: <Scissors size={13} />, label: 'Array Slicing', id: 'slicing', color: '#e11d48' },
    { icon: <Repeat size={13} />, label: 'Reshape', id: 'reshape', color: '#0d9488' },
    { icon: <Binary size={13} />, label: 'Ones & Zeros', id: 'ones-zeros', color: '#ca8a04' },
    { icon: <Cpu size={13} />, label: 'Empty & Copy', id: 'empty-copy', color: '#4f46e5' },
    { icon: <Table2 size={13} />, label: 'Identity & Eye', id: 'identity-eye', color: '#be185d' },
    { icon: <Target size={13} />, label: 'Practice Questions', id: 'practice', color: '#f43f5e' },
];

const navLinks = [
    { label: 'Home', href: '/', icon: <Home size={14} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={14} /> },
    { label: 'Notes', href: '/notes', icon: <StickyNote size={14} /> },
    { label: 'Python', href: '/python', icon: <Code2 size={14} /> },
    { label: 'MCQ', href: '/mcq', icon: <Brain size={14} /> },
    { label: 'Shortcuts', href: '/shortcuts', icon: <KBIcon size={14} /> },
];

export default function NumPyPage() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('intro');

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #ecfeff 0%, #cffafe 30%, #f0fdfa 60%, #ecfeff 100%)' }}>

            {/* ═══ NAVBAR ═══ */}
            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/python" className="flex items-center justify-center w-9 h-9 rounded-xl hover:scale-105 transition-all" style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', boxShadow: '0 2px 8px rgba(8,145,178,0.3)' }}>
                            <ArrowLeft size={16} className="text-white" />
                        </Link>
                        <div>
                            <h1 className="text-sm font-extrabold" style={{ color: '#0f172a' }}>NumPy Basics</h1>
                            <div className="flex items-center gap-1.5">
                                <Sparkles size={8} style={{ color: '#0891b2' }} />
                                <span className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: '#0891b2' }}>Chapter 10 • Python</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        {navLinks.map(l => (
                            <Link key={l.href} href={l.href}
                                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-105"
                                style={{ color: '#64748b' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#ecfeff'; e.currentTarget.style.color = '#0891b2'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
                                {l.icon}<span>{l.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #0891b2, #06b6d4, #22d3ee, #67e8f9, #0ea5e9, #0891b2)' }} />
            </header>

            <div className="max-w-7xl mx-auto flex relative">
                {/* ── SIDEBAR ── */}
                <aside className={`${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[52px] left-0 z-40 lg:z-10 w-64 lg:w-56 xl:w-64 h-[calc(100vh-52px)] overflow-y-auto transition-transform duration-300 lg:flex-shrink-0`}
                    style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', borderRight: '1px solid #e2e8f0' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
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
                                    onMouseEnter={e => { if (activeSection !== item.id) { e.currentTarget.style.background = '#ecfeff'; } }}
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
                    <section className="relative rounded-3xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #164e63 0%, #0891b2 50%, #06b6d4 100%)', boxShadow: '0 8px 32px rgba(8,145,178,0.28)' }}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)' }} />
                            <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)' }} />
                            {/* NumPy grid decoration */}
                            <div className="absolute top-6 right-6 grid grid-cols-4 gap-2 opacity-15">
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <div key={i} className="w-5 h-5 rounded border border-white/40 flex items-center justify-center text-white/60 text-[8px] font-bold">
                                        {(i % 9) + 1}
                                    </div>
                                ))}
                            </div>
                            {/* Floating array brackets */}
                            <div className="absolute bottom-8 right-12 text-white/10 text-6xl font-black">[ ]</div>
                        </div>
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
                                <Sparkles size={10} /> Chapter 10 • Python
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: '#ffffff' }}>NumPy Basics</h2>
                            <p className="text-sm md:text-base max-w-2xl mb-5" style={{ color: 'rgba(255,255,255,0.90)' }}>
                                Numerical Python — Arrays, Operations, Dimensions, Slicing और बहुत कुछ! Python की सबसे powerful scientific computing library को मास्टर करें।
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { icon: <Grid3X3 size={14} />, label: 'N-D Arrays' },
                                    { icon: <Layers size={14} />, label: 'Dimensions' },
                                    { icon: <Scissors size={14} />, label: 'Slicing' },
                                    { icon: <Repeat size={14} />, label: 'Reshape' },
                                    { icon: <BarChart3 size={14} />, label: 'Operations' },
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
                    <Sec id="intro" title="Introduction — NumPy क्या है? →" icon={<BookOpen size={18} className="text-cyan-600" />}>
                        <p>Numpy का full form <strong>Numerical Python</strong> है। 2005 में developer <strong>Travis Oliphant</strong> ने open source project के रूप में Numpy library को develop किया।</p>

                        <IB type="note">Numpy Python की सबसे important library है जो <strong>scientific computing</strong> के लिए fundamental package provide करती है!</IB>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                            <div className="p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #ecfeff, #cffafe)', border: '2px solid #67e8f9' }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
                                        <Cpu size={20} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-extrabold text-cyan-800">Scientific Computing</span>
                                        <p className="text-[10px] text-cyan-600 uppercase tracking-wider font-bold">Fundamental Package</p>
                                    </div>
                                </div>
                                <p className="text-xs text-cyan-700">Complex mathematical functions aur C/C++ language ko use karta hai</p>
                            </div>
                            <div className="p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '2px solid #86efac' }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
                                        <Grid3X3 size={20} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-extrabold text-emerald-800">N-Dimensional Arrays</span>
                                        <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-bold">Core Feature</p>
                                    </div>
                                </div>
                                <p className="text-xs text-emerald-700">N-dimensional array object aur multi-dimensional data support</p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <h4 className="text-sm font-bold text-slate-800 mb-3">🔑 Key Points:</h4>
                            <ul className="space-y-2 text-sm text-slate-700">
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />Numpy ek <strong>Python library</strong> hai jo complex mathematical functions ko support karta hai</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />Ye <strong>C aur C++ language</strong> ko internally use karta hai (isliye fast hai)</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />Python ki <strong>scientific computing</strong> ke liye fundamental package hai</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" /><strong>N-dimensional array</strong> object aur object array provide karta hai</li>
                            </ul>
                        </div>
                    </Sec>

                    {/* ═══════════════════════════
                        2. WHY NUMPY?
                    ═══════════════════════════ */}
                    <Sec id="why-numpy" title="Why use NumPy? →" icon={<Zap size={18} className="text-emerald-600" />}>
                        <p>Numpy ka use <strong>array ke saath work</strong> karne ke liye kiya jata hai। Python me <strong>natively array concept nahi hota</strong> — issi liye Numpy ka main purpose array object provide karna hai।</p>

                        <IB type="tip">Traditional Python lists <strong>50x slower</strong> hain as compared to Numpy arrays! Numpy internally C me compiled hai isliye ye bahut fast hai।</IB>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5">
                            {[
                                { icon: <Zap size={20} />, title: '50x Faster', desc: 'Python list se 50 guna fast operations', color: '#f59e0b' },
                                { icon: <Grid3X3 size={20} />, title: 'N-D Arrays', desc: 'Multi-dimensional array support', color: '#0891b2' },
                                { icon: <BarChart3 size={20} />, title: 'Scientific', desc: 'Scientific computing ke liye perfect', color: '#8b5cf6' },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center p-5 rounded-2xl text-center transition-all duration-300 hover:scale-105" style={{ background: `${item.color}08`, border: `2px solid ${item.color}25` }}>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-black mb-3 shadow-lg" style={{ background: item.color }}>
                                        {item.icon}
                                    </div>
                                    <span className="text-sm font-extrabold" style={{ color: item.color }}>{item.title}</span>
                                    <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Comparison: Python List vs NumPy */}
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full text-left text-sm text-slate-700 border-collapse border border-slate-200">
                                <thead>
                                    <tr className="bg-cyan-50">
                                        <th className="p-2.5 border border-slate-200 font-bold">Feature</th>
                                        <th className="p-2.5 border border-slate-200 font-bold">Python List</th>
                                        <th className="p-2.5 border border-slate-200 font-bold">NumPy Array</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td className="p-2 border border-slate-200 font-medium">Speed</td><td className="p-2 border border-slate-200">❌ Slow</td><td className="p-2 border border-slate-200">✅ 50x Faster</td></tr>
                                    <tr><td className="p-2 border border-slate-200 font-medium">Memory</td><td className="p-2 border border-slate-200">❌ Zyada use</td><td className="p-2 border border-slate-200">✅ Kam use</td></tr>
                                    <tr><td className="p-2 border border-slate-200 font-medium">N-D Support</td><td className="p-2 border border-slate-200">❌ Nahi</td><td className="p-2 border border-slate-200">✅ N-Dimensional</td></tr>
                                    <tr><td className="p-2 border border-slate-200 font-medium">Math Functions</td><td className="p-2 border border-slate-200">❌ Limited</td><td className="p-2 border border-slate-200">✅ Complete</td></tr>
                                    <tr><td className="p-2 border border-slate-200 font-medium">Scientific Use</td><td className="p-2 border border-slate-200">❌ Not ideal</td><td className="p-2 border border-slate-200">✅ Perfect</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </Sec>

                    {/* ═══════════════════════════
                        3. INSTALLATION
                    ═══════════════════════════ */}
                    <Sec id="install" title="NumPy Installation →" icon={<Download size={18} className="text-violet-600" />}>
                        <p>Numpy install karne ke liye aapke system me <strong>PIP</strong> (Python Package Installer) install hona chahiye।</p>

                        <IB type="note">PIP Python ke saath automatically install hota hai (Python 3.4+ versions me)। Agar nahi hai to <code>python -m ensurepip</code> run karein।</IB>

                        <div className="mt-2 mb-2">
                            <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Installation Command</span>
                        </div>
                        <CB code={`pip install numpy`} />

                        <IB type="tip">Agar aap Anaconda use kar rahe ho to NumPy already installed hota hai! Check karne ke liye: <code>pip show numpy</code></IB>
                    </Sec>

                    {/* ═══════════════════════════
                        4. IMPORT NUMPY
                    ═══════════════════════════ */}
                    <Sec id="import" title="Import NumPy →" icon={<Package size={18} className="text-pink-600" />}>
                        <p>Successfully install hone ke baad hum is package ko <strong>module ki tarah</strong> use kar sakte hain। Convention ke according NumPy ko <code className="bg-cyan-50 text-cyan-700 px-1.5 py-0.5 rounded font-mono text-xs">np</code> alias se import karte hain।</p>

                        <CB code={`import numpy as np

# Ab hum np ka use karke NumPy ke functions access kar sakte hain
print(np.__version__)    # NumPy version check`} />

                        <IB type="tip"><code>np</code> ek standard alias hai jo sabhi Python developers use karte hain। Ye code ko <strong>short aur readable</strong> banata hai!</IB>
                    </Sec>

                    {/* ═══════════════════════════
                        5. CREATING NUMPY ARRAY
                    ═══════════════════════════ */}
                    <Sec id="create-array" title="Creating NumPy Array →" icon={<Grid3X3 size={18} className="text-orange-600" />}>
                        <p>Numpy ka use karke array ko <strong>teen tarike</strong> se bana sakte hain:</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5">
                            {[
                                { n: '1', t: 'array()', d: 'List/Tuple se array banao', c: '#ea580c' },
                                { n: '2', t: 'arange()', d: 'Start, stop, step se array', c: '#0891b2' },
                                { n: '3', t: 'linspace()', d: 'Fixed elements ka array', c: '#7c3aed' },
                            ].map(item => (
                                <div key={item.n} className="flex flex-col items-center p-5 rounded-2xl text-center transition-all duration-300 hover:scale-105" style={{ background: `${item.c}08`, border: `2px solid ${item.c}25` }}>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-black mb-3 shadow-lg" style={{ background: item.c }}>
                                        {item.n}
                                    </div>
                                    <span className="text-sm font-extrabold" style={{ color: item.c }}>{item.t}</span>
                                    <p className="text-xs text-slate-600 mt-1">{item.d}</p>
                                </div>
                            ))}
                        </div>

                        {/* (i) Array Function */}
                        <MC name="(i) array() Function" desc="List ya Tuple se array banao" color="#ea580c">
                            <p className="text-sm text-slate-600 mb-3">Array function ka use karke array banaya jata hai। Ye ek argument input ke roop me leta hai — <strong>list ya tuple</strong>।</p>
                            <SyntaxBox syntax={`<array_name> = numpy_obj.array(<list, tuple>)`} />
                            <ProgCard title="Example — Array from List">
                                <CB code={`import numpy as np

a = [23, 45, 56, 75, 98]
print(type(a))          # <class 'list'>

b = np.array(a)
print(type(b))          # <class 'numpy.ndarray'>
print(b)                # [23 45 56 75 98]`} />
                                <OB output={`<class 'list'>
<class 'numpy.ndarray'>
[23 45 56 75 98]`} />
                            </ProgCard>

                            <ProgCard title="📘 Question — Count Age (Major & Minor)">
                                <p className="text-sm text-slate-600 mb-3">Ek program likho jo ages ki list me se major (≥18) aur minor ({'<'}18) count kare।</p>
                                <CB code={`import numpy as np

m = n = 0
a = [17, 15, 20, 25, 40, 55]
print(type(a))

b = np.array(a)
print(type(b))

for i in b:
    if(i >= 18):
        m = m + 1
    else:
        n = n + 1

print("Major:", m)
print("Minor:", n)`} />
                                <OB output={`<class 'list'>
<class 'numpy.ndarray'>
Major: 4
Minor: 2`} />
                            </ProgCard>
                        </MC>

                        {/* (ii) Arange Function */}
                        <MC name="(ii) arange() Function" desc="Sequence values ka array banao" color="#0891b2">
                            <p className="text-sm text-slate-600 mb-3">Ye function value ko array me return karta hai। Ye <strong>teen arguments</strong> leta hai: start, stop, step</p>
                            <SyntaxBox syntax={`<array_name> = numpy_obj.arange([start], [stop], [step])`} />

                            <ProgCard title="Example — arange() Forward">
                                <CB code={`import numpy as np

h = np.arange(1, 10, 2)
print(h)    # [1 3 5 7 9]`} />
                                <OB output={`[1 3 5 7 9]`} />
                            </ProgCard>

                            <ProgCard title="Example — arange() Reverse">
                                <CB code={`import numpy as np

h = np.arange(20, 3, -2)
print(h)    # [20 18 16 14 12 10  8  6  4]`} />
                                <OB output={`[20 18 16 14 12 10  8  6  4]`} />
                            </ProgCard>
                        </MC>

                        {/* (iii) Linspace */}
                        <MC name="(iii) linspace() Function" desc="Start aur Stop ke beech fixed elements" color="#7c3aed">
                            <p className="text-sm text-slate-600 mb-3">Ye function array start aur stop ke beech <strong>fixed number of elements</strong> return karta hai evenly spaced।</p>
                            <SyntaxBox syntax={`<array_name> = numpy_obj.linspace(start, stop, num, endpoint=True, retstep=False)`} />

                            <div className="my-3 overflow-x-auto">
                                <table className="min-w-full text-left text-sm text-slate-700 border-collapse border border-slate-200">
                                    <thead>
                                        <tr className="bg-violet-50">
                                            <th className="p-2 border border-slate-200 font-bold">Parameter</th>
                                            <th className="p-2 border border-slate-200 font-bold">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="p-2 border border-slate-200 font-mono text-xs">start</td><td className="p-2 border border-slate-200">Starting value</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-mono text-xs">stop</td><td className="p-2 border border-slate-200">Last value</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-mono text-xs">num</td><td className="p-2 border border-slate-200">Total elements (default = 50)</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-mono text-xs">endpoint</td><td className="p-2 border border-slate-200">End point include hoga ya nahi (default True)</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-mono text-xs">retstep</td><td className="p-2 border border-slate-200">Step value return karega ya nahi (default False)</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <ProgCard title="Example — linspace() Basic">
                                <CB code={`import numpy as np

a = np.linspace(1, 5, 10)
print(a)`} />
                                <OB output={`[1.         1.44444444 1.88888889 2.33333333 2.77777778 3.22222222
 3.66666667 4.11111111 4.55555556 5.        ]`} />
                            </ProgCard>

                            <ProgCard title="Example — linspace() with retstep">
                                <CB code={`import numpy as np

a = np.linspace(1, 5, 10, endpoint=True, retstep=True)
print(a)`} />
                                <OB output={`(array([1.        , 1.44444444, 1.88888889, 2.33333333, 2.77777778,
       3.22222222, 3.66666667, 4.11111111, 4.55555556, 5.        ]), 0.4444444444444444)`} />
                                <IB type="note">Jab <code>retstep=True</code> hota hai to output me array ke saath step value bhi return hoti hai!</IB>
                            </ProgCard>
                        </MC>
                    </Sec>

                    {/* ═══════════════════════════
                        6. DIMENSIONS OF ARRAY
                    ═══════════════════════════ */}
                    <Sec id="dimensions" title="Dimensions of Array →" icon={<Layers size={18} className="text-blue-600" />}>
                        <p>Numpy me <strong>multi dimensional array</strong> ban sakta hai। <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono text-xs">ndim</code> function se array ki <strong>dimension</strong> pata chalti hai।</p>

                        <SyntaxBox syntax={`numpy_obj.ndim(<array_name>)`} />

                        {/* Dimension Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5">
                            {[
                                { d: '0D', name: 'Zero Dimensional', desc: 'Single element array (scalar)', color: '#f59e0b', example: 'np.array(42)' },
                                { d: '1D', name: 'One Dimensional', desc: 'List type — ek row', color: '#2563eb', example: 'np.array([1,2,3])' },
                                { d: '2D+', name: 'Multi Dimensional', desc: 'Nested lists — rows & columns', color: '#dc2626', example: 'np.array([[1,2],[3,4]])' },
                            ].map((item, i) => (
                                <div key={i} className="p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]" style={{ background: `${item.color}08`, border: `2px solid ${item.color}25` }}>
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black mb-3 shadow-lg" style={{ background: item.color }}>
                                        {item.d}
                                    </div>
                                    <span className="text-sm font-extrabold" style={{ color: item.color }}>{item.name}</span>
                                    <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                                    <code className="text-[10px] text-slate-500 mt-2 block font-mono">{item.example}</code>
                                </div>
                            ))}
                        </div>

                        <ProgCard title="Example — 1D Array Dimension">
                            <CB code={`import numpy as np

a = np.array([23, 45, 78])
print(a)
print("Dimension:", np.ndim(a))`} />
                            <OB output={`[23 45 78]
Dimension: 1`} />
                        </ProgCard>

                        <ProgCard title="Example — Multi Dimensional Arrays">
                            <p className="text-sm text-slate-600 mb-3">Nested lists ka use karke 2D aur 3D arrays banaye ja sakte hain:</p>
                            <CB code={`import numpy as np

# 1D Array
a = np.array([12, 5])
print("1D:", a, "→ dim:", np.ndim(a))

# 2D Array
b = np.array([[4, 6], [7, 8]])
print("2D:", b, "→ dim:", np.ndim(b))

# 3D Array
c = np.array([[[4, 7], [6, 9]], [[5, 8], [7, 10]]])
print("3D:", c, "→ dim:", np.ndim(c))`} />
                            <OB output={`1D: [12  5] → dim: 1
2D: [[4 6]
 [7 8]] → dim: 2
3D: [[[ 4  7]
  [ 6  9]]
 [[ 5  8]
  [ 7 10]]] → dim: 3`} />
                        </ProgCard>

                        {/* Visualization */}
                        <div className="mt-4 p-5 rounded-2xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <h4 className="text-sm font-bold text-slate-800 mb-4 text-center">📊 Array Dimensions Visualization</h4>
                            <div className="flex flex-wrap justify-center gap-4">
                                <div className="p-3 rounded-xl text-center" style={{ background: '#fef3c7', border: '1px solid #fde68a' }}>
                                    <p className="text-xs font-bold text-amber-700 mb-2">0D (Scalar)</p>
                                    <div className="w-12 h-12 mx-auto rounded-lg flex items-center justify-center text-amber-800 font-bold border-2 border-amber-300 bg-white">42</div>
                                </div>
                                <div className="p-3 rounded-xl text-center" style={{ background: '#dbeafe', border: '1px solid #93c5fd' }}>
                                    <p className="text-xs font-bold text-blue-700 mb-2">1D (Vector)</p>
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(v => <div key={v} className="w-8 h-8 rounded-md flex items-center justify-center text-blue-800 font-bold text-xs border border-blue-300 bg-white">{v}</div>)}
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl text-center" style={{ background: '#fce7f3', border: '1px solid #f9a8d4' }}>
                                    <p className="text-xs font-bold text-pink-700 mb-2">2D (Matrix)</p>
                                    <div className="space-y-1">
                                        {[[1, 2], [3, 4]].map((row, ri) => (
                                            <div key={ri} className="flex gap-1">
                                                {row.map((v, ci) => <div key={ci} className="w-8 h-8 rounded-md flex items-center justify-center text-pink-800 font-bold text-xs border border-pink-300 bg-white">{v}</div>)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══════════════════════════
                        7. SHAPE OF ARRAY
                    ═══════════════════════════ */}
                    <Sec id="shape" title="Shape of Array →" icon={<Box size={18} className="text-green-600" />}>
                        <p>Array ki <strong>shape</strong> indexes ka tuple hoti hai jo har dimension me elements ki sankhya batati hai।</p>

                        <SyntaxBox syntax={`array_obj.shape    # OR    np.shape(array_name)`} />

                        <ProgCard title="Example — Array Shape">
                            <CB code={`import numpy as np

a = np.array([[4, 5, 6], [7, 8, 9]])
print(a)
print("Shape (function):", np.shape(a))
print("Shape (attribute):", a.shape)`} />
                            <OB output={`[[4 5 6]
 [7 8 9]]
Shape (function): (2, 3)
Shape (attribute): (2, 3)`} />
                            <IB type="note"><code>(2, 3)</code> ka matlab hai — <strong>2 rows</strong> aur <strong>3 columns</strong>!</IB>
                        </ProgCard>

                        <ProgCard title="Example — Shape Change">
                            <p className="text-sm text-slate-600 mb-3">Array ki shape ko change bhi kiya ja sakta hai:</p>
                            <CB code={`import numpy as np

a = np.array([[4, 5, 6], [7, 8, 9]])
print("Original shape:", a.shape)
print(a)

a.shape = (1, 6)
print("\\nNew shape:", a.shape)
print(a)

a.shape = (3, 2)
print("\\nAnother shape:", a.shape)
print(a)`} />
                            <OB output={`Original shape: (2, 3)
[[4 5 6]
 [7 8 9]]

New shape: (1, 6)
[[4 5 6 7 8 9]]

Another shape: (3, 2)
[[4 5]
 [6 7]
 [8 9]]`} />
                        </ProgCard>
                    </Sec>

                    {/* ═══════════════════════════
                        8. ARRAY INDEX
                    ═══════════════════════════ */}
                    <Sec id="indexing" title="Array Indexing →" icon={<CircleDot size={18} className="text-purple-600" />}>
                        <p>Array ke element ko access karne ke liye <strong>index</strong> use hota hai। Numpy me indexing <strong>0 se start</strong> hoti hai।</p>

                        <SyntaxBox syntax={`array_name[index]           # 1D
array_name[row][col]        # 2D
array_name[depth][row][col] # 3D`} />

                        <ProgCard title="Example — 1D Array Indexing">
                            <CB code={`import numpy as np

a = np.array([4, 7, 6])
print(a[0])    # 4
print(a[1])    # 7
print(a[2])    # 6`} />
                            <OB output={`4
7
6`} />
                        </ProgCard>

                        <ProgCard title="Example — 2D Array Indexing">
                            <CB code={`import numpy as np

a = np.array([[4, 7, 6], [7, 8, 4]])
print(a)

# Method 1: Double bracket
print(a[1][1])    # 8
print(a[0][2])    # 6

# Method 2: Comma separated
print(a[1, 1])    # 8
print(a[0, 2])    # 6`} />
                            <OB output={`[[4 7 6]
 [7 8 4]]
8
6
8
6`} />
                        </ProgCard>

                        <ProgCard title="Example — 3D Array Indexing">
                            <CB code={`import numpy as np

a = np.array([[[2, 3], [5, 6]], [[6, 9], [7, 3]]])
print(a)
print("Shape:", a.shape)

print(a[0][0][1])    # 3
print(a[1][0][0])    # 6
print(a[1][1][1])    # 3`} />
                            <OB output={`[[[2 3]
  [5 6]]

 [[6 9]
  [7 3]]]
Shape: (2, 2, 2)
3
6
3`} />
                        </ProgCard>

                        {/* Index Visual */}
                        <div className="mt-4 p-4 rounded-xl" style={{ background: '#faf5ff', border: '1px solid #e9d5ff' }}>
                            <h4 className="text-sm font-bold text-purple-800 mb-3 text-center">🎯 Indexing Visual — 2D Array</h4>
                            <div className="flex justify-center">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-purple-600 w-12 text-right">Row 0 →</span>
                                        <div className="flex gap-1">
                                            {['[0,0]', '[0,1]', '[0,2]'].map((idx, i) => (
                                                <div key={i} className="w-14 h-10 rounded-md flex flex-col items-center justify-center border border-purple-200 bg-white">
                                                    <span className="text-xs font-bold text-purple-700">{[4, 7, 6][i]}</span>
                                                    <span className="text-[8px] text-purple-600">{idx}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-purple-600 w-12 text-right">Row 1 →</span>
                                        <div className="flex gap-1">
                                            {['[1,0]', '[1,1]', '[1,2]'].map((idx, i) => (
                                                <div key={i} className="w-14 h-10 rounded-md flex flex-col items-center justify-center border border-purple-200 bg-white">
                                                    <span className="text-xs font-bold text-purple-700">{[7, 8, 4][i]}</span>
                                                    <span className="text-[8px] text-purple-600">{idx}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══════════════════════════
                        9. ARRAY SLICING
                    ═══════════════════════════ */}
                    <Sec id="slicing" title="Array Slicing →" icon={<Scissors size={18} className="text-rose-600" />}>
                        <p>Slicing se array ka ek <strong>part (subset)</strong> nikala ja sakta hai। Ye Python list slicing jaisa hi hai but multi-dimensional support ke saath।</p>

                        <MC name="1D Array Slicing" desc="Single dimension array ka slice" color="#e11d48">
                            <SyntaxBox syntax={`array_name[start:stop:step]`} />
                            <ProgCard title="Example — 1D Slicing">
                                <CB code={`import numpy as np

a = np.array([3, 5, 7, 8, 4, 6, 2])

print(a[3:6])      # [8 4 6]
print(a[0:7:2])    # [3 7 4 2]
print(a[::-1])     # [2 6 4 8 7 5 3] — reversed
print(a[:])        # [3 5 7 8 4 6 2] — full array
print(a[3:])       # [8 4 6 2] — index 3 se end tak`} />
                                <OB output={`[8 4 6]
[3 7 4 2]
[2 6 4 8 7 5 3]
[3 5 7 8 4 6 2]
[8 4 6 2]`} />
                            </ProgCard>
                        </MC>

                        <MC name="2D Array Slicing" desc="Rows aur columns dono ka slice" color="#9333ea">
                            <SyntaxBox syntax={`array_name[row_start:row_stop:step, col_start:col_stop:step]`} />
                            <ProgCard title="Example — 2D Slicing">
                                <CB code={`import numpy as np

a = np.array([[2, 3, 5, 6], [3, 4, 6, 8], [5, 7, 2, 9]])
print(a)
print()

print("Row 2 to 3:")
print(a[2:3])          # [[5 7 2 9]]

print("\\nColumn 2 (all rows):")
print(a[:, 2])         # [5 6 2]

print("\\nRows 0-2, Cols 1-2:")
print(a[0:3, 1:3])     # [[3 5] [4 6] [7 2]]`} />
                                <OB output={`[[2 3 5 6]
 [3 4 6 8]
 [5 7 2 9]]

Row 2 to 3:
[[5 7 2 9]]

Column 2 (all rows):
[5 6 2]

Rows 0-2, Cols 1-2:
[[3 5]
 [4 6]
 [7 2]]`} />
                            </ProgCard>
                        </MC>

                        <MC name="3D Array Slicing" desc="Depth, rows aur columns ka slice" color="#0d9488">
                            <SyntaxBox syntax={`array_name[depth_start:stop, row_start:stop, col_start:stop]`} />
                            <ProgCard title="Example — 3D Slicing">
                                <CB code={`import numpy as np

a = np.array([[[4, 3, 5], [6, 7, 1]], [[8, 9, 1], [6, 7, 8]]])
print("Shape:", a.shape)
print(a)

print("\\nSlice [1:2, 0:2, 1:3]:")
print(a[1:2, 0:2, 1:3])`} />
                                <OB output={`Shape: (2, 2, 3)
[[[4 3 5]
  [6 7 1]]

 [[8 9 1]
  [6 7 8]]]

Slice [1:2, 0:2, 1:3]:
[[[9 1]
  [7 8]]]`} />
                            </ProgCard>
                        </MC>
                    </Sec>

                    {/* ═══════════════════════════
                        10. RESHAPE
                    ═══════════════════════════ */}
                    <Sec id="reshape" title="Reshape →" icon={<Repeat size={18} className="text-teal-600" />}>
                        <p>Array ki <strong>shape change</strong> karne ke liye <code className="bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-mono text-xs">reshape()</code> function ka use hota hai। Total elements same rehne chahiye!</p>

                        <SyntaxBox syntax={`array_name.reshape(rows, columns)`} />

                        <IB type="warning">Reshape tabhi kaam karega jab <strong>total elements = rows × columns</strong>। Warna error aayega!</IB>

                        <ProgCard title="Example — Reshape">
                            <CB code={`import numpy as np

a = np.array([1, 2, 3, 4, 5, 6])
print("Original:", a)
print("Shape:", a.shape)

b = a.reshape(3, 2)
print("\\nReshaped (3x2):")
print(b)

c = a.reshape(2, 3)
print("\\nReshaped (2x3):")
print(c)`} />
                            <OB output={`Original: [1 2 3 4 5 6]
Shape: (6,)

Reshaped (3x2):
[[1 2]
 [3 4]
 [5 6]]

Reshaped (2x3):
[[1 2 3]
 [4 5 6]]`} />
                        </ProgCard>
                    </Sec>

                    {/* ═══════════════════════════
                        11. ONES & ZEROS
                    ═══════════════════════════ */}
                    <Sec id="ones-zeros" title="Ones, Zeros, Ones_like & Zeros_like →" icon={<Binary size={18} className="text-yellow-600" />}>

                        <MC name="ones()" desc="Array ko 1 se bharta hai" color="#16a34a">
                            <SyntaxBox syntax={`numpy_obj.ones((size), dtype=int/float)`} />
                            <ProgCard title="Example — ones()">
                                <CB code={`import numpy as np

a = np.ones((3, 5), dtype=int)
print(a)`} />
                                <OB output={`[[1 1 1 1 1]
 [1 1 1 1 1]
 [1 1 1 1 1]]`} />
                            </ProgCard>
                        </MC>

                        <MC name="zeros()" desc="Array ko 0 se bharta hai" color="#dc2626">
                            <SyntaxBox syntax={`numpy_obj.zeros((size), dtype=int/float)`} />
                            <ProgCard title="Example — zeros()">
                                <CB code={`import numpy as np

a = np.zeros((5, 6), dtype=int)
print(a)`} />
                                <OB output={`[[0 0 0 0 0 0]
 [0 0 0 0 0 0]
 [0 0 0 0 0 0]
 [0 0 0 0 0 0]
 [0 0 0 0 0 0]]`} />
                            </ProgCard>
                        </MC>

                        <MC name="ones_like()" desc="Existing array jaisa shape ka ones array" color="#0d9488">
                            <SyntaxBox syntax={`numpy_obj.ones_like(array, dtype=int/float)`} />
                            <ProgCard title="Example — ones_like()">
                                <CB code={`import numpy as np

b = np.array([2, 4, 5, 6, 7])
a = np.ones_like(b, dtype=int)
print("Original:", b)
print("Ones_like:", a)`} />
                                <OB output={`Original: [2 4 5 6 7]
Ones_like: [1 1 1 1 1]`} />
                            </ProgCard>
                        </MC>

                        <MC name="zeros_like()" desc="Existing array jaisa shape ka zeros array" color="#7c3aed">
                            <SyntaxBox syntax={`numpy_obj.zeros_like(array, dtype=int/float)`} />
                            <ProgCard title="Example — zeros_like()">
                                <CB code={`import numpy as np

b = np.array([[2, 4], [5, 6]])
a = np.zeros_like(b, dtype=int)
print("Original:")
print(b)
print("Zeros_like:")
print(a)`} />
                                <OB output={`Original:
[[2 4]
 [5 6]]
Zeros_like:
[[0 0]
 [0 0]]`} />
                            </ProgCard>
                        </MC>
                    </Sec>

                    {/* ═══════════════════════════
                        12. EMPTY & COPY
                    ═══════════════════════════ */}
                    <Sec id="empty-copy" title="Empty & Copy →" icon={<Cpu size={18} className="text-indigo-600" />}>

                        <MC name="empty()" desc="Uninitialized array banata hai (random values)" color="#4f46e5">
                            <SyntaxBox syntax={`numpy_obj.empty((size), dtype=int/float)`} />
                            <ProgCard title="Example — empty()">
                                <p className="text-sm text-slate-600 mb-3">Empty function array banata hai but usmein <strong>random (garbage) values</strong> hoti hain — ye initialized nahi hota!</p>
                                <CB code={`import numpy as np

a = np.empty((4, 4), dtype=int)
print(a)`} />
                                <OB output={`[[ 0  0  0  0]
 [ 0  0  0  0]
 [ 0  0  0  0]
 [ 0  0  0  0]]`} />
                                <IB type="warning">Empty array me values random ho sakti hain! Ye <strong>guaranteed zero nahi</strong> hota — sirf memory allocate karta hai।</IB>
                            </ProgCard>
                        </MC>

                        <MC name="copy()" desc="Array ki deep copy banata hai" color="#059669">
                            <SyntaxBox syntax={`b = a.copy()`} />
                            <ProgCard title="Example — copy()">
                                <p className="text-sm text-slate-600 mb-3">Copy se ek <strong>independent copy</strong> banti hai — original me change karne par copy pe asar nahi hota।</p>
                                <CB code={`import numpy as np

a = np.array([3, 4, 6])
b = a.copy()

print("Original:", a)
print("Copy:", b)

# Original me change karo
a[0] = 99
print("\\nAfter changing original:")
print("Original:", a)
print("Copy:", b)    # copy unchanged!`} />
                                <OB output={`Original: [3 4 6]
Copy: [3 4 6]

After changing original:
Original: [99  4  6]
Copy: [3 4 6]`} />
                                <IB type="tip">Copy ke bina agar <code>b = a</code> karte ho to <strong>dono same array point</strong> karte hain — ek me change = dono me change!</IB>
                            </ProgCard>
                        </MC>
                    </Sec>

                    {/* ═══════════════════════════
                        13. IDENTITY & EYE
                    ═══════════════════════════ */}
                    <Sec id="identity-eye" title="Identity & Eye →" icon={<Table2 size={18} className="text-pink-600" />}>

                        <MC name="identity()" desc="Identity matrix return karta hai (diagonal pe 1)" color="#be185d">
                            <p className="text-sm text-slate-600 mb-3">Identity matrix me <strong>diagonal elements 1</strong> hote hain aur baaki sab <strong>0</strong> hote hain। Ye hamesha <strong>square matrix</strong> hoti hai।</p>
                            <SyntaxBox syntax={`numpy_obj.identity(size, dtype=int/float)`} />
                            <ProgCard title="Example — identity()">
                                <CB code={`import numpy as np

a = np.identity(4, dtype=int)
print(a)`} />
                                <OB output={`[[1 0 0 0]
 [0 1 0 0]
 [0 0 1 0]
 [0 0 0 1]]`} />
                            </ProgCard>
                        </MC>

                        <MC name="eye()" desc="Diagonal position change kar sakte ho" color="#7c3aed">
                            <p className="text-sm text-slate-600 mb-3">Eye function identity matrix jaisi hai but isme <strong>rows ≠ columns</strong> ho sakti hain aur <strong>diagonal position (k)</strong> change kar sakte ho।</p>
                            <SyntaxBox syntax={`numpy_obj.eye(rows, cols, k=0, dtype=int/float)`} />

                            <div className="my-3 overflow-x-auto">
                                <table className="min-w-full text-left text-sm text-slate-700 border-collapse border border-slate-200">
                                    <thead>
                                        <tr className="bg-pink-50">
                                            <th className="p-2 border border-slate-200 font-bold">Parameter</th>
                                            <th className="p-2 border border-slate-200 font-bold">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="p-2 border border-slate-200 font-mono text-xs">r</td><td className="p-2 border border-slate-200">Number of rows</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-mono text-xs">c</td><td className="p-2 border border-slate-200">Number of columns</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-mono text-xs">k</td><td className="p-2 border border-slate-200">Diagonal position (0=main, +ve=upper, -ve=lower)</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <ProgCard title="Example — eye() with different k values">
                                <CB code={`import numpy as np

# Default diagonal (k=0)
a = np.eye(4, 5, 0, dtype=int)
print("k=0 (main diagonal):")
print(a)

# Upper diagonal (k=1)
b = np.eye(4, 5, 1, dtype=int)
print("\\nk=1 (upper diagonal):")
print(b)

# Lower diagonal (k=-2)
c = np.eye(4, 5, -2, dtype=int)
print("\\nk=-2 (lower diagonal):")
print(c)`} />
                                <OB output={`k=0 (main diagonal):
[[1 0 0 0 0]
 [0 1 0 0 0]
 [0 0 1 0 0]
 [0 0 0 1 0]]

k=1 (upper diagonal):
[[0 1 0 0 0]
 [0 0 1 0 0]
 [0 0 0 1 0]
 [0 0 0 0 1]]

k=-2 (lower diagonal):
[[0 0 0 0 0]
 [0 0 0 0 0]
 [1 0 0 0 0]
 [0 1 0 0 0]]`} />
                            </ProgCard>
                        </MC>

                        {/* Identity vs Eye comparison */}
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full text-left text-sm text-slate-700 border-collapse border border-slate-200">
                                <thead>
                                    <tr className="bg-pink-50">
                                        <th className="p-2.5 border border-slate-200 font-bold">Feature</th>
                                        <th className="p-2.5 border border-slate-200 font-bold">identity()</th>
                                        <th className="p-2.5 border border-slate-200 font-bold">eye()</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td className="p-2 border border-slate-200 font-medium">Shape</td><td className="p-2 border border-slate-200">Hamesha square (n×n)</td><td className="p-2 border border-slate-200">Rectangular bhi ho sakta hai (r×c)</td></tr>
                                    <tr><td className="p-2 border border-slate-200 font-medium">Diagonal</td><td className="p-2 border border-slate-200">Hamesha main diagonal</td><td className="p-2 border border-slate-200">k se diagonal shift kar sakte ho</td></tr>
                                    <tr><td className="p-2 border border-slate-200 font-medium">Flexibility</td><td className="p-2 border border-slate-200">Kam flexible</td><td className="p-2 border border-slate-200">Zyada flexible</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </Sec>

                    {/* ═══════════════════════════
                        14. PRACTICE QUESTIONS
                    ═══════════════════════════ */}
                    <Sec id="practice" title="Practice Questions →" icon={<Brain size={18} className="text-rose-600" />}>
                        <p className="mb-4 text-slate-700">In programs ko khud likhne ka prayaas karein — Chapter 10 ko aur acche se samajhne ke liye 💪</p>

                        <div className="space-y-3">
                            {[
                                "Write a program to create a 1D NumPy array from a list and print its type.",
                                "Write a program to create arrays using array(), arange(), and linspace() — compare their outputs.",
                                "Write a program to find the dimension and shape of a 3D array.",
                                "Create a 2D array and access specific elements using indexing.",
                                "Write a program to slice a 2D array — get specific rows, columns and sub-matrix.",
                                "Write a program to reshape a 1D array of 12 elements into 3×4, 4×3, 2×6 and 6×2 arrays.",
                                "Create a 3×3 ones matrix and a 4×4 zeros matrix with integer dtype.",
                                "Write a program using ones_like() and zeros_like() with a given array.",
                                "Create an identity matrix of size 5 and an eye matrix with k=-1.",
                                "Write a program to demonstrate the difference between copy and view (assignment).",
                                "Create a NumPy array and reverse it using slicing.",
                                "Write a program to count even and odd numbers in a NumPy array.",
                                "Create a 3D array and extract a 2D slice from it.",
                                "Write a program to create an array using linspace with retstep=True and print the step value.",
                                "Create a program that demonstrates empty() — show that values are random/garbage.",
                            ].map((q, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-cyan-300">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-white font-extrabold text-sm" style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
                                        Q{idx + 1}
                                    </div>
                                    <div className="text-slate-800 font-medium text-[15px] leading-relaxed pt-2">{q}</div>
                                    <button
                                        onClick={() => { const ev = new CustomEvent('toggle-knobly-ai'); window.dispatchEvent(ev); }}
                                        className="ml-auto w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-cyan-100 hover:text-cyan-600 transition-colors"
                                        title="Ask AI to Explain"
                                    >
                                        <Sparkles size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Key Points Summary */}
                        <div className="mt-6 p-4 rounded-xl" style={{ background: '#ecfeff', border: '1px solid #a5f3fc' }}>
                            <h4 className="text-sm font-bold text-cyan-800 mb-3 flex items-center gap-2"><List size={14} />Chapter 10 — Key Points :</h4>
                            <ul className="space-y-2 text-sm text-cyan-900">
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" /><strong>NumPy</strong> — Numerical Python, Travis Oliphant (2005)</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" /><strong>50x Faster</strong> — Python list se 50 guna fast</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" /><strong>3 Array Creation:</strong> array(), arange(), linspace()</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" /><strong>Dimensions:</strong> 0D (scalar), 1D (vector), 2D (matrix), 3D+</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" /><strong>Shape:</strong> array.shape se rows × columns pata chalta hai</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" /><strong>Indexing:</strong> a[0], a[row,col], a[depth,row,col]</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" /><strong>Slicing:</strong> a[start:stop:step] — 1D, 2D, 3D support</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" /><strong>Utility:</strong> ones, zeros, empty, copy, identity, eye, reshape</li>
                            </ul>
                        </div>
                    </Sec>

                </main>
            </div>
        </div>
    );
}
