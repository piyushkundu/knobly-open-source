import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

function load(file, dependencies, globals = {}) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      if (!Object.hasOwn(dependencies, name)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    ...globals,
  });
  return exports;
}

function gate(auth) {
  return load('src/components/auth/AdminTaskGate.tsx', {
    'react/jsx-runtime': jsxRuntime,
    '@/context/AuthContext': { useAuth: () => auth },
  }).AdminTaskGate;
}

for (const [name, auth, visible] of [
  ['loading', { loading: true, user: null, isAdmin: false }, false],
  ['guest', { loading: false, user: null, isAdmin: false }, false],
  ['ordinary user', { loading: false, user: { uid: 'student' }, isAdmin: false }, false],
  ['admin', { loading: false, user: { uid: 'admin' }, isAdmin: true }, true],
]) {
  test(`task controls are ${visible ? 'visible' : 'hidden'} for ${name}`, () => {
    const Gate = gate(auth);
    const html = renderToStaticMarkup(React.createElement(Gate, { onSignIn() {} }, React.createElement('form', { id: 'task-actions' }, 'Manage tasks')));
    assert.equal(html.includes('id="task-actions"'), visible);
    assert.doesNotMatch(html, /type="password"/);
    if (name === 'guest') assert.match(html, /Sign in as Admin/);
  });
}

test('guest sign-in button opens the existing login flow on demand', () => {
  let signIns = 0;
  const Gate = gate({ loading: false, user: null, isAdmin: false });
  const tree = Gate({ children: null, onSignIn: () => { signIns++; } });
  const button = tree.props.children.find(child => child.type === 'button');
  button.props.onClick();
  assert.equal(signIns, 1);
});

function find(node, type) {
  if (!node || typeof node !== 'object') return undefined;
  if (node.type === type) return node;
  for (const child of [node.props?.children].flat(Infinity)) {
    const result = find(child, type);
    if (result) return result;
  }
}

function pageFixture(page, status, body, auth = { user: { uid: 'admin' }, isAdmin: true, loading: false }) {
  const states = [];
  const writes = [];
  const calls = [];
  const timers = [];
  const cache = new Map([['knobly_unlocked_html_tasks', '["1","2"]']]);
  const overrides = page === 'list'
    ? { 0: ['1', '2'], 2: false, 3: true, 4: '3' }
    : { 0: false, 5: true };
  const react = {
    use: value => value,
    useEffect() {}, // Do not execute page-load requests or persistence.
    useState(initial) {
      const index = states.length;
      states.push(Object.hasOwn(overrides, index) ? overrides[index] : initial);
      return [states[index], update => { states[index] = typeof update === 'function' ? update(states[index]) : update; }];
    },
  };
  const dependencies = {
    react: { __esModule: true, default: react, ...react },
    'react/jsx-runtime': jsxRuntime,
    'next/navigation': { useRouter: () => ({}) },
    'next/link': { __esModule: true, default: ({ children }) => React.createElement('a', null, children) },
    'lucide-react': new Proxy({}, { get: () => () => null }),
    '@/lib/preview-sandbox': { PREVIEW_SANDBOX: 'allow-scripts' },
    '@/components/auth/AdminTaskGate': { AdminTaskGate: gate(auth) },
    '@/components/auth/LoginModal': { __esModule: true, default: () => null },
    '@/lib/admin-fetch': { adminFetch: async (url, init) => {
      calls.push({ url, body: JSON.parse(init.body) });
      return Response.json(body, { status });
    } },
  };
  const exports = load(page === 'list' ? 'src/app/html/tasks/page.tsx' : 'src/app/html/tasks/[id]/page.tsx', dependencies, {
    localStorage: {
      getItem: key => cache.get(key) ?? null,
      setItem(key, value) { writes.push({ key, value }); cache.set(key, value); },
    },
    setTimeout: callback => timers.push(callback),
    fetch: () => { throw new Error('Public/unauthenticated requests are forbidden in admin submit tests'); },
  });
  const tree = exports.default({ params: { id: '3' } });
  return { states, writes, calls, timers, cache, tree, submit: () => find(tree, 'form').props.onSubmit({ preventDefault() {} }) };
}

const failures = [
  [401, { error: 'Sign in required' }],
  [403, { error: 'Admin required' }],
  [503, { success: false, error: 'Save failed' }],
  [200, { success: false, unlockedTasks: ['1', '2', '3'] }],
  [200, { success: true }],
  [200, { success: true, unlockedTasks: [null] }],
];

for (const page of ['list', 'single']) {
  for (const [status, body] of failures) {
    test(`${page} page does not update local state/cache for unconfirmed response ${status}: ${JSON.stringify(body)}`, async () => {
      const app = pageFixture(page, status, body);
      await app.submit();
      assert.equal(app.calls[0].url, '/api/html-tasks');
      assert.deepEqual(app.calls[0].body, { taskId: '3', action: 'unlock' });
      assert.equal(app.writes.length, 0);
      assert.equal(app.cache.get('knobly_unlocked_html_tasks'), '["1","2"]');
      assert.equal(app.timers.length, 0);
      assert.equal(app.states[page === 'list' ? 9 : 4], '');
      assert.ok(app.states[page === 'list' ? 8 : 3]);
    });
  }

  test(`${page} page updates its cache only from a confirmed admin response`, async () => {
    const app = pageFixture(page, 200, { success: true, unlockedTasks: ['1', '2', '3'], message: 'Updated' });
    await app.submit();
    assert.equal(app.writes.length, 1);
    assert.equal(app.cache.get('knobly_unlocked_html_tasks'), '["1","2","3"]');
    assert.ok(app.states[page === 'list' ? 9 : 4]);
    app.timers.forEach(callback => callback());
    if (page === 'single') assert.equal(app.states[0], true);
  });

  test(`${page} page renders a sign-in prompt instead of password/action fields for guests`, () => {
    const app = pageFixture(page, 200, {}, { user: null, isAdmin: false, loading: false });
    const html = renderToStaticMarkup(app.tree);
    assert.match(html, /Sign in as Admin/);
    assert.doesNotMatch(html, /type="password"|type="submit"/);
    assert.equal(app.calls.length, 0);
  });
}

test('single task cannot optimistically unlock itself if the server did not confirm its ID', async () => {
  const app = pageFixture('single', 200, { success: true, unlockedTasks: ['1', '2'] });
  await app.submit();
  assert.equal(app.states[0], false);
  assert.equal(app.writes.length, 0);
  assert.equal(app.timers.length, 0);
});
