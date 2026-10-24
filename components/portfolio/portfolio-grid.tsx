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
      <div role="tablist" aria-label="Filter projects by category" className="mb-12 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={active === c}
            onClick={() => setActive(c)}
            className={cn("relative rounded-full border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] transition-colors", active === c ? "text-ink" : "text-muted hover:text-fg")}
          >
            {active === c && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-cyan" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>
      <motion.ul layout className="grid gap-8 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((item, i) => (
            <motion.li
              key={item.slug}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.06 }}
              className={cn(i % 2 === 1 && "md:mt-24")}
            >
              {item.node}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  );
}
