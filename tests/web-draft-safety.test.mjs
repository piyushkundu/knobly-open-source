import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as jsxRuntime from 'react/jsx-runtime';

const keys = ['knobly_web_draft_html', 'knobly_web_draft_css', 'knobly_web_draft_js'];
const sample = ['<h1>My saved project</h1>', 'h1 { color: red; }', 'console.log("mine");'];
const source = ts.transpileModule(readFileSync(new URL('../src/components/web-compiler/WebLab.tsx', import.meta.url), 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX},
}).outputText;
function nodes(node, predicate) {
    if (!node || typeof node !== 'object') return [];
    return [...(predicate(node) ? [node] : []), ...[node.props?.children].flat(Infinity).flatMap(child => nodes(child, predicate))];
}

// Controlled retained hooks, effect replay and timers; no browser, SDK or cloud account.
function mount(storage = new Map(keys.map((key, i) => [key, sample[i]])), {strict = false, failRead = false} = {}) {
    const cells = [], effects = new Set(), timers = new Map(), mutations = [];
    let cursor = 0, dirty = true, tree, first = true, id = 0, confirmed = false;
    const equal = (a, b) => a?.length === b?.length && a.every((item, i) => Object.is(item, b[i]));
    const slot = init => { const i = cursor++; return cells[i] ??= init(); };
    const react = {
        useState(initial) { const state = slot(() => ({value: initial})); return [state.value, value => {
            if (typeof value === 'function') { const next = value(state.value); if (strict) value(state.value); value = next; }
            if (!Object.is(value, state.value)) { state.value = value; dirty = true; }
        }]; },
        useRef(initial) { return slot(() => ({current: initial})); },
        useCallback(callback, deps) { const state = slot(() => ({})); if (!equal(state.deps, deps)) { state.deps = deps; state.callback = callback; } return state.callback; },
        useEffect(setup, deps) { const state = slot(() => ({})); if (!equal(state.deps, deps)) { state.deps = deps; state.setup = setup; effects.add(state); } },
    };
    const localStorage = {
        getItem(key) { if (failRead && keys.includes(key)) throw Error('storage unavailable'); return storage.get(key) ?? null; },
        setItem(key, value) { mutations.push(['set', key, value]); storage.set(key, value); },
        removeItem(key) { mutations.push(['remove', key]); storage.delete(key); },
    };
    const fake = new Proxy({default: () => null}, {get: (target, key) => key === '__esModule' ? true : (target[key] ?? key)});
    const dependencies = {
        react, 'react/jsx-runtime': jsxRuntime,
        'next/navigation': {useRouter: () => ({push() {}})},
        '@/context/AuthContext': {useAuth: () => ({user: null})},
        '@/lib/preview-sandbox': {createPreviewConsoleBridge: () => '// sandbox bridge'},
    };
    const exports = {};
    vm.runInNewContext(source, {exports, require: name => dependencies[name] ?? fake, localStorage,
        window: {location: {origin: 'http://localhost:3000'}, confirm: () => confirmed},
        document: {documentElement: {classList: {toggle() {}, add() {}}}}, console: {error() {}},
        setTimeout(callback, delay) { const timerId = ++id; timers.set(timerId, {callback, delay}); return timerId; },
        clearTimeout: timerId => timers.delete(timerId),
    });
    const flush = () => {
        for (let attempts = 0; dirty && attempts < 30; attempts++) {
            dirty = false; cursor = 0; tree = exports.WebLab();
            const jobs = [...effects]; effects.clear();
            for (const effect of jobs) { effect.cleanup?.(); effect.cleanup = effect.setup(); }
            // Strict Mode replays mount effects before committing the queued state update.
            if (first && strict) {
                for (const effect of jobs) effect.cleanup?.();
                for (const effect of jobs) effect.cleanup = effect.setup();
            }
            first = false;
        }
        assert.equal(dirty, false, 'unexpected render loop');
    };
    const find = predicate => { flush(); const result = nodes(tree, predicate)[0]; assert.ok(result, 'missing UI node'); return result; };
    const app = {
        storage, mutations, flush,
        editor: () => find(n => n.props?.onChange && n.props?.onSwitchTab),
        preview: () => find(n => n.props?.html !== undefined || n.props?.bundledHtml !== undefined),
        run() { find(n => n.props?.['data-run-button']).props.onClick(); flush(); },
        pause() { find(n => n.type === 'button' && n.props?.className?.startsWith('w-7 h-4')).props.onClick(); flush(); },
        edit(code, index = 0) { app.editor().props.onSwitchTab(index); flush(); app.editor().props.onChange(code); flush(); },
        reset(allow) { confirmed = allow; find(n => n.props?.title === 'Reset to Template').props.onClick(); flush(); },
        load(project) { find(n => n.props?.onLoadProject).props.onLoadProject(project); flush(); },
        ai(code) { find(n => n.props?.onApplyGeneratedCode).props.onApplyGeneratedCode(code); flush(); },
        tick() { for (const [timerId, timer] of [...timers]) { if (!timers.delete(timerId)) continue; timer.callback(); flush(); } },
        unmount() { for (const cell of cells) cell.cleanup?.(); },
    };
    flush(); return app;
}
function codes(app) { return Array.from(app.editor().props.tabs, tab => tab.code); }

