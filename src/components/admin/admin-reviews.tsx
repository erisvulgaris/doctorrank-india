'use client';

import { motion } from 'framer-motion';
import {
  Star, AlertCircle, Flag, CheckCircle2, XCircle, ThumbsUp,
  Sparkles, Filter,
} from 'lucide-react';
import { SectionHeader, ChartCard } from './ui/chart-card';

const REVIEWS = [
  { id: 'R1', patient: 'Rohit Sharma', doctor: 'Dr. Vikram Desai', rating: 5, procedure: 'Hair Fall', text: 'Excellent doctor. Took time to explain everything clearly. Highly recommend.', status: 'pending', verified: true, helpful: 12, hasMedia: false, aiScore: 0.92 },
  { id: 'R2', patient: 'Anonymous User', doctor: 'Dr. Anil Joshi', rating: 5, procedure: 'Joint Pain', text: 'BEST DOCTOR IN INDIA!!! MUST VISIT!!! CHEAPEST RATES!!! CLICK HERE!!!', status: 'spam', verified: false, helpful: 0, hasMedia: false, aiScore: 0.08 },
  { id: 'R3', patient: 'Anita Kumar', doctor: 'Dr. Asha Hegde', rating: 4, procedure: 'Gall Bladder Stone', text: 'Good experience overall. Clinic was clean and staff courteous.', status: 'pending', verified: true, helpful: 8, hasMedia: true, aiScore: 0.88 },
  { id: 'R4', patient: 'Imran P.', doctor: 'Dr. Nihar Ranjan', rating: 5, procedure: 'Diabetes', text: 'Knowledgeable and humble. Will definitely consult again if needed.', status: 'approved', verified: true, helpful: 24, hasMedia: false, aiScore: 0.95 },
  { id: 'R5', patient: 'Disgruntled User', doctor: 'Dr. Sanjay Gupta', rating: 1, procedure: 'Knee Replacement', text: 'Worst doctor ever. Do not visit. Waste of money and time.', status: 'reported', verified: false, helpful: 2, hasMedia: false, aiScore: 0.42 },
  { id: 'R6', patient: 'Sneha Reddy', doctor: 'Dr. Ananya Reddy', rating: 5, procedure: 'Acne', text: 'Great diagnosis and follow-up. The whole process was smooth.', status: 'approved', verified: true, helpful: 18, hasMedia: true, aiScore: 0.91 },
];

const STATUS_CFG: Record<string, { color: string; bg: string; icon: any; label: string }> = {
  pending:  { color: 'text-amber-700', bg: 'bg-amber-50',    icon: AlertCircle,    label: 'Pending' },
  approved: { color: 'text-emerald',   bg: 'bg-emerald-soft', icon: CheckCircle2,  label: 'Approved' },
  spam:     { color: 'text-danger',    bg: 'bg-danger-soft',  icon: XCircle,       label: 'Spam' },
  reported: { color: 'text-danger',    bg: 'bg-danger-soft',  icon: Flag,          label: 'Reported' },
};

export function AdminReviews() {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Reviews Moderation"
        subtitle={`${REVIEWS.filter(r => r.status === 'pending').length} pending · ${REVIEWS.filter(r => r.status === 'spam').length} spam detected · AI-assisted`}
      />

      {/* AI moderation banner */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand/20 bg-gradient-to-r from-brand-soft via-card to-emerald-soft p-4"
      >
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-foreground">AI Moderation Active</div>
            <div className="text-[12px] text-muted-foreground">Auto-flagging spam, fraud, and policy violations with 94% accuracy. Manual review for edge cases.</div>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 text-[12px] font-semibold text-foreground shadow-card hover:bg-muted">
          <Filter className="h-3.5 w-3.5" /> Configure
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Pending', value: REVIEWS.filter(r => r.status === 'pending').length, color: 'text-amber-600 bg-amber-50', icon: AlertCircle },
          { label: 'Approved', value: REVIEWS.filter(r => r.status === 'approved').length, color: 'text-emerald bg-emerald-soft', icon: CheckCircle2 },
          { label: 'Spam Detected', value: REVIEWS.filter(r => r.status === 'spam').length, color: 'text-danger bg-danger-soft', icon: XCircle },
          { label: 'Reported', value: REVIEWS.filter(r => r.status === 'reported').length, color: 'text-danger bg-danger-soft', icon: Flag },
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

      {/* Reviews list */}
      <div className="space-y-3">
        {REVIEWS.map((r, i) => {
          const s = STATUS_CFG[r.status];
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-border bg-card p-4 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-[13px] font-semibold text-brand">
                    {r.patient[0]}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold text-foreground">{r.patient}</span>
                      {r.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-soft px-2 py-0.5 text-[10px] font-semibold text-emerald">
                          <CheckCircle2 className="h-2.5 w-2.5" /> Verified Patient
                        </span>
                      )}
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.bg} ${s.color}`}>
                        <s.icon className="h-2.5 w-2.5" /> {s.label}
                      </span>
                    </div>
                    <div className="text-[11.5px] text-muted-foreground">on {r.doctor} · {r.procedure}</div>
                    <div className="mt-1 flex items-center gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className={`h-3 w-3 ${star <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                {/* AI confidence */}
                <div className="text-right">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">AI Score</div>
                  <div className={`text-[14px] font-bold ${r.aiScore >= 0.8 ? 'text-emerald' : r.aiScore >= 0.5 ? 'text-amber-600' : 'text-danger'}`}>
                    {Math.round(r.aiScore * 100)}%
                  </div>
                </div>
              </div>

              <p className="mt-3 rounded-xl bg-muted/40 p-3 text-[13px] leading-relaxed text-foreground/90">
                &ldquo;{r.text}&rdquo;
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {r.helpful} found helpful</span>
                  {r.hasMedia && <span className="inline-flex items-center gap-1 text-violet-600">📷 Has media</span>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button className="inline-flex items-center gap-1 rounded-lg bg-emerald px-2.5 py-1.5 text-[11.5px] font-semibold text-white hover:bg-emerald/90">
                    <CheckCircle2 className="h-3 w-3" /> Approve
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg bg-danger-soft px-2.5 py-1.5 text-[11.5px] font-semibold text-danger hover:bg-danger/15">
                    <XCircle className="h-3 w-3" /> Reject
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11.5px] font-semibold text-foreground hover:bg-muted">
                    <Flag className="h-3 w-3" /> Flag
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
