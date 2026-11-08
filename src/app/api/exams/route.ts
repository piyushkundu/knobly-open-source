import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/user-api-auth';
import { getAdminDb } from '@/lib/firebase-admin';
import { ExamError, parseExamCommand } from '@/lib/exam-grading';
import { runExamCommand } from '@/lib/exam-service';

export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store', Vary: 'Authorization' };
const MAX_BODY = 512000;
async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > MAX_BODY) throw new ExamError(413,'Exam request is too large.');
  const reader = request.body?.getReader();
  if (!reader) throw new ExamError(400,'Invalid exam request.');
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const {done,value} = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY) { await reader.cancel(); throw new ExamError(413,'Exam request is too large.'); }
      chunks.push(value);
    }
    try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
    catch { throw new ExamError(400,'Invalid exam request.'); }
  } finally { reader.releaseLock(); }
}
export async function POST(request: Request) {
  const caller = await authenticateUser(request);
  if ('response' in caller) {
    for (const [key,value] of Object.entries(headers)) caller.response.headers.set(key,value);
    return caller.response;
  }
  try {
    const command = parseExamCommand(await readBody(request));
    return NextResponse.json(await runExamCommand(getAdminDb(),caller.uid,command),{headers});
  } catch (error) {
    if (error instanceof ExamError) return NextResponse.json({error:error.message},{status:error.status,headers});
    console.error('[Exams] Request failed.');
    return NextResponse.json({error:'Exam service is temporarily unavailable. Your saved answers have been kept.'},{status:503,headers});
  }
}
