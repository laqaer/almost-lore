"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { loadCard, recordDocket, saveProgress, type ClerkCard, type DocketRecord } from "@/lib/game/storage";
import type { Claim, Verdict } from "@/lib/game/types";

export type DocketGame = {
  index: number;
  picks: Verdict[];
  /** The current card has been stamped and shows its record. */
  revealed: boolean;
  done: boolean;
  correct: boolean[];
  right: number;
  card: ClerkCard | null;
  restored: boolean;
  /** Seconds the player spent on the current card before stamping it. */
  lastSeconds: number | null;
  stamp: (verdict: Verdict) => void;
  next: () => void;
};

/**
 * State machine for one docket: stamp → reveal → next … → ledger.
 * Progress survives a refresh; a finished docket re-opens straight to its ledger.
 */
export function useDocket(n: number, claims: Claim[], isToday: boolean): DocketGame {
  const [picks, setPicks] = useState<Verdict[]>([]);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [card, setCard] = useState<ClerkCard | null>(null);
  const [restored, setRestored] = useState(false);
  const [lastSeconds, setLastSeconds] = useState<number | null>(null);
  const shownAt = useRef<number>(0);

  // Restore from the Clerk's Card after mount (localStorage is client-only).
  useEffect(() => {
    const saved = loadCard();
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from localStorage */
    setCard(saved);
    const finished = saved.dockets[n];
    if (finished) {
      setPicks(finished.picks);
      setIndex(claims.length - 1);
      setDone(true);
    } else if (saved.current?.n === n && saved.current.picks.length > 0) {
      const resumed = saved.current.picks.slice(0, claims.length);
      setPicks(resumed);
      // Resume on the last stamped card (its record is showing) so nothing is skipped.
      setIndex(Math.max(0, resumed.length - 1));
    }
    setRestored(true);
    shownAt.current = Date.now();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [n, claims.length]);

  const correct = useMemo(() => picks.map((pick, i) => claims[i]?.verdict === pick), [picks, claims]);
  const revealed = picks.length > index;
  const right = correct.filter(Boolean).length;

  const stamp = useCallback(
    (verdict: Verdict) => {
      if (done || picks.length > index) return;
      if (index === 0 && picks.length === 0) track("game_start", { docket: n });
      const nextPicks = [...picks, verdict];
      setPicks(nextPicks);
      setLastSeconds(shownAt.current ? Math.max(1, Math.round((Date.now() - shownAt.current) / 1000)) : null);
      saveProgress(n, nextPicks);
      track("game_answer", {
        docket: n,
        card: index + 1,
        correct: claims[index]?.verdict === verdict,
        verdict: claims[index]?.verdict ?? "",
      });
    },
    [done, picks, index, n, claims],
  );

  const next = useCallback(() => {
    if (!revealed || done) return;
    if (index < claims.length - 1) {
      setIndex(index + 1);
      shownAt.current = Date.now();
      return;
    }
    const finalCorrect = picks.map((pick, i) => claims[i].verdict === pick);
    const record: DocketRecord = {
      picks,
      correct: finalCorrect,
      verdicts: claims.map((claim) => claim.verdict),
      right: finalCorrect.filter(Boolean).length,
      completedAt: new Date().toISOString(),
    };
    setCard(recordDocket(n, record, isToday));
    setDone(true);
    track("game_complete", { docket: n, right: record.right });
    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ n, correct: finalCorrect }),
      keepalive: true,
    }).catch(() => undefined);
  }, [revealed, index, claims, done, picks, n, isToday]);

  return { index, picks, revealed, done, correct, right, card, restored, lastSeconds, stamp, next };
}
