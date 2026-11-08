import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import {renderToStaticMarkup} from 'react-dom/server';

function load(file, dependencies, globals = {}) {
    const exports = {};
    const compiled = ts.transpileModule(readFileSync(new URL('../' + file, import.meta.url), 'utf8'), {
        compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX},
    }).outputText;
    vm.runInNewContext(compiled, {exports, ...globals, require(name) {
        assert.ok(Object.hasOwn(dependencies, name), name);
        return dependencies[name];
    }});
    return exports.default;
}

test('NumPy initial HTML stays identical across independent server/client random sources', () => {
    function markup(random) {
        const math = Object.create(Math);
        math.random = random;
        const Page = load('src/app/python/numpy/page.tsx', {
            react: React, 'react/jsx-runtime': jsxRuntime,
            'next/link': {default: ({children, href}) => React.createElement('a', {href}, children)},
            'lucide-react': new Proxy({}, {get: () => () => null}),
        }, {Math: math});
        return renderToStaticMarkup(React.createElement(Page));
    }
    assert.ok(markup(() => 0) === markup(() => 0.99), 'Initial HTML depends on random values');
});

function clockHarness() {
    const cells = [], effects = [], timers = new Map();
    let cursor = 0, nextTimer = 0, rendering = false;
    let now = Date.parse('2026-01-10T12:00:00Z');
    const clock = class extends Date {
        constructor(...args) { super(...(args.length ? args : [now])); }
        static now() { assert.equal(rendering, false, 'Clock read during render'); return now; }
    };
    function slot(initial) {
        const index = cursor++;
        if (!(index in cells)) cells[index] = initial();
        return index;
    }
    const react = {
        useState(initial) {
            const index = slot(() => typeof initial === 'function' ? initial() : initial);
            return [cells[index], next => { cells[index] = typeof next === 'function' ? next(cells[index]) : next; }];
        },
        useRef: initial => cells[slot(() => ({current: initial}))],
        useCallback(callback) { slot(() => null); return callback; },
        useEffect(setup) { slot(() => { effects.push(setup); return null; }); },
    };
    const addTimer = repeat => (callback, delay) => {
        const id = ++nextTimer;
        timers.set(id, {callback, delay, repeat});
        return id;
    };
    const cleanups = [];
    return {
        react, cells, timers,
        globals: {Date: clock, setTimeout: addTimer(false), setInterval: addTimer(true),
            clearTimeout: id => timers.delete(id), clearInterval: id => timers.delete(id)},
        render(Component, props) {
            cursor = 0; rendering = true;
            try { return Component(props); } finally { rendering = false; }
        },
        mount() { for (const setup of effects) { const cleanup = setup(); if (cleanup) cleanups.push(cleanup); } },
        tick(delay, elapsed = 0) {
            now += elapsed;
            for (const [id, timer] of [...timers]) if (timer.delay === delay) {
                if (!timer.repeat) timers.delete(id);
                timer.callback();
            }
        },
        cleanup() { cleanups.forEach(fn => fn()); assert.equal(timers.size, 0, 'Leaked clock timer'); },
    };
}

function nodes(tree, type) {
    if (!tree || typeof tree !== 'object') return [];
    return [...(tree.type === type ? [tree] : []), ...[tree.props?.children].flat(Infinity).flatMap(child => nodes(child, type))];
}

test('app badges use a client clock, expire while open, reject future dates and clean up timers', () => {
    const h = clockHarness(), Card = () => null;
    const Grid = load('src/components/apps/AppGrid.tsx', {
        react: h.react, 'react/jsx-runtime': jsxRuntime,
        'framer-motion': {motion: {div: 'div'}}, './AppCard': {default: Card},
    }, h.globals);
    const apps = [
        {id: 'recent', created_at: '2026-01-10T11:00:00Z'},
        {id: 'expired', created_at: '2026-01-07T12:00:00Z'},
        {id: 'future', created_at: '2026-01-11T12:00:00Z'},
        {id: 'invalid', created_at: 'not-a-date'}, {id: 'missing'},
    ];
    const before = structuredClone(apps), clicks = [];
    const props = {apps, favourites: ['recent'], activeNav: 'home', performanceMode: false,
        onAppClick: app => clicks.push(app.id), onAppContextMenu() {}};
    const badges = () => nodes(h.render(Grid, props), Card).map(node => node.props.isNew);
    assert.deepEqual(badges(), [false, false, false, false, false]);
    h.mount(); h.tick(0);
    assert.deepEqual(badges(), [true, false, false, false, false]);
    const card = nodes(h.render(Grid, props), Card)[0];
    assert.equal(card.props.isFavourite, true); card.props.onClick();
    assert.deepEqual(clicks, ['recent']);
    h.tick(60000, 3 * 24 * 60 * 60 * 1000);
    assert.equal(badges()[0], false);
    assert.deepEqual(apps, before);
    h.cleanup();
});

test('home uptime starts at mount, survives rerenders and releases its interval', () => {
    const h = clockHarness(), storage = {getItem: key => key === 'knobly_booted' ? 'true' : null, setItem() {}};
    const Home = load('src/app/page.tsx', {
        react: h.react, 'react/jsx-runtime': jsxRuntime,
        'next/navigation': {useRouter: () => ({push() {}})},
        '@/context/AuthContext': {useAuth: () => ({user: null})},
        '@/context/ThemeContext': {useTheme: () => ({isDark: false, wallpaper: ''})},
        'framer-motion': {AnimatePresence: () => null, motion: {div: 'div', button: 'button'}},
        'firebase/firestore': {collection() {}, query() {}, orderBy() {}, getDocs: async () => ({docs: [], empty: true})},
        '@/lib/firebase': {db: {}},
        '@/components/layout/BootScreen': {default: () => null},
        '@/components/auth/LoginModal': {default: () => null},
        '@/components/apps/AppGrid': {default: () => null},
    }, {...h.globals, localStorage: storage, sessionStorage: storage,
        window: {innerWidth: 1200, addEventListener() {}, removeEventListener() {}},
        document: {body: {classList: {toggle() {}}}}, navigator: {}, fetch: async () => ({json: async () => ({})}),
    });
    h.render(Home); h.mount();
    h.tick(10000, 61000); h.render(Home);
    assert.ok(h.cells.includes('1 min'));
    h.tick(10000, 3600000); h.render(Home);
    assert.ok(h.cells.includes('1h 1m'));
    h.cleanup();
});
