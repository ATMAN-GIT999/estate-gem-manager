import { useState } from "react";
import { Cpu, Globe, MessageSquare, Wrench, LayoutDashboard, Users, Sparkles } from "lucide-react";
import EditableText from "./admin/EditableText";

/**
 * The section built to make Frontier's operating system the headline, not a
 * footnote. Technology sits full-width at the top because it is the actual
 * differentiator — an AI-supported system that gives full visibility across
 * the whole portfolio. Guest management and property care are standard
 * agency services, so they sit underneath, reduced to one line each rather
 * than repeating the four-card pattern they used to have as their own
 * pillars in `PropertyManagement.tsx`.
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
  const [heading, setHeading] = useState("Less for you to manage. More for your property to earn.");
  const [lead, setLead] = useState("One AI-run system gives us full control of your portfolio, so every guest, every price and every euro is handled before it becomes your problem — here's what runs behind it:");

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
    <section id="why-it-makes-a-difference" className="py-24 md:py-28 bg-primary text-primary-foreground border-y-2 border-accent scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Cpu className="w-7 h-7 text-accent-on-primary mx-auto mb-5" strokeWidth={1.5} />
          <EditableText id="wid-heading" value={heading} onChange={setHeading} as="h2" className="t-section mb-5 text-balance">{heading}</EditableText>
          <EditableText id="wid-lead" value={lead} onChange={setLead} as="p" multiline className="t-body text-primary-foreground/80 max-w-2xl mx-auto">{lead}</EditableText>
        </div>

        {/* Technology — full width, top, the section's main event. */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Globe;
              return (
                <div key={index} className="flex items-start gap-4 border-t border-primary-foreground/20 pt-6">
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
          </div>
        </div>

        {/* Guest management & property care — the standard-agency services,
            reduced to a label and a sentence, sitting under the technology
            that runs them. */}
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-x-12 gap-y-8 border-t border-primary-foreground/20 pt-10">
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
        </div>
      </div>
    </section>
  );
};

export default WhyItMakesADifference;
