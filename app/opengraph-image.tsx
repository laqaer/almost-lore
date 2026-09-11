import { ImageResponse } from "next/og";

export const alt = "Almost Lore — public-record near-misses, written as stories";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#2c2218",
          color: "#f3eadc",
          padding: "56px 64px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#d4a08c",
          }}
        >
          Almost Lore
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 500,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              maxWidth: 980,
            }}
          >
            Near-misses from the public record
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 28,
              color: "#d4c3ac",
              maxWidth: 860,
            }}
          >
            Original longform. No scraped threads. Uncertainty left visible.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#a89884" }}>
          almostlore.com · Laqaer
        </div>
      </div>
    ),
    { ...size },
  );
}
