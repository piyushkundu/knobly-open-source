import type { User } from 'firebase/auth';
import type { ExamAnswers, ExamInfo, ExamQuestion, ExamStart, ExamResult, ExamReview } from '@/types/exam';

async function request<T>(user: User, body: object): Promise<T> {
  const response = await fetch('/api/exams',{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json',
    Authorization:'Bearer ' + await user.getIdToken()},body:JSON.stringify(body)});
  const data = await response.json();
  if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Exam service is unavailable.');
  return data as T;
}
export const loadExam = (user: User,testId: string) => request<{test:ExamInfo;questions:ExamQuestion[]}>(user,{action:'load',testId});
export const startExam = (user: User,testId: string,requestId: string) => request<ExamStart>(user,{action:'start',testId,requestId});
export const saveExam = (user: User,attemptId: string,answers: ExamAnswers,revision: number) => request<{saved:boolean}>(user,{action:'save',attemptId,answers,revision});
export const submitExam = (user: User,attemptId: string,answers: ExamAnswers,revision: number,type: string) => request<{result:ExamResult}>(user,{action:'submit',attemptId,answers,revision,type});
export const reviewExam = (user: User,attemptId: string) => request<ExamReview>(user,{action:'review',attemptId});
export const legacyExamList = (user: User) => request<{tests:{id:string;title:string;description:string;category:string;duration_minutes:number;total_points:number}[]}>(user,{action:'legacy-list'});
