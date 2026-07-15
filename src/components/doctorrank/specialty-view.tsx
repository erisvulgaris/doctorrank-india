'use client';

import { motion } from 'framer-motion';
import { Sparkles, Stethoscope, ChevronRight, ArrowRight, Activity } from 'lucide-react';
import { DoctorCard } from './doctor-card';

interface SpecialtyViewProps {
  specialty: any;
  onNavigate: (view: string, payload?: any) => void;
  onSearch: (q: string) => void;
}

export function SpecialtyView({ specialty, onNavigate, onSearch }: SpecialtyViewProps) {
  if (!specialty) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center">Specialty not found.</div>;
  }
  const doctors = specialty.doctors || [];
  const conditions = specialty.conditions || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <button onClick={() => onNavigate('home')} className="hover:text-foreground">Home</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => onNavigate('specialties')} className="hover:text-foreground">Specialties</button>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">{specialty.name}</span>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-4 relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-premium sm:p-8"
      >
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <Stethoscope className="h-3.5 w-3.5 text-brand" />
            Specialty · {doctors.length} doctors
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{specialty.name}</h1>
          <p className="mt-1 text-[14px] font-medium text-muted-foreground">{specialty.tagline}</p>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{specialty.description}</p>
          <button
            onClick={() => onSearch(specialty.name)}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-[13px] font-semibold text-white shadow-card hover:bg-brand/90"
          >
            <Sparkles className="h-4 w-4" /> Find {specialty.name.toLowerCase()} doctors
          </button>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {conditions.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-semibold text-foreground">Treatable conditions</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {conditions.map((c: any, i: number) => (
                  <button
                    key={c.id}
                    onClick={() => onNavigate('condition', { slug: c.slug })}
                    className="group flex items-center justify-between rounded-xl border border-border bg-background p-3 text-left hover:border-brand/40 hover:shadow-card"
                  >
                    <div>
                      <div className="text-[13px] font-semibold text-foreground">{c.name}</div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1">{c.overview}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {doctors.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground">Top {specialty.name} doctors</h2>
              <p className="text-[13px] text-muted-foreground">Ranked by DoctorRank — transparent, measurable factors.</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {doctors.map((d: any, i: number) => (
                  <DoctorCard key={d.id} doctor={d} onOpen={(slug) => onNavigate('doctor', { slug })} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-[14px] font-semibold text-foreground">Common procedures</h3>
            <div className="mt-3 space-y-2">
              {['Consultation & diagnosis','Diagnostic workup','Treatment planning','Procedure / surgery','Follow-up care'].map((p, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-[12px] font-medium text-foreground">
                  <Activity className="h-3.5 w-3.5 text-brand" />
                  {p}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-[14px] font-semibold text-foreground">At a glance</h3>
            <div className="mt-3 space-y-2 text-[12px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Doctors</span><span className="font-medium text-foreground">{doctors.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Conditions</span><span className="font-medium text-foreground">{conditions.length}</span></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
