# Almost Lore

Original longform on public-record historical near-misses and weird history. Published by Laqaer.

Published at `almostlore.com`. Set `NEXT_PUBLIC_SITE_URL` if the deploy URL should differ.

## Stories

| Route | Subject |
| --- | --- |
| `/` | Hub: what this is, the story index, and how to reach us |
| `/stories/poyais-invented-country` | Gregor MacGregor / Poyais |
| `/stories/aqua-tofana-myth-vs-record` | Aqua Tofana, myth vs archive |
| `/stories/balloon-almost-atlantic` | Zanussi, July 1978 |
| `/stories/forgotten-scheme` | Beach pneumatic subway, 1870 |
| `/stories/fashoda-incident-1898` | Fashoda Incident, 1898 |
| `/stories/pig-war-san-juan` | Pig War, San Juan Island, 1859–1872 |
| `/stories/caroline-affair` | Caroline Affair and the McLeod case, 1837–1842 |
| `/stories/dogger-bank-1904` | Dogger Bank Incident, 1904 |
| `/stories/trent-affair` | Trent Affair, 1861–1862 |
| `/stories/venezuelan-crisis-1895` | Venezuelan Crisis, 1895–1899 |
| `/stories/san-francisco-fog-1950` | San Francisco bacterial spray, September 1950 |
| `/stories/bering-island-winter` | Bering’s wreck on Bering Island, 1741–1742 |
| `/stories/darien-scheme` | Company of Scotland at Darien, 1698–1700 |
| `/stories/aroostook-war` | Aroostook boundary dispute, 1838–1842 |
| `/dossier` | Paid Poyais working file. Checkout stays closed until Stripe is connected |
| `/support` | Corrections and refund notes, stored for the publisher |
| `/terms` | Price, delivery, and refund terms for the working file |
| `/about` | Laqaer disclosure and editorial standards |
| `/now` | Current editorial focus, longforms on the site, contact |
| `/friends` | Blogroll of people and their personal sites |
| `/privacy` | Privacy page, naming any ads, affiliate links, or analytics if added |

The archive supports local search and topic filters. Essays remain typed content. Article JSON-LD is used only on story pages. The five essays that already have further reading also show a Questions block, and those pages emit FAQPage JSON-LD from the same questions and answers.

Card checkout and the support queue live on the Cloudflare Worker `almost-lore-ops`, not in this static export. The paid file body is not in this public repository. Operating notes are in `ops/`.

## Local

```bash
npm install
npm run dev
```

Checks: `npm run lint`, `npm run typecheck`, `npm run build`.

The browser suite drives the built site in desktop and mobile Chromium:

```bash
npx playwright install chromium
npm run build
npm run test:e2e
```

The suite checks archive filters, story navigation, link sharing, image delivery, and narrow layouts.
It serves `out/` on `http://127.0.0.1:4322` and stops that server after the run.
Browser failures retain traces and screenshots in `test-results/`. Open the report with `npx playwright show-report`.
To inspect the same static export manually, run `npm run serve:export`.

The separate `npm run test:e2e:ops` command checks the live scheduled reconciliation.
It does not verify checkout or download completion.

## Deployment

Production uses Vercel's Git integration for `laqaer/almost-lore`, branch `main`.
The project is `almost-lore` in `laqaers-projects`. Its production domain is `almostlore.com`.
The [editorial release record](docs/editorial-overhaul.md) contains the deployed revision and production acceptance evidence.

1. Push or merge the verified change to `main`.
2. Confirm that the new Vercel deployment uses the expected commit and reaches `READY`.
3. Verify the changed pages on `https://almostlore.com`.
4. After the IndexNow key file is live, run `npm run indexnow`.

The root Wrangler configuration supports static export compatibility only. Never use it to deploy the ops Worker.
The website and `almost-lore-ops` deploy separately. Read [ops/STATE.md](ops/STATE.md) before changing production operations.

## ads.txt

`/ads.txt` is written at build time from `NEXT_PUBLIC_ADSENSE_PUB_ID`. Leave it unset and the file is one comment:

```
# Almost Lore ads.txt — AdSense publisher line added after approval.
```

After AdSense approval, set that variable to the publisher id (`pub-` plus 10–20 digits) and rebuild. The file becomes one line: `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`. Any other value keeps the comment.

Ad markup uses the separate `NEXT_PUBLIC_ADS_PUBLISHER_ID` and `NEXT_PUBLIC_ADS_SLOT` values.
Configuration does not enable ad delivery while the certified consent platform remains absent.

## IndexNow

Run `npm run indexnow` after a production deploy. The key file must already be live at `https://almostlore.com/7843aae65a441c1d1eea85e21facde25.txt` (body is the key). `npm run build` does not submit. `npm run indexnow -- --dry-run` prints the payload and does not send it.
