# Retired ads wrapper audit

The private `adsPublisherId()` wrapper had no production caller.
PR #21, commit `763e98495636a2a7027a469ff6f32695cf0f81c5`, moved `/ads.txt` to `adsTxtBody()` and `NEXT_PUBLIC_ADSENSE_PUB_ID`.
Only three assertions continued to call the old wrapper.

This change removes that wrapper, its test import, and those three obsolete assertions.
All eight ad test cases remain. The mixed case retains its disabled-ad assertion and now names that behavior.
The consent guard, publisher parser, current seller-file contract, and browser scenarios remain unchanged.

See the [deletion evidence](deletion-candidate.json) and [source receipt](receipt.json).
The tested source is `b714e9d8fc9798209d4f01e4c05d7657abcdaefb`, against base `9f674e994c67336bb96ffc27c1736dfb991de85c`.
Production code loses eight lines. Tests lose four net lines. No dependency or workflow changes.

## Verification

The native tests pass all 15 cases before and after removal. The browser suite passes all 12 desktop/mobile cases without skips or retries.
Build, lint, and typecheck pass. The emitted `ads.txt` matches its baseline bytes.
Independent correctness and requirements review found no issues. The reviewer did not execute tests.

The retained [test log](final-tests.log) and [browser log](final-e2e.log) identify the actual checks.
The owning PR records hosted checks, current source gates, and the merge receipt.
Historical sandbox and build failures remain in the local audit evidence; they are not reported as passes.

## Boundary

This batch completes at source integration. It does not claim deployment or runtime acceptance.
Ops source and tests, consent configuration, payments, credentials, and production settings remain outside this cleanup.
Other repository-audit findings remain unresolved in the owning task. The FAQ browser case still imports production content.
Its assertions remain until equivalent independent expectations can replace them without reducing coverage.
Model, agent compute, and CI costs are unknown.
