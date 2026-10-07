import { useEffect, useState } from "react";
import { format, startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { ArrowRight, CalendarIcon, Minus, Plus, Search, SlidersHorizontal } from "lucide-react";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";

/** Scroll offset at which the collapsible bar folds into its summary chip. */
const COLLAPSE_AT = 80;

/** Upper bound for the guest stepper. The largest villas sleep well under this. */
const MAX_GUESTS = 20;

export interface SearchBarValues {
  location: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  guests: string;
}

interface SearchBarProps extends SearchBarValues {
  onLocationChange: (value: string) => void;
  onCheckInChange: (value: Date | undefined) => void;
  onCheckOutChange: (value: Date | undefined) => void;
  onGuestsChange: (value: string) => void;
  onSearch: () => void;
  /**
   * Fold the bar into a one-line summary chip on mobile once the user scrolls
   * past the results, and after a search is submitted. Stacked on a phone the
   * full form is ~310px tall, which together with the header swallows about
   * half the viewport — the listings underneath were barely reachable.
   * Desktop is unaffected, where the bar is a single row anyway.
   */
  collapsible?: boolean;
  /**
   * Full container width instead of the centred 900px pill — Properties.tsx
   * (Almedin, 29.09.2026), so the bar lines up with the grid of photographs
   * under it instead of floating narrower than everything below it, on its
   * own beige band (the reference was avantstay.com's listings page: full
   * width, no coloured band). Only the width changes — same `md:rounded-full`
   * pill corners as Hero.tsx's bar; a first pass also flattened the corners
   * here to a rectangle, which just made the two look like different
   * controls (Almedin, 29.09.2026).
   */
  fullWidth?: boolean;
  /**
   * "editorial" is the landing hero's box (Almedin, 07.10.2026, the Lovable
   * reference): square, fields on hairline underlines, a black "Search homes"
   * button. Everywhere else keeps the pill — the controls inside are the same,
   * only the surface differs, so /properties still looks like itself.
   */
  variant?: "pill" | "editorial";
}

/**
 * Shared styling for the three popover triggers, so they line up exactly.
 * The label itself is only ~20px tall, well under the 24px WCAG 2.5.8 minimum,
 * so `after:inset-0` stretches an invisible hit area across the whole field row
 * (its `relative` parent). Tapping the icon or the padding opens the popover
 * too, without making the bar any taller.
 */
const triggerClass =
  "border-0 bg-transparent p-0 h-auto font-normal justify-start text-left " +
  "hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 " +
  "after:absolute after:inset-0 after:content-['']";

const SearchBar = ({
  location,
  checkInDate,
  checkOutDate,
  guests,
  onLocationChange,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onSearch,
  collapsible = false,
  fullWidth = false,
  variant = "pill",
}: SearchBarProps) => {
  const editorial = variant === "editorial";
  const { t } = useLocale();
  const [datesOpen, setDatesOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [manualExpand, setManualExpand] = useState(false);
  const isMobile = useIsMobile();
  const today = startOfDay(new Date());

  const canCollapse = collapsible && isMobile;
  // Derived from the live scroll position rather than from threshold
  // *crossings*: collapsing removes ~215px of layout, which can drop the page
  // back to the top on its own. A crossing-based rule then waits forever for an
  // upward crossing that never happens, and the bar stays folded at the top.
  const isCollapsed = canCollapse && scrolled && !manualExpand;

  useEffect(() => {
    if (!canCollapse) return;
    const onScroll = () => {
      const isScrolled = window.scrollY > COLLAPSE_AT;
      setScrolled(isScrolled);
      // Back at the top the bar is open anyway, so drop the manual override —
      // scrolling down again should fold it like the first time.
      if (!isScrolled) setManualExpand(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [canCollapse]);

  // 0 means "not set" — the Properties page treats a missing/0 guest count as
  // "don't filter", so the stepper has to be able to get back down to it.
  const guestCount = Math.max(0, parseInt(guests, 10) || 0);

  const setGuests = (next: number) => {
    const clamped = Math.min(MAX_GUESTS, Math.max(0, next));
    onGuestsChange(clamped === 0 ? "" : String(clamped));
  };

  /** One range picker instead of two single-date ones (Almedin, 04.10.2026)
   *  — `from`/`to` map straight onto the existing checkIn/checkOut state, so
   *  Hero.tsx and Properties.tsx need no changes. Closes itself only once
   *  both ends are picked; a `from`-only selection (the first click) leaves
   *  it open for the second.
   */
  const handleRangeSelect = (range: DateRange | undefined) => {
    onCheckInChange(range?.from);
    onCheckOutChange(range?.to);
    if (range?.from && range?.to) setDatesOpen(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch();
    // On a phone the expanded bar plus the header cover roughly half the
    // screen, so submitting from the top would leave the results almost
    // out of sight. Nudging past the threshold both folds the bar and brings
    // the listings up — one gesture instead of asking the user to scroll.
    if (canCollapse && window.scrollY <= COLLAPSE_AT) {
      window.scrollTo({ top: COLLAPSE_AT + 40, behavior: "smooth" });
    }
  };

  /** Human-readable digest of the current criteria, shown while collapsed. */
  const summary = () => {
    const dates = checkInDate
      ? checkOutDate
        ? `${format(checkInDate, "d MMM")} – ${format(checkOutDate, "d MMM")}`
        : `from ${format(checkInDate, "d MMM")}`
      : null;
    const rest = [dates, guestCount > 0 ? `${guestCount} ${t("searchbar.guestsPlural")}` : null].filter(Boolean);
    return {
      primary: location || t("searchbar.wherePlaceholder"),
      secondary: rest.length ? rest.join(" · ") : "Any dates · Any guests",
    };
  };

  if (isCollapsed) {
    const { primary, secondary } = summary();
    return (
      <button
        type="button"
        onClick={() => setManualExpand(true)}
        aria-label="Edit search"
        aria-expanded={false}
        className="flex w-full items-center gap-3 rounded-full border border-border bg-card px-4 py-2.5 text-left shadow-sm animate-fade-in"
      >
        <Search className="h-4 w-4 shrink-0 text-primary" />
        <span className="min-w-0 flex-1 truncate text-sm">
          <span className="font-medium text-foreground">{primary}</span>
          <span className="text-muted-foreground"> · {secondary}</span>
        </span>
        <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>
    );
  }

  // Stacked on mobile, so the dividers have to run horizontally there and
  // switch to vertical only once the fields sit side by side.
  const fieldDivider = editorial
    ? "border-b border-border"
    : "border-b md:border-b-0 md:border-r border-border";
  const fieldPad = editorial ? "pb-2 pt-1" : "px-6 py-2";
  // Gold micro-label above a dark value — the OmniVillas reference layout.
  // Same look everywhere the bar appears now (hero video, sticky filter
  // strip); the two call sites used to diverge here (colour, background),
  // which is why a `variant` prop existed — dropped along with that split.
  const fieldLabel = "block t-tag text-accent-strong mb-1";

  return (
    // z-30, not z-50: on Properties.tsx this bar sits directly under the
    // fixed Navigation, and Navigation's own Destinations sheet is also
    // z-50 — equal values fall back to DOM order, which put this bar on top
    // of that sheet and left it visibly overlapping the open panel (Almedin,
    // 29.09.2026). On Hero.tsx the bar sits inside that section's own
    // `relative z-10` Container instead, a nested stacking context this
    // z-30 never escapes, so it cannot repeat the clash there either way.
    // z-30 still clears ordinary page content on both; the popovers below
    // stay z-[70] and open above everything as before.
    //
    // `text-left` (Almedin, 29.09.2026): Hero.tsx's Container is `text-center`
    // for the eyebrow/headline above this bar, which this bar then inherited
    // for the first time once it moved back inside that Container — the
    // field labels (plain text, no alignment of their own) centred while
    // each value stayed put on the `text-left` its trigger Button sets
    // explicitly, so a label no longer sat over its own value. Resetting
    // alignment here means this bar looks the same regardless of what
    // alignment its call site happens to use.
    <div
      className={cn(
        "relative z-30 mx-auto w-full overflow-visible border border-border bg-background text-left",
        editorial
          ? "p-4 shadow-2xl md:p-5"
          : "rounded-2xl p-1.5 shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.2)] md:rounded-full",
        fullWidth || editorial ? "max-w-none" : "max-w-[900px]"
      )}
    >
      <form
        onSubmit={handleSubmit}
        className={cn(
          editorial
            ? "grid gap-x-5 gap-y-4 md:grid-cols-[1.3fr_1fr_1fr_auto] md:items-end"
            : "flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-0"
        )}
      >
        <div className={cn("flex-1", fieldPad, fieldDivider)}>
          <LocationAutocomplete value={location} onChange={onLocationChange} label={t("searchbar.whereLabel")} />
        </div>

        {/* Check-in and check-out merged into one range field (Almedin,
            04.10.2026) — one popover, one calendar, instead of clicking
            check-in then having a second popover open for check-out. */}
        <div className={cn("relative flex-1 shrink-0", fieldPad, fieldDivider)}>
          <span className={fieldLabel}>{t("searchbar.whenLabel")}</span>
          <Popover open={datesOpen} onOpenChange={setDatesOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className={cn(triggerClass, "flex w-full items-center gap-1.5 text-[15px] text-foreground")}>
                <span className="truncate">
                  {checkInDate
                    ? checkOutDate
                      ? `${format(checkInDate, "d MMM")} – ${format(checkOutDate, "d MMM yyyy")}`
                      : format(checkInDate, "d MMM yyyy")
                    : t("searchbar.when")}
                </span>
                <CalendarIcon className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[70] w-auto p-0" align="start">
              {/* numberOfMonths={2} (Almedin, 04.10.2026) — the current and
                  next month side by side, so picking a check-out a few weeks
                  out doesn't need a click through to the next page first. */}
              <Calendar
                mode="range"
                numberOfMonths={2}
                selected={{ from: checkInDate, to: checkOutDate }}
                onSelect={handleRangeSelect}
                disabled={(date) => date < today}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* A little wider than the other fields (`min-w`, not `flex-1`) so a
            two-digit guest count has room instead of looking squeezed. */}
        <div className={cn("relative shrink-0 min-w-[84px]", fieldPad, editorial && fieldDivider)}>
          <span className={fieldLabel}>{t("searchbar.whoLabel")}</span>
          <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className={cn(triggerClass, "text-[15px] text-foreground")}>
                {guestCount > 0 ? `${guestCount} ${guestCount === 1 ? t("searchbar.guest") : t("searchbar.guestsPlural")}` : t("searchbar.guests")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[70] w-72 p-4" align="start">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{t("searchbar.guestsPanelTitle")}</p>
                  <p className="text-xs text-muted-foreground">{t("searchbar.guestsPanelHint").replace("{max}", String(MAX_GUESTS))}</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* type="button" matters — these sit inside the search form
                      and would otherwise submit it on every tap. */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full shrink-0"
                    onClick={() => setGuests(guestCount - 1)}
                    disabled={guestCount <= 0}
                    aria-label="Decrease guests"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span
                    className="w-6 text-center text-base font-semibold tabular-nums"
                    aria-live="polite"
                  >
                    {guestCount}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full shrink-0"
                    onClick={() => setGuests(guestCount + 1)}
                    disabled={guestCount >= MAX_GUESTS}
                    aria-label="Increase guests"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {t("searchbar.leaveAtZero")}
              </p>
            </PopoverContent>
          </Popover>
        </div>

        {/* A 52px circle, not a labelled pill: on the wireframe's bar the
            three fields carry all the words and the button is the full stop.
            The label stays as the accessible name. */}
        <Button
          type="submit"
          aria-label={t("searchbar.search")}
          className={cn(
            "shadow-none shrink-0",
            editorial
              ? "t-meta h-auto w-full rounded-none bg-foreground px-7 py-4 text-background hover:bg-primary md:w-auto"
              : "bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-[52px] w-full md:w-[52px] p-0"
          )}
        >
          {editorial ? (
            <span className="inline-flex items-center gap-2">
              <Search className="h-4 w-4" />
              {t("searchbar.searchHomes")}
            </span>
          ) : (
            <>
              <ArrowRight className="h-5 w-5 hidden md:block" strokeWidth={1.75} />
              <span className="md:hidden inline-flex items-center gap-2">
                <Search className="h-4 w-4" />
                {t("searchbar.search")}
              </span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
