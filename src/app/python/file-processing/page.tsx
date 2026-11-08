'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Home, BookOpen, Copy, Check, LayoutDashboard, StickyNote,
    Code2, Brain, Keyboard as KBIcon, Sparkles, ChevronRight, Zap,
    FunctionSquare, GitFork, RotateCcw, Layers, Hash, List, Database,
    FileText, Search
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

const tocItems = [
    { icon: <BookOpen size={13} />, label: 'Introduction', id: 'intro', color: '#6366f1' },
    { icon: <FileText size={13} />, label: 'Text File', id: 'text-file', color: '#8b5cf6' },
    { icon: <Database size={13} />, label: 'Binary File Processing', id: 'binary-file', color: '#db2777' },
    { icon: <Sparkles size={13} />, label: 'Advanced Operations', id: 'advanced', color: '#e11d48' },
    { icon: <Code2 size={13} />, label: 'Complete Programs', id: 'programs', color: '#0ea5e9' },
    { icon: <Zap size={13} />, label: 'with Statement', id: 'with-stmt', color: '#f59e0b' },
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

export default function FileProcessingPage() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('intro');

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fce7f3 0%, #fbcfe8 40%, #fdf2f8 100%)' }}>

            {/* ═══ NAVBAR ═══ */}
            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/python" className="flex items-center justify-center w-9 h-9 rounded-xl hover:scale-105 transition-all" style={{ background: 'linear-gradient(135deg, #e11d48, #db2777)', boxShadow: '0 2px 8px rgba(225,29,72,0.3)' }}>
                            <ArrowLeft size={16} className="text-white" />
                        </Link>
                        <div>
                            <h1 className="text-sm font-extrabold" style={{ color: '#0f172a' }}>File Processing</h1>
                            <div className="flex items-center gap-1.5">
                                <Sparkles size={8} style={{ color: '#db2777' }} />
                                <span className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: '#db2777' }}>Chapter 8 • Python</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        {navLinks.map(l => (
                            <Link key={l.href} href={l.href}
                                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-105"
                                style={{ color: '#64748b' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#fce7f3'; e.currentTarget.style.color = '#db2777'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
                                {l.icon}<span>{l.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #e11d48, #db2777, #c026d3, #a855f7, #6366f1, #e11d48)' }} />
            </header>

            <div className="max-w-7xl mx-auto flex relative">
                {/* ── SIDEBAR ── */}
                <aside className={`${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[52px] left-0 z-40 lg:z-10 w-64 lg:w-56 xl:w-64 h-[calc(100vh-52px)] overflow-y-auto transition-transform duration-300 lg:flex-shrink-0`}
                    style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', borderRight: '1px solid #e2e8f0' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e11d48, #db2777)' }}>
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
                                    onMouseEnter={e => { if (activeSection !== item.id) { e.currentTarget.style.background = '#fce7f3'; } }}
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
                    <section className="relative rounded-3xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #9d174d 0%, #be185d 50%, #db2777 100%)', boxShadow: '0 8px 32px rgba(219,39,119,0.28)' }}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)' }} />
                            <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)' }} />
                        </div>
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
                                <Sparkles size={10} /> Chapter 8 • Python
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: '#ffffff' }}>File Processing</h2>
                            <p className="text-sm md:text-base max-w-2xl mb-5" style={{ color: 'rgba(255,255,255,0.90)' }}>
                                टेक्स्ट और बाइनरी फाइलों को प्रोसेस करना, डेटा पढ़ना-लिखना, फाइल पॉइंटर्स और पिकलिंग — हर कांसेप्ट को आसानी से समझें!
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { icon: <FileText size={14} />, label: 'Text Files' },
                                    { icon: <Database size={14} />, label: 'Binary Files' },
                                    { icon: <Search size={14} />, label: 'Seek & Tell' },
                                    { icon: <RotateCcw size={14} />, label: 'Pickle Module' },
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
                        <p>कम्प्यूटर में प्रयोग के लिए डेटा को मेमोरी में सेव करने के लिए प्रयोग की जाने वाली प्रक्रिया <strong>file processing</strong> कहलाती है।</p>
                        <p>पायथन दो प्रकार की फाइल प्रोसेसिंग support करता है:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>Text file:</strong> इसमें डेटा सामान्य टेक्स्ट के रूप में सुरक्षित होता है।</li>
                            <li><strong>Binary file:</strong> इसमें डेटा मशीन फॉर्मेट में सुरक्षित होता है।</li>
                        </ul>

                        <IB type="note">File processing के 3 मुख्य स्टेप्स हैं:<br/>1. <strong>Open</strong> — फाइल को खोलना<br/>2. <strong>Read / Write</strong> — डेटा पढ़ना या लिखना<br/>3. <strong>Close</strong> — फाइल को बंद करना</IB>

                        <div className="mt-4 p-4 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <h4 className="text-sm font-bold text-slate-800 mb-3">📊 Text File vs Binary File — तुलना</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm text-slate-700 border-collapse border border-slate-200">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="p-2 border border-slate-200">Feature</th>
                                            <th className="p-2 border border-slate-200">Text File</th>
                                            <th className="p-2 border border-slate-200">Binary File</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="p-2 border border-slate-200 font-medium">Format</td><td className="p-2 border border-slate-200">Human readable</td><td className="p-2 border border-slate-200">Machine readable</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-medium">Extension</td><td className="p-2 border border-slate-200">.txt</td><td className="p-2 border border-slate-200">.dat, .bin</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-medium">EOL Character</td><td className="p-2 border border-slate-200">\n (newline)</td><td className="p-2 border border-slate-200">No delimiter</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-medium">Open Software</td><td className="p-2 border border-slate-200">Notepad, VS Code आदि</td><td className="p-2 border border-slate-200">केवल Python</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-medium">Speed</td><td className="p-2 border border-slate-200">Slow</td><td className="p-2 border border-slate-200">Fast</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-medium">Module</td><td className="p-2 border border-slate-200">Not required</td><td className="p-2 border border-slate-200">pickle module</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══════════════════════════
                        2. TEXT FILE
                    ═══════════════════════════ */}
                    <Sec id="text-file" title="1. Text File →" icon={<FileText size={18} className="text-purple-600" />}>
                        <ul className="list-disc list-inside mb-4 space-y-2">
                            <li>यह फाइल ASCII या Unicode char का प्रयोग करके information को simple text के रूप में स्टोर करती है।</li>
                            <li>Text file में प्रत्येक लाइन के अंत में एक special character का प्रयोग किया जाता है जिसे <strong>EOL &quot;\n&quot;</strong> कहते हैं।</li>
                            <li>यह फाइल किसी भी सॉफ्टवेयर जैसे – Notepad, Wordpad, Libre Office, MS-Word आदि पर open की जा सकती है।</li>
                        </ul>

                        {/* (i) open() */}
                        <MC name="(i) open()" desc="फ़ाइल को ओपन करने के लिए" color="#6366f1">
                            <p className="text-sm text-slate-600 mb-3">Text file के साथ work start करने से पहले उसे एक विशेष mode में open करने की आवश्यकता होती है। <br /> Open function का प्रयोग फाइल को open करने के लिए किया जाता है और यह दो argument इनपुट करता है।</p>
                            <CB code={`<file_handle> = open('<file name>', '<mode>')`} />
                            
                            <ul className="list-disc list-inside mt-3 mb-4 space-y-1 text-sm text-slate-700">
                                <li><strong>File handle:</strong> यह एक identifier है जिसके द्वारा फाइल को uniquely identify रखा जाता है।</li>
                                <li><strong>File name:</strong> यह फाइल का नाम है (e.g. <code>.txt</code>)।</li>
                                <li><strong>Mode:</strong> यह फाइल open करने के उद्देश्य को निर्धारित करता है।</li>
                            </ul>

                            <strong className="text-sm text-slate-800">Mode के प्रकार:</strong>
                            <div className="overflow-x-auto my-3">
                                <table className="min-w-full text-left text-sm text-slate-700 border-collapse border border-slate-200">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="p-2 border border-slate-200">Mode</th>
                                            <th className="p-2 border border-slate-200">Meaning</th>
                                            <th className="p-2 border border-slate-200">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="p-2 border border-slate-200 font-mono font-bold">w</td><td className="p-2 border border-slate-200">write</td><td className="p-2 border border-slate-200">data लिखने के लिए। यदि फाइल है तो ओवरराइट करता है, नहीं है तो नई बनाता है।</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-mono font-bold">r</td><td className="p-2 border border-slate-200">read</td><td className="p-2 border border-slate-200">data प्राप्त करने के लिए। (Default mode)</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-mono font-bold">a</td><td className="p-2 border border-slate-200">append</td><td className="p-2 border border-slate-200">data जोड़ने के लिए।</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-mono font-bold">w+</td><td className="p-2 border border-slate-200">write & read</td><td className="p-2 border border-slate-200">लिखने और पढ़ने दोनों के लिए।</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-mono font-bold">r+</td><td className="p-2 border border-slate-200">read & write</td><td className="p-2 border border-slate-200">पढ़ने और लिखने दोनों के लिए।</td></tr>
                                        <tr><td className="p-2 border border-slate-200 font-mono font-bold">a+</td><td className="p-2 border border-slate-200">append & read</td><td className="p-2 border border-slate-200">जोड़ने और पढ़ने दोनों के लिए।</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <IB type="note">यदि mode नहीं दिया गया है तब default mode <code>&apos;r&apos;</code> होता है।</IB>
                            <CB code={`student = open('marks.txt', 'w')
shop = open('product') # default mode is 'r'`} />
                        </MC>

                        {/* (ii) close() */}
                        <MC name="(ii) close()" desc="फ़ाइल को बंद करने के लिए" color="#8b5cf6">
                            <p className="text-sm text-slate-600 mb-3">काम पूरा होने के बाद फाइल को close करना आवश्यक है। इससे memory free होती है और data save होता है।</p>
                            <CB code={`student.close()
shop.close()`} />
                            <IB type="warning">फाइल close करना भूलने से data loss हो सकता है! हमेशा <code>close()</code> या <code>with</code> statement use करें।</IB>
                        </MC>

                        {/* (iii) write() & (iv) readline() */}
                        <MC name="(iii) write() & (iv) readline()" desc="डेटा लिखने और पढ़ने के लिए" color="#a855f7">
                            <p className="text-sm text-slate-600 mb-2"><strong>write():</strong> यह function स्ट्रिंग को फाइल में लिखता है। EOL &apos;\n&apos; जोड़ना अनिवार्य होता है।</p>
                            <CB code={`nm = 'Rohit jain' + '\\n'
student.write(nm)`} />
                            
                            <p className="text-sm text-slate-600 mt-4 mb-2"><strong>readline():</strong> फाइल से एक-एक लाइन प्राप्त करने के लिए।</p>
                            <CB code={`student.readline()`} />
                        </MC>

                        <ProgCard title="Program 1 — Student Data (Write)">
                            <p className="text-sm text-slate-600 mb-3">15 छात्रों के रिकॉर्ड्स को स्टोर करने के लिए फाइल राइटिंग (File Writing)।</p>
                            <CB code={`student = open('sdata.txt', 'w')
for a in range(15):
    record = ""
    rno = int(input("enter roll no. "))
    record = record + str(rno) + '\\n'  # using str() formatting
    nm = input("enter name ")
    record = record + nm + '\\n'
    m1 = int(input("enter mark 1 "))
    record = record + str(m1) + '\\n'
    m2 = int(input("enter mark 2 "))
    record = record + str(m2) + '\\n'
    m3 = int(input("enter mark 3 "))
    record = record + str(m3) + '\\n'
    student.write(record)
student.close()`} />
                        </ProgCard>

                        <ProgCard title="Program 2 — Student Data (Read)">
                            <p className="text-sm text-slate-600 mb-3">ऊपर store किए गए data को पढ़कर display करना।</p>
                            <CB code={`student = open('sdata.txt', 'r')
for a in range(15):
    rno = student.readline()
    nm = student.readline()
    m1 = student.readline()
    m2 = student.readline()
    m3 = student.readline()
    print("Roll No:", rno, end="")
    print("Name:", nm, end="")
    print("Marks:", m1, m2, m3)
student.close()`} />
                        </ProgCard>

                        {/* More Commands */}
                        <div className="mt-8 mb-4">
                            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">More write & read commands:</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="p-4 rounded-xl" style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                <p className="text-sm font-bold text-slate-800 mb-1">(A) read()</p>
                                <p className="text-xs text-slate-600 mb-2">यह function फाइल से केवल उतनी bytes read करता है जितनी argument में दी गई है। बिना argument के पूरी फाइल read करता है।</p>
                                <CB code={`f = open('marks.txt', 'r')
data = f.read(30)    # पहले 30 bytes read करें
print(data)

all_data = f.read()  # बाकी सब read करें
print(all_data)
f.close()`} />
                            </div>
                            <div className="p-4 rounded-xl" style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                <p className="text-sm font-bold text-slate-800 mb-1">(B) readlines()</p>
                                <p className="text-xs text-slate-600 mb-2">फाइल से total information read करने के लिए इस function का प्रयोग होता है और यह <strong>list</strong> return करता है।</p>
                                <CB code={`f = open('marks.txt', 'r')
lines = f.readlines()
for line in lines:
    print(line, end="")
f.close()`} />
                            </div>
                            <div className="p-4 rounded-xl" style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                <p className="text-sm font-bold text-slate-800 mb-1">(C) writelines()</p>
                                <p className="text-xs text-slate-600 mb-2">स्ट्रिंग्स की एक list को फाइल में लिखने के लिए।</p>
                                <CB code={`fruitfile = open('names.txt', 'w')
flist = []
for i in range(5):
    nm = input("enter a fruit name: ")
    flist.append(nm + '\\n')
fruitfile.writelines(flist)
fruitfile.close()`} />
                            </div>
                        </div>

                        {/* Random Reading */}
                        <div className="mt-8 mb-4">
                            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2"><Search size={16} className="text-indigo-500" /> Random reading in file</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">एक फाइल <strong>bytes की एक stream</strong> होती है। जब फाइल open की जाती है तब file pointer (FP) की position शुरुआत में होती है।</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            <MC name="1. tell()" desc="pointer position" color="#14b8a6">
                                <p className="text-xs text-slate-600 mb-2">FP की current position जानने के लिए।</p>
                                <CB code={`f = open('fruites.txt', 'r')
print("position:", f.tell())
r = f.read(3)
print("position after 3 bytes:", f.tell())`} />
                                <OB output={`position: 0
position after 3 bytes: 3`} />
                            </MC>
                            <MC name="2. seek()" desc="change pointer" color="#0ea5e9">
                                <p className="text-xs text-slate-600 mb-2">FP की position बदलने के लिए। Syntax: <code>seek(offset, whence)</code></p>
                                <CB code={`f.seek(10)
print("position after change:", f.tell())

# whence values:
# 0 = beginning (default)
# 1 = current position
# 2 = end of file`} />
                                <OB output={`position after change: 10`} />
                            </MC>
                        </div>
                    </Sec>

                    {/* ═══════════════════════════
                        3. BINARY FILE PROCESSING
                    ═══════════════════════════ */}
                    <Sec id="binary-file" title="2. Binary File Processing →" icon={<Database size={18} className="text-pink-600" />}>
                        <ul className="list-disc list-inside mb-4 space-y-2 text-slate-700 text-sm">
                            <li>बाइनरी फाइल data को उस format में store करती है जिसमें data memory में store किया जाता है।</li>
                            <li>बाइनरी फाइल में लाइन के अंत में delimiter नहीं होता है।</li>
                            <li>Python के द्वारा बनाई गई binary file केवल python software में open होती है।</li>
                            <li>Binary file को <code>.dat</code> extension के साथ save किया जाता है।</li>
                        </ul>

                        {/* pickle module */}
                        <div className="p-4 rounded-xl mb-4" style={{ background: '#fdf4ff', border: '1px solid #f5d0fe' }}>
                            <h4 className="font-bold text-fuchsia-800 mb-2">(1) pickle module</h4>
                            <p className="text-sm text-fuchsia-900 mb-2">बाइनरी फाइल में data store तथा access करने के लिए यह मॉड्यूल प्रयोग होता है।</p>
                            <ul className="list-disc list-inside text-sm text-fuchsia-900/80 mb-3 space-y-1">
                                <li><strong>Serialize (Pickling):</strong> data को bytes में बदलना — <code>pickle.dump()</code></li>
                                <li><strong>De-Serialize (Unpickling):</strong> bytes को simple format में बदलना — <code>pickle.load()</code></li>
                            </ul>
                            <CB code={`import pickle  # module import करना अनिवार्य है`} />
                        </div>

                        {/* open and close */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <MC name="(2) open() - Binary" desc="फ़ाइल को बाइनरी मोड में ओपन करने के लिए" color="#ec4899">
                                <div className="overflow-x-auto mb-3">
                                    <table className="min-w-full text-left text-xs text-slate-700 border-collapse border border-slate-200">
                                        <thead>
                                            <tr className="bg-slate-100">
                                                <th className="p-1.5 border border-slate-200">Mode</th>
                                                <th className="p-1.5 border border-slate-200">Purpose</th>
                                                <th className="p-1.5 border border-slate-200">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td className="p-1.5 border border-slate-200 font-mono font-bold">wb</td><td className="p-1.5 border border-slate-200">write</td><td className="p-1.5 border border-slate-200">बाइनरी में लिखना</td></tr>
                                            <tr><td className="p-1.5 border border-slate-200 font-mono font-bold">rb</td><td className="p-1.5 border border-slate-200">read</td><td className="p-1.5 border border-slate-200">बाइनरी से पढ़ना</td></tr>
                                            <tr><td className="p-1.5 border border-slate-200 font-mono font-bold">ab</td><td className="p-1.5 border border-slate-200">append</td><td className="p-1.5 border border-slate-200">बाइनरी में जोड़ना</td></tr>
                                            <tr><td className="p-1.5 border border-slate-200 font-mono font-bold">wb+</td><td className="p-1.5 border border-slate-200">write & read</td><td className="p-1.5 border border-slate-200">लिखना और पढ़ना</td></tr>
                                            <tr><td className="p-1.5 border border-slate-200 font-mono font-bold">rb+</td><td className="p-1.5 border border-slate-200">read & write</td><td className="p-1.5 border border-slate-200">पढ़ना और लिखना</td></tr>
                                            <tr><td className="p-1.5 border border-slate-200 font-mono font-bold">ab+</td><td className="p-1.5 border border-slate-200">append & read</td><td className="p-1.5 border border-slate-200">जोड़ना और पढ़ना</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <CB code={`school = open('student.dat', 'wb')
employ = open('income.dat', 'rb')`} />
                            </MC>
                            <MC name="(3) close()" desc="Closing the file" color="#f43f5e">
                                <p className="text-xs text-slate-600 mb-2">बाइनरी फाइल को बंद करने के लिए भी <code>close()</code> method का उपयोग होता है।</p>
                                <CB code={`school.close()`} />
                            </MC>
                        </div>

                        {/* dump and load */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <MC name="(4) dump()" desc="लेखन (Write)" color="#8b5cf6">
                                <p className="text-xs text-slate-600 mb-2"><code>pickle.dump()</code> का प्रयोग बाइनरी फाइल में data लिखने के लिए किया जाता है।</p>
                                <CB code={`import pickle

school = open('student.dat', 'wb')
rno = 101
name = "Rahul"
pickle.dump(rno, school)
pickle.dump(name, school)
school.close()`} />
                            </MC>
                            <MC name="(5) load()" desc="पठन (Read)" color="#a855f7">
                                <p className="text-xs text-slate-600 mb-2"><code>pickle.load()</code> का प्रयोग बाइनरी फाइल से data प्राप्त करने के लिए किया जाता है।</p>
                                <CB code={`import pickle

school = open('student.dat', 'rb')
rno = pickle.load(school)
name = pickle.load(school)
print("Roll No:", rno)
print("Name:", name)
school.close()`} />
                                <OB output={`Roll No: 101
Name: Rahul`} />
                            </MC>
                        </div>

                        {/* Binary File Program */}
                        <ProgCard title="Program — Binary File (Write & Read Students)">
                            <p className="text-sm text-slate-600 mb-3">बाइनरी फाइल में 5 छात्रों का data store करें और फिर उसे read करें।</p>
                            <CB code={`import pickle

# Writing data
school = open('students.dat', 'wb')
for i in range(5):
    rno = int(input("Enter Roll No: "))
    name = input("Enter Name: ")
    marks = int(input("Enter Marks: "))
    record = [rno, name, marks]
    pickle.dump(record, school)
school.close()
print("Data saved successfully!")

# Reading data
school = open('students.dat', 'rb')
print("\\n--- Student Records ---")
try:
    while True:
        record = pickle.load(school)
        print(f"Roll: {record[0]}, Name: {record[1]}, Marks: {record[2]}")
except EOFError:
    school.close()
    print("--- End of Records ---")`} />
                        </ProgCard>
                    </Sec>

                    {/* ═══════════════════════════
                        4. ADVANCED OPERATIONS
                    ═══════════════════════════ */}
                    <Sec id="advanced" title="Advanced Operations →" icon={<Sparkles size={18} className="text-rose-600" />}>

                        {/* Checking EOF */}
                        <div className="mb-6">
                            <h3 className="text-base font-extrabold text-slate-800 mb-2">Checking End of File</h3>
                            <p className="text-sm text-slate-700 mb-3">Python में <code>EOFError</code> exception का प्रयोग करके फाइल के अंत का पता लगाया जाता है।</p>
                            <CB code={`import pickle

f = open('data.dat', 'rb')
try:
    while True:
        record = pickle.load(f)
        print(record)
except EOFError:
    f.close()
    print("File reading complete!")`} />
                        </div>

                        {/* Searching in Binary File */}
                        <div className="mb-6">
                            <h3 className="text-base font-extrabold text-slate-800 mb-2">Searching in Binary File</h3>
                            <p className="text-sm text-slate-700 mb-3">बाइनरी फाइल में किसी specific record को search करना।</p>
                            <CB code={`import pickle

f = open('students.dat', 'rb')
search_rno = int(input("Enter roll no to search: "))
found = False

try:
    while True:
        record = pickle.load(f)
        if record[0] == search_rno:
            print("Record Found!")
            print(f"Name: {record[1]}, Marks: {record[2]}")
            found = True
            break
except EOFError:
    pass
finally:
    f.close()

if not found:
    print("Record not found!")`} />
                        </div>

                        {/* Updation of records */}
                        <div className="mb-6">
                            <h3 className="text-base font-extrabold text-slate-800 mb-2">Updation of Records</h3>
                            <p className="text-sm text-slate-700 mb-3">बाइनरी फाइल में किसी record को update करना।</p>
                            <CB code={`import pickle

f = open('students.dat', 'rb')
records = []
try:
    while True:
        records.append(pickle.load(f))
except EOFError:
    f.close()

update_rno = int(input("Enter roll no to update: "))
for rec in records:
    if rec[0] == update_rno:
        rec[2] = int(input("Enter new marks: "))
        print("Record updated!")

f = open('students.dat', 'wb')
for rec in records:
    pickle.dump(rec, f)
f.close()`} />
                        </div>

                        {/* Deletion of records */}
                        <div>
                            <h3 className="text-base font-extrabold text-slate-800 mb-2">Deletion of Records</h3>
                            <p className="text-sm text-slate-700 mb-3">Python में रिकॉर्ड हटाने के लिए direct command नहीं है। इसके लिए एक logic का प्रयोग होता है:</p>
                            <ul className="list-decimal list-inside text-sm text-slate-700 space-y-1 mb-4">
                                <li>दो फाइल open की जाती हैं (एक read mode में, एक write mode में)।</li>
                                <li>पहली फाइल से data प्राप्त किया जाता है और filter करके दूसरी फाइल में store किया जाता है।</li>
                                <li>पहली फाइल remove कर दी जाती है।</li>
                                <li>दूसरी फाइल का नाम बदलकर पहली फाइल का नाम दे दिया जाता है।</li>
                            </ul>
                            
                            <IB type="tip">इस process के लिए <strong><code>os</code> module</strong> का प्रयोग किया जाता है।</IB>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-4 rounded-xl" style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                    <p className="text-sm font-bold text-rose-700 mb-2">os.remove()</p>
                                    <CB code={`import os
os.remove('salary.dat')`} />
                                </div>
                                <div className="p-4 rounded-xl" style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                    <p className="text-sm font-bold text-amber-700 mb-2">os.rename()</p>
                                    <CB code={`import os
os.rename('temp.dat', 'salary.dat')`} />
                                </div>
                            </div>

                            <ProgCard title="Complete Deletion Program">
                                <CB code={`import pickle, os

f1 = open('students.dat', 'rb')
f2 = open('temp.dat', 'wb')
del_rno = int(input("Enter roll no to delete: "))

try:
    while True:
        record = pickle.load(f1)
        if record[0] != del_rno:
            pickle.dump(record, f2)
        else:
            print("Record deleted!")
except EOFError:
    f1.close()
    f2.close()

os.remove('students.dat')
os.rename('temp.dat', 'students.dat')
print("Done!")`} />
                            </ProgCard>
                        </div>

                    </Sec>

                    {/* ═══════════════════════════
                        5. COMPLETE PROGRAMS
                    ═══════════════════════════ */}
                    <Sec id="programs" title="Complete Programs →" icon={<Code2 size={18} className="text-sky-600" />}>
                        
                        <ProgCard title="Program — Count words in a text file">
                            <p className="text-sm text-slate-600 mb-3">एक text file में कुल words count करने का program।</p>
                            <CB code={`f = open('story.txt', 'r')
data = f.read()
words = data.split()
print("Total words:", len(words))
f.close()`} />
                        </ProgCard>

                        <ProgCard title="Program — Count lines starting with a specific letter">
                            <CB code={`f = open('story.txt', 'r')
count = 0
for line in f:
    if line[0] == 'T' or line[0] == 't':
        count += 1
print("Lines starting with T/t:", count)
f.close()`} />
                        </ProgCard>

                        <ProgCard title="Program — Copy contents from one file to another">
                            <CB code={`f1 = open('source.txt', 'r')
f2 = open('destination.txt', 'w')

for line in f1:
    f2.write(line)

f1.close()
f2.close()
print("File copied successfully!")`} />
                        </ProgCard>

                        <ProgCard title="Program — Employee Salary (Binary File)">
                            <p className="text-sm text-slate-600 mb-3">Employee salary data को binary file में store और display करना।</p>
                            <CB code={`import pickle

# Writing employee data
emp = open('employee.dat', 'wb')
n = int(input("How many employees? "))
for i in range(n):
    eid = int(input("Enter Employee ID: "))
    name = input("Enter Name: ")
    salary = float(input("Enter Salary: "))
    record = {'id': eid, 'name': name, 'salary': salary}
    pickle.dump(record, emp)
emp.close()

# Reading & displaying
emp = open('employee.dat', 'rb')
print("\\n===== Employee Report =====")
total = 0
try:
    while True:
        rec = pickle.load(emp)
        print(f"ID: {rec['id']} | Name: {rec['name']} | Salary: ₹{rec['salary']}")
        total += rec['salary']
except EOFError:
    emp.close()
print(f"\\nTotal Salary: ₹{total}")`} />
                        </ProgCard>
                    </Sec>

                    {/* ═══════════════════════════
                        6. WITH STATEMENT
                    ═══════════════════════════ */}
                    <Sec id="with-stmt" title="with Statement →" icon={<Zap size={18} className="text-amber-600" />}>
                        <p><code>with</code> statement का प्रयोग करने से फाइल <strong>automatically close</strong> हो जाती है। इसमें <code>close()</code> लिखने की आवश्यकता नहीं होती।</p>
                        
                        <IB type="tip"><code>with</code> statement Python का <strong>best practice</strong> है file handling के लिए। यह errors और memory leaks से बचाता है।</IB>

                        <div className="mt-2 mb-2">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Syntax</span>
                        </div>
                        <CB code={`with open('<filename>', '<mode>') as <file_handle>:
    # file operations here
    # file automatically closes after this block`} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            <ProgCard title="Writing with 'with'">
                                <CB code={`with open('notes.txt', 'w') as f:
    f.write("Hello World\\n")
    f.write("Python is great!\\n")
# file auto-closed here`} />
                            </ProgCard>
                            <ProgCard title="Reading with 'with'">
                                <CB code={`with open('notes.txt', 'r') as f:
    for line in f:
        print(line, end="")
# file auto-closed here`} />
                            </ProgCard>
                        </div>

                        <ProgCard title="Binary File with 'with' Statement">
                            <CB code={`import pickle

# Write
with open('data.dat', 'wb') as f:
    pickle.dump([1, 2, 3], f)
    pickle.dump("Hello", f)

# Read
with open('data.dat', 'rb') as f:
    try:
        while True:
            data = pickle.load(f)
            print(data)
    except EOFError:
        print("Done reading!")`} />
                            <OB output={`[1, 2, 3]
Hello
Done reading!`} />
                        </ProgCard>
                    </Sec>

                    {/* ═══════════════════════════
                        7. PRACTICE QUESTIONS
                    ═══════════════════════════ */}
                    <Sec id="practice" title="Practice Questions →" icon={<Brain size={18} className="text-rose-600" />}>
                        <p className="mb-4 text-slate-700">इन programs को खुद लिखने का प्रयास करें — Chapter 8 को और अच्छे से समझने के लिए 💪</p>

                        <div className="space-y-3">
                            {[
                                "Write a program to create a text file and store 5 student names in it.",
                                "Write a program to read a text file line by line and display the content.",
                                "Write a program to count the number of vowels in a text file.",
                                "Write a program to count the number of lines, words, and characters in a text file.",
                                "Write a program to copy all lines starting with 'P' from one file to another.",
                                "Write a program to create a binary file to store employee data (eid, name, salary) using pickle.",
                                "Write a program to read and display all records from a binary file.",
                                "Write a program to search for a specific employee by ID in a binary file.",
                                "Write a program to update the salary of an employee in a binary file.",
                                "Write a program to delete a record from a binary file using os module.",
                                "Write a program using 'with' statement to write and read a text file.",
                                "Write a program to merge two text files into a third file.",
                                "Write a program to count occurrences of word 'the' in a text file.",
                                "Write a program to store a list of dictionaries in a binary file and display them.",
                                "Write a program to find the longest line in a text file.",
                            ].map((q, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-pink-300">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-white font-extrabold text-sm" style={{ background: 'linear-gradient(135deg, #e11d48, #db2777)' }}>
                                        Q{idx + 1}
                                    </div>
                                    <div className="text-slate-800 font-medium text-[15px] leading-relaxed pt-2">{q}</div>
                                    <button
                                        onClick={() => { const ev = new CustomEvent('toggle-knobly-ai'); window.dispatchEvent(ev); }}
                                        className="ml-auto w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-pink-100 hover:text-pink-600 transition-colors"
                                        title="Ask AI to Explain"
                                    >
                                        <Sparkles size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Key Points Summary */}
                        <div className="mt-6 p-4 rounded-xl" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                            <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2"><List size={14} />Chapter 8 — Key Points :</h4>
                            <ul className="space-y-2 text-sm text-emerald-900">
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />Text file human readable format में data store करती है</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />Binary file machine format में data store करती है — <strong>pickle</strong> module required</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /><strong>dump()</strong> — data लिखना, <strong>load()</strong> — data पढ़ना</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /><strong>tell()</strong> — pointer position, <strong>seek()</strong> — pointer change</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /><strong>with</strong> statement — file auto-close, best practice!</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />Delete records: read → filter → write to temp → rename</li>
                            </ul>
                        </div>
                    </Sec>

                </main>
            </div>
        </div>
    );
}
