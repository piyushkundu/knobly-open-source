'use client';

import Link from 'next/link';
import { ArrowLeft, Home, Paintbrush, Code2, LayoutGrid, ChevronRight, Sparkles, LayoutDashboard, StickyNote, Brain, Keyboard, Globe } from 'lucide-react';

const quickLinks = [
    { label: 'Home', href: '/', icon: <Home size={13} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={13} /> },
    { label: 'Notes', href: '/notes', icon: <StickyNote size={13} /> },
    { label: 'Python', href: '/python', icon: <Code2 size={13} /> },
    { label: 'MCQ', href: '/mcq', icon: <Brain size={13} /> },
    { label: 'Shortcuts', href: '/shortcuts', icon: <Keyboard size={13} /> },
];

const webTopics = [
    {
        title: 'CSS',
        href: '/web-design/css',
        icon: <Paintbrush size={22} style={{ color: '#60a5fa' }} />,
        gradient: 'linear-gradient(135deg, #1e3a5f, #1e40af, #2563eb)',
        border: '#3b82f6',
        glow: 'rgba(59,130,246,0.15)',
        desc: 'Selectors, properties, box model, flexbox, grid, and responsive design',
        chapter: 1,
    },
    {
        title: 'JavaScript',
        href: '/web-design/javascript',
        icon: <Code2 size={22} style={{ color: '#facc15' }} />,
        gradient: 'linear-gradient(135deg, #854d0e, #a16207, #ca8a04)',
        border: '#eab308',
        glow: 'rgba(234,179,8,0.15)',
        desc: 'Variables, functions, DOM, events, and ES6+ features',
        chapter: 2,
    },
    {
        title: 'W3.CSS',
        href: '/web-design/w3css',
        icon: <LayoutGrid size={22} style={{ color: '#6ee7b7' }} />,
        gradient: 'linear-gradient(135deg, #064e3b, #047857, #059669)',
        border: '#10b981',
        glow: 'rgba(16,185,129,0.15)',
        desc: 'W3.CSS framework basics, responsive classes, and components',
        chapter: 3,
    },
];

export default function WebDesignPage() {
    return (
        <div className="wallpaper-default min-h-screen overflow-y-auto">
            {/* ── Premium Top Bar ── */}
            <header className="sticky top-0 z-20" style={{ background: 'rgba(10,10,18,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
                <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link href="/" className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <ArrowLeft size={16} style={{ color: '#94a3b8' }} />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-lg font-bold truncate" style={{ color: '#f1f5f9', fontFamily: 'var(--font-gaming)' }}>WEB DESIGN</h1>
                        </div>
                    </div>
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
                        <Link href="/" className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <Home size={16} style={{ color: '#94a3b8' }} />
                        </Link>
                    </div>
                </div>
                <div className="h-[1px]" style={{ background: 'linear-gradient(90deg, transparent 0%, #3b82f6 20%, #eab308 50%, #10b981 80%, transparent 100%)' }} />
            </header>

            <main className="max-w-5xl mx-auto px-4 py-6">

                {/* ── Hero Banner ── */}
                <div className="relative overflow-hidden rounded-3xl mb-8" style={{ background: 'linear-gradient(135deg, #0c1929 0%, #1a1a40 25%, #264653 50%, #2a9d8f 75%, #e9c46a 100%)' }}>
                    <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #e9c46a 0%, transparent 70%)', transform: 'translate(30%, -40%)' }} />
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #2a9d8f 0%, transparent 70%)', transform: 'translate(-20%, 30%)' }} />
                    <div className="absolute top-1/3 left-1/3 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />

                    <div className="relative z-10 p-8 md:p-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Globe size={16} style={{ color: '#93c5fd' }} />
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: '#93c5fd' }}>Complete Course</span>
                        </div>
                        <h2 id="web-design" className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: '#ffffff' }}>
                            Web Design
                        </h2>
                        <p className="text-base md:text-lg leading-relaxed max-w-xl mb-6" style={{ color: '#e2e8f0' }}>
                            Master the art of building beautiful websites — from CSS styling to JavaScript interactivity and modern frameworks.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { icon: <Paintbrush size={14} />, label: '3 Chapters', color: '#93c5fd' },
                                { icon: <Sparkles size={14} />, label: 'Beginner Friendly', color: '#86efac' },
                                { icon: <Code2 size={14} />, label: 'Hands-on Practice', color: '#fde68a' },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span style={{ color: stat.color }}>{stat.icon}</span>
                                    <span className="text-xs font-medium" style={{ color: stat.color }}>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Chapter label ── */}
                <div className="flex items-center gap-3 mb-4 px-1">
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)' }} />
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold" style={{ color: '#60a5fa' }}>Chapters</span>
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)' }} />
                </div>

                {/* ── Topic Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {webTopics.map((topic) => (
                        <Link key={topic.href} href={topic.href}
                            className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            style={{ background: topic.gradient, border: `1px solid ${topic.border}30`, boxShadow: `0 4px 20px ${topic.glow}` }}>
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        Ch. {topic.chapter}
                                    </span>
                                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" style={{ color: 'rgba(255,255,255,0.3)' }} />
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        {topic.icon}
                                    </div>
                                    <h3 id="topictitle" className="text-base font-bold" style={{ color: '#ffffff' }}>{topic.title}</h3>
                                </div>
                                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{topic.desc}</p>
                                <div className="mt-4 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                    <div className="h-full w-0 group-hover:w-full transition-all duration-500 rounded-full" style={{ background: `linear-gradient(90deg, ${topic.border}, transparent)` }} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center py-4">
                    <p className="text-xs" style={{ color: '#94a3b8' }}>🎨 More web technologies coming soon!</p>
                </div>
            </main>
        </div>
    );
}
