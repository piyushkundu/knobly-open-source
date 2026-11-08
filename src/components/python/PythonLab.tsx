'use client';

import { aiClientError } from '@/lib/ai-limits';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Play, History, Sparkles, Code2, Zap, Sun, Moon, Trash2, ChevronLeft, Save, FolderOpen, User, LogIn, LogOut, Globe, Bot, ChevronDown, X, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PythonCodeEditor } from './PythonCodeEditor';
import { PythonConsole } from './PythonConsole';
import { PythonHistory } from './PythonHistory';
import { PythonAskAIModal } from './PythonAskAIModal';
import { SavedCodesModal } from './SavedCodesModal';
import { SaveFilePopup } from './SaveFilePopup';
import { EditorFileExplorer } from './EditorFileExplorer';
import LoginModal from '@/components/auth/LoginModal';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Toggle } from './ui/Toggle';
import { usePyodide } from '@/hooks/usePyodide';
import { useJSCPP } from '@/hooks/useJSCPP';
import { useAIExplain } from '@/hooks/useAIExplain';
import { useCodeHistory } from '@/hooks/useCodeHistory';
import { useSavedCodes } from '@/hooks/useSavedCodes';
import { useAuth } from '@/context/AuthContext';
import { CodeHistoryItem, Language, HelpMode, SavedCodeItem } from '@/types/python';
import { cn } from '@/lib/python-utils';

const DEFAULT_CODE = `# Welcome to AI Python Learning Lab!\n\nprint("Hello, World!")\n`;

import './python-lab.css';

interface EditorTab {
  id: string; // unique tab id (matches SavedCodeItem.id if saved)
  name: string;
  code: string;
  isDirty: boolean;
  savedId: string | null; // linked Firebase doc id, null = unsaved
  output?: string;
}

