import type { MetadataRoute } from "next";
import { latestClosedDocket } from "@/lib/game/schedule";
import { site, siteUrl } from "@/lib/site";
import { stories, storyPath } from "@/lib/stories";

export const revalidate = 3600;

const routes: { path: string; priority: number; freq: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, freq: "daily" },
  { path: "/play", priority: 0.9, freq: "daily" },
  { path: "/test", priority: 0.8, freq: "monthly" },
  { path: "/halloween", priority: 0.8, freq: "weekly" },
  { path: "/answers", priority: 0.7, freq: "daily" },
  { path: "/case-files", priority: 0.7, freq: "weekly" },
  { path: "/shop", priority: 0.7, freq: "monthly" },
  { path: "/shop/party-pack", priority: 0.7, freq: "monthly" },
  { path: "/shop/classroom-pack", priority: 0.7, freq: "monthly" },
  { path: "/class", priority: 0.6, freq: "daily" },
  { path: "/newsletter", priority: 0.5, freq: "monthly" },
  { path: "/rules", priority: 0.5, freq: "monthly" },
  { path: "/corrections", priority: 0.4, freq: "weekly" },
  { path: "/about", priority: 0.4, freq: "monthly" },
  { path: "/terms", priority: 0.2, freq: "monthly" },
  { path: "/privacy", priority: 0.2, freq: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.updated);
  const base = siteUrl();
  const closed = latestClosedDocket(Date.now());

  return [
    ...routes.map((r) => ({
      url: `${base}${r.path === "/" ? "" : r.path}`,
      lastModified,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...stories.map((story) => ({
      url: `${base}${storyPath(story.slug)}`,
      lastModified: new Date(story.updated),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...Array.from({ length: Math.max(0, closed) }, (_, i) => ({
      url: `${base}/answers/${i + 1}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
