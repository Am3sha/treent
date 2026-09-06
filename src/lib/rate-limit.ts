import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Distributed rate limiting via Upstash Redis (@upstash/ratelimit), with a
 * per-instance in-memory fallback so local dev keeps working without credentials.
 *
 * Provisioning: set REDIS_URL + REDIS_TOKEN (the names the Vercel x Upstash
 * marketplace integration injects; UPSTASH_REDIS_REST_URL/_TOKEN also work).
 * Without them every instance falls back to the old behavior plus a warning -
 * on serverless, limits are then per-instance rather than global.
 */

export type RateLimitOutcome = { allowed: boolean; retryAfterSec: number };

function envFirst(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return undefined;
}

let redisSingleton: Redis | null | undefined;
export function getRedis(): Redis | null {
  if (redisSingleton === undefined) {
    const url = envFirst("REDIS_URL", "UPSTASH_REDIS_REST_URL");
    const token = envFirst("REDIS_TOKEN", "UPSTASH_REDIS_REST_TOKEN");
    redisSingleton = url && token ? new Redis({ url, token }) : null;
  }
  return redisSingleton;
}

let lastWarnAt = 0;
export function warnFallbackOnce(reason: unknown): void {
  const now = Date.now();
  if (now - lastWarnAt > 60_000) {
    lastWarnAt = now;
    console.warn(
      "[rate-limit] Upstash Redis unavailable/misconfigured (" +
        String(reason).slice(0, 140) +
        ") - falling back to per-instance in-memory limits. Set REDIS_URL/REDIS_TOKEN for atomic cross-instance limiting."
    );
  }
}

// ---------------- in-memory fallback (shared by both limiter kinds) ----------------

type Entry = { count: number; resetAt: number };
const globalForFallback = globalThis as typeof globalThis & {
  __trenntRateLimitFallback?: Map<string, Entry>;
};
const mem = globalForFallback.__trenntRateLimitFallback ?? new Map<string, Entry>();
globalForFallback.__trenntRateLimitFallback = mem;

function pruneMemory(force = false): void {
  if (!force && mem.size <= 10_000) return;
  const now = Date.now();
  for (const [key, entry] of mem) {
    if (entry.resetAt <= now) mem.delete(key);
  }
}

function memoryConsume(key: string, limit: number, windowSec: number): RateLimitOutcome {
  pruneMemory();
  const now = Date.now();
  const entry = mem.get(key);
  if (!entry || entry.resetAt <= now) {
    mem.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (entry.count >= limit) {
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }
  entry.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

function memoryPeek(key: string): number {
  const entry = mem.get(key);
  if (!entry || entry.resetAt <= Date.now()) return 0;
  return entry.count;
}

function memoryIncr(key: string, windowSec: number): void {
  pruneMemory();
  const now = Date.now();
  const entry = mem.get(key);
  if (!entry || entry.resetAt <= now) {
    mem.set(key, { count: 1, resetAt: now + windowSec * 1000 });
  } else {
    entry.count += 1;
  }
}

function memoryClear(key: string): void {
  mem.delete(key);
}

// ---------------- public POST limiter (atomic via @upstash/ratelimit) ----------------

const ratelimitInstances = new Map<string, Ratelimit>();
function getFixedWindowRatelimit(limit: number, windowSec: number): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  const cacheKey = `public|${limit}|${windowSec}`;
  let rl = ratelimitInstances.get(cacheKey);
  if (!rl) {
    rl = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(limit, `${windowSec} s`),
      prefix: "trennt:public",
      analytics: false,
    });
    ratelimitInstances.set(cacheKey, rl);
  }
  return rl;
}

/**
 * Consumes one slot in a fixed window of `windowSec` seconds for `limit`
 * requests per identifier. Semantics match the previous in-memory limiter.
 */
export async function checkPublicRateLimit(
  endpoint: string,
  identifier: string,
  limit: number,
  windowSec: number
): Promise<RateLimitOutcome> {
  const key = `${endpoint}:${identifier}`;
  const rl = getFixedWindowRatelimit(limit, windowSec);
  if (!rl) return memoryConsume(key, limit, windowSec);
  try {
    const res = await rl.limit(key);
    if (res.success) return { allowed: true, retryAfterSec: 0 };
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((res.reset - Date.now()) / 1000)),
    };
  } catch (err) {
    warnFallbackOnce(err);
    return memoryConsume(key, limit, windowSec);
  }
}

// ---------------- login failure limiter (check / consume / reset) ----------------

export const LOGIN_LIMIT = 5;
export const LOGIN_WINDOW_SEC = 15 * 60;

function loginKey(key: string): string {
  return `trennt:login:${key}`;
}

/** Non-consuming check: is any of these identifiers already at/over the limit? */
export async function loginAttemptCount(key: string): Promise<number> {
  const redis = getRedis();
  if (!redis) return memoryPeek(loginKey(key));
  try {
    const value = await redis.get(loginKey(key));
    if (typeof value === "number") return value;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch (err) {
    warnFallbackOnce(err);
    return memoryPeek(loginKey(key));
  }
}

/** Records one failed attempt (first failure starts the window). */
export async function recordLoginAttempt(key: string): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    memoryIncr(loginKey(key), LOGIN_WINDOW_SEC);
    return;
  }
  try {
    const count = await redis.incr(loginKey(key));
    if (count === 1) await redis.expire(loginKey(key), LOGIN_WINDOW_SEC);
  } catch (err) {
    warnFallbackOnce(err);
    memoryIncr(loginKey(key), LOGIN_WINDOW_SEC);
  }
}

/** Clears the failure counter after a successful login. */
export async function clearLoginAttempts(key: string): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    memoryClear(loginKey(key));
    return;
  }
  try {
    await redis.del(loginKey(key));
  } catch (err) {
    warnFallbackOnce(err);
    memoryClear(loginKey(key));
  }
}
