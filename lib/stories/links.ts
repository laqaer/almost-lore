/**
 * Verified external further reading, keyed by story slug.
 *
 * Every href here was fetched and returned HTTP 200 before it was added. A slug
 * with no entry renders no "Further reading" block, so the list stays small and
 * grows only with links someone actually checked. No affiliate or tracking ids.
 */
export type StoryLink = {
  label: string;
  href: string;
  note: string;
};

export const storyLinks: Record<string, StoryLink[]> = {
  "aroostook-war": [
    {
      label: "Treaty of Paris, 1783",
      href: "https://www.archives.gov/milestone-documents/treaty-of-paris",
      note: "The National Archives milestone text; its highlands clause is where the boundary muddle starts.",
    },
  ],
  "balloon-almost-atlantic": [
    {
      label: "National Balloon Museum",
      href: "https://www.nationalballoonmuseum.com/",
      note: "Museum collection on the history of gas and hot-air ballooning.",
    },
  ],
  "caroline-affair": [
    {
      label: "Webster-Ashburton Treaty, 1842",
      href: "https://avalon.law.yale.edu/19th_century/br-1842.asp",
      note: "Full treaty text from the Yale Avalon Project, the diplomacy the 1842 notes come from.",
    },
  ],
  "darien-scheme": [
    {
      label: "National Library of Scotland",
      href: "https://www.nls.uk/",
      note: "A natural next stop for the Company of Scotland's surviving printed record.",
    },
  ],
  "forgotten-scheme": [
    {
      label: "Beach Pneumatic Transit",
      href: "https://www.nycsubway.org/wiki/Beach_Pneumatic_Transit",
      note: "Images and construction notes for the 1870 Broadway pneumatic subway.",
    },
  ],
  "pig-war-san-juan": [
    {
      label: "The Pig War",
      href: "https://www.nps.gov/sajh/learn/historyculture/the-pig-war.htm",
      note: "San Juan Island National Historical Park's own account of the 1859 standoff.",
    },
  ],
  "poyais-invented-country": [
    {
      label: "What's in a Fraud? The Many Worlds of Gregor MacGregor, 1817-1824",
      href: "https://ora.ox.ac.uk/objects/uuid%3A0d6ddc58-27ca-4b6e-a9a3-12b287b677ac/files/s7h149q410",
      note: "Damian Clavel's study of the Poyais loan (Enterprise & Society), the scholarly reconstruction the working file draws on.",
    },
  ],
  "trent-affair": [
    {
      label: "The Trent Affair, 1861",
      href: "https://history.state.gov/milestones/1861-1865/trent-affair",
      note: "U.S. State Department Office of the Historian milestone summary.",
    },
    {
      label: "The Gazette",
      href: "https://www.thegazette.co.uk/all-notices",
      note: "The London Gazette printed the Russell dispatches quoted in the essay.",
    },
  ],
  "venezuelan-crisis-1895": [
    {
      label: "Venezuela Boundary Dispute, 1895-1899",
      href: "https://history.state.gov/milestones/1866-1898/venezuela",
      note: "U.S. State Department Office of the Historian milestone summary.",
    },
    {
      label: "Foreign Relations of the United States, 1895",
      href: "https://history.state.gov/historicaldocuments/frus1895p1",
      note: "The printed diplomatic correspondence the essay's dates come from.",
    },
  ],
};
