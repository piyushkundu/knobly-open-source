import 'server-only';
import { createHash } from 'node:crypto';
import type { Firestore } from 'firebase-admin/firestore';
import type { LeaderboardRow } from '@/types/leaderboard';

type DisplayRow = Omit<LeaderboardRow, 'is_current_user'>;
type RecordRow = { id: string; data: Record<string, unknown> };
const MAX_RECORDS = 5000;
const CACHE_MS = 5 * 60_000;
type Entry = { rows?: DisplayRow[]; until: number; pending?: Promise<DisplayRow[]>; failedUntil: number; config: string };
const cache = new WeakMap<Firestore, Entry>();
const publicId = (uid: string) => createHash('sha256').update('knobly-ranking-v1:' + uid).digest('hex');
function number(value: unknown): number {
  // Older records may contain numeric strings; do not reset their displayed XP.
  const parsed = typeof value === 'string' && /^\d+(?:\.\d+)?$/.test(value.trim()) ? Number(value) : value;
  return typeof parsed === 'number' && Number.isFinite(parsed)
    ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.floor(parsed))) : 0;
}
const points = (data: Record<string, unknown>) => number(data.total_points) || number(data.total_xp);
function displayName(value: unknown): string {
  if (typeof value !== 'string' || value.includes('@')) return 'Learner';
  return value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 60) || 'Learner';
}

/** No email, account UID, saved code, answers or arbitrary document fields escape. */
function project(states: RecordRow[], profiles: RecordRow[], users: RecordRow[], trusted: string[]): DisplayRow[] {
  const excluded = new Set(trusted);
  const names = new Map(profiles.map(row => [row.id, row.data]));
  for (const row of profiles) if (row.data.role === 'admin' || row.data.isAdmin === true) excluded.add(row.id);
  for (const row of users) if (row.data.isAdmin === true) excluded.add(row.id);
  const best = new Map<string, DisplayRow>();
  const add = (uid: string, data: Record<string, unknown>) => {
    if (!uid || excluded.has(uid)) return;
    const id = publicId(uid), total = points(data), existing = best.get(id);
    if (existing && existing.total_xp >= total) return;
    best.set(id, { id, full_name: displayName(names.get(uid)?.full_name),
      current_level: Math.max(1, number(data.current_level)), total_xp: total, track_rank: 0, exam_track: '' });
  };
  if (states.length) {
    for (const row of states) if (typeof row.data.user_id === 'string') add(row.data.user_id, row.data);
  } else {
    for (const row of profiles) add(row.id, row.data);
  }
  return [...best.values()].sort((a, b) => b.total_xp - a.total_xp || a.id.localeCompare(b.id))
    .slice(0, 20).map((row, i) => ({ ...row, track_rank: i + 1 }));
}

async function load(db: Firestore, trusted: string[]): Promise<DisplayRow[]> {
  const read = async (collection: string, fields: string[]) => {
    const snapshot = await db.collection(collection).select(...fields).limit(MAX_RECORDS + 1).get();
    // Never silently show an incorrectly ranked partial collection.
    if (snapshot.size > MAX_RECORDS) throw new Error('Leaderboard capacity reached.');
    return snapshot.docs.map(row => ({ id: row.id, data: row.data() }));
  };
  const [states, profiles, users] = await Promise.all([
    read('exam_user_state', ['user_id', 'total_points', 'total_xp', 'current_level']),
    read('profiles', ['full_name', 'role', 'isAdmin', 'total_points', 'total_xp']),
    read('users', ['isAdmin']),
  ]);
  return project(states, profiles, users, trusted);
}

/** Best-effort per-instance cache, not a distributed quota guarantee. No writes. */
export async function readLeaderboard(db: Firestore, uid: string, trusted: string[]): Promise<LeaderboardRow[]> {
  const config = [...trusted].sort().join(',');
  let entry = cache.get(db);
  if (!entry || entry.config !== config) {
    entry = { until: 0, failedUntil: 0, config }; cache.set(db, entry);
  }
  if (entry.failedUntil > Date.now()) throw new Error('Leaderboard temporarily unavailable.');
  if (!entry.rows || entry.until <= Date.now()) {
    if (!entry.pending) {
      const target = entry;
      target.pending = load(db, trusted).then(rows => {
        target.rows = rows; target.until = Date.now() + CACHE_MS; return rows;
      }).catch(() => {
        target.rows = undefined; target.failedUntil = Date.now() + 30_000;
        throw new Error('Leaderboard temporarily unavailable.');
      }).finally(() => { target.pending = undefined; });
    }
    await entry.pending;
  }
  const caller = publicId(uid);
  // Personalization happens after the shared cache; response caching is disabled.
  return (entry.rows ?? []).map(row => ({ ...row, is_current_user: row.id === caller }));
}
