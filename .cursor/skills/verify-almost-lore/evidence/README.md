# Verification evidence

Proof artifacts for `verify-almost-lore` live here, one directory per feature id:

- `evidence/story-hub/`
- `evidence/read-story/`
- `evidence/section-pages/`
- `evidence/working-file/`
- `evidence/crawler-files/`

A UI proof keeps the follow stdout (the action) and the arrived page (`page.html`, `page.txt`, `page.meta.json`, and `page.png` when Chrome ran). `PROOF.txt` names the feature id, the entry point, and the command.

`almost-lore cleanup` deletes `/tmp/almost-lore-verify-$PORT/` only. It leaves this directory in place. Confirm these files still exist after cleanup before calling a run a pass.

The first executed proof is `read-story` (hub → `Read the story` → the Poyais essay). Other feature directories stay empty until a run drives them.
