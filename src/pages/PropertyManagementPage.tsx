import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";
import OwnerHero from "@/components/OwnerHero";
import TheSystem from "@/components/TheSystem";
import Proof from "@/components/Proof";
import PropertyManagement from "@/components/PropertyManagement";
import AboutMini from "@/components/AboutMini";
import WaysToWorkTogether from "@/components/WaysToWorkTogether";
import RenovationsAndInvestments from "@/components/RenovationsAndInvestments";
import OwnerContactForm from "@/components/OwnerContactForm";
import FAQ from "@/components/FAQ";

const PropertyManagementPageContent = () => (
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
    {/* Transparent over the hero photograph, filling in on scroll. The page
        therefore does NOT clear the fixed header with `pt-24` the way the
        content pages do — the image runs up underneath it on purpose. */}
    <Navigation overlay />

    {/* The order is docs/PROJECT.md §2, and it is worth protecting because it
        is an argument rather than a list: here is the house → here is
        everything we do to it → here is what that produced on real ones →
        here is what it costs you in attention → here is how you'd engage us →
        here is who we are → here are the two side doors → here is what people
        ask → here is how to start. Moving a block breaks the sentence, not
        just the layout.

        The rhythm alternates on purpose and should stay alternating: heavy,
        heavy, heavy (the opening sequence earns three) → light → medium →
        heavy → medium → medium → heavy. Two heavy sections back to back
        anywhere below Proof is the signal something has grown.

        overflow-x-clip is the safety net for the full-bleed bands: `100vw` can
        be a hair wider than the visible viewport when a scrollbar is present,
        and without this the page would gain a few pixels of horizontal
        scroll. */}
    <main className="flex-1 overflow-x-clip">
      {/* 1 — The house, the promise, and the two things to do about it. */}
      <OwnerHero />

      {/* 2 — Everything Frontier does, once, in the order it happens. The
          page's centre of gravity; it replaces three sections that each told
          a slice of the same story. */}
      <TheSystem />

      {/* 3 — The evidence, at two scales: the portfolio, then three houses. */}
      <Proof />

      {/* 4 — The exhale. One picture, one sentence. It must not grow. */}
      <PropertyManagement />

      {/* 5-7 — The commercial decision, then who runs it, then the two side
          doors for owners it does not fit yet. Swapped from Team-then-Two-ways
          on Almedin's direction: the decision now leads straight into "who
          gets the keys", and Renovations/Investments still sits directly
          under Guaranteed Income, which is what its own copy ("before you
          hand it over") assumes. Investments stays last of the three on
          purpose — it addresses an investor looking to buy, not the owner the
          rest of the page is written for (DECISIONS §2). */}
      <WaysToWorkTogether />

      {/* The one call to action mid-page sits at the end of this section,
          because this is the question an owner actually decides on. */}
      <AboutMini />

      <RenovationsAndInvestments />

      {/* 8 — Deliberately the guest FAQ with a new heading, as requested;
          owner-specific questions need content from the client
          (PROJECT.md §6, "Bewusst so gelassen"). */}
      <FAQ eyebrow="" heading="Frequently Asked Questions" />

      {/* 9 — The bookend to the hero: every "Contact Us" above lands here. */}
      <OwnerContactForm />
    </main>
    <Footer />
  </div>
);

const PropertyManagementPage = () => (<PageWrapper slug="site--property-management"><PropertyManagementPageContent /></PageWrapper>);
export default PropertyManagementPage;
