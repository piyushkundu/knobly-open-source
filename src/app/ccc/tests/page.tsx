'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Home, Play, Trophy, Clock } from 'lucide-react';

interface CccTest { id: string; title: string; questions: { text: string; options: string[]; correct_answer: number }[]; }

export default function CccTests() {
    const { user } = useAuth();
    const [tests, setTests] = useState<CccTest[]>([]);

    useEffect(() => {
        let mounted = true;
        const fetchTests = async () => {
            try {
                const q = query(collection(db, 'tests'), where('category', '==', 'CCC'));
                const snap = await getDocs(q);
                if (!mounted) return;
                setTests(snap.docs.map(d => ({ id: d.id, ...d.data() } as CccTest)));
            } catch {
                // Silently ignore Firestore errors
            }
        };
        fetchTests();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="wallpaper-default min-h-screen">
            <header className="sticky top-0 z-20 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/ccc" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
                        <h1 className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-gaming)' }}>CCC TESTS</h1>
                    </div>
                    <Link href="/" className="text-gray-400 hover:text-white"><Home size={18} /></Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-6">
                {tests.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <Trophy size={32} className="mx-auto mb-3 text-yellow-400/50" />
                        <p className="text-sm mb-2">No CCC tests available yet</p>
                        <p className="text-[10px] text-gray-600">Ask your admin to create tests with category &quot;CCC&quot;</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {tests.map(test => (
                            <div key={test.id} className="glass-card rounded-2xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                                        <i className="ph-bold ph-certificate text-lg text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 id="testtitle" className="font-semibold text-white text-sm">{test.title}</h3>
                                        <span className="text-[9px] text-gray-400">{test.questions?.length || 0} questions</span>
                                    </div>
                                </div>
                                <Link href={`/test/${test.id}`}
                                    className="px-4 py-2 rounded-xl bg-yellow-500 text-black text-xs font-bold hover:bg-yellow-400 active:scale-95 transition-all flex items-center gap-1">
                                    <Play size={12} /> Start
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
