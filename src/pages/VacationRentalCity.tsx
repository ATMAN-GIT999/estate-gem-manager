import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowRight, Minus, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import Breadcrumb from "@/components/Breadcrumb";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import { Grid, Section } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import { useLocale } from "@/contexts/LocaleContext";
import { breadcrumbSchema, collectionPageSchema, faqSchema } from "@/lib/schema";
import {
  LOCATION_PAGE_EXCLUDED_LISTINGS,
  englishFaq,
  findVacationRentalCity,
  vrKey,
  type VacationRentalCity as City,
} from "@/lib/vacationRentals";
import { en } from "@/lib/translations";
import { propertyPath } from "@/lib/propertyUrl";
import NotFound from "./NotFound";

/**
 * /vacation-rentals/:city — one page per place where there are homes to book.
 *
 * The order is the one docs/seo/struktur.md §3 lays down: what the place is,
 * the homes, the areas they sit in, getting there and when to come, the
 * questions, and one line for owners at the very end. The three blocks after
 * the grid are what make this a location page rather than a filtered list
 * with its own URL — take them out and it is a doorway page.
 *
 * Guest page. The owner line at the bottom is the only owner-directed copy on
 * it, and it stays one line (CLAUDE.md: owner language on guest pages is this
 * project's historical main mistake).
 */
const VacationRentalCityRoute = () => {
  const { city: slug } = useParams<{ city: string }>();
  const city = findVacationRentalCity(slug);
  // An unknown place is a real 404, not an empty location page — a page for a
  // town with no homes is exactly what docs/seo/struktur.md §11 rules out.
  if (!city) return <NotFound />;
  // Keyed on the slug so moving between two location pages starts clean
  // instead of briefly showing the previous place's homes.
  return <VacationRentalCityPage key={city.slug} city={city} />;
};

