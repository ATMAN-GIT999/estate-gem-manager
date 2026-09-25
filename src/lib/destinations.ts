/**
 * The one list of towns Frontier deliberately surfaces anywhere on the site —
 * the header's destinations panel (Navigation.tsx) and the search bar's
 * location suggestions (LocationAutocomplete.tsx) both read from this, so a
 * guest is never offered a place in the search field that the header itself
 * doesn't also promise exists. Real, booked-out locations plus the towns
 * Frontier is actively targeting for SEO/search-intent reasons ahead of
 * having a listing there (Almedin, 29.08.2026) — keep this list short and
 * deliberate, not "every town in Andalusia".
 *
 * Before this file existed, the search bar pulled suggestions from two other
 * sources instead: whatever strings happened to be in `properties.location`,
 * and free-text results from Nominatim's worldwide geocoder. Both could
 * surface a town with zero inventory and no SEO intent behind it — typing
 * "Berlin" would offer Berlin, and submitting it always lands on an empty
 * results page. That's a dead end for the guest and a thin/duplicate-content
 * URL for a search engine to index, not a lead.
 */
export interface Destination {
  label: string;
  query: string;
  /**
   * The location page for this place (`/vacation-rentals/<page>`), where one
   * exists. Browsing links (the header panel, the landing-page rail) go there
   * instead of to a filtered search. Estepona and Benalmádena have none: there
   * are no homes there, and a page without stock is a doorway page
   * (docs/seo/struktur.md §11) — they keep the search behaviour.
   */
  page?: "malaga" | "marbella" | "fuengirola" | "vienna" | "carinthia";
}

export const SPAIN_DESTINATIONS: Destination[] = [
  { label: "Marbella", query: "Marbella", page: "marbella" },
  { label: "Málaga", query: "Málaga", page: "malaga" },
  { label: "Estepona", query: "Estepona" },
  { label: "Benalmádena", query: "Benalmádena" },
  { label: "Fuengirola", query: "Fuengirola", page: "fuengirola" },
];

export const AUSTRIA_DESTINATIONS: Destination[] = [
  { label: "Vienna", query: "Vienna", page: "vienna" },
  { label: "Carinthia", query: "Carinthia", page: "carinthia" },
];

export const ALL_DESTINATIONS: Destination[] = [...SPAIN_DESTINATIONS, ...AUSTRIA_DESTINATIONS];
