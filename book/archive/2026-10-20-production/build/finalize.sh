#!/usr/bin/env bash
# Final audit + assembly for USING THIS MATTER.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
BOOK="$(dirname "$HERE")"
MS="$BOOK/manuscript"

echo "== 1. completeness =="
missing=0
for f in $(python3 -c "
import json
m = json.load(open('$HERE/manifest.json'))
files = [b['file'] for b in m['front_matter'] if b['type']=='file']
for p in m['parts']: files += p['chapters']
files += [b['file'] for b in m['back_matter']]
print(' '.join(files))"); do
  if [ ! -f "$MS/$f" ]; then echo "MISSING: $f"; missing=1; fi
done
[ "$missing" -eq 0 ] && echo "all manifest files present" || exit 1

echo "== 2. covenant audit =="
if grep -l '—' "$MS"/*.md; then echo "EM DASHES FOUND ^"; exit 1; else echo "no em dashes"; fi
for f in "$MS"/*.md; do
  n=$(grep -c '^:::' "$f" || true)
  if [ $((n % 2)) -ne 0 ]; then echo "UNBALANCED ::: in $(basename "$f") ($n)"; exit 1; fi
done
echo "all ::: blocks balanced"

echo "== 3. figure references =="
grep -hoE '@(fig|plate):[^|]+' "$MS"/*.md | sed -E 's/@(fig|plate)://' | sort -u | while read -r png; do
  [ -f "$BOOK/plates/$png" ] || echo "MISSING PLATE: $png"
done
echo "figure refs checked"

echo "== 4. build =="
python3 "$HERE/book_builder.py" "$HERE/manifest.json" "$BOOK/USING_THIS_MATTER.docx"

echo "== 5. proof =="
HOME=/tmp soffice -env:UserInstallation=file:///tmp/lo_profile5 --headless \
  --convert-to pdf --outdir "$BOOK" "$BOOK/USING_THIS_MATTER.docx" >/dev/null 2>&1
python3 -c "
import fitz
d = fitz.open('$BOOK/USING_THIS_MATTER.pdf')
print('FINAL PAGE COUNT:', d.page_count)
w = sum(len(pg.get_text().split()) for pg in d)
print('approx words on pages:', w)"
echo done
