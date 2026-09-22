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
}

export const SPAIN_DESTINATIONS: Destination[] = [
  { label: "Marbella", query: "Marbella" },
  { label: "Málaga", query: "Málaga" },
  { label: "Estepona", query: "Estepona" },
  { label: "Benalmádena", query: "Benalmádena" },
  { label: "Fuengirola", query: "Fuengirola" },
];

export const AUSTRIA_DESTINATIONS: Destination[] = [
  { label: "Vienna", query: "Vienna" },
  { label: "Carinthia", query: "Carinthia" },
];

export const ALL_DESTINATIONS: Destination[] = [...SPAIN_DESTINATIONS, ...AUSTRIA_DESTINATIONS];
