import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/lib/site";
import { DEFAULT_THEME, THEME_COLORS, themeScript } from "@/lib/theme-config";
import "./globals.css";

const display = Inter_Tight({ variable: "--font-display-face", subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const code = JetBrains_Mono({ variable: "--font-code-face", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Circle of Three Technologies | Nigerian Technology & Software Company",
    template: "%s | Circle of Three Technologies",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  alternates: { canonical: "/", types: { "application/rss+xml": `${site.url}/blog/rss.xml` } },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: "Circle of Three Technologies | Nigerian Technology & Software Company",
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: THEME_COLORS[DEFAULT_THEME],
  width: "device-width",
  initialScale: 1,
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" data-theme={DEFAULT_THEME} className={`${display.variable} ${inter.variable} ${code.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
