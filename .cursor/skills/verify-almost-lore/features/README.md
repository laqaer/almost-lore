# Almost Lore verification map

This directory is the maintained source for verifying the reader-facing behavior of Almost Lore. Read the index before driving the site, then use the matching feature file as the recipe.

## Baseline preconditions

- For browser checks, run `npm run build` first. Playwright starts its own static server on port 4322.
- For helper checks, launch `http://127.0.0.1:4321` with `helpers/almost-lore launch` from the repository root.
- Keep `ALMOSTLORE_HOST=127.0.0.1` and `ALMOSTLORE_PORT=4321` unless this checkout's instance file says otherwise.
- Leave `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_ADSENSE_PUB_ID` unset.
- Before helper checks, run `almost-lore doctor`. Require `doctor: pass`, the home heading, and this checkout’s `repoRoot`.
- Never drive an instance that was not started by this verification run. Port 3000 is refused.

## Driving conventions

- Start every recipe from the hub unless its preconditions say otherwise.
- Prefer accessible names and route paths over CSS selectors or screen position.
- Treat every command as literal. Keep quoted names and flags unchanged.
- Use `npm run test:e2e` for browser interactions. Use `helpers/almost-lore` for local HTTP and crawler checks.
- The helper refuses off-site `href`s. That refusal is a pass for "do not leave the site" and a failure for a reader path that should have stayed local.
- Do not remove proof artifacts during cleanup. Keep historical evidence unchanged.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- Browser proof includes the test result and retained screenshots or failure traces in `test-results/`.
- Helper snapshots include page text, HTML, metadata, and an optional screenshot.
- Client-rendered helper checks use `almost-lore dom`. An HTTP response cannot prove client interactions.
- Record the revision, command, feature ID, and entry point with retained evidence.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the reader-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every reader entry point.
3. `Driving it with almost-lore` starts with `Preconditions:` and uses labeled bullets that pair each reader action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map except where a command would otherwise hit the ops Worker or an off-site URL. Name reader paths, stable handles, required state, commands, and observable proof.

## Features

- [Story hub](./story-hub.md) covers the homepage wordmark, cover story, searchable collection, and the missing-page state.
- [Read a story](./read-story.md) covers the cover link, an archive card, images, sources, sharing, and More stories.
- [Section pages](./section-pages.md) covers About, Contact, Now, Privacy, Terms, Support, and Friends.
- [Working file](./working-file.md) covers the Poyais dossier page and the download page without a checkout session.
- [Crawler files](./crawler-files.md) covers robots, sitemap, ads.txt, and the RSS feed linked from the footer.
