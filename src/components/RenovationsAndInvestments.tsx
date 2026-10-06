import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Handshake, Palette } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Grid, Section } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import type { TranslationKey } from "@/lib/translations";

/** Index-aligned with PILLARS: 0 = Renovations, 1 = Investments. */
const PILLAR_ICONS = [Palette, Handshake] as const;

/**
 * Renovations and Investments, as a bordered list beside the section intro —
 * same composition as the "How it works" rebuild (TheSystem.tsx), on a
 * Lovable reference Almedin pointed to on 06.10.2026. The Istria case study
 * that used to close this same section is its own full-bleed band now
 * (IstriaBand.tsx), not a 7/5 pairing under a divider here.
 *
 * The two pillars stay equal weight — unlike "Two ways", where the asymmetry
 * is the argument, Renovations and Investments are presented as the same
 * kind of offer.
 */

const PILLARS = [0, 1] as const;
const PILLAR_LINKS = ["/renovations", "/investments"] as const;

const RenovationsAndInvestments = () => {
  const { t, language } = useLocale();

  const [eyebrow, setEyebrow] = useState(t("ri-eyebrow"));
  const [heading, setHeading] = useState(t("ri-heading"));
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
    <Section id="beyond-management" size="lg" className="scroll-mt-24">
      <Grid className="items-start">
        <div className="md:col-span-5">
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
            className="t-section text-foreground text-balance mt-3 max-w-md"
          >
            {heading}
          </EditableText>
        </div>

        <ol className="md:col-span-7 border-t border-foreground">
          {pillars.map((pillar, index) => {
            const Icon = PILLAR_ICONS[index];
            return (
              <li key={index} className="border-b border-border/70 py-lg sm:grid sm:grid-cols-[64px_1fr] sm:gap-5">
                <div>
                  <p className="t-meta text-muted-foreground">{String(index + 1).padStart(2, "0")}</p>
                  <Icon className="w-5 h-5 text-accent-strong mt-3" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <Link to={PILLAR_LINKS[index]} className="group block mt-3 sm:mt-0">
                  <EditableText
                    id={`ways-sub-title-${index}`}
                    value={pillar.tag}
                    onChange={(v) => update(index, "tag", v)}
                    as="h3"
                    className="t-item text-foreground group-hover:text-accent-strong transition-colors"
                  >
                    {pillar.tag}
                  </EditableText>
                  <EditableText
                    id={`beyond-title-${index}`}
                    value={pillar.title}
                    onChange={(v) => update(index, "title", v)}
                    as="p"
                    className="t-body text-foreground/80 mt-1"
                  >
                    {pillar.title}
                  </EditableText>
                  <EditableText
                    id={`ways-sub-desc-${index}`}
                    value={pillar.desc}
                    onChange={(v) => update(index, "desc", v)}
                    as="p"
                    multiline
                    className="t-body text-muted-foreground mt-3 max-w-lg"
                  >
                    {pillar.desc}
                  </EditableText>
                </Link>
              </li>
            );
          })}
        </ol>
      </Grid>
    </Section>
  );
};

export default RenovationsAndInvestments;
