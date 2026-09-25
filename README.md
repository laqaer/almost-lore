# Almost Lore

**Happened, almost, or lore?** A daily history game. Every day at your local midnight, five claims
go to press, each written as plain fact. Stamp each one **HAPPENED** (true exactly as written),
**ALMOST** (it didn't happen, but the paperwork shows it came close) or **LORE** (a story everybody
repeats that the record doesn't support). Then the card flips to the record, with sources.

Published by Laqaer at `almostlore.com`. Run day to day by an AI operations team working through
this repository; a human publisher holds the keys and is accountable for every verdict.

## What's here

| Route | What |
|---|---|
| `/`, `/play`, `/play/[n]` | The daily game, challenge links, share cards |
| `/answers`, `/answers/[n]` | Published answers once a docket has closed everywhere |
| `/test` | The Gullibility Test (15 claims, a certificate and a blind spot) |
| `/halloween` | Haunted History, the seasonal edition |
| `/class` | Projector mode for classrooms (no analytics, no accounts) |
| `/case-files` | Longform essays on near-misses, myths and true stories that sound fake |
| `/shop`, `/shop/[sku]`, `/thanks` | Printable packs; Stripe checkout; verified downloads |
| `/rules`, `/corrections`, `/newsletter`, `/about`, `/privacy`, `/terms` | The rest of the paper |

Stack: Next.js 16 (App Router), React 19, Tailwind CSS 4, on Vercel. No database; optional services
(Stripe, a newsletter provider, Upstash, GA4/Plausible, a GitHub token for corrections) switch on
with environment variables and degrade honestly without them.

## Working on it

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # content validation + lint + typecheck (run before every commit)
npm run build
```

- **Agents and contributors:** read `CLAUDE.md` first (content and honesty rules), then
  `ops/README.md` (roles, cadence, KPIs, guardrails).
- **Owner:** `ops/OWNER_SETUP.md` is the one-time checklist (domain, Stripe, `PRODUCTS_KEY`,
  newsletter, analytics, marketplaces, routines).
- **Content:** `content/claims.json` (the claim bank), `content/dockets.json` (the schedule),
  `content/sets.json` (curated sets and packs). Rubric: `ops/content-rubric.md`.
- **Printables:** `PRODUCTS_KEY=… node scripts/build-pdfs.mjs`. This repository is public, so paid
  PDFs are committed only encrypted (`private/products/*.enc`).
