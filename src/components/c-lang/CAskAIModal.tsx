'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Wand2, Terminal, HelpCircle } from 'lucide-react';
import { Button } from '../python/ui/Button';

interface CAskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => Promise<void>;
  language: 'en' | 'hi';
}

export function CAskAIModal({ isOpen, onClose, onGenerate, language }: CAskAIModalProps) {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const isHindi = language === 'hi';

  const SUGGESTIONS = isHindi ? [
    "Ek program likho jo factorial calculate kare",
    "Fibonacci series print karne ka code",
    "Array elements ko sort karne ka code",
    "Prime number check karne ka code"
  ] : [
    "Write a program to calculate factorial",
    "Code to print Fibonacci series",
    "Code to sort array elements",
    "Code to check prime number"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    setError('');

    setIsGenerating(true);
    try {
      await onGenerate(prompt);
      setPrompt('');
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'AI service is temporarily unavailable. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--bg-primary)] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-[var(--border-color)]"
            >
              <div className="relative bg-gradient-to-r from-green-600 to-green-500 p-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="flex justify-between items-start relative z-10">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-5 h-5 text-green-200" />
                      <h2 className="text-xl font-bold">
                        {isHindi ? 'AI से C कोड लिखवाएं' : 'Ask AI to Generate Code'}
                      </h2>
                    </div>
                    <p className="text-green-100 text-sm opacity-90">
                      {isHindi 
                        ? 'बस बताएं आपको क्या चाहिए, और AI आपके लिए C कोड लिख देगा।' 
                        : 'Describe what you want to build, and AI will write the C code.'}
                    </p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] mb-2">
                      <Terminal className="w-4 h-4 text-green-500" />
                      {isHindi ? 'आप क्या बनाना चाहते हैं?' : 'What do you want to build?'}
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={isHindi 
                        ? "जैसे: एक प्रोग्राम लिखो जो दो नंबर को जोड़ता हो..." 
                        : "e.g., Write a program that adds two numbers..."}
                      className="w-full h-32 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none transition-all"
                      autoFocus
                    />
                  </div>

                  {prompt.length === 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
                        <HelpCircle className="w-3.5 h-3.5" />
                        {isHindi ? 'सुझाव:' : 'Suggestions:'}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTIONS.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setPrompt(suggestion)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-green-500/50 hover:text-green-500 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
                  <div className="pt-2 flex gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onClose}
                      className="flex-1"
                    >
                      {isHindi ? 'रद्द करें' : 'Cancel'}
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!prompt.trim() || isGenerating}
                      className="flex-1 bg-green-500 hover:bg-green-600 border-transparent shadow-lg shadow-green-500/25"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          {isHindi ? 'जनरेट हो रहा है...' : 'Generating...'}
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          {isHindi ? 'कोड जनरेट करें' : 'Generate Code'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
