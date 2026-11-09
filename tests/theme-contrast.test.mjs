import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';

const dashboard = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8');
const shortcuts = readFileSync(new URL('../src/app/shortcuts/page.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

test('fixed dark settings controls keep their light foreground in both themes', () => {
    assert.match(dashboard, /className="theme-fixed self-start[^\"]*bg-slate-700 text-white[^\"]*"[\s\S]*?Save Guest Name/);
    assert.match(dashboard, /className="theme-fixed flex items-center gap-2 bg-emerald-900\/20[^\"]*"[\s\S]*?User ID Active/);
});

test('dynamic shortcut gradients protect their white heading and count from light-theme text overrides', () => {
    assert.match(shortcuts, /className=\{`theme-fixed bg-gradient-to-r \$\{group\.gradient\}[^`]*`\}[\s\S]*?text-white text-lg[\s\S]*?text-white">\{group\.title\}/);
});

test('theme-fixed content is excluded from light-theme text remapping', () => {
    assert.match(styles, /\.text-white:not\(:where\(\.theme-fixed, \.theme-fixed \*\)\)\s*\{\s*color: #0f172a !important;/);
});
