import type { Metadata } from "next";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";

const title = "Friends";
const description =
  "A short list of people and their personal sites a reader of Almost Lore might like.";

const friends = [
  {
    name: "Nick Gray",
    href: "https://nickgray.net/",
    note: "Essays on his own site. He also keeps the /friends directory this page follows.",
  },
  {
    name: "Derek Sivers",
    href: "https://sive.rs/",
    note: "Essays on his own site, and notes on books he has read. The /now page here already points at him.",
  },
  {
    name: "Jay Hoffmann",
    href: "https://jayhoffmann.com/",
    note: "His personal site. He also writes The History of the Web, from research on how the web was built.",
  },
  {
    name: "Bret Devereaux",
    href: "https://acoup.blog/",
    note: "An ancient and military historian, writing long essays on his own site.",
  },
  {
    name: "Ada Palmer",
    href: "https://www.adapalmer.com/",
    note: "Renaissance historian at the University of Chicago. The Ex Urbe essays came out of her research in Italy.",
  },
  {
    name: "Craig Mod",
    href: "https://craigmod.com/",
    note: "Essays on his own site, mostly long walks across Japan and the books that come from them.",
  },
  {
    name: "Manuel Moreale",
    href: "https://manuelmoreale.com/",
    note: "Essays on his own site, and interviews with people about the personal websites they keep.",
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
        People on their own sites
      </h1>
      <div className="prose-page mt-8">
        <p>
          A list of people, and the personal websites they write on. A reader who wants the
          footnote version of a near-miss may want these too. The notes are ours. None of these is
          an ad, and none is an affiliate link.
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
