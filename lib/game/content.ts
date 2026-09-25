import "server-only";
import claimsData from "@/content/claims.json";
import docketsData from "@/content/dockets.json";
import setsData from "@/content/sets.json";
import type { Claim, Docket, SealedClaim } from "@/lib/game/types";
import { latestClosedDocket, latestOpenDocket } from "@/lib/game/schedule";

/**
 * Server-only access to the claim bank. Future dockets never ship in a client bundle:
 * pages and route handlers pass a docket to the browser only once it is open.
 */

const claims = claimsData as Claim[];
const dockets = docketsData as Docket[];

export type ClaimSet = "gullibility" | "halloween" | "partyPack" | "classroom" | "starter" | "examples";
const sets = setsData as Record<ClaimSet, string[]>;

const byId = new Map(claims.map((claim) => [claim.id, claim]));

export function getClaim(id: string): Claim | undefined {
  return byId.get(id);
}

export function allClaims(): Claim[] {
  return claims;
}

export function docketCount(): number {
  return dockets.length;
}

/**
 * Resolve docket n. If the scheduled bank ever runs dry, replay older dockets rather than
 * break the daily ritual ("encore" dockets); the ops team's job is to never let that happen.
 */
export function getDocket(n: number): (Docket & { claims: Claim[]; encore: boolean }) | null {
  if (!Number.isInteger(n) || n < 1 || dockets.length === 0) return null;
  const encore = n > dockets.length;
  const source = dockets[(n - 1) % dockets.length];
  const docketClaims = source.cards.map((id) => byId.get(id)).filter((c): c is Claim => Boolean(c));
  if (docketClaims.length !== source.cards.length) return null;
  return { ...source, n, claims: docketClaims, encore };
}

export function isDocketOpen(n: number, now: number = Date.now()): boolean {
  return n >= 1 && n <= latestOpenDocket(now);
}

export function isDocketClosed(n: number, now: number = Date.now()): boolean {
  return n >= 1 && n <= latestClosedDocket(now);
}

export function getSet(name: ClaimSet): Claim[] {
  return (sets[name] ?? []).map((id) => byId.get(id)).filter((c): c is Claim => Boolean(c));
}

export function seal(claim: Claim): SealedClaim {
  const { id, year, era, region, topic } = claim;
  return { id, claim: claim.claim, year, era, region, topic };
}

export function claimsForStory(slug: string): Claim[] {
  return claims.filter((claim) => claim.storySlug === slug);
}
