# Endor Protocol · art assets

The experience is complete with no images at all. Everything you see by
default is drawn in code: layered gradients for the parchment, an SVG grain
filter for the foxing, and inline engraving plates for the chapter emblems.

These slots are optional enhancements. Drop a file in here with the exact
name below, switch the matching line on, and it layers in. Leave a slot empty
and the coded fallback stands on its own with nothing missing. Nothing breaks
if a file is absent, because the slots default to `none`.

Keep everything in the engraved, aged, fine-press register. No photographs of
modern things. No text baked into the images. No em dashes in any filename.

## The slots

| File (exact name)        | Where it lands                         | Format     | Size (px)        |
| ------------------------ | -------------------------------------- | ---------- | ---------------- |
| `parchment.webp`         | the whole reading leaf (paper itself)  | webp/jpg   | 1600 x 2000      |
| `chamber-haze.webp`      | behind the ember in the live chamber   | webp/jpg   | 2000 x 1400      |

Two more are wired by hand-swap, not by a slot, if you want them later
(see "Frontispiece and plates" below): the cover emblem and the eight chapter
emblems.

## How to switch a slot on

Open `index.html`, find the `:root { ... }` block near the top of the
`<style>`, and set the variables. Only set the ones whose files you have
added. For the parchment, also turn the blend on so the scan reads as printed
paper rather than a sticker laid on top:

```css
:root {
  /* paper */
  --leaf-texture: url("assets/parchment.webp");
  --leaf-blend: multiply;

  /* chamber atmosphere (generate it already very dark) */
  --chamber-haze: url("assets/chamber-haze.webp");
}
```

That is the whole activation. Reload at the cover and read through.

## Frontispiece and plates (optional, by hand-swap)

The cover emblem and the eight chapter emblems are inline `<svg><use .../></svg>`
blocks. To replace one with generated art, swap that single block for an
`<img>` and keep the same wrapper class so the sizing holds, for example:

```html
<!-- cover, inside <figure class="frontis"> -->
<img src="assets/frontispiece.webp" alt="" />

<!-- a chapter, inside <figure class="plate"> -->
<img src="assets/plate-1.webp" alt="" />
```

Suggested names if you go this route: `frontispiece.webp` (square, 1200 x 1200)
and `plate-1.webp` through `plate-8.webp` (square, 900 x 900). Each should read
as a single engraved emblem on a transparent or parchment ground, matching the
existing roundel plates already in the file.

## Notes

- Prefer `webp` for weight; `jpg` is fine. Avoid `png` for the large paper
  scan (too heavy). Transparent `png` is good for the emblems only.
- The site holds no browser storage and ships these files as plain static
  assets, so a generated image is committed like any other file.
