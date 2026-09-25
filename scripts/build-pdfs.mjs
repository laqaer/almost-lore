#!/usr/bin/env node
/**
 * Build Almost Lore's printable products from content/*.json with headless Chromium.
 *
 *   node scripts/build-pdfs.mjs                 every product
 *   node scripts/build-pdfs.mjs party starter   only these (party | classroom | halloween | starter)
 *   node scripts/build-pdfs.mjs --html          also keep the intermediate HTML in .cache/pdf/
 *   node scripts/build-pdfs.mjs --previews      also write listing images to ops/marketplace/previews/
 *
 * Paid files go to private/products/ (served only after Stripe verification, never from /public).
 * The repository is public, so those plaintext PDFs are gitignored. With PRODUCTS_KEY set (32 bytes,
 * base64: the same value as in the Vercel env) the script also writes `<file>.enc` (AES-256-GCM),
 * which is what gets committed and deployed; lib/product-files.ts decrypts it per verified download.
 * The free starter deck goes to public/free/ in the clear. No server needed: pages render from
 * local HTML. Needs Playwright with Chromium (`npm i -D playwright && npx playwright install
 * chromium`, or a global install). Re-run after any claim in a pack changes; commit the .enc files.
 */
import { createCipheriv, randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(path.join(ROOT, p), "utf8"));
const claims = new Map(read("content/claims.json").map((c) => [c.id, c]));
const sets = read("content/sets.json");
const credits = read("content/image-credits.json");
const EDITION = new Date().toISOString().slice(0, 10);

const args = process.argv.slice(2);
const keepHtml = args.includes("--html");
const previews = args.includes("--previews");
/** Sheets (0-based) photographed for marketplace listings, from the US Letter / slide builds. */
const PREVIEW_SHEETS = {
  party: [0, 4, 5, 2],
  halloween: [0, 2, 6, 1],
  classroom: [0, 1, 2, 3],
  starter: [0, 2, 3],
};
const only = args.filter((a) => !a.startsWith("--"));

// ---------------------------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------------------------
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const LABEL = { happened: "Happened", almost: "Almost", lore: "Lore" };
const SAY = {
  happened: "It really happened.",
  almost: "It almost happened.",
  lore: "It’s lore.",
};
const DEF = {
  happened: "True exactly as worded",
  almost: "Came documented-close",
  lore: "A popular myth",
};
const LONG = {
  happened: "Every name, number, date and place is right, exactly as written.",
  almost: "It didn’t happen — but the paperwork shows it came close.",
  lore: "A story everybody repeats that the record doesn’t support.",
};
const GLYPH = {
  happened:
    '<svg class="g" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>',
  almost:
    '<svg class="g" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.05 8.62 A9.5 9.5 0 1 1 15.38 2.95" fill="none" stroke="currentColor" stroke-width="4.6"/></svg>',
  lore: '<svg class="g" viewBox="0 0 24 24" aria-hidden="true"><g stroke="currentColor" stroke-width="4.2" stroke-linecap="round"><path d="M12 2.6v18.8"/><path d="M3.86 7.3l16.28 9.4"/><path d="M3.86 16.7l16.28-9.4"/></g></svg>',
};
const glyphs = () =>
  `<span class="glyphs">${GLYPH.happened}${GLYPH.almost}${GLYPH.lore}</span>`;
const slab = (v, text = LABEL[v]) =>
  `<span class="slab v-${v}">${GLYPH[v]}${esc(text)}</span>`;
const topic = (c) => c.topic.replace(/-/g, " ");

const hash = (s) =>
  [...s].reduce(
    (h, ch) => Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0,
    2166136261,
  );
/** Stable shuffle with no three of a verdict in a row where it can be avoided. */
function deal(ids, salt) {
  const pool = ids
    .map((id) => claims.get(id))
    .filter(Boolean)
    .sort((a, b) => hash(a.id + salt) - hash(b.id + salt));
  const out = [];
  while (pool.length) {
    const last2 = out.slice(-2).map((c) => c.verdict);
    const i = pool.findIndex(
      (c) => !(last2.length === 2 && last2.every((v) => v === c.verdict)),
    );
    out.push(pool.splice(i < 0 ? 0 : i, 1)[0]);
  }
  return out;
}
const missing = (name) => (sets[name] ?? []).filter((id) => !claims.has(id));

// ---------------------------------------------------------------------------------------------
// Page geometry & styles
// ---------------------------------------------------------------------------------------------
const PAPER = {
  letter: { w: 215.9, h: 279.4, name: "US Letter", css: "8.5in 11in" },
  a4: { w: 210, h: 297, name: "A4", css: "210mm 297mm" },
  slide: { w: 338.667, h: 190.5, name: "16:9 slides", css: "13.333in 7.5in" },
};
const CARD = { w: 62, h: 86 };
const font = (f) =>
  pathToFileURL(path.join(ROOT, "assets/fonts/print", f)).href;
const img = (f) => pathToFileURL(path.join(ROOT, "public/images", f)).href;

