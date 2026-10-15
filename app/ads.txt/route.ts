import { adsTxtBody } from "@/lib/ads";

// Static file for the Next.js static export (`output: "export"`).
export const dynamic = "force-static";

export function GET() {
  return new Response(adsTxtBody(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
