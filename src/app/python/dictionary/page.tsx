'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, BookOpen, Copy, Check, LayoutDashboard, StickyNote, Code2, Brain, Keyboard as KBIcon, Sparkles, Database, PlusCircle, Eye, Settings2, BoxSelect, Trash2, Key, ListTree, Repeat, ChevronRight, Zap } from 'lucide-react';

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
                <button onClick={copy} className="text-xs flex items-center gap-1 transition-colors" style={{ color: c ? '#14b8a6' : '#64748b' }}>
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
        tip: { bg: '#f0fdf4', border: '#86efac', text: '#166534', emoji: '💡' }, 
        note: { bg: '#f0fdfa', border: '#5eead4', text: '#0f766e', emoji: '📝' }, 
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
    { icon: <BookOpen size={13} />, label: 'Introduction', id: 'intro', color: '#0f766e' },
    { icon: <PlusCircle size={13} />, label: 'Creating', id: 'creating', color: '#0d9488' },
    { icon: <Eye size={13} />, label: 'Accessing', id: 'accessing', color: '#14b8a6' },
    { icon: <Repeat size={13} />, label: 'Traversing', id: 'traversing', color: '#2dd4bf' },
    { icon: <Settings2 size={13} />, label: 'Operations', id: 'operations', color: '#0ea5e9' },
    { icon: <ListTree size={13} />, label: 'Nested Dictionary', id: 'nested', color: '#0284c7' },
    { icon: <BoxSelect size={13} />, label: 'Functions', id: 'functions', color: '#4f46e5' },
    { icon: <Code2 size={13} />, label: 'Practice Questions', id: 'practice', color: '#8b5cf6' },
];

const navLinks = [
    { label: 'Home', href: '/', icon: <Home size={14} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={14} /> },
    { label: 'Notes', href: '/notes', icon: <StickyNote size={14} /> },
    { label: 'Python', href: '/python', icon: <Code2 size={14} /> },
    { label: 'MCQ', href: '/mcq', icon: <Brain size={14} /> },
    { label: 'Shortcuts', href: '/shortcuts', icon: <KBIcon size={14} /> },
];

