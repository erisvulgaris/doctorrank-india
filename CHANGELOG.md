# Changelog

All notable changes to **DoctorRank India** are documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project attempts to adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
for its public API surface (URLs, component props, database schema).

---

## [Unreleased] — Iteration 1 (2026-07-16)

**Theme:** Accessibility, error handling, and UX polish on existing flows.

### User-facing improvements

- **Skip-to-content link** is now the first focusable element on every public page.
  Keyboard and screen-reader users can bypass the header and jump straight to the
  main content by pressing `Tab` once and then `Enter`.
- **Consistent focus-visible rings** across the entire app. Keyboard users now get
  a clear 2px brand-blue outline on every interactive element; mouse users see no
  outline (cleaner look, same accessibility).
- **`prefers-reduced-motion` is now respected.** Users who have "Reduce motion"
  enabled in their OS will no longer see ECG scroll, heartbeat, float, soft-glow,
  or marquee-fade animations. Functional loading shimmers are kept but sped up.
- **Booking modal is fully accessible and robust:**
  - Closes on `Escape` (disabled while submitting to prevent lost bookings).
  - Traps focus inside the dialog (Tab cycles within the modal).
  - Auto-focuses the first form field on open.
  - Locks body scroll while open (no background scroll leak).
  - Proper `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` attributes.
  - Close button uses a proper `X` icon (was a confusing rotated `ArrowLeft`).
  - Submit button shows a spinner (`Loader2`) with "Confirming…" text while waiting.
  - Form resets to empty when the modal is reopened.
- **Booking form validation is now inline and helpful:**
  - Required fields show a red border and an error message below the field
    as soon as the field is blurred (or after a submit attempt).
  - Indian mobile number validation (`+91` followed by 10 digits starting
    with 6–9, or just the 10-digit number).
  - Email format validation when an email is provided (email is optional).
  - Date/time must be in the future — past dates are rejected.
  - The native `datetime-local` input now has a `min` attribute set to "now"
    so the picker itself greys out past times.
  - All error messages are announced via `role="alert"` for screen readers.
- **Booking submit errors surface clearly.** If the API call fails (network,
  500, 400), a red error banner appears at the top of the form with the
  specific error message — instead of silently doing nothing or showing
  a fake "confirmed" screen.
- **Custom 404 page** (`/not-found`) with branded styling, a large 404
  visual, and clear calls-to-action ("Back to home" + "Search doctors").
- **Global error boundary** (`/error`) that catches unexpected runtime
  errors, displays a friendly message with a "Try again" button, and
  shows the error message + digest in a collapsible `<details>` for
  debugging.
- **Route loading state** (`/loading`) shown by Next.js App Router while
  the page segment is rendering on the server — branded skeleton with
  shimmer placeholders instead of a blank screen.
- **Doctor photo fallback.** If a doctor's profile photo fails to load
  (offline, blocked, 404), a deterministic gradient avatar with the
  doctor's initial is shown instead of a broken-image icon. The same
  fallback is used in admin tables.
- **Active nav items** in the desktop nav, mobile drawer, and mobile
  bottom nav now carry `aria-current="page"`, so screen readers
  announce the current location.
- **Search results count** is now announced via `aria-live="polite"`
  with `aria-busy` during loading, so screen-reader users hear
  "Searching…" and then "12 doctors found" without manual refresh.
- **`/` keyboard shortcut** no longer fires when modifier keys
  (`Cmd/Ctrl/Alt/Meta`) are pressed (was interfering with `Cmd+/`
  in some browsers) and now also skips `SELECT` and `contenteditable`
  elements, not just `INPUT`/`TEXTAREA`.

### Functional / technical changes

- **`src/app/not-found.tsx`** — new file. Branded 404 page.
- **`src/app/error.tsx`** — new file. Global error boundary with reset.
- **`src/app/loading.tsx`** — new file. Route-level loading skeleton.
- **`src/app/globals.css`** — added `.skip-link` utility, global
  `*:focus-visible` ring, and a `@media (prefers-reduced-motion: reduce)`
  block that disables decorative animations.
- **`src/app/home-shell.tsx`** — added skip link, `<main id="main-content"
  tabIndex={-1}>` target, and a more defensive `/` shortcut handler.
