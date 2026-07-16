// /api/auth/me — Returns the currently logged-in doctor, or 401.
import { NextResponse } from 'next/server';
import { getCurrentDoctor, publicDoctor } from '@/lib/auth';
import { safeJsonParse } from '@/lib/doctorrank';

export const dynamic = 'force-dynamic';

export async function GET() {
  const doctor = await getCurrentDoctor();
  if (!doctor) {
    return NextResponse.json({ doctor: null }, { status: 200 });
  }

  return NextResponse.json({
    doctor: publicDoctor({
      ...doctor,
      languages: safeJsonParse(doctor.languages, []),
      conditionsTreated: safeJsonParse(doctor.conditionsTreated, []),
      procedures: safeJsonParse(doctor.procedures, []),
      timings: safeJsonParse(doctor.timings, []),
      acceptedInsurance: safeJsonParse(doctor.acceptedInsurance, []),
      affiliations: safeJsonParse(doctor.affiliations, []),
    }),
  });
}
