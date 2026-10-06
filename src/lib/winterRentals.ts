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
  idealista_id: string | null;
  property_id: string | null;
  guesty_listing_id: string | null;
  registration_number: string | null;
  sort_order: number;
}

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

/**
 * The self-built search on /winter-rentals (docs: the winter-rentals-as-its-
 * own-hub decision, 06.10.2026). There is no Guesty calendar behind these
 * homes, so "availability" is a date comparison against `midterm_listings`
 * columns the admin already writes — no edge function, no new migration.
 *
 * Stay-length is a bucket, not an exact month count, because a guest thinks
 * "a couple of months" not "I need exactly 4". A home qualifies for a bucket
 * when its own [min_stay_months, max_stay_months] range *overlaps* the
 * bucket's range — not merely contains it — so a home with min=3/max=4 still
 * shows up under "3–5 months" even though its range doesn't fully span it.
 * `Infinity` stands in for an unset bound (no minimum / no maximum).
 */
export type StayLengthBucket = "any" | "short" | "medium" | "long";

export const STAY_LENGTH_RANGES: Record<Exclude<StayLengthBucket, "any">, { lo: number; hi: number }> = {
  short: { lo: 1, hi: 2 },
  medium: { lo: 3, hi: 5 },
  long: { lo: 6, hi: Infinity },
};

export const stayLengthMatches = (home: MidtermListing, bucket: StayLengthBucket): boolean => {
  if (bucket === "any") return true;
  const { lo, hi } = STAY_LENGTH_RANGES[bucket];
  const homeMin = home.min_stay_months ?? 1;
  const homeMax = home.max_stay_months ?? Infinity;
  return homeMin <= hi && homeMax >= lo;
};

/** Upper-bound budget buckets (EUR, matching the raw `monthly_price` column — never the display currency; see WinterSearchFilters). "any" means no cap. */
export const BUDGET_CAPS = [2000, 3000, 4000, 6000] as const;

/**
 * A real exclusion, unlike the other filters below's relationship to
 * `status`: a move-in date is a hard constraint ("free by then" is either
 * true or it isn't), so a home outside `available_from`/`available_until`
 * is dropped from the results rather than merely sorted lower. Unset bounds
 * read as "available now" / "no end date".
 *
 * `status` (reserved/let) is deliberately NOT part of this or any other
 * filter — see WinterListingCard: a let home stays visible and says so,
 * rather than 404ing a ranking URL the day it's rented. Status only affects
 * *order*, via `winterStatusRank` below, never inclusion.
 */
export const isAvailableForMoveIn = (home: MidtermListing, desiredMoveIn: string | null): boolean => {
  if (!desiredMoveIn) return true;
  if (home.available_from && home.available_from > desiredMoveIn) return false;
  if (home.available_until && home.available_until < desiredMoveIn) return false;
  return true;
};

/** Lower sorts first: open homes before reserved/let, ahead of whichever metric the guest picked. */
export const winterStatusRank = (home: MidtermListing): number =>
  home.status === "available" ? 0 : home.status === "reserved" ? 1 : 2;
