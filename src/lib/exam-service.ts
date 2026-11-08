import 'server-only';
import { createHash } from 'node:crypto';
import type { Firestore, Transaction, DocumentSnapshot } from 'firebase-admin/firestore';
import type { ExamAnswers, ExamInfo, ExamStart, ExamResult, ExamReview } from '@/types/exam';
import { ExamError, type ExamCommand, type GradingQuestion, nonnegative, validateAnswers, grade, publicExam, validId } from '@/lib/exam-grading';

interface Definition { test: ExamInfo; questions: GradingQuestion[]; requiredXp: number; liveEnd: number | null; }
interface Session extends Definition { uid: string; deadline: number; answers: ExamAnswers; revision: number; }
const hash = (...parts: string[]) => createHash('sha256').update(JSON.stringify(parts)).digest('hex');
const finished = (status: unknown) => status === 'SUBMITTED' || status === 'AUTO_SUBMITTED';
function contentError(): never { throw new ExamError(409, 'This exam needs an admin review before it can be started.'); }
function text(value: unknown, limit: number, required = false): string {
  if ((value === undefined || value === null) && !required) return '';
  if (typeof value !== 'string' || value.length > limit || (required && !value.trim())) contentError();
  return value;
}
function timestamp(value: unknown): number {
  if (typeof value === 'string') return Date.parse(value);
  if (value && typeof value === 'object' && 'toMillis' in value && typeof value.toMillis === 'function') return value.toMillis();
  return NaN;
}
function storedNumber(value: unknown): number | undefined {
  if (typeof value === 'string' && /^\d+(?:\.\d+)?$/.test(value.trim())) value = Number(value);
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER ? value : undefined;
}
async function definition(db: Firestore, testId: string, now: number, legacy = false, tx?: Transaction): Promise<Definition> {
  const testRef = db.doc('exam_tests/' + testId);
  const testDoc = tx ? await tx.get(testRef) : await testRef.get();
  if (!testDoc.exists) throw new ExamError(404, 'Exam not found.');
  const data = testDoc.data()!;
  if (!legacy && data.is_active === false) throw new ExamError(403, 'This exam is not available.');
  let liveEnd: number | null = null;
  if (data.mode === 'LIVE') {
    const start = timestamp(data.live_start), end = timestamp(data.live_end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) contentError();
    if (!legacy && (now < start || now >= end)) throw new ExamError(403, 'This live exam is outside its scheduled time.');
    liveEnd = end;
  }
  const duration = nonnegative(data.duration_minutes) || 60;
  if (duration > 1440) contentError();
  const questionsQuery = db.collection('exam_questions').where('test_id','==',testId)
    .select('question_text','question_type','marks','chapter','explanation').limit(201);
  const snap = tx ? await tx.get(questionsQuery) : await questionsQuery.get();
  if (snap.empty || snap.size > 200) contentError();
  const options = new Map<string, GradingQuestion['exam_options']>();
  for (let i = 0; i < snap.docs.length; i += 30) {
    const ids = snap.docs.slice(i,i+30).map(q => q.id);
    const optionsQuery = db.collection('exam_options').where('question_id','in',ids)
      .select('question_id','option_text','is_correct').limit(301);
    const rows = tx ? await tx.get(optionsQuery) : await optionsQuery.get();
    if (rows.size > 300) contentError();
    for (const row of rows.docs) {
      const o = row.data(), list = options.get(o.question_id) ?? [];
      if (!validId(row.id) || list.length >= 10) contentError();
      list.push({ id: row.id, option_text: text(o.option_text,4000,true),
        is_correct: o.is_correct === true || o.is_correct === 1 || o.is_correct === '1' || String(o.is_correct).toLowerCase() === 'true' });
      options.set(o.question_id,list);
    }
  }
  const questions = snap.docs.map(row => {
    const q = row.data(), kind = text(q.question_type,30,true).toUpperCase();
    if (!validId(row.id) || !['MCQ','TF','SHORT'].includes(kind)) contentError();
    const opts = options.get(row.id) ?? [];
    if (['MCQ','TF'].includes(kind) && (!opts.length || !opts.some(o => o.is_correct))) contentError();
    return { id: row.id, question_text: text(q.question_text,10000,true), question_type: kind,
      marks: nonnegative(q.marks) || 1, chapter: text(q.chapter,300), explanation: text(q.explanation,10000), exam_options: opts };
  });
  const reward = nonnegative(data.xp_reward) || questions.length;
  if (reward > 1000000) contentError();
  let requiredXp = 0;
  if (data.level_id) {
    if (!validId(data.level_id)) contentError();
    const levelRef = db.doc('exam_levels/' + data.level_id);
    const level = (tx ? await tx.get(levelRef) : await levelRef.get()).data() ?? {};
    requiredXp = nonnegative(data.required_xp ?? level.required_xp ?? (100 + Math.max(0,(nonnegative(level.level_no) || 1)-1)*50));
  }
  const result = { test: { id: testId, title: text(data.title,300,true), duration_minutes: duration, xp_reward: reward }, questions, requiredXp, liveEnd };
  if (Buffer.byteLength(JSON.stringify(result),'utf8') > 700000) contentError();
  return result;
}
async function states(db: Firestore, tx: Transaction, uid: string) {
  const rows = await tx.get(db.collection('exam_user_state').where('user_id','==',uid).limit(101));
  if (rows.size > 100) throw new ExamError(409, 'Your progress needs an admin review.');
  return [...rows.docs].sort((a,b) => statePoints(b) - statePoints(a) || a.id.localeCompare(b.id));
}
const statePoints = (row: DocumentSnapshot) => nonnegative(row.data()?.total_points) || nonnegative(row.data()?.total_xp);
function owned(attempt: DocumentSnapshot, uid: string) {
  if (!attempt.exists || attempt.data()?.user_id !== uid) throw new ExamError(404, 'Attempt not found.');
}
function sessionData(snapshot: DocumentSnapshot, uid: string): Session {
  const data = snapshot.data();
  if (!data || data.uid !== uid) throw new ExamError(409, 'This older attempt cannot be submitted securely. Please start a new attempt.');
  return data as Session;
}
function startResult(id: string, session: Session, result: ExamResult | undefined, now: number): ExamStart {
  return { attemptId: id, ...publicExam(session.test,session.questions), answers: session.answers, revision: session.revision,
    remainingSeconds: Math.max(0,Math.ceil((session.deadline-now)/1000)), ...(result ? { result } : {}) };
}
async function activeSession(db: Firestore, tx: Transaction, uid: string, testId: string, now: number): Promise<ExamStart | null> {
  const control = await tx.get(db.doc('exam_awards/' + hash(uid,testId))), active = control.data()?.active_attempt_id;
  if (typeof active !== 'string' || !validId(active)) return null;
  const attempt = await tx.get(db.doc('exam_attempts/' + active));
  if (!attempt.exists || attempt.data()?.user_id !== uid || attempt.data()?.test_id !== testId || attempt.data()?.status !== 'IN_PROGRESS') return null;
  const session = sessionData(await tx.get(db.doc('exam_attempt_keys/' + active)),uid);
  if (session.test.id !== testId) throw new ExamError(409,'This attempt needs an admin review.');
  return startResult(active,session,undefined,now);
}

