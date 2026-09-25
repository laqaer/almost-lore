# Etsy listing pack

Etsy is where printable party games get found without Google. Three listings to start; the
product-maker keeps this file current and opens an `owner-action` issue when a listing needs
uploading or changing. The owner uploads (agents have no Etsy access).

**Files:** upload the US Letter *and* A4 PDFs for each listing (Etsy allows 5 files per digital
listing). The launch report attached them; to rebuild: `PRODUCTS_KEY=… node scripts/build-pdfs.mjs`.
**Images:** `ops/marketplace/previews/` (2000 px wide; first image is the thumbnail).
**Disclosure (keep in every description):** the last paragraph below. Etsy's creativity standards
ask sellers to be clear about how items are made; we are.
**Never:** name other games (see CLAUDE.md), claim sales/review counts we don't have, or run fake
"sale" countdowns. Etsy sale events are fine when the discount is real.

---

## 1. The Party Pack — $12

**Title (≤140):**
Printable History Party Game — Happened, Almost, or Lore? 54 Cards, Game Night, Trivia for Adults & Teens, Instant Download PDF

**Tags (13, ≤20 chars each):**
history game · printable game · party game · game night · trivia game · history gift ·
history teacher gift · family game night · adult party game · dinner party game ·
history buff gift · printable trivia · pdf game

**Category:** Paper & Party Supplies → Party Games (digital).

**Description:**
> Happened, almost, or lore? Every card is a history claim written as plain fact. Some happened
> exactly as written. Some almost happened — the offer was made, the vote was held, the order was
> signed. Some are stories everybody repeats that the record doesn't support. Stamp it, flip it,
> argue about it.
>
> WHAT YOU GET
> • 54 claim cards with the verdict and the record on the back (none of them appear in the free
>   daily game at almostlore.com)
> • 8 stamp sets so everyone can vote at once, plus a Reader card and 2 write-your-own cards
> • Four ways to play: Stamp Off, The Dad Test, Two Truths and a Lore, Draft Night
> • A host script for parties, team socials and video calls
> • An Answer Book with every record, the origin of every myth, and full source links
> • Score sheet
> • US Letter and A4 PDFs, print at home or at a copy shop
>
> Every verdict is sourced (two sources minimum) and checked by a separate fact-checker before it
> ships. Found an error? We fix it and update the file.
>
> 2–8 players (the Dad Test works for any number) · ages 12+ · 20–40 minutes
>
> This is a digital download. Nothing will be shipped.
>
> HOW IT'S MADE: Almost Lore is published by Laqaer. Claims are researched and drafted with AI
> tools and checked against named sources under a public rubric; a human publisher is
> accountable for every verdict. Card designs are original.

---

## 2. Haunted History: The Halloween Pack — $7 (list by 1 October; unlist 1 November)

**Title:** Printable Halloween Party Game for Adults — Haunted History Trivia: Happened, Almost, or Lore? Place Cards, Dinner Party Game PDF

**Tags:** halloween game · halloween party · halloween trivia · spooky trivia · adult halloween ·
dinner party game · halloween printable · place cards · party game · history game · witch trials ·
vampire · game night

**Description:**
> Witch trials, vampire panics and stolen coffins. 18 spooky-history claims: happened, almost, or
> lore? The truth is usually the scary part.
>
> WHAT YOU GET
> • 18 claim cards with the sourced answer on the back
> • 12 fold-over place cards: one claim at every seat to argue about between courses
> • The host's envelope: every seat's answer on one page
> • Rules for a 15-minute round, and an Answer Book with sources
> • US Letter and A4 PDFs
>
> Ten of the claims are also playable free at almostlore.com/halloween; eight are pack-only.
>
> This is a digital download. Nothing will be shipped.
>
> HOW IT'S MADE: (same paragraph as the Party Pack)

---

## 3. The Party Pack — Office Edition — $79

**Title:** Team Building History Trivia Game — Office Party Printable, Virtual Team Game, Happened Almost or Lore? Company License PDF

**Tags:** team building · office party game · virtual team game · work party game ·
team trivia · holiday party game · office game · corporate game · icebreaker game ·
zoom game · history trivia · printable game · work event

**Description:** Party Pack description, then:
> LICENCE: one organisation, unlimited internal events (in person or on video). Includes the host
> script for running rounds with teams of 3–6. A receipt is issued for expenses. Not for resale or
> public ticketed events.

---

## Pricing and promotion rules
- Prices match `lib/products.ts`. Changing a price needs the owner (see ops/README.md guardrails).
- Etsy Ads: start at $1–2/day on the Party Pack only after 5 organic sales; the growth-analyst
  reports ROAS monthly and kills ads below 1.5×.
- Reply to every buyer message within 24 hours (owner) — agents draft replies on request.
