import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [heading, setHeading] = useState(t("oap-heading"));
  const [subheading, setSubheading] = useState(t("oap-subheading"));
  const [ctaText, setCtaText] = useState(t("oap-cta"));
  const [image, setImage] = useState(oapVillaEntrance);

  useEffect(() => {
    setHeading(t("oap-heading"));
    setSubheading(t("oap-subheading"));
    setCtaText(t("oap-cta"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <section className="relative flex items-center overflow-hidden min-h-[clamp(20rem,52vh,28rem)]">
      <MediaFrame
        id="oap-image"
        src={image}
        onChange={setImage}
        alt="A Frontier Residences managed property"
        note="Own a Property — a property interior, warm and lived-in"
        fill
      />
      <div className="absolute inset-0 overlay-media" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="max-w-md space-y-xs">
          {/* h2, not h1 — the page's h1 is the hero. */}
          <EditableText
            id="oap-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="t-section text-white text-balance drop-shadow-2xl"
          >
            {heading}
          </EditableText>
          <EditableText
            id="oap-subheading"
            value={subheading}
            onChange={setSubheading}
            as="p"
            className="t-block text-white/90 drop-shadow-lg"
          >
            {subheading}
          </EditableText>

          <div className="pt-sm">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold px-8 py-6 text-base"
            >
              <Link to="/property-management">
                <EditableText id="oap-cta" value={ctaText} onChange={setCtaText} as="span">
                  {ctaText}
                </EditableText>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default OwnAProperty;
