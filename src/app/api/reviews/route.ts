// /api/reviews — Public review submission by patients
// Anyone can submit a review for a doctor. Reviews start as unverified
// (isVerified = false) and can be verified by an admin later.
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorId, patientName, rating, procedure, comment } = body || {};

    // ---- Validation ----
    const errors: Record<string, string> = {};
    if (!doctorId) errors.doctorId = 'Doctor is required.';
    if (!patientName || patientName.trim().length < 2)
      errors.patientName = 'Your name must be at least 2 characters.';
    else if (patientName.trim().length > 80)
      errors.patientName = 'Name must be 80 characters or fewer.';

    const r = Number(rating);
    if (!rating || isNaN(r) || r < 1 || r > 5)
      errors.rating = 'Please choose a star rating from 1 to 5.';

    if (!comment || comment.trim().length < 10)
      errors.comment = 'Please write at least 10 characters about your experience.';
    else if (comment.trim().length > 2000)
      errors.comment = 'Review must be 2000 characters or fewer.';

    if (procedure && typeof procedure !== 'string') {
      errors.procedure = 'Procedure must be text.';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validation failed.', errors }, { status: 400 });
    }

    // Verify doctor exists
    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
      select: { id: true, name: true, reviewCount: true, reviewQuality: true },
    });
    if (!doctor) return NextResponse.json({ error: 'Doctor not found.' }, { status: 404 });

    // Create the review (unverified by default — admin can verify later)
    const review = await db.review.create({
      data: {
        doctorId,
        patientName: patientName.trim(),
        rating: r,
        procedure: procedure?.trim() || null,
        comment: comment.trim(),
        isVerified: false,
      },
    });

    // Recompute the doctor's aggregate review stats
    const allReviews = await db.review.findMany({
      where: { doctorId },
      select: { rating: true },
    });
    const newCount = allReviews.length;
    const avgRating = allReviews.length > 0
      ? allReviews.reduce((sum, rv) => sum + rv.rating, 0) / allReviews.length
      : 0;
    // reviewQuality is stored on a 0–100 scale (rating * 20)
    const newQuality = avgRating * 20;

    await db.doctor.update({
      where: { id: doctorId },
      data: {
        reviewCount: newCount,
        reviewQuality: newQuality,
        // Recalculate doctorRank using the same 7-factor weights
        doctorRank: Math.round(
          doctor.reviewQuality * 0.20 + // will be replaced below
          newQuality * 0.20 +
          // We need the full doctor record for the other factors — fetch fresh
          0 // placeholder, recalculated below
        ),
      },
    });

    // Fetch the full doctor record and recalculate doctorRank properly
    const fullDoctor = await db.doctor.findUnique({
      where: { id: doctorId },
      select: {
        profileCompleteness: true,
        responseRate: true,
        reviewQuality: true,
        reviewCount: true,
        publishedResearch: true,
        profileFreshness: true,
        verificationScore: true,
      },
    });
    if (fullDoctor) {
      const rank = Math.round(
        fullDoctor.profileCompleteness * 0.12 +
        fullDoctor.responseRate * 0.18 +
        fullDoctor.reviewQuality * 0.20 +
        fullDoctor.profileFreshness * 0.08 +
        fullDoctor.verificationScore * 0.22 +
        Math.min(fullDoctor.publishedResearch * 4, 100) * 0.10 +
        Math.min(fullDoctor.reviewCount / 3, 100) * 0.10
      );
      await db.doctor.update({
        where: { id: doctorId },
        data: { doctorRank: rank },
      });
    }

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        patientName: review.patientName,
        rating: review.rating,
        procedure: review.procedure,
        comment: review.comment,
        createdAt: review.createdAt,
        isVerified: review.isVerified,
      },
    });
  } catch (e) {
    console.error('review create error', e);
    return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 });
  }
}
