import { ButtonLink } from "@/components/site/ui";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center pb-20 pt-36">
      <div className="container-x max-w-2xl text-center">
        <p className="hud-label">Error 404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.03em] md:text-5xl">We couldn&apos;t find that page.</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted">The page you&apos;re looking for may have moved or no longer exists.</p>
        <div className="mt-9 flex justify-center gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Contact us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
