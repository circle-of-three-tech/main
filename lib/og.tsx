import { ImageResponse } from "next/og";
import { markSvg } from "./mark";
import { site } from "./site";

export const ogSize = { width: 1200, height: 630 };

const mark = `data:image/svg+xml;base64,${Buffer.from(markSvg({ fg: "#FFFFFF", bg: "#0A1E36" })).toString("base64")}`;

/** Branded Open Graph card shared by every route. */
export function renderOg({ eyebrow, title, footer = new URL(site.url).host }: { eyebrow: string; title: string; footer?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0A1E36",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} width={84} height={84} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>Circle of Three</span>
            <span style={{ fontSize: 15, letterSpacing: 5, color: "#9AA3B5" }}>TECHNOLOGIES</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 22, letterSpacing: 3, color: "#4DA3FF", textTransform: "uppercase", fontWeight: 600 }}>{eyebrow}</span>
          <span style={{ marginTop: 20, fontSize: title.length > 60 ? 54 : 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1000 }}>{title}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22, color: "#9AA3B5" }}>
          <span>Nigerian Technology & Software Company</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#F97316" }} />
            {footer}
          </span>
        </div>
      </div>
    ),
    ogSize,
  );
}
