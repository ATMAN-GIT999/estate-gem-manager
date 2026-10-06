import { useState } from "react";
import { format, startOfDay } from "date-fns";
import { ArrowRight, CalendarIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";
import { WINTER_RENTAL_CITIES, wrKey, type WinterRentalCity } from "@/lib/winterRentals";

/**
 * The two-field pill that opens /winter-rentals — Place and Move-in date.
 * Deliberately not SearchBar.tsx with fields hidden: that bar's check-in/
 * check-out/guests are a nightly-stay shape (Guesty), and "Place" here is a
 * closed Select over the four known winter cities rather than
 * LocationAutocomplete's free text — there is no open-ended location set to
 * autocomplete against. Everything else (budget, bedrooms, stay length,
 * sort) lives in the filter strip below instead of in this bar, because it
 * refines the list in place rather than kicking off a new search.
 *
 * Same visual recipe as SearchBar.tsx on purpose (the pill, the gold
 * micro-labels, the circular arrow button) so the page reads as the same
 * product, not a second search widget with its own rules.
 */
const triggerClass =
  "border-0 bg-transparent p-0 h-auto font-normal justify-start text-left shadow-none " +
  "hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 " +
  "after:absolute after:inset-0 after:content-['']";

const fieldLabel = "block t-tag text-accent-strong mb-1";
const fieldPad = "px-6 py-2";
const fieldDivider = "border-b md:border-b-0 md:border-r border-border";

export interface WinterSearchValues {
  place: WinterRentalCity["slug"] | "";
  moveIn?: Date;
}

interface WinterSearchBarProps extends WinterSearchValues {
  onPlaceChange: (value: WinterRentalCity["slug"] | "") => void;
  onMoveInChange: (value: Date | undefined) => void;
  onSearch: () => void;
}

const WinterSearchBar = ({ place, moveIn, onPlaceChange, onMoveInChange, onSearch }: WinterSearchBarProps) => {
  const { t } = useLocale();
  const [moveInOpen, setMoveInOpen] = useState(false);
  const today = startOfDay(new Date());

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <div className="relative z-30 mx-auto w-full max-w-[640px] overflow-visible rounded-2xl border border-border bg-background p-1.5 text-left shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.2)] md:rounded-full">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-0">
        <div className={cn("flex-1", fieldPad, fieldDivider)}>
          <span className={fieldLabel}>{t("searchbar.whereLabel")}</span>
          <Select value={place || "any"} onValueChange={(v) => onPlaceChange(v === "any" ? "" : (v as WinterRentalCity["slug"]))}>
            <SelectTrigger className={cn(triggerClass, "flex w-full h-auto text-[15px] text-foreground [&>svg]:ml-auto [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:shrink-0 [&>svg]:text-muted-foreground")}>
              <SelectValue placeholder={t("searchbar.wherePlaceholder")} />
            </SelectTrigger>
            <SelectContent className="z-[70]">
              <SelectItem value="any">{t("searchbar.wherePlaceholder")}</SelectItem>
              {WINTER_RENTAL_CITIES.map((city) => (
                <SelectItem key={city.slug} value={city.slug}>
                  {t(wrKey(city.slug, "name"))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={cn("relative flex-1 shrink-0", fieldPad, fieldDivider)}>
          <span className={fieldLabel}>{t("wr-search-movein-label")}</span>
          <Popover open={moveInOpen} onOpenChange={setMoveInOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className={cn(triggerClass, "flex w-full items-center gap-1.5 text-[15px] text-foreground")}>
                <span className="truncate">{moveIn ? format(moveIn, "d MMM yyyy") : t("wr-search-movein-placeholder")}</span>
                <CalendarIcon className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[70] w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={moveIn}
                onSelect={(date) => {
                  onMoveInChange(date);
                  setMoveInOpen(false);
                }}
                disabled={(date) => date < today}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          type="submit"
          aria-label={t("searchbar.search")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-none rounded-full h-[52px] w-full md:w-[52px] shrink-0 p-0"
        >
          <ArrowRight className="h-5 w-5 hidden md:block" strokeWidth={1.75} />
          <span className="md:hidden inline-flex items-center gap-2">
            <Search className="h-4 w-4" />
            {t("searchbar.search")}
          </span>
        </Button>
      </form>
    </div>
  );
};

export default WinterSearchBar;
