import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Handshake, Palette } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Grid, MediaFrame, Panel, Section } from "./layout";
import istriaImage from "@/assets/wf-istria-complex.webp";
import { useLocale } from "@/contexts/LocaleContext";
import type { TranslationKey } from "@/lib/translations";

/** Index-aligned with PILLARS: 0 = Renovations, 1 = Investments. */
const PILLAR_ICONS = [Palette, Handshake] as const;

/**
 * Renovations and Investments, as a section of their own again, and as equals.
 *
 * They spent a while as a footnote under "Two ways to work with us", behind a
 * gold break — which made the two read as side doors for owners the main offer
 * did not fit. They are not side doors; they are the second half of what the
 * company does, and an owner weighing a renovation is a better prospect than
 * one who is only comparing commission rates.
 *
 * The two panels are deliberately the same size, unlike the two models in
 * "Two ways", where the asymmetry is the argument. Under them, one case study:
 * a single full-width photograph and a short result, not a gallery.
 */

const PILLARS = [0, 1] as const;
const PILLAR_LINKS = ["/renovations", "/investments"] as const;

const RenovationsAndInvestments = () => {
  const { t, language } = useLocale();

  const [eyebrow, setEyebrow] = useState(t("ri-eyebrow"));
  const [heading, setHeading] = useState(t("ri-heading"));
  const [caseEyebrow, setCaseEyebrow] = useState(t("case-eyebrow"));
  const [caseHeading, setCaseHeading] = useState(t("case-heading"));
  const [caseLead, setCaseLead] = useState(t("case-lead"));
  const [caseCta, setCaseCta] = useState(t("case-cta"));
  const [caseImage, setCaseImage] = useState<string | undefined>(istriaImage);
  const [pillars, setPillars] = useState(
    PILLARS.map((i) => ({
      tag: t(`ways-sub-title-${i}` as TranslationKey),
      title: t(`beyond-title-${i}` as TranslationKey),
      desc: t(`ways-sub-desc-${i}` as TranslationKey),
    }))
  );

  useEffect(() => {
    setEyebrow(t("ri-eyebrow"));
    setHeading(t("ri-heading"));
    setCaseEyebrow(t("case-eyebrow"));
    setCaseHeading(t("case-heading"));
    setCaseLead(t("case-lead"));
    setCaseCta(t("case-cta"));
    setPillars(
      PILLARS.map((i) => ({
        tag: t(`ways-sub-title-${i}` as TranslationKey),
        title: t(`beyond-title-${i}` as TranslationKey),
        desc: t(`ways-sub-desc-${i}` as TranslationKey),
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const update = (index: number, field: "tag" | "title" | "desc", value: string) =>
    setPillars((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));

  return (
    <Section id="beyond-management" size="md" className="scroll-mt-24">
      <div className="max-w-2xl mx-auto text-center">
        <EditableText
          id="ri-eyebrow"
          value={eyebrow}
          onChange={setEyebrow}
          as="p"
          className="t-tag text-accent-strong"
        >
          {eyebrow}
        </EditableText>
        <EditableText
          id="ri-heading"
          value={heading}
          onChange={setHeading}
          as="h2"
          className="t-section text-foreground text-balance mt-3"
        >
          {heading}
        </EditableText>
      </div>

      <Grid cols={2} className="mt-lg">
        {pillars.map((pillar, index) => {
          const Icon = PILLAR_ICONS[index];
          return (
          <Link key={index} to={PILLAR_LINKS[index]} className="group">
            <Panel className="h-full">
              <Icon className="w-7 h-7 text-accent-strong mb-3" strokeWidth={1.5} />
              {/* "Renovations" / "Investments" as the heading (Almedin,
                  22.09.2026) — previously the small eyebrow tag above
                  `beyond-title`, which is now the supporting line instead. */}
              <EditableText
                id={`ways-sub-title-${index}`}
                value={pillar.tag}
                onChange={(v) => update(index, "tag", v)}
                as="h3"
                className="t-block text-foreground text-balance group-hover:text-accent-strong transition-colors"
              >
                {pillar.tag}
              </EditableText>
              <EditableText
                id={`beyond-title-${index}`}
                value={pillar.title}
                onChange={(v) => update(index, "title", v)}
                as="p"
                className="t-item text-foreground/80 mt-1"
              >
                {pillar.title}
              </EditableText>
              <EditableText
                id={`ways-sub-desc-${index}`}
                value={pillar.desc}
                onChange={(v) => update(index, "desc", v)}
                as="p"
                multiline
                className="t-body text-muted-foreground mt-3"
              >
                {pillar.desc}
              </EditableText>
            </Panel>
          </Link>
          );
        })}
      </Grid>

      <hr className="border-t border-border mt-xl" />

      {/* One case study, one photograph. ⚠️ Croatia is not an inventory
          market — it is where this renovation happened and where
          /investments looks for opportunities, which is a different claim
          from "we manage homes there" (docs/PROJECT.md §1). */}
      <div className="grid gap-lg lg:grid-cols-12 lg:items-center mt-xl">
        <div className="lg:col-span-7">
          <MediaFrame
            id="case-istria-image"
            src={caseImage}
            onChange={setCaseImage}
            alt="The renovated villa complex in Istria, seen from the air"
            note="Istria — aerial of the renovated villa complex, wide crop"
            aspect="wide"
          />
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <EditableText
            id="case-eyebrow"
            value={caseEyebrow}
            onChange={setCaseEyebrow}
            as="p"
            className="t-tag text-accent-strong"
          >
            {caseEyebrow}
          </EditableText>
          <EditableText
            id="case-heading"
            value={caseHeading}
            onChange={setCaseHeading}
            as="h3"
            className="t-section text-foreground text-balance mt-3"
          >
            {caseHeading}
          </EditableText>
          <EditableText
            id="case-lead"
            value={caseLead}
            onChange={setCaseLead}
            as="p"
            multiline
            className="t-body text-muted-foreground mt-3"
          >
            {caseLead}
          </EditableText>
          <Link to="/projects/istria" className="cta-link mt-md inline-block">
            <EditableText id="case-cta" value={caseCta} onChange={setCaseCta} as="span">
              {caseCta}
            </EditableText>{" "}
            →
          </Link>
        </div>
      </div>
    </Section>
  );
};

export default RenovationsAndInvestments;
