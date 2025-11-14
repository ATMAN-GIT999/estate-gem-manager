import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import property1 from "@/assets/property-1.png";
import property2 from "@/assets/property-2.png";
import property3 from "@/assets/property-3.png";
import property4 from "@/assets/property-4.png";
import villaHigueron from "@/assets/villa-higueron.png";

interface Property {
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
  const imageUrl = propertyImages[property.slug] || property1;

  return (
    <Link 
      to={`/property/${property.slug}`} 
      className="group block"
    >
      <div className="overflow-hidden transition-all duration-300 hover:shadow-2xl border border-border bg-card">
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

          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <span className="text-2xl font-bold text-primary">€{property.price_per_night}</span>
              <span className="text-muted-foreground text-sm"> / night</span>
            </div>
            <span className="text-sm text-primary group-hover:underline">View Details →</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
