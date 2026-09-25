export type Verdict = "happened" | "almost" | "lore";

export const VERDICTS: readonly Verdict[] = ["happened", "almost", "lore"] as const;

export type Era =
  | "ancient"
  | "medieval"
  | "early-modern"
  | "19th-century"
  | "20th-century"
  | "21st-century";

export type ClaimSource = {
  title: string;
  publisher: string;
  url: string;
  /** Verbatim supporting sentence from the page (kept for audits; not always shown). */
  quote?: string;
};

export type Claim = {
  id: string;
  /** Written as plain fact, ≤ 110 chars. Never shown out of context without a verdict or the question framing. */
  claim: string;
  verdict: Verdict;
  year: string;
  yearSort: number;
  era: Era;
  region: string;
  topic: string;
  /** What actually happened, 2–3 sentences. */
  record: string;
  /** LORE only: where the myth came from. */
  origin?: string;
  sources: ClaimSource[];
  difficulty: 1 | 2 | 3;
  schoolSafe: boolean;
  solemn: boolean;
  tags: string[];
  storySlug?: string;
  /** Fairness/fun/telegraph scores (1–5) from the gauntlet's judge; used to pick traps. */
  scores?: { fairness: number; fun: number; telegraph: number };
  /** Schedule this claim on the docket that goes live on this date (anniversaries). */
  pinDate?: string;
};

/** The subset of a claim that is safe to send before the player stamps it. */
export type SealedClaim = Pick<Claim, "id" | "claim" | "year" | "era" | "region" | "topic">;

export type Docket = {
  /** 1-based docket number. Docket n goes live on EPOCH + (n - 1) days, local midnight. */
  n: number;
  /** Claim ids, in play order. The last one is always THE TRAP. */
  cards: string[];
  /** Optional theme label, e.g. "Thirteen Days: the Cuban Missile Crisis". */
  theme?: string;
};

export type Answer = {
  id: string;
  pick: Verdict;
  correct: boolean;
};
