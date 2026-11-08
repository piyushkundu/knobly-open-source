import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';
import { NextResponse, type NextRequest } from 'next/server';

export const AI_CLIENT_COOKIE = 'knobly_ai_client';
export const PUBLIC_AI_PATHS = new Set([
  '/api/ai-generate', '/api/ai-explain', '/api/ai-explain-web',
  '/api/c-ai-generate', '/api/c-ai-explain', '/api/ai/chat',
  '/api/ai/generate-topic', '/api/ai/explain-question', '/api/evaluate-task',
]);
const COOKIE_SECONDS = 86400;
const STORE_TIMEOUT_MS = 2000;

// Check every window before incrementing any counter. Redis executes the whole
// script atomically, including across separate Vercel function instances.
export const AI_RATE_LIMIT_SCRIPT = `
local retry = 0
local counts = {}
local ttls = {}
for i, key in ipairs(KEYS) do
  local count = tonumber(redis.call('GET', key) or '0')
  local ttl = redis.call('PTTL', key)
  local window = tonumber(ARGV[i * 2])
  if ttl <= 0 then count = 0; ttl = window end
  counts[i] = count
  ttls[i] = ttl
  if count >= tonumber(ARGV[i * 2 - 1]) then retry = math.max(retry, ttl) end
end
if retry > 0 then return {0, math.max(1, math.ceil(retry / 1000))} end
for i, key in ipairs(KEYS) do
  if counts[i] == 0 then
    redis.call('SET', key, 1, 'PX', ARGV[i * 2])
  else
    redis.call('INCR', key)
  end
end
return {1, 0}
`;

type Environment = Record<string, string | undefined>;
type Window = { key: string; limit: number; milliseconds: number };
type Decision = { allowed: boolean; retrySeconds: number };
type Dependencies = {
  env?: Environment;
  fetch?: typeof fetch;
  now?: () => number;
  // Dependency injection for deterministic timeout tests; production uses 2s.
  storeTimeoutMs?: number;
};

function positiveLimit(env: Environment, name: string, fallback: number): number {
  const value = env[name];
  if (value === undefined) return fallback;
  if (!/^[1-9]\d{0,6}$/.test(value) || Number(value) > 1000000) throw new Error('Invalid limit');
  return Number(value);
}

export function normalizeAIClientIP(value: string): string | null {
  if (isIP(value) === 4) return value;
  if (isIP(value) !== 6 || value.includes('%')) return null;
  const canonical = new URL(`http://[${value}]/`).hostname.slice(1, -1);
  // URL canonicalization turns mapped IPv4 addresses into ::ffff:hhhh:hhhh.
  const mapped = /^::ffff:([\da-f]+):([\da-f]+)$/.exec(canonical);
  if (mapped) {
    const high = parseInt(mapped[1], 16), low = parseInt(mapped[2], 16);
    return [high >> 8, high & 255, low >> 8, low & 255].join('.');
  }
  const [left, right] = canonical.split('::');
  const before = left ? left.split(':') : [];
  const after = right ? right.split(':') : [];
  const groups = right === undefined ? before : [...before, ...Array(8 - before.length - after.length).fill('0'), ...after];
  // Share the counter across an IPv6 /64 so rotating interface IDs cannot
  // bypass the network limit. Shared-network caps are deliberately higher.
  return groups.slice(0, 4).map(group => group.padStart(4, '0')).join(':') + '::/64';
}

