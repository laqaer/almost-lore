import type { Metadata } from "next";
import Link from "next/link";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";
import { site } from "@/lib/site";

const title = "Contact";
const description =
  "Write hello@almostlore.com for an editorial note to Almost Lore, published by Laqaer. A stored correction goes through the support form.";

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
    <article className="mx-auto max-w-measure px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-rust">Contact</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.15] text-ink sm:text-5xl">
        How to reach Almost Lore
      </h1>
      <div className="prose-page mt-8">
        <p>
          <strong>{site.name}</strong> is an editorial site published by <strong>{site.publisher}</strong>{" "}
          at <strong>{site.domain}</strong>. There is no separate company behind the name, and no
          staff list to write instead.
        </p>
        <p>
          For editorial notes, write <a href={`mailto:${site.email}`}>{site.email}</a>. If you need
          a stored note, use the <Link href="/support">support form</Link>.
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
