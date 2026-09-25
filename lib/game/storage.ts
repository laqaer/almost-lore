import type { Verdict } from "@/lib/game/types";

/**
 * The Clerk's Card: per-browser progress in localStorage. Every read/write is guarded
 * because storage can be blocked (private windows, embedded previews).
 */

const KEY = "almostlore:v2";

export type DocketRecord = {
  picks: Verdict[];
  correct: boolean[];
  verdicts: Verdict[];
  right: number;
  completedAt: string;
};

export type ClerkCard = {
  dockets: Record<string, DocketRecord>;
  /** In-progress docket so a refresh does not lose stamps. */
  current?: { n: number; picks: Verdict[] };
  streak: number;
  maxStreak: number;
  lastCompleted: number | null;
  perVerdict: Record<Verdict, { seen: number; right: number }>;
  testResult?: { right: number; total: number; blindSpot: Verdict | null; completedAt: string };
};

function empty(): ClerkCard {
  return {
    dockets: {},
    streak: 0,
    maxStreak: 0,
    lastCompleted: null,
    perVerdict: {
      happened: { seen: 0, right: 0 },
      almost: { seen: 0, right: 0 },
      lore: { seen: 0, right: 0 },
    },
  };
}

export function loadCard(): ClerkCard {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<ClerkCard>;
    return { ...empty(), ...parsed, perVerdict: { ...empty().perVerdict, ...parsed.perVerdict } };
  } catch {
    return empty();
  }
}

export function saveCard(card: ClerkCard): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(card));
  } catch {
    // storage unavailable: the game still works for this visit
  }
}

export function saveProgress(n: number, picks: Verdict[]): void {
  const card = loadCard();
  card.current = { n, picks };
  saveCard(card);
}

export function recordDocket(n: number, record: DocketRecord, isToday: boolean): ClerkCard {
  const card = loadCard();
  if (card.dockets[n]) return card;
  card.dockets[n] = record;
  if (card.current?.n === n) delete card.current;

  record.verdicts.forEach((verdict, i) => {
    card.perVerdict[verdict].seen += 1;
    if (record.correct[i]) card.perVerdict[verdict].right += 1;
  });

  // Streaks only count dockets played on their own day, like any daily ritual.
  if (isToday) {
    card.streak = card.lastCompleted === n - 1 ? card.streak + 1 : 1;
    card.maxStreak = Math.max(card.maxStreak, card.streak);
    card.lastCompleted = n;
  }
  saveCard(card);
  return card;
}

/** Streak shown to the player: broken if they skipped yesterday. */
export function liveStreak(card: ClerkCard, today: number): number {
  if (card.lastCompleted === today || card.lastCompleted === today - 1) return card.streak;
  return 0;
}

/** The verdict a player misreads most often (needs at least 3 of each seen). */
export function blindSpot(card: ClerkCard): Verdict | null {
  let worst: Verdict | null = null;
  let worstRate = 1;
  (Object.keys(card.perVerdict) as Verdict[]).forEach((verdict) => {
    const { seen, right } = card.perVerdict[verdict];
    if (seen < 3) return;
    const rate = right / seen;
    if (rate < worstRate) {
      worstRate = rate;
      worst = verdict;
    }
  });
  return worstRate < 0.8 ? worst : null;
}

export function saveTestResult(result: NonNullable<ClerkCard["testResult"]>): void {
  const card = loadCard();
  card.testResult = result;
  saveCard(card);
}
