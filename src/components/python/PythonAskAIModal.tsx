'use client';

import { useState } from 'react';
import { Sparkles, X, Loader2, Code2, HelpCircle, BookOpen, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AI_LIMITS } from '@/lib/ai-limits';

type AIModeType = 'code' | 'question' | 'explain';
type LangType = 'en' | 'hi';
type ProgLangType = 'python' | 'c';

interface PythonAskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => Promise<void>;
  language?: LangType;
}

const MODES: { id: AIModeType; icon: typeof Code2; label_en: string; label_hi: string; desc_en: string; desc_hi: string; gradient: string }[] = [
  { id: 'code', icon: Code2, label_en: 'Write Code', label_hi: 'Code लिखवाओ', desc_en: 'AI will generate runnable code', desc_hi: 'AI executable code बनाएगा', gradient: 'from-blue-500 to-indigo-600' },
  { id: 'question', icon: HelpCircle, label_en: 'Practice Questions', label_hi: 'Practice Questions', desc_en: 'Get programming questions on any topic', desc_hi: 'किसी भी topic पर programming questions', gradient: 'from-amber-500 to-orange-600' },
  { id: 'explain', icon: BookOpen, label_en: 'Explain Topic', label_hi: 'Topic समझाओ', desc_en: 'Understand any programming concept', desc_hi: 'कोई भी programming concept समझो', gradient: 'from-emerald-500 to-teal-600' },
];

