import "server-only";
import { headers } from "next/headers";
import { Redis } from "@upstash/redis";

// Durable per-key limiter. On Vercel (serverless) it uses Upstash Redis so the
// count survives across invocations and instances. With no Upstash env set
// (local dev) it falls back to an in-memory map — fine for a single process.
const hasUpstash = !!(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);
const redis = hasUpstash ? Redis.fromEnv() : null;

const buckets = new Map<string, { count: number; resetAt: number }>();

async function clientIp() {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") || "local";
}

type RateLimitResult = { ok: true } | { ok: false; retryAfterMs: number };

/**
 * Enforce a per-key request cap for a named action. Identifier defaults to the
 * caller's IP; pass an explicit identifier (e.g. an email) to key by account.
 */
export async function rateLimit(
  name: string,
  { max, windowMs }: { max: number; windowMs: number },
  identifier?: string,
): Promise<RateLimitResult> {
  const id = identifier ?? (await clientIp());
  const key = `rl:${name}:${id}`;

  if (redis) {
    const count = await redis.incr(key);
    if (count === 1) await redis.pexpire(key, windowMs);
    if (count > max) {
      const ttl = await redis.pttl(key);
      return { ok: false, retryAfterMs: ttl > 0 ? ttl : windowMs };
    }
    return { ok: true };
  }

  const now = Date.now();
  if (buckets.size > 500) {
    for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
  }
  const entry = buckets.get(key);
  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (entry.count >= max) {
    return { ok: false, retryAfterMs: entry.resetAt - now };
  }
  entry.count += 1;
  return { ok: true };
}

/** Reset a limiter key (e.g. after a successful login). */
export async function clearLimit(name: string, identifier?: string) {
  const id = identifier ?? (await clientIp());
  const key = `rl:${name}:${id}`;
  if (redis) {
    await redis.del(key);
    return;
  }
  buckets.delete(key);
}
