import type { Metadata } from "next";
import Link from "next/link";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";
import { site } from "@/lib/site";

const title = "Terms of the working file";
const description =
  "The price, delivery, and refund terms for the Almost Lore Poyais working file. Essays on the site stay free.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  openGraph: {
    ...openGraphImage,
    title,
    description,
    url: "/terms",
  },
  twitter: {
    ...twitterWithImage,
    title,
    description,
  },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-measure px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-rust">Terms</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.15] text-ink sm:text-5xl">
        Terms of the working file
      </h1>
      <p className="mt-4 text-sm text-ink-faint">Last updated {site.updated}.</p>
      <div className="prose-page mt-8">
        <p>
          These terms cover one product: the Poyais working file sold by {site.publisher} from{" "}
          {site.domain}. They do not cover the essays. The essays are free to read.
        </p>

        <h2>The offer</h2>
        <p>
          When the dossier page shows a checkout button, the price is $9 USD, charged once
          through Stripe. There is no subscription and no account. The button is withheld when
          checkout is not connected or is paused. A page that says checkout is closed is not an
          offer.
        </p>

        <h2>What you receive</h2>
        <p>
          After Stripe reports the payment as paid, and not refunded, a download link returns
          one HTML file: the dossier described on the <Link href="/dossier">dossier page</Link>.
          It is a reading aid based on published scholarship. It is not a certified copy of an
          archival document, not legal advice, and not a license to republish the file as your
          own.
        </p>

        <h2>Refunds</h2>
        <p>
          Ask within 14 days of the charge if the file is missing, will not download, or is not
          the dossier described on that page. Use the <Link href="/support">support form</Link>{" "}
          and include the email you entered at checkout. We refund the charge through Stripe.
          Reading the free essay is not a purchase and needs no refund.
        </p>

        <h2>Corrections</h2>
        <p>
          If a date or a figure in the file is wrong, write through the support form. A
          correction updates the file. It is not, by itself, a promise of a refund.
        </p>

        <h2>Stopping checkout</h2>
        <p>
          We can pause new sales. A pause does not cancel a download you already paid for and
          does not keep a charge we have agreed to refund.
        </p>
      </div>
    </article>
  );
}
