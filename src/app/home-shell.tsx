'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteHeader } from '@/components/doctorrank/site-header';
import { SiteFooter } from '@/components/doctorrank/site-footer';
import { HomeView } from '@/components/doctorrank/home-view';
import { SearchView } from '@/components/doctorrank/search-view';
import { DoctorView } from '@/components/doctorrank/doctor-view';
import { ConditionView } from '@/components/doctorrank/condition-view';
import { SpecialtyView } from '@/components/doctorrank/specialty-view';
import { HospitalView } from '@/components/doctorrank/hospital-view';
import { ListView } from '@/components/doctorrank/list-view';
import { RankingView } from '@/components/doctorrank/ranking-view';
import { AdminShell } from '@/components/admin/admin-shell';
import { AuthView } from '@/components/doctorrank/auth-view';
import { DoctorDashboardView } from '@/components/doctorrank/doctor-dashboard-view';

interface HomeShellProps {
  cities: Array<{ slug: string; name: string }>;
  specialties: any[];
  conditions: any[];
  hospitals: any[];
  topDoctors: any[];
  stats: { doctors: number; cities: number; specialties: number; hospitals: number };
  initialDoctor: any | null;
  specialtiesForSignup: Array<{ id: string; name: string; slug: string }>;
  citiesForSignup: Array<{ slug: string; name: string }>;
}

type ViewState =
  | { view: 'home' }
  | { view: 'search'; q: string }
  | { view: 'doctor'; slug: string }
  | { view: 'condition'; slug: string }
  | { view: 'specialty'; slug: string }
  | { view: 'hospital'; slug: string }
  | { view: 'specialties' }
  | { view: 'conditions' }
  | { view: 'hospitals' }
  | { view: 'ranking' }
  | { view: 'admin'; section: string }
  | { view: 'login' }
  | { view: 'signup' }
  | { view: 'dashboard' };

