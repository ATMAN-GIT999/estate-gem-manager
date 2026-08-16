import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * A contained material inside a band — the deliberate exception to §25's
 * "fewer cards". A Surface is for the two places where a panel earns itself:
 * an input form, which benefits from a visible boundary, and the FAQ, which
 * §23 asks to share the hero's material so the two read as the same element
 * reappearing rather than two invented "light section" treatments.
 *
 * It is not a card. Do not wrap content blocks in it to give them edges —
 * that is the pattern the whole site was moved off (docs/DESIGN.md §6).
 */
const materialClass = {
  /** The polished silver-white from §23 — hero panel and FAQ share it. */
  silver: "bg-silver-shimmer shadow-soft",
  /** A plain light panel, for forms on a coloured band. */
  card: "bg-card shadow-soft",
  /** Outline only — a placeholder area that needs bounds but no fill. */
  outline: "border border-primary/15",
} as const;

const padClass = {
  sm: "px-sm py-md md:px-md",
  md: "px-sm py-lg md:px-lg",
  lg: "px-sm py-xl md:px-xl",
} as const;

interface SurfaceProps {
  children: ReactNode;
  material?: keyof typeof materialClass;
  pad?: keyof typeof padClass;
  className?: string;
}

const Surface = ({
  children,
  material = "silver",
  pad = "md",
  className,
}: SurfaceProps) => (
  <div
    className={cn(
      "relative rounded-[2rem]",
      materialClass[material],
      padClass[pad],
      className
    )}
  >
    {/* The silver material paints a sheen through an ::before overlay, which
        is positioned and would otherwise sit on top of in-flow content. This
        wrapper keeps whatever is inside above it at full contrast. */}
    <div className="relative z-10">{children}</div>
  </div>
);

export default Surface;
