#!/usr/bin/env node
/**
 * Pull public-domain archival images from Wikimedia Commons into /public/images/archive,
 * verifying the licence on every file and recording credits in content/image-credits.json.
 *
 *   NODE_USE_ENV_PROXY=1 node scripts/fetch-images.mjs            (fetch missing files)
 *   NODE_USE_ENV_PROXY=1 node scripts/fetch-images.mjs --force    (refetch everything)
 *
 * Add images by appending { key, file, alt } to content/images.json, where `file` is the
 * Commons file name ("File:…" prefix optional). Only "Public domain" and "CC0" are accepted.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url);
const OUT = new URL("public/images/archive/", ROOT);
const manifest = JSON.parse(readFileSync(new URL("content/images.json", ROOT)));
const creditsPath = new URL("content/image-credits.json", ROOT);
const credits = existsSync(creditsPath) ? JSON.parse(readFileSync(creditsPath)) : {};
const force = process.argv.includes("--force");
const UA = "AlmostLoreBot/1.0 (https://almostlore.com; hello@almostlore.com)";
const ALLOWED = /^(public domain|cc0|pd)/i;
const strip = (html = "") => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

mkdirSync(OUT, { recursive: true });

/** Commons rate-limits bursts (HTTP 429 / "You are making too many requests"); back off and retry. */
async function politeFetch(url, attempt = 0) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const limited = res.status === 429 || res.status >= 500 || (res.headers.get("content-type") ?? "").startsWith("text/plain");
  if (limited && attempt < 5) {
    await new Promise((r) => setTimeout(r, 4000 * 2 ** attempt));
    return politeFetch(url, attempt + 1);
  }
  return res;
}
let failures = 0;

for (const item of manifest) {
  const target = new URL(`${item.key}.jpg`, OUT);
  if (!force && existsSync(target) && credits[item.key]) continue;
  const title = item.file.startsWith("File:") ? item.file : `File:${item.file}`;
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.search = new URLSearchParams({
    action: "query",
    titles: title,
    prop: "imageinfo",
    iiprop: "url|size|extmetadata|mime",
    iiurlwidth: "1800",
    format: "json",
  }).toString();

  try {
    const res = await politeFetch(api);
    const page = Object.values((await res.json()).query.pages)[0];
    const info = page?.imageinfo?.[0];
    if (!info) throw new Error("not found on Commons");
    const meta = info.extmetadata ?? {};
    const license = strip(meta.LicenseShortName?.value);
    if (!ALLOWED.test(license)) throw new Error(`licence "${license}" is not public domain/CC0`);

    const src = info.width > 1800 ? info.thumburl : info.url;
    const img = await politeFetch(src);
    if (!img.ok) throw new Error(`download ${img.status}`);
    writeFileSync(target, Buffer.from(await img.arrayBuffer()));

    credits[item.key] = {
      src: `/images/archive/${item.key}.jpg`,
      alt: item.alt,
      title: title.replace(/^File:/, ""),
      artist: strip(meta.Artist?.value) || "Unknown",
      date: strip(meta.DateTimeOriginal?.value).slice(0, 60),
      license,
      creditUrl: info.descriptionurl,
      width: Math.min(info.width, 1800),
      height: Math.round(info.height * (Math.min(info.width, 1800) / info.width)),
    };
    console.log(`ok    ${item.key}  (${license})`);
    await new Promise((r) => setTimeout(r, 2500));
  } catch (error) {
    failures++;
    console.error(`FAIL  ${item.key}: ${error.message}`);
  }
}

writeFileSync(creditsPath, JSON.stringify(credits, null, 1) + "\n");
if (failures) process.exitCode = 1;
