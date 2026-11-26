import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";
import { pageJsonLd } from "@/lib/schema";
import { site } from "@/lib/site";

const title = "How to reach the editors";
const description =
  "Editorial notes and corrections for Almost Lore, published by Laqaer. The support form stores a note for the publisher.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    ...openGraphImage,
    title,
    description,
    url: "/contact",
  },
  twitter: {
    ...twitterWithImage,
    title,
    description,
  },
};

export default function ContactPage() {
  return (
    <article className="folio">
      <JsonLd data={pageJsonLd({ type: "ContactPage", path: "/contact", name: title, description })} />
      <h1 className="folio-title">
        How to reach Almost Lore
      </h1>
      <div className="prose-page mt-8">
        <p>
          <strong>{site.name}</strong> is an editorial site published by <strong>{site.publisher}</strong>{" "}
          at <strong>{site.domain}</strong>.
        </p>
        <p>
          For editorial notes and corrections, use the <Link href="/support">support form</Link>.
          Your note will be stored for the publisher.
        </p>

        <h2>Where the rest of it lives</h2>
        <ul>
          <li>
            Standards and how the site is funded: <Link href="/about">about</Link>.
          </li>
          <li>
            The correction form: <Link href="/support">support</Link>.
          </li>
          <li>
            What the site handles about readers: <Link href="/privacy">privacy</Link>.
          </li>
        </ul>
      </div>
    </article>
  );
}
