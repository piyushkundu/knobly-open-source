'use client';

import Link from 'next/link';
import { ArrowLeft, Home, BookOpen, ChevronRight, Sparkles, Play, Zap, Lock, CheckCircle2, Clock, Wifi, Cpu, Shield, Radio, Settings, Lightbulb, Users, Award, TrendingUp, Target, Star, Compass, PenTool, Download, FileText } from 'lucide-react';

const iotTopics = [
    {
        title: 'Introduction to IoT',
        href: '/iot/introduction',
        icon: <Wifi size={24} />,
        color: '#06b6d4',
        bgColor: '#ecfeff',
        borderColor: '#22d3ee',
        desc: 'Applications, Devices, Protocols and Communication Model',
        chapter: 1,
        duration: '3 Hours',
        lessons: 15,
        locked: false,
        completed: true,
        current: false,
    },
    {
        title: 'Things and Connections',
        href: '/iot/things-connections',
        icon: <Radio size={24} />,
        color: '#8b5cf6',
        bgColor: '#f5f3ff',
        borderColor: '#a78bfa',
        desc: 'IoT devices, connectivity methods, networking and communication',
        chapter: 2,
        duration: '2.5 Hours',
        lessons: 12,
        locked: false,
        completed: true,
        current: false,
    },
    {
        title: 'Sensors, Actuators & Microcontrollers',
        href: '/iot/sensors',
        icon: <Cpu size={24} />,
        color: '#f97316',
        bgColor: '#fff7ed',
        borderColor: '#fb923c',
        desc: 'Arduino, Raspberry Pi, ESP32, sensors and actuator types',
        chapter: 3,
        duration: '3.5 Hours',
        lessons: 18,
        locked: false,
        completed: true,
        current: false,
    },
    {
        title: 'Building IoT Applications',
        href: '/iot/applications',
        icon: <Settings size={24} />,
        color: '#10b981',
        bgColor: '#ecfdf5',
        borderColor: '#34d399',
        desc: 'Smart Home, Healthcare, Agriculture, Industrial IoT projects',
        chapter: 4,
        duration: '3 Hours',
        lessons: 14,
        locked: false,
        completed: true,
        current: false,
    },
    {
        title: 'Security & Future of IoT',
        href: '/iot/security',
        icon: <Shield size={24} />,
        color: '#ef4444',
        bgColor: '#fef2f2',
        borderColor: '#fca5a5',
        desc: 'IoT security challenges, encryption, privacy and future trends',
        chapter: 5,
        duration: '2.5 Hours',
        lessons: 12,
        locked: false,
        completed: true,
        current: false,
    },
    {
        title: 'Soft Skills — Personality Dev',
        href: '/iot/soft-skills',
        icon: <Users size={24} />,
        color: '#ec4899',
        bgColor: '#fdf2f8',
        borderColor: '#f9a8d4',
        desc: 'Communication skills, teamwork, leadership and personality development',
        chapter: 6,
        duration: '2 Hours',
        lessons: 10,
        locked: false,
        completed: false,
        current: true,
    },
];

const features = [
    { icon: <Lightbulb size={28} />, title: 'Smart Learning', desc: 'IoT concepts with real-world examples and animated diagrams', color: 'from-cyan-400 to-teal-500', bgColor: 'bg-cyan-50' },
    { icon: <Users size={28} />, title: 'Exam Ready', desc: 'O-Level M4-R5 IoT syllabus fully covered with MCQs', color: 'from-violet-400 to-purple-500', bgColor: 'bg-violet-50' },
    { icon: <Award size={28} />, title: 'Hands-On Projects', desc: 'Build real IoT applications with Arduino and Raspberry Pi', color: 'from-orange-400 to-red-500', bgColor: 'bg-orange-50' },
];

