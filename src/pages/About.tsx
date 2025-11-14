import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const About = () => {
  const whyChoose = [
    "Tailored management plans for each property",
    "International presence across Spain, Austria, and Croatia",
    "Transparent communication and detailed owner reporting",
    "End-to-end services from renovation to rental management",
    "Hotel-level hospitality with real estate expertise",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6">About Frontier Residences</h1>
            <p className="text-xl text-foreground/80 leading-relaxed">
              We are a premier property management and investment firm specializing in exclusive villas and residences across
              Europe's most desirable locations.
            </p>
          </div>

          {/* Mission */}
          <div className="max-w-5xl mx-auto mb-20">
            <Card className="shadow-elegant border-accent/20">
              <CardContent className="pt-6">
                <h2 className="font-playfair text-3xl font-semibold text-primary mb-6 text-center">Our Mission</h2>
                <p className="text-lg text-foreground/80 leading-relaxed text-center max-w-3xl mx-auto">
                  To transform property ownership into effortless elegance by delivering bespoke management experiences that
                  maximize value, performance, and peace of mind for discerning homeowners and investors.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Why Choose Us */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="font-playfair text-3xl font-semibold text-primary mb-8 text-center">Why Choose Frontier Residences</h2>
            <div className="space-y-4">
              {whyChoose.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-card rounded-lg shadow-sm hover:shadow-elegant transition-all">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <p className="text-lg text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="max-w-5xl mx-auto">
            <h2 className="font-playfair text-3xl font-semibold text-primary mb-12 text-center">Meet Our Leadership</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-elegant hover:shadow-gold transition-all">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-gradient-gold rounded-full mx-auto mb-6"></div>
                  <h3 className="font-playfair text-2xl font-semibold text-primary text-center mb-2">
                    Lorenz Aschbacher
                  </h3>
                  <p className="text-accent font-medium text-center mb-4">Founder & CEO</p>
                  <p className="text-foreground/80 leading-relaxed">
                    With a distinguished background in international hospitality and real estate development, Lorenz leads
                    Frontier Residences with a commitment to precision, excellence, and exceptional client service.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant hover:shadow-gold transition-all">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-gradient-gold rounded-full mx-auto mb-6"></div>
                  <h3 className="font-playfair text-2xl font-semibold text-primary text-center mb-2">
                    Alejandro Marinetto Rohr
                  </h3>
                  <p className="text-accent font-medium text-center mb-4">Co-Founder & Director</p>
                  <p className="text-foreground/80 leading-relaxed">
                    Alejandro combines expertise in real estate strategy, digital marketing, and design to position Frontier
                    Residences as a leading Mediterranean property management firm.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* The Listing Process */}
          <div className="max-w-4xl mx-auto mt-20">
            <h2 className="font-playfair text-3xl font-semibold text-primary mb-8 text-center">Our Listing Process</h2>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Property Assessment",
                  description: "We evaluate your property and discuss your goals to create a tailored management strategy.",
                },
                {
                  step: "2",
                  title: "Professional Preparation",
                  description: "Professional photography, staging, and premium descriptions to showcase your property.",
                },
                {
                  step: "3",
                  title: "Multi-Platform Launch",
                  description: "Strategic listing across Airbnb, Booking.com, and our direct booking channels.",
                },
                {
                  step: "4",
                  title: "Active Management",
                  description: "Guest communication, dynamic pricing, maintenance, and quality control.",
                },
                {
                  step: "5",
                  title: "Transparent Reporting",
                  description: "Regular financial reports and performance updates to keep you informed.",
                },
              ].map((item, index) => (
                <Card key={index} className="shadow-sm hover:shadow-elegant transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl text-primary mb-2">{item.title}</h3>
                        <p className="text-foreground/80">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
