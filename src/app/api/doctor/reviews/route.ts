// /api/doctor/reviews — List + reply to reviews for the logged-in doctor.
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentDoctor } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const doctor = await getCurrentDoctor();
  if (!doctor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const limit = Math.min(Number(sp.get('limit') || 50), 200);

  const reviews = await db.review.findMany({
    where: { doctorId: doctor.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return NextResponse.json({ reviews, count: reviews.length });
}

// PATCH /api/doctor/reviews?id=<reviewId> — set or update doctor's reply
export async function PATCH(req: NextRequest) {
  const doctor = await getCurrentDoctor();
  if (!doctor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Review id is required.' }, { status: 400 });

  const existing = await db.review.findUnique({ where: { id } });
  if (!existing || existing.doctorId !== doctor.id) {
    return NextResponse.json({ error: 'Review not found.' }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));

  // Allow clearing the reply with an empty string
  if (typeof body.doctorReply !== 'string') {
    return NextResponse.json({ error: 'doctorReply (string) is required.' }, { status: 400 });
  }

  const reply = body.doctorReply.trim().slice(0, 1000);
  const updated = await db.review.update({
    where: { id },
    data: {
      doctorReply: reply || null,
      doctorReplyAt: reply ? new Date() : null,
    },
  });

  return NextResponse.json({ review: updated });
}
