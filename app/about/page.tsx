import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";
import { organizationJsonLd } from "@/lib/schema";
import { editorialNote, fundingNote, site } from "@/lib/site";

const title = "About Almost Lore";
const description =
  "Almost Lore publishes original longform about documented historical near-misses. Editorial standards, how the site is funded, and how to reach us.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
    openGraph: {
      ...openGraphImage,
      title,
      description,
      url: "/about",
    },
  twitter: {
    ...twitterWithImage,
    title,
    description,
  },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-measure px-4 py-12 sm:px-6">
      <JsonLd data={organizationJsonLd()} />
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-rust">About</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.15] text-ink sm:text-5xl">
        A reader for near-misses, published by Laqaer
      </h1>
      <div className="prose-page mt-8">
        <p>
          <strong>Almost Lore</strong> is original longform about documented historical
          near-misses and odd public facts. It is published by <strong>{site.publisher}</strong> at{" "}
          <strong>{site.domain}</strong>. For a correction — a date we should hedge, a count we
          should unsay — use the <Link href="/support">support form</Link>.
        </p>
        <p>{editorialNote}</p>

        <h2>Editorial standards</h2>
        <ul>
          <li>
            <strong>Original narrative.</strong> Every essay is written for this site from primary
            documents and the standard published sources, and each piece names what it draws on.
          </li>
          <li>
            <strong>Public record first.</strong> Loans, trial files, contemporaneous news, and
            municipal paper outrank a later legend. If the archive is thin, the sentence stays
            thin.
          </li>
          <li>
            <strong>Uncertainty stays visible.</strong> We will not average conflicting death
            tolls into a fake precise number.
          </li>
          <li>
            <strong>Sources are named.</strong> Each essay’s note lists the record behind it, so a
            reader can go to the transcript, the treaty, or the loan notice itself.
          </li>
          <li>
            <strong>The site is the essays.</strong> No accounts, no newsletter, no comment
            threads to moderate.
          </li>
        </ul>

        <h2>How the site is funded</h2>
        <p>{fundingNote}</p>
        <p>
          There are no display ads and no affiliate links on the site today. See{" "}
          <Link href="/privacy">privacy</Link> for what a small editorial site collects, and for
          what would be named first if that changes.
        </p>

        <h2>What these essays are</h2>
        <p>
          Narratives, not a historian’s monograph and not a primary-source edition. Each essay
          names its sources and points to the archive behind it. The essays are free to read; one
          working file may be sold separately as a reading aid, not a substitute for the source
          material. Where a piece rests on a scholarly reconstruction, it says so.
        </p>
      </div>
    </article>
  );
}
