import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingSummary from "@/components/BookingSummary";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Users, ArrowLeft, Images, ChevronLeft, ChevronRight } from "lucide-react";
import { getAmenityIcon } from "@/lib/amenityIcons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/contexts/LocaleContext";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import Seo from "@/components/Seo";
import { breadcrumbSchema, propertySchema } from "@/lib/schema";
import property3 from "@/assets/property-3.webp";
import losMonterosCard from "@/assets/los-monteros-card.webp";

// See PropertyCard.tsx's propertyImages comment — the other three entries
// this map used to have were fabricated seed rows, deleted 2026-08-20
// (docs/DECISIONS.md §27).
const propertyImages: Record<string, string[]> = {
  "los-monteros-retreat": [losMonterosCard],
};

const PropertyDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { convertPrice, currencySymbol, t } = useLocale();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [datesValid, setDatesValid] = useState(false);
  
  // Initialize booking state with URL params if available
  const [booking, setBooking] = useState({
    checkIn: searchParams.get('checkIn') || "",
    checkOut: searchParams.get('checkOut') || "",
    guests: parseInt(searchParams.get('guests') || "1"),
  });

  const range: DateRange | undefined = booking.checkIn
    ? {
        from: new Date(booking.checkIn + "T00:00:00"),
        to: booking.checkOut ? new Date(booking.checkOut + "T00:00:00") : undefined,
      }
    : undefined;

  const handleRangeChange = (r: DateRange | undefined) => {
    setBooking((b) => ({
      ...b,
      checkIn: r?.from ? format(r.from, "yyyy-MM-dd") : "",
      checkOut: r?.to ? format(r.to, "yyyy-MM-dd") : "",
    }));
  };

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
          title: t("pd-toast-not-found-title"),
          description: t("pd-toast-not-found-desc"),
        });
        navigate("/");
        return;
      }

      setProperty(data);
      setLoading(false);
    };

    fetchProperty();
    // `t` deliberately excluded — refetching the property on every language
    // switch just to keep an error-path toast's wording current isn't worth
    // the extra request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, navigate, toast]);

  const handleBookNow = () => {
    // Open in-app booking flow powered by the Guesty Booking API
    if (!booking.checkIn || !booking.checkOut) {
      toast({
        variant: "destructive",
        title: t("pd-toast-select-dates-title"),
        description: t("pd-toast-select-dates-desc"),
      });
      return;
    }
    if (new Date(booking.checkOut) <= new Date(booking.checkIn)) {
      toast({
        variant: "destructive",
        title: t("pd-toast-invalid-dates-title"),
        description: t("pd-toast-invalid-dates-desc"),
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
  const images = guestyImages.length > 0 ? guestyImages : (propertyImages[property.slug] || [property3]);

  // A property's own words if it has any, trimmed to roughly what a search
  // result will actually display, otherwise a sentence built from its facts.
  const metaDescription = property.description
    ? String(property.description).replace(/\s+/g, " ").trim().slice(0, 155)
    : `${property.bedrooms === 0 ? "Studio" : `${property.bedrooms}-bedroom`} ${String(property.type ?? "property").toLowerCase()} in ${property.location}, sleeping up to ${property.guests}. Book directly with Frontier Residences.`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* `path` is built from the slug alone, without the checkIn/checkOut/guests
          query string the property cards attach — otherwise every date a
          visitor searches would present itself as a separate page. */}
      <Seo
        title={`${property.name} — ${property.location}`}
        description={metaDescription}
        path={`/property/${property.slug}`}
        type="article"
        image={images[0] ?? undefined}
        schema={[
          propertySchema({
            name: property.name,
            slug: property.slug,
            description: property.description,
            location: property.location,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            guests: property.guests,
            images: property.images,
            amenities: property.amenities,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Properties", path: "/properties" },
            { name: property.name, path: `/property/${property.slug}` },
          ]),
        ]}
      />
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="mb-6 mt-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("pd-back")}
          </Button>

          {/* Gallery — one lead image with four beside it, capped at half the
              viewport. It used to be six 4:3 tiles in a three-column grid: two
              full rows, around 700px of photograph before a reader reached a
              single word about the property. Tiles carry no radius of their own
              and sit on a 2px gap inside one rounded frame, so the block reads
              as one image rather than five boxes. */}
          <div className="relative mb-10">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[50vh] min-h-[320px] max-h-[560px] rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setLightboxIndex(0)}
                className="md:col-span-2 md:row-span-2 group relative overflow-hidden"
              >
                <img
                  src={images[0]}
                  alt={`${property.name} — 1`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </button>

              {/* Hidden below md: on a phone the lead image alone is the whole
                  screen, and four slivers beside it would be unreadable. */}
              {images.slice(1, 5).map((img: string, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIndex(idx + 1)}
                  className="hidden md:block group relative overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`${property.name} — ${idx + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
              ))}
            </div>

            {images.length > 1 && (
              <Button
                variant="secondary"
                onClick={() => setGalleryOpen(true)}
                className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm hover:bg-background shadow-elegant"
              >
                <Images className="w-4 h-4 mr-2" />
                {t("pd-show-all-photos").replace("{n}", String(images.length))}
              </Button>
            )}
          </div>

          {/* Overview grid — every photo at once, for scanning rather than
              looking closely. Clicking one hands off to the solo lightbox
              below instead of enlarging inline. */}
          <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
            <DialogContent className="max-w-5xl w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto">
              <DialogTitle className="font-playfair text-2xl text-primary">
                {property.name}
              </DialogTitle>
              <div className="grid sm:grid-cols-2 gap-3 mt-2">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setGalleryOpen(false);
                      setLightboxIndex(idx);
                    }}
                    className="group relative overflow-hidden rounded-lg"
                  >
                    <img
                      src={img}
                      alt={`${property.name} — ${idx + 1}`}
                      className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Solo lightbox — one photo at a time, uncropped
              (`object-contain`, not `object-cover`, so nothing gets sliced
              off to fill the frame the way the grid thumbnails do). */}
          <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
            <DialogContent className="max-w-6xl w-[calc(100vw-2rem)] h-[calc(100vh-4rem)] p-0 bg-background/95 border-0 [&>button]:text-foreground [&>button]:opacity-100">
              <DialogTitle className="sr-only">
                {property.name} — photo {lightboxIndex !== null ? lightboxIndex + 1 : 0} of {images.length}
              </DialogTitle>
              {lightboxIndex !== null && (
                <div className="relative flex h-full items-center justify-center">
                  <img
                    src={images[lightboxIndex]}
                    alt={`${property.name} — ${lightboxIndex + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                  {images.length > 1 && (
                    <>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        aria-label={t("pd-previous-photo")}
                        onClick={() => setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 hover:bg-background shadow-elegant"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        aria-label={t("pd-next-photo")}
                        onClick={() => setLightboxIndex((lightboxIndex + 1) % images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 hover:bg-background shadow-elegant"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/90 px-3 py-1 text-xs text-foreground shadow-elegant">
                        {lightboxIndex + 1} / {images.length}
                      </span>
                    </>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Property Details */}
            <div className="lg:col-span-3 space-y-6">
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
                    <Badge className="bg-primary text-primary-foreground">{t("propertycard.featured")}</Badge>
                  )}
                </div>

                <div className="flex items-center gap-8 text-foreground">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    <span>{property.bedrooms === 0 ? t("propertycard.studio") : `${property.bedrooms} ${t("pd-bedrooms")}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5" />
                    <span>{property.bathrooms} {t("pd-bathrooms")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{property.guests} {t("pd-guests")}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h2 className="font-playfair text-2xl font-bold text-primary mb-4">
                  {t("pd-about-title")}
                </h2>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h2 className="font-playfair text-2xl font-bold text-primary mb-4">
                    {t("pd-amenities-title")}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {property.amenities.map((amenity: string, idx: number) => {
                      const Icon = getAmenityIcon(amenity);
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-primary shrink-0" strokeWidth={1.5} />
                          <span className="text-foreground/80">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-6">
                <h2 className="font-playfair text-2xl font-bold text-primary mb-4">
                  {t("pd-location-title")}
                </h2>
                <p className="text-muted-foreground">
                  {property.address || property.location}
                </p>
              </div>

              {property.registration_number && (
                <div className="border-t border-border pt-6">
                  <p className="text-sm text-muted-foreground">
                    {t("pd-registration-number")} {property.registration_number}
                  </p>
                </div>
              )}
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-2">
              <Card className="lg:sticky lg:top-24">
                <CardContent className="p-4">
                  <div className="mb-3">
                    {property.guesty_listing_id ? (
                      <div>
                        <span className="text-lg font-bold text-primary">{t("pd-live-pricing")}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t("pd-live-pricing-note")}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        {/* Display rounding/currency only, same as
                            PropertyCard.tsx — price_per_night itself is
                            untouched. */}
                        <span className="text-3xl font-bold text-primary">
                          {currencySymbol}{convertPrice(property.price_per_night)}
                        </span>
                        <span className="text-muted-foreground">{t("pd-per-night")}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <AvailabilityCalendar
                      listingId={property.guesty_listing_id}
                      range={range}
                      onRangeChange={handleRangeChange}
                      numberOfMonths={1}
                      onValidityChange={({ valid }) => setDatesValid(valid)}
                      fallbackNightlyRate={property.price_per_night}
                      fallbackCurrency="EUR"
                    />

                    <div className="flex items-center gap-3">
                      <Label htmlFor="guests" className="shrink-0">{t("pd-guests-label")}</Label>
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        max={property.guests}
                        value={booking.guests}
                        onChange={(e) =>
                          setBooking({ ...booking, guests: parseInt(e.target.value) || 1 })
                        }
                        className="h-9"
                      />
                    </div>

                    <Button
                      onClick={handleBookNow}
                      className="w-full"
                      disabled={!datesValid}
                    >
                      {t("pd-book-now")}
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
        <DialogContent className="sm:max-w-md p-0 overflow-y-auto max-h-[95vh] w-[calc(100vw-1rem)] sm:w-full rounded-lg">
          <DialogTitle className="sr-only">{t("pd-booking-summary-title")}</DialogTitle>
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
