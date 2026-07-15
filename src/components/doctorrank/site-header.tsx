'use client';

import { motion } from 'framer-motion';
import { HeartPulse, Search, Sparkles } from 'lucide-react';

interface SiteHeaderProps {
  onNavigate: (view: string, payload?: any) => void;
  currentView: string;
}

export function SiteHeader({ onNavigate, currentView }: SiteHeaderProps) {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="glass border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate('home')}
            className="group flex items-center gap-2.5"
            aria-label="DoctorRank India home"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-brand/30 blur-md transition-all group-hover:bg-brand/40" />
              <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-card">
                <HeartPulse className="h-5 w-5" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[15px] font-semibold tracking-tight text-foreground">
                DoctorRank
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                India
              </span>
            </div>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {[
              { label: 'Find Doctors', view: 'search' },
              { label: 'Conditions', view: 'conditions' },
              { label: 'Specialties', view: 'specialties' },
              { label: 'Hospitals', view: 'hospitals' },
              { label: 'How Ranking Works', view: 'ranking' },
            ].map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`relative rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                  currentView === item.view
                    ? 'text-brand'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                {currentView === item.view && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand"
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('search')}
              className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground sm:flex"
            >
              <Search className="h-4 w-4" />
              <span>Search doctors…</span>
              <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                /
              </kbd>
            </button>
            <button
              onClick={() => onNavigate('search')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-[13px] font-semibold text-white shadow-card transition-all hover:bg-brand/90 hover:shadow-hover"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Book Appointment</span>
              <span className="sm:hidden">Book</span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
