# AIO Training - Deployment and Operations

Next.js 16 app on Vercel, backed by Neon Postgres via Prisma 7. Public booking,
events, Stripe checkout, and an admin portal at `/admin`.

## Hosting

- Host: Vercel, project `aio-training`
- Domain: `trainingaio.com`, canonical host is `www.trainingaio.com`
- Deploys: automatic on every push to `main`. There is no manual deploy step.
- File uploads: Vercel Blob (admin flyer uploads). Not the local filesystem.
- Rate limiting: Upstash Redis, falls back to in-memory locally.

## The database: two branches, and why it matters

Neon project `aio-training` (`green-shadow-61415574`) has **two branches**:

| Branch | Endpoint | Used by |
| --- | --- | --- |
| `main` | `ep-green-voice-atecc73g` | **Production.** Set as `DATABASE_URL` in Vercel. Holds real bookings and customers. |
| `dev` | `ep-calm-butterfly-atvpn3gz` | **Local only.** What `.env.local` points at. Effectively a scratch copy. |

Read this twice, because it has already cost a debugging session:

- **Your local app and the live site do not share a database.** Editing content
  locally, including running the seed, changes nothing on trainingaio.com.
- **The build never seeds.** The build script is
  `prisma generate && prisma migrate deploy && next build`. Migrations run,
  seeds do not, deliberately, so a deploy can never overwrite live data.
- Therefore **`prisma/seed.ts` is dev-only scaffolding.** Treat it as a way to
  populate a fresh dev branch, never as the source of truth for the live site.

### How to change live content

Preferred: **use the admin portal** at `https://www.trainingaio.com/admin`.
Events, bookings, calendar slots, and customers are all editable there. This is
the path Jon and the trainers use, and it requires no dev involvement.

Only if the admin UI genuinely cannot express the change, write to the `main`
branch directly through the Neon console or API. Before any such write:

1. Confirm you are on branch `main`, not `dev`.
2. `SELECT` the rows first and read what is actually there. Production values
   often differ from what the seed file says, because admins have edited them.
3. Prefer targeted `UPDATE`/`INSERT` over running the seed. The seed's `upsert`
   blocks overwrite title, price, flyer, and date, which are fields real
   bookings depend on.

## Environment variables

`.env.example` is the authoritative list, with notes on each variable. Copy it
to `.env.local` for local work; set the same keys in Vercel for production.

Values differ per environment. In particular `DATABASE_URL` and `DIRECT_URL`
must point at the `dev` branch locally and the `main` branch in Vercel, and
Stripe keys must be test keys locally and live keys in production.

## Local development

```bash
npm install
npx prisma generate
npm run dev          # port 3001
```

Reseed the dev branch when it is empty:

```bash
npm run db:seed      # writes to whatever DATABASE_URL points at, so check it first
```

Never run `npm` in the outer `aio-training` folder. The real project root is the
inner `aio-training/aio-training`.

## Schema changes

```bash
npx prisma migrate dev --name <change>   # creates the migration locally
git push                                  # Vercel runs `prisma migrate deploy`
```

The `dev` and `main` branches drift if a migration is only applied to one. After
a schema change, confirm both branches are current.

## Backups

Neon retains 6 hours of history on this project, which is short. Bookings and
customers only exist in the `main` branch, so before any risky write, take a
Neon snapshot or branch from `main` as a restore point.

Flyer uploads live in Vercel Blob and are not covered by database backups.

## Troubleshooting: "I pushed but the site didn't change"

Work down this list in order:

1. **Vercel > Deployments.** Find the deployment for your commit SHA. If it is
   missing, the Git integration or production branch setting is wrong. If it is
   red, read the build log.
2. **Is the change actually code?** If what you changed was event text, prices,
   flyers, or dates, that is database content, and shipping code will never
   move it. See "How to change live content" above.
3. **Did you seed the wrong branch?** The most likely answer. Your seed hit
   `dev`; production reads `main`.
4. **Check the live HTML, not just your browser.**
   `curl -s https://www.trainingaio.com/<path> | grep "<something you added>"`
   rules out local caching.
