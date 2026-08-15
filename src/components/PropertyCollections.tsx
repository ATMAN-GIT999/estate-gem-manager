import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import EditableText from "@/components/admin/EditableText";
import { Container, Section } from "@/components/layout";

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
 * How many cards a rail may show at once before the rest have to be
 * revealed with an arrow click — matching the pattern AvantStay's own
 * "Stays you will love" rails use.
 *
 * Without a cap, the rail's width was purely a function of the viewport: on
 * an ordinary laptop it happened to show 4-5, so the effect passed for a
 * discovery rail, but at a very wide monitor or a zoomed-out browser (25%
 * is roughly a 4x-wide viewport) there was room for 12+ cards side by side,
 * and the rail stopped reading as "a curated few, click for more" — it just
 * *was* the full list.
 */
const MAX_VISIBLE_CARDS = 6;
/** w-80 on the card wrapper below. */
const CARD_WIDTH_PX = 320;
/** gap-6 on the scrolling track below. */
const CARD_GAP_PX = 24;
/** Six cards, five gaps between them — the scrolling track's hard ceiling. */
const RAIL_MAX_WIDTH_PX =
  MAX_VISIBLE_CARDS * CARD_WIDTH_PX + (MAX_VISIBLE_CARDS - 1) * CARD_GAP_PX; // 2040
/** One card plus its gap, so an arrow click always lands on a card edge. */
const SCROLL_STEP_PX = CARD_WIDTH_PX + CARD_GAP_PX;

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
    rail.scrollBy({ left: direction * SCROLL_STEP_PX, behavior: "smooth" });
  };

  // An empty collection renders nothing rather than an empty rail with a
  // heading over it.
  if (!loading && collection.properties.length === 0) return null;

  return (
    <div>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-sm mb-md">
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
      </Container>

      {/* Two nested boxes doing two separate jobs.
          The OUTER box only positions: its `paddingLeft` is
          `--container-inset`, the same value every other section uses to
          line its content up with the container above, and it carries no
          width cap of its own, so it still spans the full bleed width the
          section gives it.

          The INNER box is the one that scrolls, and it is the one capped to
          `RAIL_MAX_WIDTH_PX` — exactly six cards. Capping the OUTER box
          instead (padding and max-width on the same element) was the first
          version of this fix, and it broke on wide viewports: at 25% zoom
          `--container-inset` alone can exceed 1600px, more than the 2040px
          cap, so the padding would have consumed the entire budget and left
          no room for the cards it was meant to be capping the number of.

          Within its cap, the inner box still runs to that boundary rather
          than stopping early, so a card straddling the edge is visibly cut
          off — the same "there is more" hint the original full-bleed
          version had, just bounded at six instead of at "however many the
          screen happens to fit". */}
      <div style={{ paddingLeft: "var(--container-inset)" }}>
        <div
          ref={railRef}
          style={{ maxWidth: `${RAIL_MAX_WIDTH_PX}px` }}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
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
    // `bleed`: the rails set their own inset so they can run past the
    // container edge. Everything inside them still starts on that edge.
    <Section id="stays" size="md" bleed>
      <div className="space-y-xl">
        {collections.map((collection) => (
          <Rail key={collection.id} collection={collection} loading={loading} />
        ))}
      </div>

      <Container className="mt-lg text-center">
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant"
        >
          <Link to="/properties">
            <EditableText
              id="collections-view-all"
              value={viewAllText}
              onChange={setViewAllText}
              as="span"
            >
              {viewAllText}
            </EditableText>
          </Link>
        </Button>
      </Container>
    </Section>
  );
};

export default PropertyCollections;
