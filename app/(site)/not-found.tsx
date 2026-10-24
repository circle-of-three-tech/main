import { Co3Mark } from "@/components/brand/co3-mark";
import { ButtonLink } from "@/components/site/ui";
import { CircuitField } from "@/components/site/circuit-field";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <CircuitField seed={404} />
      <div className="container-x relative text-center">
        <Co3Mark label={false} className="mx-auto h-28 w-28 animate-spin-slow text-fg/80" />
        <p className="hud-label mt-10">Error 404 · Signal lost</p>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tight md:text-7xl">This circuit leads nowhere.</h1>
        <p className="mx-auto mt-6 max-w-md text-muted">The page you&apos;re looking for has moved or never existed. Let&apos;s reroute you.</p>
        <div className="mt-10 flex justify-center gap-4">
          <ButtonLink href="/">Back home</ButtonLink>
          <ButtonLink href="/portfolio" variant="ghost">See our work</ButtonLink>
        </div>
      </div>
    </section>
  );
}
