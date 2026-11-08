export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function extractLineNumber(errorMessage: string): number | null {
  const execMatch = errorMessage.match(/File "<exec>", line (\d+)/);
  if (execMatch) {
    return parseInt(execMatch[1], 10);
  }

  const tracebackMatches = errorMessage.match(/File "[^"]+", line (\d+)/g);
  if (tracebackMatches && tracebackMatches.length > 0) {
    const lastMatch = tracebackMatches[tracebackMatches.length - 1];
    const lineMatch = lastMatch.match(/line (\d+)/);
    if (lineMatch) return parseInt(lineMatch[1], 10);
  }

  const lineMatch = errorMessage.match(/line (\d+)/i);
  if (lineMatch) {
    return parseInt(lineMatch[1], 10);
  }
  
  return null;
}

export function formatPythonError(error: string): string {
  if (!error) return error;

  const lines = error.split('\n');
  const cleaned: string[] = [];
  let isTraceback = false;
  let skipFrame = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('Traceback (most recent call last):')) {
      isTraceback = true;
      cleaned.push(line);
      continue;
    }

    if (isTraceback) {
      if (line.trim().startsWith('File "')) {
        if (line.includes('"/lib/python') || line.includes('_pyodide') || line.includes('pyodide.asm.js')) {
          skipFrame = true;
        } else {
          skipFrame = false;
          cleaned.push(line);
        }
      } else if (line.trim() === '' || (!line.startsWith(' ') && line.includes(':'))) {
        skipFrame = false;
        cleaned.push(line);
      } else if (!skipFrame) {
        cleaned.push(line);
      }
    } else {
      cleaned.push(line);
    }
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
