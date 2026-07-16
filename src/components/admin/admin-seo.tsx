'use client';

import { motion } from 'framer-motion';
import {
  Search, FileText, Globe, TrendingUp, AlertCircle, CheckCircle2,
  XCircle, Link as LinkIcon, Map, Zap, RefreshCw, Download,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { SectionHeader, ChartCard } from './ui/chart-card';
import { KpiCard } from './ui/kpi-card';

const INDEX_STATUS = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  indexed: Math.round(800000 + i * 4500 + Math.random() * 8000),
  submitted: Math.round(805000 + i * 4600 + Math.random() * 8000),
}));

const PAGE_TYPES = [
  { type: 'Doctor Pages', count: 428000, color: '#0B5FFF', health: 98 },
  { type: 'Disease Pages', count: 18400, color: '#00B884', health: 99 },
  { type: 'Specialty Pages', count: 840, color: '#06B6D4', health: 100 },
  { type: 'Hospital Pages', count: 12800, color: '#F59E0B', health: 96 },
  { type: 'City Pages', count: 1840, color: '#EF4444', health: 100 },
  { type: 'Procedure Pages', count: 6200, color: '#8B5CF6', health: 97 },
];

const KEYWORDS = [
  { kw: 'hair fall doctor mumbai', pos: 1, change: 2, vol: '14.8K' },
  { kw: 'best dermatologist delhi', pos: 2, change: 1, vol: '12.4K' },
  { kw: 'kidney stone specialist', pos: 1, change: 0, vol: '9.8K' },
  { kw: 'pcos treatment bangalore', pos: 3, change: -1, vol: '8.4K' },
  { kw: 'knee replacement surgeon', pos: 2, change: 3, vol: '7.6K' },
  { kw: 'psychiatrist for depression', pos: 4, change: 1, vol: '6.8K' },
];

