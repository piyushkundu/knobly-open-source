'use client';
import { useState } from 'react';
import { useSuperAdmin } from './useSuperAdmin';
import { adminFetch } from '@/lib/admin-fetch';
import {
    LayoutDashboard, FlaskConical, HelpCircle, BarChart3, Users, Medal, Bell,
    Plus, Trash2, Pencil, Play, Lock, X, Eye, RefreshCw, Upload, Send,
    Globe, Youtube, ChevronRight, LogOut, Shield, Loader2, Search, Save, Crown, Menu, FolderOpen, Check
} from 'lucide-react';

const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} />, color: '#6366f1' },
    { id: 'tests', label: 'Test Engine', icon: <FlaskConical size={15} />, color: '#8b5cf6' },
    { id: 'questions', label: 'Questions', icon: <HelpCircle size={15} />, color: '#06b6d4' },
    { id: 'results', label: 'Results', icon: <BarChart3 size={15} />, color: '#10b981' },
    { id: 'users', label: 'Users', icon: <Users size={15} />, color: '#f59e0b' },
    { id: 'gamification', label: 'Levels & Badges', icon: <Medal size={15} />, color: '#ec4899' },
    { id: 'resources', label: 'Resources', icon: <Bell size={15} />, color: '#ef4444' },
    { id: 'categories', label: 'Categories', icon: <FolderOpen size={15} />, color: '#0ea5e9' },
];

const inp = "w-full p-2.5 rounded-xl text-sm bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition shadow-sm";
const card = "bg-white rounded-2xl border border-gray-100 shadow-sm";
const btn = "px-4 py-2 rounded-xl text-xs font-bold transition-all";

