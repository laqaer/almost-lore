# Almost Lore - 30-day monetization plan

Window: 2026-09-28 to 2026-10-27. Owner: editorial + monetization. Discretionary spend: **$0**.
Grounded in the repo and `ops/STATE.md` on 2026-09-27. No outreach has been sent; this is the plan.

## Ground truth

| Lever | State on 2026-09-27 | Evidence |
| --- | --- | --- |
| $9 Poyais working file | Page and file exist, **checkout closed** | Worker `/status`: `stripeConfigured` false, `webhookConfigured` false, `dossierStored` true. `POST /api/checkout` returns 503 "Checkout is not open". |
| Display ads | **Not serving today**, gated on accounts and consent | `lib/ads.ts` needs `NEXT_PUBLIC_ADS_ENABLED=true` plus a valid `ca-pub-...` (16 digits), a 10-digit slot, **and** the source constant `CONSENT_PLATFORM_INSTALLED`, currently `false`. Env vars are unset. `app/ads.txt/route.ts` is comment-only until a valid publisher ID is set; once only `NEXT_PUBLIC_ADS_PUBLISHER_ID` is supplied it already lists `google.com, <pub-...>, DIRECT, f08c47fec0942fa0`, even while ads stay disabled. |
| Affiliate | **No program joined** | No affiliate account, no tracking IDs, no affiliate links in code. |
| Reader contact | Support form only | `hello@almostlore.com` has no MX. `/support` stores notes in the ops Worker KV. |
| Spend | **$0** | `ops/LEDGER.md`. Stripe MCP auth timed out earlier; no key was invented. |
| SEO tooling | OpenSEO connected, **0 credits**, tools not exposed this session | `ops/INTEGRATIONS.md`. Backlink research below was done with direct page fetches, not OpenSEO. |
| Redesign | **Local only** | Branch `codex/overhaul` is uncommitted. Production was not changed in this task. Do not describe the redesign as live. |

## Where to start

The fastest existing offer is the **$9 dossier**: the page and the file already exist, so Stripe is the only missing piece. Ads and affiliate are not impossible in this window; their timing depends on account approvals, a certified consent platform, and real traffic, not on effort. Start those applications and the free CMP setup in parallel in Week 1, and keep expectations tied to approvals rather than to a date.

## Week 1 - 09-28 to 10-04: unblock the checkout

- Owner: create/connect Stripe, then put `STRIPE_SECRET_KEY` and the webhook signing secret on Worker `almost-lore-ops`. Never in git.
- Run one test-mode purchase: confirm the download works, `testPaidCount` moves, `liveCashCents` stays 0. A test purchase is not demand.
- Switch to live keys, then confirm `/dossier` shows the $9 button and `/api/status` reports `stripeConfigured: true`.
- Connect Google Search Console (verify the property first) and submit `sitemap.xml`.
- Deploy the overhaul branch to production, then run `npm run indexnow`.
- In parallel, start the things that gate the other two levers: an AdSense account for a real publisher ID, a free Google-certified CMP, and any book-affiliate program application. None costs money; all take review time.
- Done when: a real card can start a $9 Checkout session and `/api/status` agrees.

## Week 2 - 10-05 to 10-11: make the one paid path whole

- Walk the refund loop end to end: `/support` note, Stripe refund, then the download refuses a refunded session.
- Confirm `/dossier/thanks` and the delivery link survive the redesign.
- Verify the Poyais essay still links to `/dossier`.
- Watch the daily 13:00 UTC cron on `/api/status`; keep spend at $0.
- Done when: one owner test-mode purchase and one refund both complete without a manual data fix.

## Week 3 - 10-12 to 10-18: earn editorial links

Work the six prospects in the table below. **No paid placements, no link swaps.** Send outreach only when you are ready; this plan sends nothing.

- 2026-10-17 is E1's evaluation date: is `https://almostlore.com/stories/pig-war-san-juan` indexed or in a Google result?

## Week 4 - 10-19 to 10-27: decide, don't drift

- E1: record indexed or not. If not indexed, fix titles, internal links, or Search Console access before adding volume.
- E2: count live checkout sessions started. E2's 30-day window starts the day checkout opens, so it may run into November. Do not count closed days.
- Decide: keep the $9 file, re-price it, or change the audience. Separate no-traffic from no-conversion: zero sessions started means the offer was never seen, so fix discovery first; sessions that start but do not finish point at price, audience, or the artifact.

