# Read a story

A reader can open the cover story or an archive title, inspect archival images and sources, copy the story link, and continue reading.

## Sub-features

- `read-cover` opens the Caroline affair from the cover.
- `read-card` opens an essay from the searchable collection.
- `read-images` displays the article’s images and attribution.
- `read-sources` exposes the sources note and relevant further reading.
- `read-share` copies the canonical story URL and confirms the result.
- `read-more` opens a different essay through `More stories`.

## How to get to it (user POV)

- Choose `Read the Caroline affair` on the cover.
- Find Poyais in `Search stories`, then choose its title.
- On an essay, choose `Copy link`.
- Choose a title in the `More stories` navigation.

## Driving it with almost-lore

Preconditions:

- Build the export with `npm run build` before browser checks.
- Helper commands require a healthy instance from this checkout on `http://127.0.0.1:4321`.
- Leave the canonical site URL unset. The default share address uses `https://almostlore.com`.

- **Cover, sharing, and continued reading.** Run `npm run test:e2e -- --grep "a reader opens the cover"`. The browser clicks the cover and reaches `/stories/caroline-affair`. It checks the heading, sources label, image delivery, and page width. `Copy link` places `https://almostlore.com/stories/caroline-affair` on the clipboard and announces `Link copied`. A `More stories` link opens a different essay with the selected title.
- **Archive entry and images.** Run `npm run test:e2e -- --grep "archival images"`. The browser loads every homepage image, searches for Poyais, and clicks its title. The essay’s main image and additional archival figure must decode successfully.
- **HTTP cover entry.** Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Read the Caroline affair" --expect "On sources."`. The destination is `/stories/caroline-affair`, with HTTP 200 and Article JSON-LD.
- **Working file.** Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from /stories/poyais-invented-country --name "The Poyais working file" --expect "The Poyais working file"`. The destination is `/dossier`. Stop before any payment action.
- **Proof.** The cover test saves article screenshots under `test-results/`. Failed runs retain traces and screenshots. Keep the test report with the command and revision under review.

## Gotchas

- The browser suite compares the selected related-story title with the destination heading. It does not depend on editorial ordering.
- The cover’s picture and CTA form one link. Archive picture links repeat their adjacent title links and are hidden from keyboard and accessibility navigation.
- Copying a canonical URL is not a request to the production site. The browser suite reads the clipboard without opening that address.
- Wikimedia and book links are sources, not local navigation. The HTTP helper must refuse their off-site origins.
- A source note preserves uncertainty. Do not remove caveats to simplify expected copy.
- Article JSON-LD belongs on story pages. The hub includes WebSite data and does not become an Article.
- The five essays that already have further reading show a Questions heading and a FAQPage script. `/stories/caroline-affair` has Article JSON-LD and no FAQPage script.
