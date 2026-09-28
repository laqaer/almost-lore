export const site = {
  name: "Almost Lore",
  shortName: "Almost Lore",
  tagline: "Public-record near-misses, written as stories.",
  description:
    "Original longform on documented historical near-misses and the odder corners of the public record.",
  domain: "almostlore.com",
  email: "hello@almostlore.com",
  publisher: "Laqaer",
  locale: "en_US",
  updated: "2026-09-27",
} as const;

export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return `https://${site.domain}`;
}

export const fundingNote =
  "The essays are free to read. A separate printable working file for the Poyais essay is offered at $9 when card checkout is open; the dossier page says whether it is. There are no display ads and no affiliate links on the site today. If either is added later to cover hosting, this page and the privacy page will name it.";

export const editorialNote =
  "Essays are original prose built from the public record — loan notices, trial files, dispatches, contemporaneous news — and each piece names what it draws on. Where the archive is thin or later writers disagree, the disagreement stays visible.";
