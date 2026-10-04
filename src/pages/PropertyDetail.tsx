import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingSummary from "@/components/BookingSummary";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Container, Grid, Panel, Section } from "@/components/layout";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import SurroundingsMap from "@/components/SurroundingsMap";
import { ArrowRight, Bed, Bath, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { getAmenityIcon } from "@/lib/amenityIcons";
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
import Breadcrumb from "@/components/Breadcrumb";
import { propertyPath } from "@/lib/propertyUrl";
import {
  LOCATION_PAGE_EXCLUDED_LISTINGS,
  findVacationRentalCity,
  vrKey,
} from "@/lib/vacationRentals";
import { en } from "@/lib/translations";
import { breadcrumbSchema, propertySchema } from "@/lib/schema";
import property3 from "@/assets/property-3.webp";
import losMonterosCard from "@/assets/los-monteros-card.webp";

// See PropertyCard.tsx's propertyImages comment — the other three entries
// this map used to have were fabricated seed rows, deleted 2026-08-20
// (docs/DECISIONS.md §27).
const propertyImages: Record<string, string[]> = {
  "los-monteros-retreat": [losMonterosCard],
};

/** Eight standout items, not the full amenity checklist. */
const KEY_FEATURE_COUNT = 8;

const WHATSAPP_URL = "https://wa.me/34649429678";

const PropertyDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { convertPrice, currencySymbol, t } = useLocale();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [datesValid, setDatesValid] = useState(false);
  const [similar, setSimilar] = useState<Property[]>([]);
  
  // Initialize booking state with URL params if available
  const [booking, setBooking] = useState({
    checkIn: searchParams.get('checkIn') || "",
    checkOut: searchParams.get('checkOut') || "",
    guests: parseInt(searchParams.get('guests') || "1"),
  });

  // Reassembled from the same URL params PropertyCard forwarded in, so
  // "Back to Properties" lands on the exact search the guest came from
  // instead of a blank /properties page.
  const backToPropertiesLink = (() => {
    const params = new URLSearchParams();
    const location = searchParams.get('location');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    if (location) params.set('location', location);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    const queryString = params.toString();
    return `/properties${queryString ? `?${queryString}` : ''}`;
  })();

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
      // Both URL forms are accepted: Frontier's `seo_slug` first, then the
      // Guesty-derived `slug` it replaced (src/lib/propertyUrl.ts). Two plain
      // lookups rather than one `.or()` filter, because `slug` comes straight
      // from the address bar and a comma or bracket in it would be read as
      // filter syntax.
      const bySeoSlug = await supabase
        .from("properties")
        .select("*")
        .eq("seo_slug", slug ?? "")
        .maybeSingle();
      const { data, error } = bySeoSlug.data
        ? bySeoSlug
        : await supabase.from("properties").select("*").eq("slug", slug ?? "").maybeSingle();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: t("pd-toast-not-found-title"),
          description: t("pd-toast-not-found-desc"),
        });
        navigate("/properties");
        return;
      }

      // Arrived on the old address: move to the new one, keeping the dates
      // the guest searched with. public/_redirects already answers this with
      // a 301 on the live host; this covers the dev server, in-app links from
      // before the switch, and any home whose seo_slug is set after the
      // redirect list was written.
      if (data.seo_slug && data.seo_slug !== slug) {
        navigate(`${propertyPath(data)}${window.location.search}`, { replace: true });
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

  // Three homes to go on to (docs/seo/01_IMPLEMENTATION.md D2): the same
  // location page first, then the closest match in guest count. Both are
  // columns the table really has — anything finer (style, price band) would
  // be a guess dressed up as a recommendation. The long-stay listing stays
  // out for the same reason it is off the location pages: a guest sent there
  // from here can never book it.
  useEffect(() => {
    if (!property?.id) return;
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("available", true)
        .neq("id", property.id);
      if (cancelled || !data) return;
      // The generated row type widens `images` to `Json`; PropertyCard wants
      // the {url, caption} shape the importer actually writes.
      const candidates = (data as unknown as Property[]).filter(
        (p) => !LOCATION_PAGE_EXCLUDED_LISTINGS.has(p.guesty_listing_id ?? "")
      );
      const samePlace = (p: Property) =>
        property.city_group ? p.city_group === property.city_group : p.location === property.location;
      const ranked = [...candidates].sort(
        (a, b) =>
          Number(samePlace(b)) - Number(samePlace(a)) ||
          Math.abs(a.guests - property.guests) - Math.abs(b.guests - property.guests)
      );
      setSimilar(ranked.slice(0, 3));
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [property?.id, property?.city_group, property?.location, property?.guests]);

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

  // Guesty gives us no per-photo caption, so an honest alt text is the house,
  // its town and which photo of how many this is — "Casa Heredia in Benahavís
  // — photo 3 of 24". The old `${property.name} — 3` told a screen-reader
  // user the number and nothing else. Naming a room we cannot see in the data
  // would be a guess, and a confident wrong alt text is worse than a plain
  // one.
  const photoAlt = (n: number) =>
    t("pd-photo-alt")
      .replace("{name}", property.name)
      .replace("{location}", property.location)
      .replace("{n}", String(n))
      .replace("{total}", String(images.length));

  // A property's own words if it has any, trimmed to roughly what a search
  // result will actually display, otherwise a sentence built from its facts.
  const keyFeatures: string[] = (property.amenities ?? []).slice(0, KEY_FEATURE_COUNT);

  // `nearby_amenities` is a column nothing currently writes (an unwired
  // leftover). Read it if a row ever carries one; render nothing otherwise
  // rather than inventing walking times.
  const nearby: string[] = Array.isArray(property.nearby_amenities)
    ? (property.nearby_amenities as any[]).map((n) =>
        typeof n === "string" ? n : [n?.name, n?.distance].filter(Boolean).join(" — ")
      )
    : [];

  const path = propertyPath(property);
  // The location page this home belongs to, if it has been given one. A home
  // imported without a `city_group` falls back to the old trail through the
  // filtered search, so it still has a way back.
  const city = findVacationRentalCity(property.city_group ?? undefined);
  const placeLabel = city ? t(vrKey(city.slug, "name")) : property.location;
  // Dates and guests travel on to the location page, whose cards pass them
  // on again — a guest who goes up a level and back down keeps their search.
  const placeLink = (() => {
    if (!city) return backToPropertiesLink;
    const params = new URLSearchParams();
    for (const key of ["checkIn", "checkOut", "guests"]) {
      const value = searchParams.get(key);
      if (value) params.set(key, value);
    }
    const query = params.toString();
    return `/vacation-rentals/${city.slug}${query ? `?${query}` : ""}`;
  })();
  const schemaTrail = city
    ? [
        { name: "Home", path: "/" },
        { name: "Vacation Rentals", path: "/vacation-rentals" },
        { name: en[vrKey(city.slug, "name")], path: `/vacation-rentals/${city.slug}` },
        { name: property.name, path },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Properties", path: "/properties" },
        { name: property.name, path },
      ];

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
        path={path}
        type="article"
        image={images[0] ?? undefined}
        schema={[
          propertySchema({
            name: property.name,
            path,
            description: property.description,
            location: property.location,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            guests: property.guests,
            images: property.images,
            amenities: property.amenities,
          }),
          breadcrumbSchema(schemaTrail),
        ]}
      />
      <Navigation />

      <main className="flex-1 pt-24">
        {/* Breadcrumb, not a back button: it says where the visitor is as
            well as how to get back. The place step leads to the location page
            (docs/seo/01_IMPLEMENTATION.md D1) with the guest's dates still on
            it. */}
        <Breadcrumb
          trail={
            city
              ? [
                  { label: t("vr-home"), to: "/" },
                  { label: t("vr-breadcrumb"), to: "/vacation-rentals" },
                  { label: placeLabel, to: placeLink },
                  { label: property.name, to: path },
                ]
              : [
                  { label: t("pd-all-homes"), to: backToPropertiesLink },
                  { label: property.name, to: path },
                ]
          }
        />

        {/* Gallery — one lead image and four beside it in a 2×2, the clearest
            way to show a house before anyone reads a word. Tiles carry no
            radius of their own and sit on a 2px gap, so the block reads as one
            image rather than five boxes. */}
        <Container>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-0.5 h-[52vh] min-h-[320px] max-h-[560px] overflow-hidden">
              <button
                type="button"
                onClick={() => setLightboxIndex(0)}
                className="md:col-span-2 md:row-span-2 group relative overflow-hidden"
              >
                <img
                  src={images[0]}
                  alt={photoAlt(1)}
                  width={1200}
                  height={900}
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
                    alt={photoAlt(idx + 2)}
                    width={600}
                    height={450}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
              ))}
            </div>
          </div>
        </Container>

        {/* Solo lightbox — one photo at a time, uncropped (`object-contain`,
            not `object-cover`, so nothing gets sliced off to fill the frame
            the way the grid thumbnails do). */}
        <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
          <DialogContent className="max-w-6xl w-[calc(100vw-2rem)] h-[calc(100vh-4rem)] p-0 bg-background/95 border-0 [&>button]:text-foreground [&>button]:opacity-100">
            <DialogTitle className="sr-only">
              {property.name} — photo {lightboxIndex !== null ? lightboxIndex + 1 : 0} of {images.length}
            </DialogTitle>
            {lightboxIndex !== null && (
              <div className="relative flex h-full items-center justify-center">
                <img
                  src={images[lightboxIndex]}
                  alt={photoAlt(lightboxIndex + 1)}
                  loading="lazy"
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
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/90 px-3 py-1 t-body text-foreground shadow-elegant">
                      {lightboxIndex + 1} / {images.length}
                    </span>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Head and booking. */}
        <Section size="md">
          <div className="grid gap-lg lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              {property.type && (
                <p className="t-tag text-accent-strong">
                  {property.type} {t("properties.collection")}
                </p>
              )}

              <h1 className="t-display text-foreground mt-3">{property.name}</h1>
              <p className="t-body text-muted-foreground mt-2">{property.location}</p>

              <ul className="flex flex-wrap items-center gap-x-lg gap-y-2 mt-md py-4 border-y border-border">
                <li className="flex items-center gap-2 t-body text-foreground">
                  <Users className="w-4 h-4 text-accent-strong" strokeWidth={1.5} />
                  {property.guests} {t("pd-guests")}
                </li>
                <li className="flex items-center gap-2 t-body text-foreground">
                  <Bed className="w-4 h-4 text-accent-strong" strokeWidth={1.5} />
                  {property.bedrooms === 0
                    ? t("propertycard.studio")
                    : `${property.bedrooms} ${t("pd-bedrooms")}`}
                </li>
                <li className="flex items-center gap-2 t-body text-foreground">
                  <Bath className="w-4 h-4 text-accent-strong" strokeWidth={1.5} />
                  {property.bathrooms} {t("pd-bathrooms")}
                </li>
              </ul>

              {property.description && (
                <p className="t-body text-muted-foreground mt-md whitespace-pre-line">
                  {property.description}
                </p>
              )}

              {keyFeatures.length > 0 && (
                <div className="mt-lg">
                  <h2 className="t-tag text-accent-strong">{t("pd-key-features")}</h2>
                  {/* Eight, not the full checklist. Frontier is making a case
                      for one house, not proving a platform has WiFi — the
                      full list can live in a detail accordion later if guests
                      ask for it. Which eight is the first eight Guesty
                      returns; a curated order needs a column that does not
                      exist yet (docs/PROJECT.md D8). */}
                  <ul className="grid sm:grid-cols-2 gap-x-lg gap-y-3 mt-4">
                    {keyFeatures.map((amenity: string, idx: number) => {
                      const Icon = getAmenityIcon(amenity);
                      return (
                        <li key={idx} className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-accent-strong shrink-0" strokeWidth={1.5} />
                          <span className="t-body text-foreground">{amenity}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {property.registration_number && (
                <p className="t-body text-muted-foreground mt-lg pt-4 border-t border-border">
                  {t("pd-registration-number")} {property.registration_number}
                </p>
              )}
            </div>

            {/* The booking panel. Gold rule on top and a lightly sage-tinted
                ground — the same Panel treatment the owner page's two models
                carry, so the one place on the site where a guest commits
                money looks like a decision rather than a widget.

                Everything inside it is the existing flow untouched: the
                Guesty calendar, `datesValid` gating the button, and
                BookingSummary's quote/Stripe dialog behind it. */}
            <div className="lg:col-span-4 lg:col-start-9">
              <Panel className="lg:sticky lg:top-24">
                <p className="t-tag text-accent-strong">{t("pd-your-stay")}</p>

                <div className="mt-4 space-y-3">
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
                    <Label htmlFor="guests" className="shrink-0 t-body">
                      {t("pd-who")}
                    </Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max={property.guests}
                      value={booking.guests}
                      onChange={(e) =>
                        setBooking({ ...booking, guests: parseInt(e.target.value) || 1 })
                      }
                      className="h-9 bg-background"
                    />
                  </div>
                </div>

                <div className="mt-md pt-4 border-t border-border">
                  {property.guesty_listing_id ? (
                    <>
                      <p className="t-item text-foreground">{t("pd-live-pricing")}</p>
                      <p className="t-body text-muted-foreground mt-1">
                        {t("pd-live-pricing-note")}
                      </p>
                    </>
                  ) : (
                    <p className="t-body text-muted-foreground">
                      {t("propertycard.from")}{" "}
                      <span className="t-item text-foreground">
                        {currencySymbol}
                        {convertPrice(property.price_per_night)}
                      </span>{" "}
                      {t("pd-per-night")}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleBookNow}
                  disabled={!datesValid}
                  className="cta-base cta-primary w-full mt-md disabled:opacity-45 disabled:pointer-events-none"
                >
                  {t("pd-check-availability")} <span aria-hidden="true">&rarr;</span>
                </button>

                <div className="mt-4 text-center">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cta-link">
                    {t("pd-make-request")}
                  </a>
                  <p className="t-body text-muted-foreground mt-3">
                    {t("pd-available-note")} ·{" "}
                    <a href="tel:+34649429678" className="text-accent-strong hover:underline">
                      +34 649 429 678
                    </a>
                  </p>
                </div>
              </Panel>
            </div>
          </div>
        </Section>

        {/* The setting. Not `bleed` any more (Almedin, 04.10.2026): the map
            used to run edge to edge at 21:9, which read as a stray strip
            rather than part of the page. Section's own Container now wraps
            both the text and the map, so the map sits inside the normal
            content width at a calmer 16:9 — see SurroundingsMap.tsx. */}
        <Section size="md">
          <p className="t-tag text-accent-strong">{t("pd-location-eyebrow")}</p>
          <h2 className="t-section text-foreground mt-3">{t("pd-surroundings-heading")}</h2>

          <dl className="grid sm:grid-cols-2 gap-lg mt-md max-w-2xl">
            <div>
              <dt className="t-meta text-muted-foreground">{t("pd-setting")}</dt>
              <dd className="t-body text-foreground mt-1">
                {property.type ?? property.location}
              </dd>
            </div>
            {nearby.length > 0 && (
              <div>
                <dt className="t-meta text-muted-foreground">{t("pd-nearby")}</dt>
                <dd className="mt-1">
                  {nearby.map((entry, idx) => (
                    <p key={idx} className="t-body text-foreground">
                      {entry}
                    </p>
                  ))}
                </dd>
              </div>
            )}
            {property.address && (
              <div className="sm:col-span-2">
                <dt className="t-meta text-muted-foreground">{t("pd-location-title")}</dt>
                <dd className="t-body text-foreground mt-1">{property.address}</dd>
              </div>
            )}
          </dl>

          <div className="mt-md">
            <SurroundingsMap
              latitude={property.latitude}
              longitude={property.longitude}
              address={property.address}
              label={property.location}
            />
          </div>
        </Section>

        {/* Similar homes — our own cards, not a fourth outside pattern. */}
        {similar.length > 0 && (
          <Section size="md">
            <p className="t-tag text-accent-strong">{t("pd-similar-eyebrow")}</p>
            <h2 className="t-section text-foreground mt-3 mb-lg">{t("pd-similar-heading")}</h2>
            <Grid cols={3} gap="md">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </Grid>
          </Section>
        )}

        {/* One line for owners at the very bottom, and nothing more
            (docs/seo/01_IMPLEMENTATION.md D3). Everything above it is for the
            guest — owner language in the guest part of the page is this
            project's historical main mistake. */}
        <Section size="sm">
          <p className="t-body text-muted-foreground border-t border-border pt-sm flex flex-wrap items-center gap-x-2 gap-y-1">
            {t("vr-owner-bridge").replace("{place}", placeLabel)}
            <Link
              to="/property-management"
              className="inline-flex items-center gap-1.5 text-accent-strong font-semibold hover:gap-2.5 transition-all"
            >
              {t("vr-owner-bridge-link")}
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </p>
        </Section>
      </main>

      <Footer />

      {/* Booking Summary Dialog — the quote, the Stripe card field and the
          fallback inquiry path all live in here, unchanged. */}
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
