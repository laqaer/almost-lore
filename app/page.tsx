import Image from "next/image";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { StoryArchive } from "@/components/story-archive";
import { getStory, readingMinutes, stories, storyPath } from "@/lib/stories";
import { storyCollections } from "@/lib/stories/collections";
import { storyMedia } from "@/lib/stories/media";

export default function HomePage() {
  const lead = getStory("caroline-affair")!;
  const leadMedia = storyMedia[lead.slug];
  const picks = ["poyais-invented-country", "pig-war-san-juan", "forgotten-scheme"].map((slug) => getStory(slug)!);
  const previews = stories.map((story) => ({
    slug: story.slug, title: story.title, dek: story.dek, yearLabel: story.yearLabel,
    collection: storyCollections[story.slug], minutes: readingMinutes(story), media: storyMedia[story.slug],
  }));

  return (
    <div className="shell">
      <section className="opening-line">
        <div><p className="kicker">History took a strange turn.</p><h1>Come down the <em>rabbit hole.</em></h1></div>
        <p>Remarkable true stories, hidden in the public record.<br /> A little disbelief is a good place to begin.</p>
      </section>
      <section className="front-page" aria-label="Featured stories">
        <div className="cover-story">
          <Link href={storyPath(lead.slug)} className="cover-link" aria-label="Read the Caroline affair">
            <Image src={leadMedia.src} alt={leadMedia.alt} width={leadMedia.width} height={leadMedia.height} preload sizes="(min-width: 1000px) 65vw, 100vw" unoptimized />
            <div className="cover-shade" />
            <div className="cover-top"><span>The cover story</span><span>01 / Close calls</span></div>
            <div className="cover-copy">
              <p className="kicker">1837 · The Niagara frontier</p>
              <h2>A burning ship.<br />Two nations on the brink.</h2>
              <p>{lead.dek}</p>
              <span className="cover-cta">Read the Caroline affair <span aria-hidden="true">↗</span><span>{readingMinutes(lead)} min read</span></span>
            </div>
          </Link>
          <p className="cover-image-credit"><a href={leadMedia.creditUrl} rel="noopener">{leadMedia.credit}</a></p>
        </div>
        <aside id="editors-picks" className="editors-picks">
          <div className="picks-heading"><p className="kicker">Worth getting lost in</p><h2>The editor’s shortlist<span>.</span></h2></div>
          {picks.map((story, index) => (
            <article className="shortlist-story" key={story.slug}>
              <Link href={storyPath(story.slug)} className="shortlist-image" tabIndex={-1} aria-hidden="true">
                <Image src={storyMedia[story.slug].src} alt="" width={storyMedia[story.slug].width} height={storyMedia[story.slug].height} unoptimized sizes="130px" />
              </Link>
              <div>
                <p className="kicker">0{index + 1} / {storyCollections[story.slug]}</p>
                <h3><Link href={storyPath(story.slug)}>{story.title}</Link></h3>
                <span className="read-time">{readingMinutes(story)} min read <span aria-hidden="true">↗</span></span>
              </div>
            </article>
          ))}
          <Link className="text-link shortlist-all" href="#stories">Explore all {stories.length} stories <span aria-hidden="true">↗</span></Link>
        </aside>
      </section>
      <div className="editorial-strip">
        <span aria-hidden="true">✳</span><p>Stranger than fiction.<br className="mobile-break" /> <em>Grounded in the record.</em></p>
        <Link href="/about">How we tell these stories <span aria-hidden="true">↗</span></Link>
      </div>
      <AdSlot />
      <StoryArchive stories={previews} />
      <section className="dossier-feature" aria-labelledby="dossier-title">
        <div className="dossier-art">
          <Image src={storyMedia["poyais-invented-country"].src} alt={storyMedia["poyais-invented-country"].alt} width={1600} height={806} unoptimized sizes="(min-width: 800px) 50vw, 100vw" />
          <span>From the archive / Bank of Poyais, c. 1820s</span>
        </div>
        <div className="dossier-copy">
          <p className="kicker">Go one layer deeper</p>
          <h2 id="dossier-title">A country on paper.<br />A trail worth following.</h2>
          <p>Meet Poyais: the country Gregor MacGregor sold to investors and settlers. Open the story, then follow the evidence into our annotated working file.</p>
          <div><Link className="button-dark" href="/stories/poyais-invented-country">Read the story <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/dossier">Explore the working file ↗</Link></div>
        </div>
      </section>
      <section className="journal-invite">
        <span className="journal-mark" aria-hidden="true">✳</span><p className="kicker">There is always another story</p>
        <h2>Keep a little room<br />for <em>curiosity.</em></h2>
        <p>Follow Almost Lore in your feed reader.<br />New stories, whenever the archive gives one up.</p>
        <a href="/feed.xml" className="button-dark">Follow the journal via RSS <span aria-hidden="true">↗</span></a>
      </section>
    </div>
  );
}
