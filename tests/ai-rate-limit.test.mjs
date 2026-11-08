import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { AsyncLocalStorage } from 'node:async_hooks';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import { NextRequest, NextResponse } from 'next/server.js';

const require = createRequire(import.meta.url);
// Next 16.1 exposes the matcher helper under its former middleware name.
globalThis.AsyncLocalStorage ??= AsyncLocalStorage;
const { unstable_doesMiddlewareMatch: doesProxyMatch } = require('next/experimental/testing/server');
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
function evaluate(path, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(read(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports, Buffer, URL, TextDecoder, AbortController, setTimeout, clearTimeout,
    process: { env: {} }, fetch, console: { warn() {} },
    require(name) {
      if (name === 'next/server') return { NextRequest, NextResponse };
      if (['node:crypto', 'node:net'].includes(name)) return require(name);
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      throw new Error(`Unexpected dependency (Firebase is forbidden): ${name}`);
    },
  });
  return exports;
}
const library = evaluate('src/lib/ai-rate-limit.ts');
const { createAIRateLimiter, normalizeAIClientIP, PUBLIC_AI_PATHS, AI_CLIENT_COOKIE } = library;
const production = {
  NODE_ENV: 'production', VERCEL: '1',
  UPSTASH_REDIS_REST_URL: 'https://fake-redis.example',
  UPSTASH_REDIS_REST_TOKEN: 'test-only-token',
  AI_RATE_LIMIT_SECRET: 'test-only-secret-that-is-at-least-32-bytes',
};
const clock = () => ({ value: 1800000000000 });
function request({ path = '/api/ai/chat', method = 'POST', cookie, ip = '203.0.113.1', headers = {} } = {}) {
  return new NextRequest(`https://test.example${path}`, {
    method, headers: {
      'x-vercel-forwarded-for': ip,
      ...(cookie ? { cookie: `${AI_CLIENT_COOKIE}=${cookie}` } : {}), ...headers,
    },
  });
}
const responseCookie = response => response.cookies.get(AI_CLIENT_COOKIE)?.value;
const passes = response => response.headers.get('x-middleware-next') === '1';

// Shared fake Redis models the atomic EVAL contract, including TTL ownership.
// Two independently loaded limiter modules use the same backing state here.
function fakeRedis(time = clock()) {
  const counters = new Map();
  const calls = [];
  const transport = async (url, options) => {
    const command = JSON.parse(options.body);
    calls.push({ url, options, command });
    assert.equal(command[0], 'EVAL');
    assert.equal(command[1], library.AI_RATE_LIMIT_SCRIPT);
    const size = command[2];
    assert.equal(size, 6);
    const keys = command.slice(3, 3 + size);
    const args = command.slice(3 + size);
    const windows = keys.map((key, i) => ({ key, limit: args[i * 2], ms: args[i * 2 + 1] }));
    for (const [key, entry] of counters) if (entry.expires <= time.value) counters.delete(key);
    const blocked = windows.filter(window => (counters.get(window.key)?.count ?? 0) >= window.limit);
    if (blocked.length) return Response.json({ result: [0, Math.max(...blocked.map(window => Math.max(1, Math.ceil((counters.get(window.key).expires - time.value) / 1000))))] });
    for (const window of windows) {
      const old = counters.get(window.key);
      counters.set(window.key, { count: (old?.count ?? 0) + 1, expires: old?.expires ?? time.value + window.ms });
    }
    return Response.json({ result: [1, 0] });
  };
  return { transport, counters, calls, time };
}
function fixture(overrides = {}) {
  const store = fakeRedis();
  const env = { ...production, ...overrides };
  const limiter = createAIRateLimiter({ env, fetch: store.transport, now: () => store.time.value });
  return { ...store, env, limiter };
}

