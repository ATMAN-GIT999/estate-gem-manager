import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { format, parseISO, isValid } from "date-fns";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import WinterHero from "@/components/WinterHero";
import WinterListingCard from "@/components/winter/WinterListingCard";
import { Container, Grid, Section } from "@/components/layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "@/contexts/LocaleContext";
import { useWinterListings } from "@/hooks/useWinterListings";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import {
  BUDGET_CAPS,
  WINTER_RENTALS_PATH,
  WINTER_RENTAL_CITIES,
  isAvailableForMoveIn,
  stayLengthMatches,
  winterStatusRank,
  wrKey,
  type MidtermListing,
  type StayLengthBucket,
  type WinterRentalCity,
} from "@/lib/winterRentals";
import { en } from "@/lib/translations";

const SEO_TITLE = "Winter & Midterm Rentals on the Costa del Sol";
const SEO_DESCRIPTION =
  "Homes to rent by the month on the Costa del Sol — Málaga, Marbella, Fuengirola and Estepona. Search by place, move-in date, budget and stay length; enquire directly with Frontier Residences.";

type SortOption = "recommended" | "price-asc" | "price-desc" | "soon";
type DurationFilter = StayLengthBucket["id"] | "any";

/** Three rows of three before the grid asks to be continued — same rhythm as /properties. */
const PAGE_SIZE = 9;

const parseDateParam = (value: string | null) => {
  if (!value) return undefined;
  const date = parseISO(value);
  return isValid(date) ? date : undefined;
};

/**
 * /winter-rentals — the search hub for every published midterm home, across
 * all four places at once. Mirrors /properties's role on the short-stay side
 * (docs/PROJECT.md): a hero with a search, a plain filter row, a flat grid.
 * The per-city pages under this stay unchanged, simple SEO landing pages
 * with no filters of their own — this page is the only place that searches.
 *
 * `status` never excludes a home here — only `isAvailableForMoveIn` does.
 * See WinterListingCard.tsx's own note on why a let home stays on the page.
 */
