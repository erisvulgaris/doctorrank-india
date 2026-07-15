'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation2, Clock, Car, Pill, Stethoscope, FlaskConical, Hospital, Plus, Minus } from 'lucide-react';

interface MapPoint {
  id: string;
  type: 'doctor' | 'hospital' | 'lab' | 'pharmacy';
  name: string;
  lat: number;
  lng: number;
  sub?: string;
  eta?: string;
}

interface StylizedMapProps {
  points: MapPoint[];
  center: { lat: number; lng: number };
  onPointClick?: (id: string, type: string) => void;
  selectedId?: string;
  className?: string;
}

const TYPE_COLORS: Record<string, { fg: string; bg: string; label: string; icon: any }> = {
  doctor:   { fg: '#1456D9', bg: '#EBF1FE', label: 'Doctor',   icon: Stethoscope },
  hospital: { fg: '#DC2626', bg: '#FEE2E2', label: 'Hospital', icon: Hospital },
  lab:      { fg: '#7C3AED', bg: '#F3E8FF', label: 'Lab',      icon: FlaskConical },
  pharmacy: { fg: '#10B981', bg: '#E7F8F1', label: 'Pharmacy', icon: Pill },
};

// Convert lat/lng to SVG coordinates using a simple linear projection centered on `center`
function project(lat: number, lng: number, centerLat: number, centerLng: number, scale: number) {
  const x = (lng - centerLng) * scale * Math.cos((centerLat * Math.PI) / 180);
  const y = (lat - centerLat) * scale * -1;
  return { x: x + 400, y: y + 300 };
}

export function StylizedMap({ points, center, onPointClick, selectedId, className }: StylizedMapProps) {
  const [zoom, setZoom] = useState(1);
  const [hovered, setHovered] = useState<string | null>(null);

  const scale = 4000; // projection scale

  const projected = useMemo(() =>
    points.map((p) => ({
      ...p,
      ...project(p.lat, p.lng, center.lat, center.lng, scale),
    })),
    [points, center, scale],
  );

  // Determine bounds for background grid
  const bounds = useMemo(() => {
    if (projected.length === 0) return { minX: 0, maxX: 800, minY: 0, maxY: 600 };
    const xs = projected.map((p) => p.x);
    const ys = projected.map((p) => p.y);
    const pad = 80;
    return {
      minX: Math.min(...xs) - pad,
      maxX: Math.max(...xs) + pad,
      minY: Math.min(...ys) - pad,
      maxY: Math.max(...ys) + pad,
    };
  }, [projected]);

  return (
    <div className={`relative h-full w-full overflow-hidden rounded-2xl border border-border bg-card ${className || ''}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#F4F6FB] to-[#EBF1FE]" />
      <div className="absolute inset-0 dot-bg opacity-60" />

      {/* Soft "rivers / roads" stylized lines */}
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
      >
        {/* River */}
        <path
          d="M -50 420 C 150 380, 280 460, 480 380 C 640 320, 760 360, 850 320"
          fill="none"
          stroke="#BFDBFE"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Major road */}
        <path
          d="M 100 -50 L 200 200 L 380 280 L 520 420 L 600 700"
          fill="none"
          stroke="#E6E8EE"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d="M 100 -50 L 200 200 L 380 280 L 520 420 L 600 700"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="8 12"
          strokeLinecap="round"
        />
        {/* Cross road */}
        <path d="M -50 280 L 850 280" stroke="#E6E8EE" strokeWidth="18" strokeLinecap="round" />
        <path d="M -50 280 L 850 280" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6 10" />

        {/* Park / green area */}
        <ellipse cx="640" cy="160" rx="90" ry="60" fill="#E7F8F1" opacity="0.7" />
        <ellipse cx="160" cy="480" rx="70" ry="50" fill="#E7F8F1" opacity="0.6" />

        {/* Points */}
        {projected.map((p) => {
          const cfg = TYPE_COLORS[p.type];
          const isSelected = selectedId === p.id;
          const isHovered = hovered === p.id;
          const r = isSelected || isHovered ? 14 : 10;
          return (
            <g
              key={p.id}
              transform={`translate(${p.x}, ${p.y})`}
              className="cursor-pointer"
              onClick={() => onPointClick?.(p.id, p.type)}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Pulse ring */}
              {(isSelected || isHovered) && (
                <circle r={r + 8} fill={cfg.fg} opacity="0.15">
                  <animate attributeName="r" values={`${r + 4};${r + 14};${r + 4}`} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.25;0;0.25" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle r={r + 3} fill="#FFFFFF" />
              <circle r={r} fill={cfg.fg} />
              <circle r={r - 4} fill={cfg.bg} />
              <text
                textAnchor="middle"
                dy="4"
                fontSize={r * 0.7}
                fill={cfg.fg}
                fontWeight="700"
                fontFamily="Inter, sans-serif"
              >
                {p.type === 'doctor' ? 'D' : p.type === 'hospital' ? 'H' : p.type === 'lab' ? 'L' : 'P'}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2"
          >
            {(() => {
              const p = projected.find((x) => x.id === hovered);
              if (!p) return null;
              const cfg = TYPE_COLORS[p.type];
              return (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-popover/95 px-3 py-2 shadow-premium backdrop-blur">
                  <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: cfg.bg, color: cfg.fg }}>
                    <cfg.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-[12px] font-semibold text-foreground">{p.name}</div>
                    {p.sub && <div className="text-[11px] text-muted-foreground">{p.sub}</div>}
                  </div>
                  {p.eta && (
                    <div className="ml-2 flex items-center gap-1 text-[11px] font-medium text-emerald">
                      <Car className="h-3 w-3" />
                      {p.eta}
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom controls */}
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-1 rounded-xl border border-border bg-card/95 p-1 shadow-card backdrop-blur">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
          className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
          className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-wrap gap-2 rounded-xl border border-border bg-card/95 p-2 shadow-card backdrop-blur">
        {Object.entries(TYPE_COLORS).map(([k, cfg]) => {
          const Icon = cfg.icon;
          const count = points.filter((p) => p.type === k).length;
          if (count === 0) return null;
          return (
            <div key={k} className="flex items-center gap-1.5 px-1">
              <span className="grid h-5 w-5 place-items-center rounded-md" style={{ background: cfg.bg, color: cfg.fg }}>
                <Icon className="h-3 w-3" />
              </span>
              <span className="text-[11px] font-medium text-foreground">{cfg.label}</span>
              <span className="text-[11px] text-muted-foreground">({count})</span>
            </div>
          );
        })}
      </div>

      {/* Live indicator */}
      <div className="absolute right-3 bottom-3 z-20 flex items-center gap-1.5 rounded-full border border-border bg-card/95 px-2.5 py-1 shadow-card backdrop-blur">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Live</span>
      </div>
    </div>
  );
}
