'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import Editor, { OnMount, OnChange, BeforeMount } from '@/lib/community-editor';
import type { editor } from 'monaco-editor';
import { cn } from '@/lib/python-utils';
import { Trash2, RotateCcw, Sparkles, Play, Sun, Moon, History, ZoomIn, ZoomOut, Save, FolderOpen, Plus, X, Check, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';

interface PythonCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  errorLine?: number | null;
  isLoading?: boolean;
  theme?: 'dark' | 'light';
  onThemeToggle?: () => void;
  onShowHistory?: () => void;
  onRun?: () => void;
  isRunning?: boolean;
  isReady?: boolean;
  onAskAI?: () => void;
  onSave?: () => void;
  onShowSavedCodes?: () => void;
  activeFileName?: string;
  onActiveFileNameChange?: (name: string) => void;
  isDirty?: boolean;
  isSaving?: boolean;
  onSaveAs?: () => void;
  tabs?: { id: string; name: string; isDirty: boolean; savedId?: string | null }[];
  activeTabIndex?: number;
  onSwitchTab?: (index: number) => void;
  onCloseTab?: (index: number) => void;
  onNewTab?: () => void;
}

const DEFAULT_CODE = `print("Hello, World!")`;

export function PythonCodeEditor({ 
  code, 
  onChange, 
  errorLine, 
  isLoading, 
  theme = 'dark',
  onThemeToggle,
  onShowHistory,
  onRun,
  isRunning,
  isReady,
  onAskAI,
  onSave,
  onShowSavedCodes,
  activeFileName,
  onActiveFileNameChange,
  isDirty,
  isSaving,
  onSaveAs,
  tabs = [],
  activeTabIndex = 0,
  onSwitchTab,
  onCloseTab,
  onNewTab,
}: PythonCodeEditorProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [fontSize, setFontSize] = useState(15);
  const [isEditingName, setIsEditingName] = useState(false);
  const [localName, setLocalName] = useState(activeFileName || 'Untitled.py');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalName(activeFileName || 'Untitled.py');
  }, [activeFileName]);

  const handleNameSubmit = () => {
    if (localName.trim() && localName !== activeFileName) {
      let freshName = localName.trim();
      if (!freshName.endsWith('.py')) freshName += '.py';
      onActiveFileNameChange?.(freshName);
      setLocalName(freshName);
    } else {
      setLocalName(activeFileName || 'Untitled.py');
    }
    setIsEditingName(false);
  };

  useEffect(() => {
    if (isEditingName && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingName]);

  // Load saved font size
  useEffect(() => {
    const savedSize = localStorage.getItem('python-editor-font-size');
    if (savedSize) {
      const size = parseInt(savedSize, 10);
      if (size >= 10 && size <= 32) setFontSize(size);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBeforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme('python-lab-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: 'f472b6', fontStyle: 'bold' },
        { token: 'string', foreground: '34d399' },
        { token: 'string.escape', foreground: 'fbbf24' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'number.hex', foreground: 'fbbf24' },
        { token: 'function', foreground: '22d3ee' },
        { token: 'function.builtin', foreground: '22d3ee', fontStyle: 'bold' },
        { token: 'variable', foreground: 'f8fafc' },
        { token: 'variable.parameter', foreground: 'fb923c' },
        { token: 'operator', foreground: 'f472b6' },
        { token: 'delimiter', foreground: '94a3b8' },
        { token: 'delimiter.bracket', foreground: '94a3b8' },
        { token: 'type', foreground: 'a78bfa' },
        { token: 'class', foreground: 'a78bfa', fontStyle: 'bold' },
        { token: 'tag', foreground: 'f472b6' },
        { token: 'attribute.name', foreground: '22d3ee' },
        { token: 'attribute.value', foreground: '34d399' },
      ],
      colors: {
        'editor.background': '#16161e',
        'editor.foreground': '#f8fafc',
        'editor.lineHighlightBackground': '#1e1e2e',
        'editor.selectionBackground': '#818cf850',
        'editorCursor.foreground': '#2dd4bf',
        'editorLineNumber.foreground': '#4b5563',
        'editorLineNumber.activeForeground': '#9ca3af',
        'editor.inactiveSelectionBackground': '#818cf830',
        'editorCursor.background': '#16161e',
        'editor.findMatchBackground': '#818cf840',
        'editor.findMatchHighlightBackground': '#818cf830',
        'editorBracketMatch.background': '#818cf830',
        'editorBracketMatch.border': '#818cf8',
        'editorIndentGuide.background': '#28283d',
        'editorIndentGuide.activeBackground': '#3a3a5a',
      },
    });

    monaco.editor.defineTheme('python-lab-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' },
        { token: 'keyword', foreground: '7c3aed', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: '7c3aed', fontStyle: 'bold' },
        { token: 'string', foreground: '16a34a' },
        { token: 'string.escape', foreground: '16a34a' },
        { token: 'number', foreground: 'ea580c' },
        { token: 'number.hex', foreground: 'ea580c' },
        { token: 'function', foreground: '2563eb' },
        { token: 'function.builtin', foreground: '2563eb', fontStyle: 'bold' },
        { token: 'variable', foreground: '111827' },
        { token: 'variable.parameter', foreground: '111827' },
        { token: 'operator', foreground: '7c3aed' },
        { token: 'delimiter', foreground: '475569' },
        { token: 'delimiter.bracket', foreground: '475569' },
        { token: 'type', foreground: '7c3aed' },
        { token: 'class', foreground: '7c3aed', fontStyle: 'bold' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#111827',
        'editor.lineHighlightBackground': '#eef2ff',
        'editor.selectionBackground': '#c7d2fe',
        'editorCursor.foreground': '#2563eb',
        'editorLineNumber.foreground': '#94a3b8',
        'editorLineNumber.activeForeground': '#111827',
        'editor.inactiveSelectionBackground': '#e0e7ff',
        'editorCursor.background': '#ffffff',
        'editorIndentGuide.background': '#e2e8f0',
        'editorIndentGuide.activeBackground': '#cbd5e1',
      },
    });
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.addCommand(monaco.KeyCode.F5, () => {
      const runButton = document.querySelector('[data-run-button]') as HTMLButtonElement;
      if (runButton) {
        runButton.click();
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL, () => {
      const clearButton = document.querySelector('[data-clear-button]') as HTMLButtonElement;
      if (clearButton) {
        clearButton.click();
      }
    });

    const savedCode = localStorage.getItem('python-code');
    if (savedCode && !code) {
      onChange(savedCode);
    }
    
    editor.focus();
  };

  const handleChange: OnChange = useCallback((value) => {
    const newValue = value || '';
    onChange(newValue);
    localStorage.setItem('python-code', newValue);
  }, [onChange]);

  const handleClear = useCallback(() => {
    onChange('');
    localStorage.setItem('python-code', '');
    if (editorRef.current) {
      editorRef.current.setValue('');
      editorRef.current.focus();
    }
  }, [onChange]);

  const handleReset = useCallback(() => {
    onChange(DEFAULT_CODE);
    localStorage.setItem('python-code', DEFAULT_CODE);
    if (editorRef.current) {
      editorRef.current.setValue(DEFAULT_CODE);
      editorRef.current.focus();
    }
  }, [onChange]);

  const handleZoomIn = useCallback(() => {
    setFontSize(prev => {
      const next = Math.min(prev + 2, 32);
      localStorage.setItem('python-editor-font-size', String(next));
      if (editorRef.current) {
        editorRef.current.updateOptions({ fontSize: next });
      }
      return next;
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setFontSize(prev => {
      const next = Math.max(prev - 2, 10);
      localStorage.setItem('python-editor-font-size', String(next));
      if (editorRef.current) {
        editorRef.current.updateOptions({ fontSize: next });
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (editorRef.current && monacoRef.current && errorLine) {
      const model = editorRef.current.getModel();
      if (model) {
        const lineCount = model.getLineCount();
        const validLine = Math.min(Math.max(1, errorLine), lineCount);
        
        const decorations = editorRef.current.deltaDecorations(
          decorationsRef.current,
          [
            {
              range: new monacoRef.current!.Range(validLine, 1, validLine, 1),
              options: {
                isWholeLine: true,
                className: 'error-line-highlight',
                glyphMarginClassName: 'error-glyph',
                overviewRuler: {
                  color: '#ef4444',
                  position: monacoRef.current!.editor.OverviewRulerLane.Full,
                },
              },
            },
          ]
        );
        decorationsRef.current = decorations;

        editorRef.current.revealLineInCenter(validLine);
      }
    } else if (editorRef.current && monacoRef.current && !errorLine) {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  }, [errorLine]);

  return (
    <div className="relative h-full w-full flex flex-col bg-[var(--bg-primary)]">
      
      {/* Mobile Tools Row (Hidden on Desktop) */}
      <div className="flex md:hidden items-center justify-between px-3 py-2.5 border-b border-[var(--border-color)] bg-[#f8fafc] dark:bg-[var(--bg-secondary)] gap-3 overflow-x-auto no-scrollbar shadow-sm relative z-10 w-full">
        {onRun && (
          <Button
            variant="primary"
            size="sm"
            onClick={onRun}
            disabled={!isReady || isRunning}
            data-run-button="true"
            className={cn(
              "px-3.5 h-8 shadow-sm flex-shrink-0 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white",
              isReady && !isRunning && 'animate-pulse-glow'
            )}
          >
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current mr-1" />
                <span className="text-xs font-bold tracking-wide">Run</span>
              </>
            )}
          </Button>
        )}
        
        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
          {/* Zoom In / Zoom Out */}
          <div className="flex items-center bg-white dark:bg-[var(--bg-primary)] border border-gray-200 dark:border-[var(--border-color)] rounded-lg overflow-hidden h-8 flex-shrink-0 shadow-sm">
            <button
              onClick={handleZoomOut}
              disabled={fontSize <= 10}
              className="flex items-center justify-center w-8 h-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] disabled:opacity-30 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-[var(--border-color)]" />
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] px-1.5 min-w-[28px] text-center select-none">{fontSize}</span>
            <div className="w-px h-4 bg-[var(--border-color)]" />
            <button
              onClick={handleZoomIn}
              disabled={fontSize >= 32}
              className="flex items-center justify-center w-8 h-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] disabled:opacity-30 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 px-2.5 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 text-gray-500 dark:text-[var(--text-muted)] bg-white dark:bg-[var(--bg-primary)] border border-gray-200 dark:border-[var(--border-color)] flex-shrink-0 rounded-lg shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Tabs Row */}
      <div className="flex items-end justify-between px-2 md:px-3 pt-1 md:pt-1.5 border-b border-[var(--border-color)] bg-[var(--glass-bg)] h-[36px] md:h-11 overflow-hidden shrink-0 w-full">
        
        {/* Tabs */}
        <div className="flex items-center gap-0 overflow-x-auto no-scrollbar flex-1 min-w-0 h-full">

          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              onClick={() => onSwitchTab?.(index)}
              className={cn(
                'flex items-center gap-1.5 px-2 md:px-3 h-[32px] md:h-[35px] rounded-t-lg relative cursor-pointer transition-all text-[12px] md:text-[13px] font-mono max-w-[140px] md:max-w-[170px] group flex-shrink-0 border-b-2',
                index === activeTabIndex
                  ? 'bg-white dark:bg-[#1e1e1e] border-indigo-500 text-[var(--text-primary)] font-medium shadow-sm z-10'
                  : 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] border-transparent'
              )}
            >
              <img src={tab.name.endsWith('.c') || tab.name.endsWith('.h') ? '/sample-assets/placeholder.svg' : '/sample-assets/placeholder.svg'} alt="" className="w-[14px] h-[14px] flex-shrink-0" />
              <span className="truncate font-medium">{tab.name}</span>
              {tab.isDirty && (
                <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" title="Unsaved" />
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onCloseTab?.(index); }}
                className="w-4 h-4 flex items-center justify-center rounded-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 transition-all flex-shrink-0 ml-1"
                title="Close"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* New Tab Button */}
          {tabs.length < 2 && (
            <button
              onClick={onNewTab}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-all ml-1 flex-shrink-0 mb-1"
              title="New file"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Desktop Tools (Save/Indicator, Zoom In/Out, Clear) - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-1.5 mb-1.5 md:mb-[5px] ml-auto mr-3 flex-shrink-0">
          
          {/* Save Button OR Saved Indicator */}
          {isSaving ? (
            <div className="flex items-center gap-1.5 px-3 h-[28px] rounded-[6px] text-[10px] uppercase font-bold tracking-wider transition-all border shadow-sm bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving
            </div>
          ) : (isDirty || !tabs[activeTabIndex]?.savedId) ? (
            <button
              onClick={onSave}
              title="Save File"
              className="flex items-center gap-1.5 justify-center h-[28px] px-3 font-semibold text-xs tracking-wide text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-white dark:bg-[var(--bg-primary)] border border-gray-200 dark:border-[var(--border-color)] rounded-[6px] shadow-sm transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
            >
              <Save className="w-[14px] h-[14px]" />
              Save
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 h-[28px] rounded-[6px] text-[10px] uppercase font-bold tracking-wider transition-all border shadow-sm bg-green-50 border-green-200 text-green-600 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400">
              <Check className="w-3 h-3" />
              Saved
            </div>
          )}

          <div className="w-px h-4 bg-[var(--border-color)] mx-0.5" />

          {/* Zoom In / Zoom Out */}
          <div className="flex items-center bg-white dark:bg-[var(--bg-primary)] border border-gray-200 dark:border-[var(--border-color)] rounded-[6px] overflow-hidden h-[28px] flex-shrink-0 shadow-sm">
            <button
              onClick={handleZoomOut}
              disabled={fontSize <= 10}
              title="Zoom Out"
              className="flex items-center justify-center w-7 h-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] disabled:opacity-30 transition-colors"
            >
              <ZoomOut className="w-[14px] h-[14px]" />
            </button>
            <div className="w-px h-3 bg-[var(--border-color)]" />
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] px-1 min-w-[24px] text-center select-none">{fontSize}</span>
            <div className="w-px h-3 bg-[var(--border-color)]" />
            <button
              onClick={handleZoomIn}
              disabled={fontSize >= 32}
              title="Zoom In"
              className="flex items-center justify-center w-7 h-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] disabled:opacity-30 transition-colors"
            >
              <ZoomIn className="w-[14px] h-[14px]" />
            </button>
          </div>

          <div className="w-px h-4 bg-[var(--border-color)] mx-0.5" />

          {/* Clear / Delete (Rightmost) */}
          <button
            onClick={handleClear}
            title="Clear Editor"
            className="flex items-center justify-center w-[28px] h-[28px] text-gray-500 hover:text-red-600 dark:text-[var(--text-muted)] dark:hover:text-red-400 bg-white dark:bg-[var(--bg-primary)] border border-gray-200 dark:border-[var(--border-color)] rounded-[6px] shadow-sm transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <Trash2 className="w-[14px] h-[14px]" />
          </button>
        </div>

        {/* Save Status Pill (Mobile Only) — tappable to save when unsaved */}
        <div className="flex md:hidden items-center mb-1.5 ml-2 mr-0 flex-shrink-0">
          {isSaving ? (
            <div className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase font-extrabold tracking-wider transition-all duration-300 border shadow-sm',
              'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400'
            )}>
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
              Saving
            </div>
          ) : (isDirty || !tabs[activeTabIndex]?.savedId) ? (
            <button
              onClick={onSave}
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase font-extrabold tracking-wider transition-all duration-300 border shadow-sm cursor-pointer active:scale-95',
                'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20'
              )}
            >
              <Save className="w-2.5 h-2.5" />
              Save
            </button>
          ) : (
            <div className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase font-extrabold tracking-wider transition-all duration-300 border shadow-sm',
              'bg-green-50 border-green-200 text-green-600 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400'
            )}>
              <Check className="w-2.5 h-2.5" />
              Saved
            </div>
          )}
        </div>
      </div>
      
      <div className={cn("flex-1 relative w-full overflow-hidden flex flex-col pt-1 md:pt-0", theme === 'light' ? 'bg-[#f1f5f9] p-2 md:p-[12px] rounded-[14px]' : 'p-0')}>
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[var(--text-muted)]">{activeFileName?.endsWith('.c') || activeFileName?.endsWith('.h') ? 'Loading C Runtime...' : 'Loading Python Runtime...'}</span>
            </div>
          </div>
        )}
        <div className={cn(
          'h-full w-full overflow-hidden transition-all',
          theme === 'light' ? 'bg-[#ffffff] rounded-[10px] border border-[#e2e8f0] shadow-[0_4px_12px_rgba(0,0,0,0.04)]' : '',
          isLoading && 'opacity-50'
        )}>
          <Editor
            height="100%"
            defaultLanguage={activeFileName?.endsWith('.c') || activeFileName?.endsWith('.h') ? 'c' : 'python'}
            language={activeFileName?.endsWith('.c') || activeFileName?.endsWith('.h') ? 'c' : 'python'}
            value={code ?? DEFAULT_CODE}
            onChange={handleChange}
            beforeMount={handleBeforeMount}
            onMount={handleEditorMount}
            theme={theme === 'light' ? 'python-lab-light' : 'python-lab-dark'}
            options={{
              fontSize: fontSize,
              fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
              fontLigatures: true,
              minimap: { enabled: false },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              insertSpaces: true,
              wordWrap: 'on',
              padding: { top: 16, bottom: 80 },
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              cursorStyle: 'line',
              cursorWidth: 2,
              renderLineHighlight: 'all',
              glyphMargin: true,
              folding: true,
              foldingHighlight: true,
              showFoldingControls: 'mouseover',
              lineDecorationsWidth: 8,
              lineNumbersMinChars: 3,
              contextmenu: true,
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
              snippetSuggestions: 'top',
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              formatOnPaste: true,
              formatOnType: true,
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
