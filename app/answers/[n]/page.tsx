import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hand, Slab } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { getDocket, isDocketClosed } from "@/lib/game/content";
import { formatDocketDate } from "@/lib/game/schedule";
import { VERDICT_SAY } from "@/lib/game/scoring";
import { pageMetadata } from "@/lib/metadata";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ n: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n: raw } = await params;
  const n = Number(raw);
  const docket = Number.isInteger(n) && isDocketClosed(n) ? getDocket(n) : null;
  if (!docket) return { title: "Not yet", robots: { index: false } };
  const lead = docket.claims[0]?.claim ?? "";
  return pageMetadata({
    title: `Almost Lore No. ${n} answers — ${formatDocketDate(n)}`,
    description: `The five claims from Almost Lore No. ${n}, with verdicts, records and sources. ${lead}`.slice(0, 300),
    path: `/answers/${n}`,
  });
}

export default async function AnswersPage({ params }: Props) {
  const { n: raw } = await params;
  const n = Number(raw);
  if (!Number.isInteger(n) || !isDocketClosed(n)) notFound();
  const docket = getDocket(n);
  if (!docket) notFound();

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: docket.claims.map((claim) => ({
      "@type": "Question",
      name: `Happened, almost, or lore? ${claim.claim}`,
      acceptedAnswer: { "@type": "Answer", text: `${claim.verdict.toUpperCase()}. ${claim.record}` },
    })),
    url: `${siteUrl()}/answers/${n}`,
  };

  return (
    <>
      <JsonLd data={faq} />
      <header className="page-head">
        <div className="wrap">
          <hr className="rule-double" />
          <div className="page-kicker">
            <Link className="mono-s link" href="/answers">
              The archive
            </Link>
            <span className="mono-s">· {formatDocketDate(n)}</span>
          </div>
          <h1 className="wood page-title">
            No. {n}:{" "}
            <span className="mis" data-t="the record">
              the record
            </span>
          </h1>
          <p className="page-dek">All five claims from this docket, with the verdict, what actually happened, and the sources.</p>
          <div className="btnrow" style={{ marginTop: 22 }}>
            <Link className="btn ghost" href={`/play/${n}`}>
              Play it first
            </Link>
            <Link className="btn" href="/play">
              Play today <Hand bg="var(--ink)" />
            </Link>
          </div>
        </div>
      </header>
      <section className="wrap" style={{ paddingBottom: 96 }}>
        {docket.claims.map((claim, i) => (
          <article className="answer" key={claim.id} id={claim.id}>
            <span className="n">{i + 1}</span>
            <div>
              <p className="mono-s">
                {i === docket.claims.length - 1 ? "The trap · " : ""}
                {claim.region} · {claim.year}
              </p>
              <h2 className="claim q">{claim.claim}</h2>
              <div className="v">
                <Slab v={claim.verdict} />
                <span className="claim" style={{ fontStyle: "italic", fontSize: 24 }}>
                  {VERDICT_SAY[claim.verdict]}
                </span>
              </div>
              <p className="explain">{claim.record}</p>
              {claim.origin ? (
                <p className="origin" style={{ maxWidth: "64ch" }}>
                  <b>Where the story comes from</b>
                  {claim.origin}
                </p>
              ) : null}
              <ol className="sources" style={{ maxWidth: "64ch" }}>
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
              {claim.storySlug ? (
                <p style={{ marginTop: 14 }}>
                  <Link className="link mono-s" href={`/case-files/${claim.storySlug}`}>
                    Read the case file
                  </Link>
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
