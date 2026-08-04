import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Search, BarChart3, Handshake, HardHat, Settings, MapPin } from "lucide-react";
import EditableText from "@/components/admin/EditableText";
import PageWrapper from "@/components/PageWrapper";

const InvestmentsPageContent = () => {
  const [pageTitle, setPageTitle] = useState("Curated Real Estate Investments Across Europe");
  const [pageSubtitle, setPageSubtitle] = useState("We connect investors with high-performing opportunities in Spain, Austria, and Croatia. Frontier Residences manages every step: acquisition, evaluation, renovation, and turnkey rental operations.");
  const [servicesTitle, setServicesTitle] = useState("Our Investment Services");
  const [destinationsTitle, setDestinationsTitle] = useState("Investment Destinations");

  const iconMap: Record<string, any> = { Search, BarChart3, Handshake, HardHat, Settings };

  const [services, setServices] = useState([
    { icon: "Search", title: "Market research & due diligence", description: "Comprehensive analysis of opportunities and risk assessment." },
    { icon: "BarChart3", title: "Revenue & ROI analysis", description: "Detailed financial projections and return calculations." },
    { icon: "Handshake", title: "Purchase coordination", description: "Full support through the acquisition process." },
    { icon: "HardHat", title: "Renovation strategy", description: "Value-add improvements to maximise property potential." },
    { icon: "Settings", title: "Full operational management", description: "Turnkey rental operations from day one." },
  ]);

  const [locations, setLocations] = useState([
    { country: "Spain", region: "Costa del Sol", description: "Luxury villas and apartments in Europe's premier coastal destination." },
    { country: "Austria", region: "Vienna & Carinthia", description: "Urban elegance and Alpine retreats with strong rental demand." },
    { country: "Croatia", region: "Istria", description: "Emerging Mediterranean gem with exceptional growth potential." },
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <EditableText id="inv-page-title" value={pageTitle} onChange={setPageTitle} as="h1" className="font-playfair text-4xl md:text-6xl font-bold text-primary mb-6">{pageTitle}</EditableText>
              <EditableText id="inv-page-subtitle" value={pageSubtitle} onChange={setPageSubtitle} as="p" multiline className="text-xl text-foreground/80 leading-relaxed max-w-3xl mx-auto">{pageSubtitle}</EditableText>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <EditableText id="inv-services-title" value={servicesTitle} onChange={setServicesTitle} as="h2" className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-12 text-center">{servicesTitle}</EditableText>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => {
                  const Icon = iconMap[service.icon] || Settings;
                  return (
                    <Card key={index} className="p-6 hover:shadow-elegant transition-all duration-300">
                      <div className="w-14 h-14 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-7 h-7 text-accent-strong" />
                      </div>
                      <EditableText
                        id={`inv-service-title-${index}`}
                        value={service.title}
                        onChange={(v) => { const u = [...services]; u[index] = { ...u[index], title: v }; setServices(u); }}
                        as="h3"
                        className="font-semibold text-primary text-lg mb-2"
                      >{service.title}</EditableText>
                      <EditableText
                        id={`inv-service-desc-${index}`}
                        value={service.description}
                        onChange={(v) => { const u = [...services]; u[index] = { ...u[index], description: v }; setServices(u); }}
                        as="p"
                        className="text-foreground/70"
                      >{service.description}</EditableText>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <EditableText id="inv-destinations-title" value={destinationsTitle} onChange={setDestinationsTitle} as="h2" className="font-playfair text-3xl md:text-4xl font-bold mb-12 text-center">{destinationsTitle}</EditableText>
              <div className="grid md:grid-cols-3 gap-8">
                {locations.map((location, index) => (
                  <Card key={index} className="p-8 bg-primary-foreground/10 border-primary-foreground/20 text-center">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-6 h-6 text-accent-on-primary" />
                    </div>
                    <EditableText
                      id={`inv-loc-country-${index}`}
                      value={location.country}
                      onChange={(v) => { const u = [...locations]; u[index] = { ...u[index], country: v }; setLocations(u); }}
                      as="h3"
                      className="font-playfair text-2xl font-bold text-primary-foreground mb-2"
                    >{location.country}</EditableText>
                    <EditableText
                      id={`inv-loc-region-${index}`}
                      value={location.region}
                      onChange={(v) => { const u = [...locations]; u[index] = { ...u[index], region: v }; setLocations(u); }}
                      as="p"
                      className="text-accent-on-primary font-medium mb-4"
                    >{location.region}</EditableText>
                    <EditableText
                      id={`inv-loc-desc-${index}`}
                      value={location.description}
                      onChange={(v) => { const u = [...locations]; u[index] = { ...u[index], description: v }; setLocations(u); }}
                      as="p"
                      className="text-primary-foreground/80"
                    >{location.description}</EditableText>
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

const InvestmentsPage = () => (<PageWrapper slug="site--investments"><InvestmentsPageContent /></PageWrapper>);
export default InvestmentsPage;
