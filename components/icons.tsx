import type { Verdict } from "@/lib/game/types";

/**
 * The house glyphs, rendered once as an SVG sprite in the root layout.
 * HAPPENED is a full stop, ALMOST a circle that didn't quite close, LORE an asterisk.
 */
export function SpriteDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="g-happened" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
        </symbol>
        <symbol id="g-almost" viewBox="0 0 24 24">
          <path d="M21.05 8.62 A9.5 9.5 0 1 1 15.38 2.95" fill="none" stroke="currentColor" strokeWidth="4.6" />
        </symbol>
        <symbol id="g-lore" viewBox="0 0 24 24">
          <g stroke="currentColor" strokeWidth="4.2" strokeLinecap="round">
            <path d="M12 2.6v18.8" />
            <path d="M3.86 7.3l16.28 9.4" />
            <path d="M3.86 16.7l16.28-9.4" />
          </g>
        </symbol>
        <symbol id="g-kept" viewBox="0 0 24 24">
          <path d="M3.5 12.5l5.5 5.5L20.5 6.5" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="square" />
        </symbol>
        <symbol id="g-fooled" viewBox="0 0 24 24">
          <path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="square" />
        </symbol>
        <symbol id="hand" viewBox="0 0 120 60">
          <path fill="currentColor" d="M3 13h17v36H3z" />
          <path
            fill="currentColor"
            d="M20 15c7-4 14-6 23-6.4 5-.2 9 .6 13 2.2l51 3.6c9 .6 9 12.4 0 12.8l-40 .6c5 .6 7.4 3.4 7.2 6-.2 3-3 4.6-6.6 4.8 3.6 1 5.2 3.6 4.8 6-.4 2.8-3.2 4.2-6.4 4.4 2.6 1.2 3.6 3.2 3.2 5.2-.6 2.8-3.4 4-7 4H40c-7 0-13-1.6-20-4z"
          />
          <g fill="none" stroke="var(--hand-bg,#F3EBDD)" strokeWidth="2.2" strokeLinecap="round">
            <path d="M8 16v30M14 16v30" />
            <path d="M47 13.5c6 1.6 12 3.6 21 4.6" />
            <path d="M66 27.2c-4 .4-8 1-10 2.2" />
            <path d="M62.5 38c-3.4.2-6 .6-8.4 1.6" />
            <path d="M58.5 47c-3 .2-5.4.6-7.4 1.4" />
          </g>
        </symbol>
      </defs>
    </svg>
  );
}

export function Glyph({ v, className = "glyph", style }: { v: Verdict; className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} aria-hidden="true" focusable="false">
      <use href={`#g-${v}`} />
    </svg>
  );
}

export function Mark({ kind, className }: { kind: "kept" | "fooled"; className?: string }) {
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <use href={`#g-${kind}`} />
    </svg>
  );
}

/** The manicule, the printer's pointing hand. `bg` is the colour behind it (for its knuckle lines). */
export function Hand({ bg, className = "hand" }: { bg?: string; className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      style={bg ? ({ "--hand-bg": bg } as React.CSSProperties) : undefined}
    >
      <use href="#hand" />
    </svg>
  );
}

/** Tally marks for a streak: gates of five. */
export function Tally({ count, className = "tally" }: { count: number; className?: string }) {
  const n = Math.max(0, Math.min(count, 40));
  const gates = Math.floor(n / 5);
  const rest = n % 5;
  const width = Math.max(1, gates * 40 + rest * 7 + 4);
  const strokes: string[] = [];
  for (let g = 0; g < gates; g++) {
    const x = 4 + g * 40;
    strokes.push(`M${x} 4v22M${x + 7} 4v22M${x + 14} 4v22M${x + 21} 4v22M${x - 3} 22L${x + 25} 8`);
  }
  for (let r = 0; r < rest; r++) {
    const x = 4 + gates * 40 + r * 7;
    strokes.push(`M${x} 4v22`);
  }
  return (
    <svg className={className} viewBox={`0 0 ${width} 30`} style={{ width: `${(width / 30) * 22}px` }} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        {strokes.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}

export function Slab({ v, label, className = "" }: { v: Verdict; label?: string; className?: string }) {
  return (
    <span className={`slab v-${v} ${className}`}>
      <Glyph v={v} />
      {label ?? (v === "happened" ? "Happened" : v === "almost" ? "Almost" : "Lore")}
    </span>
  );
}
