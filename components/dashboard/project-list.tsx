"use client";

import Image from "next/image";
import Link from "next/link";
import { Reorder, useDragControls } from "motion/react";
import { GripVertical } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { reorderProjects } from "@/lib/actions/content";
import { Badge } from "./ui";

type Item = { id: string; title: string; client: string; category: string; coverImage: string | null; featured: boolean; published: boolean; year: number };

function Row({ item }: { item: Item }) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={item} dragListener={false} dragControls={controls} className="flex items-center gap-4 rounded-2xl border border-line bg-indigo/40 p-3" whileDrag={{ scale: 1.02, boxShadow: "0 20px 50px -20px rgba(61,242,255,0.4)" }}>
      <button type="button" onPointerDown={(e) => controls.start(e)} className="cursor-grab touch-none rounded-lg p-2 text-muted hover:text-fg active:cursor-grabbing" aria-label={`Drag to reorder ${item.title}`}>
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="relative hidden h-14 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-ink sm:block">
        {item.coverImage && <Image src={item.coverImage} alt="" fill sizes="96px" className="object-cover object-top" />}
      </div>
      <Link href={`/dashboard/projects/${item.id}`} className="min-w-0 flex-1">
        <span className="block truncate font-medium hover:text-cyan">{item.title}</span>
        <span className="block truncate text-sm text-muted">{item.client} · {item.category} · {item.year}</span>
      </Link>
      <div className="flex shrink-0 gap-2">
        {item.featured && <Badge tone="violet">Featured</Badge>}
        {item.published ? <Badge tone="green">Live</Badge> : <Badge tone="amber">Hidden</Badge>}
      </div>
    </Reorder.Item>
  );
}

export function ProjectList({ projects }: { projects: Item[] }) {
  const [items, setItems] = useState(projects);
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();
  return (
    <div>
      {dirty && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-cyan/30 bg-cyan/10 px-4 py-3 text-sm">
          <span>Order changed. Save to update the portfolio page.</span>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                await reorderProjects(items.map((i) => i.id));
                setDirty(false);
                toast.success("Order saved.");
              })
            }
            className="rounded-full bg-cyan px-4 py-1.5 font-semibold text-ink"
          >
            {pending ? "Saving…" : "Save order"}
          </button>
        </div>
      )}
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={(next) => {
          setItems(next);
          setDirty(true);
        }}
        className="space-y-2"
      >
        {items.map((item) => (
          <Row key={item.id} item={item} />
        ))}
      </Reorder.Group>
    </div>
  );
}
