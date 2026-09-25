export const meta = {
  name: 'claim-gauntlet',
  description: 'Write HAPPENED/ALMOST/LORE claims by domain, adversarially fact-check them on the web, and score fairness/fun/telegraph',
  whenToUse: 'Weekly by docket-editor when the unscheduled claim pool is under 35, or to build a seasonal/pack set. args: { domains: [{ key, n, brief }] }',
  phases: [
    { title: 'Write', detail: 'domain writers draft sourced claims' },
    { title: 'Fact-check', detail: 'adversarial web verification + gates' },
    { title: 'Judge', detail: 'fairness, fun, telegraph' },
  ],
}

// args example:
// { "domains": [ { "key": "science", "n": 12, "brief": "Science & medicine near-misses; prefer ALMOST" } ] }
const DOMAINS = (args && args.domains) || []
if (!DOMAINS.length) throw new Error('Pass args.domains: [{ key, n, brief }]')

const RULES = `Read /home/user/almost-lore/ops/content-rubric.md (or ops/content-rubric.md in the repo root) and follow every gate exactly. Also read content/claims.json ids to avoid duplicates of existing claims. Do NOT call OpenSEO tools.`

const CLAIM = {
  type: 'object',
  properties: {
    id: { type: 'string' }, claim: { type: 'string' },
    verdict: { type: 'string', enum: ['happened', 'almost', 'lore'] },
    year: { type: 'string' }, yearSort: { type: 'number' },
    era: { type: 'string', enum: ['ancient', 'medieval', 'early-modern', '19th-century', '20th-century', '21st-century'] },
    region: { type: 'string' }, topic: { type: 'string' },
    record: { type: 'string' }, origin: { type: 'string' }, nearestTrue: { type: 'string' },
    sources: { type: 'array', minItems: 2, items: { type: 'object', properties: {
      title: { type: 'string' }, publisher: { type: 'string' }, url: { type: 'string' }, quote: { type: 'string' }, fetched: { type: 'boolean' } },
      required: ['title', 'publisher', 'url', 'quote', 'fetched'] } },
    difficulty: { type: 'number' }, schoolSafe: { type: 'boolean' }, solemn: { type: 'boolean' },
    tags: { type: 'array', items: { type: 'string' } }, storySlug: { type: 'string' },
  },
  required: ['id', 'claim', 'verdict', 'year', 'yearSort', 'era', 'region', 'topic', 'record', 'origin', 'nearestTrue', 'sources', 'difficulty', 'schoolSafe', 'solemn', 'tags', 'storySlug'],
}

const results = await pipeline(
  DOMAINS,
  d => agent(`You write claims for Almost Lore, a daily history game. ${RULES}
Write ${d.n} claims for: ${d.brief}
Aim for ~40% ALMOST, 30% HAPPENED, 30% LORE unless the brief says otherwise. Research every claim with WebSearch/WebFetch and copy verbatim quotes; mark fetched=true only for pages you opened. Fewer excellent claims beat more weak ones.`,
    { label: `write:${d.key}`, phase: 'Write', schema: { type: 'object', properties: { claims: { type: 'array', items: CLAIM } }, required: ['claims'] } }),
  (batch, d) => batch && batch.claims && batch.claims.length ? agent(`You are the ADVERSARIAL FACT-CHECKER for Almost Lore. ${RULES}
Default to skepticism. For each claim: try to refute the verdict with independent sources (WebSearch/WebFetch), open at least one cited URL and confirm the quote, apply the nearest-true-variant, definition-dependence and disputed-history gates, and check wording limits. Decide keep / fix (return the corrected full claim) / cut. When in doubt, cut.

CLAIMS:
${JSON.stringify(batch.claims, null, 1)}`, { label: `check:${d.key}`, phase: 'Fact-check', schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, decision: { type: 'string', enum: ['keep', 'fix', 'cut'] }, reason: { type: 'string' }, claim: CLAIM }, required: ['id', 'decision', 'reason'] } } }, required: ['results'] } })
    .then(chk => ({ batch, chk })) : null,
  (prev, d) => {
    if (!prev || !prev.chk) return null
    const byId = Object.fromEntries(prev.batch.claims.map(c => [c.id, c]))
    const survivors = prev.chk.results.filter(r => r.decision !== 'cut').map(r => (r.decision === 'fix' && r.claim) ? r.claim : byId[r.id]).filter(Boolean)
    const cuts = prev.chk.results.filter(r => r.decision === 'cut').map(r => ({ id: r.id, reason: r.reason }))
    if (!survivors.length) return { domain: d.key, survivors: [], cuts, scores: [] }
    return agent(`You are the FAIRNESS & FUN JUDGE for Almost Lore (verdicts HAPPENED / ALMOST / LORE; see ops/content-rubric.md). For each claim, as a sharp fair-minded player who was just told the answer, score fairness 1-5 (only one defensible stamp = 5), fun 1-5, telegraph 1-5 (how obvious from the wording), and suggest a rewrite only if it raises fairness or lowers telegraphing without breaking the gates. Use no tools. Be harsh.

${JSON.stringify(survivors.map(c => ({ id: c.id, claim: c.claim, verdict: c.verdict, record: c.record, origin: c.origin, nearestTrue: c.nearestTrue })), null, 1)}`,
      { label: `judge:${d.key}`, phase: 'Judge', schema: { type: 'object', properties: { scores: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, fairness: { type: 'number' }, fun: { type: 'number' }, telegraph: { type: 'number' }, rewrite: { type: 'string' }, note: { type: 'string' } }, required: ['id', 'fairness', 'fun', 'telegraph', 'rewrite', 'note'] } } }, required: ['scores'] } })
      .then(j => ({ domain: d.key, survivors, cuts, scores: j ? j.scores : [] }))
  },
)

// Hand back survivors with fairness ≥ 4 annotated with scores; the docket-editor merges them into content/claims.json.
const out = results.filter(Boolean)
const accepted = []
for (const r of out) {
  const s = Object.fromEntries((r.scores || []).map(x => [x.id, x]))
  for (const c of r.survivors) {
    const sc = s[c.id]
    if (!sc || sc.fairness < 4) continue
    const { nearestTrue, ...claim } = c
    accepted.push({ ...claim, scores: { fairness: sc.fairness, fun: sc.fun, telegraph: sc.telegraph }, _rewrite: sc.rewrite || undefined, _nearestTrue: nearestTrue })
  }
}
log(`accepted ${accepted.length} claims (fairness ≥ 4)`)
return { accepted, cuts: out.flatMap(r => r.cuts), lowFairness: out.flatMap(r => (r.scores || []).filter(x => x.fairness < 4)) }
