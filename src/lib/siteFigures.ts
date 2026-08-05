/**
 * Single source of truth for the portfolio figures quoted on the landing page.
 *
 * These numbers used to be typed out separately in Stats and in the Projects
 * country cards, and drifted apart: Stats claimed 41 properties while Projects
 * claimed "20+" a few sections further down. Quoting the same figure twice from
 * two literals is what caused that, so every figure now has exactly one home
 * here and is rendered from it.
 *
 * Confirmed by the client, August 2026. Other sources in the repo disagree and
 * should be ignored rather than "corrected" back into these values: the README
 * brief is an older draft (34 properties / 570+ reservations), the `properties`
 * table only holds the 23 listings imported so far, and Guesty shows the subset
 * currently assigned. The figures below cover the whole managed portfolio,
 * which is why they are larger.
 */
export const SITE_FIGURES = {
  propertiesManaged: "41",
  reservations: "1500+",
  destinations: "8",
  collaborators: "50+",
} as const;

/** Countries served, quoted as one compact line in the trust band. */
export const COUNTRIES = "Spain · Austria · Croatia";
