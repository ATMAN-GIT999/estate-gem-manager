import { useState } from "react";
import { TrendingUp, LineChart, FileBarChart, Check } from "lucide-react";
import EditableText from "./admin/EditableText";

/**
 * The money layer, and the one thing the page never said in one place.
 *
 * Pricing sat in the listing pillar, ROI and market data in the technology
 * section, reporting in a services list, and the outcomes at the bottom of the
 * technology block — so an owner could read the whole page and never be told
 * plainly that Frontier manages the property's *earnings*, not just the
 * property. §17 of the owner brief asks for exactly this.
 *
 * Almost nothing here is new writing. The three cards and the outcome row are
 * lines that already existed elsewhere on the page, collected. What is new is
 * the heading that names what they add up to.
 */
const FinancialPerformance = () => {
  const [eyebrow, setEyebrow] = useState("Financial Performance");
  const [heading, setHeading] = useState("We don't just manage the property. We manage what it earns.");
  const [lead, setLead] = useState("Occupancy, nightly rate and running costs are the three things that decide what a home returns. All three are managed actively, and reported to you in full.");
  const [outcomesHeading, setOutcomesHeading] = useState("What that adds up to:");

  const [pillars, setPillars] = useState([
    {
      icon: "TrendingUp",
      title: "Dynamic pricing",
      description: "Rates move with location, season, demand and amenities rather than sitting still — adjusted automatically, several times a day.",
    },
    {
      icon: "LineChart",
      title: "Revenue optimisation",
      description: "Pricing decisions are made against live hotel and Airbnb market data for your area, not against last year's guesswork.",
    },
    {
      icon: "FileBarChart",
      title: "Transparent reporting",
      description: "A monthly statement of what the property earned and what it cost, plus a live dashboard you can open at any time.",
    },
  ]);

  // The outcome line that used to close the technology section. It belongs to
  // the money, not to the software.
  const [outcomes, setOutcomes] = useState([
    "Higher occupancy",
    "Better nightly rates",
    "Faster responses",
    "Zero operational gaps",
    "Increased long-term value",
  ]);

  const iconMap: Record<string, any> = { TrendingUp, LineChart, FileBarChart };

  return (
    <section id="financial-performance" className="py-20 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <EditableText
            id="fin-eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
            as="span"
            className="block text-sm font-medium uppercase tracking-widest text-accent-strong mb-4"
          >
            {eyebrow}
          </EditableText>
          <EditableText
            id="fin-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="font-playfair text-4xl md:text-5xl font-bold text-primary text-balance mb-5"
          >
            {heading}
          </EditableText>
          <EditableText
            id="fin-lead"
            value={lead}
            onChange={setLead}
            as="p"
            multiline
            className="text-lg text-foreground/70 leading-relaxed"
          >
            {lead}
          </EditableText>
        </div>

        <div className="grid md:grid-cols-3 gap-x-10 gap-y-12 max-w-5xl mx-auto mb-16">
          {pillars.map((pillar, index) => {
            const Icon = iconMap[pillar.icon] || TrendingUp;
            return (
              <div key={index} className="border-t border-primary/15 pt-6">
                <Icon className="w-6 h-6 text-accent-strong mb-4" strokeWidth={1.5} />
                <EditableText
                  id={`fin-pillar-title-${index}`}
                  value={pillar.title}
                  onChange={(v) => { const u = [...pillars]; u[index] = { ...u[index], title: v }; setPillars(u); }}
                  as="h3"
                  className="font-playfair text-xl font-bold text-primary mb-3"
                >
                  {pillar.title}
                </EditableText>
                <EditableText
                  id={`fin-pillar-desc-${index}`}
                  value={pillar.description}
                  onChange={(v) => { const u = [...pillars]; u[index] = { ...u[index], description: v }; setPillars(u); }}
                  as="p"
                  multiline
                  className="text-foreground/70 leading-relaxed"
                >
                  {pillar.description}
                </EditableText>
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <EditableText
            id="fin-outcomes-heading"
            value={outcomesHeading}
            onChange={setOutcomesHeading}
            as="h3"
            className="text-xl font-semibold text-primary mb-6"
          >
            {outcomesHeading}
          </EditableText>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {outcomes.map((outcome, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-accent-strong shrink-0" />
                <EditableText
                  id={`fin-outcome-${index}`}
                  value={outcome}
                  onChange={(v) => { const u = [...outcomes]; u[index] = v; setOutcomes(u); }}
                  as="span"
                  className="text-foreground/80 font-medium"
                >
                  {outcome}
                </EditableText>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FinancialPerformance;
