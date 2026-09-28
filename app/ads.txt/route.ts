import { ADS_TXT_CERTIFICATION_AUTHORITY, adsPublisherId } from "@/lib/ads";

// Static file for the Next.js static export (`output: "export"`).
export const dynamic = "force-static";

const NO_SELLERS = [
  "# ads.txt for almostlore.com",
  "# Authorized Digital Sellers (IAB Tech Lab).",
  "#",
  "# No sellers are authorized yet. There are no ad tags on the site.",
  "# A seller line appears once NEXT_PUBLIC_ADS_PUBLISHER_ID names a real",
  "# AdSense account, whether or not ads are being served yet.",
];

export function GET() {
  const publisherId = adsPublisherId();

  const lines = publisherId
    ? [`google.com, ${publisherId}, DIRECT, ${ADS_TXT_CERTIFICATION_AUTHORITY}`]
    : NO_SELLERS;

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
