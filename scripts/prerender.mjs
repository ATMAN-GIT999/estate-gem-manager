/**
 * Saves a rendered copy of every indexable page into dist/ after the build.
 *
 * The site is a client-only SPA, so the HTML a server sends is the same empty
 * shell for every address. Google runs the JavaScript and copes; WhatsApp,
 * LinkedIn, Facebook and most AI crawlers do not, and see no content and no
 * per-page title or preview. This script opens each route in headless
 * Chromium, waits until the page has drawn itself, and writes the result next
 * to the static files — the host then serves it instead of the shell.
 *
 * Routing, state and the app itself are untouched: it is a post-build step and
 * the live app still renders from scratch in the visitor's browser
 * (src/lib/prerender.ts explains the hand-over).
 *
 * Routes come from dist/sitemap.xml, not from a second list, so a page is
 * prerendered exactly when it is offered to search engines. Everything not in
 * the sitemap (/auth, /admin, /p/:slug …) keeps falling through to the shell.
 *
 * A prerender problem must never block a deploy that fixes a booking bug, so
 * by default failures are reported loudly and the build still succeeds with
 * whatever pages did render; the rest simply stay the plain SPA. Set
 * PRERENDER_STRICT=1 (netlify.toml does for previews) to fail instead.
 *
 * Env: PRERENDER_STRICT=1 · PRERENDER_SKIP=1 (only create app-shell.html) ·
 *      PRERENDER_FORM=dir (write <route>/index.html instead of <route>.html)
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
  createReadStream,
} from "node:fs";
import http from "node:http";
import { basename, dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

const SITE_URL = "https://frontier-residences.com";
const STRICT = process.env.PRERENDER_STRICT === "1";
const SKIP = process.env.PRERENDER_SKIP === "1";
const FORM = process.env.PRERENDER_FORM === "dir" ? "dir" : "file";
const CONCURRENCY = 4;
const SNAPSHOT_ID = "prerendered"; // keep in sync with src/lib/prerender.ts

/**
 * What a listing page must contain before its snapshot is trusted. Without
 * this, a Supabase hiccup during the build would be saved as "no homes in
 * Málaga" and served to every crawler until the next build.
 */
const MUST_CONTAIN = [
  { test: (p) => p === "/" || p === "/properties", selector: 'a[href^="/property/"]' },
  { test: (p) => /^\/vacation-rentals\/[^/]+$/.test(p), selector: 'a[href^="/property/"]' },
  { test: (p) => p === "/vacation-rentals", selector: 'a[href^="/vacation-rentals/"]' },
  { test: (p) => /^\/winter-rentals\/[^/]+$/.test(p), selector: 'a[href^="/winter-rentals/"]' },
  { test: (p) => p === "/journal", selector: 'a[href^="/journal/"]' },
  // An article saved before its text arrived is a headline over an empty page.
  { test: (p) => /^\/journal\/[^/]+$/.test(p), selector: "article p" },
];

