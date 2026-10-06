import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { format, isValid, parseISO } from "date-fns";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import Breadcrumb from "@/components/Breadcrumb";
import WinterHero from "@/components/winter/WinterHero";
import WinterListingCard from "@/components/winter/WinterListingCard";
import { Container, Grid, Section } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  type StayLengthBucket,
  type WinterRentalCity,
} from "@/lib/winterRentals";
import { en } from "@/lib/translations";

const SEO_TITLE = "Winter & Midterm Rentals on the Costa del Sol";
const SEO_DESCRIPTION =
  "Homes to rent by the month on the Costa del Sol — Málaga, Marbella, Fuengirola and Estepona. Enquire directly with Frontier Residences and we confirm availability personally.";

type SortOption = "recommended" | "price-asc" | "price-desc" | "soonest";

/** Two rows of three before the list asks to be continued — the inventory is small today. */
const PAGE_SIZE = 6;

const parseDateParam = (value: string | null) => {
  if (!value) return undefined;
  const date = parseISO(value);
  return isValid(date) ? date : undefined;
};

/**
 * /winter-rentals — the winter-rental line's own front door (06.10.2026
 * decision), not just a hub of city tiles. Hero band with Place + Move-in
 * date, a filter strip for stay length/budget/bedrooms/sort, then one flat
 * grid of every published home — the same shape `/` (Hero → SearchBar) and
 * `/properties` (search bar → filter strip → grid) use for the short-stay
 * side, so a guest who knows one knows the other.
 *
 * The per-city pages (`/winter-rentals/:city`) are unchanged: they stay the
 * simple, SEO-indexed landing page per place — the role `/vacation-rentals/
 * :city` plays next to `/properties`. "Browse by place" below links to them
 * so that structure doesn't lose its only in-page entry point now that the
 * big city-tile grid is gone from here.
 *
 * All filtering is client-side over the (small) already-fetched list —
 * there is no Guesty calendar behind these homes, so there is nothing to
 * call. See src/lib/winterRentals.ts for the actual matching rules.
 */
