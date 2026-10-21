# Plate XI: map accuracy and reading audit

The 21 October 2026 revision changes only the map and key on printed pages xii–xiii (PDF pages 12–13). All 302 other page content streams, the 304-page pagination, and the selected cover remain unchanged. Current upload files remain at the root of `/book`.

## Findings and corrections

1. **Kitchen / utility / garage.** The preceding redraw moved doors 2 and 3 onto horizontal partitions, where they no longer connected the spaces named in the schedule. They now cross the correct vertical walls. The original deposited HTML already specified vertical openings here.
2. **En-suite access.** The preceding redraw extended the small bath's side partition through the bedroom, creating a trapped strip. The en-suite partition now ends at the bath and its door opens into bedroom 3.
3. **Linen and study.** The original plate's placement did not clearly match the narrative's linen closet "across from the study" (p. 6). The editorial schematic now places those doors opposite one another, retaining the linen/server-rack and study/rite associations. This is a correction to the schematic's arrangement, not an assertion that a measured survey was available.
4. **Circulation and exterior access.** Unnumbered passages connect the entry and common rooms; the kitchen's yard access and the garage side door are shown. These routes are needed for a usable schematic and are distinguished from counted interior doors. The text supplies the exterior routes, not their precise jamb coordinates.
5. **Eleven and twelve.** The county layer has doors 1–11. Dashed ember marks the later conversion and door 12. The key preserves the county count of eleven, Miranda's first count of twelve, and her recount of eleven. The later annotation is not mislabeled as part of the August 2019 county drawing or treated as an independently verified resolution.
6. **Reading at print size.** The map includes room names as well as letters. The key lists each doorway's endpoints, and door 10 is drawn as one opening with folding leaves. Door numbers and labels were separated from swing arcs and walls after visual review.

## Narrative evidence

| Printed page | Constraint |
|---|---|
| 5 | Three bedrooms open off the back hall. The utility hall runs between kitchen and garage. The garage door is initially locked. |
| 6 | Linen/server closet across from study; county plan 11, first walk 12, physical recount 11. |
| 7 | Bifold doors are the proposed counting explanation. Study is at the end of the hall. County drawing revised August 2019. |
| 14 | The second hand reports a later garage conversion and a cold room framed in the second spring. |
| 46 | Kitchen door to the yard; garage side door; chest freezer against the house wall. |
| 201 | Thorne's postscript asserts twelve. This later claim does not replace the initial counting record. |
| 257 | The child counts twelve; the narrative expressly keeps the alternative explanations open. |

All thirteen room-to-estate-name associations are retained from the deposited plate. Neither the novel nor its original schematic supplies measured dimensions. Exact sizes, door-swing directions, unnumbered passage positions, and exterior-jamb positions remain editorial diagramming choices. The map is explicitly labeled a schematic, not to scale. It preserves the story's uncertainty without using accidental drafting errors to create it.

## Files and verification

`MAP_AND_KEY_REVIEW.pdf` is the corrected two-page spread. `sources/original_map.html` preserves the original deposited drawing for comparison. `sources/map_checks.json` records the narrative references and doorway connections. `sources/print_checks.json` records the page, font, margin, and preservation checks.

Every numbered door was checked against the two spaces on either side of its actual drawn opening. Every room is reachable from the entry through the specified openings. The linen and study doors face one another. Both pages were rendered with Poppler and visually inspected; the map was inspected again after spacing fixes. KDP Previewer and a physical proof remain unchecked.

## Rebuild order

Rebuild the navigation-and-plates edition first if necessary, following `../2026-10-20-navigation-and-plates/README.md`. Then apply this correction last. From this directory, with a local copy of the previous interior named `prior_interior.pdf`:

```text
python sources/revise_map.py --input prior_interior.pdf --output ../../USING_THIS_MATTER_KDP_interior_304pp.pdf --proof MAP_AND_KEY_REVIEW.pdf --fonts ../2026-10-20-production/publication/sources/fonts --report rebuilt_map_checks.json

python sources/check_map_release.py --input ../../USING_THIS_MATTER_KDP_interior_304pp.pdf --baseline prior_interior.pdf --report rebuilt_print_checks.json
```

The pre-map-revision interior is preserved in Git at commit `442ab1fddbcab49eccf13afc45f0db4116a35262`, path `book/USING_THIS_MATTER_KDP_interior_304pp.pdf`. The two earlier archive directories remain unchanged.
