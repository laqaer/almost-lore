import { site, siteUrl } from "@/lib/site";

export function websiteJsonLd() {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url,
    description: site.description,
    publisher: {
      "@type": "Organization",
      name: site.publisher,
      url,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: `${url}/support`,
      },
    },
    inLanguage: "en-US",
  };
}

export function articleJsonLd(input: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  images?: string[];
}) {
  const url = `${siteUrl()}${input.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url,
    mainEntityOfPage: url,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    ...(input.images && input.images.length > 0 ? { image: input.images } : {}),
    inLanguage: "en-US",
    author: {
      "@type": "Organization",
      name: site.name,
    },
    publisher: {
      "@type": "Organization",
      name: site.publisher,
    },
  };
}

export function organizationJsonLd() {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.publisher,
    url,
    description: site.description,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial",
      url: `${url}/contact`,
    },
  };
}
