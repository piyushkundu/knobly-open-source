'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, BookOpen, Copy, Check, LayoutDashboard, StickyNote, Code2, Brain, Keyboard as KBIcon, Sparkles, Play, Zap, Globe, Cpu, Terminal, FileCode2, Hash, Type, ToggleLeft, CircleDot, Braces, Printer, Keyboard, Menu, X, ChevronRight, Leaf, TreePine } from 'lucide-react';
import MCQSection from '@/components/content/MCQSection';

/* ─── Code Block ─── */
function CB({ code, lang = 'python' }: { code: string; lang?: string }) {
    const [c, setC] = useState(false);
    const copy = () => { navigator.clipboard.writeText(code); setC(true); setTimeout(() => setC(false), 2000); };
    return (
        <div className="relative rounded-2xl overflow-hidden my-3" style={{ background: '#1e293b', boxShadow: '0 4px 16px rgba(15,23,42,0.12)', border: '1px solid #334155' }}>
            <div className="flex items-center justify-between px-4 py-1.5" style={{ background: '#0f172a', borderBottom: '1px solid #334155' }}>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400/60" /><span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" /><span className="w-2.5 h-2.5 rounded-full bg-green-400/60" /></div>
                    <span className="text-[9px] uppercase tracking-[0.18em] font-bold text-slate-600">{lang}</span>
                </div>
                <button onClick={copy} className="text-xs flex items-center gap-1 transition-colors" style={{ color: c ? '#34d399' : '#64748b' }}>
                    {c ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm text-slate-200"><code>{code}</code></pre>
                    {/* Global Styles */}
            <style jsx global>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% {transform: translateY(-20px) rotate(3deg); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% {transform: translateY(-15px) rotate(-3deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% {transform: translateY(-10px) rotate(2deg); }
                }
                @keyframes snake-hero {
                    0%, 100% { transform: translateY(-50%) translateX(0px) rotate(0deg); }
                    25% {transform: translateY(-50%) translateX(10px) rotate(2deg); }
                    50% {transform: translateY(-50%) translateX(0px) rotate(0deg); }
                    75% {transform: translateY(-50%) translateX(-10px) rotate(-2deg); }
                }
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 7s ease-in-out infinite;
                }
                .animate-snake-hero {
                    animation: snake-hero 5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

function Sec({ id, title, icon, children }: { id: string; title: string; icon: ReactNode; children: ReactNode }) {
    return (
        <section id={id} className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg" style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
                {icon}
                <h2 className="text-base md:text-lg font-extrabold" style={{ color: '#1e293b' }}>{title}</h2>
            </div>
            <div className="text-sm leading-relaxed space-y-3" style={{ color: '#475569' }}>{children}</div>
        </section>
    );
}

function IB({ type = 'tip', children }: { type?: 'tip' | 'note' | 'warning'; children: ReactNode }) {
    const s = { tip: { bg: '#ecfdf5', bc: '#86efac', tc: '#166534', emoji: '💡' }, note: { bg: '#eff6ff', bc: '#93c5fd', tc: '#1e40af', emoji: '📝' }, warning: { bg: '#fefce8', bc: '#fde047', tc: '#854d0e', emoji: '⚠️' } };
    const st = s[type];
    return <div className="rounded-xl p-3.5 text-xs font-medium my-3" style={{ background: st.bg, border: `1px solid ${st.bc}`, color: st.tc }}>{st.emoji} {children}</div>;
}

/* ─── Highlight box for simple definitions ─── */
function Def({ children }: { children: ReactNode }) {
    return <div className="rounded-xl p-4 my-3 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', border: '1px solid #a7f3d0', color: '#065f46' }}>{children}</div>;
}

function TH({ children }: { children: ReactNode }) {
    return <tr style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)' }} className="text-white">{children}</tr>;
}

const tocItems = [
    { icon: <Globe size={13} />, label: 'Introduction', id: 'intro', color: '#10b981' },
    { icon: <Cpu size={13} />, label: 'Versions', id: 'versions', color: '#14b8a6' },
    { icon: <Zap size={13} />, label: 'Advantages', id: 'advantages', color: '#0d9488' },
    { icon: <Terminal size={13} />, label: 'Working', id: 'working', color: '#2dd4bf' },
    { icon: <FileCode2 size={13} />, label: 'Modules', id: 'modules', color: '#34d399' },
    { icon: <Code2 size={13} />, label: 'Tokens', id: 'tokens', color: '#ec4899' },
    { icon: <Type size={13} />, label: 'Literals', id: 'literals', color: '#f43f5e' },
    { icon: <ToggleLeft size={13} />, label: 'Variables', id: 'variables', color: '#ef4444' },
    { icon: <CircleDot size={13} />, label: 'Operators', id: 'operators', color: '#f97316' },
    { icon: <Braces size={13} />, label: 'Punctuation', id: 'punctuation', color: '#eab308' },
    { icon: <Printer size={13} />, label: 'Print', id: 'print', color: '#22c55e' },
    { icon: <Keyboard size={13} />, label: 'Input', id: 'input', color: '#14b8a6' },
    { icon: <Code2 size={13} />, label: 'Strings', id: 'strings', color: '#06b6d4' },
    { icon: <Brain size={13} />, label: 'MCQ Quiz', id: 'mcq', color: '#10b981' },
    { icon: <BookOpen size={13} />, label: 'Practice', id: 'practice', color: '#14b8a6' },
];

const navLinks = [
    { label: 'Home', href: '/', icon: <Home size={14} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={14} /> },
    { label: 'Notes', href: '/notes', icon: <StickyNote size={14} /> },
    { label: 'Python', href: '/python', icon: <Code2 size={14} /> },
    { label: 'MCQ', href: '/mcq', icon: <Brain size={14} /> },
    { label: 'Shortcuts', href: '/shortcuts', icon: <KBIcon size={14} /> },
];

export default function PythonFundamentals() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('intro');

    return (
        <div className="min-h-screen bg-white text-slate-800 relative">

            {/* Animated Jungle Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30" />

                {/* Animated Leaves Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="jungle-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                                <path d="M60 10 Q80 30 60 70 Q40 30 60 10" fill="#10b981" />
                                <path d="M10 60 Q30 40 70 60 Q30 80 10 60" fill="#059669" />
                                <path d="M100 40 Q120 60 100 100 Q80 60 100 40" fill="#34d399" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#jungle-pattern)" />
                    </svg>
                </div>

                {/* Animated Snake Path - Top */}
                <svg className="absolute top-20 left-0 w-full h-32 opacity-20" viewBox="0 0 1200 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="snakeGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M-50,50 Q100,20 250,50 T550,50 T850,50 T1150,50 T1450,50"
                        fill="none"
                        stroke="url(#snakeGradient1)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="15,10,5,10"
                    >
                        <animate attributeName="stroke-dashoffset" from="0" to="40" dur="3s" repeatCount="indefinite" />
                    </path>
                </svg>

                {/* Animated Snake Path - Bottom */}
                <svg className="absolute bottom-40 left-0 w-full h-32 opacity-15" viewBox="0 0 1200 100" preserveAspectRatio="none">
                    <path
                        d="M-50,50 Q150,80 300,50 T600,50 T900,50 T1200,50 T1500,50"
                        fill="none"
                        stroke="url(#snakeGradient1)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="10,8,4,8"
                    >
                        <animate attributeName="stroke-dashoffset" from="40" to="0" dur="4s" repeatCount="indefinite" />
                    </path>
                </svg>

                {/* Floating Python Logos */}
                <div className="absolute top-32 right-20 w-40 h-40 opacity-[0.08] animate-float-slow">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M50 15 C35 15 25 25 25 40 L25 48 L37 48 L37 40 C37 35 42 32 50 32 C58 32 63 35 63 40 L63 48 L75 48 L75 40 C75 25 65 15 50 15" fill="#3776ab" />
                        <circle cx="37" cy="58" r="4" fill="white" />
                        <path d="M50 85 C65 85 75 75 75 60 L75 52 L63 52 L63 60 C63 65 58 68 50 68 C42 68 37 65 37 60 L37 52 L25 52 L25 60 C25 75 35 85 50 85" fill="#ffd43b" />
                        <circle cx="63" cy="42" r="4" fill="#333" />
                    </svg>
                </div>

                {/* Decorative Jungle Elements */}
                <div className="absolute top-40 left-10 w-20 h-20 opacity-[0.06] animate-float">
                    <Leaf className="w-full h-full text-emerald-600" />
                </div>
                <div className="absolute bottom-60 right-10 w-16 h-16 opacity-[0.05] animate-float-delayed">
                    <TreePine className="w-full h-full text-emerald-700" />
                </div>
            </div>

            

            {/* ══════ WHITE PREMIUM NAVBAR ══════ */}
            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.03)' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/python" className="flex items-center justify-center w-9 h-9 rounded-xl transition-all hover:scale-105 hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>
                            <ArrowLeft size={16} className="text-white" />
                        </Link>
                        <div>
                            <h1 className="text-sm font-extrabold" style={{ color: '#1e293b' }}>Python Fundamentals</h1>
                            <div className="flex items-center gap-1.5">
                                <Sparkles size={8} style={{ color: '#10b981' }} />
                                <span className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: '#10b981' }}>Complete Guide</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        {navLinks.map(l => (
                            <Link key={l.href} href={l.href} className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-105"
                                style={{ color: '#64748b' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#10b981'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
                                {l.icon}<span>{l.label}</span>
                            </Link>
                        ))}
                        <button onClick={() => setTocOpen(!tocOpen)} className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-all hover:shadow-md" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                            {tocOpen ? <X size={18} style={{ color: '#10b981' }} /> : <Menu size={18} style={{ color: '#10b981' }} />}
                        </button>
                    </div>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #10b981, #0d9488, #ec4899, #f97316, #10b981)' }} />
            </header>

            <div className="max-w-7xl mx-auto flex relative">
                {/* ── LEFT SIDEBAR TOC ── */}
                <aside className={`${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[52px] left-0 z-40 lg:z-10 w-64 lg:w-56 xl:w-64 h-[calc(100vh-52px)] overflow-y-auto transition-transform duration-300 lg:flex-shrink-0`}
                    style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRight: '1px solid #e2e8f0', boxShadow: tocOpen ? '4px 0 24px rgba(0,0,0,0.08)' : 'none' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}>
                                <Hash size={12} className="text-white" />
                            </div>
                            <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: '#1e293b' }}>Contents</span>
                        </div>
                        <nav className="space-y-0.5">
                            {tocItems.map(item => (
                                <a key={item.id} href={`#${item.id}`} onClick={() => { setActiveSection(item.id); setTocOpen(false); }}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                                    style={{ background: activeSection === item.id ? `${item.color}12` : 'transparent', border: activeSection === item.id ? `1px solid ${item.color}30` : '1px solid transparent', color: activeSection === item.id ? item.color : '#64748b' }}
                                    onMouseEnter={e => { if (activeSection !== item.id) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; } }}
                                    onMouseLeave={e => { if (activeSection !== item.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; } }}>
                                    <span style={{ color: item.color }}>{item.icon}</span>
                                    {item.label}
                                    {activeSection === item.id && <ChevronRight size={10} className="ml-auto" />}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>
                {tocOpen && <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setTocOpen(false)} />}

                {/* ── MAIN CONTENT ── */}
                <main className="flex-1 min-w-0 px-4 py-6 lg:pl-6">

                    {/* HERO */}
                    <section className="relative rounded-3xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 30%, #14b8a6 60%, #0d9488 100%)', boxShadow: '0 8px 32px rgba(99,102,241,0.25)' }}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)' }} />
                            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)' }} />
                        </div>
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
                                <Sparkles size={10} /> Complete Python Guide
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black mb-3 text-white" style={{ lineHeight: '1.2' }}>Python Fundamentals</h2>
                            <p className="text-sm md:text-base max-w-2xl mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>Har ek topic ki simple definition aur clear examples ke saath — Python seekhna ab bahut aasan hai!</p>
                            <div className="flex flex-wrap gap-2">
                                {[{ icon: <BookOpen size={14} />, label: '15 Topics' }, { icon: <Code2 size={14} />, label: '30+ Examples' }, { icon: <Brain size={14} />, label: '10 MCQs' }, { icon: <Zap size={14} />, label: 'Beginner Friendly' }].map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>{s.icon}<span>{s.label}</span></div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* YOUTUBE */}
                    <section className="rounded-2xl overflow-hidden mb-6" style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div className="p-5 md:p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center justify-center w-11 h-11 rounded-xl" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>
                                    <Play size={18} className="text-white ml-0.5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold" style={{ color: '#1e293b' }}>Watch the Video Lesson</h3>
                                    <p className="text-[11px]" style={{ color: '#475569' }}>Python Fundamentals — Knobly YouTube</p>
                                </div>
                                <div className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> YouTube
                                </div>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                                <iframe src="https://www.youtube.com/embed/sUlahBo2Xik?si=43hIgfqupqGIriOb" title="Python Fundamentals - Knobly" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="absolute inset-0 w-full h-full" style={{ border: 'none' }} />
                            </div>
                        </div>
                    </section>

                    {/* ═══════ CONTENT SECTIONS ═══════ */}

                    <Sec id="intro" title="Introduction to Python" icon={<Globe size={16} className="text-emerald-500" />}>
                        <Def>🐍 <strong>Python</strong> ek high-level, interpreted programming language hai jo simple aur readable hoti hai. Isko <strong>Guido van Rossum</strong> ne banaya tha aur <strong>1991</strong> mein pehli baar release hua tha.</Def>
                        <p><strong>Simple explanation:</strong> Python ek aisi programming language hai jisme aap English jaisi simple bhasha mein code likh sakte ho. Ye beginners ke liye sabse best language hai kyunki iska code padhna aur likhna bahut aasan hai.</p>
                        <h3 className="text-base font-bold mt-5 mb-2" style={{ color: '#1e293b' }}>Python kyun banaya gaya?</h3>
                        <p>Guido van Rossum 1980s mein ABC language par kaam kar rahe the. Unhone socha ki ek aisi language honi chahiye jo <strong>simple ho, powerful ho, aur sabke liye accessible ho</strong>. Issi idea se Python bani!</p>
                        <p>Naam &quot;Python&quot; British comedy show <strong>Monty Python&apos;s Flying Circus</strong> se liya gaya hai — saanp (snake) se nahi! 😄</p>

                        <h3 className="text-base font-bold mt-5 mb-2" style={{ color: '#1e293b' }}>Python kya kya kar sakti hai?</h3>
                        <ul className="list-disc ml-6 space-y-1">
                            <li><strong>Web Development</strong> — Websites banao (Django, Flask)</li>
                            <li><strong>Data Science</strong> — Data analyze karo (Pandas, NumPy)</li>
                            <li><strong>AI / Machine Learning</strong> — Smart apps banao (TensorFlow, PyTorch)</li>
                            <li><strong>Automation</strong> — Boring tasks automate karo</li>
                            <li><strong>Game Development</strong> — Games banao (Pygame)</li>
                        </ul>

                        <h3 className="text-base font-bold mt-5 mb-2" style={{ color: '#1e293b' }}>Python vs Other Languages</h3>
                        <CB code={`# Python mein Hello World — sirf 1 line!\nprint("Hello, World!")\n\n# C++ mein same kaam — 5 lines!\n# #include <iostream>\n# using namespace std;\n# int main() {\n#     cout << "Hello, World!";\n#     return 0;\n# }`} />
                        <IB type="tip">Python mein curly braces {'{ }'} ki jagah <strong>indentation</strong> (spaces) use hoti hai. Isse code saaf aur clean dikhta hai.</IB>
                    </Sec>

                    <Sec id="versions" title="Python Versions" icon={<Cpu size={16} className="text-teal-500" />}>
                        <Def>📦 Python ke alag-alag versions release hue hain jisme har baar naye features aur improvements mile hain.</Def>
                        <div className="overflow-x-auto my-3 rounded-xl" style={{ border: '1px solid #e2e8f0' }}><table className="w-full text-sm border-collapse"><thead><TH><th className="p-3 text-left">Version</th><th className="p-3 text-left">Year</th><th className="p-3 text-left">Kya Naya Aaya?</th></TH></thead><tbody>
                            {[['Python 1.0', '1994', 'Sabse pehla major release'], ['Python 2.0', '2000', 'List comprehensions aaye'], ['Python 2.7', '2010', 'Python 2 ka aakhri version'], ['Python 3.0', '2008', 'Bahut bade changes — naya Python!'], ['Python 3.11', '2022', 'Bahut fast + better error messages'], ['Python 3.12', '2023', 'Latest version ✨ — Use this!']].map(([v, y, d], i) => (
                                <tr key={i} style={{ background: i % 2 ? '#f8fafc' : '#fff', borderBottom: '1px solid #f1f5f9' }}><td className="p-3 font-mono font-semibold" style={{ color: '#10b981' }}>{v}</td><td className="p-3">{y}</td><td className="p-3">{d}</td></tr>
                            ))}
                        </tbody></table></div>
                        <IB type="warning">Python 2 ab band ho gaya hai (January 2020 se). Hamesha <strong>Python 3</strong> use karo!</IB>
                    </Sec>

                    <Sec id="advantages" title="Advantages of Python" icon={<Zap size={16} className="text-emerald-500" />}>
                        <Def>🌟 Python ke bahut saare faayde hain jo ise duniya ki sabse popular language banate hain.</Def>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                            {[{ t: '📚 Easy to Learn', d: 'Python ka code English jaisa hota hai. Beginners sirf kuch hi dino mein Python seekh sakte hain.', bg: '#ecfdf5', bc: '#a7f3d0', tc: '#4338ca' }, { t: '🚀 Versatile', d: 'Web apps, AI, data analysis, games — Python se sab kuch bana sakte ho!', bg: '#ecfdf5', bc: '#a7f3d0', tc: '#166534' }, { t: '📦 Huge Library', d: 'Thousands of ready-made libraries available hain — aapko sab kuch scratch se nahi banana padta.', bg: '#f5f3ff', bc: '#ddd6fe', tc: '#5b21b6' }, { t: '⚡ Interpreted', d: 'Code ek ek line execute hota hai. Error aaye to turant pata chal jaata hai!', bg: '#fff7ed', bc: '#fed7aa', tc: '#9a3412' }, { t: '🔓 Free & Open Source', d: 'Python free hai! Koi bhi download karke use kar sakta hai — commercial use bhi!', bg: '#f0fdfa', bc: '#99f6e4', tc: '#115e59' }, { t: '🤝 Big Community', d: 'Lakho developers worldwide. Koi bhi problem ho — Stack Overflow par answer mil jaata hai!', bg: '#fdf2f8', bc: '#fbcfe8', tc: '#9d174d' }].map((item, i) => (
                                <div key={i} className="p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg" style={{ background: item.bg, border: `1px solid ${item.bc}` }}>
                                    <h4 className="font-bold text-sm mb-1" style={{ color: item.tc }}>{item.t}</h4>
                                    <p className="text-xs" style={{ color: '#64748b' }}>{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </Sec>

                    <Sec id="working" title="Working with Python" icon={<Terminal size={16} className="text-teal-500" />}>
                        <Def>🖥️ Python mein kaam karne ke liye pehle ise install karna hota hai, phir aap code likh aur chala sakte ho.</Def>

                        <h3 className="text-base font-bold mt-4 mb-2" style={{ color: '#1e293b' }}>Step 1: Python Install Karo</h3>
                        <ol className="list-decimal ml-6 space-y-2 mb-4">
                            <li><strong>Download karo:</strong> <a href="https://www.python.org/downloads/" className="text-emerald-700 underline font-semibold" target="_blank" rel="noopener noreferrer">python.org/downloads</a> par jaake latest version download karo</li>
                            <li><strong>Install karo:</strong> Installer open karo. ⚠️ <strong>&quot;Add Python to PATH&quot;</strong> checkbox zaroor tick karo!</li>
                            <li><strong>Check karo:</strong> Command Prompt open karo aur type karo:</li>
                        </ol>
                        <CB code="python --version\n# Output: Python 3.12.x" />

                        <h3 className="text-base font-bold mt-6 mb-2" style={{ color: '#1e293b' }}>Step 2: Interactive Mode (Direct Typing)</h3>
                        <p>Command Prompt mein <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-mono text-xs">python</code> type karo aur directly code likho. Ye testing ke liye best hai!</p>
                        <CB code={`>>> print("Hello, World!")\nHello, World!\n\n>>> 2 + 3\n5\n\n>>> name = "Python"\n>>> print(f"I love {name}!")\nI love Python!\n\n>>> exit()  # Interactive mode se bahar aane ke liye`} />

                        <h3 className="text-base font-bold mt-6 mb-2" style={{ color: '#1e293b' }}>Step 3: Program Mode (File mein Code)</h3>
                        <p>Bade programs ke liye code ek <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-mono text-xs">.py</code> file mein likho:</p>
                        <CB code={`# hello.py file banao aur ye likho:\nprint("Namaste! Mera naam Python hai!")\nprint("Mein ek programming language hoon.")\n\nfor i in range(1, 6):\n    print(f"Counting: {i}")`} />
                        <p>Phir terminal mein run karo: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-mono text-xs">python hello.py</code></p>
                    </Sec>

                    <Sec id="modules" title="Modules and Program Files" icon={<FileCode2 size={16} className="text-emerald-500" />}>
                        <Def>📁 <strong>Module</strong> ek Python file hoti hai (.py extension ke saath) jisme aap apna code likhte ho. Aap dusre modules ko <code>import</code> karke use bhi kar sakte ho.</Def>
                        <h3 className="text-base font-bold mt-4 mb-2" style={{ color: '#1e293b' }}>Python File kaise banaye?</h3>
                        <ol className="list-decimal ml-6 space-y-1 mb-4">
                            <li>Koi bhi text editor kholo (VSCode, Notepad++, PyCharm)</li>
                            <li>Naya file banao aur Python code likho</li>
                            <li>File ko <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-600 font-mono text-xs">.py</code> extension ke saath save karo (jaise: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-mono text-xs">calculator.py</code>)</li>
                        </ol>
                        <CB code={`# calculator.py - ek simple calculator\nnum1 = 10\nnum2 = 5\n\nprint(f"Jod (Sum): {num1 + num2}")      # 15\nprint(f"Ghata (Diff): {num1 - num2}")    # 5\nprint(f"Guna (Multiply): {num1 * num2}") # 50\nprint(f"Bhaag (Divide): {num1 / num2}")  # 2.0`} />
                        <p>Run karo: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-mono text-xs">python calculator.py</code></p>
                    </Sec>

                    <Sec id="tokens" title="Python Tokens" icon={<Code2 size={16} className="text-teal-500" />}>
                        <Def>🧩 <strong>Token</strong> Python code ka sabse chhota hissa hai. Jaise sentence mein words hote hain, waise hi code mein tokens hote hain. Python mein 5 type ke tokens hote hain.</Def>

                        <h3 className="text-base font-bold mt-5 mb-2" style={{ color: '#1e293b' }}>1. Identifiers (Naam)</h3>
                        <p><strong>Simple definition:</strong> Identifier ek naam hai jo aap apne variables, functions, ya classes ko dete ho. Jaise aapka naam aapki pehchaan hai, waise hi identifier code ki pehchaan hai.</p>
                        <p className="mt-2"><strong>Rules (Niyam):</strong></p>
                        <ul className="list-disc ml-6 space-y-1 mb-3">
                            <li>Letter (A-Z, a-z) ya underscore (_) se shuru hona chahiye</li>
                            <li>Numbers bhi ho sakte hain lekin pehla character number nahi ho sakta</li>
                            <li>Case-sensitive hai — <code>name</code>, <code>Name</code>, <code>NAME</code> teen alag cheezein hain!</li>
                            <li>Special characters (@, #, $, !) allowed nahi hain</li>
                        </ul>
                        <CB code={`# ✅ Sahi (Valid) Identifiers:\nname = "Rahul"\nstudent_1 = "Priya"\n_private = "Secret"\ntotalMarks = 450\n\n# ❌ Galat (Invalid) Identifiers:\n# 123name = "Error"    → Number se shuru nahi ho sakta\n# my-var = 10          → Hyphen (-) allowed nahi\n# for = 5             → Reserved keyword hai\n# $price = 100        → Special symbol nahi chalega`} />

                        <h3 className="text-base font-bold mt-6 mb-2" style={{ color: '#1e293b' }}>2. Keywords (Reserved Words)</h3>
                        <p><strong>Simple definition:</strong> Keywords woh special words hain jo Python ne pehle se book kar rakhe hain. Inhe aap apne variable naam ke roop mein use nahi kar sakte.</p>
                        <div className="overflow-x-auto my-3 rounded-xl" style={{ border: '1px solid #e2e8f0' }}><table className="w-full text-sm border-collapse"><thead><TH><th className="p-3 text-left" colSpan={5}>Python ke 35 Keywords</th></TH></thead><tbody>
                            {[['False', 'None', 'True', 'and', 'as'], ['assert', 'async', 'await', 'break', 'class'], ['continue', 'def', 'del', 'elif', 'else'], ['except', 'finally', 'for', 'from', 'global'], ['if', 'import', 'in', 'is', 'lambda'], ['nonlocal', 'not', 'or', 'pass', 'raise'], ['return', 'try', 'while', 'with', 'yield']].map((row, i) => (
                                <tr key={i} style={{ background: i % 2 ? '#f8fafc' : '#fff', borderBottom: '1px solid #f1f5f9' }}>{row.map((k, j) => <td key={j} className="p-2 font-mono font-semibold" style={{ color: '#10b981' }}>{k}</td>)}</tr>
                            ))}
                        </tbody></table></div>
                        <CB code={`# Keywords check karne ka tarika:\nimport keyword\nprint(keyword.kwlist)\nprint(f"Total keywords: {len(keyword.kwlist)}")`} />
                    </Sec>

                    <Sec id="literals" title="Literals" icon={<Type size={16} className="text-red-500" />}>
                        <Def>📌 <strong>Literal</strong> ek fixed value hoti hai jo directly code mein likhi jaati hai. Jaise <code>10</code>, <code>&quot;Hello&quot;</code>, <code>True</code> — ye sab literals hain.</Def>

                        <h3 className="text-base font-bold mt-4 mb-2" style={{ color: '#1e293b' }}>String Literals (Text)</h3>
                        <p>Text ko single quotes, double quotes, ya triple quotes mein likha jaata hai.</p>
                        <CB code={`# Single quotes\nname = 'Rahul'\n\n# Double quotes\ncity = "Delhi"\n\n# Triple quotes - jab text multiple lines mein ho\npoem = """Twinkle twinkle little star,\nHow I wonder what you are.\nUp above the world so high,\nLike a diamond in the sky."""\n\nprint(poem)`} />

                        <h3 className="text-base font-bold mt-5 mb-2" style={{ color: '#1e293b' }}>Numeric Literals (Numbers)</h3>
                        <CB code={`# Integer (poore numbers)\nage = 18\nmarks = 95\n\n# Float (decimal wale numbers)\nheight = 5.8\npi = 3.14159\n\n# Binary (0b se shuru)\nbinary = 0b1010  # ye hai 10\n\n# Hexadecimal (0x se shuru)\nhex_num = 0xFF   # ye hai 255\n\nprint(f"Age: {age}, Height: {height}")\nprint(f"Binary 0b1010 = {binary}")  # Output: 10`} />

                        <h3 className="text-base font-bold mt-5 mb-2" style={{ color: '#1e293b' }}>Boolean & None</h3>
                        <p><strong>Boolean:</strong> Sirf do values — <code>True</code> (haan) ya <code>False</code> (nahi)</p>
                        <p><strong>None:</strong> Koi value nahi hai — khaali (empty)</p>
                        <CB code={`# Boolean - True ya False\nis_student = True\nhas_passed = False\nprint(is_student)  # True\n\n# None - koi value nahi\nresult = None\nprint(result)      # None\nprint(type(result)) # <class 'NoneType'>`} />
                    </Sec>

                    <Sec id="variables" title="Variables & Data Types" icon={<ToggleLeft size={16} className="text-orange-500" />}>
                        <Def>📦 <strong>Variable</strong> ek dabba (container) hai jisme aap koi bhi value rakh sakte ho. Python mein aapko type batane ki zaroorat nahi — Python khud samajh jaata hai!</Def>

                        <p><strong>Real life example:</strong> Jaise ek dabba hai jisme aap apna naam likh sakte ho, ya number daal sakte ho — Python variable bhi exactly aisa hai!</p>

                        <CB code={`# Variable banane ka tarika: naam = value\nname = "Rahul"        # String (text)\nage = 18              # Integer (poora number)\nheight = 5.8          # Float (decimal number)\nis_student = True     # Boolean (haan/nahi)\nfav_fruits = ["Apple", "Mango"]  # List\n\n# Type check karo - Python khud batata hai!\nprint(type(name))      # <class 'str'>\nprint(type(age))       # <class 'int'>\nprint(type(height))    # <class 'float'>\nprint(type(is_student)) # <class 'bool'>\n\n# Variable ki value change bhi kar sakte ho!\nage = 19  # ab age 19 hai\nprint(f"{name} ki age {age} hai aur height {height} hai")`} />

                        <IB type="tip">Python mein aap variable ka type kabhi bhi change kar sakte ho. <code>x = 10</code> ke baad <code>x = &quot;hello&quot;</code> likh sakte ho — koi error nahi aayega!</IB>
                    </Sec>

                    <Sec id="operators" title="Operators" icon={<CircleDot size={16} className="text-amber-500" />}>
                        <Def>➕ <strong>Operators</strong> woh special symbols hain jo values par kaam (operations) karte hain. Jaise Math mein + aur - hai, waise hi Python mein bhi bahut operators hain.</Def>

                        <h3 className="text-base font-bold mt-4 mb-2" style={{ color: '#1e293b' }}>Arithmetic Operators (Math wale)</h3>
                        <div className="overflow-x-auto my-3 rounded-xl" style={{ border: '1px solid #e2e8f0' }}><table className="w-full text-sm border-collapse"><thead><TH><th className="p-3">Symbol</th><th className="p-3">Kaam</th><th className="p-3">Example</th><th className="p-3">Answer</th></TH></thead><tbody>
                            {[['+', 'Jod (Add)', '10 + 3', '13'], ['-', 'Ghatao (Subtract)', '10 - 3', '7'], ['*', 'Guna (Multiply)', '10 * 3', '30'], ['/', 'Bhaag (Divide)', '10 / 3', '3.33'], ['//', 'Floor Division', '10 // 3', '3'], ['%', 'Remainder', '10 % 3', '1'], ['**', 'Power', '2 ** 3', '8']].map(([o, n, e, r], i) => (
                                <tr key={i} style={{ background: i % 2 ? '#f8fafc' : '#fff', borderBottom: '1px solid #f1f5f9' }}><td className="p-2 text-center font-mono font-bold" style={{ color: '#10b981' }}>{o}</td><td className="p-2">{n}</td><td className="p-2 font-mono">{e}</td><td className="p-2 font-semibold">{r}</td></tr>
                            ))}
                        </tbody></table></div>
                        <CB code={`a = 10\nb = 3\nprint(f"Jod: {a + b}")        # 13\nprint(f"Ghatao: {a - b}")     # 7\nprint(f"Guna: {a * b}")       # 30\nprint(f"Bhaag: {a / b}")      # 3.333...\nprint(f"Floor: {a // b}")     # 3 (decimal hata do)\nprint(f"Remainder: {a % b}")  # 1\nprint(f"Power: {a ** b}")     # 1000`} />

                        <h3 className="text-base font-bold mt-6 mb-2" style={{ color: '#1e293b' }}>Comparison Operators (Compare karo)</h3>
                        <p>Do values ko compare karte hain aur result <code>True</code> ya <code>False</code> aata hai:</p>
                        <CB code={`x = 5\ny = 10\n\nprint(x == y)   # False (5 barabar 10? Nahi!)\nprint(x != y)   # True  (5 alag hai 10 se? Haan!)\nprint(x > y)    # False (5 bada hai 10 se? Nahi!)\nprint(x < y)    # True  (5 chhota hai 10 se? Haan!)\nprint(x >= 5)   # True  (5 barabar ya bada 5 se? Haan!)\nprint(x <= 3)   # False (5 barabar ya chhota 3 se? Nahi!)`} />

                        <h3 className="text-base font-bold mt-6 mb-2" style={{ color: '#1e293b' }}>Identity Operators (is / is not)</h3>
                        <p><strong>Simple:</strong> <code>==</code> value check karta hai, <code>is</code> check karta hai ki dono same object hain ya nahi.</p>
                        <CB code={`a = [1, 2, 3]\nb = [1, 2, 3]  # Same value, but different object!\nc = a          # Same object\n\nprint(a == b)   # True  (values same hain)\nprint(a is b)   # False (objects alag hain)\nprint(a is c)   # True  (c toh a ka hi naam hai!)`} />

                        <h3 className="text-base font-bold mt-6 mb-2" style={{ color: '#1e293b' }}>Membership Operators (in / not in)</h3>
                        <p><strong>Simple:</strong> Check karo ki koi cheez list/string mein hai ya nahi.</p>
                        <CB code={`fruits = ["apple", "banana", "mango"]\n\nprint("banana" in fruits)     # True  ✅ hai!\nprint("grape" in fruits)      # False ❌ nahi hai!\nprint("grape" not in fruits)  # True  ✅ sahi, nahi hai!\n\n# Strings mein bhi kaam karta hai:\nprint("py" in "python")       # True ✅`} />
                    </Sec>

                    <Sec id="punctuation" title="Python Punctuation" icon={<Braces size={16} className="text-yellow-500" />}>
                        <Def>✏️ <strong>Punctuation</strong> woh special symbols hain jo Python code ko structure dete hain — jaise Hindi mein danda (।) aur comma (,) hota hai.</Def>
                        <ul className="list-disc ml-6 space-y-2 mb-3">
                            <li><strong>Colon <code>:</code></strong> → if, for, while, function ke baad lagta hai</li>
                            <li><strong>Comma <code>,</code></strong> → Items alag karta hai (list mein, function mein)</li>
                            <li><strong>Parentheses <code>()</code></strong> → Function call karne mein</li>
                            <li><strong>Square brackets <code>[]</code></strong> → List banane ya index karne mein</li>
                            <li><strong>Curly braces <code>{'{}'}</code></strong> → Dictionary aur Set mein</li>
                            <li><strong>Hash <code>#</code></strong> → Comment likhne ke liye (Python ise ignore karta hai)</li>
                        </ul>
                        <CB code={`# Colon (:) - function definition mein\ndef namaste(name):     # ← colon yahan hai\n    print(f"Namaste, {name}!")\n\n# Brackets - list banao\nfruits = ["Apple", "Banana", "Mango"]  # ← square brackets\n\n# Curly braces - dictionary banao\nstudent = {"name": "Rahul", "age": 18}  # ← curly braces\n\n# Hash (#) - comments likhne ke liye\n# Ye line Python ignore karega`} />
                    </Sec>

                    <Sec id="print" title="Print Statement" icon={<Printer size={16} className="text-green-500" />}>
                        <Def>🖨️ <strong>print()</strong> function screen par output dikhata hai. Ye Python ka sabse pehla aur sabse zyada use hone wala function hai!</Def>

                        <h3 className="text-base font-bold mt-4 mb-2" style={{ color: '#1e293b' }}>Basic Print</h3>
                        <CB code={`print("Hello, World!")       # Text print karo\nprint(42)                   # Number print karo\nprint(True)                 # Boolean print karo\nprint("Mera naam", "Rahul") # Multiple items print karo\n# Output: Mera naam Rahul`} />

                        <h3 className="text-base font-bold mt-5 mb-2" style={{ color: '#1e293b' }}>Separator (sep) aur End</h3>
                        <CB code={`# sep = items ke beech mein kya aaye\nprint("Apple", "Banana", "Mango", sep=" | ")\n# Output: Apple | Banana | Mango\n\n# end = line ke end mein kya aaye (default: new line)\nprint("Hello", end=" ")\nprint("World!")\n# Output: Hello World!  (ek hi line mein!)`} />

                        <h3 className="text-base font-bold mt-5 mb-2" style={{ color: '#1e293b' }}>F-strings — Sabse Best Tarika! ⭐</h3>
                        <CB code={`name = "Rahul"\nage = 18\nmarks = 95.5\n\n# f-string: f"..." ke andar {variable} likho\nprint(f"Mera naam {name} hai")\nprint(f"Meri age {age} hai")\nprint(f"Mere marks {marks} hain")\nprint(f"Next year meri age {age + 1} hogi")\n\n# Old tarika (format method)\nprint("Naam: {}, Age: {}".format(name, age))`} />
                        <IB type="tip">Hamesha <strong>f-strings</strong> use karo — ye sabse easy aur fast hai! Bas <code>f&quot;...&quot;</code> likho aur variables <code>{'{}'}</code> mein daalo.</IB>
                    </Sec>

                    <Sec id="input" title="Input Statement" icon={<Keyboard size={16} className="text-teal-500" />}>
                        <Def>⌨️ <strong>input()</strong> function user se data leta hai keyboard se. Ye hamesha <strong>string</strong> return karta hai — number chahiye to convert karna padta hai!</Def>

                        <h3 className="text-base font-bold mt-4 mb-2" style={{ color: '#1e293b' }}>Basic Input</h3>
                        <CB code={`# User se naam pucho\nname = input("Aapka naam kya hai? ")\nprint(f"Namaste, {name}! Kaise ho?")\n\n# Output:\n# Aapka naam kya hai? Rahul  ← user type karega\n# Namaste, Rahul! Kaise ho?`} />

                        <h3 className="text-base font-bold mt-5 mb-2" style={{ color: '#1e293b' }}>Number Input (Type Convert)</h3>
                        <CB code={`# ⚠️ input() hamesha STRING deta hai!\nage_str = input("Age batao: ")  # ye string hai: "18"\nage = int(age_str)              # ab integer hai: 18\n\n# Short tarika — ek hi line mein:\nage = int(input("Age batao: "))\nnext_year = age + 1\nprint(f"Next year aap {next_year} saal ke ho jaoge!")\n\n# Float ke liye\nheight = float(input("Height batao (meters): "))\nprint(f"Aapki height {height} meters hai")`} />

                        <h3 className="text-base font-bold mt-5 mb-2" style={{ color: '#1e293b' }}>Multiple Inputs Ek Line Mein</h3>
                        <CB code={`# Ek line mein do numbers lo\nx, y = input("Do numbers likho (space se alag): ").split()\nx, y = int(x), int(y)\n\nprint(f"Jod: {x + y}")\nprint(f"Guna: {x * y}")`} />
                        <IB type="warning">Agar user number ki jagah text type kare to <code>int()</code> error de dega. Real programs mein <code>try-except</code> se error handle karo!</IB>
                    </Sec>

                    <Sec id="strings" title="String Operations" icon={<Code2 size={16} className="text-sky-500" />}>
                        <Def>🔤 <strong>String</strong> text data hoti hai. Python mein strings par bahut saare operations kar sakte ho — length nikalo, uppercase karo, kuch dhundho, replace karo!</Def>
                        <CB code={`name = "Knobly Web"\n\n# Length (kitne characters hain)\nprint(len(name))          # 9\n\n# Uppercase / Lowercase\nprint(name.upper())       # Knobly Web\nprint(name.lower())       # Knobly Web\n\n# Slicing (hissa nikalo)\nprint(name[0:6])          # Knobly (index 0 se 5 tak)\nprint(name[-2:])          # OS (last 2 characters)\n\n# Replace (badal do)\nprint(name.replace("OS", "System"))  # Knobly System\n\n# Check karo kuch hai ya nahi\nprint("Knobly" in name)   # True ✅\nprint("Python" in name)   # False ❌\n\n# Split (tod do)\nwords = "apple,banana,mango".split(",")\nprint(words)  # ['apple', 'banana', 'mango']`} />
                    </Sec>

                    {/* ═══ MCQ QUIZ ═══ */}
                    <Sec id="mcq" title="MCQ Quiz — Apna Knowledge Test Karo!" icon={<Brain size={16} className="text-emerald-500" />}>
                        <p className="mb-4">Neeche <strong>10 important MCQs</strong> hain — har ek question ka answer select karo aur check karo kitna samjhe!</p>
                        <MCQSection />
                    </Sec>

                    {/* ═══ PRACTICE ═══ */}
                    <Sec id="practice" title="Practice Questions — Khud Karo!" icon={<BookOpen size={16} className="text-teal-500" />}>
                        <p className="mb-3">In questions ka output khud socho, phir code chalake check karo! 💪</p>
                        <div className="space-y-3">
                            {[{ q: 'Arithmetic Operators', h: 'Floor division, modulus aur power calculate karo.', code: 'a = 10\nb = 3\nprint(a // b)   # ?\nprint(a % b)    # ?\nprint(a ** b)   # ?', bg: '#ecfdf5', bc: '#a7f3d0', tc: '#4338ca' }, { q: 'Comparison & Logical', h: 'Har expression ko step by step solve karo.', code: 'x = 5\ny = 10\nprint(x == 5)          # ?\nprint(x != y)          # ?\nprint(x > y or x == 5) # ?', bg: '#f5f3ff', bc: '#ddd6fe', tc: '#5b21b6' }, { q: 'Identity vs Equality', h: '== value check karta hai, is object check karta hai.', code: 'list1 = [1, 2, 3]\nlist2 = [1, 2, 3]\nlist3 = list1\nprint(list1 == list2)  # ?\nprint(list1 is list2)  # ?\nprint(list1 is list3)  # ?', bg: '#fdf2f8', bc: '#fbcfe8', tc: '#9d174d' }, { q: 'Assignment Operators', h: 'Har step mein x ki value calculate karo.', code: 'x = 10\nx += 5    # x = 10 + 5 = ?\nx *= 2    # x = ? * 2 = ?\nx //= 3   # x = ? // 3 = ?\nprint(x)  # Final answer?', bg: '#ecfdf5', bc: '#a7f3d0', tc: '#166534' }].map((item, i) => (
                                <div key={i} className="rounded-2xl overflow-hidden" style={{ background: item.bg, border: `1px solid ${item.bc}` }}>
                                    <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${item.bc}` }}>
                                        <span className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black text-white" style={{ background: item.tc }}>{i + 1}</span>
                                        <h4 className="font-bold text-sm" style={{ color: item.tc }}>{item.q}</h4>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm mb-2" style={{ color: '#475569' }}>Output kya hoga? Pehle socho, phir check karo! 🤔</p>
                                        <CB code={item.code} />
                                        <p className="text-xs" style={{ color: '#475569' }}>💡 <strong>Hint:</strong> {item.h}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Sec>
                </main>
            </div>
        </div>
    );
}
