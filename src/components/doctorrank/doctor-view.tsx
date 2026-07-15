'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MapPin, Shield, BadgeCheck, Clock, Languages, Wallet,
  Phone, MessageCircle, Calendar, ArrowLeft, TrendingUp, CheckCircle2,
  Award, Activity, FlaskConical, Pill, Stethoscope, Hospital, ChevronRight,
  Quote, ThumbsUp, Eye, Share2, Sparkles, Lock, Zap, Globe,
} from 'lucide-react';
import { DoctorCard } from './doctor-card';
import { StylizedMap } from './stylized-map';
import { rankBand, formatINR, relativeTime } from '@/lib/doctorrank';

interface DoctorViewProps {
  slug: string;
  onNavigate: (view: string, payload?: any) => void;
  onBack: () => void;
}

export function DoctorView({ slug, onNavigate, onBack }: DoctorViewProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setData(null);
    fetch(`/api/doctors?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((j) => { if (!cancelled) { setData(j); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-6 w-32 rounded shimmer" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="h-40 rounded-2xl shimmer" />
            <div className="h-64 rounded-2xl shimmer" />
            <div className="h-64 rounded-2xl shimmer" />
          </div>
          <div className="h-80 rounded-2xl shimmer" />
        </div>
      </div>
    );
  }

  if (!data?.doctor) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Doctor not found</h1>
        <button onClick={onBack} className="mt-4 text-brand">Go back</button>
      </div>
    );
  }

  const d = data.doctor;
  const band = rankBand(d.doctorRank);
  const reviews = d.reviews || [];
  const avgRating = (d.reviewQuality / 20).toFixed(1);

  const rankBreakdown = [
    { label: 'Verification',        value: d.verificationScore,   weight: 22, icon: Shield },
    { label: 'Review Quality',      value: d.reviewQuality,       weight: 20, icon: Star },
    { label: 'Response Rate',       value: d.responseRate,        weight: 18, icon: Zap },
    { label: 'Profile Completeness',value: d.profileCompleteness, weight: 12, icon: CheckCircle2 },
    { label: 'Published Research',  value: Math.min(d.publishedResearch * 4, 100), weight: 10, icon: Globe },
    { label: 'Review Volume',       value: Math.min(d.reviewCount / 3, 100), weight: 10, icon: Activity },
    { label: 'Profile Freshness',   value: d.profileFreshness,    weight: 8,  icon: TrendingUp },
  ];

  const handleBook = async (form: any) => {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, doctorId: d.id }),
    });
    const json = await res.json();
    setBookingSubmitted(json);
  };

  const mapPoints = [
    { id: d.id, type: 'doctor' as const, name: d.name, lat: d.lat, lng: d.lng, sub: d.address, eta: 'On-site' },
    ...(data.nearbyHospitals || []).map((h: any) => ({
      id: h.id, type: 'hospital' as const, name: h.name, lat: h.lat, lng: h.lng, sub: h.address, eta: `${Math.floor(Math.random() * 20) + 5} min`,
    })),
    { id: 'lab-1', type: 'lab', name: 'City Diagnostic Lab', lat: d.lat + 0.01, lng: d.lng + 0.008, sub: 'Pathology · Radiology', eta: '8 min' },
    { id: 'pharma-1', type: 'pharmacy', name: 'Apollo Pharmacy', lat: d.lat - 0.008, lng: d.lng + 0.012, sub: '24x7 pharmacy', eta: '5 min' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <button onClick={() => onNavigate('home')} className="hover:text-foreground">Home</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => onNavigate('search')} className="hover:text-foreground">Doctors</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => onNavigate('specialty', { slug: d.specialty.slug })} className="hover:text-foreground">
          {d.specialty.name}
        </button>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate font-medium text-foreground">{d.name}</span>
      </nav>

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-4 overflow-hidden rounded-3xl border border-border bg-card shadow-premium"
      >
        <div className="relative h-32 bg-gradient-to-br from-brand-soft via-card to-emerald-soft sm:h-40">
          <div className="absolute inset-0 dot-bg opacity-40" />
          <button
            onClick={onBack}
            className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/90 px-3 py-1.5 text-[12px] font-medium text-foreground shadow-card backdrop-blur hover:bg-card"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
          <div className="absolute right-4 top-4 flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/90 px-2.5 py-1.5 text-[12px] font-medium text-foreground shadow-card backdrop-blur hover:bg-card">
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
          </div>
        </div>

        <div className="relative px-5 pb-5 sm:px-8 sm:pb-8">
          <div className="-mt-12 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-brand/20 blur-lg" />
                <img
                  src={d.photoUrl}
                  alt={`${d.name} — ${d.specialty.name}`}
                  className="relative h-24 w-24 rounded-2xl border-4 border-card object-cover shadow-premium sm:h-32 sm:w-32"
                  width={128}
                  height={128}
                />
                <div className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full bg-card shadow-card">
                  <BadgeCheck className="h-6 w-6 text-brand" />
                </div>
              </div>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{d.name}</h1>
                  {d.isSponsored && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                      Sponsored
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
                  <span className="font-medium text-foreground/80">{d.specialty.name}</span>
                  <span className="text-border">·</span>
                  <span>{d.experienceYears} years experience</span>
                  <span className="text-border">·</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{d.city.name}</span>
                </div>
                <p className="mt-1.5 text-[13px] text-muted-foreground">{d.qualifications}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-foreground">{avgRating}</span>
                    <span className="text-muted-foreground">({d.reviewCount} reviews)</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald">
                    <Clock className="h-3.5 w-3.5" /> {Math.round(d.responseRate)}% responds
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Wallet className="h-3.5 w-3.5" /> {formatINR(d.consultationFee)} consultation
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={`tel:${d.phone}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-[13px] font-medium text-foreground shadow-card hover:border-brand/40"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              <a
                href={`https://wa.me/${d.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald/30 bg-emerald-soft px-3 py-2 text-[13px] font-semibold text-emerald shadow-card hover:bg-emerald/10"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <button
                onClick={() => setBookingOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-[13px] font-semibold text-white shadow-card hover:bg-brand/90 hover:shadow-hover"
              >
                <Calendar className="h-4 w-4" /> Book Appointment
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT */}
        <div className="space-y-6">
          {/* DoctorRank transparency */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-brand" />
                  DoctorRank
                </div>
                <h2 className="mt-2 text-lg font-semibold text-foreground">Why {d.name.split(' ')[0] + ' ' + (d.name.split(' ')[1] || '')} ranks here</h2>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Transparent scoring — no &ldquo;best&rdquo; claims, just measurable factors.
                </p>
              </div>
              <div
                className="flex flex-col items-center rounded-2xl px-4 py-3"
                style={{ backgroundColor: band.bg }}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: band.color }}>
                  DoctorRank
                </span>
                <span className="text-3xl font-bold leading-tight" style={{ color: band.color }}>
                  {Math.round(d.doctorRank)}
                </span>
                <span className="text-[11px] font-medium" style={{ color: band.color }}>
                  {band.label}
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {rankBreakdown.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="rounded-xl border border-border bg-background p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <r.icon className="h-4 w-4 text-brand" />
                      <span className="text-[12px] font-medium text-foreground">{r.label}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground">{r.weight}%</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${r.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 + i * 0.03 }}
                        className="h-full rounded-full bg-gradient-to-r from-brand to-emerald"
                      />
                    </div>
                    <span className="text-[12px] font-semibold tabular-nums text-foreground">
                      {Math.round(r.value)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2 text-[11.5px] text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-brand" />
              DoctorRank is computed objectively. Sponsored listings, if any, are always labeled separately and never affect the rank.
            </div>
          </section>

          {/* About */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">About</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground/90">{d.about}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-muted/40 p-3">
                <Award className="h-4 w-4 text-brand" />
                <div className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">Experience</div>
                <div className="text-[14px] font-semibold text-foreground">{d.experienceYears} years</div>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <Languages className="h-4 w-4 text-brand" />
                <div className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">Languages</div>
                <div className="text-[14px] font-semibold text-foreground">{(d.languages || []).join(', ')}</div>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <Shield className="h-4 w-4 text-brand" />
                <div className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">Registration</div>
                <div className="text-[14px] font-semibold text-foreground">{d.registrationNumber}</div>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <Wallet className="h-4 w-4 text-brand" />
                <div className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">Fee</div>
                <div className="text-[14px] font-semibold text-foreground">{formatINR(d.consultationFee)}</div>
              </div>
            </div>
          </section>

          {/* Conditions & Procedures */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Conditions treated & procedures</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Conditions</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(d.conditionsTreated || []).map((c: string, i: number) => (
                    <span key={i} className="rounded-md bg-brand-soft px-2 py-1 text-[12px] font-medium text-brand">{c}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Procedures</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(d.procedures || []).map((p: string, i: number) => (
                    <span key={i} className="rounded-md bg-emerald-soft px-2 py-1 text-[12px] font-medium text-emerald">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <div className="flex items-end justify-between">
              <h2 className="text-lg font-semibold text-foreground">Patient reviews</h2>
              <span className="text-[12px] text-muted-foreground">{reviews.length} verified reviews</span>
            </div>
            <div className="mt-4 flex items-center gap-4 rounded-xl bg-muted/40 p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">{avgRating}</div>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`h-3 w-3 ${s <= Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                  ))}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">{d.reviewCount} total</div>
              </div>
              <div className="flex-1 space-y-1">
                {[5,4,3,2,1].map((s) => {
                  const pct = s === 5 ? 78 : s === 4 ? 18 : s === 3 ? 3 : s === 2 ? 1 : 0;
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <span className="w-3 text-[11px] text-muted-foreground">{s}</span>
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-[11px] tabular-nums text-muted-foreground">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {reviews.slice(0, 5).map((r: any, i: number) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-[13px] font-semibold text-brand">
                        {r.patientName[0]}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-foreground">{r.patientName}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {r.procedure} · {relativeTime(r.createdAt)}
                        </div>
                      </div>
                    </div>
                    {r.isVerified && (
                      <span className="rounded-full bg-emerald-soft px-2 py-0.5 text-[10px] font-semibold text-emerald">
                        Verified patient
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(r.rating) ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                    ))}
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">&ldquo;{r.comment}&rdquo;</p>
                  <button className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground">
                    <ThumbsUp className="h-3 w-3" /> Helpful ({r.helpfulVotes})
                  </button>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Related doctors */}
          {data.related?.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground">Related doctors</h2>
              <p className="text-[13px] text-muted-foreground">Other {d.specialty.name.toLowerCase()} specialists</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {data.related.map((r: any, i: number) => (
                  <DoctorCard key={r.id} doctor={r} onOpen={(slug) => onNavigate('doctor', { slug })} index={i} compact />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT sidebar */}
        <div className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          {/* Clinic timings */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand" />
              <h3 className="text-[14px] font-semibold text-foreground">Clinic timings</h3>
            </div>
            <div className="mt-3 space-y-2">
              {(d.timings || []).map((t: any, i: number) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-[12px]">
                  <span className="font-medium text-foreground">{t.day}</span>
                  <span className="text-muted-foreground">{t.hours}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setBookingOpen(true)}
              className="mt-3 w-full rounded-xl bg-brand py-2.5 text-[13px] font-semibold text-white shadow-card hover:bg-brand/90 hover:shadow-hover"
            >
              Book appointment
            </button>
          </section>

          {/* Location & Map */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand" />
              <h3 className="text-[14px] font-semibold text-foreground">Location</h3>
            </div>
            <p className="mt-2 text-[12px] text-muted-foreground">{d.address}</p>
            <div className="mt-3 h-48 overflow-hidden rounded-xl">
              <StylizedMap
                points={mapPoints}
                center={{ lat: d.lat, lng: d.lng }}
                className="!rounded-xl"
              />
            </div>
          </section>

          {/* Insurance */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand" />
              <h3 className="text-[14px] font-semibold text-foreground">Accepted insurance</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(d.acceptedInsurance || []).map((ins: string, i: number) => (
                <span key={i} className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-foreground">{ins}</span>
              ))}
            </div>
          </section>

          {/* Nearby services */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-[14px] font-semibold text-foreground">Nearby services</h3>
            <div className="mt-3 space-y-2">
              {[
                { icon: Hospital, label: 'Hospitals', count: data.nearbyHospitals?.length || 0, color: 'text-red-600 bg-red-50' },
                { icon: FlaskConical, label: 'Diagnostic Labs', count: 3, color: 'text-violet-600 bg-violet-50' },
                { icon: Pill, label: 'Pharmacies', count: 5, color: 'text-emerald bg-emerald-soft' },
                { icon: Stethoscope, label: 'Parking', count: 2, color: 'text-amber-600 bg-amber-50' },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className={`grid h-7 w-7 place-items-center rounded-md ${n.color}`}>
                      <n.icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[12px] font-medium text-foreground">{n.label}</span>
                  </div>
                  <span className="text-[12px] font-semibold text-muted-foreground">{n.count}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Affiliations */}
          {d.affiliations?.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h3 className="text-[14px] font-semibold text-foreground">Hospital affiliations</h3>
              <div className="mt-3 space-y-2">
                {d.affiliations.map((a: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                    <Hospital className="h-4 w-4 text-brand" />
                    <span className="text-[12px] font-medium text-foreground">{a}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Booking modal */}
      <AnimatePresence>
        {bookingOpen && (
          <BookingModal
            doctor={d}
            onClose={() => { setBookingOpen(false); setBookingSubmitted(null); }}
            onSubmit={handleBook}
            submitted={bookingSubmitted}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function BookingModal({ doctor, onClose, onSubmit, submitted }: {
  doctor: any;
  onClose: () => void;
  onSubmit: (form: any) => Promise<void>;
  submitted: any;
}) {
  const [form, setForm] = useState({ patientName: '', patientPhone: '', patientEmail: '', preferredDate: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const handle = async () => {
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4 backdrop-blur"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-premium"
      >
        {submitted ? (
          <div className="p-6 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-soft text-emerald">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Appointment confirmed</h3>
            <p className="mt-1 text-[13px] text-muted-foreground">{submitted.confirmation?.message}</p>
            <div className="mt-4 rounded-xl bg-muted/40 p-3 text-left text-[12px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Appointment ID</span><span className="font-mono font-semibold">{submitted.appointmentId?.slice(-8).toUpperCase()}</span></div>
              <div className="mt-1 flex justify-between"><span className="text-muted-foreground">Doctor</span><span className="font-medium">{doctor.name}</span></div>
              <div className="mt-1 flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-medium capitalize">{submitted.status}</span></div>
            </div>
            <a
              href={submitted.confirmation?.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald px-4 py-2.5 text-[13px] font-semibold text-white shadow-card hover:bg-emerald/90"
            >
              <MessageCircle className="h-4 w-4" /> Send WhatsApp confirmation
            </a>
            <button onClick={onClose} className="mt-2 w-full rounded-xl border border-border py-2 text-[13px] font-medium text-foreground hover:bg-muted">
              Close
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Book appointment</h3>
                <p className="text-[13px] text-muted-foreground">with {doctor.name}</p>
              </div>
              <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
                <ArrowLeft className="h-4 w-4 rotate-45" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Full name *</label>
                <input
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[14px] outline-none focus:border-brand"
                  placeholder="Patient name"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Phone *</label>
                  <input
                    value={form.patientPhone}
                    onChange={(e) => setForm({ ...form, patientPhone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[14px] outline-none focus:border-brand"
                    placeholder="+91…"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Email</label>
                  <input
                    value={form.patientEmail}
                    onChange={(e) => setForm({ ...form, patientEmail: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[14px] outline-none focus:border-brand"
                    placeholder="optional"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Preferred date & time *</label>
                <input
                  type="datetime-local"
                  value={form.preferredDate}
                  onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[14px] outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[14px] outline-none focus:border-brand"
                  placeholder="Briefly describe your concern"
                />
              </div>
            </div>

            <button
              onClick={handle}
              disabled={!form.patientName || !form.patientPhone || !form.preferredDate || submitting}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-[14px] font-semibold text-white shadow-card hover:bg-brand/90 disabled:opacity-50"
            >
              {submitting ? 'Confirming…' : 'Confirm appointment'}
              <Sparkles className="h-4 w-4" />
            </button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Confirmation via WhatsApp · SMS · Email
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
