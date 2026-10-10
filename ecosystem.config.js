// PM2 process definition.
//
//   npm ci && npm run build        # once, and after every git pull
//   pm2 start ecosystem.config.js  # then: pm2 save
//
// Secrets do NOT belong in this file (it is committed). Put them in
// .env.production.local next to it, which Next.js loads automatically
// and .gitignore already excludes:
//
//   ADMIN_PASSWORD=...
//   SESSION_SECRET=...      # openssl rand -hex 32
//   DATA_DIR=/var/lib/porto # keep content outside the repo
module.exports = {
  apps: [
    {
      name: 'porto',
      // `next start` serves the production build; never `next dev`.
      script: 'node_modules/next/dist/bin/next',
      args: 'start -H 127.0.0.1 -p 3999',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3999,
      },
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      time: true,
    },
  ],
};
