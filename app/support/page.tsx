import type { Metadata } from "next";
import Link from "next/link";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";
import { site } from "@/lib/site";

const title = "Support";
const description =
  "Send Almost Lore a correction, a refund request, or a note about the Poyais working file.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/support" },
  openGraph: {
    ...openGraphImage,
    title,
    description,
    url: "/support",
  },
  twitter: {
    ...twitterWithImage,
    title,
    description,
  },
};

export default function SupportPage() {
  return (
    <article className="mx-auto max-w-measure px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-rust">Support</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.15] text-ink sm:text-5xl">
        A correction, a refund, a note
      </h1>
      <div className="prose-page mt-8">
        <p>
          {site.email} is printed on the about page, and this site does not currently receive
          mail at that address. Use this form. The note is stored for the publisher. It does not
          add you to a newsletter.
        </p>
        <form className="space-y-4 not-prose" method="post" action="/api/support">
          <p className="hidden" aria-hidden="true">
            <label>
              Company
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </p>
          <label className="block text-sm text-ink">
            Topic
            <select className="mt-1 block w-full border border-rule bg-card px-3 py-2" name="topic">
              <option value="correction">Correction</option>
              <option value="refund">Refund</option>
              <option value="download">Download problem</option>
              <option value="other">Something else</option>
            </select>
          </label>
          <label className="block text-sm text-ink">
            Email, if you want a reply
            <input
              className="mt-1 block w-full border border-rule bg-card px-3 py-2"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={200}
            />
          </label>
          <label className="block text-sm text-ink">
            Note
            <textarea
              className="mt-1 block min-h-40 w-full border border-rule bg-card px-3 py-2"
              name="message"
              required
              minLength={4}
              maxLength={4000}
            />
          </label>
          <button className="bg-ink px-4 py-2 text-sm text-paper hover:bg-rust" type="submit">
            Send the note
          </button>
        </form>
        <p>
          Refunds for the working file are described on the <Link href="/terms">terms</Link> page.
          The free essays do not need a purchase to read.
        </p>
      </div>
    </article>
  );
}
