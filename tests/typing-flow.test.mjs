import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as jsxRuntime from 'react/jsx-runtime';

function load(file, dependencies = {}, globals = {}) {
    const source = readFileSync(new URL('../' + file, import.meta.url), 'utf8');
    const exports = {};
    vm.runInNewContext(ts.transpileModule(source, {compilerOptions: {
        module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
    }}).outputText, {exports, ...globals, require(name) {
        assert.ok(Object.hasOwn(dependencies, name), name); return dependencies[name];
    }});
    return exports;
}
const data = load('src/components/typing/typingData.ts');
const statsModule = load('src/lib/typing-stats.ts', {'@/components/typing/typingData': data});
const copy = value => JSON.parse(JSON.stringify(value));

test('typing snapshots load without writes and preserve saved legacy fields and prior snapshots', () => {
    const saved = {...copy(data.DEFAULT_STATS), bestWpm: 73, legacy: {keep: true}};
    const raw = JSON.stringify(saved), writes = [];
    let reads = 0;
    const store = statsModule.createTypingStatsStore(() => ({getItem(key) {
        assert.equal(key, 'knobly-typing-stats'); reads++; return raw;
    }, setItem(key, value) { writes.push({key, value}); }}));
    const server = store.getServerSnapshot();
    assert.equal(reads, 0); assert.equal(store.getSnapshot(), server);
    let notifications = 0;
    const unsubscribe = store.subscribe(() => notifications++);
    assert.equal(reads, 1); assert.deepEqual(writes, []);
    const previous = store.getSnapshot();
    assert.deepEqual(copy(previous), saved); assert.equal(previous, store.getSnapshot());
    store.update(s => ({...s, totalCharsTyped: s.totalCharsTyped + 1}));
    assert.equal(writes.length, 1); assert.equal(notifications, 2);
    assert.deepEqual(JSON.parse(writes[0].value).legacy, {keep: true});
    assert.equal(previous.totalCharsTyped, 0); assert.equal(store.getSnapshot().totalCharsTyped, 1);
    assert.equal(server.totalCharsTyped, 0);
    unsubscribe(); store.update(s => ({...s, totalCharsTyped: s.totalCharsTyped + 1}));
    assert.equal(notifications, 2);
});

test('invalid saved JSON is not rewritten during initialization or resubscription', () => {
    const writes = [];
    const store = statsModule.createTypingStatsStore(() => ({getItem: () => '{bad-json', setItem: (...args) => writes.push(args)}));
    store.subscribe(() => {})(); store.subscribe(() => {})();
    assert.deepEqual(writes, []);
    assert.deepEqual(copy(store.getSnapshot()), copy(data.DEFAULT_STATS));
});

test('stats updates preserve prior awards and do not duplicate an already earned achievement', () => {
    const saved = {...copy(data.DEFAULT_STATS), bestWpm: 30, achievements: ['first_lesson'], lessonsCompleted: [1]};
    let value = JSON.stringify(saved);
    const store = statsModule.createTypingStatsStore(() => ({getItem: () => value, setItem: (_key, next) => { value = next; }}));
    store.subscribe(() => {});
    store.update(s => ({...s, totalWordsTyped: s.totalWordsTyped + 1}));
    store.update(s => ({...s, totalWordsTyped: s.totalWordsTyped + 1}));
    const result = JSON.parse(value);
    assert.equal(result.bestWpm, 30); assert.deepEqual(result.lessonsCompleted, [1]);
    assert.deepEqual(result.achievements, ['first_lesson', 'wpm_30']);
    assert.equal(result.totalWordsTyped, 2);
});

function text(node) {
    if (node === null || node === undefined || typeof node === 'boolean') return '';
    if (typeof node !== 'object') return String(node);
    return [node.props?.children].flat(Infinity).map(text).join('');
}
function nodes(node, type) {
    if (!node || typeof node !== 'object') return [];
    return [...(node.type === type ? [node] : []), ...[node.props?.children].flat(Infinity).flatMap(child => nodes(child, type))];
}

