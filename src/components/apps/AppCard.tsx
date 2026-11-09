'use client';

import { KnoblyApp } from '@/types/app';

interface AppCardProps {
    app: KnoblyApp;
    isFavourite: boolean;
    isNew: boolean;
    activeNav: string;
    onClick: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
}

export default function AppCard({ app, isFavourite, isNew, activeNav, onClick, onContextMenu }: AppCardProps) {
    const isComingSoon = (app.id.startsWith('it-ch') || app.id === 'it-handwritten') && !app.link;

    return (
        <div
            onClick={onClick}
            onContextMenu={onContextMenu}
            className={`glass-card app-card rounded-[22px] flex flex-col items-center justify-center gap-2 cursor-pointer group relative overflow-hidden active-press ${isComingSoon ? 'pointer-events-auto cursor-not-allowed' : ''}`}
            data-tilt
            data-tilt-scale="1.05"
        >
            {isFavourite && (
                <div className="absolute top-2 right-2 text-yellow-400 text-xs z-20">
                    <i className="ph-fill ph-star" />
                </div>
            )}

            {isNew && (
                <div className="theme-fixed absolute top-2 left-2 bg-red-700 text-white text-[8px] font-bold px-1.5 py-0.5 rounded z-20 shadow-md">
                    NEW
                </div>
            )}

            {isComingSoon && (
                <div className="absolute top-2 right-2 z-20">
                    <i className="ph-bold ph-lock-simple text-gray-400 text-xs" />
                </div>
            )}

            <div
                className={`w-12 h-12 sm:w-16 sm:h-16 app-icon-tile flex items-center justify-center transition-transform duration-300 bg-black/40 shadow-inner border z-10 backdrop-blur-md group-hover:scale-[1.03] rounded-full app-icon-accent-cyan ${app.borderClass}`}
            >
                <i className={`${app.icon} devicon-fix app-color-icon ${app.color}`} />
            </div>

            <div className="text-center z-10 pointer-events-none">
                <h3 className="font-semibold text-gray-200 text-[11px] sm:text-xs md:text-sm group-hover:text-cyan-300 transition-colors leading-tight">
                    {app.name}
                </h3>
                {app.id === 'notes' && (
                    <div className="app-saved-label text-[8px] text-emerald-400 mt-0.5 uppercase tracking-[0.16em]">
                        ● Saved
                    </div>
                )}
                {activeNav !== 'apps' && (
                    <p className="app-type-label text-[9px] mt-0.5 uppercase tracking-[0.14em] text-gray-400">
                        {app.type}
                    </p>
                )}
            </div>
        </div>
    );
}

