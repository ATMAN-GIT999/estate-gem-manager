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
import { Section, Stack, Surface } from "@/components/layout";

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
      {/* The section order is docs/PROJECT.md §2, and the reason it
          is worth protecting is that it is an argument rather than a list:
          what it earns → what it costs you in effort → why us → what that
          looks like in practice → where → who → how to start. Moving a block
          breaks the sentence, not just the layout.

          overflow-x-clip is the safety net for the full-bleed image blocks
          (OwnerContactForm): `100vw` can be a hair wider than the visible
          viewport when a scrollbar is present, and without this the page
          would gain a few pixels of horizontal scroll. */}
      <main className="flex-1 pt-24 overflow-x-clip">
        {/* 1 — Hero + conversion in one screen. The title states what this
            is, the form underneath is the first thing an owner can act on —
            no more scrolling past eight sections to find a way to talk to
            someone. */}
        <Section size="md" className="pt-md">
          {/* The silver panel is its own contained, rounded element — not a
              full-bleed section fill — so it reads as a deliberate material
              rather than just "the page background got lighter". It shares
              that material with the FAQ at the foot of the page (§23). */}
          <Surface material="silver" pad="lg">
            {/* Soft green shading tucked into the corners on top of the
                shimmer — decoration only, harmonising the panel with the
                rest of the palette. */}
            <div className="pointer-events-none absolute -left-16 top-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-16 bottom-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
            <Stack gap="sm" align="center" className="animate-fade-in">
              {/* Full panel width, not the narrower measure below — at this
                  width the title has room to sit on one line rather than
                  breaking after "Rental". */}
              <EditableText id="pmp-page-title" value={pageTitle} onChange={setPageTitle} as="h1" className="t-display text-primary">{pageTitle}</EditableText>
              <div className="max-w-2xl mx-auto space-y-sm">
                <EditableText id="pmp-page-lead" value={pageLead} onChange={setPageLead} as="p" multiline className="t-block text-primary text-balance">{pageLead}</EditableText>
                <EditableText id="pmp-page-subtitle" value={pageSubtitle} onChange={setPageSubtitle} as="p" multiline className="t-body text-foreground/70">{pageSubtitle}</EditableText>
              </div>
            </Stack>
          </Surface>
        </Section>
        <OwnerContactForm />

        {/* 2 — Trust: the portfolio behind the promise, before any claim. */}
        <Stats />

        {/* 3-4 — The two halves of the offer, deliberately unequal (§12-§14).
            What the property earns is the primary value proposition and gets
            the widest band; what it costs you in effort answers it and stays
            quiet. This order is binding. */}
        <FinancialPerformance />
        <PropertyManagement />

        {/* 5 — Why us, and only then what that looks like day to day (§15,
            §16). The claim has to precede its own evidence; the other way
            round the reader meets a list of tasks with nothing to hang it
            on. */}
        <WhyItMakesADifference />
        <ListingWorkflow />

        {/* 6 — Where the work happens, with the transformations under it. */}
        <ProjectsSection />

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
