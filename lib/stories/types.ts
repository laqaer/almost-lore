export type StorySection = {
  heading?: string;
  paragraphs: string[];
};

export type StoryDossier = {
  href: string;
  label: string;
  note: string;
};

export type FurtherReading = {
  title: string;
  author: string;
  href: string;
  note: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type StoryFaq =
  | readonly [FaqItem, FaqItem, FaqItem]
  | readonly [FaqItem, FaqItem, FaqItem, FaqItem]
  | readonly [FaqItem, FaqItem, FaqItem, FaqItem, FaqItem];

export type EraId = "before-1800" | "1800s" | "1900-onward";

export type Story = {
  slug: string;
  title: string;
  dek: string;
  hook: string;
  era: EraId;
  yearLabel: string;
  published: string;
  updated: string;
  sourcesNote: string;
  sections: StorySection[];
  dossier?: StoryDossier;
  furtherReading?: FurtherReading[];
  faq?: StoryFaq;
};
