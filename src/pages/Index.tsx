import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import Stats from "@/components/Stats";
import BusinessAreas from "@/components/BusinessAreas";
import ProjectsSection from "@/components/ProjectsSection";
import PropertyEvaluator from "@/components/PropertyEvaluator";
import AboutSection from "@/components/AboutSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import PageWrapper from "@/components/PageWrapper";

/**
 * The one-pager. Order runs: attention → framing → trust → offer → proof →
 * conversion → who we are → guest branch.
 *
 * Sections 2–8 own their own `id` and `scroll-mt-20` (the fixed header is 80px,
 * matching the convention in Navigation.tsx), so the header links and the
 * redirects from the retired info routes all land in the right place.
 */
const IndexContent = () => {
  const location = useLocation();

  // Generalised from a #property-evaluation-only special case: every section
  // anchor now works, which is what makes the redirects off /about, /projects
  // and the four service routes land correctly.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    // One frame is not enough — the sections below the fold mount with data
    // still loading, so the target may not exist yet on the first tick.
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [location.hash]);

  useEffect(() => {
    supabase.from("analytics_events").insert({
      event_type: "page_view",
      page_path: "/",
      session_id: sessionStorage.getItem("session_id") || crypto.randomUUID(),
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      {/* 🔒 Hero is unchanged — video, headline, SearchBar and scroll indicator
          are exactly as they were. Everything below is the restructured page. */}
      <Hero />
      <IntroSection />
      <Stats />
      <BusinessAreas />
      <ProjectsSection />
      <PropertyEvaluator />
      <AboutSection />
      <FeaturedProperties />
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
