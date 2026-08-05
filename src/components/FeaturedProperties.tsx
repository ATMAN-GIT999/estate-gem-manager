import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import EditableText from "@/components/admin/EditableText";
import SectionIntro from "@/components/SectionIntro";

/**
 * The portfolio itself, and the evidence the rest of the page leans on.
 *
 * It sits high in the scroll now, still inside the guest half: a visitor who
 * has just read where we host wants to see the homes next. It is also what
 * makes RevealBand work a moment later — "every home you just saw is managed
 * by Frontier" only lands if the reader has actually just seen them. The cards
 * are live rows from Guesty, not illustrations.
 */
const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridLayout, setGridLayout] = useState(3);

  const [viewAllText, setViewAllText] = useState("View All Properties");

  useEffect(() => {
    const fetchData = async () => {
      const { data: settings } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (settings) {
        setGridLayout(settings.homepage_grid_layout);
      }

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("available", true)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(settings?.homepage_properties_count || 3);

      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        // The generated row type widens `images` to `Json`; PropertyCard wants
        // the {url, caption} shape the importer actually writes.
        setProperties((data ?? []) as unknown as Property[]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const gridClass =
    gridLayout === 1 ? 'grid-cols-1' :
    gridLayout === 2 ? 'md:grid-cols-2' :
    gridLayout === 3 ? 'md:grid-cols-2 lg:grid-cols-3' :
    gridLayout === 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
    gridLayout === 5 ? 'md:grid-cols-3 lg:grid-cols-5' :
    'md:grid-cols-3 lg:grid-cols-6';

  return (
    <section id="stay" className="py-20 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <SectionIntro
            idPrefix="fp"
            eyebrow="The collection"
            heading="Homes we'd stay in ourselves."
          />
        </div>

        {loading ? (
          <div className={`grid gap-8 ${gridClass}`}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className={`grid gap-8 ${gridClass}`}>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/properties">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant">
                  <EditableText
                    id="index-view-all-btn"
                    value={viewAllText}
                    onChange={setViewAllText}
                    as="span"
                  >
                    {viewAllText}
                  </EditableText>
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
