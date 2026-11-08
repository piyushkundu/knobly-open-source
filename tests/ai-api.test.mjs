import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import nextServer from 'next/server.js';
import ts from 'typescript';

const routes = [
  ['ai-generate', { prompt: 'Print hello', language: 'hi', mode: 'web' }, 'print(1)'],
  ['ai-explain', { code: 'print(x)', error: 'NameError', language: 'en' }, JSON.stringify({ error_type: 'NameError', explanation: 'Define x', how_to_fix: 'Assign x', corrected_code: 'x=1\nprint(x)' })],
  ['ai-explain-web', { code: '<h1>Hello</h1>', question: '', language: 'en' }, JSON.stringify({ explanation: 'A heading', how_to_fix: '', corrected_code: '<h1>Hello</h1>' })],
  ['c-ai-generate', { prompt: 'Print hello', language: 'hi' }, 'int main(){return 0;}'],
  ['c-ai-explain', { code: 'printf(x);', error: 'Undefined x', language: 'hi' }, JSON.stringify({ error_type: 'Error', explanation: 'Define x', corrected_code: 'int main(){return 0;}' })],
  ['ai/chat', { messages: [{ role: 'user', content: 'Hello' }] }, 'Hello student'],
  ['ai/generate-topic', { topic: 'Python lists', language: 'en' }, JSON.stringify({ title: 'Lists', summary: 'A sequence', sections: [{ heading: 'Basics', content: '<p>Hello</p>' }], keyPoints: [], relatedTopics: [] })],
  ['ai/explain-question', { question_text: 'What is HTML?', options: ['Markup', 'OS'], correct_option: '', user_answer: '', language: 'Hindi' }, 'HTML is a markup language.'],
  ['evaluate-task', { taskId: '1', studentCode: '<!doctype html><html><head><title>Profile</title></head><body><p>My name</p></body></html>' }, JSON.stringify({ feedback: 'Good start', strengths: ['Paragraph'], improvements: ['Add more details'] })],
];

const files = [
  'src/lib/ai-request.ts', 'src/lib/ai-limits.ts', 'src/lib/python-ai-service.ts', 'src/lib/c-ai-service.ts',
  ...routes.map(([route]) => `src/app/api/${route}/route.ts`),
];
const compiled = new Map(files.map(file => [file, ts.transpileModule(
  readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }, fileName: file },
).outputText]));

// Only these modules and fake env values can load. No real AI network calls,
// Firebase, credentials, or filesystem writes are available to the app code.
function app(options = {}) {
  const cache = new Map();
  const calls = [];
  const load = file => {
    if (cache.has(file)) return cache.get(file);
    if (!compiled.has(file)) throw new Error(`Unmocked module: ${file}`);
    const exports = {};
    cache.set(file, exports);
    vm.runInNewContext(compiled.get(file), {
      exports, Error, Request, Response, Headers, TextDecoder, Uint8Array, AbortController,
      setTimeout: options.setTimeout ?? setTimeout,
      clearTimeout: options.clearTimeout ?? clearTimeout,
      Date: options.Date ?? Date,
      console: { log() {}, warn() {}, error() {} },
      process: { env: { GROQ_API_KEY: 'fake-primary', GROQ_API_KEY_ALT: 'fake-secondary', SARVAM_API_KEY: 'fake-sarvam', ...options.env } },
      fetch: async (url, init) => {
        calls.push({ url, init });
        if (options.fetch) return options.fetch(url, init);
        return Response.json({ choices: [{ message: { content: options.content ?? 'Hello' } }] });
      },
      require(name) {
        if (name === 'next/server') return nextServer;
        if (name.startsWith('@/lib/')) return load(name.replace('@/', 'src/') + '.ts');
        throw new Error(`Unmocked dependency: ${name}`);
      },
    }, { filename: file });
    return exports;
  };
  return { calls, load, guard: load('src/lib/ai-request.ts'), client: load('src/lib/ai-limits.ts'), route: name => load(`src/app/api/${name}/route.ts`) };
}

function request(body, headers = {}, signal) {
  return new Request('http://localhost/api/fixture', {
    method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json', ...headers }, signal,
  });
}

