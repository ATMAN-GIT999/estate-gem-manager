/**
 * Writes dist/sitemap.xml after the Vite build.
 *
 * The 23 property pages are the point. They are the only genuinely unique
 * content on the site — each has its own address, photos and description — and
 * without a sitemap a crawler has no way to discover them: they exist only
 * behind client-side routing, so there is no server-rendered link graph to
 * follow.
 *
 * Property slugs are read live from Supabase with the publishable key, the same
 * way the site itself reads them. If that call fails the build still succeeds
 * with a static-routes-only sitemap rather than breaking a deploy over SEO.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readJournal } from "./journal.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** The canonical production origin, as declared in the Aviso Legal. */
const SITE_URL = "https://frontier-residences.com";

/**
 * Public routes only. Deliberately excluded: /auth and /update-password
 * (no reason to index a login), /admin/* (private), and
 * /booking-confirmation, which only exists as the tail of a booking and shows
 * nothing without router state.
 */
const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/property-management", priority: "0.9", changefreq: "monthly" },
  { path: "/properties", priority: "0.9", changefreq: "weekly" },
  // The location pages (src/lib/vacationRentals.ts, which this .mjs cannot
  // import). A place goes on this list only when it has homes and a page —
  // Estepona and Benalmádena have neither, and must not appear here.
  { path: "/vacation-rentals", priority: "0.8", changefreq: "weekly" },
  { path: "/vacation-rentals/malaga", priority: "0.8", changefreq: "weekly" },
  { path: "/vacation-rentals/marbella", priority: "0.8", changefreq: "weekly" },
  { path: "/vacation-rentals/fuengirola", priority: "0.8", changefreq: "weekly" },
  { path: "/vacation-rentals/vienna", priority: "0.8", changefreq: "weekly" },
  { path: "/vacation-rentals/carinthia", priority: "0.8", changefreq: "weekly" },
  { path: "/guaranteed-income", priority: "0.8", changefreq: "monthly" },
  { path: "/renovations", priority: "0.8", changefreq: "monthly" },
  { path: "/investments", priority: "0.8", changefreq: "monthly" },
  { path: "/evaluate", priority: "0.8", changefreq: "monthly" },
  { path: "/projects", priority: "0.7", changefreq: "monthly" },
  { path: "/projects/istria", priority: "0.6", changefreq: "yearly" },
  // /about is a redirect to / now (Almedin, 29.09.2026), not a page of its
  // own — nothing left here to list, and its own URL would tell Google to
  // index a page that immediately bounces elsewhere.
  { path: "/aviso-legal", priority: "0.2", changefreq: "yearly" },
];

/** Reads VITE_* values out of .env — this runs in Node, not through Vite. */
function readEnv(name) {
  if (process.env[name]) return process.env[name];
  const envPath = resolve(root, ".env");
  if (!existsSync(envPath)) return undefined;
  const line = readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith(`${name}=`));
  return line?.slice(name.length + 1).trim().replace(/^["']|["']$/g, "");
}

async function fetchPropertySlugs() {
  const url = readEnv("VITE_SUPABASE_URL");
  const key = readEnv("VITE_SUPABASE_PUBLISHABLE_KEY");
  if (!url || !key) {
    console.warn("[sitemap] Supabase env vars missing — static routes only.");
    return [];
  }
  try {
    const res = await fetch(
      `${url}/rest/v1/properties?select=slug,seo_slug,updated_at&available=eq.true&order=updated_at.desc`,
      { headers: { apikey: key } },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[sitemap] Could not load properties (${err.message}) — static routes only.`);
    return [];
  }
}

/**
 * Published winter rentals (src/lib/winterRentals.ts). Unlike the static list,
 * these routes are built from live data: the hub and a place page are listed
 * only when at least one published home exists there — a page with nothing on
 * it is noindex in the app and must not be offered to Google here either.
 */
async function fetchWinterListings() {
  const url = readEnv("VITE_SUPABASE_URL");
  const key = readEnv("VITE_SUPABASE_PUBLISHABLE_KEY");
  if (!url || !key) return [];
  try {
    const res = await fetch(
      `${url}/rest/v1/midterm_listings?select=slug,city_group,updated_at&published=eq.true&order=updated_at.desc`,
      { headers: { apikey: key } },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    // Expected until the migration is applied: the table does not exist yet.
    console.warn(`[sitemap] Could not load winter rentals (${err.message}) — none listed.`);
    return [];
  }
}

const escapeXml = (s) =>
  s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]);

const today = new Date().toISOString().slice(0, 10);

const entry = ({ path, priority, changefreq, lastmod }) =>
  `  <url>
    <loc>${escapeXml(SITE_URL + path)}</loc>
    <lastmod>${lastmod ?? today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const properties = await fetchPropertySlugs();
const winter = await fetchWinterListings();

// Only what is live today: the same call, with the same environment, that the
// app's build makes (scripts/vite-plugin-journal.mjs), so the sitemap cannot
// list an article the site does not have. The plugin has already reported any
// problems; repeating them here would only double the log.
const journal = readJournal({ report: () => {} }).articles.filter((a) => a.live);
for (const article of journal) {
  const known = new Set(properties.map((p) => p.seo_slug).filter(Boolean));
  // `properties` is empty when Supabase was unreachable — then there is
  // nothing to compare against, and a warning would be noise.
  if (!known.size) break;
  for (const home of article.properties) {
    if (!known.has(home)) {
      console.warn(`[sitemap] journal/${article.slug} links to "${home}", which is not an available home.`);
    }
  }
}
const winterCities = [...new Set(winter.map((w) => w.city_group))];

const urls = [
  ...STATIC_ROUTES.map(entry),
  ...properties.map((p) =>
    entry({
      // `seo_slug` where there is one — the old `slug` form 301s to it
      // (public/_redirects), and a sitemap must list only final addresses.
      // Same rule as propertyPath() in src/lib/propertyUrl.ts.
      path: `/property/${p.seo_slug || p.slug}`,
      priority: "0.8",
      changefreq: "weekly",
      lastmod: p.updated_at ? p.updated_at.slice(0, 10) : today,
    }),
  ),
  // The index page exists in the sitemap only with an article behind it, the
  // same rule as an empty place page (docs/seo/struktur.md §11).
  ...(journal.length
    ? [
        entry({ path: "/journal", priority: "0.7", changefreq: "weekly" }),
        ...journal.map((a) =>
          entry({
            path: `/journal/${a.slug}`,
            priority: "0.6",
            changefreq: "monthly",
            lastmod: a.updated || a.date,
          }),
        ),
      ]
    : []),
  ...(winter.length
    ? [
        entry({ path: "/winter-rentals", priority: "0.8", changefreq: "weekly" }),
        ...winterCities.map((c) =>
          entry({ path: `/winter-rentals/${c}`, priority: "0.8", changefreq: "weekly" }),
        ),
        ...winter.map((w) =>
          entry({
            path: `/winter-rentals/${w.city_group}/${w.slug}`,
            priority: "0.7",
            changefreq: "weekly",
            lastmod: w.updated_at ? w.updated_at.slice(0, 10) : today,
          }),
        ),
      ]
    : []),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

const outPath = resolve(root, "dist", "sitemap.xml");
writeFileSync(outPath, xml, "utf8");
console.log(
  `[sitemap] ${urls.length} URLs written (${STATIC_ROUTES.length} static, ${properties.length} properties, ${winter.length} winter rentals, ${journal.length} journal articles).`,
);
