'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal, X, Map as MapIcon, List, Star, Clock,
  Languages, Wallet, Shield, ArrowUpDown, Sparkles, Brain, Loader2,
  ChevronDown, CheckCircle2,
} from 'lucide-react';
import { HeroSearch } from './hero-search';
import { DoctorCard, DoctorCardSkeleton } from './doctor-card';
import { StylizedMap } from './stylized-map';
import { formatINR } from '@/lib/doctorrank';

interface SearchViewProps {
  initialQuery: string;
  onNavigate: (view: string, payload?: any) => void;
  onSearch: (q: string) => void;
  cities: Array<{ slug: string; name: string }>;
  city: string;
  onCityChange: (c: string) => void;
}

interface SearchResult {
  doctors: any[];
  specialties: any[];
  conditions: any[];
  hospitals: any[];
  count: number;
}

const SORT_OPTIONS = [
  { value: 'rank', label: 'DoctorRank (highest)' },
  { value: 'experience', label: 'Experience (most)' },
  { value: 'fee-low', label: 'Fee (low to high)' },
  { value: 'fee-high', label: 'Fee (high to low)' },
  { value: 'rating', label: 'Rating (highest)' },
];

export function SearchView({
  initialQuery, onNavigate, onSearch, cities, city, onCityChange,
}: SearchViewProps) {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false); // hidden by default on mobile
  const [sort, setSort] = useState('rank');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();
  const [feeRange, setFeeRange] = useState<[number, number]>([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [minExp, setMinExp] = useState(0);
  const [aiMode, setAiMode] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setAiMode(false);
    setAiResult(null);

    const run = async () => {
      try {
        const params = new URLSearchParams();
        if (initialQuery) params.set('q', initialQuery);
        if (city) params.set('city', city);
        const res = await fetch(`/api/search?${params.toString()}`);
        const json = await res.json();
        if (!cancelled) {
          setResults(json);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [initialQuery, city]);

  const runAi = async () => {
    setAiLoading(true);
    setAiMode(true);
    try {
      const res = await fetch('/api/ai-symptom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: initialQuery, city }),
      });
      const json = await res.json();
      setAiResult(json);
      if (json.doctors) {
        setResults({ doctors: json.doctors, specialties: [], conditions: [], hospitals: [], count: json.doctors.length });
      }
    } finally {
      setAiLoading(false);
    }
  };

  const visibleDoctors = (() => {
    if (!results?.doctors) return [];
    let arr = results.doctors.filter((d) => {
      if (d.consultationFee < feeRange[0] || d.consultationFee > feeRange[1]) return false;
      if (d.reviewQuality / 20 < minRating) return false;
      if (d.experienceYears < minExp) return false;
      return true;
    });
    switch (sort) {
      case 'experience': arr = [...arr].sort((a, b) => b.experienceYears - a.experienceYears); break;
      case 'fee-low':    arr = [...arr].sort((a, b) => a.consultationFee - b.consultationFee); break;
      case 'fee-high':   arr = [...arr].sort((a, b) => b.consultationFee - a.consultationFee); break;
      case 'rating':     arr = [...arr].sort((a, b) => b.reviewQuality - a.reviewQuality); break;
      default:           arr = [...arr].sort((a, b) => b.doctorRank - a.doctorRank);
    }
    return arr;
  })();

  const mapPoints = visibleDoctors.map((d) => ({
    id: d.id, type: 'doctor' as const,
    name: d.name, lat: d.lat, lng: d.lng,
    sub: `${d.specialty?.name} · ${d.city?.name}`,
    eta: `${Math.floor(Math.random() * 25) + 5} min`,
  }));

  if (results?.hospitals) {
    for (const h of results.hospitals.slice(0, 3)) {
      mapPoints.push({
        id: h.id, type: 'hospital',
        name: h.name, lat: h.lat, lng: h.lng,
        sub: h.city?.name, eta: `${Math.floor(Math.random() * 30) + 10} min`,
      });
    }
  }

  const mapCenter = visibleDoctors[0]
    ? { lat: visibleDoctors[0].lat, lng: visibleDoctors[0].lng }
    : { lat: 19.0760, lng: 72.8777 };

  return (
    <div className="min-h-screen pb-16 lg:pb-0">
      {/* Search bar */}
      <div className="sticky top-14 z-30 border-b border-border bg-background/80 backdrop-blur sm:top-16">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="min-w-0 flex-1">
              <HeroSearch
                initialValue={initialQuery}
                onSearch={onSearch}
                onSuggestionClick={(type, val) => {
                  if (type === 'doctor') onNavigate('doctor', { slug: val });
                  else if (type === 'condition') onNavigate('condition', { slug: val });
                  else if (type === 'specialty') onNavigate('specialty', { slug: val });
                }}
                cities={cities}
                city={city}
                onCityChange={onCityChange}
                compact
              />
            </div>
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[12px] font-medium transition-colors sm:text-[13px] ${
                showFilters ? 'border-brand bg-brand-soft text-brand' : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button
              onClick={() => setShowMap((s) => !s)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[12px] font-medium transition-colors sm:text-[13px] ${
                showMap ? 'border-brand bg-brand-soft text-brand' : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {showMap ? <List className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
              <span className="hidden sm:inline">{showMap ? 'List' : 'Map'}</span>
            </button>
          </div>

          {/* Filter bar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 grid grid-cols-2 gap-2.5 rounded-xl border border-border bg-card p-3 sm:grid-cols-4 sm:gap-3 sm:p-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[11px]">Sort by</label>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-[12px] outline-none focus:border-brand sm:text-[13px]"
                    >
                      {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[11px]">
                      Fee: {formatINR(feeRange[1])} max
                    </label>
                    <input
                      type="range" min={0} max={5000} step={500}
                      value={feeRange[1]}
                      onChange={(e) => setFeeRange([feeRange[0], Number(e.target.value)])}
                      className="mt-3 w-full accent-brand"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[11px]">Min rating</label>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-[12px] outline-none focus:border-brand sm:text-[13px]"
                    >
                      <option value={0}>Any rating</option>
                      <option value={3}>3.0+</option>
                      <option value={4}>4.0+</option>
                      <option value={4.5}>4.5+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[11px]">Min experience</label>
                    <select
                      value={minExp}
                      onChange={(e) => setMinExp(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-[12px] outline-none focus:border-brand sm:text-[13px]"
                    >
                      <option value={0}>Any</option>
                      <option value={5}>5+ years</option>
                      <option value={10}>10+ years</option>
                      <option value={15}>15+ years</option>
                      <option value={20}>20+ years</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* AI banner */}
        {!aiMode && initialQuery && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand/20 bg-gradient-to-r from-brand-soft via-card to-emerald-soft p-3 sm:p-4"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand text-white">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-foreground">
                  Try AI Symptom Navigator
                </div>
                <div className="text-[11.5px] text-muted-foreground sm:text-[12px]">
                  Convert &ldquo;{initialQuery}&rdquo; into matched specialties, conditions, and doctors — with reasoning.
                </div>
              </div>
            </div>
            <button
              onClick={runAi}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-[12px] font-semibold text-white shadow-card hover:bg-brand/90"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Run AI
            </button>
          </motion.div>
        )}

        {/* AI result panel */}
        <AnimatePresence>
          {aiMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              {aiLoading ? (
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
                  <Loader2 className="h-5 w-5 animate-spin text-brand" />
                  <div>
                    <div className="text-[14px] font-semibold text-foreground">Analyzing symptoms…</div>
                    <div className="text-[12px] text-muted-foreground">Matching against medical knowledge base.</div>
                  </div>
                </div>
              ) : aiResult && (
                <div className="rounded-2xl border border-brand/30 bg-card p-4 shadow-premium sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
                        <Brain className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-foreground">AI Symptom Analysis</div>
                        <div className="text-[11px] text-muted-foreground">Reasoning trail</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setAiMode(false)}
                      className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {aiResult.matches?.map((m: any, i: number) => (
                    <div key={i} className="mt-3 rounded-xl bg-muted/40 p-3 sm:mt-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[13px] font-semibold text-foreground">
                          {m.specialty} {m.condition && <span className="text-muted-foreground">· {m.condition}</span>}
                        </div>
                        <span className="shrink-0 rounded-full bg-emerald-soft px-2 py-0.5 text-[10px] font-semibold text-emerald">
                          {Math.round(m.confidence * 100)}% match
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{m.reason}</p>
                    </div>
                  ))}

                  {aiResult.disclaimer && (
                    <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[10.5px] leading-relaxed text-amber-800 sm:text-[11px]">
                      {aiResult.disclaimer}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result header */}
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3 sm:mb-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-2xl">
              {initialQuery ? (
                <>Results for <span className="text-brand">&ldquo;{initialQuery}&rdquo;</span></>
              ) : (
                <>All verified doctors</>
              )}
            </h1>
            <p
              className="mt-0.5 text-[12px] text-muted-foreground sm:text-[13px]"
              role="status"
              aria-live="polite"
              aria-busy={loading}
            >
              {loading ? 'Searching…' : `${visibleDoctors.length} ${visibleDoctors.length === 1 ? 'doctor' : 'doctors'} found`}
              {city && ` in ${cities.find(c => c.slug === city)?.name || city}`}
            </p>
          </div>
        </div>

        {/* Related entities */}
        {!loading && results && (results.conditions.length > 0 || results.specialties.length > 0 || results.hospitals.length > 0) && (
          <div className="mb-5 space-y-2 sm:mb-6 sm:space-y-3">
            {results.conditions.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[11px]">Conditions:</span>
                {results.conditions.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onNavigate('condition', { slug: c.slug })}
                    className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand sm:text-[12px]"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
            {results.specialties.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[11px]">Specialties:</span>
                {results.specialties.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onNavigate('specialty', { slug: s.slug })}
                    className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand sm:text-[12px]"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
            {results.hospitals.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[11px]">Hospitals:</span>
                {results.hospitals.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => onNavigate('hospital', { slug: h.slug })}
                    className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand sm:text-[12px]"
                  >
                    {h.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Split layout — mobile stacks, desktop side-by-side when map is on */}
        <div className={`grid gap-4 lg:gap-6 ${showMap ? 'lg:grid-cols-[1fr_440px]' : 'grid-cols-1'}`}>
          <div className="space-y-3 sm:space-y-4">
            {/* Mobile map preview when toggled on */}
            {showMap && (
              <div className="h-64 overflow-hidden rounded-2xl border border-border lg:hidden">
                <StylizedMap
                  points={mapPoints}
                  center={mapCenter}
                  selectedId={selectedDoctorId}
                  onPointClick={(id) => {
                    setSelectedDoctorId(id);
                    document.getElementById(`doctor-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="!rounded-2xl"
                />
              </div>
            )}

            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => <DoctorCardSkeleton key={i} />)}
              </>
            ) : visibleDoctors.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card sm:p-12">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <h3 className="text-[15px] font-semibold text-foreground">No doctors match these filters</h3>
                <p className="mt-1 text-[13px] text-muted-foreground">Try widening fee range or lowering minimum rating.</p>
              </div>
            ) : (
              visibleDoctors.map((d, i) => (
                <div key={d.id} id={`doctor-${d.id}`}>
                  <DoctorCard
                    doctor={d}
                    onOpen={(slug) => onNavigate('doctor', { slug })}
                    index={i}
                  />
                </div>
              ))
            )}
          </div>

          {/* Desktop sticky map */}
          {showMap && (
            <div className="hidden lg:sticky lg:top-32 lg:block lg:h-[calc(100vh-160px)]">
              <StylizedMap
                points={mapPoints}
                center={mapCenter}
                selectedId={selectedDoctorId}
                onPointClick={(id) => {
                  setSelectedDoctorId(id);
                  document.getElementById(`doctor-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
