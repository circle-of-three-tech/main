"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Heading = { id: string; text: string; level: number };

/** Sticky table of contents; the active heading is tracked with IntersectionObserver. */
export function ArticleToc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;
  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-4 text-sm font-semibold">On this page</p>
      <ul className="relative space-y-1 border-l border-line">
        {headings.map((h) => (
          <li key={h.id} className="relative">
            {active === h.id && <motion.span layoutId="toc-active" className="absolute -left-px top-0 h-full w-0.5 bg-cyan" />}
            <a href={`#${h.id}`} className={cn("block py-1.5 leading-snug transition-colors", h.level === 3 ? "pl-8" : "pl-5", active === h.id ? "text-fg" : "text-muted hover:text-fg")}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
