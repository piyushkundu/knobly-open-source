export interface PythonFolder { name: string; color: string; icon: string; }
const DEFAULT_FOLDERS: PythonFolder[] = [{name: 'Practice', color: '#3b82f6', icon: '📘'}];
const KEY = 'knobly-custom-folders';

// Loading folder preferences is read-only. Old names/version markers are not a
// license to remove user folders or rewrite their metadata during rendering.
export function createPythonFolderStore(storage: () => Pick<Storage, 'getItem' | 'setItem'> = () => localStorage) {
    let snapshot = DEFAULT_FOLDERS;
    let loaded = false;
    const listeners = new Set<() => void>();
    return {
        getSnapshot: () => snapshot,
        getServerSnapshot: () => DEFAULT_FOLDERS,
        subscribe(listener: () => void) {
            listeners.add(listener);
            if (!loaded) {
                try {
                    const raw = storage().getItem(KEY);
                    const parsed = raw ? JSON.parse(raw) : null;
                    if (Array.isArray(parsed)) snapshot = parsed;
                } catch { /* Keep defaults without overwriting unreadable preferences. */ }
                loaded = true;
                for (const notify of listeners) notify();
            }
            return () => { listeners.delete(listener); };
        },
        replace(folders: PythonFolder[]) {
            storage().setItem(KEY, JSON.stringify(folders));
            snapshot = folders;
            for (const notify of listeners) notify();
        },
    };
}