export async function runExamCommand(db: Firestore, uid: string, command: ExamCommand, now = Date.now()): Promise<unknown> {
  if (command.action === 'legacy-list') {
    const snap = await db.collection('tests').select('title','description','category','duration_minutes','total_points','is_active').limit(501).get();
    if (snap.size > 500) throw new ExamError(503,'Legacy test list is unavailable.');
    return { tests: snap.docs.filter(d => d.data().is_active !== false).map(d => ({ id: d.id,
      title: text(d.data().title,300), description: text(d.data().description,2000), category: text(d.data().category,100),
      duration_minutes: nonnegative(d.data().duration_minutes), total_points: nonnegative(d.data().total_points) })) };
  }
  if (command.action === 'load') {
    const active = await db.runTransaction(tx => activeSession(db,tx,uid,command.testId,now));
    if (active) return {test:active.test,questions:active.questions};
    const def = await definition(db,command.testId,now);
    return publicExam(def.test,def.questions);
  }
  if (command.action === 'start') {
    const id = hash(uid,command.requestId), attemptRef = db.doc('exam_attempts/' + id), keyRef = db.doc('exam_attempt_keys/' + id);
    const controlRef = db.doc('exam_awards/' + hash(uid,command.testId));
    return db.runTransaction(async tx => {
      const existing = await tx.get(attemptRef);
      if (existing.exists) {
        owned(existing,uid);
        const session = sessionData(await tx.get(keyRef),uid);
        if (session.test.id !== command.testId) throw new ExamError(409,'Start request already used.');
        return startResult(id,session,existing.data()?.result,now);
      }
      const active = await activeSession(db,tx,uid,command.testId,now);
      if (active) return active;
      const def = await definition(db,command.testId,now,false,tx);
      const progress = await states(db,tx,uid);
      if (def.requiredXp > (progress[0] ? statePoints(progress[0]) : 0)) throw new ExamError(403,'Complete the earlier levels to unlock this exam.');
      const session: Session = { ...def, uid, deadline: Math.min(now + def.test.duration_minutes*60000,def.liveEnd ?? Infinity), answers: {}, revision: 0 };
      tx.create(attemptRef,{ user_id: uid, test_id: command.testId, status: 'IN_PROGRESS', started_at: new Date(now).toISOString(),
        created_at: new Date(now).toISOString(), grading_version: 1 });
      tx.create(keyRef,session);
      tx.set(controlRef,{ user_id: uid, test_id: command.testId, active_attempt_id: id },{merge:true});
      return startResult(id,session,undefined,now);
    });
  }
  if (command.action === 'review') return review(db,uid,command.attemptId,now);
  const attemptRef = db.doc('exam_attempts/' + command.attemptId), keyRef = db.doc('exam_attempt_keys/' + command.attemptId);
  return db.runTransaction(async tx => {
    const attempt = await tx.get(attemptRef); owned(attempt,uid);
    const data = attempt.data()!;
    // Return the committed result on retries, without accepting changes or awarding again.
    if (finished(data.status) && data.result) return command.action === 'submit' ? { result: data.result } : { saved: false };
    if (data.status !== 'IN_PROGRESS') throw new ExamError(409,'This attempt is closed.');
    const session = sessionData(await tx.get(keyRef),uid);
    validateAnswers(session.questions,command.answers);
    if (Buffer.byteLength(JSON.stringify({...session,answers:command.answers}),'utf8') > 850000) {
      throw new ExamError(413,'These answers are too large. Please shorten the written answers.');
    }
    const expired = now >= session.deadline;
    if (command.action === 'save') {
      if (expired) throw new ExamError(409,'Time is up. Submit your saved answers.');
      if (command.revision > session.revision) tx.update(keyRef,{ answers: command.answers, revision: command.revision });
      return { saved: command.revision >= session.revision };
    }
    // An expired submit can only grade answers persisted before the deadline.
    const answers = !expired && command.revision > session.revision ? command.answers : session.answers;
    const result = grade(session.test,session.questions,answers,expired ? 'AUTO_SUBMITTED' : command.type);
    const controlRef = db.doc('exam_awards/' + hash(uid,session.test.id)), control = await tx.get(controlRef);
    let first = !control.data()?.first_completed_attempt_id;
    if (first) {
      // Honor existing completed attempts without rewriting their historical scores.
      const prior = await tx.get(db.collection('exam_attempts').where('user_id','==',uid).where('test_id','==',session.test.id).limit(1001));
      if (prior.size > 1000) throw new ExamError(409,'This exam history needs an admin review.');
      first = !prior.docs.some(row => row.id !== command.attemptId && finished(row.data().status));
    }
    const progress = first && result.pointsEarned > 0 ? await states(db,tx,uid) : [];
    result.xpAwarded = first ? result.pointsEarned : 0;
    // All reads above precede every write; the control doc serializes concurrent completions.
    if (!control.data()?.first_completed_attempt_id) tx.set(controlRef,{ user_id: uid, test_id: session.test.id,
      first_completed_attempt_id: command.attemptId },{merge:true});
    if (result.xpAwarded > 0) {
      const row = progress[0], total = (row ? statePoints(row) : 0) + result.xpAwarded;
      if (!Number.isSafeInteger(total)) throw new ExamError(409,'Your progress needs an admin review.');
      if (row) tx.update(row.ref,{total_points:total,total_xp:total});
      else tx.create(db.doc('exam_user_state/' + uid),{user_id:uid,total_points:total,total_xp:total,current_level:1,created_at:new Date(now).toISOString()});
    }
    tx.update(keyRef,{answers,revision:Math.max(session.revision,command.revision)});
    tx.update(attemptRef,{ status:result.statusType, submitted_at:new Date(now).toISOString(), score:result.score, accuracy:result.accuracy,
      points_earned:result.pointsEarned,xp_earned:result.xpAwarded,result });
    for (const q of session.questions) {
      const answer = answers[q.id];
      if (answer) tx.set(db.doc('exam_responses/' + command.attemptId + '_' + q.id),{attempt_id:command.attemptId,question_id:q.id,
        ...answer,updated_at:new Date(now).toISOString()});
    }
    return { result };
  });
}

