"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/lib/theme";

export function ThemedToaster() {
  const theme = useTheme();
  return <Toaster theme={theme} position="top-right" richColors toastOptions={{ style: { background: "var(--indigo)", border: "1px solid var(--line)" } }} />;
}
