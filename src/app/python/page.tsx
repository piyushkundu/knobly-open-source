'use client';

import Link from 'next/link';
import {
    ArrowLeft, Home, BookOpen, Code2, GitBranch, FunctionSquare,
    FileText, BarChart3, List, Circle, ChevronRight, Sparkles,
    GraduationCap, Zap, LayoutDashboard, StickyNote, Brain,
    Keyboard, PenLine, Database, Leaf, TreePine, Play, Lock,
    CheckCircle2, Trophy, Target, Lightbulb, Compass, Clock,
    Users, Star, TrendingUp, Award,
    Save
} from 'lucide-react';

const quickLinks = [
    { label: 'Home', href: '/', icon: <Home size={14} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={14} /> },
    { label: 'Notes', href: '/notes', icon: <StickyNote size={14} /> },
    { label: 'Python', href: '/python', icon: <Code2 size={14} /> },
    { label: 'MCQ', href: '/mcq', icon: <Brain size={14} /> },
    { label: 'Shortcuts', href: '/shortcuts', icon: <Keyboard size={14} /> },
];

const pythonTopics = [
    {
        title: 'Python Fundamentals',
        href: '/python/fundamentals',
        icon: <Code2 size={24} />,
        color: '#f59e0b',
        bgColor: '#fffbeb',
        borderColor: '#fbbf24',
        desc: 'Variables, data types, operators, I/O operations & basic syntax',
        chapter: 1,
        duration: '2.5 Hours',
        lessons: 12,
        locked: false,
        completed: true,
    },
    {
        title: 'Control Statements',
        href: '/python/control-statements',
        icon: <GitBranch size={24} />,
        color: '#3b82f6',
        bgColor: '#eff6ff',
        borderColor: '#60a5fa',
        desc: 'if-else conditions, loops (for, while), break, continue & patterns',
        chapter: 2,
        duration: '3 Hours',
        lessons: 15,
        locked: false,
        completed: true,
    },
    {
        title: 'Lists & Arrays',
        href: '/python/lists',
        icon: <List size={24} />,
        color: '#f97316',
        bgColor: '#fff7ed',
        borderColor: '#fb923c',
        desc: 'List operations, methods, slicing, comprehensions & nested lists',
        chapter: 3,
        duration: '2.5 Hours',
        lessons: 14,
        locked: false,
        completed: true,
    },
    {
        title: 'Tuples & Sets',
        href: '/python/tuples',
        icon: <Circle size={24} />,
        color: '#ec4899',
        bgColor: '#fdf2f8',
        borderColor: '#f472b6',
        desc: 'Tuple creation, operations, packing/unpacking, immutability & sets',
        chapter: 4,
        duration: '2 Hours',
        lessons: 10,
        locked: false,
        completed: true,
    },
    {
        title: 'Dictionaries',
        href: '/python/dictionary',
        icon: <Database size={24} />,
        color: '#14b8a6',
        bgColor: '#f0fdfa',
        borderColor: '#2dd4bf',
        desc: 'Key-value pairs, nested dicts, methods, JSON handling & data retrieval',
        chapter: 5,
        duration: '2.5 Hours',
        lessons: 12,
        locked: false,
        completed: true,
    },
    {
        title: 'Library Functions',
        href: '/python/library-functions',
        icon: <FunctionSquare size={24} />,
        color: '#8b5cf6',
        bgColor: '#f5f3ff',
        borderColor: '#a78bfa',
        desc: 'Math module, random, datetime, string operations & built-ins',
        chapter: 6,
        duration: '3 Hours',
        lessons: 16,
        locked: false,
        completed: true,
    },
    {
        title: 'User Defined Functions',
        href: '/python/functions',
        icon: <GitBranch size={24} />,
        color: '#6366f1',
        bgColor: '#eef2ff',
        borderColor: '#a5b4fc',
        desc: 'User defined functions, arguments (positional, default, keyword) & recursion',
        chapter: 7,
        duration: '2.5 Hours',
        lessons: 12,
        locked: false,
        completed: true,
    },
    {
        title: 'File Processing',
        href: '/python/file-processing',
        icon: <Database size={24} />,
        color: '#f43f5e',
        bgColor: '#fff1f2',
        borderColor: '#fb7185',
        desc: 'Text vs Binary files, reading, writing, seeking and pickling data',
        chapter: 8,
        duration: '3 Hours',
        lessons: 15,
        locked: false,
        completed: true,
    },
    {
        title: 'Scope and Module',
        href: '/python/scope-module',
        icon: <GitBranch size={24} />,
        color: '#059669',
        bgColor: '#ecfdf5',
        borderColor: '#34d399',
        desc: 'Variable scope, LEGB rule, global keyword, creating & importing modules',
        chapter: 9,
        duration: '2.5 Hours',
        lessons: 14,
        locked: false,
        completed: true,
    },
    {
        title: 'NumPy Basics',
        href: '/python/numpy',
        icon: <BarChart3 size={24} />,
        color: '#06b6d4',
        bgColor: '#ecfeff',
        borderColor: '#22d3ee',
        desc: 'Arrays, operations, broadcasting, statistics & linear algebra',
        chapter: 10,
        duration: '4 Hours',
        lessons: 20,
        locked: false,
        completed: false,
        current: true,
    },
];



