import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { journalArticles, loadJournalBody } from "virtual:journal";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import Breadcrumb from "@/components/Breadcrumb";
import JournalProse from "@/components/JournalProse";
import { Section } from "@/components/layout";
import NotFound from "@/pages/NotFound";
import { useLocale } from "@/contexts/LocaleContext";
import { supabase } from "@/lib/supabaseClient";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { formatJournalDate } from "@/lib/journal";
import { propertyPath } from "@/lib/propertyUrl";
import { absoluteUrl, JOURNAL_AUTHOR } from "@/lib/siteMeta";
import { vrKey } from "@/lib/vacationRentals";
import type { TranslationKey } from "@/lib/translations";

interface HomeLink {
  slug: string;
  seo_slug: string | null;
  name: string;
}

/**
 * /journal/:slug — one article.
 *
 * The title, byline and the place and home links come from the front matter
 * and are there at once; only the body is fetched (a small lazy chunk). While
 * it loads a spinner is showing, which is also how the build-time prerenderer
 * (scripts/prerender.mjs) knows the page is not finished — a saved page with
 * a headline and no text would be worse than none.
 */
const JournalArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLocale();
  const article = journalArticles.find((a) => a.slug === slug);

  const [body, setBody] = useState<string | null>(null);
  const [homes, setHomes] = useState<HomeLink[]>([]);

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
      .select("slug, seo_slug, name")
      .in("seo_slug", article.properties)
      .eq("available", true)
      .then(({ data }) => {
        if (cancelled || !data) return;
        // The order the article lists them in, not the database's.
        const rows = data as HomeLink[];
        setHomes(
          article.properties
            .map((seo) => rows.find((r) => r.seo_slug === seo))
            .filter((r): r is HomeLink => Boolean(r)),
        );
      });
    return () => {
      cancelled = true;
    };
  }, [article]);

  if (!article) return <NotFound />;

  const path = `/journal/${article.slug}`;
  const author = article.author ?? JOURNAL_AUTHOR;
  const image = article.image ? absoluteUrl(article.image) : undefined;
  const firstPlace = article.places[0];

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
      <Navigation />

      <main className="flex-1 pt-24">
        <Breadcrumb
          trail={[
            { label: t("vr-home"), to: "/" },
            { label: t("journal-breadcrumb"), to: "/journal" },
            { label: article.title, to: path },
          ]}
        />

        <article>
          {/* Default measure with an inner `max-w-3xl`, not `measure="text"`:
              that one centres the column inside the container and moves its
              left edge away from the breadcrumb above (same note as
              VacationRentals.tsx). */}
          <Section size="sm">
            <div className="max-w-3xl">
            {!article.live && (
              <p className="t-meta text-muted-foreground mb-sm">{t("journal-preview-note")}</p>
            )}
            {firstPlace && (
              <p className="t-tag text-accent-strong">
                {t(vrKey(firstPlace as never, "name") as TranslationKey)}
              </p>
            )}
            <h1 className="t-display text-foreground text-balance mt-3">{article.title}</h1>
            <p className="t-meta text-muted-foreground mt-sm">
              {t("journal-by")} {author} ·{" "}
              <time dateTime={article.date}>{formatJournalDate(article.date, language)}</time>
              {article.updated && (
                <>
                  {" · "}
                  {t("journal-updated")}{" "}
                  <time dateTime={article.updated}>{formatJournalDate(article.updated, language)}</time>
                </>
              )}
            </p>
            </div>
          </Section>

          {article.image && (
            <Section size="none">
              <img
                src={article.image}
                alt={article.imageAlt ?? ""}
                width={1200}
                height={800}
                className="w-full max-w-3xl h-auto"
              />
            </Section>
          )}

          <Section size="md">
            <div className="max-w-3xl">
              {body === null ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" aria-hidden="true" />
              ) : (
                <JournalProse>{body}</JournalProse>
              )}
            </div>
          </Section>
        </article>

        {(article.places.length > 0 || homes.length > 0) && (
          <Section size="md" tone="quiet">
            <div className="max-w-3xl">
            {article.places.length > 0 && (
              <>
                <h2 className="t-block text-foreground">{t("journal-places-title")}</h2>
                <ul className="mt-md space-y-md">
                  {article.places.map((place) => (
                    <li key={place}>
                      <Link to={`/vacation-rentals/${place}`} className="group block">
                        <span className="t-card text-foreground group-hover:text-accent-strong transition-colors">
                          {t(vrKey(place as never, "name") as TranslationKey)}
                        </span>
                        <span className="t-body text-muted-foreground block mt-1">
                          {t(vrKey(place as never, "teaser") as TranslationKey)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {homes.length > 0 && (
              <div className={article.places.length > 0 ? "mt-lg" : undefined}>
                <h2 className="t-block text-foreground">{t("journal-homes-title")}</h2>
                <ul className="mt-md space-y-2">
                  {homes.map((home) => (
                    <li key={home.slug}>
                      <Link
                        to={propertyPath(home)}
                        className="t-body text-accent-strong underline underline-offset-2 hover:text-foreground transition-colors"
                      >
                        {home.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            </div>
          </Section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default JournalArticle;
