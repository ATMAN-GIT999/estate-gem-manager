import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, TrendingUp } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Panel, Section } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import type { TranslationKey } from "@/lib/translations";
import { cn } from "@/lib/utils";

/** Index-aligned with the `*-0`/`*-1` id convention: 0 = commission, 1 = Guaranteed Income. */
const MODEL_ICONS = [TrendingUp, ShieldCheck] as const;

/**
 * The commercial decision, as two unequal panels on the page's second beige
 * band.
 *
 * The asymmetry is the argument and should stay: the fixed rent is wider, on a
 * filled surface, and carries the gold button, because for most owners of a
 * second home the model without occupancy risk is the one that fits. The
 * commission model sits beside it as a text link, for the owner who would
 * rather keep the upside.
 *
 * ⚠️ The indices do NOT follow the visual order. `*-0` is the commission
 * model, `*-1` the fixed rent — the same mapping the inline-CMS IDs have
 * always had. Only `order` decides what appears first.
 */

const MODELS = [1, 0] as const; // visual order: fixed rent, then commission

const WaysToWorkTogether = () => {
  const { t, language } = useLocale();

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
    // size="lg" (Almedin, 02.10.2026) — see TheSystem.tsx's note.
    <Section id="ways-to-work" tone="quiet" size="lg">
      <div className="max-w-2xl mx-auto text-center">
        <EditableText
          id="ways-heading"
          value={heading}
          onChange={setHeading}
          as="h2"
          className="t-section text-foreground text-balance"
        >
          {heading}
        </EditableText>
        <EditableText
          id="ways-lead"
          value={lead}
          onChange={setLead}
          as="p"
          className="t-body text-muted-foreground mt-3"
        >
          {lead}
        </EditableText>
      </div>

      {/* A raw 12-column grid, not <Grid cols={2}>: the two halves are
          deliberately unequal (7 / 5). */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-md mt-lg items-start">
        {MODELS.map((i) => {
          const model = models[i];
          const isPrimary = i === 1;
          const Icon = MODEL_ICONS[i];
          return (
            <div key={i} className={cn(isPrimary ? "md:col-span-7" : "md:col-span-5")}>
              <Panel className={cn("h-full", isPrimary && "bg-background")}>
                <Icon className="w-7 h-7 text-accent-strong mb-3" strokeWidth={1.5} />
                <EditableText
                  id={`ways-model-tag-${i}`}
                  value={model.tag}
                  onChange={(v) => update(i, "tag", v)}
                  as="p"
                  className={cn("t-tag", isPrimary ? "text-accent-strong" : "text-muted-foreground")}
                >
                  {model.tag}
                </EditableText>

                <EditableText
                  id={`ways-model-name-${i}`}
                  value={model.name}
                  onChange={(v) => update(i, "name", v)}
                  as="h3"
                  className={cn(
                    "text-foreground text-balance mt-2",
                    isPrimary ? "t-section" : "t-block"
                  )}
                >
                  {model.name}
                </EditableText>

                <EditableText
                  id={`ways-model-summary-${i}`}
                  value={model.summary}
                  onChange={(v) => update(i, "summary", v)}
                  as="p"
                  multiline
                  className="t-body text-foreground/80 mt-3"
                >
                  {model.summary}
                </EditableText>

                <EditableText
                  id={`ways-model-detail-${i}`}
                  value={model.detail}
                  onChange={(v) => update(i, "detail", v)}
                  as="p"
                  multiline
                  className="t-body text-muted-foreground mt-2"
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
                    <Link to="/guaranteed-income" className="cta-link">
                      <EditableText
                        id={`ways-model-link-${i}`}
                        value={model.link}
                        onChange={(v) => update(i, "link", v)}
                        as="span"
                      >
                        {model.link}
                      </EditableText>{" "}
                      →
                    </Link>
                  )}
                </div>
              </Panel>
            </div>
          );
        })}
      </div>

      <EditableText
        id="ways-footnote"
        value={footnote}
        onChange={setFootnote}
        as="p"
        className="t-body text-muted-foreground text-center mt-md max-w-xl mx-auto"
      >
        {footnote}
      </EditableText>
    </Section>
  );
};

export default WaysToWorkTogether;