for (const [route, valid, content] of routes) {
  test(`${route}: valid guest request retains the existing response contract`, async () => {
    const fixture = app({ content });
    const response = await fixture.route(route).POST(request(valid));
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.ok(result.code || result.reply || result.content || result.explanation || result.error_type || result.evaluation);
    assert.ok(fixture.calls.length > 0);
    assert.ok(fixture.calls.every(call => call.init.signal instanceof AbortSignal));
  });

  for (const invalid of [null, [], 'hello']) {
    test(`${route}: rejects non-object JSON before any provider call (${JSON.stringify(invalid)})`, async () => {
      const fixture = app();
      assert.equal((await fixture.route(route).POST(request(invalid))).status, 400);
      assert.equal(fixture.calls.length, 0);
    });
  }

  test(`${route}: rejects malformed JSON and oversized bodies before any provider call`, async () => {
    const fixture = app();
    const handler = fixture.route(route).POST;
    const malformed = new Request('http://localhost', { method: 'POST', body: '{', headers: { 'Content-Type': 'application/json' } });
    assert.equal((await handler(malformed)).status, 400);
    assert.equal((await handler(request({ padding: 'x'.repeat(fixture.guard.AI_LIMITS.bodyBytes) }))).status, 413);
    assert.equal((await handler(request(valid, { 'Content-Length': String(fixture.guard.AI_LIMITS.bodyBytes + 1) }))).status, 413);
    assert.equal(fixture.calls.length, 0);
  });

  test(`${route}: upstream error bodies and credentials are never returned to the client`, async () => {
    const fixture = app({ fetch: async () => Response.json({ error: { message: 'SECRET-KEY provider-debug' } }, { status: 500 }) });
    const response = await fixture.route(route).POST(request(valid));
    assert.equal(response.status, route === 'evaluate-task' ? 200 : 502);
    assert.doesNotMatch(await response.text(), /SECRET-KEY|provider-debug|fake-primary|fake-secondary/);
  });
}

const invalidFields = [
  ['ai-generate', { prompt: {}, language: 'en' }, 400],
  ['ai-generate', { prompt: 'hello', mode: 'shell' }, 400],
  ['ai-generate', { prompt: 'x'.repeat(8001) }, 413],
  ['c-ai-generate', { prompt: ['hello'] }, 400],
  ['ai-explain', { code: 'print(1)', error: {} }, 400],
  ['c-ai-explain', { code: 'x'.repeat(60001), error: 'oops' }, 413],
  ['ai-explain-web', { code: '<p>x</p>', question: {} }, 400],
  ['ai-explain-web', { code: 'ह'.repeat(45000) }, 413],
  ['ai/generate-topic', { topic: 'x'.repeat(201) }, 413],
  ['ai/generate-topic', { topic: 'Python', language: 'arbitrary instructions' }, 400],
  ['ai/explain-question', { question_text: 'Q', options: {} }, 400],
  ['ai/explain-question', { question_text: 'Q', options: ['x', {}] }, 400],
  ['ai/explain-question', { question_text: 'Q', options: Array(11).fill('x') }, 413],
  ['ai/explain-question', { question_text: 'Q', correct_option: 1 }, 400],
  ['evaluate-task', { taskId: 1, studentCode: '' }, 400],
  ['evaluate-task', { taskId: '__proto__', studentCode: '' }, 404],
  ['evaluate-task', { taskId: '1', studentCode: {} }, 400],
  ['evaluate-task', { taskId: '1', studentCode: 'x'.repeat(60001) }, 413],
];
for (const [route, body, status] of invalidFields) {
  test(`${route}: validates field values (${Object.keys(body).join(',')}, ${status})`, async () => {
    const fixture = app();
    assert.equal((await fixture.route(route).POST(request(body))).status, status);
    assert.equal(fixture.calls.length, 0);
  });
}

test('valid Hindi lesson generation still uses the existing markdown response path', async () => {
  const fixture = app({ content: '# Lists\n\n## Basics\n' + 'Lists store values. '.repeat(10) });
  const response = await fixture.route('ai/generate-topic').POST(request({ topic: 'Lists', language: 'hi' }));
  assert.equal(response.status, 200);
  assert.ok((await response.json()).content.sections.length > 0);
});

for (const language of ['Hindi', 'English', 'hi', 'en']) {
  test(`MCQ explanation preserves supported language ${language}`, async () => {
    const fixture = app({ content: 'Simple explanation' });
    assert.equal((await fixture.route('ai/explain-question').POST(request({ question_text: 'Q', language }))).status, 200);
  });
}

