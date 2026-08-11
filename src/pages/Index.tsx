import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import PropertyCollections from "@/components/PropertyCollections";
import GuestManagement from "@/components/GuestManagement";
import OwnAProperty from "@/components/OwnAProperty";
import PropertyEvaluator from "@/components/PropertyEvaluator";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLocation } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { organizationSchema } from "@/lib/schema";

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
        schema={organizationSchema()}
      />
      <Navigation />
      <Hero />

      <PropertyCollections />

      {/* The hand-off to the owner half, placed while the homes are still on
          screen: "own a property?" lands hardest right after someone has just
          scrolled past what Frontier does with other people's. */}
      <OwnAProperty />

      {/* Then back to the guest: having seen the homes, what the stay is
          actually like. */}
      <GuestManagement />

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