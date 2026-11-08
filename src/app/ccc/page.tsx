'use client';

import Link from 'next/link';
import { ArrowLeft, Home, BookOpen, Download } from 'lucide-react';

const chapters = [
    {
        number: 1,
        title: 'Introduction to Computer',
        description: 'Identify computers, IT gadgets and explain their evolution and applications. Get familiar with various input, output and hardware components of a computer along with storage devices. Get familiar with various types of software, utilities used for computer and mobile apps.',
        downloadLink: '/optional-content',
        color: 'cyan',
    },
    {
        number: 2,
        title: 'Introduction to Operating System',
        description: 'Well acquainted with Operating System and its applications for both desktop and mobile devices. Able to identify various desktop screen components and modify various properties, date, time etc. Able to add and remove new program and features, manage files and folders.',
        downloadLink: '/optional-content',
        color: 'blue',
    },
    {
        number: 6,
        title: 'Introduction to Internet and WWW',
        description: 'Gather knowledge of various types of networks and topologies. Get an overview of the Internet, its applications and various browsers available to access the Internet. Connect to the Internet using various modes of connections/devices available.',
        downloadLink: '/optional-content',
        color: 'emerald',
    },
    {
        number: 7,
        title: 'E-mail, Social Networking and e-Governance Services',
        description: 'Learn about various e-mail services and protocols, explore social networking platforms and their impact, and understand e-Governance services offered by the government for better digital communication.',
        downloadLink: '/optional-content',
        color: 'orange',
    },
    {
        number: 8,
        title: 'Digital Financial Services',
        description: 'Understand digital payment systems, mobile banking, and e-wallets, along with the role of digital financial services in modern society.',
        downloadLink: '/optional-content',
        color: 'yellow',
    },
    {
        number: 9,
        title: 'Future Skills and Cyber Security',
        description: 'Learn about emerging digital skills and cyber security practices, and understand how to protect information in a rapidly evolving technological landscape.',
        downloadLink: '/optional-content',
        color: 'rose',
    },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', badge: 'bg-cyan-500' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', badge: 'bg-blue-500' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', badge: 'bg-orange-500' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', badge: 'bg-yellow-500' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', badge: 'bg-rose-500' },
};

export default function CccPage() {
    return (
        <div className="wallpaper-default min-h-screen overflow-y-auto">
            <header className="sticky top-0 z-20 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
                        <div>
                            <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-gaming)' }}>Books and Notes</h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Information Technology Tools and Network Basics</p>
                        </div>
                    </div>
                    <Link href="/" className="text-gray-400 hover:text-white"><Home size={18} /></Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-6">
                {/* CCC Test Navigation */}
                <div className="glass-panel rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                            <i className="ph-bold ph-certificate text-lg text-yellow-400" />
                        </div>
                        <div>
                            <h2 id="ccc-practice-tests" className="font-semibold text-white text-sm">CCC Practice Tests</h2>
                            <p className="text-[10px] text-gray-400">Chapter-wise and full book tests</p>
                        </div>
                    </div>
                    <Link href="/ccc/tests" className="px-4 py-2 rounded-xl bg-yellow-500 text-black text-xs font-bold hover:bg-yellow-400 active:scale-95 transition-all">
                        Go to Tests →
                    </Link>
                </div>

                {/* Chapter Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {chapters.map((ch) => {
                        const c = colorMap[ch.color];
                        return (
                            <div key={ch.number} className="glass-card rounded-2xl p-5 flex flex-col gap-3 group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
                                        <BookOpen size={18} className={c.text} />
                                    </div>
                                    <div>
                                        <span className={`text-[9px] font-bold uppercase tracking-[0.18em] ${c.text}`}>Chapter {ch.number}</span>
                                        <h3 id="chtitle" className="font-semibold text-white text-sm leading-tight">{ch.title}</h3>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed flex-1">{ch.description}</p>
                                <a
                                    href={ch.downloadLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl ${c.bg} border ${c.border} ${c.text} text-xs font-bold hover:opacity-80 active:scale-95 transition-all`}
                                >
                                    <Download size={14} /> Download Notes
                                </a>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
