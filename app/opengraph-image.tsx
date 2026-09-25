import { ImageResponse } from "next/og";
import { OG, OgSlab, OgWood, ogFonts } from "@/lib/og";

export const alt = "Almost Lore — Happened. Almost. Or lore? The daily history game.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: OG.bone, padding: "48px 60px", color: OG.ink }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Mono", fontSize: 20, letterSpacing: 2 }}>
          <span>ALMOST LORE · A DAILY ALMANAC OF NEAR-MISSES</span>
          <span>ALMOSTLORE.COM</span>
        </div>
        <div style={{ height: 6, borderTop: `4px solid ${OG.ink}`, borderBottom: `2px solid ${OG.ink}`, marginTop: 18 }} />
        <div style={{ display: "flex", flexDirection: "column", marginTop: 34, gap: 8 }}>
          <OgWood text="HAPPENED." size={150} color={OG.blue} />
          <div style={{ display: "flex", alignItems: "flex-end", gap: 28 }}>
            <div style={{ display: "flex", background: OG.pink, padding: "8px 18px 0", transform: "rotate(-2deg)", boxShadow: `8px 8px 0 ${OG.ink}` }}>
              <span style={{ fontFamily: "Wood", fontWeight: 900, fontSize: 150, lineHeight: 0.86 }}>ALMOST.</span>
            </div>
            <OgWood text="OR LORE?" size={150} />
          </div>
        </div>
        <div style={{ display: "flex", marginTop: "auto", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "Claim", fontStyle: "italic", fontSize: 34 }}>Five history claims a day. Stamp them. Open the record.</span>
          <div style={{ display: "flex", gap: 16 }}>
            <OgSlab v="happened" size={30} />
            <OgSlab v="almost" size={30} />
            <OgSlab v="lore" size={30} />
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
