/**
 * Post-build prerender: renders each route in a headless browser and writes
 * the result back into dist/ as static HTML.
 *
 * Why a snapshot rather than renderToString: this app cannot be rendered in
 * Node. `src/integrations/supabase/client.ts` reads `localStorage` at module
 * scope, so importing the app server-side throws before the first component
 * runs — and beyond that, the sections that carry the page's content fetch
 * their data in effects, which a string render never waits for. A real browser
 * sidesteps both: it runs the app exactly as a visitor does and we keep what
 * it produced.
 *
 * What this buys: a crawler or an AI answer engine that executes no JavaScript
 * — which is most of them — sees the headings, the FAQ answers, the comparison
 * table and the per-route <head> instead of an empty <div id="root">.
 *
 * What it does not buy: speed. The 2.6MB bundle still downloads and React
 * still re-renders over the snapshot (main.tsx uses createRoot, not
 * hydrateRoot, so the prerendered DOM is discarded rather than adopted). That
 * is the accepted trade — hydration would need every fetched section to render
 * identically on both passes, which fetched-at-runtime data cannot promise.
 *
 * Run with `npm run build`. To skip it locally: `npm run build:client`.
 */
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { loadEnv } from "vite";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const PORT = 4180;

/**
 * Routes worth having in the index. Everything omitted is either behind a
 * login, part of a transaction, or a redirect — pages that help a person
 * mid-task and do nothing in a search result.
 */
const STATIC_ROUTES = [
  "/",
  "/property-management",
  "/properties",
  "/about",
  "/projects",
  "/guaranteed-income",
  "/renovations",
  "/investments",
  "/aviso-legal",
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

/** Serves dist/ with the same SPA fallback Netlify applies in production. */
const serveDist = () =>
  new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const path = decodeURIComponent(req.url.split("?")[0]);
      const file = join(DIST, path);
      const target = existsSync(file) && extname(file) ? file : join(DIST, "index.html");
      try {
        const body = await readFile(target);
        res.writeHead(200, { "Content-Type": MIME[extname(target)] || "application/octet-stream" });
        res.end(body);
      } catch {
        res.writeHead(404).end("not found");
      }
    });
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });

/**
 * The property pages are the long tail — each targets a search no other page
 * can. Their slugs live in the database, so they are read at build time.
 * A failure here is not fatal: the static routes are still worth shipping.
 */
const fetchPropertyRoutes = async () => {
  const env = loadEnv("production", ROOT, "VITE_");
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.warn("  ! Supabase env vars missing — skipping property pages");
    return [];
  }

  try {
    const response = await fetch(
      `${url}/rest/v1/properties?select=slug&available=eq.true`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const rows = await response.json();
    return rows.filter((r) => r.slug).map((r) => `/property/${r.slug}`);
  } catch (error) {
    console.warn(`  ! Could not read property slugs (${error.message}) — skipping property pages`);
    return [];
  }
};

/**
 * True when the route rendered *its own* page.
 *
 * Checking for any <h1> is not enough, and getting that wrong is expensive.
 * Every unknown path falls back to the SPA shell, and once that shell is
 * itself a prerendered page, the shell arrives carrying the landing page's
 * heading, title and canonical. A route whose data failed to load then sits
 * there showing someone else's content, passes an <h1> check, and gets written
 * to disk — publishing the landing page under a property URL, with a canonical
 * pointing back at "/". Duplicate content, silently, on exactly the pages this
 * script exists to help.
 *
 * The canonical is the page asserting which page it is: <Seo> sets it per
 * route, so if it does not match the route being rendered, the route did not
 * render. That catches an empty render and a wrong render with one condition.
 */
const renderedItsOwnPage = async (page, route) =>
  page
    .waitForFunction(
      (expected) => {
        const href = document
          .querySelector('link[rel="canonical"]')
          ?.getAttribute("href");
        if (!href) return false;
        const path = new URL(href).pathname.replace(/\/$/, "") || "/";
        const want = expected.replace(/\/$/, "") || "/";
        if (path !== want) return false;
        const h1 = document.querySelector("h1");
        return !!h1 && h1.textContent.trim().length > 0;
      },
      route,
      { timeout: 20000 }
    )
    .then(() => true)
    .catch(() => false);

const prerender = async () => {
  if (!existsSync(join(DIST, "index.html"))) {
    console.error("dist/index.html missing — run the client build first");
    process.exit(1);
  }

  // PRERENDER_EXTRA_ROUTES adds paths without touching this file — useful for
  // a one-off campaign page, and for exercising the property-page path when
  // the database is not reachable from the machine running the build.
  const extra = (process.env.PRERENDER_EXTRA_ROUTES || "")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  const routes = [...new Set([...STATIC_ROUTES, ...(await fetchPropertyRoutes()), ...extra])];
  console.log(`\nPrerendering ${routes.length} routes\n`);

  const server = await serveDist();
  // Netlify installs its own browser via `playwright install chromium`, so the
  // default is right there. The override exists for build images that already
  // ship a Chromium and would otherwise download a second copy.
  const browser = await chromium.launch({
    args: ["--no-sandbox"],
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
  });
  const context = await browser.newContext();

  // The hero's YouTube embed autoplays a video on every route that renders the
  // header. It contributes nothing to the HTML and would add seconds per page.
  await context.route("**://www.youtube.com/**", (route) => route.abort());

  let written = 0;
  const failed = [];

  for (const route of routes) {
    const page = await context.newPage();
    try {
      await page.goto(`http://127.0.0.1:${PORT}${route}`, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      if (!(await renderedItsOwnPage(page, route))) {
        failed.push(`${route} (page did not render its own content)`);
        continue;
      }

      // Data-driven sections resolve after the first paint; give them a beat
      // so the property cards and team names land in the snapshot too.
      await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});

      const html = await page.evaluate(() => {
        // The scroll position at capture time is meaningless in a static file,
        // and a stray inline style on <html> would ship with it.
        document.documentElement.removeAttribute("style");
        return `<!doctype html>\n${document.documentElement.outerHTML}`;
      });

      const outPath =
        route === "/" ? join(DIST, "index.html") : join(DIST, route, "index.html");
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, html, "utf8");

      written += 1;
      console.log(`  ✓ ${route}`);
    } catch (error) {
      failed.push(`${route} (${error.message.split("\n")[0]})`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();

  console.log(`\n${written}/${routes.length} routes prerendered`);

  if (failed.length) {
    console.error("\nFailed:");
    failed.forEach((f) => console.error(`  ✗ ${f}`));
    // A route that silently ships as an empty shell is the failure mode this
    // whole script exists to prevent, so it fails the build rather than
    // pretending the deploy is fine.
    process.exit(1);
  }
};

await prerender();
