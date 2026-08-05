import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import WhereWeHost from "@/components/WhereWeHost";
import FeaturedProperties from "@/components/FeaturedProperties";
import StayValue from "@/components/StayValue";
import RevealBand from "@/components/RevealBand";
import PropertyManagement from "@/components/PropertyManagement";
import PropertyEvaluator from "@/components/PropertyEvaluator";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import PageWrapper from "@/components/PageWrapper";

/**
 * The one-pager, told as a single story with one turn in the middle.
 *
 * Guest half — hero (find a stay) → where we host → the homes → why book
 * direct. Then RevealBand turns the page over: the homes you just scrolled
 * past are ours to run, and that is the offer. Owner half — what we do →
 * what it would earn → what people say.
 *
 * What used to be here and isn't any more: IntroSection opened with an owner
 * pitch above a guest search bar; BusinessAreas and TechnologySection listed
 * the same services a second and third time; ProjectsSection and AboutSection
 * are back on their own routes (/projects, /about), reachable from the footer,
 * because they answer questions a reader only asks after the argument lands.
 * All five component files are still in the repo, just not rendered here.
 *
 * Stats is the one thing between the hero and the story: a thin confirmed
 * trust strip, deliberately not a section of its own.
 *
 * Every section owns its `id` and `scroll-mt-20` (the fixed header is 80px,
 * matching the convention in Navigation.tsx), so the header links and the
 * redirects from the retired routes all land in the right place.
 */
const IndexContent = () => {
  const location = useLocation();

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
      {/* 🔒 Hero's video, SearchBar and scroll indicator are untouched — only
          the headline and subheadline copy changed. */}
      <Hero />
      <Stats />
      <WhereWeHost />
      <FeaturedProperties />
      <StayValue />
      <RevealBand />
      <PropertyManagement />
      <PropertyEvaluator />
      <Testimonials />
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
