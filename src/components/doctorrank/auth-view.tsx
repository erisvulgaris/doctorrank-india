'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartPulse, Mail, Lock, User, Phone, Stethoscope, MapPin,
  BadgeCheck, Loader2, AlertCircle, ArrowLeft, ArrowRight,
  Eye, EyeOff, Sparkles,
} from 'lucide-react';

interface AuthViewProps {
  mode: 'login' | 'signup';
  onNavigate: (view: string, payload?: any) => void;
  onSuccess: (doctor: any) => void;
  specialties: Array<{ id: string; name: string; slug: string }>;
  cities: Array<{ slug: string; name: string }>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthView({ mode, onNavigate, onSuccess, specialties, cities }: AuthViewProps) {
  const isLogin = mode === 'login';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form
  const [signup, setSignup] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialtyId: '',
    cityId: '',
    qualifications: '',
    registrationNumber: '',
  });

  const firstFieldRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const t = setTimeout(() => firstFieldRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [mode]);

  // Reset errors when switching mode
  useEffect(() => {
    setError(null);
    setFieldErrors({});
  }, [mode]);

  // ---- Login submit ----
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!loginEmail.trim()) errors.email = 'Email is required.';
    else if (!EMAIL_REGEX.test(loginEmail.trim())) errors.email = 'Enter a valid email.';
    if (!loginPassword) errors.password = 'Password is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim().toLowerCase(), password: loginPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Login failed. Please try again.');
        if (json.errors) setFieldErrors(json.errors);
        return;
      }
      onSuccess(json.doctor);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ---- Signup submit ----
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!signup.name.trim() || signup.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
    if (!signup.email.trim()) errors.email = 'Email is required.';
    else if (!EMAIL_REGEX.test(signup.email.trim())) errors.email = 'Enter a valid email.';
    if (!signup.password) errors.password = 'Password is required.';
    else if (signup.password.length < 8) errors.password = 'Password must be at least 8 characters.';
    else if (!(/[a-zA-Z]/.test(signup.password) && /[0-9]/.test(signup.password))) errors.password = 'Include at least one letter and one number.';
    if (!signup.phone.trim() || signup.phone.trim().length < 6) errors.phone = 'A valid phone number is required.';
    if (!signup.specialtyId) errors.specialtyId = 'Please choose a specialty.';
    if (!signup.cityId) errors.cityId = 'Please choose a city.';
    if (!signup.qualifications.trim() || signup.qualifications.trim().length < 2) errors.qualifications = 'Qualifications are required.';
    if (!signup.registrationNumber.trim() || signup.registrationNumber.trim().length < 2) errors.registrationNumber = 'Medical registration number is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signup),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Sign up failed. Please try again.');
        if (json.errors) setFieldErrors(json.errors);
        return;
      }
      onSuccess(json.doctor);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-16 lg:pb-0">
      {/* Background flourish */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
        <div className="absolute -top-20 right-10 h-72 w-72 rounded-full bg-emerald/15 blur-[100px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 medical-pattern opacity-50" />

      <div className="relative mx-auto max-w-md px-4 py-8 sm:py-12">
        {/* Back to home */}
        <button
          onClick={() => onNavigate('home')}
          className="mb-6 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-premium sm:p-8"
        >
          {/* Logo + heading */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white shadow-card">
              <HeartPulse className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {isLogin ? 'Welcome back' : 'Join DoctorRank India'}
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {isLogin
                ? 'Sign in to manage your practice and appointments.'
                : 'Create your doctor profile and start receiving appointments.'}
            </p>
          </div>

          {/* Form-level error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div role="alert" className="flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2.5 text-[12.5px] leading-relaxed text-danger">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LOGIN FORM */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-3" noValidate>
              <FormField label="Email" error={fieldErrors.email}>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    ref={firstFieldRef}
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    autoComplete="email"
                    inputMode="email"
                    aria-invalid={!!fieldErrors.email}
                    className={`mt-1 w-full rounded-xl border bg-background py-2.5 pl-10 pr-3 text-[14px] outline-none transition-colors focus:border-brand ${
                      fieldErrors.email ? 'border-danger' : 'border-border'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
              </FormField>

              <FormField label="Password" error={fieldErrors.password}>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                    aria-invalid={!!fieldErrors.password}
                    className={`mt-1 w-full rounded-xl border bg-background py-2.5 pl-10 pr-10 text-[14px] outline-none transition-colors focus:border-brand ${
                      fieldErrors.password ? 'border-danger' : 'border-border'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormField>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-[14px] font-semibold text-white shadow-card transition-all hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignup} className="space-y-3" noValidate>
              <FormField label="Full name" error={fieldErrors.name}>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    ref={firstFieldRef}
                    type="text"
                    value={signup.name}
                    onChange={(e) => setSignup({ ...signup, name: e.target.value })}
                    autoComplete="name"
                    aria-invalid={!!fieldErrors.name}
                    className={`mt-1 w-full rounded-xl border bg-background py-2.5 pl-10 pr-3 text-[14px] outline-none transition-colors focus:border-brand ${
                      fieldErrors.name ? 'border-danger' : 'border-border'
                    }`}
                    placeholder="Dr. Anjali Verma"
                  />
                </div>
              </FormField>

              <FormField label="Email" error={fieldErrors.email}>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={signup.email}
                    onChange={(e) => setSignup({ ...signup, email: e.target.value })}
                    autoComplete="email"
                    inputMode="email"
                    aria-invalid={!!fieldErrors.email}
                    className={`mt-1 w-full rounded-xl border bg-background py-2.5 pl-10 pr-3 text-[14px] outline-none transition-colors focus:border-brand ${
                      fieldErrors.email ? 'border-danger' : 'border-border'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
              </FormField>

              <FormField
                label="Password"
                error={fieldErrors.password}
                hint="At least 8 characters, with a letter and a number."
              >
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signup.password}
                    onChange={(e) => setSignup({ ...signup, password: e.target.value })}
                    autoComplete="new-password"
                    aria-invalid={!!fieldErrors.password}
                    className={`mt-1 w-full rounded-xl border bg-background py-2.5 pl-10 pr-10 text-[14px] outline-none transition-colors focus:border-brand ${
                      fieldErrors.password ? 'border-danger' : 'border-border'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormField>

              <FormField label="Phone" error={fieldErrors.phone}>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    value={signup.phone}
                    onChange={(e) => setSignup({ ...signup, phone: e.target.value })}
                    autoComplete="tel"
                    inputMode="tel"
                    aria-invalid={!!fieldErrors.phone}
                    className={`mt-1 w-full rounded-xl border bg-background py-2.5 pl-10 pr-3 text-[14px] outline-none transition-colors focus:border-brand ${
                      fieldErrors.phone ? 'border-danger' : 'border-border'
                    }`}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </FormField>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField label="Specialty" error={fieldErrors.specialtyId}>
                  <div className="relative">
                    <Stethoscope className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <select
                      value={signup.specialtyId}
                      onChange={(e) => setSignup({ ...signup, specialtyId: e.target.value })}
                      aria-invalid={!!fieldErrors.specialtyId}
                      className={`mt-1 w-full appearance-none rounded-xl border bg-background py-2.5 pl-10 pr-3 text-[14px] outline-none transition-colors focus:border-brand ${
                        fieldErrors.specialtyId ? 'border-danger' : 'border-border'
                      }`}
                    >
                      <option value="">Choose specialty…</option>
                      {specialties.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </FormField>

                <FormField label="City" error={fieldErrors.cityId}>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <select
                      value={signup.cityId}
                      onChange={(e) => setSignup({ ...signup, cityId: e.target.value })}
                      aria-invalid={!!fieldErrors.cityId}
                      className={`mt-1 w-full appearance-none rounded-xl border bg-background py-2.5 pl-10 pr-3 text-[14px] outline-none transition-colors focus:border-brand ${
                        fieldErrors.cityId ? 'border-danger' : 'border-border'
                      }`}
                    >
                      <option value="">Choose city…</option>
                      {cities.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </FormField>
              </div>

              <FormField label="Qualifications" error={fieldErrors.qualifications}>
                <input
                  type="text"
                  value={signup.qualifications}
                  onChange={(e) => setSignup({ ...signup, qualifications: e.target.value })}
                  aria-invalid={!!fieldErrors.qualifications}
                  className={`mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-brand ${
                    fieldErrors.qualifications ? 'border-danger' : 'border-border'
                  }`}
                  placeholder="MBBS, MD (Dermatology)"
                />
              </FormField>

              <FormField label="Medical registration number" error={fieldErrors.registrationNumber}>
                <div className="relative">
                  <BadgeCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={signup.registrationNumber}
                    onChange={(e) => setSignup({ ...signup, registrationNumber: e.target.value })}
                    aria-invalid={!!fieldErrors.registrationNumber}
                    className={`mt-1 w-full rounded-xl border bg-background py-2.5 pl-10 pr-3 text-[14px] outline-none transition-colors focus:border-brand ${
                      fieldErrors.registrationNumber ? 'border-danger' : 'border-border'
                    }`}
                    placeholder="MCI-12345"
                  />
                </div>
              </FormField>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-[14px] font-semibold text-white shadow-card transition-all hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Toggle login / signup */}
          <p className="mt-5 text-center text-[12.5px] text-muted-foreground">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => onNavigate(isLogin ? 'signup' : 'login')}
              className="font-semibold text-brand hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Dev hint */}
          {isLogin && (
            <div className="mt-4 rounded-xl bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Dev hint:</strong> Seeded doctors use email{' '}
              <code className="rounded bg-background px-1 font-mono text-[10.5px]">&lt;slug&gt;@doctorrank.in</code>{' '}
              and password{' '}
              <code className="rounded bg-background px-1 font-mono text-[10.5px]">doctor123</code>.
              Try <code className="rounded bg-background px-1 font-mono text-[10.5px]">dr-vikram-desai@doctorrank.in</code>.
            </div>
          )}
        </motion.div>

        {/* Trust indicators */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Lock className="h-3 w-3 text-brand" /> Encrypted passwords
          </span>
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-emerald" /> Free to join
          </span>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden text-[11.5px] font-medium leading-relaxed text-danger"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && (
        <p className="mt-1 text-[10.5px] text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
