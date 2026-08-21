import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * The "1b" container from the design-system nachbesserung: a gold top rule
 * plus a faint tint of the surface's own fill colour, nothing else — no
 * border on the other three sides, no radius, no shadow. §6 of DESIGN.md
 * still holds ("fewer boxes"); this is the one shape that earns a box, for
 * content genuinely scanned side by side rather than read as prose — the six
 * system steps, the four portfolio numbers, the two commercial models, the
 * two side-door cards.
 *
 * Both the border and the tint are existing tokens, not new colour values:
 * `#b8964f` from the reference is `--accent` to within rounding, and the two
 * tint rgba()s it specified are `--primary` and `--primary-foreground` at
 * low, hand-picked opacities — so this needed no addition to the palette,
 * which CLAUDE.md keeps off-limits without asking.
 *
 * Padding is the one place this carries literal pixel values instead of the
 * spacing ladder. They come from an explicit client spec for this exact
 * shape (26/30/30 and 26/24/30), not from guessing past the ladder's steps —
 * changing them to the nearest `--space-*` token would quietly overrule that
 * spec rather than implement it.
 */
const toneClass = {
  light: "border-t-2 border-accent bg-primary/[0.055]",
  primary: "border-t-2 border-accent bg-primary-foreground/[0.06]",
} as const;

interface PanelProps {
  children: ReactNode;
  tone?: keyof typeof toneClass;
  className?: string;
}

const Panel = ({ children, tone = "light", className }: PanelProps) => (
  <div
    className={cn(
      toneClass[tone],
      "pt-[26px] pb-[30px] px-[24px] md:px-[30px]",
      className
    )}
  >
    {children}
  </div>
);

export default Panel;
