import { readFile } from "node:fs/promises";
import path from "node:path";

/** Fonts for next/og (satori needs TTF/OTF, not WOFF2). Committed in /assets/fonts. */
export async function ogFonts() {
  const dir = path.join(process.cwd(), "assets", "fonts");
  const load = (file: string) => readFile(path.join(dir, file));
  const [wood, woodBlack, claim, claimItalic, mono] = await Promise.all([
    load("BigShouldersDisplay-800.ttf"),
    load("BigShouldersDisplay-900.ttf"),
    load("Fraunces-600.ttf"),
    load("Fraunces-500-Italic.ttf"),
    load("IBMPlexMono-600.ttf"),
  ]);
  return [
    { name: "Wood", data: wood, weight: 800 as const, style: "normal" as const },
    { name: "Wood", data: woodBlack, weight: 900 as const, style: "normal" as const },
    { name: "Claim", data: claim, weight: 600 as const, style: "normal" as const },
    { name: "Claim", data: claimItalic, weight: 500 as const, style: "italic" as const },
    { name: "Mono", data: mono, weight: 600 as const, style: "normal" as const },
  ];
}

export const OG = {
  bone: "#F3EBDD",
  boneHi: "#FBF6EC",
  ink: "#141015",
  pink: "#FF4F9A",
  blue: "#2F5BFF",
  sun: "#FFD23F",
} as const;

export const VERDICT_INK = {
  happened: { bg: OG.blue, fg: OG.boneHi, word: "HAPPENED" },
  almost: { bg: OG.pink, fg: OG.ink, word: "ALMOST" },
  lore: { bg: OG.sun, fg: OG.ink, word: "LORE" },
} as const;

export function OgSlab({ v, size = 44 }: { v: keyof typeof VERDICT_INK; size?: number }) {
  const ink = VERDICT_INK[v];
  return (
    <div
      style={{
        display: "flex",
        background: ink.bg,
        color: ink.fg,
        fontFamily: "Wood",
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        padding: `${size * 0.16}px ${size * 0.36}px ${size * 0.1}px`,
        border: `3px solid ${OG.ink}`,
        boxShadow: `6px 6px 0 ${OG.ink}`,
      }}
    >
      {ink.word}
    </div>
  );
}

/** Misregistered wood-type line: a pink drum under the key plate. */
export function OgWood({ text, size, color = OG.ink, ghost = OG.pink }: { text: string; size: number; color?: string; ghost?: string }) {
  return (
    <div style={{ display: "flex", position: "relative", fontFamily: "Wood", fontWeight: 900, fontSize: size, lineHeight: 0.86 }}>
      <div style={{ position: "absolute", left: size * 0.045, top: size * 0.03, color: ghost, display: "flex" }}>{text}</div>
      <div style={{ display: "flex", color }}>{text}</div>
    </div>
  );
}
