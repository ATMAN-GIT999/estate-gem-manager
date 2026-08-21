import { Helmet } from "react-helmet-async";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  absoluteUrl,
} from "@/lib/siteMeta";

interface SeoProps {
  /** Page-specific part of the title. Omit only on the home page. */
  title?: string;
  description?: string;
  /** Route path, e.g. "/property-management". Becomes canonical and og:url. */
  path: string;
  image?: string;
  /** `article` for a single property or blog post, `website` otherwise. */
  type?: "website" | "article";
  /** Set on pages that must never be indexed (auth, transient confirmations). */
  noindex?: boolean;
  /** JSON-LD to attach to this page. Objects are serialised as-is. */
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Per-page title, description, canonical and social tags.
 *
 * Every route shared the one `<title>` and `<meta description>` in index.html,
 * which meant all 23 property pages — the only genuinely unique content on the
 * site — looked identical to a search engine.
 *
 * The canonical link matters more than usual here: the property cards append
 * `?checkIn=…&checkOut=…&guests=…` when a visitor arrives from a search, so a
 * single property is reachable under an unbounded number of URLs. Without a
 * canonical those compete with each other.
 */
const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noindex = false,
  schema,
}: SeoProps) => {
  const fullTitle = title ? `${title} | Frontier Residences` : DEFAULT_TITLE;
  const url = absoluteUrl(path);
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Frontier Residences" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
