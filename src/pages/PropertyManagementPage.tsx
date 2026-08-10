import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
import FinancialPerformance from "@/components/FinancialPerformance";

const PropertyManagementPageContent = () => {
  const [pageTitle, setPageTitle] = useState("Bespoke Property Management");
  // Two sentences where the page used to open with five variations of the same
  // positioning — the hero's own subtitle, both halves of IntroSection, and the
  // Business Areas lead-in. These are the two that say something.
  const [pageLead, setPageLead] = useState("Your home deserves more than management — it deserves care, strategy, and master craftsmanship.");
  const [pageSubtitle, setPageSubtitle] = useState("We manage it with the precision, discretion, and hospitality of a world-class boutique hotel — maximising revenue while preserving your asset.");
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

        {/* Order follows the argument, not the order things were built:
            what we take on -> what it earns -> proof it worked -> how, then
            who we are, how to engage, and the two ways to act. */}
        <PropertyManagement />
        <FinancialPerformance />

        <Stats />
        <ProjectsSection />

        <TechnologySection />
        <AboutMini />
        <BusinessAreas />

        <PropertyEvaluator />
        <OwnerCta />
      </main>
      <Footer />
    </div>
  );
};

const PropertyManagementPage = () => (<PageWrapper slug="site--property-management"><PropertyManagementPageContent /></PageWrapper>);
export default PropertyManagementPage;