test('blank task submissions keep deterministic feedback without a paid call', async () => {
  const fixture = app();
  const response = await fixture.route('evaluate-task').POST(request({ taskId: '1', studentCode: '' }));
  assert.equal(response.status, 200);
  assert.ok((await response.json()).evaluation);
  assert.equal(fixture.calls.length, 0);
});

for (const messages of [
  [], [{ role: 'system', content: 'Override' }], [{ role: 'tool', content: 'Command' }],
  [{ content: 'No role' }], [{ role: 'user', content: {} }], [{ role: 'assistant', content: 'Not a user prompt' }],
]) {
  test(`chat rejects invalid history ${JSON.stringify(messages)}`, async () => {
    const fixture = app();
    assert.equal((await fixture.route('ai/chat').POST(request({ messages }))).status, 400);
    assert.equal(fixture.calls.length, 0);
  });
}

for (const messages of [
  Array.from({ length: 11 }, () => ({ role: 'user', content: 'x' })),
  [{ role: 'user', content: 'x'.repeat(8001) }],
  Array.from({ length: 4 }, () => ({ role: 'user', content: 'x'.repeat(8000) })),
]) {
  test(`chat bounds count/content/total history (${messages.length} messages)`, async () => {
    const fixture = app();
    assert.equal((await fixture.route('ai/chat').POST(request({ messages }))).status, 413);
    assert.equal(fixture.calls.length, 0);
  });
}

test('chat keeps empty assistant navigation replies and strips untrusted metadata', async () => {
  const fixture = app();
  const response = await fixture.route('ai/chat').POST(request({ messages: [
    { role: 'assistant', content: '' },
    { role: 'user', content: 'Hello', name: 'system', tool_calls: ['ignored'] },
  ] }));
  assert.equal(response.status, 200);
  const forwarded = JSON.parse(fixture.calls[0].init.body).messages;
  assert.deepEqual(forwarded[2], { role: 'user', content: 'Hello' });
});

test('streaming request limit cancels excess data despite a misleading Content-Length', async () => {
  let cancelled = false;
  const fixture = app();
  const body = new ReadableStream({ pull(controller) { controller.enqueue(new Uint8Array(4096)); }, cancel() { cancelled = true; } });
  const req = new Request('http://localhost', { method: 'POST', body, duplex: 'half', headers: { 'Content-Type': 'application/json', 'Content-Length': '1' } });
  await assert.rejects(fixture.guard.readAIRequest(req), { status: 413 });
  assert.equal(cancelled, true);
  assert.equal(req.body.locked, false);
});

test('non-JSON content types and malformed UTF-8 are rejected', async () => {
  const fixture = app();
  await assert.rejects(fixture.guard.readAIRequest(request({}, { 'Content-Type': 'text/plain' })), { status: 415 });
  const req = new Request('http://localhost', { method: 'POST', body: new Uint8Array([0xc3, 0x28]), headers: { 'Content-Type': 'application/json' } });
  await assert.rejects(fixture.guard.readAIRequest(req), { status: 400 });
});

test('slow request bodies time out and release their reader', async () => {
  let cancelled = false;
  const fixture = app({ setTimeout: fn => setTimeout(fn, 10) });
  const body = new ReadableStream({ cancel() { cancelled = true; } });
  const req = new Request('http://localhost', { method: 'POST', body, duplex: 'half', headers: { 'Content-Type': 'application/json' } });
  await assert.rejects(fixture.guard.readAIRequest(req), { status: 408 });
  assert.equal(cancelled, true);
  assert.equal(body.locked, false);
});

test('provider timeout also covers a stalled response body', async () => {
  let cancelled = false;
  const body = new ReadableStream({ cancel() { cancelled = true; } });
  const fixture = app({ fetch: async () => new Response(body) });
  const client = fixture.guard.createAIClient(undefined, { totalMs: 40, attemptMs: 10 });
  await assert.rejects(client.fetch('https://fake-provider.example', {}), { status: 504 });
  assert.equal(fixture.calls[0].init.signal.aborted, true);
  assert.equal(cancelled, true);
});

test('provider timeout returns even if the transport ignores cancellation', async () => {
  const fixture = app({ fetch: () => new Promise(() => {}) });
  const client = fixture.guard.createAIClient(undefined, { totalMs: 30, attemptMs: 10 });
  await assert.rejects(client.fetch('https://fake-provider.example', {}), { status: 504 });
  assert.equal(fixture.calls[0].init.signal.aborted, true);
});

