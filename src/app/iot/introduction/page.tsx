'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Wifi, Cpu, Radio, Shield, Zap, BookOpen, Menu, X, ChevronRight, Hash, Sparkles, Globe, Eye, Activity, Layers } from 'lucide-react';
import IoTChap1MCQ from '@/components/content/IoTChap1MCQ';

function Sec({ id, title, icon, children }: { id: string; title: string; icon: ReactNode; children: ReactNode }) {
    return (
        <section id={id} className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg bg-white" style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>{icon}<h2 className="text-base md:text-lg font-extrabold text-gray-800">{title}</h2></div>
            <div className="text-sm leading-relaxed space-y-3 text-gray-600">{children}</div>
        </section>
    );
}

function Def({ children }: { children: ReactNode }) {
    return <div className="rounded-xl p-4 my-3 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #ecfeff, #cffafe)', border: '1px solid #67e8f9', color: '#155e75' }}>{children}</div>;
}

function IB({ type = 'tip', children }: { type?: 'tip' | 'note' | 'warning'; children: ReactNode }) {
    const s: Record<string, { bg: string; bc: string; tc: string; emoji: string }> = { tip: { bg: '#ecfeff', bc: '#67e8f9', tc: '#0e7490', emoji: '💡' }, note: { bg: '#eff6ff', bc: '#93c5fd', tc: '#1e40af', emoji: '📝' }, warning: { bg: '#fefce8', bc: '#fde047', tc: '#854d0e', emoji: '⚠️' } };
    const st = s[type];
    return <div className="rounded-xl p-3.5 text-xs font-medium my-3" style={{ background: st.bg, border: `1px solid ${st.bc}`, color: st.tc }}>{st.emoji} {children}</div>;
}

function TH({ children }: { children: ReactNode }) {
    return <tr style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }} className="text-white">{children}</tr>;
}

const tocItems = [
    { icon: <Wifi size={13} />, label: 'IoT Introduction', id: 'intro', color: '#06b6d4' },
    { icon: <Globe size={13} />, label: 'History', id: 'history', color: '#8b5cf6' },
    { icon: <Layers size={13} />, label: 'Characteristics', id: 'chars', color: '#f97316' },
    { icon: <Radio size={13} />, label: 'Connectivity', id: 'connectivity', color: '#10b981' },
    { icon: <Cpu size={13} />, label: 'Intelligence', id: 'intelligence', color: '#ec4899' },
    { icon: <Eye size={13} />, label: 'Sensing', id: 'sensing', color: '#ef4444' },
    { icon: <Activity size={13} />, label: 'Dynamic Nature', id: 'dynamic', color: '#eab308' },
    { icon: <Zap size={13} />, label: 'Scale', id: 'scale', color: '#06b6d4' },
    { icon: <Shield size={13} />, label: 'Security', id: 'security', color: '#ef4444' },
    { icon: <Radio size={13} />, label: 'Communication', id: 'communication', color: '#8b5cf6' },
    { icon: <Wifi size={13} />, label: 'How IoT Works', id: 'how-iot-works', color: '#10b981' },
    { icon: <Cpu size={13} />, label: 'Four Concepts', id: 'four-concepts', color: '#f97316' },
    { icon: <Globe size={13} />, label: 'IoT Applications', id: 'iot-applications', color: '#06b6d4' },
    { icon: <Layers size={13} />, label: 'Building Blocks', id: 'building-blocks', color: '#8b5cf6' },
    { icon: <Wifi size={13} />, label: 'IoT Ecosystem', id: 'iot-ecosystem', color: '#10b981' },
    { icon: <Radio size={13} />, label: 'Types of Network', id: 'types-of-network', color: '#f97316' },
    { icon: <Zap size={13} />, label: 'Technologies & Protocols', id: 'tech-protocols', color: '#8b5cf6' },
    { icon: <Layers size={13} />, label: 'OSI Model in IoT', id: 'osi-model', color: '#ec4899' },
    { icon: <Cpu size={13} />, label: 'IoT Protocols Detail', id: 'iot-protocols-detail', color: '#0891b2' },
    { icon: <Globe size={13} />, label: 'Network Layer ', id: 'network-layer-deep', color: '#06b6d4' },
    { icon: <Zap size={13} />, label: 'Physical Layer ', id: 'physical-layer-deep', color: '#f97316' },
    { icon: <Radio size={13} />, label: 'Comm. Models', id: 'comm-models', color: '#10b981' },
    { icon: <Cpu size={13} />, label: 'Dev Tools', id: 'dev-tools', color: '#8b5cf6' },
    { icon: <BookOpen size={13} />, label: 'Important MCQs', id: 'mcqs', color: '#0ea5e9' },
];

