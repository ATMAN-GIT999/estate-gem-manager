import { en, type TranslationKey } from "./translations";
import { BUSINESS } from "./siteMeta";
import type { Json } from "@/integrations/supabase/types";

/**
 * The place pages under /winter-rentals.
 *
 * Kept apart from `vacationRentals.ts` on purpose. The two lists look alike but
 * answer different questions: that one is "where can you book a few nights",
 * this one is "where is a home let by the month". Estepona exists here only —
 * on the short-stay side it is deliberately not a place (see the comment in
 * scripts/generate-sitemap.mjs) — so merging the lists would put it on the
 * wrong one.
 *
 * `slug` IS the `midterm_listings.city_group` value, as on the short-stay side.
 * The CHECK in migration 20261004120000 holds the same four values.
 *
 * SEO title and description stay English and live here, like every <Seo> on
 * the site (docs/seo/struktur.md §7).
 */
export interface WinterRentalCity {
  slug: "malaga" | "marbella" | "fuengirola" | "estepona";
  /** The page part of <title>, ≤ 38 characters so the full title stays ≤ 60. */
  seoTitle: string;
  seoDescription: string;
}

export const WINTER_RENTAL_CITIES: WinterRentalCity[] = [
  {
    slug: "malaga",
    seoTitle: "Winter Rentals in Málaga",
    seoDescription:
      "Apartments in Málaga's Soho and a penthouse in Torremolinos, let by the month through the winter. Enquire directly with Frontier Residences.",
  },
  {
    slug: "marbella",
    seoTitle: "Winter Rentals in Marbella",
    seoDescription:
      "A semi-detached house in La Quinta, Benahavís, near Marbella, let by the month for the winter. Enquire directly with Frontier Residences.",
  },
  {
    slug: "fuengirola",
    seoTitle: "Winter Rentals in Fuengirola",
    seoDescription:
      "An apartment in Las Gaviotas and houses in Higuerón and Capellanía, let by the month for the winter. Enquire directly with Frontier Residences.",
  },
  {
    slug: "estepona",
    seoTitle: "Winter Rentals in Estepona",
    seoDescription:
      "A three-bedroom apartment in Casasola, Estepona, let by the month for the winter. Enquire directly with Frontier Residences.",
  },
];

export const findWinterRentalCity = (slug: string | undefined) =>
  WINTER_RENTAL_CITIES.find((c) => c.slug === slug);

/** A per-city translation key, e.g. `wrKey("malaga", "h1")` → "wr-malaga-h1". */
export const wrKey = (slug: WinterRentalCity["slug"], suffix: string) =>
  `wr-${slug}-${suffix}` as TranslationKey;

export const WINTER_RENTALS_PATH = "/winter-rentals";

export type MidtermStatus = "available" | "reserved" | "let";

/** A row of `midterm_listings`, with `images` narrowed from `Json`. */
export interface MidtermListing {
  id: string;
  slug: string;
  name: string;
  city_group: WinterRentalCity["slug"];
  location: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number | null;
  guests: number | null;
  size_sqm: number | null;
  monthly_price: number;
  deposit: number | null;
  /**
   * Agency commission, EUR. Was internal-only (DECISIONS.md §57); made
   * guest-facing again in §58 (Almedin, 04.10.2026) — `wr-price-note` states
   * it and `GUEST_LISTING_COLUMNS` now selects it. Don't re-hide it without
   * updating both.
   */
  commission: number | null;
  utilities_included: boolean | null;
  min_stay_months: number | null;
  max_stay_months: number | null;
  available_from: string | null;
  available_until: string | null;
  status: MidtermStatus;
  published: boolean;
  images: Array<{ url: string; caption?: string }>;
  description: string | null;
  amenities: string[] | null;
  sort_order: number;
  /**
   * The linked Guesty house's map coordinates, for homes that are the same
   * physical property as an existing vacation rental (DECISIONS.md §57).
   * Only present when the detail page's own query asks for it — `property_id`
   * links the two, but `midterm_listings` deliberately stores no address of
   * its own (see the comment on that column in the migration): the exact
   * location is fetched live from `properties` for display, never copied in.
   * `undefined` on every other fetch (list/card/admin), `null` when the row
   * has no `property_id` or the query didn't ask.
   */
  property?: { latitude: number | null; longitude: number | null; address: string | null } | null;
}

/**
 * Column list for the public-facing guest queries — deliberately not
 * `select("*")`, so a column added to the table later (another internal one,
 * like `commission` used to be between §57 and §58) doesn't reach a guest
 * just because `*` includes it. `commission` itself is public again as of
 * §58 and is listed below on purpose.
 */
export const GUEST_LISTING_COLUMNS =
  "id, slug, name, city_group, location, property_type, bedrooms, bathrooms, guests, size_sqm, monthly_price, deposit, commission, utilities_included, min_stay_months, max_stay_months, available_from, available_until, status, published, images, description, amenities, sort_order";

/** The generated row type widens `images` to `Json`; this is the shape the admin writes. */
export const toMidtermListing = (row: unknown): MidtermListing => {
  const r = row as MidtermListing & { images: Json };
  return { ...r, images: Array.isArray(r.images) ? (r.images as MidtermListing["images"]) : [] };
};

export const winterListingPath = (home: Pick<MidtermListing, "city_group" | "slug">) =>
  `${WINTER_RENTALS_PATH}/${home.city_group}/${home.slug}`;

/** Types the dictionary has a label for; anything else falls back to the raw value. */
export const typeKey = (type: string) => `wr-type-${type}` as TranslationKey;
export const hasTypeLabel = (type: string) => typeKey(type) in en;

export const statusKey = (status: MidtermStatus) => `wr-status-${status}` as TranslationKey;

/**
 * Interim enquiry channel until the enquiry form exists: WhatsApp with the home
 * already named in the message. Same number as the floating button, taken from
 * siteMeta so it cannot drift from the rest of the site.
 */
export const whatsAppEnquiryUrl = (message: string) =>
  `https://api.whatsapp.com/send?phone=${BUSINESS.phone.replace(/\D/g, "")}&text=${encodeURIComponent(message)}`;
