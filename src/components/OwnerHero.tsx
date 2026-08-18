import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";
import { Container, MediaFrame, Stack } from "./layout";
import villaHigueron from "@/assets/villa-higueron.webp";

/**
 * The owner page's opening: a photograph, the promise, and the two things an
 * owner can do about it.
 *
 * It replaces the silver panel that carried the enquiry form in the first
 * screen. That form was put there to fix a real problem — the first call to
 * action used to be section nine of ten — but it solved it by opening a page
 * about a €3–8M asset with a data-entry task. The form now closes the page
 * (§9, the bookend AvantStay uses), and the hero keeps both routes to it
 * one click away instead: "Contact Us" jumps down to the form, so nothing
 * about the old fix is lost. See docs/DECISIONS.md before moving it back.
 *
 * Two buttons because owners arrive in two states: the decided one wants a
 * person, the curious one will not give their name yet and would rather leave
 * with a number.
 */
const OwnerHero = () => {
  const [eyebrow, setEyebrow] = useState("For owners · Property management");
  const [pageTitle, setPageTitle] = useState("Luxury Rental Management");
  const [pageLead, setPageLead] = useState(
    "We offer bespoke property management and treat your home with care."
  );
  const [primaryCta, setPrimaryCta] = useState("Contact Us");
  const [secondaryCta, setSecondaryCta] = useState("See what yours could earn");

  /**
   * The photograph the landing-page hero used before its video came back
   * (docs/DECISIONS.md §12) — moved here rather than duplicated, per
   * Almedin's instruction to relocate the exact file instead of guessing a
   * new one from `src/assets`.
   *
   * Flagged, not silently accepted: this is an interior — marble floor,
   * glass doors, sea and a corner of pool visible through them — not the
   * exterior infinity-pool shot the brief described, and it is byte-for-byte
   * `property-3.webp`, already used for this listing on `/property/…` and
   * its card. It stays until a dedicated PM-hero photograph exists; swap it
   * via the editor the moment one does. See docs/PROJECT.md B5.
   */
  const [heroImage, setHeroImage] = useState(villaHigueron);

  return (
    // Not a <Section>: this band is a picture with text on it rather than a
    // container of content, so it manages its own height and the image sits
    // behind the container instead of inside it. The height is clamped at
    // both ends — the lower bound keeps the headline and both buttons on a
    // short laptop screen, the upper stops it becoming a full-screen splash
    // on a tall monitor, which is the thing §7 moved the landing page off.
    <section className="relative flex items-end overflow-hidden min-h-[clamp(34rem,88vh,50rem)]">
      <MediaFrame
        id="pmp-hero-image"
        src={heroImage}
        onChange={setHeroImage}
        alt="A Frontier Residences managed villa"
        note="Hero — luxury villa, infinity pool, view straight out to the balcony"
        fill
      />
      {/* Palette-derived, not black — see --overlay-media in index.css. */}
      <div className="absolute inset-0 overlay-media" aria-hidden="true" />

      {/* pt-xl clears the fixed header, which in overlay mode runs over the
          top of this image rather than above it. */}
      <Container className="relative z-10 pb-xl pt-xl">
        <Stack gap="md" className="animate-fade-in">
          <div className="space-y-sm">
            <EditableText
              id="pmp-hero-eyebrow"
              value={eyebrow}
              onChange={setEyebrow}
              as="span"
              className="block t-meta text-accent-on-primary"
            >
              {eyebrow}
            </EditableText>
            <EditableText
              id="pmp-page-title"
              value={pageTitle}
              onChange={setPageTitle}
              as="h1"
              className="t-display text-white text-balance max-w-[15ch] drop-shadow-2xl"
            >
              {pageTitle}
            </EditableText>
            <EditableText
              id="pmp-page-lead"
              value={pageLead}
              onChange={setPageLead}
              as="p"
              multiline
              className="t-body text-white/90 max-w-xl drop-shadow-lg"
            >
              {pageLead}
            </EditableText>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Gold fill for the decided owner, outline for the curious one.
                An anchor, not a router link: the form is on this page. */}
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold px-8 py-6 text-base"
            >
              <a href="#get-in-touch">
                <EditableText id="pmp-hero-cta-1" value={primaryCta} onChange={setPrimaryCta} as="span">
                  {primaryCta}
                </EditableText>
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/55 bg-transparent text-white hover:bg-white/10 hover:text-white px-8 py-6 text-base"
            >
              <Link to="/evaluate">
                <EditableText id="pmp-hero-cta-2" value={secondaryCta} onChange={setSecondaryCta} as="span">
                  {secondaryCta}
                </EditableText>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </Stack>
      </Container>
    </section>
  );
};

export default OwnerHero;
