'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import { useDashboard } from './useDashboard';
import {
    ArrowLeft, Home, Trophy, Clock, Target, Play, Lock, Unlock,
    BarChart3, Medal, Users, ChevronRight, Flame, Award, Eye,
    Radio, Zap, MapPin, CheckCircle, Compass, RefreshCw, X, ArrowRight,
    LayoutDashboard, StickyNote, Code2, Brain, Keyboard, Loader2,
    Monitor, Globe, Cpu, BookOpen, Crown, TrendingUp, Star, LogOut
} from 'lucide-react';



export default function DashboardPage() {
    const {user} = useAuth();
    return <DashboardSession key={user?.uid ?? 'guest'} />;
}

function DashboardSession() {
    const router = useRouter();
    const d = useDashboard();
    const [activeSubject, setActiveSubject] = useState('all');
    const points = d.totalPoints;

    const filterBySubject = (tests: any[]) => {
        if (activeSubject === 'all') return tests;
        return tests.filter((t: any) => {
            const catName = (t.category || '').toLowerCase();
            return catName === activeSubject.toLowerCase();
        });
    };

    // Build dynamic category tabs from Firestore
    const dynamicSubjects = [
        { id: 'all', label: 'All', emoji: '📚', color: '#6366f1' },
        ...d.categories.map((c: any) => ({ id: c.name, label: c.name, emoji: c.emoji || '📚', color: c.color || '#6366f1' })),
    ];

    // Auth Guard — if not logged in, show login
    const { loading: authLoading, logout } = useAuth();
    if (!authLoading && !d.user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #6366f1 100%)' }}>
                <LoginModal isOpen={true} onClose={() => router.push('/')} />
            </div>
        );
    }

    if (authLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #6366f1 100%)' }}>
                <div className="animate-spin h-8 w-8 rounded-full border-3 border-white/20 border-t-white"></div>
                <span className="text-sm font-medium text-white/70">Loading...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: '#f0f2f5' }}>

            {/* ═══ PREMIUM HERO HEADER ═══ */}
            {(() => {
                const firstName = (d.profile?.full_name || d.user?.displayName || 'Champion').split(' ')[0];
                const quotes = [
                    `🔥 ${firstName}, champions are made when no one is watching!`,
                    `💪 ${firstName}, your consistency today builds your success tomorrow!`,
                    `🚀 ${firstName}, every test you take makes you stronger!`,
                    `⚡ ${firstName}, legends aren't born — they're trained!`,
                    `🌟 ${firstName}, your dedication is your superpower!`,
                    `🎯 ${firstName}, aim high, work hard, and watch the magic happen!`,
                ];
                const quoteIndex = new Date().getDate() % quotes.length;
                return (
                    <div className="relative overflow-hidden" style={{ background: '#0f172a' }}>
                        {/* Background image */}
                        <div className="absolute inset-0" style={{ backgroundImage: 'url(/sample-assets/placeholder.svg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.85 }} />
                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.5) 0%, rgba(30,27,75,0.4) 40%, rgba(76,29,149,0.3) 70%, transparent 100%)' }} />
                        {/* Bottom fade */}
                        <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: 'linear-gradient(to top, #f0f2f5, transparent)' }} />

                        {/* Top Nav */}
                        <div className="relative max-w-6xl mx-auto px-4 pt-4 pb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Link href="/" className="h-8 w-8 rounded-lg flex items-center justify-center transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
                                    <ArrowLeft size={14} style={{ color: 'rgba(255,255,255,0.8)' }} />
                                </Link>
                                <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Home</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                {d.user ? (
                                    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                                        <div className="hidden sm:block text-right">
                                            <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{d.profile?.full_name || d.user.displayName || 'Student'}</div>
                                            <div className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{d.currentRank.icon} {d.currentRank.name} · {points} pts</div>
                                        </div>
                                        <div className="h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-bold uppercase" style={{ background: `linear-gradient(135deg, ${d.currentRank.color}, ${d.currentRank.color}cc)`, color: '#fff', boxShadow: `0 0 15px ${d.currentRank.color}50`, border: '2px solid rgba(255,255,255,0.3)' }}>
                                            {d.avatarInitials}
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Login to see dashboard</span>
                                )}
                                {d.user && (
                                    <button onClick={logout} className="h-8 px-2.5 sm:px-3.5 rounded-lg flex items-center justify-center gap-1.5 transition-all hover:scale-105" style={{ background: '#ffffff', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }} title="Logout">
                                        <LogOut size={13} style={{ color: '#ef4444' }} />
                                        <span className="hidden sm:inline text-[10px] font-bold" style={{ color: '#ef4444' }}>Logout</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Hero Content — Left aligned */}
                        <div className="relative max-w-6xl mx-auto px-4 pb-20 pt-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">
                                {/* Colorful Rank Badge */}
                                <div className="relative flex-shrink-0">
                                    {/* Animated glow */}
                                    <div className="absolute -inset-4 rounded-3xl animate-pulse" style={{ background: `radial-gradient(circle, ${d.currentRank.color}30 0%, transparent 65%)` }} />
                                    <div className="relative h-28 w-28 rounded-2xl flex flex-col items-center justify-center" style={{
                                        background: `linear-gradient(145deg, ${d.currentRank.color}30, ${d.currentRank.color}15)`,
                                        border: `2px solid ${d.currentRank.color}50`,
                                        backdropFilter: 'blur(20px)',
                                        boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 40px ${d.currentRank.color}30, inset 0 1px 0 rgba(255,255,255,0.15), inset 0 0 20px ${d.currentRank.color}10`,
                                    }}>
                                        <span className="text-5xl mb-1" style={{ filter: `drop-shadow(0 0 15px ${d.currentRank.color}70)` }}>{d.currentRank.icon}</span>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: '#ffffff', textShadow: `0 0 10px ${d.currentRank.color}60` }}>{d.currentRank.name}</span>
                                    </div>
                                    {/* Points pill */}
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-black" style={{
                                        background: `linear-gradient(135deg, ${d.currentRank.color}, ${d.currentRank.color}dd)`,
                                        color: '#ffffff', whiteSpace: 'nowrap',
                                        boxShadow: `0 4px 15px ${d.currentRank.color}50, 0 0 20px ${d.currentRank.color}30`,
                                        border: '2px solid rgba(255,255,255,0.25)', letterSpacing: '0.05em',
                                    }}>
                                        🪙 {points} Points
                                    </div>
                                </div>

                                {/* Text Content — Left */}
                                <div className="sm:text-left text-center">
                                    <h1 className="text-3xl sm:text-4xl font-black mb-2" style={{ color: '#ffffff', textShadow: '0 2px 30px rgba(139,92,246,0.3)', letterSpacing: '-0.02em' }}>
                                        ✨ Test Journey
                                    </h1>
                                    <p className="text-[13px] font-medium mb-2" style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 450, lineHeight: '1.6' }}>
                                        {quotes[quoteIndex]}
                                    </p>
                                    <p className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                        Earn points · Climb ranks · Become a legend
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* ═══ FLOATING STATS CARDS ═══ */}
            <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-10 mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: '🪙 Points', value: points, icon: <Zap size={18} />, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: 'rgba(245,158,11,0.3)' },
                        { label: 'Tests Done', value: d.stats.testsCompleted, icon: <CheckCircle size={18} />, gradient: 'linear-gradient(135deg, #10b981, #059669)', shadow: 'rgba(16,185,129,0.3)' },
                        { label: 'Avg Score', value: `${d.stats.avgScore.toFixed(0)}%`, icon: <TrendingUp size={18} />, gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', shadow: 'rgba(99,102,241,0.3)' },
                        { label: 'Accuracy', value: `${d.stats.avgAccuracy.toFixed(0)}%`, icon: <Target size={18} />, gradient: 'linear-gradient(135deg, #ec4899, #db2777)', shadow: 'rgba(236,72,153,0.3)' },
                    ].map((s, i) => (
                        <div key={i} className="rounded-2xl p-4 flex items-center gap-3 transition-all hover:scale-[1.03] hover:-translate-y-1" style={{ background: '#ffffff', boxShadow: `0 8px 30px ${s.shadow}, 0 2px 8px rgba(0,0,0,0.06)`, border: '1px solid rgba(255,255,255,0.8)' }}>
                            <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.gradient, boxShadow: `0 4px 12px ${s.shadow}`, color: '#ffffff' }}>
                                {s.icon}
                            </div>
                            <div>
                                <div className="text-xl font-black" style={{ color: '#0f172a' }}>{s.value}</div>
                                <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══ RANK PROGRESS BAR ═══ */}
            <div className="max-w-6xl mx-auto px-4 mb-6">
                <div className="rounded-2xl p-5" style={{ background: '#ffffff', boxShadow: `0 2px 12px rgba(0,0,0,0.04), 0 0 20px ${d.currentRank.color}15, 0 0 40px ${d.currentRank.color}08`, border: `1px solid ${d.currentRank.color}20` }}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: '#0f172a' }}>{d.currentRank.icon} {d.currentRank.name} Rank</span>
                        <span className="text-xs font-black" style={{ color: d.currentRank.color }}>{points} pts</span>
                    </div>
                    <div className="h-4 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }} suppressHydrationWarning>
                        <div suppressHydrationWarning className="h-full rounded-full transition-all duration-1000 relative" style={{ width: `${Math.max(d.rankProgressPercent, 2)}%`, background: `linear-gradient(90deg, ${d.currentRank.color}, ${d.currentRank.color}cc)`, boxShadow: `0 0 20px ${d.currentRank.color}40` }}>
                            <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)' }} />
                        </div>
                    </div>
                    <div className="flex justify-between text-[10px] mt-1.5 font-medium" style={{ color: '#475569' }}>
                        <span>{d.currentRank.icon} {d.currentRank.name}</span>
                        <span style={{ color: d.pointsToNextRank > 0 ? '#475569' : '#10b981' }}>
                            {d.nextRank ? `${d.pointsToNextRank} pts to ${d.nextRank.icon} ${d.nextRank.name}` : '🎉 Max Rank Achieved!'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ═══ MAIN CONTENT ═══ */}
            <div className="max-w-6xl mx-auto px-4 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">

                    {/* LEFT: Tests */}
                    <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 0 20px rgba(99,102,241,0.08), 0 0 40px rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)' }}>
                        {/* Tests header */}
                        <div className="p-5 pb-3">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff' }}><Play size={14} /></div>
                                <h2 className="text-base font-black" style={{ color: '#0f172a' }}>Available Tests</h2>
                            </div>
                            {/* Subject tabs */}
                            <div className="flex flex-wrap gap-2 pb-1">
                                {dynamicSubjects.map(sub => {
                                    const isActive = activeSubject === sub.id;
                                    return (
                                        <button key={sub.id} onClick={() => setActiveSubject(sub.id)}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-all hover:shadow-md"
                                            style={{
                                                background: isActive ? `linear-gradient(135deg, ${sub.color}, ${sub.color}dd)` : '#f8fafc',
                                                border: isActive ? `1.5px solid ${sub.color}` : '1.5px solid #e2e8f0',
                                                color: isActive ? '#ffffff' : '#475569',
                                                boxShadow: isActive ? `0 4px 14px ${sub.color}35` : '0 1px 3px rgba(0,0,0,0.04)',
                                                transform: isActive ? 'scale(1.03)' : 'scale(1)',
                                            }}>
                                            {sub.emoji} {sub.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)' }} />
                        {/* Tests list */}
                        <div className="p-5 pt-3">
                            <div className="min-h-[120px] max-h-[420px] overflow-y-auto space-y-3 pr-1">
                                {d.isLoadingMain ? (
                                    <div className="flex items-center justify-center py-12 text-[12px] font-semibold" style={{ color: '#475569' }}><Loader2 size={16} className="animate-spin mr-2" />Loading tests…</div>
                                ) : !d.user ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: '#f1f5f9' }}><Lock size={20} style={{ color: '#475569' }} /></div>
                                        <p className="text-sm font-semibold" style={{ color: '#475569' }}>Login to see your tests</p>
                                    </div>
                                ) : d.availableTests.length === 0 && d.lockedTests.length === 0 && d.simpleTests.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: '#f1f5f9' }}><BookOpen size={20} style={{ color: '#475569' }} /></div>
                                        <p className="text-sm font-semibold" style={{ color: '#475569' }}>No tests configured yet</p>
                                    </div>
                                ) : (
                                    <>
                                        {filterBySubject(d.availableTests).map(test => (
                                            <TestCard key={test.id} test={test} attempted={d.attemptedTestIds.has(test.id)} onStart={() => window.location.href = `/test/${test.id}`} />
                                        ))}
                                        {filterBySubject(d.lockedTests).map(test => (
                                            <div key={test.id} className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: '#f8fafc', border: '1px dashed #d1d5db' }}>
                                                <Lock size={14} style={{ color: '#475569' }} />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[12px] font-semibold truncate" style={{ color: '#475569' }}>{test.title}</h4>
                                                    <p className="text-[10px] font-medium" style={{ color: '#475569' }}>🔒 Unlock at Level {test.level_no || 1}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {d.availableTests.length === 0 && d.lockedTests.length === 0 && d.simpleTests.length > 0 && (
                                            <>
                                                {filterBySubject(d.simpleTests.filter(t => t.is_active)).map((test: any) => (
                                                    <div key={test.id} className="rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ background: '#ffffff', border: '1px solid #e8ecf1', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                                        <div className="p-4 flex items-start gap-3">
                                                            <div className="h-10 w-10 flex items-center justify-center rounded-xl text-[11px] font-black flex-shrink-0" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#ffffff' }}>T</div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="text-[13px] font-bold truncate" style={{ color: '#0f172a' }}>{test.title}</h4>
                                                                    {test.category && <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase" style={{ background: '#eef2ff', color: '#6366f1' }}>{test.category}</span>}
                                                                </div>
                                                                <div className="mt-2 flex items-center gap-3 text-[10px] font-semibold" style={{ color: '#475569' }}>
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg" style={{ background: '#f1f5f9' }}><Clock size={10} />{test.duration_minutes}m</span>
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg" style={{ background: '#f1f5f9' }}><Target size={10} />{test.questions?.length || 0}Q</span>
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg" style={{ background: '#ecfdf5', color: '#10b981' }}><Zap size={10} />{test.total_points}pts</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="px-4 pb-3 flex justify-end">
                                                            <Link href={`/test/${test.id}`} className="px-5 py-2 rounded-xl text-[11px] font-bold inline-flex items-center gap-1.5 transition-all hover:shadow-xl hover:scale-[1.03]" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', color: '#ffffff' }}>
                                                                <Play size={12} style={{ color: '#ffffff' }} />Start Test
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                                {filterBySubject(d.simpleTests.filter(t => t.is_active)).length === 0 && (
                                                    <div className="text-center py-8 text-[11px] font-medium" style={{ color: '#475569' }}>No tests for this subject.</div>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT Column */}
                    <div className="flex flex-col gap-5">

                        {/* Live & Upcoming */}
                        <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 0 20px rgba(16,185,129,0.08), 0 0 40px rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}>
                            <div className="p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)', borderBottom: '1px solid #d1fae5' }}>
                                <h3 className="text-sm font-black flex items-center gap-2" style={{ color: '#065f46' }}>
                                    <span className="relative flex h-2.5 w-2.5"><span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#10b981', opacity: 0.5 }} /><span className="h-2.5 w-2.5 rounded-full" style={{ background: '#10b981' }} /></span>
                                    Live & Upcoming
                                </h3>
                                <span className="text-[9px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: '#10b981' }}>LIVE</span>
                            </div>
                            <div className="p-4">
                                {d.liveTests.length === 0 ? (
                                    <div className="text-center py-4">
                                                    <p className="text-[11px] font-medium" style={{ color: '#475569' }}>No live tests right now</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-44 overflow-y-auto">
                                        {d.liveTests.map(test => (
                                            <div key={test.id} className="rounded-xl px-4 py-3 flex items-center justify-between" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                                <div>
                                                    <h4 className="text-[12px] font-bold" style={{ color: '#0f172a' }}>{test.title}</h4>
                                                    <div className="text-[9px] mt-0.5 font-medium" style={{ color: '#475569' }}>{d.formatDateTime(test.live_start)} – {d.formatDateTime(test.live_end)}</div>
                                                </div>
                                                <Link href={`/test/${test.id}`} className="px-4 py-1.5 rounded-xl text-[10px] font-bold text-white transition-all hover:shadow-lg" style={{ background: '#10b981' }}>
                                                    <Play size={10} className="inline mr-1" />Join
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Leaderboard */}
                        <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 0 25px rgba(245,158,11,0.1), 0 0 50px rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
                            {/* Header */}
                            <div className="p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7, #fde68a)', borderBottom: '1px solid #fde68a' }}>
                                <h3 className="text-sm font-black flex items-center gap-2" style={{ color: '#78350f' }}>
                                    <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow: '0 2px 8px rgba(251,191,36,0.4)' }}>
                                        <Trophy size={13} style={{ color: '#fff' }} />
                                    </div>
                                    Leaderboard
                                </h3>
                                <div className="flex items-center gap-1">
                                    <span className="text-[9px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 2px 6px rgba(245,158,11,0.3)' }}>🏆 TOP RANKS</span>
                                </div>
                            </div>
                            <div className="p-3">
                                {d.leaderboard.length === 0 ? (
                                    <div className="text-center py-6">
                                        <span className="text-2xl mb-2 block">🏆</span>
                                    <p className="text-[11px] font-medium" style={{ color: '#475569' }}>{d.leaderboardError || 'No rankings yet — be the first!'}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                                        {d.leaderboard.map((row, idx) => {
                                            const isRowLegend = idx === 0 && (row.total_xp || 0) >= 800;
                                            const rowRank = d.getRankForPoints(row.total_xp || 0, isRowLegend);
                                            const isTop3 = idx < 3;
                                            const pts = row.total_xp || 0;
                                            return (
                                                <div key={row.id} className="relative rounded-xl overflow-hidden transition-all hover:scale-[1.01] hover:shadow-md" style={{
                                                    background: idx === 0
                                                        ? 'linear-gradient(135deg, #fdf2f8, #fce7f3, #fbcfe8)'
                                                        : idx === 1
                                                        ? 'linear-gradient(135deg, #ecfdf5, #d1fae5, #a7f3d0)'
                                                        : idx === 2
                                                        ? 'linear-gradient(135deg, #f0f9ff, #e0f2fe, #bae6fd)'
                                                        : '#fafbfc',
                                                    border: idx === 0 ? '1.5px solid #ec4899'
                                                        : idx === 1 ? '1.5px solid #10b981'
                                                        : idx === 2 ? '1.5px solid #0ea5e9'
                                                        : `1px solid ${rowRank.color}20`,
                                                    boxShadow: idx === 0 ? '0 4px 20px rgba(236,72,153,0.2), 0 0 30px rgba(236,72,153,0.08)'
                                                        : idx === 1 ? '0 4px 16px rgba(16,185,129,0.18), 0 0 25px rgba(16,185,129,0.06)'
                                                        : idx === 2 ? '0 4px 16px rgba(14,165,233,0.18), 0 0 25px rgba(14,165,233,0.06)'
                                                        : 'none',
                                                }}>
                                                    {/* Rank color accent bar */}
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: idx === 0 ? 'linear-gradient(180deg, #ec4899, #db2777)' : idx === 1 ? 'linear-gradient(180deg, #10b981, #059669)' : idx === 2 ? 'linear-gradient(180deg, #0ea5e9, #0284c7)' : `linear-gradient(180deg, ${rowRank.color}, ${rowRank.color}80)` }} />

                                                    <div className="flex items-center gap-3 pl-4 pr-3 py-3">
                                                        {/* Rank Position + Icon */}
                                                        <div className="relative flex-shrink-0">
                                                            <div className="h-10 w-10 rounded-xl flex items-center justify-center text-lg" style={{
                                                                background: `linear-gradient(135deg, ${rowRank.color}20, ${rowRank.color}35)`,
                                                                border: `1.5px solid ${rowRank.color}40`,
                                                                boxShadow: isTop3 ? `0 0 12px ${rowRank.color}20` : 'none',
                                                            }}>
                                                                {rowRank.icon}
                                                            </div>
                                                            {/* Position badge */}
                                                            <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-black" style={{
                                                                background: idx === 0 ? 'linear-gradient(135deg, #ec4899, #db2777)'
                                                                    : idx === 1 ? 'linear-gradient(135deg, #10b981, #059669)'
                                                                    : idx === 2 ? 'linear-gradient(135deg, #0ea5e9, #0284c7)'
                                                                    : isTop3 ? `linear-gradient(135deg, ${rowRank.color}, ${rowRank.color}cc)` : '#e2e8f0',
                                                                color: isTop3 ? '#fff' : '#475569',
                                                                boxShadow: idx === 0 ? '0 2px 8px rgba(236,72,153,0.5)'
                                                                    : idx === 1 ? '0 2px 6px rgba(16,185,129,0.4)'
                                                                    : idx === 2 ? '0 2px 6px rgba(14,165,233,0.4)'
                                                                    : isTop3 ? `0 2px 6px ${rowRank.color}40` : 'none',
                                                                border: '2px solid #fff',
                                                            }}>
                                                                {idx + 1}
                                                            </div>
                                                        </div>

                                                        {/* Name + Rank */}
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-[12px] font-bold truncate block" style={{ color: idx === 0 ? '#9d174d' : idx === 1 ? '#065f46' : idx === 2 ? '#075985' : '#0f172a' }}>{row.full_name || 'Player'}</span>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: idx === 0 ? '#ec4899' : idx === 1 ? '#10b981' : idx === 2 ? '#0ea5e9' : rowRank.color }}>
                                                                    {idx === 0 ? '🥇 ' : idx === 1 ? '🥈 ' : idx === 2 ? '🥉 ' : ''}{rowRank.name}
                                                                </span>
                                                                <span className="h-1 w-1 rounded-full" style={{ background: '#cbd5e1' }}></span>
                                                                <span className="text-[9px] font-bold" style={{ color: idx === 0 ? '#db2777' : idx === 1 ? '#059669' : idx === 2 ? '#0284c7' : '#f59e0b' }}>🪙 {pts}</span>
                                                            </div>
                                                        </div>

                                                        {/* Rank # */}
                                                        <div className="text-right flex-shrink-0">
                                                            <span className="text-[10px] font-black" style={{ color: rowRank.color }}>#{row.track_rank}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ HISTORY ═══ */}
                <div className="mt-5 rounded-2xl overflow-hidden" style={{ background: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 0 25px rgba(6,182,212,0.1), 0 0 50px rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)' }}>
                    <div className="p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #f0f9ff, #ecfeff)', borderBottom: '1px solid #cffafe' }}>
                        <h3 className="text-sm font-black flex items-center gap-2" style={{ color: '#164e63' }}>
                            <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', boxShadow: '0 2px 8px rgba(6,182,212,0.3)' }}>
                                <Clock size={13} style={{ color: '#fff' }} />
                            </div>
                            Recent Attempts
                        </h3>
                        <button onClick={() => d.reloadAll()} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[10px] font-bold transition-all hover:shadow-md hover:scale-[1.03] text-white" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', boxShadow: '0 2px 8px rgba(6,182,212,0.25)' }}>
                            <RefreshCw size={11} />Refresh
                        </button>
                    </div>
                    <div className="p-3">
                        {d.attemptHistory.length === 0 && d.mySimpleResults.length === 0 ? (
                            <div className="text-center py-8">
                                <span className="text-3xl mb-2 block">📝</span>
                                <p className="text-[11px] font-medium" style={{ color: '#475569' }}>No attempts yet. Complete a test to see results!</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                                {(d.attemptHistory.length > 0 ? d.attemptHistory : d.mySimpleResults.map((r: any) => ({
                                    id: r.id, test_title: d.simpleTests.find((t: any) => t.id === r.test_id)?.title || 'Test',
                                    total_marks: r.total_points || r.score || 0, score: r.score || 0, accuracy: r.total_points ? Math.round((r.score / r.total_points) * 100) : 0,
                                    status: 'SUBMITTED', durationLabel: '-', submitted_at: r.completed_at,
                                }))).map((row: any) => {
                                    const isAuto = row.status === 'AUTO_SUBMITTED';
                                    const acc = row.accuracy || 0;
                                    const accColor = acc >= 70 ? '#10b981' : acc >= 40 ? '#f59e0b' : '#ef4444';
                                    return (
                                        <div key={row.id} className="relative rounded-xl overflow-hidden transition-all hover:shadow-md hover:scale-[1.005]" style={{ background: '#fafbfc', border: '1px solid #f1f5f9' }}>
                                            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: isAuto ? 'linear-gradient(180deg, #f59e0b, #d97706)' : 'linear-gradient(180deg, #10b981, #059669)' }} />
                                            <div className="flex items-center gap-3 pl-4 pr-3 py-3">
                                                <div className="h-11 w-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${accColor}15, ${accColor}25)`, border: `1.5px solid ${accColor}35` }}>
                                                    <span className="text-[13px] font-black" style={{ color: accColor }}>{row.score}</span>
                                                    <span className="text-[7px] font-bold" style={{ color: `${accColor}99` }}>/{row.total_marks} pts</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-[12px] font-bold truncate" style={{ color: '#0f172a' }}>{row.test_title}</h4>
                                                        <span className="text-[8px] px-2 py-0.5 rounded-full font-bold flex-shrink-0" style={{ background: isAuto ? '#fffbeb' : '#ecfdf5', color: isAuto ? '#d97706' : '#059669', border: `1px solid ${isAuto ? '#fde68a' : '#a7f3d0'}` }}>
                                                            {isAuto ? '⏱ Auto' : '✅ Done'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2.5 mt-1">
                                                        <span className="text-[9px] font-bold" style={{ color: accColor }}>{acc.toFixed ? acc.toFixed(0) : acc}% accuracy</span>
                                                        <span className="h-1 w-1 rounded-full" style={{ background: '#cbd5e1' }}></span>
                                                        <span className="text-[9px] font-medium" style={{ color: '#475569' }}>{d.formatDateTime(row.submitted_at || row.started_at)}</span>
                                                    </div>
                                                </div>
                                                <Link href={`/review/${row.id}`} className="px-4 py-2 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all hover:shadow-lg hover:scale-[1.05] flex-shrink-0" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 3px 10px rgba(99,102,241,0.3)', color: '#ffffff' }}>
                                                    <Eye size={12} style={{ color: '#ffffff' }} />Review
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══ BADGE EXPLANATION ═══ */}
            <div className="max-w-6xl mx-auto px-4 mb-6">
                <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 0 20px rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.1)' }}>
                    <div className="p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe, #e0e7ff)', borderBottom: '1px solid #ddd6fe' }}>
                        <h3 className="text-sm font-black flex items-center gap-2" style={{ color: '#4c1d95' }}>
                            <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', boxShadow: '0 2px 8px rgba(139,92,246,0.3)' }}>
                                <span className="text-[13px]">🏅</span>
                            </div>
                            How Badges & Ranks Work
                        </h3>
                    </div>
                    <div className="p-5">
                        <p className="text-[12px] font-medium mb-4" style={{ color: '#475569', lineHeight: '1.7' }}>
                            Earn points by completing tests! Each correct answer earns you points (only on your <strong>first attempt</strong>). As you collect points, you unlock higher rank badges:
                        </p>
                        <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid #e2e8f0' }}>
                            <table className="w-full text-[11px]">
                                <thead>
                                    <tr style={{ background: '#f8fafc' }}>
                                        <th className="text-left px-3 py-2.5 font-bold" style={{ color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Badge</th>
                                        <th className="text-left px-3 py-2.5 font-bold" style={{ color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Rank</th>
                                        <th className="text-left px-3 py-2.5 font-bold" style={{ color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Points Required</th>
                                        <th className="text-left px-3 py-2.5 font-bold hidden sm:table-cell" style={{ color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { icon: '🥉', name: 'Bronze', pts: '0', color: '#cd7f32', note: 'Starting rank for everyone' },
                                        { icon: '🥈', name: 'Silver', pts: '50', color: '#94a3b8', note: 'Keep practicing!' },
                                        { icon: '🥇', name: 'Gold', pts: '150', color: '#f59e0b', note: 'Great progress!' },
                                        { icon: '💎', name: 'Platinum', pts: '300', color: '#06b6d4', note: 'You\'re a pro!' },
                                        { icon: '💠', name: 'Diamond', pts: '500', color: '#8b5cf6', note: 'Elite performer' },
                                        { icon: '👑', name: 'Legend', pts: '800+', color: '#ef4444', note: '⭐ Exclusive — Only #1 player!' },
                                    ].map((r, i) => (
                                        <tr key={i} style={{ borderBottom: i < 5 ? '1px solid #f1f5f9' : 'none', background: r.name === 'Legend' ? '#fef2f210' : 'transparent' }}>
                                            <td className="px-3 py-2.5">
                                                <span className="text-lg">{r.icon}</span>
                                            </td>
                                            <td className="px-3 py-2.5 font-bold" style={{ color: r.color }}>{r.name}</td>
                                            <td className="px-3 py-2.5 font-semibold" style={{ color: '#475569' }}>{r.pts} pts</td>
                                            <td className="px-3 py-2.5 font-medium hidden sm:table-cell" style={{ color: '#475569' }}>{r.note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                                <span className="text-[13px] mt-0.5">⚡</span>
                                <p className="text-[11px] font-medium" style={{ color: '#92400e', lineHeight: '1.6' }}>
                                    <strong>Points are earned only on your first test attempt.</strong> Retaking a test does not add extra points. Your score equals the number of correct answers.
                                </p>
                            </div>
                            <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                                <span className="text-[13px] mt-0.5">👑</span>
                                <p className="text-[11px] font-medium" style={{ color: '#991b1b', lineHeight: '1.6' }}>
                                    <strong>Legend badge is exclusive!</strong> Only the #1 ranked player with at least 800 points can hold the Legend title. All other players with 500+ points receive the Diamond badge.
                                </p>
                            </div>
                            <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                                <span className="text-[13px] mt-0.5">🎯</span>
                                <p className="text-[11px] font-medium" style={{ color: '#065f46', lineHeight: '1.6' }}>
                                    <strong>Tip:</strong> Focus on accuracy! More correct answers = more points = higher rank. Practice regularly to climb the leaderboard!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── FOOTER ── */}
            <footer style={{ background: '#ffffff', borderTop: '1px solid #e8ecf1' }}>
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-[10px] font-semibold" style={{ color: '#475569' }}>
                    <span>© Knobly Web · Powered by knobly</span>
                    <Link href="/" className="flex items-center gap-1 transition-all hover:text-indigo-500" style={{ color: '#475569' }}>
                        <ArrowLeft size={10} /> Back to Home
                    </Link>
                </div>
            </footer>
        </div>
    );
}

/* ── Test Card ── */
function TestCard({ test, attempted, onStart }: { test: any; attempted?: boolean; onStart: () => void }) {
    return (
        <div className="rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ background: '#ffffff', border: attempted ? '1px solid #bbf7d0' : '1px solid #e8ecf1', boxShadow: attempted ? '0 2px 8px rgba(16,185,129,0.08)' : '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div className="p-4 flex items-start gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl text-[10px] font-black flex-shrink-0" style={{ background: attempted ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6366f1, #818cf8)', boxShadow: attempted ? '0 4px 12px rgba(16,185,129,0.3)' : '0 4px 12px rgba(99,102,241,0.3)', color: '#ffffff' }}>
                    {attempted ? '✓' : `Lv${test.level_no || 1}`}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="text-[13px] font-bold truncate" style={{ color: '#0f172a' }}>{test.title}</h4>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            {attempted && <span className="px-2 py-0.5 rounded-full text-[8px] font-bold" style={{ background: '#ecfdf5', color: '#059669' }}>Attempted ✓</span>}
                            {test.mode === 'PRACTICE'
                                ? <span className="px-2 py-0.5 rounded-full text-[8px] font-bold" style={{ background: '#f1f5f9', color: '#475569' }}>Practice</span>
                                : <span className="px-2 py-0.5 rounded-full text-[8px] font-bold flex items-center gap-1 text-white" style={{ background: '#ef4444' }}><span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#fff' }} />LIVE</span>}
                        </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold" style={{ color: '#475569' }}>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg" style={{ background: '#f1f5f9' }}><Clock size={10} />{test.duration_minutes}m</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg" style={{ background: '#f1f5f9' }}><Target size={10} />{test.total_marks || test.total_points || 0}Q</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg" style={{ background: '#ecfdf5', color: '#10b981' }}><Zap size={10} />{test.xp_reward || test.total_marks || 0} pts</span>
                    </div>
                </div>
            </div>
            <div className="px-4 pb-3 flex items-center justify-between" style={{ borderTop: '1px solid #f5f5f5' }}>
                <span className="text-[9px] truncate font-medium" style={{ color: '#475569' }}>{test.category || test.level_title || 'Level test'}</span>
                <button onClick={onStart} className="px-5 py-2 rounded-xl text-[11px] font-bold inline-flex items-center gap-1.5 transition-all hover:shadow-xl hover:scale-[1.03]" style={{ background: attempted ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: attempted ? '0 4px 14px rgba(245,158,11,0.35)' : '0 4px 14px rgba(99,102,241,0.35)', color: '#ffffff' }}>
                    <Play size={12} style={{ color: '#ffffff' }} />{attempted ? 'Try Again' : 'Start'}
                </button>
            </div>
        </div>
    );
}
