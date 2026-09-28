import { site, siteUrl } from "@/lib/site";
import { stories, storyPath } from "@/lib/stories";

// Static file for the Next.js static export (`output: "export"`).
export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(date: string): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? new Date(0).toUTCString() : parsed.toUTCString();
}

export function GET() {
  const base = siteUrl();
  const ordered = [...stories].sort((a, b) => b.published.localeCompare(a.published));

  const items = ordered.map((story) => {
    const url = `${base}${storyPath(story.slug)}`;
    return [
      "    <item>",
      `      <title>${escapeXml(story.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${rfc822(story.published)}</pubDate>`,
      `      <description>${escapeXml(story.dek)}</description>`,
      "    </item>",
    ].join("\n");
  });

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(site.name)}</title>`,
    `    <link>${escapeXml(base)}</link>`,
    `    <description>${escapeXml(site.description)}</description>`,
    "    <language>en-us</language>",
    `    <lastBuildDate>${rfc822(site.updated)}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(`${base}/feed.xml`)}" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
