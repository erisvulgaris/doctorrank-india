'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CalendarClock, Star, User, LogOut, ExternalLink,
  Loader2, AlertCircle, CheckCircle2, XCircle, Clock, Phone, Mail,
  TrendingUp, Activity, Wallet, MessageCircle, Shield, Edit3, Save, X,
  Sparkles, ChevronRight, Stethoscope, MapPin,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { RankGauge } from './ecg-line';
import { DoctorImage } from './doctor-image';
import { formatINR, relativeTime } from '@/lib/doctorrank';

interface DoctorDashboardViewProps {
  doctor: any | null;
  onNavigate: (view: string, payload?: any) => void;
  onLogout: () => void;
}

type Tab = 'overview' | 'appointments' | 'reviews' | 'profile';

const TABS: Array<{ id: Tab; label: string; icon: any }> = [
  { id: 'overview',    label: 'Overview',    icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', icon: CalendarClock },
  { id: 'reviews',     label: 'Reviews',     icon: Star },
  { id: 'profile',     label: 'Profile',     icon: User },
];

const APPT_STATUS_CFG: Record<string, { color: string; bg: string; icon: any; label: string }> = {
  pending:   { color: 'text-amber-700',  bg: 'bg-amber-50',   icon: Clock,        label: 'Pending' },
  confirmed: { color: 'text-emerald',    bg: 'bg-emerald-soft', icon: CheckCircle2, label: 'Confirmed' },
  cancelled: { color: 'text-danger',     bg: 'bg-danger-soft', icon: XCircle,      label: 'Cancelled' },
  completed: { color: 'text-brand',      bg: 'bg-brand-soft',  icon: CheckCircle2, label: 'Completed' },
  'no-show': { color: 'text-muted-foreground', bg: 'bg-muted', icon: XCircle,      label: 'No-show' },
};

export function DoctorDashboardView({ doctor, onNavigate, onLogout }: DoctorDashboardViewProps) {
  const [tab, setTab] = useState<Tab>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/doctor/dashboard');
      if (res.status === 401) {
        setError('Your session has expired. Please sign in again.');
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Failed to load dashboard.');
        return;
      }
      setData(json);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!doctor) {
      setLoading(false);
      return;
    }
    fetchDashboard();
  }, [doctor, fetchDashboard]);

  // ---- Not logged in ----
  if (!doctor) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center sm:py-24">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
          <Shield className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Sign in required</h1>
        <p className="mt-2 text-[13px] text-muted-foreground">
          You need to be signed in as a doctor to access the dashboard.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={() => onNavigate('login')}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-card hover:bg-brand/90"
          >
            Sign in
          </button>
          <button
            onClick={() => onNavigate('signup')}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-5 py-2.5 text-[13px] font-semibold text-foreground shadow-card hover:border-brand/40"
          >
            Create account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 pb-20 lg:pb-8">
      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-premium sm:p-6"
      >
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-emerald/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <DoctorImage
              src={doctor.photoUrl}
              alt={doctor.name}
              width={72}
              height={72}
              loading="eager"
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white sm:h-18 sm:w-18"
              fallbackInitial={doctor.name?.[0]}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{doctor.name}</h1>
                {doctor.isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-soft px-2 py-0.5 text-[10px] font-semibold text-emerald">
                    <Shield className="h-2.5 w-2.5" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                    <Clock className="h-2.5 w-2.5" /> Pending verification
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                {doctor.specialty?.name} · {doctor.city?.name}
              </div>
              <div className="mt-1 flex items-center gap-3 text-[11.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {doctor.email}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">DoctorRank</div>
              <div className="text-2xl font-bold text-brand">{Math.round(doctor.doctorRank)}</div>
            </div>
            <RankGauge rank={doctor.doctorRank} size={56} />
          </div>
        </div>

        {/* Quick actions */}
        <div className="relative mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('doctor', { slug: doctor.slug })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-[12px] font-semibold text-foreground hover:border-brand/40"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View public profile
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-[12px] font-semibold text-danger hover:bg-danger-soft"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mt-4 flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-1 shadow-card no-scrollbar sm:gap-0.5">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-1 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-semibold transition-colors sm:text-[13px] ${
                active ? 'bg-brand text-white shadow-card' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">{t.label}</span>
              <span className="xs:hidden">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-12 shadow-card">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
            <span className="ml-3 text-[13px] text-muted-foreground">Loading dashboard…</span>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-danger/30 bg-danger-soft p-4 text-center">
            <AlertCircle className="mx-auto mb-2 h-6 w-6 text-danger" />
            <p className="text-[13px] font-medium text-danger">{error}</p>
            <button
              onClick={fetchDashboard}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-danger px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-danger/90"
            >
              Try again
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {tab === 'overview' && <OverviewTab data={data} doctor={doctor} />}
              {tab === 'appointments' && <AppointmentsTab doctor={doctor} />}
              {tab === 'reviews' && <ReviewsTab doctor={doctor} />}
              {tab === 'profile' && <ProfileTab doctor={doctor} />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Overview Tab
// ============================================================
function OverviewTab({ data, doctor }: { data: any; doctor: any }) {
  const stats = data?.stats || {};
  const timeseries = data?.timeseries || [];
  const recentReviews = data?.recentReviews || [];

  return (
    <div className="space-y-4">
      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile label="Today" value={stats.appointmentsToday || 0} icon={CalendarClock} color="text-brand bg-brand-soft" />
        <KpiTile label="This Month" value={stats.appointmentsThisMonth || 0} icon={Activity} color="text-emerald bg-emerald-soft" />
        <KpiTile label="Pending" value={stats.pending || 0} icon={Clock} color="text-amber-600 bg-amber-50" />
        <KpiTile label="Avg Rating" value={stats.avgRating || '—'} icon={Star} color="text-violet-600 bg-violet-50" />
      </div>

      {/* 30-day appointments chart */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Appointments · Last 30 days</h3>
            <p className="text-[11.5px] text-muted-foreground">Daily booking volume</p>
          </div>
          <TrendingUp className="h-4 w-4 text-emerald" />
        </div>
        <div className="mt-3 h-48 sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeseries} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="g-appts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B5FFF" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0B5FFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px' }} />
              <Area type="monotone" dataKey="count" stroke="#0B5FFF" strokeWidth={2} fill="url(#g-appts)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status breakdown + recent reviews */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
          <h3 className="text-[14px] font-semibold text-foreground">Appointment status</h3>
          <div className="mt-3 space-y-2">
            {[
              { label: 'Pending', value: stats.pending || 0, color: 'bg-amber-500' },
              { label: 'Confirmed', value: stats.confirmed || 0, color: 'bg-emerald' },
              { label: 'Completed', value: stats.completed || 0, color: 'bg-brand' },
              { label: 'Cancelled', value: stats.cancelled || 0, color: 'bg-danger' },
            ].map((s, i) => {
              const total = (stats.pending || 0) + (stats.confirmed || 0) + (stats.completed || 0) + (stats.cancelled || 0);
              const pct = total > 0 ? (s.value / total) * 100 : 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-semibold text-foreground">{s.value}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className={`h-full rounded-full ${s.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
          <h3 className="text-[14px] font-semibold text-foreground">Recent reviews</h3>
          <div className="mt-3 space-y-2">
            {recentReviews.length === 0 ? (
              <p className="text-[12px] text-muted-foreground">No reviews yet.</p>
            ) : (
              recentReviews.slice(0, 3).map((r: any) => (
                <div key={r.id} className="rounded-xl bg-muted/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-foreground">{r.patientName}</span>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${s <= Math.round(r.rating) ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11.5px] text-muted-foreground">&ldquo;{r.comment}&rdquo;</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Profile completeness */}
      <div className="rounded-2xl border border-brand/20 bg-gradient-to-r from-brand-soft via-card to-emerald-soft p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Profile completeness</h3>
            <p className="text-[11.5px] text-muted-foreground">A complete profile ranks higher and converts better.</p>
          </div>
          <div className="text-2xl font-bold text-brand">{stats.profileCompleteness || 0}%</div>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.profileCompleteness || 0}%` }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full bg-gradient-to-r from-brand to-emerald"
          />
        </div>
      </div>
    </div>
  );
}

function KpiTile({ label, value, icon: Icon, color }: { label: string; value: any; icon: any; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-card sm:p-4">
      <div className={`grid h-8 w-8 place-items-center rounded-lg ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">{value}</div>
      <div className="text-[11px] text-muted-foreground sm:text-[12px]">{label}</div>
    </div>
  );
}

// ============================================================
// Appointments Tab
// ============================================================
function AppointmentsTab({ doctor }: { doctor: any }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.set('status', filter);
      const res = await fetch(`/api/doctor/appointments?${params.toString()}`);
      const json = await res.json();
      if (res.ok) setAppointments(json.appointments || []);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/doctor/appointments?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        // Update local state
        setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
      }
    } finally {
      setUpdating(null);
    }
  };

  const filters = ['', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <div className="space-y-4">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f || 'all'}
            onClick={() => setFilter(f)}
            className={`rounded-lg border px-2.5 py-1 text-[12px] font-medium capitalize transition-colors ${
              filter === f ? 'border-brand bg-brand-soft text-brand' : 'border-border bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {f || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-12">
          <Loader2 className="h-5 w-5 animate-spin text-brand" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
          <CalendarClock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <h3 className="text-[14px] font-semibold text-foreground">No appointments found</h3>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            {filter ? `No ${filter} appointments.` : 'When patients book appointments, they will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {appointments.map((a) => {
            const cfg = APPT_STATUS_CFG[a.status] || APPT_STATUS_CFG.pending;
            const apptDate = new Date(a.preferredDate);
            const isPast = apptDate.getTime() < Date.now();
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-card p-3 shadow-card sm:p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                      <CalendarClock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-foreground">{a.patientName}</span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>
                          <cfg.icon className="h-2.5 w-2.5" /> {cfg.label}
                        </span>
                        {isPast && a.status === 'pending' && (
                          <span className="rounded-full bg-danger-soft px-2 py-0.5 text-[10px] font-semibold text-danger">Overdue</span>
                        )}
                      </div>
                      <div className="mt-0.5 text-[11.5px] text-muted-foreground">
                        {apptDate.toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11.5px] text-muted-foreground">
                        <a href={`tel:${a.patientPhone}`} className="inline-flex items-center gap-1 hover:text-foreground">
                          <Phone className="h-3 w-3" /> {a.patientPhone}
                        </a>
                        {a.patientEmail && (
                          <a href={`mailto:${a.patientEmail}`} className="inline-flex items-center gap-1 hover:text-foreground">
                            <Mail className="h-3 w-3" /> {a.patientEmail}
                          </a>
                        )}
                      </div>
                      {a.notes && (
                        <div className="mt-2 rounded-lg bg-muted/40 p-2 text-[11.5px] italic text-muted-foreground">
                          &ldquo;{a.notes}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Status actions */}
                  <div className="flex flex-wrap gap-1.5">
                    {a.status !== 'confirmed' && a.status !== 'completed' && (
                      <button
                        onClick={() => updateStatus(a.id, 'confirmed')}
                        disabled={updating === a.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald/90 disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3 w-3" /> Confirm
                      </button>
                    )}
                    {a.status === 'confirmed' && (
                      <button
                        onClick={() => updateStatus(a.id, 'completed')}
                        disabled={updating === a.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-brand px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-brand/90 disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3 w-3" /> Complete
                      </button>
                    )}
                    {a.status !== 'cancelled' && a.status !== 'completed' && (
                      <button
                        onClick={() => updateStatus(a.id, 'cancelled')}
                        disabled={updating === a.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-danger-soft px-2.5 py-1 text-[11px] font-semibold text-danger hover:bg-danger/15 disabled:opacity-50"
                      >
                        <XCircle className="h-3 w-3" /> Cancel
                      </button>
                    )}
                    <a
                      href={`https://wa.me/${a.patientPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald/30 bg-emerald-soft px-2.5 py-1 text-[11px] font-semibold text-emerald hover:bg-emerald/10"
                    >
                      <MessageCircle className="h-3 w-3" /> WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Reviews Tab
// ============================================================
function ReviewsTab({ doctor }: { doctor: any }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/doctor/reviews');
      const json = await res.json();
      if (res.ok) setReviews(json.reviews || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const submitReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/doctor/reviews?id=${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorReply: replyText.trim() }),
      });
      if (res.ok) {
        const json = await res.json();
        setReviews((prev) => prev.map((r) => r.id === reviewId ? json.review : r));
        setReplyingTo(null);
        setReplyText('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const cancelReply = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/doctor/reviews?id=${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorReply: '' }),
      });
      if (res.ok) {
        const json = await res.json();
        setReviews((prev) => prev.map((r) => r.id === reviewId ? json.review : r));
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-12">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <Star className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
        <h3 className="text-[14px] font-semibold text-foreground">No reviews yet</h3>
        <p className="mt-1 text-[12.5px] text-muted-foreground">
          When patients leave reviews, you can read and respond to them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {reviews.map((r) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-3 shadow-card sm:p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-[12px] font-semibold text-brand">
                {r.patientName[0]}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-foreground">{r.patientName}</div>
                <div className="text-[10.5px] text-muted-foreground">
                  {r.procedure} · {relativeTime(r.createdAt)}
                </div>
                <div className="mt-1 flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`h-3 w-3 ${s <= Math.round(r.rating) ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                  ))}
                </div>
              </div>
            </div>
            {r.isVerified && (
              <span className="rounded-full bg-emerald-soft px-2 py-0.5 text-[9px] font-semibold text-emerald">Verified</span>
            )}
          </div>

          <p className="mt-2 text-[12.5px] leading-relaxed text-foreground/90">&ldquo;{r.comment}&rdquo;</p>

          {/* Existing reply */}
          {r.doctorReply && (
            <div className="mt-2 rounded-lg bg-brand-soft/50 p-2.5">
              <div className="text-[10.5px] font-semibold uppercase tracking-wide text-brand">Your reply</div>
              <p className="mt-0.5 text-[12px] text-foreground/90">{r.doctorReply}</p>
              <button
                onClick={() => cancelReply(r.id)}
                className="mt-1 text-[10.5px] font-semibold text-muted-foreground hover:text-danger"
              >
                Remove reply
              </button>
            </div>
          )}

          {/* Reply form */}
          {replyingTo === r.id ? (
            <div className="mt-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                maxLength={1000}
                placeholder="Write a public reply to this review…"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-[12.5px] outline-none focus:border-brand"
                autoFocus
              />
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[10.5px] text-muted-foreground">{replyText.length}/1000</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => { setReplyingTo(null); setReplyText(''); }}
                    className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => submitReply(r.id)}
                    disabled={!replyText.trim() || submitting}
                    className="rounded-lg bg-brand px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-brand/90 disabled:opacity-50"
                  >
                    {submitting ? 'Posting…' : 'Post reply'}
                  </button>
                </div>
              </div>
            </div>
          ) : !r.doctorReply && (
            <button
              onClick={() => { setReplyingTo(r.id); setReplyText(''); }}
              className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand hover:underline"
            >
              <MessageCircle className="h-3 w-3" /> Reply
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================
// Profile Tab
// ============================================================
function ProfileTab({ doctor }: { doctor: any }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/doctor/profile');
      const json = await res.json();
      if (res.ok) setProfile(json.doctor);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const update = (field: string, value: any) => {
    setProfile((p: any) => ({ ...p, [field]: value }));
  };

  const updateArrayField = (field: string, value: string) => {
    const items = value.split(',').map((s) => s.trim()).filter(Boolean);
    setProfile((p: any) => ({ ...p, [field]: items }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/doctor/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Failed to save.');
        return;
      }
      setProfile(json.doctor);
      setSavedAt(Date.now());
    } catch {
      setError('Network error.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-12">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
      </div>
    );
  }

  if (!profile) {
    return <div className="rounded-2xl border border-border bg-card p-8 text-center">Failed to load profile.</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-lg bg-danger-soft px-3 py-2 text-[12px] text-danger">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
      {savedAt && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-soft px-3 py-2 text-[12px] text-emerald">
          <CheckCircle2 className="h-4 w-4" /> Profile saved. DoctorRank recalculated.
        </div>
      )}

      {/* Photo + fee */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
        <h3 className="text-[14px] font-semibold text-foreground">Photo & consultation fee</h3>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <DoctorImage
            src={profile.photoUrl}
            alt={profile.name}
            width={64}
            height={64}
            className="h-16 w-16 rounded-2xl object-cover"
            fallbackInitial={profile.name?.[0]}
          />
          <div className="flex-1">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Photo URL</label>
            <input
              type="url"
              value={profile.photoUrl || ''}
              onChange={(e) => update('photoUrl', e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-brand"
              placeholder="https://…"
            />
          </div>
          <div className="w-32">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Fee (₹)</label>
            <input
              type="number"
              min={0}
              max={100000}
              value={profile.consultationFee || 0}
              onChange={(e) => update('consultationFee', Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-brand"
            />
          </div>
        </div>
      </div>

      {/* About */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
        <h3 className="text-[14px] font-semibold text-foreground">About & qualifications</h3>
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">About</label>
            <textarea
              value={profile.about || ''}
              onChange={(e) => update('about', e.target.value)}
              rows={4}
              maxLength={4000}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-brand"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Qualifications</label>
              <input
                type="text"
                value={profile.qualifications || ''}
                onChange={(e) => update('qualifications', e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Experience (years)</label>
              <input
                type="number"
                min={0}
                max={80}
                value={profile.experienceYears || 0}
                onChange={(e) => update('experienceYears', Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-brand"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
        <h3 className="text-[14px] font-semibold text-foreground">Contact & location</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Phone</label>
            <input
              type="tel"
              value={profile.phone || ''}
              onChange={(e) => update('phone', e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">WhatsApp</label>
            <input
              type="tel"
              value={profile.whatsapp || ''}
              onChange={(e) => update('whatsapp', e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-brand"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Clinic address</label>
            <textarea
              value={profile.address || ''}
              onChange={(e) => update('address', e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-brand"
            />
          </div>
        </div>
      </div>

      {/* Clinical scope */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
        <h3 className="text-[14px] font-semibold text-foreground">Clinical scope</h3>
        <p className="text-[11.5px] text-muted-foreground">Separate items with commas.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Languages</label>
            <input
              type="text"
              value={(profile.languages || []).join(', ')}
              onChange={(e) => updateArrayField('languages', e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-brand"
              placeholder="English, Hindi, Tamil"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Conditions treated</label>
            <input
              type="text"
              value={(profile.conditionsTreated || []).join(', ')}
              onChange={(e) => updateArrayField('conditionsTreated', e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-brand"
              placeholder="Hair Fall, Acne"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Procedures</label>
            <input
              type="text"
              value={(profile.procedures || []).join(', ')}
              onChange={(e) => updateArrayField('procedures', e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-brand"
              placeholder="Consultation, PRP"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Accepted insurance</label>
            <input
              type="text"
              value={(profile.acceptedInsurance || []).join(', ')}
              onChange={(e) => updateArrayField('acceptedInsurance', e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] outline-none focus:border-brand"
              placeholder="Star Health, HDFC Ergo"
            />
          </div>
        </div>
      </div>

      {/* Save bar */}
      <div className="sticky bottom-16 lg:bottom-4 flex items-center justify-between rounded-2xl border border-border bg-card/95 p-3 shadow-premium backdrop-blur">
        <span className="text-[11.5px] text-muted-foreground">
          {saving ? 'Saving…' : savedAt ? 'All changes saved.' : 'Changes are not yet saved.'}
        </span>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-[13px] font-semibold text-white shadow-card hover:bg-brand/90 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
      </div>
    </div>
  );
}
