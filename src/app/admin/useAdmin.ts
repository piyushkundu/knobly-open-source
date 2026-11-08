'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import {
    collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, limit, serverTimestamp, writeBatch
} from 'firebase/firestore';

/* ── helper: safe getDocs ── */
async function safeDocs(q: any): Promise<any[]> {
    try {
        const snap = await getDocs(q);
        return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    } catch (e: any) {
        if (e?.code === 'permission-denied' || e?.message?.includes('Missing or insufficient permissions')) {
            throw new Error('PERMISSION_DENIED');
        }
        console.warn('[Admin] query failed:', e);
        return [];
    }
}

/* ── helper: try with orderBy, fallback to plain ── */
async function safeOrderedDocs(col: any, field: string, dir: 'asc' | 'desc' = 'desc'): Promise<any[]> {
    try {
        const snap = await getDocs(query(col, orderBy(field, dir)));
        return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    } catch (e: any) {
        if (e?.code === 'permission-denied' || e?.message?.includes('Missing or insufficient permissions')) {
            throw new Error('PERMISSION_DENIED');
        }
        // Index might not exist — fallback to unordered
        try {
            const snap = await getDocs(col);
            const docs = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
            // Sort client-side
            return docs.sort((a: any, b: any) => {
                const aVal = a[field]?.seconds || a[field] || 0;
                const bVal = b[field]?.seconds || b[field] || 0;
                return dir === 'desc' ? bVal - aVal : aVal - bVal;
            });
        } catch (e2: any) {
            if (e2?.code === 'permission-denied' || e2?.message?.includes('Missing or insufficient permissions')) {
                throw new Error('PERMISSION_DENIED');
            }
            console.warn('[Admin] collection read failed:', e2);
            return [];
        }
    }
}