export default function IoTIntroduction() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('intro');

    return (
        <div className="min-h-screen bg-white text-slate-800 relative">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-white to-blue-50/30" />
            </div>

            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/iot" className="flex items-center justify-center w-9 h-9 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}><ArrowLeft size={16} /></Link>
                        <div>
                            <h1 className="text-sm font-extrabold text-gray-800">Introduction to IoT</h1>
                            <div className="flex items-center gap-1.5"><Sparkles size={8} className="text-cyan-500" /><span className="text-[9px] uppercase tracking-[0.18em] font-bold text-cyan-500">Chapter 1</span></div>
                        </div>
                    </div>
                    <button onClick={() => setTocOpen(!tocOpen)} className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 border border-gray-200">
                        {tocOpen ? <X size={18} className="text-cyan-500" /> : <Menu size={18} className="text-cyan-500" />}
                    </button>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #f97316, #06b6d4)' }} />
            </header>

            <div className="max-w-7xl mx-auto flex relative">
                <aside className={`${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[52px] left-0 z-40 lg:z-10 w-64 lg:w-56 xl:w-64 h-[calc(100vh-52px)] overflow-y-auto transition-transform duration-300 lg:flex-shrink-0 bg-white/95 backdrop-blur-xl`} style={{ borderRight: '1px solid #e2e8f0' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}><Hash size={12} className="text-white" /></div>
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
                    <section className="relative rounded-3xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 30%, #0ea5e9 60%, #8b5cf6 100%)', boxShadow: '0 8px 32px rgba(6,182,212,0.25)' }}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)' }} />
                        </div>
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
                                <Sparkles size={10} /> Chapter 1 — O-Level M4-R5
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black mb-3 text-white" style={{ lineHeight: '1.2' }}>Introduction to IoT</h2>
                            <p className="text-sm md:text-base max-w-2xl mb-5 text-white/85">Applications, Devices, Protocols aur Communication Model — IoT ki duniya mein aapka swagat hai!</p>
                            <div className="flex flex-wrap gap-2">
                                {[{ icon: <BookOpen size={14} />, label: '7 Topics' }, { icon: <Wifi size={14} />, label: 'IoT Basics' }, { icon: <Zap size={14} />, label: 'Beginner Friendly' }].map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>{s.icon}<span>{s.label}</span></div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ═══ SECTION: Introduction ═══ */}
                    <Sec id="intro" title="🔹 Introduction — IoT" icon={<Wifi size={16} className="text-cyan-500" />}>
                        <Def>🌐 <strong>IoT (Internet of Things)</strong> ek aisa platform hai jahan regular hone wale devices internet ke through aapas mein communicate karte hain — bina kisi manual intervention ke!</Def>
                        <p>IoT ek <strong>network ke through data ko share aur exchange</strong> karta hai. Isme electronic components, internet connectivity, software aur hardware sab include hote hain.</p>
                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #f0fdfa, #ecfeff)', border: '1px solid #99f6e4' }}>
                            <h4 className="font-bold text-teal-700 mb-2">📌 IoT ka Matlab</h4>
                            <p className="text-teal-800"><strong>&quot;Internet of Things&quot;</strong> — yahan <strong>&quot;Things&quot;</strong> ka matlab kisi bhi object se hai jise internet ke through access kiya ja sakta hai.</p>
                        </div>
                        <IB type="note">IoT shabd ka prayog <strong>Kevin Ashton</strong> ne <strong>1999</strong> mein sabse pehle kiya tha.</IB>
                        <p>IoT ki help se bahut saari smart cheezein possible hui hain:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                            {[{ emoji: '🧊', t: 'Smart Refrigerator', d: 'Khud batata hai kya khatam ho raha hai' }, { emoji: '📱', t: 'Smart Phone', d: 'Internet se connected personal device' }, { emoji: '🏙️', t: 'Smart City', d: 'Traffic, waste, energy sab automated' }].map((item, i) => (
                                <div key={i} className="p-4 rounded-2xl text-center hover:scale-[1.02] transition-transform" style={{ background: '#f0fdfa', border: '1px solid #99f6e4' }}>
                                    <div className="text-3xl mb-2">{item.emoji}</div>
                                    <h5 className="font-bold text-sm text-teal-700">{item.t}</h5>
                                    <p className="text-xs text-gray-500 mt-1">{item.d}</p>
                                </div>
                            ))}
                        </div>
                        <IB type="tip">IoT ki madad se kisi bhi device ko <strong>smart device</strong> mein convert kiya ja sakta hai — bas internet connectivity chahiye!</IB>
                    </Sec>

                    {/* ═══ SECTION: History ═══ */}
                    <Sec id="history" title="🔹 History of IoT" icon={<Globe size={16} className="text-purple-500" />}>
                        <Def>📜 IoT ka idea bahut pehle se tha — 1970 se lekar 2008 tak dheere-dheere develop hua.</Def>
                        <div className="relative my-4 ml-4">
                            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-purple-400 to-orange-400 rounded-full" />
                            {[
                                { year: '1970', text: 'Connected device ka original idea aaya', color: '#06b6d4' },
                                { year: '1980', text: 'Internet ka use systems mein hone laga', color: '#8b5cf6' },
                                { year: '1990', text: 'John Romkey ne internet device ko test kiya', color: '#10b981' },
                                { year: '1995', text: 'M2M (Machine to Machine) model use hua', color: '#f97316' },
                                { year: '1999', text: 'Kevin Ashton ne "IoT" shabd ka use kiya', color: '#ef4444' },
                                { year: '2005', text: 'International communication par IoT report publish hui', color: '#ec4899' },
                                { year: '2008', text: 'IoT ka full-scale development start hua', color: '#eab308' },
                            ].map((item, i) => (
                                <div key={i} className="relative flex items-start gap-4 pb-5 pl-6">
                                    <div className="absolute left-0 top-1 w-5 h-5 rounded-full border-4 border-white shadow-md" style={{ background: item.color }} />
                                    <div className="flex-1 p-3 rounded-xl" style={{ background: `${item.color}08`, border: `1px solid ${item.color}20` }}>
                                        <span className="text-xs font-black px-2 py-0.5 rounded-full text-white mr-2" style={{ background: item.color }}>{item.year}</span>
                                        <span className="text-sm text-gray-700">{item.text}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Characteristics Intro ═══ */}
                    <Sec id="chars" title="🔹 Characteristics of IoT" icon={<Layers size={16} className="text-orange-500" />}>
                        <Def>⚡ IoT ek <strong>intelligent device system</strong> hai jisme devices ke beech wireless network ke through data send aur receive kiya jaata hai.</Def>
                        <p>IoT ki 4 important characteristics hain:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                            {[{ emoji: '🔗', t: 'Connectivity', c: '#06b6d4' }, { emoji: '🧠', t: 'Intelligence', c: '#8b5cf6' }, { emoji: '📡', t: 'Sensing', c: '#ef4444' }, { emoji: '🔄', t: 'Dynamic Nature', c: '#eab308' }].map((item, i) => (
                                <div key={i} className="p-4 rounded-2xl text-center hover:scale-105 transition-transform cursor-pointer" style={{ background: `${item.c}08`, border: `1px solid ${item.c}25` }}>
                                    <div className="text-2xl mb-1">{item.emoji}</div>
                                    <h5 className="font-bold text-xs" style={{ color: item.c }}>{item.t}</h5>
                                </div>
                            ))}
                        </div>
                        <IB type="note">Neeche har ek characteristic ko detail mein samjhaya gaya hai 👇</IB>
                    </Sec>

                    {/* ═══ SECTION: Connectivity ═══ */}
                    <Sec id="connectivity" title="(1) Connectivity" icon={<Radio size={16} className="text-emerald-500" />}>
                        <Def>🔗 IoT ka sabse important feature <strong>connectivity</strong> hai — devices ek dusre se connected rehte hain aur data share karte hain.</Def>
                        <p>IoT devices aur unke components jaise <strong>sensors, data devices, computer engine</strong> etc. ek dusre se connected rehte hain.</p>
                        <h4 className="font-bold mt-4 mb-2 text-gray-800">IoT devices kaise connect hote hain?</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
                            {[{ emoji: '📻', t: 'Radio Wave', d: 'Long range wireless' }, { emoji: '🔵', t: 'Bluetooth', d: 'Short range device pairing' }, { emoji: '📶', t: 'WiFi', d: 'Internet connectivity' }, { emoji: '💡', t: 'LiFi', d: 'Light-based communication' }].map((item, i) => (
                                <div key={i} className="p-3 rounded-xl text-center" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                                    <div className="text-2xl mb-1">{item.emoji}</div>
                                    <h5 className="font-bold text-xs text-emerald-700">{item.t}</h5>
                                    <p className="text-[10px] text-gray-500 mt-0.5">{item.d}</p>
                                </div>
                            ))}
                        </div>
                        <IB type="tip">Connectivity ke bina IoT exist nahi kar sakta — ye IoT ki <strong>backbone</strong> hai!</IB>
                    </Sec>

                    {/* ═══ SECTION: Intelligence ═══ */}
                    <Sec id="intelligence" title="(2) Intelligence" icon={<Cpu size={16} className="text-pink-500" />}>
                        <Def>🧠 IoT mein bahut saare <strong>algorithms</strong> use hote hain jinke dwara devices intelligent ban jaate hain.</Def>
                        <p>IoT mein <strong>Big Data Analytics</strong> kiya jaata hai aur <strong>Machine Learning</strong> ka use hota hai jisse user better decision le sakta hai.</p>
                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)', border: '1px solid #f9a8d4' }}>
                            <h4 className="font-bold text-pink-700 mb-2">🎯 Intelligence kaise kaam karta hai?</h4>
                            <ul className="space-y-2 text-sm text-pink-800">
                                <li>• <strong>Data Collection</strong> — Sensors se data collect hota hai</li>
                                <li>• <strong>Data Analysis</strong> — Algorithms data ko analyze karte hain</li>
                                <li>• <strong>Smart Decisions</strong> — System automatically best decision leta hai</li>
                                <li>• <strong>Business Discussion</strong> — Situation ke according data ka use karke business decisions bhi liye ja sakte hain</li>
                            </ul>
                        </div>
                        <IB type="note">Iske base par ye kaha ja sakta hai ki IoT ek <strong>smart intelligent system</strong> hai!</IB>
                    </Sec>

                    {/* ═══ SECTION: Sensing ═══ */}
                    <Sec id="sensing" title="(3) Sensing" icon={<Eye size={16} className="text-red-500" />}>
                        <Def>📡 IoT mein <strong>sensors</strong> ka use hota hai — sensors ke bina IoT system kaam nahi kar sakta!</Def>
                        <p>Sensors environment ki conditions ko <strong>detect aur measure</strong> karte hain. Inke through hum apni surroundings ko easily samajh sakte hain aur unka analysis kar sakte hain.</p>
                        <h4 className="font-bold mt-4 mb-2 text-gray-800">👉 Sensors ke Examples:</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3">
                            {[{ emoji: '⚡', t: 'Electronic', d: 'Electronic signals detect karta hai' }, { emoji: '🧪', t: 'Chemical', d: 'Chemical composition measure karta hai' }, { emoji: '🔄', t: 'Gyroscope', d: 'Rotation aur orientation track karta hai' }, { emoji: '🌡️', t: 'Pressure', d: 'Air/liquid pressure measure karta hai' }, { emoji: '💡', t: 'Light Sensor', d: 'Light intensity detect karta hai' }, { emoji: '📍', t: 'GPS', d: 'Global Positioning System — location track karta hai' }].map((item, i) => (
                                <div key={i} className="p-3 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                                    <div className="text-xl mb-1">{item.emoji}</div>
                                    <h5 className="font-bold text-xs text-red-700">{item.t}</h5>
                                    <p className="text-[10px] text-gray-600 mt-0.5">{item.d}</p>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', border: '1px solid #fca5a5' }}>
                            <h4 className="font-bold text-red-700 mb-2">⚙️ Sensors kaise kaam karte hain?</h4>
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 font-semibold">Analog Signals</span>
                                <span className="text-red-400">→</span>
                                <span className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-700 font-semibold">Read &amp; Convert</span>
                                <span className="text-orange-400">→</span>
                                <span className="px-3 py-1.5 rounded-lg bg-green-100 text-green-800 font-semibold">Digital Data</span>
                                <span className="text-green-400">→</span>
                                <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 font-semibold">Problem Solving</span>
                            </div>
                        </div>
                        <IB type="tip">Sensors <strong>analog signals</strong> ko read karte hain aur unhe <strong>data mein convert</strong> karte hain — ye data phir problem solve karne ke liye collect kiya jaata hai.</IB>
                    </Sec>

                    {/* ═══ SECTION: Dynamic Nature ═══ */}
                    <Sec id="dynamic" title="(4) Dynamic Nature" icon={<Activity size={16} className="text-yellow-500" />}>
                        <Def>🔄 IoT ki ek important visheshta iska <strong>dynamic nature</strong> hai — data real-time mein collect aur convert hota hai.</Def>
                        <p>IoT mein data ko <strong>real-time</strong> mein collect aur convert kiya jaata hai jisse business discussion aur analysis kiya ja sake. IoT ke components ka nature bhi dynamic hona chahiye.</p>
                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #fefce8, #fef9c3)', border: '1px solid #fde047' }}>
                            <h4 className="font-bold text-yellow-700 mb-3">👉 Example — Temperature Sensor</h4>
                            <p className="text-sm text-yellow-800 mb-3">Agar IoT sensor temperature detect karta hai, to har location aur weather condition ke hisab se temperature change hota rahega:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-200">
                                    <span className="text-2xl">🌴</span>
                                    <div><h5 className="font-bold text-sm text-orange-700">Mumbai</h5><p className="text-xs text-orange-700">Temperature: 32°C — Humid &amp; Hot</p></div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
                                    <span className="text-2xl">🏔️</span>
                                    <div><h5 className="font-bold text-sm text-blue-700">Delhi</h5><p className="text-xs text-blue-600">Temperature: 18°C — Cool &amp; Dry</p></div>
                                </div>
                            </div>
                        </div>
                        <IB type="warning">IoT system ko <strong>continuously change hone wale data</strong> ko handle karna padta hai — isliye IoT components ka nature dynamic hona bahut zaroori hai!</IB>
                    </Sec>


                    {/* ═══ SECTION: Scale ═══ */}
                    <Sec id="scale" title="(5) Scale" icon={<Zap size={16} className="text-cyan-500" />}>
                        <Def>📏 IoT system ko zarurat ke according <strong>scale (badha ya chhota)</strong> kiya ja sakta hai — yani IoT ka size small bhi ho sakta hai aur large bhi.</Def>
                        <p>IoT ka ek important feature ye hai ki iska scale <strong>flexible</strong> hota hai — chhote se lekar bahut bade systems tak kaam kar sakta hai.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                            <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #ecfeff, #cffafe)', border: '1px solid #67e8f9' }}>
                                <div className="text-3xl mb-2">🏠</div>
                                <h5 className="font-bold text-sm text-cyan-700 mb-1">Small Scale IoT</h5>
                                <p className="text-xs text-cyan-800">Kisi ek room ya home ke liye — jaise Smart Home system jisme sirf ghar ke devices connected hain</p>
                            </div>
                            <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #93c5fd' }}>
                                <div className="text-3xl mb-2">🏭</div>
                                <h5 className="font-bold text-sm text-blue-700 mb-1">Large Scale IoT</h5>
                                <p className="text-xs text-blue-800">Poori factory ya company level par — jaise Industrial IoT jisme hazaron machines connected hain</p>
                            </div>
                        </div>
                        <IB type="tip">IoT ka scale <strong>flexible</strong> hota hai — chhote ghar se lekar badi factory tak, sab ke liye IoT system design kiya ja sakta hai!</IB>
                    </Sec>

                    {/* ═══ SECTION: Security ═══ */}
                    <Sec id="security" title="🔴 (6) Security" icon={<Shield size={16} className="text-red-500" />}>
                        <Def>🔒 IoT me <strong>security bahut important</strong> hoti hai — IoT devices me bahut saari sensitive information hoti hai jise safe rakhna zaruri hai.</Def>
                        <p>Agar IoT system mein proper security na ho, to data aur information ko khatara ho sakta hai.</p>
                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', border: '1px solid #fca5a5' }}>
                            <h4 className="font-bold text-red-700 mb-3">⚠️ Agar security na ho to kya ho sakta hai?</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-red-50 border border-red-200">
                                    <span className="text-xl">💀</span>
                                    <div>
                                        <h5 className="font-bold text-sm text-red-700">Data Hack</h5>
                                        <p className="text-xs text-red-700">Koi bhi aapka data chura sakta hai</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50 border border-orange-200">
                                    <span className="text-xl">🔧</span>
                                    <div>
                                        <h5 className="font-bold text-sm text-orange-700">Data Manipulate</h5>
                                        <p className="text-xs text-orange-700">Data ko galat tarike se change kiya ja sakta hai</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h4 className="font-bold mt-4 mb-2 text-gray-800">🛡️ IoT Security ke liye kya karna chahiye?</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                            {[{ emoji: '🔥', t: 'Firewall Install karna', d: 'Unauthorized access se bachata hai', color: '#ef4444' }, { emoji: '🌐', t: 'VPN ka use karna', d: 'Data encrypted tunnel se bhejta hai', color: '#8b5cf6' }].map((item, i) => (
                                <div key={i} className="p-4 rounded-2xl" style={{ background: `${item.color}08`, border: `1px solid ${item.color}25` }}>
                                    <div className="text-2xl mb-1">{item.emoji}</div>
                                    <h5 className="font-bold text-sm" style={{ color: item.color }}>{item.t}</h5>
                                    <p className="text-xs text-gray-500 mt-1">{item.d}</p>
                                </div>
                            ))}
                        </div>
                        <IB type="warning">IoT system ko <strong>secure design karna bahut zaruri</strong> hai — tabhi sensitive data safe rahega!</IB>
                    </Sec>

                    {/* ═══ SECTION: Communication ═══ */}
                    <Sec id="communication" title="🔴 Communication" icon={<Radio size={16} className="text-purple-500" />}>
                        <Def>📡 IoT me <strong>devices ek dusre se communicate</strong> karte hain — communication tab possible hota hai jab devices properly connected hon.</Def>
                        <p>IoT system mein communication ke liye alag-alag wireless aur wired technologies ka use hota hai.</p>
                        <h4 className="font-bold mt-4 mb-2 text-gray-800">📶 Communication ke liye technologies:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                            {[
                                { emoji: '📶', t: 'WiFi', d: 'High-speed internet connectivity — ghar aur office mein use hoti hai', color: '#06b6d4' },
                                { emoji: '🗼', t: 'LPWA', d: 'Low Power Wide Area — long range, low power devices ke liye', color: '#8b5cf6' },
                            ].map((item, i) => (
                                <div key={i} className="p-4 rounded-2xl" style={{ background: `${item.color}08`, border: `1px solid ${item.color}25` }}>
                                    <div className="text-2xl mb-1">{item.emoji}</div>
                                    <h5 className="font-bold text-sm" style={{ color: item.color }}>{item.t}</h5>
                                    <p className="text-xs text-gray-500 mt-1">{item.d}</p>
                                </div>
                            ))}
                        </div>
                        <IB type="note">Communication technologies <strong>devices ko connect karti hain</strong> — inke bina IoT mein data exchange possible nahi hoga!</IB>
                    </Sec>

                    {/* ═══ SECTION: How IoT Works ═══ */}
                    <Sec id="how-iot-works" title="🔴 How IoT Works" icon={<Wifi size={16} className="text-emerald-500" />}>
                        <Def>⚙️ IoT process ek <strong>simple working flow</strong> par kaam karta hai — devices collect, process aur share karte hain data ko.</Def>
                        <p>IoT system mein alag-alag smart devices use hote hain jo ek platform ke through aapas mein communicate karte hain.</p>
                        <h4 className="font-bold mt-4 mb-2 text-gray-800">📱 IoT mein use hone wale devices:</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
                            {[{ emoji: '📱', t: 'Smart Phone' }, { emoji: '⌚', t: 'Smart Watch' }, { emoji: '📺', t: 'Smart TV' }, { emoji: '🫧', t: 'Washing Machine' }].map((item, i) => (
                                <div key={i} className="p-3 rounded-xl text-center" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                                    <div className="text-2xl mb-1">{item.emoji}</div>
                                    <h5 className="font-bold text-xs text-emerald-700">{item.t}</h5>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac' }}>
                            <h4 className="font-bold text-green-700 mb-3">🎯 IoT system ka main kaam:</h4>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1.5 rounded-lg bg-green-100 text-green-800 font-semibold text-sm">📥 Data Collect karna</span>
                                <span className="text-green-400 font-bold">→</span>
                                <span className="px-3 py-1.5 rounded-lg bg-teal-100 text-teal-700 font-semibold text-sm">⚙️ Data Process karna</span>
                                <span className="text-teal-400 font-bold">→</span>
                                <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 font-semibold text-sm">👤 User tak pahunchana</span>
                            </div>
                        </div>
                        <IB type="tip">Ye devices <strong>IoT platform ke through</strong> aapas mein communicate karte hain aur user tak useful information pahunchate hain!</IB>
                    </Sec>

                    {/* ═══ SECTION: Four Fundamental Concepts ═══ */}
                    <Sec id="four-concepts" title="🔴 Four Fundamental Concepts of IoT System" icon={<Layers size={16} className="text-orange-500" />}>
                        <Def>🔹 IoT system ko samajhne ke liye <strong>4 main components</strong> hote hain — ye sab milkar IoT ko complete banate hain.</Def>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                            {[{ n: '1', t: 'Sensors / Devices', e: '📡', c: '#06b6d4' }, { n: '2', t: 'Connectivity', e: '🔗', c: '#8b5cf6' }, { n: '3', t: 'Data Processing', e: '⚙️', c: '#10b981' }, { n: '4', t: 'User Interface', e: '📱', c: '#f97316' }].map((item, i) => (
                                <div key={i} className="p-3 rounded-2xl text-center" style={{ background: `${item.c}10`, border: `1px solid ${item.c}30` }}>
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black mx-auto mb-2" style={{ background: item.c }}>{item.n}</div>
                                    <div className="text-xl mb-1">{item.e}</div>
                                    <h5 className="font-bold text-[11px]" style={{ color: item.c }}>{item.t}</h5>
                                </div>
                            ))}
                        </div>

                        {/* Concept 1 */}
                        <div className="rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, #ecfeff, #cffafe)', border: '1px solid #67e8f9' }}>
                            <h4 className="font-bold text-cyan-700 mb-2 flex items-center gap-2">📡 <span>(1) Sensors or Devices</span></h4>
                            <p className="text-sm text-cyan-800 mb-3">Sensors ya devices environment se <strong>live data collect</strong> karte hain.</p>
                            <div className="space-y-1.5 text-xs text-cyan-700 mb-3">
                                <p>👉 Data <strong>simple</strong> bhi ho sakta hai — jaise temperature</p>
                                <p>👉 Data <strong>complex</strong> bhi ho sakta hai — jaise video feed</p>
                                <p>👉 Devices alag-alag type ke sensors use karte hain</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white border border-cyan-200">
                                <p className="text-xs font-bold text-cyan-700 mb-1">📌 Example — Mobile Phone:</p>
                                <div className="flex flex-wrap gap-2">
                                    {['📍 GPS', '📷 Camera', '🔢 Sensors'].map((s, i) => (
                                        <span key={i} className="px-2 py-1 rounded-lg bg-cyan-50 text-cyan-700 text-xs font-semibold border border-cyan-200">{s}</span>
                                    ))}
                                </div>
                                <p className="text-[11px] text-cyan-700 mt-1">Ye sab sensing ka kaam karte hain!</p>
                            </div>
                        </div>

                        {/* Concept 2 */}
                        <div className="rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '1px solid #c4b5fd' }}>
                            <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">🔗 <span>(2) Connectivity</span></h4>
                            <p className="text-sm text-purple-800 mb-3">Collected data ko <strong>cloud ya system tak bhejne</strong> ke liye connectivity use hoti hai.</p>
                            <div className="space-y-1.5 text-xs text-purple-700 mb-3">
                                <p>👉 Data communication ke liye networks use hote hain</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['🔵 Bluetooth', '📶 WiFi', '🌐 WAN'].map((s, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">{s}</span>
                                ))}
                            </div>
                            <p className="text-[11px] text-purple-600 mt-2">👉 Sensors se data collect karke network ke through cloud mein bheja jata hai</p>
                        </div>

                        {/* Concept 3 */}
                        <div className="rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac' }}>
                            <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">⚙️ <span>(3) Data Processing</span></h4>
                            <p className="text-sm text-green-800 mb-3">Jo data collect hota hai usko <strong>process</strong> kiya jata hai.</p>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1.5 rounded-lg bg-green-100 text-green-800 font-semibold text-xs">☁️ Cloud mein store</span>
                                <span className="text-green-400">→</span>
                                <span className="px-3 py-1.5 rounded-lg bg-teal-100 text-teal-700 font-semibold text-xs">💻 Software se process</span>
                                <span className="text-teal-400">→</span>
                                <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 font-semibold text-xs">✅ Useful Information</span>
                            </div>
                            <p className="text-[11px] text-green-600 mt-2">👉 Processing ke baad meaningful aur useful information milti hai</p>
                        </div>

                        {/* Concept 4 */}
                        <div className="rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fdba74' }}>
                            <h4 className="font-bold text-orange-700 mb-2 flex items-center gap-2">📱 <span>(4) User Interface</span></h4>
                            <p className="text-sm text-orange-800 mb-3">User interface wo <strong>medium</strong> hai jiske through user information dekhta hai.</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {['📱 Phone', '📧 Email', '💬 Text Message', '🔔 Notification'].map((s, i) => (
                                    <span key={i} className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-200">{s}</span>
                                ))}
                            </div>
                            <div className="p-3 rounded-xl bg-white border border-orange-200">
                                <p className="text-xs font-bold text-orange-700 mb-2">📌 Example — Temperature Control:</p>
                                <div className="space-y-1.5 text-xs text-orange-600">
                                    <p>🌡️ Room ka temperature bahut zyada ho jata hai</p>
                                    <p>🔔 IoT system user ko <strong>notification</strong> bhejta hai</p>
                                    <p>📱 User <strong>mobile se temperature adjust</strong> kar sakta hai</p>
                                </div>
                            </div>
                        </div>

                        <IB type="tip">Ye 4 concepts milkar ek <strong>complete IoT system</strong> banate hain — Sensor → Connect → Process → User!</IB>
                    </Sec>

                    {/* ═══ IoT Applications ═══ */}
                    <Sec id="iot-applications" title="🔹 IoT Applications" icon={<Globe size={16} className="text-cyan-500" />}>
                        <Def>🌍 IoT ka use <strong>different fields</strong> mein bahut zyada hota hai — devices smart ho jaate hain aur automatic kaam karte hain.</Def>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                            {[{ e: '⌚', t: 'Wearable', c: '#06b6d4' }, { e: '🏥', t: 'Health', c: '#ef4444' }, { e: '🚦', t: 'Traffic', c: '#f97316' }, { e: '🌾', t: 'Agriculture', c: '#10b981' }, { e: '🏠', t: 'Smart Home', c: '#8b5cf6' }, { e: '🏙️', t: 'Smart City', c: '#eab308' }, { e: '🏭', t: 'Industrial', c: '#ec4899' }, { e: '📹', t: 'Surveillance', c: '#64748b' }].map((a, i) => (
                                <div key={i} className="p-3 rounded-xl text-center hover:scale-105 transition-transform" style={{ background: `${a.c}10`, border: `1px solid ${a.c}30` }}>
                                    <div className="text-2xl mb-1">{a.e}</div>
                                    <h5 className="font-bold text-[11px]" style={{ color: a.c }}>{a.t}</h5>
                                </div>
                            ))}
                        </div>

                        {/* Wearable */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #ecfeff, #cffafe)', border: '1px solid #67e8f9' }}>
                            <h4 className="font-bold text-cyan-700 mb-2">⌚ (1) Wearable</h4>
                            <p className="text-xs text-cyan-800 mb-2">Wearable devices wo hote hain jo hum <strong>body par pehnte hain</strong>.</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {['⌚ Smart Watch', '❤️ Heart Rate Monitor', '🩸 Glucose Monitor', '📍 GPS Tracker'].map((s, i) => (
                                    <span key={i} className="px-2 py-1 rounded-lg bg-white text-cyan-700 text-xs font-semibold border border-cyan-200">{s}</span>
                                ))}
                            </div>
                            <div className="text-xs text-cyan-700 space-y-0.5">
                                <p>👉 Sensors body ka data collect karte hain aur health/activity monitor karte hain</p>
                                <p>👉 Ye devices <strong>kam energy consume</strong> karte hain aur <strong>continuous data collect</strong> karte hain</p>
                            </div>
                        </div>

                        {/* Health */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', border: '1px solid #fca5a5' }}>
                            <h4 className="font-bold text-red-700 mb-2">🏥 (2) Health</h4>
                            <p className="text-xs text-red-800 mb-2">IoT ka use <strong>health sector</strong> mein bahut important hai.</p>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <div className="p-2 rounded-lg bg-white border border-red-200"><p className="text-[11px] text-red-700 font-semibold">🛏️ Smart beds</p><p className="text-[10px] text-gray-500">Patients ki condition monitor karte hain</p></div>
                                <div className="p-2 rounded-lg bg-white border border-red-200"><p className="text-[11px] text-red-700 font-semibold">📊 Real-time Data</p><p className="text-[10px] text-gray-500">Temperature, BP, Pulse rate</p></div>
                            </div>
                            <p className="text-xs text-red-700">👉 Doctor patient ko <strong>easily monitor</strong> kar sakta hai — real-time data milta hai</p>
                        </div>

                        {/* Traffic */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fdba74' }}>
                            <h4 className="font-bold text-orange-700 mb-2">🚦 (3) Traffic Monitoring</h4>
                            <p className="text-xs text-orange-800 mb-2">IoT ka use <strong>traffic control</strong> mein bhi hota hai.</p>
                            <div className="text-xs text-orange-700 space-y-1">
                                <p>👉 Vehicles ki <strong>speed detect</strong> karta hai</p>
                                <p>👉 Traffic condition <strong>analyse</strong> karta hai</p>
                                <p>👉 Traffic rules follow karwana easy hota hai — Traffic jam control hota hai</p>
                                <p>👉 Computer system <strong>automatically data analyse</strong> karta hai</p>
                            </div>
                        </div>

                        {/* Agriculture */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac' }}>
                            <h4 className="font-bold text-green-700 mb-2">🌾 (4) Agriculture</h4>
                            <p className="text-xs text-green-800 mb-2">IoT ka use <strong>farming</strong> mein bhi hota hai.</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {['💧 Humidity', '🌿 Nutrients', '⚗️ Acidity'].map((s, i) => (
                                    <span key={i} className="px-2 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-semibold border border-green-200">{s}</span>
                                ))}
                            </div>
                            <p className="text-xs text-green-700">👉 <strong>Better crop production</strong> aur <strong>smart irrigation</strong> possible hoti hai</p>
                        </div>

                        {/* Smart Home */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '1px solid #c4b5fd' }}>
                            <h4 className="font-bold text-purple-700 mb-2">🏠 (5) Smart Home</h4>
                            <p className="text-xs text-purple-800 mb-2">IoT ka <strong>sabse common use</strong> smart home mein hota hai.</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {['❄️ AC', '📺 Smart TV', '🧊 Refrigerator', '💡 LED Bulb', '🌀 Fan', '🚪 Smart Door', '🫧 Washing Machine'].map((s, i) => (
                                    <span key={i} className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">{s}</span>
                                ))}
                            </div>
                            <p className="text-xs text-purple-700">👉 User <strong>mobile se control</strong> kar sakta hai — jaise mobile se light ON/OFF karna</p>
                        </div>

                        {/* Smart City */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #fefce8, #fef9c3)', border: '1px solid #fde047' }}>
                            <h4 className="font-bold text-yellow-700 mb-2">🏙️ (6) Smart City</h4>
                            <p className="text-xs text-yellow-800 mb-2">IoT ka use <strong>smart city</strong> banane mein hota hai.</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {['🚦 Traffic Control', '🗑️ Waste Management', '💧 Water Distribution', '⚡ Electricity', '🌫️ Pollution Checking'].map((s, i) => (
                                    <span key={i} className="px-2 py-1 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-semibold border border-yellow-300">{s}</span>
                                ))}
                            </div>
                            <p className="text-xs text-yellow-700">👉 City <strong>efficient aur automated</strong> ho jaati hai</p>
                        </div>

                        {/* Industrial */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)', border: '1px solid #f9a8d4' }}>
                            <h4 className="font-bold text-pink-700 mb-2">🏭 (7) Industrial Automation</h4>
                            <p className="text-xs text-pink-800 mb-2">IoT <strong>industries mein production improve</strong> karta hai.</p>
                            <div className="text-xs text-pink-700 space-y-1">
                                <p>👉 Machines <strong>automatically kaam</strong> karti hain</p>
                                <p>👉 <strong>Human effort kam</strong> hota hai — Production fast hota hai</p>
                                <p>👉 Automation <strong>bina human interaction</strong> ke possible hai</p>
                            </div>
                        </div>

                        {/* Surveillance */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <h4 className="font-bold text-slate-700 mb-2">📹 (8) Surveillance</h4>
                            <p className="text-xs text-slate-700 mb-2">IoT ka use <strong>security aur monitoring</strong> mein hota hai.</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {['🏠 Home', '🏢 Office', '✈️ Airport', '🚉 Railway Station'].map((s, i) => (
                                    <span key={i} className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">{s}</span>
                                ))}
                            </div>
                            <p className="text-xs text-slate-600">👉 CCTV cameras mein sensors lage hote hain — system activity detect karta hai aur <strong>owner ko alert/message</strong> bhejta hai</p>
                        </div>

                        <IB type="note">CCTV = <strong>Closed Circuit Television</strong> — ek surveillance system jisme cameras security, monitoring aur recording ke liye use hote hain.</IB>
                    </Sec>

                    {/* ═══ Building Blocks of IoT ═══ */}
                    <Sec id="building-blocks" title="🔴 Building Blocks of IoT" icon={<Layers size={16} className="text-purple-500" />}>
                        <Def>🧱 IoT system ko banane ke liye <strong>4 main building blocks</strong> hote hain — har block ka apna important role hota hai.</Def>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                            {[{ n: '1', e: '📡', t: 'Sensors', c: '#06b6d4' }, { n: '2', e: '⚙️', t: 'Processor', c: '#8b5cf6' }, { n: '3', e: '🌐', t: 'Gateway', c: '#10b981' }, { n: '4', e: '📱', t: 'Application', c: '#f97316' }].map((b, i) => (
                                <div key={i} className="p-3 rounded-2xl text-center" style={{ background: `${b.c}10`, border: `1px solid ${b.c}30` }}>
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black mx-auto mb-1" style={{ background: b.c }}>{b.n}</div>
                                    <div className="text-xl mb-1">{b.e}</div>
                                    <h5 className="font-bold text-[11px]" style={{ color: b.c }}>{b.t}</h5>
                                </div>
                            ))}
                        </div>

                        {/* Block 1 - Sensors */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #ecfeff, #cffafe)', border: '1px solid #67e8f9' }}>
                            <h4 className="font-bold text-cyan-700 mb-2">📡 (1) Sensors</h4>
                            <p className="text-xs text-cyan-800 mb-2">Sensors IoT device ka <strong>front-end</strong> hote hain — ye environment se data receive karte hain.</p>
                            <div className="flex flex-wrap gap-2">
                                {['📐 Accelerometer', '🌡️ Temperature', '📍 Proximity', '💨 Gas Sensor', '🏃 Motion', '💧 Water Sensor'].map((s, i) => (
                                    <span key={i} className="px-2 py-1 rounded-lg bg-white text-cyan-700 text-xs font-semibold border border-cyan-200">{s}</span>
                                ))}
                            </div>
                        </div>

                        {/* Block 2 - Processor */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '1px solid #c4b5fd' }}>
                            <h4 className="font-bold text-purple-700 mb-2">⚙️ (2) Processor</h4>
                            <p className="text-xs text-purple-800 mb-2">Processor ek <strong>electrical system</strong> hota hai — sensors se aane wale raw data ko process karta hai.</p>
                            <div className="text-xs text-purple-700 space-y-1 mb-2">
                                <p>• Data ko <strong>information mein convert</strong> karna</p>
                                <p>• Data ko <strong>control</strong> karna</p>
                                <p>• <strong>Encryption / Decryption</strong> karna</p>
                            </div>
                            <div className="flex gap-2">
                                {['🔬 Microcontroller', '💻 Embedded Hardware'].map((s, i) => (
                                    <span key={i} className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">{s}</span>
                                ))}
                            </div>
                        </div>

                        {/* Block 3 - Gateway */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac' }}>
                            <h4 className="font-bold text-green-700 mb-2">🌐 (3) Gateway</h4>
                            <p className="text-xs text-green-800 mb-2">Gateway <strong>data transfer ka main medium</strong> hota hai — data ko network mein bhejta hai aur communication establish karta hai.</p>
                            <div className="flex gap-2">
                                {['🔗 LAN', '🌍 WAN', '📶 PAN'].map((s, i) => (
                                    <span key={i} className="px-2 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-semibold border border-green-200">{s}</span>
                                ))}
                            </div>
                        </div>

                        {/* Block 4 - Application */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fdba74' }}>
                            <h4 className="font-bold text-orange-700 mb-2">📱 (4) Application</h4>
                            <p className="text-xs text-orange-800 mb-2">Application <strong>user side</strong> hoti hai — data collect karti hai aur user ko information provide karti hai.</p>
                            <div className="flex flex-wrap gap-2">
                                {['📱 Mobile Apps', '🔒 Security Apps', '🏭 Industrial Apps'].map((s, i) => (
                                    <span key={i} className="px-2 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-200">{s}</span>
                                ))}
                            </div>
                        </div>

                        <IB type="tip">IoT Building Blocks ka flow: <strong>Sensors → Processor → Gateway → Application</strong> — data collect se lekar user tak pahunchne ka complete path!</IB>
                    </Sec>

                    {/* ═══ IoT Ecosystem ═══ */}
                    <Sec id="iot-ecosystem" title="🔹 IoT Ecosystem" icon={<Globe size={16} className="text-emerald-500" />}>
                        <Def>🌐 IoT Ecosystem ek <strong>complete system</strong> hota hai jisme different components milkar kaam karte hain taaki IoT system properly function kar sake.</Def>
                        <p>IoT ecosystem mein multiple elements hote hain jo ek dusre ke saath interact karte hain aur data ko <strong>collect, process aur use</strong> karte hain.</p>

                        <h4 className="font-bold mt-4 mb-3 text-gray-800">🔸 Main Components of IoT Ecosystem</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                            {[{ e: '📡', t: 'Devices / Sensors', c: '#06b6d4' }, { e: '🔗', t: 'Connectivity', c: '#8b5cf6' }, { e: '⚙️', t: 'Data Processing', c: '#10b981' }, { e: '📱', t: 'User Interface', c: '#f97316' }].map((x, i) => (
                                <div key={i} className="p-3 rounded-xl text-center" style={{ background: `${x.c}10`, border: `1px solid ${x.c}30` }}>
                                    <div className="text-2xl mb-1">{x.e}</div>
                                    <h5 className="font-bold text-[11px]" style={{ color: x.c }}>{x.t}</h5>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #ecfeff, #cffafe)', border: '1px solid #67e8f9' }}>
                            <h4 className="font-bold text-cyan-700 mb-2">📡 (1) Devices / Sensors</h4>
                            <p className="text-xs text-cyan-800 mb-2">Ye ecosystem ka <strong>starting point</strong> hote hain — sensors environment se data collect karte hain.</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {['🌡️ Temperature', '🏃 Motion', '💡 Light Sensor'].map((s, i) => (
                                    <span key={i} className="px-2 py-1 rounded-lg bg-white text-cyan-700 text-xs font-semibold border border-cyan-200">{s}</span>
                                ))}
                            </div>
                            <p className="text-xs text-cyan-700">👉 Ye real-world data ko <strong>digital form</strong> mein convert karte hain</p>
                        </div>

                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '1px solid #c4b5fd' }}>
                            <h4 className="font-bold text-purple-700 mb-2">🔗 (2) Connectivity</h4>
                            <p className="text-xs text-purple-800 mb-2">Devices se data ko aage bhejne ke liye <strong>connectivity</strong> use hoti hai.</p>
                            <div className="flex flex-wrap gap-2">
                                {['📶 WiFi', '🔵 Bluetooth', '📡 Cellular Network', '🌐 Internet'].map((s, i) => (
                                    <span key={i} className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">{s}</span>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac' }}>
                            <h4 className="font-bold text-green-700 mb-2">⚙️ (3) Data Processing</h4>
                            <p className="text-xs text-green-800 mb-2">Jo data sensors collect karte hain, use <strong>process</strong> kiya jata hai.</p>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1.5 rounded-lg bg-green-100 text-green-800 text-xs font-semibold">☁️ Cloud / Local Server</span>
                                <span className="text-green-400">→</span>
                                <span className="px-3 py-1.5 rounded-lg bg-teal-100 text-teal-700 text-xs font-semibold">✅ Useful Information</span>
                            </div>
                        </div>

                        <div className="rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fdba74' }}>
                            <h4 className="font-bold text-orange-700 mb-2">📱 (4) User Interface</h4>
                            <p className="text-xs text-orange-800 mb-2">User interface wo medium hai jahan <strong>user data dekhta hai</strong>.</p>
                            <div className="flex gap-2 mb-2">
                                {['📱 Mobile App', '🌐 Web Application'].map((s, i) => (
                                    <span key={i} className="px-2 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-200">{s}</span>
                                ))}
                            </div>
                            <p className="text-xs text-orange-700">👉 User data dekh sakta hai aur <strong>device ko control</strong> kar sakta hai</p>
                        </div>

                        <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac' }}>
                            <h4 className="font-bold text-green-700 mb-3">🔄 Working of IoT Ecosystem</h4>
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="px-3 py-2 rounded-xl bg-cyan-100 text-cyan-700 font-bold">📡 Sensors data collect</span>
                                <span className="text-gray-400 font-bold">→</span>
                                <span className="px-3 py-2 rounded-xl bg-purple-100 text-purple-700 font-bold">🌐 Network se bheja</span>
                                <span className="text-gray-400 font-bold">→</span>
                                <span className="px-3 py-2 rounded-xl bg-green-100 text-green-800 font-bold">⚙️ Process hota</span>
                                <span className="text-gray-400 font-bold">→</span>
                                <span className="px-3 py-2 rounded-xl bg-orange-100 text-orange-700 font-bold">👤 User ko info</span>
                            </div>
                            <p className="text-xs text-green-700 mt-2">👉 Ye pura system <strong>automatically kaam karta hai</strong></p>
                        </div>
                    </Sec>

                    {/* ═══ Types of Network ═══ */}
                    <Sec id="types-of-network" title="🔴 Types of Network" icon={<Radio size={16} className="text-orange-500" />}>
                        <Def>📡 IoT system mein <strong>alag-alag type ke networks</strong> use hote hain data communication ke liye.</Def>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                            {[{ n: 'PAN', full: 'Personal Area', e: '📱', c: '#06b6d4', r: '~10m' }, { n: 'LAN', full: 'Local Area', e: '🏫', c: '#10b981', r: 'Small Area' }, { n: 'MAN', full: 'Metropolitan', e: '🏙️', c: '#8b5cf6', r: 'City Level' }, { n: 'WAN', full: 'Wide Area', e: '🌍', c: '#f97316', r: 'Global' }].map((net, i) => (
                                <div key={i} className="p-3 rounded-2xl text-center" style={{ background: `${net.c}10`, border: `1px solid ${net.c}30` }}>
                                    <div className="text-2xl mb-1">{net.e}</div>
                                    <h5 className="font-black text-sm" style={{ color: net.c }}>{net.n}</h5>
                                    <p className="text-[10px] text-gray-500">{net.full} Network</p>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white mt-1 inline-block" style={{ background: net.c }}>{net.r}</span>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #ecfeff, #cffafe)', border: '1px solid #67e8f9' }}>
                            <h4 className="font-bold text-cyan-700 mb-2">📱 (1) PAN — Personal Area Network</h4>
                            <p className="text-xs text-cyan-800 mb-2">PAN ek <strong>small range network</strong> hota hai — personal devices ke liye use hota hai.</p>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-wrap gap-2">
                                    {['🔵 Bluetooth', '📡 Mobile Hotspot'].map((s, i) => (
                                        <span key={i} className="px-2 py-1 rounded-lg bg-white text-cyan-700 text-xs font-semibold border border-cyan-200">{s}</span>
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-cyan-600 whitespace-nowrap">📏 ~10 meter</span>
                            </div>
                        </div>

                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac' }}>
                            <h4 className="font-bold text-green-700 mb-2">🏫 (2) LAN — Local Area Network</h4>
                            <p className="text-xs text-green-800 mb-2">LAN ek <strong>limited area network</strong> hota hai — school, office ya building mein use hota hai.</p>
                            <div className="flex items-center gap-4">
                                <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-semibold border border-green-200">📶 WiFi Network</span>
                                <span className="text-xs font-bold text-green-600">📏 Small Area</span>
                            </div>
                        </div>

                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '1px solid #c4b5fd' }}>
                            <h4 className="font-bold text-purple-700 mb-2">🏙️ (3) MAN — Metropolitan Area Network</h4>
                            <p className="text-xs text-purple-800 mb-2">MAN ek <strong>city level network</strong> hota hai — city mein communication ke liye use hota hai.</p>
                            <div className="flex flex-wrap gap-2">
                                {['📺 Cable TV Network', '🌐 City-wide Internet'].map((s, i) => (
                                    <span key={i} className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">{s}</span>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fdba74' }}>
                            <h4 className="font-bold text-orange-700 mb-2">🌍 (4) WAN — Wide Area Network</h4>
                            <p className="text-xs text-orange-800 mb-2">WAN <strong>sabse bada network</strong> hota hai — large area cover karta hai aur countries/continents tak connect kar sakta hai.</p>
                            <span className="px-2 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-200">🌐 Internet</span>
                        </div>

                        <IB type="note">Network size order: <strong>PAN &lt; LAN &lt; MAN &lt; WAN</strong> — chhote personal devices se lekar poori duniya tak!</IB>
                    </Sec>

                    {/* ═══ Technologies & Protocols ═══ */}
                    <Sec id="tech-protocols" title="🔹 Various Technologies & Protocols" icon={<Zap size={16} className="text-purple-500" />}>
                        <Def>📡 IoT system mein data communication aur device connectivity ke liye <strong>different wireless technologies</strong> ka use hota hai. Har technology ka apna range, speed aur use case hota hai.</Def>

                        {/* Quick Reference Table */}
                        <div className="overflow-x-auto my-4 rounded-2xl" style={{ border: '1px solid #e2e8f0' }}>
                            <table className="w-full text-xs">
                                <thead><tr style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)' }} className="text-white"><th className="px-3 py-2 text-left">Technology</th><th className="px-3 py-2 text-left">Range</th><th className="px-3 py-2 text-left">Standard</th><th className="px-3 py-2 text-left">Use Case</th></tr></thead>
                                <tbody>
                                    {[
                                        ['🔵 Bluetooth', '~10m', 'IEEE 802.15.1', 'Headphones, Watch'],
                                        ['⚡ BLE', 'Short', 'BT 4.0+', 'Fitness Band, IoT'],
                                        ['📶 WiFi', '50-100m', 'IEEE 802.11', 'Home, Office'],
                                        ['💡 LiFi', 'Room', 'IEEE 802.15.7', 'High-speed Indoor'],
                                        ['📡 Cellular', 'Wide', 'GSM/LTE/5G', 'Mobile, Remote IoT'],
                                        ['🏠 Z-Wave', '30m', 'Z-Wave Alliance', 'Smart Home'],
                                        ['🏷️ RFID', 'cm–100m', 'ISO 18000', 'Tracking, ID Cards'],
                                        ['📲 NFC', '~4cm', 'ISO 14443', 'Payments, Cards'],
                                        ['🕸️ Zigbee', '10-100m', 'IEEE 802.15.4', 'Sensor Network'],
                                        ['🌐 6LoWPAN', 'Short', 'IETF IPv6', 'IoT + Internet'],
                                        ['📞 GSM', 'Wide', 'GSM (2G)', 'Calls, SMS'],
                                        ['📦 GPRS', 'Wide', '2.5G', 'Basic Internet'],
                                        ['🚀 LTE', 'Wide', '4G (3GPP)', 'High-speed Data'],
                                    ].map(([t, r, s, u], i) => (
                                        <tr key={i} style={{ background: i % 2 === 0 ? '#fafafa' : '#ffffff', borderTop: '1px solid #f1f5f9' }}>
                                            <td className="px-3 py-2 font-semibold text-gray-700">{t}</td>
                                            <td className="px-3 py-2 text-gray-500">{r}</td>
                                            <td className="px-3 py-2 text-purple-600 font-mono text-[10px]">{s}</td>
                                            <td className="px-3 py-2 text-gray-500">{u}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Cards - Short Range */}
                        <h4 className="font-bold text-gray-700 mt-5 mb-3">📶 Short Range Technologies</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            {[
                                { emoji: '🔵', title: 'Bluetooth', std: 'IEEE 802.15.1', freq: '2.4 GHz', range: '~10m', color: '#3b82f6', uses: ['Mobile data transfer', 'Wireless earphones', 'Smart watch'], features: ['Low power', 'Easy connectivity', 'Wireless'] },
                                { emoji: '⚡', title: 'BLE (Bluetooth Low Energy)', std: 'Bluetooth 4.0+', freq: '2.4 GHz', range: 'Short', color: '#06b6d4', uses: ['Fitness band', 'Health monitors', 'IoT sensors'], features: ['Very low power', 'Long battery', 'Fast connection'] },
                                { emoji: '📶', title: 'WiFi', std: 'IEEE 802.11', freq: '2.4 / 5 GHz', range: '50–100m', color: '#10b981', uses: ['Smart TV', 'Home IoT', 'Office'], features: ['High speed', 'Internet access', 'Wide coverage'] },
                                { emoji: '💡', title: 'LiFi (Light Fidelity)', std: 'IEEE 802.15.7', freq: 'Light (LED)', range: 'Room only', color: '#f59e0b', uses: ['Indoor high-speed', 'Secure zones'], features: ['Very high speed', 'Secure', '⚠️ No wall penetration'] },
                            ].map((t, i) => (
                                <div key={i} className="rounded-2xl p-4" style={{ background: `${t.color}08`, border: `1px solid ${t.color}25` }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xl">{t.emoji}</span>
                                        <div><h5 className="font-bold text-sm" style={{ color: t.color }}>{t.title}</h5><span className="text-[10px] font-mono text-gray-400">{t.std}</span></div>
                                        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: t.color }}>{t.range}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-2">{t.uses.map((u, j) => <span key={j} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${t.color}15`, color: t.color }}>{u}</span>)}</div>
                                    <div className="text-[11px] text-gray-500">{t.features.join(' · ')}</div>
                                    {t.freq && <div className="text-[10px] text-gray-400 mt-1">📡 {t.freq}</div>}
                                </div>
                            ))}
                        </div>

                        {/* Cards - Home & IoT */}
                        <h4 className="font-bold text-gray-700 mt-4 mb-3">🏠 Home Automation & Identification</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            {[
                                { emoji: '🏠', title: 'Z-Wave', std: 'Z-Wave Alliance', freq: '800–900 MHz', range: '~30m', color: '#8b5cf6', uses: ['Smart lighting', 'Security', 'Home automation'], features: ['Low power', 'Less interference', 'Reliable'] },
                                { emoji: '🕸️', title: 'Zigbee', std: 'IEEE 802.15.4', freq: '2.4 GHz', range: '10–100m', color: '#10b981', uses: ['Smart home', 'Sensor networks', 'Industrial'], features: ['Low power', 'Mesh network', 'Long battery'] },
                                { emoji: '🏷️', title: 'RFID', std: 'ISO/IEC 18000', freq: 'Radio Waves', range: 'cm–100m', color: '#ef4444', uses: ['Tracking', 'Inventory', 'Security'], features: ['Active (battery) or Passive (no battery)', 'Automatic ID'] },
                                { emoji: '📲', title: 'NFC', std: 'ISO/IEC 14443', freq: '13.56 MHz', range: '~4cm', color: '#f97316', uses: ['Google Pay / PhonePe', 'Smart cards', 'Access control'], features: ['Instant connection', 'Secure', 'No pairing needed'] },
                            ].map((t, i) => (
                                <div key={i} className="rounded-2xl p-4" style={{ background: `${t.color}08`, border: `1px solid ${t.color}25` }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xl">{t.emoji}</span>
                                        <div><h5 className="font-bold text-sm" style={{ color: t.color }}>{t.title}</h5><span className="text-[10px] font-mono text-gray-400">{t.std}</span></div>
                                        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: t.color }}>{t.range}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-2">{t.uses.map((u, j) => <span key={j} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${t.color}15`, color: t.color }}>{u}</span>)}</div>
                                    <div className="text-[11px] text-gray-500">{t.features.join(' · ')}</div>
                                    <div className="text-[10px] text-gray-400 mt-1">📡 {t.freq}</div>
                                </div>
                            ))}
                        </div>

                        {/* RFID Types detail */}
                        <div className="rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', border: '1px solid #fca5a5' }}>
                            <h4 className="font-bold text-red-700 mb-3">🏷️ RFID Tag Types</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-white border border-red-100">
                                    <p className="font-bold text-sm text-green-700 mb-1">🟢 Active RFID Tag</p>
                                    <p className="text-xs text-gray-600 mb-2">Battery hoti hai — long range, strong signal, continuous transmission</p>
                                    <div className="flex gap-2">{['Vehicle Tracking', 'Large Systems'].map((s, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">{s}</span>)}</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white border border-red-100">
                                    <p className="font-bold text-sm text-blue-700 mb-1">🔵 Passive RFID Tag</p>
                                    <p className="text-xs text-gray-600 mb-2">Battery nahi — reader ki energy se kaam karta hai, short range, low cost</p>
                                    <div className="flex gap-2">{['ID Cards', 'Access Control'].map((s, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{s}</span>)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Wide Area / Cellular */}
                        <h4 className="font-bold text-gray-700 mt-4 mb-3">📡 Wide Area & Cellular Technologies</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            {[
                                { emoji: '📡', title: 'Cellular Network', std: 'GSM / LTE / 5G NR', range: 'Nationwide', color: '#6d28d9', uses: ['Mobile IoT', 'Remote devices'], features: ['2G · 3G · 4G · 5G', 'Long distance', 'High coverage'] },
                                { emoji: '🌐', title: '6LoWPAN', std: 'IETF IPv6', range: 'Short + Internet', color: '#0891b2', uses: ['IoT + Internet', 'Sensor networks'], features: ['Low power', 'IPv6 support', 'Direct internet comm.'] },
                                { emoji: '📞', title: 'GSM', std: 'GSM (2G)', range: 'Wide', color: '#64748b', uses: ['Mobile calls', 'SMS'], features: ['900/1800 MHz', 'SIM-based', 'Wide coverage'] },
                                { emoji: '📦', title: 'GPRS', std: '2.5G (GSM ext.)', range: 'Wide', color: '#78716c', uses: ['Basic internet', 'Data services'], features: ['Packet-based', 'Always-on', '56–114 kbps'] },
                                { emoji: '🚀', title: 'LTE (4G)', std: '4G LTE (3GPP)', range: 'Wide', color: '#dc2626', uses: ['4G internet', 'High-speed IoT'], features: ['100 Mbps+', 'Low latency', 'Best performance'] },
                            ].map((t, i) => (
                                <div key={i} className="rounded-2xl p-4" style={{ background: `${t.color}08`, border: `1px solid ${t.color}25` }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xl">{t.emoji}</span>
                                        <div><h5 className="font-bold text-sm" style={{ color: t.color }}>{t.title}</h5><span className="text-[10px] font-mono text-gray-400">{t.std}</span></div>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-2">{t.uses.map((u, j) => <span key={j} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${t.color}15`, color: t.color }}>{u}</span>)}</div>
                                    <div className="text-[11px] text-gray-500">{t.features.join(' · ')}</div>
                                </div>
                            ))}
                        </div>

                        <IB type="tip">Range comparison: <strong>NFC (4cm) &lt; Bluetooth (10m) &lt; Zigbee (100m) &lt; WiFi (100m) &lt; Cellular (nationwide)</strong></IB>
                    </Sec>

                    {/* ═══ OSI Model in IoT ═══ */}
                    <Sec id="osi-model" title="🔹 OSI Model in IoT — Layer-wise Protocols" icon={<Layers size={16} className="text-pink-500" />}>
                        <Def>📡 IoT protocols ko <strong>OSI (Open Systems Interconnection) model</strong> ke layers ke according organize kiya jata hai jisse communication properly aur systematically ho sake.</Def>
                        <p>OSI model mein <strong>7 layers</strong> hoti hain — har layer ka apna specific kaam hota hai. IoT mein har layer par <strong>different protocols</strong> use hote hain jo data ko ek device se dusri device tak pahunchate hain.</p>

                        {/* OSI Layer Diagram */}
                        <div className="my-6">
                            <h4 className="font-bold text-gray-800 mb-4 text-center">📊 OSI Model — IoT Protocol Stack</h4>
                            <div className="relative max-w-2xl mx-auto">
                                {/* Layer 7 - Application */}
                                <div className="rounded-t-2xl p-4 text-center relative" style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)', border: '2px solid #ec4899' }}>
                                    <div className="flex items-center justify-between">
                                        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm">7</span>
                                        <div className="flex-1 mx-3">
                                            <h5 className="font-black text-white text-sm">Application Layer</h5>
                                            <p className="text-[10px] text-white/80 mt-0.5">User ke saath direct interaction</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1 justify-end max-w-[55%]">
                                            {['HTTP', 'CoAP', 'MQTT', 'XMPP'].map((p, i) => (
                                                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold border border-white/30">{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Arrow */}
                                <div className="flex justify-center -my-0.5 relative z-10"><div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[8px] border-l-transparent border-r-transparent" style={{ borderTopColor: '#ec4899' }} /></div>

                                {/* Layer 6 - Presentation */}
                                <div className="p-4 text-center" style={{ background: 'linear-gradient(135deg, #a855f7, #c084fc)', border: '2px solid #a855f7', borderTop: 'none' }}>
                                    <div className="flex items-center justify-between">
                                        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm">6</span>
                                        <div className="flex-1 mx-3">
                                            <h5 className="font-black text-white text-sm">Presentation Layer</h5>
                                            <p className="text-[10px] text-white/80 mt-0.5">Data format, encryption &amp; compression</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1 justify-end max-w-[55%]">
                                            {['GDS', 'Web Sockets', 'AMQP'].map((p, i) => (
                                                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold border border-white/30">{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Arrow */}
                                <div className="flex justify-center -my-0.5 relative z-10"><div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[8px] border-l-transparent border-r-transparent" style={{ borderTopColor: '#a855f7' }} /></div>

                                {/* Layer 5 - Session */}
                                <div className="p-4 text-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', border: '2px solid #8b5cf6', borderTop: 'none' }}>
                                    <div className="flex items-center justify-between">
                                        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm">5</span>
                                        <div className="flex-1 mx-3">
                                            <h5 className="font-black text-white text-sm">Session Layer</h5>
                                            <p className="text-[10px] text-white/80 mt-0.5">Connection establish, maintain &amp; terminate</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1 justify-end max-w-[55%]">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white/70 font-medium border border-white/20 italic">Session Mgmt</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Arrow */}
                                <div className="flex justify-center -my-0.5 relative z-10"><div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[8px] border-l-transparent border-r-transparent" style={{ borderTopColor: '#8b5cf6' }} /></div>

                                {/* Layer 4 - Transport */}
                                <div className="p-4 text-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', border: '2px solid #3b82f6', borderTop: 'none' }}>
                                    <div className="flex items-center justify-between">
                                        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm">4</span>
                                        <div className="flex-1 mx-3">
                                            <h5 className="font-black text-white text-sm">Transport Layer</h5>
                                            <p className="text-[10px] text-white/80 mt-0.5">Data delivery &amp; error handling</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1 justify-end max-w-[55%]">
                                            {['TCP', 'UDP'].map((p, i) => (
                                                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold border border-white/30">{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Arrow */}
                                <div className="flex justify-center -my-0.5 relative z-10"><div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[8px] border-l-transparent border-r-transparent" style={{ borderTopColor: '#3b82f6' }} /></div>

                                {/* Layer 3 - Network */}
                                <div className="p-4 text-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #22d3ee)', border: '2px solid #06b6d4', borderTop: 'none' }}>
                                    <div className="flex items-center justify-between">
                                        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm">3</span>
                                        <div className="flex-1 mx-3">
                                            <h5 className="font-black text-white text-sm">Network Layer</h5>
                                            <p className="text-[10px] text-white/80 mt-0.5">Routing &amp; addressing</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1 justify-end max-w-[55%]">
                                            {['IPv4', 'IPv6', '6LoWPAN'].map((p, i) => (
                                                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold border border-white/30">{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Arrow */}
                                <div className="flex justify-center -my-0.5 relative z-10"><div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[8px] border-l-transparent border-r-transparent" style={{ borderTopColor: '#06b6d4' }} /></div>

                                {/* Layer 2 - Data Link */}
                                <div className="p-4 text-center" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', border: '2px solid #10b981', borderTop: 'none' }}>
                                    <div className="flex items-center justify-between">
                                        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm">2</span>
                                        <div className="flex-1 mx-3">
                                            <h5 className="font-black text-white text-sm">Data Link Layer</h5>
                                            <p className="text-[10px] text-white/80 mt-0.5">Node-to-node data transfer</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1 justify-end max-w-[55%]">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold border border-white/30">MAC Address</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Arrow */}
                                <div className="flex justify-center -my-0.5 relative z-10"><div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[8px] border-l-transparent border-r-transparent" style={{ borderTopColor: '#10b981' }} /></div>

                                {/* Layer 1 - Physical */}
                                <div className="rounded-b-2xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', border: '2px solid #f97316', borderTop: 'none' }}>
                                    <div className="flex items-center justify-between">
                                        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm">1</span>
                                        <div className="flex-1 mx-3">
                                            <h5 className="font-black text-white text-sm">Physical Layer</h5>
                                            <p className="text-[10px] text-white/80 mt-0.5">Physical medium — wires, signals</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1 justify-end max-w-[55%]">
                                            {['802.3 Ethernet', '802.16 WiMax', '802.11 WiFi', 'Cellular'].map((p, i) => (
                                                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold border border-white/30">{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Layer-wise Detailed Explanation */}
                        <h4 className="font-bold text-gray-800 mt-6 mb-3">📌 Layer-wise Protocol Details</h4>

                        {/* Layer 7 Detail */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)', border: '1px solid #f9a8d4' }}>
                            <h4 className="font-bold text-pink-700 mb-2">📱 Layer 7 — Application Layer</h4>
                            <p className="text-xs text-pink-800 mb-2">Ye layer <strong>user ke sabse close</strong> hoti hai — yahan protocols directly applications se interact karte hain.</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                    { p: 'HTTP', d: 'Web browsing ke liye' },
                                    { p: 'CoAP', d: 'Lightweight IoT protocol' },
                                    { p: 'MQTT', d: 'Publish-subscribe messaging' },
                                    { p: 'XMPP', d: 'Real-time messaging' },
                                ].map((item, i) => (
                                    <div key={i} className="p-2 rounded-xl bg-white border border-pink-200 text-center">
                                        <p className="font-black text-xs text-pink-700">{item.p}</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Layer 6 Detail */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '1px solid #c4b5fd' }}>
                            <h4 className="font-bold text-purple-700 mb-2">🔄 Layer 6 — Presentation Layer</h4>
                            <p className="text-xs text-purple-800 mb-2">Data ko <strong>format, encrypt aur compress</strong> karta hai taaki dono sides samajh sakein.</p>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { p: 'GDS', d: 'Data structure format' },
                                    { p: 'Web Sockets', d: 'Full-duplex communication' },
                                    { p: 'AMQP', d: 'Advanced message queuing' },
                                ].map((item, i) => (
                                    <div key={i} className="p-2 rounded-xl bg-white border border-purple-200 text-center">
                                        <p className="font-black text-xs text-purple-700">{item.p}</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Layer 5 Detail */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', border: '1px solid #a5b4fc' }}>
                            <h4 className="font-bold text-indigo-700 mb-2">🤝 Layer 5 — Session Layer</h4>
                            <p className="text-xs text-indigo-800">Ye layer <strong>connection ko establish, maintain aur terminate</strong> karta hai. IoT mein session management ke through devices ke beech communication sessions handle hote hain.</p>
                        </div>

                        {/* Layer 4 Detail */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #93c5fd' }}>
                            <h4 className="font-bold text-blue-700 mb-2">🚚 Layer 4 — Transport Layer</h4>
                            <p className="text-xs text-blue-800 mb-2">Data ko <strong>reliably deliver</strong> karta hai — error checking aur flow control karta hai.</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-white border border-blue-200">
                                    <p className="font-black text-sm text-blue-700 mb-1">TCP</p>
                                    <p className="text-[10px] text-gray-500">Transmission Control Protocol — <strong>reliable</strong>, connection-oriented, data loss nahi hota</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white border border-blue-200">
                                    <p className="font-black text-sm text-blue-700 mb-1">UDP</p>
                                    <p className="text-[10px] text-gray-500">User Datagram Protocol — <strong>fast</strong>, connectionless, IoT sensors ke liye best</p>
                                </div>
                            </div>
                        </div>

                        {/* Layer 3 Detail */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #ecfeff, #cffafe)', border: '1px solid #67e8f9' }}>
                            <h4 className="font-bold text-cyan-700 mb-2">🗺️ Layer 3 — Network Layer</h4>
                            <p className="text-xs text-cyan-800 mb-2">Data ko <strong>source se destination tak route</strong> karta hai — IP addressing use hoti hai.</p>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { p: 'IPv4', d: '32-bit address' },
                                    { p: 'IPv6', d: '128-bit address — IoT future' },
                                    { p: '6LoWPAN', d: 'IPv6 over low-power networks' },
                                ].map((item, i) => (
                                    <div key={i} className="p-2 rounded-xl bg-white border border-cyan-200 text-center">
                                        <p className="font-black text-xs text-cyan-700">{item.p}</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Layer 2 Detail */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac' }}>
                            <h4 className="font-bold text-green-700 mb-2">🔗 Layer 2 — Data Link Layer</h4>
                            <p className="text-xs text-green-800 mb-2">Ye layer <strong>node-to-node data transfer</strong> karta hai aur error detection handle karta hai.</p>
                            <div className="p-3 rounded-xl bg-white border border-green-200 inline-block">
                                <p className="font-black text-xs text-green-700">MAC Address</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">Har device ka unique physical address — device identify karne ke liye</p>
                            </div>
                        </div>

                        {/* Layer 1 Detail */}
                        <div className="rounded-2xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fdba74' }}>
                            <h4 className="font-bold text-orange-700 mb-2">⚡ Layer 1 — Physical Layer</h4>
                            <p className="text-xs text-orange-800 mb-2">Ye layer <strong>actual physical medium</strong> hai jiske through data bits transfer hote hain.</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                    { p: '802.3', d: 'Ethernet (Wired)' },
                                    { p: '802.16', d: 'WiMax (Long range)' },
                                    { p: '802.11', d: 'WiFi (Wireless LAN)' },
                                    { p: 'Cellular', d: '2G / 3G / LTE / 5G' },
                                ].map((item, i) => (
                                    <div key={i} className="p-2 rounded-xl bg-white border border-orange-200 text-center">
                                        <p className="font-black text-xs text-orange-700">{item.p}</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Summary Table */}
                        <h4 className="font-bold text-gray-800 mt-5 mb-3">📋 Quick Summary Table</h4>
                        <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid #e2e8f0' }}>
                            <table className="w-full text-xs">
                                <thead><tr style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }} className="text-white"><th className="px-3 py-2 text-left">Layer</th><th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Protocols / Standards</th><th className="px-3 py-2 text-left">Kaam</th></tr></thead>
                                <tbody>
                                    {[
                                        ['7', 'Application', 'HTTP, CoAP, MQTT, XMPP', 'User interaction'],
                                        ['6', 'Presentation', 'GDS, Web Sockets, AMQP', 'Data format & encryption'],
                                        ['5', 'Session', 'Session Management', 'Connection manage'],
                                        ['4', 'Transport', 'TCP, UDP', 'Data delivery'],
                                        ['3', 'Network', 'IPv4, IPv6, 6LoWPAN', 'Routing & addressing'],
                                        ['2', 'Data Link', 'MAC Address', 'Node-to-node transfer'],
                                        ['1', 'Physical', '802.3, 802.16, 802.11, Cellular', 'Physical signals'],
                                    ].map(([l, n, p, k], i) => (
                                        <tr key={i} style={{ background: i % 2 === 0 ? '#fafafa' : '#ffffff', borderTop: '1px solid #f1f5f9' }}>
                                            <td className="px-3 py-2 font-black text-pink-600">{l}</td>
                                            <td className="px-3 py-2 font-semibold text-gray-700">{n}</td>
                                            <td className="px-3 py-2 text-purple-600 font-mono text-[10px]">{p}</td>
                                            <td className="px-3 py-2 text-gray-500">{k}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <IB type="tip">OSI Model ko yaad rakhne ka trick: <strong>&quot;All People Seem To Need Data Processing&quot;</strong> — Application → Presentation → Session → Transport → Network → Data Link → Physical (top to bottom)</IB>
                        <IB type="note">IoT mein mostly <strong>UDP</strong> prefer hota hai TCP ke comparison mein kyunki IoT devices ko <strong>fast aur lightweight</strong> communication chahiye!</IB>
                    </Sec>

                    {/* ═══ IoT Protocols Detail ═══ */}
                    <Sec id="iot-protocols-detail" title="🔹 IoT Protocols — Detailed Explanation" icon={<Cpu size={16} className="text-cyan-600" />}>
                        <Def>📡 IoT mein different <strong>application layer protocols</strong> use hote hain jo devices ke beech communication ko possible banate hain. Har protocol ka apna specific use case aur working style hota hai.</Def>

                        {/* ── HTTP ── */}
                        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '2px solid #93c5fd' }}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>1</span>
                                <div><h4 className="font-black text-blue-800 text-base">🌐 HTTP</h4><p className="text-[10px] text-blue-500 font-mono">Hyper Text Transfer Protocol</p></div>
                            </div>
                            <img src="/sample-assets/placeholder.svg" alt="HTTP Request-Response Diagram" className="w-full rounded-xl mb-3 border border-blue-200" />
                            <p className="text-xs text-blue-900 mb-3">HTTP ek <strong>request-response protocol</strong> hai. Iska use internet mein browser ke dwara kisi host par communication karne ke liye kiya jata hai.</p>
                            <div className="rounded-xl p-3 mb-3 bg-white border border-blue-200">
                                <h5 className="font-bold text-xs text-blue-700 mb-2">⚙️ Kaise kaam karta hai?</h5>
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 font-semibold">🖥️ Client (Browser)</span>
                                    <span className="text-blue-600 font-bold">→ Request →</span>
                                    <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 font-semibold">🌐 Server</span>
                                    <span className="text-blue-600 font-bold">→ Response →</span>
                                    <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 font-semibold">🖥️ Client</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {['GET — Data lena', 'POST — Data bhejna', 'PUT — Data update', 'DELETE — Data delete'].map((s, i) => (
                                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold border border-blue-200">{s}</span>
                                ))}
                            </div>
                            <IB type="note">HTTP website par communication establish karta hai — ye IoT ka <strong>sabse common protocol</strong> hai web-based applications ke liye.</IB>
                        </div>

                        {/* ── CoAP ── */}
                        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '2px solid #86efac' }}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>2</span>
                                <div><h4 className="font-black text-green-800 text-base">📡 CoAP</h4><p className="text-[10px] text-green-500 font-mono">Constrained Application Protocol</p></div>
                            </div>
                            <img src="/sample-assets/placeholder.svg" alt="CoAP Protocol Diagram" className="w-full rounded-xl mb-3 border border-green-200" />
                            <p className="text-xs text-green-900 mb-3">Ye protocol internet par communication karne ke liye use hota hai. Ye ek <strong>lightweight protocol</strong> hai jo <strong>low power devices</strong> ke liye useful hota hai.</p>
                            <div className="rounded-xl p-3 mb-3 bg-white border border-green-200">
                                <h5 className="font-bold text-xs text-green-700 mb-2">🔄 HTTP vs CoAP</h5>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-center">
                                        <p className="font-bold text-xs text-blue-700">HTTP</p>
                                        <p className="text-[10px] text-gray-600">Heavy · TCP · Web ke liye</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-green-50 border border-green-200 text-center">
                                        <p className="font-bold text-xs text-green-700">CoAP ✅</p>
                                        <p className="text-[10px] text-gray-500">Light · UDP · IoT ke liye</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['🪶 Lightweight', '⚡ UDP Based', '🔄 RESTful', '📱 IoT Optimized'].map((s, i) => (
                                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-green-50 text-green-700 font-semibold border border-green-200">{s}</span>
                                ))}
                            </div>
                            <IB type="tip">CoAP ko samjho <strong>HTTP ka chhota bhai</strong> — same kaam karta hai lekin IoT devices ke liye zyada suitable hai kyunki <strong>kam power aur bandwidth</strong> use karta hai!</IB>
                        </div>

                        {/* ── MQTT ── */}
                        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '2px solid #c4b5fd' }}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>3</span>
                                <div><h4 className="font-black text-purple-800 text-base">📨 MQTT</h4><p className="text-[10px] text-purple-500 font-mono">Message Queue Telemetry Transport</p></div>
                            </div>
                            <img src="/sample-assets/placeholder.svg" alt="MQTT Publish-Subscribe Diagram" className="w-full rounded-xl mb-3 border border-purple-200" />
                            <p className="text-xs text-purple-900 mb-3">Ye <strong>machine to machine communication</strong> ke liye use hota hai. Ye ek <strong>publish-subscribe protocol</strong> hai jo TCP par kaam karta hai.</p>
                            <div className="rounded-xl p-3 mb-3 bg-white border border-purple-200">
                                <h5 className="font-bold text-xs text-purple-700 mb-2">🔄 MQTT Working Flow</h5>
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 font-semibold">📡 Publisher</span>
                                    <span className="text-purple-600 font-bold">→ Data →</span>
                                    <span className="px-3 py-2 rounded-lg bg-purple-200 text-purple-800 font-black">🏢 BROKER</span>
                                    <span className="text-purple-600 font-bold">→ Data →</span>
                                    <span className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 font-semibold">📱 Subscriber</span>
                                </div>
                            </div>
                            <div className="text-xs text-purple-800 space-y-1.5 mb-3 p-3 rounded-xl bg-purple-50 border border-purple-200">
                                <p>👉 Client <strong>publisher ya subscriber</strong> ho sakta hai</p>
                                <p>👉 Ek <strong>broker</strong> hota hai jo data ko manage karta hai</p>
                                <p>👉 Client TCP ke madhyam se broker se <strong>connected</strong> rehta hai</p>
                                <p>👉 Client <strong>publish aur subscribe dono</strong> kar sakta hai</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['🪶 Lightweight', '📤 Publish-Subscribe', '🔗 TCP Based', '🤖 M2M Communication'].map((s, i) => (
                                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-semibold border border-purple-200">{s}</span>
                                ))}
                            </div>
                            <IB type="tip">MQTT IoT ka <strong>sabse popular protocol</strong> hai — jahan bhi sensor data ko efficiently bhejne ki zarurat ho, wahan MQTT use hota hai!</IB>
                        </div>

                        {/* ── XMPP ── */}
                        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '2px solid #fdba74' }}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>4</span>
                                <div><h4 className="font-black text-orange-800 text-base">💬 XMPP</h4><p className="text-[10px] text-orange-500 font-mono">Extensible Messaging and Presence Protocol</p></div>
                            </div>
                            <img src="/sample-assets/placeholder.svg" alt="XMPP Protocol Diagram" className="w-full rounded-xl mb-3 border border-orange-200" />
                            <p className="text-xs text-orange-900 mb-3">Ye protocol <strong>XML language</strong> par aadharit hota hai. Iska use communication ke liye kiya jata hai jisme <strong>message transfer</strong> kiya jata hai.</p>
                            <div className="text-xs text-orange-800 space-y-1.5 mb-3 p-3 rounded-xl bg-orange-50 border border-orange-200">
                                <p>👉 Isse different devices ke beech <strong>extensible data share</strong> kiya ja sakta hai</p>
                                <p>👉 IoT network mein ye <strong>publish-subscribe system</strong> ke roop mein bhi use hota hai</p>
                                <p>👉 <strong>Real-time messaging</strong> aur <strong>presence detection</strong> support karta hai</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['📝 XML Based', '💬 Real-time Messaging', '👤 Presence Detection', '🔄 Extensible'].map((s, i) => (
                                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 font-semibold border border-orange-200">{s}</span>
                                ))}
                            </div>
                            <IB type="note">XMPP ka use pehle <strong>WhatsApp aur Google Talk</strong> jaise messaging apps mein hota tha — ab IoT mein bhi device messaging ke liye use hota hai!</IB>
                        </div>

                        {/* ── DDS ── */}
                        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', border: '2px solid #fca5a5' }}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>5</span>
                                <div><h4 className="font-black text-red-800 text-base">⚡ DDS</h4><p className="text-[10px] text-red-500 font-mono">Data Distribution Service</p></div>
                            </div>
                            <img src="/sample-assets/placeholder.svg" alt="DDS Protocol Diagram" className="w-full rounded-xl mb-3 border border-red-200" />
                            <p className="text-xs text-red-900 mb-3">Ye protocol <strong>OS aur software ke beech data transfer</strong> karne ke liye use hota hai. Iska use <strong>real-time communication</strong> ke liye kiya jata hai.</p>
                            <div className="rounded-xl p-3 mb-3 bg-white border border-red-200">
                                <h5 className="font-bold text-xs text-red-700 mb-2">🔄 DDS vs MQTT</h5>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-2 rounded-lg bg-purple-50 border border-purple-200 text-center">
                                        <p className="font-bold text-xs text-purple-700">MQTT</p>
                                        <p className="text-[10px] text-gray-500">Broker zaruri · Centralized</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-center">
                                        <p className="font-bold text-xs text-red-700">DDS ✅</p>
                                        <p className="text-[10px] text-gray-600">No Broker · Peer-to-Peer</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['⚡ Real-time', '🔗 Peer-to-Peer', '🚫 No Broker', '🏭 Industrial Use'].map((s, i) => (
                                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-semibold border border-red-200">{s}</span>
                                ))}
                            </div>
                            <IB type="warning">DDS ka use mostly <strong>military, healthcare aur industrial systems</strong> mein hota hai jahan <strong>real-time data</strong> bahut important hota hai!</IB>
                        </div>

                        {/* ── AMQP ── */}
                        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #ecfeff, #cffafe)', border: '2px solid #67e8f9' }}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: 'linear-gradient(135deg, #0891b2, #0e7490)' }}>6</span>
                                <div><h4 className="font-black text-cyan-800 text-base">📦 AMQP</h4><p className="text-[10px] text-cyan-500 font-mono">Advanced Message Queuing Protocol</p></div>
                            </div>
                            <img src="/sample-assets/placeholder.svg" alt="AMQP Protocol Diagram" className="w-full rounded-xl mb-3 border border-cyan-200" />
                            <p className="text-xs text-cyan-900 mb-3">Iska use <strong>devices ko jodne</strong> ke liye kiya jata hai. Ye protocol devices ke beech <strong>data transfer ke saath-saath data ko store</strong> bhi karta hai.</p>
                            <div className="rounded-xl p-3 mb-3 bg-white border border-cyan-200">
                                <h5 className="font-bold text-xs text-cyan-700 mb-2">⚙️ AMQP Working</h5>
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className="px-3 py-1.5 rounded-lg bg-cyan-100 text-cyan-700 font-semibold">📤 Producer</span>
                                    <span className="text-cyan-700 font-bold">→</span>
                                    <span className="px-3 py-1.5 rounded-lg bg-cyan-100 text-cyan-700 font-semibold">📬 Exchange</span>
                                    <span className="text-cyan-700 font-bold">→</span>
                                    <span className="px-3 py-2 rounded-lg bg-cyan-200 text-cyan-800 font-black">📦 Queue (Store)</span>
                                    <span className="text-cyan-700 font-bold">→</span>
                                    <span className="px-3 py-1.5 rounded-lg bg-cyan-100 text-cyan-700 font-semibold">📥 Consumer</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['📦 Message Queuing', '💾 Store & Forward', '🔗 Device Connecting', '🔒 Reliable Delivery'].map((s, i) => (
                                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-700 font-semibold border border-cyan-200">{s}</span>
                                ))}
                            </div>
                            <IB type="tip">AMQP ka special feature hai ki ye <strong>data ko store karke rakhta hai</strong> — agar receiver offline ho to bhi message baad mein deliver ho jata hai!</IB>
                        </div>

                        {/* Protocol Comparison Table */}
                        <h4 className="font-bold text-gray-800 mt-5 mb-3">📋 All Protocols — Quick Comparison</h4>
                        <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid #e2e8f0' }}>
                            <table className="w-full text-xs">
                                <thead><tr style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }} className="text-white"><th className="px-3 py-2 text-left">Protocol</th><th className="px-3 py-2 text-left">Full Form</th><th className="px-3 py-2 text-left">Type</th><th className="px-3 py-2 text-left">Use Case</th></tr></thead>
                                <tbody>
                                    {[
                                        ['🌐 HTTP', 'Hyper Text Transfer Protocol', 'Request-Response', 'Web browsing'],
                                        ['📡 CoAP', 'Constrained Application Protocol', 'Request-Response (UDP)', 'Low power IoT'],
                                        ['📨 MQTT', 'Message Queue Telemetry Transport', 'Publish-Subscribe', 'Sensor data, M2M'],
                                        ['💬 XMPP', 'Extensible Messaging & Presence', 'XML Messaging', 'Real-time chat, IoT'],
                                        ['⚡ DDS', 'Data Distribution Service', 'Peer-to-Peer', 'Real-time systems'],
                                        ['📦 AMQP', 'Advanced Message Queuing', 'Message Queue', 'Device connectivity'],
                                    ].map(([p, f, t, u], i) => (
                                        <tr key={i} style={{ background: i % 2 === 0 ? '#fafafa' : '#ffffff', borderTop: '1px solid #f1f5f9' }}>
                                            <td className="px-3 py-2 font-bold text-gray-700">{p}</td>
                                            <td className="px-3 py-2 text-gray-500 text-[10px]">{f}</td>
                                            <td className="px-3 py-2 text-cyan-600 font-semibold">{t}</td>
                                            <td className="px-3 py-2 text-gray-500">{u}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <IB type="tip">IoT mein sabse zyada use hone wale protocols: <strong>MQTT</strong> (sensor data), <strong>CoAP</strong> (lightweight IoT), aur <strong>HTTP</strong> (web apps) hain!</IB>
                    </Sec>

                    {/* ═══ Network Layer (Deep Theory) ═══ */}
                    <Sec id="network-layer-deep" title="🔹 Network Layer" icon={<Globe size={16} className="text-cyan-500" />}>
                        <Def>🌐 Network layer IoT communication system ka ek bahut important part hota hai jo data ko source (sender) se destination (receiver) tak pahunchane ka kaam karta hai.</Def>

                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #ecfeff, #cffafe)', border: '1px solid #67e8f9' }}>
                            <h4 className="font-bold text-cyan-700 mb-2">🎯 Network Layer ke main functions</h4>
                            <div className="space-y-2 text-sm text-cyan-800">
                                <p>👉 <strong>Addressing:</strong> Har device ko ek unique IP address diya jata hai</p>
                                <p>👉 <strong>Routing:</strong> Data kis path se jayega (shortest / fastest route) ye decide karta hai</p>
                                <p>👉 <strong>Packet forwarding:</strong> Data packets ko next device tak forward karta hai</p>
                            </div>
                        </div>

                        <IB type="tip">Simple samajh: <strong>&quot;Network layer = data ko sahi raste se sahi jagah tak pahunchana&quot;</strong></IB>

                        <h4 className="font-bold text-gray-800 mt-5 mb-3">📌 Use hone wale protocols</h4>

                        {/* IPv4 Section */}
                        <div className="rounded-2xl p-5 mb-4" style={{ background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', border: '1px solid #fca5a5' }}>
                            <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">🔴 IPv4 (Internet Protocol Version 4)</h4>
                            <p className="text-sm text-red-800 mb-3">IPv4 ek addressing system hai jo devices ko internet par identify karne ke liye use hota hai.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                <div className="p-3 rounded-xl bg-white border border-red-200">
                                    <p className="font-bold text-xs text-red-700 mb-1">⚙️ Isme kya hota hai?</p>
                                    <ul className="text-[10px] text-gray-600 space-y-1">
                                        <li>• 32-bit address hota hai</li>
                                        <li>• Address ko 4 parts me divide kiya jata hai</li>
                                        <li>• Har part 8-bit ka hota hai (0–255 range)</li>
                                    </ul>
                                </div>
                                <div className="p-3 rounded-xl bg-white border border-red-200">
                                    <p className="font-bold text-xs text-red-700 mb-1">📝 Format &amp; Limitations</p>
                                    <p className="text-[10px] text-gray-600"><strong>Example:</strong> 192.168.1.1</p>
                                    <p className="text-[10px] text-gray-600 mt-1"><strong>Limitation:</strong> Limited addresses (approx 4.3 billion) — IoT me devices bahut zyada hote hain isliye address shortage hoti hai.</p>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                                <h5 className="font-bold text-xs text-red-700 mb-1">🔄 Working samajh</h5>
                                <p className="text-[11px] text-red-800">Jab koi device internet par data bhejta hai, sender aur receiver dono ka IP address use hota hai. Data packet ke header me address attach hota hai aur network us address ke basis par data deliver karta hai.</p>
                            </div>
                        </div>

                        {/* IPv6 Section */}
                        <div className="rounded-2xl p-5 mb-4" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '1px solid #c4b5fd' }}>
                            <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">🟣 IPv6 (Internet Protocol Version 6)</h4>
                            <p className="text-sm text-purple-800 mb-3">IPv6 IPv4 ka upgraded version hai jo address shortage problem ko solve karta hai.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                <div className="p-3 rounded-xl bg-white border border-purple-200">
                                    <p className="font-bold text-xs text-purple-700 mb-1">⚙️ Isme kya hota hai?</p>
                                    <ul className="text-[10px] text-gray-600 space-y-1">
                                        <li>• 128-bit address hota hai</li>
                                        <li>• Bahut huge number of addresses available hote hain</li>
                                    </ul>
                                </div>
                                <div className="p-3 rounded-xl bg-white border border-purple-200">
                                    <p className="font-bold text-xs text-purple-700 mb-1">📝 Format</p>
                                    <p className="text-[10px] text-gray-600 break-all"><strong>Example:</strong><br />2001:0db8:85a3:0000:0000:8a2e:0370:7334</p>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                                <h5 className="font-bold text-xs text-purple-700 mb-1">🌟 Features &amp; Importance in IoT</h5>
                                <div className="flex flex-wrap gap-2 text-[10px]">
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg border border-purple-200">Unlimited space</span>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg border border-purple-200">Better security</span>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg border border-purple-200">Faster routing</span>
                                </div>
                                <p className="text-[11px] text-purple-800 mt-2">IoT me millions of devices hote hain → har device ko unique address chahiye. Isliye IPv6 use hota hai.</p>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ Physical Layer (Deep Theory) ═══ */}
                    <Sec id="physical-layer-deep" title="🔹 Physical Layer" icon={<Zap size={16} className="text-orange-500" />}>
                        <Def>⚡ Physical layer OSI model ki sabse lowest layer hoti hai jo actual hardware level par data transmission karti hai.</Def>

                        <div className="rounded-2xl p-4 my-4" style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fdba74' }}>
                            <h4 className="font-bold text-orange-700 mb-2">⚙️ Is layer ka kaam</h4>
                            <div className="space-y-2 text-sm text-orange-800">
                                <p>👉 Data ko <strong>electrical signals / radio signals</strong> me convert karna</p>
                                <p>👉 <strong>Physical medium</strong> (wire ya wireless) ke through data bhejna</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="text-xs font-bold text-gray-700 mr-2">Examples:</span>
                            {['Ethernet', 'WiFi', 'LTE', 'Fiber'].map((s, i) => (
                                <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold border border-gray-200">{s}</span>
                            ))}
                        </div>

                        <IB type="tip">Simple samajh: <strong>&quot;Physical layer = real world me data ka travel (wire ya signal ke through)&quot;</strong></IB>

                        {/* Ethernet Section */}
                        <div className="rounded-2xl p-5 mt-5" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #93c5fd' }}>
                            <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">🔌 IEEE 802.3 Ethernet (Very Important)</h4>
                            <p className="text-sm text-blue-800 mb-3">IEEE 802.3 Ethernet ek <strong>wired communication technology</strong> hai jo LAN (Local Area Network) me use hoti hai.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                <div className="p-3 rounded-xl bg-white border border-blue-200">
                                    <p className="font-bold text-xs text-blue-700 mb-1">✅ Ethernet kya karta hai?</p>
                                    <ul className="text-[11px] text-gray-600 space-y-1">
                                        <li>• Devices ko cable ke through connect karta hai</li>
                                        <li>• Data ko fast aur reliable tarike se transfer karta hai</li>
                                    </ul>
                                </div>
                                <div className="p-3 rounded-xl bg-white border border-blue-200">
                                    <p className="font-bold text-xs text-blue-700 mb-1">🌟 Features of Ethernet</p>
                                    <ul className="text-[11px] text-gray-600 space-y-1">
                                        <li>• High speed data transfer</li>
                                        <li>• Reliable communication</li>
                                        <li>• Stable connection (wire hone ki wajah se)</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                                    <h5 className="font-bold text-xs text-blue-700 mb-1">🔄 Working samajh</h5>
                                    <p className="text-[10px] text-blue-800">Devices LAN cable se connect hote hain. Data frames ke form me bheja jata hai aur MAC address ke through identify hota hai.</p>
                                </div>
                                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                                    <h5 className="font-bold text-xs text-blue-700 mb-1">📍 Use kaha hota hai?</h5>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-md border border-blue-200">Office network</span>
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-md border border-blue-200">School labs</span>
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-md border border-blue-200">Industrial networks</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ IoT Communication Models ═══ */}
                    <Sec id="comm-models" title="🔹 IoT Communication Models" icon={<Radio size={16} className="text-emerald-500" />}>
                        <Def>📡 IoT me devices ek dusre ke saath communicate karne ke liye <strong>alag-alag models</strong> use karte hain. Har model ka apna working style aur use case hota hai.</Def>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                            {[{ n: '1', t: 'Request-Response', c: '#3b82f6' }, { n: '2', t: 'Publish-Subscribe', c: '#8b5cf6' }, { n: '3', t: 'Push-Pull', c: '#f59e0b' }, { n: '4', t: 'Exclusive Pair', c: '#10b981' }].map((m, i) => (
                                <div key={i} className="p-3 rounded-2xl text-center" style={{ background: `${m.c}10`, border: `1px solid ${m.c}30` }}>
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black mx-auto mb-1" style={{ background: m.c }}>{m.n}</div>
                                    <h5 className="font-bold text-[11px]" style={{ color: m.c }}>{m.t}</h5>
                                </div>
                            ))}
                        </div>

                        {/* Model 1: Request-Response */}
                        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #93c5fd' }}>
                            <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">🔄 (1) Request-Response Model</h4>
                            <p className="text-sm text-blue-800 mb-3">Ye ek basic communication model hai jo <strong>client-server architecture</strong> par based hota hai.</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-white border border-blue-200">
                                    <p className="font-bold text-xs text-blue-700 mb-1">⚙️ Working</p>
                                    <ul className="text-[11px] text-gray-600 space-y-1">
                                        <li>• Client request bhejta hai</li>
                                        <li>• Server request ko process karta hai</li>
                                        <li>• Server response client ko bhejta hai</li>
                                    </ul>
                                </div>
                                <div className="p-3 rounded-xl bg-white border border-blue-200">
                                    <p className="font-bold text-xs text-blue-700 mb-1">📌 Important</p>
                                    <ul className="text-[11px] text-gray-600 space-y-1">
                                        <li>• Communication request ke bina start nahi hota</li>
                                        <li>• HTTP protocol me yahi use hota hai</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white border border-blue-200 mb-3 shadow-sm overflow-hidden flex justify-center">
                                <img src="/sample-assets/placeholder.svg" alt="Request-Response Diagram" className="max-w-full h-auto rounded-lg" />
                            </div>

                            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                                <p className="font-bold text-xs text-blue-700 mb-1">💡 Example (PDF/Web Concept)</p>
                                <p className="text-[11px] text-blue-800">Jab hum browser me kisi website ko open karte hain: Browser (client) request bhejta hai, aur Server website ka data bhejta hai.</p>
                            </div>
                        </div>

                        {/* Model 2: Publish-Subscribe */}
                        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '1px solid #c4b5fd' }}>
                            <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">📢 (2) Publish-Subscribe Model</h4>
                            <p className="text-sm text-purple-800 mb-3">Ye model <strong>MQTT</strong> jaise protocols me use hota hai, jisme 3 components hote hain: Publisher, Broker, Subscriber.</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-white border border-purple-200">
                                    <p className="font-bold text-xs text-purple-700 mb-1">⚙️ Working</p>
                                    <ul className="text-[11px] text-gray-600 space-y-1">
                                        <li>• Publisher data ko publish karta hai</li>
                                        <li>• Data broker ke paas jata hai</li>
                                        <li>• Broker us data ko subscribers tak bhejta hai</li>
                                        <li>• Subscriber directly publisher se connect nahi hota</li>
                                    </ul>
                                </div>
                                <div className="p-3 rounded-xl bg-white border border-purple-200">
                                    <p className="font-bold text-xs text-purple-700 mb-1">📌 Important Points</p>
                                    <ul className="text-[11px] text-gray-600 space-y-1">
                                        <li>• Data topics ke basis par share hota hai</li>
                                        <li>• Loose coupling (direct connection nahi)</li>
                                        <li>• IoT systems ke liye bahut efficient hai</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white border border-purple-200 mb-3 shadow-sm overflow-hidden flex justify-center">
                                <img src="/sample-assets/placeholder.svg" alt="Publish-Subscribe Diagram" className="max-w-full h-auto rounded-lg" />
                            </div>

                            <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                                <p className="font-bold text-xs text-purple-700 mb-1">💡 Example</p>
                                <p className="text-[11px] text-purple-800">Temperature sensor data ko publish karta hai, aur User ki Mobile app us data ko receive karne ke liye subscribe karti hai.</p>
                            </div>
                        </div>

                        {/* Model 3: Push-Pull */}
                        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fdba74' }}>
                            <h4 className="font-bold text-orange-700 mb-2 flex items-center gap-2">📥 (3) Push-Pull Model</h4>
                            <p className="text-sm text-orange-800 mb-3">Ye model data ko <strong>queue</strong> ke through transfer karta hai. Isme 2 roles hote hain: Producer (Push) aur Consumer (Pull).</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-white border border-orange-200">
                                    <p className="font-bold text-xs text-orange-700 mb-1">⚙️ Working</p>
                                    <ul className="text-[11px] text-gray-600 space-y-1">
                                        <li>• Producer data ko queue me push karta hai</li>
                                        <li>• Consumer queue se data pull karta hai</li>
                                        <li>• Queue ek buffer ki tarah kaam karta hai</li>
                                    </ul>
                                </div>
                                <div className="p-3 rounded-xl bg-white border border-orange-200">
                                    <p className="font-bold text-xs text-orange-700 mb-1">📌 Important Points</p>
                                    <ul className="text-[11px] text-gray-600 space-y-1">
                                        <li>• Data temporarily store hota hai</li>
                                        <li>• Multiple consumers ek hi queue use kar sakte hain</li>
                                        <li>• Load balancing bahut easy hota hai</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white border border-orange-200 mb-3 shadow-sm overflow-hidden flex justify-center">
                                <img src="/sample-assets/placeholder.svg" alt="Push-Pull Diagram" className="max-w-full h-auto rounded-lg" />
                            </div>

                            <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                                <p className="font-bold text-xs text-orange-700 mb-1">💡 Example</p>
                                <p className="text-[11px] text-orange-800">Sensor data lagatar queue me store hota rehta hai, aur multiple systems apne hisab se us data ko read (pull) karte rehte hain.</p>
                            </div>
                        </div>

                        {/* Model 4: Exclusive Pair */}
                        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac' }}>
                            <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">🤝 (4) Exclusive Pair Model</h4>
                            <p className="text-sm text-green-800 mb-3">Ye ek <strong>one-to-one communication model</strong> hai jisme sirf do devices direct connect hote hain aur ek dusre ko message bhej sakte hain.</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-white border border-green-200">
                                    <p className="font-bold text-xs text-green-700 mb-1">⚙️ Working</p>
                                    <ul className="text-[11px] text-gray-600 space-y-1">
                                        <li>• Continuous connection maintain hota hai</li>
                                        <li>• Full duplex communication (dono side se ek saath) hota hai</li>
                                    </ul>
                                </div>
                                <div className="p-3 rounded-xl bg-white border border-green-200">
                                    <p className="font-bold text-xs text-green-700 mb-1">📌 Important Points</p>
                                    <ul className="text-[11px] text-gray-600 space-y-1">
                                        <li>• Direct communication hota hai</li>
                                        <li>• Koi third party ya broker nahi hota</li>
                                        <li>• Secure connection hota hai</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white border border-green-200 mb-3 shadow-sm overflow-hidden flex justify-center">
                                <img src="/sample-assets/placeholder.svg" alt="Exclusive Pair Diagram" className="max-w-full h-auto rounded-lg" />
                            </div>

                            <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                                <p className="font-bold text-xs text-green-700 mb-1">💡 Example</p>
                                <p className="text-[11px] text-green-800">Client ↔ Server ke beech direct websocket communication ya phir <strong>Bluetooth pairing</strong> (jaise Mobile aur Wireless Earphones ka connection).</p>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ Development Tools ═══ */}
                    <Sec id="dev-tools" title="🔴 Development Tools Used in IoT" icon={<Cpu size={16} className="text-purple-500" />}>
                        <Def>🛠️ IoT systems banane ke liye sirf idea kaafi nahi hota, balki hume kuch <strong>special hardware aur software tools</strong> ki zarurat hoti hai jinke through hum sensors se data collect, process aur control kar paate hain.</Def>
                        
                        <p className="mb-2">Ye tools developers ko help karte hain:</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['💻 Devices ko program karne me', '⚙️ Data process karne me', '📱 IoT applications banane me'].map((s, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-xs font-semibold border border-gray-200">{s}</span>
                            ))}
                        </div>

                        {/* (1) Arduino */}
                        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #ecfeff, #cffafe)', border: '1px solid #67e8f9' }}>
                            <div className="flex items-center gap-3 mb-3">
                                <h4 className="font-bold text-cyan-800 text-base">🔹 (1) Arduino</h4>
                            </div>
                            <p className="text-sm text-cyan-900 mb-3">Arduino ek <strong>open-source platform</strong> hai jo hardware aur software dono provide karta hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                    <div className="p-3 rounded-xl bg-white border border-cyan-200 mb-3 shadow-sm">
                                        <p className="font-bold text-xs text-cyan-700 mb-1">👉 Ye ek small electronic board hota hai jisme:</p>
                                        <ul className="text-[11px] text-gray-600 space-y-1 ml-2">
                                            <li>• Microcontroller (CPU) hota hai</li>
                                            <li>• Input/Output pins hoti hain</li>
                                        </ul>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white border border-cyan-200 shadow-sm">
                                        <p className="font-bold text-xs text-cyan-700 mb-1">🔸 Important Points</p>
                                        <ul className="text-[11px] text-gray-600 space-y-1 ml-2">
                                            <li>• Real-time system ki tarah kaam karta hai</li>
                                            <li>• Input (sensor data) ko read karta hai</li>
                                            <li>• Output (LED, motor etc.) ko control karta hai</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="p-2 rounded-xl bg-white border border-cyan-200 shadow-sm flex items-center justify-center flex-1 min-h-[140px]">
                                        <img src="/sample-assets/placeholder.svg" alt="Arduino Board" className="w-full max-w-[200px] h-auto object-contain drop-shadow-md rounded-lg" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-100">
                                    <p className="font-bold text-xs text-cyan-700 mb-1">🔸 Use kaha hota hai</p>
                                    <p className="text-[11px] text-cyan-800">Smart home systems, Automation projects, IoT prototypes</p>
                                </div>
                                <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-100">
                                    <p className="font-bold text-xs text-cyan-700 mb-1">💡 Example Workflow</p>
                                    <p className="text-[11px] text-cyan-800 font-semibold">Temperature sensor → Arduino → Fan ON/OFF</p>
                                </div>
                            </div>
                        </div>

                        {/* (2) Raspberry Pi */}
                        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac' }}>
                            <div className="flex items-center gap-3 mb-3">
                                <h4 className="font-bold text-green-800 text-base">🔹 (2) Raspberry Pi</h4>
                            </div>
                            <p className="text-sm text-green-900 mb-3">Raspberry Pi ek credit-card size ka <strong>mini computer</strong> hota hai jo Linux operating system par kaam karta hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div className="flex flex-col gap-3">
                                    <div className="p-2 rounded-xl bg-white border border-green-200 shadow-sm flex items-center justify-center flex-1 min-h-[140px]">
                                        <img src="/sample-assets/placeholder.svg" alt="Raspberry Pi" className="w-full max-w-[200px] h-auto object-contain drop-shadow-md rounded-lg" />
                                    </div>
                                </div>
                                <div>
                                    <div className="p-3 rounded-xl bg-white border border-green-200 mb-3 shadow-sm">
                                        <p className="font-bold text-xs text-green-700 mb-1">👉 Ye Arduino se powerful hota hai kyunki:</p>
                                        <ul className="text-[11px] text-gray-600 space-y-1 ml-2">
                                            <li>• Isme OS run hota hai</li>
                                            <li>• Storage aur networking support hota hai</li>
                                        </ul>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white border border-green-200 shadow-sm">
                                        <p className="font-bold text-xs text-green-700 mb-1">🔸 Important Points</p>
                                        <ul className="text-[11px] text-gray-600 space-y-1 ml-2">
                                            <li>• Memory card (SD card) use hota hai</li>
                                            <li>• WiFi aur HDMI support hota hai</li>
                                            <li>• TV ya monitor se connect ho sakta hai</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                                    <p className="font-bold text-xs text-green-700 mb-1">🔸 Use kaha hota hai</p>
                                    <p className="text-[11px] text-green-800">Smart surveillance system, Cloud-based IoT system, AI + IoT projects</p>
                                </div>
                                <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                                    <p className="font-bold text-xs text-green-700 mb-1">💡 Example</p>
                                    <p className="text-[11px] text-green-800 font-semibold">CCTV camera → Raspberry Pi → Live monitoring</p>
                                </div>
                            </div>
                        </div>

                        {/* (3) Tessel 2 */}
                        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '1px solid #c4b5fd' }}>
                            <div className="flex items-center gap-3 mb-3">
                                <h4 className="font-bold text-purple-800 text-base">🔹 (3) Tessel 2</h4>
                            </div>
                            <p className="text-sm text-purple-900 mb-3">Tessel 2 ek development board hai jo specially <strong>IoT applications</strong> ke liye design kiya gaya hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                    <div className="p-3 rounded-xl bg-white border border-purple-200 mb-3 shadow-sm">
                                        <p className="font-bold text-xs text-purple-700 mb-1">👉 Features:</p>
                                        <ul className="text-[11px] text-gray-600 space-y-1 ml-2">
                                            <li>• Built-in WiFi hota hai</li>
                                            <li>• JavaScript (Node.js) par kaam karta hai</li>
                                            <li>• Fast development aur easy programming</li>
                                        </ul>
                                    </div>
                                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 shadow-sm">
                                        <p className="font-bold text-xs text-purple-700 mb-1">🔸 Tessel 2 ka kaam</p>
                                        <p className="text-[11px] text-purple-800">IoT devices ko internet se connect karna, Sensors se data lena, Cloud me data bhejna.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="p-2 rounded-xl bg-white border border-purple-200 shadow-sm flex items-center justify-center flex-1 min-h-[140px]">
                                        <img src="/sample-assets/placeholder.svg" alt="Tessel 2" className="w-full max-w-[200px] h-auto object-contain drop-shadow-md rounded-lg" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                                <p className="font-bold text-xs text-purple-700 mb-1">💡 Example Workflow</p>
                                <p className="text-[11px] text-purple-800 font-semibold">Sensor data → Tessel → Cloud</p>
                            </div>
                        </div>

                        {/* (4) Kinoma Create */}
                        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fdba74' }}>
                            <div className="flex items-center gap-3 mb-3">
                                <h4 className="font-bold text-orange-800 text-base">🔹 (4) Kinoma Create</h4>
                            </div>
                            <p className="text-sm text-orange-900 mb-3">Kinoma Create ek aisa tool hai jo IoT devices ke beech <strong>communication setup</strong> karne ke liye use hota hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div className="flex flex-col justify-center">
                                    <div className="p-2 rounded-xl bg-white border border-orange-200 shadow-sm flex items-center justify-center flex-1 min-h-[140px]">
                                        <img src="/sample-assets/placeholder.svg" alt="Kinoma Create" className="w-full max-w-[200px] h-auto object-contain drop-shadow-md rounded-lg" />
                                    </div>
                                </div>
                                <div>
                                    <div className="p-3 rounded-xl bg-white border border-orange-200 mb-3 shadow-sm">
                                        <p className="font-bold text-xs text-orange-700 mb-1">👉 Ye developers ko help karta hai:</p>
                                        <ul className="text-[11px] text-gray-600 space-y-1 ml-2">
                                            <li>• Devices ke beech communication establish karne me</li>
                                            <li>• IoT apps develop karne me</li>
                                        </ul>
                                    </div>
                                    <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 shadow-sm">
                                        <p className="font-bold text-xs text-orange-700 mb-1">🔸 Important Points</p>
                                        <ul className="text-[11px] text-orange-800 space-y-1 ml-2">
                                            <li>• JavaScript based hai</li>
                                            <li>• Fast prototyping aur easy interface</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                                <p className="font-bold text-xs text-orange-700 mb-1">💡 Example</p>
                                <p className="text-[11px] text-orange-800 font-semibold">Smart home system ka control panel banana</p>
                            </div>
                        </div>

                        {/* (5) Eclipse IoT */}
                        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: '1px solid #cbd5e1' }}>
                            <div className="flex items-center gap-3 mb-3">
                                <h4 className="font-bold text-slate-800 text-base">🔹 (5) Eclipse IoT</h4>
                            </div>
                            <p className="text-sm text-slate-700 mb-3">Eclipse IoT ek <strong>open-source platform</strong> hai jo IoT development ke liye use hota hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                    <div className="p-3 rounded-xl bg-white border border-slate-300 mb-3 shadow-sm">
                                        <p className="font-bold text-xs text-slate-700 mb-1">👉 Features:</p>
                                        <ul className="text-[11px] text-gray-600 space-y-1 ml-2">
                                            <li>• Ye Java-based tools provide karta hai</li>
                                            <li>• Open-source aur Scalable hai</li>
                                            <li>• Enterprise level use ke liye best hai</li>
                                        </ul>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white border border-slate-300 shadow-sm">
                                        <p className="font-bold text-xs text-slate-700 mb-1">🔸 Eclipse IoT ka kaam</p>
                                        <ul className="text-[11px] text-gray-600 space-y-1 ml-2">
                                            <li>• IoT devices, cloud aur gateway ko connect karna</li>
                                            <li>• Large-scale IoT applications develop karna</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-1 min-h-[140px]">
                                        <img src="/sample-assets/placeholder.svg" alt="Eclipse IoT" className="w-full max-w-[200px] h-auto object-contain drop-shadow-md rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-100 border border-slate-300">
                                <p className="font-bold text-xs text-slate-700 mb-1">💡 Example</p>
                                <p className="text-[11px] text-slate-800 font-semibold">Smart city system develop karna</p>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ MCQs ═══ */}
                    <Sec id="mcqs" title="📝 Important MCQs (50 Questions)" icon={<BookOpen size={16} className="text-sky-500" />}>
                        <Def>🎯 Niche diye gaye 50 MCQs ki practice karein. Sahi answer dekhne ke liye options par click karein ya "Check Answer" dabayein.</Def>
                        <IoTChap1MCQ />
                    </Sec>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-8 mb-4">
                        <Link href="/iot" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-cyan-50 hover:text-cyan-700 transition-all">
                            <ArrowLeft size={16} /> Back to IoT
                        </Link>
                        <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold cursor-not-allowed">
                            Chapter 2 <Shield size={16} /> 🔒
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
