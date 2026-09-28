import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryArticle } from "@/components/story-article";
import { ogImage, openGraphImage, twitterWithImage } from "@/lib/metadata";
import { getStory, stories, storyPath } from "@/lib/stories";
import { storyMedia } from "@/lib/stories/media";
import { siteUrl } from "@/lib/site";

type StoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

function storySocialImage(slug: string) {
  const media = storyMedia[slug];
  if (!media) return ogImage;
  return {
    url: new URL(media.src, siteUrl()).toString(),
    width: media.width,
    height: media.height,
    alt: media.alt,
  };
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return {};

  const path = storyPath(story.slug);
  const image = storySocialImage(story.slug);
  return {
    title: story.title,
    description: story.dek,
    alternates: { canonical: path },
    openGraph: {
      ...openGraphImage,
      title: story.title,
      description: story.dek,
      url: path,
      type: "article",
      publishedTime: story.published,
      modifiedTime: story.updated,
      images: [image],
    },
    twitter: {
      ...twitterWithImage,
      title: story.title,
      description: story.dek,
      images: [image.url],
    },
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  return <StoryArticle story={story} />;
}
