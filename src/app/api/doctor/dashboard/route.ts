// /api/doctor/dashboard — Aggregated stats for the logged-in doctor.
import { NextResponse } from 'next/server';
import { getCurrentDoctor } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const doctor = await getCurrentDoctor();
  if (!doctor) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    appointmentsToday,
    appointmentsThisMonth,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    cancelledAppointments,
    reviews,
    reviewsLast30,
    appointmentsLast30,
    sessions,
  ] = await Promise.all([
    db.appointment.count({
      where: { doctorId: doctor.id, preferredDate: { gte: startOfToday } },
    }),
    db.appointment.count({
      where: { doctorId: doctor.id, createdAt: { gte: startOfMonth } },
    }),
    db.appointment.count({
      where: { doctorId: doctor.id, status: 'pending' },
    }),
    db.appointment.count({
      where: { doctorId: doctor.id, status: 'confirmed' },
    }),
    db.appointment.count({
      where: { doctorId: doctor.id, status: 'completed' },
    }),
    db.appointment.count({
      where: { doctorId: doctor.id, status: 'cancelled' },
    }),
    db.review.findMany({
      where: { doctorId: doctor.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    db.review.findMany({
      where: { doctorId: doctor.id, createdAt: { gte: last30 } },
      select: { rating: true },
    }),
    db.appointment.findMany({
      where: { doctorId: doctor.id, createdAt: { gte: last30 } },
      select: { id: true, createdAt: true, status: true },
    }),
    db.session.findMany({
      where: { doctorId: doctor.id },
      select: { id: true, ip: true, userAgent: true, createdAt: true, expiresAt: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const avgRating = reviewsLast30.length > 0
    ? reviewsLast30.reduce((a, r) => a + r.rating, 0) / reviewsLast30.length
    : doctor.reviewQuality / 20;

  // 30-day timeseries of appointment counts per day
  const timeseries: Array<{ day: string; count: number }> = [];
  for (let i = 29; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(now.getDate() - i);
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);
    const count = appointmentsLast30.filter((a) => {
      const c = new Date(a.createdAt);
      return c >= dayStart && c < dayEnd;
    }).length;
    timeseries.push({
      day: dayStart.toISOString().slice(0, 10),
      count,
    });
  }

  return NextResponse.json({
    doctor: {
      id: doctor.id,
      name: doctor.name,
      slug: doctor.slug,
      email: doctor.email,
      photoUrl: doctor.photoUrl,
      specialty: doctor.specialty,
      city: doctor.city,
      isVerified: doctor.isVerified,
      doctorRank: doctor.doctorRank,
      consultationFee: doctor.consultationFee,
      reviewCount: doctor.reviewCount,
      responseRate: doctor.responseRate,
    },
    stats: {
      appointmentsToday,
      appointmentsThisMonth,
      pending: pendingAppointments,
      confirmed: confirmedAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments,
      totalReviews: doctor.reviewCount,
      avgRating: Number(avgRating.toFixed(2)),
      responseRate: doctor.responseRate,
      doctorRank: doctor.doctorRank,
      profileCompleteness: doctor.profileCompleteness,
    },
    timeseries,
    recentReviews: reviews,
    sessions: sessions.map((s) => ({
      id: s.id,
      ip: s.ip,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: false, // filled in below if we know the current token
    })),
  });
}
