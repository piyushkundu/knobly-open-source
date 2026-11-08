import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function countdown(seconds, expire = () => {}) {
    let now = 100000, id = 0, expirations = 0;
    const timers = new Map(), ticks = [], callbacks = [];
    const add = repeat => callback => { const key = ++id; timers.set(key, {callback, repeat}); callbacks.push(callback); return key; };
    const exports = {};
    vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../src/lib/exam-countdown.ts', import.meta.url), 'utf8'), {
        compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
    }).outputText, {exports, Date: {now: () => now}, setInterval: add(true), setTimeout: add(false),
        clearInterval: key => timers.delete(key), clearTimeout: key => timers.delete(key)});
    const stop = exports.startExamCountdown(now + seconds * 1000, value => ticks.push(value), () => { expirations++; expire(); });
    return {timers, ticks, callbacks, stop, expirations: () => expirations,
        advance(ms) { now += ms; for (const [key, timer] of [...timers]) { if (!timer.repeat) timers.delete(key); timer.callback(); } }};
}

test('countdown catches up after a suspended/delayed browser tick and expires once', () => {
    const c = countdown(11); c.advance(0); assert.equal(c.ticks.at(-1), 11);
    c.advance(7000); assert.equal(c.ticks.at(-1), 4);
    c.advance(9000); assert.equal(c.ticks.at(-1), 0); assert.equal(c.expirations(), 1);
    c.callbacks.forEach(callback => callback()); assert.equal(c.expirations(), 1); assert.equal(c.timers.size, 0);
});
test('countdown cancellation ignores queued callbacks and removes both timers', () => {
    const c = countdown(60); c.stop(); c.advance(60000); c.callbacks.forEach(callback => callback());
    assert.deepEqual(c.ticks, []); assert.equal(c.expirations(), 0); assert.equal(c.timers.size, 0);
});
test('an already expired attempt expires on its first callback without negative time', () => {
    const c = countdown(0); assert.equal(c.expirations(), 0); c.advance(0);
    assert.deepEqual(c.ticks, [0]); assert.equal(c.expirations(), 1); assert.equal(c.timers.size, 0);
});
test('expired timer does not keep retrying a failed submission callback in the background', async () => {
    const attempts = [];
    const c = countdown(1, () => { attempts.push(Promise.reject(new Error('Unavailable')).catch(() => false)); });
    c.advance(1000); await Promise.all(attempts); c.advance(10000);
    assert.equal(attempts.length, 1);
    assert.equal(c.expirations(), 1); assert.equal(c.timers.size, 0);
});
