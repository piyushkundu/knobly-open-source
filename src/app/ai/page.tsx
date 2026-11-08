'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Home, Sparkles, ExternalLink, LayoutDashboard, StickyNote, Code2, Brain, Keyboard, PenTool, Zap, Palette, Cpu, Filter } from 'lucide-react';

const quickLinks = [
    { label: 'Home', href: '/', icon: <Home size={13} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={13} /> },
    { label: 'Notes', href: '/notes', icon: <StickyNote size={13} /> },
    { label: 'Python', href: '/python', icon: <Code2 size={13} /> },
    { label: 'MCQ', href: '/mcq', icon: <Brain size={13} /> },
    { label: 'Shortcuts', href: '/shortcuts', icon: <Keyboard size={13} /> },
];

const CATEGORIES = [
    { id: 'all', name: 'All Tools', icon: <Filter size={13} />, color: '#a78bfa' },
    { id: 'writing', name: 'Writing & Research', icon: <PenTool size={13} />, color: '#60a5fa' },
    { id: 'productivity', name: 'Productivity', icon: <Zap size={13} />, color: '#34d399' },
    { id: 'creative', name: 'Creative & Media', icon: <Palette size={13} />, color: '#f472b6' },
    { id: 'developer', name: 'Developer & ML', icon: <Cpu size={13} />, color: '#fb923c' },
];

const categoryColors: Record<string, { gradient: string; border: string; text: string; glow: string }> = {
    writing: { gradient: 'linear-gradient(135deg, #1e3a5f, #1e40af)', border: '#3b82f6', text: '#93c5fd', glow: 'rgba(59,130,246,0.1)' },
    productivity: { gradient: 'linear-gradient(135deg, #064e3b, #047857)', border: '#10b981', text: '#6ee7b7', glow: 'rgba(16,185,129,0.1)' },
    creative: { gradient: 'linear-gradient(135deg, #831843, #be185d)', border: '#ec4899', text: '#f9a8d4', glow: 'rgba(236,72,153,0.1)' },
    developer: { gradient: 'linear-gradient(135deg, #7c2d12, #c2410c)', border: '#f97316', text: '#fdba74', glow: 'rgba(249,115,22,0.1)' },
};

const TOOLS = [
    { name: 'Claude', description: 'A powerful conversational AI for sophisticated dialogue, content creation, and complex reasoning.', link: 'https://claude.ai/', category: 'writing' },
    { name: 'NotebookLM', description: "Google's research assistant that uses your own documents to answer questions.", link: 'https://notebooklm.google.com/', category: 'writing' },
    { name: 'Perplexity AI', description: 'An answer engine for research with straight answers from academic sources.', link: 'https://www.perplexity.ai/', category: 'writing' },
    { name: 'Grammarly', description: 'Your AI writing partner. Fixes grammar and style to make your essays impressive.', link: 'https://www.grammarly.com/', category: 'writing' },
    { name: 'QuillBot', description: 'Paraphrase text, summarize articles, and generate citations effortlessly.', link: 'https://quillbot.com/', category: 'writing' },
    { name: 'Grok', description: 'AI by xAI with real-time knowledge for up-to-the-minute research.', link: 'https://grok.x.ai/', category: 'writing' },
    { name: 'DeepAI', description: 'A versatile AI for writing essays, reports, and creative content.', link: 'https://deepai.org/', category: 'writing' },
    { name: 'TinyWow', description: 'Free AI writing tools for stories, essays, blogs with no sign-up.', link: 'https://tinywow.com/', category: 'writing' },
    { name: 'Summarize.tech', description: 'Creates summaries of any long YouTube video — lectures, events, meetings.', link: 'https://www.summarize.tech/', category: 'writing' },
    { name: 'Otter.ai', description: 'Transcribes lectures and meetings in real time. Never miss a detail.', link: 'https://otter.ai/', category: 'productivity' },
    { name: 'Notion AI', description: 'All-in-one workspace. Organize notes, manage projects, AI summaries.', link: 'https://www.notion.so/product/ai', category: 'productivity' },
    { name: 'NoteGPT', description: 'Summarize YouTube videos, PDFs, articles. Create mind maps and notes.', link: 'https://notegpt.io/', category: 'productivity' },
    { name: 'SmartDraw', description: 'Create professional flowcharts, diagrams, and mind maps with ease.', link: 'https://app.smartdraw.com/', category: 'productivity' },
    { name: 'MyMap.ai', description: 'AI that generates flowcharts and mind maps from text prompts.', link: 'https://www.mymap.ai/', category: 'productivity' },
    { name: 'JungleAI', description: 'Generate flashcards from lecture notes to accelerate learning.', link: 'https://app.jungleai.com/', category: 'productivity' },
    { name: 'Gamma', description: 'Create beautiful presentations, documents, and webpages from text.', link: 'https://gamma.app/', category: 'creative' },
    { name: 'Tome', description: 'AI-powered storytelling and presentation tool for compelling narratives.', link: 'https://tome.app/', category: 'creative' },
    { name: 'Magic Studio', description: 'Create stunning art and images from text prompts.', link: 'https://magicstudio.com/ai-art-generator/', category: 'creative' },
    { name: 'AutoDraw', description: 'Smart drawing tool — doodle and AI perfects your drawing.', link: 'https://www.autodraw.com/', category: 'creative' },
    { name: 'Luma Labs', description: 'Generate realistic 3D models from text descriptions or images.', link: 'https://lumalabs.ai/', category: 'creative' },
    { name: 'Mubert', description: 'Generate royalty-free background music for video projects.', link: 'https://mubert.com/', category: 'creative' },
    { name: 'Descript', description: 'All-in-one audio/video editor with AI voice cloner.', link: 'https://www.descript.com/', category: 'creative' },
    { name: 'Supermeme.ai', description: 'Generate original memes from text prompts instantly.', link: 'https://supermeme.ai/', category: 'creative' },
    { name: 'Kaiber', description: 'Transform images and text into stunning dynamic videos.', link: 'https://kaiber.ai/', category: 'creative' },
    { name: 'Ready Player Me', description: 'Create personalized 3D avatars from a single real image.', link: 'https://readyplayer.me/', category: 'creative' },
    { name: 'Google AI Studio', description: 'Prototype and build with the latest Gemini models from Google.', link: 'https://aistudio.google.com/', category: 'developer' },
    { name: 'WolframAlpha', description: 'Computational powerhouse for STEM — solves complex equations.', link: 'https://www.wolframalpha.com/', category: 'developer' },
    { name: 'Socratic', description: 'Homework helper from Google — snap a photo, get explanations.', link: 'https://socratic.org/', category: 'developer' },
    { name: 'Teachable Machine', description: 'Create ML models for your projects with no coding required.', link: 'https://teachablemachine.withgoogle.com/', category: 'developer' },
    { name: 'ML for Kids', description: 'Simple guided environment for learning machine learning.', link: 'https://machinelearningforkids.co.uk/', category: 'developer' },
    { name: 'PimEyes', description: 'Advanced face search engine using reverse image search.', link: 'https://pimeyes.com/en', category: 'developer' },
];

