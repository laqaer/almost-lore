# Read a story

Reading a story means leaving the hub through a named control and landing on an essay whose heading, a section, and the sources note are the essay itself.

## Sub-features

- `read-lead` follows `Read the story` to the lead essay.
- `read-plate` follows the lead image's accessible name to the same essay.
- `read-card` follows a department card title onto that essay.
- `read-sources` shows the sources note on the essay. The Poyais essay also links to its working file.
- `read-more` follows one title in `More stories` to a different essay.

## How to get to it (user POV)

- On `/`, choose `Read the story`.
- On `/`, choose the lead image named `Read: The country that existed on paper`.
- On `/`, choose a card title, for example `Aqua Tofana, after the legend`.
- On an essay, choose a title in the `More stories` nav.
- The header wordmark is a way back to the hub, not a way into a new essay.

## Driving it with almost-lore

Preconditions:

- Almost Lore is healthy at `http://127.0.0.1:4321`.
- `almost-lore doctor` prints `doctor: pass`.
- The lead story is still `poyais-invented-country`. If the hub `h1` is different, stop and update this file. Do not point the lead commands at whatever card happens to be first.

- **Lead CTA.** On the hub, choose `Read the story`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Read the story" --expect "The country that existed on paper" --expect "A soldier who needed a country" --expect "On sources." --expect "As an Amazon Associate, Almost Lore earns from qualifying purchases."`. The `href` is `/stories/poyais-invented-country`, status is 200, the `h1` equals the lead title, and `jsonLd` includes `Article` and `WebSite`.
- **Lead image.** On the hub, choose `Read: The country that existed on paper`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Read: The country that existed on paper" --expect "A soldier who needed a country"`. The destination path and `h1` match the lead CTA.
- **Department card.** On the hub, choose `Aqua Tofana, after the legend`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Aqua Tofana, after the legend" --expect "Aqua Tofana, after the legend" --expect "On sources."`. The `href` is `/stories/aqua-tofana-myth-vs-record` and the `h1` is that title.
- **Sources and working file.** On the Poyais essay, the sources note is visible and the working-file link is named `The Poyais working file`. The lead CTA command above already expects `On sources.` Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from /stories/poyais-invented-country --name "The Poyais working file" --expect "The Poyais working file"`. The destination path is `/dossier`.
- **More stories.** On the Poyais essay, choose `Aqua Tofana, after the legend` in More stories. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from /stories/poyais-invented-country --name "Aqua Tofana, after the legend" --expect "On sources."`. The `h1` is `Aqua Tofana, after the legend`.
- **Proof.** Save the action and the arrived essay. Run the lead `follow` with stdout kept as `.cursor/skills/verify-almost-lore/evidence/read-story/lead-action.txt`, then `.cursor/skills/verify-almost-lore/helpers/almost-lore snapshot /stories/poyais-invented-country --dir .cursor/skills/verify-almost-lore/evidence/read-story/story --screenshot --feature read-story`. Also snapshot `/` into `evidence/read-story/home` so the page you left is on disk. Write `PROOF.txt` naming `read-story`, the entry `Read the story`, and the follow command. `page.meta.json` `url` starts with `http://127.0.0.1:4321/`.

## Gotchas

- `Read the story` is the unique CTA name. The `h1` text `The country that existed on paper` is a second link to the same essay. Proving only the `h1` link does not prove the CTA, and proving only the CTA does not prove the image. Run each entry in this file.
- The image name is `Read: The country that existed on paper`, including the colon. The `h1` link does not use that prefix.
- The Poyais page links to an Amazon product URL and a Wikimedia credit URL. Leave them unrequested. `follow` on those names must print `refusing off-site` and exit non-zero. That refusal is required. Do not add a retry that fetches them.
- `More stories` repeats titles that also exist as hub cards. Pass the correct `--from` page. A follow from `/` proves the card, not the essay footer.
- Article JSON-LD is emitted on story pages. The hub has `WebSite` and does not have `Article`. Finding `Article` only on the hub is a failure.
