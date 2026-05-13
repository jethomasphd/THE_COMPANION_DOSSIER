#!/usr/bin/env bash
# The Pantheon — portrait downloader.
#
# Run from anywhere; outputs into this script's directory.
#   ./The_Pantheon/fetch_portraits.sh
#
# Idempotent: existing files are skipped. Requires curl and python3.
# After it completes, `git add The_Pantheon/*.jpg *.jpeg` and commit.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

UA="companion-dossier/1.0 (https://github.com/jethomasphd/THE_COMPANION_DOSSIER; JEThomasPhD@gmail.com)"

# slug | output filename | explicit url (empty => resolve via Wikipedia summary API)
PORTRAITS=(
  # ── The Chair / Committee of Patriots ──
  "George_Washington|George_Washington.jpg|https://upload.wikimedia.org/wikipedia/commons/b/b6/Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg"
  "Alexander_Hamilton|Alexander_Hamilton.jpg|https://upload.wikimedia.org/wikipedia/commons/0/05/Alexander_Hamilton_portrait_by_John_Trumbull_1806.jpg"
  "Thomas_Jefferson|Thomas_Jefferson.jpg|https://upload.wikimedia.org/wikipedia/commons/0/07/Official_Presidential_portrait_of_Thomas_Jefferson_%28by_Rembrandt_Peale%2C_1800%29.jpg"
  "Benjamin_Franklin|Benjamin_Franklin.jpg|https://upload.wikimedia.org/wikipedia/commons/2/25/Benjamin_Franklin_by_Joseph_Duplessis_1778.jpg"

  # ── The Halpern Memo (curated historical portraits) ──
  "Abraham_Lincoln|Abraham_Lincoln.jpg|https://upload.wikimedia.org/wikipedia/commons/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg"
  "Theodore_Roosevelt|Theodore_Roosevelt.jpg|https://upload.wikimedia.org/wikipedia/commons/5/5b/Theodore_Roosevelt_by_the_Pach_Bros.jpg"
  "Franklin_D_Roosevelt|Franklin_D_Roosevelt.jpg|https://upload.wikimedia.org/wikipedia/commons/4/42/FDR_1944_Color_Portrait.jpg"
  "William_Lloyd_Garrison|William_Lloyd_Garrison.jpg|https://upload.wikimedia.org/wikipedia/commons/c/c6/William_Lloyd_Garrison%2C_abolitionist%2C_journalist%2C_and_editor_of_The_Liberator_LCCN2017660623_%28cropped%29.jpg"
  "Eugene_V_Debs|Eugene_V_Debs.jpeg|https://upload.wikimedia.org/wikipedia/commons/a/a6/Eugene_Debs_portrait.jpeg"
  "Martin_Luther_King_Jr|Martin_Luther_King_Jr.jpg|https://upload.wikimedia.org/wikipedia/commons/0/05/Martin_Luther_King%2C_Jr..jpg"

  # ── Latent Dialogic Space ──
  "Tony_Stark|Tony_Stark.jpg|https://upload.wikimedia.org/wikipedia/en/f/f2/Robert_Downey_Jr._as_Tony_Stark_in_Avengers_Infinity_War.jpg"

  # ── The 5 Lamps (lead image via Wikipedia summary API) ──
  "Hippocrates|Hippocrates.jpg|"
  "John_Snow|John_Snow.jpg|"
  "Michael_Marmot|Michael_Marmot.jpg|"
  "Carl_Jung|Carl_Jung.jpg|"
  "Paul_Farmer|Paul_Farmer.jpg|"

  # ── The Boardroom (Lincoln & TR already curated above) ──
  "Steve_Jobs|Steve_Jobs.jpg|"
  "Warren_Buffett|Warren_Buffett.jpg|"
  "Henry_Ford|Henry_Ford.jpg|"
  "Andrew_Carnegie|Andrew_Carnegie.jpg|"
  "Thomas_Edison|Thomas_Edison.jpg|"
  "Walt_Disney|Walt_Disney.jpg|"

  # ── The Symposium ──
  "Socrates|Socrates.jpg|"
  "Maria_Montessori|Maria_Montessori.jpg|"
  "John_Dewey|John_Dewey.jpg|"
  "Ada_Lovelace|Ada_Lovelace.jpg|"
  "Paulo_Freire|Paulo_Freire.jpg|"
)

resolve_via_api() {
  local slug="$1"
  local encoded
  encoded=$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=""))' "$slug")
  curl -fsSL -H "User-Agent: $UA" \
    "https://en.wikipedia.org/api/rest_v1/page/summary/$encoded" \
    | python3 -c '
import json, sys, re
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(1)
src = (d.get("thumbnail") or {}).get("source") or (d.get("originalimage") or {}).get("source")
if not src:
    sys.exit(2)
print(re.sub(r"/\d+px-", "/600px-", src))
'
}

ok=0
skipped=0
failed=0
for entry in "${PORTRAITS[@]}"; do
  IFS='|' read -r slug filename explicit_url <<< "$entry"

  if [ -s "$filename" ]; then
    printf "  · %-32s already present\n" "$filename"
    skipped=$((skipped + 1))
    continue
  fi

  img_url="$explicit_url"
  if [ -z "$img_url" ]; then
    img_url="$(resolve_via_api "$slug" 2>/dev/null || true)"
  fi

  if [ -z "$img_url" ]; then
    printf "  ✗ %-32s could not resolve image url\n" "$slug"
    failed=$((failed + 1))
    continue
  fi

  if curl -fsSL -H "User-Agent: $UA" "$img_url" -o "$filename.part"; then
    mv "$filename.part" "$filename"
    bytes=$(wc -c < "$filename")
    printf "  ✓ %-32s %s KB\n" "$filename" "$((bytes / 1024))"
    ok=$((ok + 1))
  else
    rm -f "$filename.part"
    printf "  ✗ %-32s download failed: %s\n" "$slug" "$img_url"
    failed=$((failed + 1))
  fi
done

echo
echo "Pantheon: $ok downloaded, $skipped already present, $failed failed."
[ "$failed" -eq 0 ]