function css(paper) {
  const P = PAPER[paper];
  return `
@font-face{font-family:Wood;src:url(${font("BigShoulders-var.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:Claim;src:url(${font("Fraunces-var.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:Claim;font-style:italic;src:url(${font("Fraunces-var-italic.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:Mono;src:url(${font("IBMPlexMono-500.woff2")}) format("woff2");font-weight:500}
@font-face{font-family:Mono;src:url(${font("IBMPlexMono-600.woff2")}) format("woff2");font-weight:600}
@page{size:${P.css};margin:0}
:root{--bone:#F3EBDD;--bone-hi:#FBF7EF;--ink:#141015;--ink-2:#3a3238;--ink-3:#6d6468;--pink:#FF4F9A;--blue:#2F5BFF;--sun:#FFD23F;--rule:#cfc5b4}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:Claim,Georgia,serif;font-variation-settings:"SOFT" 50,"WONK" 0;font-size:10pt;line-height:1.4}
.sheet{width:${P.w}mm;height:${P.h}mm;position:relative;overflow:hidden;break-after:page;page-break-after:always;background:#fff}
.sheet:last-child{break-after:auto;page-break-after:auto}
.pad{position:absolute;inset:14mm 15mm}
.wood{font-family:Wood,Impact,sans-serif;font-weight:900;text-transform:uppercase;line-height:.86;letter-spacing:-.005em}
.mono{font-family:Mono,monospace;font-weight:600;font-size:6.6pt;letter-spacing:.09em;text-transform:uppercase}
.mis{text-shadow:.5mm .35mm 0 var(--pink)}
.mis-b{text-shadow:.5mm .35mm 0 var(--blue)}
.g{width:1em;height:1em;display:inline-block;vertical-align:-.12em;flex:none}
.glyphs{display:inline-flex;gap:.3em;align-items:center}
.glyphs .g:nth-child(1){color:var(--blue)}.glyphs .g:nth-child(2){color:var(--pink)}.glyphs .g:nth-child(3){color:#d9a800}
.slab{display:inline-flex;align-items:center;gap:.35em;font-family:Wood,sans-serif;font-weight:900;text-transform:uppercase;padding:.12em .45em .1em;line-height:1;border:.3mm solid var(--ink)}
.v-happened{--v:var(--blue);--on:#fff}.v-almost{--v:var(--pink);--on:var(--ink)}.v-lore{--v:var(--sun);--on:var(--ink)}
.slab{background:var(--v);color:var(--on)}
h2.sec{font-family:Wood,sans-serif;font-weight:900;text-transform:uppercase;font-size:30pt;line-height:.9;margin-bottom:4mm}
h3{font-family:Wood,sans-serif;font-weight:800;text-transform:uppercase;font-size:14pt;line-height:1;margin:5mm 0 1.5mm}
p+p{margin-top:2mm}
.rule{border-top:.6mm solid var(--ink);margin:3mm 0}
.kicker{display:flex;justify-content:space-between;border-bottom:.6mm solid var(--ink);padding-bottom:2mm;margin-bottom:6mm}
.folio{position:absolute;left:15mm;right:15mm;bottom:7mm;display:flex;justify-content:space-between;color:var(--ink-3)}

/* cover */
.cover{background:var(--c-bg,var(--pink))}
.cover::after{content:"";position:absolute;inset:0;background:url(${img("grain.png")});background-size:90mm;mix-blend-mode:multiply;opacity:.55}
.cover .pad{z-index:1;display:flex;flex-direction:column}
.cover .top{display:flex;justify-content:space-between;border-bottom:.8mm solid var(--ink);padding-bottom:2.5mm}
.cover h1{font-size:${paper === "slide" ? 88 : 76}pt;margin-top:8mm;text-shadow:1mm .7mm 0 var(--c-mis,var(--blue))}
.cover .art{position:relative;margin:7mm 0 0;flex:1;min-height:0;display:flex;align-items:center;justify-content:center}
.cover .art .plate{position:relative;height:100%;max-height:120mm;aspect-ratio:var(--ar);background:var(--c-plate,var(--bone-hi));border:.6mm solid var(--ink);box-shadow:3mm 3mm 0 var(--ink);transform:rotate(-2deg)}
.cover .art img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply}
.cover .tag{font-size:15pt;line-height:1.3;max-width:150mm;margin-top:7mm;font-variation-settings:"SOFT" 100,"WONK" 1,"opsz" 48}
.cover .contents{display:flex;flex-wrap:wrap;gap:2mm 5mm;margin-top:6mm;border-top:.8mm solid var(--ink);padding-top:3mm}
.cover .stamp{position:absolute;right:6mm;top:40mm;transform:rotate(9deg);font-size:26pt;border:.9mm solid var(--ink);padding:2mm 4mm;background:var(--sun);z-index:2}

/* cards */
.grid{position:absolute;left:${(P.w - 3 * CARD.w) / 2}mm;top:${(P.h - 3 * CARD.h) / 2}mm;display:grid;grid-template-columns:repeat(3,${CARD.w}mm);grid-auto-rows:${CARD.h}mm}
.crop{position:absolute;background:#9c948a}
.card{position:relative;overflow:hidden;box-shadow:inset 0 0 0 .15mm #d8d0c3;padding:4.5mm 4.6mm;display:flex;flex-direction:column}
.card.empty{box-shadow:none}
.c-top{display:flex;justify-content:space-between;align-items:center;border-bottom:.45mm solid var(--ink);padding-bottom:1.6mm;font-size:5.6pt}
.c-q{font-size:10.5pt;margin-top:2.6mm;line-height:.9}
.c-claim{font-family:Claim;font-variation-settings:"SOFT" 100,"WONK" 1,"opsz" 36;font-weight:500;font-size:var(--fs,13pt);line-height:1.13;letter-spacing:-.01em;margin-top:2.6mm}
.c-foot{margin-top:auto;display:flex;justify-content:space-between;border-top:.3mm dotted var(--ink);padding-top:1.5mm;font-size:5.2pt;color:var(--ink-2)}
.front .c-top .glyphs{font-size:6.5pt}
.front.halloween{background:#16121a;color:var(--bone-hi)}
.front.halloween .c-top{border-color:var(--bone-hi)}
.front.halloween .c-foot{border-color:var(--bone-hi);color:#cfc5b4}
.front.halloween .c-q{color:var(--pink)}
.back{padding:0}
.b-band{background:var(--v);color:var(--on);display:flex;align-items:center;gap:2mm;padding:3.6mm 4.6mm 3mm;border-bottom:.45mm solid var(--ink)}
.b-band .wood{font-size:21pt;line-height:.8}
.b-band .g{font-size:15pt}
.b-band .mono{margin-left:auto;font-size:5.6pt}
.b-body{padding:2.6mm 4.6mm 4mm;display:flex;flex-direction:column;flex:1;min-height:0}
.b-say{font-style:italic;font-size:9.5pt;font-variation-settings:"SOFT" 100,"WONK" 1}
.b-rec{font-size:var(--fs,7.9pt);line-height:1.34;margin-top:1.4mm}
.b-origin{font-size:calc(var(--fs,7.9pt) - .6pt);line-height:1.3;margin-top:1.6mm;padding:1.2mm 1.6mm;background:#fff5cc;border-left:.8mm solid var(--sun)}
.b-origin b{font-family:Mono;font-size:5pt;letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:.4mm}
.b-src{margin-top:auto;padding-top:1.4mm;border-top:.3mm dotted var(--ink);font-size:5pt;line-height:1.35;color:var(--ink-2);text-transform:none;letter-spacing:.02em}
.stampcard{background:var(--v);color:var(--on);align-items:center;justify-content:center;text-align:center;gap:2mm}
.stampcard .g{font-size:30pt}
.stampcard .wood{font-size:31pt}
.stampcard .def{font-style:italic;font-size:10pt}
.stampcard .mono{position:absolute;bottom:4mm;left:0;right:0;font-size:5.4pt}
.special{background:var(--ink);color:var(--bone-hi);align-items:center;justify-content:center;text-align:center;gap:2.5mm}
.special .wood{font-size:25pt;color:var(--sun)}
.special p{font-size:8.5pt;line-height:1.35;max-width:48mm}
.special.blank{background:#fff;color:var(--ink);justify-content:flex-start;text-align:left;align-items:stretch}
.special.blank .line{border-bottom:.3mm solid var(--ink-3);height:6.2mm}

/* running text pages */
.cols{display:grid;grid-template-columns:1fr 1fr;gap:7mm}
.box{border:.5mm solid var(--ink);padding:3.5mm 4mm;background:var(--bone-hi)}
.box.sun{background:#fff3c4}
.steps{list-style:none;counter-reset:s}
.steps li{counter-increment:s;position:relative;padding-left:9mm;margin-top:2.4mm}
.steps li::before{content:counter(s);position:absolute;left:0;top:-.6mm;font-family:Wood;font-weight:900;font-size:15pt;line-height:1}
ul.dots{list-style:none}
ul.dots li{padding-left:4mm;position:relative;margin-top:1.2mm}
ul.dots li::before{content:"";position:absolute;left:0;top:1.9mm;width:1.4mm;height:1.4mm;background:var(--ink);border-radius:50%}
.flow-page .colA,.flow-page .colB{height:100%;overflow:hidden}
.flow-body{position:absolute;left:15mm;right:15mm;top:30mm;bottom:15mm;display:grid;grid-template-columns:1fr 1fr;gap:7mm}
.entry{border-top:.4mm solid var(--ink);padding:2mm 0 3mm;break-inside:avoid}
.entry .e-head{display:flex;gap:2mm;align-items:center;font-size:8pt}
.entry .slab{font-size:9pt}
.entry .e-claim{font-weight:600;font-size:9pt;line-height:1.25;margin-top:1.2mm}
.entry .e-rec{font-size:8.4pt;line-height:1.35;margin-top:1mm}
.entry .e-origin{font-size:7.8pt;line-height:1.3;margin-top:1mm;color:var(--ink-2)}
.entry .e-src{font-family:Mono;font-weight:500;font-size:5.8pt;line-height:1.4;margin-top:1.2mm;color:var(--ink-2);word-break:break-all}
table.sheet-table{width:100%;border-collapse:collapse;font-size:9pt}
table.sheet-table th{font-family:Mono;font-weight:600;font-size:6.4pt;letter-spacing:.08em;text-transform:uppercase;text-align:left;border-bottom:.6mm solid var(--ink);padding:1.5mm}
table.sheet-table td{border-bottom:.3mm solid var(--ink-3);padding:1.5mm;height:var(--row,17mm);vertical-align:top}
.bubbles{display:flex;gap:1.5mm}
.bubbles span{border:.35mm solid var(--ink);border-radius:50%;width:6.5mm;height:6.5mm;display:inline-flex;align-items:center;justify-content:center;font-family:Mono;font-weight:600;font-size:6.5pt}
.score-grid td{height:9mm}

/* slides */
.slide{background:var(--bone)}
.slide .pad{inset:12mm 16mm;display:flex;flex-direction:column;z-index:1}
.slide .s-top{display:flex;justify-content:space-between;border-bottom:.7mm solid var(--ink);padding-bottom:2.5mm;font-size:8pt}
.slide .s-claim{font-variation-settings:"SOFT" 100,"WONK" 1,"opsz" 144;font-weight:500;font-size:var(--fs,56pt);line-height:1.04;letter-spacing:-.02em;margin:auto 0;max-width:300mm}
.slide .s-opts{display:flex;gap:6mm;align-items:center}
.slide .s-opts .slab{font-size:28pt;box-shadow:1.2mm 1.2mm 0 var(--ink)}
.slide .s-opts .mono{margin-left:auto;font-size:8pt}
.answer .pad{flex-direction:row;gap:12mm}
.answer .panel{width:95mm;flex:none;background:var(--v);color:var(--on);border:.8mm solid var(--ink);box-shadow:2mm 2mm 0 var(--ink);display:flex;flex-direction:column;justify-content:center;align-items:center;gap:4mm;text-align:center}
.answer .panel .g{font-size:46pt}
.answer .panel .wood{font-size:54pt}
.answer .panel .say{font-style:italic;font-size:15pt}
.answer .right{flex:1;display:flex;flex-direction:column;min-width:0}
.answer .a-claim{font-size:14pt;color:var(--ink-2);font-variation-settings:"SOFT" 100,"WONK" 1;border-bottom:.5mm solid var(--ink);padding-bottom:3mm}
.answer .a-rec{font-size:var(--fs,25pt);line-height:1.28;margin-top:5mm}
.answer .a-origin{font-size:16pt;line-height:1.35;margin-top:4mm;padding:3mm 4mm;background:#fff3c4;border-left:1.2mm solid var(--sun)}
.answer .a-src{margin-top:auto;padding-top:3mm;font-family:Mono;font-weight:500;font-size:8.5pt;line-height:1.5;color:var(--ink-2)}
`;
}

