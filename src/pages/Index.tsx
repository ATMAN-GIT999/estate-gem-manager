import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PropertyManagement from "@/components/PropertyManagement";
import PropertyEvaluator from "@/components/PropertyEvaluator";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridLayout, setGridLayout] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch site settings
      const { data: settings } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (settings) {
        setGridLayout(settings.homepage_grid_layout);
      }

      // Fetch featured properties
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
        setProperties(data || []);
      }
      setLoading(false);
    };

    fetchData();

    // Track page view
    supabase.from("analytics_events").insert({
      event_type: "page_view",
      page_path: "/",
      session_id: sessionStorage.getItem("session_id") || crypto.randomUUID(),
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      
      {/* Featured Properties Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold text-primary mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Discover our curated collection of luxury villas and apartments
            </p>
          </div>

          {loading ? (
            <div className={`grid gap-8 ${
              gridLayout === 1 ? 'grid-cols-1' :
              gridLayout === 2 ? 'md:grid-cols-2' :
              gridLayout === 3 ? 'md:grid-cols-2 lg:grid-cols-3' :
              gridLayout === 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
              gridLayout === 5 ? 'md:grid-cols-3 lg:grid-cols-5' :
              'md:grid-cols-3 lg:grid-cols-6'
            }`}>
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
              <div className={`grid gap-8 ${
                gridLayout === 1 ? 'grid-cols-1' :
                gridLayout === 2 ? 'md:grid-cols-2' :
                gridLayout === 3 ? 'md:grid-cols-2 lg:grid-cols-3' :
                gridLayout === 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
                gridLayout === 5 ? 'md:grid-cols-3 lg:grid-cols-5' :
                'md:grid-cols-3 lg:grid-cols-6'
              }`}>
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link to="/properties">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant">
                    View All Properties
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <Stats />
      <PropertyManagement />
      <PropertyEvaluator />
      <Footer />
    </div>
  );
};

export default Index;
