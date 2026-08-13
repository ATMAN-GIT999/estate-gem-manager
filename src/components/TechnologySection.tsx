import { useState } from "react";
import { Cpu, Globe, MessageSquare, Wrench, LayoutDashboard } from "lucide-react";
import EditableText from "./admin/EditableText";

const TechnologySection = () => {
  const [title, setTitle] = useState("Technology That Redefines Property Management");
  const [description, setDescription] = useState(
    "Frontier Residences operates with a fully integrated 360º software ecosystem connecting reservations, cleaning, maintenance, pricing, guest communications, and owner reporting into one seamless platform."
  );
  const [aiHeading, setAiHeading] = useState("What the system actually does:");

  // Four, not six. "Higher ROI through real-time dynamic pricing" and the
  // outcome list that used to close this section are results, not mechanism —
  // they moved to FinancialPerformance. "Zero operational errors thanks to
  // smart automation" was an absolute nobody can stand behind.
  const [features, setFeatures] = useState([
    { icon: "Globe", text: "Market analysis using hotel & Airbnb data" },
    { icon: "MessageSquare", text: "Automated multilingual guest communication" },
    { icon: "Wrench", text: "Predictive maintenance & optimized scheduling" },
    { icon: "LayoutDashboard", text: "Full transparency with live dashboards" },
  ]);

  const iconMap: Record<string, any> = { Globe, MessageSquare, Wrench, LayoutDashboard };

  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], text: value };
    setFeatures(updated);
  };

  return (
    <section className="py-24 md:py-28 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Cpu className="w-8 h-8 text-accent-on-primary mx-auto mb-6" strokeWidth={1.5} />
            <EditableText id="tech-title" value={title} onChange={setTitle} as="h2" className="t-section mb-6 text-balance">{title}</EditableText>
            <EditableText id="tech-description" value={description} onChange={setDescription} as="p" multiline className="t-body text-primary-foreground/70 max-w-3xl mx-auto">{description}</EditableText>
          </div>

          <div>
            {/* "What the system actually does:" is a lead-in to the list, not a
                heading. As an <h3> at 14px it was the smallest heading on the
                page — below body size — while every other h3 was 20-36px. */}
            <EditableText id="tech-ai-heading" value={aiHeading} onChange={setAiHeading} as="p" className="t-meta text-accent-on-primary text-center mb-10">{aiHeading}</EditableText>
            {/* Hairlines on the green, same as the light sections. The four
                capabilities were in translucent panels with a rounded tile
                behind each icon — a box inside a box, on a band that was
                already a box. */}
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {features.map((feature, index) => {
                const Icon = iconMap[feature.icon] || Globe;
                return (
                  <div key={index} className="flex items-start gap-4 border-t border-primary-foreground/20 pt-6">
                    <Icon className="w-6 h-6 text-accent-on-primary shrink-0" strokeWidth={1.5} />
                    <EditableText
                      id={`tech-feature-${index}`}
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

        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
