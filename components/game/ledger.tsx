"use client";

import Link from "next/link";
import { useState } from "react";
import { Countdown } from "@/components/countdown";
import { Glyph, Mark, Slab, Tally } from "@/components/icons";
import { NewsletterForm } from "@/components/newsletter-form";
import { track } from "@/lib/analytics";
import { encodeChallenge, type Challenge } from "@/lib/game/challenge";
import { formatDocketDate } from "@/lib/game/schedule";
import { RANKS, rankFor, shareText, VERDICT_LABEL } from "@/lib/game/scoring";
import { blindSpot } from "@/lib/game/storage";
import type { DocketPayload } from "@/lib/game/today";
import type { DocketGame } from "@/lib/game/use-docket";

type Props = {
  docket: DocketPayload;
  game: DocketGame;
  isToday: boolean;
  challenge?: Challenge | null;
  stats: { enabled: boolean; plays?: number; right?: (number | null)[] } | null;
  streak: number;
};

const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five"];

function rankNote(right: number): React.ReactNode {
  if (right === 5) return <>Five for five. <b>Keeper of the Archive</b>, which comes with no prize but considerable smugness.</>;
  if (right === 4) return <>You kept four of five. <b>One more</b> and you&apos;d be Keeper of the Archive.</>;
  if (right === 3) return <>Three of five. Respectable at any pub, <b>dangerous</b> at any dinner party.</>;
  if (right === 2) return <>Two of five. The record has <b>notes</b>, and it would like to share them.</>;
  if (right === 1) return <>One of five. <b>Loud, certain and wrong</b> is a tradition. Tomorrow is a new docket.</>;
  return <>Zero. <b>Never let the facts get in the way</b> — but maybe let them in tomorrow.</>;
}

