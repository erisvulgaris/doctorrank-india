'use client';

import { motion } from 'framer-motion';
import {
  Sparkles, Shield, TrendingUp, ArrowRight, Star, Quote,
  Activity, Brain, Bone, Ear, HeartPulse, Baby, Stethoscope,
  Ribbon, Droplets, Flower2, Eye, Thermometer, MapPin, CheckCircle2,
  Zap, Globe, Lock, Search,
} from 'lucide-react';
import { HeroSearch } from './hero-search';
import { DoctorCard } from './doctor-card';

const SPECIALTY_ICONS: Record<string, any> = {
  Sparkles, HeartPulse, Bone, Brain, Ear, BrainCircuit: Brain, Baby, Stethoscope, Ribbon, Droplets, Flower2, Activity, Eye, Thermometer,
};

interface HomeViewProps {
  onNavigate: (view: string, payload?: any) => void;
  onSearch: (q: string) => void;
  cities: Array<{ slug: string; name: string }>;
  city: string;
  onCityChange: (c: string) => void;
  topDoctors: any[];
  specialties: any[];
  conditions: any[];
  stats: { doctors: number; cities: number; specialties: number; hospitals: number };
}

const POPULAR_CONDITIONS = [
  'Hair Fall', 'Kidney Stone', 'Gall Bladder Stone', 'PCOS', 'Migraine',
  'Diabetes', 'Acne', 'Thyroid', 'Depression', 'Cataract', 'Back Pain', 'Sinusitis',
];

