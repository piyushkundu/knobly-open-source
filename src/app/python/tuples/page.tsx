'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Home, BookOpen, Copy, Check, LayoutDashboard, StickyNote, Code2, Brain, Keyboard as KBIcon, Sparkles, Zap, Hash, Menu, X, ChevronRight, Lock, Key, PlusCircle, Unlock, Settings2, PlayCircle, Eye, BoxSelect } from 'lucide-react';
// import ListsMCQ from '@/components/content/ListsMCQ'; // We can create TuplesMCQ later or omit for now

function CB({ code, lang = 'python' }: { code: string; lang?: string }) {
    const [c, setC] = useState(false);
    const copy = () => { navigator.clipboard.writeText(code); setC(true); setTimeout(() => setC(false), 2000); };
    return (
        <div className="relative rounded-2xl overflow-hidden my-3" style={{ background: '#1e293b', boxShadow: '0 4px 16px rgba(15,23,42,0.12)', border: '1px solid #334155' }}>
            <div className="flex items-center justify-between px-4 py-1.5" style={{ background: '#0f172a', borderBottom: '1px solid #334155' }}>
                <div className="flex items-center gap-2"><div className="flex gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400/60" /><span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" /><span className="w-2.5 h-2.5 rounded-full bg-green-400/60" /></div><span className="text-[9px] uppercase tracking-[0.18em] font-bold text-slate-400">{lang}</span></div>
                <button onClick={copy} className="text-xs flex items-center gap-1 transition-colors" style={{ color: c ? '#34d399' : '#64748b' }}>{c ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}</button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm text-slate-200"><code>{code}</code></pre>
        </div>
    );
}

function Sec({ id, title, icon, children }: { id: string; title: string; icon: ReactNode; children: ReactNode }) {
    return (
        <section id={id} className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg" style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>{icon}<h2 className="text-base md:text-lg font-extrabold" style={{ color: '#1e293b' }}>{title}</h2></div>
            <div className="text-sm leading-relaxed space-y-3" style={{ color: '#475569' }}>{children}</div>
        </section>
    );
}

function IB({ type = 'tip', children }: { type?: 'tip' | 'note' | 'warning'; children: ReactNode }) {
    const s = { tip: { bg: '#ecfdf5', bc: '#86efac', tc: '#166534', e: '💡' }, note: { bg: '#eff6ff', bc: '#93c5fd', tc: '#1e40af', e: '📝' }, warning: { bg: '#fefce8', bc: '#fde047', tc: '#854d0e', e: '⚠️' } }; const st = s[type];
    return <div className="rounded-xl p-3.5 text-xs font-medium my-3" style={{ background: st.bg, border: `1px solid ${st.bc}`, color: st.tc }}>{st.e} {children}</div>;
}

function Def({ children }: { children: ReactNode }) {
    return <div className="rounded-xl p-4 my-3 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #fdf4ff, #fae8ff)', border: '1px solid #f0abfc', color: '#a21caf' }}>{children}</div>;
}