// ---------------------------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------------------------
const doc = (
  paper,
  title,
  body,
) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>${css(paper)}</style></head><body>${body}
<script>${FIT_SCRIPT}</script></body></html>`;

/**
 * In-browser: shrink any card or slide text that overflows, then paginate "flow" blocks into
 * as many two-column pages as they need. Sets window.__ready when the layout is final.
 */
const FIT_SCRIPT = `
document.fonts.ready.then(() => {
  const warn = [];
  for (const el of document.querySelectorAll("[data-fit]")) {
    const box = el.closest("[data-fit-box]") || el.parentElement;
    let fs = parseFloat(getComputedStyle(el).fontSize);
    const min = parseFloat(el.dataset.fit);
    while (box.scrollHeight > box.clientHeight + 0.5 && fs > min) { fs -= 0.25; el.style.fontSize = fs + "px"; }
    if (box.scrollHeight > box.clientHeight + 0.5) warn.push(box.dataset.id || el.textContent.slice(0, 40));
  }
  for (const src of document.querySelectorAll("template[data-flow]")) {
    const make = () => {
      const t = document.getElementById(src.dataset.flow).content.firstElementChild.cloneNode(true);
      src.parentNode.insertBefore(t, src);
      return [t.querySelector(".colA"), t.querySelector(".colB")];
    };
    let cols = make(), ci = 0;
    for (const item of [...src.content.children]) {
      const node = item.cloneNode(true);
      cols[ci].appendChild(node);
      if (cols[ci].scrollHeight > cols[ci].clientHeight + 0.5 && cols[ci].children.length > 1) {
        cols[ci].removeChild(node);
        ci += 1;
        if (ci > 1) { cols = make(); ci = 0; }
        cols[ci].appendChild(node);
      }
    }
    src.remove();
  }
  const sheets = [...document.querySelectorAll(".sheet")];
  for (const f of document.querySelectorAll(".folio .n")) f.textContent = String(sheets.indexOf(f.closest(".sheet")) + 1);
  window.__warn = warn;
  window.__ready = true;
});`;

function cropMarks(cols, rows) {
  const W = cols * CARD.w,
    H = rows * CARD.h,
    L = 5,
    gap = 1.2;
  const out = [];
  for (let i = 0; i <= cols; i++) {
    const x = i * CARD.w;
    out.push(
      `<i class="crop" style="left:calc(50% - ${W / 2 - x}mm);top:calc(50% - ${H / 2 + gap + L}mm);width:.2mm;height:${L}mm"></i>`,
    );
    out.push(
      `<i class="crop" style="left:calc(50% - ${W / 2 - x}mm);top:calc(50% + ${H / 2 + gap}mm);width:.2mm;height:${L}mm"></i>`,
    );
  }
  for (let j = 0; j <= rows; j++) {
    const y = j * CARD.h;
    out.push(
      `<i class="crop" style="top:calc(50% - ${H / 2 - y}mm);left:calc(50% - ${W / 2 + gap + L}mm);height:.2mm;width:${L}mm"></i>`,
    );
    out.push(
      `<i class="crop" style="top:calc(50% - ${H / 2 - y}mm);left:calc(50% + ${W / 2 + gap}mm);height:.2mm;width:${L}mm"></i>`,
    );
  }
  return out.join("");
}

const claimSize = (text, base) =>
  text.length <= 55 ? base : text.length <= 80 ? base - 1.5 : base - 2.5;

function cardFront(c, n, pack, variant = "") {
  return `<div class="card front ${variant}" data-fit-box data-id="${c.id}">
  <div class="c-top mono"><span>No. ${String(n).padStart(2, "0")} · ${esc(pack)}</span>${glyphs()}</div>
  <div class="c-q wood">Happened, almost, or lore?</div>
  <p class="c-claim" style="--fs:${claimSize(c.claim, 13.5)}pt" data-fit="11">${esc(c.claim)}</p>
  <div class="c-foot mono"><span>${esc(topic(c))} · ${esc(c.year)}</span><span>almostlore.com</span></div>
</div>`;
}

function sourceLine(c) {
  return c.sources
    .map((s) => `${esc(s.title)} (${esc(s.publisher)})`)
    .join(" · ");
}

function cardBack(c, n) {
  return `<div class="card back v-${c.verdict}">
  <div class="b-band">${GLYPH[c.verdict]}<span class="wood">${LABEL[c.verdict]}</span><span class="mono">No. ${String(n).padStart(2, "0")}</span></div>
  <div class="b-body" data-fit-box data-id="${c.id}">
    <p class="b-say">${SAY[c.verdict]}</p>
    <p class="b-rec" data-fit="8.5">${esc(c.record)}</p>
    ${c.origin ? `<p class="b-origin"><b>Where the story comes from</b>${esc(c.origin)}</p>` : ""}
    <p class="b-src mono">Sources: ${sourceLine(c)}</p>
  </div>
