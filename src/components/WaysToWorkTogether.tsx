import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, TrendingUp } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Section } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import type { TranslationKey } from "@/lib/translations";
import { cn } from "@/lib/utils";

/** Index-aligned with the `*-0`/`*-1` id convention: 0 = commission, 1 = Guaranteed Income. */
const MODEL_ICONS = [TrendingUp, ShieldCheck] as const;

/**
 * The commercial decision, as two plain columns on a hairline — not two
 * Panel cards.
 *
 * Rebuilt 06.10.2026 to match a Lovable reference Almedin pointed to
 * precisely (background, divider and type-scale included, not just
 * structure): an eyebrow + heading + lead header row closed off by a
 * border-b, then two columns split by a single vertical rule (no card fill,
 * no padding box) — each with its own icon+tag row, a large pale "01"/"02"
 * in the display face, title, copy and CTA. The asymmetry that used to carry
 * the argument (7/5 Panels, one filled) is gone; the two columns are now the
 * same width, same as the reference — the argument is in which one has the
 * filled button and which has the outline one, not in which is wider.
 *
 * The CTA keeps the site's gold `cta-primary` rather than the reference's
 * sage-filled button: CLAUDE.md protects gold as the one-action colour
 * site-wide, and that rule outranks a single section's literal copy.
 *
 * ⚠️ The indices do NOT follow the visual order. `*-0` is the commission
 * model, `*-1` the fixed rent — the same mapping the inline-CMS IDs have
 * always had. Only `order` decides what appears first.
 */

const MODELS = [1, 0] as const; // visual order: fixed rent, then commission

const WaysToWorkTogether = () => {
  const { t, language } = useLocale();

  const [eyebrow, setEyebrow] = useState(t("ways-eyebrow"));
  const [heading, setHeading] = useState(t("ways-heading"));
  const [lead, setLead] = useState(t("ways-lead"));
  const [footnote, setFootnote] = useState(t("ways-footnote"));
  const [models, setModels] = useState(
    ([0, 1] as const).map((i) => ({
      tag: t(`ways-model-tag-${i}` as TranslationKey),
      name: t(`ways-model-name-${i}` as TranslationKey),
      summary: t(`ways-model-summary-${i}` as TranslationKey),
      detail: t(`ways-model-detail-${i}` as TranslationKey),
      link: t(`ways-model-link-${i}` as TranslationKey),
    }))
  );

  useEffect(() => {
    setEyebrow(t("ways-eyebrow"));
    setHeading(t("ways-heading"));
    setLead(t("ways-lead"));
    setFootnote(t("ways-footnote"));
    setModels(
      ([0, 1] as const).map((i) => ({
        tag: t(`ways-model-tag-${i}` as TranslationKey),
        name: t(`ways-model-name-${i}` as TranslationKey),
        summary: t(`ways-model-summary-${i}` as TranslationKey),
        detail: t(`ways-model-detail-${i}` as TranslationKey),
        link: t(`ways-model-link-${i}` as TranslationKey),
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const update = (
    index: number,
    field: "tag" | "name" | "summary" | "detail" | "link",
    value: string
  ) => setModels((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));

  return (
    <Section id="ways-to-work" size="lg">
      <div className="grid gap-md border-b border-foreground pb-md md:grid-cols-12 md:items-end">
        <div className="md:col-span-6">
          <EditableText
            id="ways-eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
            as="p"
            className="t-tag text-accent-strong"
          >
            {eyebrow}
          </EditableText>
          <EditableText
            id="ways-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="t-section text-foreground text-balance mt-3"
          >
            {heading}
          </EditableText>
        </div>
        <EditableText
          id="ways-lead"
          value={lead}
          onChange={setLead}
          as="p"
          className="t-body text-muted-foreground md:col-span-4 md:col-start-9"
        >
          {lead}
        </EditableText>
      </div>

      <div className="grid md:grid-cols-2">
        {MODELS.map((i, col) => {
          const model = models[i];
          const isPrimary = i === 1;
          const Icon = MODEL_ICONS[i];
          return (
            <div
              key={i}
              className={cn(
                "py-lg",
                col === 0 ? "border-b border-border md:border-b-0 md:border-r md:pr-xl" : "md:pl-xl"
              )}
            >
              <div className="flex items-center justify-between">
                <Icon className="w-6 h-6 text-accent-strong" strokeWidth={1.5} aria-hidden="true" />
                <EditableText
                  id={`ways-model-tag-${i}`}
                  value={model.tag}
                  onChange={(v) => update(i, "tag", v)}
                  as="span"
                  className="t-tag text-accent-strong"
                >
                  {model.tag}
                </EditableText>
              </div>

              <p className="t-display text-border mt-xl" aria-hidden="true">
                {String(col + 1).padStart(2, "0")}
              </p>

              <EditableText
                id={`ways-model-name-${i}`}
                value={model.name}
                onChange={(v) => update(i, "name", v)}
                as="h3"
                className="t-item text-foreground text-balance mt-3"
              >
                {model.name}
              </EditableText>

              <EditableText
                id={`ways-model-summary-${i}`}
                value={model.summary}
                onChange={(v) => update(i, "summary", v)}
                as="p"
                multiline
                className="t-body text-foreground/80 mt-3 max-w-lg"
              >
                {model.summary}
              </EditableText>

              <EditableText
                id={`ways-model-detail-${i}`}
                value={model.detail}
                onChange={(v) => update(i, "detail", v)}
                as="p"
                multiline
                className="t-body text-muted-foreground mt-2 max-w-lg"
              >
                {model.detail}
              </EditableText>

              <div className="mt-md">
                {isPrimary ? (
                  <Link to="/guaranteed-income" className="cta-base cta-primary">
                    <EditableText
                      id={`ways-model-link-${i}`}
                      value={model.link}
                      onChange={(v) => update(i, "link", v)}
                      as="span"
                    >
                      {model.link}
                    </EditableText>
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  // Same-page anchor to OwnerContactForm, not the
                  // guaranteed-income subpage the primary card links to —
                  // "speak to a person" means the contact form a few
                  // sections down, not a page about the other model
                  // (Almedin, 06.10.2026). A real button here too (not a
                  // text link): the commission model earns its own CTA
                  // weight, just not the gold `cta-primary` the page's one
                  // recommended action keeps.
                  <a href="#get-in-touch" className="cta-base cta-secondary">
                    <EditableText
                      id={`ways-model-link-${i}`}
                      value={model.link}
                      onChange={(v) => update(i, "link", v)}
                      as="span"
                    >
                      {model.link}
                    </EditableText>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <EditableText
        id="ways-footnote"
        value={footnote}
        onChange={setFootnote}
        as="p"
        className="t-body text-muted-foreground border-t border-border pt-md mt-lg"
      >
        {footnote}
      </EditableText>
    </Section>
  );
};

export default WaysToWorkTogether;
