'use client';

import { motion } from 'framer-motion';
import {
  Brain, Sparkles, MessageSquare, TrendingUp, AlertCircle,
  CheckCircle2, Languages, Zap, FileText, Plus,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { SectionHeader, ChartCard } from './ui/chart-card';
import { KpiCard } from './ui/kpi-card';

const AI_TRAFFIC = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  queries: Math.round(200 + i * 35 + Math.random() * 80),
  satisfaction: Math.round(78 + Math.random() * 18),
}));

const INTENTS = [
  { name: 'Find Doctor', count: 8400, color: '#0B5FFF' },
  { name: 'Symptom Check', count: 6200, color: '#00B884' },
  { name: 'Procedure Info', count: 3800, color: '#06B6D4' },
  { name: 'Pricing Query', count: 2400, color: '#F59E0B' },
  { name: 'Insurance', count: 1800, color: '#EF4444' },
];

const PROMPTS = [
  { name: 'Symptom Navigator', uses: 12400, accuracy: 92, lang: 8 },
  { name: 'Doctor Match', uses: 9800, accuracy: 88, lang: 6 },
  { name: 'Compare Doctors', uses: 4200, accuracy: 85, lang: 4 },
  { name: 'FAQ Generator', uses: 6800, accuracy: 94, lang: 8 },
  { name: 'Content Summarizer', uses: 3200, accuracy: 96, lang: 5 },
];

const POPULAR_QS = [
  { q: 'What doctor should I see for hair fall?', count: 1240, intent: 'Symptom Check' },
  { q: 'Best dermatologist in Mumbai for acne', count: 980, intent: 'Find Doctor' },
  { q: 'How much does knee replacement cost in Delhi?', count: 820, intent: 'Pricing Query' },
  { q: 'Is PRP treatment effective for hair loss?', count: 720, intent: 'Procedure Info' },
  { q: 'Symptoms of PCOS and when to see a doctor', count: 640, intent: 'Symptom Check' },
  { q: 'Best cardiologist near me accepting insurance', count: 580, intent: 'Find Doctor' },
];

export function AdminAi() {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="AI Center"
        subtitle="AI search analytics, prompt library, and quality monitoring"
        action={
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-[12.5px] font-semibold text-white shadow-card hover:bg-brand/90">
            <Plus className="h-3.5 w-3.5" /> New Prompt
          </button>
        }
      />

      {/* AI status banner */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand/20 bg-gradient-to-r from-brand-soft via-card to-emerald-soft p-4"
      >
        <div className="flex items-start gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
            <Brain className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 grid h-3 w-3 place-items-center rounded-full bg-emerald">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
              AI Engine Operational
              <span className="rounded-full bg-emerald-soft px-2 py-0.5 text-[10px] font-semibold text-emerald">99.94% uptime</span>
            </div>
            <div className="text-[12px] text-muted-foreground">2.8s avg response · 8 languages · 92% satisfaction · 0.4% hallucination rate</div>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="AI Queries (30d)" value={36400} delta={32.5} icon={MessageSquare} color="brand" format="compact" sparkline={[200,400,600,900,1200,1600,2000,2400]} />
        <KpiCard label="Satisfaction" value="92" delta={4.2} icon={CheckCircle2} color="emerald" format="percent" sparkline={[78,80,82,85,87,89,91,92]} />
        <KpiCard label="Languages" value={8} icon={Languages} color="cyan" />
        <KpiCard label="Hallucination" value="0.4" delta={-0.2} icon={AlertCircle} color="amber" format="percent" />
      </div>

      {/* AI traffic chart */}
      <ChartCard
        title="AI Search Traffic & Satisfaction"
        subtitle="Last 30 days"
        icon={TrendingUp}
        action={
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand" /> Queries</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald" /> Satisfaction</span>
          </div>
        }
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={AI_TRAFFIC} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="g-ai-q" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B5FFF" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0B5FFF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g-ai-s" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00B884" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#00B884" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px' }} />
              <Area type="monotone" dataKey="queries" stroke="#0B5FFF" strokeWidth={2} fill="url(#g-ai-q)" />
              <Area type="monotone" dataKey="satisfaction" stroke="#00B884" strokeWidth={2} fill="url(#g-ai-s)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        {/* Intent detection */}
        <ChartCard title="Intent Distribution" subtitle="What users are looking for" icon={Brain}>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INTENTS} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9F0', fontSize: '12px' }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                  {INTENTS.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Popular questions */}
        <ChartCard title="Popular Questions" subtitle="Top AI search queries" icon={MessageSquare}>
          <div className="space-y-1.5 max-h-64 overflow-y-auto scroll-thin">
            {POPULAR_QS.map((q, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-background p-2.5">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-brand-soft text-[10px] font-bold text-brand">{i+1}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-medium text-foreground">{q.q}</div>
                  <div className="text-[10px] text-muted-foreground">{q.intent} · {q.count} asks</div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Prompt library */}
      <ChartCard title="Prompt Library" subtitle="AI prompt templates and performance" icon={FileText}>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[600px] text-left text-[13px]">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Prompt</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Uses (30d)</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Accuracy</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Languages</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {PROMPTS.map((p, i) => (
                <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-brand" />
                      <span className="font-medium text-foreground">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{p.uses.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2.5 text-right">
                    <span className={`font-semibold ${p.accuracy >= 90 ? 'text-emerald' : p.accuracy >= 80 ? 'text-amber-600' : 'text-danger'}`}>{p.accuracy}%</span>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{p.lang}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button className="text-[11px] font-semibold text-brand hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Hallucination monitor */}
      <ChartCard title="Hallucination Monitor" subtitle="AI output quality & safety" icon={AlertCircle}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Hallucination Rate', value: '0.4%', color: 'text-emerald', desc: 'Below 1% threshold' },
            { label: 'Flagged Outputs', value: 24, color: 'text-amber-600', desc: 'Last 24 hours' },
            { label: 'Auto-corrected', value: 18, color: 'text-brand', desc: 'Self-healing' },
            { label: 'Manual Review', value: 6, color: 'text-danger', desc: 'Pending review' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-background p-3">
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[11.5px] font-medium text-foreground">{s.label}</div>
              <div className="text-[10.5px] text-muted-foreground">{s.desc}</div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
