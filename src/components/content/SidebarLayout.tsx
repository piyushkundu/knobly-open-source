'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Code2, Menu, X } from 'lucide-react';
import { useState, ReactNode, useEffect } from 'react';

interface SidebarItem {
    id: string;
    label: string;
}

interface SidebarLayoutProps {
    title: string;
    backHref: string;
    sidebarTitle: string;
    items: SidebarItem[];
    children: ReactNode;
}

export default function SidebarLayout({ title, backHref, sidebarTitle, items, children }: SidebarLayoutProps) {
    const router = useRouter();
    const [activeId, setActiveId] = useState(items[0]?.id || '');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                }
            },
            { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
        );
        items.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [items]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveId(id);
            setSidebarOpen(false);
        }
    };

    const activeIndex = items.findIndex(i => i.id === activeId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 select-text" style={{ color: '#1e293b' }}>
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
                <div className="px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (typeof window !== 'undefined' && window.history.length > 1) {
                                    router.back();
                                } else {
                                    router.push(backHref);
                                }
                            }}
                            className="text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-lg hover:bg-gray-100"
                            title="Go Back"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-blue-500/25">
                                <Code2 size={13} className="text-white" />
                            </div>
                            <h1 className="text-xs sm:text-sm font-bold text-gray-900">{title}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Progress indicator */}
                        <div className="hidden sm:flex items-center gap-2 mr-2">
                            <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                                    style={{ width: `${((activeIndex + 1) / items.length) * 100}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono">{activeIndex + 1}/{items.length}</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
                        </button>
                        <Link href="/" className="text-gray-400 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                            <Home size={16} />
                        </Link>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
                    fixed lg:sticky top-[49px] left-0 z-20
                    w-[260px] h-[calc(100vh-49px)] overflow-y-auto
                    bg-white/95 backdrop-blur-xl border-r border-gray-200/60 shadow-xl lg:shadow-none
                    transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `} style={{ scrollbarWidth: 'thin' }}>
                    <div className="p-4">
                        <h2 className="text-[10px] font-extrabold text-blue-600 uppercase tracking-[0.2em] mb-3 px-3">{sidebarTitle}</h2>
                        <nav className="space-y-0.5">
                            {items.map((item, i) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollTo(item.id)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-[12px] leading-tight transition-all duration-200 ${activeId === item.id
                                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold shadow-sm border border-blue-100'
                                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[9px] font-bold mr-2 ${activeId === item.id
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-400'
                                        }`}>{i + 1}</span>
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Main Content */}
                <main className="flex-1 min-w-0 px-3 sm:px-5 md:px-8 py-5 max-w-4xl mx-auto select-text">
                    {children}
                </main>
            </div>
        </div>
    );
}
