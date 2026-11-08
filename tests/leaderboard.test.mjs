import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as crypto from 'node:crypto';
import nextServer from 'next/server.js';

function load(file, dependencies, globals = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../' + file, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports, Request, Response, Headers, Date, console,
    process: { env: {} }, require(name) {
      assert.ok(Object.hasOwn(dependencies, name), 'Unexpected dependency: ' + name); return dependencies[name];
    }, ...globals }, { filename: file });
  return exports;
}
const plain = value => JSON.parse(JSON.stringify(value));
const fixture = {
  exam_user_state: [
    { id: 's1', user_id: 'uid-a-secret', total_points: 800, current_level: 2 },
    { id: 's2', user_id: 'uid-a-secret', total_xp: 900, current_level: 3 },
    { id: 's3', user_id: 'uid-b-secret', total_points: 500 },
    { id: 's4', user_id: 'uid-admin-secret', total_points: 9999 },
  ],
  profiles: [
    { id: 'uid-a-secret', full_name: 'Alice', email: 'alice@private.test', recovery: 'secret-recovery' },
    { id: 'uid-b-secret', full_name: 'bob@private.test', email: 'bob@private.test' },
    { id: 'uid-admin-secret', full_name: 'Admin', role: 'admin' },
  ],
  users: [{ id: 'uid-a-secret', saved_codes: ['secret-code'], email: 'alice@private.test' }],
};
function service(data = fixture, options = {}) {
  const reads = [];
  const db = { collection(name) { return { select(...fields) { return { limit(count) { return { async get() {
    reads.push({ name, fields, count });
    if (options.fail) throw new Error('private Firebase error');
    const rows = data[name] ?? [];
    return { size: options.overflow ? 5001 : rows.length, docs: rows.map(row => ({ id: row.id,
      data: () => Object.fromEntries(fields.filter(f => Object.hasOwn(row, f)).map(f => [f, row[f]])) })) };
  } }; } }; } }; } };
  let now = 1000;
  const { readLeaderboard } = load('src/lib/leaderboard.ts', { 'server-only': {}, 'node:crypto': crypto },
    { Date: class extends Date { static now() { return now; } } });
  return { reads, get: (uid = 'uid-a-secret', trusted = []) => readLeaderboard(db, uid, trusted), advance: ms => { now += ms; } };
}

test('leaderboard returns a strict, deduplicated display projection without account data', async () => {
  const s = service(), board = plain(await s.get());
  assert.equal(board.length, 2); assert.equal(board[0].full_name, 'Alice');
  assert.equal(board[0].total_xp, 900); assert.equal(board[0].current_level, 3);
  assert.equal(board[0].is_current_user, true); assert.equal(board[1].full_name, 'Learner');
  assert.deepEqual(Object.keys(board[0]).sort(), ['current_level','exam_track','full_name','id','is_current_user','total_xp','track_rank']);
  for (const secret of ['uid-a-secret','uid-b-secret','uid-admin-secret','private.test','secret-code','secret-recovery']) {
    assert.ok(!JSON.stringify(board).includes(secret));
  }
  assert.equal(s.reads.length, 3); assert.ok(s.reads.every(r => r.count === 5001));
  assert.deepEqual(s.reads.find(r => r.name === 'users').fields, ['isAdmin']);
  assert.ok(s.reads.every(r => !r.fields.includes('email') && !r.fields.includes('saved_codes')));
});
test('cache coalesces concurrent loads and personalizes only after the shared cache', async () => {
  const s = service(); await Promise.all(Array.from({ length: 20 }, () => s.get()));
  assert.equal(s.reads.length, 3);
  const bob = await s.get('uid-b-secret'); assert.equal(bob[0].is_current_user, false); assert.equal(bob[1].is_current_user, true);
  s.advance(300001); await s.get(); assert.equal(s.reads.length, 6);
});
test('trusted admin exclusion is independent of mutable role flags and invalidates old cache config', async () => {
  const s = service(); await s.get(); const board = await s.get('uid-b-secret', ['uid-a-secret']);
  assert.equal(board.length, 1); assert.equal(board[0].full_name, 'Learner'); assert.equal(s.reads.length, 6);
});
test('legacy profile-only ranking fallback does not fall back to email', async () => {
  const s = service({ ...fixture, exam_user_state: [] }); const board = await s.get();
  assert.equal(board.length, 2); assert.ok(board.every(r => !r.full_name.includes('@')));
});
test('bounded reads refuse partial rankings and back off after a failure', async () => {
  const s = service(fixture, { overflow: true });
  await assert.rejects(s.get(), /temporarily unavailable/); await assert.rejects(s.get(), /temporarily unavailable/);
  assert.equal(s.reads.length, 3); s.advance(30001); await assert.rejects(s.get()); assert.equal(s.reads.length, 6);
});
test('negative/non-numeric scores are normalized and names cannot carry markup controls or emails', async () => {
  const s = service({ profiles: [{ id: 'a', full_name: ' A\nB ' }, { id: 'b', full_name: 'secret@private.test' }],
    users: [], exam_user_state: [{ id: '1', user_id: 'a', total_points: -20 }, { id: '2', user_id: 'b', total_xp: Infinity }] });
  const rows = await s.get(); assert.ok(rows.every(r => r.total_xp === 0 && r.current_level === 1));
  assert.deepEqual(plain(rows.map(r => r.full_name).sort()), ['AB', 'Learner']);
});
test('legacy numeric-string XP and levels retain their displayed values', async () => {
  const s = service({ profiles: [{ id: 'a', full_name: 'Legacy learner' }], users: [],
    exam_user_state: [{ id: 'legacy', user_id: 'a', total_points: '850', current_level: '3' }] });
  const rows = await s.get(); assert.equal(rows[0].total_xp, 850); assert.equal(rows[0].current_level, 3);
});

