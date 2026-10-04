import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import CollectionTabs from "@/components/CollectionTabs";
import { classifyProperty, COLLECTION_LABEL_KEY, COLLECTION_ORDER, type CollectionId } from "@/lib/homeCollections";
import { cityGroupsForSearch } from "@/lib/destinations";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import EditableText from "@/components/admin/EditableText";
import PageWrapper from "@/components/PageWrapper";
import SearchBar from "@/components/SearchBar";
import { Loader2 } from "lucide-react";
import { format, addDays, parseISO, isValid } from "date-fns";
import Seo from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Section, Container, Grid } from "@/components/layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/contexts/LocaleContext";
import frontierLogoGreen from "@/assets/frontier-logo-green.webp";

type SortOption = "recommended" | "price-asc" | "price-desc";

/** "All" plus the same regions the landing page's "Our homes" row offers. */
type RegionFilter = "all" | CollectionId;

/** Three rows of three before the list asks to be continued. */
const PAGE_SIZE = 9;

const parseDateParam = (value: string | null) => {
  if (!value) return undefined;
  const date = parseISO(value);
  return isValid(date) ? date : undefined;
};

const PropertiesContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, language } = useLocale();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageEyebrow, setPageEyebrow] = useState(t("properties-page-eyebrow"));
  const [pageTitle, setPageTitle] = useState(t("properties-page-title"));
  const [availabilityFilter, setAvailabilityFilter] = useState<Set<string> | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  // Highest price first by default — the priciest homes are also the most
  // impressive ones in this portfolio, so this puts the best foot forward.
  const [sortOption, setSortOption] = useState<SortOption>("price-desc");
  const [bedroomFilter, setBedroomFilter] = useState("any");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");

  const [locationInput, setLocationInput] = useState(searchParams.get("location") || "");
  const [checkInInput, setCheckInInput] = useState<Date | undefined>(() => parseDateParam(searchParams.get("checkIn")));
  const [checkOutInput, setCheckOutInput] = useState<Date | undefined>(() => parseDateParam(searchParams.get("checkOut")));
  const [guestsInput, setGuestsInput] = useState(searchParams.get("guests") || "");

  const activeLocation = searchParams.get("location") || "";
  const activeCheckIn = searchParams.get("checkIn") || "";
  const activeCheckOut = searchParams.get("checkOut") || "";
  const activeGuests = parseInt(searchParams.get("guests") || "0", 10);

  useEffect(() => {
    setPageEyebrow(t("properties-page-eyebrow"));
    setPageTitle(t("properties-page-title"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("available", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        setProperties(data || []);
      }
      setLoading(false);
    };

    fetchProperties();
  }, []);

  // Apply location + guests client-side filter
  const filtered = useMemo(() => {
    return properties.filter((p) => {
      // One of our places (or the Costa del Sol / Austria) filters on
      // `city_group`, so the result matches that place's location page —
      // see cityGroupsForSearch() for why the text match got this wrong.
      // Any other term still matches the text, e.g. "Torremolinos".
      const groups = activeLocation ? cityGroupsForSearch(activeLocation) : null;
      if (groups) {
        if (!p.city_group || !(groups as string[]).includes(p.city_group)) return false;
      } else if (activeLocation) {
        const hay =`${p.location || ""} ${p.address || ""} ${p.name || ""}`.toLowerCase();
        const needle = activeLocation.toLowerCase().trim();
        // match any word of the search against haystack
        const tokens = needle.split(/[\s,]+/).filter(Boolean);
        const ok = tokens.some((t) => hay.includes(t));
        if (!ok) return false;
      }
      if (regionFilter !== "all" && classifyProperty(p) !== regionFilter) return false;
      if (activeGuests > 0 && (p.guests || 0) < activeGuests) return false;
      if (bedroomFilter !== "any" && (p.bedrooms || 0) < parseInt(bedroomFilter, 10)) return false;
      if (availabilityFilter && p.guesty_listing_id && !availabilityFilter.has(p.id)) return false;
      return true;
    });
  }, [properties, activeLocation, activeGuests, availabilityFilter, bedroomFilter, regionFilter]);

  // Same rule as the landing page: a region with no home behind it is not
  // offered, because a tab that leads to an empty list reads as a broken filter.
  const regionTabs = useMemo(() => {
    const present = new Set(properties.map((p) => classifyProperty(p)));
    return [
      { id: "all" as RegionFilter, label: t("properties-region-all") },
      ...COLLECTION_ORDER.filter((id) => present.has(id)).map((id) => ({
        id: id as RegionFilter,
        label: t(COLLECTION_LABEL_KEY[id]),
      })),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, language]);

  // "Recommended" is the fetch order already (featured first, then newest) —
  // only the two price options need an actual re-sort.
  const sorted = useMemo(() => {
    if (sortOption === "price-asc") {
      return [...filtered].sort((a, b) => (a.price_per_night || 0) - (b.price_per_night || 0));
    }
    if (sortOption === "price-desc") {
      return [...filtered].sort((a, b) => (b.price_per_night || 0) - (a.price_per_night || 0));
    }
    return filtered;
  }, [filtered, sortOption]);

  // When dates change, check availability for each property via cached calendar
  useEffect(() => {
    if (!activeCheckIn || !activeCheckOut || properties.length === 0) {
      setAvailabilityFilter(null);
      return;
    }
    let cancelled = false;
    const check = async () => {
      setCheckingAvailability(true);
      const eligible = properties.filter((p) => p.guesty_listing_id);
      // IMPORTANT: run sequentially, not in parallel. Guesty caps token requests
      // at 3/24h — parallel invocations all try to refresh the token at once
      // and get rate-limited. Sequential calls let the first request populate
      // the token cache that the rest reuse.
      const results: { id: string; available: boolean }[] = [];
      for (const p of eligible) {
        if (cancelled) return;
        try {
          const { data, error } = await supabase.functions.invoke("guesty-get-calendar", {
            body: {
              listingId: p.guesty_listing_id,
              checkIn: activeCheckIn,
              checkOut: activeCheckOut,
            },
          });
          if (error || !data?.calendar) {
            // On failure (e.g. rate-limited), don't hide the property.
            results.push({ id: p.id, available: true });
            continue;
          }
          const start = parseISO(activeCheckIn);
          const end = parseISO(activeCheckOut);
          const byDate: Record<string, any> = {};
          (data.calendar as any[]).forEach((d) => (byDate[d.date] = d));
          let cursor = start;
          let allFree = true;
          while (cursor < end) {
            const key = format(cursor, "yyyy-MM-dd");
            const day = byDate[key];
            if (day) {
              const blocked =
                (day.status && day.status !== "available") ||
                Boolean(
                  day.blocks &&
                    (day.blocks.b || day.blocks.r || day.blocks.o || day.blocks.m || day.blocks.bd)
                );
              if (blocked) {
                allFree = false;
                break;
              }
            }
            cursor = addDays(cursor, 1);
          }
          results.push({ id: p.id, available: allFree });
        } catch {
          results.push({ id: p.id, available: true });
        }
      }
      if (cancelled) return;
      setAvailabilityFilter(new Set(results.filter((r) => r.available).map((r) => r.id)));
      setCheckingAvailability(false);
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [activeCheckIn, activeCheckOut, properties]);

  // A filter change that shrinks the list must not leave "View more"
  // offering a page that no longer exists.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeLocation, activeCheckIn, activeCheckOut, activeGuests, bedroomFilter, sortOption, regionFilter]);

  const applySearch = () => {
    const next = new URLSearchParams(searchParams);
    locationInput ? next.set("location", locationInput) : next.delete("location");
    checkInInput ? next.set("checkIn", format(checkInInput, "yyyy-MM-dd")) : next.delete("checkIn");
    checkOutInput ? next.set("checkOut", format(checkOutInput, "yyyy-MM-dd")) : next.delete("checkOut");
    guestsInput ? next.set("guests", guestsInput) : next.delete("guests");
    setSearchParams(next);
  };

  const clearSearch = () => {
    setBedroomFilter("any");
    setRegionFilter("all");
    setLocationInput("");
    setCheckInInput(undefined);
    setCheckOutInput(undefined);
    setGuestsInput("");
    setSearchParams(new URLSearchParams());
  };

  return (
    // flex-col + flex-1 keeps the footer at the bottom when a search returns
    // only one or two listings; without it the footer rode up into view.
    <div className="min-h-screen flex flex-col">
      <Seo
        title="Luxury Villas & Apartments to Book"
        description="The full Frontier Residences portfolio — villas, city apartments and cabins in Marbella, Málaga, Vienna and beyond, bookable directly with us."
        path="/properties"
        schema={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Properties", path: "/properties" }])}
      />
      <Navigation />

      <main className="flex-1 pt-24 overflow-x-clip">
        {/* The landing page's own search bar, in the place a hero would be.
            There is no photograph to overlay a hero on here, so the header is
            solid from the first pixel and the widget the guest already knows
            takes the top of the page instead.
            Full width, on the plain page background, not its own beige band
            (Almedin, 29.09.2026 — avantstay.com's listings page was the
            reference): the bar now shares its left and right edge with the
            photograph grid below it instead of floating narrower and on a
            different surface, which read as a separate widget laid on top
            of the page rather than the page's own first control. */}
        <Section size="sm">
          <SearchBar
            location={locationInput}
            checkInDate={checkInInput}
            checkOutDate={checkOutInput}
            guests={guestsInput}
            onLocationChange={setLocationInput}
            onCheckInChange={setCheckInInput}
            onCheckOutChange={setCheckOutInput}
            onGuestsChange={setGuestsInput}
            onSearch={applySearch}
            fullWidth
          />
        </Section>

        {/* Refining the list, as one quiet row of controls under the search.
            The wireframe also draws "Budget" and "Collection" chips. Neither
            is wired up: "Collection" has no column behind it at all
            (docs/PROJECT.md D8), and a budget filter could only sort on
            `price_per_night`, which is the frozen import value rather than a
            price. A chip that silently filters on the wrong number is worse
            than no chip, so they are left out until there is data for them. */}
        <div className="border-b border-border">
          <Container className="py-3 flex flex-wrap items-center gap-x-md gap-y-2">
            <span className="t-tag text-accent-strong">{t("properties.allFilters")}</span>

            <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
              <SelectTrigger className="h-9 w-auto gap-2 rounded-full border-border bg-background px-4 t-body">
                <SelectValue placeholder={t("properties.bedrooms")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">
                  {t("properties.bedrooms")} · {t("properties.any")}
                </SelectItem>
                {["1", "2", "3", "4", "5"].map((n) => (
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
              </SelectContent>
            </Select>

            {(activeLocation ||
              activeCheckIn ||
              activeCheckOut ||
              activeGuests > 0 ||
              bedroomFilter !== "any" ||
              regionFilter !== "all") && (
              <button
                type="button"
                onClick={clearSearch}
                className="t-body text-accent-strong underline underline-offset-4 hover:text-foreground transition-colors"
              >
                {t("properties.clear")}
              </button>
            )}
          </Container>
        </div>

        <Section size="md">
          {checkingAvailability ? (
            /* Full takeover while the per-property Guesty calendar check runs
               (Almedin, 04.10.2026) — it used to be a small inline line above
               a grid that kept rendering underneath it, which read as the
               page being done loading rather than still filtering. Replacing
               the title, tabs and grid outright makes the wait unambiguous:
               nothing below is real until this clears. */
            <div className="flex flex-col items-center justify-center gap-md py-2xl text-center">
              <Loader2 className="w-8 h-8 animate-spin text-accent-strong" />
              {/* t-section, not t-item — this is now the sole content of the
                  section rather than a small aside, so it carries the same
                  weight as a page heading. Sized down 10% from there
                  (Almedin, 04.10.2026) — every endpoint of t-section's own
                  clamp(1.5rem,1.1rem+1.8vw,2.25rem) × 0.9, same pattern
                  Hero.tsx uses to scale off a t-* role's own clamp. */}
              <p className="t-section text-[clamp(1.35rem,0.99rem+1.62vw,2.025rem)] text-accent-strong">
                {t("properties.checkingAvailability")}
              </p>
              {/* 15% over the previous max-w-md/max-w-lg (28rem/32rem × 1.15). */}
              <img
                src={frontierLogoGreen}
                alt="Frontier Residences"
                className="mt-lg w-full max-w-[32.2rem] md:max-w-[36.8rem]"
              />
            </div>
          ) : (
            <>
              {/* The page's one h1, and the most useful sentence on it: how many
                  homes there are and where they are — "where" now follows the
                  tab (Almedin, 29.09.2026): picking "Costa del Sol" used to
                  still leave Vienna and Carinthia named in the sentence next to
                  it, which read as the filter not having done anything. Only the
                  "all" sentence stays admin-editable (`pageTitle`); the
                  per-region one is a count and a label, recomputed every time
                  the count or the tab changes, so there is nothing stable to
                  hand the CMS. */}
              {/* Title left, region tabs right — the same arrangement as "Our
                  homes" on the landing page, and the same tabs. */}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-lg">
                {regionFilter === "all" ? (
                  <EditableText
                    id="properties-page-title"
                    value={pageTitle}
                    onChange={setPageTitle}
                    as="h1"
                    className="t-section text-foreground text-balance max-w-2xl"
                  >
                    {pageTitle.replace("{n}", loading ? "" : String(sorted.length)).trim()}
                  </EditableText>
                ) : (
                  <h1 className="t-section text-foreground text-balance max-w-2xl">
                    {t("properties-page-title-region")
                      .replace("{n}", loading ? "" : String(sorted.length))
                      .replace("{region}", regionTabs.find((tab) => tab.id === regionFilter)?.label ?? "")
                      .trim()}
                  </h1>
                )}

                {!loading && <CollectionTabs<RegionFilter> tabs={regionTabs} current={regionFilter} onSelect={setRegionFilter} />}
              </div>

              {loading ? (
                <Grid cols={3} gap="md">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[3/4] w-full" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </Grid>
              ) : sorted.length === 0 ? (
                <div className="text-center py-xl border-t border-border">
                  <p className="t-block text-foreground mb-2">{t("properties.noMatch")}</p>
                  <p className="t-body text-muted-foreground mb-4">{t("properties.tryDifferent")}</p>
                  <button type="button" onClick={clearSearch} className="cta-base cta-secondary">
                    {t("properties.clearFilters")}
                  </button>
                </div>
              ) : (
                <>
                  <Grid cols={3} gap="md">
                    {sorted.slice(0, visibleCount).map((property) => (
                      <PropertyCard key={property.id} property={property} />
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
            </>
          )}
        </Section>
      </main>

      <Footer />
    </div>
  );
};

const Properties = () => (<PageWrapper slug="site--properties"><PropertiesContent /></PageWrapper>);
export default Properties;