#!/usr/bin/env bash
# Build the read-only GitHub Pages copy from content/site.json.
# The admin and API routes are moved aside for the build, then restored.
set -euo pipefail
cd "$(dirname "$0")/.."

STASH=".static-stash"
# .next holds generated route types for the files we are about to move.
rm -rf "$STASH" out .next && mkdir -p "$STASH"
restore() {
  for f in "app/layout.tsx" "app/(site)/portfolio/[id]/page.tsx"; do
    [ -f "$STASH/$(basename "$f").bak" ] && mv "$STASH/$(basename "$f").bak" "$f" || true
  done
  [ -d "$STASH/(admin)" ] && mv "$STASH/(admin)" "app/(admin)" || true
  [ -d "$STASH/api" ] && mv "$STASH/api" app/api || true
  [ -d "$STASH/uploads" ] && mv "$STASH/uploads" app/uploads || true
  rm -rf "$STASH"
}
trap restore EXIT

mv "app/(admin)" "$STASH/(admin)"
mv app/api "$STASH/api"
mv app/uploads "$STASH/uploads"

# `dynamic = 'force-dynamic'` must be a literal, so swap it out for the export.
DYN_FILES=("app/layout.tsx" "app/(site)/portfolio/[id]/page.tsx")
for f in "${DYN_FILES[@]}"; do
  cp "$f" "$STASH/$(basename "$f").bak"
  sed -i "s/export const dynamic = 'force-dynamic';/export const dynamic = 'force-static';/" "$f"
done

STATIC_EXPORT=1 \
  PAGES_BASE_PATH="${PAGES_BASE_PATH:-}" \
  NEXT_PUBLIC_BASE_PATH="${PAGES_BASE_PATH:-}" \
  npx next build
echo "Static site written to out/"
