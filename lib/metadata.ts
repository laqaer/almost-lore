import type { Metadata } from "next";
import { site, siteUrl } from "@/lib/site";

/** Default social image, served by app/opengraph-image.tsx. */
export const ogImage = {
  url: `${siteUrl()}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: "Almost Lore — Happened. Almost. Or lore? The daily history game.",
} as const;

/**
 * Shared Open Graph fields. Next.js shallow-replaces the parent `openGraph` when a child sets one,
 * so every page builds its metadata through pageMetadata() to keep these.
 */
export const openGraphBase = {
  type: "website" as const,
  locale: site.locale,
  siteName: site.name,
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  /** Absolute or root-relative image URL; defaults to the site image. */
  image?: { url: string; width?: number; height?: number; alt?: string };
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  /** Use the title as-is instead of the "%s · Almost Lore" template. */
  absoluteTitle?: boolean;
};

export function pageMetadata(input: PageMetadataInput): Metadata {
  const image = input.image ?? ogImage;
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      ...openGraphBase,
      type: input.type ?? "website",
      title: input.title,
      description: input.description,
      url: input.path,
      images: [image],
      ...(input.type === "article"
        ? { publishedTime: input.publishedTime, modifiedTime: input.modifiedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image.url],
    },
    ...(input.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
