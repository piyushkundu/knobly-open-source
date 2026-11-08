'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from './useAdmin';
import {
    ArrowLeft, Home, Shield, Menu, X, RefreshCw, Loader2,
    LayoutDashboard, FileText, HelpCircle, BarChart3, Users, Medal, Package,
    Plus, Trash2, Pencil, ChevronRight, Trophy, Eye, Megaphone, Globe, PlayCircle,
    ArrowRight
} from 'lucide-react';

const NAV = [
    { header: 'Main' },
    { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { id: 'tests', label: 'Test Engine', Icon: FileText },
    { id: 'questions', label: 'Question Bank', Icon: HelpCircle },
    { id: 'results', label: 'Results & Monitoring', Icon: BarChart3 },
    { header: 'Management' },
    { id: 'users', label: 'User Directory', Icon: Users },
    { id: 'gamification', label: 'Levels & Badges', Icon: Medal },
    { id: 'resources', label: 'Apps, Videos & Notifs', Icon: Package },
];

const glass = { background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' };
const inputCls = "w-full bg-black/40 border border-white/10 text-white rounded px-3 py-2 text-xs focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/15 transition-all";

export default function AdminPage() {
    const a = useAdmin();

    // ─── ACCESS DENIED ───
    if (!a.isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#020617' }}>
                <div className="w-full max-w-sm p-8 rounded-2xl flex flex-col gap-6 relative overflow-hidden" style={glass}>
                    <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }} />
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                            <Shield size={28} style={{ color: '#f59e0b' }} />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-wider font-mono">SUPER ADMIN</h1>
                        <p className="text-xs text-gray-400 mt-1">Knobly Operating System</p>
                    </div>
                    <p className="text-center text-rose-400 text-sm">Access Denied — Admin Role Required</p>
                    <Link href="/" className="text-center text-amber-500 hover:text-amber-400 text-sm font-bold">← Back to Home</Link>
                </div>
            </div>
        );
    }

    const handleTabChange = (id: string) => {
        a.setActiveTab(id); a.setMobileMenu(false);
        if (id === 'results') a.loadResults();
        if (id === 'gamification') { a.cancelLevelEdit(); a.cancelBadgeEdit(); }
    };

    return (
        <div className="h-screen overflow-hidden flex flex-col relative" style={{ background: '#020617', color: '#e2e8f0', fontFamily: "'Outfit', sans-serif" }}>

            {/* ═══ MOBILE OVERLAY ═══ */}
            {a.mobileMenu && <div onClick={() => a.setMobileMenu(false)} className="fixed inset-0 z-20 md:hidden" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }} />}

            <div className="flex h-full relative">

                {/* ═══ SIDEBAR ═══ */}
                <aside className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col transition-transform duration-300 md:static md:translate-x-0 shrink-0 ${a.mobileMenu ? 'translate-x-0' : '-translate-x-full'}`} style={{ background: '#020617', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                    {/* Logo */}
                    <div className="p-5 flex items-center justify-between gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-black font-mono" style={{ background: 'linear-gradient(135deg, #fbbf24, #ea580c)' }}>K</div>
                            <div>
                                <div className="text-sm font-bold text-white tracking-wide">ADMIN OS</div>
                                <div className="text-[10px] text-gray-500">v6.1 Mobile Ready</div>
                            </div>
                        </div>
                        <button onClick={() => a.setMobileMenu(false)} className="md:hidden text-gray-400 hover:text-white"><X size={20} /></button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
                        {NAV.map((item: any, i) => item.header ? (
                            <div key={i} className="text-[10px] font-bold text-gray-500 uppercase px-3 mt-4 mb-1">{item.header}</div>
                        ) : (
                            <button key={item.id} onClick={() => handleTabChange(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${a.activeTab === item.id ? 'text-amber-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                style={a.activeTab === item.id ? { background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' } : { border: '1px solid transparent' }}>
                                <item.Icon size={16} /> {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* User */}
                    <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {a.user?.email?.substring(0, 2).toUpperCase() || 'AD'}
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-xs font-bold text-white truncate">{a.user?.email}</div>
                                <div className="text-[10px] text-amber-500 uppercase font-bold">Super Admin</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ═══ MAIN CONTENT ═══ */}
                <main className="flex-1 flex flex-col overflow-hidden w-full relative" style={{ background: '#020617' }}>

                    {/* Top bar */}
                    <header className="h-14 shrink-0 flex items-center justify-between px-4 md:px-6 z-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(8px)' }}>
                        <div className="flex items-center gap-3">
                            <button onClick={() => a.setMobileMenu(true)} className="md:hidden text-white p-1 -ml-2 mr-1"><Menu size={24} /></button>
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <ChevronRight size={14} className="text-gray-500 hidden md:inline" />
                                {NAV.find((n: any) => n.id === a.activeTab)?.label || 'Dashboard'}
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            {a.loading && <span className="text-xs text-amber-500 animate-pulse hidden md:flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> SYNCING...</span>}
                            <button onClick={a.refreshAll} className="w-8 h-8 rounded hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"><RefreshCw size={16} /></button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6">

                        {/* ══════════════ DASHBOARD ══════════════ */}
                        {a.activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                {a.pageError === 'PERMISSION_DENIED' && (
                                    <div className="p-4 rounded-xl mb-6 flex flex-col items-center justify-center text-center space-y-2 border" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                                        <div className="text-xl font-bold text-red-500 flex items-center gap-2">
                                            <Shield size={24} /> Missing Firebase Permissions
                                        </div>
                                        <p className="text-sm text-red-200 mt-2 max-w-2xl px-4">
                                            Your admin data (0 stats) is empty because Firestore Security Rules are blocking access.
                                            Please go to your <a href="https://console.firebase.google.com/" target="_blank" className="font-bold underline text-white">Firebase Console</a> → Firestore Database → Rules and paste the rules provided earlier.
                                        </p>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Total Users', val: a.stats.users, color: '#3b82f6' },
                                        { label: 'Total Tests', val: a.stats.tests, color: '#10b981' },
                                        { label: 'Questions', val: a.stats.questions, color: '#8b5cf6' },
                                        { label: 'Total Apps', val: a.stats.apps, color: '#f59e0b' },
                                    ].map(s => (
                                        <div key={s.label} className="p-4 rounded-xl" style={{ ...glass, borderLeft: `2px solid ${s.color}` }}>
                                            <div className="text-gray-400 text-[10px] font-bold uppercase mb-1">{s.label}</div>
                                            <div className="text-2xl font-bold text-white font-mono">{s.val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ══════════════ TESTS ══════════════ */}
                        {a.activeTab === 'tests' && (
                            <div className="flex flex-col lg:flex-row gap-6 h-full">
                                <div className="w-full lg:w-1/3 flex flex-col gap-3">
                                    <button onClick={a.resetTestForm} className="w-full py-3 rounded-xl border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-white text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                                        <Plus size={14} /> CREATE NEW TEST
                                    </button>
                                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[200px]">
                                        {a.tests.map((t: any) => (
                                            <div key={t.id} onClick={() => a.editTest(t)} className={`p-3 rounded-lg border cursor-pointer transition-all group relative ${a.currentTest.id === t.id ? 'border-amber-500/50' : 'border-white/5 hover:border-white/20'}`} style={{ background: a.currentTest.id === t.id ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.03)' }}>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-white text-xs truncate w-3/4">{t.title}</h4>
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase ${t.mode === 'LIVE' ? 'text-rose-400 border-rose-400/30' : 'text-emerald-400 border-emerald-400/30'}`}>{t.mode}</span>
                                                </div>
                                                <div className="text-[10px] text-gray-500 flex gap-2">
                                                    <span>{t.total_marks} Q</span> • <span>{t.duration_minutes}m</span>
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); a.deleteTest(t.id); }} className="absolute top-2 right-2 text-gray-600 hover:text-red-500 md:opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="w-full lg:w-2/3 rounded-xl p-4 md:p-6 overflow-y-auto" style={glass}>
                                    <div className="flex justify-between items-center mb-5 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2">{a.currentTest.id ? 'EDIT TEST' : 'NEW TEST'}</h3>
                                        {a.currentTest.id && <div className="text-[10px] text-gray-400 font-mono">ID: {a.currentTest.id}</div>}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Title</label>
                                                <input value={a.currentTest.title} onChange={e => a.setCurrentTest({ ...a.currentTest, title: e.target.value })} className={inputCls} />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Mode</label>
                                                <select value={a.currentTest.mode} onChange={e => a.setCurrentTest({ ...a.currentTest, mode: e.target.value })} className={inputCls}>
                                                    <option value="PRACTICE">PRACTICE</option>
                                                    <option value="LIVE">LIVE</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                                            <div><label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Mins</label><input type="number" value={a.currentTest.duration_minutes} onChange={e => a.setCurrentTest({ ...a.currentTest, duration_minutes: +e.target.value })} className={inputCls} /></div>
                                            <div><label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Questions</label><input type="number" value={a.currentTest.total_marks} onChange={e => a.setCurrentTest({ ...a.currentTest, total_marks: +e.target.value })} className={inputCls} /></div>
                                            <div><label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Total Points</label><input type="number" value={a.currentTest.xp_reward} onChange={e => a.setCurrentTest({ ...a.currentTest, xp_reward: +e.target.value })} className={inputCls} /></div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Category (Subject)</label>
                                            <input value={a.currentTest.category || ''} onChange={e => a.setCurrentTest({ ...a.currentTest, category: e.target.value })} className={inputCls} placeholder="e.g. IT Tools, Web Design, Python, IoT" />
                                        </div>
                                        {a.currentTest.mode === 'LIVE' && (
                                            <div className="p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}>
                                                <div><label className="text-[10px] font-bold uppercase block mb-1" style={{ color: 'rgba(245,158,11,0.8)' }}>Live Start</label><input type="datetime-local" value={a.currentTest.live_start} onChange={e => a.setCurrentTest({ ...a.currentTest, live_start: e.target.value })} className={inputCls} /></div>
                                                <div><label className="text-[10px] font-bold uppercase block mb-1" style={{ color: 'rgba(245,158,11,0.8)' }}>Live End</label><input type="datetime-local" value={a.currentTest.live_end} onChange={e => a.setCurrentTest({ ...a.currentTest, live_end: e.target.value })} className={inputCls} /></div>
                                            </div>
                                        )}
                                        <div className="pt-4 flex justify-end gap-3">
                                            {a.currentTest.id && <button onClick={a.resetTestForm} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white">CANCEL</button>}
                                            <button onClick={a.saveTest} disabled={a.saving} className="px-6 py-2 rounded text-xs font-bold flex items-center gap-2 disabled:opacity-50" style={{ background: '#059669', color: '#fff' }}>
                                                {a.saving && <Loader2 size={12} className="animate-spin" />} {a.currentTest.id ? 'UPDATE' : 'CREATE'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══════════════ QUESTIONS ══════════════ */}
                        {a.activeTab === 'questions' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4" style={glass}>
                                    <div className="flex items-center gap-4 flex-1">
                                        <HelpCircle size={24} style={{ color: '#f59e0b' }} />
                                        <select value={a.selectedTestId || ''} onChange={e => { a.setSelectedTestId(e.target.value || null); setTimeout(() => a.loadQuestions(e.target.value || undefined), 0); }} className={`${inputCls} md:w-96`}>
                                            <option value="">-- Select a Test --</option>
                                            {a.tests.map((t: any) => <option key={t.id} value={t.id}>{t.title}</option>)}
                                        </select>
                                    </div>
                                    {a.selectedTestId && (
                                        <div className="flex gap-2 w-full md:w-auto">
                                            <button onClick={a.openAddQ} className="flex-1 md:flex-none px-4 py-2 rounded text-xs font-bold" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.5)' }}>+ ADD</button>
                                            <button onClick={() => a.setImportMode(!a.importMode)} className="flex-1 md:flex-none px-4 py-2 rounded text-xs font-bold" style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.5)' }}>{a.importMode ? 'CLOSE IMPORT' : 'IMPORT'}</button>
                                        </div>
                                    )}
                                </div>

                                {a.importMode && a.selectedTestId && (
                                    <div className="p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6" style={{ ...glass, border: '1px solid rgba(59,130,246,0.3)' }}>
                                        <div>
                                            <h3 className="text-xs font-bold text-blue-400 uppercase mb-2">1. Paste Questions</h3>
                                            <textarea value={a.importText} onChange={e => a.setImportText(e.target.value)} className={`${inputCls} h-48 font-mono leading-relaxed`} placeholder="Paste formatted text here..." />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold text-emerald-400 uppercase mb-2">2. Format (A-D)</h3>
                                            <div className="p-3 rounded text-[10px] font-mono text-gray-300" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div style={{ color: '#f59e0b' }}>What is CPU?<br />A. Monitor<br />B. Processor*<br />C. Mouse<br />D. Keys</div>
                                                <ul className="list-disc ml-4 mt-2 space-y-1 text-gray-400"><li><code>*</code> = Correct Option</li><li>Empty line between Qs</li></ul>
                                            </div>
                                            <button onClick={a.parseAndImport} className="w-full mt-3 py-2.5 font-bold rounded text-xs text-white" style={{ background: '#2563eb' }}>PROCESS & IMPORT</button>
                                            <div className="h-20 rounded p-2 mt-2 overflow-y-auto text-[10px] font-mono text-emerald-400" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                {a.importLogs.map((log, i) => <div key={i}>&gt; {log}</div>)}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {a.selectedTestId && (
                                    <div className="rounded-xl overflow-hidden overflow-x-auto" style={glass}>
                                        <table className="w-full text-left text-sm min-w-[600px]">
                                            <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                <tr className="text-gray-400 text-xs uppercase">
                                                    <th className="p-3 w-10 text-center">#</th><th className="p-3">Question Text</th><th className="p-3 w-24">Type</th><th className="p-3 w-20 text-center">Points</th><th className="p-3 w-32 text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {a.questions.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-gray-500 text-xs">No questions found. Add or import some.</td></tr>}
                                                {a.questions.map((q: any, idx: number) => (
                                                    <tr key={q.id} className="hover:bg-white/5">
                                                        <td className="p-3 text-center text-gray-500">{idx + 1}</td>
                                                        <td className="p-3 truncate max-w-lg">{q.question_text}</td>
                                                        <td className="p-3 text-xs"><span className="px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>{q.question_type}</span></td>
                                                        <td className="p-3 text-center font-mono">1</td>
                                                        <td className="p-3 text-center flex justify-center gap-2">
                                                            <button onClick={() => a.editQuestion(q)} className="text-blue-400 hover:text-white"><Pencil size={14} /></button>
                                                            <button onClick={() => a.deleteQuestion(q.id)} className="text-red-400 hover:text-white"><Trash2 size={14} /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ══════════════ RESULTS ══════════════ */}
                        {a.activeTab === 'results' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl flex flex-col md:flex-row gap-3 md:items-center" style={glass}>
                                    <div className="text-xs font-bold text-amber-500 uppercase mr-2">Filters:</div>
                                    <select value={a.resultFilter.testId} onChange={e => a.setResultFilter({ ...a.resultFilter, testId: e.target.value })} className={`${inputCls} md:w-64`}>
                                        <option value="">All Tests</option>
                                        {a.tests.map((t: any) => <option key={t.id} value={t.id}>{t.title}</option>)}
                                    </select>
                                    <select value={a.resultFilter.userId} onChange={e => a.setResultFilter({ ...a.resultFilter, userId: e.target.value })} className={`${inputCls} md:w-64`}>
                                        <option value="">All Users</option>
                                        {a.users.map((u: any) => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                                    </select>
                                    <button onClick={() => a.loadResults()} className="px-4 py-2 rounded text-xs font-bold text-black flex items-center justify-center gap-2" style={{ background: '#d97706' }}>APPLY</button>
                                </div>
                                <div className="rounded-xl overflow-hidden min-h-[300px] overflow-x-auto" style={glass}>
                                    <table className="w-full text-left text-sm min-w-[700px]">
                                        <thead style={{ background: 'rgba(255,255,255,0.03)' }}><tr className="text-gray-400 text-xs uppercase"><th className="p-3">Student</th><th className="p-3">Test</th><th className="p-3 text-center">Points</th><th className="p-3 text-center">Acc %</th><th className="p-3 text-center">Earned</th><th className="p-3 text-center">Status</th><th className="p-3 text-center">Detail</th></tr></thead>
                                        <tbody className="divide-y divide-white/5">
                                            {a.results.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-500 text-xs">No results found.</td></tr>}
                                            {a.results.map((r: any) => (
                                                <tr key={r.id} className="hover:bg-white/5">
                                                    <td className="p-3 font-medium text-white">{a.getUserName(r.user_id)}</td>
                                                    <td className="p-3 text-xs text-gray-400">{a.getTestName(r.test_id)}</td>
                                                    <td className="p-3 text-center font-bold text-emerald-400">{r.score}</td>
                                                    <td className="p-3 text-center font-mono">{r.accuracy}%</td>
                                                    <td className="p-3 text-center text-amber-400">+{r.xp_earned || r.points_earned || 0} pts</td>
                                                    <td className="p-3 text-center"><span className={`text-[9px] uppercase px-2 py-0.5 rounded border ${r.status === 'COMPLETED' ? 'border-emerald-500/30 text-emerald-400' : 'border-blue-500/30 text-blue-400'}`}>{r.status}</span></td>
                                                    <td className="p-3 text-center"><button onClick={() => a.viewAttemptDetail(r)} className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>VIEW</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ══════════════ USERS ══════════════ */}
                        {a.activeTab === 'users' && (
                            <div className="space-y-4">
                                <input value={a.userSearch} onChange={e => a.setUserSearch(e.target.value)} placeholder="Search user by name or email..." className={`${inputCls} rounded-xl p-3`} />
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {a.filteredUsers.map((u: any) => (
                                        <div key={u.id} className="p-4 rounded-xl flex items-center justify-between" style={glass}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                                    {u.full_name ? u.full_name.substring(0, 2).toUpperCase() : 'UN'}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-white text-sm truncate">{u.full_name || 'No Name'}</div>
                                                    <div className="text-[10px] text-gray-500 truncate">{u.email}</div>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className="text-[9px] px-1 rounded" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>{u.exam_track}</span>
                                                        {u.role === 'admin' && <span className="text-[9px] px-1 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>ADMIN</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <button onClick={() => a.openUserProfile(u)} className="text-xs px-2 py-1 rounded" style={{ color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>PROFILE</button>
                                                {u.id !== a.user?.uid && <button onClick={() => a.deleteUser(u.id)} className="text-xs px-2 py-1 rounded" style={{ color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>DELETE</button>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ══════════════ GAMIFICATION ══════════════ */}
                        {a.activeTab === 'gamification' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* LEVELS */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider">Levels</h3>
                                        {a.editingLevelId && <div className="text-[10px] text-amber-400 animate-pulse">EDITING</div>}
                                    </div>
                                    <div className="p-4 rounded-xl space-y-3" style={{ ...glass, borderColor: a.editingLevelId ? 'rgba(245,158,11,0.5)' : undefined }}>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input value={a.levelForm.level_no} onChange={e => a.setLevelForm({ ...a.levelForm, level_no: e.target.value })} type="number" placeholder="Lvl No" className={inputCls} />
                                            <input value={a.levelForm.required_xp} onChange={e => a.setLevelForm({ ...a.levelForm, required_xp: e.target.value })} type="number" placeholder="Req Points" className={inputCls} />
                                            <input value={a.levelForm.title} onChange={e => a.setLevelForm({ ...a.levelForm, title: e.target.value })} placeholder="Title (e.g. Novice)" className={`${inputCls} col-span-2`} />
                                        </div>
                                        <div className="flex gap-2">
                                            {a.editingLevelId && <button onClick={a.cancelLevelEdit} className="w-1/3 py-2 rounded text-xs font-bold" style={{ background: '#374151', color: '#fff' }}>CANCEL</button>}
                                            <button onClick={a.saveLevel} className="flex-1 py-2 rounded text-xs font-bold text-black" style={{ background: '#d97706' }}>{a.editingLevelId ? 'UPDATE LEVEL' : 'ADD LEVEL'}</button>
                                        </div>
                                    </div>
                                    <div className="space-y-2 max-h-80 md:max-h-96 overflow-y-auto pr-2">
                                        {a.levels.map((l: any) => (
                                            <div key={l.id} className="p-3 rounded flex justify-between items-center text-xs group hover:border-amber-500/30 transition-colors" style={glass}>
                                                <div><span className="font-bold text-white">Lv {l.level_no}: {l.title}</span><div className="text-[10px] text-gray-500">{l.required_xp} Points required</div></div>
                                                <div className="flex gap-2 md:opacity-60 group-hover:opacity-100">
                                                    <button onClick={() => a.editLevel(l)} className="text-blue-400 hover:text-white p-1"><Pencil size={14} /></button>
                                                    <button onClick={() => a.deleteLevel(l.id)} className="text-red-400 hover:text-white p-1"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* BADGES */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider">Badges</h3>
                                        {a.editingBadgeId && <div className="text-[10px] text-emerald-400 animate-pulse">EDITING</div>}
                                    </div>
                                    <div className="p-4 rounded-xl space-y-3" style={{ ...glass, borderColor: a.editingBadgeId ? 'rgba(16,185,129,0.5)' : undefined }}>
                                        <input value={a.badgeForm.badge_name} onChange={e => a.setBadgeForm({ ...a.badgeForm, badge_name: e.target.value })} placeholder="Badge Name" className={inputCls} />
                                        <input value={a.badgeForm.badge_icon} onChange={e => a.setBadgeForm({ ...a.badgeForm, badge_icon: e.target.value })} placeholder="Icon Class (ph-medal)" className={inputCls} />
                                        <textarea value={a.badgeForm.description} onChange={e => a.setBadgeForm({ ...a.badgeForm, description: e.target.value })} placeholder="Description (Optional)" className={`${inputCls} h-16 resize-none`} />
                                        <div className="flex gap-2 items-center">
                                            <label className="text-[10px] text-gray-400">Points Reward:</label>
                                            <input value={a.badgeForm.xp_reward} onChange={e => a.setBadgeForm({ ...a.badgeForm, xp_reward: e.target.value })} type="number" placeholder="0" className={`${inputCls} flex-1`} />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            {a.editingBadgeId && <button onClick={a.cancelBadgeEdit} className="w-1/3 py-2 rounded text-xs font-bold" style={{ background: '#374151', color: '#fff' }}>CANCEL</button>}
                                            <button onClick={a.saveBadge} className="flex-1 py-2 rounded text-xs font-bold text-white" style={{ background: '#059669' }}>{a.editingBadgeId ? 'UPDATE BADGE' : 'ADD BADGE'}</button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 max-h-80 md:max-h-96 overflow-y-auto pr-2">
                                        {a.badges.length === 0 && <div className="col-span-2 text-center text-xs text-gray-500 p-4">No badges found.</div>}
                                        {a.badges.map((b: any) => (
                                            <div key={b.id} onClick={() => a.editBadge(b)} className="p-3 rounded flex flex-col gap-1 relative group cursor-pointer hover:bg-white/10 transition-colors" style={{ ...glass, border: '1px solid transparent' }}>
                                                <div className="flex items-start justify-between">
                                                    <Medal size={20} className="text-emerald-400" />
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}>+{b.xp_reward} pts</span>
                                                </div>
                                                <div className="font-bold text-xs text-white mt-1 truncate">{b.badge_name}</div>
                                                <div className="text-[10px] text-gray-400 leading-tight line-clamp-2 h-8">{b.description || 'No description'}</div>
                                                <button onClick={(e) => { e.stopPropagation(); a.deleteBadge(b.id); }} className="absolute top-2 right-2 text-red-500 md:opacity-0 group-hover:opacity-100 hover:bg-red-500/20 p-1 rounded transition-all"><Trash2 size={12} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══════════════ RESOURCES ══════════════ */}
                        {a.activeTab === 'resources' && (
                            <div className="space-y-6">
                                {/* Notifications */}
                                <div className="p-5 rounded-xl" style={{ ...glass, border: '1px solid rgba(14,165,233,0.2)' }}>
                                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#38bdf8' }}><Megaphone size={16} /> Broadcast Notification</h3>
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <input value={a.notifMsg} onChange={e => a.setNotifMsg(e.target.value)} placeholder="Write message..." className={`${inputCls} w-full md:flex-1`} />
                                        <div className="flex gap-3 shrink-0">
                                            <input value={a.notifLink} onChange={e => a.setNotifLink(e.target.value)} placeholder="Link (Optional)" className={`${inputCls} w-48`} />
                                            <button onClick={a.sendNotification} className="px-6 py-2 rounded text-xs font-bold text-white" style={{ background: '#0284c7' }}>SEND</button>
                                        </div>
                                    </div>
                                    <div className="mt-4 max-h-40 overflow-y-auto">
                                        {a.notifications.length === 0 && <div className="text-xs text-gray-500 italic">No active notifications.</div>}
                                        {a.notifications.map((n: any) => (
                                            <div key={n.id} className="flex justify-between items-center p-2 hover:bg-white/5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div className="text-xs text-white break-words pr-2">{n.message} {n.link && <span className="text-blue-400 text-[10px]">({n.link})</span>}</div>
                                                <button onClick={() => a.deleteNotification(n.id)} className="text-red-400 text-xs hover:text-white shrink-0">Delete</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Apps */}
                                <div className="p-5 rounded-xl" style={glass}>
                                    <h3 className="text-sm font-bold text-white mb-3">Global Apps</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                        <input value={a.appForm.name} onChange={e => a.setAppForm({ ...a.appForm, name: e.target.value })} placeholder="App Name" className={inputCls} />
                                        <input value={a.appForm.link} onChange={e => a.setAppForm({ ...a.appForm, link: e.target.value })} placeholder="URL" className={`${inputCls} md:col-span-2`} />
                                        <input value={a.appForm.icon} onChange={e => a.setAppForm({ ...a.appForm, icon: e.target.value })} placeholder="Icon (ph-globe)" className={inputCls} />
                                    </div>
                                    <button onClick={a.deployApp} className="mt-3 px-4 py-2 rounded text-xs font-bold text-black" style={{ background: '#d97706' }}>DEPLOY</button>
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        {a.apps.map((app: any) => (
                                            <div key={app.id} className="rounded px-3 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                <Globe size={14} className="text-amber-500" />
                                                <span className="text-xs text-white">{app.name}</span>
                                                <button onClick={() => a.deleteApp(app.id)} className="text-red-400 ml-2 hover:text-white"><X size={12} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Videos */}
                                <div className="p-5 rounded-xl" style={glass}>
                                    <h3 className="text-sm font-bold text-white mb-3">YouTube Videos</h3>
                                    <div className="flex gap-3">
                                        <input value={a.videoForm.id} onChange={e => a.setVideoForm({ ...a.videoForm, id: e.target.value })} placeholder="Video ID" className={`${inputCls} w-32`} />
                                        <input value={a.videoForm.title} onChange={e => a.setVideoForm({ ...a.videoForm, title: e.target.value })} placeholder="Video Title" className={`${inputCls} flex-1`} />
                                        <button onClick={a.publishVideo} className="px-4 py-2 rounded text-xs font-bold text-white" style={{ background: '#dc2626' }}>PUBLISH</button>
                                    </div>
                                    <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                                        {a.videos.map((v: any) => (
                                            <div key={v.id} className="flex items-center gap-3 p-2 rounded hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                {v.youtube_id && <img src={`https://img.youtube.com/vi/${v.youtube_id}/default.jpg`} className="w-12 h-9 object-cover rounded" alt="" />}
                                                <div className="flex-1 min-w-0 text-xs text-white truncate">{v.title}</div>
                                                <button onClick={() => a.deleteVideo(v.id)} className="text-red-500 p-2"><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>

            {/* ═══ MODALS ═══ */}

            {/* Attempt Detail Modal */}
            {a.showAttemptModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
                    <div className="w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto relative" style={glass}>
                        <button onClick={() => a.setShowAttemptModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
                        <h3 className="text-lg font-bold text-white mb-1">Attempt Analysis</h3>
                        <div className="text-xs text-gray-400 mb-4">User: {a.attemptDetail.userName} | Test: {a.attemptDetail.testTitle}</div>
                        <div className="space-y-4">
                            {a.attemptDetail.questions.map((q: any, i: number) => (
                                <div key={i} className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="text-sm font-bold text-white mb-2">{i + 1}. {q.text}</div>
                                    <div className="space-y-1 ml-4">
                                        {q.options.map((opt: any) => (
                                            <div key={opt.id} className={`text-xs p-1 rounded ${opt.is_correct ? 'text-emerald-400' : q.userSelected === opt.id ? 'text-red-400' : 'text-gray-400'}`}
                                                style={opt.is_correct ? { background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)' } : q.userSelected === opt.id ? { background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)' } : {}}>
                                                {q.userSelected === opt.id ? '● ' : '○ '}{opt.option_text}
                                                {opt.is_correct && <span className="ml-2 font-bold text-[9px] uppercase">Correct</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {a.attemptDetail.questions.length === 0 && <div className="text-center text-gray-500 text-xs">No response data found.</div>}
                        </div>
                    </div>
                </div>
            )}

            {/* Question Modal */}
            {a.showQModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
                    <div className="w-full max-w-lg rounded-xl p-5 max-h-[90vh] overflow-y-auto" style={{ ...glass, border: '1px solid rgba(245,158,11,0.2)' }}>
                        <h3 className="text-sm font-bold text-white mb-4">{a.qForm.id ? 'EDIT QUESTION' : 'ADD NEW QUESTION'}</h3>
                        <div className="space-y-3">
                            <textarea value={a.qForm.text} onChange={e => a.setQForm({ ...a.qForm, text: e.target.value })} className={inputCls} rows={3} placeholder="Question text..." />
                            <div className="grid grid-cols-3 gap-2">
                                <select value={a.qForm.type} onChange={e => a.setQForm({ ...a.qForm, type: e.target.value })} className={inputCls}><option value="MCQ">MCQ</option><option value="TF">True/False</option><option value="SHORT">Short Answer</option></select>
                                <input value={a.qForm.marks} onChange={e => a.setQForm({ ...a.qForm, marks: +e.target.value })} type="number" className={inputCls} placeholder="Marks" />
                                <select value={a.qForm.difficulty} onChange={e => a.setQForm({ ...a.qForm, difficulty: e.target.value })} className={inputCls}><option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option></select>
                            </div>
                            {a.qForm.type !== 'SHORT' && (
                                <div className="p-3 rounded space-y-2" style={{ background: 'rgba(0,0,0,0.2)' }}>
                                    <div className="text-[10px] text-gray-500 uppercase font-bold">Options</div>
                                    {a.qForm.options.map((opt: any, idx: number) => (
                                        <div key={idx} className="flex gap-2 items-center">
                                            <input type="radio" name="correctOpt" checked={opt.is_correct} onChange={() => {
                                                const newOpts = a.qForm.options.map((o: any, i: number) => ({ ...o, is_correct: i === idx }));
                                                a.setQForm({ ...a.qForm, options: newOpts });
                                            }} className="accent-emerald-500" />
                                            <input value={opt.text} onChange={e => {
                                                const newOpts = [...a.qForm.options]; newOpts[idx] = { ...newOpts[idx], text: e.target.value };
                                                a.setQForm({ ...a.qForm, options: newOpts });
                                            }} className={`${inputCls} flex-1`} placeholder="Option text" />
                                            <button onClick={() => { const newOpts = a.qForm.options.filter((_: any, i: number) => i !== idx); a.setQForm({ ...a.qForm, options: newOpts }); }} className="text-red-400"><X size={14} /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => a.setQForm({ ...a.qForm, options: [...a.qForm.options, { text: '', is_correct: false }] })} className="text-xs text-blue-400 font-bold">+ Add Option</button>
                                </div>
                            )}
                            <div className="flex justify-end gap-3 mt-4">
                                <button onClick={() => a.setShowQModal(false)} className="px-4 py-2 text-xs font-bold text-gray-400">CANCEL</button>
                                <button onClick={a.saveQuestion} className="px-4 py-2 rounded text-xs font-bold text-white" style={{ background: '#059669' }}>SAVE</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* User Profile Modal */}
            {a.showProfileModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
                    <div className="w-full max-w-md rounded-xl p-6 relative" style={{ ...glass, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <button onClick={() => a.setShowProfileModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
                                {a.currentProfile.full_name?.substring(0, 1)}
                            </div>
                            <h3 className="text-xl font-bold text-white">{a.currentProfile.full_name}</h3>
                            <div className="text-xs text-gray-400 font-mono">{a.currentProfile.email}</div>
                            <div className="mt-2 text-amber-500 font-bold">{a.currentProfile.total_xp || 0} Points</div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">Badges</div>
                                <div className="flex flex-wrap gap-2">
                                    {a.currentProfile.badges?.map((b: string, i: number) => (
                                        <div key={i} className="px-2 py-1 rounded text-[10px] text-emerald-400" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>{b}</div>
                                    ))}
                                    {(!a.currentProfile.badges || a.currentProfile.badges.length === 0) && <div className="text-xs text-gray-600">No badges earned yet.</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