// Retained state/effects, replayed functional updaters and deterministic timers.
// Browser DOM/audio and localStorage are synthetic; no Firebase is loaded.
function page() {
    const cells = [], pending = new Set(), timers = new Map(), frames = new Map(), listeners = new Map(), writes = [];
    const initial = {...copy(data.DEFAULT_STATS), bestWpm: 42, legacy: 'preserve'};
    let stored = JSON.stringify(initial), cursor = 0, id = 0, now = 1_000_000, dirty = true, inUpdater = false, tree;
    const storage = {getItem: () => stored, setItem(key, value) {
        assert.equal(inUpdater, false, 'Persistent write inside a replayable React state updater');
        writes.push({key, value}); stored = value;
    }};
    const equal = (a, b) => a?.length === b?.length && a.every((v, i) => Object.is(v, b[i]));
    const slot = initial => { const i = cursor++; if (!(i in cells)) cells[i] = initial(); return cells[i]; };
    const react = {
        useState(initial) {
            const s = slot(() => ({value: typeof initial === 'function' ? initial() : initial}));
            return [s.value, next => {
                if (typeof next === 'function') {
                    inUpdater = true;
                    try { next(s.value); next = next(s.value); } finally { inUpdater = false; }
                }
                if (!Object.is(next, s.value)) { s.value = next; dirty = true; }
            }];
        },
        useRef: initial => slot(() => ({current: initial})),
        useCallback(callback, deps) {
            const s = slot(() => ({})); if (!equal(s.deps, deps)) { s.callback = callback; s.deps = deps; } return s.callback;
        },
        useEffect(setup, deps) {
            const s = slot(() => ({}));
            if (!equal(s.deps, deps)) { s.deps = deps; s.setup = setup; pending.add(s); }
        },
        useEffectEvent(callback) { const s = slot(() => ({})); s.callback = callback; return s.event ??= (...args) => s.callback(...args); },
        useSyncExternalStore(subscribe, getSnapshot) {
            const s = slot(() => ({setup: () => subscribe(() => { dirty = true; })}));
            if (!s.subscribed) { s.subscribed = true; pending.add(s); }
            return getSnapshot();
        },
        startTransition: callback => callback(),
    };
    const addTimer = repeat => (callback, delay) => { const key = ++id; timers.set(key, {callback, delay, repeat}); return key; };
    const globals = {
        localStorage: storage, performance: {now: () => now},
        Date: class extends Date { static now() { return now; } },
        Math: Object.assign(Object.create(Math), {random: () => 0}),
        setTimeout: addTimer(false), setInterval: addTimer(true),
        clearTimeout: key => timers.delete(key), clearInterval: key => timers.delete(key),
        requestAnimationFrame: callback => { const key = ++id; frames.set(key, callback); return key; },
        cancelAnimationFrame: key => frames.delete(key),
        document: {addEventListener: (type, fn) => listeners.set(type, fn), removeEventListener: (type, fn) => { if (listeners.get(type) === fn) listeners.delete(type); }},
    };
    globals.window = globals;
    const store = load('src/lib/typing-stats.ts', {'@/components/typing/typingData': data}, globals);
    const Component = load('src/app/typing/page.tsx', {
        react, 'react/jsx-runtime': jsxRuntime,
        'next/navigation': {useRouter: () => ({back() {}, push() {}})},
        '@/context/ThemeContext': {useTheme: () => ({isDark: false})},
        'framer-motion': {motion: {div: 'div'}, AnimatePresence: 'section'},
        '@/components/typing/TypingKeyboard': {default: () => null},
        '@/components/typing/TypingHands': {default: () => null},
        '@/components/typing/typingData': {...data, playKeySound() {}},
        '@/lib/typing-stats': store,
    }, globals).default;
    const flush = () => {
        for (let guard = 0; dirty && guard < 30; guard++) {
            dirty = false; cursor = 0; tree = Component();
            for (const s of [...pending]) { pending.delete(s); s.cleanup?.(); s.cleanup = s.setup(); }
        }
        assert.equal(dirty, false, 'Render loop');
        return tree;
    };
    flush();
    return {
        writes, timers, frames, flush,
        stats: () => JSON.parse(stored),
        click(label) { const button = nodes(flush(), 'button').find(n => text(n).trim() === label); assert.ok(button, label); button.props.onClick(); flush(); },
        key(key) { listeners.get('keydown')?.({key, preventDefault() {}}); flush(); },
        tick(delay, elapsed = 0) {
            now += elapsed;
            const callbacks = [];
            for (const [key, timer] of [...timers]) if (timer.delay === delay) {
                if (!timer.repeat) timers.delete(key); callbacks.push(timer.callback); timer.callback();
            }
            flush(); return callbacks;
        },
        gameInput(value) { const input = nodes(flush(), 'input')[0]; assert.ok(input); input.props.onChange({target: {value}}); flush(); },
        frame(elapsed) { now += elapsed; const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn(now)); flush(); },
        unmount() {
            cells.forEach(s => s.cleanup?.());
            assert.equal(timers.size, 0, 'Leaked timer'); assert.equal(frames.size, 0, 'Leaked animation');
            assert.equal(listeners.size, 0, 'Leaked keyboard listener');
        },
    };
}

