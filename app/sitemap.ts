import type { MetadataRoute } from "next";
import { site, siteUrl } from "@/lib/site";
import { stories, storyPath } from "@/lib/stories";

const staticRoutes = ["/", "/about", "/privacy"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.updated);
  const base = siteUrl();

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path === "/" ? "" : path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.6,
    })),
    ...stories.map((story) => ({
      url: `${base}${storyPath(story.slug)}`,
      lastModified: new Date(story.updated),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
