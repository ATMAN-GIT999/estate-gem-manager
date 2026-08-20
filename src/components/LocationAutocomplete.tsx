import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { useLocale } from "@/contexts/LocaleContext";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Gold micro-label rendered above the value, matching the other three SearchBar fields. */
  label?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  name: string;
  lat: string;
  lon: string;
}

/**
 * Was a fixed list of eight Costa del Sol towns, entirely disconnected from
 * what properties actually exist — four of the eight (Estepona, Benalmádena,
 * Mijas, Nerja) have never had a single listing, while real, booked-out
 * locations (Benahavís, Calahonda, Río Real, Sauerwald, Wien) never appeared
 * as a suggestion at all. Fetched from the real data instead, once per
 * mount, so the two can't drift apart again regardless of which properties
 * are active later.
 *
 * Both call sites (`Properties.tsx`, `Hero.tsx` via `SearchBar`) get this for
 * free without either passing property data down as a prop — `Hero.tsx`
 * doesn't fetch properties at all today, and making it do so just to feed
 * this list would be the more invasive change.
 */
const useRealLocations = () => {
  const [locations, setLocations] = useState<NominatimResult[]>([]);

  useEffect(() => {
    let cancelled = false;
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("location")
        .eq("available", true);
      if (cancelled || error || !data) return;

      // `location` sometimes carries a region suffix ("Fuengirola, Costa del
      // Sol") and sometimes doesn't ("Fuengirola") for what is the same town —
      // take the first comma segment and dedupe case-insensitively so the
      // list shows each place once.
      const byKey = new Map<string, string>();
      for (const row of data) {
        const city = row.location?.split(",")[0]?.trim();
        if (!city) continue;
        const key = city.toLowerCase();
        if (!byKey.has(key)) byKey.set(key, city);
      }

      const sorted = Array.from(byKey.values()).sort((a, b) => a.localeCompare(b));
      setLocations(
        sorted.map((city, index) => ({
          // Negative ids keep these out of the way of Nominatim's (positive)
          // place_ids when the two lists are combined below.
          place_id: -(index + 1),
          display_name: city,
          name: city,
          lat: "",
          lon: "",
        })),
      );
    };
    fetchLocations();
    return () => {
      cancelled = true;
    };
  }, []);

  return locations;
};

const LocationAutocomplete = ({ value, onChange, placeholder, label }: LocationAutocompleteProps) => {
  const { t } = useLocale();
  const realLocations = useRealLocations();
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const searchLocations = async (query: string) => {
    if (query.length < 1) {
      // Show the real, currently-booked locations when empty or just starting
      setSuggestions(realLocations);
      setShowSuggestions(true);
      return;
    }

    // Filter real locations first
    const filteredLocal = realLocations.filter(loc =>
      loc.name.toLowerCase().includes(query.toLowerCase()) ||
      loc.display_name.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredLocal.length > 0) {
      setSuggestions(filteredLocal);
      setShowSuggestions(true);
    }

    if (query.length < 2) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&featuretype=city&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      const data: NominatimResult[] = await response.json();
      // Combine Costa del Sol results with API results, prioritizing local
      const combined = [...filteredLocal, ...data.filter(d => 
        !filteredLocal.some(l => l.name.toLowerCase() === (d.name || '').toLowerCase())
      )];
      setSuggestions(combined.slice(0, 8));
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setSuggestions(filteredLocal);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchLocations(newValue);
    }, 300);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      // Show the real, currently-booked locations on focus
      setSuggestions(realLocations);
      setShowSuggestions(true);
    }
  };

  /** Explicit open/close affordance, on top of the implicit focus/typing behaviour above. */
  const toggleDropdown = () => {
    if (showSuggestions) {
      setShowSuggestions(false);
      return;
    }
    if (inputValue) {
      searchLocations(inputValue);
    } else {
      setSuggestions(realLocations);
      setShowSuggestions(true);
    }
    inputRef.current?.focus();
  };

  const handleSelectSuggestion = (suggestion: NominatimResult) => {
    const shortName = suggestion.name || suggestion.display_name.split(',')[0];
    setInputValue(shortName);
    onChange(shortName);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const getShortName = (displayName: string) => {
    const parts = displayName.split(',');
    return parts.slice(0, 2).join(',').trim();
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
        <div className="relative">
          {label && (
            <span className="block text-[10px] font-bold uppercase tracking-wide text-accent-strong mb-0.5">
              {label}
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              placeholder={placeholder ?? t("searchbar.wherePlaceholder")}
              className="w-full min-w-0 bg-transparent border-0 p-0 h-auto text-sm text-foreground focus:outline-none focus:ring-0 placeholder:text-foreground placeholder:opacity-100"
            />
            {isLoading && (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground shrink-0" />
            )}
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
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 flex items-start gap-2"
            >
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm text-foreground">{getShortName(suggestion.display_name)}</span>
            </button>
          ))}
        </PopoverContent>
      )}
    </Popover>
  );
};

export default LocationAutocomplete;