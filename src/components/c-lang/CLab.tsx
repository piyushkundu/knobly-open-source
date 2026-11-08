'use client';

import { aiClientError } from '@/lib/ai-limits';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Play, History, Sparkles, Code2, Zap, Sun, Moon, Trash2, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CCodeEditor } from './CCodeEditor';
import { CConsole } from './CConsole';
import { CHistory } from './CHistory';
import { CAskAIModal } from './CAskAIModal';
import { Button } from '../python/ui/Button';
import { Card } from '../python/ui/Card';
import { Toggle } from '../python/ui/Toggle';
import { useJSCPP } from '@/hooks/useJSCPP';
import { useCAIExplain, useCCodeHistory } from '@/hooks/useCCodeHistory';
import { CCodeHistoryItem, Language, HelpMode } from '@/types/c-lang';
import { cn } from '@/lib/c-utils';

const DEFAULT_CODE = `#include <stdio.h>

// Welcome to AI C Compiler Lab!
// Write your C code here and click Run to execute

int main() {
    printf("Hello, World!\\n");
    
    // Try creating an error to see AI explanation:
    // pritnf("Typo in printf\\n");
    
    return 0;
}
`;

import './c-lab.css';

export function CLab() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [helpMode, setHelpMode] = useState<HelpMode>('manual');
  const [showHistory, setShowHistory] = useState(false);
  const [showAskAI, setShowAskAI] = useState(false);
  const [lastExecution, setLastExecution] = useState<{ code: string; error: string } | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [mobileTab, setMobileTab] = useState<'editor' | 'console'>('editor');
  
  // Interactive prompt state
  const [terminalLines, setTerminalLines] = useState<Array<{ type: 'prompt' | 'input'; text: string }>>([]);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const inputResolveRef = useRef<((value: string) => void) | null>(null);
  const collectedInputsRef = useRef<string[]>([]);
  const terminalLinesRef = useRef<Array<{ type: 'prompt' | 'input'; text: string }>>([]);
  const isRunningRef = useRef(false);
  const router = useRouter();

  const { isLoading: isJSCPPLoading, isReady: isJSCPPReady, executeCode } = useJSCPP();
  const { isLoading: isAILoading, explanation, error: aiError, explainError, clearExplanation } = useCAIExplain();
  const { history, saveToHistory, deleteFromHistory } = useCCodeHistory();

  useEffect(() => {
    const savedLang = localStorage.getItem('c-lab-language') as Language;
    if (savedLang) setLanguage(savedLang);

    const savedCode = localStorage.getItem('c-code');
    if (savedCode) setCode(savedCode);

    const savedTheme = localStorage.getItem('c-lab-theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    } else {
      setTheme('light');
      document.documentElement.classList.add('light');
    }
  }, []);

  const handlePromptSubmit = useCallback((value: string) => {
    const newLines = [...terminalLinesRef.current, { type: 'input' as const, text: value }];
    terminalLinesRef.current = newLines;
    setTerminalLines(newLines);
    setWaitingForInput(false);
    
    if (inputResolveRef.current) {
      inputResolveRef.current(value);
      inputResolveRef.current = null;
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('c-lab-theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as Language);
    localStorage.setItem('c-lab-language', lang);
  };

  const handleRun = useCallback(async () => {
    if (!isJSCPPReady || isRunningRef.current) return;

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

    try {
      let done = false;
      while (!done) {
        const result = await executeCode(code, collectedInputsRef.current);

        if (result.needsInput) {
          const promptText = result.inputPrompt || '';
          const newLines = [...terminalLinesRef.current, { type: 'prompt' as const, text: promptText }];
          terminalLinesRef.current = newLines;
          setTerminalLines(newLines);
          setWaitingForInput(true);

          const userValue = await new Promise<string>((resolve) => {
            inputResolveRef.current = resolve;
          });

          collectedInputsRef.current = [...collectedInputsRef.current, userValue];
        } else {
          done = true;
          setTerminalLines([]);
          terminalLinesRef.current = [];
          setWaitingForInput(false);
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
  }, [code, isJSCPPReady, executeCode, helpMode, language, explainError, saveToHistory, clearExplanation]);

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
    localStorage.setItem('c-code', fixedCode);
  }, [clearExplanation]);

  const handleClearOutput = useCallback(() => {
    setOutput('');
    setError(null);
    setErrorLine(null);
  }, []);

  const handleSelectHistory = useCallback((item: CCodeHistoryItem) => {
    setCode(item.code);
    setOutput(item.output);
    setError(item.error);
    localStorage.setItem('c-code', item.code);
  }, []);

  const handleGenerateCode = async (prompt: string) => {
    try {
      const res = await fetch('/api/c-ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });
      if (!res.ok) throw await aiClientError(res, 'Failed to generate code');
      const data = await res.json();
      setCode(data.code);
      localStorage.setItem('c-code', data.code);
    } catch (err) {
      console.error('Failed to generate code:', err);
      throw err;
    }
  };

  return (
    <div className="c-lab-root flex flex-col h-[100dvh]">
      <header className="flex flex-col bg-[var(--header-bg)] backdrop-blur-2xl border-b border-[var(--border-color)] relative z-20 w-full overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between px-3 md:px-6 py-2 md:py-3 w-full gap-2 md:gap-0">
          <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="secondary" size="sm" onClick={() => router.push('/')} className="h-8 w-8 md:h-9 md:w-9 p-0 mr-1 md:mr-2 rounded-lg flex-shrink-0 shadow-sm" title="Back to Home">
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-[var(--text-primary)]" />
              </Button>
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 text-white">
                  <Code2 className="w-4 h-4 md:w-5 md:h-5" color="white" strokeWidth={2.5} />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-400 rounded-full border-2 border-[var(--bg-primary)]" />
              </div>
              <div className="flex flex-col min-w-0">
                <h1 className="text-base md:text-lg font-bold leading-tight truncate font-mono tracking-tight">
                  <span className="text-[var(--text-primary)] whitespace-nowrap">
                    AI C Compiler
                  </span>
                </h1>
                <span className="text-[9px] md:text-[10px] text-[var(--text-muted)] -mt-0.5 hidden sm:block">Learn C with AI</span>
              </div>
            </div>

            <div className="flex md:hidden items-center ml-2">
              <Toggle options={[{ value: 'en', label: 'EN' }, { value: 'hi', label: 'HI' }]} value={language} onChange={handleLanguageChange} className="flex-shrink-0" />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar md:overflow-visible pb-1 md:pb-0 scroll-smooth w-full md:w-auto -mx-1 px-1 md:mx-0 md:px-0 mt-2 md:mt-0">
            <div className="hidden md:block flex-shrink-0">
              <Button variant="primary" size="lg" onClick={handleRun} disabled={!isJSCPPReady || isRunning} data-c-run-button title="Run Code (F5)" className={cn("px-4 bg-green-500 hover:bg-green-600 border-transparent", isJSCPPReady && !isRunning && 'animate-pulse-glow')}>
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    <span>Run Code</span>
                  </>
                )}
              </Button>
            </div>

            <div className="hidden md:block w-px h-6 bg-[var(--border-color)] mx-2 flex-shrink-0" />

            <div className="md:hidden flex-shrink-0">
              <Button variant="primary" size="sm" onClick={() => setShowAskAI(true)} className="flex bg-green-500 hover:bg-green-600 border-transparent shadow-lg px-3 flex-shrink-0">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Ask AI Question</span>
              </Button>
            </div>
            
            <div className="hidden md:block w-px h-6 bg-[var(--border-color)] mr-2 flex-shrink-0" />

            <div className="hidden md:flex items-center gap-1.5 md:gap-2 bg-[var(--glass-bg)] border border-[var(--border-color)] rounded-lg p-0.5 md:p-1 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={handleThemeToggle} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} className="h-7 w-7 md:h-10 md:w-10 p-0">
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 md:w-5 md:h-5" /> : <Moon className="w-3.5 h-3.5 md:w-5 md:h-5" />}
              </Button>

              <div className="w-px h-6 bg-[var(--border-color)] mx-1" />
              
              <Button variant="ghost" size="sm" onClick={() => setShowHistory(true)} className="h-7 w-7 md:h-10 md:w-10 p-0">
                <History className="w-3.5 h-3.5 md:w-5 md:h-5" />
              </Button>
            </div>

            <div className="ml-auto flex-shrink-0">
              <Toggle options={[{ value: 'manual', label: 'Manual' }, { value: 'auto', label: 'Auto AI' }]} value={helpMode} onChange={(v) => setHelpMode(v as HelpMode)} className="flex-shrink-0" />
            </div>

            <div className="hidden md:block flex-shrink-0">
              <Toggle options={[{ value: 'en', label: 'EN' }, { value: 'hi', label: 'HI' }]} value={language} onChange={handleLanguageChange} className="flex-shrink-0" />
            </div>

            <div className="hidden md:block ml-2 flex-shrink-0">
              <Button variant="primary" size="lg" onClick={() => setShowAskAI(true)} className="flex bg-green-500 hover:bg-green-600 border-transparent shadow-lg px-4 flex-shrink-0 h-11">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Ask AI Question</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex md:hidden border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-2 pt-2">
        <button onClick={() => setMobileTab('editor')} className={cn("flex-1 py-3 text-sm font-medium transition-colors border-b-2 rounded-t-lg", mobileTab === 'editor' ? "border-green-500 text-green-500 bg-green-500/5" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]")}>Code Editor</button>
        <button onClick={() => setMobileTab('console')} className={cn("flex-1 py-3 text-sm font-medium transition-colors border-b-2 rounded-t-lg", mobileTab === 'console' ? "border-green-500 text-green-500 bg-green-500/5" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]")}>Output Console</button>
      </div>

      <main className="flex-1 flex flex-col md:flex-row gap-0 md:gap-4 p-0 md:p-4 overflow-hidden h-[calc(100dvh-64px)] md:h-[calc(100dvh-73px)]">
        <div className={cn("h-full w-full md:w-[55%] relative flex-shrink-0 md:block", mobileTab !== 'editor' && "hidden")}>
          <Card className="h-full overflow-hidden border-0 md:border-[var(--border-color)] bg-[var(--card-bg)] rounded-none md:rounded-xl">
            <CCodeEditor code={code} onChange={setCode} errorLine={errorLine} isLoading={isJSCPPLoading} theme={theme} onThemeToggle={handleThemeToggle} onShowHistory={() => setShowHistory(true)} onRun={handleRun} isRunning={isRunning} isReady={isJSCPPReady} onAskAI={() => setShowAskAI(true)} />
          </Card>
        </div>

        <div className={cn("h-full w-full md:w-[45%] flex-shrink-0 md:block", mobileTab !== 'console' && "hidden")}>
          <Card className="h-full overflow-hidden border-0 md:border-[var(--border-color)] bg-[var(--card-bg)] rounded-none md:rounded-xl">
            <CConsole output={output} error={error} onClear={handleClearOutput} onGetAIHelp={handleGetAIHelp} onApplyFix={handleApplyFix} isAILoading={isAILoading} helpMode={helpMode} language={language} explanation={explanation} aiError={aiError} terminalLines={terminalLines} waitingForInput={waitingForInput} onPromptSubmit={handlePromptSubmit} />
          </Card>
        </div>
      </main>

      <CHistory history={history} isOpen={showHistory} onClose={() => setShowHistory(false)} onSelect={handleSelectHistory} onDelete={deleteFromHistory} />
      <CAskAIModal isOpen={showAskAI} onClose={() => setShowAskAI(false)} onGenerate={handleGenerateCode} language={language} />
    </div>
  );
}
