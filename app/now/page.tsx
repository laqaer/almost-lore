import type { Metadata } from "next";
import Link from "next/link";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";
import { site } from "@/lib/site";
import { stories, storyPath } from "@/lib/stories";

const title = "Now";
const description =
  "What is on the desk: the longforms up, the ones just added, and where to send a correction.";

const updated = "2026-09-25";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/now" },
  openGraph: {
    ...openGraphImage,
    title,
    description,
    url: "/now",
  },
  twitter: {
    ...twitterWithImage,
    title,
    description,
  },
};

export default function NowPage() {
  const published = [...stories].sort((a, b) => (a.published < b.published ? 1 : -1));
  const newest = published[0];

  return (
    <article className="mx-auto max-w-measure px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-rust">Now</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.15] text-ink sm:text-5xl">
        What Almost Lore is focused on
      </h1>
      <p className="mt-4 text-sm text-ink-faint">Updated {updated}.</p>
      <div className="prose-page mt-8">
        <h2>Current editorial focus</h2>
        <p>
          The file, not the slogan. Newest on the desk: a bacterium sprayed over San Francisco in
          September 1950, Bering’s winter on the island that kept him, and the Darien colony that
          Scotland landed twice. Older pieces stay up: the paper country, the poison legend, the
          balloon, the one-block subway, the fort on the Nile.
        </p>
        <p>
          The standard is on the <Link href="/about">about</Link> page: public record first, no
          scraped threads, no invented counts.
        </p>

        <h2>Longforms on the site</h2>
        <p>
          {stories.length} longforms are published. The newest is{" "}
          <Link href={storyPath(newest.slug)}>{newest.title}</Link> ({newest.published}). Dates
          below are the days those essays went up here. We do not publish traffic or revenue
          figures.
        </p>
        <ul>
          {published.map((story) => (
            <li key={story.slug}>
              <Link href={storyPath(story.slug)}>{story.title}</Link> ({story.published})
            </li>
          ))}
        </ul>

        <h2>What’s next</h2>
        <p>
          One sourced essay at a time, chosen because someone is already repeating it wrong.
          Candidates on the desk, not yet written: the Dyatlov pass, the 1908 Tunguska airburst,
          the 1961 Goldsboro bomb that did not detonate, the Radium Girls’ first refusal, the
          Antikythera mechanism’s missing half. No newsletter. No accounts. Display ads are the
          funding plan and are not switched on; ads.txt is still a placeholder.
        </p>

        <h2>Contact</h2>
        <p>
          The site is published at {site.domain}. For a correction — a date we should hedge, a
          count we should unsay — write <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        <p>
          This is a /now page in the sense <a href="https://sive.rs/now">Derek Sivers</a> described
          at <a href="https://nownownow.com/">nownownow.com</a>.
        </p>
      </div>
    </article>
  );
}
