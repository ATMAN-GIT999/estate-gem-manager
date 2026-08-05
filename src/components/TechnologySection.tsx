import { useState } from "react";
import { Cpu, Globe, MessageSquare, Wrench, LayoutDashboard, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import EditableText from "./admin/EditableText";

/**
 * "How we deliver it" — the proof block underneath the services offer, not a
 * chapter of its own. It renders as a self-contained dark panel so it can sit
 * inside the (light) services section; it used to be a full-bleed `<section>`
 * three scroll-lengths away from the services it explains.
 *
 * Two edits to the copy were deliberate:
 *  - dynamic pricing was listed here as well as in "What's Included" and in the
 *    old PropertyManagement block — three times on one page. It is now stated
 *    once, in the services list, and dropped from here.
 *  - "Zero operational errors" was an absolute claim that invites exactly one
 *    counter-example to demolish it. Softened to something defensible.
 */
const TechnologySection = () => {
  const [title, setTitle] = useState("Technology That Redefines Property Management");
  const [description, setDescription] = useState(
    "Reservations, cleaning, maintenance, pricing, guest messages and your owner reporting all run in one connected system — so nothing gets retyped between tools and nothing falls through the gaps."
  );
  const [tagline, setTagline] = useState("We don't just manage homes — we engineer high-performance assets.");
  const [aiHeading, setAiHeading] = useState("How we deliver it");

  const [features, setFeatures] = useState([
    { icon: "Globe", text: "Live market analysis against hotel and Airbnb rates" },
    { icon: "MessageSquare", text: "Automated guest messaging, in the guest's own language" },
    { icon: "Wrench", text: "Predictive maintenance alerts and optimised scheduling" },
    { icon: "LayoutDashboard", text: "Live owner dashboards, not a PDF at the end of the month" },
    { icon: "Zap", text: "Far fewer operational slips, because the routine work is automated" },
  ]);

  const iconMap: Record<string, any> = { Globe, MessageSquare, Wrench, LayoutDashboard, Zap };

  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], text: value };
    setFeatures(updated);
  };

  return (
    <div className="rounded-2xl md:rounded-3xl bg-primary text-primary-foreground p-6 md:p-10 lg:p-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-accent/20 rounded-full mb-5">
          <Cpu className="w-7 h-7 md:w-8 md:h-8 text-accent-on-primary" />
        </div>
        <EditableText
          id="tech-title"
          value={title}
          onChange={setTitle}
          as="h3"
          className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold mb-4"
        >
          {title}
        </EditableText>
        <EditableText
          id="tech-description"
          value={description}
          onChange={setDescription}
          as="p"
          multiline
          className="text-base md:text-lg text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed"
        >
          {description}
        </EditableText>
      </div>

      <div>
        <EditableText
          id="tech-ai-heading"
          value={aiHeading}
          onChange={setAiHeading}
          as="h4"
          className="text-lg font-semibold text-center mb-6 text-primary-foreground"
        >
          {aiHeading}
        </EditableText>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Zap;
            return (
              <Card
                key={index}
                className="p-5 md:p-6 bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm hover:bg-primary-foreground/15 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <EditableText
                    id={`tech-feature-${index}`}
                    value={feature.text}
                    onChange={(v) => updateFeature(index, v)}
                    as="p"
                    className="text-primary-foreground/90 text-sm md:text-base"
                  >
                    {feature.text}
                  </EditableText>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="mt-10 text-center">
        <EditableText
          id="tech-tagline"
          value={tagline}
          onChange={setTagline}
          as="p"
          className="font-playfair text-xl md:text-2xl italic text-primary-foreground"
        >
          {tagline}
        </EditableText>
      </div>
    </div>
  );
};

export default TechnologySection;
