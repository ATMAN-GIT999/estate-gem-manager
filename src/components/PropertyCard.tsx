import { Link, useSearchParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import property2 from "@/assets/property-2.webp";
import property3 from "@/assets/property-3.webp";
import property4 from "@/assets/property-4.webp";
import villaHigueron from "@/assets/villa-higueron.webp";
import losMonterosCard from "@/assets/los-monteros-card.webp";

export interface Property {
  id: string;
  name: string;
  slug: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  price_per_night: number;
  featured: boolean;
  type: string;
  /** Present when rates come from Guesty and move with dates. */
  guesty_listing_id?: string | null;
  images?: Array<{ url: string; caption?: string }>;
}

interface PropertyCardProps {
  property: Property;
}

const propertyImages: Record<string, string> = {
  "villa-in-higueron": villaHigueron,
  "peninsula-corner-villa-higueron": property2,
  // Used to fall back to property3 — the exact photo villa-in-higueron uses
  // above, so two different villas showed the same room. Now its own real
  // photo from the "Los Monteros 3 bed Diana" Drive folder.
  "los-monteros-retreat": losMonterosCard,
  "puente-romano-hideaway": property4,
};

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [searchParams] = useSearchParams();
  
  // Use Guesty images if available, otherwise fall back to hardcoded images
  const guestyImage = property.images?.[0]?.url;
  const imageUrl = guestyImage || propertyImages[property.slug] || property3;

  // Build link with search params if they exist
  const buildLink = () => {
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    
    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    
    const queryString = params.toString();
    return `/property/${property.slug}${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <Link
      to={buildLink()}
      className="group block overflow-hidden rounded-xl bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Flush with the card's own edges — no padding ring around the photo,
          `overflow-hidden` on the card clips its top corners to match. */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={imageUrl}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {property.featured && (
          <Badge className="absolute top-4 right-4 bg-background/90 text-primary backdrop-blur-sm">
            Featured
          </Badge>
        )}
      </div>

      <div className="px-4 pt-5 pb-5">
        <h3 className="t-item text-primary mb-1 group-hover:text-accent-strong transition-colors">
          {property.name}
        </h3>

        <div className="flex items-center gap-1.5 text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span className="t-meta">{property.location}</span>
        </div>

        <p className="mb-3 text-foreground/60 t-body">
          {property.guests} {property.guests === 1 ? "guest" : "guests"} · {property.bedrooms} {property.bedrooms === 1 ? "bedroom" : "bedrooms"} · {property.bathrooms} {property.bathrooms === 1 ? "bath" : "baths"}
        </p>

        {/* `price_per_night` is a snapshot matched against a live Guesty quote
            as of `price_last_synced_at` (20 of 23 listings, 2026-08-13) —
            not the real-time rate for whatever dates a visitor actually has in
            mind. Every listing here prices dynamically, so this is still
            labelled "from" rather than presented as today's rate. Three
            listings (Los Monteros Retreat, Luxury Escape Los Flamingos Golf
            Retreat, THE ONE Higuerón) came back "not available" on every
            window tried and were left untouched — `price_last_synced_at` is
            NULL for those, so nobody mistakes the old value for a checked one.
            A scheduled sync job is the real fix; see docs/PROJECT.md §6 (C4). */}
        <div>
          {property.guesty_listing_id && (
            <span className="t-meta text-muted-foreground">from </span>
          )}
          {/* Display rounding only — Math.ceil, not the value itself. A price
              with cents (from a live Guesty quote snapshot) reads as more
              precise than a "from" figure should; the underlying
              `price_per_night`, the sync job and the booking-flow quote are
              untouched. */}
          <span className="t-item text-primary">€{Math.ceil(property.price_per_night)}</span>
          <span className="t-meta text-muted-foreground"> / night</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
