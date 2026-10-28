# Almost Lore

## Checks

E2E: Node.js HTTP checks against the running site. Run `npm run test:e2e:ops`.
The default target is `https://almostlore.com`. Set `E2E_BASE_URL` for another running site.
This read-only check verifies daily summary freshness and reconciliation status. It does not verify payment or download completion.
Run existing tests with `npm test`. Do not replace E2E checks with unit coverage.

## Ops Worker

The website and `workers/ops` deploy separately. A site deployment does not publish the ops Worker.
The root Wrangler configuration targets the static site, not `almost-lore-ops`. Do not use it for an ops repair.
Read `ops/STATE.md` before changing production. Preserve the experiment metrics and deadlines in `ops/EXPERIMENTS.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Documentation hub

Read [docs/HUB.md](docs/HUB.md) before material changes. Update the affected canonical documentation in the same PR/commit and link the issue, exact revision, tests and deployment boundary. Automatic `docs/updates/` receipts prove only source pushes. Follow the [shared standard](https://github.com/laqaer/agent-config/blob/main/docs/documentation-hub.md); never copy secrets or customer data into documentation.
