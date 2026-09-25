"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { scoreFor } from "@/lib/game/scoring";
import {
  loadCard,
  recordDocket,
  saveProgress,
  type ClerkCard,
  type DocketRecord,
} from "@/lib/game/storage";
import type { Claim, Verdict } from "@/lib/game/types";

export type DocketGame = {
  index: number;
  picks: Verdict[];
  sealIndex: number | null;
  /** Seal is armed for the current card but not yet committed by a stamp. */
  sealArmed: boolean;
  /** The current card has been stamped and shows its record. */
  revealed: boolean;
  done: boolean;
  correct: boolean[];
  points: number;
  card: ClerkCard | null;
  stamp: (verdict: Verdict) => void;
  next: () => void;
  toggleSeal: () => void;
  restored: boolean;
};

/**
 * State machine for one docket: stamp → reveal → next … → ledger.
 * Progress survives a refresh; a finished docket re-opens straight to its ledger.
 */
export function useDocket(n: number, claims: Claim[], isToday: boolean): DocketGame {
  const [picks, setPicks] = useState<Verdict[]>([]);
  const [index, setIndex] = useState(0);
  const [sealIndex, setSealIndex] = useState<number | null>(null);
  const [sealArmed, setSealArmed] = useState(false);
  const [done, setDone] = useState(false);
  const [card, setCard] = useState<ClerkCard | null>(null);
  const [restored, setRestored] = useState(false);
  const started = useRef(false);

  // Restore from the Clerk's Card after mount (localStorage is client-only).
  useEffect(() => {
    const saved = loadCard();
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from localStorage */
    setCard(saved);
    const finished = saved.dockets[n];
    if (finished) {
      setPicks(finished.picks);
      setSealIndex(finished.sealIndex);
      setIndex(claims.length - 1);
      setDone(true);
    } else if (saved.current?.n === n && saved.current.picks.length > 0) {
      const resumed = saved.current.picks.slice(0, claims.length);
      setPicks(resumed);
      setSealIndex(saved.current.sealIndex);
      setIndex(Math.min(resumed.length, claims.length - 1));
      if (resumed.length >= claims.length) setIndex(claims.length - 1);
    }
    setRestored(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [n, claims.length]);

  const correct = useMemo(
    () => picks.map((pick, i) => claims[i]?.verdict === pick),
    [picks, claims],
  );
  const revealed = picks.length > index;
  const points = scoreFor(correct, sealIndex);

  const stamp = useCallback(
    (verdict: Verdict) => {
      if (done || picks.length > index) return;
      if (!started.current && index === 0) {
        started.current = true;
        track("game_start", { docket: n });
      }
      const nextPicks = [...picks, verdict];
      const nextSeal = sealArmed ? index : sealIndex;
      setPicks(nextPicks);
      setSealIndex(nextSeal);
      setSealArmed(false);
      saveProgress(n, nextPicks, nextSeal);
      track("game_answer", {
        docket: n,
        card: index + 1,
        correct: claims[index]?.verdict === verdict,
        verdict: claims[index]?.verdict ?? "",
      });
    },
    [done, picks, index, sealArmed, sealIndex, n, claims],
  );

  const next = useCallback(() => {
    if (!revealed) return;
    if (index < claims.length - 1) {
      setIndex(index + 1);
      return;
    }
    if (done) return;
    const finalCorrect = picks.map((pick, i) => claims[i].verdict === pick);
    const record: DocketRecord = {
      picks,
      correct: finalCorrect,
      verdicts: claims.map((claim) => claim.verdict),
      sealIndex,
      points: scoreFor(finalCorrect, sealIndex),
      completedAt: new Date().toISOString(),
    };
    setCard(recordDocket(n, record, isToday));
    setDone(true);
    track("game_complete", { docket: n, points: record.points, right: finalCorrect.filter(Boolean).length });
    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ n, correct: finalCorrect }),
      keepalive: true,
    }).catch(() => undefined);
  }, [revealed, index, claims, done, picks, sealIndex, n, isToday]);

  const toggleSeal = useCallback(() => {
    if (sealIndex !== null || revealed || done) return;
    setSealArmed((armed) => !armed);
  }, [sealIndex, revealed, done]);

  return {
    index,
    picks,
    sealIndex,
    sealArmed,
    revealed,
    done,
    correct,
    points,
    card,
    stamp,
    next,
    toggleSeal,
    restored,
  };
}
