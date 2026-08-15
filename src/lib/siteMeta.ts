/**
 * The single source of truth for who this business is, in the form search
 * engines and answer engines want it.
 *
 * The figures here are the ones in the Aviso Legal, which is the legally
 * binding version. Local search treats a mismatched name, address or phone as
 * evidence that it is looking at two different businesses, so nothing here may
 * drift from that page, the footer, or the Google Business Profile.
 */
export const SITE_URL = "https://frontier-residences.com";

export const BUSINESS = {
  /** Trading name, as used everywhere on the site. */
  name: "Frontier Residences",
  /** Registered entity, for the legal fields only. */
  legalName: "Frontier Residences Real Estate Management S.L.",
  taxId: "ESB70848841",
  email: "hello@frontier-residences.com",
  phone: "+34649429678",
  street: "Calle Fresnos de Guadalmar, 15",
  postalCode: "29004",
  city: "Málaga",
  country: "ES",
} as const;

export const DEFAULT_TITLE =
  "Frontier Residences | Luxury Property Management & Investment Services";
export const DEFAULT_DESCRIPTION =
  "Bespoke property management, renovation, and investment solutions for exclusive villas and apartments in Spain and Austria.";

/** Absolute URL for a route, which canonical and og:url both require. */
export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * A real brand photo (Villa Hoyo 19, "peninsula-corner-villa-higueron" in
 * PropertyCard.tsx) rather than the Lovable placeholder every share used to
 * carry. Lives in `public/`, not `src/assets/`: `og:image` needs a stable,
 * un-hashed URL a crawler can fetch, which a Vite-bundled import does not
 * give you without going through `absoluteUrl()` on a filename that changes
 * on every rebuild. PNG rather than the site's usual WebP because Open Graph
 * crawler support for WebP is still inconsistent across platforms.
 */
export const DEFAULT_OG_IMAGE = absoluteUrl("/og-image.png");
