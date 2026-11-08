'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Home, BookOpen, Code2, FileCode, Play, Sparkles,
    ChevronRight, GraduationCap, Zap, LayoutDashboard, StickyNote, Brain,
    Keyboard, Lock, CheckCircle2, Trophy, Target, Lightbulb, Compass, Clock,
    Users, Star, TrendingUp, Award, Globe, Layers, PenTool, Monitor,
    FileText, Terminal, Braces, Hash
} from 'lucide-react';

const quickLinks = [
    { label: 'Home', href: '/', icon: <Home size={14} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={14} /> },
    { label: 'Notes', href: '/notes', icon: <StickyNote size={14} /> },
    { label: 'HTML', href: '/html', icon: <Code2 size={14} /> },
    { label: 'Compiler', href: '/html/compiler', icon: <Terminal size={14} /> },
    { label: 'MCQ', href: '/mcq', icon: <Brain size={14} /> },
    { label: 'Shortcuts', href: '/shortcuts', icon: <Keyboard size={14} /> },
];

const TOPIC_TEXT_COLORS: Record<string, string> = { '#10b981': '#047857', '#3b82f6': '#1d4ed8', '#8b5cf6': '#6d28d9' };

const htmlTopics = [
    {
        title: 'HTML Intro',
        badge: 'Completed',
        href: '/html/intro',
        icon: <BookOpen size={24} />,
        color: '#10b981',
        bgColor: '#ecfdf5',
        borderColor: '#34d399',
        desc: 'Introduction to HTML, structure, <!DOCTYPE>, basic syntax, head, body, headings & text formatting.',
        duration: '1.5 Hours',
        lessons: '11 Topics',
        locked: false,
        completed: true,
        current: false,
    },
    {
        title: 'Element and Tag',
        badge: 'All Tags Library',
        href: '/html/elements',
        icon: <Code2 size={24} />,
        color: '#3b82f6',
        bgColor: '#eff6ff',
        borderColor: '#60a5fa',
        desc: 'Complete reference for every tag: headings, lists, tables, media, links, forms, and semantic HTML5.',
        duration: '4 Hours',
        lessons: '23 Chapters',
        locked: false,
        completed: false,
        current: true,
    },
    {
        title: 'Practice Task',
        badge: '15 Real Tasks',
        href: '/html/tasks',
        icon: <FileCode size={24} />,
        color: '#10b981',
        bgColor: '#ecfdf5',
        borderColor: '#34d399',
        desc: '15 hands-on practice tasks from profile page to full websites with built-in runner and live preview.',
        duration: '5 Hours',
        lessons: '15 Tasks',
        locked: false,
        completed: false,
        current: false,
    },
    {
        title: 'Handwritten Notes',
        badge: 'Coming Soon',
        href: '/html/notes',
        icon: <FileText size={24} />,
        color: '#8b5cf6',
        bgColor: '#f5f3ff',
        borderColor: '#a78bfa',
        desc: 'Handwritten visual study notes for O-Level M2-R5 Web Design — exam preparation & revision. Coming soon!',
        duration: 'Coming Soon',
        lessons: 'In Preparation',
        locked: false,
        completed: false,
        current: false,
    },
];

const features = [
    {
        icon: <Lightbulb size={28} />,
        title: 'Interactive Examples',
        desc: 'Every tag explained with live code examples and instant preview in the built-in compiler',
        color: 'from-orange-400 to-red-500',
        bgColor: 'bg-orange-50'
    },
    {
        icon: <Users size={28} />,
        title: 'O-Level Aligned',
        desc: 'Content designed specifically for NIELIT O-Level M2-R5 Web Design syllabus',
        color: 'from-blue-400 to-indigo-500',
        bgColor: 'bg-blue-50'
    },
    {
        icon: <Award size={28} />,
        title: 'Practice & Master',
        desc: '15 hands-on tasks with increasing complexity to build real web pages from scratch',
        color: 'from-purple-400 to-pink-500',
        bgColor: 'bg-purple-50'
    },
];

