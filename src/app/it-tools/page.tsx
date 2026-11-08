'use client';

import Link from 'next/link';
import { ArrowLeft, Home, Monitor, Settings, FileText, Table2, Presentation, Globe, Mail, Wallet, ShieldCheck, PenTool, Lock, BookOpen } from 'lucide-react';

const CHAPTERS = [
    {
        num: 1,
        title: 'Introduction to Computer',
        desc: 'Computer types, IT gadgets, evolution, applications, input-output devices, hardware components, storage devices, और memory types को detail में समझें।',
        icon: <Monitor size={22} />,
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
        available: true,
        link: '/olevel/chapter-1',
        topics: ['Computer Types', 'I/O Devices', 'Memory & Storage', 'Hardware'],
    },
    {
        num: 2,
        title: 'Introduction to Operating System',
        desc: 'Operating System क्या है, Desktop vs Mobile OS, taskbar, file management, control panel, date/time, display properties जानें।',
        icon: <Settings size={22} />,
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)',
        available: false,
        link: '#',
        topics: ['Windows OS', 'File Manager', 'Control Panel', 'Settings'],
    },
    {
        num: 3,
        title: 'Word Processing (LibreOffice Writer)',
        desc: 'Document creation, editing, formatting, headers/footers, tables, spell check, page setup, find & replace, mail merge सीखें।',
        icon: <FileText size={22} />,
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)',
        available: false,
        link: '#',
        topics: ['Formatting', 'Tables & Lists', 'Mail Merge', 'Headers'],
    },
    {
        num: 4,
        title: 'Spreadsheet (LibreOffice Calc)',
        desc: 'Cells, rows, columns, formulas, functions (SUM, AVG, COUNT), sorting, filtering, charts, conditional formatting सीखें।',
        icon: <Table2 size={22} />,
        color: '#f97316',
        gradient: 'linear-gradient(135deg, #ffedd5 0%, #fff7ed 100%)',
        available: false,
        link: '#',
        topics: ['Formulas', 'Charts', 'Sorting', 'Formatting'],
    },
    {
        num: 5,
        title: 'Presentation (LibreOffice Impress)',
        desc: 'Slide creation, layouts, themes, animations, transitions, multimedia, master slides, speaker notes, slideshow settings।',
        icon: <Presentation size={22} />,
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%)',
        available: false,
        link: '#',
        topics: ['Slide Design', 'Animations', 'Transitions', 'Multimedia'],
    },
    {
        num: 6,
        title: 'Introduction to Internet & WWW',
        desc: 'Internet basics, network types (LAN, WAN, MAN), topologies, browsers, search engines, URL, protocols (HTTP, FTP) समझें।',
        icon: <Globe size={22} />,
        color: '#06b6d4',
        gradient: 'linear-gradient(135deg, #cffafe 0%, #ecfeff 100%)',
        available: false,
        link: '#',
        topics: ['Networks', 'Browsers', 'Protocols', 'Web Services'],
    },
    {
        num: 7,
        title: 'Email, Social Networking & e-Governance',
        desc: 'Email protocols (SMTP, POP, IMAP), social media platforms, digital communication, e-Governance portals जानें।',
        icon: <Mail size={22} />,
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)',
        available: false,
        link: '#',
        topics: ['Email', 'Social Media', 'e-Governance', 'Communication'],
    },
    {
        num: 8,
        title: 'Digital Financial Services',
        desc: 'Digital payments (UPI, NEFT, RTGS), mobile banking, e-wallets (Paytm, PhonePe), BHIM app, cashless economy समझें।',
        icon: <Wallet size={22} />,
        color: '#6366f1',
        gradient: 'linear-gradient(135deg, #e0e7ff 0%, #eef2ff 100%)',
        available: false,
        link: '#',
        topics: ['UPI & NEFT', 'Mobile Banking', 'E-Wallets', 'Digital Pay'],
    },
    {
        num: 9,
        title: 'Future Skills & Cyber Security',
        desc: 'AI, IoT, Big Data, Cloud Computing, Blockchain, cyber threats (phishing, malware, ransomware), internet safety सीखें।',
        icon: <ShieldCheck size={22} />,
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
        available: false,
        link: '#',
        topics: ['AI & IoT', 'Cloud', 'Cyber Security', 'Digital Skills'],
    },
];

