'use client';

import { KnoblyApp } from '@/types/app';
import { motion, AnimatePresence } from 'framer-motion';


interface AppModalProps {
    app: KnoblyApp | null;
    isOpen: boolean;
    onClose: () => void;
    onLaunch: (app: KnoblyApp) => void;
}

export default function AppModal({ app, isOpen, onClose, onLaunch }: AppModalProps) {
    if (!app) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="draggable-modal w-full max-w-sm rounded-[28px] p-7 text-center border border-white/10 flex flex-col items-center pointer-events-auto"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25 }}
                    >
                        <button
                            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors z-20"
                            onClick={onClose}
                        >
                            <i className="ph-bold ph-x text-xl" />
                        </button>

                        <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-5 bg-[#1a1a20] shadow-2xl border border-white/10 z-10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent opacity-50" />
                            <i className={`${app.icon} text-6xl ${app.color} relative z-10 drop-shadow-2xl`} />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-1 z-10">{app.name}</h2>
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-6 border border-cyan-500/20 px-2 py-1 rounded bg-cyan-900/20 z-10">
                            {app.type}
                        </span>

                        <button
                            onClick={() => onLaunch(app)}
                            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:scale-105 transition-all text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] z-10 active:scale-95"
                        >
                            Launch Application
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