async function redisDecision(
  windows: Window[], url: string, token: string, transport: typeof fetch, timeoutMs: number,
): Promise<Decision> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => { reject(new Error('Rate limit store timeout')); controller.abort(); }, timeoutMs);
  });
  const operation = async () => {
    const response = await transport(url, {
      method: 'POST', cache: 'no-store', redirect: 'error', signal: controller.signal,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['EVAL', AI_RATE_LIMIT_SCRIPT, windows.length,
        ...windows.map(window => window.key),
        ...windows.flatMap(window => [window.limit, window.milliseconds])]),
    });
    if (controller.signal.aborted) { void response.body?.cancel().catch(() => {}); throw new Error('Store timeout'); }
    if (!response.ok || !response.body) {
      void response.body?.cancel().catch(() => {});
      throw new Error('Store failed');
    }
    const reader = response.body.getReader();
    const cancel = () => { void reader.cancel().catch(() => {}); };
    controller.signal.addEventListener('abort', cancel, { once: true });
    let text = '', size = 0;
    const decoder = new TextDecoder();
    try {
      while (true) {
        controller.signal.throwIfAborted();
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 8192) throw new Error('Store response too large');
        text += decoder.decode(value, { stream: true });
      }
      text += decoder.decode();
    } finally {
      controller.signal.removeEventListener('abort', cancel);
      cancel();
      reader.releaseLock();
    }
    const data = JSON.parse(text);
    const result = data?.result;
    if (data?.error || !Array.isArray(result) || result.length !== 2 ||
      ![0, 1].includes(result[0]) || !Number.isInteger(result[1]) || result[1] < 0 ||
      result[1] > 86400 || (result[0] === 0 && result[1] === 0) || (result[0] === 1 && result[1] !== 0)) {
      throw new Error('Invalid store response');
    }
    return { allowed: result[0] === 1, retrySeconds: result[1] };
  };
  try { return await Promise.race([operation(), timeout]); }
  finally { clearTimeout(timer); }
}

