export type StoryMedia = {
  src: string;
  alt: string;
  credit: string;
  creditUrl: string;
  width: number;
  height: number;
};

/**
 * Slug-keyed archive imagery for the story pages. Every file is a genuine
 * Wikimedia Commons item (photograph, map, document, or period illustration)
 * tied to the story's subject; files live in `public/images/stories/` and are
 * listed with full provenance in `public/images/CREDITS.md`. Public domain
 * except the Double Eagle II photograph (CC BY-SA 4.0). Dimensions match the
 * local files, which keep the original aspect ratio.
 */
export const storyMedia: Record<string, StoryMedia> = {
  "poyais-invented-country": {
    src: "/images/stories/poyais-invented-country.jpg",
    alt: "A Bank of Poyais one-dollar note from the 1820s, the currency of a country that existed only on paper.",
    credit: "National Museum of American History. Public domain.",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Bank_of_Poyais-1_Hard_Dollar_(1820s)_SCAM.jpg",
    width: 1600,
    height: 806,
  },
  "aqua-tofana-myth-vs-record": {
    src: "/images/stories/aqua-tofana-myth-vs-record.jpg",
    alt: "Giuseppe Vasi's 1752 view of the Campo de' Fiori in Rome.",
    credit: "Campo de' Fiori, Rome; engraving by Giuseppe Vasi, 1752. Public domain.",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Campo_De%27_Fiori_by_Giovanni_Vasi.jpg",
    width: 1300,
    height: 923,
  },
  "balloon-almost-atlantic": {
    src: "/images/stories/balloon-almost-atlantic.jpg",
    alt: "The gondola of the Double Eagle II, the balloon that completed the first Atlantic crossing in August 1978, on museum display. It is not the Zanussi flown by Cameron and Davey.",
    credit: "Double Eagle II gondola (the later successful crossing); photograph by Mike Peel, CC BY-SA 4.0.",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Double_Eagle_II.jpg",
    width: 1600,
    height: 1600,
  },
  "forgotten-scheme": {
    src: "/images/stories/forgotten-scheme.jpg",
    alt: "An 1870 Scientific American engraving of Alfred Ely Beach's pneumatic transit station beneath Broadway.",
    credit: "Scientific American, 5 March 1870. Public domain.",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Beach_Pneumatic_Transit_System_station.jpg",
    width: 900,
    height: 601,
  },
  "fashoda-incident-1898": {
    src: "/images/stories/fashoda-incident-1898.jpg",
    alt: "The Marchand mission group photographed in Cairo in 1898, the year of the Fashoda standoff on the White Nile.",
    credit: "E. Lauro, Cairo, 1898. Public domain.",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Groupe_de_la_mission_Marchand_au_Caire_1898.jpg",
    width: 1600,
    height: 1150,
  },
  "pig-war-san-juan": {
    src: "/images/stories/pig-war-san-juan.jpg",
    alt: "A photograph of British troops drawn up on San Juan Island before their 1872 evacuation.",
    credit: "Photograph, 1872. Public domain.",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:British_troops_evacuate_San_Juan_Island,_Washington_Terr,_1872_-_Restored.jpg",
    width: 1478,
    height: 1182,
  },
  "caroline-affair": {
    src: "/images/stories/caroline-affair.jpg",
    alt: "A colour print of the American steamer Caroline going over Niagara Falls in flames; a later romantic depiction of the December 1837 raid at Schlosser, not a documentary view.",
    credit: "Later colour depiction of the Caroline going over Niagara Falls, Detroit Publishing Co., c. 1900-1920. Public domain.",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Destruction_of_the_American_steamboat_Caroline_in_December_1837.jpg",
    width: 1600,
    height: 1251,
  },
  "dogger-bank-1904": {
    src: "/images/stories/dogger-bank-1904.jpg",
    alt: "A 1904 postcard depicting the Russian fleet firing on Hull trawlers at the Dogger Bank.",
    credit: "Valentine Series postcard, 1904. Public domain.",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Dogger_Bank_Russian_Outrage_incident_1904_postcard.jpg",
    width: 877,
    height: 563,
  },
  "trent-affair": {
    src: "/images/stories/trent-affair.jpg",
    alt: "A later engraving of the USS San Jacinto stopping the British mail steamer Trent in November 1861; it shows two ships at sea, not the boarding itself.",
    credit: "Engraving of the USS San Jacinto stopping the Trent, from Edward Sylvester Ellis (1887). Public domain.",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Trent_and_San_Jacinto.jpg",
    width: 1067,
    height: 1600,
  },
  "venezuelan-crisis-1895": {
    src: "/images/stories/venezuelan-crisis-1895.jpg",
    alt: "An 1897 map of British Guiana showing the boundary lines at issue in the Venezuela and Guiana dispute of 1895-96.",
    credit: "G. Philip, London, 1897; Bibliotheque nationale de France. Public domain.",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Special_Map_of_british_Guiana,_illustrating_the_Venezuela-Guiana_boundary_dispute_1895-96_-_btv1b8441757p_(1_of_2).jpg",
    width: 1520,
    height: 1600,
  },
  "san-francisco-fog-1950": {
    src: "/images/stories/san-francisco-fog-1950.jpg",
    alt: "A U.S. Navy ship at the Hunters Point Naval Shipyard in San Francisco, May 1950; a contextual period photograph, not the vessel used in the September 1950 spray.",
    credit: "USS Greenlet at Hunters Point, San Francisco, May 1950; contextual period photograph, not the operation vessel. U.S. Navy. Public domain.",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:USS_Greenlet_(ASR-10)_at_the_Hunters_Point_Naval_Shipyard,_California_(USA),_on_20_May_1950_(7576742).jpg",
    width: 1600,
    height: 1263,
  },
  "bering-island-winter": {
    src: "/images/stories/bering-island-winter.jpg",
    alt: "A 1992 NASA satellite view of snow-covered Bering Island in the Commander Islands, where Vitus Bering's ship wrecked in November 1741 and where he died that December.",
    credit: "NASA satellite view of Bering Island, 1992. Public domain.",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Bering_island.jpg",
    width: 1600,
    height: 1600,
  },
  "darien-scheme": {
    src: "/images/stories/darien-scheme.jpg",
    alt: "A later illustration of the Darien expedition's departure from Leith in 1698.",
    credit: "Later illustration of the Darien expedition leaving Leith, 1698; by Paul Hardy in Cassell's History of England (1909). Public domain.",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Paul_Hardy_-_Scene_of_the_departure_from_Leith_of_the_Darien_expedition,_AD_1698.jpg",
    width: 873,
    height: 1195,
  },
  "aroostook-war": {
    src: "/images/stories/aroostook-war.jpg",
    alt: "An 1839 map of the disputed territory between Maine and New Brunswick, showing the boundary lines claimed by Maine and by Great Britain.",
    credit:
      "Map of the disputed territory, 1839 (engraved by William James Stone), Digital Commonwealth. Public domain.",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:1839_Map_of_the_disputed_territory_(Maine),_reduced_from_the_original_of_Messrs._Featherstonehaugh_%26_Mudge,_British_commissioners,_by_William_James_Stone,_from_the_Digital_Commonwealth_-_commonwealth_7h14b0247.jpg",
    width: 1600,
    height: 1532,
  },
};
