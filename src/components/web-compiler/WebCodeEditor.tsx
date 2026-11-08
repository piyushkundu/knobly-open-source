'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import Editor, { OnMount, OnChange, BeforeMount } from '@/lib/community-editor';
import type { editor } from 'monaco-editor';
import {
  ZoomIn, ZoomOut, Sparkles, Plus, X, FileCode, Check,
  Play, RotateCcw, Copy, AlignLeft, Layers
} from 'lucide-react';
import { WebEditorTab } from '@/types/web-compiler';

interface WebCodeEditorProps {
  tabs: WebEditorTab[];
  activeTabIndex: number;
  onSwitchTab: (index: number) => void;
  onNewTab: (name: string, language: 'html' | 'css' | 'javascript') => void;
  onCloseTab: (index: number) => void;
  onChange: (value: string) => void;
  theme?: 'dark' | 'light';
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onFormat: () => void;
  onRun?: () => void;
  isRunning?: boolean;
}

const QUICK_KEYS = ['<', '>', '/', '"', '=', ' ', '{', '}', '(', ')', ';', ':', '!', '#', '.'];

export function WebCodeEditor({
  tabs,
  activeTabIndex,
  onSwitchTab,
  onNewTab,
  onCloseTab,
  onChange,
  theme = 'dark',
  fontSize,
  onFontSizeChange,
  onFormat,
  onRun,
  isRunning,
}: WebCodeEditorProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showNewTabModal, setShowNewTabModal] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const [newTabLang, setNewTabLang] = useState<'html' | 'css' | 'javascript'>('html');
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

  const activeTab = tabs[activeTabIndex] || tabs[0] || {
    id: 'html',
    name: 'index.html',
    language: 'html',
    code: '',
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBeforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme('web-lab-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'tag', foreground: 'f97316', fontStyle: 'bold' },
        { token: 'tag.id', foreground: 'fbbf24', fontStyle: 'bold' },
        { token: 'tag.class', foreground: '38bdf8' },
        { token: 'metatag', foreground: 'f43f5e', fontStyle: 'bold' },
        { token: 'metatag.content.html', foreground: '34d399' },
        { token: 'attribute.name', foreground: '06b6d4' },
        { token: 'attribute.value', foreground: '34d399' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'function', foreground: '38bdf8' },
        { token: 'variable', foreground: 'f8fafc' },
        { token: 'delimiter', foreground: '94a3b8' },
        { token: 'delimiter.html', foreground: 'f97316' },
      ],
      colors: {
        'editor.background': '#12131c',
        'editor.foreground': '#f8fafc',
        'editor.lineHighlightBackground': '#181926',
        'editor.selectionBackground': '#f9731640',
        'editorCursor.foreground': '#f97316',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#cbd5e1',
        'editor.inactiveSelectionBackground': '#f9731620',
        'editorBracketMatch.background': '#f9731630',
        'editorBracketMatch.border': '#f97316',
        'editorIndentGuide.background': '#1e2238',
        'editorIndentGuide.activeBackground': '#333857',
      },
    });

    monaco.editor.defineTheme('web-lab-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' },
        { token: 'tag', foreground: 'ea580c', fontStyle: 'bold' },
        { token: 'tag.id', foreground: 'd97706', fontStyle: 'bold' },
        { token: 'tag.class', foreground: '0284c7' },
        { token: 'attribute.name', foreground: '0284c7' },
        { token: 'attribute.value', foreground: '16a34a' },
        { token: 'string', foreground: '16a34a' },
        { token: 'number', foreground: 'ea580c' },
        { token: 'keyword', foreground: '7c3aed', fontStyle: 'bold' },
        { token: 'function', foreground: '2563eb' },
        { token: 'variable', foreground: '111827' },
        { token: 'delimiter', foreground: '64748b' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#0f172a',
        'editor.lineHighlightBackground': '#f8fafc',
        'editor.selectionBackground': '#ffedd5',
        'editorCursor.foreground': '#ea580c',
        'editorLineNumber.foreground': '#94a3b8',
        'editorLineNumber.activeForeground': '#0f172a',
        'editorIndentGuide.background': '#f1f5f9',
        'editorIndentGuide.activeBackground': '#e2e8f0',
      },
    });
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // F5 or Ctrl+Enter to Run
    editor.addCommand(monaco.KeyCode.F5, () => {
      onRun?.();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun?.();
    });

    // Alt+Shift+F to Format
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      onFormat();
    });
  };

  const handleEditorChange: OnChange = (value) => {
    onChange(value || '');
  };

  const handleZoom = (delta: number) => {
    const newSize = Math.min(28, Math.max(11, fontSize + delta));
    onFontSizeChange(newSize);
  };

  const insertQuickKey = (char: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    const position = editor.getPosition();
    if (!position) return;
    editor.executeEdits('quick-key', [
      {
        range: new monacoRef.current!.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        text: char,
      },
    ]);
    editor.focus();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateNewTab = () => {
    if (!newTabName.trim()) return;
    let name = newTabName.trim();
    const ext = newTabLang === 'html' ? '.html' : newTabLang === 'css' ? '.css' : '.js';
    if (!name.endsWith(ext)) name += ext;
    onNewTab(name, newTabLang);
    setNewTabName('');
    setShowNewTabModal(false);
  };

  const getTabIcon = (lang: string) => {
    if (lang === 'html') return '🌐';
    if (lang === 'css') return '🎨';
    if (lang === 'javascript') return '⚡';
    return '📄';
  };

  return (
    <div className="flex flex-col h-full w-full bg-[var(--card-bg)] select-none">
      {/* Tab Strip Toolbar */}
      <div className="flex items-center justify-between px-2 pt-2 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] overflow-x-auto gap-2">
        {/* Tabs */}
        <div className="flex items-center gap-1 min-w-0">
          {tabs.map((tab, idx) => {
            const isActive = idx === activeTabIndex;
            return (
              <div
                key={tab.id}
                onClick={() => onSwitchTab(idx)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-semibold font-mono cursor-pointer transition-all border-t-2 ${
                  isActive
                    ? 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--accent-primary)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] border-transparent'
                }`}
              >
                <span className="text-[13px]">{getTabIcon(tab.language)}</span>
                <span className="truncate max-w-[100px] sm:max-w-[130px]">{tab.name}</span>
                {tab.isDirty && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                )}
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(idx);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-500/20 rounded transition-opacity"
                    title="Close tab"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            );
          })}

          {/* New Tab Button */}
          <button
            onClick={() => setShowNewTabModal(true)}
            title="Create new file tab"
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] rounded-md transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Action Buttons: Format, Zoom, Copy */}
        <div className="flex items-center gap-1 shrink-0 pb-1">
          {/* Format Button */}
          <button
            onClick={onFormat}
            title="Format Code (Alt+Shift+F)"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] border border-[var(--border-color)] transition-colors"
          >
            <AlignLeft size={12} />
            <span className="hidden sm:inline">Format</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy current code"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] border border-[var(--border-color)] transition-colors"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-500" />
                <span className="hidden sm:inline text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          {/* Font Zoom Controls */}
          <div className="hidden sm:flex items-center bg-[var(--bg-tertiary)] rounded-md border border-[var(--border-color)]">
            <button
              onClick={() => handleZoom(-1)}
              title="Decrease Font Size"
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ZoomOut size={12} />
            </button>
            <span className="text-[10px] text-[var(--text-muted)] font-mono px-1">
              {fontSize}px
            </span>
            <button
              onClick={() => handleZoom(1)}
              title="Increase Font Size"
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ZoomIn size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 w-full min-h-0 relative">
        <Editor
          height="100%"
          language={activeTab.language}
          value={activeTab.code}
          theme={theme === 'light' ? 'web-lab-light' : 'web-lab-dark'}
          onChange={handleEditorChange}
          beforeMount={handleBeforeMount}
          onMount={handleEditorMount}
          options={{
            fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            minimap: { enabled: !isMobile },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            padding: { top: 12, bottom: 12 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            formatOnPaste: true,
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
          }}
        />
      </div>

      {/* Mobile Quick Keys Toolbar */}
      <div className="flex md:hidden gap-1 px-2 py-1.5 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] overflow-x-auto shrink-0">
        {QUICK_KEYS.map((k) => (
          <button
            key={k}
            onClick={() => insertQuickKey(k)}
            className="w-7 h-7 shrink-0 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-xs flex items-center justify-center active:scale-90 transition-transform"
          >
            {k === ' ' ? '␣' : k}
          </button>
        ))}
      </div>

      {/* New Tab Modal */}
      {showNewTabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                <FileCode size={16} className="text-[var(--accent-primary)]" />
                Add New File Tab
              </h3>
              <button
                onClick={() => setShowNewTabModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  File Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. style, app, index2"
                  value={newTabName}
                  onChange={(e) => setNewTabName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--accent-primary)] font-mono"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Language Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'html' as const, label: 'HTML', icon: '🌐' },
                    { id: 'css' as const, label: 'CSS', icon: '🎨' },
                    { id: 'javascript' as const, label: 'JavaScript', icon: '⚡' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setNewTabLang(l.id)}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                        newTabLang === l.id
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                          : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--glass-bg)]'
                      }`}
                    >
                      <span className="text-base">{l.icon}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTabModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--glass-bg)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewTab}
                  disabled={!newTabName.trim()}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[var(--accent-primary)] text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  Add Tab
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
