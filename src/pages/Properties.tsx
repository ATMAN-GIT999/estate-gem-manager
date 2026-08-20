import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import EditableText from "@/components/admin/EditableText";
import PageWrapper from "@/components/PageWrapper";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { format, addDays, parseISO, isValid } from "date-fns";
import Seo from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Section, Container, Grid } from "@/components/layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SortOption = "recommended" | "price-asc" | "price-desc";

const parseDateParam = (value: string | null) => {
  if (!value) return undefined;
  const date = parseISO(value);
  return isValid(date) ? date : undefined;
};

const PropertiesContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageEyebrow, setPageEyebrow] = useState("Our collection");
  const [pageTitle, setPageTitle] = useState("Choose your favorite.");
  const [availabilityFilter, setAvailabilityFilter] = useState<Set<string> | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("recommended");

  const [locationInput, setLocationInput] = useState(searchParams.get("location") || "");
  const [checkInInput, setCheckInInput] = useState<Date | undefined>(() => parseDateParam(searchParams.get("checkIn")));
  const [checkOutInput, setCheckOutInput] = useState<Date | undefined>(() => parseDateParam(searchParams.get("checkOut")));
  const [guestsInput, setGuestsInput] = useState(searchParams.get("guests") || "");

  const activeLocation = searchParams.get("location") || "";
  const activeCheckIn = searchParams.get("checkIn") || "";
  const activeCheckOut = searchParams.get("checkOut") || "";
  const activeGuests = parseInt(searchParams.get("guests") || "0", 10);

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
      if (activeLocation) {
        const hay = `${p.location || ""} ${p.address || ""} ${p.name || ""}`.toLowerCase();
        const needle = activeLocation.toLowerCase().trim();
        // match any word of the search against haystack
        const tokens = needle.split(/[\s,]+/).filter(Boolean);
        const ok = tokens.some((t) => hay.includes(t));
        if (!ok) return false;
      }
      if (activeGuests > 0 && (p.guests || 0) < activeGuests) return false;
      if (availabilityFilter && p.guesty_listing_id && !availabilityFilter.has(p.id)) return false;
      return true;
    });
  }, [properties, activeLocation, activeGuests, availabilityFilter]);

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

  const applySearch = () => {
    const next = new URLSearchParams(searchParams);
    locationInput ? next.set("location", locationInput) : next.delete("location");
    checkInInput ? next.set("checkIn", format(checkInInput, "yyyy-MM-dd")) : next.delete("checkIn");
    checkOutInput ? next.set("checkOut", format(checkOutInput, "yyyy-MM-dd")) : next.delete("checkOut");
    guestsInput ? next.set("guests", guestsInput) : next.delete("guests");
    setSearchParams(next);
  };

  const clearSearch = () => {
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
        {/* Local search / filter bar */}
        <div className="border-b border-border bg-background sticky top-20 z-40 shadow-sm overflow-visible">
          <Container className="py-sm">
            <SearchBar
              collapsible
              location={locationInput}
              checkInDate={checkInInput}
              checkOutDate={checkOutInput}
              guests={guestsInput}
              onLocationChange={setLocationInput}
              onCheckInChange={setCheckInInput}
              onCheckOutChange={setCheckOutInput}
              onGuestsChange={setGuestsInput}
              onSearch={applySearch}
            />
            {(activeLocation || activeCheckIn || activeCheckOut || activeGuests > 0) && (
              <div className="mt-2 flex items-center gap-2 t-meta text-muted-foreground">
                <span>Filtering active</span>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="underline hover:text-foreground"
                >
                  Clear
                </button>
              </div>
            )}
          </Container>
        </div>

        {/* Properties Grid */}
        <Section size="sm">
          <div className="mb-md">
            <EditableText
              id="properties-page-eyebrow"
              value={pageEyebrow}
              onChange={setPageEyebrow}
              as="span"
              className="block t-meta text-accent-strong mb-2"
            >
              {pageEyebrow}
            </EditableText>
            <EditableText
              id="properties-page-title"
              value={pageTitle}
              onChange={setPageTitle}
              as="h1"
              className="t-display text-primary"
            >
              {pageTitle}
            </EditableText>
            <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
              <span className="t-body text-muted-foreground">
                {loading
                  ? "Loading…"
                  : `${sorted.length} ${sorted.length === 1 ? "home" : "homes"}`}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Sort</span>
                <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
                  <SelectTrigger className="h-auto w-auto gap-2 rounded-md border-border bg-card px-3 py-1.5 text-xs text-accent-strong [&>span]:line-clamp-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-asc">Price: low to high</SelectItem>
                    <SelectItem value="price-desc">Price: high to low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {checkingAvailability && (
              <p className="mt-2 t-meta text-muted-foreground inline-flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" /> checking availability…
              </p>
            )}
          </div>

          {loading ? (
            <Grid cols={3} gap="sm">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </Grid>
          ) : filtered.length === 0 ? (
            <div className="text-center py-xl border border-dashed border-border rounded-lg">
              <p className="t-block text-foreground mb-2">No properties match your search.</p>
              <p className="t-body text-muted-foreground mb-4">
                Try a different destination or different dates.
              </p>
              <Button variant="outline" onClick={clearSearch}>
                Clear filters
              </Button>
            </div>
          ) : (
            <Grid cols={3} gap="sm">
              {sorted.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </Grid>
          )}
        </Section>
      </main>

      <Footer />
    </div>
  );
};

const Properties = () => (<PageWrapper slug="site--properties"><PropertiesContent /></PageWrapper>);
export default Properties;