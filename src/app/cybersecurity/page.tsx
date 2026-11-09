'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, Home, Shield, AlertTriangle, Phone, Lock, Landmark, Skull, Siren, Sparkles, LayoutDashboard, StickyNote, Code2, Brain, Keyboard, ShieldCheck, ShieldAlert, BookOpen, Wifi, Bug, Eye, Mail, Globe, Smartphone, Key, Server, ChevronRight, FileWarning, Fingerprint, CreditCard, Users, Zap, Database } from 'lucide-react';

const quickLinks = [
    { label: 'Home', href: '/', icon: <Home size={13} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={13} /> },
    { label: 'Notes', href: '/notes', icon: <StickyNote size={13} /> },
    { label: 'Python', href: '/python', icon: <Code2 size={13} /> },
    { label: 'MCQ', href: '/mcq', icon: <Brain size={13} /> },
];

const sidebarMenu = [
    { id: 'what', label: 'Cyber Security क्या है?', icon: <Shield size={15} />, color: '#3b82f6' },
    { id: 'threats', label: 'Cyber Threats', icon: <AlertTriangle size={15} />, color: '#ef4444' },
    { id: 'attacks', label: 'Latest Attacks 2024-25', icon: <Bug size={15} />, color: '#f97316' },
    { id: 'social', label: 'Social Engineering', icon: <Users size={15} />, color: '#8b5cf6' },
    { id: 'phone', label: 'Phone/UPI Frauds', icon: <Phone size={15} />, color: '#ec4899' },
    { id: 'safety', label: 'कैसे बचें?', icon: <Lock size={15} />, color: '#10b981' },
    { id: 'password', label: 'Password Security', icon: <Key size={15} />, color: '#06b6d4' },
    { id: 'rbi', label: 'RBI Guidelines', icon: <Landmark size={15} />, color: '#818cf8' },
    { id: 'cases', label: 'Real Cases', icon: <Skull size={15} />, color: '#f43f5e' },
    { id: 'help', label: 'Helplines', icon: <Siren size={15} />, color: '#14b8a6' },
];

function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

