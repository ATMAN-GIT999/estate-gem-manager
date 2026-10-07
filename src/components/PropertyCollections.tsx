import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import CollectionTabs from "@/components/CollectionTabs";
import EditableText from "@/components/admin/EditableText";
import { Section } from "@/components/layout";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";
import {
  classifyProperty,
  COLLECTION_LABEL_KEY,
  COLLECTION_ORDER,
  type CollectionId,
} from "@/lib/homeCollections";

/**
 * "Our homes" — the region tabs above one editorial grid of six.
 *
 * Rebuilt on the Lovable landing reference (Almedin, 07.10.2026): one big
 * feature card, two beside it, three underneath, no frames on the photographs.
 * It replaces the three-up carousel, which showed three whole cards at a time.
 * The carousel's one real job — letting a guest page through a region's homes
 * without leaving the landing page (Almedin, 26.09.2026) — is kept as paging in
 * steps of six: arrows next to the "See all" link, shown only when a region
 * holds more than one page.
 *
 * Which house belongs to which tab lives in src/lib/homeCollections.ts, shared
 * with the filter on /properties.
 */

const PAGE_SIZE = 6;

const PropertyCollections = () => {
  const { t, language } = useLocale();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<CollectionId>("costa");
  const [page, setPage] = useState(0);

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

  const pageCount = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = shown.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const [feature, ...rest] = visible;

  // A short page cannot use the 7 + 5 + 4×3 composition without leaving holes
  // in it: one home stands alone at feature width, two split the row evenly.
  const sides = visible.length >= 3 ? rest.slice(0, 2) : [];
  const stacked = visible.length >= 3 ? rest.slice(2) : rest;

  return (
    <Section id="stays" size="md">
      <div className="flex flex-col justify-between gap-8 border-b border-border pb-8 md:flex-row md:items-end">
        {/* Links to /vacation-rentals (Almedin, 04.10.2026) — the heading
            doubles as a second way into the same destination the "View all"
            link below already opens. */}
        <div>
          <p className="t-tag text-accent-strong">{t("eyebrow-collection")}</p>
          <Link to="/vacation-rentals" className="group mt-4 block">
            <EditableText
              id="trio-heading"
              value={heading}
              onChange={setHeading}
              as="h2"
              className="t-feature text-foreground transition-colors group-hover:text-accent-strong"
            >
              {heading}
            </EditableText>
          </Link>
        </div>

        <CollectionTabs<CollectionId>
          variant="boxed"
          tabs={visibleTabs}
          current={current}
          onSelect={(id) => {
            setActive(id);
            setPage(0);
          }}
        />
      </div>

      {loading ? (
        <div className="mt-lg grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-lg grid gap-6 md:grid-cols-12 md:gap-y-10">
          {feature && (
            <div
              className={cn(
                visible.length === 2 ? "md:col-span-6" : "md:col-span-7",
                visible.length >= 3 && "md:row-span-2 md:pr-6"
              )}
            >
              <PropertyCard property={feature} variant={visible.length === 2 ? "stacked" : "feature"} />
            </div>
          )}
          {/* One column spanning both rows, not two grid cells: as separate
              cells each card sat at the top of its own half of the feature's
              height and left a hole between them. `justify-between` pins the
              first card to the feature's top edge and the second to its bottom. */}
          {sides.length > 0 && (
            <div className="flex flex-col justify-between gap-6 md:col-span-5 md:row-span-2">
              {sides.map((property) => (
                <PropertyCard key={property.id} property={property} variant="row" />
              ))}
            </div>
          )}
          {stacked.map((property) => (
            <div key={property.id} className={visible.length === 2 ? "md:col-span-6" : "md:col-span-4"}>
              <PropertyCard property={property} variant="stacked" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-lg flex flex-wrap items-center justify-between gap-6">
        <Link to="/properties" className="group t-block inline-flex items-center gap-3 text-foreground">
          <EditableText
            id="collections-view-all"
            value={viewAllText}
            onChange={setViewAllText}
            as="span"
          >
            {viewAllText}
          </EditableText>
          <ArrowRight
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </Link>

        {pageCount > 1 && (
          <div className="flex gap-2">
            {([-1, 1] as const).map((delta) => (
              <button
                key={delta}
                type="button"
                onClick={() => setPage(currentPage + delta)}
                disabled={delta === -1 ? currentPage === 0 : currentPage === pageCount - 1}
                aria-label={delta === -1 ? "Previous homes" : "Next homes"}
                className="inline-flex h-11 w-11 items-center justify-center border border-foreground text-foreground transition-colors hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-30"
              >
                {delta === -1 ? (
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                ) : (
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
};

export default PropertyCollections;
