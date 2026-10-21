# Story hub

The hub is the front page: the Almost Lore wordmark, the lead story, three era sections, and a count of the essays on the site.

## Sub-features

- `hub-identity` shows the wordmark, the tagline, and the lead story as the only `h1`.
- `hub-eras` lists every essay except the lead, grouped under Before 1800, The Nineteenth Century, and 1900 Onward.
- `hub-nav` exposes Primary and Footer links to stories and section pages.
- `hub-missing` shows the folio 404 for an unknown path, with a way back to the hub.

## How to get to it (user POV)

- Open `/`.
- Choose the header wordmark `Almost Lore` from any page.
- Choose `Back to Almost Lore` on an unknown path.
- Choose `Stories` in the header or footer to land on `/#stories`.

## Driving it with almost-lore

Preconditions:

- Almost Lore is healthy at `http://127.0.0.1:4321`.
- `almost-lore doctor` prints `doctor: pass` and `h1: The country that existed on paper`.
- `NEXT_PUBLIC_SITE_URL` is unset, so canonical URLs in the HTML use `https://almostlore.com`.

- **Open the hub.** Request `/`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore get / --expect "Almost Lore" --expect "Public-record near-misses, written as stories." --expect "Lead story" --expect "14 longform essays"`. Status is 200, the title contains `Almost Lore`, and the `h1` is `The country that existed on paper`.
- **Era sections.** Stay on `/`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore get / --expect "Before 1800" --expect "The Nineteenth Century" --expect "1900 Onward" --expect "Aqua Tofana, after the legend" --expect "The subway that ran one block" --expect "Searchlights on the Dogger Bank"`. The three era names are present, and a card title from each era is present. The lead title is the `h1`, not a second card.
- **Stories anchor.** Choose `Stories`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Stories"`. The `href` is `/#stories`, status is 200, and the command prints `fragment-id: present`.
- **Wordmark returns home.** From a story, choose `Almost Lore`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from /stories/poyais-invented-country --name "Almost Lore" --expect "Lead story"`. The destination `h1` is `The country that existed on paper` and the URL path is `/`.
- **Missing page.** Open an unknown path. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore get /not-a-story --status 404 --expect "That page is not in the folio" --expect "Back to Almost Lore"`. Status is 404 and the `h1` is `That page is not in the folio`.
- **Back to the hub.** On that 404, choose `Back to Almost Lore`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from /not-a-story --from-status 404 --name "Back to Almost Lore" --expect "Lead story"`. The source status is 404, the destination status is 200, and the hub `h1` is `The country that existed on paper`.
- **Proof.** Capture the hub. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore snapshot / --dir .cursor/skills/verify-almost-lore/evidence/story-hub --screenshot --feature story-hub`. `page.txt` contains the lead `h1`, `nav Primary`, and the three era `h2` lines. Write `PROOF.txt` naming `story-hub` and this command.

## Gotchas

- The home `h1` is the lead essay title, currently `The country that existed on paper`. If `stories[0]` changes, this file and Doctor fail on purpose. Update them to the new lead. Do not drop the `h1` assertion.
- The lead slug is omitted from the era cards. Expect 13 card titles plus the lead, 14 essays in the closing line `14 longform essays`.
- `Stories` is a same-page fragment. A pass requires `fragment-id: present` for `stories`, not only HTTP 200.
- The unknown path is HTTP 404. Pass `--from-status 404` when following `Back to Almost Lore` from it. `--status` on `follow` is the destination, which is 200.
- The Next.js dev indicator can appear in `page.png`. Identity is the wordmark and the `h1`.
