'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Menu, X, ChevronRight, Hash, Sparkles, Users, MessageCircle, Award, Clock, Brain, Target, TrendingUp, Zap, CheckCircle2, Heart, Shield, Star, BookOpen, Lightbulb, Handshake, ThumbsUp, Code, Briefcase, GraduationCap, Home, Globe, UserCheck, Compass, Smile, Gem, TreePine, Puzzle, Eye, Volume2 } from 'lucide-react';

function Sec({ id, title, icon, children }: { id: string; title: string; icon: ReactNode; children: ReactNode }) {
    return (
        <section id={id} className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 transition-all duration-300 hover:shadow-lg bg-white" style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>{icon}<h2 className="text-base md:text-lg font-extrabold text-gray-800">{title}</h2></div>
            <div className="text-sm leading-relaxed space-y-3 text-gray-600">{children}</div>
        </section>
    );
}

function Def({ children }: { children: ReactNode }) {
    return <div className="rounded-xl p-4 my-3 text-sm font-medium" style={{ background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)', border: '1px solid #f9a8d4', color: '#831843' }}>{children}</div>;
}

function IB({ type = 'tip', children }: { type?: 'tip' | 'note' | 'warning'; children: ReactNode }) {
    const s: Record<string, { bg: string; bc: string; tc: string; emoji: string }> = { tip: { bg: '#fdf2f8', bc: '#f9a8d4', tc: '#831843', emoji: '💡' }, note: { bg: '#eff6ff', bc: '#93c5fd', tc: '#1e40af', emoji: '📝' }, warning: { bg: '#fefce8', bc: '#fde047', tc: '#854d0e', emoji: '⚠️' } };
    const st = s[type];
    return <div className="rounded-xl p-3.5 text-xs font-medium my-3" style={{ background: st.bg, border: `1px solid ${st.bc}`, color: st.tc }}>{st.emoji} {children}</div>;
}

const tocItems = [
    { icon: <Heart size={13} />, label: 'Soft Skills क्या हैं?', id: 'soft-skills-intro', color: '#ec4899' },
    { icon: <Star size={13} />, label: 'Importance', id: 'importance', color: '#f59e0b' },
    { icon: <ThumbsUp size={13} />, label: 'Benefits', id: 'benefits', color: '#10b981' },
    { icon: <Puzzle size={13} />, label: 'Hard vs Soft Skills', id: 'hard-vs-soft', color: '#3b82f6' },
    { icon: <Code size={13} />, label: 'Hard Skills', id: 'hard-skills', color: '#0891b2' },
    { icon: <MessageCircle size={13} />, label: 'Soft Skills Examples', id: 'soft-skills-examples', color: '#8b5cf6' },
    { icon: <Briefcase size={13} />, label: 'Difference Table', id: 'difference-table', color: '#ef4444' },
    { icon: <UserCheck size={13} />, label: 'Personality Dev', id: 'personality-dev', color: '#7c3aed' },
    { icon: <Target size={13} />, label: 'Objectives', id: 'pd-objectives', color: '#059669' },
    { icon: <TrendingUp size={13} />, label: 'PD Importance', id: 'pd-importance', color: '#d97706' },
    { icon: <Smile size={13} />, label: 'What is Personality?', id: 'what-is-personality', color: '#ec4899' },
    { icon: <Gem size={13} />, label: 'Good Personality', id: 'good-personality', color: '#6366f1' },
    { icon: <Compass size={13} />, label: 'Determinants', id: 'determinants', color: '#0284c7' },
    { icon: <Eye size={13} />, label: 'Self-Awareness', id: 'self-awareness', color: '#0d9488' },
    { icon: <Zap size={13} />, label: 'Motivation', id: 'motivation', color: '#ea580c' },
    { icon: <TrendingUp size={13} />, label: 'Self-Motivation', id: 'self-motivation', color: '#059669' },
    { icon: <Clock size={13} />, label: 'Self-Discipline', id: 'self-discipline', color: '#dc2626' },
    { icon: <Shield size={13} />, label: 'Self-Esteem', id: 'self-esteem', color: '#7c3aed' },
    { icon: <Gem size={13} />, label: 'Positive Personality', id: 'positive-personality', color: '#2563eb' },
    { icon: <Smile size={13} />, label: 'Positive Thinking', id: 'positive-thinking', color: '#d97706' },
    { icon: <Clock size={13} />, label: 'Time Management', id: 'time-management', color: '#ea580c' },
    { icon: <Heart size={13} />, label: 'Stress Management', id: 'stress-management', color: '#0d9488' },
    { icon: <Target size={13} />, label: 'Goal Setting', id: 'goal-setting', color: '#9333ea' },
    { icon: <Brain size={13} />, label: 'Decision Making', id: 'decision-making', color: '#2563eb' },
    { icon: <Award size={13} />, label: 'Leadership', id: 'leadership', color: '#dc2626' },
    { icon: <Users size={13} />, label: 'Teamwork', id: 'teamwork', color: '#059669' },
];

export default function SoftSkillsPage() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('soft-skills-intro');

    return (
        <div className="min-h-screen bg-white text-slate-800 relative">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-white to-fuchsia-50/30" />
            </div>

            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/iot" className="flex items-center justify-center w-9 h-9 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}><ArrowLeft size={16} /></Link>
                        <div>
                            <h1 className="text-sm font-extrabold text-gray-800">Soft Skills & Personality Development</h1>
                            <div className="flex items-center gap-1.5"><Sparkles size={8} className="text-pink-500" /><span className="text-[9px] uppercase tracking-[0.18em] font-bold text-pink-500">Chapter 6</span></div>
                        </div>
                    </div>
                    <button onClick={() => setTocOpen(!tocOpen)} className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 border border-gray-200">
                        {tocOpen ? <X size={18} className="text-pink-500" /> : <Menu size={18} className="text-pink-500" />}
                    </button>
                </div>
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #ec4899, #f9a8d4, #db2777, #ec4899)' }} />
            </header>

            <div className="max-w-7xl mx-auto flex relative">
                <aside className={`${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[52px] left-0 z-40 lg:z-10 w-64 lg:w-56 xl:w-64 h-[calc(100vh-52px)] overflow-y-auto transition-transform duration-300 lg:flex-shrink-0 bg-white/95 backdrop-blur-xl`} style={{ borderRight: '1px solid #e2e8f0' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}><Hash size={12} className="text-white" /></div>
                            <span className="text-xs font-extrabold uppercase tracking-wider text-gray-800">Contents</span>
                        </div>
                        <nav className="space-y-0.5">
                            {tocItems.map(item => (
                                <a key={item.id} href={`#${item.id}`} onClick={() => { setActiveSection(item.id); setTocOpen(false); }}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                                    style={{ background: activeSection === item.id ? `${item.color}15` : 'transparent', border: activeSection === item.id ? `1px solid ${item.color}30` : '1px solid transparent', color: activeSection === item.id ? item.color : '#64748b' }}>
                                    <span style={{ color: item.color }}>{item.icon}</span>{item.label}
                                    {activeSection === item.id && <ChevronRight size={10} className="ml-auto" />}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>
                {tocOpen && <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setTocOpen(false)} />}

                <main className="flex-1 min-w-0 px-4 py-6 lg:pl-6">
                    {/* Hero */}
                    <section className="relative rounded-3xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #831843 0%, #db2777 30%, #ec4899 60%, #f9a8d4 100%)', boxShadow: '0 8px 32px rgba(236,72,153,0.25)' }}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)' }} />
                            <svg className="absolute right-4 bottom-4 w-32 h-32 opacity-10" viewBox="0 0 100 100">
                                <circle cx="50" cy="35" r="18" fill="white" stroke="white" strokeWidth="1.5">
                                    <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
                                </circle>
                                <path d="M20 95 Q50 60 80 95" fill="white" stroke="white" strokeWidth="1.5">
                                    <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
                                </path>
                            </svg>
                        </div>
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#500724' }}>
                                <Sparkles size={10} /> Chapter 6 — O-Level M4-R5
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black mb-3 text-white" style={{ lineHeight: '1.2' }}>Soft Skills & Personality Development</h2>
                            <p className="text-sm md:text-base max-w-2xl mb-5 text-white/90 font-medium">Soft Skills ki Definition, Importance, Benefits, Hard Skills vs Soft Skills ka antar, Personality Development, Personality ke Determinants aur achhe Personality ke gunn ke baare mein seekhiye।</p>
                        </div>
                    </section>

                    {/* ═══ SECTION: Soft Skills Introduction ═══ */}
                    <Sec id="soft-skills-intro" title="💗 Soft Skills क्या हैं? — Definition" icon={<Heart size={16} className="text-pink-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>🌟 <strong>Soft Skills</strong> वे व्यक्तिगत (Personal), सामाजिक (Social) और व्यवहारिक (Behavioral) कौशल हैं जो किसी व्यक्ति को दूसरों के साथ प्रभावी ढंग से संवाद (Communication), सहयोग (Collaboration), नेतृत्व (Leadership), समस्या समाधान (Problem Solving) तथा कार्यस्थल पर बेहतर प्रदर्शन करने में सहायता करते हैं।</Def>
                                <p>Soft Skills का संबंध केवल ज्ञान (Knowledge) से नहीं बल्कि व्यक्ति के <strong>व्यवहार, सोचने के तरीके, बोलने की शैली, आत्मविश्वास, निर्णय लेने की क्षमता, समय प्रबंधन</strong> तथा दूसरों के साथ अच्छे संबंध बनाने की योग्यता से होता है।</p>
                                <p>आज के समय में केवल तकनीकी ज्ञान (Technical Knowledge) होना पर्याप्त नहीं है। यदि किसी व्यक्ति के पास अच्छी Soft Skills भी हों, तो वह किसी भी संस्था, कंपनी या संगठन में <strong>अधिक सफल</strong> हो सकता है।</p>
                            </div>
                            <div className="w-full md:w-72 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Soft Skills Overview" className="w-full h-auto rounded-2xl shadow-md border border-pink-100" />
                            </div>
                        </div>

                        {/* Quote Box */}
                        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-fuchsia-50 border-2 border-pink-200 text-center">
                            <div className="text-3xl mb-2">💬</div>
                            <p className="text-sm font-bold text-pink-800 italic leading-relaxed">
                                &quot;Soft Skills वे गुण हैं जो किसी व्यक्ति के व्यवहार और व्यक्तित्व को प्रभावशाली बनाते हैं तथा उसे Professional और Personal Life में सफलता प्राप्त करने में सहायता करते हैं।&quot;
                            </p>
                        </div>

                        <IB type="tip">Soft Skills ko <strong>People Skills</strong> ya <strong>Interpersonal Skills</strong> bhi kaha jaata hai। Yeh kisi bhi job interview mein sabse pehle dekhi jaati hain!</IB>
                    </Sec>

                    {/* ═══ SECTION: Importance ═══ */}
                    <Sec id="importance" title="💗 Importance of Soft Skills" icon={<Star size={16} className="text-amber-500" />}>
                        <p className="mb-4">आज के आधुनिक समय में प्रत्येक क्षेत्र में Soft Skills का महत्व लगातार बढ़ता जा रहा है।</p>

                        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 mb-4">
                            <p className="text-sm text-amber-900 font-semibold leading-relaxed">
                                एक योग्य कर्मचारी वही माना जाता है जिसके पास <strong>Technical Knowledge</strong> के साथ-साथ अच्छी <strong>Communication Skill, Team Work</strong> तथा <strong>Positive Attitude</strong> भी हो।
                            </p>
                        </div>

                        <p>Soft Skills व्यक्ति के सम्पूर्ण व्यक्तित्व (Overall Personality) का विकास करती हैं और उसे जीवन की विभिन्न परिस्थितियों में <strong>सही निर्णय लेने योग्य</strong> बनाती हैं।</p>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { icon: <Briefcase size={24} />, title: 'Career Growth', desc: 'Job aur Promotion mein madad karti hain', color: '#f59e0b', bg: '#fffbeb' },
                                { icon: <Users size={24} />, title: 'Better Relationships', desc: 'Logo ke saath achhe sambandh bante hain', color: '#ec4899', bg: '#fdf2f8' },
                                { icon: <Brain size={24} />, title: 'Overall Development', desc: 'Sampurn vyaktitva ka vikas hota hai', color: '#8b5cf6', bg: '#f5f3ff' },
                            ].map((item, i) => (
                                <div key={i} className="p-4 rounded-xl border text-center hover:shadow-lg transition-all hover:-translate-y-1" style={{ background: item.bg, borderColor: `${item.color}30` }}>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm" style={{ background: `${item.color}15`, color: item.color }}>{item.icon}</div>
                                    <p className="text-sm font-extrabold" style={{ color: item.color }}>{item.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <IB type="note">Aaj ke competitive world mein sirf <strong>degree</strong> se kaam nahi chalta — <strong>Soft Skills</strong> hi aapko bheed mein alag banati hain!</IB>
                    </Sec>

                    {/* ═══ SECTION: Benefits ═══ */}
                    <Sec id="benefits" title="💗 Benefits of Soft Skills" icon={<ThumbsUp size={16} className="text-emerald-500" />}>
                        <p className="mb-4">Soft Skills के प्रमुख लाभ निम्नलिखित हैं—</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { text: 'दूसरों के साथ प्रभावी Communication करने में सहायता मिलती है।', icon: <MessageCircle size={18} />, color: '#3b82f6', bg: '#eff6ff' },
                                { text: 'आत्मविश्वास (Self Confidence) बढ़ता है।', icon: <Shield size={18} />, color: '#ec4899', bg: '#fdf2f8' },
                                { text: 'Leadership Quality का विकास होता है।', icon: <Award size={18} />, color: '#f59e0b', bg: '#fffbeb' },
                                { text: 'Team में बेहतर कार्य करने की क्षमता विकसित होती है।', icon: <Users size={18} />, color: '#10b981', bg: '#ecfdf5' },
                                { text: 'Problem Solving Skill मजबूत होती है।', icon: <Puzzle size={18} />, color: '#8b5cf6', bg: '#f5f3ff' },
                                { text: 'Career Growth के अवसर बढ़ जाते हैं।', icon: <TrendingUp size={18} />, color: '#0891b2', bg: '#ecfeff' },
                                { text: 'Interview में अच्छा प्रदर्शन करने में सहायता मिलती है।', icon: <Briefcase size={18} />, color: '#7c3aed', bg: '#f5f3ff' },
                                { text: 'कार्यस्थल पर अच्छे Professional Relationship बनते हैं।', icon: <Handshake size={18} />, color: '#059669', bg: '#ecfdf5' },
                                { text: 'निर्णय लेने की क्षमता बेहतर होती है।', icon: <Target size={18} />, color: '#ef4444', bg: '#fef2f2' },
                                { text: 'व्यक्ति का सम्पूर्ण व्यक्तित्व विकसित होता है।', icon: <Gem size={18} />, color: '#6366f1', bg: '#eef2ff' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border hover:shadow-md transition-shadow" style={{ background: item.bg, borderColor: `${item.color}30` }}>
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}20`, color: item.color }}>
                                        {item.icon}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-700">{item.text}</p>
                                </div>
                            ))}
                        </div>
                        <IB type="tip">Jo log achhi Soft Skills rakhte hain, unhe <strong>Interview, Team Work aur Leadership</strong> mein hamesha advantage milta hai!</IB>
                    </Sec>

                    {/* ═══ SECTION: Hard Skills vs Soft Skills ═══ */}
                    <Sec id="hard-vs-soft" title="💗 Hard Skills vs Soft Skills" icon={<Puzzle size={16} className="text-blue-500" />}>
                        <p className="mb-4">Hard Skills और Soft Skills दोनों किसी भी व्यक्ति के Career के लिए आवश्यक हैं।</p>
                        <p className="mb-4">Hard Skills किसी कार्य को करने की <strong>तकनीकी क्षमता (Technical Ability)</strong> को दर्शाती हैं, जबकि Soft Skills व्यक्ति के <strong>व्यवहार, व्यक्तित्व और Communication</strong> से संबंधित होती हैं।</p>

                        <div className="w-full mb-5">
                            <img src="/sample-assets/placeholder.svg" alt="Hard Skills vs Soft Skills" className="w-full h-auto rounded-2xl shadow-md border border-blue-100" />
                        </div>

                        {/* Visual Comparison */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 hover:shadow-lg transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #0891b2)' }}>
                                        <Code size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-extrabold text-blue-800">Hard Skills</h3>
                                        <p className="text-[10px] text-blue-500 font-bold uppercase">Technical & Measurable</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">Training, Education ya Practice se seekhi jaati hain। Aasaani se <strong>Measure aur Certify</strong> ki ja sakti hain।</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-fuchsia-50 border-2 border-pink-200 hover:shadow-lg transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                                        <Heart size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-extrabold text-pink-800">Soft Skills</h3>
                                        <p className="text-[10px] text-pink-500 font-bold uppercase">Behavioral & Personal</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">Vyavhaar aur anubhav se viksit hoti hain। Certificate se nahi balki <strong>karyashaili se dikhai</strong> deti hain।</p>
                            </div>
                        </div>

                        <IB type="note">Ek safal career ke liye <strong>dono</strong> — Hard Skills aur Soft Skills — zaroori hain। Sirf ek se kaam nahi chalega!</IB>
                    </Sec>

                    {/* ═══ SECTION: Hard Skills ═══ */}
                    <Sec id="hard-skills" title="💗 Hard Skills — Definition & Examples" icon={<Code size={16} className="text-cyan-600" />}>
                        <Def>🔧 <strong>Hard Skills</strong> वे तकनीकी (Technical) या व्यावसायिक (Professional) कौशल हैं जिन्हें सीखने के लिए विशेष प्रशिक्षण (Training), शिक्षा (Education) या अभ्यास (Practice) की आवश्यकता होती है। Hard Skills को आसानी से मापा (Measure) और प्रमाणित (Certified) किया जा सकता है।</Def>

                        <p className="text-xs font-bold text-cyan-800 mb-3 uppercase tracking-wide">🔧 Hard Skills के Examples:</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { title: 'Programming', icon: <Code size={20} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                                { title: 'Web Development', icon: <Globe size={20} />, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
                                { title: 'Data Entry', icon: <BookOpen size={20} />, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
                                { title: 'Networking', icon: <Users size={20} />, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                                { title: 'Graphic Design', icon: <Eye size={20} />, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
                                { title: 'Tally', icon: <Briefcase size={20} />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                                { title: 'MS Office', icon: <BookOpen size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                                { title: 'Arduino', icon: <Zap size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                                { title: 'Database Mgmt', icon: <Briefcase size={20} />, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
                                { title: 'AutoCAD', icon: <Compass size={20} />, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
                            ].map((f, i) => (
                                <div key={i} className={`p-3 rounded-xl ${f.bg} ${f.border} border text-center flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow`}>
                                    <div className={f.color}>{f.icon}</div>
                                    <span className="text-[11px] font-bold text-gray-800">{f.title}</span>
                                </div>
                            ))}
                        </div>

                        <IB type="tip">Hard Skills ko <strong>Certificate ya Degree</strong> se prove kiya ja sakta hai — jaise NIELIT O Level, BCA, B.Tech, etc.</IB>
                    </Sec>

                    {/* ═══ SECTION: Soft Skills Examples ═══ */}
                    <Sec id="soft-skills-examples" title="💗 Soft Skills — Definition & Examples" icon={<MessageCircle size={16} className="text-purple-600" />}>
                        <Def>🌸 <strong>Soft Skills</strong> वे व्यक्तिगत और सामाजिक कौशल हैं जो किसी व्यक्ति के व्यवहार, Communication, सोचने की क्षमता तथा दूसरों के साथ कार्य करने के तरीके को दर्शाते हैं। Soft Skills किसी Certificate से नहीं बल्कि व्यक्ति के <strong>व्यवहार और कार्यशैली</strong> से दिखाई देती हैं।</Def>

                        <p className="text-xs font-bold text-purple-800 mb-3 uppercase tracking-wide">🌸 Soft Skills के Examples:</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { title: 'Communication', icon: <MessageCircle size={20} />, color: '#3b82f6', bg: '#eff6ff' },
                                { title: 'Leadership', icon: <Award size={20} />, color: '#f59e0b', bg: '#fffbeb' },
                                { title: 'Team Work', icon: <Users size={20} />, color: '#10b981', bg: '#ecfdf5' },
                                { title: 'Time Mgmt', icon: <Clock size={20} />, color: '#ef4444', bg: '#fef2f2' },
                                { title: 'Positive Thinking', icon: <Smile size={20} />, color: '#ec4899', bg: '#fdf2f8' },
                                { title: 'Self Confidence', icon: <Shield size={20} />, color: '#8b5cf6', bg: '#f5f3ff' },
                                { title: 'Decision Making', icon: <Target size={20} />, color: '#0891b2', bg: '#ecfeff' },
                                { title: 'Problem Solving', icon: <Puzzle size={20} />, color: '#7c3aed', bg: '#f5f3ff' },
                                { title: 'Creativity', icon: <Lightbulb size={20} />, color: '#d97706', bg: '#fffbeb' },
                                { title: 'Emotional Intelligence', icon: <Heart size={20} />, color: '#dc2626', bg: '#fef2f2' },
                            ].map((f, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:shadow-lg transition-all hover:-translate-y-1" style={{ background: f.bg, borderColor: `${f.color}30` }}>
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: `${f.color}15`, color: f.color }}>{f.icon}</div>
                                    <span className="text-[11px] font-bold text-gray-700 text-center">{f.title}</span>
                                </div>
                            ))}
                        </div>

                        <IB type="note">Soft Skills kisi <strong>Certificate se prove nahi</strong> hoti — yeh aapke <strong>daily behaviour aur karyashaili</strong> se dikhti hain!</IB>
                    </Sec>

                    {/* ═══ SECTION: Difference Table ═══ */}
                    <Sec id="difference-table" title="💗 Hard Skills vs Soft Skills — Difference" icon={<Briefcase size={16} className="text-red-500" />}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs border-collapse rounded-xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr style={{ background: 'linear-gradient(135deg, #831843, #be185d)' }}>
                                        <th className="p-3 text-left text-white font-bold">आधार (Basis)</th>
                                        <th className="p-3 text-center text-blue-200 font-bold">🔧 Hard Skills</th>
                                        <th className="p-3 text-center text-pink-200 font-bold">🌸 Soft Skills</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { basis: 'प्रकार', hard: 'Technical Skills होती हैं।', soft: 'Behavioral Skills होती हैं।' },
                                        { basis: 'कैसे सीखते हैं', hard: 'Training द्वारा सीखी जाती हैं।', soft: 'अनुभव एवं व्यवहार से विकसित होती हैं।' },
                                        { basis: 'Measurement', hard: 'आसानी से Measure किया जा सकता है।', soft: 'सीधे Measure करना कठिन होता है।' },
                                        { basis: 'क्या बताती हैं', hard: 'Job करने की Technical Ability बताती हैं।', soft: 'Job को प्रभावी ढंग से करने की क्षमता बताती हैं।' },
                                        { basis: 'प्रमाणन', hard: 'Certificate प्राप्त किया जा सकता है।', soft: 'व्यवहार से पहचानी जाती हैं।' },
                                        { basis: 'उदाहरण', hard: 'Programming, Networking', soft: 'Communication, Leadership' },
                                    ].map((row, i) => (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="p-3 font-bold text-gray-800 border-b border-gray-100">{row.basis}</td>
                                            <td className="p-3 text-center text-blue-700 border-b border-gray-100">{row.hard}</td>
                                            <td className="p-3 text-center text-pink-700 border-b border-gray-100">{row.soft}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Easy Memory */}
                        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
                            <h4 className="text-xs font-bold text-indigo-800 mb-3 uppercase tracking-wide flex items-center gap-2"><Zap size={14} /> Aasaan tarike se yaad rakhein:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-4 rounded-xl bg-white border-2 border-blue-200 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                                    <div className="text-3xl mb-2">🔧</div>
                                    <p className="text-sm font-extrabold text-blue-700">Hard Skills</p>
                                    <p className="text-xs text-gray-600 mt-1 font-semibold">&quot;Kya karna aata hai&quot;</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white border-2 border-pink-200 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                                    <div className="text-3xl mb-2">🌸</div>
                                    <p className="text-sm font-extrabold text-pink-700">Soft Skills</p>
                                    <p className="text-xs text-gray-600 mt-1 font-semibold">&quot;Kaise karte hain&quot;</p>
                                </div>
                            </div>
                        </div>

                        <IB type="warning">O Level pariksha mein Hard Skills aur Soft Skills ki <strong>Definition, Differences aur Examples</strong> aksar puchhe jaate hain। Inhe achhe se yaad karein!</IB>
                    </Sec>

                    {/* ═══════════════════════════════════════════════════ */}
                    {/* ═══ PERSONALITY DEVELOPMENT SECTION ═══ */}
                    {/* ═══════════════════════════════════════════════════ */}

                    {/* Section Divider */}
                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-dashed border-purple-200" /></div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-6 py-2 rounded-full text-sm font-extrabold text-purple-700 border-2 border-purple-200 shadow-lg flex items-center gap-2">
                                <UserCheck size={18} /> Personality Development
                            </span>
                        </div>
                    </div>

                    {/* ═══ SECTION: Personality Development ═══ */}
                    <Sec id="personality-dev" title="💗 Personality Development — Definition" icon={<UserCheck size={16} className="text-purple-600" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>✨ <strong>Personality Development</strong> वह सतत (Continuous) प्रक्रिया है जिसके द्वारा व्यक्ति अपने व्यवहार, सोच, ज्ञान, Communication, आत्मविश्वास, नैतिक मूल्यों तथा कार्य करने की शैली में सकारात्मक सुधार करता है।</Def>
                                <p>Personality Development का उद्देश्य केवल बाहरी व्यक्तित्व (Outer Appearance) को बेहतर बनाना नहीं है, बल्कि व्यक्ति के <strong>आंतरिक गुणों (Inner Qualities)</strong> का भी विकास करना है।</p>
                                <p>एक अच्छा व्यक्तित्व व्यक्ति को समाज में <strong>सम्मान, आत्मविश्वास और सफलता</strong> दिलाने में महत्वपूर्ण भूमिका निभाता है।</p>
                            </div>
                            <div className="w-full md:w-72 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Personality Development" className="w-full h-auto rounded-2xl shadow-md border border-purple-100" />
                            </div>
                        </div>

                        {/* Inner vs Outer */}
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 text-center hover:shadow-lg transition-all">
                                <div className="text-3xl mb-2">🌟</div>
                                <p className="text-sm font-extrabold text-violet-700">Inner Personality</p>
                                <p className="text-xs text-gray-600 mt-1">Soch, values, confidence, character</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 text-center hover:shadow-lg transition-all">
                                <div className="text-3xl mb-2">👔</div>
                                <p className="text-sm font-extrabold text-pink-700">Outer Personality</p>
                                <p className="text-xs text-gray-600 mt-1">Body language, dress, communication</p>
                            </div>
                        </div>

                        <IB type="tip">Personality Development sirf <strong>bahari dikhawat</strong> nahi hai — yeh aapki <strong>soch, vyavhaar aur character</strong> ka sampurn vikas hai!</IB>
                    </Sec>

                    {/* ═══ SECTION: PD Objectives ═══ */}
                    <Sec id="pd-objectives" title="💗 Objectives of Personality Development" icon={<Target size={16} className="text-green-600" />}>
                        <p className="mb-4">Personality Development के मुख्य उद्देश्य—</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                                { text: 'आत्मविश्वास बढ़ाना।', icon: <Shield size={18} />, color: '#ec4899' },
                                { text: 'प्रभावशाली Communication विकसित करना।', icon: <MessageCircle size={18} />, color: '#3b82f6' },
                                { text: 'सकारात्मक सोच विकसित करना।', icon: <Smile size={18} />, color: '#10b981' },
                                { text: 'Leadership Skill बढ़ाना।', icon: <Award size={18} />, color: '#f59e0b' },
                                { text: 'Time Management सीखना।', icon: <Clock size={18} />, color: '#ef4444' },
                                { text: 'Decision Making में सुधार करना।', icon: <Target size={18} />, color: '#7c3aed' },
                                { text: 'Team Work की क्षमता विकसित करना।', icon: <Users size={18} />, color: '#0891b2' },
                                { text: 'Professional Behaviour विकसित करना।', icon: <Briefcase size={18} />, color: '#059669' },
                                { text: 'Career में सफलता प्राप्त करना।', icon: <TrendingUp size={18} />, color: '#6366f1' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border hover:shadow-md transition-shadow" style={{ borderColor: `${item.color}30` }}>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15`, color: item.color }}>{item.icon}</div>
                                    <p className="text-xs font-semibold text-gray-700">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </Sec>

                    {/* ═══ SECTION: PD Importance ═══ */}
                    <Sec id="pd-importance" title="💗 Importance of Personality Development" icon={<TrendingUp size={16} className="text-amber-600" />}>
                        <div className="space-y-3">
                            {[
                                { text: 'Interview में सफलता प्राप्त करने में सहायता करता है।', emoji: '🎯', color: '#ef4444', bg: 'from-red-50 to-rose-50', border: '#fca5a5' },
                                { text: 'Career Growth में महत्वपूर्ण भूमिका निभाता है।', emoji: '📈', color: '#10b981', bg: 'from-green-50 to-emerald-50', border: '#34d399' },
                                { text: 'दूसरों पर सकारात्मक प्रभाव डालता है।', emoji: '✨', color: '#8b5cf6', bg: 'from-purple-50 to-violet-50', border: '#a78bfa' },
                                { text: 'Leadership विकसित करता है।', emoji: '👑', color: '#f59e0b', bg: 'from-amber-50 to-yellow-50', border: '#fbbf24' },
                                { text: 'Communication बेहतर बनाता है।', emoji: '💬', color: '#3b82f6', bg: 'from-blue-50 to-sky-50', border: '#93c5fd' },
                                { text: 'आत्मविश्वास बढ़ाता है।', emoji: '💪', color: '#ec4899', bg: 'from-pink-50 to-fuchsia-50', border: '#f9a8d4' },
                                { text: 'Professional Life को सफल बनाता है।', emoji: '💼', color: '#0891b2', bg: 'from-cyan-50 to-teal-50', border: '#22d3ee' },
                                { text: 'तनाव (Stress) को नियंत्रित करने में सहायता करता है।', emoji: '🧘', color: '#059669', bg: 'from-emerald-50 to-green-50', border: '#34d399' },
                            ].map((item, i) => (
                                <div key={i} className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${item.bg} border hover:shadow-md transition-shadow`} style={{ borderColor: item.border }}>
                                    <div className="text-2xl flex-shrink-0">{item.emoji}</div>
                                    <p className="text-xs font-semibold text-gray-700">{item.text}</p>
                                </div>
                            ))}
                        </div>
                        <IB type="note">Personality Development ek <strong>lifelong process</strong> hai — yeh kabhi ruki nahi, hamesha badhti rehti hai!</IB>
                    </Sec>

                    {/* ═══════════════════════════════════════════════════ */}
                    {/* ═══ WHAT IS PERSONALITY SECTION ═══ */}
                    {/* ═══════════════════════════════════════════════════ */}

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-dashed border-pink-200" /></div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-6 py-2 rounded-full text-sm font-extrabold text-pink-700 border-2 border-pink-200 shadow-lg flex items-center gap-2">
                                <Smile size={18} /> What is Personality?
                            </span>
                        </div>
                    </div>

                    {/* ═══ SECTION: What is Personality? ═══ */}
                    <Sec id="what-is-personality" title="💗 What is Personality? — Definition" icon={<Smile size={16} className="text-pink-600" />}>
                        <Def>🌺 <strong>Personality</strong> किसी व्यक्ति के विचार (Thoughts), भावनाएँ (Feelings), व्यवहार (Behaviour), आदतें (Habits), बोलने का तरीका (Communication Style), आत्मविश्वास (Confidence), नैतिक मूल्य (Values) तथा दूसरों के साथ व्यवहार करने की शैली का समग्र (Overall) स्वरूप है।</Def>

                        {/* Quote */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 text-center mb-4">
                            <div className="text-3xl mb-2">💫</div>
                            <p className="text-sm font-bold text-pink-800 italic leading-relaxed">
                                &quot;किसी व्यक्ति का सम्पूर्ण व्यवहार और उसका दूसरों पर पड़ने वाला प्रभाव ही उसका Personality कहलाता है।&quot;
                            </p>
                        </div>

                        <p>व्यक्तित्व केवल व्यक्ति के कपड़ों या बाहरी रूप से नहीं बनता, बल्कि उसके <strong>ज्ञान, सोच, व्यवहार और चरित्र</strong> से भी बनता है।</p>

                        <IB type="tip">Yaad rakhein — <strong>Personality = Outer Look + Inner Qualities + Behaviour + Communication</strong>। Yeh sab milkar aapki personality banate hain!</IB>
                    </Sec>

                    {/* ═══ SECTION: Good Personality Characteristics ═══ */}
                    <Sec id="good-personality" title="💗 Characteristics of Good Personality" icon={<Gem size={16} className="text-indigo-600" />}>
                        <p className="mb-4">एक अच्छे व्यक्तित्व वाले व्यक्ति में सामान्यतः निम्न गुण पाए जाते हैं—</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { title: 'Positive Thinking', icon: <Smile size={22} />, color: '#ec4899', bg: '#fdf2f8' },
                                { title: 'Self Confidence', icon: <Shield size={22} />, color: '#8b5cf6', bg: '#f5f3ff' },
                                { title: 'Good Communication', icon: <MessageCircle size={22} />, color: '#3b82f6', bg: '#eff6ff' },
                                { title: 'Honesty', icon: <Heart size={22} />, color: '#ef4444', bg: '#fef2f2' },
                                { title: 'Discipline', icon: <Clock size={22} />, color: '#f59e0b', bg: '#fffbeb' },
                                { title: 'Leadership Quality', icon: <Award size={22} />, color: '#10b981', bg: '#ecfdf5' },
                                { title: 'Respect for Others', icon: <Handshake size={22} />, color: '#0891b2', bg: '#ecfeff' },
                                { title: 'Time Management', icon: <Clock size={22} />, color: '#7c3aed', bg: '#f5f3ff' },
                                { title: 'Responsibility', icon: <Target size={22} />, color: '#059669', bg: '#ecfdf5' },
                                { title: 'Emotional Control', icon: <Brain size={22} />, color: '#6366f1', bg: '#eef2ff' },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:shadow-lg transition-all hover:-translate-y-1" style={{ background: item.bg, borderColor: `${item.color}30` }}>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{ background: `${item.color}15`, color: item.color }}>{item.icon}</div>
                                    <span className="text-[11px] font-bold text-gray-700 text-center">{item.title}</span>
                                </div>
                            ))}
                        </div>
                        <IB type="note">In gunn ko apni daily life mein practice karein — <strong>achhi personality</strong> banane mein samay lagta hai lekin yeh hamesha kaam aati hai!</IB>
                    </Sec>

                    {/* ═══ SECTION: Determinants of Personality ═══ */}
                    <Sec id="determinants" title="💗 Determinants of Personality" icon={<Compass size={16} className="text-sky-600" />}>
                        <p className="mb-4">किसी व्यक्ति का Personality कई कारकों (Factors) से मिलकर बनता है। इन्हें <strong>Determinants of Personality</strong> कहा जाता है।</p>

                        <div className="w-full mb-5">
                            <img src="/sample-assets/placeholder.svg" alt="Determinants of Personality" className="w-full h-auto rounded-2xl shadow-md border border-sky-100" />
                        </div>

                        <div className="space-y-4">
                            {[
                                { num: 1, title: 'Heredity (वंशानुगत गुण)', desc: 'Heredity का अर्थ है माता-पिता से प्राप्त होने वाले गुण। जैसे — Height, Body Structure, Eye Colour, Intelligence आदि कुछ विशेषताएँ जन्म से ही प्राप्त होती हैं।', icon: <TreePine size={20} />, color: '#10b981', bg: '#ecfdf5', border: '#34d399' },
                                { num: 2, title: 'Environment (पर्यावरण)', desc: 'जिस वातावरण में व्यक्ति रहता है, उसका व्यक्तित्व उसी के अनुसार विकसित होता है। परिवार, मित्र, विद्यालय, समाज तथा कार्यस्थल व्यक्ति के व्यवहार पर गहरा प्रभाव डालते हैं।', icon: <Globe size={20} />, color: '#0891b2', bg: '#ecfeff', border: '#22d3ee' },
                                { num: 3, title: 'Culture (संस्कृति)', desc: 'व्यक्ति जिस संस्कृति में जन्म लेता है, उसके रीति-रिवाज, भाषा, परंपराएँ और सामाजिक मूल्य उसके व्यक्तित्व को प्रभावित करते हैं।', icon: <Sparkles size={20} />, color: '#8b5cf6', bg: '#f5f3ff', border: '#a78bfa' },
                                { num: 4, title: 'Family (परिवार)', desc: 'परिवार बच्चे का पहला विद्यालय होता है। अच्छे संस्कार, अनुशासन, नैतिक मूल्य तथा व्यवहार परिवार से ही सीखने को मिलते हैं।', icon: <Home size={20} />, color: '#ec4899', bg: '#fdf2f8', border: '#f9a8d4' },
                                { num: 5, title: 'Education (शिक्षा)', desc: 'शिक्षा केवल ज्ञान ही नहीं देती, बल्कि व्यक्ति में आत्मविश्वास, निर्णय क्षमता, Communication Skill तथा सकारात्मक सोच भी विकसित करती है।', icon: <GraduationCap size={20} />, color: '#f59e0b', bg: '#fffbeb', border: '#fbbf24' },
                                { num: 6, title: 'Social Factors (सामाजिक कारक)', desc: 'समाज, मित्र, सहकर्मी तथा अन्य लोगों के साथ रहने से व्यक्ति का व्यवहार और व्यक्तित्व विकसित होता है।', icon: <Users size={20} />, color: '#3b82f6', bg: '#eff6ff', border: '#93c5fd' },
                                { num: 7, title: 'Life Experiences (जीवन के अनुभव)', desc: 'जीवन में मिलने वाली सफलताएँ, असफलताएँ, चुनौतियाँ तथा अनुभव व्यक्ति के व्यक्तित्व को लगातार बदलते और विकसित करते रहते हैं।', icon: <Compass size={20} />, color: '#ef4444', bg: '#fef2f2', border: '#fca5a5' },
                            ].map((d) => (
                                <div key={d.num} className="flex items-start gap-4 p-4 rounded-xl border hover:shadow-md transition-shadow" style={{ background: d.bg, borderColor: d.border }}>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: `linear-gradient(135deg, ${d.color}, ${d.color}cc)`, color: '#fff' }}>
                                        {d.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-sm mb-1" style={{ color: d.color }}>
                                            {d.num}. {d.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 leading-relaxed">{d.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Flow */}
                        <div className="mt-5 p-4 rounded-xl bg-purple-50 border border-purple-200">
                            <p className="text-sm text-purple-900 font-semibold mb-3">🔄 Personality Banane Wale Factors:</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 flex-wrap">
                                {['Heredity', 'Environment', 'Culture', 'Family', 'Education', 'Social', 'Experiences'].map((step, i) => (
                                    <span key={i} className="flex items-center gap-2">
                                        <span className={`px-3 py-2 rounded-lg text-xs font-bold shadow-sm ${i === 3 ? 'bg-pink-600 text-white' : 'bg-white text-purple-700 border border-purple-200'}`}>{step}</span>
                                        {i < 6 && <ChevronRight className="text-purple-400 rotate-90 sm:rotate-0" size={14} />}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <IB type="warning">O Level exam mein <strong>Determinants of Personality</strong> bahut important topic hai — saatoon factors ki <strong>Definition aur Examples</strong> yaad karein!</IB>
                    </Sec>

                    {/* ═══════════════════════════════════════════════════ */}
                    {/* ═══ SELF-AWARENESS SECTION ═══ */}
                    {/* ═══════════════════════════════════════════════════ */}
                    
                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-dashed border-teal-200" /></div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-6 py-2 rounded-full text-sm font-extrabold text-teal-700 border-2 border-teal-200 shadow-lg flex items-center gap-2">
                                <Eye size={18} /> Self-Awareness & Motivation
                            </span>
                        </div>
                    </div>

                    {/* ═══ SECTION: Self-Awareness ═══ */}
                    <Sec id="self-awareness" title="💗 Self-Awareness — Definition" icon={<Eye size={16} className="text-teal-600" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>🔍 <strong>Self-Awareness</strong> का अर्थ है स्वयं को अच्छी तरह समझना। यह वह क्षमता है जिसके द्वारा व्यक्ति अपनी Strengths (ताकत), Weaknesses (कमियाँ), Thoughts (विचार), Feelings (भावनाएँ), Values (मूल्य), Behaviour (व्यवहार) तथा Goals (लक्ष्य) को पहचानता है।</Def>
                                
                                <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 text-teal-900 font-semibold italic text-center">
                                    "स्वयं के व्यक्तित्व, व्यवहार, क्षमताओं और सीमाओं को पहचानना ही Self-Awareness कहलाता है।"
                                </div>
                                
                                <p>Self-Awareness व्यक्ति को <strong>सही निर्णय लेने, अपनी कमियों को सुधारने</strong> तथा जीवन में सफलता प्राप्त करने में सहायता करती है।</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Self-Awareness" className="w-full h-auto rounded-2xl shadow-md border border-teal-100" />
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50">
                                <h4 className="font-extrabold text-sm text-blue-800 mb-2 flex items-center gap-2"><Star size={16} /> Importance of Self-Awareness</h4>
                                <ul className="text-xs text-gray-700 space-y-1.5 ml-1">
                                    <li className="flex gap-2"><span>🔹</span> व्यक्ति अपनी Strengths और Weaknesses को पहचानता है।</li>
                                    <li className="flex gap-2"><span>🔹</span> सही निर्णय लेने की क्षमता विकसित होती है।</li>
                                    <li className="flex gap-2"><span>🔹</span> आत्मविश्वास बढ़ता है और गलतियों से सीखने की आदत विकसित होती है।</li>
                                    <li className="flex gap-2"><span>🔹</span> Communication Skill और Emotional Control बेहतर होता है।</li>
                                </ul>
                            </div>
                            <div className="p-4 rounded-xl border border-green-200 bg-green-50">
                                <h4 className="font-extrabold text-sm text-green-800 mb-2 flex items-center gap-2"><TrendingUp size={16} /> How to Improve</h4>
                                <ul className="text-xs text-gray-700 space-y-1.5 ml-1">
                                    <li className="flex gap-2"><span>✅</span> प्रतिदिन स्वयं का मूल्यांकन करें (Self Reflection)।</li>
                                    <li className="flex gap-2"><span>✅</span> अपनी गलतियों से सीखें और दूसरों से Feedback प्राप्त करें।</li>
                                    <li className="flex gap-2"><span>✅</span> स्पष्ट लक्ष्य (Goals) निर्धारित करें और Meditation करें।</li>
                                    <li className="flex gap-2"><span>✅</span> अपने व्यवहार का निरीक्षण करें और नई चीजें सीखते रहें।</li>
                                </ul>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Motivation ═══ */}
                    <Sec id="motivation" title="💗 Motivation — Definition & Types" icon={<Zap size={16} className="text-orange-500" />}>
                        <Def>🔥 <strong>Motivation</strong> वह आंतरिक (Internal) या बाहरी (External) शक्ति है जो व्यक्ति को किसी कार्य को करने, लक्ष्य प्राप्त करने तथा कठिन परिस्थितियों में भी आगे बढ़ते रहने के लिए प्रेरित करती है। <strong>"किसी कार्य को करने की प्रेरणा या उत्साह ही Motivation कहलाता है।"</strong></Def>

                        <div className="mt-4 w-full">
                            <img src="/sample-assets/placeholder.svg" alt="Types of Motivation" className="w-full h-auto rounded-2xl shadow-md border border-orange-100" />
                        </div>

                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 hover:shadow-md transition-all">
                                <h4 className="font-extrabold text-sm text-orange-800 mb-2">1. Internal Motivation (Intrinsic)</h4>
                                <p className="text-xs text-gray-600 mb-2">जब व्यक्ति स्वयं की इच्छा, रुचि या संतुष्टि के लिए कार्य करता है।</p>
                                <p className="text-xs font-bold text-orange-700 bg-orange-100 p-2 rounded-lg">💡 Example: नई Skills सीखना, ज्ञान प्राप्त करना, स्वयं को बेहतर बनाना।</p>
                            </div>
                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 hover:shadow-md transition-all">
                                <h4 className="font-extrabold text-sm text-blue-800 mb-2">2. External Motivation (Extrinsic)</h4>
                                <p className="text-xs text-gray-600 mb-2">जब व्यक्ति किसी पुरस्कार (Reward), वेतन (Salary), Promotion या प्रशंसा (Appreciation) के लिए कार्य करता है।</p>
                                <p className="text-xs font-bold text-blue-700 bg-blue-100 p-2 rounded-lg">🏆 Example: Bonus प्राप्त करना, परीक्षा में अच्छे अंक लाना, Promotion पाना।</p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 rounded-xl bg-white border border-gray-200">
                            <h4 className="font-extrabold text-sm text-gray-800 mb-3 flex items-center gap-2"><Target size={16} className="text-red-500" /> Importance of Motivation</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    'लक्ष्य प्राप्त करने की प्रेरणा मिलती है।',
                                    'कठिन परिस्थितियों में साहस मिलता है।',
                                    'आत्मविश्वास बढ़ता है।',
                                    'सफलता प्राप्त करने की इच्छा मजबूत होती है।',
                                    'व्यक्ति सकारात्मक बना रहता है।',
                                    'Productivity बढ़ती है।'
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-2 items-center text-xs text-gray-700 font-semibold bg-gray-50 p-2 rounded-lg border border-gray-100"><CheckCircle2 size={14} className="text-green-700 flex-shrink-0" /> {item}</div>
                                ))}
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Self-Motivation & Self-Discipline ═══ */}
                    <Sec id="self-motivation" title="💗 Self-Motivation & Self-Discipline" icon={<TrendingUp size={16} className="text-emerald-600" />}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Self-Motivation */}
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200">
                                <div className="flex items-center gap-2 mb-3"><Zap size={20} className="text-emerald-600" /><h3 className="font-extrabold text-emerald-900 text-sm">Self-Motivation</h3></div>
                                <p className="text-xs text-gray-700 leading-relaxed mb-3">
                                    बिना किसी बाहरी दबाव या सहायता के स्वयं को अपने लक्ष्य की ओर प्रेरित करना। <strong>"स्वयं को सफलता के लिए प्रेरित करने की क्षमता ही Self-Motivation कहलाती है।"</strong>
                                </p>
                                <div className="space-y-1.5 mb-3">
                                    <p className="text-[11px] font-bold text-emerald-800">✅ Importance:</p>
                                    <ul className="text-xs text-gray-600 list-disc list-inside">
                                        <li>आत्मविश्वास बढ़ता है और लक्ष्य पर ध्यान रहता है।</li>
                                        <li>कठिन परिस्थितियों में धैर्य बना रहता है।</li>
                                    </ul>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[11px] font-bold text-emerald-800">✅ How to Develop:</p>
                                    <ul className="text-xs text-gray-600 list-disc list-inside">
                                        <li>स्पष्ट लक्ष्य निर्धारित करें और सकारात्मक सोच रखें।</li>
                                        <li>नकारात्मक लोगों से दूरी बनाए रखें।</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Self-Discipline */}
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200">
                                <div id="self-discipline" className="flex items-center gap-2 mb-3"><Clock size={20} className="text-rose-600" /><h3 className="font-extrabold text-rose-900 text-sm">Self-Discipline</h3></div>
                                <p className="text-xs text-gray-700 leading-relaxed mb-3">
                                    स्वयं पर नियंत्रण रखना तथा बिना किसी बाहरी दबाव के सही समय पर सही कार्य करना। <strong>"अपने व्यवहार, समय और कार्यों को नियंत्रित करने की क्षमता ही Self-Discipline कहलाती है।"</strong>
                                </p>
                                <div className="space-y-1.5 mb-3">
                                    <p className="text-[11px] font-bold text-rose-800">✅ Importance:</p>
                                    <ul className="text-xs text-gray-600 list-disc list-inside">
                                        <li>समय का सही उपयोग होता है और आलस्य कम होता है।</li>
                                        <li>कार्य की गुणवत्ता और सफलता की संभावना बढ़ती है।</li>
                                    </ul>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[11px] font-bold text-rose-800">✅ Ways to Develop:</p>
                                    <ul className="text-xs text-gray-600 list-disc list-inside">
                                        <li>Daily Routine बनाएँ और समय का पालन करें।</li>
                                        <li>Mobile और Social Media का सीमित उपयोग करें।</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Self-Esteem & Positive Personality ═══ */}
                    <Sec id="self-esteem" title="💗 Self-Esteem & Positive Personality" icon={<Shield size={16} className="text-violet-600" />}>
                        <Def>🛡️ <strong>Self-Esteem</strong> का अर्थ है स्वयं के प्रति सम्मान (Respect), विश्वास (Confidence) तथा अपनी क्षमताओं पर भरोसा रखना। जिस व्यक्ति का Self-Esteem अच्छा होता है, वह स्वयं को मूल्यवान (Valuable) समझता है।</Def>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-violet-200 bg-violet-50">
                                <h4 className="font-extrabold text-sm text-violet-800 mb-2">How to Improve Self-Esteem</h4>
                                <ul className="text-xs text-gray-700 space-y-1.5 ml-1">
                                    <li className="flex gap-2"><span>🔸</span> अपनी उपलब्धियों को याद रखें।</li>
                                    <li className="flex gap-2"><span>🔸</span> अपनी तुलना दूसरों से न करें।</li>
                                    <li className="flex gap-2"><span>🔸</span> अपनी गलतियों से सीखें और स्वयं का सम्मान करें।</li>
                                    <li className="flex gap-2"><span>🔸</span> सकारात्मक सोच रखें और नकारात्मक विचारों से बचें।</li>
                                </ul>
                            </div>
                            
                            <div id="positive-personality" className="p-4 rounded-xl border border-blue-200 bg-blue-50">
                                <h4 className="font-extrabold text-sm text-blue-800 mb-2">Building Positive Personality</h4>
                                <p className="text-xs text-gray-700 mb-2">अपने व्यक्तित्व में ऐसे सकारात्मक गुण विकसित करना जो व्यक्ति को <strong>सफल, जिम्मेदार और आत्मविश्वासी</strong> बनाएँ।</p>
                                <p className="text-[11px] font-bold text-blue-800 mb-1">Qualities:</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {['Positive Attitude', 'Confidence', 'Honesty', 'Discipline', 'Leadership', 'Team Work'].map((q, i) => (
                                        <span key={i} className="px-2 py-1 bg-white border border-blue-100 rounded text-[10px] font-bold text-blue-700 shadow-sm">{q}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Positive Thinking ═══ */}
                    <Sec id="positive-thinking" title="💗 Positive Thinking" icon={<Smile size={16} className="text-amber-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>☀️ <strong>Positive Thinking</strong> का अर्थ है प्रत्येक परिस्थिति में सकारात्मक दृष्टिकोण (Positive Attitude) रखना तथा समस्याओं के स्थान पर उनके समाधान पर ध्यान देना।</Def>
                                <p className="text-sm text-gray-700">"हर परिस्थिति में अच्छे परिणाम की उम्मीद रखते हुए सकारात्मक तरीके से सोचना ही <strong>Positive Thinking</strong> कहलाता है।"</p>
                                
                                <div className="space-y-2 mt-2">
                                    <h4 className="text-xs font-bold text-amber-800">Importance:</h4>
                                    <p className="text-xs text-gray-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                                        तनाव (Stress) कम होता है, मानसिक स्वास्थ्य बेहतर रहता है, निर्णय लेने की क्षमता बढ़ती है और सफलता प्राप्त करने की संभावना बढ़ जाती है।
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-amber-800">How to Develop:</h4>
                                    <ul className="text-xs text-gray-700 space-y-1">
                                        <li className="flex gap-2 items-center"><CheckCircle2 size={12} className="text-green-500" /> हमेशा समाधान पर ध्यान दें और नकारात्मक विचारों से बचें।</li>
                                        <li className="flex gap-2 items-center"><CheckCircle2 size={12} className="text-green-500" /> अच्छे लोगों की संगति रखें और असफलता से सीखें (हार न मानें)।</li>
                                        <li className="flex gap-2 items-center"><CheckCircle2 size={12} className="text-green-500" /> हमेशा <strong>"मैं कर सकता हूँ" (I Can Do It)</strong> की सोच रखें।</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Positive Thinking" className="w-full h-auto rounded-2xl shadow-md border border-amber-100" />
                            </div>
                        </div>
                    </Sec>

                    {/* ═══════════════════════════════════════════════════ */}
                    {/* ═══ TIME & STRESS MANAGEMENT SECTION ═══ */}
                    {/* ═══════════════════════════════════════════════════ */}
                    
                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-dashed border-orange-200" /></div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-6 py-2 rounded-full text-sm font-extrabold text-orange-700 border-2 border-orange-200 shadow-lg flex items-center gap-2">
                                <Clock size={18} /> Time & Stress Management
                            </span>
                        </div>
                    </div>

                    {/* ═══ SECTION: Time Management ═══ */}
                    <Sec id="time-management" title="💗 Time Management" icon={<Clock size={16} className="text-orange-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>⏳ <strong>Time Management</strong> का अर्थ है अपने समय का सही ढंग से योजना (Planning) बनाकर उसका प्रभावी (Effective) और उचित (Efficient) उपयोग करना ताकि निर्धारित समय में अपने सभी कार्यों और लक्ष्यों को सफलतापूर्वक पूरा किया जा सके।</Def>
                                <p className="text-sm font-semibold italic text-orange-800 border-l-4 border-orange-400 pl-3 py-1 bg-orange-50">
                                    "समय का सही योजना बनाकर उसका उचित उपयोग करना ही Time Management कहलाता है।"
                                </p>
                                <p>समय एक ऐसा संसाधन (Resource) है जिसे एक बार खो देने के बाद वापस प्राप्त नहीं किया जा सकता। इसलिए प्रत्येक व्यक्ति के लिए समय का सही उपयोग करना अत्यंत आवश्यक है।</p>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Time Management" className="w-full h-auto rounded-2xl shadow-md border border-orange-100" />
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-red-200 bg-red-50 hover:shadow-md transition-shadow">
                                <h4 className="font-extrabold text-sm text-red-800 mb-3 flex items-center gap-2"><Star size={16} /> Importance of Time Management</h4>
                                <ul className="text-xs text-gray-700 space-y-2 ml-1">
                                    <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-red-500" /> कार्य समय पर पूरे होते हैं और Productivity बढ़ती है।</li>
                                    <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-red-500" /> Stress कम होता है और लक्ष्य जल्दी प्राप्त होते हैं।</li>
                                    <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-red-500" /> कार्य की गुणवत्ता बेहतर होती है और अनुशासन विकसित होता है।</li>
                                    <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-red-500" /> आत्मविश्वास बढ़ता है और Work-Life Balance बना रहता है।</li>
                                </ul>
                            </div>
                            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 hover:shadow-md transition-shadow">
                                <h4 className="font-extrabold text-sm text-amber-800 mb-3 flex items-center gap-2"><TrendingUp size={16} /> Techniques</h4>
                                <ul className="text-xs text-gray-700 space-y-2 ml-1">
                                    <li className="flex gap-2 items-center"><span>⏱️</span> Daily Time Table बनाएं।</li>
                                    <li className="flex gap-2 items-center"><span>⏱️</span> कार्यों की Priority निर्धारित करें (महत्वपूर्ण कार्य पहले)।</li>
                                    <li className="flex gap-2 items-center"><span>⏱️</span> प्रत्येक कार्य के लिए समय निर्धारित करें और बर्बादी से बचें।</li>
                                    <li className="flex gap-2 items-center"><span>⏱️</span> Mobile/Social Media सीमित करें और कार्यों की समीक्षा करें।</li>
                                </ul>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Stress Management ═══ */}
                    <Sec id="stress-management" title="💗 Stress Management" icon={<Heart size={16} className="text-teal-600" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>🧘 <strong>Stress Management</strong> वह प्रक्रिया है जिसके द्वारा व्यक्ति मानसिक (Mental), शारीरिक (Physical) और भावनात्मक (Emotional) तनाव को नियंत्रित (Control) करता है तथा स्वयं को स्वस्थ और सकारात्मक बनाए रखता है।</Def>
                                <p>जीवन में पढ़ाई, नौकरी, व्यवसाय या व्यक्तिगत समस्याओं के कारण तनाव उत्पन्न हो सकता है। यदि तनाव को समय रहते नियंत्रित न किया जाए तो यह <strong>स्वास्थ्य और कार्यक्षमता दोनों को प्रभावित</strong> कर सकता है।</p>
                                
                                <h4 className="font-extrabold text-sm text-teal-800 mt-2 mb-1 border-b border-teal-200 pb-1">Techniques to Manage Stress:</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                                    <div className="flex items-center gap-2 bg-teal-50 p-2 rounded-lg"><span className="text-lg">🏃</span> नियमित व्यायाम करें</div>
                                    <div className="flex items-center gap-2 bg-teal-50 p-2 rounded-lg"><span className="text-lg">😴</span> पर्याप्त नींद लें</div>
                                    <div className="flex items-center gap-2 bg-teal-50 p-2 rounded-lg"><span className="text-lg">🧘‍♀️</span> Meditation / Yoga</div>
                                    <div className="flex items-center gap-2 bg-teal-50 p-2 rounded-lg"><span className="text-lg">🥗</span> संतुलित भोजन लें</div>
                                    <div className="flex items-center gap-2 bg-teal-50 p-2 rounded-lg"><span className="text-lg">🤝</span> समस्याएँ साझा करें</div>
                                    <div className="flex items-center gap-2 bg-teal-50 p-2 rounded-lg"><span className="text-lg">⏰</span> Time Management</div>
                                </div>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Stress Management" className="w-full h-auto rounded-2xl shadow-md border border-teal-100" />
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50">
                                <h4 className="font-extrabold text-sm text-rose-800 mb-2">Causes of Stress</h4>
                                <div className="flex flex-wrap gap-2 text-[10px] font-bold text-rose-700">
                                    <span className="px-2 py-1 bg-white border border-rose-100 rounded">अत्यधिक कार्यभार</span>
                                    <span className="px-2 py-1 bg-white border border-rose-100 rounded">परीक्षा का दबाव</span>
                                    <span className="px-2 py-1 bg-white border border-rose-100 rounded">समय की कमी</span>
                                    <span className="px-2 py-1 bg-white border border-rose-100 rounded">आर्थिक समस्याएँ</span>
                                    <span className="px-2 py-1 bg-white border border-rose-100 rounded">पारिवारिक समस्याएँ</span>
                                    <span className="px-2 py-1 bg-white border border-rose-100 rounded">असफलता का डर</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50">
                                <h4 className="font-extrabold text-sm text-purple-800 mb-2">Effects of Stress</h4>
                                <ul className="text-xs text-gray-700 space-y-1">
                                    <li>❌ एकाग्रता (Concentration) कम होना</li>
                                    <li>❌ आत्मविश्वास में कमी और चिड़चिड़ापन</li>
                                    <li>❌ नींद की समस्या और थकान</li>
                                    <li>❌ कार्यक्षमता में भारी कमी</li>
                                </ul>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══════════════════════════════════════════════════ */}
                    {/* ═══ GOAL SETTING & DECISION MAKING ═══ */}
                    {/* ═══════════════════════════════════════════════════ */}

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-dashed border-purple-200" /></div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-6 py-2 rounded-full text-sm font-extrabold text-purple-700 border-2 border-purple-200 shadow-lg flex items-center gap-2">
                                <Target size={18} /> Goals & Decisions
                            </span>
                        </div>
                    </div>

                    {/* ═══ SECTION: Goal Setting ═══ */}
                    <Sec id="goal-setting" title="💗 Goal Setting" icon={<Target size={16} className="text-purple-600" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center">
                            <div className="flex-1 space-y-3">
                                <Def>🎯 <strong>Goal Setting</strong> का अर्थ है अपने जीवन या Career के लिए स्पष्ट (Clear), निश्चित (Specific) और प्राप्त किए जा सकने वाले (Achievable) लक्ष्य निर्धारित करना तथा उन्हें पूरा करने के लिए योजना बनाना।</Def>
                                <p className="text-sm font-semibold italic text-purple-800">
                                    "अपने भविष्य के लिए लक्ष्य निर्धारित करने की प्रक्रिया को Goal Setting कहते हैं।"
                                </p>
                                <p>स्पष्ट लक्ष्य व्यक्ति को सही दिशा में कार्य करने की प्रेरणा देते हैं और सफलता प्राप्त करने में सहायता करते हैं।</p>
                                
                                <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl mt-2">
                                    <h4 className="font-extrabold text-sm text-purple-900 mb-2">Importance:</h4>
                                    <p className="text-xs text-gray-700">जीवन को सही दिशा मिलती है, Motivation और आत्मविश्वास बढ़ता है, समय का सही उपयोग होता है, निर्णय लेना आसान होता है, और कार्य करने की योजना स्पष्ट होती है।</p>
                                </div>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Goal Setting" className="w-full h-auto rounded-2xl shadow-md border border-purple-100" />
                            </div>
                        </div>

                        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
                            <h4 className="font-extrabold text-sm text-violet-900 mb-3 text-center uppercase tracking-wide">Characteristics of Good Goals (SMART Goals)</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                                {[
                                    { s: 'S', title: 'Specific', desc: 'लक्ष्य स्पष्ट होना चाहिए', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                                    { s: 'M', title: 'Measurable', desc: 'मापने योग्य होना चाहिए', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                                    { s: 'A', title: 'Achievable', desc: 'प्राप्त करने योग्य होना चाहिए', color: 'bg-amber-100 text-amber-700 border-amber-200' },
                                    { s: 'R', title: 'Realistic', desc: 'वास्तविक होना चाहिए', color: 'bg-rose-100 text-rose-700 border-rose-200' },
                                    { s: 'T', title: 'Time Bound', desc: 'समयबद्ध होना चाहिए', color: 'bg-purple-100 text-purple-700 border-purple-200' },
                                ].map((g, i) => (
                                    <div key={i} className={`p-3 rounded-lg border text-center ${g.color}`}>
                                        <div className="text-lg font-black mb-1">{g.s}</div>
                                        <div className="text-[10px] font-bold uppercase">{g.title}</div>
                                        <div className="text-[9px] mt-1 text-gray-700 font-semibold">{g.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Sec>

                    {/* ═══ SECTION: Decision Making ═══ */}
                    <Sec id="decision-making" title="💗 Decision Making" icon={<Brain size={16} className="text-blue-600" />}>
                        <Def>⚖️ <strong>Decision Making</strong> वह प्रक्रिया है जिसमें उपलब्ध विभिन्न विकल्पों (Alternatives) में से किसी एक सर्वोत्तम (Best) विकल्प का चयन किया जाता है। <strong>"किसी समस्या का सही समाधान चुनने की प्रक्रिया ही Decision Making कहलाती है।"</strong></Def>
                        
                        <p>अच्छी Decision Making व्यक्ति के Career, Business तथा Personal Life में सफलता प्राप्त करने के लिए अत्यंत आवश्यक होती है।</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                            <div className="p-4 rounded-xl border border-sky-200 bg-sky-50">
                                <h4 className="font-extrabold text-sm text-sky-800 mb-2">Importance of Decision Making</h4>
                                <ul className="text-xs text-gray-700 space-y-1.5 ml-1">
                                    <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-sky-500" /> सही दिशा में कार्य करने में सहायता।</li>
                                    <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-sky-500" /> समस्याओं का समाधान जल्दी मिलता है।</li>
                                    <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-sky-500" /> आत्मविश्वास बढ़ता है और जोखिम (Risk) कम होता है।</li>
                                    <li className="flex gap-2 items-center"><CheckCircle2 size={14} className="text-sky-500" /> समय और संसाधनों की बचत होती है।</li>
                                </ul>
                            </div>
                            
                            <div className="p-4 rounded-xl border border-blue-200 bg-white shadow-sm">
                                <h4 className="font-extrabold text-sm text-blue-800 mb-2">Steps of Decision Making</h4>
                                <div className="space-y-2">
                                    {[
                                        'समस्या की पहचान करें।',
                                        'सभी विकल्पों का अध्ययन करें।',
                                        'विकल्प के लाभ-हानि का विश्लेषण करें।',
                                        'सर्वोत्तम विकल्प का चयन करें।',
                                        'निर्णय लागू करें और परिणाम मूल्यांकन करें।'
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-3 items-center text-xs text-gray-700">
                                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">{i+1}</span>
                                            <span className="font-medium">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Sec>

                    {/* ═══════════════════════════════════════════════════ */}
                    {/* ═══ LEADERSHIP & TEAMWORK SECTION ═══ */}
                    {/* ═══════════════════════════════════════════════════ */}

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-dashed border-red-200" /></div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-6 py-2 rounded-full text-sm font-extrabold text-red-700 border-2 border-red-200 shadow-lg flex items-center gap-2">
                                <Users size={18} /> Leadership & Teamwork
                            </span>
                        </div>
                    </div>

                    {/* ═══ SECTION: Leadership & Teamwork ═══ */}
                    <Sec id="leadership" title="💗 Leadership & Teamwork" icon={<Award size={16} className="text-red-500" />}>
                        <div className="flex flex-col md:flex-row gap-5 items-center mb-5">
                            <div className="w-full md:w-1/3 flex-shrink-0">
                                <img src="/sample-assets/placeholder.svg" alt="Leadership and Teamwork" className="w-full h-auto rounded-2xl shadow-md border border-red-100" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <Def>👑 <strong>Leadership:</strong> वह क्षमता है जिसके द्वारा कोई व्यक्ति दूसरों को प्रेरित (Motivate), मार्गदर्शन (Guide) तथा प्रभावित करके किसी सामान्य लक्ष्य (Common Goal) को प्राप्त करने के लिए कार्य कराता है।</Def>
                                <div id="teamwork"><Def>🤝 <strong>Teamwork:</strong> वह प्रक्रिया है जिसमें दो या दो से अधिक व्यक्ति किसी सामान्य लक्ष्य को प्राप्त करने के लिए आपसी सहयोग (Cooperation) और जिम्मेदारी के साथ मिलकर कार्य करते हैं।</Def></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-red-200 bg-red-50">
                                <h4 className="font-extrabold text-sm text-red-900 mb-3 border-b border-red-200 pb-2">Qualities of a Good Leader</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-red-500"/> आत्मविश्वास</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-red-500"/> ईमानदारी</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-red-500"/> Communication</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-red-500"/> Decision Making</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-red-500"/> जिम्मेदारी</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-red-500"/> सकारात्मक सोच</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-red-500"/> Team को प्रेरित करना</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-red-500"/> धैर्य (Patience)</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                                <h4 className="font-extrabold text-sm text-emerald-900 mb-3 border-b border-emerald-200 pb-2">Qualities of a Good Team Member</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-600"/> Cooperation</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-600"/> Respect for Others</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-600"/> Communication</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-600"/> Responsibility</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-600"/> Trust & Honesty</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-600"/> Discipline</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-600"/> Time Management</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-600"/> Problem Solving</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 text-center text-xs font-semibold text-orange-900">
                            <strong>Importance:</strong> Team को सही दिशा मिलती है, Motivation बढ़ता है, कार्य जल्दी पूरा होता है, Productivity बढ़ती है, नए Ideas प्राप्त होते हैं और संगठन की सफलता सुनिश्चित होती है।
                        </div>
                    </Sec>

                    {/* Chapter Summary */}
                    <section className="rounded-2xl p-5 md:p-7 mb-5 scroll-mt-20 bg-gradient-to-br from-pink-50 to-fuchsia-50" style={{ border: '1px solid #f9a8d4', boxShadow: '0 4px 16px rgba(236,72,153,0.08)' }}>
                        <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: '1px solid #f9a8d4' }}>
                            <CheckCircle2 size={16} className="text-pink-500" />
                            <h2 className="text-base md:text-lg font-extrabold text-gray-800">📋 Chapter Summary</h2>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Is chapter mein humne Soft Skills ke sabhi pramukh pehluon ko cover kiya hai: <strong>Soft vs Hard Skills</strong>, <strong>Personality Development</strong>, <strong>Self-Awareness</strong>, <strong>Motivation</strong>, <strong>Time & Stress Management</strong>, <strong>Goal Setting (SMART)</strong>, <strong>Decision Making</strong>, aur <strong>Leadership & Teamwork</strong>. Yeh sabhi skills ek successful career aur balanced personal life ke liye atyant avashyak hain.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { label: 'Soft Skills', color: '#ec4899' },
                                    { label: 'Hard Skills', color: '#3b82f6' },
                                    { label: 'Personality Dev', color: '#8b5cf6' },
                                    { label: 'Self-Awareness', color: '#0d9488' },
                                    { label: 'Motivation', color: '#ea580c' },
                                    { label: 'Positive Thinking', color: '#d97706' },
                                    { label: 'Time Management', color: '#ea580c' },
                                    { label: 'Stress Management', color: '#0d9488' },
                                    { label: 'Goal Setting (SMART)', color: '#9333ea' },
                                    { label: 'Decision Making', color: '#2563eb' },
                                    { label: 'Leadership', color: '#dc2626' },
                                    { label: 'Teamwork', color: '#059669' },
                                ].map((tag, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-white border rounded-full text-[10px] font-bold shadow-sm text-center" style={{ borderColor: `${tag.color}40`, color: tag.color }}>{tag.label}</span>
                                ))}
                            </div>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
}
