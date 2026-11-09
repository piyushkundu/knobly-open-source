import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';

const dashboard = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8');
const studentDashboard = readFileSync(new URL('../src/app/dashboard/page.tsx', import.meta.url), 'utf8');
const shortcuts = readFileSync(new URL('../src/app/shortcuts/page.tsx', import.meta.url), 'utf8');
const typing = readFileSync(new URL('../src/app/typing/page.tsx', import.meta.url), 'utf8');
const typingKeyboard = readFileSync(new URL('../src/components/typing/TypingKeyboard.tsx', import.meta.url), 'utf8');
const pythonLists = readFileSync(new URL('../src/app/python/lists/page.tsx', import.meta.url), 'utf8');
const pythonTuples = readFileSync(new URL('../src/app/python/tuples/page.tsx', import.meta.url), 'utf8');
const savedCodes = readFileSync(new URL('../src/components/python/SavedCodesModal.tsx', import.meta.url), 'utf8');
const aiTopic = readFileSync(new URL('../src/app/ai/topic/[slug]/page.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

function luminance(hex) {
    const rgb = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255)
        .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrastRatio(first, second) {
    const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
}

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

test('typing helper text stays readable in both themes and colored labels use neutral text', () => {
    assert.match(typing, /const textSub = isDark \? '#94a3b8' : '#475569';/);
    assert.ok(contrastRatio('#94a3b8', '#0f172a') >= 4.5);
    assert.ok(contrastRatio('#475569', '#f1f5f9') >= 4.5);
    assert.match(typing, /color: textSub \}\}>\{l\.description\}/);
    assert.match(typing, /fontSize: 36, fontWeight: 900, color: textMain/);
    assert.doesNotMatch(typing, /opacity: u \? 1 : 0\.5/);
});

test('Python lesson method descriptions remain readable on light cards', () => {
    for (const source of [pythonLists, pythonTuples]) {
        assert.match(source, /style=\{\{ color: '#475569' \}\}>— \{desc\}/);
    }
    assert.ok(contrastRatio('#475569', '#ffffff') >= 4.5);
});

test('saved-code modal metadata and code annotations use readable light-surface colors', () => {
    assert.doesNotMatch(savedCodes, /#(?:94a3b8|9ca3af|d1d5db|b8c0cc|c4cbd4|cbd5e1)/i);
    assert.match(savedCodes, /color:'#475569'/);
    assert.match(savedCodes, /color: '#475569'/);
    assert.ok(contrastRatio('#475569', '#f8fafc') >= 4.5);
});

test('AI topic footer text uses readable theme-specific colors', () => {
    assert.match(aiTopic, /fontSize: 13, color: isDark \? '#94a3b8' : '#475569'/);
    assert.ok(contrastRatio('#94a3b8', '#0f172a') >= 4.5);
    assert.ok(contrastRatio('#475569', '#ffffff') >= 4.5);
});

test('student dashboard metadata stays readable on pale cards without dimming locked text', () => {
    assert.doesNotMatch(studentDashboard, /style=\{\{[^}]*color:\s*'#94a3b8'/);
    assert.doesNotMatch(studentDashboard, /style=\{\{[^}]*color:\s*'#64748b'/);
    assert.doesNotMatch(studentDashboard, /opacity-60/);
    assert.ok(contrastRatio('#475569', '#f1f5f9') >= 4.5);
    assert.match(studentDashboard, /name: 'Silver', pts: '50', color: '#94a3b8'/);
});

test('typing keyboard labels stay readable against their key and page surfaces', () => {
    assert.match(typingKeyboard, /base\.color = '#475569'/);
    assert.match(typingKeyboard, /color: isDark \? '#94a3b8' : '#475569'/);
    assert.ok(contrastRatio('#475569', '#f3f4f6') >= 4.5);
    assert.ok(contrastRatio('#94a3b8', '#0f172a') >= 4.5);
    assert.ok(contrastRatio('#475569', '#f8fafc') >= 4.5);
});
