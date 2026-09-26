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

## Verify a deploy

1. `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`.
2. Production: homepage, the Pig War URL, `/dossier` (pay button absent while Stripe is unset), `/support`.
3. `GET https://almost-lore-ops.laqaer-products.workers.dev/status` shows the file stored and Stripe false until it is connected.
4. `POST /api/checkout` while Stripe is unset returns the “not open” page and creates no charge.

## When Stripe is connected

Put the secret on the worker, not in git. Use a webhook signing secret on `POST /stripe/webhook`. Run one test-mode purchase and confirm the download works and the ledger’s `testPaidCount` moves while `liveCashCents` stays 0. Do not count that purchase as demand. Then a live key is what turns the button on for real cards. Refunds are requested on `/support` and issued in Stripe. The download function refuses a session with `amount_refunded > 0`.
