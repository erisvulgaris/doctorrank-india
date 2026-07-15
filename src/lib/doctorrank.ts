// DoctorRank India — shared utilities

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n);
}

export function rankBand(rank: number): { label: string; color: string; bg: string } {
  if (rank >= 90) return { label: 'Exceptional', color: '#047857', bg: '#E7F8F1' };
  if (rank >= 80) return { label: 'Excellent',   color: '#1456D9', bg: '#EBF1FE' };
  if (rank >= 70) return { label: 'Very Good',   color: '#0369A1', bg: '#E0F2FE' };
  if (rank >= 60) return { label: 'Good',        color: '#B45309', bg: '#FEF3C7' };
  return { label: 'Emerging', color: '#475569', bg: '#F1F5F9' };
}

export function relativeTime(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return 'today';
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''} ago`;
}

// DoctorRank JSON-LD schemas for SEO
export function doctorJsonLd(doctor: {
  name: string;
  qualifications: string;
  specialtyName: string;
  cityName: string;
  address: string;
  phone: string;
  consultationFee: number;
  photoUrl: string;
  reviewCount: number;
  reviewQuality: number;
  hospitalName?: string;
  reviews?: Array<{ patientName: string; rating: number; comment: string }>;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.name,
    image: doctor.photoUrl,
    description: `${doctor.name} — ${doctor.qualifications}, ${doctor.specialtyName} specialist in ${doctor.cityName}.`,
    medicalSpecialty: doctor.specialtyName,
    qualification: doctor.qualifications,
    telephone: doctor.phone,
    priceRange: `₹${doctor.consultationFee}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: doctor.address,
      addressLocality: doctor.cityName,
      addressCountry: 'IN',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (doctor.reviewQuality / 20).toFixed(1),
      reviewCount: doctor.reviewCount,
    },
  };
  if (doctor.hospitalName) {
    schema.hospitalAffiliation = {
      '@type': 'Hospital',
      name: doctor.hospitalName,
    };
  }
  if (doctor.reviews && doctor.reviews.length > 0) {
    schema.review = doctor.reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.patientName },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating },
      reviewBody: r.comment,
    }));
  }
  return schema;
}

export function faqJsonLd(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function hospitalJsonLd(h: {
  name: string;
  address: string;
  cityName: string;
  phone: string;
  emergencyPhone: string;
  rating: number;
  reviewCount: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hospital',
    name: h.name,
    telephone: h.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: h.address,
      addressLocality: h.cityName,
      addressCountry: 'IN',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: h.rating,
      reviewCount: h.reviewCount,
    },
  };
}

export function medicalConditionJsonLd(c: {
  name: string;
  overview: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    name: c.name,
    description: c.overview,
    signOrSymptom: c.symptoms.map((s) => ({ '@type': 'MedicalSignOrSymptom', name: s })),
    cause: c.causes.map((c2) => ({ '@type': 'MedicalCause', name: c2 })),
    possibleTreatment: c.treatments.map((t) => ({ '@type': 'MedicalTherapy', name: t })),
  };
}
