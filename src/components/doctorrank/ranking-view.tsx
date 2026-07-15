'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Shield, Star, Zap, CheckCircle2, Globe, Activity, TrendingUp, Lock, Sparkles } from 'lucide-react';

export function RankingView({ onNavigate }: { onNavigate: (v: string, payload?: any) => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <button onClick={() => onNavigate('home')} className="hover:text-foreground">Home</button>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">How ranking works</span>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-4 rounded-3xl border border-border bg-card p-6 shadow-premium sm:p-8"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5 text-brand" />
          Methodology
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          How DoctorRank is calculated
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          DoctorRank is a transparent, weighted score on a 0–100 scale. We never claim a doctor is &ldquo;best&rdquo; —
          we show you the measurable factors that contribute to their rank so you can make an informed decision.
          No doctor can pay to improve their DoctorRank. Sponsored listings, if shown, are always labeled separately.
        </p>
      </motion.div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold text-foreground">The seven factors</h2>
        <div className="mt-4 space-y-3">
          {[
            { icon: Shield, name: 'Verification', weight: 22, desc: 'Medical registration verified against the relevant state medical council. Unverified doctors cannot rank above 70.' },
            { icon: Star, name: 'Review Quality', weight: 20, desc: 'Average rating from verified-patient reviews, weighted by procedure relevance and recency.' },
            { icon: Zap, name: 'Response Rate', weight: 18, desc: 'Percentage of booking requests the doctor responds to within 24 hours, measured over the trailing 90 days.' },
            { icon: CheckCircle2, name: 'Profile Completeness', weight: 12, desc: 'Presence of photo, clinic photos, qualifications, timings, fees, conditions treated, procedures, and accepted insurance.' },
            { icon: Globe, name: 'Published Research', weight: 10, desc: 'Peer-reviewed publications and conference presentations indexed in PubMed/Google Scholar. Capped at 100 to prevent over-weighting academics.' },
            { icon: Activity, name: 'Review Volume', weight: 10, desc: 'Total verified reviews, capped at 300 to prevent a single high-volume doctor from dominating.' },
            { icon: TrendingUp, name: 'Profile Freshness', weight: 8, desc: 'How recently the doctor updated their profile (fees, timings, photos). Stale profiles decay over time.' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-foreground">{f.name}</div>
                    <div className="text-[12px] text-muted-foreground">{f.desc}</div>
                  </div>
                </div>
                <span className="text-[13px] font-bold text-brand">{f.weight}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-soft/40 p-5">
          <Lock className="h-5 w-5 text-emerald" />
          <h3 className="mt-2 text-[14px] font-semibold text-foreground">Anti-gaming safeguards</h3>
          <ul className="mt-2 space-y-1 text-[12px] text-muted-foreground">
            <li>• Only verified-patient reviews count toward rank</li>
            <li>• Spam and fraud detection on every review</li>
            <li>• Response rate measured server-side, not self-reported</li>
            <li>• Review volume is capped to prevent inflation</li>
            <li>• Profile freshness decays if not updated</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
          <Sparkles className="h-5 w-5 text-amber-700" />
          <h3 className="mt-2 text-[14px] font-semibold text-foreground">Sponsored listings</h3>
          <p className="mt-2 text-[12px] leading-relaxed text-amber-800">
            Doctors may pay for sponsored placement, but sponsored listings are always clearly labeled and never affect the DoctorRank score.
            Sponsored listings appear in addition to (never instead of) organic results.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold text-foreground">Rank bands</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            { band: '90–100', label: 'Exceptional', color: '#047857', bg: '#E7F8F1' },
            { band: '80–89',  label: 'Excellent',   color: '#1456D9', bg: '#EBF1FE' },
            { band: '70–79',  label: 'Very Good',   color: '#0369A1', bg: '#E0F2FE' },
            { band: '60–69',  label: 'Good',        color: '#B45309', bg: '#FEF3C7' },
            { band: '< 60',   label: 'Emerging',    color: '#475569', bg: '#F1F5F9' },
          ].map((b, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl p-3" style={{ backgroundColor: b.bg }}>
              <div>
                <div className="text-[12px] font-semibold" style={{ color: b.color }}>{b.label}</div>
                <div className="text-[11px] text-muted-foreground">DoctorRank {b.band}</div>
              </div>
              <span className="text-[20px] font-bold" style={{ color: b.color }}>{b.band.split('–')[0]}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => onNavigate('search')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-card hover:bg-brand/90"
        >
          Browse ranked doctors
        </button>
      </div>
    </div>
  );
}