export default function AIPage() {
    const [activeFilter, setActiveFilter] = useState('all');
    const filtered = activeFilter === 'all' ? TOOLS : TOOLS.filter(t => t.category === activeFilter);

    return (
        <div className="wallpaper-default min-h-screen overflow-y-auto">
            {/* ── Premium Top Bar ── */}
            <header className="sticky top-0 z-20" style={{ background: 'rgba(10,10,18,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
                <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link href="/" className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <ArrowLeft size={16} style={{ color: '#94a3b8' }} />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-sm font-bold truncate" style={{ color: '#f1f5f9' }}>AI Tools Hub</h1>
                            <div className="flex items-center gap-1.5">
                                <Sparkles size={8} style={{ color: '#a78bfa' }} />
                                <span className="text-[9px] uppercase tracking-[0.18em] font-semibold" style={{ color: '#a78bfa' }}>Student Toolkit</span>
                            </div>
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
                <div className="h-[1px]" style={{ background: 'linear-gradient(90deg, transparent 0%, #818cf8 20%, #a855f7 50%, #ec4899 80%, transparent 100%)' }} />
            </header>

            {/* ── Hero Banner ── */}
            <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 20%, #2d1b69 45%, #6b21a8 70%, #ec4899 100%)' }}>
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)', transform: 'translate(30%, -40%)' }} />
                <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', transform: 'translate(-20%, 30%)' }} />
                <div className="absolute top-1/3 right-1/3 w-40 h-40 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }} />

                <div className="relative z-10 max-w-6xl mx-auto px-4 py-14 md:py-20 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles size={16} style={{ color: '#e9d5ff' }} />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: '#e9d5ff' }}>Curated Collection</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3" style={{ color: '#ffffff' }}>
                        Unlock Your Potential with AI
                    </h2>
                    <p className="text-base md:text-lg max-w-2xl mx-auto mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        A comprehensive guide to {TOOLS.length} AI tools organized by category for every student need.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { label: `${TOOLS.length} Tools`, color: '#c4b5fd' },
                            { label: '4 Categories', color: '#86efac' },
                            { label: 'Free to Explore', color: '#fde68a' },
                        ].map((s, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: s.color }}>{s.label}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Filter Bar ── */}
            <div className="max-w-6xl mx-auto px-4 -mt-5 relative z-10">
                <div className="rounded-2xl p-3 flex flex-wrap justify-center gap-2" style={{ background: 'rgba(15,15,25,0.9)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
                    {CATEGORIES.map(cat => {
                        const isActive = activeFilter === cat.id;
                        return (
                            <button key={cat.id} onClick={() => setActiveFilter(cat.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                                style={{
                                    background: isActive ? `linear-gradient(135deg, ${cat.color}40, ${cat.color}20)` : 'rgba(255,255,255,0.03)',
                                    border: isActive ? `1px solid ${cat.color}60` : '1px solid rgba(255,255,255,0.06)',
                                    color: isActive ? cat.color : '#94a3b8',
                                    boxShadow: isActive ? `0 0 15px ${cat.color}20` : 'none',
                                }}>
                                {cat.icon}
                                {cat.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Tools Grid ── */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(tool => {
                        const colors = categoryColors[tool.category];
                        return (
                            <div key={tool.name} className="group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                                style={{ background: colors.gradient, border: `1px solid ${colors.border}30`, boxShadow: `0 4px 20px ${colors.glow}` }}>
                                <div className="p-5 flex flex-col h-full">
                                    {/* Category tag */}
                                    <span className="self-start text-[9px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        {tool.category}
                                    </span>

                                    <h3 className="text-base font-bold mb-2" style={{ color: '#ffffff' }}>{tool.name}</h3>
                                    <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>{tool.description}</p>

                                    <a href={tool.link} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff' }}>
                                        <span>Visit {tool.name}</span>
                                        <ExternalLink size={12} />
                                    </a>

                                    {/* Hover progress bar */}
                                    <div className="mt-3 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                        <div className="h-full w-0 group-hover:w-full transition-all duration-500 rounded-full" style={{ background: `linear-gradient(90deg, ${colors.border}, transparent)` }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center py-4">
                    <p className="text-xs" style={{ color: '#94a3b8' }}>🤖 More AI tools being discovered — stay tuned!</p>
                </div>
            </main>
        </div>
    );
}
