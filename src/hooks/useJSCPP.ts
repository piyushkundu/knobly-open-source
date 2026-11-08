'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { CCodeExecutionResult } from '@/types/c-lang';
import { extractCLineNumber, formatCError } from '@/lib/c-utils';

const EXECUTION_TIMEOUT = 15000;

// Special marker for when scanf needs input
const INPUT_NEEDED_MARKER = '___JSCPP_INPUT_NEEDED___';

export interface CExecuteResult extends CCodeExecutionResult {
  needsInput?: boolean;
  inputPrompt?: string;
}

export function useJSCPP() {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const jscppRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    async function initJSCPP() {
      try {
        // Dynamically import JSCPP
        const JSCPP = (await import('JSCPP')).default || (await import('JSCPP'));
        
        if (!mounted) return;

        jscppRef.current = JSCPP;
        setIsReady(true);
        setIsLoading(false);
      } catch (err) {
        if (!mounted) return;
        console.error('Failed to load JSCPP:', err);
        setError(err instanceof Error ? err.message : 'Failed to load C runtime');
        setIsLoading(false);
      }
    }

    initJSCPP();

    return () => {
      mounted = false;
    };
  }, []);

  const executeCode = useCallback(async (
    code: string,
    inputLines: string[] = [],
  ): Promise<CExecuteResult> => {
    if (!jscppRef.current) {
      return {
        output: '',
        error: 'C runtime not loaded yet. Please wait.',
        errorLine: null,
      };
    }

    const JSCPP = jscppRef.current;

    return new Promise<CExecuteResult>((resolve) => {
      let output = '';
      let inputIndex = 0;
      let needsInput = false;

      const timeoutId = setTimeout(() => {
        resolve({
          output: output.trim(),
          error: 'Execution timed out (15s limit). Check for infinite loops.',
          errorLine: null,
          needsInput: false,
        });
      }, EXECUTION_TIMEOUT);

      try {
        const config = {
          stdio: {
            write: (s: string) => {
              output += s;
            },
          },
          unsigned_overflow: 'warn',
        };

        // Build stdin string from inputLines
        const stdinStr = inputLines.join('\n') + (inputLines.length > 0 ? '\n' : '');

        // JSCPP accepts input as a string via the `input` config or stdin
        const exitCode = JSCPP.run(code, stdinStr, config);

        clearTimeout(timeoutId);

        resolve({
          output: output.trim(),
          error: null,
          errorLine: null,
          needsInput: false,
        });
      } catch (err) {
        clearTimeout(timeoutId);
        const errorMessage = err instanceof Error ? err.message : String(err);

        // Check if JSCPP is requesting more input (EOF on stdin)
        if (
          errorMessage.includes('EOF') ||
          errorMessage.includes('read beyond') ||
          errorMessage.includes('input') && errorMessage.toLowerCase().includes('end')
        ) {
          // Needs more input from user
          resolve({
            output: output.trim(),
            error: null,
            errorLine: null,
            needsInput: true,
            inputPrompt: '',
          });
        } else {
          const cleanError = formatCError(errorMessage);
          resolve({
            output: output.trim(),
            error: cleanError,
            errorLine: extractCLineNumber(errorMessage),
            needsInput: false,
          });
        }
      }
    });
  }, []);

  return {
    isLoading,
    isReady,
    error,
    executeCode,
  };
}
