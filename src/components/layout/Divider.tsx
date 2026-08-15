import { cn } from "@/lib/utils";

/**
 * The hairline. Two weights, and the distinction matters:
 *
 * `rule` is structural — the thin line above an item in a grid, the thing that
 * replaced every bordered card on this site. It is quiet and appears often.
 *
 * `gold` is an accent, and §24 is explicit that it must NOT appear between
 * every section or it stops being one. Reserve it for a genuine chapter break.
 * For the seam where a green band meets a light one, use `edge` on <Section>
 * instead — that puts the line on the band itself, with no element between the
 * two backgrounds.
 */
interface DividerProps {
  tone?: "rule" | "gold";
  /** On the sage-green fill the structural rule has to lighten, not darken. */
  onPrimary?: boolean;
  className?: string;
}

const Divider = ({ tone = "rule", onPrimary = false, className }: DividerProps) => (
  <hr
    className={cn(
      "border-0 border-t",
      tone === "gold"
        ? onPrimary
          ? "border-t-accent-on-primary/40"
          : "border-t-accent/55"
        : onPrimary
          ? "border-t-primary-foreground/20"
          : "border-t-primary/15",
      className
    )}
  />
);

export default Divider;
