'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { 
    ArrowLeft, Home, BookOpen, LayoutDashboard, StickyNote, Code2, Brain, Keyboard as KBIcon, 
    Sparkles, Monitor, Cpu, Database, CheckCircle, Settings, Box, Layers, Zap, HardDrive, 
    Keyboard, Printer, Microchip, Clock, Power, History, TerminalSquare, Globe, ChevronRight, Menu, X, ArrowRight, Activity, Network
} from 'lucide-react';

/* ─── UI Components ─── */
function Sec({ id, title, icon, children }: { id: string; title: string; icon: ReactNode; children: ReactNode }) {
    return (
        <section id={id} className="rounded-[2rem] p-6 md:p-8 mb-8 scroll-mt-24 transition-all duration-300 hover:shadow-xl bg-white border border-slate-200/60 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform pointer-events-none" />
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 transform group-hover:scale-105 transition-transform">
                    {icon}
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-800">{title}</h2>
                    <div className="w-12 h-1 bg-blue-500 rounded-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
            <div className="text-[15px] leading-relaxed space-y-4 text-slate-600 font-medium relative z-10">
                {children}
            </div>
        </section>
    );
}

function IB({ type = 'tip', title, children }: { type?: 'tip' | 'note' | 'warning', title?: string, children: ReactNode }) {
    const s = { 
        tip: { bg: 'bg-emerald-50', bc: 'border-emerald-200', tc: 'text-emerald-800', hc: 'text-emerald-900', emoji: '💡' }, 
        note: { bg: 'bg-blue-50', bc: 'border-blue-200', tc: 'text-blue-800', hc: 'text-blue-900', emoji: '📝' }, 
        warning: { bg: 'bg-amber-50', bc: 'border-amber-200', tc: 'text-amber-800', hc: 'text-amber-900', emoji: '⚠️' } 
    };
    const st = s[type];
    return (
        <div className={`rounded-2xl p-5 my-5 \${st.bg} border \${st.bc} \${st.tc} shadow-sm`}>
            {title && <h4 className={`font-bold \${st.hc} mb-2 flex items-center gap-2 text-base`}><span>{st.emoji}</span> {title}</h4>}
            {!title && <span className="mr-2 float-left text-xl">{st.emoji}</span>}
            <div className="text-sm leading-relaxed">{children}</div>
        </div>
    );
}

function Def({ title, children }: { title: string, children: ReactNode }) {
    return (
        <div className="rounded-2xl p-6 my-5 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 shadow-xl relative overflow-hidden" style={{ color: '#e2e8f0' }}>
            <div className="absolute inset-0 bg-[url('/sample-assets/placeholder.svg')] opacity-10" />
            <h4 className="font-black mb-2 text-lg relative z-10 flex items-center gap-2" style={{ color: 'white' }}>
                <Sparkles size={18} className="text-blue-400" /> {title}
            </h4>
            <div className="text-sm leading-relaxed relative z-10 font-medium">{children}</div>
        </div>
    );
}

/* ─── Animated Components ─── */
function AnimatedCPU() {
    return (
        <div className="my-8 p-6 bg-slate-900 rounded-[2rem] border border-slate-700 shadow-2xl overflow-hidden relative">
            <h4 className="text-white font-bold mb-6 text-center">How CPU Processes Data (Animated Flow)</h4>
            
            <div className="flex flex-col md:flex-row items-center justify-between max-w-2xl mx-auto relative z-10 gap-4">
                
                {/* Input */}
                <div className="w-24 h-24 bg-indigo-500/20 border-2 border-indigo-500 rounded-2xl flex flex-col items-center justify-center text-indigo-400 animate-float">
                    <Keyboard size={28} className="mb-2" />
                    <span className="text-xs font-bold uppercase">Input</span>
                </div>

                {/* Data Flow Line 1 */}
                <div className="hidden md:flex flex-1 items-center justify-center relative h-8">
                    <svg className="w-full h-full" preserveAspectRatio="none">
                        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#6366f1" strokeWidth="2" strokeDasharray="6,6" className="data-flow-line" />
                        <circle cx="50%" cy="50%" r="4" fill="#8b5cf6" className="animate-pulse" />
                    </svg>
                </div>

                {/* Central Processing Unit */}
                <div className="w-48 p-4 bg-slate-800 border-2 border-cyan-500 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">CPU</div>
                    
                    <div className="space-y-3 mt-2">
                        <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-2 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-cyan-400 text-xs font-bold block">Control Unit (CU)</span>
                            <span className="text-slate-400 text-[9px]">Manages flow</span>
                        </div>
                        
                        <div className="flex justify-center">
                            <ArrowRight size={14} className="text-slate-500 rotate-90" />
                        </div>
                        
                        <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-2 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-emerald-400 text-xs font-bold block">ALU</span>
                            <span className="text-slate-400 text-[9px]">Calculates</span>
                        </div>

                        <div className="flex justify-center">
                            <ArrowRight size={14} className="text-slate-500 -rotate-90" />
                        </div>

                        <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-2 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-purple-300 text-xs font-bold block">Memory Unit (MU)</span>
                            <span className="text-slate-400 text-[9px]">Temporary Store</span>
                        </div>
                    </div>
                </div>

                {/* Data Flow Line 2 */}
                <div className="hidden md:flex flex-1 items-center justify-center relative h-8">
                    <svg className="w-full h-full" preserveAspectRatio="none">
                        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6,6" className="data-flow-line" />
                        <circle cx="50%" cy="50%" r="4" fill="#10b981" className="animate-pulse" />
                    </svg>
                </div>

                {/* Output */}
                <div className="w-24 h-24 bg-emerald-500/20 border-2 border-emerald-500 rounded-2xl flex flex-col items-center justify-center text-emerald-400 animate-float" style={{ animationDelay: '1s' }}>
                    <Monitor size={28} className="mb-2" />
                    <span className="text-xs font-bold uppercase">Output</span>
                </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full" />
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full" />
        </div>
    );
}

