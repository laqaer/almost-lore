import type { Metadata } from "next";
import Link from "next/link";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";
import { site } from "@/lib/site";
import { stories, storyPath } from "@/lib/stories";

const title = "Now";
const description =
  "What Almost Lore is focused on now: public-record near-misses, the longforms on the site, and how to send a correction.";

const updated = "2026-09-27";

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
  const published = [...stories].sort((a, b) => {
    const byPublished = b.published.localeCompare(a.published);
    if (byPublished !== 0) return byPublished;
    const byUpdated = b.updated.localeCompare(a.updated);
    if (byUpdated !== 0) return byUpdated;
    return stories.indexOf(b) - stories.indexOf(a);
  });
  const newest = published[0];

  return (
    <article className="folio">
      <h1 className="folio-title">What Almost Lore is focused on</h1>
      <p className="colophon">Updated {updated}.</p>
      <div className="prose-page mt-8">
        <h2>Current editorial focus</h2>
        <p>
          Original longform about documented historical near-misses and odd public facts. A scheme
          that sold a country, a poison legend that outran the trial file, a balloon that ditched
          short of Europe, a subway that ran one block, an almost-war on the Nile. If the archive
          is thin, the sentence stays thin.
        </p>
        <p>
          The standard is on the <Link href="/about">about</Link> page: public record first,
          sources named, uncertainty left visible.
        </p>

        <h2>Longforms on the site</h2>
        <p>
          {stories.length} longforms are published. The newest is{" "}
          <a href={storyPath(newest.slug)}>{newest.title}</a> ({newest.published}). Dates
          below are the days those essays went up here.
        </p>
        <ul>
          {published.map((story) => (
            <li key={story.slug}>
              <a href={storyPath(story.slug)}>{story.title}</a> ({story.published})
            </li>
          ))}
        </ul>

        <h2>What’s next</h2>
        <p>
          The newest longform is <a href={storyPath(newest.slug)}>{newest.title}</a>. The
          Poyais essay now points at a separate working file. That file is $9 only when the
          dossier page says card checkout is open. There is no newsletter and no account. Some
          essays link to books on Amazon; the about and privacy pages say so. If display ads are
          added later to cover hosting, those pages will say so.
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
