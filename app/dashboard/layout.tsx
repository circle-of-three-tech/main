import type { Metadata } from "next";
import { ThemedToaster } from "@/components/theme/themed-toaster";

// The dashboard is per-user and request-time by design.
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Co3 Studio" },
  robots: { index: false, follow: false },
};

export default function DashboardRoot({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="min-h-dvh bg-ink">
      {children}
      <ThemedToaster />
    </div>
  );
}
