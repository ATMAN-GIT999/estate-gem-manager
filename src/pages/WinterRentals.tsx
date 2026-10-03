import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import Breadcrumb from "@/components/Breadcrumb";
import { Grid, Section } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "@/contexts/LocaleContext";
import { useWinterListings } from "@/hooks/useWinterListings";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { WINTER_RENTALS_PATH, WINTER_RENTAL_CITIES, wrKey } from "@/lib/winterRentals";
import { en } from "@/lib/translations";

const SEO_TITLE = "Winter & Midterm Rentals on the Costa del Sol";
const SEO_DESCRIPTION =
  "Homes to rent by the month on the Costa del Sol — Málaga, Marbella, Fuengirola and Estepona. Enquire directly with Frontier Residences and we confirm availability personally.";

/**
 * /winter-rentals — the places that have a home let by the month, and the way
 * into each. Mirrors /vacation-rentals so a guest who knows one knows the other.
 *
 * Guest page. A place with no published home is left out: a location page with
 * nothing on it is a doorway page (docs/seo/struktur.md §11).
 */
const WinterRentals = () => {
  const { t } = useLocale();
  const { homes, loading } = useWinterListings();

  const places = WINTER_RENTAL_CITIES.map((city) => {
    const inPlace = homes.filter((h) => h.city_group === city.slug);
    return { city, count: inPlace.length, image: inPlace.find((h) => h.images[0])?.images[0] };
  }).filter((p) => loading || p.count > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        path={WINTER_RENTALS_PATH}
        noindex={!loading && homes.length === 0}
        schema={[
          collectionPageSchema({
            name: SEO_TITLE,
            description: SEO_DESCRIPTION,
            path: WINTER_RENTALS_PATH,
            items: places.map(({ city }) => ({
              name: en[wrKey(city.slug, "h1")],
              path: `${WINTER_RENTALS_PATH}/${city.slug}`,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Winter Rentals", path: WINTER_RENTALS_PATH },
          ]),
        ]}
      />
      <Navigation />

      <main className="flex-1 pt-24">
        <Breadcrumb
          trail={[
            { label: t("wr-home"), to: "/" },
            { label: t("wr-breadcrumb"), to: WINTER_RENTALS_PATH },
          ]}
        />

        <Section size="sm" measure="text">
          <p className="t-tag text-accent-strong">{t("wr-overview-eyebrow")}</p>
          <h1 className="t-display text-foreground text-balance mt-3">{t("wr-overview-h1")}</h1>
          <p className="t-body text-muted-foreground mt-sm">{t("wr-overview-lead")}</p>
        </Section>

        <Section size="md">
          {loading ? (
            <Grid cols={3} gap="md">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              ))}
            </Grid>
          ) : places.length === 0 ? (
            <div className="border-t border-border pt-md">
              <p className="t-body text-muted-foreground">{t("wr-empty")}</p>
            </div>
          ) : (
            <Grid cols={3} gap="md">
              {places.map(({ city, count, image }) => (
                <Link
                  key={city.slug}
                  to={`${WINTER_RENTALS_PATH}/${city.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-secondary">
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.caption ?? ""}
                        width={800}
                        height={600}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-placeholder-hatch" aria-hidden="true" />
                    )}
                  </div>
                  <h2 className="t-card text-foreground mt-3">{t(wrKey(city.slug, "name"))}</h2>
                  <p className="t-body text-muted-foreground mt-1">
                    {t(wrKey(city.slug, "teaser"))}
                  </p>
                  <p className="t-meta text-accent-strong mt-2">
                    {count === 1
                      ? t("wr-homes-count-one")
                      : t("wr-homes-count").replace("{n}", String(count))}
                  </p>
                </Link>
              ))}
            </Grid>
          )}
        </Section>

        <Section size="md" measure="text">
          <h2 className="t-section text-foreground mb-md">{t("wr-how-heading")}</h2>
          <div className="space-y-md">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border-t border-border pt-sm">
                <h3 className="t-block text-foreground">
                  {t(`wr-how-${n}-title` as Parameters<typeof t>[0])}
                </h3>
                <p className="t-body text-muted-foreground mt-2">
                  {t(`wr-how-${n}-body` as Parameters<typeof t>[0])}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default WinterRentals;
