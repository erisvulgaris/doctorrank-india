'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Stethoscope, Building2, CalendarClock, ShieldCheck,
  Star, Search, Brain, Wallet, BarChart3, Users, Lock, Settings,
  Terminal, ChevronLeft, ChevronRight, HeartPulse, Activity,
  FlaskConical, FileText, Megaphone, Headphones, BookOpen, Building,
  MapPin, FileCode, Crown, ChevronDown,
} from 'lucide-react';

interface AdminSidebarProps {
  section: string;
  onNavigate: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavGroup {
  label: string;
  items: Array<{ id: string; label: string; icon: any; badge?: string }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Healthcare',
    items: [
      { id: 'doctors', label: 'Doctors', icon: Stethoscope },
      { id: 'hospitals', label: 'Hospitals', icon: Building2 },
      { id: 'appointments', label: 'Appointments', icon: CalendarClock, badge: '12' },
      { id: 'verification', label: 'Verification', icon: ShieldCheck, badge: '5' },
      { id: 'reviews', label: 'Reviews', icon: Star, badge: '3' },
    ],
  },
  {
    label: 'Content & SEO',
    items: [
      { id: 'diseases', label: 'Disease Library', icon: Activity },
      { id: 'procedures', label: 'Procedures', icon: FlaskConical },
      { id: 'specialties', label: 'Specialties', icon: HeartPulse },
      { id: 'seo', label: 'SEO Control', icon: Search },
      { id: 'content', label: 'Content', icon: BookOpen },
    ],
  },
  {
    label: 'AI & Intelligence',
    items: [
      { id: 'ai', label: 'AI Center', icon: Brain },
      { id: 'maps', label: 'Maps', icon: MapPin },
    ],
  },
  {
    label: 'Business',
    items: [
      { id: 'revenue', label: 'Revenue', icon: Wallet },
      { id: 'crm', label: 'CRM', icon: Users },
      { id: 'support', label: 'Support', icon: Headphones },
      { id: 'marketing', label: 'Marketing', icon: Megaphone },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'users', label: 'Users & Roles', icon: Users },
      { id: 'security', label: 'Security', icon: Lock },
      { id: 'developers', label: 'Developer', icon: Terminal },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function AdminSidebar({
  section, onNavigate, collapsed, onToggleCollapse, mobileOpen, onCloseMobile,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onCloseMobile}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen border-r border-border bg-card transition-all duration-300 lg:sticky lg:translate-x-0 ${
          collapsed ? 'w-[68px]' : 'w-[260px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-3 sm:h-16">
          <div className={`flex items-center gap-2 ${collapsed ? 'lg:justify-center' : ''}`}>
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand text-white shadow-card">
              <HeartPulse className="h-4 w-4" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="leading-none">
                <div className="text-[13px] font-semibold tracking-tight">DoctorRank</div>
                <div className="text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Admin Console</div>
              </div>
            )}
          </div>
          <button
            onClick={onCloseMobile}
            className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="scroll-thin h-[calc(100vh-3.5rem)] overflow-y-auto px-2 py-3 sm:h-[calc(100vh-4rem)]">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className="mb-3">
              {!collapsed && (
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = section === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        onCloseMobile();
                      }}
                      title={collapsed ? item.label : undefined}
                      className={`group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                        active
                          ? 'bg-brand-soft text-brand'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      } ${collapsed ? 'lg:justify-center' : ''}`}
                    >
                      {active && (
                        <motion.span
                          layoutId="admin-nav-active"
                          className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand"
                        />
                      )}
                      <item.icon className={`h-4 w-4 shrink-0 ${active ? 'text-brand' : ''}`} />
                      {!collapsed && <span className="flex-1 truncate text-left">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                          active ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-20 hidden h-6 w-6 place-items-center rounded-full border border-border bg-card shadow-card text-muted-foreground hover:text-foreground lg:grid"
          aria-label="Toggle sidebar width"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>
    </>
  );
}
