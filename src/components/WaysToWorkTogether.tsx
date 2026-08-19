import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Handshake, Palette } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Section, Grid, Stack, Panel, Divider } from "./layout";

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
  const [eyebrow, setEyebrow] = useState("How we work together");
  const [heading, setHeading] = useState("Two ways to start to work with us.");

  const [models, setModels] = useState([
    {
      name: "Full-service management",
      summary: "We run the property and you earn what it earns.",
      detail: "Your income moves with the season, the market and how well the home performs. In a strong year you keep the upside.",
      href: "",
      linkText: "",
    },
    {
      name: "Guaranteed income",
      summary: "We lease the property from you and pay a fixed amount every month.",
      detail: "Booked or empty, the payment is the same, and we maintain the home throughout. You trade the strong months for certainty in the weak ones.",
      href: "/guaranteed-income",
      linkText: "See how it works",
    },
  ]);

  const [beyondEyebrow, setBeyondEyebrow] = useState("Beyond management");
  const [beyondHeading, setBeyondHeading] = useState("More ways we create value.");

  const [paths, setPaths] = useState([
    {
      label: "Renovations & Design",
      title: "Your property deserves a make-over before you hand it over.",
      description: "Timeless Mediterranean interiors, run start to finish, before the lease begins.",
      href: "/renovations",
      linkText: "See what we do",
      Icon: Palette,
    },
    {
      label: "Investments",
      title: "Not a homeowner here yet? We'll help you find one worth managing.",
      description: "Curated acquisitions across Spain, Austria and Croatia for owners building a portfolio.",
      href: "/investments",
      linkText: "See what we look for",
      Icon: Handshake,
    },
  ]);

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

          <Grid cols={2}>
            {models.map((model, index) => (
              <Panel key={index}>
                <Stack gap="sm">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full border border-accent-strong t-meta text-accent-strong shrink-0">
                      {index === 0 ? "A" : "B"}
                    </span>
                    <EditableText
                      id={`ways-model-name-${index}`}
                      value={model.name}
                      onChange={(v) => { const u = [...models]; u[index] = { ...u[index], name: v }; setModels(u); }}
                      as="h3"
                      className="t-block text-primary text-balance"
                    >
                      {model.name}
                    </EditableText>
                  </div>

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
                    <Link
                      to={model.href}
                      className="inline-flex items-center gap-1.5 t-meta text-accent-strong hover:gap-2.5 transition-all"
                    >
                      {model.linkText}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </Stack>
              </Panel>
            ))}
          </Grid>
        </Stack>

        {/* The one deliberate exception to "gold is an accent, not a
            divider" — see the file comment above. */}
        <div className="flex items-center gap-4 max-w-3xl mx-auto w-full">
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
