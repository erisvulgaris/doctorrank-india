'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck, FileText, User, Building2, AlertCircle, CheckCircle2,
  XCircle, Eye, Stamp, ArrowRight, Clock,
} from 'lucide-react';
import { SectionHeader, ChartCard } from './ui/chart-card';

const QUEUE = [
  {
    id: 'V1', type: 'doctor', name: 'Dr. Reena Mathew', specialty: 'Oncology, Chennai',
    submitted: '2 hours ago', status: 'pending', priority: 'high',
    docs: ['MBBS Certificate', 'DM Oncology', 'Medical Registration', 'Photo ID'],
    notes: 'Tata Memorial affiliation pending confirmation.',
  },
  {
    id: 'V2', type: 'hospital', name: 'Kokilaben Hospital (new wing)', specialty: 'Mumbai, Andheri',
    submitted: '5 hours ago', status: 'review', priority: 'medium',
    docs: ['License', 'Fire Safety', 'NABH Certificate', 'Insurance TPA list'],
    notes: 'All docs received. Fire safety cert expires in 60 days.',
  },
  {
    id: 'V3', type: 'doctor', name: 'Dr. Sandeep Mohan', specialty: 'Gastroenterology, Hyderabad',
    submitted: '1 day ago', status: 'pending', priority: 'medium',
    docs: ['MBBS', 'MD', 'DM Gastro', 'Registration'],
    notes: 'Registration number verified against state council.',
  },
  {
    id: 'V4', type: 'doctor', name: 'Dr. Kavita Ranganath', specialty: 'Ophthalmology, Chennai',
    submitted: '2 days ago', status: 'approved', priority: 'low',
    docs: ['MBBS', 'MS Ophth', 'Fellowship Cornea'],
    notes: 'Auto-approved — registration verified via API.',
  },
  {
    id: 'V5', type: 'clinic', name: 'Smile Dental Clinic', specialty: 'Pune, Kothrud',
    submitted: '3 days ago', status: 'flagged', priority: 'high',
    docs: ['Dental Council License', 'Photos'],
    notes: 'Duplicate of existing clinic profile flagged for review.',
  },
];

const STATUS_CFG: Record<string, { color: string; bg: string; icon: any; label: string }> = {
  pending:  { color: 'text-amber-700', bg: 'bg-amber-50',  icon: AlertCircle,    label: 'Pending' },
  review:   { color: 'text-brand',     bg: 'bg-brand-soft', icon: Eye,            label: 'In Review' },
  approved: { color: 'text-emerald',   bg: 'bg-emerald-soft', icon: CheckCircle2, label: 'Approved' },
  flagged:  { color: 'text-danger',    bg: 'bg-danger-soft', icon: XCircle,       label: 'Flagged' },
};

export function AdminVerification() {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Verification Center"
        subtitle={`${QUEUE.filter((q) => q.status === 'pending' || q.status === 'review').length} pending review · ${QUEUE.filter((q) => q.status === 'flagged').length} flagged`}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Pending', value: QUEUE.filter(q => q.status === 'pending').length, color: 'text-amber-600 bg-amber-50', icon: AlertCircle },
          { label: 'In Review', value: QUEUE.filter(q => q.status === 'review').length, color: 'text-brand bg-brand-soft', icon: Eye },
          { label: 'Approved Today', value: QUEUE.filter(q => q.status === 'approved').length, color: 'text-emerald bg-emerald-soft', icon: CheckCircle2 },
          { label: 'Flagged', value: QUEUE.filter(q => q.status === 'flagged').length, color: 'text-danger bg-danger-soft', icon: XCircle },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-3 shadow-card sm:p-4">
            <div className={`grid h-8 w-8 place-items-center rounded-lg ${s.color}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">{s.value}</div>
            <div className="text-[11px] text-muted-foreground sm:text-[12px]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Queue */}
      <div className="space-y-3">
        {QUEUE.map((item, i) => {
          const s = STATUS_CFG[item.status];
          const typeIcon = item.type === 'doctor' ? User : item.type === 'hospital' ? Building2 : FileText;
          const TypeIcon = typeIcon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-4 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                    <TypeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-semibold text-foreground">{item.name}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.bg} ${s.color}`}>
                        <s.icon className="h-2.5 w-2.5" /> {s.label}
                      </span>
                      {item.priority === 'high' && (
                        <span className="rounded-full bg-danger-soft px-2 py-0.5 text-[10px] font-semibold text-danger">High Priority</span>
                      )}
                    </div>
                    <div className="text-[12px] text-muted-foreground">{item.specialty}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-[10.5px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" /> Submitted {item.submitted}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11.5px] font-semibold text-foreground hover:bg-muted">
                    <Eye className="h-3 w-3" /> Review
                  </button>
                  {item.status !== 'approved' && (
                    <button className="inline-flex items-center gap-1 rounded-lg bg-emerald px-2.5 py-1.5 text-[11.5px] font-semibold text-white hover:bg-emerald/90">
                      <Stamp className="h-3 w-3" /> Approve
                    </button>
                  )}
                  {item.status !== 'flagged' && (
                    <button className="inline-flex items-center gap-1 rounded-lg bg-danger-soft px-2.5 py-1.5 text-[11.5px] font-semibold text-danger hover:bg-danger/15">
                      <XCircle className="h-3 w-3" /> Flag
                    </button>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {item.docs.map((doc, di) => (
                  <div key={di} className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-2 text-[11.5px]">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-foreground">{doc}</span>
                    <CheckCircle2 className="ml-auto h-3.5 w-3.5 shrink-0 text-emerald" />
                  </div>
                ))}
              </div>

              {item.notes && (
                <div className="mt-3 rounded-lg bg-amber-50/60 px-3 py-2 text-[11.5px] leading-relaxed text-amber-800">
                  <strong>Reviewer note:</strong> {item.notes}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
