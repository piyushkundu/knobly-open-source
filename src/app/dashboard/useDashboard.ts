'use client';
import { useState, useEffect, useMemo, useCallback, useEffectEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { fetchLeaderboard } from '@/lib/leaderboard-client';
import { legacyExamList } from '@/lib/exam-client';
import { progressDisplay, progressPoints } from '@/lib/progress-display';
import type { LeaderboardRow } from '@/types/leaderboard';
import {
    collection, getDocs, getDoc, doc, setDoc, updateDoc,
    query, where
} from 'firebase/firestore';

/* ── Interfaces ── */
export interface Profile { id: string; full_name?: string; exam_track?: string;[k: string]: any; }
export interface UserState { user_id: string; track_id?: string | null; current_level: number; total_xp: number; total_points?: number; streak_days: number;[k: string]: any; }
export interface Level { id: string; level_no: number; title: string; description?: string; required_xp: number; track_id?: string;[k: string]: any; }
export interface ExamTest {
    id: string; title: string; level_id?: string; level_no?: number; level_title?: string;
    required_xp?: number; mode: string; duration_minutes: number; total_marks: number; xp_reward: number;
    is_active: boolean; live_start?: string; live_end?: string; live_bonus_xp?: number;[k: string]: any;
}
export type LeaderRow = LeaderboardRow;
export interface Badge { id: string; badge_name: string; badge_icon?: string; description?: string; xp_reward?: number;[k: string]: any; }
export interface Attempt {
    id: string; test_id?: string; test_title: string; total_marks: number; durationLabel: string;
    status: string; score: number; accuracy: number; submitted_at?: string; started_at?: string;
}
export interface Stats { testsCompleted: number; avgScore: number; avgAccuracy: number; totalCorrect: number; totalWrong: number; }

const RANKS = [
    { name: 'Bronze', icon: '🥉', minPoints: 0, color: '#cd7f32' },
    { name: 'Silver', icon: '🥈', minPoints: 50, color: '#94a3b8' },
    { name: 'Gold', icon: '🥇', minPoints: 150, color: '#f59e0b' },
    { name: 'Platinum', icon: '💎', minPoints: 300, color: '#06b6d4' },
    { name: 'Diamond', icon: '💠', minPoints: 500, color: '#8b5cf6' },
    { name: 'Legend', icon: '👑', minPoints: 800, color: '#ef4444' },
];

/* ── Hook ── */
export function useDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [userState, setUserState] = useState<UserState | null>(null);
    const [levels, setLevels] = useState<Level[]>([]);
    const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
    const [availableTests, setAvailableTests] = useState<ExamTest[]>([]);
    const [lockedTests, setLockedTests] = useState<ExamTest[]>([]);
    const [liveTests, setLiveTests] = useState<ExamTest[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderRow[]>([]);
    const [leaderboardError, setLeaderboardError] = useState('');
    const [badges, setBadges] = useState<Badge[]>([]);
    const [attemptHistory, setAttemptHistory] = useState<Attempt[]>([]);
    const [isLoadingMain, setIsLoadingMain] = useState(true);
    const [trackSaving, setTrackSaving] = useState(false);
    const [trackError, setTrackError] = useState('');
    const [activeTest, setActiveTest] = useState<ExamTest | null>(null);
    const [stats, setStats] = useState<Stats>({ testsCompleted: 0, avgScore: 0, avgAccuracy: 0, totalCorrect: 0, totalWrong: 0 });

    const [simpleTests, setSimpleTests] = useState<any[]>([]);
    const [simpleResults, setSimpleResults] = useState<any[]>([]);
    const [attemptedTestIds, setAttemptedTestIds] = useState<Set<string>>(new Set());
    const [categories, setCategories] = useState<any[]>([]);

    const avatarInitials = useMemo(() => {
        const name = profile?.full_name || user?.displayName || '';
        if (!name) return 'ST';
        const parts = name.trim().split(/\s+/);
        return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
    }, [profile, user]);

    /* ── Rank System ── */
    const totalPoints = useMemo(() => userState?.total_points || userState?.total_xp || 0, [userState]);

    const getRankForPoints = useCallback((pts: number, isLegend: boolean = false) => {
        const maxIdx = isLegend ? RANKS.length - 1 : RANKS.length - 2; // Cap at Diamond unless Legend
        for (let i = maxIdx; i >= 0; i--) {
            if (pts >= RANKS[i].minPoints) return RANKS[i];
        }
        return RANKS[0];
    }, []);

    const [isLegendUser, setIsLegendUser] = useState(false);

    const currentRank = useMemo(() => {
        const maxIdx = isLegendUser ? RANKS.length - 1 : RANKS.length - 2;
        for (let i = maxIdx; i >= 0; i--) {
            if (totalPoints >= RANKS[i].minPoints) return RANKS[i];
        }
        return RANKS[0];
    }, [totalPoints, isLegendUser]);

    const nextRank = useMemo(() => {
        const idx = RANKS.findIndex(r => r.name === currentRank.name);
        return idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
    }, [currentRank]);

    const rankProgressPercent = useMemo(() => {
        if (!nextRank) return 100;
        const range = nextRank.minPoints - currentRank.minPoints;
        const progress = totalPoints - currentRank.minPoints;
        return Math.min(100, Math.round((progress / range) * 100));
    }, [totalPoints, currentRank, nextRank]);

    const pointsToNextRank = useMemo(() => {
        if (!nextRank) return 0;
        return Math.max(0, nextRank.minPoints - totalPoints);
    }, [totalPoints, nextRank]);

    const unlockedTestsForLevel = useMemo(() =>
        availableTests.filter(t => t.level_id === activeLevelId), [availableTests, activeLevelId]);

    const lockedTestsForLevel = useMemo(() =>
        lockedTests.filter(t => t.level_id === activeLevelId), [lockedTests, activeLevelId]);

    function formatDateTime(value?: string) {
        if (!value) return '-';
        return new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    }

    /* ── Load functions ── */
    async function loadProfile() {
        if (!user) return null;
        try {
            const snap = await getDoc(doc(db, 'profiles', user.uid));
            if (snap.exists()) { const p = { id: snap.id, ...snap.data() } as Profile; setProfile(p); return p; }
        } catch (e) { console.error('Profile error:', e); }
        return null;
    }

    async function loadUserState(): Promise<UserState | null> {
        if (!user) return null;
        try {
            const q = query(collection(db, 'exam_user_state'), where('user_id', '==', user.uid));
            const snap = await getDocs(q);
            if (snap.empty) {
                const newState: UserState = { user_id: user.uid, current_level: 1, total_xp: 0, streak_days: 0 };
                await setDoc(doc(db, 'exam_user_state', user.uid), { ...newState, created_at: new Date().toISOString() });
                setUserState(newState);
                return newState;
            } else {
                const rows = [...snap.docs].sort((a,b) => progressPoints(b.data()) - progressPoints(a.data()) || a.id.localeCompare(b.id));
                const state = { ...progressDisplay(rows[0].data()), user_id:user.uid } as UserState;
                setUserState(state);
                return state;
            }
        } catch (e) { console.error('loadUserState error:', e); }
        return null;
    }

    async function loadLevels(): Promise<Level[]> {
        try {
            const snap = await getDocs(collection(db, 'exam_levels'));
            const lvls = snap.docs.map(d => ({ id: d.id, ...d.data() } as Level));
            lvls.sort((a, b) => (a.level_no || 0) - (b.level_no || 0));
            setLevels(lvls);
            if (lvls.length > 0 && !activeLevelId) setActiveLevelId(lvls[0].id);
            return lvls;
        } catch (e) { console.error('loadLevels error:', e); }
        return [];
    }

    async function loadTests(progress: UserState | null = userState, lvls: Level[] = levels): Promise<ExamTest[]> {
        try {
            let snap;
            try {
                snap = await getDocs(query(collection(db, 'exam_tests'), where('is_active', '==', true)));
            } catch {
                // Fallback: load all tests and filter client-side
                snap = await getDocs(collection(db, 'exam_tests'));
            }
            const tests = snap.docs.map(d => ({ id: d.id, ...d.data() } as ExamTest)).filter(t => t.is_active !== false);
            const xp = progress?.total_points || progress?.total_xp || 0;
            const allLvls = lvls;
            const unlocked: ExamTest[] = [], locked: ExamTest[] = [];
            tests.forEach(t => {
                const lvl = allLvls.find(l => l.id === t.level_id) || {} as any;
                const levelNo = lvl.level_no || 1;
                const reqXp = !t.level_id ? 0 : (t.required_xp ?? lvl.required_xp ?? (100 + (levelNo - 1) * 50));
                const obj = { ...t, level_no: levelNo, level_title: lvl.title, required_xp: reqXp };
                if (xp >= reqXp) unlocked.push(obj); else locked.push(obj);
            });
            const sorter = (a: ExamTest, b: ExamTest) => (a.level_no || 1) - (b.level_no || 1);
            setAvailableTests(unlocked.sort(sorter));
            setLockedTests(locked.sort(sorter));
            return tests;
        } catch (e) { console.error('loadTests error:', e); }
        return [];
    }

    async function loadLiveTests() {
        try {
            let snap;
            try {
                snap = await getDocs(query(collection(db, 'exam_tests'), where('mode', '==', 'LIVE'), where('is_active', '==', true)));
            } catch {
                snap = await getDocs(collection(db, 'exam_tests'));
            }
            const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as ExamTest)).filter(t => t.mode === 'LIVE' && t.is_active !== false);
            const now = new Date();
            setLiveTests(all.filter(t => t.live_end && new Date(t.live_end) > now).sort((a, b) => new Date(a.live_start || '').getTime() - new Date(b.live_start || '').getTime()));
        } catch (e) { console.error('loadLiveTests error:', e); }
    }

    async function loadLeaderboard() {
        setLeaderboardError('');
        if (!user) { setLeaderboard([]); setIsLegendUser(false); return; }
        try {
            const board = await fetchLeaderboard(user);
            const top = board[0];
            setIsLegendUser(Boolean(top?.is_current_user && top.total_xp >= 800));
            setLeaderboard(board);
        } catch (e) {
            // Never fall back to downloading private account/profile collections.
            setLeaderboard([]);
            setIsLegendUser(false);
            setLeaderboardError('Rankings are temporarily unavailable. Please try again.');
            console.warn('Leaderboard temporarily unavailable:', e);
        }
    }

    async function loadBadges() {
        if (!user) return;
        try {
            const q = query(collection(db, 'exam_user_badges'), where('user_id', '==', user.uid));
            const snap = await getDocs(q);
            const userBadges = snap.docs.map(d => d.data());
            if (userBadges.length === 0) { setBadges([]); return; }
            const badgeIds = userBadges.map(ub => ub.badge_id);
            const bSnap = await getDocs(collection(db, 'exam_badges'));
            const allBadges = bSnap.docs.map(d => ({ id: d.id, ...d.data() } as Badge));
            setBadges(allBadges.filter(b => badgeIds.includes(b.id)));
        } catch (e) { console.error('loadBadges error:', e); }
    }

    async function loadAttempts(loadedTests: ExamTest[] = [...availableTests, ...lockedTests]) {
        if (!user) return;
        try {
            const q = query(collection(db, 'exam_attempts'), where('user_id', '==', user.uid));
            const snap = await getDocs(q);
            const attempts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            // Sort client-side to avoid Firebase composite index errors
            attempts.sort((a: any, b: any) => new Date(b.submitted_at || 0).getTime() - new Date(a.submitted_at || 0).getTime());
            const recentAttempts = attempts.slice(0, 20);
            const testMap: Record<string, any> = {};
            loadedTests.forEach(t => testMap[t.id] = t);

            // Fetch titles for test_ids not in testMap
            const missingIds = [...new Set(recentAttempts.map((r: any) => r.test_id).filter((id: string) => id && !testMap[id]))];
            if (missingIds.length > 0) {
                await Promise.all(missingIds.map(async (tid: string) => {
                    try {
                        const testSnap = await getDoc(doc(db, 'exam_tests', tid));
                        if (testSnap.exists()) {
                            testMap[tid] = { id: tid, ...testSnap.data() };
                        }
                    } catch (e) { /* skip */ }
                }));
            }

            const hist = recentAttempts.map((row: any) => {
                const t = testMap[row.test_id] || { title: 'Unknown Test' };
                return {
                    id: row.id, test_id: row.test_id, test_title: t.title, total_marks: t.total_marks || t.total_points || row.score || 0,
                    durationLabel: t.duration_minutes ? `${t.duration_minutes} min` : '-',
                    status: row.status, score: row.score, accuracy: row.accuracy || 0,
                    submitted_at: row.submitted_at, started_at: row.started_at,
                } as Attempt;
            });
            setAttemptHistory(hist);
            // Build set of attempted test IDs
            const attemptedIds = new Set<string>();
            attempts.forEach((a: any) => { if (a.test_id && (a.status === 'SUBMITTED' || a.status === 'AUTO_SUBMITTED')) attemptedIds.add(a.test_id); });
            setAttemptedTestIds(attemptedIds);
            // Build full history for stats (unlimited, not just top 20)
            const allHist = attempts.map((row: any) => {
                const t = testMap[row.test_id] || { title: 'Unknown Test' };
                return {
                    id: row.id, test_id: row.test_id, test_title: t.title, total_marks: t.total_marks || t.total_points || row.score || 0,
                    durationLabel: t.duration_minutes ? `${t.duration_minutes} min` : '-',
                    status: row.status, score: row.score, accuracy: row.accuracy || 0,
                    submitted_at: row.submitted_at, started_at: row.started_at,
                } as Attempt;
            });
            calcStats(allHist);
        } catch (e) { console.error('loadAttempts error:', e); }
    }

    function calcStats(allAttempts: Attempt[]) {
        if (!allAttempts.length) { setStats({ testsCompleted: 0, avgScore: 0, avgAccuracy: 0, totalCorrect: 0, totalWrong: 0 }); return; }
        
        // Find the FIRST attempt for each test_id
        // Filter only submitted attempts
        const submitted = allAttempts.filter(a => a.test_id && (a.status === 'SUBMITTED' || a.status === 'AUTO_SUBMITTED'));
        
        // Sort chronologically (oldest first) so the first we see is the actual first attempt
        submitted.sort((a, b) => new Date(a.submitted_at || 0).getTime() - new Date(b.submitted_at || 0).getTime());
        
        const firstAttemptsMap = new Map<string, Attempt>();
        submitted.forEach(r => {
            if (r.test_id && !firstAttemptsMap.has(r.test_id)) {
                firstAttemptsMap.set(r.test_id, r);
            }
        });
        
        const firstAttempts = Array.from(firstAttemptsMap.values());
        if (!firstAttempts.length) { setStats({ testsCompleted: 0, avgScore: 0, avgAccuracy: 0, totalCorrect: 0, totalWrong: 0 }); return; }
        
        let totalScorePercent = 0, totalAcc = 0, correct = 0, wrong = 0;
        firstAttempts.forEach(r => {
            const totalPts = r.total_marks || 1;
            const scoreVal = r.score || 0;
            // Convert score to percentage of total marks
            const scorePercent = (scoreVal / totalPts) * 100;
            totalScorePercent += scorePercent;
            // Use accuracy if available, otherwise compute from score
            const acc = r.accuracy || scorePercent;
            totalAcc += acc;
            const c = Math.round((acc / 100) * totalPts);
            correct += c; wrong += Math.max(0, totalPts - c);
        });
        const n = firstAttempts.length;
        setStats({ testsCompleted: n, avgScore: n ? totalScorePercent / n : 0, avgAccuracy: n ? totalAcc / n : 0, totalCorrect: correct, totalWrong: wrong });
    }

    // Also load simpler Next.js collections for fallback
    async function loadSimpleTests() {
        if (!user) return;
        try {
            setSimpleTests((await legacyExamList(user)).tests);
        } catch (e) { console.warn('Simple tests load error:', e); }
    }

    async function loadSimpleResults() {
        if (!user) return;
        try {
            const q = query(collection(db, 'test_results'), where('user_id', '==', user.uid));
            const snap = await getDocs(q);
            const results = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
            results.sort((a, b) => new Date(b.completed_at || 0).getTime() - new Date(a.completed_at || 0).getTime());
            setSimpleResults(results);
        } catch (e) { console.warn('Simple results load error:', e); }
    }

    async function setTrack(trackId: string) {
        if (!user) { setTrackError('User not logged in.'); return; }
        setTrackSaving(true); setTrackError('');
        try {
            await updateDoc(doc(db, 'profiles', user.uid), { exam_track: trackId });
            await loadProfile();
            const [progress, lvls] = await Promise.all([loadUserState(),loadLevels()]);
            await loadTests(progress,lvls);
            await loadLiveTests();
            await loadLeaderboard();
        } catch (e: any) { setTrackError(e.message ?? 'Unknown error'); }
        finally { setTrackSaving(false); }
    }

    async function loadCategories() {
        try {
            const snap = await getDocs(collection(db, 'exam_categories'));
            const cats = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
            setCategories(cats);
        } catch (e) { console.error('loadCategories error:', e); }
    }

    async function initData() {
        if (!user) return;
        await loadProfile();
        const [progress, lvls] = await Promise.all([loadUserState(),loadLevels()]);
        // Pass the values just loaded; React state belongs to the current render.
        await Promise.allSettled([
            loadTests(progress,lvls).then(tests => loadAttempts(tests)),
            loadLiveTests(),
            loadLeaderboard(),
            loadBadges(),
            loadSimpleTests(),
            loadSimpleResults(),
            loadCategories(),
        ]);
        setIsLoadingMain(false);
    }

    async function reloadAll() {
        if (!user) return;
        setIsLoadingMain(true);
        await initData();
    }

    const initializeDashboard = useEffectEvent(() => { void initData(); });
    useEffect(() => { if (user && !authLoading) initializeDashboard(); }, [user, authLoading]);
    const mySimpleResults = useMemo(() => simpleResults.filter(r => r.user_id === user?.uid), [simpleResults, user]);

    return {
        user, authLoading, profile, userState, levels, activeLevelId, setActiveLevelId,
        availableTests, lockedTests, liveTests, leaderboard, leaderboardError, badges, attemptHistory, attemptedTestIds,
        isLoadingMain, stats, avatarInitials, totalPoints, currentRank, nextRank, rankProgressPercent, pointsToNextRank, RANKS, getRankForPoints, isLegendUser,
        unlockedTestsForLevel, lockedTestsForLevel, formatDateTime,
        activeTest, setActiveTest, setTrack, trackSaving, trackError, reloadAll,
        simpleTests, mySimpleResults, categories,
    };
}
