import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/dashboard/auth-card";
import { LoginForm } from "@/components/dashboard/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthCard title="Co3 Studio" description="Sign in to manage your website content.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
