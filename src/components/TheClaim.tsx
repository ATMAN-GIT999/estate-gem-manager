import { useEffect, useState } from "react";
import EditableText from "./admin/EditableText";
import { Grid, MediaFrame, Section } from "./layout";
import claimImage from "@/assets/wf-hero-villa-higueron.jpg";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * The sentence the whole owner page is an argument for, with one photograph
 * beside it.
 *
 * Rebuilt 02.10.2026 to match the Lovable "template" rebuild Almedin
 * reviewed: a framed photograph (a thick beige border, like a print in a
 * mount, not full-bleed) on one side, a plain two-line heading and a lead
 * paragraph in a quiet box on the other — no overlap, no staggering, no
 * per-line colour split. That replaces the previous staggered/overlapping
 * composition (sage-line/gold-line labels, photo pulled up under the text)
 * from 26.09.2026, which is gone now rather than kept as an alternate path —
 * see git history if it needs resurrecting.
 */
const TheClaim = () => {
  const { t, language } = useLocale();
  const [sectionHeading, setSectionHeading] = useState(t("claim-section-heading"));
  const [eyebrow, setEyebrow] = useState(t("claim-eyebrow"));
  const [heading, setHeading] = useState(t("claim-heading"));
  const [lead, setLead] = useState(t("claim-lead"));
  const [image, setImage] = useState<string | undefined>(claimImage);

  useEffect(() => {
    setSectionHeading(t("claim-section-heading"));
    setEyebrow(t("claim-eyebrow"));
    setHeading(t("claim-heading"));
    setLead(t("claim-lead"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    // size="lg" (Almedin, 02.10.2026): brought up from "md" so the owner
    // page's main sections breathe the way the Lovable template comparison
    // did — see TheSystem.tsx's own note for the full reasoning.
    <Section size="lg">
      {/* Section-level eyebrow above the whole image+text pairing, not part
          of either column (Almedin, 03.10.2026 — was a t-section heading,
          corrected to an eyebrow the same day). */}
      <EditableText
        id="claim-section-heading"
        value={sectionHeading}
        onChange={setSectionHeading}
        as="p"
        className="t-tag text-accent-strong text-center mb-lg"
      >
        {sectionHeading}
      </EditableText>

      {/* items-end: the lead box's bottom edge lines up with the photo's,
          the same bottom-alignment the Lovable reference uses — a
          deliberate asymmetry (image taller than the text block) rather
          than a stretched, centred pairing. */}
      <Grid className="items-end">
        {/* The thick quiet-tone border is a frame, not a Panel hairline —
            the one place on this page a photograph is meant to look like a
            print in a mount rather than full-bleed reportage. Literal px,
            same precedent as Panel.tsx's own padding: a deliberate shape,
            not a guess past the spacing ladder. */}
        <div className="md:col-span-7 border-[14px] border-quiet">
          <MediaFrame
            id="claim-image"
            src={image}
            onChange={setImage}
            alt="Villa Higuerón — the stairwell's angled glass over the pool"
            note="We take it on — Villa Higuerón's stairwell glass over the pool"
            aspect="photo"
          />
        </div>

        <div className="md:col-span-5">
          <EditableText
            id="claim-eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
            as="p"
            className="t-tag text-accent-strong"
          >
            {eyebrow}
          </EditableText>

          <EditableText
            id="claim-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            multiline
            className="t-section text-foreground text-balance mt-3 whitespace-pre-line"
          >
            {heading}
          </EditableText>

          <EditableText
            id="claim-lead"
            value={lead}
            onChange={setLead}
            as="p"
            multiline
            className="t-body text-quiet-foreground bg-quiet p-md mt-md"
          >
            {lead}
          </EditableText>
        </div>
      </Grid>
    </Section>
  );
};

export default TheClaim;
