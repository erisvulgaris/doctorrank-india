'use client';

import { motion } from 'framer-motion';
import {
  Hospital as HospitalIcon, ChevronRight, MapPin, Phone, Shield, Star,
  Bed, Stethoscope, Ambulance, Pill, FlaskConical, Car, Building2, HeartPulse,
} from 'lucide-react';
import { DoctorCard } from './doctor-card';
import { safeJsonParse, formatNumber } from '@/lib/doctorrank';

interface HospitalViewProps {
  hospital: any;
  onNavigate: (view: string, payload?: any) => void;
}

export function HospitalView({ hospital, onNavigate }: HospitalViewProps) {
  if (!hospital) return <div className="mx-auto max-w-3xl px-4 py-20 text-center">Hospital not found.</div>;

  const departments: string[] = safeJsonParse(hospital.departments, []);
  const facilities: string[] = safeJsonParse(hospital.facilities, []);
  const insurance: string[] = safeJsonParse(hospital.insurance, []);
  const roomCategories: string[] = safeJsonParse(hospital.roomCategories, []);
  const doctors = hospital.doctors || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <button onClick={() => onNavigate('home')} className="hover:text-foreground">Home</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => onNavigate('hospitals')} className="hover:text-foreground">Hospitals</button>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">{hospital.name}</span>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-4 overflow-hidden rounded-3xl border border-border bg-card shadow-premium"
      >
        <div className="relative h-32 bg-gradient-to-br from-red-50 via-card to-brand-soft sm:h-40">
          <div className="absolute inset-0 dot-bg opacity-40" />
          <div className="absolute left-6 top-6 grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-card">
            <HospitalIcon className="h-7 w-7 text-red-600" />
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 text-brand" />
                Multi-specialty Hospital · {hospital.city?.name}
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{hospital.name}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {hospital.address}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{hospital.rating}</div>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`h-3 w-3 ${s <= Math.round(hospital.rating) ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                  ))}
                </div>
                <div className="text-[11px] text-muted-foreground">{formatNumber(hospital.reviewCount)} reviews</div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">{hospital.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <a href={`tel:${hospital.phone}`} className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-[13px] font-medium text-foreground hover:border-brand/40">
              <Phone className="h-4 w-4" /> {hospital.phone}
            </a>
            <a href="tel:102" className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-700 hover:bg-red-100">
              <Ambulance className="h-4 w-4" /> Emergency: {hospital.emergencyPhone}
            </a>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Departments */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Departments</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {departments.map((d, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2 text-[12px] font-medium text-foreground">
                  <Stethoscope className="h-3.5 w-3.5 text-brand" /> {d}
                </div>
              ))}
            </div>
          </section>

          {/* Facilities */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Facilities & amenities</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {facilities.map((f, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl bg-emerald-soft/50 px-3 py-2 text-[12px] font-medium text-emerald">
                  <HeartPulse className="h-3.5 w-3.5" /> {f}
                </div>
              ))}
            </div>
          </section>

          {/* Room categories */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Room categories</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {roomCategories.map((r, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl bg-muted/40 p-3">
                  <Bed className="h-4 w-4 text-brand" />
                  <span className="text-[13px] font-medium text-foreground">{r}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Doctors */}
          {doctors.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground">Doctors at {hospital.name}</h2>
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
            <h3 className="text-[14px] font-semibold text-foreground">Insurance partners</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {insurance.map((ins, i) => (
                <span key={i} className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-foreground">{ins}</span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-[14px] font-semibold text-foreground">Nearby services</h3>
            <div className="mt-3 space-y-2">
              {[
                { icon: Pill, label: 'Pharmacies', count: 4 },
                { icon: FlaskConical, label: 'Diagnostic Labs', count: 6 },
                { icon: Car, label: 'Parking', count: 2 },
                { icon: Building2, label: 'Hotels for attendants', count: 5 },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-soft text-brand">
                      <n.icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[12px] font-medium text-foreground">{n.label}</span>
                  </div>
                  <span className="text-[12px] font-semibold text-muted-foreground">{n.count}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-red-200 bg-red-50/60 p-4">
            <div className="flex items-start gap-2">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />
              <div className="text-[11.5px] leading-relaxed text-red-800">
                <strong>Emergency:</strong> In a life-threatening situation, call <strong>102</strong> or visit the nearest emergency room.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
