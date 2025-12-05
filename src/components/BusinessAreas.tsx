import { Building2, TrendingUp, Wrench, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BusinessAreas = () => {
  const areas = [
    {
      icon: Building2,
      title: "Property Management",
      description: "Bespoke property management for villas and luxury residences.",
      details: "We manage your home with the precision, discretion, and hospitality of a world-class boutique hotel — maximising revenue while preserving your asset.",
      href: "/property-management",
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
      services: [],
    },
    {
      icon: Wrench,
      title: "Renovations & Design",
      description: "Timeless Mediterranean interiors designed to elevate your home's value and rental performance.",
      details: "We manage the full process: concept → construction → delivery → staging.",
      href: "/renovations",
      services: [],
    },
    {
      icon: BarChart3,
      title: "Investments",
      description: "Curated real estate investments across Spain, Austria, and Croatia.",
      details: "We guide investors from acquisition to renovation and turnkey operations.",
      href: "/investments",
      services: [],
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">Our Business Areas</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive services designed to maximize your property's potential
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {areas.map((area, index) => {
            const Icon = area.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-elegant transition-all duration-500 border-border hover:border-accent"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-gold rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-gold">
                    <Icon className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="font-playfair text-2xl text-primary">{area.title}</CardTitle>
                  <CardDescription className="text-lg font-medium text-accent">{area.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed mb-4">{area.details}</p>
                  {area.services && area.services.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {area.services.map((service, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                          <span className="text-accent mt-1">•</span>
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link to={area.href}>
                    <Button variant="outline" className="mt-2 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BusinessAreas;