function AnimatedRAM() {
    return (
        <div className="my-8 p-6 bg-slate-50 border border-slate-200 rounded-[2rem] shadow-inner relative overflow-hidden">
            <h4 className="text-slate-800 font-bold mb-6 text-center">RAM vs ROM (Visual Concept)</h4>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto relative z-10">
                {/* RAM */}
                <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-100 relative group">
                    <div className="absolute top-3 right-3 flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Activity size={20} /></div>
                        <h5 className="font-bold text-slate-800">RAM (Volatile)</h5>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 h-12">Data continuously moves in and out while app is running. Clears when power is off.</p>
                    
                    <div className="h-24 bg-slate-900 rounded-xl relative overflow-hidden p-2 flex gap-2 items-end">
                        {/* Animated bars representing data loading/unloading */}
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex-1 bg-blue-500 rounded-sm w-full data-bar" style={{ animationDelay: `\${i * 0.2}s` }} />
                        ))}
                    </div>
                </div>

                {/* ROM */}
                <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-purple-100 relative group">
                    <div className="absolute top-3 right-3 flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                    </div>
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Database size={20} /></div>
                        <h5 className="font-bold text-slate-800">ROM (Non-Volatile)</h5>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 h-12">Data is permanently written during manufacturing. Keeps data even without power.</p>
                    
                    <div className="h-24 bg-slate-100 rounded-xl border-2 border-slate-200 relative overflow-hidden p-3 grid grid-cols-4 gap-2">
                        {/* Static blocks representing permanent data */}
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-slate-300 rounded shadow-sm flex items-center justify-center">
                                <span className="text-[8px] font-mono text-slate-600">01</span>
                            </div>
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MemoryTreeDiagram() {
    return (
        <div className="my-10 bg-slate-50 rounded-[2rem] border border-slate-200 p-8 overflow-x-auto shadow-inner relative hide-scrollbar">
            <h4 className="text-center font-black text-slate-700 mb-8 uppercase tracking-widest text-sm flex justify-center items-center gap-2">
                <Network size={18} className="text-blue-500" /> Memory Hierarchy
            </h4>
            
            <div className="min-w-[1000px] flex flex-col items-center pb-4">
                {/* Level 0: Root */}
                <div className="bg-slate-800 text-white font-black px-10 py-4 rounded-2xl shadow-lg border-2 border-slate-600 flex items-center gap-3 text-2xl z-10 relative">
                    <span className="text-3xl">🧠</span> MEMORY
                </div>
                
                {/* Connector L0 to L1 */}
                <div className="w-0.5 h-8 bg-slate-300"></div>
                
                {/* Level 1 Wrapper */}
                <div className="flex flex-col items-center">
                    <div className="w-[600px] border-t-2 border-slate-300"></div>
                    <div className="flex justify-between w-[600px]">
                        <div className="w-0.5 h-8 bg-slate-300"></div>
                        <div className="w-0.5 h-8 bg-slate-300"></div>
                    </div>
                    
                    {/* Level 1 Items */}
                    <div className="flex justify-between w-[900px]">
                        
                        {/* LEFT BRANCH: Primary */}
                        <div className="flex flex-col items-center w-[450px]">
                            <div className="bg-indigo-100 text-indigo-900 font-black px-6 py-3 rounded-xl shadow-sm border border-indigo-200 flex items-center gap-2 z-10 relative text-xl w-[240px] justify-center">
                                <span className="text-2xl">⚙️</span> Primary
                            </div>

                            <div className="w-0.5 h-8 bg-indigo-200"></div>
                            <div className="w-[260px] border-t-2 border-indigo-200"></div>
                            <div className="flex justify-between w-[260px]">
                                <div className="w-0.5 h-8 bg-indigo-200"></div>
                                <div className="w-0.5 h-8 bg-indigo-200"></div>
                            </div>

                            <div className="flex justify-between w-[360px]">
                                {/* CPU */}
                                <div className="flex flex-col items-center w-[160px]">
                                    <div className="bg-indigo-50 text-indigo-800 font-bold px-4 py-2 rounded border border-indigo-100 shadow-sm w-full text-center text-base flex flex-col items-center gap-1">
                                        <span className="text-2xl drop-shadow-sm">🔳</span> CPU
                                    </div>
                                    <div className="w-0.5 h-6 bg-indigo-100"></div>
                                    <div className="w-[100px] border-t-2 border-indigo-100"></div>
                                    <div className="flex justify-between w-[100px]">
                                        <div className="w-0.5 h-6 bg-indigo-100"></div>
                                        <div className="w-0.5 h-6 bg-indigo-100"></div>
                                    </div>
                                    <div className="flex justify-between w-[140px]">
                                        <div className="bg-white text-xs font-bold text-slate-600 px-3 py-1.5 rounded border border-slate-200 flex flex-col items-center"><span className="text-sm">🎛️</span> Cache</div>
                                        <div className="bg-white text-xs font-bold text-slate-600 px-3 py-1.5 rounded border border-slate-200 flex flex-col items-center"><span className="text-sm">🔢</span> Register</div>
                                    </div>
                                </div>

                                {/* Main */}
                                <div className="flex flex-col items-center w-[180px]">
                                    <div className="bg-indigo-50 text-indigo-800 font-bold px-4 py-2 rounded border border-indigo-100 shadow-sm w-full text-center text-base flex flex-col items-center gap-1">
                                        <span className="text-2xl drop-shadow-sm">🟩</span> Main
                                    </div>
                                    <div className="w-0.5 h-6 bg-indigo-100"></div>
                                    <div className="w-[120px] border-t-2 border-indigo-100"></div>
                                    <div className="flex justify-between w-[120px]">
                                        <div className="w-0.5 h-6 bg-indigo-100"></div>
                                        <div className="w-0.5 h-6 bg-indigo-100"></div>
                                    </div>
                                    <div className="flex justify-between w-[160px]">
                                        {/* RAM */}
                                        <div className="flex flex-col items-center w-[70px]">
                                            <div className="bg-blue-50 text-blue-800 text-xs font-bold px-2 py-1.5 rounded border border-blue-100 w-full text-center">RAM</div>
                                            <div className="w-0.5 h-4 bg-blue-100"></div>
                                            <div className="w-[50px] border-t border-blue-100"></div>
                                            <div className="flex justify-between w-[50px]">
                                                <div className="w-0.5 h-4 bg-blue-100"></div>
                                                <div className="w-0.5 h-4 bg-blue-100"></div>
                                            </div>
                                            <div className="flex justify-between w-[64px]">
                                                <div className="bg-white text-[10px] font-bold text-slate-500 px-1.5 py-1 rounded border border-slate-200">SRAM</div>
                                                <div className="bg-white text-[10px] font-bold text-slate-500 px-1.5 py-1 rounded border border-slate-200">DRAM</div>
                                            </div>
                                        </div>
                                        {/* ROM */}
                                        <div className="flex flex-col items-center w-[80px]">
                                            <div className="bg-purple-50 text-purple-800 text-xs font-bold px-2 py-1.5 rounded border border-purple-100 w-full text-center">ROM <span className="text-[10px]">🪲</span></div>
                                            <div className="w-0.5 h-4 bg-purple-100"></div>
                                            <div className="w-[60px] border-t border-purple-100"></div>
                                            <div className="flex justify-between w-[60px]">
                                                <div className="w-0.5 h-4 bg-purple-100"></div>
                                                <div className="w-0.5 h-4 bg-purple-100"></div>
                                                <div className="w-0.5 h-4 bg-purple-100"></div>
                                            </div>
                                            <div className="flex justify-between w-[86px]">
                                                <div className="bg-white text-[9px] font-bold text-slate-500 px-1 py-1 rounded border border-slate-200">PROM</div>
                                                <div className="bg-white text-[9px] font-bold text-slate-500 px-1 py-1 rounded border border-slate-200">EPROM</div>
                                                <div className="bg-white text-[9px] font-bold text-slate-500 px-1 py-1 rounded border border-slate-200">EEPROM</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT BRANCH: Secondary */}
                        <div className="flex flex-col items-center w-[400px]">
                            <div className="bg-emerald-100 text-emerald-900 font-black px-6 py-3 rounded-xl shadow-sm border border-emerald-200 flex items-center gap-2 z-10 relative text-xl w-[240px] justify-center">
                                <span className="text-2xl">🗄️</span> Secondary
                            </div>

                            <div className="w-0.5 h-8 bg-emerald-200"></div>
                            <div className="w-[240px] border-t-2 border-emerald-200"></div>
                            <div className="flex justify-between w-[240px]">
                                <div className="w-0.5 h-8 bg-emerald-200"></div>
                                <div className="w-0.5 h-8 bg-emerald-200"></div>
                            </div>

                            <div className="flex justify-between w-[320px]">
                                {/* Magnetic */}
                                <div className="flex flex-col items-center w-[150px]">
                                    <div className="bg-emerald-50 text-emerald-800 font-bold px-4 py-2 rounded border border-emerald-100 shadow-sm w-full text-center text-base">
                                        Magnetic
                                    </div>
                                    <div className="w-0.5 h-6 bg-emerald-100"></div>
                                    <div className="w-[90px] border-t-2 border-emerald-100"></div>
                                    <div className="flex justify-between w-[90px]">
                                        <div className="w-0.5 h-6 bg-emerald-100"></div>
                                        <div className="w-0.5 h-6 bg-emerald-100"></div>
                                    </div>
                                    <div className="flex justify-between w-[130px]">
                                        <div className="bg-white text-xs font-bold text-slate-600 px-2 py-1.5 rounded border border-slate-200 flex flex-col items-center"><span className="text-base">📼</span> Tape</div>
                                        <div className="bg-white text-xs font-bold text-slate-600 px-2 py-1.5 rounded border border-slate-200 flex flex-col items-center"><span className="text-base">💽</span> Disk</div>
                                    </div>
                                </div>

                                {/* Optical / Solid */}
                                <div className="flex flex-col items-center w-[150px]">
                                    <div className="bg-emerald-50 text-emerald-800 font-bold px-4 py-2 rounded border border-emerald-100 shadow-sm w-full text-center text-base">
                                        Optical / Flash
                                    </div>
                                    <div className="w-0.5 h-6 bg-emerald-100"></div>
                                    <div className="w-[90px] border-t-2 border-emerald-100"></div>
                                    <div className="flex justify-between w-[90px]">
                                        <div className="w-0.5 h-6 bg-emerald-100"></div>
                                        <div className="w-0.5 h-6 bg-emerald-100"></div>
                                    </div>
                                    <div className="flex justify-between w-[130px]">
                                        <div className="bg-white text-xs font-bold text-slate-600 px-2 py-1.5 rounded border border-slate-200 flex flex-col items-center"><span className="text-base">💿</span> CD/DVD</div>
                                        <div className="bg-white text-xs font-bold text-slate-600 px-2 py-1.5 rounded border border-slate-200 flex flex-col items-center"><span className="text-base">💾</span> USB/SSD</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Page ─── */
const tocItems = [
    { icon: <BookOpen size={14} />, label: 'Introduction', id: 'intro', color: '#3b82f6' },
    { icon: <Sparkles size={14} />, label: 'Characteristics', id: 'chars', color: '#8b5cf6' },
    { icon: <Box size={14} />, label: 'Types of Computers', id: 'types', color: '#10b981' },
    { icon: <Cpu size={14} />, label: 'CPU Components', id: 'cpu', color: '#06b6d4' },
    { icon: <Keyboard size={14} />, label: 'Input Devices', id: 'input', color: '#f59e0b' },
    { icon: <Monitor size={14} />, label: 'Output Devices', id: 'output', color: '#ef4444' },
    { icon: <Microchip size={14} />, label: 'Computer Memory', id: 'memory', color: '#6366f1' },
    { icon: <Code2 size={14} />, label: 'Hardware/Software', id: 'soft', color: '#14b8a6' },
    { icon: <History size={14} />, label: 'Generations', id: 'gen', color: '#f97316' },
    { icon: <Power size={14} />, label: 'Booting Process', id: 'boot', color: '#ec4899' },
];

export default function OLevelChapter1() {
    const [tocOpen, setTocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('intro');

    return (
        <div className="min-h-screen bg-[#f4f7f9] relative font-sans text-slate-800 selection:bg-blue-200">
            {/* Global CSS for Custom Animations */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                
                @keyframes data-flow {
                    from { stroke-dashoffset: 24; }
                    to { stroke-dashoffset: 0; }
                }
                .data-flow-line {
                    animation: data-flow 1s linear infinite;
                }
                
                @keyframes bar-bounce {
                    0%, 100% { height: 10%; }
                    50% { height: 90%; background-color: #60a5fa; }
                }
                .data-bar {
                    animation: bar-bounce 1.5s ease-in-out infinite;
                }

                html { scroll-behavior: smooth; }
            `}</style>

            {/* Background Decorative Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/5 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/sample-assets/placeholder.svg')] opacity-20 mix-blend-multiply" />
            </div>

            {/* Premium Navbar */}
            <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.03)' }}>
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/it-tools" className="flex items-center justify-center w-9 h-9 rounded-xl transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' }}>
                            <ArrowLeft size={16} className="text-white" />
                        </Link>
                        <div>
                            <h1 className="text-base font-black text-slate-800 tracking-tight">Introduction to Computer</h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Monitor size={10} className="text-blue-500" />
                                <span className="text-[9px] uppercase tracking-[0.2em] font-black text-blue-500">O-Level · M1-R5</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setTocOpen(!tocOpen)} className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                        {tocOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                <div className="h-[2px] w-full bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500" />
            </header>

            <div className="max-w-7xl mx-auto flex relative z-10 px-4 py-8 gap-8">
                
                {/* ─── Sticky TOC Sidebar ─── */}
                <aside className={`\${tocOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[76px] left-0 z-40 w-64 lg:w-60 xl:w-72 h-[calc(100vh-76px)] overflow-y-auto transition-transform duration-300 flex-shrink-0 bg-white/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-4 lg:p-0 border-r border-slate-200 lg:border-none shadow-2xl lg:shadow-none`}>
                    <div className="sticky top-0 bg-white lg:bg-transparent pb-4 z-10 mb-4 border-b border-slate-200/60 lg:border-none">
                        <div className="flex items-center gap-2 px-2">
                            <BookOpen size={16} className="text-slate-600" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Chapter Index</h3>
                        </div>
                    </div>
                    <nav className="space-y-1 relative">
                        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-200" />
                        {tocItems.map(item => (
                            <a 
                                key={item.id} 
                                href={`#${item.id}`} 
                                onClick={() => { setActiveSection(item.id); setTocOpen(false); }}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all relative z-10"
                                style={{ 
                                    background: activeSection === item.id ? `\${item.color}15` : 'transparent', 
                                    color: activeSection === item.id ? item.color : '#64748b' 
                                }}
                            >
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors" style={{ background: activeSection === item.id ? item.color : '#f1f5f9', color: activeSection === item.id ? '#fff' : '#475569' }}>
                                    {item.icon}
                                </div>
                                {item.label}
                                {activeSection === item.id && <div className="w-1.5 h-1.5 rounded-full ml-auto" style={{ background: item.color }} />}
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* Mobile TOC Overlay */}
                {tocOpen && <div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setTocOpen(false)} />}

                {/* ─── Main Content Area ─── */}
                <main className="flex-1 min-w-0">
                    
                    {/* Premium Hero */}
                    <section className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 shadow-2xl shadow-blue-900/20 p-8 md:p-14 text-white border border-white/10 mb-10">
                        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-500/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-cyan-500/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
                        
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest mb-6 shadow-inner" style={{ color: '#bfdbfe' }}>
                                <Sparkles size={14} className="text-cyan-300 animate-pulse" /> Detailed Notes
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-200">
                                Introduction to<br/>Computer Systems
                            </h2>
                            <p className="text-blue-100/80 text-sm md:text-lg max-w-2xl leading-relaxed mb-10 font-medium">
                                In-depth Hinglish notes explaining computer fundamentals, architecture, memory hierarchies, I/O devices, and the entire evolution of computers. Crafted for complete beginners.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 border border-blue-400 text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]" style={{ color: 'white' }}>
                                    <BookOpen size={16} /> Start Reading
                                </div>
                                <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-sm font-bold shadow-sm hover:bg-white/20 transition-colors cursor-pointer" style={{ color: 'white' }}>
                                    <CheckCircle size={16} className="text-emerald-400" /> Syllabus Covered
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 1: Intro */}
                    <Sec id="intro" title="1. What is a Computer?" icon={<Monitor size={24} />}>
                        <Def title="Definition">
                            <span className="font-bold bg-blue-500/20 px-1 rounded" style={{ color: 'white' }}>Computer</span> ek electronic data processing device hai. Yeh user se raw data ko input ke roop mein accept karta hai, us par specified instructions (programs) ke hisab se processing karta hai, aur finally ek meaningful information (output) provide karta hai.
                        </Def>
                        <p>
                            Word <strong>"Computer"</strong> Latin bhasha ke word <strong>"Computare"</strong> se bana hai, jiska matlab hota hai <strong>"To Calculate"</strong> (ganana karna). Halanki, aaj ke computers sirf calculation tak hi seemit nahi hain, wo graphics, logic, AI, aur complex data analysis bhi kar sakte hain.
                        </p>
                        <IB type="note" title="Basic Workflow">
                            Computer ka basic workflow <strong>IPO Cycle (Input-Process-Output)</strong> par based hota hai. Data enter hota hai, CPU usko process karta hai, aur Screen/Printer par output milta hai.
                        </IB>
                    </Sec>

                    {/* Section 2: Characteristics */}
                    <Sec id="chars" title="2. Characteristics of Computer" icon={<Sparkles size={24} />}>
                        <p className="mb-4">Computer apni incredible capabilities ki wajah se har field mein use hota hai. Iski mukhya visheshtayen (characteristics) is prakar hain:</p>
                        
                        <div className="grid md:grid-cols-2 gap-5 mt-6">
                            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100/50 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3"><Zap size={20} /></div>
                                <h4 className="font-bold text-amber-900 mb-2">1. Speed (Gati)</h4>
                                <p className="text-sm text-amber-800">Computer millions of instructions per second (MIPS) execute kar sakta hai. Jo calculation insaan ko mahino lag sakte hain, computer usay microseconds mein kar deta hai.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100/50 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3"><CheckCircle size={20} /></div>
                                <h4 className="font-bold text-emerald-900 mb-2">2. Accuracy (Shuddhata)</h4>
                                <p className="text-sm text-emerald-800/80">Computer 100% accurate results deta hai. Galtiyan (Errors) generally tabhi hoti hain jab human dwara input ya instructions galat diye gaye ho (GIGO - Garbage In Garbage Out).</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100/50 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3"><Database size={20} /></div>
                                <h4 className="font-bold text-blue-900 mb-2">3. Storage (Bhandaran)</h4>
                                <p className="text-sm text-blue-800/80">Computer huge amounts of data ko permanently store kar sakta hai, aur usay saalon baad bhi microseconds mein wapas retrieve kar sakta hai.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100/50 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3"><Layers size={20} /></div>
                                <h4 className="font-bold text-purple-900 mb-2">4. Versatility (Vividhta)</h4>
                                <p className="text-sm text-purple-800/80">Ek hi computer alag-alag tarah ke tasks perform kar sakta hai — jaise music sunna, document type karna, game khelna aur internet browsing karna.</p>
                            </div>
                        </div>
                        <IB type="tip" title="Diligence & Automation">
                            Insano ki tarah computer thakta nahi hai (No Fatigue / Diligence). Wo lagatar bina ruke, bina concentration loose kiye automation ke saath ghanto tak same speed se kaam kar sakta hai.
                        </IB>
                    </Sec>

                    {/* Section 3: Types */}
                    <Sec id="types" title="3. Classification of Computers" icon={<Box size={24} />}>
                        <p>Karya pranali (Working principle) aur aakar (size) ke aadhar par computers ko mainly 3 parts mein divide kiya gaya hai.</p>
                        
                        <div className="my-6 space-y-6">
                            {/* Analog */}
                            <div className="p-6 rounded-[2rem] bg-orange-50/50 border border-orange-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/50 rounded-bl-full group-hover:scale-125 transition-transform" />
                                <h3 className="text-xl font-black text-orange-900 mb-3 flex items-center gap-3">
                                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-lg text-sm">Type 1</span> Analog Computer
                                </h3>
                                <p className="text-orange-900/80 leading-relaxed max-w-2xl">
                                    Ye computers physical quantities (jaise temperature, pressure, speed, voltage) ko mapne ke liye use hote hain. Inka data continuous hota hai. Result graphs ya meter format mein milta hai.
                                    <strong className="block mt-2 text-orange-900 bg-orange-100/50 px-3 py-2 rounded-xl border border-orange-200/50 w-max">Examples: Speedometer, Thermometer, Voltmeter.</strong>
                                </p>
                            </div>

                            {/* Digital */}
                            <div className="p-6 rounded-[2rem] bg-blue-50/50 border border-blue-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/50 rounded-bl-full group-hover:scale-125 transition-transform" />
                                <h3 className="text-xl font-black text-blue-900 mb-3 flex items-center gap-3">
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm">Type 2</span> Digital Computer
                                </h3>
                                <p className="text-blue-900/80 leading-relaxed mb-6">
                                    Aajkal hum jo computer use karte hain wo digital hain. Ye data ko discrete form (0 aur 1 / binary) mein process karte hain. Inki speed aur accuracy analog se bahut jyada hoti hai. Inhe size aur power ke hisab se 4 bhago mein divide kiya gaya hai:
                                </p>
                                
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-50 hover:border-blue-200 transition-colors">
                                        <h4 className="font-bold text-blue-700 mb-1">i. Micro Computer</h4>
                                        <p className="text-xs text-slate-600">Sabse chote computers jisme ek microprocessor hota hai. Ise Personal Computer (PC) bhi kehte hain.<br/><strong className="text-slate-800">Ex: Laptops, Tablets, Smartphones.</strong></p>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-50 hover:border-blue-200 transition-colors">
                                        <h4 className="font-bold text-indigo-700 mb-1">ii. Mini Computer</h4>
                                        <p className="text-xs text-slate-600">Micro se bade aur fast. Ye ek time pe multiple users ko support karte hain. Mid-range servers mein use hote hain.</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-50 hover:border-blue-200 transition-colors">
                                        <h4 className="font-bold text-purple-700 mb-1">iii. Mainframe Computer</h4>
                                        <p className="text-xs text-slate-600">Bahut bade aur powerful. Hazarro users ek sath data process kar sakte hain. Bank aur badi companies inhien as a central server use karti hain.</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-50 hover:border-blue-200 transition-colors relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-10 h-10 bg-red-100 rounded-bl-full" />
                                        <h4 className="font-bold text-rose-600 mb-1">iv. Super Computer</h4>
                                        <p className="text-xs text-slate-600">Duniya ke sabse fast aur expensive computers. Trillions of calculations per second karte hain. Weather forecasting aur space research mein use hote hain.<br/><strong className="text-rose-700 bg-rose-50 px-2 rounded block mt-1 w-max border border-rose-100">India: PARAM, Pratyush</strong></p>
                                    </div>
                                </div>
                            </div>

                            {/* Hybrid */}
                            <div className="p-6 rounded-[2rem] bg-teal-50/50 border border-teal-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-200/50 rounded-bl-full group-hover:scale-125 transition-transform" />
                                <h3 className="text-xl font-black text-teal-900 mb-3 flex items-center gap-3">
                                    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-lg text-sm">Type 3</span> Hybrid Computer
                                </h3>
                                <p className="text-teal-900/80 leading-relaxed max-w-2xl">
                                    Ye computers <strong>Analog + Digital</strong> dono ki qualities se milkar bante hain. Ye analog signals ko accept karke unhe digital mein convert kar dete hain taaki processing aur display aasan ho.
                                    <strong className="block mt-2 text-teal-900 bg-teal-100/50 px-3 py-2 rounded-xl border border-teal-200/50 w-max">Examples: ECG Machine (Hospitals), Petrol Pump Machines.</strong>
                                </p>
                            </div>
                        </div>
                    </Sec>

                    {/* Section 4: CPU */}
                    <Sec id="cpu" title="4. CPU (Central Processing Unit)" icon={<Cpu size={24} />}>
                        <p>CPU ko computer ka <strong>Brain (Dimaag)</strong> ya <strong>Heart</strong> kaha jata hai. Computer ki sari main calculations, logic aur flow control CPU ke dwara hi hota hai. Isko microprocessor bhi kehte hain.</p>
                        
                        {/* Interactive Animated CPU Component */}
                        <AnimatedCPU />

                        <div className="grid md:grid-cols-3 gap-5 mt-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-t-4 border-t-cyan-500">
                                <h4 className="font-bold text-cyan-700 text-lg mb-2">1. Control Unit (CU)</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Computer ka "Manager". Ye khud calculation nahi karta, balki memory se instructions lata hai (fetch), unko decode karta hai, aur baaki components (ALU, I/O devices) ko command deta hai ki kya karna hai.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-t-4 border-t-emerald-500">
                                <h4 className="font-bold text-emerald-700 text-lg mb-2">2. ALU</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    <strong>Arithmetic Logic Unit.</strong> Actual calculations yahi hoti hain.<br/>
                                    - <span className="font-semibold text-slate-700">Arithmetic:</span> (+, -, *, /)<br/>
                                    - <span className="font-semibold text-slate-700">Logic:</span> (&gt;, &lt;, ==, AND, OR) decisions lena.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-t-4 border-t-purple-500">
                                <h4 className="font-bold text-purple-600 text-lg mb-2">3. Memory Unit (MU)</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Isay Registers bhi kehte hain. Jab ALU processing kar raha hota hai, toh us waqt current data aur instructions ko temporary store karne ke liye CPU ke andar apni ek ultra-fast memory hoti hai jise MU kehte hain.
                                </p>
                            </div>
                        </div>
                    </Sec>

                    {/* Section 5: Input Devices */}
                    <Sec id="input" title="5. Input Devices" icon={<Keyboard size={24} />}>
                        <p className="mb-6">Computer ko data, signals, ya instructions bhejne ke liye jin hardware devices ka use hota hai unhe Input Devices kehte hain. Ye human-readable data ko machine-readable form (0,1) mein convert karte hain.</p>
                        
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {[
                                { name: 'Keyboard', icon: '⌨️', desc: 'Sabse common input device. Text, numbers aur special characters type karne ke liye use hota hai. (QWERTY layout)' },
                                { name: 'Mouse', icon: '🖱️', desc: 'Ek Pointing device jiska use screen par cursor ko control karne, select karne aur drag-and-drop ke liye hota hai. (Wired & Wireless)' },
                                { name: 'Scanner', icon: '🖨️', desc: 'Hard copy (paper documents/photos) ko scan karke digital soft copy (image/PDF) mein computer mein store karta hai.' },
                                { name: 'Touch Screen', icon: '📱', desc: 'Display jisme microwaves ka grid hota hai. Ungli touch karne se signal break hota hai aur position detect ho jati hai.' },
                                { name: 'Trackball', icon: '🎱', desc: 'Mouse ka alternative jisme ek ball upar hoti hai. Device ko bina hilaye sirf ball ghumakar cursor move karte hain.' },
                                { name: 'Joystick', icon: '🕹️', desc: 'Ek stick device jiska mainly use Video Games khelne ya flight simulators mein direction control karne ke liye hota hai.' },
                                { name: 'Light Pen', icon: '🖊️', desc: 'Ek light-sensitive pen jiska use directly CRT monitor par draw karne ya menu options select karne ke liye hota tha.' },
                                { name: 'OMR', icon: '📝', desc: 'Optical Mark Reader. Competitive exams ki MCQ OMR answer sheets par pencil/pen ke black marks ko read karta hai.' },
                                { name: 'OCR', icon: 'Aa', desc: 'Optical Character Recognition. Printed ya handwritten text ko scan karke editable digital text mein convert karta hai.' },
                                { name: 'MICR', icon: '🏦', desc: 'Magnetic Ink Character Recognition. Banks mein checks ke bottom pe magnetic ink se chhape specific numbers ko fast read karta hai.' },
                                { name: 'BCR', icon: '🛒', desc: 'Barcode Reader. Products par bane black & white vertical lines (barcode) ko laser se read karke product ki details fetch karta hai.' },
                                { name: 'Microphone/Webcam', icon: '🎤', desc: 'Audio ko record karke voice input lene ke liye mic, aur video/photos capture karne ke liye webcam use hota hai.' }
                            ].map((item, i) => (
                                <div key={i} className="break-inside-avoid bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                                    <h4 className="font-bold text-slate-800 text-base mb-2 flex items-center gap-2">
                                        <span className="text-xl bg-slate-50 w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">{item.icon}</span> 
                                        {item.name}
                                    </h4>
                                    <p className="text-sm text-slate-600 font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </Sec>

                    {/* Section 6: Output Devices */}
                    <Sec id="output" title="6. Output Devices" icon={<Monitor size={24} />}>
                        <p className="mb-6">Processed data (Result) ko user tak pahunchane ke liye Output Devices ka use hota hai. Ye machine-readable data (0,1) ko human-readable (Text, Audio, Video, Graphics) mein convert karte hain. Output do types ke hote hain: <strong>Soft Copy (Screen/Speaker)</strong> aur <strong>Hard Copy (Printer/Plotter)</strong>.</p>
                        
                        <h3 className="text-xl font-black text-slate-800 mt-8 mb-4 flex items-center gap-2"><Monitor className="text-blue-500" /> VDU (Visual Display Unit / Monitor)</h3>
                        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-8">
                            <p className="text-sm text-blue-900 mb-4 font-medium">Monitor computer ka primary soft-copy output device hai. Important terms:</p>
                            <ul className="grid md:grid-cols-2 gap-4 text-sm text-blue-800 font-medium mb-6">
                                <li className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm"><strong className="text-blue-900 block mb-1">Resolution:</strong> Monitor par screen chote-chote dots se milkar banti hai jinhe <strong>Pixels</strong> kehte hain. Screen par total pixels ki ginti ko resolution kehte hain. (More pixels = Better quality).</li>
                                <li className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm"><strong className="text-blue-900 block mb-1">Refresh Rate:</strong> Ek second mein monitor apni screen ko kitni baar refresh (redraw) karta hai. Isay Hertz (Hz) mein mapte hain. (Normal: 60Hz).</li>
                            </ul>
                            <div className="flex flex-wrap gap-2">
                                {['CRT (Cathode Ray Tube) - Purane TV jaise mote', 'LCD (Liquid Crystal Display)', 'LED (Light Emitting Diode)', 'AMOLED (Active Matrix OLED - Best quality)'].map((type, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold border border-blue-200">{type}</span>
                                ))}
                            </div>
                        </div>

                        <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2"><Printer className="text-rose-500" /> Printers (Hard Copy)</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 transition-colors shadow-sm">
                                <h4 className="font-bold text-rose-700 text-lg mb-3 flex items-center gap-2"><span className="w-2 h-2 bg-rose-500 rounded-full" /> Impact Printers</h4>
                                <p className="text-sm text-slate-600 mb-4 font-medium">Ye typewriters ki tarah kaam karte hain. Isme ek hammer (pin) ribbon par strike karke paper par physical contact banakar print karta hai. Ye awaaz (noise) jyada karte hain aur inki print quality low hoti hai.</p>
                                <div className="space-y-2">
                                    <div className="bg-slate-50 p-2 rounded-lg text-sm border border-slate-100"><strong className="text-slate-800">Dot Matrix Printer:</strong> Pins ki matrix se dots banakar character print karta hai. (Use: Railway tickets, Bills).</div>
                                    <div className="bg-slate-50 p-2 rounded-lg text-sm border border-slate-100"><strong className="text-slate-800">Daisy Wheel Printer:</strong> Daisy flower ke aakar ka wheel hota hai jisme alphabets ubhre hote hain.</div>
                                    <div className="bg-slate-50 p-2 rounded-lg text-sm border border-slate-100"><strong className="text-slate-800">Line Printers:</strong> Ek baar mein puri ek line print karte hain (Chain Printer, Drum Printer).</div>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors shadow-sm">
                                <h4 className="font-bold text-emerald-700 text-lg mb-3 flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full" /> Non-Impact Printers</h4>
                                <p className="text-sm text-slate-600 mb-4 font-medium">Inme paper aur print head ka physical contact nahi hota. Ye laser, ink spray, ya heat technology use karte hain. Ye fast hote hain aur awaaz nahi karte. Quality high hoti hai.</p>
                                <div className="space-y-2">
                                    <div className="bg-slate-50 p-2 rounded-lg text-sm border border-slate-100"><strong className="text-slate-800">Inkjet Printer:</strong> Liquid ink ko spray karke paper par image banata hai. Photos print karne ke liye accha hai.</div>
                                    <div className="bg-slate-50 p-2 rounded-lg text-sm border border-slate-100"><strong className="text-slate-800">Laser Printer:</strong> Laser beam aur dry ink (toner) ka use karke high-speed aur best quality text print karta hai.</div>
                                    <div className="bg-slate-50 p-2 rounded-lg text-sm border border-slate-100"><strong className="text-slate-800">Thermal Printer:</strong> Heat-sensitive paper par heat ka use karke print karta hai. (Use: ATM, POS receipt).</div>
                                    <div className="bg-slate-50 p-2 rounded-lg text-sm border border-slate-100"><strong className="text-slate-800">Plotter:</strong> Bade-bade posters, banners aur CAD engineering drawings high quality mein print karta hai.</div>
                                </div>
                            </div>
                        </div>
                    </Sec>

                    {/* Section 7: Memory */}
                    <Sec id="memory" title="7. Computer Memory" icon={<Microchip size={24} />}>
                        <p className="mb-6">Computer memory bilkul human brain ki tarah hoti hai jiska use data aur instructions ko store karne ke liye kiya jata hai. Ye Storage Space hai. Computer memory ko mukhya roop se 2 parts mein divide kiya gaya hai:</p>
                        
                        <MemoryTreeDiagram />

                        {/* Animated Visual For RAM vs ROM */}
                        <AnimatedRAM />

                        <div className="space-y-8 mt-10">
                            {/* Primary Memory */}
                            <div className="p-6 md:p-8 rounded-[2rem] bg-indigo-50/40 border border-indigo-100">
                                <h3 className="text-2xl font-black text-indigo-900 mb-6 flex items-center gap-2">1. Primary Memory (Main Memory)</h3>
                                <p className="text-sm text-indigo-800/80 mb-6 font-medium">Ise internal memory bhi kehte hain. Yeh sidhe CPU ke contact mein rehti hai. Iski speed secondary storage se bahut fast hoti hai but storage space kam hoti hai.</p>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* RAM */}
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-50">
                                        <h4 className="font-bold text-blue-600 text-lg mb-2">RAM (Random Access Memory)</h4>
                                        <p className="text-xs text-slate-600 mb-4 font-medium leading-relaxed">
                                            Yah ek <strong>Volatile</strong> (Temporary) memory hai. Computer ON rehne tak hi data rakhti hai. Jo bhi software/app hum open karte hain, wo chalne ke liye pehle hard disk se RAM mein load hota hai.
                                        </p>
                                        <div className="space-y-2 text-xs">
                                            <div className="p-2 bg-blue-50 text-blue-800 rounded-lg"><strong className="block mb-0.5">SRAM (Static RAM):</strong> Fast aur expensive hoti hai. Ise baar-baar refresh karne ki jarurat nahi padti. (Mainly used in Cache).</div>
                                            <div className="p-2 bg-blue-50 text-blue-800 rounded-lg"><strong className="block mb-0.5">DRAM (Dynamic RAM):</strong> SRAM se slow. Iska data lagatar millisecond mein refresh hona chahiye warna data lost ho jayega. (Normal PC RAM - DDR3, DDR4, DDR5).</div>
                                        </div>
                                    </div>
                                    
                                    {/* ROM */}
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-50">
                                        <h4 className="font-bold text-purple-600 text-lg mb-2">ROM (Read Only Memory)</h4>
                                        <p className="text-xs text-slate-600 mb-4 font-medium leading-relaxed">
                                            Yah ek <strong>Non-Volatile</strong> (Permanent) memory hai. Light jane ke baad bhi data delete nahi hota. Isme computer start (boot) karne wale BIOS programs pre-installed hote hain.
                                        </p>
                                        <div className="space-y-2 text-xs">
                                            <div className="p-2 bg-purple-50 text-purple-800 rounded-lg"><strong className="block mb-0.5">PROM:</strong> Programmable ROM. Sirf ek baar program likha ja sakta hai.</div>
                                            <div className="p-2 bg-purple-50 text-purple-800 rounded-lg"><strong className="block mb-0.5">EPROM:</strong> Erasable PROM. Ultraviolet (UV) rays ki madad se data erase karke naya program daal sakte hain.</div>
                                            <div className="p-2 bg-purple-50 text-purple-800 rounded-lg"><strong className="block mb-0.5">EEPROM:</strong> Electrically Erasable PROM. Electronic signals se easily erase kar sakte hain. (Pen drives esi par based hain).</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <IB type="tip" title="What is Cache Memory?">
                                    Cache (pronounced "Cash") CPU aur RAM ke beech ki sabse fast memory hoti hai. Jo instructions ya files CPU ko baar-baar chahiye hoti hain, wo RAM se uthakar Cache mein rakh li jati hain taaki processing speed ultra-fast ho jaye.
                                </IB>
                            </div>

                            {/* Secondary Memory */}
                            <div className="p-6 md:p-8 rounded-[2rem] bg-emerald-50/40 border border-emerald-100">
                                <h3 className="text-2xl font-black text-emerald-900 mb-6 flex items-center gap-2">2. Secondary Memory (Auxiliary)</h3>
                                <p className="text-sm text-emerald-800/80 mb-6 font-medium">Ise External memory bhi kehte hain. Yeh data, files, videos aadi ko permanently save karne ke liye use hoti hai. Iski capacity TeraBytes (TB) mein hoti hai but speed slow hoti hai.</p>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Magnetic */}
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50">
                                        <h4 className="font-bold text-emerald-700 text-base mb-3 flex items-center gap-2"><Database size={16} /> Magnetic Storage</h4>
                                        <div className="space-y-3">
                                            <div className="text-sm text-slate-700 font-medium">
                                                <strong className="block text-slate-800 mb-1">Magnetic Tape:</strong> Purane cassette recorders jaisi black ribbon hoti thi jispar magnetic dot bankar data sequential format (line-by-line) mein store hota tha.
                                            </div>
                                            <div className="text-sm text-slate-700 font-medium border-t border-slate-100 pt-3">
                                                <strong className="block text-slate-800 mb-1">Floppy Disk:</strong> 1972 IBM dwara banayi gayi. Iski storage maximum 1.44MB ya 2MB hoti thi.
                                            </div>
                                            <div className="text-sm text-slate-700 font-medium border-t border-slate-100 pt-3">
                                                <strong className="block text-slate-800 mb-1">Hard Disk Drive (HDD):</strong> Isme circular hard metal ke disk (platters) hote hain jo motor se ghumte hain. In par data tracks aur sectors mein divided hokar store hota hai. Aajkal SSD (Solid State Drive) isko replace kar rahi hain kyunki SSD mein ghumne wala koi part nahi hota.
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Optical */}
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50">
                                        <h4 className="font-bold text-emerald-700 text-base mb-3 flex items-center gap-2"><div className="w-4 h-4 rounded-full border-[3px] border-emerald-700" /> Optical Storage</h4>
                                        <p className="text-xs text-slate-500 mb-3 font-medium">Inme Laser Beam technology ka use karke data read/write kiya jata hai. Disc ke upar microscoping pits (gadhe) banaye jate hain.</p>
                                        <div className="space-y-3">
                                            <div className="text-sm text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <strong className="text-slate-900 block">CD (Compact Disc):</strong> Maximum storage capacity 700 MB hoti hai.
                                            </div>
                                            <div className="text-sm text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <strong className="text-slate-900 block">DVD (Digital Versatile Disc):</strong> CD jaisi hi dikhti hai but high density storage hoti hai. Capacity: 4.7 GB se 17 GB tak.
                                            </div>
                                            <div className="text-sm text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <strong className="text-slate-900 block">Blu-Ray Disc (High Definition):</strong> Isme blue-violet laser ka use hota hai. High Quality 4K movies aur data store karne ke liye. Capacity: 25 GB se 50 GB tak.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Sec>

                    {/* Section 8: Hardware & Software */}
                    <Sec id="soft" title="8. Hardware vs Software" icon={<Code2 size={24} />}>
                        <p className="mb-6">Ek complete computer system mukhyatah do components se milkar banta hai: Hardware aur Software. Ek ke bina dusra bekar hai.</p>
                        
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-6 rounded-3xl border border-slate-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Cpu size={100} /></div>
                                <h3 className="text-2xl font-black text-slate-800 mb-3 relative z-10">Hardware</h3>
                                <p className="text-slate-600 font-medium text-sm leading-relaxed relative z-10">
                                    Computer ke wo sabhi physical parts (jinki physics existence hai) jinhe hum dekh sakte hain aur choo (touch) sakte hain, unhe Hardware kehte hain. Hardware tab tak kaam nahi kar sakta jab tak usay chalane wala software na ho.
                                    <br/><br/>
                                    <strong className="text-slate-800 block">Examples:</strong> Keyboard, Mouse, Monitor, Motherboard, RAM, Hard Disk.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-cyan-50 to-blue-100 p-6 rounded-3xl border border-blue-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Code2 size={100} /></div>
                                <h3 className="text-2xl font-black text-blue-900 mb-3 relative z-10">Software</h3>
                                <p className="text-blue-800/80 font-medium text-sm leading-relaxed relative z-10">
                                    Computer ko di jane wali instructions aur programs ke set ko Software kehte hain. Ise hum sirf dekh aur run kar sakte hain, physically touch nahi kar sakte. Ye Hardware ko command deta hai ki "kya karna hai aur kaise karna hai".
                                </p>
                            </div>
                        </div>

                        <h4 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Types of Software</h4>
                        <div className="grid sm:grid-cols-3 gap-4 mb-8">
                            <div className="p-5 rounded-2xl border border-teal-200 bg-teal-50">
                                <h5 className="font-bold text-teal-900 mb-2">1. System Software</h5>
                                <p className="text-xs text-teal-800 font-medium">Yeh software computer ke background operation ko manage aur control karta hai. Iske bina computer start hi nahi hoga.<br/><br/><strong className="text-teal-900 bg-teal-100 px-2 py-1 rounded">Ex: Operating System (Windows, Linux, Android), Device Drivers.</strong></p>
                            </div>
                            <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50">
                                <h5 className="font-bold text-indigo-900 mb-2">2. Application Software</h5>
                                <p className="text-xs text-indigo-800 font-medium">Yeh users ki special needs (specific tasks) ko pura karne ke liye banaye jate hain. System inke bina bhi chal sakta hai.<br/><br/><strong className="text-indigo-900 bg-indigo-100 px-2 py-1 rounded">Ex: MS Word, WhatsApp, Chrome Browser, Photoshop.</strong></p>
                            </div>
                            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50">
                                <h5 className="font-bold text-emerald-900 mb-2">3. Utility Software</h5>
                                <p className="text-xs text-emerald-800 font-medium">Inhe service programs bhi kehte hain. Ye computer ki maintenance, security aur smooth running mein help karte hain.<br/><br/><strong className="text-emerald-900 bg-emerald-100 px-2 py-1 rounded">Ex: Antivirus, Disk Defragmenter, File Manager, Backup tools.</strong></p>
                            </div>
                        </div>

                        <h4 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Software Distribution (Availability) Models</h4>
                        <ul className="space-y-3">
                            <li className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-xl transition-colors">
                                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded w-32 shrink-0 text-center">Open Source</span>
                                <p className="text-sm text-slate-600 font-medium">Yeh software puri tarah free hote hain aur inka "Source Code" (jis code se ye bane hain) publically available hota hai jise koi bhi modify kar sakta hai. <strong className="text-slate-800 ml-1">Ex: Linux OS, Python, Mozilla Firefox, VLC Player.</strong></p>
                            </li>
                            <li className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-xl transition-colors">
                                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded w-32 shrink-0 text-center">Proprietary</span>
                                <p className="text-sm text-slate-600 font-medium">Inhe Closed-Source software bhi kehte hain. Inhe use karne ke liye license purchase karna padta hai aur inka source code hidden hota hai. <strong className="text-slate-800 ml-1">Ex: Microsoft Windows, MS Office, Adobe Premiere Pro.</strong></p>
                            </li>
                            <li className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-xl transition-colors">
                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded w-32 shrink-0 text-center">Freeware</span>
                                <p className="text-sm text-slate-600 font-medium">Yeh software use karne ke liye bilkul free hote hain, lekin inka source code user ko nahi milta, yaani aap inhe modify nahi kar sakte. <strong className="text-slate-800 ml-1">Ex: Google Chrome, Adobe Reader, Skype.</strong></p>
                            </li>
                        </ul>
                    </Sec>

                    {/* Section 9: Generations */}
                    <Sec id="gen" title="9. Development & Generations" icon={<History size={24} />}>
                        <p className="mb-6">Computer ki history lagbhag 2500-3000 saal purani hai. Aaj ka smart computer achanak nahi bana, yeh kayi inventions aur peedhiyon (Generations) ke kramagat vikas ka nateeja hai.</p>
                        
                        <div className="mb-8">
                            <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock className="text-amber-500" /> Early Historical Devices</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl">
                                    <h5 className="font-bold text-amber-900 mb-2 border-b border-amber-200/50 pb-1">Abacus</h5>
                                    <p className="text-xs text-amber-800 font-medium leading-relaxed">Duniya ka sabse pehla calculation device. China mein lagbhag 3000 saal pehle invent hua. Isey 16th century mein Lee Kai Chen ne aur sudhara. Yeh frame mein lage motiyon (beads) ko sarakar addition/subtraction ke liye use hota tha.</p>
                                </div>
                                <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl">
                                    <h5 className="font-bold text-amber-900 mb-2 border-b border-amber-200/50 pb-1">Pascaline (Adding Machine)</h5>
                                    <p className="text-xs text-amber-800 font-medium leading-relaxed">France ke mahan scientist Blaise Pascal ne 1642 mein pehla mechanical calculator banaya. Isey gears aur wheels par design kiya gaya tha jo directly + aur - kar sakta tha.</p>
                                </div>
                                <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl relative overflow-hidden">
                                    <div className="absolute -right-4 -bottom-4 opacity-10"><Settings size={80} /></div>
                                    <h5 className="font-bold text-amber-900 mb-2 border-b border-amber-200/50 pb-1 relative z-10">Difference Engine</h5>
                                    <p className="text-xs text-amber-800 font-medium leading-relaxed relative z-10">1822 mein <strong className="text-amber-900">Charles Babbage</strong> ne isey banaya. Yeh duniya ka pehla programmable machine tha. Isi wajah se Charles Babbage ko <strong>"Father of Computer"</strong> (Computer ke pitamah) kaha jata hai.</p>
                                </div>
                            </div>
                        </div>

                        <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Layers className="text-indigo-500" /> 5 Generations of Computer</h4>
                        <div className="space-y-4">
                            {[
                                { 
                                    gen: '1st Generation', years: '1946-1959', 
                                    tech: 'Vacuum Tubes', lang: 'Machine Language (0,1)', input: 'Punch Cards, Paper Tapes',
                                    desc: 'Bahut bade (kamre jitne), bahut heat generate karte the aur slow the. AC ki jarurat hoti thi.', 
                                    ex: 'ENIAC, EDVAC, UNIVAC, IBM-701, IBM-650' 
                                },
                                { 
                                    gen: '2nd Generation', years: '1959-1965', 
                                    tech: 'Transistors', lang: 'Assembly, COBOL, FORTRAN', input: 'Punch Cards, Magnetic Tapes',
                                    desc: 'Vacuum tube ki jagah Transistors ka use. Size chota hua aur speed/reliability badhi.', 
                                    ex: 'IBM 1620, IBM 7094, CDC 1604, UNIVAC 1108' 
                                },
                                { 
                                    gen: '3rd Generation', years: '1965-1971', 
                                    tech: 'IC (Integrated Circuits)', lang: 'FORTRAN II, COBOL, PASCAL, BASIC', input: 'Keyboard, Monitor (First time)',
                                    desc: 'Jack Kilby ne 1958 mein IC (Silicon chip) ka aavishkar kiya jisme hazarro transistors lag gaye. OS introduced hua.', 
                                    ex: 'IBM-360 series, PDP (Personal Data Processor), Honeywell-6000' 
                                },
                                { 
                                    gen: '4th Generation', years: '1971-1980', 
                                    tech: 'Microprocessor (VLSI)', lang: 'C, C++, DBASE, SQL', input: 'Mouse, Keyboard, Scanner',
                                    desc: 'VLSI (Very Large Scale Integration) se ek hi chip par lakho circuits aa gaye jise Microprocessor kaha gaya. PC aur GUI OS (Windows) ka janam hua.', 
                                    ex: 'DEC 10, STAR 1000, CRAY-1 (Super computer), Apple II' 
                                },
                                { 
                                    gen: '5th Generation', years: '1980 - Till Now', 
                                    tech: 'ULSI & AI (Artificial Intelligence)', lang: 'Python, Java, C#, .NET', input: 'Touch, Voice, Gesture Recognition',
                                    desc: 'Ultra Large Scale Integration. In computers mein khud sochne, samajhne aur logic lagane ki power (AI) daali ja rahi hai. Internet ka vikas isi yug mein hua.', 
                                    ex: 'Desktop, Laptop, Ultrabook, Chromebook, Robots' 
                                }
                            ].map((g, i) => (
                                <div key={i} className="flex flex-col md:flex-row gap-5 p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-slate-300 to-slate-200 group-hover:from-blue-400 group-hover:to-cyan-400 transition-colors" />
                                    
                                    <div className="w-16 shrink-0 text-center md:text-left ml-2 md:ml-0">
                                        <span className="block text-4xl font-black text-slate-500 group-hover:text-blue-100 transition-colors">0{i+1}</span>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h5 className="font-bold text-slate-800 text-lg">{g.gen}</h5>
                                            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded border border-slate-200">{g.years}</span>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-x-4 gap-y-2 mb-3">
                                            <div className="text-sm font-medium"><span className="text-slate-500 font-bold">Tech:</span> <span className="text-blue-600 font-bold">{g.tech}</span></div>
                                            <div className="text-sm font-medium"><span className="text-slate-500 font-bold">Language:</span> <span className="text-slate-700">{g.lang}</span></div>
                                            <div className="text-sm font-medium"><span className="text-slate-500 font-bold">Input/Memory:</span> <span className="text-slate-700">{g.input}</span></div>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-3 bg-slate-50 p-2 rounded-lg italic">"{g.desc}"</p>
                                        <p className="text-xs font-medium"><span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded mr-1">Examples:</span> <span className="text-slate-600">{g.ex}</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Sec>

                    {/* Section 10: Booting Process */}
                    <Sec id="boot" title="10. Booting Process" icon={<Power size={24} />}>
                        <p className="mb-6">Computer ko ON (Start) karne aur Operating System ko Hard Disk se main memory (RAM) mein load karne ki puri process ko <strong>Booting</strong> kehte hain. Yeh kaam sabse pehle step-by-step hota hai:</p>
                        
                        <div className="p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />
                            
                            <div className="relative z-10 space-y-8">
                                
                                {/* Step 1 */}
                                <div className="flex gap-5 relative">
                                    <div className="absolute left-[19px] top-10 bottom-[-40px] w-0.5 bg-slate-700" />
                                    <div className="w-10 h-10 shrink-0 bg-rose-500 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-[0_0_15px_rgba(244,63,94,0.4)] relative z-10 text-white">
                                        <Power size={18} />
                                    </div>
                                    <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex-1 backdrop-blur-sm">
                                        <h4 className="font-bold text-rose-400 text-lg mb-1">Step 1: Power ON (Cold Booting)</h4>
                                        <p className="text-sm text-slate-300 font-medium">Sabse pehle user motherboard ke through system mein electric power supply on karta hai (Power button press karke).</p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex gap-5 relative">
                                    <div className="absolute left-[19px] top-10 bottom-[-40px] w-0.5 bg-slate-700" />
                                    <div className="w-10 h-10 shrink-0 bg-blue-500 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-[0_0_15px_rgba(59,130,246,0.4)] relative z-10 text-white">
                                        <Settings size={18} />
                                    </div>
                                    <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex-1 backdrop-blur-sm">
                                        <h4 className="font-bold text-blue-400 text-lg mb-1">Step 2: BIOS & POST (Power-On Self-Test)</h4>
                                        <p className="text-sm text-slate-300 font-medium mb-3">Jaise hi power CPU tak pahunchti hai, ROM chip mein save <strong>BIOS (Basic Input/Output System)</strong> program run hota hai. BIOS sabse pehle <strong>POST</strong> process chalta hai.</p>
                                        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 text-xs font-mono text-emerald-400">
                                            &gt; POST Check Initialized...<br/>
                                            &gt; Checking RAM... [OK]<br/>
                                            &gt; Checking Keyboard... [OK]<br/>
                                            &gt; Checking Hard Disk... [OK]
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2">Agar koi hardware missing hai ya kharab hai, toh BIOS beep sound emit karta hai.</p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex gap-5 relative">
                                    <div className="w-10 h-10 shrink-0 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.4)] relative z-10 text-white">
                                        <HardDrive size={18} />
                                    </div>
                                    <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex-1 backdrop-blur-sm">
                                        <h4 className="font-bold text-emerald-400 text-lg mb-1">Step 3: Load OS (Find a boot device)</h4>
                                        <p className="text-sm text-slate-300 font-medium">POST successfully pass hone ke baad, BIOS ek valid bootable device (Hard Disk, SSD ya Pen Drive) ko dhoondhta hai jisme <strong>Operating System (OS)</strong> ho. OS ki file Hard Disk se RAM mein load hoti hai aur phir Desktop screen show ho jati hai.</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <IB type="note" title="Cold Booting vs Warm Booting">
                            <strong>Cold Booting:</strong> Jab computer band (shutdown) ho aur hum power button daba kar use start karein.<br/>
                            <strong>Warm Booting:</strong> Jab chalta hua computer hang ya freeze ho jaye aur hum use keyboard se (Ctrl+Alt+Del) ya reset button se restart karein bina power band kiye.
                        </IB>
                    </Sec>

                    {/* End of Content Marker */}
                    <div className="flex justify-center my-12">
                        <div className="flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
                            <Sparkles size={12} /> Chapter 1 Completed
                        </div>
                    </div>

                    {/* Next Navigation */}
                    <div className="flex justify-end mb-16">
                        <Link href="/it-tools" className="flex items-center gap-4 bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm transition-all hover:shadow-md group">
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Back to Index</p>
                                <p className="font-bold text-blue-600 group-hover:text-blue-700">IT Tools & Network Basics</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <ArrowRight size={18} />
                            </div>
                        </Link>
                    </div>

                </main>
            </div>
        </div>
    );
}
