import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Build-time metadata route for Next.js static export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: new URL(siteUrl()).host,
  };
}
