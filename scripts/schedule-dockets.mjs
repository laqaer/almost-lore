#!/usr/bin/env node
/**
 * Append new dockets from unscheduled claims. Never edits existing dockets.
 *
 *   node scripts/schedule-dockets.mjs --days 7            append 7 dockets
 *   node scripts/schedule-dockets.mjs --days 7 --dry-run  print, don't write
 *
 * Pool = claims not already in a docket and not reserved by an exclusive set
 * (partyPack, halloween, gullibility, starter). A claim with `pinDate: "YYYY-MM-DD"` is placed on
 * the docket that goes live that day, when that docket is being created.
 * Each docket gets ≥1 ALMOST, never one verdict five times, varied eras/topics, and the hardest,
 * least-telegraphed card last (the trap). Review the output by hand before opening a PR.
 */
import { readFileSync, writeFileSync } from "node:fs";

const EXCLUSIVE_SETS = ["partyPack", "halloween", "gullibility", "starter", "examples"];
const EPOCH = readFileSync(new URL("../lib/game/schedule.ts", import.meta.url), "utf8").match(
  /EPOCH = "(\d{4}-\d{2}-\d{2})"/,
)[1];

const args = process.argv.slice(2);
const days = Number(args[args.indexOf("--days") + 1] || 7);
const dryRun = args.includes("--dry-run");

const read = (p) => JSON.parse(readFileSync(new URL(`../content/${p}`, import.meta.url)));
const claims = read("claims.json");
const dockets = read("dockets.json");
const sets = read("sets.json");

const scheduled = new Set(dockets.flatMap((d) => d.cards));
const reserved = new Set(EXCLUSIVE_SETS.flatMap((name) => sets[name] ?? []));
// A stable pseudo-random order so the pool isn't alphabetical or by writer batch.
const hash = (s) => [...s].reduce((h, c) => (Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0), 2166136261);
const pool = claims
  .filter((c) => !scheduled.has(c.id) && !reserved.has(c.id))
  .sort((a, b) => hash(a.id) - hash(b.id));

const dateFor = (n) => {
  const [y, m, d] = EPOCH.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + (n - 1) * 86_400_000).toISOString().slice(0, 10);
};

// Rotating verdict mixes: no fixed quota a player could count on, ALMOST always present.
const MIXES = [
  { almost: 2, happened: 2, lore: 1 },
  { almost: 2, happened: 1, lore: 2 },
  { almost: 1, happened: 2, lore: 2 },
  { almost: 3, happened: 1, lore: 1 },
  { almost: 1, happened: 3, lore: 1 },
  { almost: 2, happened: 2, lore: 1 },
  { almost: 1, happened: 1, lore: 3 },
];

const telegraph = (c) => c.scores?.telegraph ?? 3;
const trapScore = (c) => c.difficulty * 2 - telegraph(c) + (c.scores?.fun ?? 3) * 0.5;

const byId = new Map(claims.map((c) => [c.id, c]));
const trapCounts = { happened: 0, almost: 0, lore: 0 };
for (const d of dockets) {
  const last = byId.get(d.cards[d.cards.length - 1]);
  if (last) trapCounts[last.verdict]++;
}
const created = [];
for (let i = 0; i < days; i++) {
  const n = dockets.length + created.length + 1;
  const date = dateFor(n);
  const picked = [];
  const take = (claim) => {
    picked.push(claim);
    pool.splice(pool.indexOf(claim), 1);
  };

  for (const claim of pool.filter((c) => c.pinDate === date)) if (picked.length < 5) take(claim);

  // Mirror what's left in the pool so the tail of the schedule stays balanced, but vary the
  // pattern (MIXES) so players can't count their way to an answer.
  const left = { happened: 0, almost: 0, lore: 0 };
  for (const c of pool) if (!c.pinDate) left[c.verdict]++;
  const total = left.happened + left.almost + left.lore || 1;
  const base = MIXES[(n - 1) % MIXES.length];
  const mix = {};
  for (const v of ["happened", "almost", "lore"]) {
    const share = (5 * left[v]) / total;
    mix[v] = Math.max(0, Math.min(3, Math.round((share + base[v]) / 2), left[v]));
  }
  if (left.almost > 0 && mix.almost === 0) mix.almost = 1;
  let sum = mix.happened + mix.almost + mix.lore;
  const order = ["happened", "lore", "almost"].sort((a, b) => left[b] - left[a]);
  while (sum < 5) {
    const v = order.find((k) => mix[k] < Math.min(3, left[k]));
    if (!v) break;
    mix[v]++;
    sum++;
  }
  while (sum > 5) {
    const v = [...order].reverse().find((k) => mix[k] > (k === "almost" ? 1 : 0));
    mix[v]--;
    sum--;
  }
  for (const c of picked) mix[c.verdict] = Math.max(0, mix[c.verdict] - 1);

  for (const verdict of ["almost", "happened", "lore"]) {
    while (mix[verdict] > 0 && picked.length < 5) {
      const eras = new Set(picked.map((c) => c.era));
      const topics = new Set(picked.map((c) => c.topic));
      const candidates = pool.filter((c) => c.verdict === verdict && !c.pinDate);
      const best =
        candidates.find((c) => !eras.has(c.era) && !topics.has(c.topic)) ??
        candidates.find((c) => !topics.has(c.topic)) ??
        candidates[0];
      if (!best) break;
      take(best);
      mix[verdict] -= 1;
    }
  }
  // Top up from any verdict if a bucket ran dry.
  while (picked.length < 5 && pool.some((c) => !c.pinDate)) take(pool.find((c) => !c.pinDate));
  if (picked.length < 5) {
    console.error(`Pool exhausted at docket ${n} (${picked.length} cards). Run the claim gauntlet.`);
    break;
  }
  const verdicts = new Set(picked.map((c) => c.verdict));
  if (!picked.some((c) => c.verdict === "almost") || verdicts.size === 1) {
    console.warn(`docket ${n}: imperfect mix (${picked.map((c) => c.verdict).join(", ")}) — review by hand`);
  }

  // The trap is a hard card, but its verdict rotates so the fifth slot never becomes a tell.
  const best = Math.max(...picked.map(trapScore));
  const contenders = picked.filter((c) => trapScore(c) >= best - 1.5);
  const trap = contenders.sort(
    (a, b) => trapCounts[a.verdict] - trapCounts[b.verdict] || trapScore(b) - trapScore(a) || hash(a.id) - hash(b.id),
  )[0];
  trapCounts[trap.verdict]++;
  const ordered = [...picked.filter((c) => c !== trap).sort((a, b) => hash(a.id + n) - hash(b.id + n)), trap];
  created.push({ n, cards: ordered.map((c) => c.id) });
  console.log(`#${n} ${date}  ${ordered.map((c) => `${c.verdict[0].toUpperCase()}:${c.id}`).join("  ")}`);
}

console.log(`\n${created.length} docket(s); ${pool.length} claim(s) left unscheduled.`);
if (!dryRun && created.length) {
  writeFileSync(new URL("../content/dockets.json", import.meta.url), JSON.stringify([...dockets, ...created], null, 1) + "\n");
  console.log("content/dockets.json updated. Run npm run validate -- --strict.");
}
