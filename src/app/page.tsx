import { db } from '@/lib/db';
import { safeJsonParse } from '@/lib/doctorrank';
import { getCurrentDoctor, publicDoctor } from '@/lib/auth';
import { HomeShell } from './home-shell';

export const dynamic = 'force-dynamic';

async function getBootstrapData() {
  const [cities, specialties, conditions, hospitals, topDoctors, stats] = await Promise.all([
    db.city.findMany({ orderBy: { name: 'asc' }, select: { slug: true, name: true } }),
    db.specialty.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { doctors: true, conditions: true } } },
    }),
    db.condition.findMany({
      orderBy: { name: 'asc' },
      include: { specialty: true },
      take: 16,
    }),
    db.hospital.findMany({
      orderBy: { rating: 'desc' },
      include: { city: true, _count: { select: { doctors: true } } },
    }),
    db.doctor.findMany({
      orderBy: [{ isSponsored: 'desc' }, { doctorRank: 'desc' }],
      take: 6,
      include: {
        specialty: true,
        city: true,
        hospital: true,
        reviews: { take: 1, orderBy: { createdAt: 'desc' } },
      },
    }),
    Promise.all([
      db.doctor.count(),
      db.city.count(),
      db.specialty.count(),
      db.hospital.count(),
    ]).then(([doctors, cities, specialties, hospitals]) => ({ doctors, cities, specialties, hospitals })),
  ]);

  // For specialty & hospital list views, attach doctors so DoctorCard works
  const specialtiesWithDoctors = await Promise.all(
    specialties.map(async (s) => ({
      ...s,
      doctors: await db.doctor.findMany({
        where: { specialtyId: s.id },
        take: 4,
        orderBy: [{ doctorRank: 'desc' }],
        include: { specialty: true, city: true, hospital: true, reviews: { take: 1, orderBy: { createdAt: 'desc' } } },
      }),
      conditions: await db.condition.findMany({ where: { specialtyId: s.id }, take: 6 }),
    })),
  );

  const hospitalsWithDoctors = await Promise.all(
    hospitals.map(async (h) => ({
      ...h,
      doctors: await db.doctor.findMany({
        where: { hospitalId: h.id },
        take: 4,
        orderBy: [{ doctorRank: 'desc' }],
        include: { specialty: true, city: true, hospital: true, reviews: { take: 1, orderBy: { createdAt: 'desc' } } },
      }),
    })),
  );

  // For each condition, attach doctors
  const conditionsWithDoctors = await Promise.all(
    conditions.map(async (c) => ({
      ...c,
      doctors: await db.doctor.findMany({
        where: { conditions: { some: { id: c.id } } },
        take: 4,
        orderBy: [{ doctorRank: 'desc' }],
        include: { specialty: true, city: true, hospital: true, reviews: { take: 1, orderBy: { createdAt: 'desc' } } },
      }),
    })),
  );

  return {
    cities,
    specialties: specialtiesWithDoctors.map((s) => ({
      ...s,
      // strip _count to keep payload light
      doctors: s.doctors.map((d) => ({
        ...d,
        languages: safeJsonParse(d.languages, []),
        conditionsTreated: safeJsonParse(d.conditionsTreated, []),
        procedures: safeJsonParse(d.procedures, []),
        timings: safeJsonParse(d.timings, []),
        acceptedInsurance: safeJsonParse(d.acceptedInsurance, []),
        affiliations: safeJsonParse(d.affiliations, []),
      })),
    })),
    conditions: conditionsWithDoctors.map((c) => ({
      ...c,
      symptoms: c.symptoms,
      causes: c.causes,
      treatments: c.treatments,
      faqs: c.faqs,
      doctors: c.doctors.map((d) => ({
        ...d,
        languages: safeJsonParse(d.languages, []),
        conditionsTreated: safeJsonParse(d.conditionsTreated, []),
        procedures: safeJsonParse(d.procedures, []),
        timings: safeJsonParse(d.timings, []),
        acceptedInsurance: safeJsonParse(d.acceptedInsurance, []),
        affiliations: safeJsonParse(d.affiliations, []),
      })),
    })),
    hospitals: hospitalsWithDoctors.map((h) => ({
      ...h,
      doctors: h.doctors.map((d) => ({
        ...d,
        languages: safeJsonParse(d.languages, []),
        conditionsTreated: safeJsonParse(d.conditionsTreated, []),
        procedures: safeJsonParse(d.procedures, []),
        timings: safeJsonParse(d.timings, []),
        acceptedInsurance: safeJsonParse(d.acceptedInsurance, []),
        affiliations: safeJsonParse(d.affiliations, []),
      })),
    })),
    topDoctors: topDoctors.map((d) => ({
      ...d,
      languages: safeJsonParse(d.languages, []),
      conditionsTreated: safeJsonParse(d.conditionsTreated, []),
      procedures: safeJsonParse(d.procedures, []),
      timings: safeJsonParse(d.timings, []),
      acceptedInsurance: safeJsonParse(d.acceptedInsurance, []),
      affiliations: safeJsonParse(d.affiliations, []),
    })),
    stats,
  };
}

export default async function Page() {
  const [data, currentDoctor] = await Promise.all([
    getBootstrapData(),
    getCurrentDoctor(),
  ]);

  return (
    <HomeShell
      cities={data.cities}
      specialties={data.specialties}
      conditions={data.conditions}
      hospitals={data.hospitals}
      topDoctors={data.topDoctors}
      stats={data.stats}
      initialDoctor={currentDoctor ? publicDoctor({
        ...currentDoctor,
        languages: safeJsonParse(currentDoctor.languages, []),
        conditionsTreated: safeJsonParse(currentDoctor.conditionsTreated, []),
        procedures: safeJsonParse(currentDoctor.procedures, []),
        timings: safeJsonParse(currentDoctor.timings, []),
        acceptedInsurance: safeJsonParse(currentDoctor.acceptedInsurance, []),
        affiliations: safeJsonParse(currentDoctor.affiliations, []),
      }) : null}
      specialtiesForSignup={data.specialties.map((s) => ({ id: s.id, name: s.name, slug: s.slug }))}
      citiesForSignup={data.cities}
    />
  );
}

