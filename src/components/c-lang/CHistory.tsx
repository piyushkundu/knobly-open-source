'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Trash2, Clock, Code2, Play } from 'lucide-react';
import { CCodeHistoryItem } from '@/types/c-lang';
import { formatTimestamp, truncateCode } from '@/lib/c-utils';
import { Button } from '../python/ui/Button';
import { cn } from '@/lib/c-utils';

interface CHistoryProps {
  history: CCodeHistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: CCodeHistoryItem) => void;
  onDelete: (id: string) => void;
}

export function CHistory({ history, isOpen, onClose, onSelect, onDelete }: CHistoryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          />
          
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[var(--bg-primary)] border-l border-[var(--border-color)] shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--glass-bg)]">
              <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <History className="w-5 h-5 text-green-500" />
                <h2 className="font-semibold text-lg">Code History</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)]"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-4">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] opacity-50 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--glass-bg)] border border-[var(--border-color)] flex items-center justify-center">
                    <History className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium">No history yet</p>
                  <p className="text-xs text-center max-w-[200px]">
                    Run your C code and it will appear here automatically.
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onHoverStart={() => setHoveredId(item.id)}
                    onHoverEnd={() => setHoveredId(null)}
                    className={cn(
                      "group relative p-4 rounded-xl border transition-all duration-200",
                      "bg-[var(--card-bg)] hover:shadow-md",
                      item.error 
                        ? "border-[var(--error-border)] hover:border-[var(--accent-error)]/50" 
                        : "border-[var(--border-color)] hover:border-green-500/50"
                    )}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-medium">{formatTimestamp(item.timestamp)}</span>
                      </div>
                      <div className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                        item.error 
                          ? "bg-[var(--error-bg)] text-[var(--accent-error)]" 
                          : "bg-green-500/10 text-green-500"
                      )}>
                        {item.error ? 'Error' : 'Success'}
                      </div>
                    </div>

                    <div className="bg-[var(--bg-secondary)] rounded-lg p-3 mb-3 border border-[var(--border-color)] overflow-hidden">
                      <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]">
                        <Code2 className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold uppercase tracking-wider">C</span>
                      </div>
                      <pre className="text-xs font-mono text-[var(--text-primary)] opacity-90 leading-relaxed">
                        {truncateCode(item.code)}
                      </pre>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white border-transparent"
                        onClick={() => {
                          onSelect(item);
                          onClose();
                        }}
                      >
                        <Play className="w-3.5 h-3.5 mr-1.5" />
                        Restore
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="text-[var(--text-muted)] hover:text-[var(--accent-error)] hover:bg-[var(--error-bg)] px-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
