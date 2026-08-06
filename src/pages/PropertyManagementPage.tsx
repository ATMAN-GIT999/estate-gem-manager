import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyEvaluator from "@/components/PropertyEvaluator";
import PropertyManagement from "@/components/PropertyManagement";
import OwnerComparison from "@/components/OwnerComparison";
import OwnerTestimonials from "@/components/OwnerTestimonials";
import OwnerFaq from "@/components/OwnerFaq";
import ConsultationBooking from "@/components/ConsultationBooking";
import { Button } from "@/components/ui/button";
import EditableText from "@/components/admin/EditableText";
import Seo from "@/components/Seo";
import PageWrapper from "@/components/PageWrapper";

/**
 * The owner page. One audience, one job: get a projection.
 *
 * The order is the order of an owner's decision, not the order of our service
 * catalogue. The number comes first, while curiosity is at its highest and
 * before any commitment has been asked for; the service, the comparison and
 * the objections follow to justify it; the call is at the end, for the ones
 * the number convinced.
 *
 * What it replaces: a page that opened with "Luxury Property Management
 * Designed for Exceptional Homes", listed nine services as identical cards,
 * explained its AI stack at length — and then simply stopped. It had no call
 * to action anywhere. A visitor who read all of it had nothing to do next.
 */
const PropertyManagementPageContent = () => {
  const location = useLocation();

  const [eyebrow, setEyebrow] = useState("Property management");
  const [pageTitle, setPageTitle] = useState(
    "Own a home here? We run it like a boutique hotel."
  );
  const [pageSubtitle, setPageSubtitle] = useState(
    "Full-service management for villas and apartments across Southern Spain, Austria and Croatia — you keep the asset and the income, we handle everything else."
  );
  const [closingTitle, setClosingTitle] = useState(
    "Start with the number."
  );
  const [closingText, setClosingText] = useState(
    "Find out what your property could earn before you decide anything else. It takes a minute and costs nothing."
  );
  const [closingCta, setClosingCta] = useState("Get your free projection");

  // The header dropdown links straight to #property-evaluation, and so do the
  // CTAs on this page. Without this the hash lands on a page whose sections
  // are still mounting and nothing scrolls.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [location.hash]);

  const scrollToEvaluator = (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById("property-evaluation")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Deliberately shares no keywords with the landing page: this one is
          aimed at owners searching for management and income, not at guests
          searching for a villa. That separation is the reason the two pages
          exist apart. */}
      <Seo
        path="/property-management"
        title="Property Management Costa del Sol, Austria & Croatia | Frontier Residences"
        description="Full-service holiday rental management for villa and apartment owners. Listings, dynamic pricing, 24/7 guest care and upkeep. Get a free revenue projection — no commitment."
      />
      <Navigation />
      <main className="flex-1">
        {/* Hero: the offer, then straight into the engine that delivers it. */}
        <section className="pt-32 pb-16 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <EditableText
                id="pmpage-eyebrow"
                value={eyebrow}
                onChange={setEyebrow}
                as="span"
                className="block text-sm font-medium uppercase tracking-widest text-accent-strong mb-4"
              >
                {eyebrow}
              </EditableText>
              <EditableText
                id="pmpage-title"
                value={pageTitle}
                onChange={setPageTitle}
                as="h1"
                className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-primary text-balance"
              >
                {pageTitle}
              </EditableText>
              <EditableText
                id="pmpage-subtitle"
                value={pageSubtitle}
                onChange={setPageSubtitle}
                as="p"
                multiline
                className="mt-6 text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto"
              >
                {pageSubtitle}
              </EditableText>
            </div>
          </div>
        </section>

        {/* Engine — owns id="property-evaluation". */}
        <PropertyEvaluator />

        {/* The offer: three pillars, the proof strip, Guaranteed Income. */}
        <PropertyManagement />

        <OwnerComparison />

        {/* Book a call, for owners who would rather talk than type an address.
            ⚠️ This is our own form, not a scheduling tool — it captures a
            preferred date and we confirm by hand. Swapping in Calendly (or
            similar) is still open; when that happens, keep the contacts insert
            so leads stay in one place. */}
        <ConsultationBooking />

        <OwnerTestimonials />

        <OwnerFaq />

        {/* Closing CTA — back to the projection, which is the whole page's ask. */}
        <section className="py-24 bg-gradient-sage">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <EditableText
                id="pmpage-closing-title"
                value={closingTitle}
                onChange={setClosingTitle}
                as="h2"
                className="font-playfair text-3xl md:text-4xl font-bold text-primary-foreground text-balance"
              >
                {closingTitle}
              </EditableText>
              <EditableText
                id="pmpage-closing-text"
                value={closingText}
                onChange={setClosingText}
                as="p"
                multiline
                className="mt-5 text-lg text-primary-foreground/80 leading-relaxed"
              >
                {closingText}
              </EditableText>
              <div className="mt-10">
                {/* Same-page anchor with a handler: a <Link> to a hash that is
                    already in the URL is a no-op, and this button is at the
                    bottom of a page whose form is at the top — the one place a
                    reader is most likely to click it twice. */}
                <a href="#property-evaluation" onClick={scrollToEvaluator}>
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold font-semibold px-8"
                  >
                    <EditableText
                      id="pmpage-closing-cta"
                      value={closingCta}
                      onChange={setClosingCta}
                      as="span"
                    >
                      {closingCta}
                    </EditableText>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const PropertyManagementPage = () => (
  <PageWrapper slug="site--property-management">
    <PropertyManagementPageContent />
  </PageWrapper>
);

export default PropertyManagementPage;
