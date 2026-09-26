export const site = {
  name: "Almost Lore",
  shortName: "Almost Lore",
  tagline: "Public-record near-misses, written as stories.",
  description:
    "A man sold a country that was not on the map. A balloon ditched a hundred miles short. A city was sprayed and told it was fog.",
  domain: "almostlore.com",
  email: "hello@almostlore.com",
  publisher: "Laqaer",
  locale: "en_US",
  updated: "2026-09-25",
} as const;

export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return `https://${site.domain}`;
}

export const fundingNote =
  "Almost Lore is free to read and is meant to be paid for by ordinary display ads. No ad tags are on the site yet: ads.txt is still a placeholder, and nothing here sells a product, a course, or a membership. When authorized sellers are listed, the privacy page will name them.";

export const editorialNote =
  "Essays are original prose based on well-documented public facts. We do not scrape Reddit or paste other people's threads. Where the archive is thin or later writers disagree, we say so.";
