import { site, siteUrl } from "@/lib/site";
import { stories } from "@/lib/stories";

export const dynamic = "force-static";

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS for the Case Files. Newsletter providers can mail new essays from this feed. */
export function GET() {
  const base = siteUrl();
  const items = [...stories]
    .sort((a, b) => b.published.localeCompare(a.published))
    .map((story) => {
      const url = `${base}/case-files/${story.slug}`;
      return `<item>
  <title>${escape(story.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <pubDate>${new Date(story.published).toUTCString()}</pubDate>
  <category>${story.verdict.toUpperCase()}</category>
  <description>${escape(story.dek)}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escape(site.name)} — Case Files</title>
  <link>${base}/case-files</link>
  <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
  <description>${escape("Longform on history's near-misses, myths and true stories that sound made up.")}</description>
  <language>en-us</language>
${items}
</channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
