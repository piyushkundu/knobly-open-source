'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { CodeExecutionResult } from '@/types/python';
import { extractLineNumber, formatPythonError } from '@/lib/python-utils';

declare global {
  interface Window {
    loadPyodide: (config: {
      indexURL: string;
      stdout?: (msg: string) => void;
      stderr?: (msg: string) => void;
    }) => Promise<PyodideInterface>;
    currentPyodideInputLines: string[];
    pyodideInputNeededPrompt: string | null;
    __pyodideStream__: (text: string) => void;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (config: { batched: (msg: string) => void }) => void;
  setStderr: (config: { batched: (msg: string) => void }) => void;
  loadPackage: (packages: string | string[], options?: Record<string, unknown>) => Promise<void>;
  loadedPackages: Record<string, string>;
}

// Packages that are part of Pyodide's distribution and can be loaded on demand
const PYODIDE_PACKAGES: Record<string, string[]> = {
  numpy: ['numpy'],
  np: ['numpy'],
  pandas: ['pandas'],
  pd: ['pandas'],
  matplotlib: ['matplotlib'],
  plt: ['matplotlib'],
  scipy: ['scipy'],
  sklearn: ['scikit-learn'],
  cv2: ['opencv-python'],
  PIL: ['Pillow'],
  sympy: ['sympy'],
};

/**
 * Detect which packages need to be loaded based on import statements in user code.
 */
function detectRequiredPackages(code: string): string[] {
  const needed = new Set<string>();
  // Match: import X, from X import ..., import X as Y
  const importRegex = /^\s*(?:import|from)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm;
  let match;
  while ((match = importRegex.exec(code)) !== null) {
    const mod = match[1];
    if (PYODIDE_PACKAGES[mod]) {
      for (const pkg of PYODIDE_PACKAGES[mod]) {
        needed.add(pkg);
      }
    }
  }
  return Array.from(needed);
}

const EXECUTION_TIMEOUT = 30000;
// 0.26.2+ includes the upstream fix for Monaco's global define.amd loader.
// Keep the bootstrap, WASM and packages on the same pinned distribution.
const PYODIDE_BASE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
const MAX_LOOP_ITERATIONS = 200;
const INPUT_NEEDED_MARKER = '___PYODIDE_INPUT_NEEDED___';

export interface ExecuteResult extends CodeExecutionResult {
  needsInput?: boolean;
  inputPrompt?: string;
}

// ─── Code Pre-processors ──────────────────────────────────────────────────────

/**
 * Injects iteration-limit guards into while True / while 1 / while(True) loops.
 */
function injectLoopLimits(code: string): string {
  const lines = code.split('\n');
  const result: string[] = [];
  let counter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const infiniteMatch = line.match(/^(\s*)while\s*\(?\s*(True|1)\s*\)?\s*:\s*(#.*)?$/);

    if (infiniteMatch) {
      const indent = infiniteMatch[1];
      const varName = `__lc${counter++}__`;

      let bodyIndent = indent + '    ';
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim().length > 0) {
          const bm = lines[j].match(/^(\s+)/);
          if (bm) bodyIndent = bm[1];
          break;
        }
      }

      result.push(`${indent}${varName} = 0`);
      result.push(`${indent}while True:`);
      result.push(`${bodyIndent}${varName} += 1`);
      result.push(`${bodyIndent}if ${varName} > ${MAX_LOOP_ITERATIONS}:`);
      result.push(`${bodyIndent}    print("\\n⚠️  Loop stopped: ${MAX_LOOP_ITERATIONS} iteration limit reached")`);
      result.push(`${bodyIndent}    break`);
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * If code uses time.sleep(), wraps it in an async context and
 * replaces time.sleep() with await asyncio.sleep() so Pyodide
 * can yield to the JS event loop — enabling real, non-blocking sleep.
 */
function makeAsyncIfNeeded(code: string): string {
  const hasSleep = /\btime\s*\.\s*sleep\s*\(/.test(code);
  if (!hasSleep) return code;

  // Replace time.sleep( → await asyncio.sleep(
  const transformed = code.replace(/\btime\s*\.\s*sleep\s*\(/g, 'await asyncio.sleep(');

  // Indent all lines (they become the body of async def _main())
  const indented = transformed
    .split('\n')
    .map(l => '    ' + l)
    .join('\n');

  // Wrap in async def and add asyncio import at top
  return `import asyncio as asyncio\nasync def _main():\n${indented}\nawait _main()`;
}

// ─────────────────────────────────────────────────────────────────────────────

export function usePyodide() {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pyodideRef = useRef<PyodideInterface | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initPyodide() {
      try {
        if (!window.loadPyodide) {
          const script = document.createElement('script');
          script.src = `${PYODIDE_BASE_URL}pyodide.js`;
          script.async = true;
          document.body.appendChild(script);

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Pyodide script. Please check your internet connection or ad blocker.'));
          });
        }

        if (!mounted) return;

        const pyodide = await window.loadPyodide({
          indexURL: PYODIDE_BASE_URL,
          stdout: () => {},
          stderr: () => {},
        });

        if (!mounted) return;

        // Pre-load numpy so it's available immediately
        try {
          await pyodide.loadPackage('numpy');
        } catch (e) {
          console.warn('Failed to pre-load numpy:', e);
        }

        pyodideRef.current = pyodide;
        setIsReady(true);
        setIsLoading(false);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load Pyodide');
        setIsLoading(false);
      }
    }

    initPyodide();
    return () => { mounted = false; };
  }, []);

  const executeCode = useCallback(async (
    code: string,
    inputLines: string[] = [],
    onStreamOutput?: (text: string) => void,
  ): Promise<ExecuteResult> => {
    if (!pyodideRef.current) {
      return { output: '', error: 'Python runtime not loaded yet. Please wait.', errorLine: null };
    }

    // Auto-load any required packages (numpy, pandas, etc.)
    const requiredPackages = detectRequiredPackages(code);
    if (requiredPackages.length > 0) {
      try {
        await pyodideRef.current.loadPackage(requiredPackages);
      } catch (e) {
        console.warn('Failed to load packages:', requiredPackages, e);
      }
    }

    // Pre-process: guard infinite loops, then optionally make async
    const loopSafe = injectLoopLimits(code);
    const safeCode = makeAsyncIfNeeded(loopSafe);

    window.currentPyodideInputLines = [...inputLines];
    window.pyodideInputNeededPrompt = null;

    // Wire up real-time streaming callback
    window.__pyodideStream__ = (text: string) => {
      onStreamOutput?.(text);
    };

    pyodideRef.current.setStdout({ batched: () => {} });
    pyodideRef.current.setStderr({ batched: () => {} });

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Execution timed out (30s limit)')), EXECUTION_TIMEOUT);
      });

      // ── Python setup: streaming stdout class + custom input ────────────────
      // _RealtimeCapture streams each write() call to JS immediately AND
      // accumulates the full output (preserving end=, sep= correctly).
      await pyodideRef.current.runPythonAsync(`
import sys, io, builtins, js

class _RealtimeCapture:
    def __init__(self):
        self._all = ""
    def write(self, text):
        if text:
            self._all += text
            try:
                js.__pyodideStream__(text)
            except Exception:
                pass
        return len(text)
    def flush(self):
        pass
    def getvalue(self):
        return self._all

_captured_stdout = _RealtimeCapture()
_captured_stderr = io.StringIO()
sys.stdout = _captured_stdout
sys.stderr = _captured_stderr

def custom_input(prompt_text=""):
    sys.stdout.write(str(prompt_text))
    sys.stdout.flush()
    if hasattr(js, 'currentPyodideInputLines') and js.currentPyodideInputLines.length > 0:
        val = js.currentPyodideInputLines.shift()
        return str(val)
    js.pyodideInputNeededPrompt = str(prompt_text)
    raise EOFError("${INPUT_NEEDED_MARKER}" + str(prompt_text))

builtins.input = custom_input
`);

      // ── Run user code ───────────────────────────────────────────────────────
      const pyodidePromise = pyodideRef.current.runPythonAsync(safeCode);
      pyodidePromise.catch(() => {});

      await Promise.race([pyodidePromise, timeoutPromise]);

      // ── Collect final output ────────────────────────────────────────────────
      const result = await pyodideRef.current.runPythonAsync(`
import json
_out = _captured_stdout.getvalue()
_err = _captured_stderr.getvalue()
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
json.dumps({"out": _out, "err": _err})
`);

      const { out, err } = JSON.parse(result as string);
      return {
        output: out.trimEnd(),
        error: err ? formatPythonError(err.trim()) : null,
        errorLine: err ? extractLineNumber(err) : null,
        needsInput: false,
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      // Collect partial output on error/timeout
      let partialOut = '';
      let partialErr = '';
      try {
        const partial = await pyodideRef.current.runPythonAsync(`
import json, sys
_out = _captured_stdout.getvalue() if '_captured_stdout' in dir() else ''
_err = _captured_stderr.getvalue() if '_captured_stderr' in dir() else ''
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
json.dumps({"out": _out, "err": _err})
`);
        const parsed = JSON.parse(partial as string);
        partialOut = parsed.out || '';
        partialErr = parsed.err || '';
      } catch { /* ignore */ }

      if (errorMessage.includes(INPUT_NEEDED_MARKER)) {
        return {
          output: partialOut.trimEnd(),
          error: null,
          errorLine: null,
          needsInput: true,
          inputPrompt: window.pyodideInputNeededPrompt || '',
        };
      }

      if (errorMessage.includes('timed out')) {
        return {
          output: partialOut.trimEnd(),
          error: 'Execution timed out (30s limit).',
          errorLine: null,
          needsInput: false,
        };
      }

      const finalError = partialErr
        ? formatPythonError(partialErr.trim())
        : formatPythonError(errorMessage);

      return {
        output: partialOut.trimEnd(),
        error: finalError,
        errorLine: partialErr ? extractLineNumber(partialErr) : extractLineNumber(errorMessage),
        needsInput: false,
      };
    }
  }, []);

  return { isLoading, isReady, error, executeCode };
}
