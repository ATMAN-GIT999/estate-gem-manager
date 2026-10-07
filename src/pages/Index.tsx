import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import PropertyCollections from "@/components/PropertyCollections";
import GuestManagement from "@/components/GuestManagement";
import DestinationsRail from "@/components/DestinationsRail";
import OwnAProperty from "@/components/OwnAProperty";
import FAQ, { FAQ_ITEMS } from "@/components/FAQ";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { faqSchema, organizationSchema } from "@/lib/schema";
import { useTrackEvent } from "@/hooks/use-track-event";
import { useLocale } from "@/contexts/LocaleContext";

const IndexContent = () => {
  const location = useLocation();
  const track = useTrackEvent();
  const { t } = useLocale();

  // Handle hash navigation for Property Evaluation section
  useEffect(() => {
    if (location.hash === "#property-evaluation") {
      setTimeout(() => {
        const element = document.getElementById("property-evaluation");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);

  // Page view, once the visitor has accepted the analytics cookie. Consent,
  // the awaited insert and the session id all live in useTrackEvent.
  useEffect(() => {
    void track("page_view");
  }, [track]);

  return (
    <div className="min-h-screen">
      {/* The organisation schema lives on the home page and is referenced by
          @id from every other page, so the whole site resolves to one business. */}
      <Seo
        path="/"
        description="Book luxury villas and apartments in Marbella, Málaga and Vienna directly with Frontier Residences — and see what your own property could earn under our management."
        schema={[organizationSchema(), faqSchema(FAQ_ITEMS)]}
      />
      <Navigation overlay logoOnDark hideOnScroll />

      {/* Seven sections, in the order of the 09/2026 wireframe:
          hero (search bar included again, Almedin 29.09.2026) → homes →
          what a stay includes → where we are → questions → the one hand-off
          to owners → footer.

          The evaluator used to sit between the hand-off and the footer. It has
          moved to /property-management, where it is the hero: on a page a
          guest lands on to choose a house, a cash-flow calculator is owner
          language, which is the mistake this whole site is built to avoid. */}
      <Hero />
      <PropertyCollections />
      <GuestManagement />
      <DestinationsRail />

      {/* A guest with a question gets it answered before the page asks them
          to switch audiences, not after. */}
      <FAQ eyebrow={t("eyebrow-faq")} layout="split" />

      <OwnAProperty />
      <Footer />
    </div>
  );
};

const Index = () => (
  <PageWrapper slug="site--home">
    <IndexContent />
  </PageWrapper>
);

export default Index;