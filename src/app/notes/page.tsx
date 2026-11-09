'use client';

import Link from 'next/link';
import { BookOpen, ArrowLeft, Home, Download, ExternalLink, Monitor, Settings, FileText, Table2, Presentation, Globe, Mail, Wallet, ShieldCheck, LayoutDashboard, Code2, Brain, Keyboard } from 'lucide-react';

const quickLinks = [
    { label: 'Home', href: '/', icon: <Home size={13} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={13} /> },
    { label: 'Python', href: '/python', icon: <Code2 size={13} /> },
    { label: 'MCQ', href: '/mcq', icon: <Brain size={13} /> },
];

const CHAPTERS = [
    { num: 1, title: 'Introduction to Computer', icon: <Monitor size={22} />, desc: 'Computers, IT gadgets, evolution, applications, input-output devices, hardware components, storage devices, और computer memory types को detail में समझें।', color: '#3b82f6', gradient: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)', link: '/optional-content', topics: ['Computer Types', 'Input/Output Devices', 'Memory & Storage', 'Hardware Components'] },
    { num: 2, title: 'Introduction to Operating System', icon: <Settings size={22} />, desc: 'Operating System क्या है, Desktop vs Mobile OS, taskbar, file management, control panel settings, date/time, display properties, और accessibility features जानें।', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)', link: '/optional-content', topics: ['Windows OS', 'File Manager', 'Control Panel', 'Desktop Settings'] },
    { num: 3, title: 'Word Processing (LibreOffice Writer)', icon: <FileText size={22} />, desc: 'Document creation, editing, formatting, headers/footers, tables, spell check, page setup, find & replace, mail merge, और printing — सब कुछ Writer में सीखें।', color: '#10b981', gradient: 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)', link: '/optional-content', topics: ['Formatting Text', 'Tables & Lists', 'Mail Merge', 'Headers & Footers'] },
    { num: 4, title: 'Spreadsheet (LibreOffice Calc)', icon: <Table2 size={22} />, desc: 'Cells, rows, columns, formulas, functions (SUM, AVG, COUNT), sorting, filtering, charts, conditional formatting, और data analysis LibreOffice Calc में सीखें।', color: '#f97316', gradient: 'linear-gradient(135deg, #ffedd5 0%, #fff7ed 100%)', link: '/optional-content', topics: ['Formulas & Functions', 'Charts & Graphs', 'Sorting & Filtering', 'Cell Formatting'] },
    { num: 5, title: 'LibreOffice Impress (Presentation)', icon: <Presentation size={22} />, desc: 'Slide creation, layouts, themes, animations, transitions, multimedia insert, master slides, speaker notes, और slideshow settings — professional presentations बनाएं।', color: '#ef4444', gradient: 'linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%)', link: '/optional-content', topics: ['Slide Design', 'Animations', 'Transitions', 'Multimedia'] },
    { num: 6, title: 'Introduction to Internet & WWW', icon: <Globe size={22} />, desc: 'Internet basics, network types (LAN, WAN, MAN), topologies, browsers, search engines, URL, protocols (HTTP, FTP), और web services को समझें।', color: '#06b6d4', gradient: 'linear-gradient(135deg, #cffafe 0%, #ecfeff 100%)', link: '/optional-content', topics: ['Network Types', 'Browsers', 'Protocols', 'Web Services'] },
    { num: 7, title: 'Email, Social Networking & e-Governance', icon: <Mail size={22} />, desc: 'Email protocols (SMTP, POP, IMAP), social media platforms, digital communication, e-Governance portals, और online government services जानें।', color: '#ec4899', gradient: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)', link: '/optional-content', topics: ['Email Services', 'Social Media', 'e-Governance', 'Digital Communication'] },
    { num: 8, title: 'Digital Financial Services', icon: <Wallet size={22} />, desc: 'Digital payments (UPI, NEFT, RTGS), mobile banking, e-wallets (Paytm, PhonePe), BHIM app, digital literacy, और cashless economy को समझें।', color: '#6366f1', gradient: 'linear-gradient(135deg, #e0e7ff 0%, #eef2ff 100%)', link: '/optional-content', topics: ['UPI & NEFT', 'Mobile Banking', 'E-Wallets', 'Digital Payments'] },
    { num: 9, title: 'Future Skills & Cyber Security', icon: <ShieldCheck size={22} />, desc: 'AI, IoT, Big Data, Cloud Computing, Blockchain basics, cyber threats (phishing, malware, ransomware), internet safety, और digital awareness सीखें।', color: '#f59e0b', gradient: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)', link: '/optional-content', topics: ['AI & IoT', 'Cloud Computing', 'Cyber Security', 'Digital Skills'] },
];

