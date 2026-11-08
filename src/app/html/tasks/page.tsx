'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminFetch } from '@/lib/admin-fetch';
import { AdminTaskGate } from '@/components/auth/AdminTaskGate';
import LoginModal from '@/components/auth/LoginModal';
import { 
    ArrowLeft, Home, FileCode, ExternalLink, Lock, Unlock, 
    KeyRound, CheckCircle2, AlertCircle, X, Shield, Sparkles, RefreshCw, Code2, Eye
} from 'lucide-react';

const KNOWN_HTML_ATTRIBUTES = new Set([
    'align', 'bgcolor', 'border', 'cellpadding', 'cellspacing',
    'colspan', 'rowspan', 'href', 'src', 'alt', 'width', 'height',
    'color', 'face', 'size', 'type', 'value', 'name', 'target',
    'placeholder', 'required', 'rows', 'cols', 'checked', 'selected',
    'id', 'class', 'style', 'title', 'radio', 'checkbox'
]);

function isHtmlAttribute(name: string): boolean {
    const clean = name.trim().toLowerCase().replace(/^attr:/, '');
    return KNOWN_HTML_ATTRIBUTES.has(clean);
}

interface TaskItem {
    id: string;
    title: string;
    desc: string;
    topics: string;
    color: string;
}

const TASKS: TaskItem[] = [
    { id: '1', title: 'My Profile Page', desc: 'Create a personal profile using basic HTML tags: p, pre, br, hr', topics: 'p, pre, br, hr, bgcolor', color: 'bg-blue-700' },
    { id: '2', title: 'Basic HTML Tags', desc: 'Demonstrate bold, italic, underline, pre, br, center and heading tags', topics: 'b, i, u, pre, br, center, h1, h2, hr', color: 'bg-green-700' },
    { id: '3', title: 'India - A Diverse Nation', desc: 'Article about India using headings, images, font colors, and hr', topics: 'h1-h5, img, font, br, hr, align', color: 'bg-orange-700' },
    { id: '4', title: 'Indian History Timeline', desc: 'History page using semantic elements: header, nav, section, footer', topics: 'header, nav, section, footer, address, ul', color: 'bg-red-700' },
    { id: '5', title: 'Operating Systems (Lists)', desc: 'OS information page with unordered and ordered lists', topics: 'ul, ol, li, h1-h3, p, hr', color: 'bg-purple-700' },
    { id: '5.0', title: 'Web Dev Roadmap (Nested Lists)', desc: 'Multi-level learning roadmap using nested unordered, ordered, and description lists', topics: 'ul, ol, li, dl, dt, dd, type, h1-h3, p, hr', color: 'bg-teal-700' },
    { id: '5.1', title: 'Operating Systems (Table)', desc: 'OS comparison using tables with borders and cellpadding', topics: 'table, tr, th, td, border, cellpadding', color: 'bg-purple-700' },
    { id: '5.2', title: 'Internet Usage Statistics', desc: 'Global internet stats with colspan and rowspan tables', topics: 'table, colspan, rowspan, th, td, caption', color: 'bg-indigo-700' },
    { id: '5.3', title: 'History of the Internet', desc: 'Internet timeline with description lists and tables', topics: 'dl, dt, dd, table, iframe, ol', color: 'bg-indigo-700' },
    { id: '5.4', title: 'Wonders of Space', desc: 'Space exploration page with images, tables, and multimedia', topics: 'img, table, audio, video, iframe', color: 'bg-cyan-700' },
    { id: '6', title: 'Weekly Study Schedule', desc: 'Complex table with colspan, rowspan, and colored cells', topics: 'table, colspan, rowspan, bgcolor, th, td', color: 'bg-teal-700' },
    { id: '7', title: 'Simple Webpage (No CSS)', desc: 'Complete webpage using only semantic HTML tags, no CSS', topics: 'header, nav, main, article, section, footer', color: 'bg-amber-700' },
    { id: '8', title: 'Registration Form', desc: 'Complete registration form with all input types', topics: 'form, input, select, textarea, radio, checkbox', color: 'bg-rose-700' },
    { id: '9', title: 'Solar System Basics', desc: 'Solar system page with tables, lists, and audio', topics: 'table, ol, ul, audio, img, details', color: 'bg-sky-700' },
    { id: '10', title: 'Full Website Layout', desc: 'Multi-section website with marquee, nav, tables, forms, media', topics: 'marquee, nav, table, form, video, iframe', color: 'bg-emerald-700' },
    { id: '11', title: 'Premium Demo Website', desc: 'Professional-looking demo site with header, sections, and footer', topics: 'header, section, article, aside, footer, figure', color: 'bg-violet-700' },
    { id: 'test-1', title: 'Test - 1: HTML Foundation & Lists Mastery', desc: 'Comprehensive test covering all tags up to lists: headings, paragraphs, pre, formatting, marquee, images, anchor links, unordered, ordered, nested, and description lists.', topics: 'h1-h3, p, pre, b, i, u, mark, marquee, img, a, ul, ol, dl, dt, dd, font, hr, bgcolor, align, href, src', color: 'bg-gradient-to-r from-red-700 to-rose-700' },
];

