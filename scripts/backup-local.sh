#!/usr/bin/env bash
# Snapshot the local admin content + uploads into .backups/ (keeps 20).
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f data/porto.db ] || { echo "no data/porto.db yet"; exit 0; }
mkdir -p .backups
STAMP=$(date +%Y%m%d-%H%M%S)
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
sqlite3 data/porto.db ".backup '$TMP/porto.db'" 2>/dev/null || cp data/porto.db "$TMP/porto.db"
[ -d data/uploads ] && cp -a data/uploads "$TMP/uploads"
tar -czf ".backups/porto-$STAMP.tar.gz" -C "$TMP" .
ls -1t .backups/porto-*.tar.gz | tail -n +21 | xargs -r rm --
echo "saved .backups/porto-$STAMP.tar.gz"
