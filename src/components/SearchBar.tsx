import { useState } from "react";
import { addDays, format, startOfDay } from "date-fns";
import { CalendarIcon, Search, Users } from "lucide-react";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
}

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
}: SearchBarProps) => {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const today = startOfDay(new Date());

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

  return (
    <Card className="relative z-50 overflow-visible p-3 shadow-elegant bg-card/95 backdrop-blur">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
        className="flex flex-col md:flex-row items-stretch md:items-center gap-2"
      >
        <div className="flex-1 border-r border-border">
          <LocationAutocomplete value={location} onChange={onLocationChange} placeholder="Where to?" />
        </div>

        <div className="flex-1 flex items-center gap-3 px-4 py-2 border-r border-border">
          <CalendarIcon className="w-5 h-5 text-primary shrink-0" />
          <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 font-normal justify-start text-left hover:bg-transparent"
              >
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

        <div className="flex-1 flex items-center gap-3 px-4 py-2 border-r border-border">
          <CalendarIcon className="w-5 h-5 text-primary shrink-0" />
          <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 font-normal justify-start text-left hover:bg-transparent"
              >
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
          <Input
            type="number"
            min="1"
            placeholder="Guests"
            value={guests}
            onChange={(event) => onGuestsChange(event.target.value)}
            className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button
          type="submit"
          aria-label="Search properties"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft h-12 px-8 rounded-full"
        >
          <Search className="h-5 w-5" />
        </Button>
      </form>
    </Card>
  );
};

export default SearchBar;