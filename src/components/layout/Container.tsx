import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

/**
 * The single content container for the whole public site.
 *
 * Every public section renders its content through this, which is what gives
 * the page one left and one right edge from the header to the footer. Before
 * it, sections combined `container mx-auto px-4` with their own `max-w-3xl`,
 * `max-w-4xl`, `max-w-5xl` or `max-w-6xl` — four different content edges on
 * one page, which is what the zoom-out test showed as "narrow content floating
 * in unused space".
 *
 * `width` is deliberately set through `min()` (see `.app-container` in
 * index.css) rather than `max-width` plus horizontal padding: that keeps the
 * gutter outside the box, so a 12-column Grid inside measures the real content
 * width and its column edges line up with every other section's.
 *
 * `measure` narrows the *text* without moving the container's edges. Reading
 * lines still need to be shorter than 1440px — the difference is that this
 * narrowing is now one named decision instead of a per-section max-width.
 */
const measureClass = {
  /** Full container width — grids, galleries, image compositions. */
  full: "",
  /** ~1024px — grids of three or four, wide editorial rows. */
  wide: "max-w-5xl mx-auto",
  /** ~768px — a section heading with its lead paragraph. */
  text: "max-w-3xl mx-auto",
  /** ~640px — a single short paragraph or a form. */
  narrow: "max-w-xl mx-auto",
} as const;

export type Measure = keyof typeof measureClass;

interface ContainerProps {
  children: ReactNode;
  measure?: Measure;
  className?: string;
  as?: ElementType;
}

const Container = ({
  children,
  measure = "full",
  className,
  as: Tag = "div",
}: ContainerProps) => (
  <Tag className={cn("app-container", measureClass[measure], className)}>
    {children}
  </Tag>
);

export default Container;
