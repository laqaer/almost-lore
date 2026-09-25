import type { Verdict } from "@/lib/game/types";

export const VERDICT_LABEL: Record<Verdict, string> = {
  happened: "Happened",
  almost: "Almost",
  lore: "Lore",
};

export const VERDICT_KEY: Record<Verdict, string> = {
  happened: "1",
  almost: "2",
  lore: "3",
};

export const VERDICT_BLURB: Record<Verdict, string> = {
  happened: "True, exactly as written.",
  almost: "It came documented-close. It didn't happen.",
  lore: "A story everyone repeats. The record says no.",
};

export type Rank = { title: string; line: string };

/** Score runs 0–6: five cards plus one bonus point for a sealed card that was right. */
export function rankFor(score: number): Rank {
  if (score >= 6) return { title: "Keeper of the Archive", line: "Perfect, and you bet on it." };
  if (score === 5) return { title: "Archivist", line: "The record bows to you." };
  if (score === 4) return { title: "Historian", line: "One footnote short of flawless." };
  if (score === 3) return { title: "Pub Quizzer", line: "Dangerous after two pints." };
  if (score === 2) return { title: "Tour Guide", line: "Confident. Occasionally correct." };
  if (score === 1) return { title: "Uncle at Thanksgiving", line: "Loud, sure, and mostly wrong." };
  return { title: "Hollywood Screenwriter", line: "Never let the facts get in the way." };
}

export function scoreFor(correct: boolean[], sealIndex: number | null): number {
  const base = correct.filter(Boolean).length;
  const bonus = sealIndex !== null && correct[sealIndex] ? 1 : 0;
  return base + bonus;
}

/** Spoiler-free result row: ◆ right, ◇ wrong, the sealed card wrapped in brackets. */
export function glyphRow(correct: boolean[], sealIndex: number | null): string {
  return correct
    .map((ok, i) => {
      const g = ok ? "◆" : "◇";
      return i === sealIndex ? `[${g}]` : g;
    })
    .join(" ");
}

export function sealLine(correct: boolean[], sealIndex: number | null): string {
  if (sealIndex === null) return "no seal";
  return correct[sealIndex] ? "seal kept" : "seal cracked";
}

export function shareText(input: {
  n: number;
  correct: boolean[];
  sealIndex: number | null;
  trapClaim?: string;
  url: string;
}): string {
  const points = scoreFor(input.correct, input.sealIndex);
  const right = input.correct.filter(Boolean).length;
  const lines = [
    `Almost Lore No. ${input.n} · ${rankFor(points).title}`,
    `${glyphRow(input.correct, input.sealIndex)}  ${right}/5 · ${sealLine(input.correct, input.sealIndex)}`,
  ];
  if (input.trapClaim) {
    lines.push(`Today's trap — happened, almost, or lore?`, `“${input.trapClaim}”`);
  }
  lines.push(input.url);
  return lines.join("\n");
}
