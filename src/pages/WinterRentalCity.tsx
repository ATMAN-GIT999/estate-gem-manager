import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import Breadcrumb from "@/components/Breadcrumb";
import WinterListingCard from "@/components/winter/WinterListingCard";
import { Grid, Section } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "@/contexts/LocaleContext";
import { useWinterListings } from "@/hooks/useWinterListings";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import {
  WINTER_RENTALS_PATH,
  findWinterRentalCity,
  winterListingPath,
  whatsAppEnquiryUrl,
  wrKey,
  type WinterRentalCity as City,
} from "@/lib/winterRentals";
import { en } from "@/lib/translations";
import NotFound from "./NotFound";

/**
 * /winter-rentals/:city — the homes let by the month in one place.
 *
 * An unknown place is a real 404, as on the short-stay side. A known place with
 * no published home yet is also not indexed (`noindex`): a page with an empty
 * list is a doorway page until Frontier publishes the first home.
 */
const WinterRentalCityRoute = () => {
  const { city: slug } = useParams<{ city: string }>();
  const city = findWinterRentalCity(slug);
  if (!city) return <NotFound />;
  return <WinterRentalCityPage key={city.slug} city={city} />;
};

const WinterRentalCityPage = ({ city }: { city: City }) => {
  const { t } = useLocale();
  const { homes, loading } = useWinterListings(city.slug);

  const place = t(wrKey(city.slug, "name"));
  const path = `${WINTER_RENTALS_PATH}/${city.slug}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={city.seoTitle}
        description={city.seoDescription}
        path={path}
        image={homes.find((h) => h.images[0])?.images[0]?.url}
        noindex={!loading && homes.length === 0}
        schema={[
          collectionPageSchema({
            name: en[wrKey(city.slug, "h1")],
            description: city.seoDescription,
            path,
            items: homes.map((home) => ({ name: home.name, path: winterListingPath(home) })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Winter Rentals", path: WINTER_RENTALS_PATH },
            { name: en[wrKey(city.slug, "name")], path },
          ]),
        ]}
      />
      <Navigation />

      <main className="flex-1 pt-24">
        <Breadcrumb
          trail={[
            { label: t("wr-home"), to: "/" },
            { label: t("wr-breadcrumb"), to: WINTER_RENTALS_PATH },
            { label: place, to: path },
          ]}
        />

        {/* `measure="full"` (the default), not "text" — same reason as
            WinterRentals.tsx's hero: "text" would nest a centered `max-w-3xl`
            inside the already-centered `.app-container`, shifting this off
            the left edge every other section on the page shares. */}
        <Section size="sm">
          <div className="max-w-3xl">
            <h1 className="t-display text-foreground text-balance">{t(wrKey(city.slug, "h1"))}</h1>
            <p className="t-body text-muted-foreground mt-sm">{t(wrKey(city.slug, "intro"))}</p>
          </div>
        </Section>

        <Section size="sm">
          <h2 className="t-section text-foreground mb-lg">
            {t("wr-grid-heading").replace("{place}", place)}
          </h2>
          {loading ? (
            <Grid cols={3} gap="md">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </Grid>
          ) : homes.length === 0 ? (
            <div className="border-t border-border pt-md">
              <p className="t-body text-muted-foreground">{t("wr-empty")}</p>
              <a
                href={whatsAppEnquiryUrl(`${t("wr-breadcrumb")} – ${place}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-base cta-secondary mt-sm"
              >
                {t("wr-empty-link")}
              </a>
            </div>
          ) : (
            <Grid cols={3} gap="md">
              {homes.map((home) => (
                <WinterListingCard key={home.id} home={home} />
              ))}
            </Grid>
          )}
        </Section>

        <Section size="md">
          <h2 className="t-section text-foreground mb-md">{t("wr-how-heading")}</h2>
          <div className="space-y-md max-w-2xl">
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

export default WinterRentalCityRoute;
