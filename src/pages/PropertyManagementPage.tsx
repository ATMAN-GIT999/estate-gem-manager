import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { breadcrumbSchema, faqSchema, organizationSchema } from "@/lib/schema";
import OwnerHero from "@/components/OwnerHero";
import TrustBand from "@/components/TrustBand";
import TheClaim from "@/components/TheClaim";
import TheSystem from "@/components/TheSystem";
import WorkingWith from "@/components/WorkingWith";
import AboutMini from "@/components/AboutMini";
import WaysToWorkTogether from "@/components/WaysToWorkTogether";
import RenovationsAndInvestments from "@/components/RenovationsAndInvestments";
import OwnerContactForm from "@/components/OwnerContactForm";
import FAQ, { OWNER_FAQ_ITEMS } from "@/components/FAQ";
import { useEffect } from "react";
import { useTrackEvent } from "@/hooks/use-track-event";
import "@/styles/property-management.css";

const PropertyManagementPageContent = () => {
  const track = useTrackEvent();

  // The top of the owner funnel (docs/seo/01_IMPLEMENTATION.md, Paket E).
  // Fires once the visitor has accepted analytics — see useTrackEvent.
  useEffect(() => {
    void track("pm_page_view");
  }, [track]);

  return (
  <div className="min-h-screen flex flex-col pmp-editorial">
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
        faqSchema(OWNER_FAQ_ITEMS),
      ]}
    />
    <Navigation overlay variant="propertyManagement" logoOnDark />

    {/* Ten sections, and the order is the argument, not a list:
        here is what your house could earn → here is what we have already run →
        here is the claim → here is how the work happens → here is how you'd
        engage us → here is where your house goes live → here is the half of
        the business that is not management → here is who does it → here is
        what people ask → here is how to start.

        The page opens on the calculator rather than on a photograph. An owner
        arrives with one question, and it is a number; everything else on the
        page is an answer to "and can I trust you with it".

        overflow-x-clip is the safety net for the full-bleed bands: `100vw` can
        be a hair wider than the visible viewport when a scrollbar is present. */}
    <main className="flex-1 overflow-x-clip">
      {/* 1 — The question they came with, answerable in two fields. */}
      <OwnerHero />

      {/* 2 — What is behind the offer, before any of it is described. */}
      <TrustBand />

      {/* 3 — The sentence the rest of the page argues for. */}
      <TheClaim />

      {/* 4 — Three steps. Not the full operating model; the three things that
          change for the owner. */}
      <TheSystem />

      {/* 5 — The commercial decision. Deliberately unequal: fixed rent leads. */}
      <WaysToWorkTogether />

      {/* 6 — A breath between the two heaviest sections, and an argument of
          its own on this side of the site: the channels a house goes live on.
          On the guest page these same logos would be a leak. */}
      <WorkingWith />

      {/* 7 — The other half of the business, as equals, then one case study. */}
      <RenovationsAndInvestments />

      {/* 8 — Whether there is anyone behind the company. */}
      <AboutMini />

      {/* 9 — The five owner questions from the wireframe, not the guest FAQ
          relabelled. Two of the five (contract term/notice, damage
          liability) have no published number to state — see FAQ.tsx's file
          comment and docs/PROJECT.md D11 — so they say plainly that it's
          agreed with you rather than inventing a figure. */}
      <FAQ eyebrow="" variant="owner" />

      {/* 10 — The bookend to the hero: every "contact us" above lands here,
          on a photograph that fades into the footer with no seam. */}
      <OwnerContactForm />
    </main>
    <Footer />
  </div>
  );
};

const PropertyManagementPage = () => (<PageWrapper slug="site--property-management"><PropertyManagementPageContent /></PageWrapper>);
export default PropertyManagementPage;
