export interface ExamOption { id: string; option_text: string; }
export interface ExamQuestion {
  id: string; question_text: string; question_type: string; marks: number;
  chapter?: string; exam_options: ExamOption[];
}
export interface ExamInfo { id: string; title: string; duration_minutes: number; xp_reward: number; }
export type ExamAnswers = Record<string, { option_id: string | null; short_answer: string | null }>;
export interface ExamResult {
  score: number; total: number; accuracy: number; pointsEarned: number; xpAwarded: number;
  statusType: 'SUBMITTED' | 'AUTO_SUBMITTED'; correctCount: number; wrongCount: number; skippedCount: number;
}
export interface ExamStart {
  attemptId: string; test: ExamInfo; questions: ExamQuestion[]; answers: ExamAnswers;
  revision: number; remainingSeconds: number; result?: ExamResult;
}
export interface ExamReview {
  attempt: { id: string; test_id: string; user_id: string; status: string; started_at?: string; submitted_at?: string; score?: number; accuracy?: number; points_earned?: number; xp_earned?: number };
  reviewSource: 'snapshot' | 'legacy';
  test: ExamInfo;
  questions: (Omit<ExamQuestion, 'exam_options'> & { explanation?: string; exam_options: (ExamOption & { is_correct: boolean })[] })[];
  responses: Record<string, { question_id: string; option_id: string | null; short_answer: string | null }>;
}
