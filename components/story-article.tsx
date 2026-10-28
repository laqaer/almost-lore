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
    <article>
      <div className="read-progress" aria-hidden="true" />
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
      <div className="spread">
        <header className="story-head">
          <h1 className="story-title">{story.title}</h1>
          <p className="dek">{story.dek}</p>
          <p className="colophon">
            <span>{story.yearLabel}</span>
            <span>{readingMinutes(story)} min read</span>
            <span>Updated {story.updated}</span>
          </p>
        </header>

        <aside className="marginalia">
          <p>{story.hook}</p>
        </aside>

        {media ? (
          <figure className="story-plate">
            <div className="plate">
              <Image
                alt={media.alt}
                className="h-auto w-full bg-paper-deep"
                height={media.height}
                priority
                sizes="(min-width: 1100px) 68ch, 100vw"
                src={media.src}
                style={{ viewTransitionName: `plate-${story.slug}` }}
                unoptimized
                width={media.width}
              />
            </div>
            <figcaption className="credit">
              {media.creditUrl ? (
                <a href={media.creditUrl} rel="noopener">
                  {media.credit}
                </a>
              ) : (
                media.credit
              )}
            </figcaption>
          </figure>
        ) : null}

        <div className="prose-lore">
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

        <div className="story-end">
          <aside>
            <p>
              <strong>On sources. </strong>
              {story.sourcesNote}
            </p>
            {story.dossier ? (
              <p className="mt-4">
                <strong>Working file. </strong>
                {story.dossier.note}{" "}
                <Link href={story.dossier.href}>{story.dossier.label}</Link>
              </p>
            ) : null}
          </aside>

          {story.furtherReading && story.furtherReading.length > 0 ? (
            <aside className="static-aside">
              <p className="kicker">Further reading</p>
              <ul className="mt-3 space-y-4">
                {story.furtherReading.map((book) => (
                  <li key={book.href}>
                    <a href={book.href} rel="sponsored nofollow noopener" target="_blank">
                      {book.title}
                    </a>
                    {" — "}
                    {book.author}
                    <span className="mt-1 block">{book.note}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-ink-faint">
                As an Amazon Associate, Almost Lore earns from qualifying purchases.
              </p>
            </aside>
          ) : null}

          {links.length > 0 ? (
            <aside className={story.furtherReading?.length ? undefined : "static-aside"}>
              <p className="kicker">
                {story.furtherReading?.length ? "In the record" : "Further reading"}
              </p>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} rel="noopener" target="_blank">
                      {link.label}
                    </a>
                    {" — "}
                    {link.note}
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}

          <nav aria-label="More stories" className="more-stories">
            <p className="kicker">More stories</p>
            <ul className="mt-4 space-y-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <a href={storyPath(item.slug)}>{item.title}</a>
                  <p className="text-base text-ink-soft">{item.dek}</p>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </article>
  );
}
