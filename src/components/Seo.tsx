import { Helmet } from "react-helmet-async";

/**
 * Per-page title, description, canonical and social card.
 *
 * index.html carries exactly one of each for the whole site, which means the
 * guest landing page and the owner page — two pages aimed at two completely
 * different searches — share a title, and every other route inherits it too.
 * Anything a build-time prerender writes into <head> has to come from
 * somewhere; this is that somewhere.
 *
 * `path` is passed rather than read from the router so the canonical URL is a
 * deliberate choice per page. A canonical that follows whatever the URL bar
 * says defeats the point: it would bless tracking parameters and stray
 * trailing slashes as separate pages.
 */

/**
 * The live origin. Canonical and og:url must be absolute, and a relative one is
 * silently ignored — so this is deliberately not derived from window.location,
 * which would resolve to the Netlify preview domain in a prerender.
 */
const SITE_ORIGIN = "https://frontier-residences.com";

/**
 * ⚠️ Fallback social card. index.html currently points og:image at
 * https://lovable.dev/opengraph-image-p98pqg.png — the Lovable starter image —
 * so every link shared on WhatsApp, LinkedIn or Slack shows Lovable's artwork.
 * Replace the path below with a real 1200×630 image in /public and the whole
 * site follows.
 */
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-default.jpg`;

interface SeoProps {
  title: string;
  description: string;
  /** Site-relative, with a leading slash, e.g. "/property-management". */
  path: string;
  image?: string;
  /** Set on pages that should stay out of the index — thank-you pages, auth. */
  noindex?: boolean;
}

const Seo = ({ title, description, path, image, noindex }: SeoProps) => {
  const url = `${SITE_ORIGIN}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image || DEFAULT_OG_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || DEFAULT_OG_IMAGE} />
    </Helmet>
  );
};

export default Seo;
