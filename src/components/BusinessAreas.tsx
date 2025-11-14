import { Building2, TrendingUp, Wrench, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const BusinessAreas = () => {
  const areas = [
    {
      icon: Building2,
      title: "Property Management",
      description: "Seamless Property Management Services",
      details:
        "We handle every aspect of property management, from professional photography and staging to guest communication, legal compliance, and dynamic pricing. Maximize your profits while we take care of everything.",
    },
    {
      icon: TrendingUp,
      title: "Guaranteed Income",
      description: "Secure and Reliable Rental Income",
      details:
        "Enjoy peace of mind with our guaranteed income program. Receive fixed monthly payments regardless of occupancy while we invest in maintaining and enhancing your property's value.",
    },
    {
      icon: Wrench,
      title: "Renovations & Design",
      description: "Transforming Properties for Your Vision",
      details:
        "From simple updates to complete overhauls, our expert team handles all aspects of renovation and project management, maximizing your property's appeal and value.",
    },
    {
      icon: BarChart3,
      title: "Strategic Investments",
      description: "Expert Consultancy for Property Investments",
      details:
        "We guide investors in finding perfect opportunities across Spain, Austria, and Croatia. From acquisition to completion, we provide end-to-end consultancy for profitable investments.",
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
                className="group hover:shadow-elegant transition-all duration-500 cursor-pointer border-border hover:border-accent"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-gold rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-gold">
                    <Icon className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="font-playfair text-2xl text-primary">{area.title}</CardTitle>
                  <CardDescription className="text-lg font-medium text-accent">{area.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed">{area.details}</p>
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
