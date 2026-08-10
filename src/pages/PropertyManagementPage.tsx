import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Camera, Globe, MessageSquare, Users, TrendingUp, Sparkles, Wrench, LayoutDashboard, FileCheck } from "lucide-react";
import EditableText from "@/components/admin/EditableText";
import PageWrapper from "@/components/PageWrapper";
import Stats from "@/components/Stats";
import BusinessAreas from "@/components/BusinessAreas";
import TechnologySection from "@/components/TechnologySection";
import PropertyManagement from "@/components/PropertyManagement";
import PropertyEvaluator from "@/components/PropertyEvaluator";
import AboutMini from "@/components/AboutMini";
import ProjectsSection from "@/components/ProjectsSection";
import OwnerCta from "@/components/OwnerCta";

const PropertyManagementPageContent = () => {
  const [pageTitle, setPageTitle] = useState("Bespoke Property Management");
  // Two sentences where the page used to open with five variations of the same
  // positioning — the hero's own subtitle, both halves of IntroSection, and the
  // Business Areas lead-in. These are the two that say something.
  const [pageLead, setPageLead] = useState("Your home deserves more than management — it deserves care, strategy, and master craftsmanship.");
  const [pageSubtitle, setPageSubtitle] = useState("We manage it with the precision, discretion, and hospitality of a world-class boutique hotel — maximising revenue while preserving your asset.");
  const [servicesTitle, setServicesTitle] = useState("Our Services");

  const iconMap: Record<string, any> = { Camera, Globe, MessageSquare, Users, TrendingUp, Sparkles, Wrench, LayoutDashboard, FileCheck };

  const [services, setServices] = useState([
    { icon: "Camera", text: "Luxury photography & staging" },
    { icon: "Globe", text: "Listings on top global booking channels" },
    { icon: "MessageSquare", text: "24/7 guest communication" },
    { icon: "Users", text: "Personal or remote check-ins" },
    { icon: "TrendingUp", text: "Dynamic pricing algorithm" },
    { icon: "Sparkles", text: "Professional housekeeping" },
    { icon: "Wrench", text: "Preventive maintenance & inspections" },
    { icon: "LayoutDashboard", text: "Owner portal with real-time reporting" },
    { icon: "FileCheck", text: "Legal traveller registration & compliance" },
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <EditableText id="pmp-page-title" value={pageTitle} onChange={setPageTitle} as="h1" className="font-playfair text-4xl md:text-6xl font-bold text-primary mb-6">{pageTitle}</EditableText>
              <EditableText id="pmp-page-lead" value={pageLead} onChange={setPageLead} as="p" multiline className="font-playfair text-2xl md:text-3xl text-primary leading-snug text-balance mb-5">{pageLead}</EditableText>
              <EditableText id="pmp-page-subtitle" value={pageSubtitle} onChange={setPageSubtitle} as="p" multiline className="text-lg text-foreground/70 leading-relaxed">{pageSubtitle}</EditableText>
            </div>
          </div>
        </section>

        <Stats />
        <BusinessAreas />
        <TechnologySection />
        <PropertyManagement />

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <EditableText id="pmp-services-title" value={servicesTitle} onChange={setServicesTitle} as="h2" className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-12 text-center">{servicesTitle}</EditableText>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => {
                  const Icon = iconMap[service.icon] || FileCheck;
                  return (
                    <Card key={index} className="p-6 hover:shadow-elegant transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6 text-accent-strong" />
                        </div>
                        <EditableText
                          id={`pmp-service-${index}`}
                          value={service.text}
                          onChange={(v) => { const u = [...services]; u[index] = { ...u[index], text: v }; setServices(u); }}
                          as="p"
                          className="text-foreground/90 font-medium pt-2"
                        >{service.text}</EditableText>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <ProjectsSection />
        <AboutMini />
        <PropertyEvaluator />
        <OwnerCta />
      </main>
      <Footer />
    </div>
  );
};

const PropertyManagementPage = () => (<PageWrapper slug="site--property-management"><PropertyManagementPageContent /></PageWrapper>);
export default PropertyManagementPage;
