import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { JsonLd } from "@/components/json-ld";
import { StoryCard } from "@/components/story-card";
import { StoryTools } from "@/components/story-tools";
import { articleJsonLd } from "@/lib/schema";
import { siteUrl } from "@/lib/site";
import { readingMinutes, stories, storyPath, type Story } from "@/lib/stories";
import { storyCollections } from "@/lib/stories/collections";
import { storyGallery } from "@/lib/stories/gallery";
import { storyLinks } from "@/lib/stories/links";
import { storyMedia, type StoryMedia } from "@/lib/stories/media";

function Caption({ media, label }: { media: StoryMedia; label: string }) {
  return <figcaption className="image-caption"><span>{label}</span><a href={media.creditUrl} rel="noopener">{media.credit}</a></figcaption>;
}

export function StoryArticle({ story }: { story: Story }) {
  const collection = storyCollections[story.slug];
  const others = stories.filter((item) => item.slug !== story.slug)
    .sort((a, b) => Number(storyCollections[b.slug] === collection) - Number(storyCollections[a.slug] === collection))
    .slice(0, 3);
  const path = storyPath(story.slug);
  const media = storyMedia[story.slug];
  const gallery = storyGallery[story.slug] ?? [];
  const links = storyLinks[story.slug] ?? [];
  const midpoint = Math.ceil(story.sections.length / 2);
  const url = `${siteUrl()}${path}`;

  return (
    <article className="shell">
      <div className="read-progress" aria-hidden="true" />
      <JsonLd data={articleJsonLd({ headline: story.title, description: story.dek, path, datePublished: story.published, dateModified: story.updated, images: [media, ...gallery].map((image) => `${siteUrl()}${image.src}`) })} />
      <nav className="story-breadcrumb" aria-label="Breadcrumb"><Link href="/#stories">The stories</Link><span aria-hidden="true">/</span><span>{collection}</span></nav>
      <header className="story-heading">
        <p className="kicker">{collection} · {story.yearLabel}</p>
        <h1>{story.title}</h1>
        <p className="story-dek">{story.dek}</p>
        <div className="story-byline">
          <span>By the Almost Lore editors</span><span>{readingMinutes(story)} min read</span>
          <time dateTime={story.updated}>Updated {story.updated}</time><StoryTools url={url} />
        </div>
      </header>
      <figure className="story-hero">
        <Image src={media.src} alt={media.alt} width={media.width} height={media.height} preload sizes="(min-width: 1100px) 1000px, 100vw" unoptimized />
        <Caption media={media} label="From the archive" />
      </figure>
      <div className="reading-layout">
        <aside className="story-margin">
          <nav aria-label="In this story"><p className="kicker">In this story</p>
            {story.sections.map((section, index) => section.heading ? <a key={index} href={`#section-${index}`}>{section.heading}</a> : null)}
            <a href="#sources">Sources & further reading</a>
          </nav>
          <p>{story.hook}</p>
        </aside>
        <div className="story-body">
          <details className="mobile-contents"><summary>In this story</summary><nav aria-label="Story sections">{story.sections.map((section, index) => section.heading ? <a key={index} href={`#section-${index}`}>{section.heading}</a> : null)}<a href="#sources">Sources & further reading</a></nav></details>
          <div className="prose-lore">
            {story.sections.map((section, index) => (
              <Fragment key={index}>
                <section id={`section-${index}`}>
                  {section.heading ? <h2>{section.heading}</h2> : null}
                  {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                </section>
                {index === midpoint - 1 ? <>
                  {gallery.map((image, imageIndex) => <figure key={image.src} className="archive-plate"><Image src={image.src} alt={image.alt} width={image.width} height={image.height} unoptimized sizes="(min-width: 800px) 640px, 100vw" /><Caption media={image} label={`Archive plate ${imageIndex + 1}`} /></figure>)}
                  <AdSlot className="not-prose my-10" />
                </> : null}
              </Fragment>
            ))}
          </div>
          <aside id="sources" className="story-source-block">
            <p><strong>On sources. </strong>{story.sourcesNote}</p>
            {story.dossier ? <p className="mt-4"><strong>Working file. </strong>{story.dossier.note}{" "}<Link href={story.dossier.href}>{story.dossier.label}</Link></p> : null}
          </aside>
          {links.length > 0 ? <aside className={`story-source-block${story.furtherReading?.length ? "" : " static-aside"}`}><p className="kicker">In the record</p><ul>{links.map((link) => <li key={link.href}><a href={link.href} rel="noopener" target="_blank">{link.label}</a>{" — "}{link.note}</li>)}</ul></aside> : null}
          {story.furtherReading?.length ? <aside className="story-source-block static-aside">
            <p className="kicker">Further reading</p>
            <ul>{story.furtherReading.map((book) => <li key={book.href}><a href={book.href} rel="sponsored nofollow noopener" target="_blank">{book.title}</a>{" — "}{book.author}<span className="mt-1 block">{book.note}</span></li>)}</ul>
            <p className="mt-4 text-ink-faint">As an Amazon Associate, Almost Lore earns from qualifying purchases.</p>
          </aside> : null}
          <div className="story-end"><p>A story worth passing on?</p><StoryTools url={url} /></div>
        </div>
      </div>
      <nav aria-label="More stories" className="more-stories">
        <div className="section-heading"><div><p className="kicker">One more rabbit hole</p><h2>Stay a little longer<span className="heading-dot">.</span></h2></div><Link href="/#stories" className="text-link">All stories <span aria-hidden="true">↗</span></Link></div>
        <div className="archive-grid">{others.map((item) => <StoryCard key={item.slug} story={{ slug: item.slug, title: item.title, dek: item.dek, yearLabel: item.yearLabel, collection: storyCollections[item.slug], minutes: readingMinutes(item), media: storyMedia[item.slug] }} />)}</div>
      </nav>
    </article>
  );
}