- **`src/components/doctorrank/doctor-image.tsx`** — new file. Reusable
  `DoctorImage` component with `onError` fallback to a deterministic
  gradient + initial avatar. Uses React's "adjust state during render"
  pattern (not `useEffect`) to reset error state when `src` changes.
- **`src/components/doctorrank/doctor-card.tsx`** — replaced raw `<img>`
  with `DoctorImage`.
- **`src/components/doctorrank/doctor-view.tsx`** — replaced raw `<img>`
  with `DoctorImage`; rewrote `BookingModal` from scratch with validation,
  focus trap, escape key, body-scroll lock, error banner, spinner, and
  proper ARIA. Added `X`, `AlertCircle`, `Loader2` icon imports. `handleBook`
  now throws on HTTP errors so the modal can surface them.
- **`src/components/doctorrank/site-header.tsx`** — added `aria-label`
  on nav elements and `aria-current="page"` on active items.
- **`src/components/doctorrank/search-view.tsx`** — added `role="status"`,
  `aria-live="polite"`, `aria-busy` on the results-count paragraph.
- **`src/components/admin/admin-doctors.tsx`** — replaced raw `<img>`
  with `DoctorImage` in the doctor table.

### Validation performed

- `bun run lint` — **passes** with zero errors and zero warnings.
- Manual smoke test via Agent Browser (desktop 1440×900 and iPhone 14):
  - `/` loads 200, skip link is the first focusable element, becomes
    visible on focus.
  - `/?view=doctor&slug=dr-vikram-desai` loads 200, booking modal opens,
    validation errors appear on empty submit, Escape closes the modal,
    a valid form submission shows the "Appointment confirmed" success
    state with WhatsApp link.
  - `/?view=admin&section=dashboard` loads 200.
  - `/nonexistent` returns 404 with the branded not-found page.
  - Mobile bottom-nav active item has `aria-current="page"`.

### Known limitations / follow-up work

- The booking form's phone validation is India-specific (`+91` or 10-digit
  starting with 6–9). If the platform expands internationally, this regex
  will need to be relaxed or made country-aware.
- The `BookingModal` focus trap is a lightweight implementation (Tab /
  Shift+Tab cycle between first and last focusable). A more robust
  implementation would use a library like `focus-trap-react`, but the
  current implementation handles the common cases correctly.
- The `/error` boundary catches client-side runtime errors. Server-side
  rendering errors during the initial bootstrap data fetch (in
  `src/app/page.tsx`) are not caught by it — those would surface as a
  generic Next.js error page. A future iteration could move the
  bootstrap fetch into a Suspense boundary with its own error fallback.
- `prefers-reduced-motion` is implemented in CSS only. Framer Motion
  animations defined inline in components are not yet gated by this
  preference — a future iteration could read the media query in JS
  and pass a `transition` override to motion components.
- Image fallback uses a plain `<img>` tag rather than `next/image`,
  because the seed data uses `randomuser.me` URLs which would need to
  be allow-listed in `next.config.ts`. Migrating to `next/image` with
  proper remote pattern config is a recommended follow-up for
  production image optimization.

---

## [0.1.0] — 2026-07-16 (Initial release)

- Initial public release of DoctorRank India.
- AI-Powered Doctor Discovery Platform + Enterprise Admin Panel.
- Mobile-first public site with ECG animations, DoctorRank transparency,
  AI Symptom Navigator, booking flow with WhatsApp confirmation.
- Enterprise admin console with 22 modules: Dashboard, Doctors, Hospitals,
  Appointments, Verification, Reviews, SEO Control, AI Center, Revenue,
  Analytics, Users & Roles, Security, Developer Console, Settings, and
  placeholder modules for Disease Library, Procedures, Specialties,
  Content, Maps, CRM, Support, Marketing.
- Prisma schema with 7 models (City, Specialty, Condition, Hospital,
  Doctor, Review, Appointment) and seed data: 8 cities, 14 specialties,
  16 conditions, 10 hospitals, 44 doctors, ~150 reviews.
- 5 REST API endpoints: `/api/search`, `/api/suggest`, `/api/doctors`,
  `/api/ai-symptom`, `/api/appointments`.
- Tech stack: Next.js 16 (App Router), TypeScript 5, Tailwind CSS 4,
  shadcn/ui (New York), Framer Motion, Recharts, Prisma ORM, SQLite.
