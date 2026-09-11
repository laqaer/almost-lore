export type StorySection = {
  heading?: string;
  paragraphs: string[];
};

export type Story = {
  slug: string;
  title: string;
  dek: string;
  hook: string;
  yearLabel: string;
  published: string;
  updated: string;
  sourcesNote: string;
  sections: StorySection[];
};
