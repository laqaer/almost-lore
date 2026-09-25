import type { Story } from "@/lib/stories/types";

export const molassesStory: Story = {
  slug: "great-molasses-flood",
  title: "The wave on Commercial Street",
  dek: "On 15 January 1919 a steel tank in Boston's North End split open and a wall of molasses ran through the neighborhood. Twenty-one people died. The strangest part of the story is how ordinary its causes were.",
  hook: "In 1919 a wave of molasses swept through Boston and drowned people in the street — which sounds like a tall tale, and is in the coroner's records.",
  verdict: "happened",
  yearLabel: "1919",
  published: "2026-09-25",
  updated: "2026-09-25",
  sourcesNote:
    "This essay is original prose. It draws on the public record of the disaster as reconstructed from Boston newspaper coverage, the court-appointed auditor's findings in the damage suits against United States Industrial Alcohol, later histories of the North End, and the 2016 fluid-dynamics work on why the molasses was so deadly. Figures that vary between accounts — the height and speed of the wave, the tank's exact contents, the number injured — are given as ranges or round numbers and labeled as estimates. The long-told claim that the neighborhood still smells of molasses on hot days is reported as local lore, not fact.",
  sections: [
    {
      paragraphs: [
        "The version people repeat is short and absurd: a flood of molasses in Boston, a wave of syrup taller than a house, people drowned in something you put on pancakes. Most listeners assume it is a joke with a date attached. It is not. On Wednesday, 15 January 1919, a little after noon, a storage tank on Commercial Street in the North End failed, and roughly two million gallons of molasses went into the streets at once.",
        "Twenty-one people were killed and about 150 were hurt. Horses died in their harnesses. A firehouse was knocked partly off its foundation, and the steel supports of the elevated railway along Atlantic Avenue were bent. The story sounds fake because of the substance. Everything else about it — the corner-cutting, the warning signs, the lawyers — is depressingly familiar.",
      ],
    },
    {
      heading: "A tank built to be full",
      paragraphs: [
        "The tank belonged to the Purity Distilling Company, a subsidiary of United States Industrial Alcohol. It went up in 1915 near the harbor, where ships from the Caribbean could pump molasses straight into it. It stood about 50 feet tall and 90 feet across, and when it was full it held well over two million gallons. The molasses was not destined for kitchens. It was fermented into industrial alcohol, a raw material for munitions as well as for drink, and wartime demand had made the business very good.",
        "The man in charge of getting the tank built, the company's treasurer Arthur Jell, was not an engineer and, by later testimony, could not read a blueprint. The tank was never properly tested: the standard check would have been to fill it with water and watch for leaks, and it was given only a few inches. From the start it leaked. Streaks of brown ran down the rivet lines, and residents came with pails to collect what dripped. The company's answer, according to the evidence later heard in court, was to paint the tank brown.",
        "An employee who worried about the rumbling sounds from the steel was told, in effect, to stop worrying. None of this is reconstruction from hindsight alone. It came out under oath, in hearings that ran for years, and it is the reason the case is still taught to engineering students.",
      ],
    },
    {
      heading: "Just after noon",
      paragraphs: [
        "January 1919 had been bitterly cold, and then it was not. The temperature climbed from well below freezing to above 40°F in a day or two, and a fresh shipment of warmer molasses had been pumped into the tank shortly before. Whether the warming, the new load or simple fatigue in steel that was too thin tipped it over is still argued. What is not argued is what witnesses heard: a deep rumble, a sound some compared to machine-gun fire as the rivets sheared, and then the tank came apart.",
        "Estimates of the wave vary, as they would for an event nobody was measuring. The figures most often cited put it at up to 25 feet high at the start and moving at around 35 miles per hour. Those are estimates, and they are enough. The molasses weighed something like 13,000 tons. It flattened wooden buildings, swept a truck into the harbor, and filled the streets several blocks around waist-deep and more.",
        "Cadets from a nautical training ship moored nearby were among the first to wade in, followed by police, firefighters, sailors and neighbors. They were working in a substance that grabbed at everything. Rescuers could not always reach people they could see. Some of the dead were not found for days.",
      ],
    },
    {
      heading: "Why syrup kills",
      paragraphs: [
        "The obvious question is how something so slow on a spoon could move so fast and kill so many. The answer is that molasses changes character with temperature. Released from a tank, the warmer mass flowed quickly. As it spread across the cold streets and met the January air, it cooled and thickened, and people caught in it found themselves held as if in wet cement.",
        "In 2016 a group of scientists and students at Harvard, working with the fluid dynamicist Nicole Sharp, modeled the flood and presented their results. Their conclusion matched the grim testimony of 1919: the rapid cooling that followed the initial surge would have made the molasses far harder to struggle out of, and far harder to dig people from. The same property that made the wave outrun people made it impossible to escape once it stopped.",
      ],
    },
    {
      heading: "The anarchist defense",
      paragraphs: [
        "United States Industrial Alcohol did not accept that its tank had simply failed. The company argued that anarchists had blown it up. The claim was not as outlandish in 1919 as it sounds now: bombings by Italian anarchists were real, the North End was an Italian neighborhood, and the police were primed to see a plot. It was also convenient, because a bombing would not be the company's fault.",
        "More than a hundred claims were combined into one of the first class-action suits in Massachusetts, and a court-appointed auditor, Colonel Hugh Ogden, heard the evidence. The hearings ran for about three years and filled thousands of pages. Engineers testified on both sides. Ogden's report, delivered in 1925, rejected the bomb theory and found the company responsible: the tank had been built of steel too thin for the load, without an adequate safety margin, and the company had ignored the signs. United States Industrial Alcohol paid about $628,000 to settle the claims.",
      ],
    },
    {
      heading: "What changed",
      paragraphs: [
        "The lasting effect was paperwork, which is how most disasters change the world. In the years after the flood, Boston and then Massachusetts tightened the rules so that plans and calculations for structures like the tank had to be filed and signed off by a registered architect or engineer. Similar requirements spread elsewhere. It is hard to point at a tank that did not burst because of a signature, but that is the point of a signature.",
        "The flood also landed on a strange date. On 16 January 1919, the day after it, Nebraska ratified the Eighteenth Amendment and national Prohibition became law, to take effect a year later. Some retellings make the tank a rush job to distill rum before the ban. The company's business was industrial alcohol, and the tank was four years old. The coincidence is real; the conspiracy is not needed.",
      ],
    },
    {
      heading: "Why the hook is not the essay",
      paragraphs: [
        "The hook invites a laugh, and people who hear it usually do laugh, once. The record is a list of names. The dead included laborers, teamsters and children, and most of them were working-class residents of a crowded immigrant neighborhood that a large company had used as a place to park a hazard.",
        "Local lore says that on hot summer days the North End still smells faintly of molasses. People have said so for a century, and nobody has measured it. The part worth keeping is plainer. The flood happened exactly as absurdly as the hook says, and for exactly the reasons nobody finds funny: a structure nobody tested, a warning nobody heeded, and a defense built to shift the blame.",
      ],
    },
  ],
};
