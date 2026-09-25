"use client";

import { useSyncExternalStore } from "react";
import { DocketPlayer } from "@/components/game/docket-player";
import { decodeChallenge } from "@/lib/game/challenge";
import { todaysDocketNumber } from "@/lib/game/schedule";
import type { DocketPayload } from "@/lib/game/today";

const noop = () => () => {};

/** A specific docket (permalink, archive or challenge link). Streaks count only if it's the viewer's today. */
export function ArchivedDocket({ docket, challengeToken }: { docket: DocketPayload; challengeToken: string | null }) {
  const today = useSyncExternalStore(noop, () => todaysDocketNumber(), () => null);
  if (today === null) {
    return (
      <div className="wrap game">
        <div className="ghost-card pulse mono">Opening No. {docket.n}…</div>
      </div>
    );
  }
  return <DocketPlayer docket={docket} isToday={today === docket.n} challenge={decodeChallenge(challengeToken)} />;
}
