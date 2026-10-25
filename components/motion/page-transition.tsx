import { ViewTransition, type ReactNode } from "react";

/** Wrap each page's content: navigations use a short, quiet cross-fade. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="iris" exit="iris" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
