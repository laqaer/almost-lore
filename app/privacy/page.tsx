import type { Metadata } from "next";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";
import { site } from "@/lib/site";

const title = "Privacy policy";
const description =
  "Privacy policy for Almost Lore, a small editorial site. No accounts. Advertising is not active; providers and data use would be named here first.";

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
            <strong>Server and hosting logs.</strong> The site is hosted on Vercel. Vercel may
            record IP address, user agent, referrer, and requested URL to operate the site and stop
            abuse.
          </li>
          <li>
            <strong>Email you send us.</strong> Messages to {site.email} include whatever you
            write. We use them only to reply, and we never add you to a newsletter. The{" "}
            <a href="/support">support form</a> is the reliable way to reach us and get a reply.
          </li>
          <li>
            <strong>Support form.</strong> The <a href="/support">support page</a> stores your
            note, the topic you pick, and an email if you type one. Those records sit in
            Cloudflare Workers KV on the publisher’s account. We use them to answer corrections,
            download problems, and refund requests. We do not sell that list.
          </li>
          <li>
            <strong>Checkout, when it is open.</strong> Stripe hosts the payment page. Almost
            Lore does not receive your card number. We receive the checkout result Stripe sends
            back: whether the $9 working file was paid, refunded, or abandoned. Test charges, if
            we ever run them, are not treated as customer revenue.
          </li>
          <li>
            <strong>Optional analytics.</strong> If we later add a privacy-respecting analytics
            tool, this page will name it. None is required to read the stories today.
          </li>
        </ul>

        <h2>Advertising</h2>
        <p>
          Advertising is not currently active, and there are no affiliate links on the site
          today. If advertising or affiliate links are introduced, this page will identify the
          providers, what they collect, how it is used, and the privacy controls available to you.
        </p>
        <p>
          The essays are free. The Poyais working file is a separate $9 download when checkout
          is open. Almost Lore does not take payment-card numbers; Stripe does, on Stripe’s page.
        </p>

        <h2>What we do not do</h2>
        <ul>
          <li>We do not sell a list of Almost Lore readers as a product.</li>
          <li>We do not ask for account passwords as a condition of reading.</li>
          <li>We do not knowingly collect information from children under 13.</li>
        </ul>

        <h2>Retention and requests</h2>
        <p>
          Emails are kept as long as needed to handle the thread and basic bookkeeping. Hosting
          logs follow Vercel’s retention. To ask what we hold from a note you sent, use the{" "}
          <a href="/support">support form</a>.
        </p>

        <h2>Changes</h2>
        <p>
          If the site adds accounts, a newsletter, or advertising, we will update this page and
          the date above.
        </p>
      </div>
    </article>
  );
}
