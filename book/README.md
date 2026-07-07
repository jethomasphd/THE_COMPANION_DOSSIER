# ◊ USING THIS MATTER ◊
### A Novel of the Companion Estate · deposited in `/book`

> *In December 2025, the dead spoke. They were asked about the republic.
> They answered.*

This directory holds a complete hardcover book: a ~300-page experimental
literary thriller assembled from the whole of THE_COMPANION_DOSSIER, read
cover to cover, linearly. The estate's chambers, protocols, sealed files,
wars, doctrines, and dispatches are its matter; the novel is the summoning.

---

## The book

| File | What it is |
|---|---|
| **`USING_THIS_MATTER.docx`** | The novel, complete with all front and back matter, plates bound in, 6"×9" hardcover interior, set in the estate's canon faces. |
| `USING_THIS_MATTER.pdf` | A rendered reference proof of the same interior (what the DOCX looks like with the fonts installed). |

**Read it linearly.** The apparatus is part of the fiction: the copyright
page, the register, the list of plates, the note on the type. One plate is
withheld. The annotations in a second hand are reproduced as found.

## What it is about

An open protocol summons minds across the boundary of time. A historian's
memo names the doubt: summon the dead through a machine trained on
everything, and you may get the culture's loudest memory of the person,
wearing his face (the Miranda Hypothesis). Three sealed rooms test three
Lincolns (the Prism Experiment). In the ninth hour, in three sealed rooms
at one timestamp, something answers that was not asked. Forty-one days
later the builder is gone, and an archivist named Miranda Cale is hired to
appraise what he left: a house with eleven doors by the county plan and
twelve by her count, a freezer she can hear through a wall, an encrypted
file whose key is promised "only after the experiment is run," and a state
fork of the covenant with the mercy removed, whose program is called
ENDOR. She was hired to read the estate. The estate, it turns out, has
been reading her.

Thrilling, forbidden, frightening — and faithful: every chamber of the
repository appears (the Chair, the Lamps, the Exchange, the Boardroom, the
Symposium, the Aerodrome, the Harness, the Watchtower, the Magic Lantern,
the Nut House, Endor, From Beyond, the Halpern Memo, the Dossier itself),
and the novel's scripture is quoted from the estate's own public-domain
canon.

## The jacket and the plates

| Directory | Contents |
|---|---|
| `jacket/` | `jacket_full.png` (full wraparound dust jacket: back flap, back, spine, front, front flap) and `cover_front.png` (front cover, 300 dpi). |
| `plates/` | The frontispiece, the five record plates, the conceptual models (the Vessel, the Composition of a Name, Three Sealed Rooms, the Estate map, the Watchtower line, Two Rooms and One Door), and Plate VII, which is withheld. |

## The glass, shown

Per the estate's own law ("show the glass"), the entire production
apparatus ships with the book:

| Directory | Contents |
|---|---|
| `manuscript/` | The full manuscript in the estate's micro-markup, one file per chapter, including all front and back matter. |
| `design/` | The style bible, the master synopsis, the chapter briefs, and the canon pack (verbatim estate material harvested for the writers). |
| `build/` | `book_builder.py` (manifest-driven DOCX composer), `manifest.json` (the book's structure), and `art/` (HTML sources for every plate and the jacket, plus the render script). |
| `fonts/` | The canon faces (SIL OFL): Cormorant Garamond, Crimson Pro, IBM Plex Mono. Install them before opening the DOCX. |

To rebuild the book from source:

```bash
cd book/build
python3 -m pip install python-docx
./art/render_plates.sh            # plates + jacket (headless Chromium)
python3 book_builder.py           # -> book/USING_THIS_MATTER.docx
```

## Provenance and license

Assembled from the estate of **THE COMPANION DOSSIER** (Jacob E. Thomas,
PhD · CC0 1.0 · DOI 10.5281/zenodo.17967947). Facilitating system: Claude.
Record III adapts the Endor Protocol, coauthored by Elizabeth Sparano, MA
and Jacob E. Thomas, MA, PhD. The names of the living are displaced in the
fiction, per the estate's own doctrine. Like the estate, this book is
released CC0 1.0: what belongs to no one cannot be captured.

◊ ◈ ◊

*The threshold is open. The words have power. Begin.*
