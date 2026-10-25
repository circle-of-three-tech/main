import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Cover image that fills its positioned parent.
 * (Scroll parallax was retired with the redesign; `speed` is accepted for API compatibility.)
 */
export function ParallaxImage({
  src,
  alt,
  sizes = "100vw",
  priority,
  className,
  imageClassName,
}: {
  src: StaticImageData | string;
  alt: string;
  speed?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} placeholder={typeof src === "string" ? "empty" : "blur"} className={cn("object-cover", imageClassName)} />
    </div>
  );
}

/** Static wrapper (scroll offset retired). */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Parallax({ children, offset, className }: { children: ReactNode; offset?: number; className?: string }) {
  return <div className={className}>{children}</div>;
}