export default function DictionaryPage() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('intro');

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 30%, #e2e8f0 100%)' }}>
            {/* ═══ NAVBAR ═══ */}
            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/python" className="flex items-center justify-center w-9 h-9 rounded-xl hover:scale-105 transition-all" style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)', boxShadow: '0 2px 8px rgba(20,184,166,0.3)' }}>
                            <ArrowLeft size={16} className="text-white" />
                        </Link>
                        <div>
                            <h1 className="text-sm font-extrabold" style={{ color: '#0f172a' }}>Python Dictionary</h1>
                            <div className="flex items-center gap-1.5">
                                <Sparkles size={8} style={{ color: '#0d9488' }} />
                                <span className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: '#0d9488' }}>Chapter 5 • Python</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        {navLinks.map(l => (
                            <Link key={l.href} href={l.href} className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-105" style={{ color: '#64748b' }} onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0d9488'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
                                {l.icon}<span>{l.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #0f766e, #0d9488, #14b8a6, #2dd4bf, #0f766e)' }} />
            </header>

            <div className="max-w-7xl mx-auto flex relative">
                {/* ── SIDEBAR ── */}
                <aside className={`${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[52px] left-0 z-40 lg:z-10 w-64 lg:w-56 xl:w-64 h-[calc(100vh-52px)] overflow-y-auto transition-transform duration-300 lg:flex-shrink-0`} style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRight: '1px solid #e2e8f0' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)' }}>
                                <Database size={12} className="text-white" />
                            </div>
                            <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: '#0f172a' }}>Contents</span>
                        </div>
                        <nav className="space-y-0.5">
                            {tocItems.map(item => (
                                <a key={item.id} href={`#${item.id}`} onClick={() => { setActiveSection(item.id); setTocOpen(false); }} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all" style={{ background: activeSection === item.id ? `${item.color}12` : 'transparent', border: activeSection === item.id ? `1px solid ${item.color}30` : '1px solid transparent', color: activeSection === item.id ? item.color : '#64748b' }} onMouseEnter={e => { if (activeSection !== item.id) { e.currentTarget.style.background = '#f8fafc'; } }} onMouseLeave={e => { if (activeSection !== item.id) { e.currentTarget.style.background = 'transparent'; } }}>
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
                    <section className="relative rounded-3xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)', boxShadow: '0 8px 32px rgba(20,184,166,0.25)' }}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)' }} />
                            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)' }} />
                        </div>
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
                                <Sparkles size={10} /> Chapter 5 • Python
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black mb-3 text-white">Sequence Data Type : Dictionary</h2>
                            <p className="text-sm md:text-base max-w-2xl mb-5" style={{ color: 'rgba(255,255,255,0.95)' }}>
                                The ultimate key-value store mapping in Python. Powerful, lightning-fast, and mutable mapping database structures optimized for rapid retrieval!
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { icon: <Key size={14} />, label: 'Key-Value Pairs' }, 
                                    { icon: <Zap size={14} />, label: 'Fast Lookup' }, 
                                    { icon: <Database size={14} />, label: 'Mutable Data' }, 
                                    { icon: <ListTree size={14} />, label: 'Nestable' }
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
                                        {s.icon}<span>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ═══ CONTENT ═══ */}
                    
                    {/* Intro */}
                    <Sec id="intro" title="Introduction :" icon={<BookOpen size={18} className="text-teal-600" />}>
                        <ul className="list-disc pl-5 space-y-1 mb-4 text-slate-600">
                            <li>बड़ी मात्रा में डेटा स्टोर करने के लिए इसका उपयोग होता है।</li>
                            <li>यह data <strong>&lsquo;key : value&rsquo;</strong> pair के रूप में होता है जहाँ पर key (immutable) होती है तथा value (mutable) होती है।</li>
                            <li>Key तथा Value को <code className="bg-slate-100 px-1 mx-1 rounded text-slate-700">(:)</code> से Separate (अलग) किया जाता है।</li>
                            <li>dictionary के data को <code className="bg-slate-100 px-1 mx-1 rounded text-slate-700">,</code> से अलग किया जाता है तथा comma यह curly bracket के अंदर लिखी जाती है।</li>
                        </ul>
                        
                        <IB type="note"><strong>NOTE →</strong> Key : Value की एक unique id होती है।</IB>

                        <CB code={`{} → Empty dictionary\n{1:'aaa', 2:'bbb', 3:'ccc'} → Dictionary of names`} />
                    </Sec>

                    {/* Creating a Dictionary */}
                    <Sec id="creating" title="Creating a Dictionary" icon={<PlusCircle size={18} className="text-teal-500" />}>
                        <p className="mb-2">डिक्शनरी बनाने के दो तरीके हैं –</p>
                        <ol className="list-decimal pl-5 space-y-1 mb-4 text-slate-600 font-medium">
                            <li>By assigning values</li>
                            <li>Dynamically via keyboard</li>
                        </ol>

                        <h3 className="text-base font-bold mt-5 mb-2 text-slate-800">1. By assigning Value :</h3>
                        <p>Dictionary बनाने के लिए key:value pair को <code className="bg-slate-100 px-1 mx-1 rounded text-slate-700">{`{ }`}</code> में लिखा जाता है और उसे एक नाम में assign कर दिया जाता है।</p>
                        
                        <p className="mt-4 text-[10px] font-bold uppercase text-slate-400">Syntax :</p>
                        <CB code={`<dictionary name> = { <key>:<value>, <key>:<value> }`} />
                        
                        <p className="mt-2 text-[10px] font-bold uppercase text-slate-400">Example :</p>
                        <CB code={`players = {1:'Sachin', 2:'Dhoni', 3:'Rohit'}`} />

                        <div className="h-px bg-slate-100 my-6" />

                        <h3 className="text-base font-bold mt-6 mb-2 text-slate-800">2. Dynamically via Keyboard :</h3>
                        <p>Input Function का प्रयोग करके dynamic dictionary बनाई जाती है।</p>
                        
                        <p className="mt-4 text-[10px] font-bold uppercase text-slate-400">Syntax :</p>
                        <CB code={`<key variable> = input("any message")\n<value variable> = input("any message")`} />
                        
                        <p className="mt-2 text-[10px] font-bold uppercase text-slate-400">Example :</p>
                        <CB code={`k = input("Enter dict key")\nv = input("Enter value")\ndict[k] = v`} />

                        <div className="mt-6 p-4 rounded-xl border border-teal-200 bg-teal-50">
                            <div className="flex items-center gap-2 mb-2">
                                <Code2 size={16} className="text-teal-700" />
                                <h3 className="text-sm font-bold text-teal-800">Program :</h3>
                            </div>
                            <p className="text-sm text-teal-700 mb-3 font-medium">एक प्रोग्राम लिखें जिसमें 3 शहरों का तापमान इनपुट करके उनका उपयोग कर एक डिक्शनरी बनाएं। शहर का नाम key और तापमान को value के रूप में लें।</p>
                            <CB code={`dict = {}\nfor a in range(3):\n    k = input("Enter city name")\n    v = input("Enter temp of city")\n    dict[k] = v\nprint(dict)`} />
                        </div>
                    </Sec>

                    {/* Accessing the Dictionary */}
                    <Sec id="accessing" title="Accessing the Dictionary" icon={<Eye size={18} className="text-teal-600" />}>
                        <p>दो प्रकार से dictionary access की जाती है –</p>

                        <h3 className="text-base font-bold mt-5 mb-2 text-slate-800">1. Accessing whole dictionary :</h3>
                        <p>पूरी डिक्शनरी को एक साथ access करने के लिए इसके नाम का प्रयोग किया जाता है।</p>
                        
                        <p className="mt-4 text-[10px] font-bold uppercase text-slate-400">Example :</p>
                        <CB code={`marks = {1:38, 2:41, 3:29}\nprint(marks)`} />
                        
                        <IB type="tip"><strong>NOTE :</strong> * के साथ डिक्शनरी प्रिंट करते समय बिना punctuation marks के डिक्शनरी की key प्रिंट होती है।</IB>

                        <div className="h-px bg-slate-100 my-6" />

                        <h3 className="text-base font-bold mt-6 mb-2 text-slate-800">2. Accessing individual element :</h3>
                        <p>डिक्शनरी में data key:value pair के रूप में स्टोर होता है। key का प्रयोग करके उसकी value को access किया जाता है।</p>
                        
                        <p className="mt-4 text-[10px] font-bold uppercase text-slate-400">Syntax :</p>
                        <CB code={`<dictionary name>[<key>]`} />
                        
                        <p className="mt-2 text-[10px] font-bold uppercase text-slate-400">Example :</p>
                        <CB code={`marks = {1:38, 2:41, 3:29}\nprint(marks[2])`} />

                        <div className="mt-6 p-4 rounded-xl border border-teal-200 bg-teal-50">
                            <div className="flex items-center gap-2 mb-2">
                                <Code2 size={16} className="text-teal-700" />
                                <h3 className="text-sm font-bold text-teal-800">Program :</h3>
                            </div>
                            <p className="text-sm text-teal-700 mb-3 font-medium">पाँच छात्रों के अंकों की डिक्शनरी बनाने हेतु एक प्रोग्राम लिखें और डिक्शनरी को प्रिंट करें। किसी एक छात्र के अंक की print करने के लिए यूजर से उसका रोल नंबर इनपुट लेकर अंक प्रिंट करें।</p>
                            <CB code={`marks = {1:39, 2:46, 3:30, 4:37, 5:42}\nprint(marks)\n\nwhile(True):\n    print("Roll numbers is :", marks)\n    k = input("Enter roll no.")\n    print("Marks of roll no.", k, "is", marks[k])`} />
                        </div>
                    </Sec>

                    {/* Traversing the Dictionary */}
                    <Sec id="traversing" title="Traversing the Dictionary" icon={<Repeat size={18} className="text-teal-500" />}>
                        <p>डिक्शनरी के element access करने के लिए <code>for loop</code> में dictionary के नाम का प्रयोग किया जाता है। यह process traversing है।</p>
                        
                        <p className="mt-4 text-[10px] font-bold uppercase text-slate-400">Syntax :</p>
                        <CB code={`for <control variable> in <dictionary name>:\n    body of loop`} />
                        
                        <p className="mt-2 text-[10px] font-bold uppercase text-slate-400">Example :</p>
                        <CB code={`marks = {1:39, 2:46, 3:30, 4:37, 5:42}\nfor a in marks:\n    print(marks[a])`} />
                    </Sec>

                    {/* Dictionary Operations */}
                    <Sec id="operations" title="Dictionary Operations :" icon={<Settings2 size={18} className="text-teal-600" />}>
                        
                        <h3 className="text-base font-bold mt-2 mb-2 text-slate-800">1. Adding element to dictionary :</h3>
                        <p>Assignment method का प्रयोग करके डिक्शनरी में element जोड़े जाते हैं।</p>
                        <p className="mt-4 text-[10px] font-bold uppercase text-slate-400">Syntax :</p>
                        <CB code={`<dictionary name>[<key>] = <value>`} />
                        <p className="mt-2 text-[10px] font-bold uppercase text-slate-400">Example :</p>
                        <CB code={`Cricket = {1:'Virat', 2:'Dhoni'}\nCricket[3] = 'Sachin'\nprint(Cricket)`} />

                        <div className="h-px bg-slate-100 my-6" />

                        <h3 className="text-base font-bold mt-6 mb-2 text-slate-800">2. Creating dictionary using key & value separately :</h3>
                        <p><code>zip</code> function तथा <code>dict</code> function का प्रयोग करके key तथा value को separately input के द्वारा dictionary बनाई जाती है।</p>
                        <p className="mt-4 text-[10px] font-bold uppercase text-slate-400">Syntax :</p>
                        <CB code={`<dictionary name> = dict(zip([<list of keys>], [<list of values>]))`} />
                        <p className="mt-2 text-[10px] font-bold uppercase text-slate-400">Example :</p>
                        <CB code={`Cricket = dict(zip((1,2,3), ('Sachin','Dhoni','Virat')))\nprint(Cricket)`} />

                        <div className="h-px bg-slate-100 my-6" />

                        <h3 className="text-base font-bold mt-6 mb-2 text-slate-800">3. Creating dictionary using key:value pairs as list :</h3>
                        <p>इस method में key और value की list को <code>dict</code> function में argument pass किया जाता है।</p>
                        <p className="mt-4 text-[10px] font-bold uppercase text-slate-400">Syntax :</p>
                        <CB code={`<dictionary name> = dict([[<key,value pair>], [<key,value pair>]])`} />
                        <p className="mt-2 text-[10px] font-bold uppercase text-slate-400">Example :</p>
                        <CB code={`Cricket = dict([[1,"Sachin"], [2,"Rohit"], [3,"Dhoni"]])\nprint(Cricket)`} />

                        <div className="mt-6 p-4 rounded-xl border border-teal-200 bg-teal-50">
                            <div className="flex items-center gap-2 mb-2">
                                <Code2 size={16} className="text-teal-700" />
                                <h3 className="text-sm font-bold text-teal-800">Program :</h3>
                            </div>
                            <p className="text-sm text-teal-700 mb-3 font-medium">क्रिकेटर के नाम से एक डिक्शनरी बनाने के लिए एक प्रोग्राम लिखें जिसमें क्रिकेटर के नाम के रूप में value और उनके index के रूप में key का उपयोग करें। एलिमेंट्स की संख्या यूजर पर निर्भर होनी चाहिए।</p>
                            <CB code={`c = 1\nCricket = {}\nch = 1\n\nwhile(ch == 1):\n    v = input("Enter player name")\n    Cricket[c] = v\n    c = c + 1\n    ch = input("Do you want to add any more data yes=1 and no=0")\n\nprint(Cricket)`} />
                        </div>

                        <div className="h-px bg-slate-100 my-6" />

                        <h3 className="text-base font-bold mt-6 mb-2 text-slate-800">4. Updating dictionary element :</h3>
                        <p>डिक्शनरी में पहले से उपस्थित key का प्रयोग करके element update किया जा सकता है। यह नए element जोड़ने के समान है।</p>
                        <p className="mt-4 text-[10px] font-bold uppercase text-slate-400">Example :</p>
                        <CB code={`dict = {1:'a', 2:'b', 3:'c'}\n\n# update\ndict[1] = 'd'\n\n# new element\ndict[4] = 'e'`} />

                        <div className="h-px bg-slate-100 my-6" />

                        <h3 className="text-base font-bold mt-6 mb-2 text-slate-800">5. Deleting dictionary element :</h3>
                        <p className="mb-2">डिक्शनरी से element हटाने के दो तरीके हैं –</p>
                        <ol className="list-decimal pl-5 space-y-1 mb-4 text-slate-600 font-medium">
                            <li>del statement</li>
                            <li>pop function</li>
                        </ol>
                        
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl shadow-sm border border-slate-100 bg-slate-50">
                                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Syntax 1 :</p>
                                <CB code={`del <dictionary name>[<key>]`} />
                                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-3 mb-2">Example :</p>
                                <CB code={`del cricket[2]`} />
                                <IB type="warning"><strong>NOTE :</strong> यदि key dictionary में नहीं है तब error message print होगा।</IB>
                            </div>
                            <div className="p-4 rounded-xl shadow-sm border border-slate-100 bg-slate-50">
                                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Syntax 2 :</p>
                                <CB code={`<dictionary name>.pop(<key>)`} />
                                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-3 mb-2">Example :</p>
                                <CB code={`Cricket.pop(2)`} />
                                <IB type="note"><strong>NOTE :</strong> यह function element delete करने के बाद उसकी value को return भी करता है।</IB>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 my-6" />

                        <h3 className="text-base font-bold mt-6 mb-2 text-slate-800">6. Checking existing key :</h3>
                        <p>Membership Operator <code>in</code> तथा <code>not in</code> का प्रयोग करके dictionary में key की उपस्थिति check की जा सकती है।</p>
                        <p className="mt-4 text-[10px] font-bold uppercase text-slate-400">Syntax :</p>
                        <CB code={`<key> in <dictionary name>\n<key> not in <dictionary name>`} />
                        <p className="mt-2 text-[10px] font-bold uppercase text-slate-400">Example :</p>
                        <CB code={`players = {1:"Tendulkar", 2:"Sachin", 3:"Kapil"}\n\nk = 3\nif k in players:\n    print("player is", players[k])\nelse:\n    print("player is not exist")`} />
                    </Sec>

                    {/* Nested Dictionary */}
                    <Sec id="nested" title="Nested Dictionary :" icon={<ListTree size={18} className="text-teal-600" />}>
                        <p>एक dictionary के अंदर अन्य dictionary होती है उसे nested dictionary कहते हैं। Internal dictionary outer dictionary की value होती है।</p>
                        
                        <p className="mt-4 text-[10px] font-bold uppercase text-slate-400">Syntax :</p>
                        <CB code={`<dictionary name> = {<key>:{<key>:<value>}, <key>:{<key>:<value>}}`} />
                        
                        <p className="mt-2 text-[10px] font-bold uppercase text-slate-400">Example :</p>
                        <CB code={`student = {\n1:{'name':'Sohan','mark':32},\n2:{'name':'Dinesh','mark':40},\n3:{'name':'Mohan','mark':42}\n}\n\nprint(student[1]['name'])\n\n# Output :\n# Sohan`} />
                    </Sec>

                    {/* Functions of Dictionary */}
                    <Sec id="functions" title="Functions of Dictionary :" icon={<BoxSelect size={18} className="text-teal-600" />}>
                        
                        <MethodCard name="1. len()" desc="डिक्शनरी की key को count करने के लिए प्रयोग किया जाता है।" color="#0f766e">
                            <div className="flex flex-col gap-2">
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Syntax</span><CB code={`len(<dictionary name>)`} /></div>
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Example</span><CB code={`dic = {1:'abc', 2:'def', 3:'ghi'}\nprint(len(dic))\n\n# Output :\n# 3`} /></div>
                            </div>
                        </MethodCard>

                        <MethodCard name="2. clear()" desc="डिक्शनरी के सभी element हटाने के लिए प्रयोग किया जाता है।" color="#dc2626">
                            <div className="flex flex-col gap-2">
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Syntax</span><CB code={`<dictionary name>.clear()`} /></div>
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Example</span><CB code={`dic.clear()`} /></div>
                            </div>
                        </MethodCard>

                        <MethodCard name="3. get()" desc="इस function का प्रयोग key द्वारा value प्राप्त करने के लिए किया जाता है।" color="#2563eb">
                            <p className="text-xs text-slate-600 font-medium mb-3">यह function दो argument लेता है: 1. key, 2. message</p>
                            <div className="flex flex-col gap-2">
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Syntax</span><CB code={`<dictionary name>.get(<key>, <message>)`} /></div>
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Example</span><CB code={`v = dic.get(4, "key does not exist")\nprint(v)`} /></div>
                            </div>
                        </MethodCard>

                        <MethodCard name="4. has_key()" desc="यह function dictionary में key की presence check करता है तथा Boolean value return करता है।" color="#d97706">
                            <div className="flex flex-col gap-2">
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Syntax</span><CB code={`<dictionary name>.has_key(<key>)`} /></div>
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Example</span><CB code={`v = dic.has_key(3)\nprint(v)\n\n# Output :\n# True`} /></div>
                            </div>
                        </MethodCard>

                        <MethodCard name="5. items()" desc="यह function dictionary की सभी key:value pair को tuple में return करता है।" color="#7c3aed">
                            <div className="flex flex-col gap-2">
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Syntax</span><CB code={`<dictionary name>.items()`} /></div>
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Example</span><CB code={`dic.items()\n\n# Output :\n# dict_items([(1,'abc'), (2,'def'), (3,'ghi')])`} /></div>
                            </div>
                        </MethodCard>

                        <MethodCard name="6. keys()" desc="यह function dictionary की सभी key को return करता है।" color="#0891b2">
                            <IB type="note"><strong>NOTE :</strong> Key list के रूप में return होती हैं।</IB>
                            <div className="flex flex-col gap-2">
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Syntax</span><CB code={`<dictionary name>.keys()`} /></div>
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Example</span><CB code={`dic.keys()\n\n# Output :\n# dict_keys([1,2,3])`} /></div>
                            </div>
                        </MethodCard>

                        <MethodCard name="7. values()" desc="यह function dictionary की सभी value को return करता है।" color="#16a34a">
                            <IB type="note"><strong>NOTE :</strong> Value list के रूप में return होती है।</IB>
                            <div className="flex flex-col gap-2">
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Syntax</span><CB code={`<dictionary name>.values()`} /></div>
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Example</span><CB code={`dic.values()\n\n# Output :\n# dict_values(['abc','def','ghi'])`} /></div>
                            </div>
                        </MethodCard>

                        <MethodCard name="8. update()" desc="यह function एक dictionary में दूसरी dictionary को जोड़ देता है।" color="#e11d48">
                            <div className="flex flex-col gap-2">
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Syntax</span><CB code={`<original dictionary>.update(<new dictionary>)`} /></div>
                                <div><span className="text-[10px] font-bold uppercase text-slate-400">Example</span><CB code={`Cricket.update(players)`} /></div>
                            </div>
                            <p className="text-xs text-slate-600 font-medium mt-3">players dictionary के elements को Cricket dictionary में जोड़ दिया जाएगा।</p>
                        </MethodCard>
                    </Sec>

                    {/* Practice Questions */}
                    <Sec id="practice" title="Practice Questions :" icon={<Code2 size={18} className="text-violet-600" />}>
                        <div className="space-y-4">
                            {[
                                {
                                    hi: "एक dictionary student बनाइए जिसमें name, age और class store हो, और उसे print कीजिए।",
                                    en: "Create a dictionary student with name, age, and class, and print it."
                                },
                                {
                                    hi: "एक dictionary marks बनाइए और किसी एक subject के marks को access करके print कीजिए।",
                                    en: "Create a dictionary marks and print the marks of a specific subject."
                                },
                                {
                                    hi: "एक existing dictionary में किसी key की value को update कीजिए।",
                                    en: "Update the value of an existing key in a dictionary."
                                },
                                {
                                    hi: "एक dictionary में नया key-value pair जोड़िए।",
                                    en: "Add a new key-value pair to a dictionary."
                                },
                                {
                                    hi: "update() method का उपयोग करके dictionary में multiple values add या update कीजिए।",
                                    en: "Use the update() method to add or update multiple values in a dictionary."
                                },
                                {
                                    hi: "Loop का उपयोग करके dictionary के सभी key-value pairs print कीजिए।",
                                    en: "Use a loop to print all key-value pairs of a dictionary."
                                },
                                {
                                    hi: "यह जांचिए कि कोई key dictionary में मौजूद है या नहीं।",
                                    en: "Check whether a key exists in a dictionary or not."
                                },
                                {
                                    hi: "pop() method का उपयोग करके किसी एक element को delete कीजिए।",
                                    en: "Use the pop() method to delete an element from a dictionary."
                                },
                                {
                                    hi: "एक nested dictionary बनाइए जिसमें 2 students की details store हों।",
                                    en: "Create a nested dictionary to store details of two students."
                                },
                                {
                                    hi: "एक dictionary बनाइए जिसमें numbers हों और सबसे बड़ी (maximum) value निकालिए।",
                                    en: "Create a dictionary with numbers and find the maximum value."
                                }
                            ].map((q, i) => (
                                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex gap-4 transition-all hover:shadow-md">
                                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold">{i + 1}</div>
                                    <div>
                                        <p className="font-medium text-slate-800 mb-1">{q.hi}</p>
                                        <p className="text-sm text-slate-500">{q.en}</p>
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
