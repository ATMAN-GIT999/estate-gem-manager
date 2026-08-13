import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EditableText from "@/components/admin/EditableText";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";
import Stats from "@/components/Stats";
import WhyItMakesADifference from "@/components/WhyItMakesADifference";
import PropertyManagement from "@/components/PropertyManagement";
import ListingWorkflow from "@/components/ListingWorkflow";
import AboutMini from "@/components/AboutMini";
import ProjectsSection from "@/components/ProjectsSection";
import OwnerContactForm from "@/components/OwnerContactForm";
import FinancialPerformance from "@/components/FinancialPerformance";
import WaysToWorkTogether from "@/components/WaysToWorkTogether";
import FAQ from "@/components/FAQ";
import GetInTouch from "@/components/GetInTouch";

const PropertyManagementPageContent = () => {
  const [pageTitle, setPageTitle] = useState("Luxury Rental Management");
  const [pageLead, setPageLead] = useState("We offer bespoke Property Management");
  const [pageSubtitle, setPageSubtitle] = useState("And treat your home with care, strategy and the precision it needs — while preserving your asset we are maximising revenue.");

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title="Bespoke Property Management in Marbella, Málaga & Vienna"
        description="Full-service short-term rental management for luxury homes on the Costa del Sol and in Austria — listing, dynamic pricing, guests, housekeeping and owner reporting. Or lease your property to us for a fixed monthly income."
        path="/property-management"
        schema={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Property Management", path: "/property-management" },
          ]),
        ]}
      />
      <Navigation />
      {/* overflow-x-clip is the safety net for the full-bleed image blocks
          further down (OwnerContactForm, the Featured Transformations
          gallery): `100vw` can be a hair wider than the visible viewport
          when a scrollbar is present, and without this the page would gain
          a few pixels of horizontal scroll. */}
      <main className="flex-1 pt-24 pb-12 overflow-x-clip">
        {/* 1 — The contact form is the hero. Title states what this is, lead
            and subtitle state the promise, and the form itself is the first
            thing an owner can act on — no more scrolling past eight sections
            to find a way to talk to someone. */}
        <section className="pt-16 pb-10 md:pb-14">
          <div className="container mx-auto px-4">
            {/* The silver panel is its own contained, rounded element — not
                a full-bleed section fill — so it reads as a deliberate
                material rather than just "the page background got lighter". */}
            <div className="bg-silver-shimmer relative rounded-[2.5rem] px-6 py-16 md:px-16 md:py-20 shadow-soft">
              {/* Soft green shading tucked into the corners on top of the
                  shimmer — decoration only, harmonising the panel with the
                  rest of the palette. */}
              <div className="pointer-events-none absolute -left-16 top-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -right-16 bottom-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
              <div className="relative text-center animate-fade-in">
                {/* Full panel width, not the narrower max-w-2xl below — at
                    this width the title has room to sit on one line rather
                    than breaking after "Rental". */}
                <EditableText id="pmp-page-title" value={pageTitle} onChange={setPageTitle} as="h1" className="t-display text-primary mb-6">{pageTitle}</EditableText>
                <div className="max-w-2xl mx-auto">
                  <EditableText id="pmp-page-lead" value={pageLead} onChange={setPageLead} as="p" multiline className="t-block text-primary text-balance mb-5">{pageLead}</EditableText>
                  <EditableText id="pmp-page-subtitle" value={pageSubtitle} onChange={setPageSubtitle} as="p" multiline className="t-body text-foreground/70">{pageSubtitle}</EditableText>
                </div>
              </div>
            </div>
          </div>
        </section>
        <OwnerContactForm />

        {/* 2 — Proof of scale, then how the earnings side is run. The
            calculator itself lives on the landing page; the button at the
            end of FinancialPerformance links there instead of embedding the
            whole form again. */}
        <Stats />
        <FinancialPerformance />

        {/* 3-4 — The listing itself: the opening statement and the platform
            work as one surface, then the four things that make it up on
            their own, more visible, surface. */}
        <PropertyManagement />
        <ListingWorkflow />

        {/* 5 — The work, in three destinations. */}
        <ProjectsSection />

        {/* 6 — The differentiator: the system, with guest management and
            property care folded in underneath as the standard services they
            are. */}
        <WhyItMakesADifference />

        {/* 7-8 — Who runs it, and the two ways to start (Renovations and
            Investments nest inside Guaranteed Income there). */}
        <AboutMini />
        <WaysToWorkTogether />

        <FAQ eyebrow="" heading="Frequently Asked Questions" />

        <GetInTouch />
      </main>
      <Footer />
    </div>
  );
};

const PropertyManagementPage = () => (<PageWrapper slug="site--property-management"><PropertyManagementPageContent /></PageWrapper>);
export default PropertyManagementPage;
