'use client';
import { useState, useEffect, useCallback, useRef, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import TypingKeyboard from '@/components/typing/TypingKeyboard';
import TypingHands from '@/components/typing/TypingHands';
import {
  LESSONS, PRACTICE_TEXTS, GAME_WORDS, ACHIEVEMENTS,
  DEFAULT_STATS, TypingStats, playKeySound, getTypingLevel, getCertificate,
} from '@/components/typing/typingData';

type Mode = 'learn' | 'practice' | 'game' | 'test' | 'smart' | 'profile';
type LearnView = 'menu' | 'typing';

function loadStats(): TypingStats { try { const d = localStorage.getItem('knobly-typing-stats'); return d ? { ...DEFAULT_STATS, ...JSON.parse(d) } : { ...DEFAULT_STATS }; } catch { return { ...DEFAULT_STATS }; } }
function saveStats(s: TypingStats) { localStorage.setItem('knobly-typing-stats', JSON.stringify(s)); }

const COURSE_SECTIONS = [
  { id: 'beginner', label: 'Beginner', icon: 'ph-bold ph-plant', color: '#22c55e', lessons: [0, 1, 2, 3, 4] },
  { id: 'intermediate', label: 'Intermediate', icon: 'ph-bold ph-tree', color: '#3b82f6', lessons: [5, 6, 7, 8] },
  { id: 'advanced', label: 'Advanced', icon: 'ph-bold ph-mountains', color: '#8b5cf6', lessons: [9, 10, 11] },
];

export default function TypingPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [mode, setMode] = useState<Mode>('learn');
  const [learnView, setLearnView] = useState<LearnView>('menu');
  const [activeSection, setActiveSection] = useState('beginner');
  const statsRef = useRef<TypingStats>(DEFAULT_STATS);
  const [, forceRender] = useState(0);
  const rerender = () => forceRender(n => n + 1);

  useEffect(() => { statsRef.current = loadStats(); rerender(); }, []);
  const persistStats = useCallback(() => { saveStats(statsRef.current); }, []);
  const updateStatsRef = useCallback((fn: (s: TypingStats) => TypingStats) => {
    statsRef.current = fn(statsRef.current);
    const s = statsRef.current;
    const newA = ACHIEVEMENTS.filter(a => !s.achievements.includes(a.id) && a.condition(s)).map(a => a.id);
    if (newA.length > 0) statsRef.current = { ...s, achievements: [...s.achievements, ...newA] };
    const today = new Date().toISOString().slice(0, 10);
    if (statsRef.current.lastPracticeDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      statsRef.current.dailyStreak = statsRef.current.lastPracticeDate === yesterday ? statsRef.current.dailyStreak + 1 : 1;
      statsRef.current.lastPracticeDate = today;
    }
    persistStats();
  }, [persistStats]);

  // ═══ LEARN STATE ═══
  const [lessonIdx, setLessonIdx] = useState(0);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const learnPosRef = useRef(0);
  const charsRef = useRef<HTMLDivElement>(null);
  const [kbActiveKey, setKbActiveKey] = useState('');
  const [kbPressedKey, setKbPressedKey] = useState('');
  const [kbCorrect, setKbCorrect] = useState<boolean | undefined>();
  const lesson = LESSONS[lessonIdx];
  const exercise = lesson?.exercises[exerciseIdx] || '';

  // ═══ PRACTICE STATE ═══
  const [practiceText, setPracticeText] = useState(PRACTICE_TEXTS[0]);
  const practicePosRef = useRef(0);
  const practiceCharsRef = useRef<HTMLDivElement>(null);
  const practiceStartRef = useRef(0);
  const [practiceWpm, setPracticeWpm] = useState(0);

  // ═══ GAME STATE ═══
  const [gameActive, setGameActive] = useState(false);
  const [gameWords, setGameWords] = useState<{ id: number; word: string; y: number; x: number }[]>([]);
  const [gameInput, setGameInput] = useState('');
  const [gameScore, setGameScore] = useState(0);
  const [gameLives, setGameLives] = useState(5);
  const [gameCombo, setGameCombo] = useState(0);
  const gameIdRef = useRef(0);
  const gameLoopRef = useRef<number>(0);
  const gameSpawnRef = useRef<number>(0);
  const gameSpeedRef = useRef(1);

  // ═══ TEST STATE ═══
  const [testDuration, setTestDuration] = useState(60);
  const [testActive, setTestActive] = useState(false);
  const [testTimeLeft, setTestTimeLeft] = useState(60);
  const [testText, setTestText] = useState('');
  const testPosRef = useRef(0);
  const testCharsRef = useRef<HTMLDivElement>(null);
  const testInputRef = useRef('');
  const testTimerRef = useRef<number>(0);
  const [testResult, setTestResult] = useState<{ wpm: number; accuracy: number; errors: number } | null>(null);

  // ═══ SMART STATE ═══
  const [smartExercise, setSmartExercise] = useState('');
  const smartPosRef = useRef(0);
  const smartCharsRef = useRef<HTMLDivElement>(null);

  // ═══ Styles ═══
  const panelBg = isDark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.92)';
  const cardBg = isDark ? 'rgba(30,41,59,0.5)' : 'rgba(255,255,255,0.95)';
  const textMain = isDark ? '#e2e8f0' : '#1e293b';
  const textSub = isDark ? '#64748b' : '#94a3b8';
  const borderC = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const sidebarBg = isDark ? 'rgba(15,23,42,0.95)' : 'rgba(248,250,252,0.98)';

  // ═══ DOM helpers ═══
  const colorChar = (container: HTMLDivElement | null, idx: number, color: string, bg: string = 'transparent') => {
    if (!container) return;
    const el = container.children[idx] as HTMLElement;
    if (!el) return;
    const isBox = el.tagName === 'DIV';
    if (isBox) {
      // Character box style (learn mode)
      el.style.color = color;
      el.style.background = color === '#22c55e' ? '#dcfce7' : color === '#ef4444' ? '#fef2f2' : '#fff';
      el.style.borderColor = color === '#22c55e' ? '#22c55e' : color === '#ef4444' ? '#ef4444' : '#e5e7eb';
      if (color === '#22c55e') el.style.boxShadow = '0 2px 4px rgba(34,197,94,0.15)';
    } else {
      el.style.color = color;
      el.style.background = bg;
    }
  };
  const setCursor = (container: HTMLDivElement | null, idx: number) => {
    if (!container) return;
    const old = container.querySelector('.typing-cursor-active');
    if (old) {
      const isBox = old.tagName === 'DIV';
      if (isBox) {
        (old as HTMLElement).style.background = '#fff';
        (old as HTMLElement).style.borderColor = '#e5e7eb';
        (old as HTMLElement).style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)';
        (old as HTMLElement).style.transform = '';
      } else {
        (old as HTMLElement).style.background = 'transparent';
        (old as HTMLElement).style.borderBottom = 'none';
      }
      old.classList.remove('typing-cursor-active');
    }
    const el = container.children[idx] as HTMLElement;
    if (!el) return;
    const isBox = el.tagName === 'DIV';
    if (isBox) {
      // Blue highlighted box like typing.com
      el.style.background = 'linear-gradient(180deg, #3b82f6, #2563eb)';
      el.style.color = '#fff';
      el.style.borderColor = '#1d4ed8';
      el.style.boxShadow = '0 4px 12px rgba(59,130,246,0.35)';
      el.style.transform = 'translateY(-2px)';
    } else {
      el.style.background = 'rgba(34,211,238,0.25)';
      el.style.borderBottom = '2.5px solid #22d3ee';
    }
    el.classList.add('typing-cursor-active');
  };

  // ═══ KEYDOWN HANDLER ═══
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === 'Tab' || e.key === 'Escape') return;
      if (mode === 'game' || mode === 'profile') return;
      if (mode === 'learn' && learnView === 'menu') return;
      if (e.key.length !== 1 && e.key !== 'Backspace') return;
      e.preventDefault();
      const key = e.key;

      if (mode === 'learn' && learnView === 'typing') {
        if (key === 'Backspace') return;
        const expected = exercise[learnPosRef.current];
        if (!expected) return;
        const correct = key === expected;
        playKeySound(correct);
        updateStatsRef(s => ({ ...s, totalCharsTyped: s.totalCharsTyped + 1, totalErrors: correct ? s.totalErrors : s.totalErrors + 1, keyHits: { ...s.keyHits, [key]: (s.keyHits[key] || 0) + 1 }, keyErrors: correct ? s.keyErrors : { ...s.keyErrors, [key]: (s.keyErrors[key] || 0) + 1 } }));
        if (correct) {
          colorChar(charsRef.current, learnPosRef.current, '#22c55e');
          learnPosRef.current++;
          setCursor(charsRef.current, learnPosRef.current);
          startTransition(() => { setKbActiveKey(exercise[learnPosRef.current] || ''); setKbPressedKey(key); setKbCorrect(true); setTimeout(() => setKbPressedKey(''), 100); });
          if (learnPosRef.current >= exercise.length) {
            setTimeout(() => {
              if (exerciseIdx < lesson.exercises.length - 1) { setExerciseIdx(prev => prev + 1); learnPosRef.current = 0; }
              else {
                updateStatsRef(s => ({ ...s, lessonsCompleted: s.lessonsCompleted.includes(lesson.id) ? s.lessonsCompleted : [...s.lessonsCompleted, lesson.id], totalWordsTyped: s.totalWordsTyped + exercise.split(' ').length }));
                setLearnView('menu'); rerender();
              }
            }, 300);
          }
        } else {
          colorChar(charsRef.current, learnPosRef.current, '#ef4444', 'rgba(239,68,68,0.15)');
          startTransition(() => { setKbPressedKey(key); setKbCorrect(false); setTimeout(() => { setKbPressedKey(''); colorChar(charsRef.current, learnPosRef.current, textSub); }, 200); });
        }
      }
      else if (mode === 'practice') {
        if (key === 'Backspace') return;
        if (practicePosRef.current === 0) practiceStartRef.current = performance.now();
        const expected = practiceText[practicePosRef.current];
        if (!expected) return;
        const correct = key === expected;
        playKeySound(correct);
        updateStatsRef(s => ({ ...s, totalCharsTyped: s.totalCharsTyped + 1, totalErrors: correct ? s.totalErrors : s.totalErrors + 1, keyHits: { ...s.keyHits, [key]: (s.keyHits[key] || 0) + 1 }, keyErrors: correct ? s.keyErrors : { ...s.keyErrors, [key]: (s.keyErrors[key] || 0) + 1 } }));
        if (correct) {
          colorChar(practiceCharsRef.current, practicePosRef.current, '#22c55e');
          practicePosRef.current++;
          setCursor(practiceCharsRef.current, practicePosRef.current);
          const elapsed = (performance.now() - practiceStartRef.current) / 60000;
          if (elapsed > 0.05) startTransition(() => setPracticeWpm(Math.round((practicePosRef.current / 5) / elapsed)));
          startTransition(() => { setKbActiveKey(practiceText[practicePosRef.current] || ''); setKbPressedKey(key); setKbCorrect(true); setTimeout(() => setKbPressedKey(''), 100); });
          if (practicePosRef.current >= practiceText.length) {
            updateStatsRef(s => ({ ...s, totalWordsTyped: s.totalWordsTyped + practiceText.split(' ').length, bestWpm: Math.max(s.bestWpm, practiceWpm) }));
            practicePosRef.current = 0; practiceStartRef.current = 0;
            startTransition(() => { setPracticeText(PRACTICE_TEXTS[Math.floor(Math.random() * PRACTICE_TEXTS.length)]); setPracticeWpm(0); });
          }
        } else {
          colorChar(practiceCharsRef.current, practicePosRef.current, '#ef4444', 'rgba(239,68,68,0.15)');
          startTransition(() => { setKbPressedKey(key); setKbCorrect(false); setTimeout(() => { setKbPressedKey(''); colorChar(practiceCharsRef.current, practicePosRef.current, textSub); }, 200); });
        }
      }
      else if (mode === 'test' && testActive) {
        if (key === 'Backspace') return;
        const expected = testText[testPosRef.current]; if (!expected) return;
        const correct = key === expected; playKeySound(correct); testInputRef.current += key;
        colorChar(testCharsRef.current, testPosRef.current, correct ? '#22c55e' : '#ef4444', correct ? 'transparent' : 'rgba(239,68,68,0.15)');
        testPosRef.current++; setCursor(testCharsRef.current, testPosRef.current);
      }
      else if (mode === 'smart' && smartExercise) {
        if (key === 'Backspace') return;
        const expected = smartExercise[smartPosRef.current]; if (!expected) return;
        const correct = key === expected; playKeySound(correct);
        updateStatsRef(s => ({ ...s, totalCharsTyped: s.totalCharsTyped + 1, totalErrors: correct ? s.totalErrors : s.totalErrors + 1, keyHits: { ...s.keyHits, [key]: (s.keyHits[key] || 0) + 1 }, keyErrors: correct ? s.keyErrors : { ...s.keyErrors, [key]: (s.keyErrors[key] || 0) + 1 } }));
        if (correct) { colorChar(smartCharsRef.current, smartPosRef.current, '#22c55e'); smartPosRef.current++; setCursor(smartCharsRef.current, smartPosRef.current); if (smartPosRef.current >= smartExercise.length) { smartPosRef.current = 0; generateSmartExercise(); } }
        else { colorChar(smartCharsRef.current, smartPosRef.current, '#ef4444', 'rgba(239,68,68,0.15)'); setTimeout(() => colorChar(smartCharsRef.current, smartPosRef.current, textSub), 200); }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mode, learnView, exercise, exerciseIdx, lessonIdx, practiceText, testActive, testText, smartExercise, isDark]);

  useEffect(() => { learnPosRef.current = 0; setTimeout(() => { setCursor(charsRef.current, 0); setKbActiveKey(exercise[0] || ''); }, 50); }, [exercise]);
  useEffect(() => { practicePosRef.current = 0; setTimeout(() => setCursor(practiceCharsRef.current, 0), 50); }, [practiceText]);

  // ═══ Start lesson ═══
  const startLesson = (idx: number) => { setLessonIdx(idx); setExerciseIdx(0); learnPosRef.current = 0; setLearnView('typing'); };

  // ═══ GAME ═══
  const startGame = () => { setGameActive(true); setGameScore(0); setGameLives(5); setGameCombo(0); gameSpeedRef.current = 1; setGameWords([]); setGameInput(''); gameIdRef.current = 0; updateStatsRef(s => ({ ...s, gamesPlayed: s.gamesPlayed + 1 })); };
  useEffect(() => {
    if (!gameActive) { cancelAnimationFrame(gameLoopRef.current); clearInterval(gameSpawnRef.current); return; }
    gameSpawnRef.current = window.setInterval(() => { const word = GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)]; gameIdRef.current++; setGameWords(prev => [...prev, { id: gameIdRef.current, word, y: 0, x: 10 + Math.random() * 70 }]); }, Math.max(800, 2000 - gameSpeedRef.current * 150));
    let last = performance.now();
    const loop = (now: number) => { const dt = (now - last) / 1000; last = now; setGameWords(prev => { const u = prev.map(w => ({ ...w, y: w.y + (30 + gameSpeedRef.current * 8) * dt })); const a = u.filter(w => w.y < 100); const m = u.length - a.length; if (m > 0) setGameLives(l => { const n = l - m; if (n <= 0) setGameActive(false); return Math.max(0, n); }); return a; }); gameLoopRef.current = requestAnimationFrame(loop); };
    gameLoopRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(gameLoopRef.current); clearInterval(gameSpawnRef.current); };
  }, [gameActive]);
  const handleGameInput = (e: React.ChangeEvent<HTMLInputElement>) => { const val = e.target.value; setGameInput(val); setGameWords(prev => { const idx = prev.findIndex(w => w.word === val.trim().toLowerCase()); if (idx >= 0) { const pts = Math.round((val.length * 10) * (1 + gameCombo * 0.2)); setGameScore(s => { const ns = s + pts; updateStatsRef(st => ({ ...st, highScore: Math.max(st.highScore, ns) })); return ns; }); setGameCombo(c => c + 1); if (gameScore % 200 < 50) gameSpeedRef.current = Math.min(gameSpeedRef.current + 0.3, 10); setGameInput(''); playKeySound(true); return prev.filter((_, i) => i !== idx); } return prev; }); };

  // ═══ TEST ═══
  const genTestText = () => [...PRACTICE_TEXTS].sort(() => Math.random() - 0.5).slice(0, 4).join(' ');
  const startTest = (dur: number) => { setTestDuration(dur); setTestTimeLeft(dur); setTestResult(null); setTestActive(true); testPosRef.current = 0; testInputRef.current = ''; setTestText(genTestText()); setTimeout(() => setCursor(testCharsRef.current, 0), 50); testTimerRef.current = window.setInterval(() => { setTestTimeLeft(prev => { if (prev <= 1) { clearInterval(testTimerRef.current); setTestActive(false); return 0; } return prev - 1; }); }, 1000); };
  useEffect(() => { if (!testActive && testTimeLeft === 0 && testInputRef.current.length > 0) { const inp = testInputRef.current; const words = inp.trim().split(/\s+/).length; const wpm = Math.round(words / (testDuration / 60)); let errors = 0; for (let i = 0; i < inp.length; i++) { if (inp[i] !== testText[i]) errors++; } const accuracy = Math.max(0, Math.round(((inp.length - errors) / Math.max(1, inp.length)) * 100)); setTestResult({ wpm, accuracy, errors }); updateStatsRef(s => ({ ...s, totalTestsTaken: s.totalTestsTaken + 1, bestWpm: Math.max(s.bestWpm, wpm), totalWordsTyped: s.totalWordsTyped + words })); rerender(); } }, [testActive, testTimeLeft]);

  // ═══ SMART ═══
  const getWeakKeys = () => { const s = statsRef.current; const w: { key: string; errorRate: number }[] = []; Object.entries(s.keyHits).forEach(([k, h]) => { const e = s.keyErrors[k] || 0; if (h > 3) w.push({ key: k, errorRate: e / h }); }); return w.sort((a, b) => b.errorRate - a.errorRate).slice(0, 8); };
  const generateSmartExercise = useCallback(() => { const weak = getWeakKeys(); const chars = weak.length > 0 ? weak.map(w => w.key) : ['a','s','d','f','j','k','l']; let text = ''; for (let i = 0; i < 40; i++) { text += chars[Math.floor(Math.random() * chars.length)]; if (i % 5 === 4) text += ' '; } smartPosRef.current = 0; setSmartExercise(text.trim()); setTimeout(() => setCursor(smartCharsRef.current, 0), 50); }, []);

  const renderChars = (text: string, ref: React.RefObject<HTMLDivElement | null>) => (
    <div ref={ref} className="font-mono text-xl md:text-2xl leading-relaxed tracking-wider select-none" style={{ color: textSub, wordBreak: 'break-all', lineHeight: 2.2 }}>
      {text.split('').map((ch, i) => (
        <span key={`${text.slice(0,3)}-${i}`} style={{ transition: 'color 0.06s, background 0.06s', padding: '3px 2px', borderRadius: 3, display: 'inline-block', borderBottom: '2.5px solid transparent', minWidth: ch === ' ' ? 14 : undefined }}>
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </div>
  );

  const stats = statsRef.current;
  const lv = getTypingLevel(stats.bestWpm);
  const completedCount = stats.lessonsCompleted.length;
  const totalLessons = LESSONS.length;
  const progressPct = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: isDark ? '#020617' : '#f1f5f9', fontFamily: "'Outfit',sans-serif" }} tabIndex={0}>

      {/* ══════ TOP HEADER BAR (typing.com style) ══════ */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 shrink-0" style={{ background: isDark ? 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.1))' : 'linear-gradient(135deg, #e0f7fa, #e8eaf6)', borderBottom: `1px solid ${borderC}` }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="w-8 h-8 rounded-lg flex items-center justify-center hover:scale-105 transition-transform" style={{ background: cardBg, border: `1px solid ${borderC}` }}>
            <i className="ph-bold ph-arrow-left text-sm" style={{ color: textMain }} />
          </button>
          {/* Level avatar */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${lv.color}30, ${lv.color}10)`, border: `2px solid ${lv.color}` }}>
            <i className="ph-bold ph-keyboard text-lg" style={{ color: lv.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 13, fontWeight: 800, color: textMain }}>{lv.level}</span>
              <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 9, fontWeight: 700, background: `${lv.color}20`, color: lv.color, border: `1px solid ${lv.color}40` }}>{completedCount}/{totalLessons} lessons</span>
            </div>
            <span style={{ fontSize: 10, color: textSub }}>{stats.bestWpm} WPM best speed</span>
          </div>
        </div>

        {/* Stats badges */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <i className="ph-bold ph-lightning" style={{ color: '#f59e0b', fontSize: 16 }} />
            <div><div style={{ fontSize: 9, color: textSub, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Speed</div><div style={{ fontSize: 14, fontWeight: 800, color: textMain }}>{stats.bestWpm}<span style={{ fontSize: 9, color: textSub }}> wpm</span></div></div>
          </div>
          <div className="flex items-center gap-1.5">
            <i className="ph-bold ph-target" style={{ color: '#ef4444', fontSize: 16 }} />
            <div><div style={{ fontSize: 9, color: textSub, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Accuracy</div><div style={{ fontSize: 14, fontWeight: 800, color: textMain }}>{stats.totalCharsTyped > 0 ? Math.round(((stats.totalCharsTyped - stats.totalErrors) / stats.totalCharsTyped) * 100) : '--'}<span style={{ fontSize: 9, color: textSub }}>%</span></div></div>
          </div>
          <div className="flex items-center gap-1.5">
            <i className="ph-bold ph-fire" style={{ color: '#f97316', fontSize: 16 }} />
            <div><div style={{ fontSize: 9, color: textSub, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Streak</div><div style={{ fontSize: 14, fontWeight: 800, color: textMain }}>{stats.dailyStreak}<span style={{ fontSize: 9, color: textSub }}> days</span></div></div>
          </div>
        </div>

        {/* Daily goal */}
        <div className="px-3 py-2 rounded-xl text-center" style={{ background: isDark ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <div style={{ fontSize: 8, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>⚡ Daily Goal</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: textMain, fontFamily: 'monospace' }}>{stats.totalWordsTyped > 0 ? Math.min(stats.totalWordsTyped, 100) : 0}/100</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ══════ LEFT SIDEBAR (typing.com style) ══════ */}
        <aside className="hidden md:flex flex-col w-[220px] shrink-0 overflow-y-auto" style={{ background: sidebarBg, borderRight: `1px solid ${borderC}` }}>
          {/* Mode navigation */}
          <div className="p-3 flex flex-col gap-1">
            <div style={{ fontSize: 9, fontWeight: 700, color: textSub, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '4px 8px' }}>Learn to Type</div>
            {COURSE_SECTIONS.map(sec => (
              <button key={sec.id} onClick={() => { setMode('learn'); setLearnView('menu'); setActiveSection(sec.id); }}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left" style={{
                  background: mode === 'learn' && activeSection === sec.id ? `${sec.color}15` : 'transparent',
                  border: `1.5px solid ${mode === 'learn' && activeSection === sec.id ? `${sec.color}40` : 'transparent'}`,
                }}>
                <div className="flex items-center gap-2">
                  <i className={sec.icon} style={{ color: sec.color, fontSize: 16 }} />
                  <span style={{ fontSize: 12, fontWeight: mode === 'learn' && activeSection === sec.id ? 700 : 500, color: mode === 'learn' && activeSection === sec.id ? sec.color : textMain }}>{sec.label}</span>
                </div>
                <i className="ph-bold ph-caret-right" style={{ fontSize: 10, color: sec.color }} />
              </button>
            ))}
          </div>

          <div style={{ height: 1, background: borderC, margin: '4px 12px' }} />

          <div className="p-3 flex flex-col gap-1">
            <div style={{ fontSize: 9, fontWeight: 700, color: textSub, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '4px 8px' }}>Practice & Games</div>
            {[{ id: 'practice' as Mode, label: 'Free Practice', icon: 'ph-bold ph-keyboard', color: '#3b82f6' },
              { id: 'game' as Mode, label: 'Falling Words', icon: 'ph-bold ph-game-controller', color: '#f59e0b' },
              { id: 'test' as Mode, label: 'Speed Test', icon: 'ph-bold ph-timer', color: '#ef4444' },
              { id: 'smart' as Mode, label: 'Smart Practice', icon: 'ph-bold ph-brain', color: '#8b5cf6' },
              { id: 'profile' as Mode, label: 'My Progress', icon: 'ph-bold ph-trophy', color: '#ec4899' },
            ].map(item => (
              <button key={item.id} onClick={() => setMode(item.id)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all text-left" style={{
                background: mode === item.id ? `${item.color}15` : 'transparent',
                border: `1.5px solid ${mode === item.id ? `${item.color}40` : 'transparent'}`,
              }}>
                <i className={item.icon} style={{ color: item.color, fontSize: 14 }} />
                <span style={{ fontSize: 12, fontWeight: mode === item.id ? 700 : 500, color: mode === item.id ? item.color : textMain }}>{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* ══════ MAIN CONTENT ══════ */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile mode tabs */}
          <nav className="md:hidden flex gap-1 px-3 py-2 overflow-x-auto" style={{ borderBottom: `1px solid ${borderC}` }}>
            {[{ id: 'learn' as Mode, icon: 'ph-bold ph-book-open', label: 'Learn' }, { id: 'practice' as Mode, icon: 'ph-bold ph-keyboard', label: 'Practice' }, { id: 'game' as Mode, icon: 'ph-bold ph-game-controller', label: 'Game' }, { id: 'test' as Mode, icon: 'ph-bold ph-timer', label: 'Test' }, { id: 'profile' as Mode, icon: 'ph-bold ph-trophy', label: 'Profile' }].map(m => (
              <button key={m.id} onClick={() => setMode(m.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap" style={{ background: mode === m.id ? 'rgba(34,211,238,0.15)' : 'transparent', color: mode === m.id ? '#22d3ee' : textSub, fontWeight: mode === m.id ? 700 : 500 }}>
                <i className={m.icon} style={{ fontSize: 12 }} />{m.label}
              </button>
            ))}
          </nav>

          <div className="px-4 md:px-8 py-6">
            <AnimatePresence mode="wait">
              <motion.div key={`${mode}-${learnView}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

                {/* ══════ LEARN — MENU VIEW (typing.com style) ══════ */}
                {mode === 'learn' && learnView === 'menu' && (
                  <div className="max-w-2xl mx-auto flex flex-col gap-5">
                    {/* Progress bar */}
                    <div className="rounded-xl p-4" style={{ background: isDark ? 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(6,182,212,0.05))' : 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(6,182,212,0.04))', border: `1px solid ${borderC}` }}>
                      <div className="flex items-center justify-between mb-2">
                        <span style={{ fontSize: 13, fontWeight: 700, color: textMain }}>{progressPct}% Complete</span>
                        <span style={{ fontSize: 10, color: textSub }}>{completedCount} of {totalLessons} lessons</span>
                      </div>
                      <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #22c55e, #06b6d4)', boxShadow: '0 0 12px rgba(34,197,94,0.4)' }} />
                      </div>
                    </div>

                    {/* Lesson sections */}
                    {COURSE_SECTIONS.filter(s => s.id === activeSection || activeSection === 'all').map(section => (
                      <div key={section.id}>
                        <div className="flex items-center gap-2 mb-3">
                          <i className={section.icon} style={{ color: section.color, fontSize: 18 }} />
                          <h2 style={{ fontSize: 16, fontWeight: 800, color: textMain }}>{section.label}</h2>
                        </div>
                        <div className="flex flex-col gap-2">
                          {section.lessons.map(li => {
                            const l = LESSONS[li];
                            const completed = stats.lessonsCompleted.includes(l.id);
                            return (
                              <div key={l.id} className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]" style={{
                                background: cardBg, border: `1.5px solid ${completed ? 'rgba(34,197,94,0.3)' : borderC}`,
                                boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                              }}>
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{
                                    background: completed ? 'rgba(34,197,94,0.15)' : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                    border: `1.5px solid ${completed ? '#22c55e' : borderC}`,
                                  }}>
                                    {completed ? <i className="ph-bold ph-check" style={{ color: '#22c55e', fontSize: 14 }} /> :
                                      <span style={{ fontSize: 12, fontWeight: 800, color: textSub }}>{li + 1}</span>}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: textMain }}>{l.title}</div>
                                    <div style={{ fontSize: 11, color: textSub }}>{l.description} • {l.exercises.length} exercises</div>
                                  </div>
                                </div>
                                <button onClick={() => startLesson(li)} className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105" style={{
                                  background: completed ? 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))' : `linear-gradient(135deg, ${section.color}, ${section.color}cc)`,
                                  color: completed ? '#22c55e' : '#fff',
                                  border: completed ? '1px solid rgba(34,197,94,0.3)' : 'none',
                                  boxShadow: completed ? 'none' : `0 4px 12px ${section.color}40`,
                                }}>
                                  <i className={`ph-bold ${completed ? 'ph-arrow-clockwise' : 'ph-play'}`} style={{ fontSize: 12 }} />
                                  {completed ? 'Redo' : 'Start'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ══════ LEARN — TYPING VIEW (typing.com style) ══════ */}
                {mode === 'learn' && learnView === 'typing' && (
                  <div className="flex flex-col gap-0 -mx-4 md:-mx-8 -mt-6">
                    {/* Blue header bar like typing.com */}
                    <div className="flex items-center justify-between px-4 md:px-6 py-2.5" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                      <button onClick={() => setLearnView('menu')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <i className="ph-bold ph-arrow-left" style={{ fontSize: 11 }} /> Back
                      </button>
                      <div className="text-center">
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{lesson.title} — Exercise {exerciseIdx + 1} of {lesson.exercises.length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { learnPosRef.current = 0; setExerciseIdx(exerciseIdx); rerender(); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                          <i className="ph-bold ph-arrow-clockwise" style={{ fontSize: 11 }} /> Redo
                        </button>
                        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
                          <i className="ph-bold ph-keyboard" style={{ fontSize: 11 }} /> Keyboard
                        </div>
                      </div>
                    </div>

                    {/* CHARACTER BOXES — typing.com style */}
                    <div className="flex justify-center py-6 md:py-8 px-4" style={{ background: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(248,250,252,1)' }}>
                      <div ref={charsRef} className="flex flex-wrap justify-center gap-2">
                        {exercise.split('').map((ch, i) => (
                          <div key={`box-${exerciseIdx}-${i}`} className="flex items-center justify-center rounded-lg select-none" style={{
                            width: ch === ' ' ? 28 : 52,
                            height: 56,
                            fontSize: ch === ' ' ? 0 : 28,
                            fontWeight: 700,
                            fontFamily: "'Outfit', sans-serif",
                            color: '#9ca3af',
                            background: '#fff',
                            border: '2px solid #e5e7eb',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                            transition: 'all 0.1s ease',
                          }}>
                            {ch === ' ' ? '' : ch}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Keyboard */}
                    <div className="px-4 md:px-8 py-4 relative" style={{ background: isDark ? 'rgba(15,23,42,0.3)' : 'rgba(248,250,252,0.8)' }}>
                      <TypingKeyboard activeKey={kbActiveKey} pressedKey={kbPressedKey} isCorrect={kbCorrect} highlightKeys={lesson.keys} showFingers />
                      <TypingHands activeKey={kbActiveKey} />
                    </div>
                  </div>
                )}

                {/* ══════ PRACTICE ══════ */}
                {mode === 'practice' && (
                  <div className="max-w-3xl mx-auto flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h2 style={{ fontSize: 18, fontWeight: 800, color: textMain }}>Free Practice</h2>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                          <i className="ph-bold ph-gauge" style={{ color: '#22c55e', fontSize: 12 }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e' }}>{practiceWpm} WPM</span>
                        </div>
                        <button onClick={() => { setPracticeText(PRACTICE_TEXTS[Math.floor(Math.random() * PRACTICE_TEXTS.length)]); setPracticeWpm(0); practicePosRef.current = 0; }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: cardBg, border: `1px solid ${borderC}`, color: textSub }}>
                          <i className="ph-bold ph-arrows-clockwise mr-1" />New
                        </button>
                      </div>
                    </div>
                    <div className="rounded-2xl p-6 md:p-8" style={{ background: panelBg, border: `1px solid ${borderC}`, backdropFilter: 'blur(20px)' }}>
                      {renderChars(practiceText, practiceCharsRef)}
                    </div>
                    <TypingKeyboard activeKey={kbActiveKey} pressedKey={kbPressedKey} isCorrect={kbCorrect} showFingers />
                  </div>
                )}

                {/* ══════ GAME ══════ */}
                {mode === 'game' && (
                  <div className="max-w-3xl mx-auto flex flex-col gap-4">
                    {!gameActive ? (
                      <div className="flex flex-col items-center gap-4 py-10">
                        <i className="ph-bold ph-game-controller" style={{ fontSize: 48, color: '#f59e0b' }} />
                        <h2 style={{ fontSize: 24, fontWeight: 900, color: textMain }}>Falling Words</h2>
                        <p style={{ fontSize: 13, color: textSub, textAlign: 'center', maxWidth: 400 }}>Type words before they reach the bottom!</p>
                        {gameScore > 0 && <div className="px-4 py-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}><span style={{ fontSize: 14, fontWeight: 800, color: '#ef4444' }}>Last: {gameScore}</span></div>}
                        <button onClick={startGame} className="px-8 py-3 rounded-xl text-sm font-black tracking-wider hover:scale-105 transition-transform" style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', color: '#fff', boxShadow: '0 8px 24px rgba(245,158,11,0.3)' }}>START GAME</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-3">
                            <div className="flex items-center gap-1 px-3 py-1 rounded-lg" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}><i className="ph-bold ph-star" style={{ color: '#f59e0b', fontSize: 12 }} /><span style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b' }}>{gameScore}</span></div>
                            <div className="px-3 py-1 rounded-lg" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}><span style={{ fontSize: 11, fontWeight: 700, color: '#8b5cf6' }}>x{gameCombo}</span></div>
                          </div>
                          <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => <i key={i} className="ph-fill ph-heart" style={{ fontSize: 16, color: i < gameLives ? '#ef4444' : 'rgba(239,68,68,0.2)' }} />)}</div>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden" style={{ height: 350, background: isDark ? 'rgba(2,6,23,0.9)' : 'rgba(241,245,249,0.9)', border: `1px solid ${borderC}` }}>
                          {gameWords.map(w => (<div key={w.id} className="absolute" style={{ top: `${w.y}%`, left: `${w.x}%`, transform: 'translateX(-50%)', zIndex: 10 }}><span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ background: w.y > 70 ? 'rgba(239,68,68,0.2)' : 'rgba(34,211,238,0.15)', border: `1px solid ${w.y > 70 ? 'rgba(239,68,68,0.5)' : 'rgba(34,211,238,0.3)'}`, color: w.y > 70 ? '#ef4444' : '#22d3ee', textShadow: `0 0 8px ${w.y > 70 ? 'rgba(239,68,68,0.5)' : 'rgba(34,211,238,0.5)'}` }}>{w.word}</span></div>))}
                          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg,#ef4444,#f97316,#ef4444)', opacity: 0.6 }} />
                        </div>
                        <input autoFocus type="text" value={gameInput} onChange={handleGameInput} placeholder="Type the words..." className="px-4 py-3 rounded-xl text-sm font-mono font-bold focus:outline-none" style={{ background: cardBg, border: '2px solid rgba(34,211,238,0.3)', color: textMain }} />
                      </>
                    )}
                  </div>
                )}

                {/* ══════ TEST ══════ */}
                {mode === 'test' && (
                  <div className="max-w-3xl mx-auto flex flex-col gap-5">
                    {!testActive && !testResult ? (
                      <div className="flex flex-col items-center gap-5 py-8">
                        <i className="ph-bold ph-timer" style={{ fontSize: 48, color: '#ef4444' }} />
                        <h2 style={{ fontSize: 24, fontWeight: 900, color: textMain }}>Speed Test</h2>
                        <div className="flex gap-3">
                          {[60, 180].map(d => (<button key={d} onClick={() => startTest(d)} className="px-6 py-3 rounded-xl text-sm font-black tracking-wider hover:scale-105 transition-transform" style={{ background: d === 60 ? 'linear-gradient(135deg,#3b82f6,#06b6d4)' : 'linear-gradient(135deg,#8b5cf6,#ec4899)', color: '#fff' }}>{d === 60 ? '1 MINUTE' : '3 MINUTES'}</button>))}
                        </div>
                      </div>
                    ) : testActive ? (
                      <>
                        <div className="flex items-center gap-1 px-4 py-2 rounded-xl w-fit" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                          <i className="ph-bold ph-timer" style={{ color: '#ef4444', fontSize: 14 }} />
                          <span style={{ fontSize: 18, fontWeight: 900, color: '#ef4444', fontFamily: 'monospace' }}>{Math.floor(testTimeLeft / 60)}:{String(testTimeLeft % 60).padStart(2, '0')}</span>
                        </div>
                        <div className="rounded-2xl p-6" style={{ background: panelBg, border: `1px solid ${borderC}`, backdropFilter: 'blur(20px)', maxHeight: 220, overflowY: 'auto' }}>{renderChars(testText.slice(0, 300), testCharsRef)}</div>
                      </>
                    ) : testResult && (
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-5 py-6">
                        <h2 style={{ fontSize: 24, fontWeight: 900, color: textMain }}>Test Complete!</h2>
                        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                          {[{ label: 'WPM', value: testResult.wpm, color: '#22c55e', icon: 'ph-bold ph-gauge' }, { label: 'Accuracy', value: `${testResult.accuracy}%`, color: '#3b82f6', icon: 'ph-bold ph-target' }, { label: 'Errors', value: testResult.errors, color: '#ef4444', icon: 'ph-bold ph-x-circle' }].map(s => (
                            <div key={s.label} className="flex flex-col items-center gap-1 p-4 rounded-2xl" style={{ background: `${s.color}10`, border: `1px solid ${s.color}30` }}>
                              <i className={s.icon} style={{ color: s.color, fontSize: 20 }} /><span style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</span><span style={{ fontSize: 10, fontWeight: 700, color: textSub, textTransform: 'uppercase' }}>{s.label}</span>
                            </div>))}
                        </div>
                        <button onClick={() => setTestResult(null)} className="px-6 py-2.5 rounded-xl text-sm font-bold" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: '#fff' }}>Take Another Test</button>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* ══════ SMART ══════ */}
                {mode === 'smart' && (
                  <div className="max-w-3xl mx-auto flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h2 style={{ fontSize: 18, fontWeight: 800, color: textMain }}>Smart Practice</h2>
                      <button onClick={generateSmartExercise} className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', color: '#fff' }}>Generate</button>
                    </div>
                    <div className="rounded-2xl p-4" style={{ background: panelBg, border: `1px solid ${borderC}` }}>
                      <h3 style={{ fontSize: 12, fontWeight: 700, color: textSub, textTransform: 'uppercase', marginBottom: 12 }}>Key Weakness Heatmap</h3>
                      <TypingKeyboard showFingers={false} weakKeys={stats.keyErrors} />
                    </div>
                    {smartExercise && <div className="rounded-2xl p-6" style={{ background: panelBg, border: `1px solid ${borderC}` }}>{renderChars(smartExercise, smartCharsRef)}</div>}
                  </div>
                )}

                {/* ══════ PROFILE ══════ */}
                {mode === 'profile' && (
                  <div className="max-w-3xl mx-auto flex flex-col gap-5">
                    {(() => { const cert = getCertificate(stats.bestWpm); return (
                      <div className="rounded-2xl p-5 text-center overflow-hidden" style={{ background: `linear-gradient(135deg,${lv.color}15,${lv.color}05)`, border: `1px solid ${lv.color}40` }}>
                        <div style={{ fontSize: 36, fontWeight: 900, color: lv.color }}>{lv.level}</div>
                        <p style={{ fontSize: 12, color: textSub }}>Best: {stats.bestWpm} WPM</p>
                        <div className="w-full max-w-xs mx-auto mt-3 h-2.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                          <div className="h-full rounded-full" style={{ width: `${lv.progress}%`, background: lv.color, transition: 'width 0.3s' }} />
                        </div>
                        {cert && <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full" style={{ background: cert.bg }}><i className="ph-bold ph-certificate" style={{ color: '#fff' }} /><span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{cert.tier} Certificate</span></div>}
                      </div>
                    ); })()}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[{ l:'Words',v:stats.totalWordsTyped,i:'ph-bold ph-text-aa',c:'#3b82f6' },{ l:'Tests',v:stats.totalTestsTaken,i:'ph-bold ph-exam',c:'#8b5cf6' },{ l:'Games',v:stats.gamesPlayed,i:'ph-bold ph-game-controller',c:'#f59e0b' },{ l:'High Score',v:stats.highScore,i:'ph-bold ph-crown',c:'#ec4899' },{ l:'Lessons',v:stats.lessonsCompleted.length,i:'ph-bold ph-book-open',c:'#22c55e' },{ l:'Streak',v:`${stats.dailyStreak}d`,i:'ph-bold ph-fire',c:'#ef4444' },{ l:'Errors',v:stats.totalErrors,i:'ph-bold ph-x-circle',c:'#f97316' },{ l:'Badges',v:stats.achievements.length,i:'ph-bold ph-trophy',c:'#06b6d4' }].map(s => (
                        <div key={s.l} className="flex flex-col items-center gap-1 p-3 rounded-xl" style={{ background: cardBg, border: `1px solid ${borderC}` }}>
                          <i className={s.i} style={{ color: s.c, fontSize: 16 }} /><span style={{ fontSize: 20, fontWeight: 900, color: textMain }}>{s.v}</span><span style={{ fontSize: 9, fontWeight: 600, color: textSub, textTransform: 'uppercase' }}>{s.l}</span>
                        </div>))}
                    </div>
                    <div className="rounded-2xl p-4" style={{ background: panelBg, border: `1px solid ${borderC}` }}>
                      <h3 style={{ fontSize: 12, fontWeight: 700, color: textSub, textTransform: 'uppercase', marginBottom: 12 }}>Achievements</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {ACHIEVEMENTS.map(a => { const u = stats.achievements.includes(a.id); return (
                          <div key={a.id} className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: u ? 'rgba(34,197,94,0.1)' : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', border: `1px solid ${u ? 'rgba(34,197,94,0.3)' : borderC}`, opacity: u ? 1 : 0.5 }}>
                            <i className={a.icon} style={{ fontSize: 18, color: u ? '#22c55e' : textSub }} />
                            <div><div style={{ fontSize: 11, fontWeight: 700, color: u ? '#22c55e' : textMain }}>{a.title}</div><div style={{ fontSize: 9, color: textSub }}>{a.description}</div></div>
                          </div>); })}
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
