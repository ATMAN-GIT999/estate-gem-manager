/**
 * Single source of truth for the portfolio figures quoted on the landing page.
 *
 * These numbers used to be typed out separately in Stats and in the Projects
 * country cards, and drifted apart: Stats claimed 41 properties while Projects
 * claimed "20+" a few sections further down. Quoting the same figure twice from
 * two literals is what caused that, so every figure now has exactly one home
 * here and is rendered from it.
 *
 * ⚠️ UNVERIFIED — needs the client's confirmation before this goes live.
 * The values below are the ones already published on `main`; they were kept as
 * they stood rather than replaced with a guess. Other sources disagree:
 *   - the README brief (an older draft) says 34 properties / 570+ reservations
 *   - the `properties` table currently holds 23 imported listings
 *   - Guesty reportedly has 33 assigned
 * Once the real number is known, change it here and the whole page follows.
 */
export const SITE_FIGURES = {
  propertiesManaged: "41",
  reservations: "1500+",
  destinations: "8",
  collaborators: "50+",
} as const;

/** Countries served, quoted as one compact line in the trust band. */
export const COUNTRIES = "Spain · Austria · Croatia";
