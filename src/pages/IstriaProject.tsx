import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import EditableText from "@/components/admin/EditableText";
import { Container, Grid, MediaFrame, Section } from "@/components/layout";
import { breadcrumbSchema } from "@/lib/schema";
import { useLocale } from "@/contexts/LocaleContext";
import istriaImage from "@/assets/wf-istria-complex.webp";
import istriaPoolBefore from "@/assets/wf-istria-exterior-before.jpg";
import istriaPoolAfter from "@/assets/wf-istria-exterior-after.jpg";
import istriaLivingBefore from "@/assets/wf-istria-living-before.jpg";
import istriaLivingAfter from "@/assets/wf-istria-living-after.jpg";

/**
 * The Istria renovation, on a page of its own — where "Explore the project" on
 * the property management page lands (Almedin, 26.09.2026; it used to open the
 * general /projects list).
 *
 * The hero is the photograph, full-bleed, in the same manner as the bands that
 * fade into the footer, with the case study's own headline as the h1. The
 * headline, eyebrow and lead are the very translation keys the teaser on
 * /property-management reads (`case-*`), so the teaser and its page cannot
 * drift into saying two things about one project.
 *
 * ⚠️ Deliberately short. Everything on this page is a claim about a real
 * project, and the only thing the codebase knew about it at first was the
 * sentence in `case-lead`. Two real before/after pairs landed 29.09.2026
 * (exterior/pool, living room) — see the Before & After section below. Scope
 * and any numbers still go in only when Almedin supplies them, not invented
 * (docs/DECISIONS.md §5).
 *
 * ⚠️ Croatia is where this renovation happened, not a market Frontier manages
 * homes in (docs/PROJECT.md §1). Nothing here should read as an offer to book
 * or to hand over a home there.
 */
