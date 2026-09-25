import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { pageMetadata } from "@/lib/metadata";
import { stories, storyPath } from "@/lib/stories";

export const metadata: Metadata = pageMetadata({
  title: "The Sunday Docket — a weekly history newsletter",
  description:
    "One near-miss a week, told properly. Plus the trap that fooled the most players, and exactly why. Free, weekly, one-click unsubscribe.",
  path: "/newsletter",
});

type Props = { searchParams: Promise<{ status?: string | string[] }> };

const STATUS: Record<string, string> = {
  ok: "You're on the list. First letter lands Sunday.",
  invalid: "That address didn't look right. Try again below.",
  unconfigured: "Sign-ups open in a few days — check back soon.",
  error: "The mail room jammed. Try again in a minute.",
};

export default async function NewsletterPage({ searchParams }: Props) {
  const raw = (await searchParams).status;
  const status = typeof raw === "string" ? STATUS[raw] : undefined;
  const latest = stories[0];

  return (
    <div className="dispatch news-page">
      <div className="wrap">
        <div className="d-left">
          <div className="mono-s" style={{ marginBottom: 18 }}>
            Free · weekly · by electric post
          </div>
          <h1 className="wood">
            The Sunday
            <br />
            <span className="mis" data-t="Docket">
              Docket
            </span>
          </h1>
        </div>
        <div>
          {status ? (
            <p className="form-done" role="status" style={{ marginBottom: 20 }}>
              {status}
            </p>
          ) : null}
          <p>One near-miss a week, told properly. Every Sunday morning:</p>
          <ol className="news-list">
            <li>
              <b>The week&apos;s trap</b> — the claim that fooled the most players, and exactly why.
            </li>
            <li>
              <b>One case file</b> — a longer story from the archive
              {latest ? (
                <>
                  , like <Link href={storyPath(latest.slug)}>{latest.title}</Link>
                </>
              ) : null}
              .
            </li>
            <li>
              <b>Corrections</b> — anything we fixed, in public.
            </li>
            <li>
              <b>First word on new packs</b> — and nothing else to sell you.
            </li>
          </ol>
          <NewsletterForm source="newsletter-page" cta="Subscribe" />
          <p className="mono-s fine">Free. Weekly. Unsubscribe in one click. We never sell the list.</p>
        </div>
      </div>
    </div>
  );
}