export default function TasksPage() {
    const router = useRouter();
    const [unlockedTasks, setUnlockedTasks] = useState<string[]>([]);
    const [openedTasks, setOpenedTasks] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal state for Admin Unlock
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string>('all');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [modalAction, setModalAction] = useState<'unlock' | 'lock'>('unlock');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch current unlocked tasks from backend API
    const fetchTasksState = async () => {
        // First check localStorage for immediate render
        try {
            const cached = localStorage.getItem('knobly_unlocked_html_tasks');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed)) {
                    setUnlockedTasks(parsed);
                }
            }
        } catch (e) {}

        try {
            const res = await fetch('/api/html-tasks', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data.unlockedTasks)) {
                    setUnlockedTasks(data.unlockedTasks);
                    try {
                        localStorage.setItem('knobly_unlocked_html_tasks', JSON.stringify(data.unlockedTasks));
                    } catch (e) {}
                }
            }
        } catch (err) {
            console.error('Failed to load tasks status:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const loadOpenedTasks = () => {
        try {
            const raw = localStorage.getItem('knobly_opened_html_tasks');
            if (raw) {
                const list = JSON.parse(raw);
                if (Array.isArray(list)) setOpenedTasks(list);
            }
        } catch (e) {}
    };

    const recordTaskOpen = (taskId: string) => {
        try {
            const raw = localStorage.getItem('knobly_opened_html_tasks');
            const list: string[] = raw ? JSON.parse(raw) : [];
            if (!list.includes(taskId)) {
                list.push(taskId);
                localStorage.setItem('knobly_opened_html_tasks', JSON.stringify(list));
                setOpenedTasks([...list]);
            }
        } catch (e) {}
    };

    useEffect(() => {
        fetchTasksState();
        loadOpenedTasks();
    }, []);

    const openUnlockModal = (taskId: string = 'all', action: 'unlock' | 'lock' = 'unlock') => {
        setSelectedTaskId(taskId);
        setModalAction(action);
        setErrorMessage('');
        setSuccessMessage('');
        setModalOpen(true);
    };

    const handleAdminSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setSubmitLoading(true);

        try {
            const res = await adminFetch('/api/html-tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskId: selectedTaskId,
                    action: modalAction,
                }),
            });

            const data = await res.json();

            if (!res.ok || data.success !== true || !Array.isArray(data.unlockedTasks) ||
                !data.unlockedTasks.every((id: unknown) => typeof id === 'string')) {
                setErrorMessage(data.error || 'Task status update failed. Please try again.');
            } else {
                const updatedList = data.unlockedTasks;
                setUnlockedTasks(updatedList);
                try {
                    localStorage.setItem('knobly_unlocked_html_tasks', JSON.stringify(updatedList));
                } catch (e) {}

                setSuccessMessage(data.message || 'Task status updated successfully!');
                setTimeout(() => {
                    setModalOpen(false);
                    setSuccessMessage('');
                }, 900);
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Network error. Please try again.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const isTaskUnlocked = (id: string) => unlockedTasks.includes(id);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* ── Header ── */}
            <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => {
                                if (typeof window !== 'undefined' && window.history.length > 1 && document.referrer && document.referrer.includes(window.location.host)) {
                                    router.back();
                                } else {
                                    router.push('/html');
                                }
                            }} 
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                            title="Go Back"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-700 flex items-center justify-center text-white shadow-sm">
                                <FileCode size={16} />
                            </div>
                            <div>
                                <h1 className="text-sm font-bold text-slate-900 leading-tight">HTML Practice Tasks</h1>
                                <span className="text-[10px] text-slate-600 font-medium">15 Hands-on Projects</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/html/compiler"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-orange-700 to-red-700 text-white shadow-sm hover:scale-105 active:scale-95 transition-all"
                            title="Open Web Compiler"
                        >
                            <FileCode size={13} />
                            <span className="hidden sm:inline">Web Compiler</span>
                        </Link>

                        {/* Small Lock Icon for Admin */}
                        <button
                            onClick={() => openUnlockModal('all', 'unlock')}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 border border-slate-200 hover:border-amber-300 transition-all shadow-sm"
                            title="Admin Unlock Controls"
                        >
                            <Lock size={13} className="text-amber-600" />
                            <span className="hidden sm:inline">Admin Access</span>
                        </button>

                        <Link 
                            href="/" 
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                            title="Home"
                        >
                            <Home size={16} />
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main className="max-w-6xl mx-auto px-4 py-6">
                {/* Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 rounded-2xl p-6 mb-6 text-white shadow-lg shadow-orange-500/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-sm mb-3">
                            <Sparkles size={12} />
                            <span>Structured Practice Curriculum</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Hands-on Practice Tasks</h2>
                        <p className="text-amber-100 text-xs sm:text-sm leading-relaxed mb-4">
                            Tasks start locked to ensure step-by-step learning. As you complete tag sections in the Elements guide, each task will be unlocked by the instructor!
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm font-semibold">
                                Total: {TASKS.length} Tasks
                            </span>
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                                Unlocked: {unlockedTasks.length} Tasks
                            </span>
                            <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 font-semibold">
                                Opened: {openedTasks.length}/{TASKS.length} ({Math.round((openedTasks.length / TASKS.length) * 100)}%)
                            </span>
                            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 font-semibold">
                                Locked: {TASKS.length - unlockedTasks.length} Tasks
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Tasks Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {TASKS.map((task) => {
                        const unlocked = isTaskUnlocked(task.id);
                        const isOpened = openedTasks.includes(task.id);

                        return (
                            <div 
                                key={task.id}
                                className={`relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                                    unlocked 
                                        ? 'bg-white border-emerald-200 shadow-sm hover:shadow-md hover:-translate-y-1' 
                                        : 'bg-slate-50/90 border-slate-200 shadow-sm hover:border-slate-300'
                                }`}
                            >
                                {/* Top Accent */}
                                <div className={`h-1.5 w-full ${unlocked ? 'bg-emerald-500' : 'bg-slate-300'}`} />

                                <div className="p-5">
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-2.5">
                                            <span className={`w-9 h-9 rounded-xl text-white font-extrabold text-xs flex items-center justify-center shadow-sm ${
                                                unlocked ? task.color : 'bg-slate-600'
                                            }`}>
                                                {task.id}
                                            </span>
                                            <div>
                                                <h3 className={`text-sm font-bold leading-tight ${unlocked ? 'text-slate-900' : 'text-slate-600'}`}>
                                                    {task.title}
                                                </h3>
                                                <span className="text-[10px] text-slate-600 font-mono">Task #{task.id}</span>
                                            </div>
                                        </div>

                                        {/* Status Badge & Small Lock Icon */}
                                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                            {isOpened && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                    <CheckCircle2 size={10} />
                                                    <span>Opened</span>
                                                </span>
                                            )}
                                            {unlocked ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <Unlock size={10} />
                                                    <span>Open</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 border border-slate-300">
                                                    <Lock size={10} />
                                                    <span>Locked</span>
                                                </span>
                                            )}

                                            {/* Small Lock Icon to Toggle/Unlock */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openUnlockModal(task.id, unlocked ? 'lock' : 'unlock');
                                                }}
                                                className="w-6 h-6 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-amber-700 transition-colors"
                                                title={unlocked ? 'Lock Task (Admin)' : 'Unlock Task (Admin)'}
                                            >
                                                {unlocked ? <Lock size={12} /> : <KeyRound size={12} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className={`text-xs mb-3 leading-relaxed ${unlocked ? 'text-slate-600' : 'text-slate-500'}`}>
                                        {task.desc}
                                    </p>

                                    {/* Topics Covered */}
                                    <div className="bg-white/90 rounded-lg p-2 border border-slate-200/80 mb-4">
                                        <span className="text-[10px] font-bold text-slate-600 block mb-1 uppercase tracking-wider">Tags & Attributes</span>
                                        <div className="flex flex-wrap gap-1">
                                            {task.topics.split(',').map(item => {
                                                const trimmed = item.trim();
                                                const isAttr = isHtmlAttribute(trimmed);
                                                return (
                                                    <span
                                                        key={trimmed}
                                                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                                                            isAttr
                                                                ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs'
                                                                : 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs'
                                                        }`}
                                                    >
                                                        {isAttr 
                                                            ? (trimmed === 'radio' || trimmed === 'checkbox' ? `type="${trimmed}"` : `${trimmed}=""`)
                                                            : `<${trimmed}>`
                                                        }
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer Action */}
                                <div className="px-5 pb-5 pt-0">
                                    {unlocked ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link 
                                                href={`/html/tasks/${task.id}`}
                                                onClick={() => recordTaskOpen(task.id)}
                                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200"
                                                title="View Task Demo Preview"
                                            >
                                                <Eye size={13} />
                                                <span>Preview</span>
                                            </Link>
                                            <Link 
                                                href={`/html/tasks/${task.id}/compiler`}
                                                onClick={() => recordTaskOpen(task.id)}
                                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-700 to-amber-700 hover:from-orange-800 hover:to-amber-800 shadow-sm hover:shadow transition-all"
                                                title="Code project in live compiler with AI evaluation"
                                            >
                                                <Code2 size={13} />
                                                <span>Compiler</span>
                                            </Link>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => openUnlockModal(task.id, 'unlock')}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-500 bg-slate-200/80 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer"
                                        >
                                            <Lock size={13} className="text-slate-600" />
                                            <span>Locked by Instructor (Tap to Unlock)</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* ── Admin Unlock Modal ── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div 
                        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                                    <Shield size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold">Admin Task Control</h3>
                                    <p className="text-[11px] text-slate-300">
                                        {modalAction === 'unlock' ? 'Unlock task for students' : 'Lock task'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <AdminTaskGate onSignIn={() => setShowLoginModal(true)}>
                            <form onSubmit={handleAdminSubmit} className="p-5 space-y-4">
                                <p className="text-xs text-slate-500">Signed in as administrator. Changes apply to all students.</p>
                                {errorMessage && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                                        <AlertCircle size={15} className="shrink-0 text-red-500" />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700">
                                        <CheckCircle2 size={15} className="shrink-0 text-emerald-500" />
                                        <span>{successMessage}</span>
                                    </div>
                                )}

                                {/* Target Selection */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Select Target Task
                                    </label>
                                    <select
                                        value={selectedTaskId}
                                        onChange={(e) => setSelectedTaskId(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="all">🌟 All Tasks ({TASKS.length} Tasks)</option>
                                        {TASKS.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                Task {t.id}: {t.title} {isTaskUnlocked(t.id) ? '✓ Unlocked' : '🔒 Locked'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Action Choice */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Action
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setModalAction('unlock')}
                                            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                                                modalAction === 'unlock'
                                                    ? 'bg-emerald-600 text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            <Unlock size={13} />
                                            <span>Unlock Task</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setModalAction('lock')}
                                            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                                                modalAction === 'lock'
                                                    ? 'bg-amber-600 text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            <Lock size={13} />
                                            <span>Lock Task</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="pt-2 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitLoading}
                                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-700 to-amber-700 hover:from-orange-800 hover:to-amber-800 transition-all shadow-md disabled:opacity-50 flex items-center gap-1.5"
                                    >
                                        {submitLoading ? (
                                            <>
                                                <RefreshCw size={13} className="animate-spin" />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <span>Confirm {modalAction === 'unlock' ? 'Unlock' : 'Lock'}</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </AdminTaskGate>
                    </div>
                </div>
            )}
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
}
