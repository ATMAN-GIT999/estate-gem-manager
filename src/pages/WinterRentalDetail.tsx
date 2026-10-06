import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import Breadcrumb from "@/components/Breadcrumb";
import WinterListingCard from "@/components/winter/WinterListingCard";
import WinterEnquiryForm from "@/components/winter/WinterEnquiryForm";
import { useBedroomsLabel, useTypeLabel } from "@/hooks/useWinterLabels";
import { Container, Grid, Panel, Section } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bath, Bed, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { getAmenityIcon } from "@/lib/amenityIcons";
import SurroundingsMap from "@/components/SurroundingsMap";
import { supabase } from "@/lib/supabaseClient";
import { useLocale } from "@/contexts/LocaleContext";
import { breadcrumbSchema, propertySchema } from "@/lib/schema";
import {
  GUEST_LISTING_COLUMNS,
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

/** Eight standout items, not the full amenity checklist — same as PropertyDetail.tsx. */
const KEY_FEATURE_COUNT = 8;

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
  const [similar, setSimilar] = useState<MidtermListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // `property:property_id(...)` is only on this query, not
      // GUEST_LISTING_COLUMNS — the list/card views never need a house's
      // exact coordinates, only the detail page's map does.
      //
      // Not scoped to `citySlug`: with only a handful of homes published at
      // all, filtering "You might also like" to the same city left it empty
      // on any city with just one home (Málaga, Marbella right now) — same
      // problem PropertyDetail.tsx's own `similar` query solves by ranking
      // same-place first but falling back across the whole set.
      const { data, error } = await supabase
        .from("midterm_listings")
        .select(`${GUEST_LISTING_COLUMNS}, property:property_id(latitude, longitude, address)`)
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (cancelled) return;
      if (error) console.error("Error fetching winter rental:", error);
      const all = (data ?? []).map(toMidtermListing);
      const current = all.find((h) => h.slug === slug) ?? null;
      setHome(current);
      if (current) {
        const others = all.filter((h) => h.slug !== slug);
        const ranked = [...others].sort(
          (a, b) =>
            Number(b.city_group === current.city_group) - Number(a.city_group === current.city_group) ||
            Math.abs(a.monthly_price - current.monthly_price) - Math.abs(b.monthly_price - current.monthly_price)
        );
        setSimilar(ranked.slice(0, 3));
      }
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

  // Deposit is policy, not a figure Frontier wants re-confirmed on every
  // home: 1 month's rent (DECISIONS.md §57). Shown as "1 month" rather than
  // the euro amount so the fact reads as the rule it is — only falls back to
  // the amount if a deposit is ever entered that is not a whole multiple of
  // the rent. Commission is deliberately not in this list — internal only
  // (§57, reaffirmed §59 after a brief detour through guest-facing in §58).
  const monthsOrAmount = (value: number) =>
    home.monthly_price > 0 && value % home.monthly_price === 0
      ? months(value / home.monthly_price)
      : money(value);

  // Bedrooms and bathrooms sit in the icon row by the headline instead, same
  // as PropertyDetail.tsx — this list is the facts that row has no room for.
  const facts: Array<[string, string]> = [
    [t("wr-fact-type"), typeLabel(home.property_type)],
    [t("wr-fact-location"), home.location],
    ...(size ? ([[t("wr-fact-size"), size]] as Array<[string, string]>) : []),
    ...(home.available_from
      ? ([[t("wr-fact-available-from"), new Date(home.available_from).toLocaleDateString("en-GB")]] as Array<[string, string]>)
      : []),
    ...(home.min_stay_months
      ? ([[t("wr-fact-min-stay"), months(home.min_stay_months)]] as Array<[string, string]>)
      : []),
    ...(home.deposit ? ([[t("wr-fact-deposit"), monthsOrAmount(home.deposit)]] as Array<[string, string]>) : []),
  ];

  const enquiryUrl = whatsAppEnquiryUrl(
    t("wr-cta-message").replace("{name}", home.name).replace("{location}", home.location)
  );

  // Same honesty rule as PropertyDetail.tsx's photoAlt: the house, its area
  // and which photo of how many this is. No room/feature guessed from pixels.
  const photoAlt = (n: number) =>
    `${home.name} — ${home.location} — photo ${n} of ${home.images.length}`;

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

        {/* Gallery — same shape as PropertyDetail.tsx: one lead image and up
            to four beside it in a 2×2, the clearest way to show a house
            before anyone reads a word. The 28–55 photos these four homes
            carry (copied from their Guesty listing, DECISIONS.md §57) were
            wasted on a single MediaFrame slot before this. */}
        <Container>
          <div className="relative">
            {home.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-0.5 h-[52vh] min-h-[320px] max-h-[560px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(0)}
                  className="md:col-span-2 md:row-span-2 group relative overflow-hidden"
                >
                  <img
                    src={home.images[0].url}
                    alt={photoAlt(1)}
                    width={1200}
                    height={900}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
                {home.images.slice(1, 5).map((img, idx) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setLightboxIndex(idx + 1)}
                    className="hidden md:block group relative overflow-hidden"
                  >
                    <img
                      src={img.url}
                      alt={photoAlt(idx + 2)}
                      width={600}
                      height={450}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="aspect-[16/9] w-full bg-placeholder-hatch flex items-center justify-center p-sm">
                <p className="t-meta text-accent-strong/70 text-center text-balance">{t("wr-image-note")}</p>
              </div>
            )}

          </div>
        </Container>

        <Dialog open={lightboxIndex !== null} onOpenChange={(o) => !o && setLightboxIndex(null)}>
          <DialogContent className="max-w-6xl w-[calc(100vw-2rem)] h-[calc(100vh-4rem)] p-0 bg-background/95 border-0 [&>button]:text-foreground [&>button]:opacity-100">
            <DialogTitle className="sr-only">
              {home.name} — photo {lightboxIndex !== null ? lightboxIndex + 1 : 0} of {home.images.length}
            </DialogTitle>
            {lightboxIndex !== null && (
              <div className="relative flex h-full items-center justify-center">
                <img
                  src={home.images[lightboxIndex].url}
                  alt={photoAlt(lightboxIndex + 1)}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />
                {home.images.length > 1 && (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      aria-label={t("pd-previous-photo")}
                      onClick={() =>
                        setLightboxIndex((lightboxIndex - 1 + home.images.length) % home.images.length)
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 hover:bg-background shadow-elegant"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      aria-label={t("pd-next-photo")}
                      onClick={() => setLightboxIndex((lightboxIndex + 1) % home.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 hover:bg-background shadow-elegant"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/90 px-3 py-1 t-body text-foreground shadow-elegant">
                      {lightboxIndex + 1} / {home.images.length}
                    </span>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Head and enquiry panel — the same 12-col split as PropertyDetail's
            head-and-booking section, Panel standing in for its booking card
            (gold rule + sage tint, §24/§1b — a monthly let needs a CTA, not a
            calendar). */}
        <Section size="md">
          <Grid gap="lg">
            <div className="md:col-span-7">
              {!open && <p className="t-tag text-accent-strong">{t(statusKey(home.status))}</p>}
              <h1 className="t-display text-foreground text-balance mt-2">{home.name}</h1>
              <p className="t-body text-muted-foreground mt-2">{home.location}</p>

              <ul className="flex flex-wrap items-center gap-x-lg gap-y-2 mt-md py-4 border-y border-border">
                {home.guests && (
                  <li className="flex items-center gap-2 t-body text-foreground">
                    <Users className="w-4 h-4 text-accent-strong" strokeWidth={1.5} />
                    {home.guests} {t("wr-guests")}
                  </li>
                )}
                <li className="flex items-center gap-2 t-body text-foreground">
                  <Bed className="w-4 h-4 text-accent-strong" strokeWidth={1.5} />
                  {home.bedrooms} {t("wr-fact-bedrooms")}
                </li>
                {home.bathrooms && (
                  <li className="flex items-center gap-2 t-body text-foreground">
                    <Bath className="w-4 h-4 text-accent-strong" strokeWidth={1.5} />
                    {home.bathrooms} {t("wr-fact-bathrooms")}
                  </li>
                )}
              </ul>

              <p className="t-body text-muted-foreground mt-md whitespace-pre-line">{summary}</p>

              {home.amenities && home.amenities.length > 0 && (
                <div className="mt-lg">
                  <h2 className="t-tag text-accent-strong">{t("wr-amenities-heading")}</h2>
                  <ul className="grid sm:grid-cols-2 gap-x-lg gap-y-3 mt-4">
                    {home.amenities.slice(0, KEY_FEATURE_COUNT).map((amenity) => {
                      const Icon = getAmenityIcon(amenity);
                      return (
                        <li key={amenity} className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-accent-strong shrink-0" strokeWidth={1.5} />
                          <span className="t-body text-foreground">{amenity}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* "Home at a glance" lives here now, not as its own full-width
                  section after the map — the Panel beside it runs tall once
                  the enquiry form is inside it, and this is what fills that
                  column instead of leaving it empty next to a long card
                  (Almedin, 04.10.2026). */}
              <div className="mt-lg">
                <h2 className="t-tag text-accent-strong">{t("wr-facts-heading")}</h2>
                <dl className="mt-4">
                  {facts.map(([label, value]) => (
                    <div key={label} className="border-t border-border py-sm flex justify-between gap-md">
                      <dt className="t-body text-muted-foreground">{label}</dt>
                      <dd className="t-body text-foreground text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="md:col-span-4 md:col-start-9">
              <Panel className="md:sticky md:top-24">
                <p className="t-meta text-muted-foreground">{t("wr-price-heading")}</p>
                <p className="t-section text-foreground mt-1">
                  {money(home.monthly_price)}{" "}
                  <span className="t-meta text-muted-foreground">{t("wr-per-month")}</span>
                </p>
                <p className="t-meta text-muted-foreground mt-2">{t("wr-price-note")}</p>

                {/* Price, then the enquiry fields right in the same card —
                    the costasolvillas.com reference (Almedin, 04.10.2026),
                    not a button that jumps to a form elsewhere on the page. */}
                {open ? (
                  <WinterEnquiryForm home={home} />
                ) : (
                  <div className="mt-md">
                    <p className="t-body text-muted-foreground">{t("wr-unavailable-note")}</p>
                    <a
                      href={enquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-base cta-secondary w-full mt-sm"
                    >
                      {t("wr-empty-link")}
                    </a>
                  </div>
                )}
              </Panel>
            </div>
          </Grid>
        </Section>

        {/* Surroundings/map — the linked Guesty house's real coordinates for
            a precise pin (DECISIONS.md §57), or just the area name for the
            three homes with no Guesty match yet. Same aspect-video, same
            Section-contained width as PropertyDetail.tsx's map, not the old
            21:9 full-bleed strip. */}
        <Section size="md">
          <p className="t-tag text-accent-strong">{t("pd-location-eyebrow")}</p>
          <h2 className="t-section text-foreground mt-3">{t("pd-surroundings-heading")}</h2>
          {home.property?.address && (
            <p className="t-body text-foreground mt-md max-w-2xl">{home.property.address}</p>
          )}
          <div className="mt-md">
            <SurroundingsMap
              latitude={home.property?.latitude}
              longitude={home.property?.longitude}
              address={home.property?.address}
              label={home.location}
            />
          </div>
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

        {similar.length > 0 && (
          <Section size="md">
            <p className="t-tag text-accent-strong">{t("pd-similar-eyebrow")}</p>
            <h2 className="t-section text-foreground mt-3 mb-lg">{t("pd-similar-heading")}</h2>
            <Grid cols={3} gap="md">
              {similar.map((s) => (
                <WinterListingCard key={s.id} home={s} />
              ))}
            </Grid>
          </Section>
        )}

        <Section size="sm">
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
