import { ImageResponse } from "next/og";
import { markSvg } from "./mark";
import { site } from "./site";

export const ogSize = { width: 1200, height: 630 };

const mark = `data:image/svg+xml;base64,${Buffer.from(markSvg({ fg: "#F5F7FF", bg: "#05061A" })).toString("base64")}`;

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
          background: "radial-gradient(circle at 80% 20%, #1E2A8C 0%, #0B0F3A 35%, #05061A 75%)",
          color: "#F5F7FF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} width={84} height={84} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 26, letterSpacing: 8, fontWeight: 700 }}>CIRCLE OF THREE</span>
            <span style={{ fontSize: 16, letterSpacing: 14, color: "#8A93C9" }}>TECHNOLOGIES</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 24, letterSpacing: 6, color: "#3DF2FF", textTransform: "uppercase" }}>{eyebrow}</span>
          <span style={{ marginTop: 20, fontSize: title.length > 60 ? 54 : 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 1000 }}>{title}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22, color: "#8A93C9" }}>
          <span>Nigerian Technology & Software Company</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 12, height: 12, background: "#3DF2FF", transform: "rotate(45deg)" }} />
            {footer}
          </span>
        </div>
      </div>
    ),
    ogSize,
  );
}
