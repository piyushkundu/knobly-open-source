import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import nextServer from 'next/server.js';

// Only explicitly supplied dependencies can load. No real Firebase credentials,
// database clients, or network calls are available inside these test modules.
function loadSource(file, dependencies, globals = {}) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: file,
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, Request, Response, Headers,
    process: { env: {} },
    console: { log() {}, warn() {}, error() {} },
    fetch: () => { throw new Error('Unexpected network request'); },
    require(name) {
      if (!Object.hasOwn(dependencies, name)) throw new Error(`Unmocked dependency: ${name}`);
      return dependencies[name];
    },
    ...globals,
  }, { filename: file });
  return exports;
}

function authHarness({ user, profile, tokenError, dbError, initError, trustedAdminUids = 'test-user' } = {}) {
  const reads = [];
  const verifications = [];
  const { requireAdmin } = loadSource('src/lib/admin-api-auth.ts', {
    'server-only': {},
    'next/server': nextServer,
    '@/lib/firebase-admin': {
      getAdminAuth() {
        if (initError) throw initError;
        return {
          async verifyIdToken(token, checkRevoked) {
            verifications.push({ token, checkRevoked });
            if (tokenError) throw tokenError;
            return { uid: 'test-user' };
          },
        };
      },
      getAdminDb() {
        if (dbError) throw dbError;
        return {
          collection(name) {
            assert.ok(['users', 'profiles'].includes(name));
            return {
              doc(uid) {
                assert.equal(uid, 'test-user');
                return {
                  async get() {
                    reads.push(name);
                    const data = name === 'users' ? user : profile;
                    return { exists: data !== undefined, data: () => data };
                  },
                };
              },
            };
          },
        };
      },
    },
  }, { process: { env: { FIREBASE_TRUSTED_ADMIN_UIDS: trustedAdminUids } } });
  return { requireAdmin, reads, verifications };
}

function request(authorization = 'Bearer test-token') {
  return new Request('http://localhost/api/admin-delete', {
    method: 'POST',
    headers: authorization === null ? {} : { Authorization: authorization },
  });
}

for (const authorization of [null, 'Basic credentials', 'Bearer', 'Bearer token extra']) {
  test(`rejects missing/malformed authorization: ${authorization}`, async () => {
    const harness = authHarness();
    assert.equal((await harness.requireAdmin(request(authorization))).status, 401);
    assert.equal(harness.verifications.length, 0);
    assert.equal(harness.reads.length, 0);
  });
}

for (const code of ['auth/invalid-id-token', 'auth/id-token-expired', 'auth/id-token-revoked', 'auth/user-disabled', 'auth/user-not-found', 'auth/argument-error']) {
  test(`rejects ${code} before database access`, async () => {
    const harness = authHarness({ tokenError: { code } });
    assert.equal((await harness.requireAdmin(request())).status, 401);
    assert.deepEqual(harness.verifications, [{ token: 'test-token', checkRevoked: true }]);
    assert.equal(harness.reads.length, 0);
  });
}

for (const roles of [{}, { user: { isAdmin: false }, profile: { role: 'user' } }, { user: { isAdmin: 'true' }, profile: { role: 'superadmin' } }]) {
  test(`denies non-admin roles: ${JSON.stringify(roles)}`, async () => {
    const harness = authHarness(roles);
    assert.equal((await harness.requireAdmin(request())).status, 403);
  });
}

for (const roles of [{ user: { isAdmin: true } }, { profile: { role: 'admin' } }]) {
  test(`accepts existing admin role without writes: ${JSON.stringify(roles)}`, async () => {
    const harness = authHarness(roles);
    assert.equal(await harness.requireAdmin(request('bearer test-token')), null);
    assert.deepEqual(harness.reads.sort(), ['profiles', 'users']);
  });
}

test('forged role flags cannot bypass the server-owned admin UID allowlist', async () => {
  const harness = authHarness({ user: { isAdmin: true }, profile: { role: 'admin' }, trustedAdminUids: 'another-trusted-uid' });
  assert.equal((await harness.requireAdmin(request())).status, 403);
  assert.equal(harness.reads.length, 0);
});