export function AdminSeo() {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="SEO Control Center"
        subtitle="1.4M indexed pages · 99.4% health · 48% organic traffic"
        action={
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-[12.5px] font-semibold text-foreground shadow-card hover:border-brand/40">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-[12.5px] font-semibold text-white shadow-card hover:bg-brand/90">
              <RefreshCw className="h-3.5 w-3.5" /> Re-crawl
            </button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="Indexed Pages" value={1400000} delta={8.4} icon={FileText} color="brand" format="compact" sparkline={[1200,1240,1280,1320,1360,1380,1390,1400]} />
        <KpiCard label="Avg Position" value="2.4" delta={-0.6} icon={TrendingUp} color="emerald" sparkline={[3.2,3.0,2.8,2.7,2.6,2.5,2.4,2.4]} />
        <KpiCard label="Organic Traffic" value="48" delta={12.4} icon={Search} color="cyan" format="percent" sparkline={[32,34,36,38,42,44,46,48]} />
        <KpiCard label="Core Web Vitals" value="Good" icon={Zap} color="emerald" />
      </div>

      {/* Index status chart */}
      <ChartCard
        title="Index Status"
        subtitle="Pages indexed vs submitted · last 14 days"
        icon={Globe}
        action={
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand" /> Indexed</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald" /> Submitted</span>
          </div>
        }
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={INDEX_STATUS} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="g-idx" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B5FFF" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0B5FFF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g-sub" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00B884" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#00B884" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px' }} formatter={(v: any) => v.toLocaleString('en-IN')} />
              <Area type="monotone" dataKey="submitted" stroke="#00B884" strokeWidth={2} fill="url(#g-sub)" />
              <Area type="monotone" dataKey="indexed" stroke="#0B5FFF" strokeWidth={2} fill="url(#g-idx)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Page types & keyword rankings */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <ChartCard title="Page Types" subtitle="Distribution & health" icon={FileText}>
          <div className="space-y-2">
            {PAGE_TYPES.map((p, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: `${p.color}20`, color: p.color }}>
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="font-medium text-foreground">{p.type}</span>
                    <span className="tabular-nums text-muted-foreground">{p.count.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.health}%` }}
                        transition={{ duration: 0.5, delay: i * 0.04 }}
                        className="h-full rounded-full"
                        style={{ background: p.color }}
                      />
                    </div>
                    <span className="text-[10.5px] font-semibold text-foreground">{p.health}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Top Keyword Rankings" subtitle="Google India · last 7 days" icon={TrendingUp}>
          <div className="space-y-1.5">
            {KEYWORDS.map((k, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-background p-2.5">
                <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[11px] font-bold ${
                  k.pos <= 3 ? 'bg-emerald-soft text-emerald' : k.pos <= 10 ? 'bg-amber-50 text-amber-700' : 'bg-muted text-muted-foreground'
                }`}>
                  #{k.pos}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium text-foreground">{k.kw}</div>
                  <div className="text-[10.5px] text-muted-foreground">{k.vol} monthly searches</div>
                </div>
                <span className={`text-[11px] font-semibold ${k.change > 0 ? 'text-emerald' : k.change < 0 ? 'text-danger' : 'text-muted-foreground'}`}>
                  {k.change > 0 ? '↑' : k.change < 0 ? '↓' : '–'} {Math.abs(k.change)}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Sitemaps & issues */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <ChartCard title="Sitemaps" subtitle="XML, image, and video sitemaps" icon={Map}>
          <div className="space-y-2">
            {[
              { name: 'sitemap-doctors.xml', urls: 428000, status: 'ok', last: '2 hrs ago' },
              { name: 'sitemap-diseases.xml', urls: 18400, status: 'ok', last: '4 hrs ago' },
              { name: 'sitemap-hospitals.xml', urls: 12800, status: 'ok', last: '6 hrs ago' },
              { name: 'sitemap-images.xml', urls: 284000, status: 'warning', last: '1 day ago' },
              { name: 'sitemap-videos.xml', urls: 8400, status: 'ok', last: '8 hrs ago' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                {s.status === 'ok'
                  ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald" />
                  : <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium text-foreground">{s.name}</div>
                  <div className="text-[10.5px] text-muted-foreground">{s.urls.toLocaleString('en-IN')} URLs · updated {s.last}</div>
                </div>
                <button className="text-[11px] font-semibold text-brand hover:underline">View</button>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Crawl Issues" subtitle="Errors, warnings, and broken links" icon={AlertCircle}>
          <div className="space-y-2">
            {[
              { issue: '404 errors', count: 24, severity: 'high', color: 'text-danger bg-danger-soft' },
              { issue: 'Soft 404s', count: 8, severity: 'medium', color: 'text-amber-600 bg-amber-50' },
              { issue: 'Broken internal links', count: 12, severity: 'medium', color: 'text-amber-600 bg-amber-50' },
              { issue: 'Redirect loops', count: 2, severity: 'high', color: 'text-danger bg-danger-soft' },
              { issue: 'Missing canonicals', count: 48, severity: 'low', color: 'text-brand bg-brand-soft' },
              { issue: 'Duplicate meta tags', count: 16, severity: 'low', color: 'text-brand bg-brand-soft' },
            ].map((iss, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${iss.color}`}>
                  <AlertCircle className="h-3.5 w-3.5" />
                </span>
                <div className="flex-1 text-[12.5px] font-medium text-foreground">{iss.issue}</div>
                <span className="text-[14px] font-bold text-foreground">{iss.count}</span>
                <button className="text-[11px] font-semibold text-brand hover:underline">Fix</button>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Schema generator */}
      <ChartCard title="Schema Generator" subtitle="Structured data coverage across page types" icon={LinkIcon}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { name: 'Physician', coverage: 96 },
            { name: 'Hospital', coverage: 100 },
            { name: 'MedicalCondition', coverage: 88 },
            { name: 'FAQPage', coverage: 72 },
            { name: 'Breadcrumb', coverage: 100 },
            { name: 'Review', coverage: 84 },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-background p-3 text-center">
              <div className="relative mx-auto h-12 w-12">
                <svg className="h-12 w-12 -rotate-90">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#F1F4F9" strokeWidth="4" />
                  <motion.circle
                    cx="24" cy="24" r="20" fill="none" stroke="#0B5FFF" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - s.coverage / 100) }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-foreground">{s.coverage}%</div>
              </div>
              <div className="mt-1.5 text-[11px] font-medium text-foreground">{s.name}</div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
