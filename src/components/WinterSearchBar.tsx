import { useState } from "react";
import { format, startOfDay } from "date-fns";
import { ArrowRight, CalendarIcon, ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";
import { WINTER_RENTAL_CITIES, wrKey, type WinterRentalCity } from "@/lib/winterRentals";

export interface WinterSearchBarProps {
  place: WinterRentalCity["slug"] | "";
  moveInDate?: Date;
  onPlaceChange: (value: WinterRentalCity["slug"] | "") => void;
  onMoveInChange: (value: Date | undefined) => void;
  onSearch: () => void;
}

/**
 * The hub's search field, built to the same recipe as SearchBar.tsx on
 * purpose — same rounded pill, shadow, field padding and heights, so the
 * guest who already knows the landing page's search recognises this one
 * instead of meeting a second control language (Almedin, 06.10.2026 — an
 * earlier square/hairline pass was a discarded detour, not the direction).
 * Only two fields, not three: a midterm let has no checkout date or guest
 * count to ask for here, just a place and a date to move in by.
 */
const triggerClass =
  "border-0 bg-transparent p-0 h-auto font-normal justify-start text-left " +
  "hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 " +
  "after:absolute after:inset-0 after:content-['']";

const fieldDivider = "border-b md:border-b-0 md:border-r border-border";
const fieldPad = "px-6 py-2";
const fieldLabel = "block t-tag text-accent-strong mb-1";

const WinterSearchBar = ({ place, moveInDate, onPlaceChange, onMoveInChange, onSearch }: WinterSearchBarProps) => {
  const { t } = useLocale();
  const [dateOpen, setDateOpen] = useState(false);
  const [placeOpen, setPlaceOpen] = useState(false);
  const today = startOfDay(new Date());

  const cityOptions = WINTER_RENTAL_CITIES.map((city) => ({
    slug: city.slug,
    label: t(wrKey(city.slug, "name")),
  }));
  const placeLabel = cityOptions.find((c) => c.slug === place)?.label ?? t("wr-search-place-any");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <div className="relative z-30 mx-auto w-full max-w-[560px] overflow-visible rounded-2xl border border-border bg-background p-1.5 text-left shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.2)] md:rounded-full">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-0">
        {/* A popover list, not a native <select>: the browser's own dropdown
            ignores the site's fonts, colours and rounded corners, so it read
            as a different control from the landing page's place field
            (Almedin, 07.10.2026). Same panel and rows as LocationAutocomplete
            — but a closed choice (five places, plus "all"), so there is no
            text input to type into. */}
        <div className={cn("relative flex-1", fieldPad, fieldDivider)}>
          <span className={fieldLabel}>{t("wr-search-place-label")}</span>
          <Popover open={placeOpen} onOpenChange={setPlaceOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                aria-label={t("wr-search-place-label")}
                className={cn(triggerClass, "flex w-full items-center gap-1.5 text-[15px] text-foreground")}
              >
                <span className="truncate">{placeLabel}</span>
                <ChevronDown
                  className={cn(
                    "ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
                    placeOpen && "rotate-180"
                  )}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[70] w-max min-w-[240px] max-w-xs p-0 max-h-60 overflow-auto" align="start" sideOffset={8}>
              {[{ slug: "" as const, label: t("wr-search-place-any") }, ...cityOptions].map((option) => (
                <button
                  key={option.slug || "all"}
                  type="button"
                  onClick={() => {
                    onPlaceChange(option.slug);
                    setPlaceOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 flex items-center gap-2",
                    option.slug === place && "bg-muted"
                  )}
                >
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm text-foreground">{option.label}</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        <div className={cn("relative flex-1", fieldPad)}>
          <span className={fieldLabel}>{t("wr-search-movein-label")}</span>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className={cn(triggerClass, "flex w-full items-center gap-1.5 text-[15px] text-foreground")}>
                <span className="truncate">
                  {moveInDate ? format(moveInDate, "d MMM yyyy") : t("wr-search-movein-any")}
                </span>
                <CalendarIcon className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[70] w-auto p-0" align="start">
              {/* Two months side by side, as on the landing page's bar —
                  Calendar stacks them on a phone by itself. */}
              <Calendar
                mode="single"
                numberOfMonths={2}
                selected={moveInDate}
                onSelect={(date) => {
                  onMoveInChange(date);
                  setDateOpen(false);
                }}
                disabled={(date) => date < today}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          type="submit"
          aria-label={t("wr-search-submit")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-none rounded-full h-[52px] w-full md:w-[52px] shrink-0 p-0"
        >
          <ArrowRight className="h-5 w-5 hidden md:block" strokeWidth={1.75} />
          <span className="md:hidden inline-flex items-center gap-2">{t("wr-search-submit")}</span>
        </Button>
      </form>
    </div>
  );
};

export default WinterSearchBar;
