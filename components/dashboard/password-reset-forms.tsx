"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { requestPasswordReset, resetPassword, type ResetState } from "@/lib/actions/auth";
import { inputClass } from "./form";

const buttonClass =
  "group inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan px-6 py-3 font-semibold text-ink transition hover:brightness-110 disabled:opacity-60";

function Notice({ state }: { state: ResetState }) {
  if (state.error)
    return (
      <p role="alert" className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
        {state.error}
      </p>
    );
  if (state.message)
    return (
      <p role="status" className="rounded-lg border border-cyan/40 bg-cyan/10 px-3 py-2 text-sm">
        {state.message}
      </p>
    );
  return null;
}

const backToSignIn = (
  <p className="text-center text-sm text-muted">
    <Link href="/dashboard/login" className="hover:text-fg">
      Back to sign in
    </Link>
  </p>
);

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<ResetState, FormData>(requestPasswordReset, {});
  return (
    <form action={action} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Email</span>
        <input name="email" type="email" autoComplete="username" required className={inputClass} />
      </label>
      <Notice state={state} />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send reset link <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
      </button>
      {backToSignIn}
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ResetState, FormData>(resetPassword, {});
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      <label className="block">
        <span className="mb-2 block text-sm font-medium">New password</span>
        <input name="password" type="password" autoComplete="new-password" minLength={10} required className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Confirm new password</span>
        <input name="confirm" type="password" autoComplete="new-password" minLength={10} required className={inputClass} />
      </label>
      <Notice state={state} />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Update password <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
      </button>
      {backToSignIn}
    </form>
  );
}
