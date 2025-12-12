import { Building2, TrendingUp, Wrench, BarChart3, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BusinessAreasProps {
  showHeader?: boolean;
}

const BusinessAreas = ({ showHeader = true }: BusinessAreasProps) => {
  const areas = [
    {
      icon: Building2,
      title: "Property Management",
      description: "Bespoke property management for villas and luxury residences.",
      details: "We manage your home with the precision, discretion, and hospitality of a world-class boutique hotel — maximising revenue while preserving your asset.",
      href: "/property-management",
      gradient: "from-primary/10 via-primary/5 to-transparent",
      iconBg: "bg-primary",
      services: [
        "Architectural photography & luxury staging",
        "High-converting listings (Airbnb, Booking, & direct)",
        "24/7 guest communication & personalised check-ins",
        "Legal traveller registration & compliance",
        "Dynamic pricing & revenue optimisation",
        "Housekeeping, maintenance & inspections",
        "Transparent monthly financial reporting",
      ],
    },
    {
      icon: TrendingUp,
      title: "Guaranteed Income",
      description: "Effortless ownership with a fixed monthly payment.",
      details: "We lease your property long-term, guaranteeing steady income regardless of occupancy — while maintaining and improving your home.",
      href: "/guaranteed-income",
      gradient: "from-accent/15 via-accent/5 to-transparent",
      iconBg: "bg-accent",
      services: [],
    },
    {
      icon: Wrench,
      title: "Renovations & Design",
      description: "Timeless Mediterranean interiors designed to elevate your home's value and rental performance.",
      details: "We manage the full process: concept → construction → delivery → staging.",
      href: "/renovations",
      gradient: "from-secondary/20 via-secondary/10 to-transparent",
      iconBg: "bg-secondary",
      services: [],
    },
    {
      icon: BarChart3,
      title: "Investments",
      description: "Curated real estate investments across Spain, Austria, and Croatia.",
      details: "We guide investors from acquisition to renovation and turnkey operations.",
      href: "/investments",
      gradient: "from-primary/10 via-accent/5 to-transparent",
      iconBg: "bg-primary",
      services: [],
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        {showHeader && (
          <div className="text-center mb-20 animate-fade-in">
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
              Our Expertise
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Business Areas
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Comprehensive services designed to maximize your property's potential
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {areas.map((area, index) => {
            const Icon = area.icon;
            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Card */}
                <div className={`relative h-full rounded-2xl bg-card border border-border/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-accent/30`}>
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${area.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Decorative corner accent */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-500" />
                  
                  <div className="relative p-8 lg:p-10">
                    {/* Icon */}
                    <div className={`w-14 h-14 ${area.iconBg} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-playfair text-2xl lg:text-3xl font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                      {area.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-accent font-medium text-lg mb-4">
                      {area.description}
                    </p>
                    
                    {/* Details */}
                    <p className="text-foreground/70 leading-relaxed mb-6">
                      {area.details}
                    </p>
                    
                    {/* Services list */}
                    {area.services && area.services.length > 0 && (
                      <ul className="space-y-3 mb-8">
                        {area.services.map((service, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                            <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-accent" />
                            </div>
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {/* CTA Button */}
                    <Link to={area.href}>
                      <Button 
                        variant="ghost" 
                        className="group/btn p-0 h-auto text-primary hover:text-accent hover:bg-transparent font-semibold"
                      >
                        Learn More 
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BusinessAreas;
