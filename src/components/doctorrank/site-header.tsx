'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartPulse, Search, Sparkles, Menu, X, Home, Stethoscope,
  Activity, Building2, TrendingUp, Shield, ChevronRight,
  LogOut, LayoutDashboard, ChevronDown, User,
} from 'lucide-react';

interface SiteHeaderProps {
  onNavigate: (view: string, payload?: any) => void;
  currentView: string;
  doctor?: any | null;
  onLogout?: () => void;
}

const NAV_ITEMS = [
  { label: 'Home', view: 'home', icon: Home },
  { label: 'Find Doctors', view: 'search', icon: Stethoscope },
  { label: 'Conditions', view: 'conditions', icon: Activity },
  { label: 'Specialties', view: 'specialties', icon: HeartPulse },
  { label: 'Hospitals', view: 'hospitals', icon: Building2 },
  { label: 'How Ranking Works', view: 'ranking', icon: TrendingUp },
];

// Items shown in the bottom nav on mobile
const BOTTOM_NAV = [
  { label: 'Home', view: 'home', icon: Home },
  { label: 'Search', view: 'search', icon: Search },
  { label: 'Conditions', view: 'conditions', icon: Activity },
  { label: 'Hospitals', view: 'hospitals', icon: Building2 },
  { label: 'Ranking', view: 'ranking', icon: TrendingUp },
];

export function SiteHeader({ onNavigate, currentView, doctor, onLogout }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 w-full safe-top"
      >
        <div className="glass border-b border-border/60">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="group flex items-center gap-2"
              aria-label="DoctorRank India home"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-brand/30 blur-md transition-all group-hover:bg-brand/40" />
                <div className="relative grid h-8 w-8 place-items-center rounded-xl bg-brand text-white shadow-card sm:h-9 sm:w-9">
                  <HeartPulse className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[14px] font-semibold tracking-tight text-foreground sm:text-[15px]">
                  DoctorRank
                </span>
                <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
                  India
                </span>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
              {NAV_ITEMS.map((item) => {
                const active = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => onNavigate(item.view)}
                    aria-current={active ? 'page' : undefined}
                    className={`relative rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                      active
                        ? 'text-brand'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand"
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onNavigate('search')}
                className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[12px] font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground md:flex"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search doctors…</span>
                <kbd className="ml-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  /
                </kbd>
              </button>

              {/* Auth area: show profile menu if logged in, otherwise Login + Book buttons */}
              {doctor ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen((o) => !o)}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1 pr-1.5 hover:border-brand/40"
                    aria-label="Open profile menu"
                  >
                    <img
                      src={doctor.photoUrl}
                      alt=""
                      className="h-7 w-7 rounded-md object-cover"
                    />
                    <div className="hidden text-left leading-none sm:block">
                      <div className="text-[12px] font-semibold text-foreground">Dr. {doctor.name.replace(/^Dr\.\s*/, '').split(' ')[0]}</div>
                      <div className="text-[10px] text-muted-foreground">Dashboard</div>
                    </div>
                    <ChevronDown className="hidden h-3 w-3 text-muted-foreground sm:block" />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="absolute right-0 top-11 z-20 w-56 overflow-hidden rounded-xl border border-border bg-popover shadow-premium"
                        >
                          <div className="border-b border-border p-3">
                            <div className="text-[13px] font-semibold text-foreground">{doctor.name}</div>
                            <div className="text-[11px] text-muted-foreground">{doctor.email}</div>
                            <div className="mt-1.5 flex items-center gap-1">
                              {doctor.isVerified ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-soft px-2 py-0.5 text-[9px] font-semibold text-emerald">
                                  <Shield className="h-2.5 w-2.5" /> Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
                                  Pending verification
                                </span>
                              )}
                              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[9px] font-semibold text-brand">
                                Rank {Math.round(doctor.doctorRank)}
                              </span>
                            </div>
                          </div>
                          <div className="p-1">
                            <button
                              onClick={() => { onNavigate('dashboard'); setProfileOpen(false); }}
                              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium text-foreground hover:bg-muted"
                            >
                              <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" /> Dashboard
                            </button>
                            <button
                              onClick={() => { onNavigate('doctor', { slug: doctor.slug }); setProfileOpen(false); }}
                              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium text-foreground hover:bg-muted"
                            >
                              <User className="h-3.5 w-3.5 text-muted-foreground" /> View public profile
                            </button>
                          </div>
                          <div className="border-t border-border p-1">
                            <button
                              onClick={() => { setProfileOpen(false); onLogout?.(); }}
                              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium text-danger hover:bg-danger-soft"
                            >
                              <LogOut className="h-3.5 w-3.5" /> Sign out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('login')}
                    className="hidden items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[12px] font-semibold text-foreground transition-colors hover:border-brand/40 sm:inline-flex sm:text-[13px]"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => onNavigate('search')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-[12px] font-semibold text-white shadow-card transition-all hover:bg-brand/90 hover:shadow-hover sm:px-3.5 sm:text-[13px]"
                  >
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Book</span>
                    <span className="sm:hidden">Book</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setMobileOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-foreground lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-card shadow-premium"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-white">
                    <HeartPulse className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                  <span className="text-[14px] font-semibold">DoctorRank India</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-3">
                {NAV_ITEMS.map((item, i) => {
                  const active = currentView === item.view;
                  return (
                    <motion.button
                      key={item.view}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i + 0.05 }}
                      onClick={() => {
                        onNavigate(item.view);
                        setMobileOpen(false);
                      }}
                      aria-current={active ? 'page' : undefined}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-medium transition-colors ${
                        active
                          ? 'bg-brand-soft text-brand'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-auto border-t border-border p-4">
                {doctor ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => { onNavigate('dashboard'); setMobileOpen(false); }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-[14px] font-semibold text-white shadow-card"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      My Dashboard
                    </button>
                    <button
                      onClick={() => { setMobileOpen(false); onLogout?.(); }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-[13px] font-medium text-danger hover:bg-danger-soft"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => { onNavigate('login'); setMobileOpen(false); }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-[13px] font-medium text-foreground hover:bg-muted"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('search');
                        setMobileOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-[14px] font-semibold text-white shadow-card"
                    >
                      <Sparkles className="h-4 w-4" />
                      Book Appointment
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur lg:hidden safe-bottom" aria-label="Mobile">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
          {BOTTOM_NAV.map((item) => {
            const active = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                aria-current={active ? 'page' : undefined}
                aria-label={item.label}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium transition-colors ${
                  active ? 'text-brand' : 'text-muted-foreground'
                }`}
              >
                <div className={`grid h-7 w-7 place-items-center rounded-lg transition-all ${active ? 'bg-brand-soft' : ''}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
