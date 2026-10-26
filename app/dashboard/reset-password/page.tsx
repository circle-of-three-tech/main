import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/dashboard/auth-card";
import { ResetPasswordForm } from "@/components/dashboard/password-reset-forms";
import { findResetToken } from "@/lib/auth";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/dashboard/reset-password">) {
  const { token } = await searchParams;
  const value = typeof token === "string" ? token : "";
  if (!(await findResetToken(value))) {
    return (
      <AuthCard title="Link expired" description="This reset link is invalid, has already been used, or has expired.">
        <Link href="/dashboard/forgot-password" className="inline-flex w-full items-center justify-center rounded-full bg-cyan px-6 py-3 font-semibold text-ink transition hover:brightness-110">
          Request a new link
        </Link>
      </AuthCard>
    );
  }
  return (
    <AuthCard title="Choose a new password" description="Use at least 10 characters.">
      <ResetPasswordForm token={value} />
    </AuthCard>
  );
}
