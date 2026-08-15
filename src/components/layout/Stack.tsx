import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Vertical rhythm inside a section, off the same ladder the sections
 * themselves use. It replaces the trail of `mb-4` / `mb-5` / `mb-6` / `mb-8` /
 * `mb-12` / `mb-14` / `mb-16` / `mb-20` that each block used to carry: the
 * gap belongs to the group, not to each child, so removing an element cannot
 * leave a dangling margin behind.
 */
const gapClass = {
  xs: "space-y-xs",
  sm: "space-y-sm",
  md: "space-y-md",
  lg: "space-y-lg",
  xl: "space-y-xl",
} as const;

interface StackProps {
  children: ReactNode;
  gap?: keyof typeof gapClass;
  align?: "left" | "center";
  className?: string;
}

const Stack = ({ children, gap = "md", align = "left", className }: StackProps) => (
  <div
    className={cn(gapClass[gap], align === "center" && "text-center", className)}
  >
    {children}
  </div>
);

export default Stack;