export function Ledger({ docket, game, isToday, challenge, stats, streak }: Props) {
  const { n, claims } = docket;
  const right = game.right;
  const rank = rankFor(right);
  const spot = game.card ? blindSpot(game.card) : null;
  const [copied, setCopied] = useState<"share" | "challenge" | null>(null);
  const [name, setName] = useState("");
  const origin = typeof window !== "undefined" ? window.location.origin : "https://almostlore.com";
  const url = `${origin}/play/${n}`;
  const trap = claims[claims.length - 1];
  const text = shareText({ n, correct: game.correct, trapClaim: trap && !trap.solemn ? trap.claim : undefined, url });
  const measured = stats?.enabled && Array.isArray(stats.right) && stats.right.every((v) => v !== null);
  const trapRight = measured ? (stats?.right?.[claims.length - 1] as number) : null;

  async function share() {
    track("game_share", { docket: n, right, method: "share" });
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied("share");
    } catch {
      // share sheet dismissed
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied("share");
      track("game_share", { docket: n, right, method: "copy" });
    } catch {
      // clipboard blocked
    }
  }

  async function challengeFriend() {
    const token = encodeChallenge({ name: name || "A friend", picks: game.picks });
    const link = `${origin}/play/${n}?c=${token}`;
    const message = `I stamped Almost Lore No. ${n}. My answers are sealed until you play: ${link}`;
    track("game_share", { docket: n, method: "challenge" });
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ text: message });
        return;
      }
      await navigator.clipboard.writeText(message);
      setCopied("challenge");
    } catch {
      // cancelled
    }
  }

  const theirCorrect = challenge ? challenge.picks.map((p, i) => p === claims[i].verdict) : null;
  const theirRight = theirCorrect ? theirCorrect.filter(Boolean).length : 0;

  return (
    <section className="ledger-sec" id="ledger" aria-labelledby="ledger-h">
      <div className="wrap">
        <article className="ledger">
          <div className="l-top">
            <h2 className="wood" id="ledger-h">
              <span className="mis b" data-t="The Ledger">
                The Ledger
              </span>
            </h2>
            <div className="meta mono-s">
              <span>
                <b>No. {n}</b> · closing balance
              </span>
              <span>{formatDocketDate(n)}</span>
              {!isToday ? <span>From the archive</span> : null}
            </div>
          </div>

          <div className="l-main">
            <div className="l-score">
              <div className="score" aria-label={`${right} out of 5`}>
                <span className="big">{right}</span>
                <span className="of">
                  /5<span>Claims kept</span>
                </span>
              </div>
              <div className="rank">
                <Slab v={right >= 4 ? "lore" : right >= 2 ? "almost" : "happened"} label={rank.title} />
                <p>{rankNote(right)}</p>
              </div>
              <ol className="ladder" aria-label="Rank ladder">
                {RANKS.map((r, i) => (
                  <li key={r.title} className={i === right ? "on" : undefined}>
                    <b>{i}</b>
                    {r.title}
                  </li>
                ))}
              </ol>
            </div>

            <div className="l-entries">
              <div className="mono-s h">
                <span>Your five stamps</span>
                <span className="legend">
                  <Mark kind="kept" />
                  Kept <Mark kind="fooled" />
                  Fooled
                </span>
              </div>
              <ol className="glyphrow">
                {claims.map((claim, i) => {
                  const p = game.picks[i];
                  const ok = game.correct[i];
                  return (
                    <li key={claim.id} className={`gcell v-${p} ${ok ? "" : "miss"} ${i === claims.length - 1 ? "trap" : ""}`}>
                      <span className="no">{i + 1}</span>
                      <Glyph v={p} />
                      <span className="w">{VERDICT_LABEL[p]}</span>
                      <span className="mk" aria-label={ok ? "kept" : "fooled"}>
                        <Mark kind={ok ? "kept" : "fooled"} />
                      </span>
                    </li>
                  );
                })}
              </ol>
              <table className="entries">
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Claim</th>
                    <th scope="col">You</th>
                    <th scope="col">Record</th>
                    <th scope="col">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim, i) => (
                    <tr key={claim.id} className={game.correct[i] ? "" : "miss"}>
                      <td className="no">{i + 1}</td>
                      <td className="c">{claim.claim}</td>
                      <td>
                        <Slab v={game.picks[i]} />
                      </td>
                      <td>
                        <Slab v={claim.verdict} />
                      </td>
                      <td className="r">
                        <span>
                          <Mark kind={game.correct[i] ? "kept" : "fooled"} />
                          {game.correct[i] ? "Kept" : "Fooled"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {measured && stats?.plays ? (
                <div className="stats">
                  <div>
                    <span className="big">{stats.plays.toLocaleString("en-US")}</span>
                    <span className="mono-s">Finished No. {n} so far</span>
                  </div>
                  <div>
                    <span className="big">
                      {((stats.right as number[]).reduce((a, b) => a + b, 0) / 100).toFixed(1)}
                      <sup>/5</sup>
                    </span>
                    <span className="mono-s">Average score today</span>
                  </div>
                  <div>
                    <span className="big">
                      {100 - (trapRight as number)}
                      <sup>%</sup>
                    </span>
                    <span className="mono-s">Fell for the trap{game.correct[claims.length - 1] ? ". You didn't" : ""}</span>
                  </div>
                </div>
              ) : null}
              <p className="mono-s" style={{ marginTop: 18 }}>
                <Link className="link" href={`/answers/${n}`}>
                  Every record and source for No. {n}
                </Link>
                {spot ? (
                  <>
                    {"  ·  "}Your blind spot so far: <b>{VERDICT_LABEL[spot]}</b>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          {challenge && theirCorrect ? (
            <div className="h2h">
              <h3>
                Seal broken: you {right} · {challenge.name} {theirRight}
              </h3>
              <p className="mono-s" style={{ marginTop: 6 }}>
                {right > theirRight
                  ? "The record favours you. Tell them gently."
                  : right < theirRight
                    ? `${challenge.name} read more footnotes. Rematch tomorrow.`
                    : "A dead heat. The archive declines to pick a side."}
              </p>
              <ol>
                {claims.map((claim, i) => (
                  <li key={claim.id} data-same={challenge.picks[i] === game.picks[i]}>
                    {i + 1}. {challenge.picks[i] === game.picks[i] ? "Same stamp" : "Split"}
                    <br />
                    You: {VERDICT_LABEL[game.picks[i]]} {game.correct[i] ? "✓" : "✗"}
                    <br />
                    {challenge.name}: {VERDICT_LABEL[challenge.picks[i]]} {theirCorrect[i] ? "✓" : "✗"}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <div className="l-bottom">
            <div>
              <h3>Streak</h3>
              <div className="streakbox">
                <span className="big">{streak}</span>
                {streak > 0 ? <Tally count={streak} /> : null}
              </div>
              <p>
                {!isToday
                  ? "Archive dockets don't count toward your streak. Today's does."
                  : streak > 1
                    ? `${WORDS[Math.min(streak, 5)] ?? streak} days without missing a docket${streak > 5 ? ` — ${streak}, in fact` : ""}. Best: ${game.card?.maxStreak ?? streak}. The archive is watching.`
                    : "Day one of a streak. Come back tomorrow at midnight — yours, not ours."}
              </p>
            </div>
            <div>
              <h3>Share</h3>
              <p>Spoiler-free. Friends see your score; the trap appears only as a question.</p>
              <div className="slip" aria-label="Share preview">
                {text}
              </div>
              <div className="btnrow">
                <button type="button" className="btn" onClick={share}>
                  {copied === "share" ? "Copied" : "Share"}
                </button>
                <button type="button" className="btn ghost" onClick={copy}>
                  Copy
                </button>
              </div>
            </div>
            <div>
              <h3>Challenge a friend</h3>
              <div className="seal">
                <span className="wax" aria-hidden="true">
                  <Glyph v="almost" />
                </span>
                <p>Your stamps go under seal. They see them only after they have stamped all five.</p>
              </div>
              <label className="sr" htmlFor="challenge-name">
                Your first name
              </label>
              <input
                id="challenge-name"
                className="name-input"
                maxLength={12}
                placeholder="Your first name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <div className="btnrow">
                <button type="button" className="btn ghost" onClick={challengeFriend}>
                  {copied === "challenge" ? "Link copied" : "Send a sealed challenge"}
                </button>
              </div>
            </div>
          </div>

          <div className="l-foot">
            <div>
              <span className="mono-s">No. {n + 1} goes to press in</span>
              <span className="digits">
                <Countdown />
              </span>
              <p style={{ marginTop: 10 }}>
                <Link href="/answers">Play the archive</Link> · <Link href="/test">Take the Gullibility Test</Link>
              </p>
            </div>
            <div className="on-ink">
              <span className="mono-s">The Sunday Docket</span>
              <p>One near-miss a week, told properly. Plus the trap that fooled the most people, and exactly why.</p>
              <NewsletterForm source="game-result" cta="Subscribe" />
            </div>
            <div className="plug">
              <div>
                <span className="mono-s">{right >= 4 ? `${WORDS[right]} out of five, eh?` : "For game night"}</span>
                <p>
                  Be insufferable in person. <Link href="/shop/party-pack">The Party Pack</Link>: print-at-home cards with
                  the record on the back.
                </p>
              </div>
              <span className="price">
                <sup>$</sup>12
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
