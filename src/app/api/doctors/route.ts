// /api/doctors — Get a single doctor by slug (with related entities)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { safeJsonParse } from '@/lib/doctorrank';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const doctor = await db.doctor.findUnique({
    where: { slug },
    include: {
      specialty: { include: { conditions: true } },
      city: true,
      hospital: { include: { city: true } },
      conditions: true,
      reviews: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });

  if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Related doctors: same specialty, different id
  const related = await db.doctor.findMany({
    where: {
      specialtyId: doctor.specialtyId,
      id: { not: doctor.id },
    },
    include: { specialty: true, city: true, hospital: true },
    orderBy: [{ doctorRank: 'desc' }],
    take: 4,
  });

  // Nearby hospitals (same city)
  const nearbyHospitals = await db.hospital.findMany({
    where: { cityId: doctor.cityId },
    take: 3,
  });

  return NextResponse.json({
    doctor: {
      ...doctor,
      languages: safeJsonParse(doctor.languages, []),
      conditionsTreated: safeJsonParse(doctor.conditionsTreated, []),
      procedures: safeJsonParse(doctor.procedures, []),
      timings: safeJsonParse(doctor.timings, []),
      acceptedInsurance: safeJsonParse(doctor.acceptedInsurance, []),
      affiliations: safeJsonParse(doctor.affiliations, []),
      clinicPhotos: safeJsonParse(doctor.clinicPhotos, []),
    },
    related: related.map((d) => ({
      ...d,
      languages: safeJsonParse(d.languages, []),
      conditionsTreated: safeJsonParse(d.conditionsTreated, []),
    })),
    nearbyHospitals,
  });
}
