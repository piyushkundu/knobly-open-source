'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, BookOpen, Copy, Check, LayoutDashboard, StickyNote, Code2, Brain, Keyboard as KBIcon, Sparkles, BoxSelect, Eye, Settings2, Trash2, Key, ListTree, Repeat, ChevronRight, Zap, Database, FunctionSquare, Calculator, Search, FileText } from 'lucide-react';

function CB({ code, lang = 'python' }: { code: string; lang?: string }) {
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
                    <span className="text-[9px] uppercase tracking-[0.18em] font-bold text-slate-400">{lang}</span>
                </div>
                <button onClick={copy} className="text-xs flex items-center gap-1 transition-colors" style={{ color: c ? '#c084fc' : '#64748b' }}>
                    {c ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm text-slate-200"><code>{code}</code></pre>
        </div>
    );
}

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

function IB({ type = 'tip', children }: { type?: 'tip' | 'note' | 'warning'; children: ReactNode }) {
    const s = { 
        tip: { bg: '#fdf4ff', border: '#f0abfc', text: '#86198f', emoji: '💡' }, 
        note: { bg: '#f5f3ff', border: '#c4b5fd', text: '#5b21b6', emoji: '📝' }, 
        warning: { bg: '#fffbeb', border: '#fde047', text: '#b45309', emoji: '⚠️' } 
    }; 
    const st = s[type];
    return <div className="rounded-xl p-3.5 text-sm font-medium my-3" style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.text }}>{st.emoji} {children}</div>;
}

