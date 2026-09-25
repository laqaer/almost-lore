import type { Verdict } from "@/lib/game/types";

/**
 * Challenge links carry the challenger's name and stamps in the URL (no database).
 * The friend's UI keeps them sealed until the friend has stamped all five.
 */

export type Challenge = { name: string; picks: Verdict[] };

const CODE: Record<Verdict, string> = { happened: "h", almost: "a", lore: "l" };
const DECODE: Record<string, Verdict> = { h: "happened", a: "almost", l: "lore" };

const BLOCKED = /(fuck|shit|cunt|nigg|fag|rape|nazi|hitler|kike|spic|whore|slut|bitch|dick|cock|pussy)/i;

export function cleanName(raw: string): string {
  const name = raw
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N} .'-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12);
  if (!name || BLOCKED.test(name.replace(/[^a-z]/gi, ""))) return "A friend";
  return name;
}

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

export function encodeChallenge(challenge: Challenge): string {
  return toBase64Url(`2|${cleanName(challenge.name)}|${challenge.picks.map((p) => CODE[p]).join("")}`);
}

export function decodeChallenge(token: string | undefined | null): Challenge | null {
  if (!token || token.length > 80) return null;
  try {
    const [version, name, picks] = fromBase64Url(token).split("|");
    if (version !== "2" || !/^[hal]{5}$/.test(picks ?? "")) return null;
    return { name: cleanName(name ?? ""), picks: picks.split("").map((c) => DECODE[c]) };
  } catch {
    return null;
  }
}
