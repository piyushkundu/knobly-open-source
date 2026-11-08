import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as jsxRuntime from 'react/jsx-runtime';

function load(file, dependencies = {}, globals = {}, fallback) {
    const source = readFileSync(new URL('../' + file, import.meta.url), 'utf8');
    const exports = {};
    vm.runInNewContext(ts.transpileModule(source, {compilerOptions: {
        module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
    }}).outputText, {exports, ...globals, require(name) {
        if (Object.hasOwn(dependencies, name)) return dependencies[name];
        assert.ok(fallback, name); return fallback(name);
    }});
    return exports;
}
const folderModule = load('src/lib/python-folders.ts');
const legacyFolders = [
    {name: 'Projects', color: '#123456', icon: 'P', custom: 'preserve'},
    {name: 'School', color: '#234567', icon: 'S'},
    {name: 'Experiments', color: '#345678', icon: 'E'},
];
const copy = value => JSON.parse(JSON.stringify(value));

test('folder subscription preserves legacy names and bytes without creating a version marker', () => {
    const raw = JSON.stringify(legacyFolders), writes = [], reads = [];
    const store = folderModule.createPythonFolderStore(() => ({getItem(key) { reads.push(key); return raw; }, setItem: (...args) => writes.push(args)}));
    assert.deepEqual(reads, []); const server = store.getServerSnapshot();
    const unsubscribe = store.subscribe(() => {});
    assert.deepEqual(copy(store.getSnapshot()), legacyFolders); assert.deepEqual(writes, []);
    assert.deepEqual(reads, ['knobly-custom-folders']);
    assert.equal(store.getSnapshot(), store.getSnapshot()); assert.equal(store.getServerSnapshot(), server);
    unsubscribe(); store.subscribe(() => {})(); assert.equal(reads.length, 1);
});

test('missing or unreadable folder preferences stay untouched until an explicit replacement', () => {
    for (const raw of [null, '{invalid-json', '{}', '[]']) {
        const writes = [];
        const store = folderModule.createPythonFolderStore(() => ({getItem: () => raw, setItem: (...args) => writes.push(args)}));
        const before = store.getServerSnapshot(); store.subscribe(() => {});
        assert.deepEqual(writes, []);
        const updated = [...store.getSnapshot(), {name: 'Mine', color: '#000000', icon: 'M'}];
        store.replace(updated);
        assert.deepEqual(writes, [['knobly-custom-folders', JSON.stringify(updated)]]);
        assert.equal(before.length, 1);
    }
});

function text(node) {
    if (node === null || node === undefined || typeof node === 'boolean') return '';
    if (typeof node !== 'object') return String(node);
    return [node.props?.children].flat(Infinity).map(text).join('');
}
function nodes(node, predicate) {
    if (!node || typeof node !== 'object') return [];
    return [...(predicate(node) ? [node] : []), ...[node.props?.children].flat(Infinity).flatMap(child => nodes(child, predicate))];
}

