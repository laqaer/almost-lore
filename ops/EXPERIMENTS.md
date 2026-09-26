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
- Status: not started. At 2026-09-26T05:13:45Z the ops cron recorded HTTP 404 for `https://almostlore.com/stories/pig-war-san-juan`. The window starts only when that URL first returns 200 from the deploy of this change. Indexing is not observed. Search Console is not connected to this agent (a Google verification TXT already exists on the domain; OpenSEO credits are 0).

## E2 — Poyais working file, $9 once

- Hypothesis: A reader who wants the citable loan table, not another retelling, will pay $9 once for the printable working file.
- Audience: Readers of the free Poyais essay, including writers and teachers.
- Offer: One HTML dossier, delivered after a paid Stripe Checkout session for exactly $9. The essay stays free. Refund within 14 days if the file is missing or is not the dossier described on `/dossier`.
- Channel: The link on the Poyais essay and the dossier page. No ads.
- Cost ceiling: $0 new spend. Stripe’s card fee, if a real charge happens, is a cost of that sale, not a budget to exceed in advance.
- Success metric: One live-mode paid session from a customer who is not the owner, or ten live checkout sessions started, inside the window.
- Evaluation window: 30 days from the first day `/dossier` shows the pay button because Stripe is connected.
- Stop / pivot: If the window ends with zero checkout sessions started, stop defending the $9 file. Change the artifact, the price, or the audience. Do not count days while checkout is closed.
- Status: blocked. The page and the file exist. Card checkout is not connected. The button stays off until `stripeConfigured` is true on the ops status endpoint. This is not a failed demand test.
