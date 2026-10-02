import { useEffect, useState } from "react";
import { BarChart3, ClipboardCheck, Globe, MessageSquareText, TrendingUp, Wrench } from "lucide-react";
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
 * sequence, and a row of boxes reads as a menu. Each step also carries a thin
 * gold line icon opposite its number (Almedin, 26.09.2026), the same treatment
 * as "What every stay includes" and the pillars under Renovations.
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
    // size="lg" (Almedin, 02.10.2026): a Lovable rebuild of this page used
    // consistently for its content sections (≈96-128px top/bottom at desktop
    // widths) made ours look cramped by comparison — our own "md" tier tops
    // out at ~77px. "lg" (our existing --space-2xl step, ~58-112px) gets
    // within a few px of that without inventing a new spacing value. Applied
    // the same way across TheClaim, WaysToWorkTogether,
    // RenovationsAndInvestments and AboutMini; TrustBand and WorkingWith stay
    // on their lighter "sm" tier on purpose — they are breather bands between
    // the heavier content sections, which is exactly how the Lovable version
    // treated its own stats/logos rows too.
    <Section id="the-system" size="lg">
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
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[index];
          return (
          <li key={index} className="border-t-2 border-accent pt-5">
            <div className="flex items-center justify-between mb-3">
              <Icon className="w-7 h-7 text-accent-strong" strokeWidth={1.5} aria-hidden="true" />
              <p className="t-tag text-accent-strong">{String(index + 1).padStart(2, "0")}</p>
            </div>
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
          );
        })}
      </ol>

      {/* Divider/heading treatment matched to the Lovable reference
          (Almedin, 03.10.2026): `bar` (full-opacity gold, not the
          translucent `gold` tone) at its own width/weight override to land
          on Lovable's 64px/1px line, and the heading's size/weight/leading
          overridden the same way Hero.tsx and OwnAProperty.tsx already
          override .t-display's size — this role reads smaller and medium,
          not the full H1 scale at font-bold. */}
      <div className="mt-2xl max-w-4xl mx-auto text-center">
        <Divider tone="bar" className="w-16 border-t mx-auto mb-lg" />
        <EditableText
          id="sys-closing-line"
          value={closing}
          onChange={setClosing}
          as="p"
          multiline
          className="t-display font-medium text-[clamp(1.875rem,1.6rem+3vw,3rem)] leading-tight text-foreground text-balance whitespace-pre-line"
        >
          {closing}
        </EditableText>
      </div>
    </Section>
  );
};

export default TheSystem;
