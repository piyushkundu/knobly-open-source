import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as jsxRuntime from 'react/jsx-runtime';

const source = readFileSync(new URL('../src/lib/preview-sandbox.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function loadHelpers(window = {}) {
  const exports = {};
  vm.runInNewContext(compiled, { exports, window, URL });
  return exports;
}

const { PREVIEW_SANDBOX, MAX_PREVIEW_TEXT_LENGTH, readPreviewConsoleEvent, createPreviewConsoleBridge } = loadHelpers();
const parentOrigin = 'https://knobly.example';
const previewWindow = {};
const log = { type: 'KNOBLY_WEB_CONSOLE', level: 'log', message: 'Hello', time: '12:34' };
const event = (data, source = previewWindow, origin = 'null') => ({ data, source, origin });

test('sandbox keeps scripts/forms but denies app origin, top navigation, and popup escape', () => {
  const flags = PREVIEW_SANDBOX.split(' ');
  assert.ok(flags.includes('allow-scripts'));
  assert.ok(flags.includes('allow-forms'));
  assert.ok(flags.includes('allow-popups'));
  for (const permission of ['allow-same-origin', 'allow-popups-to-escape-sandbox', 'allow-top-navigation', 'allow-top-navigation-by-user-activation', 'allow-storage-access-by-user-activation']) {
    assert.ok(!flags.includes(permission), permission);
  }
});

test('console accepts only the active opaque preview and valid text', () => {
  const result = readPreviewConsoleEvent(event(log), previewWindow);
  assert.equal(result.level, 'log');
  assert.equal(result.message, 'Hello');
  assert.equal(result.time, '12:34');
});

for (const [name, source, origin, active] of [
  ['unrelated window', {}, 'null', previewWindow],
  ['null sender', null, 'null', previewWindow],
  ['same-origin page', previewWindow, parentOrigin, previewWindow],
  ['foreign site', previewWindow, 'https://untrusted.example', previewWindow],
  ['unmounted preview', previewWindow, 'null', null],
]) {
  test(`console ignores ${name}`, () => {
    assert.equal(readPreviewConsoleEvent(event(log, source, origin), active), null);
  });
}

for (const data of [null, [], 'message', {}, { ...log, level: 'debug' }, { ...log, level: ['log'] }, { ...log, message: {} }, { type: 'KNOBLY_EVAL_CMD', code: '1+1' }, { type: 'KNOBLY_EVAL_RESULT', error: {} }, { type: 'KNOBLY_EVAL_RESULT', result: {} }]) {
  test(`console rejects malformed payload ${JSON.stringify(data)}`, () => {
    assert.equal(readPreviewConsoleEvent(event(data), previewWindow), null);
  });
}

test('console bounds text and timestamps from untrusted code', () => {
  const result = readPreviewConsoleEvent(event({ ...log, message: 'x'.repeat(MAX_PREVIEW_TEXT_LENGTH + 100), time: 'x'.repeat(200) }), previewWindow);
  assert.equal(result.message.length, MAX_PREVIEW_TEXT_LENGTH);
  assert.equal(result.time.length, 64);
});

test('console renders successful and failed REPL results as plain text', () => {
  const success = readPreviewConsoleEvent(event({ type: 'KNOBLY_EVAL_RESULT', result: '5', error: null }), previewWindow);
  assert.equal(success.level, 'log');
  assert.equal(success.message, '<= 5');
  const failure = readPreviewConsoleEvent(event({ type: 'KNOBLY_EVAL_RESULT', result: null, error: '<img onerror=alert(1)>' }), previewWindow);
  assert.equal(failure.level, 'error');
  assert.equal(failure.message, 'Error: <img onerror=alert(1)>');
});

function bridgeHarness() {
  const messages = [];
  let listener;
  const parent = { postMessage: (data, origin) => messages.push({ data, origin }) };
  const window = { parent, addEventListener: (type, handler) => { assert.equal(type, 'message'); listener = handler; } };
  const context = vm.createContext({ window, executions: 0, console: { log() {}, warn() {}, error() {}, info() {} } });
  vm.runInContext(createPreviewConsoleBridge(parentOrigin), context);
  return { context, messages, parent, deliver: (data, source = parent, origin = parentOrigin) => listener({ data, source, origin }) };
}

test('bridge sends logs/runtime errors only to the exact parent origin', () => {
  const harness = bridgeHarness();
  vm.runInContext('console.log("hello", {value: 1}); window.onerror("oops", "test", 4);', harness.context);
  assert.equal(harness.messages.length, 2);
  assert.ok(harness.messages.every(message => message.origin === parentOrigin));
  assert.equal(harness.messages[0].data.message, 'hello {"value":1}');
  assert.equal(harness.messages[1].data.level, 'error');
});

test('bridge runs commands only from its parent with the exact app origin', () => {
  const harness = bridgeHarness();
  const command = { type: 'KNOBLY_EVAL_CMD', code: '(globalThis.executions++, 2 + 3)' };
  harness.deliver(command, {}, parentOrigin);
  harness.deliver(command, harness.parent, 'https://untrusted.example');
  harness.deliver(command, harness.parent, 'null');
  harness.deliver({ ...command, code: {} });
  harness.deliver({ ...command, code: 'x'.repeat(MAX_PREVIEW_TEXT_LENGTH + 1) });
  assert.equal(harness.context.executions, 0);
  assert.equal(harness.messages.length, 0);
  harness.deliver(command);
  assert.equal(harness.context.executions, 1);
  assert.equal(harness.messages[0].data.result, '5');
  assert.equal(harness.messages[0].origin, parentOrigin);
});

test('bridge catches REPL errors without exposing an unvalidated result', () => {
  const harness = bridgeHarness();
  harness.deliver({ type: 'KNOBLY_EVAL_CMD', code: 'missingVariable' });
  assert.equal(harness.messages[0].data.result, null);
  assert.match(harness.messages[0].data.error, /missingVariable/);
});

test('bridge rejects non-web origins instead of broadcasting commands/results', () => {
  for (const origin of ['null', '*', 'data:text/html,test', 'javascript:alert(1)']) {
    assert.throws(() => createPreviewConsoleBridge(origin));
  }
});

test('external preview runs student HTML only inside a sandbox and severs opener', () => {
  const html = '<script>parent.document.body.remove()</script>';
  const frame = { style: {}, setAttribute(name, value) { this[name] = value; } };
  let attached;
  const popup = { opener: {}, document: {
    body: { style: {}, replaceChildren(child) { attached = child; } },
    createElement(tag) { assert.equal(tag, 'iframe'); return frame; },
  } };
  const helpers = loadHelpers({ open(url, target) {
    assert.equal(url, 'about:blank');
    assert.equal(target, '_blank');
    return popup;
  } });
  helpers.openSandboxedPreview(html);
  assert.equal(popup.opener, null);
  assert.equal(attached, frame);
  assert.equal(frame.sandbox, PREVIEW_SANDBOX);
  assert.equal(frame.srcdoc, html);
  assert.equal(frame.referrerPolicy, 'no-referrer');
});

test('blocked external popup is handled without errors', () => {
  loadHelpers({ open: () => null }).openSandboxedPreview('<p>Hello</p>');
});

function renderPreviewPanel(activeTab) {
  const source = readFileSync(new URL('../src/components/web-compiler/WebPreviewConsole.tsx', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const sent = [];
  const previewWindow = { postMessage: (...args) => sent.push(args) };
  const states = [];
  const listeners = {};
  let refIndex = 0;
  const dependencies = {
    'react/jsx-runtime': jsxRuntime,
    react: {
      useState(initial) {
        const index = states.length;
        states.push(index === 0 ? activeTab : index === 3 ? '2 + 3' : initial);
        return [states[index], update => { states[index] = typeof update === 'function' ? update(states[index]) : update; }];
      },
      useRef: () => ({ current: refIndex++ === 0 ? { contentWindow: previewWindow } : { scrollIntoView() {} } }),
      useEffect: effect => { effect(); },
    },
    'lucide-react': new Proxy({}, { get: () => () => null }),
    '@/lib/preview-sandbox': loadHelpers(),
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    window: { addEventListener: (type, handler) => { listeners[type] = handler; }, removeEventListener() {} },
    require(name) {
      if (!Object.hasOwn(dependencies, name)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
  });
  const tree = exports.WebPreviewConsole({ bundledHtml: '<p>Student</p>', deviceMode: 'desktop', onDeviceModeChange() {} });
  function find(node, tag) {
    if (!node || typeof node !== 'object') return undefined;
    if (node.type === tag) return node;
    for (const child of [node.props?.children].flat(Infinity)) {
      const found = find(child, tag);
      if (found) return found;
    }
  }
  return { tree, find, sent, states, listeners, previewWindow };
}

test('switching to console retains the sandboxed preview and its REPL destination', () => {
  for (const tab of ['preview', 'console']) {
    const panel = renderPreviewPanel(tab);
    const frame = panel.find(panel.tree, 'iframe');
    assert.ok(frame, `Preview remains mounted on ${tab} tab`);
    assert.equal(frame.props.sandbox, PREVIEW_SANDBOX);
    panel.find(panel.tree, 'form').props.onSubmit({ preventDefault() {} });
    assert.equal(panel.sent.length, 1);
    assert.equal(panel.sent[0][0].code, '2 + 3');
    assert.equal(panel.sent[0][1], '*');
  }
});

test('console component ignores foreign messages and safely displays its preview output', () => {
  const panel = renderPreviewPanel('console');
  panel.listeners.message(event(log, {}));
  assert.equal(panel.states[1].length, 0);
  panel.listeners.message(event({ ...log, message: '<img onerror=alert(1)>' }, panel.previewWindow));
  assert.equal(panel.states[1].length, 1);
  assert.equal(panel.states[1][0].message, '<img onerror=alert(1)>');
});
