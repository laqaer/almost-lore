import type { Metadata } from "next";
import Link from "next/link";
import { DocPage } from "@/components/doc-page";
import { Slab } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { getClaim } from "@/lib/game/content";
import { RANKS, VERDICT_DEF } from "@/lib/game/scoring";
import { pageMetadata } from "@/lib/metadata";
import { faqJsonLd } from "@/lib/schema";
import { editorialNote } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "How to play & how we source",
  description:
    "The rules of Almost Lore: what HAPPENED, ALMOST and LORE mean, how scoring and streaks work, and the sourcing rubric every claim must pass.",
  path: "/rules",
});

const EXAMPLES = {
  happened: "cleopatra-closer-to-moon-landing",
  almost: "seed-greenland-1946",
  lore: "seed-viking-helmets",
} as const;

const FAQ = [
  {
    q: "What does ALMOST mean?",
    a: "The central event didn't happen, but documented evidence shows it came close: a formal offer, a failed vote, an operation launched and then called off, a treaty signed but never ratified. Wanting something isn't enough.",
  },
  {
    q: "When does a new docket open?",
    a: "At midnight in your own time zone, every day. Everyone gets the same five claims on the same date.",
  },
  {
    q: "Do I need an account?",
    a: "No. Your streak and history live in your browser. Clearing site data resets them.",
  },
];

export default function RulesPage() {
  const ex = {
    happened: getClaim(EXAMPLES.happened),
    almost: getClaim(EXAMPLES.almost),
    lore: getClaim(EXAMPLES.lore),
  };
  return (
    <DocPage
      kicker="The rulebook"
      title="The Rules"
      dek="Five claims a day, written as plain fact. Stamp each one. The record decides."
      updated="September 25, 2026"
    >
      <JsonLd data={faqJsonLd(FAQ)} />
      <h2>The three stamps</h2>
      <ul className="stamp-rules">
        {(["happened", "almost", "lore"] as const).map((v) => (
          <li key={v}>
            <Slab v={v} />
            <div>
              <p>
                <strong>{VERDICT_DEF[v]}.</strong>{" "}
                {v === "happened"
                  ? "Every name, number, date and place in the claim is right, exactly as written."
                  : v === "almost"
                    ? "It didn't happen — but the paperwork shows it came close. The offer was made, the vote was held, the order was signed."
                    : "A story everybody repeats that the record doesn't support, and that never came close to happening."}
              </p>
              {ex[v] ? (
                <p className="fine" style={{ marginTop: 6, textTransform: "none", letterSpacing: 0, fontSize: 14 }}>
                  Example: &ldquo;{ex[v]!.claim}&rdquo;
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <h2>How a day works</h2>
      <p>
        A new docket of five claims opens at your local midnight. Stamp a claim and its card flips to <em>the record</em>: the
        verdict, what actually happened, and at least two sources you can open. The fifth card is <strong>the trap</strong> —
        the one most people get wrong. There&apos;s no timer. Keyboard players can use <kbd>H</kbd>, <kbd>A</kbd> and{" "}
        <kbd>L</kbd>.
      </p>
      <p>
        Your score is how many stamps you kept, out of five, and it earns a rank:
      </p>
      <ol className="rank-list">
        {RANKS.map((r, i) => (
          <li key={r.title}>
            <span className="wood">{i}</span> <strong>{r.title}</strong> — {r.line}
          </li>
        ))}
      </ol>
      <p>
        Play on consecutive days to build a streak. Share your result as a row of marks that gives nothing away, or send a
        challenge link: your friend plays the same five and sees your stamps only after they&apos;ve made theirs. Missed a
        day? Past dockets are in <Link href="/answers">the archive</Link>, and the answers publish once a docket has closed
        everywhere on Earth.
      </p>

      <h2>How we source</h2>
      <p>Every claim passes the same gauntlet before it reaches you:</p>
      <ol>
        <li>
          <strong>Two sources, minimum</strong>, each with a quote that supports the verdict. Encyclopedias, archives,
          museums, scholarly and major news sources. Listicles never count.
        </li>
        <li>
          <strong>No wording traps.</strong> We write the closest true sentence to every claim. If the only difference is a
          swapped name, number or date, the claim is cut. You should be judging history, not proofreading.
        </li>
        <li>
          <strong>No arguments about definitions</strong> and <strong>no disputed history</strong>. If a fair expert could
          argue for a different stamp, the claim is cut.
        </li>
        <li>
          <strong>An adversarial check.</strong> A separate fact-checker tries to refute every verdict before it&apos;s
          scheduled, and a second read happens the week it goes live.
        </li>
        <li>
          <strong>Care with real lives.</strong> Claims involving deaths are marked and never played for laughs. No claims about
          living private people.
        </li>
      </ol>
      <p>
        {editorialNote} Think we got one wrong? Every record has an &ldquo;Argue with the record&rdquo; link, and upheld
        corrections are logged on <Link href="/corrections">the corrections page</Link>.
      </p>

      <h2>Questions</h2>
      {FAQ.map((f) => (
        <p key={f.q}>
          <strong>{f.q}</strong> {f.a}
        </p>
      ))}
    </DocPage>
  );
}
