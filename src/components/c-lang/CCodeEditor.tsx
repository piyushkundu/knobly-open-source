'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import Editor, { OnMount, OnChange, BeforeMount } from '@/lib/community-editor';
import type { editor } from 'monaco-editor';
import { cn } from '@/lib/c-utils';
import { Trash2, RotateCcw, Play, Sun, Moon, History, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../python/ui/Button';

interface CCodeEditorProps {
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
}

const DEFAULT_CODE = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`;

export function CCodeEditor({ 
  code, 
  onChange, 
  errorLine, 
  isLoading, 
  theme = 'light',
  onThemeToggle,
  onShowHistory,
  onRun,
  isRunning,
  isReady,
  onAskAI
}: CCodeEditorProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [fontSize, setFontSize] = useState(15);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);
  const decorationsRef = useRef<string[]>([]);

  useEffect(() => {
    const savedSize = localStorage.getItem('c-editor-font-size');
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
    monaco.editor.defineTheme('c-lab-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: 'f472b6', fontStyle: 'bold' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'function', foreground: '22d3ee' },
        { token: 'variable', foreground: 'f8fafc' },
        { token: 'operator', foreground: 'f472b6' },
        { token: 'delimiter', foreground: '94a3b8' },
        { token: 'type', foreground: 'a78bfa' },
        { token: 'type.identifier', foreground: '4ade80' },
      ],
      colors: {
        'editor.background': '#16161e',
        'editor.foreground': '#f8fafc',
        'editor.lineHighlightBackground': '#1e1e2e',
        'editor.selectionBackground': '#818cf850',
        'editorCursor.foreground': '#22c55e',
        'editorLineNumber.foreground': '#4b5563',
        'editorLineNumber.activeForeground': '#9ca3af',
        'editor.inactiveSelectionBackground': '#818cf830',
        'editorIndentGuide.background': '#28283d',
        'editorIndentGuide.activeBackground': '#3a3a5a',
      },
    });

    monaco.editor.defineTheme('c-lab-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' },
        { token: 'keyword', foreground: '7c3aed', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: '7c3aed', fontStyle: 'bold' },
        { token: 'string', foreground: '16a34a' },
        { token: 'number', foreground: 'ea580c' },
        { token: 'function', foreground: '2563eb' },
        { token: 'variable', foreground: '111827' },
        { token: 'operator', foreground: '7c3aed' },
        { token: 'delimiter', foreground: '475569' },
        { token: 'type', foreground: '7c3aed' },
        { token: 'type.identifier', foreground: '16a34a' },
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
        'editorIndentGuide.background': '#e2e8f0',
        'editorIndentGuide.activeBackground': '#cbd5e1',
      },
    });
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.addCommand(monaco.KeyCode.F5, () => {
      const runButton = document.querySelector('[data-c-run-button]') as HTMLButtonElement;
      if (runButton) runButton.click();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL, () => {
      const clearButton = document.querySelector('[data-c-clear-button]') as HTMLButtonElement;
      if (clearButton) clearButton.click();
    });

    const savedCode = localStorage.getItem('c-code');
    if (savedCode && !code) {
      onChange(savedCode);
    }
    
    editor.focus();
  };

  const handleChange: OnChange = useCallback((value) => {
    const newValue = value || '';
    onChange(newValue);
    localStorage.setItem('c-code', newValue);
  }, [onChange]);

  const handleClear = useCallback(() => {
    onChange('');
    localStorage.setItem('c-code', '');
    if (editorRef.current) {
      editorRef.current.setValue('');
      editorRef.current.focus();
    }
  }, [onChange]);

  const handleReset = useCallback(() => {
    onChange(DEFAULT_CODE);
    localStorage.setItem('c-code', DEFAULT_CODE);
    if (editorRef.current) {
      editorRef.current.setValue(DEFAULT_CODE);
      editorRef.current.focus();
    }
  }, [onChange]);

  const handleZoomIn = useCallback(() => {
    setFontSize(prev => {
      const next = Math.min(prev + 2, 32);
      localStorage.setItem('c-editor-font-size', String(next));
      if (editorRef.current) editorRef.current.updateOptions({ fontSize: next });
      return next;
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setFontSize(prev => {
      const next = Math.max(prev - 2, 10);
      localStorage.setItem('c-editor-font-size', String(next));
      if (editorRef.current) editorRef.current.updateOptions({ fontSize: next });
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
          [{
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
          }]
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
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-color)] bg-[var(--glass-bg)] h-11">
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)]">C</span>
            <span className="text-xs text-[var(--text-secondary)]">•</span>
            <span className="text-xs text-[var(--text-secondary)]">F5 to run</span>
          </div>
          
          <div className="flex md:hidden items-center gap-2">
            {onRun && (
              <Button
                variant="primary"
                size="sm"
                onClick={onRun}
                disabled={!isReady || isRunning}
                className={cn(
                  "px-3 h-7 shadow-sm",
                  isReady && !isRunning && 'animate-pulse-glow'
                )}
              >
                {isRunning ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    <span className="text-xs">Run</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isMobile && onThemeToggle && (
            <Button variant="ghost" size="sm" onClick={onThemeToggle}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="h-7 px-2">
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </Button>
          )}
          {isMobile && onShowHistory && (
            <Button variant="ghost" size="sm" onClick={onShowHistory} title="Show History" className="h-7 px-2">
              <History className="w-3.5 h-3.5" />
            </Button>
          )}

          <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg overflow-hidden h-7">
            <button onClick={handleZoomOut} disabled={fontSize <= 10} title="Zoom Out"
              className="flex items-center justify-center w-7 h-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-[var(--border-color)]" />
            <span className="text-[10px] font-mono font-medium text-[var(--text-muted)] px-1.5 min-w-[28px] text-center select-none">{fontSize}</span>
            <div className="w-px h-4 bg-[var(--border-color)]" />
            <button onClick={handleZoomIn} disabled={fontSize >= 32} title="Zoom In"
              className="flex items-center justify-center w-7 h-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <Button variant="ghost" size="sm" onClick={handleClear} title="Clear code (Ctrl+L)"
            className="h-7 px-2" data-c-clear-button>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      
      <div className={`flex-1 relative ${theme === 'light' ? 'bg-[#f1f5f9] p-[12px] rounded-[14px]' : ''}`}>
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[var(--text-muted)]">Loading C Runtime...</span>
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
            defaultLanguage="c"
            value={code ?? DEFAULT_CODE}
            onChange={handleChange}
            beforeMount={handleBeforeMount}
            onMount={handleEditorMount}
            theme={theme === 'light' ? 'c-lab-light' : 'c-lab-dark'}
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
              padding: { top: 16, bottom: 16 },
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
