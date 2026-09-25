import "server-only";
import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { kvEnabled, kvPipeline } from "@/lib/kv";

/**
 * Abuse limits for the public write endpoints (stats, subscribe, corrections).
 * Uses Upstash when configured; otherwise a per-instance memory window, which is best effort
 * on serverless but still stops a single tight loop.
 * IPs are only ever stored as a salted hash, and only for the length of the window.
 */

export function clientKey(request: NextRequest): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anon";
  const salt = process.env.RATE_LIMIT_SALT || process.env.UPSTASH_REDIS_REST_TOKEN || "almost-lore";
  return createHash("sha256").update(`${salt}:${ip}`).digest("base64url").slice(0, 22);
}

const memory = new Map<string, { count: number; resetAt: number }>();

function memoryHit(key: string, limit: number, windowSec: number): boolean {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    if (memory.size > 5000) memory.clear();
    memory.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

/** True when this caller is still under `limit` requests per `windowSec` for `bucket`. */
export async function allow(request: NextRequest, bucket: string, limit: number, windowSec: number): Promise<boolean> {
  const key = `rl:${bucket}:${clientKey(request)}`;
  if (!kvEnabled()) return memoryHit(key, limit, windowSec);
  try {
    const [count] = await kvPipeline([
      ["INCR", key],
      ["EXPIRE", key, windowSec, "NX"],
    ]);
    return Number(count) <= limit;
  } catch {
    return memoryHit(key, limit, windowSec);
  }
}
