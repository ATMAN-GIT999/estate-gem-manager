import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import CollectionTabs from "@/components/CollectionTabs";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import EditableText from "@/components/admin/EditableText";
import { Grid, Section } from "@/components/layout";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";
import {
  classifyProperty,
  COLLECTION_LABEL_KEY,
  COLLECTION_ORDER,
  type CollectionId,
} from "@/lib/homeCollections";

/**
 * "Our homes" — one tabbed row, paged with arrows.
 *
 * Three horizontal rails showed nine cropped cards and made the section the
 * tallest thing on the page; the tabs show three whole ones at a time and put
 * the choice where a guest actually makes it — the region first, the house
 * second. Arrows page through the rest of that region's homes without leaving
 * the landing page (Almedin, 26.09.2026): the row used to stop at the first
 * three, so a guest who liked the Costa del Sol had to go to /properties to
 * see the fourth.
 *
 * Which house belongs to which tab lives in src/lib/homeCollections.ts, shared
 * with the filter on /properties.
 */

const PropertyCollections = () => {
  const { t, language } = useLocale();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<CollectionId>("costa");
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const [heading, setHeading] = useState(t("trio-heading"));
  const [viewAllText, setViewAllText] = useState(t("collections-view-all"));

  useEffect(() => {
    setHeading(t("trio-heading"));
    setViewAllText(t("collections-view-all"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    const fetchProperties = async () => {
      // One request for everything, split in memory — four filtered queries
      // would be four round trips for the same rows.
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("available", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        // The generated row type widens `images` to `Json`; PropertyCard wants
        // the {url, caption} shape the importer actually writes.
        setProperties((data ?? []) as unknown as Property[]);
      }
      setLoading(false);
    };

    fetchProperties();
  }, []);

  const tabs = COLLECTION_ORDER.map((id) => ({ id, label: t(COLLECTION_LABEL_KEY[id]) }));

  const byTab = useMemo(() => {
    const groups: Record<CollectionId, Property[]> = { costa: [], vienna: [], carinthia: [], new: [] };
    properties.forEach((p) => groups[classifyProperty(p)].push(p));
    // Highest nightly rate first inside a tab, the same rule /properties
    // defaults to: in this portfolio the dearest homes are also the ones
    // worth opening with, and three city apartments leading "Costa del Sol"
    // is not the coast anyone pictures.
    (Object.keys(groups) as CollectionId[]).forEach((key) => {
      groups[key].sort((a, b) => (b.price_per_night || 0) - (a.price_per_night || 0));
    });
    return groups;
  }, [properties]);

  // A tab with nothing behind it is worse than no tab: it reads as a broken
  // filter rather than as an empty category.
  const visibleTabs = loading ? tabs : tabs.filter((tab) => byTab[tab.id].length > 0);
  const current = visibleTabs.some((tab) => tab.id === active) ? active : visibleTabs[0]?.id ?? "costa";
  const shown = byTab[current];

  // Arrow state follows the carousel. The carousel is remounted per tab (see
  // `key` below), so this re-subscribes to a fresh api on every switch.
  useEffect(() => {
    if (!api) return;
    const sync = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  return (
    <Section id="stays" size="md">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-lg">
        <EditableText
          id="trio-heading"
          value={heading}
          onChange={setHeading}
          as="h2"
          className="t-section text-foreground"
        >
          {heading}
        </EditableText>

        <CollectionTabs<CollectionId> tabs={visibleTabs} current={current} onSelect={setActive} />
      </div>

      {loading ? (
        <Grid cols={3} gap="md">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </Grid>
      ) : (
        /* A carousel, not a grid: the arrows appear only when the tab holds
           more homes than fit in one view. Vienna and Carinthia hold one or
           two, and a three-column grid would strand those against the left
           edge — so a short row is centred instead, which at three items
           lands on exactly the same column widths.

           Below `lg` the arrows sit under the row; from `lg` they move out
           into the page gutter (74px+ there), at the height of the photograph
           rather than of the whole card. Not on the photograph itself: each
           card already has its own photo arrows there, and two pairs on one
           image would read as one control. */
        <div className="relative">
          <Carousel
            key={current}
            setApi={setApi}
            opts={{ align: "start", slidesToScroll: "auto", containScroll: "trimSnaps" }}
          >
            <CarouselContent
              className={cn(
                "-ml-[var(--space-md)]",
                shown.length < 3 && "sm:justify-center",
                shown.length < 2 && "justify-center"
              )}
            >
              {shown.map((property) => (
                <CarouselItem
                  key={property.id}
                  className="pl-[var(--space-md)] basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <PropertyCard property={property} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {(canPrev || canNext) && (
            <div className="mt-md flex justify-center gap-3 lg:mt-0 lg:contents">
              {([-1, 1] as const).map((delta) => (
                <button
                  key={delta}
                  type="button"
                  onClick={() => (delta === -1 ? api?.scrollPrev() : api?.scrollNext())}
                  disabled={delta === -1 ? !canPrev : !canNext}
                  aria-label={delta === -1 ? "Previous homes" : "Next homes"}
                  className={cn(
                    "h-11 w-11 rounded-full border border-border bg-background text-foreground",
                    "inline-flex items-center justify-center transition-colors",
                    "hover:border-accent-strong hover:text-accent-strong",
                    "disabled:opacity-30 disabled:pointer-events-none",
                    "lg:absolute lg:top-[38%] lg:-translate-y-1/2",
                    delta === -1 ? "lg:-left-14" : "lg:-right-14"
                  )}
                >
                  {delta === -1 ? (
                    <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                  ) : (
                    <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-lg text-center">
        <Link to="/properties" className="cta-link">
          <EditableText
            id="collections-view-all"
            value={viewAllText}
            onChange={setViewAllText}
            as="span"
          >
            {viewAllText}
          </EditableText>{" "}
          →
        </Link>
      </div>
    </Section>
  );
};

export default PropertyCollections;
