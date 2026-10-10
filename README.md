# Portfolio – Next.js (frontend + backend)

- `app/`, `components/`, `lib/` – the site (same look as the original template; CSS in `public/assets`).
- `app/api/*` – the backend: content API, admin login, file upload.
- `lib/store.ts` – storage: `data/porto.db` (SQLite) + `data/uploads/`.
- `/admin` – password-protected editor for Hero, About and Site settings.
- `legacy/` – the original static HTML, kept for reference.

## Run locally
```bash
npm install
cp .env.example .env.local   # set ADMIN_PASSWORD and SESSION_SECRET
npm run dev                  # http://localhost:3000   (admin at /admin)
```
First time in `/admin`: press **Load defaults** then **Save all changes**. Until something is saved the site shows the defaults from `lib/defaults.ts`.

## Deploy (EC2)
See DEPLOY.md. The summary below is the manual version.

Needs a host with a persistent disk (an EC2 instance is fine), because the database and uploads are files:
```bash
npm ci && npm run build
DATA_DIR=/var/lib/porto npm start     # set ADMIN_PASSWORD, SESSION_SECRET in the environment
```
Back up `DATA_DIR`.

## Two deployments from one codebase

| | Live site | Static copy |
|---|---|---|
| Where | EC2 (`swipmi.com`) | GitHub Pages (`rflyadr.github.io/porto-rflyadr`) |
| Content | SQLite, edited at `/admin` | `content/site.json`, committed |
| Admin / uploads | yes | no |

### Updating the static copy
1. Open `https://swipmi.com/api/export` and copy the JSON.
2. Paste it into `content/site.json`.
3. Commit and push — GitHub Actions rebuilds and publishes Pages.

Build it locally with `PAGES_BASE_PATH=/porto-rflyadr npm run build:static` (output in `out/`).

**Images:** files uploaded through the admin live on the server, not in the repo, so
they will not appear in the static copy. Images under `public/assets/` work in both.