async function review(db: Firestore, uid: string, id: string, now: number): Promise<ExamReview> {
  const snap = await db.doc('exam_attempts/' + id).get(); owned(snap,uid);
  const a = snap.data()!;
  if (!finished(a.status)) throw new ExamError(409,'Submit this attempt before opening its review.');
  const keys = await db.doc('exam_attempt_keys/' + id).get();
  let def: Definition, answers: ExamAnswers;
  if (keys.exists) { const session = sessionData(keys,uid); def = session; answers = session.answers; }
  else {
    // Completed legacy reviews remain available, clearly retaining their original scores.
    if (!validId(a.test_id)) throw new ExamError(409,'Legacy review is unavailable.');
    def = await definition(db,a.test_id,now,true);
    const rows = await db.collection('exam_responses').where('attempt_id','==',id).select('question_id','option_id','short_answer').limit(201).get();
    if (rows.size > 200) throw new ExamError(409,'Legacy review needs an admin review.');
    answers = {};
    for (const row of rows.docs) {
      const r = row.data(); if (!validId(r.question_id)) continue;
      answers[r.question_id] = {option_id:validId(r.option_id)?r.option_id:null,short_answer:typeof r.short_answer==='string'?r.short_answer.slice(0,2000):null};
    }
  }
  if (def.liveEnd !== null && now < def.liveEnd) throw new ExamError(409,'Live exam reviews open after the scheduled end.');
  return { attempt: {id,test_id:a.test_id,user_id:uid,status:a.status,started_at:typeof a.started_at==='string'?a.started_at:undefined,
    submitted_at:typeof a.submitted_at==='string'?a.submitted_at:undefined,score:storedNumber(a.score),accuracy:storedNumber(a.accuracy),
    points_earned:storedNumber(a.points_earned),xp_earned:storedNumber(a.xp_earned)},reviewSource:keys.exists?'snapshot':'legacy',
    test:def.test,questions:def.questions,responses:Object.fromEntries(Object.entries(answers).map(([qid,r])=>[qid,{question_id:qid,...r}])) };
}
