import { useEffect, useState } from "react";
import EditableText from "./admin/EditableText";
import { MediaFrame, Section } from "./layout";
import claimImage from "@/assets/wf-we-take-it-on.webp";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * The sentence the whole owner page is an argument for, on its own, with one
 * photograph under it.
 *
 * Centred and alone on purpose: it is the only section of the page with
 * nothing to click. Everything above it is the calculator and the numbers,
 * everything below is how the work actually gets done.
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
    <Section size="md">
      <div className="max-w-2xl mx-auto text-center">
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
          className="t-section text-foreground text-balance whitespace-pre-line mt-3"
        >
          {heading}
        </EditableText>
        <EditableText
          id="claim-lead"
          value={lead}
          onChange={setLead}
          as="p"
          className="t-body text-muted-foreground mt-4 max-w-xl mx-auto"
        >
          {lead}
        </EditableText>
      </div>

      <div className="mt-lg">
        <MediaFrame
          id="claim-image"
          src={image}
          onChange={setImage}
          alt="A cluster of modern villas with private pools above the Costa del Sol"
          note="We take it on — aerial of a modern white villa cluster with pools, wide crop"
          aspect="wide"
          className="aspect-[21/9]"
        />
      </div>
    </Section>
  );
};

export default TheClaim;
