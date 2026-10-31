# Retired era metadata audit

The journal now groups stories by topic. Era metadata remained after the last reader was removed.
This cleanup removes `EraId`, `Story.era`, their import and export, and 14 unused story fields.
It also removes a redundant static-output assertion. No test file changes.

## Scope and contract

The candidate starts from revision [`71c50c233dd7ce52d7e31ac19295f60bc4f13f0d`](https://github.com/laqaer/almost-lore/commit/71c50c233dd7ce52d7e31ac19295f60bc4f13f0d).
The [receipt](receipt.json) records the exact source hashes, tested tree, commands, results, and review.
The owning cleanup is [PR #35](https://github.com/laqaer/almost-lore/pull/35).
Published source: `b8e2f761e2f3c1b92c6c8fb77cf75c977d8f55f1`.
It is based on refund merge `c0ed250334e4e50bf1f2450e5701482cebd6b6ff`; its tree matches the reviewed candidate. [Issue #22](https://github.com/laqaer/almost-lore/issues/22) and [refund PR #34](https://github.com/laqaer/almost-lore/pull/34) provide background only.

[PR #27](https://github.com/laqaer/almost-lore/pull/27) introduced era grouping.
[PR #29](https://github.com/laqaer/almost-lore/pull/29), revision `38bfb4c`, removed the last `story.era` reader.
Current navigation uses `storyCollections`. Repository-wide source searches found no remaining caller of the retired fields.
The package is a private application. No external SDK or persisted-data contract requires this metadata.

The removed shell assertion required at least one story HTML file.
The preceding `test -f out/stories/pig-war-san-juan.html` already proves that condition and preserves the named artifact contract.
The browser suite also opens story routes and follows story links.

## Verification

The source stayed unchanged during all runners. Locked dependencies came from `npm ci --no-audit --no-fund` under Node 22.
Local checks passed:

- All 15 native cases and four refund HTTP cases.
- Lint, Next.js route type generation, TypeScript checks, and the static build.
- All 12 desktop and mobile browser cases, with no skips or retries.
- The retained static-output assertions and Cloudflare bundle dry run.

The archive search, collection-filter, and reset case remains the primary behavior check for story navigation.
FAQ parity, RSS navigation, and ads contracts remain unchanged. Refund code and tests remain unchanged.
The source delta is 17 fewer production lines and one fewer tooling line. Test files have no line changes.

An independent OpenAI Codex session reviewed the source diff, callers, history, requirements, and retained tests.
It also checked the documentation, receipt, and 43 evidence hashes. It found no issues.
The receipt identifies the reviewer and the local logs by path and hash. Hosted checks and source integration remain pending.
The project has no portable packet validator installed, so this audit retains native execution evidence.

## Delivery boundary

This task ends at reviewed source integration. It does not include a deployment, purchase, refund, or production acceptance check.
The refund repair integrated in PR #34 before cleanup publication. A source merge does not prove a production update.
Model, agent compute, and CI costs are unknown.

The changed prose satisfies the ten shared documentation checks. Exact commands, identifiers, and historical evidence retain their original form.
