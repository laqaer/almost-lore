# Almost Lore

Original longform on public-record historical near-misses and weird history. Mogul story factory Site #4. Published by Laqaer.

Published at `almostlore.com`. Set `NEXT_PUBLIC_SITE_URL` if the deploy URL should differ.

## Stories

| Route | Subject |
| --- | --- |
| `/` | Hub: what this is, how a hook leads here, story index |
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
| `/dossier` | Paid Poyais working file. Checkout stays closed until Stripe is connected |
| `/support` | Corrections and refund notes, stored for the publisher |
| `/terms` | Price, delivery, and refund terms for the working file |
| `/about` | Laqaer disclosure and editorial standards |
| `/now` | Current editorial focus, longforms on the site, contact |
| `/friends` | Blogroll of people and their personal sites |
| `/privacy` | Honest ads-later privacy page |

No CMS, reader accounts, or picker widgets. Essays are typed content. Article JSON-LD is used only on story pages.

Card checkout and the support queue live on the Cloudflare Worker `almost-lore-ops`, not in this static export. The paid file body is not in this public repository. Operating notes are in `ops/`.

## Local

```bash
npm install
npm run dev
```

Checks: `npm run lint`, `npm run typecheck`, `npm run build`.

## IndexNow

Run `npm run indexnow` after a production deploy. The key file must already be live at `https://almostlore.com/7843aae65a441c1d1eea85e21facde25.txt` (body is the key). `npm run build` does not submit. `npm run indexnow -- --dry-run` prints the payload and does not send it.
