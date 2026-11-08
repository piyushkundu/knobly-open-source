'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Eye, Terminal, Smartphone, Tablet, Monitor, RefreshCw, ExternalLink,
  Trash2, Sparkles, AlertCircle, AlertTriangle, Info, ChevronRight,
  Maximize2, Minimize2
} from 'lucide-react';
import { ConsoleMessage, DeviceMode } from '@/types/web-compiler';
import { MAX_PREVIEW_TEXT_LENGTH, PREVIEW_SANDBOX, openSandboxedPreview, readPreviewConsoleEvent } from '@/lib/preview-sandbox';

interface WebPreviewConsoleProps {
  bundledHtml: string;
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  onAskAIWithErrors?: (errorText: string) => void;
  onRefresh?: () => void;
}

export function WebPreviewConsole({
  bundledHtml,
  deviceMode,
  onDeviceModeChange,
  onAskAIWithErrors,
  onRefresh,
}: WebPreviewConsoleProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'console'>('preview');
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [filterLevel, setFilterLevel] = useState<'all' | 'error' | 'warn' | 'log'>('all');
  const [replInput, setReplInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  // Listen to postMessage from sandboxed iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = readPreviewConsoleEvent(event, iframeRef.current?.contentWindow ?? null);
      if (!message) return;
      setConsoleMessages((prev) => [...prev.slice(-149), {
        ...message,
        id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      }]);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Auto-scroll console
  useEffect(() => {
    if (activeTab === 'console') {
      consoleBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleMessages, activeTab]);

  const handleClearConsole = () => {
    setConsoleMessages([]);
  };

  const handleReloadIframe = () => {
    setIframeKey((k) => k + 1);
    onRefresh?.();
  };

  const handleOpenExternal = () => {
    openSandboxedPreview(bundledHtml);
  };

  const handleReplSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replInput.trim()) return;

    // Log user command
    const cmd = replInput.trim();
    setConsoleMessages((prev) => [
      ...prev.slice(-149),
      {
        id: Date.now().toString(),
        level: 'info',
        message: `> ${cmd}`,
        time: new Date().toLocaleTimeString(),
      },
    ]);

    // Send to iframe for eval
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Opaque sandbox origins require '*'; send only to this frame's window.
      iframeRef.current.contentWindow.postMessage(
        { type: 'KNOBLY_EVAL_CMD', code: cmd },
        '*'
      );
    }
    setReplInput('');
  };

  const errorCount = consoleMessages.filter((m) => m.level === 'error').length;
  const warnCount = consoleMessages.filter((m) => m.level === 'warn').length;

  const filteredMessages = consoleMessages.filter((m) => {
    if (filterLevel === 'all') return true;
    if (filterLevel === 'error') return m.level === 'error';
    if (filterLevel === 'warn') return m.level === 'warn';
    if (filterLevel === 'log') return m.level === 'log' || m.level === 'info';
    return true;
  });

  const getContainerWidth = () => {
    if (deviceMode === 'mobile') return 'max-w-[375px]';
    if (deviceMode === 'tablet') return 'max-w-[768px]';
    return 'w-full';
  };

  return (
    <div
      className={`flex flex-col h-full w-full bg-[var(--card-bg)] select-none ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[var(--bg-primary)]' : ''
      }`}
    >
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] gap-2">
        {/* Switch between Live Preview & Console Tabs */}
        <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] p-0.5 rounded-lg border border-[var(--border-color)]">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Eye size={13} />
            <span>Live Preview</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all relative ${
              activeTab === 'console'
                ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Terminal size={13} />
            <span>Console</span>
            {errorCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-mono leading-tight">
                {errorCount}
              </span>
            )}
          </button>
        </div>

        {/* Viewport switchers & Utilities */}
        <div className="flex items-center gap-1.5">
          {/* Viewport Modes */}
          <div className="flex items-center bg-[var(--bg-tertiary)] rounded-lg p-0.5 border border-[var(--border-color)]">
            <button
              onClick={() => onDeviceModeChange('desktop')}
              title="Desktop View (100%)"
              className={`p-1.5 rounded-md transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-[var(--card-bg)] text-[var(--accent-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Monitor size={13} />
            </button>
            <button
              onClick={() => onDeviceModeChange('tablet')}
              title="Tablet View (768px)"
              className={`p-1.5 rounded-md transition-all ${
                deviceMode === 'tablet'
                  ? 'bg-[var(--card-bg)] text-[var(--accent-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Tablet size={13} />
            </button>
            <button
              onClick={() => onDeviceModeChange('mobile')}
              title="Mobile View (375px)"
              className={`p-1.5 rounded-md transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-[var(--card-bg)] text-[var(--accent-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Smartphone size={13} />
            </button>
          </div>

          {/* Reload Preview Button */}
          <button
            onClick={handleReloadIframe}
            title="Reload Preview"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] border border-[var(--border-color)] transition-colors"
          >
            <RefreshCw size={13} />
          </button>

          {/* External Window Open */}
          <button
            onClick={handleOpenExternal}
            title="Open Preview in New Tab"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] border border-[var(--border-color)] transition-colors"
          >
            <ExternalLink size={13} />
          </button>

          {/* Maximize Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] border border-[var(--border-color)] transition-colors"
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Main Content: Preview or Console */}
      <div className="flex-1 w-full min-h-0 relative overflow-hidden bg-[var(--bg-primary)]">
          <div className={`w-full h-full ${activeTab === 'preview' ? 'flex' : 'hidden'} flex-col items-center justify-start p-2 sm:p-4 overflow-auto`}>
            {/* Simulated Browser Frame for Mobile / Tablet */}
            <div
              className={`w-full ${getContainerWidth()} h-full transition-all duration-300 flex flex-col rounded-xl overflow-hidden shadow-2xl border border-[var(--border-color)] bg-white`}
            >
              {/* Browser Address Bar Header */}
              <div className="px-3 py-1.5 bg-[#f1f5f9] border-b border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 max-w-[280px] mx-2 px-2 py-0.5 rounded-md bg-white border border-gray-300 text-center truncate font-mono text-[10px] text-gray-600">
                  https://knobly.local/index.html
                </div>
                <span className="font-mono text-[10px] uppercase font-semibold text-gray-400">
                  {deviceMode}
                </span>
              </div>

              {/* Iframe */}
              <iframe
                key={iframeKey}
                ref={iframeRef}
                srcDoc={bundledHtml}
                title="Knobly Web Output"
                sandbox={PREVIEW_SANDBOX}
                referrerPolicy="no-referrer"
                className="w-full flex-1 bg-white border-0"
              />
            </div>
          </div>
          {/* Keep the preview mounted while the console sends REPL commands. */}
          <div className={`${activeTab === 'console' ? 'flex' : 'hidden'} flex-col h-full w-full bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono text-xs`}>
            {/* Console Toolbar */}
            <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
                  Filter:
                </span>
                <div className="flex items-center gap-1 text-[11px]">
                  {[
                    { id: 'all' as const, label: 'All' },
                    { id: 'error' as const, label: `Errors (${errorCount})` },
                    { id: 'warn' as const, label: `Warnings (${warnCount})` },
                    { id: 'log' as const, label: 'Logs' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilterLevel(f.id)}
                      className={`px-2 py-0.5 rounded-md transition-colors ${
                        filterLevel === f.id
                          ? 'bg-[var(--accent-primary)] text-white font-bold'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--glass-bg)]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {errorCount > 0 && onAskAIWithErrors && (
                  <button
                    onClick={() => {
                      const errors = consoleMessages
                        .filter((m) => m.level === 'error')
                        .map((m) => m.message)
                        .join('\n');
                      onAskAIWithErrors(errors);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition-all"
                  >
                    <Sparkles size={12} />
                    <span>Explain Errors with AI</span>
                  </button>
                )}

                <button
                  onClick={handleClearConsole}
                  title="Clear Console"
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--glass-bg)] transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Console Messages List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 font-mono">
              {filteredMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] text-center p-6">
                  <Terminal size={32} className="opacity-30 mb-2" />
                  <p className="text-xs font-semibold">Console is clean</p>
                  <p className="text-[11px] opacity-70 mt-1 max-w-xs">
                    Logs, warnings, and runtime JavaScript errors from your web page will appear here.
                  </p>
                </div>
              ) : (
                filteredMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2 p-1.5 rounded-lg border text-xs leading-relaxed ${
                      m.level === 'error'
                        ? 'bg-red-500/10 border-red-500/30 text-red-300'
                        : m.level === 'warn'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : m.level === 'info'
                        ? 'bg-blue-500/10 border-blue-500/30 text-sky-300'
                        : 'bg-transparent border-transparent text-[var(--text-primary)]'
                    }`}
                  >
                    <span className="shrink-0 mt-0.5">
                      {m.level === 'error' && <AlertCircle size={13} className="text-red-400" />}
                      {m.level === 'warn' && <AlertTriangle size={13} className="text-amber-400" />}
                      {m.level === 'info' && <Info size={13} className="text-sky-400" />}
                      {m.level === 'log' && <ChevronRight size={13} className="text-gray-400" />}
                    </span>
                    <span className="flex-1 break-words whitespace-pre-wrap">{m.message}</span>
                    <span className="shrink-0 text-[10px] text-[var(--text-muted)]">
                      {m.time}
                    </span>
                  </div>
                ))
              )}
              <div ref={consoleBottomRef} />
            </div>

            {/* Interactive JS Command Line Input */}
            <form
              onSubmit={handleReplSubmit}
              className="flex items-center gap-2 p-2 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]"
            >
              <span className="text-xs text-[var(--accent-primary)] font-bold pl-1">&gt;</span>
              <input
                type="text"
                value={replInput}
                maxLength={MAX_PREVIEW_TEXT_LENGTH}
                onChange={(e) => setReplInput(e.target.value)}
                placeholder="Execute JavaScript in page context (e.g. document.title, 5 * 25)..."
                className="flex-1 bg-transparent text-xs text-[var(--text-primary)] focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={!replInput.trim()}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--accent-primary)] text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                Run
              </button>
            </form>
          </div>
      </div>
    </div>
  );
}
