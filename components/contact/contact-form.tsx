"use client";

import { AnimatePresence, motion } from "motion/react";
import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { buttonClass } from "@/components/site/ui";
import { submitContact, type ContactState } from "@/lib/actions/contact";
import { cn } from "@/lib/utils";

const BUDGETS = ["< ₦5M", "₦5M – ₦20M", "₦20M – ₦50M", "₦50M+", "Not sure yet"];

const inputClass =
  "w-full rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 text-[0.95rem] text-fg outline-none transition-colors placeholder:text-muted/70 focus:border-cyan focus:ring-3 focus:ring-[var(--glow)] aria-[invalid=true]:border-danger";

function Field({ label, name, error, textarea, ...props }: { label: string; name: string; error?: string; textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} name={name} rows={5} className={cn(inputClass, "resize-y")} aria-invalid={Boolean(error)} required={props.required} />
      ) : (
        <input id={id} name={name} className={inputClass} aria-invalid={Boolean(error)} {...props} />
      )}
      {error && <span className="mt-1.5 block text-sm text-danger">{error}</span>}
    </div>
  );
}

const chip = (on: boolean) =>
  cn(
    "cursor-pointer rounded-lg border px-3.5 py-2 text-sm transition-colors duration-200",
    on ? "border-cyan bg-cyan text-accent-ink" : "border-line-strong text-muted hover:border-fg/40 hover:text-fg",
  );

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
        <motion.div ref={done} key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center rounded-xl border border-line bg-surface p-12 text-center" role="status">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ok/15 text-ok">
            <Check className="h-7 w-7" />
          </span>
          <h2 className="mt-6 font-display text-2xl font-semibold">Thank you. Your message has been sent.</h2>
          <p className="mt-3 max-w-sm text-muted">{state.message ?? "Thanks! We'll be in touch shortly."}</p>
        </motion.div>
      ) : (
        <motion.form key="form" action={action} exit={{ opacity: 0, y: -20 }} className="relative space-y-6 rounded-xl border border-line bg-surface p-6 shadow-[0_1px_2px_var(--shadow)] md:p-8" noValidate>
          <div>
            <h2 className="font-display text-xl font-semibold">Tell us about your project</h2>
            <p className="mt-1 text-sm text-muted">Fields marked * are required.</p>
          </div>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Full name *" name="name" autoComplete="name" required error={state.errors?.name} />
            <Field label="Email address *" name="email" type="email" autoComplete="email" required error={state.errors?.email} />
          </div>
          <Field label="Company (optional)" name="company" autoComplete="organization" />

          <fieldset>
            <legend className="text-sm font-medium">I&apos;m interested in</legend>
            <input type="hidden" name="service" value={service} />
            <div className="mt-2.5 flex flex-wrap gap-2">
              {services.map((s) => (
                <button type="button" key={s} onClick={() => setService(s === service ? "" : s)} aria-pressed={service === s} className={chip(service === s)}>
                  {s}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium">Estimated budget</legend>
            <input type="hidden" name="budget" value={budget} />
            <div className="mt-2.5 flex flex-wrap gap-2">
              {BUDGETS.map((b) => (
                <button type="button" key={b} onClick={() => setBudget(b === budget ? "" : b)} aria-pressed={budget === b} className={chip(budget === b)}>
                  {b}
                </button>
              ))}
            </div>
          </fieldset>

          <Field label="Project details *" name="body" textarea required error={state.errors?.body} />

          <button type="submit" disabled={pending} className={cn(buttonClass("primary"), "w-full cursor-pointer py-3.5 disabled:cursor-wait disabled:opacity-70 md:w-auto")}>
            {pending ? "Sending…" : "Send message"}
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
