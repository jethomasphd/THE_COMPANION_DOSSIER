# Notes for future Claude iterations

## Portraits in `The_Pantheon/` are uploaded manually

Do **not** propose or rebuild an automated Wikipedia-scraping fetcher for the
portraits in `The_Pantheon/`. We tried that in May 2026 (a `fetch-portraits.yml`
workflow plus a `The_Pantheon/fetch_portraits.sh` bash script) and it was
unreliable — Wikipedia disambiguation pages, redirected slugs, fair-use images
on en.wikipedia, and one failing link tanking the whole workflow all caused
the action to never commit any portraits at all. Both the workflow and the
script have been removed.

The portraits are now curated by hand:

- The owner downloads each lead image from Wikipedia / Wikimedia Commons and
  drops it into `The_Pantheon/` using the **exact filename** listed in
  `The_Pantheon/README.md`.
- The site's hologram modules (`The_Chair/js/hologram.js`,
  `The_5_Lamps/js/hologram.js`, `The_Boardroom/js/hologram.js`,
  `The_Symposium/js/hologram.js`) and a few HTML files
  (`The_Halpern_Memo/index.html`, `Latent_Dialogic_Space/index.html`,
  `Committee_of_Patriots_Sessions/Q12026/index.html`) all load these by
  the filename pattern `../The_Pantheon/<Slug>.jpg`, with one `.jpeg`
  exception for `Eugene_V_Debs.jpeg`.

When adding a new figure to the Pantheon:

1. Pick a `Snake_Case` slug.
2. Update `The_Pantheon/README.md` with the filename and source URL.
3. Wire the slug into the relevant chamber's JS or HTML.
4. Tell the owner to drop the file in — do not write a fetcher.