test('signed quota cookie is separate, secure, opaque and stable across server instances', async () => {
  const f = fixture();
  const first = await f.limiter(request());
  assert.ok(passes(first));
  const cookie = responseCookie(first);
  assert.match(cookie, /^[a-f0-9]{32}\.\d{10}\.[a-f0-9]{64}$/);
  const header = first.headers.get('set-cookie');
  for (const flag of ['HttpOnly', 'Secure', 'SameSite=lax', 'Path=/', 'Max-Age=86400']) assert.ok(header.includes(flag), header);
  const otherModule = evaluate('src/lib/ai-rate-limit.ts');
  const secondLimiter = otherModule.createAIRateLimiter({ env: f.env, fetch: f.transport, now: () => f.time.value });
  assert.ok(passes(await secondLimiter(request({ cookie }))));
  assert.equal(f.calls[0].command[3], f.calls[1].command[3]);
  assert.equal(f.counters.get(f.calls[0].command[3]).count, 2);
  assert.equal(f.calls[0].options.cache, 'no-store');
  assert.equal(f.calls[0].options.headers.Authorization, `Bearer ${production.UPSTASH_REDIS_REST_TOKEN}`);
  assert.equal(first.headers.get('cache-control'), 'no-store');
});

test('client quota is shared by all nine endpoints and returns a positive Retry-After', async () => {
  const f = fixture({ AI_LIMIT_CLIENT_MINUTE: '2' });
  const cookie = responseCookie(await f.limiter(request()));
  assert.ok(passes(await f.limiter(request({ cookie, path: '/api/c-ai-generate' }))));
  const snapshot = JSON.stringify([...f.counters]);
  f.time.value += 1000;
  const denied = await f.limiter(request({ cookie, path: '/api/evaluate-task' }));
  assert.equal(denied.status, 429);
  assert.equal(denied.headers.get('retry-after'), '59');
  assert.match((await denied.json()).error, /59 seconds/);
  assert.equal(JSON.stringify([...f.counters]), snapshot, 'denials must not increment or extend counters');
  f.time.value += 59000;
  assert.ok(passes(await f.limiter(request({ cookie }))));
});

for (const [name, variable, seconds] of [
  ['client hour', 'AI_LIMIT_CLIENT_HOUR', 3600],
  ['network minute', 'AI_LIMIT_IP_MINUTE', 60],
  ['network hour', 'AI_LIMIT_IP_HOUR', 3600],
  ['global minute', 'AI_LIMIT_GLOBAL_MINUTE', 60],
  ['global day', 'AI_LIMIT_GLOBAL_DAY', 86400],
]) {
  test(`${name} cap is enforced even when other windows allow requests`, async () => {
    const f = fixture({ [variable]: '1' });
    const cookie = responseCookie(await f.limiter(request()));
    const denied = await f.limiter(request({ cookie: name.startsWith('client') ? cookie : undefined, ip: name.startsWith('global') ? '203.0.113.2' : '203.0.113.1' }));
    assert.equal(denied.status, 429);
    assert.equal(denied.headers.get('retry-after'), String(seconds));
  });
}

test('different guests on shared Wi-Fi have independent browser limits', async () => {
  const f = fixture({ AI_LIMIT_CLIENT_MINUTE: '1', AI_LIMIT_IP_MINUTE: '3' });
  const first = await f.limiter(request());
  assert.equal((await f.limiter(request({ cookie: responseCookie(first) }))).status, 429);
  assert.ok(passes(await f.limiter(request())));
  assert.ok(passes(await f.limiter(request())));
  assert.equal((await f.limiter(request())).status, 429);
});

test('concurrent requests across independent instances cannot overrun shared quota', async () => {
  const f = fixture({ AI_LIMIT_GLOBAL_MINUTE: '4' });
  const other = createAIRateLimiter({ env: f.env, fetch: f.transport, now: () => f.time.value });
  const replies = await Promise.all(Array.from({ length: 20 }, (_, i) => (i % 2 ? other : f.limiter)(request({ ip: `203.0.113.${i + 1}` }))));
  assert.equal(replies.filter(passes).length, 4);
  assert.equal(replies.filter(reply => reply.status === 429).length, 16);
});

