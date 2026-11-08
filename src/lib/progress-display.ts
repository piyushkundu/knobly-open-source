// Display normalization only. Never write normalized legacy values back here.
const integer = (value: unknown): number => {
  const n = typeof value === 'string' && /^\d+(?:\.\d+)?$/.test(value.trim()) ? Number(value) : value;
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 ? Math.min(Number.MAX_SAFE_INTEGER,Math.floor(n)) : 0;
};
export const progressPoints = (data: Record<string, unknown>) => integer(data.total_points) || integer(data.total_xp);
export function progressDisplay(data: Record<string, unknown>) {
  const points = progressPoints(data);
  return { ...data, total_points:points, total_xp:points, current_level:Math.max(1,integer(data.current_level)), streak_days:integer(data.streak_days) };
}
