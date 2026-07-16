# AGENTS.md

A living guide for AI agents and human contributors working on the
**DoctorRank India** codebase. This document captures the project's
architecture, conventions, and the lessons learned from each iteration
so that future work is faster, safer, and more consistent.

> **Read this first.** Then read [`CHANGELOG.md`](./CHANGELOG.md) for the
> history of what's been done, and [`README.md`](./README.md) for the
> product overview.

---

## 1. Project at a glance

- **What:** AI-powered doctor discovery platform for India, plus an
  enterprise admin console. Mobile-first public site + 22-module admin.
- **Stack:** Next.js 16 (App Router) · TypeScript 5 · Tailwind CSS 4 ·
  shadcn/ui (New York) · Framer Motion · Recharts · Prisma ORM · SQLite.
- **Single visible route:** the entire public + admin experience is
  mounted at `/` (see `src/app/page.tsx`). View switching happens
  client-side via URL search params (`?view=doctor&slug=…`,
  `?view=admin&section=…`). **Do not add new Next.js route segments**
  unless explicitly asked — the sandbox only exposes `/` to the user.
- **Repo:** <https://github.com/erisvulgaris/doctorrank-india>

---

## 2. Commands

| Task | Command | Notes |
|---|---|---|
| Install deps | `bun install` | Bun is the package manager. |
| Dev server | `bun run dev` (port 3000) | Auto-started by the sandbox; do NOT run manually unless you know why. |
| Lint | `bun run lint` | ESLint. **Must pass before commit.** |
| DB push | `bun run db:push` | Applies `prisma/schema.prisma` to SQLite. |
| DB generate | `bun run db:generate` | Regenerates the Prisma Client after schema changes. |
| DB migrate | `bun run db:migrate` | Dev migrations. Not used currently — `db:push` is preferred. |
| Seed | `bun run scripts/seed.ts` | Seeds 8 cities, 14 specialties, 16 conditions, 10 hospitals, 44 doctors, ~150 reviews. |
| Build | `bun run build` | **Do not run** in the sandbox — it produces a standalone build that conflicts with the dev server. |

> **Lint is the only validation gate.** There are no unit/integration
> tests yet (see §10 — Recommended next improvements). When you finish
> a change, run `bun run lint` and fix every error and warning.

### Manual smoke test

The sandbox includes Agent Browser. Use it to verify changes visually:

```bash
agent-browser open http://localhost:3000/
agent-browser snapshot -i              # interactive elements with refs
agent-browser click @e12               # click by ref
agent-browser set device "iPhone 14"   # mobile emulation
agent-browser screenshot path.png --full
```

After any change to a route, **curl it first** for a quick status check:

```bash
curl -s -m 8 -o /dev/null -w "%{http_code}\n" http://localhost:3000/
```

---

## 3. Architecture

### 3.1 Routing model

The app uses a **client-side view-state router** in
`src/app/home-shell.tsx`. The server component (`src/app/page.tsx`)
fetches all bootstrap data (cities, specialties, conditions, hospitals,
top doctors, stats) in parallel and passes it to `HomeShell`.

`HomeShell` reads URL search params and renders the appropriate view.
Navigation is done via the `navigate(view, payload)` callback, which
updates both React state and the URL (so back/forward and sharing work).

```
view=home            → HomeView
view=search&q=…      → SearchView
view=doctor&slug=…   → DoctorView       (fetches /api/doctors?slug=…)
view=condition&slug  → ConditionView    (looks up from bootstrap data)
view=specialty&slug  → SpecialtyView    (looks up from bootstrap data)
view=hospital&slug   → HospitalView     (looks up from bootstrap data)
view=specialties     → ListView kind="specialties"
view=conditions      → ListView kind="conditions"
view=hospitals       → ListView kind="hospitals"
view=ranking         → RankingView
view=admin&section=… → AdminShell       (full-screen, no public header/footer)
```

**Important:** condition / specialty / hospital detail pages are rendered
from the bootstrap data already in memory — they do not hit the API. Only
`DoctorView` makes an additional `/api/doctors?slug=` call (because it
needs related doctors and nearby hospitals that aren't in the bootstrap
payload).