## Backlink prospects

Contact details below were read from the pages named in the Contact column; every row returned HTTP 200 when fetched on 2026-09-27. Nothing was sent.

| Prospect | Contact (verified) | Story angle | Priority |
| --- | --- | --- | --- |
| [The Public Domain Review](https://publicdomainreview.org/about/) | `submissions@publicdomainreview.org` (read on `/about/submissions/`) | A source-first piece on Poyais or Darien built on public-domain material, the same route our Poyais banknote credit comes from. | High |
| [HistoryLink.org](https://www.historylink.org/) | Site footer / search contact (no `/Contact` page; it 404s) | Our Pig War essay draws on HistoryLink's San Juan Island entry; offer it as further reading for the "only casualty was a pig" line. | High |
| [We Are The Mutants](https://wearethemutants.com/contact/) | Contact page at `/contact/` | Pitch the 1870 Beach pneumatic subway or the 1950 San Francisco bacterial spray as a feature. | High |
| [The Long Run](https://ehs.org.uk/the-long-run/) (Economic History Society blog) | Contact page at [ehs.org.uk/contact](https://ehs.org.uk/contact/) | The 1822-23 Poyais issues as an early financial-bubble case for an econ-history audience. | Medium |
| [JSTOR Daily](https://daily.jstor.org/contact/) | Contact page at `/contact/` (no `/pitch-us/`; it 404s) | One story tied to scholarship they already index: Poyais loans or Fashoda diplomacy. | Medium |
| [The History Blog](https://www.thehistoryblog.com/) | Homepage contact form (no `/contact` or `/about`; both 404) | A reader-facing odd-history item, such as Poyais or the Beach subway. | Medium |

Supporting references (authoritative pages worth citing, not outreach targets): [NPS San Juan Island](https://www.nps.gov/sajh/index.htm), [FRUS](https://history.state.gov/historicaldocuments), the [Avalon Project's 1842 treaty text](https://avalon.law.yale.edu/19th_century/br-1842.asp), the [National Archives](https://www.archives.gov/milestone-documents/treaty-of-paris), [nycsubway.org on the Beach Pneumatic Transit](https://www.nycsubway.org/wiki/Beach_Pneumatic_Transit), [Wellcome Collection stories](https://wellcomecollection.org/stories), and the [International Bond & Share Society](https://www.scripophily.org/) for the Poyais loan bonds. Britannica, loc.gov, smithsonianmag.com, historians.org, atlasobscura.com, nycourts.gov, mainememory.net, si.edu, and cdc.gov answered 403 to server-side fetches, so no contact is claimed for them.

Angle rules:

- Earn the link with usable source material, not a swap and not a paid placement.
- Match the pitch to the publication's existing coverage; one personalized note beats a blast.
- Do not claim the redesign is live, and do not cite metrics we cannot show.
- At $0 spend and 0 OpenSEO credits this is a manual, low-volume list. Realistic wins are niche blogs and topic resource pages; large outlets rarely link out.

## Ads and affiliate

- **Ads: start the paperwork now, keep tags off.** Serving needs a real publisher ID **and** `CONSENT_PLATFORM_INSTALLED`. That constant is `false` on purpose, because an env string is not visitor consent. Turning ads on is one change that sets the ids, installs a certified CMP, and flips the constant. `ads.txt` already lists the seller once the publisher ID is set, before ads serve; it is comment-only only while no valid publisher ID exists.
- **Affiliate (books):** only after an account is approved **and** `/privacy` and `/about` disclose it. Until then any book links stay plain and unpaid.
- Both can be started in parallel because they cost no money; they simply cannot be switched on until the missing approvals exist. Judge them on approvals and traffic, not against a 30-day promise.

## Risks and open questions

- Stripe key handling is the single point of failure; a leaked key is worse than a closed checkout.
- Sales tax on a future $9 sale is not automated. Decide before volume arrives.
- Ads and affiliate readiness depends on approvals and traffic, so a slow month is not proof they will not work. Do not promise ad revenue before a publisher ID exists.

## Data limitations

No OpenSEO tools were available and the account has 0 credits, so no paid keyword, SERP, or backlink API data appears here. Prospect URLs and contact addresses were verified by fetching the pages directly on 2026-09-27. No traffic, revenue, or ranking numbers are stated, because none are measured.
