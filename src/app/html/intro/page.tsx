'use client';
import { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Home, BookOpen, Code2, Sparkles, ChevronRight, Languages, Play, CheckCircle2 } from 'lucide-react';

/* ── Premium Helper Components ── */

function Section({ title, hindiTitle, isHindi, children }: { title: string; hindiTitle?: string; isHindi?: boolean; children: ReactNode }) {
    return (
        <section className="relative bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-4 sm:p-5 md:p-7 mb-5 transition-shadow duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
            <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                <span className="inline-block w-1.5 h-6 rounded-full bg-gradient-to-b from-orange-500 to-red-600" />
                {isHindi && hindiTitle ? hindiTitle : title}
            </h2>
            <div className="text-[13px] sm:text-sm text-gray-600 leading-relaxed space-y-4">{children}</div>
        </section>
    );
}

function CodeBlock({ code, title = 'index.html' }: { code: string; title?: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="rounded-xl overflow-hidden my-4 shadow-sm border border-gray-800/20" style={{ background: '#1e1e2e' }}>
            <div className="flex items-center justify-between px-3 py-2" style={{ background: '#181825' }}>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono ml-1">{title}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="text-[10px] px-2.5 py-1 rounded-md font-semibold transition-all"
                    style={{ background: copied ? '#166534' : '#313244', color: copied ? '#86efac' : '#a6adc8' }}
                >
                    {copied ? '✓ Copied' : 'Copy'}
                </button>
            </div>
            <pre className="p-3 sm:p-4 overflow-x-auto text-xs sm:text-[13px] leading-relaxed font-mono" style={{ color: '#cdd6f4' }}>
                <code>{code}</code>
            </pre>
        </div>
    );
}

function InfoBox({ type = 'note', children }: { type?: 'note' | 'tip' | 'warning'; children: ReactNode }) {
    const styles = {
        note: 'bg-blue-50 border-blue-200 text-blue-800',
        tip: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
    };
    const icons = { note: '💡', tip: '✅', warning: '⚠️' };
    return (
        <div className={`border rounded-xl p-3 sm:p-4 text-xs sm:text-[13px] ${styles[type]} my-4 leading-relaxed flex gap-2`}>
            <span className="shrink-0">{icons[type]}</span>
            <div>{children}</div>
        </div>
    );
}

function InfoCard({ title, children, color = 'blue' }: { title: string; children: ReactNode; color?: string }) {
    const colors: Record<string, string> = {
        blue: 'border-blue-100 bg-blue-50/50',
        orange: 'border-orange-100 bg-orange-50/50',
        green: 'border-emerald-100 bg-emerald-50/50',
        purple: 'border-purple-100 bg-purple-50/50',
    };
    const titleColors: Record<string, string> = {
        blue: 'text-blue-700',
        orange: 'text-orange-700',
        green: 'text-emerald-700',
        purple: 'text-purple-700',
    };
    return (
        <div className={`rounded-xl border p-4 my-4 ${colors[color] || colors.blue}`}>
            <h4 className={`text-sm font-bold mb-3 ${titleColors[color] || titleColors.blue}`}>{title}</h4>
            <div className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">{children}</div>
        </div>
    );
}

function Step({ num, title, desc }: { num: number; title: string; desc: string }) {
    return (
        <div className="flex gap-3 items-start">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm shadow-orange-500/25">
                {num}
            </span>
            <div>
                <strong className="text-gray-900 text-sm">{title}</strong>
                <p className="text-gray-500 mt-0.5 text-xs">{desc}</p>
            </div>
        </div>
    );
}

