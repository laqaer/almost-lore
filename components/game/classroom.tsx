"use client";

import { useCallback, useEffect, useState } from "react";
import { Slab } from "@/components/icons";
import { VERDICT_DEF, VERDICT_SAY } from "@/lib/game/scoring";
import { formatDocketDate, todaysDocketNumber } from "@/lib/game/schedule";
import { fetchDocket, type DocketPayload } from "@/lib/game/today";
import type { Claim } from "@/lib/game/types";
import { VERDICTS } from "@/lib/game/types";

type Step = { kind: "intro" } | { kind: "claim"; i: number } | { kind: "record"; i: number } | { kind: "end" };

/**
 * Projector mode: today's five claims, huge, with the record one keypress away.
 * No analytics, no accounts, no storage — nothing about the class leaves the room.
 */
export function Classroom() {
  const [docket, setDocket] = useState<DocketPayload | null>(null);
  const [failed, setFailed] = useState(false);
  const [includeFlagged, setIncludeFlagged] = useState(false);
  const [step, setStep] = useState<Step>({ kind: "intro" });
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    fetchDocket(todaysDocketNumber())
      .then((d) => live && setDocket(d))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, []);

  const flagged = (c: Claim) => !c.schoolSafe || c.solemn;
  const cards = docket ? docket.claims.filter((c) => includeFlagged || !flagged(c)) : [];

  const next = useCallback(() => {
    setTimer(null);
    setStep((s) => {
      if (s.kind === "intro") return cards.length ? { kind: "claim", i: 0 } : s;
      if (s.kind === "claim") return { kind: "record", i: s.i };
      if (s.kind === "record") return s.i + 1 < cards.length ? { kind: "claim", i: s.i + 1 } : { kind: "end" };
      return s;
    });
  }, [cards.length]);

  const back = useCallback(() => {
    setTimer(null);
    setStep((s) => {
      if (s.kind === "record") return { kind: "claim", i: s.i };
      if (s.kind === "claim") return s.i === 0 ? { kind: "intro" } : { kind: "record", i: s.i - 1 };
      if (s.kind === "end") return cards.length ? { kind: "record", i: cards.length - 1 } : { kind: "intro" };
      return s;
    });
  }, [cards.length]);

  useEffect(() => {
    if (timer === null || timer <= 0) return;
    const id = window.setTimeout(() => setTimer((t) => (t === null ? null : t - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [timer]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "BUTTON", "A"].includes(target.tagName) && (e.key === " " || e.key === "Enter")) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        back();
      } else if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen?.().catch(() => {});
      } else if (e.key === "t" || e.key === "T") {
        setTimer((t) => (t === null ? 120 : null));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, back]);

  const card = step.kind === "claim" || step.kind === "record" ? cards[step.i] : undefined;

  return (
    <div className="projector">
      <header className="proj-bar mono-s">
        {/* A full page load on purpose: nothing from this page may reach an analytics script. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="proj-brand wood" href="/">
          Almost Lore
        </a>
        <span>Classroom{docket ? ` · Docket No. ${docket.n} · ${formatDocketDate(docket.n)}` : ""}</span>
        <span className="proj-keys">
          {timer !== null ? (
            <span className={`proj-timer ${timer === 0 ? "done" : ""}`} role="timer" aria-live="off">
              {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
            </span>
          ) : null}
          → next · ← back · T timer · F fullscreen
        </span>
      </header>

      <section className="proj-stage" aria-live="polite">
        {failed ? (
          <div>
            <p className="big-claim claim">Today&apos;s docket didn&apos;t load.</p>
            <p className="proj-sub">Check the connection and refresh. The daily game is also at almostlore.com/play.</p>
          </div>
        ) : !docket ? (
          <p className="big-claim claim pulse">Opening the archive…</p>
        ) : step.kind === "intro" ? (
          <div className="proj-intro">
            <p className="mono-s">Bell-ringer · today&apos;s five claims</p>
            <h1 className="wood proj-title">
              Happened, <span className="mis" data-t="almost">almost</span>, or lore?
            </h1>
            <ol className="proj-key">
              {VERDICTS.map((v) => (
                <li key={v}>
                  <Slab v={v} />
                  <span>{VERDICT_DEF[v]}</span>
                </li>
              ))}
            </ol>
            {docket.claims.some(flagged) ? (
              <div className="proj-flag">
                <p>
                  <b>Teacher preview:</b>{" "}
                  {docket.claims.filter(flagged).length === 1 ? "one of today's claims touches" : "some of today's claims touch"} war,
                  death or another heavy subject. {includeFlagged ? "It's included." : "It's skipped unless you include it."}
                </p>
                <label className="mono-s">
                  <input type="checkbox" checked={includeFlagged} onChange={(e) => setIncludeFlagged(e.target.checked)} /> Include{" "}
                  {docket.claims.filter(flagged).length === 1 ? "it" : "them"}
                </label>
              </div>
            ) : null}
            <button className="btn pink" type="button" onClick={next}>
              Start · {cards.length} claim{cards.length === 1 ? "" : "s"}
            </button>
          </div>
        ) : card && step.kind === "claim" ? (
          <div key={`c${card.id}`}>
            <p className="mono-s">
              Claim {step.i + 1} of {cards.length} · filed under {card.topic.replace(/-/g, " ")}
            </p>
            <p className="big-claim claim">{card.claim}</p>
            <div className="opts">
              <Slab v="happened" />
              <Slab v="almost" />
              <Slab v="lore" />
            </div>
          </div>
        ) : card && step.kind === "record" ? (
          <div key={`r${card.id}`} className="proj-record">
            <p className="mono-s">
              The record · claim {step.i + 1} of {cards.length} · {card.year}
            </p>
            <p className="proj-claim">{card.claim}</p>
            <div className="proj-verdict">
              <Slab v={card.verdict} />
              <span>{VERDICT_SAY[card.verdict]}</span>
            </div>
            <p className="proj-text">{card.record}</p>
            <p className="proj-src mono-s">
              Sources: {card.sources.map((s) => `${s.title} (${s.publisher})`).join(" · ")}
            </p>
          </div>
        ) : (
          <div className="proj-intro">
            <p className="mono-s">That&apos;s the docket</p>
            <h2 className="wood proj-title">Same time tomorrow.</h2>
            <p className="proj-sub">
              A fresh five opens at midnight. Exit ticket: which claim was hardest to call, and what source would settle it?
            </p>
            <p className="proj-sub mono-s" style={{ marginTop: 24 }}>
              For offline lessons with an answer key: the Classroom Pack · almostlore.com/shop/classroom-pack
            </p>
          </div>
        )}
      </section>

      <footer className="proj-foot">
        <button className="btn ghost" type="button" onClick={back} disabled={step.kind === "intro"}>
          ← Back
        </button>
        <span className="mono-s">No student data collected. Nothing leaves the room.</span>
        <button className="btn" type="button" onClick={next} disabled={step.kind === "end" || !docket}>
          {step.kind === "claim" ? "Reveal the record" : step.kind === "intro" ? "Start" : "Next"} →
        </button>
      </footer>
    </div>
  );
}
