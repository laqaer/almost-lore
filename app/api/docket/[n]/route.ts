import { NextResponse, type NextRequest } from "next/server";
import { getDocket, isDocketClosed, isDocketOpen } from "@/lib/game/content";

/** GET /api/docket/12 — the full docket, but only once it is open somewhere on Earth. */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/docket/[n]">) {
  const { n: raw } = await ctx.params;
  const n = Number(raw);
  if (!Number.isInteger(n) || !isDocketOpen(n)) {
    return NextResponse.json({ error: "not-open" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  const docket = getDocket(n);
  if (!docket) return NextResponse.json({ error: "missing" }, { status: 404 });

  return NextResponse.json(
    {
      n: docket.n,
      theme: docket.theme ?? null,
      encore: docket.encore,
      // Audit quotes stay server-side; players get titles and links.
      claims: docket.claims.map((claim) => ({
        ...claim,
        sources: claim.sources.map(({ title, publisher, url }) => ({ title, publisher, url })),
      })),
    },
    {
      headers: {
        "Cache-Control": isDocketClosed(n)
          ? "public, max-age=3600, s-maxage=86400"
          : "public, max-age=60, s-maxage=300",
      },
    },
  );
}
