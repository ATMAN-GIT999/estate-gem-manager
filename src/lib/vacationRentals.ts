import { en, type TranslationKey } from "./translations";

/**
 * The five location pages under /vacation-rentals.
 *
 * `slug` IS the `properties.city_group` value — the page loads its homes with
 * `.eq("city_group", slug)`, so the two must never drift apart. The CHECK on
 * that column (migration 20260925120000) holds the same five values; a sixth
 * place means both changing together.
 *
 * Pages exist only where there is stock (docs/seo/struktur.md §11). A place
 * without homes (Estepona, Benalmádena) gets no entry here until a listing
 * exists — a location page with nothing to book is a doorway page. The search
 * suggestions (src/lib/destinations.ts) hold the same five places.
 *
 * The SEO title and description stay English and live here rather than in
 * translations.ts, like every other page's <Seo>: English is the one indexed
 * version until the site has language URLs (docs/seo/struktur.md §7).
 */
export interface VacationRentalCity {
  slug: "malaga" | "marbella" | "fuengirola" | "vienna" | "carinthia";
  /** The page part of <title>, ≤ 38 characters so the full title stays ≤ 60. */
  seoTitle: string;
  seoDescription: string;
  /** How many `vr-<slug>-area-<i>-*` and `vr-<slug>-faq-*-<i>` keys exist. */
  areaCount: number;
  faqCount: number;
}

export const VACATION_RENTAL_CITIES: VacationRentalCity[] = [
  {
    slug: "malaga",
    seoTitle: "Málaga & Torremolinos Vacation Rentals",
    seoDescription:
      "Apartments in Málaga's Soho and around the old town, plus first-line beach apartments in Torremolinos. Book directly with the team that manages them.",
    areaCount: 3,
    faqCount: 4,
  },
  {
    slug: "marbella",
    seoTitle: "Luxury Vacation Rentals in Marbella",
    seoDescription:
      "Homes in and around Marbella: Los Monteros, the Los Flamingos golf resort and the village of La Heredia near Benahavís. Managed by us, booked directly.",
    areaCount: 3,
    faqCount: 4,
  },
  {
    slug: "fuengirola",
    seoTitle: "Villas & Apartments in Fuengirola",
    seoDescription:
      "Two sea-view villas with their own pools in the Reserva del Higuerón and a golf apartment in Calahonda. Book directly with Frontier Residences.",
    areaCount: 2,
    faqCount: 4,
  },
  {
    slug: "vienna",
    seoTitle: "Vacation Apartments in Vienna",
    seoDescription:
      "Two apartments for a Vienna city break: in the 3rd district near the Prater and the old town, and a four-bedroom duplex in Ottakring. Book directly.",
    areaCount: 2,
    faqCount: 4,
  },
  {
    slug: "carinthia",
    seoTitle: "Lima Alpine Lodges, Carinthia",
    seoDescription:
      "Five alpine lodges in the Gerlitzen Alps in Carinthia, each with sauna and fireplace, slopes and trails close by. Book Lima Alpine Lodges directly with us.",
    areaCount: 3,
    faqCount: 4,
  },
];

export const findVacationRentalCity = (slug: string | undefined) =>
  VACATION_RENTAL_CITIES.find((c) => c.slug === slug);

/** A per-city translation key, e.g. `vrKey("malaga", "h1")` → "vr-malaga-h1". */
export const vrKey = (slug: VacationRentalCity["slug"], suffix: string) =>
  `vr-${slug}-${suffix}` as TranslationKey;

/**
 * The FAQ as it appears in the accordion, in English, for `FAQPage` JSON-LD.
 * Read straight from the English dictionary rather than written out a second
 * time: the markup and the page must say the same thing, and two copies of a
 * text are two copies that drift.
 */
export const englishFaq = (city: VacationRentalCity) =>
  Array.from({ length: city.faqCount }, (_, i) => ({
    question: en[vrKey(city.slug, `faq-q-${i}`)],
    answer: en[vrKey(city.slug, `faq-a-${i}`)],
  }));

/**
 * Homes that stay off the location pages although they are `available`.
 *
 * "6th floor Malaga Soho" is let long-term: Guesty holds it at a 63-night
 * minimum stay, so every guest who picks dates on it gets a refusal
 * (docs/PROJECT.md D9). docs/seo/struktur.md §3 keeps it out of the Málaga
 * list for that reason. It stays reachable through /properties and its own
 * page until D9 is decided. Keyed on the Guesty listing id, which — unlike the
 * name and slug — no import run rewrites.
 */
export const LOCATION_PAGE_EXCLUDED_LISTINGS = new Set(["69c0291069caed0011ebe170"]);
