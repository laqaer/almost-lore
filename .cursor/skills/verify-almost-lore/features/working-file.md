# Working file

The working file is the paid Poyais dossier. The essay stays free. On a local `next dev` server the pay button stays off because this Next app does not serve checkout status.

## Sub-features

- `dossier-open` opens the dossier from the header and from the Poyais essay.
- `dossier-checkout` shows a checkout notice that never enables payment during local verification.
- `dossier-thanks` shows the download page without a checkout session and does not offer a file.

## How to get to it (user POV)

- Choose `The working file` in the header or footer.
- On the Poyais essay, choose `The Poyais working file`.
- Open `/dossier/thanks` only to see the no-session state. A paid return from Stripe is not part of local verification.

## Driving it with almost-lore

Preconditions:

- Almost Lore is healthy at `http://127.0.0.1:4321`.
- `almost-lore doctor` prints `doctor: pass`.
- Chrome is required for `dossier-checkout` and for the hydrated thanks copy. If `dom` prints `dom blocked:`, those two sub-features are not verified.

- **Header entry.** Choose `The working file`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "The working file" --expect "The Poyais working file" --expect "Checking whether card checkout is open."`. The `h1` is `The Poyais working file` and the server HTML still contains the checking sentence.
- **Essay entry.** From the Poyais essay, choose `The Poyais working file`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from /stories/poyais-invented-country --name "The Poyais working file" --expect "The Poyais working file"`. The destination path is `/dossier`.
- **Checkout stays unpaid.** Load the dossier in Chrome. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore dom /dossier --out .cursor/skills/verify-almost-lore/evidence/working-file/dossier.dom.html --expect "Checkout status could not be confirmed, so the pay button stays off."`. The dumped DOM contains that sentence. It does not contain `Pay $9 and continue to checkout`.
- **Thanks without a session.** Open `/dossier/thanks`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore get /dossier/thanks --expect "Your download" --expect "Preparing the download link."`. The `h1` is `Your download`. Then run `.cursor/skills/verify-almost-lore/helpers/almost-lore dom /dossier/thanks --expect "No checkout session came back with this page."`. The hydrated page says no session came back. It does not contain `Download the working file`.
- **Proof.** Keep the follow stdout and the `dom` output. Write `PROOF.txt` naming `working-file`, the entry `The working file`, and both commands. `page.meta.json` or the dom file's source URL is `http://127.0.0.1:4321/dossier`.

## Gotchas

- Server HTML for `/dossier` says `Checking whether card checkout is open.` The settled local sentence is `Checkout status could not be confirmed, so the pay button stays off.` A curl that expects the settled sentence fails. A curl that expects `Card checkout is not connected yet` also fails. That closed sentence is what the ops Worker would cause after a JSON status payload. This app does not serve `/api/status`. Do not switch the server to `vercel dev` to obtain it.
- Do not click or POST `Pay $9 and continue to checkout`. If that button is present, stop and report it. Local verification has no Stripe session to complete.
- `/dossier/thanks` server HTML says `Preparing the download link.` The hydrated no-session sentence is the proof that a file was not offered. Do not add `?session_id=`.
- The paid file body is not in this repository. A missing download is the expected local end state, not a broken fixture to patch.
