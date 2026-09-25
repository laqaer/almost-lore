# Almost Lore — operating manual

**Mission:** make the daily near-miss ritual that people play every morning, share in the group
chat, put on the classroom projector and buy for game night.
**North star:** weekly active players (WAP). **Money metric:** net revenue per week.

The company is run by scheduled Claude Code sessions (the "ops team") working through this repo.
The human owner (Laqaer) holds the keys: domain, Stripe, newsletter, marketplaces, and the merge
button. Anything that needs the owner's hands becomes a GitHub issue labelled `owner-action`.

---

## The team

Agent definitions live in `.claude/agents/`. Each routine starts one of these as the lead, and the
lead may call the others (or a saved workflow in `.claude/workflows/`).

| Agent | Owns | Primary outputs |
|---|---|---|
| `chief-of-staff` | Priorities, weekly plan, owner digest, kill/pivot calls | `ops/reports/YYYY-Www-plan.md`, owner-action issues |
| `docket-editor` | The daily game: claim supply, docket schedule, themes, two-key review | PR: new claims + dockets |
| `fact-checker` | Adversarial verification; the corrections desk | keep/fix/cut verdicts; `content/corrections.json` |
| `case-file-writer` | Longform Case Files targeted at real search demand | PR: `lib/stories/*.ts` |
| `growth-analyst` | Funnel, retention, experiments, revenue | `ops/reports/YYYY-Www-growth.md`, one experiment PR |
| `seo-editor` | Keyword research, seasonal pages, internal links, rank tracking | briefs, PRs, rank reports |
| `product-maker` | Paid packs, PDFs, marketplace listing packs | PR: packs; `ops/marketplace/*` |
| `newsletter-editor` | The Sunday Docket email | draft or scheduled send |
| `release-guardian` | CI health, smoke tests, visual QA, PR review | review comments, fix PRs |

## Cadence (UTC)

Each row is a scheduled routine at claude.ai/code → Routines (named "Almost Lore · …"). Every run
starts in a fresh session, works from `main`, and stops at once if `ops/PAUSED` exists on `main`.

| When | Routine | Lead | What happens |
|---|---|---|---|
| Daily 06:10 | **Clerk** | release-guardian | Site up? Today's and the next 14 dockets valid? Corrections issues triaged (fact-checker)? Build green on `main`? |
| Monday 07:05 | **Docket desk** | docket-editor | Keep ≥ 21 days of dockets scheduled: run the claim gauntlet, schedule, two-key review of the week after next, open PR. Chief-of-staff writes the weekly plan. |
| Wednesday 07:05 | **Growth & search** | growth-analyst + seo-editor | Metrics report, one experiment, one Case File or seasonal page shipped via PR. |
| Friday 07:05 | **Product & letter** | product-maker + newsletter-editor | Pack work (new volume, seasonal edition, marketplace packs); Sunday Docket drafted/scheduled. |
| 1st of month | **Owner packet** | chief-of-staff | One page: revenue by product, funnel, top 3 owner actions, kill/pivot status. |

## KPIs and targets (review every Wednesday)

| KPI | Definition (GA4 events via OpenSEO) | Launch target | Day-120 target |
|---|---|---|---|
| Daily plays | `game_start` users/day | 150 | 2,000 |
| Completion | `game_complete` / `game_start` | ≥ 80% | ≥ 85% |
| Share rate | `game_share` / `game_complete` | ≥ 8% | ≥ 12% |
| D7 return | GA4 cohort retention, week 1 | ≥ 12% | ≥ 20% |
| Email capture | `subscribe` / `game_complete` | ≥ 3% | ≥ 5% |
| Shop CTR | shop pageviews / sessions | ≥ 3% | ≥ 5% |
| Checkout conversion | purchases / `checkout_click` | ≥ 30% | ≥ 40% |
| Revenue | Stripe net / week | first sale | $500 / week |
| Docket buffer | days of scheduled dockets beyond today | ≥ 21 | ≥ 28 |
| Verdict calibration | % correct per verdict | each 40–75% | each 40–70% |

Numbers above are **targets**, not results. Reports state measured values only, with the date range.

## Kill / pivot rules

- **Day 45:** if D7 < 10% AND share rate < 5% AND paid orders < 20 → shift ops effort to packs
  (Party, Classroom, seasonal) on the site, Etsy and TPT; keep the daily game as the free demo.
- **Day 120:** if WAP < 1,000 and revenue < $250/week → chief-of-staff writes a pivot memo with the
  two strongest roadmap bets (see `ops/roadmap.md`) and asks the owner to choose.
- Any single experiment runs ≥ 14 days or ≥ 1,000 exposures before a call. One experiment at a time.

## Guardrails

1. **Honesty.** Never fabricate numbers, testimonials, reviews, ratings, scarcity, urgency or
   social proof. Never post as a human or pretend to be a customer. Aggregate stats only when
   measured and above the minimum sample.
2. **Accuracy.** Every claim through the gauntlet (`ops/content-rubric.md`). Corrections are public.
3. **Git.** Branch → PR → CI green → owner merges (or auto-merge if the owner enables it for
   content-only PRs). Never push to `main`. Never force-push shared branches.
4. **Money.** Never change prices, add products, or spend money without an approved
   `owner-action` issue. Propose price tests as issues.
5. **Budgets.** OpenSEO: ≤ 150 credits/week (check `whoami` first; when under 300, only
   `get_keyword_metrics` for specific lists, and file an owner-action issue for a top-up). Keep
   workflows under ~10 agents unless the owner asks for more.
6. **Privacy.** No student data, no accounts, no analytics in classroom/projector mode, no personal
   data in URLs or issues.
7. **Distribution.** The team cannot post on social media or forums. Draft posts in
   `ops/launch-kit.md` or an owner-action issue; the owner posts.
8. **Brand.** Protect the design system (`app/globals.css` tokens). Every new page gets a visual
   check (release-guardian screenshots at 390px and 1440px).

## Escalation

Open a GitHub issue labelled `owner-action` with: what is needed, why (the metric it moves), the
exact steps (links, values), and the deadline. Batch owner asks into the Monday plan when possible.

## Useful references
- `ops/OWNER_SETUP.md` — one-time setup (keys, domain, analytics).
- `ops/launch-kit.md` — launch posts and marketplace copy for the owner.
- `ops/roadmap.md` — product roadmap and bets.
- `ops/content-rubric.md`, `ops/house-style.md`.
