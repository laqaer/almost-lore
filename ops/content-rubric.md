# The Almost Lore content rubric

This is the public contract with players (the short version lives at `/rules`). Every claim in
`content/claims.json` must pass every gate below. When in doubt, cut. A cut claim costs nothing;
a wrong verdict gets screenshotted.

## The three verdicts

**HAPPENED** — the claim is literally true exactly as worded: every name, number, date, place and
qualifier. The best HAPPENED claims *sound* fake (the Emu War, the Boston molasses flood, Kodak's
13-month calendar).

**ALMOST** — the claim's *central event did not happen*, but concrete documented evidence shows it
came close: a formal offer or bid, a vote that failed, a signed-but-unratified treaty, an operation
launched then aborted, a machine or expedition that fell short, a standoff that never became a war,
a disaster narrowly averted, a design approved then scrapped. Wanting it, or proposing it vaguely,
is not enough. ALMOST is the brand's hero verdict: it should feel like a genuine near-miss.

**LORE** — a widely repeated belief, legend or misattributed quote that the record contradicts or
does not support, *and* with no documented near-occurrence (if it nearly happened, it is ALMOST).
Every LORE card carries an `origin` note: where the myth came from.

## Hard gates

1. **Nearest-true-variant gate.** Write the closest TRUE sentence to the claim (`nearestTrue`). If
   the only difference is a swapped detail — a name, nationality, number, date, place, or a
   qualifier like "first" or "only" — the claim is a wording trap: **CUT**. For ALMOST the difference
   must be whether the central event happened; for LORE, that the popular belief is false.
2. **No definition-dependent verdicts.** If a fair expert could argue another stamp depending on
   how a word is read ("subway", "war", "invented", "first"), **CUT**.
3. **No disputed history.** If serious historians meaningfully disagree on the core fact, **CUT**.
4. **Sources.** At least two, each with a verbatim supporting quote, at least one actually opened
   during research. Prefer Wikipedia plus a primary, institutional, scholarly or major-outlet source.
   Listicles never count. For LORE, one source must explain the myth's origin.
5. **People and harm.** No claims about living private individuals. Never mock victims of
   atrocities, slavery, genocide or recent mass-casualty events. `solemn: true` for any claim
   involving deaths (no joke ranks or celebratory effects on those cards). `schoolSafe: false` for
   sexual content, graphic violence or drugs.
6. **Claim text.** ≤ 110 characters, one declarative sentence, no hedges ("allegedly",
   "reportedly") and no giveaways ("almost", "nearly", "myth", "legend"). Enough context to judge.
7. **Record.** 2–3 sentences, ≤ 65 words: what actually happened, one vivid detail, never a repeat
   of the claim. ALMOST says how close it came and what stopped it; LORE says what is true instead.

## The gauntlet (how a claim earns its place)

1. **Writer** drafts with web research and verbatim quotes.
2. **Adversarial fact-checker** (separate session) tries to refute each verdict, re-opens sources,
   applies the gates, and returns keep / fix / cut.
3. **Fairness & fun judge** scores fairness (only one defensible stamp), fun (the "no way!" factor)
   and telegraphing (is the verdict obvious from the wording?). Ship only fairness ≥ 4; prefer
   fun ≥ 3 and telegraph ≤ 3.
4. **CI** — `npm run validate -- --strict`.
5. **Two-key rule.** Claims are scheduled at least 7 days ahead, and a *different* session re-reads
   each week's dockets before they go live (the Monday docket run checks the week after next).

## Docket composition

- Five cards; card five is **the trap** (hardest, most counter-intuitive).
- No fixed verdict quota per docket (players must not be able to count their way to an answer),
  but every docket should contain at least one ALMOST, never five of one verdict, and each week
  should land near a third of each verdict.
- Mix eras, regions and topics within a docket. Anniversary dockets (a claim on its real date) are
  encouraged.
- Track per-verdict accuracy in the growth report; if players get one verdict right more than ~75%
  of the time, the writers are telegraphing it: recalibrate.
