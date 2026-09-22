import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";
import property3 from "@/assets/property-3.webp";
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

// "villa-in-higueron", "peninsula-corner-villa-higueron" and
// "puente-romano-hideaway" used to be mapped here too — all three were
// fabricated seed rows with no real Guesty listing behind them (one of them,
// "villa-in-higueron", didn't even match any property that ever existed).
// Deleted from the database on 2026-08-20 (docs/DECISIONS.md §27); the image
// imports went with them since nothing else referenced those files.
const propertyImages: Record<string, string> = {
  // Real photo from the "Los Monteros 3 bed Diana" Drive folder.
  "los-monteros-retreat": losMonterosCard,
};

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [searchParams] = useSearchParams();
  const { convertPrice, currencySymbol, t } = useLocale();
  const [index, setIndex] = useState(0);

  // Guesty's own photographs when the import brought any, otherwise the one
  // hard-coded fallback, otherwise the house-style stand-in.
  const guestyImages = (property.images ?? []).map((img) => img.url).filter(Boolean);
  const images =
    guestyImages.length > 0 ? guestyImages : [propertyImages[property.slug] || property3];
  // Only the frames a visitor has actually reached are in the DOM: a listing
  // with 40 Guesty photos would otherwise put 40 <img> tags on the page for
  // every card in a row of three.
  const loadedUpTo = Math.min(images.length, Math.max(2, index + 2));
  const rendered = images.slice(0, loadedUpTo);

  /**
   * Paging happens inside the card, without leaving the page.
   *
   * The arrows sit inside a <Link>, so every one of them has to stop the
   * click from reaching it — otherwise looking at the second photograph of a
   * house navigates to that house, which is the opposite of what an arrow on
   * an image means.
   */
  const step = (e: React.MouseEvent, delta: 1 | -1) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + delta + images.length) % images.length);
  };

  // Build link with search params if they exist
  const buildLink = () => {
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const location = searchParams.get('location');

    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    // Forwarded so PropertyDetail's "Back to Properties" button can return
    // to the same filtered search instead of a blank /properties page.
    if (location) params.set('location', location);

    const queryString = params.toString();
    return `/property/${property.slug}${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <Link to={buildLink()} className="group block">
      {/* 3:4 and frameless. The card used to be a 4:3 photo inside a rounded,
          shadowed panel; on a white ground that panel reads as a box drawn
          around a picture. The portrait crop is what makes a row of three
          scan as a catalogue rather than as search results. */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        {/* Every photo is stacked, and only the current one is opaque — a
            cross-fade rather than swapping one <img> src, which flashes the
            frame empty for as long as the next file takes to decode. The
            `group-hover` zoom rides on top of the fade, so the two do not
            fight over the same transform. */}
        {rendered.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={i === index ? `${property.name} — ${property.location}` : ""}
            width={600}
            height={800}
            loading={i === 0 ? "lazy" : "eager"}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 w-full h-full object-cover",
              "transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.04]",
              i === index ? "opacity-100" : "opacity-0"
            )}
          />
        ))}

        {images.length > 1 && (
          <>
            {/* Visible on hover on a pointer device, always on touch — a
                control you cannot hover is a control that does not exist. */}
            {([-1, 1] as const).map((delta) => (
              <button
                key={delta}
                type="button"
                onClick={(e) => step(e, delta)}
                aria-label={
                  delta === -1
                    ? `Previous photo of ${property.name}`
                    : `Next photo of ${property.name}`
                }
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 h-9 w-9 rounded-full",
                  "bg-background/85 backdrop-blur-sm text-foreground shadow-sm",
                  "inline-flex items-center justify-center transition-opacity duration-200",
                  "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                  "[@media(hover:none)]:opacity-100",
                  delta === -1 ? "left-3" : "right-3"
                )}
              >
                {delta === -1 ? (
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                ) : (
                  <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                )}
              </button>
            ))}

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.slice(0, 8).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    i === index ? "bg-background" : "bg-background/45"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="pt-4">
        <h3 className="t-card text-foreground group-hover:text-accent-strong transition-colors">
          {property.name}
        </h3>

        <p className="t-body text-muted-foreground mt-1">{property.location}</p>

        <p className="t-body text-muted-foreground mt-0.5">
          {property.guests} {property.guests === 1 ? t("propertycard.guest") : t("propertycard.guests")} ·{" "}
          {property.bedrooms === 0 ? t("propertycard.studio") : `${property.bedrooms} ${property.bedrooms === 1 ? t("propertycard.bedroom") : t("propertycard.bedrooms")}`} ·{" "}
          {property.bathrooms} {property.bathrooms === 1 ? t("propertycard.bathroom") : t("propertycard.bathrooms")}
        </p>

        {/* `price_per_night` is a snapshot matched against a live Guesty quote
            as of `price_last_synced_at` — not the real-time rate for whatever
            dates a visitor has in mind. Every listing prices dynamically, so
            this stays labelled "from" rather than presented as today's rate.
            See docs/PROJECT.md §6 (C4). */}
        <div className="mt-3 pt-3 border-t border-border">
          {property.guesty_listing_id && (
            <span className="t-body text-muted-foreground">{t("propertycard.from")} </span>
          )}
          <span className="t-item text-foreground">
            {currencySymbol}
            {convertPrice(property.price_per_night)}
          </span>
          <span className="t-body text-muted-foreground"> {t("propertycard.perNight")}</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
