'use client';

import { useState, useCallback } from 'react';
import { AIExplanation } from '@/types/python';

export function useAIExplain() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<AIExplanation | null>(null);

  const explainError = useCallback(async (code: string, errorMessage: string, language: 'en' | 'hi') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-explain', {
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
