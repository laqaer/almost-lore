# Editorial overhaul, 2026-10-28

This change improves the existing collection of 14 essays. It adds no new essays.
The homepage, story cards, and reading pages use one editorial design with a Caroline cover story and an editor's shortlist.
The reconciliation retains the compass, drawn rules, keyboard focus effects, and static further-reading blocks from [PR #28](https://github.com/laqaer/almost-lore/pull/28).
Reduced-motion preferences keep those decorations still.
All 14 essays have revised introductions or summaries. Existing routes, source notes, and factual limits remain in place.

## Reader changes

- Search the collection by title, summary, year, or topic. Combine search with three topic filters, then reset both controls.
- Open section links from the desktop contents list or the mobile contents panel.
- Copy a story's canonical link. If clipboard access fails, use the displayed link field.
- Continue to related stories from the end of an essay.
- Follow the collection through its RSS feed. The working-file and source links remain available.

Image credits remain visible on story cards, the cover, and article images. Credits identify later depictions and contextual photographs.
The Double Eagle II credit names Mike Peel, states CC BY-SA 4.0, and identifies the later successful crossing.

## Archival additions

Three locally stored images extend existing essays:

| Essay | Added image | Source |
| --- | --- | --- |
| Poyais | Advertised Black River port, 1822 | John Carter Brown Library |
| Beach's subway | Railway plan and air machinery, 1870 | Scientific American |
| Pig War | San Juan Island government reservations, 1860 | U.S. National Archives |

The [image credits](../public/images/CREDITS.md) record source links, licenses, dimensions, and factual limits.
The Poyais view is promotional. The San Juan map records the later joint occupation.
Article metadata and the sitemap include these images.

## Measurement and experiment limits

Search Console's daily report records 53 impressions and 0 clicks from 2026-09-27 through 2026-10-24.
The [saved response](evidence/2026-10-28/search-console.json) was retrieved on 2026-10-28. It does not measure total visits or conversions.
The [social launch drafts](social-launch.md) promote existing essays. No post has been sent.

The [experiment record](../ops/EXPERIMENTS.md) remains authoritative. E1's deadline stays 2026-10-17; its result remains closed without demonstrated success.
Keep the original restriction on new story volume until the first essay can be measured. This overhaul does not restart E1.
E2's evaluation date remains 2026-11-14. Local browser checks do not establish customer demand or revenue.

## Local verification

The latest completed local run passed these checks:

| Command | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | 15 tests passed |
| `npm run build` | Static export completed |
| `npm run test:e2e` | 10 browser tests passed |
| `npx wrangler@4.135.0 deploy --dry-run` | Static hosting bundle passed; no deployment |

The browser suite drives the exported site in desktop and mobile Chromium.
It checks search, filters, reset, navigation, copying links, image delivery, section links, and horizontal overflow.
Final source verification passed at `090adfc0a0aee828c5846fde66714e151cef6246`.
The RSS regression reproduced failed feed requests and a browser transition error before the fixes. It passes unchanged after both corrections.
The feed uses native document navigation and skips only its HTML-to-XML page transition.
Desktop and mobile visual checks cover light, dark, normal motion, and reduced motion.
The [hosted static-export check](https://github.com/laqaer/almost-lore/actions/runs/40654848666) passed on the final candidate.
Local command logs are retained in `.verification/2026-10-28/`.

## Release record and deployment boundary

| Stage | Status |
| --- | --- |
| Implementation | Complete |
| Related issue | No separate issue; the pull request tracks this owner-requested change |
| Candidate | [`090adfc`](https://github.com/laqaer/almost-lore/commit/090adfc0a0aee828c5846fde66714e151cef6246) |
| Pull request | [#29](https://github.com/laqaer/almost-lore/pull/29) |
| Merge | [PR #29](https://github.com/laqaer/almost-lore/pull/29), [`38bfb4c`](https://github.com/laqaer/almost-lore/commit/38bfb4c3c7f89db03f1a15ea7065e8d6cbb01c39) |
| Production deployment | Vercel Git integration; `dpl_EjFPrjTQ5Qg2BRwZVBXa2RN3oCiP` reached `READY` |
| Deployed revision | [`b14c92d`](https://github.com/laqaer/almost-lore/commit/b14c92d63ab2b7f48c468f6a502323d9062e359c); source receipt after the merge, with the same application files |
| Production verification | Passed on `https://almostlore.com` at 2026-10-28 08:23 UTC |

The website deploys through Vercel. The Cloudflare Worker `almost-lore-ops` deploys separately.
A website deployment does not publish the Worker. This change makes no ops deployment claim.
See the [deployment procedure](../README.md#deployment) and [operating state](../ops/STATE.md).

## Production acceptance

All 23 sitemap pages returned HTTP 200 with matching canonical URLs. All 34 checked assets returned HTTP 200, including 17 sitemap images.
The homepage contained the new cover and collection text. Live image URLs identified deployment `dpl_EjFPrjTQ5Qg2BRwZVBXa2RN3oCiP`.
Desktop and mobile Chromium passed search, story navigation, link copying, gallery delivery, RSS navigation, and overflow checks. Neither run reported a runtime error.
The first gallery probe used an exact unversioned URL. Vercel adds a deployment query parameter; the corrected probe verifies the exact pathname and decoded image.

The [production response record](evidence/2026-10-28/production-check.json) contains every checked page and asset URL.
The [release evidence](evidence/2026-10-28/release.json) records the candidate, merge, deployment, and check results.
The [Vercel deployment](https://vercel.com/laqaers-projects/almost-lore/EjFPrjTQ5Qg2BRwZVBXa2RN3oCiP) is the production build used for acceptance.

`npm run indexnow` submitted 23 public URLs after acceptance. IndexNow returned HTTP 200.
Submission acceptance does not establish indexing or traffic growth. No social post has been published.
This release does not verify payment completion or paid download delivery.