### 3.2 Data flow

```
Browser
  │
  │  GET / (server component)
  ▼
src/app/page.tsx
  │  ├── db.city.findMany()
  │  ├── db.specialty.findMany({ include: { doctors, conditions } })
  │  ├── db.condition.findMany({ include: { specialty, doctors } })
  │  ├── db.hospital.findMany({ include: { city, doctors } })
  │  ├── db.doctor.findMany({ orderBy: doctorRank, take: 6 })
  │  └── counts for stats
  │
  │  (serialized as props)
  ▼
<HomeShell>  (client component, Suspense-wrapped)
  │
  ├── <SiteHeader>
  ├── <HomeView | SearchView | DoctorView | … | AdminShell>
  └── <SiteFooter>
```

API routes (`src/app/api/*/route.ts`) are used for:
- `/api/search` — full-text search across doctors, conditions, specialties, hospitals.
- `/api/suggest` — instant search suggestions (debounced on the client).
- `/api/doctors?slug=` — single doctor detail + related + nearby hospitals.
- `/api/ai-symptom` (POST) — rule-based symptom → specialty → doctor navigator.
- `/api/appointments` (POST) — booking with WhatsApp confirmation URL.

All API routes are `export const dynamic = 'force-dynamic'` to bypass
the static-rendering cache and always serve fresh data.

### 3.3 Prisma schema

File: `prisma/schema.prisma`

Models:
- `City` — has many Doctors, Hospitals.
- `Specialty` — has many Conditions, Doctors.
- `Condition` — belongs to Specialty, has many Doctors (M2M).
- `Hospital` — belongs to City, has many Doctors.
- `Doctor` — belongs to Specialty, City, optionally Hospital; has many Reviews, Appointments, Conditions (M2M).
- `Review` — belongs to Doctor.
- `Appointment` — belongs to Doctor.

**JSON-in-text-column pattern:** fields like `languages`, `timings`,
`conditionsTreated`, `procedures`, `acceptedInsurance`, `affiliations`
are stored as JSON strings in SQLite `String` columns and parsed with
`safeJsonParse()` from `src/lib/doctorrank.ts`. **Do not assume these
fields are already arrays** — always pass them through `safeJsonParse`.

**Schema changes:** after editing `schema.prisma`, run
`bun run db:push` (not `db:migrate` — there is no migration history
in this project, and `db:push` is simpler for the dev SQLite DB).

### 3.4 Component ownership

| Area | Owner file | Notes |
|---|---|---|
| Public header / nav / bottom nav | `src/components/doctorrank/site-header.tsx` | Mobile drawer + sticky glass header. |
| Public footer | `src/components/doctorrank/site-footer.tsx` | Has extra bottom padding on mobile to clear the bottom nav. |
| Hero search | `src/components/doctorrank/hero-search.tsx` | Rotating placeholders, voice search, suggestions dropdown. |
| Doctor card | `src/components/doctorrank/doctor-card.tsx` | Used in home, search, condition, specialty, doctor (related). |
| Doctor image | `src/components/doctorrank/doctor-image.tsx` | Reusable `<img>` with onError fallback. **Always use this** instead of raw `<img>` for doctor photos. |
| ECG / rank gauge | `src/components/doctorrank/ecg-line.tsx` | `EcgLine`, `EcgStrip`, `RankGauge`. |
| Stylized map | `src/components/doctorrank/stylized-map.tsx` | Custom SVG map (not Google Maps yet). |
| Doctor profile + booking modal | `src/components/doctorrank/doctor-view.tsx` | ~950 lines. `BookingModal` is a separate function in the same file. |
| Admin shell | `src/components/admin/admin-shell.tsx` | Renders sidebar + topbar + section. |
| Admin sidebar | `src/components/admin/admin-sidebar.tsx` | 6 groups × 22 modules. |
| Admin topbar | `src/components/admin/admin-topbar.tsx` | Breadcrumbs, search, notifications, profile. |
| Command palette | `src/components/admin/command-palette.tsx` | Ctrl+K / Cmd+K. |
| Admin reusable UI | `src/components/admin/ui/` | `kpi-card.tsx`, `chart-card.tsx`, `data-table.tsx`. |
| Admin modules | `src/components/admin/admin-*.tsx` | One file per module. Placeholder modules use `admin-placeholder.tsx`. |
| Lib utilities | `src/lib/doctorrank.ts` | `slugify`, `safeJsonParse`, `formatINR`, `rankBand`, `relativeTime`, JSON-LD helpers. |
| DB client | `src/lib/db.ts` | Prisma Client singleton. |

