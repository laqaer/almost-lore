import Link from "next/link";
import { site } from "@/lib/site";
import { readingMinutes, stories, storyPath } from "@/lib/stories";

export default function HomePage() {
  const [lead, ...rest] = stories;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <article className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-rust">
          {lead.yearLabel}
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] text-ink sm:text-6xl">
          <Link className="hover:text-rust" href={storyPath(lead.slug)}>
            {lead.title}
          </Link>
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-2xl leading-9 text-ink-soft">{lead.dek}</p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink">{lead.hook}</p>
        <p className="mt-8">
          <Link
            className="text-sm text-moss underline underline-offset-4 hover:text-rust"
            href={storyPath(lead.slug)}
          >
            Read
          </Link>
          <span className="ml-3 text-sm text-ink-faint">{readingMinutes(lead)} min</span>
        </p>
      </article>

      <section id="stories" className="mt-16 border-t border-rule pt-10">
        <h2 className="sr-only">More</h2>
        <ul className="divide-y divide-rule border-b border-rule">
          {rest.map((story) => (
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
            </li>
          ))}
        </ul>
      </section>
      <p className="sr-only">{site.name}</p>
    </div>
  );
}
