import type { ExamAnswers, ExamInfo, ExamQuestion, ExamResult } from '@/types/exam';

export class ExamError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export interface GradingQuestion extends ExamQuestion {
  explanation: string; exam_options: { id: string; option_text: string; is_correct: boolean }[];
}
export type ExamCommand =
  | { action: 'load'; testId: string }
  | { action: 'start'; testId: string; requestId: string }
  | { action: 'save' | 'submit'; attemptId: string; answers: ExamAnswers; revision: number; type: 'SUBMITTED' | 'AUTO_SUBMITTED' }
  | { action: 'review'; attemptId: string }
  | { action: 'legacy-list' };

const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
export function validId(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,160}$/.test(value) && !['__proto__','constructor','prototype'].includes(value);
}
function bad(): never { throw new ExamError(400, 'Invalid exam request.'); }
export function parseExamCommand(value: unknown): ExamCommand {
  if (!record(value)) bad();
  const { action } = value;
  const fields = action === 'load' ? ['action','testId'] : action === 'start' ? ['action','testId','requestId']
    : action === 'review' ? ['action','attemptId'] : action === 'legacy-list' ? ['action']
    : action === 'save' || action === 'submit' ? ['action','attemptId','answers','revision','type'] : bad();
  if (Object.keys(value).some(key => !fields.includes(key))) bad();
  if (action === 'legacy-list') return { action };
  if (action === 'load' || action === 'start') {
    if (!validId(value.testId)) bad();
    if (action === 'load') return { action, testId: value.testId };
    if (typeof value.requestId !== 'string' || !/^[A-Za-z0-9_-]{16,80}$/.test(value.requestId)) bad();
    return { action, testId: value.testId, requestId: value.requestId };
  }
  if (!validId(value.attemptId)) bad();
  if (action === 'review') return { action, attemptId: value.attemptId };
  if (!record(value.answers) || Object.keys(value.answers).length > 200 || !Number.isInteger(value.revision)
    || (value.revision as number) < 1 || (value.revision as number) > 2147483647) bad();
  const answers: ExamAnswers = {};
  for (const [id, answer] of Object.entries(value.answers)) {
    if (!validId(id) || !record(answer) || Object.keys(answer).some(key => !['option_id','short_answer'].includes(key))) bad();
    const option = answer.option_id ?? null, short = answer.short_answer ?? null;
    if ((option !== null && !validId(option)) || (short !== null && (typeof short !== 'string' || short.length > 2000))
      || (option !== null && short !== null)) bad();
    answers[id] = { option_id: option as string | null, short_answer: short as string | null };
  }
  if (value.type !== undefined && value.type !== 'SUBMITTED' && value.type !== 'AUTO_SUBMITTED') bad();
  return { action: action as 'save' | 'submit', attemptId: value.attemptId, answers, revision: value.revision as number,
    type: value.type === 'AUTO_SUBMITTED' ? 'AUTO_SUBMITTED' : 'SUBMITTED' };
}

export function nonnegative(value: unknown): number {
  const n = typeof value === 'string' && /^\d+(?:\.\d+)?$/.test(value.trim()) ? Number(value) : value;
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 ? Math.min(Number.MAX_SAFE_INTEGER, Math.floor(n)) : 0;
}
export function validateAnswers(questions: GradingQuestion[], answers: ExamAnswers) {
  const byId = new Map(questions.map(q => [q.id, q]));
  for (const [id, answer] of Object.entries(answers)) {
    const q = byId.get(id);
    if (!q || (answer.option_id && (!['MCQ','TF'].includes(q.question_type) || !q.exam_options.some(o => o.id === answer.option_id)))
      || (answer.short_answer !== null && ['MCQ','TF'].includes(q.question_type))) bad();
  }
}
export function grade(test: ExamInfo, questions: GradingQuestion[], answers: ExamAnswers, type: ExamResult['statusType']): ExamResult {
  let correctCount = 0, answered = 0;
  for (const q of questions) {
    const answer = answers[q.id];
    if (answer?.option_id || answer?.short_answer?.trim()) answered++;
    if (['MCQ','TF'].includes(q.question_type)) {
      // Preserve legacy single-choice behavior when old imports marked multiple options.
      const correct = [...q.exam_options].sort((a,b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0).filter(o => o.is_correct).at(-1);
      if (correct && answer?.option_id === correct.id) correctCount++;
    }
  }
  const total = questions.length;
  return { score: correctCount, total, accuracy: Math.round(correctCount / total * 100),
    pointsEarned: Math.round(correctCount * test.xp_reward / total), xpAwarded: 0, statusType: type,
    correctCount, wrongCount: answered - correctCount, skippedCount: total - answered };
}
export function publicExam(test: ExamInfo, questions: GradingQuestion[]) {
  return { test, questions: questions.map(q => ({ id: q.id, question_text: q.question_text, question_type: q.question_type,
    marks: q.marks, chapter: q.chapter ?? '', exam_options: q.exam_options.map(o => ({ id: o.id, option_text: o.option_text })) })) };
}
