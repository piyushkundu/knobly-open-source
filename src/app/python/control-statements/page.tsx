'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, BookOpen, Copy, Check, LayoutDashboard, StickyNote, Code2, Brain, Keyboard as KBIcon, Sparkles, Play, Zap, GitBranch, Repeat, ArrowRight, ShieldCheck, Hash, Menu, X, ChevronRight, FileText, ExternalLink } from 'lucide-react';
import ControlMCQ from '@/components/content/ControlMCQ';

function CB({ code, lang = 'python' }: { code: string; lang?: string }) {
    const [c, setC] = useState(false);
    const copy = () => { navigator.clipboard.writeText(code); setC(true); setTimeout(() => setC(false), 2000); };
    return (
        <div className="relative rounded-2xl overflow-hidden my-3" style={{ background: '#1e293b', boxShadow: '0 4px 16px rgba(15,23,42,0.12)', border: '1px solid #334155' }}>
            <div className="flex items-center justify-between px-4 py-1.5" style={{ background: '#0f172a', borderBottom: '1px solid #334155' }}>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400/60" /><span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" /><span className="w-2.5 h-2.5 rounded-full bg-green-400/60" /></div>
                    <span className="text-[9px] uppercase tracking-[0.18em] font-bold text-slate-400">{lang}</span>
                </div>
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
    return <div className="rounded-xl p-4 my-3 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', border: '1px solid #c7d2fe', color: '#3730a3' }}>{children}</div>;
}

const tocItems = [
    { icon: <BookOpen size={13} />, label: 'Introduction', id: 'intro', color: '#6366f1' },
    { icon: <GitBranch size={13} />, label: 'if Statement', id: 'if', color: '#3b82f6' },
    { icon: <GitBranch size={13} />, label: 'if-else', id: 'ifelse', color: '#8b5cf6' },
    { icon: <GitBranch size={13} />, label: 'if-elif-else', id: 'elif', color: '#06b6d4' },
    { icon: <GitBranch size={13} />, label: 'Nested if', id: 'nested', color: '#d97706' },
    { icon: <Sparkles size={13} />, label: 'Logical Operators', id: 'logical', color: '#7c3aed' },
    { icon: <Zap size={13} />, label: 'Short-Circuit', id: 'shortcircuit', color: '#10b981' },
    { icon: <Repeat size={13} />, label: 'while Loop', id: 'while', color: '#0d9488' },
    { icon: <Repeat size={13} />, label: 'for Loop', id: 'for', color: '#8b5cf6' },
    { icon: <ArrowRight size={13} />, label: 'break', id: 'break', color: '#e11d48' },
    { icon: <ArrowRight size={13} />, label: 'continue', id: 'continue', color: '#0284c7' },
    { icon: <ShieldCheck size={13} />, label: 'Loop else', id: 'loopelse', color: '#059669' },
    { icon: <Code2 size={13} />, label: 'Patterns', id: 'patterns', color: '#f97316' },
    { icon: <Brain size={13} />, label: 'MCQ Quiz', id: 'mcq', color: '#6366f1' },
    { icon: <FileText size={13} />, label: 'Practice PDFs', id: 'practice', color: '#8b5cf6' },
];

const navLinks = [
    { label: 'Home', href: '/', icon: <Home size={14} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={14} /> },
    { label: 'Notes', href: '/notes', icon: <StickyNote size={14} /> },
    { label: 'Python', href: '/python', icon: <Code2 size={14} /> },
    { label: 'MCQ', href: '/mcq', icon: <Brain size={14} /> },
    { label: 'Shortcuts', href: '/shortcuts', icon: <KBIcon size={14} /> },
];

export default function ControlStatements() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('intro');

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 30%, #e2e8f0 100%)' }}>
            {/* ══════ WHITE NAVBAR ══════ */}
            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.03)' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/python" className="flex items-center justify-center w-9 h-9 rounded-xl transition-all hover:scale-105 hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}><ArrowLeft size={16} className="text-white" /></Link>
                        <div>
                            <h1 className="text-sm font-extrabold" style={{ color: '#1e293b' }}>Control Statements</h1>
                            <div className="flex items-center gap-1.5"><Sparkles size={8} style={{ color: '#6366f1' }} /><span className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: '#6366f1' }}>Chapter 2 • Python</span></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        {navLinks.map(l => (<Link key={l.href} href={l.href} className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-105" style={{ color: '#64748b' }} onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#6366f1'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>{l.icon}<span>{l.label}</span></Link>))}
                        <button onClick={() => setTocOpen(!tocOpen)} className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>{tocOpen ? <X size={18} style={{ color: '#6366f1' }} /> : <Menu size={18} style={{ color: '#6366f1' }} />}</button>
                    </div>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #f97316, #6366f1)' }} />
            </header>

            <div className="max-w-7xl mx-auto flex relative">
                {/* ── SIDEBAR ── */}
                <aside className={`${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[52px] left-0 z-40 lg:z-10 w-64 lg:w-56 xl:w-64 h-[calc(100vh-52px)] overflow-y-auto transition-transform duration-300 lg:flex-shrink-0`} style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRight: '1px solid #e2e8f0', boxShadow: tocOpen ? '4px 0 24px rgba(0,0,0,0.08)' : 'none' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}><Hash size={12} className="text-white" /></div>
                            <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: '#1e293b' }}>Contents</span>
                        </div>
                        <nav className="space-y-0.5">
                            {tocItems.map(item => (
                                <a key={item.id} href={`#${item.id}`} onClick={() => { setActiveSection(item.id); setTocOpen(false); }} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200" style={{ background: activeSection === item.id ? `${item.color}12` : 'transparent', border: activeSection === item.id ? `1px solid ${item.color}30` : '1px solid transparent', color: activeSection === item.id ? item.color : '#64748b' }} onMouseEnter={e => { if (activeSection !== item.id) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; } }} onMouseLeave={e => { if (activeSection !== item.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; } }}>
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
                    <section className="relative rounded-3xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 30%, #8b5cf6 60%, #a855f7 100%)', boxShadow: '0 8px 32px rgba(99,102,241,0.25)' }}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none"><div className="absolute -top-20 -right-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)' }} /><div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)' }} /></div>
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}><Sparkles size={10} /> Chapter 2 • Python</div>
                            <h2 className="text-2xl md:text-4xl font-black mb-3 text-white" style={{ lineHeight: '1.2' }}>Control Statements</h2>
                            <p className="text-sm md:text-base max-w-2xl mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>Python mein program ka flow kaise control karte hain — if/else se decisions lo, loops se kaam repeat karo!</p>
                            <div className="flex flex-wrap gap-2">
                                {[{ icon: <GitBranch size={14} />, label: 'if / elif / else' }, { icon: <Repeat size={14} />, label: 'while & for' }, { icon: <Zap size={14} />, label: 'break / continue' }, { icon: <Brain size={14} />, label: '10 MCQs' }].map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>{s.icon}<span>{s.label}</span></div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ═══ CONTENT ═══ */}
                    <Sec id="intro" title="Introduction to Control Statements" icon={<BookOpen size={16} className="text-indigo-500" />}>
                        <Def>🔀 <strong>Control Statements</strong> woh commands hain jo Python ko batate hain ki code ko kis order mein chalana hai. Ye program ka &quot;traffic police&quot; hain — decide karte hain kaunsa code kab chalega!</Def>
                        <p><strong>3 types ke control statements hote hain:</strong></p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                            {[{ t: '🔀 Decision Making', d: 'if, elif, else — condition ke basis par decide karo ki kya karna hai', bg: '#eef2ff', bc: '#c7d2fe', tc: '#4338ca' }, { t: '🔄 Loops', d: 'while, for — code ko baar baar repeat karo jab tak zaroorat ho', bg: '#ecfdf5', bc: '#a7f3d0', tc: '#166534' }, { t: '⚡ Jump', d: 'break, continue — loop ke flow ko control karo', bg: '#fff7ed', bc: '#fed7aa', tc: '#9a3412' }].map((item, i) => (
                                <div key={i} className="p-4 rounded-2xl" style={{ background: item.bg, border: `1px solid ${item.bc}` }}><h4 className="font-bold text-sm mb-1" style={{ color: item.tc }}>{item.t}</h4><p className="text-xs" style={{ color: '#64748b' }}>{item.d}</p></div>
                            ))}
                        </div>
                        <p><strong>Real life example:</strong> Jaise traffic signal par — 🟢 Green = Jao, 🔴 Red = Ruko, 🟡 Yellow = Dhire. Python mein bhi aisi decisions <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-xs">if-else</code> se lete hain!</p>
                    </Sec>

                    <Sec id="if" title="Simple if Statement" icon={<GitBranch size={16} className="text-blue-500" />}>
                        <Def>✅ <strong>if statement</strong> check karta hai ki koi condition True hai ya nahi. Agar True hai, toh andar ka code chalega. Agar False hai, toh skip ho jaayega.</Def>
                        <p><strong>Syntax:</strong> <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-xs">if condition:</code> ke baad indented code likho.</p>
                        <CB code={`# Example 1: Positive number check\nnumber = 10\nif number > 0:\n    print(f"{number} positive hai!")  # ✅ Ye chalega\n\n# Example 2: Age check\nage = 20\nif age >= 18:\n    print("Aap adult ho!")  # ✅ Ye bhi chalega\n\n# Example 3: Empty string check\ntext = ""\nif not text:\n    print("String khaali hai!")  # ✅ Empty string = False`} />
                        <IB type="tip">Python mein <code>0</code>, <code>&quot;&quot;</code> (empty string), <code>[]</code> (empty list), <code>None</code> — ye sab <strong>False</strong> maane jaate hain. Baaki sab <strong>True</strong> hai!</IB>
                    </Sec>

                    <Sec id="ifelse" title="if-else Statement" icon={<GitBranch size={16} className="text-violet-500" />}>
                        <Def>↔️ <strong>if-else</strong> mein do raaste hote hain — agar condition True hai toh ek kaam karo, agar False hai toh doosra kaam karo. Dono mein se ek zaroor chalega!</Def>
                        <CB code={`# Even ya Odd check karo\nnumber = 15\n\nif number % 2 == 0:    # Kya remainder 0 hai?\n    print(f"{number} Even hai")   # ← Nahi chalega\nelse:\n    print(f"{number} Odd hai")    # ← Ye chalega! ✅\n\n# Output: 15 Odd hai`} />
                        <CB code={`# Pass ya Fail\nmarks = 35\n\nif marks >= 33:\n    print("🎉 Congratulations! Pass ho gaye!")\nelse:\n    print("😢 Fail ho gaye, mehnat karo!")\n\n# Output: 🎉 Congratulations! Pass ho gaye!`} />
                    </Sec>

                    <Sec id="elif" title="if-elif-else Statement" icon={<GitBranch size={16} className="text-cyan-500" />}>
                        <Def>🔢 Jab <strong>do se zyada conditions</strong> check karni ho, tab <code>elif</code> (else if) use karte hain. Ye ek ke baad ek check karta hai — jo pehle True milti hai, uska code chalata hai!</Def>
                        <CB code={`# Grade Calculator — Bahut useful example!\nscore = 85\n\nif score >= 90:\n    grade = "A"     # 90-100\nelif score >= 80:\n    grade = "B"     # 80-89  ← Ye match hoga!\nelif score >= 70:\n    grade = "C"     # 70-79\nelif score >= 60:\n    grade = "D"     # 60-69\nelse:\n    grade = "F"     # 0-59\n\nprint(f"Score: {score}, Grade: {grade}")\n# Output: Score: 85, Grade: B`} />
                        <CB code={`# Mausam (Weather) ke basis par kya pehne?\ntemperature = 35\n\nif temperature > 40:\n    print("🥵 Bahut garmi! Ghar pe raho!")\nelif temperature > 30:\n    print("☀️ Garmi hai, cotton ke kapde pehno")\nelif temperature > 20:\n    print("🌤️ Accha mausam hai!")\nelif temperature > 10:\n    print("🧥 Thandi hai, jacket pehno")\nelse:\n    print("🥶 Bahut thandi! Sweater + jacket dono!")`} />
                    </Sec>

                    <Sec id="nested" title="Nested if Statements" icon={<GitBranch size={16} className="text-amber-500" />}>
                        <Def>🪆 <strong>Nested if</strong> matlab if ke andar if. Jab ek condition True ho, tab doosri condition bhi check karni ho — tab ye use karte hain.</Def>
                        <CB code={`# Online Shopping — Purchase Approve karo\nage = 25\nhas_id = True\nhas_money = True\n\nif age >= 18:                    # Pehle age check\n    print("✅ Age OK!")\n    if has_id:                   # Phir ID check\n        print("✅ ID Verified!")\n        if has_money:            # Phir paisa check\n            print("🎉 Purchase Approved!")\n        else:\n            print("❌ Insufficient funds")\n    else:\n        print("❌ ID verification required")\nelse:\n    print("❌ Must be 18 or older")`} />
                        <IB type="tip">Bahut zyada nesting avoid karo — code complex ho jaata hai. Uski jagah <strong>logical operators (and/or)</strong> use karo!</IB>
                    </Sec>

                    <Sec id="logical" title="Logical Operators (and, or, not)" icon={<Sparkles size={16} className="text-purple-500" />}>
                        <Def>🧠 <strong>Logical operators</strong> multiple conditions ko ek saath check karte hain. <code>and</code> = dono True ho, <code>or</code> = koi ek True ho, <code>not</code> = ulta kar do.</Def>

                        <h3 className="text-base font-bold mt-4 mb-2" style={{ color: '#1e293b' }}>AND — Dono conditions True honi chahiye</h3>
                        <CB code={`# Same shopping example — but simpler!\nage = 25\nhas_id = True\nhas_money = True\n\n# Nested if ki jagah ek hi line mein!\nif age >= 18 and has_id and has_money:\n    print("🎉 Purchase Approved!")  # ✅ Sab True hai!\nelse:\n    print("❌ Cannot purchase")\n\n# and Truth Table:\n# True  and True  = True  ✅\n# True  and False = False ❌\n# False and True  = False ❌\n# False and False = False ❌`} />

                        <h3 className="text-base font-bold mt-5 mb-2" style={{ color: '#1e293b' }}>OR — Koi ek condition True honi chahiye</h3>
                        <CB code={`# Discount milega ya nahi?\nis_student = False\nis_senior = True\nis_member = False\n\nif is_student or is_senior or is_member:\n    print("🎁 Discount applied!")  # ✅ Senior hai!\nelse:\n    print("❌ No discount")\n\n# or Truth Table:\n# True  or True  = True  ✅\n# True  or False = True  ✅\n# False or True  = True  ✅\n# False or False = False ❌`} />

                        <h3 className="text-base font-bold mt-5 mb-2" style={{ color: '#1e293b' }}>AND + OR Combined</h3>
                        <CB code={`# Ticket Pricing System\nage = 65\nis_weekend = True\n\nif age < 5:\n    price = 0       # Free for babies\nelif (age < 18 or age >= 60) and not is_weekend:\n    price = 8       # Discount on weekdays\nelse:\n    price = 12      # Full price\n\nprint(f"Ticket: ₹{price}")`} />
                        <IB type="note">Hamesha parentheses <code>()</code> use karo complex conditions mein — clarity badhti hai aur bugs kam hote hain!</IB>
                    </Sec>

                    <Sec id="shortcircuit" title="Short-Circuit Evaluation" icon={<Zap size={16} className="text-emerald-500" />}>
                        <Def>⚡ <strong>Short-circuit</strong> matlab Python aagya ki result pata lag gaya toh baaqi conditions check hi nahi karega — time bachata hai!</Def>
                        <p><strong>Simple samjho:</strong></p>
                        <ul className="list-disc ml-6 space-y-1 mb-3">
                            <li><code>False and ___</code> → Result pehle se <strong>False</strong> hai, toh <code>___</code> check nahi hoga</li>
                            <li><code>True or ___</code> → Result pehle se <strong>True</strong> hai, toh <code>___</code> check nahi hoga</li>
                        </ul>
                        <CB code={`# Short-circuit demonstration\ndef check_a():\n    print("A check ho raha...")\n    return False\n\ndef check_b():\n    print("B check ho raha...")\n    return True\n\n# AND: pehla False hai, toh doosra check nahi hoga\nprint("AND:")\nresult = check_a() and check_b()  # Sirf "A check ho raha..." print hoga\nprint(f"Result: {result}")         # False\n\n# OR: pehla True hai, toh doosra check nahi hoga\nprint("\\nOR:")\nresult = check_b() or check_a()   # Sirf "B check ho raha..." print hoga\nprint(f"Result: {result}")         # True`} />
                    </Sec>

                    <Sec id="while" title="while Loop" icon={<Repeat size={16} className="text-teal-500" />}>
                        <Def>🔄 <strong>while loop</strong> tab tak code repeat karta hai jab tak condition True rahe. Jaise — &quot;Jab tak bhookh lage, khana khao!&quot;</Def>
                        <CB code={`# Countdown Timer — 5 se 1 tak!\ncountdown = 5\nwhile countdown > 0:\n    print(f"⏰ {countdown}...")\n    countdown -= 1     # Har baar 1 kam karo\nprint("🚀 Blast off!")\n\n# Output:\n# ⏰ 5...\n# ⏰ 4...\n# ⏰ 3...\n# ⏰ 2...\n# ⏰ 1...\n# 🚀 Blast off!`} />
                        <CB code={`# User se tab tak input lo jab tak "quit" na likhe\nwhile True:\n    command = input("Command likho (quit to exit): ")\n    if command == "quit":\n        print("Bye! 👋")\n        break           # Loop se bahar aao!\n    print(f"Aapne likha: {command}")`} />
                        <IB type="warning">While loop mein condition kabhi False na ho toh <strong>infinite loop</strong> ban jaayega! Hamesha condition update karo ya <code>break</code> use karo.</IB>
                    </Sec>

                    <Sec id="for" title="for Loop" icon={<Repeat size={16} className="text-violet-500" />}>
                        <Def>🔢 <strong>for loop</strong> ek sequence (list, string, range) ke har ek item par ek-ek karke kaam karta hai. Jaise — &quot;Class ke har student ka naam bolo&quot;.</Def>
                        <CB code={`# List ke har item par loop\nfruits = ["🍎 Apple", "🍌 Banana", "🥭 Mango"]\nfor fruit in fruits:\n    print(f"Mujhe pasand hai: {fruit}")\n\n# Output:\n# Mujhe pasand hai: 🍎 Apple\n# Mujhe pasand hai: 🍌 Banana\n# Mujhe pasand hai: 🥭 Mango`} />
                        <CB code={`# range() — Numbers ka sequence banao\n# range(5) = 0, 1, 2, 3, 4\n# range(1, 6) = 1, 2, 3, 4, 5\n# range(0, 10, 2) = 0, 2, 4, 6, 8\n\n# Multiplication Table\nnumber = 5\nprint(f"--- {number} ka Table ---")\nfor i in range(1, 11):\n    print(f"{number} × {i} = {number * i}")`} />
                        <CB code={`# Total calculate karo\nprices = [100, 250, 50, 300]\ntotal = 0\nfor price in prices:\n    total += price\nprint(f"Total bill: ₹{total}")  # ₹700`} />
                    </Sec>

                    <Sec id="break" title="break Statement" icon={<ArrowRight size={16} className="text-rose-500" />}>
                        <Def>🛑 <strong>break</strong> loop ko turant rok deta hai — baaki iterations skip ho jaate hain. Jaise chabi mil gayi toh dhundhna band!</Def>
                        <CB code={`# Pahla even number dhundho\nnumbers = [1, 3, 5, 6, 7, 8, 9]\n\nfor num in numbers:\n    if num % 2 == 0:\n        print(f"✅ Pehla even number mila: {num}")\n        break  # Mil gaya, ab aur dhundhne ki zaroorat nahi!\n    print(f"❌ {num} odd hai, agle ko dekho...")\n\n# Output:\n# ❌ 1 odd hai, agle ko dekho...\n# ❌ 3 odd hai, agle ko dekho...\n# ❌ 5 odd hai, agle ko dekho...\n# ✅ Pehla even number mila: 6`} />
                    </Sec>

                    <Sec id="continue" title="continue Statement" icon={<ArrowRight size={16} className="text-sky-500" />}>
                        <Def>⏭️ <strong>continue</strong> current iteration skip karke next par chala jaata hai. Loop band nahi hota — sirf ek baar skip karta hai!</Def>
                        <CB code={`# Sirf odd numbers print karo, even skip karo\nfor i in range(1, 11):\n    if i % 2 == 0:     # Agar even hai...\n        continue       # Skip karo! ⏭️\n    print(f"Odd: {i}") # Sirf odd wale yahan aayenge\n\n# Output: 1, 3, 5, 7, 9`} />
                        <CB code={`# Negative marks skip karo, sirf positive count karo\nmarks = [85, -1, 90, -5, 75, 88]\ntotal = 0\ncount = 0\n\nfor m in marks:\n    if m < 0:\n        continue  # Negative skip!\n    total += m\n    count += 1\n\nprint(f"Average: {total/count:.1f}")  # 84.5`} />
                    </Sec>

                    <Sec id="loopelse" title="Loop with else" icon={<ShieldCheck size={16} className="text-green-500" />}>
                        <Def>🔍 Python mein loop ke saath <code>else</code> bhi laga sakte ho! <strong>else</strong> tab chalega jab loop normally complete ho (bina break ke). Agar break laga toh else skip ho jaayega.</Def>
                        <CB code={`# Prime Number Check karo\nnumber = 13\n\nfor i in range(2, number):\n    if number % i == 0:\n        print(f"{number} prime nahi hai")\n        break                    # Divisor mila, break!\nelse:\n    # Ye tab chalega jab break NAHI laga\n    print(f"{number} prime hai! ✨")\n\n# Output: 13 prime hai! ✨`} />
                        <IB type="note">Loop ka <code>else</code> bahut useful hai jab dhundhna ho — agar mil gaya toh <code>break</code> karo, agar nahi mila toh <code>else</code> mein batao.</IB>
                    </Sec>

                    <Sec id="patterns" title="Pattern Programs" icon={<Code2 size={16} className="text-orange-500" />}>
                        <Def>🔺 <strong>Pattern programs</strong> loops ka best practice hain. Nested loops se alag-alag shapes bana sakte ho — interviews mein bhi poochhe jaate hain!</Def>
                        <CB code={`# Right Triangle Pattern\nn = 5\nfor i in range(1, n+1):\n    print("⭐ " * i)\n\n# Output:\n# ⭐\n# ⭐ ⭐\n# ⭐ ⭐ ⭐\n# ⭐ ⭐ ⭐ ⭐\n# ⭐ ⭐ ⭐ ⭐ ⭐`} />
                        <CB code={`# Number Pyramid\nn = 5\nfor i in range(1, n+1):\n    print(" " * (n-i), end="")\n    for j in range(1, i+1):\n        print(j, end=" ")\n    print()\n\n# Output:\n#     1\n#    1 2\n#   1 2 3\n#  1 2 3 4\n# 1 2 3 4 5`} />
                    </Sec>

                    {/* ═══ MCQ ═══ */}
                    <Sec id="mcq" title="MCQ Quiz — Test Your Knowledge!" icon={<Brain size={16} className="text-indigo-500" />}>
                        <p className="mb-4"><strong>10 important MCQs</strong> — Control Statements ke concepts test karo! 🧠</p>
                        <ControlMCQ />
                    </Sec>

                    {/* ═══ PRACTICE PDFs ═══ */}
                    <Sec id="practice" title="Practice Questions — PDFs" icon={<FileText size={16} className="text-violet-500" />}>
                        <p className="mb-3">In practice sets se aur practice karo — Google Drive se download kar sakte ho! 📥</p>
                        <div className="space-y-3">
                            {[
                                { label: '📝 Conditional Statements Practice', desc: 'if / elif / else Questions', href: '/optional-content', bg: '#eef2ff', bc: '#c7d2fe', tc: '#4338ca' },
                                { label: '📝 while Loop Practice', desc: 'While Loop Questions', href: '/optional-content', bg: '#ecfdf5', bc: '#a7f3d0', tc: '#166534' },
                                { label: '📝 Practice Set 1', desc: 'Control Statements — Google Drive PDF', href: '/optional-content', bg: '#f5f3ff', bc: '#ddd6fe', tc: '#5b21b6' },
                                { label: '📝 Practice Set 2', desc: 'Control Statements — Google Drive PDF', href: '/optional-content', bg: '#fdf2f8', bc: '#fbcfe8', tc: '#9d174d' },
                                { label: '📝 Practice Set 3', desc: 'Python Programming Questions — 10 Questions', href: '/sample-assets/placeholder.svg', bg: '#fff7ed', bc: '#fed7aa', tc: '#c2410c' },
                            ].map((item, i) => (
                                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-lg" style={{ background: item.bg, border: `1px solid ${item.bc}` }}>
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm" style={{ background: item.tc }}>{i + 1}</div>
                                    <div className="flex-1">
                                        <span className="text-sm font-bold" style={{ color: item.tc }}>{item.label}</span>
                                        <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>{item.desc}</p>
                                    </div>
                                    <ExternalLink size={16} style={{ color: item.tc }} className="group-hover:translate-x-0.5 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </Sec>
                </main>
            </div>
        </div>
    );
}
