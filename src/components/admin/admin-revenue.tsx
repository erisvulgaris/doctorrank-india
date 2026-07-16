'use client';

import {
  Wallet, TrendingUp, Users, RefreshCw, CreditCard, Download,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { SectionHeader, ChartCard } from './ui/chart-card';
import { KpiCard } from './ui/kpi-card';

const MRR_DATA = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  mrr: Math.round(1800000 + i * 95000 + Math.random() * 60000),
  churn: Math.round(2 + Math.random() * 1.5),
}));

const REVENUE_STREAMS = [
  { name: 'Doctor Premium', value: 1450000, color: '#0B5FFF' },
  { name: 'Hospital Enterprise', value: 980000, color: '#00B884' },
  { name: 'Featured Listings', value: 240000, color: '#06B6D4' },
  { name: 'Advertisements', value: 120000, color: '#F59E0B' },
  { name: 'Appointment Commission', value: 50000, color: '#EF4444' },
];

const INVOICES = [
  { id: 'INV-2026-0148', customer: 'Apollo Hospital', plan: 'Enterprise', amount: 280000, status: 'paid', date: '2 hours ago' },
  { id: 'INV-2026-0147', customer: 'Dr. Vikram Desai', plan: 'Premium', amount: 4999, status: 'paid', date: '5 hours ago' },
  { id: 'INV-2026-0146', customer: 'Fortis Hospital', plan: 'Enterprise', amount: 280000, status: 'pending', date: '1 day ago' },
  { id: 'INV-2026-0145', customer: 'Dr. Anjali Verma', plan: 'Premium', amount: 4999, status: 'failed', date: '2 days ago' },
  { id: 'INV-2026-0144', customer: 'Manipal Hospital', plan: 'Enterprise', amount: 280000, status: 'paid', date: '3 days ago' },
  { id: 'INV-2026-0143', customer: 'Dr. Sanjay Gupta', plan: 'Premium', amount: 4999, status: 'paid', date: '4 days ago' },
];

const STATUS_CFG: Record<string, { color: string; bg: string; label: string }> = {
  paid:    { color: 'text-emerald', bg: 'bg-emerald-soft', label: 'Paid' },
  pending: { color: 'text-amber-700', bg: 'bg-amber-50', label: 'Pending' },
  failed:  { color: 'text-danger', bg: 'bg-danger-soft', label: 'Failed' },
};

export function AdminRevenue() {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Revenue Dashboard"
        subtitle="Subscriptions, invoices, MRR/ARR, churn analysis"
        action={
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-[12.5px] font-semibold text-foreground shadow-card hover:border-brand/40">
            <Download className="h-3.5 w-3.5" /> GST Report
          </button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="MRR" value={2840000} delta={18.2} icon={Wallet} color="emerald" format="currency" sparkline={[1.8,2.0,2.2,2.4,2.5,2.6,2.7,2.84]} />
        <KpiCard label="ARR" value={34080000} delta={18.2} icon={TrendingUp} color="brand" format="currency" sparkline={[2.2,2.4,2.6,2.8,3.0,3.1,3.3,3.4]} />
        <KpiCard label="Active Subscriptions" value={1248} delta={8.4} icon={Users} color="cyan" sparkline={[800,900,1000,1050,1100,1180,1220,1248]} />
        <KpiCard label="Churn Rate" value="2.4" delta={-0.6} icon={RefreshCw} color="amber" format="percent" />
      </div>

      {/* MRR chart */}
      <ChartCard
        title="MRR Growth & Churn"
        subtitle="Last 12 months"
        icon={TrendingUp}
        action={
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand" /> MRR</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-danger" /> Churn %</span>
          </div>
        }
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MRR_DATA} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="g-mrr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B5FFF" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0B5FFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000000).toFixed(1)}M`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px' }} />
              <Area yAxisId="left" type="monotone" dataKey="mrr" stroke="#0B5FFF" strokeWidth={2.5} fill="url(#g-mrr)" />
              <Line yAxisId="right" type="monotone" dataKey="churn" stroke="#EF4444" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        {/* Revenue streams */}
        <ChartCard title="Revenue Streams" subtitle="By source · this month" icon={Wallet}>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={REVENUE_STREAMS} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {REVENUE_STREAMS.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px' }} formatter={(v: any) => `₹${new Intl.NumberFormat('en-IN').format(v)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1">
            {REVENUE_STREAMS.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-[11.5px]">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="flex-1 text-muted-foreground">{s.name}</span>
                <span className="font-semibold text-foreground">₹{(s.value/1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Plan distribution */}
        <ChartCard title="Subscription Plans" subtitle="Active subscribers by plan" icon={CreditCard}>
          <div className="space-y-2">
            {[
              { plan: 'Free', users: 8240, pct: 64, color: 'bg-muted', price: '₹0' },
              { plan: 'Premium', users: 3840, pct: 30, color: 'bg-brand', price: '₹4,999/mo' },
              { plan: 'Enterprise', users: 780, pct: 6, color: 'bg-emerald', price: '₹2.8L/mo' },
            ].map((p, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-3">
                <div className="flex items-center justify-between text-[12.5px]">
                  <div>
                    <div className="font-semibold text-foreground">{p.plan}</div>
                    <div className="text-[10.5px] text-muted-foreground">{p.price}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{p.users.toLocaleString('en-IN')}</div>
                    <div className="text-[10.5px] text-muted-foreground">{p.pct}%</div>
                  </div>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Recent invoices */}
      <ChartCard title="Recent Invoices" subtitle="Latest billing activity" icon={CreditCard}>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Invoice</th>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Customer</th>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Plan</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Amount</th>
                <th className="px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv, i) => {
                const s = STATUS_CFG[inv.status];
                return (
                  <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-3 py-2.5 font-mono text-[11.5px] text-muted-foreground">{inv.id}</td>
                    <td className="px-3 py-2.5 font-medium text-foreground">{inv.customer}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{inv.plan}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-foreground">₹{inv.amount.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${s.bg} ${s.color}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-[11px] text-muted-foreground">{inv.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