for (const strict of [false, true]) {
    test(`restore and reload preserve all draft bytes without writes (effect replay ${strict})`, () => {
        const app = mount(undefined, {strict}); assert.deepEqual(codes(app), sample);
        app.tick(); assert.deepEqual(app.mutations, []); app.unmount();
        const reloaded = mount(app.storage, {strict}); reloaded.tick();
        assert.deepEqual(codes(reloaded), sample); assert.deepEqual(reloaded.mutations, []);
    });
}
test('draft content matching former starter markers is never deleted', () => {
    for (const marker of ['Knobly Web Compiler', 'Welcome to the AI-powered live web development lab', 'interactive-box']) {
        const draft = `<h1>${marker}</h1>\n<!-- my own changes -->`;
        const app = mount(new Map(keys.map((key, i) => [key, i ? sample[i] : draft])), {strict: true});
        assert.deepEqual(codes(app), [draft, ...sample.slice(1)]); app.tick(); assert.deepEqual(app.mutations, []);
    }
});
test('missing, partial and intentionally empty drafts are not created or normalized on load', () => {
    for (const storage of [new Map(), new Map([[keys[0], '']]), new Map([[keys[1], sample[1]]]), new Map(keys.map(key => [key, '']))]) {
        const before = [...storage]; const app = mount(storage, {strict: true}); app.tick();
        assert.deepEqual([...storage], before); assert.deepEqual(app.mutations, []);
    }
});
test('editing autosaves only changed draft keys even while Auto-Run is paused', () => {
    const app = mount(undefined, {strict: true}); app.pause(); app.edit('<p>new work</p>'); app.tick();
    assert.deepEqual(app.mutations, [['set', keys[0], '<p>new work</p>']]);
    assert.deepEqual(codes(mount(app.storage)), ['<p>new work</p>', ...sample.slice(1)]);
});
test('Run uses the restored source without rewriting untouched drafts', () => {
    const app = mount(); app.run(); app.tick();
    assert.ok((app.preview().props.html ?? app.preview().props.bundledHtml).includes(sample[0]));
    assert.deepEqual(app.mutations, []);
});
test('unreadable drafts cannot be overwritten by initial effects or later edits', () => {
    const app = mount(undefined, {failRead: true, strict: true}); app.tick(); app.edit('new text'); app.run(); app.tick();
    assert.deepEqual(app.mutations, []); assert.deepEqual([...app.storage.values()], sample);
});
test('confirmed reset clears drafts and preview; cancellation leaves them intact', () => {
    const app = mount(); app.reset(false); app.tick(); assert.deepEqual(app.mutations, []);
    app.reset(true); app.tick(); assert.deepEqual(codes(app), ['', '', '']);
    assert.deepEqual(app.mutations, keys.map(key => ['remove', key]));
    assert.ok(!(app.preview().props.html ?? app.preview().props.bundledHtml).includes(sample[0]));
    assert.deepEqual(codes(mount(app.storage)), ['', '', '']);
});
test('loading a project compiles and persists its source even with Auto-Run paused', () => {
    const app = mount(); app.pause(); app.load({html: '<p>selected project</p>', css: 'p { color: blue; }', js: 'console.log(2)', title: 'Saved'}); app.tick();
    assert.deepEqual(codes(app), ['<p>selected project</p>', 'p { color: blue; }', 'console.log(2)']);
    assert.ok((app.preview().props.html ?? app.preview().props.bundledHtml).includes('selected project'));
    assert.deepEqual(keys.map(key => app.storage.get(key)), codes(app));
});
test('applying AI code compiles the new buffer instead of a captured previous buffer', () => {
    const app = mount(); app.pause(); app.ai('<p>applied code</p>'); app.tick();
    assert.ok((app.preview().props.html ?? app.preview().props.bundledHtml).includes('applied code'));
    assert.equal(app.storage.get(keys[0]), '<p>applied code</p>');
});
