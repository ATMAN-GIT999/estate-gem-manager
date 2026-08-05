import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import EditableText from "@/components/admin/EditableText";

/**
 * The guest branch, and the last thing on the page.
 *
 * It used to sit directly under the intro, which meant a visiting owner hit a
 * grid of holiday rentals before reading a single word about management. Down
 * here it does two jobs at once: it hands guests over to the booking flow, and
 * it proves to owners that the portfolio is real — the cards are live rows from
 * Guesty, not illustrations.
 *
 * The heading deliberately switches who it is talking to; the reader has been
 * addressed as an owner for six sections by this point.
 */
const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridLayout, setGridLayout] = useState(3);

  const [featuredTitle, setFeaturedTitle] = useState("Looking for a Place to Stay?");
  const [featuredSubtitle, setFeaturedSubtitle] = useState(
    "The same homes we manage are yours to book — a curated collection of luxury villas and apartments."
  );
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
        <div className="text-center mb-12">
          <EditableText
            id="index-featured-title"
            value={featuredTitle}
            onChange={setFeaturedTitle}
            as="h2"
            className="font-playfair text-4xl font-bold text-primary mb-4"
          >
            {featuredTitle}
          </EditableText>
          <EditableText
            id="index-featured-subtitle"
            value={featuredSubtitle}
            onChange={setFeaturedSubtitle}
            as="p"
            className="text-xl text-foreground/80 max-w-2xl mx-auto"
          >
            {featuredSubtitle}
          </EditableText>
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
