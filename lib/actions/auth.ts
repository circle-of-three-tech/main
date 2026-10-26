"use server";

import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, destroySession, findResetToken, hashResetToken } from "@/lib/auth";
import { emailLayout, escapeHtml, sendMail } from "@/lib/mail";
import { site } from "@/lib/site";

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

/* ---------------- password reset ---------------- */

export type ResetState = { ok?: boolean; message?: string; error?: string };

const RESET_TTL_MINUTES = 60;
const RESET_THROTTLE_MS = 60_000;

/** Emails a single-use reset link. Always answers the same way so it can't be used to discover accounts. */
export async function requestPasswordReset(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const parsed = z.email().safeParse(String(formData.get("email") ?? "").trim().toLowerCase());
  if (!parsed.success) return { error: "Enter a valid email address." };
  const done = { ok: true, message: "If that email belongs to an account, a reset link is on its way. It expires in 60 minutes." };

  const user = await db.user.findUnique({ where: { email: parsed.data } });
  if (!user) return done;
  const recent = await db.passwordResetToken.findFirst({
    where: { userId: user.id, createdAt: { gt: new Date(Date.now() - RESET_THROTTLE_MS) } },
  });
  if (recent) return done;

  const token = randomBytes(32).toString("base64url");
  // One live link per user: requesting a new one revokes the old.
  await db.$transaction([
    db.passwordResetToken.deleteMany({ where: { userId: user.id } }),
    db.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hashResetToken(token), expiresAt: new Date(Date.now() + RESET_TTL_MINUTES * 60_000) },
    }),
  ]);

  const link = `${site.url}/dashboard/reset-password?token=${token}`;
  const firstName = user.name.split(" ")[0];
  // Send after responding so a known email doesn't answer noticeably slower than an unknown one.
  after(async () => {
    const sent = await sendMail({
      to: user.email,
      subject: `Reset your password | ${site.name}`,
      text: `Hi ${firstName},\n\nSomeone asked to reset the password for your Co3 Studio account. Open this link within ${RESET_TTL_MINUTES} minutes to choose a new one:\n\n${link}\n\nIf you didn't ask for this, you can ignore this email and your password will stay the same.`,
      html: emailLayout({
        heading: "Reset your password",
        preheader: `This link expires in ${RESET_TTL_MINUTES} minutes.`,
        body: `<p style="margin:0 0 12px;line-height:1.6">Hi ${escapeHtml(firstName)}, someone asked to reset the password for your Co3 Studio account. This link works once and expires in ${RESET_TTL_MINUTES} minutes.</p>
<p style="margin:24px 0"><a href="${link}" style="display:inline-block;background:#3df2ff;color:#05061a;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:999px">Choose a new password</a></p>
<p style="margin:0;font-size:14px;line-height:1.6;color:#6b7299">If you didn't ask for this, ignore this email and your password will stay the same.</p>`,
      }),
    });
    if (!sent) console.error(`[auth] password reset email for ${user.email} was not sent (is SMTP configured?)`);
  });
  return done;
}

const resetSchema = z
  .object({ token: z.string().min(1), password: z.string().min(10, "Use at least 10 characters."), confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: "The passwords don't match.", path: ["confirm"] });

export async function resetPassword(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const parsed = resetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const row = await findResetToken(parsed.data.token);
  if (!row) return { error: "This reset link is invalid or has expired. Request a new one." };
  await db.$transaction([
    db.user.update({ where: { id: row.userId }, data: { passwordHash: await bcrypt.hash(parsed.data.password, 12) } }),
    db.passwordResetToken.deleteMany({ where: { userId: row.userId } }),
  ]);
  redirect("/dashboard/login?reset=1");
}
