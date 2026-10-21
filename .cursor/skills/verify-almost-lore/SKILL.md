---
name: verify-almost-lore
description: Drive the Almost Lore web site (original longform stories at almostlore.com) locally and prove story reading, navigation, and crawler files the way a reader would. Use when verifying the homepage, a story page, About, the working-file page, sitemap/robots/ads.txt/feed, or after editorial or route changes.
---

# Verify Almost Lore

Almost Lore is a static editorial Next.js App Router site. A reader opens the hub and reads an original story. There is no account, search box, or comment thread. Card checkout and the support queue live on the Cloudflare Worker `almost-lore-ops`, not in this Next app. Drive the **local** instance this run started. Do not generate traffic against `https://almostlore.com`, do not submit IndexNow, and do not follow Amazon, Wikimedia, or other off-site links.

Read `features/README.md`, then the feature file you are proving. One convenient deep-link is not coverage when the map lists other entry points.

## Interview (what this skill is built on)

- **Surface:** browser web UI. Secondary crawler files: `/robots.txt`, `/sitemap.xml`, `/ads.txt`, `/feed.xml`. The ops Worker is a separate deploy and is outside this skill.
- **Run:** `npm install` then `npm run dev` (`next dev`), from the README. No app env vars are required. Node 20+. `next.config.ts` sets `output: "export"`. Verification uses `next dev` because that is the documented local command. Do not launch with `vercel dev` (its `/api/*` rewrite points at the production ops Worker).
- **Drive:** no Playwright or Cypress harness in this repo. `npm run test:e2e:ops` targets a running site (default production) and checks ops reconciliation, not reader paths. Use `helpers/almost-lore` (HTTP of real routes + Chrome headless screenshots and DOM). Follow named links. A raw GET of the destination does not prove the entry point.
- **Observe:** status, `<title>`, `h1`, nav link names, JSON-LD `@type`, sitemap locs, screenshots, extracted text. Client-only copy (checkout status, the thanks-page session line) needs `almost-lore dom`.
- **Isolate:** bind `127.0.0.1:4321` by default. This checkout can run one `next dev` because Next locks `.next`. Two ports in one working tree are refused. No database and no auth. Port **3000 is refused** for launch and for every drive command, including when some `instance.json` names it. A human `npm run dev` on `:3000` is a foreign instance: do not drive it and do not kill it.

## Launch

From the repo root, after `npm install`:

```bash
chmod +x .cursor/skills/verify-almost-lore/helpers/almost-lore
ALMOSTLORE_PORT=4321 ALMOSTLORE_HOST=127.0.0.1 \
  .cursor/skills/verify-almost-lore/helpers/almost-lore launch
```

Ready when the helper prints `launched pid=… http://127.0.0.1:4321` and `GET /` is HTTP 200 with the string `Almost Lore` and `h1` `The country that existed on paper` (the lead story, `stories[0]` in `lib/stories/index.ts`). The Next log is `/tmp/almost-lore-verify-4321/next.log`. Instance metadata is `/tmp/almost-lore-verify-4321/instance.json`.

There is no database to migrate and no seed step. The essays are the typed modules already in the repo. Ready means that lead heading is in the HTML, not only that a process accepts a socket.

Teardown is `almost-lore cleanup` (see Cleanup). Do not `pkill next`. Do not kill a pid that is not in this run's `instance.json`.

If `npm install` or launch fails, stop and report that blocker. Do not invent a different stack. If `.next/dev/lock` names a live pid, launch refuses; stop that server yourself or use another checkout.

`ALMOSTLORE_PORT=3000` exits before bind. `ALMOSTLORE_HOST` must be `127.0.0.1`.

## Doctor

Read-only. Run this first whenever anything looks off:

```bash
ALMOSTLORE_PORT=4321 ALMOSTLORE_HOST=127.0.0.1 \
  .cursor/skills/verify-almost-lore/helpers/almost-lore doctor
```

Pass means all of:

- `/tmp/almost-lore-verify-$PORT/instance.json` exists and its `pid` is alive
- that file's host, port, and `repoRoot` match this checkout and `ALMOSTLORE_HOST` / `ALMOSTLORE_PORT`
- `GET /` is 200 (this is the listen check; the accepting pid is often a child of the recorded pid)
- `<title>` contains `Almost Lore`
- `h1` is `The country that existed on paper`
- if a listener pid is visible, it is in that launch pid's process tree
- if `.next/dev/lock` names a live pid, that pid is in the same tree

`doctor: pass` is the success line. If doctor fails, do not drive. Launch this run's instance, or stop. A page that looks like Almost Lore on a port you did not start is a foreign instance.

## Drive

Harness: `helpers/almost-lore`. Stable handles are **accessible names and routes**, not CSS or coordinates.