export default function NotesPage() {
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
                                <BookOpen size={8} style={{ color: '#3b82f6' }} />
                                <span className="text-[9px] uppercase tracking-[0.18em] font-semibold" style={{ color: '#3b82f6' }}>O-Level Notes</span>
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
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f97316)' }} />
            </header>

            {/* ── Hero Banner ── */}
            <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 30%, #6366f1 60%, #8b5cf6 100%)' }}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)', transform: 'translate(30%, -40%)' }} />
                <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', transform: 'translate(-20%, 30%)' }} />
                {/* Book pattern */}
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20h20v20H20zM0 0h20v20H0z\' fill=\'%23ffffff\' fill-opacity=\'1\'/%3E%3C/svg%3E")' }} />

                <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 md:py-14">
                    <div className="flex items-center gap-2 mb-3">
                        <BookOpen size={16} style={{ color: '#93c5fd' }} />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: '#93c5fd' }}>NIELIT O-Level</span>
                    </div>
                    <h2 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem', textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}>
                        IT Tools & Network Basics
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '36rem', marginBottom: '1.25rem' }}>
                        Complete chapter-wise notes for O-Level M1-R5 paper — सभी 9 chapters के detailed notes, Hindi + English में, free download करें।
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { label: '9 Chapters', icon: '📖' },
                            { label: 'Hindi + English', icon: '🇮🇳' },
                            { label: 'Free PDF Download', icon: '📥' },
                            { label: 'M1-R5 Syllabus', icon: '📋' },
                        ].map((s, i) => (
                            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                                <span>{s.icon}</span> {s.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Chapter Cards ── */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Section label */}
                <div className="flex items-center gap-3 mb-6 px-1">
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)' }} />
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold" style={{ color: '#6366f1' }}>All Chapters</span>
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)' }} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {CHAPTERS.map((ch) => (
                        <div key={ch.num} className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                            {/* Header stripe */}
                            <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${ch.color}, ${ch.color}88)` }} />

                            <div className="p-5">
                                {/* Chapter badge + icon */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full" style={{ background: `${ch.color}10`, color: ch.color, border: `1px solid ${ch.color}20` }}>
                                        Chapter {ch.num}
                                    </span>
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: ch.gradient }}>
                                        <span style={{ color: ch.color }}>{ch.icon}</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-base font-bold mb-2" style={{ color: '#0f172a' }}>{ch.title}</h3>

                                {/* Description */}
                                <p className="text-xs leading-relaxed mb-3" style={{ color: '#64748b' }}>{ch.desc}</p>

                                {/* Topic tags */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {ch.topics.map((topic, j) => (
                                        <span key={j} className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: '#f1f5f9', color: '#475569' }}>
                                            {topic}
                                        </span>
                                    ))}
                                </div>

                                {/* Download button */}
                                <a href={ch.link} target="_blank" rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-lg hover:scale-[1.02]"
                                    style={{ background: ch.color }}>
                                    <Download size={14} />
                                    Download PDF
                                    <ExternalLink size={12} style={{ opacity: 0.7 }} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Exam Info Card ── */}
                <div className="mt-8 rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen size={18} style={{ color: '#6366f1' }} />
                        <h3 className="text-base font-bold" style={{ color: '#0f172a' }}>M1-R5 Exam Pattern</h3>
                    </div>
                    <div className="grid sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Questions', value: '100', sub: 'MCQ Type' },
                            { label: 'Total Marks', value: '100', sub: '1 Mark Each' },
                            { label: 'Duration', value: '2 Hours', sub: '120 Minutes' },
                            { label: 'Passing Marks', value: '50%', sub: '50 out of 100' },
                        ].map((item, i) => (
                            <div key={i} className="rounded-xl p-4 text-center" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <p className="text-2xl font-extrabold" style={{ color: '#6366f1' }}>{item.value}</p>
                                <p className="text-xs font-bold mt-1" style={{ color: '#0f172a' }}>{item.label}</p>
                                <p className="text-[10px]" style={{ color: '#475569' }}>{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="text-center py-8">
                    <p className="text-sm font-semibold" style={{ color: '#475569' }}>📖 Notes updated for 2025 exam pattern</p>
                    <p className="text-xs mt-1" style={{ color: '#475569' }}>© 2025 Knobly Web | O-Level Study Material</p>
                </div>
            </main>
        </div>
    );
}
