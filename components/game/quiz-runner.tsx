"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Glyph, Hand, Mark, Slab } from "@/components/icons";
import { NewsletterForm } from "@/components/newsletter-form";
import { StampButtons, useStampKeys } from "@/components/game/stamp-rack";
import { track } from "@/lib/analytics";
import { rankFor, VERDICT_LABEL, VERDICT_SAY } from "@/lib/game/scoring";
import { saveTestResult } from "@/lib/game/storage";
import type { Claim, Verdict } from "@/lib/game/types";
import { VERDICTS } from "@/lib/game/types";

type Props = {
  claims: Claim[];
  /** Used for analytics and saved results. */
  kind: "gullibility" | "halloween";
  title: string;
  shareUrl: string;
  children?: React.ReactNode;
};

const PROFILE: Record<Verdict, { title: string; line: string }> = {
  happened: {
    title: "The Skeptic",
    line: "You doubt the true stories because they sound too strange. History is weirder than you allow.",
  },
  almost: {
    title: "The Optimist",
    line: "You assume things either happened or didn't. The paperwork says a lot of history nearly did.",
  },
  lore: {
    title: "The Romantic",
    line: "A good story gets past you. Legends are persuasive — that's how they became legends.",
  },
};

export function QuizRunner({ claims, kind, title, shareUrl, children }: Props) {
  const [picks, setPicks] = useState<Verdict[]>([]);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const recordRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const claim = claims[index];
  const pick = picks[index];
  const revealed = picks.length > index;

  function onStamp(v: Verdict) {
    if (revealed || done) return;
    if (picks.length === 0) track("practice_start", { kind });
    setPicks([...picks, v]);
    window.setTimeout(() => recordRef.current?.focus({ preventScroll: true }), 400);
  }

  function onNext() {
    if (!revealed) return;
    if (index < claims.length - 1) {
      setIndex(index + 1);
      window.setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
    } else {
      setDone(true);
      window.setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
    }
  }

  const handler = useStampKeys({ enabled: !revealed && !done, onStamp, onNext, canNext: revealed && !done });
  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);

  const results = useMemo(() => {
    const per: Record<Verdict, { seen: number; right: number }> = {
      happened: { seen: 0, right: 0 },
      almost: { seen: 0, right: 0 },
      lore: { seen: 0, right: 0 },
    };
    picks.forEach((p, i) => {
      const v = claims[i].verdict;
      per[v].seen++;
      if (p === v) per[v].right++;
    });
    const right = picks.filter((p, i) => p === claims[i].verdict).length;
    let spot: Verdict | null = null;
    let worst = 2;
    for (const v of VERDICTS) {
      if (!per[v].seen) continue;
      const rate = per[v].right / per[v].seen;
      if (rate < worst) {
        worst = rate;
        spot = v;
      }
    }
    return { per, right, spot: worst < 1 ? spot : null };
  }, [picks, claims]);

  useEffect(() => {
    if (!done) return;
    track("game_complete", { kind, right: results.right, total: claims.length });
    if (kind === "gullibility") {
      saveTestResult({
        right: results.right,
        total: claims.length,
        blindSpot: results.spot,
        completedAt: new Date().toISOString(),
      });
    }
  }, [done, kind, results, claims.length]);

  if (done) {
    const scaled = Math.round((results.right / claims.length) * 5);
    const rank = rankFor(scaled);
    const profile = results.spot ? PROFILE[results.spot] : null;
    const text = [
      `${title}: ${results.right}/${claims.length} · ${rank.title}`,
      profile && results.spot ? `My blind spot: ${VERDICT_LABEL[results.spot].toUpperCase()} (${profile.title})` : "No blind spot. Insufferable.",
      "",
      shareUrl,
    ].join("\n");
    async function share() {
      track("game_share", { kind, right: results.right });
      try {
        if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
          await navigator.share({ text });
          return;
        }
        await navigator.clipboard.writeText(text);
        setCopied(true);
      } catch {
        // dismissed
      }
    }
    return (
      <div ref={topRef} className="wrap" style={{ paddingBottom: 80 }}>
        <article className="ledger">
          <div className="l-top">
            <h2 className="wood">
              <span className="mis b" data-t="Your certificate">
                Your certificate
              </span>
            </h2>
            <div className="meta mono-s">
              <span>
                <b>{title}</b>
              </span>
              <span>
                {results.right} of {claims.length} kept
              </span>
            </div>
          </div>
          <div className="l-main">
            <div className="l-score">
              <div className="score" aria-label={`${results.right} out of ${claims.length}`}>
                <span className="big">{results.right}</span>
                <span className="of">
                  /{claims.length}
                  <span>Claims kept</span>
                </span>
              </div>
              <div className="rank">
                <Slab v={scaled >= 4 ? "lore" : scaled >= 2 ? "almost" : "happened"} label={rank.title} />
                <p>{rank.line}</p>
              </div>
            </div>
            <div className="l-entries">
              <p className="mono-s h">
                <span>Your profile</span>
              </p>
              {profile && results.spot ? (
                <>
                  <p className="claim" style={{ fontSize: 40 }}>
                    {profile.title}
                  </p>
                  <p style={{ marginTop: 10, fontSize: 18, lineHeight: 1.5, color: "var(--ink-2)", maxWidth: "44ch" }}>
                    Blind spot: <b>{VERDICT_LABEL[results.spot].toUpperCase()}</b>. {profile.line}
                  </p>
                </>
              ) : (
                <p className="claim" style={{ fontSize: 40 }}>
                  No blind spot. Suspiciously well-read.
                </p>
              )}
              <div className="meter">
                {VERDICTS.map((v) => {
                  const { seen, right } = results.per[v];
                  const pct = seen ? Math.round((right / seen) * 100) : 0;
                  return (
                    <div className={`meter-row v-${v}`} key={v}>
                      <span className="mono-s">
                        <Glyph v={v} /> {VERDICT_LABEL[v]}
                      </span>
                      <span className="meter-bar" aria-hidden="true">
                        <span style={{ width: `${pct}%` }} />
                      </span>
                      <span className="mono-s">
                        {right}/{seen}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="l-bottom">
            <div>
              <h3>Share it</h3>
              <div className="slip">{text}</div>
              <div className="btnrow">
                <button className="btn" type="button" onClick={share}>
                  {copied ? "Copied" : "Share"}
                </button>
              </div>
            </div>
            <div>
              <h3>Now the daily</h3>
              <p>Five fresh claims every day at your midnight, with a streak to protect.</p>
              <div className="btnrow">
                <Link className="btn" href="/play">
                  Play today <Hand bg="var(--ink)" />
                </Link>
              </div>
            </div>
            <div>
              <h3>The Sunday Docket</h3>
              <p>One near-miss a week, told properly.</p>
              <NewsletterForm source="game-result" cta="Subscribe" />
            </div>
          </div>
        </article>
        {children}
      </div>
    );
  }

  return (
    <div ref={topRef} className="wrap game">
      <div className="edition-bar">
        <span className="wood">{title}</span>
        <span className="mono-s">
          Claim {index + 1} of {claims.length}
        </span>
        <div className="right mono-s">
          <span>
            {picks.filter((p, i) => p === claims[i].verdict).length} kept so far
          </span>
        </div>
      </div>
      <div className="meter-bar" style={{ marginTop: 14, height: 14 }} aria-hidden="true">
        <span style={{ width: `${(picks.length / claims.length) * 100}%`, background: "var(--pink)" }} />
      </div>
      <section className="table" aria-label={`Claim ${index + 1} of ${claims.length}`}>
        <div>
          <div className="stack">
            <div className="ghost g1" />
            <div className="ghost g2" />
            <article className={`card ${pick ? "thunk" : ""}`} key={claim.id}>
              <div className="card-head">
                <span className="wood">
                  {index + 1}/{claims.length}
                </span>
                <span className="mono-s">
                  Filed under: {claim.topic.replace(/-/g, " ")}, {claim.year}
                </span>
              </div>
              <p className="claim">{claim.claim}</p>
              {pick ? (
                <div className={`impression v-${pick} imp`} aria-hidden="true" style={{ "--rot": `${index % 2 ? 6 : -7}deg` } as React.CSSProperties}>
                  {VERDICT_LABEL[pick]}
                </div>
              ) : null}
              <div className="card-foot mono-s">
                <span>{pick ? <>You stamped <Slab v={pick} /></> : "Sources unsealed after you stamp"}</span>
                <span>Keys H · A · L</span>
              </div>
            </article>
          </div>
        </div>
        <div>
          {!pick ? (
            <div className="rack">
              <h2 className="wood">Stamp it.</h2>
              <p className="how">True exactly as written, a documented near-miss, or a story everybody repeats?</p>
              <StampButtons onStamp={onStamp} />
            </div>
          ) : (
            <article className="record" aria-labelledby="quiz-rec">
              <div className="rec-head">
                <h2 className="wood" id="quiz-rec" ref={recordRef} tabIndex={-1}>
                  The Record
                </h2>
                <span className="mono-s">{claim.year}</span>
              </div>
              <div className="rec-body">
                <div className="verdict">
                  <Slab v={claim.verdict} />
                  <span className="say">{VERDICT_SAY[claim.verdict]}</span>
                  <span className="you mono-s" role="status">
                    <span className={`ok ${pick === claim.verdict ? "" : "no"}`}>
                      <Mark kind={pick === claim.verdict ? "kept" : "fooled"} />
                      {pick === claim.verdict ? "Kept" : "Fooled"}
                    </span>
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
                  {claim.sources.map((s, k) => (
                    <li key={s.url}>
                      <span className="k">{k + 1}</span>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.title}
                      </a>
                      <span className="mono-s">{s.publisher}</span>
                    </li>
                  ))}
                </ol>
                <div className="rec-actions">
                  <Link className="mono-s link" href={`/corrections?claim=${claim.id}`}>
                    Argue with the record
                  </Link>
                  <button type="button" className="btn" onClick={onNext}>
                    {index === claims.length - 1 ? "See my certificate" : "Next claim"} <Hand bg="var(--ink)" />
                  </button>
                </div>
              </div>
            </article>
          )}
        </div>
      </section>
    </div>
  );
}
