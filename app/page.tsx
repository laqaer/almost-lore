import Image from "next/image";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { CoastChart } from "@/components/coast-chart";
import { site } from "@/lib/site";
import { getStory, readingMinutes, stories, storyPath } from "@/lib/stories";
import { storyMedia } from "@/lib/stories/media";

type Era = { id: string; name: string; blurb: string };

const eras: Era[] = [
  {
    id: "before-1800",
    name: "Before 1800",
    blurb: "Companies, colonies, and the long eighteenth century.",
  },
  {
    id: "1800s",
    name: "The Nineteenth Century",
    blurb: "Loans, borders, and empires at their confident peak.",
  },
  {
    id: "1900-onward",
    name: "1900 Onward",
    blurb: "The modern record, including the experiments nobody announced.",
  },
];

// Explicit departments instead of parsing `yearLabel`. The invariant below fails
// the build if a story is ever added without a home.
const departments: { era: Era; slugs: string[] }[] = [
  {
    era: eras[0],
    slugs: ["aqua-tofana-myth-vs-record", "darien-scheme", "bering-island-winter"],
  },
  {
    era: eras[1],
    slugs: [
      "poyais-invented-country",
      "forgotten-scheme",
      "caroline-affair",
      "aroostook-war",
      "pig-war-san-juan",
      "trent-affair",
      "venezuelan-crisis-1895",
      "fashoda-incident-1898",
    ],
  },
  {
    era: eras[2],
    slugs: ["dogger-bank-1904", "san-francisco-fog-1950", "balloon-almost-atlantic"],
  },
];

const placedSlugs = departments.flatMap((department) => department.slugs);
if (
  placedSlugs.length !== stories.length ||
  new Set(placedSlugs).size !== stories.length ||
  placedSlugs.some((slug) => !getStory(slug))
) {
  throw new Error("Homepage departments must list every story exactly once.");
}

function Credit({ slug }: { slug: string }) {
  const media = storyMedia[slug];
  if (!media) return null;
  return (
    <figcaption className="credit">
      {media.creditUrl ? (
        <a href={media.creditUrl} rel="noopener">
          {media.credit}
        </a>
      ) : (
        media.credit
      )}
    </figcaption>
  );
}

export default function HomePage() {
  const [lead, ...rest] = stories;
  const restSlugs = new Set(rest.map((story) => story.slug));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="grid items-start gap-8 py-10 lg:grid-cols-12 lg:gap-12">
        <div className="order-1 lg:order-2 lg:col-span-5">
          <CoastChart />
          <h1 className="lead-title">
            <Link href={storyPath(lead.slug)}>{lead.title}</Link>
          </h1>
          <p className="dek">{lead.dek}</p>
          <p className="colophon">
            <span>Lead story</span>
            <span>{lead.yearLabel}</span>
            <span>{readingMinutes(lead)} min read</span>
          </p>
          <Link className="read-link" href={storyPath(lead.slug)}>
            Read the story
            <svg className="read-arrow" viewBox="0 0 28 12" aria-hidden="true" focusable="false">
              <path d="M0 6 H26 M20 1.5 L26 6 L20 10.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </Link>
        </div>
        {storyMedia[lead.slug] ? (
          <figure className="order-2 lg:order-1 lg:col-span-7">
            <Link
              aria-label={`Read: ${lead.title}`}
              className="lead-plate plate block"
              href={storyPath(lead.slug)}
            >
              <span className="block overflow-hidden">
                <Image
                  alt={storyMedia[lead.slug].alt}
                  className="h-auto w-full bg-paper-deep"
                  height={storyMedia[lead.slug].height}
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  src={storyMedia[lead.slug].src}
                  style={{ viewTransitionName: `plate-${lead.slug}` }}
                  unoptimized
                  width={storyMedia[lead.slug].width}
                />
              </span>
            </Link>
            <Credit slug={lead.slug} />
          </figure>
        ) : null}
      </section>

      <AdSlot className="mt-12" />

      <div id="stories" className="scroll-mt-6">
        {departments.map(({ era, slugs }) => {
          const items = slugs.flatMap((slug) => {
            const story = restSlugs.has(slug) ? getStory(slug) : undefined;
            return story ? [story] : [];
          });

          if (items.length === 0) return null;

          return (
            <section key={era.id} aria-labelledby={`era-${era.id}`} className="era">
              <div className="era-head">
                <h2 id={`era-${era.id}`}>{era.name}</h2>
                <p className="era-count">
                  {items.length} {items.length === 1 ? "story" : "stories"}
                </p>
              </div>
              <p className="era-blurb">{era.blurb}</p>
              <ul className="mt-7 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((story) => (
                  <li key={story.slug} className="story-card flex flex-col">
                    {storyMedia[story.slug] ? (
                      <figure className="card-frame flex flex-col">
                        <Link
                          aria-label={`Read: ${story.title}`}
                          className="block"
                          href={storyPath(story.slug)}
                        >
                          <span className="card-media relative block aspect-[4/3] overflow-hidden bg-paper-deep">
                            <Image
                              alt={storyMedia[story.slug].alt}
                              className="object-contain"
                              fill
                              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                              src={storyMedia[story.slug].src}
                              style={{ viewTransitionName: `plate-${story.slug}` }}
                              unoptimized
                            />
                          </span>
                        </Link>
                        <Credit slug={story.slug} />
                      </figure>
                    ) : null}
                    <h3>
                      <Link href={storyPath(story.slug)}>{story.title}</Link>
                    </h3>
                    <p className="card-dek line-clamp-3">{story.dek}</p>
                    <p className="colophon">
                      <span>{story.yearLabel}</span>
                      <span>{readingMinutes(story)} min read</span>
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="archive-close">
        {site.name} is an editorial archive of {stories.length} longform essays. Start anywhere; every
        piece stands on its own.
      </p>
    </div>
  );
}
