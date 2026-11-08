export interface CodeExecutionResult {
  output: string;
  error: string | null;
  errorLine: number | null;
}

export interface AIExplanation {
  error_type: string;
  error_line: string;
  simple_explanation_english: string;
  simple_explanation_hindi: string;
  why_error_happened: string;
  how_to_fix: string;
  corrected_code: string;
}

export interface CodeHistoryItem {
  id: string;
  code: string;
  output: string;
  error: string | null;
  timestamp: string;
}

export interface SavedCodeItem {
  id: string;
  title: string;
  code: string;
  isImportant: boolean;
  tags?: string[];
  folder?: string;
  lastOutput?: string;
  description?: string;
  language?: 'python' | 'c';
  createdAt: string;
  updatedAt: string;
}

export type Language = 'en' | 'hi';
export type HelpMode = 'manual' | 'auto';

export interface AppState {
  code: string;
  output: string;
  error: string | null;
  errorLine: number | null;
  isRunning: boolean;
  isPyodideLoading: boolean;
  pyodideReady: boolean;
  aiExplanation: AIExplanation | null;
  isAILoading: boolean;
  language: Language;
  helpMode: HelpMode;
  showHistory: boolean;
  history: CodeHistoryItem[];
}
