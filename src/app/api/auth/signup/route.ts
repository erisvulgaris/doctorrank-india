// /api/auth/signup — Doctor registration
// Creates a new doctor with email + password, sets a session cookie.
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  hashPassword,
  createSession,
  setSessionCookie,
  isValidEmail,
  isStrongPassword,
  publicDoctor,
} from '@/lib/auth';
import { safeJsonParse } from '@/lib/doctorrank';

export const dynamic = 'force-dynamic';

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      specialtyId,
      cityId,
      qualifications,
      registrationNumber,
      phone,
    } = body || {};

    // ---- Validation ----
    const errors: Record<string, string> = {};
    if (!name || name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
    if (!email || !isValidEmail(email)) errors.email = 'A valid email is required.';
    if (!password || !isStrongPassword(password))
      errors.password = 'Password must be at least 8 characters and include a letter and a number.';
    if (!specialtyId) errors.specialtyId = 'Please choose a specialty.';
    if (!cityId) errors.cityId = 'Please choose a city.';
    if (!qualifications || qualifications.trim().length < 2)
      errors.qualifications = 'Qualifications are required.';
    if (!registrationNumber || registrationNumber.trim().length < 2)
      errors.registrationNumber = 'Medical registration number is required.';
    if (!phone || phone.trim().length < 6) errors.phone = 'A valid phone number is required.';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    // ---- Uniqueness checks ----
    const existingEmail = await db.doctor.findUnique({ where: { email: email.toLowerCase() } });
    if (existingEmail) {
      return NextResponse.json({ error: 'An account with this email already exists.', errors: { email: 'Already registered.' } }, { status: 409 });
    }

    const slug = slugify(name);
    const existingSlug = await db.doctor.findUnique({ where: { slug } });
    const finalSlug = existingSlug ? `${slug}-${Math.random().toString(36).slice(2, 6)}` : slug;

    // ---- Validate specialty + city exist ----
    const [specialty, city] = await Promise.all([
      db.specialty.findUnique({ where: { id: specialtyId } }),
      db.city.findUnique({ where: { id: cityId } }),
    ]);
    if (!specialty) return NextResponse.json({ error: 'Specialty not found.' }, { status: 400 });
    if (!city) return NextResponse.json({ error: 'City not found.' }, { status: 400 });

    // ---- Create doctor ----
    const passwordHash = await hashPassword(password);
    const doctor = await db.doctor.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        email: email.toLowerCase(),
        passwordHash,
        specialtyId,
        cityId,
        qualifications: qualifications.trim(),
        registrationNumber: registrationNumber.trim(),
        experienceYears: 0,
        languages: JSON.stringify(['English']),
        consultationFee: 500, // default, doctor can update later
        about: `Newly registered ${specialty.name.toLowerCase()} specialist on DoctorRank India. Profile is being set up.`,
        photoUrl: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(1 + Math.random() * 90)}.jpg`,
        clinicPhotos: JSON.stringify([]),
        conditionsTreated: JSON.stringify([specialty.name + ' consultations']),
        procedures: JSON.stringify(['Consultation']),
        timings: JSON.stringify([
          { day: 'Mon - Fri', hours: '9:00 AM - 1:00 PM, 5:00 PM - 9:00 PM' },
          { day: 'Saturday', hours: '9:00 AM - 1:00 PM' },
          { day: 'Sunday', hours: 'Closed' },
        ]),
        acceptedInsurance: JSON.stringify([]),
        affiliations: JSON.stringify([]),
        address: `Update your clinic address`,
        lat: city.lat,
        lng: city.lng,
        phone: phone.trim(),
        whatsapp: phone.trim(),
        isVerified: false, // newly registered — pending verification
        // Ranking factors start at 0, will be computed as profile is filled in
        profileCompleteness: 30,
        responseRate: 0,
        reviewCount: 0,
        reviewQuality: 0,
        publishedResearch: 0,
        profileFreshness: 100,
        verificationScore: 40, // pending verification
        doctorRank: 40,
      },
      include: { specialty: true, city: true },
    });

    // ---- Create session ----
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
    console.error('signup error', e);
    return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 });
  }
}
