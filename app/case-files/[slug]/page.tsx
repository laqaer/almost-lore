import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hand, Slab } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { NewsletterForm } from "@/components/newsletter-form";
import { VERDICT_SAY } from "@/lib/game/scoring";
import { pageMetadata } from "@/lib/metadata";
import { articleJsonLd } from "@/lib/schema";
import { siteUrl } from "@/lib/site";
import { getStory, readingMinutes, stories, storyPath } from "@/lib/stories";
import { storyArt } from "@/lib/stories/art";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return {};
  return pageMetadata({
    title: story.title,
    description: story.dek,
    path: storyPath(story.slug),
    type: "article",
    publishedTime: story.published,
    modifiedTime: story.updated,
    image: { url: `${storyPath(story.slug)}/opengraph-image`, width: 1200, height: 630, alt: story.title },
  });
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function CaseFilePage({ params }: Props) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  const art = storyArt[story.slug];
  const path = storyPath(story.slug);
  const others = stories.filter((item) => item.slug !== story.slug).slice(0, 3);

  return (
    <article>
      <JsonLd
        data={articleJsonLd({
          headline: story.title,
          description: story.dek,
          path,
          datePublished: story.published,
          dateModified: story.updated,
          image: `${siteUrl()}${path}/opengraph-image`,
        })}
      />
      <header className="article-head">
        <div className="wrap">
          <hr className="rule-double" />
          <div className="page-kicker">
            <Link className="mono-s link" href="/case-files">
              Case files
            </Link>
            <span className="mono-s">
              · {story.yearLabel} · {readingMinutes(story)} min read
            </span>
          </div>
          <div className="article-grid">
            <div>
              <h1 className="claim article-title">{story.title}</h1>
              <p className="article-dek">{story.dek}</p>
              <div className="meta mono-s">
                <span>Verdict: {story.verdict.toUpperCase()}</span>
                <span>Updated {formatDate(story.updated)}</span>
              </div>
            </div>
            <figure className="article-art">
              {art ? (
                <div className="note" style={{ background: `var(--${art.ground === "bone" ? "bone-hi" : art.ground})` }}>
                  {art.layers.map((layer, i) => (
                    <Image
                      key={layer.src}
                      src={layer.src}
                      alt={i === 0 ? art.alt : ""}
                      width={layer.width}
                      height={layer.height}
                      priority={i === 0}
                      sizes="(max-width: 1180px) 92vw, 44vw"
                    />
                  ))}
                </div>
              ) : (
                <div className="note" style={{ background: "var(--pink)", aspectRatio: "16/10" }} aria-hidden="true" />
              )}
              <div className={`impression v-${story.verdict}`} style={{ "--rot": "-6deg" } as React.CSSProperties} aria-hidden="true">
                {story.verdict}
                <small>Case file · {story.yearLabel}</small>
              </div>
              {art ? (
                <figcaption className="mono-s">
                  <a href={art.creditUrl} target="_blank" rel="noopener noreferrer">
                    {art.credit}
                  </a>
                </figcaption>
              ) : null}
            </figure>
          </div>
        </div>
      </header>

      <div className="wrap article-body">
        <aside className="doc-aside mono-s">
          <Slab v={story.verdict} />
          <span>{VERDICT_SAY[story.verdict]}</span>
          <span>Published {formatDate(story.published)}</span>
          <Link className="link" href="/play">
            Play today&apos;s docket
          </Link>
          <Link className="link" href="/rules">
            How we source
          </Link>
        </aside>
        <div>
          <div className="hookcard">
            <span className="mono-s">The hook, as it travels</span>
            <p>&ldquo;{story.hook}&rdquo;</p>
          </div>
          <div className="prose dropcap">
            {story.sections.map((section, index) => (
              <section key={section.heading ?? `opening-${index}`}>
                {section.heading ? <h2>{section.heading}</h2> : null}
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
          <p className="sources-note">
            <strong>On sources.</strong> {story.sourcesNote}{" "}
            <Link className="link" href={`/corrections?story=${story.slug}`}>
              Report an error
            </Link>
          </p>

          <div className="cta-band">
            <div>
              <h2 className="wood">Five more, every day.</h2>
              <p>Today&apos;s docket has five claims like this one. Happened, almost, or lore? Two minutes, no account.</p>
            </div>
            <Link className="btn on-dark" href="/play">
              Play today <Hand bg="var(--bone-hi)" />
            </Link>
          </div>

          <div style={{ marginTop: 48 }}>
            <p className="mono-s" style={{ marginBottom: 12 }}>
              The Sunday Docket · one near-miss a week, told properly
            </p>
            <NewsletterForm source="story" cta="Subscribe" />
          </div>

          <nav aria-label="More case files" style={{ marginTop: 56 }}>
            <p className="mono-s" style={{ marginBottom: 12 }}>
              More case files
            </p>
            <ol className="index-list">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link className="index-row" href={storyPath(item.slug)}>
                    <Slab v={item.verdict} />
                    <span>
                      <span className="t">{item.title}</span>
                      <p>{item.dek}</p>
                    </span>
                    <span className="mono-s">{item.yearLabel}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </article>
  );
}
