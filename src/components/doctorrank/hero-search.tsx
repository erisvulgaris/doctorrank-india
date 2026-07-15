'use client';

import { useEffect, useState } from 'react';
import { Search, Sparkles, Mic, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSearchProps {
  initialValue?: string;
  onSearch: (q: string) => void;
  onSuggestionClick?: (type: string, value: string) => void;
  city?: string;
  onCityChange?: (city: string) => void;
  cities?: Array<{ slug: string; name: string }>;
  compact?: boolean;
}

const PLACEHOLDERS = [
  'Search Hair Fall Doctor…',
  'Search Gall Bladder Surgeon…',
  'Search Dentist…',
  'Search Skin Specialist…',
  'Search IVF Specialist…',
  'Search Knee Replacement Surgeon…',
  'Search Cardiologist…',
  'Search Psychiatrist…',
  'Search Migraine Specialist…',
];

export function HeroSearch({
  initialValue = '',
  onSearch,
  onSuggestionClick,
  city,
  onCityChange,
  cities = [],
  compact = false,
}: HeroSearchProps) {
  const [value, setValue] = useState(initialValue);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<any>>([]);
  const [loadingSug, setLoadingSug] = useState(false);
  const [listening, setListening] = useState(false);

  // Rotate placeholder
  useEffect(() => {
    if (value || focused) return;
    const t = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 2400);
    return () => clearInterval(t);
  }, [value, focused]);

  // Fetch suggestions (debounced)
  useEffect(() => {
    if (!value || value.length < 1) {
      setSuggestions([]);
      return;
    }
    setLoadingSug(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(value)}`);
        const json = await res.json();
        setSuggestions(json.suggestions || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSug(false);
      }
    }, 140);
    return () => clearTimeout(t);
  }, [value]);

  const submit = (q?: string) => {
    const query = (q ?? value).trim();
    onSearch(query);
    setFocused(false);
  };

  const handleVoice = () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) {
      alert('Voice search is not supported in this browser. Please try Chrome.');
      return;
    }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setListening(true);
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setValue(transcript);
      setListening(false);
      submit(transcript);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  };

  return (
    <div className={`relative w-full ${compact ? '' : 'max-w-2xl mx-auto'}`}>
      <div
        className={`relative flex items-center gap-2 rounded-2xl border bg-card p-2 shadow-premium transition-all ${
          focused ? 'border-brand/60 ring-4 ring-brand/10' : 'border-border'
        }`}
      >
        {cities.length > 0 && (
          <select
            value={city || ''}
            onChange={(e) => onCityChange?.(e.target.value)}
            className="hidden h-10 shrink-0 rounded-xl border-0 bg-muted/60 px-3 text-[13px] font-medium text-foreground outline-none sm:block"
            aria-label="Select city"
          >
            <option value="">All India</option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        <div className="relative flex flex-1 items-center gap-2 px-2">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="relative flex-1">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 120)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
                if (e.key === 'Escape') setFocused(false);
              }}
              placeholder=""
              aria-label="Search doctors, conditions, or symptoms"
              className="w-full bg-transparent py-2.5 text-[15px] font-medium text-foreground outline-none placeholder:text-muted-foreground/0"
            />
            {!value && !focused && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={placeholderIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="text-[15px] font-medium text-muted-foreground"
                  >
                    {PLACEHOLDERS[placeholderIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
            {value && (
              <button
                onClick={() => setValue('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            onClick={handleVoice}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors ${
              listening ? 'bg-red-50 text-red-600' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            aria-label="Voice search"
            title="Voice search"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => submit()}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-brand px-4 text-[14px] font-semibold text-white shadow-card transition-all hover:bg-brand/90 hover:shadow-hover sm:px-5"
        >
          <span>Search</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {focused && (suggestions.length > 0 || loadingSug) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-border bg-popover shadow-premium"
          >
            <div className="max-h-[420px] overflow-y-auto scroll-thin py-2">
              {loadingSug && (
                <div className="px-4 py-3 text-[13px] text-muted-foreground">Searching…</div>
              )}
              {!loadingSug && suggestions.map((s, i) => (
                <button
                  key={i}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (s.href && onSuggestionClick) {
                      const [type, val] = s.href.split(':');
                      onSuggestionClick(type, val);
                    } else {
                      submit(s.label);
                    }
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent"
                >
                  <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                    s.type === 'doctor' ? 'bg-brand-soft text-brand' :
                    s.type === 'specialty' ? 'bg-emerald-soft text-emerald' :
                    s.type === 'condition' ? 'bg-cyan text-brand' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {s.type === 'doctor' ? <Sparkles className="h-4 w-4" /> :
                     s.type === 'specialty' ? <Sparkles className="h-4 w-4" /> :
                     s.type === 'condition' ? <Search className="h-4 w-4" /> :
                     <Search className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-foreground">{s.label}</div>
                    {s.sub && (
                      <div className="truncate text-[11px] text-muted-foreground">{s.sub}</div>
                    )}
                  </div>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {s.type}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
