// /api/doctor/appointments — List + update the logged-in doctor's appointments.
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentDoctor } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const ALLOWED_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'];

export async function GET(req: NextRequest) {
  const doctor = await getCurrentDoctor();
  if (!doctor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const status = sp.get('status') || undefined;
  const limit = Math.min(Number(sp.get('limit') || 50), 200);

  const where: any = { doctorId: doctor.id };
  if (status && ALLOWED_STATUSES.includes(status)) {
    where.status = status;
  }

  const appointments = await db.appointment.findMany({
    where,
    orderBy: [{ preferredDate: 'asc' }],
    take: limit,
  });

  return NextResponse.json({ appointments, count: appointments.length });
}

// PATCH /api/doctor/appointments?id=<apptId> — update status or doctor notes
export async function PATCH(req: NextRequest) {
  const doctor = await getCurrentDoctor();
  if (!doctor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Appointment id is required.' }, { status: 400 });

  // Verify ownership
  const existing = await db.appointment.findUnique({ where: { id } });
  if (!existing || existing.doctorId !== doctor.id) {
    return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const updates: any = {};

  if (body.status) {
    if (!ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}` }, { status: 400 });
    }
    updates.status = body.status;
  }
  if (typeof body.doctorNotes === 'string') {
    updates.doctorNotes = body.doctorNotes.slice(0, 2000);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 });
  }

  const updated = await db.appointment.update({
    where: { id },
    data: updates,
  });

  return NextResponse.json({ appointment: updated });
}
