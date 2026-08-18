interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

interface RateLimitResult {
  limited: boolean;
  remaining: number;
  reset: number;
}

export function rateLimit(
  key: string,
  windowMs: number = 60000,
  max: number = 10,
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetTime <= now) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return { limited: false, remaining: max - 1, reset: now + windowMs };
  }

  if (entry.count >= max) {
    return { limited: true, remaining: 0, reset: entry.resetTime };
  }

  entry.count++;
  return { limited: false, remaining: max - entry.count, reset: entry.resetTime };
}

export function ipKey(ip: string): string {
  return `ip:${ip}`;
}

export function userKey(userId: string): string {
  return `user:${userId}`;
}

export function emailKey(email: string): string {
  return `email:${email}`;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetTime <= now) {
      store.delete(key);
    }
  }
}, 300000);
