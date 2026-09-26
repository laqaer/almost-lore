export const site = {
  name: "Almost Lore",
  shortName: "Almost Lore",
  tagline: "Public-record near-misses, written as stories.",
  description:
    "Original longform on documented historical near-misses and weird history. No scraped threads, no fake reviews, no invented traffic.",
  domain: "almostlore.com",
  email: "hello@almostlore.com",
  publisher: "Laqaer",
  locale: "en_US",
  updated: "2026-09-26",
} as const;

export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return `https://${site.domain}`;
}

export const fundingNote =
  "The essays are free. A separate printable working file for the Poyais essay is offered at $9 when card checkout is actually open; the dossier page says whether it is. There are no affiliate tracking IDs and no display ads on this ship. If ads are added later to pay hosting, we will say so here and in the privacy page.";

export const editorialNote =
  "Essays are original prose based on well-documented public facts. We do not scrape Reddit or paste other people's threads. Where the archive is thin or later writers disagree, we say so.";
