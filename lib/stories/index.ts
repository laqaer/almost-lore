import { aquaTofanaStory } from "@/lib/stories/aqua-tofana";
import { balloonStory } from "@/lib/stories/balloon";
import { carolineAffairStory } from "@/lib/stories/caroline-affair";
import { doggerBankStory } from "@/lib/stories/dogger-bank";
import { fashodaStory } from "@/lib/stories/fashoda";
import { forgottenSchemeStory } from "@/lib/stories/forgotten-scheme";
import { pigWarStory } from "@/lib/stories/pig-war";
import { poyaisStory } from "@/lib/stories/poyais";
import { trentAffairStory } from "@/lib/stories/trent-affair";
import { venezuelanCrisisStory } from "@/lib/stories/venezuelan-crisis";
import type { Story } from "@/lib/stories/types";

export type { Story };

export const stories: Story[] = [
  poyaisStory,
  aquaTofanaStory,
  balloonStory,
  forgottenSchemeStory,
  fashodaStory,
  pigWarStory,
  carolineAffairStory,
  doggerBankStory,
  trentAffairStory,
  venezuelanCrisisStory,
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