const log = (msg) => console.log(`[prerender] ${msg}`);
const warn = (msg) => console.warn(`[prerender] ⚠️  ${msg}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fail(msg) {
  warn(msg);
  if (STRICT) {
    console.error("[prerender] PRERENDER_STRICT=1 — failing the build.");
    process.exit(1);
  }
  warn("Continuing without prerendered pages; the site works as a plain SPA.");
  process.exit(0);
}

if (!existsSync(join(dist, "index.html"))) {
  fail("dist/index.html missing — run `vite build` first.");
}

/**
 * The untouched Vite shell, kept under its own name. Prerendering "/" replaces
 * dist/index.html with the home page, and the host's catch-all rewrite must
 * keep serving the *empty* shell for unknown routes — public/_redirects points
 * at this file for exactly that reason. Never overwritten once it exists, so a
 * second run cannot copy a snapshot over the shell.
 */
const SHELL = join(dist, "app-shell.html");
if (!existsSync(SHELL)) copyFileSync(join(dist, "index.html"), SHELL);

if (SKIP) {
  log("PRERENDER_SKIP=1 — app-shell.html written, nothing rendered.");
  process.exit(0);
}

const sitemapPath = join(dist, "sitemap.xml");
if (!existsSync(sitemapPath)) fail("dist/sitemap.xml missing — nothing to take the routes from.");

const routes = [...readFileSync(sitemapPath, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1].replace(/&amp;/g, "&")).pathname)
  .filter((p, i, all) => all.indexOf(p) === i);
if (!routes.length) fail("Sitemap lists no routes.");

// --- static server ---------------------------------------------------------

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  const file = resolve(dist, "." + decodeURIComponent(pathname));
  if (file !== dist && !file.startsWith(dist + sep)) {
    res.writeHead(403).end();
    return;
  }
  const isFile = existsSync(file) && statSync(file).isFile();
  // index.html is never served as a page: after "/" has been written it is a
  // snapshot, and every route must start from the empty shell.
  const target = isFile && basename(file) !== "index.html" ? file : extname(file) ? null : SHELL;
  if (!target) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "Content-Type": MIME[extname(target)] ?? "application/octet-stream" });
  createReadStream(target).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const origin = `http://127.0.0.1:${server.address().port}`;

// --- browser ---------------------------------------------------------------

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch (err) {
  server.close();
  fail(`playwright is not installed (${err.message}).`);
}

let browser;
try {
  browser = await chromium.launch();
} catch (err) {
  server.close();
  fail(
    `Chromium could not start (${err.message.split("\n")[0]}). ` +
      "Install it with `npx playwright install --only-shell chromium`.",
  );
}

const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

// Read by src/lib/prerender.ts before any app code runs.
await context.addInitScript(() => {
  window.__PRERENDER__ = true;
});

let blockedCalls = 0;
await context.route("**/*", (route) => {
  const req = route.request();
  const url = new URL(req.url());

  if (url.hostname === "127.0.0.1") return route.continue();

  // Edge functions are never called from a build. The Guesty ones in
  // particular: every property page asks for its calendar on mount, and
  // Guesty allows only 3 OAuth tokens per 24 h — 40-odd pages on every build
  // (plus the nightly one) is how that quota gets burned. A saved page needs
  // no live availability anyway.
  if (url.pathname.startsWith("/functions/v1/")) {
    blockedCalls += 1;
    return route.abort();
  }
  // Reading data is the point; Supabase may answer. Images stay allowed too —
  // some components swap in a fallback on `onError`, and a blocked image would
  // bake that fallback into the page.
  if (url.hostname.endsWith(".supabase.co") || req.resourceType() === "image") {
    return route.continue();
  }
  // Everything else (fonts.googleapis.com, the YouTube embed …) would only send
  // the build machine's IP to a third party for no change to the saved HTML.
  return route.abort();
});

/** Waits until the page has drawn its real content. Returns an error string, or null. */
async function settle(page) {
  const pending = new Set();
  const track = (r) => ["fetch", "xhr"].includes(r.resourceType()) && pending.add(r);
  const done = (r) => pending.delete(r);
  page.on("request", track);
  page.on("requestfinished", done);
  page.on("requestfailed", done);

  try {
    await page.waitForSelector("h1", { timeout: 20_000 });

    // No data request in flight for 500 ms.
    let idleSince = Date.now();
    const deadline = Date.now() + 20_000;
    while (Date.now() < deadline) {
      if (pending.size) idleSince = Date.now();
      else if (Date.now() - idleSince >= 500) break;
      await sleep(50);
    }
    if (pending.size) return "data requests never finished";

    // A spinner in a snapshot is worse than no snapshot.
    await page
      .waitForFunction(() => !document.querySelector(".animate-spin"), null, { timeout: 8_000 })
      .catch(() => {});
    if (await page.evaluate(() => Boolean(document.querySelector(".animate-spin")))) {
      return "a loading spinner is still showing";
    }
    await sleep(150);
    return null;
  } catch (err) {
    return err.message.split("\n")[0];
  } finally {
    page.off("request", track);
    page.off("requestfinished", done);
    page.off("requestfailed", done);
  }
}

function outputFile(path) {
  if (path === "/") return join(dist, "index.html");
  const rel = path.replace(/^\/+|\/+$/g, "");
  return FORM === "dir" ? join(dist, rel, "index.html") : join(dist, `${rel}.html`);
}

async function renderRoute(path) {
  const page = await context.newPage();
  try {
    await page.goto(origin + path, { waitUntil: "domcontentloaded", timeout: 30_000 });
    const problem = await settle(page);
    if (problem) return { path, ok: false, reason: problem };

    const facts = await page.evaluate(
      ({ id, selectors }) => {
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
        const robots = document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
        const h1 = document.querySelector("h1")?.textContent?.trim() ?? "";
        const missing = selectors.filter((s) => !document.querySelector(s));

        // The consent banner belongs to the visitor, not to the page.
        document
          .querySelector('a[href="/aviso-legal#cookies"]')
          ?.closest('[role="region"]')
          ?.remove();

        // index.html carries site-level fallbacks (description, og:type,
        // og:image, twitter:card …) and Helmet adds the page's own beside
        // them. A crawler that reads the first tag would get the fallback — for
        // an article that is og:type "website". Keep only Helmet's where it
        // set one; a tag only index.html has stays.
        const byKey = new Map();
        for (const meta of document.head.querySelectorAll("meta[name], meta[property]")) {
          const key = meta.getAttribute("name") ?? meta.getAttribute("property");
          byKey.set(key, [...(byKey.get(key) ?? []), meta]);
        }
        for (const metas of byKey.values()) {
          if (metas.length > 1 && metas.some((m) => m.hasAttribute("data-rh"))) {
            metas.filter((m) => !m.hasAttribute("data-rh")).forEach((m) => m.remove());
          }
        }

        // The saved page goes *above* the empty #root, not inside it — see
        // src/lib/prerender.ts for why.
        const rootEl = document.getElementById("root");
        const snapshot = document.createElement("div");
        snapshot.id = id;
        while (rootEl.firstChild) snapshot.appendChild(rootEl.firstChild);
        rootEl.before(snapshot);

        const style = document.createElement("style");
        style.textContent =
          `body{position:relative}` +
          `#${id}{position:absolute;top:0;left:0;width:100%;min-height:100vh;` +
          `z-index:2147483000;background:hsl(var(--background))}`;
        document.head.appendChild(style);

        return { canonical, robots, h1, missing };
      },
      {
        id: SNAPSHOT_ID,
        selectors: MUST_CONTAIN.filter((r) => r.test(path)).map((r) => r.selector),
      },
    );

    if (/noindex/i.test(facts.robots)) return { path, ok: false, reason: "page is noindex" };
    if (!facts.h1) return { path, ok: false, reason: "empty <h1>" };
    const expected = SITE_URL + path;
    if ((facts.canonical ?? "").replace(/\/$/, "") !== expected.replace(/\/$/, "")) {
      return { path, ok: false, reason: `canonical is ${facts.canonical ?? "missing"}` };
    }
    if (facts.missing.length) {
      return { path, ok: false, reason: `expected content missing (${facts.missing.join(", ")})` };
    }

    const html = await page.content();
    const file = outputFile(path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html, "utf8");
    return { path, ok: true, bytes: html.length };
  } catch (err) {
    return { path, ok: false, reason: err.message.split("\n")[0] };
  } finally {
    await page.close();
  }
}

// "/" is written to dist/index.html; the server never serves that file as a
// page (see above), so the order of routes does not matter.
const queue = [...routes];
const results = [];
await Promise.all(
  Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length) {
      const result = await renderRoute(queue.shift());
      results.push(result);
      if (result.ok) log(`✓ ${result.path}`);
      else warn(`✗ ${result.path} — ${result.reason}`);
    }
  }),
);

await browser.close();
server.close();

const failed = results.filter((r) => !r.ok);
log(
  `${results.length - failed.length}/${results.length} pages saved (${FORM} form), ` +
    `${blockedCalls} edge-function calls blocked.`,
);
if (failed.length) {
  warn(`Not prerendered, served as the plain SPA: ${failed.map((r) => r.path).join(", ")}`);
  if (STRICT) process.exit(1);
}
