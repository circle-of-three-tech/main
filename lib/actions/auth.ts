"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";

export type LoginState = { error?: string };

const DUMMY_HASH = "$2b$12$kjG5yzwel4mHNjg6YHx2OONhQ6NdGGD8JpgHgeAVVKEpX.NsTgNHO";

const schema = z.object({ email: z.email(), password: z.string().min(1) });

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = schema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Enter your email and password." };
  const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  // Compare even when the user is missing so timing doesn't reveal which emails exist.
  const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) return { error: "Invalid email or password." };
  await createSession({ userId: user.id, role: user.role });
  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/dashboard") ? next : "/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/dashboard/login");
}