test('tampered or expired cookies receive a fresh identity without changing auth cookies', async () => {
  const f = fixture();
  const cookie = responseCookie(await f.limiter(request()));
  const forged = cookie.slice(0, -1) + (cookie.endsWith('0') ? '1' : '0');
  assert.notEqual(responseCookie(await f.limiter(request({ cookie: forged }))), cookie);
  f.time.value += 86400000;
  assert.notEqual(responseCookie(await f.limiter(request({ cookie }))), cookie);
  const response = await f.limiter(request({ headers: { cookie: 'session=existing-user-session; firebase=untouched' } }));
  assert.ok(passes(response));
  assert.ok(!response.headers.get('set-cookie').includes('session='));
  assert.ok(!response.headers.get('set-cookie').includes('firebase='));
});

test('store receives only hashed identities and TTL counters', async () => {
  const f = fixture();
  const response = await f.limiter(request());
  const command = f.calls[0].command;
  const keys = command.slice(3, 9);
  assert.ok(keys.every(key => key.includes(':{ai}:')));
  assert.match(keys[0], /client-minute:[a-f0-9]{64}$/);
  assert.match(keys[2], /ip-minute:[a-f0-9]{64}$/);
  const payload = JSON.stringify(command);
  assert.ok(!payload.includes('203.0.113.1'));
  assert.ok(!payload.includes(responseCookie(response).split('.')[0]));
  assert.ok(!payload.includes(production.AI_RATE_LIMIT_SECRET));
});

for (const [input, expected] of [
  ['192.0.2.3', '192.0.2.3'],
  ['::ffff:192.0.2.3', '192.0.2.3'],
  ['0:0:0:0:0:ffff:c000:203', '192.0.2.3'],
  ['2001:db8:1234:5678::1', '2001:0db8:1234:5678::/64'],
  ['2001:0db8:1234:5678:abcd:0:0:2', '2001:0db8:1234:5678::/64'],
  ['::1', '0000:0000:0000:0000::/64'],
  ['1.2.3.4, 5.6.7.8', null], ['garbage', null], ['fe80::1%eth0', null], ['999.2.3.4', null],
]) {
  test(`trusted IP normalization: ${input}`, () => assert.equal(normalizeAIClientIP(input), expected));
}

test('spoofed forwarded headers cannot change Vercel network quota', async () => {
  const f = fixture({ AI_LIMIT_IP_MINUTE: '1' });
  assert.ok(passes(await f.limiter(request({ headers: { 'x-forwarded-for': '1.1.1.1' } }))));
  assert.equal((await f.limiter(request({ headers: { 'x-forwarded-for': '8.8.8.8' } }))).status, 429);
  assert.equal((await f.limiter(request({ ip: '', headers: { 'x-forwarded-for': '1.1.1.1' } }))).status, 503);
});

test('non-Vercel production requires an explicitly trusted proxy header', async () => {
  const f = fixture({ VERCEL: undefined });
  assert.equal((await f.limiter(request())).status, 503);
  const custom = fixture({ VERCEL: undefined, AI_RATE_LIMIT_TRUSTED_IP_HEADER: 'x-trusted-client-ip' });
  assert.ok(passes(await custom.limiter(request({ headers: { 'x-trusted-client-ip': '192.0.2.4' } }))));
});