function HomeShellInner(props: HomeShellProps) {
  const router = useRouter();
  const sp = useSearchParams();
  const [city, setCity] = useState<string>('');

  const getInitialView = (): ViewState => {
    const view = sp.get('view') || 'home';
    switch (view) {
      case 'search':     return { view: 'search', q: sp.get('q') || '' };
      case 'doctor':     return { view: 'doctor', slug: sp.get('slug') || '' };
      case 'condition':  return { view: 'condition', slug: sp.get('slug') || '' };
      case 'specialty':  return { view: 'specialty', slug: sp.get('slug') || '' };
      case 'hospital':   return { view: 'hospital', slug: sp.get('slug') || '' };
      case 'specialties':return { view: 'specialties' };
      case 'conditions': return { view: 'conditions' };
      case 'hospitals':  return { view: 'hospitals' };
      case 'ranking':    return { view: 'ranking' };
      case 'admin':      return { view: 'admin', section: sp.get('section') || 'dashboard' };
      case 'login':      return { view: 'login' };
      case 'signup':     return { view: 'signup' };
      case 'dashboard':  return { view: 'dashboard' };
      default:           return { view: 'home' };
    }
  };

  const [state, setState] = useState<ViewState>(getInitialView);
  // Auth state — initialised from the server, then kept in sync client-side
  const [doctor, setDoctor] = useState<any | null>(props.initialDoctor);

  const updateUrl = useCallback((next: ViewState) => {
    const params = new URLSearchParams();
    if (next.view !== 'home') params.set('view', next.view);
    if (next.view === 'search') params.set('q', next.q);
    if (['doctor','condition','specialty','hospital'].includes(next.view)) {
      params.set('slug', (next as any).slug);
    }
    if (next.view === 'admin') params.set('section', next.section);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '/', { scroll: false });
  }, [router]);

  const navigate = useCallback((view: string, payload?: any) => {
    let next: ViewState;
    switch (view) {
      case 'home':        next = { view: 'home' }; break;
      case 'search':      next = { view: 'search', q: payload?.q || '' }; break;
      case 'doctor':      next = { view: 'doctor', slug: payload?.slug || '' }; break;
      case 'condition':   next = { view: 'condition', slug: payload?.slug || '' }; break;
      case 'specialty':   next = { view: 'specialty', slug: payload?.slug || '' }; break;
      case 'hospital':    next = { view: 'hospital', slug: payload?.slug || '' }; break;
      case 'specialties': next = { view: 'specialties' }; break;
      case 'conditions':  next = { view: 'conditions' }; break;
      case 'hospitals':   next = { view: 'hospitals' }; break;
      case 'ranking':     next = { view: 'ranking' }; break;
      case 'admin':       next = { view: 'admin', section: payload?.section || 'dashboard' }; break;
      case 'login':       next = { view: 'login' }; break;
      case 'signup':      next = { view: 'signup' }; break;
      case 'dashboard':   next = { view: 'dashboard' }; break;
      default:            next = { view: 'home' };
    }
    setState(next);
    updateUrl(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateUrl]);

  // Auth handlers — update local state + URL
  const handleAuthSuccess = useCallback((newDoctor: any) => {
    setDoctor(newDoctor);
    navigate('dashboard');
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore — cookie will be cleared by the server if reachable
    }
    setDoctor(null);
    navigate('home');
  }, [navigate]);

  const handleSearch = useCallback((q: string) => {
    navigate('search', { q });
  }, [navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't trigger when modifier keys are pressed (Cmd/Ctrl/Alt/Meta),
      // or when the user is typing in an input/textarea/select/contenteditable.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (document.activeElement?.tagName || '').toUpperCase();
      const isEditable =
        tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
        (document.activeElement as HTMLElement | null)?.isContentEditable === true;
      if (e.key === '/' && !isEditable) {
        e.preventDefault();
        navigate('search');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const findSpecialty = (slug: string) => props.specialties.find((s) => s.slug === slug);
  const findCondition = (slug: string) => props.conditions.find((c) => c.slug === slug);
  const findHospital  = (slug: string) => props.hospitals.find((h) => h.slug === slug);

  // Admin mode renders full-screen, no public header/footer
  if (state.view === 'admin') {
    return (
      <AdminShell
        section={state.section}
        onNavigate={navigate}
        bootstrap={props}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip-to-content link for keyboard / screen-reader users */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <SiteHeader
        onNavigate={navigate}
        currentView={state.view}
        doctor={doctor}
        onLogout={handleLogout}
      />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={state.view + (state.view === 'search' ? state.q : '') + (['doctor','condition','specialty','hospital'].includes(state.view) ? (state as any).slug : '')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {state.view === 'home' && (
              <HomeView
                onNavigate={navigate}
                onSearch={handleSearch}
                cities={props.cities}
                city={city}
                onCityChange={setCity}
                topDoctors={props.topDoctors}
                specialties={props.specialties}
                conditions={props.conditions}
                stats={props.stats}
              />
            )}

            {state.view === 'search' && (
              <SearchView
                initialQuery={state.q}
                onNavigate={navigate}
                onSearch={handleSearch}
                cities={props.cities}
                city={city}
                onCityChange={setCity}
              />
            )}

            {state.view === 'doctor' && (
              <DoctorView slug={state.slug} onNavigate={navigate} onBack={() => navigate('search')} />
            )}

            {state.view === 'condition' && (
              <ConditionView condition={findCondition(state.slug)} onNavigate={navigate} onSearch={handleSearch} />
            )}

            {state.view === 'specialty' && (
              <SpecialtyView specialty={findSpecialty(state.slug)} onNavigate={navigate} onSearch={handleSearch} />
            )}

            {state.view === 'hospital' && (
              <HospitalView hospital={findHospital(state.slug)} onNavigate={navigate} />
            )}

            {state.view === 'specialties' && (
              <ListView kind="specialties" items={props.specialties} onNavigate={navigate} onSearch={handleSearch} />
            )}

            {state.view === 'conditions' && (
              <ListView kind="conditions" items={props.conditions} onNavigate={navigate} onSearch={handleSearch} />
            )}

            {state.view === 'hospitals' && (
              <ListView kind="hospitals" items={props.hospitals} onNavigate={navigate} onSearch={handleSearch} />
            )}

            {state.view === 'ranking' && (
              <RankingView onNavigate={navigate} />
            )}

            {(state.view === 'login' || state.view === 'signup') && (
              <AuthView
                mode={state.view}
                onNavigate={navigate}
                onSuccess={handleAuthSuccess}
                specialties={props.specialtiesForSignup}
                cities={props.citiesForSignup}
              />
            )}

            {state.view === 'dashboard' && (
              <DoctorDashboardView
                doctor={doctor}
                onNavigate={navigate}
                onLogout={handleLogout}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <SiteFooter onNavigate={navigate} />
    </div>
  );
}

export function HomeShell(props: HomeShellProps) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <HomeShellInner {...props} />
    </Suspense>
  );
}