function MethodCard({ name, desc, children, color }: { name: string; desc: string; children: ReactNode; color: string }) {
    return (
        <div className="rounded-2xl overflow-hidden mb-4" style={{ border: `1px solid ${color}30`, background: `${color}05` }}>
            <div className="px-4 py-3 flex items-center gap-2.5" style={{ borderBottom: `1px solid ${color}20` }}>
                <code className="text-sm font-extrabold font-mono" style={{ color }}>{name}</code>
                <span className="text-xs" style={{ color: '#94a3b8' }}>— {desc}</span>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

const tocItems = [
    { icon: <BookOpen size={13} />, label: 'Introduction', id: 'intro', color: '#d946ef' },
    { icon: <LayoutDashboard size={13} />, label: 'Types', id: 'types', color: '#c026d3' },
    { icon: <PlusCircle size={13} />, label: 'Creating', id: 'creating', color: '#a21caf' },
    { icon: <Eye size={13} />, label: 'Accessing', id: 'accessing', color: '#86198f' },
    { icon: <Settings2 size={13} />, label: 'Operations', id: 'operations', color: '#701a75' },
    { icon: <BoxSelect size={13} />, label: 'Functions', id: 'functions', color: '#4a044e' },
    { icon: <Brain size={13} />, label: 'Practice', id: 'practice', color: '#db2777' },
];

const navLinks = [
    { label: 'Home', href: '/', icon: <Home size={14} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={14} /> },
    { label: 'Notes', href: '/notes', icon: <StickyNote size={14} /> },
    { label: 'Python', href: '/python', icon: <Code2 size={14} /> },
    { label: 'MCQ', href: '/mcq', icon: <Brain size={14} /> },
    { label: 'Shortcuts', href: '/shortcuts', icon: <KBIcon size={14} /> },
];

export default function TuplesPage() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('intro');

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 30%, #e2e8f0 100%)' }}>
            {/* ═══ NAVBAR ═══ */}
            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/python" className="flex items-center justify-center w-9 h-9 rounded-xl hover:scale-105 transition-all" style={{ background: 'linear-gradient(135deg, #d946ef, #c026d3)', boxShadow: '0 2px 8px rgba(217,70,239,0.3)' }}><ArrowLeft size={16} className="text-white" /></Link>
                        <div><h1 className="text-sm font-extrabold" style={{ color: '#1e293b' }}>Python Tuples</h1><div className="flex items-center gap-1.5"><Sparkles size={8} style={{ color: '#d946ef' }} /><span className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: '#d946ef' }}>Chapter 4 • Python</span></div></div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        {navLinks.map(l => (<Link key={l.href} href={l.href} className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-105" style={{ color: '#64748b' }} onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#d946ef'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>{l.icon}<span>{l.label}</span></Link>))}
                        <button onClick={() => setTocOpen(!tocOpen)} className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>{tocOpen ? <X size={18} style={{ color: '#d946ef' }} /> : <Menu size={18} style={{ color: '#d946ef' }} />}</button>
                    </div>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #d946ef, #a855f7, #ec4899, #f97316, #d946ef)' }} />
            </header>

            <div className="max-w-7xl mx-auto flex relative">
                {/* ── SIDEBAR ── */}
                <aside className={`${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[52px] left-0 z-40 lg:z-10 w-64 lg:w-56 xl:w-64 h-[calc(100vh-52px)] overflow-y-auto transition-transform duration-300 lg:flex-shrink-0`} style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRight: '1px solid #e2e8f0' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}><div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d946ef, #c026d3)' }}><Hash size={12} className="text-white" /></div><span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: '#1e293b' }}>Contents</span></div>
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
                    <section className="relative rounded-3xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #d946ef 0%, #c026d3 50%, #86198f 100%)', boxShadow: '0 8px 32px rgba(217,70,239,0.25)' }}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none"><div className="absolute -top-20 -right-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)' }} /><div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)' }} /></div>
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}><Sparkles size={10} /> Chapter 4 • Python</div>
                            <h2 className="text-2xl md:text-4xl font-black mb-3 text-white">Python Tuples</h2>
                            <p className="text-sm md:text-base max-w-2xl mb-5" style={{ color: 'rgba(255,255,255,0.9)' }}>The Immutable Sequence. Ek aisi list jo ek baar ban gayi, toh kabhi change nahi hoti. Data ko secure rakhne ke liye best data structure!</p>
                            <div className="flex flex-wrap gap-2">
                                {[{ icon: <Lock size={14} />, label: 'Immutable' }, { icon: <Zap size={14} />, label: 'Fast Access' }, { icon: <Key size={14} />, label: 'Memory Efficient' }, { icon: <PlayCircle size={14} />, label: 'Easy Traversing' }].map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>{s.icon}<span>{s.label}</span></div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Blueprint Header Image */}
                    <div className="w-full rounded-2xl overflow-hidden mb-6" style={{ border: '2px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image src="/sample-assets/placeholder.svg" alt="Python Tuples Blueprint" width={1000} height={500} className="w-full h-auto object-cover" unoptimized />
                    </div>

                    {/* ═══ CONTENT ═══ */}
                    {/* Intro */}
                    <Sec id="intro" title="What is a Tuple?" icon={<BookOpen size={16} className="text-fuchsia-600" />}>
                        <Def>🔒 <strong>Tuple</strong> ek ordered, <strong>immutable</strong> (jise change nahi kiya ja sakta) collection hai Python mein. Once created, its contents cannot be modified.</Def>
                        
                        <p><strong>Simple samjho:</strong> Tuple bilkul list jaisa hota hai, par ek 'Read-only' lock ke saath. Aap naye items daal sakte hain jab banate hain, lekin banane ke baad kuch delete ya modify nahi kar sakte.</p>
                        
                        <div className="w-full rounded-xl overflow-hidden my-4" style={{ border: '1px solid #e2e8f0', background: '#fff' }}>
                            <Image src="/sample-assets/placeholder.svg" alt="Defining the Immutable Sequence" width={1000} height={400} className="w-full h-auto object-cover" unoptimized />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                            {[{ t: '📦 Ordered', d: 'Items index maintain karte hain (0, 1, 2...)', bg: '#fef2f2', bc: '#fecaca', tc: '#b91c1c' }, { t: '🔒 Immutable', d: 'Banane ke baad items KOI change nahi kar sakta', bg: '#eff6ff', bc: '#bfdbfe', tc: '#1d4ed8' }, { t: '🎨 Mixed Types', d: 'Integers, strings, floats — kuch bhi allow hai', bg: '#fefce8', bc: '#fef08a', tc: '#a16207' }, { t: '⚡ Faster', d: 'Memory mein lists se zyada fast aur light hote hain', bg: '#f0fdf4', bc: '#bbf7d0', tc: '#15803d' }].map((item, i) => (
                                <div key={i} className="p-3.5 rounded-2xl" style={{ background: item.bg, border: `1px solid ${item.bc}` }}><h4 className="font-bold text-sm mb-1" style={{ color: item.tc }}>{item.t}</h4><p className="text-xs" style={{ color: '#64748b' }}>{item.d}</p></div>
                            ))}
                        </div>
                    </Sec>

                    {/* Types */}
                    <Sec id="types" title="The Data Matrix: What Can a Tuple Hold?" icon={<LayoutDashboard size={16} className="text-fuchsia-500" />}>
                        <Def>Tuples ko hamesha <code>()</code> parentheses se darshaya jaata hai aur items <code>,</code> comma se separate hote hain.</Def>
                        
                        <div className="w-full rounded-xl overflow-hidden my-4" style={{ border: '1px solid #e2e8f0', background: '#fff' }}>
                            <Image src="/sample-assets/placeholder.svg" alt="The Data Matrix" width={1000} height={400} className="w-full h-auto object-cover" unoptimized />
                        </div>

                        <CB code={`# 1. Empty Tuple\nempty_tuple = ()\n\n# 2. Tuple of Integers\nint_tuple = (1, 2, 3, 4)\n\n# 3. Tuple of Floating Point Numbers\nfloat_tuple = (1.1, 2.2, 3.3)\n\n# 4. Tuple of Characters\nchar_tuple = ('a', 'b', 'c')\n\n# 5. Tuple of Strings\nstr_tuple = ("Delhi", "Baraut")\n\n# 6. Mixed Value Tuple \nmixed_tuple = (11, "Ram", 14.2, "Ravi", 15)`} />
                    </Sec>

                    {/* Creating */}
                    <Sec id="creating" title="Creating Tuples: Three Architectures" icon={<PlusCircle size={16} className="text-purple-600" />}>
                        <Def>🛠️ Python mein tuple banane ke commonly <strong>3 architectures</strong> hote hain — Direct Assignment, Sequence Conversion, aur Dynamic Input.</Def>

                        <div className="w-full rounded-xl overflow-hidden my-4" style={{ border: '1px solid #e2e8f0', background: '#fff' }}>
                            <Image src="/sample-assets/placeholder.svg" alt="Three Architectures for Tuple Creation" width={1000} height={400} className="w-full h-auto object-cover" unoptimized />
                        </div>

                        <h3 className="text-base font-bold mt-4 mb-2" style={{ color: '#1e293b' }}>1. Method 1: Direct Assignment</h3>
                        <CB code={`# The standard method -- directly locking values in.\nmy_tuple = (1, 2, 3)\nnum = (1, 2, 3, 4, 5, 6)`} />

                        <h3 className="text-base font-bold mt-5 mb-2" style={{ color: '#1e293b' }}>2. Method 2: From Another Sequence (Conversion)</h3>
                        <CB code={`# Transforming an existing list into an immutable tuple\nlist_a = [1, 2, 3, 4, 5]\ntuple_b = tuple(list_a) \n\n# Acts as a casting mold.\nprint(tuple_b)  # (1, 2, 3, 4, 5)`} />

                        <h3 className="text-base font-bold mt-5 mb-2" style={{ color: '#1e293b' }}>3. Method 3: Dynamic Input</h3>
                        <CB code={`# Building on-the-fly via keyboard using eval()\ndynamic_tuple = eval(input("Enter tuple elements: "))\nprint(dynamic_tuple)`} />
                    </Sec>

                    {/* Accessing */}
                    <Sec id="accessing" title="Accessing The Vault: The Index Ruler" icon={<Eye size={16} className="text-indigo-600" />}>
                        <Def>🔍 Tuple ke elements ko individually ya completely dekhne ke liye list ke hi methods applicable hain.</Def>

                        <div className="w-full rounded-xl overflow-hidden my-4" style={{ border: '1px solid #e2e8f0', background: '#fff' }}>
                            <Image src="/sample-assets/placeholder.svg" alt="Accessing the Vault: The Index Ruler" width={1000} height={400} className="w-full h-auto object-cover" unoptimized />
                        </div>

                        <h3 className="text-base font-bold mt-4 mb-2" style={{ color: '#1e293b' }}>Whole Access vs Targeted Access</h3>
                        <CB code={`# Whole Access\nfull_tuple = (3, 2, 1, 4)\nprint(full_tuple)  # Prints: (3, 2, 1, 4)\n\n# Targeted Access (Individual Element Access)\nfirst_element = full_tuple[0]  # First element (3)\nthird_element = full_tuple[2]  # Third element (1)\nlast_element = full_tuple[-1]  # Last element (4)`} />
                    </Sec>
                    
                    {/* Operations */}
                    <Sec id="operations" title="Structural Operations: Combine & Replicate" icon={<Settings2 size={16} className="text-pink-600" />}>
                        <Def>➕ Tuple Immutable zaroor hai, par naye tuples banana symbols operations ke through possible hai!</Def>

                        <div className="w-full rounded-xl overflow-hidden my-4" style={{ border: '1px solid #e2e8f0', background: '#fff' }}>
                            <Image src="/sample-assets/placeholder.svg" alt="Combine and Replicate Tuples" width={1000} height={400} className="w-full h-auto object-cover" unoptimized />
                        </div>

                        <CB code={`# Concatenation (+) - Combine Tuples\nt1 = (1, 2, 3)\nt2 = (4, 5, 6)\ncombined = t1 + t2\nprint(combined)  # (1, 2, 3, 4, 5, 6)\n\n# Replication (*) - Duplicate Tuples\nmy_tuple = (1, 2) * 3  \nprint(my_tuple)  # (1, 2, 1, 2, 1, 2)\n\n# Slicing ([:]) - Structural manipulation\nlong_tuple = (1, 2, 3, 4, 5)\nsubset = long_tuple[1:4]  # index 1 to 3\nprint(subset)    # (2, 3, 4)`} />

                        <IB type="warning">Dhyan dein: Ye operations existing tuple ko modify nahi karte, balki hamesha **entirely new tuples** return karte hain.</IB>
                    </Sec>

                    {/* Functions */}
                    <Sec id="functions" title="The Mechanics: Tuple Functions" icon={<BoxSelect size={16} className="text-violet-600" />}>
                        <Def>🔧 Functions The Tools: Built-in analytical tools jo tuple ko interrogate karte hain information return karne ke liye (count, sizes, values) bina structure ko alter kiye. Tuple ke paas kewal do specific methods hain (`count` aur `index`), uske sath kuch build-in functions bhi useful hain.</Def>

                        <div className="w-full rounded-xl overflow-hidden my-4" style={{ border: '1px solid #e2e8f0', background: '#fff' }}>
                            <Image src="/sample-assets/placeholder.svg" alt="The Mechanics: Operations vs Functions" width={1000} height={400} className="w-full h-auto object-cover" unoptimized />
                        </div>

                        <h3 className="text-base font-bold mt-5 mb-3" style={{ color: '#1e293b' }}>Tuple Specific Methods</h3>

                        <MethodCard name="count(item)" desc="Counts occurrences" color="#8b5cf6">
                            <p className="text-xs mb-2">Sirf yeh batata hai ki di hui value kitni baar aayi hai.</p>
                            <CB code={`nums = (1, 2, 3, 2, 2, 4)\nprint(nums.count(2))  # Print hoga: 3\nprint(nums.count(5))  # Print hoga: 0`} />
                        </MethodCard>

                        <MethodCard name="index(item)" desc="Finds first occurrence" color="#6366f1">
                            <p className="text-xs mb-2">Pehli baar `item` kis location par mila, uska index batata hai.</p>
                            <CB code={`letters = ('A', 'B', 'C', 'A')\nprint(letters.index('A'))  # Print hoga: 0\nprint(letters.index('C'))  # Print hoga: 2`} />
                        </MethodCard>

                        <h3 className="text-base font-bold mt-5 mb-3" style={{ color: '#1e293b' }}>Built-in Python Functions applied to Tuples</h3>

                        <MethodCard name="len(tuple)" desc="Gets totally length" color="#ec4899">
                            <p className="text-xs mb-2">Batata hai tuple mein total kitne items hain.</p>
                            <CB code={`print(len((10, 20, 30)))  # Print: 3`} />
                        </MethodCard>

                        <MethodCard name="max(tuple)" desc="Finds largest item" color="#f59e0b">
                            <p className="text-xs mb-2">Tuple mein sabse bada item ya highest value dhundta hai.</p>
                            <CB code={`print(max((5, 12, 3)))  # Print: 12\nprint(max(('apple', 'zebra')))  # Print: zebra`} />
                        </MethodCard>

                        <MethodCard name="min(tuple)" desc="Finds smallest item" color="#10b981">
                            <p className="text-xs mb-2">Tuple mein sabse chota item ya lowest value dhundta hai.</p>
                            <CB code={`print(min((5, 12, 3)))  # Print: 3\nprint(min(('apple', 'zebra')))  # Print: apple`} />
                        </MethodCard>

                        <MethodCard name="sum(tuple)" desc="Calculates total" color="#ef4444">
                            <p className="text-xs mb-2">Sabhi numbers ka addition karta hai.</p>
                            <CB code={`prices = (10, 20, 30)\nprint(sum(prices))  # Print: 60`} />
                        </MethodCard>

                        <MethodCard name="sorted(tuple)" desc="Sorts but returns LIST" color="#06b6d4">
                            <p className="text-xs mb-2">Dhyan dein! Ye tuple ko list banakar sort karke deta hai (original tuple change nahi hota aur na naya tuple wapas aata hai, ek **List** aati hai).</p>
                            <CB code={`t = (9, 1, 4)\nsort_list = sorted(t)\nprint(sort_list)  # Print: [1, 4, 9] (List)`} />
                        </MethodCard>
                        
                        <MethodCard name="tuple(sequence)" desc="Creates new tuple" color="#d946ef">
                            <p className="text-xs mb-2">Kisi bhi dusri chiz ko tuple banata hai (String, List, Sets).</p>
                            <CB code={`new_tup = tuple("HELLO")\nprint(new_tup)  # ('H', 'E', 'L', 'L', 'O')`} />
                        </MethodCard>
                    </Sec>

                    {/* Practice */}
                    <Sec id="practice" title="Practice Questions — Khud Karo! 💪" icon={<Brain size={16} className="text-pink-500" />}>
                        <Def>🎯 In questions ki practice karein taaki Tuples ka concept perfectly clear ho jaye!</Def>
                        <div className="w-full rounded-2xl overflow-hidden my-4" style={{ border: '1px solid #e2e8f0', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <Image src="/sample-assets/placeholder.svg" alt="Python Tuples Practice Questions" width={1000} height={600} className="w-full h-auto object-contain" unoptimized />
                        </div>
                    </Sec>

                </main>
            </div>
        </div>
    );
}
