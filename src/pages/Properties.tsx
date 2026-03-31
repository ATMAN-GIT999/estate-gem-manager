import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import EditableText from "@/components/admin/EditableText";
import GuestySearchWidget from "@/components/GuestySearchWidget";
import PageWrapper from "@/components/PageWrapper";

const PropertiesContent = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("All Properties");

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

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-12">
        {/* Guesty Booking Engine Search Widget */}
        <div className="border-b border-border bg-background sticky top-20 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <GuestySearchWidget />
          </div>
        </div>

        {/* Properties Grid */}
        <div className="container mx-auto px-4 mt-8">
          <div className="mb-8">
            <EditableText
              id="properties-page-title"
              value={pageTitle}
              onChange={setPageTitle}
              as="h1"
              className="font-playfair text-4xl font-bold text-primary mb-2"
            >
              {pageTitle}
            </EditableText>
            <p className="text-muted-foreground">
              {loading ? "Loading..." : `${properties.length} properties available`}
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Properties = () => (<PageWrapper slug="site--properties"><PropertiesContent /></PageWrapper>);
export default Properties;