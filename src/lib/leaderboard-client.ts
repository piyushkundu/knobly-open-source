import type { User } from 'firebase/auth';
import type { LeaderboardRow } from '@/types/leaderboard';

export async function fetchLeaderboard(user: Pick<User, 'getIdToken'>): Promise<LeaderboardRow[]> {
  const response = await fetch('/api/leaderboard', {
    headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: 'no-store',
  });
  if (!response.ok) throw new Error('Leaderboard is temporarily unavailable.');
  const data = await response.json();
  if (!Array.isArray(data.leaderboard)) throw new Error('Invalid leaderboard response.');
  return data.leaderboard;
}