export default function HtmlPage() {
    const [openedTasksCount, setOpenedTasksCount] = useState<number>(0);

    useEffect(() => {
        const updateTaskProgress = () => {
            try {
                const raw = localStorage.getItem('knobly_opened_html_tasks');
                const openedList: string[] = raw ? JSON.parse(raw) : [];
                const unlockedRaw = localStorage.getItem('knobly_unlocked_html_tasks');
                const unlockedList: string[] = unlockedRaw ? JSON.parse(unlockedRaw) : [];
                const combined = Array.from(new Set([...openedList, ...unlockedList]));
                setOpenedTasksCount(combined.length);
            } catch (e) {
                console.error(e);
            }
        };

        updateTaskProgress();
        window.addEventListener('focus', updateTaskProgress);
        window.addEventListener('storage', updateTaskProgress);
        return () => {
            window.removeEventListener('focus', updateTaskProgress);
            window.removeEventListener('storage', updateTaskProgress);
        };
    }, []);

    const taskPercentage = Math.min(100, Math.round((openedTasksCount / 15) * 100));

    return (
        <div className="min-h-screen bg-white text-slate-800 relative overflow-x-hidden">
            {/* Animated Web Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-red-50/30" />

                {/* Animated Code Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="html-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                                <text x="10" y="30" fontSize="14" fill="#f97316" fontFamily="monospace">&lt;/&gt;</text>
                                <text x="60" y="70" fontSize="12" fill="#ef4444" fontFamily="monospace">&lt;h1&gt;</text>
                                <text x="20" y="100" fontSize="10" fill="#3b82f6" fontFamily="monospace">&lt;div&gt;</text>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#html-pattern)" />
                    </svg>
                </div>

                {/* Animated Wave Path - Top */}
                <svg className="absolute top-20 left-0 w-full h-32 opacity-20" viewBox="0 0 1200 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="htmlGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="50%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M-50,50 Q100,20 250,50 T550,50 T850,50 T1150,50 T1450,50"
                        fill="none"
                        stroke="url(#htmlGradient1)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="15,10,5,10"
                    >
                        <animate attributeName="stroke-dashoffset" from="0" to="40" dur="3s" repeatCount="indefinite" />
                    </path>
                </svg>

                {/* Animated Wave Path - Bottom */}
                <svg className="absolute bottom-40 left-0 w-full h-32 opacity-15" viewBox="0 0 1200 100" preserveAspectRatio="none">
                    <path
                        d="M-50,50 Q150,80 300,50 T600,50 T900,50 T1200,50 T1500,50"
                        fill="none"
                        stroke="url(#htmlGradient1)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="10,8,4,8"
                    >
                        <animate attributeName="stroke-dashoffset" from="40" to="0" dur="4s" repeatCount="indefinite" />
                    </path>
                </svg>

                {/* Floating HTML5 Logo */}
                <div className="absolute top-32 right-20 w-40 h-40 opacity-[0.08] animate-float-slow">
                    <svg viewBox="0 0 512 512" className="w-full h-full">
                        <path fill="#E34F26" d="M71,460 L30,0 l452,0 L441,460 255,512" />
                        <path fill="#EF652A" d="M256,472 L405,431 441,37 256,37" />
                        <path fill="#EBEBEB" d="M256,208 L181,208 l-5,-58 80,0 0,-58 -142,0 15,171 127,0 z M256,355 l-1,0 -62,-17 -4,-45 -58,0 7,89 117,32 1,0 z" />
                        <path fill="#FFF" d="M256,208 l0,58 75,0 -8,78 -67,19 0,60 117,-32 2,-23 13,-148 z M256,93 l0,58 137,0 5,-58 z" />
                    </svg>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-40 left-10 w-20 h-20 opacity-[0.06] animate-float">
                    <Hash className="w-full h-full text-orange-700" />
                </div>
                <div className="absolute bottom-60 right-10 w-16 h-16 opacity-[0.05] animate-float-delayed">
                    <Terminal className="w-full h-full text-red-700" />
                </div>
            </div>

            {/* ── Modern Navigation Bar ── */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-orange-100/80 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-700 to-red-700 text-white shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <ArrowLeft size={18} />
                            </Link>
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 flex items-center justify-center drop-shadow-sm hover:scale-105 transition-transform">
                                    <svg viewBox="0 0 512 512" className="w-full h-full">
                                        <path fill="#E34F26" d="M71,460 L30,0 l452,0 L441,460 255,512" />
                                        <path fill="#EF652A" d="M256,472 L405,431 441,37 256,37" />
                                        <path fill="#EBEBEB" d="M256,208 L181,208 l-5,-58 80,0 0,-58 -142,0 15,171 127,0 z M256,355 l-1,0 -62,-17 -4,-45 -58,0 7,89 117,32 1,0 z" />
                                        <path fill="#FFF" d="M256,208 l0,58 75,0 -8,78 -67,19 0,60 117,-32 2,-23 13,-148 z M256,93 l0,58 137,0 5,-58 z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                        HTML
                                    </h1>
                                    <p className="text-[10px] text-gray-600 -mt-0.5">Web Design</p>
                                </div>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-1">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-orange-700 hover:bg-orange-50/80 transition-all duration-200"
                                >
                                    {link.icon}
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                href="/html/compiler"
                                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-700 to-red-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Terminal size={13} />
                                <span>Web Compiler</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                            </Link>
                            <Link href="/" className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-700 transition-colors">
                                <Home size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Hero Section ── */}
                <div className="relative overflow-hidden rounded-[2rem] bg-white border border-orange-100 shadow-2xl shadow-orange-100/50 mb-12">
                    {/* Background Decorations */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-100/40 to-red-100/40 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-100/30 to-amber-100/30 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />

                    {/* Animated 3D HTML Code Ribbon Hero */}
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-10 hidden xl:block pointer-events-none">
                        <div className="relative w-80 h-80">
                            <svg viewBox="0 0 240 240" className="w-full h-full animate-html-hero">
                                <defs>
                                    <linearGradient id="heroBracketLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#f97316" />
                                        <stop offset="50%" stopColor="#ef4444" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                    <linearGradient id="heroSlash" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ec4899" />
                                        <stop offset="50%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                    <linearGradient id="heroBracketRight" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="50%" stopColor="#06b6d4" />
                                        <stop offset="100%" stopColor="#10b981" />
                                    </linearGradient>
                                    <filter id="heroGlow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#f97316" floodOpacity="0.25" />
                                    </filter>
                                </defs>

                                {/* Ambient Glow Circle */}
                                <circle cx="120" cy="120" r="85" fill="none" stroke="url(#heroBracketLeft)" strokeWidth="1" strokeDasharray="6,6" opacity="0.3">
                                    <animateTransform attributeName="transform" type="rotate" from="0 120 120" to="360 120 120" dur="25s" repeatCount="indefinite" />
                                </circle>

                                {/* Left Bracket '<' */}
                                <path
                                    d="M75 55 L35 120 L75 185"
                                    fill="none"
                                    stroke="url(#heroBracketLeft)"
                                    strokeWidth="18"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    filter="url(#heroGlow)"
                                />
                                <circle cx="35" cy="120" r="5" fill="white" />
                                <circle cx="75" cy="55" r="4" fill="white" opacity="0.9" />

                                {/* Slash '/' */}
                                <path
                                    d="M135 45 L105 195"
                                    fill="none"
                                    stroke="url(#heroSlash)"
                                    strokeWidth="16"
                                    strokeLinecap="round"
                                    filter="url(#heroGlow)"
                                />
                                <circle cx="120" cy="120" r="5" fill="white" />

                                {/* Right Bracket '>' */}
                                <path
                                    d="M165 55 L205 120 L165 185"
                                    fill="none"
                                    stroke="url(#heroBracketRight)"
                                    strokeWidth="18"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    filter="url(#heroGlow)"
                                />
                                <circle cx="205" cy="120" r="5" fill="white" />
                                <circle cx="165" cy="185" r="4" fill="white" opacity="0.9" />
                            </svg>
                        </div>
                    </div>

                    <div className="relative z-10 p-8 md:p-12 lg:pr-72">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider border border-orange-200">
                                <Sparkles size={12} />
                                Complete Course
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
                                <TrendingUp size={12} />
                                Beginner Friendly
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 leading-[1.1] tracking-tight">
                            Learn <span className="relative">
                                <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">HTML</span>
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none">
                                    <path d="M0,5 Q50,0 100,5 T200,5" stroke="#f97316" strokeWidth="3" fill="none" opacity="0.3" />
                                </svg>
                            </span>
                            <br />
                            <span className="text-3xl md:text-4xl font-bold text-gray-600">Web Development</span>
                        </h2>

                        <p className="text-lg text-gray-600 max-w-2xl mb-8 leading-relaxed">
                            Master the foundation of every website! From basic tags to semantic HTML5, forms, tables, and multimedia — build real web pages with interactive examples and hands-on practice.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link href="/html/elements" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300">
                                <Play size={18} fill="currentColor" />
                                Start: Element & Tag
                            </Link>
                            <Link href="#chapters" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-gray-700 font-bold border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300">
                                <Compass size={18} />
                                Explore Modules
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Learning Path Timeline ── */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-700 to-red-700 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Your Learning Path</h3>
                                <p className="text-sm text-gray-500">Follow the trail to master HTML</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-700" />
                                <span className="text-gray-600 font-medium">Completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-200 animate-pulse" />
                                <span className="text-gray-600 font-medium">Start Here</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-300" />
                                <span className="text-gray-600 font-medium">Next Modules</span>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Timeline for Desktop */}
                    <div className="hidden lg:block relative max-w-4xl mx-auto">
                        <div className="absolute top-8 left-8 right-8 h-1 bg-gradient-to-r from-emerald-400 via-blue-400 via-teal-400 to-purple-400 rounded-full" />
                        <div className="relative grid grid-cols-4 gap-6">
                            {htmlTopics.map((topic) => {
                                const isPracticeTask = topic.href === '/html/tasks';
                                const isTaskStarted = isPracticeTask && openedTasksCount > 0;
                                const isTaskDone = isPracticeTask && openedTasksCount >= 15;
                                const isTopicCompleted = topic.completed || isTaskDone;

                                return (
                                    <Link
                                        key={topic.href}
                                        href={topic.locked ? '#' : topic.href}
                                        className={`group flex flex-col items-center transition-transform hover:-translate-y-1 ${topic.locked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 ${
                                            isTopicCompleted
                                                ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-200'
                                                : isTaskStarted
                                                    ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-400 font-black text-xs shadow-md shadow-emerald-100 flex items-center justify-center'
                                                    : topic.current
                                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-200 animate-pulse'
                                                        : 'bg-white text-slate-700 border-2 border-slate-200 group-hover:border-blue-400 shadow-sm'
                                        }`} style={!isTopicCompleted && !topic.current && !isTaskStarted ? { color: topic.color } : {}}>
                                            {isTopicCompleted ? (
                                                <CheckCircle2 size={26} />
                                            ) : isTaskStarted ? (
                                                <span className="font-extrabold text-xs">{taskPercentage}%</span>
                                            ) : topic.locked ? (
                                                <Lock size={22} />
                                            ) : (
                                                topic.icon
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-center text-gray-800 group-hover:text-blue-600 transition-colors px-1">{topic.title}</span>
                                        <span className="text-[11px] font-medium text-slate-500 mt-0.5">
                                            {isTaskStarted ? `${openedTasksCount}/15 Tasks (${taskPercentage}%)` : topic.badge}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Vertical Timeline for Mobile */}
                    <div className="lg:hidden relative space-y-4">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-300 via-blue-300 to-purple-300" />
                        {htmlTopics.map((topic) => {
                            const isPracticeTask = topic.href === '/html/tasks';
                            const isTaskStarted = isPracticeTask && openedTasksCount > 0;
                            const isTaskDone = isPracticeTask && openedTasksCount >= 15;
                            const isTopicCompleted = topic.completed || isTaskDone;

                            return (
                                <Link
                                    key={topic.href}
                                    href={topic.locked ? '#' : topic.href}
                                    className="relative flex items-center gap-4 pl-4 group"
                                >
                                    <div className={`relative z-10 w-5 h-5 rounded-full border-4 border-white shadow-md ${
                                        isTopicCompleted
                                            ? 'bg-emerald-700'
                                            : isTaskStarted
                                                ? 'bg-emerald-700 ring-2 ring-emerald-200'
                                                : topic.current
                                                    ? 'bg-blue-500 animate-pulse ring-2 ring-blue-200'
                                                    : 'bg-slate-300'
                                    }`} />
                                    <div className={`flex-1 p-4 rounded-xl border transition-all ${
                                        isTopicCompleted
                                            ? 'bg-emerald-50/60 border-emerald-200 group-hover:bg-emerald-100/70'
                                            : isTaskStarted
                                                ? 'bg-emerald-50/50 border-emerald-200'
                                                : topic.current
                                                    ? 'bg-blue-50/50 border-blue-200 ring-2 ring-blue-200'
                                                    : 'bg-white border-slate-200 shadow-sm'
                                    }`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                                    {isTaskStarted ? `${openedTasksCount}/15 Tasks (${taskPercentage}%)` : topic.badge}
                                                </span>
                                                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">{topic.title}</h4>
                                            </div>
                                            {isTopicCompleted && <CheckCircle2 size={20} className="text-emerald-500" />}
                                            {isTaskStarted && !isTaskDone && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">{taskPercentage}%</span>}
                                            {topic.current && !isTaskStarted && <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">Start Here</span>}
                                            {topic.locked && <Lock size={20} className="text-gray-600" />}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* ── 4 Main Learning Cards Grid ── */}
                <div id="chapters" className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-700 to-red-700 flex items-center justify-center text-white shadow-md shadow-orange-200">
                                <BookOpen size={20} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">HTML Modules</h3>
                                <p className="text-xs text-gray-500">Everything you need to master HTML — from basics to handwritten notes</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {htmlTopics.map((topic) => {
                            const isPracticeTask = topic.href === '/html/tasks';
                            const isTaskStarted = isPracticeTask && openedTasksCount > 0;
                            const isTaskDone = isPracticeTask && openedTasksCount >= 15;
                            const isTopicCompleted = topic.completed || isTaskDone;

                            // Determine status badge
                            let statusBadge = null;
                            if (isTopicCompleted) {
                                statusBadge = (
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                                        <CheckCircle2 size={11} className="text-emerald-700" />
                                        Completed
                                    </span>
                                );
                            } else if (isPracticeTask && isTaskStarted) {
                                statusBadge = (
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 animate-pulse">
                                        {openedTasksCount}/15 Tasks ({taskPercentage}%)
                                    </span>
                                );
                            } else if (topic.current) {
                                statusBadge = (
                                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold animate-pulse shadow-sm shadow-blue-200">
                                        Start Here
                                    </span>
                                );
                            } else if (topic.locked) {
                                statusBadge = <Lock size={16} className="text-gray-600" />;
                            }

                            // Dynamic progress percent & labels
                            const progressPercent = isTopicCompleted ? 100 : isPracticeTask ? taskPercentage : topic.current ? 20 : 0;
                            const progressLabel = isTopicCompleted ? 'Completed' : isPracticeTask ? (isTaskStarted ? 'In Progress' : 'Start Tasks') : topic.current ? 'Start Learning' : 'Start Now';
                            const progressRightText = isTopicCompleted ? '100%' : isPracticeTask ? `${taskPercentage}%` : topic.current ? 'Ready' : '0%';

                            // Dynamic Card Border & Highlight
                            const borderClass = isTopicCompleted
                                ? 'border-emerald-200 group-hover:border-emerald-400'
                                : topic.current
                                    ? 'border-blue-400 ring-4 ring-blue-100 shadow-lg shadow-blue-50'
                                    : isTaskStarted
                                        ? 'border-emerald-300 ring-4 ring-emerald-50 shadow-md shadow-emerald-50'
                                        : 'border-slate-100 group-hover:border-orange-200';

                            const bgTintClass = isTopicCompleted
                                ? 'bg-emerald-50/20'
                                : topic.current
                                    ? 'bg-blue-50/40'
                                    : isTaskStarted
                                        ? 'bg-emerald-50/30'
                                        : '';

                            const progressBarGradient = isTopicCompleted || isPracticeTask
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                : topic.current
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                                    : 'bg-gray-200';

                            const textColorClass = isTopicCompleted
                                ? 'text-emerald-700'
                                : topic.current
                                    ? 'text-blue-600'
                                    : isTaskStarted
                                        ? 'text-emerald-700'
                                        : 'text-gray-500';

                            const hoverTitleClass = isTopicCompleted
                                ? 'group-hover:text-emerald-700'
                                : topic.current
                                    ? 'group-hover:text-blue-600'
                                    : isPracticeTask
                                        ? 'group-hover:text-emerald-700'
                                        : 'group-hover:text-purple-600';

                            return (
                                <Link
                                    key={topic.href}
                                    href={topic.locked ? '#' : topic.href}
                                    className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1.5 flex flex-col justify-between ${
                                        topic.locked ? 'cursor-not-allowed' : 'cursor-pointer'
                                    }`}
                                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                                >
                                    {/* Card Background */}
                                    <div className="absolute inset-0 bg-white" />
                                    <div className={`absolute inset-0 opacity-40 transition-opacity duration-300 ${bgTintClass}`} />

                                    {/* Border */}
                                    <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${borderClass}`} />

                                    {/* Top Accent Bar */}
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1.5"
                                        style={{
                                            background: isTopicCompleted ? '#10b981' : topic.color
                                        }}
                                    />

                                    <div className="relative p-6 flex flex-col justify-between h-full">
                                        <div>
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div
                                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-all duration-300"
                                                    style={{
                                                        background: isTopicCompleted
                                                            ? 'linear-gradient(135deg, #10b981, #059669)'
                                                            : `linear-gradient(135deg, ${topic.color}dd, ${topic.color})`
                                                    }}
                                                >
                                                    {isTopicCompleted ? <CheckCircle2 size={26} /> : topic.icon}
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                                                        {topic.badge}
                                                    </span>
                                                    {statusBadge}
                                                </div>
                                            </div>

                                            {/* Title & Description */}
                                            <h4 className={`font-bold text-gray-900 mb-2 text-lg transition-colors ${hoverTitleClass}`}>
                                                {topic.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                                                {topic.desc}
                                            </p>
                                        </div>

                                        <div>
                                            {/* Meta Info */}
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                                <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg font-medium text-slate-700">
                                                    <Play size={11} style={{ color: isTopicCompleted ? '#047857' : (TOPIC_TEXT_COLORS[topic.color] || topic.color) }} />
                                                    {isPracticeTask && isTaskStarted ? `${openedTasksCount}/15 Tasks` : topic.lessons}
                                                </span>
                                                <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg font-medium text-slate-700">
                                                    <Clock size={11} className="text-amber-500" />
                                                    {topic.duration}
                                                </span>
                                            </div>

                                            {/* Progress Bar / Action */}
                                            {!topic.locked && (
                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between text-[11px]">
                                                        <span className={`font-semibold ${textColorClass}`}>
                                                            {progressLabel}
                                                        </span>
                                                        <span className={`font-bold ${isTopicCompleted || isTaskStarted ? textColorClass : 'text-gray-600'}`}>
                                                            {progressRightText}
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-700 ${progressBarGradient}`}
                                                            style={{ width: `${progressPercent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Hover Arrow */}
                                            <div
                                                className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold group-hover:translate-x-1 transition-all duration-300"
                                                style={{ color: isTopicCompleted ? '#047857' : (TOPIC_TEXT_COLORS[topic.color] || topic.color) }}
                                            >
                                                <span>{isTopicCompleted ? 'Review Module' : topic.current ? 'Start Module' : 'Open Module'}</span>
                                                <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* ── Live Compiler Premium Section ── */}
                <div className="mb-12">
                    <Link href="/html/compiler" className="group block relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-100">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-30">
                            <svg width="100%" height="100%">
                                <pattern id="compiler-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <circle cx="20" cy="20" r="1.5" fill="#3b82f6" opacity="0.3" />
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#compiler-pattern)" />
                            </svg>
                        </div>

                        <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-10">
                            <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden border-2 border-blue-200 shadow-xl transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 bg-white">
                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative">
                                    <Terminal size={56} className="text-blue-600" />
                                    <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold">▶</div>
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
                                        Interactive
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200">
                                        Real-time Preview
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200">
                                        No Setup Required
                                    </span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                                    💻 Live HTML Compiler
                                </h3>
                                <p className="text-gray-600 mb-4 max-w-xl">
                                    Write HTML code and see the results instantly! Built-in editor with syntax support, real-time preview, and mobile-friendly shortcuts.
                                </p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-blue-100">
                                        <Play size={14} className="text-blue-500" />
                                        Instant Preview
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-blue-100">
                                        <Code2 size={14} className="text-blue-500" />
                                        Syntax Support
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-blue-100">
                                        <Star size={14} className="text-blue-500" />
                                        Mobile Friendly
                                    </span>
                                </div>
                            </div>

                            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                                <ChevronRight size={28} />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* ── Features Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {features.map((feature, i) => (
                        <div key={i} className={`group p-6 rounded-2xl bg-white border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 ${feature.bgColor}`}>
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                                {feature.icon}
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* ── Quick Stats ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Elements & Tags', value: '18', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                        { label: 'Practice Tasks', value: '15', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                        { label: 'Code Examples', value: '50+', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                        { label: 'Reference Tables', value: '10+', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                    ].map((stat) => (
                        <div key={stat.label} className={`${stat.bg} rounded-2xl border ${stat.border} p-5 text-center shadow-sm hover:shadow-md transition-shadow`}>
                            <p className={`text-3xl sm:text-4xl font-extrabold ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-gray-600 font-medium mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Call to Action ── */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-700 via-red-700 to-pink-700 p-8 md:p-12 text-center">
                    <div className="absolute inset-0 opacity-20">
                        <svg width="100%" height="100%">
                            <pattern id="cta-html-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                                <circle cx="30" cy="30" r="2" fill="white" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#cta-html-pattern)" />
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-4">Ready to Build Your First Web Page?</h3>
                        <p className="text-orange-100 mb-6 max-w-2xl mx-auto">Start with the basics and work your way up to building complete websites. Every tag, every attribute, every concept — all in one place!</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/html/intro" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-orange-700 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <Play size={18} fill="currentColor" />
                                Start Learning Now
                            </Link>
                            <Link href="/html/compiler" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/20 text-white font-bold border-2 border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                                <Terminal size={18} />
                                Try Live Compiler
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="mt-12 text-center py-8 border-t border-orange-100">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Code2 className="text-orange-500" size={20} />
                        <span className="text-lg font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            Build the Web, One Tag at a Time
                        </span>
                        <Globe className="text-orange-500" size={20} />
                    </div>
                    <p className="text-sm text-gray-500">
                        Master HTML and unlock the foundation of web development! 🌐✨
                    </p>
                </div>
            </main>

            {/* Global Styles */}
            <style jsx global>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% {transform: translateY(-20px) rotate(3deg); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% {transform: translateY(-15px) rotate(-3deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% {transform: translateY(-10px) rotate(2deg); }
                }
                @keyframes html-hero {
                    0%, 100% { transform: translateY(-50%) translateX(0px) rotate(0deg); }
                    25% {transform: translateY(-50%) translateX(10px) rotate(2deg); }
                    50% {transform: translateY(-50%) translateX(0px) rotate(0deg); }
                    75% {transform: translateY(-50%) translateX(-10px) rotate(-2deg); }
                }
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 7s ease-in-out infinite;
                }
                .animate-html-hero {
                    animation: html-hero 5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
