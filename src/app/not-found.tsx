import Link from 'next/link';
import { HeartPulse, Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-16">
      {/* Background flourish */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
        <div className="absolute -top-20 right-10 h-72 w-72 rounded-full bg-emerald/15 blur-[100px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 medical-pattern opacity-50" />

      <div className="relative w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8 inline-flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-card">
            <HeartPulse className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-foreground">DoctorRank</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">India</span>
          </div>
        </div>

        {/* 404 visual */}
        <div className="relative mb-6">
          <div className="bg-gradient-to-br from-brand via-[#3B82F6] to-emerald bg-clip-text text-[120px] font-bold leading-none tracking-tight text-transparent sm:text-[160px]">
            404
          </div>
          <div className="absolute inset-x-0 -bottom-2 mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        </div>

        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-balance text-[14px] leading-relaxed text-muted-foreground">
          The page you&apos;re looking for may have been moved, deleted, or never existed.
          Let&apos;s get you back to finding the right doctor.
        </p>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-card transition-all hover:bg-brand/90 hover:shadow-hover"
          >
            <Home className="h-4 w-4" />
            Back to home
          </a>
          <a
            href="/?view=search"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-5 py-2.5 text-[13px] font-semibold text-foreground shadow-card transition-all hover:border-brand/40 hover:shadow-hover"
          >
            <Search className="h-4 w-4" />
            Search doctors
          </a>
        </div>

        <p className="mt-8 text-[11.5px] text-muted-foreground">
          If you believe this is an error, please contact{' '}
          <a href="mailto:support@doctorrank.in" className="font-medium text-brand hover:underline">
            support@doctorrank.in
          </a>
        </p>
      </div>
    </div>
  );
}
