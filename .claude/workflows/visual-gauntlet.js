export const meta = {
  name: 'visual-gauntlet',
  description: 'Screenshot key pages at mobile and desktop, have visual judges critique them, fix, and repeat until they pass',
  whenToUse: 'After UI changes or before a launch. args: { base: "http://localhost:3000", pages: ["/", "/play"], rounds: 2 }',
  phases: [{ title: 'Shoot' }, { title: 'Judge' }, { title: 'Fix' }],
}

const base = (args && args.base) || 'http://localhost:3000'
const pages = (args && args.pages) || ['/', '/play', '/answers', '/case-files', '/shop', '/test', '/halloween']
const rounds = (args && args.rounds) || 2
const VERDICT = { type: 'object', properties: { pass: { type: 'boolean' }, score: { type: 'number' }, issues: { type: 'array', items: { type: 'object', properties: { page: { type: 'string' }, severity: { type: 'string', enum: ['blocker', 'major', 'minor'] }, issue: { type: 'string' }, fix: { type: 'string' } }, required: ['page', 'severity', 'issue', 'fix'] } } }, required: ['pass', 'score', 'issues'] }

for (let round = 1; round <= rounds; round++) {
  phase('Shoot')
  const shots = await agent(`Make sure the app is running at ${base} (start it with npm run build && npm run start in the background if not). With Playwright (Chromium preinstalled; use proxy { server: process.env.HTTPS_PROXY } only for external URLs) take full-page screenshots of these pages at 390x844 and 1440x900 into /tmp/visual-gauntlet/round-${round}/: ${pages.join(', ')}. For /play, also stamp all cards to reach the ledger and screenshot it. Return the list of PNG paths.`, { label: `shoot:${round}`, phase: 'Shoot' })
  phase('Judge')
  const judges = await parallel(['art director (craft, typography, consistency with app/globals.css tokens)', 'product designer (clarity, tap targets, mobile, conversion)', 'accessibility reviewer (contrast, focus, reduced motion, alt text)'].map(lens => () =>
    agent(`You are a harsh ${lens}. Look at EVERY screenshot listed (Read tool) and list concrete issues with fixes. pass=true only if no blocker/major issues remain.

${shots}`, { label: `judge:${lens.split(' ')[0]}`, phase: 'Judge', schema: VERDICT })))
  const issues = judges.filter(Boolean).flatMap(j => j.issues).filter(i => i.severity !== 'minor')
  log(`round ${round}: ${issues.length} blocker/major issues`)
  if (!issues.length) return { round, pass: true }
  phase('Fix')
  await agent(`Fix these UI issues in the Almost Lore codebase, keeping the design system in app/globals.css. Run npm run check afterwards.

${JSON.stringify(issues, null, 1)}`, { label: `fix:${round}`, phase: 'Fix' })
}
return { pass: false, note: 'rounds exhausted; review remaining issues manually' }
