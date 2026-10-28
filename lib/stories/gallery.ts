import type { StoryMedia } from "@/lib/stories/media";

export const storyGallery: Record<string, StoryMedia[]> = {
  "poyais-invented-country": [
    {
      src: "/images/stories/poyais-promised-port.jpg",
      alt: "An 1822 promotional engraving of the claimed Black River port in Poyais, with sailing boats, buildings, and mountains.",
      credit:
        "Promotional engraving from Sketch of the Mosquito Shore, 1822. John Carter Brown Library. Public domain. This is the advertised port, not a verified view.",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:View_of_the_port_of_Black_River_in_the_Territory_of_Poyais.jpg",
      width: 1280,
      height: 829,
    },
  ],
  "forgotten-scheme": [
    {
      src: "/images/stories/beach-pneumatic-plan.jpg",
      alt: "Scientific American's 1870 plan of Beach's pneumatic railway, showing the passenger car, curved tunnel, waiting room, and blower beneath Broadway.",
      credit:
        "Scientific American, 5 March 1870; scan by Joseph Brennan. Public domain. The plan shows the demonstration railway and its air machinery.",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Beach_Pneumatic_plan.jpg",
      width: 1600,
      height: 1458,
    },
  ],
  "pig-war-san-juan": [
    {
      src: "/images/stories/san-juan-reservations-1860.jpg",
      alt: "A December 1860 map of southeastern San Juan Island showing government reservations, Camp Pickett, roads, and the shoreline.",
      credit:
        "War Department, December 1860. National Archives, NAID 100305680. Public domain. This map records government reservations during the joint occupation.",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Map_of_South_East_End_of_San_Juan_Island,_Washington_Territory,_Showing_Government_Reservations_-_NARA_-_100305680.jpg",
      width: 1600,
      height: 1143,
    },
  ],
};
