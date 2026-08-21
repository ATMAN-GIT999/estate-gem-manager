import { BUSINESS, SITE_URL, absoluteUrl } from "./siteMeta";

/**
 * JSON-LD builders. One `@id` for the organisation, referenced from everywhere
 * else, so search engines treat every page as the same business rather than a
 * dozen unrelated ones.
 */

const ORG_ID = `${SITE_URL}/#organization`;

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: BUSINESS.street,
  addressLocality: BUSINESS.city,
  postalCode: BUSINESS.postalCode,
  addressCountry: BUSINESS.country,
};

/**
 * `RealEstateAgent` rather than plain `LocalBusiness`: it is the schema.org
 * subtype for a business that manages and lets property, and a more specific
 * type is worth more than a generic one.
 */
export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": ORG_ID,
  name: BUSINESS.name,
  legalName: BUSINESS.legalName,
  taxID: BUSINESS.taxId,
  url: SITE_URL,
  email: BUSINESS.email,
  telephone: BUSINESS.phone,
  address: postalAddress,
  areaServed: [
    { "@type": "Place", name: "Marbella, Spain" },
    { "@type": "Place", name: "Málaga, Spain" },
    { "@type": "Place", name: "Costa del Sol, Spain" },
    { "@type": "Place", name: "Vienna, Austria" },
    { "@type": "Place", name: "Carinthia, Austria" },
  ],
  knowsLanguage: ["en", "es", "de"],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Full-service property management",
        description:
          "End-to-end management of a short-term rental: listing, dynamic pricing, guest communication, check-in, housekeeping, maintenance and owner reporting.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Guaranteed Income",
        description:
          "Frontier Residences leases the property from the owner and pays a fixed monthly amount regardless of occupancy, maintaining the home throughout.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Renovations and interior design",
        description:
          "Concept, construction, delivery and staging for properties being prepared for the rental market.",
      },
    },
  ],
});

/**
 * Question/answer pairs are the single format answer engines (Perplexity,
 * Google AI Overviews, ChatGPT) extract most directly — see the GEO section of
 * the website-seo-geo skill. Pass the same items rendered in the accordion so
 * markup and page can never drift apart.
 */
export const faqSchema = (items: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

/** Attach to any page that is not the home page, so search shows a trail. */
export const breadcrumbSchema = (
  trail: Array<{ name: string; path: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

interface PropertySchemaInput {
  name: string;
  slug: string;
  description?: string | null;
  location?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  guests?: number | null;
  images?: Array<{ url: string }> | null;
  amenities?: string[] | null;
}

/**
 * A single rental home.
 *
 * ⚠️ Deliberately carries **no price**. The audit asked for `Product` + `Offer`
 * so that Google can show a price snippet, and that is the right destination —
 * but `price_per_night` is at best a manually synced snapshot (see
 * `price_last_synced_at` on the `properties` table, and the note in
 * `PropertyCard.tsx`), not a real-time rate, and three listings still carry a
 * value that was never verified live at all.
 *
 * Publishing that as structured data would state a price the booking engine
 * does not charge, on a page that already says "Live pricing". A missing price
 * costs a rich snippet; a wrong one is a mismatch between markup and page, and
 * it is the kind a guest discovers at checkout.
 *
 * Point C4 of `docs/PROJECT.md` — a scheduled job that keeps every listing's
 * rate current — is what unlocks this. Add `offers` here on the day that exists.
 */
export const propertySchema = (property: PropertySchemaInput) => ({
  "@context": "https://schema.org",
  "@type": "Accommodation",
  name: property.name,
  url: absoluteUrl(`/property/${property.slug}`),
  ...(property.description ? { description: property.description } : {}),
  ...(property.images?.length
    ? { image: property.images.slice(0, 6).map((i) => i.url) }
    : {}),
  ...(property.location
    ? {
        address: {
          "@type": "PostalAddress",
          addressLocality: property.location,
        },
      }
    : {}),
  ...(property.bedrooms ? { numberOfBedroomsTotal: property.bedrooms } : {}),
  ...(property.bathrooms ? { numberOfBathroomsTotal: property.bathrooms } : {}),
  ...(property.guests
    ? {
        occupancy: {
          "@type": "QuantitativeValue",
          maxValue: property.guests,
          unitCode: "C62",
        },
      }
    : {}),
  ...(property.amenities?.length
    ? {
        amenityFeature: property.amenities.map((name) => ({
          "@type": "LocationFeatureSpecification",
          name,
        })),
      }
    : {}),
  provider: { "@id": ORG_ID },
});