const VacationRentalCityPage = ({ city }: { city: City }) => {
  const { t } = useLocale();
  const [homes, setHomes] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("available", true)
        .eq("city_group", city.slug)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) console.error("Error fetching location homes:", error);
      // The generated row type widens `images` to `Json`; PropertyCard wants
      // the {url, caption} shape the importer actually writes.
      const rows = (data ?? []) as unknown as Property[];
      setHomes(
        rows.filter((home) => !LOCATION_PAGE_EXCLUDED_LISTINGS.has(home.guesty_listing_id ?? ""))
      );
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [city.slug]);

  const place = t(vrKey(city.slug, "name"));
  const path = `/vacation-rentals/${city.slug}`;
  const areas = Array.from({ length: city.areaCount }, (_, i) => i);
  const faqIndexes = Array.from({ length: city.faqCount }, (_, i) => i);

  // Markup is English, like every <Seo> on the site; the visible page follows
  // the visitor's language.
  const englishPlace = en[vrKey(city.slug, "name")];
  const trail = [
    { name: "Home", path: "/" },
    { name: "Vacation Rentals", path: "/vacation-rentals" },
    { name: englishPlace, path },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={city.seoTitle}
        description={city.seoDescription}
        path={path}
        image={homes[0]?.images?.[0]?.url}
        schema={[
          collectionPageSchema({
            name: en[vrKey(city.slug, "h1")],
            description: city.seoDescription,
            path,
            items: homes.map((home) => ({ name: home.name, path: propertyPath(home) })),
          }),
          breadcrumbSchema(trail),
          faqSchema(englishFaq(city)),
        ]}
      />
      <Navigation />

      <main className="flex-1 pt-24">
        <Breadcrumb
          trail={[
            { label: t("vr-home"), to: "/" },
            { label: t("vr-breadcrumb"), to: "/vacation-rentals" },
            { label: place, to: path },
          ]}
        />

        {/* 1 · What this place is, in one real sentence. `measure="full"`
            (the default), not "text" — "text" nests a centered `max-w-3xl`
            inside the already-centered `.app-container`, shifting this block
            off the left edge every other section on the page shares (same
            fix as WinterRentalDetail.tsx, 06.10.2026). */}
        <Section size="sm">
          <div className="max-w-3xl">
            <h1 className="t-display text-foreground text-balance">{t(vrKey(city.slug, "h1"))}</h1>
            <p className="t-body text-muted-foreground mt-sm">{t(vrKey(city.slug, "intro"))}</p>
          </div>
        </Section>

        {/* 2 · The homes. The same card as /properties, not a new pattern. */}
        <Section size="sm">
          <h2 className="t-section text-foreground mb-lg">
            {t("vr-grid-heading").replace("{place}", place)}
          </h2>
          {loading ? (
            <Grid cols={3} gap="md">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </Grid>
          ) : homes.length === 0 ? (
            // Every place here has stock, so this only shows if the listings
            // are switched off in the meantime — and then it must not read as
            // a broken search.
            <div className="border-t border-border pt-md">
              <p className="t-body text-muted-foreground">{t("vr-empty")}</p>
              <Link to="/properties" className="cta-base cta-secondary mt-sm">
                {t("vr-empty-link")}
              </Link>
            </div>
          ) : (
            <Grid cols={3} gap="md">
              {homes.map((home) => (
                <PropertyCard key={home.id} property={home} />
              ))}
            </Grid>
          )}
        </Section>

        {/* 3 · The areas — the part of the page no filtered list can have.
            Hairline above each block rather than a card around it. */}
        <Section size="md">
          <h2 className="t-section text-foreground mb-md">{t("vr-areas-heading")}</h2>
          <div className="space-y-md max-w-2xl">
            {areas.map((i) => (
              <div key={i} className="border-t border-border pt-sm">
                <h3 className="t-block text-foreground">
                  {t(vrKey(city.slug, `area-${i}-title`))}
                </h3>
                <p className="t-body text-muted-foreground mt-2">
                  {t(vrKey(city.slug, `area-${i}-body`))}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* 4 · Getting there and when to come. */}
        <Section size="sm">
          <Grid cols={2} gap="md" className="max-w-3xl">
            <div className="border-t border-border pt-sm">
              <h2 className="t-block text-foreground">{t("vr-arrival-heading")}</h2>
              <p className="t-body text-muted-foreground mt-2">{t(vrKey(city.slug, "arrival"))}</p>
            </div>
            <div className="border-t border-border pt-sm">
              <h2 className="t-block text-foreground">{t("vr-season-heading")}</h2>
              <p className="t-body text-muted-foreground mt-2">{t(vrKey(city.slug, "season"))}</p>
            </div>
          </Grid>
        </Section>

        {/* 5 · Questions. The same hairline-and-gold-± accordion as the
            landing page FAQ (FAQ.tsx explains why it is built on the bare
            Radix primitive). The `FAQPage` markup above is built from the
            same keys, so what is marked up is what is on the page. */}
        <Section size="md">
          <h2 className="t-section text-foreground mb-md">
            {t("vr-faq-heading").replace("{place}", place)}
          </h2>
          <AccordionPrimitive.Root type="single" collapsible className="w-full max-w-2xl">
            {faqIndexes.map((i) => (
              <AccordionPrimitive.Item
                key={i}
                value={`item-${i}`}
                className="border-t border-border last:border-b"
              >
                <AccordionPrimitive.Header>
                  <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-6 py-[22px] text-left">
                    <span className="t-item text-foreground">
                      {t(vrKey(city.slug, `faq-q-${i}`))}
                    </span>
                    <span className="relative w-5 h-5 shrink-0 text-accent-strong">
                      <Plus className="absolute inset-0 w-5 h-5 group-data-[state=open]:opacity-0 transition-opacity" />
                      <Minus className="absolute inset-0 w-5 h-5 opacity-0 group-data-[state=open]:opacity-100 transition-opacity" />
                    </span>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <p className="pb-sm t-body text-muted-foreground">
                    {t(vrKey(city.slug, `faq-a-${i}`))}
                  </p>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            ))}
          </AccordionPrimitive.Root>
        </Section>

        {/* 6 · One line for owners, and only one. It points at the owner page
            itself: the per-place owner pages (/property-management/<place>)
            are priority two and do not exist yet. */}
        <Section size="sm">
          <p className="t-body text-muted-foreground border-t border-border pt-sm flex flex-wrap items-center gap-x-2 gap-y-1">
            {t("vr-owner-bridge").replace("{place}", place)}
            <Link
              to="/property-management"
              className="inline-flex items-center gap-1.5 text-accent-strong font-semibold hover:gap-2.5 transition-all"
            >
              {t("vr-owner-bridge-link")}
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </p>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default VacationRentalCityRoute;
