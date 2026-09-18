import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { articleJsonLd } from "@/lib/schema";
import { readingMinutes, stories, storyPath, type Story } from "@/lib/stories";

type StoryArticleProps = {
  story: Story;
};

export function StoryArticle({ story }: StoryArticleProps) {
  const others = stories.filter((item) => item.slug !== story.slug);
  const path = storyPath(story.slug);

  return (
    <article className="mx-auto max-w-measure px-4 py-12 sm:px-6">
      <JsonLd
        data={articleJsonLd({
          headline: story.title,
          description: story.dek,
          path,
          datePublished: story.published,
          dateModified: story.updated,
        })}
      />
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-rust">
        {story.yearLabel}
      </p>
      <h1 className="mt-3 font-display text-4xl leading-[1.15] text-ink sm:text-5xl">
        {story.title}
      </h1>
      <p className="mt-5 text-xl leading-8 text-ink-soft">{story.dek}</p>
      <p className="mt-4 text-sm text-ink-faint">
        {readingMinutes(story)} min read · Updated {story.updated}
      </p>

      <aside className="hook-card mt-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-rust">The hook</p>
        <p className="mt-2 font-serif text-lg leading-7 text-ink">{story.hook}</p>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
          That is the compressed line that tends to travel. The essay below is the public-record
          version.
        </p>
      </aside>

      <div className="prose-lore mt-10">
        {story.sections.map((section, index) => (
          <section key={section.heading ?? `opening-${index}`}>
            {section.heading ? <h2>{section.heading}</h2> : null}
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>

      <aside className="mt-12 border-t border-rule pt-8 text-sm leading-6 text-ink-soft">
        <p>
          <strong className="text-ink">On sources. </strong>
          {story.sourcesNote}
        </p>
      </aside>

      <nav aria-label="More stories" className="mt-14 border-t border-rule pt-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-rust">More stories</p>
        <ul className="mt-4 space-y-3">
          {others.map((item) => (
            <li key={item.slug}>
              <Link className="font-serif text-lg text-moss hover:text-rust" href={storyPath(item.slug)}>
                {item.title}
              </Link>
              <p className="text-sm text-ink-soft">{item.dek}</p>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
