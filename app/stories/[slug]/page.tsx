import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryArticle } from "@/components/story-article";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";
import { getStory, stories, storyPath } from "@/lib/stories";

type StoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return {};

  const path = storyPath(story.slug);
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
    },
    twitter: {
      ...twitterWithImage,
      title: story.title,
      description: story.dek,
    },
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  return <StoryArticle story={story} />;
}
