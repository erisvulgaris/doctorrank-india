// /api/search — Full-text search across doctors, conditions, specialties, hospitals
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { safeJsonParse } from '@/lib/doctorrank';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const q = (sp.get('q') || '').trim().toLowerCase();
  const city = sp.get('city') || '';
  const specialtySlug = sp.get('specialty') || '';
  const conditionSlug = sp.get('condition') || '';
  const limit = Math.min(Number(sp.get('limit') || 30), 100);

  const where: any = { AND: [] };
  if (city) where.AND.push({ city: { slug: city } });
  if (specialtySlug) where.AND.push({ specialty: { slug: specialtySlug } });
  if (conditionSlug) where.AND.push({ conditions: { some: { slug: conditionSlug } } });

  if (q) {
    where.AND.push({
      OR: [
        { name: { contains: q } },
        { about: { contains: q } },
        { qualifications: { contains: q } },
        { address: { contains: q } },
        { conditionsTreated: { contains: q } },
        { procedures: { contains: q } },
        { specialty: { name: { contains: q } } },
        { conditions: { some: { name: { contains: q } } } },
        { city: { name: { contains: q } } },
      ],
    });
  }

  const doctors = await db.doctor.findMany({
    where,
    include: {
      specialty: true,
      city: true,
      hospital: true,
      reviews: { take: 3, orderBy: { createdAt: 'desc' } },
    },
    orderBy: [{ isSponsored: 'desc' }, { doctorRank: 'desc' }],
    take: limit,
  });

  let specialties: any[] = [];
  let conditions: any[] = [];
  let hospitals: any[] = [];

  if (q) {
    specialties = await db.specialty.findMany({
      where: { OR: [{ name: { contains: q } }, { description: { contains: q } }] },
      take: 5,
    });
    conditions = await db.condition.findMany({
      where: { OR: [{ name: { contains: q } }, { overview: { contains: q } }] },
      take: 5,
      include: { specialty: true },
    });
    hospitals = await db.hospital.findMany({
      where: { OR: [{ name: { contains: q } }, { description: { contains: q } }, { address: { contains: q } }] },
      take: 5,
      include: { city: true },
    });
  }

  return NextResponse.json({
    q,
    doctors: doctors.map((d) => ({
      ...d,
      languages: safeJsonParse(d.languages, []),
      conditionsTreated: safeJsonParse(d.conditionsTreated, []),
      procedures: safeJsonParse(d.procedures, []),
      timings: safeJsonParse(d.timings, []),
      acceptedInsurance: safeJsonParse(d.acceptedInsurance, []),
      affiliations: safeJsonParse(d.affiliations, []),
    })),
    specialties,
    conditions,
    hospitals,
    count: doctors.length,
  });
}
