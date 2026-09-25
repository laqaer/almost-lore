import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { cleanName } from "@/lib/game/challenge";
import { OG, OgSlab, OgWood, ogFonts } from "@/lib/og";

/** Share/challenge card for a docket. Spoiler-free: never shows a claim or a verdict. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const n = Math.max(1, Math.min(9999, Number(params.get("n")) || 1));
  const rawName = params.get("name");
  const name = rawName ? cleanName(rawName) : null;
  const score = Math.max(0, Math.min(5, Number(params.get("score")) || 0));
  const rank = (params.get("rank") ?? "").slice(0, 32);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: OG.bone, padding: "48px 60px", color: OG.ink }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Mono", fontSize: 20, letterSpacing: 2 }}>
          <span>ALMOST LORE · THE DAILY HISTORY GAME</span>
          <span>ALMOSTLORE.COM</span>
        </div>
        <div style={{ height: 6, borderTop: `4px solid ${OG.ink}`, borderBottom: `2px solid ${OG.ink}`, marginTop: 18 }} />
        <div style={{ display: "flex", marginTop: 30, alignItems: "flex-end", gap: 30 }}>
          <OgWood text={`NO. ${n}`} size={200} color={OG.ink} ghost={OG.pink} />
        </div>
        {name ? (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 24 }}>
            <span style={{ fontFamily: "Claim", fontWeight: 600, fontSize: 60, lineHeight: 1.05 }}>
              {name} kept {score} of 5{rank ? ` — ${rank}` : ""}.
            </span>
            <span style={{ fontFamily: "Claim", fontStyle: "italic", fontSize: 38, marginTop: 10 }}>Their stamps are sealed. Your turn.</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 24 }}>
            <span style={{ fontFamily: "Claim", fontWeight: 600, fontSize: 60, lineHeight: 1.05 }}>Five claims. Three stamps. One trap.</span>
            <span style={{ fontFamily: "Claim", fontStyle: "italic", fontSize: 38, marginTop: 10 }}>Happened, almost, or lore?</span>
          </div>
        )}
        <div style={{ display: "flex", marginTop: "auto", gap: 16 }}>
          <OgSlab v="happened" size={34} />
          <OgSlab v="almost" size={34} />
          <OgSlab v="lore" size={34} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: await ogFonts(),
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
    },
  );
}
