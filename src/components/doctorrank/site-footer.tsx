'use client';

import { HeartPulse, Twitter, Linkedin, Youtube } from 'lucide-react';

export function SiteFooter({ onNavigate }: { onNavigate: (v: string, payload?: any) => void }) {
  return (
    <footer className="mt-auto border-t border-border bg-card pb-20 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-card">
                <HeartPulse className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-[15px] font-semibold tracking-tight">DoctorRank India</div>
                <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">AI-Powered Discovery</div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-[12.5px] leading-relaxed text-muted-foreground">
              Transparent, AI-powered doctor discovery. We don&apos;t say &ldquo;best&rdquo; — we show why someone ranks highly.
            </p>
            <div className="mt-4 flex gap-2">
              {[Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wide text-foreground">Discover</div>
            <ul className="mt-3 space-y-2 text-[12.5px] text-muted-foreground">
              <li><button onClick={() => onNavigate('search')} className="hover:text-brand">Find doctors</button></li>
              <li><button onClick={() => onNavigate('specialties')} className="hover:text-brand">Specialties</button></li>
              <li><button onClick={() => onNavigate('conditions')} className="hover:text-brand">Conditions</button></li>
              <li><button onClick={() => onNavigate('hospitals')} className="hover:text-brand">Hospitals</button></li>
              <li><button onClick={() => onNavigate('ranking')} className="hover:text-brand">How ranking works</button></li>
            </ul>
          </div>

          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wide text-foreground">For doctors</div>
            <ul className="mt-3 space-y-2 text-[12.5px] text-muted-foreground">
              <li><a href="#" className="hover:text-brand">Claim your profile</a></li>
              <li><a href="#" className="hover:text-brand">Doctor dashboard</a></li>
              <li><a href="#" className="hover:text-brand">Subscription plans</a></li>
              <li><a href="#" className="hover:text-brand">Analytics & SEO</a></li>
            </ul>
          </div>

          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wide text-foreground">Company</div>
            <ul className="mt-3 space-y-2 text-[12.5px] text-muted-foreground">
              <li><a href="#" className="hover:text-brand">About</a></li>
              <li><a href="#" className="hover:text-brand">Careers</a></li>
              <li><a href="#" className="hover:text-brand">Privacy</a></li>
              <li><a href="#" className="hover:text-brand">Terms</a></li>
              <li><a href="#" className="hover:text-brand">Medical disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-[11.5px] text-muted-foreground">
            © 2026 DoctorRank India. Informational only — not medical advice. In an emergency, call 112.
          </p>
          <p className="text-[11.5px] text-muted-foreground">
            Built with care in India · WCAG AA compliant
          </p>
        </div>
      </div>
    </footer>
  );
}
