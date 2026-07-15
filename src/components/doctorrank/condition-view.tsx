'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, Activity, Pill, FlaskConical, Stethoscope,
  Hospital, AlertTriangle, CheckCircle2, ChevronRight, HeartPulse,
} from 'lucide-react';
import { DoctorCard } from './doctor-card';
import { safeJsonParse } from '@/lib/doctorrank';

interface ConditionViewProps {
  condition: any;
  onNavigate: (view: string, payload?: any) => void;
  onSearch: (q: string) => void;
}

export function ConditionView({ condition, onNavigate, onSearch }: ConditionViewProps) {
  if (!condition) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center">Condition not found.</div>;
  }

  const symptoms: string[] = safeJsonParse(condition.symptoms, []);
  const causes: string[] = safeJsonParse(condition.causes, []);
  const treatments: string[] = safeJsonParse(condition.treatments, []);
  const faqs: Array<{ q: string; a: string }> = safeJsonParse(condition.faqs, []);
  const doctors = condition.doctors || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <button onClick={() => onNavigate('home')} className="hover:text-foreground">Home</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => onNavigate('conditions')} className="hover:text-foreground">Conditions</button>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">{condition.name}</span>
      </nav>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-4 relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-premium sm:p-8"
      >
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-emerald/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-brand" />
            Condition Hub · {condition.specialty?.name}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{condition.name}</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{condition.overview}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => onSearch(condition.name)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-[13px] font-semibold text-white shadow-card hover:bg-brand/90"
            >
              <Sparkles className="h-4 w-4" /> Find doctors for {condition.name}
            </button>
            <button
              onClick={() => onNavigate('specialty', { slug: condition.specialty?.slug })}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground hover:border-brand/40"
            >
              <Stethoscope className="h-4 w-4" /> Browse {condition.specialty?.name}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Symptoms */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Common symptoms</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {symptoms.map((s, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl bg-muted/40 p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <span className="text-[13px] text-foreground/90">{s}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Causes */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Causes & risk factors</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {causes.map((c, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl bg-muted/40 p-3">
                  <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                  <span className="text-[13px] text-foreground/90">{c}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Treatments */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Treatment options</h2>
            <div className="mt-3 space-y-2">
              {treatments.map((t, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl bg-emerald-soft/40 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                  <span className="text-[13px] text-foreground/90">{t}</span>
                </div>
              ))}
            </div>
          </section>

          {/* When to see a doctor */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-amber-900">When to see a doctor</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-amber-800">{condition.whenToSeeDoc}</p>
              </div>
            </div>
          </section>

          {/* Doctors for this condition */}
          {doctors.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground">Doctors treating {condition.name}</h2>
              <p className="text-[13px] text-muted-foreground">Top-ranked specialists based on DoctorRank</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {doctors.slice(0, 6).map((d: any, i: number) => (
                  <DoctorCard key={d.id} doctor={d} onOpen={(slug) => onNavigate('doctor', { slug })} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          {faqs.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-semibold text-foreground">Frequently asked questions</h2>
              <div className="mt-3 space-y-2">
                {faqs.map((f, i) => (
                  <details key={i} className="group rounded-xl border border-border bg-background p-4 [&_summary]:cursor-pointer">
                    <summary className="flex items-center justify-between text-[14px] font-semibold text-foreground list-none">
                      {f.q}
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-[14px] font-semibold text-foreground">Quick actions</h3>
            <div className="mt-3 space-y-2">
              <button
                onClick={() => onSearch(condition.name)}
                className="flex w-full items-center justify-between rounded-xl bg-brand-soft px-3 py-2.5 text-[13px] font-medium text-brand hover:bg-brand/15"
              >
                <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Find doctors</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('specialty', { slug: condition.specialty?.slug })}
                className="flex w-full items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-muted"
              >
                <span className="flex items-center gap-2"><Stethoscope className="h-4 w-4" /> {condition.specialty?.name} specialty</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('hospitals')}
                className="flex w-full items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-muted"
              >
                <span className="flex items-center gap-2"><Hospital className="h-4 w-4" /> Hospitals</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('search')}
                className="flex w-full items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-muted"
              >
                <span className="flex items-center gap-2"><FlaskConical className="h-4 w-4" /> Diagnostic labs</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('search')}
                className="flex w-full items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-muted"
              >
                <span className="flex items-center gap-2"><Pill className="h-4 w-4" /> Medicines (info)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-[14px] font-semibold text-foreground">At a glance</h3>
            <div className="mt-3 space-y-2 text-[12px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Specialty</span><span className="font-medium text-foreground">{condition.specialty?.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Doctors listed</span><span className="font-medium text-foreground">{doctors.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Symptoms documented</span><span className="font-medium text-foreground">{symptoms.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Treatment options</span><span className="font-medium text-foreground">{treatments.length}</span></div>
            </div>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
            <div className="flex items-start gap-2">
              <HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <div className="text-[11.5px] leading-relaxed text-amber-800">
                <strong>Medical disclaimer:</strong> This page is informational only. Always consult a qualified medical professional for diagnosis and treatment.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
