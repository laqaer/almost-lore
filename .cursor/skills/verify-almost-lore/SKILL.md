---
name: verify-almost-lore
description: Verify Almost Lore reader flows, archive filters, sharing, images, and crawler files locally.
---

# Verify Almost Lore

Almost Lore is a static editorial Next.js site. Readers browse a searchable archive, open essays, inspect sources, and copy story links.
Card checkout and the support queue belong to the separate `almost-lore-ops` Worker.

Use a local instance started by this verification run. Do not submit IndexNow or follow Amazon, Wikimedia, or other external links.
Read `features/README.md`, then the feature file for the behavior under review.

## Interview (what this skill is built on)

- **Surface:** browser pages and the public crawler files `/robots.txt`, `/sitemap.xml`, `/ads.txt`, and `/feed.xml`.
- **Run:** use `npm ci`, `npm run build`, and `npm run test:e2e`. The app exports static files to `out/`.
- **Drive:** Playwright tests exercise real browser interactions in desktop and mobile Chromium. The HTTP helper supports route, snapshot, and crawler checks.
- **Observe:** headings, navigation, search results, clipboard contents, decoded images, page width, HTTP status, metadata, and browser exceptions.
- **Isolate:** Playwright serves `out/` at `127.0.0.1:4322`. The optional development helper uses `127.0.0.1:4321`. Neither server proxies the ops Worker.

`npm run test:e2e:ops` is a separate live reconciliation check. It does not verify the reader paths described here.
Do not run `vercel dev` for local reader checks. Its API rewrite points to production.

## Launch

Run the browser suite from the repository root:

```bash
npm ci
npx playwright install chromium
npm run build
npm run test:e2e
```

Playwright starts and stops its own static server. It refuses to reuse an existing process on port 4322.
To inspect the same export manually, run `npm run serve:export` and stop it before running the suite.

For an interactive development investigation, use the existing helper:

```bash
ALMOSTLORE_PORT=4321 ALMOSTLORE_HOST=127.0.0.1 \
  .cursor/skills/verify-almost-lore/helpers/almost-lore launch
```

Ready means HTTP 200, a title containing `Almost Lore`, and the `h1` `Come down the rabbit hole.`.
The helper records its process in `/tmp/almost-lore-verify-4321/instance.json` and logs in `next.log` beside that file.

There is no database or seed step. If dependencies or launch fail, fix that cause within the existing stack.
Do not kill another session’s server. Use another checkout when a live process holds the Next development lock.
The helper refuses port 3000 and any host other than `127.0.0.1`.

## Doctor

For a helper-owned development instance, run:

```bash
ALMOSTLORE_PORT=4321 ALMOSTLORE_HOST=127.0.0.1 \
  .cursor/skills/verify-almost-lore/helpers/almost-lore doctor
```

A pass requires:

- A live process recorded in this run’s instance file.
- Matching host, port, and repository directory.
- HTTP 200 from `/`, a title containing `Almost Lore`, and the exact home heading.
- Any observed listener and Next lock belonging to the recorded process tree.

Do not drive a development instance when Doctor fails.
A familiar page on an unowned port is not this run’s verification target.

## Drive

Use accessible names and public routes. The maintained feature files contain exact commands and expected outcomes.

| Handle | Reader destination or behavior |
| --- | --- |
| `Almost Lore home` | Header wordmark returns to `/` |
| `The stories` | Opens the story collection at `/#stories` |
| `Read the Caroline affair` | Opens `/stories/caroline-affair` from the cover |
| `Search stories` | Searches titles, summaries, years, and collections |
| `All stories` | Clears the collection restriction |
| `Strange schemes`, `Close calls`, `Into the unknown` | Filter the story collection |
| `Reset filters` | Clears the query and collection after an empty result |
| A story card’s title | Opens that essay; its heading matches the chosen title |
| `Copy link` | Copies the canonical story URL and announces `Link copied` |
| Navigation named `More stories` | Opens another essay from the current article |
| `Our approach` | Opens `/about` |
| `Get in touch` | Opens `/contact` |
| `The working file` | Opens `/dossier` |
| `The Poyais working file` | Opens `/dossier` from the Poyais essay |
| `Follow via RSS ↗` | Opens `/feed.xml` from the footer |
| `Friends of the journal` | Opens `/friends` from the footer |

The home `h1` is `Come down the rabbit hole.`. Article headings use their current editorial titles.
Other page headings remain listed in the section and working-file feature files.
Unknown paths return HTTP 404 with `That page is not in the folio` and `Back to Almost Lore`.