function MethodCard({ name, desc, children, color }: { name: string; desc: string; children: ReactNode; color: string }) {
    return (
        <div className="rounded-2xl overflow-hidden mb-4" style={{ border: `1px solid ${color}30`, background: `${color}05` }}>
            <div className="px-4 py-3 flex items-center gap-2.5" style={{ borderBottom: `1px solid ${color}20` }}>
                <code className="text-sm font-extrabold font-mono" style={{ color }}>{name}</code>
                <span className="text-xs font-medium" style={{ color: '#64748b' }}>— {desc}</span>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

const tocItems = [
    { icon: <BookOpen size={13} />, label: 'Introduction', id: 'intro', color: '#6d28d9' },
    { icon: <Calculator size={13} />, label: 'Math Module', id: 'math', color: '#7c3aed' },
    { icon: <Zap size={13} />, label: 'Random Module', id: 'random', color: '#8b5cf6' },
    { icon: <Code2 size={13} />, label: 'String Manipulations', id: 'string', color: '#a855f7' },
    { icon: <BoxSelect size={13} />, label: 'String Methods', id: 'string-methods', color: '#c084fc' },
    { icon: <Repeat size={13} />, label: 'Date & Time', id: 'datetime', color: '#d946ef' },
    { icon: <Brain size={13} />, label: 'Practice Questions', id: 'practice', color: '#ec4899' },
];

const navLinks = [
    { label: 'Home', href: '/', icon: <Home size={14} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={14} /> },
    { label: 'Notes', href: '/notes', icon: <StickyNote size={14} /> },
    { label: 'Python', href: '/python', icon: <Code2 size={14} /> },
    { label: 'MCQ', href: '/mcq', icon: <Brain size={14} /> },
    { label: 'Shortcuts', href: '/shortcuts', icon: <KBIcon size={14} /> },
];

export default function LibraryFunctionsPage() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('intro');

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fdf4ff 0%, #f3e8ff 30%, #e9d5ff 100%)' }}>
            {/* ═══ NAVBAR ═══ */}
            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/python" className="flex items-center justify-center w-9 h-9 rounded-xl hover:scale-105 transition-all" style={{ background: 'linear-gradient(135deg, #7e22ce, #a855f7)', boxShadow: '0 2px 8px rgba(168,85,247,0.3)' }}>
                            <ArrowLeft size={16} className="text-white" />
                        </Link>
                        <div>
                            <h1 className="text-sm font-extrabold" style={{ color: '#0f172a' }}>Library Functions</h1>
                            <div className="flex items-center gap-1.5">
                                <Sparkles size={8} style={{ color: '#9333ea' }} />
                                <span className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: '#9333ea' }}>Chapter 6 • Python</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        {navLinks.map(l => (
                            <Link key={l.href} href={l.href} className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-105" style={{ color: '#64748b' }} onMouseEnter={e => { e.currentTarget.style.background = '#faf5ff'; e.currentTarget.style.color = '#9333ea'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
                                {l.icon}<span>{l.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #6b21a8, #7e22ce, #9333ea, #a855f7, #6b21a8)' }} />
            </header>

            <div className="max-w-7xl mx-auto flex relative">
                {/* ── SIDEBAR ── */}
                <aside className={`${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[52px] left-0 z-40 lg:z-10 w-64 lg:w-56 xl:w-64 h-[calc(100vh-52px)] overflow-y-auto transition-transform duration-300 lg:flex-shrink-0`} style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRight: '1px solid #e2e8f0' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7e22ce, #a855f7)' }}>
                                <FunctionSquare size={12} className="text-white" />
                            </div>
                            <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: '#0f172a' }}>Contents</span>
                        </div>
                        <nav className="space-y-0.5">
                            {tocItems.map(item => (
                                <a key={item.id} href={`#${item.id}`} onClick={() => { setActiveSection(item.id); setTocOpen(false); }} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all" style={{ background: activeSection === item.id ? `${item.color}12` : 'transparent', border: activeSection === item.id ? `1px solid ${item.color}30` : '1px solid transparent', color: activeSection === item.id ? item.color : '#64748b' }} onMouseEnter={e => { if (activeSection !== item.id) { e.currentTarget.style.background = '#faf5ff'; } }} onMouseLeave={e => { if (activeSection !== item.id) { e.currentTarget.style.background = 'transparent'; } }}>
                                    <span style={{ color: item.color }}>{item.icon}</span>{item.label}{activeSection === item.id && <ChevronRight size={10} className="ml-auto" />}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>
                {tocOpen && <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setTocOpen(false)} />}

                {/* ── MAIN ── */}
                <main className="flex-1 min-w-0 px-4 py-6 lg:pl-6">
                    {/* HERO */}
                    <section className="relative rounded-3xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #8b5cf6 100%)', boxShadow: '0 8px 32px rgba(139,92,246,0.25)' }}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)' }} />
                            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)' }} />
                        </div>
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
                                <Sparkles size={10} /> Chapter 6 • Python
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: '#ffffff' }}>Library Functions</h2>
                            <p className="text-sm md:text-base max-w-2xl mb-5" style={{ color: 'rgba(255,255,255,0.95)' }}>
                                Explore Python's powerful built-in modules. From Math and Random objects to deep String manipulation and detailed Date-Time tracking!
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { icon: <Calculator size={14} />, label: 'Math Module' }, 
                                    { icon: <Zap size={14} />, label: 'Random Numbers' }, 
                                    { icon: <Code2 size={14} />, label: 'String Mgmt' }, 
                                    { icon: <Repeat size={14} />, label: 'Date/Time' }
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm" style={{ color: '#ffffff', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
                                        {s.icon}<span>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ═══ CONTENT ═══ */}
                    
                    {/* Intro */}
                    <Sec id="intro" title="Introduction :" icon={<BookOpen size={18} className="text-purple-600" />}>
                        <p>Python में कुछ pre-define module पहले से ही होते हैं। जिन्हें library module कहा जाता है। प्रत्येक module में कुछ built-in functions शामिल होते हैं, जिन्हें library function कहा जाता है।</p>
                        <p>प्रत्येक function किसी विशेष कार्य को करने के लिए होता है।</p>
                        <ul className="list-disc pl-5 space-y-1 mb-4 text-slate-600">
                            <li><strong>Ex:</strong> (Math, Random and string) → Module</li>
                            <li><strong>Ex:</strong> abs(), sqrt(), pow(), str(), islower() → Function</li>
                        </ul>
                        <p>किसी भी module के function का उपयोग करने के लिए सर्वप्रथम module को program में import किया जाता है। Module 3 प्रकार से import किया जा सकता है:</p>

                        <h3 className="text-base font-bold mt-5 mb-2 text-slate-800">1. To import entire module:</h3>
                        <p>Import statement के द्वारा module को import किया जा सकता है।</p>
                        <CB code={`import <module name>, <m2>…\n\nimport math, string\nprint(math.sqrt(25))\n\n# Output:\n# 5`} />

                        <div className="h-px bg-slate-100 my-6" />

                        <h3 className="text-base font-bold mt-6 mb-2 text-slate-800">2. Import selected object of module:</h3>
                        <p>From import statement के द्वारा selected function import किया जा सकता है।</p>
                        <CB code={`from <module name> import <function name>\n\nfrom math import pi, sqrt, pow\nprint(pi) # 3.14\nprint(sqrt(25)) # 5\nprint(pow(3,2)) # 9\nprint(math.sqrt(36)) # Error (because complete math is not imported)`} />

                        <div className="h-px bg-slate-100 my-6" />

                        <h3 className="text-base font-bold mt-6 mb-2 text-slate-800">3. Import all object of module:</h3>
                        <p>From import statement के द्वारा module के सभी object import किए जा सकते हैं।</p>
                        <CB code={`from <module name> import *\n\nfrom math import *`} />
                    </Sec>

                    {/* Math Module */}
                    <Sec id="math" title="Math Module :" icon={<Calculator size={18} className="text-purple-600" />}>
                        <p className="mb-4">Math module में विभिन्न प्रकार के Mathematical functions मौजूद हैं।</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <MethodCard name="(1) abs()" desc="निरपेक्ष मान (absolute value) return करता है" color="#6d28d9">
                                <CB code={`print(abs(-32.8))\n# Output: 32.8`} />
                            </MethodCard>
                            
                            <MethodCard name="(2) sqrt()" desc="वर्गमूल निकालने के लिए" color="#7c3aed">
                                <CB code={`import math\nprint(math.sqrt(121))\n# Output: 11.0`} />
                            </MethodCard>

                            <MethodCard name="(3) exp()" desc="e^x की value return करता है" color="#8b5cf6">
                                <p className="text-xs text-slate-500 mb-2">e = 2.718281</p>
                                <CB code={`print(math.exp(3))\n# Output: 20.085536`} />
                            </MethodCard>

                            <MethodCard name="(4) ceil()" desc="highest integer में round off करता है" color="#9333ea">
                                <CB code={`print(math.ceil(3.2)) # 4\nprint(math.ceil(3)) # 3\nprint(math.ceil(-20.4)) # -20`} />
                            </MethodCard>

                            <MethodCard name="(5) floor()" desc="lowest integer में round off करता है" color="#a855f7">
                                <CB code={`print(math.floor(3.2)) # 3\nprint(math.floor(3)) # 3\nprint(math.floor(-20.4)) # -21`} />
                            </MethodCard>

                            <MethodCard name="(6) log()" desc="natural logarithm calculate करता है" color="#c084fc">
                                <CB code={`print(math.log(2.34))\n# Output: 0.850150929`} />
                            </MethodCard>

                            <MethodCard name="(7) log10()" desc="base 10 logarithm देता है" color="#d946ef">
                                <CB code={`print(math.log10(2.34))\n# Output: 0.369215857`} />
                            </MethodCard>

                            <MethodCard name="(8) pow()" desc="x^y की value return करता है" color="#ec4899">
                                <CB code={`print(math.pow(8,2))\n# Output: 64.0`} />
                            </MethodCard>

                            <MethodCard name="(9) sin() / (10) cos() / (11) tan()" desc="Trigo values return करता है (radian में input)" color="#f43f5e">
                                <CB code={`print(math.sin(30 * 3.14 / 180))\nprint(math.cos(60 * 3.14 / 180))`} />
                            </MethodCard>

                            <MethodCard name="(12) degrees() / (13) radians()" desc="radian को degree में, या degree को radian में convert" color="#f97316">
                                <CB code={`print(math.degrees(1.0472))\n# 60.00014`} />
                            </MethodCard>

                            <MethodCard name="(14) trunc()" desc="floating number का decimal part हटा देता है" color="#eab308">
                                <CB code={`print(math.trunc(6.97))\n# Output: 6`} />
                            </MethodCard>
                        </div>

                        <div className="mt-6 p-4 rounded-xl border border-purple-200 bg-purple-50">
                            <div className="flex items-center gap-2 mb-2">
                                <Code2 size={16} className="text-purple-700" />
                                <h3 className="text-sm font-bold text-purple-800">Advanced Mathematical Programs :</h3>
                            </div>
                            <CB code={`import math\nx = float(input("enter value of x"))\ncal = math.exp(x) + math.cos(math.radians(x)) + math.sqrt(x)\nprint("Output is", cal)`} />
                            
                            <hr className="my-4 border-purple-200" />
                            
                            <CB code={`from math import log, sqrt\nx = int(input("enter value of x"))\ny = int(input("enter value of y"))\ncal = log(sqrt(x/y))\nprint(cal)`} />
                        </div>
                    </Sec>

                    {/* Random Module */}
                    <Sec id="random" title="Random Module :" icon={<Zap size={18} className="text-purple-600" />}>
                        <p className="mb-4">Random number generate करने के लिए इस module का उपयोग होता है।</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <MethodCard name="(1) random()" desc="0 से 1 के बीच number देता है" color="#2563eb">
                                <CB code={`import random\nprint(random.random())`} />
                            </MethodCard>

                            <MethodCard name="(2) randint()" desc="दो integer के बीच random number देता है" color="#059669">
                                <CB code={`import random\nprint(random.randint(20,25))\n# Example Output: 24`} />
                            </MethodCard>
                        </div>
                    </Sec>

                    {/* String Manipulations */}
                    <Sec id="string" title="String Manipulations :" icon={<FileText size={18} className="text-purple-600" />}>
                        <p className="mb-2">String single, double या triple quotes में लिखा जा सकता है। हर character का index होता है।</p>
                        <pre className="bg-slate-800 text-slate-100 p-4 rounded-xl text-sm mb-4 font-mono overflow-x-auto">
{`Forward index  →  0  1  2  3  4  5
                 P  Y  T  H  O  N
Backward index → -6 -5 -4 -3 -2 -1`}
                        </pre>
                        
                        <p className="mb-2">Accessing example:</p>
                        <CB code={`# To get 'Y'\nnm = "PYTHON"\nprint(nm[1])`} />

                        <div className="mt-6 p-4 rounded-xl border border-purple-200 bg-purple-50">
                            <div className="flex items-center gap-2 mb-2">
                                <Code2 size={16} className="text-purple-700" />
                                <h3 className="text-sm font-bold text-purple-800">Program - Iterate forward & backward index :</h3>
                            </div>
                            <CB code={`S = "PYTHON"\nfor a in range(0,6):\n    print(S[a], "   ", S[-1-a])`} />
                        </div>

                        <h3 className="text-base font-bold mt-6 mb-3 text-slate-800">Common String Functions :</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3 border border-slate-200 rounded-lg bg-white shadow-sm">
                                <div className="font-bold text-purple-700 text-sm mb-1">(1) len()</div>
                                <div className="text-xs text-slate-600 mb-2">string की length बताता है</div>
                                <code className="text-xs bg-slate-100 px-2 py-1 rounded block">print(len("Python")) # 6</code>
                            </div>
                            <div className="p-3 border border-slate-200 rounded-lg bg-white shadow-sm">
                                <div className="font-bold text-purple-700 text-sm mb-1">(2) ord()</div>
                                <div className="text-xs text-slate-600 mb-2">ASCII value देता है</div>
                                <code className="text-xs bg-slate-100 px-2 py-1 rounded block">print(ord('A')) # 65</code>
                            </div>
                            <div className="p-3 border border-slate-200 rounded-lg bg-white shadow-sm">
                                <div className="font-bold text-purple-700 text-sm mb-1">(3) chr()</div>
                                <div className="text-xs text-slate-600 mb-2">ASCII से character देता है</div>
                                <code className="text-xs bg-slate-100 px-2 py-1 rounded block">print(chr(65)) # A</code>
                            </div>
                            <div className="p-3 border border-slate-200 rounded-lg bg-white shadow-sm">
                                <div className="font-bold text-purple-700 text-sm mb-1">(4) str()</div>
                                <div className="text-xs text-slate-600 mb-2">number को string में convert करता है</div>
                                <code className="text-xs bg-slate-100 px-2 py-1 rounded block">print(str(123)) # '123'</code>
                            </div>
                        </div>
                    </Sec>

                    {/* String Methods */}
                    <Sec id="string-methods" title="String Methods :" icon={<BoxSelect size={18} className="text-purple-600" />}>
                        <div className="space-y-4">
                            {[
                                { name: "capitalize()", desc: "पहला letter capital करता है", eg: "print('asdf'.capitalize()) # Asdf" },
                                { name: "find()", desc: "substring की first occurrence देता है", eg: "print('python'.find('p')) # 0" },
                                { name: "isalnum()", desc: "alphanumeric check करता है", eg: "print('@#@'.isalnum()) # False" },
                                { name: "isalpha()", desc: "alphabet check करता है", eg: "print('python'.isalpha()) # True" },
                                { name: "isdigit()", desc: "digit check करता है", eg: "print('python'.isdigit()) # False" },
                                { name: "islower()", desc: "small letters check करता है", eg: "print('upper'.islower()) # True" },
                                { name: "isupper()", desc: "capital letters check करता है", eg: "print('UPPER'.isupper()) # True" },
                                { name: "isspace()", desc: "space check करता है", eg: "print(' '.isspace()) # True" },
                                { name: "lower()", desc: "capital → small", eg: "print('UPPER'.lower()) # upper" },
                                { name: "upper()", desc: "small → capital", eg: "print('upper'.upper()) # UPPER" },
                                { name: "lstrip()", desc: "left side spaces हटाता है", eg: "print('  India'.lstrip()) # India" },
                                { name: "rstrip()", desc: "right side spaces हटाता है", eg: "print('India  '.rstrip()) # India" },
                                { name: "strip()", desc: "दोनों side spaces/characters हटाता है", eg: "print('***Python***'.strip('*')) # Python" },
                                { name: "split()", desc: "string को parts में divide करता है", eg: "print('Honesty is the best'.split(' '))\n# ['Honesty', 'is', 'the', 'best']" },
                                { name: "join()", desc: "elements को जोड़ता है", eg: "print(' '.join('python'))\n# p y t h o n" },
                                { name: "encode()", desc: "string को code में convert करता है", eg: "s = 'hello'.encode('utf-8')" },
                                { name: "decode()", desc: "encoded string को वापस convert करता है", eg: "print(s.decode('utf-8'))" },
                                { name: "endswith()", desc: "suffix check करता है", eg: "print('Rakesh kumar'.endswith('kumar')) # True" },
                                { name: "startswith()", desc: "prefix check करता है", eg: "print('Rakesh kumar'.startswith('R')) # True" },
                                { name: "partition()", desc: "string को 3 parts में divide करता है", eg: "print('Python is a OOPS based language'.partition('OOPS'))" }
                            ].map((method, idx) => (
                                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-purple-300">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                        <code className="text-sm font-extrabold text-purple-700 bg-purple-50 px-2 py-1 rounded w-max">({idx+1}) {method.name}</code>
                                        <span className="text-sm text-slate-600 font-medium md:ml-2">{method.desc}</span>
                                    </div>
                                    <CB code={method.eg} />
                                </div>
                            ))}
                        </div>
                    </Sec>

                    {/* Date & Time */}
                    <Sec id="datetime" title="Date & Time Function :" icon={<Repeat size={18} className="text-purple-600" />}>
                        <p className="mb-4">Python में time और date को handle करने के लिए 2 modules होते हैं:</p>
                        <ul className="list-none space-y-1 mb-4 text-slate-700 font-medium">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> time module</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> calendar module</li>
                        </ul>
                        <p className="mb-4">यह modules समय को 8 values के tuple में store करते हैं।</p>

                        <div className="overflow-x-auto mb-6 rounded-xl border border-slate-200 shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-purple-50 text-purple-900 border-b border-purple-100">
                                    <tr>
                                        <th className="py-3 px-4 font-bold">Index</th>
                                        <th className="py-3 px-4 font-bold">Field</th>
                                        <th className="py-3 px-4 font-bold">Values</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-slate-100"><td className="py-2 px-4">0</td><td className="py-2 px-4 font-medium">Year</td><td className="py-2 px-4 text-slate-600">4-digit (जैसे 2008)</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-2 px-4">1</td><td className="py-2 px-4 font-medium">Month</td><td className="py-2 px-4 text-slate-600">1 to 12</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-2 px-4">2</td><td className="py-2 px-4 font-medium">Day</td><td className="py-2 px-4 text-slate-600">1 to 31</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-2 px-4">3</td><td className="py-2 px-4 font-medium">Hour</td><td className="py-2 px-4 text-slate-600">0 to 23</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-2 px-4">4</td><td className="py-2 px-4 font-medium">Minute</td><td className="py-2 px-4 text-slate-600">0 to 59</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-2 px-4">5</td><td className="py-2 px-4 font-medium">Second</td><td className="py-2 px-4 text-slate-600">0 to 60 (61 leap second)</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-2 px-4">6</td><td className="py-2 px-4 font-medium">Day of week</td><td className="py-2 px-4 text-slate-600">0 to 6 (0 = Monday)</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-2 px-4">7</td><td className="py-2 px-4 font-medium">Day of year</td><td className="py-2 px-4 text-slate-600">1 to 366</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 className="text-lg font-extrabold mt-8 mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                            <Zap size={20} className="text-blue-500" /> TIME MODULE
                        </h3>
                        
                        <div className="space-y-4">
                            <MethodCard name="(1) time()" desc="यह function 1 January 1970 (12:00 AM) से अब तक के seconds return करता है।" color="#0ea5e9">
                                <CB code={`import time\nt = time.time()\nprint(t)`} />
                            </MethodCard>
                            
                            <MethodCard name="(2) localtime()" desc="seconds को time tuple में convert करता है।" color="#14b8a6">
                                <CB code={`import time\nt = time.localtime(time.time())\n\nprint("Current time is:", t)\nprint("Current month is:", t[1])`} />
                            </MethodCard>

                            <MethodCard name="(3) ctime()" desc="current date & time readable format में दिखाता है।" color="#8b5cf6">
                                <CB code={`import time\nprint(time.ctime())\n\n# Output:\n# Fri Dec 17 10:30:00 2021`} />
                            </MethodCard>

                            <MethodCard name="(4) mktime()" desc="time tuple को seconds में convert करता है।" color="#ec4899">
                                <CB code={`import time\nprint(time.mktime(time.localtime()))`} />
                            </MethodCard>

                            <MethodCard name="(5) sleep()" desc="program को कुछ seconds के लिए रोक देता है।" color="#f59e0b">
                                <CB code={`import time\ntime.sleep(5)`} />
                            </MethodCard>

                            <MethodCard name="(6) strftime()" desc="यह function time tuple को format करके string में convert करता है।" color="#ef4444">
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Syntax</span><CB code={`time.strftime(<format>, <time tuple>)`} /></div>
                                
                                <div className="mt-4 mb-2 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                            <tr>
                                                <th className="py-2 px-4 font-bold">Code</th>
                                                <th className="py-2 px-4 font-bold">Meaning</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%a</td><td className="py-1.5 px-4 text-slate-600">Weekday short name</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%A</td><td className="py-1.5 px-4 text-slate-600">Full weekday name</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%b</td><td className="py-1.5 px-4 text-slate-600">Short month name</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%B</td><td className="py-1.5 px-4 text-slate-600">Full month name</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%m</td><td className="py-1.5 px-4 text-slate-600">Month (1–12)</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%d</td><td className="py-1.5 px-4 text-slate-600">Day (1–31)</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%D</td><td className="py-1.5 px-4 text-slate-600">Date format (%m/%d/%y)</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%H</td><td className="py-1.5 px-4 text-slate-600">Hour (0–23)</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%I</td><td className="py-1.5 px-4 text-slate-600">Hour (1–12)</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%M</td><td className="py-1.5 px-4 text-slate-600">Minute</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%S</td><td className="py-1.5 px-4 text-slate-600">Second</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%p</td><td className="py-1.5 px-4 text-slate-600">AM/PM</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%y</td><td className="py-1.5 px-4 text-slate-600">Year (2 digit)</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%Y</td><td className="py-1.5 px-4 text-slate-600">Year (4 digit)</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%j</td><td className="py-1.5 px-4 text-slate-600">Day of year (001–366)</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%U</td><td className="py-1.5 px-4 text-slate-600">Weekday no (1–7)</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%n</td><td className="py-1.5 px-4 text-slate-600">New line</td></tr>
                                            <tr><td className="py-1.5 px-4 font-mono font-bold text-rose-500">%t</td><td className="py-1.5 px-4 text-slate-600">Tab</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4"><span className="text-[10px] font-bold uppercase text-slate-400">Example</span>
                                <CB code={`import time\nt = (2009,2,17,11,3,38,1,48,0)\n\nprint(time.strftime("%b %d %Y %I:%M:%S", t))\n\n# Output:\n# Feb 17 2009 11:03:38`} /></div>
                            </MethodCard>

                            <MethodCard name="(7) strptime()" desc="यह function string को time tuple में convert करता है।" color="#8b5cf6">
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Syntax</span><CB code={`time.strptime(<time>, <format>)`} /></div>
                                <div className="mt-4"><span className="text-[10px] font-bold uppercase text-slate-400">Example</span><CB code={`import time\nprint(time.strptime("30 Aug 1961", "%d %b %Y"))`} /></div>
                            </MethodCard>
                        </div>

                        <h3 className="text-lg font-extrabold mt-10 mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                            <BoxSelect size={20} className="text-teal-500" /> CALENDAR MODULE
                        </h3>

                        <div className="space-y-4">
                            <MethodCard name="(1) calendar()" desc="यह पूरे year का calendar return करता है (multi-line string में)" color="#10b981">
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Syntax</span><CB code={`calendar.calendar(<year>, <w>, <l>, <c>)`} /></div>
                                <ul className="list-disc pl-5 my-2 text-sm text-slate-600">
                                    <li><strong>w</strong> → width</li>
                                    <li><strong>l</strong> → lines</li>
                                    <li><strong>c</strong> → space between months</li>
                                </ul>
                                <div className="mt-4"><span className="text-[10px] font-bold uppercase text-slate-400">Example</span><CB code={`import calendar\nprint(calendar.calendar(2021, w=3, l=1, c=6))`} /></div>
                            </MethodCard>

                            <MethodCard name="(2) isleap()" desc="check करता है कि year leap year है या नहीं" color="#3b82f6">
                                <CB code={`import calendar\nprint(calendar.isleap(2020))  # True`} />
                            </MethodCard>

                            <MethodCard name="(3) leapdays()" desc="दो years के बीच leap years की संख्या देता है" color="#6366f1">
                                <CB code={`import calendar\nprint(calendar.leapdays(2000, 2020))  # 5`} />
                            </MethodCard>

                            <MethodCard name="(4) month()" desc="किसी specific month का calendar देता है" color="#8b5cf6">
                                <CB code={`import calendar\nprint(calendar.month(2021, 12, w=2, l=1))`} />
                            </MethodCard>

                            <MethodCard name="(5) monthcalendar()" desc="month का calendar nested list में देता है" color="#ec4899">
                                <CB code={`import calendar\nprint(calendar.monthcalendar(2022, 1))`} />
                            </MethodCard>

                            <MethodCard name="(6) monthrange()" desc="month का पहला weekday और total days देता है" color="#f43f5e">
                                <CB code={`import calendar\nprint(calendar.monthrange(2019, 8))\n\n# Output:\n# (3, 31)`} />
                            </MethodCard>

                            <MethodCard name="(7) setfirstweekday()" desc="week का first day set करता है" color="#eab308">
                                <CB code={`import calendar\ncalendar.setfirstweekday(5)\nprint(calendar.prmonth(2019, 6))\n\n# Weekday code:\n# 0 = Monday\n# 6 = Sunday`} />
                            </MethodCard>

                            <MethodCard name="(8) weekday()" desc="given date का weekday code return करता है" color="#84cc16">
                                <CB code={`import calendar\nprint(calendar.weekday(2019, 4, 12))`} />
                            </MethodCard>
                        </div>
                    </Sec>

                    {/* Practice Questions */}
                    <Sec id="practice" title="Practice Questions :" icon={<Brain size={18} className="text-purple-600" />}>
                        <p className="mb-4 text-slate-700">Math Module से सम्बंधित महत्वपूर्ण प्रश्न (इन्हें Python में solve करने का प्रयास करें):</p>
                        <div className="space-y-3 mb-8">
                            {[
                                "√(25 + 36) + log₁₀(100) + e²",
                                "ceil(3.4) + floor(7.8) + √(49)",
                                "√(16 + 9) + sin(30°) + cos(60°)",
                                "e³ + log(10) + √(81)",
                                "floor(9.7) + ceil(2.1) + tan(45°)",
                                "√( (5² + 12²) ) + log₁₀(1000)",
                                "e² + sin(90°) + cos(0°) + √(64)",
                                "ceil(5.2) + floor(3.9) + log(2.5)",
                                "√(100 + 25) + e³ + tan(45°)",
                                "log₁₀(100) + √(49) + ceil(6.1) + floor(8.9)"
                            ].map((q, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-purple-300">
                                    <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-purple-50 text-purple-700 font-extrabold text-sm">
                                        Q{idx + 1}
                                    </div>
                                    <div className="text-slate-800 font-bold font-mono text-[14px]">
                                        {q}
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const event = new CustomEvent('toggle-knobly-ai');
                                            window.dispatchEvent(event);
                                        }}
                                        className="ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-purple-100 hover:text-purple-600 transition-colors"
                                        title="Ask AI to Explain"
                                    >
                                        <Sparkles size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <p className="mb-4 text-slate-700 font-bold border-t border-slate-200 pt-6">Programming Practice Questions :</p>
                        <div className="space-y-3">
                            {[
                                "Write a program to take a number and display its square, cube, and square root.",
                                "Write a program to input a name and display it in uppercase and lowercase.",
                                "Write a program to generate a random number between 1 to 10 and print it.",
                                "Write a program to display the current date and time.",
                                "Write a program to count the length of a string.",
                                "Write a program to take a number and print whether it is positive, negative, or zero.",
                                "Write a program to reverse a given string.",
                                "Write a program to generate a random OTP (4 digits).",
                                "Write a program to print today’s date in DD-MM-YYYY format.",
                                "Write a program to count the number of vowels in a string.",
                                "Write a program to find the maximum of two numbers.",
                                "Write a program to check whether a string is a palindrome.",
                                "Write a program to simulate a dice roll (1–6).",
                                "Write a program to display only the current year.",
                                "Write a program to count the number of words in a sentence.",
                                "Write a program to find the area of a circle.",
                                "Write a program to replace spaces in a string with '-'.",
                                "Write a program to pick a random item from a list.",
                                "Write a program to check whether the current year is leap year.",
                                "Write a program to count digits in a number.",
                                "Write a program to find the factorial of a number.",
                                "Write a program to convert a string into title case.",
                                "Write a program to simulate a coin toss.",
                                "Write a program to display current time in 12-hour format.",
                                "Write a program to count uppercase letters in a string."
                            ].map((q, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-purple-300">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700 font-extrabold text-[15px] border border-purple-100/50 shadow-sm">
                                        Q{idx + 1}
                                    </div>
                                    <div className="text-slate-800 font-medium text-[15px] leading-relaxed pt-2">
                                        {q}
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const event = new CustomEvent('toggle-knobly-ai');
                                            window.dispatchEvent(event);
                                        }}
                                        className="ml-auto w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-purple-100 hover:text-purple-600 transition-colors"
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