for (const [code, expected] of [['auth/invalid-id-token',401],['auth/id-token-revoked',401],['auth/user-disabled',401],['unavailable',503]]) {
  test('user API auth fails closed: ' + code, async () => {
    const auth = load('src/lib/user-api-auth.ts', { 'server-only': {}, 'next/server': nextServer,
      '@/lib/firebase-admin': { getAdminAuth: () => ({ verifyIdToken: async () => { throw { code }; } }) } });
    assert.equal((await auth.authenticateUser(new Request('http://localhost', { headers: { Authorization: 'Bearer token' } }))).response.status, expected);
  });
}
test('missing tokens cannot reach the Admin SDK, valid tokens are revocation-checked', async () => {
  let calls = 0;
  const auth = load('src/lib/user-api-auth.ts', { 'server-only': {}, 'next/server': nextServer,
    '@/lib/firebase-admin': { getAdminAuth: () => ({ verifyIdToken: async (token, revoked) => {
      calls++; assert.equal(token, 'token'); assert.equal(revoked, true); return { uid: 'verified-user' };
    } }) } });
  for (const header of ['', 'Basic token', 'Bearer x y', 'Bearer ' + 'x'.repeat(8193)]) {
    assert.equal((await auth.authenticateUser(new Request('http://localhost', { headers: { Authorization: header } }))).response.status, 401);
  }
  assert.equal(calls, 0);
  assert.equal((await auth.authenticateUser(new Request('http://localhost', { headers: { Authorization: 'Bearer token' } }))).uid, 'verified-user');
});
test('route rejects unauthenticated calls before DB access and never trusts query UIDs', async () => {
  let caller = { response: nextServer.NextResponse.json({}, { status: 401 }) }, reads = 0;
  const route = load('src/app/api/leaderboard/route.ts', { 'next/server': nextServer,
    '@/lib/user-api-auth': { authenticateUser: async () => caller },
    '@/lib/firebase-admin': { getAdminDb: () => { reads++; return {}; } },
    '@/lib/leaderboard': { readLeaderboard: async (_db, uid) => { assert.equal(uid, 'verified-user'); return []; } },
  });
  const req = new Request('http://localhost/api/leaderboard?uid=victim');
  assert.equal((await route.GET(req)).status, 401); assert.equal(reads, 0);
  caller = { uid: 'verified-user' }; const res = await route.GET(req); assert.equal(res.status, 200);
  assert.equal(res.headers.get('Cache-Control'), 'private, no-store'); assert.equal(res.headers.get('Vary'), 'Authorization');
});
test('route outages return no account/debug information or permissive fallback', async () => {
  const route = load('src/app/api/leaderboard/route.ts', { 'next/server': nextServer,
    '@/lib/user-api-auth': { authenticateUser: async () => ({ uid: 'a' }) },
    '@/lib/firebase-admin': { getAdminDb: () => { throw new Error('private-key debug details'); } },
    '@/lib/leaderboard': {} });
  const response = await route.GET(new Request('http://localhost'));
  assert.equal(response.status, 503); assert.ok(!(await response.text()).includes('private-key'));
});
test('client attaches the current session, and failed API reads do not query private collections', async () => {
  let calls = 0;
  const client = load('src/lib/leaderboard-client.ts', {}, { fetch: async (url, init) => {
    calls++; assert.equal(url, '/api/leaderboard'); assert.equal(init.headers.Authorization, 'Bearer current-token');
    assert.equal(init.cache, 'no-store'); return Response.json({ leaderboard: [] });
  } });
  await client.fetchLeaderboard({ getIdToken: async () => 'current-token' }); assert.equal(calls, 1);
  const unavailable = load('src/lib/leaderboard-client.ts', {}, { fetch: async () => new Response('', { status: 503 }) });
  await assert.rejects(unavailable.fetchLeaderboard({ getIdToken: async () => 'token' }), /unavailable/);
});
