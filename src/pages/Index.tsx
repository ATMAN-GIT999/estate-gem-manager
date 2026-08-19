import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import PropertyCollections from "@/components/PropertyCollections";
import GuestManagement from "@/components/GuestManagement";
import OwnAProperty from "@/components/OwnAProperty";
import PropertyEvaluator from "@/components/PropertyEvaluator";
import FAQ, { FAQ_ITEMS } from "@/components/FAQ";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLocation } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { faqSchema, organizationSchema } from "@/lib/schema";

const IndexContent = () => {
  const location = useLocation();

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

  useEffect(() => {
    // Track page view
    supabase.from("analytics_events").insert({
      event_type: "page_view",
      page_path: "/",
      session_id: sessionStorage.getItem("session_id") || crypto.randomUUID(),
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* The organisation schema lives on the home page and is referenced by
          @id from every other page, so the whole site resolves to one business. */}
      <Seo
        path="/"
        description="Book luxury villas and apartments in Marbella, Málaga and Vienna directly with Frontier Residences — and see what your own property could earn under our management."
        schema={[organizationSchema(), faqSchema(FAQ_ITEMS)]}
      />
      {/* The other page that opens on a photograph, so the bar sits on the
          image and fills in on scroll. Every other route keeps the opaque
          header — white links on the beige page background would vanish. */}
      <Navigation overlay />
      <Hero />

      {/* One uninterrupted guest run — homes, then what the stay is like.
          The portfolio-numbers trust band that used to open here is gone
          (Almedin: drop the stats section from the landing page); these two
          now follow the hero directly instead of behind a green band. */}
      <PropertyCollections />
      <GuestManagement />

      {/* FAQ moved ahead of the owner hand-off, on Almedin's direction: a
          guest with a question gets it answered before the page asks them to
          switch audiences, rather than after. */}
      <FAQ />

      {/* The hand-off to the owner half, once, at the end of the guest
          argument: everything above is written for someone choosing a stay,
          everything below for someone choosing a manager. */}
      <OwnAProperty />

      <PropertyEvaluator />
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