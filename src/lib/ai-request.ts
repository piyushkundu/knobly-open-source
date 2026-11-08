import { NextResponse } from 'next/server';
import { AI_LIMITS } from '@/lib/ai-limits';
export { AI_LIMITS } from '@/lib/ai-limits';

export class AIRequestError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'AIRequestError';
  }
}

// Bound the whole operation, not just the time until fetch response headers.
async function withDeadline<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  milliseconds: number,
  signals: (AbortSignal | null | undefined)[],
  timeout: AIRequestError,
): Promise<T> {
  if (milliseconds <= 0) throw timeout;
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let onAbort: () => void = () => {};
  const cancellation = new Promise<never>((_, reject) => {
    onAbort = () => {
      reject(new AIRequestError(408, 'Request cancelled. Please try again.'));
      controller.abort();
    };
    for (const signal of signals) {
      signal?.addEventListener('abort', onAbort, { once: true });
    }
    if (signals.some(signal => signal?.aborted)) { onAbort(); return; }
    timer = setTimeout(() => { reject(timeout); controller.abort(); }, milliseconds);
  });
  try {
    if (controller.signal.aborted) return await cancellation;
    return await Promise.race([cancellation, operation(controller.signal)]);
  } finally {
    clearTimeout(timer);
    for (const signal of signals) signal?.removeEventListener('abort', onAbort);
  }
}

async function readBytes(stream: ReadableStream<Uint8Array> | null, limit: number, signal: AbortSignal, tooLarge: AIRequestError): Promise<Uint8Array<ArrayBuffer>> {
  if (!stream) return new Uint8Array();
  const reader = stream.getReader();
  const cancel = () => { void reader.cancel().catch(() => {}); };
  signal.addEventListener('abort', cancel, { once: true });
  let complete = false;
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      signal.throwIfAborted();
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) throw tooLarge;
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    complete = true;
    return bytes;
  } finally {
    signal.removeEventListener('abort', cancel);
    if (!complete) cancel();
    reader.releaseLock();
  }
}

export async function readAIRequest(request: Request): Promise<Record<string, unknown>> {
  const mediaType = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  if (mediaType !== 'application/json') throw new AIRequestError(415, 'Send the request as application/json.');
  const declaredLength = request.headers.get('content-length');
  if (declaredLength && Number(declaredLength) > AI_LIMITS.bodyBytes) {
    void request.body?.cancel().catch(() => {});
    throw new AIRequestError(413, 'Request is too large. Please shorten your input.');
  }
  const bytes = await withDeadline(
    signal => readBytes(request.body, AI_LIMITS.bodyBytes, signal, new AIRequestError(413, 'Request is too large. Please shorten your input.')),
    10000, [request.signal], new AIRequestError(408, 'Request body timed out. Please try again.'),
  );
  let body: unknown;
  try { body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new AIRequestError(400, 'Invalid JSON request.'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new AIRequestError(400, 'Send a JSON object.');
  return body as Record<string, unknown>;
}

export function aiText(body: Record<string, unknown>, field: string, maxLength: number, options: { optional?: boolean; allowEmpty?: boolean } = {}): string {
  const value = body[field];
  if (value === undefined && options.optional) return '';
  if (typeof value !== 'string' || (!options.allowEmpty && !value.trim())) {
    throw new AIRequestError(400, `${field} must be ${options.allowEmpty ? 'text' : 'non-empty text'}.`);
  }
  if (value.length > maxLength) throw new AIRequestError(413, `${field} is too long (maximum ${maxLength} characters).`);
  return value;
}

export function aiChoice<const T extends readonly string[]>(body: Record<string, unknown>, field: string, allowed: T, fallback: T[number]): T[number] {
  const value = body[field] === undefined ? fallback : body[field];
  if (typeof value !== 'string' || !allowed.includes(value)) throw new AIRequestError(400, `Invalid ${field}.`);
  return value as T[number];
}

export function aiChatMessages(body: Record<string, unknown>): { role: 'user' | 'assistant'; content: string }[] {
  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) throw new AIRequestError(400, 'messages must be a non-empty list.');
  if (messages.length > AI_LIMITS.chatMessages) throw new AIRequestError(413, `Send at most ${AI_LIMITS.chatMessages} chat messages.`);
  let total = 0;
  const validated = messages.map(message => {
    if (!message || typeof message !== 'object' || Array.isArray(message)) throw new AIRequestError(400, 'Invalid chat message.');
    const role = aiChoice(message, 'role', ['user', 'assistant'] as const, 'user');
    // Require explicit roles; strip every property except validated role/content.
    if (message.role === undefined) throw new AIRequestError(400, 'Chat message role is required.');
    const content = aiText(message, 'content', AI_LIMITS.chatMessage, { allowEmpty: role === 'assistant' });
    total += content.length;
    return { role, content };
  });
  if (total > AI_LIMITS.chatTotal) throw new AIRequestError(413, 'Chat history is too long. Please start a shorter conversation.');
  if (validated[validated.length - 1].role !== 'user') throw new AIRequestError(400, 'The last chat message must be from the user.');
  return validated;
}

export function aiOptions(body: Record<string, unknown>): string[] {
  if (body.options === undefined) return [];
  if (!Array.isArray(body.options)) throw new AIRequestError(400, 'options must be a list of text values.');
  if (body.options.length > AI_LIMITS.options) throw new AIRequestError(413, 'Too many answer options.');
  return body.options.map(option => aiText({ option }, 'option', AI_LIMITS.option));
}

export interface AIClient {
  fetch(url: string, options: RequestInit, attemptMs?: number): Promise<Response>;
}

export function createAIClient(signal?: AbortSignal, limits: { totalMs?: number; attemptMs?: number } = {}): AIClient {
  const deadline = Date.now() + (limits.totalMs ?? 30000);
  return {
    async fetch(url, options, attemptMs = limits.attemptMs ?? 15000) {
      try {
        return await withDeadline(async attemptSignal => {
          const response = await fetch(url, { ...options, signal: attemptSignal });
          const bytes = await readBytes(response.body, 512 * 1024, attemptSignal,
            new AIRequestError(502, 'AI response was too large. Please try again.'));
          return new Response(response.body === null ? null : bytes, {
            status: response.status, statusText: response.statusText, headers: response.headers,
          });
        }, Math.min(attemptMs, deadline - Date.now()), [signal, options.signal],
        new AIRequestError(504, 'AI response timed out. Please try again.'));
      } catch (error) {
        if (error instanceof AIRequestError) throw error;
        throw new AIRequestError(502, 'AI service is temporarily unavailable. Please try again.');
      }
    },
  };
}

export function aiErrorResponse(error: unknown): NextResponse {
  return error instanceof AIRequestError
    ? NextResponse.json({ error: error.message }, { status: error.status })
    : NextResponse.json({ error: 'AI service is temporarily unavailable. Please try again.' }, { status: 502 });
}
