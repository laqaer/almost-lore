# Almost Lore — operating state

Updated: 2026-09-26T05:16:11Z

## Offer

Free essays of public-record historical near-misses, published at https://almostlore.com by Laqaer.

Paid offer, not yet collectible: the Poyais working file, $9 once, for readers who want Clavel’s loan table and an explicit list of figures we will not adopt. Buyer: a reader, writer, or teacher who already wants the footnote version. Channel: the essay page and organic search. Fulfillment cost after the file is stored: a Worker request. The file body is in Cloudflare KV key `product:poyais-working-file:v1`, not in this public git repo.

## What is true

- Production at the audit was Vercel project `almost-lore`, static export, commit `9de2c6e`. The Pig War URL still returned 404 at 05:13 UTC, before this branch was on `main`.
- Worker `almost-lore-ops` was published at 2026-09-26T05:10:04Z (etag `5726971306d2e6a64f7efdc1290422058513cea9f5ab2e9dfa1ebd2db9ac6fa4`). KV id `3afda249787643dd9e7483b316c03619`.
- `GET /status` at 05:15 UTC: `stripeConfigured` false, `dossierStored` true, version `2026-09-26`, 9494 bytes, `spendCapUsd` 0, paused false.
- `POST /checkout` without a Stripe key returned 503 “Checkout is not open” and created no charge. While paused, the same post returned 503 “Checkout paused”.
- One unattended cron fire was observed: `latestSummary.at` `2026-09-26T05:13:45.407Z`, `source` `cron`, homepage 200, Pig War 404, ledger `no_stripe_key` and `liveCashCents` 0. That used a one-minute probe schedule. At 05:16:11 UTC the schedule was replaced with `0 13 * * *`. The daily schedule is configured and has not fired yet.
- A manual `POST /ops/run` is a different state. Two manual runs the same day overwrote one summary key. The later cron run overwrote that same key.
- Support storage was exercised, then the operator test note was deleted. It is not an open customer request.
- No accounts, no ads, no affiliate IDs, no newsletter.
- `hello@almostlore.com` has no MX. The support form is the working contact path.
- Card checkout is closed until `STRIPE_SECRET_KEY` is present on the worker. The dossier page asks `/api/status` and hides the pay button when checkout is closed.
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

Connect Stripe, then confirm `/api/status` reports `stripeConfigured: true` and the dossier page shows the $9 button. Until then, do not describe E2 as started. Watch E1 for indexing only if Search Console or a public result is actually visible.
