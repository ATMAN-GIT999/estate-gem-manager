import { useState } from "react";
import { format, startOfDay } from "date-fns";
import { ArrowRight, CalendarIcon } from "lucide-react";
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
  const today = startOfDay(new Date());

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <div className="relative z-30 mx-auto w-full max-w-[560px] overflow-visible rounded-2xl border border-border bg-background p-1.5 text-left shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.2)] md:rounded-full">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-0">
        <div className={cn("relative flex-1", fieldPad, fieldDivider)}>
          <span className={fieldLabel}>{t("wr-search-place-label")}</span>
          <select
            value={place}
            onChange={(e) => onPlaceChange(e.target.value as WinterRentalCity["slug"] | "")}
            aria-label={t("wr-search-place-label")}
            className="w-full appearance-none border-0 bg-transparent p-0 text-[15px] text-foreground focus:outline-none focus-visible:ring-0"
          >
            <option value="">{t("wr-search-place-any")}</option>
            {WINTER_RENTAL_CITIES.map((city) => (
              <option key={city.slug} value={city.slug}>
                {t(wrKey(city.slug, "name"))}
              </option>
            ))}
          </select>
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
              <Calendar
                mode="single"
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