export default function SuperAdminPage() {
    const d = useSuperAdmin();
    const [tab, setTab] = useState('dashboard');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [sideOpen, setSideOpen] = useState(false);

    const emptyTest = { id: null as any, title: '', mode: 'PRACTICE', duration_minutes: 30, total_marks: 20, xp_reward: 100, live_start: '', live_end: '', is_active: true, category: '', level_id: '' };
    const [testForm, setTestForm] = useState(emptyTest);
    const [saving, setSaving] = useState(false);
    const [selTestId, setSelTestId] = useState('');
    const [showQModal, setShowQModal] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);
    const [loadingPreviewId, setLoadingPreviewId] = useState<string | null>(null);
    const [aiFeedback, setAiFeedback] = useState<any>({});
    const [verifyingTest, setVerifyingTest] = useState(false);
    const [qForm, setQForm] = useState({ id: null as any, text: '', type: 'MCQ', marks: 1, difficulty: 'EASY', options: [{ text: '', is_correct: false }, { text: '', is_correct: false }] });
    const [importMode, setImportMode] = useState(false);
    const [importText, setImportText] = useState('');
    const [importLog, setImportLog] = useState('');
    const [aiGenerating, setAiGenerating] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [aiCount, setAiCount] = useState(5);
    const [resTestId, setResTestId] = useState('');
    const [resUserId, setResUserId] = useState('');
    const [attemptDetail, setAttemptDetail] = useState<any>(null);
    const [userSearch, setUserSearch] = useState('');
    const [profileModal, setProfileModal] = useState<any>(null);
    const [levelForm, setLevelForm] = useState({ level_no: '', required_xp: '', title: '' });
    const [editLevelId, setEditLevelId] = useState<string | null>(null);
    const [badgeForm, setBadgeForm] = useState({ badge_name: '', badge_icon: '', xp_reward: '', description: '' });
    const [editBadgeId, setEditBadgeId] = useState<string | null>(null);
    const [notifMsg, setNotifMsg] = useState('');
    const [notifLink, setNotifLink] = useState('');
    const [appForm, setAppForm] = useState({ name: '', link: '', icon: '' });
    const [videoForm, setVideoForm] = useState({ id: '', title: '' });
    const [catForm, setCatForm] = useState({ name: '', emoji: '\ud83d\udcda', color: '#6366f1', bgColor: '#eef2ff', textColor: '#4f46e5' });
    const [editCatId, setEditCatId] = useState<string | null>(null);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [editingPointsId, setEditingPointsId] = useState<string | null>(null);
    const [editingPointsVal, setEditingPointsVal] = useState('');
    const [resultsView, setResultsView] = useState<'attempts' | 'analytics'>('attempts');
    const [analyticsData, setAnalyticsData] = useState<any[]>([]);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);

    // Build dynamic catColors from Firestore categories
    const catColors: Record<string, string> = {};
    d.categories.forEach((c: any) => { catColors[c.name] = c.color || '#94a3b8'; });

    // ── LOGIN SCREEN ──
    if (!d.user || !d.isAdmin) return (
        <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #c7d2fe 100%)' }}>
            <div className={`${card} w-full max-w-sm p-8 relative overflow-hidden shadow-2xl`}>
                <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)' }} />
                <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <Shield size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-wide">SUPER ADMIN</h1>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Knobly Web Control Panel</p>
                </div>
                <form onSubmit={e => { e.preventDefault(); d.login(loginEmail, loginPass); }} className="flex flex-col gap-3">
                    <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} type="email" required className={inp} placeholder="Admin Email" />
                    <input value={loginPass} onChange={e => setLoginPass(e.target.value)} type="password" required className={inp} placeholder="Password" />
                    {d.authError && <div className="text-red-600 text-xs text-center bg-red-50 p-2 rounded-xl border border-red-200">{d.authError}</div>}
                    <button type="submit" disabled={d.loading} className="text-white font-bold py-3 rounded-xl text-sm mt-2 transition-all hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        {d.loading ? 'Authenticating...' : 'Access Panel'}
                    </button>
                </form>
            </div>
        </div>
    );

    const filteredUsers = userSearch ? d.users.filter(u => (u.full_name || '').toLowerCase().includes(userSearch.toLowerCase()) || (u.email || '').toLowerCase().includes(userSearch.toLowerCase())) : d.users;

    // ── MAIN LAYOUT ──
    return (
        <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#f4f6fa' }}>
            <div className="flex flex-1 overflow-hidden relative">
                {sideOpen && <div className="fixed inset-0 bg-black/40 z-20 md:hidden backdrop-blur-sm" onClick={() => setSideOpen(false)} />}

                {/* ── SIDEBAR ── */}
                <aside className={`fixed inset-y-0 left-0 z-30 w-60 bg-white border-r border-gray-100 flex flex-col transition-transform md:static md:translate-x-0 shadow-lg md:shadow-none ${sideOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>K</div>
                            <div><div className="text-sm font-black text-gray-900">Super Admin</div><div className="text-[9px] text-gray-400 font-semibold">Knobly Web v7.0</div></div>
                        </div>
                        <button onClick={() => setSideOpen(false)} className="md:hidden text-gray-400 hover:text-gray-900"><X size={18} /></button>
                    </div>
                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        {TABS.map(t => (
                            <button key={t.id} onClick={() => { setTab(t.id); setSideOpen(false); if (t.id === 'results') d.loadResults(); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${tab === t.id ? 'shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                                style={tab === t.id ? { background: t.color, color: '#ffffff' } : {}}>
                                {t.icon} {t.label}
                            </button>
                        ))}
                    </nav>
                    <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                {d.user?.email?.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="overflow-hidden flex-1"><div className="text-[10px] font-bold text-gray-900 truncate">{d.user?.email}</div><div className="text-[9px] text-indigo-500 font-bold">Super Admin</div></div>
                        </div>
                        <button onClick={d.logout} className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-[10px] font-bold rounded-lg border border-red-200 flex items-center justify-center gap-1 transition">
                            <LogOut size={11} /> Logout
                        </button>
                    </div>
                </aside>

                {/* ── MAIN ── */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    <header className="h-14 shrink-0 border-b border-gray-100 flex items-center justify-between px-4 bg-white shadow-sm">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSideOpen(true)} className="md:hidden text-gray-500"><Menu size={20} /></button>
                            <div className="h-7 w-7 rounded-lg flex items-center justify-center text-white" style={{ background: TABS.find(t => t.id === tab)?.color }}>{TABS.find(t => t.id === tab)?.icon}</div>
                            <h2 className="text-sm font-black text-gray-900">{TABS.find(t => t.id === tab)?.label}</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            {d.syncing && <span className="text-[10px] text-indigo-500 flex items-center gap-1"><Loader2 size={11} className="animate-spin" />Syncing...</span>}
                            <button onClick={d.refreshAll} className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition"><RefreshCw size={14} /></button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-4 md:p-5">

                        {/* ═══ DASHBOARD ═══ */}
                        {tab === 'dashboard' && (
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Total Users', value: d.stats.users, color: '#6366f1', bg: '#eef2ff', icon: <Users size={18} /> },
                                        { label: 'Total Tests', value: d.stats.tests, color: '#10b981', bg: '#ecfdf5', icon: <FlaskConical size={18} /> },
                                        { label: 'Questions', value: d.stats.questions, color: '#8b5cf6', bg: '#f5f3ff', icon: <HelpCircle size={18} /> },
                                        { label: 'Total Apps', value: d.stats.apps, color: '#f59e0b', bg: '#fffbeb', icon: <Globe size={18} /> },
                                    ].map((s, i) => (
                                        <div key={i} className={`${card} p-5 flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5`}>
                                            <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                                            <div><div className="text-2xl font-black text-gray-900">{s.value}</div><div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</div></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Leaderboard */}
                                <div className={`${card} rounded-2xl overflow-hidden`}>
                                    <div className="p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', borderBottom: '1px solid #fde68a' }}>
                                        <h3 className="text-sm font-black flex items-center gap-2" style={{ color: '#92400e' }}>
                                            <Crown size={16} style={{ color: '#f59e0b' }} /> Leaderboard — {d.leaderboard.length} Users
                                        </h3>
                                        <span className="text-[9px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>🏆 POINT RANKINGS</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm min-w-[700px]">
                                            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase border-b border-gray-100">
                                                <tr><th className="p-3 w-14 text-center">Rank</th><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3 text-center">Points</th><th className="p-3 text-center">Level</th><th className="p-3 w-28 text-center">Action</th></tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {d.leaderboard.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400 text-xs">No users in leaderboard.</td></tr>}
                                                {d.leaderboard.map((row: any) => (
                                                    <tr key={row.id} className="hover:bg-gray-50/50 transition group">
                                                        <td className="p-3 text-center">
                                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black mx-auto ${row.rank === 1 ? 'text-white' : row.rank === 2 ? 'text-white' : row.rank === 3 ? 'text-white' : 'bg-gray-100 text-gray-500'}`}
                                                                style={row.rank === 1 ? { background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' } : row.rank === 2 ? { background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)' } : row.rank === 3 ? { background: 'linear-gradient(135deg, #f59e0b, #b45309)' } : {}}>
                                                                {row.rank <= 3 ? <Crown size={12} /> : row.rank}
                                                            </div>
                                                        </td>
                                                        <td className="p-3 font-bold text-gray-900 text-xs">{row.full_name}</td>
                                                        <td className="p-3 text-[11px] text-gray-400">{row.email}</td>
                                                        <td className="p-3 text-center">
                                                            {editingPointsId === row.id ? (
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <input
                                                                        type="number"
                                                                        value={editingPointsVal}
                                                                        onChange={e => setEditingPointsVal(e.target.value)}
                                                                        className="w-16 text-center text-xs font-bold border border-amber-300 rounded-lg px-1 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50 text-amber-700"
                                                                        autoFocus
                                                                        onKeyDown={e => {
                                                                            if (e.key === 'Enter') { d.updateLeaderboardPoints(row.id, row.stateDocId, parseInt(editingPointsVal) || 0); setEditingPointsId(null); }
                                                                            if (e.key === 'Escape') setEditingPointsId(null);
                                                                        }}
                                                                    />
                                                                    <button onClick={() => { d.updateLeaderboardPoints(row.id, row.stateDocId, parseInt(editingPointsVal) || 0); setEditingPointsId(null); }}
                                                                        className="text-emerald-500 hover:text-emerald-700 p-0.5"><Check size={14} /></button>
                                                                    <button onClick={() => setEditingPointsId(null)}
                                                                        className="text-gray-400 hover:text-red-500 p-0.5"><X size={14} /></button>
                                                                </div>
                                                            ) : (
                                                                <button onClick={() => { setEditingPointsId(row.id); setEditingPointsVal(String(row.total_xp || 0)); }}
                                                                    className="font-black text-amber-600 hover:bg-amber-50 hover:text-amber-700 px-2 py-0.5 rounded-lg transition cursor-pointer inline-flex items-center gap-1 group/pts"
                                                                    title="Click to edit points">
                                                                    {row.total_xp}
                                                                    <Pencil size={10} className="opacity-0 group-hover/pts:opacity-60 transition" />
                                                                </button>
                                                            )}
                                                        </td>
                                                        <td className="p-3 text-center"><span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold">Lv {row.current_level}</span></td>
                                                        <td className="p-3 text-center">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                {row.id === d.user?.uid && <span className="text-[8px] bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full font-bold border border-indigo-200">YOU</span>}
                                                                <button onClick={() => { if (confirm(`Delete ${row.full_name}? This removes profile, points data, and badges.`)) d.deleteLeaderboardUser(row.id, row.stateDocId); }}
                                                                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg opacity-40 group-hover:opacity-100 transition">
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══ TESTS ═══ */}
                        {tab === 'tests' && (
                            <div className="flex flex-col lg:flex-row gap-5 h-full">
                                <div className="w-full lg:w-1/3 flex flex-col gap-2">
                                    <button onClick={() => setTestForm(emptyTest)} className="w-full py-3.5 rounded-2xl border-2 border-dashed transition-all hover:shadow-md hover:scale-[1.01] text-xs font-bold flex items-center justify-center gap-2 bg-white" style={{ borderColor: '#c7d2fe', color: '#6366f1' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#6366f1'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.borderColor = '#c7d2fe'; }}>
                                        <Plus size={14} /> Create New Test
                                    </button>
                                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[65vh]">
                                        {d.tests.map(t => {
                                            const catColor = catColors[t.category] || '#94a3b8';
                                            return (
                                                <div key={t.id} onClick={() => setTestForm({ ...t, level_id: t.level_id || '' })} className={`${card} overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01] relative ${testForm.id === t.id ? 'ring-2 ring-indigo-500 shadow-lg' : ''}`}>
                                                    {/* Left accent bar */}
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: catColor }} />
                                                    <div className="p-3.5 pl-4">
                                                        <div className="flex justify-between items-start mb-1.5">
                                                            <h4 className="font-black text-gray-900 text-xs truncate pr-16">{t.title}</h4>
                                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                                <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold ${t.mode === 'LIVE' ? 'text-white' : 'bg-emerald-50 text-emerald-600'}`} style={t.mode === 'LIVE' ? { background: 'linear-gradient(135deg, #ef4444, #dc2626)' } : {}}>{t.mode}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 font-semibold mb-1.5">{t.duration_minutes} min • {t.total_marks} Q • {t.xp_reward} pts</div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex gap-1.5 flex-wrap">
                                                                {t.category && <span className="text-[8px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${catColor}15`, color: catColor, border: `1px solid ${catColor}30` }}>{t.category}</span>}
                                                                <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold ${t.is_active ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>{t.is_active ? '● Active' : '○ Hidden'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <button onClick={async (e) => { e.stopPropagation(); setLoadingPreviewId(t.id); const qs = await d.getTestPreviewData(t.id); setPreviewData({ test: t, questions: qs }); setLoadingPreviewId(null); }} className="text-blue-400 hover:text-white hover:bg-blue-500 p-1.5 rounded-lg transition-all" title="Preview Test">
                                                                    {loadingPreviewId === t.id ? <Loader2 size={13} className="animate-spin" /> : <Eye size={13} />}
                                                                </button>
                                                                <button onClick={e => { e.stopPropagation(); if (confirm(`Delete "${t.title}"?`)) d.deleteTest(t.id); }} className="text-red-400 hover:text-white hover:bg-red-500 p-1.5 rounded-lg transition-all" title="Delete Test"><Trash2 size={13} /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className={`w-full lg:w-2/3 ${card} p-5 overflow-y-auto rounded-2xl`}>
                                    <div className="flex items-center gap-3 mb-5 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}><Pencil size={14} /></div>
                                        <h3 className="text-sm font-black text-gray-900">{testForm.id ? 'Edit Test' : 'New Test'}</h3>
                                        {testForm.id && <span className="text-[8px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold border border-amber-200">EDITING</span>}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="md:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Test Title</label><input value={testForm.title} onChange={e => setTestForm({ ...testForm, title: e.target.value })} className={inp} placeholder="e.g. Chapter 6: Python Basics Test" /></div>
                                            <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Mode</label><select value={testForm.mode} onChange={e => setTestForm({ ...testForm, mode: e.target.value })} className={inp}><option value="PRACTICE">PRACTICE</option><option value="LIVE">LIVE</option></select></div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">📂 Category (Dashboard Filter)</label>
                                                <select value={testForm.category || ''} onChange={e => setTestForm({ ...testForm, category: e.target.value })} className={inp}>
                                                    <option value="">-- Select Category --</option>
                                                    {d.categories.map((c: any) => (
                                                        <option key={c.id} value={c.name}>{c.emoji} {c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">📊 Assign to Level</label>
                                                <select value={testForm.level_id || ''} onChange={e => setTestForm({ ...testForm, level_id: e.target.value })} className={inp}>
                                                    <option value="">No Level (Always visible)</option>
                                                    {d.levels.map((l: any) => <option key={l.id} value={l.id}>Lv {l.level_no}: {l.title}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">⏱ Duration (Min)</label><input value={testForm.duration_minutes} onChange={e => setTestForm({ ...testForm, duration_minutes: Number(e.target.value) })} type="number" className={inp} /></div>
                                            <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">📝 Total Questions</label><input value={testForm.total_marks} onChange={e => setTestForm({ ...testForm, total_marks: Number(e.target.value) })} type="number" className={inp} /></div>
                                            <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">⭐ Total Points</label><input value={testForm.xp_reward} onChange={e => setTestForm({ ...testForm, xp_reward: Number(e.target.value) })} type="number" className={inp} /></div>
                                        </div>
                                        <div className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                            <span className="text-xs mt-0.5">💡</span>
                                            <p className="text-[10px] font-medium" style={{ color: '#166534' }}>Points per question = Total Points ÷ Total Questions. Example: 100 pts ÷ 20 Q = 5 pts per correct answer.</p>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: testForm.is_active ? '#ecfdf5' : '#f9fafb', border: `1px solid ${testForm.is_active ? '#a7f3d0' : '#e5e7eb'}` }}>
                                            <label className="text-[10px] font-bold uppercase" style={{ color: testForm.is_active ? '#059669' : '#9ca3af' }}>Show on Dashboard</label>
                                            <button onClick={() => setTestForm({ ...testForm, is_active: !testForm.is_active })} className={`w-10 h-5 rounded-full transition-all relative ${testForm.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${testForm.is_active ? 'right-0.5' : 'left-0.5'}`} />
                                            </button>
                                            <span className={`text-[10px] font-bold ${testForm.is_active ? 'text-emerald-600' : 'text-gray-400'}`}>{testForm.is_active ? '● Active' : '○ Hidden'}</span>
                                        </div>
                                        {testForm.mode === 'LIVE' && (
                                            <div className="p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-3" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                                                <div><label className="text-[10px] font-bold text-amber-600 uppercase block mb-1">🔴 Live Start</label><input value={testForm.live_start || ''} onChange={e => setTestForm({ ...testForm, live_start: e.target.value })} type="datetime-local" className={inp} /></div>
                                                <div><label className="text-[10px] font-bold text-amber-600 uppercase block mb-1">🔴 Live End</label><input value={testForm.live_end || ''} onChange={e => setTestForm({ ...testForm, live_end: e.target.value })} type="datetime-local" className={inp} /></div>
                                            </div>
                                        )}
                                        <div className="flex justify-end gap-3 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
                                            {testForm.id && <button onClick={() => setTestForm(emptyTest)} className={`${btn} bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900`}>Cancel</button>}
                                            {testForm.id && <button onClick={() => { if (confirm(`Delete "${testForm.title}"?`)) { d.deleteTest(testForm.id); setTestForm(emptyTest); } }} className={`${btn} bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-200`}>Delete Test</button>}
                                            <button onClick={async () => { setSaving(true); await d.saveTest(testForm); setTestForm(emptyTest); setSaving(false); }} disabled={saving} className={`${btn} flex items-center gap-2 shadow-lg`} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff' }}>
                                                {saving && <Loader2 size={12} className="animate-spin" />} {testForm.id ? '✓ Update Test' : '+ Create Test'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══ QUESTIONS ═══ */}
                        {tab === 'questions' && (
                            <div className="space-y-4">
                                <div className={`${card} p-4 flex flex-col md:flex-row md:items-center gap-3`}>
                                    <select value={selTestId} onChange={e => { setSelTestId(e.target.value); if (e.target.value) d.loadQuestions(e.target.value); }} className={`${inp} md:w-96`}>
                                        <option value="">-- Select a Test --</option>
                                        {d.tests.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                                    </select>
                                    {selTestId && <>
                                        <button onClick={() => { setQForm({ id: null, text: '', type: 'MCQ', marks: 1, difficulty: 'EASY', options: [{ text: '', is_correct: false }, { text: '', is_correct: false }] }); setShowQModal(true); }} className={`${btn} bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100`}><Plus size={12} className="inline mr-1" />Add</button>
                                        <button onClick={() => setImportMode(!importMode)} className={`${btn} bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100`}><Upload size={12} className="inline mr-1" />{importMode ? 'Close' : 'Import'}</button>
                                        <button onClick={async (e) => {
                                            const el = e.currentTarget;
                                            el.disabled = true;
                                            el.textContent = '⏳ Deleting...';
                                            const result = await d.deleteAllQuestions(selTestId);
                                            el.disabled = false;
                                            if (result?.startsWith('ok:')) {
                                                const count = result.split(':')[1];
                                                el.textContent = `✅ Deleted ${count} Qs`;
                                                setTimeout(() => { el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;margin-right:4px"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>Delete All'; }, 3000);
                                            } else if (result === 'empty') {
                                                el.textContent = '📭 No questions';
                                                setTimeout(() => { el.textContent = 'Delete All'; }, 2000);
                                            }
                                        }} className={`${btn} bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 ml-auto disabled:opacity-50`}><Trash2 size={12} className="inline mr-1" />Delete All</button>
                                    </>}
                                </div>
                                {importMode && selTestId && (
                                    <div className={`${card} p-4 border border-blue-200 grid grid-cols-1 md:grid-cols-2 gap-5`}>
                                        <div className="flex flex-col gap-3">
                                            <div>
                                                <h3 className="text-[10px] font-black uppercase text-blue-600 mb-2 flex items-center gap-1">1. Paste Raw Questions (AI Will Form & Import)</h3>
                                                <textarea value={importText} onChange={e => setImportText(e.target.value)} className={`${inp} h-[210px] text-xs leading-relaxed`} placeholder="Paste ANY unstructured questions here.&#10;&#10;The AI will automatically understand them, perfectly format them, and import them into your test without changing your language!&#10;&#10;Example:&#10;Q1. What is HTML?&#10;1. Language&#10;2. Browser&#10;Ans: 1" />
                                                <button disabled={aiGenerating || !importText.trim()} onClick={async () => {
                                                    setAiGenerating(true); setImportLog('🤖 AI is reading & formatting your questions...');
                                                    try {
                                                        const res = await adminFetch('/api/admin-ai-format', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({input: importText, mode: 'format'})});
                                                        const data = await res.json();
                                                        if (data.result) { 
                                                            setImportLog('✅ AI structured perfectly. Importing to database...'); 
                                                            const c = await d.importQuestions(selTestId, data.result); 
                                                            setImportLog(`🎉 Success! AI perfectly imported ${c} questions.`); 
                                                            setImportText(''); 
                                                        }
                                                        else throw new Error(data.error);
                                                    } catch(e) { console.error(e); setImportLog('Error: ' + e); }
                                                    setAiGenerating(false);
                                                }} className="w-full mt-3 py-3 text-white font-bold rounded-xl text-xs shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                                                    {aiGenerating ? <Loader2 size={16} className="animate-spin inline mr-2" /> : <Crown size={16} className="inline mr-2 group-hover:scale-110 transition-transform"/>} Magic Process & Import
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 h-full">
                                            <div className="p-4 rounded-xl border border-purple-100 h-full flex flex-col justify-center" style={{ background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)' }}>
                                                <h3 className="text-xs font-black uppercase text-purple-700 mb-4 flex items-center justify-center gap-2"><Crown size={16}/> Auto-Generate Questions</h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-purple-400 uppercase block mb-1">Topic Name</label>
                                                        <input value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder="e.g. Python Dictionary" className={`${inp} w-full`} style={{ borderColor: '#e9d5ff' }} />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-purple-400 uppercase block mb-1">Number of Questions</label>
                                                        <input value={aiCount} onChange={e => setAiCount(Number(e.target.value))} type="number" min="1" max="20" className={`${inp} w-full`} style={{ borderColor: '#e9d5ff' }} />
                                                    </div>
                                                    <button onClick={async () => {
                                                        if (!aiTopic.trim()) return alert("Enter a topic!");
                                                        setAiGenerating(true); setImportLog('🤖 AI is writing fresh questions...');
                                                        try {
                                                            const res = await adminFetch('/api/admin-ai-format', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({input: aiTopic, num_questions: aiCount, mode: 'generate'})});
                                                            const data = await res.json();
                                                            if (data.result) { 
                                                                setImportLog('✅ AI created them. Importing to database...');
                                                                const c = await d.importQuestions(selTestId, data.result);
                                                                setImportLog(`🎉 Success! AI generated and imported ${c} questions.`); 
                                                                setAiTopic('');
                                                            }
                                                            else throw new Error(data.error);
                                                        } catch(e) { console.error(e); setImportLog('Error with AI generation.'); }
                                                        setAiGenerating(false);
                                                    }} disabled={aiGenerating || !aiTopic.trim()} className={`${btn} w-full py-3 shadow-md flex items-center justify-center disabled:opacity-50 mt-2`} style={{ background: 'linear-gradient(135deg, #a855f7, #d946ef)', color: '#fff' }}>
                                                        {aiGenerating ? <Loader2 size={16} className="animate-spin" /> : 'Generate & Import'}
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {importLog && (
                                                <div className={`text-[11px] items-center gap-2 flex font-bold p-3 rounded-xl border shadow-sm ${importLog.includes('Error') ? 'text-red-500 bg-red-50 border-red-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200'}`}>
                                                    {aiGenerating && <Loader2 size={14} className="animate-spin"/>} {importLog}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {selTestId && (
                                    <div className={`${card} rounded-2xl overflow-hidden overflow-x-auto`}>
                                        <table className="w-full text-left text-sm min-w-[600px]">
                                            <thead className="bg-gray-50 text-gray-400 text-xs uppercase border-b border-gray-100"><tr><th className="p-3 w-10 text-center">#</th><th className="p-3">Question Text</th><th className="p-3 w-24">Type</th><th className="p-3 w-20 text-center">Points</th><th className="p-3 w-28 text-center">Actions</th></tr></thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {d.questions.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400 text-xs">No questions. Add or import.</td></tr>}
                                                {d.questions.map((q: any, i) => (
                                                    <tr key={q.id} className="hover:bg-gray-50/50 transition">
                                                        <td className="p-3 text-center text-gray-400 font-bold">{i + 1}</td>
                                                         <td className="p-3 text-gray-700 max-w-lg text-sm leading-relaxed">{q.question_text.split('\n').map((line: string, li: number) => { const isCode = /^[a-zA-Z_$].*[=(\[{]|^print\(|^#/.test(line.trim()) && !/\?$/.test(line.trim()) && !line.includes('|'); return isCode ? <code key={li} className="block font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded mt-0.5 text-violet-700">{line}</code> : <span key={li} className="block">{line}</span>; })}</td>
                                                        <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold">{q.question_type}</span></td>
                                                        <td className="p-3 text-center font-bold text-gray-900">1</td>
                                                        <td className="p-3 text-center flex justify-center gap-2">
                                                            <button onClick={async () => { const opts = await d.getOptionsForQuestion(q.id); setQForm({ id: q.id, text: q.question_text, type: q.question_type, marks: q.marks, difficulty: q.difficulty, options: opts.map((o: any) => ({ id: o.id, text: o.option_text, is_correct: o.is_correct === true || String(o.is_correct) === 'true' })) }); setShowQModal(true); }} className="text-blue-500 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50"><Pencil size={13} /></button>
                                                            <button onClick={() => { if (confirm('Delete?')) d.deleteQuestion(q.id, selTestId); }} className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50"><Trash2 size={13} /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══ RESULTS ═══ */}
                        {tab === 'results' && (
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <button onClick={() => setResultsView('attempts')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${resultsView === 'attempts' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>Student Attempts</button>
                                    <button onClick={() => setResultsView('analytics')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${resultsView === 'analytics' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>Question Analytics</button>
                                </div>

                                {resultsView === 'attempts' && (
                                    <>
                                        <div className={`${card} p-4 flex flex-col md:flex-row gap-3 md:items-center`}>
                                            <span className="text-xs font-bold text-indigo-500 uppercase">Filters:</span>
                                            <select value={resTestId} onChange={e => setResTestId(e.target.value)} className={`${inp} md:w-56`}><option value="">All Tests</option>{d.tests.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select>
                                            <select value={resUserId} onChange={e => setResUserId(e.target.value)} className={`${inp} md:w-56`}><option value="">All Users</option>{d.users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}</select>
                                            <button onClick={() => d.loadResults(resTestId, resUserId)} className={`${btn} shadow-md`} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff' }}>Apply</button>
                                        </div>
                                        <div className={`${card} rounded-2xl overflow-hidden overflow-x-auto`}>
                                            <table className="w-full text-left text-sm min-w-[850px]">
                                                <thead className="bg-gray-50 text-gray-400 text-xs uppercase border-b border-gray-100"><tr><th className="p-3">Student</th><th className="p-3">Test</th><th className="p-3 text-center">Score</th><th className="p-3 text-center">Acc%</th><th className="p-3 text-center">Points</th><th className="p-3 text-center">Date & Time</th><th className="p-3 text-center">Status</th><th className="p-3 text-center">Detail</th></tr></thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {d.results.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-gray-400 text-xs">No results.</td></tr>}
                                                    {d.results.map((r: any) => (
                                                        <tr key={r.id} className="hover:bg-gray-50/50">
                                                            <td className="p-3 font-bold text-gray-900">{d.users.find(u => u.id === r.user_id)?.full_name || r.user_id}</td>
                                                            <td className="p-3 text-xs text-gray-500">{d.tests.find(t => t.id === r.test_id)?.title || r.test_id}</td>
                                                            <td className="p-3 text-center font-bold text-emerald-600">{r.score}</td>
                                                            <td className="p-3 text-center font-bold">{r.accuracy}%</td>
                                                            <td className="p-3 text-center text-amber-500 font-bold">+{r.xp_earned}</td>
                                                            <td className="p-3 text-center text-[10px] text-gray-500 whitespace-nowrap">{(() => { const ts = r.started_at || r.created_at; if (!ts) return '—'; const d2 = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts); return isNaN(d2.getTime()) ? '—' : d2.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }); })()}</td>
                                                            <td className="p-3 text-center"><span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${r.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{r.status}</span></td>
                                                            <td className="p-3 text-center"><button onClick={async () => { const det = await d.viewAttemptDetail(r); setAttemptDetail(det); }} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1 rounded-lg font-bold transition">View</button></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                {resultsView === 'analytics' && (
                                    <>
                                        <div className={`${card} p-4 flex flex-col md:flex-row gap-3 md:items-center`}>
                                            <span className="text-xs font-bold text-indigo-500 uppercase">Select Test:</span>
                                            <select value={resTestId} onChange={e => setResTestId(e.target.value)} className={`${inp} md:w-64`}><option value="">-- Choose a Test --</option>{d.tests.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select>
                                            <button onClick={async () => { if (!resTestId) return; setLoadingAnalytics(true); const data = await d.getTestAnalytics(resTestId); setAnalyticsData(data); setLoadingAnalytics(false); }} disabled={!resTestId || loadingAnalytics} className={`${btn} shadow-md disabled:opacity-50 flex items-center gap-2`} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff' }}>{loadingAnalytics && <Loader2 size={12} className="animate-spin inline" />} Load Analytics</button>
                                        </div>

                                        {analyticsData.length > 0 ? (
                                            <div className={`${card} rounded-2xl overflow-hidden overflow-x-auto`}>
                                                <table className="w-full text-left text-sm min-w-[700px]">
                                                    <thead className="bg-gray-50 text-gray-400 text-xs uppercase border-b border-gray-100">
                                                        <tr>
                                                            <th className="p-3 w-10 text-center">#</th>
                                                            <th className="p-3">Question Text</th>
                                                            <th className="p-3 text-center w-28">Total Attempts</th>
                                                            <th className="p-3 text-center w-28">Incorrect</th>
                                                            <th className="p-3 text-center w-24">Accuracy</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {analyticsData.map((q: any, i: number) => (
                                                            <tr key={q.id} className={`hover:bg-gray-50/50 transition ${q.accuracy < 50 ? 'bg-red-50/30' : ''}`}>
                                                                <td className="p-3 text-center text-gray-400 font-bold">{i + 1}</td>
                                                                <td className="p-3 text-gray-700 text-sm leading-relaxed">
                                                                    <div className="font-medium mb-2">{q.text.split('\n').map((line: string, li: number) => { const isCode = /^[a-zA-Z_$].*[=(\[{]|^print\(|^#/.test(line.trim()) && !/\?$/.test(line.trim()) && !line.includes('|'); return isCode ? <code key={li} className="block font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded mt-0.5 text-violet-700">{line}</code> : <span key={li} className="block">{line}</span>; })}</div>
                                                                    {q.options && q.options.length > 0 && (
                                                                        <div className="flex flex-col gap-1 mt-2">
                                                                            {q.options.map((opt: any) => (
                                                                                <div key={opt.id} className={`text-xs px-2 py-1.5 rounded-lg border ${opt.is_correct === true || String(opt.is_correct) === 'true' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium shadow-sm' : 'bg-gray-50/50 border-gray-100 text-gray-500'}`}>
                                                                                    {opt.is_correct === true || String(opt.is_correct) === 'true' ? <Check size={12} className="inline mr-1 text-emerald-600" /> : null}
                                                                                    {opt.option_text}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="p-3 text-center font-bold text-gray-600">{q.total}</td>
                                                                <td className="p-3 text-center font-bold text-red-500">{q.incorrect}</td>
                                                                <td className="p-3 text-center">
                                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${q.accuracy < 50 ? 'bg-red-100 text-red-700' : q.accuracy < 80 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{q.accuracy}%</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className={`${card} p-10 text-center text-gray-400 text-xs`}>
                                                Select a test and click "Load Analytics" to see which questions students are struggling with.
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* ═══ USERS ═══ */}
                        {tab === 'users' && (
                            <div className="space-y-4">
                                <div className="relative"><Search size={14} className="absolute left-3 top-3.5 text-gray-400" /><input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by name or email..." className={`${inp} pl-9`} /></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {filteredUsers.map(u => (
                                        <div key={u.id} className={`${card} p-4 flex items-center justify-between hover:shadow-md transition`}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>{u.full_name ? u.full_name.substring(0, 2).toUpperCase() : 'UN'}</div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-gray-900 text-xs truncate">{u.full_name || 'No Name'}</div>
                                                    <div className="text-[10px] text-gray-400 truncate">{u.email}</div>
                                                    <div className="flex gap-1 mt-0.5">
                                                        {u.role === 'admin' && <span className="text-[8px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full font-bold border border-red-200">ADMIN</span>}
                                                        {u.role !== 'admin' && <span className="text-[8px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-full font-bold border border-blue-200">USER</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <button onClick={async () => { const p = await d.getUserProfile(u); setProfileModal(p); }} className="text-[10px] text-blue-500 border border-blue-200 px-2 py-0.5 rounded-lg hover:bg-blue-50 font-bold transition">Profile</button>
                                                {u.id !== d.user?.uid && <button onClick={() => { if (confirm('Delete?')) d.deleteUser(u.id); }} className="text-[10px] text-red-400 border border-red-200 px-2 py-0.5 rounded-lg hover:bg-red-50 font-bold transition">Delete</button>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ═══ GAMIFICATION ═══ */}
                        {tab === 'gamification' && (
                            <div className="space-y-5">
                                {/* ── Rank Badges Reference ── */}
                                <div className={`${card} rounded-2xl overflow-hidden`}>
                                    <div className="p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', borderBottom: '1px solid #ddd6fe' }}>
                                        <h3 className="text-sm font-black flex items-center gap-2" style={{ color: '#4c1d95' }}>
                                            <div className="h-7 w-7 rounded-lg flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}><Crown size={13} /></div>
                                            Rank Badges System
                                        </h3>
                                        <span className="text-[9px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>AUTO ASSIGNED</span>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-[11px] text-gray-500 mb-3 font-medium">Ranks are <strong>automatically assigned</strong> based on user points. No manual setup needed.</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                                            {[
                                                { icon: '🥉', name: 'Bronze', pts: '0', color: '#cd7f32', bg: '#fef3c7' },
                                                { icon: '🥈', name: 'Silver', pts: '50', color: '#94a3b8', bg: '#f1f5f9' },
                                                { icon: '🥇', name: 'Gold', pts: '150', color: '#f59e0b', bg: '#fffbeb' },
                                                { icon: '💎', name: 'Platinum', pts: '300', color: '#06b6d4', bg: '#ecfeff' },
                                                { icon: '💠', name: 'Diamond', pts: '500', color: '#8b5cf6', bg: '#f5f3ff' },
                                                { icon: '👑', name: 'Legend', pts: '800+', color: '#ef4444', bg: '#fef2f2' },
                                            ].map((r, i) => (
                                                <div key={i} className="text-center p-3 rounded-xl transition-all hover:shadow-md hover:scale-[1.02]" style={{ background: r.bg, border: `1px solid ${r.color}25` }}>
                                                    <span className="text-2xl block mb-1">{r.icon}</span>
                                                    <div className="text-[11px] font-black" style={{ color: r.color }}>{r.name}</div>
                                                    <div className="text-[9px] font-bold text-gray-400 mt-0.5">{r.pts} pts</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                                            <span className="text-xs mt-0.5">👑</span>
                                            <p className="text-[10px] font-medium" style={{ color: '#991b1b' }}>
                                                <strong>Legend is exclusive!</strong> Only the #1 ranked player with ≥800 points gets Legend. All others stay at Diamond max.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                    {/* ── Levels ── */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-black text-indigo-600 uppercase tracking-wider border-b border-gray-200 pb-2">Levels</h3>
                                        <div className={`${card} p-4 space-y-3`}>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input value={levelForm.level_no} onChange={e => setLevelForm({ ...levelForm, level_no: e.target.value })} type="number" placeholder="Lvl No" className={inp} />
                                                <input value={levelForm.required_xp} onChange={e => setLevelForm({ ...levelForm, required_xp: e.target.value })} type="number" placeholder="Required Points" className={inp} />
                                                <input value={levelForm.title} onChange={e => setLevelForm({ ...levelForm, title: e.target.value })} placeholder="Title (e.g. Novice)" className={`${inp} col-span-2`} />
                                            </div>
                                            <div className="flex gap-2">
                                                {editLevelId && <button onClick={() => { setEditLevelId(null); setLevelForm({ level_no: '', required_xp: '', title: '' }); }} className={`${btn} w-1/3 bg-gray-100 text-gray-600`}>Cancel</button>}
                                                <button onClick={async () => { await d.saveLevel(levelForm, editLevelId || undefined); setEditLevelId(null); setLevelForm({ level_no: '', required_xp: '', title: '' }); }} className={`${btn} flex-1`} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff' }}>{editLevelId ? 'Update' : 'Add Level'}</button>
                                            </div>
                                        </div>
                                        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                                            {d.levels.map((l: any) => (
                                                <div key={l.id} className={`${card} p-3 flex justify-between items-center text-xs group hover:shadow-md transition`}>
                                                    <div><span className="font-bold text-gray-900">Lv {l.level_no}: {l.title}</span><div className="text-[10px] text-gray-400">{l.required_xp} Points required</div></div>
                                                    <div className="flex gap-1 opacity-40 group-hover:opacity-100 transition">
                                                        <button onClick={() => { setEditLevelId(l.id); setLevelForm(l); }} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg"><Pencil size={12} /></button>
                                                        <button onClick={() => { if (confirm('Delete?')) d.deleteLevel(l.id); }} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={12} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── Badges ── */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-black text-emerald-600 uppercase tracking-wider border-b border-gray-200 pb-2">Achievement Badges</h3>
                                        <div className={`${card} p-4 space-y-3`}>
                                            <input value={badgeForm.badge_name} onChange={e => setBadgeForm({ ...badgeForm, badge_name: e.target.value })} placeholder="Badge Name" className={inp} />
                                            <input value={badgeForm.badge_icon} onChange={e => setBadgeForm({ ...badgeForm, badge_icon: e.target.value })} placeholder="Icon (e.g. ph-medal)" className={inp} />
                                            <textarea value={badgeForm.description} onChange={e => setBadgeForm({ ...badgeForm, description: e.target.value })} placeholder="Description" className={`${inp} h-14 resize-none`} />
                                            <input value={badgeForm.xp_reward} onChange={e => setBadgeForm({ ...badgeForm, xp_reward: e.target.value })} type="number" placeholder="Points Reward" className={inp} />
                                            <div className="flex gap-2">
                                                {editBadgeId && <button onClick={() => { setEditBadgeId(null); setBadgeForm({ badge_name: '', badge_icon: '', xp_reward: '', description: '' }); }} className={`${btn} w-1/3 bg-gray-100 text-gray-600`}>Cancel</button>}
                                                <button onClick={async () => { await d.saveBadge(badgeForm, editBadgeId || undefined); setEditBadgeId(null); setBadgeForm({ badge_name: '', badge_icon: '', xp_reward: '', description: '' }); }} className={`${btn} flex-1`} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff' }}>{editBadgeId ? 'Update' : 'Add Badge'}</button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                                            {d.badges.map((b: any) => (
                                                <div key={b.id} onClick={() => { setEditBadgeId(b.id); setBadgeForm(b); }} className={`${card} p-3 cursor-pointer group hover:shadow-md transition relative`}>
                                                    <div className="flex justify-between"><Medal size={16} className="text-emerald-500" /><span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold">+{b.xp_reward} pts</span></div>
                                                    <div className="font-bold text-xs text-gray-900 mt-1 truncate">{b.badge_name}</div>
                                                    <div className="text-[10px] text-gray-400 truncate">{b.description || 'No description'}</div>
                                                    <button onClick={e => { e.stopPropagation(); if (confirm('Delete?')) d.deleteBadge(b.id); }} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 p-1 rounded-lg transition"><Trash2 size={11} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══ RESOURCES ═══ */}
                        {tab === 'resources' && (
                            <div className="space-y-5">
                                <div className={`${card} p-5`}>
                                    <h3 className="text-sm font-black text-blue-600 mb-3 flex items-center gap-2"><Bell size={15} /> Broadcast Notification</h3>
                                    <div className="flex gap-3"><input value={notifMsg} onChange={e => setNotifMsg(e.target.value)} placeholder="Message..." className={`${inp} flex-1`} /><input value={notifLink} onChange={e => setNotifLink(e.target.value)} placeholder="Link (opt)" className={`${inp} w-1/3 hidden md:block`} /><button onClick={async () => { if (!notifMsg) return; await d.sendNotification(notifMsg, notifLink); setNotifMsg(''); setNotifLink(''); alert('Sent!'); }} className={`${btn} shadow-md`} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#ffffff' }}><Send size={12} className="inline mr-1" />Send</button></div>
                                    <div className="mt-3 max-h-32 overflow-y-auto space-y-1">
                                        {d.notifications.length === 0 && <div className="text-xs text-gray-400 italic">No notifications.</div>}
                                        {d.notifications.map(n => (
                                            <div key={n.id} className="flex justify-between items-center p-2.5 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition">
                                                <div className="text-xs text-gray-700 break-words pr-2">{n.message} {n.link && <span className="text-blue-500 text-[10px]">({n.link})</span>}</div>
                                                <button onClick={() => d.deleteNotification(n.id)} className="text-red-400 text-xs hover:text-red-600 shrink-0 font-bold">Delete</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={`${card} p-5`}>
                                    <h3 className="text-sm font-black text-gray-900 mb-3">Global Apps</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                        <input value={appForm.name} onChange={e => setAppForm({ ...appForm, name: e.target.value })} placeholder="App Name" className={inp} />
                                        <input value={appForm.link} onChange={e => setAppForm({ ...appForm, link: e.target.value })} placeholder="URL" className={`${inp} md:col-span-2`} />
                                        <input value={appForm.icon} onChange={e => setAppForm({ ...appForm, icon: e.target.value })} placeholder="Icon" className={inp} />
                                    </div>
                                    <button onClick={async () => { await d.deployApp(appForm.name, appForm.link, appForm.icon); setAppForm({ name: '', link: '', icon: '' }); }} className={`${btn} mt-3`} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#ffffff' }}>Deploy</button>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {d.apps.map(a => (<div key={a.id} className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2"><Globe size={13} className="text-amber-500" /><span className="text-xs text-gray-900 font-medium">{a.name}</span><button onClick={() => d.deleteApp(a.id)} className="text-red-400 ml-1 hover:text-red-600"><X size={12} /></button></div>))}
                                    </div>
                                </div>
                                <div className={`${card} p-5`}>
                                    <h3 className="text-sm font-black text-gray-900 mb-3">YouTube Videos</h3>
                                    <div className="flex gap-3">
                                        <input value={videoForm.id} onChange={e => setVideoForm({ ...videoForm, id: e.target.value })} placeholder="Video ID" className={`${inp} w-32`} />
                                        <input value={videoForm.title} onChange={e => setVideoForm({ ...videoForm, title: e.target.value })} placeholder="Title" className={`${inp} flex-1`} />
                                        <button onClick={async () => { await d.publishVideo(videoForm.id, videoForm.title); setVideoForm({ id: '', title: '' }); }} className={`${btn}`} style={{ background: '#ef4444', color: '#ffffff' }}><Youtube size={12} className="inline mr-1" />Publish</button>
                                    </div>
                                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                                        {d.videos.map(v => (<div key={v.id} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl hover:bg-gray-100 transition"><img src={`https://img.youtube.com/vi/${v.youtube_id}/default.jpg`} className="w-12 h-9 object-cover rounded-lg" alt="" /><div className="flex-1 min-w-0 text-xs text-gray-900 font-medium truncate">{v.title}</div><button onClick={() => d.deleteVideo(v.id)} className="text-red-400 p-1 hover:text-red-600"><Trash2 size={13} /></button></div>))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══ CATEGORIES ═══ */}
                        {tab === 'categories' && (() => {
                            const ICONS = [
                                // 🐍 Python / Coding
                                '🐍', '💻', '⌨️', '🖥️', '👨‍💻', '👩‍💻', '🧑‍💻', '📟', '🔣', '🔢',
                                // 🎨 Web Design / UI
                                '🎨', '🌐', '🖌️', '✏️', '🎭', '📐', '📏', '🖼️', '🎆', '💅',
                                // 📡 IoT / Hardware
                                '📡', '🔌', '💡', '🔋', '📠', '🖨️', '🔩', '⚙️', '🛠️', '🔧',
                                // 🤖 AI / Machine Learning
                                '🤖', '🧠', '🧬', '🔬', '🧪', '📊', '📈', '📉', '🎯', '🔮',
                                // 🌐 Networking
                                '🌍', '🛜', '📶', '📤', '📥', '🔗', '🧭', '📲', '📳', '🔄',
                                // 🔒 Cyber Security
                                '🔒', '🛡️', '🔑', '🔐', '🚫', '⚠️', '🔍', '🕵️', '👁️', '🧱',
                                // 📊 MS Office / Productivity
                                '📊', '📄', '📝', '📋', '📎', '📌', '📁', '📂', '📑', '🗂️',
                                // 💻 Operating System
                                '🖥️', '💾', '💿', '📀', '🗃️', '🗄️', '🖱️', '🖲️', '🔲', '⬛',
                                // ☁️ Cloud / Database
                                '☁️', '🗄️', '📦', '🏗️', '🔧', '⛓️', '🧊', '💎', '🚀', '⭐',
                                // 📱 Mobile / Apps
                                '📱', '📲', '🤳', '📸', '🎥', '🎬', '📺', '🔔', '💬', '📧',
                                // 🎮 Gaming / Fun
                                '🎮', '🕹️', '👾', '🏆', '🥇', '🎪', '🎵', '🎶', '🎤', '🪄',
                                // 📚 Education / General
                                '📚', '📖', '🎓', '🏫', '✅', '❌', '⚡', '🔥', '❤️', '🌟'
                            ];
                            const PRESET_COLORS = [
                                '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981',
                                '#06b6d4', '#0ea5e9', '#3b82f6', '#f97316', '#84cc16', '#14b8a6',
                                '#e11d48', '#9333ea', '#0891b2', '#65a30d', '#d946ef', '#475569'
                            ];
                            const emptyCat = { name: '', emoji: '📚', color: '#6366f1', bgColor: '#eef2ff', textColor: '#4f46e5' };
                            return (
                                <div className="space-y-5">
                                    <div className={`${card} p-5`}>
                                        <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2"><FolderOpen size={16} style={{ color: '#0ea5e9' }} /> {editCatId ? '✏️ Edit Category' : '➕ Add New Category'}</h3>

                                        {/* Name */}
                                        <div className="mb-4">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Category Name</label>
                                            <input value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} placeholder="e.g. Python, Web Design, IoT..." className={inp} />
                                        </div>

                                        {/* Icon Picker */}
                                        <div className="mb-4">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Select Icon</label>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 border-dashed border-gray-200" style={{ background: catForm.bgColor }}>{catForm.emoji}</div>
                                                <button onClick={() => setShowIconPicker(!showIconPicker)} className={`${btn} text-xs`} style={{ background: showIconPicker ? '#6366f1' : '#f1f5f9', color: showIconPicker ? '#fff' : '#475569' }}>
                                                    {showIconPicker ? 'Close Icons' : '🎯 Choose Icon'}
                                                </button>
                                                <input value={catForm.emoji} onChange={e => setCatForm({ ...catForm, emoji: e.target.value })} placeholder="Or type emoji" className={`${inp} w-24`} />
                                            </div>
                                            {showIconPicker && (
                                                <div className="grid grid-cols-10 gap-1.5 p-3 rounded-xl bg-gray-50 border border-gray-200 max-h-40 overflow-y-auto">
                                                    {ICONS.map((ic, i) => (
                                                        <button key={i} onClick={() => { setCatForm({ ...catForm, emoji: ic }); setShowIconPicker(false); }}
                                                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg hover:bg-white hover:shadow-md transition ${catForm.emoji === ic ? 'ring-2 ring-indigo-500 bg-white shadow-md' : ''}`}>
                                                            {ic}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Colors Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            {/* Badge Color */}
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">🎨 Badge / Tab Color</label>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <input type="color" value={catForm.color} onChange={e => setCatForm({ ...catForm, color: e.target.value })} className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer" />
                                                    <input value={catForm.color} onChange={e => setCatForm({ ...catForm, color: e.target.value })} className={`${inp} flex-1`} />
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {PRESET_COLORS.map(c => (
                                                        <button key={c} onClick={() => setCatForm({ ...catForm, color: c })} className={`w-5 h-5 rounded-full border-2 transition hover:scale-125 ${catForm.color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`} style={{ background: c }} />
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Background Color */}
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">🖼️ Background Color</label>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <input type="color" value={catForm.bgColor} onChange={e => setCatForm({ ...catForm, bgColor: e.target.value })} className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer" />
                                                    <input value={catForm.bgColor} onChange={e => setCatForm({ ...catForm, bgColor: e.target.value })} className={`${inp} flex-1`} />
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {['#eef2ff', '#faf5ff', '#fce7f3', '#fee2e2', '#fef3c7', '#ecfdf5', '#e0f2fe', '#f0f9ff', '#f8fafc', '#f1f5f9', '#fff7ed', '#f0fdf4', '#fdf2f8', '#ede9fe', '#e0e7ff', '#cffafe', '#d1fae5', '#fef9c3'].map(c => (
                                                        <button key={c} onClick={() => setCatForm({ ...catForm, bgColor: c })} className={`w-5 h-5 rounded-full border-2 transition hover:scale-125 ${catForm.bgColor === c ? 'border-gray-900 scale-110' : 'border-gray-300'}`} style={{ background: c }} />
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Text Color */}
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">✍️ Text Color</label>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <input type="color" value={catForm.textColor} onChange={e => setCatForm({ ...catForm, textColor: e.target.value })} className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer" />
                                                    <input value={catForm.textColor} onChange={e => setCatForm({ ...catForm, textColor: e.target.value })} className={`${inp} flex-1`} />
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {['#4f46e5', '#7c3aed', '#db2777', '#dc2626', '#d97706', '#059669', '#0891b2', '#0284c7', '#1e40af', '#ea580c', '#65a30d', '#0d9488', '#be123c', '#7e22ce', '#0e7490', '#4d7c0f', '#c026d3', '#334155'].map(c => (
                                                        <button key={c} onClick={() => setCatForm({ ...catForm, textColor: c })} className={`w-5 h-5 rounded-full border-2 transition hover:scale-125 ${catForm.textColor === c ? 'border-gray-900 scale-110' : 'border-transparent'}`} style={{ background: c }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Live Preview */}
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 mb-4">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-3">👁️ LIVE PREVIEW</label>
                                            <div className="flex flex-wrap items-center gap-3">
                                                {/* Badge style */}
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: `${catForm.color}15`, color: catForm.color, border: `1.5px solid ${catForm.color}30` }}>{catForm.emoji} {catForm.name || 'Category'}</div>
                                                {/* Dashboard tab style */}
                                                <div className="px-3.5 py-2 rounded-xl text-[11px] font-bold" style={{ background: catForm.color, color: '#ffffff', boxShadow: `0 4px 14px ${catForm.color}35` }}>{catForm.emoji} {catForm.name || 'Tab'}</div>
                                                {/* Card icon style */}
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: catForm.bgColor, color: catForm.textColor, border: `1.5px solid ${catForm.color}30` }}>{catForm.emoji}</div>
                                                {/* Full card preview */}
                                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: catForm.bgColor, border: `1px solid ${catForm.color}25` }}>
                                                    <span className="text-base">{catForm.emoji}</span>
                                                    <span className="text-xs font-bold" style={{ color: catForm.textColor }}>{catForm.name || 'Category Name'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            {editCatId && <button onClick={() => { setEditCatId(null); setCatForm(emptyCat); }} className={`${btn} bg-gray-100 text-gray-500`}>✖ Cancel</button>}
                                            <button onClick={async () => {
                                                if (!catForm.name.trim()) return alert('Category name is required');
                                                await d.saveCategory({ name: catForm.name.trim(), emoji: catForm.emoji, color: catForm.color, bgColor: catForm.bgColor, textColor: catForm.textColor, order: d.categories.length }, editCatId || undefined);
                                                setCatForm(emptyCat); setEditCatId(null);
                                            }} className={`${btn} shadow-md`} style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#ffffff' }}>
                                                {editCatId ? <><Save size={12} className="inline mr-1" /> Update Category</> : <><Plus size={12} className="inline mr-1" /> Add Category</>}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Category Cards Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {d.categories.length === 0 && <div className="col-span-full text-center py-12 text-gray-400 text-sm">📂 No categories yet. Add one above!</div>}
                                        {d.categories.map((c: any) => (
                                            <div key={c.id} className={`${card} p-4 hover:shadow-lg transition-all group`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: c.bgColor || `${c.color}15`, color: c.textColor || c.color, border: `1.5px solid ${(c.color || '#6366f1')}25` }}>{c.emoji || '📚'}</div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 text-sm">{c.name}</div>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: c.color || '#6366f1' }} />
                                                                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: c.bgColor || '#eef2ff' }} />
                                                                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: c.textColor || '#4f46e5' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button onClick={() => { setEditCatId(c.id); setCatForm({ name: c.name, emoji: c.emoji || '📚', color: c.color || '#6366f1', bgColor: c.bgColor || '#eef2ff', textColor: c.textColor || '#4f46e5' }); }} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50"><Pencil size={13} /></button>
                                                        <button onClick={() => { if (confirm(`Delete "${c.name}"?`)) d.deleteCategory(c.id); }} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
                                                    </div>
                                                </div>
                                                {/* Mini preview of how it looks */}
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}30` }}>{c.emoji} {c.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                        <span className="text-sm mt-0.5">💡</span>
                                        <p className="text-[11px] font-medium" style={{ color: '#166534' }}>Categories you add here will appear in the Test Engine dropdown and Dashboard filter tabs. Changes are instant!</p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </main>
            </div>

            {/* ═══ QUESTION MODAL ═══ */}
            {showQModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className={`${card} w-full max-w-lg p-5 shadow-2xl max-h-[90vh] overflow-y-auto`}>
                        <h3 className="text-sm font-black text-gray-900 mb-4">{qForm.id ? 'Edit Question' : 'Add New Question'}</h3>
                        <div className="space-y-3">
                            <textarea value={qForm.text} onChange={e => setQForm({ ...qForm, text: e.target.value })} className={`${inp} h-20`} placeholder="Question text..." />
                            <div className="grid grid-cols-3 gap-2">
                                <select value={qForm.type} onChange={e => setQForm({ ...qForm, type: e.target.value })} className={inp}><option value="MCQ">MCQ</option><option value="TF">True/False</option><option value="SHORT">Short</option></select>
                                <input value={qForm.marks} onChange={e => setQForm({ ...qForm, marks: Number(e.target.value) })} type="number" className={inp} placeholder="Marks" />
                                <select value={qForm.difficulty} onChange={e => setQForm({ ...qForm, difficulty: e.target.value })} className={inp}><option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option></select>
                            </div>
                            {qForm.type !== 'SHORT' && (
                                <div className="bg-gray-50 p-3 rounded-xl space-y-2 border border-gray-200">
                                    <div className="text-[10px] text-gray-400 uppercase font-bold">Options (select correct)</div>
                                    {qForm.options.map((opt, idx) => (
                                        <div key={idx} className="flex gap-2 items-center">
                                            <input type="radio" name="correctOpt" checked={opt.is_correct === true || String(opt.is_correct) === 'true'} onChange={() => setQForm({ ...qForm, options: qForm.options.map((o, i) => ({ ...o, is_correct: i === idx })) })} className="accent-emerald-500" />
                                            <input value={opt.text} onChange={e => setQForm({ ...qForm, options: qForm.options.map((o, i) => i === idx ? { ...o, text: e.target.value } : o) })} className={`${inp} flex-1`} placeholder="Option text" />
                                            <button onClick={() => setQForm({ ...qForm, options: qForm.options.filter((_, i) => i !== idx) })} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => setQForm({ ...qForm, options: [...qForm.options, { text: '', is_correct: false }] })} className="text-xs text-blue-500 font-bold">+ Add Option</button>
                                </div>
                            )}
                            <div className="flex justify-end gap-3 mt-4">
                                <button onClick={() => setShowQModal(false)} className={`${btn} text-gray-400`}>Cancel</button>
                                <button disabled={saving} onClick={async () => { if (saving) return; setSaving(true); try { await d.saveQuestion(selTestId, qForm); setShowQModal(false); } finally { setSaving(false); } }} className={`${btn}`} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', opacity: saving ? 0.6 : 1 }}>{saving ? 'Saving...' : 'Save'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ ATTEMPT MODAL ═══ */}
            {attemptDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className={`${card} w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto relative`}>
                        <button onClick={() => setAttemptDetail(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X size={20} /></button>
                        <h3 className="text-lg font-black text-gray-900 mb-1">Attempt Analysis</h3>
                        <div className="text-xs text-gray-400 mb-4 font-medium">User: {attemptDetail.userName} | Test: {attemptDetail.testTitle}</div>
                        <div className="space-y-3">
                            {attemptDetail.questions.map((q: any, i: number) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div className="text-sm font-bold text-gray-900 mb-2">{i + 1}. {q.text}</div>
                                    <div className="space-y-1 ml-4">
                                        {q.options.map((opt: any) => (
                                            <div key={opt.id} className={`text-xs p-1.5 rounded-lg ${opt.is_correct ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : q.userSelected === opt.id ? 'bg-red-50 text-red-600 border border-red-200' : 'text-gray-500'}`}>
                                                {q.userSelected === opt.id ? '● ' : '○ '}{opt.option_text}
                                                {opt.is_correct && <span className="ml-2 font-bold text-[9px] uppercase">✓ Correct</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {attemptDetail.questions.length === 0 && <div className="text-center text-gray-400 text-xs py-4">No response data.</div>}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ PROFILE MODAL ═══ */}
            {profileModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className={`${card} w-full max-w-md p-6 shadow-2xl relative`}>
                        <button onClick={() => setProfileModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X size={20} /></button>
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>{profileModal.full_name?.substring(0, 1)}</div>
                            <h3 className="text-xl font-black text-gray-900">{profileModal.full_name}</h3>
                            <div className="text-xs text-gray-400 font-mono">{profileModal.email}</div>
                            <div className="mt-2 text-indigo-600 font-black text-lg">{profileModal.total_xp || 0} Points</div>
                        </div>
                        <div><div className="text-[10px] text-gray-400 uppercase font-bold mb-2">Badges</div>
                            <div className="flex flex-wrap gap-2">
                                {profileModal.badgeNames?.map((b: string, i: number) => <div key={i} className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] text-emerald-600 font-bold">{b}</div>)}
                                {(!profileModal.badgeNames || profileModal.badgeNames.length === 0) && <div className="text-xs text-gray-400">No badges earned yet.</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ TEST PREVIEW MODAL ═══ */}
            {previewData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className={`${card} w-full max-w-3xl p-6 shadow-2xl max-h-[90vh] flex flex-col relative`}>
                        <button onClick={() => { setPreviewData(null); setAiFeedback({}); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 z-10"><X size={20} /></button>
                        <div className="border-b border-gray-100 pb-4 mb-4 shrink-0 pr-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><Eye size={18} className="text-blue-500"/> Test Preview: {previewData.test.title}</h3>
                                <div className="text-xs text-gray-500 mt-1 font-medium">{previewData.test.total_marks} Questions • {previewData.test.duration_minutes} Mins • {previewData.test.mode}</div>
                            </div>
                            <button onClick={async () => {
                                setVerifyingTest(true);
                                setAiFeedback({});
                                try {
                                    const res = await adminFetch('/api/admin/verify-test', {
                                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ testTitle: previewData.test.title, questions: previewData.questions })
                                    });
                                    const data = await res.json();
                                    if(data.feedback) {
                                        const fbMap: any = {};
                                        data.feedback.forEach((f: any) => fbMap[f.questionId] = f.doubt);
                                        setAiFeedback(fbMap);
                                    }
                                } catch (e) {
                                    console.error('Verify failed', e);
                                    alert('AI verification failed');
                                }
                                setVerifyingTest(false);
                            }} disabled={verifyingTest || previewData.questions.length === 0} className={`${btn} shadow-md flex items-center gap-2`} style={{ background: 'linear-gradient(135deg, #a855f7, #c084fc)', color: '#ffffff', opacity: verifyingTest ? 0.7 : 1 }}>
                                {verifyingTest ? <Loader2 size={13} className="animate-spin" /> : <Shield size={13} />} {verifyingTest ? 'AI Verifying...' : 'AI Verify Test'}
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1 pr-2 space-y-4">
                            {previewData.questions.length === 0 && <div className="text-center text-gray-400 text-sm py-8">No questions added yet.</div>}
                            {previewData.questions.map((q: any, i: number) => (
                                <div key={q.id} className={`p-4 rounded-xl border transition-colors ${aiFeedback[q.id] ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="text-sm font-bold text-gray-900 mb-3 flex items-start gap-2">
                                        <span className="text-indigo-500 shrink-0">Q{i + 1}.</span> 
                                        <span className="flex-1 whitespace-pre-wrap leading-relaxed">
                                                {q.question_text.split('\n').map((line: string, li: number) => {
                                                    const isCode = /^[a-zA-Z_$].*[=(\[{]|^print\(|^#|^>>>/.test(line.trim()) && !/\?$/.test(line.trim()) && !line.includes('|');
                                                    return isCode
                                                        ? <code key={li} className="block font-mono text-xs bg-gray-100 px-2 py-0.5 rounded mt-0.5 text-violet-700">{line}</code>
                                                        : <span key={li} className="block">{line}</span>;
                                                })}
                                        </span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full whitespace-nowrap">{q.question_type}</span>
                                            <button onClick={async () => {
                                                if(confirm('Delete this question?')) {
                                                    await d.deleteQuestion(q.id, previewData.test.id);
                                                    setPreviewData({ ...previewData, questions: previewData.questions.filter((x: any) => x.id !== q.id) });
                                                }
                                            }} className="text-red-400 hover:text-red-600 p-1.5 bg-white rounded-lg shadow-sm border border-red-100 transition" title="Delete Question"><Trash2 size={13} /></button>
                                        </div>
                                    </div>
                                    {(q.question_type === 'MCQ' || q.question_type === 'TF') && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-6">
                                            {q.options?.map((opt: any, oIdx: number) => (
                                                <button key={opt.id} onClick={async () => {
                                                    if (opt.is_correct) return;
                                                    const newQs = previewData.questions.map((x: any) => x.id === q.id ? { ...x, options: x.options.map((o: any) => ({ ...o, is_correct: o.id === opt.id })) } : x);
                                                    setPreviewData({ ...previewData, questions: newQs });
                                                    await d.setCorrectOption(q.id, opt.id);
                                                }} className={`text-xs p-2.5 rounded-lg border flex items-center gap-2 transition-all cursor-pointer text-left ${opt.is_correct ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold shadow-sm ring-1 ring-emerald-400' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:shadow-sm'}`}>
                                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${opt.is_correct ? 'bg-emerald-500 border-emerald-600 text-white' : 'border-gray-300'}`}>
                                                        {opt.is_correct ? <Check size={10} /> : <span className="text-[8px]">{String.fromCharCode(65 + oIdx)}</span>}
                                                    </div>
                                                    <span className="flex-1">{opt.option_text}</span>
                                                    {opt.is_correct && <span className="text-[10px] uppercase tracking-wider text-emerald-600 hidden sm:inline">Correct</span>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {q.question_type === 'SHORT' && (
                                        <div className="ml-6 text-xs text-gray-500 italic bg-white p-3 rounded-lg border border-gray-200">
                                            Short answer question. Admin manually evaluates.
                                        </div>
                                    )}
                                    {aiFeedback[q.id] && (
                                        <div className="mt-3 ml-6 p-3 bg-white border border-amber-200 rounded-xl flex items-start gap-2 text-amber-800 shadow-sm">
                                            <span className="text-base mt-0.5 shrink-0">🤖</span>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-wider mb-1 opacity-70">AI Doubt / Fix Suggestion</h4>
                                                <p className="text-xs font-medium leading-relaxed">{aiFeedback[q.id]}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
