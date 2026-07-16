'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home, Bug } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to the console for debugging
    // In production, this would also send to an error tracking service
    console.error('DoctorRank application error:', error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-danger/10 blur-[120px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 medical-pattern opacity-40" />

      <div className="relative w-full max-w-md text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-danger-soft text-danger">
          <AlertCircle className="h-8 w-8" />
        </div>

        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-balance text-[14px] leading-relaxed text-muted-foreground">
          An unexpected error occurred while loading this page. Our team has been notified.
          You can try again, or return to the home page.
        </p>

        {error?.message && (
          <details className="mt-5 rounded-xl border border-border bg-muted/40 p-3 text-left">
            <summary className="flex cursor-pointer items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground">
              <Bug className="h-3.5 w-3.5" />
              Technical details
            </summary>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-background p-2 font-mono text-[11px] leading-relaxed text-foreground/80">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-card transition-all hover:bg-brand/90 hover:shadow-hover"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-5 py-2.5 text-[13px] font-semibold text-foreground shadow-card transition-all hover:border-brand/40 hover:shadow-hover"
          >
            <Home className="h-4 w-4" />
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
