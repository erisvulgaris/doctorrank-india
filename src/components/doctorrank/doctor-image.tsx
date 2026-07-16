'use client';

import { useState } from 'react';
import { Stethoscope } from 'lucide-react';

interface DoctorImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  /** Doctor's initial (first letter of name) shown as fallback. */
  fallbackInitial?: string;
}

/**
 * Doctor image with graceful fallback.
 *
 * - Uses `next/image` semantics but plain <img> for compatibility with
 *   remote URLs (randomuser.me) without next.config domain allow-listing.
 * - On error (e.g. offline, blocked, 404), shows an initials avatar with
 *   a deterministic brand color derived from the alt text.
 * - Re-attempts loading if the `src` changes (e.g. navigating between
 *   doctor profiles).
 */
export function DoctorImage({
  src,
  alt,
  className = '',
  width = 80,
  height = 80,
  loading = 'lazy',
  fallbackInitial,
}: DoctorImageProps) {
  const [errored, setErrored] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  // Reset error state when src changes (navigating to a different doctor).
  // Using the "adjust state during render" pattern recommended by React docs
  // instead of useEffect+setState to avoid cascading renders.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (prevSrc !== src) {
    setPrevSrc(src);
    setErrored(false);
  }

  if (errored) {
    // Deterministic color from alt text hash (stable per doctor)
    const hash = alt.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0);
    const hue = Math.abs(hash) % 360;
    const initial = (fallbackInitial || alt.replace(/^Dr\.?\s*/, '')[0] || 'D').toUpperCase();
    return (
      <div
        className={`relative grid place-items-center overflow-hidden ${className}`}
        style={{
          background: `linear-gradient(135deg, hsl(${hue}, 70%, 96%), hsl(${(hue + 40) % 360}, 70%, 92%))`,
          width,
          height,
        }}
        role="img"
        aria-label={alt}
      >
        <div
          className="grid place-items-center rounded-full font-semibold"
          style={{
            color: `hsl(${hue}, 65%, 40%)`,
            backgroundColor: `hsl(${hue}, 70%, 99%)`,
            width: '70%',
            height: '70%',
            fontSize: width * 0.32,
          }}
        >
          {initial}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      onError={() => setErrored(true)}
      className={className}
    />
  );
}

/**
 * Compact placeholder for when no photo is available at all.
 * Used in admin tables and lists.
 */
export function DoctorAvatarPlaceholder({
  name,
  className = '',
  size = 40,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const hash = name.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0);
  const hue = Math.abs(hash) % 360;
  const initial = (name.replace(/^Dr\.?\s*/, '')[0] || 'D').toUpperCase();
  return (
    <div
      className={`grid place-items-center rounded-lg font-semibold ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        color: `hsl(${hue}, 65%, 40%)`,
        background: `linear-gradient(135deg, hsl(${hue}, 70%, 96%), hsl(${(hue + 40) % 360}, 70%, 92%))`,
      }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
