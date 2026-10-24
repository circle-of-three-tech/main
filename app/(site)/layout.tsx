import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ClientEffects } from "@/components/motion/client-effects";
import { Cursor } from "@/components/motion/cursor";
import { Preloader } from "@/components/motion/preloader";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { JsonLd } from "@/components/seo/json-ld";
import { getSettings } from "@/lib/queries";
import { organizationJsonLd } from "@/lib/seo";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <>
      <JsonLd data={organizationJsonLd(settings)} />
      <a href="#main" className="sr-only z-[100] rounded-full bg-fg px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Preloader />
      <ScrollProgress />
      <SiteHeader />
      <main id="main" className="relative">
        {children}
      </main>
      <SiteFooter />
      <Cursor />
      <ClientEffects />
      <div className="grain" aria-hidden />
    </>
  );
}