| Handle | What it is |
| --- | --- |
| Link `Almost Lore` | header wordmark → `/` |
| `nav` named `Primary` | `Stories`, `About`, `Contact`, `Working file` |
| `Stories` | `/#stories` (era sections on the hub) |
| `Read the story` | home lead CTA → `/stories/poyais-invented-country` |
| `Read: The country that existed on paper` | lead image accessible name, same story |
| Era headings | `Before 1800`, `The Nineteenth Century`, `1900 Onward` |
| Story card titles | each `h3` link under an era (the lead is the `h1`, not repeated as a card) |
| `nav` named `More stories` | four other story titles at the bottom of an essay |
| `nav` named `Footer` | `Stories`, `About`, `Now`, `Working file`, `Support`, `Contact`, `Privacy`, `Terms`, `RSS feed` |
| `The Poyais working file` | essay aside and the dossier `h1` → `/dossier` |
| Footer `About` | → `/about` |
| Footer `RSS feed` | → `/feed.xml` |

`/friends` is a real page and is in the sitemap. Header and footer do not link to it. Open it by path.

Routes a reader can open:

| Path | Identity `h1` |
| --- | --- |
| `/` | The country that existed on paper |
| `/stories/poyais-invented-country` | The country that existed on paper |
| `/stories/aqua-tofana-myth-vs-record` | Aqua Tofana, after the legend |
| `/stories/balloon-almost-atlantic` | One hundred and ten miles of Atlantic |
| `/stories/forgotten-scheme` | The subway that ran one block |
| `/stories/fashoda-incident-1898` | Two flags at Fashoda |
| `/stories/pig-war-san-juan` | The war named for a pig |
| `/stories/caroline-affair` | The Caroline at Schlosser |
| `/stories/dogger-bank-1904` | Searchlights on the Dogger Bank |
| `/stories/trent-affair` | The four men taken off the Trent |
| `/stories/venezuelan-crisis-1895` | Every means in its power |
| `/stories/san-francisco-fog-1950` | The fog that was not weather |
| `/stories/bering-island-winter` | The island that kept the captain |
| `/stories/darien-scheme` | The isthmus that was supposed to pay Scotland |
| `/stories/aroostook-war` | A line convenient to both |
| `/about` | A reader for near-misses, published by Laqaer |
| `/contact` | How to reach Almost Lore |
| `/now` | What Almost Lore is focused on |
| `/friends` | People on their own sites |
| `/privacy` | Privacy policy |
| `/dossier` | The Poyais working file |
| `/dossier/thanks` | Your download |
| `/support` | A correction, a refund, a note |
| `/terms` | Terms of the working file |

Unknown paths render `That page is not in the folio` with link `Back to Almost Lore` and HTTP 404.

Commands (always pass the same `ALMOSTLORE_PORT` / `ALMOSTLORE_HOST` as launch):

```bash
H=.cursor/skills/verify-almost-lore/helpers/almost-lore

$H get /
$H get / --expect "Lead story" --expect "Read the story" --expect "14 longform essays"

$H follow --from / --name "Read the story" \
  --expect "The country that existed on paper" \
  --expect "A soldier who needed a country" \
  --expect "On sources."

$H follow --from / --name "About" --expect "A reader for near-misses, published by Laqaer"

$H screenshot / --out .cursor/skills/verify-almost-lore/evidence/story-hub/page.png
$H snapshot / --dir .cursor/skills/verify-almost-lore/evidence/story-hub --screenshot --feature story-hub
```

`About` occurs in the header and the footer. Both `href`s are `/about`, so `follow` takes that single destination. If one accessible name maps to two different `href`s, the command fails and lists indexes; pass `--index N`.

Every feature file repeats this pairing: user action → exact `almost-lore` command → observable result.

## Evidence

Proof directory (never deleted by cleanup):

`.cursor/skills/verify-almost-lore/evidence/<feature-id>/`

Minimum for a UI feature:

- action: the `follow` stdout that left the previous page
- result: snapshot of the arrived page (`page.txt` headings/nav, `page.html`, `page.meta.json`, `page.png` when Chrome is available)
- identity: visible `Almost Lore` plus the page `h1` from the table above

Minimum for crawler files: `almost-lore seo --dir .cursor/skills/verify-almost-lore/evidence/crawler-files` and the saved bodies.

Standards:

- Exercise the real reader path (named link in the header, the lead CTA, a story card, or the footer). A raw `get` of the destination skips the entry point and is not a pass for that entry.
- Capture the action and the resulting page, not only the final screenshot.
- Confirm on-page side effects that exist: JSON-LD `@type` values. Every page includes `WebSite` from the root layout, and that object nests a publisher `Organization` plus a `ContactPoint`, so those types show up on the hub too. A story page also includes `Article`. About also includes the organization object from `organizationJsonLd`. The footer says Almost Lore publishes original longform essays. Canonical host `https://almostlore.com` appears as a string in the HTML.
- Do not mock Next. Do not request retailer, Amazon, or Wikimedia URLs. Story pages contain those links; `follow` refuses a non-local origin and that refusal is the correct result.
- Do not POST `/support` or `/api/support`. The note store is the ops Worker. Seeing the form is the local proof.
- Do not open Stripe, do not pass a fake `session_id`, and do not request `/api/checkout` or `/api/download`.
- Local `next dev` does not apply `vercel.json`. A browser fetch of `/api/status` from the dossier page stays on `127.0.0.1` and is not a production ops call. Do not point the harness at `vercel dev` or at `almostlore.com` to make checkout look connected.
- Do not call this a dry-run of production. Local HTML still embeds production canonicals and JSON-LD URLs from `lib/site.ts`. That string is expected. It is not a request to production. Confirm the harness log and the `page.meta.json` `url` field are `http://127.0.0.1:4321/...`.
- Leave `NEXT_PUBLIC_ADSENSE_PUB_ID` and `NEXT_PUBLIC_SITE_URL` unset for a verification run. `seo` requires `ads.txt` to be the single placeholder comment from `lib/ads.ts`. Setting a publisher id changes the file; this skill does not do that.

Record the feature id and entry point on every artifact (`page.meta.json` stores `url`, `capturedAt`, and `feature` when `--feature` is passed). Add a `PROOF.txt` in the feature directory naming the feature id, the entry point, and the command used.

## Cleanup

```bash
ALMOSTLORE_PORT=4321 ALMOSTLORE_HOST=127.0.0.1 \
  .cursor/skills/verify-almost-lore/helpers/almost-lore cleanup
```

Kills only the pid in this run's `instance.json` (its process group and descendants) and a listener on that port whose cmdline is this repo's `next` with that port. Removes `/tmp/almost-lore-verify-$PORT/`. Does **not** delete `.cursor/skills/verify-almost-lore/evidence/` and does **not** delete `.next/`. After cleanup, confirm the evidence files still exist before reporting a pass.

If a drive fails, run cleanup before the next launch so port 4321 is not stranded. Cleanup does not stop a foreign server on `:3000`.

## Helpers

`helpers/almost-lore` is executable. Invocation is always from the repo root with the env vars above.

| Command | Purpose |
| --- | --- |
| `almost-lore launch` | Start `next dev --hostname 127.0.0.1 --port $ALMOSTLORE_PORT` |
| `almost-lore doctor` | Read-only health + identity |
| `almost-lore url` | Print `http://127.0.0.1:$ALMOSTLORE_PORT` |
| `almost-lore get <path> [--status N] [--expect text]...` | GET a path; print status/title/h1; assert substrings |
| `almost-lore follow --from <path> --name <text> [--from-status N]` | Find that link on the source page, GET its local href |
| `almost-lore snapshot <path> --dir <dir> [--screenshot] [--feature <id>]` | Save html/txt/meta (and optional png) |
| `almost-lore screenshot <path> --out <file>` | Chrome headless 1280×900 png |
| `almost-lore dom <path> [--out <file>] [--expect text]...` | Chrome dump-dom after client JS |
| `almost-lore seo [--dir <dir>]` | Assert robots/sitemap/ads.txt/feed |
| `almost-lore cleanup` | Tear down this instance; keep evidence |

Chrome is `/usr/local/bin/google-chrome` or `ALMOSTLORE_CHROME`. Screenshots and `dom` use `--headless=new --no-sandbox` and a disposable `--user-data-dir` under `/tmp/almost-lore-chrome-*`, removed when the command finishes. If Chrome exits slowly after writing the PNG, the helper still accepts a file larger than 1000 bytes. If Chrome is missing, HTTP snapshots still prove server-rendered content; the command prints `screenshot blocked:` or `dom blocked:`. A sub-feature whose observable result exists only after hydration (dossier checkout copy, `/dossier/thanks` session copy) stays unverified when Chrome is missing. Do not mark it passed from the server HTML.

## Isolate and concurrency

- Default verification URL: `http://127.0.0.1:4321`
- Another checkout can use another port, for example `ALMOSTLORE_PORT=4322` (run dir `/tmp/almost-lore-verify-4322`)
- The same checkout cannot host two `next dev` processes. Launch refuses when another live `instance.json` for this `repoRoot` exists, or when `.next/dev/lock` names a live pid
- Bind `127.0.0.1` so a leftover `next dev` on `0.0.0.0:3000` is a different server
- No seed data, no auth cookies, no writable content store in this app

## Maintenance

When routes, story order, or reader paths change, update this map with `/maintain-verification-skill`. The feature files are the source of truth. A home `h1` change means `stories[0]` changed; update Doctor and `features/read-story.md` rather than loosening the expected heading.

## Anti-jobs

Do not rewrite stories or editorial pages. Do not change AdSense ids, `NEXT_PUBLIC_SITE_URL`, or the domain. Do not invent traffic or ranking numbers. Do not send email or social posts. Do not run `npm run indexnow` as part of verification. Do not deploy the site or `workers/ops`. Local proof is enough.