for (const [name, overrides] of [
  ['missing Redis', { UPSTASH_REDIS_REST_URL: undefined, UPSTASH_REDIS_REST_TOKEN: undefined }],
  ['partial Redis', { UPSTASH_REDIS_REST_TOKEN: undefined }],
  ['missing secret', { AI_RATE_LIMIT_SECRET: undefined }],
  ['short secret', { AI_RATE_LIMIT_SECRET: 'short' }],
  ['HTTP store', { UPSTASH_REDIS_REST_URL: 'http://fake-redis.example' }],
  ['URL credentials', { UPSTASH_REDIS_REST_URL: 'https://user:password@fake-redis.example' }],
  ['URL query token', { UPSTASH_REDIS_REST_URL: 'https://fake-redis.example?token=secret' }],
  ['unsafe prefix', { AI_RATE_LIMIT_PREFIX: 'other:{slot}' }],
  ['zero quota', { AI_LIMIT_CLIENT_MINUTE: '0' }],
  ['invalid quota', { AI_LIMIT_GLOBAL_DAY: 'NaN' }],
]) {
  test(`production fails closed for ${name}`, async () => {
    const f = fixture(overrides);
    const response = await f.limiter(request());
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('retry-after'), '30');
    assert.equal(f.calls.length, 0);
    const body = JSON.stringify(await response.json());
    assert.ok(!body.includes('secret') && !body.includes('token'));
  });
}

test('Vercel preview never silently uses development memory', async () => {
  const limiter = createAIRateLimiter({ env: { NODE_ENV: 'development', VERCEL: '1' } });
  assert.equal((await limiter(request())).status, 503);
});

test('Vercel Marketplace variables work without copying sensitive credentials', async () => {
  const f = fixture({
    UPSTASH_REDIS_REST_URL: undefined, UPSTASH_REDIS_REST_TOKEN: undefined,
    UPSTASH_REDIS_KV_REST_API_URL: 'https://marketplace-redis.example',
    UPSTASH_REDIS_KV_REST_API_TOKEN: 'marketplace-test-only-token',
  });
  assert.ok(passes(await f.limiter(request())));
  assert.equal(f.calls[0].url, 'https://marketplace-redis.example');
  assert.equal(f.calls[0].options.headers.Authorization, 'Bearer marketplace-test-only-token');
});

test('explicit Redis configuration takes precedence over the Marketplace pair', async () => {
  const f = fixture({
    UPSTASH_REDIS_KV_REST_API_URL: 'https://other-redis.example',
    UPSTASH_REDIS_KV_REST_API_TOKEN: 'other-test-only-token',
  });
  assert.ok(passes(await f.limiter(request())));
  assert.equal(f.calls[0].url, production.UPSTASH_REDIS_REST_URL);
  assert.equal(f.calls[0].options.headers.Authorization, `Bearer ${production.UPSTASH_REDIS_REST_TOKEN}`);
});

for (const missing of ['UPSTASH_REDIS_KV_REST_API_URL', 'UPSTASH_REDIS_KV_REST_API_TOKEN']) {
  test(`partial Marketplace configuration fails closed: ${missing}`, async () => {
    const f = fixture({
      UPSTASH_REDIS_REST_URL: undefined, UPSTASH_REDIS_REST_TOKEN: undefined,
      UPSTASH_REDIS_KV_REST_API_URL: 'https://marketplace-redis.example',
      UPSTASH_REDIS_KV_REST_API_TOKEN: 'marketplace-test-only-token', [missing]: undefined,
    });
    assert.equal((await f.limiter(request())).status, 503);
    assert.equal(f.calls.length, 0);
  });
}

test('an incomplete explicit override never borrows the Marketplace token', async () => {
  const f = fixture({
    UPSTASH_REDIS_REST_TOKEN: undefined,
    UPSTASH_REDIS_KV_REST_API_URL: 'https://marketplace-redis.example',
    UPSTASH_REDIS_KV_REST_API_TOKEN: 'marketplace-test-only-token',
  });
  assert.equal((await f.limiter(request())).status, 503);
  assert.equal(f.calls.length, 0);
});