// Retained hooks/effects with guarded refs, synthetic DOM/clipboard/storage.
// Child editor/runtime/cloud hooks are mocked; no SDK or production service loads.
function ui(file, name, initialProps = {}) {
    let cells = [], cursor = 0, dirty = true, rendering = false, tree, props = initialProps, nextId = 0;
    const effects = new Set(), timers = new Map(), listeners = new Map(), writes = [], reads = [], calls = [], copied = [];
    const storageData = new Map([['knobly-custom-folders', JSON.stringify(legacyFolders)], ['python-code', 'print("local work")']]);
    const storage = {getItem(key) { reads.push(key); return storageData.get(key) ?? null; }, setItem(key, value) { writes.push({key, value}); storageData.set(key, value); }};
    const same = (a, b) => a?.length === b?.length && a.every((value, i) => Object.is(value, b[i]));
    const slot = initialize => { const i = cursor++; if (!(i in cells)) cells[i] = initialize(); return cells[i]; };
    const react = {
        useState(initial) {
            const state = slot(() => ({value: typeof initial === 'function' ? initial() : initial}));
            return [state.value, value => { const next = typeof value === 'function' ? value(state.value) : value;
                if (!Object.is(next, state.value)) { state.value = next; dirty = true; } }];
        },
        useRef(initial) {
            return slot(() => { let current = initial; return Object.defineProperty({}, 'current', {
                get() { assert.equal(rendering, false, 'Ref read during render'); return current; },
                set(value) { current = value; },
            }); });
        },
        useMemo(calculate, deps) { const state = slot(() => ({})); if (!same(state.deps, deps)) { state.value = calculate(); state.deps = deps; } return state.value; },
        useCallback(callback, deps) { return react.useMemo(() => callback, deps); },
        useEffect(setup, deps) {
            const state = slot(() => ({}));
            if (!same(state.deps, deps)) { state.deps = deps; state.setup = setup; effects.add(state); }
        },
        useSyncExternalStore(subscribe, snapshot) {
            const state = slot(() => ({setup: () => subscribe(() => { dirty = true; })}));
            if (!state.subscribed) { state.subscribed = true; effects.add(state); } return snapshot();
        },
    };
    const body = {style: {cursor: 'crosshair', userSelect: 'text'}};
    const globals = {localStorage: storage, navigator: {clipboard: {writeText: async value => { copied.push(value); }}},
        window: {innerWidth: 1024, addEventListener() {}, removeEventListener() {}},
        document: {body, documentElement: {classList: {toggle() {}, add() {}, remove() {}}},
            addEventListener(type, handler) { (listeners.get(type) ?? (listeners.set(type, new Set()), listeners.get(type))).add(handler); },
            removeEventListener: (type, handler) => listeners.get(type)?.delete(handler)},
        setTimeout(callback, delay) { const id = ++nextId; timers.set(id, {callback, delay}); return id; },
        clearTimeout: id => timers.delete(id), console,
    };
    const component = () => null;
    const fakeExports = new Proxy({default: component}, {get: (_target, key) => key === '__esModule' ? true : component});
    const deps = {
        react, 'react/jsx-runtime': jsxRuntime,
        'lucide-react': fakeExports, 'framer-motion': {motion: {div: 'div'}, AnimatePresence: 'section'},
        'next/navigation': {useRouter: () => ({push() {}})},
        '@/lib/python-utils': {cn: (...items) => items.filter(Boolean).join(' ')},
        '@/lib/ai-limits': {aiClientError: () => ''},
        '@/lib/python-folders': load('src/lib/python-folders.ts', {}, globals),
        '@/hooks/usePyodide': {usePyodide: () => ({isLoading: false, isReady: true, executeCode: async () => { throw Error('Unexpected execution'); }})},
        '@/hooks/useJSCPP': {useJSCPP: () => ({isLoading: false, isReady: true, executeCode: async () => { throw Error('Unexpected execution'); }})},
        '@/hooks/useAIExplain': {useAIExplain: () => ({isLoading: false, clearExplanation() {}})},
        '@/hooks/useCodeHistory': {useCodeHistory: () => ({history: []})},
        '@/context/AuthContext': {useAuth: () => ({user: null, logout() {}})},
        '@/hooks/useSavedCodes': {useSavedCodes: () => ({codes: [], isLoading: false, isLoggedIn: false})},
    };
    const exports = load(file, deps, globals, module => { assert.ok(module.startsWith('.') || module === '@/components/auth/LoginModal', module); return fakeExports; });
    const Component = exports[name];
    const flush = () => {
        for (let count = 0; dirty && count < 30; count++) {
            dirty = false; cursor = 0; rendering = true;
            try {
                tree = Component(props);
                while (tree && typeof tree.type === 'function') tree = tree.type(tree.props);
            } finally { rendering = false; }
            for (const effect of [...effects]) { effects.delete(effect); effect.cleanup?.(); effect.cleanup = effect.setup(); }
        }
        assert.equal(dirty, false, 'Render loop'); return tree;
    };
    const unmount = () => { cells.forEach(state => state.cleanup?.()); cells = []; effects.clear(); };
    flush();
    return {body, timers, listeners, writes, reads, calls, copied, storageData, flush,
        find: predicate => nodes(flush(), predicate),
        setProps(next) { if (props.isOpen && !next.isOpen) unmount(); props = next; dirty = true; flush(); },
        emit(type, event) { [...(listeners.get(type) ?? [])].forEach(handler => handler(event)); flush(); },
        unmount,
    };
}

