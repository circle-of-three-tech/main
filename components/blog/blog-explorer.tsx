"use client";

import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PostCard, type PostCardData } from "@/components/site/post-card";
import { cn } from "@/lib/utils";

type Post = PostCardData & { tags: string[]; featured: boolean };

export function BlogExplorer({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);

  // Supports the sitelinks SearchAction: /blog?q=term
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (!q) return;
    const id = requestAnimationFrame(() => setQuery(q));
    return () => cancelAnimationFrame(id);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = posts.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))),
  );
  const [lead, ...rest] = filtered;

  return (
    <div>
      <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={cn("relative rounded-full border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] transition-colors", category === c ? "text-ink" : "text-muted hover:text-fg")}
            >
              {category === c && <motion.span layoutId="blog-pill" className="absolute inset-0 rounded-full bg-cyan" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </div>
        <label className="glass flex w-full items-center gap-3 rounded-full px-5 py-3 md:w-80">
          <Search className="h-4 w-4 text-cyan" aria-hidden />
          <span className="sr-only">Search articles</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search insights…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted" type="search" />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="py-24 text-center text-muted">No articles match “{query}”. Try another term.</p>
      ) : (
        <AnimatePresence mode="popLayout">
          {lead && (
            <motion.div key={`lead-${lead.slug}`} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mb-20">
              <PostCard post={lead} large />
            </motion.div>
          )}
          <motion.ul layout className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <motion.li key={p.slug} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}>
                <PostCard post={p} />
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}
    </div>
  );
}