const features = [
    {
        icon: <Lightbulb size={28} />,
        title: 'Interactive Learning',
        desc: 'Learn by doing with hands-on coding exercises and real-time feedback',
        color: 'from-amber-400 to-orange-500',
        bgColor: 'bg-amber-50'
    },
    {
        icon: <Users size={28} />,
        title: 'Community Driven',
        desc: 'Join thousands of learners and share your coding journey',
        color: 'from-emerald-400 to-teal-500',
        bgColor: 'bg-emerald-50'
    },
    {
        icon: <Award size={28} />,
        title: 'Get Certified',
        desc: 'Earn a verified certificate upon completing all chapters',
        color: 'from-purple-400 to-pink-500',
        bgColor: 'bg-purple-50'
    },
];

export default function PythonPage() {
    return (
        <div className="min-h-screen bg-white text-slate-800 relative overflow-x-hidden">
            {/* Animated Jungle Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30" />

                {/* Animated Leaves Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="jungle-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                                <path d="M60 10 Q80 30 60 70 Q40 30 60 10" fill="#10b981" />
                                <path d="M10 60 Q30 40 70 60 Q30 80 10 60" fill="#059669" />
                                <path d="M100 40 Q120 60 100 100 Q80 60 100 40" fill="#34d399" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#jungle-pattern)" />
                    </svg>
                </div>

                {/* Animated Snake Path - Top */}
                <svg className="absolute top-20 left-0 w-full h-32 opacity-20" viewBox="0 0 1200 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="snakeGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M-50,50 Q100,20 250,50 T550,50 T850,50 T1150,50 T1450,50"
                        fill="none"
                        stroke="url(#snakeGradient1)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="15,10,5,10"
                    >
                        <animate attributeName="stroke-dashoffset" from="0" to="40" dur="3s" repeatCount="indefinite" />
                    </path>
                </svg>

                {/* Animated Snake Path - Bottom */}
                <svg className="absolute bottom-40 left-0 w-full h-32 opacity-15" viewBox="0 0 1200 100" preserveAspectRatio="none">
                    <path
                        d="M-50,50 Q150,80 300,50 T600,50 T900,50 T1200,50 T1500,50"
                        fill="none"
                        stroke="url(#snakeGradient1)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="10,8,4,8"
                    >
                        <animate attributeName="stroke-dashoffset" from="40" to="0" dur="4s" repeatCount="indefinite" />
                    </path>
                </svg>

                {/* Floating Python Logos */}
                <div className="absolute top-32 right-20 w-40 h-40 opacity-[0.08] animate-float-slow">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M50 15 C35 15 25 25 25 40 L25 48 L37 48 L37 40 C37 35 42 32 50 32 C58 32 63 35 63 40 L63 48 L75 48 L75 40 C75 25 65 15 50 15" fill="#3776ab" />
                        <circle cx="37" cy="58" r="4" fill="white" />
                        <path d="M50 85 C65 85 75 75 75 60 L75 52 L63 52 L63 60 C63 65 58 68 50 68 C42 68 37 65 37 60 L37 52 L25 52 L25 60 C25 75 35 85 50 85" fill="#ffd43b" />
                        <circle cx="63" cy="42" r="4" fill="#333" />
                    </svg>
                </div>

                {/* Decorative Jungle Elements */}
                <div className="absolute top-40 left-10 w-20 h-20 opacity-[0.06] animate-float">
                    <Leaf className="w-full h-full text-emerald-700" />
                </div>
                <div className="absolute bottom-60 right-10 w-16 h-16 opacity-[0.05] animate-float-delayed">
                    <TreePine className="w-full h-full text-emerald-700" />
                </div>
            </div>

            {/* ── Modern Navigation Bar ── */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-emerald-100/80 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <ArrowLeft size={18} />
                            </Link>
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 flex items-center justify-center drop-shadow-sm hover:scale-105 transition-transform p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-full h-full">
                                        <linearGradient id="python-original-a" gradientUnits="userSpaceOnUse" x1="70.252" y1="1237.476" x2="170.659" y2="1151.089" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stopColor="#5A9FD4"/><stop offset="1" stopColor="#306998"/></linearGradient>
                                        <linearGradient id="python-original-b" gradientUnits="userSpaceOnUse" x1="209.474" y1="1098.811" x2="173.62" y2="1149.537" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stopColor="#FFD43B"/><stop offset="1" stopColor="#FFE873"/></linearGradient>
                                        <path fill="url(#python-original-a)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z" transform="translate(0 10.26)"/>
                                        <path fill="url(#python-original-b)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z" transform="translate(0 10.26)"/>
                                        <radialGradient id="python-original-c" cx="1825.678" cy="444.45" r="26.743" gradientTransform="matrix(0 -.24 -1.055 0 532.979 557.576)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#B8B8B8" stopOpacity=".498"/><stop offset="1" stopColor="#7F7F7F" stopOpacity="0"/></radialGradient>
                                        <path opacity=".444" fill="url(#python-original-c)" d="M97.309 119.597c0 3.543-14.816 6.416-33.091 6.416-18.276 0-33.092-2.873-33.092-6.416 0-3.544 14.815-6.417 33.092-6.417 18.275 0 33.091 2.872 33.091 6.417z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                        Python
                                    </h1>
                                    <p className="text-[10px] text-gray-500 -mt-0.5">Programming</p>
                                </div>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-1">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/80 transition-all duration-200"
                                >
                                    {link.icon}
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200">
                                <Leaf size={12} />
                                <span>Python</span>
                            </div>
                            <Link href="/" className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors">
                                <Home size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Hero Section ── */}
                <div className="relative overflow-hidden rounded-[2rem] bg-white border border-emerald-100 shadow-2xl shadow-emerald-100/50 mb-12">
                    {/* Background Decorations */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/40 to-teal-100/40 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-100/30 to-yellow-100/30 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />

                    {/* Animated Snake Hero */}
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4 hidden xl:block">
                        <div className="relative w-64 h-64">
                            <svg viewBox="0 0 200 200" className="w-full h-full animate-snake-hero">
                                <defs>
                                    <linearGradient id="heroSnakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="50%" stopColor="#f59e0b" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M100 30 C70 30 50 45 50 70 C50 90 65 100 85 100 L115 100 C135 100 150 110 150 130 C150 155 130 170 100 170"
                                    fill="none"
                                    stroke="url(#heroSnakeGradient)"
                                    strokeWidth="18"
                                    strokeLinecap="round"
                                    className="drop-shadow-xl"
                                />
                                <circle cx="85" cy="75" r="5" fill="white" />
                                <circle cx="115" cy="125" r="5" fill="white" />
                            </svg>
                        </div>
                    </div>

                    <div className="relative z-10 p-8 md:p-12 lg:pr-72">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-200">
                                <Sparkles size={12} />
                                Complete Course
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider border border-amber-200">
                                <TrendingUp size={12} />
                                Beginner Friendly
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 leading-[1.1] tracking-tight">
                            Master <span className="relative">
                                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">Python</span>
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none">
                                    <path d="M0,5 Q50,0 100,5 T200,5" stroke="#10b981" strokeWidth="3" fill="none" opacity="0.3" />
                                </svg>
                            </span>
                            <br />
                            <span className="text-3xl md:text-4xl font-bold text-gray-600">Programming</span>
                        </h2>

                        <p className="text-lg text-gray-600 max-w-2xl mb-8 leading-relaxed">
                            Embark on an exciting journey through the jungle of code! From basic syntax to advanced libraries,
                            master Python with interactive lessons, hands-on projects, and real-world applications.
                        </p>



                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link href="/python/fundamentals" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300">
                                <Play size={18} fill="currentColor" />
                                Start Learning
                            </Link>
                            <Link href="#chapters" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-gray-700 font-bold border-2 border-gray-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all duration-300">
                                <Compass size={18} />
                                Explore Chapters
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Learning Path Timeline ── */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                                <TreePine size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Your Learning Path</h3>
                                <p className="text-sm text-gray-500">Follow the trail to become a Python expert</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                                <span className="text-gray-600">Completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-200 animate-pulse" />
                                <span className="text-gray-600">Current</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-300" />
                                <span className="text-gray-600">Locked</span>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Timeline for Desktop */}
                    <div className="hidden lg:block relative">
                        <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-amber-300 to-gray-200 rounded-full" />
                        <div className="relative grid grid-cols-10 gap-2">
                            {pythonTopics.map((topic, index) => (
                                <div key={topic.chapter} className="flex flex-col items-center">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${topic.completed
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-110'
                                        : topic.current
                                            ? 'bg-amber-400 text-white shadow-lg shadow-amber-200 scale-110 ring-4 ring-amber-100 animate-pulse'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {topic.completed ? <CheckCircle2 size={28} /> : topic.locked ? <Lock size={24} /> : topic.icon}
                                    </div>
                                    <span className="text-xs font-bold text-center text-gray-700 line-clamp-1 px-1">{topic.title}</span>
                                    <span className="text-[10px] text-gray-500 mt-0.5">Ch. {topic.chapter}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vertical Timeline for Mobile */}
                    <div className="lg:hidden relative space-y-4">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-300 via-amber-300 to-gray-200" />
                        {pythonTopics.slice(0, 5).map((topic, index) => (
                            <div key={topic.chapter} className="relative flex items-center gap-4 pl-4">
                                <div className={`relative z-10 w-5 h-5 rounded-full border-4 border-white shadow-md ${topic.completed
                                    ? 'bg-emerald-500'
                                    : topic.current
                                        ? 'bg-amber-400 animate-pulse'
                                        : 'bg-gray-300'
                                    }`} />
                                <div className={`flex-1 p-4 rounded-xl border ${topic.completed
                                    ? 'bg-emerald-50 border-emerald-200'
                                    : topic.current
                                        ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-100'
                                        : 'bg-gray-50 border-gray-200'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">Chapter {topic.chapter}</span>
                                            <h4 className="font-bold text-gray-900">{topic.title}</h4>
                                        </div>
                                        {topic.completed && <CheckCircle2 size={20} className="text-emerald-500" />}
                                        {topic.current && <Star size={20} className="text-amber-500 fill-amber-500" />}
                                        {topic.locked && <Lock size={20} className="text-gray-600" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Chapter Cards Grid ── */}
                <div id="chapters" className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                                <BookOpen size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Course Chapters</h3>
                        </div>
                        <Link href="/python/all-chapters" className="text-sm font-semibold text-emerald-700 hover:text-emerald-700 flex items-center gap-1 hover:gap-2 transition-all">
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {pythonTopics.map((topic, index) => (
                            <Link
                                key={topic.href}
                                href={topic.locked ? '#' : topic.href}
                                className={`group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 ${topic.locked ? 'cursor-not-allowed' : 'cursor-pointer'
                                    }`}
                            >
                                {/* Card Background */}
                                <div className="absolute inset-0 bg-white" />
                                <div className={`absolute inset-0 opacity-50 transition-opacity duration-300 ${topic.current ? 'bg-amber-50' : ''
                                    }`} />

                                {/* Border */}
                                <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${topic.current
                                    ? 'border-amber-300 ring-4 ring-amber-100'
                                    : 'border-gray-100 group-hover:border-emerald-200'
                                    }`} />

                                {/* Top Accent Bar */}
                                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: topic.color }} />

                                <div className="relative p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                                            style={{ background: `linear-gradient(135deg, ${topic.color}dd, ${topic.color})` }}
                                        >
                                            {topic.icon}
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ch. {topic.chapter}</span>
                                            {topic.completed && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Done</span>}
                                            {topic.current && <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold animate-pulse">Current</span>}
                                            {topic.locked && <Lock size={16} className="text-gray-600" />}
                                        </div>
                                    </div>

                                    {/* Title & Description */}
                                    <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-emerald-700 transition-colors">{topic.title}</h4>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                        {topic.desc}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                            <Play size={12} className="text-emerald-500" />
                                            {topic.lessons} Lessons
                                        </span>
                                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                            <Clock size={12} className="text-amber-500" />
                                            {topic.duration}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    {!topic.locked && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className={`font-semibold ${topic.completed ? 'text-emerald-700' : topic.current ? 'text-amber-700' : 'text-gray-500'
                                                    }`}>
                                                    {topic.completed ? 'Completed' : topic.current ? 'In Progress' : 'Not Started'}
                                                </span>
                                                <span className="text-gray-500">
                                                    {topic.completed ? '100%' : topic.current ? '45%' : '0%'}
                                                </span>
                                            </div>
                                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${topic.completed
                                                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                                        : topic.current
                                                            ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                                            : 'bg-gray-300'
                                                        }`}
                                                    style={{ width: topic.completed ? '100%' : topic.current ? '45%' : '0%' }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {topic.locked && (
                                        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
                                            <Lock size={12} />
                                            <span>Complete previous chapters</span>
                                        </div>
                                    )}

                                    {/* Hover Arrow */}
                                    {!topic.locked && (
                                        <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                            <ChevronRight size={20} />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Handwritten Notes Premium Section ── */}
                <div className="mb-12">
                    <Link href="/python/handwritten-notes" className="group block relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-200 hover:border-amber-300 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-100">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-30">
                            <svg width="100%" height="100%">
                                <pattern id="notes-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <circle cx="20" cy="20" r="1.5" fill="#f59e0b" opacity="0.3" />
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#notes-pattern)" />
                            </svg>
                        </div>

                        <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-10">
                            <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden border-2 border-amber-200 shadow-xl transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 bg-white">
                                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center relative">
                                    <PenLine size={56} className="text-amber-700" />
                                    <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white text-xs font-bold">PDF</div>
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider border border-amber-200">
                                        NIELIT O-Level
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200">
                                        M3-R5
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-200">
                                        Free Download
                                    </span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 group-hover:text-amber-700 transition-colors">
                                    ✍️ Handwritten Python Notes
                                </h3>
                                <p className="text-gray-600 mb-4 max-w-xl">
                                    Comprehensive handwritten notes covering all 11 chapters with diagrams, code examples, and exam tips. Perfect for quick revision before exams!
                                </p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-amber-100">
                                        <BookOpen size={14} className="text-amber-500" />
                                        11 Chapters
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-amber-100">
                                        <FileText size={14} className="text-amber-500" />
                                        275+ Pages
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-amber-100">
                                        <Star size={14} className="text-amber-500" />
                                        4.9 Rating
                                    </span>
                                </div>
                            </div>

                            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                                <ChevronRight size={28} />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* ── Features Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {features.map((feature, i) => (
                        <div key={i} className={`group p-6 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 ${feature.bgColor}`}>
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                                {feature.icon}
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* ── Call to Action ── */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 p-8 md:p-12 text-center">
                    <div className="absolute inset-0 opacity-20">
                        <svg width="100%" height="100%">
                            <pattern id="cta-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                                <circle cx="30" cy="30" r="2" fill="white" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#cta-pattern)" />
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-4">Ready to Start Your Python Journey?</h3>
                        <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">Join thousands of students who have mastered Python through our interactive course. Start learning today!</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/python/fundamentals" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-emerald-700 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <Play size={18} fill="currentColor" />
                                Start Learning Now
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="mt-12 text-center py-8 border-t border-emerald-100">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Leaf className="text-emerald-500" size={20} />
                        <span className="text-lg font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Keep Learning, Keep Growing
                        </span>
                        <TreePine className="text-emerald-500" size={20} />
                    </div>
                    <p className="text-sm text-gray-500">
                        More chapters coming soon! 🐍🌿 Stay tuned for updates.
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
                @keyframes snake-hero {
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
                .animate-snake-hero {
                    animation: snake-hero 5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
