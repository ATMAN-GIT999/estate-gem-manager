import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Handshake, Palette, ShieldCheck, TrendingUp } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Button } from "@/components/ui/button";
import { Section, Grid, Stack, Panel, Divider } from "./layout";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";

/**
 * The commercial decision, stated as a decision — plus the two side doors for
 * owners it does not fit yet, now merged into one band instead of two.
 *
 * The two halves used to be separate sections (`WaysToWorkTogether` then,
 * three levels down the page, `RenovationsAndInvestments`), which put a whole
 * heavy `AboutMini` between an offer and its footnotes. Almedin supplied a
 * reference layout that reads both halves as one continuous argument — the
 * two models first, then a labelled break ("Beyond management"), then the two
 * side doors — and asked for About Us to follow directly after. Merged here
 * on that instruction (docs/DECISIONS.md §16).
 *
 * The gold rule-label-rule between the two halves is the one deliberate
 * exception to "the gold line is an accent, not a divider between every
 * section" (DESIGN.md §24): this is a genuine sub-chapter break inside one
 * band, not a seam between two sections, which is exactly the case that rule
 * carves out room for.
 *
 * The Renovations/Investments cards lost their `MediaFrame` placeholder image
 * in the move — the reference layout runs icon + text only, no photo slot,
 * and no photograph existed to fill it anyway (`beyond-image-0/1` retired).
 */
