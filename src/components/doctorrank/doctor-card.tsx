'use client';

import { motion } from 'framer-motion';
import {
  Star, MapPin, Shield, BadgeCheck, Clock, ArrowRight,
  Sparkles, Quote, Stethoscope,
} from 'lucide-react';
import { rankBand, formatINR } from '@/lib/doctorrank';
import { RankGauge } from './ecg-line';
import { DoctorImage } from './doctor-image';

interface DoctorCardProps {
  doctor: any;
  onOpen: (slug: string) => void;
  compact?: boolean;
  index?: number;
}

export function DoctorCard({ doctor, onOpen, compact = false, index = 0 }: DoctorCardProps) {
  const band = rankBand(doctor.doctorRank);
  const topReview = doctor.reviews?.[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      onClick={() => onOpen(doctor.slug)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:border-brand/30 hover:shadow-hover sm:p-5"
    >
      {doctor.isSponsored && (
        <div className="absolute right-3 top-3 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700 sm:text-[10px]">
          Sponsored
        </div>
      )}

      <div className="flex gap-3 sm:gap-4">
        {/* Photo */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-xl bg-brand/15 blur-md transition-all group-hover:bg-brand/25" />
          <DoctorImage
            src={doctor.photoUrl}
            alt={`${doctor.name} — ${doctor.specialty?.name} specialist`}
            loading="lazy"
            className="relative h-14 w-14 rounded-xl object-cover ring-2 ring-white sm:h-20 sm:w-20"
            width={80}
            height={80}
            fallbackInitial={doctor.name?.[0]}
          />
          {doctor.isVerified && (
            <div className="absolute -bottom-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full bg-card shadow-card sm:h-7 sm:w-7">
              <BadgeCheck className="h-4 w-4 text-brand sm:h-5 sm:w-5" />
            </div>
          )}
        </div>

        {/* Identity */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[14px] font-semibold text-foreground sm:text-base">
                {doctor.name}
              </h3>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground sm:gap-2 sm:text-[12px]">
                <span className="font-medium text-foreground/80">{doctor.specialty?.name}</span>
                <span className="text-border">·</span>
                <span>{doctor.experienceYears} yrs</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground sm:text-[12px]">
                <MapPin className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                <span className="truncate">{doctor.city?.name}</span>
                {doctor.hospital && (
                  <>
                    <span className="text-border">·</span>
                    <span className="truncate hidden sm:inline">{doctor.hospital.name}</span>
                  </>
                )}
              </div>
            </div>

            {/* DoctorRank gauge — circular on desktop, pill on mobile */}
            <div className="hidden shrink-0 sm:block">
              <RankGauge rank={doctor.doctorRank} size={56} />
            </div>
            <div
              className="flex shrink-0 flex-col items-center rounded-lg px-2 py-1 text-center sm:hidden"
              style={{ backgroundColor: band.bg }}
            >
              <span className="text-[8px] font-semibold uppercase tracking-wide" style={{ color: band.color }}>
                Rank
              </span>
              <span className="text-sm font-bold leading-tight" style={{ color: band.color }}>
                {Math.round(doctor.doctorRank)}
              </span>
            </div>
          </div>

          {/* Qualifications — hidden on small mobile */}
          <p className="mt-1.5 hidden line-clamp-1 text-[12px] text-muted-foreground sm:block">
            {doctor.qualifications}
          </p>

          {/* Rating + fee + response */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:mt-3 sm:gap-x-4 sm:text-[12px]">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">
                {(doctor.reviewQuality / 20).toFixed(1)}
              </span>
              <span className="text-muted-foreground">({doctor.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3 text-emerald sm:h-3.5" />
              <span>{Math.round(doctor.responseRate)}%</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="font-semibold text-foreground">{formatINR(doctor.consultationFee)}</span>
            </div>
          </div>

          {/* Conditions treated */}
          {doctor.conditionsTreated?.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1 sm:mt-3 sm:gap-1.5">
              {doctor.conditionsTreated.slice(0, 2).map((c: string, i: number) => (
                <span
                  key={i}
                  className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:px-2 sm:text-[11px]"
                >
                  {c}
                </span>
              ))}
              {doctor.conditionsTreated.length > 2 && (
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:text-[11px]">
                  +{doctor.conditionsTreated.length - 2}
                </span>
              )}
            </div>
          )}

          {!compact && topReview && (
            <div className="mt-2.5 hidden gap-2 rounded-xl bg-muted/40 p-2.5 sm:flex sm:gap-2">
              <Quote className="h-3.5 w-3.5 shrink-0 text-brand/60" />
              <p className="line-clamp-2 text-[11.5px] italic leading-relaxed text-muted-foreground">
                "{topReview.comment}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5 sm:mt-4 sm:pt-3">
        <div className="flex items-center gap-1 text-[10px] font-medium text-emerald sm:text-[11px]">
          <Shield className="h-3 w-3 sm:h-3.5" />
          <span className="truncate">Reg. {doctor.registrationNumber}</span>
        </div>
        <button
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand transition-all group-hover:gap-2 sm:text-[13px]"
          tabIndex={-1}
        >
          View
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.article>
  );
}

export function DoctorCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        <div className="h-14 w-14 rounded-xl shimmer sm:h-20 sm:w-20" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded shimmer" />
          <div className="h-3 w-1/2 rounded shimmer" />
          <div className="h-3 w-3/4 rounded shimmer" />
          <div className="h-8 w-full rounded shimmer" />
        </div>
      </div>
    </div>
  );
}
