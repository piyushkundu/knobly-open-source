'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Menu, X, ChevronRight, Hash, Sparkles, Cpu, Activity, Zap, Eye, Sun, Thermometer, Radio, Lightbulb, Move, Gauge, Waves, Hand, Flame, Droplets, Wind, Volume2, Settings, Cog, ArrowRight, Microchip, CircuitBoard, GitCompare, BatteryLow, Clock, Binary, Box, HardDrive, Server } from 'lucide-react';

function Sec({ id, title, icon, children }: { id: string; title: string; icon: ReactNode; children: ReactNode }) {
    return (
        <section id={id} className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg bg-white" style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>{icon}<h2 className="text-base md:text-lg font-extrabold text-gray-800">{title}</h2></div>
            <div className="text-sm leading-relaxed space-y-3 text-gray-600">{children}</div>
        </section>
    );
}

function Def({ children }: { children: ReactNode }) {
    return <div className="rounded-xl p-4 my-3 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fed7aa', color: '#c2410c' }}>{children}</div>;
}

function IB({ type = 'tip', children }: { type?: 'tip' | 'note' | 'warning'; children: ReactNode }) {
    const s: Record<string, { bg: string; bc: string; tc: string; emoji: string }> = { tip: { bg: '#ecfeff', bc: '#67e8f9', tc: '#0e7490', emoji: '💡' }, note: { bg: '#eff6ff', bc: '#93c5fd', tc: '#1e40af', emoji: '📝' }, warning: { bg: '#fefce8', bc: '#fde047', tc: '#854d0e', emoji: '⚠️' } };
    const st = s[type];
    return <div className="rounded-xl p-3.5 text-xs font-medium my-3" style={{ background: st.bg, border: `1px solid ${st.bc}`, color: st.tc }}>{st.emoji} {children}</div>;
}

const tocItems = [
    { icon: <Zap size={13} />, label: 'Transducer', id: 'transducer', color: '#8b5cf6' },
    { icon: <Eye size={13} />, label: 'Sensor', id: 'sensor', color: '#06b6d4' },
    { icon: <Sun size={13} />, label: 'LDR Example', id: 'ldr', color: '#f59e0b' },
    { icon: <Cpu size={13} />, label: 'Types of Sensors', id: 'types-of-sensors', color: '#ef4444' },
    { icon: <Settings size={13} />, label: 'Actuator', id: 'actuator', color: '#10b981' },
    { icon: <Cog size={13} />, label: 'Types of Actuators', id: 'types-of-actuators', color: '#8b5cf6' },
    { icon: <Cpu size={13} />, label: 'Microcontroller', id: 'microcontroller', color: '#0ea5e9' },
    { icon: <Zap size={13} />, label: 'Features', id: 'mc-features', color: '#f97316' },
    { icon: <GitCompare size={13} />, label: 'Types of MC', id: 'mc-types', color: '#ec4899' },
    { icon: <Activity size={13} />, label: 'MC vs MP', id: 'mc-vs-mp', color: '#ef4444' },
    { icon: <Microchip size={13} />, label: 'MC Brands', id: 'mc-technologies', color: '#6366f1' },
    { icon: <CircuitBoard size={13} />, label: 'Elements', id: 'mc-elements', color: '#14b8a6' },
];

