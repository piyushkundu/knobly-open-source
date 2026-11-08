export interface CCodeExecutionResult {
  output: string;
  error: string | null;
  errorLine: number | null;
}

export interface CAIExplanation {
  error_type: string;
  error_line: string;
  simple_explanation_english: string;
  simple_explanation_hindi: string;
  why_error_happened: string;
  how_to_fix: string;
  corrected_code: string;
}

export interface CCodeHistoryItem {
  id: string;
  code: string;
  output: string;
  error: string | null;
  timestamp: string;
}

export type Language = 'en' | 'hi';
export type HelpMode = 'manual' | 'auto';
