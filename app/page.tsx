import Link from "next/link";
import { site } from "@/lib/site";
import { readingMinutes, stories, storyPath } from "@/lib/stories";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <section className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-rust">A Laqaer reader</p>
        <h1 className="mt-3 font-display text-5xl leading-[1.1] text-ink sm:text-6xl">
          The hook got you here. The record is the story.
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-8 text-ink-soft">
          {site.name} writes original longform about historical near-misses and strange public
          facts — the invented country, the poison legend, the balloon that ditched a hundred miles
          short, the subway that ran one block, the almost-war on the Nile. We do not scrape Reddit.
          We do not invent traffic, reviews, or a body count the archive will not support.
        </p>
      </section>

      <section className="mt-14 grid gap-10 border-t border-rule pt-12 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl text-ink">What this is</h2>
          <div className="prose-page mt-4">
            <p>
              Almost Lore is a small editorial site from {site.publisher}. Each piece starts from
              well-documented public facts — loans, trial files, contemporaneous news, municipal
              charters — and is written as a story with the uncertainty left in. If a later writer
              turned a rumor into a round number, we say so.
            </p>
            <p>
              It is not a shop, a CMS, or a scoreboard. There are no accounts and no affiliate
              tags. Display ads may appear later to pay hosting; until then the pages are just
              pages.
            </p>
          </div>
        </div>
        <div>
          <h2 className="font-display text-3xl text-ink">How a Reddit hook leads here</h2>
          <div className="prose-page mt-4">
            <p>
              A compressed line travels: a man sold a country that was not on the map; a cosmetic
              killed six hundred husbands; New York had a secret subway; two empires almost fought
              over a Nile fort. Those lines are useful as doors. They are poor as essays. People
              land here when they want the version that can survive a footnote.
            </p>
            <p>
              We do not paste threads, harvest comments, or rewrite someone else’s post. If you
              arrived from a hook, the index below is the sourced longform — original prose, labeled
              gaps, no fake certainty.
            </p>
          </div>
        </div>
      </section>

      <section id="stories" className="mt-16">
        <h2 className="font-display text-3xl text-ink">Stories</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Public-record near-misses. Read one, or start with the hook you already know.
        </p>
        <ul className="mt-8 divide-y divide-rule border-y border-rule">
          {stories.map((story) => (
            <li key={story.slug} className="py-8">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-rust">
                {story.yearLabel} · {readingMinutes(story)} min
              </p>
              <h3 className="mt-2 font-display text-3xl leading-tight text-ink">
                <Link className="hover:text-rust" href={storyPath(story.slug)}>
                  {story.title}
                </Link>
              </h3>
              <p className="mt-3 max-w-3xl text-lg leading-7 text-ink-soft">{story.dek}</p>
              <p className="mt-3 font-serif text-ink">
                <span className="text-ink-faint">Hook. </span>
                {story.hook}
              </p>
              <p className="mt-4">
                <Link className="text-sm text-moss underline underline-offset-3 hover:text-rust" href={storyPath(story.slug)}>
                  Read the essay
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
