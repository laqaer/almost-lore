import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutNotice } from "@/components/checkout-notice";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";

const title = "The Poyais working file";
const description =
  "A $9 printable source dossier for the Almost Lore essay on Gregor MacGregor’s Poyais loan. The essay stays free. Checkout is shown only when card payments are actually open.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/dossier" },
  openGraph: {
    ...openGraphImage,
    title,
    description,
    url: "/dossier",
  },
  twitter: {
    ...twitterWithImage,
    title,
    description,
  },
};

export default function DossierPage() {
  return (
    <article className="mx-auto max-w-measure px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-rust">Working file</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.15] text-ink sm:text-5xl">
        The Poyais working file
      </h1>
      <div className="prose-page mt-8">
        <p>
          The essay{" "}
          <Link href="/stories/poyais-invented-country">The country that existed on paper</Link>{" "}
          stays free. This is the separate file: a printable dossier for someone who wants the
          loan mechanics and the figures the essay refuses to flatten.
        </p>
        <p>
          <strong>Price, when checkout is open:</strong> $9 USD, once. Not a subscription. You
          get an HTML file you can open or print. It is a reading aid, not a transcript from the
          archive and not a death toll.
        </p>

        <h2>What is in the file</h2>
        <ul>
          <li>A dated sequence from the 1820 grant through the 1823 repudiation.</li>
          <li>
            The 23 October 1822 loan terms as reconstructed by Damien Clavel: nominal amount,
            bond count, discount, instalments, and the commissions he marks as approximate.
          </li>
          <li>
            The four ships he names, and an explicit list of passenger and death figures this
            file will not adopt.
          </li>
          <li>
            His correction on Thomas Strangeways: often called MacGregor’s alias, identified in
            that paper as a former officer commissioned to write the guide.
          </li>
          <li>A short set of reading-group questions and the citations to open next.</li>
        </ul>
        <p>
          The file says which claims come from Clavel’s published reconstruction and which
          newspaper or shelfmark he cites. It does not pretend Almost Lore opened those boxes.
        </p>

        <h2>What you are not buying</h2>
        <ul>
          <li>The essay. That page does not change if you pay.</li>
          <li>A single agreed death toll. The file refuses one.</li>
          <li>Affiliation with a bookseller. There is no affiliate tag.</li>
          <li>A subscription, an account, or a newsletter.</li>
        </ul>

        <h2>Checkout</h2>
        <CheckoutNotice />
        <p>
          Refunds: 14 days, via the <Link href="/support">support form</Link>, if the file is
          not the dossier described on this page or the download fails after a successful
          charge. The <Link href="/terms">terms</Link> are the whole policy.{" "}
          <Link href="/privacy">Privacy</Link> names Stripe and the support store.
        </p>
      </div>
    </article>
  );
}
