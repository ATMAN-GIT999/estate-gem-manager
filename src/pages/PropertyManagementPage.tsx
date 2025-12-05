import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { 
  Camera, Globe, MessageSquare, Users, TrendingUp, Sparkles, 
  Wrench, LayoutDashboard, FileCheck, Cpu, Check 
} from "lucide-react";

const PropertyManagementPage = () => {
  const services = [
    { icon: Camera, text: "Luxury photography & staging" },
    { icon: Globe, text: "Listings on top global booking channels" },
    { icon: MessageSquare, text: "24/7 guest communication" },
    { icon: Users, text: "Personal or remote check-ins" },
    { icon: TrendingUp, text: "Dynamic pricing algorithm" },
    { icon: Sparkles, text: "Professional housekeeping" },
    { icon: Wrench, text: "Preventive maintenance & inspections" },
    { icon: LayoutDashboard, text: "Owner portal with real-time reporting" },
    { icon: FileCheck, text: "Legal traveller registration & compliance" },
  ];

  const aiFeatures = [
    "Real-time Airbnb & hotel price analysis",
    "Automated rate adjustments (multiple times daily)",
    "AI-supported guest messaging in all languages",
    "Predictive maintenance alerts",
    "Smart cleaning and task automation",
    "Algorithm-based reviews and feedback management",
  ];

  const benefits = [
    "Higher occupancy",
    "Better nightly rates",
    "Faster responses",
    "Zero operational gaps",
    "Increased long-term value",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="font-playfair text-4xl md:text-6xl font-bold text-primary mb-6">
                Luxury Property Management Designed for Exceptional Homes
              </h1>
              <p className="text-xl text-foreground/80 leading-relaxed">
                We deliver a personalised management plan for every property — combining hotel-level hospitality with advanced AI-driven systems to maximise revenue, elevate guest satisfaction, and protect the long-term value of your home.
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
                Our Services
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <Card key={index} className="p-6 hover:shadow-elegant transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <p className="text-foreground/90 font-medium pt-2">{service.text}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* AI & Technology Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-6">
                  <Cpu className="w-8 h-8 text-accent" />
                </div>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
                  AI-Driven Hospitality & Operations
                </h2>
                <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto">
                  Frontier Residences uses state-of-the-art technology to deliver consistent, precise performance.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 mt-12">
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-accent">Our systems use:</h3>
                  <ul className="space-y-4">
                    {aiFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-accent mt-1">•</span>
                        <span className="text-primary-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-6 text-accent">This ensures:</h3>
                  <ul className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-accent shrink-0" />
                        <span className="text-primary-foreground/90">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyManagementPage;
