import { cn } from "@/lib/utils";

/**
 * The hairline. Three weights, and the distinction matters:
 *
 * `rule` is structural — the thin line above an item in a grid, the thing that
 * replaced every bordered card on this site. It is quiet and appears often.
 *
 * `gold` is an accent, and §24 is explicit that it must NOT appear between
 * every section or it stops being one. Reserve it for a genuine chapter break.
 * For the seam where a green band meets a light one, use `edge` on <Section>
 * instead — that puts the line on the band itself, with no element between the
 * two backgrounds.
 *
 * `bar` is `gold` at full opacity, 56px wide and 2px thick instead of full
 * width — a mark that opens one card's own text block (Proof's case studies),
 * not a rule that separates rows in a list. Do not use it where `rule` is
 * doing structural work (the FAQ's row separators, for one): a list needs a
 * line the reader's eye can follow across the whole width, and a short bar
 * under only the first row would just look like the rest went missing.
 */
interface DividerProps {
  tone?: "rule" | "gold" | "bar";
  /** On the sage-green fill the structural rule has to lighten, not darken. */
  onPrimary?: boolean;
  className?: string;
}

const Divider = ({ tone = "rule", onPrimary = false, className }: DividerProps) => (
  <hr
    className={cn(
      "border-0",
      tone === "bar"
        ? cn("w-14 border-t-2", onPrimary ? "border-t-accent-on-primary" : "border-t-accent")
        : cn(
            "border-t",
            tone === "gold"
              ? onPrimary
                ? "border-t-accent-on-primary/40"
                : "border-t-accent/55"
              : onPrimary
                ? "border-t-primary-foreground/20"
                : "border-t-primary/15"
          ),
      className
    )}
  />
);

export default Divider;