export function useAdmin() {
    const { user, isAdmin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [mobileMenu, setMobileMenu] = useState(false);

    // Data
    const [stats, setStats] = useState({ users: 0, tests: 0, questions: 0, apps: 0 });
    const [tests, setTests] = useState<any[]>([]);
    // ... (rest of states) ...
    const [questions, setQuestions] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [levels, setLevels] = useState<any[]>([]);
    const [badges, setBadges] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [apps, setApps] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);

    // Test Editor
    const emptyTest = { id: null as string | null, title: '', mode: 'PRACTICE', duration_minutes: 30, total_marks: 20, xp_reward: 50, live_start: '', live_end: '', is_active: true, category: '' };
    const [currentTest, setCurrentTest] = useState({ ...emptyTest });
    const [saving, setSaving] = useState(false);

    // Question Manager
    const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
    const [showQModal, setShowQModal] = useState(false);
    const [importMode, setImportMode] = useState(false);
    const [importText, setImportText] = useState('');
    const [importLogs, setImportLogs] = useState<string[]>([]);
    const emptyQ = { id: null as string | null, text: '', type: 'MCQ', marks: 1, difficulty: 'EASY', options: [{ text: '', is_correct: false }, { text: '', is_correct: false }] };
    const [qForm, setQForm] = useState({ ...emptyQ });

    // Results
    const [resultFilter, setResultFilter] = useState({ testId: '', userId: '' });
    const [showAttemptModal, setShowAttemptModal] = useState(false);
    const [attemptDetail, setAttemptDetail] = useState<any>({ userName: '', testTitle: '', questions: [] });

    // Users
    const [userSearch, setUserSearch] = useState('');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [currentProfile, setCurrentProfile] = useState<any>({});

    // Gamification
    const [editingLevelId, setEditingLevelId] = useState<string | null>(null);
    const [levelForm, setLevelForm] = useState({ level_no: '', required_xp: '', title: '' });
    const [editingBadgeId, setEditingBadgeId] = useState<string | null>(null);
    const [badgeForm, setBadgeForm] = useState({ badge_name: '', badge_icon: '', xp_reward: '', description: '' });

    // Resources
    const [notifMsg, setNotifMsg] = useState('');
    const [notifLink, setNotifLink] = useState('');
    const [appForm, setAppForm] = useState({ name: '', link: '', icon: '' });
    const [videoForm, setVideoForm] = useState({ id: '', title: '' });

    const filteredUsers = useMemo(() => {
        if (!userSearch) return users;
        const q = userSearch.toLowerCase();
        return users.filter(u => (u.full_name || u.displayName || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q));
    }, [users, userSearch]);

    // ═══════════════ REFRESH ALL ═══════════════
    const refreshAll = useCallback(async () => {
        setLoading(true);
        setPageError(null);
        try {
            // Load each collection individually so one failure doesn't block others
            const [u, t, l, b, n, a, v] = await Promise.all([
                safeOrderedDocs(collection(db, 'profiles'), 'created_at', 'desc'),
                safeOrderedDocs(collection(db, 'exam_tests'), 'created_at', 'desc'),
                safeOrderedDocs(collection(db, 'exam_levels'), 'level_no', 'asc'),
                safeDocs(collection(db, 'exam_badges')),
                safeOrderedDocs(collection(db, 'notifications'), 'created_at', 'desc'),
                safeOrderedDocs(collection(db, 'apps'), 'created_at', 'desc'),
                safeOrderedDocs(collection(db, 'videos'), 'created_at', 'desc'),
            ]);

            // Count questions separately
            let qCount = 0;
            try {
                const qSnap = await getDocs(collection(db, 'exam_questions'));
                qCount = qSnap.size;
            } catch { /* ignore */ }

            setUsers(u); setTests(t);
            setLevels(l); setBadges(b);
            setNotifications(n); setApps(a); setVideos(v);
            setStats({ users: u.length, tests: t.length, questions: qCount, apps: a.length });

            // Load results
            try {
                const rSnap = await getDocs(query(collection(db, 'exam_attempts'), orderBy('started_at', 'desc'), limit(50)));
                setResults(rSnap.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch {
                try {
                    const rSnap = await getDocs(collection(db, 'exam_attempts'));
                    setResults(rSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                } catch { /* ignore */ }
            }
        } catch (e) {
            console.error('refreshAll error', e);
        }
        setLoading(false);
    }, []);

    useEffect(() => { if (isAdmin) refreshAll(); }, [isAdmin, refreshAll]);

    // ═══════════════ TEST CRUD ═══════════════
    const resetTestForm = () => setCurrentTest({ ...emptyTest });
    const editTest = (t: any) => setCurrentTest({ ...t });
    const saveTest = async () => {
        setSaving(true);
        try {
            const payload: any = { ...currentTest };
            if (payload.mode !== 'LIVE') { delete payload.live_start; delete payload.live_end; }
            if (currentTest.id) {
                const id = currentTest.id;
                delete payload.id; delete payload.created_at;
                await updateDoc(doc(db, 'exam_tests', id), payload);
            } else {
                delete payload.id;
                payload.created_at = serverTimestamp();
                await addDoc(collection(db, 'exam_tests'), payload);
            }
            resetTestForm();
            await refreshAll();
        } catch (e: any) {
            console.error('Save test error:', e);
            alert('Error: ' + (e.message || 'Could not save test'));
        }
        setSaving(false);
    };
    const deleteTest = async (id: string) => {
        if (!confirm('Delete this test and all its questions?')) return;
        try {
            // Also delete questions belonging to this test
            const qSnap = await getDocs(query(collection(db, 'exam_questions'), where('test_id', '==', id)));
            const batch = writeBatch(db);
            qSnap.forEach(d => batch.delete(d.ref));
            batch.delete(doc(db, 'exam_tests', id));
            await batch.commit();
            await refreshAll();
        } catch (e: any) {
            console.error('Delete test error:', e);
            // Fallback: just delete the test
            try { await deleteDoc(doc(db, 'exam_tests', id)); await refreshAll(); } catch { alert('Error deleting test'); }
        }
    };

    // ═══════════════ QUESTION CRUD ═══════════════
    const loadQuestions = useCallback(async (testId?: string) => {
        const tid = testId || selectedTestId;
        if (!tid) { setQuestions([]); return; }
        try {
            const snap = await getDocs(query(collection(db, 'exam_questions'), where('test_id', '==', tid)));
            const qs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            qs.sort((a: any, b: any) => (a.created_at?.seconds || 0) - (b.created_at?.seconds || 0));
            setQuestions(qs);
        } catch (e) {
            console.error('loadQuestions error:', e);
            setQuestions([]);
        }
    }, [selectedTestId]);

    const openAddQ = () => {
        setQForm({ ...emptyQ, options: [{ text: '', is_correct: false }, { text: '', is_correct: false }] });
        setShowQModal(true);
    };

    const editQuestion = async (q: any) => {
        try {
            const optsSnap = await getDocs(query(collection(db, 'exam_options'), where('question_id', '==', q.id)));
            const opts = optsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            setQForm({
                id: q.id,
                text: q.question_text,
                type: q.question_type,
                marks: q.marks || 1,
                difficulty: q.difficulty || 'EASY',
                options: opts.length ? opts.map((o: any) => ({ id: o.id, text: o.option_text, is_correct: o.is_correct })) : []
            });
            setShowQModal(true);
        } catch (e) {
            console.error('editQuestion error:', e);
            alert('Error loading question options');
        }
    };

    const saveQuestion = async () => {
        if (!qForm.text) return alert('Question text required');
        if (!selectedTestId) return alert('No test selected');
        const payload: any = {
            test_id: selectedTestId,
            question_text: qForm.text,
            question_type: qForm.type,
            marks: qForm.marks,
            difficulty: qForm.difficulty,
        };
        try {
            let qId = qForm.id;
            if (qId) {
                await updateDoc(doc(db, 'exam_questions', qId), payload);
                // Delete old options
                try {
                    const optsSnap = await getDocs(query(collection(db, 'exam_options'), where('question_id', '==', qId)));
                    if (!optsSnap.empty) {
                        const batch = writeBatch(db);
                        optsSnap.forEach(d => batch.delete(d.ref));
                        await batch.commit();
                    }
                } catch { /* ignore old option cleanup */ }
            } else {
                payload.created_at = serverTimestamp();
                const docRef = await addDoc(collection(db, 'exam_questions'), payload);
                qId = docRef.id;
            }
            // Add new options
            if (qForm.type !== 'SHORT' && qId) {
                const validOpts = qForm.options.filter(o => o.text.trim());
                if (validOpts.length) {
                    const batch = writeBatch(db);
                    validOpts.forEach(o => {
                        const newRef = doc(collection(db, 'exam_options'));
                        batch.set(newRef, { question_id: qId, option_text: o.text, is_correct: o.is_correct });
                    });
                    await batch.commit();
                }
            }
            setShowQModal(false);
            await loadQuestions();
        } catch (e: any) {
            console.error('saveQuestion error:', e);
            alert('Error saving: ' + (e.message || 'Unknown error'));
        }
    };

    const deleteQuestion = async (id: string) => {
        if (!confirm('Delete question?')) return;
        try {
            // Also delete its options
            const optsSnap = await getDocs(query(collection(db, 'exam_options'), where('question_id', '==', id)));
            const batch = writeBatch(db);
            optsSnap.forEach(d => batch.delete(d.ref));
            batch.delete(doc(db, 'exam_questions', id));
            await batch.commit();
            await loadQuestions();
        } catch {
            try { await deleteDoc(doc(db, 'exam_questions', id)); await loadQuestions(); } catch { alert('Error deleting question'); }
        }
    };

    // ═══════════════ IMPORT ═══════════════
    const parseAndImport = async () => {
        if (!selectedTestId) return alert('Select a test first');
        if (!importText.trim()) return alert('Paste questions first');
        setImportLogs(['Starting import...']);
        const blocks = importText.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
        const items: any[] = [];
        blocks.forEach(block => {
            const lines = block.split(/\n/).map(l => l.trim()).filter(Boolean);
            const qLine = lines.find(l => l.includes('?')) || lines[0];
            const question = qLine.replace(/^\d+[.)]\s*/, '');
            const options: any[] = [];
            lines.forEach(l => {
                if (/^[A-E][.)]/.test(l)) {
                    let clean = l.replace(/^[A-E][.)]\s*/, '');
                    let isCorr = false;
                    if (clean.includes('*')) { isCorr = true; clean = clean.replace('*', '').trim(); }
                    options.push({ text: clean, is_correct: isCorr });
                }
            });
            if (!options.find(o => o.is_correct) && options.length) options[0].is_correct = true;
            items.push({ question, options, type: options.length ? 'MCQ' : 'SHORT' });
        });
        setImportLogs(prev => [...prev, `Parsed ${items.length} questions. Uploading...`]);
        try {
            // Firestore batch limit is 500; chunk if needed
            for (let i = 0; i < items.length; i += 50) {
                const chunk = items.slice(i, i + 50);
                const batch = writeBatch(db);
                for (const item of chunk) {
                    const qRef = doc(collection(db, 'exam_questions'));
                    batch.set(qRef, { test_id: selectedTestId, question_text: item.question, question_type: item.type || 'MCQ', marks: 1, difficulty: 'EASY', created_at: serverTimestamp() });
                    if (item.options?.length) {
                        item.options.forEach((o: any) => {
                            const oRef = doc(collection(db, 'exam_options'));
                            batch.set(oRef, { question_id: qRef.id, option_text: o.text, is_correct: o.is_correct || false });
                        });
                    }
                }
                await batch.commit();
                setImportLogs(prev => [...prev, `Batch ${Math.floor(i / 50) + 1} committed.`]);
            }
            setImportLogs(prev => [...prev, `Success! Imported ${items.length} questions.`]);
            await loadQuestions();
            setImportText('');
        } catch (e) {
            console.error('Import error:', e);
            setImportLogs(prev => [...prev, 'Error uploading batch.']);
        }
    };

    // ═══════════════ RESULTS ═══════════════
    const loadResults = async (testId?: string, userId?: string) => {
        const tId = testId ?? resultFilter.testId;
        const uId = userId ?? resultFilter.userId;
        try {
            let constraints: any[] = [];
            if (tId) constraints.push(where('test_id', '==', tId));
            if (uId) constraints.push(where('user_id', '==', uId));
            // Try with orderBy first
            let docs: any[] = [];
            try {
                const snap = await getDocs(query(collection(db, 'exam_attempts'), ...constraints, orderBy('started_at', 'desc'), limit(50)));
                docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            } catch {
                // Fallback without orderBy
                const snap = await getDocs(query(collection(db, 'exam_attempts'), ...constraints));
                docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                docs.sort((a, b) => (b.started_at?.seconds || 0) - (a.started_at?.seconds || 0));
                docs = docs.slice(0, 50);
            }
            setResults(docs);
        } catch (e) {
            console.error('loadResults error:', e);
        }
    };

    const getUserName = (uid: string) => {
        const u = users.find(u => u.id === uid);
        return u?.full_name || u?.displayName || uid?.substring(0, 8) + '...';
    };
    const getTestName = (tid: string) => tests.find(t => t.id === tid)?.title || tid?.substring(0, 8) + '...';

    const viewAttemptDetail = async (attempt: any) => {
        try {
            const u = users.find(x => x.id === attempt.user_id);
            const t = tests.find(x => x.id === attempt.test_id);
            const rSnap = await getDocs(query(collection(db, 'exam_responses'), where('attempt_id', '==', attempt.id)));
            const responses = rSnap.docs.map(d => d.data());
            const qIds = responses.map((r: any) => r.question_id);
            if (!qIds.length) {
                setAttemptDetail({ userName: u?.full_name || u?.displayName, testTitle: t?.title, questions: [] });
                setShowAttemptModal(true);
                return;
            }
            const qsSnap = await getDocs(query(collection(db, 'exam_questions'), where('test_id', '==', attempt.test_id)));
            const qs = qsSnap.docs.filter(d => qIds.includes(d.id)).map(d => ({ id: d.id, ...d.data() }));

            // Firestore 'in' query max 10 items per query
            let allOpts: any[] = [];
            for (let i = 0; i < qIds.length; i += 10) {
                const chunk = qIds.slice(i, i + 10);
                try {
                    const optsSnap = await getDocs(query(collection(db, 'exam_options'), where('question_id', 'in', chunk)));
                    allOpts.push(...optsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                } catch { /* ignore */ }
            }

            setAttemptDetail({
                userName: u?.full_name || u?.displayName, testTitle: t?.title,
                questions: qs.map((q: any) => {
                    const userResp: any = responses.find((r: any) => r.question_id === q.id);
                    return { text: q.question_text, userSelected: userResp?.option_id, options: allOpts.filter((o: any) => o.question_id === q.id) };
                })
            });
            setShowAttemptModal(true);
        } catch (e) {
            console.error('viewAttemptDetail error:', e);
            alert('Error loading attempt details');
        }
    };

    // ═══════════════ USER MGMT ═══════════════
    const openUserProfile = async (u: any) => {
        try {
            let xp = 0;
            try {
                const xpSnap = await getDocs(query(collection(db, 'exam_user_state'), where('user_id', '==', u.id)));
                if (!xpSnap.empty) xp = (xpSnap.docs[0].data() as any).total_xp || (xpSnap.docs[0].data() as any).total_points || 0;
            } catch { /* no xp data */ }

            let badgeNames: string[] = [];
            try {
                const bSnap = await getDocs(query(collection(db, 'exam_user_badges'), where('user_id', '==', u.id)));
                const badgeIds = bSnap.docs.map(d => (d.data() as any).badge_id);
                badgeNames = badgeIds.map(bid => badges.find(b => b.id === bid)?.badge_name || bid);
            } catch { /* no badge data */ }

            setCurrentProfile({
                full_name: u.full_name || u.displayName || 'Unknown',
                email: u.email,
                total_xp: xp,
                badges: badgeNames
            });
            setShowProfileModal(true);
        } catch (e) {
            console.error('openUserProfile error:', e);
        }
    };

    const deleteUser = async (uid: string) => {
        if (!confirm('Delete this user? This cannot be undone.')) return;
        try {
            await deleteDoc(doc(db, 'profiles', uid));
            // Also try to delete from users collection
            try { await deleteDoc(doc(db, 'users', uid)); } catch { /* might not exist */ }
            await refreshAll();
        } catch (e: any) {
            console.error('deleteUser error:', e);
            alert('Error deleting user: ' + (e.message || ''));
        }
    };

    // ═══════════════ GAMIFICATION ═══════════════
    const editLevel = (l: any) => { setEditingLevelId(l.id); setLevelForm({ level_no: l.level_no || '', required_xp: l.required_xp || '', title: l.title || '' }); };
    const cancelLevelEdit = () => { setEditingLevelId(null); setLevelForm({ level_no: '', required_xp: '', title: '' }); };
    const saveLevel = async () => {
        try {
            const data = { ...levelForm, level_no: Number(levelForm.level_no) || 0, required_xp: Number(levelForm.required_xp) || 0 };
            if (editingLevelId) {
                await updateDoc(doc(db, 'exam_levels', editingLevelId), data as any);
            } else {
                await addDoc(collection(db, 'exam_levels'), data);
            }
            await refreshAll();
            cancelLevelEdit();
        } catch (e: any) {
            console.error('saveLevel error:', e);
            alert('Error: ' + (e.message || 'Could not save level'));
        }
    };
    const deleteLevel = async (id: string) => {
        if (!confirm('Delete level?')) return;
        try { await deleteDoc(doc(db, 'exam_levels', id)); await refreshAll(); } catch (e: any) { alert('Error: ' + e.message); }
    };

    const editBadge = (b: any) => { setEditingBadgeId(b.id); setBadgeForm({ badge_name: b.badge_name || '', badge_icon: b.badge_icon || '', xp_reward: b.xp_reward || '', description: b.description || '' }); };
    const cancelBadgeEdit = () => { setEditingBadgeId(null); setBadgeForm({ badge_name: '', badge_icon: '', xp_reward: '', description: '' }); };
    const saveBadge = async () => {
        try {
            const data = { ...badgeForm, xp_reward: Number(badgeForm.xp_reward) || 0 };
            if (editingBadgeId) {
                await updateDoc(doc(db, 'exam_badges', editingBadgeId), data as any);
            } else {
                await addDoc(collection(db, 'exam_badges'), data);
            }
            await refreshAll();
            cancelBadgeEdit();
        } catch (e: any) {
            console.error('saveBadge error:', e);
            alert('Error: ' + (e.message || 'Could not save badge'));
        }
    };
    const deleteBadge = async (id: string) => {
        if (!confirm('Delete badge?')) return;
        try { await deleteDoc(doc(db, 'exam_badges', id)); await refreshAll(); } catch (e: any) { alert('Error: ' + e.message); }
    };

    // ═══════════════ RESOURCES ═══════════════
    const sendNotification = async () => {
        if (!notifMsg.trim()) return alert('Type a message first');
        try {
            await addDoc(collection(db, 'notifications'), { message: notifMsg, link: notifLink || null, created_at: serverTimestamp() });
            setNotifMsg(''); setNotifLink('');
            await refreshAll();
            alert('Notification sent!');
        } catch (e: any) {
            console.error('sendNotification error:', e);
            alert('Error: ' + (e.message || 'Could not send'));
        }
    };
    const deleteNotification = async (id: string) => {
        try { await deleteDoc(doc(db, 'notifications', id)); await refreshAll(); } catch (e: any) { alert('Error: ' + e.message); }
    };

    const deployApp = async () => {
        if (!appForm.name.trim()) return alert('App name required');
        try {
            await addDoc(collection(db, 'apps'), { name: appForm.name, link: appForm.link, icon_class: appForm.icon, is_system_app: true, created_at: serverTimestamp(), user_id: null });
            setAppForm({ name: '', link: '', icon: '' });
            await refreshAll();
        } catch (e: any) {
            console.error('deployApp error:', e);
            alert('Error: ' + (e.message || 'Could not deploy app'));
        }
    };
    const deleteApp = async (id: string) => {
        try { await deleteDoc(doc(db, 'apps', id)); await refreshAll(); } catch (e: any) { alert('Error: ' + e.message); }
    };

    const publishVideo = async () => {
        if (!videoForm.id.trim()) return alert('Video ID required');
        try {
            await addDoc(collection(db, 'videos'), { youtube_id: videoForm.id, title: videoForm.title || 'Untitled', views: 'Featured', created_at: serverTimestamp() });
            setVideoForm({ id: '', title: '' });
            await refreshAll();
        } catch (e: any) {
            console.error('publishVideo error:', e);
            alert('Error: ' + (e.message || 'Could not publish video'));
        }
    };
    const deleteVideo = async (id: string) => {
        try { await deleteDoc(doc(db, 'videos', id)); await refreshAll(); } catch (e: any) { alert('Error: ' + e.message); }
    };

    return {
        user, isAdmin, loading, pageError, activeTab, setActiveTab, mobileMenu, setMobileMenu,
        stats, refreshAll,
        tests, currentTest, setCurrentTest, saving, resetTestForm, editTest, saveTest, deleteTest,
        questions, selectedTestId, setSelectedTestId, showQModal, setShowQModal, qForm, setQForm, loadQuestions, openAddQ, editQuestion, saveQuestion, deleteQuestion,
        importMode, setImportMode, importText, setImportText, importLogs, parseAndImport,
        results, resultFilter, setResultFilter, loadResults, getUserName, getTestName, viewAttemptDetail, showAttemptModal, setShowAttemptModal, attemptDetail,
        users, userSearch, setUserSearch, filteredUsers, openUserProfile, deleteUser, showProfileModal, setShowProfileModal, currentProfile,
        levels, badges, levelForm, setLevelForm, badgeForm, setBadgeForm,
        editingLevelId, editLevel, cancelLevelEdit, saveLevel, deleteLevel,
        editingBadgeId, editBadge, cancelBadgeEdit, saveBadge, deleteBadge,
        notifications, apps, videos, notifMsg, setNotifMsg, notifLink, setNotifLink, appForm, setAppForm, videoForm, setVideoForm,
        sendNotification, deleteNotification, deployApp, deleteApp, publishVideo, deleteVideo,
    };
}
