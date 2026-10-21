# Crawler files

Crawler files tell a robot what may be fetched, which URLs exist, whether an ads.txt seller line is published, and which essays are in the RSS feed.

## Sub-features

- `crawl-robots` serves `/robots.txt` with an allow rule and a sitemap URL.
- `crawl-sitemap` lists the hub, the section pages, and every story, and omits the thanks page.
- `crawl-ads` serves the placeholder ads.txt comment while the publisher id is unset.
- `crawl-feed` opens the RSS feed from the footer and lists every story path.

## How to get to it (user POV)

- Choose `RSS feed` in the footer. That is the reader entry for `/feed.xml`.
- `/robots.txt`, `/sitemap.xml`, and `/ads.txt` are requested by path. The pages do not link to them.

## Driving it with almost-lore

Preconditions:

- Almost Lore is healthy at `http://127.0.0.1:4321`.
- `almost-lore doctor` prints `doctor: pass`.
- `NEXT_PUBLIC_ADSENSE_PUB_ID` is unset in the environment of the `next dev` process this run launched.

- **RSS from the footer.** Choose `RSS feed`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "RSS feed" --expect "<rss" --expect "<title>Almost Lore</title>" --expect "/stories/poyais-invented-country"`. Status is 200 and the body is the feed. The `h1` line may be empty because the feed is XML. The title element and a story path are the identity.
- **Robots, sitemap, ads.txt, and the full feed.** Run `.cursor/skills/verify-almost-lore/helpers/almost-lore seo --dir .cursor/skills/verify-almost-lore/evidence/crawler-files`. The command prints `seo: pass`. Robots names `https://almostlore.com/sitemap.xml` and allows `/`. The sitemap has 23 `loc` values: the hub, eight section paths (`/about`, `/contact`, `/now`, `/friends`, `/privacy`, `/dossier`, `/support`, `/terms`), and 14 `/stories/` paths. `/dossier/thanks` is absent. `ads.txt` is exactly `# Almost Lore ads.txt — AdSense publisher line added after approval.` The feed contains all 14 story paths.
- **Proof.** The `seo` directory is the artifact. Write `PROOF.txt` naming `crawler-files`, the footer entry for the feed, and the `seo` command. The saved files are local responses. Their canonical host string is `https://almostlore.com`.

## Gotchas

- `seo` fails when `ads.txt` is a `google.com, pub-…` seller line. That means the dev process inherited `NEXT_PUBLIC_ADSENSE_PUB_ID`. Stop, unset it, and launch again. Do not rewrite `lib/ads.ts` to force a pass.
- Sitemap `loc` values use `https://almostlore.com` even though the request went to `127.0.0.1`. Count the locs in the saved file. Do not GET those production URLs.
- The feed follow is the reader path. `seo` covers robots, sitemap, and ads.txt, which have no in-page link. A pass of `seo` alone does not pass `crawl-feed`.
- Adding or removing a story changes the loc count of 23 and the slug list inside `helpers/almost-lore`. Update both. Do not lower the count to match a partial fetch.
- `npm run indexnow` submits URLs to an external service. Verification does not run it.
