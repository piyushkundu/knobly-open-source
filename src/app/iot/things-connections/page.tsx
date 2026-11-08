'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Menu, X, ChevronRight, Hash, Sparkles, Settings, Activity, Gauge, Thermometer, Repeat, Target, Clock, Zap, Cpu, Layers, Network, Globe, ArrowRightLeft, Wifi, Server } from 'lucide-react';

function Sec({ id, title, icon, children }: { id: string; title: string; icon: ReactNode; children: ReactNode }) {
    return (
        <section id={id} className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg bg-white" style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>{icon}<h2 className="text-base md:text-lg font-extrabold text-gray-800">{title}</h2></div>
            <div className="text-sm leading-relaxed space-y-3 text-gray-600">{children}</div>
        </section>
    );
}

function Def({ children }: { children: ReactNode }) {
    return <div className="rounded-xl p-4 my-3 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '1px solid #c4b5fd', color: '#4c1d95' }}>{children}</div>;
}

function IB({ type = 'tip', children }: { type?: 'tip' | 'note' | 'warning'; children: ReactNode }) {
    const s: Record<string, { bg: string; bc: string; tc: string; emoji: string }> = { tip: { bg: '#ecfeff', bc: '#67e8f9', tc: '#0e7490', emoji: '💡' }, note: { bg: '#eff6ff', bc: '#93c5fd', tc: '#1e40af', emoji: '📝' }, warning: { bg: '#fefce8', bc: '#fde047', tc: '#854d0e', emoji: '⚠️' } };
    const st = s[type];
    return <div className="rounded-xl p-3.5 text-xs font-medium my-3" style={{ background: st.bg, border: `1px solid ${st.bc}`, color: st.tc }}>{st.emoji} {children}</div>;
}

const tocItems = [
    { icon: <Settings size={13} />, label: 'Control System', id: 'control-system', color: '#8b5cf6' },
    { icon: <Repeat size={13} />, label: 'Types of System', id: 'types-system', color: '#06b6d4' },
    { icon: <Target size={13} />, label: 'Open Loop', id: 'open-loop', color: '#f97316' },
    { icon: <Activity size={13} />, label: 'Closed Loop', id: 'closed-loop', color: '#10b981' },
    { icon: <Clock size={13} />, label: 'Real Time System', id: 'real-time', color: '#ef4444' },
    { icon: <Thermometer size={13} />, label: 'Thermostat', id: 'thermostat', color: '#f59e0b' },
    { icon: <Layers size={13} />, label: 'OSI Model', id: 'osi-model', color: '#06b6d4' },
    { icon: <Network size={13} />, label: 'TCP/IP Model', id: 'tcp-ip', color: '#ec4899' },
    { icon: <ArrowRightLeft size={13} />, label: 'Transmission Mode', id: 'transmission-mode', color: '#8b5cf6' },
    { icon: <Zap size={13} />, label: 'Transmission Media', id: 'transmission-media', color: '#10b981' },
    { icon: <Zap size={13} />, label: 'Guided Media', id: 'guided-media', color: '#0ea5e9' },
    { icon: <Wifi size={13} />, label: 'Unguided Media', id: 'unguided-media', color: '#8b5cf6' },
];

