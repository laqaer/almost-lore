import type { MetadataRoute } from "next";
import { site, siteUrl } from "@/lib/site";
import { stories, storyPath } from "@/lib/stories";
import { storyMedia } from "@/lib/stories/media";

// `updated` is the day the page's content last changed. Pages reworked in the
// 2026-09-27 pass carry that date; /terms was untouched and keeps the earlier one.
const staticRoutes = [
  { path: "/", priority: 1, updated: "2026-09-27" },
  { path: "/about", priority: 0.6, updated: "2026-09-27" },
  { path: "/contact", priority: 0.6, updated: "2026-09-27" },
  { path: "/now", priority: 0.6, updated: "2026-09-27" },
  { path: "/friends", priority: 0.6, updated: "2026-09-27" },
  { path: "/privacy", priority: 0.6, updated: "2026-09-27" },
  { path: "/dossier", priority: 0.7, updated: "2026-09-27" },
  { path: "/support", priority: 0.4, updated: "2026-09-27" },
  { path: "/terms", priority: 0.4, updated: site.updated },
] as const;

// Build-time metadata route for Next.js static export.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route.path === "/" ? "" : route.path}`,
      lastModified: new Date(route.updated),
      changeFrequency: "monthly" as const,
      priority: route.priority,
    })),
    ...stories.map((story) => {
      const media = storyMedia[story.slug];
      return {
        url: `${base}${storyPath(story.slug)}`,
        lastModified: new Date(story.updated),
        changeFrequency: "monthly" as const,
        priority: 0.8,
        ...(media ? { images: [`${base}${media.src}`] } : {}),
      };
    }),
  ];
}
