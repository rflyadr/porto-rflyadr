#!/usr/bin/env bash
# Update the running site after you changed code. Run from the repo on the server:
#   sudo bash deploy/deploy.sh
set -euo pipefail
APP_DIR=/var/www/porto
SRC="$(cd "$(dirname "$0")/.." && pwd)"
[ "$SRC" = "$APP_DIR" ] || rsync -a --delete --exclude node_modules --exclude .next --exclude data --exclude .env.local --exclude .git --exclude legacy "$SRC"/ "$APP_DIR"/
chown -R porto:porto "$APP_DIR"
sudo -u porto bash -c "cd $APP_DIR && npm ci && npm run build"
systemctl restart porto
echo "Deployed."
