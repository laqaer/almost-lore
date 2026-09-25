"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DocketPlayer } from "@/components/game/docket-player";
import { StampButtons, useStampKeys } from "@/components/game/stamp-rack";
import { Hand } from "@/components/icons";
import { rankFor, VERDICT_LABEL } from "@/lib/game/scoring";
import { todaysDocketNumber } from "@/lib/game/schedule";
import { loadCard } from "@/lib/game/storage";
import { fetchToday, type DocketPayload } from "@/lib/game/today";
import type { Verdict } from "@/lib/game/types";
import { useDocket } from "@/lib/game/use-docket";

function useToday(): { docket: DocketPayload | null; failed: boolean } {
  const [docket, setDocket] = useState<DocketPayload | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    fetchToday()
      .then((d) => live && setDocket(d))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, []);
  return { docket, failed };
}

/** /play — today's docket by the viewer's local date. */
export function TodayGame() {
  const { docket, failed } = useToday();
  if (failed) {
    return (
      <div className="wrap game">
        <div className="ghost-card mono" role="alert">
          The archive door is stuck. Refresh to try again.
        </div>
      </div>
    );
  }
  if (!docket) {
    return (
      <div className="wrap game">
        <div className="ghost-card pulse mono" aria-busy="true">
          Opening today&apos;s docket…
        </div>
      </div>
    );
  }
  return <DocketPlayer docket={docket} isToday />;
}

/** The ticket in the home-page hero: today's current claim, playable with zero clicks. */
export function HeroTicket() {
  const { docket, failed } = useToday();
  if (failed) {
    return (
      <article className="ticket" aria-label="Today's docket">
        <div className="stub" aria-hidden="true">
          <span className="mono-s">Admit one skeptic</span>
        </div>
        <div className="t-main">
          <p className="t-claim claim">The archive door is stuck.</p>
          <Link className="btn" href="/play">
            Try the docket page <Hand bg="var(--ink)" />
          </Link>
        </div>
      </article>
    );
  }
  if (!docket) {
    return (
      <article className="ticket pulse" aria-busy="true" aria-label="Loading today's first claim">
        <div className="stub" aria-hidden="true">
          <span className="mono-s">Admit one skeptic</span>
        </div>
        <div className="t-main">
          <p className="mono">Pulling today&apos;s first claim…</p>
        </div>
      </article>
    );
  }
  return <HeroTicketInner docket={docket} />;
}

function HeroTicketInner({ docket }: { docket: DocketPayload }) {
  const router = useRouter();
  const game = useDocket(docket.n, docket.claims, true);
  const [slam, setSlam] = useState<Verdict | null>(null);
  const claim = docket.claims[game.index];

  function onStamp(v: Verdict) {
    if (slam || game.revealed || game.done) return;
    setSlam(v);
    game.stamp(v);
    if ("vibrate" in navigator) navigator.vibrate?.(12);
    window.setTimeout(() => router.push("/play"), 900);
  }

  const handler = useStampKeys({ enabled: game.restored && !game.revealed && !game.done && !slam, onStamp });
  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);

  const stub = (
    <div className="stub" aria-hidden="true">
      <span className="mono-s">Admit one skeptic</span>
      <span className="wood">No. {docket.n}</span>
    </div>
  );

  if (!game.restored) {
    return (
      <article className="ticket pulse" aria-busy="true">
        {stub}
        <div className="t-main" />
      </article>
    );
  }

  if (game.done) {
    const right = game.right;
    return (
      <article className="ticket" aria-label={`No. ${docket.n} is filed`}>
        {stub}
        <div className="t-main">
          <div className="t-head">
            <span className="mono">
              No. {docket.n} · <b>filed</b>
            </span>
          </div>
          <p className="claim t-claim">
            You kept {right} of 5. {rankFor(right).title}.
          </p>
          <div className="t-done">
            <p>Tomorrow&apos;s five go to press at your midnight. Until then: the archive, the Gullibility Test, or your ledger.</p>
            <div className="btnrow">
              <Link className="btn" href="/play">
                See the ledger <Hand bg="var(--ink)" />
              </Link>
              <Link className="btn ghost" href="/answers">
                Play the archive
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (game.revealed && !slam) {
    return (
      <article className="ticket" aria-label="Your stamp is down">
        {stub}
        <div className="t-main">
          <div className="t-head">
            <span className="mono">
              Claim <b>{game.index + 1}</b> of 5
            </span>
          </div>
          <p className="claim t-claim">{claim.claim}</p>
          <div className="t-done">
            <p>
              You stamped it <b>{VERDICT_LABEL[game.picks[game.index]].toUpperCase()}</b>. The record is open on the docket
              page.
            </p>
            <div>
              <Link className="btn" href="/play">
                Open the record <Hand bg="var(--ink)" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`ticket ${slam ? "thunk" : ""}`} id="today" aria-label="Today's claim">
      {stub}
      <div className="t-main">
        <div className="t-head">
          <span className="mono">
            Claim <b>{game.index + 1}</b> of 5
          </span>
          <ol className="pips" aria-hidden="true">
            {docket.claims.map((c, i) => (
              <li key={c.id} className={i === game.index ? "on" : i < game.index ? "done" : i === 4 ? "trap" : ""}>
                {i === 4 ? "Trap" : i + 1}
              </li>
            ))}
          </ol>
          <span className="mono-s cat">
            Filed under: {claim.topic.replace(/-/g, " ")}, {claim.year}
          </span>
        </div>
        <p className="claim t-claim">{claim.claim}</p>
        <p className="mono prompt">
          <Hand /> Stamp it. Then we open the record. <span className="mono-s keys">Keys: H · A · L</span>
        </p>
        <StampButtons onStamp={onStamp} pressed={slam} />
        <div className="t-foot mono-s">
          <span>Sources unsealed after you stamp</span>
          <span>No peeking. No googling. No Uncle Dave.</span>
        </div>
        {slam ? (
          <div className={`impression slam v-${slam}`} aria-hidden="true">
            {VERDICT_LABEL[slam]}
            <small>
              Filed · No. {docket.n} · {game.index + 1}/5
            </small>
          </div>
        ) : null}
      </div>
    </article>
  );
}

/** The five face-down cards in the home page's blue docket band. */
export function DocketBacks() {
  const { docket } = useToday();
  const [progress, setProgress] = useState<{ picks: number; done: boolean }>({ picks: 0, done: false });
  useEffect(() => {
    const card = loadCard();
    const n = todaysDocketNumber();
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- read-once from localStorage */
    setProgress({ picks: card.current?.n === n ? card.current.picks.length : 0, done: Boolean(card.dockets[n]) });
  }, []);

  const items = docket?.claims ?? Array.from({ length: 5 }, () => null);
  return (
    <ol className="backs">
      {items.map((claim, i) => {
        const isTrap = i === 4;
        const state = progress.done || i < progress.picks ? "done" : i === progress.picks ? "now" : "";
        return (
          <li key={claim?.id ?? i} className={`back ${isTrap ? "trap" : state}`}>
            {state === "now" && !isTrap ? <span className="mono-s flag">Up next</span> : null}
            <span className="mono-s">Claim</span>
            <span className="n">{i + 1}</span>
            <span className="cat">
              <span className="wood">{isTrap ? "The trap" : claim ? claim.topic.replace(/-/g, " ") : "· · ·"}</span>
              <span className="mono-s">{isTrap ? "Subject withheld" : claim ? `${claim.region} · ${claim.year}` : "Face down"}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