export default function ITToolsPage() {
    return (
        <div style={{ background: '#f8fafc' }} className="min-h-screen">
            {/* ── Top Bar ── */}
            <header className="sticky top-0 z-30" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2e8f0' }}>
                <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link href="/" className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:scale-105" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                            <ArrowLeft size={16} style={{ color: '#64748b' }} />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-sm font-bold" style={{ color: '#0f172a' }}>IT Tools & Network Basics</h1>
                            <div className="flex items-center gap-1.5">
                                <Monitor size={8} style={{ color: '#0ea5e9' }} />
                                <span className="text-[9px] uppercase tracking-[0.18em] font-semibold" style={{ color: '#0ea5e9' }}>Module 1 · M1-R5</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Link href="/" className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:bg-gray-100" style={{ color: '#64748b' }}>
                            <Home size={13} /> Home
                        </Link>
                        <Link href="/notes" className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:bg-gray-100" style={{ color: '#64748b' }}>
                            <BookOpen size={13} /> Notes
                        </Link>
                        <Link href="/mcq" className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:bg-gray-100" style={{ color: '#64748b' }}>
                            <FileText size={13} /> MCQ
                        </Link>
                    </div>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #0ea5e9, #3b82f6, #8b5cf6, #6366f1)' }} />
            </header>

            {/* ── Hero Banner ── */}
            <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 30%, #0ea5e9 60%, #38bdf8 100%)' }}>
                {/* Decorative orbs */}
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #7dd3fc 0%, transparent 70%)', transform: 'translate(30%, -40%)' }} />
                <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)', transform: 'translate(-20%, 30%)' }} />
                {/* Pattern */}
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20h20v20H20zM0 0h20v20H0z\' fill=\'%23ffffff\' fill-opacity=\'1\'/%3E%3C/svg%3E")' }} />

                <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 md:py-14">
                    <div className="flex items-center gap-2 mb-3">
                        <Monitor size={16} style={{ color: '#bae6fd' }} />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: '#bae6fd' }}>NIELIT O-Level · Module 1</span>
                    </div>
                    <h2 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem', textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}>
                        IT Tools & Network Basics
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '36rem', marginBottom: '1.25rem' }}>
                        M1-R5 paper के सभी 9 chapters — Chapter-wise study material access करें। पहला chapter अभी available है, बाकी chapters जल्द ही आने वाले हैं।
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { label: '9 Chapters', icon: '📖' },
                            { label: 'Hindi + English', icon: '🇮🇳' },
                            { label: 'Handwritten Notes', icon: '✍️' },
                            { label: 'M1-R5 Syllabus', icon: '📋' },
                        ].map((s, i) => (
                            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                                <span>{s.icon}</span> {s.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <main className="max-w-6xl mx-auto px-4 py-8">

                {/* ── Handwritten Notes Card ── */}
                <div className="mb-8 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #fef9c3 0%, #fef3c7 40%, #fde68a 100%)', border: '1px solid #fbbf24', boxShadow: '0 4px 24px rgba(251,191,36,0.15)' }}>
                    <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)' }}>
                            <PenTool size={26} style={{ color: '#b45309' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-base font-bold" style={{ color: '#78350f' }}>✍️ Handwritten Notes</h3>
                                <span className="text-[9px] uppercase tracking-[0.15em] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f59e0b', color: '#fff' }}>Coming Soon</span>
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: '#92400e' }}>
                                सभी 9 chapters के handwritten notes — exam-ready format में, जल्द ही available होंगे। Stay tuned! 🔔
                            </p>
                        </div>
                        <div className="shrink-0 self-center">
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-not-allowed opacity-60" style={{ background: '#b45309', color: '#fff' }}>
                                <Lock size={13} /> Coming Soon
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Section Label ── */}
                <div className="flex items-center gap-3 mb-6 px-1">
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.3), transparent)' }} />
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold" style={{ color: '#0ea5e9' }}>All Chapters</span>
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.3), transparent)' }} />
                </div>

                {/* ── Chapter Cards Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {CHAPTERS.map((ch) => (
                        <div
                            key={ch.num}
                            className={`rounded-2xl overflow-hidden transition-all duration-300 ${ch.available ? 'hover:scale-[1.02] hover:-translate-y-1 cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
                            style={{
                                background: '#ffffff',
                                border: ch.available ? `2px solid ${ch.color}40` : '1px solid #e2e8f0',
                                boxShadow: ch.available ? `0 4px 20px ${ch.color}15` : '0 2px 8px rgba(0,0,0,0.03)',
                            }}
                        >
                            {/* Header stripe */}
                            <div className="h-1.5" style={{ background: ch.available ? `linear-gradient(90deg, ${ch.color}, ${ch.color}88)` : 'linear-gradient(90deg, #cbd5e1, #e2e8f0)' }} />

                            <div className="p-5 relative">
                                {/* Coming Soon Overlay for unavailable */}
                                {!ch.available && (
                                    <div className="absolute top-3 right-3">
                                        <span className="flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] font-bold px-2 py-1 rounded-full" style={{ background: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0' }}>
                                            <Lock size={9} /> Coming Soon
                                        </span>
                                    </div>
                                )}

                                {/* Chapter badge + icon */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full" style={{ background: ch.available ? `${ch.color}10` : '#f1f5f9', color: ch.available ? ch.color : '#94a3b8', border: `1px solid ${ch.available ? `${ch.color}20` : '#e2e8f0'}` }}>
                                        Chapter {ch.num}
                                    </span>
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: ch.available ? ch.gradient : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)' }}>
                                        <span style={{ color: ch.available ? ch.color : '#94a3b8' }}>{ch.icon}</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-base font-bold mb-2" style={{ color: ch.available ? '#0f172a' : '#94a3b8' }}>{ch.title}</h3>

                                {/* Description */}
                                <p className="text-xs leading-relaxed mb-3" style={{ color: ch.available ? '#64748b' : '#cbd5e1' }}>{ch.desc}</p>

                                {/* Topic tags */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {ch.topics.map((topic, j) => (
                                        <span key={j} className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: ch.available ? '#f1f5f9' : '#f8fafc', color: ch.available ? '#475569' : '#cbd5e1' }}>
                                            {topic}
                                        </span>
                                    ))}
                                </div>

                                {/* Action Button */}
                                {ch.available ? (
                                    <Link href={ch.link}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-lg hover:scale-[1.02]"
                                        style={{ background: ch.color }}>
                                        <BookOpen size={14} />
                                        Open Chapter
                                    </Link>
                                ) : (
                                    <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold cursor-not-allowed" style={{ background: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0' }}>
                                        <Lock size={13} />
                                        Coming Soon
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Exam Info ── */}
                <div className="mt-8 rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <Monitor size={18} style={{ color: '#0ea5e9' }} />
                        <h3 className="text-base font-bold" style={{ color: '#0f172a' }}>M1-R5 Exam Pattern</h3>
                    </div>
                    <div className="grid sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Questions', value: '100', sub: 'MCQ Type' },
                            { label: 'Total Marks', value: '100', sub: '1 Mark Each' },
                            { label: 'Duration', value: '2 Hours', sub: '120 Minutes' },
                            { label: 'Passing Marks', value: '50%', sub: '50 out of 100' },
                        ].map((item, i) => (
                            <div key={i} className="rounded-xl p-4 text-center" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                                <p className="text-2xl font-extrabold" style={{ color: '#0ea5e9' }}>{item.value}</p>
                                <p className="text-xs font-bold mt-1" style={{ color: '#0f172a' }}>{item.label}</p>
                                <p className="text-[10px]" style={{ color: '#94a3b8' }}>{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="text-center py-8">
                    <p className="text-sm font-semibold" style={{ color: '#475569' }}>💻 IT Tools Module 1 — Updated for 2025 exam</p>
                    <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>© 2025 Knobly Web | O-Level Study Material</p>
                </div>
            </main>
        </div>
    );
}
