import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * The one grid. Two shapes, because the site only ever needs two:
 *
 * `<Grid cols={3}>`  — n equal columns that collapse to one on a phone. This
 *                      is what almost every section wants (three pillars, four
 *                      numbers, four features).
 * `<Grid>`           — the raw 12 columns from §4, for compositions where the
 *                      pieces are deliberately unequal (text 5 / image 7).
 *                      Children place themselves with `col-span-*`.
 *
 * Both share the same `gap`, so a four-column row and a text+image row have
 * their inner edges on the same rhythm.
 *
 * Class strings are written out in full rather than built from the `cols`
 * value — Tailwind scans source text, so `lg:grid-cols-${n}` would produce no
 * CSS at all.
 */
const colsClass = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
} as const;

const gapClass = {
  sm: "gap-x-sm gap-y-md",
  md: "gap-x-md gap-y-lg",
  lg: "gap-x-lg gap-y-xl",
} as const;

interface GridProps {
  children: ReactNode;
  /** Equal columns. Omit for the raw 12-column grid. */
  cols?: keyof typeof colsClass;
  gap?: keyof typeof gapClass;
  className?: string;
}

const Grid = ({ children, cols, gap = "md", className }: GridProps) => (
  <div
    className={cn(
      "grid",
      cols ? colsClass[cols] : "grid-cols-1 md:grid-cols-12",
      gapClass[gap],
      className
    )}
  >
    {children}
  </div>
);

export default Grid;
