import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, LineChart, FileBarChart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./admin/EditableText";
import { Section, Grid, Stack } from "./layout";

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
  const [heading, setHeading] = useState("We manage what the property earns.");
  const [lead, setLead] = useState("Occupancy, nightly rate and running costs — actively managed, reported to you in full.");
  const [outcomesHeading, setOutcomesHeading] = useState("What that adds up to:");
  const [ctaText, setCtaText] = useState("Calculate what your property could earn");

  const [pillars, setPillars] = useState([
    {
      icon: "TrendingUp",
      title: "Dynamic pricing",
      description: "Rates adjusted automatically, several times a day.",
    },
    {
      icon: "LineChart",
      title: "Revenue optimisation",
      description: "Priced against live hotel and Airbnb market data.",
    },
    {
      icon: "FileBarChart",
      title: "Transparent reporting",
      description: "Monthly statement, plus a live dashboard anytime.",
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
    // `size="lg"` is the one place on the page that gets the widest band of
    // air. §13 makes this the primary value proposition and §14 is explicit
    // that "We manage while you relax" underneath must not be weighted the
    // same — the difference is carried by space and by this section keeping
    // the full-width grid, rather than by making the other one smaller.
    <Section id="financial-performance" size="lg">
      <Stack gap="lg">
        <div className="max-w-3xl mx-auto text-center space-y-sm">
          <EditableText
            id="fin-eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
            as="span"
            className="block t-meta text-accent-strong"
          >
            {eyebrow}
          </EditableText>
          <EditableText
            id="fin-heading"
            value={heading}
            onChange={setHeading}
            as="h2"
            className="t-section text-primary text-balance"
          >
            {heading}
          </EditableText>
          <EditableText
            id="fin-lead"
            value={lead}
            onChange={setLead}
            as="p"
            multiline
            className="t-body text-foreground/70"
          >
            {lead}
          </EditableText>
        </div>

        <Grid cols={3}>
          {pillars.map((pillar, index) => {
            const Icon = iconMap[pillar.icon] || TrendingUp;
            return (
              <div key={index} className="border-t border-primary/15 pt-sm">
                <Icon className="w-6 h-6 text-accent-strong mb-sm" strokeWidth={1.5} />
                <EditableText
                  id={`fin-pillar-title-${index}`}
                  value={pillar.title}
                  onChange={(v) => { const u = [...pillars]; u[index] = { ...u[index], title: v }; setPillars(u); }}
                  as="h3"
                  className="t-block text-primary mb-3"
                >
                  {pillar.title}
                </EditableText>
                <EditableText
                  id={`fin-pillar-desc-${index}`}
                  value={pillar.description}
                  onChange={(v) => { const u = [...pillars]; u[index] = { ...u[index], description: v }; setPillars(u); }}
                  as="p"
                  multiline
                  className="t-body text-foreground/70"
                >
                  {pillar.description}
                </EditableText>
              </div>
            );
          })}
        </Grid>

        <div className="text-center space-y-sm">
          <EditableText
            id="fin-outcomes-heading"
            value={outcomesHeading}
            onChange={setOutcomesHeading}
            as="p"
            /* "What that adds up to:" introduces the list below it — it is a
               label, not a section heading. It used to be an <h3> at 20px,
               which put it on the same outline level as the three pillar
               titles above without being one. */
            className="t-meta text-primary"
          >
            {outcomesHeading}
          </EditableText>
          <ul className="flex flex-wrap justify-center gap-x-md gap-y-xs">
            {outcomes.map((outcome, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-accent-strong shrink-0" />
                <EditableText
                  id={`fin-outcome-${index}`}
                  value={outcome}
                  onChange={(v) => { const u = [...outcomes]; u[index] = v; setOutcomes(u); }}
                  as="span"
                  className="t-body text-foreground/80"
                >
                  {outcome}
                </EditableText>
              </li>
            ))}
          </ul>
        </div>

        {/* §13: the analysis stays on its own page. The full calculator used
            to sit inline here as a second heavy form; before that the link
            pointed at the landing page's copy of it, which sent an owner back
            onto a page written for guests. /evaluate is the one that also
            carries the consultation form underneath the result. */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant px-8"
          >
            <Link to="/evaluate">
              <EditableText id="fin-cta" value={ctaText} onChange={setCtaText} as="span">
                {ctaText}
              </EditableText>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </Stack>
    </Section>
  );
};

export default FinancialPerformance;
