import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { journalArticles } from "virtual:journal";
import { Container, Grid, Section } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import { formatJournalDate } from "@/lib/journal";
import { vrKey } from "@/lib/vacationRentals";
import type { TranslationKey } from "@/lib/translations";

/** How many articles the home page shows — three, like every other row on it. */
const COUNT = 3;

interface JournalTeaserProps {
  /**
   * A place slug (`malaga`, `carinthia` …): show only the articles about that
   * place. Omit it for the three newest overall — the landing page.
   */
  place?: string;
}

/**
 * The newest journal articles, for the landing page and — with `place` — for
 * a location page.
 *
 * Guest content only, so it sits in the guest half of a page, before the FAQ
 * and well before any hand-off to owners — not on /property-management, which
 * speaks to owners and would have to switch audience for it.
 *
 * On a location page this is the way from "I am looking at Málaga" to the
 * article that helps choose there, and the link back that docs/seo/struktur.md
 * §8 asks for: every article already links its place, the place now links
 * its articles.
 *
 * It lists *published* articles (`live`), never previews: the dev server and
 * Netlify previews also carry drafts and future dates in `journalArticles`,
 * and a landing page that shows an unpublished article is the one place that
 * mistake would be seen by everyone. With none published it renders nothing,
 * the same rule that keeps /journal out of the sitemap and the footer.
 *
 * No cards — a photo, a line and a headline, like the destinations above it.
 */
const JournalTeaser = ({ place }: JournalTeaserProps) => {
  const { t, language } = useLocale();
  const articles = journalArticles
    .filter((a) => a.live && (!place || a.places.includes(place)))
    .slice(0, COUNT);
  if (articles.length === 0) return null;

  return (
    <Section size="md">
      <div className="flex items-baseline justify-between gap-md mb-lg">
        <h2 className="t-section text-foreground">{t("journal-teaser-heading")}</h2>
        <Link
          to="/journal"
          className="shrink-0 inline-flex items-center gap-2 t-body text-foreground/80 hover:text-accent-strong transition-colors"
        >
          {t("journal-all")}
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>

      <Grid cols={3} gap="md">
        {articles.map((article) => (
          <Link key={article.slug} to={`/journal/${article.slug}`} className="group block">
            {article.image && (
              <div className="aspect-[3/2] overflow-hidden bg-secondary">
                <img
                  src={article.cardImage ?? article.image}
                  alt={article.imageAlt ?? ""}
                  width={720}
                  height={480}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <p className="t-meta text-accent-strong mt-4">
              {/* On a place page the label is that place, even for an article
                  that covers several — "Málaga" over a Vienna piece would be
                  wrong. */}
              {place || article.places[0]
                ? t(vrKey((place ?? article.places[0]) as never, "name") as TranslationKey)
                : t("journal-eyebrow")}
              {" · "}
              <time dateTime={article.date}>{formatJournalDate(article.date, language)}</time>
            </p>
            <h3 className="t-card text-foreground mt-2 group-hover:text-accent-strong transition-colors">
              {article.title}
            </h3>
            <p className="t-body text-muted-foreground mt-3">{article.description}</p>
          </Link>
        ))}
      </Grid>
    </Section>
  );
};

export default JournalTeaser;
