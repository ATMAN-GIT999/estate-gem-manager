/**
 * Reads the Journal: one Markdown file per article in content/journal/.
 *
 * Shared by the Vite plugin (which hands the result to the app), the sitemap
 * script and — later — whatever drafts articles automatically, so there is one
 * definition of "a valid, published article" instead of three. Plain Node, no
 * dependencies: the front matter is a small, strict subset of YAML on purpose,
 * because a file that parses differently in two places is how an article ends
 * up in the sitemap but not on the site.
 *
 * What counts as published: `status` is not `draft` and `date` is today or
 * earlier. The site is rebuilt every night (.github/workflows/nightly-rebuild),
 * so an article with a future date appears on its own on that morning.
 * JOURNAL_INCLUDE_UNPUBLISHED=1 (dev server, Netlify previews) shows the rest
 * too, marked as a preview and noindex.
 *
 * A file that breaks a rule is left out and reported, never half-published.
 * JOURNAL_STRICT=1 (previews) turns that report into a failed build.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The places that have a page (src/lib/vacationRentals.ts, which this .mjs
 * cannot import). An article may only point at one of these — a link to a
 * place without a page would be a dead end, and docs/seo/struktur.md §11 rules
 * out pages for places without homes.
 */
export const PLACE_SLUGS = ["malaga", "marbella", "fuengirola", "vienna", "carinthia"];

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const BRAND_SUFFIX = " | Frontier Residences";

const isDate = (s) => DATE_RE.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));
const unquote = (s) => (/^(["']).*\1$/.test(s) ? s.slice(1, -1) : s);
const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []);

function parseValue(raw) {
  if (raw.startsWith("[") && raw.endsWith("]")) {
    return raw
      .slice(1, -1)
      .split(",")
      .map((s) => unquote(s.trim()))
      .filter(Boolean);
  }
  return unquote(raw);
}

/**
 * `---` block of `key: value` lines (values may be quoted; lists are
 * `[a, b]`), then the Markdown. Anything else is an error, loudly.
 */
export function parseFrontmatter(source) {
  const text = source.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error('no front matter — the file has to start with a "---" block');

  const data = {};
  match[1].split("\n").forEach((line, index) => {
    if (!line.trim() || line.trim().startsWith("#")) return;
    const kv = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (!kv) throw new Error(`front matter line ${index + 1} is not "key: value": ${line}`);
    data[kv[1]] = parseValue(kv[2].trim());
  });
  return { data, body: match[2].replace(/^\n+/, "") };
}

export function readJournal({
  root = defaultRoot,
  includeUnpublished = process.env.JOURNAL_INCLUDE_UNPUBLISHED === "1",
  strict = process.env.JOURNAL_STRICT === "1",
  today = new Date().toISOString().slice(0, 10),
  report = (msg) => console.warn(msg),
} = {}) {
  const dir = join(root, "content", "journal");
  const articles = [];
  const problems = [];
  if (!existsSync(dir)) return { articles, problems };

  for (const name of readdirSync(dir).sort()) {
    // `_TEMPLATE.md` and friends: documentation, not articles.
    if (!name.endsWith(".md") || name.startsWith("_") || name.toLowerCase() === "readme.md") continue;

    const slug = name.slice(0, -3);
    const errors = [];
    const warnings = [];

    let data;
    let body;
    try {
      ({ data, body } = parseFrontmatter(readFileSync(join(dir, name), "utf8")));
    } catch (err) {
      problems.push({ slug, errors: [err.message], warnings });
      continue;
    }

    if (!SLUG_RE.test(slug)) errors.push("the file name is the URL — lowercase letters, digits and hyphens only");
    for (const field of ["title", "description", "date"]) {
      if (!data[field]) errors.push(`"${field}" is missing`);
    }
    if (data.date && !isDate(data.date)) errors.push('"date" must be YYYY-MM-DD');
    if (data.updated) {
      if (!isDate(data.updated)) errors.push('"updated" must be YYYY-MM-DD');
      else if (data.date && data.updated < data.date) errors.push('"updated" is earlier than "date"');
    }

    const places = asList(data.places);
    const properties = asList(data.properties);
    for (const place of places) {
      if (!PLACE_SLUGS.includes(place)) {
        errors.push(`unknown place "${place}" (${PLACE_SLUGS.join(", ")})`);
      }
    }
    // docs/seo/struktur.md §8: every article leads somewhere a guest can book.
    if (!places.length && !properties.length) {
      errors.push('links no place and no home — add "places" or "properties" (struktur.md §8)');
    }

    const status = data.status ?? "published";
    if (!["published", "draft"].includes(status)) errors.push('"status" is "published" or "draft"');

    if (data.image) {
      if (!data.imageAlt) errors.push('"image" needs an "imageAlt"');
      else if (!existsSync(join(root, "public", data.image))) {
        errors.push(`image not found: public${data.image}`);
      }
    } else if (data.imageAlt) {
      warnings.push('"imageAlt" without "image"');
    }

    // Lists show a 720 px version of the photo (`x.webp` → `x-card.webp`), so
    // the home page does not pull three full-size heroes below the fold.
    // Without one the list falls back to the full photo, and says so here.
    let cardImage = data.image || null;
    if (data.image) {
      const card = data.image.replace(/\.webp$/, "-card.webp");
      if (card !== data.image && existsSync(join(root, "public", card))) cardImage = card;
      else warnings.push(`no ${card.split("/").pop()} — lists will load the full-size photo`);
    }

    // Not blockers — search-snippet hygiene (struktur.md §4) and a nudge
    // against the thin pages the SEO notes rule out.
    if (data.title && data.title.length + BRAND_SUFFIX.length > 60) {
      warnings.push(`title is ${data.title.length + BRAND_SUFFIX.length} characters with the brand — over 60 gets cut off`);
    }
    if (data.description && (data.description.length < 120 || data.description.length > 165)) {
      warnings.push(`description is ${data.description.length} characters — aim for 140–160`);
    }
    const words = body.split(/\s+/).filter(Boolean).length;
    if (words < 300) warnings.push(`only ${words} words — is it more than a keyword page?`);

    if (warnings.length || errors.length) problems.push({ slug, errors, warnings });
    if (errors.length) continue;

    const live = status !== "draft" && data.date <= today;
    if (!live && !includeUnpublished) continue;

    articles.push({
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      updated: data.updated || null,
      author: data.author || null,
      places,
      properties,
      image: data.image || null,
      cardImage,
      imageAlt: data.imageAlt || null,
      live,
      status,
    });
  }

  articles.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

  for (const p of problems) {
    for (const e of p.errors) report(`[journal] ✗ ${p.slug}: ${e}`);
    for (const w of p.warnings) report(`[journal] ⚠️  ${p.slug}: ${w}`);
  }
  if (strict && problems.some((p) => p.errors.length)) {
    const broken = problems.filter((p) => p.errors.length).map((p) => p.slug);
    throw new Error(`Journal: ${broken.join(", ")} break the rules above (JOURNAL_STRICT=1).`);
  }

  return { articles, problems };
}

/** The Markdown of one article, without its front matter. */
export function readJournalBody(slug, root = defaultRoot) {
  if (!SLUG_RE.test(slug)) throw new Error(`bad journal slug: ${slug}`);
  return parseFrontmatter(readFileSync(join(root, "content", "journal", `${slug}.md`), "utf8")).body;
}
