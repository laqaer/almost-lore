# Story hub

The front page combines a cover story, the editor’s shortlist, and a searchable story collection. Readers can browse by topic or search by word, place, and year.

## Sub-features

- `hub-identity` shows the wordmark and the heading `Come down the rabbit hole.`.
- `hub-archive` lists all essays and supports search, topic filters, and reset.
- `hub-nav` exposes the Primary and Footer navigation on wide and narrow screens.
- `hub-missing` shows an HTTP 404 with a link back to the hub.

## How to get to it (user POV)

- Open `/`.
- Choose `Almost Lore home` from any page.
- Choose `The stories` to reach `/#stories`.
- Choose `Back to Almost Lore` on an unknown path.

## Driving it with almost-lore

Preconditions:

- For browser checks, build the export with `npm run build`.
- For helper commands, launch this checkout at `http://127.0.0.1:4321` and require `almost-lore doctor` to pass.
- Leave `NEXT_PUBLIC_SITE_URL` unset so the canonical host remains `https://almostlore.com`.

- **Archive interactions.** Run `npm run test:e2e -- --grep "archive search"`. The browser searches for Poyais, changes collections, checks an empty result, and resets the filters. The result count and matching story links change after each action. Both desktop and mobile projects must pass.
- **Open the hub.** Run `.cursor/skills/verify-almost-lore/helpers/almost-lore get / --expect "Come down the" --expect "rabbit hole." --expect "The story collection"`. Status is 200. The `h1` is `Come down the rabbit hole.`.
- **Stories anchor.** Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "The stories"`. The destination is `/#stories` and the helper prints `fragment-id: present`.
- **Wordmark returns home.** Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from /stories/poyais-invented-country --name "Almost Lore home" --expect "The story collection"`. The destination path is `/`.
- **Navigation and width.** Run `npm run test:e2e -- --grep "primary navigation"`. The browser opens About and Contact through the header and returns through the wordmark. Links stay visible, and each page fits the viewport.
- **Missing page.** Run `.cursor/skills/verify-almost-lore/helpers/almost-lore get /not-a-story --status 404 --expect "That page is not in the folio" --expect "Back to Almost Lore"`.
- **404 return.** Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from /not-a-story --from-status 404 --name "Back to Almost Lore" --expect "The story collection"`. The destination returns HTTP 200.
- **Proof.** The image test saves desktop and mobile homepage screenshots under `test-results/`. Run `npm run test:e2e -- --grep "archival images"` to produce them.

## Gotchas

- The home heading describes the publication. It is no longer the first essay’s title.
- The story collection includes the cover and shortlist essays. It contains every story once before filtering.
- An HTTP response cannot prove that a search or filter works. Use the browser suite for these interactions.
- `The stories` is a fragment link. HTTP 200 alone does not prove the `stories` target exists.
- Keep historical screenshots and proof files unchanged. Save new manual evidence in a new directory.
