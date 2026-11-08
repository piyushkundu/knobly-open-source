'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Download, Sparkles, BookOpen, Lightbulb, Code2, ExternalLink, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { SafeAIContent } from '@/components/ai/SafeAIContent';

interface Section {
    heading: string;
    content: string;
    code?: string;
    codeLanguage?: string;
    example?: string;
}

interface TopicContent {
    title: string;
    summary: string;
    sections: Section[];
    keyPoints: string[];
    relatedTopics: string[];
}

export default function TopicPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;
    const topic = slug?.replace(/-/g, ' ') || '';
    const { isDark } = useTheme();

    const [content, setContent] = useState<TopicContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pdfLoading, setPdfLoading] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const searchParams = useSearchParams();
    const explicitLang = searchParams?.get('lang');
    
    // Detect language from explicit parameter sent by chat, or from topic devanagari characters
    const isHindi = explicitLang === 'hi' || /[\u0900-\u097F]/.test(topic);

    useEffect(() => {
        if (!topic) return;
        const fetchContent = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch('/api/ai/generate-topic', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic, language: isHindi ? 'hi' : 'en' }),
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setContent(data.content);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to generate content');
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [topic, isHindi]);

    const handleDownloadPDF = async () => {
        if (!contentRef.current) return;
        setPdfLoading(true);
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const opt = {
                margin: 12,
                filename: `knobly-ai-${slug}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, backgroundColor: isDark ? '#0f0a1e' : '#ffffff' },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
            };
            await html2pdf().set(opt).from(contentRef.current).save();
        } catch (err) {
            console.error('PDF generation failed:', err);
        } finally {
            setPdfLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            await navigator.share?.({ title: content?.title || topic, url: window.location.href });
        } catch { /* user cancelled */ }
    };

    const pageBg = isDark ? 'linear-gradient(180deg, #0a0615 0%, #0f0a1e 30%, #0d0820 100%)' : 'linear-gradient(180deg, #f8fafc 0%, #ffffff 30%, #f1f5f9 100%)';
    const textColor = isDark ? '#e2e8f0' : '#334155';
    const headerBg = isDark ? 'rgba(10, 6, 21, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    const headerBorder = isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)';
    const btnBg = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(241, 245, 249, 1)';
    const btnBorder = isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(226, 232, 240, 1)';
    const titleColor = isDark ? '#f1f5f9' : '#0f172a';
    const primaryTitleBg = isDark ? 'linear-gradient(90deg, #f1f5f9, #a78bfa)' : 'linear-gradient(90deg, #1e293b, #7c3aed)';
    const heroBg = isDark ? 'linear-gradient(135deg, rgba(79,46,220,0.15), rgba(14,116,144,0.1))' : 'linear-gradient(135deg, rgba(139,92,246,0.05), rgba(14,116,144,0.03))';
    const sectionBg = isDark ? 'rgba(139,92,246,0.04)' : 'rgba(255,255,255,0.7)';
    const sectionBorder = isDark ? 'rgba(139,92,246,0.12)' : 'rgba(226, 232, 240, 0.8)';
    const sectionBorderHover = isDark ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.5)';
    const contentColor = isDark ? '#cbd5e1' : '#475569';
    const codeBg = isDark ? 'rgba(0,0,0,0.4)' : '#f8fafc';
    const codeBorder = isDark ? 'rgba(103,232,249,0.15)' : 'rgba(203,213,225,0.4)';
    const codeColor = isDark ? '#e2e8f0' : '#1e293b';

    return (
        <div style={{
            minHeight: '100vh',
            background: pageBg,
            color: textColor,
            fontFamily: "'Outfit', system-ui, sans-serif",
        }}>
            {/* Header */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: headerBg,
                backdropFilter: 'blur(20px) saturate(180%)',
                borderBottom: `1px solid ${headerBorder}`,
            }}>
                <div style={{
                    maxWidth: 900, margin: '0 auto', padding: '14px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => router.back()} style={{
                            width: 36, height: 36, borderRadius: 12,
                            background: btnBg, border: `1px solid ${btnBorder}`,
                            color: isDark ? '#a78bfa' : '#7c3aed', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.2)' : 'rgba(2f, 2f, 2f, 0.05)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = btnBg; e.currentTarget.style.transform = ''; }}>
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <div style={{
                                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                                letterSpacing: '0.08em', color: isDark ? '#8b5cf6' : '#6d28d9',
                                display: 'flex', alignItems: 'center', gap: 5,
                            }}>
                                <Sparkles size={12} /> KnoblyAI Topic
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: titleColor, marginTop: 1 }}>
                                {content?.title || topic}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={handleShare} title="Share" style={{
                            width: 36, height: 36, borderRadius: 12,
                            background: btnBg, border: `1px solid ${btnBorder}`,
                            color: isDark ? '#a78bfa' : '#7c3aed', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.2)' : 'rgba(2f, 2f, 2f, 0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = btnBg; }}>
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 80px' }}>
                {loading ? (
                    <LoadingSkeleton isDark={isDark} />
                ) : error ? (
                    <ErrorState error={error} onRetry={() => window.location.reload()} isDark={isDark} />
                ) : content ? (
                    <div ref={contentRef}>
                        {/* Download Header Context */}
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24}} data-html2canvas-ignore>
                            <div style={{fontSize: 14, fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b'}}>
                                Full Page Explanation
                            </div>
                            <button onClick={handleDownloadPDF} disabled={loading || pdfLoading} style={{
                                padding: '8px 16px', borderRadius: 12,
                                background: pdfLoading ? btnBg : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                                border: `1px solid ${pdfLoading ? btnBorder : 'rgba(139, 92, 246, 0.3)'}`,
                                color: pdfLoading ? (isDark ? '#cbd5e1' : '#64748b') : '#fff', 
                                cursor: loading || pdfLoading ? 'wait' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6,
                                fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                                boxShadow: pdfLoading ? 'none' : '0 4px 20px rgba(124,58,237,0.3)',
                            }}
                            onMouseEnter={e => { if (!loading && !pdfLoading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
                                <Download size={14} />
                                {pdfLoading ? 'Generating...' : 'Download PDF'}
                            </button>
                        </div>

                        {/* Hero */}
                        <div style={{
                            background: heroBg,
                            border: `1px solid ${isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)'}`,
                            borderRadius: 20, padding: '32px 28px', marginBottom: 32,
                            position: 'relative', overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute', top: -40, right: -40, width: 160, height: 160,
                                background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
                                borderRadius: '50%',
                            }} />
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
                                fontSize: 12, fontWeight: 700, color: isDark ? '#a78bfa' : '#7c3aed',
                                textTransform: 'uppercase', letterSpacing: '0.06em',
                            }}>
                                <Sparkles size={14} /> AI-Generated Explanation
                            </div>
                            <h1 style={{
                                fontSize: 28, fontWeight: 800, color: titleColor,
                                lineHeight: 1.3, marginBottom: 12,
                                background: primaryTitleBg,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>
                                {content.title}
                            </h1>
                            <p style={{ fontSize: 15, color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.6 }}>
                                {content.summary}
                            </p>
                        </div>

                        {/* Key Points */}
                        {content.keyPoints && content.keyPoints.length > 0 && (
                            <div style={{
                                background: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.04)',
                                border: `1px solid ${isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)'}`,
                                borderRadius: 16, padding: '20px 24px', marginBottom: 28,
                            }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    fontSize: 14, fontWeight: 700, color: isDark ? '#34d399' : '#047857', marginBottom: 12,
                                }}>
                                    <Lightbulb size={16} /> Key Points
                                </div>
                                <ul style={{ margin: 0, paddingLeft: 20 }}>
                                    {content.keyPoints.map((kp, i) => (
                                        <li key={i} style={{
                                            fontSize: 14, color: contentColor, lineHeight: 1.7,
                                            marginBottom: 6,
                                        }}>{kp}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Sections */}
                        {content.sections.map((section, i) => (
                            <div key={i} style={{
                                background: sectionBg, border: `1px solid ${sectionBorder}`,
                                borderRadius: 16, padding: '24px 28px', marginBottom: 20,
                                transition: 'border-color 0.3s',
                                boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.02)'
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = sectionBorderHover; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = sectionBorder; }}>
                                <h2 style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    fontSize: 18, fontWeight: 700, color: titleColor, marginBottom: 14,
                                }}>
                                    <BookOpen size={18} style={{ color: isDark ? '#a78bfa' : '#7c3aed' }} />
                                    {section.heading}
                                </h2>
                                <div
                                    style={{ fontSize: 14, color: contentColor, lineHeight: 1.75 }}
                                >
                                    <SafeAIContent content={section.content} format="html" isDark={isDark} />
                                </div>
                                
                                {section.code && (
                                    <div style={{ marginTop: 16 }}>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 6,
                                            fontSize: 12, fontWeight: 700, color: isDark ? '#67e8f9' : '#0284c7',
                                            marginBottom: 8, textTransform: 'uppercase',
                                        }}>
                                            <Code2 size={14} /> {section.codeLanguage || 'Code'}
                                        </div>
                                        <pre style={{
                                            background: codeBg, border: `1px solid ${codeBorder}`,
                                            borderRadius: 12, padding: '16px 20px',
                                            overflowX: 'auto', fontSize: 13,
                                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                            color: codeColor, lineHeight: 1.6,
                                        }}>
                                            <code>{section.code}</code>
                                        </pre>
                                    </div>
                                )}

                                {section.example && (
                                    <div style={{
                                        marginTop: 14,
                                        background: isDark ? 'rgba(251,191,36,0.06)' : 'rgba(251,191,36,0.08)',
                                        border: `1px solid ${isDark ? 'rgba(251,191,36,0.15)' : 'rgba(251,191,36,0.2)'}`,
                                        borderRadius: 10, padding: '12px 16px',
                                    }}>
                                        <div style={{
                                            fontSize: 11, fontWeight: 700, color: isDark ? '#fbbf24' : '#d97706',
                                            textTransform: 'uppercase', marginBottom: 6,
                                        }}>💡 Example</div>
                                        <p style={{ fontSize: 13, color: contentColor, lineHeight: 1.6, margin: 0 }}>
                                            {section.example}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Related Topics */}
                        {content.relatedTopics && content.relatedTopics.length > 0 && (
                            <div style={{
                                background: isDark ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.03)',
                                border: `1px solid ${isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)'}`,
                                borderRadius: 16, padding: '24px 28px', marginTop: 32,
                            }}>
                                <div style={{
                                    fontSize: 14, fontWeight: 700, color: isDark ? '#a78bfa' : '#7c3aed', marginBottom: 14,
                                    display: 'flex', alignItems: 'center', gap: 8,
                                }}>
                                    <ExternalLink size={16} /> Related Topics
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {content.relatedTopics.map((rt, i) => {
                                        const rtSlug = rt.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
                                        return (
                                            <Link key={i} href={`/ai/topic/${rtSlug}`} style={{
                                                padding: '8px 16px', borderRadius: 999,
                                                background: isDark ? 'rgba(139,92,246,0.1)' : '#fff',
                                                border: `1px solid ${isDark ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.2)'}`,
                                                color: isDark ? '#c4b5fd' : '#6d28d9', fontSize: 13, fontWeight: 600,
                                                textDecoration: 'none', transition: 'all 0.2s',
                                                display: 'flex', alignItems: 'center', gap: 6,
                                                boxShadow: isDark ? 'none' : '0 2px 5px rgba(139,92,246,0.05)'
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.2)' : '#f8fafc';
                                                e.currentTarget.style.boxShadow = isDark ? '0 0 15px rgba(139,92,246,0.2)' : '0 4px 10px rgba(139,92,246,0.1)';
                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.1)' : '#fff';
                                                e.currentTarget.style.boxShadow = isDark ? 'none' : '0 2px 5px rgba(139,92,246,0.05)';
                                                e.currentTarget.style.transform = '';
                                            }}>
                                                <Sparkles size={12} /> {rt}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Footer CTA */}
                        <div style={{
                            textAlign: 'center', marginTop: 48, padding: '24px',
                            borderTop: `1px solid ${isDark ? 'rgba(139,92,246,0.1)' : 'rgba(226, 232, 240, 1)'}`,
                        }}>
                            <p style={{ fontSize: 13, color: isDark ? '#64748b' : '#94a3b8', marginBottom: 12 }}>
                                Generated by <strong style={{ color: isDark ? '#a78bfa' : '#8b5cf6' }}>KnoblyAI</strong> — Your AI Learning Companion
                            </p>
                            <Link href="/" style={{
                                padding: '10px 24px', borderRadius: 12,
                                background: 'linear-gradient(135deg, #7c3aed, #0891b2)',
                                color: '#fff', fontSize: 13, fontWeight: 700,
                                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                                boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,58,237,0.4)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.3)'; }}>
                                🏠 Explore Knobly Web
                            </Link>
                        </div>
                    </div>
                ) : null}
            </main>
        </div>
    );
}

/* ─── Loading Skeleton ─── */
function LoadingSkeleton({ isDark }: { isDark: boolean }) {
    const bg = isDark ? 'rgba(139,92,246,0.04)' : 'rgba(255,255,255,0.7)';
    const borderColor = isDark ? 'rgba(139,92,246,0.1)' : 'rgba(226, 232, 240, 0.8)';
    const linearGrad = isDark 
        ? 'linear-gradient(90deg, rgba(139,92,246,0.06) 25%, rgba(139,92,246,0.12) 50%, rgba(139,92,246,0.06) 75%)'
        : 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)';
    return (
        <div style={{ padding: '0' }}>
            <style>{`
                @keyframes ksShimmer {
                    0% { background-position: -600px 0; }
                    100% { background-position: 600px 0; }
                }
                .ks-bar {
                    background: ${linearGrad};
                    background-size: 600px 100%;
                    animation: ksShimmer 1.8s infinite ease-in-out;
                    border-radius: 8px;
                }
            `}</style>
            <div style={{
                background: bg, border: `1px solid ${borderColor}`,
                borderRadius: 20, padding: '32px 28px', marginBottom: 28,
            }}>
                <div className="ks-bar" style={{ width: 120, height: 14, marginBottom: 16 }} />
                <div className="ks-bar" style={{ width: '70%', height: 28, marginBottom: 12 }} />
                <div className="ks-bar" style={{ width: '100%', height: 16, marginBottom: 6 }} />
                <div className="ks-bar" style={{ width: '80%', height: 16 }} />
            </div>
            {[1, 2, 3].map(n => (
                <div key={n} style={{
                    background: bg, border: `1px solid ${borderColor}`,
                    borderRadius: 16, padding: '24px 28px', marginBottom: 16,
                }}>
                    <div className="ks-bar" style={{ width: '50%', height: 20, marginBottom: 16 }} />
                    <div className="ks-bar" style={{ width: '100%', height: 14, marginBottom: 8 }} />
                    <div className="ks-bar" style={{ width: '95%', height: 14, marginBottom: 8 }} />
                    <div className="ks-bar" style={{ width: '85%', height: 14 }} />
                </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: 24 }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 20px', borderRadius: 12,
                    background: isDark ? 'rgba(139,92,246,0.06)' : 'rgba(23ede, 1)',
                    border: `1px solid ${isDark ? 'rgba(139,92,246,0.15)' : 'rgba(200, 200, 200, 0.4)'}`,
                    color: isDark ? '#a78bfa' : '#6d28d9', fontSize: 13, fontWeight: 600,
                }}>
                    <Sparkles size={14} style={{ animation: 'spin 1.5s linear infinite' }} />
                    KnoblyAI is generating content...
                </div>
            </div>
        </div>
    );
}

/* ─── Error State ─── */
function ErrorState({ error, onRetry, isDark }: { error: string; onRetry: () => void, isDark: boolean }) {
    return (
        <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: isDark ? 'rgba(239,68,68,0.04)' : '#fef2f2',
            border: `1px solid ${isDark ? 'rgba(239,68,68,0.15)' : '#fca5a5'}`,
            borderRadius: 20,
        }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😵</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f87171', marginBottom: 8 }}>
                Oops! Something went wrong
            </h2>
            <p style={{ fontSize: 14, color: isDark ? '#94a3b8' : '#64748b', marginBottom: 20 }}>{error}</p>
            <button onClick={onRetry} style={{
                padding: '10px 24px', borderRadius: 12,
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: '#fff', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 700,
            }}>
                Try Again
            </button>
        </div>
    );
}
