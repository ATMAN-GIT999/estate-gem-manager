import { Link } from "react-router-dom";
import { journalArticles } from "virtual:journal";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import Breadcrumb from "@/components/Breadcrumb";
import { Grid, Section } from "@/components/layout";
import { useLocale } from "@/contexts/LocaleContext";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { formatJournalDate } from "@/lib/journal";
import { vrKey } from "@/lib/vacationRentals";
import { en, type TranslationKey } from "@/lib/translations";

/**
 * /journal — the list of articles.
 *
 * With nothing published it is `noindex`, absent from the sitemap and not
 * linked from the footer: an index page with no entries is the kind of thin
 * page docs/seo/struktur.md §11 rules out. All three switch on by themselves
 * when the first article goes live.
 */
const Journal = () => {
  const { t, language } = useLocale();
  const hasLive = journalArticles.some((a) => a.live);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={en["journal-seo-title"]}
        description={en["journal-seo-description"]}
        path="/journal"
        noindex={!hasLive}
        schema={
          hasLive
            ? [
                collectionPageSchema({
                  name: en["journal-seo-title"],
                  description: en["journal-seo-description"],
                  path: "/journal",
                  items: journalArticles
                    .filter((a) => a.live)
                    .map((a) => ({ name: a.title, path: `/journal/${a.slug}` })),
                }),
                breadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: en["journal-breadcrumb"], path: "/journal" },
                ]),
              ]
            : undefined
        }
      />
      <Navigation />

      <main className="flex-1 pt-24">
        <Breadcrumb
          trail={[
            { label: t("vr-home"), to: "/" },
            { label: t("journal-breadcrumb"), to: "/journal" },
          ]}
        />

        <Section size="sm">
          <div className="max-w-3xl">
            <p className="t-tag text-accent-strong">{t("journal-eyebrow")}</p>
            <h1 className="t-display text-foreground text-balance mt-3">{t("journal-h1")}</h1>
            <p className="t-body text-muted-foreground mt-sm">{t("journal-lead")}</p>
          </div>
        </Section>

        <Section size="md">
          {journalArticles.length === 0 ? (
            <p className="t-body text-muted-foreground">{t("journal-empty")}</p>
          ) : (
            <Grid cols={3} gap="md">
              {journalArticles.map((article) => (
                <Link key={article.slug} to={`/journal/${article.slug}`} className="group block">
                  {article.image && (
                    <div className="aspect-[3/2] overflow-hidden bg-secondary">
                      <img
                        src={article.image}
                        alt={article.imageAlt ?? ""}
                        width={900}
                        height={600}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className={article.image ? "mt-3" : "border-t border-border pt-3"}>
                    <p className="t-meta text-accent-strong">
                      {article.places[0]
                        ? t(vrKey(article.places[0] as never, "name") as TranslationKey)
                        : t("journal-eyebrow")}
                      {" · "}
                      <time dateTime={article.date}>{formatJournalDate(article.date, language)}</time>
                    </p>
                    <h2 className="t-card text-foreground mt-1">{article.title}</h2>
                    <p className="t-body text-muted-foreground mt-1">{article.description}</p>
                    {!article.live && (
                      <p className="t-meta text-muted-foreground mt-2">{t("journal-preview-note")}</p>
                    )}
                  </div>
                </Link>
              ))}
            </Grid>
          )}
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default Journal;
