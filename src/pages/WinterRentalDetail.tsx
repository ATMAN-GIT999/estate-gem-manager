import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import Breadcrumb from "@/components/Breadcrumb";
import WinterListingCard from "@/components/winter/WinterListingCard";
import { useBedroomsLabel, useTypeLabel } from "@/hooks/useWinterLabels";
import { Grid, MediaFrame, Section } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import { useLocale } from "@/contexts/LocaleContext";
import { breadcrumbSchema, propertySchema } from "@/lib/schema";
import {
  WINTER_RENTALS_PATH,
  findWinterRentalCity,
  hasTypeLabel,
  statusKey,
  typeKey,
  toMidtermListing,
  whatsAppEnquiryUrl,
  winterListingPath,
  wrKey,
  type MidtermListing,
} from "@/lib/winterRentals";
import { en } from "@/lib/translations";
import NotFound from "./NotFound";

/**
 * /winter-rentals/:city/:slug — one home let by the month.
 *
 * The URL carries the place, so a home reached under the wrong place is a 404
 * rather than a duplicate of the right URL. The enquiry button is WhatsApp with
 * the home named in the message until the enquiry form (next work package) is
 * built. No price in the structured data — same reason as `propertySchema`: a
 * rate in markup has to be the rate on the page, and Frontier changes these by
 * hand.
 */
const WinterRentalDetailRoute = () => {
  const { city: citySlug, slug } = useParams<{ city: string; slug: string }>();
  const city = findWinterRentalCity(citySlug);
  if (!city || !slug) return <NotFound />;
  return <WinterRentalDetailPage key={slug} citySlug={city.slug} slug={slug} />;
};

