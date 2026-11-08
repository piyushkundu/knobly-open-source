import {ACHIEVEMENTS, DEFAULT_STATS, type TypingStats} from '@/components/typing/typingData';

type StatsStorage = Pick<Storage, 'getItem' | 'setItem'>;
const KEY = 'knobly-typing-stats';

// Each mounted page owns its cached snapshot. Construction/server rendering
// never reads storage, and subscribing only loads existing data without saving.
export function createTypingStatsStore(storage: () => StatsStorage = () => localStorage) {
    let snapshot = DEFAULT_STATS;
    let loaded = false;
    const listeners = new Set<() => void>();
    const load = () => {
        if (loaded) return;
        try {
            const raw = storage().getItem(KEY);
            snapshot = raw ? {...DEFAULT_STATS, ...JSON.parse(raw)} : {...DEFAULT_STATS};
        } catch { snapshot = {...DEFAULT_STATS}; }
        loaded = true;
    };
    return {
        getSnapshot: () => snapshot,
        getServerSnapshot: () => DEFAULT_STATS,
        subscribe(listener: () => void) {
            listeners.add(listener);
            if (!loaded) {
                load();
                for (const notify of listeners) notify();
            }
            return () => { listeners.delete(listener); };
        },
        update(change: (current: TypingStats) => TypingStats) {
            load();
            const next = {...change(snapshot)};
            const earned = ACHIEVEMENTS.filter(a => !next.achievements.includes(a.id) && a.condition(next)).map(a => a.id);
            if (earned.length) next.achievements = [...next.achievements, ...earned];
            const today = new Date().toISOString().slice(0, 10);
            if (next.lastPracticeDate !== today) {
                const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
                next.dailyStreak = next.lastPracticeDate === yesterday ? next.dailyStreak + 1 : 1;
                next.lastPracticeDate = today;
            }
            snapshot = next;
            storage().setItem(KEY, JSON.stringify(next));
            for (const notify of listeners) notify();
        },
    };
}
