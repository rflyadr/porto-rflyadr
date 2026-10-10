# Deploy to EC2 (Ubuntu) – swipmi.com

Everything runs on the one instance: Nginx → Next.js (systemd) → SQLite + uploads in `/var/lib/porto`.

## EC2 prerequisites
- Security group: inbound 80 and 443 from anywhere, 22 only from your IP.
- Attach an Elastic IP, then point DNS **A records** for `swipmi.com` and `www.swipmi.com` to it.
- Keep the EBS volume when stopping the instance; terminating it deletes your data.

## First time
```bash
# on your machine: copy the project (without node_modules / .next / data)
rsync -a --exclude node_modules --exclude .next --exclude data --exclude .env.local ./ ubuntu@swipmi.com:~/porto/

# on the server
cd ~/porto && sudo bash deploy/setup.sh        # asks for the admin password
sudo certbot --nginx -d swipmi.com -d www.swipmi.com   # once DNS resolves
```
Then open `https://swipmi.com/admin`, sign in, press **Load defaults** → **Save all changes**.

## Updating the site
Re-run the `rsync` above, then on the server: `cd ~/porto && sudo bash deploy/deploy.sh`.

## Where things are
| What | Path |
|---|---|
| App | `/var/www/porto` |
| Database + uploads | `/var/lib/porto` (`porto.db`, `uploads/`) |
| Secrets | `/etc/porto.env` (change the password here, then `sudo systemctl restart porto`) |
| Logs | `journalctl -u porto -f` |
| Backups | `/var/backups/porto/porto-YYYY-MM-DD.tar.gz` (nightly 03:00, last 14 kept) |

## Backups off the instance
The nightly copies live on the same disk. Now and then pull one to your laptop:
```bash
scp ubuntu@swipmi.com:/var/backups/porto/porto-$(date +%F).tar.gz .
```
Restore: stop the service, extract into `/var/lib/porto` (owner `porto`), start it.
