# Almost Lore — operating state

Updated: 2026-10-17

## Reconciliation Failure, 2026-10-17

The October 16 daily job failed. This finding supersedes the earlier instruction to wait for that run.

- Cloudflare records `scriptThrewException` at `2026-10-16T13:00:45Z`, with 50 subrequests. October 14 and October 15 succeeded.
- The schedule remains `0 13 * * *`. The public summary remains `2026-10-15T13:00:24.091Z`, with ledger source `no_stripe_key`.
- The deployed source lists up to 100 Stripe sessions, then retrieves each session separately before writing the summary.
- Subrequest exhaustion is the leading diagnosis. The observed count matches the [Workers Free limit](https://developers.cloudflare.com/workers/platform/limits/#subrequests), but the exact exception text is unavailable.
- Worker logs were not enabled. The historical log query returned no events.
- A source repair replaces individual requests with Stripe list expansion. It preserves the existing 100-session bound and truncation warning.
- All 15 existing tests pass. A new read-only HTTP E2E check detects the stale production summary. The repair is not deployed or verified end to end.

Deployment requires the approval tracked in [issue #23](https://github.com/laqaer/almost-lore/issues/23). This heartbeat prohibits a separate infrastructure deployment.
No secrets, DNS, schedules, payment settings, or infrastructure were changed. No checkout session or charge was created.
Current sales remain unknown. E2 retains its 2026-11-14 evaluation date.
E1 reaches its original 21-day deadline at 2026-10-17 05:22 UTC. This check occurred before that deadline.

## Checkout verification, 2026-10-16

This verification supersedes conflicting checkout statements below. Earlier observations remain as historical evidence.

- By 03:46 UTC, the rendered `/dossier` page showed "Pay $9 and continue to checkout".
- `/api/status` reported `stripeConfigured`, `stripeLive`, `webhookConfigured`, and `dossierStored` as true. It reported `paused` false.
- E2 is open. Use 2026-10-15 as the conservative start date and 2026-11-14 as the evaluation date.
- The exact activation time is unverified. The first browser confirmation occurred on October 15 Pacific time, which was October 16 UTC.
- The latest summary remains the cron at `2026-10-15T13:00:24.091Z`. Its ledger reports `no_stripe_key`; its zeros do not establish current sales.
- This pass created no checkout session or charge. Payment completion, webhook delivery, and paid download delivery remain unverified.
- An owner test purchase is a payment check, not E2 demand evidence or customer revenue. The existing owner task is [issue #22](https://github.com/laqaer/almost-lore/issues/22).

Check the next scheduled reconciliation after 2026-10-16 at 13:00 UTC. Do not diagnose the earlier summary as a failure before that check.
Keep E1's original metric and 2026-10-17 deadline unchanged. Do not add story volume while indexing measurement remains blocked.

## Current verification, 2026-10-03

This verification supersedes conflicting status statements below. Earlier observations remain as historical evidence.
A canonical URL identifies the preferred address for a page.

- All 23 sitemap pages returned HTTP 200. Each page allowed indexing and declared its matching canonical URL.
- All 14 sitemap images returned HTTP 200 with an image content type.
- The RSS feed at `/feed.xml` linked to all 14 stories in the sitemap.
- The sitemap excluded the checkout delivery page, `/dossier/thanks`.
- Main includes the redesign at `e81058b` and the IndexNow exclusion at `6609ffe`.
- These checks confirm crawl readiness. They do not confirm search-engine indexing.
- The latest observed worker cron ran at `2026-10-02T13:01:33.260Z`. Both monitored pages returned HTTP 200.
- Stripe and its webhook remain unconfigured. The paid experiment has not started.

Keep the indexing experiment deadline at 2026-10-17. Evaluate its original success metric at that deadline.
Do not repeat this crawl check without a content change, deployment change, or reported failure.

## Offer

Free essays of public-record historical near-misses, published at https://almostlore.com by Laqaer.

Paid offer: the Poyais working file costs $9 once. It includes Clavel's loan table and an explicit list of figures we will not adopt. The intended buyer is a reader, writer, or teacher who wants the footnote version. The channels are the essay page and organic search. Fulfillment uses a Worker request. The file body is in Cloudflare KV key `product:poyais-working-file:v1`, not in this public git repo.

## What is true

- Production is Vercel deployment `dpl_5pc6yD7MmWHv6VqGkC4yFa3ZdHLR`, commit `d67eba1`, ready after the merge. The Pig War URL returned 200 at 2026-09-26T05:22:00Z. Existing essays checked after that deploy (Fashoda, Poyais) also returned 200.
- Worker `almost-lore-ops` was published at 2026-09-26T05:10:04Z (etag `5726971306d2e6a64f7efdc1290422058513cea9f5ab2e9dfa1ebd2db9ac6fa4`). KV id `3afda249787643dd9e7483b316c03619`.
- `GET /status` at 05:15 UTC: `stripeConfigured` false, `dossierStored` true, version `2026-09-26`, 9494 bytes, `spendCapUsd` 0, paused false.
- `POST /checkout` without a Stripe key returned 503 “Checkout is not open” and created no charge. While paused, the same post returned 503 “Checkout paused”.
- One unattended cron fire was observed: `latestSummary.at` `2026-09-26T05:13:45.407Z`, `source` `cron`, homepage 200, Pig War 404, ledger `no_stripe_key` and `liveCashCents` 0. That used a one-minute probe schedule. At 05:16:11 UTC the schedule was replaced with `0 13 * * *`. The daily schedule is configured and has not fired yet.
- A manual `POST /ops/run` at 2026-09-26T05:35:58Z overwrote that day’s summary after production was live: Pig War 200, homepage 200, `liveCashCents` 0. That run is manual, not a second unattended fire. The next unattended run is the 13:00 UTC cron.
- Support storage was exercised, then the operator test note was deleted. It is not an open customer request.
- No accounts, no ads, no affiliate IDs, no newsletter.
- `hello@almostlore.com` has no MX. The support form is the working contact path.
- Card checkout is closed until `STRIPE_SECRET_KEY` is present on the worker. After the deploy, headless Chrome’s settled DOM on `/dossier` contained “Card checkout is not connected yet” and did not contain “Pay $9 and continue to checkout”. `POST https://almostlore.com/api/checkout` returned 503 “Checkout is not open”. `/api/status` on the production domain matches the worker. `/support` posts through that rewrite; the operator test note was removed. `/terms` states the $9 price and the 14-day refund.
- Discretionary spend authorized for this mandate: $0. Stripe MCP authentication was attempted and timed out. No secret was invented.

## Runtime

Worker `almost-lore-ops` on the Laqaer Products Cloudflare account.

- `GET /status` — owner-visible health, ledger, whether Stripe and the file are present.
- `GET /health` — liveness.
- Cron `0 13 * * *` UTC — probes the homepage and the Pig War URL, reconciles Stripe if a key exists, writes `summary:YYYY-MM-DD`. Same-day runs overwrite that key. No customer email is sent.
- Pause: `POST /ops/pause` with `Authorization: Bearer` the ops token. Resume: `POST /ops/resume`.
- Stop without the token: Cloudflare dashboard → Workers & Pages → `almost-lore-ops` → delete the cron or the script. Account `de80edcd32893f7153e5b793ad8317f9`.

States to keep distinct: one probe cron has fired unattended. The daily 13:00 UTC cron is configured, not yet observed. A manual `/ops/run` is not an unattended run. This is not a claim that the business runs 24/7.

## Next action

IndexNow maintenance, 2026-09-30: removed `/dossier/thanks` from the submission list because the checkout delivery page declares `noindex`. Verified the dry-run payload retains 23 public URLs, including all 14 essays, and omits the delivery page. No live submission was made; this is not evidence of indexing or revenue.

Follow issue #23 for the reconciliation repair and deployment approval. Do not treat the stale summary as current sales evidence.
After an authorized deployment, verify a fresh Stripe-backed summary and the next unattended cron result.
E2 remains open, with evaluation on 2026-11-14. Evaluate E1 at its original deadline, 2026-10-17 05:22 UTC.
Sales tax configuration remains unverified.
