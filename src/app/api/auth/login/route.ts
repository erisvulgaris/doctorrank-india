// /api/auth/login — Doctor login
// Verifies email + password, sets a session cookie.
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  verifyPassword,
  createSession,
  setSessionCookie,
  isValidEmail,
  publicDoctor,
} from '@/lib/auth';
import { safeJsonParse } from '@/lib/doctorrank';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Enter a valid email.', errors: { email: 'Invalid email.' } }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: 'Password is required.', errors: { password: 'Required.' } }, { status: 400 });
    }

    const doctor = await db.doctor.findUnique({
      where: { email: email.toLowerCase() },
      include: { specialty: true, city: true },
    });

    // Use a generic error message to avoid leaking which emails are registered
    if (!doctor || !doctor.passwordHash) {
      return NextResponse.json({ error: 'Invalid email or password.', errors: { form: 'Invalid credentials.' } }, { status: 401 });
    }

    const ok = await verifyPassword(password, doctor.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid email or password.', errors: { form: 'Invalid credentials.' } }, { status: 401 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    const token = await createSession(doctor.id, { ip, userAgent });
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
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
  } catch (e) {
    console.error('login error', e);
    return NextResponse.json({ error: 'Failed to log in. Please try again.' }, { status: 500 });
  }
}
