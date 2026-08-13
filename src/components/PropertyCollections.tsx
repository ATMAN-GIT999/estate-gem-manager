import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import EditableText from "@/components/admin/EditableText";

/**
 * The portfolio as three collections rather than one undifferentiated list.
 *
 * A guest arrives wanting a kind of trip, not a kind of property: a villa on the
 * coast, a few days in a city, or somewhere with nothing around it. Three rails
 * let someone recognise their trip in the first one they scroll past, which a
 * single mixed rail cannot do.
 *
 * ⚠️ Collections are derived in code because the table has no column for them.
 * `location` alone is not enough: the two Los Flamingos properties are tagged
 * "Málaga" — the province, not the town — so a location-only filter files two
 * golf-resort villas under city apartments. Hence the name override below.
 *
 * A `collection` column on `properties` would be the durable fix, and would let
 * the client re-file a property without a deploy. Until then, adding a property
 * in a new town means adding its location here or it appears in no rail.
 */

/** Coastal Costa del Sol. Marbella and everything within reach of it. */
const COASTAL = ["Marbella", "Río Real", "Calahonda", "Fuengirola", "Torremolinos"];
/** City breaks. Málaga city centre and Vienna. */
const CITY = ["Málaga", "Wien"];
/** The Alpine lodges. */
const OFF_GRID = ["Sauerwald"];

/** Tagged with the province rather than the town; they belong on the coast. */
const COASTAL_BY_NAME = ["Los Flamingos"];

type Collection = {
  id: string;
  title: string;
  lead: string;
  properties: Property[];
};

const classify = (property: Property): "coastal" | "city" | "offgrid" | null => {
  const location = property.location ?? "";
  const name = property.name ?? "";

  if (COASTAL_BY_NAME.some((needle) => name.includes(needle))) return "coastal";
  if (OFF_GRID.includes(location)) return "offgrid";
  if (COASTAL.includes(location)) return "coastal";
  if (CITY.includes(location)) return "city";
  return null;
};

/**
 * Matches the `container` above it: centred, capped at 1400px, 2rem of gutter.
 * Padding and scroll-padding have to carry the same value or the two disagree.
 */
const RAIL_INSET =
  "px-4 scroll-pl-4 " +
  "md:px-[max(1rem,calc((100vw-1400px)/2+2rem))] " +
  "md:scroll-pl-[max(1rem,calc((100vw-1400px)/2+2rem))]";

const Rail = ({
  collection,
  loading,
}: {
  collection: Collection;
  loading: boolean;
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(collection.title);
  const [lead, setLead] = useState(collection.lead);

  const scrollRail = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    // One card plus its gap, so a click always lands on a card edge.
    rail.scrollBy({ left: direction * 344, behavior: "smooth" });
  };

  // An empty collection renders nothing rather than an empty rail with a
  // heading over it.
  if (!loading && collection.properties.length === 0) return null;

  return (
    <div>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <div className="max-w-xl">
            <EditableText
              id={`coll-${collection.id}-title`}
              value={title}
              onChange={setTitle}
              as="h2"
              className="t-section text-primary mb-2"
            >
              {title}
            </EditableText>
            <EditableText
              id={`coll-${collection.id}-lead`}
              value={lead}
              onChange={setLead}
              as="p"
              className="text-foreground/70"
            >
              {lead}
            </EditableText>
          </div>

          {/* Arrows are desktop-only: a touch device already scrolls the rail. */}
          <div className="hidden md:flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Scroll ${title} left`}
              onClick={() => scrollRail(-1)}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Scroll ${title} right`}
              onClick={() => scrollRail(1)}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Full-bleed: the rail runs to the edge of the viewport so the last card
          is visibly cut off, which is what tells a reader there is more. The
          inline padding lines the first card up with the container above it,
          and `scroll-pl` has to repeat that value — without it the snap engine
          treats the padding as scrollable space and parks the first card flush
          against the window edge on load. */}
      <div
        ref={railRef}
        className={`flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${RAIL_INSET}`}
      >
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className="w-80 shrink-0 space-y-4">
                <Skeleton className="aspect-[4/3] w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))
          : collection.properties.map((property) => (
              <div key={property.id} className="w-80 shrink-0 snap-start">
                <PropertyCard property={property} />
              </div>
            ))}
      </div>
    </div>
  );
};

const PropertyCollections = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewAllText, setViewAllText] = useState("View all properties");

  useEffect(() => {
    const fetchProperties = async () => {
      // One request for everything, split in memory — three filtered queries
      // would be three round trips for the same rows.
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("available", true)
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

  const collections: Collection[] = [
    {
      id: "luxury",
      title: "Luxury Stays for You",
      lead: "Villas and sea-view homes along the coast, from Marbella to Fuengirola.",
      properties: properties.filter((p) => classify(p) === "coastal"),
    },
    {
      id: "city",
      title: "Explore the City",
      lead: "Apartments in the middle of Málaga and Vienna, walkable to everything.",
      properties: properties.filter((p) => classify(p) === "city"),
    },
    {
      id: "offgrid",
      title: "Off-Grid Experiences",
      lead: "Alpine lodges and converted granaries, with the mountains for neighbours.",
      properties: properties.filter((p) => classify(p) === "offgrid"),
    },
  ];

  return (
    <section id="stays" className="py-24 bg-background scroll-mt-20">
      <div className="space-y-20">
        {collections.map((collection) => (
          <Rail key={collection.id} collection={collection} loading={loading} />
        ))}
      </div>

      <div className="container mx-auto px-4">
        <div className="mt-16 text-center">
          <Link to="/properties">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant"
            >
              <EditableText
                id="collections-view-all"
                value={viewAllText}
                onChange={setViewAllText}
                as="span"
              >
                {viewAllText}
              </EditableText>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PropertyCollections;
