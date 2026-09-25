import type { Verdict } from "@/lib/game/types";

export type StorySection = {
  heading?: string;
  paragraphs: string[];
};

export type StoryImage = {
  /** Path under /public. */
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: string;
  /** Commons (or museum) page proving public-domain status. */
  creditUrl: string;
};

export type Story = {
  slug: string;
  title: string;
  dek: string;
  hook: string;
  /** The stamp this case file earns: the essay argues its own verdict. */
  verdict: Verdict;
  yearLabel: string;
  published: string;
  updated: string;
  sourcesNote: string;
  image?: StoryImage;
  sections: StorySection[];
};