---

## 4. Design system

Defined in `src/app/globals.css`. Light mode only — **do not add a dark
theme** without explicit instruction.

### 4.1 Color tokens

| Token | Value | Use |
|---|---|---|
| `--brand` | `#0B5FFF` | Medical Blue — primary CTAs, links, active states. |
| `--emerald` | `#00B884` | Vital-signs green — success, verified, positive deltas. |
| `--cyan-soft` | `#DDF4FF` | Soft cyan — accents, conditions. |
| `--warning` | `#F59E0B` | Orange — warnings, pending states. |
| `--danger` | `#EF4444` | Red — errors, destructive actions. |
| `--background` | `#FAFBFD` | Warm clinical white — page background. |
| `--card` | `#FFFFFF` | Pure white — card surfaces. |
| `--foreground` | `#0A1428` | Deep navy ink — primary text. |
| `--muted-foreground` | `#64748B` | Slate — secondary text. |
| `--border` | `#E5E9F0` | Very subtle gray — borders. |

**Rule:** prefer semantic Tailwind classes (`bg-card`, `text-foreground`,
`border-border`, `text-brand`, `bg-brand-soft`, `text-emerald`) over
hardcoded hex values. The only place hex values are acceptable is in
`globals.css` itself and in chart colors (Recharts).

### 4.2 Typography

- **Font:** Inter (loaded in `src/app/layout.tsx` via `next/font/google`).
- **Tracking:** `-0.011em` on body.
- **Sizes:** use Tailwind's `text-[Npx]` arbitrary values for fine
  control (e.g. `text-[13px]`, `text-[11.5px]`). The design uses a lot
  of half-pixel sizes for density.

### 4.3 Spacing & radius

- **Radius:** `--radius: 0.875rem` (14px). Use `rounded-xl` (18px) for
  cards, `rounded-lg` (10px) for buttons, `rounded-full` for pills.
- **Card padding:** `p-4` on mobile, `p-5` or `p-6` on desktop. Use the
  responsive `p-4 sm:p-5` pattern.
- **Section spacing:** `py-10 sm:py-12 lg:py-16` for major sections.

### 4.4 Shadows

Three shadow utilities in `globals.css`:
- `shadow-card` — default for cards.
- `shadow-premium` — for hero / modal / floating elements.
- `shadow-hover` — applied on `:hover` for lift effect.

### 4.5 Animations

Custom keyframes in `globals.css`:
- `ecg-draw` / `ecg-scroll` — ECG line draw + continuous scroll.
- `pulse-ring` — soft glow around important elements.
- `heartbeat` — for vital-signs icons.
- `marquee-fade` — rotating search placeholder.
- `shimmer` — skeleton loading.
- `soft-glow` — CTA pulse.
- `float-cross` — decorative medical cross.

**All decorative animations are disabled by `@media (prefers-reduced-motion: reduce)`.**
The `shimmer` is kept functional (it conveys loading state) but sped up.
When adding new animations, **add them to the reduced-motion block** if
they are purely decorative.

### 4.6 Framer Motion

Used heavily in:
- Page transitions (`<AnimatePresence mode="wait">` in `home-shell.tsx`).
- Card reveals (`initial`, `animate` on `motion.article` / `motion.button`).
- Mobile drawer (`motion.div` with `x: '100%'` → `x: 0`).
- Active nav indicator (`layoutId="nav-active"` for shared layout animation).
- Booking modal (`motion.div` with scale + y entry).

