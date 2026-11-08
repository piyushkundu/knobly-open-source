'use client';

import { useState } from 'react';
import { aiClientError } from '@/lib/ai-limits';
import {
  Sparkles, X, Wand2, Lightbulb, Wrench, Check, Copy,
  ArrowRight, Loader2, MessageSquare
} from 'lucide-react';
import { Language, WebAIExplanation } from '@/types/web-compiler';

interface WebAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGeneratedCode: (code: string) => void;
  currentCode: string;
  initialErrorText?: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const QUICK_PROMPTS = [
  'Modern Glassmorphism Pricing Cards (3 Tiers)',
  'Responsive Navbar with Hamburger Menu & Dark Toggle',
  'Interactive Quiz with Score Counter & Next Button',
  'Animated Login & Signup Form with Floating Labels',
  'Student Marksheet Table with Grade Calculator',
  'Interactive Canvas Particle Animation',
];

export function WebAIAssistant({
  isOpen,
  onClose,
  onApplyGeneratedCode,
  currentCode,
  initialErrorText = '',
  language,
  onLanguageChange,
}: WebAIAssistantProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'explain' | 'fix'>(
    initialErrorText ? 'fix' : 'generate'
  );
  const [prompt, setPrompt] = useState('');
  const [fixQuestion, setFixQuestion] = useState(initialErrorText);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState('');
  const [explanationResult, setExplanationResult] = useState<WebAIExplanation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (targetPrompt?: string) => {
    const textToRun = targetPrompt || prompt;
    if (!textToRun.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setGeneratedResult('');

    try {
      const res = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToRun,
          language,
          mode: 'web',
        }),
      });

      if (!res.ok) {
        throw await aiClientError(res, 'Failed to generate web code');
      }

      const data = await res.json();
      setGeneratedResult(data.code || '');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error generating code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!currentCode.trim()) {
      setErrorMsg('Editor has no code to explain.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setExplanationResult(null);

    try {
      const res = await fetch('/api/ai-explain-web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentCode,
          language,
          question: 'Explain this code and its structure in detail.',
        }),
      });

      if (!res.ok) {
        throw await aiClientError(res, 'Failed to explain code');
      }

      const data = await res.json();
      setExplanationResult(data);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error analyzing code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFix = async () => {
    if (!currentCode.trim()) {
      setErrorMsg('Editor has no code to debug.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setExplanationResult(null);

    try {
      const res = await fetch('/api/ai-explain-web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentCode,
          language,
          question: fixQuestion || 'Find and fix all errors or broken tags in this code.',
        }),
      });

      if (!res.ok) {
        throw await aiClientError(res, 'Failed to debug code');
      }

      const data = await res.json();
      setExplanationResult(data);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error debugging code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = (code: string) => {
    onApplyGeneratedCode(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Knobly AI Web Assistant
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Generate, explain, and debug HTML, CSS & JavaScript
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector: EN / HI */}
            <div className="flex items-center bg-[var(--bg-tertiary)] p-0.5 rounded-lg border border-[var(--border-color)]">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                  language === 'en'
                    ? 'bg-[var(--action-bg)] text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                  language === 'hi'
                    ? 'bg-[var(--action-bg)] text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                हिंदी
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 px-6 pt-3 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] gap-2">
          {[
            { id: 'generate' as const, label: 'Generate', icon: Wand2 },
            { id: 'explain' as const, label: 'Explain Code', icon: Lightbulb },
            { id: 'fix' as const, label: 'Debug & Fix', icon: Wrench },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                  setErrorMsg(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
                  isActive
                    ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--card-bg)] shadow-sm'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]'
                }`}
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: GENERATE */}
          {activeTab === 'generate' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Describe what you want to build:
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Build an animated digital clock with modern neon background and gradient text..."
                    className="w-full p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
                  />
                  <button
                    onClick={() => handleGenerate()}
                    disabled={isLoading || !prompt.trim()}
                    className="absolute right-2.5 bottom-3 px-4 py-1.5 rounded-xl text-xs font-bold bg-[var(--action-bg)] text-white hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                  >
                    {isLoading ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Sparkles size={13} />
                    )}
                    <span>Generate</span>
                  </button>
                </div>
              </div>

              {/* Quick Inspiration Chips */}
              <div>
                <span className="text-[11px] font-semibold text-[var(--text-muted)] block mb-2">
                  ✨ Quick Ideas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setPrompt(q);
                        handleGenerate(q);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Result Preview */}
              {generatedResult && (
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Check size={14} /> Code Generated Successfully!
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(generatedResult)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--glass-bg)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check size={12} className="text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleApply(generatedResult)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:opacity-90 shadow-sm transition-opacity"
                      >
                        <span>Apply to Editor</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>

                  <pre className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-primary)] overflow-x-auto max-h-56 leading-relaxed">
                    {generatedResult}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXPLAIN */}
          {activeTab === 'explain' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">
                    Analyze Current Code
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Get an instant breakdown of elements, styles, and logic in {language === 'hi' ? 'Hindi' : 'English'}.
                  </p>
                </div>
                <button
                  onClick={handleExplain}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--action-bg)] text-white hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {isLoading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Lightbulb size={13} />
                  )}
                  <span>Explain Now</span>
                </button>
              </div>

              {explanationResult && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2">
                    <h5 className="text-xs font-bold text-[var(--accent-primary)] flex items-center gap-1.5">
                      <MessageSquare size={14} /> Detailed Explanation
                    </h5>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                      {explanationResult.explanation}
                    </p>
                  </div>

                  {explanationResult.how_to_fix && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                      <strong className="block mb-1">💡 Best Practices & Tips:</strong>
                      <p>{explanationResult.how_to_fix}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FIX & DEBUG */}
          {activeTab === 'fix' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Describe the error or paste console error:
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={fixQuestion}
                    onChange={(e) => setFixQuestion(e.target.value)}
                    placeholder="e.g. My button click does not do anything, or check for unclosed div tags..."
                    className="w-full p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
                  />
                  <button
                    onClick={handleFix}
                    disabled={isLoading}
                    className="absolute right-2.5 bottom-3 px-4 py-1.5 rounded-xl text-xs font-bold bg-purple-600 text-white hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-1.5"
                  >
                    {isLoading ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Wrench size={13} />
                    )}
                    <span>Analyze & Fix</span>
                  </button>
                </div>
              </div>

              {explanationResult && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2">
                    <h5 className="text-xs font-bold text-red-400">Diagnosis:</h5>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {explanationResult.explanation}
                    </p>
                    <p className="text-xs text-emerald-400 font-semibold pt-1">
                      {explanationResult.how_to_fix}
                    </p>
                  </div>

                  {explanationResult.corrected_code && (
                    <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <Check size={14} /> Corrected Code Ready
                        </span>
                        <button
                          onClick={() => handleApply(explanationResult.corrected_code)}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:opacity-90"
                        >
                          Apply Fix to Editor
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-primary)] overflow-x-auto max-h-56">
                        {explanationResult.corrected_code}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
