import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";
import { propertyPath } from "@/lib/propertyUrl";
import { findVacationRentalCity, vrKey } from "@/lib/vacationRentals";
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
  /** Frontier's own URL and place (docs/PROJECT.md, "Redaktionelle Felder"). */
  seo_slug?: string | null;
  city_group?: string | null;
  images?: Array<{ url: string; caption?: string }>;
}

export type PropertyCardVariant = "default" | "feature" | "row" | "stacked";

interface PropertyCardProps {
  property: Property;
  /**
   * "default" is the 3:4 catalogue card used on /properties and the location
   * pages. The other three are the landing page's "Our homes" grid (Almedin,
   * 07.10.2026, the Lovable reference): 4:3 photo, the price as a gold tag on
   * the photograph, place above the name — `feature` is the big one, `row`
   * puts the photo beside the text from `lg`, `stacked` is the plain small one.
   */
  variant?: PropertyCardVariant;
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

const PropertyCard = ({ property, variant = "default" }: PropertyCardProps) => {
  const editorial = variant !== "default";
  const [searchParams] = useSearchParams();
  const { convertPrice, currencySymbol, t } = useLocale();
  const [index, setIndex] = useState(0);

  // The card's own place label, not Guesty's raw `location` (Almedin,
  // 02.10.2026): three Marbella-area homes come from Guesty tagged
  // `Málaga` (the province) or `Río Real`, which a card then showed
  // verbatim even on the Marbella page listing them. `city_group` is the
  // one field Frontier assigns by hand and the import never touches
  // (docs/PROJECT.md, "Redaktionelle Felder") — same derivation
  // PropertyDetail.tsx's `placeLabel` already uses, so the two never
  // disagree about what a home is called. Falls back to the raw value only
  // for a property with no group yet.
  const city = findVacationRentalCity(property.city_group ?? undefined);
  const displayLocation = city ? t(vrKey(city.slug, "name")) : property.location;

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
    return `${propertyPath(property)}${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <Link
      to={buildLink()}
      className={cn(
        "group block",
        variant === "row" && "grid grid-cols-[42%_1fr] gap-5 md:grid-cols-1 lg:grid-cols-[48%_1fr]"
      )}
    >
      {/* 3:4 and frameless. The card used to be a 4:3 photo inside a rounded,
          shadowed panel; on a white ground that panel reads as a box drawn
          around a picture. The portrait crop is what makes a row of three
          scan as a catalogue rather than as search results. */}
      <div
        className={cn(
          "relative overflow-hidden bg-secondary",
          editorial ? "aspect-[4/3]" : "aspect-[3/4]"
        )}
      >
        {/* Every photo is stacked, and only the current one is opaque — a
            cross-fade rather than swapping one <img> src, which flashes the
            frame empty for as long as the next file takes to decode. The
            `group-hover` zoom rides on top of the fade, so the two do not
            fight over the same transform. */}
        {rendered.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={i === index ? `${property.name} — ${displayLocation}` : ""}
            width={600}
            height={800}
            /* Every frame is lazy, including the visible one. Cards sit
               below the fold on both the landing page and the results grid;
               the browser fetches the ones near the viewport immediately and
               leaves the rest until they are scrolled towards. This used to
               read `i === 0 ? "lazy" : "eager"`, which was backwards — it
               deferred the photo on screen and eagerly fetched the invisible
               preload stacked behind it. */
            loading="lazy"
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 w-full h-full object-cover",
              "transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.04]",
              i === index ? "opacity-100" : "opacity-0"
            )}
          />
        ))}

        {/* The price rides on the photograph in the editorial cards, so the
            text block below can drop its price row. Same rule as the default
            card: only labelled "from" when the rate is Guesty's, never "the
            price" (docs/PROJECT.md §6, C4). */}
        {editorial && (
          <span className="t-meta absolute left-0 top-0 z-10 bg-accent px-3 py-1.5 text-accent-foreground">
            {property.guesty_listing_id && `${t("propertycard.from")} `}
            {currencySymbol}
            {convertPrice(property.price_per_night)}
            <span className="font-normal normal-case tracking-normal opacity-75"> {t("propertycard.perNight")}</span>
          </span>
        )}

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

      <div className={cn(editorial ? (variant === "row" ? "pt-1" : "pt-5") : "pt-4")}>
        {editorial && <p className="t-tag text-accent-strong">{displayLocation}</p>}

        <h3
          className={cn(
            "text-foreground group-hover:text-accent-strong transition-colors",
            editorial && "mt-2",
            variant === "feature"
              ? "t-section font-semibold uppercase leading-tight"
              : cn("t-card", editorial && "font-semibold leading-tight")
          )}
        >
          {property.name}
        </h3>

        {!editorial && <p className="t-body text-muted-foreground mt-1">{displayLocation}</p>}

        <p className={cn("t-body text-muted-foreground", editorial ? "mt-2" : "mt-0.5")}>
          {property.guests} {property.guests === 1 ? t("propertycard.guest") : t("propertycard.guests")} ·{" "}
          {property.bedrooms === 0 ? t("propertycard.studio") : `${property.bedrooms} ${property.bedrooms === 1 ? t("propertycard.bedroom") : t("propertycard.bedrooms")}`} ·{" "}
          {property.bathrooms} {property.bathrooms === 1 ? t("propertycard.bathroom") : t("propertycard.bathrooms")}
        </p>

        {/* `price_per_night` is a snapshot matched against a live Guesty quote
            as of `price_last_synced_at` — not the real-time rate for whatever
            dates a visitor has in mind. Every listing prices dynamically, so
            this stays labelled "from" rather than presented as today's rate.
            See docs/PROJECT.md §6 (C4). */}
        {!editorial && (
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
        )}
      </div>
    </Link>
  );
};

export default PropertyCard;
