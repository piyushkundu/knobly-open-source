'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Menu, X, ChevronRight, Hash, Sparkles, Shield, Lock, AlertTriangle, Bug, Eye, Mail, Globe, Server, Wifi, Users, Key, FileWarning, ShieldCheck, ShieldAlert, Skull, Fingerprint, Network, Zap, CheckCircle2, Activity, Layers, Search, MonitorSmartphone, CloudOff, UserX, Smartphone, Database, Radio, Cloud, KeyRound, ShieldOff, MessageSquareWarning, Link2Off, AppWindow, Code, Package, MonitorPlay, Boxes, Brain, Target, TrendingUp, BarChart3, Cog, BookOpen, Gamepad2, Car, ThumbsUp, ThumbsDown, Stethoscope, Scan, Mic, Sprout, Bot } from 'lucide-react';

function Sec({ id, title, icon, children }: { id: string; title: string; icon: ReactNode; children: ReactNode }) {
    return (
        <section id={id} className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg bg-white" style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>{icon}<h2 className="text-base md:text-lg font-extrabold text-gray-800">{title}</h2></div>
            <div className="text-sm leading-relaxed space-y-3 text-gray-600">{children}</div>
        </section>
    );
}

function Def({ children }: { children: ReactNode }) {
    return <div className="rounded-xl p-4 my-3 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #fef2f2, #fecaca)', border: '1px solid #fca5a5', color: '#991b1b' }}>{children}</div>;
}

function IB({ type = 'tip', children }: { type?: 'tip' | 'note' | 'warning'; children: ReactNode }) {
    const s: Record<string, { bg: string; bc: string; tc: string; emoji: string }> = { tip: { bg: '#fef2f2', bc: '#fca5a5', tc: '#991b1b', emoji: '💡' }, note: { bg: '#eff6ff', bc: '#93c5fd', tc: '#1e40af', emoji: '📝' }, warning: { bg: '#fefce8', bc: '#fde047', tc: '#854d0e', emoji: '⚠️' } };
    const st = s[type];
    return <div className="rounded-xl p-3.5 text-xs font-medium my-3" style={{ background: st.bg, border: `1px solid ${st.bc}`, color: st.tc }}>{st.emoji} {children}</div>;
}

const tocItems = [
    { icon: <Shield size={13} />, label: 'Need of Security', id: 'need-security', color: '#ef4444' },
    { icon: <ShieldCheck size={13} />, label: 'Network Security', id: 'network-security', color: '#3b82f6' },
    { icon: <Skull size={13} />, label: 'Cyber Attacks', id: 'cyber-attacks', color: '#8b5cf6' },
    { icon: <Users size={13} />, label: 'Types of Hackers', id: 'hacker-types', color: '#f59e0b' },
    { icon: <Bug size={13} />, label: 'Malware Attack', id: 'malware-attack', color: '#10b981' },
    { icon: <Mail size={13} />, label: 'Phishing Attack', id: 'phishing-attack', color: '#ec4899' },
    { icon: <Server size={13} />, label: 'DDoS Attack', id: 'ddos-attack', color: '#f43f5e' },
    { icon: <KeyRound size={13} />, label: 'Brute Force Attack', id: 'brute-force', color: '#7c3aed' },
    { icon: <ShieldOff size={13} />, label: 'Avoid Cyber Attack', id: 'avoid-cyber-attack', color: '#059669' },
    { icon: <Cloud size={13} />, label: 'Cloud Computing', id: 'cloud-computing', color: '#0ea5e9' },
    { icon: <Layers size={13} />, label: 'Types of Cloud', id: 'cloud-types', color: '#6366f1' },
    { icon: <Boxes size={13} />, label: 'Cloud Services', id: 'cloud-services', color: '#f43f5e' },
    { icon: <Server size={13} />, label: 'IaaS', id: 'iaas', color: '#0284c7' },
    { icon: <Code size={13} />, label: 'PaaS', id: 'paas', color: '#059669' },
    { icon: <MonitorPlay size={13} />, label: 'SaaS', id: 'saas', color: '#7c3aed' },
    { icon: <Brain size={13} />, label: 'Machine Learning', id: 'ml-definition', color: '#2563eb' },
    { icon: <Cog size={13} />, label: 'ML Working', id: 'ml-working', color: '#0891b2' },
    { icon: <Layers size={13} />, label: 'Types of ML', id: 'ml-types', color: '#7c3aed' },
    { icon: <ThumbsUp size={13} />, label: 'ML Advantages', id: 'ml-advantages', color: '#059669' },
    { icon: <ThumbsDown size={13} />, label: 'ML Disadvantages', id: 'ml-disadvantages', color: '#dc2626' },
    { icon: <Target size={13} />, label: 'ML Applications', id: 'ml-applications', color: '#d97706' },
    { icon: <TrendingUp size={13} />, label: 'Real Life Examples', id: 'ml-real-life', color: '#ec4899' },
];

