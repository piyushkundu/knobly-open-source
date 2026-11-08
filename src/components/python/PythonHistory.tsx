'use client';

import { useState } from 'react';
import { History, X, Trash2, Code, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { CodeHistoryItem } from '@/types/python';
import { formatTimestamp, truncateCode } from '@/lib/python-utils';

interface PythonHistoryProps {
  history: CodeHistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: CodeHistoryItem) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function PythonHistory({
  history,
  isOpen,
  onClose,
  onSelect,
  onDelete,
  isLoading,
}: PythonHistoryProps) {
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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 h-[400px] bg-[var(--bg-secondary)] border-t border-[var(--border-color)] rounded-t-2xl z-50 overflow-hidden shadow-2xl shadow-indigo-500/10"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Code History</span>
                <span className="text-xs text-[var(--text-muted)]">({history.length} entries)</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto h-[calc(100%-56px)] p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-[var(--text-muted)]">Loading history...</span>
                  </div>
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <History className="w-12 h-12 text-[var(--text-muted)] mb-3 opacity-50" />
                  <p className="text-sm text-[var(--text-secondary)]">No code history yet</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Your executed code will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group p-3 bg-[var(--glass-bg)] hover:brightness-110 rounded-xl border border-[var(--glass-border)] hover:border-[var(--accent-primary)]/50 transition-colors cursor-pointer"
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {item.error ? (
                              <AlertCircle className="w-4 h-4 text-red-400" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            )}
                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(item.timestamp)}
                            </span>
                          </div>
                          <pre className="text-xs text-[var(--text-secondary)] font-mono truncate">
                            {truncateCode(item.code, 2)}
                          </pre>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                          }}
                          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-500 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