export function HomeView({
  onNavigate, onSearch, cities, city, onCityChange,
  topDoctors, specialties, conditions, stats,
}: HomeViewProps) {
  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        {/* Background flourish */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
          <div className="absolute -top-20 right-10 h-72 w-72 rounded-full bg-emerald/15 blur-[100px]" />
          <div className="absolute -top-10 left-10 h-72 w-72 rounded-full bg-cyan-soft/40 blur-[100px]" />
        </div>
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40 mask-fade-b" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-[12px] font-medium text-muted-foreground shadow-card backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
              </span>
              AI-Powered Doctor Discovery · India
              <span className="ml-1 rounded bg-emerald-soft px-1.5 py-0.5 text-[10px] font-semibold text-emerald">2026</span>
            </div>

            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Find the right doctor
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-brand via-[#3B82F6] to-emerald bg-clip-text text-transparent">
                  for your condition.
                </span>
                <svg className="absolute -bottom-2 left-0 h-2 w-full text-brand/30" viewBox="0 0 200 8" preserveAspectRatio="none">
                  <path d="M0 4 Q 50 0 100 4 T 200 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-balance text-[15px] leading-relaxed text-muted-foreground sm:text-[17px]">
              Patients don&apos;t search for hospitals — they search for solutions. DoctorRank understands
              medical intent and matches you with verified specialists ranked on measurable, transparent factors.
            </p>

            <div className="mt-8">
              <HeroSearch
                onSearch={onSearch}
                onSuggestionClick={(type, val) => {
                  if (type === 'doctor') onNavigate('doctor', { slug: val });
                  else if (type === 'condition') onNavigate('condition', { slug: val });
                  else if (type === 'specialty') onNavigate('specialty', { slug: val });
                }}
                cities={cities}
                city={city}
                onCityChange={onCityChange}
              />
            </div>

            {/* Trust strip */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald" />
                Verified medical registrations
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-brand" />
                Only verified-patient reviews
              </span>
              <span className="inline-flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-brand" />
                Transparent ranking factors
              </span>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {[
              { label: 'Verified Doctors', value: stats.doctors, suffix: '+', icon: Stethoscope },
              { label: 'Cities Covered', value: stats.cities, suffix: '', icon: MapPin },
              { label: 'Specialties', value: stats.specialties, suffix: '', icon: Activity },
              { label: 'Hospitals', value: stats.hospitals, suffix: '+', icon: HeartPulse },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-4 shadow-card"
              >
                <s.icon className="h-5 w-5 text-brand" />
                <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  {s.value}{s.suffix}
                </div>
                <div className="text-[12px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== Popular Conditions ===== */}
      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              Popular Conditions
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              What patients search for
            </h2>
            <p className="mt-1.5 max-w-xl text-[14px] text-muted-foreground">
              Each condition opens a content hub with symptoms, causes, treatment options, and matched doctors near you.
            </p>
          </div>
          <button
            onClick={() => onNavigate('conditions')}
            className="hidden items-center gap-1 text-[13px] font-semibold text-brand hover:gap-2 transition-all sm:inline-flex"
          >
            View all conditions <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {conditions.slice(0, 12).map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              whileHover={{ y: -2 }}
              onClick={() => onNavigate('condition', { slug: c.slug })}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-left shadow-card transition-all hover:border-brand/30 hover:shadow-hover"
            >
              <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                <ArrowRight className="h-4 w-4 text-brand" />
              </div>
              <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Activity className="h-4 w-4" />
              </div>
              <h3 className="text-[14px] font-semibold text-foreground">{c.name}</h3>
              <p className="mt-0.5 line-clamp-1 text-[12px] text-muted-foreground">
                {c.specialty?.name}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ===== How DoctorRank Works ===== */}
      <section className="relative overflow-hidden border-y border-border bg-card">
        <div className="absolute inset-0 dot-bg opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-brand" />
              Transparent Ranking
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              We never say &ldquo;Best Doctor.&rdquo;
              <br className="hidden sm:block" />
              We show why someone ranks highly.
            </h2>
            <p className="mt-3 text-[14px] text-muted-foreground">
              DoctorRank is a transparent score computed from measurable factors — so you can make an informed decision.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { icon: Shield, label: 'Verification', weight: '22%', desc: 'Medical registration verified against state councils.' },
              { icon: Star, label: 'Review Quality', weight: '20%', desc: 'Verified-patient reviews, weighted by procedure relevance.' },
              { icon: Zap, label: 'Response Rate', weight: '18%', desc: 'How quickly the doctor responds to booking requests.' },
              { icon: CheckCircle2, label: 'Profile Completeness', weight: '12%', desc: 'Photos, timings, fees, and clinical scope documented.' },
              { icon: Globe, label: 'Research', weight: '10%', desc: 'Published peer-reviewed research and conferences.' },
              { icon: Activity, label: 'Review Volume', weight: '10%', desc: 'Total verified reviews — capped to avoid gaming.' },
              { icon: TrendingUp, label: 'Profile Freshness', weight: '8%', desc: 'Recently updated profiles rank higher.' },
              { icon: Lock, label: 'No Pay-to-Rank', weight: '—', desc: 'Sponsored listings are always clearly labeled.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="rounded-2xl border border-border bg-background p-4 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
                    <f.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {f.weight}
                  </span>
                </div>
                <h3 className="mt-3 text-[13px] font-semibold text-foreground">{f.label}</h3>
                <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => onNavigate('ranking')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-[13px] font-semibold text-foreground shadow-card transition-all hover:border-brand/40 hover:shadow-hover"
            >
              Read the full methodology <ArrowRight className="h-4 w-4 text-brand" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== Top Ranked Doctors ===== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-brand" />
              Top Ranked Specialists
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Specialists leading their fields
            </h2>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="hidden items-center gap-1 text-[13px] font-semibold text-brand hover:gap-2 transition-all sm:inline-flex"
          >
            Browse all doctors <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topDoctors.map((d, i) => (
            <DoctorCard key={d.id} doctor={d} onOpen={(slug) => onNavigate('doctor', { slug })} index={i} />
          ))}
        </div>
      </section>

      {/* ===== Specialties ===== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <Stethoscope className="h-3.5 w-3.5 text-brand" />
              Browse by Specialty
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              14 specialties, ranked and verified
            </h2>
          </div>
          <button
            onClick={() => onNavigate('specialties')}
            className="hidden items-center gap-1 text-[13px] font-semibold text-brand hover:gap-2 transition-all sm:inline-flex"
          >
            All specialties <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {specialties.map((s, i) => {
            const Icon = SPECIALTY_ICONS[s.icon] || Stethoscope;
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                whileHover={{ y: -2 }}
                onClick={() => onNavigate('specialty', { slug: s.slug })}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-left shadow-card transition-all hover:border-brand/30 hover:shadow-hover"
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-soft to-emerald-soft text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
                <h3 className="mt-3 text-[15px] font-semibold text-foreground">{s.name}</h3>
                <p className="mt-1 text-[12px] text-muted-foreground">{s.tagline}</p>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ===== AI Section ===== */}
      <section className="relative overflow-hidden border-y border-border bg-gradient-to-br from-[#F4F6FB] via-white to-[#EBF1FE]">
        <div className="absolute inset-0 dot-bg opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-brand">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                Search the way you actually think.
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Type a symptom, a condition, or a procedure. Our AI navigator converts natural language into
                specialization, then surfaces the right doctors, clinics, hospitals, and labs — with a clear
                reasoning trail so you know <em>why</em> each match was chosen.
              </p>

              <div className="mt-6 space-y-2.5">
                {[
                  { q: 'hair fall in men', a: '→ Dermatology · PRP, Finasteride, Minoxidil specialists' },
                  { q: 'stomach pain after meals', a: '→ Gastroenterology · Gall bladder evaluation' },
                  { q: 'knee pain when climbing stairs', a: '→ Orthopedics · Joint replacement or arthroscopy' },
                  { q: 'persistent sadness and low energy', a: '→ Psychiatry · Evidence-based therapy' },
                ].map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => onSearch(ex.q)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left shadow-card transition-all hover:border-brand/40 hover:shadow-hover"
                  >
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-brand" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-foreground">{ex.q}</div>
                      <div className="text-[11.5px] text-muted-foreground">{ex.a}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>

            {/* Reasoning card preview */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-premium"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-foreground">AI Symptom Navigator</div>
                      <div className="text-[11px] text-muted-foreground">Reasoning preview</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-soft px-2 py-0.5 text-[10px] font-semibold text-emerald">
                    Confidence 92%
                  </span>
                </div>

                <div className="mt-5 rounded-xl bg-muted/40 p-4">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Patient query</div>
                  <div className="mt-1 text-[14px] font-medium text-foreground">
                    &ldquo;I&apos;ve been losing hair for 3 months, mostly around the crown. What kind of doctor should I see?&rdquo;
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    { label: 'Specialization', value: 'Dermatology', reason: 'Hair loss is best evaluated by a dermatologist.' },
                    { label: 'Possible Condition', value: 'Androgenetic Alopecia', reason: 'Crown thinning in men is the classic pattern.' },
                    { label: 'Suggested Next Step', value: 'Consult + Trichoscopy', reason: 'Visualize hair shaft and follicle density.' },
                  ].map((r, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-soft text-emerald">
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{r.label}</div>
                        <div className="text-[13px] font-semibold text-foreground">{r.value}</div>
                        <div className="text-[11.5px] text-muted-foreground">{r.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
                  <strong>Disclaimer:</strong> Informational only — not medical advice. In an emergency, call 112.
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Patient Stories ===== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <Quote className="h-3.5 w-3.5 text-brand" />
            Verified Patient Stories
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Trusted by thousands of patients across India
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { name: 'Rohit S.', city: 'Mumbai', text: 'I searched "hair fall in men" and within seconds found a dermatologist ranked 91. The reasoning was clear — verified registration, 240 reviews, 94% response rate. Booked same day.', condition: 'Hair Fall' },
            { name: 'Anita K.', city: 'Bengaluru', text: 'The map view was a game changer. I could see three clinics near my office with travel times and parking. Found a gastroenterologist for my gall stone in 10 minutes.', condition: 'Gall Bladder Stone' },
            { name: 'Imran P.', city: 'Delhi', text: 'Finally a platform that does not say "Best Doctor" everywhere. The ranking breakdown told me exactly why each doctor ranked where they did. Trustworthy.', condition: 'Diabetes' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s2) => (
                  <Star key={s2} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-foreground/90">&ldquo;{s.text}&rdquo;</p>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-[12px] font-semibold text-brand">
                    {s.name[0]}
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-foreground">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground">{s.city} · {s.condition}</div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-soft px-2 py-0.5 text-[10px] font-semibold text-emerald">
                  Verified
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
