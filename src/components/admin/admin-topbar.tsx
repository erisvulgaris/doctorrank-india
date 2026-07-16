'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Search, Bell, ChevronDown, Sun, Moon, Globe, Plus,
  Command, HeartPulse, Settings, LogOut, User, Shield,
  CheckCircle2, AlertCircle, Info, X,
} from 'lucide-react';

interface AdminTopbarProps {
  section: string;
  onOpenMobileNav: () => void;
  onOpenCommand: () => void;
  onExitAdmin: () => void;
}

const SECTION_TITLES: Record<string, { title: string; breadcrumb: string[] }> = {
  dashboard:    { title: 'Executive Dashboard',    breadcrumb: ['Home', 'Admin', 'Dashboard'] },
  analytics:    { title: 'Analytics',              breadcrumb: ['Home', 'Admin', 'Analytics'] },
  doctors:      { title: 'Doctor Management',      breadcrumb: ['Home', 'Admin', 'Doctors'] },
  hospitals:    { title: 'Hospital Management',    breadcrumb: ['Home', 'Admin', 'Hospitals'] },
  appointments: { title: 'Appointment Management', breadcrumb: ['Home', 'Admin', 'Appointments'] },
  verification: { title: 'Verification Center',    breadcrumb: ['Home', 'Admin', 'Verification'] },
  reviews:      { title: 'Reviews Moderation',     breadcrumb: ['Home', 'Admin', 'Reviews'] },
  diseases:     { title: 'Disease Library',        breadcrumb: ['Home', 'Admin', 'Diseases'] },
  procedures:   { title: 'Procedure Library',      breadcrumb: ['Home', 'Admin', 'Procedures'] },
  specialties:  { title: 'Specialty Management',   breadcrumb: ['Home', 'Admin', 'Specialties'] },
  seo:          { title: 'SEO Control Center',     breadcrumb: ['Home', 'Admin', 'SEO'] },
  content:      { title: 'Content Management',     breadcrumb: ['Home', 'Admin', 'Content'] },
  ai:           { title: 'AI Center',              breadcrumb: ['Home', 'Admin', 'AI'] },
  maps:         { title: 'Maps Management',        breadcrumb: ['Home', 'Admin', 'Maps'] },
  revenue:      { title: 'Revenue Dashboard',      breadcrumb: ['Home', 'Admin', 'Revenue'] },
  crm:          { title: 'CRM & Sales',            breadcrumb: ['Home', 'Admin', 'CRM'] },
  support:      { title: 'Customer Support',       breadcrumb: ['Home', 'Admin', 'Support'] },
  marketing:    { title: 'Marketing',              breadcrumb: ['Home', 'Admin', 'Marketing'] },
  users:        { title: 'Users & Roles',          breadcrumb: ['Home', 'Admin', 'Users'] },
  security:     { title: 'Security Center',        breadcrumb: ['Home', 'Admin', 'Security'] },
  developers:   { title: 'Developer Console',      breadcrumb: ['Home', 'Admin', 'Developer'] },
  settings:     { title: 'Platform Settings',      breadcrumb: ['Home', 'Admin', 'Settings'] },
};

