import { ViewTransition, type ReactNode } from "react";

/** Wrap each page's content: navigations reveal the new page through an iris that opens from the click point. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="iris" exit="iris" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
