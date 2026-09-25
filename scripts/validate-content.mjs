#!/usr/bin/env node
/**
 * Content gate for the claim bank. Runs in CI and before every docket PR.
 *   node scripts/validate-content.mjs          → errors fail the build, warnings print
 *   node scripts/validate-content.mjs --strict → warnings fail too (use for new content)
 */
import { readFileSync } from "node:fs";

const strict = process.argv.includes("--strict");
const claims = JSON.parse(readFileSync(new URL("../content/claims.json", import.meta.url)));
const dockets = JSON.parse(readFileSync(new URL("../content/dockets.json", import.meta.url)));
const sets = JSON.parse(readFileSync(new URL("../content/sets.json", import.meta.url)));

const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

const VERDICTS = new Set(["happened", "almost", "lore"]);
const ERAS = new Set(["ancient", "medieval", "early-modern", "19th-century", "20th-century", "21st-century"]);
const GIVEAWAYS = /\b(almost|nearly|myth|legend(ary)?|supposedly|allegedly|reportedly|rumou?red|some say|apocryphal)\b/i;
const words = (s) => (s ?? "").trim().split(/\s+/).filter(Boolean).length;

const ids = new Set();
for (const c of claims) {
  const at = `claim ${c.id ?? "(no id)"}`;
  if (!c.id || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id)) err(`${at}: id must be kebab-case`);
  if (ids.has(c.id)) err(`${at}: duplicate id`);
  ids.add(c.id);
  if (!VERDICTS.has(c.verdict)) err(`${at}: bad verdict ${c.verdict}`);
  if (!ERAS.has(c.era)) err(`${at}: bad era ${c.era}`);
  if (!c.claim || c.claim.length > 120) err(`${at}: claim missing or over 120 chars (${c.claim?.length})`);
  else if (c.claim.length > 110) warn(`${at}: claim over 110 chars (${c.claim.length})`);
  if (GIVEAWAYS.test(c.claim ?? "")) err(`${at}: claim contains a giveaway/hedge word`);
  if (!c.record || words(c.record) < 12) err(`${at}: record missing or too short`);
  if (words(c.record) > 80) err(`${at}: record over 80 words (${words(c.record)})`);
  else if (words(c.record) > 65) warn(`${at}: record over 65 words (${words(c.record)})`);
  if (c.verdict === "lore" && !c.origin) warn(`${at}: LORE claim has no origin note`);
  if (!Array.isArray(c.sources) || c.sources.length === 0) err(`${at}: no sources`);
  else {
    if (c.sources.length < 2) warn(`${at}: only one source`);
    for (const s of c.sources) {
      if (!s.url || !/^https:\/\//.test(s.url)) err(`${at}: source url must be https (${s.url})`);
      if (!s.title || !s.publisher) err(`${at}: source needs title and publisher`);
    }
  }
  if (typeof c.yearSort !== "number") err(`${at}: yearSort must be a number`);
  if (![1, 2, 3].includes(c.difficulty)) err(`${at}: difficulty must be 1, 2 or 3`);
  if (typeof c.schoolSafe !== "boolean" || typeof c.solemn !== "boolean") err(`${at}: schoolSafe/solemn must be booleans`);
}

const used = new Map();
dockets.forEach((d, i) => {
  const at = `docket ${d.n}`;
  if (d.n !== i + 1) err(`${at}: dockets must be numbered 1..N in order (position ${i + 1})`);
  if (!Array.isArray(d.cards) || d.cards.length !== 5) err(`${at}: needs exactly 5 cards`);
  for (const id of d.cards ?? []) {
    if (!ids.has(id)) err(`${at}: unknown claim ${id}`);
    if (used.has(id)) err(`${at}: claim ${id} already used in docket ${used.get(id)}`);
    used.set(id, d.n);
  }
  const verdicts = (d.cards ?? []).map((id) => claims.find((c) => c.id === id)?.verdict);
  if (!verdicts.includes("almost")) warn(`${at}: no ALMOST card (the hero verdict)`);
  if (new Set(verdicts).size === 1) err(`${at}: all five cards share one verdict`);
});

for (const [name, list] of Object.entries(sets)) {
  for (const id of list) if (!ids.has(id)) err(`set ${name}: unknown claim ${id}`);
}
// Paid packs promise exclusive cards: they must never appear in the free daily game.
for (const name of ["partyPack"]) {
  for (const id of sets[name] ?? []) if (used.has(id)) err(`set ${name}: ${id} is also in docket ${used.get(id)}`);
}

const counts = { happened: 0, almost: 0, lore: 0 };
claims.forEach((c) => counts[c.verdict]++);
console.log(`claims: ${claims.length} (happened ${counts.happened}, almost ${counts.almost}, lore ${counts.lore})`);
console.log(`dockets: ${dockets.length}; sets: ${Object.entries(sets).map(([k, v]) => `${k}=${v.length}`).join(", ")}`);
warnings.forEach((w) => console.warn(`warn  ${w}`));
errors.forEach((e) => console.error(`ERROR ${e}`));
if (errors.length || (strict && warnings.length)) {
  console.error(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(`ok — ${warnings.length} warning(s)`);
