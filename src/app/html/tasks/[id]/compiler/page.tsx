'use client';

import { use, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Editor, { BeforeMount, OnMount } from '@/lib/community-editor';
import type { editor } from 'monaco-editor';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PREVIEW_SANDBOX } from '@/lib/preview-sandbox';
import {
    ArrowLeft, Play, Send, Award, CheckCircle2, XCircle, AlertCircle,
    Code2, Eye, RefreshCw, Trophy, Star, Target, TrendingUp,
    Zap, ChevronRight, X, BarChart3, Tag, Lightbulb, ThumbsUp,
    ChevronDown, FileCode, Loader2, ExternalLink, Columns, Sun, Moon,
    Maximize2, Minimize2, ZoomIn, ZoomOut
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

interface TaskInfo {
    id: string;
    title: string;
    desc: string;
    topics: string;
    file: string;
}

const TASKS: Record<string, TaskInfo> = {
    '1': { id: '1', title: 'My Profile Page', desc: 'Create a personal profile using basic HTML tags: p, pre, br, hr', topics: 'p, pre, br, hr, bgcolor', file: 'task1.html' },
    '2': { id: '2', title: 'Basic HTML Tags', desc: 'Demonstrate bold, italic, underline, pre, br, center and heading tags', topics: 'b, i, u, pre, br, center, h1, h2, hr', file: 'task2.html' },
    '3': { id: '3', title: 'India - A Diverse Nation', desc: 'Article about India using headings, images, font colors, and hr', topics: 'h1-h5, img, font, br, hr, align', file: 'task3.html' },
    '4': { id: '4', title: 'Indian History Timeline', desc: 'History page using semantic elements: header, nav, section, footer', topics: 'header, nav, section, footer, address, ul', file: 'task4(1).html' },
    '5': { id: '5', title: 'Operating Systems (Lists)', desc: 'OS information page with unordered and ordered lists', topics: 'ul, ol, li, h1-h3, p, hr', file: 'task5.html' },
    '5.0': { id: '5.0', title: 'Web Dev Roadmap (Nested Lists)', desc: 'Multi-level learning roadmap using nested unordered, ordered, and description lists', topics: 'ul, ol, li, dl, dt, dd, type, h1-h3, p, hr', file: 'task5.0.html' },
    '5.1': { id: '5.1', title: 'Operating Systems (Table)', desc: 'OS comparison using tables with borders and cellpadding', topics: 'table, tr, th, td, border, cellpadding', file: 'task5.1.html' },
    '5.2': { id: '5.2', title: 'Internet Usage Statistics', desc: 'Global internet stats with colspan and rowspan tables', topics: 'table, colspan, rowspan, th, td, caption', file: 'task5.2.html' },
    '5.3': { id: '5.3', title: 'History of the Internet', desc: 'Internet timeline with description lists and tables', topics: 'dl, dt, dd, table, iframe, ol', file: 'task5.3.html' },
    '5.4': { id: '5.4', title: 'Wonders of Space', desc: 'Space exploration page with images, tables, and multimedia', topics: 'img, table, audio, video, iframe', file: 'task5.4.html' },
    '6': { id: '6', title: 'Weekly Study Schedule', desc: 'Complex table with colspan, rowspan, and colored cells', topics: 'table, colspan, rowspan, bgcolor, th, td', file: 'task6.html' },
    '7': { id: '7', title: 'Simple Webpage (No CSS)', desc: 'Complete webpage using only semantic HTML tags, no CSS', topics: 'header, nav, main, article, section, footer', file: 'task7.html' },
    '8': { id: '8', title: 'Registration Form', desc: 'Complete registration form with all input types', topics: 'form, input, select, textarea, radio, checkbox', file: 'task8.html' },
    '9': { id: '9', title: 'Solar System Basics', desc: 'Solar system page with tables, lists, and audio', topics: 'table, ol, ul, audio, img, details', file: 'task9.html' },
    '10': { id: '10', title: 'Full Website Layout', desc: 'Multi-section website with marquee, nav, tables, forms, media', topics: 'marquee, nav, table, form, video, iframe', file: 'task10.html' },
    '11': { id: '11', title: 'Premium Demo Website', desc: 'Professional-looking demo site with header, sections, and footer', topics: 'header, section, article, aside, footer, figure', file: 'task11.html' },
    'test-1': { id: 'test-1', title: 'Test - 1: HTML Foundation & Lists Mastery', desc: 'Comprehensive test covering all tags up to lists: headings, paragraphs, pre, formatting, marquee, images, anchor links, unordered, ordered, nested, and description lists.', topics: 'h1-h3, p, pre, b, i, u, mark, marquee, img, a, ul, ol, dl, dt, dd, font, hr, bgcolor, align, href, src', file: 'test1.html' },
};

interface Evaluation {
    score: number;
    grade: string;
    tagAnalysis: {
        used: string[];
        missing: string[];
        extra: string[];
    };
    feedback: string;
    strengths: string[];
    improvements: string[];
    detailedBreakdown: {
        tagUsage: number;
        structure: number;
        contentRelevance: number;
        codeQuality: number;
        creativity: number;
    };
}

function getDefaultCode(task: TaskInfo) {
    return '';
}

function getGradeColor(grade: string) {
    switch (grade) {
        case 'A+': return { bg: '#059669', text: '#065f46', light: '#ecfdf5', border: '#10b981' };
        case 'A': return { bg: '#0d9488', text: '#115e59', light: '#f0fdfa', border: '#14b8a6' };
        case 'B+': return { bg: '#0284c7', text: '#075985', light: '#f0f9ff', border: '#0ea5e9' };
        case 'B': return { bg: '#2563eb', text: '#1e40af', light: '#eff6ff', border: '#3b82f6' };
        case 'C': return { bg: '#d97706', text: '#92400e', light: '#fffbeb', border: '#f59e0b' };
        case 'D': return { bg: '#ea580c', text: '#9a3412', light: '#fff7ed', border: '#f97316' };
        case 'F': return { bg: '#dc2626', text: '#991b1b', light: '#fef2f2', border: '#ef4444' };
        default: return { bg: '#6b7280', text: '#374151', light: '#f9fafb', border: '#9ca3af' };
    }
}

function getScoreEmoji(score: number) {
    if (score >= 90) return '🏆';
    if (score >= 80) return '🌟';
    if (score >= 70) return '👏';
    if (score >= 60) return '👍';
    if (score >= 40) return '💪';
    return '📝';
}


function preparePreviewHtml(rawHtml: string): string {
    if (!rawHtml || !rawHtml.trim()) return '';

    const scriptClose = '<' + '/script>';
    const linkInterceptorScript = `<script>
(function() {
  try {
    var style = document.createElement('style');
    style.textContent = 'html { scroll-behavior: smooth; }';
    (document.head || document.documentElement).appendChild(style);
  } catch(e) {}

  function showToast(msg) {
    try {
      var old = document.getElementById('__knobly_toast__');
      if (old && old.parentNode) old.parentNode.removeChild(old);
      var t = document.createElement('div');
      t.id = '__knobly_toast__';
      t.textContent = msg;
      t.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:#0f172a;color:#f8fafc;padding:8px 16px;border-radius:10px;font-size:12px;font-family:system-ui,-apple-system,sans-serif;box-shadow:0 10px 25px -5px rgba(0,0,0,0.5);z-index:999999;border:1px solid #334155;pointer-events:none;transition:opacity 0.25s ease;';
      (document.body || document.documentElement).appendChild(t);
      setTimeout(function() {
        t.style.opacity = '0';
        setTimeout(function() {
          if (t.parentNode) t.parentNode.removeChild(t);
        }, 250);
      }, 2500);
    } catch(e) {}
  }

  // Intercept all link clicks inside the iframe
  document.addEventListener('click', function(e) {
    var a = e.target && e.target.closest ? e.target.closest('a, area') : null;
    if (!a) return;

    var href = a.getAttribute('href');
    if (!href) return;
    var trimmed = href.trim();

    // 1. Empty or plain "#" -> scroll to top
    if (!trimmed || trimmed === '#') {
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    var lower = trimmed.toLowerCase();

    // 2. Inline javascript:
    if (lower.startsWith('javascript:')) {
      return;
    }

    // 3. In-page Hash (#top, #features, #contact, etc.)
    if (trimmed.startsWith('#')) {
      e.preventDefault();
      e.stopPropagation();
      var targetId = trimmed.substring(1).trim();

      // Back to top handling
      if (!targetId || targetId.toLowerCase() === 'top') {
        var topEl = document.getElementById('top')
                 || document.querySelector('[name="top"]')
                 || document.querySelector('[name="TOP"]')
                 || document.querySelector('a[name="top"]');
        if (topEl) {
          topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      // Other hash targets (e.g. #features, #about)
      try {
        var el = document.getElementById(targetId)
              || document.querySelector('[name="' + targetId + '"]')
              || document.querySelector('a[name="' + targetId + '"]');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.warn('[Knobly Preview] Element not found for #' + targetId);
        }
      } catch (err) {
        var el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    // 4. External / Global links (http://, https://, //, mailto:, tel:)
    var isExternal = lower.startsWith('http://')
                  || lower.startsWith('https://')
                  || lower.startsWith('//')
                  || lower.startsWith('mailto:')
                  || lower.startsWith('tel:');

    if (isExternal) {
      e.preventDefault();
      e.stopPropagation();
      try {
        window.open(trimmed, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.error('[Knobly Preview] Could not open external link:', err);
      }
      return;
    }

    // 5. Relative / Local links (e.g. "about.html", "contact.html", "/page")
    e.preventDefault();
    e.stopPropagation();
    showToast('🔗 Link: "' + trimmed + '" (External pages disabled in practice preview)');
  }, true);

  // Intercept form submissions to prevent iframe reload / crash
  document.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    showToast('📋 Form submitted successfully (Preview simulation)');
  }, true);
})();
` + scriptClose;

    let processed = rawHtml;

    // Inject interceptor script at the very top of <head> or at beginning
    const headRegex = new RegExp('(<head[^>]*>)', 'i');
    if (headRegex.test(processed)) {
        processed = processed.replace(headRegex, (m) => m + '\n' + linkInterceptorScript);
    } else {
        processed = linkInterceptorScript + '\n' + processed;
    }

    return processed;
}

export default function TaskCompilerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const task = TASKS[id];

    const [code, setCode] = useState('');
    const [activeView, setActiveView] = useState<'editor' | 'preview' | 'split'>('split');
    
    // Right panel mode: 'preview' (student live code) | 'target' (reference task iframe) | 'compare' (split both)
    const [previewMode, setPreviewMode] = useState<'preview' | 'target' | 'compare'>('preview');
    
    // Theme: 'white' (light mode - DEFAULT as requested) | 'dark'
    const [theme, setTheme] = useState<'white' | 'dark'>('white');

    const [previewHtml, setPreviewHtml] = useState('');
    const [previewKey, setPreviewKey] = useState(0);

    const processedPreviewHtml = useMemo(() => {
        return preparePreviewHtml(previewHtml);
    }, [previewHtml]);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [evalError, setEvalError] = useState('');
    const [showTaskInfo, setShowTaskInfo] = useState(true);
    const [lineCount, setLineCount] = useState(1);
    const [targetModalOpen, setTargetModalOpen] = useState(false);

    // Code Editor Font Size / Zoom (10px to 24px, default: 13px)
    const [fontSize, setFontSize] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('task_compiler_font_size');
            if (saved) {
                const parsed = parseInt(saved, 10);
                if (!isNaN(parsed) && parsed >= 10 && parsed <= 24) return parsed;
            }
        }
        return 13;
    });

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const handleRunRef = useRef<(() => void) | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Record task as opened for progress tracking
    useEffect(() => {
        if (id) {
            try {
                const raw = localStorage.getItem('knobly_opened_html_tasks');
                const list: string[] = raw ? JSON.parse(raw) : [];
                if (!list.includes(id)) {
                    list.push(id);
                    localStorage.setItem('knobly_opened_html_tasks', JSON.stringify(list));
                }
            } catch (e) {}
        }
    }, [id]);

    const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes of inactivity
    const lastActiveRef = useRef<number>(0);

    // Listen to user interactions (typing, clicking, tapping) to refresh activity timer
    useEffect(() => {
        lastActiveRef.current = Date.now();
        const handleActivity = () => {
            lastActiveRef.current = Date.now();
        };

        window.addEventListener('keydown', handleActivity, { passive: true });
        window.addEventListener('mousedown', handleActivity, { passive: true });
        window.addEventListener('touchstart', handleActivity, { passive: true });

        return () => {
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('mousedown', handleActivity);
            window.removeEventListener('touchstart', handleActivity);
        };
    }, []);

    // Load saved code from localStorage (persists while student is working; expires after 15 minutes of inactivity)
    useEffect(() => {
        if (!task) return;
        try {
            const raw = localStorage.getItem(`knobly_task_code_${id}`);
            if (raw) {
                let savedCode = '';
                let lastActiveTime = 0;

                try {
                    const parsed = JSON.parse(raw);
                    if (parsed && typeof parsed === 'object' && typeof parsed.code === 'string') {
                        savedCode = parsed.code;
                        lastActiveTime = typeof parsed.lastActive === 'number'
                            ? parsed.lastActive
                            : (typeof parsed.savedAt === 'number' ? parsed.savedAt : 0);
                    }
                } catch {
                    // Legacy plain-text without timestamp -> clean up so new student starts fresh
                    savedCode = '';
                }

                const isActiveWithinLimit = lastActiveTime > 0 && (Date.now() - lastActiveTime) < INACTIVITY_LIMIT_MS;

                if (isActiveWithinLimit && savedCode.trim()) {
                    setCode(savedCode);
                    setPreviewHtml(savedCode);
                    setPreviewKey(k => k + 1);
                    lastActiveRef.current = Date.now();
                    return;
                } else {
                    // Expired after 15 minutes of inactivity -> clear storage so next student gets a fresh blank page
                    localStorage.removeItem(`knobly_task_code_${id}`);
                }
            }
        } catch (e) {
            console.error('Failed to load saved task code', e);
        }
        setCode('');
            setPreviewHtml('');
            setPreviewKey(k => k + 1);
    }, [id, task]);

    // Periodically verify inactivity while page is open (clears editor if inactive for 15 minutes)
    useEffect(() => {
        const checkInactivity = () => {
            const idleTime = Date.now() - lastActiveRef.current;
            if (idleTime >= INACTIVITY_LIMIT_MS) {
                try {
                    localStorage.removeItem(`knobly_task_code_${id}`);
                } catch {}
                setCode('');
                setPreviewHtml('');
            }
        };

        window.addEventListener('focus', checkInactivity);
        const interval = setInterval(checkInactivity, 30000); // Check every 30 seconds
        return () => {
            window.removeEventListener('focus', checkInactivity);
            clearInterval(interval);
        };
    }, [id]);

    // Update line count
    useEffect(() => {
        setLineCount(code.split('\n').length);
    }, [code]);

    // Keep body class in sync with compiler theme (prevents global light-mode styles from corrupting dark mode)
    useEffect(() => {
        if (theme === 'dark') {
            document.body.classList.remove('light-mode');
            document.documentElement.classList.add('dark');
        } else {
            document.body.classList.add('light-mode');
            document.documentElement.classList.remove('dark');
        }

        return () => {
            const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('knobly-theme') : null;
            if (savedTheme === 'dark') {
                document.body.classList.remove('light-mode');
                document.documentElement.classList.add('dark');
            } else {
                document.body.classList.add('light-mode');
                document.documentElement.classList.remove('dark');
            }
        };
    }, [theme]);

    // Auto-save to localStorage with lastActive timestamp (updates as long as student is typing)
    useEffect(() => {
        if (!task) return;
        if (code && code.trim()) {
            const timer = setTimeout(() => {
                try {
                    const payload = {
                        code,
                        lastActive: Date.now()
                    };
                    localStorage.setItem(`knobly_task_code_${id}`, JSON.stringify(payload));
                    lastActiveRef.current = Date.now();
                } catch (e) {
                    console.error('Failed to save task code', e);
                }
            }, 800);
            return () => clearTimeout(timer);
        } else {
            // When editor is blank/cleared, remove immediately from localStorage
            localStorage.removeItem(`knobly_task_code_${id}`);
        }
    }, [code, id, task]);

    const handleRun = useCallback(() => {
        setPreviewHtml(code);
        setPreviewKey(k => k + 1);
        // If currently in target mode, switch to preview so user sees the result of Run
        if (previewMode === 'target') {
            setPreviewMode('preview');
        }
    }, [code, previewMode]);

    useEffect(() => {
        handleRunRef.current = handleRun;
    }, [handleRun]);

    const handleBeforeMount: BeforeMount = (monaco) => {
        monaco.editor.defineTheme('task-compiler-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
                { token: 'comment.html', foreground: '64748b', fontStyle: 'italic' },
                { token: 'tag', foreground: 'f97316', fontStyle: 'bold' },
                { token: 'tag.html', foreground: 'f97316', fontStyle: 'bold' },
                { token: 'tag.id', foreground: 'fbbf24', fontStyle: 'bold' },
                { token: 'tag.class', foreground: '38bdf8' },
                { token: 'metatag', foreground: 'f43f5e', fontStyle: 'bold' },
                { token: 'metatag.content.html', foreground: '34d399' },
                // HTML Attributes: Vibrant Violet/Purple (#c084fc)
                { token: 'attribute.name', foreground: 'c084fc', fontStyle: 'bold' },
                { token: 'attribute.name.html', foreground: 'c084fc', fontStyle: 'bold' },
                { token: 'entity.other.attribute-name', foreground: 'c084fc', fontStyle: 'bold' },
                // HTML Attribute Values & Strings: Emerald Green (#34d399)
                { token: 'attribute.value', foreground: '34d399' },
                { token: 'attribute.value.html', foreground: '34d399' },
                { token: 'string', foreground: '34d399' },
                { token: 'string.html', foreground: '34d399' },
                { token: 'number', foreground: 'fbbf24' },
                { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
                { token: 'delimiter', foreground: '94a3b8' },
                { token: 'delimiter.html', foreground: 'f97316' },
            ],
            colors: {
                'editor.background': '#090d16',
                'editor.foreground': '#f8fafc',
                'editor.lineHighlightBackground': '#111726',
                'editor.selectionBackground': '#7c3aed40',
                'editorCursor.foreground': '#f97316',
                'editorLineNumber.foreground': '#475569',
                'editorLineNumber.activeForeground': '#cbd5e1',
                'editorBracketMatch.background': '#f9731630',
                'editorBracketMatch.border': '#f97316',
                'editorIndentGuide.background': '#1e293b',
                'editorIndentGuide.activeBackground': '#333857',
            },
        });

        monaco.editor.defineTheme('task-compiler-light', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' },
                { token: 'comment.html', foreground: '94a3b8', fontStyle: 'italic' },
                { token: 'tag', foreground: 'ea580c', fontStyle: 'bold' },
                { token: 'tag.html', foreground: 'ea580c', fontStyle: 'bold' },
                { token: 'tag.id', foreground: 'd97706', fontStyle: 'bold' },
                { token: 'tag.class', foreground: '0284c7' },
                { token: 'metatag', foreground: 'e11d48', fontStyle: 'bold' },
                // HTML Attributes: Vibrant Deep Purple (#7c3aed)
                { token: 'attribute.name', foreground: '7c3aed', fontStyle: 'bold' },
                { token: 'attribute.name.html', foreground: '7c3aed', fontStyle: 'bold' },
                { token: 'entity.other.attribute-name', foreground: '7c3aed', fontStyle: 'bold' },
                // HTML Attribute Values & Strings: Emerald Green (#059669)
                { token: 'attribute.value', foreground: '059669' },
                { token: 'attribute.value.html', foreground: '059669' },
                { token: 'string', foreground: '059669' },
                { token: 'string.html', foreground: '059669' },
                { token: 'number', foreground: 'd97706' },
                { token: 'keyword', foreground: '7c3aed', fontStyle: 'bold' },
                { token: 'delimiter', foreground: '64748b' },
                { token: 'delimiter.html', foreground: 'ea580c' },
            ],
            colors: {
                'editor.background': '#ffffff',
                'editor.foreground': '#0f172a',
                'editor.lineHighlightBackground': '#f8fafc',
                'editor.selectionBackground': '#ede9fe',
                'editorCursor.foreground': '#ea580c',
                'editorLineNumber.foreground': '#94a3b8',
                'editorLineNumber.activeForeground': '#334155',
                'editorBracketMatch.background': '#fed7aa60',
                'editorBracketMatch.border': '#ea580c',
                'editorIndentGuide.background': '#f1f5f9',
                'editorIndentGuide.activeBackground': '#cbd5e1',
            },
        });
    };

    const handleEditorMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // Ctrl+Enter to Run
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            handleRunRef.current?.();
        });

        // F5 to Run
        editor.addCommand(monaco.KeyCode.F5, () => {
            handleRunRef.current?.();
        });
    };

    const handleZoomIn = useCallback(() => {
        setFontSize(prev => {
            const next = Math.min(prev + 1, 24);
            if (typeof window !== 'undefined') localStorage.setItem('task_compiler_font_size', String(next));
            return next;
        });
    }, []);

    const handleZoomOut = useCallback(() => {
        setFontSize(prev => {
            const next = Math.max(prev - 1, 10);
            if (typeof window !== 'undefined') localStorage.setItem('task_compiler_font_size', String(next));
            return next;
        });
    }, []);

    const handleZoomReset = useCallback(() => {
        setFontSize(13);
        if (typeof window !== 'undefined') localStorage.setItem('task_compiler_font_size', '13');
    }, []);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
                e.preventDefault();
                handleZoomIn();
            } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
                e.preventDefault();
                handleZoomOut();
            } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
                e.preventDefault();
                handleZoomReset();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleRunRef.current?.();
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [handleZoomIn, handleZoomOut, handleZoomReset]);

    const handleSubmit = async () => {
        if (!code.trim()) {
            setEvalError('Pehle apna HTML code likhein, phir submit karein!');
            return;
        }

        setIsEvaluating(true);
        setEvalError('');
        setEvaluation(null);
        setShowResult(false);

        try {
            const res = await fetch('/api/evaluate-task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId: id, studentCode: code }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Evaluation failed');
            }

            setEvaluation(data.evaluation);
            setShowResult(true);
        } catch (err) {
            setEvalError(err instanceof Error ? err.message : 'Evaluation me error aaya. Please try again.');
        } finally {
            setIsEvaluating(false);
        }
    };

    const handleReset = () => {
        if (window.confirm('Kya aap code clear karna chahte hain?')) {
            setCode('');
            setPreviewHtml('');
            localStorage.removeItem(`knobly_task_code_${id}`);
        }
    };

    if (!task) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center bg-white border border-slate-200 rounded-3xl p-8 max-w-sm shadow-xl">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
                        <AlertCircle size={24} />
                    </div>
                    <h1 className="text-lg font-bold text-slate-900 mb-1">Task Not Found</h1>
                    <p className="text-xs text-slate-500 mb-4">Task #{id} doesn&apos;t exist.</p>
                    <Link
                        href="/html/tasks"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm"
                    >
                        <ArrowLeft size={14} /> Back to Tasks
                    </Link>
                </div>
            </div>
        );
    }

    const tagsList: string[] = [];
    const attrsList: string[] = [];
    for (const topic of task.topics.split(',').map(t => t.trim()).filter(Boolean)) {
        if (isHtmlAttribute(topic)) {
            attrsList.push(topic);
        } else {
            tagsList.push(topic);
        }
    }
    const requiredTags = task.topics.split(',').map(t => t.trim());
    const isWhite = theme === 'white';

    return (
        <div
            className={`min-h-screen flex flex-col transition-colors duration-200 ${
                isWhite ? 'bg-slate-100 text-slate-800' : 'bg-[#090d16] text-slate-100'
            }`}
            style={{
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                ...(!isWhite ? { backgroundColor: '#090d16', color: '#f8fafc' } : {})
            }}
        >
            
            {/* ═══════════ TOP HEADER BAR ═══════════ */}
            <header
                style={!isWhite ? { backgroundColor: '#0f1422', borderColor: '#1e293b' } : {}}
                className={`h-13 px-3 sm:px-4 flex items-center justify-between border-b sticky top-0 z-40 transition-colors ${
                    isWhite
                        ? 'bg-white/95 backdrop-blur-md border-slate-200 shadow-xs'
                        : 'bg-[#0f1422]/95 backdrop-blur-md border-slate-800'
                }`}>
                {/* Left: Back & Title */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <button
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                const params = new URLSearchParams(window.location.search);
                                const from = params.get('from');
                                if (from) {
                                    router.push(from);
                                    return;
                                }
                            }
                            router.push(`/html/tasks/${id}`);
                        }}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isWhite ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                        title="Go Back to Task"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-sm text-white shrink-0">
                        <FileCode size={16} />
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h1
                                style={!isWhite ? { color: '#ffffff' } : {}}
                                className={`text-xs sm:text-sm font-extrabold truncate ${isWhite ? 'text-slate-900' : 'text-white'}`}
                            >
                                Task {id}: {task.title}
                            </h1>
                            <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isWhite
                                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                    : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                            }`}>
                                <span>HTML Studio</span>
                            </span>
                        </div>
                        <p
                            style={!isWhite ? { color: '#94a3b8' } : {}}
                            className={`text-[10px] truncate ${isWhite ? 'text-slate-500' : 'text-slate-400'}`}
                        >
                            Live HTML Compiler • AI Task Evaluation
                        </p>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    
                    {/* View Target Task Quick Button */}
                    <button
                        onClick={() => {
                            if (activeView === 'editor') setActiveView('split');
                            setPreviewMode(previewMode === 'target' ? 'preview' : 'target');
                        }}
                        style={previewMode === 'target' ? { backgroundColor: '#f97316', color: '#ffffff' } : !isWhite ? { color: '#fdba74' } : {}}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                            previewMode === 'target'
                                ? 'bg-orange-500 text-white shadow-orange-500/20'
                                : isWhite
                                    ? 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
                                    : 'bg-orange-500/15 text-orange-300 border border-orange-500/40 hover:bg-orange-500/25'
                        }`}
                        title="Toggle Target Project Output"
                    >
                        <Target size={13} color={previewMode === 'target' ? '#ffffff' : !isWhite ? '#fdba74' : undefined} className={previewMode === 'target' ? 'animate-pulse' : ''} />
                        <span style={previewMode === 'target' ? { color: '#ffffff' } : !isWhite ? { color: '#fdba74' } : {}} className="hidden md:inline">
                            {previewMode === 'target' ? 'Showing Target' : 'View Target Task'}
                        </span>
                    </button>

                    {/* Compare Button */}
                    <button
                        onClick={() => {
                            if (activeView === 'editor') setActiveView('split');
                            setPreviewMode(previewMode === 'compare' ? 'preview' : 'compare');
                        }}
                        style={previewMode === 'compare' ? { backgroundColor: '#4f46e5', color: '#ffffff' } : !isWhite ? { color: '#f1f5f9' } : {}}
                        className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                            previewMode === 'compare'
                                ? 'bg-indigo-600 text-white shadow-indigo-600/20'
                                : isWhite
                                    ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                                    : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
                        }`}
                        title="Compare Target Output & Your Output Side-by-Side"
                    >
                        <Columns size={13} color={previewMode === 'compare' || !isWhite ? '#ffffff' : undefined} />
                        <span style={previewMode === 'compare' || !isWhite ? { color: '#ffffff' } : {}} className="hidden lg:inline">
                            Compare
                        </span>
                    </button>

                    {/* View Switcher: Editor / Split / Preview */}
                    <div className={`hidden md:flex rounded-xl p-0.5 border ${
                        isWhite ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/90 border-slate-700'
                    }`}>
                        <button
                            onClick={() => setActiveView('editor')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                activeView === 'editor'
                                    ? isWhite ? 'bg-white text-slate-900 shadow-xs' : 'bg-orange-500 text-white font-bold shadow-xs'
                                    : isWhite ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                            }`}
                            title="Editor Only"
                        >
                            <Code2 size={13} color={activeView === 'editor' && !isWhite ? '#ffffff' : undefined} />
                        </button>
                        <button
                            onClick={() => setActiveView('split')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                activeView === 'split'
                                    ? isWhite ? 'bg-white text-slate-900 shadow-xs' : 'bg-orange-500 text-white font-bold shadow-xs'
                                    : isWhite ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                            }`}
                            title="Split View"
                        >
                            <Columns size={13} color={activeView === 'split' && !isWhite ? '#ffffff' : undefined} />
                        </button>
                        <button
                            onClick={() => setActiveView('preview')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                activeView === 'preview'
                                    ? isWhite ? 'bg-white text-slate-900 shadow-xs' : 'bg-orange-500 text-white font-bold shadow-xs'
                                    : isWhite ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                            }`}
                            title="Preview Only"
                        >
                            <Eye size={13} color={activeView === 'preview' && !isWhite ? '#ffffff' : undefined} />
                        </button>
                    </div>

                    {/* Theme Toggle (White default / Dark) */}
                    <button
                        onClick={() => setTheme(isWhite ? 'dark' : 'white')}
                        className={`p-2 rounded-xl transition-all border ${
                            isWhite
                                ? 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                                : 'bg-slate-800 border-slate-700 text-amber-300 hover:text-amber-200 hover:bg-slate-700'
                        }`}
                        title={isWhite ? 'Switch to Dark Mode' : 'Switch to White Mode'}
                    >
                        {isWhite ? <Moon size={14} /> : <Sun size={14} color="#fcd34d" />}
                    </button>

                    {/* Run Button */}
                    <button
                        onClick={handleRun}
                        style={{ color: '#ffffff' }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all shadow-sm hover:shadow"
                        title="Run HTML Code (Ctrl+Enter)"
                    >
                        <Play size={12} fill="currentColor" />
                        <span>Run</span>
                    </button>

                    {/* Submit & AI Check Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isEvaluating}
                        style={{ color: '#ffffff' }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 transition-all shadow-sm hover:shadow disabled:opacity-50"
                        title="Submit code for AI score and feedback"
                    >
                        {isEvaluating ? (
                            <>
                                <Loader2 size={13} className="animate-spin" />
                                <span className="hidden sm:inline">Checking...</span>
                            </>
                        ) : (
                            <>
                                <Send size={12} />
                                <span>Submit</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* ═══════════ TASK INFO & TARGET BANNER ═══════════ */}
            {showTaskInfo && (
                <div
                    style={!isWhite ? { backgroundColor: '#101726', borderColor: '#1e293b' } : {}}
                    className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-2.5 transition-colors ${
                        isWhite
                            ? 'bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 border-amber-200/80 text-slate-800'
                            : 'bg-slate-900 border-slate-800 text-slate-100'
                    }`}
                >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            isWhite ? 'bg-orange-500/20 text-orange-600' : 'bg-orange-500/25 text-orange-400'
                        }`}>
                            <Target size={13} color={!isWhite ? '#fb923c' : undefined} />
                        </div>
                        <div className="text-xs leading-snug">
                            <strong
                                style={!isWhite ? { color: '#fb923c' } : {}}
                                className={`font-bold mr-1.5 ${isWhite ? 'text-orange-700' : 'text-orange-400'}`}
                            >
                                Task Goal:
                            </strong>
                            <span
                                style={!isWhite ? { color: '#f1f5f9' } : {}}
                                className={isWhite ? 'text-slate-700' : 'text-slate-100 font-medium'}
                            >
                                {task.desc}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Required Tags & Attributes Pills */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                            {tagsList.length > 0 && (
                                <div className="flex items-center gap-1 flex-wrap">
                                    <span
                                        style={!isWhite ? { color: '#cbd5e1' } : {}}
                                        className={`text-[10px] font-bold uppercase tracking-wider mr-0.5 ${
                                            isWhite ? 'text-slate-500' : 'text-slate-300'
                                        }`}
                                    >
                                        Tags:
                                    </span>
                                    {tagsList.map(tag => (
                                        <code
                                            key={tag}
                                            style={!isWhite ? { backgroundColor: '#1e293b', color: '#fdba74', borderColor: '#f97316' } : {}}
                                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                                isWhite
                                                    ? 'bg-white text-orange-700 border border-orange-200 shadow-2xs'
                                                    : 'bg-slate-800 text-orange-300 border border-orange-500/40 shadow-xs'
                                            }`}
                                        >
                                            &lt;{tag}&gt;
                                        </code>
                                    ))}
                                </div>
                            )}

                            {attrsList.length > 0 && (
                                <div className="flex items-center gap-1 flex-wrap">
                                    <span
                                        style={!isWhite ? { color: '#c084fc' } : {}}
                                        className={`text-[10px] font-bold uppercase tracking-wider mr-0.5 ${
                                            isWhite ? 'text-purple-700 font-bold' : 'text-purple-300 font-bold'
                                        }`}
                                    >
                                        Attrs:
                                    </span>
                                    {attrsList.map(attr => (
                                        <code
                                            key={attr}
                                            style={!isWhite ? { backgroundColor: '#2e1065', color: '#d8b4fe', borderColor: '#a855f7' } : {}}
                                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                                isWhite
                                                    ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs'
                                                    : 'bg-purple-950/70 text-purple-200 border border-purple-500/50 shadow-xs'
                                            }`}
                                        >
                                            {attr === 'radio' || attr === 'checkbox' ? `type="${attr}"` : `${attr}=""`}
                                        </code>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Open Modal Preview of Target */}
                        <button
                            onClick={() => setTargetModalOpen(true)}
                            className={`p-1 rounded-md text-xs transition-colors flex items-center gap-1 ${
                                isWhite
                                    ? 'text-orange-700 hover:bg-orange-100'
                                    : 'text-orange-400 hover:bg-slate-800 hover:text-orange-300'
                            }`}
                            title="Full Screen Target Preview"
                        >
                            <Maximize2 size={13} />
                        </button>

                        {/* Dismiss */}
                        <button
                            onClick={() => setShowTaskInfo(false)}
                            className={`p-1 rounded-md transition-colors ${
                                isWhite ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                            title="Hide Banner"
                        >
                            <X size={13} />
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════════ ERROR BANNER ═══════════ */}
            {evalError && (
                <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center gap-2 text-xs text-red-700">
                    <AlertCircle size={14} className="shrink-0 text-red-500" />
                    <span className="flex-1 font-medium">{evalError}</span>
                    <button onClick={() => setEvalError('')} className="text-red-400 hover:text-red-700">
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* ═══════════ MAIN WORKSPACE (EDITOR + PREVIEW) ═══════════ */}
            <main className={`flex-1 flex overflow-hidden ${
                activeView === 'split' ? 'flex-col md:flex-row' : 'flex-col'
            }`}>
                
                {/* ────────── LEFT PANE: CODE EDITOR ────────── */}
                {(activeView === 'editor' || activeView === 'split') && (
                    <div
                        style={!isWhite ? { backgroundColor: '#0e1320', borderColor: '#1e293b' } : {}}
                        className={`flex flex-col min-w-0 ${
                            activeView === 'split'
                                ? 'flex-1 md:w-1/2 border-b md:border-b-0 md:border-r'
                                : 'flex-1'
                        } ${isWhite ? 'border-slate-200 bg-white' : 'border-slate-800 bg-[#0e1320]'}`}
                    >
                        
                        {/* Editor Header Bar */}
                        <div
                            style={!isWhite ? { backgroundColor: '#131b2e', borderColor: '#1e293b' } : {}}
                            className={`px-3 py-2 flex items-center justify-between border-b ${
                                isWhite ? 'bg-slate-50 border-slate-200' : 'bg-[#141b2d] border-slate-800'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                <span
                                    style={!isWhite ? { color: '#f8fafc' } : {}}
                                    className={`text-xs font-bold font-mono ${isWhite ? 'text-slate-700' : 'text-slate-100'}`}
                                >
                                    index.html
                                </span>
                                <span
                                    style={!isWhite ? { backgroundColor: '#1e293b', color: '#cbd5e1', borderColor: '#334155' } : {}}
                                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                                        isWhite ? 'bg-white text-slate-500 border border-slate-200' : 'bg-slate-800 text-slate-300 border border-slate-700'
                                    }`}
                                >
                                    {lineCount} lines
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2">
                                {/* Font Zoom Controls */}
                                <div
                                    style={!isWhite ? { backgroundColor: '#0e1422', borderColor: '#1e293b' } : {}}
                                    className={`flex items-center rounded-lg border p-0.5 ${
                                        isWhite ? 'bg-white border-slate-200' : 'bg-[#0f1523] border-slate-700'
                                    }`}
                                >
                                    <button
                                        onClick={handleZoomOut}
                                        disabled={fontSize <= 10}
                                        style={!isWhite ? { color: '#cbd5e1' } : {}}
                                        className={`p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                                            isWhite
                                                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                                : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                        }`}
                                        title="Zoom Out Code (Ctrl + -)"
                                    >
                                        <ZoomOut size={12} />
                                    </button>

                                    <button
                                        onClick={handleZoomReset}
                                        style={!isWhite ? { color: '#cbd5e1' } : {}}
                                        className={`px-1.5 py-0.5 text-[10px] font-mono font-bold select-none transition-colors hover:text-orange-500 ${
                                            isWhite ? 'text-slate-600' : 'text-slate-300'
                                        }`}
                                        title="Reset Zoom (Click to reset to 13px)"
                                    >
                                        {fontSize}px
                                    </button>

                                    <button
                                        onClick={handleZoomIn}
                                        disabled={fontSize >= 24}
                                        style={!isWhite ? { color: '#cbd5e1' } : {}}
                                        className={`p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                                            isWhite
                                                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                                : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                        }`}
                                        title="Zoom In Code (Ctrl + +)"
                                    >
                                        <ZoomIn size={12} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleReset}
                                    style={!isWhite ? { color: '#cbd5e1' } : {}}
                                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                                        isWhite
                                            ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                    }`}
                                    title="Reset Code"
                                >
                                    <RefreshCw size={11} />
                                    <span className="hidden sm:inline">Reset</span>
                                </button>
                            </div>
                        </div>

                        {/* Editor Code Area (Monaco Editor with Custom Highlighting) */}
                        <div
                            style={!isWhite ? { backgroundColor: '#090d16' } : { backgroundColor: '#ffffff' }}
                            className={`flex-1 relative overflow-hidden w-full h-full min-h-[350px] ${
                                isWhite ? 'bg-white' : 'bg-[#090d16]'
                            }`}
                        >
                            <Editor
                                height="100%"
                                language="html"
                                value={code}
                                theme={isWhite ? 'task-compiler-light' : 'task-compiler-dark'}
                                onChange={(value) => setCode(value || '')}
                                beforeMount={handleBeforeMount}
                                onMount={handleEditorMount}
                                options={{
                                    fontSize,
                                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    wordWrap: 'on',
                                    lineNumbers: 'on',
                                    renderLineHighlight: 'all',
                                    automaticLayout: true,
                                    tabSize: 4,
                                    insertSpaces: true,
                                    padding: { top: 12, bottom: 12 },
                                    smoothScrolling: true,
                                    suggestOnTriggerCharacters: true,
                                    acceptSuggestionOnEnter: 'on',
                                    quickSuggestions: true,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* ────────── RIGHT PANE: PREVIEW / TARGET / COMPARE ────────── */}
                {(activeView === 'preview' || activeView === 'split') && (
                    <div
                        style={!isWhite ? { backgroundColor: '#0b0f19' } : {}}
                        className={`flex flex-col min-w-0 ${
                            activeView === 'split' ? 'flex-1 md:w-1/2' : 'flex-1'
                        } ${isWhite ? 'bg-slate-50' : 'bg-[#0b0f19]'}`}
                    >
                        
                        {/* Preview Header with 3 Tab Switchers */}
                        <div
                            style={!isWhite ? { backgroundColor: '#131b2e', borderColor: '#1e293b' } : {}}
                            className={`px-3 py-1.5 flex items-center justify-between border-b gap-2 ${
                                isWhite ? 'bg-slate-100/80 border-slate-200' : 'bg-[#141b2d] border-slate-800'
                            }`}
                        >
                            {/* Tabs */}
                            <div
                                style={!isWhite ? { backgroundColor: '#1a233a', borderColor: '#334155' } : {}}
                                className={`flex items-center rounded-xl p-0.5 border ${
                                    isWhite ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-800/80 border-slate-700'
                                }`}
                            >
                                <button
                                    onClick={() => setPreviewMode('preview')}
                                    style={previewMode === 'preview' ? { backgroundColor: '#059669', color: '#ffffff' } : !isWhite ? { color: '#cbd5e1' } : {}}
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                        previewMode === 'preview'
                                            ? isWhite
                                                ? 'bg-emerald-500 text-white shadow-xs'
                                                : 'bg-emerald-600 text-white shadow-xs'
                                            : isWhite
                                                ? 'text-slate-600 hover:text-slate-900'
                                                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                                    }`}
                                >
                                    <Eye size={12} color={previewMode === 'preview' || !isWhite ? '#ffffff' : undefined} />
                                    <span style={previewMode === 'preview' ? { color: '#ffffff' } : !isWhite ? { color: '#f1f5f9' } : {}}>My Preview</span>
                                </button>

                                <button
                                    onClick={() => setPreviewMode('target')}
                                    style={previewMode === 'target' ? { backgroundColor: '#f97316', color: '#ffffff' } : !isWhite ? { color: '#cbd5e1' } : {}}
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                        previewMode === 'target'
                                            ? 'bg-orange-500 text-white shadow-xs'
                                            : isWhite
                                                ? 'text-slate-600 hover:text-slate-900'
                                                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                                    }`}
                                >
                                    <Target size={12} color={previewMode === 'target' ? '#ffffff' : !isWhite ? '#fdba74' : undefined} />
                                    <span style={previewMode === 'target' ? { color: '#ffffff' } : !isWhite ? { color: '#fdba74' } : {}}>Target Task</span>
                                </button>

                                <button
                                    onClick={() => setPreviewMode('compare')}
                                    style={previewMode === 'compare' ? { backgroundColor: '#4f46e5', color: '#ffffff' } : !isWhite ? { color: '#cbd5e1' } : {}}
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                        previewMode === 'compare'
                                            ? 'bg-indigo-600 text-white shadow-xs'
                                            : isWhite
                                                ? 'text-slate-600 hover:text-slate-900'
                                                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                                    }`}
                                    title="Compare Target Output and Your Output"
                                >
                                    <Columns size={12} color={previewMode === 'compare' || !isWhite ? '#ffffff' : undefined} />
                                    <span style={previewMode === 'compare' || !isWhite ? { color: '#ffffff' } : {}}>Compare</span>
                                </button>
                            </div>

                            {/* Right tools */}
                            <div className="flex items-center gap-1">
                                <a
                                    href={`/html-tasks/${task.file}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={!isWhite ? { color: '#cbd5e1' } : {}}
                                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                                        isWhite
                                            ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                    }`}
                                    title="Open Target Task in New Tab"
                                >
                                    <ExternalLink size={11} />
                                    <span className="hidden sm:inline">Open Target</span>
                                </a>
                            </div>
                        </div>

                        {/* Preview Content Area */}
                        <div className="flex-1 relative overflow-hidden bg-white">
                            
                            {/* CASE 1: Student Live Output */}
                            {previewMode === 'preview' && (
                                <iframe
                                    key={`student-live-${previewKey}`}
                                    ref={iframeRef}
                                    srcDoc={processedPreviewHtml}
                                    className="w-full h-full border-0 bg-white"
                                    title="Student Live Output Preview"
                                    sandbox={PREVIEW_SANDBOX}
                                    referrerPolicy="no-referrer"
                                />
                            )}

                            {/* CASE 2: Target Task Reference (The Project to Build) */}
                            {previewMode === 'target' && (
                                <div className="w-full h-full flex flex-col">
                                    <div
                                        style={!isWhite ? { backgroundColor: '#131b2e', borderColor: '#1e293b', color: '#fef3c7' } : {}}
                                        className={`px-3 py-2 flex items-center justify-between text-xs border-b ${
                                            isWhite ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-900 border-slate-800 text-amber-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                                            <span className="font-bold">🎯 Target Output Reference:</span>
                                            <span className={isWhite ? 'text-amber-800' : 'text-amber-300'}>Aapko yeh webpage banana hai!</span>
                                        </div>
                                        <button
                                            onClick={() => setPreviewMode('preview')}
                                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-colors ${
                                                isWhite
                                                    ? 'bg-amber-200/70 hover:bg-amber-200 text-amber-900'
                                                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
                                            }`}
                                        >
                                            Switch to My Output →
                                        </button>
                                    </div>
                                    <iframe
                                        src={`/html-tasks/${task.file}`}
                                        sandbox={PREVIEW_SANDBOX}
                                        referrerPolicy="no-referrer"
                                        className="flex-1 w-full border-0 bg-white"
                                        title={`Target Task Reference ${task.title}`}
                                    />
                                </div>
                            )}

                            {/* CASE 3: Side-by-Side / Stacked Compare */}
                            {previewMode === 'compare' && (
                                <div className={`w-full h-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x ${
                                    isWhite ? 'divide-slate-200 bg-slate-100' : 'divide-slate-800 bg-slate-950'
                                }`}>
                                    {/* Left / Top: Target Output */}
                                    <div className="flex-1 flex flex-col min-h-0 bg-white">
                                        <div
                                            style={!isWhite ? { backgroundColor: '#131b2e', borderColor: '#1e293b', color: '#fdba74' } : {}}
                                            className={`px-3 py-1.5 flex items-center justify-between text-[11px] font-bold border-b ${
                                                isWhite ? 'bg-orange-50 border-orange-200 text-orange-900' : 'bg-slate-900 border-slate-800 text-orange-300'
                                            }`}
                                        >
                                            <span className="flex items-center gap-1.5">
                                                <Target size={12} className={isWhite ? 'text-orange-600' : 'text-orange-400'} />
                                                <span>Target Project (Goal)</span>
                                            </span>
                                            <span className={`text-[10px] font-normal ${isWhite ? 'text-orange-600' : 'text-orange-400'}`}>Reference</span>
                                        </div>
                                        <div className="flex-1 relative overflow-hidden">
                                            <iframe
                                                src={`/html-tasks/${task.file}`}
                                                sandbox={PREVIEW_SANDBOX}
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full border-0 bg-white"
                                                title="Compare Target Output"
                                            />
                                        </div>
                                    </div>

                                    {/* Right / Bottom: Student Live Code Output */}
                                    <div className="flex-1 flex flex-col min-h-0 bg-white">
                                        <div
                                            style={!isWhite ? { backgroundColor: '#131b2e', borderColor: '#1e293b', color: '#6ee7b7' } : {}}
                                            className={`px-3 py-1.5 flex items-center justify-between text-[11px] font-bold border-b ${
                                                isWhite ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-900 border-slate-800 text-emerald-300'
                                            }`}
                                        >
                                            <span className="flex items-center gap-1.5">
                                                <Eye size={12} className={isWhite ? 'text-emerald-600' : 'text-emerald-400'} />
                                                <span>Your Current Output</span>
                                            </span>
                                            <button
                                                onClick={handleRun}
                                                className={`text-[10px] underline font-semibold ${
                                                    isWhite ? 'text-emerald-700' : 'text-emerald-400 hover:text-emerald-300'
                                                }`}
                                            >
                                                Refresh
                                            </button>
                                        </div>
                                        <div className="flex-1 relative overflow-hidden">
                                            <iframe
                                                key={`compare-student-${previewKey}`}
                                                srcDoc={processedPreviewHtml}
                                                className="w-full h-full border-0 bg-white"
                                                title="Compare Student Output"
                                                sandbox={PREVIEW_SANDBOX}
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* ═══════════ TARGET TASK POPUP MODAL (FULL SCREEN REFERENCE) ═══════════ */}
            {targetModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
                    onClick={() => setTargetModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-3xl border border-slate-200 w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                                    <Target size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold">Target Reference — Task {id}: {task.title}</h3>
                                    <p className="text-[11px] text-slate-300">Aapko aisa webpage design banana hai</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={`/html-tasks/${task.file}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    title="Open Fullscreen in New Tab"
                                >
                                    <ExternalLink size={15} />
                                </a>
                                <button
                                    onClick={() => setTargetModalOpen(false)}
                                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    title="Close"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 relative bg-white">
                            <iframe
                                src={`/html-tasks/${task.file}`}
                                sandbox={PREVIEW_SANDBOX}
                                referrerPolicy="no-referrer"
                                className="w-full h-full border-0"
                                title="Target Task Modal Preview"
                            />
                        </div>

                        {/* Modal Footer */}
                        <div
                            style={!isWhite ? { backgroundColor: '#131b2e', borderColor: '#1e293b', color: '#e2e8f0' } : {}}
                            className={`p-3 border-t flex items-center justify-between text-xs ${
                                isWhite ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                        >
                            <div className="flex items-center gap-2 flex-wrap">
                                <span>Required:</span>
                                {tagsList.map(t => (
                                    <span key={t} className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-100 text-orange-800 border border-orange-200">
                                        &lt;{t}&gt;
                                    </span>
                                ))}
                                {attrsList.map(a => (
                                    <span key={a} className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                        {a === 'radio' || a === 'checkbox' ? `type="${a}"` : `${a}=""`}
                                    </span>
                                ))}
                            </div>
                            <button
                                onClick={() => setTargetModalOpen(false)}
                                className="px-4 py-1.5 rounded-xl bg-orange-700 hover:bg-orange-600 text-white font-bold transition-all shadow-sm"
                            >
                                Start Coding Now →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════ AI EVALUATION RESULT MODAL (CLEAN LIGHT DESIGN) ═══════════ */}
            {showResult && evaluation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div
                        className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Score Header */}
                        <div
                            className="p-6 text-center border-b border-slate-100"
                            style={{
                                background: `linear-gradient(180deg, ${getGradeColor(evaluation.grade).light} 0%, #ffffff 100%)`,
                            }}
                        >
                            <div className="text-5xl mb-2">
                                {getScoreEmoji(evaluation.score)}
                            </div>

                            <div
                                className="text-5xl font-black mb-1 tracking-tight"
                                style={{ color: getGradeColor(evaluation.grade).border }}
                            >
                                {evaluation.score}<span className="text-2xl text-slate-400 font-bold">/100</span>
                            </div>

                            <div
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3 shadow-2xs"
                                style={{
                                    background: getGradeColor(evaluation.grade).light,
                                    color: getGradeColor(evaluation.grade).text,
                                    border: `1px solid ${getGradeColor(evaluation.grade).border}40`,
                                }}
                            >
                                <Award size={14} />
                                <span>Grade: {evaluation.grade}</span>
                            </div>

                            <p className="text-xs text-slate-700 leading-relaxed max-w-md mx-auto font-medium">
                                {evaluation.feedback}
                            </p>
                        </div>

                        {/* Detailed Score Breakdown */}
                        <div className="p-5 border-b border-slate-100">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <BarChart3 size={14} className="text-orange-500" />
                                <span>Score Breakdown</span>
                            </h3>

                            <div className="space-y-2.5">
                                {[
                                    { label: 'Tag Usage', value: evaluation.detailedBreakdown.tagUsage, max: 40, color: '#f97316' },
                                    { label: 'HTML Structure', value: evaluation.detailedBreakdown.structure, max: 20, color: '#10b981' },
                                    { label: 'Content Relevance', value: evaluation.detailedBreakdown.contentRelevance, max: 20, color: '#3b82f6' },
                                    { label: 'Code Quality', value: evaluation.detailedBreakdown.codeQuality, max: 10, color: '#8b5cf6' },
                                    { label: 'Creativity', value: evaluation.detailedBreakdown.creativity, max: 10, color: '#ec4899' },
                                ].map(item => (
                                    <div key={item.label}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-semibold text-slate-600">{item.label}</span>
                                            <span className="font-bold" style={{ color: item.color }}>
                                                {item.value} / {item.max}
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{
                                                    width: `${Math.min(100, (item.value / item.max) * 100)}%`,
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tag Analysis */}
                        <div className="p-5 border-b border-slate-100 space-y-3">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <Tag size={14} className="text-orange-500" />
                                <span>Tag Analysis</span>
                            </h3>

                            {/* Used Tags */}
                            {evaluation.tagAnalysis.used.length > 0 && (
                                <div>
                                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mb-1.5">
                                        <CheckCircle2 size={12} /> Correctly Used Tags
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {evaluation.tagAnalysis.used.map(t => {
                                            const isAttr = isHtmlAttribute(t);
                                            return (
                                                <span
                                                    key={t}
                                                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold ${
                                                        isAttr
                                                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    }`}
                                                >
                                                    {isAttr ? (t === 'radio' || t === 'checkbox' ? `type="${t}"` : `${t}=""`) : `<${t}>`}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Missing Tags */}
                            {evaluation.tagAnalysis.missing.length > 0 && (
                                <div>
                                    <span className="text-[11px] font-bold text-red-700 flex items-center gap-1 mb-1.5">
                                        <XCircle size={12} /> Missing Required Tags
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {evaluation.tagAnalysis.missing.map(t => {
                                            const isAttr = isHtmlAttribute(t);
                                            return (
                                                <span
                                                    key={t}
                                                    className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-red-50 text-red-700 border border-red-200"
                                                >
                                                    {isAttr ? (t === 'radio' || t === 'checkbox' ? `type="${t}"` : `${t}=""`) : `<${t}>`}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Strengths & Improvements */}
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-slate-100">
                            {/* Strengths */}
                            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3">
                                <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                                    <ThumbsUp size={13} />
                                    <span>Strengths</span>
                                </h4>
                                <ul className="space-y-1.5">
                                    {evaluation.strengths.map((s, i) => (
                                        <li key={i} className="text-[11px] text-emerald-900 leading-relaxed flex items-start gap-1.5">
                                            <span className="text-emerald-700 font-bold">•</span>
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Improvements */}
                            <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-3">
                                <h4 className="text-xs font-bold text-orange-800 flex items-center gap-1.5 mb-2">
                                    <Lightbulb size={13} />
                                    <span>Improvement Tips</span>
                                </h4>
                                <ul className="space-y-1.5">
                                    {evaluation.improvements.map((s, i) => (
                                        <li key={i} className="text-[11px] text-orange-900 leading-relaxed flex items-start gap-1.5">
                                            <span className="text-orange-700 font-bold">•</span>
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="p-4 bg-slate-50 flex gap-2.5">
                            <button
                                onClick={() => setShowResult(false)}
                                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-all shadow-2xs"
                            >
                                ← Edit & Improve Code
                            </button>
                            <button
                                onClick={() => {
                                    setShowResult(false);
                                    handleSubmit();
                                }}
                                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={13} />
                                <span>Re-evaluate</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════ AI EVALUATING FULLSCREEN OVERLAY ═══════════ */}
            {isEvaluating && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-slate-200 space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30 animate-pulse">
                            <Zap size={28} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                AI Evaluating Code...
                            </h2>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Tags, structure aur content check kiya ja raha hai. Kuch hi seconds me result aayega...
                            </p>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 w-2/3 animate-[pulse_1s_ease-in-out_infinite]" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