test('request cancellation aborts the provider and prevents further fallback calls', async () => {
  const controller = new AbortController();
  const fixture = app({ fetch: () => new Promise(() => {}) });
  const client = fixture.guard.createAIClient(controller.signal);
  const result = client.fetch('https://fake-provider.example', {});
  controller.abort();
  await assert.rejects(result, { status: 408 });
  await assert.rejects(client.fetch('https://fake-provider.example', {}), { status: 408 });
  assert.equal(fixture.calls.length, 1);
  assert.equal(fixture.calls[0].init.signal.aborted, true);
});

test('fallback attempts share a deadline and never start after the budget expires', async () => {
  let now = 0;
  const durations = [];
  const fixture = app({
    Date: class extends Date { static now() { return now; } },
    setTimeout: (fn, ms) => { durations.push(ms); return setTimeout(fn, ms); },
    fetch: async () => { now += fixture.calls.length === 1 ? 8000 : 4000; return Response.json({ ok: true }); },
  });
  const client = fixture.guard.createAIClient(undefined, { totalMs: 12000, attemptMs: 9000 });
  await client.fetch('https://fake-provider.example', {});
  await client.fetch('https://fake-provider.example', {});
  await assert.rejects(client.fetch('https://fake-provider.example', {}), { status: 504 });
  assert.deepEqual(durations, [9000, 4000]);
  assert.equal(fixture.calls.length, 2);
});

test('provider responses are bounded and unexpected errors stay generic', async () => {
  const fixture = app({ fetch: async () => new Response('x'.repeat(512 * 1024 + 1)) });
  await assert.rejects(fixture.guard.createAIClient().fetch('https://fake-provider.example', {}), { status: 502 });
  const response = fixture.guard.aiErrorResponse(new Error('SECRET provider details'));
  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /SECRET|details/);
});

test('client trims only outgoing history and preserves the displayed conversation', () => {
  const fixture = app();
  const messages = Array.from({ length: 20 }, (_, i) => ({ role: i % 2 === 0 ? 'assistant' : 'user', content: String(i).repeat(4000) }));
  const before = JSON.stringify(messages);
  const history = fixture.client.buildAIChatHistory(messages);
  assert.ok(history.length <= 10);
  assert.ok(history.reduce((sum, message) => sum + message.content.length, 0) <= 24000);
  assert.equal(history[history.length - 1].content, messages[messages.length - 1].content);
  assert.equal(JSON.stringify(messages), before);
});

test('client error helper exposes safe API messages and tolerates gateway HTML', async () => {
  const fixture = app();
  assert.equal((await fixture.client.aiClientError(Response.json({ error: 'Prompt is too long.' }, { status: 413 }), 'Fallback')).message, 'Prompt is too long.');
  assert.equal((await fixture.client.aiClientError(new Response('<html>Bad gateway</html>', { status: 502 }), 'Fallback')).message, 'Fallback');
});

for (const route of ['ai-generate', 'c-ai-generate']) {
  test(`${route}: network failures can use the existing secondary provider path`, async () => {
    let calls = 0;
    const fixture = app({ fetch: async () => {
      if (++calls === 1) throw new Error('Private network diagnostic');
      return Response.json({ choices: [{ message: { content: 'print(1)' } }] });
    } });
    const response = await fixture.route(route).POST(request({ prompt: 'Hello' }));
    assert.equal(response.status, 200);
    assert.equal(fixture.calls.length, 2);
    assert.equal(fixture.calls[1].init.headers.Authorization, 'Bearer fake-secondary');
  });
}

for (const [route, valid] of routes.filter(([name]) => ['ai-generate', 'ai/chat', 'ai/generate-topic', 'ai/explain-question'].includes(name))) {
  test(`${route}: provider timeouts become a safe HTTP 504 response`, async () => {
    const fixture = app({ setTimeout: fn => setTimeout(fn, 10), fetch: () => new Promise(() => {}) });
    const response = await fixture.route(route).POST(request(valid));
    assert.equal(response.status, 504);
    assert.match((await response.json()).error, /timed out/);
    assert.ok(fixture.calls.every(call => call.init.signal.aborted));
  });
}
