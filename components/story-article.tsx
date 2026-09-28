import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { JsonLd } from "@/components/json-ld";
import { articleJsonLd } from "@/lib/schema";
import { siteUrl } from "@/lib/site";
import { readingMinutes, stories, storyPath, type Story } from "@/lib/stories";
import { storyLinks } from "@/lib/stories/links";
import { storyMedia } from "@/lib/stories/media";

type StoryArticleProps = {
  story: Story;
};

export function StoryArticle({ story }: StoryArticleProps) {
  const others = stories.filter((item) => item.slug !== story.slug).slice(0, 4);
  const path = storyPath(story.slug);
  const media = storyMedia[story.slug];
  const links = storyLinks[story.slug] ?? [];
  const midpoint = Math.ceil(story.sections.length / 2);

  return (
    <article className="mx-auto max-w-measure px-4 py-12 sm:px-6">
      <JsonLd
        data={articleJsonLd({
          headline: story.title,
          description: story.dek,
          path,
          datePublished: story.published,
          dateModified: story.updated,
          images: media ? [`${siteUrl()}${media.src}`] : undefined,
        })}
      />
      <p className="kicker">{story.yearLabel}</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.12] text-ink sm:text-5xl">
        {story.title}
      </h1>
      <p className="mt-5 text-xl leading-8 text-ink-soft">{story.dek}</p>
      <p className="mt-4 text-sm text-ink-faint">
        {readingMinutes(story)} min read · Updated {story.updated}
      </p>

      {media ? (
        <figure className="mt-8">
          <Image
            alt={media.alt}
            className="h-auto w-full bg-paper-deep"
            height={media.height}
            priority
            sizes="(min-width: 768px) 40rem, 100vw"
            src={media.src}
            unoptimized
            width={media.width}
          />
          <figcaption className="mt-2 text-xs text-ink-faint">
            {media.creditUrl ? (
              <a
                className="underline underline-offset-2 hover:text-rust"
                href={media.creditUrl}
                rel="noopener"
              >
                {media.credit}
              </a>
            ) : (
              media.credit
            )}
          </figcaption>
        </figure>
      ) : null}

      <div className="prose-lore mt-10">
        {story.sections.map((section, index) => (
          <Fragment key={section.heading ?? `section-${index}`}>
            <section>
              {section.heading ? <h2>{section.heading}</h2> : null}
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
            </section>
            {index === midpoint - 1 ? <AdSlot className="not-prose my-10" /> : null}
          </Fragment>
        ))}
      </div>

      <aside className="mt-12 border-t border-rule pt-8 text-sm leading-6 text-ink-soft">
        <p>
          <strong className="text-ink">On sources. </strong>
          {story.sourcesNote}
        </p>
        {story.dossier ? (
          <p className="mt-4">
            <strong className="text-ink">Working file. </strong>
            {story.dossier.note}{" "}
            <Link
              className="text-teal underline underline-offset-3 hover:text-rust"
              href={story.dossier.href}
            >
              {story.dossier.label}
            </Link>
          </p>
        ) : null}
      </aside>

      {links.length > 0 ? (
        <aside className="mt-12 border-t border-rule pt-8 text-sm leading-6 text-ink-soft">
          <p className="kicker">Further reading</p>
          <ul className="mt-3 space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  className="text-teal underline underline-offset-3 hover:text-rust"
                  href={link.href}
                  rel="noopener"
                  target="_blank"
                >
                  {link.label}
                </a>
                {" — "}
                {link.note}
              </li>
            ))}
          </ul>
        </aside>
      ) : null}

      <nav aria-label="More stories" className="mt-14 border-t border-rule pt-8">
        <p className="kicker">More stories</p>
        <ul className="mt-4 space-y-3">
          {others.map((item) => (
            <li key={item.slug}>
              <Link
                className="font-serif text-lg text-teal hover:text-rust"
                href={storyPath(item.slug)}
              >
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
