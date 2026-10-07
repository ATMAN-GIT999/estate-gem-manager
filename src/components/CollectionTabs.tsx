import { cn } from "@/lib/utils";

/**
 * The row of region tabs — "Costa del Sol · Vienna · Carinthia" — used on the
 * landing page above "Our homes" and again on /properties. One component so
 * the filter a guest learns on the home page is literally the same one they
 * find on the full list.
 */
interface CollectionTabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  current: T;
  onSelect: (id: T) => void;
  className?: string;
  /**
   * "boxed": the landing page's tabs (Almedin, 07.10.2026, Lovable reference) —
   * the active region is a solid ink block, the others hairline-outlined.
   * "underline" stays the default so /properties keeps the same filter it had.
   */
  variant?: "underline" | "boxed";
}

const CollectionTabs = <T extends string>({
  tabs,
  current,
  onSelect,
  className,
  variant = "underline",
}: CollectionTabsProps<T>) => (
  <div
    className={cn("flex flex-wrap", variant === "boxed" ? "gap-1" : "gap-x-6 gap-y-2", className)}
    role="tablist"
  >
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={tab.id === current}
        onClick={() => onSelect(tab.id)}
        className={cn(
          "t-meta transition-colors",
          variant === "boxed"
            ? cn(
                "border px-4 py-2.5",
                tab.id === current
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground"
              )
            : cn(
                "pb-1 border-b",
                tab.id === current
                  ? "text-accent-strong border-accent-strong"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default CollectionTabs;
