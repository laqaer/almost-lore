import type { Metadata } from "next";
import Link from "next/link";
import { CorrectionForm } from "@/components/correction-form";
import { DocPage } from "@/components/doc-page";
import corrections from "@/content/corrections.json";
import { getClaim, isClaimPublic } from "@/lib/game/content";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { getStory, storyPath } from "@/lib/stories";

export const metadata: Metadata = pageMetadata({
  title: "Corrections",
  description: "Every upheld correction to an Almost Lore claim or case file, and how to report an error.",
  path: "/corrections",
});

type Correction = { date: string; claimId?: string; storySlug?: string; summary: string; credit?: string };
type Props = { searchParams: Promise<{ claim?: string | string[]; story?: string | string[] }> };

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export default async function CorrectionsPage({ searchParams }: Props) {
  const params = await searchParams;
  const claim = one(params.claim) ? getClaim(one(params.claim)!) : undefined;
  const story = !claim && one(params.story) ? getStory(one(params.story)!) : undefined;
  const log = [...(corrections as Correction[])].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <DocPage
      kicker="The corrections desk"
      title="Corrections"
      dek="We will get one wrong eventually. When we do, it's fixed and logged here, in public."
    >
      <h2 id="report">Report an error</h2>
      {claim || story ? (
        <>
          <p>
            You&apos;re reporting{" "}
            {claim ? (
              isClaimPublic(claim.id) ? (
                <>
                  the claim <strong>&ldquo;{claim.claim}&rdquo;</strong> (stamped {claim.verdict.toUpperCase()})
                </>
              ) : (
                <>claim {claim.id}</>
              )
            ) : (
              <>
                the case file <Link href={storyPath(story!.slug)}>{story!.title}</Link>
              </>
            )}
            . Tell us what&apos;s wrong and, if you can, where it says so.
          </p>
          <CorrectionForm claimId={claim?.id} storySlug={story?.slug} />
          <p className="fine" style={{ marginTop: 16 }}>
            Or email {site.email}. We aim to answer every report within a day.
          </p>
        </>
      ) : (
        <p>
          Every claim&apos;s record has an <strong>&ldquo;Argue with the record&rdquo;</strong> link, and every case file has a
          &ldquo;Report an error&rdquo; link. Use those so we know exactly which item you mean — or email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      )}

      <h2>How we decide</h2>
      <p>
        A report is upheld when the sources show the claim, the verdict or the record is wrong — or when a reasonable expert
        could argue for a different stamp. Then we fix the text, keep the date it changed, and log it below. If a verdict was
        wrong on a day that already played, the scores from that day stand; the record is what we fix.
      </p>

      <h2>The log</h2>
      {log.length === 0 ? (
        <p>No corrections yet. The desk is open.</p>
      ) : (
        <ol className="index-list">
          {log.map((c) => {
            const item = c.claimId ? getClaim(c.claimId) : undefined;
            const s = c.storySlug ? getStory(c.storySlug) : undefined;
            return (
              <li key={`${c.date}-${c.claimId ?? c.storySlug}`} className="correction">
                <span className="mono-s">{c.date}</span>
                <p>
                  {item ? <strong>&ldquo;{item.claim}&rdquo; </strong> : null}
                  {s ? (
                    <strong>
                      <Link href={storyPath(s.slug)}>{s.title}</Link>{" "}
                    </strong>
                  ) : null}
                  {c.summary}
                  {c.credit ? <em> Thanks to {c.credit}.</em> : null}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </DocPage>
  );
}
