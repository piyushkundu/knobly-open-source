import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/admin-api-auth';

// Force dynamic — serverless function must always execute live and not be statically cached
export const dynamic = 'force-dynamic';

const ALL_TASK_IDS = ['1', '2', '3', '4', '5', '5.0', '5.1', '5.2', '5.3', '5.4', '6', '7', '8', '9', '10', '11', 'test-1'];

// Persistent in-memory cache across requests within the same warm lambda
let memoryUnlockedTasks: string[] | null = null;

// Filesystem locations (local repo & serverless /tmp)
const LOCAL_DATA_FILE = path.join(process.cwd(), 'data', 'html-tasks-state.json');
const TMP_DATA_FILE = path.join(os.tmpdir(), 'html-tasks-state.json');

function readStoredTasks(value: unknown): string[] | null {
    if (!Array.isArray(value) || !value.every(id => typeof id === 'string' || (typeof id === 'number' && Number.isFinite(id)))) {
        return null;
    }
    // Preserve existing IDs, including legacy entries, without migrating data.
    return value.map(String);
}

function tryReadFile(filePath: string): string[] | null {
    try {
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf-8');
            const parsed = JSON.parse(raw);
            return readStoredTasks(parsed?.unlockedTasks);
        }
    } catch {
        // Ignore read errors
    }
    return null;
}

function tryWriteFile(filePath: string, state: { unlockedTasks: string[] }): boolean {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf-8');
        return true;
    } catch {
        return false;
    }
}

/**
 * Read unlocked tasks from Firestore (Cloud Database - Permanent across Vercel deployments & restarts)
 */
async function fetchUnlockedTasksFromFirestore(): Promise<string[] | null> {
    try {
        const db = getAdminDb();
        const docRef = db.collection('app_settings').doc('html_tasks');
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            const data = docSnap.data();
            return readStoredTasks(data?.unlockedTasks);
        }
    } catch (err) {
        console.warn('[HTML Tasks API] Firestore read fallback:', err);
    }
    return null;
}

/**
 * Read trusted server caches without accepting client-provided state.
 */
function getTrustedFallback(): string[] {
    if (memoryUnlockedTasks !== null) return [...memoryUnlockedTasks];
    return tryReadFile(LOCAL_DATA_FILE) ?? tryReadFile(TMP_DATA_FILE) ?? ['1', '2'];
}

/**
 * Retrieve unlocked tasks using a multi-layer strategy:
 * 1. Firestore (Cloud Database - Single Source of Truth, permanent)
 * 2. In-memory cache
 * 3. Local file / /tmp
 */
async function getUnlockedTasks(): Promise<string[]> {
    // 1. Try reading from Firestore first (guarantees cross-instance consistency on Vercel)
    const firestoreTasks = await fetchUnlockedTasksFromFirestore();
    if (firestoreTasks !== null) {
        memoryUnlockedTasks = firestoreTasks;
        return firestoreTasks;
    }

    // 2. In-memory warm cache
    // Use only server-owned fallback state; cookies cannot unlock shared tasks.
    const fallback = getTrustedFallback();
    memoryUnlockedTasks = fallback;
    return fallback;
}

/**
 * Commit the admin change atomically, then refresh best-effort server caches.
 */
async function updateUnlockedTasks(taskId: string, action: 'lock' | 'unlock'): Promise<string[]> {
    const db = getAdminDb();
    const docRef = db.collection('app_settings').doc('html_tasks');
    const tasks = await db.runTransaction(async transaction => {
        const snapshot = await transaction.get(docRef);
        const existing = snapshot.exists
            ? readStoredTasks(snapshot.data()?.unlockedTasks)
            : getTrustedFallback();
        if (existing === null) throw new Error('Invalid stored task state');

        const updated = taskId === 'all'
            ? (action === 'lock' ? [] : [...ALL_TASK_IDS])
            : action === 'lock'
                ? existing.filter(id => id !== taskId)
                : existing.includes(taskId) ? [...existing] : [...existing, taskId];
        transaction.set(docRef, { unlockedTasks: updated, updatedAt: new Date().toISOString() }, { merge: true });
        return updated;
    });

    // Update caches only after the authoritative transaction has committed.
    memoryUnlockedTasks = tasks;

    // 2. Save to local data file (Local dev)
    const payload = { unlockedTasks: tasks };
    const localSaved = tryWriteFile(LOCAL_DATA_FILE, payload);

    // 3. Save to /tmp (Serverless instance)
    if (!localSaved) {
        tryWriteFile(TMP_DATA_FILE, payload);
    }
    return tasks;
}

// GET: Return list of unlocked tasks
export async function GET() {
    try {
        const unlocked = await getUnlockedTasks();
        const res = NextResponse.json({ 
            success: true, 
            unlockedTasks: unlocked 
        });

        // Set cache control so browser and CDN never cache stale lock status
        res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

        // Sync 1-year persistent cookie
        res.cookies.set('knobly_unlocked_tasks', encodeURIComponent(JSON.stringify(unlocked)), {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            sameSite: 'lax',
        });

        return res;
    } catch (err) {
        console.error('[HTML Tasks API] GET error:', err);
        const fallback = memoryUnlockedTasks || ['1', '2'];
        return NextResponse.json({ success: true, unlockedTasks: fallback });
    }
}

// POST: Only authenticated admins may change shared task availability.
export async function POST(req: NextRequest) {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    try {
        let body: unknown;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ success: false, error: 'Invalid JSON request' }, { status: 400 });
        }

        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return NextResponse.json({ success: false, error: 'Invalid task update request' }, { status: 400 });
        }
        const { taskId, action } = body as Record<string, unknown>;
        if (typeof taskId !== 'string' || (taskId !== 'all' && !ALL_TASK_IDS.includes(taskId))) {
            return NextResponse.json({ success: false, error: 'Invalid task ID' }, { status: 400 });
        }
        if (action !== 'lock' && action !== 'unlock') {
            return NextResponse.json({ success: false, error: 'Action must be lock or unlock' }, { status: 400 });
        }

        // Save permanently to Firestore + in-memory + filesystem
        const currentUnlocked = await updateUnlockedTasks(taskId, action);

        const res = NextResponse.json({
            success: true,
            unlockedTasks: currentUnlocked,
            message: action === 'lock' 
                ? (taskId === 'all' ? 'All tasks locked successfully' : `Task ${taskId} locked`)
                : (taskId === 'all' ? 'All tasks unlocked successfully' : `Task ${taskId} unlocked permanently`)
        });

        res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

        // Set persistent cookie on client
        res.cookies.set('knobly_unlocked_tasks', encodeURIComponent(JSON.stringify(currentUnlocked)), {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            sameSite: 'lax',
        });

        return res;
    } catch (err) {
        console.error('[HTML Tasks API] POST error:', err);
        return NextResponse.json({ 
            success: false,
            error: 'Unable to save task status. Please try again.'
        }, { status: 503 });
    }
}
