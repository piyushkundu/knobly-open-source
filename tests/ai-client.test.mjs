import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import * as jsxRuntime from 'react/jsx-runtime';
import ts from 'typescript';

function evaluate(source, dependencies = {}, globals = {}) {
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports, Error, console: { error() {}, warn() {}, log() {} },
    require(name) {
      if (!Object.hasOwn(dependencies, name)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    ...globals,
  });
  return exports;
}
const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const limits = evaluate(read('src/lib/ai-limits.ts'));

function callback(file, name, globals) {
  const tree = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let expression;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(tree) === name) {
      const initializer = node.initializer;
      expression = ts.isCallExpression(initializer) ? initializer.arguments[0] : initializer;
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  assert.ok(expression);
  return evaluate('export const run = ' + expression.getText(tree), {}, { ...limits, ...globals }).run;
}

for (const language of ['python', 'c']) {
  const file = language === 'python' ? 'src/components/python/PythonLab.tsx' : 'src/components/c-lang/CLab.tsx';
  test(`${language}: rejected generation keeps existing editor code and draft`, async () => {
    let code = 'existing user code';
    const writes = [];
    const run = callback(file, 'handleGenerateCode', {
      language: 'en', setCode: value => { code = value; },
      localStorage: { setItem: (...args) => writes.push(args) },
      fetch: async () => Response.json({ error: 'Prompt is too long.' }, { status: 413 }),
    });
    await assert.rejects(run('prompt'), /Prompt is too long/);
    assert.equal(code, 'existing user code');
    assert.equal(writes.length, 0);
  });

  test(`${language}: successful generation still updates the editor normally`, async () => {
    let code;
    const writes = [];
    const run = callback(file, 'handleGenerateCode', {
      language: 'en', setCode: value => { code = value; },
      localStorage: { setItem: (...args) => writes.push(args) },
      fetch: async () => Response.json({ code: 'new generated code' }),
    });
    await run('prompt');
    assert.equal(code, 'new generated code');
    assert.deepEqual(writes, [[language + '-code', 'new generated code']]);
  });
}

function find(node, type) {
  if (!node || typeof node !== 'object') return undefined;
  if (node.type === type || node.props?.role === type) return node;
  for (const child of [node.props?.children].flat(Infinity)) {
    const result = find(child, type);
    if (result) return result;
  }
}

function modal(language, options = {}) {
  const states = [];
  let cursor = 0;
  let closes = 0;
  let generations = 0;
  const navigations = [];
  const initial = language === 'python' ? ['code', 'My prompt'] : ['My prompt'];
  if (options.mode && language === 'python') initial[0] = options.mode;
  if (options.prompt) initial[language === 'python' ? 1 : 0] = options.prompt;
  const react = { useState(value) {
    const index = cursor++;
    if (!(index in states)) states[index] = initial[index] ?? value;
    return [states[index], update => { states[index] = typeof update === 'function' ? update(states[index]) : update; }];
  } };
  const file = language === 'python' ? 'src/components/python/PythonAskAIModal.tsx' : 'src/components/c-lang/CAskAIModal.tsx';
  const component = evaluate(read(file), {
    react,
    'react/jsx-runtime': jsxRuntime,
    'lucide-react': new Proxy({}, { get: () => () => null }),
    'framer-motion': { motion: new Proxy({}, { get: () => () => null }), AnimatePresence: () => null },
    '../python/ui/Button': { Button: () => null },
    'next/navigation': { useRouter: () => ({ push: path => navigations.push(path) }) },
    '@/lib/ai-limits': limits,
  })[language === 'python' ? 'PythonAskAIModal' : 'CAskAIModal'];
  const props = {
    isOpen: true, language: 'en', onClose: () => { closes++; },
    onGenerate: async () => { generations++; if (options.fail !== false) throw new Error('AI response timed out. Please try again.'); },
  };
  return { states, navigations,
    render() { cursor = 0; return component(props); },
    get closes() { return closes; }, get generations() { return generations; },
  };
}

for (const language of ['python', 'c']) {
  test(`${language} generation dialog keeps its prompt and displays failures`, async () => {
    const fixture = modal(language);
    await find(fixture.render(), 'form').props.onSubmit({ preventDefault() {} });
    assert.equal(fixture.states[language === 'python' ? 1 : 0], 'My prompt');
    assert.equal(fixture.closes, 0);
    const alert = find(fixture.render(), 'alert');
    assert.match(alert.props.children, /timed out/);
  });

  test(`${language} generation dialog still clears and closes after success`, async () => {
    const fixture = modal(language, { fail: false });
    await find(fixture.render(), 'form').props.onSubmit({ preventDefault() {} });
    assert.equal(fixture.states[language === 'python' ? 1 : 0], '');
    assert.equal(fixture.closes, 1);
  });
}

test('overlong topic requests stay editable instead of navigating to an invalid lesson', async () => {
  const fixture = modal('python', { mode: 'explain', prompt: 'x'.repeat(201) });
  await find(fixture.render(), 'form').props.onSubmit({ preventDefault() {} });
  assert.equal(fixture.navigations.length, 0);
  assert.equal(fixture.closes, 0);
  assert.match(find(fixture.render(), 'alert').props.children, /Topic is too long/);
});

test('chat surfaces API limits and bounds outgoing context without deleting displayed messages', async () => {
  const old = Array.from({ length: 15 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: 'x'.repeat(4000) }));
  let messages = old;
  const calls = [];
  const send = callback('src/components/ai/KnoblyAI.tsx', 'send', {
    input: 'Hello', loading: false, messages,
    setInput() {}, setLoading() {}, setMessages: update => { messages = update(messages); },
    navigateTo() { assert.fail('Rejected request must not navigate'); },
    parseAIResponse() { assert.fail('Rejected response must not be parsed as an AI reply'); },
    fetch: async (url, init) => { calls.push(JSON.parse(init.body)); return Response.json({ error: 'Please shorten your request.' }, { status: 413 }); },
  });
  await send();
  assert.equal(messages.length, old.length + 2);
  assert.equal(messages[messages.length - 1].content, 'Please shorten your request.');
  assert.ok(calls[0].messages.length <= 10);
  assert.ok(calls[0].messages.reduce((sum, message) => sum + message.content.length, 0) <= 24000);
  assert.equal(old.length, 15);
});

test('chat keeps oversized unsent input available for editing without an API call', async () => {
  let cleared = false;
  let messages = [];
  const send = callback('src/components/ai/KnoblyAI.tsx', 'send', {
    input: 'x'.repeat(8001), loading: false, messages,
    setInput: () => { cleared = true; }, setMessages: update => { messages = update(messages); },
    fetch: () => { assert.fail('Oversized message must not reach the API'); },
  });
  await send();
  assert.equal(cleared, false);
  assert.match(messages[0].content, /too long/);
});
