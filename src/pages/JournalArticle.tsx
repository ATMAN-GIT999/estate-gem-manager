import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { journalArticles, loadJournalBody } from "virtual:journal";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import Breadcrumb from "@/components/Breadcrumb";
import JournalProse, { JournalInline } from "@/components/JournalProse";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import { Container, Grid, Section } from "@/components/layout";
import NotFound from "@/pages/NotFound";
import { useLocale } from "@/contexts/LocaleContext";
import { supabase } from "@/lib/supabaseClient";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { formatJournalDate } from "@/lib/journal";
import { splitJournalBody, type JournalBlock } from "@/lib/journalBody";
import { absoluteUrl, JOURNAL_AUTHOR } from "@/lib/siteMeta";
import { vrKey } from "@/lib/vacationRentals";
import type { TranslationKey } from "@/lib/translations";

/** The columns every row of an article shares: heading 4, text 8 of 12. */
const SIDE = "md:col-span-4";
const MAIN = "md:col-span-8";

const placeName = (slug: string, t: (key: TranslationKey) => string) =>
  t(vrKey(slug as never, "name") as TranslationKey);

/**
 * /journal/:slug — one article.
 *
 * Laid out as a magazine page rather than a column of text: a photograph the
 * width of the page with the headline on it, a line of numbers drawn from the
 * homes the article is about, then rows of heading-left / text-right that
 * photographs break out of, and at the end the homes themselves and the next
 * article. The first reads like the rest of the site (the home page and the
 * owner page both open on a full-width photograph); the rest is the
 * "heading beside text" rhythm DESIGN.md calls for instead of boxes.
 *
 * The front matter and the body are separate on purpose. Title, byline and
 * the links are there at once; only the body is fetched (a small lazy chunk).
 * While it loads a spinner is showing, which is also how the build-time
 * prerenderer (scripts/prerender.mjs) knows the page is not finished — a
 * saved page with a headline and no text would be worse than none.
 */
const JournalArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLocale();
  const article = journalArticles.find((a) => a.slug === slug);

  const [body, setBody] = useState<string | null>(null);
  const [homes, setHomes] = useState<Property[]>([]);

  useEffect(() => {
    setBody(null);
    const load = slug ? loadJournalBody[slug] : undefined;
    if (!load) return;
    let cancelled = false;
    load().then((module) => {
      if (!cancelled) setBody(module.default);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    setHomes([]);
    if (!article?.properties.length) return;
    let cancelled = false;
    supabase
      .from("properties")
      .select(
        "id, name, slug, seo_slug, location, city_group, bedrooms, bathrooms, guests, price_per_night, featured, type, guesty_listing_id, images",
      )
      .in("seo_slug", article.properties)
      .eq("available", true)
      .then(({ data }) => {
        if (cancelled || !data) return;
        // The order the article lists them in, not the database's.
        const rows = data as unknown as Property[];
        setHomes(
          article.properties
            .map((seo) => rows.find((r) => r.seo_slug === seo))
            .filter((r): r is Property => Boolean(r)),
        );
      });
    return () => {
      cancelled = true;
    };
  }, [article]);

  const sections = useMemo(() => (body ? splitJournalBody(body) : []), [body]);

  const facts = useMemo(() => {
    if (!article || homes.length === 0) return [];
    const span = (values: number[]) => {
      const lo = Math.min(...values);
      const hi = Math.max(...values);
      return { lo, hi, text: lo === hi ? `${hi}` : `${lo}–${hi}` };
    };
    const bedrooms = span(homes.map((h) => h.bedrooms ?? 0));
    const guests = span(homes.map((h) => h.guests ?? 0));
    // A studio has no bedroom; "0–2 bedrooms" would read as a mistake.
    const studio = t("journal-fact-studio");
    const bedroomText =
      bedrooms.lo === 0 ? (bedrooms.hi === 0 ? studio : `${studio}–${bedrooms.hi}`) : bedrooms.text;

    const all: Record<string, { value: string; label: string }> = {
      homes: {
        value: String(homes.length),
        label: t(homes.length === 1 ? "journal-fact-home" : "journal-fact-homes"),
      },
      bedrooms: { value: bedroomText, label: t("journal-fact-bedrooms") },
      guests: { value: guests.text, label: t("journal-fact-guests") },
    };
    return article.facts.map((f) => all[f]).filter(Boolean);
  }, [article, homes, t]);

  if (!article) return <NotFound />;

  const path = `/journal/${article.slug}`;
  const author = article.author ?? JOURNAL_AUTHOR;
  const image = article.image ? absoluteUrl(article.image) : undefined;
  const fullHero = Boolean(article.image) && article.heroLayout === "full";
  const firstPlace = article.places[0];

  const index = journalArticles.findIndex((a) => a.slug === article.slug);
  const next = journalArticles.length > 1 ? journalArticles[(index + 1) % journalArticles.length] : null;

  const byline = (
    <>
      {t("journal-by")} {author} ·{" "}
      <time dateTime={article.date}>{formatJournalDate(article.date, language)}</time>
      {article.updated && (
        <>
          {" · "}
          {t("journal-updated")}{" "}
          <time dateTime={article.updated}>{formatJournalDate(article.updated, language)}</time>
        </>
      )}
    </>
  );

  const renderBlock = (block: JournalBlock, key: string) => {
    if (block.type === "text") {
      return (
        <div key={key} className="[&>*:first-child]:mt-0">
          <JournalProse>{block.md}</JournalProse>
        </div>
      );
    }
    if (block.type === "choices") {
      return (
        <div key={key} className="mt-md first:mt-0">
          {block.rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 sm:grid-cols-5 gap-x-md gap-y-1 border-t border-border py-sm last:border-b"
            >
              <p className="t-item text-foreground sm:col-span-2">{row.label}</p>
              {/* The answers were written as the tail of a bullet ("…: the La Roca
                  studio."), so they start in lower case. */}
              <p className="t-body text-foreground sm:col-span-3 first-letter:uppercase">
                <JournalInline>{row.answer}</JournalInline>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  /**
   * One article section: the heading in the side column, text and tables in
   * the main one, and every photograph a figure of its own that sits in the
   * main columns and runs on to the right-hand edge of the screen. The text
   * after a photograph continues in the same columns without repeating the
   * heading.
   */
  const renderSection = (blocks: JournalBlock[], title: string | null, sectionKey: string) => {
    const rows: Array<
      { kind: "text"; blocks: JournalBlock[]; withTitle: boolean } | { kind: "image"; block: JournalBlock }
    > = [];
    let pending: JournalBlock[] = [];
    let titleUsed = title === null;
    const flush = () => {
      if (pending.length || !titleUsed) {
        rows.push({ kind: "text", blocks: pending, withTitle: !titleUsed });
        titleUsed = true;
      }
      pending = [];
    };
    for (const block of blocks) {
      if (block.type === "image") {
        flush();
        rows.push({ kind: "image", block });
      } else {
        pending.push(block);
      }
    }
    flush();

    return rows.map((row, rowIndex) => {
      const key = `${sectionKey}-${rowIndex}`;
      if (row.kind === "image" && row.block.type === "image") {
        const { src, alt, caption } = row.block;
        return (
          <Grid key={key} className="mt-lg">
            <figure className="md:col-start-5 md:col-span-8 md:-mr-[var(--container-inset)]">
              <img src={src} alt={alt} loading="lazy" className="w-full h-auto" />
              {caption && <figcaption className="t-meta text-muted-foreground mt-3">{caption}</figcaption>}
            </figure>
          </Grid>
        );
      }
      if (row.kind !== "text") return null;
      return (
        <Grid key={key} className={rowIndex === 0 ? undefined : "mt-lg"}>
          <div className={SIDE}>
            {row.withTitle && title && (
              <h2 className="t-block text-foreground md:sticky md:top-28">{title}</h2>
            )}
          </div>
          <div className={MAIN}>{row.blocks.map((b, i) => renderBlock(b, `${key}-${i}`))}</div>
        </Grid>
      );
    });
  };

  const intro = sections.find((s) => s.title === null);
  const chapters = sections.filter((s) => s.title !== null);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={article.title}
        description={article.description}
        path={path}
        type="article"
        image={image}
        noindex={!article.live}
        schema={[
          articleSchema({
            headline: article.title,
            description: article.description,
            path,
            datePublished: article.date,
            dateModified: article.updated,
            authorName: article.author,
            image,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/journal" },
            { name: article.title, path },
          ]),
        ]}
      />
      {/* `overlay` only where there is a photograph to lie over — DESIGN.md §10:
          on the page's own background the white links would vanish. */}
      <Navigation overlay={fullHero} logoOnDark={fullHero} />

      <main className={fullHero ? "flex-1 overflow-x-clip" : "flex-1 pt-24 overflow-x-clip"}>
        {fullHero ? (
          <section className="relative flex items-end overflow-hidden pt-20 min-h-[clamp(28rem,72vh,46rem)] bg-primary">
            <img
              src={article.image!}
              alt={article.imageAlt ?? ""}
              width={1600}
              height={900}
              loading="eager"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 overlay-media" aria-hidden="true" />
            <Container className="relative pb-xl pt-2xl">
              {!article.live && (
                <p className="t-meta text-white/80 mb-sm">{t("journal-preview-note")}</p>
              )}
              {firstPlace && (
                <p className="t-tag text-accent-on-primary">{placeName(firstPlace, t)}</p>
              )}
              <h1 className="t-display text-white text-balance mt-3 max-w-[24ch]">{article.title}</h1>
              <p className="t-meta text-white/80 mt-sm">{byline}</p>
            </Container>
          </section>
        ) : (
          // No photograph, or one too small to run the width of the page
          // (`heroLayout: framed`): headline left, photograph right, at a
          // size it can fill without being enlarged.
          <Section size="sm">
            <Grid>
              <div className="md:col-span-5 flex flex-col justify-center">
                {!article.live && (
                  <p className="t-meta text-muted-foreground mb-sm">{t("journal-preview-note")}</p>
                )}
                {firstPlace && (
                  <p className="t-tag text-accent-strong">{placeName(firstPlace, t)}</p>
                )}
                <h1 className="t-display text-foreground text-balance mt-3">{article.title}</h1>
                <p className="t-meta text-muted-foreground mt-sm">{byline}</p>
              </div>
              {article.image && (
                <div className="md:col-span-7">
                  <img
                    src={article.image}
                    alt={article.imageAlt ?? ""}
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              )}
            </Grid>
          </Section>
        )}

        <Breadcrumb
          trail={[
            { label: t("vr-home"), to: "/" },
            { label: t("journal-breadcrumb"), to: "/journal" },
            { label: article.title, to: path },
          ]}
        />

        <article>
          {facts.length > 0 && (
            <Section size="sm">
              <dl
                className={
                  facts.length >= 3
                    ? "grid grid-cols-3 gap-md border-t border-border pt-md"
                    : "grid grid-cols-2 gap-md border-t border-border pt-md md:max-w-xl"
                }
              >
                {facts.map((fact) => (
                  // Label beneath the number, but first in the source: a
                  // definition list reads term, then value.
                  <div key={fact.label} className="flex flex-col-reverse gap-2">
                    <dt className="t-meta text-muted-foreground">{fact.label}</dt>
                    <dd className="t-section text-foreground leading-none">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}

          <Section size="md">
            {body === null ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" aria-hidden="true" />
            ) : (
              <>
                {intro && (
                  <Grid>
                    <div className="md:col-start-5 md:col-span-8 [&>*:first-child]:mt-0">
                      {intro.blocks.map((b, i) => renderBlock(b, `intro-${i}`))}
                    </div>
                  </Grid>
                )}
                {chapters.map((section, i) => (
                  <div
                    key={`${section.title}-${i}`}
                    className="mt-xl border-t border-border pt-lg"
                  >
                    {renderSection(section.blocks, section.title, `s${i}`)}
                  </div>
                ))}
              </>
            )}
          </Section>
        </article>

        {homes.length > 0 && (
          <Section size="md">
            <div className="flex items-baseline justify-between gap-md mb-lg">
              <h2 className="t-section text-foreground">{t("journal-homes-title")}</h2>
            </div>
            <Grid cols={3} gap="md">
              {homes.slice(0, 3).map((home) => (
                <PropertyCard key={home.id} property={home} />
              ))}
            </Grid>
            {article.places.length > 0 && (
              <p className="t-body text-foreground mt-lg flex flex-wrap items-center gap-x-md gap-y-2">
                <span className="t-meta text-muted-foreground">{t("journal-places-title")}</span>
                {article.places.map((place) => (
                  <Link
                    key={place}
                    to={`/vacation-rentals/${place}`}
                    className="inline-flex items-center gap-2 text-accent-strong hover:text-foreground transition-colors"
                  >
                    {placeName(place, t)}
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                ))}
              </p>
            )}
          </Section>
        )}

        {next && (
          <Section size="md" tone="quiet">
            <Link to={`/journal/${next.slug}`} className="group block">
              <Grid>
                {next.image && (
                  <div className="md:col-span-5 aspect-[3/2] overflow-hidden bg-secondary">
                    <img
                      src={next.cardImage ?? next.image}
                      alt={next.imageAlt ?? ""}
                      width={720}
                      height={480}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className={`${next.image ? "md:col-span-7" : "md:col-span-12"} flex flex-col justify-center`}>
                  <p className="t-tag text-accent-strong">{t("journal-read-next")}</p>
                  <h2 className="t-block text-foreground mt-3 group-hover:text-accent-strong transition-colors">
                    {next.title}
                  </h2>
                  <p className="t-body text-muted-foreground mt-3">{next.description}</p>
                </div>
              </Grid>
            </Link>
          </Section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default JournalArticle;
