import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditableText from "./admin/EditableText";
import { Container, Grid, MediaFrame } from "./layout";
import istriaImage from "@/assets/wf-istria-complex.webp";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * The Istria case study, full-bleed — split out of
 * RenovationsAndInvestments.tsx 06.10.2026 to match a Lovable reference
 * Almedin pointed to: a full-height photograph with the text sitting over a
 * fade at the bottom, not a framed photo beside a text column.
 *
 * ⚠️ Almedin, 06.10.2026: the first pass used OwnerContactForm's full-image
 * `--overlay-ink-fade`, which darkens the whole photo — too much here; the
 * reference only fades the bottom third, where the text sits, and leaves
 * the rest of the photo at full brightness. `bg-gradient-to-t from-primary
 * to-transparent` instead — the same sage token the fade used, just shaped
 * as a bottom-only gradient instead of a flat full-image wash. Height is
 * also the reference's own `min-h-[680px]`, not an approximated clamp.
 *
 * ⚠️ Croatia is not an inventory market — it is where this renovation
 * happened and where /investments looks for opportunities, which is a
 * different claim from "we manage homes there" (docs/PROJECT.md §1). The CTA
 * goes to the real case-study page (/projects/istria), not a placeholder.
 */
const IstriaBand = () => {
  const { t, language } = useLocale();
  const [eyebrow, setEyebrow] = useState(t("case-eyebrow"));
  const [heading, setHeading] = useState(t("case-heading"));
  const [lead, setLead] = useState(t("case-lead"));
  const [cta, setCta] = useState(t("case-cta"));
  const [image, setImage] = useState<string | undefined>(istriaImage);

  useEffect(() => {
    setEyebrow(t("case-eyebrow"));
    setHeading(t("case-heading"));
    setLead(t("case-lead"));
    setCta(t("case-cta"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <section className="relative flex items-end overflow-hidden min-h-[680px]">
      <MediaFrame
        id="case-istria-image"
        src={image}
        onChange={setImage}
        alt="The renovated villa complex in Istria, seen from the air"
        note="Istria — aerial of the renovated villa complex, wide crop"
        fill
        onPrimary
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" aria-hidden="true" />

      <Container className="relative z-10 pb-xl pt-lg">
        <Grid className="border-t border-primary-foreground/60 pt-md items-end">
          <EditableText
            id="case-eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
            as="p"
            className="t-tag text-accent-on-primary md:col-span-3"
          >
            {eyebrow}
          </EditableText>
          <div className="md:col-span-6">
            <EditableText
              id="case-heading"
              value={heading}
              onChange={setHeading}
              as="h2"
              className="t-section text-primary-foreground text-balance"
            >
              {heading}
            </EditableText>
            <EditableText
              id="case-lead"
              value={lead}
              onChange={setLead}
              as="p"
              multiline
              className="t-body text-primary-foreground/80 mt-3 max-w-xl"
            >
              {lead}
            </EditableText>
          </div>
          <Link
            to="/projects/istria"
            className="md:col-span-3 inline-flex items-center gap-3 border-b border-primary-foreground pb-2 t-item text-primary-foreground self-end justify-self-start md:justify-self-end"
          >
            <EditableText id="case-cta" value={cta} onChange={setCta} as="span">
              {cta}
            </EditableText>
            <span aria-hidden="true">→</span>
          </Link>
        </Grid>
      </Container>
    </section>
  );
};

export default IstriaBand;
