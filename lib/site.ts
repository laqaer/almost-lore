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
  updated: "2026-09-11",
} as const;

export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return `https://${site.domain}`;
}

export const fundingNote =
  "Almost Lore may later run ordinary display ads to pay hosting. There are no affiliate tracking IDs on this ship, no buy buttons, and no invented revenue. If ads appear, we will say so here and in the privacy page.";

export const editorialNote =
  "Essays are original prose based on well-documented public facts. We do not scrape Reddit or paste other people's threads. Where the archive is thin or later writers disagree, we say so.";
