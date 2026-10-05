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
}

const CollectionTabs = <T extends string>({ tabs, current, onSelect, className }: CollectionTabsProps<T>) => (
  <div className={cn("flex flex-wrap gap-x-6 gap-y-2", className)} role="tablist">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={tab.id === current}
        onClick={() => onSelect(tab.id)}
        className={cn(
          "t-meta pb-1 border-b transition-colors",
          tab.id === current
            ? "text-accent-strong border-accent-strong"
            : "text-muted-foreground border-transparent hover:text-foreground"
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default CollectionTabs;
