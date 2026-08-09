import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import StaysYouLove from "@/components/StaysYouLove";
import GuestManagement from "@/components/GuestManagement";
import OwnAProperty from "@/components/OwnAProperty";
import PropertyEvaluator from "@/components/PropertyEvaluator";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLocation } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";

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
      <Navigation />
      <Hero />

      <StaysYouLove />

      {/* Directly after the homes: a guest who has just picked one wants to know
          who is behind it once they have booked. */}
      <GuestManagement />

      {/* The hand-off from the guest half of the site to the owner half. Its
          heading promises what the evaluator directly below delivers. */}
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