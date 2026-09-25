import { site, siteUrl } from "@/lib/site";

export function websiteJsonLd() {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url,
    description: site.description,
    inLanguage: "en-US",
    publisher: { "@type": "Organization", name: site.publisher, url },
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
    email: site.email,
    logo: `${url}/icon.svg`,
    description: site.description,
  };
}

export function gameJsonLd() {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: `${site.name} — the daily history game`,
    url: `${url}/play`,
    description: site.description,
    genre: ["Trivia", "History", "Puzzle"],
    gamePlatform: "Web browser",
    applicationCategory: "Game",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: site.publisher },
  };
}

export function articleJsonLd(input: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
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
    inLanguage: "en-US",
    image: input.image ? [input.image] : undefined,
    author: { "@type": "Organization", name: site.name, url: siteUrl() },
    publisher: { "@type": "Organization", name: site.publisher, logo: { "@type": "ImageObject", url: `${siteUrl()}/icon.svg` } },
  };
}

export function productJsonLd(input: { name: string; description: string; path: string; priceCents: number; image?: string }) {
  const url = `${siteUrl()}${input.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    url,
    image: input.image ? [input.image] : undefined,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      price: (input.priceCents / 100).toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
    },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
