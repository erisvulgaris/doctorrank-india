# Changelog

All notable changes to **DoctorRank India** are documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project attempts to adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
for its public API surface (URLs, component props, database schema).

---

## [Unreleased] — Iteration 3 (2026-07-17)

**Theme:** Closing the patient–doctor feedback loop — connecting patient actions
(appointments + reviews) to the doctor dashboard, with honest messaging and
real rating data.

### User-facing improvements

- **Patient review submission** — patients can now write a review directly on
  any doctor's profile page. The form includes a name field, an optional
  procedure/condition field, an interactive 5-star rating (with hover preview
  and "Excellent" / "Very Good" / "Good" / "Fair" / "Poor" labels), and a
  comment field with a 2000-character limit and live counter. Inline
  validation, loading spinner, error banner, and a privacy note ("your phone
  and email are never collected"). On success, the review appears immediately
  at the top of the reviews list without a page reload.
- **Doctor replies now visible on the public profile** — when a doctor replies
  to a review from their dashboard, the reply appears under that review on the
  public doctor profile page, styled in a branded blue panel with a
  "Doctor's reply" label and relative timestamp. This completes the feedback
  loop: patient writes review → doctor replies → patient sees the reply.
- **Real rating distribution** — the 5-star breakdown bars on the doctor
  profile were previously hardcoded (78% / 18% / 3% / 1% / 0%). They now
  compute from the actual reviews, showing both the count and percentage
  for each star level, with animated bars.
- **Honest booking confirmation** — the booking success message previously
  claimed "A confirmation has been sent via WhatsApp, SMS, and email" but
  only WhatsApp is actually wired up. Now says "Appointment requested with
  [doctor]. The doctor will confirm shortly." — accurate and sets the right
  expectation.
- **Fixed appointment status flow** — new bookings now start as `"pending"`
  instead of `"confirmed"`. This means the doctor dashboard's appointment
  management (Confirm / Complete / Cancel buttons) is actually useful:
  patient books → "pending" → doctor confirms → "confirmed" → doctor
  completes → "completed". Previously everything arrived as "confirmed"
  and the doctor had no action to take.
- **Updated booking modal copy** — title changed from "Appointment confirmed"
  to "Appointment requested", status badge shows "Pending" in amber, and the
  WhatsApp button reads "Message clinic on WhatsApp" (not "Send WhatsApp
  confirmation").
- **Unverified badge** — reviews that haven't been admin-verified now show
  an "Unverified" badge (instead of only showing a badge for verified ones).
- **Empty state** — when a doctor has no reviews, the section shows a
  friendly empty state with a star icon and "Be the first to share your
  experience" prompt.

### Functional / technical changes

- **`src/app/api/appointments/route.ts`** — rewrote the POST handler:
  - Added field-level validation (returns `{ error, errors }` on failure).
  - Future-date validation (rejects past dates).
  - Creates appointments with `status: 'pending'` (was `'confirmed'`).
  - Updated confirmation message to be honest about what's sent.
  - Trims/normalizes all string inputs.
- **`src/app/api/reviews/route.ts`** — new file:
  - `POST` endpoint for public review submission.
  - Validates: name (2–80 chars), rating (1–5), comment (10–2000 chars),
    optional procedure (text).
  - Creates review with `isVerified: false`.
  - **Recalculates the doctor's aggregate review stats** after each new
    review: `reviewCount`, `reviewQuality` (average rating × 20), and
    `doctorRank` (full 7-factor recalculation).
  - Returns the created review object for optimistic UI update.
- **`src/components/doctorrank/doctor-view.tsx`** — replaced the inline
  reviews section with two new components:
  - `ReviewSection` — manages local review state (so new reviews appear
    without a refetch), computes the real rating distribution, shows the
    "Write a review" button, and renders each review with its doctor reply
    (if any). Uses the "adjust state during render" pattern to sync when
    the `doctorId` prop changes (navigating to a different doctor).
  - `ReviewForm` — accessible review submission form with star-rating
    radio group (`role="radiogroup"` + `role="radio"` + `aria-checked`),
    inline validation, loading state, and error banner.
  - Also updated the booking modal's success state: "Appointment requested"
    title, "Pending" status badge (amber), "Message clinic on WhatsApp"
    button text, and the honest confirmation message.

### Validation performed

- `bun run lint` — **passes** (0 errors, 0 warnings).
- E2E API test via curl:
  - `POST /api/reviews` with valid data → 200, returns review object.
  - `POST /api/reviews` with short comment → 400, validation error
    "Please write at least 10 characters." ✅
  - `POST /api/appointments` with valid data → 200, `status: "pending"`
    (was "confirmed" before this iteration). ✅
- Browser test via Agent Browser (desktop 1440×900):
  - Doctor profile → "Write a review" button visible.
  - Clicked "Write a review" → form appears with name, procedure, star
    rating, and comment fields.
  - Filled form (Rohit Sharma, Hair Fall, 5 stars, comment) → clicked
    "Submit review" → review appears immediately at top of list.
  - Review count updated from 3 to 4 total.
  - Booking modal → "Appointment requested" title, "Pending" status badge,
    "Message clinic on WhatsApp" button. ✅
  - Logged in as doctor → Appointments tab shows new pending appointments
    (Anita Kumar + Test Patient). ✅
  - Reviews tab shows new reviews with "Reply" buttons.
  - Replied to Rohit Sharma's review → reply posted.
  - Viewed public profile → "DOCTOR'S REPLY" panel visible under the
    review with the reply text. ✅

### Known limitations / follow-up work

- **No rate limiting on review submission.** A malicious user could spam
  reviews. Add IP-based rate limiting (e.g. 3 reviews per doctor per hour
  per IP) in a future iteration.
- **No spam/profanity filter.** Reviews are published immediately. The
  admin Reviews Moderation module exists but reviews don't enter a
  moderation queue — they're just `isVerified: false` until an admin
  manually verifies them.
- **No "helpful" voting.** The "Helpful (N)" button is display-only.
  Wiring it up would require a `POST /api/reviews/:id/helpful` endpoint.
- **Review stats recalculation is synchronous.** Each new review triggers
  a full doctor stats recalculation (3 DB queries). For production scale,
  move this to a background job.
- **The review form doesn't collect proof of visit.** A future iteration
  could allow uploading an appointment receipt to auto-verify the review.

---

## [Unreleased] — Iteration 2 (2026-07-17)

**Theme:** Full authentication system + private doctor dashboard with real backend functionality.

### User-facing improvements

- **Doctor registration (`?view=signup`)** — a full signup form with name, email,
  password, phone, specialty, city, qualifications, and medical registration number.
  Inline validation, show/hide password toggle, and a dev hint showing the seeded
  demo credentials. On success, the doctor is logged in and redirected to their dashboard.
- **Doctor login (`?view=login`)** — email + password login with inline validation,
  show/hide password toggle, and a clear "invalid email or password" error that
  doesn't leak which field is wrong. On success, redirects to the dashboard.
- **Doctor dashboard (`?view=dashboard`)** — a private 4-tab workspace for the
  logged-in doctor:
  - **Overview**: KPI tiles (today / this month / pending / avg rating), a 30-day
    appointments area chart, appointment-status breakdown bars, 3 recent reviews,
    and a profile-completeness progress bar.
  - **Appointments**: filter chips (All / Pending / Confirmed / Completed / Cancelled),
    a list of appointment cards with patient name, date, phone, email, notes, and
    one-click status actions (Confirm, Complete, Cancel) plus a WhatsApp deep link
    to the patient.
  - **Reviews**: list of all reviews with star ratings, an inline reply composer
    (1000-char limit), and the ability to remove an existing reply.
  - **Profile**: editable form for photo URL, consultation fee, about, qualifications,
    experience, phone, WhatsApp, address, languages, conditions treated, procedures,
    and accepted insurance. A sticky "Save changes" bar persists edits and
    recalculates the DoctorRank live.
- **Header profile menu** — when logged in, the header shows the doctor's photo,
  name, and a dropdown with Dashboard, View public profile, and Sign out. When
  logged out, it shows "Sign in" + "Book" buttons.
- **Mobile drawer auth** — the mobile hamburger drawer now shows "My Dashboard"
  and "Sign out" when logged in, or "Sign in" + "Book Appointment" when logged out.
- **Session persistence** — the server passes the logged-in doctor to the client
  on page load, so refreshing the page keeps you signed in. Sessions last 30 days.

### Functional / technical changes

- **Prisma schema** (`prisma/schema.prisma`):
  - Added `email` (nullable, unique) and `passwordHash` (nullable) to `Doctor`.
  - Added new `Session` model (`id`, `token`, `doctorId`, `expiresAt`, `ip`,
    `userAgent`) with cascade delete.
  - Added `doctorReply` and `doctorReplyAt` to `Review` for doctor responses.
  - Added `doctorNotes` and `updatedAt` to `Appointment`.
- **Auth library** (`src/lib/auth.ts`) — new file:
  - `hashPassword` / `verifyPassword` using Node's built-in `crypto.scrypt` with
    per-user salt and `timingSafeEqual` (no bcrypt dependency).
  - `createSession` / `getCurrentDoctor` / `setSessionCookie` / `clearSessionCookie`
    / `destroySession` for httpOnly cookie-based sessions stored in the DB.
  - `isValidEmail` / `isStrongPassword` (NIST 800-63B-compliant: ≥8 chars, letter
    + number, no composition rules).
  - `publicDoctor` strips `passwordHash` and `sessions` before returning a doctor.
- **Seed script** (`scripts/seed.ts`):
  - Every seeded doctor now has `email = '<slug>@doctorrank.in'` and
    `passwordHash = hashPassword('doctor123')`.
  - Wipes `Session` table on re-seed.
  - Prints the default credentials at the end.
- **API routes** (all new):
  - `POST /api/auth/signup` — creates a doctor + session, sets cookie, returns
    the public doctor object. Validates all fields, checks email uniqueness,
    generates a slug (with collision suffix), creates the doctor with sensible
    defaults, and starts them at DoctorRank 40 (pending verification).
  - `POST /api/auth/login` — verifies credentials, creates a session, sets cookie.
    Uses a generic "Invalid email or password" error to prevent user enumeration.
  - `POST /api/auth/logout` — destroys the session row, clears the cookie.
  - `GET /api/auth/me` — returns the current doctor or `{ doctor: null }`.
  - `GET /api/doctor/dashboard` — aggregated stats: appointments today / this
    month / by status, average rating, 30-day timeseries, 5 recent reviews,
    active sessions. **401 if not logged in.**
  - `GET /api/doctor/appointments` — list with optional `?status=` filter.
  - `PATCH /api/doctor/appointments?id=<apptId>` — update status or doctor notes.
    Verifies ownership.
  - `GET /api/doctor/profile` — full profile with relations.
  - `PATCH /api/doctor/profile` — update whitelisted fields (about, qualifications,
    fee, phone, etc.). Recalculates `profileCompleteness`, `profileFreshness`,
    and `doctorRank` on every save.
  - `GET /api/doctor/reviews` — list all reviews.
  - `PATCH /api/doctor/reviews?id=<reviewId>` — set or clear `doctorReply`.
- **Frontend** (all new):
  - `src/components/doctorrank/auth-view.tsx` — login + signup forms with
    inline validation, show/hide password, loading spinners, error banners,
    and a toggle between the two modes.
  - `src/components/doctorrank/doctor-dashboard-view.tsx` — 4-tab dashboard
    with KPI tiles, a Recharts area chart, appointment management, review
    replies, and a full profile editor with a sticky save bar.
- **Server bootstrap** (`src/app/page.tsx`):
  - Now calls `getCurrentDoctor()` in parallel with the bootstrap data fetch
    and passes the result as `initialDoctor` to `HomeShell`.
  - Also passes `specialtiesForSignup` and `citiesForSignup` for the signup form.
- **Router** (`src/app/home-shell.tsx`):
  - Added `login`, `signup`, `dashboard` view states.
  - Added `doctor` auth state (initialised from server, updated on login/logout).
  - `handleAuthSuccess` sets the doctor and navigates to the dashboard.
  - `handleLogout` calls the logout API, clears state, and navigates home.
- **Header** (`src/components/doctorrank/site-header.tsx`):
  - Accepts `doctor` and `onLogout` props.
  - Shows a profile dropdown (photo, name, Dashboard, View public profile,
    Sign out) when logged in.
  - Shows "Sign in" + "Book" buttons when logged out.
  - Mobile drawer adapts to auth state.
- **DB client** (`src/lib/db.ts`):
  - Reduced Prisma logging from `['query']` to `['warn', 'error']`. The query
    logging was generating 22MB+ of log output and causing dev-server
    instability.

### Validation performed

- `bun run lint` — **passes** (0 errors, 0 warnings).
- `bunx prisma generate` — **passes** (Prisma Client regenerated with new fields).
- `bunx prisma db push --accept-data-loss` — **passes** (schema applied to SQLite).
- `bun run scripts/seed.ts` — **passes** (44 doctors now have emails + password hashes).
- End-to-end API test via curl:
  - `POST /api/auth/login` with correct credentials → 200, returns doctor object.
  - `POST /api/auth/login` with wrong password → 401, "Invalid email or password."
  - `GET /api/auth/me` with session cookie → 200, returns doctor.
  - `GET /api/doctor/dashboard` with session → 200, returns stats + 30-day timeseries + 3 reviews.
  - `GET /api/doctor/appointments` with session → 200, 0 appointments (none booked yet).
  - `GET /api/doctor/profile` with session → 200, full profile.
  - `PATCH /api/doctor/profile` with `{ consultationFee: 1500 }` → 200, fee updated,
    DoctorRank recalculated from 76.9 → 82 (profileCompleteness + freshness boosted).
  - `GET /api/doctor/reviews` with session → 200, 3 reviews.
  - `POST /api/auth/logout` → 200, session destroyed.
  - `GET /api/doctor/dashboard` after logout → 401 Unauthorized. ✅
- Browser test via Agent Browser (desktop 1440×900):
  - Login page renders with email, password, show/hide toggle.
  - Filled credentials, clicked Sign in → redirected to dashboard.
  - Dashboard shows doctor name, 4 tabs, KPI tiles, chart, recent reviews.
  - Reviews tab shows 3 reviews with Reply buttons.
  - Profile tab shows editable fields with the previously-updated about text.
  - Appointments tab shows filter chips + "No appointments found" empty state.
  - Header profile menu opens with Dashboard / View public profile / Sign out.
  - Sign out returns to home page with "Sign in" button visible.
  - Signup page renders all 8 fields with validation-ready inputs.

### Known limitations / follow-up work

- **Sessions are stored in the DB**, not in Redis. For production scale, move
  session storage to Redis for sub-millisecond lookups and automatic TTL expiry.
- **No password reset flow** yet. A future iteration should add
  `POST /api/auth/forgot-password` and `POST /api/auth/reset-password` with
  email-based tokens.
- **No email verification** on signup. The doctor's email is trusted as-is.
  For production, send a verification link before allowing dashboard access.
- **No rate limiting** on login. A brute-force attack could try many passwords.
  Add IP-based rate limiting (e.g. 10 attempts per minute) in a future iteration.
- **The `email` field on Doctor is nullable** to preserve existing seeded data.
  For a production migration, backfill emails for all existing doctors and then
  make the field required.
- **The DoctorRank recalculation in `/api/doctor/profile`** uses the same 7-factor
  weights as the seed, but `responseRate`, `reviewQuality`, `reviewCount`,
  `publishedResearch`, and `verificationScore` are not updated by the doctor's
  own edits — they're driven by external signals (appointments, reviews, admin
  verification). A future iteration should add a background job that recomputes
  these factors periodically.
- **No CSRF protection** on the auth endpoints. The `sameSite: 'lax'` cookie
  attribute provides reasonable protection, but a production deploy should add
  explicit CSRF tokens for state-changing requests.
- **The dev server was unstable** during testing because Prisma's `log: ['query']`
  was generating 22MB+ of log output, filling the disk and causing crashes.
  This has been fixed by reducing logging to `['warn', 'error']`. Documented
  in `AGENTS.md` as a known pitfall.

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
