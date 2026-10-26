import type { ReactNode } from "react";
import { Co3Mark } from "@/components/brand/co3-mark";

/** Centred glass card shared by the signed-out dashboard pages (sign in, forgot and reset password). */
export function AuthCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-indigo p-6">
      <div className="glass relative w-full max-w-md rounded-2xl p-8 md:p-10">
        <Co3Mark label={false} className="mx-auto h-12 w-12 text-fg" />
        <h1 className="mt-6 text-center font-display text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mb-8 mt-1 text-center text-sm text-muted">{description}</p>
        {children}
      </div>
    </main>
  );
}
