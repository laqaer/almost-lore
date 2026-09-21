import type { Metadata } from "next";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";

const title = "Friends";
const description =
  "A short blogroll of public history and editorial sites a reader of Almost Lore might like.";

const friends = [
  {
    name: "The Public Domain Review",
    href: "https://publicdomainreview.org/",
    note: "Essays and image essays from works out of copyright. The odd fact stays attached to a source.",
  },
  {
    name: "JSTOR Daily",
    href: "https://daily.jstor.org/",
    note: "Short essays that point at the journal article or book underneath a public fact.",
  },
  {
    name: "Lapham’s Quarterly",
    href: "https://www.laphamsquarterly.org/",
    note: "History by theme, built from excerpts written at the time, plus later essays.",
  },
  {
    name: "Aeon",
    href: "https://aeon.co/",
    note: "Commissioned essays in history, philosophy, and science. Edited prose, free to read.",
  },
  {
    name: "Contingent",
    href: "https://contingentmagazine.org/",
    note: "History written by historians, published outside the paywalled journal.",
  },
  {
    name: "History Workshop",
    href: "https://www.historyworkshop.org.uk/",
    note: "A long-running radical-history project. The essays are public, and they argue.",
  },
  {
    name: "The History of the Web",
    href: "https://thehistoryoftheweb.com/",
    note: "Jay Hoffmann’s indie site on how the web actually got built. Documented, and not a product blog.",
  },
] as const;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/friends" },
  openGraph: {
    ...openGraphImage,
    title,
    description,
    url: "/friends",
  },
  twitter: {
    ...twitterWithImage,
    title,
    description,
  },
};

export default function FriendsPage() {
  return (
    <article className="mx-auto max-w-measure px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-rust">Friends</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.15] text-ink sm:text-5xl">
        Sites in the neighborhood
      </h1>
      <div className="prose-page mt-8">
        <p>
          Public history desks, essay magazines, and one indie history of the web. A reader who
          wants the footnote version of a near-miss may want these too. The notes are ours. None
          of these is an ad, and none is an affiliate link.
        </p>
        <ul>
          {friends.map((friend) => (
            <li key={friend.href}>
              <a href={friend.href}>{friend.name}</a>
              {" — "}
              {friend.note}
            </li>
          ))}
        </ul>
        <p>
          This is a /friends page, inspired by{" "}
          <a href="https://slashfriends.org/">slashfriends.org</a> and{" "}
          <a href="https://nickgray.net/">Nick Gray</a>.
        </p>
      </div>
    </article>
  );
}
