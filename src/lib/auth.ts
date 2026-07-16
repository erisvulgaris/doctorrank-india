// src/lib/auth.ts — Authentication utilities for DoctorRank India
//
// Uses Node's built-in crypto (no bcrypt dependency needed) for password
// hashing via scrypt, and server-side sessions stored in the DB.
//
// Sessions are tracked via an httpOnly cookie (`doctorrank_session`).

import crypto from 'crypto';
import { cookies } from 'next/headers';
import { db } from './db';

export const SESSION_COOKIE = 'doctorrank_session';
export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const SESSION_MAX_AGE_S = Math.floor(SESSION_DURATION_MS / 1000);

// ============================================================
// Password hashing — scrypt with per-user salt
// ============================================================

export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

export function verifyPassword(password: string, stored: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = stored.split(':');
    if (!salt || !key) {
      resolve(false);
      return;
    }
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      // Use timingSafeEqual to prevent timing attacks
      const a = Buffer.from(derivedKey.toString('hex'), 'hex');
      const b = Buffer.from(key, 'hex');
      if (a.length !== b.length) {
        resolve(false);
        return;
      }
      resolve(crypto.timingSafeEqual(a, b));
    });
  });
}

// ============================================================
// Session management
// ============================================================

export async function createSession(
  doctorId: string,
  meta?: { ip?: string; userAgent?: string }
): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.session.create({
    data: {
      token,
      doctorId,
      expiresAt,
      ip: meta?.ip,
      userAgent: meta?.userAgent,
    },
  });
  return token;
}

export async function getCurrentDoctor() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const session = await db.session.findUnique({
      where: { token },
      include: { doctor: { include: { specialty: true, city: true } } },
    });

    if (!session) return null;

    // Expired session — clean it up
    if (session.expiresAt < new Date()) {
      await db.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    return session.doctor;
  } catch {
    // cookies() can throw in some contexts (e.g. during static generation)
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_S,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function destroySession(token: string) {
  await db.session.deleteMany({ where: { token } }).catch(() => {});
}

// ============================================================
// Validation helpers
// ============================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

export function isStrongPassword(password: string): boolean {
  // At least 8 chars, at most 128, at least one letter and one number.
  // Deliberately simple — don't enforce special chars (NIST 800-63B
  // recommends against composition rules).
  if (typeof password !== 'string') return false;
  if (password.length < 8 || password.length > 128) return false;
  return /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

// Safe public representation of a doctor (no passwordHash, no sessions)
export function publicDoctor(d: any) {
  if (!d) return null;
  const { passwordHash, sessions, ...safe } = d;
  return safe;
}