export function AdminTopbar({ section, onOpenMobileNav, onOpenCommand, onExitAdmin }: AdminTopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const meta = SECTION_TITLES[section] || { title: 'Admin', breadcrumb: ['Admin'] };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-card/95 px-3 backdrop-blur sm:h-16 sm:px-4 sm:gap-3">
      {/* Mobile menu */}
      <button
        onClick={onOpenMobileNav}
        className="grid h-9 w-9 place-items-center rounded-lg border border-border text-foreground lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb */}
      <div className="hidden min-w-0 flex-1 md:block">
        <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
          {meta.breadcrumb.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-border">/</span>}
              <span className={i === meta.breadcrumb.length - 1 ? 'font-semibold text-foreground' : ''}>{b}</span>
            </span>
          ))}
        </div>
        <h1 className="text-[15px] font-semibold tracking-tight text-foreground sm:text-[16px]">{meta.title}</h1>
      </div>

      {/* Mobile title */}
      <div className="flex-1 md:hidden">
        <h1 className="text-[15px] font-semibold tracking-tight text-foreground">{meta.title}</h1>
      </div>

      {/* Command palette trigger */}
      <button
        onClick={onOpenCommand}
        className="hidden items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground sm:flex"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search or jump to…</span>
        <kbd className="ml-3 flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
          <Command className="h-2.5 w-2.5" /> K
        </kbd>
      </button>
      <button
        onClick={onOpenCommand}
        className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground sm:hidden"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Quick action */}
      <button className="hidden items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-[12px] font-semibold text-white shadow-card transition-all hover:bg-brand/90 hover:shadow-hover sm:inline-flex">
        <Plus className="h-3.5 w-3.5" />
        New
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen((o) => !o)}
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-danger text-[9px] font-bold text-white">3</span>
        </button>
        <AnimatePresence>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute right-0 top-12 z-20 w-80 overflow-hidden rounded-xl border border-border bg-popover shadow-premium"
              >
                <div className="flex items-center justify-between border-b border-border p-3">
                  <span className="text-[13px] font-semibold">Notifications</span>
                  <button onClick={() => setNotifOpen(false)} className="rounded p-0.5 text-muted-foreground hover:bg-muted">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto scroll-thin">
                  {[
                    { icon: AlertCircle, color: 'text-amber-600 bg-amber-50', title: '5 doctors pending verification', time: '2 min ago' },
                    { icon: Info, color: 'text-brand bg-brand-soft', title: 'AI search traffic up 24% this week', time: '1 hr ago' },
                    { icon: CheckCircle2, color: 'text-emerald bg-emerald-soft', title: 'Apollo Hospital profile approved', time: '3 hrs ago' },
                    { icon: AlertCircle, color: 'text-danger bg-danger-soft', title: '3 reviews flagged for spam', time: '5 hrs ago' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-2.5 border-b border-border/60 p-3 last:border-0 hover:bg-muted/40">
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${n.color}`}>
                        <n.icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12.5px] font-medium text-foreground">{n.title}</div>
                        <div className="text-[10.5px] text-muted-foreground">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full border-t border-border p-2.5 text-center text-[12px] font-semibold text-brand hover:bg-muted/40">
                  View all notifications
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => setProfileOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg border border-border p-1 pr-1.5 hover:border-brand/40"
        >
          <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-brand to-emerald text-[11px] font-bold text-white">
            AD
          </div>
          <div className="hidden text-left leading-none sm:block">
            <div className="text-[12px] font-semibold text-foreground">Admin</div>
            <div className="text-[10px] text-muted-foreground">Super Admin</div>
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
                className="absolute right-0 top-12 z-20 w-60 overflow-hidden rounded-xl border border-border bg-popover shadow-premium"
              >
                <div className="border-b border-border p-3">
                  <div className="text-[13px] font-semibold text-foreground">Admin User</div>
                  <div className="text-[11px] text-muted-foreground">admin@doctorrank.in</div>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-soft px-2 py-0.5 text-[10px] font-semibold text-emerald">
                    <Shield className="h-2.5 w-2.5" /> Super Admin
                  </span>
                </div>
                <div className="p-1">
                  {[
                    { icon: User, label: 'Profile' },
                    { icon: Settings, label: 'Settings' },
                    { icon: Shield, label: 'Security' },
                  ].map((it, i) => (
                    <button key={i} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium text-foreground hover:bg-muted">
                      <it.icon className="h-3.5 w-3.5 text-muted-foreground" /> {it.label}
                    </button>
                  ))}
                </div>
                <div className="border-t border-border p-1">
                  <button
                    onClick={onExitAdmin}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium text-danger hover:bg-danger-soft"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Exit to public site
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
