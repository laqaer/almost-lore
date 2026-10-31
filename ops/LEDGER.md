# Profit ledger

Mandate start: 2026-09-26. Currency: USD.

This file is the narrative ledger. It is not a processor export. Exclude test charges from customer revenue.

## Refund classification repair, 2026-10-31

The source repair reads refund amounts from the expanded Stripe Charge. PaymentIntent has no `amount_refunded` field.
An otherwise eligible live session with any refund increments `liveRefundedCount` and contributes zero to `livePaidCount` and `liveCashCents`.
This preserves the existing conservative policy. For partial refunds, the summary omits the retained balance.
Missing or invalid Charge evidence cannot qualify a session as paid. These totals remain provisional and do not establish net cash or profit.

The [audit record](../docs/audits/2026-10-31-refunds/README.md) separates local HTTP checks, source integration, and production acceptance.
The Worker requires a separate deployment. Historical production snapshots below do not verify this repair.

## Reconciliation Restored, 2026-10-19

The live summary now comes from Stripe. This record supersedes the stale-summary and pending-approval statements below.
[Issue #23 records successful scheduled acceptance](https://github.com/laqaer/almost-lore/issues/23#issuecomment-6250463123) and is closed.
This pass independently verified the public summary and passed `npm run test:e2e:ops` against production.

Snapshot: `2026-10-18T13:00:28.914Z`, source `cron`, ledger source `stripe_checkout_sessions`.

| Reported field | Value |
| --- | ---: |
| `livePaidCount` | 0 |
| `liveCashCents` | 0 |
| `liveRefundedCount` | 0 |
| `testPaidCount` | 0 |
| `truncated` | false |
| `fees` | `not_in_checkout_session` |
| `provisional` | true |

These values are a bounded session summary, not a complete processor balance or verified profit calculation.
Reconciliation reads one account-wide page of at most 100 sessions, then applies the product checks. Fees and refunds remain incomplete.
The summary does not report checkout starts or automatically exclude live owner purchases. Do not use it alone to declare E2 success.
This pass created no checkout session or charge and incurred no new discretionary spend.

## Reconciliation Failure, 2026-10-17

Cloudflare records an exception for the October 16 daily reconciliation, after 50 subrequests.
The public summary still predates live activation and reports `no_stripe_key`. Its zeros do not establish current sales or refunds.
The source repair awaits deployment approval in [issue #23](https://github.com/laqaer/almost-lore/issues/23).
Current cash, fees, refunds, and customer counts remain unverified. No charge or new discretionary spend occurred during this investigation.

## Verification, 2026-10-16

Stripe and its webhook now report as configured in live mode. The dossier page shows the pay button.
The latest summary is still the 2026-10-15 13:00 UTC cron, with ledger source `no_stripe_key`.
Current cash, refunds, fees, and customer counts remain unverified until a Stripe-backed reconciliation is available.
No checkout session or charge was created during this check.

The table and counts below retain the pre-activation record. They are not a current processor balance.
An owner test purchase is not customer revenue or E2 demand evidence, even in live mode.
Record any actual processing fees or refunds separately when evidence becomes available.

## Pre-Activation Record

| | Since mandate | Evidence |
| --- | ---: | --- |
| Cash collected | 0 | No Stripe account connected. No invoices. No bank feed in scope. |
| Refunds | 0 | None. |
| Processor fees | 0 | None. |
| Earned revenue | 0 | Nothing delivered for pay. |
| Acquisition spend | 0 | No ads. |
| Hosting, new | 0 | Vercel Hobby and Cloudflare Workers free tier. No new plan purchased. |
| Domain | unknown, pre-existing | almostlore.com already resolved to Vercel. Renewal cost was not visible in this audit. |
| AI / agent usage billed to the project | not visible | No project invoice in scope. Do not treat this session as $0 of owner Cursor cost if the owner is billed for the agent elsewhere. |
| Net operating profit | provisional 0 | Incomplete on domain renewal and any Cursor charges. No customer revenue. |

Outstanding obligations: none to customers. No prepaid orders. No subscriptions. One operator support note was written during verification and then removed; it is not a customer obligation.

Paying customers: 0. Retained customers: 0.

Worker reconciliation at 2026-09-26T05:13:45Z, source `cron`: `liveCashCents` 0, `livePaidCount` 0, `testPaidCount` 0, fees unavailable, provisional. A later manual reconcile at 05:35:58Z, after the essay was on production, still showed `liveCashCents` 0. No processor export exists. Production `POST /api/checkout` returned “not open” and created no charge. Sales tax is not configured for a future sale.
