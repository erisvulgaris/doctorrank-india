'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: number; // % change
  icon: LucideIcon;
  color?: 'brand' | 'emerald' | 'amber' | 'cyan' | 'danger';
  sparkline?: number[];
  format?: 'int' | 'currency' | 'percent' | 'compact';
}

const COLOR_MAP = {
  brand:   { bg: '#E8F0FF', fg: '#0B5FFF', stroke: '#0B5FFF' },
  emerald: { bg: '#E6F9F1', fg: '#00B884', stroke: '#00B884' },
  amber:   { bg: '#FEF3C7', fg: '#F59E0B', stroke: '#F59E0B' },
  cyan:    { bg: '#DDF4FF', fg: '#06B6D4', stroke: '#06B6D4' },
  danger:  { bg: '#FEE2E2', fg: '#EF4444', stroke: '#EF4444' },
};

function formatValue(v: string | number, fmt?: string): string {
  if (typeof v === 'string') return v;
  if (fmt === 'currency') return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
  if (fmt === 'percent') return `${v}%`;
  if (fmt === 'compact') return new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(v);
  return new Intl.NumberFormat('en-IN').format(v);
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${points} ${w},${h}`} fill={`url(#spark-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function KpiCard({ label, value, delta, icon: Icon, color = 'brand', sparkline, format }: KpiCardProps) {
  const c = COLOR_MAP[color];
  const positive = (delta ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-hover sm:p-5"
    >
      <div className="flex items-start justify-between">
        <div className={`grid h-9 w-9 place-items-center rounded-xl sm:h-10 sm:w-10`} style={{ background: c.bg, color: c.fg }}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        {sparkline && sparkline.length > 1 && (
          <div className="hidden sm:block">
            <Sparkline data={sparkline} color={c.stroke} />
          </div>
        )}
      </div>
      <div className="mt-3 text-[22px] font-semibold tracking-tight text-foreground sm:text-[26px]">
        {formatValue(value, format)}
      </div>
      <div className="mt-0.5 flex items-center justify-between">
        <span className="text-[11.5px] text-muted-foreground sm:text-[12.5px]">{label}</span>
        {delta !== undefined && (
          <span className={`inline-flex items-center gap-0.5 text-[10.5px] font-semibold sm:text-[11.5px] ${positive ? 'text-emerald' : 'text-danger'}`}>
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
