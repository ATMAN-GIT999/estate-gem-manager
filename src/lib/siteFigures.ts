/**
 * Single source of truth for the portfolio figures quoted on the landing page.
 *
 * These numbers used to be typed out separately in Stats and in the Projects
 * country cards, and drifted apart: Stats claimed 41 properties while Projects
 * claimed "20+" a few sections further down. Quoting the same figure twice from
 * two literals is what caused that, so every figure now has exactly one home
 * here and is rendered from it.
 *
 * ⚠️ UNVERIFIED — three of the four numbers below are contradicted by the
 * database, and they are rendered on the landing page today. A live check on
 * 5 August 2026 found:
 *
 *   propertiesManaged  41    → 23 rows in `properties`, all available
 *   destinations        8    → 8 ✓ the one figure that checks out
 *   reservations     1500+   → 0 locally; the real count lives in Guesty
 *   collaborators      50+   → 0; the `team_members` table is empty
 *
 * These values were kept because they are what `main` already publishes, and
 * because replacing them with a guess would be no better. But do not treat
 * them as confirmed: quoting a portfolio three times its real size is the kind
 * of claim a prospective owner can check, and being caught costs more than the
 * smaller number ever would.
 *
 * The fix is a `stats` table synced from Guesty, not a new literal here. Once
 * a real number is known, change it in this file and the whole page follows.
 */
export const SITE_FIGURES = {
  propertiesManaged: "41",
  reservations: "1500+",
  destinations: "8",
  collaborators: "50+",
} as const;

/** Countries served, quoted as one compact line in the trust band. */
export const COUNTRIES = "Spain · Austria · Croatia";
