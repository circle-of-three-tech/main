import type { Metadata } from "next";
import { AuthCard } from "@/components/dashboard/auth-card";
import { ForgotPasswordForm } from "@/components/dashboard/password-reset-forms";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Forgot your password?" description="Enter your account email and we'll send you a link to choose a new one.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
