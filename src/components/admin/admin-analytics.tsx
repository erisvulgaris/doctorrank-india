'use client';

import { Users, TrendingUp, Globe, Smartphone, Monitor, Tablet } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { SectionHeader, ChartCard } from './ui/chart-card';
import { KpiCard } from './ui/kpi-card';

const TRAFFIC = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i+1}`,
  users: Math.round(80000 + i * 1500 + Math.random() * 20000),
  sessions: Math.round(120000 + i * 2200 + Math.random() * 30000),
  pageviews: Math.round(380000 + i * 6500 + Math.random() * 80000),
}));

const DEVICES = [
  { name: 'Mobile', value: 68, color: '#0B5FFF' },
  { name: 'Desktop', value: 24, color: '#00B884' },
  { name: 'Tablet', value: 8, color: '#06B6D4' },
];

const FUNNEL = [
  { stage: 'Visitors', count: 1800000, pct: 100 },
  { stage: 'Search', count: 1240000, pct: 69 },
  { stage: 'Doctor Profile View', count: 480000, pct: 27 },
  { stage: 'Booking Initiated', count: 86000, pct: 4.8 },
  { stage: 'Appointment Confirmed', count: 48240, pct: 2.7 },
];

const RETENTION = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i+1}`,
  retention: Math.round(100 - i * 6.5 - Math.random() * 2),
}));

export function AdminAnalytics() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Analytics" subtitle="Traffic, behavior, funnels, retention" />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="Monthly Visitors" value={1.8} delta={22.1} icon={Users} color="brand" format="compact" sparkline={[1.2,1.3,1.4,1.5,1.6,1.7,1.75,1.8]} />
        <KpiCard label="Sessions" value={2.4} delta={18.4} icon={TrendingUp} color="emerald" format="compact" sparkline={[1.6,1.8,2.0,2.1,2.2,2.3,2.35,2.4]} />
        <KpiCard label="Page Views" value={6.8} delta={12.4} icon={Globe} color="cyan" format="compact" sparkline={[4.2,4.8,5.2,5.6,6.0,6.4,6.6,6.8]} />
        <KpiCard label="Bounce Rate" value="38.2" delta={-3.4} icon={TrendingUp} color="amber" format="percent" />
      </div>

      <ChartCard
        title="Traffic Trends"
        subtitle="Users, sessions, pageviews · last 30 days"
        icon={TrendingUp}
        action={
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand" /> Users</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald" /> Sessions</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-600" /> Views</span>
          </div>
        }
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TRAFFIC} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="g-users" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0B5FFF" stopOpacity={0.4} /><stop offset="100%" stopColor="#0B5FFF" stopOpacity={0} /></linearGradient>
                <linearGradient id="g-sessions" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00B884" stopOpacity={0.4} /><stop offset="100%" stopColor="#00B884" stopOpacity={0} /></linearGradient>
                <linearGradient id="g-views" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06B6D4" stopOpacity={0.4} /><stop offset="100%" stopColor="#06B6D4" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px' }} />
              <Area type="monotone" dataKey="pageviews" stroke="#06B6D4" strokeWidth={1.5} fill="url(#g-views)" />
              <Area type="monotone" dataKey="sessions" stroke="#00B884" strokeWidth={1.5} fill="url(#g-sessions)" />
              <Area type="monotone" dataKey="users" stroke="#0B5FFF" strokeWidth={2} fill="url(#g-users)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        {/* Funnel */}
        <ChartCard title="Conversion Funnel" subtitle="Visitor → Appointment · 30 days" icon={TrendingUp}>
          <div className="space-y-2">
            {FUNNEL.map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-foreground">{f.stage}</span>
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{f.count.toLocaleString('en-IN')}</span> · {f.pct}%
                  </span>
                </div>
                <div className="h-7 overflow-hidden rounded-lg bg-muted">
                  <div
                    className="flex h-full items-center justify-end rounded-lg px-2 text-[10px] font-semibold text-white"
                    style={{
                      width: `${f.pct}%`,
                      background: `linear-gradient(90deg, ${['#0B5FFF','#3B82F6','#06B6D4','#F59E0B','#00B884'][i]}, ${['#0B5FFF','#3B82F6','#06B6D4','#F59E0B','#00B884'][i]}CC)`,
                    }}
                  >
                    {f.pct}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Devices */}
        <ChartCard title="Device Breakdown" subtitle="By sessions" icon={Smartphone}>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DEVICES} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {DEVICES.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px' }} formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {DEVICES.map((d, i) => {
              const Icon = d.name === 'Mobile' ? Smartphone : d.name === 'Desktop' ? Monitor : Tablet;
              return (
                <div key={i} className="rounded-lg bg-muted/40 p-2 text-center">
                  <Icon className="mx-auto h-4 w-4" style={{ color: d.color }} />
                  <div className="mt-1 text-[14px] font-bold text-foreground">{d.value}%</div>
                  <div className="text-[10px] text-muted-foreground">{d.name}</div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Retention */}
      <ChartCard title="User Retention" subtitle="Weekly cohort · 12 weeks" icon={Users}>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={RETENTION} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px' }} formatter={(v: any) => `${v}%`} />
              <Line type="monotone" dataKey="retention" stroke="#0B5FFF" strokeWidth={2.5} dot={{ r: 3, fill: '#0B5FFF' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
