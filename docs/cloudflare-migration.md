# Cloudflare migration

Almost Lore is being evaluated as a pure static Next.js export. Production remains on Vercel.

The application uses fixed pages plus `/stories/[slug]` with `generateStaticParams()`, so every story is known at build time. The migration sets `output: "export"` and serves `out/` with Cloudflare Workers Static Assets. There is no Worker script and no server-side compute target.

The migration branch disables Vercel Git deployment only for `infra/cloudflare-static-export`. The PR gate runs lint, Next route type generation, TypeScript, the real static export, output assertions, and a Wrangler dry-run without Cloudflare credentials.

After this gate passes, deploy the exact artifact to workers.dev, verify all story URLs, canonical/OG metadata, robots/sitemap, 404 behavior, and direct refreshes, then perform custom-domain/DNS cutover separately. Keep the last Vercel production deployment as rollback until stabilization.