const C_DEFAULT_CODE = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    return 0;
}
`;

const createNewTab = (name = 'Untitled.py', code = DEFAULT_CODE): EditorTab => ({
  id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
  name,
  code,
  isDirty: false,
  savedId: null,
});

export function PythonLab() {
  const [tabs, setTabs] = useState<EditorTab[]>([createNewTab()]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [helpMode, setHelpMode] = useState<HelpMode>('manual');
  const [showHistory, setShowHistory] = useState(false);
  const [showAskAI, setShowAskAI] = useState(false);
  const [showSavedCodes, setShowSavedCodes] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [editorWidthPercent, setEditorWidthPercent] = useState(55); // draggable split
  const isDraggingRef = useRef(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Derived active tab
  const activeTab = tabs[activeTabIndex] || tabs[0];
  const code = activeTab?.code || '';
  const activeFileName = activeTab?.name || 'Untitled.py';
  const isDirty = activeTab?.isDirty || false;
  const activeFileId = activeTab?.savedId || null;
  const [lastExecution, setLastExecution] = useState<{ code: string; error: string } | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [mobileTab, setMobileTab] = useState<'editor' | 'console'>('editor');
  // Interactive prompt state - re-run with accumulation approach
  const [terminalLines, setTerminalLines] = useState<Array<{ type: 'prompt' | 'input'; text: string }>>([]);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [startSavingCode, setStartSavingCode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileProfileMenuRef = useRef<HTMLDivElement>(null);
  // Ref to resolve when user submits input
  const inputResolveRef = useRef<((value: string) => void) | null>(null);
  const collectedInputsRef = useRef<string[]>([]);
  const terminalLinesRef = useRef<Array<{ type: 'prompt' | 'input'; text: string }>>([]);
  const isRunningRef = useRef(false);
  const router = useRouter();

  const { isLoading: isPyodideLoading, isReady: isPyodideReady, executeCode: executePython } = usePyodide();
  const { isLoading: isJSCPPLoading, isReady: isJSCPPReady, executeCode: executeC } = useJSCPP();
  const { isLoading: isAILoading, explanation, error: aiError, explainError, clearExplanation } = useAIExplain();
  const { history, saveToHistory, deleteFromHistory } = useCodeHistory();
  const { user, logout } = useAuth();
  const { codes, isLoading: isSavedCodesLoading, isLoggedIn, saveCode, updateCode, deleteCode, toggleImportant } = useSavedCodes();

  // Detect if active file is C language
  const isCFile = activeFileName.endsWith('.c') || activeFileName.endsWith('.h');
  const isRuntimeReady = isCFile ? isJSCPPReady : isPyodideReady;
  const isRuntimeLoading = isCFile ? isJSCPPLoading : isPyodideLoading;

  // ---- Tab Helpers ----
  const setCode = useCallback((newCode: string) => {
    setTabs(prev => prev.map((t, i) => i === activeTabIndex ? { ...t, code: newCode } : t));
  }, [activeTabIndex]);

  const updateActiveTab = useCallback((updates: Partial<EditorTab>) => {
    setTabs(prev => prev.map((t, i) => i === activeTabIndex ? { ...t, ...updates } : t));
  }, [activeTabIndex]);

  const handleNewTab = useCallback(() => {
    if (tabs.length >= 2) return;

    let baseName = 'Untitled';
    let newName = 'Untitled.py';
    let counter = 0;
    while (tabs.some(t => t.name === newName)) {
      counter++;
      newName = `${baseName} (${counter}).py`;
    }

    const newTab = createNewTab(newName);

    setTabs(prev => [...prev, newTab]);
    setActiveTabIndex(tabs.length);
  }, [tabs]);

  const handleCloseTab = useCallback((index: number) => {
    if (tabs.length <= 1) {
      // Reset to fresh tab instead of closing last one
      setTabs([createNewTab()]);
      setActiveTabIndex(0);
      return;
    }
    setTabs(prev => prev.filter((_, i) => i !== index));
    if (activeTabIndex >= index && activeTabIndex > 0) setActiveTabIndex(activeTabIndex - 1);
  }, [tabs.length, activeTabIndex]);

  const handleSwitchTab = useCallback((index: number) => {
    // Preserve current output into the tab before switching
    setTabs(prev => prev.map((t, i) => i === activeTabIndex ? { ...t, output } : t));
    // Load the target tab's output
    setOutput(tabs[index].output || '');
    setActiveTabIndex(index);
  }, [activeTabIndex, tabs, output]);

  const handleLanguageSwitch = useCallback((lang: 'python' | 'c') => {
    const isCTarget = lang === 'c';
    // Check if any existing tab matches the target language
    const existingIdx = tabs.findIndex(t => {
      const tExt = t.name.endsWith('.c') || t.name.endsWith('.h');
      return isCTarget ? tExt : !tExt;
    });
    if (existingIdx >= 0) {
      handleSwitchTab(existingIdx);
      return;
    }
    // Create a new tab with the target language
    const newName = isCTarget ? 'Untitled.c' : 'Untitled.py';
    const newCode = isCTarget ? C_DEFAULT_CODE : DEFAULT_CODE;
    const newTab = createNewTab(newName, newCode);
    setTabs(prev => [...prev, newTab]);
    setActiveTabIndex(tabs.length);
  }, [tabs, handleSwitchTab]);

  // ---- Save Handlers ----
  const handleSaveCode = useCallback(async (title: string, codeToSave: string, description?: string, folder?: string, lastOutput?: string) => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    const newCode = await saveCode(title, codeToSave, folder, lastOutput !== undefined ? lastOutput : output, description);
    if (newCode) {
      updateActiveTab({ savedId: newCode.id, name: newCode.title, isDirty: false });
    }
  }, [isLoggedIn, saveCode, output, updateActiveTab]);

  const handleEditorSave = useCallback(() => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    if (activeFileId) {
      // Already saved file → auto-save immediately
      setIsSaving(true);
      updateCode(activeFileId, { code, title: activeFileName }).then(() => {
        updateActiveTab({ isDirty: false });
        setIsSaving(false);
      });
    } else {
      // New unsaved file → show save popup
      setShowSavePopup(true);
    }
  }, [isLoggedIn, activeFileId, code, activeFileName, updateCode, updateActiveTab]);

  const handleSavePopupSubmit = useCallback(async (name: string, description: string, folder: string) => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    setIsSaving(true);
    const newCode = await saveCode(name, code, folder, output, description);
    if (newCode) {
      updateActiveTab({ savedId: newCode.id, name: newCode.title, isDirty: false });
    }
    setIsSaving(false);
  }, [isLoggedIn, saveCode, code, output, updateActiveTab]);

  const handleSelectSavedCode = useCallback((savedCode: SavedCodeItem) => {
    // Check if already open in a tab
    const existingIndex = tabs.findIndex(t => t.savedId === savedCode.id);
    if (existingIndex >= 0) {
      setActiveTabIndex(existingIndex);
      return;
    }
    // Load into current tab if untouched, else open new tab
    if (!activeTab.isDirty && !activeTab.savedId && activeTab.code === DEFAULT_CODE) {
      updateActiveTab({ code: savedCode.code, savedId: savedCode.id, name: savedCode.title, isDirty: false });
    } else if (tabs.length < 2) {
      const newTab: EditorTab = { id: savedCode.id, name: savedCode.title, code: savedCode.code, isDirty: false, savedId: savedCode.id };
      setTabs(prev => [...prev, newTab]);
      setActiveTabIndex(tabs.length);
    } else {
      // Replace current tab
      updateActiveTab({ code: savedCode.code, savedId: savedCode.id, name: savedCode.title, isDirty: false });
    }
    localStorage.setItem('python-code', savedCode.code);
  }, [tabs, activeTab, activeTabIndex, updateActiveTab]);

  useEffect(() => {
    const savedLang = localStorage.getItem('python-lab-language') as Language;
    if (savedLang) setLanguage(savedLang);

    const savedCode = localStorage.getItem('python-code');
    if (savedCode) setCode(savedCode);

    const savedTheme = localStorage.getItem('python-lab-theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    } else {
      setTheme('light');
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Close profile and settings menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        profileMenuRef.current && !profileMenuRef.current.contains(target) &&
        (!mobileProfileMenuRef.current || !mobileProfileMenuRef.current.contains(target))
      ) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  // Auto-save logic
  useEffect(() => {
    if (!isDirty || !isLoggedIn || !activeFileId) return;

    const timeoutId = setTimeout(async () => {
      setIsSaving(true);
      await updateCode(activeFileId, {
        code,
        title: activeFileName,
      });
      updateActiveTab({ isDirty: false });
      setIsSaving(false);
    }, 2500);

    return () => clearTimeout(timeoutId);
  }, [code, activeFileName, activeFileId, isDirty, isLoggedIn, updateCode, updateActiveTab]);


  // Handle user submitting input — resolves the waiting promise
  const handlePromptSubmit = useCallback((value: string) => {
    // Add user input to terminal lines
    const newLines = [...terminalLinesRef.current, { type: 'input' as const, text: value }];
    terminalLinesRef.current = newLines;
    setTerminalLines(newLines);
    setWaitingForInput(false);
    // Resolve the pending input promise
    if (inputResolveRef.current) {
      inputResolveRef.current(value);
      inputResolveRef.current = null;
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('python-lab-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as Language);
    localStorage.setItem('python-lab-language', lang);
    if (lastExecution && lastExecution.error) {
      explainError(lastExecution.code, lastExecution.error, lang as Language);
    }
  };

  const handleRun = useCallback(async () => {
    if (!isRuntimeReady || isRunningRef.current) return;

    isRunningRef.current = true;
    setIsRunning(true);
    setOutput('');
    setError(null);
    setErrorLine(null);
    clearExplanation();
    setTerminalLines([]);
    terminalLinesRef.current = [];
    setWaitingForInput(false);
    setMobileTab('console');
    collectedInputsRef.current = [];
    inputResolveRef.current = null;

    // Accumulate streamed output in a ref so the callback always has the latest value
    const streamedRef = { current: '' };

    // Streaming callback — called on every print() char/chunk from Python
    const onStream = isCFile ? undefined : (chunk: string) => {
      streamedRef.current += chunk;
      setOutput(streamedRef.current.trimEnd());
    };

    try {
      // Re-run loop: execute code, if it needs input, prompt user, accumulate, re-run
      let done = false;
      while (!done) {
        // Reset streamed output for each re-run attempt
        streamedRef.current = '';
        setOutput('');

        const result = await (isCFile
          ? executeC(code, collectedInputsRef.current)
          : executePython(code, collectedInputsRef.current, onStream));

        if (result.needsInput) {
          // Show whatever was streamed so far, then show the prompt
          const promptText = result.inputPrompt || '';
          const newLines = [...terminalLinesRef.current, { type: 'prompt' as const, text: promptText }];
          terminalLinesRef.current = newLines;
          setTerminalLines(newLines);
          setWaitingForInput(true);

          // Wait for user to submit input
          const userValue = await new Promise<string>((resolve) => {
            inputResolveRef.current = resolve;
          });

          // Add the user's value to accumulated inputs for re-run
          collectedInputsRef.current = [...collectedInputsRef.current, userValue];
          // Continue the loop — code will be re-run with all accumulated inputs
        } else {
          // Code finished (success or real error)
          done = true;
          setTerminalLines([]);
          terminalLinesRef.current = [];
          setWaitingForInput(false);
          // Use final result.output (full accumulated) as source of truth
          setOutput(result.output);

          if (result.error) {
            setError(result.error);
            setErrorLine(result.errorLine);
            setLastExecution({ code, error: result.error });
            if (helpMode === 'auto') {
              await explainError(code, result.error, language);
            }
          } else {
            setLastExecution(null);
          }

          await saveToHistory(code, result.output, result.error);
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Execution failed';
      setError(errorMsg);
      setLastExecution({ code, error: errorMsg });
    } finally {
      isRunningRef.current = false;
      setIsRunning(false);
    }
  }, [code, isRuntimeReady, isCFile, executeC, executePython, helpMode, language, explainError, saveToHistory, clearExplanation]);

  // Global F5 Shortcut for Running Code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser refresh and run the code instead
      if (e.key === 'F5') {
        e.preventDefault();
        if (isRuntimeReady && !isRunningRef.current) {
          handleRun();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRun, isRuntimeReady]);

  const handleRunFromSaved = useCallback((savedCode: string) => {
    setCode(savedCode);
    localStorage.setItem('python-code', savedCode);
    setTimeout(() => handleRun(), 100);
  }, [handleRun]);

  const handleExplainFromSaved = useCallback((savedCode: string) => {
    setCode(savedCode);
    localStorage.setItem('python-code', savedCode);
    setShowAskAI(true);
  }, []);

  const handleGetAIHelp = useCallback(async () => {
    if (lastExecution) {
      await explainError(lastExecution.code, lastExecution.error, language);
    }
  }, [lastExecution, explainError, language]);

  const handleApplyFix = useCallback((fixedCode: string) => {
    setCode(fixedCode);
    setError(null);
    setErrorLine(null);
    setOutput('');
    clearExplanation();
    setMobileTab('editor');
    localStorage.setItem('python-code', fixedCode);
  }, [clearExplanation]);

  const handleClearCode = useCallback(() => {
    setCode('');
    setOutput('');
    setError(null);
    setErrorLine(null);
    clearExplanation();
    localStorage.setItem('python-code', '');
  }, [clearExplanation]);

  const handleClearOutput = useCallback(() => {
    setOutput('');
    setError(null);
    setErrorLine(null);
  }, []);

  const handleSelectHistory = useCallback((item: CodeHistoryItem) => {
    setCode(item.code);
    setOutput(item.output);
    setError(item.error);
    localStorage.setItem('python-code', item.code);
  }, []);

  const handleDeleteHistory = useCallback((id: string) => {
    deleteFromHistory(id);
  }, [deleteFromHistory]);

  const handleGenerateCode = async (prompt: string) => {
    try {
      const res = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });
      if (!res.ok) {
        throw await aiClientError(res, 'Failed to generate code');
      }
      const data = await res.json();
      setCode(data.code);
      localStorage.setItem('python-code', data.code);
    } catch (err) {
      console.error('Failed to generate code:', err);
      throw err;
    }
  };

  return (
    <div className="python-lab-root flex flex-col h-[100dvh]">
      {/* Top Bar */}
      <header className="flex flex-col bg-[var(--header-bg)] backdrop-blur-2xl border-b border-[var(--border-color)] relative z-20 w-full">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent"></div>

        {/* Compact Mobile Header / Full Desktop Header */}
        <div className="flex items-center justify-between px-2 md:px-6 h-[50px] md:h-auto md:py-3 w-full">

          {/* Left: Logo & Title */}
          <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
            <button
              onClick={() => router.push('/')}
              title="Back to Home"
              className="w-8 h-8 md:w-11 md:h-11 rounded-full border border-gray-200/80 dark:border-[var(--border-color)] shadow-sm flex items-center justify-center bg-white dark:bg-[var(--glass-bg)] hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] flex-shrink-0 transition-all hover:shadow-md hover:-translate-x-1"
            >
              <img src="/sample-assets/placeholder.svg" alt="Back" className="w-4 h-4 md:w-7 md:h-7 object-contain" />
            </button>
            <div className="relative flex-shrink-0">
              <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-white/10 flex items-center justify-center shadow-lg border border-[var(--border-color)]">
                {isCFile ? (
                  <img src="/sample-assets/placeholder.svg" alt="C" className="w-[18px] h-[18px] md:w-6 md:h-6 object-contain drop-shadow-md" />
                ) : (
                  <img src="/sample-assets/placeholder.svg" alt="Python" className="w-[18px] h-[18px] md:w-6 md:h-6 object-contain drop-shadow-md" />
                )}
              </div>
              <div className={cn("absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 rounded-full border border-[var(--bg-primary)]", isCFile ? "bg-emerald-400" : "bg-[var(--accent-success)]")} />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-[14px] md:text-lg font-bold leading-tight truncate font-mono tracking-tight text-[var(--text-primary)]">
                {isCFile ? 'AI C Compiler' : 'AI Python Tab'}
              </h1>
              <span className="text-[10px] text-[var(--text-muted,#64748b)] -mt-0.5 hidden sm:block">{isCFile ? 'Learn C with AI' : 'Learn Python with AI'}</span>
            </div>
          </div>

          {/* Right Actions Group */}
          <div className="flex items-center justify-end gap-1 md:gap-2 flex-1 min-w-0">
            
            {/* Run Button (Desktop Only) */}
            <div className="hidden md:block flex-shrink-0">
              <Button
                variant="ghost"
                onClick={handleRun}
                disabled={!isRuntimeReady || isRunning}
                data-run-button="true"
                className={cn(
                  "flex items-center justify-center gap-2 px-6 h-10 rounded-full bg-white dark:bg-[var(--glass-bg)] hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] border border-gray-200 dark:border-[var(--border-color)] shadow-sm hover:shadow-md transition-all group",
                  isRuntimeReady && !isRunning && (isCFile ? 'shadow-green-500/10' : 'shadow-indigo-500/10')
                )}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className={cn("w-4 h-4 transition-transform duration-300", isCFile ? 'text-green-500' : 'text-blue-500', isRunning ? "animate-spin" : "group-hover:scale-110")}>
                  {isRunning ? <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10H20c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8V2z" /> : <polygon points="6,4 20,12 6,20" />}
                </svg>
                <span className="font-extrabold text-[#2a2a2a] dark:text-white text-[14px] tracking-widest uppercase mt-0.5">
                  {isRunning ? (isCFile ? 'Compiling' : 'Running') : (isCFile ? 'Compile' : 'Run')}
                </span>
              </Button>
            </div>

                {/* Ask AI Button (Desktop text, Mobile icon only) */}
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                onClick={() => setShowAskAI(true)}
                className="flex items-center justify-center gap-1.5 md:gap-2 w-8 h-8 md:w-auto px-0 md:px-5 md:h-10 rounded-full bg-white dark:bg-[var(--glass-bg)] hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] border border-gray-200/50 dark:border-[var(--border-color)] shadow-sm hover:shadow-md transition-all text-[var(--text-primary)] group"
                title="Ask AI"
              >
                {/* CSS Ring Icon (Visible on both, fixes SVG mobile bug) */}
                <div className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] rounded-full border-[3px] border-b-pink-500 border-l-pink-500 border-t-purple-500 border-r-indigo-500 animate-[spin_3s_linear_infinite] shrink-0 group-hover:scale-110 transition-transform" />
                {/* Text (Visible on desktop only) */}
                <span className="hidden md:inline font-extrabold text-[#2a2a2a] dark:text-white text-sm tracking-tight mt-0.5">
                  i<span className="text-base uppercase">A</span>sk
                </span>
              </Button>
            </div>

            <div className="hidden md:block w-px h-6 bg-[var(--border-color)] mx-1 flex-shrink-0" />

            {/* Saved Codes */}
            <button
              onClick={() => isLoggedIn ? setShowSavedCodes(true) : setShowLoginModal(true)}
              title={isLoggedIn ? 'My Saved Codes' : 'Login to save codes'}
              className="w-8 h-8 md:w-11 md:h-11 rounded-full border border-gray-200/50 dark:border-[var(--border-color)] flex items-center justify-center transition-all bg-[var(--glass-bg)] shadow-sm hover:scale-105 flex-shrink-0"
            >
              <img src="/sample-assets/placeholder.svg" alt="Saved" className="w-[18px] h-[18px] md:w-6 md:h-6 object-contain" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-8 h-8 md:w-11 md:h-11 rounded-full border border-gray-200/50 dark:border-[var(--border-color)] flex items-center justify-center transition-all bg-[var(--glass-bg)] shadow-sm hover:scale-105 flex-shrink-0"
            >
              {theme === 'dark' ? (
                <Moon className="w-[16px] h-[16px] md:w-[22px] md:h-[22px] text-indigo-300 fill-indigo-300/20" />
              ) : (
                <Sun className="w-[16px] h-[16px] md:w-[22px] md:h-[22px] text-amber-500 fill-amber-500/20" />
              )}
            </button>

            {/* Profile */}
            <div className="relative flex-shrink-0 md:ml-2" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 md:w-11 md:h-11 rounded-full border-2 border-[var(--accent-primary)]/40 flex items-center justify-center overflow-hidden shadow-sm"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} className="w-full h-full object-cover" alt="" />
                ) : (
                  <img src="/sample-assets/placeholder.svg" alt="User" className="w-[18px] h-[18px] md:w-full md:h-full object-contain" />
                )}
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-[260px] rounded-2xl z-50 bg-white dark:bg-[#1a1a2e] border border-gray-200/60 dark:border-indigo-500/20 shadow-[0_10px_40px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-5px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-500/10 dark:to-purple-500/5">
                    {user ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm shrink-0 bg-white">
                          {user.photoURL ? (
                            <img src={user.photoURL} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <img src="/sample-assets/placeholder.svg" alt="User" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <p className="text-[14px] font-bold text-gray-900 dark:text-white truncate leading-tight">
                            {user.displayName || 'User'}
                          </p>
                          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {user.email || 'Free Plan'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 border-2 border-white dark:border-gray-700 shadow-sm">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-[14px] font-bold text-gray-900 dark:text-white leading-tight">Guest Account</p>
                          <p className="text-[11px] text-indigo-500 dark:text-indigo-400 font-medium mt-0.5">Sign in to save code</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-white dark:bg-[#1a1a2e]">
                    {user ? (
                      <button
                        onClick={() => { logout(); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
                      >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Sign Out
                      </button>
                    ) : (
                      <button
                        onClick={() => { setShowLoginModal(true); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors group"
                      >
                        <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        Sign In
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-2 pt-2">
        <button
          onClick={() => setMobileTab('editor')}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors border-b-2 rounded-t-lg",
            mobileTab === 'editor'
              ? "border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/5"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]"
          )}
        >
          Code Editor
        </button>
        <button
          onClick={() => setMobileTab('console')}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors border-b-2 rounded-t-lg",
            mobileTab === 'console'
              ? "border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/5"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]"
          )}
        >
          Output Console
        </button>
      </div>

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 flex flex-col md:flex-row gap-0 p-0 overflow-hidden h-[calc(100dvh-64px)] md:h-[calc(100dvh-73px)]" style={{ cursor: isDraggingRef.current ? 'col-resize' : undefined }}>
        {/* VS Code-style File Explorer Sidebar (Desktop only) */}
        <div className="hidden md:flex h-full flex-shrink-0">
          <EditorFileExplorer
            codes={codes}
            isLoggedIn={isLoggedIn}
            onSelectFile={handleSelectSavedCode}
            onDelete={deleteCode}
            onUpdate={updateCode}
            onSave={handleSaveCode}
            onLoginRequired={() => setShowLoginModal(true)}
            activeFileId={activeFileId}
            onLanguageSwitch={handleLanguageSwitch}
          />
        </div>

        {/* Top/Left Panel - Code Editor */}
        <div className={cn(
          "h-full w-full md:block",
          mobileTab !== 'editor' && "hidden"
        )} style={{ flex: `1 1 ${editorWidthPercent}%`, minWidth: 200 }}>
          <Card className="h-full overflow-hidden border-0 md:border-[var(--border-color)] bg-[var(--card-bg)] rounded-none md:rounded-xl">
            <PythonCodeEditor
              code={code}
              onChange={(newCode: string) => {
                setCode(newCode);
                updateActiveTab({ isDirty: true });
              }}
              activeFileName={activeFileName}
              onActiveFileNameChange={(name: string) => {
                updateActiveTab({ name, isDirty: true });
              }}
              isDirty={isDirty}
              isSaving={isSaving}
              onSaveAs={() => {
                setShowSavePopup(true);
              }}
              tabs={tabs}
              activeTabIndex={activeTabIndex}
              onSwitchTab={handleSwitchTab}
              onCloseTab={handleCloseTab}
              onNewTab={handleNewTab}
              errorLine={errorLine}
              isLoading={isRuntimeLoading}
              theme={theme}
              onThemeToggle={handleThemeToggle}
              onShowHistory={() => setShowHistory(true)}
              onRun={handleRun}
              isRunning={isRunning}
              isReady={isRuntimeReady}
              onAskAI={() => setShowAskAI(true)}
              onSave={handleEditorSave}
              onShowSavedCodes={() => isLoggedIn ? setShowSavedCodes(true) : setShowLoginModal(true)}
            />
          </Card>
        </div>

        {/* ═══ Draggable Resizer ═══ */}
        <div
          className="hidden md:flex"
          style={{ width:6, cursor:'col-resize', background:'transparent', flexShrink:0, alignItems:'center', justifyContent:'center', zIndex:5, position:'relative' }}
          onMouseDown={(e) => {
            e.preventDefault();
            isDraggingRef.current = true;
            const main = mainRef.current;
            if (!main) return;
            const onMove = (ev: MouseEvent) => {
              if (!isDraggingRef.current) return;
              const rect = main.getBoundingClientRect();
              // Subtract sidebar width from calculation
              const sidebar = main.querySelector('.hidden.md\\:flex') as HTMLElement;
              const sidebarW = sidebar ? sidebar.getBoundingClientRect().width : 0;
              const available = rect.width - sidebarW - 6; // minus resizer
              const editorW = ev.clientX - rect.left - sidebarW;
              const pct = Math.min(80, Math.max(25, (editorW / available) * 100));
              setEditorWidthPercent(pct);
            };
            const onUp = () => { isDraggingRef.current = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); document.body.style.cursor = ''; document.body.style.userSelect = ''; };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
          }}
        >
          <div style={{ width:3, height:40, borderRadius:2, background:'var(--border-color, #d1d5db)', opacity:0.5, transition:'opacity 0.15s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')} />
        </div>

        {/* Bottom/Right Panel - Combined Console & AI */}
        <div className={cn(
          "h-full w-full md:block",
          mobileTab !== 'console' && "hidden"
        )} style={{ flex: `0 1 ${100 - editorWidthPercent}%`, minWidth: 200 }}>
          <Card className="h-full overflow-hidden border-0 md:border-[var(--border-color)] bg-[var(--card-bg)] rounded-none md:rounded-xl">
            <PythonConsole
              output={output}
              error={error}
              onClear={handleClearOutput}
              onGetAIHelp={handleGetAIHelp}
              onApplyFix={handleApplyFix}
              isAILoading={isAILoading}
              helpMode={helpMode}
              language={language}
              explanation={explanation}
              aiError={aiError}
              terminalLines={terminalLines}
              waitingForInput={waitingForInput}
              onPromptSubmit={handlePromptSubmit}
              onLanguageChange={handleLanguageChange}
              theme={theme}
            />
          </Card>
        </div>
      </main>

      {/* Code History Drawer */}
      <PythonHistory
        history={history}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
      />

      <PythonAskAIModal
        isOpen={showAskAI}
        onClose={() => setShowAskAI(false)}
        onGenerate={handleGenerateCode}
        language={language}
      />

      {/* Saved Codes Modal */}
      <SavedCodesModal
        isOpen={showSavedCodes}
        onClose={() => {
          setShowSavedCodes(false);
        }}
        codes={codes}
        isLoading={isSavedCodesLoading}
        onSave={handleSaveCode}
        onDelete={deleteCode}
        onToggleImportant={toggleImportant}
        onUpdate={updateCode}
        onSelect={handleSelectSavedCode}
        onRun={handleRunFromSaved}
        onExplain={handleExplainFromSaved}
        currentCode={code}
      />

      {/* Save File Popup */}
      <SaveFilePopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        initialName={activeFileName}
        onSave={handleSavePopupSubmit}
        existingFolders={codes.map(c => c.folder || '').filter(Boolean)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
