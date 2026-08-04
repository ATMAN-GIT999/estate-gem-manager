import { useEffect, useState } from "react";
import { addDays, format, startOfDay } from "date-fns";
import { CalendarIcon, Minus, Plus, Search, SlidersHorizontal, Users } from "lucide-react";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
   * "floating" — raised card, for the hero where the bar sits over the video.
   * "inline"   — flat, for the sticky filter bar that already has its own
   *              background, border and shadow.
   */
  variant?: "floating" | "inline";
  /**
   * Fold the bar into a one-line summary chip on mobile once the user scrolls
   * past the results, and after a search is submitted. Stacked on a phone the
   * full form is ~310px tall, which together with the header swallows about
   * half the viewport — the listings underneath were barely reachable.
   * Desktop is unaffected, where the bar is a single row anyway.
   */
  collapsible?: boolean;
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
  variant = "floating",
  collapsible = false,
}: SearchBarProps) => {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
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

  const handleCheckInSelect = (date: Date | undefined) => {
    onCheckInChange(date);
    if (date && checkOutDate && checkOutDate <= date) {
      onCheckOutChange(undefined);
    }
    setCheckInOpen(false);
    if (date) {
      setTimeout(() => setCheckOutOpen(true), 100);
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    onCheckOutChange(date);
    setCheckOutOpen(false);
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
    const rest = [dates, guestCount > 0 ? `${guestCount} guests` : null].filter(Boolean);
    return {
      primary: location || "Anywhere",
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
  const fieldDivider = "border-b md:border-b-0 md:border-r border-border";

  return (
    <Card
      className={cn(
        "relative z-50 overflow-visible p-3",
        variant === "floating"
          ? "shadow-elegant bg-card/95 backdrop-blur"
          : "shadow-none bg-card",
      )}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-stretch md:items-center gap-2"
      >
        <div className={cn("flex-1", fieldDivider)}>
          <LocationAutocomplete value={location} onChange={onLocationChange} placeholder="Where to?" />
        </div>

        <div className={cn("relative flex-1 flex items-center gap-3 px-4 py-2", fieldDivider)}>
          <CalendarIcon className="w-5 h-5 text-primary shrink-0" />
          <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className={triggerClass}>
                {checkInDate ? format(checkInDate, "PPP") : "Check-in"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[70] w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkInDate}
                onSelect={handleCheckInSelect}
                disabled={(date) => date < today}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className={cn("relative flex-1 flex items-center gap-3 px-4 py-2", fieldDivider)}>
          <CalendarIcon className="w-5 h-5 text-primary shrink-0" />
          <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className={triggerClass}>
                {checkOutDate ? format(checkOutDate, "PPP") : "Check-out"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[70] w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOutDate}
                onSelect={handleCheckOutSelect}
                defaultMonth={checkInDate ? addDays(checkInDate, 1) : undefined}
                disabled={(date) => date < today || Boolean(checkInDate && date <= checkInDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="relative flex-1 flex items-center gap-3 px-4 py-2">
          <Users className="w-5 h-5 text-primary shrink-0" />
          <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className={triggerClass}>
                {guestCount > 0 ? `${guestCount} ${guestCount === 1 ? "guest" : "guests"}` : "Guests"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[70] w-72 p-4" align="start">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Guests</p>
                  <p className="text-xs text-muted-foreground">Up to {MAX_GUESTS} per stay</p>
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
                Leave at 0 to see every property.
              </p>
            </PopoverContent>
          </Popover>
        </div>

        <Button
          type="submit"
          aria-label="Search properties"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft h-12 px-8 shrink-0"
        >
          <Search className="h-5 w-5" />
        </Button>
      </form>
    </Card>
  );
};

export default SearchBar;
