import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import ts from 'typescript';

// Render the actual component with real parsing/sanitization libraries.
// Only its CSS import is stubbed. No app, Firebase, or AI APIs are loaded.
const source = readFileSync(new URL('../src/components/ai/SafeAIContent.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
  },
  fileName: 'SafeAIContent.tsx',
}).outputText;
const dependencies = {
  'react/jsx-runtime': jsxRuntime,
  'react-markdown': { __esModule: true, default: Markdown },
  'rehype-raw': { __esModule: true, default: rehypeRaw },
  'rehype-sanitize': { __esModule: true, default: rehypeSanitize, defaultSchema },
  './SafeAIContent.module.css': { __esModule: true, default: { content: 'ai-content' } },
};
const exports = {};
vm.runInNewContext(compiled, {
  exports,
  require(name) {
    if (!Object.hasOwn(dependencies, name)) throw new Error(`Unexpected dependency: ${name}`);
    return dependencies[name];
  },
}, { filename: 'SafeAIContent.tsx' });
const { SafeAIContent } = exports;

function render(content, format = 'markdown', isDark = false) {
  return renderToStaticMarkup(React.createElement(SafeAIContent, { content, format, isDark }));
}

function assertNoExecutableMarkup(html) {
  assert.doesNotMatch(html, /<(?:script|style|iframe|object|embed|svg|math|form|input|img|video|audio|link|meta|base|template)\b/i);
  assert.doesNotMatch(html, /<[^>]+\s(?:on[a-z]+|style|srcdoc|id|name)\s*=/i);
  assert.doesNotMatch(html, /<a\b[^>]*href\s*=\s*["'](?:javascript|vbscript|data):/i);
}

test('chat preserves bold, emphasis, paragraphs, and line breaks', () => {
  const html = render('Hello **student**, learn *safely*.\nNext line.\n\nAnother paragraph.');
  assert.match(html, /<strong>student<\/strong>/);
  assert.match(html, /<em>safely<\/em>/);
  assert.match(html, /safely<\/em>\.\nNext line\./);
  assert.match(html, /<p>Another paragraph\.<\/p>/);
});

test('chat preserves ordered and unordered lists', () => {
  const html = render('- First\n- Second\n\n1. Step one\n2. Step two');
  assert.match(html, /<ul>\s*<li>First<\/li>/);
  assert.match(html, /<ol>\s*<li>Step one<\/li>/);
});

test('chat code examples remain literal, including executable-looking HTML', () => {
  const html = render('Use `print("Hello")`.\n\n```html\n<img src=x onerror="alert(1)">\n<script>alert(2)</script>\n```');
  assert.match(html, /<code>print\(&quot;Hello&quot;\)<\/code>/);
  assert.match(html, /<pre><code class="language-html">/);
  assert.match(html, /&lt;img src=x/);
  assert.match(html, /&lt;script&gt;alert\(2\)&lt;\/script&gt;/);
  assertNoExecutableMarkup(html);
});

test('raw HTML in chat is displayed as text instead of becoming DOM elements', () => {
  const html = render('<img src=x onerror="alert(1)">\n<script>alert(2)</script>');
  assert.match(html, /&lt;img/);
  assert.match(html, /&lt;script/);
  assertNoExecutableMarkup(html);
});

test('chat cannot create remote image or iframe requests', () => {
  const html = render('![tracker](https://untrusted.example/pixel)\n\n<iframe src="https://untrusted.example"></iframe>');
  assertNoExecutableMarkup(html);
});

test('lesson preserves existing HTML formatting, lists, and code', () => {
  const html = render('<p>Learn <strong>Python</strong> and <em>HTML</em>.<br>Next line.</p><ul><li>One</li><li>Two</li></ul><ol start="3"><li>Three</li></ol><pre><code class="language-python">print(&quot;Hello&quot;)\n</code></pre>', 'html');
  assert.match(html, /<strong>Python<\/strong>/);
  assert.match(html, /<em>HTML<\/em>/);
  assert.match(html, /<br\/>Next line\./);
  assert.match(html, /<ul><li>One<\/li><li>Two<\/li><\/ul>/);
  assert.match(html, /<ol start="3">/);
  assert.match(html, /<pre><code class="language-python">print\(&quot;Hello&quot;\)/);
});

test('lesson preserves tables and escaped HTML teaching examples', () => {
  const html = render('<table><thead><tr><th>Tag</th></tr></thead><tbody><tr><td><code>&lt;script&gt;</code></td></tr></tbody></table><p>&lt;img src=x onerror=alert(1)&gt;</p>', 'html');
  assert.match(html, /<table><thead><tr><th>Tag<\/th>/);
  assert.match(html, /<code>&lt;script&gt;<\/code>/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assertNoExecutableMarkup(html);
});

const attacks = [
  ['scripts/events', '<p onclick="alert(1)">Keep this</p><script>alert(2)</script><img src=x onerror=alert(3)>'],
  ['CSS injection', '<style>body{display:none}</style><p style="background:url(https://untrusted.example)">Keep this</p>'],
  ['frames and embeds', '<iframe srcdoc="<script>alert(1)</script>"></iframe><object data="data:text/html,test"></object><embed src="https://untrusted.example"><p>Keep this</p>'],
  ['SVG and MathML', '<svg onload="alert(1)"><a xlink:href="javascript:alert(2)">bad</a></svg><math><mtext>bad</mtext></math><p>Keep this</p>'],
  ['forms and clobbering', '<form action="https://untrusted.example"><input name="password" autofocus></form><p id="location" name="cookie">Keep this</p>'],
  ['remote resources', '<img src="https://untrusted.example/pixel"><video poster="https://untrusted.example"><source src="https://untrusted.example"></video><audio src="https://untrusted.example"></audio><p>Keep this</p>'],
  ['malformed markup', '<math><mtext><table><mglyph><style><!--</style><img title="--><img src=x onerror=alert(1)>"></table></mtext></math><p>Keep this</p>'],
  ['document metadata', '<base href="https://untrusted.example"><meta http-equiv="refresh" content="0;url=https://untrusted.example"><link rel="stylesheet" href="https://untrusted.example"><p>Keep this</p>'],
  ['arbitrary classes', '<p class="fixed inset-0" data-command="delete">Keep this</p>'],
];

for (const [name, payload] of attacks) {
  test(`lesson blocks ${name} and retains safe text`, () => {
    const html = render(payload, 'html');
    assertNoExecutableMarkup(html);
    assert.match(html, /Keep this/);
    assert.doesNotMatch(html, /class="fixed inset-0"|data-command=/);
  });
}

for (const href of ['javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'java&#x73;cript:alert(1)', 'java&#x09;script:alert(1)', 'data:text/html,test', 'vbscript:msgbox(1)']) {
  test(`lesson blocks unsafe URL ${href}`, () => {
    const html = render(`<a href="${href}">Link</a>`, 'html');
    assert.match(html, /<a>Link<\/a>/);
    assertNoExecutableMarkup(html);
  });
}

test('Markdown links also reject executable protocols', () => {
  const html = render('[bad](javascript:alert%281%29) [data](data:text/html,test)');
  assertNoExecutableMarkup(html);
});

for (const format of ['markdown', 'html']) {
  test(`${format} keeps safe links and Hindi text in either theme`, () => {
    const content = format === 'html'
      ? '<p>हिंदी सीखें — <a href="https://example.com/notes?q=python" title="Notes">Notes</a></p>'
      : 'हिंदी सीखें — [Notes](https://example.com/notes?q=python "Notes")';
    for (const isDark of [false, true]) {
      const html = render(content, format, isDark);
      assert.match(html, /हिंदी सीखें/);
      assert.match(html, /href="https:\/\/example.com\/notes\?q=python"/);
      assert.match(html, new RegExp(`data-theme="${isDark ? 'dark' : 'light'}"`));
      assertNoExecutableMarkup(html);
    }
  });
}
