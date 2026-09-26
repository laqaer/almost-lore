import type { Metadata } from "next";
import Link from "next/link";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";
import { site } from "@/lib/site";
import { stories, storyPath } from "@/lib/stories";

const title = "Now";
const description =
  "What Almost Lore is focused on now: public-record near-misses, the longforms on the site, and how to send a correction.";

const updated = "2026-09-26";

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
          Original longform about documented historical near-misses and odd public facts. A scheme
          that sold a country, a poison legend that outran the trial file, a balloon that ditched
          short of Europe, a subway that ran one block, an almost-war on the Nile. If the archive
          is thin, the sentence stays thin.
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
          The newest longform is the Pig War on San Juan Island. The Poyais essay now points at
          a separate working file. That file is $9 only when the dossier page says card checkout
          is open. There is still no newsletter and no account. Display ads are not running. If
          they are added later to pay hosting, the about page and the privacy page will say so.
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
