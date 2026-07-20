# AIO Training — Production Deployment Guide

This app is a Next.js 16 site with a SQLite database (via Prisma), admin portal,
public booking, and Stripe checkout for the Football Skills Group Session.

## Important: how data works

The SQLite database file (`dev.db`) is **gitignored — it does not travel with the
code**. Every fresh clone/deploy starts with no database until you run the setup
steps below. On the production server the DB file lives on disk next to the app;
**back it up regularly** (it contains all bookings, customers, and events).

Uploaded event flyers land in `public/assets/uploads/` — that folder is also
production data. Back it up together with the DB.

## Hosting requirements

Because of SQLite + local file uploads, deploy to a host with a **persistent
filesystem and a single instance** — a VPS (DigitalOcean, Hetzner, Lightsail),
Railway/Render with a persistent disk, etc.

> ⚠️ **Vercel/Netlify will NOT work as-is** — their filesystems are ephemeral, so
> the database and uploaded flyers would be wiped on every deploy. Moving to
> Postgres (e.g. Neon) + blob storage would be required first.

## One-time setup on the server

1. **Install Node 22+** and clone the repo.

2. **Create `.env`** in the project root (copy from `.env.example`):

   ```env
   DATABASE_URL="file:./dev.db"
   SESSION_SECRET="<run: openssl rand -hex 32>"
   ADMIN_EMAIL="<login email for the admin portal>"
   ADMIN_PASSWORD="<strong password>"
   STRIPE_SECRET_KEY="sk_live_..."
   ```

   - `SESSION_SECRET` must be at least 32 chars — the app refuses to start without it.
   - Stripe live keys come from <https://dashboard.stripe.com/apikeys>; the group session
     checkout charges the app's configured flat registration amount.

3. **Create the database and seed the group session event:**

   ```bash
   npm install
   npm run db:push
   npm run db:seed
   ```

4. **Build and start:**

   ```bash
   npm run build
   npm start          # serves on port 3000
   ```

   Keep it alive with a process manager, e.g. `pm2 start npm --name aio -- start`.

## Hooking up the domain

1. Point the domain's **A record** at the server IP (both `trainingaio.com` and `www`).
2. Put **nginx or Caddy** in front as a reverse proxy to `localhost:3000` with HTTPS.
   Caddy is the least-effort option — automatic HTTPS:

   ```
   # /etc/caddy/Caddyfile
   trainingaio.com, www.trainingaio.com {
       reverse_proxy localhost:3000
   }
   ```

3. The session cookie is `secure` in production, so HTTPS is required for admin login.

## Day-to-day: how the team uses the site

- **Admin portal:** `https://trainingaio.com/admin` — log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- **Add bookable times:** Dashboard → **Calendar** → add slots (date, time, type,
  capacity). Those slots immediately appear on the public `/booking` page.
- **Handle requests:** Dashboard → **Bookings** — new requests arrive with status
  `new`; work them through `contacted → confirmed → completed`.
- **Events:** Dashboard → **Events** — add/remove events with flyer uploads; they
  appear on `/events` instantly.
- **Customers:** Dashboard → **Customers** — contact info from every booking.

## Updating the site later

```bash
git pull
npm install
npm run db:push   # applies any schema changes, keeps data
npm run build
pm2 restart aio
```

## Backups (do this)

Cron a nightly copy of the two data locations, e.g.:

```bash
0 3 * * * cp /path/to/app/dev.db /backups/aio-$(date +\%F).db && cp -r /path/to/app/public/assets/uploads /backups/uploads-$(date +\%F)
```
