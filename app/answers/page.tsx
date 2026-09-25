import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { Hand } from "@/components/icons";
import { docketCount, getDocket } from "@/lib/game/content";
import { formatDocketDate, latestClosedDocket, latestOpenDocket } from "@/lib/game/schedule";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "The archive — every past docket, with answers",
  description:
    "Every past Almost Lore docket: the five claims, the verdicts (HAPPENED, ALMOST or LORE), the records and the sources. Replay any day.",
  path: "/answers",
});

export default async function AnswersIndex() {
  await connection();
  const closed = latestClosedDocket();
  const open = latestOpenDocket();
  const total = docketCount();
  const numbers = Array.from({ length: Math.min(closed, Math.max(total, closed)) }, (_, i) => closed - i).filter((n) => n >= 1);

  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <hr className="rule-double" />
          <div className="page-kicker">
            <span className="mono-s">§ The archive · every docket, once it has closed everywhere on Earth</span>
          </div>
          <h1 className="wood page-title">
            The{" "}
            <span className="mis" data-t="archive">
              archive
            </span>
          </h1>
          <p className="page-dek">
            Replay any past docket, or skip straight to the record. Answers unlock the day after, once midnight has passed
            in the last timezone on Earth.
          </p>
          <div className="btnrow" style={{ marginTop: 22 }}>
            <Link className="btn" href="/play">
              Play today&apos;s docket <Hand bg="var(--ink)" />
            </Link>
          </div>
        </div>
      </header>
      <section className="wrap" style={{ paddingBottom: 96 }}>
        {numbers.length === 0 ? (
          <p className="lede">The first docket is still open somewhere in the world. Its answers appear here tomorrow.</p>
        ) : (
          <ol className="index-list">
            {numbers.map((n) => {
              const docket = getDocket(n);
              if (!docket) return null;
              const topics = docket.claims.slice(0, 4).map((c) => c.topic.replace(/-/g, " "));
              return (
                <li key={n}>
                  <div className="index-row">
                    <span className="n">{n}</span>
                    <span>
                      <span className="mono-s">{formatDocketDate(n)}</span>
                      <br />
                      <Link className="t" href={`/answers/${n}`} style={{ textDecoration: "none" }}>
                        {topics.join(" · ")} · and the trap
                      </Link>
                    </span>
                    <span className="btnrow" style={{ marginTop: 0 }}>
                      <Link className="btn ghost" href={`/play/${n}`}>
                        Play
                      </Link>
                      <Link className="btn" href={`/answers/${n}`}>
                        Answers
                      </Link>
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        {open > closed ? (
          <p className="mono-s" style={{ marginTop: 24 }}>
            No. {open} is still open in some timezones — its answers publish once it closes everywhere.
          </p>
        ) : null}
      </section>
    </>
  );
}
