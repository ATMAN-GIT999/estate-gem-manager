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

/**
 * ⚠️ Still the Lovable placeholder. Replace with a 1200×630 brand image and
 * every share on WhatsApp and LinkedIn stops advertising the build tool.
 * Tracked as point 4 of the SEO audit.
 */
export const DEFAULT_OG_IMAGE = "https://lovable.dev/opengraph-image-p98pqg.png";

/** Absolute URL for a route, which canonical and og:url both require. */
export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
