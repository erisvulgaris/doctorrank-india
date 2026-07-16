// /api/auth/logout — Destroys the current session and clears the cookie.
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { SESSION_COOKIE, clearSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (token) {
      await db.session.deleteMany({ where: { token } }).catch(() => {});
    }
    await clearSessionCookie();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('logout error', e);
    return NextResponse.json({ error: 'Failed to log out.' }, { status: 500 });
  }
}