</div>`;
}

const emptyCard = () => `<div class="card empty"></div>`;

/** Fronts then mirrored backs (flip on the long edge), nine to a sheet. */
function cardSheets(list, pack, variant = "") {
  const out = [];
  for (let i = 0; i < list.length; i += 9) {
    const page = list.slice(i, i + 9);
    while (page.length < 9) page.push(null);
    const fronts = page.map((c, k) =>
      c ? cardFront(c, i + k + 1, pack, variant) : emptyCard(),
    );
    const backs = [];
    for (let r = 0; r < 3; r++)
      for (const col of [2, 1, 0])
        backs.push(
          page[r * 3 + col]
            ? cardBack(page[r * 3 + col], i + r * 3 + col + 1)
            : emptyCard(),
        );
    out.push(
      `<section class="sheet">${cropMarks(3, 3)}<div class="grid">${fronts.join("")}</div></section>`,
    );
    out.push(
      `<section class="sheet">${cropMarks(3, 3)}<div class="grid">${backs.join("")}</div></section>`,
    );
  }
  return out.join("");
}

function stampSheets(players) {
  const cards = [];
  for (let p = 1; p <= players; p++)
    for (const v of ["happened", "almost", "lore"])
      cards.push(
        `<div class="card stampcard v-${v}">${GLYPH[v]}<div class="wood">${LABEL[v]}</div><div class="def">${DEF[v]}</div><div class="mono">Stamp set ${p} · Almost Lore</div></div>`,
      );
  cards.push(
    `<div class="card special"><div class="wood">Reader</div><p>Whoever holds this card reads the next claim aloud, then passes it left.</p><div class="mono" style="font-size:5.4pt">Almost Lore</div></div>`,
  );
  for (let k = 0; k < 2; k++)
    cards.push(
      `<div class="card special blank"><div class="c-top mono"><span>Write your own</span>${glyphs()}</div><p style="font-size:8pt;margin:2mm 0 1mm">A claim only you know the answer to:</p>${'<div class="line"></div>'.repeat(6)}<p class="mono" style="margin-top:auto;font-size:5.2pt">Verdict: ◯ happened ◯ almost ◯ lore</p></div>`,
    );
  const out = [];
  for (let i = 0; i < cards.length; i += 9) {
    const page = cards.slice(i, i + 9);
    while (page.length < 9) page.push(emptyCard());
    out.push(
      `<section class="sheet">${cropMarks(3, 3)}<div class="grid">${page.join("")}</div></section>`,
    );
  }
  return out.join("");
}

const folio = (label) =>
  `<div class="folio mono"><span>${esc(label)}</span><span>almostlore.com · page <span class="n"></span></span></div>`;

function textPage(kicker, body, label) {
  return `<section class="sheet"><div class="pad"><div class="kicker mono"><span>${esc(kicker)}</span>${glyphs()}</div>${body}</div>${folio(label)}</section>`;
}

function entry(c, n) {
  return `<div class="entry"><div class="e-head">${n ? `<span class="wood" style="font-size:13pt">${String(n).padStart(2, "0")}</span>` : ""}${slab(c.verdict)}<span class="mono" style="margin-left:auto">${esc(topic(c))} · ${esc(c.year)}</span></div>
  <p class="e-claim">${esc(c.claim)}</p><p class="e-rec">${esc(c.record)}</p>
  ${c.origin ? `<p class="e-origin"><i>Where the story comes from:</i> ${esc(c.origin)}</p>` : ""}
  <p class="e-src">${c.sources.map((s) => `${esc(s.title)} — ${esc(s.publisher)} — ${esc(s.url)}`).join("<br>")}</p></div>`;
}

/** A flowing, two-column section that paginates itself in the browser. */
function flow(id, kicker, title, items, label) {
  return `<template id="${id}"><section class="sheet flow-page"><div class="pad"><div class="kicker mono"><span>${esc(kicker)}</span>${glyphs()}</div>
  <h2 class="sec" style="font-size:20pt">${esc(title)}</h2></div><div class="flow-body"><div class="colA"></div><div class="colB"></div></div>${folio(label)}</section></template>
  <template data-flow="${id}">${items.join("")}</template>`;
}

function cover({
  title,
  tag,
  contents,
  bg,
  mis,
  plate,
  art,
  stamp,
  label,
  dark = false,
}) {
  const layers = art.layers.map((l) => `<img src="${img(l)}" alt="">`).join("");
  return `<section class="sheet cover" style="--c-bg:${bg};--c-mis:${mis};--c-plate:${plate};${dark ? "color:var(--bone-hi)" : ""}">
  <div class="pad"><div class="top mono" style="${dark ? "border-color:var(--bone-hi)" : ""}"><span>Almost Lore · print-at-home · ${esc(label)}</span><span>Edition ${EDITION}</span></div>
  <h1 class="wood">${title}</h1>
  <p class="tag">${tag}</p>
  <div class="art"><div class="plate" style="--ar:${art.ar}">${layers}</div></div>
  <div class="contents mono" style="${dark ? "border-color:var(--bone-hi)" : ""}">${contents.map((c) => `<span>${esc(c)}</span>`).join("<span>·</span>")}</div></div>
  ${stamp ? `<div class="stamp wood">${esc(stamp)}</div>` : ""}</section>`;
}

function colophon(product, licence, imageKeys, label) {
  const imgs = imageKeys.map((k) => credits[k]).filter(Boolean);
  return textPage(
    "The fine print",
    `<h2 class="sec">Colophon</h2>
    <div class="cols"><div>
    <h3>Licence</h3><p>${esc(licence)}</p>
    <h3>Sources &amp; corrections</h3><p>Every claim in this ${esc(product)} was researched from the sources printed with it and checked by a separate adversarial fact-checker before it shipped. If you think we got one wrong, tell us at <b>almostlore.com/corrections</b>. Upheld corrections are logged publicly and fixed in this file; re-download from your receipt link for the latest edition.</p>
    <h3>Who made this</h3><p>Almost Lore is published by Laqaer. Claims are drafted and checked by an AI editorial team working to a public rubric (almostlore.com/rules); a human publisher is accountable for every verdict.</p>
    </div><div>
    <h3>Play every day</h3><p>Five new claims every day at your local midnight, free, at <b>almostlore.com</b>. The weekly letter, <i>The Sunday Docket</i>, tells one near-miss properly.</p>
    ${imgs.length ? `<h3>Image credits</h3>${imgs.map((i) => `<p style="font-size:8pt">${esc(i.alt)}. ${esc(i.artist)}, ${esc(i.license)}. ${esc(i.creditUrl)}</p>`).join("")}` : ""}
    <h3>Edition</h3><p class="mono" style="font-size:7pt">${esc(product)} · built ${EDITION}</p>
    </div></div>`,
    label,
  );
}

// ---------------------------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------------------------
const HOW_TO_PRINT = (paper) => `<div class="box sun">
<h3 style="margin-top:0">How to print</h3>
<ul class="dots">
<li>Print at <b>actual size / 100%</b> on ${PAPER[paper].name}. Card stock (200 gsm / 110 lb) survives a lot of slamming; plain paper works too.</li>
<li>Claim cards come in pairs of pages: <b>fronts, then backs</b>. Print them double-sided and <b>flip on the long edge</b>; each back lines up behind its front.</li>
<li>No double-sided printer? Print the fronts only and keep the Answer Book at the back of this file on the table: every answer is there.</li>
<li>Cut along the grey crop marks. A paper trimmer makes it a ten-minute job.</li>
</ul></div>`;

function partyPack(paper) {
  const list = deal(sets.partyPack, "party");
  const L = "The Party Pack";
  const rules = textPage(
    "The Party Pack · rules",
    `<h2 class="sec">Four ways to play</h2>
    <p style="font-size:11pt;max-width:150mm">Every card is a claim written as plain fact. Your job is to stamp it: <b>happened</b> (true exactly as written), <b>almost</b> (it didn’t happen, but the paperwork shows it came close) or <b>lore</b> (a story everybody repeats that the record doesn’t support). Then flip the card and read the record aloud. That’s the fun part.</p>
    <div class="cols" style="margin-top:5mm"><div>
    <h3>1 · Stamp Off <span class="mono">2–8 players · 20 min</span></h3>
    <ol class="steps"><li>Everyone takes a stamp set (three cards: happened, almost, lore). Shuffle the claims into a face-down pile.</li>
    <li>The Reader reads the top claim aloud. No discussion — everyone picks a stamp and holds it face down.</li>
    <li>On three, slam your stamps down. Flip the claim and read the record.</li>
    <li>Kept stamps score a point. Pass the Reader card left. First to 10 wins.</li></ol>
    <p style="margin-top:2mm"><i>House rule:</i> the Reader may argue for a verdict before the slam, and may lie.</p>
    <h3>2 · The Dad Test <span class="mono">any number · 2 min</span></h3>
    <p>One reader, five claims, everyone else shouts a verdict. Score out of five and look up your rank: 0 Hollywood Screenwriter · 1 Uncle at Thanksgiving · 2 Tour Guide · 3 Pub Quizzer · 4 Historian · 5 Keeper of the Archive.</p>
    </div><div>
    <h3>3 · Two Truths and a Lore <span class="mono">3+ players</span></h3>
    <ol class="steps"><li>On your turn, secretly look at the backs of the top cards until you hold exactly one <b>lore</b> and two that aren’t. Return the rest to the bottom.</li>
    <li>Read your three claims in any order. Everyone else points at the one they think is lore.</li>
    <li>Each correct guesser scores a point; you score a point for every player you fooled.</li></ol>
    <h3>4 · Draft Night <span class="mono">two teams · 30 min</span></h3>
    <ol class="steps"><li>Deal six claims face up in a row.</li>
    <li>Teams take turns choosing any card and declaring its verdict. Flip it: right scores 2.</li>
    <li>Wrong? The other team may steal by naming the correct verdict for 1.</li>
    <li>Refill the row. Play until the pile runs out; the trailing team picks first each round.</li></ol>
    <div class="box" style="margin-top:4mm"><b>Arguments are allowed.</b> The sources are printed on every card. If you still think we got one wrong, tell us at almostlore.com/corrections — we fix mistakes in public.</div>
    </div></div>`,
    L,
  );
  const host = textPage(
    "The Party Pack · host script",
    `<h2 class="sec">Hosting a round</h2>
    <p style="font-size:11pt;max-width:160mm">For team socials, office parties and video calls. Works for 4–40 people. You need this file, a screen or a loud voice, and ten minutes.</p>
    <div class="cols" style="margin-top:4mm"><div>
    <h3>Before</h3><ul class="dots"><li>Pick 10 claim cards. Mix the verdicts; end on one you think will split the room.</li><li>Split into teams of 3–6. Each team needs a name and a scribe.</li><li>Video call? Share a slide or just read aloud; teams answer in the chat on “stamp!”.</li></ul>
    <h3>Opening (read aloud)</h3><div class="box"><p><i>“Every claim tonight is written as plain fact. Some happened exactly as written. Some almost happened — there’s paperwork showing it came close. And some are lore: stories everybody repeats that the record doesn’t support. Your team stamps each one: happened, almost, or lore. One point per kept stamp.”</i></p></div>
    </div><div>
    <h3>Each round</h3><ol class="steps"><li>Read the claim twice. Give teams 30 seconds.</li><li>Call “stamp!”. Every team shows or posts its verdict at once.</li><li>Read the record from the back of the card, slowly. Pause for groans.</li><li>Scribes mark the score. Ten rounds takes about fifteen minutes.</li></ol>
    <h3>Closing</h3><p>Announce ranks: 0–2 Hollywood Screenwriters, 3–4 Uncles at Thanksgiving, 5–6 Tour Guides, 7–8 Pub Quizzers, 9 Historians, 10 Keepers of the Archive.</p>
    <div class="box sun" style="margin-top:4mm">Tie-break: read one more claim; teams write down the year it happened (or nearly did). Closest wins.</div>
    </div></div>`,
    L,
  );
  const score = textPage(
    "Score sheet",
    `<h2 class="sec">Score sheet</h2>
    <table class="sheet-table score-grid"><thead><tr><th style="width:40mm">Player / team</th>${Array.from({ length: 10 }, (_, i) => `<th>${i + 1}</th>`).join("")}<th>Total</th></tr></thead>
    <tbody>${Array.from({ length: 12 }, () => `<tr><td></td>${"<td></td>".repeat(11)}</tr>`).join("")}</tbody></table>
    <p class="mono" style="margin-top:4mm">Ranks (out of five): 0 Hollywood Screenwriter · 1 Uncle at Thanksgiving · 2 Tour Guide · 3 Pub Quizzer · 4 Historian · 5 Keeper of the Archive</p>`,
    L,
  );
  const intro = textPage(
    "The Party Pack · what’s inside",
    `<h2 class="sec">What’s in the box<span style="color:var(--pink)">*</span></h2>
    <p class="mono" style="margin:-2mm 0 5mm">*It’s a PDF. You are the box.</p>
    <div class="cols"><div>
    <ul class="dots" style="font-size:11pt">
    <li><b>${list.length} claim cards</b> — none of them appear in the daily game, so regular players aren’t spoiled.</li>
    <li><b>8 stamp sets</b> (happened, almost, lore), a Reader card and two blank cards for writing your own.</li>
    <li><b>Four ways to play</b> and a <b>host script</b> for rooms and video calls.</li>
    <li><b>An Answer Book</b> with every record, the story behind every myth, and full source links.</li>
    <li>A score sheet.</li></ul>
    <h3>The three stamps</h3>
    ${["happened", "almost", "lore"].map((v) => `<p style="display:flex;gap:3mm;align-items:baseline;margin-top:2mm">${slab(v)}<span>${LONG[v]}</span></p>`).join("")}
    </div><div>${HOW_TO_PRINT(paper)}</div></div>`,
    L,
  );
  const book = flow(
    "party-book",
    "The Party Pack · answer book",
    "Answer Book",
    list.map((c, i) => entry(c, i + 1)),
    L,
  );
  return doc(
    paper,
    L,
    cover({
      title: 'The<br><span class="mis-b">Party</span><br>Pack',
      tag: `Happened, almost, or lore? ${list.length} claims from history’s near-misses, myths and true stories so strange they sound made up. For 2–8 players and one very long argument.`,
      contents: [
        `${list.length} claim cards`,
        "8 stamp sets",
        "4 ways to play",
        "host script",
        "answer book",
      ],
      bg: "var(--pink)",
      mis: "var(--blue)",
      plate: "var(--bone-hi)",
      art: {
        layers: ["riso/eiffel-blue.webp", "riso/eiffel-pink.webp"],
        ar: "620/789",
      },
      stamp: "Almost",
      label: "Vol. I",
    }) +
      intro +
      rules +
      host +
      cardSheets(list, "Party Pack") +
      stampSheets(8) +
      book +
      score +
      colophon(
        "Party Pack",
        "Personal and household use: print as many copies as your table needs. The Office Edition licence covers one organisation’s internal events. Not for resale or public ticketed events.",
        ["eiffel-construction"],
        L,
      ),
  );
}

function halloweenPack(paper) {
  const list = deal(sets.halloween, "halloween");
  const L = "Haunted History";
  const seats = list.slice(0, 12);
  const tents = [];
  for (let i = 0; i < seats.length; i += 4) {
    const cells = seats.slice(i, i + 4).map(
      (
        c,
        k,
      ) => `<div class="tent"><div class="t-half flip"><p class="mono">Seat ${i + k + 1} says</p><p class="t-claim">${esc(c.claim)}</p><p class="mono">Happened, almost, or lore? · almostlore.com</p></div>
      <div class="t-half"><p class="mono">Seat ${i + k + 1} · Haunted History</p><div class="t-name">Name</div><p class="t-claim small">${esc(c.claim)}</p><p class="mono">Argue about it between courses. The host has the answer.</p></div></div>`,
    );
    tents.push(
      `<section class="sheet"><div class="tents">${cells.join("")}</div></section>`,
    );
  }
  const tentCss = `<style>.tents{position:absolute;left:calc(50% - 95mm);top:calc(50% - 128mm);display:grid;grid-template-columns:repeat(2,95mm);grid-auto-rows:128mm;gap:0}
  .tent{display:grid;grid-template-rows:1fr 1fr;box-shadow:inset 0 0 0 .15mm #bbb}
  .t-half{padding:6mm 7mm;display:flex;flex-direction:column;gap:3mm;justify-content:center;background:#16121a;color:var(--bone-hi)}
  .t-half:last-child{border-top:.3mm dashed #999;background:#fff;color:var(--ink)}
  .t-half.flip{transform:rotate(180deg)}
  .t-claim{font-variation-settings:"SOFT" 100,"WONK" 1;font-weight:500;font-size:15pt;line-height:1.15}
  .t-claim.small{font-size:11pt}
  .t-name{font-family:Wood;font-weight:900;font-size:20pt;text-transform:uppercase;border-bottom:.4mm solid var(--ink);padding-bottom:1mm;color:#bbb}</style>`;
  const answerSheet = textPage(
    "Haunted History · the host’s envelope",
    `<h2 class="sec">The host’s envelope</h2><p style="max-width:160mm">Fold this page and keep it by your plate. When the table has argued long enough about a seat’s claim, read that seat’s verdict and record aloud.</p>
    <div class="cols" style="margin-top:4mm">${[0, 1]
      .map(
        (half) =>
          `<div>${seats
            .slice(half * 6, half * 6 + 6)
            .map(
              (c, k) =>
                `<div class="entry"><div class="e-head"><span class="wood" style="font-size:13pt">Seat ${half * 6 + k + 1}</span>${slab(c.verdict)}</div><p class="e-rec">${esc(c.record)}</p></div>`,
            )
            .join("")}</div>`,
      )
      .join("")}</div>`,
    L,
  );
  const rules = textPage(
    "Haunted History · how to play",
    `<h2 class="sec">A fifteen-minute round between courses</h2>
    <div class="cols"><div>
    <ol class="steps"><li>Print the place cards, fold each along the dashed line and write a guest’s name on it. The claim faces the guest; its twin faces the table.</li>
    <li>Between courses, go round the table. Each guest reads their claim aloud and argues for a verdict: <b>happened</b>, <b>almost</b> or <b>lore</b>.</li>
    <li>The table votes. The host reads the answer from the envelope page.</li>
    <li>A guest who argued the right verdict keeps their place card as a trophy. Most trophies by dessert wins.</li></ol>
    <h3>No dinner party?</h3><p>Use the ${list.length} claim cards for a round of Stamp Off: everyone picks a verdict, slams it down on three, then flip the card and read the record.</p>
    </div><div>${HOW_TO_PRINT(paper)}
    <div class="box" style="margin-top:4mm"><b>A note on the dead.</b> Some of these stories involve real people who died, some of them badly. The joke is always on the legend, never on them.</div></div></div>`,
    L,
  );
  const book = flow(
    "hw-book",
    "Haunted History · answer book",
    "Answer Book",
    list.map((c, i) => entry(c, i + 1)),
    L,
  );
  return doc(
    paper,
    L,
    tentCss +
      cover({
        title: 'Haunted<br><span class="mis">History</span>',
        tag: `Witch trials, vampire panics and stolen coffins. ${list.length} spooky claims — happened, almost, or lore? The truth is usually the scary part.`,
        contents: [
          `${list.length} claim cards`,
          `${seats.length} place cards`,
          "host’s envelope",
          "answer book",
        ],
        bg: "#16121a",
        mis: "var(--pink)",
        plate: "var(--pink)",
        art: { layers: ["riso/dancing-ink.webp"], ar: "820/724" },
        stamp: "Lore",
        label: "Halloween",
        dark: true,
      }) +
      rules +
      cardSheets(list, "Haunted History", "halloween") +
      tents.join("") +
      answerSheet +
      book +
      colophon(
        "Halloween Pack",
        "Personal and household use. Print as many copies as your party needs.",
        ["dancing-pilgrims"],
        L,
      ),
  );
}

function starterDeck(paper) {
  const list = deal(sets.starter, "starter");
  const L = "Starter Deck";
  const intro = textPage(
    "The Starter Deck · free",
    `<h2 class="sec">Eighteen claims to start an argument</h2>
    <div class="cols"><div>
    <p style="font-size:11pt">Every card is a claim written as plain fact. Stamp it <b>happened</b>, <b>almost</b> or <b>lore</b>, then flip it and read the record.</p>
    ${["happened", "almost", "lore"].map((v) => `<p style="display:flex;gap:3mm;align-items:baseline;margin-top:2.5mm">${slab(v)}<span>${LONG[v]}</span></p>`).join("")}
    <h3>The quickest game</h3><p>One reader, five cards, everyone else calls a verdict. Score out of five: 0 Hollywood Screenwriter, 1 Uncle at Thanksgiving, 2 Tour Guide, 3 Pub Quizzer, 4 Historian, 5 Keeper of the Archive.</p>
    <h3>Want more?</h3><p>Five new claims every day, free, at <b>almostlore.com</b>. The Party Pack has 54 more cards you won’t find in the daily game, stamp sets for eight players and four ways to play.</p>
    </div><div>${HOW_TO_PRINT(paper)}</div></div>`,
    L,
  );
  return doc(
    paper,
    L,
    cover({
      title: 'The<br><span class="mis">Starter</span><br>Deck',
      tag: "Eighteen free printable cards from history’s near-misses, myths and true stories that sound made up. Happened, almost, or lore?",
      contents: [
        `${list.length} claim cards`,
        "rules",
        "answer book",
        "free to share",
      ],
      bg: "var(--sun)",
      mis: "var(--pink)",
      plate: "var(--bone-hi)",
      art: { layers: ["riso/beach-blue.webp"], ar: "700/689" },
      stamp: "Free",
      label: "Starter",
    }) +
      intro +
      cardSheets(list, "Starter Deck") +
      flow(
        "starter-book",
        "The Starter Deck · answer book",
        "Answer Book",
        list.map((c, i) => entry(c, i + 1)),
        L,
      ) +
      colophon(
        "Starter Deck",
        "Free to print and share, unmodified, for any non-commercial use.",
        ["beach-pneumatic"],
        L,
      ),
  );
}

function classroomSlides() {
  const list = deal(sets.classroom, "classroom");
  const L = "Classroom Pack";
  const slideSize = (t) => (t.length <= 60 ? 66 : t.length <= 85 ? 58 : 50);
  const claimSlides = list
    .map((c, i) => {
      const n = String(i + 1).padStart(2, "0");
      return `<section class="sheet slide"><div class="pad" data-fit-box data-id="${c.id}">
      <div class="s-top mono"><span>Bell-ringer ${n} · ${esc(topic(c))} · ${esc(c.year)}</span><span>Almost Lore · Classroom Pack Vol. 1</span></div>
      <p class="s-claim" style="--fs:${slideSize(c.claim)}pt" data-fit="40">${esc(c.claim)}</p>
      <div class="s-opts">${slab("happened")}${slab("almost")}${slab("lore")}<span class="mono">Stamp it: write your verdict and how sure you are (1–3).</span></div></div></section>
      <section class="sheet slide answer v-${c.verdict}"><div class="pad"><div class="panel">${GLYPH[c.verdict]}<div class="wood">${LABEL[c.verdict]}</div><div class="say">${SAY[c.verdict]}</div></div>
      <div class="right" data-fit-box data-id="${c.id}-a"><p class="a-claim">${n} · ${esc(c.claim)}</p><p class="a-rec" data-fit="20">${esc(c.record)}</p>
      ${c.origin ? `<p class="a-origin"><b>Where the story comes from:</b> ${esc(c.origin)}</p>` : ""}
      <p class="a-src">Sources: ${sourceLine(c)}</p></div></div></section>`;
    })
    .join("");
  const how = `<section class="sheet slide"><div class="pad"><div class="s-top mono"><span>How it works</span><span>Almost Lore · Classroom Pack Vol. 1</span></div>
    <div style="margin:auto 0;display:grid;gap:7mm">${[
      "happened",
      "almost",
      "lore",
    ]
      .map(
        (v) =>
          `<div style="display:flex;gap:8mm;align-items:center">${slab(v).replace('class="slab', 'style="font-size:28pt;min-width:88mm;box-shadow:1.2mm 1.2mm 0 var(--ink)" class="slab')}<span style="font-size:24pt;line-height:1.2">${LONG[v]}</span></div>`,
      )
      .join("")}</div>
    <p class="mono" style="font-size:9pt">Read the claim. Stamp it. Defend it. Then check the record.</p></div></section>`;
  const end = `<section class="sheet slide"><div class="pad"><div class="s-top mono"><span>Exit ticket</span><span>Almost Lore · Classroom Pack Vol. 1</span></div>
    <p class="s-claim" style="--fs:38pt">Which claim was hardest to call — and what kind of source would settle it?</p>
    <p class="mono" style="font-size:9pt">Free daily bell-ringer for the projector: almostlore.com/class</p></div></section>`;
  return doc(
    "slide",
    L,
    cover({
      title: 'Happened, <span class="mis">almost</span>, or lore?',
      tag: `Classroom Pack, Vol. 1 · ${list.length} history bell-ringers on weighing evidence. Claim slide, then answer slide, with named sources on every one.`,
      contents: [
        `${list.length} claim slides`,
        `${list.length} answer slides`,
        "exit ticket",
      ],
      bg: "var(--blue)",
      mis: "var(--pink)",
      plate: "var(--bone-hi)",
      art: {
        layers: ["riso/poyais-blue.webp", "riso/poyais-pink.webp"],
        ar: "1200/585",
      },
      label: "Classroom · Vol. 1",
    }) +
      how +
      claimSlides +
      end,
  );
}

function classroomPrintables(paper) {
  const list = deal(sets.classroom, "classroom");
  const L = "Classroom Pack · printables";
  const guide = textPage(
    "Classroom Pack Vol. 1 · teacher guide",
    `<h2 class="sec">Teacher guide</h2>
    <div class="cols"><div>
    <p style="font-size:10.5pt">Each bell-ringer is one history claim written as plain fact. Students commit to a verdict — <b>happened</b>, <b>almost</b> or <b>lore</b> — before they see the evidence, then test it against named sources. The middle verdict is the lesson: “almost” forces students to ask <i>how close</i> something came and what the documents actually show.</p>
    <h3>The five-minute routine</h3>
    <ol class="steps"><li><b>Show the claim slide.</b> Thirty seconds of silent thinking. Students write a verdict and a confidence (1–3) on the recording sheet.</li>
    <li><b>Vote.</b> Hands, mini whiteboards, or three coloured cards.</li>
    <li><b>Defend.</b> One student argues each verdict in a sentence. Ask: “What would you expect to find in the records if you were right?”</li>
    <li><b>Reveal.</b> Show the answer slide. Read the record aloud.</li>
    <li><b>Reflect.</b> Students note what would have changed their mind.</li></ol>
    </div><div>
    <h3>What’s inside</h3>
    <ul class="dots"><li>Slides: ${list.length} claim slides, each followed by its answer slide (separate file, 16:9).</li><li>Student recording sheet (copy one per student per week).</li><li>Answer key with every verdict.</li><li>Extension lesson: <i>Write your own ALMOST</i>.</li><li>Exit ticket slips.</li></ul>
    <h3>Skills</h3>
    <p>Designed to support evaluating sources and using evidence (C3 Framework, Dimension 3) and distinguishing fact, opinion and reasoned judgment in historical texts (CCSS RH.6-8.8; RH.9-10.8 for assessing evidence and reasoning).</p>
    <h3>Good to know</h3>
    <ul class="dots"><li>Every claim in this pack is school-safe: nothing graphic, nothing a class can’t discuss.</li><li>Nothing to install; no student accounts; no data collected.</li><li>For a fresh claim every day, put <b>almostlore.com/class</b> on the projector (free).</li></ul>
    <div class="box sun" style="margin-top:4mm"><b>Found an error?</b> Tell us at almostlore.com/corrections. We fix mistakes in public and update this file.</div>
    </div></div>`,
    L,
  );
  const sheet = textPage(
    "Student recording sheet",
    `<div style="display:flex;justify-content:space-between;align-items:end"><h2 class="sec">Stamp it</h2><p class="mono">Name ____________________ · Class ______ · Week of ________</p></div>
    <table class="sheet-table" style="--row:19.5mm"><thead><tr><th style="width:14mm">No.</th><th style="width:52mm">My stamp</th><th style="width:26mm">How sure?</th><th style="width:30mm">Right?</th><th>What would change my mind? What did the record show?</th></tr></thead>
    <tbody>${Array.from({ length: 10 }, () => `<tr><td></td><td><div class="bubbles"><span>H</span><span>A</span><span>L</span></div></td><td><div class="bubbles"><span>1</span><span>2</span><span>3</span></div></td><td><div class="bubbles"><span>✓</span><span>✗</span></div></td><td></td></tr>`).join("")}</tbody></table>
    <p class="mono" style="margin-top:3mm">H = happened (true exactly as written) · A = almost (didn’t happen, but documented-close) · L = lore (a popular myth)</p>`,
    L,
  );
  const keyItems = list.map(
    (c, i) =>
      `<div class="entry" style="padding:1.4mm 0 1.8mm"><div class="e-head"><span class="wood" style="font-size:12pt">${String(i + 1).padStart(2, "0")}</span>${slab(c.verdict)}</div><p class="e-claim" style="font-weight:500;font-size:8.4pt">${esc(c.claim)}</p></div>`,
  );
  const key = flow(
    "class-key",
    "Classroom Pack Vol. 1 · answer key",
    "Answer key",
    keyItems,
    L,
  );
  const ext = textPage(
    "Extension lesson · 40 minutes",
    `<h2 class="sec">Write your own ALMOST</h2>
    <div class="cols"><div>
    <p style="font-size:10.5pt"><b>Goal:</b> students find a real near-miss in history, prove it came close with two sources, and write a claim fair enough to fool their classmates.</p>
    <ol class="steps"><li><b>Find it (10 min).</b> A plan, offer, vote, invention or expedition that nearly happened. Look for words like <i>proposed</i>, <i>rejected</i>, <i>vetoed</i>, <i>called off</i>, <i>failed by</i>.</li>
    <li><b>Prove it (10 min).</b> Two sources that show it came close — and that it didn’t happen.</li>
    <li><b>Write it (10 min).</b> One sentence, as if it did happen. Under 110 characters. No “almost”, “nearly” or “legend”.</li>
    <li><b>Test it (10 min).</b> Trade claims with a partner. They stamp it, then check your sources. Would a fair expert agree with your verdict?</li></ol>
    <h3>The fairness check</h3><ul class="dots"><li>Write the closest <i>true</i> sentence to your claim. If the only difference is a swapped name, number or date, it’s a trick question, not an ALMOST. Try again.</li><li>If people could argue about what a word means, rewrite it.</li></ul>
    </div><div class="box" style="background:#fff">
    <p class="mono">Name ____________________</p>
    ${["My claim (one sentence, written as fact)", "What actually happened", "How close did it come? What stopped it?", "Source 1 (title, publisher, link)", "Source 2 (title, publisher, link)", "The closest true sentence"].map((q) => `<h3 style="font-size:10pt;margin-top:4mm">${q}</h3>${'<div style="border-bottom:.3mm solid var(--ink-3);height:7.5mm"></div>'.repeat(q.startsWith("Source") ? 1 : 2)}`).join("")}
    </div></div>`,
    L,
  );
  const tickets = textPage(
    "Exit tickets · cut along the lines",
    `<div style="display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:118mm;gap:0">${Array.from(
      { length: 4 },
      () => `<div style="border:.3mm dashed #999;padding:6mm;display:flex;flex-direction:column;gap:3mm">
      <p class="mono">Exit ticket · Almost Lore</p><p style="font-size:12pt;font-weight:600">Which claim today was hardest to call?</p>${'<div style="border-bottom:.3mm solid var(--ink-3);height:7mm"></div>'.repeat(2)}
      <p style="font-size:12pt;font-weight:600">What kind of source would settle it, and why?</p>${'<div style="border-bottom:.3mm solid var(--ink-3);height:7mm"></div>'.repeat(4)}
      <p class="mono" style="margin-top:auto">Name ______________</p></div>`,
    ).join("")}</div>`,
    L,
  );
  return doc(
    paper,
    L,
    cover({
      title: 'Class&shy;room <span class="mis">Pack</span>',
      tag: `Vol. 1 · teacher guide, student recording sheet, answer key, extension lesson and exit tickets for ${list.length} history bell-ringers. The slides are in the companion file.`,
      contents: [
        "teacher guide",
        "recording sheet",
        "answer key",
        "extension lesson",
        "exit tickets",
      ],
      bg: "var(--blue)",
      mis: "var(--pink)",
      plate: "var(--bone-hi)",
      art: {
        layers: ["riso/poyais-blue.webp", "riso/poyais-pink.webp"],
        ar: "1200/585",
      },
      label: "Classroom · Vol. 1",
    }) +
      guide +
      sheet +
      key +
      ext +
      tickets +
      colophon(
        "Classroom Pack Vol. 1",
        "One teacher, all of their classes (or up to 10 teachers in one department with the Department Licence). Copy the student pages freely for your students. Not for resale or posting publicly.",
        ["poyais-banknote"],
        L,
      ),
  );
}

// ---------------------------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------------------------
const PRIVATE = path.join(ROOT, "private/products");
const FREE = path.join(ROOT, "public/free");
const JOBS = {
  party: [
    [
      "letter",
      () => partyPack("letter"),
      path.join(PRIVATE, "almost-lore-party-pack-letter.pdf"),
    ],
    [
      "a4",
      () => partyPack("a4"),
      path.join(PRIVATE, "almost-lore-party-pack-a4.pdf"),
    ],
  ],
  classroom: [
    [
      "slide",
      () => classroomSlides(),
      path.join(PRIVATE, "almost-lore-classroom-slides.pdf"),
    ],
    [
      "letter",
      () => classroomPrintables("letter"),
      path.join(PRIVATE, "almost-lore-classroom-printables-letter.pdf"),
    ],
    [
      "a4",
      () => classroomPrintables("a4"),
      path.join(PRIVATE, "almost-lore-classroom-printables-a4.pdf"),
    ],
  ],
  halloween: [
    [
      "letter",
      () => halloweenPack("letter"),
      path.join(PRIVATE, "almost-lore-halloween-pack-letter.pdf"),
    ],
    [
      "a4",
      () => halloweenPack("a4"),
      path.join(PRIVATE, "almost-lore-halloween-pack-a4.pdf"),
    ],
  ],
  starter: [
    [
      "letter",
      () => starterDeck("letter"),
      path.join(FREE, "almost-lore-starter-deck.pdf"),
    ],
  ],
};

const productsKey = process.env.PRODUCTS_KEY
  ? Buffer.from(process.env.PRODUCTS_KEY.trim(), "base64")
  : null;
if (productsKey && productsKey.length !== 32) {
  console.error(
    "PRODUCTS_KEY must be 32 bytes, base64-encoded (openssl rand -base64 32).",
  );
  process.exit(1);
}

/** The format lib/product-files.ts reads: "ALP1" · 12-byte IV · 16-byte GCM tag · ciphertext. */
function encrypt(file) {
  if (!productsKey) return;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", productsKey, iv);
  const body = Buffer.concat([
    cipher.update(readFileSync(file)),
    cipher.final(),
  ]);
  writeFileSync(
    `${file}.enc`,
    Buffer.concat([
      Buffer.from("ALP1", "latin1"),
      iv,
      cipher.getAuthTag(),
      body,
    ]),
  );
}

async function loadChromium() {
  for (const name of ["playwright", "@playwright/test"]) {
    try {
      return (await import(name)).chromium;
    } catch {}
  }
  const bases = [
    process.env.NODE_PATH,
    "/opt/node22/lib/node_modules",
    "/usr/local/lib/node_modules",
    "/usr/lib/node_modules",
  ].filter(Boolean);
  for (const base of bases) {
    try {
      return createRequire(path.join(base, "noop.js"))("playwright").chromium;
    } catch {}
  }
  throw new Error(
    "Playwright not found. Run: npm i -D playwright && npx playwright install chromium",
  );
}

for (const name of ["partyPack", "classroom", "halloween", "starter"]) {
  if (missing(name).length) {
    console.error(
      `sets.${name} references missing claims: ${missing(name).join(", ")}`,
    );
    process.exit(1);
  }
}

const chromium = await loadChromium();
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {},
);
const cache = path.join(ROOT, ".cache/pdf");
mkdirSync(cache, { recursive: true });
mkdirSync(PRIVATE, { recursive: true });
mkdirSync(FREE, { recursive: true });

let failed = false;
for (const [product, jobs] of Object.entries(JOBS)) {
  if (only.length && !only.includes(product)) continue;
  for (const [paper, build, out] of jobs) {
    const html = build();
    const file = path.join(cache, `${path.basename(out, ".pdf")}.html`);
    writeFileSync(file, html);
    const page = await browser.newPage();
    page.on("pageerror", (e) =>
      console.error(`[${product}/${paper}]`, e.message),
    );
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await page.waitForFunction(() => window.__ready === true, null, {
      timeout: 60_000,
    });
    const warn = await page.evaluate(() => window.__warn);
    if (warn.length) {
      failed = true;
      console.error(
        `[${product}/${paper}] text still overflows after shrinking: ${warn.join(", ")}`,
      );
    }
    await page.pdf({
      path: out,
      preferCSSPageSize: true,
      printBackground: true,
    });
    if (out.startsWith(PRIVATE)) encrypt(out);
    const pages = await page.evaluate(
      () => document.querySelectorAll(".sheet").length,
    );
    console.log(`${path.relative(ROOT, out)}  ${pages} pages`);
    await page.close();
    if (
      previews &&
      (paper === "letter" || paper === "slide") &&
      !out.includes("printables")
    ) {
      const dir = path.join(ROOT, "ops/marketplace/previews");
      mkdirSync(dir, { recursive: true });
      const shots = await browser.newPage({
        deviceScaleFactor: paper === "slide" ? 1.6 : 2.4,
      });
      await shots.goto(pathToFileURL(file).href, { waitUntil: "load" });
      await shots.waitForFunction(() => window.__ready === true, null, {
        timeout: 60_000,
      });
      for (const [i, n] of (PREVIEW_SHEETS[product] ?? []).entries()) {
        const target = path.join(dir, `${product}-${i + 1}.png`);
        await shots.locator(".sheet").nth(n).screenshot({ path: target });
      }
      await shots.close();
      console.log(`  previews → ops/marketplace/previews/${product}-*.png`);
    }
  }
}
await browser.close();
if (!productsKey)
  console.warn(
    "PRODUCTS_KEY not set: plaintext PDFs only (gitignored), no .enc files written.",
  );
if (!keepHtml && !failed) {
  // The HTML embeds absolute file paths; keep it only when asked, for debugging.
  for (const [, jobs] of Object.entries(JOBS))
    for (const [, , out] of jobs) {
      try {
        rmSync(path.join(cache, `${path.basename(out, ".pdf")}.html`), {
          force: true,
        });
      } catch {}
    }
}
process.exit(failed ? 1 : 0);
