'use client';

import { KnoblyApp } from '@/types/app';
import { motion, Variants } from 'framer-motion';
import AppCard from './AppCard';

interface AppGridProps {
    apps: KnoblyApp[];
    favourites: string[];
    activeNav: string;
    performanceMode: boolean;
    onAppClick: (app: KnoblyApp) => void;
    onAppContextMenu: (e: React.MouseEvent, app: KnoblyApp) => void;
}

export default function AppGrid({ apps, favourites, activeNav, performanceMode, onAppClick, onAppContextMenu }: AppGridProps) {
    const newAppDuration = 3 * 24 * 60 * 60 * 1000; // 3 days

    const isNewApp = (app: KnoblyApp) => {
        if (!app.created_at) return false;
        return Date.now() - new Date(app.created_at).getTime() < newAppDuration;
    };

    if (apps.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-center text-gray-500 text-xs">
                <i className="ph-bold ph-folder-open text-3xl mb-2 text-cyan-400/50" />
                <p className="uppercase tracking-[0.18em] text-[9px]">No apps found</p>
            </div>
        );
    }

    // Container variants for staggered children
    const containerVariants: Variants | undefined = performanceMode ? {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.05,
            },
        },
    } : undefined;

    // Card animation variants
    const cardVariants: Variants | undefined = performanceMode ? {
        hidden: { y: 30, opacity: 0, scale: 0.9 },
        show: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: 'backOut' as const,
            },
        },
    } : undefined;

    return (
        <motion.div
            className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 pb-4"
            variants={containerVariants}
            initial={performanceMode ? "hidden" : false}
            animate="show"
            key={`${activeNav}-grid`}
        >
            {apps.map((app) => (
                <motion.div key={app.id} variants={cardVariants}>
                    <AppCard
                        app={app}
                        isFavourite={favourites.includes(app.id)}
                        isNew={isNewApp(app)}
                        activeNav={activeNav}
                        onClick={() => onAppClick(app)}
                        onContextMenu={(e) => onAppContextMenu(e, app)}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}
