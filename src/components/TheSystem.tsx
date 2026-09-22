import { useEffect, useState } from "react";
import EditableText from "./admin/EditableText";
import { Section } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import type { TranslationKey } from "@/lib/translations";

/**
 * "How it works" — three steps, on three hairlines.
 *
 * This section used to be six panels on a gold thread, itself the merger of
 * three earlier sections. Six steps is an accurate description of the work and
 * a bad description of the offer: an owner deciding whether to call is not
 * comparing process diagrams. The three that survive are the three that change
 * for them — someone comes, the house gets fixed, somebody else runs it.
 *
 * Numbers in the mono face, a rule above each, no panels: the section is a
 * sequence, and a row of boxes reads as a menu.
 */

const STEPS = [0, 1, 2] as const;

const TheSystem = () => {
  const { t, language } = useLocale();

  const [heading, setHeading] = useState(t("how-heading"));
  const [steps, setSteps] = useState(
    STEPS.map((i) => ({
      title: t(`how-${i}-title` as TranslationKey),
      desc: t(`how-${i}-desc` as TranslationKey),
    }))
  );

  useEffect(() => {
    setHeading(t("how-heading"));
    setSteps(
      STEPS.map((i) => ({
        title: t(`how-${i}-title` as TranslationKey),
        desc: t(`how-${i}-desc` as TranslationKey),
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const update = (index: number, field: "title" | "desc", value: string) =>
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));

  return (
    <Section id="the-system" size="md">
      <EditableText
        id="how-heading"
        value={heading}
        onChange={setHeading}
        as="h2"
        className="t-section text-foreground text-center"
      >
        {heading}
      </EditableText>

      <ol className="grid gap-lg md:grid-cols-3 mt-lg">
        {steps.map((step, index) => (
          <li key={index} className="border-t-2 border-accent pt-5">
            <p className="t-tag text-accent-strong mb-3">
              {String(index + 1).padStart(2, "0")}
            </p>
            <EditableText
              id={`how-${index}-title`}
              value={step.title}
              onChange={(v) => update(index, "title", v)}
              as="h3"
              className="t-block text-foreground text-balance"
            >
              {step.title}
            </EditableText>
            <EditableText
              id={`how-${index}-desc`}
              value={step.desc}
              onChange={(v) => update(index, "desc", v)}
              as="p"
              className="t-body text-muted-foreground mt-2"
            >
              {step.desc}
            </EditableText>
          </li>
        ))}
      </ol>
    </Section>
  );
};

export default TheSystem;
