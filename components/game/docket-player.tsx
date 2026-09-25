"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Glyph, Hand, Mark, Slab, Tally } from "@/components/icons";
import { Ledger } from "@/components/game/ledger";
import { StampButtons, useStampKeys } from "@/components/game/stamp-rack";
import type { Challenge } from "@/lib/game/challenge";
import { formatDocketDate, todaysDocketNumber } from "@/lib/game/schedule";
import { VERDICT_LABEL, VERDICT_SAY } from "@/lib/game/scoring";
import { liveStreak } from "@/lib/game/storage";
import type { DocketPayload } from "@/lib/game/today";
import type { Claim, Verdict } from "@/lib/game/types";
import { useDocket } from "@/lib/game/use-docket";

type Stats = { enabled: boolean; plays?: number; right?: (number | null)[] };

const ANGLES = [-8, 6, -5, 9, -7];
const WEAR = ["0 0", "-120px -40px", "-60px -90px", "-200px -20px", "-30px -130px"];

const NOTES = [
  <>
    <b>ALMOST</b> means the paperwork exists: an offer made, a vote held, a plan drawn up, a fuse lit. A rumour
    doesn&apos;t count.
  </>,
  <>
    <b>HAPPENED</b> means every word survives the archive — the date, the names, the numbers. Roughly true is
    not true.
  </>,
  <>
    <b>LORE</b> is the story everyone repeats. If it genuinely came close to happening, it&apos;s ALMOST instead.
  </>,
  <>
    Card five is <b>the trap</b>: the hardest claim of the day. It has read the same myths you have.
  </>,
  <>
    <b>This is the trap.</b> Trust the record, not the rumour — and not the confident voice in your head.
  </>,
];

function topicLabel(claim: Claim): string {
  return `${claim.topic.replace(/-/g, " ")} · ${claim.year}`;
}

