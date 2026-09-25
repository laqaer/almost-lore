import { site, siteUrl } from "@/lib/site";
import { stories } from "@/lib/stories";

export const dynamic = "force-static";

/** A plain-text map of the site for language models and AI search (llmstxt.org). */
export function GET() {
  const base = siteUrl();
  const body = `# ${site.name}

> ${site.description}

Almost Lore is a daily history game published by ${site.publisher}. Each claim is written as plain fact and has one of three verdicts:
- HAPPENED: true exactly as worded.
- ALMOST: the central event did not happen, but documented evidence shows it came close (an offer, a vote, an aborted operation, a standoff).
- LORE: a widely repeated belief the historical record contradicts.
Every verdict links its sources. Rules: ${base}/rules. Corrections log: ${base}/corrections.

## Play
- [Today's docket](${base}/play): five claims, new every day at local midnight.
- [Answers archive](${base}/answers): past dockets with verdicts, records and sources.
- [How gullible are you?](${base}/test): a 20-claim test with a per-verdict profile.

## Case Files (longform)
${stories.map((s) => `- [${s.title}](${base}/case-files/${s.slug}) — ${s.verdict.toUpperCase()}. ${s.dek}`).join("\n")}

## Products
- [Party Pack](${base}/shop/party-pack): print-and-play card game.
- [Classroom Pack](${base}/shop/classroom-pack): projector bell ringers with a sourced answer key.
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
