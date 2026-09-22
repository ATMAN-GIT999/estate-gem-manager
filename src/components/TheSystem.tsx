import { useEffect, useState } from "react";
import EditableText from "./admin/EditableText";
import { Divider, Section } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import type { TranslationKey } from "@/lib/translations";

/**
 * "How it works" — six steps, on six hairlines.
 *
 * Back to the original six-step process (Almedin, 22.09.2026) after a round
 * that cut it to three. Step 01 here is a merge, not a straight revert: the
 * three-step version's first two steps (the on-site visit, bringing the
 * property up to standard) and the original six-step version's own step 01
 * ("Optimal Listing") described three parts of the same first phase, so they
 * are now one step instead of being said twice. Steps 02-06 are the original
 * copy, unedited — see the translation keys' own comment in translations.ts.
 *
 * Numbers in the mono face, a rule above each, no panels: the section is a
 * sequence, and a row of boxes reads as a menu.
 */

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

  const [heading, setHeading] = useState(t("how-heading"));
  const [closing, setClosing] = useState(t("sys-closing-line"));
  const [steps, setSteps] = useState(
    STEP_KEYS.map(({ titleKey, descKey }) => ({ title: t(titleKey), desc: t(descKey) }))
  );

  useEffect(() => {
    setHeading(t("how-heading"));
    setClosing(t("sys-closing-line"));
    setSteps(STEP_KEYS.map(({ titleKey, descKey }) => ({ title: t(titleKey), desc: t(descKey) })));
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
              id={STEP_KEYS[index].titleKey}
              value={step.title}
              onChange={(v) => update(index, "title", v)}
              as="h3"
              className="t-block text-foreground text-balance"
            >
              {step.title}
            </EditableText>
            <EditableText
              id={STEP_KEYS[index].descKey}
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

      <div className="mt-2xl max-w-2xl mx-auto text-center">
        <Divider tone="gold" className="max-w-[6rem] mx-auto mb-lg" />
        <EditableText
          id="sys-closing-line"
          value={closing}
          onChange={setClosing}
          as="p"
          multiline
          className="t-display font-bold text-foreground text-balance whitespace-pre-line"
        >
          {closing}
        </EditableText>
      </div>
    </Section>
  );
};

export default TheSystem;
