@AGENTS.md

# AIO Training

## What this is
Sports-training booking platform (clinics/events, trainer schedules, Stripe checkout, admin
dashboard). PRE-LAUNCH: goal is production-ready and hooked to its domain ASAP. Trainers and
admins must be able to log in and manage times without dev help.

## Project root warning
The real project root is C:\MY PROJECTS\aio-training\aio-training (double-nested). NEVER run npm
in the outer folder; a stray package-lock.json there means someone did.

## Stack (locked - do not re-decide)
Next.js 16, TypeScript, Prisma with local SQLite dev.db, Stripe. npm.

## Run it
`npm run dev` on port 3001 (.claude/launch.json). After any clone/pull: `npm install`, then
`npx prisma generate`, and reseed if events are missing. dev.db is UNTRACKED: the "missing
Football Skills Clinic event" incident was seed data, not lost code. Check seeds before assuming
a pull destroyed something.

## Design language (locked)
Dark theme with red accents. Hyphens as list markers (red diamonds were replaced, keep hyphens).
Scroll-triggered reveals site-wide: fade + 20-30px upward slide, Intersection Observer, premium
and subtle, never flashy. Smooth hamburger slide-in with the red bar (was glitchy on iPhone, keep
it smooth). No em dashes.

## Known patterns
- Events/clinic detail page: flyer stays pinned while the left side scrolls, unpins when it
  reaches the registration form.
- "Register Now" scrolls to an exact anchor position on the form.
- Hero video has a blur patch covering a watermark bottom-right; keep it minimal.
- Acceptance device is Vinny's iPhone Safari. iPhone-reported bugs are real even when desktop
  mobile-viewport emulation looks fine; verify at true mobile widths and test touch styles.

## Responsive standard
Approved layout must scale proportionally across ALL desktop sizes (laptop 1101-1599px band vs
1600px+ upscale) and be flawless 320-480px. Nothing cut off, no horizontal scrollbar, buttons
never touch screen edges.