**Convention:** keep Framer Motion transitions under 400ms. Use the
cubic-bezier `[0.22, 1, 0.36, 1]` for premium ease-out feel.

---

## 5. Accessibility expectations

This project targets **WCAG 2.1 AA**. Key rules:

1. **Every interactive element must have a visible focus state.** The
   global `*:focus-visible` rule in `globals.css` handles this — do not
   override it with `outline: none` unless you replace it with an
   equally visible custom focus ring.
2. **Icon-only buttons must have `aria-label`.** Example: a close
   button with just an `<X>` icon needs `aria-label="Close"`.
3. **Active nav items must have `aria-current="page"`.** This is
   implemented in `site-header.tsx` — preserve it when refactoring.
4. **Modals must:**
   - Have `role="dialog"` and `aria-modal="true"`.
   - Be labelled with `aria-labelledby` pointing at the title.
   - Trap focus inside (Tab / Shift+Tab cycle within).
   - Close on Escape.
   - Lock body scroll while open.
   - Return focus to the trigger on close (best-effort).
   See `BookingModal` in `doctor-view.tsx` for the reference
   implementation.
5. **Forms must have:**
   - `<label>` elements (not just placeholder text) for every input.
   - Required fields marked with both a visible `*` and `aria-required`.
   - Inline error messages with `role="alert"` and `id` linked via
     `aria-describedby`.
   - Validation that runs on blur (not just on submit) for a responsive
     feel.
6. **Dynamic content** (search result counts, loading states, success
   messages) should use `aria-live="polite"` and `aria-busy` so screen
   readers announce changes.
7. **Images must have meaningful `alt` text.** Decorative images get
   `alt=""`. Doctor photos get `"Dr. Name — Specialty specialist"`.
8. **Skip-to-content link** is the first focusable element on every
   public page. Do not remove it.
9. **`prefers-reduced-motion`** must be respected — see §4.5.
10. **Color contrast:** the brand palette has been checked against AA.
    Do not introduce new color combinations without verifying contrast
    (e.g. `text-muted-foreground` on `bg-brand-soft` is borderline —
    prefer `text-brand` or `text-foreground` on light soft backgrounds).

---

## 6. Responsive design

Mobile-first. Breakpoints:

| Breakpoint | Prefix | Target |
|---|---|---|
| < 640px | (none) | Mobile — single column, bottom nav, hamburger drawer. |
| ≥ 640px | `sm:` | Large phones / small tablets — 2-col grids. |
| ≥ 768px | `md:` | Tablets — desktop nav still hidden, search trigger button shown. |
| ≥ 1024px | `lg:` | Desktop — full nav, sidebar, multi-column layouts. |
| ≥ 1280px | `xl:` | Large desktop. |

### Mobile-specific patterns

- **Bottom nav** (`fixed bottom-0 lg:hidden`) — 5 items: Home, Search,
  Conditions, Hospitals, Ranking. Add `pb-16 lg:pb-0` to page wrappers
  so content isn't hidden behind it.
- **Hamburger drawer** — right-sliding panel, `max-w-sm`, with overlay.
- **Stacked layouts** — `flex-col sm:flex-row`, `grid-cols-1 sm:grid-cols-2`.
- **Horizontal scroll** for stat cards on mobile — use `overflow-x-auto
  no-scrollbar` (the `no-scrollbar` utility hides the scrollbar).
- **Safe area insets** — `.safe-top` and `.safe-bottom` utilities add
  `env(safe-area-inset-*)` padding for iOS notch.

### Admin responsive

- Sidebar is a drawer on mobile (`-translate-x-full lg:translate-x-0`).
- Top bar collapses the breadcrumb on mobile (shows only the page title).
- Data tables horizontally scroll on mobile (`overflow-x-auto`).

---

## 7. Conventions

### 7.1 File naming

- Components: `kebab-case.tsx` (e.g. `doctor-card.tsx`, `admin-doctors.tsx`).
- Lib utilities: `kebab-case.ts` (e.g. `doctorrank.ts`).
- API routes: `src/app/api/<name>/route.ts`.
- Admin reusable UI: `src/components/admin/ui/<name>.tsx`.

