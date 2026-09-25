import type { Metadata } from "next";
import Link from "next/link";
import { DocPage } from "@/components/doc-page";
import { pageMetadata } from "@/lib/metadata";
import { editorialNote, fundingNote, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About Almost Lore",
  description:
    "Almost Lore is a daily history game about near-misses, myths and true stories that sound made up. Who makes it, how it's checked, and how it's paid for.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <DocPage
      kicker="The masthead"
      title="About"
      dek="A daily almanac of near-misses, published by people who can't let a wrong fact go."
    >
      <p>
        <strong>Almost Lore</strong> is a daily history game. Every day at your local midnight, five claims go to press,
        each written as plain fact. You stamp each one <strong>HAPPENED</strong>, <strong>ALMOST</strong> or{" "}
        <strong>LORE</strong>, and the card flips to the record: what actually happened, with the sources.
      </p>
      <p>
        The middle stamp is the point. True-or-false is easy to fake; <em>almost</em> makes you know how close a thing came —
        the offer that was refused, the vote that failed, the war that stayed in the newspapers. History is full of them, and
        they are better stories than most of what did happen.
      </p>

      <h2>Who makes it</h2>
      <p>
        Almost Lore is published by <strong>{site.publisher}</strong>. {editorialNote}
      </p>
      <p>
        Every claim goes through a gauntlet before it reaches you: a researcher drafts it with sources and verbatim quotes, a
        separate adversarial fact-checker tries to refute it, and a fairness judge cuts anything where a reasonable expert
        could argue for a different stamp. The full rubric is public on <Link href="/rules">the rules page</Link>.
      </p>

      <h2>When we get one wrong</h2>
      <p>
        We will, occasionally. Every claim has an &ldquo;argue with the record&rdquo; link. Upheld corrections are fixed and
        logged publicly on <Link href="/corrections">the corrections page</Link>, with credit if you want it.
      </p>

      <h2>How it&apos;s paid for</h2>
      <p>{fundingNote}</p>
      <ul>
        <li>
          <Link href="/shop/party-pack">The Party Pack</Link> — the game, printed, for your table.
        </li>
        <li>
          <Link href="/shop/classroom-pack">The Classroom Pack</Link> — bell-ringers for teachers.
        </li>
        <li>
          <Link href="/halloween">Seasonal editions</Link> — free to play, with printable packs.
        </li>
      </ul>
      <p>
        No accounts, no ads, no selling your data. Details on the <Link href="/privacy">privacy page</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        Press, schools, partnerships or a strongly held opinion about Napoleon&apos;s height:{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </DocPage>
  );
}
