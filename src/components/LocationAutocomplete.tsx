import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  name: string;
  lat: string;
  lon: string;
}

// Costa del Sol default suggestions
const costaDelSolLocations = [
  { place_id: 1, display_name: "Marbella, Málaga, Spain", name: "Marbella", lat: "36.5107", lon: "-4.8825" },
  { place_id: 2, display_name: "Málaga, Spain", name: "Málaga", lat: "36.7213", lon: "-4.4216" },
  { place_id: 3, display_name: "Estepona, Málaga, Spain", name: "Estepona", lat: "36.4267", lon: "-5.1459" },
  { place_id: 4, display_name: "Fuengirola, Málaga, Spain", name: "Fuengirola", lat: "36.5443", lon: "-4.6247" },
  { place_id: 5, display_name: "Benalmádena, Málaga, Spain", name: "Benalmádena", lat: "36.5989", lon: "-4.5168" },
  { place_id: 6, display_name: "Mijas, Málaga, Spain", name: "Mijas", lat: "36.5959", lon: "-4.6370" },
  { place_id: 7, display_name: "Torremolinos, Málaga, Spain", name: "Torremolinos", lat: "36.6216", lon: "-4.4998" },
  { place_id: 8, display_name: "Nerja, Málaga, Spain", name: "Nerja", lat: "36.7442", lon: "-3.8758" },
];

const LocationAutocomplete = ({ value, onChange, placeholder = "Where to?" }: LocationAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLocations = async (query: string) => {
    if (query.length < 1) {
      // Show Costa del Sol suggestions when empty or just starting
      setSuggestions(costaDelSolLocations);
      setShowSuggestions(true);
      return;
    }

    // Filter Costa del Sol locations first
    const filteredLocal = costaDelSolLocations.filter(loc => 
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
      // Show Costa del Sol suggestions on focus
      setSuggestions(costaDelSolLocations);
      setShowSuggestions(true);
    }
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
    <div ref={wrapperRef} className="relative flex-1">
      <div className="flex items-center gap-3 px-4 py-2">
        <MapPin className="w-5 h-5 text-primary shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full bg-transparent border-0 p-0 h-auto focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground"
        />
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground shrink-0" />
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto left-0">
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
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;