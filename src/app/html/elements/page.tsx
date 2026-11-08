'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Sparkles, CheckCircle2, Rocket, Code2, Play, Terminal } from 'lucide-react';
import SidebarLayout from '@/components/content/SidebarLayout';

const SIDEBAR_ITEMS = [
    { id: 'elements-tags', label: 'HTML Elements, Tags, and Attributes' },
    { id: 'empty-container', label: 'Empty Tags and Container Tags' },
    { id: 'body-tag', label: 'Body Tag and Attributes' },
    { id: 'p-tag', label: '<p> Tag and Its Attributes' },
    { id: 'pre-tag', label: '<pre> Tag' },
    { id: 'br-tag', label: '<br> Tag & First Project' },
    { id: 'hr-tag', label: '<hr> Tag and Attributes' },
    { id: 'comment-tag', label: 'HTML Comment Tag' },
    { id: 'formatting', label: 'HTML Formatting Elements' },
    { id: 'heading-tag', label: 'Heading Tags (h1-h6)' },
    { id: 'center-tag', label: '<center> Tag & Task 2' },
    { id: 'font-tag', label: '<font> Tag and Attributes' },
    { id: 'img-tag', label: '<img> Tag and Attributes' },
    { id: 'marquee-tag', label: '<marquee> Tag and Attributes' },
    { id: 'anchor-tag', label: '<a> Anchor Tag' },
    { id: 'list-tags', label: 'List Tags & Nested Lists' },
    { id: 'table-tag', label: 'Table Tag and Attributes' },
    { id: 'form-tag', label: 'Form Tag and Elements' },
    { id: 'div-span', label: '<div> and <span> Tags' },
    { id: 'semantic', label: 'HTML5 Semantic Elements' },
    { id: 'audio-video', label: 'Audio and Video Tags' },
    { id: 'iframe-tag', label: '<iframe> Tag' },
    { id: 'entities', label: 'HTML Entities & Capstone' },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} className="relative bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-4 sm:p-5 md:p-7 mb-5 scroll-mt-16 transition-shadow duration-300 overflow-hidden select-text">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2 select-text">
                <span className="inline-block w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600" />
                {title}
            </h2>
            <div className="text-[13px] sm:text-sm text-gray-600 leading-relaxed space-y-4 select-text">{children}</div>
        </section>
    );
}

