"use client";

import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { inputClass, useFieldError } from "./form";
import { cn } from "@/lib/utils";

/** Chip input serialised to a hidden JSON array field. */
export function TagInput({ name, label, defaultValue = [], suggestions = [], hint }: { name: string; label: string; defaultValue?: string[]; suggestions?: string[]; hint?: string }) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState("");
  const error = useFieldError(name);

  const add = (value: string) => {
    const v = value.trim().replace(/,$/, "");
    if (v && !tags.includes(v)) setTags([...tags, v]);
    setDraft("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && tags.length) setTags(tags.slice(0, -1));
  };
  const remaining = suggestions.filter((s) => !tags.includes(s));

  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-fg/90">{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(tags)} />
      <div className={cn(inputClass, "flex min-h-11 flex-wrap items-center gap-2 py-2")}>
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-0.5 text-xs text-fg">
            {t}
            <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))} aria-label={`Remove ${t}`} className="text-muted hover:text-fg">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey} onBlur={() => draft && add(draft)} placeholder={tags.length ? "" : "Type and press Enter"} className="min-w-24 flex-1 bg-transparent outline-none placeholder:text-muted/60" aria-label={label} />
      </div>
      {remaining.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {remaining.map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="rounded-full border border-dashed border-line px-2.5 py-0.5 text-xs text-muted hover:border-cyan hover:text-cyan">
              + {s}
            </button>
          ))}
        </div>
      )}
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
