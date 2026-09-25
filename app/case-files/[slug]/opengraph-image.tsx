import { ImageResponse } from "next/og";
import { OG, OgSlab, ogFonts } from "@/lib/og";
import { getStory, stories } from "@/lib/stories";

export const alt = "An Almost Lore case file";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export default async function CaseFileImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getStory(slug);
  const title = story?.title ?? "Case file";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: OG.bone, padding: "48px 60px", color: OG.ink }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Mono", fontSize: 20, letterSpacing: 2 }}>
          <span>ALMOST LORE · CASE FILE {story ? `· ${story.yearLabel.toUpperCase()}` : ""}</span>
          <span>ALMOSTLORE.COM</span>
        </div>
        <div style={{ height: 6, borderTop: `4px solid ${OG.ink}`, borderBottom: `2px solid ${OG.ink}`, marginTop: 18 }} />
        <div style={{ display: "flex", flexDirection: "column", marginTop: 44, maxWidth: 960 }}>
          <span style={{ fontFamily: "Claim", fontWeight: 600, fontSize: title.length > 40 ? 76 : 92, lineHeight: 1.02, letterSpacing: -2 }}>{title}</span>
        </div>
        <div style={{ display: "flex", marginTop: "auto", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontFamily: "Claim", fontStyle: "italic", fontSize: 30, maxWidth: 760, lineHeight: 1.2 }}>
            {story ? story.hook.slice(0, 120) + (story.hook.length > 120 ? "…" : "") : ""}
          </span>
          {story ? <OgSlab v={story.verdict} size={64} /> : null}
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
