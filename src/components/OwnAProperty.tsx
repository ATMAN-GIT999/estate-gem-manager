import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Container, MediaFrame } from "./layout";
import oapVillaEntrance from "@/assets/oap-villa-entrance.webp";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * The hand-off between the two halves of the site: everything above is written
 * for a guest choosing a stay, everything it leads to is written for an owner
 * choosing a manager.
 *
 * It used to repeat the four portfolio numbers (41 properties, 1500+
 * reservations, 8 destinations, 50+ collaborators) and later ran as a plain
 * centred block on a muted band. Rebuilt as a photograph with the heading set
 * left, on Almedin's direction (OmniVillas' own treatment of this kind of
 * section) — the same `MediaFrame fill` + `overlay-media` pattern the hero and
 * Relax already use, so a third full-bleed photo band on the site reads as
 * the established pattern rather than a one-off.
 *
 * Left-aligned is the actual change from the hero/Relax pattern, not just the
 * photo: those two are centred because they open or pause the page. This one
 * is a doorway with a name on it, and a name reads left, not centred over a
 * field of text like a title card.
 *
 * The question is still what does the work. An owner scrolling past reads
 * "Own a Property?" and stops because it is addressed to them, not because
 * the section shouts.
 */
const OwnAProperty = () => {
  const { t, language } = useLocale();
  const [eyebrow, setEyebrow] = useState(t("oap-eyebrow"));
  const [heading, setHeading] = useState(t("oap-heading"));
  const [subheading, setSubheading] = useState(t("oap-subheading"));
  const [ctaText, setCtaText] = useState(t("oap-cta"));
  const [image, setImage] = useState(oapVillaEntrance);

  useEffect(() => {
    setEyebrow(t("oap-eyebrow"));
    setHeading(t("oap-heading"));
    setSubheading(t("oap-subheading"));
    setCtaText(t("oap-cta"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    // The last band before the footer, and the one hand-off from the guest
    // half to the owner half. Full-bleed photograph darkened by
    // --overlay-ink-fade until its bottom edge IS the footer's ink, so the two
    // meet with no seam — that fade is why there is no gold rule here.
    <section className="relative flex items-center overflow-hidden min-h-[clamp(24rem,60vh,34rem)]">
      <MediaFrame
        id="oap-image"
        src={image}
        onChange={setImage}
        alt="The entrance to a Frontier Residences managed villa"
        note="Own a Property — a villa entrance or garden, warm and lived-in"
        fill
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--overlay-ink-fade)" }}
        aria-hidden="true"
      />

      {/* Left-aligned, the type and button taken from the Lovable landing
          reference (Almedin, 07.10.2026). The photograph, the ink fade and the
          seamless join with the footer are deliberately NOT — those stay as
          they were. */}
      <Container className="relative z-10 py-2xl">
        <div className="max-w-xl space-y-sm">
          <EditableText
            id="oap-eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
            as="p"
            className="t-tag text-accent-on-primary"
          >
            {eyebrow}
          </EditableText>

          {/* h2, not h1 — the page's h1 is the hero. +20% over t-section's
              clamp(1.5rem,1.1rem+1.8vw,2.25rem) (Almedin, 29.09.2026,
              recomputed 02.10.2026 when the base grew) — every endpoint
              scaled by 1.2; `text-[]` only touches font-size, so
              weight/line-height/tracking still come from t-section itself. */}
          <EditableText
            id="oap-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="t-feature text-white text-balance"
          >
            {heading}
          </EditableText>
          <EditableText
            id="oap-subheading"
            value={subheading}
            onChange={setSubheading}
            as="p"
            className="t-body text-lg text-white/85 max-w-md"
          >
            {subheading}
          </EditableText>

          <div className="pt-sm">
            <Link
              to="/property-management"
              className="group cta-base cta-square cta-caps cta-brass-outline h-auto py-4 px-7"
            >
              <EditableText id="oap-cta" value={ctaText} onChange={setCtaText} as="span">
                {ctaText}
              </EditableText>
              <ArrowRight
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default OwnAProperty;
