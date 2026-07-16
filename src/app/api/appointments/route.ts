// /api/appointments — Book / fetch appointments
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorId, patientName, patientPhone, patientEmail, preferredDate, notes } = body || {};

    // ---- Validation ----
    const errors: Record<string, string> = {};
    if (!doctorId) errors.doctorId = 'Doctor is required.';
    if (!patientName || patientName.trim().length < 2) errors.patientName = 'Patient name is required.';
    if (!patientPhone || patientPhone.trim().length < 6) errors.patientPhone = 'A valid phone number is required.';
    if (!preferredDate) errors.preferredDate = 'Preferred date is required.';
    else {
      const chosen = new Date(preferredDate);
      if (chosen.getTime() < Date.now() - 60_000) {
        errors.preferredDate = 'Please choose a future date and time.';
      }
    }
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validation failed.', errors }, { status: 400 });
    }

    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
      include: { specialty: true, city: true },
    });
    if (!doctor) return NextResponse.json({ error: 'Doctor not found.' }, { status: 404 });

    // Create as "pending" — the doctor confirms/cancels from their dashboard.
    const appt = await db.appointment.create({
      data: {
        doctorId,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail?.trim() || null,
        preferredDate: new Date(preferredDate),
        notes: notes?.trim() || null,
        status: 'pending',
      },
    });

    // WhatsApp deep link — the only channel actually wired up.
    const whatsappUrl = `https://wa.me/${doctor.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
      `Hello ${doctor.name}, I have booked an appointment.\nPatient: ${patientName}\nPhone: ${patientPhone}\nDate: ${new Date(preferredDate).toLocaleString('en-IN')}\nAppointment ID: ${appt.id.slice(-8).toUpperCase()}\nNotes: ${notes || '—'}`
    )}`;

    return NextResponse.json({
      success: true,
      appointmentId: appt.id,
      status: appt.status,
      confirmation: {
        whatsappUrl,
        message: `Appointment requested with ${doctor.name}. The doctor will confirm shortly. You can also send a WhatsApp message directly to the clinic.`,
      },
    });
  } catch (e) {
    console.error('appointment create error', e);
    return NextResponse.json({ error: 'Failed to book appointment.' }, { status: 500 });
  }
}
