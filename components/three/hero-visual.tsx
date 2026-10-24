"use client";

import dynamic from "next/dynamic";
import { useClientValue } from "@/lib/hooks";
import { Co3Mark } from "@/components/brand/co3-mark";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false, loading: () => <StaticMark /> });

function StaticMark() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative aspect-square w-[min(70%,420px)] text-fg/90">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(61,242,255,0.22),transparent_65%)] blur-2xl" />
        <Co3Mark label={false} className="relative h-full w-full animate-spin-slow [animation-duration:60s]" />
      </div>
    </div>
  );
}

let webglSupport: boolean | undefined;
function canUseWebgl() {
  if (webglSupport === undefined) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smallScreen = window.innerWidth < 768;
    const lowPower = (navigator.hardwareConcurrency ?? 8) < 4;
    const canvas = document.createElement("canvas");
    const hasGL = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    webglSupport = !reduce && !smallScreen && !lowPower && hasGL;
  }
  return webglSupport;
}

/** WebGL hero on capable devices; a lightweight animated SVG everywhere else. */
export function HeroVisual() {
  const webgl = useClientValue(canUseWebgl, false);
  if (!webgl) return <StaticMark />;
  return <HeroScene />;
}
