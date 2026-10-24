"use client";

import { Suspense, createContext, startTransition, useActionState, useContext, useEffect, useId, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import type { ActionState } from "@/lib/actions/content";
import { cn } from "@/lib/utils";

const ErrorsContext = createContext<Record<string, string>>({});

/** Wraps a server action: inline field errors, toast feedback and a sticky save bar. */
export function EntityForm({
  action,
  children,
  submitLabel = "Save changes",
  aside,
  className,
  inline,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
  submitLabel?: string;
  aside?: ReactNode;
  className?: string;
  /** Render the submit button in-flow instead of a sticky page-wide bar (for side-panel forms). */
  inline?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  useEffect(() => {
    if (state.ok && state.message) toast.success(state.message);
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <ErrorsContext value={state.fieldErrors ?? {}}>
      <Suspense>
        <QueryToasts />
      </Suspense>
      <form
        // Dispatch manually so React doesn't reset uncontrolled fields after the action.
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          startTransition(() => formAction(data));
        }}
        className={cn(inline ? "space-y-5" : "pb-28", className)}
      >
        <div className={cn("grid gap-6", aside && "xl:grid-cols-[minmax(0,1fr)_360px]")}>
          <div className="space-y-6">{children}</div>
          {aside && <div className="space-y-6">{aside}</div>}
        </div>
        {inline ? (
          <button type="submit" disabled={pending} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan px-6 py-2.5 text-sm font-semibold text-ink transition hover:brightness-110 disabled:opacity-60">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {pending ? "Saving…" : submitLabel}
          </button>
        ) : (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/80 backdrop-blur-xl lg:left-64">
          <div className="flex items-center justify-end gap-3 px-6 py-4">
            <span className="mr-auto hidden text-xs text-muted sm:block">Changes go live on the public site instantly after saving.</span>
            <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-cyan px-6 py-2.5 text-sm font-semibold text-ink transition hover:brightness-110 disabled:opacity-60">
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {pending ? "Saving…" : submitLabel}
            </button>
          </div>
        </div>
        )}
      </form>
    </ErrorsContext>
  );
}

export function useFieldError(name: string) {
  return useContext(ErrorsContext)[name];
}

export function Field({ label, name, hint, children, className }: { label: string; name: string; hint?: ReactNode; children: (id: string, invalid: boolean) => ReactNode; className?: string }) {
  const id = useId();
  const error = useFieldError(name);
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-fg/90">
        {label}
      </label>
      {children(id, Boolean(error))}
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-ink/60 px-4 py-2.5 text-sm text-fg outline-none transition placeholder:text-muted/60 focus:border-cyan/70 focus:ring-2 focus:ring-cyan/20 aria-[invalid=true]:border-danger";

export function TextField({ label, name, hint, className, ...props }: { label: string; name: string; hint?: ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field label={label} name={name} hint={hint} className={className}>
      {(id, invalid) => <input id={id} name={name} aria-invalid={invalid} className={inputClass} {...props} />}
    </Field>
  );
}

export function TextAreaField({ label, name, hint, className, ...props }: { label: string; name: string; hint?: ReactNode } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Field label={label} name={name} hint={hint} className={className}>
      {(id, invalid) => <textarea id={id} name={name} aria-invalid={invalid} rows={3} className={cn(inputClass, "resize-y")} {...props} />}
    </Field>
  );
}

export function SelectField({ label, name, options, hint, className, ...props }: { label: string; name: string; hint?: ReactNode; options: { value: string; label: string }[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Field label={label} name={name} hint={hint} className={className}>
      {(id, invalid) => (
        <select id={id} name={name} aria-invalid={invalid} className={inputClass} {...props}>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-indigo">
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

export function Toggle({ name, label, defaultChecked, hint }: { name: string; label: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
      <span className="relative inline-flex shrink-0">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="h-6 w-11 rounded-full border border-line bg-ink transition peer-checked:border-cyan peer-checked:bg-cyan/30 peer-focus-visible:ring-2 peer-focus-visible:ring-cyan" />
        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-muted transition-all peer-checked:translate-x-5 peer-checked:bg-cyan" />
      </span>
    </label>
  );
}

/** Shows a toast after redirects that carry ?created=1 or ?saved=1. */
export function QueryToasts() {
  const search = useSearchParams();
  useEffect(() => {
    if (search.get("created")) toast.success("Created successfully.");
    if (search.get("saved")) toast.success("Saved.");
  }, [search]);
  return null;
}