### 7.2 Component structure

```tsx
'use client';  // only if it uses hooks / browser APIs

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IconName } from 'lucide-react';
import { helperFromLib } from '@/lib/doctorrank';
import { ReusableComponent } from './reusable-component';

interface ComponentProps {
  // ...
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // 1. State
  // 2. Effects
  // 3. Derived values
  // 4. Handlers
  // 5. Render
}
```

### 7.3 TypeScript

- **Strict mode** is on (`tsconfig.json`).
- Prefer `interface` over `type` for object shapes.
- Use `any` sparingly — the bootstrap data flows through `any[]` for
  pragmatism (Prisma's generated types are verbose), but new code
  should prefer explicit types.
- API route handlers use `NextRequest` / `NextResponse` from
  `next/server`.

### 7.4 Imports

- Use `@/` alias for `src/` imports.
- Group imports: external → internal (`@/lib`, `@/components`) → relative (`./`).
- Single-line imports for ≤3 items, multi-line otherwise.

### 7.5 Styling

- **Tailwind classes only.** No CSS modules, no styled-components.
- Use the design tokens (`bg-card`, `text-brand`, etc.), not raw colors.
- Arbitrary values are fine: `text-[13px]`, `rounded-[18px]`.
- For one-off styles that don't fit Tailwind, add a utility class to
  `globals.css` under `@layer utilities`.

### 7.6 Git

- **Branch:** `main` is the only branch.
- **Commit messages:** conventional-commits-style:
  `feat: …`, `fix: …`, `docs: …`, `refactor: …`, `chore: …`.
- **Do not commit:**
  - `.env` (gitignored — contains `DATABASE_URL`)
  - `db/*.db` (gitignored — the SQLite database file)
  - `download/` (gitignored — screenshots)
  - `dev.log`, `server.log` (gitignored)
  - Any file containing secrets, tokens, or credentials.

---

## 8. Common pitfalls & regression risks

1. **`setState` in `useEffect`.** The ESLint rule
   `react-hooks/set-state-in-effect` will fail the build. If you need to
   reset state when a prop changes, use the "adjust state during render"
   pattern (see `doctor-image.tsx` lines 36–46 for an example). If you
   need to run a side effect, do it in a `setTimeout` inside the effect
   (see `command-palette.tsx`).

2. **Forgetting `safeJsonParse` on JSON-string fields.** Doctor fields
   like `languages`, `timings`, `conditionsTreated` are stored as JSON
   strings in SQLite. If you access them directly without parsing, you'll
   get a string where you expect an array, and `.map()` will iterate
   characters. Always use `safeJsonParse(d.field, [])`.

3. **Breaking the single-route contract.** The sandbox only exposes `/`
   to the user. Do not add `app/some-route/page.tsx` files — they won't
   be reachable. New "pages" are new view states in `home-shell.tsx`.

4. **Removing the skip link or focus-visible styles.** These are
   critical for keyboard accessibility. They were added in iteration 1
   and should not be removed.

5. **Breaking the booking modal's focus trap or escape handler.** The
   modal has a lightweight Tab/Shift+Tab trap and an Escape handler. If
   you add new focusable elements inside the modal, the trap will still
   work (it queries all focusable elements on each Tab), but test it.

6. **Adding `next/image` without configuring remote patterns.** The seed
   data uses `randomuser.me` URLs. `next/image` would require
   `images.remotePatterns` in `next.config.ts`. The current `DoctorImage`
   component uses a plain `<img>` to avoid this. If you migrate to
   `next/image`, add the config.

7. **Breaking `aria-current` on nav.** The active nav indicator relies
   on `aria-current="page"`. If you refactor the nav, preserve it.

8. **Forgetting mobile bottom-nav padding.** Pages that don't add
   `pb-16 lg:pb-0` will have their footer hidden behind the bottom nav
   on mobile.

9. **Introducing new dependencies.** The project already has a rich
   dependency set. Adding a new package should be a last resort —
   prefer composing existing primitives. If you must add one, justify it
   in the changelog.

10. **Running `bun run build` in the sandbox.** It produces a standalone
    build that conflicts with the auto-running dev server. Don't.

11. **Enabling Prisma query logging.** `src/lib/db.ts` previously had
    `log: ['query']`, which generated 22MB+ of log output and crashed
    the dev server by filling the disk. **Never re-enable query logging.**
    Use `log: ['warn', 'error']` (the current setting) or add explicit
    `console.log` calls in specific routes when debugging.

12. **Prisma schema changes without cache clear.** After `prisma db push`
    + `prisma generate`, the Next.js Turbopack dev server still caches
    the old Prisma Client. You must `rm -rf .next` and restart the dev
    server, or queries using new fields will fail with
    `Unknown argument`. See discovery log §11 (iteration 2).

13. **Exposing `passwordHash` or `sessions` in API responses.** Always
    pass doctor objects through `publicDoctor()` (from `src/lib/auth.ts`)
    before returning them from an API route. This strips `passwordHash`
    and `sessions`. The signup and login routes already do this —
    preserve the pattern in any new auth-related route.

14. **Forgetting ownership checks on doctor mutations.** Any
    `PATCH`/`DELETE` route under `/api/doctor/*` must verify that the
    resource being modified belongs to the logged-in doctor (e.g.
    `if (existing.doctorId !== doctor.id) return 404`). Without this,
    a logged-in doctor could modify another doctor's appointments or
    reviews by guessing IDs.

---

## 9. Data flow & integration details

### 9.1 Bootstrap data

`src/app/page.tsx` runs 6 parallel Prisma queries on every request and
passes the result to `<HomeShell>`. This is intentionally simple — there
is no caching layer, no ISR, no streaming SSR. For a production deploy,
consider:

- Moving to ISR with `revalidate = 3600` (1 hour) for the bootstrap data.
- Splitting the bootstrap into multiple Suspense boundaries so the page
  streams progressively.
- Adding a Redis cache for the top-doctors query (it's the most expensive).

### 9.2 Search

`/api/search` uses Prisma's `contains` filter (case-insensitive on
SQLite). This is **not** full-text search — for production scale, migrate
to PostgreSQL `tsvector` or Elasticsearch. The current implementation
works fine for the 44-doctor seed dataset but will not scale to millions
of doctors.

### 9.3 AI Symptom Navigator

`/api/ai-symptom` is a **rule-based** matcher (no LLM call). It has a
hardcoded `SYMPTOM_MAP` of ~18 symptom → specialty mappings. The
`z-ai-web-dev-sdk` package is installed but not yet used. A future
iteration could replace the rule-based matcher with an LLM call, but
the rule-based version is fast, deterministic, and has no API cost.

### 9.4 Appointments

`/api/appointments` (POST) creates a row in the `Appointment` table and
returns a WhatsApp deep-link URL (`https://wa.me/…?text=…`). There is
no SMS or email integration yet — the success message claims
"Confirmation via WhatsApp · SMS · Email" but only WhatsApp is
actually wired up. This is a known gap; see §10.

### 9.5 Maps

`StylizedMap` (`src/components/doctorrank/stylized-map.tsx`) is a custom
SVG visualization, **not** Google Maps. It uses a simple linear
projection (lat/lng → x/y) and draws stylized roads, rivers, and pins.
For production, replace with the Google Maps API (the `GOOGLE_MAPS_API_KEY`
env var is documented in `.env.example`).

### 9.6 Authentication (added in iteration 2)

The app uses **server-side sessions stored in the DB** — no JWTs, no
client-side session storage. The flow:

1. `POST /api/auth/login` (or `/signup`) verifies credentials, creates a
   `Session` row with a 32-byte random token, and sets an `httpOnly`
   `doctorrank_session` cookie via `next/headers` `cookies().set()`.
2. On every request, `getCurrentDoctor()` (in `src/lib/auth.ts`) reads
   the cookie, looks up the session in the DB, checks `expiresAt`, and
   returns the doctor (or `null`).
3. `POST /api/auth/logout` deletes the session row and clears the cookie.

**Password hashing** uses Node's built-in `crypto.scrypt` with a per-user
salt and `timingSafeEqual` for comparison. No bcrypt dependency.

**Server-side auth check**: `src/app/page.tsx` calls `getCurrentDoctor()`
in parallel with the bootstrap data and passes the result as
`initialDoctor` to `<HomeShell>`. This means the page renders with the
correct auth state on first paint — no client-side flicker.

**Client-side auth state**: `HomeShell` keeps `doctor` in React state,
initialised from `initialDoctor`. Login/signup updates this state via
`handleAuthSuccess`; logout clears it via `handleLogout`. No
`/api/auth/me` polling is needed on page load (but the endpoint exists
for future client-side checks).

**Protected API routes**: all `/api/doctor/*` routes call
`getCurrentDoctor()` first and return 401 if null. They verify ownership
before returning or mutating data (e.g. `PATCH /api/doctor/appointments?id=X`
checks that the appointment's `doctorId` matches the session's doctor).

**Dev credentials**: all seeded doctors use email `<slug>@doctorrank.in`
and password `doctor123`. This is documented in the seed script, the
login page (dev hint), and the changelog.

---

## 10. Recommended next improvements

Ordered by rough priority. Future iterations should pick a coherent
subset of these rather than tackling all at once.

### High-value, low-risk

1. **Wire up real SMS + email confirmations** in `/api/appointments`.
   The message claims they're sent, but only WhatsApp is. Either
   implement them (via MSG91 + AWS SES — both documented in
   `.env.example`) or update the message to say "WhatsApp only".
2. **Add `next/image` with proper remote patterns** for doctor photos.
   This enables automatic optimization, lazy-loading, and responsive
   srcsets. Update `DoctorImage` to use it.
3. **Migrate `/api/search` to PostgreSQL full-text search** (or at least
   add a trigram index). The current `contains` filter won't scale.
4. **Add `loading` and `error` exports to the admin section.** Currently
   navigating between admin modules shows nothing while the JS bundle
   loads. A Suspense boundary with a skeleton would help.
5. **Add Open Graph images** for doctor profile pages (dynamic OG image
   generation via `next/og`). The metadata is set in `layout.tsx` but
   there are no per-page OG images.

### Medium-value, medium-risk

6. **Replace `StylizedMap` with Google Maps.** The custom SVG is a
   placeholder. Google Maps would give real directions, traffic, and
   street view. Requires `GOOGLE_MAPS_API_KEY` and a refactor of the
   `StylizedMap` interface.
7. **Add Clerk authentication.** The admin panel has a "Super Admin"
   badge but no real auth. Clerk is documented in `.env.example`.
8. **Wire up the 10 placeholder admin modules** (Disease Library,
   Procedures, Specialties, Content, Maps, CRM, Support, Marketing).
   They currently show a "Coming Soon" placeholder.
9. **Add `focus-trap-react`** for a more robust focus trap in modals.
   The current implementation is lightweight but doesn't handle edge
   cases (e.g. shadow DOM, iframes).
10. **Add unit tests** (Vitest + Testing Library). There are currently
    zero tests. Start with `doctorrank.ts` utilities (pure functions)
    and the `validateForm` function in `doctor-view.tsx`.

### Strategic / larger work

11. **Migrate from SQLite to PostgreSQL** for production. The schema is
    already PostgreSQL-compatible (no SQLite-specific types). Update
    `DATABASE_URL` and run `db:push`.
12. **Add ISR / streaming SSR** for the bootstrap data. The current
    `force-dynamic` fetches 6 queries on every request.
13. **Replace the rule-based AI Symptom Navigator with an LLM call**
    via `z-ai-web-dev-sdk`. The package is installed.
14. **Add a doctor self-serve dashboard.** The admin "Users & Roles"
    module has a "Doctor" role, but there's no doctor-facing UI.
15. **Add schema.org JSON-LD output** to doctor and condition pages.
    The helpers exist in `src/lib/doctorrank.ts` but are not yet
    rendered into `<script type="application/ld+json">` tags.

---

## 11. Discovery log

A running log of important discoveries and decisions, newest first.

### 2026-07-17 — Iteration 2

- **Discovered (critical):** Prisma's `log: ['query']` in `src/lib/db.ts`
  was generating 22MB+ of log output in `dev.log`, which filled the disk
  and caused the dev server to crash repeatedly. **Fixed** by reducing
  to `log: ['warn', 'error']`. **Future agents: never enable query-level
  Prisma logging in this project.**
- **Discovered (critical):** After running `bunx prisma db push` to add
  new fields to a model, the Next.js Turbopack dev server caches the old
  Prisma Client and does not pick up the new schema. The fix is:
  1. `bunx prisma generate` (regenerate the client)
  2. `rm -rf .next` (clear the Turbopack cache)
  3. Restart the dev server (`pkill -f "next dev"` then restart with
     `setsid bunx next dev -p 3000 &`).
  Without all three steps, queries using the new fields will fail with
  `Unknown argument` errors.
- **Decision:** Used `crypto.scrypt` (Node built-in) for password hashing
  instead of adding `bcrypt` as a dependency. scrypt is actually *more*
  secure than bcrypt (memory-hard, resistant to GPU/ASIC attacks) and
  requires no native compilation. The `timingSafeEqual` comparison
  prevents timing attacks.
- **Decision:** Server-side sessions in the DB (not JWTs) because:
  - JWTs can't be revoked without a server-side blocklist anyway.
  - DB sessions give us "active sessions" list for free (shown in the
    admin Security Center).
  - The performance cost is one indexed `findUnique` per request —
    negligible at this scale.
- **Decision:** The `email` field on `Doctor` is nullable to preserve
  existing seeded data during the migration. For a production deploy,
  backfill emails and make it required.
- **Decision:** Login returns a generic "Invalid email or password"
  error for both unknown-email and wrong-password cases, to prevent
  user enumeration. This is a NIST 800-63B recommendation.
- **Decision:** The DoctorRank recalculation in `PATCH /api/doctor/profile`
  uses the same 7-factor weights as the seed script. Only
  `profileCompleteness` and `profileFreshness` are updated by the doctor's
  own edits — the other 5 factors are driven by external signals and
  require a background job to recompute (not yet implemented).

### 2026-07-16 — Iteration 1

- **Discovered:** The `BookingModal` had no error handling — if the API
  call failed, it would set `submitted` to the error object and render
  a broken "success" screen. Fixed by making `handleBook` throw on
  HTTP errors and adding a `submitError` state with a red banner.
- **Discovered:** The `/` keyboard shortcut fired even when modifier
  keys were pressed (e.g. `Cmd+/` in browser dev tools). Fixed by
  checking `e.metaKey || e.ctrlKey || e.altKey` first.
- **Decision:** Used React's "adjust state during render" pattern for
  `DoctorImage`'s error reset, instead of `useEffect`. This satisfies
  the `react-hooks/set-state-in-effect` ESLint rule and avoids cascading
  renders. See <https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes>.
- **Decision:** The skip link is implemented as a plain `<a href="#main-content">`
  rather than a button, because it's a navigation anchor. The
  `:focus-visible` CSS makes it slide into view from the top.
- **Decision:** `prefers-reduced-motion` is handled in CSS only. Framer
  Motion's inline transitions are not yet gated — this is a known
  limitation documented in the changelog.

### 2026-07-16 — Initial release

- **Decision:** Single-route architecture (`/` only) with client-side
  view-state switching via URL search params. This was mandated by the
  sandbox environment, but it also keeps the sharing / back-button UX
  clean.
- **Decision:** Bootstrap data fetched server-side in `page.tsx` and
  passed as props, rather than fetched client-side. This gives fast
  initial render and good SEO.
- **Decision:** Admin panel is a "view" within the same single route,
  not a separate route segment. This keeps the sandbox happy and avoids
  auth boundaries for now.
- **Decision:** Custom `StylizedMap` SVG instead of Google Maps, to
  avoid the API key dependency for the initial release.
- **Decision:** Rule-based AI Symptom Navigator instead of an LLM call,
  for speed, determinism, and zero API cost. The `z-ai-web-dev-sdk`
  package is installed for a future upgrade.
