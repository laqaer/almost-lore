import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";
import { organizationJsonLd } from "@/lib/schema";
import { editorialNote, fundingNote, site } from "@/lib/site";

const title = "About Almost Lore";
const description =
  "Almost Lore is an original-narrative site from Laqaer for public-record historical near-misses. Editorial standards and contact.";

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
          should unsay — write{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        <p>{editorialNote}</p>

        <h2>Editorial standards</h2>
        <ul>
          <li>
            <strong>Original narrative only.</strong> We do not scrape Reddit, paste comment
            threads, or rewrite another site’s article as if it were ours.
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
            <strong>No fake social proof.</strong> No invented reviews, traffic, or revenue.
          </li>
          <li>
            <strong>No other-brand bleed.</strong> This property is Almost Lore — not a dumping
            ground for unrelated Laqaer consumer sites.
          </li>
        </ul>

        <h2>How the site is funded</h2>
        <p>{fundingNote}</p>
        <p>
          There are no affiliate programs and no retailer tracking IDs on this ship. See{" "}
          <Link href="/privacy">privacy</Link> for what a small editorial site actually collects.
        </p>

        <h2>What we are not</h2>
        <p>
          Not a historian’s monograph and not a primary-source edition. The essays are not
          paywalled. One working file may be sold separately; it is a reading aid, not a
          substitute for the archive. If a piece summarizes a scholarly reconstruction, it says
          so. If you need the transcript or the bond notice itself, go to the archive or the
          book — not to a hook.
        </p>
      </div>
    </article>
  );
}
