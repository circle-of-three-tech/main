"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { inputClass } from "./form";
import { cn } from "@/lib/utils";

type Row = Record<string, string | number>;

/** Repeatable rows (FAQs, metrics, stats) serialised to a hidden JSON field. */
export function PairList({ name, label, fields, defaultValue = [], multiline }: { name: string; label: string; fields: { key: string; placeholder: string; width?: string; type?: string }[]; defaultValue?: Row[]; multiline?: string }) {
  const [rows, setRows] = useState<Row[]>(defaultValue);
  const blank = Object.fromEntries(fields.map((f) => [f.key, ""]));
  const update = (i: number, key: string, value: string) => setRows(rows.map((r, j) => (j === i ? { ...r, [key]: value } : r)));

  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-fg/90">{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(rows.filter((r) => fields.some((f) => String(r[f.key] ?? "").trim())))} />
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-start gap-2">
            {fields.map((f) =>
              f.key === multiline ? (
                <textarea key={f.key} value={row[f.key] ?? ""} onChange={(e) => update(i, f.key, e.target.value)} placeholder={f.placeholder} rows={2} className={cn(inputClass, "flex-1 resize-y")} />
              ) : (
                <input key={f.key} type={f.type ?? "text"} step="any" value={row[f.key] ?? ""} onChange={(e) => update(i, f.key, e.target.value)} placeholder={f.placeholder} className={cn(inputClass, f.width ?? "flex-1")} />
              ),
            )}
            <button type="button" onClick={() => setRows(rows.filter((_, j) => j !== i))} className="mt-1.5 rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger" aria-label="Remove row">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setRows([...rows, blank])} className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-line px-3 py-1.5 text-xs text-muted hover:border-cyan hover:text-cyan">
        <Plus className="h-3.5 w-3.5" /> Add row
      </button>
    </div>
  );
}
