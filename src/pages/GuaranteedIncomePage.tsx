import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { 
  Wallet, ShieldCheck, Wrench, Paintbrush, Cpu, Check 
} from "lucide-react";

const GuaranteedIncomePage = () => {
  const benefits = [
    { icon: Wallet, title: "Predictable monthly earnings", description: "Receive a fixed payment every month, regardless of bookings or occupancy rates." },
    { icon: ShieldCheck, title: "Zero vacancy risk", description: "No more worrying about empty periods — your income is guaranteed." },
    { icon: Wrench, title: "Professional upkeep", description: "We maintain your property to the highest standards, protecting its long-term value." },
    { icon: Paintbrush, title: "Optional interior upgrades", description: "We can invest in design improvements to enhance your property's appeal." },
    { icon: Cpu, title: "AI-enhanced pricing & premium guest standards", description: "For hybrid models, benefit from our advanced technology and hospitality expertise." },
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
                Effortless Ownership. Guaranteed Monthly Income.
              </h1>
              <p className="text-xl text-foreground/80 leading-relaxed max-w-3xl mx-auto">
                Our Guaranteed Income Program is ideal for homeowners seeking financial stability. We lease your property long-term, guaranteeing a fixed monthly payment — regardless of occupancy.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <p className="text-lg text-foreground/80 leading-relaxed">
                Frontier Residences manages, maintains, and enhances your property while you enjoy stress-free income.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
                Program Benefits
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <Card key={index} className="p-8 hover:shadow-elegant transition-all duration-300 text-center">
                      <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon className="w-8 h-8 text-accent" />
                      </div>
                      <h3 className="font-playfair text-xl font-semibold text-primary mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-foreground/70">{benefit.description}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-playfair text-3xl font-bold text-primary mb-6">
                Ready for Stress-Free Income?
              </h2>
              <p className="text-lg text-foreground/80 mb-8">
                Contact us to learn how our Guaranteed Income Program can work for your property.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GuaranteedIncomePage;
