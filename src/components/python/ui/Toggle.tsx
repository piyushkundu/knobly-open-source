'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/python-utils';

interface ToggleProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Toggle = forwardRef<HTMLDivElement, ToggleProps>(
  ({ className, options, value, onChange }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center p-1 rounded-lg bg-[var(--glass-bg)] border border-[var(--border-color)] flex-shrink-0',
          className
        )}
      >
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
              value === option.value
                ? 'bg-indigo-500/20 text-indigo-300 shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
