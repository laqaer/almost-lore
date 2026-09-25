#!/usr/bin/env node
/**
 * Verify every source URL in content/claims.json.
 *   NODE_USE_ENV_PROXY=1 node scripts/check-links.mjs
 * Wikipedia links are checked in batches through the MediaWiki API (missing pages fail);
 * other links get a GET. 401/403/429 count as "blocked" (unverifiable here), not failures.
 */
import { readFileSync } from "node:fs";

const claims = JSON.parse(readFileSync(new URL("../content/claims.json", import.meta.url)));
const UA = "AlmostLoreBot/1.0 (https://almostlore.com; hello@almostlore.com)";
const wiki = new Map();
const other = new Map();
for (const c of claims) {
  for (const s of c.sources) {
    const m = s.url.match(/^https:\/\/en\.wikipedia\.org\/wiki\/(.+)$/);
    if (m) wiki.set(decodeURIComponent(m[1]).replace(/_/g, " "), [...(wiki.get(decodeURIComponent(m[1]).replace(/_/g, " ")) ?? []), c.id]);
    else other.set(s.url, [...(other.get(s.url) ?? []), c.id]);
  }
}

/** The shared egress IP gets rate-limited by Wikimedia; back off and retry. */
async function politeJson(url, attempt = 0) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    if (attempt >= 6) throw new Error(`rate-limited: ${text.slice(0, 60)}`);
    await new Promise((r) => setTimeout(r, 5000 * 2 ** attempt));
    return politeJson(url, attempt + 1);
  }
}

let failures = 0;
const titles = [...wiki.keys()];
for (let i = 0; i < titles.length; i += 40) {
  const batch = titles.slice(i, i + 40);
  const api = new URL("https://en.wikipedia.org/w/api.php");
  api.search = new URLSearchParams({ action: "query", titles: batch.join("|"), redirects: "1", format: "json" }).toString();
  const json = await politeJson(api);
  const normalized = new Map((json.query.normalized ?? []).map((n) => [n.to, n.from]));
  for (const page of Object.values(json.query.pages)) {
    if ("missing" in page || "invalid" in page) {
      const from = normalized.get(page.title) ?? page.title;
      failures++;
      console.log(`MISSING  wiki:${from}  (${(wiki.get(from) ?? wiki.get(page.title) ?? []).join(", ")})`);
    }
  }
  await new Promise((r) => setTimeout(r, 3000));
}
console.log(`checked ${titles.length} Wikipedia titles`);

for (const [url, ids] of other) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if ([401, 403, 406, 429].includes(res.status)) console.log(`blocked  ${res.status} ${url}`);
    else if (!res.ok) {
      failures++;
      console.log(`FAIL     ${res.status} ${url} (${ids.join(", ")})`);
    }
  } catch (error) {
    // Network-level refusals (TLS, egress policy) can't be told apart from a dead host here.
    console.log(`unverified ${url} (${error.message}) — check by hand`);
  }
}
console.log(`checked ${other.size} other URLs; ${failures} failure(s)`);
if (failures) process.exitCode = 1;