const snippet = {id: 'demo-snippet', title: 'Example.py', code: 'print("saved work")', folder: 'Projects', isImportant: false, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z'};
function modalProps(calls) {
    return {isOpen: true, codes: [snippet], isLoading: false, currentCode: 'print("buffer")',
        onClose() {}, onSave: async (...args) => { calls.push(['save', ...args]); },
        onDelete: async id => { calls.push(['delete', id]); }, onToggleImportant: async () => {},
        onUpdate: async (...args) => { calls.push(['update', ...args]); }, onSelect: item => { calls.push(['select', item]); }};
}

test('closed and opened save dialogs never migrate folder settings or write saved code', () => {
    for (const [file, name, props] of [
        ['src/components/python/SavedCodesModal.tsx', 'SavedCodesModal', modalProps([])],
        ['src/components/python/SaveFilePopup.tsx', 'SaveFilePopup', {isOpen: true, initialName: 'Example.py', onClose() {}, onSave() { throw Error('Unexpected save'); }}],
    ]) {
        const app = ui(file, name, {...props, isOpen: false});
        assert.equal(app.flush(), null); assert.deepEqual(app.writes, []); assert.deepEqual(app.reads, []);
        app.setProps(props); assert.deepEqual(app.writes, []);
        assert.equal(app.storageData.get('knobly-custom-folders'), JSON.stringify(legacyFolders));
        app.setProps({...props, isOpen: false}); assert.equal(app.timers.size, 0);
    }
});

test('saved snippet menu keeps action payloads and requires confirmation before deletion', async () => {
    const calls = [], props = modalProps(calls), before = copy(props.codes);
    const app = ui('src/components/python/SavedCodesModal.tsx', 'SavedCodesModal', props);
    const card = app.find(n => n.props?.onMenu && n.props?.item?.id === snippet.id)[0];
    const cardTree = card.type(card.props), transfers = [];
    const draggable = nodes(cardTree, n => n.props?.draggable)[0];
    (draggable.props.onDragStartCapture ?? draggable.props.onDragStart)({dataTransfer: {setData: (...args) => transfers.push(args)}});
    assert.deepEqual(transfers, [['code_id', snippet.id]]);
    const openMenu = () => {
        const card = app.find(n => n.props?.onMenu && n.props?.item?.id === snippet.id)[0]; assert.ok(card);
        card.props.onMenu({stopPropagation() {}, target: {getBoundingClientRect: () => ({right: 600, bottom: 200})}}, snippet); app.flush();
    };
    const clickAction = label => { const action = app.find(n => n.props?.onClick && text(n).trim() === label)[0]; assert.ok(action, label); action.props.onClick(); app.flush(); };
    openMenu(); clickAction('📋 Copy Code'); await Promise.resolve(); app.flush();
    assert.deepEqual(app.copied, [snippet.code]); assert.deepEqual(calls, []);
    openMenu(); clickAction('📄 Duplicate'); await Promise.resolve(); app.flush();
    assert.deepEqual(calls, [['save', snippet.title + ' (copy)', snippet.code, undefined, 'Projects', undefined]]);
    openMenu(); clickAction('🗑 Delete'); assert.equal(calls.length, 1);
    clickAction('Cancel'); assert.equal(calls.length, 1);
    openMenu(); clickAction('🗑 Delete'); clickAction('Delete'); await Promise.resolve(); app.flush();
    assert.deepEqual(calls[1], ['delete', snippet.id]); assert.deepEqual(props.codes, before);
    assert.deepEqual(app.writes, []); app.unmount(); assert.equal(app.timers.size, 0);
});

function resizer() {
    const app = ui('src/components/python/PythonLab.tsx', 'PythonLab');
    let width = 1000;
    const main = () => app.find(n => n.type === 'main')[0];
    main().props.ref.current = {getBoundingClientRect: () => ({left: 0, width}), querySelector: () => ({getBoundingClientRect: () => ({width: 100})})};
    const start = () => { const bar = app.find(n => n.props?.onMouseDown && n.props?.style?.cursor === 'col-resize')[0]; assert.ok(bar); bar.props.onMouseDown({preventDefault() {}}); app.flush(); };
    return {app, main, start, setWidth: value => { width = value; }};
}

test('resize cursor is reactive, width is clamped and mouseup restores pre-existing body styles', () => {
    const {app, main, start, setWidth} = resizer();
    start(); assert.equal(main().props.style.cursor, 'col-resize');
    const width = () => app.find(n => n.props?.style?.flex?.startsWith('1 1 '))[0].props.style.flex;
    app.emit('mousemove', {clientX: -100}); assert.equal(width(), '1 1 25%');
    app.emit('mousemove', {clientX: 2000}); assert.equal(width(), '1 1 80%');
    setWidth(50); app.emit('mousemove', {clientX: 30}); assert.equal(width(), '1 1 80%');
    app.emit('mouseup', {}); assert.equal(main().props.style.cursor, undefined);
    assert.deepEqual(app.body.style, {cursor: 'crosshair', userSelect: 'text'});
    assert.equal(app.listeners.get('mousemove').size, 0); assert.equal(app.listeners.get('mouseup').size, 0);
    assert.deepEqual(app.writes, []); app.unmount();
});

test('unmount during resize removes listeners and restores body styles without saving', () => {
    const {app, start} = resizer(); start(); app.unmount();
    assert.equal(app.listeners.get('mousemove').size, 0); assert.equal(app.listeners.get('mouseup').size, 0);
    assert.deepEqual(app.body.style, {cursor: 'crosshair', userSelect: 'text'}); assert.deepEqual(app.writes, []);
});
