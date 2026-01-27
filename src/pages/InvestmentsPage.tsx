import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { 
  Search, BarChart3, Handshake, HardHat, Settings, MapPin 
} from "lucide-react";
import EditableText from "@/components/admin/EditableText";

const InvestmentsPage = () => {
  // Editable content state
  const [pageTitle, setPageTitle] = useState("Curated Real Estate Investments Across Europe");
  const [pageSubtitle, setPageSubtitle] = useState("We connect investors with high-performing opportunities in Spain, Austria, and Croatia. Frontier Residences manages every step: acquisition, evaluation, renovation, and turnkey rental operations.");
  const [servicesTitle, setServicesTitle] = useState("Our Investment Services");
  const [destinationsTitle, setDestinationsTitle] = useState("Investment Destinations");

  const services = [
    { icon: Search, title: "Market research & due diligence", description: "Comprehensive analysis of opportunities and risk assessment." },
    { icon: BarChart3, title: "Revenue & ROI analysis", description: "Detailed financial projections and return calculations." },
    { icon: Handshake, title: "Purchase coordination", description: "Full support through the acquisition process." },
    { icon: HardHat, title: "Renovation strategy", description: "Value-add improvements to maximise property potential." },
    { icon: Settings, title: "Full operational management", description: "Turnkey rental operations from day one." },
  ];

  const locations = [
    { country: "Spain", region: "Costa del Sol", description: "Luxury villas and apartments in Europe's premier coastal destination." },
    { country: "Austria", region: "Vienna & Carinthia", description: "Urban elegance and Alpine retreats with strong rental demand." },
    { country: "Croatia", region: "Istria", description: "Emerging Mediterranean gem with exceptional growth potential." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <EditableText
                id="inv-page-title"
                value={pageTitle}
                onChange={setPageTitle}
                as="h1"
                className="font-playfair text-4xl md:text-6xl font-bold text-primary mb-6"
              >
                {pageTitle}
              </EditableText>
              <EditableText
                id="inv-page-subtitle"
                value={pageSubtitle}
                onChange={setPageSubtitle}
                as="p"
                multiline
                className="text-xl text-foreground/80 leading-relaxed max-w-3xl mx-auto"
              >
                {pageSubtitle}
              </EditableText>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <EditableText
                id="inv-services-title"
                value={servicesTitle}
                onChange={setServicesTitle}
                as="h2"
                className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-12 text-center"
              >
                {servicesTitle}
              </EditableText>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <Card key={index} className="p-6 hover:shadow-elegant transition-all duration-300">
                      <div className="w-14 h-14 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-7 h-7 text-accent" />
                      </div>
                      <h3 className="font-semibold text-primary text-lg mb-2">{service.title}</h3>
                      <p className="text-foreground/70">{service.description}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <EditableText
                id="inv-destinations-title"
                value={destinationsTitle}
                onChange={setDestinationsTitle}
                as="h2"
                className="font-playfair text-3xl md:text-4xl font-bold mb-12 text-center"
              >
                {destinationsTitle}
              </EditableText>
              <div className="grid md:grid-cols-3 gap-8">
                {locations.map((location, index) => (
                  <Card key={index} className="p-8 bg-primary-foreground/10 border-primary-foreground/20 text-center">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-playfair text-2xl font-bold text-primary-foreground mb-2">
                      {location.country}
                    </h3>
                    <p className="text-accent font-medium mb-4">{location.region}</p>
                    <p className="text-primary-foreground/80">{location.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default InvestmentsPage;