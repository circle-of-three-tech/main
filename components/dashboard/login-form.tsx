"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { login, type LoginState } from "@/lib/actions/auth";
import { inputClass } from "./form";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Email</span>
        <input name="email" type="email" autoComplete="username" required className={inputClass} />
      </label>
      {params.get("reset") && !state.error && (
        <p role="status" className="rounded-lg border border-cyan/40 bg-cyan/10 px-3 py-2 text-sm">
          Password updated. Sign in with your new password.
        </p>
      )}
      <label className="block">
        <span className="mb-2 flex items-center justify-between text-sm font-medium">
          Password
          <Link href="/dashboard/forgot-password" className="font-normal text-muted hover:text-fg">
            Forgot password?
          </Link>
        </span>
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      {state.error && (
        <p role="alert" className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan px-6 py-3 font-semibold text-ink transition hover:brightness-110 disabled:opacity-60">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
      </button>
    </form>
  );
}
