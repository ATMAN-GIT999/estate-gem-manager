import { Building2, TrendingUp, Wrench, BarChart3, ArrowRight, Check, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BusinessAreasProps {
  showHeader?: boolean;
}

const BusinessAreas = ({ showHeader = true }: BusinessAreasProps) => {
  const propertyManagementServices = [
    "Architectural photography & luxury staging",
    "High-converting listings (Airbnb, Booking, & direct)",
    "24/7 guest communication & personalised check-ins",
    "Legal traveller registration & compliance",
    "Dynamic pricing & revenue optimisation",
    "Housekeeping, maintenance & inspections",
    "Transparent monthly financial reporting",
  ];

  const additionalServices = [
    {
      icon: Wrench,
      title: "Renovations & Design",
      description: "Timeless Mediterranean interiors designed to elevate your home's value and rental performance.",
      details: "We manage the full process: concept → construction → delivery → staging.",
      href: "/renovations",
    },
    {
      icon: BarChart3,
      title: "Investments",
      description: "Curated real estate investments across Spain, Austria, and Croatia.",
      details: "We guide investors from acquisition to renovation and turnkey operations.",
      href: "/investments",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        {showHeader && (
          <div className="text-center mb-16 animate-fade-in">
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

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Property Management - Full Width Hero Banner */}
          <div className="group relative">
            <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-primary/90 overflow-hidden shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative p-8 md:p-12 lg:p-16">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                  {/* Left content */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                      <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      <span className="text-white/90 text-sm font-medium">Our Core Service</span>
                    </div>
                    
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                          Property Management
                        </h3>
                        <p className="text-xl text-white/80 font-medium">
                          Bespoke management for villas and luxury residences
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
                      We manage your home with the precision, discretion, and hospitality of a world-class boutique hotel — maximising revenue while preserving your asset.
                    </p>

                    {/* Guaranteed Income Feature */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-white font-semibold text-lg">Guaranteed Income Program</h4>
                            <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs font-medium rounded-full">Included</span>
                          </div>
                          <p className="text-white/70 text-sm leading-relaxed">
                            Effortless ownership with a fixed monthly payment. We lease your property long-term, guaranteeing steady income regardless of occupancy — while maintaining and improving your home.
                          </p>
                          <Link to="/guaranteed-income" className="inline-flex items-center gap-1 text-accent text-sm font-medium mt-3 hover:gap-2 transition-all">
                            Learn more <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    <Link to="/property-management">
                      <Button 
                        size="lg"
                        className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold px-8"
                      >
                        Discover Our Services
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Right content - Services */}
                  <div className="lg:w-[380px] flex-shrink-0">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <h4 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-accent" />
                        What's Included
                      </h4>
                      <ul className="space-y-4">
                        {propertyManagementServices.map((service, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-accent" />
                            </div>
                            <span className="text-white/80 text-sm">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Services - Two Column Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="group relative"
                >
                  <div className="relative h-full rounded-2xl bg-card border border-border/50 overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-accent/30">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Decorative corner accent */}
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors duration-500" />
                    
                    <div className="relative p-8">
                      {/* Icon */}
                      <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-playfair text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                        {service.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-accent font-medium mb-3">
                        {service.description}
                      </p>
                      
                      {/* Details */}
                      <p className="text-foreground/70 leading-relaxed mb-6">
                        {service.details}
                      </p>
                      
                      {/* CTA Button */}
                      <Link to={service.href}>
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
      </div>
    </section>
  );
};

export default BusinessAreas;
