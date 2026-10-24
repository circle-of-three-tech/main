import { renderOg, ogSize } from "@/lib/og";

export const alt = "Circle of Three Technologies: Nigerian technology and software company";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Build · Scale · Transform", title: "Nigerian software, engineered for the world." });
}
