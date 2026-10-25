"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Item = { slug: string; category: string; node: ReactNode };

/** Filter chips with a sliding indicator; cards re-flow with layout animations. */
export function PortfolioGrid({ items }: { items: Item[] }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category)))], [items]);
  const [active, setActive] = useState("All");
  const visible = items.filter((i) => active === "All" || i.category === active);

  return (
    <LayoutGroup>
      <div role="tablist" aria-label="Filter projects by category" className="mb-10 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={active === c}
            onClick={() => setActive(c)}
            className={cn(
              "cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200",
              active === c ? "border-fg bg-fg text-ink" : "border-line text-muted hover:border-line-strong hover:text-fg",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <motion.ul layout className="grid gap-x-8 gap-y-14 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((item, i) => (
            <motion.li
              key={item.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.04 }}
            >
              {item.node}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  );
}