export function PythonAskAIModal({ isOpen, onClose, onGenerate, language = 'en' }: PythonAskAIModalProps) {
  const [activeMode, setActiveMode] = useState<AIModeType>('code');
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiLang, setAiLang] = useState<LangType>(language);
  const [progLang, setProgLang] = useState<ProgLangType>('python');
  const router = useRouter();

  const isHindi = aiLang === 'hi';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    setError('');

    // For 'explain' mode → navigate to topic explainer
    if (activeMode === 'explain') {
      if (prompt.trim().length > AI_LIMITS.topic) {
        setError(`Topic is too long (maximum ${AI_LIMITS.topic} characters).`);
        return;
      }
      const slug = encodeURIComponent(prompt.trim());
      const lang = aiLang;
      onClose();
      router.push(`/ai/topic/${slug}?lang=${lang}`);
      return;
    }

    setIsGenerating(true);
    try {
      let finalPrompt = prompt;

      if (activeMode === 'question') {
        finalPrompt = progLang === 'python'
          ? (isHindi
              ? `"${prompt}" topic par 5 Python programming practice questions do. Har question ke saath expected output bhi batao. Sirf questions aur expected output likho, solution mat do. Questions easy se hard order mein ho. Comments Hindi mein likho. IMPORTANT: Questions ko sirf serial number se likho jaise "# Q1:", "# Q2:", "# Q3:" etc. "Pehla sawal", "Doosra sawal" jaisa mat likho.`
              : `Give 5 Python programming practice questions on the topic "${prompt}". Include expected output for each. Only write questions and expected output, no solutions. Order them from easy to hard. Write as Python comments. Use serial numbers like "# Q1:", "# Q2:", "# Q3:" etc.`)
          : (isHindi
              ? `"${prompt}" topic par 5 C language programming practice questions do. Har question ke saath expected output bhi batao. Sirf questions aur expected output likho, solution mat do. Questions easy se hard order mein ho. Comments Hindi mein likho. IMPORTANT: Questions ko sirf serial number se likho jaise "// Q1:", "// Q2:", "// Q3:" etc. "Pehla sawal", "Doosra sawal" jaisa mat likho.`
              : `Give 5 C language programming practice questions on the topic "${prompt}". Include expected output for each. Only write questions and expected output, no solutions. Order them from easy to hard. Write as C comments. Use serial numbers like "// Q1:", "// Q2:", "// Q3:" etc.`);
      }

      if (activeMode === 'code') {
        if (progLang === 'c') {
          finalPrompt = isHindi
            ? `Ye C language mein likho: ${prompt}`
            : `Write this in C language: ${prompt}`;
        }
      }

      if (finalPrompt.length > AI_LIMITS.prompt) {
        setError(`Prompt is too long (maximum ${AI_LIMITS.prompt} characters, including question instructions).`);
        return;
      }
      await onGenerate(finalPrompt);
      setPrompt('');
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'AI service is temporarily unavailable. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentMode = MODES.find(m => m.id === activeMode)!;

  const getPlaceholder = () => {
    if (activeMode === 'code') {
      return isHindi
        ? (progLang === 'python' ? 'जैसे: "Fibonacci series print करो"' : 'जैसे: "Array sort करने का program"')
        : (progLang === 'python' ? 'e.g., "Print Fibonacci series"' : 'e.g., "Sort an array program"');
    }
    if (activeMode === 'question') {
      return isHindi
        ? (progLang === 'python' ? 'जैसे: "Loops", "Dictionary", "OOP"' : 'जैसे: "Pointers", "Arrays", "Structures"')
        : (progLang === 'python' ? 'e.g., "Loops", "Dictionary", "OOP"' : 'e.g., "Pointers", "Arrays", "Structures"');
    }
    return isHindi
      ? 'जैसे: "Recursion kya hai?", "OOP concepts"'
      : 'e.g., "What is Recursion?", "OOP concepts"';
  };

  const getButtonLabel = () => {
    if (isGenerating) return isHindi ? 'बन रहा है...' : 'Generating...';
    if (activeMode === 'code') return isHindi ? 'Code बनाओ' : 'Generate Code';
    if (activeMode === 'question') return isHindi ? 'Questions बनाओ' : 'Get Questions';
    return isHindi ? 'Explain करो' : 'Explain Topic';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-gradient-to-r ${currentMode.gradient}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <currentMode.icon className="w-4.5 h-4.5" style={{ color: '#ffffff' }} />
                </div>
                <div>
                  <h2 className="text-base font-bold leading-tight" style={{ color: '#ffffff' }}>
                    {isHindi ? currentMode.label_hi : currentMode.label_en}
                  </h2>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    {isHindi ? currentMode.desc_hi : currentMode.desc_en}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                style={{ color: 'rgba(255,255,255,0.9)' }}
                aria-label="Close"
              >
                <X className="w-5 h-5" style={{ color: '#ffffff' }} />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex gap-1.5 px-5 pt-4 pb-2">
              {MODES.map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setActiveMode(mode.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all border
                    ${activeMode === mode.id
                      ? `bg-gradient-to-br ${mode.gradient} border-transparent shadow-md scale-[1.02]`
                      : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  style={activeMode === mode.id ? { color: '#ffffff' } : undefined}
                >
                  <mode.icon className="w-3.5 h-3.5" style={activeMode === mode.id ? { color: '#ffffff' } : undefined} />
                  <span className="hidden sm:inline">{isHindi ? mode.label_hi : mode.label_en}</span>
                  <span className="sm:hidden">{mode.id === 'code' ? (isHindi ? 'Code' : 'Code') : mode.id === 'question' ? 'Q&A' : (isHindi ? 'Topic' : 'Topic')}</span>
                </button>
              ))}
            </div>

            {/* Settings Row */}
            <div className="flex items-center gap-2 px-5 py-2">
              {/* Programming Language Selector */}
              {activeMode !== 'explain' && (
                <div className="flex items-center gap-1 bg-[var(--glass-bg)] border border-[var(--border-color)] rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setProgLang('python')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all
                      ${progLang === 'python'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    <img src="/sample-assets/placeholder.svg" alt="" className="w-3.5 h-3.5" />
                    Python
                  </button>
                  <button
                    type="button"
                    onClick={() => setProgLang('c')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all
                      ${progLang === 'c'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    <img src="/sample-assets/placeholder.svg" alt="" className="w-3.5 h-3.5" />
                    C
                  </button>
                </div>
              )}

              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-[var(--glass-bg)] border border-[var(--border-color)] rounded-lg p-0.5 ml-auto">
                <button
                  type="button"
                  onClick={() => setAiLang('en')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all
                    ${aiLang === 'en'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  🇬🇧 EN
                </button>
                <button
                  type="button"
                  onClick={() => setAiLang('hi')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all
                    ${aiLang === 'hi'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  🇮🇳 हिं
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-5 pb-5 pt-2">
              <div className="mb-4">
                <textarea
                  id="askai-prompt-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full h-28 px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-colors text-sm"
                  autoFocus
                />
              </div>

              {/* Quick Chips */}
              {activeMode === 'question' && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(progLang === 'python'
                    ? ['Loops', 'Lists', 'Dictionary', 'OOP', 'Functions', 'String']
                    : ['Arrays', 'Pointers', 'Structures', 'Loops', 'Functions', 'File I/O']
                  ).map(chip => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setPrompt(chip)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[var(--glass-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-indigo-400 hover:text-indigo-500 transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {activeMode === 'explain' && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {['Variables', 'Loops', 'OOP', 'Recursion', 'Data Types', 'Functions'].map(chip => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setPrompt(chip)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[var(--glass-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-emerald-400 hover:text-emerald-500 transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {error && <p role="alert" className="mb-3 text-sm text-red-500">{error}</p>}
              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isGenerating}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] transition-colors"
                >
                  {isHindi ? 'बंद करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!prompt.trim() || isGenerating}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${currentMode.gradient} hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  {getButtonLabel()}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
