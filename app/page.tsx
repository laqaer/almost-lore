import Image from "next/image";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
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
    <figcaption className="mt-2 text-xs text-ink-faint">
      {media.creditUrl ? (
        <a className="underline underline-offset-2 hover:text-rust" href={media.creditUrl} rel="noopener">
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
        {storyMedia[lead.slug] ? (
          <figure className="lg:col-span-7">
            <Link aria-label={`Read: ${lead.title}`} className="block" href={storyPath(lead.slug)}>
              <Image
                alt={storyMedia[lead.slug].alt}
                className="h-auto w-full bg-paper-deep"
                height={storyMedia[lead.slug].height}
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                src={storyMedia[lead.slug].src}
                unoptimized
                width={storyMedia[lead.slug].width}
              />
            </Link>
            <Credit slug={lead.slug} />
          </figure>
        ) : null}
        <div className="lg:col-span-5">
          <p className="kicker">{lead.yearLabel} · Lead story</p>
          <h1 className="mt-3 font-display text-3xl leading-[1.1] text-ink sm:text-4xl lg:text-5xl">
            <Link className="hover:text-rust" href={storyPath(lead.slug)}>
              {lead.title}
            </Link>
          </h1>
          <p className="mt-4 text-lg leading-8 text-ink-soft">{lead.dek}</p>
          <p className="mt-4 text-sm text-ink-faint">{readingMinutes(lead)} min read</p>
          <Link
            className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-teal hover:text-rust"
            href={storyPath(lead.slug)}
          >
            Read the story <span aria-hidden>→</span>
          </Link>
        </div>
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
            <section
              key={era.id}
              aria-labelledby={`era-${era.id}`}
              className="mt-14 border-t border-rule pt-8"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h2 className="font-display text-2xl text-ink" id={`era-${era.id}`}>
                  {era.name}
                </h2>
                <p className="kicker">
                  {items.length} {items.length === 1 ? "story" : "stories"}
                </p>
              </div>
              <p className="mt-2 max-w-2xl text-sm text-ink-soft">{era.blurb}</p>
              <ul className="mt-7 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((story) => (
                  <li key={story.slug} className="flex flex-col">
                    {storyMedia[story.slug] ? (
                      <figure className="flex flex-col">
                        <Link
                          aria-label={`Read: ${story.title}`}
                          className="block"
                          href={storyPath(story.slug)}
                        >
                          <span className="relative block aspect-[4/3] bg-paper-deep">
                            <Image
                              alt={storyMedia[story.slug].alt}
                              className="object-contain"
                              fill
                              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                              src={storyMedia[story.slug].src}
                              unoptimized
                            />
                          </span>
                        </Link>
                        <Credit slug={story.slug} />
                      </figure>
                    ) : null}
                    <p className="kicker mt-4">{story.yearLabel}</p>
                    <h3 className="mt-2 font-display text-xl leading-tight text-ink">
                      <Link className="hover:text-rust" href={storyPath(story.slug)}>
                        {story.title}
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-soft">{story.dek}</p>
                    <p className="mt-2 text-xs text-ink-faint">{readingMinutes(story)} min read</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="mt-14 border-t border-rule pt-6 text-sm text-ink-soft">
        {site.name} is an editorial archive of {stories.length} longform essays. Start anywhere; every
        piece stands on its own.
      </p>
    </div>
  );
}
