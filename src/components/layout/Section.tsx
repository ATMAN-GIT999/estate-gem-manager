import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import Container, { type Measure } from "./Container";

/**
 * A full-width band with contained content — the §5 shape:
 *
 *   ┌──────────── FULL-WIDTH SECTION ────────────┐
 *   │        ┌─── CONTENT CONTAINER ───┐         │
 *   └────────┴─────────────────────────┴─────────┘
 *
 * The background always runs edge to edge; the content never does. Sections
 * used to write that themselves and each one picked its own vertical padding
 * (`py-20`, `py-24 md:py-28`, `py-28 md:py-36`), which is the uneven rhythm
 * §6 describes. Here there are three sizes and nothing in between.
 */

/** Which surface the band paints. No new colours — these are the palette. */
const toneClass = {
  /** The page itself (#efe6d9). The default; most sections are this. */
  page: "bg-background",
  /** A half-step darker, for a band that should separate without shouting. */
  muted: "bg-secondary/30",
  /** The sage-green fill. Gold on this needs `accent-on-primary`. */
  primary: "bg-primary text-primary-foreground",
} as const;

/**
 * Vertical padding, from the ladder in index.css.
 *
 * `md` is the default and should stay the answer for almost everything — the
 * page reads as one system precisely because most bands breathe identically.
 * `lg` is for a band that genuinely opens a chapter; `sm` for a short closing
 * note that would look stranded with a full measure of air around it.
 */
const sizeClass = {
  none: "",
  sm: "py-lg",
  md: "py-xl",
  lg: "py-2xl",
} as const;

/** The gold seam from §24, at the transition between two surfaces. */
const edgeClass = {
  none: "",
  top: "edge-gold-top",
  bottom: "edge-gold-bottom",
  both: "edge-gold-top edge-gold-bottom",
} as const;

interface SectionProps {
  children: ReactNode;
  id?: string;
  tone?: keyof typeof toneClass;
  size?: keyof typeof sizeClass;
  edge?: keyof typeof edgeClass;
  measure?: Measure;
  /**
   * Render children directly into the band with no container. For sections
   * that manage their own width — a horizontally scrolling rail, an
   * edge-to-edge image row. Those should still use `.app-bleed-inset` so
   * their first item lines up with every other section's left edge.
   */
  bleed?: boolean;
  className?: string;
  containerClassName?: string;
}

const Section = ({
  children,
  id,
  tone = "page",
  size = "md",
  edge = "none",
  measure = "full",
  bleed = false,
  className,
  containerClassName,
}: SectionProps) => (
  <section
    id={id}
    className={cn(
      toneClass[tone],
      sizeClass[size],
      edgeClass[edge],
      // Anchor targets have to clear the fixed 80px header, or a jump from
      // the nav lands with the heading hidden underneath it.
      id && "scroll-mt-24",
      className
    )}
  >
    {bleed ? (
      children
    ) : (
      <Container measure={measure} className={containerClassName}>
        {children}
      </Container>
    )}
  </section>
);

export default Section;
