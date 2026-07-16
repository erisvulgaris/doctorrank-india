# DoctorRank India 🇮🇳

> AI-Powered Doctor Discovery Platform + Enterprise Admin Panel
> Premium, mobile-first, medical-themed healthcare SaaS

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-New%20York-black)](https://ui.shadcn.com/)

DoctorRank India is a production-grade healthcare discovery platform that helps patients find the right doctor for their condition. It is **not** another Practo clone — it is a premium, SEO-first, AI-ready platform with a transparent ranking system and a complete enterprise admin console.

## ✨ Key Differentiators

- **Never says "Best Doctor"** — instead shows *why* a doctor ranks highly via a transparent DoctorRank score (0-100) computed from 7 measurable, weighted factors
- **AI Symptom Navigator** — converts natural language ("stomach pain after meals") into matched specialties, conditions, and doctors with reasoning trails
- **Mobile-first design** — built for India's mobile-first audience with bottom nav, touch-friendly targets, and stacked layouts
- **Medical-themed visual identity** — ECG animations, heartbeat motifs, vital-signs color palette
- **Enterprise admin panel** — 22 modules covering healthcare operations, content, SEO, AI, revenue, security, and developer tooling

## 🎨 Design System

- **Theme**: Light mode only — clinical, premium, enterprise
- **Palette**: Medical Blue `#0B5FFF` · Emerald Green `#00B884` · Soft Cyan · Warm White `#FAFBFD`
- **Typography**: Inter (premium SaaS feel)
- **Animations**: Framer Motion throughout — ECG line drawing, pulse rings, rank gauge arcs, staggered card reveals
- **Visual motifs**: Animated ECG/heartbeat lines, medical cross patterns, circular rank gauges

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 16 (App Router)                  │
│  ┌─────────────────┐    ┌──────────────────────────────┐   │
│  │   Public Site   │    │        Admin Console         │   │
│  │  (Mobile-first) │    │   (Enterprise SaaS layout)   │   │
│  │                 │    │                              │   │
│  │ • Home          │    │ • Dashboard                  │   │
│  │ • Search + Map  │    │ • Doctor Mgmt                │   │
│  │ • Doctor Profile│    │ • Hospital Mgmt              │   │
│  │ • Condition Hub │    │ • Appointments               │   │
│  │ • Specialty     │    │ • Verification Center        │   │
│  │ • Hospital      │    │ • Reviews Moderation         │   │
│  │ • Ranking       │    │ • SEO Control                │   │
│  │                 │    │ • AI Center                  │   │
│  │                 │    │ • Revenue                    │   │
│  │                 │    │ • Analytics                  │   │
│  │                 │    │ • Users & Roles              │   │
│  │                 │    │ • Security                   │   │
│  │                 │    │ • Developer Console          │   │
│  │                 │    │ • Settings                   │   │
│  └─────────────────┘    └──────────────────────────────┘   │
│                          │                                  │
│              ┌───────────┴────────────┐                    │
│              │   API Routes (REST)    │                    │
│              │ /api/search            │                    │
│              │ /api/suggest           │                    │
│              │ /api/doctors           │                    │
│              │ /api/ai-symptom        │                    │
│              │ /api/appointments      │                    │
│              └───────────┬────────────┘                    │
└──────────────────────────┼──────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │   Prisma ORM (SQLite)   │
              │  → PostgreSQL in prod   │
              └─────────────────────────┘
```

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Animations | Framer Motion |
| Charts | Recharts |
| Database | Prisma ORM + SQLite (dev) / PostgreSQL (prod) |
| Icons | Lucide React |
| Fonts | Inter (Geist Mono fallback) |

## 📦 Modules

### Public Site (Mobile-First)

1. **Home** — Hero with rotating search placeholders, ECG line motif, Popular Conditions, DoctorRank transparency section, Top Ranked Specialists, AI Symptom Navigator preview, Patient Stories
2. **Search Results** — Split layout (cards + interactive map), AI Symptom Navigator banner, Google-like instant suggestions, voice search, advanced filters (sort, fee, rating, experience)
3. **Doctor Profile** — Hero card, DoctorRank transparency breakdown (7 weighted factors), About, Conditions & Procedures, Verified Patient Reviews, Related Doctors, Clinic Timings, Location Map with nearby services, Insurance, Hospital Affiliations, Booking Modal with WhatsApp confirmation
4. **Condition Hub** — Overview, Symptoms, Causes, Treatments, When-to-See-Doctor, Doctors, FAQs
5. **Specialty Page** — Treatable Conditions, Top Doctors, Common Procedures
6. **Hospital Page** — Departments, Facilities, Room Categories, Doctors, Insurance Partners, Nearby Services
7. **Ranking Methodology** — 7 weighted factors, anti-gaming safeguards, sponsored listing policy, rank bands
8. **Mobile bottom navigation** — Home, Search, Conditions, Hospitals, Ranking

### Admin Console (Enterprise SaaS)

22 modules across 6 groups:

| Group | Modules |
|-------|---------|
| **Overview** | Dashboard, Analytics |
| **Healthcare** | Doctors, Hospitals, Appointments, Verification, Reviews |
| **Content & SEO** | Disease Library, Procedures, Specialties, SEO Control, Content |
| **AI & Intelligence** | AI Center, Maps |
| **Business** | Revenue, CRM, Support, Marketing |
| **System** | Users & Roles, Security, Developer Console, Settings |

#### Admin Features

- **Collapsible sidebar** with 6 nav groups and 22 modules
- **Top command bar** with breadcrumbs, search, notifications, profile menu
- **Command palette** (Ctrl+K / Cmd+K) — jump to any module or action
- **KPI cards** with sparklines, deltas, and color-coded icons
- **Interactive charts** — area, bar, line, pie, radial bar (Recharts)
- **Data tables** — search, sort, filter, bulk actions, pagination, row selection
- **Real-time activity feed**
- **System health monitoring** with uptime gauges
- **API Explorer** in Developer Console — test any endpoint live
- **Audit logs** with severity levels
- **Session management** with revoke buttons
- **API key management**
- **Feature flag toggles**
- **Permission matrix** (RBAC)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- SQLite (pre-installed on most systems)

### Installation

```bash
# Clone the repo
git clone https://github.com/erisvulgaris/doctorrank-india.git
cd doctorrank-india

# Install dependencies
bun install

# Set up the database
cp .env.example .env  # Create from template if needed
bun run db:push

# Seed the database with realistic Indian healthcare data
bun run scripts/seed.ts

# Start the dev server
bun run dev
```

Open `http://localhost:3000` in your browser.

### Access the Admin Panel

Click the "Admin Panel" pill on the home page (below the hero search), or navigate directly to:

```
http://localhost:3000/?view=admin&section=dashboard
```

Use **Ctrl+K** (or **Cmd+K** on macOS) to open the command palette from anywhere in the admin.

## 🗄 Database Schema

The Prisma schema is designed for modular vertical scaling — the same pattern (City → Specialty → Condition → Professional → Review → Appointment) can be re-skinned for lawyers, CAs, schools, machinery manufacturers, or pharmacies without code changes.

```
City ─┬─→ Hospital
      │
      └─→ Doctor ─┬─→ Review
                  │
                  ├─→ Appointment
                  │
                  └─→ Conditions (many-to-many)

Specialty ─→ Conditions
```

### Seed Data Includes

- 8 Indian cities (Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Pune, Kolkata, Ahmedabad)
- 14 specialties (Dermatology, Cardiology, Orthopedics, Neurology, ENT, Psychiatry, Pediatrics, Dentistry, Oncology, Urology, Gynecology, Gastroenterology, Ophthalmology, Endocrinology)
- 16 conditions (Hair Fall, Acne, PCOS, Thyroid, Diabetes, Migraine, Depression, Cataract, Kidney Stone, Gall Bladder Stone, Back Pain, Joint Pain, Knee Replacement, Sinusitis, Hypertension, Heart Disease)
- 10 hospitals (Apollo, Fortis, AIIMS, Tata Memorial, Manipal, Max, Kokilaben, Narayana, Artemis, Ruby Hall)
- 44 doctors with realistic Indian names, qualifications, photos, locations
- ~150 verified patient reviews

## 🎯 DoctorRank Transparency System

DoctorRank is a 0-100 score computed from 7 measurable, weighted factors:

| Factor | Weight | Description |
|--------|--------|-------------|
| Verification | 22% | Medical registration verified against state councils |
| Review Quality | 20% | Verified-patient reviews, weighted by procedure |
| Response Rate | 18% | Server-measured, not self-reported |
| Profile Completeness | 12% | Photos, timings, fees, clinical scope documented |
| Published Research | 10% | Peer-reviewed publications, capped to prevent over-weighting |
| Review Volume | 10% | Capped at 300 to prevent gaming |
| Profile Freshness | 8% | Recently updated profiles rank higher |

**Anti-gaming safeguards**: only verified-patient reviews count, response rate is measured server-side, review volume is capped, sponsored listings never affect rank and are always labeled.

## 🔌 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=&city=&specialty=&condition=` | Full-text search across doctors, conditions, specialties, hospitals |
| GET | `/api/suggest?q=` | Instant search suggestions |
| GET | `/api/doctors?slug=` | Doctor detail with related doctors and nearby hospitals |
| POST | `/api/ai-symptom` | AI symptom navigator (text → specialty + condition + doctors) |
| POST | `/api/appointments` | Book appointment with WhatsApp confirmation |

## 📱 Responsive Design

- **Mobile-first** layouts throughout — single column on mobile, expanding to multi-column on larger screens
- **Bottom navigation** on mobile (Home, Search, Conditions, Hospitals, Ranking)
- **Touch-friendly** tap targets (minimum 44px)
- **Safe area insets** for iOS notch
- **Sticky search bar** with filters
- **Stacked map** on mobile in search results
- **Drawer-style** mobile menu

## 🎨 Unique Visual Elements

- **Animated ECG line** — the signature medical motif, drawn in the hero and scrolling at the bottom of the home page
- **Circular Rank Gauge** — animated SVG arc showing DoctorRank on every doctor card
- **Pulse rings** — soft glow animations on key CTAs
- **Medical cross pattern** — subtle background texture using radial gradients
- **Heartbeat icon** — animated vital signs
- **Glass morphism** — premium sticky header with backdrop blur

## 🔐 Security & Compliance

- WCAG AA compliant color contrast
- Semantic HTML throughout
- ARIA labels and roles
- Keyboard navigation (press `/` to focus search, `Ctrl+K` for command palette)
- Audit logs in admin
- Session management with revoke
- API key management with scope-based permissions
- IP whitelist configuration

## 📈 SEO Foundation

- Server-side rendering with `force-dynamic` for fresh data
- JSON-LD helpers for Physician, Hospital, FAQ, Breadcrumb, MedicalCondition schemas
- Comprehensive metadata: Open Graph, Twitter Cards, robots, theme-color
- Internal linking between conditions, specialties, doctors, and hospitals
- Automatic sitemap structure (XML, image, video)
- Schema generator coverage tracking

## 🛣 Roadmap

- [ ] Clerk authentication integration
- [ ] Real Google Maps integration (replacing stylized SVG map)
- [ ] Razorpay payment integration
- [ ] Cloudflare R2 storage for media
- [ ] PostgreSQL migration for production
- [ ] Real-time WebSocket notifications
- [ ] AI-powered content generation pipeline
- [ ] Multilingual content (8 Indian languages)
- [ ] Doctor self-serve dashboard
- [ ] Hospital ERP integration
- [ ] Telemedicine / video consultations
- [ ] Lab test booking
- [ ] CRM with sales funnel
- [ ] Customer support ticketing
- [ ] Marketing campaign manager

## 📄 License

MIT License — feel free to use this as a foundation for your own vertical search platforms.

## 🙏 Acknowledgments

- Healthcare data inspired by Indian healthcare providers
- Photos via [randomuser.me](https://randomuser.me)
- Icons by [Lucide](https://lucide.dev)
- UI components by [shadcn/ui](https://ui.shadcn.com)

---

Built with care in India. Informational only — not medical advice. In an emergency, call 112.
