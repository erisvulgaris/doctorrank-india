'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Stethoscope, Activity, Hospital as HospitalIcon, Search } from 'lucide-react';

interface ListViewProps {
  kind: 'specialties' | 'conditions' | 'hospitals';
  items: any[];
  onNavigate: (view: string, payload?: any) => void;
  onSearch: (q: string) => void;
}

const META = {
  specialties: {
    title: 'All specialties',
    subtitle: 'Browse 14 verified medical specialties across India',
    icon: Stethoscope,
    view: 'specialty',
    accent: 'from-brand-soft to-emerald-soft',
  },
  conditions: {
    title: 'All conditions',
    subtitle: 'Each condition opens a content hub with symptoms, treatments, and matched doctors',
    icon: Activity,
    view: 'condition',
    accent: 'from-emerald-soft to-cyan',
  },
  hospitals: {
    title: 'All hospitals',
    subtitle: 'Multi-specialty hospitals across India',
    icon: HospitalIcon,
    view: 'hospital',
    accent: 'from-red-50 to-brand-soft',
  },
} as const;

export function ListView({ kind, items, onNavigate, onSearch }: ListViewProps) {
  const meta = META[kind];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <button onClick={() => onNavigate('home')} className="hover:text-foreground">Home</button>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground capitalize">{kind}</span>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-4 relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-premium sm:p-8"
      >
        <div className={`absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-to-br ${meta.accent} blur-3xl opacity-60`} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <meta.icon className="h-3.5 w-3.5 text-brand" />
            {items.length} entries
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{meta.title}</h1>
          <p className="mt-2 text-[14px] text-muted-foreground">{meta.subtitle}</p>

          <button
            onClick={() => onSearch('')}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-[13px] font-medium text-foreground hover:border-brand/40"
          >
            <Search className="h-4 w-4" /> Search across all
          </button>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
            whileHover={{ y: -2 }}
            onClick={() => onNavigate(meta.view, { slug: item.slug })}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-left shadow-card transition-all hover:border-brand/30 hover:shadow-hover"
          >
            <div className="flex items-start justify-between">
              <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${meta.accent} text-brand`}>
                {kind === 'hospitals' ? (
                  <HospitalIcon className="h-5 w-5" />
                ) : kind === 'conditions' ? (
                  <Activity className="h-5 w-5" />
                ) : (
                  <Stethoscope className="h-5 w-5" />
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </div>
            <h3 className="mt-3 text-[15px] font-semibold text-foreground">{item.name}</h3>
            <p className="mt-1 line-clamp-2 text-[12px] text-muted-foreground">
              {kind === 'specialties' && item.tagline}
              {kind === 'conditions' && item.overview}
              {kind === 'hospitals' && item.description}
            </p>
            {kind === 'hospitals' && (
              <div className="mt-3 flex items-center gap-2 text-[12px] text-muted-foreground">
                <span className="font-medium text-foreground">{item.rating} ★</span>
                <span>·</span>
                <span>{item.city?.name}</span>
              </div>
            )}
            {kind === 'conditions' && (
              <div className="mt-3 text-[12px] text-muted-foreground">
                <span className="font-medium text-brand">{item.specialty?.name}</span>
              </div>
            )}
            {kind === 'specialties' && (
              <div className="mt-3 text-[12px] text-muted-foreground">
                {item.doctors?.length || 0} doctors · {item.conditions?.length || 0} conditions
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
