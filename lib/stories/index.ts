import { aquaTofanaStory } from "@/lib/stories/aqua-tofana";
import { balloonStory } from "@/lib/stories/balloon";
import { forgottenSchemeStory } from "@/lib/stories/forgotten-scheme";
import { poyaisStory } from "@/lib/stories/poyais";
import type { Story } from "@/lib/stories/types";

export type { Story };

export const stories: Story[] = [
  poyaisStory,
  aquaTofanaStory,
  balloonStory,
  forgottenSchemeStory,
];

export function storyPath(slug: string): string {
  return `/stories/${slug}`;
}

export function getStory(slug: string): Story | undefined {
  return stories.find((story) => story.slug === slug);
}

export function wordCount(story: Story): number {
  return story.sections.reduce((total, section) => {
    const heading = section.heading ?? "";
    const body = section.paragraphs.join(" ");
    return total + `${heading} ${body}`.trim().split(/\s+/).length;
  }, 0);
}

export function readingMinutes(story: Story): number {
  return Math.max(1, Math.round(wordCount(story) / 220));
}
