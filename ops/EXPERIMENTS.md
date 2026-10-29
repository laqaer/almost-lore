# Experiments

Rules below were written before the pages were public. Do not move the metric after the window starts.

## E1 — Pig War essay, organic search

- Hypothesis: A sourced essay on the San Juan Island Pig War is indexed from almostlore.com and is a page someone can land on for that incident.
- Audience: Readers searching for the Pig War, the San Juan boundary dispute, or the “only casualty was a pig” line.
- Offer: The free essay. No paywall.
- Channel: Organic search. The page is added to the existing sitemap. No paid promotion. No posts from a personal account.
- Cost ceiling: $0 new spend.
- Success metric: `https://almostlore.com/stories/pig-war-san-juan` returns HTTP 200 on production, and within 21 days of that deploy the URL is indexed or appears in a Google result. Indexing we cannot see is not success.
- Evaluation window: 21 days from the production deploy that contains the essay.
- Stop / pivot: If the URL is not indexed at day 21, do not write a second essay in the same pattern until the first can be measured. Fix titles, internal links, or Search Console access before adding volume.
- Launch status (historical): window open, indexing not observed. Production first returned HTTP 200 for `https://almostlore.com/stories/pig-war-san-juan` at 2026-09-26T05:22:00Z (response `Date` header; Vercel deployment `dpl_5pc6yD7MmWHv6VqGkC4yFa3ZdHLR`, commit `d67eba1`). `www` returned the same page. The 21-day window runs through 2026-10-17. A cron probe at 05:13:45Z, before this deploy, recorded 404 and does not start the window. Search Console is not connected. A Google verification TXT already exists on the domain. OpenSEO credits are 0, so no paid index check was run.

### E1 Evaluation, 2026-10-18

Status: closed without demonstrated success. The original deadline was 2026-10-17 at 05:22 UTC. It has not moved.
This evaluation occurred after the deadline, at approximately 03:50 UTC on October 18. No verified indexing evidence was recorded within the window.

- The production URL returned HTTP 200 during this evaluation.
- A Google search for `site:almostlore.com/stories/pig-war-san-juan` displayed no matching organic result. Only a Search Console promotion appeared.
- The same Bing query displayed unrelated results. None of the displayed results established indexing of this URL.
- Web searches for the exact site path and `"almostlore.com" "Pig War"` returned no results.
- Search Console indexing evidence remains unavailable. These searches do not prove that the URL is absent from every search index.

The HTTP requirement passed. The indexing requirement was not demonstrated, so E1 does not count as a success.
Apply the original stop rule: do not add another essay in this pattern until the first can be measured.
Keep future work limited to evidenced title or internal-link repairs, or indexing measurement access. Do not extend this experiment or count submission acceptance as indexing.

### E1 Measurement Follow-up, 2026-10-29

Search Console access is now available through OpenSEO project `cd37cdd7-bd46-45a4-83fd-ad493669cd90`.
A read-only inspection returned `NEUTRAL`: "Discovered - currently not indexed" for the Pig War URL.
Google lists the sitemap and referring pages but supplies no last crawl time or canonical verdict.
This is stored index status, not a live crawl. See the [inspection receipt](../docs/evidence/2026-10-29/indexing.json).
It agrees with the [October 28 receipt](../docs/evidence/2026-10-28/search-console.json) from [PR #29](https://github.com/laqaer/almost-lore/pull/29).

This resolves the measurement-access blocker. It does not establish indexing within the original window or change the October 18 evaluation.
E1 stays closed without demonstrated success, with its original 2026-10-17 05:22 UTC deadline.
Use current measurements for the next title or internal-link repair. Do not restart the experiment or repeat account setup.
No new story was added in this follow-up.

## E2 — Poyais working file, $9 once

- Hypothesis: A reader who wants the citable loan table, not another retelling, will pay $9 once for the printable working file.
- Audience: Readers of the free Poyais essay, including writers and teachers.
- Offer: One HTML dossier, delivered after a paid Stripe Checkout session for exactly $9. The essay stays free. Refund within 14 days if the file is missing or is not the dossier described on `/dossier`.
- Channel: The link on the Poyais essay and the dossier page. No ads.
- Cost ceiling: $0 new spend. Stripe’s card fee, if a real charge happens, is a cost of that sale, not a budget to exceed in advance.
- Success metric: One live-mode paid session from a customer who is not the owner, or ten live checkout sessions started, inside the window.
- Evaluation window: 30 days from the first day `/dossier` shows the pay button because Stripe is connected.
- Stop / pivot: If the window ends with zero checkout sessions started, stop defending the $9 file. Change the artifact, the price, or the audience. Do not count days while checkout is closed.
- Status: open. By 2026-10-16 at 03:46 UTC, the rendered `/dossier` page showed "Pay $9 and continue to checkout". The status endpoint reported `stripeConfigured`, `stripeLive`, `webhookConfigured`, and `dossierStored` as true, with `paused` false.
- Start and deadline: use 2026-10-15 as the conservative start date and 2026-11-14 as the evaluation date. The exact activation time is unverified. The last closed observation was 2026-10-15 at 03:43 UTC. The first browser confirmation was 2026-10-15 in Pacific time (2026-10-16 UTC). This date choice does not extend the window for delayed verification.
- Measurement failure, verified 2026-10-17 (historical): the October 16 cron threw an exception after 50 subrequests. The latest summary then remained the October 15 cron, with source `no_stripe_key`. Current sales were unknown. The repair then awaited deployment approval in [issue #23](https://github.com/laqaer/almost-lore/issues/23). The evaluation date did not change. No checkout session or charge was created during verification.
- Measurement restored, verified 2026-10-19: the latest summary is the October 18 cron at `2026-10-18T13:00:28.914Z`, with ledger source `stripe_checkout_sessions`. The production read-only E2E check passes. [Issue #23 records successful scheduled acceptance](https://github.com/laqaer/almost-lore/issues/23#issuecomment-6250463123) and is closed. The summary reports zero paid sessions but does not report checkout starts. Its account-wide 100-session limit, incomplete fees and refunds, and lack of automatic owner exclusion still prevent full demand and profit measurement. This recovery does not establish E2 success or change its deadline.
- Owner test purchases, including live-mode purchases later refunded, verify payment plumbing only. Exclude them from customer revenue and the original demand metric. Keep the original success metric above unchanged.
