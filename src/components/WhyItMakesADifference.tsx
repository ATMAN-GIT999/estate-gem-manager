import { useState } from "react";
import { Cpu, Globe, MessageSquare, Wrench, LayoutDashboard, Users, Sparkles } from "lucide-react";
import EditableText from "./admin/EditableText";
import { Section, Grid, Stack, Divider } from "./layout";

/**
 * The differentiation chapter (§15): the one place that answers "why this
 * agency and not the one down the road".
 *
 * The hierarchy is deliberately uneven, which is the whole point of §15 — not
 * four equal cards, but one dominant block and two supporting ones:
 *
 *   Technology that refines property management   ← full width, four points
 *   ────────────────────────────┬──────────────────
 *   Guest management            │ Property care    ← one line each
 *
 * Technology sits on top because it is the actual differentiator. Guest
 * management and property care are what every agency claims, so they get a
 * label and a sentence rather than the four-card treatment they used to have
 * as their own pillars in `PropertyManagement.tsx`.
 */
const WhyItMakesADifference = () => {
  // The four lines this used to open with — "Why it makes a difference.",
  // "An AI-supported system runs the whole portfolio...", "Technology that
  // redefines property management" and "What the system actually does:" —
  // all led with the technology and asked the reader to be impressed by it.
  // None of them said what it changes for an owner.
  //
  // The chain underneath all four is: technology -> better organisation ->
  // more control -> better guest experience -> better performance -> less
  // work for the owner. Two lines now carry that: the first states the
  // owner's outcome plainly (the thing they actually want), the second names
  // the system as the mechanism and hands off to the proof below it.
  //
  // The eyebrow is what names the section's job, so the headline does not
  // have to be the literal question §15 asks for and can stay the answer.
  const [eyebrow, setEyebrow] = useState("What makes us different");
  const [heading, setHeading] = useState("Less for you to manage. More for your property to earn.");
  const [lead, setLead] = useState("One AI-run system gives us full control of your portfolio, so every guest, every price and every euro is handled before it becomes your problem — here's what runs behind it:");
  const [techHeading, setTechHeading] = useState("Technology that refines property management");

  // Four, not six. "Higher ROI through real-time dynamic pricing" and the
  // outcome list that used to close this section are results, not mechanism —
  // they live in FinancialPerformance. "Zero operational errors thanks to
  // smart automation" was an absolute nobody can stand behind.
  const [features, setFeatures] = useState([
    { icon: "Globe", text: "Market analysis using hotel & Airbnb data" },
    { icon: "MessageSquare", text: "Automated multilingual guest communication" },
    { icon: "Wrench", text: "Predictive maintenance & optimized scheduling" },
    { icon: "LayoutDashboard", text: "Full transparency with live dashboards" },
  ]);

  const [guestTitle, setGuestTitle] = useState("Guest management");
  const [guestDesc, setGuestDesc] = useState("Every enquiry, booking, arrival and complaint comes to us, not to you.");

  const [propertyTitle, setPropertyTitle] = useState("Property care");
  const [propertyDesc, setPropertyDesc] = useState("Your home is cleaned and inspected after every stay, before the next arrival.");

  const iconMap: Record<string, any> = { Globe, MessageSquare, Wrench, LayoutDashboard };

  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], text: value };
    setFeatures(updated);
  };

  return (
    <Section id="why-it-makes-a-difference" tone="primary" size="lg" edge="both">
      <Stack gap="xl">
        <div className="max-w-3xl mx-auto text-center space-y-sm">
          <Cpu className="w-7 h-7 text-accent-on-primary mx-auto" strokeWidth={1.5} />
          <EditableText id="wid-eyebrow" value={eyebrow} onChange={setEyebrow} as="span" className="block t-meta text-accent-on-primary">{eyebrow}</EditableText>
          <EditableText id="wid-heading" value={heading} onChange={setHeading} as="h2" className="t-section text-balance">{heading}</EditableText>
          <EditableText id="wid-lead" value={lead} onChange={setLead} as="p" multiline className="t-body text-primary-foreground/80">{lead}</EditableText>
        </div>

        {/* Technology — the section's main event, and the only block here that
            gets a heading of its own. */}
        <Stack gap="md">
          <EditableText id="wid-tech-heading" value={techHeading} onChange={setTechHeading} as="h3" className="t-block text-accent-on-primary">{techHeading}</EditableText>
          <Grid cols={2}>
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Globe;
              return (
                <div key={index} className="flex items-start gap-4 border-t border-primary-foreground/20 pt-sm">
                  <Icon className="w-6 h-6 text-accent-on-primary shrink-0" strokeWidth={1.5} />
                  <EditableText
                    id={`wid-feature-${index}`}
                    value={feature.text}
                    onChange={(v) => updateFeature(index, v)}
                    as="p"
                    className="t-body text-primary-foreground/90"
                  >{feature.text}</EditableText>
                </div>
              );
            })}
          </Grid>
        </Stack>

        {/* The standard-agency services, subordinate by construction: a gold
            rule sets them apart from the block above, and they run at half
            its density — a label and a sentence each. */}
        <div>
          <Divider tone="gold" onPrimary className="mb-lg" />
          <Grid cols={2}>
            <div className="flex items-start gap-4">
              <Users className="w-5 h-5 text-accent-on-primary shrink-0 mt-1" strokeWidth={1.5} />
              <div>
                <EditableText id="wid-guest-title" value={guestTitle} onChange={setGuestTitle} as="h4" className="t-item mb-1">{guestTitle}</EditableText>
                <EditableText id="wid-guest-desc" value={guestDesc} onChange={setGuestDesc} as="p" className="t-body text-primary-foreground/75">{guestDesc}</EditableText>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Sparkles className="w-5 h-5 text-accent-on-primary shrink-0 mt-1" strokeWidth={1.5} />
              <div>
                <EditableText id="wid-property-title" value={propertyTitle} onChange={setPropertyTitle} as="h4" className="t-item mb-1">{propertyTitle}</EditableText>
                <EditableText id="wid-property-desc" value={propertyDesc} onChange={setPropertyDesc} as="p" className="t-body text-primary-foreground/75">{propertyDesc}</EditableText>
              </div>
            </div>
          </Grid>
        </div>
      </Stack>
    </Section>
  );
};

export default WhyItMakesADifference;
