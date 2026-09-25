# Almost Lore — agent handbook

Almost Lore (almostlore.com) is a daily history game: five claims a day, each stamped
**HAPPENED**, **ALMOST** or **LORE**, then revealed with a sourced record. It is run by an AI
operations team (see `ops/README.md`) for the publisher, Laqaer. Read `ops/README.md` before any
ops task; it defines roles, cadence, KPIs and guardrails.

## Stack
- Next.js 16 (App Router) + React 19 + Tailwind CSS 4, deployed on Vercel. **Next 16 differs from
  older versions** — read `node_modules/next/dist/docs/` before using an unfamiliar API.
- No database. Optional env-gated services: Stripe (checkout), a newsletter provider, Upstash
  (aggregate stats), GA4/Plausible, a GitHub token (corrections). Everything degrades honestly
  when a key is missing: buttons become "notify me", stats hide. Never ship a broken buy button.

## Commands
- `npm run dev` · `npm run build`
- `npm run check` = content validation + lint + typecheck. Run it before every commit.
- `npm run validate -- --strict` for any PR that adds or edits claims.
- `NODE_USE_ENV_PROXY=1 node scripts/fetch-images.mjs` — pull public-domain images listed in
  `content/images.json` (licence-checked, credits written to `content/image-credits.json`).
- `PRODUCTS_KEY=… node scripts/build-pdfs.mjs` — regenerate the printable products from
  `content/` (Playwright + Chromium, no server). Paid PDFs land in `private/products/` in the clear
  (gitignored) plus encrypted `.enc` copies (committed); the free starter deck goes to `public/free/`.
- `node scripts/schedule-dockets.mjs` — append dockets from unscheduled claims (never edits past dockets).

## Where things live
- `content/claims.json` — the claim bank (source of truth). `content/dockets.json` — the schedule
  (docket n goes live on `EPOCH + n − 1`, see `lib/game/schedule.ts`). `content/sets.json` — curated
  sets (gullibility test, halloween, partyPack, classroom, starter).
- `lib/game/*` — game engine, scoring, storage, challenge links. `lib/game/content.ts` is
  server-only: future dockets must never reach a client bundle.
- `lib/stories/*` — Case Files (longform). `lib/products.ts` — catalogue and prices.
- `app/api/*` — docket, checkout, download (Stripe-verified), subscribe, stats, correction.
- `private/products/*.pdf.enc` — paid PDFs, AES-encrypted because **this repository is public**.
  Never commit a plaintext paid PDF, never put one in `/public`. `lib/product-files.ts` decrypts with
  `PRODUCTS_KEY` per Stripe-verified download; `lib/checkout.ts` hides the buy button when it can't.
- `ops/` — the operating manual, runbooks, launch kit, reports.

## Content rules (non-negotiable)
1. Every claim follows `ops/content-rubric.md`: nearest-true-variant gate, no definition-dependent
   verdicts, no disputed history, ≥2 sources with verbatim quotes, ≤110-character claim.
2. Paid packs promise exclusive cards: never schedule a `partyPack` claim in a docket
   (the validator enforces this).
3. Never edit a past docket's cards. Fix an error by correcting the claim text/record and logging it
   in `content/corrections.json` — the correction shows on /corrections.
4. House voice: `ops/house-style.md`. Wry, exact, never smug. Uncertainty stays visible.

## Honesty rules (non-negotiable)
- No invented numbers anywhere: no fake player counts, testimonials, reviews, ratings, "X people
  are playing", scarcity or countdown pressure that isn't real. Aggregate stats only when measured
  and above the minimum sample in `app/api/stats/route.ts`.
- The site says plainly that an AI editorial team drafts and checks content and a human publisher
  is accountable. Do not remove that.
- No trademarked game names in copy (Wordle, Balderdash, Trivial Pursuit, Kahoot, Jackbox…) and no
  imitation of NYT Games' grid or colours.

## Git
- Work on a branch, open a PR, let CI pass. Never push to `main`. Never rewrite published history.