export default function IoTSensors() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('transducer');

    return (
        <div className="min-h-screen bg-white text-slate-800 relative">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-amber-50/30" />
            </div>

            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/iot" className="flex items-center justify-center w-9 h-9 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}><ArrowLeft size={16} /></Link>
                        <div>
                            <h1 className="text-sm font-extrabold text-gray-800">Sensors, Actuators & Microcontrollers</h1>
                            <div className="flex items-center gap-1.5"><Sparkles size={8} className="text-orange-500" /><span className="text-[9px] uppercase tracking-[0.18em] font-bold text-orange-500">Chapter 3</span></div>
                        </div>
                    </div>
                    <button onClick={() => setTocOpen(!tocOpen)} className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 border border-gray-200">
                        {tocOpen ? <X size={18} className="text-orange-500" /> : <Menu size={18} className="text-orange-500" />}
                    </button>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, #ef4444, #f97316)' }} />
            </header>

            <div className="max-w-7xl mx-auto flex relative">
                <aside className={`${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[52px] left-0 z-40 lg:z-10 w-64 lg:w-56 xl:w-64 h-[calc(100vh-52px)] overflow-y-auto transition-transform duration-300 lg:flex-shrink-0 bg-white/95 backdrop-blur-xl`} style={{ borderRight: '1px solid #e2e8f0' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}><Hash size={12} className="text-white" /></div>
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
                    <section className="relative rounded-3xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 30%, #f59e0b 60%, #eab308 100%)', boxShadow: '0 8px 32px rgba(249,115,22,0.25)' }}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)' }} />
                        </div>
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
                                <Sparkles size={10} /> Chapter 3 — O-Level M4-R5
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black mb-3 text-white" style={{ lineHeight: '1.2' }}>Sensors, Actuators and Microcontrollers</h2>
                            <p className="text-sm md:text-base max-w-2xl mb-5 text-white/85">Real-world data collect karne aur devices ko control karne ke liye use hone wale components ke baare mein seekhiye.</p>
                        </div>
                    </section>

                    {/* ═══ SECTION: Transducer ═══ */}
                    <Sec id="transducer" title="🔹 Transducer" icon={<Zap size={16} className="text-purple-500" />}>
                        <Def>⚡ <strong>Transducer</strong> ek electronic device hoti hai jo energy ko ek form se doosre form me convert karti hai.</Def>
                        <p>Yani agar kisi system me <strong>mechanical, electrical, light, chemical, thermal ya electromagnetic</strong> energy ko kisi doosri energy me badla jaye to us process me transducer ka use hota hai.</p>

                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 my-4">
                            <p className="text-sm text-purple-900 font-semibold text-center mb-2">Transducer ka main kaam:</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <span className="px-4 py-2 bg-white rounded-lg border border-purple-200 text-purple-700 shadow-sm font-bold text-xs">📥 Input Energy Receive karna</span>
                                <ChevronRight className="text-purple-400 rotate-90 sm:rotate-0" />
                                <span className="px-4 py-2 bg-purple-600 rounded-lg text-white shadow-md font-bold text-xs">🔄 Convert</span>
                                <ChevronRight className="text-purple-400 rotate-90 sm:rotate-0" />
                                <span className="px-4 py-2 bg-white rounded-lg border border-purple-200 text-purple-700 shadow-sm font-bold text-xs">📤 Output Energy Produce karna</span>
                            </div>
                        </div>

                        <h4 className="font-bold text-gray-800 mt-6 mb-4 flex items-center gap-2">🌟 Examples of Transducer</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl mb-3 shadow-sm border border-yellow-100">☀️</div>
                                <h5 className="font-bold text-yellow-800 mb-1">Solar Cell</h5>
                                <p className="text-xs text-yellow-700">Light energy ko electrical energy me convert karta hai.</p>
                            </div>
                            <div className="p-4 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl mb-3 shadow-sm border border-blue-100">⚙️</div>
                                <h5 className="font-bold text-blue-800 mb-1">Motor</h5>
                                <p className="text-xs text-blue-700">Electrical energy ko mechanical motion me convert karti hai.</p>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Sensor ═══ */}
                    <Sec id="sensor" title="🔹 Sensor" icon={<Eye size={16} className="text-cyan-500" />}>
                        <Def>👁️ <strong>Sensor</strong> shabd ka arth hota hai "sense karna" ya "feel karna".</Def>
                        <p>Sensor ek aisa device hota hai jo environment se <strong>input data collect karta hai</strong> aur usse readable form me display karta hai. Ye environment me hone wale changes ko detect karta hai.</p>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-5">
                            {['🏃 Velocity', '⏱️ Pressure', '🌡️ Temperature', '💡 Light', '🚶 Motion'].map((c, i) => (
                                <div key={i} className="px-2 py-3 rounded-xl bg-cyan-50 border border-cyan-100 text-center shadow-sm hover:bg-cyan-100 transition-colors">
                                    <span className="text-xs font-bold text-cyan-800">{c}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 mt-5">
                            <p className="text-sm text-slate-700 mb-3">Sensor physical quantity ko <strong>electrical signal</strong> me convert karta hai taaki system us data ko process kar sake.</p>
                            <p className="text-sm text-slate-700 mb-3">Sensor ka output signal human readable form me display kiya ja sakta hai ya kisi controller/system ko bheja ja sakta hai.</p>
                            <IB type="tip">IoT systems me sensors bahut important role nibhate hain kyunki bina sensors ke real-world data collect karna possible nahi hota.</IB>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: LDR Example ═══ */}
                    <Sec id="ldr" title="🔹 Example of Sensor – LDR" icon={<Sun size={16} className="text-amber-500" />}>
                        <p><strong>LDR (Light Dependent Resistor)</strong> ek light sensor hota hai jiska resistance light ke according change hota hai.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 text-white flex flex-col items-center justify-center text-center shadow-md">
                                <div className="text-4xl mb-3 opacity-50">🌑</div>
                                <h5 className="font-bold text-slate-200 mb-1">Jab Light Kam Hoti Hai</h5>
                                <p className="text-sm font-semibold text-amber-400 mt-2 bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-600">📈 Resistance Badh Jata Hai</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex flex-col items-center justify-center text-center shadow-md">
                                <div className="text-4xl mb-3">☀️</div>
                                <h5 className="font-bold text-amber-800 mb-1">Jab Light Jyada Hoti Hai</h5>
                                <p className="text-sm font-semibold text-emerald-700 mt-2 bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">📉 Resistance Kam Ho Jata Hai</p>
                            </div>
                        </div>

                        <div className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-100 text-center">
                            <p className="text-sm font-bold text-amber-800">👉 Isi wajah se LDR ko light sensor kaha jata hai.</p>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Types of Sensors ═══ */}
                    <Sec id="types-of-sensors" title="🔴 Types of Sensors" icon={<Cpu size={16} className="text-red-500" />}>
                        <p className="mb-4">Sensors alag-alag physical quantities ko detect aur measure karne ke liye use kiye jate hain. Har sensor ka apna specific kaam hota hai aur ye environment ke different parameters ko monitor karta hai.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* 1. Temperature Sensor */}
                            <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors"><Thermometer size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">1. Temperature Sensor</h4>
                                        <p className="text-xs text-gray-500">Measures temperature changes</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Temperature sensor kisi bhi vastu ya environment ke temperature ko measure karta hai. Ye changes ko detect karke electrical signal generate karta hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Temperature Sensor" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Examples:</strong> LM35, Thermocouple, Thermometer</p>
                                    <p><strong>Uses:</strong> AC system, Refrigerator, Weather monitoring</p>
                                </div>
                            </div>

                            {/* 2. Proximity Sensor */}
                            <div className="p-5 rounded-2xl bg-white border border-indigo-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-colors"><Radio size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">2. Proximity Sensor</h4>
                                        <p className="text-xs text-gray-500">Detects object presence without touch</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Proximity sensor kisi object ki presence ya distance ko bina touch kiye detect karta hai. Ye nearby object ka pata bahut aasani se laga leta hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Proximity Sensor" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Types:</strong> Inductive, Capacitive, Magnetic</p>
                                    <p><strong>Uses:</strong> Smartphone screen control, Robot navigation</p>
                                </div>
                            </div>

                            {/* 3. Infrared Sensor */}
                            <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-pink-50 text-pink-500 rounded-xl group-hover:bg-pink-500 group-hover:text-white transition-colors"><Zap size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">3. Infrared (IR) Sensor</h4>
                                        <p className="text-xs text-gray-500">Uses IR rays for detection</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Ise IR blaster ya remote sensor bhi kaha jata hai. Isme Transmitter aur Receiver hote hain. Jab light reflect hokar wapas aati hai to object detect hota hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="IR Sensor" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Types:</strong> Reflective Type, Transmissive Type</p>
                                    <p><strong>Uses:</strong> TV remote, Automatic door system, Obstacle detection</p>
                                </div>
                            </div>

                            {/* 4. Light Sensor */}
                            <div className="p-5 rounded-2xl bg-white border border-yellow-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-yellow-50 text-yellow-500 rounded-xl group-hover:bg-yellow-500 group-hover:text-white transition-colors"><Lightbulb size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">4. Light Sensor</h4>
                                        <p className="text-xs text-gray-500">Converts light energy to electrical signal</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Light sensor ek photo-electric device hota hai. Ye light intensity ko detect karta hai aur uske according output signal generate karta hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Light Sensor" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Examples:</strong> Photo diode, Photo resistor, Photo transistor</p>
                                    <p><strong>Uses:</strong> Mobile brightness, Street lights, Security systems</p>
                                </div>
                            </div>

                            {/* 5. Accelerometer Sensor */}
                            <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors"><Move size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">5. Accelerometer Sensor</h4>
                                        <p className="text-xs text-gray-500">Measures motion and direction</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Accelerometer kisi moving device ki speed, motion aur direction ko measure karta hai. Ye acceleration detect karta hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Accelerometer" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Example:</strong> Mobile rotate karne par screen rotate hona.</p>
                                    <p><strong>Uses:</strong> Smartphones, Robots, Aircraft, Rotating devices</p>
                                </div>
                            </div>

                            {/* 6. Pressure Sensor */}
                            <div className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors"><Gauge size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">6. Pressure Sensor</h4>
                                        <p className="text-xs text-gray-500">Detects pressure levels</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Pressure sensor pressure ko detect karta hai aur usse electrical signal me convert karta hai. Ye controller ko information deta hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Pressure Sensor" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Examples:</strong> Pressure transmitter, Piezometer</p>
                                    <p><strong>Uses:</strong> Pneumatic system, Hydraulic system, Vacuum system</p>
                                </div>
                            </div>

                            {/* 7. Ultrasonic Sensor */}
                            <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-sky-50 text-sky-500 rounded-xl group-hover:bg-sky-500 group-hover:text-white transition-colors"><Waves size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">7. Ultrasonic Sensor</h4>
                                        <p className="text-xs text-gray-500">Uses sound waves for distance</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Ye ultrasonic sound waves ka use karke object ki distance aur velocity measure karta hai. Reflected waves detect hoti hain.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Ultrasonic Sensor" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Working:</strong> Transmit waves → Hit object → Return → Detect → Calculate</p>
                                    <p><strong>Uses:</strong> Self-driving robots, Distance measurement</p>
                                </div>
                            </div>

                            {/* 8. Touch Sensor */}
                            <div className="p-5 rounded-2xl bg-white border border-rose-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-rose-50 text-rose-500 rounded-xl group-hover:bg-rose-500 group-hover:text-white transition-colors"><Hand size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">8. Touch Sensor</h4>
                                        <p className="text-xs text-gray-500">Tactile human touch detection</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Touch sensor ko tactile sensor bhi kaha jata hai. Ye human touch ko detect karta hai aur uske according signal generate karta hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Touch Sensor" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Uses:</strong> Light switch, Remote control, Laptop touchpad, Smartphone screen</p>
                                </div>
                            </div>

                            {/* 9. Smoke and Gas Sensor */}
                            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-slate-500 group-hover:text-white transition-colors"><Flame size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">9. Smoke & Gas Sensor</h4>
                                        <p className="text-xs text-gray-500">Detects harmful gases and smoke</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Smoke aur gas sensor harmful gases aur smoke ko detect karne ke liye use hota hai. Ye security systems me important role nibhata hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Smoke Sensor" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Types:</strong> Hydrogen sensor, CO sensor, Air pollution sensor</p>
                                    <p><strong>Uses:</strong> Building security, Airplane safety, Industry safety</p>
                                </div>
                            </div>

                            {/* 10. Humidity Sensor */}
                            <div className="p-5 rounded-2xl bg-white border border-cyan-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-cyan-50 text-cyan-500 rounded-xl group-hover:bg-cyan-500 group-hover:text-white transition-colors"><Droplets size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">10. Humidity Sensor</h4>
                                        <p className="text-xs text-gray-500">Measures moisture/water vapor</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Humidity sensor environment me moisture ya water vapor ki quantity ko measure karta hai. Ye temperature dono ko monitor karta hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Humidity Sensor" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Examples:</strong> DHT11, DHT22, AM2302</p>
                                    <p><strong>Uses:</strong> AC systems, Weather monitoring, Agriculture</p>
                                </div>
                            </div>

                            {/* 11. Flow Sensor */}
                            <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors"><Wind size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">11. Flow Sensor</h4>
                                        <p className="text-xs text-gray-500">Measures liquid or gas flow rate</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Flow sensor kisi liquid ya gas ke flow rate ko measure karta hai. Isme magnetic device aur switch liquid movement ko detect karte hain.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Flow Sensor" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Uses:</strong> Water control devices, Oil industry, Power plants</p>
                                </div>
                            </div>

                            {/* 12. Sound Sensor */}
                            <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-purple-50 text-purple-500 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors"><Volume2 size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">12. Sound Sensor</h4>
                                        <p className="text-xs text-gray-500">Detects sound waves</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Sound sensor sound waves ko detect karta hai aur unhe electrical signals me convert karta hai. Ye microphone ki tarah kaam karta hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Sound Sensor" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Uses:</strong> Security system, Home automation, Smart phone, Audio amplifier</p>
                                </div>
                            </div>

                        </div>
                    </Sec>

                    {/* ═══ SECTION: Actuator ═══ */}
                    <Sec id="actuator" title="🔹 Actuator" icon={<Settings size={16} className="text-emerald-500" />}>
                        <Def>⚙️ <strong>Actuator</strong> ek machine component ya device hota hai jo kisi system ki movement ya mechanism ko control karta hai.</Def>
                        <p>Ye control signal aur power source ki help se kaam karta hai. Jab actuator ko <strong>electrical signal</strong> milta hai to ye us signal ko <strong>physical movement</strong> me convert kar deta hai.</p>

                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 my-4 text-center">
                            <p className="text-sm font-bold text-emerald-800">👉 &quot;Actuator signal ko motion me convert karta hai&quot;</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 my-5">
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">🔹 Working of Actuator</h4>
                                <div className="space-y-2">
                                    {['Controller actuator ko signal bhejta hai', 'Actuator signal receive karta hai', 'Signal ko motion ya force me convert karta hai', 'Machine ya device movement perform karti hai'].map((step, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                                            <span className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                                            <span className="text-xs font-medium text-emerald-800">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full sm:w-36 flex-shrink-0 flex justify-center items-center">
                                <img src="/sample-assets/placeholder.svg" alt="Actuator" className="w-32 h-32 object-contain" />
                            </div>
                        </div>

                        <h4 className="font-bold text-gray-800 mt-6 mb-3 flex items-center gap-2">🔹 Power Sources of Actuator</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-center hover:shadow-md transition-shadow">
                                <div className="text-2xl mb-2">⚡</div>
                                <p className="text-xs font-bold text-blue-800">Electric voltage/current</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 text-center hover:shadow-md transition-shadow">
                                <div className="text-2xl mb-2">💧</div>
                                <p className="text-xs font-bold text-teal-800">Hydraulic pressure</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 text-center hover:shadow-md transition-shadow">
                                <div className="text-2xl mb-2">💨</div>
                                <p className="text-xs font-bold text-sky-800">Pneumatic pressure</p>
                            </div>
                        </div>

                        <h4 className="font-bold text-gray-800 mt-6 mb-3 flex items-center gap-2">🔹 Applications of Actuator</h4>
                        <p className="mb-3">Actuator ka use industries aur automation systems me bahut jyada hota hai. Ye systems me <strong>motion control</strong> provide karta hai.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {['⚡ Electric motor', '🔌 Relay', '💧 Hydraulic piston', '🔧 Solenoid valve', '🤖 Robotics system', '🏭 Industrial automation'].map((item, i) => (
                                <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                                    <span className="text-xs font-bold text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Types of Actuators ═══ */}
                    <Sec id="types-of-actuators" title="🔴 Types of Actuators" icon={<Cog size={16} className="text-purple-500" />}>
                        <p className="mb-3">Actuators ko <strong>motion</strong> aur <strong>power source</strong> ke basis par divide kiya jata hai.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                                <h5 className="font-bold text-purple-800 mb-2 text-sm">🔹 According to Type of Motion</h5>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-purple-700">• Linear Actuator</p>
                                    <p className="text-xs font-medium text-purple-700">• Rotary Actuator</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                                <h5 className="font-bold text-orange-800 mb-2 text-sm">🔹 According to Type of Power</h5>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-orange-700">• Hydraulic Actuator</p>
                                    <p className="text-xs font-medium text-orange-700">• Pneumatic Actuator</p>
                                    <p className="text-xs font-medium text-orange-700">• Electrical Actuator</p>
                                    <p className="text-xs font-medium text-orange-700">• Mechanical Actuator</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* 1. Linear Actuator */}
                            <div className="p-5 rounded-2xl bg-white border border-orange-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors"><ArrowRight size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">1. Linear Actuator</h4>
                                        <p className="text-xs text-gray-500">Converts energy to straight-line motion</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Linear actuator energy ko <strong>straight-line motion</strong> me convert karta hai. Ye <strong>push aur pull</strong> function perform karta hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Linear Actuator" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Uses:</strong> Positioning applications, Sliding systems, Automation devices</p>
                                    <p><strong>Example:</strong> Linear motor</p>
                                </div>
                            </div>

                            {/* 2. Rotary Actuator */}
                            <div className="p-5 rounded-2xl bg-white border border-teal-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-teal-50 text-teal-500 rounded-xl group-hover:bg-teal-500 group-hover:text-white transition-colors"><Cog size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">2. Rotary Actuator</h4>
                                        <p className="text-xs text-gray-500">Converts energy to rotational motion</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Rotary actuator energy ko <strong>rotational motion</strong> me convert karta hai. Ye <strong>circular movement</strong> produce karta hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Rotary Actuator" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Examples:</strong> AC motor, DC motor</p>
                                </div>
                            </div>

                            {/* 3. Hydraulic Actuator */}
                            <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors"><Droplets size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">3. Hydraulic Actuator</h4>
                                        <p className="text-xs text-gray-500">Uses hydraulic fluid pressure</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Hydraulic actuator <strong>hydraulic fluid aur pressure</strong> ki help se mechanical movement produce karta hai. Isme cylinder aur motor ka use hota hai. Ye linear, rotary aur oscillatory motion generate kar sakta hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Hydraulic Actuator" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Features:</strong> Heavy load handle kar sakta hai, High force produce karta hai</p>
                                    <p><strong>Uses:</strong> Construction equipment, Industrial machines</p>
                                </div>
                            </div>

                            {/* 4. Pneumatic Actuator */}
                            <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-sky-50 text-sky-500 rounded-xl group-hover:bg-sky-500 group-hover:text-white transition-colors"><Wind size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">4. Pneumatic Actuator</h4>
                                        <p className="text-xs text-gray-500">Uses compressed air pressure</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Pneumatic actuator <strong>compressed air ya vacuum pressure</strong> par kaam karta hai. Ye air pressure ko motion me convert karta hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Pneumatic Actuator" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Features:</strong> Fast response, Clean operation, Low maintenance</p>
                                    <p><strong>Uses:</strong> Robotics, Automation systems, Air control systems</p>
                                </div>
                            </div>

                            {/* 5. Electrical Actuator */}
                            <div className="p-5 rounded-2xl bg-white border border-violet-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-violet-50 text-violet-500 rounded-xl group-hover:bg-violet-500 group-hover:text-white transition-colors"><Zap size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">5. Electrical Actuator</h4>
                                        <p className="text-xs text-gray-500">Converts electrical to mechanical energy</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Electrical actuator <strong>electrical energy ko mechanical energy</strong> me convert karta hai. Ye sabse common actuator hota hai aur AC ya DC current se kaam karta hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Electrical Actuator" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Features:</strong> Easy control, High efficiency, Simple technology</p>
                                    <p><strong>Example:</strong> Solenoid valve</p>
                                </div>
                            </div>

                            {/* 6. Mechanical Actuator */}
                            <div className="p-5 rounded-2xl bg-white border border-amber-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-amber-50 text-amber-500 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors"><Settings size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">6. Mechanical Actuator</h4>
                                        <p className="text-xs text-gray-500">Converts rotary to linear motion</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                    <div className="flex-1 text-sm text-gray-600">
                                        <p>Mechanical actuator <strong>rotary motion ko linear motion</strong> me convert karta hai. Ye purely <strong>mechanical mechanism</strong> par based hota hai.</p>
                                    </div>
                                    <div className="w-full sm:w-28 flex-shrink-0 flex justify-center items-center">
                                        <img src="/sample-assets/placeholder.svg" alt="Mechanical Actuator" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 border border-gray-100">
                                    <p><strong>Examples:</strong> Chain block, Hoisting system, Jack system</p>
                                </div>
                            </div>

                        </div>
                    </Sec>

                    {/* ═══ SECTION: Microcontroller ═══ */}
                    <Sec id="microcontroller" title="🔴 Microcontroller" icon={<Cpu size={16} className="text-sky-500" />}>
                        <Def>🔲 <strong>Microcontroller</strong> ek embedded system ko control karne ke liye design kiya gaya programmable IC (Integrated Circuit) device hota hai.</Def>
                        <p>Ye ek <strong>small computer</strong> ki tarah kaam karta hai jiske andar processor, memory aur input-output peripherals ek hi chip me available hote hain.</p>
                        <p className="mt-2">Microcontroller ka use <strong>electronic systems aur automated devices</strong> ko control karne ke liye kiya jata hai.</p>

                        <div className="flex flex-col sm:flex-row gap-5 my-5">
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">🔹 Working of Microcontroller</h4>
                                <p className="text-sm text-gray-600 mb-3">Microcontroller input devices se data receive karta hai, us data ko process karta hai aur output devices ko control karta hai.</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {['🧠 Processor', '💾 Memory', '📦 RAM', '📀 ROM', '🔌 I/O Ports', '📡 Serial Ports'].map((item, i) => (
                                        <div key={i} className="p-2.5 rounded-lg bg-sky-50 border border-sky-100 text-center">
                                            <span className="text-xs font-bold text-sky-800">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full sm:w-36 flex-shrink-0 flex justify-center items-center">
                                <img src="/sample-assets/placeholder.svg" alt="Microcontroller" className="w-32 h-32 object-contain" />
                            </div>
                        </div>

                        <h4 className="font-bold text-gray-800 mt-6 mb-3 flex items-center gap-2">🔹 Uses of Microcontroller</h4>
                        <p className="mb-3">Microcontroller ka use different <strong>embedded systems</strong> me kiya jata hai:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {['🤖 Robots', '🏥 Medical Equipment', '📻 Radio Transmitter', '🏠 Home Appliances', '💻 PC', '📱 Mobile Phone', '📟 Tablet', '🔊 Receiver'].map((item, i) => (
                                <div key={i} className="p-3 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 text-center hover:shadow-md hover:border-sky-300 transition-all">
                                    <span className="text-xs font-bold text-sky-800">{item}</span>
                                </div>
                            ))}
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Features of Microcontroller ═══ */}
                    <Sec id="mc-features" title="🔴 Features of Microcontroller" icon={<Zap size={16} className="text-orange-500" />}>
                        <p className="mb-4">Microcontroller ki important features:</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Feature 1 */}
                            <div className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                        <Box size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">🔹 1. Low Cost and Small Size</h4>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">Microcontroller ka size bahut <strong>chhota</strong> hota hai aur iska <strong>cost bhi kam</strong> hota hai. Isliye ise small electronic devices me easily use kiya jata hai.</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">🔹 2. Operates on Clock Rate</h4>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">Ye <strong>clock rate/frequency</strong> par operate karta hai. Microcontroller different clock frequencies par kaam kar sakta hai.</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-purple-50 text-purple-500 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        <Binary size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">🔹 3. Bit Processing</h4>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">Microcontroller <strong>8-bit, 16-bit aur 32-bit</strong> processing support karta hai. Jitna jyada bit size hoga, utni <strong>fast processing</strong> hogi.</p>
                            </div>

                            {/* Feature 4 */}
                            <div className="p-5 rounded-2xl bg-white border border-green-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-green-50 text-green-500 rounded-xl group-hover:bg-green-500 group-hover:text-white transition-colors">
                                        <BatteryLow size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">🔹 4. Low Power Consumption</h4>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">Microcontroller bahut <strong>kam power consume</strong> karta hai. Isliye <strong>battery-operated devices</strong> me iska use bahut hota hai.</p>
                            </div>

                            {/* Feature 5 */}
                            <div className="p-5 rounded-2xl bg-white border border-cyan-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-cyan-50 text-cyan-500 rounded-xl group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                        <Cpu size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">🔹 5. Embedded Device Support</h4>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">Microcontroller specially <strong>embedded systems</strong> ke liye design kiya gaya hai. Ye real-world devices ko <strong>directly control</strong> kar sakta hai.</p>
                            </div>

                            {/* Feature 6 */}
                            <div className="p-5 rounded-2xl bg-white border border-orange-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="p-3 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                        <HardDrive size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">🔹 6. Program Storage</h4>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">Microcontroller me programs <strong>ROM memory</strong> me permanently store kiye ja sakte hain. Isliye system repeatedly <strong>same instructions execute</strong> kar sakta hai.</p>
                            </div>

                        </div>
                    </Sec>
                    {/* ═══ SECTION: Microcontroller vs Microprocessor ═══ */}
                    <Sec id="mc-vs-mp" title="🔴 Microcontroller vs Microprocessor" icon={<Activity size={16} className="text-red-500" />}>
                        <p className="mb-4">Microcontroller aur Microprocessor me important differences:</p>

                        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-gradient-to-r from-sky-500 to-blue-600 text-white">
                                        <th className="p-3 text-left font-bold rounded-tl-xl">🔲 Microcontroller</th>
                                        <th className="p-3 text-left font-bold rounded-tr-xl">🖥️ Microprocessor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['Ye embedded applications ke liye use hota hai', 'Ye multitasking systems ke liye use hota hai'],
                                        ['Single tasking ke liye suitable hota hai', 'Multiple tasking perform kar sakta hai'],
                                        ['Iske andar RAM, ROM aur I/O components already chip me hote hain', 'Isme external RAM, ROM aur I/O devices lagane padte hain'],
                                        ['Cost kam hoti hai', 'Cost jyada hoti hai'],
                                        ['Power consumption kam hota hai', 'Power consumption jyada hota hai'],
                                        ['Power saving mode available hota hai', 'Usually power saving mode nahi hota'],
                                        ['Washing machine, MP3 player etc. me use hota hai', 'PC aur laptop me use hota hai'],
                                        ['Small size aur compact design hota hai', 'Size comparatively bada hota hai'],
                                    ].map((row, i) => (
                                        <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-sky-50/50'} hover:bg-sky-100/50 transition-colors`}>
                                            <td className="p-3 border-t border-gray-100 text-gray-700 font-medium">
                                                <span className="text-sky-500 mr-1.5">✦</span>{row[0]}
                                            </td>
                                            <td className="p-3 border-t border-gray-100 text-gray-700 font-medium">
                                                <span className="text-red-400 mr-1.5">✦</span>{row[1]}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <IB type="tip">Microcontroller embedded systems me use hota hai jabki Microprocessor general purpose computing ke liye use hota hai.</IB>
                    </Sec>
                    {/* ═══ SECTION: Different Types of Microcontroller ═══ */}
                    <Sec id="mc-types" title="🔴 Different Types of Microcontroller" icon={<GitCompare size={16} className="text-pink-500" />}>
                        <p className="mb-4">Microcontrollers ko unki processing capability, memory structure, instruction set aur architecture ke basis par alag-alag categories me divide kiya jata hai.</p>

                        <div className="space-y-6 mt-6 mb-6">

                            {/* 1. On the Basis of Bit */}
                            <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                                    <div className="p-2 bg-purple-50 text-purple-500 rounded-lg"><Binary size={20} /></div>
                                    🔹 1. On the Basis of Bit
                                </h4>
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="flex-1 space-y-4">
                                        <p className="text-sm text-gray-600">Microcontroller ko bit size ke according divide kiya jata hai. Bit size batata hai ki microcontroller ek time me kitna data process kar sakta hai. Jitna jyada bit size hoga, utni fast aur powerful processing hogi.</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                                                <h5 className="font-bold text-purple-800 mb-1 text-sm">🔸 (A) 8-bit Microcontroller</h5>
                                                <p className="text-xs text-purple-700 mb-2">Ek baar me 8-bit data process karta hai. Simple aur low-cost applications me use hota hai.</p>
                                                <p className="text-[10px] font-semibold text-purple-900 bg-white px-2 py-1 rounded inline-block">Ex: 8051, Toys, Home appliances</p>
                                            </div>
                                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                                <h5 className="font-bold text-blue-800 mb-1 text-sm">🔸 (B) 16-bit Microcontroller</h5>
                                                <p className="text-xs text-blue-700 mb-2">Ek time me 16-bit data process karta hai. 8-bit se jyada fast aur efficient hota hai.</p>
                                                <p className="text-[10px] font-semibold text-blue-900 bg-white px-2 py-1 rounded inline-block">Ex: Industrial automation</p>
                                            </div>
                                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                                <h5 className="font-bold text-emerald-800 mb-1 text-sm">🔸 (C) 32-bit Microcontroller</h5>
                                                <p className="text-xs text-emerald-700 mb-2">High-speed processing provide karta hai. Complex calculations me use hota hai.</p>
                                                <p className="text-[10px] font-semibold text-emerald-900 bg-white px-2 py-1 rounded inline-block">Ex: Robotics, IoT, Smart systems</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-48 flex-shrink-0 flex justify-center items-center rounded-xl bg-gray-50 border border-gray-100 p-2 overflow-hidden">
                                        <img src="/sample-assets/placeholder.svg" alt="Microcontroller Bits" className="w-full h-auto object-contain rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            {/* 2. On the Basis of Memory */}
                            <div className="p-5 rounded-2xl bg-white border border-cyan-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                                    <div className="p-2 bg-cyan-50 text-cyan-500 rounded-lg"><HardDrive size={20} /></div>
                                    🔹 2. On the Basis of Memory
                                </h4>
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="flex-1 space-y-4">
                                        <p className="text-sm text-gray-600">Microcontroller ko memory architecture ke according bhi divide kiya jata hai.</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-100">
                                                <h5 className="font-bold text-cyan-800 mb-1 text-sm">🔸 (A) Embedded Memory Microcontroller</h5>
                                                <p className="text-xs text-cyan-700 mb-2">RAM, ROM aur I/O ports chip ke andar hi available hote hain. Ye compact aur low-cost hote hain.</p>
                                                <p className="text-[10px] font-semibold text-cyan-900 bg-white px-2 py-1 rounded inline-block">Uses: Embedded systems, Smart devices</p>
                                            </div>
                                            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                                <h5 className="font-bold text-indigo-800 mb-1 text-sm">🔸 (B) External Memory Microcontroller</h5>
                                                <p className="text-xs text-indigo-700 mb-2">Memory externally connect ki jati hai. Jahan large memory ki zarurat hoti hai, wahan use hota hai.</p>
                                                <p className="text-[10px] font-semibold text-indigo-900 bg-white px-2 py-1 rounded inline-block">Uses: Industrial systems</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-48 flex-shrink-0 flex justify-center items-center rounded-xl bg-gray-50 border border-gray-100 p-2 overflow-hidden">
                                        <img src="/sample-assets/placeholder.svg" alt="Microcontroller Memory" className="w-full h-auto object-contain rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            {/* 3. On the Basis of Instruction Set */}
                            <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                                    <div className="p-2 bg-pink-50 text-pink-500 rounded-lg"><Cpu size={20} /></div>
                                    🔹 3. On the Basis of Instruction Set
                                </h4>
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="flex-1 space-y-4">
                                        <p className="text-sm text-gray-600">Instruction set ke basis par microcontroller ko do categories me divide kiya jata hai.</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3 bg-pink-50 rounded-xl border border-pink-100">
                                                <h5 className="font-bold text-pink-800 mb-1 text-sm">🔸 (A) CISC (Complex Instruction Set Computer)</h5>
                                                <p className="text-xs text-pink-700 mb-2">Large aur complex instruction set hota hai. Ek hi instruction multiple tasks perform kar sakta hai.</p>
                                                <div className="text-[10px] space-y-1 font-semibold text-pink-900">
                                                    <p className="bg-white px-2 py-1 rounded block">✅ Program size kam hota hai</p>
                                                    <p className="bg-white px-2 py-1 rounded block">⚠️ Hardware complexity jyada hoti hai</p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                                                <h5 className="font-bold text-orange-800 mb-1 text-sm">🔸 (B) RISC (Reduced Instruction Set Computer)</h5>
                                                <p className="text-xs text-orange-700 mb-2">Simple aur limited instructions hote hain. Har instruction ek simple task perform karta hai.</p>
                                                <div className="text-[10px] space-y-1 font-semibold text-orange-900">
                                                    <p className="bg-white px-2 py-1 rounded block">✅ Fast execution, simple design</p>
                                                    <p className="bg-white px-2 py-1 rounded block">✅ High efficiency (Modern IoT devices)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-48 flex-shrink-0 flex justify-center items-center rounded-xl bg-gray-50 border border-gray-100 p-2 overflow-hidden">
                                        <img src="/sample-assets/placeholder.svg" alt="Instruction Set" className="w-full h-auto object-contain rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            {/* 4. On the Basis of Architecture */}
                            <div className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                                    <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><CircuitBoard size={20} /></div>
                                    🔹 4. On the Basis of Architecture
                                </h4>
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="flex-1 space-y-4">
                                        <p className="text-sm text-gray-600">Architecture ke basis par microcontroller ko memory access structure ke according divide kiya jata hai.</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                                <h5 className="font-bold text-emerald-800 mb-1 text-sm">🔸 (A) Harvard Architecture</h5>
                                                <p className="text-xs text-emerald-700 mb-2">Program memory aur data memory alag-alag hoti hain. Processor ek hi time par instruction fetch aur data transfer dono kar sakta hai.</p>
                                                <div className="text-[10px] space-y-1 font-semibold text-emerald-900">
                                                    <p className="bg-white px-2 py-1 rounded block">⚡ Fast processing, better performance</p>
                                                    <p className="bg-white px-2 py-1 rounded block">Uses: DSP systems, Advanced embedded devices</p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
                                                <h5 className="font-bold text-sky-800 mb-1 text-sm">🔸 (B) Von Neumann Architecture</h5>
                                                <p className="text-xs text-sky-700 mb-2">Program memory aur data memory same hoti hain. Instructions aur data dono ek hi memory aur bus share karte hain.</p>
                                                <div className="text-[10px] space-y-1 font-semibold text-sky-900">
                                                    <p className="bg-white px-2 py-1 rounded block">⚙️ Simple design, low cost</p>
                                                    <p className="bg-white px-2 py-1 rounded block">⚠️ Slow processing compared to Harvard</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-48 flex-shrink-0 flex justify-center items-center rounded-xl bg-gray-50 border border-gray-100 p-2 overflow-hidden">
                                        <img src="/sample-assets/placeholder.svg" alt="Architecture" className="w-full h-auto object-contain rounded-lg" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Sec>

                    {/* ═══ SECTION: Microcontroller Brands / Technologies ═══ */}
                    <Sec id="mc-technologies" title="🔴 Types of Microcontroller" icon={<Microchip size={16} className="text-indigo-500" />}>
                        <p className="mb-4 text-sm text-gray-600">Different companies aur technologies ke according microcontrollers ke kai types hote hain. Har microcontroller ka apna architecture, speed aur application area hota hai.</p>

                        <div className="grid grid-cols-1 gap-6 mt-6">
                            
                            {/* 1. 8051 Microcontroller */}
                            <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-5 items-center">
                                    <div className="w-full md:w-48 flex-shrink-0 flex justify-center items-center rounded-xl bg-purple-50/50 p-3">
                                        <img src="/sample-assets/placeholder.svg" alt="8051 Microcontroller" className="w-32 h-32 object-contain" />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                                            <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg"><Cpu size={16} /></div>
                                            🔹 1. 8051 Microcontroller
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">8051 sabse popular aur widely used microcontroller hai. Isse <strong>Intel company</strong> ne develop kiya tha. Ye ek <strong>8-bit</strong> microcontroller hota hai jo embedded systems aur automation applications me use hota hai.</p>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                            <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                                                <p className="text-xs font-bold text-purple-800 mb-1">⚡ Features</p>
                                                <ul className="text-xs text-purple-700 space-y-1 ml-4 list-disc marker:text-purple-400">
                                                    <li>8-bit processor</li>
                                                    <li>4 KB ROM & 128 bytes RAM</li>
                                                    <li>32 I/O pins</li>
                                                    <li>Serial communication support</li>
                                                </ul>
                                            </div>
                                            <div className="bg-fuchsia-50/50 p-3 rounded-xl border border-fuchsia-100">
                                                <p className="text-xs font-bold text-fuchsia-800 mb-1">🛠️ Uses</p>
                                                <ul className="text-xs text-fuchsia-700 space-y-1 ml-4 list-disc marker:text-fuchsia-400">
                                                    <li>Home appliances</li>
                                                    <li>Traffic light control</li>
                                                    <li>Robotics & Industrial automation</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. PIC Microcontroller */}
                            <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-5 items-center md:flex-row-reverse">
                                    <div className="w-full md:w-48 flex-shrink-0 flex justify-center items-center rounded-xl bg-red-50/50 p-3">
                                        <img src="/sample-assets/placeholder.svg" alt="PIC Microcontroller" className="w-32 h-32 object-contain" />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                                            <div className="p-1.5 bg-red-100 text-red-600 rounded-lg"><Cpu size={16} /></div>
                                            🔹 2. PIC Microcontroller
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">PIC ka full form hota hai <strong>Peripheral Interface Controller</strong>. Ye <strong>Microchip company</strong> dwara develop kiya gaya microcontroller hai. Ye fast processing aur low power consumption ke liye famous hai.</p>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                            <div className="bg-red-50/50 p-3 rounded-xl border border-red-100">
                                                <p className="text-xs font-bold text-red-800 mb-1">⚡ Features</p>
                                                <ul className="text-xs text-red-700 space-y-1 ml-4 list-disc marker:text-red-400">
                                                    <li>High speed execution</li>
                                                    <li>Low power consumption</li>
                                                    <li>Easy programming</li>
                                                    <li>Built-in peripherals</li>
                                                </ul>
                                            </div>
                                            <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                                                <p className="text-xs font-bold text-orange-800 mb-1">🛠️ Uses</p>
                                                <ul className="text-xs text-orange-700 space-y-1 ml-4 list-disc marker:text-orange-400">
                                                    <li>Medical devices</li>
                                                    <li>Industrial systems</li>
                                                    <li>Security systems</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. AVR Microcontroller */}
                            <div className="p-5 rounded-2xl bg-white border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-5 items-center">
                                    <div className="w-full md:w-48 flex-shrink-0 flex justify-center items-center rounded-xl bg-teal-50/50 p-3">
                                        <img src="/sample-assets/placeholder.svg" alt="AVR Microcontroller" className="w-32 h-32 object-contain" />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                                            <div className="p-1.5 bg-teal-100 text-teal-600 rounded-lg"><Cpu size={16} /></div>
                                            🔹 3. AVR Microcontroller
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">AVR microcontroller <strong>Atmel company</strong> ne develop kiya tha. Ye RISC architecture par based hota hai aur fast execution provide karta hai. <strong>Arduino boards</strong> me mostly AVR microcontroller use hota hai.</p>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                            <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-100">
                                                <p className="text-xs font-bold text-teal-800 mb-1">⚡ Features</p>
                                                <ul className="text-xs text-teal-700 space-y-1 ml-4 list-disc marker:text-teal-400">
                                                    <li>RISC architecture</li>
                                                    <li>Fast processing</li>
                                                    <li>Low power requirement</li>
                                                    <li>Easy interfacing</li>
                                                </ul>
                                            </div>
                                            <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                                                <p className="text-xs font-bold text-emerald-800 mb-1">🛠️ Uses</p>
                                                <ul className="text-xs text-emerald-700 space-y-1 ml-4 list-disc marker:text-emerald-400">
                                                    <li>Arduino projects</li>
                                                    <li>IoT systems</li>
                                                    <li>Embedded applications</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 4. ARM Microcontroller */}
                            <div className="p-5 rounded-2xl bg-white border border-cyan-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-5 items-center md:flex-row-reverse">
                                    <div className="w-full md:w-48 flex-shrink-0 flex justify-center items-center rounded-xl bg-cyan-50/50 p-3">
                                        <img src="/sample-assets/placeholder.svg" alt="ARM Microcontroller" className="w-32 h-32 object-contain" />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                                            <div className="p-1.5 bg-cyan-100 text-cyan-600 rounded-lg"><Cpu size={16} /></div>
                                            🔹 4. ARM Microcontroller
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">ARM microcontroller advanced embedded systems ke liye use hota hai. Ye high-performance aur low power consumption provide karta hai. ARM processors <strong>modern smart devices</strong> me bahut jyada use hote hain.</p>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                            <div className="bg-cyan-50/50 p-3 rounded-xl border border-cyan-100">
                                                <p className="text-xs font-bold text-cyan-800 mb-1">⚡ Features</p>
                                                <ul className="text-xs text-cyan-700 space-y-1 ml-4 list-disc marker:text-cyan-400">
                                                    <li>32-bit / 64-bit architecture</li>
                                                    <li>High speed processing</li>
                                                    <li>Large memory support</li>
                                                    <li>Low power consumption</li>
                                                </ul>
                                            </div>
                                            <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-100">
                                                <p className="text-xs font-bold text-sky-800 mb-1">🛠️ Uses</p>
                                                <ul className="text-xs text-sky-700 space-y-1 ml-4 list-disc marker:text-sky-400">
                                                    <li>Smartphones</li>
                                                    <li>Tablets</li>
                                                    <li>Smart devices & IoT systems</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 5. MSP Microcontroller */}
                            <div className="p-5 rounded-2xl bg-white border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-5 items-center">
                                    <div className="w-full md:w-48 flex-shrink-0 flex justify-center items-center rounded-xl bg-amber-50/50 p-3">
                                        <img src="/sample-assets/placeholder.svg" alt="MSP Microcontroller" className="w-32 h-32 object-contain" />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                                            <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg"><Cpu size={16} /></div>
                                            🔹 5. MSP Microcontroller
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">MSP microcontroller <strong>Texas Instruments company</strong> dwara develop kiya gaya hai. Ye ultra-low power applications ke liye specially design kiya gaya hai.</p>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                                                <p className="text-xs font-bold text-amber-800 mb-1">⚡ Features</p>
                                                <ul className="text-xs text-amber-700 space-y-1 ml-4 list-disc marker:text-amber-400">
                                                    <li>Very low power consumption</li>
                                                    <li>High efficiency</li>
                                                    <li>Fast response</li>
                                                </ul>
                                            </div>
                                            <div className="bg-yellow-50/50 p-3 rounded-xl border border-yellow-100">
                                                <p className="text-xs font-bold text-yellow-800 mb-1">🛠️ Uses</p>
                                                <ul className="text-xs text-yellow-700 space-y-1 ml-4 list-disc marker:text-yellow-400">
                                                    <li>Battery-operated devices</li>
                                                    <li>Wireless sensor systems</li>
                                                    <li>Portable electronics</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Sec>

                    {/* ═══ SECTION: Elements of Microcontroller ═══ */}
                    <Sec id="mc-elements" title="🔴 Elements of Microcontroller" icon={<CircuitBoard size={16} className="text-teal-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center mb-6 bg-gradient-to-br from-teal-50 to-emerald-50 p-5 rounded-2xl border border-teal-100 shadow-sm">
                            <div className="flex-1">
                                <p className="text-sm text-gray-700">Microcontroller ek complete embedded system hota hai jiske andar different hardware components hote hain. Ye sabhi elements milkar microcontroller ko processing aur control capability provide karte hain.</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Elements of Microcontroller" className="w-full h-auto object-contain rounded-xl shadow-md border border-teal-200/50 bg-white/50 backdrop-blur-sm p-2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                            
                            {/* 1. CPU */}
                            <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow group">
                                <h4 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors"><Cpu size={18} /></div>
                                    🔹 1. CPU (Central Processing Unit)
                                </h4>
                                <p className="text-xs text-gray-600 mb-3">CPU microcontroller ka sabse important part hota hai. Isse microcontroller ka “brain” bhi kaha jata hai. Ye instructions ko execute karta hai aur poore system ko control karta hai.</p>
                                <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/50">
                                    <p className="text-[10px] font-bold text-blue-800 mb-1">⚡ Functions of CPU</p>
                                    <ul className="text-[10px] text-blue-700 space-y-0.5 ml-4 list-disc marker:text-blue-400">
                                        <li>Instructions execute karna</li>
                                        <li>Arithmetic calculations karna</li>
                                        <li>Logical operations perform karna</li>
                                        <li>System ko control karna</li>
                                    </ul>
                                </div>
                            </div>

                            {/* 2. Memory */}
                            <div className="p-4 rounded-xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow group">
                                <h4 className="font-bold text-purple-900 text-base mb-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-purple-50 text-purple-500 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors"><HardDrive size={18} /></div>
                                    🔹 2. Memory
                                </h4>
                                <p className="text-xs text-gray-600 mb-3">Memory data aur programs ko store karne ke liye use hoti hai.</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-purple-50/50 p-2.5 rounded-lg border border-purple-100/50">
                                        <p className="text-[10px] font-bold text-purple-800 mb-0.5">🔸 RAM (Temporary)</p>
                                        <p className="text-[9px] text-purple-700 leading-tight">Processing ke dauran data store hota hai. Power OFF hone par data erase ho jata hai.</p>
                                    </div>
                                    <div className="bg-fuchsia-50/50 p-2.5 rounded-lg border border-fuchsia-100/50">
                                        <p className="text-[10px] font-bold text-fuchsia-800 mb-0.5">🔸 ROM (Permanent)</p>
                                        <p className="text-[9px] text-fuchsia-700 leading-tight">Programs permanently store hote hain. Power OFF hone par data delete nahi hota.</p>
                                    </div>
                                </div>
                            </div>

                            {/* 3. I/O Ports */}
                            <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow group">
                                <h4 className="font-bold text-emerald-900 text-base mb-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-emerald-50 text-emerald-500 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors"><GitCompare size={18} /></div>
                                    🔹 3. I/O Ports
                                </h4>
                                <p className="text-xs text-gray-600 mb-3">I/O ports external devices ko connect karne ke liye use hote hain. Input ports sensors se data receive karte hain, output ports LEDs aur motors ko control karte hain.</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {['Sensor interfacing', 'LED control', 'Motor control', 'Device communication'].map((use, i) => (
                                        <span key={i} className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">{use}</span>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Timers and Counters */}
                            <div className="p-4 rounded-xl bg-white border border-orange-100 shadow-sm hover:shadow-md transition-shadow group">
                                <h4 className="font-bold text-orange-900 text-base mb-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors"><Clock size={18} /></div>
                                    🔹 4. Timers & Counters
                                </h4>
                                <p className="text-xs text-gray-600 mb-3">Timers aur counters time-related operations aur event counting ke liye use hote hain.</p>
                                <div className="space-y-1.5 mb-3">
                                    <div className="text-[10px]"><strong className="text-orange-800">🔸 Timer:</strong> <span className="text-gray-600">Specific time delay generate karta hai.</span></div>
                                    <div className="text-[10px]"><strong className="text-orange-800">🔸 Counter:</strong> <span className="text-gray-600">External events ya pulses ko count karta hai.</span></div>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {['Digital clocks', 'Frequency measurement', 'Delay generation'].map((use, i) => (
                                        <span key={i} className="text-[9px] font-semibold text-orange-700 bg-orange-50 border border-orange-100 px-2 py-1 rounded-full">{use}</span>
                                    ))}
                                </div>
                            </div>

                            {/* 5. Oscillator */}
                            <div className="p-4 rounded-xl bg-white border border-amber-100 shadow-sm hover:shadow-md transition-shadow group">
                                <h4 className="font-bold text-amber-900 text-base mb-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-amber-50 text-amber-500 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-colors"><Activity size={18} /></div>
                                    🔹 5. Oscillator
                                </h4>
                                <p className="text-xs text-gray-600 mb-3">Oscillator clock signals generate karta hai jo microcontroller ki speed aur timing ko control karte hain. Ye continuous pulses provide karta hai jinke basis par CPU instructions execute karta hai.</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {['Clock generation', 'Timing synchronization'].map((use, i) => (
                                        <span key={i} className="text-[9px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full">{use}</span>
                                    ))}
                                </div>
                            </div>

                            {/* 6 & 7. ADC and DAC */}
                            <div className="p-4 rounded-xl bg-white border border-teal-100 shadow-sm hover:shadow-md transition-shadow group">
                                <h4 className="font-bold text-teal-900 text-base mb-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-teal-50 text-teal-500 rounded-lg group-hover:bg-teal-500 group-hover:text-white transition-colors"><Waves size={18} /></div>
                                    🔹 6 & 7. ADC & DAC
                                </h4>
                                <div className="space-y-3">
                                    <div className="bg-teal-50/50 p-2.5 rounded-lg border border-teal-100/50">
                                        <p className="text-[10px] font-bold text-teal-800 mb-0.5">🔸 ADC (Analog to Digital)</p>
                                        <p className="text-[9px] text-teal-700 leading-tight">Sensors ke analog data ko digital me convert karta hai (e.g. Temperature sensor data).</p>
                                    </div>
                                    <div className="bg-cyan-50/50 p-2.5 rounded-lg border border-cyan-100/50">
                                        <p className="text-[10px] font-bold text-cyan-800 mb-0.5">🔸 DAC (Digital to Analog)</p>
                                        <p className="text-[9px] text-cyan-700 leading-tight">Digital signals ko analog me convert karta hai (e.g. Audio systems, Analog control).</p>
                                    </div>
                                </div>
                            </div>

                            {/* 8. Serial Port */}
                            <div className="p-4 rounded-xl bg-white border border-indigo-100 shadow-sm hover:shadow-md transition-shadow group">
                                <h4 className="font-bold text-indigo-900 text-base mb-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-indigo-50 text-indigo-500 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors"><Radio size={18} /></div>
                                    🔹 8. Serial Communication Port
                                </h4>
                                <p className="text-xs text-gray-600 mb-3">Serial communication ports data ko serial form me transfer karte hain. Ye microcontroller ko dusre devices ke saath communicate karne me help karte hain.</p>
                                
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[9px] font-bold text-indigo-800">Types:</span>
                                    <div className="flex gap-1.5">
                                        {['UART', 'SPI', 'I2C'].map((type, i) => (
                                            <span key={i} className="text-[8px] font-bold text-white bg-indigo-700 px-1.5 py-0.5 rounded">{type}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {['Computer communication', 'Sensor interfacing', 'IoT communication'].map((use, i) => (
                                        <span key={i} className="text-[9px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-full">{use}</span>
                                    ))}
                                </div>
                            </div>

                            {/* 9. Interrupt System */}
                            <div className="p-4 rounded-xl bg-white border border-rose-100 shadow-sm hover:shadow-md transition-shadow group">
                                <h4 className="font-bold text-rose-900 text-base mb-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-rose-50 text-rose-500 rounded-lg group-hover:bg-rose-500 group-hover:text-white transition-colors"><Zap size={18} /></div>
                                    🔹 9. Interrupt System
                                </h4>
                                <p className="text-xs text-gray-600 mb-3">Interrupt system urgent events ko handle karne ke liye use hota hai. Jab koi important signal aata hai to interrupt CPU ko current task temporarily stop karke naye task ko execute karne ke liye force karta hai.</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {['Emergency systems', 'Real-time systems', 'Event handling'].map((use, i) => (
                                        <span key={i} className="text-[9px] font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-1 rounded-full">{use}</span>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </Sec>

                </main>
            </div>
        </div>
    );
}