const WinterRentals = () => {
  const { t } = useLocale();
  const { homes, loading } = useWinterListings();
  const [searchParams, setSearchParams] = useSearchParams();

  const [placeInput, setPlaceInput] = useState<WinterRentalCity["slug"] | "">(
    (searchParams.get("place") as WinterRentalCity["slug"] | "") || ""
  );
  const [moveInInput, setMoveInInput] = useState<Date | undefined>(() => parseDateParam(searchParams.get("moveIn")));

  const activePlace = (searchParams.get("place") as WinterRentalCity["slug"] | "") || "";
  const activeMoveIn = searchParams.get("moveIn") || "";

  const [durationFilter, setDurationFilter] = useState<DurationFilter>("any");
  const [budgetFilter, setBudgetFilter] = useState<string>("any");
  const [bedroomFilter, setBedroomFilter] = useState<string>("any");
  const [sortOption, setSortOption] = useState<SortOption>("recommended");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activePlace, activeMoveIn, durationFilter, budgetFilter, bedroomFilter, sortOption]);

  const applySearch = () => {
    const next = new URLSearchParams(searchParams);
    if (placeInput) next.set("place", placeInput); else next.delete("place");
    if (moveInInput) next.set("moveIn", format(moveInInput, "yyyy-MM-dd")); else next.delete("moveIn");
    setSearchParams(next);
  };

  const hasActiveFilters =
    Boolean(activePlace) ||
    Boolean(activeMoveIn) ||
    durationFilter !== "any" ||
    budgetFilter !== "any" ||
    bedroomFilter !== "any";

  const clearFilters = () => {
    setPlaceInput("");
    setMoveInInput(undefined);
    setDurationFilter("any");
    setBudgetFilter("any");
    setBedroomFilter("any");
    setSearchParams(new URLSearchParams());
  };

  const filtered = useMemo(() => {
    return homes.filter((home) => {
      if (activePlace && home.city_group !== activePlace) return false;
      if (!isAvailableForMoveIn(home, activeMoveIn || null)) return false;
      if (!stayLengthMatches(home, durationFilter)) return false;
      if (budgetFilter !== "any" && home.monthly_price > Number(budgetFilter)) return false;
      if (bedroomFilter !== "any" && home.bedrooms < Number(bedroomFilter)) return false;
      return true;
    });
  }, [homes, activePlace, activeMoveIn, durationFilter, budgetFilter, bedroomFilter]);

  // Status ranks first in every sort mode — an unavailable home sinks rather
  // than being filtered out, so a ranking URL never 404s the day it is let.
  const sorted = useMemo(() => {
    const byStatus = (a: MidtermListing, b: MidtermListing) => winterStatusRank(a.status) - winterStatusRank(b.status);
    return [...filtered].sort((a, b) => {
      const rankDiff = byStatus(a, b);
      if (rankDiff !== 0) return rankDiff;
      switch (sortOption) {
        case "price-asc":
          return a.monthly_price - b.monthly_price;
        case "price-desc":
          return b.monthly_price - a.monthly_price;
        case "soon":
          return (a.available_from ?? "").localeCompare(b.available_from ?? "");
        default:
          return a.sort_order - b.sort_order;
      }
    });
  }, [filtered, sortOption]);

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
            items: WINTER_RENTAL_CITIES.map((city) => ({
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

      <main className="flex-1 overflow-x-clip">
        <WinterHero
          place={placeInput}
          moveInDate={moveInInput}
          onPlaceChange={setPlaceInput}
          onMoveInChange={setMoveInInput}
          onSearch={applySearch}
        />

        {/* The filter row — plain underlined dropdowns, not /properties's
            pill Selects (Almedin's brief, 06.10.2026: same .t-tag/.t-body
            typography and system, deliberately different chrome). */}
        <div className="border-b border-border">
          <Container className="py-3 flex flex-wrap items-center gap-x-md gap-y-2">
            <Select value={durationFilter} onValueChange={(v) => setDurationFilter(v as DurationFilter)}>
              <SelectTrigger className="h-9 w-auto gap-2 rounded-full border-border bg-background px-4 t-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">
                  {t("wr-filter-duration-label")} · {t("wr-filter-duration-any")}
                </SelectItem>
                <SelectItem value="short">{t("wr-filter-duration-short")}</SelectItem>
                <SelectItem value="mid">{t("wr-filter-duration-mid")}</SelectItem>
                <SelectItem value="long">{t("wr-filter-duration-long")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
              <SelectTrigger className="h-9 w-auto gap-2 rounded-full border-border bg-background px-4 t-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">
                  {t("wr-filter-budget-label")} · {t("wr-filter-budget-any")}
                </SelectItem>
                {BUDGET_CAPS.map((cap) => (
                  <SelectItem key={cap} value={String(cap)}>
                    {t("wr-filter-budget-under").replace("{amount}", `€${cap.toLocaleString("en")}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
              <SelectTrigger className="h-9 w-auto gap-2 rounded-full border-border bg-background px-4 t-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">
                  {t("wr-filter-bedrooms-label")} · {t("wr-filter-bedrooms-any")}
                </SelectItem>
                {["1", "2", "3", "4", "5"].map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}+ {t("wr-filter-bedrooms-label")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
              <SelectTrigger className="h-9 w-auto gap-2 rounded-full border-border bg-background px-4 t-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">{t("wr-filter-sort-recommended")}</SelectItem>
                <SelectItem value="price-asc">{t("wr-filter-sort-price-asc")}</SelectItem>
                <SelectItem value="price-desc">{t("wr-filter-sort-price-desc")}</SelectItem>
                <SelectItem value="soon">{t("wr-filter-sort-soon")}</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="t-body text-accent-strong underline underline-offset-4 hover:text-foreground transition-colors"
              >
                {t("wr-filter-clear")}
              </button>
            )}
          </Container>
        </div>

        <Section size="md">
          {loading ? (
            <Grid cols={3} gap="md">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </Grid>
          ) : sorted.length === 0 ? (
            <div className="text-center py-xl border-t border-border">
              <p className="t-body text-muted-foreground mb-4">{t("wr-empty")}</p>
              {hasActiveFilters && (
                <button type="button" onClick={clearFilters} className="cta-base cta-secondary">
                  {t("wr-filter-clear")}
                </button>
              )}
            </div>
          ) : (
            <>
              <Grid cols={3} gap="md">
                {sorted.slice(0, visibleCount).map((home) => (
                  <WinterListingCard key={home.id} home={home} />
                ))}
              </Grid>

              {visibleCount < sorted.length && (
                <div className="mt-lg text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                    className="cta-base cta-secondary"
                  >
                    {t("properties.viewMore")} &rarr;
                  </button>
                </div>
              )}
            </>
          )}
        </Section>

        {/* The per-city pages are still real, SEO-indexed landing pages —
            this is their one inbound link now that the hub no longer shows
            them as the main grid (Almedin's brief, 06.10.2026). */}
        <Section size="sm">
          <div className="border-t border-border pt-md">
            <p className="t-tag text-accent-strong mb-3">{t("wr-browse-by-place")}</p>
            <div className="flex flex-wrap gap-2">
              {WINTER_RENTAL_CITIES.map((city) => (
                <Link
                  key={city.slug}
                  to={`${WINTER_RENTALS_PATH}/${city.slug}`}
                  className="t-body text-foreground rounded-full border border-border bg-background px-4 py-1.5 hover:border-accent-strong hover:text-accent-strong transition-colors"
                >
                  {t(wrKey(city.slug, "name"))}
                </Link>
              ))}
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default WinterRentals;
