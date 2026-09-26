# Handoff

Another agent can restart from `ops/STATE.md`, `ops/LEDGER.md`, and `ops/EXPERIMENTS.md`. Chat is not the ledger.

## Shipped in the working-file change

- Essay `/stories/pig-war-san-juan`.
- Pages `/dossier`, `/dossier/thanks`, `/support`, `/terms`.
- Privacy, about, now, footer, and the funding note updated so they match a free archive plus one closed checkout.
- Worker source in `workers/ops/`. Billing rules are in `policy.js` and covered by `npm test`.
- Vercel rewrite `/api/*` → `https://almost-lore-ops.laqaer-products.workers.dev/*`.

## Not in git

- The working-file HTML. Public repo. KV key `product:poyais-working-file:v1`. Metadata key `product:poyais-working-file:meta`.
- `OPS_TOKEN`, Stripe keys, webhook secret.

## Observed on 2026-09-26, before this branch was on production

- Worker upload succeeded at 05:10:04Z. `GET /health` returned `ok: true`.
- `GET /status`: file stored, Stripe false, spend cap 0.
- `POST /checkout` → 503, text “Checkout is not open”. Paused checkout → 503, “Checkout paused”, then resumed.
- `POST /stripe/webhook` → 503 while the signing secret is unset. Duplicate-delivery behavior is not live-verified until that secret exists.
- `POST /ops/run` without the token → 401. Two authorized manual runs overwrote `summary:2026-09-26`.
- Unattended: Cloudflare invoked the scheduled handler at 05:13:45Z (`source: cron`) without a manual `/ops/run` at that time. Homepage probe 200. Pig War probe 404.
- At 05:16:11Z the schedule was set to `0 13 * * *` UTC. Staging KV copies of the worker source and the dossier were deleted. The product keys remain.
- The ops token is a Worker secret named `OPS_TOKEN`. It is not in git. Stop path without it: Cloudflare dashboard → Workers → `almost-lore-ops`.

## Still to verify after production

1. `https://almostlore.com/stories/pig-war-san-juan` returns 200. That starts E1. Record the timestamp in `EXPERIMENTS.md`.
2. `/dossier` shows no pay button. `/api/status` through the Vercel rewrite matches the worker.
3. `/support` and `/terms` render. A real customer note, if one arrives, stays in KV until handled.

## When Stripe is connected

Put the secret on the worker, not in git. Use a webhook signing secret on `POST /stripe/webhook`. Run one test-mode purchase and confirm the download works and the ledger’s `testPaidCount` moves while `liveCashCents` stays 0. Do not count that purchase as demand. Then a live key is what turns the button on for real cards. Refunds are requested on `/support` and issued in Stripe. The download function refuses a session with `amount_refunded > 0`.
