import { useEffect, useState } from "react";
import { BarChart3, ClipboardCheck, Globe, MessageSquareText, TrendingUp, Wrench } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Grid, Section } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import type { TranslationKey } from "@/lib/translations";

/**
 * "How it works" — six steps, as a bordered list beside the section intro.
 *
 * Rebuilt 06.10.2026 to match a Lovable reference Almedin pointed to: eyebrow
 * + heading + lead in a narrow left column, the six steps as rows in a wider
 * right column (number, icon+title, body in three sub-columns), each row on
 * its own hairline instead of a 3-column grid of bordered cards. The content
 * is untouched — same six steps, same copy, same icon set — only the
 * composition changed. "We don't just manage homes." used to close this same
 * section; it is its own dark band now (WeEngineerAssets.tsx), the way the
 * reference treats it, not a line under the steps.
 */

/** Index-aligned with STEP_KEYS: visit & list, pricing, reach, guests, care, reporting. */
const STEP_ICONS = [ClipboardCheck, TrendingUp, Globe, MessageSquareText, Wrench, BarChart3] as const;

const STEP_KEYS: ReadonlyArray<{ titleKey: TranslationKey; descKey: TranslationKey }> = [
  { titleKey: "how-0-title", descKey: "how-0-desc" },
  { titleKey: "sys-label-1", descKey: "sys-body-1" },
  { titleKey: "sys-label-2", descKey: "sys-body-2" },
  { titleKey: "sys-label-3", descKey: "sys-body-3" },
  { titleKey: "sys-label-4", descKey: "sys-body-4" },
  { titleKey: "sys-label-5", descKey: "sys-body-5" },
];

const TheSystem = () => {
  const { t, language } = useLocale();

  const [eyebrow, setEyebrow] = useState(t("how-eyebrow"));
  const [heading, setHeading] = useState(t("how-heading"));
  const [lead, setLead] = useState(t("how-lead"));
  const [steps, setSteps] = useState(
    STEP_KEYS.map(({ titleKey, descKey }) => ({ title: t(titleKey), desc: t(descKey) }))
  );

  useEffect(() => {
    setEyebrow(t("how-eyebrow"));
    setHeading(t("how-heading"));
    setLead(t("how-lead"));
    setSteps(STEP_KEYS.map(({ titleKey, descKey }) => ({ title: t(titleKey), desc: t(descKey) })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const update = (index: number, field: "title" | "desc", value: string) =>
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));

  return (
    <Section id="the-system" size="lg">
      <Grid className="items-start">
        <div className="md:col-span-4">
          <EditableText
            id="how-eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
            as="p"
            className="t-tag text-accent-strong"
          >
            {eyebrow}
          </EditableText>
          <EditableText
            id="how-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="t-section text-foreground mt-3"
          >
            {heading}
          </EditableText>
          <EditableText
            id="how-lead"
            value={lead}
            onChange={setLead}
            as="p"
            className="t-body text-muted-foreground mt-md max-w-xs"
          >
            {lead}
          </EditableText>
        </div>

        <ol className="md:col-span-7 md:col-start-6 border-t border-foreground">
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <li key={index} className="grid gap-5 border-b border-border py-md sm:grid-cols-[64px_1fr_2fr] sm:items-start">
                <p className="t-section text-border">{String(index + 1).padStart(2, "0")}</p>
                <div className="flex items-center gap-3 sm:block">
                  <Icon className="w-5 h-5 text-accent-strong shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <EditableText
                    id={STEP_KEYS[index].titleKey}
                    value={step.title}
                    onChange={(v) => update(index, "title", v)}
                    as="h3"
                    className="t-block text-foreground sm:mt-3"
                  >
                    {step.title}
                  </EditableText>
                </div>
                <EditableText
                  id={STEP_KEYS[index].descKey}
                  value={step.desc}
                  onChange={(v) => update(index, "desc", v)}
                  as="p"
                  className="t-body text-muted-foreground"
                >
                  {step.desc}
                </EditableText>
              </li>
            );
          })}
        </ol>
      </Grid>
    </Section>
  );
};

export default TheSystem;
