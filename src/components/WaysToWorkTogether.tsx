import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Percent, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import EditableText from "./admin/EditableText";

/**
 * The commercial decision, stated as a decision.
 *
 * Guaranteed Income used to sit inside the Property Management block under an
 * "Included" badge, which described it wrongly: it is not part of the management
 * service, it is the alternative to it. Under full-service management Frontier
 * runs the property and earns a share; under Guaranteed Income Frontier leases
 * the property and pays fixed rent. An owner picks one.
 *
 * Both cards name the trade-off. An offer with no visible cost reads as either
 * too good to be true or evasive, and the reader here is deciding what to do
 * with an asset worth more than most people's savings.
 */
const WaysToWorkTogether = () => {
  const [eyebrow, setEyebrow] = useState("How we work together");
  const [heading, setHeading] = useState("Two ways to work with us.");

  const [models, setModels] = useState([
    {
      icon: "Percent",
      name: "Full-service management",
      summary: "We run the property and you earn what it earns.",
      detail: "Your income moves with the season, the market and how well the home performs. In a strong year you keep the upside.",
      href: "",
      linkText: "",
    },
    {
      icon: "Wallet",
      name: "Guaranteed Income",
      summary: "We lease the property from you and pay a fixed amount every month.",
      detail: "Booked or empty, the payment is the same, and we maintain the home throughout. You trade the strong months for certainty in the weak ones.",
      href: "/guaranteed-income",
      linkText: "See how it works",
    },
  ]);

  const [beyondHeading, setBeyondHeading] = useState("Beyond management");

  const [beyond, setBeyond] = useState([
    {
      title: "Renovations & Design",
      description: "Timeless Mediterranean interiors designed to elevate your home's value and rental performance. We manage the full process: concept → construction → delivery → staging.",
      href: "/renovations",
    },
    {
      title: "Investments",
      description: "Curated real estate investments across Spain and Austria. We guide investors from acquisition to renovation and turnkey operations.",
      href: "/investments",
    },
  ]);

  const iconMap: Record<string, any> = { Percent, Wallet };

  return (
    <section id="ways-to-work" className="py-20 bg-gradient-hero scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <EditableText
            id="ways-eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
            as="span"
            className="block text-sm font-medium uppercase tracking-widest text-accent-strong mb-4"
          >
            {eyebrow}
          </EditableText>
          <EditableText
            id="ways-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="font-playfair text-4xl md:text-5xl font-bold text-primary text-balance"
          >
            {heading}
          </EditableText>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          {models.map((model, index) => {
            const Icon = iconMap[model.icon] || Percent;
            return (
              <Card key={index} className="p-8 bg-card border-border shadow-elegant flex flex-col">
                <Icon className="w-10 h-10 text-accent-strong mb-5" />
                <EditableText
                  id={`ways-model-name-${index}`}
                  value={model.name}
                  onChange={(v) => { const u = [...models]; u[index] = { ...u[index], name: v }; setModels(u); }}
                  as="h3"
                  className="font-playfair text-2xl font-bold text-primary mb-3"
                >
                  {model.name}
                </EditableText>
                <EditableText
                  id={`ways-model-summary-${index}`}
                  value={model.summary}
                  onChange={(v) => { const u = [...models]; u[index] = { ...u[index], summary: v }; setModels(u); }}
                  as="p"
                  multiline
                  className="text-lg text-foreground/90 font-medium mb-3"
                >
                  {model.summary}
                </EditableText>
                <EditableText
                  id={`ways-model-detail-${index}`}
                  value={model.detail}
                  onChange={(v) => { const u = [...models]; u[index] = { ...u[index], detail: v }; setModels(u); }}
                  as="p"
                  multiline
                  className="text-foreground/70 leading-relaxed flex-grow"
                >
                  {model.detail}
                </EditableText>
                {model.href && (
                  <Link
                    to={model.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-strong hover:gap-2.5 transition-all mt-5"
                  >
                    {model.linkText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </Card>
            );
          })}
        </div>

        <div className="max-w-5xl mx-auto">
          <EditableText
            id="ways-beyond-heading"
            value={beyondHeading}
            onChange={setBeyondHeading}
            as="h3"
            className="font-playfair text-2xl font-bold text-primary text-center mb-8"
          >
            {beyondHeading}
          </EditableText>
          <div className="grid md:grid-cols-2 gap-6">
            {beyond.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="group block p-6 rounded-lg border border-border bg-card/60 hover:bg-card hover:shadow-elegant transition-all"
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <EditableText
                    id={`ways-beyond-title-${index}`}
                    value={item.title}
                    onChange={(v) => { const u = [...beyond]; u[index] = { ...u[index], title: v }; setBeyond(u); }}
                    as="h4"
                    className="font-playfair text-xl font-bold text-primary"
                  >
                    {item.title}
                  </EditableText>
                  <ArrowRight className="w-5 h-5 text-accent-strong shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
                <EditableText
                  id={`ways-beyond-desc-${index}`}
                  value={item.description}
                  onChange={(v) => { const u = [...beyond]; u[index] = { ...u[index], description: v }; setBeyond(u); }}
                  as="p"
                  multiline
                  className="text-sm text-foreground/70 leading-relaxed"
                >
                  {item.description}
                </EditableText>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaysToWorkTogether;