function Timeline({ items }: { items: { year: string; title: string; desc: string }[] }) {
    return (
        <div className="space-y-3">
            {items.map((item, i) => (
                <div key={i} className="flex gap-3 items-start group">
                    <div className="flex flex-col items-center">
                        <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold shrink-0 shadow-sm">
                            {item.year}
                        </span>
                        {i < items.length - 1 && <div className="w-0.5 h-6 bg-gray-200 mt-1" />}
                    </div>
                    <div className="pb-1">
                        <strong className="text-gray-900 text-xs">{item.title}</strong>
                        <span className="text-gray-500 text-xs ml-1">— {item.desc}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── Main Page Component ── */

export default function HtmlIntro() {
    const router = useRouter();
    const [isHindi, setIsHindi] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-rose-50/10" style={{ color: '#1e293b' }}>
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (typeof window !== 'undefined' && window.history.length > 1) {
                                    router.back();
                                } else {
                                    router.push('/html');
                                }
                            }}
                            className="text-gray-600 hover:text-gray-900 transition-colors p-1 rounded-lg hover:bg-gray-100"
                            title="Go Back"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-sm shadow-orange-500/25">
                                <BookOpen size={13} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xs sm:text-sm font-bold text-gray-900">
                                    {isHindi ? 'HTML का परिचय' : 'Introduction to HTML'}
                                </h1>
                                <span className="text-[9px] text-gray-600 uppercase tracking-wider">HTML Course</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Language Toggle Button */}
                        <button
                            onClick={() => setIsHindi(!isHindi)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold transition-all shadow-sm"
                            title="Toggle Hindi / English"
                        >
                            <Languages size={14} />
                            <span>{isHindi ? 'English' : 'हिंदी'}</span>
                        </button>

                        <Link
                            href="/html/compiler?from=/html/intro"
                            onClick={() => {
                                try { sessionStorage.setItem('knobly_compiler_return', '/html/intro'); } catch (e) {}
                            }}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold shadow-sm shadow-orange-500/20 hover:scale-105 transition-all"
                        >
                            <Play size={12} fill="currentColor" />
                            <span>{isHindi ? 'कम्पाइलर' : 'Compiler'}</span>
                        </Link>

                        <Link href="/" className="text-gray-600 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                            <Home size={16} />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-3 sm:px-5 md:px-8 py-6">
                {/* Hero Banner */}
                <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl p-5 sm:p-7 mb-6 shadow-lg shadow-orange-500/20">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                    <div className="absolute top-3 right-6 text-white/8 text-5xl sm:text-7xl font-black select-none">&lt;/&gt;</div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Sparkles size={14} className="text-yellow-200" />
                                <span className="text-[10px] font-bold text-orange-100 uppercase tracking-[0.2em]">
                                    {isHindi ? 'यहाँ से शुरुआत करें' : 'Start Here'}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsHindi(!isHindi)}
                                className="sm:hidden flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-sm"
                            >
                                <Languages size={12} />
                                {isHindi ? 'English' : 'हिंदी'}
                            </button>
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-1.5">
                            {isHindi ? 'HTML का परिचय' : 'Introduction to HTML'}
                        </h1>
                        <p className="text-orange-100 text-xs sm:text-sm mb-4">
                            {isHindi
                                ? 'वेब डेवलपमेंट की नींव सीखें — बुनियादी संरचना से लेकर अपना पहला वेब पेज बनाने तक।'
                                : 'Learn the foundation of every website — from basic structure to your first web page.'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[10px] font-semibold">
                                {isHindi ? '11 विषय' : '11 Topics'}
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[10px] font-semibold">
                                {isHindi ? 'कोड उदाहरण' : 'Code Examples'}
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[10px] font-semibold">
                                {isHindi ? 'शुरुआती लोगों के लिए उपयुक्त' : 'Beginner Friendly'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Section 1: What is HTML */}
                <Section title="What is HTML?" hindiTitle="1. HTML क्या है? (What is HTML?)" isHindi={isHindi}>
                    {isHindi ? (
                        <>
                            <p>
                                <strong>HTML (HyperText Markup Language)</strong> वेब पेज बनाने के लिए उपयोग की जाने वाली एक मानक मार्कअप भाषा है। यह एक श्रृंखला में मौजूद <strong>elements</strong> का उपयोग करके वेब पेज की संरचना का वर्णन करती है, जो ब्राउज़र को बताती है कि सामग्री को कैसे प्रदर्शित किया जाए।
                            </p>
                            <p>
                                <span className="font-bold text-orange-700">Hyper Text</span> शब्द का अर्थ है विभिन्न वेब पेजों को एक साथ link करने की क्षमता, जबकि <span className="font-bold text-orange-700">Markup Language</span> का मतलब है कि यह text के भीतर elements को चिह्नित करने के लिए <strong>tags</strong> का उपयोग करती है।
                            </p>
                            <p>
                                HTML को <strong>Tim Berners-Lee</strong> ने <strong>1991</strong> में विकसित किया था। इसका नवीनतम मानक <strong>HTML5</strong> है, जिसने कई नई सुविधाएं जैसे सेमेंटिक तत्व, ऑडियो/वीडियो सपोर्ट और कैनवस प्रदान किए हैं।
                            </p>
                            <InfoBox type="note">
                                HTML कोई प्रोग्रामिंग भाषा <strong>नहीं</strong> है — यह एक <strong>मार्कअप भाषा</strong> है। इसमें कोई logic, loops या variables नहीं होते। यह केवल वेब पेज की संरचना और सामग्री को परिभाषित करती है।
                            </InfoBox>
                            <InfoCard title="HTML के महत्वपूर्ण तथ्य (Key Facts)" color="orange">
                                <ul className="list-disc list-inside space-y-1.5">
                                    <li>HTML का पूरा नाम <strong>HyperText Markup Language</strong> है</li>
                                    <li>HTML वेब पेज की <strong>संरचना (Structure)</strong> को परिभाषित करती है</li>
                                    <li>HTML में कई <strong>elements और tags</strong> होते हैं</li>
                                    <li>HTML तत्व ब्राउज़र को बताते हैं कि सामग्री को <strong>कैसे दिखाना</strong> है</li>
                                    <li>HTML फाइल का एक्सटेंशन <code className="px-1.5 py-0.5 rounded bg-gray-100 text-red-700 text-xs border border-gray-200">.html</code> या <code className="px-1.5 py-0.5 rounded bg-gray-100 text-red-700 text-xs border border-gray-200">.htm</code> होता है</li>
                                    <li>HTML को Notepad, VS Code आदि किसी भी साधारण टेक्स्ट एडिटर में लिखा जा सकता है</li>
                                </ul>
                            </InfoCard>
                        </>
                    ) : (
                        <>
                            <p>
                                <strong>HTML (HyperText Markup Language)</strong> is the standard markup language used to create and design web pages. It describes the structure of a web page using a series of elements, which tell the browser how to display the content.
                            </p>
                            <p>
                                The term <strong className="text-orange-700">HyperText</strong> refers to the ability to link various web pages together, while <strong className="text-orange-700">Markup Language</strong> indicates that it uses tags to mark elements within the text.
                            </p>
                            <p>
                                HTML was created by <strong>Tim Berners-Lee</strong> in <strong>1991</strong>. The latest version is <strong>HTML5</strong>, which introduced many new features like semantic elements, audio/video support, canvas, and more.
                            </p>
                            <InfoBox type="note">
                                HTML is NOT a programming language — it is a <strong>markup language</strong>. It does not have logic, loops, or variables. It only defines the structure and content of a web page.
                            </InfoBox>
                            <InfoCard title="Key Facts about HTML" color="orange">
                                <ul className="list-disc list-inside space-y-1.5">
                                    <li>HTML stands for <strong>HyperText Markup Language</strong></li>
                                    <li>HTML describes the <strong>structure</strong> of a Web page</li>
                                    <li>HTML consists of a series of <strong>elements</strong></li>
                                    <li>HTML elements tell the browser <strong>how to display</strong> the content</li>
                                    <li>HTML file extension is <code className="px-1.5 py-0.5 rounded bg-gray-100 text-red-700 text-xs border border-gray-200">.html</code> or <code className="px-1.5 py-0.5 rounded bg-gray-100 text-red-700 text-xs border border-gray-200">.htm</code></li>
                                    <li>HTML can be created and edited using any text editor like Notepad, VS Code, Sublime Text, etc.</li>
                                </ul>
                            </InfoCard>
                        </>
                    )}
                </Section>

                {/* Section 2: History & Versions */}
                <Section title="History of HTML & Versions" hindiTitle="2. HTML का इतिहास और संस्करण (History & Versions)" isHindi={isHindi}>
                    {isHindi ? (
                        <>
                            <p>
                                HTML को <strong>Tim Berners-Lee</strong> ने 1991 में विकसित किया था। शुरुआत में इसका उपयोग सरल वैज्ञानिक दस्तावेज़ साझा करने के लिए किया जाता था, लेकिन समय के साथ यह multimedia और interactivity का समर्थन करने के लिए विकसित हुआ।
                            </p>
                            <p>
                                HTML को लगातार <strong>W3C (World Wide Web Consortium)</strong> और WHATWG द्वारा अपडेट किया जाता है।
                            </p>
                            <InfoCard title="HTML संस्करणों की समयरेखा (Versions Timeline)" color="blue">
                                <Timeline items={[
                                    { year: '1991', title: 'HTML 1.0', desc: 'Tim Berners-Lee द्वारा विकसित प्रारंभिक संस्करण (केवल 18 टैग्स)' },
                                    { year: '1995', title: 'HTML 2.0', desc: 'IETF द्वारा मानकीकृत पहला आधिकारिक संस्करण, फॉर्म्स और टेबल्स जोड़े गए' },
                                    { year: '1997', title: 'HTML 3.2', desc: 'W3C सिफारिश, बेहतर स्टाइलिंग और स्क्रिप्टिंग समर्थन' },
                                    { year: '1999', title: 'HTML 4.01', desc: 'CSS सपोर्ट और मल्टीमीडिया के साथ व्यापक रूप से स्वीकृत मानक' },
                                    { year: '2000', title: 'XHTML 1.0', desc: 'HTML को XML के सख्त नियमों के अनुसार पुनर्गठित किया गया' },
                                    { year: '2008/14', title: 'HTML5', desc: 'आधुनिक मानक — सेमेंटिक टैग्स, ऑडियो/वीडियो, कैनवस और मोबाइल सपोर्ट' },
                                ]} />
                            </InfoCard>
                        </>
                    ) : (
                        <>
                            <p>HTML has evolved significantly since its creation in 1991. Here is a brief timeline of official HTML versions:</p>
                            <InfoCard title="HTML Version Timeline" color="blue">
                                <Timeline items={[
                                    { year: '1991', title: 'HTML 1.0', desc: 'Tim Berners-Lee invented HTML. The first version had only 18 tags.' },
                                    { year: '1995', title: 'HTML 2.0', desc: 'Published as a standard by IETF. Added form elements and tables.' },
                                    { year: '1997', title: 'HTML 3.2', desc: 'W3C Recommendation. Added support for scripts, tables, applets.' },
                                    { year: '1999', title: 'HTML 4.01', desc: 'Major version with CSS support, scripting improvements, and accessibility features.' },
                                    { year: '2000', title: 'XHTML 1.0', desc: 'HTML reformulated as XML. Stricter syntax rules.' },
                                    { year: '2008/14', title: 'HTML5', desc: 'Current living standard. Added semantic elements, multimedia, Canvas, SVG, and Web Storage.' },
                                ]} />
                            </InfoCard>
                        </>
                    )}
                </Section>

                {/* Section 3: HTML Editors */}
                <Section title="HTML Editors" hindiTitle="3. HTML एडिटर्स (HTML Editors)" isHindi={isHindi}>
                    <p>
                        {isHindi
                            ? 'HTML फाइलों को किसी भी साधारण टेक्स्ट एडिटर में लिखा जा सकता है। आधुनिक कोड एडिटर्स सिंटैक्स हाइलाइटिंग, ऑटो-कम्प्लीशन और एरर डिटेक्शन की सुविधा देते हैं:'
                            : 'HTML files can be created using any text editor. However, specialized code editors provide features like syntax highlighting, auto-completion, and error detection.'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                        {[
                            {
                                name: 'VS Code',
                                desc: isHindi ? 'Microsoft द्वारा सबसे लोकप्रिय मुफ्त कोड एडिटर। इसमें IntelliSense, लाइव सर्वर और एक्सटेंशन मौजूद हैं।' : 'Most popular free code editor by Microsoft. IntelliSense, extensions, integrated terminal, and Git support.',
                                badge: isHindi ? 'सर्वश्रेष्ठ' : 'Recommended',
                                color: 'bg-emerald-50 border-emerald-100',
                            },
                            {
                                name: 'Notepad',
                                desc: isHindi ? 'Windows में पहले से मौजूद सरल एडिटर। शुरुआती अभ्यास के लिए अच्छा है।' : 'Simple text editor built into Windows. Great for beginners to understand raw HTML.',
                                badge: 'Windows',
                                color: 'bg-blue-50 border-blue-100',
                            },
                            {
                                name: 'Sublime Text',
                                desc: isHindi ? 'तेज़ और हल्का कोड एडिटर जो शॉर्टकट और क्लीन इंटरफेस के लिए जाना जाता है।' : 'Lightweight and fast editor with powerful shortcuts and a distraction-free writing mode.',
                                badge: 'Fast',
                                color: 'bg-purple-50 border-purple-100',
                            },
                            {
                                name: 'Notepad++',
                                desc: isHindi ? 'Windows के लिए मुफ्त और ओपन-सोर्स एडिटर जो कई भाषाओं का सिंटैक्स सपोर्ट करता है।' : 'Free source code editor for Windows. Supports syntax highlighting for many languages.',
                                badge: 'Free',
                                color: 'bg-amber-50 border-amber-100',
                            },
                        ].map((editor) => (
                            <div key={editor.name} className={`rounded-xl border p-4 ${editor.color}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <strong className="text-gray-900 text-sm">{editor.name}</strong>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 bg-white px-2 py-0.5 rounded-full shadow-xs">
                                        {editor.badge}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600">{editor.desc}</p>
                            </div>
                        ))}
                    </div>
                    <InfoBox type="tip">
                        {isHindi ? (
                            <span>शुरुआती छात्रों के लिए हम <strong>VS Code</strong> का उपयोग करने की सलाह देते हैं — यह मुफ्त है और इसमें HTML के लिए बेहतरीन सपोर्ट है।</span>
                        ) : (
                            <span>For beginners, we recommend using <strong>VS Code</strong> (Visual Studio Code) — it is free, lightweight, and has excellent HTML support built-in.</span>
                        )}
                    </InfoBox>
                </Section>

                {/* Section 4: Basic Structure */}
                <Section title="Basic Structure of an HTML Page" hindiTitle="4. HTML दस्तावेज़ की मूल संरचना (Basic Structure)" isHindi={isHindi}>
                    <p>
                        {isHindi
                            ? 'प्रत्येक HTML पेज एक मानक संरचना का पालन करता है। नीचे एक HTML5 दस्तावेज़ का बुनियादी ढांचा दिया गया है:'
                            : 'Every HTML page follows a standard structure. Here is the basic skeleton of an HTML document:'}
                    </p>

                    <CodeBlock code={`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first web page.</p>
</body>
</html>`} />

                    {/* Try Compiler Button */}
                    <div className="flex flex-wrap items-center gap-3 my-4 p-4 rounded-xl bg-orange-50/70 border border-orange-200">
                        <Link
                            href="/html/compiler?from=/html/intro"
                            onClick={() => {
                                try { sessionStorage.setItem('knobly_compiler_return', '/html/intro'); } catch (e) {}
                            }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 hover:shadow-lg hover:scale-105 transition-all"
                        >
                            <Play size={15} fill="currentColor" />
                            {isHindi ? 'लाइव HTML Compiler आज़माएं' : 'Try in Live HTML Compiler'}
                        </Link>
                        <span className="text-xs text-gray-600">
                            {isHindi
                                ? 'बिना किसी सॉफ्टवेयर के सीधे अपने ब्राउज़र में इस कोड को चलाकर देखें!'
                                : 'Run & preview this code instantly in your browser without installing anything!'}
                        </span>
                    </div>

                    <InfoCard title={isHindi ? 'प्रत्येक भाग की व्याख्या (Explanation of Each Part)' : 'Explanation of Each Part'} color="blue">
                        <div className="space-y-2.5">
                            {(isHindi ? [
                                ['<!DOCTYPE html>', 'घोषित करता है कि यह दस्तावेज़ एक HTML5 दस्तावेज़ है। यह सबसे पहली पंक्ति होनी चाहिए।'],
                                ['<html>', 'HTML दस्तावेज़ का रूट (Root) एलिमेंट। सभी अन्य तत्व इसके अंदर होते हैं।'],
                                ['<head>', 'पेज की मेटा-सूचना (शीर्षक, वर्ण एन्कोडिंग, स्टाइलशीट लिंक) रखता है। यह स्क्रीन पर नहीं दिखता।'],
                                ['<meta charset="UTF-8">', 'दस्तावेज़ की वर्ण एन्कोडिंग निर्धारित करता है (UTF-8 लगभग सभी अक्षरों का समर्थन करता है)।'],
                                ['<meta name="viewport">', 'मोबाइल डिवाइस पर वेब पेज को रिस्पॉन्सिव (अनुकूल) बनाता है।'],
                                ['<title>', 'ब्राउज़र के टैब पर दिखने वाले पेज का शीर्षक सेट करता है।'],
                                ['<body>', 'वेब पेज की सभी दृश्य सामग्री (शीर्षक, पैराग्राफ, चित्र, लिंक आदि) को समाहित करता है।'],
                                ['<h1>', 'पेज के सबसे बड़े मुख्य शीर्षक (Heading) को परिभाषित करता है।'],
                                ['<p>', 'टेक्स्ट के एक पैराग्राफ को परिभाषित करता है।'],
                            ] : [
                                ['<!DOCTYPE html>', 'Declares that this document is an HTML5 document. Must be the very first line.'],
                                ['<html>', 'The root element. All other elements are contained inside this.'],
                                ['<head>', 'Contains meta-information about the page (title, charset, stylesheets). NOT displayed on screen.'],
                                ['<meta charset="UTF-8">', 'Character encoding (UTF-8 supports most global characters and symbols).'],
                                ['<meta name="viewport">', 'Makes the web page responsive on mobile devices.'],
                                ['<title>', 'Sets the title shown in the browser tab.'],
                                ['<body>', 'Contains all the visible content (text, images, links, tables, forms, etc.).'],
                                ['<h1>', 'Defines the main heading of the page.'],
                                ['<p>', 'Defines a paragraph of text.'],
                            ]).map(([tag, desc], i) => (
                                <div key={i} className="flex gap-2 items-start">
                                    <code className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200 shrink-0 font-mono">
                                        {tag}
                                    </code>
                                    <span className="text-xs text-gray-700">{desc}</span>
                                </div>
                            ))}
                        </div>
                    </InfoCard>
                </Section>

                {/* Section 5: HTML Tags & Syntax */}
                <Section title="HTML Tags & Syntax" hindiTitle="5. HTML टैग्स और सिंटैक्स (Tags & Syntax)" isHindi={isHindi}>
                    <p>
                        {isHindi
                            ? 'HTML में एलिमेंट्स को परिभाषित करने के लिए tags का उपयोग किया जाता है। टैग्स को कोण कोष्ठक < > के अंदर लिखा जाता है। अधिकांश टैग्स जोड़ों में आते हैं — एक opening tag और एक closing tag।'
                            : 'HTML uses tags to define elements. Tags are written inside angle brackets < >. Most tags come in pairs — an opening tag and a closing tag.'}
                    </p>
                    <CodeBlock code={`<!-- Opening and closing tags with content -->
<p>This is a paragraph.</p>

<!-- Self-closing tags (no separate closing tag required) -->
<br>
<hr>
<img src="photo.jpg" alt="A photo">`} />
                    <InfoCard title={isHindi ? 'टैग सिंटैक्स के नियम' : 'Tag Syntax Rules'} color="orange">
                        <div className="space-y-2 text-xs sm:text-[13px]">
                            <div><strong>{isHindi ? 'Opening Tag:' : 'Opening Tag:'}</strong> <code className="px-1.5 py-0.5 rounded bg-gray-100 text-xs border border-gray-200 font-mono">&lt;tagname&gt;</code> — {isHindi ? 'एलिमेंट की शुरुआत करता है' : 'Starts an element'}</div>
                            <div><strong>{isHindi ? 'Content:' : 'Content:'}</strong> {isHindi ? 'टैग्स के बीच की सामग्री (टेक्स्ट या अन्य एलिमेंट्स)' : 'The content between opening and closing tags'}</div>
                            <div><strong>{isHindi ? 'Closing Tag:' : 'Closing Tag:'}</strong> <code className="px-1.5 py-0.5 rounded bg-gray-100 text-xs border border-gray-200 font-mono">&lt;/tagname&gt;</code> — {isHindi ? 'एलिमेंट को समाप्त करता है (फॉरवर्ड स्लैश / अवश्य लगाएं)' : 'Ends an element (note the forward slash /)'}</div>
                            <div><strong>{isHindi ? 'Empty / Self-closing:' : 'Empty / Self-closing:'}</strong> <code className="px-1.5 py-0.5 rounded bg-gray-100 text-xs border border-gray-200 font-mono">&lt;br&gt;</code>, <code className="px-1.5 py-0.5 rounded bg-gray-100 text-xs border border-gray-200 font-mono">&lt;img&gt;</code>, <code className="px-1.5 py-0.5 rounded bg-gray-100 text-xs border border-gray-200 font-mono">&lt;hr&gt;</code> — {isHindi ? 'जिनका कोई क्लोजिंग टैग नहीं होता' : 'Elements without text content'}</div>
                        </div>
                    </InfoCard>
                    <InfoBox type="warning">
                        {isHindi
                            ? 'HTML टैग्स Case-Sensitive नहीं होते: <P> और <p> एक समान हैं। फिर भी, W3C मानक के अनुसार हमेशा lowercase (छोटे अक्षरों) में टैग्स लिखना सर्वोत्तम अभ्यास है।'
                            : 'HTML tags are NOT case-sensitive: <P> and <p> are identical. However, it is standard industry best practice to always write tags in lowercase.'}
                    </InfoBox>
                </Section>

                {/* Section 6: HTML Attributes */}
                <Section title="HTML Attributes" hindiTitle="6. HTML विशेषताएं (Attributes)" isHindi={isHindi}>
                    <p>
                        {isHindi
                            ? 'Attributes एलिमेंट्स के बारे में अतिरिक्त जानकारी प्रदान करते हैं। इन्हें हमेशा opening tag में लिखा जाता है और आमतौर पर name="value" के जोड़े में होते हैं।'
                            : 'Attributes provide additional information about HTML elements. They are always specified in the opening tag and usually come in name="value" pairs.'}
                    </p>
                    <CodeBlock code={`<!-- href attribute for hyperlinks -->
<a href="https://knobly.com" target="_blank">Visit Knobly</a>

<!-- src and alt attributes for images -->
<img src="flower.jpg" alt="Beautiful Rose" width="300" height="200">

<!-- id and class attributes for styling and JS -->
<div id="header-container" class="main-card">
    <p class="highlight-text">Styled text</p>
</div>

<!-- title attribute for tooltip on hover -->
<p title="Click to view details">Hover over this text!</p>`} />

                    <div className="overflow-x-auto my-4 rounded-xl border border-gray-200 shadow-sm">
                        <table className="w-full text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-orange-50 to-red-50">
                                    <th className="text-left py-2.5 px-3 text-orange-800 font-bold text-xs border-b border-orange-100">{isHindi ? 'विशेषता (Attribute)' : 'Attribute'}</th>
                                    <th className="text-left py-2.5 px-3 text-orange-800 font-bold text-xs border-b border-orange-100">{isHindi ? 'विवरण' : 'Description'}</th>
                                    <th className="text-left py-2.5 px-3 text-orange-800 font-bold text-xs border-b border-orange-100">{isHindi ? 'उपयोग' : 'Used With'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['href', isHindi ? 'लिंक का URL या पता निर्दिष्ट करता है' : 'Specifies the URL of a hyperlink', '<a>'],
                                    ['src', isHindi ? 'इमेज या मीडिया फाइल का स्रोत पथ' : 'Specifies the path to an image or media file', '<img>, <script>, <audio>'],
                                    ['alt', isHindi ? 'इमेज न लोड होने पर वैकल्पिक टेक्स्ट' : 'Alternative text if image cannot load', '<img>'],
                                    ['width / height', isHindi ? 'एलिमेंट की चौड़ाई और ऊंचाई सेट करता है' : 'Sets width and height in pixels or %', '<img>, <table>, <iframe>'],
                                    ['id', isHindi ? 'एलिमेंट के लिए एक विशिष्ट यूनिक पहचानकर्ता' : 'Unique identifier for an element on the page', 'All elements'],
                                    ['class', isHindi ? 'CSS स्टाइलिंग के लिए क्लास नाम' : 'CSS class name(s) for styling and grouping', 'All elements'],
                                    ['style', isHindi ? 'इनलाइन CSS स्टाइल लागू करने के लिए' : 'Inline CSS styles applied directly', 'All elements'],
                                    ['title', isHindi ? 'माउस होवर करने पर टूलटिप टेक्स्ट दिखाता है' : 'Extra info displayed as a tooltip on hover', 'All elements'],
                                    ['target', isHindi ? 'लिंक कहाँ खुलेगा (_blank नई टैब में खोलता है)' : 'Where to open link (_blank = new browser tab)', '<a>'],
                                    ['type', isHindi ? 'इनपुट फील्ड का प्रकार (text, password, submit आदि)' : 'Type of input element (text, email, password, etc.)', '<input>, <button>'],
                                    ['placeholder', isHindi ? 'इनपुट फील्ड के अंदर संकेत टेक्स्ट' : 'Hint text shown inside empty input fields', '<input>, <textarea>'],
                                    ['required', isHindi ? 'फॉर्म सबमिट करने से पहले भरना अनिवार्य' : 'Specifies that field must be filled before submitting', '<input>, <select>'],
                                ].map(([attr, desc, used], i) => (
                                    <tr key={i} className={`${i % 2 ? 'bg-gray-50/50' : 'bg-white'} hover:bg-orange-50/30 transition-colors`}>
                                        <td className="py-2 px-3 border-b border-gray-100 font-mono">
                                            <code className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-100">{attr}</code>
                                        </td>
                                        <td className="py-2 px-3 border-b border-gray-100 text-gray-700">{desc}</td>
                                        <td className="py-2 px-3 border-b border-gray-100 text-gray-500 font-mono text-[11px]">{used}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Section>

                {/* Section 7: Common Tags */}
                <Section title="Common HTML Tags Quick Reference" hindiTitle="7. सामान्य HTML टैग्स (Common Tags Quick Reference)" isHindi={isHindi}>
                    <p>
                        {isHindi
                            ? 'वेब विकास में सबसे अधिक उपयोग किए जाने वाले बुनियादी टैग्स का संक्षिप्त संदर्भ:'
                            : 'A quick reference of the most frequently used basic HTML tags:'}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 my-3">
                        {[
                            ['<h1> - <h6>', isHindi ? 'शीर्षक टैग (h1 सबसे बड़ा, h6 सबसे छोटा)' : 'Headings (h1 = largest, h6 = smallest)'],
                            ['<p>', isHindi ? 'पैराग्राफ टेक्स्ट' : 'Paragraph text block'],
                            ['<a>', isHindi ? 'हाइपरलिंक (लिंक जोड़ने के लिए)' : 'Hyperlink to another page or section'],
                            ['<img>', isHindi ? 'चित्र (Image) प्रदर्शित करने के लिए' : 'Embeds an image'],
                            ['<br>', isHindi ? 'लाइन ब्रेक (नई पंक्ति पर जाने के लिए)' : 'Line break (single space line)'],
                            ['<hr>', isHindi ? 'क्षैतिज रेखा (विभाजन के लिए)' : 'Horizontal divider line'],
                            ['<b> / <strong>', isHindi ? 'मोटा (Bold) या महत्वपूर्ण टेक्स्ट' : 'Bold text / Important emphasis'],
                            ['<i> / <em>', isHindi ? 'तिरछा (Italic) टेक्स्ट' : 'Italic text / Emphasized text'],
                            ['<u>', isHindi ? 'रेखांकित (Underline) टेक्स्ट' : 'Underlined text'],
                            ['<ul> / <ol>', isHindi ? 'अक्रमित और क्रमित सूचियां' : 'Unordered (bullet) and Ordered (numbered) lists'],
                            ['<li>', isHindi ? 'सूची का आइटम' : 'List item within ul or ol'],
                            ['<div>', isHindi ? 'ब्लॉक-लेवल कंटेनर बॉक्स' : 'Block-level container element'],
                            ['<span>', isHindi ? 'इनलाइन कंटेनर' : 'Inline container element'],
                            ['<table>', isHindi ? 'डेटा टेबल' : 'Tabular data grid'],
                            ['<form>', isHindi ? 'यूजर इनपुट फॉर्म' : 'User input submission form'],
                            ['<input>', isHindi ? 'इनपुट फील्ड (टेक्स्ट, चेकबॉक्स आदि)' : 'Interactive input control'],
                            ['<button>', isHindi ? 'क्लिक करने योग्य बटन' : 'Clickable action button'],
                            ['<textarea>', isHindi ? 'बहु-पंक्ति टेक्स्ट इनपुट बॉक्स' : 'Multi-line text input field'],
                        ].map(([tag, desc], i) => (
                            <div key={i} className="bg-gray-50 hover:bg-orange-50/50 border border-gray-100 hover:border-orange-200 rounded-xl p-3 transition-colors group">
                                <code className="text-[11px] font-semibold text-orange-700 font-mono">{tag}</code>
                                <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 group-hover:text-gray-700 leading-snug">{desc}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Section 8: Comments */}
                <Section title="HTML Comments" hindiTitle="8. HTML टिप्पणियाँ (Comments)" isHindi={isHindi}>
                    <p>
                        {isHindi
                            ? 'HTML टिप्पणियाँ (Comments) कोड में नोट्स या विवरण जोड़ने के लिए उपयोग की जाती हैं। ब्राउज़र टिप्पणियों को स्क्रीन पर प्रदर्शित नहीं करता है।'
                            : 'Comments in HTML are used to insert notes in your code that are NOT displayed in the browser. They help developers understand and document the code.'}
                    </p>
                    <CodeBlock code={`<!-- यह एक सिंगल-लाइन टिप्पणी है -->
<p>यह पैराग्राफ ब्राउज़र पर दिखाई देगा।</p>

<!--
    यह एक बहु-पंक्ति टिप्पणी है।
    यह कई लाइनों तक फैल सकती है।
-->

<!-- <p>यह पैराग्राफ छुपा हुआ है (commented out)।</p> -->`} />
                    <InfoBox type="tip">
                        {isHindi
                            ? 'टिप्पणियों का उपयोग डिबगिंग के दौरान कोड को अस्थायी रूप से छिपाने के लिए किया जाता है ताकि बिना कोड डिलीट किए समस्या का पता लगाया जा सके।'
                            : 'Comments are handy for debugging. You can "comment out" lines of code to test alternatives without permanently deleting your work.'}
                    </InfoBox>
                </Section>

                {/* Section 9: First Web Page */}
                <Section title="Creating Your First Web Page" hindiTitle="9. अपना पहला वेब पेज कैसे बनाएं (Creating Your First Page)" isHindi={isHindi}>
                    <p>
                        {isHindi
                            ? 'अपने कंप्यूटर पर पहला वेब पेज बनाने और देखने के लिए इन 4 आसान चरणों का पालन करें:'
                            : 'Follow these 4 simple steps to create and run your very first HTML page locally:'}
                    </p>
                    <InfoCard title={isHindi ? 'कदम-दर-कदम गाइड (Step-by-Step Guide)' : 'Step-by-Step Guide'} color="green">
                        <div className="space-y-4">
                            <Step
                                num={1}
                                title={isHindi ? 'टेक्स्ट एडिटर खोलें (Open Text Editor)' : 'Open a Text Editor'}
                                desc={isHindi ? 'अपने कंप्यूटर पर Notepad (Windows) या VS Code खोलें।' : 'Open Notepad on Windows, TextEdit on Mac, or install VS Code.'}
                            />
                            <Step
                                num={2}
                                title={isHindi ? 'HTML कोड लिखें (Write HTML Code)' : 'Write HTML Code'}
                                desc={isHindi ? 'नीचे दिया गया कोड कॉपी करके अपने एडिटर में पेस्ट करें।' : 'Type or paste the complete HTML document skeleton into your editor.'}
                            />
                            <Step
                                num={3}
                                title={isHindi ? 'फाइल सेव करें (Save the File)' : 'Save with .html Extension'}
                                desc={isHindi ? 'फाइल को "index.html" नाम से सेव करें। Save As Type में "All Files" चुनें।' : 'Save as index.html. Ensure "Save as type" is set to "All Files (*.*)".'}
                            />
                            <Step
                                num={4}
                                title={isHindi ? 'ब्राउज़र में खोलें (Open in Browser)' : 'Double Click to Open in Browser'}
                                desc={isHindi ? 'सेव की गई फाइल पर डबल क्लिक करें — यह Chrome या Edge ब्राउज़र में खुल जाएगी!' : 'Double-click the saved file to open it in Chrome, Edge, Firefox, or Safari!'}
                            />
                        </div>
                    </InfoCard>

                    <CodeBlock code={`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My First Website</title>
</head>
<body>
    <h1>Welcome to My First Web Page!</h1>
    <p>I am learning HTML on Knobly Web Platform.</p>
    <hr>
    <h2>About Me</h2>
    <p>I am a web development student preparing for O-Level M2-R5 exam.</p>
    <h2>My Hobbies</h2>
    <ul>
        <li>Coding</li>
        <li>Learning Web Design</li>
        <li>Reading</li>
    </ul>
    <p><a href="https://knobly.com" target="_blank">Visit Knobly</a></p>
</body>
</html>`} />
                </Section>

                {/* Section 10: HTML5 Features */}
                <Section title="HTML5 New Features" hindiTitle="10. HTML5 की नई विशेषताएं (HTML5 Features)" isHindi={isHindi}>
                    <p>
                        {isHindi
                            ? 'HTML5 आधुनिक वेब का मानक है। इसने वेब विकास को अधिक सरल, शक्तिशाली और सुलभ बनाने के लिए कई नई सुविधाएं पेश कीं:'
                            : 'HTML5 is the modern web standard. It introduced new semantic elements, native multimedia tags, and advanced form inputs:'}
                    </p>
                    <InfoCard title={isHindi ? 'नए सेमेंटिक तत्व (Semantic Elements)' : 'New Semantic Elements'} color="blue">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {[
                                ['<header>', isHindi ? 'पेज या सेक्शन का शीर्ष भाग (Header)' : 'Top header of page or section'],
                                ['<nav>', isHindi ? 'नेविगेशन लिंक्स का समूह' : 'Navigation link container'],
                                ['<main>', isHindi ? 'पेज की मुख्य सामग्री क्षेत्र' : 'Primary content area of document'],
                                ['<section>', isHindi ? 'थीमेटिक विषयगत अनुभाग' : 'Thematic section of content'],
                                ['<article>', isHindi ? 'स्वतंत्र पोस्ट या लेख' : 'Self-contained article or blog post'],
                                ['<aside>', isHindi ? 'साइडबार या संबंधित सामग्री' : 'Sidebar or tangential content'],
                                ['<footer>', isHindi ? 'पेज का निचला भाग (कॉपीराइट आदि)' : 'Footer with copyright and links'],
                                ['<figure>', isHindi ? 'चित्र और उसका कैप्शन' : 'Illustrated figure with caption'],
                            ].map(([tag, desc], i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <code className="text-orange-700 text-[11px] font-semibold font-mono">{tag}</code>
                                    <span className="text-gray-600">— {desc}</span>
                                </div>
                            ))}
                        </div>
                    </InfoCard>

                    <InfoCard title={isHindi ? 'नेटिव मल्टीमीडिया तत्व (Native Multimedia)' : 'Native Multimedia Elements'} color="purple">
                        <div className="space-y-1.5 text-xs">
                            <div><code className="text-orange-700 font-mono font-semibold">&lt;audio&gt;</code> <span className="text-gray-600">— {isHindi ? 'बिना किसी प्लगइन के ऑडियो फाइल प्ले करने के लिए' : 'Play audio directly in the browser'}</span></div>
                            <div><code className="text-orange-700 font-mono font-semibold">&lt;video&gt;</code> <span className="text-gray-600">— {isHindi ? 'सीधे वीडियो फाइल चलाने के लिए' : 'Play video files natively without third-party plugins'}</span></div>
                            <div><code className="text-orange-700 font-mono font-semibold">&lt;canvas&gt;</code> <span className="text-gray-600">— {isHindi ? 'JavaScript द्वारा 2D/3D ग्राफिक्स और गेम्स बनाने के लिए' : 'Draw dynamic 2D/3D graphics with JavaScript'}</span></div>
                            <div><code className="text-orange-700 font-mono font-semibold">&lt;svg&gt;</code> <span className="text-gray-600">— {isHindi ? 'स्केलेबल वेक्टर ग्राफिक्स प्रदर्शित करने के लिए' : 'Render crisp scalable vector graphics at any screen size'}</span></div>
                        </div>
                    </InfoCard>

                    <InfoCard title={isHindi ? 'नए फॉर्म इनपुट प्रकार (New Form Input Types)' : 'New Form Input Types'} color="green">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            {[
                                ['type="email"', isHindi ? 'ईमेल सत्यापन' : 'Email validation'],
                                ['type="url"', isHindi ? 'वेबसाइट URL' : 'URL validation'],
                                ['type="number"', isHindi ? 'संख्या इनपुट' : 'Numeric counter'],
                                ['type="date"', isHindi ? 'कैलेंडर पिकर' : 'Date picker'],
                                ['type="time"', isHindi ? 'समय पिकर' : 'Time picker'],
                                ['type="color"', isHindi ? 'कलर पिकर' : 'Color picker'],
                                ['type="range"', isHindi ? 'स्लाइडर' : 'Slider control'],
                                ['type="search"', isHindi ? 'सर्च बॉक्स' : 'Search input'],
                            ].map(([t, desc], i) => (
                                <div key={i} className="bg-white p-2 rounded-lg border border-gray-100">
                                    <code className="text-[10px] font-semibold text-gray-800 font-mono block">{t}</code>
                                    <span className="text-[10px] text-gray-500">{desc}</span>
                                </div>
                            ))}
                        </div>
                    </InfoCard>
                </Section>

                {/* Section 11: HTML vs CSS vs JS */}
                <Section title="HTML vs CSS vs JavaScript" hindiTitle="11. HTML vs CSS vs JavaScript" isHindi={isHindi}>
                    <p>
                        {isHindi
                            ? 'वेब पेज तीन मुख्य तकनीकों से मिलकर बने होते हैं जो एक साथ काम करती हैं:'
                            : 'Modern web pages are built using three foundational technologies that work together harmoniously:'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                        {[
                            {
                                emoji: '🏗️',
                                name: 'HTML',
                                sub: isHindi ? 'संरचना और सामग्री' : 'Structure & Content',
                                desc: isHindi ? 'पेज पर क्या होगा (हेडिंग, पैराग्राफ, इमेज, लिंक, टेबल)' : 'Defines what appears on the page — headings, paragraphs, images, links, forms',
                                color: 'bg-orange-50 border-orange-200',
                                titleColor: 'text-orange-700',
                            },
                            {
                                emoji: '🎨',
                                name: 'CSS',
                                sub: isHindi ? 'स्टाइल और लेआउट' : 'Styling & Design',
                                desc: isHindi ? 'पेज कैसा दिखेगा (रंग, फॉन्ट, स्पेसिंग, एनिमेशन, रिस्पॉन्सिव)' : 'Defines how things look — colors, typography, layout, animations, responsive grid',
                                color: 'bg-blue-50 border-blue-200',
                                titleColor: 'text-blue-600',
                            },
                            {
                                emoji: '⚡',
                                name: 'JavaScript',
                                sub: isHindi ? 'व्यवहार और अन्तरक्रियाशीलता' : 'Behavior & Logic',
                                desc: isHindi ? 'पेज पर क्या होगा (क्लिक इवेंट्स, फॉर्म वैलिडेशन, डायनामिक कंटेंट)' : 'Defines what happens — click events, validation, animations, API requests',
                                color: 'bg-amber-50 border-amber-200',
                                titleColor: 'text-amber-700',
                            },
                        ].map((tech) => (
                            <div key={tech.name} className={`rounded-2xl border p-5 text-center ${tech.color} hover:shadow-md transition-shadow`}>
                                <div className="text-3xl mb-2">{tech.emoji}</div>
                                <h4 className={`text-sm font-extrabold ${tech.titleColor} mb-0.5`}>{tech.name}</h4>
                                <p className="text-[11px] text-gray-600 font-medium">{tech.sub}</p>
                                <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">{tech.desc}</p>
                            </div>
                        ))}
                    </div>
                    <InfoBox type="note">
                        {isHindi ? (
                            <span>
                                इसे एक घर की तरह समझें: <strong>HTML</strong> घर की ईंटें और दीवारें हैं, <strong>CSS</strong> घर का पेंट, डिज़ाइन और सजावट है, और <strong>JavaScript</strong> घर की बिजली, पंखे और पानी की व्यवस्था है जो इसे काम करने लायक बनाती है।
                            </span>
                        ) : (
                            <span>
                                Think of it like a building: <strong>HTML</strong> is the concrete structure and bricks, <strong>CSS</strong> is the paint, styling and interior decoration, and <strong>JavaScript</strong> is the electricity and plumbing that makes everything function interactively.
                            </span>
                        )}
                    </InfoBox>
                </Section>

                {/* Next Steps: Link to Elements Page */}
                <Link
                    href="/html/elements"
                    className="group flex items-center justify-between bg-gradient-to-r from-orange-700 via-red-700 to-pink-700 rounded-2xl p-5 sm:p-6 shadow-lg shadow-orange-500/20 hover:from-orange-800 hover:via-red-800 hover:to-pink-800 hover:shadow-xl hover:scale-[1.01] transition-all mb-4 text-white"
                >
                    <div>
                        <span className="text-[10px] font-bold text-orange-200 uppercase tracking-wider">
                            {isHindi ? 'अगला मॉड्यूल' : 'Next Module'}
                        </span>
                        <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                            {isHindi ? 'एलिमेंट्स और टैग्स (Element and Tag)' : 'Element and Tag Reference'} →
                        </h3>
                        <p className="text-orange-100 text-xs mt-1">
                            {isHindi
                                ? 'सभी HTML टैग्स की संपूर्ण लाइब्रेरी, उदाहरण और लाइव कंपाइलर के साथ'
                                : 'Complete reference covering all HTML tags with examples and practice'}
                        </p>
                    </div>
                    <ChevronRight size={24} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
            </main>
        </div>
    );
}