Browser commands:

```bash
npm run test:e2e
npm run test:e2e -- --project=mobile
npm run test:e2e -- --grep "archive search"
npm run test:e2e -- --grep "a reader opens the cover"
```

Helper commands require the same host and port used at launch:

```bash
H=.cursor/skills/verify-almost-lore/helpers/almost-lore
$H get / --expect "The story collection"
$H follow --from / --name "Read the Caroline affair" --expect "On sources."
$H follow --from / --name "Our approach" --expect "Editorial standards"
$H seo --dir /tmp/almost-lore-crawler-evidence
```

A helper `follow` reads the link from the source page before requesting its destination.
An HTTP GET alone cannot verify search, filtering, clipboard access, or client-side navigation.

## Evidence

Playwright saves traces and screenshots for failures in `test-results/`. Open the HTML report with `npx playwright show-report`.
The image and reader tests also save homepage and article screenshots for both viewports.

For a material change, keep the command, revision, result, and relevant artifacts together.
Retain historical evidence under `evidence/`. Save new manual evidence in a new directory instead of overwriting earlier receipts.

A browser flow passes only when its action and observable result succeed.
A screenshot of a destination does not establish how the reader reached it.

- Use real pages. Do not mock Next or add test-only production controls.
- A story page contains Article JSON-LD. The hub contains WebSite data and does not become an Article.
- Leave source and retailer links unopened. The HTTP helper must refuse external origins.
- Do not submit the support form or POST to `/api/support`.
- Do not open Stripe, invent a session ID, or request checkout and download endpoints.
- Local dossier status requests remain local. Their failure leaves the pay button off and does not represent production payment status.
- Keep `NEXT_PUBLIC_ADSENSE_PUB_ID` and `NEXT_PUBLIC_SITE_URL` unset. Crawler checks expect the default placeholder ads.txt and canonical host.
- A production URL in metadata or the clipboard is not a production request. Verify the actual browser address and harness logs.

## Cleanup

Playwright stops its static server after the suite. For a helper-owned development instance, run:

```bash
ALMOSTLORE_PORT=4321 ALMOSTLORE_HOST=127.0.0.1 \
  .cursor/skills/verify-almost-lore/helpers/almost-lore cleanup
```

Cleanup stops only the process tree recorded for that run. It does not stop a foreign server or delete retained evidence.
Do not use broad process-kill commands.

## Helpers

Run `helpers/almost-lore` from the repository root.

| Command | Purpose |
| --- | --- |
| `almost-lore launch` | Start an isolated Next development instance |
| `almost-lore doctor` | Check instance ownership and page identity |
| `almost-lore url` | Print the local URL |
| `almost-lore get <path> [--status N] [--expect text]...` | Check a local HTTP response |
| `almost-lore follow --from <path> --name <text> [--from-status N]` | Follow a named local link |
| `almost-lore snapshot <path> --dir <dir> [--screenshot] [--feature <id>]` | Save page text, HTML, metadata, and an optional image |
| `almost-lore screenshot <path> --out <file>` | Capture a Chrome image |
| `almost-lore dom <path> [--out <file>] [--expect text]...` | Read the hydrated page in Chrome |
| `almost-lore seo [--dir <dir>]` | Check robots, sitemap, ads.txt, and RSS |
| `almost-lore cleanup` | Stop this helper’s instance and retain evidence |

The helper uses `/usr/local/bin/google-chrome` or `ALMOSTLORE_CHROME` for screenshots and hydrated DOM.
If Chrome is unavailable, report those checks as unverified. HTTP output cannot prove hydrated behavior.

## Isolate and concurrency

- Use port 4322 for the static browser suite and port 4321 for the development helper.
- A checkout must not run two Next development processes against the same `.next` directory.
- Do not run a build while another process is editing the sources under verification.
- Keep local servers bound to `127.0.0.1`.
- Leave unrelated sessions, authentication state, and production services untouched.

## Maintenance

When reader paths change, update the feature map and the tests that own those public contracts.
If the home heading changes, update the helper’s `HOME_H1` and the hub feature file.
Editorial story titles may change without changing their routes. Verify the selected card title against its destination heading.

## Anti-jobs

Do not rewrite essays as part of verification. Do not change advertising IDs, the canonical domain, secrets, or payment settings.
Do not invent traffic, ranking, or revenue results. Do not send social posts or email.
Do not submit IndexNow or deploy the site or ops Worker as part of this local verification skill.
