import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EditableText from "@/components/admin/EditableText";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import Stats from "@/components/Stats";
import TechnologySection from "@/components/TechnologySection";
import PropertyManagement from "@/components/PropertyManagement";
import PropertyEvaluator from "@/components/PropertyEvaluator";
import AboutMini from "@/components/AboutMini";
import ProjectsSection from "@/components/ProjectsSection";
import OwnerContactForm from "@/components/OwnerContactForm";
import FinancialPerformance from "@/components/FinancialPerformance";
import WaysToWorkTogether from "@/components/WaysToWorkTogether";

/** Nothing on this page sets `scroll-behavior`, so scrolling is done in JS —
 *  the same way the header's evaluator button does it. */
const scrollTo = (id: string) => () => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const PropertyManagementPageContent = () => {
  const [pageTitle, setPageTitle] = useState("Bespoke Property Management");
  // Two sentences where the page used to open with five variations of the same
  // positioning — the hero's own subtitle, both halves of IntroSection, and the
  // Business Areas lead-in. These are the two that say something.
  const [pageLead, setPageLead] = useState("Your home deserves more than management — it deserves care, strategy, and master craftsmanship.");
  const [pageSubtitle, setPageSubtitle] = useState("We manage it with the precision, discretion, and hospitality of a world-class boutique hotel — maximising revenue while preserving your asset.");
  const [primaryCta, setPrimaryCta] = useState("Talk to us about your property");
  const [secondaryCta, setSecondaryCta] = useState("See what it could earn");
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

              {/* The page used to open with three stacked paragraphs and no way
                  to act — the first button was in the ninth of ten sections. An
                  owner convinced by the headline had to scroll past everything
                  to do anything about it.

                  Two actions, not one, because owners arrive in two states. The
                  ready one wants a person; the curious one is not going to
                  volunteer their name yet and will take a number instead. */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <Button
                  size="lg"
                  onClick={scrollTo("owner-contact")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant px-8 py-6 text-base"
                >
                  <EditableText id="pmp-cta-primary" value={primaryCta} onChange={setPrimaryCta} as="span">{primaryCta}</EditableText>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollTo("property-evaluation")}
                  className="border-primary/30 text-primary hover:bg-primary/5 px-8 py-6 text-base"
                >
                  <EditableText id="pmp-cta-secondary" value={secondaryCta} onChange={setSecondaryCta} as="span">{secondaryCta}</EditableText>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Order follows the argument: what we take on -> what it earns ->
            proof it worked -> so what would yours earn -> how it is run, who
            we are, the two commercial models, and a way to start.

            The calculator moved up from ninth place. It answers the question
            the proof above it has just provoked, and it is where the hero's
            second button lands — a jump of four sections rather than eight. */}
        <PropertyManagement />
        <FinancialPerformance />

        <Stats />
        <ProjectsSection />

        <PropertyEvaluator />

        <TechnologySection />
        <AboutMini />
        <WaysToWorkTogether />

        <OwnerContactForm />
      </main>
      <Footer />
    </div>
  );
};

const PropertyManagementPage = () => (<PageWrapper slug="site--property-management"><PropertyManagementPageContent /></PageWrapper>);
export default PropertyManagementPage;
