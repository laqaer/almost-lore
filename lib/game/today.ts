"use client";

import type { Claim } from "@/lib/game/types";
import { todaysDocketNumber } from "@/lib/game/schedule";

export type DocketPayload = {
  n: number;
  theme: string | null;
  encore: boolean;
  claims: Claim[];
};

const cache = new Map<number, Promise<DocketPayload>>();

/** Fetch a docket from the date-gated API once per page, with two quiet retries. */
export function fetchDocket(n: number): Promise<DocketPayload> {
  const hit = cache.get(n);
  if (hit) return hit;
  const attempt = (tries: number): Promise<DocketPayload> =>
    fetch(`/api/docket/${n}`).then((res) => {
      if (res.ok) return res.json() as Promise<DocketPayload>;
      if (tries > 0 && res.status >= 500) return new Promise((r) => setTimeout(r, 700)).then(() => attempt(tries - 1));
      throw new Error(`docket ${n}: ${res.status}`);
    });
  const promise = attempt(2);
  cache.set(n, promise);
  promise.catch(() => cache.delete(n));
  return promise;
}

export function fetchToday(): Promise<DocketPayload> {
  return fetchDocket(todaysDocketNumber());
}
