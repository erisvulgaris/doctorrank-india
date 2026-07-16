'use client';

import { motion } from 'framer-motion';

/**
 * Animated ECG / heartbeat line — the signature medical visual motif.
 * Used in hero backgrounds, dividers, and KPI cards.
 */
export function EcgLine({
  className = '',
  color = '#0B5FFF',
  height = 60,
  strokeWidth = 2,
  animated = true,
}: {
  className?: string;
  color?: string;
  height?: number;
  strokeWidth?: number;
  animated?: boolean;
}) {
  // Path simulates a normal sinus rhythm ECG: baseline → P wave → QRS complex → T wave
  const path = 'M0,30 L80,30 L88,28 L92,32 L96,30 L120,30 L124,18 L128,42 L132,8 L136,52 L140,30 L160,30 L168,26 L172,30 L200,30 L280,30 L288,28 L292,32 L296,30 L320,30 L324,18 L328,42 L332,8 L336,52 L340,30 L360,30 L368,26 L372,30 L400,30';

  return (
    <svg
      viewBox="0 0 400 60"
      className={`w-full ${className}`}
      style={{ height }}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`ecg-grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="20%" stopColor={color} stopOpacity="1" />
          <stop offset="80%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={path}
        fill="none"
        stroke={`url(#ecg-grad-${color.replace('#', '')})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animated ? { pathLength: 0, opacity: 0 } : false}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 2.4, ease: 'easeInOut' }}
      />
    </svg>
  );
}

/**
 * Continuously scrolling ECG strip — for hero backgrounds.
 */
export function EcgStrip({ className = '', color = '#0B5FFF' }: { className?: string; color?: string }) {
  const strip = 'M0,30 L60,30 L66,28 L70,32 L74,30 L90,30 L94,18 L98,42 L102,8 L106,52 L110,30 L130,30 L134,26 L138,30 L160,30';
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div className="ecg-scroll flex" style={{ width: '200%' }}>
        <svg viewBox="0 0 160 60" preserveAspectRatio="none" className="h-full w-1/2">
          <path d={strip} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg viewBox="0 0 160 60" preserveAspectRatio="none" className="h-full w-1/2">
          <path d={strip} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Circular rank gauge — for doctor cards and profiles.
 * Shows the DoctorRank score with an animated arc.
 */
export function RankGauge({
  rank,
  size = 56,
  stroke = 5,
  showLabel = true,
}: {
  rank: number;
  size?: number;
  stroke?: number;
  showLabel?: boolean;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (rank / 100) * c;
  const color = rank >= 90 ? '#00B884' : rank >= 80 ? '#0B5FFF' : rank >= 70 ? '#06B6D4' : rank >= 60 ? '#F59E0B' : '#64748B';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F4F9" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold leading-none" style={{ color, fontSize: size * 0.28 }}>
          {Math.round(rank)}
        </span>
        {showLabel && (
          <span className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">
            Rank
          </span>
        )}
      </div>
    </div>
  );
}
