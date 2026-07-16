'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowRight, CornerDownLeft, Building2, Stethoscope, Activity,
  LayoutDashboard, Users, CalendarClock, Brain, Shield, Wallet, Settings,
  Search as SearchIcon, FileText, Brain as BrainIcon, X,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
}

interface CmdItem {
  id: string;
  label: string;
  hint?: string;
  icon: any;
  group: string;
}

const COMMANDS: CmdItem[] = [
  { id: 'dashboard',    label: 'Go to Dashboard',          icon: LayoutDashboard, group: 'Navigation' },
  { id: 'doctors',      label: 'Doctor Management',        icon: Stethoscope,     group: 'Navigation' },
  { id: 'hospitals',    label: 'Hospital Management',      icon: Building2,       group: 'Navigation' },
  { id: 'appointments', label: 'Appointments',             icon: CalendarClock,   group: 'Navigation' },
  { id: 'verification', label: 'Verification Center',      icon: Shield,          group: 'Navigation' },
  { id: 'reviews',      label: 'Reviews Moderation',       icon: SearchIcon,      group: 'Navigation' },
  { id: 'diseases',     label: 'Disease Library',          icon: Activity,        group: 'Navigation' },
  { id: 'seo',          label: 'SEO Control Center',       icon: Search,          group: 'Navigation' },
  { id: 'ai',           label: 'AI Center',                icon: Brain,           group: 'Navigation' },
  { id: 'revenue',      label: 'Revenue Dashboard',        icon: Wallet,          group: 'Navigation' },
  { id: 'users',        label: 'Users & Roles',            icon: Users,           group: 'Navigation' },
  { id: 'security',     label: 'Security Center',          icon: Shield,          group: 'Navigation' },
  { id: 'settings',     label: 'Platform Settings',        icon: Settings,        group: 'Navigation' },
  { id: 'developers',   label: 'Developer Console',        icon: FileText,        group: 'Navigation' },

  { id: 'new-doctor',     label: 'Create new doctor',     icon: Stethoscope,     group: 'Actions' },
  { id: 'new-hospital',   label: 'Create new hospital',   icon: Building2,       group: 'Actions' },
  { id: 'new-article',    label: 'Write article',         icon: FileText,        group: 'Actions' },
  { id: 'run-ai-query',   label: 'Run AI query',          icon: Brain,           group: 'Actions' },
];

export function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // Defer state updates to avoid cascading renders in effect body
      const t = setTimeout(() => {
        setQuery('');
        setActiveIdx(0);
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.group.toLowerCase().includes(query.toLowerCase())
  );

  // Group filtered items
  const groups: Record<string, CmdItem[]> = {};
  for (const c of filtered) {
    if (!groups[c.group]) groups[c.group] = [];
    groups[c.group].push(c);
  }

  const flatList = filtered;

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const sel = flatList[activeIdx];
      if (sel && (COMMANDS.find((c) => c.id === sel.id))) {
        onNavigate(sel.id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/40 p-4 pt-[15vh] backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover shadow-premium"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={handleKey}
                placeholder="Search modules, doctors, hospitals, or type a command…"
                className="flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button onClick={onClose} className="rounded p-0.5 text-muted-foreground hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto scroll-thin p-2">
              {flatList.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <Search className="mx-auto mb-2 h-6 w-6 text-muted-foreground/50" />
                  <p className="text-[13px] text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
                </div>
              )}
              {Object.entries(groups).map(([groupName, items]) => (
                <div key={groupName} className="mb-2">
                  <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {groupName}
                  </div>
                  {items.map((item) => {
                    const idx = flatList.indexOf(item);
                    const active = idx === activeIdx;
                    return (
                      <button
                        key={item.id}
                        onMouseEnter={() => setActiveIdx(idx)}
                        onClick={() => {
                          onNavigate(item.id);
                          onClose();
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
                          active ? 'bg-brand-soft' : 'hover:bg-muted'
                        }`}
                      >
                        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${active ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'}`}>
                          <item.icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="flex-1 text-[13px] font-medium text-foreground">{item.label}</span>
                        {item.hint && <span className="text-[11px] text-muted-foreground">{item.hint}</span>}
                        {active && <CornerDownLeft className="h-3 w-3 text-brand" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10.5px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1">↑</kbd><kbd className="rounded border border-border bg-muted px-1">↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1">↵</kbd> select</span>
                <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1">esc</kbd> close</span>
              </div>
              <span className="hidden sm:inline">DoctorRank Admin</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
