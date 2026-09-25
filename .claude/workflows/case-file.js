export const meta = {
  name: 'case-file',
  description: 'Research, write, adversarially fact-check and edit one Almost Lore Case File (longform essay)',
  whenToUse: 'When seo-editor briefs a new essay. args: { slug, topic, keyword, verdict, angle }',
  phases: [{ title: 'Write' }, { title: 'Check' }, { title: 'Edit' }],
}

const b = args || {}
if (!b.slug || !b.topic) throw new Error('Pass args: { slug, topic, keyword, verdict, angle }')

phase('Write')
const draft = await agent(`You are the case-file-writer for Almost Lore. Read .claude/agents/case-file-writer.md, ops/house-style.md and two existing essays in lib/stories/ to match the voice. Research "${b.topic}" with at least 5 sources (WebSearch/WebFetch; primary and scholarly where possible). Target search keyword: "${b.keyword || b.topic}". Verdict this essay argues: ${b.verdict || 'decide from the record'}. Angle: ${b.angle || 'the gap between the travelling hook and the record'}.
Write the complete TypeScript file content for lib/stories/${b.slug}.ts exporting a Story (see lib/stories/types.ts), 1,400–2,400 words. Return ONLY the file content, plus after a line "---SOURCES---" a list of the URLs you used.`, { label: 'write', phase: 'Write' })

phase('Check')
const check = await agent(`You are the adversarial fact-checker (read .claude/agents/fact-checker.md). Check every factual sentence in this draft essay against sources with WebSearch/WebFetch. List every error, overstatement, unsupported number, invented detail or disputed point presented as settled, each with the fix. Be exhaustive and skeptical.

${draft}`, { label: 'check', phase: 'Check' })

phase('Edit')
const final = await agent(`You are the Almost Lore editor. Apply EVERY fix below to the draft, keep the house style (ops/house-style.md), make sure the Story object type-checks against lib/stories/types.ts, then write it to lib/stories/${b.slug}.ts, register it in lib/stories/index.ts, and run \`npx tsc --noEmit\`. Report what you changed.

FACT-CHECK:
${check}

DRAFT:
${draft}`, { label: 'edit', phase: 'Edit' })

return { check, final }