const WaysToWorkTogether = () => {
  const { t, language } = useLocale();
  const [eyebrow, setEyebrow] = useState(t("ways-eyebrow"));
  const [heading, setHeading] = useState(t("ways-heading"));

  const buildModels = () => [
    {
      name: t("ways-model-name-0"),
      summary: t("ways-model-summary-0"),
      detail: t("ways-model-detail-0"),
      href: "/guaranteed-income",
      linkText: t("ways-model-link-0"),
      Icon: TrendingUp,
    },
    {
      name: t("ways-model-name-1"),
      summary: t("ways-model-summary-1"),
      detail: t("ways-model-detail-1"),
      href: "/guaranteed-income",
      linkText: t("ways-model-link-1"),
      Icon: ShieldCheck,
    },
  ];
  const [models, setModels] = useState(buildModels());

  const [beyondEyebrow, setBeyondEyebrow] = useState(t("beyond-eyebrow"));
  const [beyondHeading, setBeyondHeading] = useState(t("beyond-heading"));

  const buildPaths = () => [
    {
      label: t("ways-sub-title-0"),
      title: t("beyond-title-0"),
      description: t("ways-sub-desc-0"),
      href: "/renovations",
      linkText: t("ways-sub-link-0"),
      Icon: Palette,
    },
    {
      label: t("ways-sub-title-1"),
      title: t("beyond-title-1"),
      description: t("ways-sub-desc-1"),
      href: "/investments",
      linkText: t("ways-sub-link-1"),
      Icon: Handshake,
    },
  ];
  const [paths, setPaths] = useState(buildPaths());

  useEffect(() => {
    setEyebrow(t("ways-eyebrow"));
    setHeading(t("ways-heading"));
    setModels(buildModels());
    setBeyondEyebrow(t("beyond-eyebrow"));
    setBeyondHeading(t("beyond-heading"));
    setPaths(buildPaths());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const updatePath = (index: number, field: string, value: string) => {
    const u = [...paths]; u[index] = { ...u[index], [field]: value }; setPaths(u);
  };

  return (
    <Section id="ways-to-work" size="lg">
      <Stack gap="xl">
        <Stack gap="lg">
          <div className="max-w-3xl mx-auto text-center space-y-sm">
            <EditableText
              id="ways-eyebrow"
              value={eyebrow}
              onChange={setEyebrow}
              as="span"
              className="block t-meta text-accent-strong"
            >
              {eyebrow}
            </EditableText>
            <EditableText
              id="ways-heading"
              value={heading}
              onChange={setHeading}
              as="h2"
              className="t-section text-primary text-balance"
            >
              {heading}
            </EditableText>
          </div>

          {/* Raw 12-col grid, not the equal-columns <Grid cols={2}>: Almedin
              asked for Guaranteed Income to carry more visual weight, since
              it is the more attractive model for most owners (no occupancy
              risk on their side) and was previously reading as equally
              matched with Full-service. Weight comes from width + a solid
              CTA button rather than a new colour or a "recommended" badge —
              nothing here is a claim about numbers, which docs/PROJECT.md
              deliberately keeps out of the site (commission range, contract
              term). `md:order-*` reorders visually without touching the
              underlying index, so `ways-model-name-0`/`-1` etc. keep meaning
              what they've always meant (0 = Full-service, 1 = Guaranteed
              Income) for anyone editing inline. */}
          <Grid>
            {models.map((model, index) => {
              const Icon = model.Icon;
              const isGuaranteed = index === 1;
              return (
                <div
                  key={index}
                  className={cn(
                    "col-span-1",
                    isGuaranteed ? "md:col-span-7 md:order-1" : "md:col-span-5 md:order-2",
                  )}
                >
                  <Panel className="h-full">
                    <Stack gap="sm">
                      <Icon className="w-7 h-7 text-accent-strong" strokeWidth={1.5} />
                      <EditableText
                        id={`ways-model-name-${index}`}
                        value={model.name}
                        onChange={(v) => { const u = [...models]; u[index] = { ...u[index], name: v }; setModels(u); }}
                        as="h3"
                        className="t-block text-primary text-balance"
                      >
                        {model.name}
                      </EditableText>

                      <EditableText
                        id={`ways-model-summary-${index}`}
                        value={model.summary}
                        onChange={(v) => { const u = [...models]; u[index] = { ...u[index], summary: v }; setModels(u); }}
                        as="p"
                        multiline
                        className="t-item text-primary"
                      >
                        {model.summary}
                      </EditableText>
                      <EditableText
                        id={`ways-model-detail-${index}`}
                        value={model.detail}
                        onChange={(v) => { const u = [...models]; u[index] = { ...u[index], detail: v }; setModels(u); }}
                        as="p"
                        multiline
                        className="t-body text-foreground/70"
                      >
                        {model.detail}
                      </EditableText>

                      {model.href && (
                        isGuaranteed ? (
                          <Button
                            asChild
                            size="lg"
                            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold px-8 py-6 text-base w-fit mt-xs"
                          >
                            <Link to={model.href}>
                              {model.linkText}
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                          </Button>
                        ) : (
                          <Link
                            to={model.href}
                            className="inline-flex items-center gap-1.5 t-meta text-accent-strong hover:gap-2.5 transition-all"
                          >
                            {model.linkText}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        )
                      )}
                    </Stack>
                  </Panel>
                </div>
              );
            })}
          </Grid>
        </Stack>

        {/* The one deliberate exception to "gold is an accent, not a
            divider" — see the file comment above. `id`/`scroll-mt-24`: the
            footer's "Beyond Management" link (docs/DECISIONS.md §32) lands
            here rather than at the top of the whole `#ways-to-work` section,
            so it opens straight on the Renovations/Investments cards
            instead of the two engagement models above them. scroll-mt-24
            matches the fixed header's own clearance everywhere else an
            anchor is used on this site. */}
        <div id="beyond-management" className="scroll-mt-24 flex items-center gap-4 max-w-3xl mx-auto w-full">
          <Divider tone="gold" className="flex-1" />
          <EditableText
            id="beyond-eyebrow"
            value={beyondEyebrow}
            onChange={setBeyondEyebrow}
            as="span"
            className="t-meta text-accent-strong shrink-0"
          >
            {beyondEyebrow}
          </EditableText>
          <Divider tone="gold" className="flex-1" />
        </div>

        <Stack gap="lg">
          <EditableText
            id="beyond-heading"
            value={beyondHeading}
            onChange={setBeyondHeading}
            as="h3"
            className="t-section text-primary text-balance text-center"
          >
            {beyondHeading}
          </EditableText>

          <Grid cols={2}>
            {paths.map((path, index) => {
              const Icon = path.Icon;
              return (
                <Panel key={index}>
                  <Icon className="w-7 h-7 text-accent-strong mb-sm" strokeWidth={1.5} />
                  <EditableText
                    id={`ways-sub-title-${index}`}
                    value={path.label}
                    onChange={(v) => updatePath(index, "label", v)}
                    as="span"
                    className="block t-meta text-accent-strong mb-2"
                  >
                    {path.label}
                  </EditableText>
                  <EditableText
                    id={`beyond-title-${index}`}
                    value={path.title}
                    onChange={(v) => updatePath(index, "title", v)}
                    as="h4"
                    className="t-block text-primary text-balance mb-2"
                  >
                    {path.title}
                  </EditableText>
                  <EditableText
                    id={`ways-sub-desc-${index}`}
                    value={path.description}
                    onChange={(v) => updatePath(index, "description", v)}
                    as="p"
                    multiline
                    className="t-body text-foreground/70 mb-sm"
                  >
                    {path.description}
                  </EditableText>

                  <Link
                    to={path.href}
                    className="inline-flex items-center gap-1.5 t-meta text-accent-strong hover:gap-2.5 transition-all"
                  >
                    {path.linkText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Panel>
              );
            })}
          </Grid>
        </Stack>
      </Stack>
    </Section>
  );
};

export default WaysToWorkTogether;
