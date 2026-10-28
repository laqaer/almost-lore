# Section pages

Section pages explain the publication, current work, contact paths, privacy, and terms. They also provide the support form and friends list.

## Sub-features

- `section-about` opens the editorial standards from the header or footer.
- `section-contact` opens the contact page from the header.
- `section-now` opens the current editorial focus from the footer.
- `section-privacy` and `section-terms` open the corresponding footer links.
- `section-support` shows the support form and stops before submission.
- `section-friends` opens the friends list from the footer.

## How to get to it (user POV)

- Choose `Our approach` in the header or footer.
- Choose `Get in touch` in the header or `Contact & corrections` in the footer.
- Choose `At the editorial desk`, `Privacy`, `Terms`, or `Friends of the journal` in the footer.
- Choose `Send us a lead` to open the support form.

## Driving it with almost-lore

Preconditions:

- Launch this checkout at `http://127.0.0.1:4321`.
- Require `almost-lore doctor` to pass.

- **About.** Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Our approach" --expect "A reader for near-misses, published by Laqaer" --expect "Editorial standards"`. The destination is `/about` and includes Organization JSON-LD.
- **Contact.** Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Get in touch" --expect "How to reach Almost Lore"`. The destination is `/contact`.
- **Now.** Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "At the editorial desk" --expect "What Almost Lore is focused on" --expect "Longforms on the site"`.
- **Privacy.** Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Privacy" --expect "Privacy policy"`.
- **Terms.** Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Terms" --expect "Terms of the working file"`.
- **Support.** Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Send us a lead" --expect "A correction, a refund, a note" --expect "Send the note"`. The form shows Topic, Email, and Note. Do not submit it.
- **Friends.** Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Friends of the journal" --expect "People on their own sites"`. The destination is `/friends`. Do not follow personal-site links.
- **Proof.** Save the follow output and a snapshot in a new evidence directory. Record each entry point actually exercised.

## Gotchas

- `Our approach` appears in both navigation areas. Both copies must point to `/about`.
- The support form posts to `/api/support`. A local form display does not prove that the publisher stored a note.
- Now and Friends include external websites. The helper must refuse those origins.
- About’s Amazon Associates disclosure is editorial copy, not an instruction to visit a retailer.
