'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MapPin, Shield, BadgeCheck, Clock, Languages, Wallet,
  Phone, MessageCircle, Calendar, ArrowLeft, TrendingUp, CheckCircle2,
  Award, Activity, FlaskConical, Pill, Stethoscope, Hospital, ChevronRight,
  Quote, ThumbsUp, Eye, Share2, Sparkles, Lock, Zap, Globe,
  X, AlertCircle, Loader2,
} from 'lucide-react';
import { DoctorCard } from './doctor-card';
import { StylizedMap } from './stylized-map';
import { DoctorImage } from './doctor-image';
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
    let json: any;
    try {
      json = await res.json();
    } catch {
      json = { error: 'Invalid response from server.' };
    }
    if (!res.ok || json?.error) {
      throw new Error(json?.error || `Request failed with status ${res.status}`);
    }
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
                <DoctorImage
                  src={d.photoUrl}
                  alt={`${d.name} — ${d.specialty.name}`}
                  className="relative h-24 w-24 rounded-2xl border-4 border-card object-cover shadow-premium sm:h-32 sm:w-32"
                  width={128}
                  height={128}
                  loading="eager"
                  fallbackInitial={d.name?.[0]}
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

// ============================================================
// BookingModal — accessible modal with form validation, error
// states, focus trap, Escape-to-close, and reset-on-close.
// ============================================================

interface BookingForm {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  preferredDate: string;
  notes: string;
}

const EMPTY_FORM: BookingForm = {
  patientName: '',
  patientPhone: '',
  patientEmail: '',
  preferredDate: '',
  notes: '',
};

// Indian mobile numbers: +91 followed by 10 digits, or 10 digits starting with 6-9.
const PHONE_REGEX = /^(\+?91[\s-]?)?[6-9]\d{9}$/;
// Basic email regex — server-side validation is authoritative.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(form: BookingForm): Partial<Record<keyof BookingForm, string>> {
  const errors: Partial<Record<keyof BookingForm, string>> = {};
  if (!form.patientName.trim()) {
    errors.patientName = 'Please enter the patient name.';
  } else if (form.patientName.trim().length < 2) {
    errors.patientName = 'Name must be at least 2 characters.';
  }
  if (!form.patientPhone.trim()) {
    errors.patientPhone = 'Phone number is required.';
  } else if (!PHONE_REGEX.test(form.patientPhone.replace(/\s+/g, ''))) {
    errors.patientPhone = 'Enter a valid Indian mobile number (e.g. +91 98765 43210).';
  }
  if (form.patientEmail.trim() && !EMAIL_REGEX.test(form.patientEmail.trim())) {
    errors.patientEmail = 'Enter a valid email or leave blank.';
  }
  if (!form.preferredDate) {
    errors.preferredDate = 'Please choose a date and time.';
  } else {
    const chosen = new Date(form.preferredDate);
    const now = new Date();
    if (chosen.getTime() < now.getTime() - 60_000) {
      errors.preferredDate = 'Please choose a future date and time.';
    }
  }
  return errors;
}

