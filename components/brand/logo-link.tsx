import Link from "next/link";
import { cn } from "@/lib/utils";
import { Co3Mark } from "./co3-mark";

/** Logo lockup. `compact` hides the wordmark below the `sm` breakpoint (used inside the header pill). */
export function LogoLink({ compact, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label="Circle of Three Technologies home">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-fg">
        <Co3Mark label={false} className="h-7 w-7" />
      </span>
      <span className={cn("leading-none", compact && "hidden sm:block")}>
        <span className="block font-display text-[0.92rem] font-bold tracking-[-0.02em] text-fg">Circle of Three</span>
        <span className="mt-1 block text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-muted">Technologies</span>
      </span>
    </Link>
  );
}
