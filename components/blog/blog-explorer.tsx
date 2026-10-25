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
      <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200",
                category === c ? "border-fg bg-fg text-ink" : "border-line text-muted hover:border-line-strong hover:text-fg",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="flex w-full items-center gap-2.5 rounded-lg border border-line bg-surface px-3.5 py-2.5 transition-colors focus-within:border-cyan md:w-80">
          <Search className="h-4 w-4 text-muted" aria-hidden />
          <span className="sr-only">Search articles</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search insights…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted" type="search" />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="py-24 text-center text-muted">No articles match “{query}”. Try another term.</p>
      ) : (
        <AnimatePresence mode="popLayout">
          {lead && (
            <motion.div key={`lead-${lead.slug}`} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="mb-16 border-b border-line pb-16">
              <PostCard post={lead} large />
            </motion.div>
          )}
          <motion.ul layout className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <motion.li key={p.slug} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: Math.min(i, 5) * 0.03 }}>
                <PostCard post={p} />
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}
    </div>
  );
}
