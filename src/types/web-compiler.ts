export interface WebEditorTab {
  id: string;
  name: string;
  language: 'html' | 'css' | 'javascript';
  code: string;
  isDirty?: boolean;
}

export interface ConsoleMessage {
  id: string;
  level: 'log' | 'warn' | 'error' | 'info';
  message: string;
  time: string;
}

export interface SavedWebProject {
  id: string;
  title: string;
  description?: string;
  folder?: string;
  html: string;
  css: string;
  js: string;
  isImportant?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebAIExplanation {
  explanation: string;
  how_to_fix: string;
  corrected_code: string;
}

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';
export type Language = 'en' | 'hi';
