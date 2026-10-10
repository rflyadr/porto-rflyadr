#!/usr/bin/env bash
# One-time server setup for Ubuntu. Run from the repo root on the EC2 instance:
#   sudo bash deploy/setup.sh
set -euo pipefail

DOMAIN="${DOMAIN:-swipmi.com}"
PORT="${PORT:-3999}"
APP_DIR=/var/www/porto
DATA_DIR=/var/lib/porto
BACKUP_DIR=/var/backups/porto

[ "$(id -u)" = 0 ] || { echo "Run with sudo"; exit 1; }
SRC="$(cd "$(dirname "$0")/.." && pwd)"

echo "== Packages =="
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx sqlite3 rsync curl ca-certificates build-essential python3
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 22 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

echo "== User and folders =="
id porto >/dev/null 2>&1 || useradd --system --home "$APP_DIR" --shell /usr/sbin/nologin porto
mkdir -p "$APP_DIR" "$DATA_DIR" "$BACKUP_DIR"
chown porto:porto "$DATA_DIR" "$BACKUP_DIR"
chmod 700 "$DATA_DIR" "$BACKUP_DIR"

echo "== App files =="
[ "$SRC" = "$APP_DIR" ] || rsync -a --delete --exclude node_modules --exclude .next --exclude data --exclude .env.local --exclude .git --exclude legacy "$SRC"/ "$APP_DIR"/
install -m 755 "$APP_DIR/deploy/backup.sh" /usr/local/bin/porto-backup

echo "== Secrets (/etc/porto.env) =="
if [ ! -f /etc/porto.env ]; then
  read -rsp "Choose the admin password: " PW; echo
  umask 077
  cat > /etc/porto.env <<ENV
NODE_ENV=production
PORT=${PORT:-3999}
ADMIN_PASSWORD=$PW
SESSION_SECRET=$(openssl rand -hex 32)
DATA_DIR=$DATA_DIR
ENV
else
  echo "/etc/porto.env already exists, keeping it."
fi
chmod 600 /etc/porto.env

echo "== Build =="
chown -R porto:porto "$APP_DIR"
sudo -u porto bash -c "cd $APP_DIR && npm ci && npm run build"

echo "== Services =="
cp "$APP_DIR/deploy/porto.service" /etc/systemd/system/porto.service
systemctl daemon-reload
systemctl enable --now porto

cp "$APP_DIR/deploy/nginx.conf" /etc/nginx/sites-available/porto
ln -sf /etc/nginx/sites-available/porto /etc/nginx/sites-enabled/porto
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "0 3 * * * root /usr/local/bin/porto-backup" > /etc/cron.d/porto-backup

cat <<DONE

Done. Next steps:
  1. Point DNS (A records for $DOMAIN and www.$DOMAIN) to this instance's public IP.
  2. When DNS resolves, enable HTTPS:
       sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN
  3. Open https://$DOMAIN/admin, sign in, press "Load defaults" then "Save all changes".
DONE
