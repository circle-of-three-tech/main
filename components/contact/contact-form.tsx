"use client";

import { AnimatePresence, motion } from "motion/react";
import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { submitContact, type ContactState } from "@/lib/actions/contact";
import { cn } from "@/lib/utils";

const BUDGETS = ["< ₦5M", "₦5M – ₦20M", "₦20M – ₦50M", "₦50M+", "Not sure yet"];

function Field({ label, name, error, textarea, ...props }: { label: string; name: string; error?: string; textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  const base = "peer w-full border-b border-line bg-transparent pb-3 pt-7 text-lg text-fg outline-none transition-colors placeholder:text-transparent focus:border-cyan";
  return (
    <label className="relative block">
      {textarea ? (
        <textarea name={name} rows={5} placeholder={label} className={cn(base, "resize-none")} aria-invalid={Boolean(error)} required={props.required} />
      ) : (
        <input name={name} placeholder={label} className={base} aria-invalid={Boolean(error)} {...props} />
      )}
      <span className="pointer-events-none absolute left-0 top-7 text-lg text-muted transition-all duration-300 peer-focus:top-0 peer-focus:text-xs peer-focus:text-cyan peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs">
        {label}
      </span>
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-cyan transition-transform duration-500 peer-focus:scale-x-100" />
      {error && <span className="mt-2 block text-sm text-danger">{error}</span>}
    </label>
  );
}

export function ContactForm({ services }: { services: string[] }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { ok: false });
  const [budget, setBudget] = useState("");
  const [service, setService] = useState("");
  const done = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.ok) done.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state.ok]);

  return (
    <AnimatePresence mode="wait">
      {state.ok ? (
        <motion.div ref={done} key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass hud relative flex flex-col items-center rounded-3xl p-12 text-center" role="status">
          <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 14 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan text-ink shadow-[0_0_50px_var(--glow)]">
            <Check className="h-10 w-10" />
          </motion.span>
          <h2 className="mt-8 font-display text-3xl font-bold">Signal received.</h2>
          <p className="mt-3 max-w-sm text-muted">{state.message ?? "Thanks! We'll be in touch shortly."}</p>
        </motion.div>
      ) : (
        <motion.form key="form" action={action} exit={{ opacity: 0, y: -20 }} className="glass relative space-y-8 rounded-3xl p-6 md:p-10" noValidate>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />
          <div className="grid gap-8 md:grid-cols-2">
            <Field label="Your name" name="name" autoComplete="name" required error={state.errors?.name} />
            <Field label="Email address" name="email" type="email" autoComplete="email" required error={state.errors?.email} />
          </div>
          <Field label="Company (optional)" name="company" autoComplete="organization" />

          <fieldset>
            <legend className="hud-label text-muted">I&apos;m interested in</legend>
            <input type="hidden" name="service" value={service} />
            <div className="mt-4 flex flex-wrap gap-2">
              {services.map((s) => (
                <button type="button" key={s} onClick={() => setService(s === service ? "" : s)} aria-pressed={service === s} className={cn("rounded-full border px-4 py-2 text-sm transition-all", service === s ? "border-cyan bg-cyan/15 text-fg" : "border-line text-muted hover:text-fg")}>
                  {s}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="hud-label text-muted">Estimated budget</legend>
            <input type="hidden" name="budget" value={budget} />
            <div className="mt-4 flex flex-wrap gap-2">
              {BUDGETS.map((b) => (
                <button type="button" key={b} onClick={() => setBudget(b === budget ? "" : b)} aria-pressed={budget === b} className={cn("rounded-full border px-4 py-2 text-sm transition-all", budget === b ? "border-violet bg-violet/20 text-fg" : "border-line text-muted hover:text-fg")}>
                  {b}
                </button>
              ))}
            </div>
          </fieldset>

          <Field label="Tell us about your project" name="body" textarea required error={state.errors?.body} />

          <button type="submit" disabled={pending} className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-fg px-8 py-5 font-semibold text-ink disabled:opacity-70 md:w-auto" data-cursor="Send">
            <span aria-hidden className="absolute inset-0 -translate-x-[101%] bg-cyan transition-transform duration-700 ease-expo group-hover:translate-x-0" />
            <span className="relative">{pending ? "Transmitting…" : "Send message"}</span>
            {pending ? <Loader2 className="relative h-5 w-5 animate-spin" /> : <ArrowUpRight className="relative h-5 w-5 transition-transform group-hover:rotate-45" />}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
