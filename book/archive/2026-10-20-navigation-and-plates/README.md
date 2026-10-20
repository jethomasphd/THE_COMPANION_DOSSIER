# Navigation, evidence plates, and author note

Production revision of the 304-page premium-color hardcover, 20 October 2026. The release PDFs remain directly in `/book`. The selected **A · Archive Sculpture** cover is unchanged.

## Changes

- Added page references for all 37 chapters, five Records, front and back matter, and all 13 plates. Accession references remain beside the folios.
- Applied one documentary treatment across the frontispiece, five Record-opening plates, six inline figures, and estate map spread: pale archival paper, dark ink, restrained ember, and the same three type families.
- Reworked the opening evidence leaves around relationships in the existing manuscript: invocation and departure; discrepant counts and correction; corpus inclusion and exclusion; retained mechanics and removed permissions; the preservation of blanks and redactions beside the cost of publication; and the transfer of the power to end a session.
- Replaced the six inline bitmap figures with native vector artwork in the same rectangles. Surrounding narrative text and folios did not move. Plate VII keeps its dark withheld field inside the shared paper frame.
- Preserved the estate map geometry and door schedule. The Watchtower chart uses exactly the 199 observations in the deposited source, without smoothing or invented values. The corpus-weight illustration remains explicitly illustrative, with exact proportions unknown.
- Added the author-supplied biography, condensed, on the previously blank page 287. It is included in the contents and retailer text.

The editorial collations are new arrangements of existing evidence, not newly discovered documents or additional empirical findings. No new attributed marginalia were invented. All 23 quotations on the six collations and the three-room figure were checked against the existing manuscript.

## Review and checks

`RELEASE_CHANGES_REVIEW.pdf` contains all 18 changed pages: numbered navigation, the complete plate sequence, and the author note on the last page. `author_note.txt` is the same biography in plain text.

The release remains 304 pages at 6 × 9 inches. All fonts are embedded; no active transparency, annotations, folio errors, or text-margin violations were found. Minimum remaining raster resolution is 301.18 ppi, on the unchanged cover. All 286 other page content streams match the prior master. The Halpern Memo acknowledgment and Hale's revised October illness introduction remain intact. KDP Print Previewer and a physical proof have not been checked.

Source and validation files are in `sources/`. The immutable pre-revision master and fonts are in `../2026-10-20-production/publication/`.

## Rebuild

Requires Python with ReportLab, pypdf and pdfplumber. From this archive directory, run these commands in order. Intermediate files are written here; move them into a local scratch directory if preferred.

```text
python sources/build_plates.py --input ../2026-10-20-production/publication/USING_THIS_MATTER_KDP_interior_304pp.pdf --output intermediate.pdf --proof plates_review.pdf --fonts ../2026-10-20-production/publication/sources/fonts --sources sources --map-source sources/map_geometry.py --qa rebuilt_plate_checks.json

python sources/build_navigation.py --input intermediate.pdf --output ../../USING_THIS_MATTER_KDP_interior_304pp.pdf --fonts ../2026-10-20-production/publication/sources/fonts --data sources/navigation.json --proof navigation_review.pdf

python sources/preflight_release.py --interior ../../USING_THIS_MATTER_KDP_interior_304pp.pdf --cover ../../USING_THIS_MATTER_KDP_hardcover_cover.pdf --baseline ../2026-10-20-production/publication/USING_THIS_MATTER_KDP_interior_304pp.pdf --report rebuilt_preflight.json
```

ReportLab PDF timestamps may vary on rebuilding; visual content and the recorded layout are deterministic. Render and inspect any later revision before promoting it to `/book`.
