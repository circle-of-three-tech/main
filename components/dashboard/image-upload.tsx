"use client";

import Image from "next/image";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Upload failed");
  return json.url as string;
}

function DropZone({ onFiles, busy, multiple, className }: { onFiles: (files: File[]) => void; busy: boolean; multiple?: boolean; className?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <button
      type="button"
      onClick={() => input.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onFiles(Array.from(e.dataTransfer.files));
      }}
      className={cn("flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-ink/40 p-6 text-sm text-muted transition hover:border-cyan hover:text-fg", over && "border-cyan bg-cyan/5", className)}
    >
      {busy ? <Loader2 className="h-6 w-6 animate-spin text-cyan" /> : <ImagePlus className="h-6 w-6 text-cyan" />}
      <span>{busy ? "Uploading…" : "Drop an image or click to upload"}</span>
      <span className="text-xs text-muted/70">PNG, JPG, WebP, AVIF · max 8MB</span>
      <input ref={input} type="file" accept="image/*" multiple={multiple} className="hidden" onChange={(e) => onFiles(Array.from(e.target.files ?? []))} />
    </button>
  );
}

export function ImageUpload({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string | null }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const handle = async (files: File[]) => {
    if (!files[0]) return;
    setBusy(true);
    try {
      setUrl(await uploadImage(files[0]));
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-fg/90">{label}</span>
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-line">
          <Image src={url} alt="" fill sizes="360px" className="object-cover object-top" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/70 opacity-0 transition group-hover:opacity-100">
            <label className="cursor-pointer rounded-full bg-fg px-4 py-2 text-xs font-semibold text-ink">
              Replace
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handle(Array.from(e.target.files ?? []))} />
            </label>
            <button type="button" onClick={() => setUrl("")} className="rounded-full bg-danger p-2 text-ink" aria-label="Remove image">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/70">
              <Loader2 className="h-6 w-6 animate-spin text-cyan" />
            </div>
          )}
        </div>
      ) : (
        <DropZone onFiles={handle} busy={busy} />
      )}
    </div>
  );
}

export function GalleryUpload({ name, label, defaultValue = [] }: { name: string; label: string; defaultValue?: string[] }) {
  const [urls, setUrls] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const handle = async (files: File[]) => {
    setBusy(true);
    try {
      const uploaded = await Promise.all(files.map(uploadImage));
      setUrls((u) => [...u, ...uploaded]);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-fg/90">{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {urls.map((u) => (
          <div key={u} className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-line">
            <Image src={u} alt="" fill sizes="240px" className="object-cover" />
            <button type="button" onClick={() => setUrls(urls.filter((x) => x !== u))} className="absolute right-2 top-2 rounded-full bg-ink/80 p-1.5 opacity-0 transition group-hover:opacity-100" aria-label="Remove image">
              <Trash2 className="h-3.5 w-3.5 text-danger" />
            </button>
          </div>
        ))}
        <DropZone onFiles={handle} busy={busy} multiple className="aspect-[16/10] p-3" />
      </div>
    </div>
  );
}
