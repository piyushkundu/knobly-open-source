'use client';
import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Menu, X, ChevronRight, Hash, Sparkles, Cpu, Activity, Zap, Eye, Sun, Settings, Cog, Microchip, Clock, Monitor, Box, Wrench, Shield, Smartphone, Globe, Battery, Layers, Smile, Tag, Home, CircuitBoard, BookOpen, ToggleLeft, MousePointerClick, FileCode2, Braces, CheckCircle2, Repeat, Lightbulb, FlaskConical, Waves, Radio, Scan, Radar, Thermometer } from 'lucide-react';

function Sec({ id, title, icon, children }: { id: string; title: string; icon: ReactNode; children: ReactNode }) {
    return (
        <section id={id} className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg bg-white" style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>{icon}<h2 className="text-base md:text-lg font-extrabold text-gray-800">{title}</h2></div>
            <div className="text-sm leading-relaxed space-y-3 text-gray-600">{children}</div>
        </section>
    );
}

function Def({ children }: { children: ReactNode }) {
    return <div className="rounded-xl p-4 my-3 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', border: '1px solid #99f6e4', color: '#0f766e' }}>{children}</div>;
}

function IB({ type = 'tip', children }: { type?: 'tip' | 'note' | 'warning'; children: ReactNode }) {
    const s: Record<string, { bg: string; bc: string; tc: string; emoji: string }> = { tip: { bg: '#ecfeff', bc: '#67e8f9', tc: '#0e7490', emoji: '💡' }, note: { bg: '#eff6ff', bc: '#93c5fd', tc: '#1e40af', emoji: '📝' }, warning: { bg: '#fefce8', bc: '#fde047', tc: '#854d0e', emoji: '⚠️' } };
    const st = s[type];
    return <div className="rounded-xl p-3.5 text-xs font-medium my-3" style={{ background: st.bg, border: `1px solid ${st.bc}`, color: st.tc }}>{st.emoji} {children}</div>;
}

const tocItems = [
    { icon: <Microchip size={13} />, label: 'Intro to Arduino', id: 'arduino-intro', color: '#0ea5e9' },
    { icon: <Monitor size={13} />, label: 'Arduino IDE', id: 'arduino-ide', color: '#8b5cf6' },
    { icon: <Sparkles size={13} />, label: 'Features', id: 'arduino-features', color: '#f59e0b' },
    { icon: <Cog size={13} />, label: 'Uses of Arduino', id: 'arduino-uses', color: '#10b981' },
    { icon: <Clock size={13} />, label: 'History', id: 'arduino-history', color: '#ec4899' },
    { icon: <Shield size={13} />, label: 'Why Use Arduino', id: 'why-arduino', color: '#3b82f6' },
    { icon: <CircuitBoard size={13} />, label: 'Types of Boards', id: 'arduino-types', color: '#f43f5e' },
    { icon: <Cpu size={13} />, label: 'Arduino Uno R3', id: 'arduino-uno-deepdive', color: '#14b8a6' },
    { icon: <Shield size={13} />, label: 'Arduino Shield', id: 'arduino-shield', color: '#ef4444' },
    { icon: <Monitor size={13} />, label: 'Arduino IDE Deep Dive', id: 'arduino-ide-deepdive', color: '#8b5cf6' },
    { icon: <BookOpen size={13} />, label: 'Arduino Library', id: 'arduino-library', color: '#d946ef' },
    { icon: <ToggleLeft size={13} />, label: 'Input & Output Pins', id: 'arduino-pins', color: '#0ea5e9' },
    { icon: <MousePointerClick size={13} />, label: 'Select the Board', id: 'arduino-select-board', color: '#f59e0b' },
    { icon: <FileCode2 size={13} />, label: 'Writing & Editing Codes', id: 'arduino-sketch-edit', color: '#10b981' },
    { icon: <Braces size={13} />, label: 'Sketch Structure', id: 'arduino-sketch-structure', color: '#8b5cf6' },
    { icon: <Cog size={13} />, label: 'What is Function', id: 'what-is-function', color: '#ef4444' },
    { icon: <Cpu size={13} />, label: 'Embedded C Language', id: 'embedded-c', color: '#0ea5e9' },
    { icon: <Tag size={13} />, label: 'Variables', id: 'variables', color: '#f59e0b' },
    { icon: <Shield size={13} />, label: 'Rules for Variables', id: 'variable-rules', color: '#ec4899' },
    { icon: <Layers size={13} />, label: 'Data Types', id: 'data-types', color: '#8b5cf6' },
    { icon: <Activity size={13} />, label: 'Operators in C', id: 'operators', color: '#f43f5e' },
    { icon: <CheckCircle2 size={13} />, label: 'Conditional Statements', id: 'conditional-statements', color: '#10b981' },
    { icon: <Repeat size={13} />, label: 'Loop Statements', id: 'loop-statements', color: '#0ea5e9' },
    { icon: <Activity size={13} />, label: 'Inbuilt Functions', id: 'inbuilt-functions', color: '#8b5cf6' },
    { icon: <Activity size={13} />, label: 'Analog Inbuilt Functions', id: 'analog-functions', color: '#f59e0b' },
    { icon: <Clock size={13} />, label: 'Time Functions', id: 'time-functions', color: '#ec4899' },
    { icon: <Activity size={13} />, label: 'Math Functions', id: 'math-functions', color: '#0ea5e9' },
    { icon: <Braces size={13} />, label: 'Character Functions', id: 'char-functions', color: '#8b5cf6' },
    { icon: <FlaskConical size={13} />, label: 'Practical – LDR', id: 'ldr-practical', color: '#f97316' },
    { icon: <Waves size={13} />, label: 'Practical – Ultrasonic', id: 'ultrasonic-practical', color: '#0ea5e9' },
    { icon: <Scan size={13} />, label: 'Practical – PIR Sensor', id: 'pir-practical', color: '#ec4899' },
    { icon: <Radar size={13} />, label: 'Practical – IR Sensor', id: 'ir-practical', color: '#ef4444' },
    { icon: <Thermometer size={13} />, label: 'Practical – DHT11', id: 'dht-practical', color: '#10b981' },
    { icon: <Lightbulb size={13} />, label: 'Practical – Fading LED', id: 'fading-led-practical', color: '#f59e0b' },
    { icon: <Smartphone size={13} />, label: 'Practical – Bluetooth', id: 'bluetooth-practical', color: '#3b82f6' },
];

export default function IoTApplications() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('arduino-intro');

    return (
        <div className="min-h-screen bg-white text-slate-800 relative">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30" />
            </div>

            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/iot" className="flex items-center justify-center w-9 h-9 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}><ArrowLeft size={16} /></Link>
                        <div>
                            <h1 className="text-sm font-extrabold text-gray-800">Building IoT Applications</h1>
                            <div className="flex items-center gap-1.5"><Sparkles size={8} className="text-emerald-500" /><span className="text-[9px] uppercase tracking-[0.18em] font-bold text-emerald-500">Chapter 4</span></div>
                        </div>
                    </div>
                    <button onClick={() => setTocOpen(!tocOpen)} className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 border border-gray-200">
                        {tocOpen ? <X size={18} className="text-emerald-500" /> : <Menu size={18} className="text-emerald-500" />}
                    </button>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #10b981, #34d399, #059669, #10b981)' }} />
            </header>

            <div className="max-w-7xl mx-auto flex relative">
                <aside className={`${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[52px] left-0 z-40 lg:z-10 w-64 lg:w-56 xl:w-64 h-[calc(100vh-52px)] overflow-y-auto transition-transform duration-300 lg:flex-shrink-0 bg-white/95 backdrop-blur-xl`} style={{ borderRight: '1px solid #e2e8f0' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}><Hash size={12} className="text-white" /></div>
                            <span className="text-xs font-extrabold uppercase tracking-wider text-gray-800">Contents</span>
                        </div>
                        <nav className="space-y-0.5">
                            {tocItems.map(item => (
                                <a key={item.id} href={`#${item.id}`} onClick={() => { setActiveSection(item.id); setTocOpen(false); }}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                                    style={{ background: activeSection === item.id ? `${item.color}15` : 'transparent', border: activeSection === item.id ? `1px solid ${item.color}30` : '1px solid transparent', color: activeSection === item.id ? item.color : '#64748b' }}>
                                    <span style={{ color: item.color }}>{item.icon}</span>{item.label}
                                    {activeSection === item.id && <ChevronRight size={10} className="ml-auto" />}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>
                {tocOpen && <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setTocOpen(false)} />}

                <main className="flex-1 min-w-0 px-4 py-6 lg:pl-6">
                    {/* Hero */}
                    <section className="relative rounded-3xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 30%, #34d399 60%, #a7f3d0 100%)', boxShadow: '0 8px 32px rgba(16,185,129,0.25)' }}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)' }} />
                        </div>
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#064e3b' }}>
                                <Sparkles size={10} /> Chapter 4 — O-Level M4-R5
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black mb-3 text-white" style={{ lineHeight: '1.2' }}>Building IoT Application</h2>
                            <p className="text-sm md:text-base max-w-2xl mb-5 text-white/90 font-medium">Arduino board ki basics seekhiye aur apne first smart device application banane ki shuruwat kijiye.</p>
                        </div>
                    </section>

                    {/* ═══ SECTION: Intro to Arduino ═══ */}
                    <Sec id="arduino-intro" title="🔹 Introduction to Arduino" icon={<Microchip size={16} className="text-sky-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>🔵 <strong>Arduino</strong> ek open-source electronic platform hai jo hardware aur software dono provide karta hai.</Def>
                                <p>Is platform ka use electronic projects aur IoT applications banane ke liye kiya jata hai. Arduino beginners aur experts dono ke liye bahut useful hota hai kyunki iska programming environment simple aur easy hota hai.</p>
                                <p>Arduino ki madad se <strong>sensors aur modules</strong> ko connect karke unhe program kiya ja sakta hai aur real-world applications (jaise smart home, robotics) banaye ja sakte hain.</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Arduino Board" className="w-full h-auto rounded-2xl shadow-md border border-gray-100" />
                            </div>
                        </div>

                        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mt-5">
                            <p className="text-sm text-sky-900 font-semibold mb-2">Arduino kaise kaam karta hai:</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <span className="px-4 py-2 bg-white rounded-lg border border-sky-200 text-sky-700 shadow-sm font-bold text-xs flex items-center gap-1"><Eye size={14} /> 1. Read Sensors</span>
                                <ChevronRight className="text-sky-400 rotate-90 sm:rotate-0" />
                                <span className="px-4 py-2 bg-sky-700 rounded-lg text-white shadow-md font-bold text-xs flex items-center gap-1"><Cpu size={14} /> 2. Process Data</span>
                                <ChevronRight className="text-sky-400 rotate-90 sm:rotate-0" />
                                <span className="px-4 py-2 bg-white rounded-lg border border-sky-200 text-sky-700 shadow-sm font-bold text-xs flex items-center gap-1"><Cog size={14} /> 3. Control Actuators</span>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Arduino IDE ═══ */}
                    <Sec id="arduino-ide" title="🔹 Arduino IDE" icon={<Monitor size={16} className="text-purple-500" />}>
                        <div className="flex flex-col md:flex-row-reverse gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <p>Arduino ko program karne ke liye <strong>Arduino IDE (Integrated Development Environment)</strong> ka use kiya jata hai.</p>
                                <p>Ye ek software hota hai jisme:</p>
                                <ul className="space-y-2 mb-3">
                                    <li className="flex items-center gap-2 text-sm text-gray-700 bg-purple-50 px-3 py-2 rounded-lg border border-purple-100"><span className="text-purple-600 font-bold">1.</span> Code likha jata hai</li>
                                    <li className="flex items-center gap-2 text-sm text-gray-700 bg-purple-50 px-3 py-2 rounded-lg border border-purple-100"><span className="text-purple-600 font-bold">2.</span> Code compile hota hai (Errors check hote hain)</li>
                                    <li className="flex items-center gap-2 text-sm text-gray-700 bg-purple-50 px-3 py-2 rounded-lg border border-purple-100"><span className="text-purple-600 font-bold">3.</span> Code upload hota hai (Microcontroller me save hota hai)</li>
                                </ul>
                                <IB type="note">Arduino IDE <strong>C/C++ based language</strong> ko support karta hai. Iski language seekhna bahut aasan hota hai.</IB>
                            </div>
                            <div className="w-full md:w-72 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Arduino IDE Software" className="w-full h-auto rounded-2xl shadow-md border border-gray-100" />
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Features of Arduino ═══ */}
                    <Sec id="arduino-features" title="🔹 Features of Arduino" icon={<Sparkles size={16} className="text-amber-500" />}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                            {[
                                { title: 'Easy Programming', icon: <Monitor size={20} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                                { title: 'Open-Source', icon: <Globe size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                                { title: 'Beginner Friendly', icon: <Smile size={20} />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                                { title: 'Sensor Support', icon: <Activity size={20} />, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
                                { title: 'Fast Prototyping', icon: <Zap size={20} />, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                                { title: 'Low Cost', icon: <Tag size={20} />, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
                            ].map((f, i) => (
                                <div key={i} className={`p-4 rounded-xl ${f.bg} ${f.border} border text-center flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow`}>
                                    <div className={f.color}>{f.icon}</div>
                                    <span className="text-xs font-bold text-gray-800">{f.title}</span>
                                </div>
                            ))}
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Uses of Arduino ═══ */}
                    <Sec id="arduino-uses" title="🔹 Uses of Arduino" icon={<Cog size={16} className="text-emerald-500" />}>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-1 space-y-4">
                                <p>Arduino ka use different IoT aur automation projects me hota hai:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-emerald-300 transition-colors">
                                        <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center"><Sun size={20} /></div>
                                        <span className="text-sm font-semibold text-gray-700">Automatic light system</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-emerald-300 transition-colors">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Cpu size={20} /></div>
                                        <span className="text-sm font-semibold text-gray-700">Smart robot</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-emerald-300 transition-colors">
                                        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><Shield size={20} /></div>
                                        <span className="text-sm font-semibold text-gray-700">Security system</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-emerald-300 transition-colors">
                                        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><Activity size={20} /></div>
                                        <span className="text-sm font-semibold text-gray-700">Sensor based apps</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-emerald-300 transition-colors sm:col-span-2">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Home size={20} /></div>
                                        <span className="text-sm font-semibold text-gray-700">Home automation system</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Arduino IoT Uses" className="w-full h-auto rounded-2xl shadow-md border border-emerald-100/50" />
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: History of Arduino ═══ */}
                    <Sec id="arduino-history" title="🔹 History of Arduino" icon={<Clock size={16} className="text-rose-500" />}>
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100 shadow-sm relative overflow-hidden">
                            <div className="absolute right-[-20px] top-[-20px] opacity-10"><Microchip size={100} /></div>
                            
                            <ul className="space-y-3 relative z-10">
                                <li className="flex items-start gap-2">
                                    <div className="w-5 h-5 mt-0.5 flex-shrink-0 bg-rose-700 rounded-full flex items-center justify-center text-white text-[10px] font-bold">1</div>
                                    <p className="text-sm text-gray-700">Arduino ko <strong>2005</strong> me <strong>Italy</strong> me develop kiya gaya tha.</p>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-5 h-5 mt-0.5 flex-shrink-0 bg-rose-700 rounded-full flex items-center justify-center text-white text-[10px] font-bold">2</div>
                                    <p className="text-sm text-gray-700">Isse <strong>Ivrea Interaction Design Institute</strong> ne students ke liye ek low-cost aur easy programming board ke roop me design kiya tha.</p>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-5 h-5 mt-0.5 flex-shrink-0 bg-rose-700 rounded-full flex items-center justify-center text-white text-[10px] font-bold">3</div>
                                    <p className="text-sm text-gray-700">Arduino ek microcontroller based board hai jo <strong>ATmega series</strong> ke microcontrollers par based hota hai.</p>
                                </li>
                            </ul>

                            <div className="mt-5 pt-4 border-t border-rose-200">
                                <p className="text-xs font-bold text-rose-800 mb-2 uppercase tracking-wide">👨‍💻 Arduino Development Team Members:</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Massimo Banzi', 'David Cuartielles', 'David Mellis', 'Tom Igoe'].map((name, i) => (
                                        <span key={i} className="px-3 py-1 bg-white border border-rose-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm">{name}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Why Use Arduino ═══ */}
                    <Sec id="why-arduino" title="🔴 Why Use Arduino" icon={<Shield size={16} className="text-blue-500" />}>
                        <p className="mb-5 text-sm text-gray-700">Arduino duniya ka sabse popular embedded aur IoT development platform mana jata hai. Iska use beginners se lekar professional developers tak sab karte hain kyunki ye easy, low-cost aur flexible platform provide karta hai.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* 1. Open Source */}
                            <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg"><Globe size={18} /></div>
                                    1. Open Source Platform
                                </h4>
                                <p className="text-xs text-gray-600 mb-3">Arduino ek open-source platform hai. Iska software aur hardware design publicly available hota hai.</p>
                                <ul className="text-[11px] text-gray-600 space-y-1 ml-6 list-disc marker:text-blue-400">
                                    <li>Arduino software free me use kar sakta hai</li>
                                    <li>Hardware design ko modify kar sakta hai</li>
                                    <li>Apna custom board bana sakta hai</li>
                                </ul>
                                <p className="text-[11px] font-semibold text-blue-700 mt-2 bg-blue-50 p-2 rounded-lg">Isi wajah se Arduino community bahut badi hai aur internet par iske thousands projects available hain.</p>
                            </div>

                            {/* 2. Cross Platform */}
                            <div className="p-4 rounded-xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-purple-900 text-base mb-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-purple-50 text-purple-500 rounded-lg"><Layers size={18} /></div>
                                    2. Cross Platform Support
                                </h4>
                                <p className="text-xs text-gray-600 mb-3">Arduino IDE cross-platform software hai. Ye different operating systems par chal sakta hai, yani kisi bhi computer me Arduino programming ki ja sakti hai.</p>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700">Windows</span>
                                    <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700">Linux</span>
                                    <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700">MacOS</span>
                                </div>
                            </div>

                            {/* 3. Inexpensive */}
                            <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-emerald-900 text-base mb-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-emerald-50 text-emerald-500 rounded-lg"><Tag size={18} /></div>
                                    3. Inexpensive (Low Cost)
                                </h4>
                                <p className="text-xs text-gray-600 mb-3">Arduino boards dusre microcontroller platforms ke comparison me kaafi saste hote hain.</p>
                                <p className="text-[11px] text-gray-600 bg-emerald-50 p-2 rounded-lg">Original Arduino board ki cost kam hoti hai aur clone boards aur bhi low price me available hote hain. Isliye students aur beginners ke liye ye best platform mana jata hai.</p>
                            </div>

                            {/* 4. Wide Variety */}
                            <div className="p-4 rounded-xl bg-white border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-amber-900 text-base mb-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-amber-50 text-amber-500 rounded-lg"><Box size={18} /></div>
                                    4. Wide Variety of Boards
                                </h4>
                                <p className="text-xs text-gray-600 mb-3">Arduino ke different types ke boards available hote hain jinko project requirement ke according select kiya ja sakta hai.</p>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {['Size', 'Speed', 'Memory', 'Pins'].map((prop, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-bold border border-amber-200">{prop}</span>
                                    ))}
                                </div>
                                <p className="text-[11px] text-gray-600">Har board me ye properties alag hoti hain. Isliye small aur large dono types ke projects me Arduino use kiya ja sakta hai.</p>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Types of Arduino Boards ═══ */}
                    <Sec id="arduino-types" title="🔴 Different Types of Arduino Board" icon={<CircuitBoard size={16} className="text-rose-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center mb-6">
                            <div className="flex-1 space-y-3">
                                <p>Arduino platform me different types ke boards available hote hain jo alag-alag projects aur applications ke liye use kiye jate hain. Har board ki apni specifications, memory, pins aur features hote hain.</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Different Types of Arduino Boards" className="w-full h-auto rounded-2xl shadow-md border border-gray-100" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* 1. Arduino Uno R3 */}
                            <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                                            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Cpu size={16} /></div>
                                            🔴 1. Arduino Uno R3
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">Arduino Uno sabse popular aur widely used Arduino board hai. Ye beginners aur IoT projects ke liye sabse jyada use kiya jata hai. Ye <strong>ATmega328P</strong> microcontroller par based hota hai.</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                                                <p className="text-xs font-bold text-blue-800 mb-1">⚡ Features</p>
                                                <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc marker:text-blue-400">
                                                    <li>Easy programming & Beginner friendly</li>
                                                    <li>USB support</li>
                                                    <li>Analog aur digital pins</li>
                                                    <li>Sensor interfacing support</li>
                                                </ul>
                                            </div>
                                            <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                                                <p className="text-xs font-bold text-indigo-800 mb-1">🛠️ Uses</p>
                                                <ul className="text-xs text-indigo-700 space-y-1 ml-4 list-disc marker:text-indigo-400">
                                                    <li>IoT projects & Robotics</li>
                                                    <li>Automation systems</li>
                                                    <li>Learning purpose</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-32 xl:w-40 flex-shrink-0 flex items-center justify-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Arduino Uno R3" className="w-full h-auto max-w-[150px] object-contain drop-shadow-md rounded-xl bg-gray-50/50 border border-gray-100 p-2" />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Arduino Nano */}
                            <div className="p-5 rounded-2xl bg-white border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                                            <div className="p-1.5 bg-teal-100 text-teal-600 rounded-lg"><Microchip size={16} /></div>
                                            🔴 2. Arduino Nano
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">Arduino Nano ek small size Arduino board hota hai jo compact projects ke liye use hota hai. Ye bhi <strong>ATmega328P</strong> microcontroller par based hota hai. Iska size chhota hota hai lekin functionality Arduino Uno jaisi hoti hai.</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                            <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-100">
                                                <p className="text-xs font-bold text-teal-800 mb-1">⚡ Features</p>
                                                <ul className="text-xs text-teal-700 space-y-1 ml-4 list-disc marker:text-teal-400">
                                                    <li>Small size</li>
                                                    <li>Breadboard friendly</li>
                                                    <li>Low power consumption</li>
                                                </ul>
                                            </div>
                                            <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                                                <p className="text-xs font-bold text-emerald-800 mb-1">🛠️ Uses</p>
                                                <ul className="text-xs text-emerald-700 space-y-1 ml-4 list-disc marker:text-emerald-400">
                                                    <li>Wearable devices</li>
                                                    <li>Compact embedded systems</li>
                                                    <li>Small IoT devices</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-32 xl:w-40 flex-shrink-0 flex items-center justify-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Arduino Nano" className="w-full h-auto max-w-[150px] object-contain drop-shadow-md rounded-xl bg-gray-50/50 border border-gray-100 p-2" />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Arduino Micro */}
                            <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                                            <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg"><Cpu size={16} /></div>
                                            🔴 3. Arduino Micro
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">Arduino Micro <strong>ATmega32U4</strong> microcontroller par based hota hai. Ye USB communication ko directly support karta hai aur small-size projects ke liye suitable hota hai.</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                            <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                                                <p className="text-xs font-bold text-purple-800 mb-1">⚡ Features</p>
                                                <ul className="text-xs text-purple-700 space-y-1 ml-4 list-disc marker:text-purple-400">
                                                    <li>Compact design</li>
                                                    <li>USB communication support</li>
                                                    <li>Low power consumption</li>
                                                </ul>
                                            </div>
                                            <div className="bg-fuchsia-50/50 p-3 rounded-xl border border-fuchsia-100">
                                                <p className="text-xs font-bold text-fuchsia-800 mb-1">🛠️ Uses</p>
                                                <ul className="text-xs text-fuchsia-700 space-y-1 ml-4 list-disc marker:text-fuchsia-400">
                                                    <li>Keyboard projects</li>
                                                    <li>Mouse controller</li>
                                                    <li>Portable electronics</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-32 xl:w-40 flex-shrink-0 flex items-center justify-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Arduino Micro" className="w-full h-auto max-w-[150px] object-contain drop-shadow-md rounded-xl bg-gray-50/50 border border-gray-100 p-2" />
                                    </div>
                                </div>
                            </div>

                            {/* 4. Arduino Leonardo */}
                            <div className="p-5 rounded-2xl bg-white border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                                            <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg"><Microchip size={16} /></div>
                                            🔴 4. Arduino Leonardo
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">Arduino Leonardo bhi <strong>ATmega32U4</strong> microcontroller par based board hai. Ye USB communication ko directly handle kar sakta hai.</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                            <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                                                <p className="text-xs font-bold text-rose-800 mb-1">⚡ Features</p>
                                                <ul className="text-xs text-rose-700 space-y-1 ml-4 list-disc marker:text-rose-400">
                                                    <li>USB support</li>
                                                    <li>Easy interfacing</li>
                                                    <li>Stable performance</li>
                                                </ul>
                                            </div>
                                            <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                                                <p className="text-xs font-bold text-orange-800 mb-1">🛠️ Uses</p>
                                                <ul className="text-xs text-orange-700 space-y-1 ml-4 list-disc marker:text-orange-400">
                                                    <li>Human interface devices</li>
                                                    <li>Automation systems</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-32 xl:w-40 flex-shrink-0 flex items-center justify-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Arduino Leonardo" className="w-full h-auto max-w-[150px] object-contain drop-shadow-md rounded-xl bg-gray-50/50 border border-gray-100 p-2" />
                                    </div>
                                </div>
                            </div>

                            {/* 5. Arduino Mega 2560 */}
                            <div className="p-5 rounded-2xl bg-white border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                                            <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg"><Cpu size={16} /></div>
                                            🔴 5. Arduino Mega 2560 Rev 3
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">Arduino Mega advanced projects ke liye use hota hai. Ye <strong>ATmega2560</strong> microcontroller par based hota hai aur isme bahut jyada pins aur memory available hoti hai.</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                                                <p className="text-xs font-bold text-amber-800 mb-1">⚡ Features</p>
                                                <ul className="text-xs text-amber-700 space-y-1 ml-4 list-disc marker:text-amber-400">
                                                    <li>Large memory</li>
                                                    <li>More digital pins</li>
                                                    <li>Multiple serial ports</li>
                                                </ul>
                                            </div>
                                            <div className="bg-yellow-50/50 p-3 rounded-xl border border-yellow-100">
                                                <p className="text-xs font-bold text-yellow-800 mb-1">🛠️ Uses</p>
                                                <ul className="text-xs text-yellow-700 space-y-1 ml-4 list-disc marker:text-yellow-400">
                                                    <li>Robotics</li>
                                                    <li>3D printers</li>
                                                    <li>Large IoT projects</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-32 xl:w-40 flex-shrink-0 flex items-center justify-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Arduino Mega" className="w-full h-auto max-w-[150px] object-contain drop-shadow-md rounded-xl bg-gray-50/50 border border-gray-100 p-2" />
                                    </div>
                                </div>
                            </div>

                            {/* 6. Arduino Due */}
                            <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                                            <div className="p-1.5 bg-sky-100 text-sky-600 rounded-lg"><Cpu size={16} /></div>
                                            🔴 6. Arduino Due
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">Arduino Due ek high-performance board hai jo <strong>ARM Cortex</strong> microcontroller par based hota hai. Ye 32-bit architecture support karta hai aur Arduino Uno se kaafi fast hota hai.</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                            <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-100">
                                                <p className="text-xs font-bold text-sky-800 mb-1">⚡ Features</p>
                                                <ul className="text-xs text-sky-700 space-y-1 ml-4 list-disc marker:text-sky-400">
                                                    <li>32-bit processing</li>
                                                    <li>High speed</li>
                                                    <li>Large memory support</li>
                                                </ul>
                                            </div>
                                            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                                                <p className="text-xs font-bold text-blue-800 mb-1">🛠️ Uses</p>
                                                <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc marker:text-blue-400">
                                                    <li>Advanced automation</li>
                                                    <li>Industrial systems</li>
                                                    <li>Complex embedded projects</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-32 xl:w-40 flex-shrink-0 flex items-center justify-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Arduino Due" className="w-full h-auto max-w-[150px] object-contain drop-shadow-md rounded-xl bg-gray-50/50 border border-gray-100 p-2" />
                                    </div>
                                </div>
                            </div>

                            {/* 7-15 Other Boards */}
                            <h4 className="font-bold text-gray-800 mt-8 mb-4 flex items-center gap-2">🔴 Other Important Arduino Boards</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                {/* 7. LilyPad */}
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row items-center gap-4">
                                    <img src="/sample-assets/placeholder.svg" alt="LilyPad" className="w-24 h-24 object-contain rounded-xl drop-shadow-sm bg-white border border-gray-200 p-1" />
                                    <div className="flex-1 text-center sm:text-left">
                                        <h5 className="font-bold text-gray-800 text-sm mb-1">7. LilyPad Arduino</h5>
                                        <p className="text-xs text-gray-600 mb-2">Specially wearable electronics ke liye design kiya gaya board hai.</p>
                                        <p className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 inline-block px-2 py-1 rounded">Uses: Smart clothes, Wearables</p>
                                    </div>
                                </div>

                                {/* 8. Arduino Bluetooth */}
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row items-center gap-4">
                                    <img src="/sample-assets/placeholder.svg" alt="Arduino Bluetooth" className="w-24 h-24 object-contain rounded-xl drop-shadow-sm bg-white border border-gray-200 p-1" />
                                    <div className="flex-1 text-center sm:text-left">
                                        <h5 className="font-bold text-gray-800 text-sm mb-1">8. Arduino Bluetooth</h5>
                                        <p className="text-xs text-gray-600 mb-2">Wireless communication support karta hai. Bluetooth module inbuilt hota hai.</p>
                                        <p className="text-[10px] font-semibold text-blue-700 bg-blue-50 inline-block px-2 py-1 rounded">Uses: Wireless control systems</p>
                                    </div>
                                </div>

                                {/* 9. Arduino Diecimila */}
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row items-center gap-4">
                                    <img src="/sample-assets/placeholder.svg" alt="Arduino Diecimila" className="w-24 h-24 object-contain rounded-xl drop-shadow-sm bg-white border border-gray-200 p-1" />
                                    <div className="flex-1 text-center sm:text-left">
                                        <h5 className="font-bold text-gray-800 text-sm mb-1">9. Arduino Diecimila</h5>
                                        <p className="text-xs text-gray-600">Old-generation Arduino board hai jo basic embedded projects ke liye use hota tha.</p>
                                    </div>
                                </div>

                                {/* 10. RedBoard */}
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row items-center gap-4">
                                    <img src="/sample-assets/placeholder.svg" alt="RedBoard" className="w-24 h-24 object-contain rounded-xl drop-shadow-sm bg-white border border-gray-200 p-1" />
                                    <div className="flex-1 text-center sm:text-left">
                                        <h5 className="font-bold text-gray-800 text-sm mb-1">10. RedBoard</h5>
                                        <p className="text-xs text-gray-600">Arduino Uno jaisa hi board hota hai jo compatible design provide karta hai.</p>
                                    </div>
                                </div>

                                {/* 11. Arduino Robot */}
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row items-center gap-4">
                                    <img src="/sample-assets/placeholder.svg" alt="Arduino Robot" className="w-24 h-24 object-contain rounded-xl drop-shadow-sm bg-white border border-gray-200 p-1" />
                                    <div className="flex-1 text-center sm:text-left">
                                        <h5 className="font-bold text-gray-800 text-sm mb-1">11. Arduino Robot</h5>
                                        <p className="text-xs text-gray-600 mb-2">Programmable robotic platform for robotics learning and projects.</p>
                                        <p className="text-[10px] font-semibold text-purple-700 bg-purple-50 inline-block px-2 py-1 rounded">Uses: Robotics, Automation</p>
                                    </div>
                                </div>

                                {/* 12. Arduino Esplora */}
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row items-center gap-4">
                                    <img src="/sample-assets/placeholder.svg" alt="Arduino Esplora" className="w-24 h-24 object-contain rounded-xl drop-shadow-sm bg-white border border-gray-200 p-1" />
                                    <div className="flex-1 text-center sm:text-left">
                                        <h5 className="font-bold text-gray-800 text-sm mb-1">12. Arduino Esplora</h5>
                                        <p className="text-xs text-gray-600 mb-2">Special board jisme inbuilt sensors aur joystick available hote hain.</p>
                                        <p className="text-[10px] font-semibold text-pink-700 bg-pink-50 inline-block px-2 py-1 rounded">Uses: Gaming projects, Sensors</p>
                                    </div>
                                </div>

                                {/* 13. Arduino Ethernet */}
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row items-center gap-4">
                                    <img src="/sample-assets/placeholder.svg" alt="Arduino Ethernet" className="w-24 h-24 object-contain rounded-xl drop-shadow-sm bg-white border border-gray-200 p-1" />
                                    <div className="flex-1 text-center sm:text-left">
                                        <h5 className="font-bold text-gray-800 text-sm mb-1">13. Arduino Ethernet</h5>
                                        <p className="text-xs text-gray-600 mb-2">Internet communication support karta hai directly network se connect ho sakta hai.</p>
                                        <p className="text-[10px] font-semibold text-sky-700 bg-sky-50 inline-block px-2 py-1 rounded">Uses: IoT networking, Web servers</p>
                                    </div>
                                </div>

                                {/* 14. Arduino Zero */}
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row items-center gap-4">
                                    <img src="/sample-assets/placeholder.svg" alt="Arduino Zero (Placeholder)" className="w-24 h-24 object-contain rounded-xl drop-shadow-sm bg-white border border-gray-200 p-1" />
                                    <div className="flex-1 text-center sm:text-left">
                                        <h5 className="font-bold text-gray-800 text-sm mb-1">14. Arduino Zero</h5>
                                        <p className="text-xs text-gray-600 mb-2">Modern 32-bit development board hai jo advanced embedded systems ke liye use hota hai.</p>
                                        <p className="text-[10px] font-semibold text-orange-700 bg-orange-50 inline-block px-2 py-1 rounded">Features: Fast processing, Low power</p>
                                    </div>
                                </div>

                                {/* 15. Arduino Pro */}
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all md:col-span-2 flex flex-col sm:flex-row items-center gap-4">
                                    <img src="/sample-assets/placeholder.svg" alt="Arduino Pro (Placeholder)" className="w-24 h-24 object-contain rounded-xl drop-shadow-sm bg-white border border-gray-200 p-1" />
                                    <div className="flex-1 text-center sm:text-left">
                                        <h5 className="font-bold text-gray-800 text-sm mb-1">15. Arduino Pro</h5>
                                        <p className="text-xs text-gray-600 mb-2">Lightweight aur low-power applications ke liye design kiya gaya board hai.</p>
                                        <p className="text-[10px] font-semibold text-rose-700 bg-rose-50 inline-block px-2 py-1 rounded">Uses: Portable systems, Battery-operated devices</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Arduino Uno R3 Deep Dive ═══ */}
                    <Sec id="arduino-uno-deepdive" title="🔴 Arduino Uno R3 Deep Dive" icon={<Cpu size={16} className="text-teal-500" />}>
                        <div className="space-y-6">
                            {/* Intro text */}
                            <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-sm text-gray-700 leading-relaxed mb-3"><strong>Arduino Uno R3</strong> duniya ka sabse popular aur sabse jyada use hone wala Arduino development board hai. Ye specially beginners, students aur IoT developers ke liye design kiya gaya hai taaki electronic projects aur embedded systems ko easily develop kiya ja sake.</p>
                                <p className="text-sm text-gray-700 leading-relaxed mb-3">Ye <strong>ATmega328P microcontroller</strong> par based hota hai aur ye sensors, motors, LEDs aur different electronic modules ko control kar sakta hai. <br/> "R3" ka matlab hota hai "Revision 3", yani Arduino Uno ka upgraded version.</p>
                            </div>

                            {/* Detailed image section */}
                            <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                <img src="/sample-assets/placeholder.svg" alt="Detailed Arduino Uno R3 Pins" className="w-full h-auto rounded-xl shadow-md border border-gray-200" />
                            </div>

                            {/* Main Components Grid */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg"><Box size={16} /></div> 🔹 Main Components of Arduino Uno R3</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl border border-indigo-100 bg-white shadow-sm hover:-translate-y-1 transition-transform">
                                        <h4 className="font-bold text-indigo-900 text-sm mb-2">1. ATmega328P Microcontroller</h4>
                                        <p className="text-xs text-gray-600">Ye Arduino Uno ka main brain hota hai. Iske andar CPU, RAM, ROM, Timers aur Input/Output ports available hote hain. Ye program instructions ko execute karta hai aur poore board ko control karta hai.</p>
                                    </div>
                                    <div className="p-4 rounded-xl border border-indigo-100 bg-white shadow-sm hover:-translate-y-1 transition-transform">
                                        <h4 className="font-bold text-indigo-900 text-sm mb-2">2. USB Port</h4>
                                        <p className="text-xs text-gray-600">USB port ka use Computer se connection, Program upload aur Power supply ke liye hota hai. USB cable ke through Arduino ko directly laptop ya PC se connect kiya jata hai.</p>
                                    </div>
                                    <div className="p-4 rounded-xl border border-indigo-100 bg-white shadow-sm hover:-translate-y-1 transition-transform">
                                        <h4 className="font-bold text-indigo-900 text-sm mb-2">3. DC Power Jack</h4>
                                        <p className="text-xs text-gray-600">Agar USB available na ho to external adapter ya battery se Arduino ko power di ja sakti hai. Usually 7V se 12V tak supply di jati hai.</p>
                                    </div>
                                    <div className="p-4 rounded-xl border border-indigo-100 bg-white shadow-sm hover:-translate-y-1 transition-transform">
                                        <h4 className="font-bold text-indigo-900 text-sm mb-2">4. Reset Button</h4>
                                        <p className="text-xs text-gray-600">Reset button board par uploaded program ko dobara start karta hai. Is button ko press karte hi Arduino fir se beginning se code execute karta hai.</p>
                                    </div>
                                    <div className="p-4 rounded-xl border border-indigo-100 bg-white shadow-sm hover:-translate-y-1 transition-transform md:col-span-2">
                                        <h4 className="font-bold text-indigo-900 text-sm mb-2">5. Crystal Oscillator & Voltage Regulator</h4>
                                        <p className="text-xs text-gray-600 flex flex-col sm:flex-row gap-4">
                                            <span className="flex-1"><strong className="text-indigo-700">Crystal Oscillator:</strong> 16 MHz ka hota hai, ye clock signals generate karta hai jisse microcontroller ki processing speed control hoti hai.</span>
                                            <span className="flex-1"><strong className="text-indigo-700">Voltage Regulator:</strong> Incoming voltage ko stable banata hai taaki board safe rahe aur proper voltage receive kare.</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Tech Specs Table */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><Settings size={16} /></div> 🔴 Technical Specifications</h3>
                                <div className="overflow-x-auto rounded-xl border border-emerald-200 shadow-sm">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-emerald-800 uppercase bg-emerald-100/50 border-b border-emerald-200">
                                            <tr>
                                                <th className="px-6 py-3 font-bold">Feature</th>
                                                <th className="px-6 py-3 font-bold">Details</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-emerald-50">
                                            <tr className="hover:bg-emerald-50/50 transition-colors"><td className="px-6 py-3 font-semibold text-gray-800">Microcontroller</td><td className="px-6 py-3 text-gray-700">ATmega328P</td></tr>
                                            <tr className="hover:bg-emerald-50/50 transition-colors"><td className="px-6 py-3 font-semibold text-gray-800">Operating Voltage</td><td className="px-6 py-3 text-gray-700">5V</td></tr>
                                            <tr className="hover:bg-emerald-50/50 transition-colors"><td className="px-6 py-3 font-semibold text-gray-800">Input Voltage</td><td className="px-6 py-3 text-gray-700">7V – 12V</td></tr>
                                            <tr className="hover:bg-emerald-50/50 transition-colors"><td className="px-6 py-3 font-semibold text-gray-800">Digital I/O Pins</td><td className="px-6 py-3 text-gray-700">14 (including 6 PWM pins)</td></tr>
                                            <tr className="hover:bg-emerald-50/50 transition-colors"><td className="px-6 py-3 font-semibold text-gray-800">Analog Input Pins</td><td className="px-6 py-3 text-gray-700">6 (A0 - A5)</td></tr>
                                            <tr className="hover:bg-emerald-50/50 transition-colors"><td className="px-6 py-3 font-semibold text-gray-800">Flash Memory</td><td className="px-6 py-3 text-gray-700">32 KB</td></tr>
                                            <tr className="hover:bg-emerald-50/50 transition-colors"><td className="px-6 py-3 font-semibold text-gray-800">SRAM & EEPROM</td><td className="px-6 py-3 text-gray-700">2 KB (SRAM) | 1 KB (EEPROM)</td></tr>
                                            <tr className="hover:bg-emerald-50/50 transition-colors"><td className="px-6 py-3 font-semibold text-gray-800">Clock Speed</td><td className="px-6 py-3 text-gray-700">16 MHz</td></tr>
                                            <tr className="hover:bg-emerald-50/50 transition-colors"><td className="px-6 py-3 font-semibold text-gray-800">USB Connection</td><td className="px-6 py-3 text-gray-700">USB Type-B</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pins of Arduino Uno R3 */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg"><Zap size={16} /></div> 🔴 Pins of Arduino Uno R3</h3>
                                <div className="space-y-4">
                                    <div className="bg-white p-5 rounded-xl border border-rose-100 shadow-sm">
                                        <h4 className="font-bold text-rose-800 text-base mb-2">1. Digital Pins (0–13)</h4>
                                        <p className="text-sm text-gray-700 mb-3">Total 14 digital pins (0-13) hoti hain jo <strong>Input ya Output mode</strong> dono me kaam kar sakti hain. Input mode me sensor data read karti hain aur Output mode me LED, motor aadi control karti hain.</p>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <span className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-semibold">0 (RX): Receive Data</span>
                                            <span className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-semibold">1 (TX): Transmit Data</span>
                                            <span className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-semibold">13: Built-in LED</span>
                                            <span className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-semibold">10-13: SPI Communication</span>
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm">
                                        <h4 className="font-bold text-orange-800 text-base mb-2">2. PWM Pins (3, 5, 6, 9, 10, 11)</h4>
                                        <p className="text-sm text-gray-700 mb-3">PWM (Pulse Width Modulation) pins analog-like output generate karti hain. Inka use LED brightness control, motor speed control, aur servo control me hota hai.</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm">
                                        <h4 className="font-bold text-amber-800 text-base mb-2">3. Analog Pins (A0–A5)</h4>
                                        <p className="text-sm text-gray-700 mb-3">Total 6 analog input pins hoti hain jo analog signals ko read karti hain (jaise Temperature sensor, LDR, Gas sensor, Potentiometer). Arduino ka ADC (Analog to Digital Converter) is signal ko digital value (0–1023) me convert karta hai.</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-teal-100 shadow-sm">
                                        <h4 className="font-bold text-teal-800 text-base mb-3">4. Power Pins & Communication Protocols</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="bg-teal-50 p-3 rounded-lg border border-teal-100">
                                                <p className="text-sm font-extrabold text-teal-900 mb-2">⚡ Power Pins</p>
                                                <ul className="text-sm text-teal-800 space-y-1.5 list-disc ml-5 font-medium">
                                                    <li><strong>VIN:</strong> External voltage input</li>
                                                    <li><strong>5V / 3.3V:</strong> Output voltages for sensors</li>
                                                    <li><strong>GND:</strong> Ground (0V)</li>
                                                    <li><strong>RESET:</strong> Reset pin</li>
                                                </ul>
                                            </div>
                                            <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-100">
                                                <p className="text-sm font-extrabold text-cyan-900 mb-2">📡 Communication Protocols</p>
                                                <ul className="text-sm text-cyan-800 space-y-1.5 list-disc ml-5 font-medium">
                                                    <li><strong>UART:</strong> Serial Communication (RX, TX)</li>
                                                    <li><strong>SPI:</strong> Fast Communication (Pins 10,11,12,13)</li>
                                                    <li><strong>I2C:</strong> 2-wire Protocol (SDA: A4, SCL: A5)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Memory & Conclusion */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-5 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-fuchsia-50 shadow-sm">
                                    <h4 className="font-bold text-purple-900 text-base mb-4 flex items-center gap-2"><Microchip size={18} className="text-purple-600"/> Memory Storage</h4>
                                    <ul className="space-y-3">
                                        <li className="bg-white/80 p-3 rounded-lg border border-purple-100 shadow-sm text-sm">
                                            <strong className="text-purple-800 block mb-0.5">Flash Memory (32 KB)</strong>
                                            <span className="text-gray-600">Program code store karne ke liye use hoti hai.</span>
                                        </li>
                                        <li className="bg-white/80 p-3 rounded-lg border border-purple-100 shadow-sm text-sm">
                                            <strong className="text-purple-800 block mb-0.5">SRAM (2 KB)</strong>
                                            <span className="text-gray-600">Temporary data storage ke liye use hoti hai.</span>
                                        </li>
                                        <li className="bg-white/80 p-3 rounded-lg border border-purple-100 shadow-sm text-sm">
                                            <strong className="text-purple-800 block mb-0.5">EEPROM (1 KB)</strong>
                                            <span className="text-gray-600">Permanent data storage ke liye use hoti hai.</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="p-5 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 md:col-span-2 shadow-sm flex flex-col justify-center">
                                    <h4 className="font-bold text-blue-900 text-lg mb-3 flex items-center gap-2"><Sparkles size={20} className="text-blue-600"/> Final Understanding</h4>
                                    <p className="text-sm text-gray-800 leading-relaxed mb-4 font-medium">
                                        Arduino Uno R3 ek complete development board hai jo sensors read karta hai, data process karta hai aur output devices ko control karta hai. Isme ATmega328P microcontroller, Digital pins, Analog pins, PWM support aur Communication protocols sab available hote hain.
                                    </p>
                                    <div>
                                        <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-2">🔥 Top Applications:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Home automation', 'Smart lighting system', 'Robotics', 'IoT projects', 'Security systems', 'Weather monitoring', 'Smart agriculture'].map((app, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-white border border-blue-200 hover:border-blue-300 rounded-lg text-xs font-bold text-blue-700 shadow-sm transition-colors">{app}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Arduino Shield ═══ */}
                    <Sec id="arduino-shield" title="🔴 Arduino Shield" icon={<Shield size={16} className="text-red-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center mb-6">
                            <div className="flex-1 space-y-3">
                                <Def>Arduino shield ek additional board hota hai jo Arduino board ke upar directly attach kiya jata hai taaki Arduino ki functionality ko increase kiya ja sake.</Def>
                                <IB type="tip"><strong>Simple words me:</strong> "Shield = Arduino ka extension board"</IB>
                                <p>Shield ki madad se Arduino me naye features aur capabilities add ki jati hain bina extra complex wiring ke. Ye directly Arduino Uno ya doosre compatible boards ke pins par connect hota hai.</p>
                                <p className="text-sm">Ye board <strong>Power pins</strong>, <strong>Communication pins</strong> aur <strong>Digital/Analog pins</strong> ka use karke additional functions perform karta hai.</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Arduino Shield" className="w-full h-auto rounded-2xl shadow-md border border-gray-100" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                                <h4 className="font-bold text-gray-800 text-sm mb-2">⚡ Features of Arduino Shield</h4>
                                <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc marker:text-gray-400">
                                    <li>Easy installation</li>
                                    <li>Plug and play support</li>
                                    <li>Additional functionality</li>
                                    <li>Sensor aur module support</li>
                                    <li>Fast development</li>
                                </ul>
                            </div>
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                <h4 className="font-bold text-emerald-800 text-sm mb-2">✅ Advantages</h4>
                                <ul className="text-sm text-emerald-700 space-y-1 ml-4 list-disc marker:text-emerald-400">
                                    <li>Wiring complexity kam hoti hai</li>
                                    <li>Development fast hota hai</li>
                                    <li>Multiple features easily add kiye ja sakte hain</li>
                                    <li>Beginners ke liye easy hota hai</li>
                                </ul>
                            </div>
                        </div>

                        <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2"><Layers size={20} className="text-red-500" /> Types of Arduino Shields</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                <h5 className="font-bold text-blue-900 text-sm mb-1">1. Ethernet Shield</h5>
                                <p className="text-xs text-gray-600 mb-2">Internet aur network communication ke liye use hota hai.</p>
                                <p className="text-[11px] font-semibold text-blue-700"><span className="text-blue-600">Uses:</span> IoT networking, Web server projects</p>
                            </div>
                            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                                <h5 className="font-bold text-orange-900 text-sm mb-1">2. Motor Shield</h5>
                                <p className="text-xs text-gray-600 mb-2">Motors ko control karne ke liye use hota hai.</p>
                                <p className="text-[11px] font-semibold text-orange-700"><span className="text-orange-700">Uses:</span> Robotics, Automation systems</p>
                            </div>
                            <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-100 shadow-sm hover:shadow-md transition-shadow">
                                <h5 className="font-bold text-cyan-900 text-sm mb-1">3. WiFi Shield</h5>
                                <p className="text-xs text-gray-600 mb-2">Arduino ko wireless internet se connect karne ke liye use hota hai.</p>
                                <p className="text-[11px] font-semibold text-cyan-700"><span className="text-cyan-700">Uses:</span> Smart home systems, IoT communication</p>
                            </div>
                            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                                <h5 className="font-bold text-indigo-900 text-sm mb-1">4. GSM Shield</h5>
                                <p className="text-xs text-gray-600 mb-2">Mobile network communication provide karta hai.</p>
                                <p className="text-[11px] font-semibold text-indigo-700"><span className="text-indigo-600">Uses:</span> SMS sending, Remote monitoring</p>
                            </div>
                            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                <h5 className="font-bold text-purple-900 text-sm mb-1">5. Bluetooth Shield</h5>
                                <p className="text-xs text-gray-600 mb-2">Bluetooth communication ke liye use hota hai.</p>
                                <p className="text-[11px] font-semibold text-purple-700"><span className="text-purple-600">Uses:</span> Wireless control system, Mobile connectivity</p>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Arduino IDE Deep Dive ═══ */}
                    <Sec id="arduino-ide-deepdive" title="🔹 Introduction to Arduino IDE" icon={<Monitor size={16} className="text-purple-500" />}>
                        <p className="mb-4 text-sm text-gray-700">Arduino IDE (Integrated Development Environment) ek software platform hai jiska use Arduino board ko program karne ke liye kiya jata hai. Ye software user ko code likhne, compile karne aur Arduino board me upload karne ki facility provide karta hai. Arduino IDE ka interface simple aur user-friendly hota hai jiski wajah se beginners bhi easily programming kar sakte hain.</p>
                        
                        <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2"><Menu size={20} className="text-purple-500" /> Main Components / Menus of Arduino IDE</h4>
                        
                        <div className="space-y-4">
                            {/* File Menu */}
                            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                                <h5 className="font-bold text-gray-900 mb-2">🔴 1. File Menu</h5>
                                <p className="text-sm text-gray-600 mb-3">File menu ka use files aur projects ko manage karne ke liye kiya jata hai. Is menu me new sketch create karna, old sketch open karna aur files save karna jaise options available hote hain.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <p className="text-sm font-semibold text-gray-800">New (Ctrl + N)</p>
                                        <p className="text-xs text-gray-600">Naya sketch/program create karne ke liye use hota hai.</p>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <p className="text-sm font-semibold text-gray-800">Open (Ctrl + O)</p>
                                        <p className="text-xs text-gray-600">Pehle se saved Arduino sketch ko open karne ke liye use hota hai.</p>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <p className="text-sm font-semibold text-gray-800">Save (Ctrl + S)</p>
                                        <p className="text-xs text-gray-600">Current sketch ko save karne ke liye use hota hai.</p>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <p className="text-sm font-semibold text-gray-800">Save As</p>
                                        <p className="text-xs text-gray-600">Existing file ko naye naam se save karne ke liye use hota hai.</p>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <p className="text-sm font-semibold text-gray-800">Examples</p>
                                        <p className="text-xs text-gray-600">Arduino IDE me already available sample programs (Blink LED) ko open karne ke liye.</p>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <p className="text-sm font-semibold text-gray-800">Preferences</p>
                                        <p className="text-xs text-gray-600">IDE settings change karne ke liye use hota hai (Theme, Font size).</p>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Menu */}
                            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                                <h5 className="font-bold text-gray-900 mb-2">🔴 2. Edit Menu</h5>
                                <p className="text-sm text-gray-600 mb-3">Edit menu ka use code editing ke liye hota hai. Is menu me text editing aur code formatting ke options available hote hain.</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-semibold">Undo (Ctrl + Z)</span>
                                    <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-semibold">Redo (Ctrl + Y)</span>
                                    <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-semibold">Cut (Ctrl + X)</span>
                                    <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-semibold">Copy (Ctrl + C)</span>
                                    <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-semibold">Paste (Ctrl + V)</span>
                                    <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-semibold">Select All (Ctrl + A)</span>
                                </div>
                            </div>

                            {/* Sketch Menu */}
                            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                                <h5 className="font-bold text-gray-900 mb-2">🔴 3. Sketch Menu</h5>
                                <p className="text-sm text-gray-600 mb-3">Sketch menu program compiling aur library management ke liye use hota hai.</p>
                                <ul className="text-sm text-gray-600 space-y-2 ml-4 list-disc marker:text-purple-400">
                                    <li><strong>Verify / Compile (Ctrl + R):</strong> Program me errors check karta hai aur code ko compile karta hai.</li>
                                    <li><strong>Upload (Ctrl + U):</strong> Compiled code ko Arduino board me upload karta hai.</li>
                                    <li><strong>Include Library:</strong> External libraries ko add karne ke liye use hota hai. Libraries sensors aur modules ko easily use karne me help karti hain.</li>
                                </ul>
                            </div>

                            {/* Tools & Help Menu */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                                    <h5 className="font-bold text-gray-900 mb-2">🔴 4. Tools Menu</h5>
                                    <ul className="text-sm text-gray-600 space-y-2 ml-4 list-disc marker:text-purple-400">
                                        <li><strong>Board:</strong> Arduino board select karne ke liye (e.g., Uno, Mega, Nano).</li>
                                        <li><strong>Port:</strong> COM port select karne ke liye jahan Arduino connected hota hai.</li>
                                        <li><strong>Programmer:</strong> Programming method select karne ke liye.</li>
                                        <li><strong>Serial Monitor (Ctrl + Shift + M):</strong> Arduino aur computer ke beech serial communication display karta hai.</li>
                                    </ul>
                                </div>
                                <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                                    <h5 className="font-bold text-gray-900 mb-2">🔴 5. Help Menu</h5>
                                    <ul className="text-sm text-gray-600 space-y-2 ml-4 list-disc marker:text-purple-400">
                                        <li>Documentation access</li>
                                        <li>Troubleshooting</li>
                                        <li>Reference material</li>
                                        <li>Software information</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                                <h5 className="font-bold text-gray-800 text-sm mb-1">Toolbar</h5>
                                <p className="text-xs text-gray-600">Quick-access buttons (Verify, Upload, New, Open, Save, Serial Monitor).</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                                <h5 className="font-bold text-gray-800 text-sm mb-1">Text Editor Area</h5>
                                <p className="text-xs text-gray-600">Main coding area jahan variables, functions, logic likhe jate hain.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                                <h5 className="font-bold text-gray-800 text-sm mb-1">Message & Console</h5>
                                <p className="text-xs text-gray-600">Errors, warnings, successful messages aur compilation process show karta hai.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                                <h5 className="font-bold text-gray-800 text-sm mb-1">Status Bar</h5>
                                <p className="text-xs text-gray-600">Selected board, COM port, aur IDE status show karta hai.</p>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Arduino Library ═══ */}
                    <Sec id="arduino-library" title="🔴 Arduino Library" icon={<BookOpen size={16} className="text-fuchsia-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center mb-6">
                            <div className="flex-1 space-y-3">
                                <p>Arduino library ek pre-written code collection hoti hai jo programming ko easy banati hai. Library me already functions aur commands available hote hain jinki help se sensors, displays, motors aur modules ko easily control kiya ja sakta hai.</p>
                                <IB type="tip"><strong>Simple words me:</strong> "Library = ready-made code collection"</IB>
                                <p>Arduino libraries programmer ka time bachati hain aur complex coding ko simple bana deti hain.</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Arduino Library" className="w-full h-auto rounded-2xl shadow-md border border-gray-100" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                                <h4 className="font-bold text-blue-900 text-sm mb-2">⚡ Working of Arduino Library</h4>
                                <p className="text-sm text-gray-700 mb-2">Jab kisi sensor ya module ko Arduino ke saath use karna hota hai to uske liye related library include ki jati hai. Library include karne ke baad:</p>
                                <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc marker:text-blue-400">
                                    <li>Ready-made functions available ho jate hain</li>
                                    <li>Hardware ko easily control kiya ja sakta hai</li>
                                </ul>
                            </div>
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                <h4 className="font-bold text-emerald-800 text-sm mb-2">✅ Advantages of Arduino Library</h4>
                                <ul className="text-sm text-emerald-700 space-y-1 ml-4 list-disc marker:text-emerald-400">
                                    <li>Coding easy ho jati hai</li>
                                    <li>Time saving hota hai</li>
                                    <li>Errors kam hote hain</li>
                                    <li>Complex devices ko easily use kiya ja sakta hai</li>
                                </ul>
                            </div>
                        </div>

                        <h4 className="font-bold text-gray-800 mb-3 text-lg">📌 Examples of Arduino Libraries</h4>
                        <div className="overflow-x-auto mb-6">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-fuchsia-50 text-fuchsia-900 border-b border-fuchsia-200">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Library</th>
                                        <th className="px-4 py-3 font-semibold">Use</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">Servo Library</td>
                                        <td className="px-4 py-3 text-gray-600">Servo motor control</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">LiquidCrystal</td>
                                        <td className="px-4 py-3 text-gray-600">LCD display control</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">WiFi Library</td>
                                        <td className="px-4 py-3 text-gray-600">WiFi communication</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">EEPROM Library</td>
                                        <td className="px-4 py-3 text-gray-600">EEPROM memory access</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="font-bold text-gray-800 text-sm mb-2">🛠️ How to Include Library</h4>
                            <p className="text-sm text-gray-600 mb-2">Arduino IDE me library include karne ke liye:</p>
                            <code className="px-3 py-1.5 bg-white text-purple-700 rounded-lg text-sm font-semibold border border-gray-200 shadow-sm block w-max">Sketch → Include Library</code>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Input and Output Pin ═══ */}
                    <Sec id="arduino-pins" title="🔴 Making Input and Output Pin" icon={<ToggleLeft size={16} className="text-sky-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center mb-6">
                            <div className="flex-1 space-y-3">
                                <p>Arduino me pins ko input ya output mode me configure kiya jata hai. Pin mode decide karta hai ki pin data receive karegi ya data send karegi.</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Arduino Pins" className="w-full h-auto rounded-2xl shadow-md border border-gray-100" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-blue-200 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">Input</div>
                                <h4 className="font-bold text-blue-900 text-base mb-2">📥 Input Pin</h4>
                                <p className="text-sm text-gray-700 mb-3">Input pin external devices se data receive karti hai.</p>
                                <p className="text-xs font-semibold text-blue-800 mb-1">👉 Examples:</p>
                                <ul className="text-sm text-blue-700 space-y-1 ml-4 list-disc marker:text-blue-400 mb-3">
                                    <li>Sensor input</li>
                                    <li>Push button input</li>
                                </ul>
                                <div className="bg-white/80 p-3 rounded-lg border border-blue-100">
                                    <p className="text-xs font-bold text-blue-900 mb-1">⚡ Working:</p>
                                    <p className="text-xs text-gray-600">Input mode me Arduino voltage signal ko read karta hai aur HIGH ya LOW value detect karta hai.</p>
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-rose-200 text-rose-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">Output</div>
                                <h4 className="font-bold text-rose-900 text-base mb-2">📤 Output Pin</h4>
                                <p className="text-sm text-gray-700 mb-3">Output pin external devices ko signal bhejti hai.</p>
                                <p className="text-xs font-semibold text-rose-800 mb-1">👉 Examples:</p>
                                <ul className="text-sm text-rose-700 space-y-1 ml-4 list-disc marker:text-rose-400 mb-3">
                                    <li>LED control</li>
                                    <li>Motor control</li>
                                    <li>Buzzer control</li>
                                </ul>
                                <div className="bg-white/80 p-3 rounded-lg border border-rose-100">
                                    <p className="text-xs font-bold text-rose-900 mb-1">⚡ Working:</p>
                                    <p className="text-xs text-gray-600">Output mode me Arduino HIGH (5V) ya LOW (0V) signal provide karta hai.</p>
                                </div>
                            </div>
                        </div>

                        <h4 className="font-bold text-gray-800 mb-3 text-lg">📌 pinMode() Function</h4>
                        <div className="space-y-4">
                            <p className="text-sm">Arduino me pins ko configure karne ke liye <code>pinMode()</code> function use hota hai.</p>
                            
                            <div className="bg-gray-900 text-gray-100 p-4 rounded-xl shadow-inner font-mono text-sm overflow-x-auto">
                                <p className="text-gray-400 mb-1 text-xs">// Syntax</p>
                                <div><span className="text-orange-400">pinMode</span>(pin, mode);</div>
                                
                                <p className="text-gray-400 mt-4 mb-1 text-xs">// Examples</p>
                                <div><span className="text-orange-400">pinMode</span>(<span className="text-purple-400">13</span>, <span className="text-sky-400">OUTPUT</span>); <span className="text-gray-400">// Pin 13 ko output mode me set karta hai</span></div>
                                <div className="mt-2"><span className="text-orange-400">pinMode</span>(<span className="text-purple-400">2</span>, <span className="text-sky-400">INPUT</span>); <span className="text-gray-400">// Pin 2 ko input mode me set karta hai</span></div>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Select the Board ═══ */}
                    <Sec id="arduino-select-board" title="🔴 How to Select the Board" icon={<MousePointerClick size={16} className="text-amber-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center mb-6">
                            <div className="flex-1 space-y-3">
                                <p>Arduino IDE me program upload karne se pehle correct Arduino board select karna bahut important hota hai. Agar wrong board select ho jaye to code upload nahi hoga ya errors aa sakte hain.</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Select Arduino Board" className="w-full h-auto rounded-2xl shadow-md border border-gray-100" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                                <h4 className="font-bold text-gray-800 text-sm mb-3">🛠️ Steps to Select Board</h4>
                                <ul className="text-sm text-gray-600 space-y-3">
                                    <li className="flex items-start gap-2">
                                        <span className="w-5 h-5 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full text-xs font-bold shrink-0 mt-0.5">1</span>
                                        <span>Arduino IDE open kare</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-5 h-5 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full text-xs font-bold shrink-0 mt-0.5">2</span>
                                        <div>
                                            <span>Menu bar me:</span>
                                            <div className="mt-1"><code className="px-2 py-1 bg-gray-100 text-purple-700 rounded text-xs font-semibold border border-gray-200">Tools → Board</code> select kare</div>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-5 h-5 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full text-xs font-bold shrink-0 mt-0.5">3</span>
                                        <div>
                                            <span>Required board choose kare</span>
                                            <p className="text-xs text-gray-500 mt-1">👉 Example: Arduino Uno, Arduino Mega, Arduino Nano</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                                <h4 className="font-bold text-amber-900 text-sm mb-3">❓ Why Board Selection Important</h4>
                                <p className="text-sm text-gray-700 mb-2">Board selection se IDE ko pata chalta hai:</p>
                                <ul className="text-sm text-amber-800 space-y-1 ml-4 list-disc marker:text-amber-400">
                                    <li>Kaunsa microcontroller use ho raha hai</li>
                                    <li>Kitni memory available hai</li>
                                    <li>Kaunsi upload settings use hongi</li>
                                </ul>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Writing and Editing Codes ═══ */}
                    <Sec id="arduino-sketch-edit" title="🔴 Writing and Editing Codes in Sketch" icon={<FileCode2 size={16} className="text-emerald-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center mb-6">
                            <div className="flex-1 space-y-3">
                                <Def>Arduino program ko “Sketch” kaha jata hai. Sketch ek source code file hoti hai jisme program instructions likhi jati hain.</Def>
                                <p>Arduino IDE me code text editor area me likha aur edit kiya jata hai.</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Editing Arduino Sketch" className="w-full h-auto rounded-2xl shadow-md border border-gray-100" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-emerald-300 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3"><FileCode2 size={16} /></div>
                                <h5 className="font-bold text-gray-800 text-sm mb-2">Writing Code</h5>
                                <p className="text-xs text-gray-600">User variables declare karta hai, functions likhta hai, aur logic create karta hai.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-blue-300 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3"><Monitor size={16} /></div>
                                <h5 className="font-bold text-gray-800 text-sm mb-2">Editing Code</h5>
                                <p className="text-xs text-gray-600">Code ko modify karne ke liye Copy, Paste, Undo, aur Redo jaise editing options available hote hain.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-purple-300 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3"><Shield size={16} /></div>
                                <h5 className="font-bold text-gray-800 text-sm mb-2">Verify / Compile</h5>
                                <p className="text-xs text-gray-600">Code likhne ke baad <code>Verify</code> button press karke errors check kiye jate hain.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-orange-300 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mb-3"><Zap size={16} /></div>
                                <h5 className="font-bold text-gray-800 text-sm mb-2">Uploading Code</h5>
                                <p className="text-xs text-gray-600">Compile successful hone ke baad <code>Upload</code> button se program Arduino board me upload kiya jata hai.</p>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Sketch Structure ═══ */}
                    <Sec id="arduino-sketch-structure" title="🔴 Arduino Sketch Structure" icon={<Braces size={16} className="text-purple-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center mb-6">
                            <div className="flex-1 space-y-3">
                                <p>Arduino program mainly do important functions par based hota hai:</p>
                                <ol className="text-sm text-gray-800 font-semibold space-y-1 ml-5 list-decimal marker:text-purple-500">
                                    <li><code>setup()</code></li>
                                    <li><code>loop()</code></li>
                                </ol>
                                
                                <div className="bg-gray-900 text-gray-100 p-4 rounded-xl shadow-inner font-mono text-sm mt-3">
                                    <p className="text-gray-400 mb-1 text-xs">// Basic Structure of Arduino Sketch</p>
                                    <div><span className="text-orange-400">void</span> <span className="text-sky-400">setup</span>()</div>
                                    <div>{'{'}</div>
                                    <div className="ml-4 text-gray-400">// Initialization code</div>
                                    <div>{'}'}</div>
                                    <br/>
                                    <div><span className="text-orange-400">void</span> <span className="text-sky-400">loop</span>()</div>
                                    <div>{'{'}</div>
                                    <div className="ml-4 text-gray-400">// Main program code</div>
                                    <div>{'}'}</div>
                                </div>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Arduino Sketch Structure" className="w-full h-auto rounded-2xl shadow-md border border-gray-100" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                                <h4 className="font-bold text-purple-900 text-base mb-2 font-mono">setup() Function</h4>
                                <p className="text-sm text-gray-700 mb-3">Ye function sirf ek baar execute hota hai jab Arduino start hota hai ya Reset hota hai.</p>
                                <p className="text-xs font-bold text-purple-800 mb-1">⚡ Uses:</p>
                                <ul className="text-sm text-purple-800 space-y-1 ml-4 list-disc marker:text-purple-400 mb-4">
                                    <li>Pin mode define karna</li>
                                    <li>Serial communication start karna</li>
                                    <li>Initial settings configure karna</li>
                                </ul>
                                <div className="bg-white/80 p-3 rounded-lg border border-purple-100 font-mono text-xs text-gray-800">
                                    <div className="text-gray-500 mb-1">// Example</div>
                                    <div><span className="text-purple-600">void</span> <span className="text-blue-600">setup</span>() {'{'}</div>
                                    <div className="ml-4"><span className="text-orange-600">pinMode</span>(<span className="text-blue-600">13</span>, OUTPUT);</div>
                                    <div>{'}'}</div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                                <h4 className="font-bold text-sky-900 text-base mb-2 font-mono">loop() Function</h4>
                                <p className="text-sm text-gray-700 mb-3">Ye function continuously repeat hota rehta hai jab tak Arduino ON rehta hai. Isme main logic aur repeated tasks likhe jate hain.</p>
                                <p className="text-xs font-bold text-sky-800 mb-1">⚡ Uses:</p>
                                <ul className="text-sm text-sky-800 space-y-1 ml-4 list-disc marker:text-sky-400 mb-4">
                                    <li>LED blinking</li>
                                    <li>Sensor reading</li>
                                    <li>Motor control</li>
                                </ul>
                                <div className="bg-white/80 p-3 rounded-lg border border-sky-100 font-mono text-xs text-gray-800">
                                    <div className="text-gray-500 mb-1">// Example</div>
                                    <div><span className="text-purple-600">void</span> <span className="text-blue-600">loop</span>() {'{'}</div>
                                    <div className="ml-4"><span className="text-orange-600">digitalWrite</span>(<span className="text-blue-600">13</span>, HIGH);</div>
                                    <div>{'}'}</div>
                                </div>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: What is Function ═══ */}
                    <Sec id="what-is-function" title="🔴 What is Function" icon={<Cog size={16} className="text-red-500" />}>
                        <Def>🔧 <strong>Function</strong> ek block of code hota hai jo kisi specific task ko perform karne ke liye use kiya jata hai.</Def>
                        <p>Program me jab same task ko baar-baar perform karna ho to function ka use kiya jata hai. Isse code <strong>reusable</strong> aur <strong>easy</strong> ho jata hai.</p>
                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', border: '1px solid #fca5a5' }}>
                            <p className="text-sm font-bold text-red-800">👉 &quot;Function = instructions ka group jo ek specific kaam karta hai&quot;</p>
                        </div>

                        <h4 className="font-bold mt-5 mb-3 text-gray-800">🔹 Features / Points of Function</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                            <div className="p-4 rounded-2xl" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                                <h5 className="font-bold text-emerald-700 mb-2 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-black">1</span> Reusability</h5>
                                <p className="text-xs text-emerald-800">Ek function ko baar-baar call kiya ja sakta hai. Isse same code ko repeatedly likhne ki zarurat nahi padti.</p>
                            </div>
                            <div className="p-4 rounded-2xl" style={{ background: '#eff6ff', border: '1px solid #93c5fd' }}>
                                <h5 className="font-bold text-blue-700 mb-2 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center font-black">2</span> Modularity</h5>
                                <p className="text-xs text-blue-800">Function program ko small-small parts me divide karta hai. Isse program samajhna aur manage karna easy ho jata hai.</p>
                            </div>
                            <div className="p-4 rounded-2xl" style={{ background: '#fefce8', border: '1px solid #fde047' }}>
                                <h5 className="font-bold text-yellow-700 mb-2 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-yellow-700 text-white text-xs flex items-center justify-center font-black">3</span> Reduces Complexity</h5>
                                <p className="text-xs text-yellow-800">Large program ko simple aur organized banata hai. Program ki readability improve hoti hai.</p>
                            </div>
                            <div className="p-4 rounded-2xl" style={{ background: '#fdf2f8', border: '1px solid #f9a8d4' }}>
                                <h5 className="font-bold text-pink-700 mb-2 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-pink-700 text-white text-xs flex items-center justify-center font-black">4</span> Easy Debugging</h5>
                                <p className="text-xs text-pink-800">Agar error aaye to specific function ko check karke error easily find kiya ja sakta hai.</p>
                            </div>
                        </div>
                        <IB type="tip">Functions ka use karke program ko <strong>clean, reusable aur easy to debug</strong> banaya ja sakta hai!</IB>
                    </Sec>

                    {/* ═══ SECTION: Embedded C Language ═══ */}
                    <Sec id="embedded-c" title="🔴 Embedded C Language" icon={<Cpu size={16} className="text-sky-500" />}>
                        <Def>💻 <strong>Embedded C</strong> ek programming language hai jo embedded systems aur microcontrollers ko program karne ke liye use hoti hai.</Def>
                        <p>Ye C language ka <strong>extended version</strong> hota hai jisme hardware control aur low-level programming features available hote hain.</p>

                        <h4 className="font-bold mt-4 mb-3 text-gray-800">👉 Embedded C ka use kahan hota hai?</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
                            {[{ emoji: '🔵', t: 'Arduino' }, { emoji: '🖥️', t: 'Microcontroller' }, { emoji: '🤖', t: 'Robotics' }, { emoji: '🌐', t: 'IoT Systems' }].map((item, i) => (
                                <div key={i} className="p-3 rounded-xl text-center hover:scale-105 transition-transform" style={{ background: '#ecfeff', border: '1px solid #67e8f9' }}>
                                    <div className="text-2xl mb-1">{item.emoji}</div>
                                    <h5 className="font-bold text-xs text-sky-700">{item.t}</h5>
                                </div>
                            ))}
                        </div>

                        <h4 className="font-bold mt-5 mb-3 text-gray-800">🔹 Features of Embedded C</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                            {[
                                { emoji: '⚡', t: 'Fast Execution', d: 'Code bahut tezi se execute hota hai', c: '#ef4444' },
                                { emoji: '🔧', t: 'Hardware Control', d: 'Direct hardware ko control kar sakte hain', c: '#8b5cf6' },
                                { emoji: '💾', t: 'Low Memory Usage', d: 'Kam memory mein bhi chalta hai', c: '#10b981' },
                                { emoji: '⏱️', t: 'Real-time Support', d: 'Real-time programming possible hai', c: '#f97316' },
                                { emoji: '🔄', t: 'Portable Language', d: 'Different platforms par chal sakta hai', c: '#0ea5e9' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${item.c}08`, border: `1px solid ${item.c}25` }}>
                                    <span className="text-xl">{item.emoji}</span>
                                    <div>
                                        <h5 className="font-bold text-sm" style={{ color: item.c }}>{item.t}</h5>
                                        <p className="text-xs text-gray-500">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <IB type="note">Embedded C ka use karke hum <strong>microcontrollers aur IoT devices</strong> ko smart bana sakte hain!</IB>
                    </Sec>

                    {/* ═══ SECTION: Variables ═══ */}
                    <Sec id="variables" title="🔴 Variables" icon={<Tag size={16} className="text-amber-500" />}>
                        <Def>📦 <strong>Variable</strong> ek memory location hoti hai jiska use data store karne ke liye kiya jata hai.</Def>
                        <p>Program execution ke dauran variable ki value <strong>change ho sakti hai</strong>.</p>
                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', border: '1px solid #fde68a' }}>
                            <p className="text-sm font-bold text-amber-800">👉 &quot;Variable = data store karne ka naam&quot;</p>
                        </div>

                        <h4 className="font-bold mt-4 mb-3 text-gray-800">🔹 Example</h4>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-xl shadow-inner font-mono text-sm">
                            <div><span className="text-orange-400">int</span> <span className="text-sky-400">a</span> = <span className="text-green-400">10</span>;</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="p-3 rounded-xl text-center" style={{ background: '#eff6ff', border: '1px solid #93c5fd' }}>
                                <p className="text-xs text-blue-700"><code className="font-bold bg-blue-100 px-1.5 py-0.5 rounded">a</code> → Variable hai</p>
                            </div>
                            <div className="p-3 rounded-xl text-center" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
                                <p className="text-xs text-green-700"><code className="font-bold bg-green-100 px-1.5 py-0.5 rounded">10</code> → Stored value hai</p>
                            </div>
                        </div>
                        <IB type="tip">Variable ko samjho jaise ek <strong>box</strong> hota hai jisme data rakhte hain — aur uska ek naam hota hai!</IB>
                    </Sec>

                    {/* ═══ SECTION: Rules for Variables ═══ */}
                    <Sec id="variable-rules" title="🔴 Rules for Variable Naming" icon={<Shield size={16} className="text-pink-500" />}>
                        <Def>📋 Variable declare karte waqt kuch important <strong>rules</strong> follow karne padte hain.</Def>

                        <div className="space-y-4 mt-4">
                            {/* Rule 1 */}
                            <div className="p-4 rounded-xl" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                                <h5 className="font-bold text-emerald-700 mb-2">🔸 1. Variable Name Alphabet ya Underscore se Start Hona Chahiye</h5>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                                        <p className="text-[10px] font-bold text-emerald-700 mb-1">✅ Correct</p>
                                        <code className="text-xs text-gray-800 font-mono">temp, _value</code>
                                    </div>
                                    <div className="bg-white p-2.5 rounded-lg border border-red-200">
                                        <p className="text-[10px] font-bold text-red-600 mb-1">❌ Wrong</p>
                                        <code className="text-xs text-gray-800 font-mono">1temp</code>
                                    </div>
                                </div>
                            </div>

                            {/* Rule 2 */}
                            <div className="p-4 rounded-xl" style={{ background: '#eff6ff', border: '1px solid #93c5fd' }}>
                                <h5 className="font-bold text-blue-700 mb-2">🔸 2. Space Allowed Nahi Hota</h5>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-2.5 rounded-lg border border-blue-200">
                                        <p className="text-[10px] font-bold text-emerald-700 mb-1">✅ Correct</p>
                                        <code className="text-xs text-gray-800 font-mono">totalMarks</code>
                                    </div>
                                    <div className="bg-white p-2.5 rounded-lg border border-red-200">
                                        <p className="text-[10px] font-bold text-red-600 mb-1">❌ Wrong</p>
                                        <code className="text-xs text-gray-800 font-mono">total marks</code>
                                    </div>
                                </div>
                            </div>

                            {/* Rule 3 */}
                            <div className="p-4 rounded-xl" style={{ background: '#fefce8', border: '1px solid #fde047' }}>
                                <h5 className="font-bold text-yellow-700 mb-2">🔸 3. Special Characters Allowed Nahi Hote</h5>
                                <p className="text-xs text-yellow-800">Special symbols jaise <code className="bg-yellow-100 px-1.5 py-0.5 rounded font-mono">@ # % &amp;</code> use nahi kar sakte.</p>
                            </div>

                            {/* Rule 4 */}
                            <div className="p-4 rounded-xl" style={{ background: '#fdf2f8', border: '1px solid #f9a8d4' }}>
                                <h5 className="font-bold text-pink-700 mb-2">🔸 4. Keywords Use Nahi Kar Sakte</h5>
                                <p className="text-xs text-pink-800 mb-2">C language ke reserved keywords variable names nahi ban sakte.</p>
                                <div className="flex flex-wrap gap-2">
                                    {['int', 'float', 'while', 'return', 'void'].map((k, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-white rounded-lg text-xs font-mono font-bold text-red-600 border border-red-200">{k}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Rule 5 */}
                            <div className="p-4 rounded-xl" style={{ background: '#f5f3ff', border: '1px solid #c4b5fd' }}>
                                <h5 className="font-bold text-purple-700 mb-2">🔸 5. Variable Name Meaningful Hona Chahiye</h5>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-2.5 rounded-lg border border-purple-200">
                                        <p className="text-[10px] font-bold text-emerald-700 mb-1">✅ Correct</p>
                                        <code className="text-xs text-gray-800 font-mono">studentAge</code>
                                    </div>
                                    <div className="bg-white p-2.5 rounded-lg border border-red-200">
                                        <p className="text-[10px] font-bold text-red-600 mb-1">❌ Wrong</p>
                                        <code className="text-xs text-gray-800 font-mono">x</code>
                                    </div>
                                </div>
                            </div>

                            {/* Rule 6 */}
                            <div className="p-4 rounded-xl" style={{ background: '#ecfeff', border: '1px solid #67e8f9' }}>
                                <h5 className="font-bold text-cyan-700 mb-2">🔸 6. Variable Case Sensitive Hota Hai</h5>
                                <div className="flex items-center justify-center gap-4 my-2">
                                    <span className="px-4 py-2 bg-white rounded-lg text-sm font-mono font-bold text-cyan-700 border border-cyan-200">age</span>
                                    <span className="text-lg font-bold text-red-700">≠</span>
                                    <span className="px-4 py-2 bg-white rounded-lg text-sm font-mono font-bold text-cyan-700 border border-cyan-200">AGE</span>
                                </div>
                                <p className="text-xs text-cyan-800 text-center">Dono <strong>different variables</strong> hote hain.</p>
                            </div>

                            {/* Rule 7 */}
                            <div className="p-4 rounded-xl" style={{ background: '#fff7ed', border: '1px solid #fdba74' }}>
                                <h5 className="font-bold text-orange-700 mb-2">🔸 7. Numbers Use Kar Sakte Hain But Starting Me Nahi</h5>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-2.5 rounded-lg border border-orange-200">
                                        <p className="text-[10px] font-bold text-emerald-700 mb-1">✅ Correct</p>
                                        <code className="text-xs text-gray-800 font-mono">mark1</code>
                                    </div>
                                    <div className="bg-white p-2.5 rounded-lg border border-red-200">
                                        <p className="text-[10px] font-bold text-red-600 mb-1">❌ Wrong</p>
                                        <code className="text-xs text-gray-800 font-mono">1mark</code>
                                    </div>
                                </div>
                            </div>

                            {/* Rule 8 */}
                            <div className="p-4 rounded-xl" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
                                <h5 className="font-bold text-green-700 mb-2">🔸 8. Variable Length Limited Hoti Hai</h5>
                                <p className="text-xs text-green-800">Variable ka naam bahut jyada long nahi hona chahiye aur <strong>readable</strong> hona chahiye.</p>
                            </div>
                        </div>
                        <IB type="warning">In rules ko follow karna <strong>zaroori</strong> hai — warna program mein <strong>error</strong> aayega!</IB>
                    </Sec>

                    {/* ═══ SECTION: Data Types ═══ */}
                    <Sec id="data-types" title="🔴 Data Types" icon={<Layers size={16} className="text-purple-500" />}>
                        <Def>📊 <strong>Data type</strong> batata hai ki variable me kis type ka data store hoga.</Def>
                        <p>Different data types alag-alag <strong>memory size</strong> aur <strong>value range</strong> support karte hain.</p>

                        <h4 className="font-bold mt-5 mb-3 text-gray-800">🔹 Common Data Types in Embedded C</h4>
                        <div className="overflow-x-auto rounded-xl border border-purple-200 my-4">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }} className="text-white">
                                        <th className="px-4 py-3 text-left text-xs font-bold">Data Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold">Use</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { type: 'int', use: 'Integer values' },
                                        { type: 'float', use: 'Decimal values' },
                                        { type: 'char', use: 'Single character' },
                                        { type: 'double', use: 'Large decimal values' },
                                        { type: 'void', use: 'No value' },
                                        { type: 'long', use: 'Large integer values' },
                                        { type: 'short', use: 'Small integer values' },
                                        { type: 'unsigned int', use: 'Positive integers only' },
                                    ].map((row, i) => (
                                        <tr key={i} className={`${i % 2 === 0 ? 'bg-purple-50/50' : 'bg-white'} border-b border-purple-100`}>
                                            <td className="px-4 py-2.5 font-mono font-bold text-purple-700 text-xs">{row.type}</td>
                                            <td className="px-4 py-2.5 text-gray-700 text-xs">{row.use}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h4 className="font-bold mt-5 mb-3 text-gray-800">🔹 Data Types — Detail</h4>
                        <div className="space-y-4">
                            {/* int */}
                            <div className="p-4 rounded-xl" style={{ background: '#eff6ff', border: '1px solid #93c5fd' }}>
                                <h5 className="font-bold text-blue-700 mb-2">🔹 int — Integer</h5>
                                <p className="text-xs text-blue-800 mb-2">Integer numbers store karta hai.</p>
                                <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs">
                                    <div><span className="text-orange-400">int</span> <span className="text-sky-400">age</span> = <span className="text-green-400">20</span>;</div>
                                </div>
                            </div>

                            {/* float */}
                            <div className="p-4 rounded-xl" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                                <h5 className="font-bold text-emerald-700 mb-2">🔹 float — Decimal</h5>
                                <p className="text-xs text-emerald-800 mb-2">Decimal numbers store karta hai.</p>
                                <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs">
                                    <div><span className="text-orange-400">float</span> <span className="text-sky-400">temp</span> = <span className="text-green-400">36.5</span>;</div>
                                </div>
                            </div>

                            {/* char */}
                            <div className="p-4 rounded-xl" style={{ background: '#fefce8', border: '1px solid #fde047' }}>
                                <h5 className="font-bold text-yellow-700 mb-2">🔹 char — Character</h5>
                                <p className="text-xs text-yellow-800 mb-2">Single character store karta hai.</p>
                                <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs">
                                    <div><span className="text-orange-400">char</span> <span className="text-sky-400">grade</span> = <span className="text-green-400">&apos;A&apos;</span>;</div>
                                </div>
                            </div>

                            {/* double */}
                            <div className="p-4 rounded-xl" style={{ background: '#fdf2f8', border: '1px solid #f9a8d4' }}>
                                <h5 className="font-bold text-pink-700 mb-2">🔹 double — Large Decimal</h5>
                                <p className="text-xs text-pink-800">Large decimal precision values store karta hai. Float se zyada accurate hota hai.</p>
                            </div>

                            {/* void */}
                            <div className="p-4 rounded-xl" style={{ background: '#f5f3ff', border: '1px solid #c4b5fd' }}>
                                <h5 className="font-bold text-purple-700 mb-2">🔹 void — No Value</h5>
                                <p className="text-xs text-purple-800">Jab koi value return nahi hoti tab use hota hai. Jaise <code className="bg-purple-100 px-1.5 py-0.5 rounded font-mono">void setup()</code></p>
                            </div>
                        </div>
                        <IB type="tip">Sahi data type select karna <strong>memory optimize</strong> karta hai aur program ko <strong>efficient</strong> banata hai!</IB>
                    </Sec>

                    {/* ═══ SECTION: Operators in Embedded C ═══ */}
                    <Sec id="operators" title="🔴 Operators in Embedded C" icon={<Activity size={16} className="text-rose-500" />}>
                        <Def>➕ <strong>Operators</strong> special symbols hote hain jo variables aur values par operations perform karne ke liye use kiye jate hain.</Def>
                        
                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #fff1f2, #ffe4e6)', border: '1px solid #fecdd3' }}>
                            <p className="text-sm font-bold text-rose-800">👉 &quot;Operators = calculations aur logical operations karne wale symbols&quot;</p>
                        </div>
                        
                        <p className="mb-4 text-sm text-gray-700">Embedded C language me operators ka use Calculation, Comparison, Decision making, aur Logical checking ke liye kiya jata hai.</p>

                        <h4 className="font-bold mt-5 mb-3 text-gray-800">🔹 Types of Operators</h4>
                        
                        {/* 1. Arithmetic Operators */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-sky-100 shadow-sm">
                            <h5 className="font-bold text-sky-800 text-lg mb-2 flex items-center gap-2">
                                <div className="p-1.5 bg-sky-100 text-sky-600 rounded-lg"><Activity size={16} /></div>
                                1. Arithmetic Operators
                            </h5>
                            <p className="text-sm text-gray-600 mb-3">Arithmetic operators mathematical calculations (add, subtract, etc.) perform karne ke liye use hote hain.</p>
                            
                            <div className="overflow-x-auto rounded-xl border border-sky-200 mb-4">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }} className="text-white">
                                            <th className="px-4 py-3 text-left text-xs font-bold w-1/3">Operator</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold">Work</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { op: '+', work: 'Addition' },
                                            { op: '-', work: 'Subtraction' },
                                            { op: '*', work: 'Multiplication' },
                                            { op: '/', work: 'Division' },
                                            { op: '%', work: 'Modulus (Remainder)' },
                                        ].map((r, i) => (
                                            <tr key={i} className={`${i % 2 === 0 ? 'bg-sky-50/50' : 'bg-white'} border-b border-sky-100`}>
                                                <td className="px-4 py-2.5 font-mono font-bold text-sky-700 text-sm">{r.op}</td>
                                                <td className="px-4 py-2.5 text-gray-700 text-xs">{r.work}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                <div className="text-gray-400 mb-2">// Example: Calculating average sensor value</div>
                                <div><span className="text-orange-400">int</span> <span className="text-sky-300">sensor1</span> <span className="text-pink-400">=</span> <span className="text-green-400">400</span><span className="text-gray-300">;</span></div>
                                <div><span className="text-orange-400">int</span> <span className="text-sky-300">sensor2</span> <span className="text-pink-400">=</span> <span className="text-green-400">600</span><span className="text-gray-300">;</span></div>
                                <div className="mt-2"><span className="text-orange-400">int</span> <span className="text-sky-300">average</span> <span className="text-pink-400">=</span> <span className="text-gray-300">(</span><span className="text-sky-300">sensor1</span> <span className="text-pink-400">+</span> <span className="text-sky-300">sensor2</span><span className="text-gray-300">)</span> <span className="text-pink-400">/</span> <span className="text-green-400">2</span><span className="text-gray-300">;</span></div>
                                <div className="mt-2 text-gray-400">// Output average: 500</div>
                            </div>
                        </div>

                        {/* 2. Relational Operators */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-purple-100 shadow-sm">
                            <h5 className="font-bold text-purple-800 text-lg mb-2 flex items-center gap-2">
                                <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg"><Activity size={16} /></div>
                                2. Relational Operators
                            </h5>
                            <p className="text-sm text-gray-600 mb-3">Ye operators do values ko compare karte hain (jaise temperature limit check karna). Ye TRUE (1) ya FALSE (0) result dete hain.</p>
                            
                            <div className="overflow-x-auto rounded-xl border border-purple-200 mb-4">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }} className="text-white">
                                            <th className="px-4 py-3 text-left text-xs font-bold w-1/3">Operator</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold">Meaning</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { op: '==', desc: 'Equal to' },
                                            { op: '!=', desc: 'Not equal to' },
                                            { op: '>', desc: 'Greater than' },
                                            { op: '<', desc: 'Less than' },
                                            { op: '>=', desc: 'Greater than equal to' },
                                            { op: '<=', desc: 'Less than equal to' },
                                        ].map((r, i) => (
                                            <tr key={i} className={`${i % 2 === 0 ? 'bg-purple-50/50' : 'bg-white'} border-b border-purple-100`}>
                                                <td className="px-4 py-2.5 font-mono font-bold text-purple-700 text-sm">{r.op}</td>
                                                <td className="px-4 py-2.5 text-gray-700 text-xs">{r.desc}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                <div className="text-gray-400 mb-2">// Example: Checking fire alarm condition</div>
                                <div><span className="text-orange-400">float</span> <span className="text-sky-300">temperature</span> <span className="text-pink-400">=</span> <span className="text-green-400">45.5</span><span className="text-gray-300">;</span></div>
                                <div className="mt-2"><span className="text-blue-400">if</span> <span className="text-gray-300">(</span><span className="text-sky-300">temperature</span> <span className="text-pink-400">&gt;=</span> <span className="text-green-400">40.0</span><span className="text-gray-300">) {'{'}</span></div>
                                <div className="ml-4 text-gray-400">// Condition TRUE hui, Fire Alarm bajao!</div>
                                <div><span className="text-gray-300">{'}'}</span></div>
                            </div>
                        </div>

                        {/* 3. Logical Operators */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-emerald-100 shadow-sm">
                            <h5 className="font-bold text-emerald-800 text-lg mb-2 flex items-center gap-2">
                                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><Activity size={16} /></div>
                                3. Logical Operators
                            </h5>
                            <p className="text-sm text-gray-600 mb-3">Jab ek se zyada conditions ko combine karna ho (e.g. agar raat hai AUR motion detect hua hai, tabhi light on karo).</p>
                            
                            <div className="overflow-x-auto rounded-xl border border-emerald-200 mb-4">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }} className="text-white">
                                            <th className="px-4 py-3 text-left text-xs font-bold w-1/3">Operator</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold">Meaning</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { op: '&&', desc: 'Logical AND (Dono true honge tabhi TRUE)' },
                                            { op: '||', desc: 'Logical OR (Koi ek bhi true to TRUE)' },
                                            { op: '!', desc: 'Logical NOT (Condition ka opposite karta hai)' },
                                        ].map((r, i) => (
                                            <tr key={i} className={`${i % 2 === 0 ? 'bg-emerald-50/50' : 'bg-white'} border-b border-emerald-100`}>
                                                <td className="px-4 py-2.5 font-mono font-bold text-emerald-700 text-sm">{r.op}</td>
                                                <td className="px-4 py-2.5 text-gray-700 text-xs">{r.desc}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                <div className="text-gray-400 mb-2">// Example: Smart street light logic</div>
                                <div><span className="text-orange-400">int</span> <span className="text-sky-300">isNight</span> <span className="text-pink-400">=</span> <span className="text-green-400">1</span><span className="text-gray-300">;</span> <span className="text-gray-400">// 1 means True</span></div>
                                <div><span className="text-orange-400">int</span> <span className="text-sky-300">motionDetected</span> <span className="text-pink-400">=</span> <span className="text-green-400">1</span><span className="text-gray-300">;</span></div>
                                <div className="mt-2"><span className="text-blue-400">if</span> <span className="text-gray-300">(</span><span className="text-sky-300">isNight</span> <span className="text-pink-400">==</span> <span className="text-green-400">1</span> <span className="text-pink-400">&amp;&amp;</span> <span className="text-sky-300">motionDetected</span> <span className="text-pink-400">==</span> <span className="text-green-400">1</span><span className="text-gray-300">) {'{'}</span></div>
                                <div className="ml-4 text-gray-400">// Raat bhi hai AUR motion bhi hua, light ON karo!</div>
                                <div><span className="text-gray-300">{'}'}</span></div>
                            </div>
                        </div>

                        {/* 4. Assignment Operators */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-amber-100 shadow-sm">
                            <h5 className="font-bold text-amber-800 text-lg mb-2 flex items-center gap-2">
                                <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg"><Activity size={16} /></div>
                                4. Assignment Operators
                            </h5>
                            <p className="text-sm text-gray-600 mb-3">Ye variables me direct value store karne ke liye use hote hain. Short calculations ke liye <code className="bg-amber-50 px-1 font-mono text-amber-600">+=</code> aur <code className="bg-amber-50 px-1 font-mono text-amber-700">-=</code> zyada use hote hain.</p>
                            
                            <div className="overflow-x-auto rounded-xl border border-amber-200 mb-4">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }} className="text-white">
                                            <th className="px-4 py-3 text-left text-xs font-bold w-1/3">Operator</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold">Meaning</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { op: '=', desc: 'Assign value (e.g. x = 5)' },
                                            { op: '+=', desc: 'Add & assign (x += 5 means x = x + 5)' },
                                            { op: '-=', desc: 'Subtract & assign (x -= 5 means x = x - 5)' },
                                            { op: '*=', desc: 'Multiply & assign' },
                                            { op: '/=', desc: 'Divide & assign' },
                                        ].map((r, i) => (
                                            <tr key={i} className={`${i % 2 === 0 ? 'bg-amber-50/50' : 'bg-white'} border-b border-amber-100`}>
                                                <td className="px-4 py-2.5 font-mono font-bold text-amber-700 text-sm">{r.op}</td>
                                                <td className="px-4 py-2.5 text-gray-700 text-xs">{r.desc}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                <div className="text-gray-400 mb-2">// Example: Counting total distance travelled by a robot</div>
                                <div><span className="text-orange-400">int</span> <span className="text-sky-300">totalDistance</span> <span className="text-pink-400">=</span> <span className="text-green-400">100</span><span className="text-gray-300">;</span> <span className="text-gray-400">// Pehle 100cm chala tha</span></div>
                                <div className="mt-2"><span className="text-sky-300">totalDistance</span> <span className="text-pink-400">+=</span> <span className="text-green-400">50</span><span className="text-gray-300">;</span></div>
                                <div className="text-gray-400">// Ab totalDistance 150cm ho jayega (100 + 50)</div>
                            </div>
                        </div>

                        {/* 5. Increment and Decrement Operators */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-rose-100 shadow-sm">
                            <h5 className="font-bold text-rose-800 text-lg mb-2 flex items-center gap-2">
                                <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg"><Activity size={16} /></div>
                                5. Increment and Decrement
                            </h5>
                            <p className="text-sm text-gray-600 mb-3">Kisi sensor ke counter ko 1 step aage (Increase) ya 1 step piche (Decrease) karne ke liye inka use hota hai.</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-black text-rose-700 font-mono">++</div>
                                    <div className="font-bold text-rose-800 text-sm mt-1">Increment (+1)</div>
                                </div>
                                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-black text-rose-700 font-mono">--</div>
                                    <div className="font-bold text-rose-800 text-sm mt-1">Decrement (-1)</div>
                                </div>
                            </div>

                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                <div className="text-gray-400 mb-2">// Example: Visitor counter in smart room</div>
                                <div><span className="text-orange-400">int</span> <span className="text-sky-300">visitors</span> <span className="text-pink-400">=</span> <span className="text-green-400">5</span><span className="text-gray-300">;</span> <span className="text-gray-400">// Room me 5 log the</span></div>
                                <div className="mt-2 text-gray-400">// Ek aur person room me aaya:</div>
                                <div><span className="text-sky-300">visitors</span><span className="text-pink-400">++</span><span className="text-gray-300">;</span> <span className="text-gray-400">// Result: Ab visitors 6 ho gaye</span></div>
                            </div>
                        </div>

                        {/* 6. Bitwise Operators */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-indigo-100 shadow-sm">
                            <h5 className="font-bold text-indigo-800 text-lg mb-2 flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg"><Activity size={16} /></div>
                                6. Bitwise Operators
                            </h5>
                            <p className="text-sm text-gray-600 mb-3">Ye Arduino ke pin level (0 aur 1) par kaam karne ke liye (hardware registers control karne ke liye) sabse important hote hain.</p>
                            
                            <div className="overflow-x-auto rounded-xl border border-indigo-200 mb-4">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }} className="text-white">
                                            <th className="px-4 py-3 text-left text-xs font-bold w-1/3">Operator</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold">Meaning</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { op: '&', desc: 'Bitwise AND' },
                                            { op: '|', desc: 'Bitwise OR' },
                                            { op: '^', desc: 'Bitwise XOR' },
                                            { op: '~', desc: 'Bitwise NOT' },
                                            { op: '<<', desc: 'Left Shift (Bits ko left khiskata hai)' },
                                            { op: '>>', desc: 'Right Shift (Bits ko right khiskata hai)' },
                                        ].map((r, i) => (
                                            <tr key={i} className={`${i % 2 === 0 ? 'bg-indigo-50/50' : 'bg-white'} border-b border-indigo-100`}>
                                                <td className="px-4 py-2.5 font-mono font-bold text-indigo-700 text-sm">{r.op}</td>
                                                <td className="px-4 py-2.5 text-gray-700 text-xs">{r.desc}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                <div className="text-gray-400 mb-2">// Example: Setting a specific bit to 1 (Bitwise OR)</div>
                                <div><span className="text-orange-400">byte</span> <span className="text-sky-300">PORTB_Value</span> <span className="text-pink-400">=</span> <span className="text-green-400">0b00000000</span><span className="text-gray-300">;</span></div>
                                <div className="mt-2 text-gray-400">// Turn ON 3rd bit (index 2):</div>
                                <div><span className="text-sky-300">PORTB_Value</span> <span className="text-pink-400">=</span> <span className="text-sky-300">PORTB_Value</span> <span className="text-pink-400">|</span> <span className="text-green-400">0b00000100</span><span className="text-gray-300">;</span></div>
                                <div className="text-gray-400">// Ab PORTB_Value ho gaya: 0b00000100</div>
                            </div>
                        </div>

                        {/* 7. Conditional Operator */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-teal-100 shadow-sm">
                            <h5 className="font-bold text-teal-800 text-lg mb-2 flex items-center gap-2">
                                <div className="p-1.5 bg-teal-100 text-teal-600 rounded-lg"><Activity size={16} /></div>
                                7. Conditional (Ternary) Operator
                            </h5>
                            <p className="text-sm text-gray-600 mb-3">Ye if-else statement ka short form hota hai. Isse ek hi line me decision ho jata hai.</p>
                            
                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto mb-3">
                                <div className="text-gray-400 mb-1">// Syntax:</div>
                                <div><span className="text-gray-300">(</span><span className="text-sky-300">condition</span><span className="text-gray-300">)</span> <span className="text-pink-400">?</span> <span className="text-green-300">value_if_true</span> <span className="text-pink-400">:</span> <span className="text-rose-300">value_if_false</span><span className="text-gray-300">;</span></div>
                            </div>
                            
                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                <div className="text-gray-400 mb-2">// Example: Check water level</div>
                                <div><span className="text-orange-400">int</span> <span className="text-sky-300">waterLevel</span> <span className="text-pink-400">=</span> <span className="text-green-400">80</span><span className="text-gray-300">;</span></div>
                                <div className="mt-2"><span className="text-orange-400">int</span> <span className="text-sky-300">pumpStatus</span> <span className="text-pink-400">=</span> <span className="text-gray-300">(</span><span className="text-sky-300">waterLevel</span> <span className="text-pink-400">&lt;</span> <span className="text-green-400">20</span><span className="text-gray-300">)</span> <span className="text-pink-400">?</span> <span className="text-green-400">1</span> <span className="text-pink-400">:</span> <span className="text-green-400">0</span><span className="text-gray-300">;</span></div>
                                <div className="mt-1 text-gray-400">// Agar water level 20 se kam hai to pump ON (1) hoga, warna OFF (0) hoga.</div>
                                <div className="text-gray-400">// Yahan waterLevel 80 hai, isliye pumpStatus 0 ho jayega.</div>
                            </div>
                        </div>

                        {/* Operator Precedence */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                            <h5 className="font-bold text-gray-800 text-lg mb-2">🔴 Operator Precedence</h5>
                            <p className="text-sm text-gray-600 mb-3">Jab ek expression me bahut saare operators use hote hain to execution kis order me hoga, usko operator precedence kehte hain.</p>
                            
                            <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm text-gray-700 font-semibold shadow-sm text-center">
                                BODMAS rule jaisa: Multiply / Divide pehle, Addition / Subtraction baad me.
                            </div>

                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                <div className="text-gray-400 mb-2">// Example: Sensor Calibration formula</div>
                                <div><span className="text-orange-400">int</span> <span className="text-sky-300">result</span> <span className="text-pink-400">=</span> <span className="text-green-400">10</span> <span className="text-pink-400">+</span> <span className="text-green-400">5</span> <span className="text-pink-400">*</span> <span className="text-green-400">2</span><span className="text-gray-300">;</span></div>
                                <div className="mt-2 text-gray-400">// Execute kaise hoga?</div>
                                <div className="text-gray-400">// Step 1: 5 * 2 = 10 (Multiplication ki priority zyada hoti hai)</div>
                                <div className="text-gray-400">// Step 2: 10 + 10 = 20</div>
                                <div className="mt-2"><span className="text-gray-400">// Result: </span><span className="text-green-400">20</span></div>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Conditional Statements ═══ */}
                    <Sec id="conditional-statements" title="🔴 Conditional Statements" icon={<CheckCircle2 size={16} className="text-emerald-500" />}>
                        <Def>⚖️ <strong>Conditional statements</strong> ka use decision making ke liye kiya jata hai.</Def>
                        <p>In statements ki help se program kisi condition ko check karta hai aur uske according different instructions execute karta hai.</p>
                        
                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', border: '1px solid #a7f3d0' }}>
                            <p className="text-sm font-bold text-emerald-800">👉 Simple words me: &quot;Condition TRUE ya FALSE hone par alag-alag code execute karna&quot;</p>
                        </div>
                        
                        <p className="mb-4 text-sm text-gray-700">Embedded C aur Arduino programming me conditional statements bahut important hote hain kyunki inki help se sensors aur devices ke according automatic decisions liye ja sakte hain.</p>

                        <h4 className="font-bold mt-5 mb-3 text-gray-800">🔹 Types of Conditional Statements</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div className="p-4 rounded-xl text-center bg-blue-50 border border-blue-200">
                                <h5 className="font-bold text-blue-800 text-lg">1. if</h5>
                                <p className="text-xs text-blue-600 mt-1">Statement</p>
                            </div>
                            <div className="p-4 rounded-xl text-center bg-purple-50 border border-purple-200">
                                <h5 className="font-bold text-purple-800 text-lg">2. if-else</h5>
                                <p className="text-xs text-purple-600 mt-1">Statement</p>
                            </div>
                            <div className="p-4 rounded-xl text-center bg-rose-50 border border-rose-200">
                                <h5 className="font-bold text-rose-800 text-lg">3. else-if</h5>
                                <p className="text-xs text-rose-700 mt-1">Ladder</p>
                            </div>
                        </div>

                        {/* 1. if Statement */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-blue-100 shadow-sm">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">🔴 1. if Statement</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>if statement</strong> ka use tab kiya jata hai jab kisi condition ke TRUE hone par hi code execute karna ho. Agar condition FALSE ho jaye to program if block ko skip kar deta hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax of if Statement</div>
                                    <div><span className="text-pink-400">if</span><span className="text-gray-300">(condition)</span></div>
                                    <div><span className="text-gray-300">{'{'}</span></div>
                                    <div className="ml-4 text-gray-400">// code</div>
                                    <div><span className="text-gray-300">{'}'}</span></div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                    <p className="text-xs font-bold text-blue-900 mb-1">⚡ Working:</p>
                                    <ul className="text-xs text-blue-800 space-y-1 ml-4 list-decimal marker:text-blue-500">
                                        <li>Program condition check karta hai</li>
                                        <li>Agar condition <strong>TRUE</strong> ho: if block execute hota hai</li>
                                        <li>Agar condition <strong>FALSE</strong> ho: if block execute nahi hota</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto mt-4">
                                <div className="text-gray-400 mb-1">// Example</div>
                                <div><span className="text-orange-400">int</span> <span className="text-sky-300">a</span> <span className="text-pink-400">=</span> <span className="text-green-400">10</span><span className="text-gray-300">;</span></div>
                                <br />
                                <div><span className="text-pink-400">if</span><span className="text-gray-300">(a &gt; </span><span className="text-green-400">5</span><span className="text-gray-300">)</span></div>
                                <div><span className="text-gray-300">{'{'}</span></div>
                                <div className="ml-4"><span className="text-sky-300">Serial.println</span><span className="text-gray-300">(</span><span className="text-green-300">"Value is greater"</span><span className="text-gray-300">);</span></div>
                                <div><span className="text-gray-300">{'}'}</span></div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200 mt-2 text-sm text-gray-700 font-semibold shadow-sm text-center">
                                👉 Yahan Condition: <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600">a &gt; 5</code> TRUE hai isliye message print hoga.
                            </div>
                        </div>

                        {/* 2. if-else Statement */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-purple-100 shadow-sm">
                            <h5 className="font-bold text-purple-800 text-lg mb-2">🔴 2. if-else Statement</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>if-else statement</strong> ka use tab kiya jata hai jab: Ek condition TRUE hone par ek block execute ho aur FALSE hone par doosra block execute ho.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax of if-else Statement</div>
                                    <div><span className="text-pink-400">if</span><span className="text-gray-300">(condition)</span></div>
                                    <div><span className="text-gray-300">{'{'}</span></div>
                                    <div className="ml-4 text-gray-400">// TRUE block</div>
                                    <div><span className="text-gray-300">{'}'}</span></div>
                                    <div><span className="text-pink-400">else</span></div>
                                    <div><span className="text-gray-300">{'{'}</span></div>
                                    <div className="ml-4 text-gray-400">// FALSE block</div>
                                    <div><span className="text-gray-300">{'}'}</span></div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                                    <p className="text-xs font-bold text-purple-900 mb-1">⚡ Working:</p>
                                    <ul className="text-xs text-purple-800 space-y-1 ml-4 list-decimal marker:text-purple-500">
                                        <li>Condition check hoti hai</li>
                                        <li>Agar <strong>TRUE</strong>: if block execute hota hai</li>
                                        <li>Agar <strong>FALSE</strong>: else block execute hota hai</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto mt-4">
                                <div className="text-gray-400 mb-1">// Example</div>
                                <div><span className="text-orange-400">int</span> <span className="text-sky-300">age</span> <span className="text-pink-400">=</span> <span className="text-green-400">15</span><span className="text-gray-300">;</span></div>
                                <br />
                                <div><span className="text-pink-400">if</span><span className="text-gray-300">(age &gt;= </span><span className="text-green-400">18</span><span className="text-gray-300">)</span></div>
                                <div><span className="text-gray-300">{'{'}</span></div>
                                <div className="ml-4"><span className="text-sky-300">Serial.println</span><span className="text-gray-300">(</span><span className="text-green-300">"Eligible"</span><span className="text-gray-300">);</span></div>
                                <div><span className="text-gray-300">{'}'}</span></div>
                                <div><span className="text-pink-400">else</span></div>
                                <div><span className="text-gray-300">{'{'}</span></div>
                                <div className="ml-4"><span className="text-sky-300">Serial.println</span><span className="text-gray-300">(</span><span className="text-green-300">"Not Eligible"</span><span className="text-gray-300">);</span></div>
                                <div><span className="text-gray-300">{'}'}</span></div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200 mt-2 text-sm text-gray-700 font-semibold shadow-sm text-center">
                                👉 Yahan Condition FALSE hai isliye <code className="bg-gray-100 px-1 py-0.5 rounded text-purple-600">else</code> block execute hoga.
                            </div>
                        </div>

                        {/* 3. else-if Ladder */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-rose-100 shadow-sm">
                            <h5 className="font-bold text-rose-800 text-lg mb-2">🔴 3. else-if Ladder</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>else-if ladder</strong> ka use multiple conditions check karne ke liye kiya jata hai. Jab program me ek se jyada conditions ho aur har condition ke according alag action perform karna ho tab else-if ladder use hota hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax of else-if Ladder</div>
                                    <div><span className="text-pink-400">if</span><span className="text-gray-300">(condition1)</span></div>
                                    <div><span className="text-gray-300">{'{'}</span></div>
                                    <div className="ml-4 text-gray-400">// code</div>
                                    <div><span className="text-gray-300">{'}'}</span></div>
                                    <div><span className="text-pink-400">else if</span><span className="text-gray-300">(condition2)</span></div>
                                    <div><span className="text-gray-300">{'{'}</span></div>
                                    <div className="ml-4 text-gray-400">// code</div>
                                    <div><span className="text-gray-300">{'}'}</span></div>
                                    <div><span className="text-pink-400">else if</span><span className="text-gray-300">(condition3)</span></div>
                                    <div><span className="text-gray-300">{'{'}</span></div>
                                    <div className="ml-4 text-gray-400">// code</div>
                                    <div><span className="text-gray-300">{'}'}</span></div>
                                    <div><span className="text-pink-400">else</span></div>
                                    <div><span className="text-gray-300">{'{'}</span></div>
                                    <div className="ml-4 text-gray-400">// default code</div>
                                    <div><span className="text-gray-300">{'}'}</span></div>
                                </div>
                                <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                                    <p className="text-xs font-bold text-rose-900 mb-1">⚡ Working:</p>
                                    <ul className="text-xs text-rose-800 space-y-1 ml-4 list-decimal marker:text-rose-500">
                                        <li>Pehli condition check hoti hai</li>
                                        <li>Agar TRUE: Us block ka code execute hota hai</li>
                                        <li>Agar FALSE: Next condition check hoti hai</li>
                                        <li>Ye process tab tak chalta hai jab tak koi condition TRUE na ho jaye</li>
                                        <li>Agar koi bhi condition TRUE na ho: else block execute hota hai</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto mt-4">
                                <div className="text-gray-400 mb-1">// Example</div>
                                <div><span className="text-orange-400">int</span> <span className="text-sky-300">marks</span> <span className="text-pink-400">=</span> <span className="text-green-400">75</span><span className="text-gray-300">;</span></div>
                                <br />
                                <div><span className="text-pink-400">if</span><span className="text-gray-300">(marks &gt;= </span><span className="text-green-400">90</span><span className="text-gray-300">)</span></div>
                                <div><span className="text-gray-300">{'{'}</span></div>
                                <div className="ml-4"><span className="text-sky-300">Serial.println</span><span className="text-gray-300">(</span><span className="text-green-300">"Grade A"</span><span className="text-gray-300">);</span></div>
                                <div><span className="text-gray-300">{'}'}</span></div>
                                <div><span className="text-pink-400">else if</span><span className="text-gray-300">(marks &gt;= </span><span className="text-green-400">70</span><span className="text-gray-300">)</span></div>
                                <div><span className="text-gray-300">{'{'}</span></div>
                                <div className="ml-4"><span className="text-sky-300">Serial.println</span><span className="text-gray-300">(</span><span className="text-green-300">"Grade B"</span><span className="text-gray-300">);</span></div>
                                <div><span className="text-gray-300">{'}'}</span></div>
                                <div><span className="text-pink-400">else</span></div>
                                <div><span className="text-gray-300">{'{'}</span></div>
                                <div className="ml-4"><span className="text-sky-300">Serial.println</span><span className="text-gray-300">(</span><span className="text-green-300">"Grade C"</span><span className="text-gray-300">);</span></div>
                                <div><span className="text-gray-300">{'}'}</span></div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200 mt-2 text-sm text-gray-700 font-semibold shadow-sm text-center">
                                👉 Yahan <code className="bg-gray-100 px-1 py-0.5 rounded text-rose-700">marks &gt;= 70</code> TRUE hai isliye <strong>Grade B</strong> print hoga.
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Loop Statements ═══ */}
                    <Sec id="loop-statements" title="🔴 Loop Statements" icon={<Repeat size={16} className="text-sky-500" />}>
                        <Def>🔄 <strong>Loop statements</strong> ka use kisi code ko baar-baar execute karne ke liye kiya jata hai.</Def>
                        <p>Jab program me same instructions ko repeatedly chalana ho tab loops use kiye jate hain.</p>
                        
                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', border: '1px solid #7dd3fc' }}>
                            <p className="text-sm font-bold text-sky-800">👉 Simple words me: &quot;Loop = same code ko repeat karna&quot;</p>
                        </div>
                        
                        <p className="mb-4 text-sm text-gray-700">Loops programming ko easy aur short banate hain kyunki baar-baar same code likhne ki zarurat nahi padti.</p>

                        <h4 className="font-bold mt-5 mb-3 text-gray-800">🔹 Types of Loops</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div className="p-4 rounded-xl text-center bg-indigo-50 border border-indigo-200">
                                <h5 className="font-bold text-indigo-800 text-lg">1. while</h5>
                                <p className="text-xs text-indigo-600 mt-1">Loop</p>
                            </div>
                            <div className="p-4 rounded-xl text-center bg-teal-50 border border-teal-200">
                                <h5 className="font-bold text-teal-800 text-lg">2. do-while</h5>
                                <p className="text-xs text-teal-700 mt-1">Loop</p>
                            </div>
                            <div className="p-4 rounded-xl text-center bg-orange-50 border border-orange-200">
                                <h5 className="font-bold text-orange-800 text-lg">3. for</h5>
                                <p className="text-xs text-orange-700 mt-1">Loop</p>
                            </div>
                        </div>

                        {/* 1. while Loop */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-indigo-100 shadow-sm">
                            <h5 className="font-bold text-indigo-800 text-lg mb-2">🔴 1. while Loop</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>while loop</strong> ek entry-controlled loop hota hai. Isme condition pehle check hoti hai aur agar condition TRUE hoti hai tabhi loop execute hota hai. Agar condition starting me hi FALSE ho to loop ek baar bhi execute nahi hota.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax of while Loop</div>
                                    <div><span className="text-pink-400">while</span><span className="text-gray-300">(condition)</span></div>
                                    <div><span className="text-gray-300">{'{'}</span></div>
                                    <div className="ml-4 text-gray-400">// code</div>
                                    <div><span className="text-gray-300">{'}'}</span></div>
                                </div>
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                                    <p className="text-xs font-bold text-indigo-900 mb-1">⚡ Working:</p>
                                    <ul className="text-xs text-indigo-800 space-y-1 ml-4 list-decimal marker:text-indigo-500">
                                        <li>Condition check hoti hai</li>
                                        <li>Agar TRUE: Loop body execute hoti hai</li>
                                        <li>Fir condition dobara check hoti hai</li>
                                        <li>Jab tak condition TRUE rahegi loop chalta rahega</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto mt-4">
                                <div className="text-gray-400 mb-1">// Example of while Loop</div>
                                <div><span className="text-orange-400">int</span> <span className="text-sky-300">i</span> <span className="text-pink-400">=</span> <span className="text-green-400">1</span><span className="text-gray-300">;</span></div>
                                <br />
                                <div><span className="text-pink-400">while</span><span className="text-gray-300">(i &lt;= </span><span className="text-green-400">5</span><span className="text-gray-300">)</span></div>
                                <div><span className="text-gray-300">{'{'}</span></div>
                                <div className="ml-4"><span className="text-sky-300">Serial.println</span><span className="text-gray-300">(i);</span></div>
                                <div className="ml-4"><span className="text-sky-300">i</span><span className="text-pink-400">++</span><span className="text-gray-300">;</span></div>
                                <div><span className="text-gray-300">{'}'}</span></div>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg border border-gray-300 mt-2 text-sm text-gray-800 shadow-sm">
                                <div className="font-bold text-gray-600 text-xs mb-1 uppercase tracking-wider">Output</div>
                                <pre className="font-mono text-sm leading-relaxed text-emerald-700">1<br/>2<br/>3<br/>4<br/>5</pre>
                            </div>
                        </div>

                        {/* 2. do-while Loop */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-teal-100 shadow-sm">
                            <h5 className="font-bold text-teal-800 text-lg mb-2">🔴 2. do-while Loop</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>do-while loop</strong> ek exit-controlled loop hota hai. Isme condition baad me check hoti hai, isliye ye loop kam se kam ek baar zarur execute hota hai chahe condition FALSE hi kyon na ho.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax of do-while Loop</div>
                                    <div><span className="text-pink-400">do</span></div>
                                    <div><span className="text-gray-300">{'{'}</span></div>
                                    <div className="ml-4 text-gray-400">// code</div>
                                    <div><span className="text-gray-300">{'}'}</span></div>
                                    <div><span className="text-pink-400">while</span><span className="text-gray-300">(condition);</span></div>
                                </div>
                                <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                                    <p className="text-xs font-bold text-teal-900 mb-1">⚡ Working:</p>
                                    <ul className="text-xs text-teal-800 space-y-1 ml-4 list-decimal marker:text-teal-500">
                                        <li>Pehle loop body execute hoti hai</li>
                                        <li>Fir condition check hoti hai</li>
                                        <li>Agar condition TRUE ho: Loop repeat hota hai</li>
                                        <li>Agar FALSE ho: Loop stop ho jata hai</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto mt-4">
                                <div className="text-gray-400 mb-1">// Example of do-while Loop</div>
                                <div><span className="text-orange-400">int</span> <span className="text-sky-300">i</span> <span className="text-pink-400">=</span> <span className="text-green-400">1</span><span className="text-gray-300">;</span></div>
                                <br />
                                <div><span className="text-pink-400">do</span></div>
                                <div><span className="text-gray-300">{'{'}</span></div>
                                <div className="ml-4"><span className="text-sky-300">Serial.println</span><span className="text-gray-300">(i);</span></div>
                                <div className="ml-4"><span className="text-sky-300">i</span><span className="text-pink-400">++</span><span className="text-gray-300">;</span></div>
                                <div><span className="text-gray-300">{'}'}</span></div>
                                <div><span className="text-pink-400">while</span><span className="text-gray-300">(i &lt;= </span><span className="text-green-400">5</span><span className="text-gray-300">);</span></div>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg border border-gray-300 mt-2 text-sm text-gray-800 shadow-sm">
                                <div className="font-bold text-gray-600 text-xs mb-1 uppercase tracking-wider">Output</div>
                                <pre className="font-mono text-sm leading-relaxed text-emerald-700">1<br/>2<br/>3<br/>4<br/>5</pre>
                            </div>
                            
                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mt-3 text-sm text-amber-800 font-semibold shadow-sm flex gap-2">
                                <span>⚠️</span>
                                <div><strong>Important Point:</strong> Agar condition FALSE bhi ho tab bhi do-while loop ek baar execute zarur hota hai.</div>
                            </div>
                        </div>

                        {/* 3. for Loop */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-orange-100 shadow-sm">
                            <h5 className="font-bold text-orange-800 text-lg mb-2">🔴 3. for Loop</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>for loop</strong> ka use tab kiya jata hai jab repetitions ki exact quantity pehle se known ho. Ye sabse commonly used loop hai. Isme initialization, condition, aur increment/decrement ek hi line me likhe jate hain.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax of for Loop</div>
                                    <div><span className="text-pink-400">for</span><span className="text-gray-300">(initialization; condition; inc/dec)</span></div>
                                    <div><span className="text-gray-300">{'{'}</span></div>
                                    <div className="ml-4 text-gray-400">// code</div>
                                    <div><span className="text-gray-300">{'}'}</span></div>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                                    <p className="text-xs font-bold text-orange-900 mb-1">⚡ Working:</p>
                                    <ul className="text-xs text-orange-800 space-y-1 ml-4 list-decimal marker:text-orange-500">
                                        <li>Initialization execute hota hai</li>
                                        <li>Condition check hoti hai</li>
                                        <li>Agar TRUE: Loop body execute hoti hai</li>
                                        <li>Increment/Decrement hota hai</li>
                                        <li>Fir condition dobara check hoti hai</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto mt-4">
                                <div className="text-gray-400 mb-1">// Example of for Loop</div>
                                <div><span className="text-pink-400">for</span><span className="text-gray-300">(</span><span className="text-orange-400">int</span> <span className="text-sky-300">i</span> <span className="text-pink-400">=</span> <span className="text-green-400">1</span><span className="text-gray-300">; i &lt;= </span><span className="text-green-400">5</span><span className="text-gray-300">; i</span><span className="text-pink-400">++</span><span className="text-gray-300">)</span></div>
                                <div><span className="text-gray-300">{'{'}</span></div>
                                <div className="ml-4"><span className="text-sky-300">Serial.println</span><span className="text-gray-300">(i);</span></div>
                                <div><span className="text-gray-300">{'}'}</span></div>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg border border-gray-300 mt-2 text-sm text-gray-800 shadow-sm">
                                <div className="font-bold text-gray-600 text-xs mb-1 uppercase tracking-wider">Output</div>
                                <pre className="font-mono text-sm leading-relaxed text-emerald-700">1<br/>2<br/>3<br/>4<br/>5</pre>
                            </div>
                        </div>

                        {/* Infinite Loop */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-red-100 shadow-sm">
                            <h5 className="font-bold text-red-800 text-lg mb-2">🔴 Infinite Loop</h5>
                            <p className="text-sm text-gray-600 mb-3">Agar loop ki condition kabhi FALSE na ho to loop continuously chalta rehta hai. Isse infinite loop kehte hain.</p>
                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                <div className="text-gray-400 mb-1">// Example</div>
                                <div><span className="text-pink-400">while</span><span className="text-gray-300">(</span><span className="text-green-400">1</span><span className="text-gray-300">)</span></div>
                                <div><span className="text-gray-300">{'{'}</span></div>
                                <div className="ml-4 text-gray-400">// infinite loop</div>
                                <div><span className="text-gray-300">{'}'}</span></div>
                            </div>
                        </div>

                        {/* Difference Table */}
                        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                            <table className="w-full text-left border-collapse bg-white">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                                        <th className="p-4 font-bold text-gray-800">Loop</th>
                                        <th className="p-4 font-bold text-gray-800">Condition Check</th>
                                        <th className="p-4 font-bold text-gray-800">Execution</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-indigo-700 bg-indigo-50/30">while</td>
                                        <td className="p-4">Starting me</td>
                                        <td className="p-4">0 ya more times</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-teal-700 bg-teal-50/30">do-while</td>
                                        <td className="p-4">End me</td>
                                        <td className="p-4">At least 1 time</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-orange-700 bg-orange-50/30">for</td>
                                        <td className="p-4">Starting me</td>
                                        <td className="p-4">Fixed repetitions</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Inbuilt Functions ═══ */}
                    <Sec id="inbuilt-functions" title="🔴 Inbuilt Functions for Digital Input/Output" icon={<Activity size={16} className="text-indigo-500" />}>
                        <p className="mb-4 text-sm text-gray-700">Arduino me kai inbuilt functions available hote hain jo digital input aur output devices ko control karne ke liye use kiye jate hain. In functions ki madad se programmer bina complex coding ke hardware ko control kar sakta hai.</p>

                        {/* 1. pinMode() */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-indigo-100 shadow-sm">
                            <h5 className="font-bold text-indigo-800 text-lg mb-2">🔴 1. pinMode()</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>pinMode()</strong> function kisi pin ko INPUT ya OUTPUT mode me configure karne ke liye use hota hai. Jab bhi kisi pin ko use karna ho to sabse pehle uska mode define karna zaruri hota hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">pinMode</span><span className="text-gray-300">(pin, mode);</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-sky-300">pinMode</span><span className="text-gray-300">(</span><span className="text-green-400">13</span><span className="text-gray-300">, </span><span className="text-blue-400">OUTPUT</span><span className="text-gray-300">);</span> <span className="text-gray-400">// Output mode</span></div>
                                    <div><span className="text-sky-300">pinMode</span><span className="text-gray-300">(</span><span className="text-green-400">2</span><span className="text-gray-300">, </span><span className="text-blue-400">INPUT</span><span className="text-gray-300">);</span> <span className="text-gray-400">// Input mode</span></div>
                                </div>
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                                    <p className="text-xs font-bold text-indigo-900 mb-1">⚡ Parameters & Uses:</p>
                                    <ul className="text-xs text-indigo-800 space-y-1 ml-4 list-disc marker:text-indigo-500">
                                        <li><strong>pin</strong> → Pin number</li>
                                        <li><strong>mode</strong> → INPUT, OUTPUT ya INPUT_PULLUP</li>
                                        <li>Uses: LED control, Push button input, Sensor interfacing</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 2. digitalWrite() */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-teal-100 shadow-sm">
                            <h5 className="font-bold text-teal-800 text-lg mb-2">🔴 2. digitalWrite()</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>digitalWrite()</strong> function digital pin par HIGH ya LOW value bhejne ke liye use hota hai. Ye output devices jaise LED, buzzer aur relay ko control karne ke liye use hota hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(pin, value);</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-green-400">13</span><span className="text-gray-300">, </span><span className="text-blue-400">HIGH</span><span className="text-gray-300">);</span> <span className="text-gray-400">// LED ON</span></div>
                                    <div><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-green-400">13</span><span className="text-gray-300">, </span><span className="text-blue-400">LOW</span><span className="text-gray-300">);</span> <span className="text-gray-400">// LED OFF</span></div>
                                </div>
                                <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                                    <p className="text-xs font-bold text-teal-900 mb-1">⚡ Working & Uses:</p>
                                    <ul className="text-xs text-teal-800 space-y-1 ml-4 list-disc marker:text-teal-500">
                                        <li><strong>HIGH</strong> = 5 Volt Output</li>
                                        <li><strong>LOW</strong> = 0 Volt Output</li>
                                        <li>Uses: LED ON/OFF, Relay control, Buzzer control</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 3. digitalRead() */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-rose-100 shadow-sm">
                            <h5 className="font-bold text-rose-800 text-lg mb-2">🔴 3. digitalRead()</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>digitalRead()</strong> function digital input pin ki value read karne ke liye use hota hai. Ye function HIGH ya LOW value return karta hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">digitalRead</span><span className="text-gray-300">(pin);</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-orange-400">int</span> <span className="text-sky-300">value</span><span className="text-gray-300">;</span></div>
                                    <div><span className="text-sky-300">value</span> <span className="text-pink-400">=</span> <span className="text-sky-300">digitalRead</span><span className="text-gray-300">(</span><span className="text-green-400">2</span><span className="text-gray-300">);</span></div>
                                </div>
                                <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                                    <p className="text-xs font-bold text-rose-900 mb-1">⚡ Working & Uses:</p>
                                    <ul className="text-xs text-rose-800 space-y-1 ml-4 list-disc marker:text-rose-500">
                                        <li>Agar signal present ho: <strong>HIGH</strong></li>
                                        <li>Agar signal present na ho: <strong>LOW</strong></li>
                                        <li>Uses: Push button reading, Digital sensors, Switch monitoring</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 4. shiftIn() */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-orange-100 shadow-sm">
                            <h5 className="font-bold text-orange-800 text-lg mb-2">🔴 4. shiftIn()</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>shiftIn()</strong> function serial data ko bit-by-bit read karne ke liye use hota hai. Ye external devices se serial data receive karta hai aur usse byte me convert karta hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">shiftIn</span><span className="text-gray-300">(dataPin, clockPin, bitOrder);</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-orange-400">byte</span> <span className="text-sky-300">value</span><span className="text-gray-300">;</span></div>
                                    <div><span className="text-sky-300">value</span> <span className="text-pink-400">=</span> <span className="text-sky-300">shiftIn</span><span className="text-gray-300">(dataPin, clockPin, </span><span className="text-blue-400">MSBFIRST</span><span className="text-gray-300">);</span></div>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                                    <p className="text-xs font-bold text-orange-900 mb-1">⚡ Parameters & Uses:</p>
                                    <ul className="text-xs text-orange-800 space-y-1 ml-4 list-disc marker:text-orange-500">
                                        <li><strong>bitOrder</strong> → MSBFIRST ya LSBFIRST</li>
                                        <li>Uses: Shift registers, Serial communication, Sensor modules</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 5. shiftOut() */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-sky-100 shadow-sm">
                            <h5 className="font-bold text-sky-800 text-lg mb-2">🔴 5. shiftOut()</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>shiftOut()</strong> function serial form me data ko bit-by-bit transmit karne ke liye use hota hai. Ye Arduino se external devices ko serial data bhejta hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">shiftOut</span><span className="text-gray-300">(dataPin, clockPin, bitOrder, value);</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-sky-300">shiftOut</span><span className="text-gray-300">(dataPin, clockPin, </span><span className="text-blue-400">MSBFIRST</span><span className="text-gray-300">, </span><span className="text-green-400">255</span><span className="text-gray-300">);</span></div>
                                </div>
                                <div className="bg-sky-50 p-4 rounded-xl border border-sky-200">
                                    <p className="text-xs font-bold text-sky-900 mb-1">⚡ Parameters & Uses:</p>
                                    <ul className="text-xs text-sky-800 space-y-1 ml-4 list-disc marker:text-sky-500">
                                        <li><strong>value</strong> → Send ki jane wali value</li>
                                        <li>Uses: LED matrix, Shift register control, Serial devices</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 6. tone() & noTone() */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-purple-100 shadow-sm">
                            <h5 className="font-bold text-purple-800 text-lg mb-2">🔴 6. tone() & noTone()</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>tone()</strong> function buzzer ya speaker par specified frequency ki sound generate karta hai, aur <strong>noTone()</strong> us sound ko stop karne ke liye use hota hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax & Example</div>
                                    <div><span className="text-sky-300">tone</span><span className="text-gray-300">(pin, frequency, duration);</span></div>
                                    <br />
                                    <div><span className="text-sky-300">tone</span><span className="text-gray-300">(</span><span className="text-green-400">8</span><span className="text-gray-300">, </span><span className="text-green-400">1000</span><span className="text-gray-300">);</span> <span className="text-gray-400">// Pin 8, 1000Hz</span></div>
                                    <div><span className="text-sky-300">tone</span><span className="text-gray-300">(</span><span className="text-green-400">8</span><span className="text-gray-300">, </span><span className="text-green-400">1000</span><span className="text-gray-300">, </span><span className="text-green-400">500</span><span className="text-gray-300">);</span> <span className="text-gray-400">// For 500ms</span></div>
                                    <br />
                                    <div><span className="text-sky-300">noTone</span><span className="text-gray-300">(</span><span className="text-green-400">8</span><span className="text-gray-300">);</span> <span className="text-gray-400">// Stop sound on Pin 8</span></div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                                    <p className="text-xs font-bold text-purple-900 mb-1">⚡ Parameters & Uses:</p>
                                    <ul className="text-xs text-purple-800 space-y-1 ml-4 list-disc marker:text-purple-500">
                                        <li><strong>frequency</strong> → Sound frequency (Hz)</li>
                                        <li><strong>duration</strong> → Time in milliseconds (optional)</li>
                                        <li>Uses: Alarm system, Buzzer notification, Sound generation</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Quick Revision Table */}
                        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                            <table className="w-full text-left border-collapse bg-white">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                                        <th className="p-4 font-bold text-gray-800">Function</th>
                                        <th className="p-4 font-bold text-gray-800">Work</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-blue-700 bg-blue-50/30">pinMode()</td>
                                        <td className="p-4">Pin mode set karta hai (INPUT/OUTPUT)</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-emerald-700 bg-emerald-50/30">digitalWrite()</td>
                                        <td className="p-4">HIGH/LOW output bhejta hai</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-purple-700 bg-purple-50/30">digitalRead()</td>
                                        <td className="p-4">Digital input read karta hai</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-orange-700 bg-orange-50/30">shiftIn()</td>
                                        <td className="p-4">Serial data receive karta hai</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-pink-700 bg-pink-50/30">shiftOut()</td>
                                        <td className="p-4">Serial data send karta hai</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-indigo-700 bg-indigo-50/30">tone()</td>
                                        <td className="p-4">Sound generate karta hai</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-rose-700 bg-rose-50/30">noTone()</td>
                                        <td className="p-4">Sound stop karta hai</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Analog Functions ═══ */}
                    <Sec id="analog-functions" title="🔴 Inbuilt Functions for Analog Input and Output" icon={<Activity size={16} className="text-amber-500" />}>
                        <p className="mb-4 text-sm text-gray-700">Arduino me analog signals ko read aur generate karne ke liye kuch special inbuilt functions use kiye jate hain. Analog signals continuously change hote hain, isliye unhe process karne ke liye Arduino ke ADC (Analog to Digital Converter) aur PWM techniques ka use kiya jata hai.</p>

                        {/* 1. analogRead() */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-amber-100 shadow-sm">
                            <h5 className="font-bold text-amber-800 text-lg mb-2">🔴 1. analogRead()</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>analogRead()</strong> function analog input pins se analog voltage ko read karne ke liye use hota hai. Arduino Uno me 6 analog input pins hoti hain: <code className="bg-gray-100 px-1 py-0.5 rounded text-amber-800 font-mono text-xs">A0, A1, A2, A3, A4, A5</code>. Ye function analog signal ko digital value me convert karke return karta hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">analogRead</span><span className="text-gray-300">(pin);</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-orange-400">int</span> <span className="text-sky-300">sensorValue</span><span className="text-gray-300">;</span></div>
                                    <div><span className="text-sky-300">sensorValue</span> <span className="text-pink-400">=</span> <span className="text-sky-300">analogRead</span><span className="text-gray-300">(</span><span className="text-green-400">A0</span><span className="text-gray-300">);</span></div>
                                </div>
                                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                                    <p className="text-xs font-bold text-amber-900 mb-1">⚡ Return Value & Uses:</p>
                                    <ul className="text-xs text-amber-800 space-y-1 ml-4 list-disc marker:text-amber-500">
                                        <li>ADC 10-bit ka hota hai (Range: <strong>0 to 1023</strong>)</li>
                                        <li>0V → 0, 2.5V → 512, 5V → 1023</li>
                                        <li>Uses: LDR sensor, Temperature sensor, Potentiometer, Gas sensor</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 2. analogWrite() */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-rose-100 shadow-sm">
                            <h5 className="font-bold text-rose-800 text-lg mb-2">🔴 2. analogWrite()</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>analogWrite()</strong> function PWM (Pulse Width Modulation) signal generate karne ke liye use hota hai. Arduino Uno actual analog voltage generate nahi karta, balki PWM signal generate karta hai jo analog output jaisa behavior deta hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">analogWrite</span><span className="text-gray-300">(pin, value);</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-sky-300">analogWrite</span><span className="text-gray-300">(</span><span className="text-green-400">9</span><span className="text-gray-300">, </span><span className="text-green-400">128</span><span className="text-gray-300">);</span></div>
                                </div>
                                <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                                    <p className="text-xs font-bold text-rose-900 mb-1">⚡ Values & Uses:</p>
                                    <ul className="text-xs text-rose-800 space-y-1 ml-4 list-disc marker:text-rose-500">
                                        <li><strong>PWM Pins:</strong> 3, 5, 6, 9, 10, 11</li>
                                        <li><strong>Value Range:</strong> 0 se 255 tak</li>
                                        <li>0 = OFF, 127 = 50% Output, 255 = Fully ON</li>
                                        <li>Uses: LED brightness, Motor speed, Servo control</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* analogReference() */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-indigo-100 shadow-sm">
                            <h5 className="font-bold text-indigo-800 text-lg mb-2">🔴 analogReference()</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>analogReference()</strong> function ADC ke reference voltage ko select karne ke liye use hota hai. Reference voltage decide karti hai ki Arduino analog input ko kis voltage range ke according measure karega.</p>
                            
                            <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto mb-4">
                                <div className="text-gray-400 mb-1">// Syntax</div>
                                <div><span className="text-sky-300">analogReference</span><span className="text-gray-300">(type);</span></div>
                            </div>

                            <div className="space-y-4">
                                {/* DEFAULT */}
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                    <h6 className="font-bold text-indigo-900 text-sm mb-1">1. DEFAULT</h6>
                                    <p className="text-xs text-indigo-800 mb-2">DEFAULT reference me Arduino apni supply voltage (Uno me 5V) ko reference ke roop me use karta hai.</p>
                                    <div className="bg-white p-2 rounded border border-indigo-200 text-xs font-mono text-gray-700">
                                        <span className="text-sky-700">analogReference</span>(DEFAULT);<br/>
                                        <span className="text-gray-500">// ADC: 0V → 0 | 5V → 1023</span>
                                    </div>
                                </div>

                                {/* INTERNAL */}
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                    <h6 className="font-bold text-indigo-900 text-sm mb-1">2. INTERNAL</h6>
                                    <p className="text-xs text-indigo-800 mb-2">INTERNAL reference Arduino ke internal voltage source ko use karta hai (Uno me 1.1 Volt). Small voltage measurements me accuracy increase hoti hai.</p>
                                    <div className="bg-white p-2 rounded border border-indigo-200 text-xs font-mono text-gray-700">
                                        <span className="text-sky-700">analogReference</span>(INTERNAL);<br/>
                                        <span className="text-gray-500">// ADC: 0V → 0 | 1.1V → 1023</span>
                                    </div>
                                </div>

                                {/* INTERNAL1V1 */}
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                    <h6 className="font-bold text-indigo-900 text-sm mb-1">3. INTERNAL1V1</h6>
                                    <p className="text-xs text-indigo-800 mb-2">Ye specifically 1.1V internal reference ko select karta hai. (Precision sensors, Low voltage measurement).</p>
                                    <div className="bg-white p-2 rounded border border-indigo-200 text-xs font-mono text-gray-700">
                                        <span className="text-sky-700">analogReference</span>(INTERNAL1V1);
                                    </div>
                                </div>

                                {/* INTERNAL2V56 */}
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                    <h6 className="font-bold text-indigo-900 text-sm mb-1">4. INTERNAL2V56</h6>
                                    <p className="text-xs text-indigo-800 mb-2">Kuch Arduino boards me 2.56V internal reference available hota hai. (Medium voltage applications).</p>
                                    <div className="bg-white p-2 rounded border border-indigo-200 text-xs font-mono text-gray-700">
                                        <span className="text-sky-700">analogReference</span>(INTERNAL2V56);
                                    </div>
                                </div>

                                {/* EXTERNAL */}
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                    <h6 className="font-bold text-indigo-900 text-sm mb-1">5. EXTERNAL</h6>
                                    <p className="text-xs text-indigo-800 mb-2">EXTERNAL mode me user khud AREF pin par external reference voltage provide karta hai. Custom voltage range aur precision measurements ke liye use hota hai.</p>
                                    <div className="bg-white p-2 rounded border border-indigo-200 text-xs font-mono text-gray-700">
                                        <span className="text-sky-700">analogReference</span>(EXTERNAL);<br/>
                                        <span className="text-gray-500">// Example if AREF = 3.3V: 0V → 0 | 3.3V → 1023</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Revision Table */}
                        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                            <table className="w-full text-left border-collapse bg-white">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                                        <th className="p-4 font-bold text-gray-800">Function</th>
                                        <th className="p-4 font-bold text-gray-800">Work</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-amber-700 bg-amber-50/30">analogRead()</td>
                                        <td className="p-4">Analog input read karta hai</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-rose-700 bg-rose-50/30">analogWrite()</td>
                                        <td className="p-4">PWM output generate karta hai</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-indigo-700 bg-indigo-50/30">DEFAULT</td>
                                        <td className="p-4">5V reference</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-indigo-700 bg-indigo-50/30">INTERNAL</td>
                                        <td className="p-4">Internal reference voltage (1.1V for Uno)</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-indigo-700 bg-indigo-50/30">INTERNAL1V1</td>
                                        <td className="p-4">1.1V reference</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-indigo-700 bg-indigo-50/30">INTERNAL2V56</td>
                                        <td className="p-4">2.56V reference</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-indigo-700 bg-indigo-50/30">EXTERNAL</td>
                                        <td className="p-4">External reference voltage (via AREF pin)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Time Functions ═══ */}
                    <Sec id="time-functions" title="🔴 Inbuilt Functions for Time" icon={<Clock size={16} className="text-pink-500" />}>
                        <p className="mb-4 text-sm text-gray-700">Arduino me time-related operations perform karne ke liye kuch important inbuilt functions available hote hain. In functions ka use delay create karne, execution time measure karne aur timing control karne ke liye kiya jata hai. Ye functions LEDs blinking, sensor timing, motor control aur automation projects me bahut useful hote hain.</p>

                        {/* 1. delay() */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-pink-100 shadow-sm">
                            <h5 className="font-bold text-pink-800 text-lg mb-2">🔴 1. delay()</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>delay()</strong> function program execution ko specified milliseconds ke liye stop kar deta hai. Jab delay function execute hota hai to Arduino us duration tak next instruction execute nahi karta.</p>
                            <div className="bg-pink-50 text-pink-800 text-sm font-semibold p-2 rounded-lg border border-pink-200 mb-3 w-fit">
                                👉 &quot;delay() = Program ko kuch samay ke liye rokna&quot;
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">delay</span><span className="text-gray-300">(time);</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-green-400">13</span><span className="text-gray-300">, </span><span className="text-blue-400">HIGH</span><span className="text-gray-300">);</span></div>
                                    <div><span className="text-sky-300">delay</span><span className="text-gray-300">(</span><span className="text-green-400">1000</span><span className="text-gray-300">);</span> <span className="text-gray-400">// 1 second wait</span></div>
                                    <div><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-green-400">13</span><span className="text-gray-300">, </span><span className="text-blue-400">LOW</span><span className="text-gray-300">);</span></div>
                                </div>
                                <div className="bg-pink-50 p-4 rounded-xl border border-pink-200">
                                    <p className="text-xs font-bold text-pink-900 mb-1">⚡ Working & Uses:</p>
                                    <ul className="text-xs text-pink-800 space-y-1 ml-4 list-disc marker:text-pink-500">
                                        <li><strong>1000</strong> ms = 1 Second</li>
                                        <li><strong>500</strong> ms = 0.5 Second</li>
                                        <li>LED 1 second ON rahegi fir next instruction chalega.</li>
                                        <li>Uses: LED blinking, Traffic light control, Alarm systems</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 2. delayMicroseconds() */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-purple-100 shadow-sm">
                            <h5 className="font-bold text-purple-800 text-lg mb-2">🔴 2. delayMicroseconds()</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>delayMicroseconds()</strong> function microsecond level ka delay generate karta hai. Ye bahut small timing requirements ke liye use hota hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">delayMicroseconds</span><span className="text-gray-300">(time);</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-green-400">13</span><span className="text-gray-300">, </span><span className="text-blue-400">HIGH</span><span className="text-gray-300">);</span></div>
                                    <div><span className="text-sky-300">delayMicroseconds</span><span className="text-gray-300">(</span><span className="text-green-400">500</span><span className="text-gray-300">);</span></div>
                                    <div><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-green-400">13</span><span className="text-gray-300">, </span><span className="text-blue-400">LOW</span><span className="text-gray-300">);</span></div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                                    <p className="text-xs font-bold text-purple-900 mb-1">⚡ Relations & Uses:</p>
                                    <ul className="text-xs text-purple-800 space-y-1 ml-4 list-disc marker:text-purple-500">
                                        <li>1000 Microseconds = <strong>1 Millisecond</strong></li>
                                        <li>1000000 Microseconds = <strong>1 Second</strong></li>
                                        <li>Uses: Pulse generation, Ultrasonic sensor timing, High-speed switching</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 3. millis() */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-blue-100 shadow-sm">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">🔴 3. millis()</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>millis()</strong> function Arduino start hone ke baad se kitne milliseconds beet chuke hain wo return karta hai. Ye function timer ki tarah kaam karta hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">millis</span><span className="text-gray-300">();</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-orange-400">unsigned long</span> <span className="text-sky-300">time</span><span className="text-gray-300">;</span></div>
                                    <div><span className="text-sky-300">time</span> <span className="text-pink-400">=</span> <span className="text-sky-300">millis</span><span className="text-gray-300">();</span></div>
                                    <div><span className="text-sky-300">Serial.println</span><span className="text-gray-300">(time);</span></div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                    <p className="text-xs font-bold text-blue-900 mb-1">⚡ Return Type & Uses:</p>
                                    <ul className="text-xs text-blue-800 space-y-1 ml-4 list-disc marker:text-blue-500">
                                        <li>Return Type: <strong>unsigned long</strong></li>
                                        <li>Agar Arduino 5 second se chal raha hai, to <strong>5000</strong> return karega.</li>
                                        <li>Uses: Time measurement, Non-blocking delay</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="bg-blue-100 text-blue-900 text-xs p-3 rounded-xl border border-blue-300 mt-4 shadow-sm flex items-start gap-2">
                                <span className="text-lg leading-none">💡</span>
                                <div>
                                    <strong>Advantage over delay():</strong> delay() program ko rok deta hai. Lekin millis() program ko roke bina time measure karta hai. Isliye professional projects me millis() zyada use hota hai.
                                </div>
                            </div>
                        </div>

                        {/* 4. micros() */}
                        <div className="p-5 rounded-2xl mb-4 bg-white border border-teal-100 shadow-sm">
                            <h5 className="font-bold text-teal-800 text-lg mb-2">🔴 4. micros()</h5>
                            <p className="text-sm text-gray-600 mb-3"><strong>micros()</strong> function Arduino start hone ke baad se kitne microseconds beet chuke hain wo return karta hai. Ye millis() se bhi jyada accurate timing provide karta hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-xs shadow-inner overflow-x-auto">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">micros</span><span className="text-gray-300">();</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-orange-400">unsigned long</span> <span className="text-sky-300">time</span><span className="text-gray-300">;</span></div>
                                    <div><span className="text-sky-300">time</span> <span className="text-pink-400">=</span> <span className="text-sky-300">micros</span><span className="text-gray-300">();</span></div>
                                    <div><span className="text-sky-300">Serial.println</span><span className="text-gray-300">(time);</span></div>
                                </div>
                                <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                                    <p className="text-xs font-bold text-teal-900 mb-1">⚡ Return Type & Uses:</p>
                                    <ul className="text-xs text-teal-800 space-y-1 ml-4 list-disc marker:text-teal-500">
                                        <li>Return Type: <strong>unsigned long</strong></li>
                                        <li>Agar 250 microseconds beet chuke hain, to <strong>250</strong> return karega.</li>
                                        <li>Uses: High-speed timing, Pulse width measurement</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Differences Table */}
                        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 shadow-sm mb-6">
                            <table className="w-full text-left border-collapse bg-white">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                                        <th className="p-4 font-bold text-gray-800">Feature</th>
                                        <th className="p-4 font-bold text-blue-700">millis()</th>
                                        <th className="p-4 font-bold text-teal-700">micros()</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-semibold text-gray-800">Unit</td>
                                        <td className="p-4 text-blue-800 bg-blue-50/20">Milliseconds</td>
                                        <td className="p-4 text-teal-800 bg-teal-50/20">Microseconds</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-semibold text-gray-800">Accuracy</td>
                                        <td className="p-4 text-blue-800 bg-blue-50/20">Lower</td>
                                        <td className="p-4 text-teal-800 bg-teal-50/20">Higher</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-semibold text-gray-800">Measurement</td>
                                        <td className="p-4 text-blue-800 bg-blue-50/20">Normal timing</td>
                                        <td className="p-4 text-teal-800 bg-teal-50/20">Very precise timing</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-semibold text-gray-800">Common Use</td>
                                        <td className="p-4 text-blue-800 bg-blue-50/20">General projects</td>
                                        <td className="p-4 text-teal-800 bg-teal-50/20">High-speed applications</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Quick Revision Table */}
                        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                            <table className="w-full text-left border-collapse bg-white">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                                        <th className="p-4 font-bold text-gray-800">Function</th>
                                        <th className="p-4 font-bold text-gray-800">Work</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-pink-700 bg-pink-50/30">delay()</td>
                                        <td className="p-4">Milliseconds delay</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-purple-700 bg-purple-50/30">delayMicroseconds()</td>
                                        <td className="p-4">Microseconds delay</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-blue-700 bg-blue-50/30">millis()</td>
                                        <td className="p-4">Arduino start se milliseconds count</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-teal-700 bg-teal-50/30">micros()</td>
                                        <td className="p-4">Arduino start se microseconds count</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Math Functions ═══ */}
                    <Sec id="math-functions" title="🔴 Inbuilt Functions of Math" icon={<Activity size={16} className="text-sky-500" />}>
                        <p className="mb-5 text-sm text-gray-700">Arduino aur Embedded C me mathematical calculations ko easy banane ke liye kai inbuilt math functions available hote hain. In functions ki madad se programmer bina complex formulas likhe calculations perform kar sakta hai. Ye functions scientific calculations, sensor data processing aur engineering applications me bahut useful hote hain.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                            {/* 1. abs() */}
                            <div className="p-4 rounded-xl bg-white border border-sky-100 shadow-sm">
                                <h4 className="font-bold text-sky-900 text-base mb-2">🔴 1. abs()</h4>
                                <p className="text-xs text-gray-600 mb-3">abs() function kisi number ki absolute value return karta hai (number ka positive value).</p>
                                <div className="bg-gray-900 p-3 rounded-xl font-mono text-xs shadow-inner overflow-x-auto mb-3">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">abs</span><span className="text-gray-300">(x);</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-sky-300">abs</span><span className="text-gray-300">(-</span><span className="text-green-400">25</span><span className="text-gray-300">);</span> <span className="text-gray-400">// Output: 25</span></div>
                                </div>
                                <div className="bg-sky-50 p-2 rounded-lg">
                                    <p className="text-[11px] font-bold text-sky-800">🛠️ Uses:</p>
                                    <p className="text-[11px] text-sky-700">Distance calculation, Error calculation, Sensor value comparison</p>
                                </div>
                            </div>

                            {/* 2. max() */}
                            <div className="p-4 rounded-xl bg-white border border-sky-100 shadow-sm">
                                <h4 className="font-bold text-sky-900 text-base mb-2">🔴 2. max()</h4>
                                <p className="text-xs text-gray-600 mb-3">max() function do values me se badi value return karta hai.</p>
                                <div className="bg-gray-900 p-3 rounded-xl font-mono text-xs shadow-inner overflow-x-auto mb-3">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">max</span><span className="text-gray-300">(x, y);</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-sky-300">max</span><span className="text-gray-300">(</span><span className="text-green-400">10</span><span className="text-gray-300">, </span><span className="text-green-400">20</span><span className="text-gray-300">);</span> <span className="text-gray-400">// Output: 20</span></div>
                                </div>
                                <div className="bg-sky-50 p-2 rounded-lg">
                                    <p className="text-[11px] font-bold text-sky-800">🛠️ Uses:</p>
                                    <p className="text-[11px] text-sky-700">Maximum sensor value finding, Comparison operations</p>
                                </div>
                            </div>

                            {/* 3. min() */}
                            <div className="p-4 rounded-xl bg-white border border-sky-100 shadow-sm">
                                <h4 className="font-bold text-sky-900 text-base mb-2">🔴 3. min()</h4>
                                <p className="text-xs text-gray-600 mb-3">min() function do values me se chhoti value return karta hai.</p>
                                <div className="bg-gray-900 p-3 rounded-xl font-mono text-xs shadow-inner overflow-x-auto mb-3">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">min</span><span className="text-gray-300">(x, y);</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-sky-300">min</span><span className="text-gray-300">(</span><span className="text-green-400">10</span><span className="text-gray-300">, </span><span className="text-green-400">20</span><span className="text-gray-300">);</span> <span className="text-gray-400">// Output: 10</span></div>
                                </div>
                                <div className="bg-sky-50 p-2 rounded-lg">
                                    <p className="text-[11px] font-bold text-sky-800">🛠️ Uses:</p>
                                    <p className="text-[11px] text-sky-700">Minimum value detection, Range checking</p>
                                </div>
                            </div>

                            {/* 4. pow() */}
                            <div className="p-4 rounded-xl bg-white border border-sky-100 shadow-sm">
                                <h4 className="font-bold text-sky-900 text-base mb-2">🔴 4. pow()</h4>
                                <p className="text-xs text-gray-600 mb-3">pow() function kisi number ki power calculate karta hai.</p>
                                <div className="bg-gray-900 p-3 rounded-xl font-mono text-xs shadow-inner overflow-x-auto mb-3">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">pow</span><span className="text-gray-300">(base, exponent);</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-sky-300">pow</span><span className="text-gray-300">(</span><span className="text-green-400">2</span><span className="text-gray-300">, </span><span className="text-green-400">3</span><span className="text-gray-300">);</span> <span className="text-gray-400">// 2³ = 8</span></div>
                                </div>
                                <div className="bg-sky-50 p-2 rounded-lg">
                                    <p className="text-[11px] font-bold text-sky-800">🛠️ Uses:</p>
                                    <p className="text-[11px] text-sky-700">Mathematical calculations, Scientific formulas</p>
                                </div>
                            </div>

                            {/* 5. sqrt() */}
                            <div className="p-4 rounded-xl bg-white border border-sky-100 shadow-sm">
                                <h4 className="font-bold text-sky-900 text-base mb-2">🔴 5. sqrt()</h4>
                                <p className="text-xs text-gray-600 mb-3">sqrt() function kisi number ka square root calculate karta hai.</p>
                                <div className="bg-gray-900 p-3 rounded-xl font-mono text-xs shadow-inner overflow-x-auto mb-3">
                                    <div className="text-gray-400 mb-1">// Syntax</div>
                                    <div><span className="text-sky-300">sqrt</span><span className="text-gray-300">(number);</span></div>
                                    <div className="text-gray-400 mt-2">// Example</div>
                                    <div><span className="text-sky-300">sqrt</span><span className="text-gray-300">(</span><span className="text-green-400">64</span><span className="text-gray-300">);</span> <span className="text-gray-400">// Output: 8</span></div>
                                </div>
                                <div className="bg-sky-50 p-2 rounded-lg">
                                    <p className="text-[11px] font-bold text-sky-800">🛠️ Uses:</p>
                                    <p className="text-[11px] text-sky-700">Engineering calculations, Distance measurement, Mathematical operations</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Revision Table (Math Functions) */}
                        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                            <table className="w-full text-left border-collapse bg-white">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                                        <th className="p-4 font-bold text-gray-800">Function</th>
                                        <th className="p-4 font-bold text-gray-800">Work</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-sky-700 bg-sky-50/30">abs()</td>
                                        <td className="p-4">Absolute value</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-sky-700 bg-sky-50/30">max()</td>
                                        <td className="p-4">Maximum value</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-sky-700 bg-sky-50/30">min()</td>
                                        <td className="p-4">Minimum value</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-sky-700 bg-sky-50/30">pow()</td>
                                        <td className="p-4">Power calculation</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-sky-700 bg-sky-50/30">sqrt()</td>
                                        <td className="p-4">Square root</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Character Functions ═══ */}
                    <Sec id="char-functions" title="🔴 Inbuilt Functions for Characters" icon={<Braces size={16} className="text-purple-500" />}>
                        <p className="mb-5 text-sm text-gray-700">Character handling functions characters ko identify aur verify karne ke liye use kiye jate hain. Ye functions text processing, password checking aur input validation me bahut useful hote hain.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { name: 'isAlpha', desc: 'Check karta hai ki character alphabet hai ya nahi.', example: "isAlpha('A')", output: 'TRUE' },
                                { name: 'isAlphaNumeric', desc: 'Check karta hai ki character alphabet ya number hai ya nahi.', example: "isAlphaNumeric('7')", output: 'TRUE' },
                                { name: 'isAscii', desc: 'Check karta hai ki character ASCII character hai ya nahi.', example: "isAscii('A')", output: 'TRUE' },
                                { name: 'isDigit', desc: 'Check karta hai ki character digit (0–9) hai ya nahi.', example: "isDigit('8')", output: 'TRUE' },
                                { name: 'isSpace', desc: 'Check karta hai ki character space hai ya nahi.', example: "isSpace(' ')", output: 'TRUE' },
                                { name: 'isGraph', desc: 'Check karta hai ki printable visible character hai ya nahi (Space include nahi).', example: "isGraph('A')", output: 'TRUE' },
                                { name: 'isHexadecimalDigit', desc: 'Check karta hai ki character hexadecimal digit (0-9, A-F, a-f) hai ya nahi.', example: "isHexadecimalDigit('F')", output: 'TRUE' },
                                { name: 'isLowerCase', desc: 'Check karta hai ki character lowercase alphabet hai ya nahi.', example: "isLowerCase('a')", output: 'TRUE' },
                                { name: 'isUpperCase', desc: 'Check karta hai ki character uppercase alphabet hai ya nahi.', example: "isUpperCase('A')", output: 'TRUE' },
                            ].map((f, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                    <h5 className="font-bold text-purple-900 text-base mb-2">🔴 {i + 1}. {f.name}()</h5>
                                    <p className="text-xs text-gray-600 mb-3">{f.desc}</p>
                                    <div className="bg-gray-900 p-2.5 rounded-xl font-mono text-[11px] shadow-inner overflow-x-auto">
                                        <div className="text-gray-400 mb-1">// Example</div>
                                        <div>
                                            <span className="text-sky-300">{f.name}</span>
                                            <span className="text-pink-400">(</span>
                                            <span className="text-orange-400">'</span>
                                            <span className="text-green-400">{f.example.substring(f.example.indexOf('(') + 2, f.example.indexOf(')') - 1)}</span>
                                            <span className="text-orange-400">'</span>
                                            <span className="text-pink-400">)</span>
                                            <span className="text-gray-400">;</span>
                                        </div>
                                        <div className="text-purple-400 mt-1">// Output: {f.output}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Practical – LDR ═══ */}
                    <LDRPracticalSection />

                    {/* ═══ SECTION: Practical – Ultrasonic Sensor HC-SR04 ═══ */}
                    <UltrasonicPracticalSection />

                    {/* ═══ SECTION: Practical – PIR Sensor ═══ */}
                    <PIRPracticalSection />

                    {/* ═══ SECTION: Practical – IR Sensor ═══ */}
                    <IRPracticalSection />

                    {/* ═══ SECTION: Practical – DHT11 Sensor ═══ */}
                    <DHTSensorPracticalSection />

                    {/* ═══ SECTION: Practical – Fading LED ═══ */}
                    <FadingLEDPracticalSection />

                    {/* ═══ SECTION: Practical – Bluetooth LED ═══ */}
                    <BluetoothLEDPracticalSection />
                </main>
            </div>
        </div>
    );
}

function LDRPracticalSection() {
    const [lightLevel, setLightLevel] = useState(20);
    const [isAnimating, setIsAnimating] = useState(false);

    const isDark = lightLevel <= 30;
    const sensorValue = Math.round((1 - lightLevel / 100) * 1023);
    const ledOn = sensorValue >= 900;

    useEffect(() => {
        if (ledOn) {
            const t = setInterval(() => setIsAnimating(p => !p), 700);
            return () => clearInterval(t);
        }
        setIsAnimating(false);
    }, [ledOn]);

    const ldrResistance = isDark ? '1 MΩ (high)' : '300 Ω (low)';

    return (
        <section id="ldr-practical" className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg bg-white" style={{ border: '1px solid #fed7aa', boxShadow: '0 1px 3px rgba(249,115,22,0.08)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #fff7ed' }}>
                <FlaskConical size={16} className="text-orange-500" />
                <h2 className="text-base md:text-lg font-extrabold text-gray-800">🔬 Practical – LDR (Light Dependent Resistor)</h2>
            </div>

            <div className="rounded-xl p-4 mb-6 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fed7aa', color: '#9a3412' }}>
                🌟 Is practical mein hum <strong>LDR sensor</strong> se light ka level detect karenge aur uske aadhar par <strong>LED ko automatically ON/OFF</strong> karenge, Arduino ki madad se.
            </div>

            {/* Interactive Simulator */}
            <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5 mb-6">
                <p className="text-xs font-bold text-orange-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={12} /> Interactive Simulator — Light level adjust karo aur dekhlo kya hota hai!
                </p>

                <div className="mb-4">
                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                        <span>🌑 Andhera (Dark)</span>
                        <span>☀️ Roshan (Bright)</span>
                    </div>
                    <input
                        type="range" min={0} max={100} value={lightLevel}
                        onChange={e => setLightLevel(Number(e.target.value))}
                        className="w-full h-3 rounded-full outline-none cursor-pointer"
                        style={{
                            WebkitAppearance: 'none',
                            background: `linear-gradient(90deg, #1e293b ${lightLevel}%, #fbbf24 ${lightLevel}%, #fef3c7 100%)`,
                        } as React.CSSProperties}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                    <div className="flex justify-center">
                        <svg viewBox="0 0 300 320" className="w-full max-w-xs" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.10))' }}>
                            <rect width="300" height="320" rx="16" fill="#1e293b" />
                            <text x="140" y="22" fill="#f87171" fontSize="11" fontWeight="bold" fontFamily="monospace">+5V</text>
                            <line x1="150" y1="24" x2="150" y2="55" stroke="#f87171" strokeWidth="2" />
                            <rect x="125" y="55" width="50" height="30" rx="6" fill={isDark ? '#7c3aed' : '#f59e0b'} opacity="0.85" />
                            <text x="150" y="75" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">LDR</text>
                            {!isDark && [0,45,90,135,180,225,270,315].map((angle, i) => (
                                <line key={i}
                                    x1={150 + 30 * Math.cos(angle * Math.PI / 180)}
                                    y1={70 + 30 * Math.sin(angle * Math.PI / 180)}
                                    x2={150 + 40 * Math.cos(angle * Math.PI / 180)}
                                    y2={70 + 40 * Math.sin(angle * Math.PI / 180)}
                                    stroke="#fbbf24" strokeWidth="1.5" opacity="0.7"
                                />
                            ))}
                            <line x1="150" y1="85" x2="150" y2="120" stroke="#94a3b8" strokeWidth="2" />
                            <circle cx="150" cy="120" r="4" fill="#38bdf8" />
                            <line x1="150" y1="120" x2="240" y2="120" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5,3" />
                            <rect x="242" y="110" width="40" height="20" rx="5" fill="#0ea5e9" opacity="0.9" />
                            <text x="262" y="124" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">A0</text>
                            <rect x="125" y="130" width="50" height="28" rx="6" fill="#374151" stroke="#6b7280" strokeWidth="1" />
                            <text x="150" y="148" textAnchor="middle" fill="#d1d5db" fontSize="9" fontWeight="bold" fontFamily="monospace">10kΩ</text>
                            <line x1="150" y1="158" x2="150" y2="185" stroke="#94a3b8" strokeWidth="2" />
                            <line x1="130" y1="185" x2="170" y2="185" stroke="#64748b" strokeWidth="2.5" />
                            <line x1="136" y1="191" x2="164" y2="191" stroke="#64748b" strokeWidth="2" />
                            <line x1="142" y1="197" x2="158" y2="197" stroke="#64748b" strokeWidth="1.5" />
                            <text x="150" y="210" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">GND</text>
                            <line x1="20" y1="225" x2="280" y2="225" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
                            <text x="60" y="248" fill="#94a3b8" fontSize="9" fontFamily="monospace">Pin 13</text>
                            <line x1="100" y1="245" x2="165" y2="245" stroke="#94a3b8" strokeWidth="2" />
                            <rect x="165" y="234" width="35" height="20" rx="5" fill="#374151" stroke="#6b7280" strokeWidth="1" />
                            <text x="182" y="248" textAnchor="middle" fill="#d1d5db" fontSize="8" fontWeight="bold" fontFamily="monospace">220Ω</text>
                            <polygon points="200,235 220,245 200,255" fill={ledOn ? (isAnimating ? '#fbbf24' : '#f97316') : '#374151'} stroke={ledOn ? '#fb923c' : '#4b5563'} strokeWidth="1.5" />
                            <line x1="220" y1="235" x2="220" y2="255" stroke={ledOn ? '#fb923c' : '#4b5563'} strokeWidth="2" />
                            {ledOn && <circle cx="210" cy="245" r={isAnimating ? 18 : 14} fill="#fbbf24" opacity="0.15" />}
                            <text x="232" y="242" fill={ledOn ? '#fbbf24' : '#4b5563'} fontSize="9" fontFamily="monospace">LED</text>
                            <text x="232" y="253" fill={ledOn ? '#f97316' : '#4b5563'} fontSize="8" fontFamily="monospace">{ledOn ? 'ON' : 'OFF'}</text>
                            <line x1="220" y1="255" x2="220" y2="275" stroke="#94a3b8" strokeWidth="2" />
                            <line x1="205" y1="275" x2="235" y2="275" stroke="#64748b" strokeWidth="2.5" />
                            <line x1="210" y1="281" x2="230" y2="281" stroke="#64748b" strokeWidth="2" />
                            <line x1="215" y1="287" x2="225" y2="287" stroke="#64748b" strokeWidth="1.5" />
                            <text x="220" y="300" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">GND</text>
                        </svg>
                    </div>

                    <div className="space-y-3">
                        <div className="p-3 rounded-xl" style={{ background: isDark ? '#0f172a' : '#fefce8', border: `1px solid ${isDark ? '#1e3a5f' : '#fde68a'}` }}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold" style={{ color: isDark ? '#93c5fd' : '#b45309' }}>💡 Light Level</span>
                                <span className="text-xs font-mono font-bold" style={{ color: isDark ? '#60a5fa' : '#d97706' }}>{lightLevel}%</span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden" style={{ background: isDark ? '#1e293b' : '#fef3c7' }}>
                                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${lightLevel}%`, background: isDark ? 'linear-gradient(90deg,#3b82f6,#8b5cf6)' : 'linear-gradient(90deg,#fbbf24,#f97316)' }} />
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                            <p className="text-xs font-bold text-slate-400 mb-1 font-mono">analogRead(A0)</p>
                            <p className="text-2xl font-black font-mono" style={{ color: sensorValue >= 900 ? '#f97316' : '#38bdf8' }}>{sensorValue}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-1">Range: 0 – 1023</p>
                        </div>

                        <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                            <p className="text-xs font-bold text-purple-800 mb-1">⚡ LDR Resistance</p>
                            <p className="text-sm font-bold text-purple-600">{ldrResistance}</p>
                        </div>

                        <div className="p-3 rounded-xl border transition-all duration-500" style={{ background: ledOn ? '#fff7ed' : '#f8fafc', border: `1px solid ${ledOn ? '#fed7aa' : '#e2e8f0'}` }}>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full transition-all duration-500 flex items-center justify-center" style={{ background: ledOn ? '#f97316' : '#cbd5e1', boxShadow: ledOn && isAnimating ? '0 0 12px #f97316' : 'none' }}>
                                    <Lightbulb size={11} className={ledOn ? 'text-white' : 'text-slate-700'} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold" style={{ color: ledOn ? '#ea580c' : '#475569' }}>LED {ledOn ? 'ON 🔆' : 'OFF 🌑'}</p>
                                    <p className="text-[10px]" style={{ color: ledOn ? '#c2410c' : '#475569' }}>{ledOn ? 'Andhera detect hua!' : 'Roshni hai, LED off'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 font-mono">
                            <p className="text-[10px] text-gray-400 mb-1">📟 Serial Monitor</p>
                            <p className="text-[11px]" style={{ color: ledOn ? '#4ade80' : '#94a3b8' }}>
                                {ledOn ? `${sensorValue}\nLed on` : 'Led off'}
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-[10px] text-orange-700 mt-3 text-center font-medium">⬆️ Slider ko left mein le jao (dark) — LED on ho jayegi! Right le jao (bright) — LED off!</p>
            </div>

            {/* Program Code */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#1e293b' }}>
                    <FileCode2 size={14} className="text-orange-400" />
                    <span className="text-xs font-bold text-orange-300 tracking-wide">Arduino Program — LDR.ino</span>
                    <div className="ml-auto flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                </div>
                <div className="bg-gray-950 p-4 font-mono text-xs leading-7 overflow-x-auto">
                    <div><span className="text-sky-400">int</span> <span className="text-green-300">sensorPin</span> <span className="text-gray-400">=</span> <span className="text-orange-400">A0</span><span className="text-gray-400">;</span> <span className="text-gray-400">// LDR analog pin</span></div>
                    <div><span className="text-sky-400">int</span> <span className="text-green-300">led</span> <span className="text-gray-400">=</span> <span className="text-orange-400">13</span><span className="text-gray-400">;</span> <span className="text-gray-400">// LED pin</span></div>
                    <div className="mt-2"><span className="text-purple-400">void</span> <span className="text-yellow-300">setup</span><span className="text-gray-300">()</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-4"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">begin</span><span className="text-gray-300">(</span><span className="text-orange-400">9600</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-sky-300">pinMode</span><span className="text-gray-300">(</span><span className="text-green-300">led</span><span className="text-gray-300">,</span> <span className="text-orange-400">OUTPUT</span><span className="text-gray-300">);</span></div>
                    <div><span className="text-gray-300">{'}'}</span></div>
                    <div className="mt-2"><span className="text-purple-400">void</span> <span className="text-yellow-300">loop</span><span className="text-gray-300">()</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-4"><span className="text-sky-400">int</span> <span className="text-green-300">value</span> <span className="text-gray-400">=</span> <span className="text-sky-300">analogRead</span><span className="text-gray-300">(</span><span className="text-green-300">sensorPin</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4 mt-2"><span className="text-purple-400">if</span><span className="text-gray-300">(value &lt;=</span> <span className="text-orange-400">100</span><span className="text-gray-300">)</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-8"><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-green-300">led</span><span className="text-gray-300">,</span> <span className="text-orange-400">HIGH</span><span className="text-gray-300">);</span></div>
                    <div className="ml-8"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">println</span><span className="text-gray-300">(</span><span className="text-green-300">value</span><span className="text-gray-300">);</span></div>
                    <div className="ml-8"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">println</span><span className="text-gray-300">(</span><span className="text-amber-400">&quot;Led on&quot;</span><span className="text-gray-300">);</span></div>
                    <div className="ml-8"><span className="text-sky-300">delay</span><span className="text-gray-300">(</span><span className="text-orange-400">1000</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-gray-300">{'}'}</span></div>
                    <div className="ml-4 mt-1"><span className="text-purple-400">else</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-8"><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-green-300">led</span><span className="text-gray-300">,</span> <span className="text-orange-400">LOW</span><span className="text-gray-300">);</span></div>
                    <div className="ml-8"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">println</span><span className="text-gray-300">(</span><span className="text-amber-400">&quot;Led off&quot;</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-gray-300">{'}'}</span></div>
                    <div><span className="text-gray-300">{'}'}</span></div>
                </div>
            </div>

            {/* Materials and Connections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50">
                    <h3 className="text-sm font-extrabold text-amber-900 mb-3 flex items-center gap-2">
                        <Wrench size={14} /> आवश्यक सामग्री (Materials Required)
                    </h3>
                    <ul className="space-y-2">
                        {[
                            { label: 'Arduino Board (Uno R3)', icon: '🟦' },
                            { label: 'LDR (Light Dependent Resistor)', icon: '💡' },
                            { label: '10 KΩ Resistor', icon: '🔴' },
                            { label: 'LED', icon: '💛' },
                            { label: 'Bread Board', icon: '🔲' },
                            { label: 'Jumper Wires', icon: '🔗' },
                        ].map((m, i) => (
                            <li key={i} className="flex items-center gap-2.5 text-sm text-amber-900 bg-white rounded-lg px-3 py-2 border border-amber-100 shadow-sm">
                                <span>{m.icon}</span><span className="font-semibold">{m.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 rounded-2xl border border-sky-100 bg-sky-50">
                    <h3 className="text-sm font-extrabold text-sky-900 mb-3 flex items-center gap-2">
                        <CircuitBoard size={14} /> Circuit Connection
                    </h3>
                    <ol className="space-y-2">
                        {[
                            { step: 'LDR का एक terminal 5V pin से connect करें।', color: 'text-red-600' },
                            { step: 'LDR का दूसरा terminal 10KΩ resistor से connect करें।', color: 'text-orange-600' },
                            { step: 'Resistor का दूसरा terminal Ground से connect करें।', color: 'text-gray-600' },
                            { step: 'LDR और resistor के बीच का point Analog Pin A0 से connect करें।', color: 'text-sky-700' },
                            { step: 'LED का cathode (–) सिरा Ground से connect करें।', color: 'text-gray-600' },
                            { step: 'LED का anode (+) सिरा 220Ω resistor से, और resistor Pin 13 से connect करें।', color: 'text-emerald-700' },
                        ].map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-sky-900">
                                <span className="w-5 h-5 flex-shrink-0 rounded-full bg-sky-700 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                                <span className={`font-medium ${c.color}`}>{c.step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Working Principle */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 mb-6">
                <h3 className="text-sm font-extrabold text-violet-900 mb-4 flex items-center gap-2">
                    <Activity size={14} /> 🔹 कार्य प्रणाली (Working Principle)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { icon: '🌞', heading: 'Bright Light', body: 'LDR का resistance कम होता है → Voltage divider से A0 पर high voltage → analogRead value अधिक (>100) → LED OFF', bg: 'bg-yellow-50', border: 'border-yellow-200', tc: 'text-yellow-900' },
                        { icon: '🌑', heading: 'Dark / Low Light', body: 'LDR का resistance बढ़ता है → A0 पर low voltage → analogRead value कम (≤100) → LED ON होती है', bg: 'bg-slate-800', border: 'border-slate-600', tc: 'text-slate-100' },
                        { icon: '📊', heading: 'Analog to Digital', body: 'Arduino की Analog pin 0–5V voltage को 0–1023 digital value में convert करती है। यही ADC (Analog to Digital Converter) है।', bg: 'bg-sky-50', border: 'border-sky-200', tc: 'text-sky-900' },
                        { icon: '💻', heading: 'Serial Monitor', body: 'Serial.println() से value और status print होता है। Arduino IDE में Serial Monitor (9600 baud) खोलकर output देख सकते हैं।', bg: 'bg-emerald-50', border: 'border-emerald-200', tc: 'text-emerald-900' },
                    ].map((w, i) => (
                        <div key={i} className={`p-3 rounded-xl ${w.bg} border ${w.border}`}>
                            <p className={`text-xs font-bold ${w.tc} mb-1`}>{w.icon} {w.heading}</p>
                            <p className={`text-[11px] ${w.tc} leading-relaxed`}>{w.body}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Flowchart */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                <h3 className="text-sm font-extrabold text-gray-800 mb-4 flex items-center gap-2">
                    <ChevronRight size={14} className="text-orange-500" /> Program Flow (Flowchart)
                </h3>
                <div className="flex flex-col items-center gap-0 text-center text-xs font-semibold">
                    {([
                        { label: 'START', style: { background: '#059669', color: 'white', borderRadius: '50px' } as React.CSSProperties },
                        null,
                        { label: 'Serial.begin(9600) | pinMode(led, OUTPUT)', style: { background: '#eff6ff', border: '1.5px solid #93c5fd', color: '#1e40af', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'value = analogRead(A0)', style: { background: '#fef3c7', border: '1.5px solid #fcd34d', color: '#92400e', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'value <= 100?', style: { background: '#fce7f3', border: '1.5px solid #f9a8d4', color: '#9d174d', borderRadius: '50px' } as React.CSSProperties },
                        null,
                        { label: 'YES: digitalWrite HIGH | Serial.println(value) | Serial.println("Led on") | delay(1000)', style: { background: '#ecfdf5', border: '1.5px solid #6ee7b7', color: '#065f46', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'NO: digitalWrite LOW | Serial.println("Led off")', style: { background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#991b1b', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: '↩ loop() repeats', style: { background: '#f5f3ff', border: '1.5px solid #c4b5fd', color: '#5b21b6', borderRadius: '8px' } as React.CSSProperties },
                    ] as Array<{ label: string; style: React.CSSProperties } | null>).map((item, i) =>
                        item === null
                            ? <div key={i} className="w-0.5 h-5 bg-gray-300" />
                            : <div key={i} className="px-4 py-2 text-[11px] shadow-sm" style={item.style}>{item.label}</div>
                    )}
                </div>
            </div>
        </section>
    );
}

function UltrasonicPracticalSection() {
    const [objectDist, setObjectDist] = useState(50);
    const [wavePhase, setWavePhase] = useState(0);
    const [pulseActive, setPulseActive] = useState(false);

    const distance = objectDist;
    const duration = Math.round((distance * 2) / 0.0344);
    const ledOn = distance <= 30;

    useEffect(() => {
        const t = setInterval(() => setWavePhase(p => (p + 1) % 60), 80);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        if (ledOn) {
            const t = setInterval(() => setPulseActive(p => !p), 600);
            return () => clearInterval(t);
        }
        setPulseActive(false);
    }, [ledOn]);

    return (
        <section id="ultrasonic-practical" className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg bg-white" style={{ border: '1px solid #bae6fd', boxShadow: '0 1px 3px rgba(14,165,233,0.08)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #e0f2fe' }}>
                <Waves size={16} className="text-sky-500" />
                <h2 className="text-base md:text-lg font-extrabold text-gray-800">🔬 Practical – Ultrasonic Sensor HC-SR04</h2>
            </div>

            {/* Objective */}
            <div className="rounded-xl p-4 mb-6 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', border: '1px solid #7dd3fc', color: '#0c4a6e' }}>
                🎯 <strong>Objective:</strong> HC-SR04 Ultrasonic Sensor ko Arduino Uno ke saath interface karke kisi object ki <strong>distance measure</strong> karna aur object paas aane par <strong>LED ko ON</strong> karna।
            </div>

            {/* Theory Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100 mb-6">
                <h3 className="text-sm font-extrabold text-sky-900 mb-4 flex items-center gap-2">
                    <Radio size={14} /> 🔹 Theory
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                    <p>Ultrasonic Sensor <strong>HC-SR04</strong> ek distance measuring sensor hai jo <strong>ultrasonic sound waves</strong> ka use karta hai।</p>
                    <p>Ye sensor ultrasonic waves <strong>transmit</strong> karta hai aur object se takrakar wapas aane wali waves ko <strong>receive</strong> karta hai।</p>
                    <p>Sensor signal ke jaane aur wapas aane me lagne wale <strong>samay ko measure</strong> karta hai aur uske basis par <strong>distance calculate</strong> karta hai।</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    <div className="p-4 rounded-xl bg-white border border-sky-200 text-center shadow-sm">
                        <div className="text-3xl mb-2">📡</div>
                        <p className="text-xs font-bold text-sky-800">Transmitter</p>
                        <p className="text-[11px] text-gray-600 mt-1">Ultrasonic waves bhejta hai</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-sky-200 text-center shadow-sm">
                        <div className="text-3xl mb-2">📥</div>
                        <p className="text-xs font-bold text-sky-800">Receiver</p>
                        <p className="text-[11px] text-gray-600 mt-1">Reflected waves receive karta hai</p>
                    </div>
                </div>

                {/* How it works flow */}
                <div className="mt-5 p-4 bg-white rounded-xl border border-sky-200">
                    <p className="text-xs font-bold text-sky-800 mb-3 uppercase tracking-wide">📊 Working Flow:</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <span className="px-3 py-2 bg-sky-700 rounded-lg text-white shadow-sm font-bold text-[11px] flex items-center gap-1">📡 Transmit Wave</span>
                        <ChevronRight className="text-sky-400 rotate-90 sm:rotate-0" size={14} />
                        <span className="px-3 py-2 bg-amber-100 rounded-lg text-amber-800 shadow-sm font-bold text-[11px] flex items-center gap-1">🧱 Hit Object</span>
                        <ChevronRight className="text-sky-400 rotate-90 sm:rotate-0" size={14} />
                        <span className="px-3 py-2 bg-emerald-100 rounded-lg text-emerald-800 shadow-sm font-bold text-[11px] flex items-center gap-1">📥 Receive Echo</span>
                        <ChevronRight className="text-sky-400 rotate-90 sm:rotate-0" size={14} />
                        <span className="px-3 py-2 bg-violet-100 rounded-lg text-violet-800 shadow-sm font-bold text-[11px] flex items-center gap-1">📏 Calculate</span>
                    </div>
                </div>
            </div>

            {/* ═══ Interactive Simulator ═══ */}
            <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-indigo-50 p-5 mb-6">
                <p className="text-xs font-bold text-sky-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={12} /> Interactive Simulator — Object ki distance adjust karo!
                </p>

                {/* Distance Slider */}
                <div className="mb-5">
                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                        <span>📏 Paas (Near) — 2 cm</span>
                        <span>📏 Door (Far) — 100 cm</span>
                    </div>
                    <input
                        type="range" min={2} max={100} value={objectDist}
                        onChange={e => setObjectDist(Number(e.target.value))}
                        className="w-full h-3 rounded-full outline-none cursor-pointer"
                        style={{
                            WebkitAppearance: 'none',
                            background: `linear-gradient(90deg, #0ea5e9 ${objectDist}%, #e0f2fe ${objectDist}%, #f0f9ff 100%)`,
                        } as React.CSSProperties}
                    />
                    <div className="text-center mt-2">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: ledOn ? '#fef2f2' : '#f0fdf4', border: `1px solid ${ledOn ? '#fca5a5' : '#86efac'}`, color: ledOn ? '#dc2626' : '#16a34a' }}>
                            📏 Distance: {distance} cm {ledOn ? '⚠️ Object Paas Hai!' : '✅ Safe'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                    {/* Animated SVG Circuit + Wave Diagram */}
                    <div className="flex justify-center">
                        <svg viewBox="0 0 400 340" className="w-full max-w-md" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.10))' }}>
                            <defs>
                                <linearGradient id="usWaveGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.9" />
                                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="usEchoGrad" x1="1" y1="0" x2="0" y2="0">
                                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9" />
                                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <rect width="400" height="340" rx="16" fill="#0f172a" />

                            {/* Title */}
                            <text x="200" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="monospace">HC-SR04 ULTRASONIC SIMULATOR</text>

                            {/* Arduino Board */}
                            <rect x="10" y="100" width="80" height="160" rx="8" fill="#1e40af" stroke="#3b82f6" strokeWidth="1.5" />
                            <text x="50" y="125" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">ARDUINO</text>
                            <text x="50" y="138" textAnchor="middle" fill="#93c5fd" fontSize="7" fontFamily="monospace">UNO R3</text>
                            {/* Arduino pins */}
                            <rect x="70" y="148" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="158" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">5V</text>
                            <rect x="70" y="168" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="178" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">GND</text>
                            <rect x="70" y="188" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="198" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">D9</text>
                            <rect x="70" y="208" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="218" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">D8</text>
                            <rect x="70" y="228" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="238" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">D13</text>

                            {/* Wires from Arduino to Sensor */}
                            <line x1="92" y1="155" x2="140" y2="90" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />
                            <line x1="92" y1="175" x2="140" y2="120" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,2" />
                            <line x1="92" y1="195" x2="140" y2="100" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,2" />
                            <line x1="92" y1="215" x2="140" y2="110" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,2" />

                            {/* HC-SR04 Sensor */}
                            <rect x="140" y="55" width="100" height="80" rx="8" fill="#0f766e" stroke="#14b8a6" strokeWidth="1.5" />
                            <text x="190" y="72" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">HC-SR04</text>
                            {/* Transmitter circle */}
                            <circle cx="165" cy="100" r="14" fill="#115e59" stroke="#2dd4bf" strokeWidth="1.5" />
                            <text x="165" y="103" textAnchor="middle" fill="#5eead4" fontSize="6" fontWeight="bold" fontFamily="monospace">TX</text>
                            {/* Receiver circle */}
                            <circle cx="215" cy="100" r="14" fill="#115e59" stroke="#2dd4bf" strokeWidth="1.5" />
                            <text x="215" y="103" textAnchor="middle" fill="#5eead4" fontSize="6" fontWeight="bold" fontFamily="monospace">RX</text>
                            {/* Sensor pins labels */}
                            <text x="145" y="90" fill="#f87171" fontSize="6" fontFamily="monospace">VCC</text>
                            <text x="145" y="100" fill="#f59e0b" fontSize="6" fontFamily="monospace">TRIG</text>
                            <text x="145" y="110" fill="#4ade80" fontSize="6" fontFamily="monospace">ECHO</text>
                            <text x="145" y="120" fill="#94a3b8" fontSize="6" fontFamily="monospace">GND</text>

                            {/* Animated ultrasonic waves from TX */}
                            {[0, 1, 2, 3].map(i => {
                                const progress = ((wavePhase + i * 15) % 60) / 60;
                                const x = 180 + progress * (objectDist * 1.5);
                                const opacity = 1 - progress;
                                return x < 340 ? (
                                    <g key={`wave-${i}`}>
                                        <line x1={x} y1={85} x2={x} y2={75 - i * 2} stroke="#0ea5e9" strokeWidth="1.2" opacity={opacity * 0.6} />
                                        <line x1={x} y1={115} x2={x} y2={125 + i * 2} stroke="#0ea5e9" strokeWidth="1.2" opacity={opacity * 0.6} />
                                        <circle cx={x} cy={100} r={2 + i} fill="none" stroke="#0ea5e9" strokeWidth="0.8" opacity={opacity * 0.4} />
                                    </g>
                                ) : null;
                            })}

                            {/* Echo waves returning */}
                            {[0, 1, 2].map(i => {
                                const progress = ((wavePhase + 30 + i * 15) % 60) / 60;
                                const baseX = Math.min(180 + objectDist * 1.5, 340);
                                const x = baseX - progress * (objectDist * 1.5);
                                const opacity = 1 - progress;
                                return x > 170 ? (
                                    <g key={`echo-${i}`}>
                                        <line x1={x} y1={85} x2={x} y2={78} stroke="#22c55e" strokeWidth="1" opacity={opacity * 0.5} />
                                        <line x1={x} y1={115} x2={x} y2={122} stroke="#22c55e" strokeWidth="1" opacity={opacity * 0.5} />
                                    </g>
                                ) : null;
                            })}

                            {/* Object (wall) */}
                            {(() => {
                                const objX = Math.min(180 + objectDist * 1.5, 370);
                                return (
                                    <g>
                                        <rect x={objX} y={60} width={12} height={80} rx={3} fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                                        <text x={objX + 6} y={55} textAnchor="middle" fill="#f59e0b" fontSize="7" fontWeight="bold" fontFamily="monospace">🧱 Object</text>
                                    </g>
                                );
                            })()}

                            {/* Distance label */}
                            <line x1="180" y1="145" x2={Math.min(180 + objectDist * 1.5, 370)} y2="145" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />
                            <text x={(180 + Math.min(180 + objectDist * 1.5, 370)) / 2} y="158" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold" fontFamily="monospace">{distance} cm</text>

                            {/* LED Section */}
                            <line x1="92" y1="235" x2="140" y2="280" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,2" />
                            <text x="50" y="265" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">Pin 13</text>

                            {/* LED */}
                            <polygon points="145,270 165,280 145,290" fill={ledOn ? (pulseActive ? '#fbbf24' : '#f97316') : '#374151'} stroke={ledOn ? '#fb923c' : '#4b5563'} strokeWidth="1.5" />
                            <line x1="165" y1="270" x2="165" y2="290" stroke={ledOn ? '#fb923c' : '#4b5563'} strokeWidth="2" />
                            {ledOn && <circle cx="155" cy="280" r={pulseActive ? 18 : 12} fill="#fbbf24" opacity="0.15" />}
                            <text x="175" y="278" fill={ledOn ? '#fbbf24' : '#4b5563'} fontSize="9" fontFamily="monospace">LED</text>
                            <text x="175" y="290" fill={ledOn ? '#f97316' : '#4b5563'} fontSize="8" fontFamily="monospace">{ledOn ? 'ON 🔆' : 'OFF'}</text>

                            {/* Resistor */}
                            <rect x="195" y="272" width="30" height="16" rx="4" fill="#374151" stroke="#6b7280" strokeWidth="1" />
                            <text x="210" y="283" textAnchor="middle" fill="#d1d5db" fontSize="7" fontWeight="bold" fontFamily="monospace">220Ω</text>
                            <line x1="165" y1="280" x2="195" y2="280" stroke="#94a3b8" strokeWidth="1.5" />
                            <line x1="225" y1="280" x2="255" y2="280" stroke="#94a3b8" strokeWidth="1.5" />
                            {/* GND */}
                            <line x1="255" y1="275" x2="255" y2="285" stroke="#64748b" strokeWidth="2" />
                            <line x1="250" y1="290" x2="260" y2="290" stroke="#64748b" strokeWidth="2" />
                            <line x1="252" y1="294" x2="258" y2="294" stroke="#64748b" strokeWidth="1.5" />
                            <text x="255" y="306" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">GND</text>

                            {/* Status bar */}
                            <rect x="10" y="310" width="380" height="24" rx="6" fill={ledOn ? '#7f1d1d' : '#14532d'} opacity="0.7" />
                            <text x="200" y="326" textAnchor="middle" fill={ledOn ? '#fca5a5' : '#86efac'} fontSize="9" fontWeight="bold" fontFamily="monospace">
                                {ledOn ? `⚠️ ALERT: Object at ${distance}cm — LED ON` : `✅ Clear: Object at ${distance}cm — LED OFF`}
                            </text>
                        </svg>
                    </div>

                    {/* Data Panel */}
                    <div className="space-y-3">
                        <div className="p-3 rounded-xl" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-sky-800">📏 Distance</span>
                                <span className="text-xs font-mono font-bold text-sky-700">{distance} cm</span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden bg-sky-100">
                                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${distance}%`, background: distance <= 30 ? 'linear-gradient(90deg,#ef4444,#f97316)' : 'linear-gradient(90deg,#0ea5e9,#38bdf8)' }} />
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                            <p className="text-xs font-bold text-slate-400 mb-1 font-mono">pulseIn(echo, HIGH)</p>
                            <p className="text-2xl font-black font-mono" style={{ color: '#38bdf8' }}>{duration} µs</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-1">Round-trip time</p>
                        </div>

                        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                            <p className="text-xs font-bold text-indigo-800 mb-1">📐 Formula</p>
                            <p className="text-sm font-bold text-indigo-600 font-mono">d = {duration} × 0.0344 / 2</p>
                            <p className="text-sm font-bold text-indigo-900 font-mono">d = {distance} cm</p>
                        </div>

                        <div className="p-3 rounded-xl border transition-all duration-500" style={{ background: ledOn ? '#fef2f2' : '#f0fdf4', border: `1px solid ${ledOn ? '#fca5a5' : '#86efac'}` }}>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full transition-all duration-500 flex items-center justify-center" style={{ background: ledOn ? '#ef4444' : '#22c55e', boxShadow: ledOn && pulseActive ? '0 0 12px #ef4444' : 'none' }}>
                                    <Lightbulb size={11} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold" style={{ color: ledOn ? '#dc2626' : '#16a34a' }}>LED {ledOn ? 'ON 🔆' : 'OFF 🌑'}</p>
                                    <p className="text-[10px]" style={{ color: ledOn ? '#b91c1c' : '#15803d' }}>{ledOn ? `Object ${distance}cm par detect hua! (≤30cm)` : `Object safe distance par hai (>${30}cm)`}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 font-mono">
                            <p className="text-[10px] text-gray-400 mb-1">📟 Serial Monitor</p>
                            <p className="text-[11px]" style={{ color: '#4ade80' }}>
                                distance {distance} cm
                            </p>
                            <p className="text-[11px]" style={{ color: ledOn ? '#fbbf24' : '#94a3b8' }}>
                                {ledOn ? 'LED ON' : 'LED OFF'}
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-[10px] text-sky-700 mt-3 text-center font-medium">⬆️ Slider ko left mein le jao (paas) — LED on ho jayegi! Right le jao (door) — LED off!</p>
            </div>

            {/* Program Code */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#1e293b' }}>
                    <FileCode2 size={14} className="text-sky-400" />
                    <span className="text-xs font-bold text-sky-300 tracking-wide">Arduino Program — Ultrasonic_HC-SR04.ino</span>
                    <div className="ml-auto flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                </div>
                <div className="bg-gray-950 p-4 font-mono text-xs leading-7 overflow-x-auto">
                    <div><span className="text-sky-400">const</span> <span className="text-sky-400">int</span> <span className="text-green-300">trig</span> <span className="text-gray-400">=</span> <span className="text-orange-400">9</span><span className="text-gray-400">;</span></div>
                    <div><span className="text-sky-400">const</span> <span className="text-sky-400">int</span> <span className="text-green-300">echo</span> <span className="text-gray-400">=</span> <span className="text-orange-400">8</span><span className="text-gray-400">;</span></div>
                    <div className="mt-1"><span className="text-sky-400">long</span> <span className="text-green-300">duration</span><span className="text-gray-400">;</span></div>
                    <div><span className="text-sky-400">int</span> <span className="text-green-300">distance</span><span className="text-gray-400">;</span></div>
                    <div className="mt-3"><span className="text-purple-400">void</span> <span className="text-yellow-300">setup</span><span className="text-gray-300">()</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-4"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">begin</span><span className="text-gray-300">(</span><span className="text-orange-400">9600</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-sky-300">pinMode</span><span className="text-gray-300">(</span><span className="text-green-300">trig</span><span className="text-gray-300">,</span> <span className="text-orange-400">OUTPUT</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-sky-300">pinMode</span><span className="text-gray-300">(</span><span className="text-green-300">echo</span><span className="text-gray-300">,</span> <span className="text-orange-400">INPUT</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-sky-300">pinMode</span><span className="text-gray-300">(</span><span className="text-orange-400">13</span><span className="text-gray-300">,</span> <span className="text-orange-400">OUTPUT</span><span className="text-gray-300">);</span></div>
                    <div><span className="text-gray-300">{'}'}</span></div>
                    <div className="mt-3"><span className="text-purple-400">void</span> <span className="text-yellow-300">loop</span><span className="text-gray-300">()</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-4"><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-green-300">trig</span><span className="text-gray-300">,</span> <span className="text-orange-400">LOW</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-sky-300">delayMicroseconds</span><span className="text-gray-300">(</span><span className="text-orange-400">2</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4 mt-1"><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-green-300">trig</span><span className="text-gray-300">,</span> <span className="text-orange-400">HIGH</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-sky-300">delayMicroseconds</span><span className="text-gray-300">(</span><span className="text-orange-400">10</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-green-300">trig</span><span className="text-gray-300">,</span> <span className="text-orange-400">LOW</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4 mt-1"><span className="text-green-300">duration</span> <span className="text-gray-400">=</span> <span className="text-sky-300">pulseIn</span><span className="text-gray-300">(</span><span className="text-green-300">echo</span><span className="text-gray-300">,</span> <span className="text-orange-400">HIGH</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4 mt-1"><span className="text-green-300">distance</span> <span className="text-gray-400">=</span> <span className="text-green-300">duration</span> <span className="text-gray-400">*</span> <span className="text-orange-400">0.0344</span> <span className="text-gray-400">/</span> <span className="text-orange-400">2</span><span className="text-gray-300">;</span></div>
                    <div className="ml-4 mt-1"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">print</span><span className="text-gray-300">(</span><span className="text-amber-400">&quot;distance &quot;</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">print</span><span className="text-gray-300">(</span><span className="text-green-300">distance</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">println</span><span className="text-gray-300">(</span><span className="text-amber-400">&quot; cm&quot;</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4 mt-1"><span className="text-purple-400">if</span><span className="text-gray-300">(distance &lt;=</span> <span className="text-orange-400">30</span><span className="text-gray-300">)</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-8"><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-orange-400">13</span><span className="text-gray-300">,</span> <span className="text-orange-400">HIGH</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-gray-300">{'}'}</span></div>
                    <div className="ml-4"><span className="text-purple-400">else</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-8"><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-orange-400">13</span><span className="text-gray-300">,</span> <span className="text-orange-400">LOW</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-gray-300">{'}'}</span></div>
                    <div><span className="text-gray-300">{'}'}</span></div>
                </div>
            </div>

            {/* Materials and Connections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="p-4 rounded-2xl border border-sky-100 bg-sky-50">
                    <h3 className="text-sm font-extrabold text-sky-900 mb-3 flex items-center gap-2">
                        <Wrench size={14} /> आवश्यक सामग्री (Materials Required)
                    </h3>
                    <ul className="space-y-2">
                        {[
                            { label: 'Arduino Board (Uno R3)', icon: '🟦' },
                            { label: 'Ultrasonic Sensor HC-SR04', icon: '📡' },
                            { label: 'LED', icon: '💡' },
                            { label: '220Ω Resistor', icon: '🔴' },
                            { label: 'Bread Board', icon: '🔲' },
                            { label: 'Jumper Wires', icon: '🔗' },
                        ].map((m, i) => (
                            <li key={i} className="flex items-center gap-2.5 text-sm text-sky-900 bg-white rounded-lg px-3 py-2 border border-sky-100 shadow-sm">
                                <span>{m.icon}</span><span className="font-semibold">{m.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50">
                    <h3 className="text-sm font-extrabold text-indigo-900 mb-3 flex items-center gap-2">
                        <CircuitBoard size={14} /> Circuit Connection
                    </h3>
                    <ol className="space-y-2">
                        {[
                            { step: 'VCC Pin → Sensor की VCC pin ko Arduino की 5V pin se connect करें।', color: 'text-red-600' },
                            { step: 'GND Pin → Sensor की GND pin ko Arduino की GND pin se connect करें।', color: 'text-gray-600' },
                            { step: 'Trig Pin → Sensor की Trig pin ko Arduino की Digital Pin 9 se connect करें।', color: 'text-amber-600' },
                            { step: 'Echo Pin → Sensor की Echo pin ko Arduino की Digital Pin 8 se connect करें।', color: 'text-emerald-600' },
                            { step: 'LED → LED ko 220Ω resistor ke saath Arduino की Digital Pin 13 se connect करें।', color: 'text-sky-700' },
                            { step: 'LED ka cathode (–) Ground se connect करें।', color: 'text-gray-600' },
                        ].map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-indigo-900">
                                <span className="w-5 h-5 flex-shrink-0 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                                <span className={`font-medium ${c.color}`}>{c.step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Working Principle */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 mb-6">
                <h3 className="text-sm font-extrabold text-violet-900 mb-4 flex items-center gap-2">
                    <Activity size={14} /> 🔹 कार्य प्रणाली (Working Principle)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { icon: '📡', heading: 'Trig Pin', body: 'Trig Pin ek Trigger Signal Send karta hai। Trig Pin ko 10 microsecond ki HIGH pulse di jaati hai। Isse sensor ko signal milta hai ki "ab wave bhejo".', bg: 'bg-amber-50', border: 'border-amber-200', tc: 'text-amber-900' },
                        { icon: '📥', heading: 'Echo Pin', body: 'Echo Pin us samay ki ganana karta hai jab Signal kisi Object se takrakar wapas aata hai। Echo Pin reflected signal ko receive karti hai.', bg: 'bg-emerald-50', border: 'border-emerald-200', tc: 'text-emerald-900' },
                        { icon: '⏱️', heading: 'Duration', body: 'pulseIn() Function ke madhyam se Echo Pin par HIGH Signal ke Time Period ko mapa jata hai। Ye samay batata hai ki Ultrasonic Wave ko jaane aur wapas aane mein kitna samay laga.', bg: 'bg-sky-50', border: 'border-sky-200', tc: 'text-sky-900' },
                        { icon: '📏', heading: 'Distance Calculation', body: 'distance = duration × 0.0344 / 2. Yahan 0.0344 cm/µs Sound Wave ki Speed hoti hai। /2 karna zaruri hai kyunki Signal Object tak jakar wapas bhi aata hai.', bg: 'bg-violet-50', border: 'border-violet-200', tc: 'text-violet-900' },
                    ].map((w, i) => (
                        <div key={i} className={`p-3 rounded-xl ${w.bg} border ${w.border}`}>
                            <p className={`text-xs font-bold ${w.tc} mb-1`}>{w.icon} {w.heading}</p>
                            <p className={`text-[11px] ${w.tc} leading-relaxed`}>{w.body}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Distance Calculation Formula */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-sky-50 border border-indigo-200 mb-6">
                <h3 className="text-sm font-extrabold text-indigo-900 mb-4 flex items-center gap-2">
                    <Cpu size={14} /> 📐 Distance Calculation Formula
                </h3>
                <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm text-center">
                    <p className="text-lg font-black font-mono text-indigo-900 mb-3">distance = duration × 0.0344 / 2</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        <div className="p-3 rounded-lg bg-sky-50 border border-sky-200">
                            <p className="text-[10px] font-bold text-sky-800 uppercase tracking-wide">Speed of Sound</p>
                            <p className="text-sm font-bold font-mono text-sky-700">0.0344 cm/µs</p>
                        </div>
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">÷ 2 kyon?</p>
                            <p className="text-xs font-medium text-amber-700">Signal aata-jaata dono ka time hota hai</p>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                            <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Range</p>
                            <p className="text-sm font-bold font-mono text-emerald-700">2 cm – 400 cm</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Program Working Steps */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 mb-6">
                <h3 className="text-sm font-extrabold text-teal-900 mb-4 flex items-center gap-2">
                    <Cog size={14} /> 🔹 Program Working
                </h3>
                <div className="space-y-2">
                    {[
                        'Arduino Trig Pin par 10 Microsecond ki Pulse bhejta hai।',
                        'Ultrasonic Sensor Sound Wave Transmit karta hai।',
                        'Wave Object se takrakar wapas aati hai।',
                        'Echo Pin Return Time Measure karti hai।',
                        'Arduino Distance Calculate karta hai।',
                        'Distance Serial Monitor par Display hoti hai।',
                        'Agar Distance 30 cm ya isse kam hoti hai to LED ON ho jaati hai।',
                        'Agar Distance 30 cm se adhik hoti hai to LED OFF ho jaati hai।',
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                            <span className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                            <span className="text-xs font-medium text-teal-800">{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Output */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <p className="text-xs font-bold text-emerald-800 mb-2">✅ Output 1 (Object paas hai):</p>
                    <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs">
                        <p className="text-green-400">distance 25 cm</p>
                        <p className="text-yellow-400">LED ON 🔆</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                    <p className="text-xs font-bold text-sky-800 mb-2">✅ Output 2 (Object door hai):</p>
                    <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs">
                        <p className="text-green-400">distance 60 cm</p>
                        <p className="text-gray-400">LED OFF 🌑</p>
                    </div>
                </div>
            </div>

            {/* Conclusion */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 mb-6">
                <h3 className="text-sm font-extrabold text-sky-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={14} /> 🔹 Conclusion
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                    HC-SR04 Ultrasonic Sensor ki sahayata se kisi Object ki Distance ko safaltapoorvak Measure kiya gaya। Sensor dwara prapt Distance ke aadhar par Arduino ne LED ko Control kiya। Yah prayog <strong>Distance Measurement</strong>, <strong>Obstacle Detection</strong>, <strong>Smart Parking System</strong>, <strong>Robotics</strong> tatha <strong>IoT Applications</strong> mein upyog kiya jaata hai।
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                    {['Distance Measurement', 'Obstacle Detection', 'Smart Parking', 'Robotics', 'IoT Projects'].map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-sky-200 rounded-full text-[10px] font-bold text-sky-700 shadow-sm">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Flowchart */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                <h3 className="text-sm font-extrabold text-gray-800 mb-4 flex items-center gap-2">
                    <ChevronRight size={14} className="text-sky-500" /> Program Flow (Flowchart)
                </h3>
                <div className="flex flex-col items-center gap-0 text-center text-xs font-semibold">
                    {([
                        { label: 'START', style: { background: '#0284c7', color: 'white', borderRadius: '50px' } as React.CSSProperties },
                        null,
                        { label: 'Serial.begin(9600) | pinMode(trig, OUTPUT) | pinMode(echo, INPUT) | pinMode(13, OUTPUT)', style: { background: '#eff6ff', border: '1.5px solid #93c5fd', color: '#1e40af', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'Trig Pin → LOW → 2µs → HIGH → 10µs → LOW', style: { background: '#fef3c7', border: '1.5px solid #fcd34d', color: '#92400e', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'duration = pulseIn(echo, HIGH)', style: { background: '#f0fdf4', border: '1.5px solid #86efac', color: '#166534', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'distance = duration × 0.0344 / 2', style: { background: '#eef2ff', border: '1.5px solid #a5b4fc', color: '#3730a3', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'Serial.print("distance") | Serial.print(distance) | Serial.println(" cm")', style: { background: '#faf5ff', border: '1.5px solid #c4b5fd', color: '#5b21b6', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'distance <= 30 ?', style: { background: '#fce7f3', border: '1.5px solid #f9a8d4', color: '#9d174d', borderRadius: '50px' } as React.CSSProperties },
                        null,
                        { label: 'YES → digitalWrite(13, HIGH) → LED ON 🔆', style: { background: '#ecfdf5', border: '1.5px solid #6ee7b7', color: '#065f46', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'NO → digitalWrite(13, LOW) → LED OFF 🌑', style: { background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#991b1b', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: '↩ loop() repeats', style: { background: '#f0f9ff', border: '1.5px solid #7dd3fc', color: '#0369a1', borderRadius: '8px' } as React.CSSProperties },
                    ] as Array<{ label: string; style: React.CSSProperties } | null>).map((item, i) =>
                        item === null
                            ? <div key={i} className="w-0.5 h-5 bg-gray-300" />
                            : <div key={i} className="px-4 py-2 text-[11px] shadow-sm" style={item.style}>{item.label}</div>
                    )}
                </div>
            </div>
        </section>
    );
}

function PIRPracticalSection() {
    const [motionDetected, setMotionDetected] = useState(false);
    const [pulseActive, setPulseActive] = useState(false);
    const [irWavePhase, setIrWavePhase] = useState(0);
    const [personX, setPersonX] = useState(320);
    const [showPerson, setShowPerson] = useState(false);

    const sensorValue = motionDetected ? 'HIGH' : 'LOW';
    const ledOn = motionDetected;

    useEffect(() => {
        const t = setInterval(() => setIrWavePhase(p => (p + 1) % 60), 100);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        if (ledOn) {
            const t = setInterval(() => setPulseActive(p => !p), 500);
            return () => clearInterval(t);
        }
        setPulseActive(false);
    }, [ledOn]);

    // Animate person walking when motion triggered
    useEffect(() => {
        if (motionDetected && showPerson) {
            const t = setInterval(() => {
                setPersonX(p => {
                    if (p <= 200) return 200;
                    return p - 2;
                });
            }, 50);
            return () => clearInterval(t);
        } else {
            setPersonX(320);
        }
    }, [motionDetected, showPerson]);

    const handleMotionToggle = () => {
        const next = !motionDetected;
        setMotionDetected(next);
        setShowPerson(next);
        if (!next) setPersonX(320);
    };

    return (
        <section id="pir-practical" className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg bg-white" style={{ border: '1px solid #fbcfe8', boxShadow: '0 1px 3px rgba(236,72,153,0.08)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #fce7f3' }}>
                <Scan size={16} className="text-pink-500" />
                <h2 className="text-base md:text-lg font-extrabold text-gray-800">🔬 Practical – PIR Sensor (Passive Infrared Sensor)</h2>
            </div>

            {/* Objective */}
            <div className="rounded-xl p-4 mb-6 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', border: '1px solid #f9a8d4', color: '#831843' }}>
                🎯 <strong>Objective:</strong> PIR (Passive Infrared) Sensor ko Arduino Uno ke saath interface karke <strong>motion detect</strong> karna aur motion detect hone par <strong>LED ko ON</strong> karna।
            </div>

            {/* Theory Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 mb-6">
                <h3 className="text-sm font-extrabold text-pink-900 mb-4 flex items-center gap-2">
                    <Eye size={14} /> 🔹 Theory
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                    <p>PIR Sensor ka full form <strong>Passive Infrared Sensor</strong> hota hai।</p>
                    <p>Ye sensor kisi vyakti ya vastu se nikalne wali <strong>Infrared Radiation</strong> ko detect karta hai।</p>
                    <p>Jab sensor ke saamne koi <strong>movement ya motion</strong> hota hai to sensor output <strong>HIGH</strong> ho jata hai aur jab koi movement nahi hoti to output <strong>LOW</strong> rehta hai।</p>
                    <p>Sensor khud koi signal <strong>transmit nahi karta</strong>, balki object dwara emit ki gayi infrared energy ko detect karta hai, isliye ise <strong>Passive</strong> Infrared Sensor kaha jata hai।</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    <div className="p-4 rounded-xl bg-white border border-pink-200 text-center shadow-sm">
                        <div className="text-3xl mb-2">🚶</div>
                        <p className="text-xs font-bold text-pink-800">Motion Detected</p>
                        <p className="text-[11px] text-gray-600 mt-1">Output = HIGH → LED ON</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-pink-200 text-center shadow-sm">
                        <div className="text-3xl mb-2">🚫</div>
                        <p className="text-xs font-bold text-pink-800">No Motion</p>
                        <p className="text-[11px] text-gray-600 mt-1">Output = LOW → LED OFF</p>
                    </div>
                </div>

                {/* How it works flow */}
                <div className="mt-5 p-4 bg-white rounded-xl border border-pink-200">
                    <p className="text-xs font-bold text-pink-800 mb-3 uppercase tracking-wide">📊 Working Flow:</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <span className="px-3 py-2 bg-pink-700 rounded-lg text-white shadow-sm font-bold text-[11px] flex items-center gap-1">🚶 Person Moves</span>
                        <ChevronRight className="text-pink-400 rotate-90 sm:rotate-0" size={14} />
                        <span className="px-3 py-2 bg-red-100 rounded-lg text-red-800 shadow-sm font-bold text-[11px] flex items-center gap-1">🔴 IR Radiation Emit</span>
                        <ChevronRight className="text-pink-400 rotate-90 sm:rotate-0" size={14} />
                        <span className="px-3 py-2 bg-amber-100 rounded-lg text-amber-800 shadow-sm font-bold text-[11px] flex items-center gap-1">📡 PIR Detects</span>
                        <ChevronRight className="text-pink-400 rotate-90 sm:rotate-0" size={14} />
                        <span className="px-3 py-2 bg-emerald-100 rounded-lg text-emerald-800 shadow-sm font-bold text-[11px] flex items-center gap-1">💡 LED ON</span>
                    </div>
                </div>

                {/* PIR Sensor Applications */}
                <div className="mt-5">
                    <p className="text-xs font-bold text-pink-800 mb-2 uppercase tracking-wide">🛠️ Applications:</p>
                    <div className="flex flex-wrap gap-2">
                        {['Security Systems', 'Automatic Lighting', 'Home Automation', 'Smart Doors', 'Burglar Alarms', 'Motion Detection'].map((app, i) => (
                            <span key={i} className="px-3 py-1 bg-white border border-pink-200 rounded-full text-[10px] font-bold text-pink-700 shadow-sm">{app}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ Interactive Simulator ═══ */}
            <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 to-fuchsia-50 p-5 mb-6">
                <p className="text-xs font-bold text-pink-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={12} /> Interactive Simulator — Motion Toggle karo aur dekhlo!
                </p>

                {/* Motion Toggle Button */}
                <div className="flex flex-col items-center gap-3 mb-5">
                    <button
                        onClick={handleMotionToggle}
                        className="px-8 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
                        style={{
                            background: motionDetected ? 'linear-gradient(135deg, #ec4899, #f43f5e)' : 'linear-gradient(135deg, #6b7280, #9ca3af)',
                            color: 'white',
                            border: motionDetected ? '2px solid #f472b6' : '2px solid #d1d5db',
                            boxShadow: motionDetected ? '0 0 20px rgba(236,72,153,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                    >
                        {motionDetected ? '🚶 Motion Detected! (Click to Stop)' : '🚫 No Motion (Click to Simulate Motion)'}
                    </button>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: ledOn ? '#fef2f2' : '#f0fdf4', border: `1px solid ${ledOn ? '#fca5a5' : '#86efac'}`, color: ledOn ? '#dc2626' : '#16a34a' }}>
                        {ledOn ? '⚠️ Motion Detected! LED ON' : '✅ No Motion — All Clear'}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                    {/* Animated SVG Circuit Diagram */}
                    <div className="flex justify-center">
                        <svg viewBox="0 0 400 320" className="w-full max-w-md" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.10))' }}>
                            <rect width="400" height="320" rx="16" fill="#0f172a" />

                            {/* Title */}
                            <text x="200" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="monospace">PIR SENSOR MOTION SIMULATOR</text>

                            {/* Arduino Board */}
                            <rect x="10" y="90" width="80" height="140" rx="8" fill="#1e40af" stroke="#3b82f6" strokeWidth="1.5" />
                            <text x="50" y="115" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">ARDUINO</text>
                            <text x="50" y="128" textAnchor="middle" fill="#93c5fd" fontSize="7" fontFamily="monospace">UNO R3</text>
                            {/* Arduino pins */}
                            <rect x="70" y="140" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="150" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">5V</text>
                            <rect x="70" y="160" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="170" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">GND</text>
                            <rect x="70" y="180" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="190" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">D8</text>
                            <rect x="70" y="200" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="210" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">D13</text>

                            {/* Wires from Arduino to PIR */}
                            <line x1="92" y1="147" x2="155" y2="75" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />
                            <line x1="92" y1="167" x2="155" y2="105" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,2" />
                            <line x1="92" y1="187" x2="155" y2="90" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,2" />

                            {/* PIR Sensor body */}
                            <rect x="155" y="50" width="90" height="70" rx="8" fill="#7f1d1d" stroke="#f87171" strokeWidth="1.5" />
                            <text x="200" y="68" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">PIR SENSOR</text>
                            {/* PIR dome (Fresnel lens) */}
                            <circle cx="200" cy="95" r="16" fill="#991b1b" stroke="#fca5a5" strokeWidth="1.5" />
                            <circle cx="200" cy="95" r="10" fill="#7f1d1d" stroke="#f87171" strokeWidth="1" />
                            <circle cx="200" cy="95" r="5" fill={motionDetected ? '#f87171' : '#4b5563'} opacity={motionDetected ? 1 : 0.5}>
                                {motionDetected && <animate attributeName="r" values="5;8;5" dur="1s" repeatCount="indefinite" />}
                            </circle>
                            {/* Sensor pin labels */}
                            <text x="160" y="75" fill="#f87171" fontSize="6" fontFamily="monospace">VCC</text>
                            <text x="160" y="90" fill="#4ade80" fontSize="6" fontFamily="monospace">OUT</text>
                            <text x="160" y="105" fill="#94a3b8" fontSize="6" fontFamily="monospace">GND</text>

                            {/* IR Detection zone (cone) */}
                            {motionDetected && (
                                <g>
                                    {[0, 1, 2, 3, 4].map(i => {
                                        const phase = ((irWavePhase + i * 12) % 60) / 60;
                                        const radius = 20 + phase * 100;
                                        const opacity = (1 - phase) * 0.3;
                                        return (
                                            <ellipse key={`ir-${i}`} cx="200" cy="95" rx={radius} ry={radius * 0.4}
                                                fill="none" stroke="#f87171" strokeWidth="1"
                                                opacity={opacity} strokeDasharray="3,3" />
                                        );
                                    })}
                                </g>
                            )}

                            {/* Walking Person */}
                            {showPerson && (
                                <g>
                                    {/* Person body */}
                                    <circle cx={personX} cy="55" r="7" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
                                    <line x1={personX} y1="62" x2={personX} y2="82" stroke="#fbbf24" strokeWidth="2" />
                                    <line x1={personX} y1="70" x2={personX - 8} y2="78" stroke="#fbbf24" strokeWidth="1.5" />
                                    <line x1={personX} y1="70" x2={personX + 8} y2="78" stroke="#fbbf24" strokeWidth="1.5" />
                                    <line x1={personX} y1="82" x2={personX - 6} y2="95" stroke="#fbbf24" strokeWidth="1.5" />
                                    <line x1={personX} y1="82" x2={personX + 6} y2="95" stroke="#fbbf24" strokeWidth="1.5" />
                                    <text x={personX} y="105" textAnchor="middle" fill="#fbbf24" fontSize="7" fontFamily="monospace">🚶 Person</text>
                                    {/* IR waves from person to sensor */}
                                    {[0, 1, 2].map(i => {
                                        const progress = ((irWavePhase + i * 20) % 60) / 60;
                                        const waveX = personX - progress * (personX - 200);
                                        const opacity = 1 - progress;
                                        return waveX > 200 ? (
                                            <circle key={`pw-${i}`} cx={waveX} cy="80" r={3 + i * 2} fill="none" stroke="#fb7185" strokeWidth="0.8" opacity={opacity * 0.5} />
                                        ) : null;
                                    })}
                                </g>
                            )}

                            {/* No person indicator */}
                            {!showPerson && (
                                <text x="300" y="80" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="monospace">No Person</text>
                            )}

                            {/* LED Section */}
                            <line x1="92" y1="207" x2="130" y2="250" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,2" />
                            <text x="50" y="240" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">Pin 13</text>

                            {/* LED */}
                            <polygon points="135,240 155,250 135,260" fill={ledOn ? (pulseActive ? '#fbbf24' : '#f97316') : '#374151'} stroke={ledOn ? '#fb923c' : '#4b5563'} strokeWidth="1.5" />
                            <line x1="155" y1="240" x2="155" y2="260" stroke={ledOn ? '#fb923c' : '#4b5563'} strokeWidth="2" />
                            {ledOn && <circle cx="145" cy="250" r={pulseActive ? 18 : 12} fill="#fbbf24" opacity="0.15" />}
                            <text x="165" y="248" fill={ledOn ? '#fbbf24' : '#4b5563'} fontSize="9" fontFamily="monospace">LED</text>
                            <text x="165" y="260" fill={ledOn ? '#f97316' : '#4b5563'} fontSize="8" fontFamily="monospace">{ledOn ? 'ON 🔆' : 'OFF'}</text>

                            {/* GND for LED */}
                            <line x1="155" y1="260" x2="195" y2="260" stroke="#94a3b8" strokeWidth="1.5" />
                            <line x1="195" y1="255" x2="195" y2="265" stroke="#64748b" strokeWidth="2" />
                            <line x1="190" y1="270" x2="200" y2="270" stroke="#64748b" strokeWidth="2" />
                            <line x1="192" y1="274" x2="198" y2="274" stroke="#64748b" strokeWidth="1.5" />
                            <text x="195" y="286" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">GND</text>

                            {/* Status bar */}
                            <rect x="10" y="292" width="380" height="24" rx="6" fill={ledOn ? '#7f1d1d' : '#14532d'} opacity="0.7" />
                            <text x="200" y="308" textAnchor="middle" fill={ledOn ? '#fca5a5' : '#86efac'} fontSize="9" fontWeight="bold" fontFamily="monospace">
                                {ledOn ? '⚠️ MOTION DETECTED — LED ON — "Hello, I found you"' : '✅ NO MOTION — LED OFF — "I cannot find you"'}
                            </text>
                        </svg>
                    </div>

                    {/* Data Panel */}
                    <div className="space-y-3">
                        <div className="p-3 rounded-xl" style={{ background: motionDetected ? '#fef2f2' : '#f0fdf4', border: `1px solid ${motionDetected ? '#fca5a5' : '#86efac'}` }}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold" style={{ color: motionDetected ? '#dc2626' : '#16a34a' }}>🚶 Motion Status</span>
                                <span className="text-xs font-mono font-bold" style={{ color: motionDetected ? '#dc2626' : '#16a34a' }}>{motionDetected ? 'DETECTED' : 'NONE'}</span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden" style={{ background: motionDetected ? '#fee2e2' : '#dcfce7' }}>
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: motionDetected ? '100%' : '0%', background: motionDetected ? 'linear-gradient(90deg,#ef4444,#ec4899)' : 'linear-gradient(90deg,#22c55e,#10b981)' }} />
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                            <p className="text-xs font-bold text-slate-400 mb-1 font-mono">digitalRead(8)</p>
                            <p className="text-2xl font-black font-mono" style={{ color: motionDetected ? '#f87171' : '#4ade80' }}>{sensorValue}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-1">PIR Sensor Output</p>
                        </div>

                        <div className="p-3 rounded-xl bg-pink-50 border border-pink-100">
                            <p className="text-xs font-bold text-pink-800 mb-1">🔴 Sensor Type</p>
                            <p className="text-sm font-bold text-pink-700">Passive — Detects IR, doesn't emit</p>
                        </div>

                        <div className="p-3 rounded-xl border transition-all duration-500" style={{ background: ledOn ? '#fef2f2' : '#f0fdf4', border: `1px solid ${ledOn ? '#fca5a5' : '#86efac'}` }}>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full transition-all duration-500 flex items-center justify-center" style={{ background: ledOn ? '#ef4444' : '#22c55e', boxShadow: ledOn && pulseActive ? '0 0 12px #ef4444' : 'none' }}>
                                    <Lightbulb size={11} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold" style={{ color: ledOn ? '#dc2626' : '#16a34a' }}>LED {ledOn ? 'ON 🔆' : 'OFF 🌑'}</p>
                                    <p className="text-[10px]" style={{ color: ledOn ? '#b91c1c' : '#15803d' }}>{ledOn ? 'Motion detect hui! LED jal gayi' : 'Koi motion nahi, LED band hai'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 font-mono">
                            <p className="text-[10px] text-gray-400 mb-1">📟 Serial Monitor</p>
                            <p className="text-[11px]" style={{ color: motionDetected ? '#fbbf24' : '#94a3b8' }}>
                                {motionDetected ? 'Hello, I found you' : 'I cannot find you'}
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-[10px] text-pink-700 mt-3 text-center font-medium">⬆️ Button click karo motion simulate karne ke liye — Person chalega aur PIR sensor detect karega!</p>
            </div>

            {/* Program Code */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#1e293b' }}>
                    <FileCode2 size={14} className="text-pink-400" />
                    <span className="text-xs font-bold text-pink-300 tracking-wide">Arduino Program — PIR_Sensor.ino</span>
                    <div className="ml-auto flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                </div>
                <div className="bg-gray-950 p-4 font-mono text-xs leading-7 overflow-x-auto">
                    <div><span className="text-purple-400">void</span> <span className="text-yellow-300">setup</span><span className="text-gray-300">()</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-4"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">begin</span><span className="text-gray-300">(</span><span className="text-orange-400">9600</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4 mt-1"><span className="text-sky-300">pinMode</span><span className="text-gray-300">(</span><span className="text-orange-400">13</span><span className="text-gray-300">,</span> <span className="text-orange-400">OUTPUT</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-sky-300">pinMode</span><span className="text-gray-300">(</span><span className="text-orange-400">8</span><span className="text-gray-300">,</span> <span className="text-orange-400">INPUT</span><span className="text-gray-300">);</span></div>
                    <div><span className="text-gray-300">{'}'}</span></div>
                    <div className="mt-3"><span className="text-purple-400">void</span> <span className="text-yellow-300">loop</span><span className="text-gray-300">()</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-4"><span className="text-sky-400">int</span> <span className="text-green-300">value</span> <span className="text-gray-400">=</span> <span className="text-sky-300">digitalRead</span><span className="text-gray-300">(</span><span className="text-orange-400">8</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4 mt-2"><span className="text-purple-400">if</span><span className="text-gray-300">(</span><span className="text-green-300">value</span> <span className="text-gray-400">==</span> <span className="text-orange-400">HIGH</span><span className="text-gray-300">)</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-8"><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-orange-400">13</span><span className="text-gray-300">,</span> <span className="text-orange-400">HIGH</span><span className="text-gray-300">);</span></div>
                    <div className="ml-8"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">println</span><span className="text-gray-300">(</span><span className="text-amber-400">&quot;Hello, I found you&quot;</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-gray-300">{'}'}</span></div>
                    <div className="ml-4"><span className="text-purple-400">else</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-8"><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-orange-400">13</span><span className="text-gray-300">,</span> <span className="text-orange-400">LOW</span><span className="text-gray-300">);</span></div>
                    <div className="ml-8"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">println</span><span className="text-gray-300">(</span><span className="text-amber-400">&quot;I cannot find you&quot;</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-gray-300">{'}'}</span></div>
                    <div><span className="text-gray-300">{'}'}</span></div>
                </div>
            </div>

            {/* Materials and Connections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="p-4 rounded-2xl border border-pink-100 bg-pink-50">
                    <h3 className="text-sm font-extrabold text-pink-900 mb-3 flex items-center gap-2">
                        <Wrench size={14} /> आवश्यक सामग्री (Components)
                    </h3>
                    <ul className="space-y-2">
                        {[
                            { label: 'Arduino Board (Uno R3)', icon: '🟦' },
                            { label: 'PIR Sensor', icon: '🔴' },
                            { label: 'LED', icon: '💡' },
                            { label: 'Bread Board', icon: '🔲' },
                            { label: 'Jumper Wires', icon: '🔗' },
                        ].map((m, i) => (
                            <li key={i} className="flex items-center gap-2.5 text-sm text-pink-900 bg-white rounded-lg px-3 py-2 border border-pink-100 shadow-sm">
                                <span>{m.icon}</span><span className="font-semibold">{m.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 rounded-2xl border border-fuchsia-100 bg-fuchsia-50">
                    <h3 className="text-sm font-extrabold text-fuchsia-900 mb-3 flex items-center gap-2">
                        <CircuitBoard size={14} /> Circuit Connection
                    </h3>
                    <ol className="space-y-2">
                        {[
                            { step: 'VCC Pin → PIR Sensor की VCC pin ko Arduino की 5V se connect करें।', color: 'text-red-600' },
                            { step: 'GND Pin → Sensor की Ground pin ko Arduino की Ground se connect करें।', color: 'text-gray-600' },
                            { step: 'OUT Pin → Sensor की OUT pin ko Arduino की Digital Pin 8 se connect करें।', color: 'text-emerald-600' },
                            { step: 'LED → LED ko Arduino की Pin 13 aur Ground se connect करें।', color: 'text-amber-600' },
                        ].map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-fuchsia-900">
                                <span className="w-5 h-5 flex-shrink-0 rounded-full bg-fuchsia-700 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                                <span className={`font-medium ${c.color}`}>{c.step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Working Principle */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 mb-6">
                <h3 className="text-sm font-extrabold text-violet-900 mb-4 flex items-center gap-2">
                    <Activity size={14} /> 🔹 Working
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { icon: '🚶', heading: 'Motion Detected (HIGH)', body: 'Jab PIR Sensor Motion Detect karta hai to Sensor ka Output HIGH ho jata hai। Arduino Digital Pin 8 se value read karta hai। value == HIGH hone par LED ON hoti hai aur Serial Monitor par "Hello, I found you" print hota hai।', bg: 'bg-red-50', border: 'border-red-200', tc: 'text-red-900' },
                        { icon: '🚫', heading: 'No Motion (LOW)', body: 'Jab PIR Sensor Motion Detect nahi karta to Sensor ka Output LOW rehta hai। value == LOW hone par LED OFF hoti hai aur Serial Monitor par "I cannot find you" print hota hai।', bg: 'bg-emerald-50', border: 'border-emerald-200', tc: 'text-emerald-900' },
                        { icon: '🔴', heading: 'Passive Detection', body: 'PIR Sensor khud koi signal transmit nahi karta। Ye sirf object se nikalne wali Infrared Radiation ko detect karta hai। Isliye ise Passive Infrared Sensor kaha jata hai।', bg: 'bg-pink-50', border: 'border-pink-200', tc: 'text-pink-900' },
                        { icon: '💻', heading: 'Serial Monitor', body: 'Serial.println() se message print hota hai। Arduino IDE mein Serial Monitor (9600 baud) kholkar output dekh sakte hain।', bg: 'bg-sky-50', border: 'border-sky-200', tc: 'text-sky-900' },
                    ].map((w, i) => (
                        <div key={i} className={`p-3 rounded-xl ${w.bg} border ${w.border}`}>
                            <p className={`text-xs font-bold ${w.tc} mb-1`}>{w.icon} {w.heading}</p>
                            <p className={`text-[11px] ${w.tc} leading-relaxed`}>{w.body}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Program Working Steps */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 mb-6">
                <h3 className="text-sm font-extrabold text-teal-900 mb-4 flex items-center gap-2">
                    <Cog size={14} /> 🔹 Program Working
                </h3>
                <div className="space-y-2">
                    {[
                        'Arduino Sensor ki Output Value ko Digital Pin 8 se Read karta hai।',
                        'Agar Motion Detect hoti hai (value == HIGH) to LED ON ho jaati hai।',
                        'Serial Monitor par "Hello, I found you" message display hota hai।',
                        'Agar Motion Detect nahi hoti (value == LOW) to LED OFF ho jaati hai।',
                        'Serial Monitor par "I cannot find you" message display hota hai।',
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                            <span className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                            <span className="text-xs font-medium text-teal-800">{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Output */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-xs font-bold text-red-800 mb-2">🚶 Output 1 (Motion Detected):</p>
                    <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs">
                        <p className="text-green-400">Hello, I found you</p>
                        <p className="text-yellow-400">LED ON 🔆</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <p className="text-xs font-bold text-emerald-800 mb-2">🚫 Output 2 (No Motion):</p>
                    <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs">
                        <p className="text-green-400">I cannot find you</p>
                        <p className="text-gray-400">LED OFF 🌑</p>
                    </div>
                </div>
            </div>

            {/* Conclusion */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-50 to-fuchsia-50 border border-pink-200 mb-6">
                <h3 className="text-sm font-extrabold text-pink-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={14} /> 🔹 Conclusion
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                    PIR Sensor ko Arduino Uno ke saath successfully interface kiya gaya। Sensor ne motion detect ki aur motion detect hone par LED ON hui tatha Serial Monitor par <strong>"Hello, I found you"</strong> display hua। Motion na hone par LED OFF hui aur <strong>"I cannot find you"</strong> display hua। PIR Sensor ka upyog <strong>Security Systems</strong>, <strong>Smart Lighting</strong>, <strong>Home Automation</strong> aur <strong>Motion Detection Applications</strong> mein kiya jaata hai।
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                    {['Security Systems', 'Smart Lighting', 'Home Automation', 'Motion Detection', 'Burglar Alarm'].map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-pink-200 rounded-full text-[10px] font-bold text-pink-700 shadow-sm">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Flowchart */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                <h3 className="text-sm font-extrabold text-gray-800 mb-4 flex items-center gap-2">
                    <ChevronRight size={14} className="text-pink-500" /> Program Flow (Flowchart)
                </h3>
                <div className="flex flex-col items-center gap-0 text-center text-xs font-semibold">
                    {([
                        { label: 'START', style: { background: '#ec4899', color: 'white', borderRadius: '50px' } as React.CSSProperties },
                        null,
                        { label: 'Serial.begin(9600) | pinMode(13, OUTPUT) | pinMode(8, INPUT)', style: { background: '#eff6ff', border: '1.5px solid #93c5fd', color: '#1e40af', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'value = digitalRead(8)', style: { background: '#fef3c7', border: '1.5px solid #fcd34d', color: '#92400e', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'value == HIGH ?', style: { background: '#fce7f3', border: '1.5px solid #f9a8d4', color: '#9d174d', borderRadius: '50px' } as React.CSSProperties },
                        null,
                        { label: 'YES → digitalWrite(13, HIGH) → LED ON 🔆 | Serial: "Hello, I found you"', style: { background: '#ecfdf5', border: '1.5px solid #6ee7b7', color: '#065f46', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'NO → digitalWrite(13, LOW) → LED OFF 🌑 | Serial: "I cannot find you"', style: { background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#991b1b', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: '↩ loop() repeats', style: { background: '#fdf2f8', border: '1.5px solid #f9a8d4', color: '#be185d', borderRadius: '8px' } as React.CSSProperties },
                    ] as Array<{ label: string; style: React.CSSProperties } | null>).map((item, i) =>
                        item === null
                            ? <div key={i} className="w-0.5 h-5 bg-gray-300" />
                            : <div key={i} className="px-4 py-2 text-[11px] shadow-sm" style={item.style}>{item.label}</div>
                    )}
                </div>
            </div>
        </section>
    );
}

function IRPracticalSection() {
    const [objectPresent, setObjectPresent] = useState(false);
    const [pulseActive, setPulseActive] = useState(false);
    const [irBeamPhase, setIrBeamPhase] = useState(0);
    const [objectX, setObjectX] = useState(340);

    const sensorValue = objectPresent ? 'HIGH' : 'LOW';
    const ledOn = objectPresent;

    useEffect(() => {
        const t = setInterval(() => setIrBeamPhase(p => (p + 1) % 60), 80);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        if (ledOn) {
            const t = setInterval(() => setPulseActive(p => !p), 500);
            return () => clearInterval(t);
        }
        setPulseActive(false);
    }, [ledOn]);

    // Animate object sliding in/out
    useEffect(() => {
        if (objectPresent) {
            const t = setInterval(() => {
                setObjectX(p => (p <= 240 ? 240 : p - 3));
            }, 40);
            return () => clearInterval(t);
        } else {
            const t = setInterval(() => {
                setObjectX(p => (p >= 340 ? 340 : p + 4));
            }, 40);
            return () => clearInterval(t);
        }
    }, [objectPresent]);

    return (
        <section id="ir-practical" className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg bg-white" style={{ border: '1px solid #fecaca', boxShadow: '0 1px 3px rgba(239,68,68,0.08)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #fee2e2' }}>
                <Radar size={16} className="text-red-500" />
                <h2 className="text-base md:text-lg font-extrabold text-gray-800">🔬 Practical – IR (Infrared) Sensor</h2>
            </div>

            {/* Objective */}
            <div className="rounded-xl p-4 mb-6 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #fee2e2, #fecaca)', border: '1px solid #fca5a5', color: '#7f1d1d' }}>
                🎯 <strong>Objective:</strong> IR (Infrared) Sensor ko Arduino Uno ke saath interface karke <strong>object detection</strong> karna aur object detect hone par <strong>LED ko ON</strong> karna।
            </div>

            {/* Theory Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 mb-6">
                <h3 className="text-sm font-extrabold text-red-900 mb-4 flex items-center gap-2">
                    <Eye size={14} /> 🔹 Theory
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                    <p>IR Sensor ek electronic sensor hai jo <strong>Infrared Light</strong> ka use karke object ko detect karta hai।</p>
                    <p>IR Sensor me do main parts hote hain: <strong>IR Transmitter</strong> aur <strong>IR Receiver</strong>।</p>
                    <p>IR Transmitter <strong>Infrared Rays emit</strong> karta hai aur jab koi object sensor ke saamne aata hai to ye rays object se takrakar wapas <strong>receiver</strong> par aati hain।</p>
                    <p>IR Receiver reflected rays ko detect karta hai aur sensor ka <strong>output change</strong> ho jata hai।</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    <div className="p-4 rounded-xl bg-white border border-red-200 text-center shadow-sm">
                        <div className="text-3xl mb-2">🟥</div>
                        <p className="text-xs font-bold text-red-800">IR Transmitter</p>
                        <p className="text-[11px] text-gray-600 mt-1">Infrared Rays emit karta hai</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-red-200 text-center shadow-sm">
                        <div className="text-3xl mb-2">📥</div>
                        <p className="text-xs font-bold text-red-800">IR Receiver</p>
                        <p className="text-[11px] text-gray-600 mt-1">Reflected rays ko detect karta hai</p>
                    </div>
                </div>

                {/* How it works flow */}
                <div className="mt-5 p-4 bg-white rounded-xl border border-red-200">
                    <p className="text-xs font-bold text-red-800 mb-3 uppercase tracking-wide">📊 Working Flow:</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <span className="px-3 py-2 bg-red-700 rounded-lg text-white shadow-sm font-bold text-[11px] flex items-center gap-1">🟥 IR Transmit</span>
                        <ChevronRight className="text-red-400 rotate-90 sm:rotate-0" size={14} />
                        <span className="px-3 py-2 bg-amber-100 rounded-lg text-amber-800 shadow-sm font-bold text-[11px] flex items-center gap-1">🧱 Hit Object</span>
                        <ChevronRight className="text-red-400 rotate-90 sm:rotate-0" size={14} />
                        <span className="px-3 py-2 bg-emerald-100 rounded-lg text-emerald-800 shadow-sm font-bold text-[11px] flex items-center gap-1">📥 IR Receive</span>
                        <ChevronRight className="text-red-400 rotate-90 sm:rotate-0" size={14} />
                        <span className="px-3 py-2 bg-violet-100 rounded-lg text-violet-800 shadow-sm font-bold text-[11px] flex items-center gap-1">💡 LED ON</span>
                    </div>
                </div>

                {/* Applications */}
                <div className="mt-5">
                    <p className="text-xs font-bold text-red-800 mb-2 uppercase tracking-wide">🛠️ Applications:</p>
                    <div className="flex flex-wrap gap-2">
                        {['Obstacle Detection', 'Line Following Robot', 'Object Counter', 'Industrial Automation', 'Smart Security'].map((app, i) => (
                            <span key={i} className="px-3 py-1 bg-white border border-red-200 rounded-full text-[10px] font-bold text-red-700 shadow-sm">{app}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ Interactive Simulator ═══ */}
            <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-amber-50 p-5 mb-6">
                <p className="text-xs font-bold text-red-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={12} /> Interactive Simulator — Object ko lao ya hatao!
                </p>

                {/* Toggle Button */}
                <div className="flex flex-col items-center gap-3 mb-5">
                    <button
                        onClick={() => setObjectPresent(p => !p)}
                        className="px-8 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
                        style={{
                            background: objectPresent ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #6b7280, #9ca3af)',
                            color: 'white',
                            border: objectPresent ? '2px solid #f87171' : '2px solid #d1d5db',
                            boxShadow: objectPresent ? '0 0 20px rgba(239,68,68,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                    >
                        {objectPresent ? '🧱 Object Present! (Click to Remove)' : '❌ No Object (Click to Place Object)'}
                    </button>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: ledOn ? '#fef2f2' : '#f0fdf4', border: `1px solid ${ledOn ? '#fca5a5' : '#86efac'}`, color: ledOn ? '#dc2626' : '#16a34a' }}>
                        {ledOn ? '⚠️ Object Detected! LED ON' : '✅ No Object — LED OFF'}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                    {/* Animated SVG Circuit Diagram */}
                    <div className="flex justify-center">
                        <svg viewBox="0 0 400 320" className="w-full max-w-md" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.10))' }}>
                            <rect width="400" height="320" rx="16" fill="#0f172a" />

                            {/* Title */}
                            <text x="200" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="monospace">IR SENSOR OBJECT DETECTION SIMULATOR</text>

                            {/* Arduino Board */}
                            <rect x="10" y="90" width="80" height="130" rx="8" fill="#1e40af" stroke="#3b82f6" strokeWidth="1.5" />
                            <text x="50" y="115" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">ARDUINO</text>
                            <text x="50" y="128" textAnchor="middle" fill="#93c5fd" fontSize="7" fontFamily="monospace">UNO R3</text>
                            {/* Arduino pins */}
                            <rect x="70" y="138" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="148" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">5V</text>
                            <rect x="70" y="158" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="168" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">GND</text>
                            <rect x="70" y="178" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="188" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">D8</text>
                            <rect x="70" y="198" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="208" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">D13</text>

                            {/* Wires from Arduino to IR Sensor */}
                            <line x1="92" y1="145" x2="150" y2="70" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />
                            <line x1="92" y1="165" x2="150" y2="100" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,2" />
                            <line x1="92" y1="185" x2="150" y2="85" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,2" />

                            {/* IR Sensor body */}
                            <rect x="150" y="45" width="80" height="70" rx="8" fill="#1a1a2e" stroke="#ef4444" strokeWidth="1.5" />
                            <text x="190" y="62" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">IR SENSOR</text>

                            {/* IR Transmitter LED */}
                            <circle cx="170" cy="90" r="10" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
                            <circle cx="170" cy="90" r="5" fill={objectPresent ? '#ef4444' : '#7f1d1d'} opacity={objectPresent ? 1 : 0.6}>
                                {objectPresent && <animate attributeName="opacity" values="1;0.5;1" dur="0.6s" repeatCount="indefinite" />}
                            </circle>
                            <text x="170" y="107" textAnchor="middle" fill="#f87171" fontSize="6" fontWeight="bold" fontFamily="monospace">TX</text>

                            {/* IR Receiver */}
                            <circle cx="210" cy="90" r="10" fill="#1a1a2e" stroke="#94a3b8" strokeWidth="1.5" />
                            <circle cx="210" cy="90" r="5" fill={objectPresent ? '#22c55e' : '#374151'} opacity={objectPresent ? 1 : 0.5}>
                                {objectPresent && <animate attributeName="opacity" values="1;0.4;1" dur="0.8s" repeatCount="indefinite" />}
                            </circle>
                            <text x="210" y="107" textAnchor="middle" fill="#94a3b8" fontSize="6" fontWeight="bold" fontFamily="monospace">RX</text>

                            {/* Sensor pin labels */}
                            <text x="155" y="70" fill="#f87171" fontSize="6" fontFamily="monospace">VCC</text>
                            <text x="155" y="85" fill="#4ade80" fontSize="6" fontFamily="monospace">OUT</text>
                            <text x="155" y="100" fill="#94a3b8" fontSize="6" fontFamily="monospace">GND</text>

                            {/* IR Beam - Transmitted (going out) */}
                            {[0, 1, 2, 3].map(i => {
                                const progress = ((irBeamPhase + i * 15) % 60) / 60;
                                const beamX = 185 + progress * (objectX - 185);
                                const opacity = 1 - progress;
                                return beamX < objectX ? (
                                    <g key={`ir-tx-${i}`}>
                                        <circle cx={beamX} cy={85} r={1.5 + i * 0.5} fill="#ef4444" opacity={opacity * 0.7} />
                                        <line x1={beamX - 3} y1={85} x2={beamX + 3} y2={85} stroke="#ef4444" strokeWidth="1" opacity={opacity * 0.5} />
                                    </g>
                                ) : null;
                            })}

                            {/* IR Beam - Reflected (coming back, only when object present) */}
                            {objectPresent && [0, 1, 2].map(i => {
                                const progress = ((irBeamPhase + 30 + i * 15) % 60) / 60;
                                const beamX = objectX - progress * (objectX - 215);
                                const opacity = 1 - progress;
                                return beamX > 215 ? (
                                    <g key={`ir-rx-${i}`}>
                                        <circle cx={beamX} cy={95} r={1.5 + i * 0.5} fill="#22c55e" opacity={opacity * 0.6} />
                                        <line x1={beamX - 3} y1={95} x2={beamX + 3} y2={95} stroke="#22c55e" strokeWidth="1" opacity={opacity * 0.4} />
                                    </g>
                                ) : null;
                            })}

                            {/* IR Beam lines (continuous) */}
                            <line x1="185" y1="85" x2={Math.min(objectX, 340)} y2="85" stroke="#ef4444" strokeWidth="0.8" opacity="0.25" strokeDasharray="2,3" />
                            {objectPresent && <line x1={objectX} y1="95" x2="215" y2="95" stroke="#22c55e" strokeWidth="0.8" opacity="0.25" strokeDasharray="2,3" />}

                            {/* Object (block) */}
                            <g>
                                <rect x={objectX - 8} y={55} width={16} height={60} rx={4} fill={objectPresent ? '#f59e0b' : '#374151'} stroke={objectPresent ? '#fbbf24' : '#4b5563'} strokeWidth="1.5" opacity={objectX <= 335 ? 1 : 0.3} />
                                {objectX <= 335 && (
                                    <text x={objectX} y={48} textAnchor="middle" fill={objectPresent ? '#fbbf24' : '#64748b'} fontSize="7" fontWeight="bold" fontFamily="monospace">
                                        {objectPresent ? '🧱 Object' : '👻 Ghost'}
                                    </text>
                                )}
                                {/* Reflection glow on object */}
                                {objectPresent && objectX <= 250 && (
                                    <circle cx={objectX - 8} cy={85} r={6} fill="#ef4444" opacity={pulseActive ? 0.2 : 0.1} />
                                )}
                            </g>

                            {/* LED Section */}
                            <line x1="92" y1="205" x2="130" y2="245" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,2" />
                            <text x="50" y="235" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">Pin 13</text>

                            {/* LED */}
                            <polygon points="135,235 155,245 135,255" fill={ledOn ? (pulseActive ? '#fbbf24' : '#f97316') : '#374151'} stroke={ledOn ? '#fb923c' : '#4b5563'} strokeWidth="1.5" />
                            <line x1="155" y1="235" x2="155" y2="255" stroke={ledOn ? '#fb923c' : '#4b5563'} strokeWidth="2" />
                            {ledOn && <circle cx="145" cy="245" r={pulseActive ? 18 : 12} fill="#fbbf24" opacity="0.15" />}
                            <text x="165" y="243" fill={ledOn ? '#fbbf24' : '#4b5563'} fontSize="9" fontFamily="monospace">LED</text>
                            <text x="165" y="255" fill={ledOn ? '#f97316' : '#4b5563'} fontSize="8" fontFamily="monospace">{ledOn ? 'ON 🔆' : 'OFF'}</text>

                            {/* GND for LED */}
                            <line x1="155" y1="255" x2="195" y2="255" stroke="#94a3b8" strokeWidth="1.5" />
                            <line x1="195" y1="250" x2="195" y2="260" stroke="#64748b" strokeWidth="2" />
                            <line x1="190" y1="265" x2="200" y2="265" stroke="#64748b" strokeWidth="2" />
                            <line x1="192" y1="269" x2="198" y2="269" stroke="#64748b" strokeWidth="1.5" />
                            <text x="195" y="281" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">GND</text>

                            {/* Status bar */}
                            <rect x="10" y="292" width="380" height="24" rx="6" fill={ledOn ? '#7f1d1d' : '#14532d'} opacity="0.7" />
                            <text x="200" y="308" textAnchor="middle" fill={ledOn ? '#fca5a5' : '#86efac'} fontSize="9" fontWeight="bold" fontFamily="monospace">
                                {ledOn ? '⚠️ OBJECT DETECTED — LED ON — digitalRead(8) = HIGH' : '✅ NO OBJECT — LED OFF — digitalRead(8) = LOW'}
                            </text>
                        </svg>
                    </div>

                    {/* Data Panel */}
                    <div className="space-y-3">
                        <div className="p-3 rounded-xl" style={{ background: objectPresent ? '#fef2f2' : '#f0fdf4', border: `1px solid ${objectPresent ? '#fca5a5' : '#86efac'}` }}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold" style={{ color: objectPresent ? '#dc2626' : '#16a34a' }}>🧱 Object Status</span>
                                <span className="text-xs font-mono font-bold" style={{ color: objectPresent ? '#dc2626' : '#16a34a' }}>{objectPresent ? 'DETECTED' : 'NONE'}</span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden" style={{ background: objectPresent ? '#fee2e2' : '#dcfce7' }}>
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: objectPresent ? '100%' : '0%', background: objectPresent ? 'linear-gradient(90deg,#ef4444,#f97316)' : 'linear-gradient(90deg,#22c55e,#10b981)' }} />
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                            <p className="text-xs font-bold text-slate-400 mb-1 font-mono">digitalRead(8)</p>
                            <p className="text-2xl font-black font-mono" style={{ color: objectPresent ? '#f87171' : '#4ade80' }}>{sensorValue}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-1">IR Sensor Output</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 rounded-xl bg-red-950 border border-red-800 text-center">
                                <div className="w-5 h-5 rounded-full mx-auto mb-1" style={{ background: objectPresent ? '#ef4444' : '#374151', boxShadow: objectPresent ? '0 0 10px #ef4444' : 'none' }} />
                                <p className="text-[10px] font-bold text-red-300">IR TX</p>
                                <p className="text-[9px] text-red-400">{objectPresent ? 'Emitting' : 'Idle'}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center">
                                <div className="w-5 h-5 rounded-full mx-auto mb-1" style={{ background: objectPresent ? '#22c55e' : '#374151', boxShadow: objectPresent ? '0 0 10px #22c55e' : 'none' }} />
                                <p className="text-[10px] font-bold text-slate-300">IR RX</p>
                                <p className="text-[9px] text-slate-400">{objectPresent ? 'Receiving' : 'No Signal'}</p>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl border transition-all duration-500" style={{ background: ledOn ? '#fef2f2' : '#f0fdf4', border: `1px solid ${ledOn ? '#fca5a5' : '#86efac'}` }}>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full transition-all duration-500 flex items-center justify-center" style={{ background: ledOn ? '#ef4444' : '#22c55e', boxShadow: ledOn && pulseActive ? '0 0 12px #ef4444' : 'none' }}>
                                    <Lightbulb size={11} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold" style={{ color: ledOn ? '#dc2626' : '#16a34a' }}>LED {ledOn ? 'ON 🔆' : 'OFF 🌑'}</p>
                                    <p className="text-[10px]" style={{ color: ledOn ? '#b91c1c' : '#15803d' }}>{ledOn ? 'Object detect hua! LED jal gayi' : 'Koi object nahi, LED band hai'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 font-mono">
                            <p className="text-[10px] text-gray-400 mb-1">📟 Serial Monitor</p>
                            <p className="text-[11px]" style={{ color: objectPresent ? '#fbbf24' : '#94a3b8' }}>
                                {objectPresent ? 'Object Detected — LED ON' : 'No Object — LED OFF'}
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-[10px] text-red-700 mt-3 text-center font-medium">⬆️ Button click karo object place karne ke liye — IR beam reflect hoga aur LED ON ho jayegi!</p>
            </div>

            {/* Program Code */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#1e293b' }}>
                    <FileCode2 size={14} className="text-red-400" />
                    <span className="text-xs font-bold text-red-300 tracking-wide">Arduino Program — IR_Sensor.ino</span>
                    <div className="ml-auto flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                </div>
                <div className="bg-gray-950 p-4 font-mono text-xs leading-7 overflow-x-auto">
                    <div><span className="text-purple-400">void</span> <span className="text-yellow-300">setup</span><span className="text-gray-300">()</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-4"><span className="text-sky-300">pinMode</span><span className="text-gray-300">(</span><span className="text-orange-400">13</span><span className="text-gray-300">,</span> <span className="text-orange-400">OUTPUT</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-sky-300">pinMode</span><span className="text-gray-300">(</span><span className="text-orange-400">8</span><span className="text-gray-300">,</span> <span className="text-orange-400">INPUT</span><span className="text-gray-300">);</span></div>
                    <div><span className="text-gray-300">{'}'}</span></div>
                    <div className="mt-3"><span className="text-purple-400">void</span> <span className="text-yellow-300">loop</span><span className="text-gray-300">()</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-4"><span className="text-sky-400">int</span> <span className="text-green-300">value</span> <span className="text-gray-400">=</span> <span className="text-sky-300">digitalRead</span><span className="text-gray-300">(</span><span className="text-orange-400">8</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4 mt-2"><span className="text-purple-400">if</span><span className="text-gray-300">(</span><span className="text-green-300">value</span> <span className="text-gray-400">==</span> <span className="text-orange-400">HIGH</span><span className="text-gray-300">)</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-8"><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-orange-400">13</span><span className="text-gray-300">,</span> <span className="text-orange-400">HIGH</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-gray-300">{'}'}</span></div>
                    <div className="ml-4"><span className="text-purple-400">else</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-8"><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-orange-400">13</span><span className="text-gray-300">,</span> <span className="text-orange-400">LOW</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-gray-300">{'}'}</span></div>
                    <div><span className="text-gray-300">{'}'}</span></div>
                </div>
            </div>

            {/* Materials and Connections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="p-4 rounded-2xl border border-red-100 bg-red-50">
                    <h3 className="text-sm font-extrabold text-red-900 mb-3 flex items-center gap-2">
                        <Wrench size={14} /> आवश्यक सामग्री (Components)
                    </h3>
                    <ul className="space-y-2">
                        {[
                            { label: 'Arduino Board (Uno R3)', icon: '🟦' },
                            { label: 'IR Sensor', icon: '🟥' },
                            { label: 'LED', icon: '💡' },
                            { label: 'Jumper Wires', icon: '🔗' },
                        ].map((m, i) => (
                            <li key={i} className="flex items-center gap-2.5 text-sm text-red-900 bg-white rounded-lg px-3 py-2 border border-red-100 shadow-sm">
                                <span>{m.icon}</span><span className="font-semibold">{m.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 rounded-2xl border border-orange-100 bg-orange-50">
                    <h3 className="text-sm font-extrabold text-orange-900 mb-3 flex items-center gap-2">
                        <CircuitBoard size={14} /> Circuit Connection
                    </h3>
                    <ol className="space-y-2">
                        {[
                            { step: 'VCC → IR Sensor की VCC ko Arduino की 5V Pin se connect करें।', color: 'text-red-600' },
                            { step: 'GND → Sensor की GND ko Arduino की GND Pin se connect करें।', color: 'text-gray-600' },
                            { step: 'OUT → Sensor की OUT Pin ko Arduino की Digital Pin 8 se connect करें।', color: 'text-emerald-600' },
                            { step: 'LED → LED ko Arduino की Pin 13 aur Ground se connect करें।', color: 'text-amber-600' },
                        ].map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-orange-900">
                                <span className="w-5 h-5 flex-shrink-0 rounded-full bg-orange-700 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                                <span className={`font-medium ${c.color}`}>{c.step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Working Principle */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 mb-6">
                <h3 className="text-sm font-extrabold text-violet-900 mb-4 flex items-center gap-2">
                    <Activity size={14} /> 🔹 कार्य प्रणाली (Working Process)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { icon: '🧱', heading: 'Object आने पर (HIGH)', body: 'जब IR Sensor के सामने कोई Object आता है तो Sensor की Output Pin HIGH हो जाती है। Arduino Digital Pin 8 se value read karta hai aur LED ON kar deta hai।', bg: 'bg-red-50', border: 'border-red-200', tc: 'text-red-900' },
                        { icon: '❌', heading: 'Object नहीं (LOW)', body: 'जब कोई Object Sensor के सामने नहीं होता तब Output Pin LOW होती है। Arduino LED ko OFF kar deta hai।', bg: 'bg-emerald-50', border: 'border-emerald-200', tc: 'text-emerald-900' },
                        { icon: '🟥', heading: 'IR Transmitter', body: 'IR Transmitter lagaatar Infrared Rays emit karta hai। Ye rays invisible hoti hain aur inhe human eye se nahi dekh sakte।', bg: 'bg-orange-50', border: 'border-orange-200', tc: 'text-orange-900' },
                        { icon: '📥', heading: 'IR Receiver', body: 'Jab IR rays kisi object se reflect hokar wapas aati hain to IR Receiver inhe detect karta hai aur sensor ka output change ho jata hai।', bg: 'bg-sky-50', border: 'border-sky-200', tc: 'text-sky-900' },
                    ].map((w, i) => (
                        <div key={i} className={`p-3 rounded-xl ${w.bg} border ${w.border}`}>
                            <p className={`text-xs font-bold ${w.tc} mb-1`}>{w.icon} {w.heading}</p>
                            <p className={`text-[11px] ${w.tc} leading-relaxed`}>{w.body}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Program Working Steps */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 mb-6">
                <h3 className="text-sm font-extrabold text-teal-900 mb-4 flex items-center gap-2">
                    <Cog size={14} /> 🔹 Program Working
                </h3>
                <div className="space-y-2">
                    {[
                        'IR Sensor Object ko Detect karta hai।',
                        'Arduino Sensor ki Output Value ko Digital Pin 8 se Read karta hai।',
                        'Agar Object Detect hota hai (value == HIGH) to condition true hoti hai।',
                        'Arduino digitalWrite(13, HIGH) execute karta hai aur LED ON ho jaati hai।',
                        'Agar Object Detect nahi hota (value == LOW) to LED OFF ho jaati hai।',
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                            <span className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                            <span className="text-xs font-medium text-teal-800">{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Output */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-xs font-bold text-red-800 mb-2">🧱 Output 1 (Object Detected):</p>
                    <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs">
                        <p className="text-yellow-400">LED ON 🔆</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <p className="text-xs font-bold text-emerald-800 mb-2">❌ Output 2 (No Object):</p>
                    <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs">
                        <p className="text-gray-400">LED OFF 🌑</p>
                    </div>
                </div>
            </div>

            {/* Conclusion */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 mb-6">
                <h3 className="text-sm font-extrabold text-red-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={14} /> 🔹 Conclusion
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                    IR Sensor ko Arduino Uno ke saath successfully interface kiya gaya। Sensor ne object ko detect kiya aur object detect hone par <strong>LED ON</strong> hui, jabki object na hone par <strong>LED OFF</strong> rahi। IR Sensor ka upyog <strong>Obstacle Detection</strong>, <strong>Line Following Robots</strong>, <strong>Security Systems</strong> aur <strong>Automation Projects</strong> mein kiya jaata hai।
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                    {['Obstacle Detection', 'Line Following Robot', 'Object Counter', 'Industrial Automation', 'Security Systems'].map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-red-200 rounded-full text-[10px] font-bold text-red-700 shadow-sm">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Flowchart */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                <h3 className="text-sm font-extrabold text-gray-800 mb-4 flex items-center gap-2">
                    <ChevronRight size={14} className="text-red-500" /> Program Flow (Flowchart)
                </h3>
                <div className="flex flex-col items-center gap-0 text-center text-xs font-semibold">
                    {([
                        { label: 'START', style: { background: '#ef4444', color: 'white', borderRadius: '50px' } as React.CSSProperties },
                        null,
                        { label: 'pinMode(13, OUTPUT) | pinMode(8, INPUT)', style: { background: '#eff6ff', border: '1.5px solid #93c5fd', color: '#1e40af', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'value = digitalRead(8)', style: { background: '#fef3c7', border: '1.5px solid #fcd34d', color: '#92400e', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'value == HIGH ?', style: { background: '#fee2e2', border: '1.5px solid #fca5a5', color: '#991b1b', borderRadius: '50px' } as React.CSSProperties },
                        null,
                        { label: 'YES → digitalWrite(13, HIGH) → LED ON 🔆', style: { background: '#ecfdf5', border: '1.5px solid #6ee7b7', color: '#065f46', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'NO → digitalWrite(13, LOW) → LED OFF 🌑', style: { background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#991b1b', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: '↩ loop() repeats', style: { background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#dc2626', borderRadius: '8px' } as React.CSSProperties },
                    ] as Array<{ label: string; style: React.CSSProperties } | null>).map((item, i) =>
                        item === null
                            ? <div key={i} className="w-0.5 h-5 bg-gray-300" />
                            : <div key={i} className="px-4 py-2 text-[11px] shadow-sm" style={item.style}>{item.label}</div>
                    )}
                </div>
            </div>
        </section>
    );
}

function DHTSensorPracticalSection() {
    const [temp, setTemp] = useState(28);
    const [humidity, setHumidity] = useState(65);
    const [wavePhase, setWavePhase] = useState(0);

    const tempF = ((temp * 9) / 5 + 32).toFixed(1);

    useEffect(() => {
        const t = setInterval(() => setWavePhase(p => (p + 1) % 60), 100);
        return () => clearInterval(t);
    }, []);

    const tempColor = temp <= 15 ? '#3b82f6' : temp <= 25 ? '#22c55e' : temp <= 35 ? '#f59e0b' : '#ef4444';
    const humidityColor = humidity <= 30 ? '#f59e0b' : humidity <= 60 ? '#22c55e' : '#3b82f6';

    return (
        <section id="dht-practical" className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg bg-white" style={{ border: '1px solid #a7f3d0', boxShadow: '0 1px 3px rgba(16,185,129,0.08)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #d1fae5' }}>
                <Thermometer size={16} className="text-emerald-500" />
                <h2 className="text-base md:text-lg font-extrabold text-gray-800">🔬 Practical – DHT11 Sensor (Temperature & Humidity)</h2>
            </div>

            {/* Objective */}
            <div className="rounded-xl p-4 mb-6 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', border: '1px solid #6ee7b7', color: '#064e3b' }}>
                🎯 <strong>Objective:</strong> DHT11 Sensor ko Arduino Uno ke saath interface karke <strong>Temperature aur Humidity</strong> ko measure karna aur <strong>Serial Monitor</strong> par display karna।
            </div>

            {/* Theory Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 mb-6">
                <h3 className="text-sm font-extrabold text-emerald-900 mb-4 flex items-center gap-2">
                    <Thermometer size={14} /> 🔹 Theory
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                    <p>DHT11 ek <strong>digital sensor</strong> hai jo Temperature aur Humidity dono ko measure karta hai।</p>
                    <p>Ye sensor environment ki humidity aur temperature ko detect karke <strong>digital signal</strong> ke roop me Arduino ko bhejta hai।</p>
                    <p>DHT11 me ek <strong>humidity sensing element</strong> aur ek <strong>temperature sensing element</strong> hota hai jo atmosphere ki condition ko continuously monitor karta hai।</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    <div className="p-4 rounded-xl bg-white border border-emerald-200 text-center shadow-sm">
                        <div className="text-3xl mb-2">🌡️</div>
                        <p className="text-xs font-bold text-emerald-800">Temperature Sensing</p>
                        <p className="text-[11px] text-gray-600 mt-1">0°C to 50°C range</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-emerald-200 text-center shadow-sm">
                        <div className="text-3xl mb-2">💧</div>
                        <p className="text-xs font-bold text-emerald-800">Humidity Sensing</p>
                        <p className="text-[11px] text-gray-600 mt-1">20% to 90% RH range</p>
                    </div>
                </div>

                {/* Working flow */}
                <div className="mt-5 p-4 bg-white rounded-xl border border-emerald-200">
                    <p className="text-xs font-bold text-emerald-800 mb-3 uppercase tracking-wide">📊 Working Flow:</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <span className="px-3 py-2 bg-emerald-700 rounded-lg text-white shadow-sm font-bold text-[11px] flex items-center gap-1">🌡️ Sense Temp</span>
                        <ChevronRight className="text-emerald-400 rotate-90 sm:rotate-0" size={14} />
                        <span className="px-3 py-2 bg-sky-100 rounded-lg text-sky-800 shadow-sm font-bold text-[11px] flex items-center gap-1">💧 Sense Humidity</span>
                        <ChevronRight className="text-emerald-400 rotate-90 sm:rotate-0" size={14} />
                        <span className="px-3 py-2 bg-amber-100 rounded-lg text-amber-800 shadow-sm font-bold text-[11px] flex items-center gap-1">📡 Digital Signal</span>
                        <ChevronRight className="text-emerald-400 rotate-90 sm:rotate-0" size={14} />
                        <span className="px-3 py-2 bg-violet-100 rounded-lg text-violet-800 shadow-sm font-bold text-[11px] flex items-center gap-1">💻 Serial Display</span>
                    </div>
                </div>

                {/* Applications */}
                <div className="mt-5">
                    <p className="text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wide">🛠️ Applications:</p>
                    <div className="flex flex-wrap gap-2">
                        {['Weather Monitoring', 'Smart Home', 'Temperature Monitor', 'IoT Environmental', 'Green House'].map((app, i) => (
                            <span key={i} className="px-3 py-1 bg-white border border-emerald-200 rounded-full text-[10px] font-bold text-emerald-700 shadow-sm">{app}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ Interactive Simulator ═══ */}
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-cyan-50 p-5 mb-6">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={12} /> Interactive Simulator — Temperature & Humidity adjust karo!
                </p>

                {/* Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                            <span>❄️ Cold — 0°C</span>
                            <span>🔥 Hot — 50°C</span>
                        </div>
                        <input type="range" min={0} max={50} value={temp} onChange={e => setTemp(Number(e.target.value))}
                            className="w-full h-3 rounded-full outline-none cursor-pointer"
                            style={{ WebkitAppearance: 'none', background: `linear-gradient(90deg, ${tempColor} ${temp * 2}%, #e5e7eb ${temp * 2}%)` } as React.CSSProperties} />
                        <div className="text-center mt-2">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: '#f0fdf4', border: `1px solid ${tempColor}`, color: tempColor }}>
                                🌡️ {temp}°C / {tempF}°F
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                            <span>🏜️ Dry — 20%</span>
                            <span>💧 Wet — 90%</span>
                        </div>
                        <input type="range" min={20} max={90} value={humidity} onChange={e => setHumidity(Number(e.target.value))}
                            className="w-full h-3 rounded-full outline-none cursor-pointer"
                            style={{ WebkitAppearance: 'none', background: `linear-gradient(90deg, ${humidityColor} ${((humidity - 20) / 70) * 100}%, #e5e7eb ${((humidity - 20) / 70) * 100}%)` } as React.CSSProperties} />
                        <div className="text-center mt-2">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: '#f0f9ff', border: `1px solid ${humidityColor}`, color: humidityColor }}>
                                💧 {humidity}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                    {/* Animated SVG Circuit Diagram */}
                    <div className="flex justify-center">
                        <svg viewBox="0 0 400 310" className="w-full max-w-md" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.10))' }}>
                            <rect width="400" height="310" rx="16" fill="#0f172a" />
                            <text x="200" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="monospace">DHT11 TEMPERATURE & HUMIDITY SIMULATOR</text>

                            {/* Arduino Board */}
                            <rect x="10" y="85" width="80" height="120" rx="8" fill="#1e40af" stroke="#3b82f6" strokeWidth="1.5" />
                            <text x="50" y="108" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">ARDUINO</text>
                            <text x="50" y="121" textAnchor="middle" fill="#93c5fd" fontSize="7" fontFamily="monospace">UNO R3</text>
                            <rect x="70" y="133" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="143" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">5V</text>
                            <rect x="70" y="153" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="163" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">GND</text>
                            <rect x="70" y="173" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="183" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">D8</text>

                            {/* Wires */}
                            <line x1="92" y1="140" x2="155" y2="65" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />
                            <line x1="92" y1="160" x2="155" y2="95" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,2" />
                            <line x1="92" y1="180" x2="155" y2="80" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,2" />

                            {/* DHT11 Sensor body */}
                            <rect x="155" y="40" width="85" height="70" rx="8" fill="#065f46" stroke="#10b981" strokeWidth="1.5" />
                            <text x="197" y="58" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">DHT11</text>

                            {/* Grid holes on sensor */}
                            {[0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => (
                                <circle key={`h-${r}-${c}`} cx={172 + c * 15} cy={68 + r * 10} r="2" fill="#047857" stroke="#34d399" strokeWidth="0.5" />
                            )))}

                            {/* Sensor pin labels */}
                            <text x="160" y="65" fill="#f87171" fontSize="6" fontFamily="monospace">VCC</text>
                            <text x="160" y="80" fill="#4ade80" fontSize="6" fontFamily="monospace">DATA</text>
                            <text x="160" y="95" fill="#94a3b8" fontSize="6" fontFamily="monospace">GND</text>

                            {/* Heat waves from sensor */}
                            {[0, 1, 2].map(i => {
                                const phase = ((wavePhase + i * 20) % 60) / 60;
                                const y = 45 - phase * 25;
                                const opacity = (1 - phase) * 0.4;
                                return (
                                    <g key={`heat-${i}`}>
                                        <path d={`M${175 + i * 15},${y + 5} Q${180 + i * 15},${y} ${185 + i * 15},${y + 5}`}
                                            fill="none" stroke={tempColor} strokeWidth="1.2" opacity={opacity} />
                                    </g>
                                );
                            })}

                            {/* Humidity droplets */}
                            {[0, 1, 2].map(i => {
                                const phase = ((wavePhase + 10 + i * 18) % 60) / 60;
                                const x = 250 + i * 20;
                                const y = 50 + phase * 50;
                                const opacity = (1 - phase) * 0.5;
                                return (
                                    <g key={`drop-${i}`}>
                                        <circle cx={x} cy={y} r={2} fill={humidityColor} opacity={opacity} />
                                        <line x1={x} y1={y - 3} x2={x} y2={y + 1} stroke={humidityColor} strokeWidth="1" opacity={opacity} />
                                    </g>
                                );
                            })}

                            {/* Temperature gauge */}
                            <rect x="260" y="40" width="40" height="70" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                            <text x="280" y="53" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="bold" fontFamily="monospace">TEMP</text>
                            <rect x="268" y="58" width="24" height="45" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
                            <rect x="270" y={103 - (temp / 50) * 43} width="20" height={(temp / 50) * 43} rx="2" fill={tempColor} opacity="0.8" />
                            <text x="280" y="108" textAnchor="middle" fill={tempColor} fontSize="8" fontWeight="bold" fontFamily="monospace">{temp}°C</text>

                            {/* Humidity gauge */}
                            <rect x="310" y="40" width="40" height="70" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                            <text x="330" y="53" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="bold" fontFamily="monospace">HUM</text>
                            <rect x="318" y="58" width="24" height="45" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
                            <rect x="320" y={103 - ((humidity - 20) / 70) * 43} width="20" height={((humidity - 20) / 70) * 43} rx="2" fill={humidityColor} opacity="0.8" />
                            <text x="330" y="108" textAnchor="middle" fill={humidityColor} fontSize="8" fontWeight="bold" fontFamily="monospace">{humidity}%</text>

                            {/* Data signal from sensor to Arduino */}
                            {[0, 1, 2].map(i => {
                                const progress = ((wavePhase + i * 20) % 60) / 60;
                                const sx = 155 - progress * 60;
                                const opacity = 1 - progress;
                                return sx > 92 ? (
                                    <rect key={`sig-${i}`} x={sx} y={78} width={4} height={4} rx={1} fill="#10b981" opacity={opacity * 0.6} />
                                ) : null;
                            })}

                            {/* Serial Monitor output */}
                            <rect x="10" y="215" width="380" height="85" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                            <text x="25" y="232" fill="#64748b" fontSize="8" fontWeight="bold" fontFamily="monospace">💻 Serial Monitor (9600 baud)</text>
                            <line x1="15" y1="237" x2="385" y2="237" stroke="#334155" strokeWidth="0.5" />
                            <text x="25" y="253" fill="#4ade80" fontSize="9" fontFamily="monospace">
                                {`Temperature = ${temp} C ${tempF} F`}
                            </text>
                            <text x="25" y="270" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                                {`Humidity = ${humidity} %`}
                            </text>
                            <text x="25" y="290" fill="#475569" fontSize="7" fontFamily="monospace">Refreshing every 1 second...</text>
                        </svg>
                    </div>

                    {/* Data Panel */}
                    <div className="space-y-3">
                        <div className="p-3 rounded-xl" style={{ background: '#f0fdf4', border: `1.5px solid ${tempColor}` }}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold" style={{ color: tempColor }}>🌡️ Temperature</span>
                                <span className="text-xs font-mono font-bold" style={{ color: tempColor }}>{temp}°C / {tempF}°F</span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden bg-gray-100">
                                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${temp * 2}%`, background: tempColor }} />
                            </div>
                            <p className="text-[10px] mt-1 font-medium" style={{ color: tempColor }}>
                                {temp <= 15 ? '❄️ Cold' : temp <= 25 ? '🌤️ Normal' : temp <= 35 ? '☀️ Warm' : '🔥 Hot!'}
                            </p>
                        </div>

                        <div className="p-3 rounded-xl" style={{ background: '#f0f9ff', border: `1.5px solid ${humidityColor}` }}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold" style={{ color: humidityColor }}>💧 Humidity</span>
                                <span className="text-xs font-mono font-bold" style={{ color: humidityColor }}>{humidity}%</span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden bg-gray-100">
                                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${((humidity - 20) / 70) * 100}%`, background: humidityColor }} />
                            </div>
                            <p className="text-[10px] mt-1 font-medium" style={{ color: humidityColor }}>
                                {humidity <= 30 ? '🏜️ Dry' : humidity <= 60 ? '😌 Comfortable' : '💦 Humid'}
                            </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                            <p className="text-xs font-bold text-slate-400 mb-1 font-mono">DHT.read11(data)</p>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <p className="text-lg font-black font-mono" style={{ color: tempColor }}>{temp}°C</p>
                                    <p className="text-[10px] text-slate-400">DHT.temperature</p>
                                </div>
                                <div>
                                    <p className="text-lg font-black font-mono" style={{ color: humidityColor }}>{humidity}%</p>
                                    <p className="text-[10px] text-slate-400">DHT.humidity</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                            <p className="text-xs font-bold text-indigo-800 mb-1">📐 Conversion Formula</p>
                            <p className="text-sm font-bold text-indigo-600 font-mono">°F = ({temp} × 9/5) + 32</p>
                            <p className="text-sm font-bold text-indigo-900 font-mono">°F = {tempF}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 font-mono">
                            <p className="text-[10px] text-gray-400 mb-1">📟 Serial Monitor</p>
                            <p className="text-[11px] text-green-400">Temperature = {temp} C {tempF} F</p>
                            <p className="text-[11px] text-sky-400">Humidity = {humidity} %</p>
                        </div>
                    </div>
                </div>

                <p className="text-[10px] text-emerald-700 mt-3 text-center font-medium">⬆️ Sliders se Temperature aur Humidity adjust karo — live reading change hogi!</p>
            </div>

            {/* Program Code */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#1e293b' }}>
                    <FileCode2 size={14} className="text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300 tracking-wide">Arduino Program — DHT11_Sensor.ino</span>
                    <div className="ml-auto flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                </div>
                <div className="bg-gray-950 p-4 font-mono text-xs leading-7 overflow-x-auto">
                    <div><span className="text-purple-400">#include</span> <span className="text-amber-400">&lt;dht.h&gt;</span></div>
                    <div className="mt-1"><span className="text-sky-400">int</span> <span className="text-green-300">data</span> <span className="text-gray-400">=</span> <span className="text-orange-400">8</span><span className="text-gray-400">;</span></div>
                    <div><span className="text-sky-400">dht</span> <span className="text-green-300">DHT</span><span className="text-gray-400">;</span></div>
                    <div className="mt-3"><span className="text-purple-400">void</span> <span className="text-yellow-300">setup</span><span className="text-gray-300">()</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-4"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">begin</span><span className="text-gray-300">(</span><span className="text-orange-400">9600</span><span className="text-gray-300">);</span></div>
                    <div><span className="text-gray-300">{'}'}</span></div>
                    <div className="mt-3"><span className="text-purple-400">void</span> <span className="text-yellow-300">loop</span><span className="text-gray-300">()</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-4"><span className="text-sky-400">int</span> <span className="text-green-300">value</span> <span className="text-gray-400">=</span> <span className="text-green-300">DHT</span><span className="text-gray-300">.</span><span className="text-sky-300">read11</span><span className="text-gray-300">(</span><span className="text-green-300">data</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4 mt-1"><span className="text-sky-400">float</span> <span className="text-green-300">t</span> <span className="text-gray-400">=</span> <span className="text-green-300">DHT</span><span className="text-gray-300">.</span><span className="text-sky-300">temperature</span><span className="text-gray-300">;</span></div>
                    <div className="ml-4"><span className="text-sky-400">float</span> <span className="text-green-300">h</span> <span className="text-gray-400">=</span> <span className="text-green-300">DHT</span><span className="text-gray-300">.</span><span className="text-sky-300">humidity</span><span className="text-gray-300">;</span></div>
                    <div className="ml-4 mt-2"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">print</span><span className="text-gray-300">(</span><span className="text-amber-400">&quot;Temperature = &quot;</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">print</span><span className="text-gray-300">(</span><span className="text-green-300">t</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">print</span><span className="text-gray-300">(</span><span className="text-amber-400">&quot; C &quot;</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">print</span><span className="text-gray-300">((</span><span className="text-green-300">t</span> <span className="text-gray-400">*</span> <span className="text-orange-400">9</span> <span className="text-gray-400">/</span> <span className="text-orange-400">5</span><span className="text-gray-300">) +</span> <span className="text-orange-400">32</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">print</span><span className="text-gray-300">(</span><span className="text-amber-400">&quot; F &quot;</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4 mt-1"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">print</span><span className="text-gray-300">(</span><span className="text-amber-400">&quot; Humidity = &quot;</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">print</span><span className="text-gray-300">(</span><span className="text-green-300">h</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-yellow-300">Serial</span><span className="text-gray-300">.</span><span className="text-sky-300">println</span><span className="text-gray-300">(</span><span className="text-amber-400">&quot; %&quot;</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4 mt-1"><span className="text-sky-300">delay</span><span className="text-gray-300">(</span><span className="text-orange-400">1000</span><span className="text-gray-300">);</span></div>
                    <div><span className="text-gray-300">{'}'}</span></div>
                </div>
            </div>

            {/* Materials and Connections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50">
                    <h3 className="text-sm font-extrabold text-emerald-900 mb-3 flex items-center gap-2">
                        <Wrench size={14} /> आवश्यक सामग्री (Components)
                    </h3>
                    <ul className="space-y-2">
                        {[
                            { label: 'DHT11 Sensor', icon: '🌡️' },
                            { label: 'Arduino Board (Uno R3)', icon: '🟦' },
                            { label: 'Jumper Wires', icon: '🔗' },
                        ].map((m, i) => (
                            <li key={i} className="flex items-center gap-2.5 text-sm text-emerald-900 bg-white rounded-lg px-3 py-2 border border-emerald-100 shadow-sm">
                                <span>{m.icon}</span><span className="font-semibold">{m.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 rounded-2xl border border-teal-100 bg-teal-50">
                    <h3 className="text-sm font-extrabold text-teal-900 mb-3 flex items-center gap-2">
                        <CircuitBoard size={14} /> Circuit Connection
                    </h3>
                    <ol className="space-y-2">
                        {[
                            { step: 'VCC → Sensor की VCC Pin ko Arduino की 5V se connect करें।', color: 'text-red-600' },
                            { step: 'GND → Sensor की Ground Pin ko Arduino की Ground se connect करें।', color: 'text-gray-600' },
                            { step: 'DATA → Sensor की Data Pin ko Arduino की Pin No. 8 se connect करें।', color: 'text-emerald-600' },
                        ].map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-teal-900">
                                <span className="w-5 h-5 flex-shrink-0 rounded-full bg-teal-700 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                                <span className={`font-medium ${c.color}`}>{c.step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Working Principle */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 mb-6">
                <h3 className="text-sm font-extrabold text-violet-900 mb-4 flex items-center gap-2">
                    <Activity size={14} /> 🔹 कार्य प्रणाली (Working Process)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { icon: '🌡️', heading: 'Temperature Sensing', body: 'DHT11 Sensor Environment se Temperature Read karta hai। Temperature Value DHT.temperature se prapt hoti hai aur Celsius me display ki jaati hai।', bg: 'bg-orange-50', border: 'border-orange-200', tc: 'text-orange-900' },
                        { icon: '💧', heading: 'Humidity Sensing', body: 'Sensor simultaneously Humidity bhi measure karta hai। DHT.humidity se humidity percentage prapt hoti hai।', bg: 'bg-sky-50', border: 'border-sky-200', tc: 'text-sky-900' },
                        { icon: '📡', heading: 'Digital Signal', body: 'Sensor apna Data digital signal ke roop me Arduino ko bhejta hai। DHT.read11(data) function se sensor ki reading read hoti hai।', bg: 'bg-emerald-50', border: 'border-emerald-200', tc: 'text-emerald-900' },
                        { icon: '💻', heading: 'Serial Display', body: 'Temperature ko Celsius aur Fahrenheit dono format me convert karke Serial Monitor par display kiya jaata hai। Humidity % me show hoti hai।', bg: 'bg-violet-50', border: 'border-violet-200', tc: 'text-violet-900' },
                    ].map((w, i) => (
                        <div key={i} className={`p-3 rounded-xl ${w.bg} border ${w.border}`}>
                            <p className={`text-xs font-bold ${w.tc} mb-1`}>{w.icon} {w.heading}</p>
                            <p className={`text-[11px] ${w.tc} leading-relaxed`}>{w.body}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Program Working Steps */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 mb-6">
                <h3 className="text-sm font-extrabold text-teal-900 mb-4 flex items-center gap-2">
                    <Cog size={14} /> 🔹 Program Working
                </h3>
                <div className="space-y-2">
                    {[
                        'DHT11 Sensor Temperature aur Humidity ko Sense karta hai।',
                        'Arduino Sensor se Data Read karta hai (DHT.read11)।',
                        'Temperature ko Celsius me Display karta hai।',
                        'Temperature ko Fahrenheit me Convert karta hai: (t * 9/5) + 32।',
                        'Humidity Value ko Percentage (%) me Display karta hai।',
                        'Har 1 Second ke baad New Reading Display hoti hai (delay 1000)।',
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                            <span className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                            <span className="text-xs font-medium text-teal-800">{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Output */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <p className="text-xs font-bold text-emerald-800 mb-2">🌡️ Output 1:</p>
                    <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs">
                        <p className="text-green-400">Temperature = 28 C 82.4 F</p>
                        <p className="text-sky-400">Humidity = 65 %</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                    <p className="text-xs font-bold text-teal-800 mb-2">🌡️ Output 2:</p>
                    <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs">
                        <p className="text-green-400">Temperature = 30 C 86 F</p>
                        <p className="text-sky-400">Humidity = 60 %</p>
                    </div>
                </div>
            </div>

            {/* Conclusion */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 mb-6">
                <h3 className="text-sm font-extrabold text-emerald-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={14} /> 🔹 Conclusion
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                    DHT11 Sensor ko Arduino Uno ke saath successfully interface kiya gaya। Sensor ne Environment ka <strong>Temperature aur Humidity</strong> Measure kiya aur Arduino ne us Data ko <strong>Serial Monitor</strong> par Display kiya। DHT11 Sensor ka upyog <strong>Weather Monitoring</strong>, <strong>Smart Agriculture</strong>, <strong>Home Automation</strong> aur <strong>IoT Applications</strong> mein kiya jaata hai।
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                    {['Weather Monitoring', 'Smart Agriculture', 'Home Automation', 'IoT Projects', 'Green House'].map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-emerald-200 rounded-full text-[10px] font-bold text-emerald-700 shadow-sm">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Flowchart */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                <h3 className="text-sm font-extrabold text-gray-800 mb-4 flex items-center gap-2">
                    <ChevronRight size={14} className="text-emerald-500" /> Program Flow (Flowchart)
                </h3>
                <div className="flex flex-col items-center gap-0 text-center text-xs font-semibold">
                    {([
                        { label: 'START', style: { background: '#10b981', color: 'white', borderRadius: '50px' } as React.CSSProperties },
                        null,
                        { label: '#include <dht.h> | int data = 8 | Serial.begin(9600)', style: { background: '#eff6ff', border: '1.5px solid #93c5fd', color: '#1e40af', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'DHT.read11(data) — Read Sensor', style: { background: '#f0fdf4', border: '1.5px solid #86efac', color: '#166534', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 't = DHT.temperature | h = DHT.humidity', style: { background: '#fef3c7', border: '1.5px solid #fcd34d', color: '#92400e', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'Serial.print(“Temperature = ”) | print(t) | print(“ C ”)', style: { background: '#ecfdf5', border: '1.5px solid #6ee7b7', color: '#065f46', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'print((t*9/5)+32) | print(“ F ”) — Fahrenheit Conversion', style: { background: '#faf5ff', border: '1.5px solid #c4b5fd', color: '#5b21b6', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'Serial.print(“Humidity = ”) | print(h) | println(“ %”)', style: { background: '#f0f9ff', border: '1.5px solid #7dd3fc', color: '#0369a1', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'delay(1000) — Wait 1 Second', style: { background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#991b1b', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: '↩ loop() repeats', style: { background: '#ecfdf5', border: '1.5px solid #6ee7b7', color: '#059669', borderRadius: '8px' } as React.CSSProperties },
                    ] as Array<{ label: string; style: React.CSSProperties } | null>).map((item, i) =>
                        item === null
                            ? <div key={i} className="w-0.5 h-5 bg-gray-300" />
                            : <div key={i} className="px-4 py-2 text-[11px] shadow-sm" style={item.style}>{item.label}</div>
                    )}
                </div>
            </div>
        </section>
    );
}

function FadingLEDPracticalSection() {
    const [pwmValue, setPwmValue] = useState(127);
    const [autoFade, setAutoFade] = useState(false);
    const [fadeDir, setFadeDir] = useState(1);

    const brightness = pwmValue / 255;
    const dutyCycle = Math.round((pwmValue / 255) * 100);

    useEffect(() => {
        if (!autoFade) return;
        const t = setInterval(() => {
            setPwmValue(prev => {
                let next = prev + fadeDir * 5;
                if (next >= 255) { next = 255; setFadeDir(-1); }
                if (next <= 0) { next = 0; setFadeDir(1); }
                return next;
            });
        }, 30);
        return () => clearInterval(t);
    }, [autoFade, fadeDir]);

    const glowColor = `rgba(251, 191, 36, ${brightness})`;
    const glowShadow = `0 0 ${brightness * 40}px ${brightness * 15}px rgba(251, 191, 36, ${brightness * 0.6})`;

    return (
        <section id="fading-led-practical" className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg bg-white" style={{ border: '1px solid #fde68a', boxShadow: '0 1px 3px rgba(245,158,11,0.08)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #fef3c7' }}>
                <Lightbulb size={16} className="text-amber-500" />
                <h2 className="text-base md:text-lg font-extrabold text-gray-800">💡 Practical – Fading LED using Arduino</h2>
            </div>

            {/* Objective */}
            <div className="rounded-xl p-4 mb-6 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '1px solid #fbbf24', color: '#78350f' }}>
                🎯 <strong>Objective:</strong> Arduino ki <strong>PWM (Pulse Width Modulation)</strong> Pins ka use karke LED ki Brightness ko gradually <strong>Increase aur Decrease</strong> karna (LED Fading Effect create karna)।
            </div>

            {/* Theory Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 mb-6">
                <h3 className="text-sm font-extrabold text-amber-900 mb-4 flex items-center gap-2">
                    <Zap size={14} /> 🔹 Theory
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                    <p>Fading LED ek aisa practical hai jisme LED ki brightness <strong>dheere-dheere kam aur zyada</strong> hoti hai।</p>
                    <p>Arduino me <strong>PWM Pins</strong> ka use karke LED ko different Analog Values di jaati hain।</p>
                    <p>Arduino ki PWM Pin par <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono text-amber-700">analogWrite(pin, value)</code> function use kiya jaata hai।</p>
                </div>

                {/* PWM Pins info */}
                <div className="mt-5 p-4 bg-white rounded-xl border border-amber-200">
                    <p className="text-xs font-bold text-amber-800 mb-2 uppercase tracking-wide">⚡ Arduino Uno PWM Pins:</p>
                    <div className="flex flex-wrap gap-2">
                        {[3, 5, 6, 9, 10, 11].map(pin => (
                            <span key={pin} className="px-3 py-1.5 bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm">Pin {pin} ~</span>
                        ))}
                    </div>
                </div>

                {/* analogWrite explanation */}
                <div className="mt-4 p-4 bg-white rounded-xl border border-amber-200">
                    <p className="text-xs font-bold text-amber-800 mb-2 uppercase tracking-wide">📝 analogWrite() Function:</p>
                    <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs mb-3">
                        <span className="text-sky-300">analogWrite</span><span className="text-gray-300">(</span><span className="text-orange-400">pin</span><span className="text-gray-300">,</span> <span className="text-orange-400">value</span><span className="text-gray-300">);</span>
                        <span className="text-gray-400 ml-2">// value: 0-255</span>
                    </div>
                </div>

                {/* PWM Value Table */}
                <div className="mt-4 overflow-hidden rounded-xl border border-amber-200">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-amber-500 text-white">
                                <th className="py-2 px-3 text-left font-bold">Value</th>
                                <th className="py-2 px-3 text-left font-bold">Duty Cycle</th>
                                <th className="py-2 px-3 text-left font-bold">Brightness</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { val: '0', duty: '0%', bright: 'OFF', bg: 'bg-gray-50' },
                                { val: '64', duty: '25%', bright: '◔ Low', bg: 'bg-amber-50' },
                                { val: '127', duty: '50%', bright: '◑ Medium', bg: 'bg-amber-100' },
                                { val: '255', duty: '100%', bright: '● Full', bg: 'bg-amber-200' },
                            ].map((r, i) => (
                                <tr key={i} className={r.bg}>
                                    <td className="py-2 px-3 font-mono font-bold text-amber-800">{r.val}</td>
                                    <td className="py-2 px-3 font-semibold text-gray-700">{r.duty}</td>
                                    <td className="py-2 px-3 font-semibold text-gray-700">{r.bright}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ═══ Interactive Simulator ═══ */}
            <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-5 mb-6">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={12} /> Interactive Simulator — PWM Value adjust karo!
                </p>

                {/* Controls */}
                <div className="flex flex-col items-center gap-3 mb-5">
                    <div className="w-full max-w-md">
                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                            <span>🌑 OFF (0)</span>
                            <span>🔆 FULL (255)</span>
                        </div>
                        <input type="range" min={0} max={255} value={pwmValue} onChange={e => { setPwmValue(Number(e.target.value)); setAutoFade(false); }}
                            className="w-full h-3 rounded-full outline-none cursor-pointer"
                            style={{ WebkitAppearance: 'none', background: `linear-gradient(90deg, #fbbf24 ${dutyCycle}%, #e5e7eb ${dutyCycle}%)` } as React.CSSProperties} />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: '#fffbeb', border: '1px solid #fbbf24', color: '#b45309' }}>
                            💡 analogWrite(11, {pwmValue}) — {dutyCycle}%
                        </span>
                        <button
                            onClick={() => { setAutoFade(p => !p); setFadeDir(1); }}
                            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95"
                            style={{
                                background: autoFade ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                                color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            }}
                        >
                            {autoFade ? '⏸ Stop Auto Fade' : '▶ Auto Fade'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                    {/* Animated SVG */}
                    <div className="flex justify-center">
                        <svg viewBox="0 0 400 300" className="w-full max-w-md" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.10))' }}>
                            <rect width="400" height="300" rx="16" fill="#0f172a" />
                            <text x="200" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="monospace">FADING LED — PWM SIMULATOR</text>

                            {/* Arduino Board */}
                            <rect x="10" y="80" width="80" height="110" rx="8" fill="#1e40af" stroke="#3b82f6" strokeWidth="1.5" />
                            <text x="50" y="103" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">ARDUINO</text>
                            <text x="50" y="116" textAnchor="middle" fill="#93c5fd" fontSize="7" fontFamily="monospace">UNO R3</text>
                            <rect x="70" y="128" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="138" textAnchor="middle" fill="#fbbf24" fontSize="7" fontWeight="bold" fontFamily="monospace">~11</text>
                            <rect x="70" y="148" width="22" height="14" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.8" />
                            <text x="81" y="158" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold" fontFamily="monospace">GND</text>

                            {/* Wire from Pin 11 to LED */}
                            <line x1="92" y1="135" x2="170" y2="100" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,2" />

                            {/* LED */}
                            <g>
                                {/* LED glow */}
                                <circle cx="200" cy="100" r={15 + brightness * 30} fill="#fbbf24" opacity={brightness * 0.15} />
                                <circle cx="200" cy="100" r={10 + brightness * 15} fill="#fbbf24" opacity={brightness * 0.25} />
                                {/* LED body */}
                                <polygon points="185,90 215,90 210,115 190,115" fill={`rgba(251, 191, 36, ${0.15 + brightness * 0.85})`} stroke="#f59e0b" strokeWidth="1.5" />
                                {/* LED dome */}
                                <ellipse cx="200" cy="90" rx="15" ry="8" fill={`rgba(251, 191, 36, ${0.2 + brightness * 0.8})`} stroke="#f59e0b" strokeWidth="1" />
                                {/* LED legs */}
                                <line x1="195" y1="115" x2="195" y2="135" stroke="#94a3b8" strokeWidth="1.5" />
                                <line x1="205" y1="115" x2="205" y2="135" stroke="#94a3b8" strokeWidth="1.5" />
                                {/* + and - */}
                                <text x="192" y="130" fill="#fbbf24" fontSize="8" fontWeight="bold" fontFamily="monospace">+</text>
                                <text x="207" y="130" fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="monospace">–</text>
                            </g>

                            {/* Brightness text */}
                            <text x="200" y="68" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold" fontFamily="monospace" opacity={0.3 + brightness * 0.7}>{dutyCycle}%</text>

                            {/* Resistor */}
                            <line x1="205" y1="135" x2="205" y2="150" stroke="#94a3b8" strokeWidth="1.5" />
                            <rect x="198" y="150" width="14" height="25" rx="3" fill="#78350f" stroke="#92400e" strokeWidth="1" />
                            {/* Resistor bands */}
                            <line x1="200" y1="156" x2="210" y2="156" stroke="#ef4444" strokeWidth="2" />
                            <line x1="200" y1="161" x2="210" y2="161" stroke="#ef4444" strokeWidth="2" />
                            <line x1="200" y1="166" x2="210" y2="166" stroke="#92400e" strokeWidth="2" />
                            <text x="205" y="185" textAnchor="middle" fill="#a16207" fontSize="7" fontWeight="bold" fontFamily="monospace">220Ω</text>

                            {/* GND */}
                            <line x1="205" y1="175" x2="205" y2="195" stroke="#94a3b8" strokeWidth="1.5" />
                            <line x1="92" y1="155" x2="205" y2="195" stroke="#64748b" strokeWidth="1" strokeDasharray="4,2" />
                            <line x1="195" y1="198" x2="215" y2="198" stroke="#64748b" strokeWidth="2" />
                            <line x1="198" y1="203" x2="212" y2="203" stroke="#64748b" strokeWidth="2" />
                            <line x1="201" y1="207" x2="209" y2="207" stroke="#64748b" strokeWidth="1.5" />
                            <text x="205" y="218" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">GND</text>

                            {/* PWM Signal visualization */}
                            <rect x="10" y="230" width="380" height="60" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                            <text x="25" y="245" fill="#fbbf24" fontSize="8" fontWeight="bold" fontFamily="monospace">PWM Signal (Duty Cycle: {dutyCycle}%)</text>
                            {/* PWM waveform */}
                            {Array.from({ length: 12 }, (_, i) => {
                                const x = 25 + i * 30;
                                const highW = (dutyCycle / 100) * 28;
                                const lowW = 28 - highW;
                                return (
                                    <g key={`pwm-${i}`}>
                                        {highW > 0 && <rect x={x} y={253} width={highW} height={12} fill="#fbbf24" opacity="0.7" rx="1" />}
                                        {lowW > 0 && <rect x={x + highW} y={253} width={lowW} height={12} fill="#334155" rx="1" />}
                                        <line x1={x} y1={253} x2={x} y2={265} stroke="#475569" strokeWidth="0.5" />
                                        {highW > 0 && <line x1={x} y1={253} x2={x + highW} y2={253} stroke="#fbbf24" strokeWidth="1" />}
                                        {highW > 0 && <line x1={x + highW} y1={253} x2={x + highW} y2={265} stroke="#fbbf24" strokeWidth="0.5" />}
                                    </g>
                                );
                            })}
                            <text x="200" y="282" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">HIGH = {dutyCycle}% | LOW = {100 - dutyCycle}% | analogWrite(11, {pwmValue})</text>
                        </svg>
                    </div>

                    {/* Data Panel */}
                    <div className="space-y-3">
                        <div className="p-4 rounded-xl text-center" style={{ background: '#fffbeb', border: '1.5px solid #fbbf24' }}>
                            <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center transition-all duration-100"
                                style={{ background: glowColor, boxShadow: glowShadow }}>
                                <Lightbulb size={28} className="text-white" style={{ opacity: 0.3 + brightness * 0.7 }} />
                            </div>
                            <p className="text-2xl font-black text-amber-700 font-mono">{pwmValue}</p>
                            <p className="text-xs text-amber-700 font-semibold">analogWrite Value</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                            <p className="text-xs font-bold text-slate-400 mb-2 font-mono">PWM Output</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-lg font-black font-mono text-amber-400">{dutyCycle}%</p>
                                    <p className="text-[10px] text-slate-400">Duty Cycle</p>
                                </div>
                                <div>
                                    <p className="text-lg font-black font-mono text-amber-400">{pwmValue}/255</p>
                                    <p className="text-[10px] text-slate-400">PWM Value</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                            <p className="text-xs font-bold text-amber-800 mb-1">📊 Duty Cycle Bar</p>
                            <div className="h-4 rounded-full overflow-hidden bg-gray-200">
                                <div className="h-full rounded-full transition-all duration-100" style={{ width: `${dutyCycle}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
                            </div>
                            <div className="flex justify-between text-[10px] font-mono text-amber-700 mt-1">
                                <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 font-mono">
                            <p className="text-[10px] text-gray-400 mb-1">📟 Serial Monitor</p>
                            <p className="text-[11px] text-amber-400">analogWrite(11, {pwmValue})</p>
                            <p className="text-[11px] text-gray-400">Brightness: {dutyCycle}% | LED {pwmValue === 0 ? 'OFF' : pwmValue === 255 ? 'FULL ON' : 'GLOWING'}</p>
                        </div>
                    </div>
                </div>

                <p className="text-[10px] text-amber-700 mt-3 text-center font-medium">⬆️ Slider se PWM value adjust karo ya Auto Fade button dabao — LED brightness change hogi!</p>
            </div>

            {/* Code 1 */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#1e293b' }}>
                    <FileCode2 size={14} className="text-amber-400" />
                    <span className="text-xs font-bold text-amber-300 tracking-wide">Code 1 — Step Brightness</span>
                    <div className="ml-auto flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                </div>
                <div className="bg-gray-950 p-4 font-mono text-xs leading-7 overflow-x-auto">
                    <div><span className="text-purple-400">void</span> <span className="text-yellow-300">setup</span><span className="text-gray-300">()</span> <span className="text-gray-300">{'{'}</span></div>
                    <div><span className="text-gray-300">{'}'}</span></div>
                    <div className="mt-3"><span className="text-purple-400">void</span> <span className="text-yellow-300">loop</span><span className="text-gray-300">()</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-4"><span className="text-sky-300">analogWrite</span><span className="text-gray-300">(</span><span className="text-orange-400">11</span><span className="text-gray-300">,</span><span className="text-orange-400">0</span><span className="text-gray-300">);</span> <span className="text-gray-400">// OFF</span></div>
                    <div className="ml-4"><span className="text-sky-300">delay</span><span className="text-gray-300">(</span><span className="text-orange-400">1000</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4 mt-1"><span className="text-sky-300">analogWrite</span><span className="text-gray-300">(</span><span className="text-orange-400">11</span><span className="text-gray-300">,</span><span className="text-orange-400">64</span><span className="text-gray-300">);</span> <span className="text-gray-400">// 25%</span></div>
                    <div className="ml-4"><span className="text-sky-300">delay</span><span className="text-gray-300">(</span><span className="text-orange-400">1000</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4 mt-1"><span className="text-sky-300">analogWrite</span><span className="text-gray-300">(</span><span className="text-orange-400">11</span><span className="text-gray-300">,</span><span className="text-orange-400">127</span><span className="text-gray-300">);</span> <span className="text-gray-400">// 50%</span></div>
                    <div className="ml-4"><span className="text-sky-300">delay</span><span className="text-gray-300">(</span><span className="text-orange-400">1000</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4 mt-1"><span className="text-sky-300">analogWrite</span><span className="text-gray-300">(</span><span className="text-orange-400">11</span><span className="text-gray-300">,</span><span className="text-orange-400">255</span><span className="text-gray-300">);</span> <span className="text-gray-400">// 100%</span></div>
                    <div className="ml-4"><span className="text-sky-300">delay</span><span className="text-gray-300">(</span><span className="text-orange-400">1000</span><span className="text-gray-300">);</span></div>
                    <div><span className="text-gray-300">{'}'}</span></div>
                </div>
            </div>

            {/* Code 1 Working */}
            <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200 mb-6">
                <h3 className="text-sm font-extrabold text-yellow-900 mb-3 flex items-center gap-2">
                    <Cog size={14} /> 🔹 Working of Code 1
                </h3>
                <p className="text-sm text-gray-700 mb-3">Is Program me LED ki Brightness alag-alag PWM Values dwara badli jaati hai।</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                        { val: 0, label: 'OFF', emoji: '🌑', bg: 'bg-gray-100' },
                        { val: 64, label: '25%', emoji: '🌒', bg: 'bg-amber-50' },
                        { val: 127, label: '50%', emoji: '🌓', bg: 'bg-amber-100' },
                        { val: 255, label: '100%', emoji: '🌕', bg: 'bg-amber-200' },
                    ].map((s, i) => (
                        <div key={i} className={`p-3 rounded-xl ${s.bg} border border-amber-200 text-center`}>
                            <p className="text-xl mb-1">{s.emoji}</p>
                            <p className="text-xs font-bold text-amber-800">Value = {s.val}</p>
                            <p className="text-[10px] text-gray-600">{s.label} Brightness</p>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-600 mt-3">Har Value ke baad <strong>1 Second ka Delay</strong> diya gaya hai।</p>
            </div>

            {/* Code 2 */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#1e293b' }}>
                    <FileCode2 size={14} className="text-amber-400" />
                    <span className="text-xs font-bold text-amber-300 tracking-wide">Code 2 — Smooth Fade (For Loop)</span>
                    <div className="ml-auto flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                </div>
                <div className="bg-gray-950 p-4 font-mono text-xs leading-7 overflow-x-auto">
                    <div><span className="text-purple-400">void</span> <span className="text-yellow-300">loop</span><span className="text-gray-300">()</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-4"><span className="text-sky-400">int</span> <span className="text-green-300">i</span><span className="text-gray-300">;</span></div>
                    <div className="ml-4 mt-2"><span className="text-purple-400">for</span><span className="text-gray-300">(</span><span className="text-green-300">i</span><span className="text-gray-400">=</span><span className="text-orange-400">0</span><span className="text-gray-300">;</span> <span className="text-green-300">i</span><span className="text-gray-400">&lt;=</span><span className="text-orange-400">255</span><span className="text-gray-300">;</span> <span className="text-green-300">i</span><span className="text-gray-400">=</span><span className="text-green-300">i</span><span className="text-gray-400">+</span><span className="text-orange-400">5</span><span className="text-gray-300">)</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-8"><span className="text-sky-300">analogWrite</span><span className="text-gray-300">(</span><span className="text-orange-400">11</span><span className="text-gray-300">,</span><span className="text-green-300">i</span><span className="text-gray-300">);</span></div>
                    <div className="ml-8"><span className="text-sky-300">delay</span><span className="text-gray-300">(</span><span className="text-orange-400">10</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-gray-300">{'}'}</span></div>
                    <div className="ml-4 mt-2"><span className="text-purple-400">for</span><span className="text-gray-300">(</span><span className="text-green-300">i</span><span className="text-gray-400">=</span><span className="text-orange-400">255</span><span className="text-gray-300">;</span> <span className="text-green-300">i</span><span className="text-gray-400">&gt;=</span><span className="text-orange-400">0</span><span className="text-gray-300">;</span> <span className="text-green-300">i</span><span className="text-gray-400">=</span><span className="text-green-300">i</span><span className="text-gray-400">-</span><span className="text-orange-400">5</span><span className="text-gray-300">)</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-8"><span className="text-sky-300">analogWrite</span><span className="text-gray-300">(</span><span className="text-orange-400">11</span><span className="text-gray-300">,</span><span className="text-green-300">i</span><span className="text-gray-300">);</span></div>
                    <div className="ml-8"><span className="text-sky-300">delay</span><span className="text-gray-300">(</span><span className="text-orange-400">10</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-gray-300">{'}'}</span></div>
                    <div><span className="text-gray-300">{'}'}</span></div>
                </div>
            </div>

            {/* Code 2 Working */}
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 mb-6">
                <h3 className="text-sm font-extrabold text-orange-900 mb-3 flex items-center gap-2">
                    <Cog size={14} /> 🔹 Working of Code 2
                </h3>
                <p className="text-sm text-gray-700 mb-3">Is Program me LED ki Brightness <strong>dheere-dheere badhti aur ghatti</strong> hai।</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                        <p className="text-xs font-bold text-emerald-800 mb-1">⬆️ Fade IN (Pahla For Loop)</p>
                        <p className="text-[11px] text-emerald-700">i = 0 se i = 255 tak value badhti hai। LED dheere-dheere bright hoti jaati hai।</p>
                    </div>
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                        <p className="text-xs font-bold text-red-800 mb-1">⬇️ Fade OUT (Doosra For Loop)</p>
                        <p className="text-[11px] text-red-700">i = 255 se i = 0 tak value ghatti hai। LED dheere-dheere dim hoti jaati hai।</p>
                    </div>
                </div>
                <p className="text-xs text-gray-600 mt-3">Is prakar LED lagaatar <strong>Fade In aur Fade Out</strong> effect deti rehti hai।</p>
            </div>

            {/* Materials and Connections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50">
                    <h3 className="text-sm font-extrabold text-amber-900 mb-3 flex items-center gap-2">
                        <Wrench size={14} /> आवश्यक सामग्री (Components)
                    </h3>
                    <ul className="space-y-2">
                        {[
                            { label: 'Arduino Board (Uno R3)', icon: '🟦' },
                            { label: 'LED', icon: '💡' },
                            { label: '220Ω Resistor', icon: '🟤' },
                            { label: 'Jumper Wires', icon: '🔗' },
                            { label: 'Breadboard', icon: '🧱' },
                        ].map((m, i) => (
                            <li key={i} className="flex items-center gap-2.5 text-sm text-amber-900 bg-white rounded-lg px-3 py-2 border border-amber-100 shadow-sm">
                                <span>{m.icon}</span><span className="font-semibold">{m.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 rounded-2xl border border-yellow-100 bg-yellow-50">
                    <h3 className="text-sm font-extrabold text-yellow-900 mb-3 flex items-center gap-2">
                        <CircuitBoard size={14} /> Circuit Connection
                    </h3>
                    <ol className="space-y-2">
                        {[
                            { step: 'LED की Positive Pin ko Arduino की PWM Pin No. 11 se connect करें।', color: 'text-amber-600' },
                            { step: 'LED की Negative Pin ko 220Ω Resistor ke through Ground se connect करें।', color: 'text-gray-600' },
                        ].map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-yellow-900">
                                <span className="w-5 h-5 flex-shrink-0 rounded-full bg-yellow-700 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                                <span className={`font-medium ${c.color}`}>{c.step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Working Principle */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 mb-6">
                <h3 className="text-sm font-extrabold text-violet-900 mb-4 flex items-center gap-2">
                    <Activity size={14} /> 🔹 कार्य प्रणाली (Working)
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                    <p>Arduino ke saath ek LED ko Fade karne ki Process ko <strong>Fading LED</strong> kaha jaata hai।</p>
                    <p>Isme LED ki Brightness <strong>dheere-dheere badhai aur ghatai</strong> jaati hai।</p>
                    <p>Ye kaam <strong>PWM (Pulse Width Modulation)</strong> ka use karke kiya jaata hai।</p>
                    <p>PWM ke dwara Arduino LED ko different <strong>duty cycle values</strong> provide karta hai jisse LED ki brightness control hoti hai।</p>
                </div>
            </div>

            {/* Output */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <p className="text-xs font-bold text-amber-800 mb-2">💡 Output — Code 1:</p>
                    <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs">
                        <p className="text-gray-400">OFF → 25% → 50% → 100%</p>
                        <p className="text-amber-400 mt-1">Step-by-step brightness change</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                    <p className="text-xs font-bold text-orange-800 mb-2">💡 Output — Code 2:</p>
                    <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs">
                        <p className="text-amber-400">Fade In → Fade Out → Fade In → Fade Out</p>
                        <p className="text-gray-400 mt-1">Smooth continuous fading</p>
                    </div>
                </div>
            </div>

            {/* Conclusion */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 mb-6">
                <h3 className="text-sm font-extrabold text-amber-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={14} /> 🔹 Conclusion
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                    Arduino ki <strong>PWM Pin</strong> aur <code className="px-1 py-0.5 bg-amber-100 rounded text-xs font-mono text-amber-700">analogWrite()</code> Function ka use karke LED ki Brightness ko successfully control kiya gaya। Is practical me LED ko <strong>Fade In aur Fade Out</strong> Effect diya gaya jo PWM Technique ka ek practical example hai।
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                    {['PWM Control', 'analogWrite', 'Fade Effect', 'Duty Cycle', 'LED Brightness'].map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-amber-200 rounded-full text-[10px] font-bold text-amber-700 shadow-sm">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Flowchart */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                <h3 className="text-sm font-extrabold text-gray-800 mb-4 flex items-center gap-2">
                    <ChevronRight size={14} className="text-amber-500" /> Program Flow — Code 2 (Flowchart)
                </h3>
                <div className="flex flex-col items-center gap-0 text-center text-xs font-semibold">
                    {([
                        { label: 'START', style: { background: '#f59e0b', color: 'white', borderRadius: '50px' } as React.CSSProperties },
                        null,
                        { label: 'int i', style: { background: '#eff6ff', border: '1.5px solid #93c5fd', color: '#1e40af', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'for(i=0; i<=255; i+=5) — Fade IN', style: { background: '#ecfdf5', border: '1.5px solid #6ee7b7', color: '#065f46', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'analogWrite(11, i) — LED Brightness ⬆️', style: { background: '#fef3c7', border: '1.5px solid #fcd34d', color: '#92400e', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'delay(10)', style: { background: '#f1f5f9', border: '1.5px solid #cbd5e1', color: '#475569', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'for(i=255; i>=0; i-=5) — Fade OUT', style: { background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#991b1b', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'analogWrite(11, i) — LED Brightness ⬇️', style: { background: '#fef3c7', border: '1.5px solid #fcd34d', color: '#92400e', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: 'delay(10)', style: { background: '#f1f5f9', border: '1.5px solid #cbd5e1', color: '#475569', borderRadius: '8px' } as React.CSSProperties },
                        null,
                        { label: '↩ loop() repeats — Continuous Fading', style: { background: '#fffbeb', border: '1.5px solid #fbbf24', color: '#b45309', borderRadius: '8px' } as React.CSSProperties },
                    ] as Array<{ label: string; style: React.CSSProperties } | null>).map((item, i) =>
                        item === null
                            ? <div key={i} className="w-0.5 h-5 bg-gray-300" />
                            : <div key={i} className="px-4 py-2 text-[11px] shadow-sm" style={item.style}>{item.label}</div>
                    )}
                </div>
            </div>
        </section>
    );
}

function BluetoothLEDPracticalSection() {
    const [btConnected, setBtConnected] = useState(false);
    const [ledOn, setLedOn] = useState(false);
    const [sendingData, setSendingData] = useState<string | null>(null);
    const [serialLog, setSerialLog] = useState<{ time: string, data: string }[]>([]);

    const handleSend = (data: string) => {
        if (!btConnected || sendingData) return;
        setSendingData(data);

        // Simulate transmission delay
        setTimeout(() => {
            const timeStr = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setSerialLog(prev => [...prev.slice(-3), { time: timeStr, data: data }]);
            if (data === '1') setLedOn(true);
            else if (data === '0') setLedOn(false);
            setSendingData(null);
        }, 800);
    };

    return (
        <section id="bluetooth-practical" className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg bg-white" style={{ border: '1px solid #bfdbfe', boxShadow: '0 1px 3px rgba(59,130,246,0.08)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #dbeafe' }}>
                <Smartphone size={16} className="text-blue-500" />
                <h2 className="text-base md:text-lg font-extrabold text-gray-800">📱 Practical – Bluetooth Control LED</h2>
            </div>

            {/* Objective */}
            <div className="rounded-xl p-4 mb-6 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #93c5fd', color: '#1e3a8a' }}>
                🎯 <strong>Objective:</strong> Bluetooth Module (HC-05) aur Arduino Board ki madad se ek LED ko apne <strong>Android Mobile se Control</strong> karna (Mobile App se ON/OFF command bhejna)।
            </div>

            {/* Theory Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 mb-6">
                <h3 className="text-sm font-extrabold text-blue-900 mb-4 flex items-center gap-2">
                    <Radio size={14} /> 🔹 Theory & Working
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                    <p>Yeh ek basic IoT project hai, lekin isi concept ka upyog karke <strong>Smart Home Devices</strong> bhi banaye jaate hain।</p>
                    <p>Is practical me hum <strong>Bluetooth Communication</strong> ko samjhenge. Mobile Phone Bluetooth ke madhyam se Arduino ko Data bhejta hai aur Arduino us data ke anusar LED ko control karta hai।</p>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-blue-200">
                        <p className="text-xs font-bold text-blue-800 mb-2">📥 Data Flow</p>
                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-200">
                            <span className="flex flex-col items-center gap-1"><Smartphone size={16} className="text-blue-500"/> Mobile App</span>
                            <span className="text-blue-600">〰️ (Bluetooth) 〰️</span>
                            <span className="flex flex-col items-center gap-1"><Radio size={16} className="text-indigo-500"/> HC-05</span>
                            <span className="text-gray-500">➡️ (RX/TX) ➡️</span>
                            <span className="flex flex-col items-center gap-1"><CircuitBoard size={16} className="text-emerald-600"/> Arduino</span>
                        </div>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-blue-200">
                        <p className="text-xs font-bold text-blue-800 mb-2">⚙️ Commands</p>
                        <ul className="space-y-2 text-xs">
                            <li className="flex items-center justify-between bg-green-50 px-3 py-1.5 rounded text-green-800 border border-green-200">
                                <span>Send Character <strong className="font-mono text-base">'1'</strong></span>
                                <span>➡️ LED <strong>ON</strong></span>
                            </li>
                            <li className="flex items-center justify-between bg-red-50 px-3 py-1.5 rounded text-red-800 border border-red-200">
                                <span>Send Character <strong className="font-mono text-base">'0'</strong></span>
                                <span>➡️ LED <strong>OFF</strong></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ═══ Interactive Simulator ═══ */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-slate-900 to-blue-950 p-5 mb-6 overflow-hidden relative">
                <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Smartphone size={12} /> Interactive Simulator — Mobile App & Bluetooth
                </p>

                <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                    
                    {/* Mobile App UI */}
                    <div className="w-48 bg-white rounded-[24px] border-4 border-gray-800 p-2 shadow-2xl relative z-10 flex-shrink-0">
                        {/* Speaker & Camera notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-800 rounded-b-xl"></div>
                        
                        <div className="bg-slate-100 h-80 rounded-[16px] overflow-hidden flex flex-col">
                            {/* App Header */}
                            <div className="bg-blue-600 text-white p-3 text-center pt-5 shadow-md">
                                <h4 className="text-[10px] font-bold tracking-widest uppercase mb-1 flex items-center justify-center gap-1">
                                    <Radio size={10} /> BT Controller
                                </h4>
                                <div className="text-[9px] text-blue-200">Status: {btConnected ? <span className="text-green-300 font-bold">Connected (HC-05)</span> : <span className="text-red-50 font-bold">Disconnected</span>}</div>
                            </div>
                            
                            {/* App Body */}
                            <div className="flex-1 p-3 flex flex-col gap-3 justify-center items-center">
                                <button 
                                    onClick={() => setBtConnected(!btConnected)}
                                    className={`w-full py-2 rounded-full text-xs font-bold transition-all shadow-sm border ${btConnected ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600 shadow-blue-500/30'}`}
                                >
                                    {btConnected ? 'Disconnect' : 'Connect to HC-05'}
                                </button>
                                
                                <div className="w-full h-px bg-gray-200 my-1"></div>

                                <button 
                                    onClick={() => handleSend('1')}
                                    disabled={!btConnected || sendingData !== null}
                                    className={`w-full py-4 rounded-xl text-sm font-black transition-all ${!btConnected ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400' : sendingData === '1' ? 'bg-green-400 text-white scale-95' : 'bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/30 active:scale-95'}`}
                                >
                                    {sendingData === '1' ? 'Sending...' : 'LED ON'}
                                </button>
                                
                                <button 
                                    onClick={() => handleSend('0')}
                                    disabled={!btConnected || sendingData !== null}
                                    className={`w-full py-4 rounded-xl text-sm font-black transition-all ${!btConnected ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400' : sendingData === '0' ? 'bg-red-400 text-white scale-95' : 'bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-500/30 active:scale-95'}`}
                                >
                                    {sendingData === '0' ? 'Sending...' : 'LED OFF'}
                                </button>

                                <div className="mt-auto w-full text-center">
                                    <p className="text-[8px] text-gray-600">Last Sent Data</p>
                                    <div className="bg-white border border-gray-200 rounded p-1.5 mt-1 font-mono text-xs font-bold text-gray-700 min-h-[28px] flex items-center justify-center">
                                        {sendingData ? `Sending '${sendingData}'...` : serialLog.length > 0 ? `'${serialLog[serialLog.length-1].data}'` : '-'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Animated SVG Hardware Setup */}
                    <div className="flex-1 flex justify-center w-full max-w-sm relative z-0">
                        <svg viewBox="0 0 300 220" className="w-full h-auto max-w-sm">
                            {/* Connection waves animation */}
                            {btConnected && !sendingData && (
                                <g opacity="0.4">
                                    <circle cx="20" cy="110" r="30" fill="none" stroke="#3b82f6" strokeWidth="1">
                                        <animate attributeName="r" values="30;120" dur="2s" repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" />
                                    </circle>
                                </g>
                            )}
                            
                            {/* Sending data animation */}
                            {sendingData && (
                                <g>
                                    <circle cx="50" cy="110" r="5" fill="#3b82f6">
                                        <animate attributeName="cx" values="20;120" dur="0.8s" begin="0s" fill="freeze" />
                                    </circle>
                                    <text x="70" y="100" fill="#60a5fa" fontSize="12" fontWeight="bold" fontFamily="monospace">
                                        <animate attributeName="x" values="30;130" dur="0.8s" begin="0s" fill="freeze" />
                                        '{sendingData}'
                                    </text>
                                </g>
                            )}

                            {/* HC-05 Bluetooth Module */}
                            <g transform="translate(110, 80)">
                                <rect x="0" y="0" width="35" height="60" rx="2" fill="#1e3a8a" stroke="#1e40af" strokeWidth="1" />
                                <rect x="5" y="5" width="25" height="15" fill="#0f172a" /> {/* Antenna area */}
                                <path d="M 10 15 L 15 10 L 20 15 L 15 20 Z M 15 10 L 15 20 M 15 15 L 25 15" stroke="#3b82f6" strokeWidth="1" fill="none" /> {/* BT Logo */}
                                <rect x="10" y="25" width="15" height="15" fill="#0f172a" /> {/* IC */}
                                
                                {/* Status LED on HC-05 */}
                                <circle cx="17.5" cy="50" r="2" fill={btConnected ? (sendingData ? "#3b82f6" : "#22c55e") : "#ef4444"} 
                                    opacity={!btConnected ? "0.5" : "1"} />
                                {btConnected && !sendingData && (
                                    <circle cx="17.5" cy="50" r="2" fill="#22c55e">
                                        <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
                                    </circle>
                                )}
                                
                                {/* Pins */}
                                <rect x="5" y="60" width="2" height="5" fill="#94a3b8" />
                                <rect x="11" y="60" width="2" height="5" fill="#94a3b8" />
                                <rect x="17" y="60" width="2" height="5" fill="#94a3b8" />
                                <rect x="23" y="60" width="2" height="5" fill="#94a3b8" />
                                <rect x="29" y="60" width="2" height="5" fill="#94a3b8" />
                                <text x="6" y="72" fontSize="4" fill="#93c5fd" fontFamily="monospace">RX TX GN VC EN</text>
                                <text x="17.5" y="4" textAnchor="middle" fontSize="5" fill="#60a5fa" fontWeight="bold">HC-05</text>
                            </g>

                            {/* Arduino Board */}
                            <g transform="translate(180, 70)">
                                <rect x="0" y="0" width="60" height="80" rx="4" fill="#0369a1" stroke="#0284c7" strokeWidth="1" />
                                <text x="30" y="40" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace">ARDUINO</text>
                                
                                {/* Digital Pins Header (Top) */}
                                <rect x="5" y="2" width="50" height="6" fill="#0f172a" />
                                <text x="45" y="13" fontSize="4" fill="white" fontFamily="monospace">13</text>
                                <text x="10" y="13" fontSize="4" fill="white" fontFamily="monospace">RX TX</text>
                                <text x="10" y="18" fontSize="4" fill="white" fontFamily="monospace"> 0  1</text>
                                
                                {/* Power Pins Header (Bottom) */}
                                <rect x="10" y="72" width="30" height="6" fill="#0f172a" />
                                <text x="25" y="68" fontSize="4" fill="white" fontFamily="monospace">5V GND</text>
                            </g>

                            {/* Wires between HC-05 and Arduino */}
                            <path d="M 116 145 L 116 155 L 205 155 L 205 142" stroke="#ef4444" strokeWidth="1" fill="none" /> {/* VCC -> 5V */}
                            <path d="M 122 145 L 122 160 L 210 160 L 210 142" stroke="#000000" strokeWidth="1" fill="none" /> {/* GND -> GND */}
                            
                            <path d="M 128 145 L 128 150 L 190 150 L 190 78" stroke="#eab308" strokeWidth="1.5" fill="none" /> {/* TX(HC05) -> RX(0) */}
                            <path d="M 134 145 L 134 148 L 195 148 L 195 78" stroke="#10b981" strokeWidth="1.5" fill="none" /> {/* RX(HC05) -> TX(1) */}
                            
                            {/* Data animation on wires */}
                            {sendingData && (
                                <g>
                                    <circle r="2" fill="#fbbf24">
                                        <animateMotion path="M 128 145 L 128 150 L 190 150 L 190 78" dur="0.3s" begin="0.4s" fill="freeze" />
                                    </circle>
                                </g>
                            )}

                            {/* LED Component */}
                            <g transform="translate(260, 50)">
                                {/* LED glow */}
                                {ledOn && (
                                    <circle cx="10" cy="10" r="25" fill="#ef4444" opacity="0.3">
                                        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="1s" repeatCount="indefinite" />
                                    </circle>
                                )}
                                {/* LED body */}
                                <polygon points="3,10 17,10 14,25 6,25" fill={ledOn ? "rgba(239, 68, 68, 0.9)" : "rgba(153, 27, 27, 0.5)"} stroke="#dc2626" strokeWidth="1" />
                                <ellipse cx="10" cy="10" rx="7" ry="4" fill={ledOn ? "#f87171" : "rgba(153, 27, 27, 0.6)"} stroke="#dc2626" strokeWidth="0.5" />
                                {/* Legs */}
                                <line x1="8" y1="25" x2="8" y2="45" stroke="#94a3b8" strokeWidth="1" /> {/* Long (Anode) */}
                                <line x1="12" y1="25" x2="12" y2="40" stroke="#94a3b8" strokeWidth="1" /> {/* Short (Cathode) */}
                                
                                {/* Wiring */}
                                <path d="M 8 45 L 8 50 L -35 50 L -35 22" stroke="#ef4444" strokeWidth="1" fill="none" /> {/* Pin 13 */}
                                <path d="M 12 40 L 12 45 L -20 45 L -20 22" stroke="#000000" strokeWidth="1" fill="none" /> {/* GND (near pin 13) */}
                            </g>
                            
                            {/* Explanation Tooltips */}
                            <rect x="180" y="170" width="110" height="40" rx="4" fill="#1e293b" stroke="#334155" />
                            <text x="185" y="182" fill="#a3e635" fontSize="7" fontFamily="monospace" fontWeight="bold">Serial.read() = '{serialLog.length > 0 ? serialLog[serialLog.length-1].data : '0'}'</text>
                            <text x="185" y="195" fill={ledOn ? "#4ade80" : "#f87171"} fontSize="7" fontFamily="monospace">
                                {ledOn ? "digitalWrite(13, HIGH)" : "digitalWrite(13, LOW)"}
                            </text>
                            <text x="185" y="205" fill="#94a3b8" fontSize="6" fontFamily="monospace">LED is {ledOn ? "ON" : "OFF"}</text>

                            {/* RX/TX crossover note */}
                            <rect x="80" y="170" width="80" height="25" rx="2" fill="#1e1b4b" stroke="#312e81" />
                            <text x="85" y="180" fill="#818cf8" fontSize="6" fontFamily="monospace">HC05 TX → Arduino RX</text>
                            <text x="85" y="188" fill="#818cf8" fontSize="6" fontFamily="monospace">HC05 RX → Arduino TX</text>
                        </svg>
                    </div>
                </div>

                {/* Serial Monitor Display */}
                <div className="mt-4 bg-gray-950 rounded-xl p-3 border border-gray-800 font-mono text-xs flex flex-col h-28 relative">
                    <p className="text-[10px] text-gray-400 mb-1 border-b border-gray-800 pb-1 flex justify-between">
                        <span>📟 COM3 - Serial Monitor (9600 baud)</span>
                        {btConnected && <span className="text-green-400">● BT Connected</span>}
                    </p>
                    <div className="flex-1 overflow-hidden flex flex-col justify-end space-y-1">
                        {serialLog.length === 0 ? (
                            <p className="text-gray-400 italic text-[10px]">Waiting for Bluetooth data...</p>
                        ) : (
                            serialLog.map((log, i) => (
                                <p key={i} className="text-green-400">
                                    <span className="text-gray-400">[{log.time}]</span> Received: {log.data}
                                    <span className="text-gray-400 ml-2">→ LED {log.data === '1' ? 'ON' : log.data === '0' ? 'OFF' : 'Unknown'}</span>
                                </p>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Materials and Connections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50">
                    <h3 className="text-sm font-extrabold text-blue-900 mb-3 flex items-center gap-2">
                        <Wrench size={14} /> Required Components
                    </h3>
                    <ul className="space-y-2">
                        {[
                            { label: 'Arduino Uno Board', icon: '🟦' },
                            { label: 'HC-05 Bluetooth Module', icon: '📶' },
                            { label: 'LED & Resistor', icon: '💡' },
                            { label: 'Jumper Wires & Breadboard', icon: '🔌' },
                            { label: 'Android Mobile Phone', icon: '📱' },
                        ].map((m, i) => (
                            <li key={i} className="flex items-center gap-2.5 text-sm text-blue-900 bg-white rounded-lg px-3 py-2 border border-blue-100 shadow-sm">
                                <span>{m.icon}</span><span className="font-semibold">{m.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50">
                    <h3 className="text-sm font-extrabold text-indigo-900 mb-3 flex items-center gap-2">
                        <CircuitBoard size={14} /> Circuit Connections
                    </h3>
                    <ol className="space-y-2">
                        {[
                            { step: 'HC-05 VCC ➡️ Arduino 5V', icon: '🔴' },
                            { step: 'HC-05 GND ➡️ Arduino GND', icon: '⚫' },
                            { step: 'HC-05 RX ➡️ Arduino TX (Pin 1)', icon: '🟢', highlight: true },
                            { step: 'HC-05 TX ➡️ Arduino RX (Pin 0)', icon: '🟡', highlight: true },
                            { step: 'LED Positive ➡️ Arduino Pin 13', icon: '🔌' },
                        ].map((c, i) => (
                            <li key={i} className={`flex items-center gap-2 text-xs p-2 rounded-lg ${c.highlight ? 'bg-indigo-100 border border-indigo-200 font-bold text-indigo-900' : 'text-indigo-800 bg-white border border-indigo-50'}`}>
                                <span>{c.icon}</span> <span>{c.step}</span>
                            </li>
                        ))}
                    </ol>
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-[10px] text-yellow-800 font-semibold flex items-start gap-1">
                        <span className="mt-0.5">⚠️</span>
                        <p><strong>Note:</strong> Code upload karte samay HC-05 ki RX/TX pins Arduino se disconnect karni padti hain warna code upload nahi hoga.</p>
                    </div>
                </div>
            </div>

            {/* Arduino Program */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#1e293b' }}>
                    <FileCode2 size={14} className="text-blue-400" />
                    <span className="text-xs font-bold text-blue-300 tracking-wide">Arduino Code</span>
                    <div className="ml-auto flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                </div>
                <div className="bg-gray-950 p-4 font-mono text-xs leading-7 overflow-x-auto">
                    <div><span className="text-sky-400">char</span> <span className="text-green-300">data</span> <span className="text-gray-400">=</span> <span className="text-orange-400">0</span><span className="text-gray-300">;</span></div>
                    <div className="mt-2"><span className="text-purple-400">void</span> <span className="text-yellow-300">setup</span><span className="text-gray-300">()</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-4"><span className="text-sky-300">Serial</span><span className="text-gray-300">.</span><span className="text-yellow-200">begin</span><span className="text-gray-300">(</span><span className="text-orange-400">9600</span><span className="text-gray-300">);</span></div>
                    <div className="ml-4"><span className="text-sky-300">pinMode</span><span className="text-gray-300">(</span><span className="text-orange-400">13</span><span className="text-gray-300">,</span> <span className="text-orange-400">OUTPUT</span><span className="text-gray-300">);</span></div>
                    <div><span className="text-gray-300">{'}'}</span></div>
                    <div className="mt-2"><span className="text-purple-400">void</span> <span className="text-yellow-300">loop</span><span className="text-gray-300">()</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-4"><span className="text-purple-400">if</span> <span className="text-gray-300">(</span><span className="text-sky-300">Serial</span><span className="text-gray-300">.</span><span className="text-yellow-200">available</span><span className="text-gray-300">() &gt;</span> <span className="text-orange-400">0</span><span className="text-gray-300">)</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-8"><span className="text-green-300">data</span> <span className="text-gray-400">=</span> <span className="text-sky-300">Serial</span><span className="text-gray-300">.</span><span className="text-yellow-200">read</span><span className="text-gray-300">();</span></div>
                    <div className="ml-8 mt-1"><span className="text-sky-300">Serial</span><span className="text-gray-300">.</span><span className="text-yellow-200">print</span><span className="text-gray-300">(</span><span className="text-green-300">data</span><span className="text-gray-300">);</span></div>
                    <div className="ml-8 mt-2"><span className="text-purple-400">if</span> <span className="text-gray-300">(</span><span className="text-green-300">data</span> <span className="text-gray-400">==</span> <span className="text-emerald-300">'1'</span><span className="text-gray-300">)</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-12"><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-orange-400">13</span><span className="text-gray-300">,</span> <span className="text-orange-400">HIGH</span><span className="text-gray-300">);</span></div>
                    <div className="ml-8"><span className="text-gray-300">{'}'}</span></div>
                    <div className="ml-8 mt-1"><span className="text-purple-400">else if</span> <span className="text-gray-300">(</span><span className="text-green-300">data</span> <span className="text-gray-400">==</span> <span className="text-emerald-300">'0'</span><span className="text-gray-300">)</span> <span className="text-gray-300">{'{'}</span></div>
                    <div className="ml-12"><span className="text-sky-300">digitalWrite</span><span className="text-gray-300">(</span><span className="text-orange-400">13</span><span className="text-gray-300">,</span> <span className="text-orange-400">LOW</span><span className="text-gray-300">);</span></div>
                    <div className="ml-8"><span className="text-gray-300">{'}'}</span></div>
                    <div className="ml-4"><span className="text-gray-300">{'}'}</span></div>
                    <div><span className="text-gray-300">{'}'}</span></div>
                </div>
            </div>

            {/* Code Explanation */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 mb-6">
                <h3 className="text-sm font-extrabold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen size={14} className="text-blue-500" /> 🔹 Code Explanation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <code className="text-[11px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">char data = 0;</code>
                            <p className="text-xs text-gray-600 mt-1">Mobile se aane wale data ko store karne ke liye variable.</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <code className="text-[11px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">Serial.begin(9600);</code>
                            <p className="text-xs text-gray-600 mt-1">Arduino aur Bluetooth HC-05 ke beech 9600 baud rate par communication shuru karta hai.</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <code className="text-[11px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">Serial.available() &gt; 0</code>
                            <p className="text-xs text-gray-600 mt-1">Check karta hai ki Bluetooth se koi naya data aya hai ya nahi.</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <code className="text-[11px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">data = Serial.read();</code>
                            <p className="text-xs text-gray-600 mt-1">Bluetooth se aaye hue data (character) ko read karke `data` variable me store karta hai.</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl border border-green-100 shadow-sm">
                            <code className="text-[11px] font-bold text-green-800 bg-green-100 px-1.5 py-0.5 rounded">if (data == '1')</code>
                            <p className="text-xs text-green-800 mt-1">Agar mobile se '1' received hota hai, to `digitalWrite(13, HIGH)` se LED ON ho jati hai.</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-xl border border-red-100 shadow-sm">
                            <code className="text-[11px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">else if (data == '0')</code>
                            <p className="text-xs text-red-800 mt-1">Agar mobile se '0' received hota hai, to `digitalWrite(13, LOW)` se LED OFF ho jati hai.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conclusion */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <h3 className="text-sm font-extrabold text-blue-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={14} /> 🔹 Result & Conclusion
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                    Is practical me humne Arduino aur HC-05 Bluetooth Module ka upyog karke Mobile Phone se LED ko Successfully Control kiya। Isse hume <strong>Bluetooth Communication aur Basic IoT Automation</strong> ki working samajh aati hai। Yehi concept aage chal kar <strong>Smart Home Systems aur Smart Switches</strong> me use hota hai।
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                    {['HC-05', 'Bluetooth UART', 'Serial.read', 'IoT Basics', 'Home Automation'].map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-blue-200 rounded-full text-[10px] font-bold text-blue-700 shadow-sm">{tag}</span>
                    ))}
                </div>
            </div>
        </section>
    );
}
