import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarIcon, Users, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const Properties = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [properties, setProperties] = useState<any[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : undefined
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : undefined
  );
  const [guests, setGuests] = useState(searchParams.get('guests') || "");

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
        setAllProperties(data || []);
        setProperties(data || []);
      }
      setLoading(false);
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    // Auto-search if dates are provided in URL params
    if (checkInDate && checkOutDate) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Dates Required",
        description: "Please select both check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    setCheckingAvailability(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('guesty-search-listings', {
        body: {
          checkIn: format(checkInDate, 'yyyy-MM-dd'),
          checkOut: format(checkOutDate, 'yyyy-MM-dd'),
          adults: parseInt(guests) || 1,
        },
      });

      if (error) throw error;

      const guestyListings = data.listings || [];
      
      // Match Guesty listings with our database properties by name/slug
      const matchedProperties = allProperties.filter(prop => {
        return guestyListings.some((listing: any) => 
          prop.name.toLowerCase().includes(listing.title?.toLowerCase()) ||
          listing.title?.toLowerCase().includes(prop.name.toLowerCase())
        );
      });
      
      setProperties(matchedProperties);
      
      toast({
        title: "Availability Check Complete",
        description: `Found ${matchedProperties.length} available properties for your dates`,
      });
    } catch (error) {
      console.error('Error checking availability:', error);
      toast({
        title: "Error",
        description: "Could not check availability. Showing all properties.",
        variant: "destructive",
      });
      setProperties(allProperties);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const clearFilters = () => {
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setGuests("");
    setProperties(allProperties);
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 font-normal justify-start text-left hover:bg-transparent w-full"
                      >
                        {checkInDate ? format(checkInDate, "PPP") : "Check-in"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={setCheckInDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex-1 flex items-center gap-3 px-4 py-2 border-r border-border">
                  <CalendarIcon className="w-5 h-5 text-primary shrink-0" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 font-normal justify-start text-left hover:bg-transparent w-full"
                      >
                        {checkOutDate ? format(checkOutDate, "PPP") : "Check-out"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        disabled={(date) => date < new Date() || (checkInDate && date <= checkInDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex-1 flex items-center gap-3 px-4 py-2">
                  <Users className="w-5 h-5 text-primary shrink-0" />
                  <Input
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    placeholder="Gäste hinzufügen"
                    className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSearch}
                    disabled={checkingAvailability}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft h-12 px-8 rounded-full"
                  >
                    {checkingAvailability ? "Checking..." : <Search className="h-5 w-5" />}
                  </Button>
                  {(checkInDate || checkOutDate) && (
                    <Button 
                      onClick={clearFilters}
                      variant="outline"
                      className="h-12 px-6 rounded-full"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="container mx-auto px-4 mt-8">
          <div className="mb-8">
            <h1 className="font-playfair text-4xl font-bold text-primary mb-2">
              {checkInDate && checkOutDate ? "Available Properties" : "All Properties"}
            </h1>
            <p className="text-muted-foreground">
              {loading ? "Loading..." : checkingAvailability ? "Checking availability..." : `${properties.length} properties ${checkInDate && checkOutDate ? 'available for your dates' : 'available'}`}
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
