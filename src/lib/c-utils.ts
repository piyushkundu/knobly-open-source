export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function extractCLineNumber(errorMessage: string): number | null {
  // JSCPP error format: "line X col Y: message" or similar
  const lineMatch = errorMessage.match(/line\s+(\d+)/i);
  if (lineMatch) {
    return parseInt(lineMatch[1], 10);
  }

  // GCC-style: "filename:line:col: error: message"
  const gccMatch = errorMessage.match(/:(\d+):\d+:/);
  if (gccMatch) {
    return parseInt(gccMatch[1], 10);
  }

  return null;
}

export function formatCError(error: string): string {
  if (!error) return error;

  // Clean up JSCPP internal stack traces
  const lines = error.split('\n');
  const cleaned: string[] = [];

  for (const line of lines) {
    // Skip internal JSCPP stack frames
    if (line.includes('at Object.') || line.includes('at Module.') || line.includes('node_modules')) {
      continue;
    }
    cleaned.push(line);
  }

  return cleaned.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

export function truncateCode(code: string, maxLines: number = 2): string {
  const lines = code.split('\n');
  if (lines.length <= maxLines) return code;
  return lines.slice(0, maxLines).join('\n') + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