const IstriaProjectContent = () => {
  const { t, language } = useLocale();

  const [eyebrow, setEyebrow] = useState(t("case-eyebrow"));
  const [heading, setHeading] = useState(t("case-heading"));
  const [lead, setLead] = useState(t("case-lead"));
  const [ctaHeading, setCtaHeading] = useState(t("istria-cta-heading"));
  const [image, setImage] = useState<string | undefined>(istriaImage);

  // Before & After — two pairs, 29.09.2026. `beforeLabel`/`afterLabel` are
  // each one piece of editable text shared by both pairs (the same pattern
  // Proof.tsx uses for its repeated "Featured Property" tag): one word said
  // twice should stay one word if an owner ever corrects it, not two that can
  // drift apart.
  const [baEyebrow, setBaEyebrow] = useState(t("istria-ba-eyebrow"));
  const [baHeading, setBaHeading] = useState(t("istria-ba-heading"));
  const [beforeLabel, setBeforeLabel] = useState(t("istria-ba-before"));
  const [afterLabel, setAfterLabel] = useState(t("istria-ba-after"));
  const [poolCaption, setPoolCaption] = useState(t("istria-ba-pool-caption"));
  const [livingCaption, setLivingCaption] = useState(t("istria-ba-living-caption"));
  const [poolBefore, setPoolBefore] = useState<string | undefined>(istriaPoolBefore);
  const [poolAfter, setPoolAfter] = useState<string | undefined>(istriaPoolAfter);
  const [livingBefore, setLivingBefore] = useState<string | undefined>(istriaLivingBefore);
  const [livingAfter, setLivingAfter] = useState<string | undefined>(istriaLivingAfter);

  useEffect(() => {
    setEyebrow(t("case-eyebrow"));
    setHeading(t("case-heading"));
    setLead(t("case-lead"));
    setCtaHeading(t("istria-cta-heading"));
    setBaEyebrow(t("istria-ba-eyebrow"));
    setBaHeading(t("istria-ba-heading"));
    setBeforeLabel(t("istria-ba-before"));
    setAfterLabel(t("istria-ba-after"));
    setPoolCaption(t("istria-ba-pool-caption"));
    setLivingCaption(t("istria-ba-living-caption"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title="Istria, Croatia — A Villa Complex Brought Back to Life"
        description="A complete renovation of a former villa complex in Istria, Croatia, transformed into a portfolio of finished homes — one of the projects behind Frontier Residences."
        path="/projects/istria"
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: "Istria", path: "/projects/istria" },
        ])}
      />
      <Navigation overlay variant="propertyManagement" />

      <main className="flex-1 overflow-x-clip">
        {/* Full-bleed, and tall enough to be the page rather than a banner on
            it. `--overlay-media` darkens top and bottom: the top for the
            transparent header, the bottom for the headline. */}
        <section className="relative flex items-end overflow-hidden pt-20 min-h-[clamp(30rem,85vh,50rem)]">
          <MediaFrame
            id="istria-hero-image"
            src={image}
            onChange={setImage}
            alt="The renovated villa complex in Istria, seen from the air"
            note="Istria — aerial of the renovated villa complex, full width"
            fill
            priority
          />
          <div className="absolute inset-0 overlay-media" aria-hidden="true" />

          <Container className="relative z-10 pb-2xl pt-lg text-center">
            <div className="max-w-3xl mx-auto space-y-sm animate-fade-in">
              <EditableText
                id="case-eyebrow"
                value={eyebrow}
                onChange={setEyebrow}
                as="p"
                className="t-tag text-white/75"
              >
                {eyebrow}
              </EditableText>
              <EditableText
                id="case-heading"
                value={heading}
                onChange={setHeading}
                as="h1"
                className="t-display text-white text-balance"
              >
                {heading}
              </EditableText>
            </div>
          </Container>
        </section>

        <Section size="lg" measure="text">
          <div className="text-center">
            <EditableText
              id="case-lead"
              value={lead}
              onChange={setLead}
              as="p"
              multiline
              className="t-section text-foreground text-balance"
            >
              {lead}
            </EditableText>
            <Link to="/projects" className="cta-link mt-md inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              {t("istria-back")}
            </Link>
          </div>
        </Section>

        {/* Before & After — the two real pairs Almedin supplied 29.09.2026
            (see the file comment atop this page). Each pair is its own
            caption over one Before|After row rather than four frames in a
            single grid, so "before" and "after" always read as a pair, not
            as four unrelated photos that happen to share a section. */}
        <Section size="lg">
          <div className="text-center mb-xl">
            <EditableText
              id="istria-ba-eyebrow"
              value={baEyebrow}
              onChange={setBaEyebrow}
              as="p"
              className="t-tag text-accent-strong"
            >
              {baEyebrow}
            </EditableText>
            <EditableText
              id="istria-ba-heading"
              value={baHeading}
              onChange={setBaHeading}
              as="h2"
              className="t-section text-foreground text-balance mt-3"
            >
              {baHeading}
            </EditableText>
          </div>

          <div className="space-y-2xl">
            <div>
              <EditableText
                id="istria-ba-pool-caption"
                value={poolCaption}
                onChange={setPoolCaption}
                as="p"
                className="t-block text-foreground mb-sm"
              >
                {poolCaption}
              </EditableText>
              <Grid cols={2}>
                <div>
                  <MediaFrame
                    id="istria-ba-pool-before"
                    src={poolBefore}
                    onChange={setPoolBefore}
                    alt="The villa's pool and exterior before the renovation, drained and worn"
                    note="Istria — exterior/pool, before"
                    aspect="photo"
                  />
                  <EditableText
                    id="istria-ba-pool-before-label"
                    value={beforeLabel}
                    onChange={setBeforeLabel}
                    as="p"
                    className="t-meta text-accent-strong mt-2"
                  >
                    {beforeLabel}
                  </EditableText>
                </div>
                <div>
                  <MediaFrame
                    id="istria-ba-pool-after"
                    src={poolAfter}
                    onChange={setPoolAfter}
                    alt="The same villa's pool and exterior after the renovation, from the air"
                    note="Istria — exterior/pool, after"
                    aspect="photo"
                  />
                  <EditableText
                    id="istria-ba-pool-after-label"
                    value={afterLabel}
                    onChange={setAfterLabel}
                    as="p"
                    className="t-meta text-accent-strong mt-2"
                  >
                    {afterLabel}
                  </EditableText>
                </div>
              </Grid>
            </div>

            <div>
              <EditableText
                id="istria-ba-living-caption"
                value={livingCaption}
                onChange={setLivingCaption}
                as="p"
                className="t-block text-foreground mb-sm"
              >
                {livingCaption}
              </EditableText>
              <Grid cols={2}>
                <div>
                  <MediaFrame
                    id="istria-ba-living-before"
                    src={livingBefore}
                    onChange={setLivingBefore}
                    alt="The living room before the renovation, with the previous owner's furniture"
                    note="Istria — living room, before"
                    aspect="photo"
                  />
                  <EditableText
                    id="istria-ba-living-before-label"
                    value={beforeLabel}
                    onChange={setBeforeLabel}
                    as="p"
                    className="t-meta text-accent-strong mt-2"
                  >
                    {beforeLabel}
                  </EditableText>
                </div>
                <div>
                  <MediaFrame
                    id="istria-ba-living-after"
                    src={livingAfter}
                    onChange={setLivingAfter}
                    alt="The same living room after the renovation, furnished and finished"
                    note="Istria — living room, after"
                    aspect="photo"
                  />
                  <EditableText
                    id="istria-ba-living-after-label"
                    value={afterLabel}
                    onChange={setAfterLabel}
                    as="p"
                    className="t-meta text-accent-strong mt-2"
                  >
                    {afterLabel}
                  </EditableText>
                </div>
              </Grid>
            </div>
          </div>
        </Section>

        {/* Where an owner goes from here: the same two doors the case study
            was a teaser for. */}
        <Section tone="quiet" size="lg" measure="text">
          <div className="text-center">
            <EditableText
              id="istria-cta-heading"
              value={ctaHeading}
              onChange={setCtaHeading}
              as="h2"
              className="t-section text-quiet-foreground text-balance"
            >
              {ctaHeading}
            </EditableText>
            <div className="mt-md flex flex-wrap justify-center gap-3">
              <Link to="/property-management" className="cta-base cta-primary">
                {t("oap-cta")}
                <ArrowRight className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              </Link>
              <Link to="/renovations" className="cta-base cta-secondary">
                {t("ways-sub-title-0")}
              </Link>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

const IstriaProject = () => (
  <PageWrapper slug="site--projects-istria">
    <IstriaProjectContent />
  </PageWrapper>
);
export default IstriaProject;
