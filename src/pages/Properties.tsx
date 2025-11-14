import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarIcon, Users, Search } from "lucide-react";

const Properties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");

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

  const handleSearch = () => {
    // Filter logic will be implemented here
    console.log("Searching with:", { checkIn, checkOut, guests });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-12">
        {/* Search Filter Bar */}
        <div className="border-b border-border bg-background sticky top-20 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Card className="p-3 shadow-elegant">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-4 py-2 border-r border-border">
                  <CalendarIcon className="w-5 h-5 text-primary shrink-0" />
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    placeholder="Check-in"
                    className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="flex-1 flex items-center gap-3 px-4 py-2 border-r border-border">
                  <CalendarIcon className="w-5 h-5 text-primary shrink-0" />
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    placeholder="Check-out"
                    className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="flex-1 flex items-center gap-3 px-4 py-2">
                  <Users className="w-5 h-5 text-primary shrink-0" />
                  <Input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    placeholder="Gäste hinzufügen"
                    className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft h-12 px-8 rounded-full"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="container mx-auto px-4 mt-8">
          <div className="mb-8">
            <h1 className="font-playfair text-4xl font-bold text-primary mb-2">
              All Properties
            </h1>
            <p className="text-foreground/80">
              {properties.length} properties available
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

export default Properties;
