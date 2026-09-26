# Almost Lore — operating state

Updated: 2026-09-26

## Offer

Free essays of public-record historical near-misses, published at https://almostlore.com by Laqaer.

Paid offer, not yet collectible: the Poyais working file, $9 once, for readers who want Clavel’s loan table and an explicit list of figures we will not adopt. Buyer: a reader, writer, or teacher who already wants the footnote version. Channel: the essay page and organic search. Fulfillment cost after the file is stored: a Worker request. The file body is in Cloudflare KV key `product:poyais-working-file:v1`, not in this public git repo.

## What is true

- Production is the Vercel project `almost-lore`, static Next export, commit that was live at audit: `9de2c6e`.
- Six essays after this change, once deployed. Five were already public.
- No accounts, no ads, no affiliate IDs, no newsletter.
- `hello@almostlore.com` has no MX. The support form is the working contact path.
- Card checkout is closed until `STRIPE_SECRET_KEY` is present on the worker. The dossier page asks `/api/status` and hides the pay button when checkout is closed.
- Discretionary spend authorized for this mandate: $0.

## Runtime

Worker `almost-lore-ops` on the Laqaer Products Cloudflare account.

- `GET /status` — owner-visible health, ledger, whether Stripe and the file are present.
- `GET /health` — liveness.
- Cron `0 13 * * *` UTC — probes the homepage and the Pig War URL, reconciles Stripe if a key exists, writes `summary:YYYY-MM-DD`. Same-day runs overwrite that key. No customer email is sent.
- Pause: `POST /ops/pause` with `Authorization: Bearer` the ops token. Resume: `POST /ops/resume`.
- Stop without the token: Cloudflare dashboard → Workers & Pages → `almost-lore-ops` → delete the cron or the script. Account `de80edcd32893f7153e5b793ad8317f9`.

States to keep distinct: the cron is configured only after the deploy notes in `HANDOFF.md` say it was. A manual `/ops/run` is not an unattended run.

## Next action

Connect Stripe, then confirm `/api/status` reports `stripeConfigured: true` and the dossier page shows the $9 button. Until then, do not describe E2 as started. Watch E1 for indexing only if Search Console or a public result is actually visible.
