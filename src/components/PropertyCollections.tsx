import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import EditableText from "@/components/admin/EditableText";
import { Grid, Section } from "@/components/layout";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";

/**
 * "Our homes" — one tabbed row of three, not three stacked rails.
 *
 * Three horizontal rails showed nine cropped cards and made the section the
 * tallest thing on the page; the tabs show three whole ones and put the choice
 * where a guest actually makes it — the country first, the house second.
 *
 * ⚠️ The grouping is still derived in code because the table has no column for
 * it. `location` alone is not enough: the two Los Flamingos properties are
 * tagged "Málaga" — the province, not the town — so a location-only filter
 * files two golf-resort villas under Austria's neighbours. Hence the name
 * override below. A `collection` column on `properties` is the durable fix
 * (docs/PROJECT.md D8); until then a property in a new town falls into "New"
 * rather than disappearing, which is the one thing the old rails got wrong.
 */

/** Costa del Sol — the coast and the province around it. */
const COSTA = [
  "Marbella",
  "Río Real",
  "Calahonda",
  "Fuengirola",
  "Torremolinos",
  "Málaga",
  "Estepona",
  "Benalmádena",
  "Benahavís",
];
const VIENNA = ["Wien", "Vienna"];
const CARINTHIA = ["Sauerwald", "Kärnten", "Carinthia"];

/** Tagged with the province rather than the town; they belong on the coast. */
const COSTA_BY_NAME = ["Los Flamingos"];

type TabId = "costa" | "vienna" | "carinthia" | "new";

const classify = (property: Property): TabId => {
  const location = property.location ?? "";
  const name = property.name ?? "";

  if (COSTA_BY_NAME.some((needle) => name.includes(needle))) return "costa";
  if (CARINTHIA.includes(location)) return "carinthia";
  if (VIENNA.includes(location)) return "vienna";
  if (COSTA.includes(location)) return "costa";
  // Anything we have not filed yet is still reachable instead of invisible.
  return "new";
};

/** Three whole cards, not a rail of cropped ones. */
const CARDS_PER_TAB = 3;

const PropertyCollections = () => {
  const { t, language } = useLocale();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<TabId>("costa");

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

  const tabs: { id: TabId; label: string }[] = [
    { id: "costa", label: t("trio-tab-all") },
    { id: "vienna", label: t("trio-tab-vienna") },
    { id: "carinthia", label: t("trio-tab-carinthia") },
    { id: "new", label: t("trio-tab-new") },
  ];

  const byTab = useMemo(() => {
    const groups: Record<TabId, Property[]> = { costa: [], vienna: [], carinthia: [], new: [] };
    properties.forEach((p) => groups[classify(p)].push(p));
    // Highest nightly rate first inside a tab, the same rule /properties
    // defaults to: in this portfolio the dearest homes are also the ones
    // worth opening with, and three city apartments leading "Costa del Sol"
    // is not the coast anyone pictures.
    (Object.keys(groups) as TabId[]).forEach((key) => {
      groups[key].sort((a, b) => (b.price_per_night || 0) - (a.price_per_night || 0));
    });
    return groups;
  }, [properties]);

  // A tab with nothing behind it is worse than no tab: it reads as a broken
  // filter rather than as an empty category.
  const visibleTabs = loading ? tabs : tabs.filter((tab) => byTab[tab.id].length > 0);
  const current = visibleTabs.some((tab) => tab.id === active) ? active : visibleTabs[0]?.id ?? "costa";
  const shown = byTab[current].slice(0, CARDS_PER_TAB);

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

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cn(
                "t-meta pb-1 border-b transition-colors",
                tab.id === current
                  ? "text-accent-strong border-accent-strong"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
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
        /* Not <Grid cols={3}> unconditionally: Vienna and Carinthia hold one
           or two homes, and a three-column grid leaves those stranded
           against the left edge with a third of the row empty. A centred
           flex row keeps whatever the tab actually has in the middle, and at
           three items it lands on exactly the same column widths. */
        <div className="flex flex-wrap justify-center gap-x-md gap-y-lg">
          {shown.map((property) => (
            <div
              key={property.id}
              className="w-full sm:w-[calc(50%-var(--space-md)/2)] lg:w-[calc(33.333%-var(--space-md)*2/3)]"
            >
              <PropertyCard property={property} />
            </div>
          ))}
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
