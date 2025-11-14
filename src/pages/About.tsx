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
      <main className="flex-1">
        {/* Hero Section with Glowing Background */}
        <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-beige via-secondary to-beige-dark">
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM1YTY5NTkiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] animate-pulse"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 animate-fade-in">
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-primary mb-6">About Frontier Residences</h1>
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
              Premier property management across Europe's most desirable locations
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">

          {/* Mission */}
          <div className="max-w-5xl mx-auto mb-16">
            <Card className="shadow-elegant border-primary/20">
              <CardContent className="pt-6">
                <h2 className="font-playfair text-3xl font-semibold text-primary mb-6 text-center">Our Mission</h2>
                <p className="text-lg text-foreground/80 leading-relaxed text-center max-w-3xl mx-auto">
                  Transform property ownership into effortless elegance through bespoke management.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Why Choose Us */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="font-playfair text-3xl font-semibold text-primary mb-8 text-center">Why Choose Us</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {whyChoose.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-5 bg-card rounded-lg shadow-sm hover:shadow-elegant transition-all">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="font-playfair text-3xl font-semibold text-primary mb-12 text-center">Leadership</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-elegant hover:shadow-soft transition-all">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-gradient-sage rounded-full mx-auto mb-6"></div>
                  <h3 className="font-playfair text-2xl font-semibold text-primary text-center mb-2">
                    Lorenz Aschbacher
                  </h3>
                  <p className="text-primary font-medium text-center mb-4">Founder & CEO</p>
                  <p className="text-foreground/80 leading-relaxed text-center">
                    International hospitality and real estate expertise.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant hover:shadow-soft transition-all">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-gradient-sage rounded-full mx-auto mb-6"></div>
                  <h3 className="font-playfair text-2xl font-semibold text-primary text-center mb-2">
                    Alejandro Marinetto Rohr
                  </h3>
                  <p className="text-primary font-medium text-center mb-4">Co-Founder & Director</p>
                  <p className="text-foreground/80 leading-relaxed text-center">
                    Real estate strategy, marketing, and design leadership.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* The Listing Process */}
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-3xl font-semibold text-primary mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Assessment",
                  description: "Property evaluation and strategy.",
                },
                {
                  step: "2",
                  title: "Preparation",
                  description: "Photography and listing optimization.",
                },
                {
                  step: "3",
                  title: "Launch",
                  description: "Multi-platform listing and marketing.",
                },
                {
                  step: "4",
                  title: "Management",
                  description: "Guest service and maintenance.",
                },
                {
                  step: "5",
                  title: "Reporting",
                  description: "Transparent performance updates.",
                },
              ].map((item, index) => (
                <Card key={index} className="shadow-sm hover:shadow-elegant transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-lg text-primary mb-2">{item.title}</h3>
                    <p className="text-sm text-foreground/80">{item.description}</p>
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
