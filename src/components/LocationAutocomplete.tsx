import { useMemo, useRef, useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { useLocale } from "@/contexts/LocaleContext";
import { ALL_DESTINATIONS } from "@/lib/destinations";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Gold micro-label rendered above the value, matching the other three SearchBar fields. */
  label?: string;
}

/**
 * Used to fetch suggestions from two places that could each surface a town
 * with zero Frontier inventory and no SEO intent behind it: whatever strings
 * happened to be in `properties.location`, and free-text results from
 * Nominatim's worldwide geocoder. Typing "Berlin" would offer Berlin, and
 * submitting it always lands on an empty results page — a dead end for the
 * guest and a thin, duplicate-shaped URL for a search engine to index.
 *
 * Now reads the same curated list the header's destinations panel shows
 * (`src/lib/destinations.ts`) — the search field never offers a place the
 * header doesn't also promise exists.
 */
const LocationAutocomplete = ({ value, onChange, placeholder, label }: LocationAutocompleteProps) => {
  const { t } = useLocale();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const query = inputValue.trim().toLowerCase();
    if (!query) return ALL_DESTINATIONS;
    // A place already chosen must not shrink the list to itself: reopening
    // the field after picking "Marbella" showed Marbella alone, which reads
    // as though it were the only place on offer.
    if (ALL_DESTINATIONS.some((d) => d.label.toLowerCase() === query)) return ALL_DESTINATIONS;
    return ALL_DESTINATIONS.filter((d) => d.label.toLowerCase().includes(query));
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleFocus = () => setShowSuggestions(true);

  /** Click anywhere in the field row — same as Check-in/Check-out/Guests,
   *  whose Button trigger covers the whole row rather than just an icon. */
  const handleRowClick = () => {
    setShowSuggestions(true);
    inputRef.current?.focus();
  };

  /** Explicit close affordance for the one case the row click can't cover:
   *  collapsing the list again without clicking away. Stops the click from
   *  bubbling to handleRowClick, which would otherwise immediately reopen
   *  what this just closed. Only refocuses the input when opening — a
   *  native button click steals focus from the input, and refocusing it
   *  after closing would fire `onFocus` and reopen the list right back up. */
  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowSuggestions((open) => {
      const next = !open;
      if (next) inputRef.current?.focus();
      return next;
    });
  };

  const handleSelectSuggestion = (label: string) => {
    setInputValue(label);
    onChange(label);
    setShowSuggestions(false);
  };

  return (
    // Popover instead of a hand-rolled absolute div, and for exactly the
    // reason Check-in/Check-out/Guests already use one: PopoverContent
    // portals to document.body, so it isn't clipped by Hero.tsx's own
    // `overflow-hidden` (there to crop the background video) the way a
    // plain nested absolute div was — that clipping, not a z-index problem,
    // was why the location dropdown used to vanish on the landing page.
    <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
      <PopoverAnchor asChild>
        <div className="relative" ref={rowRef}>
          {label && (
            <span className="block t-tag text-accent-strong mb-1">
              {label}
            </span>
          )}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={handleRowClick}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              placeholder={placeholder ?? t("searchbar.wherePlaceholder")}
              className="w-full min-w-0 bg-transparent border-0 p-0 h-auto text-[15px] text-foreground focus:outline-none focus:ring-0 placeholder:text-foreground placeholder:opacity-100"
            />
            <button
              type="button"
              onClick={toggleDropdown}
              aria-label={showSuggestions ? "Hide location suggestions" : "Show location suggestions"}
              aria-expanded={showSuggestions}
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showSuggestions && "rotate-180")} />
            </button>
          </div>
        </div>
      </PopoverAnchor>

      {suggestions.length > 0 && (
        <PopoverContent
          className="z-[70] w-max min-w-[240px] max-w-xs p-0 max-h-60 overflow-auto"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          // Radix doesn't know PopoverAnchor's contents belong to this
          // popover the way it would a PopoverTrigger's — every pointerdown
          // inside our own row (the chevron, the input, repositioning the
          // text cursor) reads as an "outside" click and closes this before
          // our own handlers even run, so the chevron's toggle and typing
          // itself both raced against Radix silently dismissing first.
          // Ignoring outside-pointerdowns that originate in our own row
          // leaves genuine outside clicks (the actual dismiss case) intact.
          onInteractOutside={(e) => {
            if (rowRef.current?.contains(e.target as Node)) e.preventDefault();
          }}
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion.label)}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm text-foreground">{suggestion.label}</span>
            </button>
          ))}
        </PopoverContent>
      )}
    </Popover>
  );
};

export default LocationAutocomplete;
