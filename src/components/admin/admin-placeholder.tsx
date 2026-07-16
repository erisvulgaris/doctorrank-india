'use client';

import { motion } from 'framer-motion';
import { Construction, Sparkles } from 'lucide-react';

interface AdminPlaceholderProps {
  title: string;
  description: string;
}

export function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{title}</h2>
        <p className="mt-0.5 text-[12.5px] text-muted-foreground sm:text-[13.5px]">{description}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card p-12 text-center"
      >
        <div className="absolute inset-0 medical-pattern opacity-30" />
        <div className="relative">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-brand-soft text-brand">
            <Construction className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title} — Coming Soon</h3>
          <p className="mx-auto mt-2 max-w-md text-[13px] text-muted-foreground">
            This module is part of the DoctorRank enterprise suite. The architecture is modular and ready —
            full implementation is being rolled out per the product roadmap.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-semibold text-brand">
            <Sparkles className="h-3 w-3" />
            Enterprise tier
          </div>
        </div>
      </motion.div>
    </div>
  );
}
