"use client";

import { Toaster } from "sonner";

export function ThemedToaster() {
  return <Toaster theme="light" position="top-right" richColors toastOptions={{ style: { background: "var(--indigo)", border: "1px solid var(--line)" } }} />;
}
