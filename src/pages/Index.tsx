import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import StaysYouLove from "@/components/StaysYouLove";
import Stats from "@/components/Stats";
import WhatMakesUsDifferent from "@/components/WhatMakesUsDifferent";
import AboutMini from "@/components/AboutMini";
import RevealBand from "@/components/RevealBand";
import GuestReviews from "@/components/GuestReviews";
import GuestFaq from "@/components/GuestFaq";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { supabase } from "@/lib/supabaseClient";
import PageWrapper from "@/components/PageWrapper";

/**
 * The guest landing page. One audience, one job: find a stay.
 *
 * Search → where the homes are listed → the homes → the numbers behind them →
 * why book here → who we are → and only then, once, the other half of the
 * business, as a link rather than a chapter. Reviews and FAQ close it.
 *
 * The owner story lives on /property-management now. Splitting them was the
 * point of this rebuild: one URL cannot rank for "villa rental Marbella" and
 * "property management Costa del Sol" at once, and a reader who wants one is
 * not helped by scrolling the other.
 *
 * Gone from here: IntroSection, BusinessAreas, TechnologySection,
 * ProjectsSection, AboutSection, WhereWeHost (absorbed into TrustStrip),
 * StayValue (grown into WhatMakesUsDifferent), and — now that the owner page
 * exists to host them — PropertyManagement, PropertyEvaluator and Testimonials.
 * The unused files stay in the repo.
 *
 * Every section owns its `id` and `scroll-mt-20` (the fixed header is 80px,
 * matching the convention in Navigation.tsx).
 */
/**
 * `crypto.randomUUID` only exists in a secure context — https or localhost.
 * Opened over a plain http LAN address (Vite prints one as "Network:", and
 * anyone testing from a phone will use it) it is undefined, and the throw took
 * the whole page down to a white screen before the first section rendered.
 * Analytics is not worth that, so it degrades instead.
 */
const newSessionId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

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
      session_id: sessionStorage.getItem("session_id") || newSessionId(),
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Written for the search a guest makes, not for the company name — the
          owner half of the business has its own page and its own terms. */}
      <Seo
        path="/"
        title="Luxury Villas & Vacation Rentals on the Costa del Sol | Frontier Residences"
        description="Hand-picked villas and apartments on the Costa del Sol, in Austria and Croatia. Booked direct, managed by us, with 24/7 support and hotel-standard cleaning."
      />
      <Navigation />
      {/* 🔒 Hero's video and SearchBar wiring are untouched — only copy and the
          trust/CTA block underneath the search changed. */}
      <Hero />
      <TrustStrip />
      <StaysYouLove />
      <Stats />
      <WhatMakesUsDifferent />
      <AboutMini />
      <RevealBand />
      <GuestReviews />
      <GuestFaq />
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
