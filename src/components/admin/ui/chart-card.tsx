'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, icon: Icon, action, children, className = '' }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {Icon && (
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <h3 className="text-[14px] font-semibold text-foreground sm:text-[15px]">{title}</h3>
            {subtitle && <p className="text-[11.5px] text-muted-foreground sm:text-[12px]">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="mt-3 sm:mt-4">
        {children}
      </div>
    </motion.div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[12.5px] text-muted-foreground sm:text-[13.5px]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
