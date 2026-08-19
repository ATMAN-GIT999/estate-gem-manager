import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";
import OwnerHero from "@/components/OwnerHero";
import TheSystem from "@/components/TheSystem";
import Proof from "@/components/Proof";
import AboutMini from "@/components/AboutMini";
import WaysToWorkTogether from "@/components/WaysToWorkTogether";
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
        here is how you'd engage us → here is who we are → here are the two
        side doors → here is what people ask → here is how to start. Moving a
        block breaks the sentence, not just the layout.

        Seven sections now, not eight — Renovations/Investments no longer has
        a band of its own after About. It is now the second half of the
        commercial-decision section, under a labelled gold break ("Beyond
        management"), so the whole argument from "how you'd engage us" through
        "here are the two side doors" reads as one continuous band instead of
        being split by About in between (docs/DECISIONS.md §16). "We manage
        while you relax" moved even earlier (§15) — it lives in the contact
        form's own image and heading now.

        The rhythm alternates on purpose and should stay alternating: heavy,
        heavy, heavy (the opening sequence earns three) → heavy → medium →
        medium → heavy. Two heavy sections back to back anywhere below Proof
        is the signal something has grown.

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

      {/* 4 — The commercial decision, in two halves under one band: the two
          engagement models first, then — behind a labelled gold break — the
          two side doors for owners it does not fit yet (a renovation first,
          or not an owner here yet). Investments stays last of the four
          because it targets an investor looking to buy, not the owner the
          rest of the page is written for (DECISIONS §2). */}
      <WaysToWorkTogether />

      {/* 5 — Who runs it. The one call to action mid-page sits at the end of
          this section, because this is the question an owner actually
          decides on. */}
      <AboutMini />

      {/* 6 — Deliberately the guest FAQ with a new heading, as requested;
          owner-specific questions need content from the client
          (PROJECT.md §6, "Bewusst so gelassen"). */}
      <FAQ eyebrow="" heading="Frequently Asked Questions" />

      {/* 7 — The bookend to the hero: every "Contact Us" above lands here,
          now carrying "We manage while you relax" as its own opening beat. */}
      <OwnerContactForm />
    </main>
    <Footer />
  </div>
);

const PropertyManagementPage = () => (<PageWrapper slug="site--property-management"><PropertyManagementPageContent /></PageWrapper>);
export default PropertyManagementPage;
