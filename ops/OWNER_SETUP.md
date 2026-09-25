# Owner setup (one time, about 60–90 minutes)

The site runs with zero keys: the game, archive, Case Files and test all work, and every buy
button honestly turns into "notify me". Each step below switches on a revenue or growth channel.
Set environment variables in **Vercel → Project → Settings → Environment Variables** (Production
and Preview), then redeploy.

## 0. Make the repository private (1 min) — **do this first**
GitHub → laqaer/almost-lore → Settings → General → Danger Zone → Change visibility → Private.
While it's public, anyone can read `content/claims.json` (every future answer and every Party Pack
card) and rebuild the paid PDFs with `scripts/build-pdfs.mjs`. Vercel, CI and the ops routines all
keep working on a private repo. Encrypting the PDFs protects the files, not the claims they're
built from. Treat the launch packs as partly exposed already (the branch was public for a while);
the product-maker's next volumes are safe once the repo is private.

## 1. Domain (5 min)
- Point `almostlore.com` at the Vercel project (Vercel → Domains). Add `www` → apex redirect.
- `NEXT_PUBLIC_SITE_URL=https://almostlore.com`

## 2. Take payments — Stripe (15 min) — **turns on revenue**
- Create/activate a Stripe account, then Developers → API keys → create a **restricted key** with
  *Checkout Sessions: write*, plus *PaymentIntents: read* and *Charges: read* (so a refund
  switches the download off). Production only accepts a live key (`rk_live_…`/`sk_live_…`). Use a test key first (`rk_test_…`), buy the Party Pack
  with card `4242 4242 4242 4242`, confirm `/thanks` shows the download, then switch to live.
- `STRIPE_SECRET_KEY=rk_live_…`
- `PRODUCTS_KEY=…` — the key that unlocks the encrypted PDFs in `private/products/*.enc` (your
  repository is public, so the paid files are committed encrypted). It was handed to you with the
  launch report; keep it in your password manager. Without it the site keeps the "notify me"
  button rather than sell a file it can't deliver. Add the same value as a secret in the Claude
  cloud environment so the product-maker can rebuild PDFs.
- Prices come from `lib/products.ts`; you do not need to create products in Stripe.
- Optional: turn on Stripe Tax and receipts emails in the dashboard.
- Alternative without Stripe: any hosted checkout that delivers the file itself (Gumroad, Lemon
  Squeezy, Payhip). Set `NEXT_PUBLIC_CHECKOUT_URL_PARTY_PACK`, `…_PARTY_PACK_OFFICE`,
  `…_CLASSROOM_PACK`, `…_CLASSROOM_DEPARTMENT`, `…_HALLOWEEN_PACK` to the product URLs and upload the
  PDFs there (the launch report attached them; or decrypt with `PRODUCTS_KEY` — see
  `lib/product-files.ts`).

## 3. Build the list — newsletter (10 min)
Pick one (Buttondown recommended: its API lets the ops team schedule the Sunday Docket).
- Buttondown: `BUTTONDOWN_API_KEY`
- beehiiv: `BEEHIIV_API_KEY` + `BEEHIIV_PUBLICATION_ID`
- Kit: `KIT_API_KEY` + `KIT_FORM_ID`
- Anything else: `NEWSLETTER_WEBHOOK_URL` (receives `{ email, source, tags }` JSON)
- In the provider, set the welcome email to include the free Starter Deck link:
  `https://almostlore.com/free/almost-lore-starter-deck.pdf`.

## 4. See what's working — analytics (15 min)
- Create a GA4 property → `NEXT_PUBLIC_GA_ID=G-…` (or Plausible: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=almostlore.com`).
- Google Search Console: add the domain property, submit `https://almostlore.com/sitemap.xml`.
- In OpenSEO, create an "Almost Lore" project for almostlore.com and connect GA4 + Search Console
  so the growth-analyst can read them. **Top up OpenSEO credits** (the account had ~229 left at
  handover; the team budgets ≤ 150/week).
- Classroom/projector mode never loads analytics.

## 5. Corrections desk (5 min)
- Create a fine-grained GitHub token for `laqaer/almost-lore` with *Issues: read and write*.
- `CORRECTIONS_GITHUB_TOKEN=github_pat_…` (optional `CORRECTIONS_GITHUB_REPO=owner/name`)
- Create labels `correction` and `owner-action` in the repo.

## 6. "% of players who got this right" (optional, 5 min)
- Vercel → Storage/Marketplace → Upstash Redis (free tier). It sets
  `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Percentages appear once a docket has
  25+ finishes.

## 7. Marketplaces — revenue this season without waiting for Google (20 min)
- Etsy: open a shop, create digital listings for the Party Pack ($12), Halloween Pack ($7) and
  Office Edition ($79) using `ops/marketplace/etsy.md`; attach the PDFs.
  Disclose AI-assisted creation per Etsy policy (the listing copy already does).
- Teachers Pay Teachers: seller account (Premium once sales justify it), list the Classroom Pack
  using `ops/marketplace/tpt.md`.

## 8. Repo hygiene (5 min)
- Protect `main`: require the CI check. Optionally allow auto-merge for PRs labelled
  `content-only` so the Monday docket PR can land without you.
- **Give the ops team its hands (2 min).** Five routines were created at handover — *Almost Lore ·
  daily clerk*, *· Monday docket desk*, *· Wednesday growth & search*, *· Friday product & letter*,
  *· monthly owner packet*. At claude.ai/code → Routines, open each and attach the **GitHub**
  connector (so runs can open PRs and issues); also attach **OpenSEO** to *Wednesday growth &
  search*. Until then, runs still work but reply with patches instead of opening PRs.
- Each routine does nothing until the launch PR is merged into `main`. To pause the whole team,
  commit an empty `ops/PAUSED` file to `main`; delete it to resume.

## 9. Launch day (30 min, see `ops/launch-kit.md`)
- Edition numbers count from `EPOCH` in `lib/game/schedule.ts` (currently 2026-09-25, so that day is
  No. 1). Launching later is fine: earlier editions simply appear in the archive. If you'd rather
  launch on "No. 1", ask the docket desk to move `EPOCH` to your launch date in the launch PR.
Post the drafted launch posts yourself (the team can't post): Show HN, r/WebGames, r/history-adjacent
communities that allow games, Product Hunt, a teacher community, and your own network. Space them
over two weeks; relaunch the Gullibility Test separately.

## Environment variable reference

| Variable | Enables |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | canonical URLs, OG images |
| `STRIPE_SECRET_KEY` | on-site checkout + verified downloads |
| `PRODUCTS_KEY` | decrypts the paid PDFs for download (needed with Stripe) |
| `NEXT_PUBLIC_CHECKOUT_URL_<SKU>` | hosted-checkout fallback per product |
| `BUTTONDOWN_API_KEY` / `BEEHIIV_*` / `KIT_*` / `NEWSLETTER_WEBHOOK_URL` | email signups |
| `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | analytics |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | aggregate % stats |
| `CORRECTIONS_GITHUB_TOKEN` (+ `CORRECTIONS_GITHUB_REPO`) | reader corrections → GitHub issues |