export default function IoTSecurity() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('need-security');

    return (
        <div className="min-h-screen bg-white text-slate-800 relative">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-white to-rose-50/30" />
            </div>

            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/iot" className="flex items-center justify-center w-9 h-9 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}><ArrowLeft size={16} /></Link>
                        <div>
                            <h1 className="text-sm font-extrabold text-gray-800">Security & Future of IoT</h1>
                            <div className="flex items-center gap-1.5"><Sparkles size={8} className="text-red-500" /><span className="text-[9px] uppercase tracking-[0.18em] font-bold text-red-500">Chapter 5</span></div>
                        </div>
                    </div>
                    <button onClick={() => setTocOpen(!tocOpen)} className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 border border-gray-200">
                        {tocOpen ? <X size={18} className="text-red-500" /> : <Menu size={18} className="text-red-500" />}
                    </button>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #ef4444, #f87171, #dc2626, #ef4444)' }} />
            </header>

            <div className="max-w-7xl mx-auto flex relative">
                <aside className={`${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[52px] left-0 z-40 lg:z-10 w-64 lg:w-56 xl:w-64 h-[calc(100vh-52px)] overflow-y-auto transition-transform duration-300 lg:flex-shrink-0 bg-white/95 backdrop-blur-xl`} style={{ borderRight: '1px solid #e2e8f0' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}><Hash size={12} className="text-white" /></div>
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
                    <section className="relative rounded-3xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 30%, #ef4444 60%, #fca5a5 100%)', boxShadow: '0 8px 32px rgba(239,68,68,0.25)' }}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)' }} />
                            {/* Animated shield pattern */}
                            <svg className="absolute right-4 bottom-4 w-32 h-32 opacity-10" viewBox="0 0 100 100">
                                <path d="M50 5 L90 25 L90 55 Q90 80 50 95 Q10 80 10 55 L10 25 Z" fill="white" stroke="white" strokeWidth="2">
                                    <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
                                </path>
                            </svg>
                        </div>
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#450a0a' }}>
                                <Sparkles size={10} /> Chapter 5 — O-Level M4-R5
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black mb-3 text-white" style={{ lineHeight: '1.2' }}>Security & Future of IoT</h2>
                            <p className="text-sm md:text-base max-w-2xl mb-5 text-white/90 font-medium">IoT Security ke importance ko samjhiye — Cyber Attacks, Hackers, Malware, Phishing, DDoS, Brute Force Attacks, Cloud Computing aur Cloud Services (IaaS, PaaS, SaaS) ke baare mein jaaniye.</p>
                        </div>
                    </section>

                    {/* ═══ SECTION: Need of Security in IoT ═══ */}
                    <Sec id="need-security" title="🔴 Need of Security in IoT" icon={<Shield size={16} className="text-red-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>🛡️ आज के समय में लगभग सभी प्रकार के व्यवसाय <strong>Cyber Based</strong> हो चुके हैं। जब Internet, LAN तथा विभिन्न Network Methods का उपयोग किया जाता है, तब Cyber खतरों से बचने तथा महत्वपूर्ण Data को सुरक्षित रखने के लिए <strong>Network Security</strong> की आवश्यकता होती है।</Def>
                                <p>Network Security ka mukhya uddeshya kisi bhi Network ko <strong>Unauthorized Attack</strong> se bachana hota hai। Iske madhyam se Hacking, Data Loss, Data Modification, Identity Theft, DDoS Attack aadi Cyber Crime ko roka ja sakta hai tatha Users ko surakshit Platform uplabdh karaya jaata hai।</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="IoT Network Security" className="w-full h-auto rounded-2xl shadow-md border border-red-100" />
                            </div>
                        </div>

                        {/* Security Components */}
                        <div className="mt-5">
                            <p className="text-xs font-bold text-red-800 mb-3 uppercase tracking-wide">🔒 High Security ke अंतर्गत शामिल Software:</p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {[
                                    { title: 'Antivirus', icon: <ShieldCheck size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                                    { title: 'Firewall', icon: <Shield size={20} />, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
                                    { title: 'Network Monitor', icon: <Activity size={20} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                                    { title: 'Applications', icon: <MonitorSmartphone size={20} />, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                                    { title: 'Access Control', icon: <Key size={20} />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                                ].map((f, i) => (
                                    <div key={i} className={`p-3 rounded-xl ${f.bg} ${f.border} border text-center flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow`}>
                                        <div className={f.color}>{f.icon}</div>
                                        <span className="text-[11px] font-bold text-gray-800">{f.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Why Security Matters Flow */}
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-5">
                            <p className="text-sm text-red-900 font-semibold mb-3">🔐 IoT Security kyun zaroori hai:</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <span className="px-4 py-2 bg-white rounded-lg border border-red-200 text-red-700 shadow-sm font-bold text-xs flex items-center gap-1"><Wifi size={14} /> 1. IoT Devices Connected</span>
                                <ChevronRight className="text-red-400 rotate-90 sm:rotate-0" />
                                <span className="px-4 py-2 bg-red-600 rounded-lg text-white shadow-md font-bold text-xs flex items-center gap-1"><AlertTriangle size={14} /> 2. Cyber Threats</span>
                                <ChevronRight className="text-red-400 rotate-90 sm:rotate-0" />
                                <span className="px-4 py-2 bg-white rounded-lg border border-red-200 text-red-700 shadow-sm font-bold text-xs flex items-center gap-1"><ShieldCheck size={14} /> 3. Security Required</span>
                            </div>
                        </div>

                        <IB type="warning">IoT devices me limited computing power hoti hai isliye traditional security methods directly apply nahi ho sakte। Special lightweight security protocols ki zaroorat hoti hai।</IB>
                    </Sec>

                    {/* ═══ SECTION: Network Security ═══ */}
                    <Sec id="network-security" title="🔴 Network Security" icon={<ShieldCheck size={16} className="text-blue-500" />}>
                        <p className="mb-4">Network Security ka mukhya uddeshya kisi bhi Network ko <strong>Unauthorized Attack</strong> se bachana hota hai। Iske madhyam se vibhinn prakar ke Cyber Crimes ko roka ja sakta hai।</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'Hacking', desc: 'Unauthorized access se system ko hack karna', icon: <Skull size={18} />, color: 'red' },
                                { title: 'Data Loss', desc: 'Important data ka chori hona ya delete hona', icon: <Database size={18} />, color: 'orange' },
                                { title: 'Data Modification', desc: 'Data me unauthorized changes karna', icon: <FileWarning size={18} />, color: 'amber' },
                                { title: 'Identity Theft', desc: 'Kisi ki personal identity chura lena', icon: <UserX size={18} />, color: 'purple' },
                                { title: 'DDoS Attack', desc: 'Server par excessive traffic bhejkar crash karna', icon: <CloudOff size={18} />, color: 'rose' },
                                { title: 'Unauthorized Access', desc: 'Bina permission ke system me ghusna', icon: <Lock size={18} />, color: 'indigo' },
                            ].map((item, i) => (
                                <div key={i} className={`p-4 rounded-xl bg-${item.color}-50 border border-${item.color}-100 flex items-start gap-3 hover:shadow-md transition-shadow`} style={{ background: `var(--${item.color}-50, #fef2f2)` }}>
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`} style={{ background: i === 0 ? '#fef2f2' : i === 1 ? '#fff7ed' : i === 2 ? '#fffbeb' : i === 3 ? '#faf5ff' : i === 4 ? '#fff1f2' : '#eef2ff', color: i === 0 ? '#dc2626' : i === 1 ? '#ea580c' : i === 2 ? '#d97706' : i === 3 ? '#9333ea' : i === 4 ? '#e11d48' : '#4f46e5' }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h4>
                                        <p className="text-xs text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <IB type="note">Network Security ke through <strong>Users ko surakshit Platform</strong> uplabdh karaya jaata hai jisme unka data safe rehta hai aur koi unauthorized person access nahi kar sakta।</IB>
                    </Sec>

                    {/* ═══ SECTION: Cyber Attacks ═══ */}
                    <Sec id="cyber-attacks" title="🔴 Cyber Attacks" icon={<Skull size={16} className="text-purple-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>⚡ <strong>Cyber Attack</strong> karne wala vyakti ek <strong>Computer Hacking Expert</strong> hota hai, jo Unauthorized roop se kisi Network mein pravesh karke doosre Computer, Website ya Data ko <strong>Hack</strong> kar sakta hai।</Def>
                                <p>Cyber Attacks ka main motive hota hai:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {[
                                        { label: 'Data Chori karna', icon: '🔓' },
                                        { label: 'System ko Damage karna', icon: '💥' },
                                        { label: 'Ransom Demand karna', icon: '💰' },
                                        { label: 'Service Band karna', icon: '🚫' },
                                    ].map((m, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-purple-50 border border-purple-100 text-sm text-purple-800 font-medium">
                                            <span>{m.icon}</span>{m.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Cyber Attacks Types" className="w-full h-auto rounded-2xl shadow-md border border-purple-100" />
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Types of Hackers ═══ */}
                    <Sec id="hacker-types" title="🔴 Types of Hackers" icon={<Users size={16} className="text-amber-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center mb-6">
                            <div className="flex-1">
                                <p className="mb-3">Hackers mukhya roop se <strong>teen prakar</strong> ke hote hain jo alag-alag uddeshya se kaam karte hain:</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Types of Hackers" className="w-full h-auto rounded-2xl shadow-md border border-amber-100" />
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* White Hat Hacker */}
                            <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><ShieldCheck size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">🟢 1. White Hat Hacker</h4>
                                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Ethical Hacker</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">White Hat Hackers ko <strong>Ethical Hackers</strong> bhi kaha jaata hai। Ye legally aur authorized tarike se kisi company ya organization ke system ki security test karte hain।</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                        <p className="text-xs font-bold text-emerald-800 mb-1">✅ Kaam</p>
                                        <ul className="text-xs text-emerald-700 space-y-1 ml-4 list-disc marker:text-emerald-400">
                                            <li>Security vulnerabilities dhundhna</li>
                                            <li>Penetration testing karna</li>
                                            <li>System ko surakshit banana</li>
                                        </ul>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                                        <p className="text-xs font-bold text-green-800 mb-1">🏢 Example</p>
                                        <ul className="text-xs text-green-700 space-y-1 ml-4 list-disc marker:text-green-400">
                                            <li>Bug Bounty programs</li>
                                            <li>Security audit firms</li>
                                            <li>Government cyber security teams</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Black Hat Hacker */}
                            <div className="p-5 rounded-2xl bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-gray-900 text-red-400 rounded-xl"><Skull size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">⚫ 2. Black Hat Hacker</h4>
                                        <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded-full border border-red-200">Criminal Hacker</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">Black Hat Hackers galat uddeshya se kisi ke system me <strong>bina permission ke ghuste hain</strong>। Ye data chori, system damage, aur ransomware attacks karte hain।</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                                        <p className="text-xs font-bold text-red-800 mb-1">❌ Kaam</p>
                                        <ul className="text-xs text-red-700 space-y-1 ml-4 list-disc marker:text-red-400">
                                            <li>Data theft aur selling</li>
                                            <li>Ransomware attacks</li>
                                            <li>System ko hack karna</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                                        <p className="text-xs font-bold text-gray-800 mb-1">⚠️ Impact</p>
                                        <ul className="text-xs text-gray-700 space-y-1 ml-4 list-disc marker:text-gray-400">
                                            <li>Financial loss</li>
                                            <li>Privacy breach</li>
                                            <li>Legal punishment</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Grey Hat Hacker */}
                            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-gray-200 text-gray-600 rounded-xl"><Search size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">🔘 3. Grey Hat Hacker</h4>
                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">Mixed Intent</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">Grey Hat Hackers White aur Black Hat ke beech me aate hain। Ye <strong>bina permission ke system me ghuste hain</strong> lekin nuksaan pahunchana inki niyat nahi hoti। Ye vulnerabilities dhundh kar company ko inform karte hain।</p>
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                                    <p className="text-xs font-bold text-gray-800 mb-1">🔄 Behavior</p>
                                    <ul className="text-xs text-gray-700 space-y-1 ml-4 list-disc marker:text-gray-400">
                                        <li>Bina permission ke test karte hain</li>
                                        <li>Bug report karte hain company ko</li>
                                        <li>Kabhi kabhi reward maangte hain</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full text-xs border-collapse rounded-xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr style={{ background: 'linear-gradient(135deg, #1e293b, #334155)' }}>
                                        <th className="p-3 text-left text-white font-bold">Feature</th>
                                        <th className="p-3 text-center text-emerald-300 font-bold">🟢 White Hat</th>
                                        <th className="p-3 text-center text-red-300 font-bold">⚫ Black Hat</th>
                                        <th className="p-3 text-center text-gray-300 font-bold">🔘 Grey Hat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { feature: 'Intent', white: 'Ethical / Legal', black: 'Malicious / Illegal', grey: 'Mixed' },
                                        { feature: 'Permission', white: '✅ Authorized', black: '❌ Unauthorized', grey: '⚠️ Sometimes' },
                                        { feature: 'Purpose', white: 'Security Testing', black: 'Data Theft / Damage', grey: 'Bug Finding' },
                                        { feature: 'Legal Status', white: 'Legal', black: 'Illegal', grey: 'Questionable' },
                                    ].map((row, i) => (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="p-3 font-bold text-gray-800 border-b border-gray-100">{row.feature}</td>
                                            <td className="p-3 text-center text-emerald-700 border-b border-gray-100">{row.white}</td>
                                            <td className="p-3 text-center text-red-700 border-b border-gray-100">{row.black}</td>
                                            <td className="p-3 text-center text-gray-600 border-b border-gray-100">{row.grey}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Malware Attack ═══ */}
                    <Sec id="malware-attack" title="🔴 1. Malware Attack" icon={<Bug size={16} className="text-emerald-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>🦠 <strong>Malware Attack</strong> ek <strong>Malicious Software Attack</strong> hota hai। Isme Hackers vibhinn tarikon se E-mail, Message ya Internet Popup ke madhyam se User ko kisi Software ko Install karne ke liye prerit karte hain।</Def>
                                <p>Jab User galti se us Software ko <strong>Install kar leta hai</strong>, tab uske System ka Control <strong>Hackers ke paas pahunch</strong> sakta hai।</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Malware Attack" className="w-full h-auto rounded-2xl shadow-md border border-emerald-100" />
                            </div>
                        </div>

                        {/* How Malware Spreads */}
                        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100">
                            <h4 className="text-xs font-bold text-red-800 mb-3 uppercase tracking-wide">📨 Malware kaise failta hai:</h4>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <span className="px-4 py-2 bg-white rounded-lg border border-red-200 text-red-700 shadow-sm font-bold text-xs flex items-center gap-1"><Mail size={14} /> E-mail / Message</span>
                                <ChevronRight className="text-red-400 rotate-90 sm:rotate-0" />
                                <span className="px-4 py-2 bg-red-600 rounded-lg text-white shadow-md font-bold text-xs flex items-center gap-1"><AlertTriangle size={14} /> Fake Software Install</span>
                                <ChevronRight className="text-red-400 rotate-90 sm:rotate-0" />
                                <span className="px-4 py-2 bg-white rounded-lg border border-red-200 text-red-700 shadow-sm font-bold text-xs flex items-center gap-1"><Skull size={14} /> System Hacked!</span>
                            </div>
                        </div>

                        {/* Types of Malware */}
                        <div className="mt-5">
                            <h4 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wide">🔍 Types of Malware:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    { name: 'Virus', desc: 'File attach hokar failta hai', icon: '🦠', bg: '#fef2f2', border: '#fecaca' },
                                    { name: 'Worm', desc: 'Khud copy hokar network me failta hai', icon: '🐛', bg: '#fefce8', border: '#fef08a' },
                                    { name: 'Trojan', desc: 'Legitimate software jaisa dikhta hai', icon: '🐴', bg: '#f0fdf4', border: '#bbf7d0' },
                                    { name: 'Ransomware', desc: 'Data lock karke ransom maangta hai', icon: '🔒', bg: '#faf5ff', border: '#e9d5ff' },
                                    { name: 'Spyware', desc: 'User ki activity monitor karta hai', icon: '👁️', bg: '#eff6ff', border: '#bfdbfe' },
                                    { name: 'Adware', desc: 'Unwanted ads dikhata hai', icon: '📢', bg: '#fff7ed', border: '#fed7aa' },
                                ].map((m, i) => (
                                    <div key={i} className="p-3 rounded-xl text-center hover:shadow-md transition-shadow" style={{ background: m.bg, border: `1px solid ${m.border}` }}>
                                        <div className="text-2xl mb-1">{m.icon}</div>
                                        <p className="text-xs font-bold text-gray-800">{m.name}</p>
                                        <p className="text-[10px] text-gray-600 mt-0.5">{m.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <IB type="tip">Malware se bachne ke liye hamesha <strong>trusted sources</strong> se hi software download karein aur <strong>Antivirus</strong> software updated rakhein।</IB>
                    </Sec>

                    {/* ═══ SECTION: Phishing Attack ═══ */}
                    <Sec id="phishing-attack" title="🔴 2. Phishing Attack" icon={<Mail size={16} className="text-pink-500" />}>
                        <div className="flex flex-col md:flex-row-reverse gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>🎣 <strong>Phishing Attack</strong> Cyber Crime ki duniya mein Hackers dwara upyog kiya jaane wala sabse <strong>saamanya tareeka</strong> hai। Isme Hackers Malicious E-mail bhejte hain aur User ko kisi Link par Click karne ke liye prerit karte hain।</Def>
                                <p>Link par Click karne ke baad User ki <strong>Personal Information</strong> ya <strong>Sensitive Details</strong> chori ho sakti hain — jaise Bank Details, Password, Credit Card Information aadi।</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Phishing Attack" className="w-full h-auto rounded-2xl shadow-md border border-pink-100" />
                            </div>
                        </div>

                        {/* Phishing Process Flow */}
                        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100">
                            <h4 className="text-xs font-bold text-pink-800 mb-3 uppercase tracking-wide">🎯 Phishing Attack Process:</h4>
                            <div className="flex flex-col items-center gap-0 text-center text-xs font-semibold">
                                {([
                                    { label: 'Hacker creates Fake Email / Website', style: { background: '#fecdd3', border: '1.5px solid #fb7185', color: '#9f1239', borderRadius: '12px' } as React.CSSProperties },
                                    null,
                                    { label: 'Email bheja jaata hai User ko', style: { background: '#fce7f3', border: '1.5px solid #f9a8d4', color: '#9d174d', borderRadius: '8px' } as React.CSSProperties },
                                    null,
                                    { label: 'User Link par Click karta hai', style: { background: '#fff1f2', border: '1.5px solid #fda4af', color: '#be123c', borderRadius: '8px' } as React.CSSProperties },
                                    null,
                                    { label: 'Personal Data Chori ho jaata hai! 🚨', style: { background: '#ef4444', border: 'none', color: 'white', borderRadius: '12px' } as React.CSSProperties },
                                ] as Array<{ label: string; style: React.CSSProperties } | null>).map((item, i) =>
                                    item === null
                                        ? <div key={i} className="w-0.5 h-5 bg-pink-300" />
                                        : <div key={i} className="px-5 py-2.5 text-[11px] shadow-sm w-full max-w-xs" style={item.style}>{item.label}</div>
                                )}
                            </div>
                        </div>

                        {/* What Gets Stolen */}
                        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: 'Passwords', icon: <Key size={18} />, color: '#ef4444' },
                                { label: 'Bank Details', icon: <Database size={18} />, color: '#f97316' },
                                { label: 'Credit Card', icon: <Smartphone size={18} />, color: '#8b5cf6' },
                                { label: 'Personal Info', icon: <Fingerprint size={18} />, color: '#ec4899' },
                            ].map((item, i) => (
                                <div key={i} className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                                    <div className="flex justify-center mb-2" style={{ color: item.color }}>{item.icon}</div>
                                    <p className="text-xs font-bold text-gray-800">{item.label}</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">Chori ho sakta hai</p>
                                </div>
                            ))}
                        </div>

                        <IB type="warning">Kabhi bhi <strong>unknown emails ke links</strong> par click na karein। Hamesha URL check karein aur <strong>official website</strong> par hi apni details dalein।</IB>
                    </Sec>

                    {/* ═══ SECTION: DDoS Attack ═══ */}
                    <Sec id="ddos-attack" title="🔴 3. DDoS Attack (Distributed Denial of Service)" icon={<Server size={16} className="text-rose-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>🌊 <strong>DDoS Attack</strong> ek Cyber Attack hai jiska uddeshya kisi Online Server, Application ya Website ko <strong>band karna</strong> ya uski Service ko <strong>baadhit karna</strong> hota hai।</Def>
                                <p>Isme Attackers Target Website ya Service par <strong>bahut adhik Network Traffic</strong> bhejte hain, jisse Website <strong>Slow</strong> ho jaati hai ya <strong>Crash</strong> ho jaati hai।</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="DDoS Attack" className="w-full h-auto rounded-2xl shadow-md border border-rose-100" />
                            </div>
                        </div>

                        {/* Botnet Explanation */}
                        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-red-950 border border-red-800 text-white">
                            <h4 className="text-xs font-bold text-red-300 mb-3 uppercase tracking-wide flex items-center gap-2"><Network size={14} /> 🤖 Botnet kya hota hai?</h4>
                            <p className="text-sm text-gray-300 mb-4">Is Attack mein <strong className="text-red-400">Botnet</strong> ka upyog kiya jaata hai। Botnet <strong className="text-amber-400">Malware se sankramit Computers</strong> ka ek Network hota hai jise Attacking Party dwara Control kiya jaata hai।</p>

                            {/* Animated DDoS Diagram */}
                            <div className="flex justify-center">
                                <svg viewBox="0 0 400 200" className="w-full max-w-lg">
                                    <rect width="400" height="200" rx="12" fill="#0f172a" />
                                    
                                    {/* Attacker */}
                                    <rect x="10" y="70" width="70" height="60" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
                                    <text x="45" y="95" textAnchor="middle" fill="#a5b4fc" fontSize="8" fontWeight="bold">Attacker</text>
                                    <text x="45" y="110" textAnchor="middle" fill="#818cf8" fontSize="7">🎭 Control</text>

                                    {/* Botnet Computers */}
                                    {[0, 1, 2, 3].map(i => (
                                        <g key={i}>
                                            <rect x={120} y={20 + i * 45} width="55" height="30" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="0.5" />
                                            <text x={147} y={37 + i * 45} textAnchor="middle" fill="#94a3b8" fontSize="6">Bot #{i+1}</text>
                                            <text x={147} y={46 + i * 45} textAnchor="middle" fill="#ef4444" fontSize="6">🖥️ Infected</text>
                                            {/* Arrow from attacker to bot */}
                                            <line x1="80" y1="100" x2="120" y2={35 + i * 45} stroke="#6366f1" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.5" />
                                            {/* Arrow from bot to target */}
                                            <line x1="175" y1={35 + i * 45} x2="260" y2="100" stroke="#ef4444" strokeWidth="1" opacity="0.6">
                                                <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />
                                            </line>
                                            {/* Data packets */}
                                            <circle r="2" fill="#ef4444">
                                                <animateMotion path={`M 175 ${35 + i * 45} L 260 100`} dur={`${0.8 + i * 0.2}s`} repeatCount="indefinite" />
                                            </circle>
                                        </g>
                                    ))}

                                    {/* Target Server */}
                                    <rect x="260" y="65" width="80" height="70" rx="8" fill="#450a0a" stroke="#dc2626" strokeWidth="1.5">
                                        <animate attributeName="stroke" values="#dc2626;#fca5a5;#dc2626" dur="1s" repeatCount="indefinite" />
                                    </rect>
                                    <text x="300" y="90" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold">Target</text>
                                    <text x="300" y="102" textAnchor="middle" fill="#f87171" fontSize="7">🔥 Server</text>
                                    <text x="300" y="115" textAnchor="middle" fill="#ef4444" fontSize="6" fontWeight="bold">OVERLOADED!</text>
                                    <text x="300" y="128" textAnchor="middle" fill="#fca5a5" fontSize="6">❌ CRASH</text>

                                    {/* Labels */}
                                    <text x="200" y="195" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">DDoS Attack — Multiple Bots → Single Target</text>
                                </svg>
                            </div>
                        </div>

                        {/* DDoS Effects */}
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-center">
                                <div className="text-2xl mb-2">🐌</div>
                                <p className="text-xs font-bold text-red-800">Website Slow</p>
                                <p className="text-[10px] text-red-700 mt-1">Excessive traffic se response time badh jaata hai</p>
                            </div>
                            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-center">
                                <div className="text-2xl mb-2">💥</div>
                                <p className="text-xs font-bold text-orange-800">Server Crash</p>
                                <p className="text-[10px] text-orange-700 mt-1">Target system overload hokar crash ho jaata hai</p>
                            </div>
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-center">
                                <div className="text-2xl mb-2">🚫</div>
                                <p className="text-xs font-bold text-amber-800">Service Down</p>
                                <p className="text-[10px] text-amber-700 mt-1">Real users website access nahi kar paate</p>
                            </div>
                        </div>

                        {/* DDoS Attack Process */}
                        <div className="mt-5 p-5 rounded-2xl bg-gray-50 border border-gray-200">
                            <h4 className="text-sm font-extrabold text-gray-800 mb-4 flex items-center gap-2">
                                <ChevronRight size={14} className="text-red-500" /> DDoS Attack Flow
                            </h4>
                            <div className="flex flex-col items-center gap-0 text-center text-xs font-semibold">
                                {([
                                    { label: 'Attacker Botnet Create karta hai', style: { background: '#1e1b4b', color: '#a5b4fc', borderRadius: '12px' } as React.CSSProperties },
                                    null,
                                    { label: 'Multiple Computers ko Malware se Infect karta hai', style: { background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#991b1b', borderRadius: '8px' } as React.CSSProperties },
                                    null,
                                    { label: 'Sabhi Bots ek saath Target Server par Traffic bhejte hain', style: { background: '#fef3c7', border: '1.5px solid #fcd34d', color: '#92400e', borderRadius: '8px' } as React.CSSProperties },
                                    null,
                                    { label: 'Target Server Overload → CRASH! ❌', style: { background: '#dc2626', color: 'white', borderRadius: '12px' } as React.CSSProperties },
                                ] as Array<{ label: string; style: React.CSSProperties } | null>).map((item, i) =>
                                    item === null
                                        ? <div key={i} className="w-0.5 h-5 bg-gray-300" />
                                        : <div key={i} className="px-5 py-2.5 text-[11px] shadow-sm w-full max-w-sm" style={item.style}>{item.label}</div>
                                )}
                            </div>
                        </div>

                        <IB type="note">DDoS Attacks se bachne ke liye companies <strong>CDN (Content Delivery Network)</strong>, <strong>Rate Limiting</strong>, aur <strong>Web Application Firewalls (WAF)</strong> ka use karti hain।</IB>
                    </Sec>

                    {/* ═══ SECTION: Brute Force Attack ═══ */}
                    <Sec id="brute-force" title="🔴 4. Brute Force Attack (Dictionary Attack)" icon={<KeyRound size={16} className="text-violet-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>🔑 <strong>Brute Force Attack</strong> ko <strong>Dictionary Attack</strong> bhi kaha jaata hai। Yeh ek <strong>Hacking Attack</strong> hai, jisme kisi Computer, Server, Social Profile ya Bank Account ka <strong>Password tatha PIN</strong> pata lagakar use Hack karne ka prayas kiya jaata hai।</Def>
                                <p>Yeh poori tarah <strong>anumaano (Guessing)</strong> par aadhaarit Attack hota hai। Isme kisi User ka <strong>Username aur Password</strong> Check karne ke liye Software ki sahaayata se laakhon <strong>Words, Numbers aur Symbols</strong> ke alag-alag Combination lagaataar Try kiye jaate hain, jab tak sahi Password prapt na ho jaaye।</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Brute Force Attack" className="w-full h-auto rounded-2xl shadow-md border border-violet-100" />
                            </div>
                        </div>

                        {/* Brute Force Process */}
                        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
                            <h4 className="text-xs font-bold text-violet-800 mb-3 uppercase tracking-wide">🔓 Brute Force Attack kaise kaam karta hai:</h4>
                            <div className="flex flex-col items-center gap-0 text-center text-xs font-semibold">
                                {([
                                    { label: 'Attacker Target ka Username jaanta hai', style: { background: '#ede9fe', border: '1.5px solid #c4b5fd', color: '#5b21b6', borderRadius: '12px' } as React.CSSProperties },
                                    null,
                                    { label: 'Software se lakho Password Combinations Try hote hain', style: { background: '#faf5ff', border: '1.5px solid #d8b4fe', color: '#7e22ce', borderRadius: '8px' } as React.CSSProperties },
                                    null,
                                    { label: 'Word List + Custom Word List ka use hota hai', style: { background: '#f5f3ff', border: '1.5px solid #c084fc', color: '#6b21a8', borderRadius: '8px' } as React.CSSProperties },
                                    null,
                                    { label: 'Sahi Password mil jaata hai → Account Hacked! 🚨', style: { background: '#7c3aed', color: 'white', borderRadius: '12px' } as React.CSSProperties },
                                ] as Array<{ label: string; style: React.CSSProperties } | null>).map((item, i) =>
                                    item === null
                                        ? <div key={i} className="w-0.5 h-5 bg-violet-300" />
                                        : <div key={i} className="px-5 py-2.5 text-[11px] shadow-sm w-full max-w-xs" style={item.style}>{item.label}</div>
                                )}
                            </div>
                        </div>

                        {/* Animated Password Cracking SVG */}
                        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-violet-950 border border-violet-800">
                            <h4 className="text-xs font-bold text-violet-300 mb-3 uppercase tracking-wide flex items-center gap-2"><KeyRound size={14} /> Password Guessing Visualization</h4>
                            <div className="flex justify-center">
                                <svg viewBox="0 0 400 160" className="w-full max-w-lg">
                                    <rect width="400" height="160" rx="12" fill="#0f172a" />
                                    {/* Lock */}
                                    <rect x="250" y="30" width="120" height="100" rx="10" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1.5" />
                                    <text x="310" y="60" textAnchor="middle" fill="#c4b5fd" fontSize="8" fontWeight="bold">TARGET ACCOUNT</text>
                                    <text x="310" y="80" textAnchor="middle" fill="#a78bfa" fontSize="20">🔒</text>
                                    <text x="310" y="100" textAnchor="middle" fill="#818cf8" fontSize="7">Password: ******</text>
                                    <text x="310" y="118" textAnchor="middle" fill="#ef4444" fontSize="6" fontWeight="bold">LOCKED</text>

                                    {/* Attacker trying passwords */}
                                    <rect x="20" y="30" width="100" height="100" rx="10" fill="#1a1a2e" stroke="#475569" strokeWidth="1" />
                                    <text x="70" y="55" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="bold">BRUTE FORCE</text>
                                    {['abc123', 'pass@1', '12345', 'qwerty', 'admin1'].map((pw, i) => (
                                        <g key={i}>
                                            <text x={70} y={70 + i * 12} textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="monospace">
                                                {pw}
                                                <animate attributeName="opacity" values="0;1;0" dur={`${0.5 + i * 0.3}s`} repeatCount="indefinite" />
                                            </text>
                                        </g>
                                    ))}

                                    {/* Arrow */}
                                    <line x1="125" y1="80" x2="245" y2="80" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4,3">
                                        <animate attributeName="stroke-dashoffset" from="0" to="14" dur="1s" repeatCount="indefinite" />
                                    </line>
                                    <polygon points="242,75 252,80 242,85" fill="#7c3aed">
                                        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
                                    </polygon>

                                    <text x="185" y="70" textAnchor="middle" fill="#64748b" fontSize="6">Trying millions of</text>
                                    <text x="185" y="80" textAnchor="middle" fill="#64748b" fontSize="6">combinations...</text>
                                    <text x="200" y="150" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">Brute Force / Dictionary Attack</text>
                                </svg>
                            </div>
                        </div>

                        {/* Key Features */}
                        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                { label: 'Guessing Based', icon: '🎯', desc: 'Anumaano par aadhaarit attack', bg: '#f5f3ff', border: '#ddd6fe' },
                                { label: 'Software Used', icon: '🖥️', desc: 'Automated software se attack', bg: '#eff6ff', border: '#bfdbfe' },
                                { label: 'Word List', icon: '📋', desc: 'Pehle se Word List available', bg: '#fef3c7', border: '#fde68a' },
                                { label: 'Custom List', icon: '✏️', desc: 'Custom Word List bhi banayi ja sakti hai', bg: '#fce7f3', border: '#fbcfe8' },
                                { label: 'Time Consuming', icon: '⏰', desc: 'Strong password me bahut time lagta hai', bg: '#ecfdf5', border: '#a7f3d0' },
                                { label: 'All Combinations', icon: '🔄', desc: 'Words, Numbers, Symbols ke combinations', bg: '#fff7ed', border: '#fed7aa' },
                            ].map((f, i) => (
                                <div key={i} className="p-3 rounded-xl text-center hover:shadow-md transition-shadow" style={{ background: f.bg, border: `1px solid ${f.border}` }}>
                                    <div className="text-2xl mb-1">{f.icon}</div>
                                    <p className="text-xs font-bold text-gray-800">{f.label}</p>
                                    <p className="text-[10px] text-gray-600 mt-0.5">{f.desc}</p>
                                </div>
                            ))}
                        </div>

                        <IB type="warning">Brute Force Attack se bachne ke liye hamesha <strong>Strong Password</strong> rakhein jo <strong>uppercase, lowercase, numbers aur symbols</strong> ka combination ho aur kam se kam <strong>12 characters</strong> lamba ho।</IB>
                    </Sec>

                    {/* ═══ SECTION: How to Avoid Cyber Attack ═══ */}
                    <Sec id="avoid-cyber-attack" title="🔴 How to Avoid Cyber Attack" icon={<ShieldOff size={16} className="text-emerald-600" />}>
                        <div className="flex flex-col md:flex-row-reverse gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>🛡️ Internet ke maadhyam se hone wale <strong>Cyber Attack</strong> se bachne ke liye hamesha saavdhaani baratni chahiye। Nimnlikhit baaton ka vishesh dhyaan rakhein —</Def>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="How to Avoid Cyber Attack" className="w-full h-auto rounded-2xl shadow-md border border-emerald-100" />
                            </div>
                        </div>

                        {/* Safety Tips */}
                        <div className="mt-5 space-y-4">
                            {[
                                {
                                    num: 1,
                                    title: 'Personal Information Share न करें',
                                    desc: 'Internet par uplabdh kisi bhi Website par apni Personal Information Share na karein। Pehle yeh sunishchit karein ki Website Secure hai ya nahi।',
                                    icon: <Fingerprint size={20} />,
                                    color: '#ef4444',
                                    bg: '#fef2f2',
                                    border: '#fecaca',
                                },
                                {
                                    num: 2,
                                    title: 'Spam E-mail aur Message se bachein',
                                    desc: 'Spam Message tatha Unknown E-mail ko na kholein aur na hi unka Reply dein। Facebook, Twitter, Instagram jaisi Social Networking Sites par apni Private Information Share na karein।',
                                    icon: <Mail size={20} />,
                                    color: '#f59e0b',
                                    bg: '#fffbeb',
                                    border: '#fde68a',
                                },
                                {
                                    num: 3,
                                    title: 'Strong Password ka upyog karein',
                                    desc: 'Internet par banaaye gaye sabhi Accounts ka Password mazboot (Strong) rakhein tatha use kisi anya vyakti ke saath Share na karein।',
                                    icon: <Key size={20} />,
                                    color: '#10b981',
                                    bg: '#ecfdf5',
                                    border: '#a7f3d0',
                                },
                                {
                                    num: 4,
                                    title: 'Unknown SMS Link par Click न करें',
                                    desc: 'SMS ke maadhyam se aane wale kisi bhi Unknown Link par Click na karein, visheshkar yadi uske baare mein aapko jaankari na ho।',
                                    icon: <Link2Off size={20} />,
                                    color: '#8b5cf6',
                                    bg: '#f5f3ff',
                                    border: '#ddd6fe',
                                },
                                {
                                    num: 5,
                                    title: 'Modified Application Install न करें',
                                    desc: 'Apne Mobile ya Computer mein kisi bhi prakar ki Modified ya Untrusted Application Install na karein।',
                                    icon: <AppWindow size={20} />,
                                    color: '#ec4899',
                                    bg: '#fdf2f8',
                                    border: '#fbcfe8',
                                },
                            ].map((tip, i) => (
                                <div key={i} className="p-5 rounded-2xl bg-white border shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: tip.border }}>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold shadow-lg" style={{ background: `linear-gradient(135deg, ${tip.color}dd, ${tip.color})` }}>
                                            {tip.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 text-sm mb-1 flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white" style={{ background: tip.color }}>{tip.num}</span>
                                                {tip.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">{tip.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Safety Checklist */}
                        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                            <h4 className="text-xs font-bold text-emerald-800 mb-3 uppercase tracking-wide flex items-center gap-2"><CheckCircle2 size={14} /> Cyber Safety Checklist</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[
                                    'Website ka HTTPS check karein',
                                    'Strong & unique passwords rakhein',
                                    'Unknown links par click na karein',
                                    'Antivirus software updated rakhein',
                                    'Two-Factor Authentication (2FA) enable karein',
                                    'Modified/Pirated apps install na karein',
                                    'Public WiFi par sensitive work na karein',
                                    'Regular data backup karein',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-emerald-100 text-sm text-emerald-800 font-medium">
                                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" /> {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <IB type="tip">Hamesha <strong>2-Factor Authentication (2FA)</strong> enable rakhein — yeh aapke account ko extra security layer deta hai chahe password leak bhi ho jaaye।</IB>
                    </Sec>

                    {/* ═══ SECTION: Cloud Computing ═══ */}
                    <Sec id="cloud-computing" title="🔴 Cloud Computing" icon={<Cloud size={16} className="text-sky-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>☁️ <strong>Cloud Computing</strong> ek aisi Technology hai, jiske maadhyam se Web Based Tools aur Applications dwara Server se seedhe <strong>Connect</strong> hua ja sakta hai। Isme Data tatha Programs ko <strong>Internet par Store</strong> kiya jaata hai tatha aavashyakta padne par kahin se bhi <strong>Access</strong> kiya ja sakta hai।</Def>
                                <p>Cloud Computing Business ke liye bahut upyogi Technology hai kyunki yeh <strong>kaary kshamta (Productivity)</strong> ko badhaati hai।</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Cloud Computing" className="w-full h-auto rounded-2xl shadow-md border border-sky-100" />
                            </div>
                        </div>

                        {/* Cloud Examples */}
                        <div className="mt-5">
                            <h4 className="text-xs font-bold text-sky-800 mb-3 uppercase tracking-wide">☁️ Cloud Computing ke pramukh udaaharaN:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {[
                                    { name: 'Google Cloud', icon: '🟢', bg: '#ecfdf5', border: '#a7f3d0' },
                                    { name: 'Microsoft Azure', icon: '🔵', bg: '#eff6ff', border: '#bfdbfe' },
                                    { name: 'IBM Cloud', icon: '⚫', bg: '#f1f5f9', border: '#cbd5e1' },
                                    { name: 'Amazon AWS', icon: '🟠', bg: '#fff7ed', border: '#fed7aa' },
                                    { name: 'Adobe Creative Cloud', icon: '🔴', bg: '#fef2f2', border: '#fecaca' },
                                ].map((c, i) => (
                                    <div key={i} className="p-3 rounded-xl text-center hover:shadow-md transition-shadow" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                                        <div className="text-2xl mb-1">{c.icon}</div>
                                        <p className="text-xs font-bold text-gray-800">{c.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cloud Computing Concept Diagram */}
                        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 border border-sky-800">
                            <h4 className="text-xs font-bold text-sky-300 mb-3 uppercase tracking-wide flex items-center gap-2"><Cloud size={14} /> Cloud Computing Architecture</h4>
                            <div className="flex justify-center">
                                <svg viewBox="0 0 400 200" className="w-full max-w-lg">
                                    <rect width="400" height="200" rx="12" fill="#0f172a" />
                                    {/* Cloud */}
                                    <ellipse cx="200" cy="70" rx="90" ry="45" fill="#0c4a6e" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="6,3">
                                        <animate attributeName="ry" values="45;48;45" dur="3s" repeatCount="indefinite" />
                                    </ellipse>
                                    <text x="200" y="60" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="bold">☁️ CLOUD</text>
                                    <text x="200" y="75" textAnchor="middle" fill="#38bdf8" fontSize="7">Data + Apps + Services</text>
                                    <text x="200" y="88" textAnchor="middle" fill="#0ea5e9" fontSize="6">Store • Access • Compute</text>

                                    {/* Devices */}
                                    {[
                                        { x: 60, y: 165, label: '💻 Laptop', color: '#22d3ee' },
                                        { x: 160, y: 175, label: '📱 Phone', color: '#a78bfa' },
                                        { x: 250, y: 175, label: '🖥️ Desktop', color: '#34d399' },
                                        { x: 340, y: 165, label: '📟 Tablet', color: '#fbbf24' },
                                    ].map((d, i) => (
                                        <g key={i}>
                                            <text x={d.x} y={d.y} textAnchor="middle" fill={d.color} fontSize="7" fontWeight="bold">{d.label}</text>
                                            <line x1={d.x} y1={d.y - 12} x2="200" y2="95" stroke={d.color} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.5">
                                                <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${1.5 + i * 0.4}s`} repeatCount="indefinite" />
                                            </line>
                                            <circle r="2" fill={d.color}>
                                                <animateMotion path={`M ${d.x} ${d.y - 12} L 200 95`} dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite" />
                                            </circle>
                                        </g>
                                    ))}

                                    <text x="200" y="140" textAnchor="middle" fill="#64748b" fontSize="7">🌐 Internet Connection</text>
                                </svg>
                            </div>
                        </div>

                        {/* Key Benefits */}
                        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: 'Anywhere Access', icon: '🌍', desc: 'Kahin se bhi data access karein' },
                                { label: 'Cost Effective', icon: '💰', desc: 'Hardware ki zaroorat kam' },
                                { label: 'Scalable', icon: '📈', desc: 'Zaroorat ke hisaab se badhayein' },
                                { label: 'Auto Backup', icon: '💾', desc: 'Data automatically backup hota hai' },
                            ].map((b, i) => (
                                <div key={i} className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-center hover:shadow-md transition-shadow">
                                    <div className="text-2xl mb-1">{b.icon}</div>
                                    <p className="text-xs font-bold text-gray-800">{b.label}</p>
                                    <p className="text-[10px] text-gray-600 mt-0.5">{b.desc}</p>
                                </div>
                            ))}
                        </div>

                        <IB type="note">Cloud Computing ne traditional computing ko badal diya hai — ab aapko expensive hardware khareedne ki zaroorat nahi, sab kuch <strong>Internet par available</strong> hai।</IB>
                    </Sec>

                    {/* ═══ SECTION: Types of Cloud Computing ═══ */}
                    <Sec id="cloud-types" title="🔴 Types of Cloud Computing" icon={<Layers size={16} className="text-indigo-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center mb-6">
                            <div className="flex-1">
                                <p className="mb-3">Cloud Computing mukhya roop se <strong>3 prakaar ki hoti hai</strong> —</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Types of Cloud Computing" className="w-full h-auto rounded-2xl shadow-md border border-indigo-100" />
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* Public Cloud */}
                            <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Globe size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">🔵 1. Public Cloud</h4>
                                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">Open Access</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">Public Cloud aisi <strong>Cloud Service</strong> hai jisme Resources Internet ke maadhyam se sabhi Users ke liye uplabdh rehte hain। Iska upyog koi bhi vyakti ya Organization kar sakta hai।</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                                        <p className="text-xs font-bold text-blue-800 mb-1">🌐 Features</p>
                                        <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc marker:text-blue-400">
                                            <li>Internet se sabhi ke liye accessible</li>
                                            <li>Shared resources ka use</li>
                                            <li>Pay-as-you-go pricing</li>
                                        </ul>
                                    </div>
                                    <div className="bg-sky-50 p-3 rounded-xl border border-sky-100">
                                        <p className="text-xs font-bold text-sky-800 mb-1">🏢 Examples</p>
                                        <ul className="text-xs text-sky-700 space-y-1 ml-4 list-disc marker:text-sky-400">
                                            <li>Google Cloud</li>
                                            <li>Microsoft Azure</li>
                                            <li>Amazon AWS</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Private Cloud */}
                            <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><Lock size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">🟢 2. Private Cloud</h4>
                                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Restricted Access</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">Private Cloud kisi ek <strong>Organization ya Company</strong> ke liye banaya jaata hai। Iska upyog kewal wahi Organization karti hai, jisse Data adhik <strong>surakshit</strong> rehta hai।</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                        <p className="text-xs font-bold text-emerald-800 mb-1">🔒 Features</p>
                                        <ul className="text-xs text-emerald-700 space-y-1 ml-4 list-disc marker:text-emerald-400">
                                            <li>Sirf ek organization ke liye</li>
                                            <li>Dedicated resources</li>
                                            <li>High security & control</li>
                                        </ul>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                                        <p className="text-xs font-bold text-green-800 mb-1">🏢 Examples</p>
                                        <ul className="text-xs text-green-700 space-y-1 ml-4 list-disc marker:text-green-400">
                                            <li>Company Data Center</li>
                                            <li>Private Enterprise Cloud</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Hybrid Cloud */}
                            <div className="p-5 rounded-2xl bg-white border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-xl"><Layers size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">🟣 3. Hybrid Cloud</h4>
                                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">Combined</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">Hybrid Cloud, <strong>Public Cloud aur Private Cloud ka Combination</strong> hota hai। Isme aavashyak Data ko Private Cloud mein tatha anya Services ko Public Cloud mein rakha jaata hai, jisse <strong>Security aur Flexibility</strong> dono prapt hoti hain।</p>
                                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                                    <p className="text-xs font-bold text-purple-800 mb-1">🔄 Kaise kaam karta hai</p>
                                    <ul className="text-xs text-purple-700 space-y-1 ml-4 list-disc marker:text-purple-400">
                                        <li>Sensitive Data → Private Cloud mein</li>
                                        <li>General Services → Public Cloud mein</li>
                                        <li>Dono ke beech secure connection</li>
                                        <li>Best of both worlds — Security + Scalability</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full text-xs border-collapse rounded-xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
                                        <th className="p-3 text-left text-white font-bold">Feature</th>
                                        <th className="p-3 text-center text-blue-300 font-bold">🔵 Public</th>
                                        <th className="p-3 text-center text-emerald-300 font-bold">🟢 Private</th>
                                        <th className="p-3 text-center text-purple-300 font-bold">🟣 Hybrid</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { feature: 'Access', pub: 'Everyone', priv: 'Single Org', hyb: 'Mixed' },
                                        { feature: 'Cost', pub: 'Low (Pay-as-use)', priv: 'High (Dedicated)', hyb: 'Medium' },
                                        { feature: 'Security', pub: 'Standard', priv: '✅ Very High', hyb: 'High' },
                                        { feature: 'Flexibility', pub: '✅ Very High', priv: 'Limited', hyb: '✅ Very High' },
                                        { feature: 'Control', pub: 'Limited', priv: '✅ Full', hyb: 'Partial' },
                                    ].map((row, i) => (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="p-3 font-bold text-gray-800 border-b border-gray-100">{row.feature}</td>
                                            <td className="p-3 text-center text-blue-700 border-b border-gray-100">{row.pub}</td>
                                            <td className="p-3 text-center text-emerald-700 border-b border-gray-100">{row.priv}</td>
                                            <td className="p-3 text-center text-purple-700 border-b border-gray-100">{row.hyb}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <IB type="tip">Zyaadatar bade organizations <strong>Hybrid Cloud</strong> ka use karti hain kyunki yeh <strong>security aur flexibility</strong> dono provide karta hai। Sensitive data private cloud mein aur general services public cloud mein rakhte hain।</IB>
                    </Sec>

                    {/* ═══ SECTION: Cloud Computing Services ═══ */}
                    <Sec id="cloud-services" title="🔴 Cloud Computing Services" icon={<Boxes size={16} className="text-rose-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>☁️ Cloud Computing mein Services ko mukhya roop se <strong>3 bhaagon</strong> mein baanta gaya hai — <strong>IaaS</strong>, <strong>PaaS</strong> aur <strong>SaaS</strong>। Ye teeno alag-alag level par Cloud ki suvidhaayein provide karti hain।</Def>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Cloud Computing Services" className="w-full h-auto rounded-2xl shadow-md border border-rose-100" />
                            </div>
                        </div>

                        {/* 3 Services Overview */}
                        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { name: 'IaaS', full: 'Infrastructure as a Service', desc: 'Virtual Infrastructure milta hai — Server, Storage, Network', icon: <Server size={24} />, color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', emoji: '🏗️' },
                                { name: 'PaaS', full: 'Platform as a Service', desc: 'Development Platform milta hai — Tools, Runtime, Database', icon: <Code size={24} />, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', emoji: '🛠️' },
                                { name: 'SaaS', full: 'Software as a Service', desc: 'Ready-to-use Software milta hai — Browser se access', icon: <MonitorPlay size={24} />, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', emoji: '📱' },
                            ].map((s, i) => (
                                <div key={i} className="p-5 rounded-2xl text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1" style={{ background: s.bg, border: `2px solid ${s.border}` }}>
                                    <div className="text-3xl mb-2">{s.emoji}</div>
                                    <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-white mb-3 shadow-lg" style={{ background: `linear-gradient(135deg, ${s.color}dd, ${s.color})` }}>{s.icon}</div>
                                    <h4 className="text-lg font-extrabold" style={{ color: s.color }}>{s.name}</h4>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{s.full}</p>
                                    <p className="text-xs text-gray-600">{s.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Service Layer Diagram */}
                        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-rose-950 border border-rose-800">
                            <h4 className="text-xs font-bold text-rose-300 mb-3 uppercase tracking-wide flex items-center gap-2"><Layers size={14} /> Cloud Services Layer Model</h4>
                            <div className="flex justify-center">
                                <svg viewBox="0 0 400 180" className="w-full max-w-lg">
                                    <rect width="400" height="180" rx="12" fill="#0f172a" />
                                    {/* SaaS - Top */}
                                    <rect x="50" y="15" width="300" height="40" rx="8" fill="#4c1d95" stroke="#8b5cf6" strokeWidth="1">
                                        <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
                                    </rect>
                                    <text x="200" y="32" textAnchor="middle" fill="#c4b5fd" fontSize="9" fontWeight="bold">📱 SaaS — Software as a Service</text>
                                    <text x="200" y="47" textAnchor="middle" fill="#a78bfa" fontSize="6">Gmail • Google Docs • Zoom • Dropbox • Microsoft 365</text>
                                    {/* PaaS - Middle */}
                                    <rect x="50" y="65" width="300" height="40" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1">
                                        <animate attributeName="opacity" values="0.8;1;0.8" dur="3.5s" repeatCount="indefinite" />
                                    </rect>
                                    <text x="200" y="82" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="bold">🛠️ PaaS — Platform as a Service</text>
                                    <text x="200" y="97" textAnchor="middle" fill="#34d399" fontSize="6">Google App Engine • Heroku • Azure App Service</text>
                                    {/* IaaS - Bottom */}
                                    <rect x="50" y="115" width="300" height="40" rx="8" fill="#0c4a6e" stroke="#0ea5e9" strokeWidth="1">
                                        <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />
                                    </rect>
                                    <text x="200" y="132" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="bold">🏗️ IaaS — Infrastructure as a Service</text>
                                    <text x="200" y="147" textAnchor="middle" fill="#38bdf8" fontSize="6">AWS EC2 • Azure VM • Google Compute Engine</text>
                                    {/* Arrows */}
                                    <text x="370" y="40" textAnchor="middle" fill="#8b5cf6" fontSize="7">End User</text>
                                    <text x="370" y="90" textAnchor="middle" fill="#10b981" fontSize="7">Developer</text>
                                    <text x="370" y="140" textAnchor="middle" fill="#0ea5e9" fontSize="7">IT Admin</text>
                                    <text x="200" y="172" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">Cloud Computing Service Models</text>
                                </svg>
                            </div>
                        </div>

                        <IB type="note">Yaad rakhein: <strong>IaaS → Infrastructure</strong>, <strong>PaaS → Platform</strong>, <strong>SaaS → Ready Software</strong>। Ye teeno Cloud Computing ki fundamental services hain jo O-Level exam mein zaroor puchhi jaati hain।</IB>
                    </Sec>

                    {/* ═══ SECTION: IaaS ═══ */}
                    <Sec id="iaas" title="🔴 1. IaaS (Infrastructure as a Service)" icon={<Server size={16} className="text-sky-600" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>🏗️ <strong>Infrastructure as a Service (IaaS)</strong> Cloud Computing ki woh Service hai jisme Users ko Internet ke maadhyam se <strong>Virtual Infrastructure</strong> uplabdh karaya jaata hai। Isme Physical Hardware khareedne ki aavashyakta nahi hoti, balki <strong>Server, Storage, Network aur Virtual Machine</strong> jaisi suvidhaayein Cloud Provider dwara uplabdh karai jaati hain।</Def>
                                <p>User apni aavashyakta ke anusaar Resources ko <strong>badha ya ghata</strong> sakta hai tatha kewal upyog kiye gaye Resources ka hi <strong>bhugtaan (Pay As You Use)</strong> karta hai।</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="IaaS Infrastructure" className="w-full h-auto rounded-2xl shadow-md border border-sky-100" />
                            </div>
                        </div>

                        {/* IaaS Services */}
                        <div className="mt-5">
                            <h4 className="text-xs font-bold text-sky-800 mb-3 uppercase tracking-wide">🖥️ IaaS mein uplabdh Services:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { name: 'Virtual Server', icon: '🖥️', bg: '#f0f9ff', border: '#bae6fd' },
                                    { name: 'Storage', icon: '💾', bg: '#eff6ff', border: '#bfdbfe' },
                                    { name: 'Networking', icon: '🌐', bg: '#ecfeff', border: '#a5f3fc' },
                                    { name: 'Virtual Machine', icon: '⚙️', bg: '#f0fdfa', border: '#99f6e4' },
                                    { name: 'Firewall', icon: '🛡️', bg: '#fef2f2', border: '#fecaca' },
                                    { name: 'Load Balancer', icon: '⚖️', bg: '#fefce8', border: '#fef08a' },
                                    { name: 'IP Address', icon: '📍', bg: '#faf5ff', border: '#e9d5ff' },
                                    { name: 'Backup Facility', icon: '📦', bg: '#f0fdf4', border: '#bbf7d0' },
                                ].map((s, i) => (
                                    <div key={i} className="p-3 rounded-xl text-center hover:shadow-md transition-shadow" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                                        <div className="text-xl mb-1">{s.icon}</div>
                                        <p className="text-xs font-bold text-gray-800">{s.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mt-5 p-4 rounded-2xl bg-sky-50 border border-sky-200">
                            <h4 className="text-xs font-bold text-sky-800 mb-3 uppercase tracking-wide">✨ Features of IaaS:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[
                                    'Hardware khareedne ki aavashyakta nahi hoti',
                                    'Resources ko aasaani se badhaya ya ghataya ja sakta hai',
                                    'Pay As You Use Model par kaary karta hai',
                                    'High Availability pradaan karta hai',
                                    'Backup evam Disaster Recovery ki suvidha',
                                    'Bade Applications ko aasaani se Host kiya ja sakta hai',
                                ].map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-sky-100 text-xs text-sky-800 font-medium">
                                        <CheckCircle2 size={14} className="text-sky-500 flex-shrink-0" /> {f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Advantages & Disadvantages */}
                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                <h4 className="text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wide">✅ Advantages</h4>
                                <ul className="text-xs text-emerald-700 space-y-1.5 ml-4 list-disc marker:text-emerald-400">
                                    <li>Praarambhik lagat (Initial Cost) kam hoti hai</li>
                                    <li>Scalability adhik hoti hai</li>
                                    <li>Maintenance ki aavashyakta nahi hoti</li>
                                    <li>Data Backup aasaan hota hai</li>
                                    <li>Business Continuity bani rehti hai</li>
                                </ul>
                            </div>
                            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                                <h4 className="text-xs font-bold text-red-800 mb-2 uppercase tracking-wide">❌ Disadvantages</h4>
                                <ul className="text-xs text-red-700 space-y-1.5 ml-4 list-disc marker:text-red-400">
                                    <li>Internet par nirbharta rehti hai</li>
                                    <li>Security Provider par nirbhar karti hai</li>
                                    <li>Galat Configuration hone par Data Leak ka khatra</li>
                                </ul>
                            </div>
                        </div>

                        {/* Examples */}
                        <div className="mt-5">
                            <h4 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wide">🏢 IaaS Examples:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {[
                                    { name: 'Amazon EC2', icon: '🟠', bg: '#fff7ed', border: '#fed7aa' },
                                    { name: 'Azure VM', icon: '🔵', bg: '#eff6ff', border: '#bfdbfe' },
                                    { name: 'Google Compute', icon: '🟢', bg: '#ecfdf5', border: '#a7f3d0' },
                                    { name: 'IBM Cloud', icon: '⚫', bg: '#f1f5f9', border: '#cbd5e1' },
                                    { name: 'Oracle Cloud', icon: '🔴', bg: '#fef2f2', border: '#fecaca' },
                                ].map((e, i) => (
                                    <div key={i} className="p-3 rounded-xl text-center hover:shadow-md transition-shadow" style={{ background: e.bg, border: `1px solid ${e.border}` }}>
                                        <div className="text-xl mb-1">{e.icon}</div>
                                        <p className="text-[11px] font-bold text-gray-800">{e.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <IB type="note">IaaS mein User ko <strong>Operating System, Applications aur Data</strong> khud manage karna padta hai, baaki sab <strong>Cloud Provider</strong> manage karta hai।</IB>
                    </Sec>

                    {/* ═══ SECTION: PaaS ═══ */}
                    <Sec id="paas" title="🔴 2. PaaS (Platform as a Service)" icon={<Code size={16} className="text-emerald-600" />}>
                        <div className="flex flex-col md:flex-row-reverse gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>🛠️ <strong>Platform as a Service (PaaS)</strong> Cloud Computing ki woh Service hai jisme Developers ko Application <strong>Develop, Test, Run tatha Deploy</strong> karne ke liye poora Platform uplabdh karaya jaata hai।</Def>
                                <p>Is Service mein Server, Operating System, Database, Runtime Environment tatha Development Tools pehle se uplabdh rehte hain। Isliye Developer ko <strong>Infrastructure Manage</strong> karne ki aavashyakta nahi hoti aur woh kewal <strong>Application Development</strong> par dhyaan deta hai।</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="PaaS Platform" className="w-full h-auto rounded-2xl shadow-md border border-emerald-100" />
                            </div>
                        </div>

                        {/* PaaS Services */}
                        <div className="mt-5">
                            <h4 className="text-xs font-bold text-emerald-800 mb-3 uppercase tracking-wide">🛠️ PaaS mein uplabdh Services:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { name: 'Dev Environment', icon: '💻', bg: '#ecfdf5', border: '#a7f3d0' },
                                    { name: 'Language Support', icon: '📝', bg: '#f0fdf4', border: '#bbf7d0' },
                                    { name: 'Database Mgmt', icon: '🗄️', bg: '#f0fdfa', border: '#99f6e4' },
                                    { name: 'Runtime Env', icon: '⚡', bg: '#ecfeff', border: '#a5f3fc' },
                                    { name: 'Testing Tools', icon: '🧪', bg: '#fefce8', border: '#fef08a' },
                                    { name: 'Deployment', icon: '🚀', bg: '#eff6ff', border: '#bfdbfe' },
                                    { name: 'Middleware', icon: '🔗', bg: '#faf5ff', border: '#e9d5ff' },
                                    { name: 'APIs', icon: '🔌', bg: '#fff7ed', border: '#fed7aa' },
                                ].map((s, i) => (
                                    <div key={i} className="p-3 rounded-xl text-center hover:shadow-md transition-shadow" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                                        <div className="text-xl mb-1">{s.icon}</div>
                                        <p className="text-xs font-bold text-gray-800">{s.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                            <h4 className="text-xs font-bold text-emerald-800 mb-3 uppercase tracking-wide">✨ Features of PaaS:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[
                                    'Application Development aasaan ho jaati hai',
                                    'Infrastructure Manage nahi karna padta',
                                    'Team Collaboration aasaan hoti hai',
                                    'Automatic Software Updates milte hain',
                                    'Fast Deployment ki suvidha hoti hai',
                                    'Multiple Programming Languages Support',
                                ].map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-emerald-100 text-xs text-emerald-800 font-medium">
                                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" /> {f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Advantages & Disadvantages */}
                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                                <h4 className="text-xs font-bold text-green-800 mb-2 uppercase tracking-wide">✅ Advantages</h4>
                                <ul className="text-xs text-green-700 space-y-1.5 ml-4 list-disc marker:text-green-400">
                                    <li>Development Time kam ho jaata hai</li>
                                    <li>Cost kam hoti hai</li>
                                    <li>Productivity badhti hai</li>
                                    <li>Software jaldi Deploy kiya ja sakta hai</li>
                                    <li>Infrastructure ki chinta nahi rehti</li>
                                </ul>
                            </div>
                            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                                <h4 className="text-xs font-bold text-red-800 mb-2 uppercase tracking-wide">❌ Disadvantages</h4>
                                <ul className="text-xs text-red-700 space-y-1.5 ml-4 list-disc marker:text-red-400">
                                    <li>Platform Provider par Dependency rehti hai</li>
                                    <li>Limited Customization milti hai</li>
                                    <li>Vendor Lock-in ki samasya ho sakti hai</li>
                                    <li>Security poori tarah Provider par nirbhar</li>
                                </ul>
                            </div>
                        </div>

                        {/* Examples */}
                        <div className="mt-5">
                            <h4 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wide">🏢 PaaS Examples:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {[
                                    { name: 'Google App Engine', icon: '🟢', bg: '#ecfdf5', border: '#a7f3d0' },
                                    { name: 'Azure App Svc', icon: '🔵', bg: '#eff6ff', border: '#bfdbfe' },
                                    { name: 'Heroku', icon: '🟣', bg: '#faf5ff', border: '#e9d5ff' },
                                    { name: 'Red Hat OpenShift', icon: '🔴', bg: '#fef2f2', border: '#fecaca' },
                                    { name: 'AWS Beanstalk', icon: '🟠', bg: '#fff7ed', border: '#fed7aa' },
                                ].map((e, i) => (
                                    <div key={i} className="p-3 rounded-xl text-center hover:shadow-md transition-shadow" style={{ background: e.bg, border: `1px solid ${e.border}` }}>
                                        <div className="text-xl mb-1">{e.icon}</div>
                                        <p className="text-[11px] font-bold text-gray-800">{e.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <IB type="note">PaaS mein Developer kewal <strong>Application aur Data</strong> manage karta hai। Baaki Infrastructure, OS, Runtime sab <strong>Provider manage</strong> karta hai।</IB>
                    </Sec>

                    {/* ═══ SECTION: SaaS ═══ */}
                    <Sec id="saas" title="🔴 3. SaaS (Software as a Service)" icon={<MonitorPlay size={16} className="text-violet-600" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>📱 <strong>Software as a Service (SaaS)</strong> Cloud Computing ki woh Service hai jisme Software Internet ke maadhyam se seedhe <strong>User ko uplabdh</strong> karaya jaata hai।</Def>
                                <p>User ko Software <strong>Install karne ki aavashyakta nahi</strong> hoti। Woh kewal <strong>Web Browser ya Mobile App</strong> ki sahaayata se Software ka upyog kar sakta hai। Software ka Maintenance, Security, Update tatha Backup <strong>Cloud Provider</strong> dwara kiya jaata hai।</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="SaaS Software" className="w-full h-auto rounded-2xl shadow-md border border-violet-100" />
                            </div>
                        </div>

                        {/* SaaS Services */}
                        <div className="mt-5">
                            <h4 className="text-xs font-bold text-violet-800 mb-3 uppercase tracking-wide">📱 SaaS mein uplabdh Services:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { name: 'Online Office', icon: '📄', bg: '#f5f3ff', border: '#ddd6fe' },
                                    { name: 'E-mail Service', icon: '📧', bg: '#fef2f2', border: '#fecaca' },
                                    { name: 'Video Conference', icon: '📹', bg: '#eff6ff', border: '#bfdbfe' },
                                    { name: 'Online Storage', icon: '☁️', bg: '#ecfeff', border: '#a5f3fc' },
                                    { name: 'CRM Software', icon: '👥', bg: '#ecfdf5', border: '#a7f3d0' },
                                    { name: 'ERP Software', icon: '🏢', bg: '#fff7ed', border: '#fed7aa' },
                                    { name: 'LMS', icon: '📚', bg: '#fefce8', border: '#fef08a' },
                                ].map((s, i) => (
                                    <div key={i} className="p-3 rounded-xl text-center hover:shadow-md transition-shadow" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                                        <div className="text-xl mb-1">{s.icon}</div>
                                        <p className="text-xs font-bold text-gray-800">{s.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mt-5 p-4 rounded-2xl bg-violet-50 border border-violet-200">
                            <h4 className="text-xs font-bold text-violet-800 mb-3 uppercase tracking-wide">✨ Features of SaaS:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[
                                    'Software Install karne ki aavashyakta nahi',
                                    'Internet se kahin bhi Access kiya ja sakta hai',
                                    'Automatic Updates milte hain',
                                    'Multi-user Support uplabdh hota hai',
                                    'Subscription aadhaarit Service hoti hai',
                                    'Maintenance Provider karta hai',
                                ].map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-violet-100 text-xs text-violet-800 font-medium">
                                        <CheckCircle2 size={14} className="text-violet-500 flex-shrink-0" /> {f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Advantages & Disadvantages */}
                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                                <h4 className="text-xs font-bold text-purple-800 mb-2 uppercase tracking-wide">✅ Advantages</h4>
                                <ul className="text-xs text-purple-700 space-y-1.5 ml-4 list-disc marker:text-purple-400">
                                    <li>Installation ki aavashyakta nahi hoti</li>
                                    <li>Kahin se bhi upyog kiya ja sakta hai</li>
                                    <li>Low Cost hoti hai</li>
                                    <li>Automatic Backup milta hai</li>
                                    <li>Automatic Update uplabdh hote hain</li>
                                    <li>Collaboration aasaan hota hai</li>
                                </ul>
                            </div>
                            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                                <h4 className="text-xs font-bold text-red-800 mb-2 uppercase tracking-wide">❌ Disadvantages</h4>
                                <ul className="text-xs text-red-700 space-y-1.5 ml-4 list-disc marker:text-red-400">
                                    <li>Internet ke bina kaary nahi karta</li>
                                    <li>Data Security Provider par nirbhar karti hai</li>
                                    <li>Limited Control milta hai</li>
                                    <li>Subscription samaapt hone par Service band ho sakti hai</li>
                                </ul>
                            </div>
                        </div>

                        {/* Examples */}
                        <div className="mt-5">
                            <h4 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wide">🏢 SaaS Examples:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { name: 'Google Docs', icon: '📄', bg: '#eff6ff', border: '#bfdbfe' },
                                    { name: 'Gmail', icon: '📧', bg: '#fef2f2', border: '#fecaca' },
                                    { name: 'Microsoft 365', icon: '🟠', bg: '#fff7ed', border: '#fed7aa' },
                                    { name: 'Zoom', icon: '📹', bg: '#eff6ff', border: '#bfdbfe' },
                                    { name: 'Dropbox', icon: '📦', bg: '#f0f9ff', border: '#bae6fd' },
                                    { name: 'Salesforce', icon: '☁️', bg: '#ecfeff', border: '#a5f3fc' },
                                    { name: 'Canva', icon: '🎨', bg: '#faf5ff', border: '#e9d5ff' },
                                ].map((e, i) => (
                                    <div key={i} className="p-3 rounded-xl text-center hover:shadow-md transition-shadow" style={{ background: e.bg, border: `1px solid ${e.border}` }}>
                                        <div className="text-xl mb-1">{e.icon}</div>
                                        <p className="text-[11px] font-bold text-gray-800">{e.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <IB type="tip">SaaS mein User ko <strong>kuch bhi manage nahi karna padta</strong> — poora Software aur Infrastructure <strong>Provider dwara manage</strong> hota hai। Yeh sabse simple cloud service hai।</IB>
                    </Sec>

                    {/* ═══ SECTION: IaaS vs PaaS vs SaaS Comparison ═══ */}
                    <section className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg bg-white" style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <Layers size={16} className="text-indigo-500" />
                            <h2 className="text-base md:text-lg font-extrabold text-gray-800">🔴 IaaS, PaaS aur SaaS mein Antar</h2>
                        </div>
                        <div className="text-sm leading-relaxed space-y-3 text-gray-600">

                        {/* Comparison Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs border-collapse rounded-xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr style={{ background: 'linear-gradient(135deg, #0c4a6e, #1e1b4b)' }}>
                                        <th className="p-3 text-left text-white font-bold">Aadhaar</th>
                                        <th className="p-3 text-center text-sky-300 font-bold">🏗️ IaaS</th>
                                        <th className="p-3 text-center text-emerald-300 font-bold">🛠️ PaaS</th>
                                        <th className="p-3 text-center text-violet-300 font-bold">📱 SaaS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { feature: 'Full Form', iaas: 'Infrastructure as a Service', paas: 'Platform as a Service', saas: 'Software as a Service' },
                                        { feature: 'Kya milta hai', iaas: 'Infrastructure', paas: 'Development Platform', saas: 'Ready-to-use Software' },
                                        { feature: 'Kiske liye', iaas: 'System Admin, IT Engineer', paas: 'Developer', saas: 'End User' },
                                        { feature: 'User kya manage karta hai', iaas: 'OS, Apps, Data', paas: 'Kewal App & Data', saas: 'Kuch bhi nahi' },
                                        { feature: 'Provider kya manage karta hai', iaas: 'Hardware, Storage, Network', paas: 'Infra + OS + Runtime', saas: 'Poora Software & Infra' },
                                        { feature: 'Mukhya upyog', iaas: 'Virtual Server banana', paas: 'App Develop karna', saas: 'Software ka use karna' },
                                        { feature: 'Examples', iaas: 'AWS EC2, Azure VM', paas: 'Google App Engine, Heroku', saas: 'Gmail, Docs, MS 365' },
                                    ].map((row, i) => (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="p-3 font-bold text-gray-800 border-b border-gray-100">{row.feature}</td>
                                            <td className="p-3 text-center text-sky-700 border-b border-gray-100">{row.iaas}</td>
                                            <td className="p-3 text-center text-emerald-700 border-b border-gray-100">{row.paas}</td>
                                            <td className="p-3 text-center text-violet-700 border-b border-gray-100">{row.saas}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Easy Memory Aid */}
                        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
                            <h4 className="text-xs font-bold text-indigo-800 mb-3 uppercase tracking-wide flex items-center gap-2"><Zap size={14} /> Aasaan tarike se yaad rakhein:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="p-4 rounded-xl bg-white border-2 border-sky-200 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                                    <div className="text-3xl mb-2">🏗️</div>
                                    <p className="text-sm font-extrabold text-sky-700">IaaS</p>
                                    <p className="text-xs text-gray-600 mt-1 font-semibold">Infrastructure milta hai</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white border-2 border-emerald-200 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                                    <div className="text-3xl mb-2">🛠️</div>
                                    <p className="text-sm font-extrabold text-emerald-700">PaaS</p>
                                    <p className="text-xs text-gray-600 mt-1 font-semibold">Platform milta hai</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white border-2 border-violet-200 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                                    <div className="text-3xl mb-2">📱</div>
                                    <p className="text-sm font-extrabold text-violet-700">SaaS</p>
                                    <p className="text-xs text-gray-600 mt-1 font-semibold">Ready Software milta hai</p>
                                </div>
                            </div>
                        </div>

                        <IB type="warning">Yehi Cloud Computing ki teen pramukh Services hain aur O Level pariksha mein inki <strong>Definition, Features, Advantages, Examples aur Differences</strong> aksar puchhe jaate hain। Inhe achche se yaad karein!</IB>

                        </div>
                    </section>

                    {/* ═══════════════════════════════════════════════════════════════ */}
                    {/* ═══ MACHINE LEARNING (ML) SECTION ═══ */}
                    {/* ═══════════════════════════════════════════════════════════════ */}

                    {/* ML Section Divider */}
                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-dashed border-blue-200" /></div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-6 py-2 rounded-full text-sm font-extrabold text-blue-700 border-2 border-blue-200 shadow-lg flex items-center gap-2">
                                <Brain size={18} /> Machine Learning (ML)
                            </span>
                        </div>
                    </div>

                    {/* ═══ SECTION: ML Definition ═══ */}
                    <Sec id="ml-definition" title="🧠 Machine Learning (ML) — Definition" icon={<Brain size={16} className="text-blue-600" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>🤖 <strong>Machine Learning (ML)</strong> Artificial Intelligence (AI) की एक महत्वपूर्ण शाखा (Branch) है, जिसमें Computer Systems को इस प्रकार बनाया जाता है कि वे Data से स्वयं सीख (Learn) सकें, उसमें छिपे हुए Patterns को पहचान सकें और बिना बार-बार Program किए अपने निर्णय (Decision) लेने की क्षमता विकसित कर सकें।</Def>
                                <p>सामान्य Programming में प्रत्येक कार्य के लिए अलग-अलग Instructions लिखनी पड़ती हैं, जबकि Machine Learning में Computer को बड़ी मात्रा में Data उपलब्ध कराया जाता है। Computer उस Data का विश्लेषण (Analysis) करता है, उसमें समानताएँ (Patterns) खोजता है और भविष्य में आने वाले नए Data के आधार पर सही निर्णय लेने का प्रयास करता है।</p>
                                <p>इसी कारण Machine Learning को <strong>&quot;Learning from Data&quot;</strong> भी कहा जाता है।</p>
                            </div>
                            <div className="w-full md:w-72 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Machine Learning Overview" className="w-full h-auto rounded-2xl shadow-md border border-blue-100" />
                            </div>
                        </div>

                        {/* ML vs Traditional Programming */}
                        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                            <h4 className="text-xs font-bold text-blue-800 mb-3 uppercase tracking-wide flex items-center gap-2"><Zap size={14} /> Traditional Programming vs Machine Learning</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white border-2 border-orange-200 hover:shadow-lg transition-all hover:-translate-y-1">
                                    <div className="text-2xl mb-2">📝</div>
                                    <p className="text-sm font-extrabold text-orange-700">Traditional Programming</p>
                                    <p className="text-xs text-gray-600 mt-1 font-medium">Input + <strong>Rules</strong> → Output</p>
                                    <p className="text-xs text-gray-500 mt-1">Programmer rules likhta hai</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white border-2 border-blue-200 hover:shadow-lg transition-all hover:-translate-y-1">
                                    <div className="text-2xl mb-2">🧠</div>
                                    <p className="text-sm font-extrabold text-blue-700">Machine Learning</p>
                                    <p className="text-xs text-gray-600 mt-1 font-medium">Input + Output → <strong>Rules (Model)</strong></p>
                                    <p className="text-xs text-gray-500 mt-1">Machine khud rules seekhti hai</p>
                                </div>
                            </div>
                        </div>

                        <IB type="tip">Machine Learning ka sabse bada fayda yeh hai ki Computer ko har cheez ke liye alag se program nahi karna padta — woh Data se <strong>khud seekh leta hai</strong>।</IB>
                    </Sec>

                    {/* ═══ SECTION: Working of Machine Learning ═══ */}
                    <Sec id="ml-working" title="🧠 Working of Machine Learning" icon={<Cog size={16} className="text-cyan-600" />}>
                        <p className="mb-4">Machine Learning mukhya roop se nimn <strong>5 charnon</strong> mein kaarya karti hai—</p>

                        <div className="w-full mb-5">
                            <img src="/sample-assets/placeholder.svg" alt="Machine Learning Working Process" className="w-full h-auto rounded-2xl shadow-md border border-cyan-100" />
                        </div>

                        <div className="space-y-4">
                            {[
                                { step: 1, title: 'Data Collection', desc: 'Sabse pehle vibhinn Sources se Data ekatrit kiya jaata hai। Data jitna adhik aur Quality wala hoga, Model utna hi achha kaarya karega।', icon: <Database size={20} />, color: '#06b6d4', bg: '#ecfeff', border: '#22d3ee' },
                                { step: 2, title: 'Data Preparation', desc: 'Collected Data ko saaf (Clean) kiya jaata hai। Isme Missing Values hataayi jaati hain, galat Data ko theek kiya jaata hai tatha Data ko Machine Learning ke liye tayyar kiya jaata hai।', icon: <Search size={20} />, color: '#3b82f6', bg: '#eff6ff', border: '#93c5fd' },
                                { step: 3, title: 'Model Training', desc: 'Prepared Data ko Machine Learning Algorithm ko diya jaata hai। Algorithm Data ka adhyayan karta hai aur usmein maujood Patterns tatha Relationships ko seekhta hai।', icon: <Brain size={20} />, color: '#8b5cf6', bg: '#f5f3ff', border: '#a78bfa' },
                                { step: 4, title: 'Prediction', desc: 'Jab Model poori tarah seekh jaata hai, tab use naya Data diya jaata hai aur woh uske aadhaar par Prediction ya Decision deta hai।', icon: <Target size={20} />, color: '#f59e0b', bg: '#fffbeb', border: '#fbbf24' },
                                { step: 5, title: 'Improvement', desc: 'Jaise-jaise naya Data milta hai, Machine Learning Model apni Accuracy ko lagaataar behtar banaata rahta hai।', icon: <TrendingUp size={20} />, color: '#10b981', bg: '#ecfdf5', border: '#34d399' },
                            ].map((s) => (
                                <div key={s.step} className="flex items-start gap-4 p-4 rounded-xl border hover:shadow-md transition-shadow" style={{ background: s.bg, borderColor: s.border }}>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`, color: '#fff' }}>
                                        {s.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-sm mb-1" style={{ color: s.color }}>
                                            Step {s.step}: {s.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Flow Diagram */}
                        <div className="mt-5 p-4 rounded-xl bg-cyan-50 border border-cyan-200">
                            <p className="text-sm text-cyan-900 font-semibold mb-3">🔄 ML Working Flow:</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 flex-wrap">
                                {['Data Collection', 'Data Preparation', 'Model Training', 'Prediction', 'Improvement'].map((step, i) => (
                                    <span key={i} className="flex items-center gap-2">
                                        <span className={`px-3 py-2 rounded-lg text-xs font-bold shadow-sm ${i === 2 ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 border border-blue-200'}`}>{step}</span>
                                        {i < 4 && <ChevronRight className="text-blue-400 rotate-90 sm:rotate-0" size={14} />}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <IB type="note">ML Model ko jitna zyada aur achha Data milega, utna hi accurate uska <strong>Prediction</strong> hoga। Isliye Data Collection sabse important step hai।</IB>
                    </Sec>

                    {/* ═══ SECTION: Types of Machine Learning ═══ */}
                    <Sec id="ml-types" title="🧠 Types of Machine Learning" icon={<Layers size={16} className="text-purple-600" />}>
                        <p className="mb-4">Machine Learning mukhya roop se <strong>teen prakaar</strong> ki hoti hai—</p>

                        <div className="w-full mb-5">
                            <img src="/sample-assets/placeholder.svg" alt="Types of Machine Learning" className="w-full h-auto rounded-2xl shadow-md border border-purple-100" />
                        </div>

                        {/* 1. Supervised Learning */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 mb-4 hover:shadow-lg transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                                    <BookOpen size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-extrabold text-blue-800">1. Supervised Learning</h3>
                                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wide">Label Data se seekhna</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed mb-3">
                                Is prakaar ki Learning mein Computer ko pehle se <strong>Label kiya hua Data</strong> diya jaata hai। Arthaat pratyek Data ke saath uska sahi uttar bhi uplabdh hota hai। Machine usi Data se seekhkar bhavishya mein naye Data ki sahi Prediction karti hai।
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {['Student Result Prediction', 'House Price Prediction', 'Weather Forecasting', 'Spam E-mail Detection'].map((ex, i) => (
                                    <div key={i} className="px-3 py-2 rounded-lg bg-white border border-blue-100 text-[11px] font-semibold text-blue-700 text-center shadow-sm">
                                        {ex}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Unsupervised Learning */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 mb-4 hover:shadow-lg transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                    <BarChart3 size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-extrabold text-green-800">2. Unsupervised Learning</h3>
                                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-wide">Bina Label Data se seekhna</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed mb-3">
                                Is Learning mein Computer ko <strong>bina Label wala Data</strong> diya jaata hai। Machine swayam Data ka adhyayan karti hai aur usmein samaanata (Similarity), Pattern tatha Group khojti hai।
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {['Customer Grouping', 'Market Analysis', 'Product Recommendation', 'Data Clustering'].map((ex, i) => (
                                    <div key={i} className="px-3 py-2 rounded-lg bg-white border border-green-100 text-[11px] font-semibold text-green-700 text-center shadow-sm">
                                        {ex}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Reinforcement Learning */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 mb-4 hover:shadow-lg transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                    <Gamepad2 size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-extrabold text-orange-800">3. Reinforcement Learning</h3>
                                    <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wide">Trial and Error se seekhna</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed mb-3">
                                Is prakaar ki Learning mein Machine <strong>Trial and Error Method</strong> se seekhti hai। Jab Machine sahi kaarya karti hai to use <strong>Reward</strong> milta hai aur galat kaarya karne par <strong>Penalty</strong> milti hai। Isi prakriya se woh samay ke saath behtar nirnay lena seekh jaati hai।
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {['Self Driving Cars', 'Robotics', 'Game Playing AI', 'Industrial Automation'].map((ex, i) => (
                                    <div key={i} className="px-3 py-2 rounded-lg bg-white border border-orange-100 text-[11px] font-semibold text-orange-700 text-center shadow-sm">
                                        {ex}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="overflow-x-auto mt-5">
                            <table className="w-full text-xs border-collapse rounded-xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
                                        <th className="p-3 text-left text-white font-bold">Aadhaar</th>
                                        <th className="p-3 text-center text-blue-300 font-bold">📘 Supervised</th>
                                        <th className="p-3 text-center text-emerald-300 font-bold">📗 Unsupervised</th>
                                        <th className="p-3 text-center text-amber-300 font-bold">📙 Reinforcement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { feature: 'Data Type', s: 'Labeled Data', u: 'Unlabeled Data', r: 'No Data — Reward/Penalty' },
                                        { feature: 'Seekhne ka Tareeka', s: 'Teacher se (Guided)', u: 'Khud se (Self)', r: 'Trial & Error' },
                                        { feature: 'Output', s: 'Prediction', u: 'Grouping / Pattern', r: 'Best Strategy' },
                                        { feature: 'Example', s: 'Spam Detection', u: 'Customer Grouping', r: 'Self Driving Cars' },
                                    ].map((row, i) => (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="p-3 font-bold text-gray-800 border-b border-gray-100">{row.feature}</td>
                                            <td className="p-3 text-center text-blue-700 border-b border-gray-100">{row.s}</td>
                                            <td className="p-3 text-center text-emerald-700 border-b border-gray-100">{row.u}</td>
                                            <td className="p-3 text-center text-amber-700 border-b border-gray-100">{row.r}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <IB type="tip">O Level exam mein ML ke <strong>teeno types</strong> ki Definition, Examples aur Differences bahut important hain। Inhe achhe se yaad karein!</IB>
                    </Sec>

                    {/* ═══ SECTION: ML Advantages ═══ */}
                    <Sec id="ml-advantages" title="🧠 Advantages of Machine Learning" icon={<ThumbsUp size={16} className="text-emerald-600" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { text: 'Computer स्वयं Data से सीख सकता है।', icon: <Brain size={18} />, color: '#3b82f6', bg: '#eff6ff' },
                                { text: 'बड़ी मात्रा में Data का तेजी से विश्लेषण कर सकता है।', icon: <BarChart3 size={18} />, color: '#10b981', bg: '#ecfdf5' },
                                { text: 'Prediction की Accuracy बढ़ जाती है।', icon: <Target size={18} />, color: '#8b5cf6', bg: '#f5f3ff' },
                                { text: 'Human Effort कम हो जाता है।', icon: <Users size={18} />, color: '#f59e0b', bg: '#fffbeb' },
                                { text: 'Decision Making तेज और अधिक सटीक होती है।', icon: <Zap size={18} />, color: '#ef4444', bg: '#fef2f2' },
                                { text: 'Automation को बढ़ावा मिलता है।', icon: <Cog size={18} />, color: '#0891b2', bg: '#ecfeff' },
                                { text: 'समय और लागत दोनों की बचत होती है।', icon: <TrendingUp size={18} />, color: '#059669', bg: '#ecfdf5' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border hover:shadow-md transition-shadow" style={{ background: item.bg, borderColor: `${item.color}30` }}>
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}20`, color: item.color }}>
                                        {item.icon}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-700">{item.text}</p>
                                </div>
                            ))}
                        </div>
                        <IB type="note">ML ki wajah se aaj bahut saare kaam <strong>automatically</strong> ho jaate hain — jaise Email Spam Filter, YouTube Recommendations, Google Maps Traffic, etc.</IB>
                    </Sec>

                    {/* ═══ SECTION: ML Disadvantages ═══ */}
                    <Sec id="ml-disadvantages" title="🧠 Disadvantages of Machine Learning" icon={<ThumbsDown size={16} className="text-red-600" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { text: 'अच्छे परिणाम के लिए बहुत अधिक Data की आवश्यकता होती है।', icon: <Database size={18} />, color: '#ef4444' },
                                { text: 'Model Training में अधिक समय लग सकता है।', icon: <Activity size={18} />, color: '#f59e0b' },
                                { text: 'Powerful Hardware की आवश्यकता होती है।', icon: <MonitorSmartphone size={18} />, color: '#8b5cf6' },
                                { text: 'गलत Data मिलने पर गलत Prediction हो सकती है।', icon: <AlertTriangle size={18} />, color: '#dc2626' },
                                { text: 'Model को समय-समय पर Update करना पड़ता है।', icon: <TrendingUp size={18} />, color: '#0891b2' },
                                { text: 'Development और Maintenance की Cost अधिक हो सकती है।', icon: <Layers size={18} />, color: '#7c3aed' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50 border border-red-100 hover:shadow-md transition-shadow">
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15`, color: item.color }}>
                                        {item.icon}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-700">{item.text}</p>
                                </div>
                            ))}
                        </div>
                        <IB type="warning">ML ka sabse bada nuksan yeh hai ki agar training data mein <strong>bias (pakshpaat)</strong> hoga to model bhi galat decisions lega। Isliye Data Quality bahut zaroori hai!</IB>
                    </Sec>

                    {/* ═══ SECTION: ML Applications ═══ */}
                    <Sec id="ml-applications" title="🧠 Applications of Machine Learning" icon={<Target size={16} className="text-amber-600" />}>
                        <p className="mb-4">Machine Learning ka upyog vartaman samay mein lagbhag <strong>har kshetra</strong> mein kiya ja raha hai—</p>

                        <div className="w-full mb-5">
                            <img src="/sample-assets/placeholder.svg" alt="Machine Learning Applications" className="w-full h-auto rounded-2xl shadow-md border border-amber-100" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {[
                                { name: 'Face Recognition', icon: <Scan size={22} />, color: '#3b82f6', bg: '#eff6ff' },
                                { name: 'Speech Recognition', icon: <Mic size={22} />, color: '#8b5cf6', bg: '#f5f3ff' },
                                { name: 'Self Driving Cars', icon: <Car size={22} />, color: '#10b981', bg: '#ecfdf5' },
                                { name: 'Recommendation System', icon: <ThumbsUp size={22} />, color: '#f59e0b', bg: '#fffbeb' },
                                { name: 'Medical Diagnosis', icon: <Stethoscope size={22} />, color: '#ef4444', bg: '#fef2f2' },
                                { name: 'Fraud Detection', icon: <Shield size={22} />, color: '#dc2626', bg: '#fef2f2' },
                                { name: 'Spam Email Filtering', icon: <Mail size={22} />, color: '#ec4899', bg: '#fdf2f8' },
                                { name: 'Weather Forecasting', icon: <Cloud size={22} />, color: '#0ea5e9', bg: '#ecfeff' },
                                { name: 'Smart Agriculture', icon: <Sprout size={22} />, color: '#16a34a', bg: '#f0fdf4' },
                                { name: 'Industrial Automation', icon: <Cog size={22} />, color: '#7c3aed', bg: '#f5f3ff' },
                                { name: 'Robotics', icon: <Bot size={22} />, color: '#0891b2', bg: '#ecfeff' },
                                { name: 'Virtual Assistants', icon: <Smartphone size={22} />, color: '#6366f1', bg: '#eef2ff' },
                            ].map((app, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:shadow-lg transition-all hover:-translate-y-1" style={{ background: app.bg, borderColor: `${app.color}30` }}>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{ background: `${app.color}15`, color: app.color }}>
                                        {app.icon}
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-700 text-center">{app.name}</span>
                                </div>
                            ))}
                        </div>

                        <IB type="tip">YouTube, Netflix, Amazon, Google Maps — yeh sab <strong>Machine Learning</strong> ka use karte hain apne users ko better experience dene ke liye!</IB>
                    </Sec>

                    {/* ═══ SECTION: Real Life Examples ═══ */}
                    <Sec id="ml-real-life" title="🧠 Real Life Examples of ML" icon={<TrendingUp size={16} className="text-pink-600" />}>
                        <div className="space-y-3">
                            {[
                                { platform: 'YouTube', desc: 'Aapki pasand ke anusaar Videos Suggest karta hai।', emoji: '▶️', color: '#ef4444', bg: 'from-red-50 to-rose-50', border: '#fca5a5' },
                                { platform: 'Amazon', desc: 'Aapke pichhle Shopping Data ke aadhaar par Products Recommend karta hai।', emoji: '🛒', color: '#f59e0b', bg: 'from-amber-50 to-yellow-50', border: '#fbbf24' },
                                { platform: 'Google Maps', desc: 'Traffic ka vishleshan karke sabse tez Route bataata hai।', emoji: '🗺️', color: '#10b981', bg: 'from-green-50 to-emerald-50', border: '#34d399' },
                                { platform: 'Gmail', desc: 'Spam E-mails ko Automatically pehchaankar Spam Folder mein bhej deta hai।', emoji: '📧', color: '#3b82f6', bg: 'from-blue-50 to-sky-50', border: '#93c5fd' },
                                { platform: 'Netflix', desc: 'Aapki Watch History ke aadhaar par Movies aur Web Series Suggest karta hai।', emoji: '🎬', color: '#7c3aed', bg: 'from-purple-50 to-violet-50', border: '#a78bfa' },
                            ].map((ex, i) => (
                                <div key={i} className={`flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r ${ex.bg} border hover:shadow-md transition-shadow`} style={{ borderColor: ex.border }}>
                                    <div className="text-3xl flex-shrink-0">{ex.emoji}</div>
                                    <div>
                                        <h4 className="text-sm font-extrabold mb-1" style={{ color: ex.color }}>{ex.platform}</h4>
                                        <p className="text-xs text-gray-600 leading-relaxed">{ex.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ML Summary Card */}
                        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
                            <h4 className="text-sm font-extrabold mb-3 flex items-center gap-2"><Brain size={18} /> Machine Learning — Summary</h4>
                            <p className="text-xs leading-relaxed opacity-90">
                                Machine Learning ek aisi Technology hai jismein Computer Data se seekhta hai, Patterns ko pehchaanta hai aur bhavishya ke liye Prediction ya Decision leta hai। Yeh Artificial Intelligence ka ek mahatvapoorn bhaag hai aur vartaman samay mein <strong>Healthcare, Banking, Education, E-commerce, Robotics, Agriculture</strong> tatha <strong>Smart IoT Systems</strong> sahit lagbhag sabhi kshetron mein iska vyaapak upyog kiya ja raha hai।
                            </p>
                        </div>

                        <IB type="note">ML aur AI ke concepts O Level M4-R5 exam mein <strong>bahut important</strong> hain — Definition, Types, Working, Applications aur Real Life Examples yaad karein!</IB>
                    </Sec>

                    {/* Chapter Summary */}
                    <section className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 bg-gradient-to-br from-red-50 to-rose-50" style={{ border: '1px solid #fecaca', boxShadow: '0 4px 16px rgba(239,68,68,0.08)' }}>
                        <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #fecaca' }}>
                            <CheckCircle2 size={16} className="text-red-500" />
                            <h2 className="text-base md:text-lg font-extrabold text-gray-800">📋 Chapter Summary</h2>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Is chapter mein humne <strong>IoT Security</strong> ki zaroorat, <strong>Cyber Attacks</strong>, <strong>Hackers</strong>, <strong>Malware</strong>, <strong>Phishing</strong>, <strong>DDoS</strong>, <strong>Brute Force Attack</strong>, Cyber Attack se bachne ke tarike, <strong>Cloud Computing</strong> (Public, Private, Hybrid), <strong>Cloud Services</strong> — <strong>IaaS, PaaS, SaaS</strong> aur <strong>Machine Learning (ML)</strong> — iske Types (Supervised, Unsupervised, Reinforcement), Working, Advantages, Disadvantages, Applications aur Real Life Examples ke baare mein seekha।
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { label: 'Network Security', color: '#3b82f6' },
                                    { label: 'Cyber Attacks', color: '#8b5cf6' },
                                    { label: 'Hacker Types', color: '#f59e0b' },
                                    { label: 'Malware Attack', color: '#10b981' },
                                    { label: 'Phishing Attack', color: '#ec4899' },
                                    { label: 'DDoS Attack', color: '#ef4444' },
                                    { label: 'Brute Force', color: '#7c3aed' },
                                    { label: 'Cyber Safety', color: '#059669' },
                                    { label: 'Cloud Computing', color: '#0ea5e9' },
                                    { label: 'Public Cloud', color: '#3b82f6' },
                                    { label: 'Private Cloud', color: '#10b981' },
                                    { label: 'Hybrid Cloud', color: '#6366f1' },
                                    { label: 'IaaS', color: '#0284c7' },
                                    { label: 'PaaS', color: '#059669' },
                                    { label: 'SaaS', color: '#7c3aed' },
                                    { label: 'Cloud Services', color: '#f43f5e' },
                                    { label: 'Machine Learning', color: '#2563eb' },
                                    { label: 'Supervised ML', color: '#3b82f6' },
                                    { label: 'Unsupervised ML', color: '#10b981' },
                                    { label: 'Reinforcement ML', color: '#f59e0b' },
                                    { label: 'ML Applications', color: '#d97706' },
                                    { label: 'ML Working', color: '#0891b2' },
                                    { label: 'ML Advantages', color: '#059669' },
                                    { label: 'Real Life ML', color: '#ec4899' },
                                ].map((tag, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-white border rounded-full text-[10px] font-bold shadow-sm text-center" style={{ borderColor: `${tag.color}40`, color: tag.color }}>{tag.label}</span>
                                ))}
                            </div>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
}
