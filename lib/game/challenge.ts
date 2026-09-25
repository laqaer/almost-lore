import type { Verdict } from "@/lib/game/types";

/**
 * Challenge links carry the challenger's name and stamps in the URL (no database).
 * The friend's UI keeps them sealed until the friend has stamped all five.
 */

export type Challenge = {
  name: string;
  picks: Verdict[];
  sealIndex: number | null;
};

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
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeChallenge(challenge: Challenge): string {
  const picks = challenge.picks.map((p) => CODE[p]).join("");
  const seal = challenge.sealIndex === null ? "-" : String(challenge.sealIndex);
  return toBase64Url(`1|${cleanName(challenge.name)}|${picks}|${seal}`);
}

export function decodeChallenge(token: string | undefined | null): Challenge | null {
  if (!token || token.length > 80) return null;
  try {
    const [version, name, picks, seal] = fromBase64Url(token).split("|");
    if (version !== "1" || !/^[hal]{5}$/.test(picks ?? "")) return null;
    const sealIndex = seal === "-" ? null : Number(seal);
    if (sealIndex !== null && !(sealIndex >= 0 && sealIndex < 5)) return null;
    return {
      name: cleanName(name ?? ""),
      picks: picks.split("").map((c) => DECODE[c]),
      sealIndex,
    };
  } catch {
    return null;
  }
}
