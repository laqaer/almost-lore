# Section pages

Section pages are the short editorial pages around the essays: who publishes the site, how to write, what is current, the privacy and terms notes, the support form, and the friends list.

## Sub-features

- `section-about` opens About from the header or footer.
- `section-contact` opens Contact from the header.
- `section-now` opens Now from the footer.
- `section-privacy` opens Privacy from the footer.
- `section-terms` opens Terms from the footer.
- `section-support` shows the support form and stops before submit.
- `section-friends` opens Friends by its path. No header or footer link points there.

## How to get to it (user POV)

- Choose `About` in the header or footer.
- Choose `Contact` in the header or footer.
- Choose `Now`, `Privacy`, or `Terms` in the footer.
- Choose `Support` in the footer, or `support form` on the About page.
- Open `/friends` directly, or from the sitemap. The visible nav does not include Friends.

## Driving it with almost-lore

Preconditions:

- Almost Lore is healthy at `http://127.0.0.1:4321`.
- `almost-lore doctor` prints `doctor: pass`.

- **About.** Choose `About`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "About" --expect "A reader for near-misses, published by Laqaer" --expect "Editorial standards"`. The `h1` is `A reader for near-misses, published by Laqaer` and `jsonLd` includes `Organization`.
- **Contact.** Choose `Contact`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Contact" --expect "How to reach Almost Lore"`. The `h1` is `How to reach Almost Lore`.
- **Now.** Choose `Now`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Now" --expect "What Almost Lore is focused on" --expect "Longforms on the site"`. The `h1` is `What Almost Lore is focused on`.
- **Privacy.** Choose `Privacy`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Privacy" --expect "Privacy policy"`. The `h1` is `Privacy policy`.
- **Terms.** Choose `Terms`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Terms" --expect "Terms of the working file"`. The `h1` is `Terms of the working file`.
- **Support form.** Choose `Support`. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore follow --from / --name "Support" --expect "A correction, a refund, a note" --expect "Send the note"`. The `h1` is `A correction, a refund, a note`. The form shows Topic, Email, and Note. Stop there. Do not submit.
- **Friends.** Open `/friends` with `.cursor/skills/verify-almost-lore/helpers/almost-lore get /friends --expect "People on their own sites" --expect "Nick Gray"`. The `h1` is `People on their own sites`. This `get` is the entry, because the page has no on-site nav link. Do not follow a friend's personal-site URL.
- **Proof.** Snapshot About after the footer or header follow. Run `.cursor/skills/verify-almost-lore/helpers/almost-lore snapshot /about --dir .cursor/skills/verify-almost-lore/evidence/section-pages/about --screenshot --feature section-pages`. Write `PROOF.txt` naming `section-about` and the follow command. Repeat the snapshot directory per sub-feature you actually drive.

## Gotchas

- `About`, `Contact`, and `Stories` each appear twice and share one `href`. `follow` may print `matches: 2`. Two different `href`s for one name is a failure until you pass `--index`.
- Friends is absent from Primary and Footer. A follow named `Friends` from `/` fails. Record that failure if you were proving a nav entry. The path `get` proves the page, not a nav link.
- The support form `action` is `/api/support`. Submitting it is out of scope. A local POST is not proof the publisher stored a note.
- Now and Friends link to other people's sites (`sive.rs`, `nickgray.net`, and the friends list). `follow` must refuse those origins.
- About's funding paragraph mentions Amazon Associates. Do not treat that sentence as a link you need to open.
