'use client';

import Link from 'next/link';
import { ArrowLeft, Home, BookOpen, Copy, Check, LayoutDashboard, StickyNote, Code2, Brain, Keyboard, Sparkles } from 'lucide-react';
import { useState, ReactNode } from 'react';

const quickLinks = [
    { label: 'Home', href: '/', icon: <Home size={13} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={13} /> },
    { label: 'Notes', href: '/notes', icon: <StickyNote size={13} /> },
    { label: 'Python', href: '/python', icon: <Code2 size={13} /> },
    { label: 'MCQ', href: '/mcq', icon: <Brain size={13} /> },
    { label: 'Shortcuts', href: '/shortcuts', icon: <Keyboard size={13} /> },
];

interface ContentPageProps {
    title: string;
    breadcrumb: { label: string; href: string };
    children: ReactNode;
}

export default function ContentPage({ title, breadcrumb, children }: ContentPageProps) {
    return (
        <div className="wallpaper-default min-h-screen overflow-y-auto">
            {/* ── Premium Top Bar ── */}
            <header className="sticky top-0 z-20" style={{ background: 'rgba(10,10,18,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
                {/* Main row */}
                <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    {/* Left: Back + Title */}
                    <div className="flex items-center gap-3 min-w-0">
                        <Link href={breadcrumb.href} className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <ArrowLeft size={16} style={{ color: '#94a3b8' }} />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-sm font-bold truncate" style={{ color: '#f1f5f9' }}>{title}</h1>
                            <div className="flex items-center gap-1.5">
                                <Sparkles size={8} style={{ color: '#818cf8' }} />
                                <span className="text-[9px] uppercase tracking-[0.18em] font-semibold" style={{ color: '#818cf8' }}>{breadcrumb.label}</span>
                            </div>
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

            <main className="max-w-4xl mx-auto px-4 py-6">
                <article className="prose prose-invert prose-sm max-w-none">
                    {children}
                </article>
            </main>
        </div>
    );
}

export function CodeBlock({ code, lang = 'python' }: { code: string; lang?: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="relative glass-card rounded-xl overflow-hidden my-4">
            <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5">
                <span className="text-[9px] uppercase tracking-[0.18em] text-gray-500 font-bold">{lang}</span>
                <button onClick={handleCopy} className="text-gray-400 hover:text-white text-xs flex items-center gap-1">
                    {copied ? <><Check size={12} className="text-emerald-400" /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm text-gray-200"><code>{code}</code></pre>
        </div>
    );
}

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
    const id = slugify(title);
    return (
        <section className="glass-panel rounded-2xl p-5 md:p-6 mb-4">
            <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} className="text-cyan-400" />
                <h2 id={id} className="text-base md:text-lg font-bold text-white scroll-mt-24">{title}</h2>
            </div>
            <div className="text-sm text-gray-300 leading-relaxed space-y-3">{children}</div>
        </section>
    );
}

export function InfoBox({ type = 'note', children }: { type?: 'note' | 'tip' | 'warning'; children: ReactNode }) {
    const styles = {
        note: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
        tip: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
        warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
    };
    return <div className={`border rounded-xl p-3 text-xs ${styles[type]} my-3`}>{children}</div>;
}
