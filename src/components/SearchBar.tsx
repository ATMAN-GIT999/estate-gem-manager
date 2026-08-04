import { useState } from "react";
import { addDays, format, startOfDay } from "date-fns";
import { CalendarIcon, Minus, Plus, Search, Users } from "lucide-react";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
}

/** Shared styling for the three popover triggers, so they line up exactly. */
const triggerClass =
  "border-0 bg-transparent p-0 h-auto font-normal justify-start text-left " +
  "hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0";

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
}: SearchBarProps) => {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const today = startOfDay(new Date());

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
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
        className="flex flex-col md:flex-row items-stretch md:items-center gap-2"
      >
        <div className={cn("flex-1", fieldDivider)}>
          <LocationAutocomplete value={location} onChange={onLocationChange} placeholder="Where to?" />
        </div>

        <div className={cn("flex-1 flex items-center gap-3 px-4 py-2", fieldDivider)}>
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

        <div className={cn("flex-1 flex items-center gap-3 px-4 py-2", fieldDivider)}>
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

        <div className="flex-1 flex items-center gap-3 px-4 py-2">
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