const WinterRentalDetailPage = ({
  citySlug,
  slug,
}: {
  citySlug: NonNullable<ReturnType<typeof findWinterRentalCity>>["slug"];
  slug: string;
}) => {
  const { t, convertPrice, currencySymbol } = useLocale();
  const bedrooms = useBedroomsLabel();
  const typeLabel = useTypeLabel();
  const [home, setHome] = useState<MidtermListing | null>(null);
  const [others, setOthers] = useState<MidtermListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase
        .from("midterm_listings")
        .select("*")
        .eq("published", true)
        .eq("city_group", citySlug)
        .order("sort_order", { ascending: true });
      if (cancelled) return;
      if (error) console.error("Error fetching winter rental:", error);
      const all = (data ?? []).map(toMidtermListing);
      setHome(all.find((h) => h.slug === slug) ?? null);
      setOthers(all.filter((h) => h.slug !== slug));
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [citySlug, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 pt-24">
          <Section size="md">
            <Skeleton className="aspect-[16/9] w-full" />
          </Section>
        </main>
        <Footer />
      </div>
    );
  }
  if (!home) return <NotFound />;

  const place = t(wrKey(citySlug, "name"));
  const cityPath = `${WINTER_RENTALS_PATH}/${citySlug}`;
  const path = winterListingPath(home);
  const open = home.status === "available";
  const size = home.size_sqm ? t("wr-size").replace("{n}", String(home.size_sqm)) : null;
  const months = (n: number) =>
    n === 1 ? t("wr-month-one") : t("wr-months").replace("{n}", String(n));
  const money = (n: number) => `${currencySymbol}${convertPrice(n).toLocaleString("en")}`;

  // The page text is the data, put into a sentence: nothing is claimed that is
  // not a stored fact. A written description from Frontier replaces it.
  const summary =
    home.description ??
    t("wr-summary")
      .replace("{type}", typeLabel(home.property_type))
      .replace("{location}", home.location)
      .replace("{beds}", bedrooms(home.bedrooms))
      .replace("{size}", size ?? "");

  const facts: Array<[string, string]> = [
    [t("wr-fact-type"), typeLabel(home.property_type)],
    [t("wr-fact-location"), home.location],
    [t("wr-fact-bedrooms"), String(home.bedrooms)],
    ...(home.bathrooms ? ([[t("wr-fact-bathrooms"), String(home.bathrooms)]] as Array<[string, string]>) : []),
    ...(size ? ([[t("wr-fact-size"), size]] as Array<[string, string]>) : []),
    ...(home.available_from
      ? ([[t("wr-fact-available-from"), new Date(home.available_from).toLocaleDateString("en-GB")]] as Array<[string, string]>)
      : []),
    ...(home.min_stay_months
      ? ([[t("wr-fact-min-stay"), months(home.min_stay_months)]] as Array<[string, string]>)
      : []),
    ...(home.deposit ? ([[t("wr-fact-deposit"), money(home.deposit)]] as Array<[string, string]>) : []),
  ];

  const enquiryUrl = whatsAppEnquiryUrl(
    t("wr-cta-message").replace("{name}", home.name).replace("{location}", home.location)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={home.name}
        description={`${en["wr-summary"]
          .replace("{type}", hasTypeLabel(home.property_type) ? en[typeKey(home.property_type)] : home.property_type)
          .replace("{location}", home.location)
          .replace("{beds}", `${home.bedrooms} bedrooms`)
          .replace("{size}", home.size_sqm ? `${home.size_sqm} m²` : "")} Frontier Residences.`}
        path={path}
        image={home.images[0]?.url}
        schema={[
          propertySchema({
            name: home.name,
            path,
            description: home.description ?? undefined,
            images: home.images,
            location: home.location,
            bedrooms: home.bedrooms,
            bathrooms: home.bathrooms ?? undefined,
            guests: home.guests ?? undefined,
            amenities: home.amenities ?? undefined,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Winter Rentals", path: WINTER_RENTALS_PATH },
            { name: en[wrKey(citySlug, "name")], path: cityPath },
            { name: home.name, path },
          ]),
        ]}
      />
      <Navigation />

      <main className="flex-1 pt-24">
        <Breadcrumb
          trail={[
            { label: t("wr-home"), to: "/" },
            { label: t("wr-breadcrumb"), to: WINTER_RENTALS_PATH },
            { label: place, to: cityPath },
            { label: home.name, to: path },
          ]}
        />

        <Section size="sm">
          <Grid cols={2} gap="md">
            <div>
              {home.images.length > 0 ? (
                <MediaFrame
                  id={`winter-detail-${home.id}`}
                  src={home.images[0].url}
                  alt={home.images[0].caption ?? home.name}
                  note={t("wr-image-note")}
                  aspect="photo"
                  priority
                />
              ) : (
                <MediaFrame id={`winter-detail-${home.id}`} note={t("wr-image-note")} aspect="photo" />
              )}
            </div>
            <div>
              {!open && <p className="t-tag text-accent-strong">{t(statusKey(home.status))}</p>}
              <h1 className="t-display text-foreground text-balance mt-2">{home.name}</h1>
              <p className="t-body text-muted-foreground mt-sm">{summary}</p>

              <div className="border-t border-border pt-sm mt-md">
                <p className="t-meta text-muted-foreground">{t("wr-price-heading")}</p>
                <p className="t-section text-foreground mt-1">
                  {money(home.monthly_price)}{" "}
                  <span className="t-meta text-muted-foreground">{t("wr-per-month")}</span>
                </p>
                <p className="t-meta text-muted-foreground mt-2">{t("wr-price-note")}</p>
              </div>

              {open ? (
                <a
                  href={enquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-base cta-primary mt-md"
                >
                  {t("wr-cta-enquire")}
                </a>
              ) : (
                <div className="mt-md">
                  <p className="t-body text-muted-foreground">{t("wr-unavailable-note")}</p>
                  <a
                    href={enquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-base cta-secondary mt-sm"
                  >
                    {t("wr-empty-link")}
                  </a>
                </div>
              )}
            </div>
          </Grid>
        </Section>

        <Section size="sm" measure="text">
          <h2 className="t-section text-foreground mb-md">{t("wr-facts-heading")}</h2>
          <dl>
            {facts.map(([label, value]) => (
              <div key={label} className="border-t border-border py-sm flex justify-between gap-md">
                <dt className="t-body text-muted-foreground">{label}</dt>
                <dd className="t-body text-foreground text-right">{value}</dd>
              </div>
            ))}
          </dl>
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

        {others.length > 0 && (
          <Section size="md">
            <h2 className="t-section text-foreground mb-lg">
              {t("wr-more-heading").replace("{place}", place)}
            </h2>
            <Grid cols={3} gap="md">
              {others.map((other) => (
                <WinterListingCard key={other.id} home={other} />
              ))}
            </Grid>
          </Section>
        )}

        <Section size="sm" measure="text">
          <Link to={cityPath} className="t-body text-accent-strong hover:underline">
            {t("wr-back-link").replace("{place}", place)}
          </Link>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default WinterRentalDetailRoute;