function BookingModal({ doctor, onClose, onSubmit, submitted }: {
  doctor: any;
  onClose: () => void;
  onSubmit: (form: any) => Promise<void>;
  submitted: any;
}) {
  const [form, setForm] = useState<BookingForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingForm, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof BookingForm, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const isComplete = !!submitted && !('error' in (submitted || {}));

  // Reset form whenever the modal is opened fresh (no submitted result yet)
  useEffect(() => {
    if (!submitted) {
      setForm(EMPTY_FORM);
      setErrors({});
      setTouched({});
      setSubmitError(null);
    }
  }, [submitted]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, submitting]);

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Move focus to first field on mount, and trap focus inside the modal
  useEffect(() => {
    const t = setTimeout(() => firstFieldRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onTab);
    return () => window.removeEventListener('keydown', onTab);
  }, []);

  const update = (field: keyof BookingForm, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field] || errors[field]) {
      const nextErrors = validateForm({ ...form, [field]: value });
      setErrors((e) => ({ ...e, [field]: nextErrors[field] }));
    }
  };

  const markTouched = (field: keyof BookingForm) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const nextErrors = validateForm(form);
    setErrors((e) => ({ ...e, [field]: nextErrors[field] }));
  };

  const handle = async () => {
    const validation = validateForm(form);
    setErrors(validation);
    setTouched({ patientName: true, patientPhone: true, patientEmail: true, preferredDate: true, notes: true });
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(form);
    } catch (e: any) {
      setSubmitError(e?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Today's datetime in local tz, truncated to minutes — used as min for date input
  const nowLocal = new Date();
  nowLocal.setSeconds(0, 0);
  const minDateTime = new Date(nowLocal.getTime() - nowLocal.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4 backdrop-blur"
      onClick={(e) => { if (e.target === e.currentTarget && !submitting) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-premium"
      >
        {/* Success state */}
        {isComplete ? (
          <div className="p-6 text-center" role="status" aria-live="polite">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-soft text-emerald">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 id="booking-modal-title" className="text-lg font-semibold text-foreground">Appointment confirmed</h3>
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
          /* Form state */
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 id="booking-modal-title" className="text-lg font-semibold text-foreground">Book appointment</h3>
                <p className="text-[13px] text-muted-foreground">with {doctor.name}</p>
              </div>
              <button
                onClick={onClose}
                disabled={submitting}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                aria-label="Close booking dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Submit error banner */}
            <AnimatePresence>
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div role="alert" className="flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2 text-[12px] leading-relaxed text-danger">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {/* Name */}
              <FormField
                label="Full name"
                required
                error={touched.patientName ? errors.patientName : undefined}
              >
                <input
                  ref={firstFieldRef}
                  type="text"
                  value={form.patientName}
                  onChange={(e) => update('patientName', e.target.value)}
                  onBlur={() => markTouched('patientName')}
                  aria-invalid={touched.patientName && !!errors.patientName ? true : undefined}
                  aria-describedby={errors.patientName ? 'err-patientName' : undefined}
                  className={`mt-1 w-full rounded-xl border bg-background px-3 py-2 text-[14px] outline-none transition-colors focus:border-brand ${
                    touched.patientName && errors.patientName ? 'border-danger' : 'border-border'
                  }`}
                  placeholder="Patient name"
                  autoComplete="name"
                />
              </FormField>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField
                  label="Phone"
                  required
                  error={touched.patientPhone ? errors.patientPhone : undefined}
                >
                  <input
                    type="tel"
                    value={form.patientPhone}
                    onChange={(e) => update('patientPhone', e.target.value)}
                    onBlur={() => markTouched('patientPhone')}
                    aria-invalid={touched.patientPhone && !!errors.patientPhone ? true : undefined}
                    aria-describedby={errors.patientPhone ? 'err-patientPhone' : undefined}
                    className={`mt-1 w-full rounded-xl border bg-background px-3 py-2 text-[14px] outline-none transition-colors focus:border-brand ${
                      touched.patientPhone && errors.patientPhone ? 'border-danger' : 'border-border'
                    }`}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </FormField>
                <FormField
                  label="Email"
                  error={touched.patientEmail ? errors.patientEmail : undefined}
                >
                  <input
                    type="email"
                    value={form.patientEmail}
                    onChange={(e) => update('patientEmail', e.target.value)}
                    onBlur={() => markTouched('patientEmail')}
                    aria-invalid={touched.patientEmail && !!errors.patientEmail ? true : undefined}
                    aria-describedby={errors.patientEmail ? 'err-patientEmail' : undefined}
                    className={`mt-1 w-full rounded-xl border bg-background px-3 py-2 text-[14px] outline-none transition-colors focus:border-brand ${
                      touched.patientEmail && errors.patientEmail ? 'border-danger' : 'border-border'
                    }`}
                    placeholder="optional"
                    autoComplete="email"
                    inputMode="email"
                  />
                </FormField>
              </div>

              {/* Date */}
              <FormField
                label="Preferred date & time"
                required
                error={touched.preferredDate ? errors.preferredDate : undefined}
              >
                <input
                  type="datetime-local"
                  value={form.preferredDate}
                  min={minDateTime}
                  onChange={(e) => update('preferredDate', e.target.value)}
                  onBlur={() => markTouched('preferredDate')}
                  aria-invalid={touched.preferredDate && !!errors.preferredDate ? true : undefined}
                  aria-describedby={errors.preferredDate ? 'err-preferredDate' : undefined}
                  className={`mt-1 w-full rounded-xl border bg-background px-3 py-2 text-[14px] outline-none transition-colors focus:border-brand ${
                    touched.preferredDate && errors.preferredDate ? 'border-danger' : 'border-border'
                  }`}
                />
              </FormField>

              {/* Notes */}
              <FormField label="Notes">
                <textarea
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[14px] outline-none transition-colors focus:border-brand"
                  placeholder="Briefly describe your concern"
                />
              </FormField>
            </div>

            <button
              onClick={handle}
              disabled={submitting}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-[14px] font-semibold text-white shadow-card transition-all hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Confirming…
                </>
              ) : (
                <>
                  Confirm appointment
                  <Sparkles className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Confirmation via WhatsApp · SMS · Email · Press <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10px]">Esc</kbd> to close
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Reusable form field wrapper with label, required marker, and error message.
function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  const errId = `err-${label.replace(/\s+/g, '')}`;
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={errId}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden text-[11.5px] font-medium leading-relaxed text-danger"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
