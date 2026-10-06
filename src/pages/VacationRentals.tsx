import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import Breadcrumb from "@/components/Breadcrumb";
import { Grid, Section } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import { useLocale } from "@/contexts/LocaleContext";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import {
  LOCATION_PAGE_EXCLUDED_LISTINGS,
  VACATION_RENTAL_CITIES,
  vrKey,
} from "@/lib/vacationRentals";
import { en } from "@/lib/translations";

const SEO_TITLE = "Vacation Rentals by Destination";
const SEO_DESCRIPTION =
  "Vacation rentals in Málaga, Marbella, Fuengirola, Vienna and Carinthia — homes managed by our own team and booked directly, without the platform mark-up.";

interface PlaceSummary {
  count: number;
  /** The first home's lead photo, in the same order the location page uses. */
  image?: string;
  imageAlt?: string;
}

type HomeRow = {
  name: string;
  city_group: string | null;
  guesty_listing_id: string | null;
  images: Array<{ url?: string }> | null;
};

/**
 * /vacation-rentals — the five places, and the way into each.
 *
 * Counts and photos come from the same query shape the location pages use
 * (available, grouped by `city_group`, the long-stay listing left out), so a
 * number here never disagrees with the grid one click further.
 */
const VacationRentals = () => {
  const { t } = useLocale();
  const [summary, setSummary] = useState<Record<string, PlaceSummary>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("name, city_group, guesty_listing_id, images")
        .eq("available", true)
        .not("city_group", "is", null)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) console.error("Error fetching destinations:", error);

      const next: Record<string, PlaceSummary> = {};
      for (const home of (data ?? []) as unknown as HomeRow[]) {
        if (!home.city_group) continue;
        if (LOCATION_PAGE_EXCLUDED_LISTINGS.has(home.guesty_listing_id ?? "")) continue;
        const entry = (next[home.city_group] ??= { count: 0 });
        entry.count += 1;
        if (!entry.image && home.images?.[0]?.url) {
          entry.image = home.images[0].url;
          entry.imageAlt = home.name;
        }
      }
      setSummary(next);
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        path="/vacation-rentals"
        schema={[
          collectionPageSchema({
            name: SEO_TITLE,
            description: SEO_DESCRIPTION,
            path: "/vacation-rentals",
            items: VACATION_RENTAL_CITIES.map((city) => ({
              name: en[vrKey(city.slug, "h1")],
              path: `/vacation-rentals/${city.slug}`,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Vacation Rentals", path: "/vacation-rentals" },
          ]),
        ]}
      />
      <Navigation />

      <main className="flex-1 pt-24">
        <Breadcrumb
          trail={[
            { label: t("vr-home"), to: "/" },
            { label: t("vr-breadcrumb"), to: "/vacation-rentals" },
          ]}
        />

        {/* `measure="full"` (the default), not "text" — "text" nests a
            centered `max-w-3xl` inside the already-centered `.app-container`,
            shifting this block's left edge inward from every full-width
            section around it (same fix as WinterRentals.tsx, 06.10.2026). */}
        <Section size="sm">
          <div className="max-w-3xl">
            <p className="t-tag text-accent-strong">{t("vr-overview-eyebrow")}</p>
            <h1 className="t-display text-foreground text-balance mt-3">{t("vr-overview-h1")}</h1>
            <p className="t-body text-muted-foreground mt-sm">{t("vr-overview-lead")}</p>
          </div>
        </Section>

        <Section size="md">
          <Grid cols={3} gap="md">
            {VACATION_RENTAL_CITIES.map((city) => {
              const place = summary[city.slug];
              const count = place?.count ?? 0;
              return (
                <Link key={city.slug} to={`/vacation-rentals/${city.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-secondary">
                    {loading ? (
                      <Skeleton className="w-full h-full" />
                    ) : place?.image ? (
                      <img
                        src={place.image}
                        alt={place.imageAlt ?? ""}
                        width={800}
                        height={600}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-placeholder-hatch" aria-hidden="true" />
                    )}
                  </div>
                  <h2 className="t-card text-foreground mt-3">{t(vrKey(city.slug, "name"))}</h2>
                  <p className="t-body text-muted-foreground mt-1">{t(vrKey(city.slug, "teaser"))}</p>
                  {!loading && count > 0 && (
                    <p className="t-meta text-accent-strong mt-2">
                      {count === 1
                        ? t("vr-homes-count-one")
                        : t("vr-homes-count").replace("{n}", String(count))}
                    </p>
                  )}
                </Link>
              );
            })}
          </Grid>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default VacationRentals;