export default function IoTThingsConnections() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('control-system');

    return (
        <div className="min-h-screen bg-white text-slate-800 relative">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/30" />
            </div>

            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/iot" className="flex items-center justify-center w-9 h-9 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}><ArrowLeft size={16} /></Link>
                        <div>
                            <h1 className="text-sm font-extrabold text-gray-800">Things and Connections</h1>
                            <div className="flex items-center gap-1.5"><Sparkles size={8} className="text-purple-500" /><span className="text-[9px] uppercase tracking-[0.18em] font-bold text-purple-500">Chapter 2</span></div>
                        </div>
                    </div>
                    <button onClick={() => setTocOpen(!tocOpen)} className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 border border-gray-200">
                        {tocOpen ? <X size={18} className="text-purple-500" /> : <Menu size={18} className="text-purple-500" />}
                    </button>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #8b5cf6, #06b6d4, #f97316, #8b5cf6)' }} />
            </header>

            <div className="max-w-7xl mx-auto flex relative">
                <aside className={`${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[52px] left-0 z-40 lg:z-10 w-64 lg:w-56 xl:w-64 h-[calc(100vh-52px)] overflow-y-auto transition-transform duration-300 lg:flex-shrink-0 bg-white/95 backdrop-blur-xl`} style={{ borderRight: '1px solid #e2e8f0' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}><Hash size={12} className="text-white" /></div>
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
                    <section className="relative rounded-3xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 30%, #a855f7 60%, #0ea5e9 100%)', boxShadow: '0 8px 32px rgba(139,92,246,0.25)' }}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)' }} />
                        </div>
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
                                <Sparkles size={10} /> Chapter 2 — O-Level M4-R5
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black mb-3 text-white" style={{ lineHeight: '1.2' }}>Things and Connections</h2>
                            <p className="text-sm md:text-base max-w-2xl mb-5 text-white/85">Control Systems ka working, Open loop &amp; Closed loop aur Real Time Systems ke baare mein seekho.</p>
                        </div>
                    </section>

                    {/* ═══ SECTION: Control System ═══ */}
                    <Sec id="control-system" title="🔹 Working of Control System" icon={<Settings size={16} className="text-purple-500" />}>
                        <Def>⚙️ <strong>Control System</strong> ek aisa system hota hai jo mechanical ya electronic devices ko control loops ke madhyam se control karta hai.</Def>
                        <p>Is system ka main kaam kisi bhi machine ya device ke <strong>behavior aur working ko manage karna</strong> hota hai.</p>
                        <p>IoT me bhi computerized control systems ka bahut use hota hai. Aaj industries me control system ka use machines ke kaam ko control karne ke liye kiya jata hai. Different types ke control systems alag-alag purpose ke liye kaam karte hain.</p>
                        
                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: '1px solid #e2e8f0' }}>
                            <h4 className="font-bold text-slate-800 mb-2">🎯 Control System ka Purpose</h4>
                            <p className="text-sm text-slate-700">Control system ka use <strong>output ko control karne</strong> ke liye kiya jata hai. Ye system following parameters ko control karta hai:</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {['🏎️ Velocity', '🚀 Acceleration', '🌡️ Temperature', '⏱️ Pressure', '⚡ Voltage', '🔌 Current'].map((p, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-white text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm">{p}</span>
                                ))}
                            </div>
                        </div>

                        <h4 className="font-bold mt-5 mb-3 text-gray-800">✨ Features of Control System</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
                            {['Accuracy', 'Sensitivity', 'Energy Saving', 'Stability', 'Noise', 'Bandwidth', 'Speed'].map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 border border-purple-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                    <span className="text-xs font-bold text-purple-800">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Types of System ═══ */}
                    <Sec id="types-system" title="🔹 Types of Control System" icon={<Repeat size={16} className="text-cyan-500" />}>
                        <p>Control system mainly <strong>do prakar (two types)</strong> ke hote hain:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            <div className="p-5 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50 hover:shadow-md transition-all">
                                <h4 className="font-bold text-orange-700 text-lg mb-2">1. Open Loop System</h4>
                                <p className="text-sm text-orange-800">Jisme output ko check nahi kiya jata. Isme koi feedback signal nahi hota.</p>
                            </div>
                            <div className="p-5 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:shadow-md transition-all">
                                <h4 className="font-bold text-emerald-700 text-lg mb-2">2. Closed Loop System</h4>
                                <p className="text-sm text-emerald-800">Jisme output ko continuously monitor kiya jata hai aur feedback signal use hota hai.</p>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Open Loop ═══ */}
                    <Sec id="open-loop" title="🔴 (1) Open Loop Control System" icon={<Target size={16} className="text-orange-500" />}>
                        <Def>🎯 <strong>Open Loop Control System</strong> ko <em>non-feedback control system</em> bhi kaha jata hai kyunki is system me koi feedback signal ya error signal nahi hota.</Def>
                        <p>Ye ek <strong>simple control system</strong> hota hai jisme output ko check nahi kiya jata. System sirf input ke according kaam karta rehta hai.</p>
                        
                        <div className="my-6 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center">
                            <h4 className="font-bold text-gray-800 mb-6 w-full text-center">📊 Open Loop System Diagram</h4>
                            
                            {/* Diagram for Open Loop */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl relative">
                                {/* Input Arrow */}
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-600 text-sm">Input</span>
                                    <div className="w-12 h-1 bg-gray-400 relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-gray-400 rotate-45 transform origin-center translate-x-[2px]"></div>
                                    </div>
                                </div>
                                
                                {/* Controller Block */}
                                <div className="px-6 py-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold shadow-md shadow-blue-200 flex flex-col items-center w-32">
                                    <Cpu size={24} className="mb-2 opacity-80" />
                                    <span className="text-sm">Controller</span>
                                </div>
                                
                                {/* Arrow */}
                                <div className="h-8 w-1 sm:h-1 sm:w-12 bg-gray-400 relative">
                                    <div className="absolute bottom-0 sm:right-0 sm:top-1/2 left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-[2px] sm:-translate-y-1/2 w-3 h-3 border-b-2 border-r-2 sm:border-b-0 sm:border-t-2 sm:border-r-2 border-gray-400 rotate-45 transform origin-center translate-y-[2px] sm:translate-y-0"></div>
                                </div>
                                
                                {/* Process Block */}
                                <div className="px-6 py-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold shadow-md shadow-orange-200 flex flex-col items-center w-32">
                                    <Settings size={24} className="mb-2 opacity-80 animate-[spin_4s_linear_infinite]" />
                                    <span className="text-sm">Process</span>
                                </div>
                                
                                {/* Output Arrow */}
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                    <div className="h-8 w-1 sm:h-1 sm:w-12 bg-gray-400 relative">
                                        <div className="absolute bottom-0 sm:right-0 sm:top-1/2 left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-[2px] sm:-translate-y-1/2 w-3 h-3 border-b-2 border-r-2 sm:border-b-0 sm:border-t-2 sm:border-r-2 border-gray-400 rotate-45 transform origin-center translate-y-[2px] sm:translate-y-0"></div>
                                    </div>
                                    <span className="font-bold text-gray-600 text-sm">Output</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fdba74' }}>
                            <h4 className="font-bold text-orange-700 mb-2">⚡ Working of Open Loop System</h4>
                            <p className="text-sm text-orange-800">Jab system start hota hai to controller process ko control karta hai aur output produce hota hai. Lekin <strong>output sahi hai ya galat, iska feedback system ko nahi milta.</strong></p>
                            <p className="text-sm text-orange-800 mt-2">Isliye agar error ho bhi jaye to system usse <strong>automatically correct nahi karta.</strong></p>
                        </div>

                        <h4 className="font-bold mt-5 mb-3 text-gray-800">💡 Examples of Open Loop</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                            <div className="p-4 rounded-xl bg-white border border-gray-200 text-center shadow-sm">
                                <div className="text-3xl mb-2">🚿</div>
                                <h5 className="font-bold text-sm text-gray-800">Water Heater</h5>
                                <p className="text-xs text-gray-500 mt-1">Jab ON kiya jata hai to continuously pani garam karta hai jab tak OFF na kare.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white border border-gray-200 text-center shadow-sm">
                                <div className="text-3xl mb-2">🌀</div>
                                <h5 className="font-bold text-sm text-gray-800">Ceiling Fan</h5>
                                <p className="text-xs text-gray-500 mt-1">Speed set karne ke baad environment ke hisaab se khud speed change nahi karta.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white border border-gray-200 text-center shadow-sm">
                                <div className="text-3xl mb-2">💡</div>
                                <h5 className="font-bold text-sm text-gray-800">Light Bulb</h5>
                                <p className="text-xs text-gray-500 mt-1">Switch ON karne par jalta rehta hai, din ya raat se isko khud farq nahi padta.</p>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Closed Loop ═══ */}
                    <Sec id="closed-loop" title="🔴 (2) Closed Loop Control System" icon={<Activity size={16} className="text-emerald-500" />}>
                        <Def>🔄 <strong>Closed Loop Control System</strong> ko <em>feedback control system</em> bhi kaha jata hai kyunki isme feedback signal use hota hai.</Def>
                        <p>Ye system continuously output ko monitor karta hai aur agar error milta hai to usse <strong>automatically correct karta hai.</strong></p>

                        <div className="my-6 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center overflow-x-auto">
                            <h4 className="font-bold text-gray-800 mb-8 w-full text-center">📊 Closed Loop System Diagram</h4>
                            
                            {/* Diagram for Closed Loop */}
                            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-3xl min-w-[500px] py-8">
                                {/* Feedback Path - Drawn first so it's behind blocks if needed, but mostly above/below */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                                    {/* Line down from Output */}
                                    <path d="M 80% 50% L 80% 90% L 35% 90% L 35% 50%" fill="none" stroke="#9ca3af" strokeWidth="4" />
                                    <polygon points="35%,50% 32%,55% 38%,55%" fill="#9ca3af" />
                                    <text x="57%" y="85%" textAnchor="middle" fill="#4b5563" fontSize="14" fontWeight="bold">Feedback</text>
                                </svg>

                                {/* Input */}
                                <div className="flex items-center gap-2 relative z-10">
                                    <span className="font-bold text-gray-600 text-sm">Input</span>
                                    <div className="w-12 h-1 bg-gray-400 relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-gray-400 rotate-45 transform origin-center translate-x-[2px]"></div>
                                    </div>
                                </div>
                                
                                {/* Comparator (Circle) */}
                                <div className="w-12 h-12 rounded-full border-4 border-emerald-500 bg-white flex items-center justify-center relative z-10 shadow-sm">
                                    <span className="text-emerald-700 font-bold text-xl">⨯</span>
                                </div>

                                {/* Arrow */}
                                <div className="w-10 h-1 bg-gray-400 relative z-10">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-gray-400 rotate-45 transform origin-center translate-x-[2px]"></div>
                                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-800 font-bold">Error</span>
                                </div>

                                {/* Controller Block */}
                                <div className="px-5 py-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold shadow-md shadow-blue-200 flex flex-col items-center w-28 relative z-10">
                                    <Cpu size={20} className="mb-2 opacity-80" />
                                    <span className="text-xs">Controller</span>
                                </div>
                                
                                {/* Arrow */}
                                <div className="w-10 h-1 bg-gray-400 relative z-10">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-gray-400 rotate-45 transform origin-center translate-x-[2px]"></div>
                                </div>
                                
                                {/* Process Block */}
                                <div className="px-5 py-4 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold shadow-md shadow-emerald-200 flex flex-col items-center w-28 relative z-10">
                                    <Settings size={20} className="mb-2 opacity-80 animate-[spin_4s_linear_infinite]" />
                                    <span className="text-xs">Process</span>
                                </div>
                                
                                {/* Output */}
                                <div className="flex items-center gap-2 relative z-10 w-24">
                                    <div className="w-10 h-1 bg-gray-400 relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-gray-400 rotate-45 transform origin-center translate-x-[2px]"></div>
                                    </div>
                                    <span className="font-bold text-gray-600 text-sm">Output</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac' }}>
                            <h4 className="font-bold text-emerald-700 mb-2">⚡ Working of Closed Loop System</h4>
                            <p className="text-sm text-emerald-800">Is system me output ka kuch part <strong>feedback</strong> ke roop me wapas controller ko diya jata hai. Controller actual output aur desired output ko compare karta hai.</p>
                            <p className="text-sm text-emerald-800 mt-2">Agar dono me difference hota hai to controller error ko reduce karta hai aur output ko improve karta hai. Isliye closed loop system <strong>jyada accurate aur efficient</strong> hota hai.</p>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Real Time System ═══ */}
                    <Sec id="real-time" title="🔹 Real Time System" icon={<Clock size={16} className="text-red-500" />}>
                        <Def>⏱️ <strong>Real Time System</strong> ek aisa system hota hai jiska use un kaamon ke liye kiya jata hai jo <em>time se related hote hain</em> aur jinhe ek <em>fixed time period ke andar complete karna zaruri hota hai.</em></Def>
                        <p>Agar system given time ke andar result provide nahi karta to system <strong>fail</strong> maana jata hai.</p>
                        <p>Real time system me <strong>fast processing aur quick response</strong> bahut important hota hai.</p>

                        <h4 className="font-bold mt-5 mb-3 text-gray-800">🌟 Examples of Real Time System</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                            <div className="flex items-start gap-4 p-4 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100/30">
                                <div className="text-3xl bg-white p-2 rounded-xl shadow-sm">✈️</div>
                                <div>
                                    <h4 className="font-bold text-red-700 mb-1">Air Traffic Control System</h4>
                                    <p className="text-xs text-red-800">Ek second ki delay se bhi bada accident ho sakta hai, isliye iska response turant aana zaruri hai.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/30">
                                <div className="text-3xl bg-white p-2 rounded-xl shadow-sm">🚘</div>
                                <div>
                                    <h4 className="font-bold text-blue-700 mb-1">Automation Driving System</h4>
                                    <p className="text-xs text-blue-800">Agar aage koi object aata hai to system ko microseconds me break apply karna hota hai.</p>
                                </div>
                            </div>
                        </div>
                        <IB type="tip">Ye systems real-time data ko process karte hain aur <strong>turant decision lete hain!</strong></IB>
                    </Sec>

                    {/* ═══ SECTION: Thermostat ═══ */}
                    <Sec id="thermostat" title="🔹 What is Thermostat" icon={<Thermometer size={16} className="text-amber-500" />}>
                        <Def>🌡️ <strong>Thermostat</strong> ek aisa component ya device hota hai jo kisi physical system ke temperature ko control karta hai aur feedback provide karta hai taaki system ka temperature desired point ke aas-paas bana rahe.</Def>
                        
                        <div className="flex flex-col md:flex-row gap-5 items-center my-4">
                            <div className="flex-1 space-y-3">
                                <p>Thermostat ka main kaam <strong>temperature ko monitor karna</strong> aur uske according heating ya cooling ko control karna hota hai. Jab temperature fixed limit se jyada ya kam ho jata hai to thermostat automatically system ko ON ya OFF kar deta hai.</p>
                                <IB type="note">Ye ek <strong>closed loop control device</strong> hota hai kyunki isme continuously feedback use hota hai.</IB>
                            </div>
                            <div className="w-full md:w-1/3 flex justify-center">
                                <img src="/sample-assets/placeholder.svg" alt="Smart Thermostat" className="w-full max-w-[200px] rounded-2xl shadow-lg border border-gray-100" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                            <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                                <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">⚙️ Working of Thermostat</h4>
                                <ul className="space-y-2 text-sm text-amber-900">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Environment ka temperature sense karta hai</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Desired temperature se compare karta hai</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Temperature kam ho to heating start karta hai</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Temperature jyada ho to heating band kar deta hai</li>
                                </ul>
                                <p className="text-xs font-semibold text-amber-700 mt-3">👉 Is process ki wajah se system ka temperature stable bana rehta hai.</p>
                            </div>
                            
                            <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                                <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">💡 Uses of Thermostat</h4>
                                <p className="text-sm text-blue-900 mb-2">Thermostat ka use different devices aur systems me kiya jata hai:</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {['🏢 Building heating system', '❄️ Air Conditioner (AC)', '💧 Water heater', '♨️ Oven'].map((u, i) => (
                                        <span key={i} className="px-2 py-1 bg-white rounded-md text-xs font-semibold text-blue-800 shadow-sm border border-blue-100">{u}</span>
                                    ))}
                                </div>
                                <div className="p-2 bg-blue-100 rounded-lg text-xs text-blue-800">
                                    <strong>👉 Example:</strong> AC me thermostat room temperature ko maintain karta hai.
                                </div>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: OSI Model ═══ */}
                    <Sec id="osi-model" title="🔹 OSI Model (Open System Interconnection)" icon={<Layers size={16} className="text-cyan-500" />}>
                        <Def>🌐 <strong>OSI Model</strong> ek reference model hai jo ISO (International Organization for Standardization) ne 1984 me develop kiya tha.</Def>
                        <p>Ye model network communication ko samajhne ke liye use hota hai. OSI model communication process ko different layers me divide karta hai taaki data transmission easy aur organized ho sake. Is model me <strong>total 7 layers</strong> hoti hain aur har layer ka apna specific kaam hota hai.</p>

                        <h4 className="font-bold mt-6 mb-4 text-gray-800 text-center">📊 Layers of OSI Model</h4>
                        <div className="max-w-md mx-auto space-y-2 mb-6">
                            {[
                                { n: '7', t: 'Application Layer', c: '#ef4444', d: 'Network process to application' },
                                { n: '6', t: 'Presentation Layer', c: '#f97316', d: 'Data representation & encryption' },
                                { n: '5', t: 'Session Layer', c: '#eab308', d: 'Interhost communication' },
                                { n: '4', t: 'Transport Layer', c: '#22c55e', d: 'End-to-end connections & reliability' },
                                { n: '3', t: 'Network Layer', c: '#06b6d4', d: 'Path determination & logical addressing' },
                                { n: '2', t: 'Data Link Layer', c: '#3b82f6', d: 'Physical addressing & MAC' },
                                { n: '1', t: 'Physical Layer', c: '#8b5cf6', d: 'Media, signal & binary transmission' }
                            ].map((l, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-transform hover:scale-[1.02] cursor-default" style={{ background: `${l.c}10`, border: `1px solid ${l.c}40` }}>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm" style={{ background: l.c }}>{l.n}</div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-sm" style={{ color: l.c }}>{l.t}</h5>
                                        <p className="text-[10px] text-gray-500">{l.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Detail sections for each layer */}
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50">
                                <h5 className="font-bold text-purple-700 flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs">1</span> Physical Layer</h5>
                                <p className="text-xs text-purple-800 mb-2">Ye OSI model ki sabse lowest layer hoti hai. Is layer ka kaam data ko electrical signals, radio signals ya optical signals me convert karke transmit karna hota hai.</p>
                                <p className="text-[11px] font-semibold text-purple-600 bg-white inline-block px-2 py-1 rounded border border-purple-100">👉 Devices: Hub, Cable, Connector</p>
                            </div>
                            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50">
                                <h5 className="font-bold text-blue-700 flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs">2</span> Data Link Layer</h5>
                                <p className="text-xs text-blue-800 mb-2">Ye layer error-free data transfer provide karti hai. Iska kaam: Data framing, Error detection, MAC addressing.</p>
                                <p className="text-[11px] font-semibold text-blue-600 bg-white inline-block px-2 py-1 rounded border border-blue-100">👉 Device: Switch</p>
                            </div>
                            <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50">
                                <h5 className="font-bold text-cyan-700 flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-full bg-cyan-700 text-white flex items-center justify-center text-xs">3</span> Network Layer</h5>
                                <p className="text-xs text-cyan-800 mb-2">Ye layer source se destination tak data ka route decide karti hai. Is layer me IP addressing aur routing ka kaam hota hai.</p>
                                <div className="flex gap-2">
                                    <p className="text-[11px] font-semibold text-cyan-700 bg-white inline-block px-2 py-1 rounded border border-cyan-100">👉 Protocols: IPv4, IPv6</p>
                                    <p className="text-[11px] font-semibold text-cyan-700 bg-white inline-block px-2 py-1 rounded border border-cyan-100">👉 Device: Router</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                                <h5 className="font-bold text-emerald-700 flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">4</span> Transport Layer</h5>
                                <p className="text-xs text-emerald-800 mb-2">Ye layer end-to-end communication provide karti hai. Iska kaam: Data delivery, Error control, Flow control.</p>
                                <p className="text-[11px] font-semibold text-emerald-700 bg-white inline-block px-2 py-1 rounded border border-emerald-100">👉 Protocols: TCP, UDP</p>
                            </div>
                            <div className="p-4 rounded-xl border border-yellow-200 bg-yellow-50">
                                <h5 className="font-bold text-yellow-700 flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-full bg-yellow-700 text-white flex items-center justify-center text-xs">5</span> Session Layer</h5>
                                <p className="text-xs text-yellow-800">Ye layer communication sessions ko establish, manage aur terminate karti hai. Yani devices ke beech connection ko maintain karti hai.</p>
                            </div>
                            <div className="p-4 rounded-xl border border-orange-200 bg-orange-50">
                                <h5 className="font-bold text-orange-700 flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-full bg-orange-700 text-white flex items-center justify-center text-xs">6</span> Presentation Layer</h5>
                                <p className="text-xs text-orange-800 mb-2">Ye layer data ko readable format me convert karti hai. Iska kaam: Encryption, Decryption, Data formatting.</p>
                            </div>
                            <div className="p-4 rounded-xl border border-red-200 bg-red-50">
                                <h5 className="font-bold text-red-700 flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center text-xs">7</span> Application Layer</h5>
                                <p className="text-xs text-red-800 mb-2">Ye topmost layer hoti hai jahan user directly interact karta hai. Ye layer network services provide karti hai.</p>
                                <p className="text-[11px] font-semibold text-red-600 bg-white inline-block px-2 py-1 rounded border border-red-100">👉 Examples: HTTP, FTP, SMTP</p>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: TCP/IP Model ═══ */}
                    <Sec id="tcp-ip" title="🔹 TCP/IP Model" icon={<Network size={16} className="text-pink-500" />}>
                        <Def>🌐 <strong>TCP/IP model</strong> internet communication ka practical model hai.</Def>
                        <p>Ye WWW (World Wide Web) ka main protocol model hai jiska use internet par packets send karne ke liye kiya jata hai. TCP/IP model end-to-end communication provide karta hai. Is model ko 1970 aur 1980 ke beech Department of Defense ne develop kiya tha.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 items-center">
                            <div>
                                <h4 className="font-bold mb-3 text-pink-800 text-center">📊 TCP/IP Layers</h4>
                                <div className="space-y-2">
                                    {[
                                        { n: '4', t: 'Application Layer', c: '#ec4899', d: 'Covers Application, Presentation, Session layers of OSI' },
                                        { n: '3', t: 'Transport Layer', c: '#d946ef', d: 'Covers Transport layer of OSI' },
                                        { n: '2', t: 'Internet Layer', c: '#a855f7', d: 'Covers Network layer of OSI' },
                                        { n: '1', t: 'Network Access Layer', c: '#8b5cf6', d: 'Covers Data Link and Physical layers of OSI' }
                                    ].map((l, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${l.c}10`, border: `1px solid ${l.c}40` }}>
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm" style={{ background: l.c }}>{l.n}</div>
                                            <div className="flex-1">
                                                <h5 className="font-bold text-sm" style={{ color: l.c }}>{l.t}</h5>
                                                <p className="text-[10px] text-gray-500">{l.d}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl border border-pink-200 bg-pink-50">
                                    <h5 className="font-bold text-pink-700 text-sm mb-1">1. Application Layer</h5>
                                    <p className="text-xs text-pink-800 mb-1">Ye layer application, presentation aur session layer ka combined form hoti hai. User ko network services provide karti hai.</p>
                                    <p className="text-[10px] font-bold text-pink-700">👉 Protocols: HTTP, FTP, SMTP</p>
                                </div>
                                <div className="p-4 rounded-xl border border-fuchsia-200 bg-fuchsia-50">
                                    <h5 className="font-bold text-fuchsia-700 text-sm mb-1">2. Transport Layer</h5>
                                    <p className="text-xs text-fuchsia-800 mb-1">Ye layer reliable communication provide karti hai.</p>
                                    <p className="text-[10px] font-bold text-fuchsia-700">👉 Protocols: TCP, UDP</p>
                                </div>
                                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50">
                                    <h5 className="font-bold text-purple-700 text-sm mb-1">3. Internet Layer</h5>
                                    <p className="text-xs text-purple-800 mb-1">Ye layer routing aur addressing ka kaam karti hai.</p>
                                    <p className="text-[10px] font-bold text-purple-600">👉 Protocol: IP (Internet Protocol)</p>
                                </div>
                                <div className="p-4 rounded-xl border border-violet-200 bg-violet-50">
                                    <h5 className="font-bold text-violet-700 text-sm mb-1">4. Network Access Layer</h5>
                                    <p className="text-xs text-violet-800">Ye layer physical transmission aur hardware communication ka kaam karti hai. Isme data link aur physical layer dono include hoti hain.</p>
                                </div>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Transmission Mode ═══ */}
                    <Sec id="transmission-mode" title="🔹 Transmission Mode" icon={<ArrowRightLeft size={16} className="text-indigo-500" />}>
                        <Def>📡 <strong>Transmission mode</strong> batata hai ki data ek device se doosri device tak kis direction me transfer ho raha hai.</Def>
                        <p>Communication ke flow ko transmission mode kehte hain. Transmission mode mainly <strong>3 prakar</strong> ke hote hain: Simplex, Half-Duplex, Full-Duplex.</p>

                        {/* 1. Simplex */}
                        <div className="rounded-2xl p-5 my-5" style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: '1px solid #e2e8f0' }}>
                            <h4 className="font-bold text-slate-800 mb-2">🔴 1. Simplex Mode</h4>
                            <p className="text-sm text-slate-700 mb-4">Simplex mode me communication <strong>sirf ek direction me</strong> hota hai. Yani sender data bhej sakta hai lekin receiver data wapas send nahi kar sakta.</p>
                            
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
                                <div className="flex items-center gap-4 w-full max-w-sm justify-between">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mb-2">A</div>
                                        <span className="text-xs font-semibold text-slate-500">Sender</span>
                                    </div>
                                    <div className="flex-1 relative flex items-center justify-center">
                                        <div className="w-full h-1 bg-indigo-500 relative">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 border-t-2 border-r-2 border-indigo-500 rotate-45 transform origin-center translate-x-[2px]"></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold mb-2">B</div>
                                        <span className="text-xs font-semibold text-slate-500">Receiver</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-md font-semibold text-slate-600">📻 Radio</span>
                                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-md font-semibold text-slate-600">📺 TV</span>
                                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-md font-semibold text-slate-600">🎛️ Remote</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Half Duplex */}
                        <div className="rounded-2xl p-5 my-5" style={{ background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', border: '1px solid #5eead4' }}>
                            <h4 className="font-bold text-teal-800 mb-2">🔴 2. Half-Duplex Mode</h4>
                            <p className="text-sm text-teal-900 mb-4">Half-duplex mode me <strong>dono directions me communication possible</strong> hota hai, lekin ek samay par <strong>sirf ek direction me</strong> communication hota hai. (Semi-duplex)</p>
                            
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-200 flex flex-col items-center">
                                <div className="flex items-center gap-4 w-full max-w-sm justify-between">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold mb-2">A</div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="w-full h-1 bg-teal-500 relative">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-teal-500 rotate-45 transform origin-center translate-x-[2px]"></div>
                                        </div>
                                        <div className="w-full h-1 bg-slate-300 relative border-b border-dashed border-slate-400">
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 border-b-2 border-l-2 border-slate-400 rotate-45 transform origin-center translate-x-[-2px]"></div>
                                        </div>
                                        <span className="text-[10px] text-center text-teal-700 font-bold">One direction at a time</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold mb-2">B</div>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <span className="text-xs px-2 py-1 bg-teal-50 rounded-md font-semibold text-teal-700">📻 Walkie-Talkie</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Full Duplex */}
                        <div className="rounded-2xl p-5 my-5" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #bfdbfe' }}>
                            <h4 className="font-bold text-blue-800 mb-2">🔴 3. Full-Duplex Mode</h4>
                            <p className="text-sm text-blue-900 mb-4">Full-duplex mode me dono devices <strong>ek hi samay par</strong> data send aur receive kar sakte hain. Ye sabse fast communication mode hota hai.</p>
                            
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 flex flex-col items-center">
                                <div className="flex items-center gap-4 w-full max-w-sm justify-between">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mb-2">A</div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="w-full h-1 bg-blue-500 relative">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-blue-500 rotate-45 transform origin-center translate-x-[2px]"></div>
                                        </div>
                                        <div className="w-full h-1 bg-blue-500 relative">
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 border-b-2 border-l-2 border-blue-500 rotate-45 transform origin-center translate-x-[-2px]"></div>
                                        </div>
                                        <span className="text-[10px] text-center text-blue-600 font-bold">Simultaneously</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mb-2">B</div>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <span className="text-xs px-2 py-1 bg-blue-50 rounded-md font-semibold text-blue-700">📱 Mobile Phone</span>
                                    <span className="text-xs px-2 py-1 bg-blue-50 rounded-md font-semibold text-blue-700">💻 Internet</span>
                                </div>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Transmission Media ═══ */}
                    <Sec id="transmission-media" title="🔹 Transmission Media" icon={<Zap size={16} className="text-emerald-500" />}>
                        <Def>🌐 <strong>Transmission media</strong> ek communication path hota hai jiske through data ek device se doosri device tak transfer kiya jata hai.</Def>
                        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 my-4">
                            <p className="text-emerald-800 font-medium">Simple words me: <strong className="text-emerald-900">“Transmission media = data travel karne ka medium”</strong></p>
                        </div>
                        <p>Jab bhi do devices aapas me communicate karte hain to data kisi na kisi medium ke through transmit hota hai. Ye medium <strong>wired</strong> bhi ho sakta hai aur <strong>wireless</strong> bhi.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                            <div className="p-5 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-sky-100/50 hover:shadow-md transition-all">
                                <div className="text-sky-500 mb-2"><Zap size={24} /></div>
                                <h4 className="font-bold text-sky-800 text-lg mb-1">1. Guided Media</h4>
                                <p className="text-sm text-sky-700">Wired media jisme data physical cables ke through transfer hota hai.</p>
                            </div>
                            <div className="p-5 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-md transition-all">
                                <div className="text-purple-500 mb-2"><Wifi size={24} /></div>
                                <h4 className="font-bold text-purple-800 text-lg mb-1">2. Unguided Media</h4>
                                <p className="text-sm text-purple-700">Wireless media jisme data hawa (air) me electromagnetic waves ke form me transfer hota hai.</p>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Guided Media ═══ */}
                    <Sec id="guided-media" title="🔴 1. Guided Media (Wired Transmission Media)" icon={<Zap size={16} className="text-sky-500" />}>
                        <p>Guided media me devices ke beech <strong>physical connection</strong> hota hai. Yani data cables ya wires ke through transmit hota hai. Isme signals ek fixed path follow karte hain.</p>
                        
                        <div className="flex flex-wrap gap-2 my-3">
                            {['🔒 High security', '✅ Stable communication', '⚡ Fast data transfer', '🔇 Noise kam hota hai'].map((f, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-lg bg-white text-sky-800 text-xs font-bold border border-sky-200 shadow-sm">{f}</span>
                            ))}
                        </div>

                        {/* Twisted Pair Cable */}
                        <div className="mt-8 mb-6 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1">
                                    <h4 className="font-black text-gray-800 text-xl mb-2 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs">1</span> Twisted Pair Cable</h4>
                                    <p className="text-sm text-gray-600 mb-3">Ye data transmission ka sabse common aur sasta medium hota hai. Isme do copper wires hoti hain jinko plastic cover se insulated kiya jata hai aur dono wires ko aapas me <strong>twist kiya jata hai</strong>.</p>
                                    <IB type="tip">Twisting ka main purpose <strong>noise aur interference ko kam karna</strong> hota hai.</IB>
                                    
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <h5 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Features</h5>
                                            <ul className="space-y-1 text-sm text-gray-700">
                                                <li>✔️ Low cost</li>
                                                <li>✔️ Easy installation</li>
                                                <li>✔️ Flexible cable</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Uses</h5>
                                            <ul className="space-y-1 text-sm text-gray-700">
                                                <li>📞 Telephone lines</li>
                                                <li>💻 LAN network</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 flex justify-center">
                                    <img src="/sample-assets/placeholder.svg" alt="Twisted Pair Cable" className="w-full max-w-[220px] rounded-xl shadow-md border border-gray-200 object-cover" />
                                </div>
                            </div>
                        </div>

                        {/* Coaxial Cable */}
                        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm">
                            <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
                                <div className="flex-1">
                                    <h4 className="font-black text-gray-800 text-xl mb-2 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-orange-700 text-white flex items-center justify-center text-xs">2</span> Coaxial Cable</h4>
                                    <p className="text-sm text-gray-600 mb-3">Iska use heavy signals aur video signals ko transmit karne ke liye kiya jata hai. Jahan twisted pair proper signal transfer nahi kar pati, wahan coaxial cable use hoti hai.</p>
                                    
                                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 mb-4 text-sm text-orange-900">
                                        <strong className="block mb-1">Structure:</strong>
                                        <span className="inline-block mr-3">1. Center copper wire</span>
                                        <span className="inline-block mr-3">2. Plastic insulation</span>
                                        <span className="inline-block mr-3">3. Metallic shield</span>
                                        <span className="inline-block">4. Outer plastic cover</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h5 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Features</h5>
                                            <ul className="space-y-1 text-sm text-gray-700">
                                                <li>✔️ Better signal quality</li>
                                                <li>✔️ Long distance</li>
                                                <li>✔️ Noise resistance</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Uses</h5>
                                            <ul className="space-y-1 text-sm text-gray-700">
                                                <li>📺 Cable TV network</li>
                                                <li>🌐 Internet connection</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 flex justify-center">
                                    <img src="/sample-assets/placeholder.svg" alt="Coaxial Cable" className="w-full max-w-[220px] rounded-xl shadow-md border border-gray-200 object-cover" />
                                </div>
                            </div>
                        </div>

                        {/* Fiber Optics Cable */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1">
                                    <h4 className="font-black text-gray-800 text-xl mb-2 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-cyan-700 text-white flex items-center justify-center text-xs">3</span> Fiber Optics Cable</h4>
                                    <p className="text-sm text-gray-600 mb-3">Ye <strong>sabse fast</strong> transmission medium mana jata hai. Is cable me digital data ko light signals ke form me transmit kiya jata hai (Electrical signal ki jagah light ka use).</p>
                                    
                                    <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-100 mb-4">
                                        <div className="flex items-center gap-2 text-sm font-bold text-cyan-800">
                                            <span>Light Source</span> <ChevronRight size={14} /> <span>Fiber Tube</span> <ChevronRight size={14} /> <span>Detector</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h5 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Features</h5>
                                            <ul className="space-y-1 text-sm text-gray-700">
                                                <li>🚀 Very high speed</li>
                                                <li>🌍 Long distance</li>
                                                <li>🔒 Secure & No EMI</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Uses</h5>
                                            <ul className="space-y-1 text-sm text-gray-700">
                                                <li>🌐 Internet backbone</li>
                                                <li>📡 Telecom networks</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 flex justify-center">
                                    <img src="/sample-assets/placeholder.svg" alt="Fiber Optics Cable" className="w-full max-w-[220px] rounded-xl shadow-md border border-gray-200 object-cover" />
                                </div>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Unguided Media ═══ */}
                    <Sec id="unguided-media" title="🔴 2. Unguided Media (Wireless Transmission Media)" icon={<Wifi size={16} className="text-purple-500" />}>
                        <p>Unguided media me devices ke beech <strong>koi physical connection nahi hota</strong>. Isme data air ke through electromagnetic waves ke form me transfer hota hai.</p>
                        
                        <div className="flex flex-wrap gap-2 my-3">
                            {['📶 No physical cable', '📱 Mobility support', '🌍 Large area coverage', '⚡ Easy communication'].map((f, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-lg bg-white text-purple-800 text-xs font-bold border border-purple-200 shadow-sm">{f}</span>
                            ))}
                        </div>

                        {/* Radio Waves */}
                        <div className="mt-8 mb-6 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1">
                                    <h4 className="font-black text-gray-800 text-xl mb-2 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">1</span> Radio Waves</h4>
                                    <p className="text-sm text-gray-600 mb-2">Radio waves ko generate karna aur use karna bahut easy hota hai. Ye long distance communication ke liye use hoti hain aur <strong>objects ke through bhi travel kar sakti hain</strong>.</p>
                                    <p className="text-xs font-bold text-indigo-600 mb-4">Range: 3 KHz – 300 GHz</p>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h5 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Features</h5>
                                            <ul className="space-y-1 text-sm text-gray-700">
                                                <li>✔️ Long distance</li>
                                                <li>✔️ Omnidirectional</li>
                                                <li>✔️ Large coverage</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Uses</h5>
                                            <ul className="space-y-1 text-sm text-gray-700">
                                                <li>📻 Radio communication</li>
                                                <li>📺 TV broadcasting</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 flex justify-center">
                                    <img src="/sample-assets/placeholder.svg" alt="Radio Waves" className="w-full max-w-[220px] rounded-xl shadow-md border border-gray-200 object-cover" />
                                </div>
                            </div>
                        </div>

                        {/* Microwave */}
                        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm">
                            <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
                                <div className="flex-1">
                                    <h4 className="font-black text-gray-800 text-xl mb-2 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-pink-700 text-white flex items-center justify-center text-xs">2</span> Microwave</h4>
                                    <p className="text-sm text-gray-600 mb-3">Microwave waves mainly long distance communication ke liye use hoti hain. Ye <strong>direct line-of-sight communication</strong> follow karti hain, isliye towers ko face-to-face hona zaruri hai.</p>
                                    <IB type="note">Inki wavelength 1 meter se 1 millimeter ke beech hoti hai.</IB>
                                    
                                    <div className="mt-4">
                                        <h5 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Uses</h5>
                                        <div className="flex gap-2">
                                            <span className="text-xs px-2 py-1 bg-pink-50 text-pink-700 rounded-md font-semibold border border-pink-100">📡 Satellite</span>
                                            <span className="text-xs px-2 py-1 bg-pink-50 text-pink-700 rounded-md font-semibold border border-pink-100">📱 Mobile Comm.</span>
                                            <span className="text-xs px-2 py-1 bg-pink-50 text-pink-700 rounded-md font-semibold border border-pink-100">🛰️ Radar Systems</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 flex justify-center">
                                    <img src="/sample-assets/placeholder.svg" alt="Microwave Communication" className="w-full max-w-[220px] rounded-xl shadow-md border border-gray-200 object-cover" />
                                </div>
                            </div>
                        </div>

                        {/* Infrared Waves */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1">
                                    <h4 className="font-black text-gray-800 text-xl mb-2 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center text-xs">3</span> Infrared Waves</h4>
                                    <p className="text-sm text-gray-600 mb-3">Infrared waves ka use <strong>short-range communication</strong> ke liye kiya jata hai. Ye waves solid objects (jaise walls) ke through pass nahi ho sakti.</p>
                                    
                                    <div className="mt-4">
                                        <h5 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Uses</h5>
                                        <div className="flex gap-2">
                                            <span className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-md font-semibold border border-red-100">🎛️ TV Remote</span>
                                            <span className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-md font-semibold border border-red-100">📶 Short-range Wireless</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 flex justify-center">
                                    <img src="/sample-assets/placeholder.svg" alt="Infrared Waves" className="w-full max-w-[220px] rounded-xl shadow-md border border-gray-200 object-cover" />
                                </div>
                            </div>
                        </div>
                    </Sec>

                </main>
            </div>
        </div>
    );
}
