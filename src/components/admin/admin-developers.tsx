'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal, Play, Copy, Check, AlertCircle, Activity, Database,
  Zap, Server, HardDrive, Cpu, Clock,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { SectionHeader, ChartCard } from './ui/chart-card';
import { KpiCard } from './ui/kpi-card';

const PERF_DATA = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  p50: Math.round(80 + Math.random() * 30),
  p95: Math.round(180 + Math.random() * 80),
  p99: Math.round(340 + Math.random() * 120),
}));

const ENDPOINTS = [
  { method: 'GET',  path: '/api/search',              calls: '184K',  p95: '124ms',  error: '0.02%', status: 'healthy' },
  { method: 'GET',  path: '/api/doctors/:slug',       calls: '248K',  p95: '48ms',   error: '0.01%', status: 'healthy' },
  { method: 'GET',  path: '/api/suggest',             calls: '92K',   p95: '32ms',   error: '0.04%', status: 'healthy' },
  { method: 'POST', path: '/api/ai-symptom',          calls: '14K',   p95: '2.8s',   error: '0.12%', status: 'degraded' },
  { method: 'POST', path: '/api/appointments',        calls: '4.8K',  p95: '180ms',  error: '0.08%', status: 'healthy' },
  { method: 'GET',  path: '/api/doctors',             calls: '38K',   p95: '64ms',   error: '0.03%', status: 'healthy' },
];

const JOBS = [
  { name: 'Sitemap Generator', schedule: '0 2 * * *', lastRun: '2 hrs ago', duration: '4m 18s', status: 'success' },
  { name: 'SEO Index Push', schedule: '*/30 * * * *', lastRun: '12 min ago', duration: '32s', status: 'success' },
  { name: 'AI Embedding Update', schedule: '0 4 * * *', lastRun: '6 hrs ago', duration: '12m 4s', status: 'success' },
  { name: 'Review Spam Detection', schedule: '*/15 * * * *', lastRun: '4 min ago', duration: '18s', status: 'success' },
  { name: 'Email Digest', schedule: '0 9 * * 1', lastRun: '2 days ago', duration: '2m 41s', status: 'success' },
  { name: 'Database Backup', schedule: '0 1 * * *', lastRun: '14 hrs ago', duration: '8m 12s', status: 'success' },
];

export function AdminDevelopers() {
  const [endpoint, setEndpoint] = useState('/api/search?q=hair+fall');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const runQuery = async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint);
      const json = await res.json();
      setResponse(JSON.stringify(json, null, 2));
    } catch (e: any) {
      setResponse(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="Developer Console" subtitle="API explorer, jobs, performance, and infrastructure" />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="API Calls (24h)" value={580000} delta={12.4} icon={Activity} color="brand" format="compact" sparkline={[420,460,490,520,540,560,575,580]} />
        <KpiCard label="Avg Response" value="84" delta={-12} icon={Zap} color="emerald" format="percent" />
        <KpiCard label="Error Rate" value="0.04" delta={-0.02} icon={AlertCircle} color="amber" format="percent" />
        <KpiCard label="Uptime (30d)" value="99.94" delta={0.02} icon={Server} color="emerald" format="percent" />
      </div>

      {/* API Explorer */}
      <ChartCard title="API Explorer" subtitle="Test any endpoint in real-time" icon={Terminal}>
        <div className="flex flex-wrap gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="rounded-lg border border-border bg-background px-2.5 py-2 text-[13px] font-semibold outline-none focus:border-brand"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          <input
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="min-w-[200px] flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-[12.5px] outline-none focus:border-brand"
            placeholder="/api/endpoint"
          />
          <button
            onClick={runQuery}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-[12.5px] font-semibold text-white shadow-card hover:bg-brand/90 disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" /> {loading ? 'Running…' : 'Send'}
          </button>
        </div>

        {response && (
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Response</div>
              <button
                onClick={copyResponse}
                className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold text-brand hover:bg-brand-soft"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="mt-1 max-h-64 overflow-auto scroll-thin rounded-xl bg-[#0A1428] p-3 text-[11.5px] leading-relaxed text-emerald">
              {response}
            </pre>
          </div>
        )}
      </ChartCard>

      {/* Performance chart */}
      <ChartCard
        title="API Performance"
        subtitle="Response time percentiles · last 24 hours"
        icon={Activity}
        action={
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald" /> p50</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> p95</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-danger" /> p99</span>
          </div>
        }
      >
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PERF_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="g-p50" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00B884" stopOpacity={0.3} /><stop offset="100%" stopColor="#00B884" stopOpacity={0} /></linearGradient>
                <linearGradient id="g-p95" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F59E0B" stopOpacity={0.3} /><stop offset="100%" stopColor="#F59E0B" stopOpacity={0} /></linearGradient>
                <linearGradient id="g-p99" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} /><stop offset="100%" stopColor="#EF4444" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}ms`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px' }} />
              <Area type="monotone" dataKey="p99" stroke="#EF4444" strokeWidth={1.5} fill="url(#g-p99)" />
              <Area type="monotone" dataKey="p95" stroke="#F59E0B" strokeWidth={1.5} fill="url(#g-p95)" />
              <Area type="monotone" dataKey="p50" stroke="#00B884" strokeWidth={2} fill="url(#g-p50)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Endpoints table */}
      <ChartCard title="Endpoint Health" subtitle="Top API endpoints · 24h window" icon={Activity}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Method</th>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Endpoint</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Calls</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">p95</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Errors</th>
                <th className="px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((e, i) => (
                <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                  <td className="px-3 py-2.5">
                    <span className={`rounded-md px-1.5 py-0.5 font-mono text-[10.5px] font-bold ${
                      e.method === 'GET' ? 'bg-brand-soft text-brand' : 'bg-emerald-soft text-emerald'
                    }`}>{e.method}</span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[12px] text-foreground">{e.path}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{e.calls}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{e.p95}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{e.error}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                      e.status === 'healthy' ? 'bg-emerald-soft text-emerald' : 'bg-amber-50 text-amber-700'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${e.status === 'healthy' ? 'bg-emerald' : 'bg-amber-500'}`} />
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        {/* Background jobs */}
        <ChartCard title="Background Jobs" subtitle="Cron jobs and scheduled tasks" icon={Clock}>
          <div className="space-y-2">
            {JOBS.map((j, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-soft text-emerald">
                  <Check className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium text-foreground">{j.name}</div>
                  <div className="font-mono text-[10.5px] text-muted-foreground">{j.schedule} · last: {j.lastRun} · {j.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Infrastructure */}
        <ChartCard title="Infrastructure" subtitle="System resources" icon={Server}>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'CPU Usage', value: '34%', detail: '8 cores · 2.7 GHz', icon: Cpu, color: 'text-brand' },
              { label: 'Memory', value: '6.4 GB', detail: 'of 16 GB · 40%', icon: Activity, color: 'text-emerald' },
              { label: 'Disk', value: '428 GB', detail: 'of 1 TB · 42%', icon: HardDrive, color: 'text-amber-600' },
              { label: 'DB Connections', value: '48', detail: 'of 100 · 48%', icon: Database, color: 'text-cyan-600' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                  <span className="text-[11.5px] font-medium text-foreground">{s.label}</span>
                </div>
                <div className="mt-1 text-lg font-bold text-foreground">{s.value}</div>
                <div className="text-[10.5px] text-muted-foreground">{s.detail}</div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
