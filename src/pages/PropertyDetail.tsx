import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
// Map temporarily disabled due to runtime error in react-leaflet
// import PropertyMap from "@/components/PropertyMap";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Users, ArrowLeft, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize booking state with URL params if available
  const [booking, setBooking] = useState({
    checkIn: searchParams.get('checkIn') || "",
    checkOut: searchParams.get('checkOut') || "",
    guests: parseInt(searchParams.get('guests') || "1"),
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    specialRequests: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);

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

  const calculateTotalPrice = () => {
    if (!booking.checkIn || !booking.checkOut || !property) return 0;
    
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights * property.price_per_night : 0;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!booking.checkIn || !booking.checkOut) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select check-in and check-out dates",
      });
      return;
    }

    setBookingLoading(true);

    try {
      const totalPrice = calculateTotalPrice();
      
      const { error } = await supabase.from("bookings").insert({
        property_id: property.id,
        user_id: user?.id || null,
        guest_name: booking.guestName,
        guest_email: booking.guestEmail,
        guest_phone: booking.guestPhone,
        check_in: booking.checkIn,
        check_out: booking.checkOut,
        guests: booking.guests,
        total_price: totalPrice,
        special_requests: booking.specialRequests,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Booking request sent!",
        description: "We'll contact you shortly to confirm your booking.",
      });

      // Reset form
      setBooking({
        checkIn: "",
        checkOut: "",
        guests: 1,
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        specialRequests: "",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: error.message || "Could not create booking",
      });
    } finally {
      setBookingLoading(false);
    }
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

              {/* Map temporarily disabled due to runtime error in react-leaflet */}
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
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">
                        €{property.price_per_night}
                      </span>
                      <span className="text-muted-foreground">/ night</span>
                    </div>
                  </div>

                  <form onSubmit={handleBooking} className="space-y-4">
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
                          required
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
                          required
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
                          setBooking({ ...booking, guests: parseInt(e.target.value) })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guestName">Full Name</Label>
                      <Input
                        id="guestName"
                        type="text"
                        value={booking.guestName}
                        onChange={(e) =>
                          setBooking({ ...booking, guestName: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guestEmail">Email</Label>
                      <Input
                        id="guestEmail"
                        type="email"
                        value={booking.guestEmail}
                        onChange={(e) =>
                          setBooking({ ...booking, guestEmail: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guestPhone">Phone</Label>
                      <Input
                        id="guestPhone"
                        type="tel"
                        value={booking.guestPhone}
                        onChange={(e) =>
                          setBooking({ ...booking, guestPhone: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        value={booking.specialRequests}
                        onChange={(e) =>
                          setBooking({ ...booking, specialRequests: e.target.value })
                        }
                        rows={3}
                      />
                    </div>

                    {booking.checkIn && booking.checkOut && (
                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Total Price:</span>
                          <span className="font-bold text-primary">
                            €{calculateTotalPrice()}
                          </span>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? "Processing..." : "Request Booking"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
