"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ENDPOINT = "/api/track";

// The referrer and utm_source describe how the visit started, so only the first view in a tab carries them.
let landing = true;

function sessionId() {
  try {
    let id = sessionStorage.getItem("co3_sid");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("co3_sid", id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

/** Cookie-free page view tracker for the public site: one view per route change, plus the time the page was visible. */
export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/dashboard")) return;

    let referrer: string | undefined;
    let source: string | undefined;
    if (landing) {
      landing = false;
      try {
        if (document.referrer && new URL(document.referrer).host !== location.host) referrer = document.referrer;
      } catch {}
      source = new URLSearchParams(location.search).get("utm_source") ?? undefined;
    }

    let viewId: string | null = null;
    let visibleMs = 0;
    let visibleSince = document.visibilityState === "visible" ? performance.now() : 0;

    fetch(ENDPOINT, {
      method: "POST",
      keepalive: true,
      body: JSON.stringify({ type: "view", path: pathname, referrer, source, sessionId: sessionId() }),
    })
      .then((r) => (r.status === 200 ? r.json() : null))
      .then((d: { id?: string } | null) => {
        viewId = d?.id ?? null;
      })
      .catch(() => {});

    const elapsed = () => visibleMs + (visibleSince ? performance.now() - visibleSince : 0);
    // Reports the running total; later reports overwrite earlier ones, so tab switches don't cut the time short.
    const report = () => {
      if (!viewId) return;
      navigator.sendBeacon?.(ENDPOINT, JSON.stringify({ type: "leave", id: viewId, duration: Math.round(elapsed() / 1000) }));
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        visibleMs = elapsed();
        visibleSince = 0;
        report();
      } else {
        visibleSince = performance.now();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      report();
    };
  }, [pathname]);

  return null;
}