for (const [name, transport] of [
  ['network error', async () => { throw new Error('sensitive provider details'); }],
  ['HTTP failure', async () => Response.json({ error: 'sensitive provider details' }, { status: 401 })],
  ['provider error', async () => Response.json({ error: 'sensitive provider details' })],
  ['malformed result', async () => Response.json({ result: [0, 0] })],
  ['invalid result type', async () => Response.json({ result: ['1', 0] })],
  ['oversized response', async () => new Response('x'.repeat(8193))],
  ['hanging transport', async () => new Promise(() => {})],
  ['hanging body', async () => new Response(new ReadableStream({ start() {} }))],
]) {
  test(`store ${name} fails closed with bounded deadline`, async () => {
    const limiter = createAIRateLimiter({ env: production, fetch: transport, storeTimeoutMs: 25 });
    const start = Date.now();
    const response = await limiter(request());
    assert.equal(response.status, 503);
    assert.ok(Date.now() - start < 1000);
    assert.ok(!JSON.stringify(await response.json()).includes('sensitive provider details'));
  });
}

test('development memory enforces quotas, expires windows, and is explicitly labeled', async () => {
  const time = clock();
  const limiter = createAIRateLimiter({ env: { NODE_ENV: 'development', AI_LIMIT_CLIENT_MINUTE: '1' }, now: () => time.value });
  const first = await limiter(request());
  assert.ok(passes(first));
  assert.equal(first.headers.get('x-ai-ratelimit-store'), 'development-memory');
  const cookie = responseCookie(first);
  assert.equal((await limiter(request({ cookie }))).status, 429);
  time.value += 60000;
  assert.ok(passes(await limiter(request({ cookie }))));
});

test('configured development Redis failure never falls back to memory', async () => {
  const limiter = createAIRateLimiter({ env: { ...production, NODE_ENV: 'development', VERCEL: undefined }, fetch: async () => { throw new Error('offline'); } });
  assert.equal((await limiter(request())).status, 503);
});

test('proxy matcher covers every public AI route, including trailing slash', () => {
  const { config } = evaluate('src/proxy.ts', { '@/lib/ai-rate-limit': { createAIRateLimiter: () => () => {} } });
  assert.equal(config.matcher.length, PUBLIC_AI_PATHS.size);
  for (const path of PUBLIC_AI_PATHS) {
    for (const suffix of ['', '/']) assert.ok(doesProxyMatch({ config, nextConfig: {}, url: `https://test.example${path}${suffix}` }), path + suffix);
  }
  for (const path of ['/api/html-tasks', '/api/admin-delete', '/login', '/api/auth/login', '/api/profiles', '/api/results', '/api/ai/chat/extra']) {
    assert.ok(!doesProxyMatch({ config, nextConfig: {}, url: `https://test.example${path}` }), path);
  }
});

test('non-AI routes and non-POST methods bypass even broken rate limit configuration', async () => {
  const limiter = createAIRateLimiter({ env: { NODE_ENV: 'production' }, fetch: async () => { throw new Error('must not be called'); } });
  for (const path of ['/api/html-tasks', '/api/admin-delete', '/login', '/api/profiles', '/api/results']) {
    assert.ok(passes(await limiter(request({ path }))));
  }
  for (const method of ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE']) assert.ok(passes(await limiter(request({ method }))));
});

test('actual proxy export stops rejected requests before mocked provider/data handlers', async () => {
  const f = fixture({ AI_LIMIT_GLOBAL_MINUTE: '1' });
  const { proxy } = evaluate('src/proxy.ts', { '@/lib/ai-rate-limit': { createAIRateLimiter: () => f.limiter } });
  let handlerCalls = 0;
  const dispatch = async () => {
    const response = await proxy(request());
    if (passes(response)) handlerCalls++;
    return response;
  };
  assert.ok(passes(await dispatch()));
  assert.equal((await dispatch()).status, 429);
  assert.equal(handlerCalls, 1);
  f.env.UPSTASH_REDIS_REST_TOKEN = undefined;
  assert.equal((await dispatch()).status, 503);
  assert.equal(handlerCalls, 1);
});
