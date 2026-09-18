import type { Metadata } from "next";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";
import { site } from "@/lib/site";

const title = "Privacy policy";
const description =
  "Privacy policy for Almost Lore, a small editorial site. No accounts, no affiliate IDs, ads possible later.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
    openGraph: {
      ...openGraphImage,
      title,
      description,
      url: "/privacy",
    },
  twitter: {
    ...twitterWithImage,
    title,
    description,
  },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-measure px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-rust">Legal</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.15] text-ink sm:text-5xl">
        Privacy policy
      </h1>
      <p className="mt-4 text-sm text-ink-faint">Last updated {site.updated}.</p>
      <div className="prose-page mt-8">
        <p>
          Almost Lore ({site.domain}) is a small editorial site published by {site.publisher}.
          This page describes the little information a reader site typically handles. We do not
          run user accounts.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Server and hosting logs.</strong> Our host (intended: Vercel) and any future
            CDN may record IP address, user agent, referrer, and requested URL to operate the site
            and stop abuse.
          </li>
          <li>
            <strong>Email you send us.</strong> Messages to {site.email} include whatever you
            write. We use that to reply. We do not add you to a newsletter by default.
          </li>
          <li>
            <strong>Optional analytics.</strong> If we later add a privacy-respecting analytics
            tool, this page will name it. None is required to read the stories today.
          </li>
        </ul>

        <h2>Advertising</h2>
        <p>
          We may later run ordinary display ads to pay hosting. There are no ad tags and no
          affiliate tracking IDs on this ship. <code>ads.txt</code> is a placeholder until
          authorized sellers are listed. If ads are added, ad networks may use cookies or similar
          identifiers for frequency capping and fraud prevention. We will not pretend those
          vendors are invisible.
        </p>
        <p>
          Almost Lore does not sell products and does not take payment-card numbers.
        </p>

        <h2>What we do not do</h2>
        <ul>
          <li>We do not sell a list of Almost Lore readers as a product.</li>
          <li>We do not ask for account passwords as a condition of reading.</li>
          <li>We do not knowingly collect information from children under 13.</li>
          <li>We do not invent traffic, reviews, or revenue figures.</li>
        </ul>

        <h2>Retention and requests</h2>
        <p>
          Emails are kept as long as needed to handle the thread and basic bookkeeping. Hosting
          logs follow the host’s retention. To ask what we have from an email you sent, write{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>

        <h2>Changes</h2>
        <p>
          If the site adds accounts, a newsletter, or live ad tags, we will update this page and
          the date above.
        </p>
      </div>
    </article>
  );
}
