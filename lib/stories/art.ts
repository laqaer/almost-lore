/** Riso art for Case Files: two drum layers (key + second colour) stacked with multiply. */
export type StoryArt = {
  layers: { src: string; width: number; height: number }[];
  alt: string;
  ground: "bone" | "sun" | "pink" | "blue";
  credit: string;
  creditUrl: string;
};

export const storyArt: Record<string, StoryArt> = {
  "poyais-invented-country": {
    layers: [
      { src: "/images/riso/poyais-blue.webp", width: 1200, height: 585 },
      { src: "/images/riso/poyais-pink.webp", width: 1200, height: 585 },
    ],
    alt: "A one-dollar banknote of the Bank of Poyais, printed in the 1820s for a country that did not exist",
    ground: "bone",
    credit: "Bank of Poyais note, 1820s. National Museum of American History, via Wikimedia Commons (public domain).",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Bank_of_Poyais-1_Hard_Dollar_(1820s)_SCAM.jpg",
  },
  "forgotten-scheme": {
    layers: [
      { src: "/images/riso/beach-blue.webp", width: 700, height: 689 },
      { src: "/images/riso/beach-sun.webp", width: 700, height: 689 },
    ],
    alt: "1870 engraving of the Beach Pneumatic Transit car waiting in its tunnel under Broadway",
    ground: "sun",
    credit: "Beach Pneumatic Transit, 1870 engraving. Via Wikimedia Commons (public domain).",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Beach_Pneumatic_Transit_01.jpg",
  },
  "great-molasses-flood": {
    layers: [{ src: "/images/riso/molasses-ink.webp", width: 820, height: 541 }],
    alt: "Wreckage in Boston's North End after the 1919 molasses flood",
    ground: "sun",
    credit: "Boston Molasses Disaster, 1919. Boston Public Library, via Wikimedia Commons (public domain).",
    creditUrl: "https://commons.wikimedia.org/wiki/File:BostonMolassesDisaster.jpg",
  },
  "dancing-plague-1518": {
    layers: [{ src: "/images/riso/dancing-ink.webp", width: 820, height: 724 }],
    alt: "Engraving after Bruegel of pilgrims dancing on the road to Molenbeek",
    ground: "pink",
    credit: "After Pieter Bruegel the Elder, engraved by Hendrick Hondius, 1642. Via Wikimedia Commons (public domain).",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Die_Wallfahrt_der_Fallsuechtigen_nach_Meulebeeck.jpg",
  },
};
