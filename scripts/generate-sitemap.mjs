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
  { path: "/guaranteed-income", priority: "0.8", changefreq: "monthly" },
  { path: "/renovations", priority: "0.8", changefreq: "monthly" },
  { path: "/investments", priority: "0.8", changefreq: "monthly" },
  { path: "/evaluate", priority: "0.8", changefreq: "monthly" },
  { path: "/projects", priority: "0.7", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/business-areas", priority: "0.6", changefreq: "monthly" },
  { path: "/book", priority: "0.6", changefreq: "weekly" },
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
      `${url}/rest/v1/properties?select=slug,updated_at&available=eq.true&order=updated_at.desc`,
      { headers: { apikey: key } },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[sitemap] Could not load properties (${err.message}) — static routes only.`);
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

const urls = [
  ...STATIC_ROUTES.map(entry),
  ...properties.map((p) =>
    entry({
      path: `/property/${p.slug}`,
      priority: "0.8",
      changefreq: "weekly",
      lastmod: p.updated_at ? p.updated_at.slice(0, 10) : today,
    }),
  ),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

const outPath = resolve(root, "dist", "sitemap.xml");
writeFileSync(outPath, xml, "utf8");
console.log(
  `[sitemap] ${urls.length} URLs written (${STATIC_ROUTES.length} static, ${properties.length} properties).`,
);
