import type { Metadata } from "next";
import { Suspense } from "react";
import { Co3Mark } from "@/components/brand/co3-mark";
import { CircuitField } from "@/components/site/circuit-field";
import { LoginForm } from "@/components/dashboard/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden p-6">
      <CircuitField seed={21} />
      <div className="glass hud relative w-full max-w-md rounded-3xl p-8 md:p-10">
        <Co3Mark assemble className="mx-auto h-20 w-20 text-fg" />
        <h1 className="mt-6 text-center font-display text-2xl font-bold">Co3 Studio</h1>
        <p className="mb-8 mt-1 text-center text-sm text-muted">Sign in to manage your website content.</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
