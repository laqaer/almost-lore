# Refund evidence audit

The download guard read `amount_refunded` from PaymentIntent. Stripe defines that field on Charge.
The existing fixtures copied the incorrect shape, so their passing results did not establish refund refusal.
The owner authorized fixture correction and local repair on October 31.
See [issue #22](https://github.com/laqaer/almost-lore/issues/22#issuecomment-6539652801).

## Contract and repair

Retrieve a session with `payment_intent.latest_charge` expanded. List sessions with `data.payment_intent.latest_charge` expanded.
Read the refund amount from that Charge. Reject full and partial refunds, and reject missing or invalid Charge evidence.
Keep the existing product, price, mode, and payment checks.

The ledger keeps its existing conservative classification. Any refund excludes the session from paid counts and paid cash.
For partial refunds, the remaining balance is omitted. The summary is provisional, not a processor balance or profit calculation.
The account-wide 100-session limit, omitted fees, and manual owner-purchase exclusion remain.

Primary provider contracts:

- [Charge refund fields](https://docs.stripe.com/api/charges/object).
- [PaymentIntent latest Charge](https://docs.stripe.com/api/payment_intents/object).
- [Nested and list expansion](https://docs.stripe.com/expand).

## Verification boundary

The local harness runs the production Worker in Miniflare and sends HTTP requests to its public routes.
It provisions a synthetic dossier through the runtime's KV API. Provider responses contain synthetic session and Charge data.
The provider fixture follows requested expansions. Unmatched outbound requests are blocked.
No test imports a production function or creates a real Checkout Session.

Run `npm test` for retained native cases. Run `npm run test:e2e:refunds` for download and persisted reconciliation behavior.
The PR's static-export job also runs the local refund suite, lint, typecheck, build, and desktop/mobile browser checks.
The [receipt](receipt.json) binds the source hashes, commands, logs, and independent review.
The baseline had three intended failures and one pass. The repair passes all four HTTP cases and all 15 retained native cases.
Lint, typecheck, build, all 12 browser cases, and the static bundle dry run pass. Hosted checks and integration remain pending in this receipt.

## Delivery boundary

This task ends at reviewed source integration. The ops Worker deploys separately from the website.
No production Worker deployment, live purchase, refund, or payment acceptance is included.
The owner purchase in issue #22 remains deferred. [Issue #32](https://github.com/laqaer/almost-lore/issues/32) owns scheduled-summary evidence.
The original E1 result and November 14 E2 evaluation date remain unchanged.

All existing test cases remain. This repair corrects fixtures and adds HTTP coverage; it does not establish that other audit findings are resolved.
Model, agent compute, and CI costs are unknown. No discretionary purchase was made.
