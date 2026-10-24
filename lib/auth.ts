import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";
import type { Role } from "./generated/prisma/client";

export const SESSION_COOKIE = "co3_session";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = { userId: string; role: Role };
export type CurrentUser = { id: string; name: string; email: string; role: Role; avatar: string | null };

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be set (32+ chars)");
  return new TextEncoder().encode(value);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(secret());
}

export async function verifySession(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, secret());
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  const token = await signSession(payload);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Reads the session and re-checks the user in the DB, so deleted users and role changes apply immediately. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  return db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, avatar: true },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/dashboard/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard?denied=1");
  return user;
}
