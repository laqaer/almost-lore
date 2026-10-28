import Image from "next/image";
import Link from "next/link";
import { storyPath } from "@/lib/stories";
import type { StoryMedia } from "@/lib/stories/media";

export type StoryPreview = {
  slug: string;
  title: string;
  dek: string;
  yearLabel: string;
  collection: string;
  minutes: number;
  media: StoryMedia;
};

export function StoryCard({ story }: { story: StoryPreview }) {
  return (
    <article className="archive-card">
      <Link className="archive-card-image" href={storyPath(story.slug)} tabIndex={-1} aria-hidden="true">
        <Image src={story.media.src} alt="" width={story.media.width} height={story.media.height} sizes="(min-width: 1000px) 30vw, (min-width: 640px) 45vw, 100vw" unoptimized />
        <span className="image-label">{story.yearLabel}</span>
      </Link>
      <p className="card-image-credit"><a href={story.media.creditUrl} rel="noopener">{story.media.credit}</a></p>
      <p className="kicker">{story.collection}</p>
      <h3><Link href={storyPath(story.slug)}>{story.title}</Link></h3>
      <p className="card-dek">{story.dek}</p>
      <p className="card-tail"><span>{story.minutes} min read</span><span aria-hidden="true">↗</span></p>
    </article>
  );
}
