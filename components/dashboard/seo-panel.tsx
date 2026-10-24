"use client";

import { useState } from "react";
import { inputClass } from "./form";
import { cn } from "@/lib/utils";

function Counter({ value, ideal }: { value: number; ideal: [number, number] }) {
  const tone = value === 0 ? "text-muted" : value < ideal[0] ? "text-warn" : value > ideal[1] ? "text-danger" : "text-ok";
  return <span className={cn("font-mono text-xs", tone)}>{value}/{ideal[1]}</span>;
}

/** SEO overrides with a live Google result preview and length guidance. */
export function SeoPanel({ path, fallbackTitle, fallbackDescription, defaultTitle, defaultDescription }: { path: string; fallbackTitle: string; fallbackDescription: string; defaultTitle?: string | null; defaultDescription?: string | null }) {
  const [title, setTitle] = useState(defaultTitle ?? "");
  const [desc, setDesc] = useState(defaultDescription ?? "");
  const shownTitle = `${title || fallbackTitle} | Circle of Three Technologies`;
  const shownDesc = desc || fallbackDescription;
  const host = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://circleofthree.tech").replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 text-left">
        <p className="truncate text-xs text-[#202124]">{host} › {path.split("/").filter(Boolean).join(" › ")}</p>
        <p className="mt-1 line-clamp-1 text-lg leading-snug text-[#1a0dab]">{shownTitle}</p>
        <p className="mt-1 line-clamp-2 text-sm text-[#4d5156]">{shownDesc}</p>
      </div>
      <label className="block">
        <span className="mb-2 flex items-center justify-between text-sm font-medium">
          SEO title <Counter value={title.length} ideal={[30, 60]} />
        </span>
        <input name="seoTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={fallbackTitle} className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-2 flex items-center justify-between text-sm font-medium">
          Meta description <Counter value={desc.length} ideal={[110, 160]} />
        </span>
        <textarea name="seoDescription" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder={fallbackDescription} className={cn(inputClass, "resize-y")} />
      </label>
      <p className="text-xs text-muted">Leave blank to use the title and excerpt. Include your main keyword naturally, e.g. &ldquo;software company in Nigeria&rdquo;.</p>
    </div>
  );
}
