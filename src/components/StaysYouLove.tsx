import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import EditableText from "@/components/admin/EditableText";
import SectionIntro from "@/components/SectionIntro";

/**
 * The portfolio, as a horizontal rail rather than a grid.
 *
 * A grid says "here are three homes, that is the collection". A rail that runs
 * off the edge of the screen says "here is a portfolio, keep going" — and it
 * gets a guest into an individual property page, which is where booking
 * actually starts.
 *
 * Native scroll-snap rather than a carousel library: it is a horizontal list,
 * it should behave like one on a trackpad and a touchscreen, and it costs no
 * JavaScript on a page whose LCP already carries a video.
 *
 * ⚠️ The fetch falls back deliberately. It asks for `featured` rows first, but
 * no row in the table currently has that flag set, so a featured-only query
 * renders an empty rail on the live site. Rather than show nothing, it then
 * takes the most recent available homes. Set `featured` on the homes that
 * should lead and the flag takes over again.
 */
/**
 * Matches the `container` above it: centred, capped at 1400px, 2rem of gutter.
 * Padding and scroll-padding have to carry the same value or the two disagree.
 */
const RAIL_INSET =
  "px-4 scroll-pl-4 " +
  "md:px-[max(1rem,calc((100vw-1400px)/2+2rem))] " +
  "md:scroll-pl-[max(1rem,calc((100vw-1400px)/2+2rem))]";

const StaysYouLove = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewAllText, setViewAllText] = useState("View all properties");

  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data: settings } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      const limit = settings?.homepage_properties_count || 8;

      const base = () =>
        supabase
          .from("properties")
          .select("*")
          .eq("available", true)
          .order("created_at", { ascending: false })
          .limit(limit);

      const { data: featured, error } = await base().eq("featured", true);

      if (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
        return;
      }

      let rows = featured ?? [];
      if (rows.length === 0) {
        const { data: fallback } = await base();
        rows = fallback ?? [];
      }

      // The generated row type widens `images` to `Json`; PropertyCard wants
      // the {url, caption} shape the importer actually writes.
      setProperties(rows as unknown as Property[]);
      setLoading(false);
    };

    fetchProperties();
  }, []);

  const scrollRail = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    // One card plus its gap, so a click always lands on a card edge.
    rail.scrollBy({ left: direction * 344, behavior: "smooth" });
  };

  return (
    <section id="stays" className="py-24 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <SectionIntro
            idPrefix="stays"
            align="left"
            eyebrow="The collection"
            heading="Stays you'll love."
            lead="Homes we manage ourselves — booked direct, without the platform fee."
            className="max-w-xl"
          />

          {/* Arrows are desktop-only: a touch device already scrolls the rail. */}
          <div className="hidden md:flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Scroll left"
              onClick={() => scrollRail(-1)}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Scroll right"
              onClick={() => scrollRail(1)}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Full-bleed: the rail runs to the edge of the viewport so the last card
          is visibly cut off, which is what tells a reader there is more.
          The inline padding lines the first card up with the container above
          it, and `scroll-pl` has to repeat that value — without it the snap
          engine treats the padding as scrollable space and parks the first
          card flush against the window edge on load. */}
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
          : properties.map((property) => (
              <div key={property.id} className="w-80 shrink-0 snap-start">
                <PropertyCard property={property} />
              </div>
            ))}
      </div>

      <div className="container mx-auto px-4">
        <div className="mt-10">
          <Link to="/properties">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant"
            >
              <EditableText
                id="stays-view-all"
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

export default StaysYouLove;
