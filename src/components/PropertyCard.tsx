import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Bed, Bath, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import property2 from "@/assets/property-2.png";
import property3 from "@/assets/property-3.png";
import property4 from "@/assets/property-4.png";
import villaHigueron from "@/assets/villa-higueron.png";

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
  "los-monteros-retreat": property3,
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
      className="group block"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-elegant">
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden relative">
          <img 
            src={imageUrl} 
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {property.featured && (
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-playfair text-2xl text-primary mb-2 group-hover:text-foreground transition-colors">
            {property.name}
          </h3>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{property.location}</span>
          </div>

          <div className="flex items-center gap-6 mb-6 text-foreground/70">
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4" />
              <span className="text-sm">{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-4 h-4" />
              <span className="text-sm">{property.bathrooms} baths</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">{property.guests} guests</span>
            </div>
          </div>

          {/* `price_per_night` is the base rate Guesty held when the property
              was imported, not today's price — every listing here prices
              dynamically, so the stored figure is an indication and is labelled
              as one. The detail page already says "Live pricing" rather than a
              number; the cards were the only place still presenting a frozen
              snapshot as the rate. A cached lowest live rate would let this show
              a real number again. */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              {property.guesty_listing_id && (
                <span className="text-muted-foreground text-sm">from </span>
              )}
              <span className="text-2xl font-bold text-primary">€{property.price_per_night}</span>
              <span className="text-muted-foreground text-sm"> / night</span>
            </div>
            <span className="text-sm text-primary group-hover:underline">View Details →</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PropertyCard;
