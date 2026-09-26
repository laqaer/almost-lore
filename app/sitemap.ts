import type { MetadataRoute } from "next";
import { site, siteUrl } from "@/lib/site";
import { stories, storyPath } from "@/lib/stories";

const staticRoutes = [
  { path: "/", priority: 1, updated: site.updated },
  { path: "/about", priority: 0.6, updated: "2026-09-21" },
  { path: "/now", priority: 0.6, updated: "2026-09-21" },
  { path: "/friends", priority: 0.6, updated: "2026-09-26" },
  { path: "/privacy", priority: 0.6, updated: site.updated },
  { path: "/dossier", priority: 0.7, updated: "2026-09-26" },
  { path: "/dossier/thanks", priority: 0.2, updated: "2026-09-26" },
  { path: "/support", priority: 0.4, updated: "2026-09-26" },
  { path: "/terms", priority: 0.4, updated: "2026-09-26" },
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
    ...stories.map((story) => ({
      url: `${base}${storyPath(story.slug)}`,
      lastModified: new Date(story.updated),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
