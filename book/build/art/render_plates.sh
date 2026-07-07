#!/usr/bin/env bash
# Render every plate HTML to PNG via headless Chromium.
# Usage: ./render_plates.sh [file.html ...]   (no args = render all)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../../plates"
JACKET="$HERE/../../jacket"
mkdir -p "$OUT" "$JACKET"
CHROME=/opt/pw-browsers/chromium

render() {
  local html="$1" w="$2" h="$3" dest="$4"
  "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
    --force-device-scale-factor=1 \
    --screenshot="$dest" --window-size="${w},${h}" "file://$html" 2>/dev/null
  echo "rendered $(basename "$dest") (${w}x${h})"
}

declare -A SIZE=(
  [jacket_full]="4000x1900:jacket"
  [cover_front]="1800x2700:jacket"
  [plate_frontispiece]="1300x1750:plates"
  [plate_part1_atrium]="1300x1750:plates"
  [plate_part2_prism]="1300x1750:plates"
  [plate_part3_freezer]="1300x1750:plates"
  [plate_part4_watchtower]="1300x1750:plates"
  [plate_part5_chamber]="1300x1750:plates"
  [plate_withheld]="1300x1750:plates"
  [plate_anatomy]="1300x1620:plates"
  [plate_prism]="1300x1620:plates"
  [plate_estate_map]="1300x1620:plates"
  [plate_endor]="1300x1620:plates"
  [plate_miranda]="1300x1500:plates"
  [plate_watchtower]="1300x1500:plates"
)

FILES=("$@")
if [ ${#FILES[@]} -eq 0 ]; then
  FILES=()
  for k in "${!SIZE[@]}"; do FILES+=("$HERE/$k.html"); done
fi

for f in "${FILES[@]}"; do
  case "$f" in /*) ;; *) f="$HERE/$f";; esac
  base="$(basename "$f" .html)"
  spec="${SIZE[$base]:-}"
  [ -z "$spec" ] && { echo "skip $base (no size)"; continue; }
  wh="${spec%%:*}"; where="${spec##*:}"
  w="${wh%x*}"; h="${wh#*x}"
  destdir="$OUT"; [ "$where" = jacket ] && destdir="$JACKET"
  render "$f" "$w" "$h" "$destdir/$base.png"
done