test('timed test finishes once after a delayed tick, preserves saved stats and leaves no test timer', () => {
    const app = page(); assert.equal(app.writes.length, 0);
    app.click('Speed Test'); app.click('1 MINUTE'); app.key('T');
    const callbacks = app.tick(1000, 60_000);
    assert.match(text(app.flush()), /Test Complete!/);
    assert.equal(app.stats().totalTestsTaken, 1); assert.equal(app.stats().legacy, 'preserve');
    assert.equal(app.stats().bestWpm, 42);
    callbacks.forEach(fn => fn()); app.flush();
    assert.equal(app.stats().totalTestsTaken, 1);
    assert.ok(![...app.timers.values()].some(t => t.repeat && t.delay === 1000));
    app.unmount();
});

test('leaving a running test or unmounting stops its interval without recording a result', () => {
    const app = page(); app.click('Speed Test'); app.click('3 MINUTES'); app.key('T');
    app.click('My Progress');
    assert.ok(![...app.timers.values()].some(t => t.repeat && t.delay === 1000));
    app.tick(1000, 180_000); assert.equal(app.stats().totalTestsTaken, 0);
    app.click('Speed Test'); app.click('1 MINUTE'); app.unmount();
    assert.equal(app.timers.size, 0); assert.equal(app.frames.size, 0);
});

test('game scoring writes once outside replayable updaters and game resources stop on mode change', () => {
    const app = page(); app.click('Falling Words'); app.click('START GAME'); app.tick(1850);
    assert.equal(app.stats().gamesPlayed, 1);
    const before = app.writes.length;
    app.gameInput('the');
    assert.equal(app.writes.length, before + 1); assert.equal(app.stats().highScore, 30);
    app.tick(1850); app.frame(4000); // One missed word costs one life, without nested updater side effects.
    assert.equal(nodes(app.flush(), 'i').filter(n => n.props.className === 'ph-fill ph-heart' && n.props.style.color === '#ef4444').length, 4);
    app.click('My Progress');
    assert.equal(app.frames.size, 0);
    assert.ok(![...app.timers.values()].some(t => t.repeat));
    app.unmount();
});

test('practice counters update immediately and smart practice uses the latest weak-key snapshot', () => {
    const app = page(); app.click('Free Practice');
    for (let i = 0; i < 4; i++) app.key('x');
    assert.equal(app.stats().totalCharsTyped, 4); assert.equal(app.stats().totalErrors, 4);
    assert.equal(app.stats().keyErrors.x, 4); assert.equal(app.stats().legacy, 'preserve');
    app.click('Smart Practice'); app.click('Generate');
    assert.equal(nodes(app.flush(), 'span').filter(n => text(n) === 'x').length, 40);
    app.unmount();
});

test('lesson redo remounts character boxes and leaving a finished exercise cancels delayed advancement', () => {
    const app = page(); app.click('Start');
    const boxes = () => nodes(app.flush(), 'div').filter(n => n.props.className === 'flex items-center justify-center rounded-lg select-none');
    const initialKey = boxes()[0].key;
    app.key('a'); app.click('Redo');
    assert.notEqual(boxes()[0].key, initialKey);
    for (const key of data.LESSONS[0].exercises[0]) app.key(key);
    app.click('Back'); app.tick(300); app.click('Start');
    assert.match(text(app.flush()), /Exercise 1 of 5/);
    assert.equal(app.stats().lessonsCompleted.length, 0);
    app.unmount();
});
