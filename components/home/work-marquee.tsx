import Link from "next/link";

/** Trust strip under the hero: shipped product names scrolling in a slow, edge-faded marquee (pauses on hover). */
export function WorkMarquee({ projects }: { projects: { slug: string; title: string }[] }) {
  if (!projects.length) return null;
  const row = (hidden: boolean) =>
    projects.map((p) => (
      <li key={`${hidden ? "b" : "a"}-${p.slug}`} className="shrink-0 pr-14 md:pr-24">
        <Link
          href={`/portfolio/${p.slug}`}
          tabIndex={hidden ? -1 : undefined}
          className="font-display text-2xl font-semibold tracking-[-0.03em] text-muted/70 transition-colors duration-300 hover:text-fg md:text-[1.75rem]"
        >
          {p.title}
        </Link>
      </li>
    ));

  return (
    <section aria-labelledby="shipped-heading" className="pb-6 pt-16 md:pt-20">
      <h2 id="shipped-heading" className="hud-label flex justify-center">
        Products we&apos;ve shipped
      </h2>
      <div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="animate-marquee flex w-max hover:[animation-play-state:paused]" style={{ ["--marquee-duration" as string]: "45s" }}>
          <ul className="flex">{row(false)}</ul>
          <ul className="flex" aria-hidden>
            {row(true)}
          </ul>
        </div>
      </div>
    </section>
  );
}
