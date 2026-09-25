/**
 * The one list of places Frontier deliberately surfaces anywhere on the site —
 * the header's destinations panel (Navigation.tsx) and the search bar's
 * location suggestions (LocationAutocomplete.tsx) both read from this, so a
 * guest is never offered a place in the search field that the header itself
 * doesn't also promise exists.
 *
 * Since 26.09.2026 it is exactly the five places that have a location page
 * (Almedin: Málaga, Marbella and Fuengirola are the Spanish places the SEO
 * structure is built around). Estepona and Benalmádena were on this list from
 * 29.08.2026 as places Frontier wanted to be found for ahead of having a home
 * there — but choosing one always ended in "no match", which reads as a
 * broken search, and a place without stock gets no page (docs/seo/struktur.md
 * §11). Add a place back when it has a home and a page, not before.
 *
 * Before this file existed, the search bar pulled suggestions from two other
 * sources instead: whatever strings happened to be in `properties.location`,
 * and free-text results from Nominatim's worldwide geocoder. Both could
 * surface a town with zero inventory and no SEO intent behind it — typing
 * "Berlin" would offer Berlin, and submitting it always lands on an empty
 * results page. That's a dead end for the guest and a thin/duplicate-content
 * URL for a search engine to index, not a lead.
 */
export type CityGroup = "malaga" | "marbella" | "fuengirola" | "vienna" | "carinthia";

export interface Destination {
  label: string;
  query: string;
  /**
   * The place's `properties.city_group`, which is also its location page
   * (`/vacation-rentals/<page>`). Browsing links (the header panel, the
   * landing-page rail) open that page; the search filters on the column.
   */
  page: CityGroup;
}

export const SPAIN_DESTINATIONS: Destination[] = [
  { label: "Málaga", query: "Málaga", page: "malaga" },
  { label: "Marbella", query: "Marbella", page: "marbella" },
  { label: "Fuengirola", query: "Fuengirola", page: "fuengirola" },
];

export const AUSTRIA_DESTINATIONS: Destination[] = [
  { label: "Vienna", query: "Vienna", page: "vienna" },
  { label: "Carinthia", query: "Carinthia", page: "carinthia" },
];

export const ALL_DESTINATIONS: Destination[] = [...SPAIN_DESTINATIONS, ...AUSTRIA_DESTINATIONS];

/** Lower case, no accents: "Málaga", "malaga" and "MALAGA" are one place. */
const normalise = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/**
 * Other names the same places arrive under — the language switcher's own
 * words for them, and the two region links in the header and footer
 * ("All on the Costa del Sol", "All in Austria").
 */
const ALIASES: Record<string, CityGroup[]> = {
  wien: ["vienna"],
  viena: ["vienna"],
  karnten: ["carinthia"],
  carintia: ["carinthia"],
  "costa del sol": ["malaga", "marbella", "fuengirola"],
  spain: ["malaga", "marbella", "fuengirola"],
  austria: ["vienna", "carinthia"],
};

/**
 * Which location groups a search term means, or `null` for a term that is not
 * one of our places (then the search falls back to matching the text).
 *
 * The search used to match the term against `location`, `address` and `name`
 * only, and those are Guesty's words, not Frontier's: the Los Flamingos
 * apartments are filed under "Málaga", Los Monteros under "Río Real", the
 * Vienna flats under "Wien" and the lodges under "Kärnten". So "Marbella"
 * found one of four homes, "Carinthia" none, and "Málaga" also turned up two
 * Marbella homes. `city_group` is the grouping the location pages use, so a
 * search for a place now shows the same homes as that place's page.
 */
export const cityGroupsForSearch = (term: string): CityGroup[] | null => {
  const needle = normalise(term);
  if (!needle) return null;
  const destination = ALL_DESTINATIONS.find(
    (d) => normalise(d.label) === needle || normalise(d.query) === needle || d.page === needle
  );
  if (destination) return [destination.page];
  return ALIASES[needle] ?? null;
};