export default function IoTPage() {
    return (
        <div className="min-h-screen bg-white text-slate-800 relative overflow-x-hidden">
            {/* IoT Circuit Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-white to-blue-50/30" />
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="circuit-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                                <circle cx="60" cy="60" r="3" fill="#06b6d4" />
                                <line x1="60" y1="0" x2="60" y2="57" stroke="#06b6d4" strokeWidth="1" />
                                <line x1="63" y1="60" x2="120" y2="60" stroke="#06b6d4" strokeWidth="1" />
                                <circle cx="10" cy="10" r="2" fill="#8b5cf6" />
                                <line x1="10" y1="12" x2="10" y2="60" stroke="#8b5cf6" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
                    </svg>
                </div>
                <svg className="absolute top-20 left-0 w-full h-32 opacity-20" viewBox="0 0 1200 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="iotGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                    </defs>
                    <path d="M-50,50 Q100,20 250,50 T550,50 T850,50 T1150,50 T1450,50" fill="none" stroke="url(#iotGradient1)" strokeWidth="6" strokeLinecap="round" strokeDasharray="15,10,5,10">
                        <animate attributeName="stroke-dashoffset" from="0" to="40" dur="3s" repeatCount="indefinite" />
                    </path>
                </svg>
                <div className="absolute top-32 right-20 w-40 h-40 opacity-[0.06] animate-iot-float">
                    <Wifi className="w-full h-full text-cyan-500" />
                </div>
                <div className="absolute top-40 left-10 w-20 h-20 opacity-[0.06] animate-iot-pulse">
                    <Cpu className="w-full h-full text-purple-500" />
                </div>
                <div className="absolute bottom-60 right-10 w-16 h-16 opacity-[0.05] animate-iot-float-delayed">
                    <Shield className="w-full h-full text-orange-500" />
                </div>
            </div>

            {/* Navbar */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-cyan-100/80 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <ArrowLeft size={18} />
                            </Link>
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white">
                                    <Wifi size={18} />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Internet of Things</h1>
                                    <p className="text-[10px] text-gray-500 -mt-0.5">O-Level — Module 4 (M4-R5)</p>
                                </div>
                            </div>
                        </div>
                        <nav className="hidden md:flex items-center gap-1">
                            {[{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/dashboard' }, { label: 'Python', href: '/python' }, { label: 'MCQ', href: '/mcq' }].map(l => (
                                <Link key={l.href} href={l.href} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-cyan-700 hover:bg-cyan-50/80 transition-all duration-200">{l.label}</Link>
                            ))}
                        </nav>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100 text-cyan-700 text-xs font-semibold border border-cyan-200">
                                <Wifi size={12} /><span>IoT</span>
                            </div>
                            <Link href="/" className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-cyan-100 hover:text-cyan-700 transition-colors">
                                <Home size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Hero */}
                <div className="relative overflow-hidden rounded-[2rem] bg-white border border-cyan-100 shadow-2xl shadow-cyan-100/50 mb-12">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-100/40 to-blue-100/40 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-100/30 to-orange-100/30 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />

                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4 hidden xl:block">
                        <div className="relative w-64 h-64">
                            <svg viewBox="0 0 200 200" className="w-full h-full animate-iot-hero">
                                <defs>
                                    <linearGradient id="heroIoTGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#06b6d4" />
                                        <stop offset="50%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#f97316" />
                                    </linearGradient>
                                </defs>
                                <circle cx="100" cy="100" r="45" fill="none" stroke="url(#heroIoTGrad)" strokeWidth="3" strokeDasharray="8,4" opacity="0.3">
                                    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="100" cy="100" r="65" fill="none" stroke="url(#heroIoTGrad)" strokeWidth="2" strokeDasharray="5,8" opacity="0.2">
                                    <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="30s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="100" cy="55" r="6" fill="#06b6d4" opacity="0.6"><animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" /></circle>
                                <circle cx="145" cy="100" r="6" fill="#8b5cf6" opacity="0.6"><animate attributeName="r" values="6;8;6" dur="2.5s" repeatCount="indefinite" /></circle>
                                <circle cx="100" cy="145" r="6" fill="#f97316" opacity="0.6"><animate attributeName="r" values="6;8;6" dur="3s" repeatCount="indefinite" /></circle>
                                <circle cx="55" cy="100" r="6" fill="#10b981" opacity="0.6"><animate attributeName="r" values="6;8;6" dur="2.2s" repeatCount="indefinite" /></circle>
                                <circle cx="100" cy="100" r="12" fill="url(#heroIoTGrad)" opacity="0.8" />
                            </svg>
                        </div>
                    </div>

                    <div className="relative z-10 p-8 md:p-12 lg:pr-72">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold uppercase tracking-wider border border-cyan-200">
                                <Sparkles size={12} />Complete Course
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-200">
                                <TrendingUp size={12} />O-Level M4-R5
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 leading-[1.1] tracking-tight">
                            Master <span className="relative">
                                <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">IoT</span>
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none">
                                    <path d="M0,5 Q50,0 100,5 T200,5" stroke="#06b6d4" strokeWidth="3" fill="none" opacity="0.3" />
                                </svg>
                            </span>
                            <br />
                            <span className="text-3xl md:text-4xl font-bold text-gray-600">Internet of Things</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mb-8 leading-relaxed">
                            Smart devices, sensors, protocols aur real-world IoT applications seekho — Hindi mein! O-Level Module 4 ka complete course with animated explanations.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/iot/introduction" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-200 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300">
                                <Play size={18} fill="currentColor" />Start Learning
                            </Link>
                            <Link href="#chapters" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-gray-700 font-bold border-2 border-gray-200 hover:border-cyan-300 hover:text-cyan-700 hover:bg-cyan-50/50 transition-all duration-300">
                                <Compass size={18} />Explore Chapters
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Chapter Cards */}
                <div id="chapters" className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                                <BookOpen size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Course Chapters</h3>
                        </div>
                        <div className="hidden md:flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-500 ring-2 ring-cyan-200 animate-pulse" /><span className="text-gray-600">Current</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-300" /><span className="text-gray-600">Locked</span></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {iotTopics.map((topic) => (
                            <Link key={topic.href} href={topic.locked ? '#' : topic.href}
                                className={`group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 ${topic.locked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                                <div className="absolute inset-0 bg-white" />
                                <div className={`absolute inset-0 opacity-50 transition-opacity duration-300 ${topic.current ? 'bg-cyan-50' : ''}`} />
                                <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${topic.current ? 'border-cyan-300 ring-4 ring-cyan-100' : 'border-gray-100 group-hover:border-cyan-200'}`} />
                                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: topic.color }} />
                                <div className="relative p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" style={{ background: `linear-gradient(135deg, ${topic.color}dd, ${topic.color})` }}>
                                            {topic.icon}
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ch. {topic.chapter}</span>
                                            {topic.completed && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Done</span>}
                                            {topic.current && <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 text-[10px] font-bold animate-pulse">Current</span>}
                                            {topic.locked && <Lock size={16} className="text-gray-600" />}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-cyan-700 transition-colors">{topic.title}</h4>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{topic.desc}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg"><Play size={12} className="text-cyan-700" />{topic.lessons} Lessons</span>
                                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg"><Clock size={12} className="text-orange-700" />{topic.duration}</span>
                                    </div>
                                    {!topic.locked && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className={`font-semibold ${topic.completed ? 'text-emerald-700' : topic.current ? 'text-cyan-700' : 'text-gray-500'}`}>
                                                    {topic.completed ? 'Completed' : topic.current ? 'In Progress' : 'Not Started'}
                                                </span>
                                                <span className="text-gray-500">{topic.completed ? '100%' : topic.current ? '15%' : '0%'}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-1000 ${topic.completed ? 'bg-emerald-500' : topic.current ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gray-300'}`} style={{ width: topic.completed ? '100%' : topic.current ? '15%' : '0%' }} />
                                            </div>
                                        </div>
                                    )}
                                    {topic.locked && (
                                        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
                                            <Lock size={12} /><span>Complete previous chapters</span>
                                        </div>
                                    )}
                                    {!topic.locked && (
                                        <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 group-hover:bg-cyan-100 group-hover:text-cyan-700 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                            <ChevronRight size={20} />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Handwritten Notes Banner */}
                <div className="relative overflow-hidden rounded-[1.5rem] bg-white border-2 border-amber-200 shadow-xl shadow-amber-100/40 mb-12 group hover:shadow-2xl hover:shadow-amber-200/50 hover:border-amber-300 transition-all duration-500">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
                    <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-amber-100/30 to-orange-100/30 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-yellow-100/20 to-red-100/20 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
                    <Link href="/iot/notes" className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-8 md:p-10">
                        <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xl shadow-amber-200/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <PenTool size={36} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold uppercase tracking-wider border border-amber-200">New ✨</span>
                                <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-bold uppercase tracking-wider border border-red-200">PDF Notes</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
                                📝 Handwritten Notes — Chapter 1 & 2
                            </h3>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl">
                                IoT Chapter 1 aur Chapter 2 ke detailed handwritten notes — exam revision ke liye perfect! Download karo aur offline padho.
                            </p>
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-center gap-3">
                            <div className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-lg shadow-amber-200 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 flex items-center gap-2">
                                <Download size={18} />View & Download
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><FileText size={12} className="text-amber-500" />2 PDFs</span>
                                <span className="flex items-center gap-1"><BookOpen size={12} className="text-blue-500" />Ch 1 & 2</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {features.map((f, i) => (
                        <div key={i} className={`group p-6 rounded-2xl bg-white border border-gray-100 hover:border-cyan-200 hover:shadow-xl transition-all duration-300 ${f.bgColor}`}>
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>{f.icon}</div>
                            <h4 className="font-bold text-gray-900 mb-2 text-lg">{f.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 p-8 md:p-12 text-center">
                    <div className="absolute inset-0 opacity-20">
                        <svg width="100%" height="100%"><pattern id="iot-cta" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="2" fill="white" /></pattern><rect width="100%" height="100%" fill="url(#iot-cta)" /></svg>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-4">Ready to Explore the IoT World? 🌐</h3>
                        <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">Smart devices, sensors aur connected world ko samjho — O-Level IoT course shuru karo aaj hi!</p>
                        <Link href="/iot/introduction" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-cyan-700 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <Play size={18} fill="currentColor" />Start Chapter 1
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center py-8 border-t border-cyan-100">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Wifi className="text-cyan-500" size={20} />
                        <span className="text-lg font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Connect. Learn. Innovate.</span>
                        <Cpu className="text-cyan-500" size={20} />
                    </div>
                    <p className="text-sm text-gray-500">More chapters coming soon! 🌐📡 Stay tuned for updates.</p>
                </div>
            </main>

            <style jsx global>{`
                @keyframes iot-float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(3deg); } }
                @keyframes iot-pulse { 0%, 100% { transform: scale(1); opacity: 0.06; } 50% { transform: scale(1.1); opacity: 0.09; } }
                @keyframes iot-float-delayed { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
                @keyframes iot-hero { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } }
                .animate-iot-float { animation: iot-float 8s ease-in-out infinite; }
                .animate-iot-pulse { animation: iot-pulse 4s ease-in-out infinite; }
                .animate-iot-float-delayed { animation: iot-float-delayed 7s ease-in-out infinite; }
                .animate-iot-hero { animation: iot-hero 6s ease-in-out infinite; }
            `}</style>
        </div>
    );
}
