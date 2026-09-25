/**
 * The one place a property's URL is built.
 *
 * `seo_slug` is the address Frontier gives a home (`marbella-casa-heredia`);
 * `slug` is the one the Guesty import derives and rewrites on every run
 * (`casa-heredia-rural-andalusian-retreat-830366`). Every link, canonical,
 * sitemap entry and piece of structured data uses `seo_slug` when there is
 * one, so a home has exactly one address a search engine sees.
 *
 * `slug` stays the fallback for a home imported after 25.09.2026 that nobody
 * has given a `seo_slug` yet — it keeps working, just under the old form.
 * Old `slug` URLs are still accepted: PropertyDetail.tsx forwards them to the
 * new one, and public/_redirects answers them with a 301 before React loads.
 */
export const propertySlug = (property: { slug: string; seo_slug?: string | null }) =>
  property.seo_slug || property.slug;

export const propertyPath = (property: { slug: string; seo_slug?: string | null }) =>
  `/property/${propertySlug(property)}`;
