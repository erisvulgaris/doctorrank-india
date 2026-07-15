// /api/suggest — instant search suggestions (Google-like)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const SUGGESTION_BANK = [
  'Hair fall doctor for men',
  'Hair fall doctor for women',
  'Gall bladder surgeon',
  'Kidney stone specialist',
  'Dermatologist near me',
  'IVF specialist',
  'Knee replacement surgeon',
  'Best cardiologist',
  'Dentist for root canal',
  'Psychiatrist for depression',
  'PCOS specialist',
  'Thyroid doctor',
  'Migraine specialist',
  'Cataract surgeon',
  'Back pain doctor',
  'Joint pain specialist',
  'Sinus doctor',
  'High BP doctor',
  'Acne treatment',
  'Child pediatrician',
];

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') || '').trim().toLowerCase();
  if (!q || q.length < 1) {
    return NextResponse.json({ suggestions: SUGGESTION_BANK.slice(0, 8) });
  }

  const [doctors, conditions, specialties] = await Promise.all([
    db.doctor.findMany({
      where: { OR: [
        { name: { contains: q } },
        { specialty: { name: { contains: q } } },
        { conditions: { some: { name: { contains: q } } } },
      ]},
      take: 4,
      include: { specialty: true, city: true },
    }),
    db.condition.findMany({ where: { name: { contains: q } }, take: 3, include: { specialty: true } }),
    db.specialty.findMany({ where: { name: { contains: q } }, take: 2 }),
  ]);

  const suggestions: Array<{ type: string; label: string; sub?: string; href?: string }> = [];

  for (const s of SUGGESTION_BANK.filter(s => s.toLowerCase().includes(q)).slice(0, 4)) {
    suggestions.push({ type: 'search', label: s });
  }
  for (const c of conditions) {
    suggestions.push({ type: 'condition', label: c.name, sub: c.specialty.name, href: `condition:${c.slug}` });
  }
  for (const s of specialties) {
    suggestions.push({ type: 'specialty', label: s.name, sub: s.tagline, href: `specialty:${s.slug}` });
  }
  for (const d of doctors) {
    suggestions.push({ type: 'doctor', label: d.name, sub: `${d.specialty.name} · ${d.city.name}`, href: `doctor:${d.slug}` });
  }

  return NextResponse.json({ suggestions: suggestions.slice(0, 10) });
}
