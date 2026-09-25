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

const VERDICT_SET = new Set<string>(["happened", "almost", "lore"]);
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isInt = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 0;
const isVerdicts = (v: unknown): v is Verdict[] => Array.isArray(v) && v.every((x) => VERDICT_SET.has(x as string));

/** Rebuild the card field by field, so a corrupt or hand-edited value can't crash the game. */
function sanitize(raw: unknown): ClerkCard {
  const card = empty();
  if (!isObj(raw)) return card;
  if (isObj(raw.dockets)) {
    for (const [n, rec] of Object.entries(raw.dockets)) {
      if (
        isObj(rec) &&
        isVerdicts(rec.picks) &&
        isVerdicts(rec.verdicts) &&
        Array.isArray(rec.correct) &&
        rec.correct.every((x) => typeof x === "boolean") &&
        isInt(rec.right)
      ) {
        card.dockets[n] = {
          picks: rec.picks,
          verdicts: rec.verdicts,
          correct: rec.correct as boolean[],
          right: rec.right,
          completedAt: typeof rec.completedAt === "string" ? rec.completedAt : "",
        };
      }
    }
  }
  if (isObj(raw.current) && isInt(raw.current.n) && isVerdicts(raw.current.picks)) {
    card.current = { n: raw.current.n, picks: raw.current.picks };
  }
  if (isInt(raw.streak)) card.streak = raw.streak;
  if (isInt(raw.maxStreak)) card.maxStreak = raw.maxStreak;
  if (isInt(raw.lastCompleted)) card.lastCompleted = raw.lastCompleted;
  if (isObj(raw.perVerdict)) {
    for (const v of ["happened", "almost", "lore"] as const) {
      const pv = raw.perVerdict[v];
      if (isObj(pv) && isInt(pv.seen) && isInt(pv.right)) card.perVerdict[v] = { seen: pv.seen, right: pv.right };
    }
  }
  const t = raw.testResult;
  if (isObj(t) && isInt(t.right) && isInt(t.total) && (t.blindSpot === null || VERDICT_SET.has(t.blindSpot as string))) {
    card.testResult = {
      right: t.right,
      total: t.total,
      blindSpot: t.blindSpot as Verdict | null,
      completedAt: typeof t.completedAt === "string" ? t.completedAt : "",
    };
  }
  return card;
}

export function loadCard(): ClerkCard {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    return sanitize(JSON.parse(raw));
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
