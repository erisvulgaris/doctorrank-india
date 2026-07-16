'use client';

import { motion } from 'framer-motion';
import {
  Stethoscope, Building2, MapPin, CalendarClock, Users, Activity,
  Wallet, TrendingUp, Brain, Star, ShieldCheck, Globe, ArrowRight,
  CheckCircle2, Clock, AlertCircle, Zap, Search, HeartPulse, Sparkles,
  Lock, Settings,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar,
} from 'recharts';
import { KpiCard } from './ui/kpi-card';
import { ChartCard, SectionHeader } from './ui/chart-card';

interface AdminDashboardProps {
  bootstrap: any;
  onNavigate: (section: string) => void;
}

// Mock time-series data
const TRAFFIC_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  visitors: Math.round(8000 + Math.random() * 6000 + i * 200),
  appointments: Math.round(200 + Math.random() * 100 + i * 5),
  aiSearches: Math.round(400 + Math.random() * 300 + i * 12),
}));

const REVENUE_DATA = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  mrr: Math.round(800000 + i * 60000 + Math.random() * 80000),
  arr: Math.round(9600000 + i * 720000 + Math.random() * 200000),
}));

const CITY_DATA = [
  { name: 'Mumbai', value: 32, color: '#0B5FFF' },
  { name: 'Delhi', value: 28, color: '#00B884' },
  { name: 'Bengaluru', value: 24, color: '#06B6D4' },
  { name: 'Chennai', value: 18, color: '#F59E0B' },
  { name: 'Hyderabad', value: 14, color: '#EF4444' },
  { name: 'Others', value: 22, color: '#94A3B8' },
];

const SPECIALTY_DATA = [
  { name: 'Dermatology', value: 8800 },
  { name: 'Cardiology', value: 7200 },
  { name: 'Orthopedics', value: 6400 },
  { name: 'Gynecology', value: 5800 },
  { name: 'Pediatrics', value: 5200 },
  { name: 'ENT', value: 4600 },
  { name: 'Neurology', value: 4200 },
  { name: 'Psychiatry', value: 3800 },
];

const TRAFFIC_SOURCES = [
  { name: 'Organic Search', value: 48, color: '#0B5FFF' },
  { name: 'AI Search', value: 22, color: '#00B884' },
  { name: 'Direct', value: 14, color: '#06B6D4' },
  { name: 'Social', value: 9, color: '#F59E0B' },
  { name: 'Referral', value: 7, color: '#EF4444' },
];

const SYSTEM_HEALTH = [
  { name: 'API', value: 99.98, fill: '#00B884' },
  { name: 'Search', value: 99.92, fill: '#0B5FFF' },
  { name: 'DB', value: 100, fill: '#00B884' },
  { name: 'Maps', value: 99.85, fill: '#06B6D4' },
];

const RECENT_ACTIVITY = [
  { type: 'doctor', icon: Stethoscope, color: 'text-brand bg-brand-soft', title: 'New doctor verified: Dr. Anjali Verma (Neurology, Delhi)', time: '2 min ago' },
  { type: 'review', icon: Star, color: 'text-amber-600 bg-amber-50', title: '3 new reviews pending moderation', time: '8 min ago' },
  { type: 'appointment', icon: CalendarClock, color: 'text-emerald bg-emerald-soft', title: '48 appointments booked in the last hour', time: '15 min ago' },
  { type: 'seo', icon: Search, color: 'text-violet-600 bg-violet-50', title: '12,400 new SEO pages indexed', time: '32 min ago' },
  { type: 'ai', icon: Brain, color: 'text-brand bg-brand-soft', title: 'AI Symptom Navigator: 1,240 queries today', time: '1 hr ago' },
  { type: 'alert', icon: AlertCircle, color: 'text-danger bg-danger-soft', title: '2 duplicate doctor profiles detected', time: '2 hrs ago' },
  { type: 'hospital', icon: Building2, color: 'text-cyan-600 bg-cyan-50', title: 'Fortis Hospital updated insurance partners', time: '3 hrs ago' },
];