test('missing trusted-admin configuration fails closed', async () => {
  const harness = authHarness({ user: { isAdmin: true }, trustedAdminUids: '' });
  assert.equal((await harness.requireAdmin(request())).status, 503);
  assert.equal(harness.reads.length, 0);
});

for (const failure of [{ initError: new Error('credentials missing') }, { tokenError: { code: 'auth/internal-error' } }, { dbError: new Error('database unavailable') }]) {
  test(`fails closed when verification is unavailable: ${Object.keys(failure)[0]}`, async () => {
    const harness = authHarness(failure);
    const response = await harness.requireAdmin(request());
    assert.equal(response.status, 503);
    assert.equal((await response.json()).error, 'Unable to verify admin access. Please try again later.');
  });
}

const routes = [
  'src/app/api/admin-delete/route.ts',
  'src/app/api/admin-ai-format/route.ts',
  'src/app/api/admin/verify-test/route.ts',
];

for (const route of routes) {
  for (const status of [401, 403, 503]) {
    test(`${route} blocks ${status} before reading body, database, or AI`, async () => {
      const { POST } = loadSource(route, {
        'next/server': nextServer,
        '@/lib/admin-api-auth': { requireAdmin: async () => nextServer.NextResponse.json({ error: 'denied' }, { status }) },
        '@/lib/firebase-admin': { getAdminDb: () => { throw new Error('Database must not be accessed'); } },
        'firebase-admin/firestore': {},
      });
      const response = await POST({ json() { assert.fail('Unauthorized body must not be read'); } });
      assert.equal(response.status, status);
    });
  }
}

test('authorized admin deletion still works against dummy data only', async () => {
  const deleted = [];
  const { POST } = loadSource(routes[0], {
    'next/server': nextServer,
    '@/lib/admin-api-auth': { requireAdmin: authHarness({ profile: { role: 'admin' } }).requireAdmin },
    '@/lib/firebase-admin': {
      getAdminDb: () => ({
        collection(name) {
          return {
            where(field, operator, value) {
              assert.equal(name, 'exam_options');
              assert.deepEqual([field, operator, value], ['question_id', '==', 'dummy-question']);
              return { get: async () => ({ docs: [{ id: 'dummy-option' }] }) };
            },
            doc(id) {
              return { delete: async () => { deleted.push(`${name}/${id}`); } };
            },
          };
        },
      }),
    },
    'firebase-admin/firestore': {},
  });
  const req = request();
  req.json = async () => ({ action: 'delete_question', questionId: 'dummy-question' });
  const response = await POST(req);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.deepEqual(deleted, ['exam_options/dummy-option', 'exam_questions/dummy-question']);
});

test('admin client preserves request body/headers and attaches the existing session', async () => {
  let tokenReads = 0;
  const calls = [];
  const { adminFetch } = loadSource('src/lib/admin-fetch.ts', {
    '@/lib/firebase': { auth: { currentUser: { getIdToken: async () => { tokenReads++; return 'session-token'; } } } },
  }, {
    fetch: async (path, init) => { calls.push({ path, init }); return Response.json({ success: true }); },
  });
  const headers = new Headers({ 'Content-Type': 'application/json', Authorization: 'old-token' });
  await adminFetch('/api/admin-delete', { method: 'POST', headers, body: '{"action":"dummy"}' });
  assert.equal(tokenReads, 1);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].path, '/api/admin-delete');
  assert.equal(calls[0].init.headers.get('authorization'), 'Bearer session-token');
  assert.equal(calls[0].init.headers.get('content-type'), 'application/json');
  assert.equal(calls[0].init.body, '{"action":"dummy"}');
  assert.equal(headers.get('authorization'), 'old-token');
});

test('signed-out client makes no admin request', async () => {
  const { adminFetch } = loadSource('src/lib/admin-fetch.ts', {
    '@/lib/firebase': { auth: { currentUser: null } },
  });
  await assert.rejects(adminFetch('/api/admin-delete'), /Please sign in/);
});