function Code({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    return (
        <div className="rounded-xl overflow-hidden my-4 shadow-sm border border-gray-800/20 select-text" style={{ background: '#1e1e2e' }}>
            <div className="flex items-center justify-between px-3 py-2" style={{ background: '#181825' }}>
                <div className="flex items-center gap-1.5">
                    <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono ml-1">index.html</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Link
                        href="/html/compiler?from=/html/elements"
                        onClick={() => {
                            try {
                                localStorage.setItem('knobly_web_draft_html', code);
                                sessionStorage.setItem('knobly_compiler_return', '/html/elements');
                            } catch (e) { }
                        }}
                        className="text-[10px] px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 bg-orange-500/20 text-orange-300 hover:bg-orange-500 hover:text-white"
                        title="Open and run in Web Compiler"
                    >
                        <Play size={10} fill="currentColor" />
                        <span>Run</span>
                    </Link>
                    <button onClick={handleCopy} className="text-[10px] px-2.5 py-1 rounded-md font-semibold transition-all" style={{ background: copied ? '#166534' : '#313244', color: copied ? '#86efac' : '#a6adc8' }}>
                        {copied ? '✓ Copied' : 'Copy'}
                    </button>
                </div>
            </div>
            <pre className="p-3 sm:p-4 overflow-x-auto text-xs sm:text-[13px] leading-relaxed font-mono select-text" style={{ color: '#cdd6f4' }}><code className="select-text">{code}</code></pre>
        </div>
    );
}

function AttrTable({ rows }: { rows: [string, string][] }) {
    return (
        <div className="overflow-x-auto my-4 rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-xs sm:text-sm">
                <thead><tr className="bg-gradient-to-r from-blue-50 to-indigo-50"><th className="text-left py-2.5 px-3 text-blue-700 font-bold text-xs border-b border-blue-100">Attribute</th><th className="text-left py-2.5 px-3 text-blue-700 font-bold text-xs border-b border-blue-100">Description</th></tr></thead>
                <tbody>{rows.map(([a, d], i) => (<tr key={i} className={`${i % 2 ? 'bg-gray-50/50' : 'bg-white'} hover:bg-blue-50/30 transition-colors`}><td className="py-2.5 px-3 border-b border-gray-50"><code className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-100">{a}</code></td><td className="py-2.5 px-3 border-b border-gray-50 text-gray-600">{d}</td></tr>))}</tbody>
            </table>
        </div>
    );
}

// In-section quick practice check (no misleading task link)
function QuickPractice({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="relative bg-slate-50 border border-slate-200/90 rounded-xl p-3 sm:p-4 mt-3">
            <div className="flex items-center gap-2 mb-1.5">
                <Code2 size={14} className="text-blue-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</span>
            </div>
            <div className="text-xs text-slate-600 pl-5 leading-relaxed">{children}</div>
        </div>
    );
}

// Full interactive Milestone Practice Card placed where tags are completed
function PracticeTaskCard({
    taskId,
    title,
    desc,
    tagsCovered,
    highlightBadge = "Practice Project"
}: {
    taskId: string;
    title: string;
    desc: string;
    tagsCovered: string[];
    highlightBadge?: string;
}) {
    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-50/95 via-orange-50/90 to-yellow-50/70 border-2 border-amber-300/90 rounded-2xl p-4 sm:p-5 mt-5 shadow-sm">
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-amber-500 to-orange-600" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5 pl-2">
                <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0">
                        {taskId}
                    </span>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                                {highlightBadge}
                            </span>
                            <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                                <Sparkles size={11} className="text-amber-600" />
                                <span>Tag Requirements Complete!</span>
                            </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">{title}</h4>
                    </div>
                </div>

                <Link
                    href={`/html/tasks/${taskId}?from=/html/elements`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-105 shrink-0 self-start sm:self-auto"
                >
                    <span>Start Task #{taskId}</span>
                    <ArrowRight size={14} />
                </Link>
            </div>

            <p className="text-xs text-slate-700 pl-2 leading-relaxed mb-3">
                {desc}
            </p>

            <div className="pl-2 pt-2 border-t border-amber-200/80 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-amber-950 uppercase tracking-wider mr-1">Tags Practiced:</span>
                {tagsCovered.map((tag, idx) => (
                    <code key={idx} className="bg-white/95 border border-amber-300 text-amber-900 font-mono text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-bold">
                        {tag}
                    </code>
                ))}
            </div>
        </div>
    );
}

export default function HtmlElements() {
    return (
        <SidebarLayout title="Elements, Tags, and Attributes" backHref="/html" sidebarTitle="HTML All Tags" items={SIDEBAR_ITEMS}>
            {/* Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-5 sm:p-7 mb-6 shadow-lg shadow-blue-500/20">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
                <div className="absolute top-3 right-6 text-white/8 text-5xl sm:text-7xl font-black select-none pointer-events-none">&lt;/&gt;</div>
                <div className="relative z-10">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-1.5">Elements, Tags, and Attributes</h1>
                    <p className="text-blue-200 text-xs sm:text-sm mb-4">Complete reference for HTML elements — live practice tasks appear as each tag group is completed.</p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[10px] font-semibold backdrop-blur-sm">23 Chapters</span>
                        <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[10px] font-semibold backdrop-blur-sm">50+ Code Examples</span>
                        <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[10px] font-semibold backdrop-blur-sm">15 Hands-on Tasks</span>
                    </div>
                </div>
            </div>

            {/* 1 */}
            <Section id="elements-tags" title="1. HTML Elements, Tags, and Attributes">
                <p>An HTML element is a building block of a webpage that consists of a <strong>start tag</strong>, <strong>content</strong>, and an <strong>end tag</strong>. Elements form the structure of the content on the page.</p>
                <p>Tags are the keywords that define the start and end of an element. Attributes provide additional information about the elements and are included within the opening tag.</p>
                <Code code={`Example: <a href="http://localhost:3000">Visit Knobly</a>

Here, <a> is the tag, href is an attribute,
and "Visit Knobly" is the content.`} />
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-700 mb-2">Tag Syntax:</h4>
                    <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-700">
                        <li><strong>Opening Tag:</strong> <code className="bg-gray-100 px-1 rounded">&lt;tagname&gt;</code> — marks the beginning of an element</li>
                        <li><strong>Content:</strong> The text or nested elements between tags</li>
                        <li><strong>Closing Tag:</strong> <code className="bg-gray-100 px-1 rounded">&lt;/tagname&gt;</code> — marks the end of an element</li>
                        <li><strong>Attribute:</strong> <code className="bg-gray-100 px-1 rounded">name=&quot;value&quot;</code> — provides extra info, always in the opening tag</li>
                    </ul>
                </div>
                <Code code={`<p align="center">This is a centered paragraph.</p>
<!-- <p> is the tag, align is the attribute, "center" is the value -->`} />
                <QuickPractice title="Quick Syntax Check">
                    Try writing an HTML element with an opening tag, closing tag, and an attribute like <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">&lt;p align=&quot;center&quot;&gt;Hello World&lt;/p&gt;</code>.
                </QuickPractice>
            </Section>

            {/* 2 */}
            <Section id="empty-container" title="2. Empty Tags and Container Tags">
                <p>HTML tags are categorized into two types based on whether they hold content or not:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <h4 className="text-sm font-bold text-green-700 mb-2">Container Tags (Paired)</h4>
                        <p className="text-xs text-gray-600 mb-2">Have opening + closing tag, contain content.</p>
                        <div className="space-y-1 text-xs text-gray-700">
                            <div><code className="bg-white px-1 rounded">&lt;p&gt;...&lt;/p&gt;</code></div>
                            <div><code className="bg-white px-1 rounded">&lt;h1&gt;...&lt;/h1&gt;</code></div>
                            <div><code className="bg-white px-1 rounded">&lt;b&gt;...&lt;/b&gt;</code></div>
                            <div><code className="bg-white px-1 rounded">&lt;a&gt;...&lt;/a&gt;</code></div>
                            <div><code className="bg-white px-1 rounded">&lt;div&gt;...&lt;/div&gt;</code></div>
                            <div><code className="bg-white px-1 rounded">&lt;table&gt;...&lt;/table&gt;</code></div>
                        </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <h4 className="text-sm font-bold text-orange-700 mb-2">Empty Tags (Self-closing)</h4>
                        <p className="text-xs text-gray-600 mb-2">No closing tag, no content inside.</p>
                        <div className="space-y-1 text-xs text-gray-700">
                            <div><code className="bg-white px-1 rounded">&lt;br&gt;</code> — Line break</div>
                            <div><code className="bg-white px-1 rounded">&lt;hr&gt;</code> — Horizontal rule</div>
                            <div><code className="bg-white px-1 rounded">&lt;img&gt;</code> — Image</div>
                            <div><code className="bg-white px-1 rounded">&lt;input&gt;</code> — Input field</div>
                            <div><code className="bg-white px-1 rounded">&lt;meta&gt;</code> — Metadata</div>
                            <div><code className="bg-white px-1 rounded">&lt;link&gt;</code> — External resource</div>
                        </div>
                    </div>
                </div>
                <Code code={`<!-- Container Tag Example -->
<p>This paragraph has opening and closing tags.</p>

<!-- Empty Tag Examples -->
<br>
<hr>
<img src="image.jpg" alt="My Image">`} />
                <QuickPractice title="Container vs Empty Check">
                    Remember: Tags that enclose text like <code className="bg-white px-1 rounded">&lt;p&gt;</code> are container tags, while break tags like <code className="bg-white px-1 rounded">&lt;br&gt;</code> and <code className="bg-white px-1 rounded">&lt;hr&gt;</code> are empty tags.
                </QuickPractice>
            </Section>

            {/* 3 */}
            <Section id="body-tag" title="3. Body Tag and Attributes">
                <p>The <code className="bg-gray-100 px-1 rounded">&lt;body&gt;</code> tag defines the main visible content of a web page. Everything displayed on screen goes inside this tag.</p>
                <Code code={`<body bgcolor="lightyellow" text="darkblue" 
      background="bg.jpg">
    <h1>Welcome to My Page</h1>
    <p>This is the body content.</p>
</body>`} />
                <AttrTable rows={[
                    ['bgcolor', 'Sets the background color of the page'],
                    ['text', 'Sets the default text color'],
                    ['background', 'Sets a background image'],
                    ['topmargin', 'Top margin of the page'],
                    ['leftmargin', 'Left margin of the page'],
                ]} />
                <QuickPractice title="Body Attributes Check">
                    The <code className="bg-white px-1 rounded">bgcolor</code> attribute will be used directly in your first profile project in Section 6!
                </QuickPractice>
            </Section>

            {/* 4 */}
            <Section id="p-tag" title='4. <p> Tag and Its Attributes'>
                <p>The <code className="bg-gray-100 px-1 rounded">&lt;p&gt;</code> tag defines a paragraph. Browsers automatically add margin before and after each paragraph.</p>
                <Code code={`<p>This is a simple paragraph.</p>
<p align="center">This paragraph is center-aligned.</p>
<p align="right">This paragraph is right-aligned.</p>
<p align="justify">This paragraph text is justified. 
It stretches the text so each line has equal width.</p>`} />
                <AttrTable rows={[['align', 'left (default), center, right, justify']]} />
                <p><strong>Important:</strong> HTML ignores extra white spaces and line breaks in source code. Multiple spaces become one. Use <code className="bg-gray-100 px-1 rounded">&lt;br&gt;</code> for breaks and <code className="bg-gray-100 px-1 rounded">&amp;nbsp;</code> for extra spaces.</p>
                <QuickPractice title="Paragraph Alignment Check">
                    The <code className="bg-white px-1 rounded">align=&quot;center&quot;</code> attribute is widely used for headings and introductory text.
                </QuickPractice>
            </Section>

            {/* 5 */}
            <Section id="pre-tag" title="5. <pre> Tag">
                <p>The <code className="bg-gray-100 px-1 rounded">&lt;pre&gt;</code> tag defines preformatted text. It preserves spaces and line breaks exactly as written. Text is displayed in a fixed-width font (Courier).</p>
                <Code code={`<pre>
    Name        Age     City
    ----        ---     ----
    Rahul       20      Delhi
    Priya       22      Mumbai
    Amit        19      Jaipur
</pre>`} />
                <p>Unlike <code className="bg-gray-100 px-1 rounded">&lt;p&gt;</code>, the <code className="bg-gray-100 px-1 rounded">&lt;pre&gt;</code> tag does <strong>not collapse</strong> spaces or line breaks.</p>
                <Code code={`<p>This    has    extra    spaces.</p>
<!-- Browser shows: "This has extra spaces." -->

<pre>This    has    extra    spaces.</pre>
<!-- Browser shows: "This    has    extra    spaces." -->`} />
                <QuickPractice title="Preformatted Text Note">
                    The <code className="bg-white px-1 rounded">&lt;pre&gt;</code> tag is essential whenever you want to display formatted poems, quotes, or code blocks without writing multiple line break tags.
                </QuickPractice>
            </Section>

            {/* 6 - BR TAG: Milestone for Task 1 */}
            <Section id="br-tag" title="6. <br> Tag & Practice Project">
                <p>The <code className="bg-gray-100 px-1 rounded">&lt;br&gt;</code> tag inserts a line break. It is an empty tag (no closing tag). Useful for addresses, poems, or anywhere you need a line break without a new paragraph.</p>
                <Code code={`<p>
    Knobly Education<br>
    123, Main Street<br>
    New Delhi - 110001<br>
    India
</p>

<!-- Poem example -->
<p>
    Twinkle twinkle little star,<br>
    How I wonder what you are.<br>
    Up above the world so high,<br>
    Like a diamond in the sky.
</p>`} />
                <div className="overflow-x-auto my-3">
                    <table className="w-full text-xs sm:text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead><tr className="bg-blue-50"><th className="text-left py-2 px-3 text-blue-700 border-b border-gray-200">&lt;br&gt;</th><th className="text-left py-2 px-3 text-blue-700 border-b border-gray-200">&lt;p&gt;</th></tr></thead>
                        <tbody>
                            <tr className="bg-white"><td className="py-2 px-3 border-b border-gray-100">Only adds a line break</td><td className="py-2 px-3 border-b border-gray-100">Adds line break with margin</td></tr>
                            <tr className="bg-gray-50"><td className="py-2 px-3 border-b border-gray-100">Empty tag (no closing)</td><td className="py-2 px-3 border-b border-gray-100">Container tag (has closing)</td></tr>
                            <tr className="bg-white"><td className="py-2 px-3">No extra spacing</td><td className="py-2 px-3">Adds space above and below</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* TASK 1: Placed right after <br> tag completion! */}
                <PracticeTaskCard
                    taskId="1"
                    title="Task 1: My Profile Page"
                    desc="Ab aapne body bgcolor, p, pre, br, aur hr tags seekh liye hain! In tags ka use karke apna personal developer profile page banayein — bio, favorite quote in pre tag, aur contact address."
                    tagsCovered={['<body bgcolor>', '<p align="center">', '<pre>', '<br>', '<hr>']}
                    highlightBadge="First Milestone Project"
                />
            </Section>

            {/* 7 - HR TAG */}
            <Section id="hr-tag" title="7. <hr> Tag and Attributes">
                <p>The <code className="bg-gray-100 px-1 rounded">&lt;hr&gt;</code> tag creates a horizontal rule (line) across the page. It is an empty tag (no closing tag). Used to separate content sections visually.</p>
                <Code code={`<!-- Basic horizontal line -->
<hr>

<!-- HR with width attribute -->
<hr width="50%">
<hr width="300">

<!-- HR with size (thickness) -->
<hr size="5">
<hr size="10">

<!-- HR with color -->
<hr color="red">
<hr color="#3b82f6">

<!-- HR with alignment -->
<hr align="left" width="50%">
<hr align="center" width="70%">
<hr align="right" width="40%">

<!-- HR without shadow (noshade) -->
<hr noshade>
<hr noshade size="3" color="darkblue" width="80%">

<!-- Complete Example -->
<h2>Chapter 1: Introduction</h2>
<p>This is the first chapter content.</p>
<hr color="orange" size="3" width="90%" align="center" noshade>
<h2>Chapter 2: Getting Started</h2>
<p>This is the second chapter content.</p>`} />
                <AttrTable rows={[
                    ['width', 'Width of the line in pixels or percentage (e.g., width="50%" or width="300")'],
                    ['size', 'Thickness/height of the line in pixels (e.g., size="5")'],
                    ['color', 'Color of the line (e.g., color="red" or color="#ff0000")'],
                    ['align', 'Alignment: left, center (default), or right'],
                    ['noshade', 'Removes the 3D shadow effect, makes line flat and solid'],
                ]} />
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 my-3">
                    <h4 className="text-sm font-bold text-amber-700 mb-2">HR vs BR Comparison:</h4>
                    <div className="space-y-1 text-xs text-gray-700">
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;hr&gt;</code> — Draws a visible horizontal line to separate sections</div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;br&gt;</code> — Only adds an invisible line break (no visible line)</div>
                    </div>
                </div>
                <QuickPractice title="HR Attributes Practice">
                    Try creating a colored divider: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">&lt;hr color=&quot;red&quot; size=&quot;3&quot; width=&quot;80%&quot; noshade&gt;</code>. The <code className="bg-white px-1 rounded">noshade</code> attribute removes the default shadow effect for a cleaner look.
                </QuickPractice>
            </Section>

            {/* 8 - COMMENT TAG */}
            <Section id="comment-tag" title="8. HTML Comment Tag">
                <p>HTML comments are used to add notes, explanations, or reminders in the source code. Comments are <strong>not displayed</strong> in the browser — they are only visible in the source code.</p>
                <Code code={`<!-- This is an HTML comment -->
<!-- Comments are invisible in the browser -->

<p>This text is visible.</p>
<!-- This paragraph below is commented out and won't display -->
<!-- <p>This text is hidden from the browser.</p> -->

<!-- 
    Multi-line comment:
    Author: Piyush
    Date: 2025
    Purpose: Student profile page
-->

<!-- Section: Navigation Bar -->
<h1>My Website</h1>

<!-- TODO: Add contact form here later -->
<p>Welcome to my website!</p>

<!-- Debugging: temporarily hiding this section -->
<!--
<div>
    <h2>Under Construction</h2>
    <p>This section is not ready yet.</p>
</div>
-->`} />
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 my-3">
                    <h4 className="text-sm font-bold text-green-700 mb-2">Comment Uses:</h4>
                    <div className="space-y-1.5 text-xs text-gray-700">
                        <div>📝 <strong>Notes & Documentation:</strong> Explain what your code does for yourself and others</div>
                        <div>🔧 <strong>Debugging:</strong> Temporarily hide code without deleting it</div>
                        <div>📋 <strong>Section Labels:</strong> Mark different parts of a long HTML page</div>
                        <div>⏳ <strong>TODO Reminders:</strong> Leave notes for future work</div>
                    </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200 my-3">
                    <h4 className="text-sm font-bold text-red-700 mb-2">⚠️ Important Rules:</h4>
                    <div className="space-y-1 text-xs text-gray-700">
                        <div>• Comments start with <code className="bg-white px-1 rounded">&lt;!--</code> and end with <code className="bg-white px-1 rounded">--&gt;</code></div>
                        <div>• You <strong>cannot nest</strong> comments inside comments</div>
                        <div>• Comments are visible in <strong>View Source</strong> — don&apos;t put passwords or secrets!</div>
                    </div>
                </div>
                <QuickPractice title="Comment Practice">
                    Write a comment above your <code className="bg-white px-1 rounded">&lt;body&gt;</code> tag explaining the purpose of your page. Example: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">&lt;!-- My Profile Page - Created for O-Level Practice --&gt;</code>
                </QuickPractice>
            </Section>

            {/* 9 */}
            <Section id="formatting" title="9. HTML Formatting Elements">
                <p>HTML provides several tags for formatting text:</p>
                <Code code={`<b>Bold Text</b>
<strong>Strong/Important Text</strong>
<i>Italic Text</i>
<em>Emphasized Text</em>
<u>Underlined Text</u>
<s>Strikethrough Text</s>
<del>Deleted Text</del>
<ins>Inserted Text</ins>
<mark>Highlighted Text</mark>
<small>Smaller Text</small>
<big>Bigger Text</big>
<sub>Subscript</sub> like H<sub>2</sub>O
<sup>Superscript</sup> like x<sup>2</sup>
<code>Inline Code</code>
<kbd>Keyboard Input</kbd>
<abbr title="HyperText Markup Language">HTML</abbr>
<blockquote>This is a blockquote.</blockquote>
<address>Contact: student@example.com</address>`} />
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 my-3">
                    <h4 className="text-sm font-bold text-purple-700 mb-2">Quick Reference:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-700">
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;b&gt;</code> — <b>Bold</b></div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;strong&gt;</code> — <strong>Strong</strong></div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;i&gt;</code> — <i>Italic</i></div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;em&gt;</code> — <em>Emphasized</em></div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;u&gt;</code> — <u>Underline</u></div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;del&gt;</code> — <del>Deleted</del></div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;mark&gt;</code> — <mark>Highlighted</mark></div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;small&gt;</code> — <small>Small</small></div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;sub&gt;</code> — H<sub>2</sub>O</div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;sup&gt;</code> — x<sup>2</sup></div>
                    </div>
                </div>
                <QuickPractice title="Formatting Self Check">
                    Practice writing chemical formulas like H<sub>2</sub>O using <code className="bg-white px-1 rounded">&lt;sub&gt;</code> and algebraic expressions like a<sup>2</sup> + b<sup>2</sup> using <code className="bg-white px-1 rounded">&lt;sup&gt;</code>.
                </QuickPractice>
            </Section>

            {/* 10 - HEADINGS */}
            <Section id="heading-tag" title="10. Heading Tags (h1-h6)">
                <p>HTML provides six levels of headings. <code className="bg-gray-100 px-1 rounded">&lt;h1&gt;</code> is the largest and most important, <code className="bg-gray-100 px-1 rounded">&lt;h6&gt;</code> is the smallest.</p>
                <Code code={`<h1>Heading 1 - Most Important</h1>
<h2 id="heading-2">Heading 2</h2>
<h3 id="heading-3">Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6 - Least Important</h6>

<h1 align="center">Centered Heading</h1>
<h2 id="right-aligned-heading" align="right">Right-aligned Heading</h2>`} />
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 my-3 space-y-1">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">H1 Heading</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">H2 Heading</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-700">H3 Heading</p>
                    <p className="text-base sm:text-lg font-bold text-gray-700">H4 Heading</p>
                    <p className="text-sm font-bold text-gray-600">H5 Heading</p>
                    <p className="text-xs font-bold text-gray-500">H6 Heading</p>
                </div>
                <p><strong>Rules:</strong> Use only one <code className="bg-gray-100 px-1 rounded">&lt;h1&gt;</code> per page. Do not skip heading levels. Headings help SEO.</p>
                <QuickPractice title="Headings Practice">
                    Try creating a structured outline using <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">&lt;h1&gt;Main Topic&lt;/h1&gt;</code>, followed by sub-headings <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">&lt;h2&gt;Sub-Topic&lt;/h2&gt;</code>.
                </QuickPractice>
            </Section>

            {/* 11 - CENTER TAG & TASK 2 */}
            <Section id="center-tag" title="11. <center> Tag and Alignment">
                <p>The <code className="bg-gray-100 px-1 rounded">&lt;center&gt;</code> tag is a container tag used to horizontally center-align text, headings, paragraphs, images, or entire sections on a web page.</p>
                <Code code={`<!-- Centering headings -->
<center>
    <h1>Welcome to Knobly Education</h1>
    <h3>Learn Web Development Step by Step</h3>
</center>

<!-- Centering formatted text -->
<center>
    <p><b><u>Important Notice:</u></b> All exams start at 10:00 AM.</p>
</center>

<!-- Difference between <center> tag and align="center" attribute -->
<center><h3>Centered using &lt;center&gt; container tag</h3></center>
<h3 align="center">Centered using align="center" attribute</h3>

<!-- Centering images and content blocks -->
<center>
    <img src="logo.png" alt="Logo" width="100">
    <p>Empowering Students Across India</p>
    <hr width="50%">
</center>`} />
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 my-3">
                    <h4 className="text-sm font-bold text-blue-700 mb-2">Visual Alignment Demo:</h4>
                    <div className="bg-white p-3 rounded border border-blue-100 space-y-2">
                        <div className="text-center p-2 bg-blue-100/50 rounded text-blue-900 font-semibold text-xs sm:text-sm">
                            &lt;center&gt; This text is horizontally centered across the full width &lt;/center&gt;
                        </div>
                        <div className="text-left text-xs text-gray-500 pl-1">
                            Default text starts aligned to the left edge.
                        </div>
                    </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 my-3">
                    <h4 className="text-sm font-bold text-amber-700 mb-2">⚠️ O-Level Exam Note:</h4>
                    <p className="text-xs text-gray-700">The <code className="bg-white px-1 rounded">&lt;center&gt;</code> tag is <strong>deprecated in HTML5</strong> (where CSS <code className="bg-white px-1 rounded">text-align: center;</code> is preferred). However, in NIELIT O-Level (M2-R5) and CCC exams, question papers frequently test the <code className="bg-white px-1 rounded">&lt;center&gt;</code> tag and <code className="bg-white px-1 rounded">align=&quot;center&quot;</code> attribute!</p>
                </div>

                {/* TASK 2: Placed right after Headings, Formatting & Center Tag are complete! */}
                <PracticeTaskCard
                    taskId="2"
                    title="Task 2: Basic HTML Tags & Formatting"
                    desc="Formatting tags (b, i, u), Headings (h1-h6), aur <center> tag complete hone ke baad ab Task 2 solve karein — bold, italic, underline, center-aligned text, preformatted text, aur multi-level headings."
                    tagsCovered={['<h1>, <h2>', '<center>', '<b>, <i>, <u>', '<pre>', '<br>', '<hr>']}
                    highlightBadge="Headings, Center & Formatting Project"
                />
            </Section>

            {/* 12 - FONT TAG */}
            <Section id="font-tag" title="12. <font> Tag and Attributes">
                <p>The <code className="bg-gray-100 px-1 rounded">&lt;font&gt;</code> tag is used to change the color, size, and face (typeface) of text. It is a container tag that wraps around the text you want to style.</p>
                <Code code={`<!-- Font with color -->
<font color="red">This text is red.</font>
<font color="#3b82f6">This text is blue.</font>
<font color="green">This text is green.</font>

<!-- Font with size (1 to 7, default is 3) -->
<font size="1">Size 1 - Smallest</font>
<font size="2">Size 2</font>
<font size="3">Size 3 - Default</font>
<font size="4">Size 4</font>
<font size="5">Size 5</font>
<font size="6">Size 6</font>
<font size="7">Size 7 - Largest</font>

<!-- Font with face (typeface/font family) -->
<font face="Arial">This is Arial font.</font>
<font face="Times New Roman">This is Times New Roman.</font>
<font face="Courier New">This is Courier New (monospace).</font>
<font face="Verdana">This is Verdana font.</font>

<!-- Combining all attributes -->
<font color="darkblue" size="5" face="Arial">
    Welcome to Knobly Education!
</font>

<!-- Nested font tags -->
<font color="red" size="4">
    This is <font face="Courier New">mixed</font> styling.
</font>

<!-- Font used with other tags -->
<h2><font color="orange">Colored Heading</font></h2>
<p><font color="green" size="4" face="Verdana">Styled paragraph text.</font></p>`} />
                <AttrTable rows={[
                    ['color', 'Text color — name (red, blue) or hex code (#ff0000)'],
                    ['size', 'Text size from 1 (smallest) to 7 (largest). Default is 3'],
                    ['face', 'Font family/typeface — Arial, Times New Roman, Courier New, Verdana, etc.'],
                ]} />
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 my-3">
                    <h4 className="text-sm font-bold text-indigo-700 mb-2">Font Size Reference:</h4>
                    <div className="space-y-1 text-gray-700">
                        <div style={{ fontSize: '10px' }}>Size 1 — Very small (10px)</div>
                        <div style={{ fontSize: '13px' }}>Size 2 — Small (13px)</div>
                        <div style={{ fontSize: '16px' }}>Size 3 — Default/Medium (16px)</div>
                        <div style={{ fontSize: '18px' }}>Size 4 — Large (18px)</div>
                        <div style={{ fontSize: '24px' }}>Size 5 — Extra Large (24px)</div>
                        <div style={{ fontSize: '32px' }}>Size 6 — Huge (32px)</div>
                        <div style={{ fontSize: '48px' }}>Size 7 — Maximum (48px)</div>
                    </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 my-3">
                    <h4 className="text-sm font-bold text-amber-700 mb-2">⚠️ Note:</h4>
                    <p className="text-xs text-gray-700">The <code className="bg-white px-1 rounded">&lt;font&gt;</code> tag is <strong>deprecated in HTML5</strong> — modern websites use CSS for styling. But it is still important for O-Level exams and understanding HTML fundamentals!</p>
                </div>
                <QuickPractice title="Font Tag Practice">
                    Write a heading with colored text: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">&lt;h1&gt;&lt;font color=&quot;red&quot; face=&quot;Arial&quot;&gt;Welcome&lt;/font&gt;&lt;/h1&gt;</code>. Try different sizes and faces to see the visual difference.
                </QuickPractice>
            </Section>

            {/* 13 - IMAGE TAG: Milestone for Task 3 & 4 */}
            <Section id="img-tag" title="13. <img> Tag and Attributes">
                <p>The <code className="bg-gray-100 px-1 rounded">&lt;img&gt;</code> tag embeds images. It is a self-closing (empty) tag.</p>
                <Code code={`<img src="photo.jpg" alt="A photo" width="300" height="200">

<!-- Image with border -->
<img src="pic.jpg" alt="Picture" border="2">

<!-- Image as a link -->
<a href="http://localhost:3000">
    <img src="logo.png" alt="Knobly" width="100">
</a>

<!-- Image with text wrap -->
<img src="photo.jpg" alt="Photo" align="left" hspace="10" vspace="10">
<p>This text wraps around the image.</p>`} />
                <AttrTable rows={[
                    ['src', 'Path/URL of the image (required)'],
                    ['alt', 'Alternative text if image fails (required)'],
                    ['width', 'Width in pixels or percentage'],
                    ['height', 'Height in pixels or percentage'],
                    ['border', 'Border around the image'],
                    ['align', 'left, right, top, middle, bottom'],
                    ['hspace', 'Horizontal space around image'],
                    ['vspace', 'Vertical space around image'],
                ]} />

                {/* TASK 3: Placed right after <img> tag completion! */}
                <PracticeTaskCard
                    taskId="3"
                    title="Task 3: India - A Diverse Nation"
                    desc="Ab aapne <img> tag seekh liya hai! Task 3 me India ke bare me article banayein jisme headings, font colors, aur India ka map image embedded ho."
                    tagsCovered={['<img> (src, alt, align)', '<h1> - <h5>', '<font color>', '<p>', '<hr>']}
                    highlightBadge="Image Embedding Project"
                />
            </Section>

            {/* 14 - MARQUEE TAG */}
            <Section id="marquee-tag" title="14. <marquee> Tag and Attributes">
                <p>The <code className="bg-gray-100 px-1 rounded">&lt;marquee&gt;</code> tag creates scrolling/moving text or images on a webpage. It is a container tag that makes its content move automatically.</p>
                <Code code={`<!-- Basic scrolling text (left to right default) -->
<marquee>Welcome to Knobly Education!</marquee>

<!-- Scroll Amount (speed control) -->
<marquee scrollamount="2">Slow scrolling text</marquee>
<marquee scrollamount="10">Fast scrolling text</marquee>
<marquee scrollamount="20">Very fast scrolling!</marquee>

<!-- Behavior: scroll, slide, alternate -->
<marquee behavior="scroll">Scroll (default) - loops continuously</marquee>
<marquee behavior="slide">Slide - stops at the edge</marquee>
<marquee behavior="alternate">Alternate - bounces back and forth</marquee>

<!-- Direction: left, right, up, down -->
<marquee direction="right">Moving Right →</marquee>
<marquee direction="up" height="80">Moving Up ↑</marquee>
<marquee direction="down" height="80">Moving Down ↓</marquee>

<!-- Loop count -->
<marquee loop="3">This scrolls only 3 times.</marquee>
<marquee loop="1">This scrolls only once!</marquee>
<marquee loop="-1">Infinite loop (default)</marquee>

<!-- Height and Width -->
<marquee width="50%" height="50" bgcolor="lightyellow">
    Half-width marquee with background color
</marquee>

<!-- Combined Example -->
<marquee behavior="alternate" scrollamount="5" 
    bgcolor="#1e293b" width="100%" height="40">
    <font color="white" size="4">★ Breaking News: HTML is Fun! ★</font>
</marquee>

<!-- Image in marquee -->
<marquee scrollamount="8" behavior="alternate">
    <img src="logo.png" alt="Logo" width="60">
</marquee>`} />
                <AttrTable rows={[
                    ['scrollamount', 'Speed of scrolling in pixels per frame (default: 6). Higher = faster'],
                    ['behavior', 'scroll (default, continuous), slide (stops at edge), alternate (bounces)'],
                    ['direction', 'Scroll direction: left (default), right, up, down'],
                    ['loop', 'Number of times to repeat. -1 or default = infinite'],
                    ['height', 'Height of the marquee area in pixels or percentage'],
                    ['width', 'Width of the marquee area in pixels or percentage'],
                    ['bgcolor', 'Background color of the marquee area'],
                    ['scrolldelay', 'Delay between each frame in milliseconds (default: 85)'],
                ]} />
                <div className="bg-violet-50 rounded-lg p-4 border border-violet-200 my-3">
                    <h4 className="text-sm font-bold text-violet-700 mb-2">Behavior Comparison:</h4>
                    <div className="space-y-1.5 text-xs text-gray-700">
                        <div><code className="bg-white px-1 rounded text-red-600">scroll</code> — Text scrolls continuously in one direction and repeats from the other side</div>
                        <div><code className="bg-white px-1 rounded text-red-600">slide</code> — Text slides in and stops when it reaches the edge</div>
                        <div><code className="bg-white px-1 rounded text-red-600">alternate</code> — Text bounces back and forth between the edges like a ping-pong ball</div>
                    </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 my-3">
                    <h4 className="text-sm font-bold text-amber-700 mb-2">⚠️ Note:</h4>
                    <p className="text-xs text-gray-700">The <code className="bg-white px-1 rounded">&lt;marquee&gt;</code> tag is <strong>deprecated in HTML5</strong> — modern websites use CSS animations. But it is still asked in O-Level exams and useful for learning text animation concepts!</p>
                </div>
                <QuickPractice title="Marquee Practice">
                    Create a bouncing news banner: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">&lt;marquee behavior=&quot;alternate&quot; scrollamount=&quot;5&quot;&gt;Breaking News!&lt;/marquee&gt;</code>. Try changing <code className="bg-white px-1 rounded">scrollamount</code> to see speed differences.
                </QuickPractice>

                {/* TASK 4: Placed right after <marquee> tag completion! */}
                <PracticeTaskCard
                    taskId="4"
                    title="Task 4: Indian History Timeline"
                    desc="Image alignment (align='right'), marquee, font size/color, aur historical period sections ka use karke Indian History Timeline banayein."
                    tagsCovered={['<img align="right">', '<marquee>', '<font face/size/color>', '<h1> - <h3>', '<hr color>']}
                    highlightBadge="Multimedia Article Project"
                />
            </Section>

            {/* 15 - ANCHOR TAG: Milestone for Task 7 */}
            <Section id="anchor-tag" title="15. <a> Anchor Tag">
                <p>The <code className="bg-gray-100 px-1 rounded">&lt;a&gt;</code> tag creates hyperlinks.</p>
                <Code code={`<!-- External link -->
<a href="https://www.google.com">Visit Google</a>

<!-- Open in new tab -->
<a href="https://www.google.com" target="_blank">Open in New Tab</a>

<!-- Email link -->
<a href="mailto:info@knoblyweb.in">Send Email</a>

<!-- Phone link -->
<a href="tel:+919876543210">Call Us</a>

<!-- Bookmark link (same page) -->
<a href="#section3">Jump to Section 3</a>
...
<h2 id="section3">Section 3</h2>

<!-- Download link -->
<a href="notes.pdf" download>Download Notes</a>`} />
                <AttrTable rows={[
                    ['href', 'URL of the link destination (required)'],
                    ['target', '_self (same tab), _blank (new tab), _parent, _top'],
                    ['title', 'Tooltip text on hover'],
                    ['download', 'Downloads file instead of navigating'],
                    ['name', 'Name of anchor (for bookmarks)'],
                ]} />

                {/* TASK 7: Placed right after <a> tag completion! */}
                <PracticeTaskCard
                    taskId="7"
                    title="Task 7: Simple Webpage with Bookmarks & Navigation"
                    desc="Hyperlinks aur internal bookmarks (<a href='#about'>, <a name='about'>, <a href='#top'>) seekhne ke baad bina CSS ke ek pure semantic clickable website banayein."
                    tagsCovered={['<a href>', 'target="_blank"', 'Page Bookmarks (<a name>)', 'mailto:', '<h1> - <h4>', '<p>', '<hr>']}
                    highlightBadge="Hyperlink Navigation Project"
                />
            </Section>

            {/* 16 - LIST TAGS: Milestone for Task 5 & 5.3 */}
            <Section id="list-tags" title="16. List Tags (ul, ol, dl & Nested Lists)">
                <p>HTML supports three types of lists:</p>
                <h4 className="text-sm font-bold text-blue-700 mt-2">A. Unordered List (&lt;ul&gt;)</h4>
                <Code code={`<ul>
    <li>Apple</li>
    <li>Banana</li>
    <li>Cherry</li>
</ul>

<!-- Types: disc (default), circle, square -->
<ul type="circle">
    <li>Circle bullet</li>
</ul>

<!-- Nested list -->
<ul>
    <li>Fruits
        <ul type="circle">
            <li>Apple</li>
            <li>Mango</li>
        </ul>
    </li>
</ul>`} />
                <h4 className="text-sm font-bold text-blue-700 mt-2">B. Ordered List (&lt;ol&gt;)</h4>
                <Code code={`<ol>
    <li>First</li>
    <li>Second</li>
    <li>Third</li>
</ol>

<!-- Types: 1, A, a, I, i -->
<ol type="A"><li>Uppercase letters</li></ol>
<ol type="i"><li>Lowercase Roman</li></ol>
<ol start="5"><li>Starts from 5</li></ol>`} />
                <h4 className="text-sm font-bold text-blue-700 mt-2">C. Description List (&lt;dl&gt;)</h4>
                <Code code={`<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language</dd>
    <dt>CSS</dt>
    <dd>Cascading Style Sheets</dd>
</dl>`} />

                {/* TASK 5: Basic Lists Project */}
                <div className="my-4">
                    <PracticeTaskCard
                        taskId="5"
                        title="Task 5: Operating Systems (Lists & Style Guide)"
                        desc="Ordered lists, unordered lists, aur description lists (<dl>, <dt>, <dd>) ka use karke Operating Systems information page banayein."
                        tagsCovered={['<ul>', '<ol>', '<li>', '<dl>', '<dt>', '<dd>', '<img>', 'h1-h4']}
                        highlightBadge="Lists Mastery Project"
                    />
                </div>

                {/* D. Nested List Explanation */}
                <div className="pt-4 border-t border-slate-200/80 mt-6">
                    <h4 className="text-sm font-bold text-blue-700 mt-1">D. HTML Nested Lists (List ke andar List)</h4>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1">
                        Jab kisi ek List Item (<code>&lt;li&gt;</code>) ke andar ek aur list (<code>&lt;ul&gt;</code> ya <code>&lt;ol&gt;</code>) shuru ki jaati hai, toh use <strong>Nested List (Sub-list)</strong> kehte hain. Iska use Multi-level navigation menu, Categories & Subcategories, Book Table of Contents, aur Course Syllabus banane ke liye kiya jaata hai.
                    </p>

                    <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 my-3 text-xs text-amber-900 leading-relaxed">
                        <strong className="text-amber-800">⚠️ Sabse Zaroori Niyam (Golden Rule):</strong> Nested list ko hamesha parent <code>&lt;li&gt;</code> ke closing tag <code>&lt;/li&gt;</code> ke <em>andar</em> likha jaata hai, bahar nahi! Agar parent <code>&lt;li&gt;</code> ko pehle hi close kar denge, toh browser me indentation aur numbering hierarchy toot jayegi.
                    </div>

                    <Code code={`<!-- 1. Unordered List ke andar Unordered List -->
<ul>
    <li>Frontend Web Development
        <ul type="circle">
            <li>HTML5 - Page Structure</li>
            <li>CSS3 - Styling & Design</li>
            <li>JavaScript - Interactivity</li>
        </ul>
    </li>
    <li>Backend Web Development
        <ul type="circle">
            <li>Node.js / Express</li>
            <li>Python / Django</li>
        </ul>
    </li>
</ul>

<!-- 2. Mixed Nested List (OL ke andar UL) -->
<ol>
    <li>Core Computer Skills
        <ul type="square">
            <li>Notepad & WordPad</li>
            <li>MS Office Suite</li>
        </ul>
    </li>
    <li>Programming Fundamentals
        <ul type="square">
            <li>C Language</li>
            <li>Python</li>
        </ul>
    </li>
</ol>`} />

                    {/* TASK 5.0: Dedicated Nested Lists Project */}
                    <div className="mt-4">
                        <PracticeTaskCard
                            taskId="5.0"
                            title="Task 5.0: Web Development Roadmap (Nested Lists)"
                            desc="Multi-level unordered, ordered, aur description lists (<ul type='...'>, <ol type='...'>, <dl>, <dt>, <dd>) ka use karke complete Web Development learning roadmap banayein."
                            tagsCovered={['<ul>', '<ol>', '<li>', '<dl>', '<dt>', '<dd>', 'type="circle"', 'type="square"', 'font', 'h1-h3']}
                            highlightBadge="Nested Lists Mastery Project"
                        />
                    </div>

                    {/* TEST - 1: Comprehensive Milestone Exam up to Lists */}
                    <div className="mt-4">
                        <PracticeTaskCard
                            taskId="test-1"
                            title="Test - 1: HTML Foundation & Lists Mastery (Comprehensive Exam)"
                            desc="Headings, paragraphs, pre, formatting, marquee, images, internal bookmark links (<a href='#...'>), nested lists, aur description lists (<dl>) ka complete real-world portal test."
                            tagsCovered={['<h1>-<h3>', '<pre>', '<marquee>', '<img>', '<a href>', '<ul>', '<ol>', '<dl>', 'nested']}
                            highlightBadge="🏆 Milestone Test - 1"
                        />
                    </div>
                </div>
            </Section>

            {/* 17 - TABLE TAG: Milestone for Task 5.1, 5.2, 5.3 & 6 */}
            <Section id="table-tag" title="17. Table Tag and Attributes (Complete Master Guide)">
                <p className="text-xs text-slate-700 leading-relaxed">
                    HTML me data ko grid format me yani <strong>Rows (पंक्तियाँ)</strong> aur <strong>Columns (कॉलम)</strong> me tabular roop se organize karne ke liye Table tags ka use kiya jaata hai. Ek standard HTML table 5 mukhya tags se milkar banti hai:
                </p>

                {/* Structure Overview Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-3">
                    <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-2.5 text-center shadow-2xs">
                        <code className="text-xs font-bold text-blue-700">&lt;table&gt;</code>
                        <p className="text-[10px] text-slate-600 mt-1">Main Table Container</p>
                    </div>
                    <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-2.5 text-center shadow-2xs">
                        <code className="text-xs font-bold text-amber-700">&lt;caption&gt;</code>
                        <p className="text-[10px] text-slate-600 mt-1">Table Title / Heading</p>
                    </div>
                    <div className="bg-purple-50/90 border border-purple-200 rounded-xl p-2.5 text-center shadow-2xs">
                        <code className="text-xs font-bold text-purple-700">&lt;tr&gt;</code>
                        <p className="text-[10px] text-slate-600 mt-1">Table Row (Horizontal)</p>
                    </div>
                    <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-2.5 text-center shadow-2xs">
                        <code className="text-xs font-bold text-emerald-700">&lt;th&gt;</code>
                        <p className="text-[10px] text-slate-600 mt-1">Header Cell (Bold + Center)</p>
                    </div>
                    <div className="bg-rose-50/90 border border-rose-200 rounded-xl p-2.5 text-center col-span-2 sm:col-span-1 shadow-2xs">
                        <code className="text-xs font-bold text-rose-700">&lt;td&gt;</code>
                        <p className="text-[10px] text-slate-600 mt-1">Data Cell (Normal + Left)</p>
                    </div>
                </div>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* A. <table> Tag & Attributes */}
                {/* ─────────────────────────────────────────────────────────── */}
                <div className="pt-3 border-t border-slate-200/80 mt-4">
                    <h4 className="text-sm font-bold text-blue-700 flex items-center gap-2">
                        <span>A. &lt;table&gt; Tag (Parent Container)</span>
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1">
                        Yeh table ka main boundary tag hota hai. Sabhi rows aur cells isi ke andar aate hain. Iske attributes poori table ke appearance, size, border, aur internal/external spacing ko define karte hain:
                    </p>

                    <AttrTable rows={[
                        ['border', 'Table ke borders ki motai pixels me (jaise border="1" ya border="2"). Agar border="0" ho toh borders invisible hote hain.'],
                        ['cellpadding', 'Cell ke border aur text content ke beech ka internal space / padding (pixels me, jaise cellpadding="8").'],
                        ['cellspacing', 'Do adjacent cells ke beech ka external gap / doori (pixels me, jaise cellspacing="0" sharp grid look ke liye).'],
                        ['width', 'Table ki poori chaudai (percentage jaise width="100%" ya pixels me width="600").'],
                        ['height', 'Table ki vertical unchai (pixels me, jaise height="250").'],
                        ['align', 'Poori table ka webpage par horizontal alignment ("left", "center", "right").'],
                        ['bgcolor', 'Poori table ka background color (color name ya HEX code, jaise bgcolor="#f8fafc").'],
                        ['bordercolor', 'Table ke borders ka color specify karta hai (jaise bordercolor="#0284c7").'],
                        ['background', 'Table ke background me image lagane ke liye (jaise background="pattern.jpg").'],
                    ]} />

                    <Code code={`<!-- <table> tag ke attributes ka live use -->
<table border="2" cellpadding="10" cellspacing="2" width="100%" align="center" bgcolor="#f8fafc" bordercolor="#0284c7">
    <caption><b>Products & Price List</b></caption>
    <tr bgcolor="#0284c7">
        <th><font color="white">Item</font></th>
        <th><font color="white">Quantity</font></th>
        <th><font color="white">Price</font></th>
    </tr>
    <tr align="center">
        <td>Mechanical Keyboard</td>
        <td>5</td>
        <td>₹2,500</td>
    </tr>
    <tr align="center">
        <td>Optical Mouse</td>
        <td>10</td>
        <td>₹850</td>
    </tr>
</table>`} />
                </div>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* B. <caption> Tag & Attributes */}
                {/* ─────────────────────────────────────────────────────────── */}
                <div className="pt-3 border-t border-slate-200/80 mt-4">
                    <h4 className="text-sm font-bold text-amber-700 flex items-center gap-2">
                        <span>B. &lt;caption&gt; Tag (Table Title & Heading)</span>
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1">
                        Table ka title ya main topic heading display karne ke liye <code>&lt;caption&gt;</code> tag ka use hota hai. Yeh hamesha <code>&lt;table&gt;</code> tag ke turant baad pehla child tag hona chahiye.
                    </p>

                    <AttrTable rows={[
                        ['align', 'Caption ki vertical position set karta hai: "top" (table ke upar, default) ya "bottom" (table ke neeche).'],
                    ]} />

                    <Code code={`<table border="1" width="80%" align="center" cellpadding="6">
    <!-- Caption table ke upar title display karega -->
    <caption align="top"><b>Monthly Sales Report - 2026</b></caption>
    <tr bgcolor="#e2e8f0" align="center">
        <th>Month</th>
        <th>Revenue</th>
    </tr>
    <tr align="center">
        <td>January</td>
        <td>₹45,000</td>
    </tr>
</table>`} />
                </div>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* C. <tr> Tag & Attributes */}
                {/* ─────────────────────────────────────────────────────────── */}
                <div className="pt-3 border-t border-slate-200/80 mt-4">
                    <h4 className="text-sm font-bold text-purple-700 flex items-center gap-2">
                        <span>C. &lt;tr&gt; Tag (Table Row)</span>
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1">
                        <code>&lt;tr&gt;</code> ka full form <strong>Table Row</strong> hai. Yeh table me ek horizontal line (row) banata hai. Row ke andar ya toh <code>&lt;th&gt;</code> (headings) aate hain ya <code>&lt;td&gt;</code> (data cells). Iske attributes us row ke sabhi cells par ek sath apply ho jaate hain:
                    </p>

                    <AttrTable rows={[
                        ['align', 'Us row ke sabhi cells ka horizontal text alignment: "left", "center", "right", "justify".'],
                        ['valign', 'Us row ke sabhi cells ka vertical alignment: "top" (upar), "middle" (beech me, default), "bottom" (neeche).'],
                        ['bgcolor', 'Us specific row ka background color (jaise header row ya zebra striping ke liye).'],
                        ['bordercolor', 'Us specific row ke border ka color specify karta hai.'],
                    ]} />

                    <Code code={`<table border="1" width="100%" cellpadding="8">
    <!-- Row 1: Header row with purple background & centered text -->
    <tr bgcolor="#7e22ce" align="center">
        <th><font color="white">Emp ID</font></th>
        <th><font color="white">Employee Name</font></th>
        <th><font color="white">Department</font></th>
    </tr>

    <!-- Row 2: Data row with align="center" and light purple background -->
    <tr bgcolor="#faf5ff" align="center" valign="middle">
        <td>E-101</td>
        <td>Amit Sharma</td>
        <td>Web Development</td>
    </tr>

    <!-- Row 3: Data row with different alignment -->
    <tr align="center" valign="middle">
        <td>E-102</td>
        <td>Pooja Verma</td>
        <td>UI/UX Design</td>
    </tr>
</table>`} />
                </div>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* D. <th> Tag & Attributes */}
                {/* ─────────────────────────────────────────────────────────── */}
                <div className="pt-3 border-t border-slate-200/80 mt-4">
                    <h4 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                        <span>D. &lt;th&gt; Tag (Table Header Cell)</span>
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1">
                        <code>&lt;th&gt;</code> ka full form <strong>Table Header</strong> hai. Yeh table ke columns ya rows ki headings ke liye use hota hai. By default iska text <strong>Bold (गाढ़ा)</strong> hota hai aur <strong>Center Aligned</strong> hota hai.
                    </p>

                    <AttrTable rows={[
                        ['colspan', 'Horizontal columns ko merge karne ke liye number specify karta hai (jaise colspan="3" teen columns merge karega).'],
                        ['rowspan', 'Vertical rows ko merge karne ke liye number specify karta hai (jaise rowspan="2" do rows merge karega).'],
                        ['align', 'Header cell ka horizontal text alignment: "left", "center", "right".'],
                        ['valign', 'Vertical text alignment: "top", "middle", "bottom".'],
                        ['bgcolor', 'Header cell ka specific background color.'],
                        ['width', 'Header cell ki width pixels ya percentage me.'],
                        ['height', 'Header cell ki unchai (height in pixels).'],
                        ['nowrap', 'Header text ko bina wrap hue single line me rakhta hai.'],
                    ]} />

                    <Code code={`<table border="1" width="100%" cellpadding="8" cellspacing="0">
    <tr bgcolor="#0f766e">
        <!-- colspan="2" se do columns merge hokar ek broad header banenge -->
        <th colspan="2"><font color="white">Student Details</font></th>
        <!-- normal th -->
        <th bgcolor="#047857"><font color="white">Grade</font></th>
    </tr>
    <tr align="center">
        <td>Roll No: 101</td>
        <td>Rahul Kumar</td>
        <td>A+</td>
    </tr>
</table>`} />
                </div>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* E. <td> Tag & Attributes */}
                {/* ─────────────────────────────────────────────────────────── */}
                <div className="pt-3 border-t border-slate-200/80 mt-4">
                    <h4 className="text-sm font-bold text-rose-700 flex items-center gap-2">
                        <span>E. &lt;td&gt; Tag (Table Data Cell)</span>
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1">
                        <code>&lt;td&gt;</code> ka full form <strong>Table Data</strong> hai. Yeh table ka basic data container cell hota hai jisme actual text, numbers, images, ya links store hote hain. By default iska text <strong>Regular (Normal font)</strong> aur <strong>Left Aligned</strong> hota hai.
                    </p>

                    <AttrTable rows={[
                        ['colspan', 'Data cell ko horizontal roop se multiple columns me merge karna (jaise colspan="2").'],
                        ['rowspan', 'Data cell ko vertical roop se multiple rows me merge karna (jaise rowspan="2").'],
                        ['align', 'Cell content ka horizontal alignment: "left", "center", "right".'],
                        ['valign', 'Cell content ka vertical alignment: "top", "middle", "bottom".'],
                        ['bgcolor', 'Individual data cell ka custom background color.'],
                        ['width', 'Cell ki custom width (pixels ya % me).'],
                        ['height', 'Cell ki custom height (pixels me).'],
                        ['nowrap', 'Cell text me automatic line break hone se rokna.'],
                    ]} />

                    <Code code={`<table border="1" width="100%" cellpadding="8" cellspacing="0">
    <tr bgcolor="#334155">
        <th><font color="white">State</font></th>
        <th><font color="white">City</font></th>
        <th><font color="white">Status</font></th>
    </tr>
    <tr>
        <!-- rowspan="2" se Uttar Pradesh 2 rows me merge hoga -->
        <td rowspan="2" align="center" bgcolor="#f1f5f9"><b>Uttar Pradesh</b></td>
        <td>Lucknow</td>
        <td bgcolor="#dcfce7" align="center">Active</td>
    </tr>
    <tr>
        <td>Kanpur</td>
        <td bgcolor="#dcfce7" align="center">Active</td>
    </tr>
</table>`} />
                </div>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* F. Quick Comparison: <th> vs <td> */}
                {/* ─────────────────────────────────────────────────────────── */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        🔍 Quick Comparison: &lt;th&gt; (Header) vs &lt;td&gt; (Data)
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-slate-600">
                                    <th className="py-2 px-3 font-bold">Feature</th>
                                    <th className="py-2 px-3 font-bold text-emerald-700">&lt;th&gt; (Table Header)</th>
                                    <th className="py-2 px-3 font-bold text-rose-700">&lt;td&gt; (Table Data)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="py-2 px-3 font-semibold text-slate-700">Default Font Weight</td>
                                    <td className="py-2 px-3 text-emerald-800 font-bold">Bold (गाढ़ा)</td>
                                    <td className="py-2 px-3 text-slate-600">Regular (सामान्य)</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3 font-semibold text-slate-700">Default Text Alignment</td>
                                    <td className="py-2 px-3 text-emerald-800 font-bold">Center (बीच में)</td>
                                    <td className="py-2 px-3 text-slate-600">Left (बाईं तरफ)</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3 font-semibold text-slate-700">Primary Purpose</td>
                                    <td className="py-2 px-3 text-slate-700">Column ya Row ki heading batana</td>
                                    <td className="py-2 px-3 text-slate-700">Actual data content display karna</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ─────────────────────────────────────────────────────────── */}
                {/* G. Complete Master Table with Colspan & Rowspan */}
                {/* ─────────────────────────────────────────────────────────── */}
                <div className="pt-3 border-t border-slate-200/80 mt-4 mb-4">
                    <h4 className="text-sm font-bold text-blue-700 flex items-center gap-2">
                        <span>G. Complete Master Table (Colspan, Rowspan & Zebra Styling)</span>
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1">
                        Neeche diye gaye complete code me <code>border</code>, <code>cellpadding</code>, <code>cellspacing</code>, <code>&lt;caption&gt;</code>, <code>bgcolor</code>, <code>colspan</code>, aur <code>rowspan</code> sabhi ka real-world use dekhein:
                    </p>

                    <Code code={`<table border="1" cellpadding="8" cellspacing="0" width="100%" bgcolor="#ffffff">
    <caption align="top"><b>Student Examination Scoreboard 2026</b></caption>
    
    <!-- Top Super-Header using colspan -->
    <tr bgcolor="#1e293b" align="center">
        <th rowspan="2"><font color="white">Roll No</font></th>
        <th rowspan="2"><font color="white">Student Name</font></th>
        <th colspan="3"><font color="white">Marks Obtained</font></th>
        <th rowspan="2"><font color="white">Status</font></th>
    </tr>

    <!-- Sub-headers for Subjects -->
    <tr bgcolor="#334155" align="center">
        <th><font color="white">HTML</font></th>
        <th><font color="white">CSS</font></th>
        <th><font color="white">JS</font></th>
    </tr>

    <!-- Student 1 -->
    <tr align="center">
        <td>101</td>
        <td align="left">Aarav Sharma</td>
        <td>88</td>
        <td>92</td>
        <td>85</td>
        <td bgcolor="#dcfce7"><font color="#15803d"><b>PASS</b></font></td>
    </tr>

    <!-- Student 2 with zebra background -->
    <tr align="center" bgcolor="#f8fafc">
        <td>102</td>
        <td align="left">Priya Patel</td>
        <td>95</td>
        <td>90</td>
        <td>94</td>
        <td bgcolor="#dcfce7"><font color="#15803d"><b>PASS</b></font></td>
    </tr>
</table>`} />
                </div>

                {/* TASK 5.1, 5.2, 6: Placed right after Table tags completion! */}
                <div className="space-y-3">
                    <PracticeTaskCard
                        taskId="5.1"
                        title="Task 5.1: Operating Systems (Table Layout)"
                        desc="Table, border, cellpadding, aur alternating colors ka use karke OS market share table banayein."
                        tagsCovered={['<table>', '<tr>', '<th>', '<td>', 'border', 'cellpadding']}
                        highlightBadge="Basic Table Project"
                    />
                    <PracticeTaskCard
                        taskId="5.2"
                        title="Task 5.2: Global Internet Usage Statistics"
                        desc="Rowspan aur Colspan ka advanced use karke regional internet usage data table banayein."
                        tagsCovered={['colspan="2"', 'rowspan="2"', '<caption>', '<th>', '<td>', 'align']}
                        highlightBadge="Colspan & Rowspan Project"
                    />
                    <PracticeTaskCard
                        taskId="5.3"
                        title="Task 5.3: History of the Internet (Table & Timeline)"
                        desc="Description lists, ordered timeline, aur styled data tables (<table border='1'>, <caption>, <tr>, <th>, <td>) ka use karke History of Internet ka educational page banayein."
                        tagsCovered={['<table>', '<caption>', '<tr>', '<th>', '<td>', '<dl>', '<ol>', 'font']}
                        highlightBadge="Timeline Table & Lists Project"
                    />
                    <PracticeTaskCard
                        taskId="6"
                        title="Task 6: Weekly Study Schedule"
                        desc="Complex multi-row aur multi-column timetable banayein jisme days, timeslots, aur subject cells merged hon."
                        tagsCovered={['colspan="5"', 'rowspan="2"', 'bgcolor', 'cellspacing="0"', 'caption']}
                        highlightBadge="Complex Timetable Project"
                    />
                </div>
            </Section>

            {/* 18 - FORM TAG: Milestone for Task 8 */}
            <Section id="form-tag" title="18. Form Tag and Elements">
                <p>The <code className="bg-gray-100 px-1 rounded">&lt;form&gt;</code> tag collects user input.</p>
                <Code code={`<form action="/submit" method="POST">
    <label>Name:</label><br>
    <input type="text" name="name" placeholder="Enter name" 
           size="30" maxlength="50"><br><br>

    <label>Password:</label><br>
    <input type="password" name="password"><br><br>

    <label>Email:</label><br>
    <input type="email" name="email"><br><br>

    <p>Gender:</p>
    <input type="radio" name="gender" value="male"> Male
    <input type="radio" name="gender" value="female"> Female

    <p>Hobbies:</p>
    <input type="checkbox" value="coding"> Coding
    <input type="checkbox" value="reading"> Reading

    <br><br><label>Course:</label>
    <select name="course">
        <option value="">-- Select --</option>
        <option value="olevel">O-Level</option>
        <option value="ccc">CCC</option>
    </select>

    <br><br><label>Message:</label><br>
    <textarea rows="4" cols="40"></textarea>

    <br><br>
    <input type="file"><br><br>
    <input type="color" value="#22d3ee">
    <input type="range" min="1" max="10">
    <br><br>
    <input type="submit" value="Submit">
    <input type="reset" value="Reset">
</form>`} />
                <AttrTable rows={[
                    ['action', 'URL where form data is sent'],
                    ['method', 'GET (in URL) or POST (in body)'],
                    ['enctype', 'Encoding type (for file uploads)'],
                ]} />

                {/* TASK 8: Placed right after Form tags completion! */}
                <PracticeTaskCard
                    taskId="8"
                    title="Task 8: Student Registration Form"
                    desc="Ab aapne sabhi form elements seekh liye hain! Task 8 me complete Student Registration Form banayein jisme Personal Info, Account Info, Radio, Checkbox, Dropdown, aur Textarea ho."
                    tagsCovered={['<form>', '<fieldset>', '<legend>', '<input type>', '<select>', '<textarea>', 'submit']}
                    highlightBadge="Interactive Form Project"
                />
            </Section>

            {/* 19 */}
            <Section id="div-span" title="19. <div> and <span> Tags">
                <p><code className="bg-gray-100 px-1 rounded">&lt;div&gt;</code> is a block-level container. <code className="bg-gray-100 px-1 rounded">&lt;span&gt;</code> is an inline container.</p>
                <Code code={`<!-- div - Block level -->
<div style="background:#eee; padding:20px; margin:10px 0;">
    <h2 id="section-title">Section Title</h2>
    <p>Content in a div.</p>
</div>

<!-- span - Inline -->
<p>My name is <span style="color:blue; font-weight:bold;">
Rahul</span> and I study <span style="color:orange;">
Computer Science</span>.</p>`} />
                <div className="overflow-x-auto my-3">
                    <table className="w-full text-xs sm:text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead><tr className="bg-blue-50"><th className="py-2 px-3 text-left text-blue-700 border-b border-gray-200">Feature</th><th className="py-2 px-3 text-left text-blue-700 border-b border-gray-200">&lt;div&gt;</th><th className="py-2 px-3 text-left text-blue-700 border-b border-gray-200">&lt;span&gt;</th></tr></thead>
                        <tbody>
                            <tr className="bg-white"><td className="py-2 px-3 border-b border-gray-100 font-medium">Type</td><td className="py-2 px-3 border-b border-gray-100">Block-level</td><td className="py-2 px-3 border-b border-gray-100">Inline</td></tr>
                            <tr className="bg-gray-50"><td className="py-2 px-3 border-b border-gray-100 font-medium">Width</td><td className="py-2 px-3 border-b border-gray-100">Full width</td><td className="py-2 px-3 border-b border-gray-100">Content width</td></tr>
                            <tr className="bg-white"><td className="py-2 px-3 border-b border-gray-100 font-medium">New Line</td><td className="py-2 px-3 border-b border-gray-100">Yes</td><td className="py-2 px-3 border-b border-gray-100">No</td></tr>
                            <tr className="bg-gray-50"><td className="py-2 px-3 font-medium">Use</td><td className="py-2 px-3">Group sections</td><td className="py-2 px-3">Style inline text</td></tr>
                        </tbody>
                    </table>
                </div>
                <QuickPractice title="Containers Self Check">
                    Use <code className="bg-white px-1 rounded">&lt;div&gt;</code> to group entire layout blocks and <code className="bg-white px-1 rounded">&lt;span&gt;</code> to style specific words or phrases inline.
                </QuickPractice>
            </Section>

            {/* 20 - SEMANTIC HTML5: Milestone for Task 11 */}
            <Section id="semantic" title="20. HTML5 Semantic Elements">
                <p>Semantic elements describe their meaning clearly, helping browsers and search engines understand page structure.</p>
                <Code code={`<header>
    <nav>
        <a href="/">Home</a> | 
        <a href="/about">About</a>
    </nav>
</header>
<main>
    <article>
        <h1>Article Title</h1>
        <p>Content...</p>
    </article>
    <section>
        <h2 id="section-title">Section Title</h2>
    </section>
    <aside>
        <h3 id="related-links">Related Links</h3>
    </aside>
</main>
<footer>
    <p>&copy; 2025 Knobly Education</p>
</footer>`} />
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-200 my-3">
                    <h4 className="text-sm font-bold text-teal-700 mb-2">Semantic Tags:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-700">
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;header&gt;</code> — Page header</div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;nav&gt;</code> — Navigation</div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;main&gt;</code> — Main content</div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;article&gt;</code> — Independent content</div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;section&gt;</code> — Thematic group</div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;aside&gt;</code> — Sidebar</div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;footer&gt;</code> — Page footer</div>
                        <div><code className="bg-white px-1 rounded text-red-600">&lt;figure&gt;</code> — Image + caption</div>
                    </div>
                </div>

                {/* TASK 11: Placed right after Semantic HTML5 completion! */}
                <PracticeTaskCard
                    taskId="11"
                    title="Task 11: Premium Demo Website Layout"
                    desc="HTML5 semantic elements (<header>, <nav>, <footer>) aur structured tables ka use karke ek modern business demo website banayein."
                    tagsCovered={['<header>', '<nav>', '<footer>', '<table>', '<form>', '<h1> - <h3>', '&copy;']}
                    highlightBadge="Modern Layout Project"
                />
            </Section>

            {/* 21 - AUDIO & VIDEO: Milestone for Task 9 & 5.4 */}
            <Section id="audio-video" title="21. Audio and Video Tags">
                <p>HTML5 supports audio and video directly.</p>
                <Code code={`<!-- Audio -->
<audio controls>
    <source src="song.mp3" type="audio/mpeg">
    Browser does not support audio.
</audio>

<!-- Video -->
<video width="640" height="360" controls poster="thumb.jpg">
    <source src="video.mp4" type="video/mp4">
    Browser does not support video.
</video>

<!-- YouTube Embed -->
<iframe width="560" height="315" 
    src="https://www.youtube.com/embed/VIDEO_ID"
    allowfullscreen></iframe>`} />
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 my-3">
                    <h4 className="text-sm font-bold text-indigo-700 mb-2">Attributes:</h4>
                    <div className="space-y-1 text-xs text-gray-700">
                        <div><code className="bg-white px-1 rounded text-red-600">controls</code> — Show play/pause buttons</div>
                        <div><code className="bg-white px-1 rounded text-red-600">autoplay</code> — Auto-start playing</div>
                        <div><code className="bg-white px-1 rounded text-red-600">loop</code> — Repeat playback</div>
                        <div><code className="bg-white px-1 rounded text-red-600">muted</code> — Start muted</div>
                        <div><code className="bg-white px-1 rounded text-red-600">poster</code> — Video thumbnail image</div>
                    </div>
                </div>

                {/* TASK 9 & 5.4: Placed right after Audio & Video completion! */}
                <div className="space-y-3">
                    <PracticeTaskCard
                        taskId="9"
                        title="Task 9: Solar System Basics (with Video Player)"
                        desc="Solar System page jisme detailed facts table ke sath embedded HTML5 video player (<video controls>) ho."
                        tagsCovered={['<video controls>', '<source>', '<table>', '<ol>', '<form>', '<img>']}
                        highlightBadge="Video & Media Project"
                    />
                    <PracticeTaskCard
                        taskId="5.4"
                        title="Task 5.4: The Wonders of Space"
                        desc="Space exploration multimedia page with facts table, celestial lists, aur astronomical links."
                        tagsCovered={['video/media', '<table>', '<ul>', '<ol>', '<dl>', '<img>']}
                        highlightBadge="Space Multimedia Project"
                    />
                </div>
            </Section>

            {/* 22 */}
            <Section id="iframe-tag" title="22. <iframe> Tag">
                <p>The <code className="bg-gray-100 px-1 rounded">&lt;iframe&gt;</code> tag embeds another HTML page within the current page.</p>
                <Code code={`<!-- Embed a webpage -->
<iframe src="https://www.example.com" 
    width="600" height="400"></iframe>

<!-- Embed Google Maps -->
<iframe src="https://www.google.com/maps/embed?pb=..."
    width="600" height="450" 
    style="border:0;" allowfullscreen 
    loading="lazy"></iframe>

<!-- Link targeting iframe -->
<iframe src="page.html" name="myframe" 
    width="100%" height="500"></iframe>
<a href="page2.html" target="myframe">Load Page 2</a>`} />
                <QuickPractice title="iFrame Target Check">
                    Use <code className="bg-white px-1 rounded">target=&quot;myframe&quot;</code> on an anchor tag to open links directly inside an embedded iframe!
                </QuickPractice>
            </Section>

            {/* 23 - ENTITIES & CAPSTONE: Milestone for Task 10 */}
            <Section id="entities" title="23. HTML Entities & Capstone Project">
                <p>Reserved characters in HTML must be displayed using entities.</p>
                <div className="overflow-x-auto my-3">
                    <table className="w-full text-xs sm:text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead><tr className="bg-blue-50"><th className="py-2 px-2 sm:px-3 text-left text-blue-700 border-b border-gray-200">Char</th><th className="py-2 px-2 sm:px-3 text-left text-blue-700 border-b border-gray-200">Entity</th><th className="py-2 px-2 sm:px-3 text-left text-blue-700 border-b border-gray-200">Code</th><th className="py-2 px-2 sm:px-3 text-left text-blue-700 border-b border-gray-200">Description</th></tr></thead>
                        <tbody>
                            {[['<', '&lt;', '&#60;', 'Less than'], ['>', '&gt;', '&#62;', 'Greater than'], ['&', '&amp;', '&#38;', 'Ampersand'], ['"', '&quot;', '&#34;', 'Double quote'], [' ', '&nbsp;', '&#160;', 'Non-breaking space'], ['©', '&copy;', '&#169;', 'Copyright'], ['®', '&reg;', '&#174;', 'Registered'], ['™', '&trade;', '&#8482;', 'Trademark'], ['₹', '&#8377;', '&#8377;', 'Rupee'], ['♥', '&hearts;', '&#9829;', 'Heart'], ['→', '&rarr;', '&#8594;', 'Right arrow'], ['★', '&#9733;', '&#9733;', 'Star']].map(([c, e, n, d], i) => (
                                <tr key={i} className={i % 2 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="py-2 px-2 sm:px-3 border-b border-gray-100 text-lg">{c}</td>
                                    <td className="py-2 px-2 sm:px-3 border-b border-gray-100"><code className="text-red-600 text-xs">{e}</code></td>
                                    <td className="py-2 px-2 sm:px-3 border-b border-gray-100"><code className="text-red-600 text-xs">{n}</code></td>
                                    <td className="py-2 px-2 sm:px-3 border-b border-gray-100 text-gray-600">{d}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Code code={`<p>5 &lt; 10 and 10 &gt; 5</p>
<p>Price: &#8377;500</p>
<p>&copy; 2025 Knobly Education</p>
<p>I &hearts; HTML</p>`} />

                {/* TASK 10: Capstone Project placed after all elements are complete! */}
                <PracticeTaskCard
                    taskId="10"
                    title="Task 10: Full Multi-Section Website Layout (Capstone Project)"
                    desc="Badhaai ho! Ab aapne HTML ke sabhi chapters complete kar liye hain! Task 10 me nav, marquee, tables, forms, videos, lists, aur iframes ko mila kar ek complete master website banayein."
                    tagsCovered={['<iframe>', '<video>', '<nav>', '<table>', '<form>', '<dl>', '<ul>', '&copy;']}
                    highlightBadge="Master Capstone Project"
                />
            </Section>
        </SidebarLayout>
    );
}
