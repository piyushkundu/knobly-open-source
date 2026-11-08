import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import * as jsxRuntime from 'react/jsx-runtime';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/ai/KnoblyAI.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  },
}).outputText;

// Model persistent Hooks/effect cleanup across route changes without loading the
// app's authentication, storage, or AI APIs. Every render must have the same
// ordered Hooks, including routes where the widget returns null.
function widgetHarness(initialPath = '/') {
  const hooks = [];
  const timers = new Map();
  const listeners = new Map();
  const observers = new Set();
  const stateHandles = [];
  let cursor = 0;
  let expectedCount;
  let pathname = initialPath;
  let pending = [];
  let timerId = 0;

  function hook(kind) {
    const index = cursor++;
    if (!hooks[index]) hooks[index] = { kind };
    assert.equal(hooks[index].kind, kind, `Hook ${index} changed order`);
    return hooks[index];
  }
  const react = {
    useState(initial) {
      const slot = hook('state');
      if (!('value' in slot)) {
        slot.value = initial;
        slot.set = update => { slot.value = typeof update === 'function' ? update(slot.value) : update; };
        stateHandles.push(slot);
      }
      return [slot.value, slot.set];
    },
    useRef(initial) {
      const slot = hook('ref');
      slot.value ??= { current: initial };
      return slot.value;
    },
    useCallback(callback) { hook('callback'); return callback; },
    useEffect(effect, dependencies) {
      const slot = hook('effect');
      if (!slot.dependencies || dependencies.some((value, i) => !Object.is(value, slot.dependencies[i]))) {
        pending.push(() => {
          slot.cleanup?.();
          slot.cleanup = effect();
          slot.dependencies = dependencies;
        });
      }
    },
  };
  const eventTarget = scope => ({
    addEventListener(type, callback) { listeners.set(scope + ':' + type, callback); },
    removeEventListener(type) { listeners.delete(scope + ':' + type); },
  });
  const schedule = (callback, delay) => {
    const id = ++timerId;
    timers.set(id, { callback, delay });
    return id;
  };
  const router = { push() { assert.fail('No navigation side effects expected'); } };
  const dependencies = {
    react: { __esModule: true, default: react, ...react },
    'react/jsx-runtime': jsxRuntime,
    'next/navigation': {
      useRouter: () => { hook('router'); return router; },
      usePathname: () => { hook('pathname'); return pathname; },
    },
    'lucide-react': new Proxy({}, { get: () => () => null }),
    './SafeAIContent': { SafeAIContent: () => null },
    '@/lib/ai-limits': { AI_LIMITS: { chatMessage: 8000 }, buildAIChatHistory: messages => messages },
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      if (!Object.hasOwn(dependencies, name)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    document: { ...eventTarget('document'), documentElement: { classList: { contains: () => true } } },
    window: eventTarget('window'),
    MutationObserver: class {
      observe() { observers.add(this); }
      disconnect() { observers.delete(this); }
    },
    setTimeout: schedule, setInterval: schedule,
    clearTimeout: id => timers.delete(id), clearInterval: id => timers.delete(id),
    fetch: () => { throw new Error('No network requests permitted'); },
  });

  return {
    timers, listeners, observers, stateHandles,
    render(path = pathname) {
      pathname = path;
      cursor = 0;
      pending = [];
      const tree = exports.default();
      expectedCount ??= cursor;
      assert.equal(cursor, expectedCount, 'Navigation changed the number of Hooks');
      pending.forEach(commit => commit());
      return tree;
    },
    runTimeout(delay) {
      const [id, timer] = [...timers].find(([, timer]) => timer.delay === delay) ?? [];
      assert.ok(timer, `Expected timeout ${delay}`);
      timers.delete(id);
      timer.callback();
    },
  };
}

for (const path of ['/html/tasks/1', '/html/tasks/1/compiler', '/html/compiler', '/python-lab', '/c-lab', '/test/example']) {
  test(`home → ${path} → home preserves Hook order and hides the widget`, () => {
    const widget = widgetHarness();
    assert.ok(widget.render('/'));
    assert.equal(widget.render(path), null);
    assert.equal(widget.timers.size, 0);
    assert.equal(widget.listeners.size, 0);
    assert.equal(widget.observers.size, 0);
    assert.ok(widget.render('/'));
    assert.ok(widget.listeners.has('window:toggle-knobly-ai'));
  });
}

test('direct task-page load followed by a visible page also preserves Hook order', () => {
  const widget = widgetHarness('/html/tasks/1');
  assert.equal(widget.render(), null);
  assert.equal(widget.timers.size, 0);
  assert.ok(widget.render('/python'));
  assert.equal(widget.render('/html/tasks/1'), null);
});

test('hiding the widget cancels nested animation timers too', () => {
  const widget = widgetHarness();
  widget.render();
  widget.runTimeout(1000);
  widget.runTimeout(2500);
  widget.runTimeout(10000);
  assert.ok([...widget.timers.values()].some(timer => timer.delay === 300));
  assert.ok([...widget.timers.values()].some(timer => timer.delay === 400));
  widget.render('/html/tasks/1');
  assert.equal(widget.timers.size, 0);
});

test('route visibility changes preserve the existing in-memory chat', () => {
  const widget = widgetHarness();
  widget.render();
  const chat = widget.stateHandles.find(slot => Array.isArray(slot.value));
  const messages = [{ role: 'user', content: 'Keep this chat' }];
  chat.set(messages);
  widget.render('/html/tasks/1');
  widget.render('/');
  assert.equal(chat.value, messages);
});