export function DocketPlayer({
  docket,
  isToday,
  challenge,
}: {
  docket: DocketPayload;
  isToday: boolean;
  challenge?: Challenge | null;
}) {
  const { claims, n } = docket;
  const game = useDocket(n, claims, isToday);
  const [stats, setStats] = useState<Stats | null>(null);
  const recordRef = useRef<HTMLHeadingElement>(null);
  const tableRef = useRef<HTMLElement>(null);
  const claim = claims[game.index];
  const pick = game.picks[game.index];
  const correct = pick ? pick === claim.verdict : false;
  const streak = game.card ? liveStreak(game.card, todaysDocketNumber()) : 0;

  // Aggregate stats appear only when the owner enabled them and the sample is big enough.
  useEffect(() => {
    if ((!game.revealed && !game.done) || stats) return;
    fetch(`/api/stats?n=${n}`)
      .then((res) => res.json())
      .then((json: Stats) => setStats(json))
      .catch(() => setStats({ enabled: false }));
  }, [game.revealed, game.done, n, stats]);

  function onStamp(v: Verdict) {
    if (game.revealed || game.done) return;
    game.stamp(v);
    if ("vibrate" in navigator) navigator.vibrate?.(12);
    window.setTimeout(() => recordRef.current?.focus({ preventScroll: true }), 450);
  }

  function onNext() {
    game.next();
    window.setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 30);
  }

  const handler = useStampKeys({
    enabled: game.restored && !game.revealed && !game.done,
    onStamp,
    onNext,
    canNext: game.revealed && !game.done,
  });
  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);

  const splats = useMemo(
    () =>
      [
        [9, 92, 92],
        [5, 66, 84],
        [12, 360, 250],
        [4, 340, 272],
      ].map(([size, right, bottom], i) => ({ size, right: right + game.index * 7, bottom: bottom - game.index * 5, i })),
    [game.index],
  );

  if (!game.restored) {
    return (
      <div className="wrap game">
        <div className="ghost-card pulse mono">Opening the docket…</div>
      </div>
    );
  }

  const header = (
    <div className="edition-bar">
      <span className="wood">No. {n}</span>
      <span className="mono-s">
        {formatDocketDate(n)}
        {docket.theme ? ` · ${docket.theme}` : ""}
        {docket.encore ? " · Encore edition" : ""}
      </span>
      <div className="right">
        {streak > 0 ? (
          <span className="streak" aria-label={`${streak}-day streak`}>
            <Tally count={streak} />
            <span className="mono-s hide-s">
              <b>{streak}</b>-day streak
            </span>
          </span>
        ) : null}
        <Link className="mono-s hide-s" href="/rules">
          How to play
        </Link>
        <Link className="mono-s hide-s" href="/answers">
          Archive
        </Link>
      </div>
    </div>
  );

  if (game.done) {
    return (
      <div className="game">
        <div className="wrap">{header}</div>
        <Ledger docket={docket} game={game} isToday={isToday} challenge={challenge} stats={stats} streak={streak} />
      </div>
    );
  }

  const isTrap = game.index === claims.length - 1;

  return (
    <div className="game">
      <div className="wrap">
        {header}
        {challenge && game.picks.length === 0 ? (
          <p className="challenge-banner">
            <Hand bg="var(--sun)" />
            <span>
              <b>{challenge.name}</b> stamped No. {n} and sealed the results. Stamp all five to break the seal.
            </span>
          </p>
        ) : null}

        <ol className="rail" aria-label="Today's five claims">
          {claims.map((item, i) => {
            const p = game.picks[i];
            const state = p ? "done" : i === game.index ? "now" : "down";
            const kept = p ? p === item.verdict : false;
            return (
              <li
                key={item.id}
                className={`${i === game.index ? "now" : ""} ${state === "down" ? "down" : ""} ${i === claims.length - 1 ? "trap" : ""}`}
                aria-current={i === game.index ? "step" : undefined}
              >
                <span className="n">{i + 1}</span>
                <span className="mono-s cat">{i === claims.length - 1 && !p ? "The trap" : topicLabel(item)}</span>
                {p ? (
                  <Slab v={item.verdict} />
                ) : (
                  <span className="face">{i === game.index ? "On the desk" : "Face down"}</span>
                )}
                <span className={`res ${p ? (kept ? "kept" : "fooled") : ""}`}>
                  {p ? (
                    <>
                      <Mark kind={kept ? "kept" : "fooled"} />
                      {kept ? "Kept" : "Fooled"}
                    </>
                  ) : (
                    <svg className="mini-g" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
                    </svg>
                  )}
                  <span className="sr">
                    {p ? (kept ? "kept" : "fooled") : i === game.index ? "current claim" : "not yet played"}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        <section className="table" aria-label={`Claim ${game.index + 1} of ${claims.length}`} ref={tableRef}>
          <div>
            <div className="side-label mono-s">
              <span>
                <b>Side A</b> · the claim{pick ? ", as stamped" : ""}
              </span>
              <span>{isTrap ? "The trap" : `Claim ${game.index + 1} of ${claims.length}`}</span>
            </div>
            <div className="stack">
              <div className="ghost g1" />
              <div className="ghost g2" />
              <article className={`card ${pick ? "thunk" : ""}`} key={claim.id}>
                <div className="card-head">
                  <span className="wood">
                    No. {n} / {game.index + 1}
                  </span>
                  <span className="mono-s">
                    Filed under: {claim.topic.replace(/-/g, " ")}, {claim.year}
                  </span>
                </div>
                <p className="claim">{claim.claim}</p>
                {pick ? (
                  <>
                    <div
                      className={`impression v-${pick} imp`}
                      aria-hidden="true"
                      style={
                        {
                          "--rot": `${ANGLES[game.index % ANGLES.length]}deg`,
                          "--wear-pos": WEAR[game.index % WEAR.length],
                        } as React.CSSProperties
                      }
                    >
                      {VERDICT_LABEL[pick]}
                      <small>
                        Filed · No. {n} · {game.index + 1}/5
                      </small>
                    </div>
                    {!claim.solemn
                      ? splats.map((s) => (
                          <span
                            key={s.i}
                            className={`splat v-${pick}`}
                            style={{ width: s.size, height: s.size, right: s.right, bottom: s.bottom }}
                            aria-hidden="true"
                          />
                        ))
                      : null}
                  </>
                ) : null}
                <div className="card-foot mono-s">
                  {pick ? (
                    <span>
                      You stamped <Slab v={pick} />
                      {game.lastSeconds ? (
                        <>
                          {" "}
                          in <b>{game.lastSeconds} {game.lastSeconds === 1 ? "second" : "seconds"}</b>
                        </>
                      ) : null}
                    </span>
                  ) : (
                    <span>Sources unsealed after you stamp</span>
                  )}
                  <span>{pick ? "Side B →" : "No peeking. No googling. No Uncle Dave."}</span>
                </div>
              </article>
            </div>
            <aside className="running">
              <Hand />
              <div>
                <span className="mono-s">A note from the archivist</span>
                <p>{NOTES[game.index % NOTES.length]}</p>
              </div>
            </aside>
          </div>

          <div>
            {!pick ? (
              <>
                <div className="side-label mono-s">
                  <span>
                    <b>The rack</b> · choose a stamp
                  </span>
                  <span className="hide-s">Keys H · A · L</span>
                </div>
                <div className="rack">
                  <h2 className="wood">Stamp it.</h2>
                  <p className="how">
                    Is it true exactly as written, a documented near-miss, or a story everybody repeats? One stamp.
                    Then we open the record.
                  </p>
                  <StampButtons onStamp={onStamp} />
                  <div className="rack-foot mono-s">
                    <span>Every verdict sourced</span>
                    <Link className="link" href="/rules">
                      Read the rules
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="side-label mono-s">
                  <span>
                    <b>Side B</b> · the record
                  </span>
                  <span>Sourced · fact-checked</span>
                </div>
                <RecordPanel
                  claim={claim}
                  pick={pick}
                  correct={correct}
                  index={game.index}
                  isLast={isTrap}
                  onNext={onNext}
                  headingRef={recordRef}
                  percentRight={stats?.enabled ? (stats.right?.[game.index] ?? null) : null}
                />
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function RecordPanel({
  claim,
  pick,
  correct,
  index,
  isLast,
  onNext,
  headingRef,
  percentRight,
}: {
  claim: Claim;
  pick: Verdict;
  correct: boolean;
  index: number;
  isLast: boolean;
  onNext: () => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  percentRight: number | null;
}) {
  return (
    <article className="record" aria-labelledby="rec-h">
      <div className="rec-head">
        <h2 className="wood" id="rec-h" ref={headingRef} tabIndex={-1}>
          The Record
        </h2>
        <span className="mono-s">
          Claim {index + 1} · {claim.year}
        </span>
      </div>
      <div className="rec-body">
        <div className="verdict">
          <Slab v={claim.verdict} />
          <span className="say">{VERDICT_SAY[claim.verdict]}</span>
          <span className="you mono-s" role="status">
            <span className={`ok ${correct ? "" : "no"}`}>
              <Mark kind={correct ? "kept" : "fooled"} />
              {correct ? "Kept" : "Fooled"}
            </span>
            You stamped {VERDICT_LABEL[pick]}.
          </span>
        </div>
        <p className="explain">{claim.record}</p>
        {claim.origin ? (
          <p className="origin">
            <b>Where the story comes from</b>
            {claim.origin}
          </p>
        ) : null}
        <ol className="sources">
          {claim.sources.map((source, i) => (
            <li key={source.url}>
              <span className="k">{i + 1}</span>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.title}
              </a>
              <span className="mono-s">{source.publisher}</span>
            </li>
          ))}
        </ol>
        {claim.storySlug ? (
          <Link className="casefile" href={`/case-files/${claim.storySlug}`}>
            <span>
              <span className="mono-s">Read the case file</span>
              <span className="t">The long version, with every footnote</span>
            </span>
            <Hand bg="var(--sun)" />
          </Link>
        ) : null}
        {percentRight !== null ? (
          <p className="crowd">
            <b>{percentRight}%</b> of players stamped this one correctly.
          </p>
        ) : null}
        <div className="rec-actions">
          <Link className="mono-s link" href={`/corrections?claim=${claim.id}`}>
            Argue with the record
          </Link>
          <button type="button" className="btn" onClick={onNext}>
            {isLast ? "Open the ledger" : `Next claim · ${index + 2} of 5`}
            <Hand bg="var(--ink)" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function VerdictGlyphs() {
  return (
    <>
      <Glyph v="happened" />
      <Glyph v="almost" />
      <Glyph v="lore" />
    </>
  );
}