export function createAIRateLimiter(dependencies: Dependencies = {}) {
  const env = dependencies.env ?? process.env;
  const now = dependencies.now ?? Date.now;
  const transport = dependencies.fetch ?? fetch;
  const developmentSecret = randomBytes(32).toString('hex');
  const memory = new Map<string, { count: number; expires: number }>();
  let warned = false;

  function memoryDecision(windows: Window[]): Decision {
    const time = now();
    for (const [key, value] of memory) if (value.expires <= time) memory.delete(key);
    const blocked = windows.filter(window => (memory.get(window.key)?.count ?? 0) >= window.limit);
    if (blocked.length) return {
      allowed: false,
      retrySeconds: Math.max(1, ...blocked.map(window => Math.ceil((memory.get(window.key)!.expires - time) / 1000))),
    };
    for (const window of windows) {
      const previous = memory.get(window.key);
      memory.set(window.key, { count: (previous?.count ?? 0) + 1, expires: previous?.expires ?? time + window.milliseconds });
    }
    return { allowed: true, retrySeconds: 0 };
  }

  return async function limitAIRequest(request: NextRequest): Promise<NextResponse> {
    const path = request.nextUrl.pathname.replace(/\/$/, '');
    if (request.method !== 'POST' || !PUBLIC_AI_PATHS.has(path)) return NextResponse.next();
    const hosted = env.NODE_ENV === 'production' || env.VERCEL === '1';
    try {
      // The Vercel Marketplace adds KV_REST_API_* beneath the chosen prefix.
      // Prefer one complete configuration family; never combine credentials
      // from two databases when an explicit override is only partially set.
      const explicitStore = Boolean(env.UPSTASH_REDIS_REST_URL || env.UPSTASH_REDIS_REST_TOKEN);
      const url = explicitStore ? env.UPSTASH_REDIS_REST_URL : env.UPSTASH_REDIS_KV_REST_API_URL;
      const token = explicitStore ? env.UPSTASH_REDIS_REST_TOKEN : env.UPSTASH_REDIS_KV_REST_API_TOKEN;
      const configured = Boolean(url || token);
      const secret = env.AI_RATE_LIMIT_SECRET ?? (hosted ? '' : developmentSecret);
      if (Buffer.byteLength(secret) < 32 || (hosted && !configured)) throw new Error('Missing configuration');
      if (configured) {
        if (!url || !token) throw new Error('Incomplete store configuration');
        const endpoint = new URL(url);
        if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash || endpoint.pathname !== '/') {
          throw new Error('Invalid store URL');
        }
      }
      const prefix = env.AI_RATE_LIMIT_PREFIX ?? 'knobly:ai:v1';
      if (!/^[a-zA-Z0-9:_-]{1,80}$/.test(prefix)) throw new Error('Invalid prefix');
      const digest = (value: string) => createHmac('sha256', secret).update(value).digest('hex');
      const seconds = Math.floor(now() / 1000);
      const oldCookie = request.cookies.get(AI_CLIENT_COOKIE)?.value ?? '';
      const parts = /^([a-f0-9]{32})\.(\d{10})\.([a-f0-9]{64})$/.exec(oldCookie);
      let cookie = oldCookie;
      if (!parts || Number(parts[2]) <= seconds || Number(parts[2]) > seconds + COOKIE_SECONDS ||
        !timingSafeEqual(Buffer.from(parts[3], 'hex'), Buffer.from(digest(`cookie:${parts[1]}.${parts[2]}`), 'hex'))) {
        const payload = `${randomBytes(16).toString('hex')}.${seconds + COOKIE_SECONDS}`;
        cookie = `${payload}.${digest(`cookie:${payload}`)}`;
      }
      const client = digest(`client:${cookie.split('.')[0]}`);
      // Only use a header the hosting reverse proxy guarantees to overwrite.
      // Arbitrary X-Forwarded-For values supplied by callers are never trusted.
      const ipHeader = env.VERCEL === '1' ? 'x-vercel-forwarded-for' : env.AI_RATE_LIMIT_TRUSTED_IP_HEADER;
      const ip = ipHeader ? normalizeAIClientIP(request.headers.get(ipHeader)?.trim() ?? '') : hosted ? null : 'local-development';
      if (!ip) throw new Error('Missing trusted client IP');
      const network = digest(`ip:${ip}`);
      // One hash slot keeps all keys in the same atomic Redis cluster operation.
      const base = `${prefix}:{ai}:`;
      const specs: [string, string, number, number][] = [
        [`client-minute:${client}`, 'AI_LIMIT_CLIENT_MINUTE', 12, 60000],
        [`client-hour:${client}`, 'AI_LIMIT_CLIENT_HOUR', 120, 3600000],
        [`ip-minute:${network}`, 'AI_LIMIT_IP_MINUTE', 240, 60000],
        [`ip-hour:${network}`, 'AI_LIMIT_IP_HOUR', 2400, 3600000],
        ['global-minute', 'AI_LIMIT_GLOBAL_MINUTE', 300, 60000],
        ['global-day', 'AI_LIMIT_GLOBAL_DAY', 3000, 86400000],
      ];
      const windows = specs.map(([key, name, fallback, milliseconds]) => ({ key: base + key, limit: positiveLimit(env, name, fallback), milliseconds }));
      const decision = configured
        ? await redisDecision(windows, url!, token!, transport, dependencies.storeTimeoutMs ?? STORE_TIMEOUT_MS)
        : memoryDecision(windows);
      if (!configured && !warned) {
        warned = true;
        console.warn('AI rate limits use local development memory. Configure Redis before deploying.');
      }
      const response = decision.allowed ? NextResponse.next() : NextResponse.json(
        { error: `Too many AI requests. Please try again in ${decision.retrySeconds} seconds.` },
        { status: 429, headers: { 'Retry-After': String(decision.retrySeconds) } },
      );
      response.headers.set('Cache-Control', 'no-store');
      if (!configured) response.headers.set('X-AI-RateLimit-Store', 'development-memory');
      if (cookie !== oldCookie) response.cookies.set(AI_CLIENT_COOKIE, cookie, {
        httpOnly: true, secure: hosted || request.nextUrl.protocol === 'https:', sameSite: 'lax', path: '/', maxAge: COOKIE_SECONDS,
      });
      return response;
    } catch {
      // Never bypass shared limits during an outage or deployment misconfiguration.
      // Do not log tokens, client identifiers, or provider response bodies.
      return NextResponse.json({ error: 'AI is temporarily unavailable. Please try again shortly.' }, {
        status: 503, headers: { 'Retry-After': '30', 'Cache-Control': 'no-store' },
      });
    }
  };
}
