import { useEffect, useState } from "react";
import EditableText from "./admin/EditableText";
import { Grid, MediaFrame, Section } from "./layout";
import claimImage from "@/assets/wf-hero-villa-higueron.jpg";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * The sentence the whole owner page is an argument for, with one photograph
 * beside it.
 *
 * Rebuilt again 06.10.2026 to match a second Lovable reference Almedin
 * pointed to ("less for you to manage" section): a short rule + eyebrow
 * sitting directly over the heading in a narrow (4/12) text column, a plain
 * lead paragraph (no quiet-tone box), and a clean full-bleed photo with a
 * caption line underneath instead of a thick frame. Replaces the
 * 02.10.2026 version (framed photo, boxed lead, a second centred
 * section-level eyebrow above the pairing) — that one is gone rather than
 * kept as an alternate path; see git history to resurrect it.
 */
const TheClaim = () => {
  const { t, language } = useLocale();
  const [eyebrow, setEyebrow] = useState(t("claim-eyebrow"));
  const [heading, setHeading] = useState(t("claim-heading"));
  const [lead, setLead] = useState(t("claim-lead"));
  const [image, setImage] = useState<string | undefined>(claimImage);

  useEffect(() => {
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
      <Grid className="items-start">
        <div className="md:col-span-4">
          {/* Short rule + eyebrow sitting directly over the heading, not a
              separate section-level line above the whole pairing. */}
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-foreground" aria-hidden="true" />
            <EditableText
              id="claim-eyebrow"
              value={eyebrow}
              onChange={setEyebrow}
              as="p"
              className="t-tag text-foreground"
            >
              {eyebrow}
            </EditableText>
          </div>

          <EditableText
            id="claim-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            multiline
            className="t-section text-foreground text-balance mt-md whitespace-pre-line"
          >
            {heading}
          </EditableText>

          <EditableText
            id="claim-lead"
            value={lead}
            onChange={setLead}
            as="p"
            multiline
            className="t-body text-muted-foreground mt-md max-w-sm"
          >
            {lead}
          </EditableText>
        </div>

        <figure className="md:col-span-7 md:col-start-6">
          <MediaFrame
            id="claim-image"
            src={image}
            onChange={setImage}
            alt="Villa Higuerón — the stairwell's angled glass over the pool"
            note="We take it on — Villa Higuerón's stairwell glass over the pool"
            aspect="photo"
          />
          <figcaption className="mt-sm pt-sm border-t border-border flex justify-between t-meta text-muted-foreground">
            <span>{t("claim-caption-left")}</span>
            <span>{t("claim-caption-right")}</span>
          </figcaption>
        </figure>
      </Grid>
    </Section>
  );
};

export default TheClaim;
