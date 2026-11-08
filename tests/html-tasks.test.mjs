import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import vm from 'node:vm';
import nextServer from 'next/server.js';
import ts from 'typescript';

const source = readFileSync(new URL('../src/app/api/html-tasks/route.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText;
const taskIds = ['1', '2', '3', '4', '5', '5.0', '5.1', '5.2', '5.3', '5.4', '6', '7', '8', '9', '10', '11', 'test-1'];

// All storage is virtual. No Firebase module or real filesystem write is loaded.
function fixture(options = {}) {
  let state = options.state ?? { unlockedTasks: ['1', '2'], unrelatedField: 'keep' };
  let exists = options.exists ?? true;
  const files = new Map();
  const writes = [];
  const commits = [];
  let dbAccesses = 0;
  let attempts = 0;
  if (options.fallback) files.set('/fixture/data/html-tasks-state.json', JSON.stringify({ unlockedTasks: options.fallback }));
  const snapshot = () => ({ exists, data: () => state });
  const doc = { get: async () => {
    if (options.readFailure) throw new Error('Offline');
    return snapshot();
  } };
  const db = {
    collection(name) {
      assert.equal(name, 'app_settings');
      return { doc(id) { assert.equal(id, 'html_tasks'); return doc; } };
    },
    async runTransaction(update) {
      let staged;
      const transaction = {
        get: async ref => {
          assert.equal(ref, doc);
          if (options.readFailure) throw new Error('Offline');
          return snapshot();
        },
        set(ref, value, settings) {
          assert.equal(ref, doc);
          assert.equal(settings.merge, true);
          staged = JSON.parse(JSON.stringify(value));
        },
      };
      attempts++;
      let result = await update(transaction);
      assert.equal(writes.length, 0, 'No cache writes before transaction commit');
      if (options.retryState) {
        state = options.retryState;
        attempts++;
        result = await update(transaction);
        assert.equal(writes.length, 0, 'No cache writes during transaction retry');
      }
      if (options.commitFailure) throw new Error('Commit failed');
      state = { ...state, ...staged };
      exists = true;
      commits.push(staged);
      return result;
    },
  };
  const dependencies = {
    'next/server': nextServer,
    '@/lib/admin-api-auth': {
      requireAdmin: async () => options.denied
        ? nextServer.NextResponse.json({ error: 'Admin access denied' }, { status: options.denied })
        : null,
    },
    '@/lib/firebase-admin': { getAdminDb() {
      dbAccesses++;
      if (options.dbFailure) throw new Error('Database unavailable');
      return db;
    } },
    fs: {
      existsSync: name => files.has(name),
      readFileSync: name => files.get(name),
      mkdirSync() {},
      writeFileSync(name, value) {
        if (options.fileFailure) throw new Error('Read-only filesystem');
        writes.push({ name, value });
        files.set(name, value);
      },
    },
    path: path.posix,
    os: { tmpdir: () => '/fixture-tmp' },
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, process: { cwd: () => '/fixture' },
    console: { log() {}, warn() {}, error() {} },
    require(name) {
      if (!Object.hasOwn(dependencies, name)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
  });
  return {
    ...exports, writes, commits, options,
    get state() { return state; },
    get dbAccesses() { return dbAccesses; },
    get attempts() { return attempts; },
    post: body => exports.POST({ json: async () => body }),
  };
}

for (const status of [401, 403, 503]) {
  test(`task updates reject ${status} before body, database, or filesystem access`, async () => {
    const app = fixture({ denied: status });
    const response = await app.POST({ json() { assert.fail('Unauthorized body must not be read'); } });
    assert.equal(response.status, status);
    assert.equal(app.dbAccesses, 0);
    assert.equal(app.writes.length, 0);
    assert.equal(app.commits.length, 0);
  });
}

test('invalid JSON is rejected without a database operation', async () => {
  const app = fixture();
  const response = await app.POST({ json() { throw new SyntaxError('Invalid JSON'); } });
  assert.equal(response.status, 400);
  assert.equal(app.dbAccesses, 0);
});

for (const body of [null, [], 'unlock', {}, { taskId: 1, action: 'unlock' }, { taskId: '../users', action: 'unlock' }, { taskId: 'unknown', action: 'lock' }, { taskId: '1' }, { taskId: '1', action: 'delete' }, { taskId: 'all', action: null }]) {
  test(`rejects invalid task update ${JSON.stringify(body)}`, async () => {
    const app = fixture();
    const response = await app.post(body);
    assert.equal(response.status, 400);
    assert.equal(app.dbAccesses, 0);
    assert.equal(app.commits.length, 0);
    assert.equal(app.writes.length, 0);
  });
}

test('all existing task IDs remain supported', async () => {
  for (const taskId of taskIds) {
    const app = fixture();
    const response = await app.post({ taskId, action: 'unlock' });
    assert.equal(response.status, 200, taskId);
    assert.ok((await response.json()).unlockedTasks.includes(taskId), taskId);
    assert.equal(app.state.unrelatedField, 'keep');
  }
});

test('single task changes preserve unrelated and legacy state', async () => {
  const app = fixture({ state: { unlockedTasks: ['1', '2', 'legacy-id'], unrelatedField: 'keep' } });
  const response = await app.post({ taskId: '2', action: 'lock' });
  assert.deepEqual((await response.json()).unlockedTasks, ['1', 'legacy-id']);
  assert.equal(app.state.unrelatedField, 'keep');
  assert.ok(app.writes.length > 0);
  assert.equal(response.headers.get('cache-control').includes('no-store'), true);
});

test('unlocking an already unlocked task does not duplicate its ID', async () => {
  const app = fixture();
  const response = await app.post({ taskId: '1', action: 'unlock' });
  assert.deepEqual((await response.json()).unlockedTasks, ['1', '2']);
});

test('all-task lock and unlock persist exactly the requested state', async () => {
  const locked = fixture();
  assert.deepEqual((await (await locked.post({ taskId: 'all', action: 'lock' })).json()).unlockedTasks, []);
  const unlocked = fixture();
  assert.deepEqual((await (await unlocked.post({ taskId: 'all', action: 'unlock' })).json()).unlockedTasks, taskIds);
});

test('transaction retries preserve changes committed by another admin', async () => {
  const app = fixture({ retryState: { unlockedTasks: ['1', '2', '4'], unrelatedField: 'keep' } });
  const response = await app.post({ taskId: '3', action: 'unlock' });
  assert.equal(response.status, 200);
  assert.equal(app.attempts, 2);
  assert.deepEqual((await response.json()).unlockedTasks, ['1', '2', '4', '3']);
  assert.equal(app.commits.length, 1);
  assert.equal(app.writes.length, 1);
});

for (const failure of ['dbFailure', 'readFailure', 'commitFailure']) {
  test(`${failure} returns an error without reporting success or changing caches`, async () => {
    const app = fixture({ [failure]: true });
    const response = await app.post({ taskId: '3', action: 'unlock' });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).success, false);
    assert.equal(response.headers.has('set-cookie'), false);
    assert.deepEqual(app.state.unlockedTasks, ['1', '2']);
    assert.equal(app.commits.length, 0);
    assert.equal(app.writes.length, 0);
  });
}

test('failed commits cannot poison the in-memory fallback', async () => {
  const app = fixture();
  await app.GET();
  app.options.commitFailure = true;
  await app.post({ taskId: '3', action: 'unlock' });
  app.options.readFailure = true;
  assert.deepEqual((await (await app.GET()).json()).unlockedTasks, ['1', '2']);
  assert.equal(app.writes.length, 0);
});

test('an invalid existing cloud record is never silently overwritten', async () => {
  const app = fixture({ state: { unrelatedField: 'keep' } });
  const response = await app.post({ taskId: '3', action: 'unlock' });
  assert.equal(response.status, 503);
  assert.equal(app.commits.length, 0);
  assert.deepEqual(app.state, { unrelatedField: 'keep' });
});

test('missing cloud state can be initialized from existing server-owned fallback', async () => {
  const app = fixture({ exists: false, fallback: ['1', '2', '5.0'] });
  const response = await app.post({ taskId: '3', action: 'unlock' });
  assert.deepEqual((await response.json()).unlockedTasks, ['1', '2', '5.0', '3']);
});

test('cache write failures do not undo a confirmed authoritative commit', async () => {
  const app = fixture({ fileFailure: true });
  const response = await app.post({ taskId: '3', action: 'unlock' });
  assert.equal(response.status, 200);
  assert.deepEqual(app.state.unlockedTasks, ['1', '2', '3']);
  assert.equal(app.commits.length, 1);
});

test('public GET preserves existing status without any disk or cloud writes', async () => {
  const app = fixture({ denied: 401 });
  const response = await app.GET();
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).unlockedTasks, ['1', '2']);
  assert.equal(app.writes.length, 0);
  assert.equal(app.commits.length, 0);
});

test('forged cookies cannot become shared fallback state', async () => {
  const app = fixture({ dbFailure: true, fallback: ['1'] });
  const response = await app.GET({ cookies: { get() { assert.fail('Client cookie must not be trusted'); } } });
  assert.deepEqual((await response.json()).unlockedTasks, ['1']);
  assert.equal(app.writes.length, 0);
});

test('empty locked state stays empty during a database outage', async () => {
  const app = fixture({ state: { unlockedTasks: [] } });
  await app.GET();
  app.options.readFailure = true;
  assert.deepEqual((await (await app.GET()).json()).unlockedTasks, []);
});
