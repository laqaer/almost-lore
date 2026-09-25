import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { Analytics, Chrome } from "@/components/analytics";
import { SpriteDefs } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ogImage, openGraphBase } from "@/lib/metadata";
import { organizationJsonLd, websiteJsonLd } from "@/lib/schema";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

// Big Shoulders has an optical-size axis; browsers pick the Display cut automatically at headline sizes.
const wood = Big_Shoulders({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  variable: "--font-wood",
  display: "swap",
});

const claim = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-claim",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const title = "Almost Lore — Happened, almost, or lore? The daily history game";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.publisher }],
  alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: { ...openGraphBase, url: "/", title, description: site.description, images: [ogImage] },
  twitter: { card: "summary_large_image", title, description: site.description, images: [ogImage.url] },
  robots: { index: true, follow: true },
  appleWebApp: { title: site.name, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#f3ebdd",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${wood.variable} ${claim.variable} ${mono.variable}`}>
      <body>
        <SpriteDefs />
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={organizationJsonLd()} />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Chrome hideOn="/class">
          <SiteHeader />
        </Chrome>
        <main id="main">{children}</main>
        <Chrome hideOn="/class">
          <SiteFooter />
        </Chrome>
        <Analytics />
      </body>
    </html>
  );
}