export function AdminDashboard({ bootstrap, onNavigate }: AdminDashboardProps) {
  const stats = bootstrap.stats;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-r from-brand-soft via-card to-emerald-soft p-4 sm:p-6"
      >
        <div className="absolute inset-0 medical-pattern opacity-40" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand shadow-card sm:text-[11px]">
              <Sparkles className="h-3 w-3" />
              Live · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Welcome back, Admin
            </h2>
            <p className="mt-1 text-[12.5px] text-muted-foreground sm:text-[13.5px]">
              {stats.appointments || 248} appointments today · 1,240 AI searches · 99.98% uptime
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('doctors')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-[12.5px] font-semibold text-white shadow-card hover:bg-brand/90 sm:text-[13px]"
            >
              <Stethoscope className="h-3.5 w-3.5" /> Manage Doctors
            </button>
            <button
              onClick={() => onNavigate('ai')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-[12.5px] font-semibold text-foreground shadow-card hover:border-brand/40 sm:text-[13px]"
            >
              <Brain className="h-3.5 w-3.5" /> AI Center
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="Total Doctors" value={stats.doctors} delta={8.2} icon={Stethoscope} color="brand" sparkline={[8,12,10,15,18,22,20,25]} format="int" />
        <KpiCard label="Verified Doctors" value={Math.round(stats.doctors * 0.78)} delta={12.4} icon={ShieldCheck} color="emerald" sparkline={[6,9,11,13,16,18,21,24]} format="int" />
        <KpiCard label="Hospitals" value={stats.hospitals} delta={4.1} icon={Building2} color="cyan" sparkline={[2,3,4,5,6,7,8,10]} format="int" />
        <KpiCard label="Cities" value={stats.cities} delta={12.5} icon={MapPin} color="amber" sparkline={[2,3,3,4,5,6,7,8]} format="int" />
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="Appointments Today" value={248} delta={15.3} icon={CalendarClock} color="emerald" sparkline={[80,120,150,180,210,225,240,248]} format="int" />
        <KpiCard label="Monthly Appointments" value={4824} delta={9.8} icon={Activity} color="brand" sparkline={[2800,3200,3600,4000,4400,4600,4750,4824]} format="int" />
        <KpiCard label="Active Users" value={124000} delta={6.4} icon={Users} color="cyan" sparkline={[80,90,100,105,110,115,120,124]} format="compact" />
        <KpiCard label="Monthly Visitors" value={1.8} delta={22.1} icon={Globe} color="amber" format="compact" sparkline={[1.2,1.3,1.4,1.5,1.6,1.7,1.75,1.8]} />
      </div>

      {/* KPI Row 3 */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="MRR" value={2840000} delta={18.2} icon={Wallet} color="emerald" format="currency" sparkline={[1.8,2.0,2.2,2.4,2.5,2.6,2.7,2.84]} />
        <KpiCard label="ARR" value={34080000} delta={18.2} icon={TrendingUp} color="brand" format="currency" sparkline={[2.2,2.4,2.6,2.8,3.0,3.1,3.3,3.4]} />
        <KpiCard label="AI Searches" value={12400} delta={32.5} icon={Brain} color="cyan" sparkline={[4000,5200,6500,7800,9100,10300,11500,12400]} format="int" />
        <KpiCard label="Renewal Rate" value="94.2%" delta={2.1} icon={CheckCircle2} color="amber" sparkline={[88,89,90,91,92,93,94,94]} />
      </div>

      {/* Charts row 1: Traffic + Revenue */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <ChartCard
          title="Traffic & Appointments"
          subtitle="Last 30 days"
          icon={Activity}
          action={
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand" /> Visitors</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald" /> Appts</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber" /> AI</span>
            </div>
          }
        >
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRAFFIC_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-visitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0B5FFF" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#0B5FFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-appts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00B884" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#00B884" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-ai" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px', boxShadow: '0 8px 24px -8px rgba(10,20,40,0.08)' }}
                />
                <Area type="monotone" dataKey="visitors" stroke="#0B5FFF" strokeWidth={2} fill="url(#g-visitors)" />
                <Area type="monotone" dataKey="appointments" stroke="#00B884" strokeWidth={2} fill="url(#g-appts)" />
                <Area type="monotone" dataKey="aiSearches" stroke="#F59E0B" strokeWidth={2} fill="url(#g-ai)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Revenue Growth"
          subtitle="MRR vs ARR · last 12 months"
          icon={Wallet}
          action={
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand" /> MRR</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald" /> ARR</span>
            </div>
          }
        >
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000000).toFixed(0)}M`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px' }}
                  formatter={(v: any) => `₹${new Intl.NumberFormat('en-IN').format(v)}`}
                />
                <Line type="monotone" dataKey="mrr" stroke="#0B5FFF" strokeWidth={2.5} dot={{ r: 3, fill: '#0B5FFF' }} />
                <Line type="monotone" dataKey="arr" stroke="#00B884" strokeWidth={2.5} dot={{ r: 3, fill: '#00B884' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Charts row 2: Top cities + Traffic sources + System health */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
        <ChartCard title="Top Performing Cities" subtitle="By appointment volume" icon={MapPin}>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CITY_DATA} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
                  {CITY_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Traffic Sources" subtitle="Where visitors come from" icon={Globe}>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={TRAFFIC_SOURCES} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {TRAFFIC_SOURCES.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px' }} formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {TRAFFIC_SOURCES.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px]">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="ml-auto font-semibold text-foreground">{s.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="System Health" subtitle="Live service uptime" icon={HeartPulse}>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" data={SYSTEM_HEALTH} startAngle={90} endAngle={-270}>
                <RadialBar background dataKey="value" cornerRadius={10} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px' }} formatter={(v: any) => `${v}%`} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {SYSTEM_HEALTH.map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-muted/40 px-2 py-1 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.fill }} />
                  <span className="text-muted-foreground">{s.name}</span>
                </span>
                <span className="font-semibold text-foreground">{s.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Top specialties bar chart */}
      <ChartCard title="Top Specialties by Search Volume" subtitle="This month" icon={Activity}>
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SPECIALTY_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32}>
                {SPECIALTY_DATA.map((_, i) => (
                  <Cell key={i} fill={['#0B5FFF','#00B884','#06B6D4','#F59E0B','#EF4444','#8B5CF6','#EC4899','#14B8A6'][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Recent activity + Top diseases */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <ChartCard title="Recent Activity" subtitle="Real-time platform events" icon={Clock}>
          <div className="space-y-2 max-h-80 overflow-y-auto scroll-thin pr-1">
            {RECENT_ACTIVITY.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-2.5 rounded-xl border border-border bg-background p-2.5"
              >
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${a.color}`}>
                  <a.icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-medium text-foreground">{a.title}</div>
                  <div className="text-[10.5px] text-muted-foreground">{a.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Top Searched Conditions" subtitle="By volume this month" icon={Search}>
          <div className="space-y-2">
            {[
              { name: 'Hair Fall', count: 14820, pct: 100, color: 'bg-brand' },
              { name: 'Diabetes', count: 12400, pct: 84, color: 'bg-emerald' },
              { name: 'PCOS', count: 9800, pct: 66, color: 'bg-cyan-600' },
              { name: 'Migraine', count: 8400, pct: 57, color: 'bg-amber-500' },
              { name: 'Back Pain', count: 7600, pct: 51, color: 'bg-violet-500' },
              { name: 'Acne', count: 6800, pct: 46, color: 'bg-pink-500' },
              { name: 'Thyroid', count: 5400, pct: 36, color: 'bg-red-500' },
            ].map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-foreground">{c.name}</span>
                  <span className="tabular-nums text-muted-foreground">{c.count.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.pct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className={`h-full rounded-full ${c.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Quick links grid */}
      <div>
        <SectionHeader title="Quick Actions" subtitle="Jump to common administrative tasks" />
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {[
            { icon: Stethoscope, label: 'Add Doctor', desc: 'Create a new doctor profile', section: 'doctors', color: 'text-brand bg-brand-soft' },
            { icon: ShieldCheck, label: 'Verify', desc: 'Review pending verifications', section: 'verification', color: 'text-emerald bg-emerald-soft' },
            { icon: Brain, label: 'AI Center', desc: 'AI search & prompt library', section: 'ai', color: 'text-violet-600 bg-violet-50' },
            { icon: Search, label: 'SEO Control', desc: 'Manage indexed pages', section: 'seo', color: 'text-cyan-600 bg-cyan-50' },
            { icon: Wallet, label: 'Revenue', desc: 'MRR, ARR, invoices', section: 'revenue', color: 'text-amber-600 bg-amber-50' },
            { icon: Users, label: 'Users', desc: 'Manage team & roles', section: 'users', color: 'text-pink-600 bg-pink-50' },
            { icon: Lock, label: 'Security', desc: 'Audit logs & sessions', section: 'security', color: 'text-danger bg-danger-soft' },
            { icon: Settings, label: 'Settings', desc: 'Platform configuration', section: 'settings', color: 'text-muted-foreground bg-muted' },
          ].map((q, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -2 }}
              onClick={() => onNavigate(q.section)}
              className="group rounded-2xl border border-border bg-card p-3 text-left shadow-card transition-all hover:border-brand/30 hover:shadow-hover sm:p-4"
            >
              <div className={`grid h-9 w-9 place-items-center rounded-xl ${q.color}`}>
                <q.icon className="h-4 w-4" />
              </div>
              <div className="mt-2.5 text-[13px] font-semibold text-foreground">{q.label}</div>
              <div className="text-[11px] text-muted-foreground">{q.desc}</div>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight className="h-3 w-3" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