function SectionCard({ id, icon, title, color, children }: { id: string; icon: React.ReactNode; title: string; color: string; children: React.ReactNode }) {
    return (
        <section id={id} className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all" style={{ background: '#ffffff', border: `1px solid ${hexToRgba(color, 0.15)}`, boxShadow: `0 2px 16px ${hexToRgba(color, 0.06)}` }}>
            <div className="flex items-center gap-3 mb-5 pb-3" style={{ borderBottom: `2px solid ${hexToRgba(color, 0.15)}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: hexToRgba(color, 0.08), border: `1px solid ${hexToRgba(color, 0.18)}` }}>
                    {icon}
                </div>
                <h2 className="text-lg md:text-xl font-bold" style={{ color }}>{title}</h2>
            </div>
            <div className="text-sm leading-relaxed" style={{ color: '#111827' }}>{children}</div>
        </section>
    );
}

function ThreatCard({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
    return (
        <div className="rounded-xl p-4 transition-all hover:scale-[1.02]" style={{ background: hexToRgba(color, 0.04), border: `1px solid ${hexToRgba(color, 0.12)}` }}>
            <div className="flex items-center gap-2 mb-2">
                <span style={{ color }}>{icon}</span>
                <span className="font-bold text-sm" style={{ color }}>{title}</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>{desc}</p>
        </div>
    );
}

function TipCard({ num, title, desc }: { num: number; title: string; desc: string }) {
    return (
        <div className="rounded-xl p-4" style={{ background: '#f0fdf4', borderLeft: '3px solid #10b981' }}>
            <span className="text-sm font-bold" style={{ color: '#059669' }}>{num}. {title}: </span>
            <span className="text-sm" style={{ color: '#111827' }}>{desc}</span>
        </div>
    );
}

export default function CybersecurityPage() {
    const [activeSection, setActiveSection] = useState('what');

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { rootMargin: '-100px 0px -60% 0px' });
        sidebarMenu.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <div style={{ background: '#f8fafc' }} className="min-h-screen">
            {/* ── Top Bar ── */}
            <header className="sticky top-0 z-30" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2e8f0' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link href="/" className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:scale-105" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                            <ArrowLeft size={16} style={{ color: '#64748b' }} />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-sm font-bold truncate" style={{ color: '#0f172a' }}>Cyber Security</h1>
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck size={8} style={{ color: '#10b981' }} />
                                <span className="text-[9px] uppercase tracking-[0.18em] font-semibold" style={{ color: '#10b981' }}>Advanced Guide</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {quickLinks.map((link) => (
                            <Link key={link.href} href={link.href}
                                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:bg-gray-100"
                                style={{ color: '#64748b' }}>
                                {link.icon}
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #3b82f6, #10b981, #06b6d4, #8b5cf6)' }} />
            </header>

            {/* ── Hero Banner ── */}
            <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
                <img src="/sample-assets/placeholder.svg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(30,58,95,0.85) 40%, rgba(14,116,144,0.75) 100%)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
                <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 md:py-14">
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldAlert size={16} style={{ color: '#6ee7b7' }} />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: '#6ee7b7' }}>Cyber Security Awareness 2025</span>
                    </div>
                    <h2 style={{ color: '#ffffff', textShadow: '0 2px 20px rgba(0,0,0,0.6)', fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
                        Complete Cyber Security Guide
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '42rem', marginBottom: '1.25rem' }}>
                        Internet पर सुरक्षित रहना आज की सबसे बड़ी ज़रूरत है। Latest attacks, threats, safety tips, RBI guidelines — सब कुछ एक जगह, बिल्कुल simple भाषा में।
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { label: '10 Topics', icon: '📚' },
                            { label: 'Latest 2024-25 Attacks', icon: '🔥' },
                            { label: 'RBI Guidelines', icon: '🏛️' },
                            { label: '15+ Real Cases', icon: '⚠️' },
                        ].map((s, i) => (
                            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                                <span>{s.icon}</span> {s.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main Layout: Sidebar + Content ── */}
            <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6 items-start">

                {/* Left Sidebar */}
                <aside className="hidden lg:block w-64 min-w-[256px] shrink-0" style={{ position: 'sticky', top: 72, alignSelf: 'flex-start' }}>
                    <div className="rounded-2xl p-4" style={{ maxHeight: 'calc(100vh - 90px)', overflowY: 'auto', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <BookOpen size={14} style={{ color: '#3b82f6' }} />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: '#475569' }}>Contents</span>
                        </div>
                        <nav className="flex flex-col gap-1">
                            {sidebarMenu.map((item) => (
                                <a key={item.id} href={`#${item.id}`}
                                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all"
                                    style={{
                                        background: activeSection === item.id ? hexToRgba(item.color, 0.08) : 'transparent',
                                        color: activeSection === item.id ? item.color : '#475569',
                                        borderLeft: activeSection === item.id ? `3px solid ${item.color}` : '3px solid transparent',
                                        fontWeight: activeSection === item.id ? 700 : 500,
                                    }}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">

                    {/* ═══ 1. WHAT IS CYBER SECURITY ═══ */}
                    <SectionCard id="what" icon={<Shield size={18} style={{ color: '#3b82f6' }} />} title="Cyber Security क्या है?" color="#3b82f6">
                        <p className="mb-4">
                            <strong>Cyber Security</strong> का मतलब है internet और digital platforms पर आपकी personal जानकारी, data, और devices को सुरक्षित रखना। जब हम online होते हैं — banking करते हैं, social media use करते हैं, emails भेजते हैं — तो hackers और scammers हमारा data चुराने की कोशिश करते हैं।
                        </p>
                        <div className="grid sm:grid-cols-3 gap-3 mb-4">
                            {[
                                { icon: <Globe size={20} />, t: 'Network Security', d: 'Internet और Wi-Fi networks को safe रखना' },
                                { icon: <Server size={20} />, t: 'Data Security', d: 'Personal data और files को protect करना' },
                                { icon: <Smartphone size={20} />, t: 'Application Security', d: 'Apps और software को safe बनाना' },
                            ].map((item, i) => (
                                <div key={i} className="rounded-xl p-4 text-center" style={{ background: '#eff6ff', border: '1px solid #dbeafe' }}>
                                    <div className="flex justify-center mb-2"><span style={{ color: '#3b82f6' }}>{item.icon}</span></div>
                                    <p className="text-xs font-bold mb-1" style={{ color: '#1e40af' }}>{item.t}</p>
                                    <p className="text-[11px]" style={{ color: '#6b7280' }}>{item.d}</p>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-xl p-4" style={{ background: '#f0f9ff', borderLeft: '3px solid #3b82f6' }}>
                            <p className="text-xs"><strong style={{ color: '#1e40af' }}>💡 याद रखें:</strong> Cyber security सिर्फ companies की ज़िम्मेदारी नहीं है — हर internet user को aware रहना ज़रूरी है!</p>
                        </div>
                    </SectionCard>

                    {/* ═══ 2. CYBER THREATS ═══ */}
                    <SectionCard id="threats" icon={<AlertTriangle size={18} style={{ color: '#ef4444' }} />} title="Cyber Threats — मुख्य खतरे" color="#ef4444">
                        <p className="mb-4">भारत में हर साल करोड़ों cyber crimes होते हैं। ये हैं सबसे common और खतरनाक threats:</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <ThreatCard icon={<Mail size={16} />} title="Phishing" desc="Fake emails/messages भेजकर bank details या passwords चुराना। ये सबसे common attack है — 80% cyber crimes phishing से शुरू होते हैं।" color="#ef4444" />
                            <ThreatCard icon={<Bug size={16} />} title="Malware / Virus" desc="खतरनाक software जो आपके computer में घुसकर data चुराता है, files delete करता है, या system को damage करता है।" color="#ef4444" />
                            <ThreatCard icon={<Lock size={16} />} title="Ransomware" desc="ये malware आपकी files को encrypt/lock कर देता है और unlock करने के लिए पैसे (Bitcoin में) मांगता है।" color="#ef4444" />
                            <ThreatCard icon={<Fingerprint size={16} />} title="Identity Theft" desc="आपकी personal information (Aadhaar, PAN, address) चुराकर loans लेना, bank accounts खोलना, या fraud करना।" color="#ef4444" />
                            <ThreatCard icon={<CreditCard size={16} />} title="Credit/Debit Card Fraud" desc="Card details चुराकर online shopping, पैसे transfer, या ATM से withdrawal करना।" color="#ef4444" />
                            <ThreatCard icon={<Eye size={16} />} title="Spyware" desc="चुपके से आपके phone/computer में install होकर सब कुछ record करता है — keystrokes, photos, messages सब।" color="#ef4444" />
                            <ThreatCard icon={<Wifi size={16} />} title="Man-in-the-Middle Attack" desc="Public Wi-Fi पर hackers आपकी और website के बीच बैठकर सारा data пढ़ सकते हैं।" color="#ef4444" />
                            <ThreatCard icon={<Database size={16} />} title="SQL Injection" desc="Websites के database में malicious code डालकर सारा user data चुरा लेना।" color="#ef4444" />
                        </div>
                    </SectionCard>

                    {/* ═══ 3. LATEST ATTACKS 2024-25 ═══ */}
                    <SectionCard id="attacks" icon={<Bug size={18} style={{ color: '#f97316' }} />} title="Latest Cyber Attacks 2024-25 — नए खतरे" color="#f97316">
                        <p className="mb-4">Technology के साथ-साथ hackers भी advance हो गए हैं। ये हैं latest और सबसे dangerous attacks:</p>
                        <div className="grid gap-3">
                            {[
                                { t: 'AI-Powered Phishing', d: 'अब hackers AI (ChatGPT जैसे tools) का use करके bilkul real लगने वाले emails बनाते हैं। Grammar mistakes नहीं होती, इसलिए पहचानना मुश्किल।', tag: '🤖 AI' },
                                { t: 'Deepfake Scams', d: 'AI से किसी का fake video/audio बनाकर पैसे मांगना। Boss की आवाज़ में call करके पैसे transfer करवाना — ये 2024 में बहुत बढ़ा है।', tag: '🎭 Deepfake' },
                                { t: 'QR Code Scams', d: 'Fake QR codes share करके payment लेने की बजाय आपके account से पैसे निकालना। OLX, Facebook Marketplace पर बहुत common।', tag: '📱 QR' },
                                { t: 'SIM Swapping', d: 'आपके mobile number की duplicate SIM बनवाकर OTPs receive करना और bank account खाली करना।', tag: '📲 SIM' },
                                { t: 'Juice Jacking', d: 'Public charging stations (airport, railway station) में USB cable से phone charge करते समय data चोरी। हमेशा अपना charger use करें।', tag: '🔌 USB' },
                                { t: 'Crypto Scams', d: '"Double your Bitcoin" schemes, fake crypto exchanges, pump-and-dump — 2024 में ₹1000 करोड़+ का fraud हुआ।', tag: '₿ Crypto' },
                                { t: 'WhatsApp Investment Scams', d: 'WhatsApp groups में fake investment tips, stock market signals — ज्यादातर fraud हैं। कभी unknown groups में पैसे invest न करें।', tag: '💬 WhatsApp' },
                                { t: 'Supply Chain Attacks', d: 'Trusted software companies को hack करके उनके updates में malware डालना — millions of users एक साथ affect।', tag: '🔗 Supply' },
                            ].map((item, i) => (
                                <div key={i} className="rounded-xl p-4 flex items-start gap-3" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ background: '#fdba74', color: '#7c2d12' }}>{item.tag}</span>
                                    <div>
                                        <span className="text-sm font-bold" style={{ color: '#c2410c' }}>{item.t}</span>
                                        <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    {/* ═══ 4. SOCIAL ENGINEERING ═══ */}
                    <SectionCard id="social" icon={<Users size={18} style={{ color: '#8b5cf6' }} />} title="Social Engineering — मन का खेल" color="#8b5cf6">
                        <p className="mb-4">Social Engineering में hacker technology नहीं, <strong>इंसान की मनोविज्ञान (psychology)</strong> का फायदा उठाता है। ये सबसे कामयाब attack method है क्योंकि ये इंसान की भावनाओं को target करता है।</p>
                        <div className="grid sm:grid-cols-2 gap-3 mb-4">
                            {[
                                { t: '😨 डर दिखाना', d: '"आपका account block हो जाएगा" — ऐसे messages डर पैदा करते हैं ताकि आप जल्दी में गलती करें।' },
                                { t: '🎁 लालच देना', d: '"₹50,000 का prize जीता" — लालच में link click करते ही data चोरी।' },
                                { t: '⏰ Urgency लाना', d: '"अभी 10 मिनट में ये करो वरना..." — time pressure देकर सोचने का मौका नहीं देते।' },
                                { t: '👔 Authority दिखाना', d: 'Bank manager, police officer, या government official बनकर call करना।' },
                            ].map((item, i) => (
                                <div key={i} className="rounded-xl p-4" style={{ background: '#f5f3ff', border: '1px solid #e9d5ff' }}>
                                    <p className="text-sm font-bold mb-1" style={{ color: '#7c3aed' }}>{item.t}</p>
                                    <p className="text-xs" style={{ color: '#6b7280' }}>{item.d}</p>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-xl p-4" style={{ background: '#faf5ff', borderLeft: '3px solid #8b5cf6' }}>
                            <p className="text-xs"><strong style={{ color: '#7c3aed' }}>🛡️ बचाव:</strong> कोई भी unexpected call/message आए तो — रुकें, सोचें, verify करें। कभी भी जल्दबाज़ी में कोई action न लें। Officially verify करें।</p>
                        </div>
                    </SectionCard>

                    {/* ═══ 5. PHONE/UPI FRAUDS ═══ */}
                    <SectionCard id="phone" icon={<Phone size={18} style={{ color: '#ec4899' }} />} title="Phone Call व UPI Frauds" color="#ec4899">
                        <p className="mb-4">India में UPI frauds सबसे तेज़ी से बढ़ रहे हैं। 2024 में ₹2,000 करोड़+ UPI fraud report हुए:</p>
                        <div className="grid gap-3 mb-4">
                            {[
                                { t: 'Fake Bank Calls', d: 'Unknown caller बोलता है "मैं SBI/HDFC से बोल रहा हूं, आपका account block हो जाएगा — अभी OTP बताइए।" — कभी OTP न बताएं!' },
                                { t: 'KYC Update Scam', d: '"आपकी KYC expire होने वाली है, ये link पर click करें" — Fake link पर आपकी सारी details चोरी।' },
                                { t: 'UPI Collect Request Fraud', d: 'पैसे receive करने की बजाय collect request भेजते हैं — PIN enter करते ही पैसे कट जाते हैं।' },
                                { t: 'Fake Customer Care', d: 'Google पर "Paytm customer care number" search करने पर fake numbers आते हैं — call करने पर scam।' },
                                { t: 'Screen Share Scam', d: '"AnyDesk/TeamViewer download करो" बोलकर आपकी screen देखते हैं और bank app से पैसे transfer करते हैं।' },
                            ].map((item, i) => (
                                <div key={i} className="rounded-xl p-4" style={{ background: '#fdf2f8', borderLeft: '3px solid #ec4899' }}>
                                    <span className="text-sm font-bold" style={{ color: '#be185d' }}>{item.t}: </span>
                                    <span className="text-sm" style={{ color: '#374151' }}>{item.d}</span>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-xl p-4" style={{ background: '#ecfdf5', borderLeft: '3px solid #10b981' }}>
                            <p className="text-xs"><strong style={{ color: '#059669' }}>💡 Pro Tips:</strong> Truecaller app use करें • कभी AnyDesk/TeamViewer install न करें • Google से customer care number search न करें, official website/app से ही number लें।</p>
                        </div>
                    </SectionCard>

                    {/* ═══ 6. HOW TO STAY SAFE ═══ */}
                    <SectionCard id="safety" icon={<Lock size={18} style={{ color: '#10b981' }} />} title="कैसे बचें Cyber Threats से?" color="#10b981">
                        <div className="grid gap-3">
                            <TipCard num={1} title="Unknown links पर click न करें" desc="Email, SMS, या WhatsApp में आए किसी भी unknown link पर click न करें। ये phishing हो सकता है।" />
                            <TipCard num={2} title="Strong Password रखें" desc="कम से कम 12 characters, uppercase, lowercase, numbers, और symbols (@#$!) का mix use करें। हर account का अलग password रखें।" />
                            <TipCard num={3} title="2FA (Two-Factor Authentication) Enable करें" desc="Login के बाद OTP या authenticator app से verify करें। ये extra security layer है — password leak होने पर भी safe।" />
                            <TipCard num={4} title="Software Updates रखें" desc="Phone, computer, और apps को हमेशा latest version पर रखें — updates में security patches होते हैं।" />
                            <TipCard num={5} title="Public Wi-Fi से बचें" desc="Airport, cafe, mall के Wi-Fi पर banking या shopping कभी न करें। Hackers easily data read कर सकते हैं।" />
                            <TipCard num={6} title="Antivirus Install करें" desc="Trusted antivirus software use करें। Windows Defender भी अच्छा है। Regular scan करते रहें।" />
                            <TipCard num={7} title="Social Media Privacy Settings" desc="सभी social media accounts की privacy settings check करें। Personal info (phone, email, address) public न रखें।" />
                            <TipCard num={8} title="App Permissions Check करें" desc="कोई torch app camera permission क्यों मांग रहा? Unnecessary permissions deny करें।" />
                            <TipCard num={9} title="Regular Backup लें" desc="Important files का cloud (Google Drive) या external hard drive पर backup रखें। Ransomware attack में काम आएगा।" />
                            <TipCard num={10} title="OTP/PIN कभी share न करें" desc="कोई भी bank officer कभी OTP नहीं मांगता। अगर कोई मांगे तो — 100% fraud है।" />
                        </div>
                    </SectionCard>

                    {/* ═══ 7. PASSWORD SECURITY ═══ */}
                    <SectionCard id="password" icon={<Key size={18} style={{ color: '#06b6d4' }} />} title="Password Security — सुरक्षित पासवर्ड कैसे बनाएं?" color="#06b6d4">
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div className="rounded-xl p-4" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                                <p className="text-sm font-bold mb-2" style={{ color: '#dc2626' }}>❌ बुरे Passwords</p>
                                <ul className="text-xs space-y-1" style={{ color: '#6b7280' }}>
                                    <li>• 123456 / password</li>
                                    <li>• अपना नाम या जन्मदिन</li>
                                    <li>• qwerty / abcdef</li>
                                    <li>• phone number</li>
                                    <li>• एक ही password सब जगह</li>
                                </ul>
                            </div>
                            <div className="rounded-xl p-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                <p className="text-sm font-bold mb-2" style={{ color: '#16a34a' }}>✅ अच्छे Passwords</p>
                                <ul className="text-xs space-y-1" style={{ color: '#6b7280' }}>
                                    <li>• कम से कम 12 characters</li>
                                    <li>• Mix: A-Z, a-z, 0-9, @#$!</li>
                                    <li>• Example: Mera$Dog&Raja7!</li>
                                    <li>• Password Manager use करें</li>
                                    <li>• हर account का अलग password</li>
                                </ul>
                            </div>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: '#ecfeff', borderLeft: '3px solid #06b6d4' }}>
                            <p className="text-xs"><strong style={{ color: '#0891b2' }}>🔐 Recommended:</strong> Google Password Manager, Bitwarden (free), या 1Password use करें। ये सभी passwords safely store करता है।</p>
                        </div>
                    </SectionCard>

                    {/* ═══ 8. RBI GUIDELINES ═══ */}
                    <SectionCard id="rbi" icon={<Landmark size={18} style={{ color: '#818cf8' }} />} title="RBI Guidelines — बैंक और ग्राहक की ज़िम्मेदारी" color="#818cf8">
                        <p className="mb-4">RBI ने cyber fraud से बचाव के लिए clear rules बनाए हैं:</p>
                        <div className="grid gap-3 mb-4">
                            {[
                                { t: '3 दिन के अंदर report करें', d: 'Fraud होने के 3 दिन के अंदर bank को बताएं — आपकी कोई गलती नहीं तो पूरे पैसे वापस मिलेंगे।', color: '#16a34a' },
                                { t: '4-7 दिन में report करें', d: 'थोड़ी देरी होने पर limited liability — ₹25,000 तक का नुकसान आप पर।', color: '#f59e0b' },
                                { t: '7 दिन बाद report करें', d: 'बहुत देरी होने पर पूरा नुकसान आपका — इसलिए जल्दी report करें!', color: '#ef4444' },
                                { t: 'Bank की गलती होने पर', d: 'अगर fraud bank की system तechnology की गलती से हुआ — bank को 10 दिन में refund देना होगा।', color: '#3b82f6' },
                            ].map((item, i) => (
                                <div key={i} className="rounded-xl p-4" style={{ background: '#eef2ff', borderLeft: `3px solid ${item.color}` }}>
                                    <span className="text-sm font-bold" style={{ color: item.color }}>{item.t}: </span>
                                    <span className="text-sm" style={{ color: '#374151' }}>{item.d}</span>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-xl p-4" style={{ background: '#eff6ff', border: '1px solid #dbeafe' }}>
                            <p className="text-sm font-bold mb-2" style={{ color: '#1e40af' }}>Cyber Crime होने पर तुरंत करें:</p>
                            <ol className="text-xs space-y-1 list-decimal list-inside" style={{ color: '#374151' }}>
                                <li>बैंक को phone, email, या branch जाकर तुरंत सूचित करें</li>
                                <li>Cyber Crime Helpline <strong>155260</strong> / <strong>1930</strong> पर call करें</li>
                                <li><strong>cybercrime.gov.in</strong> पर online complaint दर्ज करें</li>
                                <li>Account/Card temporarily freeze करवाएं</li>
                                <li>सभी screenshot और evidence सुरक्षित रखें</li>
                            </ol>
                        </div>
                    </SectionCard>

                    {/* ═══ 9. REAL CASES ═══ */}
                    <SectionCard id="cases" icon={<Skull size={18} style={{ color: '#f43f5e' }} />} title="Real Cyber Crime Cases — सच्ची घटनाएं" color="#f43f5e">
                        <div className="grid sm:grid-cols-2 gap-3">
                            {[
                                { y: '2024', t: 'AI Deepfake Scam (HK)', d: 'Hong Kong में AI deepfake video call से ₹200 करोड़ का fraud — CFO समझकर पैसे transfer किए।' },
                                { y: '2024', t: 'AIIMS Delhi Data Breach', d: 'India के सबसे बड़े hospital का data hack — 4 करोड़+ patients का data expose.' },
                                { y: '2023', t: 'FedEx Scam India', d: '"आपके नाम पर FedEx से drugs आ रहे हैं" — lakhs of rupees ठगे।' },
                                { y: '2023', t: 'Digital Arrest Scam', d: 'Fake CBI/police video call — "digital arrest" बोलकर ₹1.5 करोड़ scam।' },
                                { y: '2022', t: 'SIM Swap Fraud', d: 'Duplicate SIM बनवाकर bank account से ₹50,000 निकाले।' },
                                { y: '2021', t: 'WhatsApp Cloning', d: 'SIM clone करके WhatsApp hack — contacts से पैसे की मांग।' },
                                { y: '2021', t: 'Pegasus Spyware', d: 'Israeli spyware से world leaders और journalists के phones hack।' },
                                { y: '2020', t: 'Twitter Hack', d: 'Elon Musk, Bill Gates के accounts hack — Bitcoin scam tweet।' },
                                { y: '2019', t: 'Capital One Breach', d: '100M+ customers का data hack — credit card info leak।' },
                                { y: '2018', t: 'Aadhaar Data Leak', d: '1.1 billion Indians का आधार data सिर्फ ₹500 में बेचा गया।' },
                                { y: '2018', t: 'Cambridge Analytica', d: 'Facebook users का data बिना permission elections में use।' },
                                { y: '2017', t: 'WannaCry Ransomware', d: '150 देशों के 2 लाख+ computers lock — Bitcoin में ransom मांगा।' },
                            ].map((c, i) => (
                                <div key={i} className="rounded-xl p-4 flex items-start gap-3 transition-all hover:scale-[1.01]" style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ background: '#fda4af', color: '#881337' }}>{c.y}</span>
                                    <div>
                                        <span className="text-sm font-bold" style={{ color: '#be123c' }}>{c.t}</span>
                                        <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{c.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    {/* ═══ 10. HELPLINES ═══ */}
                    <SectionCard id="help" icon={<Siren size={18} style={{ color: '#14b8a6' }} />} title="Emergency Helplines — तुरंत संपर्क करें" color="#14b8a6">
                        <div className="grid sm:grid-cols-3 gap-3 mb-4">
                            <div className="rounded-xl p-5 text-center" style={{ background: 'linear-gradient(135deg, #0f766e, #14b8a6)', boxShadow: '0 4px 16px rgba(20,184,166,0.3)' }}>
                                <p className="text-3xl font-extrabold mb-1 text-white">155260</p>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-200">Cyber Crime Helpline</p>
                            </div>
                            <div className="rounded-xl p-5 text-center" style={{ background: 'linear-gradient(135deg, #0f766e, #14b8a6)', boxShadow: '0 4px 16px rgba(20,184,166,0.3)' }}>
                                <p className="text-3xl font-extrabold mb-1 text-white">1930</p>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-200">Financial Fraud Helpline</p>
                            </div>
                            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="rounded-xl p-5 text-center transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #0f766e, #14b8a6)', boxShadow: '0 4px 16px rgba(20,184,166,0.3)' }}>
                                <p className="text-base font-extrabold mb-1 text-white">cybercrime.gov.in</p>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-200">Online Complaint Portal</p>
                            </a>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: '#f0fdfa', border: '1px solid #ccfbf1' }}>
                            <p className="text-sm font-bold mb-2" style={{ color: '#0f766e' }}>अन्य Important Numbers:</p>
                            <div className="grid sm:grid-cols-2 gap-2 text-xs" style={{ color: '#374151' }}>
                                <p>📞 <strong>112</strong> — Emergency Number (Police/Ambulance/Fire)</p>
                                <p>📞 <strong>14440</strong> — TRAI DND Service</p>
                                <p>📞 <strong>1800-11-4000</strong> — IRDA Insurance Helpline</p>
                                <p>📞 <strong>1800-345-3622</strong> — Digi Locker Helpline</p>
                                <p>🌐 <strong>sachet.rbi.org.in</strong> — RBI Complaint Portal</p>
                                <p>🌐 <strong>pgportal.gov.in</strong> — Public Grievance Portal</p>
                            </div>
                        </div>
                    </SectionCard>

                    {/* ── Footer ── */}
                    <div className="text-center py-8">
                        <p className="text-sm font-semibold" style={{ color: '#475569' }}>🛡️ सुरक्षित रहें, जागरूक रहें। Cyber crime से बचाव ही असली बचाव है!</p>
                        <p className="text-xs mt-2" style={{ color: '#475569' }}>© 2025 Knobly Web | Cyber Security Awareness</p>
                    </div>
                </main>
            </div>
        </div>
    );
}
