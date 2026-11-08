import { useState, useCallback } from 'react';
import { CCodeHistoryItem, CAIExplanation } from '@/types/c-lang';
import { generateId, extractCLineNumber } from '@/lib/c-utils';

export function useCCodeHistory() {
  const [history, setHistory] = useState<CCodeHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('c-code-history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const saveToHistory = useCallback(async (code: string, output: string, error: string | null) => {
    const newItem: CCodeHistoryItem = {
      id: generateId(),
      code,
      output,
      error,
      timestamp: new Date().toISOString(),
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 50);
      localStorage.setItem('c-code-history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('c-code-history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('c-code-history');
  }, []);

  return {
    history,
    saveToHistory,
    deleteFromHistory,
    clearHistory,
  };
}

export function useCAIExplain() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<CAIExplanation | null>(null);

  const explainError = useCallback(async (code: string, errorMessage: string, language: 'en' | 'hi') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/c-ai-explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          error: errorMessage,
          language,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get explanation');
      }

      const data = await response.json();
      setExplanation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearExplanation = useCallback(() => {
    setExplanation(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    explanation,
    explainError,
    clearExplanation,
  };
}
