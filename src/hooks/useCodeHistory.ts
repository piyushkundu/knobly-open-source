'use client';

import { useState, useCallback, useEffect } from 'react';
import { CodeHistoryItem } from '@/types/python';
import { generateId } from '@/lib/python-utils';

export function useCodeHistory() {
  const [history, setHistory] = useState<CodeHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem('python-code-history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveToHistory = useCallback(async (code: string, output: string, error: string | null) => {
    try {
      const newItem: CodeHistoryItem = {
        id: generateId(),
        code,
        output,
        error,
        timestamp: new Date().toISOString()
      };
      
      setHistory((prev) => {
        const updated = [newItem, ...prev].slice(0, 50); // Keep last 50
        localStorage.setItem('python-code-history', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('Failed to save to history:', err);
    }
  }, []);

  const deleteFromHistory = useCallback(async (id: string) => {
    try {
      setHistory((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        localStorage.setItem('python-code-history', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('Failed to delete from history:', err);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      setHistory([]);
      localStorage.removeItem('python-code-history');
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    isLoading,
    fetchHistory,
    saveToHistory,
    deleteFromHistory,
    clearHistory,
  };
}
