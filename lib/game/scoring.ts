import type { Verdict } from "@/lib/game/types";

export const VERDICT_LABEL: Record<Verdict, string> = {
  happened: "Happened",
  almost: "Almost",
  lore: "Lore",
};

/** Keyboard shortcuts: H/A/L and 1/2/3. */
export const VERDICT_KEY: Record<Verdict, string> = {
  happened: "H",
  almost: "A",
  lore: "L",
};

export const VERDICT_DEF: Record<Verdict, string> = {
  happened: "True exactly as worded",
  almost: "Came documented-close",
  lore: "A popular myth",
};

export const VERDICT_SAY: Record<Verdict, string> = {
  happened: "It really happened.",
  almost: "It almost happened.",
  lore: "It's lore.",
};

export type Rank = { title: string; line: string };

export const RANKS: Rank[] = [
  { title: "Hollywood Screenwriter", line: "Never let the facts get in the way of a good story." },
  { title: "Uncle at Thanksgiving", line: "Loud, certain, and wrong with real conviction." },
  { title: "Tour Guide", line: "Confident. Occasionally correct. Tips welcome." },
  { title: "Pub Quizzer", line: "Dangerous after two pints, respectable before." },
  { title: "Historian", line: "One footnote short of flawless." },
  { title: "Keeper of the Archive", line: "Five for five. No prize, but considerable smugness." },
];

export function rankFor(right: number): Rank {
  return RANKS[Math.max(0, Math.min(5, right))];
}

/** Spoiler-free result row: ✓ kept, ✗ fooled. */
export function glyphRow(correct: boolean[]): string {
  return correct.map((ok) => (ok ? "✓" : "✗")).join("");
}

export function shareText(input: { n: number; correct: boolean[]; trapClaim?: string; url: string }): string {
  const right = input.correct.filter(Boolean).length;
  const lines = [`Almost Lore No. ${input.n} · ${rankFor(right).title}`, `${glyphRow(input.correct)}  ${right}/5`];
  if (input.trapClaim) {
    lines.push("", "Today's trap — happened, almost, or lore?", `“${input.trapClaim}”`);
  }
  lines.push("", input.url);
  return lines.join("\n");
}
