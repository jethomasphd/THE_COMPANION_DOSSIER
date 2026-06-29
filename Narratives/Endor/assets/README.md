# Endor Protocol · art assets

The experience is complete with no images at all. Everything you see by
default is drawn in code: layered gradients for the parchment, an SVG grain
filter for the foxing, and inline engraving plates for the chapter emblems.

These three slots are pre-wired. They are already switched on in the markup,
pointing at the exact filenames below. Drop a file in here with the matching
name and it activates on the next load. Leave a slot empty and the coded
fallback stands on its own with nothing missing, because a missing file just
fails to load and the gradient or line plate underneath remains. Nothing
breaks before the files are added.

Keep everything in the engraved, aged, fine-press register. No photographs of
modern things. No text baked into the images. No em dashes in any filename.

## The slots (already wired, just add the file)

| File (exact name)   | Where it lands                              | Size (px)    |
| ------------------- | ------------------------------------------- | ------------ |
| `parchment.jpg`     | the reading leaf (the paper itself)         | 1600 x 2000  |
| `chamber-haze.jpg`  | behind the breathing ember in the chamber   | 2000 x 1400  |
| `frontispiece.png`  | the cover emblem (replaces the line plate)  | 1200 x 1200  |

The cover frontispiece swaps in automatically: the `<img>` shows when the file
is present, and removes itself (falling back to the engraved line plate) when
it is not.

## Notes

- `jpg` is fine for the two large backgrounds; `png` is good for the cover
  emblem if you want a transparent ground. Avoid a heavy `png` for the paper.
- If you would rather use different filenames or formats, change the three
  references in `index.html` (the `--leaf-texture` and `--chamber-haze`
  variables in `:root`, and the `<img src>` in the cover figure).
- The site holds no browser storage and ships these files as plain static
  assets, so a generated image is committed like any other file.

## Optional, by hand-swap: the eight chapter emblems

The chapter emblems are inline `<svg><use .../></svg>` blocks. To replace one
with generated art, swap that single block for an `<img>` inside the same
`<figure class="plate">` wrapper, for example:

```html
<img src="assets/plate-1.webp" alt="" />
```

Suggested names: `plate-1.webp` through `plate-8.webp`, square, about 900 x 900,
each a single engraved emblem matching the existing roundel plates.
