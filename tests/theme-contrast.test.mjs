import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
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
const notesPage = readFileSync(new URL('../src/app/notes/page.tsx', import.meta.url), 'utf8');
const controlStatements = readFileSync(new URL('../src/app/python/control-statements/page.tsx', import.meta.url), 'utf8');
const fundamentals = readFileSync(new URL('../src/app/python/fundamentals/page.tsx', import.meta.url), 'utf8');
const reviewPage = readFileSync(new URL('../src/app/review/[id]/page.tsx', import.meta.url), 'utf8');
const examPage = readFileSync(new URL('../src/app/test/[id]/page.tsx', import.meta.url), 'utf8');
const contentPage = readFileSync(new URL('../src/components/content/ContentPage.tsx', import.meta.url), 'utf8');
const notesLayout = readFileSync(new URL('../src/components/content/NotesLayout.tsx', import.meta.url), 'utf8');
const newsLoader = readFileSync(new URL('../src/components/news/NewsLoader.tsx', import.meta.url), 'utf8');
const itTools = readFileSync(new URL('../src/app/it-tools/page.tsx', import.meta.url), 'utf8');
const controlMcq = readFileSync(new URL('../src/components/content/ControlMCQ.tsx', import.meta.url), 'utf8');
const iotMcq = readFileSync(new URL('../src/components/content/IoTChap1MCQ.tsx', import.meta.url), 'utf8');
const mcqSection = readFileSync(new URL('../src/components/content/MCQSection.tsx', import.meta.url), 'utf8');
const listsMcq = readFileSync(new URL('../src/components/content/ListsMCQ.tsx', import.meta.url), 'utf8');
const resetPassword = readFileSync(new URL('../src/app/reset-password/page.tsx', import.meta.url), 'utf8');
const verifyEmail = readFileSync(new URL('../src/app/verify-email/page.tsx', import.meta.url), 'utf8');
const aiWidget = readFileSync(new URL('../src/components/ai/KnoblyAI.tsx', import.meta.url), 'utf8');
const appCard = readFileSync(new URL('../src/components/apps/AppCard.tsx', import.meta.url), 'utf8');
const cybersecurity = readFileSync(new URL('../src/app/cybersecurity/page.tsx', import.meta.url), 'utf8');
const homePage = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8');
const oLevelChapter = readFileSync(new URL('../src/app/olevel/chapter-1/page.tsx', import.meta.url), 'utf8');
const iotApplications = readFileSync(new URL('../src/app/iot/applications/page.tsx', import.meta.url), 'utf8');
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

test('notes and Python lesson metadata use readable text on light surfaces', () => {
    for (const source of [notesPage, controlStatements, fundamentals, contentPage, notesLayout, newsLoader]) {
        assert.doesNotMatch(source, /color:\s*['"]#(?:94a3b8|9ca3af)['"]/i);
    }
    assert.ok(contrastRatio('#475569', '#ffffff') >= 4.5);
});

test('exam and review status text use readable colors on light surfaces', () => {
    for (const source of [reviewPage, examPage]) {
        assert.doesNotMatch(source, /color:\s*['"]#94a3b8['"]/i);
    }
    assert.match(reviewPage, /label: 'Skipped', color: '#475569'/);
    assert.match(examPage, /textarea::placeholder\s*\{\s*color: #475569 !important;/);
    assert.ok(contrastRatio('#475569', '#f8fafc') >= 4.5);
});

test('unavailable IT tool cards and unselected MCQ markers remain readable', () => {
    assert.doesNotMatch(itTools, /opacity-70|color:\s*['"]#(?:94a3b8|cbd5e1)['"]/i);
    for (const source of [controlMcq, iotMcq, mcqSection, listsMcq]) {
        assert.match(source, /isSel \? '#fff' : '#475569'/);
    }
    assert.ok(contrastRatio('#475569', '#f1f5f9') >= 4.5);
});

test('password and email verification helper text remains readable on pale auth surfaces', () => {
    for (const source of [resetPassword, verifyEmail]) {
        assert.doesNotMatch(source, /color:\s*['"]#94a3b8['"]/i);
    }
    assert.match(resetPassword, /Back to Home/);
    assert.ok(contrastRatio('#475569', '#eef2f7') >= 4.5);
});

test('AI widget muted labels stay readable in both themes', () => {
    assert.match(aiWidget, /footerText: '#94a3b8'/);
    assert.match(aiWidget, /footerText: '#475569'/);
    assert.match(aiWidget, /color: isDark \? '#94a3b8' : '#475569'/);
    assert.doesNotMatch(aiWidget, /isDark \? '#64748b' : '#94a3b8'/);
    assert.ok(contrastRatio('#94a3b8', '#0f172a') >= 4.5);
    assert.ok(contrastRatio('#475569', '#ffffff') >= 4.5);
});

test('app launcher, typing characters and cybersecurity footer are not dimmed', () => {
    assert.doesNotMatch(appCard, /opacity-50/);
    assert.match(appCard, /text-gray-400/);
    assert.match(typing, /color: '#475569',\s*background: '#fff'/);
    assert.doesNotMatch(cybersecurity, /color: '#94a3b8'/);
    assert.ok(contrastRatio('#475569', '#ffffff') >= 4.5);
});

test('home topic-explainer modal labels use theme-appropriate muted text', () => {
    assert.match(homePage, /color: isDark \? '#94a3b8' : '#475569'/);
    assert.doesNotMatch(homePage, /color: isDark \? '#64748b' : '#94a3b8'/);
    assert.doesNotMatch(homePage, /color: isDark \? '#374151' : '#d1d5db'/);
    assert.ok(contrastRatio('#94a3b8', '#0f172a') >= 4.5);
    assert.ok(contrastRatio('#475569', '#ffffff') >= 4.5);
});

test('IoT light-status text and O-Level navigation markers stay visible', () => {
    assert.match(iotApplications, /color: ledOn \? '#ea580c' : '#475569'/);
    assert.match(iotApplications, /color: ledOn \? '#c2410c' : '#475569'/);
    assert.match(iotApplications, /ledOn \? 'text-white' : 'text-slate-700'/);
    assert.match(oLevelChapter, /color: activeSection === item\.id \? '#fff' : '#475569'/);
    assert.ok(contrastRatio('#475569', '#f1f5f9') >= 4.5);
});

test('Python syntax/example labels and light-card action icons use darker foregrounds', () => {
    const pythonRoot = new URL('../src/app/python/', import.meta.url);
    for (const entry of readdirSync(pythonRoot, {withFileTypes: true})) {
        if (!entry.isDirectory()) continue;
        const page = readFileSync(new URL(`../src/app/python/${entry.name}/page.tsx`, import.meta.url), 'utf8');
        for (const line of page.split('\n')) {
            if (/Syntax|Example|Installation Command/.test(line)) {
                assert.doesNotMatch(line, /text-slate-400/);
            }
            if (/bg-slate-50 text-slate-400/.test(line)) {
                assert.fail(`Light-card action icon is too pale in ${entry.name}`);
            }
        }
    }
    assert.ok(contrastRatio('#475569', '#ffffff') >= 4.5);
});
