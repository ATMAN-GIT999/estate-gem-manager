import { useEffect, useState } from "react";
import EditableText from "./admin/EditableText";
import { Grid, Section } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * "We don't just manage homes. We engineer high-performance assets." — one
 * statement on its own sage-green band, between "How it works" and "Two ways
 * to work with us".
 *
 * Split out of TheSystem.tsx 06.10.2026 (Almedin, matching a Lovable
 * reference): that section used to close with this same line, centred,
 * under the six steps. The reference gives it its own full-bleed dark band
 * instead — a pause with one sentence, the same role the sage-green fill
 * plays elsewhere on this page (WaysToWorkTogether, OwnerContactForm). The
 * copy is unchanged; only the section it lives in is new.
 */
const WeEngineerAssets = () => {
  const { t, language } = useLocale();
  const [eyebrow, setEyebrow] = useState(t("pov-eyebrow"));
  const [line, setLine] = useState(t("sys-closing-line"));

  useEffect(() => {
    setEyebrow(t("pov-eyebrow"));
    setLine(t("sys-closing-line"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <Section tone="primary" size="lg">
      <Grid>
        <EditableText
          id="pov-eyebrow"
          value={eyebrow}
          onChange={setEyebrow}
          as="p"
          className="t-tag text-accent-on-primary md:col-span-3"
        >
          {eyebrow}
        </EditableText>
        <EditableText
          id="sys-closing-line"
          value={line}
          onChange={setLine}
          as="h2"
          multiline
          className="t-section text-primary-foreground text-balance whitespace-pre-line md:col-span-8 md:col-start-5"
        >
          {line}
        </EditableText>
      </Grid>
    </Section>
  );
};

export default WeEngineerAssets;
