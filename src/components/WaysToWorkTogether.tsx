import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import EditableText from "./admin/EditableText";

/**
 * The commercial decision, stated as a decision — and stated as two lines,
 * not two cards. Full-service management and Guaranteed Income are mutually
 * exclusive: an owner picks one. A row each, both closed off by the same
 * full-width hairline regardless of how long the name is, reads as a choice
 * between two options rather than two products on shelves next to each
 * other.
 *
 * Renovations and Investments used to be their own section
 * (`BeyondManagement.tsx`, now retired). They only make sense once an owner
 * has already leased the property to Frontier under Guaranteed Income —
 * under full-service management the owner still holds the asset and
 * commissions their own renovation — so they now nest under that row as
 * secondary paths, not a third equal offer competing with the two real
 * models.
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
    <section id="ways-to-work" className="py-24 md:py-28 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <EditableText
            id="ways-eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
            as="span"
            className="block t-meta text-accent-strong mb-4"
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

        <div className="max-w-3xl mx-auto divide-y divide-primary/20 border-y-2 border-accent/60">
          {models.map((model, index) => (
            <div key={index} className="py-10">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 mb-3">
                <div className="flex items-center gap-3">
                  {/* A small lettered mark, not a numbered list — this is a
                      choice between two paths, not a sequence. */}
                  <span className="flex items-center justify-center w-7 h-7 rounded-full border border-accent-strong t-meta text-accent-strong shrink-0">
                    {index === 0 ? "A" : "B"}
                  </span>
                  <EditableText
                    id={`ways-model-name-${index}`}
                    value={model.name}
                    onChange={(v) => { const u = [...models]; u[index] = { ...u[index], name: v }; setModels(u); }}
                    as="h3"
                    className="t-block text-primary"
                  >
                    {model.name}
                  </EditableText>
                </div>
                {model.href && (
                  <Link
                    to={model.href}
                    className="inline-flex items-center gap-1.5 t-meta text-accent-strong hover:gap-2.5 transition-all"
                  >
                    {model.linkText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
              <EditableText
                id={`ways-model-summary-${index}`}
                value={model.summary}
                onChange={(v) => { const u = [...models]; u[index] = { ...u[index], summary: v }; setModels(u); }}
                as="p"
                multiline
                className="t-body text-foreground/90 mb-2 pl-10"
              >
                {model.summary}
              </EditableText>
              <EditableText
                id={`ways-model-detail-${index}`}
                value={model.detail}
                onChange={(v) => { const u = [...models]; u[index] = { ...u[index], detail: v }; setModels(u); }}
                as="p"
                multiline
                className="t-body text-foreground/70 pl-10"
              >
                {model.detail}
              </EditableText>

              {/* Renovations & Investments — nested under Guaranteed Income
                  only, connected by a gold rule so the subordination reads
                  at a glance rather than needing a label to explain it. */}
              {index === 1 && (
                <div className="mt-8 ml-10 pl-6 border-l-2 border-accent/50">
                  <EditableText id="ways-sub-label" value={subLabel} onChange={setSubLabel} as="span" className="block t-meta text-accent-strong mb-4">
                    {subLabel}
                  </EditableText>
                  <div className="space-y-5">
                    {subServices.map((service, si) => (
                      <Link key={si} to={service.href} className="group block">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-strong shrink-0" />
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
                          className="t-body text-foreground/60 ml-3.5 mt-0.5"
                        >
                          {service.description}
                        </EditableText>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WaysToWorkTogether;
