// Shared by request validation and UI; contains no provider keys or server code.
export const AI_LIMITS = {
  bodyBytes: 128 * 1024,
  code: 60000,
  prompt: 8000,
  error: 12000,
  topic: 200,
  chatMessages: 10,
  chatMessage: 8000,
  chatTotal: 24000,
  options: 10,
  option: 2000,
} as const;

export function buildAIChatHistory(messages: readonly { role: 'user' | 'assistant'; content: string }[]) {
  const latest = messages[messages.length - 1];
  if (!latest || latest.role !== 'user' || !latest.content.trim() || latest.content.length > AI_LIMITS.chatMessage) {
    throw new Error(`Enter a message of at most ${AI_LIMITS.chatMessage} characters.`);
  }
  // Drop old oversized context without mutating the chat displayed to the user.
  const history = messages.slice(-AI_LIMITS.chatMessages)
    .filter(message => message.content.length <= AI_LIMITS.chatMessage)
    .map(({ role, content }) => ({ role, content }));
  let total = history.reduce((sum, message) => sum + message.content.length, 0);
  while (total > AI_LIMITS.chatTotal && history.length > 1) {
    total -= history.shift()!.content.length;
  }
  return history;
}

export async function aiClientError(response: Response, fallback: string): Promise<Error> {
  try {
    const data: unknown = await response.json();
    if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') {
      return new Error(data.error.slice(0, 500));
    }
  } catch { /* A gateway can return non-JSON errors. */ }
  return new Error(fallback);
}
