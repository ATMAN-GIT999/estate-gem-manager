import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { 
  Lightbulb, Calculator, HardHat, Package, Palette, Camera, TrendingUp 
} from "lucide-react";

const RenovationsPage = () => {
  const services = [
    { icon: Lightbulb, title: "Architectural concept & mood boards", description: "We create inspiring visual concepts that capture the Mediterranean essence." },
    { icon: Calculator, title: "Budget planning", description: "Transparent cost estimation and financial planning for your project." },
    { icon: HardHat, title: "Renovation management", description: "End-to-end project oversight ensuring quality and timely delivery." },
    { icon: Package, title: "Material & furniture sourcing", description: "Curated selection of premium materials and furnishings." },
    { icon: Palette, title: "Full interior design", description: "Complete design solutions from layout to final styling." },
    { icon: Camera, title: "Styling & photography", description: "Professional staging and photography to showcase your property." },
    { icon: TrendingUp, title: "Rental optimisation post-renovation", description: "Maximise your return with strategic positioning and pricing." },
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
                Timeless Mediterranean Interiors. Elevated Asset Value.
              </h1>
              <p className="text-xl text-foreground/80 leading-relaxed max-w-3xl mx-auto">
                Our renovation and design team transforms properties into refined, contemporary Mediterranean spaces. We oversee the entire process with a focus on craftsmanship, functionality, and increased rental performance.
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
                What We Handle
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <Card key={index} className="p-6 hover:shadow-elegant transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="w-7 h-7 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary text-lg mb-2">{service.title}</h3>
                          <p className="text-foreground/70">{service.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-8">
                Our Process
              </h2>
              <div className="flex flex-wrap justify-center items-center gap-4 text-lg text-foreground/80">
                <span className="font-semibold text-accent">Concept</span>
                <span className="text-accent">→</span>
                <span className="font-semibold text-accent">Construction</span>
                <span className="text-accent">→</span>
                <span className="font-semibold text-accent">Delivery</span>
                <span className="text-accent">→</span>
                <span className="font-semibold text-accent">Staging</span>
              </div>
              <p className="mt-8 text-foreground/70 max-w-2xl mx-auto">
                From initial concept to final staging, we manage every detail to ensure your property reaches its full potential.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RenovationsPage;
