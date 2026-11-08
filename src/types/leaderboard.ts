/** A display projection, never an account/profile document. IDs are opaque hashes. */
export interface LeaderboardRow {
  id: string;
  full_name: string;
  current_level: number;
  total_xp: number;
  track_rank: number;
  exam_track: string;
  is_current_user: boolean;
}
