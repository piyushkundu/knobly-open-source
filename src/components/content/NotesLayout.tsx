'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Home, LayoutDashboard, StickyNote, Code2, Brain, Keyboard, Sparkles } from 'lucide-react';

interface ContentLink {
    title: string;
    href: string;
    icon: string;
    color: string;
    desc: string;
}

interface NotesLayoutProps {
    title: string;
    subtitle: string;
    links: ContentLink[];
    accentColor?: string;
}

const quickLinks = [
    { label: 'Home', href: '/', icon: <Home size={13} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={13} /> },
    { label: 'Notes', href: '/notes', icon: <StickyNote size={13} /> },
    { label: 'Python', href: '/python', icon: <Code2 size={13} /> },
    { label: 'MCQ', href: '/mcq', icon: <Brain size={13} /> },
    { label: 'Shortcuts', href: '/shortcuts', icon: <Keyboard size={13} /> },
];

export default function NotesLayout({ title, subtitle, links, accentColor = 'cyan' }: NotesLayoutProps) {
    return (
        <div className="wallpaper-default min-h-screen overflow-y-auto">
            {/* ── Premium Top Bar ── */}
            <header className="sticky top-0 z-20" style={{ background: 'rgba(10,10,18,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
                <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    {/* Left: Back + Title */}
                    <div className="flex items-center gap-3 min-w-0">
                        <Link href="/" className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <ArrowLeft size={16} style={{ color: '#94a3b8' }} />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-lg font-bold truncate" style={{ color: '#f1f5f9', fontFamily: 'var(--font-gaming)' }}>{title}</h1>
                        </div>
                    </div>

                    {/* Right: Quick Links */}
                    <div className="flex items-center gap-1">
                        {quickLinks.map((link) => (
                            <Link key={link.href} href={link.href}
                                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:scale-105"
                                style={{ color: '#94a3b8', background: 'transparent' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#e2e8f0'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}>
                                {link.icon}
                                <span>{link.label}</span>
                            </Link>
                        ))}
                        {/* Mobile: Home only */}
                        <Link href="/" className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <Home size={16} style={{ color: '#94a3b8' }} />
                        </Link>
                    </div>
                </div>

                {/* Gradient accent line */}
                <div className="h-[1px]" style={{ background: 'linear-gradient(90deg, transparent 0%, #6366f1 20%, #a855f7 50%, #ec4899 80%, transparent 100%)' }} />
            </header>

            <main className="max-w-5xl mx-auto px-4 py-6">
                <div className="glass-panel rounded-3xl p-6 md:p-8 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen size={20} className={`text-${accentColor}-400`} />
                        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
                    </div>
                    <p className="text-sm text-gray-400">{subtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {links.map((link) => (
                        <Link key={link.href} href={link.href}
                            className="glass-card rounded-2xl p-5 group active-press block">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-${link.color}/10 border border-${link.color}/20 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                                    <i className={`${link.icon} text-lg text-${link.color}`} />
                                </div>
                                <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                                    {link.title}
                                </h3>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2">{link.desc}</p>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
