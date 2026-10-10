#!/usr/bin/env bash
# Nightly backup of the database + uploads into /var/backups/porto (keeps 14).
set -euo pipefail
DATA_DIR=/var/lib/porto
OUT=/var/backups/porto
STAMP=$(date +%F)
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# .backup gives a consistent copy even while the app is running
[ -f "$DATA_DIR/porto.db" ] && sqlite3 "$DATA_DIR/porto.db" ".backup '$TMP/porto.db'"
[ -d "$DATA_DIR/uploads" ] && cp -a "$DATA_DIR/uploads" "$TMP/uploads"
tar -czf "$OUT/porto-$STAMP.tar.gz" -C "$TMP" .
chmod 600 "$OUT/porto-$STAMP.tar.gz"
ls -1t "$OUT"/porto-*.tar.gz | tail -n +15 | xargs -r rm --
