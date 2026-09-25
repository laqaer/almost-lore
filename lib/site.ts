export const site = {
  name: "Almost Lore",
  shortName: "Almost Lore",
  tagline: "It almost happened.",
  promise: "Happened. Almost. Or lore?",
  description:
    "The daily history game of near-misses. Five claims a day — stamp each one HAPPENED, ALMOST or LORE, then read the sourced record. Free, no account, two minutes.",
  domain: "almostlore.com",
  email: "hello@almostlore.com",
  corrections: "corrections@almostlore.com",
  publisher: "Laqaer",
  locale: "en_US",
  updated: "2026-09-25",
  founded: "2026",
} as const;

export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return `https://${site.domain}`;
}

export const fundingNote =
  "Almost Lore is paid for by the things we sell — the Party Pack, the Classroom Pack and seasonal editions — not by selling you. The daily game is free and stays free.";

export const editorialNote =
  "Every claim is researched from sources we link, attacked by an adversarial fact-checker, and cut if the verdict could fairly go two ways. An AI editorial team does the drafting and checking; a human publisher is accountable for what ships. If we get one wrong, we fix it in public.";
