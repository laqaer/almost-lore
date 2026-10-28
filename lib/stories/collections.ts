export const collections = ["Strange schemes", "Close calls", "Into the unknown"] as const;
export type Collection = (typeof collections)[number];

export const storyCollections: Record<string, Collection> = {
  "poyais-invented-country": "Strange schemes",
  "aqua-tofana-myth-vs-record": "Strange schemes",
  "forgotten-scheme": "Strange schemes",
  "darien-scheme": "Strange schemes",
  "pig-war-san-juan": "Close calls",
  "caroline-affair": "Close calls",
  "fashoda-incident-1898": "Close calls",
  "dogger-bank-1904": "Close calls",
  "trent-affair": "Close calls",
  "venezuelan-crisis-1895": "Close calls",
  "aroostook-war": "Close calls",
  "balloon-almost-atlantic": "Into the unknown",
  "bering-island-winter": "Into the unknown",
  "san-francisco-fog-1950": "Into the unknown",
};
