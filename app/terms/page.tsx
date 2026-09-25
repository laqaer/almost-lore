import type { Metadata } from "next";
import Link from "next/link";
import { DocPage } from "@/components/doc-page";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms & refunds",
  description: "The terms for playing Almost Lore and buying its printable packs, including our refund promise.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <DocPage kicker="The fine print" title="Terms & refunds" updated={site.updated}>
      <p>
        These terms cover almostlore.com and the digital products sold on it, published by{" "}
        {site.publisher}. Using the site or buying a product means you accept them.
      </p>

      <h2>The game</h2>
      <p>
        The daily game, the archive and the Case Files are free to use for personal, classroom and
        non-commercial purposes. Please link rather than copy: the claims, records and essays are our
        original work. Short quotes with a link back are always fine.
      </p>

      <h2>Accuracy</h2>
      <p>
        Every verdict is researched and fact-checked under our public <Link href="/rules">rules</Link>,
        and we correct mistakes in public on the <Link href="/corrections">corrections log</Link>. History
        is still an argument, not a warranty: the site is provided &ldquo;as is&rdquo;.
      </p>

      <h2>Digital products and licences</h2>
      <ul>
        <li>
          <strong>Household packs</strong> (Party Pack, seasonal packs): print as many copies as your own
          household or party needs. Not for resale or redistribution.
        </li>
        <li>
          <strong>Office Edition:</strong> one organisation, unlimited internal events. Not for public
          ticketed events or resale.
        </li>
        <li>
          <strong>Classroom Pack:</strong> one teacher and all of their classes; the department licence
          covers up to ten teachers in one department. Posting the files on a public website or
          marketplace is not allowed; sharing with your students in your own learning platform is.
        </li>
      </ul>

      <h2>Delivery</h2>
      <p>
        Downloads are available immediately after payment on the confirmation page. Keep the link:
        it works again whenever you need to re-download. If anything fails, email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> with your receipt and we&apos;ll send the files.
      </p>

      <h2>Refunds</h2>
      <p>
        If a pack doesn&apos;t work for your table or your classroom, email us within 30 days of purchase
        and we&apos;ll refund you in full. No forms, no argument.
      </p>

      <h2>Who makes this</h2>
      <p>
        Almost Lore is written and fact-checked by an AI editorial team working under a public rubric,
        with a human publisher ({site.publisher}) accountable for everything that ships. Questions:{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </DocPage>
  );
}
