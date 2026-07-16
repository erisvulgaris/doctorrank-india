// /api/doctor/profile — Fetch + update the logged-in doctor's profile.
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentDoctor, publicDoctor } from '@/lib/auth';
import { db } from '@/lib/db';
import { safeJsonParse } from '@/lib/doctorrank';

export const dynamic = 'force-dynamic';

export async function GET() {
  const doctor = await getCurrentDoctor();
  if (!doctor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Re-fetch with relations
  const full = await db.doctor.findUnique({
    where: { id: doctor.id },
    include: { specialty: true, city: true, hospital: true },
  });
  if (!full) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    doctor: publicDoctor({
      ...full,
      languages: safeJsonParse(full.languages, []),
      conditionsTreated: safeJsonParse(full.conditionsTreated, []),
      procedures: safeJsonParse(full.procedures, []),
      timings: safeJsonParse(full.timings, []),
      acceptedInsurance: safeJsonParse(full.acceptedInsurance, []),
      affiliations: safeJsonParse(full.affiliations, []),
      clinicPhotos: safeJsonParse(full.clinicPhotos, []),
    }),
  });
}

// PATCH — update editable profile fields
export async function PATCH(req: NextRequest) {
  const doctor = await getCurrentDoctor();
  if (!doctor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  // Whitelisted updatable fields. passwordHash, email, slug, id, ranking
  // factors are NOT editable here (email change requires a separate
  // verification flow; ranking factors are computed server-side).
  const updates: any = {};

  const stringFields = [
    'about', 'qualifications', 'address', 'phone', 'whatsapp',
    'photoUrl', 'videoIntroUrl',
  ];
  for (const f of stringFields) {
    if (typeof body[f] === 'string') {
      updates[f] = body[f].slice(0, 4000);
    }
  }

  if (typeof body.consultationFee === 'number' && body.consultationFee >= 0 && body.consultationFee <= 100000) {
    updates.consultationFee = body.consultationFee;
  }
  if (typeof body.experienceYears === 'number' && body.experienceYears >= 0 && body.experienceYears <= 80) {
    updates.experienceYears = body.experienceYears;
  }

  // JSON-array fields — accept arrays and stringify
  const arrayFields = [
    'languages', 'conditionsTreated', 'procedures',
    'acceptedInsurance', 'affiliations', 'clinicPhotos',
  ];
  for (const f of arrayFields) {
    if (Array.isArray(body[f])) {
      // Sanitize: each item must be a string, max 200 chars
      const clean = body[f]
        .filter((x: any) => typeof x === 'string')
        .map((x: string) => x.slice(0, 200))
        .slice(0, 50);
      updates[f] = JSON.stringify(clean);
    }
  }

  // Timings — array of { day, hours } objects
  if (Array.isArray(body.timings)) {
    const clean = body.timings
      .filter((t: any) => t && typeof t.day === 'string' && typeof t.hours === 'string')
      .map((t: any) => ({ day: String(t.day).slice(0, 50), hours: String(t.hours).slice(0, 200) }))
      .slice(0, 14);
    updates.timings = JSON.stringify(clean);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 });
  }

  // Update profileFreshness + profileCompleteness when doctor edits
  updates.profileFreshness = 100;
  // Recompute profile completeness as a simple percentage of filled fields
  const after = { ...doctor, ...updates };
  const completenessFields = [
    'about', 'qualifications', 'address', 'phone', 'whatsapp',
    'photoUrl', 'consultationFee', 'experienceYears',
  ];
  const filled = completenessFields.filter((f) => {
    const v = (after as any)[f];
    return v !== null && v !== undefined && v !== '' && v !== 0;
  }).length;
  updates.profileCompleteness = Math.round((filled / completenessFields.length) * 100);

  // Recompute doctorRank with the same weights used in the seed
  const d = { ...doctor, ...updates };
  updates.doctorRank = Math.round(
    (updates.profileCompleteness ?? d.profileCompleteness) * 0.12 +
    d.responseRate * 0.18 +
    d.reviewQuality * 0.20 +
    (updates.profileFreshness ?? d.profileFreshness) * 0.08 +
    d.verificationScore * 0.22 +
    Math.min(d.publishedResearch * 4, 100) * 0.10 +
    Math.min(d.reviewCount / 3, 100) * 0.10
  );

  const updated = await db.doctor.update({
    where: { id: doctor.id },
    data: updates,
    include: { specialty: true, city: true, hospital: true },
  });

  return NextResponse.json({
    doctor: publicDoctor({
      ...updated,
      languages: safeJsonParse(updated.languages, []),
      conditionsTreated: safeJsonParse(updated.conditionsTreated, []),
      procedures: safeJsonParse(updated.procedures, []),
      timings: safeJsonParse(updated.timings, []),
      acceptedInsurance: safeJsonParse(updated.acceptedInsurance, []),
      affiliations: safeJsonParse(updated.affiliations, []),
      clinicPhotos: safeJsonParse(updated.clinicPhotos, []),
    }),
  });
}
