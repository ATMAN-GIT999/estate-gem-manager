import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingSummary from "@/components/BookingSummary";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Users, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import property1 from "@/assets/property-1.png";
import property2 from "@/assets/property-2.png";
import property3 from "@/assets/property-3.png";
import property4 from "@/assets/property-4.png";
import property5 from "@/assets/property-5.png";
import villaHigueron from "@/assets/villa-higueron.png";

const propertyImages: Record<string, string[]> = {
  "villa-in-higueron": [villaHigueron, property5],
  "peninsula-corner-villa-higueron": [property2],
  "los-monteros-retreat": [property3],
  "puente-romano-hideaway": [property4],
};

const PropertyDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  
  // Initialize booking state with URL params if available
  const [booking, setBooking] = useState({
    checkIn: searchParams.get('checkIn') || "",
    checkOut: searchParams.get('checkOut') || "",
    guests: parseInt(searchParams.get('guests') || "1"),
  });

  useEffect(() => {
    const fetchProperty = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Property not found",
        });
        navigate("/");
        return;
      }

      setProperty(data);
      setLoading(false);
    };

    fetchProperty();
  }, [slug, navigate, toast]);

  const handleBookNow = () => {
    // Open in-app booking flow powered by the Guesty Booking API
    if (!booking.checkIn || !booking.checkOut) {
      toast({
        variant: "destructive",
        title: "Select your dates",
        description: "Please choose check-in and check-out dates to continue.",
      });
      return;
    }
    if (new Date(booking.checkOut) <= new Date(booking.checkIn)) {
      toast({
        variant: "destructive",
        title: "Invalid dates",
        description: "Check-out must be after check-in.",
      });
      return;
    }
    setShowBookingSummary(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingSummary(false);
    setBooking({
      checkIn: "",
      checkOut: "",
      guests: 1,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!property) return null;

  // Use Guesty images if available, otherwise fall back to hardcoded images
  const guestyImages = property.images?.map((img: any) => img.url) || [];
  const images = guestyImages.length > 0 ? guestyImages : (propertyImages[property.slug] || [property1]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="mb-6 mt-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>

          {/* Property Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {images.slice(0, 6).map((img, idx) => (
              <div key={idx} className="aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src={img}
                  alt={`${property.name} - ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Property Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="font-playfair text-4xl font-bold text-primary mb-2">
                      {property.name}
                    </h1>
                    <div className="flex items-center gap-4 text-muted-foreground mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span className="text-lg">{property.location}</span>
                      </div>
                      {property.type && (
                        <Badge variant="outline" className="capitalize">
                          {property.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {property.featured && (
                    <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                  )}
                </div>

                <div className="flex items-center gap-8 text-foreground">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{property.guests} Guests</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h2 className="font-playfair text-2xl font-bold text-primary mb-4">
                  About this property
                </h2>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h2 className="font-playfair text-2xl font-bold text-primary mb-4">
                    Amenities
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {property.amenities.map((amenity: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary" />
                        <span className="text-foreground/80">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-6">
                <h2 className="font-playfair text-2xl font-bold text-primary mb-4">
                  Location
                </h2>
                <p className="text-muted-foreground">
                  {property.address || property.location}
                </p>
              </div>

              {property.registration_number && (
                <div className="border-t border-border pt-6">
                  <p className="text-sm text-muted-foreground">
                    Registration Number: {property.registration_number}
                  </p>
                </div>
              )}
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="mb-6">
                    {property.guesty_listing_id ? (
                      <div>
                        <span className="text-2xl font-bold text-primary">Live pricing</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          Rates are calculated in real-time in the booking engine.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">
                          €{property.price_per_night}
                        </span>
                        <span className="text-muted-foreground">/ night</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkIn">Check-in</Label>
                        <Input
                          id="checkIn"
                          type="date"
                          value={booking.checkIn}
                          onChange={(e) =>
                            setBooking({ ...booking, checkIn: e.target.value })
                          }
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkOut">Check-out</Label>
                        <Input
                          id="checkOut"
                          type="date"
                          value={booking.checkOut}
                          onChange={(e) =>
                            setBooking({ ...booking, checkOut: e.target.value })
                          }
                          min={booking.checkIn || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guests">Guests</Label>
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        max={property.guests}
                        value={booking.guests}
                        onChange={(e) =>
                          setBooking({ ...booking, guests: parseInt(e.target.value) || 1 })
                        }
                      />
                    </div>

                    <Button
                      onClick={handleBookNow}
                      className="w-full"
                      size="lg"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Booking Summary Dialog */}
      <Dialog open={showBookingSummary} onOpenChange={setShowBookingSummary}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <DialogTitle className="sr-only">Booking Summary</DialogTitle>
          {showBookingSummary && booking.checkIn && booking.checkOut && (
            <BookingSummary
              property={property}
              checkIn={booking.checkIn}
              checkOut={booking.checkOut}
              guests={booking.guests}
              onClose={() => setShowBookingSummary(false)}
              onSuccess={handleBookingSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDetail;
