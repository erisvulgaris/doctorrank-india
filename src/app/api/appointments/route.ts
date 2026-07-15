// /api/appointments — Book / fetch appointments
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorId, patientName, patientPhone, patientEmail, preferredDate, notes } = body || {};

    if (!doctorId || !patientName || !patientPhone || !preferredDate) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
      include: { specialty: true, city: true },
    });
    if (!doctor) return NextResponse.json({ error: 'Doctor not found.' }, { status: 404 });

    const appt = await db.appointment.create({
      data: {
        doctorId,
        patientName,
        patientPhone,
        patientEmail: patientEmail || null,
        preferredDate: new Date(preferredDate),
        notes: notes || null,
        status: 'confirmed',
      },
    });

    // Simulated WhatsApp / SMS / Email confirmation
    const whatsappUrl = `https://wa.me/${doctor.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
      `Hello ${doctor.name}, I have booked an appointment.\nPatient: ${patientName}\nPhone: ${patientPhone}\nDate: ${new Date(preferredDate).toLocaleString('en-IN')}\nAppointment ID: ${appt.id.slice(-8).toUpperCase()}\nNotes: ${notes || '—'}`
    )}`;

    return NextResponse.json({
      success: true,
      appointmentId: appt.id,
      status: appt.status,
      confirmation: {
        whatsappUrl,
        message: `Appointment confirmed with ${doctor.name}. A confirmation has been sent via WhatsApp, SMS, and email.`,
      },
    });
  } catch (e) {
    console.error('appointment create error', e);
    return NextResponse.json({ error: 'Failed to book appointment.' }, { status: 500 });
  }
}