const WinterRentals = () => {
  const { t, convertPrice, currencySymbol } = useLocale();
  const { homes, loading } = useWinterListings();
  const [searchParams, setSearchParams] = useSearchParams();

  const activePlace = (searchParams.get("place") as WinterRentalCity["slug"] | null) || "";
  const activeMoveIn = searchParams.get("moveIn") || "";

  const [placeInput, setPlaceInput] = useState<WinterRentalCity["slug"] | "">(activePlace);
  const [moveInInput, setMoveInInput] = useState<Date | undefined>(() => parseDateParam(searchParams.get("moveIn")));

  const [stayFilter, setStayFilter] = useState<StayLengthBucket>("any");
  const [budgetFilter, setBudgetFilter] = useState<string>("any");
  const [bedroomFilter, setBedroomFilter] = useState("any");
  const [sortOption, setSortOption] = useState<SortOption>("recommended");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const applySearch = () => {
    const next = new URLSearchParams(searchParams);
    if (placeInput) next.set("place", placeInput);
    else next.delete("place");
    if (moveInInput) next.set("moveIn", format(moveInInput, "yyyy-MM-dd"));
    else next.delete("moveIn");
    setSearchParams(next);
  };

  const clearFilters = () => {
    setPlaceInput("");
    setMoveInInput(undefined);
    setStayFilter("any");
    setBudgetFilter("any");
    setBedroomFilter("any");
    setSortOption("recommended");
    setSearchParams(new URLSearchParams());
  };

  const filtered = useMemo(() => {
    return homes.filter((h) => {
      if (activePlace && h.city_group !== activePlace) return false;
      if (!isAvailableForMoveIn(h, activeMoveIn || null)) return false;
      if (!stayLengthMatches(h, stayFilter)) return false;
      if (budgetFilter !== "any" && h.monthly_price > Number(budgetFilter)) return false;
      if (bedroomFilter !== "any" && h.bedrooms < parseInt(bedroomFilter, 10)) return false;
      return true;
    });
  }, [homes, activePlace, activeMoveIn, stayFilter, budgetFilter, bedroomFilter]);

  // Open homes always lead, whichever metric the guest sorts by — a reserved
  // or let home stays in the list (WinterListingCard's own rule) but never
  // outranks one a guest could actually move into.
  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      const statusDiff = winterStatusRank(a) - winterStatusRank(b);
      if (statusDiff !== 0) return statusDiff;
      switch (sortOption) {
        case "price-asc":
          return a.monthly_price - b.monthly_price;
        case "price-desc":
          return b.monthly_price - a.monthly_price;
        case "soonest":
          return (a.available_from ?? "").localeCompare(b.available_from ?? "");
        default:
          return a.sort_order - b.sort_order;
      }
    });
    return list;
  }, [filtered, sortOption]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activePlace, activeMoveIn, stayFilter, budgetFilter, bedroomFilter, sortOption]);

  const hasActiveFilters = Boolean(
    activePlace || activeMoveIn || stayFilter !== "any" || budgetFilter !== "any" || bedroomFilter !== "any"
  );

  // Not hand-picked — whichever published home happens to have a photo
  // first. See WinterHero.tsx for why.
  const heroImage = homes.find((h) => h.images[0])?.images[0];

  const placesWithCounts = WINTER_RENTAL_CITIES.map((city) => ({
    city,
    count: homes.filter((h) => h.city_group === city.slug).length,
  })).filter((p) => loading || p.count > 0);

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
          image={heroImage}
          search={{
            place: placeInput,
            moveIn: moveInInput,
            onPlaceChange: setPlaceInput,
            onMoveInChange: setMoveInInput,
            onSearch: applySearch,
          }}
        />

        <Breadcrumb
          trail={[
            { label: t("wr-home"), to: "/" },
            { label: t("wr-breadcrumb"), to: WINTER_RENTALS_PATH },
          ]}
        />

        {!loading && placesWithCounts.length > 1 && (
          <Section size="none" className="pb-md">
            <p className="t-tag text-accent-strong mb-2">{t("wr-browse-by-place")}</p>
            <div className="flex flex-wrap gap-2">
              {placesWithCounts.map(({ city, count }) => (
                <Link
                  key={city.slug}
                  to={`${WINTER_RENTALS_PATH}/${city.slug}`}
                  className="t-body rounded-full border border-border px-4 py-1.5 text-foreground hover:border-accent-strong hover:text-accent-strong transition-colors"
                >
                  {t(wrKey(city.slug, "name"))}
                  <span className="text-muted-foreground"> · {count}</span>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Refines the list in place — same role as the filter strip under
            Properties.tsx's search bar, same controls (pill Selects, a
            "Clear" link once anything is set). Budget and bedroom options
            are grounded in real columns on `midterm_listings`, unlike the
            short-stay side's commented-out budget chip (PROJECT.md D8) —
            `monthly_price` is the real, current rent here, not a frozen
            import value, so filtering and sorting on it is safe. */}
        <div className="border-b border-border">
          <Container className="py-3 flex flex-wrap items-center gap-x-md gap-y-2">
            <span className="t-tag text-accent-strong">{t("properties.allFilters")}</span>

            <Select value={stayFilter} onValueChange={(v) => setStayFilter(v as StayLengthBucket)}>
              <SelectTrigger className="h-9 w-auto gap-2 rounded-full border-border bg-background px-4 t-body">
                <SelectValue placeholder={t("wr-filter-stay-label")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t("wr-filter-stay-any")}</SelectItem>
                <SelectItem value="short">{t("wr-filter-stay-short")}</SelectItem>
                <SelectItem value="medium">{t("wr-filter-stay-medium")}</SelectItem>
                <SelectItem value="long">{t("wr-filter-stay-long")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
              <SelectTrigger className="h-9 w-auto gap-2 rounded-full border-border bg-background px-4 t-body">
                <SelectValue placeholder={t("wr-filter-budget-label")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t("wr-filter-budget-any")}</SelectItem>
                {BUDGET_CAPS.map((cap) => (
                  <SelectItem key={cap} value={String(cap)}>
                    {t("wr-filter-budget-upto").replace(
                      "{amount}",
                      `${currencySymbol}${Math.round(convertPrice(cap)).toLocaleString("en")}`
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
              <SelectTrigger className="h-9 w-auto gap-2 rounded-full border-border bg-background px-4 t-body">
                <SelectValue placeholder={t("properties.bedrooms")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">
                  {t("properties.bedrooms")} · {t("properties.any")}
                </SelectItem>
                {["1", "2", "3", "4"].map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}+ {t("properties.bedrooms")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
              <SelectTrigger className="h-9 w-auto gap-2 rounded-full border-border bg-background px-4 t-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">{t("properties.sortRecommended")}</SelectItem>
                <SelectItem value="price-asc">{t("properties.sortPriceAsc")}</SelectItem>
                <SelectItem value="price-desc">{t("properties.sortPriceDesc")}</SelectItem>
                <SelectItem value="soonest">{t("wr-sort-soonest")}</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="t-body text-accent-strong underline underline-offset-4 hover:text-foreground transition-colors"
              >
                {t("properties.clear")}
              </button>
            )}
          </Container>
        </div>

        <Section size="md">
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
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-xl border-t border-border">
              <p className="t-block text-foreground mb-2">{t("wr-no-match")}</p>
              <p className="t-body text-muted-foreground mb-4">{t("wr-try-different")}</p>
              <button type="button" onClick={clearFilters} className="cta-base cta-secondary">
                {t("properties.clearFilters")}
              </button>
            </div>
          ) : (
            <>
              <p className="t-meta text-accent-strong mb-md">
                {sorted.length === 1
                  ? t("wr-homes-count-one")
                  : t("wr-homes-count").replace("{n}", String(sorted.length))}
              </p>
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
