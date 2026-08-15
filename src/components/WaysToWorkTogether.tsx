import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Section, Grid, Stack } from "./layout";

/**
 * The commercial decision, stated as a decision — and set as an editorial
 * spread rather than two product cards (§20, §22). Full-service management and
 * Guaranteed Income are mutually exclusive: an owner picks one. Cards next to
 * each other say "two things you could buy"; two rows sharing one set of rules
 * says "one choice, two answers".
 *
 * What carries it is line, space and type, not surface: a gold rule opening
 * and closing the pair, a thin rule between them, the model name set at
 * section size in the left column with the terms in the right. The letter mark
 * is a mark, not a bullet — A and B are a choice, 1 and 2 would be a sequence.
 *
 * Renovations and Investments used to be their own section
 * (`BeyondManagement.tsx`, now retired). They only make sense once an owner
 * has already leased the property to Frontier under Guaranteed Income —
 * under full-service management the owner still holds the asset and
 * commissions their own renovation — so they nest under that row as secondary
 * paths (§21), visibly smaller, not a third equal offer competing with the two
 * real models.
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

  const [subLabel, setSubLabel] = useState("Also part of this path");
  const [subServices, setSubServices] = useState([
    {
      title: "Renovations & Design",
      description: "Timeless Mediterranean interiors, run start to finish, before the lease begins.",
      href: "/renovations",
    },
    {
      title: "Investments",
      description: "Curated acquisitions across Spain, Austria and Croatia for owners building a portfolio.",
      href: "/investments",
    },
  ]);

  const updateSubService = (index: number, field: string, value: string) => {
    const u = [...subServices];
    u[index] = { ...u[index], [field]: value };
    setSubServices(u);
  };

  return (
    <Section id="ways-to-work" size="lg">
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

        {/* The gold rules top and bottom bracket the pair; the thin rule
            between them separates without re-bracketing. Three weights of
            line doing three different jobs — the architectural detail §22
            asks for, rather than a border drawn around each option. */}
        <div className="divide-y divide-primary/20 border-y border-accent/55">
          {models.map((model, index) => (
            <Grid key={index} gap="sm" className="py-lg">
              <div className="md:col-span-4 flex items-start gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-accent-strong t-meta text-accent-strong shrink-0 mt-1">
                  {index === 0 ? "A" : "B"}
                </span>
                <EditableText
                  id={`ways-model-name-${index}`}
                  value={model.name}
                  onChange={(v) => { const u = [...models]; u[index] = { ...u[index], name: v }; setModels(u); }}
                  as="h3"
                  className="t-section text-primary text-balance"
                >
                  {model.name}
                </EditableText>
              </div>

              <div className="md:col-span-8 space-y-sm">
                <EditableText
                  id={`ways-model-summary-${index}`}
                  value={model.summary}
                  onChange={(v) => { const u = [...models]; u[index] = { ...u[index], summary: v }; setModels(u); }}
                  as="p"
                  multiline
                  className="t-block text-primary"
                >
                  {model.summary}
                </EditableText>
                <EditableText
                  id={`ways-model-detail-${index}`}
                  value={model.detail}
                  onChange={(v) => { const u = [...models]; u[index] = { ...u[index], detail: v }; setModels(u); }}
                  as="p"
                  multiline
                  className="t-body text-foreground/70 max-w-2xl"
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

                {/* §21 — nested under Guaranteed Income only, connected by a
                    gold rule so the subordination reads at a glance rather
                    than needing a label to explain it. */}
                {index === 1 && (
                  <div className="mt-md pl-sm border-l-2 border-accent/50 space-y-sm">
                    <EditableText id="ways-sub-label" value={subLabel} onChange={setSubLabel} as="span" className="block t-meta text-accent-strong">
                      {subLabel}
                    </EditableText>
                    {subServices.map((service, si) => (
                      <Link key={si} to={service.href} className="group block">
                        <div className="flex items-center gap-2">
                          <EditableText
                            id={`ways-sub-title-${si}`}
                            value={service.title}
                            onChange={(v) => updateSubService(si, "title", v)}
                            as="span"
                            className="t-item text-primary group-hover:text-accent-strong transition-colors"
                          >
                            {service.title}
                          </EditableText>
                          <ArrowRight className="w-3.5 h-3.5 text-accent-strong opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <EditableText
                          id={`ways-sub-desc-${si}`}
                          value={service.description}
                          onChange={(v) => updateSubService(si, "description", v)}
                          as="p"
                          className="t-body text-foreground/60"
                        >
                          {service.description}
                        </EditableText>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </Grid>
          ))}
        </div>
      </Stack>
    </Section>
  );
};

export default WaysToWorkTogether;
